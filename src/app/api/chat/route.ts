import { streamText, UIMessage, convertToModelMessages, createUIMessageStreamResponse, toUIMessageStream, wrapLanguageModel, extractReasoningMiddleware, tool, stepCountIs } from "ai";
import { z } from "zod";
import { inferenceModel } from "@/lib/inference-client";
import { searchConcepts } from "@/lib/knowledge/search";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const {
        messages,
        model,
        reasoningEnabled = true,
        chatId,
        // webSearch,
    }: {
        messages: UIMessage[];
        model: string;
        reasoningEnabled?: boolean;
        chatId?: string;
        // webSearch: boolean;
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
        const groundingInstructions =
            "You have a `searchKnowledgeBase` tool over an ingested document knowledge base. " +
            "Always call it before answering questions that could be grounded in ingested documents. " +
            "When you use a result in your answer, cite it immediately after the relevant sentence using the literal marker `[cite:<id>]`, " +
            "where `<id>` is exactly the result's `id` field (e.g. `[cite:physics-101/newtons-second-law]`). " +
            "Only cite ids that were actually returned by the tool — never invent one. " +
            "If no relevant results are found, answer normally without citing.";

        const system = reasoningEnabled
            ? `You are a helpful assistant that can answer questions and help with tasks. Before answering, think through the problem step by step inside <think></think> tags. After the closing </think> tag, give a concise final answer without repeating the reasoning. ${groundingInstructions}`
            : `You are a helpful assistant that can answer questions and help with tasks. ${groundingInstructions}`;

        const tools = {
            searchKnowledgeBase: tool({
                description:
                    "Search the OKF knowledge base for concepts relevant to the user's question. Returns matching concepts with an `id`, `title`, `description`, `snippet`, and `url`.",
                inputSchema: z.object({ query: z.string().describe("Search query derived from the user's question") }),
                execute: async ({ query }: { query: string }) => ({ results: await searchConcepts(query) }),
            }),
        };

        const result = streamText({
            model: wrapLanguageModel({
                model: inferenceModel(model),
                middleware: extractReasoningMiddleware({ tagName: "think" }),
            }),
            messages: await convertToModelMessages(messages),
            system,
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

