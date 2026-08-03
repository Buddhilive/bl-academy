"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { JobProgress } from "@/components/backup-restore/job-progress";
import { useBackupRestoreStore } from "@/components/backup-restore/store/use-backup-restore-store";

const CONFIRM_PHRASE = "RESTORE";

export function RestorePanel() {
  const restoreStatus = useBackupRestoreStore((s) => s.restoreStatus);
  const restorePercent = useBackupRestoreStore((s) => s.restorePercent);
  const restoreMessage = useBackupRestoreStore((s) => s.restoreMessage);
  const restoreError = useBackupRestoreStore((s) => s.restoreError);
  const startRestore = useBackupRestoreStore((s) => s.startRestore);

  const [file, setFile] = useState<File | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const busy = restoreStatus === "running";
  const canConfirm = confirmText === CONFIRM_PHRASE;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (selected && !selected.name.toLowerCase().endsWith(".zip")) {
      toast.error("Please select a .zip backup file");
      e.target.value = "";
      return;
    }
    setFile(selected);
  };

  const handleConfirmRestore = () => {
    if (!file || !canConfirm) return;
    setConfirmOpen(false);
    setConfirmText("");
    void startRestore(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Restore from Backup</CardTitle>
        <CardDescription>
          Restoring replaces all current knowledge base files and chat history with the contents of the uploaded
          backup. This cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input type="file" accept=".zip" onChange={handleFileChange} disabled={busy} />

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <Button
            variant="destructive"
            disabled={!file || busy}
            onClick={() => setConfirmOpen(true)}
          >
            {busy ? "Restoring..." : "Restore"}
          </Button>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>This will delete all current data</AlertDialogTitle>
              <AlertDialogDescription>
                Restoring <strong>{file?.name}</strong> will permanently delete every knowledge base file and chat
                conversation currently stored, replacing them with the backup&apos;s contents. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-muted-foreground" htmlFor="restore-confirm-input">
                Type <strong>{CONFIRM_PHRASE}</strong> to confirm.
              </label>
              <Input
                id="restore-confirm-input"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                autoComplete="off"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogClose render={<Button variant="outline" />}>Cancel</AlertDialogClose>
              <Button variant="destructive" disabled={!canConfirm} onClick={handleConfirmRestore}>
                Delete everything and restore
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {restoreStatus !== "idle" && (
          <JobProgress
            status={restoreStatus}
            percent={restorePercent}
            message={restoreMessage}
            error={restoreError}
            doneMessage="Restore complete. Reloading..."
          />
        )}
      </CardContent>
    </Card>
  );
}
