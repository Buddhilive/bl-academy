import { NextResponse } from "next/server";

import { ConceptParseError, getConcept } from "@/lib/knowledge/bundle";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const concept = await getConcept(slug);
        if (!concept) {
            return NextResponse.json({ error: "Concept not found" }, { status: 404 });
        }
        return NextResponse.json(concept);
    } catch (error: any) {
        if (error instanceof ConceptParseError) {
            return NextResponse.json({ error: error.message }, { status: 422 });
        }
        console.error("GET /api/knowledge/[slug] error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch concept" }, { status: 500 });
    }
}
