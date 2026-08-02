import { API_BASE_URL } from "@/lib/api-config";
import { persistExtractedConcepts } from "@/lib/knowledge/bundle";
import { slugify, uniqueSourceSlug } from "@/lib/knowledge/slug";
import type { ExtractedConceptInput } from "@/lib/knowledge/types";

export interface OrchestrateParams {
  filename: string;
  pdfBytes: Buffer;
  /** Set only when reprocessing an existing source — reuses its slug and skips
   * re-writing the PDF (it's already on disk at that slug). */
  sourceSlug?: string;
}

const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
} as const;

export function sseErrorResponse(message: string, code: string): Response {
  const encoder = new TextEncoder();
  const body = encoder.encode(
    `data: ${JSON.stringify({ stage: "error", source: "web", message, code })}\n\ndata: [DONE]\n\n`
  );
  return new Response(body, { headers: SSE_HEADERS });
}

export function sseStreamResponse(stream: ReadableStream<Uint8Array>): Response {
  return new Response(stream, { headers: SSE_HEADERS });
}

/**
 * Shared upload/reprocess pipeline: forwards the PDF to FastAPI, relays its
 * SSE progress verbatim, then on the final `extracted` event assembles and
 * persists the OKF concept graph, appending assembling/writing/done stages
 * to the same stream. Used by both a fresh upload and a source reprocess —
 * the only difference is whether `sourceSlug` is already known.
 */
export function runKnowledgeExtraction(params: OrchestrateParams): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      const send = (event: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      try {
        const upstreamForm = new FormData();
        upstreamForm.append(
          "file",
          new Blob([params.pdfBytes as unknown as BlobPart], { type: "application/pdf" }),
          params.filename
        );

        let upstream: Response;
        try {
          upstream = await fetch(`${API_BASE_URL}/v1/knowledge/parse`, { method: "POST", body: upstreamForm });
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

        // Relay FastAPI's SSE lines verbatim, capturing the final "extracted" payload.
        const reader = upstream.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        let concepts: ExtractedConceptInput[] | null = null;
        let relations: number[][] = [];
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
              if (evt.stage === "extracted") {
                concepts = evt.concepts;
                relations = evt.relations ?? [];
              }
              if (evt.stage === "error") upstreamErrored = true;
            } catch {
              // malformed relay line — ignore, we still forwarded it raw above
            }
          }
        }

        if (upstreamErrored || !concepts || concepts.length === 0) {
          return;
        }

        send({ stage: "assembling", source: "web", message: "Building OKF concept graph..." });
        const mode: "create" | "reprocess" = params.sourceSlug ? "reprocess" : "create";
        const sourceSlug = params.sourceSlug ?? (await uniqueSourceSlug(slugify(params.filename)));

        send({ stage: "writing", source: "web", message: "Writing bundle files..." });
        const { conceptSlugs } = await persistExtractedConcepts({
          sourceSlug,
          sourceFilename: params.filename,
          pdfBytes: mode === "create" ? params.pdfBytes : null,
          concepts,
          relations,
          uploadTimeIso: new Date().toISOString(),
          mode,
        });

        send({
          stage: "done",
          source: "web",
          message: `${mode === "reprocess" ? "Reprocessed" : "Added"} ${conceptSlugs.length} concept(s) to the knowledge base`,
          sourceSlug,
          conceptCount: conceptSlugs.length,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected server error";
        send({ stage: "error", source: "web", message, code: "internal_error" });
      } finally {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });
}
