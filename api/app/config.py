"""Runtime configuration for the inference API, sourced from env vars with sane defaults."""

import os
from pathlib import Path

API_DIR = Path(__file__).resolve().parent.parent
REPO_ROOT = API_DIR.parent

MODEL_ID = "gemma-4-e4b-it"
MODEL_NAME = "Gemma 4 E4B"

MODEL_PATH = os.environ.get(
    "MODEL_PATH",
    str(REPO_ROOT / "models" / "gemma-4-E4B-it.litertlm"),
)

HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", "8000"))

# "cpu" | "gpu" | "npu" — when set, skips GPU auto-detect and forces this backend.
LITERT_BACKEND = os.environ.get("LITERT_BACKEND", "").strip().lower() or None

DEFAULT_MAX_OUTPUT_TOKENS = int(os.environ.get("DEFAULT_MAX_OUTPUT_TOKENS", "1024"))

CORS_ORIGINS = [
    origin.strip()
    for origin in os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

KNOWLEDGE_MAX_UPLOAD_MB = int(os.environ.get("KNOWLEDGE_MAX_UPLOAD_MB", "30"))
KNOWLEDGE_MAX_UPLOAD_BYTES = KNOWLEDGE_MAX_UPLOAD_MB * 1024 * 1024

# Hard cap on sections/concepts extracted from a single document; overflow sections
# are merged into the last one so a huge/heading-heavy PDF can't spawn hundreds of
# sequential LLM calls.
KNOWLEDGE_MAX_CONCEPTS_PER_DOCUMENT = int(os.environ.get("KNOWLEDGE_MAX_CONCEPTS_PER_DOCUMENT", "40"))

# Truncation length for the text sent to the classifier prompt only — the full,
# untruncated section text is still what gets persisted as the concept body.
KNOWLEDGE_SECTION_PROMPT_CHARS = int(os.environ.get("KNOWLEDGE_SECTION_PROMPT_CHARS", "3000"))
