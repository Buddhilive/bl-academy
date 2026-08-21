import { buildDumpSql } from "./db-dump";
import { jobRegistry } from "./job-registry";
import { CURRENT_MANIFEST_VERSION, type BackupManifest } from "./manifest";
import { createBackupZip } from "./zip";

export async function runBackupJob(jobId: string): Promise<void> {
  try {
    jobRegistry.emitEvent(jobId, { stage: "preparing", message: "Preparing backup...", percent: 5 });

    jobRegistry.emitEvent(jobId, { stage: "dumping_db", message: "Dumping database...", percent: 30 });
    const { sql: dumpSql, counts: dbCounts } = await buildDumpSql();

    const manifest: BackupManifest = {
      version: CURRENT_MANIFEST_VERSION,
      createdAt: new Date().toISOString(),
      includesSourcePdfs: false,
      counts: { chats: dbCounts.chats, messages: dbCounts.messages },
    };

    jobRegistry.emitEvent(jobId, { stage: "writing_zip", message: "Writing backup archive...", percent: 85 });
    const { fileName, sizeBytes, filePath } = await createBackupZip({ manifest, dumpSql });
    jobRegistry.setResult(jobId, { fileName, sizeBytes, filePath });

    jobRegistry.emitEvent(jobId, {
      stage: "done",
      message: `Backup complete (${dbCounts.chats} chat(s))`,
      percent: 100,
      fileName,
      sizeBytes,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Backup failed unexpectedly";
    jobRegistry.emitEvent(jobId, { stage: "error", message, percent: 100, code: "backup_failed" });
  }
}
