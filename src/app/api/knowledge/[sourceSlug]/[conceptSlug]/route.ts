import { NextResponse } from "next/server";

import { ConceptParseError, getConcept, updateConcept } from "@/lib/knowledge/bundle";
import type { PatchConceptRequest } from "@/lib/knowledge/types";

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

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ sourceSlug: string; conceptSlug: string }> }
) {
    try {
        const { sourceSlug, conceptSlug } = await params;
        const patch = (await req.json()) as PatchConceptRequest;
        if (patch?.action !== "save" && patch?.action !== "verify") {
            return NextResponse.json({ error: "Invalid patch action" }, { status: 400 });
        }
        const concept = await updateConcept(sourceSlug, conceptSlug, patch);
        if (!concept) {
            return NextResponse.json({ error: "Concept not found" }, { status: 404 });
        }
        return NextResponse.json(concept);
    } catch (error) {
        if (error instanceof ConceptParseError) {
            return NextResponse.json({ error: error.message }, { status: 422 });
        }
        console.error("PATCH /api/knowledge/[sourceSlug]/[conceptSlug] error:", error);
        const message = error instanceof Error ? error.message : "Failed to update concept";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
