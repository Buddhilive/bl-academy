import { NextResponse } from "next/server";

import { buildGraph } from "@/lib/knowledge/bundle";

export async function GET() {
    try {
        const graph = await buildGraph();
        return NextResponse.json(graph);
    } catch (error) {
        console.error("GET /api/knowledge/graph error:", error);
        const message = error instanceof Error ? error.message : "Failed to build knowledge graph";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
