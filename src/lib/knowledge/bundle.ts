import type { Dirent } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

import { atomicWriteFile } from "./atomic-write";
import { ConceptParseError, parseConcept, stringifyConcept } from "./frontmatter";
import {
  conceptPath,
  ensureKnowledgeDirs,
  INDEX_PATH,
  KNOWLEDGE_DIR,
  legacyFlatConceptPath,
  LOG_PATH,
  sourceDir,
  sourceIndexPath,
  sourcePdfPath,
  sourcePdfRoute,
} from "./paths";
import { pathExists, slugify, uniqueConceptSlug } from "./slug";
import type {
  ConceptDetail,
  ConceptSummary,
  ExtractedConceptInput,
  GraphEdge,
  GraphNode,
  OkfFrontmatter,
  PatchConceptRequest,
  SourceSummary,
  TrustTier,
} from "./types";

export function buildConceptFrontmatter(params: {
  type: string;
  title: string;
  description: string;
  tags: string[];
  resource: string;
  sourceFilename: string;
  uploadTimeIso: string;
}): OkfFrontmatter {
  return {
    type: params.type,
    title: params.title,
    description: params.description,
    resource: params.resource,
    tags: params.tags,
    generated: { by: "buddhi-ai/ingest+gemma-4-e4b-it", at: params.uploadTimeIso },
    sources: [{ id: "original-pdf", resource: params.resource, title: params.sourceFilename }],
    status: "stable",
  };
}

/** Appends the literal cross-linking the OKF graph is built from. */
export function appendRelatedSection(body: string, related: { slug: string; title: string }[]): string {
  if (related.length === 0) return body;
  const links = related.map((r) => `- [${r.title}](./${r.slug}.md)`).join("\n");
  return `${body}\n\n## Related\n${links}\n`;
}

export async function persistExtractedConcepts(params: {
  sourceSlug: string;
  sourceFilename: string;
  pdfBytes: Buffer | null;
  concepts: ExtractedConceptInput[];
  relations: number[][];
  uploadTimeIso: string;
  mode: "create" | "reprocess";
}): Promise<{ sourceSlug: string; conceptSlugs: string[] }> {
  await ensureKnowledgeDirs();
  const dir = sourceDir(params.sourceSlug);

  if (params.mode === "reprocess") {
    // Full wipe + rebuild: a reprocess run fully replaces this source's prior
    // state, so there's no stale-concept diffing to do, and no slug-collision
    // churn against files that are about to be deleted anyway.
    await fs.rm(dir, { recursive: true, force: true }).catch(() => {});
    await fs.unlink(legacyFlatConceptPath(params.sourceSlug)).catch(() => {});
  }
  await fs.mkdir(dir, { recursive: true });

  const taken = new Set<string>();
  const slugs: string[] = [];
  for (const c of params.concepts) {
    slugs.push(await uniqueConceptSlug(params.sourceSlug, slugify(c.title), taken));
  }

  // Resolve [i,j] index pairs into per-concept related {slug,title} lists (symmetric).
  const related: { slug: string; title: string }[][] = params.concepts.map(() => []);
  for (const [i, j] of params.relations) {
    if (i === j || i < 0 || j < 0 || i >= slugs.length || j >= slugs.length) continue;
    related[i].push({ slug: slugs[j], title: params.concepts[j].title });
    related[j].push({ slug: slugs[i], title: params.concepts[i].title });
  }

  if (params.mode === "create") {
    if (!params.pdfBytes) throw new Error("pdfBytes is required when mode is 'create'");
    await atomicWriteFile(sourcePdfPath(params.sourceSlug), params.pdfBytes);
  }

  const resource = sourcePdfRoute(params.sourceSlug);
  for (let i = 0; i < params.concepts.length; i++) {
    const c = params.concepts[i];
    const frontmatter = buildConceptFrontmatter({
      type: c.type,
      title: c.title,
      description: c.description,
      tags: c.tags,
      resource,
      sourceFilename: params.sourceFilename,
      uploadTimeIso: params.uploadTimeIso,
    });
    const body = appendRelatedSection(c.body, related[i]);
    try {
      await atomicWriteFile(conceptPath(params.sourceSlug, slugs[i]), stringifyConcept(frontmatter, body));
    } catch (err) {
      // Roll back everything written so far this run rather than leaving a
      // half-written source directory.
      for (let k = 0; k < i; k++) {
        await fs.unlink(conceptPath(params.sourceSlug, slugs[k])).catch(() => {});
      }
      if (params.mode === "create") {
        await fs.unlink(sourcePdfPath(params.sourceSlug)).catch(() => {});
      }
      throw err;
    }
  }

  try {
    await writeSourceIndex(
      params.sourceSlug,
      params.concepts.map((c, i) => ({ slug: slugs[i], title: c.title, type: c.type })),
      params.sourceFilename
    );
  } catch {
    // convenience file, never fails the ingest
  }

  try {
    await regenerateRootIndex();
  } catch {
    // convenience file, never fails the ingest
  }

  try {
    const verb = params.mode === "reprocess" ? "Update" : "Creation";
    await appendLogEntry(
      `**${verb}**: [${params.sourceFilename}](./${params.sourceSlug}/index.md) — ${params.concepts.length} concept(s) extracted.`
    );
  } catch {
    // convenience file, never fails the ingest
  }

  return { sourceSlug: params.sourceSlug, conceptSlugs: slugs };
}

/** Per spec §8: subdirectory index.md is a plain progressive-disclosure listing —
 * no frontmatter (that's reserved for the bundle-root index.md only). */
async function writeSourceIndex(
  sourceSlug: string,
  concepts: { slug: string; title: string; type: string }[],
  sourceFilename: string
): Promise<void> {
  const items = concepts.map((c) => `* [${c.title}](./${c.slug}.md) - ${c.type}`).join("\n");
  await atomicWriteFile(sourceIndexPath(sourceSlug), `# ${sourceFilename}\n\n${items}\n`);
}

export async function regenerateRootIndex(): Promise<void> {
  const { sources } = await listSources();
  const rows = sources
    .map((s) => `| [${s.title}](./${s.sourceSlug}/index.md) | ${s.conceptCount} | ${s.generatedAt} |`)
    .join("\n");

  const frontmatter: OkfFrontmatter = {
    type: "Index",
    okf_version: "0.2",
    title: "BuddhiAI Knowledge Base",
    generated: { by: "buddhi-ai/ingest", at: new Date().toISOString() },
  };
  const body = `# Knowledge Base\n\n| Source | Concepts | Added |\n|---|---|---|\n${rows}`;
  await atomicWriteFile(INDEX_PATH, stringifyConcept(frontmatter, body));
}

const LOG_HEADER = "# Directory Update Log";

/** Prepends a bullet under today's date heading (newest-first, per spec §9),
 * creating the heading/file if needed. Tolerant of a missing/empty log.md. */
export async function appendLogEntry(entry: string): Promise<void> {
  const heading = `## ${new Date().toISOString().slice(0, 10)}`;
  let existing = "";
  try {
    existing = await fs.readFile(LOG_PATH, "utf-8");
  } catch {
    existing = "";
  }

  let next: string;
  if (!existing.trim()) {
    next = `${LOG_HEADER}\n\n${heading}\n* ${entry}\n`;
  } else if (existing.includes(heading)) {
    next = existing.replace(heading, `${heading}\n* ${entry}`);
  } else {
    const headerIdx = existing.indexOf(LOG_HEADER);
    if (headerIdx === -1) {
      next = `${LOG_HEADER}\n\n${heading}\n* ${entry}\n\n${existing}`;
    } else {
      const insertAt = existing.indexOf("\n", headerIdx) + 1;
      next = `${existing.slice(0, insertAt)}\n${heading}\n* ${entry}\n${existing.slice(insertAt)}`;
    }
  }
  await atomicWriteFile(LOG_PATH, next);
}

async function scanSourceConcepts(sourceSlug: string): Promise<{ concepts: ConceptSummary[]; warnings: string[] }> {
  const dir = sourceDir(sourceSlug);
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return { concepts: [], warnings: [] };
  }

  const concepts: ConceptSummary[] = [];
  const warnings: string[] = [];
  for (const entry of entries) {
    if (!entry.endsWith(".md") || entry === "index.md") continue;
    const slug = entry.slice(0, -3);
    try {
      const raw = await fs.readFile(path.join(dir, entry), "utf-8");
      const { frontmatter } = parseConcept(raw);
      concepts.push({ sourceSlug, slug, frontmatter, trustTier: trustTier(frontmatter) });
    } catch (err) {
      warnings.push(`Skipped "${sourceSlug}/${entry}": ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  return { concepts, warnings };
}

export async function listSources(): Promise<{ sources: SourceSummary[]; warnings: string[] }> {
  await ensureKnowledgeDirs();
  let entries: Dirent[];
  try {
    entries = await fs.readdir(KNOWLEDGE_DIR, { withFileTypes: true });
  } catch {
    return { sources: [], warnings: [] };
  }

  const sources: SourceSummary[] = [];
  const warnings: string[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === "sources") continue;
    const sourceSlug = entry.name;
    const { concepts, warnings: sourceWarnings } = await scanSourceConcepts(sourceSlug);
    warnings.push(...sourceWarnings);
    if (concepts.length === 0) continue;
    const title = concepts[0].frontmatter.sources?.[0]?.title ?? sourceSlug;
    const generatedAt =
      concepts
        .map((c) => c.frontmatter.generated?.at ?? "")
        .sort()
        .at(-1) ?? "";
    sources.push({ sourceSlug, title, conceptCount: concepts.length, generatedAt });
  }

  sources.sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
  return { sources, warnings };
}

export async function listConceptsInSource(
  sourceSlug: string
): Promise<{ concepts: ConceptSummary[]; warnings: string[] } | null> {
  if (!(await pathExists(sourceDir(sourceSlug)))) return null;
  return scanSourceConcepts(sourceSlug);
}

export async function getConcept(sourceSlug: string, conceptSlug: string): Promise<ConceptDetail | null> {
  let raw: string;
  try {
    raw = await fs.readFile(conceptPath(sourceSlug, conceptSlug), "utf-8");
  } catch {
    return null;
  }
  // Let ConceptParseError propagate — the route maps it to a 422 with a clear message.
  const { frontmatter, body } = parseConcept(raw);
  return { sourceSlug, slug: conceptSlug, frontmatter, body, trustTier: trustTier(frontmatter) };
}

/** Reads the current file, applies a save or verify patch, and atomically writes it back.
 * Returns null if the concept doesn't exist. Recomputes trustTier from what's actually
 * on disk after the write, rather than trusting an in-memory guess. */
export async function updateConcept(
  sourceSlug: string,
  conceptSlug: string,
  patch: PatchConceptRequest
): Promise<ConceptDetail | null> {
  const path_ = conceptPath(sourceSlug, conceptSlug);
  let raw: string;
  try {
    raw = await fs.readFile(path_, "utf-8");
  } catch {
    return null;
  }
  const current = parseConcept(raw);

  let frontmatter: OkfFrontmatter;
  let body: string;
  if (patch.action === "verify") {
    const verified = current.frontmatter.verified ? [...current.frontmatter.verified] : [];
    // TODO: replace with real user identity once auth exists.
    verified.push({ by: "human:user", at: new Date().toISOString() });
    frontmatter = { ...current.frontmatter, verified };
    body = current.body;
  } else {
    // tags is a full-array replace, not a merge — arrays don't merge meaningfully.
    frontmatter = { ...current.frontmatter, ...patch.frontmatter };
    body = patch.body;
  }

  await atomicWriteFile(path_, stringifyConcept(frontmatter, body));
  return getConcept(sourceSlug, conceptSlug);
}

const LINK_RE = /\[[^\]]*\]\(([^)]+)\)/g;

function resolveLinkTarget(sourceSlug: string, href: string): string | null {
  const cleaned = href.trim();
  if (/^https?:\/\//.test(cleaned) || cleaned.startsWith("/")) return null;
  const withoutPrefix = cleaned.replace(/^\.\//, "");
  if (!withoutPrefix.endsWith(".md") || withoutPrefix === "index.md") return null;
  const conceptSlug = withoutPrefix.slice(0, -3);
  if (conceptSlug.includes("/") || conceptSlug.includes("..")) return null;
  return `${sourceSlug}/${conceptSlug}`;
}

/** Walks every concept file in every source subdirectory and resolves cross-links
 * into a node/edge graph. Unresolvable/broken links are silently dropped — the
 * spec explicitly tolerates broken links, consumers must not reject over them. */
export async function buildGraph(): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
  await ensureKnowledgeDirs();
  let entries: Dirent[];
  try {
    entries = await fs.readdir(KNOWLEDGE_DIR, { withFileTypes: true });
  } catch {
    return { nodes: [], edges: [] };
  }

  const nodes: GraphNode[] = [];
  const nodeIds = new Set<string>();
  const bodies: { sourceSlug: string; conceptSlug: string; body: string }[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === "sources") continue;
    const sourceSlug = entry.name;
    let files: string[];
    try {
      files = await fs.readdir(sourceDir(sourceSlug));
    } catch {
      continue;
    }
    for (const file of files) {
      if (!file.endsWith(".md") || file === "index.md") continue;
      const conceptSlug = file.slice(0, -3);
      try {
        const raw = await fs.readFile(path.join(sourceDir(sourceSlug), file), "utf-8");
        const { frontmatter, body } = parseConcept(raw);
        const id = `${sourceSlug}/${conceptSlug}`;
        nodes.push({
          id,
          sourceSlug,
          conceptSlug,
          title: frontmatter.title ?? conceptSlug,
          type: frontmatter.type,
          trustTier: trustTier(frontmatter),
          description: frontmatter.description,
          isIsolated: true,
        });
        nodeIds.add(id);
        bodies.push({ sourceSlug, conceptSlug, body });
      } catch {
        // Malformed concept — dropped from the graph silently; listSources()
        // surfaces the same file as a warning for the non-graph views.
      }
    }
  }

  const edgeKeys = new Set<string>();
  const edges: GraphEdge[] = [];
  for (const { sourceSlug, conceptSlug, body } of bodies) {
    const from = `${sourceSlug}/${conceptSlug}`;
    for (const match of body.matchAll(LINK_RE)) {
      const to = resolveLinkTarget(sourceSlug, match[1]);
      if (!to || to === from || !nodeIds.has(to)) continue;
      const key = [from, to].sort().join("::");
      if (edgeKeys.has(key)) continue;
      edgeKeys.add(key);
      edges.push({ from, to });
    }
  }

  const connected = new Set<string>();
  for (const e of edges) {
    connected.add(e.from);
    connected.add(e.to);
  }
  for (const n of nodes) n.isIsolated = !connected.has(n.id);

  return { nodes, edges };
}

export function trustTier(fm: OkfFrontmatter): TrustTier {
  const verified = fm.verified;
  if (!verified || verified.length === 0) return "unverified";
  const humanReviewed = verified.some((v) => v.by?.startsWith("human:"));
  return humanReviewed ? "human-reviewed" : "machine-confirmed";
}

export { ConceptParseError };
