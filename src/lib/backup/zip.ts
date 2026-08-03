import fs from "node:fs/promises";
import path from "node:path";

import AdmZip from "adm-zip";

import { KNOWLEDGE_DIR } from "@/lib/knowledge/paths";
import { ZIPS_DIR } from "./paths";
import { validateManifest, type BackupManifest } from "./manifest";

const MANIFEST_ENTRY = "manifest.json";
const DUMP_ENTRY = "db/dump.sql";
const KNOWLEDGE_PREFIX = "knowledge/";

export async function createBackupZip(params: {
  manifest: BackupManifest;
  dumpSql: string;
}): Promise<{ filePath: string; fileName: string; sizeBytes: number }> {
  await fs.mkdir(ZIPS_DIR, { recursive: true });

  const zip = new AdmZip();
  zip.addFile(MANIFEST_ENTRY, Buffer.from(JSON.stringify(params.manifest, null, 2)));
  zip.addFile(DUMP_ENTRY, Buffer.from(params.dumpSql));

  await addKnowledgeDirToZip(zip, KNOWLEDGE_DIR, KNOWLEDGE_PREFIX);

  const fileName = `backup-${params.manifest.createdAt.replace(/[:.]/g, "-")}.zip`;
  const filePath = path.join(ZIPS_DIR, fileName);
  zip.writeZip(filePath);

  const stat = await fs.stat(filePath);
  return { filePath, fileName, sizeBytes: stat.size };
}

/** Walks static/knowledge, skipping the sources/ subdir (original PDFs — excluded per D1). */
async function addKnowledgeDirToZip(zip: AdmZip, dir: string, zipPrefix: string): Promise<void> {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (zipPrefix === KNOWLEDGE_PREFIX && entry.name === "sources") continue;
      await addKnowledgeDirToZip(zip, path.join(dir, entry.name), `${zipPrefix}${entry.name}/`);
    } else if (entry.name.endsWith(".md")) {
      const data = await fs.readFile(path.join(dir, entry.name));
      zip.addFile(`${zipPrefix}${entry.name}`, data);
    }
  }
}

export function readManifestFromZip(filePath: string): BackupManifest {
  const zip = new AdmZip(filePath);
  const entry = zip.getEntry(MANIFEST_ENTRY);
  if (!entry) throw new Error("Backup zip is missing manifest.json");
  return validateManifest(JSON.parse(entry.getData().toString("utf-8")));
}

export function readDumpSqlFromZip(filePath: string): string {
  const zip = new AdmZip(filePath);
  const entry = zip.getEntry(DUMP_ENTRY);
  if (!entry) throw new Error("Backup zip is missing db/dump.sql");
  return entry.getData().toString("utf-8");
}

/** Extracts every knowledge/** entry into destDir with the "knowledge/" prefix stripped. */
export async function extractKnowledgeToDir(filePath: string, destDir: string): Promise<void> {
  const zip = new AdmZip(filePath);
  await fs.mkdir(destDir, { recursive: true });

  for (const entry of zip.getEntries()) {
    if (entry.isDirectory || !entry.entryName.startsWith(KNOWLEDGE_PREFIX)) continue;
    const relative = entry.entryName.slice(KNOWLEDGE_PREFIX.length);
    if (!relative) continue;
    const target = path.join(destDir, relative);
    if (!target.startsWith(destDir)) continue; // guard against a malicious "../" entry
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, entry.getData());
  }
}
