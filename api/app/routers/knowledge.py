"""PDF-parsing + concept-extraction endpoint for the Knowledge Base feature.

This router extracts text (via EdgeParse), splits it into sections, and uses
the shared LiteRT-LM engine (constrained-decoding tool calls) to classify each
section into an OKF concept and propose relationships between them. It never
touches Postgres or the `static/` directory — OKF assembly and file writes
live entirely on the Next.js side, which is the only place that already owns
persistence in this app.
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import re
import tempfile
import threading
from typing import Any, AsyncIterator

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from starlette.concurrency import run_in_threadpool

from .. import config
from ..engine import engine_state, generate_text, generate_with_tool
from ..schemas_knowledge import (
    ExtractedConcept,
    KnowledgeParseMeta,
    KnowledgeProgress,
    KnowledgeProgressEvent,
)

logger = logging.getLogger("inference_api.knowledge")
router = APIRouter(prefix="/v1/knowledge", tags=["knowledge"])

# EdgeParse is CPU/memory heavy; on a personal single-container box, unbounded
# concurrent parses risk resource exhaustion. Serialize with a lock, mirroring
# EngineState.lock — a second concurrent upload's SSE stream just starts a
# beat later (backpressure), it is never dropped or rejected.
_parse_lock = asyncio.Lock()

_READ_CHUNK_SIZE = 1024 * 1024


def _sse(event: KnowledgeProgressEvent) -> str:
    return f"data: {event.model_dump_json(exclude_none=True)}\n\n"


@router.post("/parse")
async def parse_pdf(file: UploadFile = File(...)) -> StreamingResponse:
    filename = file.filename or "upload.pdf"
    ext = ("." + filename.rsplit(".", 1)[-1].lower()) if "." in filename else ""
    if file.content_type != "application/pdf" and ext != ".pdf":
        raise HTTPException(400, detail=f"Unsupported file type: {file.content_type or ext or 'unknown'}")

    # Stream-read with a running byte count so we never trust the (spoofable)
    # Content-Length header, and abort before wasting CPU on an oversized file.
    chunks: list[bytes] = []
    total = 0
    while chunk := await file.read(_READ_CHUNK_SIZE):
        total += len(chunk)
        if total > config.KNOWLEDGE_MAX_UPLOAD_BYTES:
            raise HTTPException(413, detail=f"File exceeds {config.KNOWLEDGE_MAX_UPLOAD_MB}MB limit")
        chunks.append(chunk)
    data = b"".join(chunks)
    if total == 0:
        raise HTTPException(400, detail="Uploaded file is empty")

    return StreamingResponse(_parse_stream(filename, data), media_type="text/event-stream")


async def _parse_stream(filename: str, data: bytes) -> AsyncIterator[str]:
    yield _sse(
        KnowledgeProgressEvent(
            stage="received",
            message=f"Received {filename} ({len(data)} bytes)",
            filename=filename,
            size_bytes=len(data),
        )
    )

    async with _parse_lock:
        yield _sse(KnowledgeProgressEvent(stage="parsing", message="Extracting text with EdgeParse..."))

        loop = asyncio.get_running_loop()
        result_queue: asyncio.Queue = asyncio.Queue()

        def worker() -> None:
            tmp_path: str | None = None
            try:
                import edgeparse

                with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
                    tmp.write(data)
                    tmp_path = tmp.name
                # File handle closed above before EdgeParse (re)opens the path — required on Windows.
                markdown = edgeparse.convert(tmp_path, format="markdown")
                if not markdown or not markdown.strip():
                    raise ValueError("EMPTY_EXTRACTION")
                loop.call_soon_threadsafe(result_queue.put_nowait, markdown)
            except Exception as exc:  # noqa: BLE001 — never let EdgeParse raise into a 500
                loop.call_soon_threadsafe(result_queue.put_nowait, exc)
            finally:
                if tmp_path:
                    try:
                        os.unlink(tmp_path)
                    except OSError:
                        pass

        thread = threading.Thread(target=worker, daemon=True)
        thread.start()
        result = await result_queue.get()
        thread.join(timeout=5)

        if isinstance(result, Exception):
            logger.exception("EdgeParse failed for %s", filename, exc_info=result)
            yield _sse(KnowledgeProgressEvent(stage="error", message=_friendly_error(result), code="parse_failed"))
            return

        markdown: str = result
        yield _sse(
            KnowledgeProgressEvent(
                stage="parsed",
                message="Extraction complete",
                markdown=markdown,
                meta=KnowledgeParseMeta(char_count=len(markdown)),
            )
        )

    # EdgeParse's lock is released above; from here every LLM call independently
    # acquires engine_state.lock so a concurrent chat request can interleave
    # between sections instead of queuing behind the whole extraction.
    yield _sse(KnowledgeProgressEvent(stage="segmenting", message="Splitting document into sections..."))
    sections = _split_sections(markdown)

    if engine_state.engine is None:
        yield _sse(
            KnowledgeProgressEvent(
                stage="degraded",
                message="Local model unavailable — saving as a single document instead of a knowledge graph.",
            )
        )
        fallback = ExtractedConcept(
            index=0,
            type="Document",
            title=filename.rsplit(".", 1)[0],
            description="Ingested PDF document (concept extraction unavailable).",
            tags=[],
            heading=None,
            body=markdown,
        )
        yield _sse(
            KnowledgeProgressEvent(
                stage="extracted", message="Extraction complete", concepts=[fallback], relations=[]
            )
        )
        return

    total = len(sections)
    classified: list[dict[str, Any]] = []
    for i, section in enumerate(sections):
        yield _sse(
            KnowledgeProgressEvent(
                stage="classifying",
                message=f"Classifying concept {i + 1}/{total}",
                progress=KnowledgeProgress(current=i + 1, total=total),
            )
        )
        async with engine_state.lock:
            result = await run_in_threadpool(_classify_section, section)
        classified.append(result)

    # Concepts the classifier marked as boilerplate/administrative are dropped
    # here, before relation extraction assigns indices — filtering after would
    # require remapping [i, j] pairs onto a shrunk list. `or classified` covers
    # the degenerate case where every section gets marked Skip: better to keep
    # an over-inclusive result than emit an empty knowledge base.
    kept = [c for c in classified if c["type"].strip().lower() != "skip"] or classified

    yield _sse(KnowledgeProgressEvent(stage="linking", message="Finding relationships between concepts..."))
    async with engine_state.lock:
        relations = await run_in_threadpool(_extract_relations, kept)

    concepts = [ExtractedConcept(index=i, **c) for i, c in enumerate(kept)]
    yield _sse(
        KnowledgeProgressEvent(
            stage="extracted",
            message=f"Extracted {len(concepts)} concept(s)",
            concepts=concepts,
            relations=relations,
        )
    )


def _friendly_error(exc: Exception) -> str:
    if str(exc) == "EMPTY_EXTRACTION":
        return "No readable text was extracted (the PDF may be scanned/image-only or empty)."
    text = str(exc).lower()
    if "password" in text or "encrypt" in text or "decrypt" in text:
        return "This PDF is password-protected/encrypted and can't be parsed."
    return f"Failed to parse PDF: {exc}"


_HEADING_RE = re.compile(r"^(#{1,3})[ \t]+(.+)$", re.MULTILINE)


def _split_sections(markdown: str) -> list[dict[str, Any]]:
    """Splits markdown into heading-delimited sections.

    Falls back to treating the whole document as one section when there are
    fewer than 2 headings — still routed through classification below so even
    single-concept docs get a real LLM-derived type/description/tags instead
    of a hardcoded one.
    """
    matches = list(_HEADING_RE.finditer(markdown))
    if len(matches) < 2:
        return [{"heading": None, "body": markdown.strip()}]

    sections: list[dict[str, Any]] = []
    for i, m in enumerate(matches):
        start = m.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(markdown)
        body = markdown[start:end].strip()
        content = body.split("\n", 1)[1].strip() if "\n" in body else ""
        if len(content) < config.KNOWLEDGE_MIN_SECTION_CHARS:
            continue
        sections.append({"heading": m.group(2).strip(), "body": body})

    if not sections:
        return [{"heading": None, "body": markdown.strip()}]

    max_concepts = config.KNOWLEDGE_MAX_CONCEPTS_PER_DOCUMENT
    if len(sections) > max_concepts:
        head, tail = sections[: max_concepts - 1], sections[max_concepts - 1 :]
        merged = {"heading": tail[0]["heading"], "body": "\n\n".join(s["body"] for s in tail)}
        sections = head + [merged]
    return sections


def _record_concept(type: str, title: str, description: str, tags: list[str]) -> None:
    """Records one extracted knowledge concept.
    Args:
      type: Short concept kind, e.g. Definition, Procedure, Topic, Table, Reference.
        Use "Skip" if this section is boilerplate or administrative rather than a
        real concept — e.g. page headers/footers, credits, personnel or staff
        listings, printing/ISBN/publisher info, anthem or song lyrics, cover-page
        labels, or a generic module/term label with no substantive content.
      title: Short human-readable title for this concept.
      description: One-sentence summary.
      tags: Up to 5 short topical tags.
    """


def _classify_section(section: dict[str, Any]) -> dict[str, Any]:
    heading = section["heading"]
    body = section["body"]
    fallback_title = heading or "Untitled section"
    system = (
        "You extract one knowledge concept from a section of a document for a "
        "personal knowledge base. Call record_concept with your answer. If this "
        'section is boilerplate or administrative rather than a real concept — '
        "e.g. page headers/footers, credits, personnel or staff listings, "
        "printing/ISBN/publisher info, anthem or song lyrics, cover-page labels, "
        'or a generic module/term label with no substantive content — set type '
        'to exactly "Skip".'
    )
    prompt_text = body[: config.KNOWLEDGE_SECTION_PROMPT_CHARS]
    args = generate_with_tool(system, prompt_text, _record_concept, max_output_tokens=256) or {}

    tags = args.get("tags")
    return {
        "type": (str(args.get("type") or "Section").strip() or "Section"),
        "title": (str(args.get("title") or fallback_title).strip() or fallback_title),
        "description": (str(args.get("description") or body[:150]).strip()),
        "tags": [str(t) for t in tags] if isinstance(tags, list) else [],
        "heading": heading,
        "body": body,
    }


_ARRAY_RE = re.compile(r"\[.*\]", re.DOTALL)


def _extract_relations(concepts: list[dict[str, Any]]) -> list[list[int]]:
    if len(concepts) < 2:
        return []
    listing = "\n".join(f"{i}. {c['title']} — {c['description']}" for i, c in enumerate(concepts))
    system = (
        "Given a numbered list of knowledge concepts from the same document, reply "
        "with ONLY a JSON array of [i, j] index pairs for concepts that are "
        "meaningfully related to each other. No prose, no markdown fences. If none "
        "are related, reply with []."
    )
    text = generate_text(system, listing, max_output_tokens=300)
    if not text:
        return []
    return _parse_relations(text, len(concepts))


def _parse_relations(text: str, count: int) -> list[list[int]]:
    match = _ARRAY_RE.search(text)
    if not match:
        return []
    try:
        data = json.loads(match.group(0))
    except (json.JSONDecodeError, ValueError):
        return []
    if not isinstance(data, list):
        return []

    pairs: list[list[int]] = []
    for item in data:
        if (
            isinstance(item, list)
            and len(item) == 2
            and all(isinstance(x, int) for x in item)
            and all(0 <= x < count for x in item)
            and item[0] != item[1]
        ):
            pairs.append([item[0], item[1]])
    return pairs
