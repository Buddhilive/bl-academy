import { jobEventsSseResponse } from "@/lib/backup/sse";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  return jobEventsSseResponse(jobId);
}
