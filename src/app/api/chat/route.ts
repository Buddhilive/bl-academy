import { streamText, UIMessage, convertToModelMessages, createUIMessageStreamResponse, toUIMessageStream, wrapLanguageModel, extractReasoningMiddleware, tool, stepCountIs } from "ai";
import { z } from "zod";
import { inferenceModel } from "@/lib/inference-client";
import { summarizeIfNeeded } from "@/lib/context/summarize";
import { searchWeb } from "@/lib/search/searxng";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const {
        messages,
        model,
        reasoningEnabled = true,
        chatId,
        webSearch = false,
    }: {
        messages: UIMessage[];
        model: string;
        reasoningEnabled?: boolean;
        chatId?: string;
        webSearch?: boolean;
    } = await req.json();

    console.log("RECEIVED BODY MODEL:", model);

    // Guard: reject if no model is specified
    if (!model || model.trim() === "") {
        return NextResponse.json(
            { error: "No model selected. Please select a model before sending a message." },
            { status: 400 }
        );
    }

    try {
        const groundingInstructions = webSearch
            ? "You have a `webSearch` tool for general or current-events questions. " +
              "When you use a result in your answer, cite it immediately after the relevant sentence using the literal marker `[cite:<id>]`, " +
              "where `<id>` is exactly the result's `id` field (these ids are prefixed `web:`). " +
              "Only cite ids that were actually returned by the tool — never invent one. " +
              "If no relevant results are found, answer normally without citing."
            : "";

        const system = reasoningEnabled
            ? `You are a helpful assistant that can answer questions and help with tasks. Before answering, think through the problem step by step inside <think></think> tags. After the closing </think> tag, give a concise final answer without repeating the reasoning. ${groundingInstructions}`
            : `You are a helpful assistant that can answer questions and help with tasks. ${groundingInstructions}`;

        const tools = {
            ...(webSearch
                ? {
                      webSearch: tool({
                          description:
                              "Search the public web for current information via SearXNG. Returns results with `id`, `title`, `url`, `description`.",
                          inputSchema: z.object({ query: z.string().describe("Search query derived from the user's question") }),
                          execute: async ({ query }: { query: string }) => ({ results: await searchWeb(query) }),
                      }),
                  }
                : {}),
        };

        const { system: compactedSystem, messages: compactedMessages } = await summarizeIfNeeded({
            chatId,
            model,
            messages,
            systemPrompt: system,
            reserveLast: true,
            signal: req.signal,
        });

        const result = streamText({
            model: wrapLanguageModel({
                model: inferenceModel(model),
                middleware: extractReasoningMiddleware({ tagName: "think" }),
            }),
            messages: await convertToModelMessages(compactedMessages),
            system: compactedSystem,
            tools,
            stopWhen: stepCountIs(5),
        });

        // send sources and reasoning back to the client
        return createUIMessageStreamResponse({
            stream: toUIMessageStream({
                stream: result.stream,
                tools,
                sendSources: true,
                sendReasoning: reasoningEnabled,
                originalMessages: messages,
                generateMessageId: () => crypto.randomUUID(),
                onFinish: async ({ messages: finishedMessages }) => {
                    if (chatId) {
                        try {
                            const { saveMessages } = await import("@/lib/db/queries");
                            await saveMessages(chatId, finishedMessages);
                        } catch (err) {
                            console.error("Failed to save chat messages in onFinish:", err);
                        }
                    }
                },
            }),
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: error.message || "An error occurred while communicating with the model." },
            { status: 500 }
        );
    }
}

