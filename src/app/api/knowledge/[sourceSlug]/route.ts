import { NextResponse } from "next/server";

import { listConceptsInSource } from "@/lib/knowledge/bundle";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ sourceSlug: string }> }
) {
    try {
        const { sourceSlug } = await params;
        const result = await listConceptsInSource(sourceSlug);
        if (!result) {
            return NextResponse.json({ error: "Source not found" }, { status: 404 });
        }
        return NextResponse.json({ sourceSlug, ...result });
    } catch (error) {
        console.error("GET /api/knowledge/[sourceSlug] error:", error);
        const message = error instanceof Error ? error.message : "Failed to fetch source";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
