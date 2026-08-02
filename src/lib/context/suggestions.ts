import { generateObject, wrapLanguageModel, extractReasoningMiddleware, NoObjectGeneratedError } from "ai";
import type { UIMessage } from "ai";
import { z } from "zod";
import { inferenceModel } from "@/lib/inference-client";
import { extractMessageText } from "@/lib/context/constants";

const SUGGESTIONS_SYSTEM_PROMPT =
    "You are proposing short follow-up messages for a user to send next in an ongoing chat. " +
    "Read the conversation below, especially the most recent user message and the assistant's reply to it, " +
    "and suggest up to 3 brief, natural messages the user might plausibly send next. " +
    "Write each suggestion in the user's own voice (first person, as if the user typed it), not as advice or a description. " +
    "Only suggest things that make sense as a genuine next message in this specific conversation — " +
    "if nothing good comes to mind, return an empty list rather than inventing generic filler. " +
    "Respond with ONLY a JSON object of the exact shape {\"suggestions\": [\"...\", \"...\"]} containing at most 3 strings — " +
    "no markdown, no bullet points or numbered lists, no code fences, no commentary before or after the JSON.";

const suggestionsSchema = z.object({
    suggestions: z.array(z.string().min(1).max(140)).max(3),
});

function buildTranscript(messages: UIMessage[]): string {
    return messages
        .map((msg) => {
            const text = extractMessageText(msg);
            return text ? `${msg.role}: ${text}` : null;
        })
        .filter((line): line is string => Boolean(line))
        .join("\n\n");
}

const BULLET_PREFIX = /^[\s]*(?:[-*•]|\d+[.)])\s+/;

/**
 * Best-effort recovery when the model ignored the JSON instruction and
 * returned a plain bullet/numbered list instead. Falls back to [] if the
 * error isn't a NoObjectGeneratedError or nothing usable can be extracted.
 */
function recoverSuggestionsFromFailedGeneration(err: unknown): string[] {
    if (!NoObjectGeneratedError.isInstance(err) || !err.text) return [];

    return err.text
        .split("\n")
        .map((line) => line.replace(BULLET_PREFIX, "").trim())
        .filter((line) => line.length > 0 && line.length <= 140)
        .slice(0, 3);
}

export interface GenerateSuggestionsParams {
    model: string;
    /** Recent tail of the conversation — caller is responsible for trimming. */
    messages: UIMessage[];
    signal?: AbortSignal;
}

/**
 * Proposes up to 3 likely next user messages based on the conversation so far.
 * Never throws: any failure (model error, timeout, malformed output, empty
 * transcript) resolves to an empty array so the caller can safely no-op.
 */
export async function generateSuggestions({
    model,
    messages,
    signal,
}: GenerateSuggestionsParams): Promise<string[]> {
    try {
        if (!model || messages.length === 0) return [];

        const last = messages[messages.length - 1];
        if (last?.role !== "assistant") return [];

        const transcript = buildTranscript(messages);
        if (!transcript) return [];

        const { object } = await generateObject({
            model: wrapLanguageModel({
                model: inferenceModel(model),
                middleware: extractReasoningMiddleware({ tagName: "think" }),
            }),
            schema: suggestionsSchema,
            system: SUGGESTIONS_SYSTEM_PROMPT,
            prompt: transcript,
            abortSignal: signal,
        });

        return object.suggestions.slice(0, 3);
    } catch (err) {
        console.error("Suggestion generation failed:", err);
        return recoverSuggestionsFromFailedGeneration(err);
    }
}
