import { encode } from "gpt-tokenizer";
import type { UIMessage } from "ai";

export const MAX_CONTEXT_TOKENS = 3400;
export const SUMMARIZATION_THRESHOLD_RATIO = 0.8;
export const SUMMARIZATION_TOKEN_THRESHOLD = Math.floor(
    MAX_CONTEXT_TOKENS * SUMMARIZATION_THRESHOLD_RATIO
);

type TextBearingMessage = Pick<UIMessage, "parts"> & { content?: string };

export function extractMessageText(message: TextBearingMessage): string {
    if (Array.isArray(message.parts) && message.parts.length > 0) {
        return message.parts
            .filter((p) => p.type === "text")
            .map((p) => (p as { text?: string }).text || "")
            .join("");
    }
    return message.content || "";
}

export function countTokens(text: string): number {
    return text ? encode(text).length : 0;
}
