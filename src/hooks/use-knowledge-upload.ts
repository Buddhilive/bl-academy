"use client";

import { useCallback, useReducer } from "react";

export type UploadStage =
  | "idle"
  | "received"
  | "parsing"
  | "parsed"
  | "segmenting"
  | "classifying"
  | "linking"
  | "degraded"
  | "extracted"
  | "assembling"
  | "writing"
  | "done"
  | "error";

export interface UploadProgress {
  current: number;
  total: number;
}

export interface UploadEvent {
  stage: UploadStage;
  message: string;
  code?: string;
  sourceSlug?: string;
  progress?: UploadProgress;
  [key: string]: unknown;
}

interface UploadState {
  stage: UploadStage;
  events: UploadEvent[];
  error: string | null;
  sourceSlug: string | null;
  progress: UploadProgress | null;
}

type Action =
  | { type: "reset" }
  | { type: "event"; event: UploadEvent };

const initialState: UploadState = { stage: "idle", events: [], error: null, sourceSlug: null, progress: null };

function reducer(state: UploadState, action: Action): UploadState {
  if (action.type === "reset") return initialState;
  const { event } = action;
  return {
    stage: event.stage,
    events: [...state.events, event],
    error: event.stage === "error" ? event.message : state.error,
    sourceSlug: event.stage === "done" ? (event.sourceSlug as string) ?? null : state.sourceSlug,
    progress: event.progress ?? (event.stage === "classifying" ? state.progress : null),
  };
}

/** Stages that only ever come from the FastAPI parse step aren't shown as distinct
 * UI steps beyond their own slice of the bar — "parsed"/"degraded"/"extracted" are
 * internal handoffs, not separately-labeled user-facing progress. */
export const STAGE_PERCENT: Record<UploadStage, number> = {
  idle: 0,
  received: 10,
  parsing: 25,
  parsed: 35,
  segmenting: 40,
  classifying: 60,
  linking: 70,
  degraded: 70,
  extracted: 75,
  assembling: 82,
  writing: 92,
  done: 100,
  error: 100,
};

async function consumeSse(response: Response, dispatch: React.Dispatch<Action>): Promise<void> {
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
}

export function useKnowledgeUpload() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const uploadFile = useCallback(async (file: File) => {
    dispatch({ type: "reset" });
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/knowledge/upload", { method: "POST", body: formData });
      await consumeSse(response, dispatch);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed unexpectedly";
      dispatch({ type: "event", event: { stage: "error", message } });
    }
  }, []);

  const reprocess = useCallback(async (sourceSlug: string) => {
    dispatch({ type: "reset" });
    try {
      const response = await fetch(`/api/knowledge/${sourceSlug}/reprocess`, { method: "POST" });
      await consumeSse(response, dispatch);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Reprocess failed unexpectedly";
      dispatch({ type: "event", event: { stage: "error", message } });
    }
  }, []);

  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  return { ...state, uploadFile, reprocess, reset };
}
