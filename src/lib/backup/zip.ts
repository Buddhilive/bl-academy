import fs from "node:fs/promises";
import path from "node:path";

import AdmZip from "adm-zip";

import { ZIPS_DIR } from "./paths";
import { validateManifest, type BackupManifest } from "./manifest";

const MANIFEST_ENTRY = "manifest.json";
const DUMP_ENTRY = "db/dump.sql";

export async function createBackupZip(params: {
  manifest: BackupManifest;
  dumpSql: string;
}): Promise<{ filePath: string; fileName: string; sizeBytes: number }> {
  await fs.mkdir(ZIPS_DIR, { recursive: true });

  const zip = new AdmZip();
  zip.addFile(MANIFEST_ENTRY, Buffer.from(JSON.stringify(params.manifest, null, 2)));
  zip.addFile(DUMP_ENTRY, Buffer.from(params.dumpSql));

  const fileName = `backup-${params.manifest.createdAt.replace(/[:.]/g, "-")}.zip`;
  const filePath = path.join(ZIPS_DIR, fileName);
  zip.writeZip(filePath);

  const stat = await fs.stat(filePath);
  return { filePath, fileName, sizeBytes: stat.size };
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
