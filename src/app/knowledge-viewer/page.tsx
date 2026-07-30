"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpenIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ConceptCard } from "@/components/knowledge/concept-card";
import type { ConceptSummary } from "@/lib/knowledge/types";

export default function KnowledgeViewerPage() {
    const [concepts, setConcepts] = React.useState<ConceptSummary[]>([]);
    const [warnings, setWarnings] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        let isMounted = true;
        fetch("/api/knowledge")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load knowledge base");
                return res.json();
            })
            .then((data) => {
                if (!isMounted) return;
                setConcepts(data.concepts ?? []);
                setWarnings(data.warnings ?? []);
            })
            .catch((err) => {
                if (isMounted) setError(err?.message ?? "Failed to load knowledge base");
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="container max-w-5xl space-y-6 px-4 py-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Knowledge Viewer</h1>
                    <p className="text-sm text-muted-foreground">Browse ingested documents in your OKF knowledge base.</p>
                </div>
                <Button render={<Link href="/knowledge-base" />}>Upload PDF</Button>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Couldn't load knowledge base</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {warnings.length > 0 && (
                <Alert>
                    <AlertTitle>Some documents were skipped</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc pl-4">
                            {warnings.map((w) => (
                                <li key={w}>{w}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            {loading ? (
                <div className="py-12 text-center text-sm text-muted-foreground">Loading...</div>
            ) : concepts.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-16 text-center">
                    <BookOpenIcon className="size-10 text-muted-foreground opacity-50" />
                    <p className="text-base font-medium">No documents yet</p>
                    <p className="text-sm text-muted-foreground">Upload a PDF to start building your knowledge base.</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {concepts.map((concept) => (
                        <ConceptCard key={concept.slug} concept={concept} />
                    ))}
                </div>
            )}
        </div>
    );
}
