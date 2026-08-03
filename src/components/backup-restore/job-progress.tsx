"use client";

import { AlertTriangleIcon, CheckCircle2Icon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import type { JobUiStatus } from "@/components/backup-restore/store/use-backup-restore-store";

export interface JobProgressProps {
  status: JobUiStatus;
  percent: number;
  message: string;
  error: string | null;
  doneMessage?: string;
}

export function JobProgress({ status, percent, message, error, doneMessage }: JobProgressProps) {
  if (status === "error") {
    return (
      <Alert variant="destructive">
        <AlertTriangleIcon />
        <AlertTitle>Failed</AlertTitle>
        <AlertDescription>{error ?? "Something went wrong."}</AlertDescription>
      </Alert>
    );
  }

  if (status === "idle") return null;

  return (
    <div className="flex flex-col gap-2">
      <Progress value={percent}>
        <ProgressLabel>{message}</ProgressLabel>
        <ProgressValue />
      </Progress>
      {status === "done" && (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CheckCircle2Icon className="size-4 text-primary" />
          {doneMessage ?? message}
        </div>
      )}
    </div>
  );
}
