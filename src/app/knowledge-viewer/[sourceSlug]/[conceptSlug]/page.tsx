"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ConceptDetail } from "@/components/knowledge/concept-detail";
import { ConceptEditor } from "@/components/knowledge/concept-editor";
import { rewriteConceptLinks } from "@/lib/knowledge/rewrite-links";
import type { ConceptDetail as ConceptDetailType, PatchConceptRequest } from "@/lib/knowledge/types";

// Inlined rather than imported from "@/lib/knowledge/paths": that module pulls in
// node:fs/promises, which Turbopack refuses to bundle into a client component.
function sourcePdfRoute(sourceSlug: string): string {
    return `/api/static/knowledge/sources/${sourceSlug}.pdf`;
}

export default function KnowledgeConceptPage() {
    const params = useParams<{ sourceSlug: string; conceptSlug: string }>();
    const { sourceSlug, conceptSlug } = params;
    const [concept, setConcept] = React.useState<ConceptDetailType | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [editing, setEditing] = React.useState(false);
    const [verifying, setVerifying] = React.useState(false);

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

    const handleVerify = async () => {
        setVerifying(true);
        try {
            const patch: PatchConceptRequest = { action: "verify" };
            const res = await fetch(`/api/knowledge/${sourceSlug}/${conceptSlug}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patch),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error ?? "Failed to verify concept");
            setConcept(data as ConceptDetailType);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to verify concept");
        } finally {
            setVerifying(false);
        }
    };

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
            {!loading && !error && rendered && (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <iframe
                        src={sourcePdfRoute(sourceSlug)}
                        title="Source document"
                        className="h-[50vh] w-full rounded-lg border lg:h-[80vh]"
                    />
                    <div className="lg:h-[80vh] lg:overflow-y-auto">
                        {editing ? (
                            <ConceptEditor
                                concept={concept!}
                                onCancel={() => setEditing(false)}
                                onSaved={(updated) => {
                                    setConcept(updated);
                                    setEditing(false);
                                }}
                            />
                        ) : (
                            <ConceptDetail
                                concept={rendered}
                                onEdit={() => setEditing(true)}
                                onVerify={handleVerify}
                                verifying={verifying}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
