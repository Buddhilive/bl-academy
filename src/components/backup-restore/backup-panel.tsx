"use client";

import { DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JobProgress } from "@/components/backup-restore/job-progress";
import { useBackupRestoreStore } from "@/components/backup-restore/store/use-backup-restore-store";

export function BackupPanel() {
  const backupStatus = useBackupRestoreStore((s) => s.backupStatus);
  const backupPercent = useBackupRestoreStore((s) => s.backupPercent);
  const backupMessage = useBackupRestoreStore((s) => s.backupMessage);
  const backupError = useBackupRestoreStore((s) => s.backupError);
  const backupJobId = useBackupRestoreStore((s) => s.backupJobId);
  const backupFileName = useBackupRestoreStore((s) => s.backupFileName);
  const startBackup = useBackupRestoreStore((s) => s.startBackup);

  const busy = backupStatus === "running";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Backup</CardTitle>
        <CardDescription>
          Downloads a zip containing the knowledge base markdown files and a SQL dump of your chat history.
        </CardDescription>
        <CardAction>
          <Button onClick={() => void startBackup()} disabled={busy}>
            {busy ? "Backing up..." : "Create Backup"}
          </Button>
        </CardAction>
      </CardHeader>
      {backupStatus !== "idle" && (
        <CardContent className="space-y-3">
          <JobProgress
            status={backupStatus}
            percent={backupPercent}
            message={backupMessage}
            error={backupError}
            doneMessage="Backup ready to download."
          />
          {backupStatus === "done" && backupJobId && (
            <Button variant="outline" size="sm" render={<a href={`/api/backup-restore/jobs/${backupJobId}/download`} />}>
              <DownloadIcon />
              Download {backupFileName ?? "backup.zip"}
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}
