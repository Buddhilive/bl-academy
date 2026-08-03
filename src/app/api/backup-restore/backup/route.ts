import { NextResponse } from "next/server";

import { runBackupJob } from "@/lib/backup/backup-job";
import { JobBusyError, jobRegistry } from "@/lib/backup/job-registry";

export const runtime = "nodejs";

export async function POST() {
  try {
    const job = jobRegistry.create("backup");
    void runBackupJob(job.id);
    return NextResponse.json({ jobId: job.id });
  } catch (err) {
    if (err instanceof JobBusyError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    const message = err instanceof Error ? err.message : "Failed to start backup";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
