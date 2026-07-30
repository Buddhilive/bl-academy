import fs from "node:fs/promises";
import path from "node:path";

import { atomicWriteFile } from "./atomic-write";
import { ConceptParseError, parseConcept, stringifyConcept } from "./frontmatter";
import { conceptPath, ensureKnowledgeDirs, INDEX_PATH, KNOWLEDGE_DIR, sourcePdfPath, sourcePdfRoute } from "./paths";
import type { ConceptDetail, ConceptSummary, OkfFrontmatter, TrustTier } from "./types";

const RESERVED_FILES = new Set(["index.md", "log.md"]);

export function buildConceptFrontmatter(params: {
  filename: string;
  slug: string;
  uploadTimeIso: string;
}): OkfFrontmatter {
  const resource = sourcePdfRoute(params.slug);
  return {
    type: "Document",
    title: params.filename.replace(/\.[^./\\]+$/, ""),
    description: "Ingested PDF document, extracted via EdgeParse.",
    resource,
    tags: [],
    generated: { by: "buddhi-ai/ingest", at: params.uploadTimeIso },
    sources: [{ id: "original-pdf", resource, title: params.filename }],
    status: "stable",
  };
}

export async function persistNewConcept(params: {
  slug: string;
  fileContents: string;
  pdfBytes: Buffer;
}): Promise<{ conceptPath: string; sourcePdfPath: string }> {
  await ensureKnowledgeDirs();
  const pdfPath = sourcePdfPath(params.slug);
  const mdPath = conceptPath(params.slug);

  await atomicWriteFile(pdfPath, params.pdfBytes);
  try {
    await atomicWriteFile(mdPath, params.fileContents);
  } catch (err) {
    // Don't leave a PDF with no concept pointing at it (sources[].resource would dangle).
    await fs.unlink(pdfPath).catch(() => {});
    throw err;
  }

  try {
    await regenerateIndex();
  } catch {
    // index.md is a convenience listing, not the source of truth — listConcepts()
    // scans the directory directly, so a failure here doesn't lose the concept.
  }

  return { conceptPath: mdPath, sourcePdfPath: pdfPath };
}

export async function regenerateIndex(): Promise<void> {
  const { concepts } = await listConcepts();
  const rows = concepts
    .map((c) => {
      const added = c.frontmatter.generated?.at ?? "";
      return `| [${c.frontmatter.title ?? c.slug}](./${c.slug}.md) | ${c.frontmatter.type} | ${c.frontmatter.status ?? "stable"} | ${added} |`;
    })
    .join("\n");

  const frontmatter: OkfFrontmatter = {
    type: "Index",
    okf_version: "0.2",
    title: "BuddhiAI Knowledge Base",
    generated: { by: "buddhi-ai/ingest", at: new Date().toISOString() },
  };
  const body = `# Knowledge Base\n\n| Document | Type | Status | Added |\n|---|---|---|---|\n${rows}`;
  await atomicWriteFile(INDEX_PATH, stringifyConcept(frontmatter, body));
}

export async function listConcepts(): Promise<{ concepts: ConceptSummary[]; warnings: string[] }> {
  await ensureKnowledgeDirs();
  let entries: string[];
  try {
    entries = await fs.readdir(KNOWLEDGE_DIR);
  } catch {
    return { concepts: [], warnings: [] };
  }

  const concepts: ConceptSummary[] = [];
  const warnings: string[] = [];
  for (const entry of entries) {
    if (!entry.endsWith(".md") || RESERVED_FILES.has(entry)) continue;
    const slug = entry.slice(0, -3);
    try {
      const raw = await fs.readFile(path.join(KNOWLEDGE_DIR, entry), "utf-8");
      const { frontmatter } = parseConcept(raw);
      concepts.push({ slug, frontmatter, trustTier: trustTier(frontmatter) });
    } catch (err) {
      warnings.push(`Skipped "${entry}": ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  concepts.sort((a, b) => (b.frontmatter.generated?.at ?? "").localeCompare(a.frontmatter.generated?.at ?? ""));
  return { concepts, warnings };
}

export async function getConcept(slug: string): Promise<ConceptDetail | null> {
  let raw: string;
  try {
    raw = await fs.readFile(conceptPath(slug), "utf-8");
  } catch {
    return null;
  }
  // Let ConceptParseError propagate — the route maps it to a 422 with a clear message.
  const { frontmatter, body } = parseConcept(raw);
  return { slug, frontmatter, body, trustTier: trustTier(frontmatter) };
}

export function trustTier(fm: OkfFrontmatter): TrustTier {
  const verified = fm.verified;
  if (!verified || verified.length === 0) return "unverified";
  const humanReviewed = verified.some((v) => v.by?.startsWith("human:"));
  return humanReviewed ? "human-reviewed" : "machine-confirmed";
}

export { ConceptParseError };
