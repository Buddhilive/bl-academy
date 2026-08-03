import fs from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

import { JobBusyError, jobRegistry } from "@/lib/backup/job-registry";
import { ensureBackupDirs, UPLOADS_DIR } from "@/lib/backup/paths";
import { runRestoreJob } from "@/lib/backup/restore-job";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  const confirm = form.get("confirm");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No backup file provided" }, { status: 400 });
  }
  if (!file.name.toLowerCase().endsWith(".zip")) {
    return NextResponse.json({ error: "Backup file must be a .zip archive" }, { status: 400 });
  }
  if (confirm !== "true") {
    return NextResponse.json({ error: "Restore requires explicit confirmation" }, { status: 400 });
  }

  try {
    const job = jobRegistry.create("restore");

    await ensureBackupDirs();
    const uploadPath = path.join(UPLOADS_DIR, `${job.id}-${nanoid(6)}.zip`);
    await fs.writeFile(uploadPath, Buffer.from(await file.arrayBuffer()));

    void runRestoreJob(job.id, uploadPath);
    return NextResponse.json({ jobId: job.id });
  } catch (err) {
    if (err instanceof JobBusyError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    const message = err instanceof Error ? err.message : "Failed to start restore";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
