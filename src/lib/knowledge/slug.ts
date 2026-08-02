import fs from "node:fs/promises";
import { nanoid } from "nanoid";

import { conceptPath, isReservedSlug, sourceDir } from "./paths";

export function slugify(filename: string): string {
  const base = filename.replace(/\.[^./\\]+$/, "");
  const slug = base
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "document";
}

export async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/** Appends a short random suffix if the slug collides with an existing source directory or a reserved name. */
export async function uniqueSourceSlug(base: string): Promise<string> {
  let candidate = base;
  while (isReservedSlug(candidate) || (await pathExists(sourceDir(candidate)))) {
    candidate = `${base}-${nanoid(6)}`;
  }
  return candidate;
}

/**
 * Appends a short random suffix if the slug collides with an existing concept
 * file in this source directory, a reserved name, or another slug already
 * assigned earlier in the same extraction run (`taken` — callers must pass
 * the same Set across a batch, since disk checks alone can't catch two new
 * concepts sharing a title within one run).
 */
export async function uniqueConceptSlug(sourceSlug: string, base: string, taken: Set<string>): Promise<string> {
  let candidate = base;
  while (candidate === "index" || taken.has(candidate) || (await pathExists(conceptPath(sourceSlug, candidate)))) {
    candidate = `${base}-${nanoid(6)}`;
  }
  taken.add(candidate);
  return candidate;
}
