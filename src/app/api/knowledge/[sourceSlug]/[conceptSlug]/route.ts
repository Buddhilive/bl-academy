import { NextResponse } from "next/server";

import { ConceptParseError, getConcept } from "@/lib/knowledge/bundle";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ sourceSlug: string; conceptSlug: string }> }
) {
    try {
        const { sourceSlug, conceptSlug } = await params;
        const concept = await getConcept(sourceSlug, conceptSlug);
        if (!concept) {
            return NextResponse.json({ error: "Concept not found" }, { status: 404 });
        }
        return NextResponse.json(concept);
    } catch (error) {
        if (error instanceof ConceptParseError) {
            return NextResponse.json({ error: error.message }, { status: 422 });
        }
        console.error("GET /api/knowledge/[sourceSlug]/[conceptSlug] error:", error);
        const message = error instanceof Error ? error.message : "Failed to fetch concept";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
