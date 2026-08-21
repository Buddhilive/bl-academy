import fs from "node:fs/promises";
import path from "node:path";

export const BACKUP_ROOT_DIR = path.join(process.cwd(), "static", "backups");
export const ZIPS_DIR = path.join(BACKUP_ROOT_DIR, "zips");
export const UPLOADS_DIR = path.join(BACKUP_ROOT_DIR, "uploads");

export async function ensureBackupDirs(): Promise<void> {
  await fs.mkdir(ZIPS_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}
