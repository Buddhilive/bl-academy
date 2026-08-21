import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const inferenceModel = createOpenAICompatible({
  name: "gemma",
  baseURL: process.env.INFERENCE_BASE_URL ?? "http://localhost:8000/v1",
});
