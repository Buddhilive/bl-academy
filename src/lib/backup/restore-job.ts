import fs from "node:fs/promises";
import path from "node:path";

import { KNOWLEDGE_DIR } from "@/lib/knowledge/paths";
import { parseConcept, ConceptParseError } from "@/lib/knowledge/frontmatter";
import { assertDumpSqlIsWellFormed, restoreFromDumpSql } from "./db-dump";
import { jobRegistry } from "./job-registry";
import { bakDirFor, ensureBackupDirs, stagingDirFor } from "./paths";
import { extractKnowledgeToDir, readDumpSqlFromZip, readManifestFromZip } from "./zip";

async function validateStagedMarkdown(stagingDir: string): Promise<void> {
  async function walk(dir: string): Promise<void> {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.name.endsWith(".md") && entry.name !== "index.md" && entry.name !== "log.md") {
        const raw = await fs.readFile(full, "utf-8");
        try {
          parseConcept(raw);
        } catch (err) {
          const reason = err instanceof ConceptParseError ? err.message : "invalid markdown";
          throw new Error(`Corrupt concept file in backup: ${full} (${reason})`);
        }
      }
    }
  }
  await walk(stagingDir);
}

/** Moves every top-level entry of srcDir into destDir via fs.rename (atomic per-entry
 * on the same volume), leaving destDir's "sources" subdir (if any) untouched. */
async function moveKnowledgeEntries(srcDir: string, destDir: string, opts: { skipSources: boolean }): Promise<void> {
  await fs.mkdir(destDir, { recursive: true });
  let entries;
  try {
    entries = await fs.readdir(srcDir);
  } catch {
    return;
  }
  for (const entry of entries) {
    if (opts.skipSources && entry === "sources") continue;
    await fs.rename(path.join(srcDir, entry), path.join(destDir, entry));
  }
}

export async function runRestoreJob(jobId: string, uploadedZipPath: string): Promise<void> {
  const staging = stagingDirFor(jobId);
  const bak = bakDirFor(jobId);

  try {
    await ensureBackupDirs();

    jobRegistry.emitEvent(jobId, { stage: "validating", message: "Validating backup archive...", percent: 10 });
    readManifestFromZip(uploadedZipPath); // throws ManifestValidationError on bad/missing/future-version manifest
    const dumpSql = readDumpSqlFromZip(uploadedZipPath);
    assertDumpSqlIsWellFormed(dumpSql);

    jobRegistry.emitEvent(jobId, { stage: "extracting", message: "Extracting knowledge base files...", percent: 25 });
    await extractKnowledgeToDir(uploadedZipPath, staging);

    jobRegistry.emitEvent(jobId, { stage: "verifying_content", message: "Verifying markdown content...", percent: 35 });
    await validateStagedMarkdown(staging);

    // Point of no return: everything above is non-destructive (reads + a fresh
    // staging dir). A transaction failure here leaves the live DB untouched.
    jobRegistry.emitEvent(jobId, { stage: "restoring_db", message: "Restoring database...", percent: 60 });
    await restoreFromDumpSql(dumpSql);

    jobRegistry.emitEvent(jobId, { stage: "swapping_files", message: "Replacing knowledge base files...", percent: 85 });
    await fs.mkdir(KNOWLEDGE_DIR, { recursive: true });
    await moveKnowledgeEntries(KNOWLEDGE_DIR, bak, { skipSources: true });
    await moveKnowledgeEntries(staging, KNOWLEDGE_DIR, { skipSources: false });

    jobRegistry.emitEvent(jobId, { stage: "cleaning_up", message: "Cleaning up...", percent: 95 });
    await fs.rm(bak, { recursive: true, force: true }).catch(() => {});
    await fs.rm(staging, { recursive: true, force: true }).catch(() => {});
    await fs.rm(uploadedZipPath, { force: true }).catch(() => {});

    jobRegistry.emitEvent(jobId, { stage: "done", message: "Restore complete", percent: 100 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Restore failed unexpectedly";
    const recoveryHint = `Backup of prior knowledge base (if the DB restore had already committed) may be at: ${bak}. Staged files at: ${staging}.`;
    jobRegistry.emitEvent(jobId, {
      stage: "error",
      message,
      percent: 100,
      code: "restore_failed",
      recoveryHint,
    });
  }
}
