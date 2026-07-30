import { streamText, UIMessage, convertToModelMessages, createUIMessageStreamResponse, toUIMessageStream, wrapLanguageModel, extractReasoningMiddleware } from "ai";
import { inferenceModel } from "@/lib/inference-client";
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
        const system = reasoningEnabled
            ? "You are a helpful assistant that can answer questions and help with tasks. Before answering, think through the problem step by step inside <think></think> tags. After the closing </think> tag, give a concise final answer without repeating the reasoning."
            : "You are a helpful assistant that can answer questions and help with tasks";

        const result = streamText({
            model: wrapLanguageModel({
                model: inferenceModel(model),
                middleware: extractReasoningMiddleware({ tagName: "think" }),
            }),
            messages: await convertToModelMessages(messages),
            system,
            onFinish: async ({ response }) => {
                if (chatId) {
                    try {
                        const { saveMessages } = await import("@/lib/db/queries");
                        // Combine existing messages with assistant's response message
                        const fullMessages: UIMessage[] = [
                            ...messages,
                            {
                                id: response.id || `assistant-${Date.now()}`,
                                role: "assistant",
                                parts: response.messages.flatMap((m) =>
                                    typeof m.content === "string"
                                        ? [{ type: "text" as const, text: m.content }]
                                        : (m.content as any[])
                                ),
                            },
                        ];
                        await saveMessages(chatId, fullMessages);
                    } catch (err) {
                        console.error("Failed to save chat messages in onFinish:", err);
                    }
                }
            },
        });

        // send sources and reasoning back to the client
        return createUIMessageStreamResponse({
            stream: toUIMessageStream({
                stream: result.stream,
                sendSources: true,
                sendReasoning: reasoningEnabled,
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

