import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const inferenceModel = createOpenAICompatible({
  name: "gemma",
  baseURL: "http://localhost:8000/v1",
});
