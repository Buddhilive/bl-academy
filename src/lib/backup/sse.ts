import { jobRegistry } from "./job-registry";

const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
} as const;

/**
 * Streams a job's full event history immediately on connect (so a client that
 * navigated away and back sees the true current state, not just events emitted
 * after it reconnected), then relays live events until the job finishes.
 * Unsubscribing on client disconnect never affects the job itself — it keeps
 * running headless server-side regardless of any open connection.
 */
export function jobEventsSseResponse(jobId: string): Response {
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (event: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      const job = jobRegistry.get(jobId);
      if (!job) {
        send({ stage: "error", message: "Job not found", code: "job_not_found" });
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
        return;
      }

      for (const event of job.events) send(event);

      if (job.status !== "running") {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
        return;
      }

      const unsubscribe = jobRegistry.subscribe(jobId, (event) => {
        send(event);
        if (event.stage === "done" || event.stage === "error") {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
          unsubscribe();
        }
      });
    },
  });

  return new Response(stream, { headers: SSE_HEADERS });
}
