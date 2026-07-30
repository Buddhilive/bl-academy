"""FastAPI app exposing an OpenAI-compatible Chat Completions API backed by LiteRT-LM."""

from __future__ import annotations

import asyncio
import logging
import threading
import time
import uuid
from contextlib import asynccontextmanager
from typing import AsyncIterator

import litert_lm
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import ValidationError
from starlette.concurrency import run_in_threadpool

from . import config
from .engine import EngineState, EngineUnavailableError, split_messages
from .routers.knowledge import router as knowledge_router
from .schemas import (
    ChatCompletionChoice,
    ChatCompletionChunk,
    ChatCompletionChunkChoice,
    ChatCompletionChunkDelta,
    ChatCompletionMessage,
    ChatCompletionRequest,
    ChatCompletionResponse,
    ErrorDetail,
    ErrorResponse,
    ModelList,
    ModelObject,
    Usage,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("inference_api.main")

engine_state = EngineState()


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await run_in_threadpool(engine_state.load)
    except EngineUnavailableError as exc:
        # Logged and swallowed on purpose: the server still starts so /health and
        # every route can report a clear 503 instead of the process crashing outright.
        logger.error("Engine failed to load: %s", exc)
    yield
    engine_state.close()


app = FastAPI(title="Buddhi Inference API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(knowledge_router)


def _error(status_code: int, message: str, error_type: str, code: str | None = None) -> JSONResponse:
    body = ErrorResponse(error=ErrorDetail(message=message, type=error_type, code=code))
    return JSONResponse(status_code=status_code, content=body.model_dump(exclude_none=True))


@app.get("/health")
async def health():
    if engine_state.engine is None:
        return JSONResponse(
            status_code=503,
            content={"status": "error", "detail": engine_state.load_error or "engine not loaded"},
        )
    return {"status": "ok", "model": config.MODEL_ID, "backend": engine_state.backend_name}


@app.get("/v1/models")
async def list_models():
    if engine_state.engine is None:
        return _error(503, engine_state.load_error or "engine not loaded", "server_error", "engine_unavailable")
    return ModelList(data=[ModelObject(id=config.MODEL_ID, created=int(time.time()))])


def _extract_text(response_dict: dict) -> str:
    parts = []
    for item in response_dict.get("content", []) or []:
        if isinstance(item, dict) and item.get("type") == "text":
            parts.append(item.get("text", ""))
    return "".join(parts)


def _safe_token_count(conversation) -> int | None:
    try:
        return conversation.token_count
    except Exception:  # noqa: BLE001 - usage accounting is best-effort, never fatal
        return None


def _build_sampler_config(chat_request: ChatCompletionRequest):
    if chat_request.temperature is None and chat_request.top_p is None:
        return None
    return litert_lm.SamplerConfig(temperature=chat_request.temperature, top_p=chat_request.top_p)


def _generate_sync(system_message, history, last_user_text, sampler_config, max_output_tokens):
    conversation = engine_state.engine.create_conversation(
        system_message=system_message,
        messages=history,
        sampler_config=sampler_config,
        max_output_tokens=max_output_tokens,
    )
    try:
        prompt_tokens = _safe_token_count(conversation)
        response_dict = conversation.send_message(last_user_text)
        total_tokens = _safe_token_count(conversation)
    finally:
        conversation.close()

    usage = None
    if prompt_tokens is not None and total_tokens is not None:
        usage = Usage(
            prompt_tokens=prompt_tokens,
            completion_tokens=max(total_tokens - prompt_tokens, 0),
            total_tokens=total_tokens,
        )
    return response_dict, usage


@app.post("/v1/chat/completions")
async def chat_completions(request: Request):
    if engine_state.engine is None:
        return _error(503, engine_state.load_error or "engine not loaded", "server_error", "engine_unavailable")

    try:
        body = await request.json()
    except Exception:
        return _error(400, "Request body must be valid JSON", "invalid_request_error")

    try:
        chat_request = ChatCompletionRequest.model_validate(body)
    except ValidationError as exc:
        first_error = exc.errors()[0]
        field = ".".join(str(loc) for loc in first_error["loc"])
        return _error(400, f"{field}: {first_error['msg']}" if field else first_error["msg"], "invalid_request_error")

    model_id = chat_request.model or config.MODEL_ID
    if model_id != config.MODEL_ID:
        return _error(404, f"model '{model_id}' not found", "invalid_request_error", "model_not_found")

    try:
        system_message, history, last_user_text = split_messages(
            [m.model_dump() for m in chat_request.messages]
        )
    except ValueError as exc:
        return _error(400, str(exc), "invalid_request_error")

    sampler_config = _build_sampler_config(chat_request)
    max_output_tokens = chat_request.max_tokens or config.DEFAULT_MAX_OUTPUT_TOKENS
    completion_id = f"chatcmpl-{uuid.uuid4().hex}"

    if chat_request.stream:
        return StreamingResponse(
            _stream_completion(
                completion_id, model_id, system_message, history, last_user_text,
                sampler_config, max_output_tokens,
            ),
            media_type="text/event-stream",
        )

    async with engine_state.lock:
        try:
            response_dict, usage = await run_in_threadpool(
                _generate_sync, system_message, history, last_user_text, sampler_config, max_output_tokens
            )
        except Exception as exc:  # noqa: BLE001 - never leak a raw 500 traceback to the client
            logger.exception("Inference failed")
            return _error(500, f"Inference failed: {exc}", "server_error")

    text = _extract_text(response_dict)
    return ChatCompletionResponse(
        id=completion_id,
        model=model_id,
        choices=[ChatCompletionChoice(message=ChatCompletionMessage(content=text))],
        usage=usage,
    )


async def _stream_completion(
    completion_id, model_id, system_message, history, last_user_text, sampler_config, max_output_tokens
) -> AsyncIterator[str]:
    async with engine_state.lock:
        loop = asyncio.get_running_loop()
        chunk_queue: asyncio.Queue = asyncio.Queue()
        conversation_holder: dict = {}

        def worker():
            try:
                conversation = engine_state.engine.create_conversation(
                    system_message=system_message,
                    messages=history,
                    sampler_config=sampler_config,
                    max_output_tokens=max_output_tokens,
                )
                conversation_holder["conversation"] = conversation
                for chunk in conversation.send_message_async(last_user_text):
                    loop.call_soon_threadsafe(chunk_queue.put_nowait, chunk)
            except Exception as exc:  # noqa: BLE001
                loop.call_soon_threadsafe(chunk_queue.put_nowait, exc)
            finally:
                loop.call_soon_threadsafe(chunk_queue.put_nowait, None)

        thread = threading.Thread(target=worker, daemon=True)
        thread.start()

        errored = False
        first_chunk = True
        try:
            while True:
                item = await chunk_queue.get()
                if item is None:
                    break
                if isinstance(item, Exception):
                    logger.exception("Streaming inference failed", exc_info=item)
                    err = ErrorResponse(error=ErrorDetail(message=str(item), type="server_error"))
                    yield f"data: {err.model_dump_json()}\n\n"
                    errored = True
                    break
                text = _extract_text(item)
                delta = ChatCompletionChunkDelta(content=text, role="assistant" if first_chunk else None)
                first_chunk = False
                chunk = ChatCompletionChunk(
                    id=completion_id,
                    model=model_id,
                    choices=[ChatCompletionChunkChoice(delta=delta)],
                )
                yield f"data: {chunk.model_dump_json(exclude_none=True)}\n\n"
        except asyncio.CancelledError:
            conversation = conversation_holder.get("conversation")
            if conversation is not None:
                conversation.cancel_process()
            raise
        finally:
            thread.join(timeout=5)
            conversation = conversation_holder.get("conversation")
            if conversation is not None:
                conversation.close()

        if not errored:
            final_chunk = ChatCompletionChunk(
                id=completion_id,
                model=model_id,
                choices=[ChatCompletionChunkChoice(delta=ChatCompletionChunkDelta(), finish_reason="stop")],
            )
            yield f"data: {final_chunk.model_dump_json()}\n\n"
        yield "data: [DONE]\n\n"
