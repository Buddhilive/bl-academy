"use client";

import { useRouter } from "next/navigation";

import { PdfDropzone } from "@/components/knowledge/pdf-dropzone";
import { UploadProgress } from "@/components/knowledge/upload-progress";
import { useKnowledgeUpload } from "@/hooks/use-knowledge-upload";
import { toast } from "sonner";

export default function KnowledgeBasePage() {
    const router = useRouter();
    const { stage, error, slug, uploadFile, reset } = useKnowledgeUpload();
    const busy = stage !== "idle" && stage !== "done" && stage !== "error";

    return (
        <div className="container max-w-2xl space-y-6 px-4 py-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Knowledge Base</h1>
                <p className="text-sm text-muted-foreground">
                    Upload a PDF to extract its content and add it to your knowledge base (OKF v0.2).
                </p>
            </div>

            <PdfDropzone
                disabled={busy}
                onFileSelected={(file) => {
                    void uploadFile(file);
                }}
                onRejected={(message) => toast.error(message)}
            />

            {stage !== "idle" && (
                <UploadProgress
                    stage={stage}
                    error={error}
                    onRetry={stage === "error" ? reset : undefined}
                />
            )}

            {stage === "done" && slug && (
                <button
                    type="button"
                    className="text-sm text-primary underline underline-offset-4"
                    onClick={() => router.push(`/knowledge-viewer/${slug}`)}
                >
                    View in Knowledge Viewer &rarr;
                </button>
            )}
        </div>
    );
}
