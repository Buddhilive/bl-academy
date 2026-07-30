"use client";

import { AlertTriangleIcon, CheckCircle2Icon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { STAGE_PERCENT, type UploadStage } from "@/hooks/use-knowledge-upload";

const STAGE_LABELS: Partial<Record<UploadStage, string>> = {
  idle: "Waiting for a file...",
  received: "Uploading...",
  parsing: "Extracting text with EdgeParse...",
  parsed: "Extraction complete",
  assembling: "Building OKF concept...",
  writing: "Writing bundle files...",
  done: "Done",
  error: "Failed",
};

export interface UploadProgressProps {
  stage: UploadStage;
  error: string | null;
  onRetry?: () => void;
}

export function UploadProgress({ stage, error, onRetry }: UploadProgressProps) {
  const percent = STAGE_PERCENT[stage];

  if (stage === "error") {
    return (
      <Alert variant="destructive">
        <AlertTriangleIcon />
        <AlertTitle>Upload failed</AlertTitle>
        <AlertDescription>
          {error ?? "Something went wrong."}
          {onRetry && (
            <div className="mt-2">
              <Button size="sm" variant="outline" onClick={onRetry}>
                Retry
              </Button>
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Progress value={percent}>
        <ProgressLabel>{STAGE_LABELS[stage]}</ProgressLabel>
        <ProgressValue />
      </Progress>
      {stage === "done" && (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CheckCircle2Icon className="size-4 text-primary" />
          Document added to your knowledge base.
        </div>
      )}
    </div>
  );
}
