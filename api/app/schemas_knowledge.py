"""Pydantic models for the PDF-parsing SSE contract shared with the Next.js relay layer."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict


class KnowledgeParseMeta(BaseModel):
    model_config = ConfigDict(extra="ignore")

    char_count: int
    producer: str = "edgeparse"


class KnowledgeProgress(BaseModel):
    model_config = ConfigDict(extra="ignore")

    current: int
    total: int


class ExtractedConcept(BaseModel):
    model_config = ConfigDict(extra="ignore")

    index: int
    type: str
    title: str
    description: str
    tags: list[str] = []
    heading: str | None = None
    body: str


class KnowledgeProgressEvent(BaseModel):
    """SSE envelope. Next.js relays these verbatim, then appends its own
    assembling/writing/done events using the same `stage`/`message` shape."""

    model_config = ConfigDict(extra="ignore")

    stage: Literal[
        "received",
        "parsing",
        "parsed",
        "segmenting",
        "classifying",
        "linking",
        "degraded",
        "extracted",
        "error",
    ]
    message: str
    filename: str | None = None
    size_bytes: int | None = None
    markdown: str | None = None
    meta: KnowledgeParseMeta | None = None
    progress: KnowledgeProgress | None = None
    concepts: list[ExtractedConcept] | None = None
    relations: list[list[int]] | None = None
    code: str | None = None
