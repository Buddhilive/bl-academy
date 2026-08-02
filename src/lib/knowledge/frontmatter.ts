import matter from "gray-matter";

import type { OkfFrontmatter } from "./types";

export class ConceptParseError extends Error {}

export interface ParsedConcept {
  frontmatter: OkfFrontmatter;
  body: string;
}

/** Throws ConceptParseError on invalid YAML or a missing/empty `type` (OKF's only mandatory field). */
export function parseConcept(raw: string): ParsedConcept {
  let parsed: ReturnType<typeof matter>;
  try {
    parsed = matter(raw);
  } catch (err) {
    throw new ConceptParseError(`Invalid frontmatter: ${err instanceof Error ? err.message : String(err)}`);
  }
  const frontmatter = parsed.data as OkfFrontmatter;
  if (!frontmatter || typeof frontmatter.type !== "string" || !frontmatter.type.trim()) {
    throw new ConceptParseError("Missing required `type` field in frontmatter");
  }
  return { frontmatter, body: parsed.content.replace(/^\n+/, "") };
}

export function stringifyConcept(frontmatter: OkfFrontmatter, body: string): string {
  return matter.stringify(`\n${body}`, frontmatter as Record<string, unknown>);
}
