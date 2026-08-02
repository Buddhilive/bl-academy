import { NextResponse } from "next/server";
import type { UIMessage } from "ai";
import { generateSuggestions } from "@/lib/context/suggestions";

export async function POST(req: Request) {
    try {
        const { model, messages }: { model?: string; messages?: UIMessage[] } = await req.json();

        if (!model || model.trim() === "") {
            return NextResponse.json({ error: "No model specified." }, { status: 400 });
        }
        if (!Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ error: "No messages provided." }, { status: 400 });
        }

        const suggestions = await generateSuggestions({ model, messages, signal: req.signal });

        return NextResponse.json({ suggestions });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("POST /api/chat/suggestions error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate suggestions" },
            { status: 500 }
        );
    }
}
