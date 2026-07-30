"""LiteRT-LM engine lifecycle, backend auto-detection, and message translation."""

from __future__ import annotations

import asyncio
import logging
from pathlib import Path
from typing import Any, Callable

import litert_lm
from litert_lm.tools import tool_from_function

from . import config

logger = logging.getLogger("inference_api.engine")

# OpenAI role -> LiteRT-LM Role.value. LiteRT-LM has no "assistant" role — it calls it "model".
_ROLE_TO_LITERT = {"system": "system", "user": "user", "assistant": "model", "tool": "tool"}

_BACKEND_FACTORIES = {
    "cpu": litert_lm.Backend.CPU,
    "gpu": litert_lm.Backend.GPU,
    "npu": litert_lm.Backend.NPU,
}


class EngineUnavailableError(RuntimeError):
    """Raised when the LiteRT-LM engine could not be loaded on any backend."""


class EngineState:
    """Holds the single loaded Engine instance and serializes access to it."""

    def __init__(self) -> None:
        self.engine: litert_lm.Engine | None = None
        self.backend_name: str | None = None
        self.load_error: str | None = None
        self.lock = asyncio.Lock()

    def load(self) -> None:
        model_path = Path(config.MODEL_PATH)
        if not model_path.is_file():
            self.load_error = f"Model file not found: {model_path}"
            raise EngineUnavailableError(self.load_error)

        if config.LITERT_BACKEND:
            factory = _BACKEND_FACTORIES.get(config.LITERT_BACKEND)
            if factory is None:
                self.load_error = f"Unknown LITERT_BACKEND: {config.LITERT_BACKEND}"
                raise EngineUnavailableError(self.load_error)
            logger.info("Loading LiteRT-LM engine on forced backend=%s", config.LITERT_BACKEND)
            self.engine = litert_lm.Engine(str(model_path), backend=factory())
            self.backend_name = config.LITERT_BACKEND
            return

        try:
            logger.info("Probing GPU backend for LiteRT-LM engine...")
            self.engine = litert_lm.Engine(str(model_path), backend=litert_lm.Backend.GPU())
            self.backend_name = "gpu"
            logger.info("LiteRT-LM engine loaded on GPU backend.")
            return
        except Exception as exc:  # noqa: BLE001 - any backend init failure should fall back
            logger.warning("GPU backend unavailable (%s); falling back to CPU.", exc)

        try:
            self.engine = litert_lm.Engine(str(model_path), backend=litert_lm.Backend.CPU())
            self.backend_name = "cpu"
            logger.info("LiteRT-LM engine loaded on CPU backend.")
        except Exception as exc:  # noqa: BLE001
            self.load_error = f"Failed to load engine on CPU or GPU: {exc}"
            raise EngineUnavailableError(self.load_error) from exc

    def close(self) -> None:
        if self.engine is not None:
            self.engine.close()
            self.engine = None


def _content_to_text(content: Any) -> str:
    """OpenAI message content can be a plain string or a list of typed parts."""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for part in content:
            if isinstance(part, dict) and part.get("type") == "text":
                parts.append(part.get("text", ""))
        return "".join(parts)
    return "" if content is None else str(content)


def split_messages(messages: list[dict]) -> tuple[str | None, list[dict], str]:
    """Splits OpenAI-style messages into (system_message, history, last_user_text).

    Raises ValueError on malformed input (empty list, or last message not from the user).
    """
    if not messages:
        raise ValueError("messages must not be empty")

    system_parts: list[str] = []
    non_system: list[dict] = []
    for m in messages:
        role = m.get("role")
        if role not in _ROLE_TO_LITERT:
            raise ValueError(f"unsupported message role: {role!r}")
        text = _content_to_text(m.get("content"))
        if role == "system":
            system_parts.append(text)
        else:
            non_system.append({"role": role, "content": text})

    if not non_system:
        raise ValueError("messages must include at least one non-system message")

    last = non_system[-1]
    if last["role"] != "user":
        raise ValueError("the last message must have role 'user'")

    history = [
        {"role": _ROLE_TO_LITERT.get(m["role"], m["role"]), "content": m["content"]}
        for m in non_system[:-1]
    ]
    system_message = "\n".join(p for p in system_parts if p) or None
    return system_message, history, last["content"]


# Single shared engine instance for the whole process. Lives here (not in main.py)
# so other modules — e.g. routers/knowledge.py — can reuse it without importing
# main.py (which would create a circular import: main imports the knowledge router).
engine_state = EngineState()


def _extract_text(response_dict: dict) -> str:
    parts = []
    for item in response_dict.get("content", []) or []:
        if isinstance(item, dict) and item.get("type") == "text":
            parts.append(item.get("text", ""))
    return "".join(parts)


def _first_tool_call_arguments(response_dict: dict) -> dict[str, Any] | None:
    """Pulls the arguments dict out of the first tool call in a response, if any.

    Response shape confirmed empirically against this app's bundled model:
    {"role": "assistant", "tool_calls": [{"type": "function",
     "function": {"name": ..., "arguments": {...}}}]}
    """
    tool_calls = response_dict.get("tool_calls") or []
    if not tool_calls:
        return None
    function = tool_calls[0].get("function") or {}
    arguments = function.get("arguments")
    return arguments if isinstance(arguments, dict) else None


def generate_with_tool(
    system_message: str, user_text: str, tool_fn: Callable[..., Any], *, max_output_tokens: int
) -> dict[str, Any] | None:
    """Runs one constrained-decoding tool call, returning its arguments dict or None.

    Never raises: the model may not support tool calling/constrained decoding on
    every backend, and the caller (per-section concept classification) must be
    able to fall back to heading-derived defaults for that one section without
    aborting the whole extraction.
    """
    if engine_state.engine is None:
        return None
    try:
        conversation = engine_state.engine.create_conversation(
            system_message=system_message,
            tools=[tool_from_function(tool_fn)],
            automatic_tool_calling=False,
            enable_constrained_decoding=True,
            max_output_tokens=max_output_tokens,
        )
        try:
            response = conversation.send_message(user_text)
        finally:
            conversation.close()
        return _first_tool_call_arguments(response)
    except Exception:  # noqa: BLE001 - tool-calling support is best-effort, never fatal
        logger.exception("generate_with_tool failed")
        return None


def generate_text(system_message: str, user_text: str, *, max_output_tokens: int) -> str | None:
    """Plain-text (non-tool) completion. Returns None on any failure instead of raising."""
    if engine_state.engine is None:
        return None
    try:
        conversation = engine_state.engine.create_conversation(
            system_message=system_message,
            max_output_tokens=max_output_tokens,
        )
        try:
            response = conversation.send_message(user_text)
        finally:
            conversation.close()
        return _extract_text(response)
    except Exception:  # noqa: BLE001 - relation extraction is best-effort, never fatal
        logger.exception("generate_text failed")
        return None
