import fs from "node:fs/promises";
import path from "node:path";

export const KNOWLEDGE_DIR = path.join(process.cwd(), "static", "knowledge");
export const SOURCES_DIR = path.join(KNOWLEDGE_DIR, "sources");
export const INDEX_PATH = path.join(KNOWLEDGE_DIR, "index.md");

const RESERVED_BASENAMES = new Set(["index", "log"]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_BASENAMES.has(slug);
}

export async function ensureKnowledgeDirs(): Promise<void> {
  await fs.mkdir(SOURCES_DIR, { recursive: true });
}

export function conceptPath(slug: string): string {
  return path.join(KNOWLEDGE_DIR, `${slug}.md`);
}

export function sourcePdfPath(slug: string): string {
  return path.join(SOURCES_DIR, `${slug}.pdf`);
}

export function sourcePdfRoute(slug: string): string {
  return `/api/static/knowledge/sources/${slug}.pdf`;
}
