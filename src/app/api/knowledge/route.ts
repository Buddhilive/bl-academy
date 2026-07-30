import { NextResponse } from "next/server";

import { listSources } from "@/lib/knowledge/bundle";

export async function GET() {
    try {
        const { sources, warnings } = await listSources();
        return NextResponse.json({ sources, warnings });
    } catch (error) {
        console.error("GET /api/knowledge error:", error);
        const message = error instanceof Error ? error.message : "Failed to list knowledge base";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
