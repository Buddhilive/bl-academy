import fs from "node:fs/promises";

import { assertDumpSqlIsWellFormed, restoreFromDumpSql } from "./db-dump";
import { jobRegistry } from "./job-registry";
import { ensureBackupDirs } from "./paths";
import { readDumpSqlFromZip, readManifestFromZip } from "./zip";

export async function runRestoreJob(jobId: string, uploadedZipPath: string): Promise<void> {
  try {
    await ensureBackupDirs();

    jobRegistry.emitEvent(jobId, { stage: "validating", message: "Validating backup archive...", percent: 10 });
    readManifestFromZip(uploadedZipPath); // throws ManifestValidationError on bad/missing/future-version manifest
    const dumpSql = readDumpSqlFromZip(uploadedZipPath);
    assertDumpSqlIsWellFormed(dumpSql);

    jobRegistry.emitEvent(jobId, { stage: "restoring_db", message: "Restoring database...", percent: 60 });
    await restoreFromDumpSql(dumpSql);

    jobRegistry.emitEvent(jobId, { stage: "cleaning_up", message: "Cleaning up...", percent: 95 });
    await fs.rm(uploadedZipPath, { force: true }).catch(() => {});

    jobRegistry.emitEvent(jobId, { stage: "done", message: "Restore complete", percent: 100 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Restore failed unexpectedly";
    jobRegistry.emitEvent(jobId, {
      stage: "error",
      message,
      percent: 100,
      code: "restore_failed",
    });
  }
}
