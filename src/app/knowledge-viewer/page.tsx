"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpenIcon, RefreshCwIcon, UploadIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { GraphCanvas } from "@/components/knowledge/graph-canvas";
import { useKnowledgeUpload } from "@/hooks/use-knowledge-upload";
import type { GraphEdge, GraphNode, SourceSummary } from "@/lib/knowledge/types";

export default function KnowledgeViewerPage() {
    const [graph, setGraph] = React.useState<{ nodes: GraphNode[]; edges: GraphEdge[] }>({ nodes: [], edges: [] });
    const [sources, setSources] = React.useState<SourceSummary[]>([]);
    const [warnings, setWarnings] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const { stage, error: reprocessError, reprocess } = useKnowledgeUpload();
    const [reprocessingSlug, setReprocessingSlug] = React.useState<string | null>(null);

    const load = React.useCallback(() => {
        setLoading(true);
        setError(null);
        Promise.all([
            fetch("/api/knowledge/graph").then((res) => {
                if (!res.ok) throw new Error("Failed to load knowledge graph");
                return res.json();
            }),
            fetch("/api/knowledge").then((res) => {
                if (!res.ok) throw new Error("Failed to load knowledge base");
                return res.json();
            }),
        ])
            .then(([graphData, listData]) => {
                setGraph({ nodes: graphData.nodes ?? [], edges: graphData.edges ?? [] });
                setSources(listData.sources ?? []);
                setWarnings(listData.warnings ?? []);
            })
            .catch((err) => setError(err?.message ?? "Failed to load knowledge base"))
            .finally(() => setLoading(false));
    }, []);

    React.useEffect(() => {
        load();
    }, [load]);

    React.useEffect(() => {
        if (!reprocessingSlug) return;
        if (stage === "done") {
            setReprocessingSlug(null);
            load();
        } else if (stage === "error") {
            setReprocessingSlug(null);
        }
    }, [stage, reprocessingSlug, load]);

    const handleReprocess = (sourceSlug: string) => {
        setReprocessingSlug(sourceSlug);
        void reprocess(sourceSlug);
    };

    return (
        <div className="container space-y-6 px-4 py-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Knowledge Viewer</h1>
                    <p className="text-sm text-muted-foreground">Explore your OKF knowledge graph.</p>
                </div>
                <Button render={<Link href="/knowledge-base" />}>
                    <UploadIcon /> Upload PDF
                </Button>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Couldn't load knowledge base</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {reprocessingSlug === null && stage === "error" && reprocessError && (
                <Alert variant="destructive">
                    <AlertTitle>Reprocess failed</AlertTitle>
                    <AlertDescription>{reprocessError}</AlertDescription>
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
            ) : graph.nodes.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-16 text-center">
                    <BookOpenIcon className="size-10 text-muted-foreground opacity-50" />
                    <p className="text-base font-medium">No documents yet</p>
                    <p className="text-sm text-muted-foreground">Upload a PDF to start building your knowledge graph.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
                    <GraphCanvas nodes={graph.nodes} edges={graph.edges} />
                    <div className="flex flex-col gap-2">
                        <h2 className="text-sm font-semibold text-muted-foreground">Sources</h2>
                        {sources.map((s) => (
                            <div
                                key={s.sourceSlug}
                                className="flex items-center justify-between gap-2 rounded-md border p-2 text-sm"
                            >
                                <div className="min-w-0">
                                    <div className="truncate font-medium">{s.title}</div>
                                    <div className="text-xs text-muted-foreground">{s.conceptCount} concept(s)</div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={reprocessingSlug === s.sourceSlug}
                                    onClick={() => handleReprocess(s.sourceSlug)}
                                    title="Re-run concept extraction for this document"
                                >
                                    <RefreshCwIcon className={reprocessingSlug === s.sourceSlug ? "animate-spin" : ""} />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
