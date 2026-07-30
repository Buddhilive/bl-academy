import fs from "node:fs/promises";
import { nanoid } from "nanoid";

import { conceptPath, isReservedSlug } from "./paths";

export function slugify(filename: string): string {
  const base = filename.replace(/\.[^./\\]+$/, "");
  const slug = base
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "document";
}

async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/** Appends a short random suffix if the slug collides with an existing concept or a reserved name. */
export async function uniqueSlug(base: string): Promise<string> {
  let candidate = base;
  while (isReservedSlug(candidate) || (await pathExists(conceptPath(candidate)))) {
    candidate = `${base}-${nanoid(6)}`;
  }
  return candidate;
}
