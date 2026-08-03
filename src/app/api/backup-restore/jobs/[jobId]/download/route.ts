import fs from "node:fs/promises";

import { NextResponse } from "next/server";

import { jobRegistry } from "@/lib/backup/job-registry";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const job = jobRegistry.get(jobId);

  if (!job || job.kind !== "backup" || job.status !== "done" || !job.result?.filePath) {
    return NextResponse.json({ error: "Backup not found or not finished" }, { status: 404 });
  }

  const buffer = await fs.readFile(job.result.filePath);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${job.result.fileName ?? "backup.zip"}"`,
      "Content-Length": String(buffer.byteLength),
    },
  });
}
