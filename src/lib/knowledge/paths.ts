import fs from "node:fs/promises";
import path from "node:path";

export const KNOWLEDGE_DIR = path.join(process.cwd(), "static", "knowledge");
export const SOURCES_DIR = path.join(KNOWLEDGE_DIR, "sources");
export const INDEX_PATH = path.join(KNOWLEDGE_DIR, "index.md");
export const LOG_PATH = path.join(KNOWLEDGE_DIR, "log.md");

// "sources" is reserved too — it's the shared PDF-storage directory, a source
// slug can never be allowed to collide with it.
const RESERVED_BASENAMES = new Set(["index", "log", "sources"]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_BASENAMES.has(slug);
}

export async function ensureKnowledgeDirs(): Promise<void> {
  await fs.mkdir(SOURCES_DIR, { recursive: true });
}

export function sourceDir(sourceSlug: string): string {
  return path.join(KNOWLEDGE_DIR, sourceSlug);
}

export function sourceIndexPath(sourceSlug: string): string {
  return path.join(sourceDir(sourceSlug), "index.md");
}

export function conceptPath(sourceSlug: string, conceptSlug: string): string {
  return path.join(sourceDir(sourceSlug), `${conceptSlug}.md`);
}

/** The v1-era flat concept file this source used before the graph rewrite — only
 * relevant during a reprocess, to clean up the stale file. */
export function legacyFlatConceptPath(sourceSlug: string): string {
  return path.join(KNOWLEDGE_DIR, `${sourceSlug}.md`);
}

export function sourcePdfPath(sourceSlug: string): string {
  return path.join(SOURCES_DIR, `${sourceSlug}.pdf`);
}

export function sourcePdfRoute(sourceSlug: string): string {
  return `/api/static/knowledge/sources/${sourceSlug}.pdf`;
}
