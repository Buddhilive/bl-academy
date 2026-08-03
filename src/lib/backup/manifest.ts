export const CURRENT_MANIFEST_VERSION = 1;

export interface BackupManifest {
  version: number;
  createdAt: string;
  /** Reserved for a future opt-in to include static/knowledge/sources/*.pdf. */
  includesSourcePdfs: false;
  counts: { chats: number; messages: number; concepts: number };
}

export class ManifestValidationError extends Error {}

export function validateManifest(json: unknown): BackupManifest {
  if (!json || typeof json !== "object") {
    throw new ManifestValidationError("manifest.json is missing or not an object");
  }
  const m = json as Record<string, unknown>;
  if (typeof m.version !== "number") {
    throw new ManifestValidationError("manifest.json is missing a numeric `version`");
  }
  if (m.version !== CURRENT_MANIFEST_VERSION) {
    throw new ManifestValidationError(
      `Unsupported backup version ${m.version} (expected ${CURRENT_MANIFEST_VERSION})`
    );
  }
  if (typeof m.createdAt !== "string") {
    throw new ManifestValidationError("manifest.json is missing `createdAt`");
  }
  const counts = m.counts as Record<string, unknown> | undefined;
  if (
    !counts ||
    typeof counts.chats !== "number" ||
    typeof counts.messages !== "number" ||
    typeof counts.concepts !== "number"
  ) {
    throw new ManifestValidationError("manifest.json is missing valid `counts`");
  }
  return {
    version: m.version,
    createdAt: m.createdAt,
    includesSourcePdfs: false,
    counts: { chats: counts.chats, messages: counts.messages, concepts: counts.concepts },
  };
}
