import fs from "node:fs/promises";
import path from "node:path";

export const BACKUP_ROOT_DIR = path.join(process.cwd(), "static", "backups");
export const ZIPS_DIR = path.join(BACKUP_ROOT_DIR, "zips");
export const UPLOADS_DIR = path.join(BACKUP_ROOT_DIR, "uploads");
export const STAGING_ROOT_DIR = path.join(BACKUP_ROOT_DIR, "staging");

export function stagingDirFor(jobId: string): string {
  return path.join(STAGING_ROOT_DIR, jobId);
}

/** Sits next to the live knowledge dir (both under static/) so the swap in
 * restore-job.ts is a same-volume `fs.rename` — atomic per-entry on Windows/POSIX. */
export function bakDirFor(jobId: string): string {
  return path.join(process.cwd(), "static", `knowledge.bak-${jobId}`);
}

export async function ensureBackupDirs(): Promise<void> {
  await fs.mkdir(ZIPS_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.mkdir(STAGING_ROOT_DIR, { recursive: true });
}
