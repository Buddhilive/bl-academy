import { API_BASE_URL } from "@/lib/api-config";
import { buildConceptFrontmatter, persistNewConcept } from "@/lib/knowledge/bundle";
import { stringifyConcept } from "@/lib/knowledge/frontmatter";
import { uniqueSlug, slugify } from "@/lib/knowledge/slug";

export const runtime = "nodejs";

export async function POST(req: Request) {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const send = (event: Record<string, unknown>) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
            };

            try {
                const form = await req.formData();
                const file = form.get("file");
                if (!(file instanceof File)) {
                    send({ stage: "error", source: "web", message: "No file provided", code: "no_file" });
                    return;
                }
                if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
                    send({
                        stage: "error",
                        source: "web",
                        message: `Unsupported file type: ${file.type || "unknown"}`,
                        code: "bad_type",
                    });
                    return;
                }

                const upstreamForm = new FormData();
                upstreamForm.append("file", file, file.name);

                let upstream: Response;
                try {
                    upstream = await fetch(`${API_BASE_URL}/v1/knowledge/parse`, {
                        method: "POST",
                        body: upstreamForm,
                    });
                } catch {
                    send({
                        stage: "error",
                        source: "web",
                        message: "Knowledge parsing service is unreachable. Is the API server running?",
                        code: "backend_unreachable",
                    });
                    return;
                }

                if (!upstream.ok || !upstream.body) {
                    let detail = `Parsing service returned ${upstream.status}`;
                    try {
                        const body = await upstream.json();
                        detail = body?.detail ?? detail;
                    } catch {
                        // response wasn't JSON — keep the generic detail
                    }
                    send({ stage: "error", source: "web", message: detail, code: "parse_rejected" });
                    return;
                }

                // Relay FastAPI's SSE lines verbatim, capturing the final "parsed" markdown.
                const reader = upstream.body.getReader();
                const decoder = new TextDecoder();
                let buf = "";
                let markdown: string | null = null;
                let upstreamErrored = false;

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    buf += decoder.decode(value, { stream: true });
                    const parts = buf.split("\n\n");
                    buf = parts.pop() ?? "";
                    for (const line of parts) {
                        if (!line.startsWith("data: ")) continue;
                        const payload = line.slice(6);
                        if (payload === "[DONE]") continue;
                        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
                        try {
                            const evt = JSON.parse(payload);
                            if (evt.stage === "parsed") markdown = evt.markdown;
                            if (evt.stage === "error") upstreamErrored = true;
                        } catch {
                            // malformed relay line — ignore, we still forwarded it raw above
                        }
                    }
                }

                if (upstreamErrored || markdown === null) {
                    return;
                }

                send({ stage: "assembling", source: "web", message: "Building OKF concept..." });
                const slug = await uniqueSlug(slugify(file.name));
                const frontmatter = buildConceptFrontmatter({
                    filename: file.name,
                    slug,
                    uploadTimeIso: new Date().toISOString(),
                });
                const fileContents = stringifyConcept(frontmatter, markdown);
                const pdfBytes = Buffer.from(await file.arrayBuffer());

                send({ stage: "writing", source: "web", message: "Writing bundle files..." });
                const { conceptPath, sourcePdfPath } = await persistNewConcept({ slug, fileContents, pdfBytes });

                send({
                    stage: "done",
                    source: "web",
                    message: "Document added to knowledge base",
                    slug,
                    path: conceptPath,
                    sourcePdfPath,
                });
            } catch (err: any) {
                send({ stage: "error", source: "web", message: err?.message ?? "Unexpected server error", code: "internal_error" });
            } finally {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
        },
    });
}
