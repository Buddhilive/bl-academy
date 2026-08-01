import { NextResponse } from "next/server";
import { getChatById } from "@/lib/db/queries";
import { summarizeIfNeeded } from "@/lib/context/summarize";

/**
 * Proactively compacts a chat's context (folds older messages into a persisted
 * summary) if it's already past the token threshold. Called by the client right
 * after loading a chat, and after each assistant turn finishes, so the defensive
 * check inside /api/chat rarely has real work left to do.
 */
export async function POST(
    req: Request,
    { params }: { params: Promise<{ chatId: string }> }
) {
    try {
        const { chatId } = await params;
        const chat = await getChatById(chatId);
        if (!chat) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }

        const result = await summarizeIfNeeded({
            chatId,
            model: chat.model,
            messages: chat.messages,
            systemPrompt: "",
            reserveLast: false,
            signal: req.signal,
        });

        return NextResponse.json({
            summarized: result.summarized,
            summarizedMessageCount: result.summarizedMessageCount,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("POST /api/chats/[chatId]/summarize error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to summarize chat" },
            { status: 500 }
        );
    }
}
