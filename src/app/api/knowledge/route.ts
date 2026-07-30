import { NextResponse } from "next/server";

import { listConcepts } from "@/lib/knowledge/bundle";

export async function GET() {
    try {
        const { concepts, warnings } = await listConcepts();
        return NextResponse.json({ concepts, warnings });
    } catch (error: any) {
        console.error("GET /api/knowledge error:", error);
        return NextResponse.json({ error: error.message || "Failed to list knowledge base" }, { status: 500 });
    }
}
