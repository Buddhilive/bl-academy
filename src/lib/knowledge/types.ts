export type TrustTier = "unverified" | "machine-confirmed" | "human-reviewed";

export interface OkfSource {
  id: string;
  resource: string;
  title?: string;
  author?: string;
  usage_count?: number;
  last_modified?: string;
}

export interface OkfVerified {
  by: string;
  at: string;
}

export interface OkfGenerated {
  by: string;
  at: string;
}

export interface OkfFrontmatter {
  type: string;
  title?: string;
  description?: string;
  resource?: string;
  tags?: string[];
  generated?: OkfGenerated;
  sources?: OkfSource[];
  verified?: OkfVerified[];
  status?: "draft" | "stable" | "deprecated";
  stale_after?: string;
  [key: string]: unknown;
}

export interface ConceptSummary {
  slug: string;
  frontmatter: OkfFrontmatter;
  trustTier: TrustTier;
}

export interface ConceptDetail extends ConceptSummary {
  body: string;
}
