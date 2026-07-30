import fs from "node:fs/promises";

import { sourcePdfPath } from "@/lib/knowledge/paths";

export const runtime = "nodejs";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ filename: string }> }
) {
    const { filename } = await params;

    // Path-traversal guard: only a bare "<slug>.pdf" basename is ever accepted.
    if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\") || !filename.endsWith(".pdf")) {
        return new Response("Not found", { status: 404 });
    }

    const slug = filename.slice(0, -4);
    try {
        const data = await fs.readFile(sourcePdfPath(slug));
        return new Response(new Uint8Array(data), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="${filename}"`,
                "Cache-Control": "no-store",
            },
        });
    } catch {
        return new Response("Not found", { status: 404 });
    }
}
