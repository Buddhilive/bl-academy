import fs from "node:fs/promises";

import { listConceptsInSource } from "@/lib/knowledge/bundle";
import { sourcePdfPath } from "@/lib/knowledge/paths";
import { runKnowledgeExtraction, sseErrorResponse, sseStreamResponse } from "@/lib/knowledge/orchestrate";

export const runtime = "nodejs";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ sourceSlug: string }> }
) {
    const { sourceSlug } = await params;

    let pdfBytes: Buffer;
    try {
        pdfBytes = await fs.readFile(sourcePdfPath(sourceSlug));
    } catch {
        return sseErrorResponse(`No stored PDF found for "${sourceSlug}"`, "source_not_found");
    }

    // Recover the true original filename from an already-migrated source's concept
    // frontmatter; falls back to the slug for a still-flat legacy (v1) source.
    const existing = await listConceptsInSource(sourceSlug);
    const filename = existing?.concepts[0]?.frontmatter.sources?.[0]?.title ?? `${sourceSlug}.pdf`;

    const stream = runKnowledgeExtraction({ filename, pdfBytes, sourceSlug });
    return sseStreamResponse(stream);
}
