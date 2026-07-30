import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrustBadge } from "@/components/knowledge/trust-badge";
import type { ConceptSummary } from "@/lib/knowledge/types";

export function ConceptCard({ concept }: { concept: ConceptSummary }) {
  const { frontmatter } = concept;
  return (
    <Link href={`/knowledge-viewer/${concept.slug}`}>
      <Card className="h-full transition-colors hover:border-primary/50">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base">{frontmatter.title ?? concept.slug}</CardTitle>
            <TrustBadge tier={concept.trustTier} />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
          {frontmatter.description && <p className="line-clamp-2">{frontmatter.description}</p>}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span>{frontmatter.type}</span>
            <span>{frontmatter.status ?? "stable"}</span>
            {frontmatter.generated?.at && <span>{new Date(frontmatter.generated.at).toLocaleDateString()}</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
