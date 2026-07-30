"use client";

import { useCallback, useReducer } from "react";

export type UploadStage =
  | "idle"
  | "received"
  | "parsing"
  | "parsed"
  | "assembling"
  | "writing"
  | "done"
  | "error";

export interface UploadEvent {
  stage: UploadStage;
  message: string;
  code?: string;
  slug?: string;
  [key: string]: unknown;
}

interface UploadState {
  stage: UploadStage;
  events: UploadEvent[];
  error: string | null;
  slug: string | null;
}

type Action =
  | { type: "reset" }
  | { type: "event"; event: UploadEvent };

const initialState: UploadState = { stage: "idle", events: [], error: null, slug: null };

function reducer(state: UploadState, action: Action): UploadState {
  if (action.type === "reset") return initialState;
  const { event } = action;
  return {
    stage: event.stage,
    events: [...state.events, event],
    error: event.stage === "error" ? event.message : state.error,
    slug: event.stage === "done" ? (event.slug as string) ?? null : state.slug,
  };
}

/** Stages that only ever come from the FastAPI parse step aren't shown as distinct
 * UI steps beyond "parsing" — "parsed" is an internal handoff, not user-facing progress. */
export const STAGE_PERCENT: Record<UploadStage, number> = {
  idle: 0,
  received: 15,
  parsing: 40,
  parsed: 55,
  assembling: 70,
  writing: 90,
  done: 100,
  error: 100,
};

export function useKnowledgeUpload() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const uploadFile = useCallback(async (file: File) => {
    dispatch({ type: "reset" });
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/knowledge/upload", { method: "POST", body: formData });
      if (!response.body) {
        dispatch({ type: "event", event: { stage: "error", message: "No response from server" } });
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop() ?? "";
        for (const line of parts) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          if (payload === "[DONE]") continue;
          try {
            const event = JSON.parse(payload) as UploadEvent;
            dispatch({ type: "event", event });
          } catch {
            // ignore malformed SSE line
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed unexpectedly";
      dispatch({
        type: "event",
        event: { stage: "error", message },
      });
    }
  }, []);

  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  return { ...state, uploadFile, reset };
}
