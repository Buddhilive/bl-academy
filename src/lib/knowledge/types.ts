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
  sourceSlug: string;
  slug: string;
  frontmatter: OkfFrontmatter;
  trustTier: TrustTier;
}

export interface ConceptDetail extends ConceptSummary {
  body: string;
}

export interface SourceSummary {
  sourceSlug: string;
  title: string;
  conceptCount: number;
  generatedAt: string;
}

export interface GraphNode {
  /** `${sourceSlug}/${conceptSlug}` */
  id: string;
  sourceSlug: string;
  conceptSlug: string;
  title: string;
  type: string;
  trustTier: TrustTier;
  description?: string;
  isIsolated: boolean;
}

export interface GraphEdge {
  from: string;
  to: string;
}

/** One classified section coming back from FastAPI's `extracted` SSE event. */
export interface ExtractedConceptInput {
  index: number;
  type: string;
  title: string;
  description: string;
  tags: string[];
  heading: string | null;
  body: string;
}
