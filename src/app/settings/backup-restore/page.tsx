"use client";

import { useEffect } from "react";

import { BackupPanel } from "@/components/backup-restore/backup-panel";
import { RestorePanel } from "@/components/backup-restore/restore-panel";
import { useBackupRestoreStore } from "@/components/backup-restore/store/use-backup-restore-store";

export default function BackupRestorePage() {
  const resumeActiveJobs = useBackupRestoreStore((s) => s.resumeActiveJobs);

  useEffect(() => {
    void resumeActiveJobs();
  }, [resumeActiveJobs]);

  return (
    <div className="container max-w-2xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Backup &amp; Restore</h1>
        <p className="text-sm text-muted-foreground">
          Back up your chat history to a zip file, or restore from a previous backup.
        </p>
      </div>

      <BackupPanel />
      <RestorePanel />
    </div>
  );
}
