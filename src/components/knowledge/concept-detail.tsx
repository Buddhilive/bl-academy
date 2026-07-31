import { Streamdown } from "streamdown";

import { Badge } from "@/components/ui/badge";
import { TrustBadge } from "@/components/knowledge/trust-badge";
import type { ConceptDetail as ConceptDetailType } from "@/lib/knowledge/types";

export function ConceptDetail({ concept }: { concept: ConceptDetailType }) {
  const { frontmatter, body } = concept;

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold">{frontmatter.title ?? concept.slug}</h1>
          <TrustBadge tier={concept.trustTier} />
          <Badge variant="outline">{frontmatter.status ?? "stable"}</Badge>
        </div>
        {frontmatter.description && <p className="text-sm text-muted-foreground">{frontmatter.description}</p>}
      </div>

      <dl className="grid grid-cols-1 gap-3 rounded-lg border p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Type</dt>
          <dd>{frontmatter.type}</dd>
        </div>
        {frontmatter.generated && (
          <div>
            <dt className="text-muted-foreground">Generated</dt>
            <dd>
              {frontmatter.generated.by} &middot; {new Date(frontmatter.generated.at).toLocaleString()}
            </dd>
          </div>
        )}
        {frontmatter.stale_after && (
          <div>
            <dt className="text-muted-foreground">Stale after</dt>
            <dd>{frontmatter.stale_after}</dd>
          </div>
        )}
        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div>
            <dt className="text-muted-foreground">Tags</dt>
            <dd className="flex flex-wrap gap-1">
              {frontmatter.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </dd>
          </div>
        )}
        {frontmatter.sources && frontmatter.sources.length > 0 && (
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Sources</dt>
            <dd className="flex flex-col gap-1">
              {frontmatter.sources.map((source) => (
                <a
                  key={source.id}
                  href={source.resource}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  {source.title ?? source.resource}
                </a>
              ))}
            </dd>
          </div>
        )}
      </dl>

      <div className="prose prose-sm dark:prose-invert max-w-none">
        <Streamdown>{body}</Streamdown>
      </div>
    </div>
  );
}
