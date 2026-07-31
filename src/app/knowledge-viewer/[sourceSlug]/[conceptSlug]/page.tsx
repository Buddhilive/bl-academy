"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ConceptDetail } from "@/components/knowledge/concept-detail";
import { rewriteConceptLinks } from "@/lib/knowledge/rewrite-links";
import type { ConceptDetail as ConceptDetailType } from "@/lib/knowledge/types";

export default function KnowledgeConceptPage() {
    const params = useParams<{ sourceSlug: string; conceptSlug: string }>();
    const { sourceSlug, conceptSlug } = params;
    const [concept, setConcept] = React.useState<ConceptDetailType | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);
        fetch(`/api/knowledge/${sourceSlug}/${conceptSlug}`)
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data?.error ?? "Failed to load concept");
                return data as ConceptDetailType;
            })
            .then((data) => {
                if (isMounted) setConcept(data);
            })
            .catch((err) => {
                if (isMounted) setError(err?.message ?? "Failed to load concept");
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });
        return () => {
            isMounted = false;
        };
    }, [sourceSlug, conceptSlug]);

    const rendered = concept ? { ...concept, body: rewriteConceptLinks(concept.body, sourceSlug) } : null;

    return (
        <div className="container space-y-6 px-4 py-8">
            {loading && <div className="py-12 text-center text-sm text-muted-foreground">Loading...</div>}
            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Couldn't load this concept</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {!loading && !error && rendered && <ConceptDetail concept={rendered} />}
        </div>
    );
}
