import fs from "node:fs/promises";
import path from "node:path";

import { parseConcept } from "./frontmatter";
import { ensureKnowledgeDirs, KNOWLEDGE_DIR, sourceDir } from "./paths";
import { trustTier } from "./bundle";
import type { TrustTier } from "./types";

export interface ConceptSearchResult {
  id: string;
  title: string;
  description: string;
  snippet: string;
  url: string;
  trustTier: TrustTier;
  tags: string[];
}

const STOPWORDS = new Set([
  "the", "a", "an", "of", "and", "or", "to", "in", "on", "for", "is", "are",
  "what", "how", "why", "when", "does", "do", "with", "about", "this", "that",
]);

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function snippetAround(body: string, terms: string[]): string {
  const lower = body.toLowerCase();
  let idx = -1;
  for (const term of terms) {
    idx = lower.indexOf(term);
    if (idx !== -1) break;
  }
  if (idx === -1) return body.slice(0, 200).trim();
  const start = Math.max(0, idx - 80);
  const end = Math.min(body.length, idx + 120);
  return `${start > 0 ? "…" : ""}${body.slice(start, end).trim()}${end < body.length ? "…" : ""}`;
}

/** Keyword search over OKF concept files — title/tags weighted above body text.
 * No vector store exists in this repo; bundles are small enough for a full scan. */
export async function searchConcepts(query: string, limit = 5): Promise<ConceptSearchResult[]> {
  const terms = tokenize(query);
  if (terms.length === 0) return [];

  await ensureKnowledgeDirs();
  let sourceEntries: string[];
  try {
    const entries = await fs.readdir(KNOWLEDGE_DIR, { withFileTypes: true });
    sourceEntries = entries.filter((e) => e.isDirectory() && e.name !== "sources").map((e) => e.name);
  } catch {
    return [];
  }

  const scored: (ConceptSearchResult & { score: number })[] = [];

  for (const sourceSlug of sourceEntries) {
    let files: string[];
    try {
      files = await fs.readdir(sourceDir(sourceSlug));
    } catch {
      continue;
    }
    for (const file of files) {
      if (!file.endsWith(".md") || file === "index.md") continue;
      const slug = file.slice(0, -3);
      let raw: string;
      try {
        raw = await fs.readFile(path.join(sourceDir(sourceSlug), file), "utf-8");
      } catch {
        continue;
      }
      let frontmatter, body: string;
      try {
        ({ frontmatter, body } = parseConcept(raw));
      } catch {
        continue;
      }

      const title = frontmatter.title ?? slug;
      const description = frontmatter.description ?? "";
      const tags = frontmatter.tags ?? [];
      const titleTokens = tokenize(title);
      const tagTokens = tokenize(tags.join(" "));
      const descTokens = tokenize(description);
      const bodyTokens = tokenize(body);

      let score = 0;
      for (const term of terms) {
        if (titleTokens.includes(term)) score += 5;
        if (tagTokens.includes(term)) score += 4;
        if (descTokens.includes(term)) score += 2;
        if (bodyTokens.includes(term)) score += 1;
      }
      if (score === 0) continue;

      scored.push({
        id: `${sourceSlug}/${slug}`,
        title,
        description,
        snippet: snippetAround(body, terms),
        url: `/knowledge-viewer/${sourceSlug}/${slug}`,
        trustTier: trustTier(frontmatter),
        tags,
        score,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(({ score: _score, ...rest }) => rest);
}
