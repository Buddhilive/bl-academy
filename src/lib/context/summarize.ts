import { generateText, wrapLanguageModel, extractReasoningMiddleware } from "ai";
import type { UIMessage } from "ai";
import { inferenceModel } from "@/lib/inference-client";
import { getChatById, updateChatSummary } from "@/lib/db/queries";
import { countTokens, extractMessageText, SUMMARIZATION_TOKEN_THRESHOLD } from "@/lib/context/constants";

const SUMMARY_SYSTEM_PROMPT =
    "You are condensing an ongoing conversation to save context space. Summarize the conversation below " +
    "concisely, preserving key facts, decisions, user preferences, and unresolved questions needed to continue " +
    "it naturally. Write the summary directly with no preamble or commentary about summarizing.";

function withSummary(systemPrompt: string, summary: string): string {
    return `${systemPrompt}\n\n---\nSummary of earlier conversation (for context continuity):\n${summary}`;
}

function buildTranscript(priorSummary: string | null, messages: UIMessage[]): string {
    const parts: string[] = [];
    if (priorSummary) {
        parts.push(`Summary of earlier conversation:\n${priorSummary}`);
    }
    for (const msg of messages) {
        const text = extractMessageText(msg);
        if (text) parts.push(`${msg.role}: ${text}`);
    }
    return parts.join("\n\n");
}

export interface SummarizeIfNeededParams {
    chatId?: string;
    model: string;
    messages: UIMessage[];
    systemPrompt: string;
    /** Hold out the newest message from summarization — it's the turn actively being answered. */
    reserveLast: boolean;
    signal?: AbortSignal;
}

export interface SummarizeIfNeededResult {
    system: string;
    messages: UIMessage[];
    summarized: boolean;
    summarizedMessageCount: number;
    summary: string | null;
}

/**
 * Folds older conversation turns into a persisted summary once token usage crosses
 * SUMMARIZATION_TOKEN_THRESHOLD, so the model gets a compact history instead of the
 * full transcript. Never touches the actual messages table — only chats.contextSummary /
 * chats.summarizedMessageCount. Never throws: any failure falls back to the original
 * (uncompacted) system/messages so the caller can proceed unaffected.
 */
export async function summarizeIfNeeded({
    chatId,
    model,
    messages,
    systemPrompt,
    reserveLast,
    signal,
}: SummarizeIfNeededParams): Promise<SummarizeIfNeededResult> {
    const fallback: SummarizeIfNeededResult = {
        system: systemPrompt,
        messages,
        summarized: false,
        summarizedMessageCount: 0,
        summary: null,
    };

    if (!chatId) return fallback;

    try {
        const chat = await getChatById(chatId);
        if (!chat) return fallback;

        const summarizedCount = chat.summarizedMessageCount ?? 0;
        const priorSummary = chat.contextSummary ?? null;
        const tail = messages.slice(summarizedCount);

        const reserved = reserveLast && tail.length > 0 ? tail[tail.length - 1] : null;
        const foldable = reserved ? tail.slice(0, -1) : tail;

        const unchangedResult: SummarizeIfNeededResult = {
            system: priorSummary ? withSummary(systemPrompt, priorSummary) : systemPrompt,
            messages: tail,
            summarized: false,
            summarizedMessageCount: summarizedCount,
            summary: priorSummary,
        };

        if (foldable.length === 0) {
            return unchangedResult;
        }

        const totalTokens =
            countTokens(systemPrompt) +
            countTokens(priorSummary || "") +
            countTokens(tail.map(extractMessageText).join(""));

        if (totalTokens < SUMMARIZATION_TOKEN_THRESHOLD) {
            return unchangedResult;
        }

        const transcript = buildTranscript(priorSummary, foldable);

        const { text: newSummary } = await generateText({
            model: wrapLanguageModel({
                model: inferenceModel(model),
                middleware: extractReasoningMiddleware({ tagName: "think" }),
            }),
            system: SUMMARY_SYSTEM_PROMPT,
            prompt: transcript,
            abortSignal: signal,
        });

        const newSummarizedCount = summarizedCount + foldable.length;
        await updateChatSummary(chatId, newSummary, newSummarizedCount);

        return {
            system: withSummary(systemPrompt, newSummary),
            messages: reserved ? [reserved] : [],
            summarized: true,
            summarizedMessageCount: newSummarizedCount,
            summary: newSummary,
        };
    } catch (err) {
        console.error("Context summarization failed, falling back to full history:", err);
        return fallback;
    }
}
