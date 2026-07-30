"""Stateless PDF-parsing endpoint for the Knowledge Base feature.

This router only extracts text (via EdgeParse) and streams progress back over
SSE. It never touches Postgres or the `static/` directory — OKF assembly and
file writes live entirely on the Next.js side, which is the only place that
already owns persistence in this app.
"""

from __future__ import annotations

import asyncio
import logging
import os
import tempfile
import threading
from typing import AsyncIterator

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

from .. import config
from ..schemas_knowledge import KnowledgeParseMeta, KnowledgeProgressEvent

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

        yield _sse(
            KnowledgeProgressEvent(
                stage="parsed",
                message="Extraction complete",
                markdown=result,
                meta=KnowledgeParseMeta(char_count=len(result)),
            )
        )


def _friendly_error(exc: Exception) -> str:
    if str(exc) == "EMPTY_EXTRACTION":
        return "No readable text was extracted (the PDF may be scanned/image-only or empty)."
    text = str(exc).lower()
    if "password" in text or "encrypt" in text or "decrypt" in text:
        return "This PDF is password-protected/encrypted and can't be parsed."
    return f"Failed to parse PDF: {exc}"
