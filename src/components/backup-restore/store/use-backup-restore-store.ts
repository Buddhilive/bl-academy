import { create } from "zustand";
import { toast } from "sonner";

export type JobKind = "backup" | "restore";
export type JobUiStatus = "idle" | "running" | "done" | "error";

interface JobEvent {
  stage: string;
  message: string;
  percent: number;
  code?: string;
  fileName?: string;
  sizeBytes?: number;
  [key: string]: unknown;
}

interface BackupRestoreState {
  backupJobId: string | null;
  backupStatus: JobUiStatus;
  backupStage: string;
  backupPercent: number;
  backupMessage: string;
  backupError: string | null;
  backupFileName: string | null;

  restoreJobId: string | null;
  restoreStatus: JobUiStatus;
  restoreStage: string;
  restorePercent: number;
  restoreMessage: string;
  restoreError: string | null;

  startBackup: () => Promise<void>;
  startRestore: (file: File) => Promise<void>;
  connectToJob: (jobId: string, kind: JobKind) => void;
  resumeActiveJobs: () => Promise<void>;
  resetBackup: () => void;
  resetRestore: () => void;
}

const SESSION_KEY_PREFIX = "backupRestore.activeJobId.";

// Module-scope, not component state: this is what lets the SSE reader loop keep
// running (and keep writing into the store) after the page component that
// started it has unmounted from client-side navigation.
const activeReaders = new Map<string, AbortController>();

function persistActiveJob(kind: JobKind, jobId: string | null) {
  if (typeof window === "undefined") return;
  const key = `${SESSION_KEY_PREFIX}${kind}`;
  if (jobId) sessionStorage.setItem(key, jobId);
  else sessionStorage.removeItem(key);
}

async function readSse(response: Response, onEvent: (event: JobEvent) => void): Promise<void> {
  if (!response.body) {
    onEvent({ stage: "error", message: "No response from server", percent: 100 });
    return;
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const parts = buf.split("\n\n");
    buf = parts.pop() ?? "";
    for (const line of parts) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6);
      if (payload === "[DONE]") continue;
      try {
        onEvent(JSON.parse(payload) as JobEvent);
      } catch {
        // ignore malformed SSE line
      }
    }
  }
}

export const useBackupRestoreStore = create<BackupRestoreState>((set, get) => ({
  backupJobId: null,
  backupStatus: "idle",
  backupStage: "",
  backupPercent: 0,
  backupMessage: "",
  backupError: null,
  backupFileName: null,

  restoreJobId: null,
  restoreStatus: "idle",
  restoreStage: "",
  restorePercent: 0,
  restoreMessage: "",
  restoreError: null,

  startBackup: async () => {
    set({
      backupStatus: "running",
      backupStage: "starting",
      backupPercent: 0,
      backupMessage: "Starting backup...",
      backupError: null,
      backupFileName: null,
    });
    try {
      const res = await fetch("/api/backup-restore/backup", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to start backup");
      set({ backupJobId: data.jobId });
      persistActiveJob("backup", data.jobId);
      get().connectToJob(data.jobId, "backup");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start backup";
      set({ backupStatus: "error", backupError: message });
      toast.error(message);
    }
  },

  startRestore: async (file: File) => {
    set({
      restoreStatus: "running",
      restoreStage: "starting",
      restorePercent: 0,
      restoreMessage: "Uploading backup...",
      restoreError: null,
    });
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("confirm", "true");
      const res = await fetch("/api/backup-restore/restore", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to start restore");
      set({ restoreJobId: data.jobId });
      persistActiveJob("restore", data.jobId);
      get().connectToJob(data.jobId, "restore");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start restore";
      set({ restoreStatus: "error", restoreError: message });
      toast.error(message);
    }
  },

  connectToJob: (jobId: string, kind: JobKind) => {
    if (activeReaders.has(jobId)) return; // already streaming this job
    const controller = new AbortController();
    activeReaders.set(jobId, controller);

    const applyEvent = (event: JobEvent) => {
      const isBackup = kind === "backup";
      const terminal = event.stage === "done" || event.stage === "error";
      const status: JobUiStatus = terminal ? (event.stage === "done" ? "done" : "error") : "running";

      if (isBackup) {
        set((state) => ({
          backupJobId: jobId,
          backupStage: event.stage,
          backupPercent: event.percent,
          backupMessage: event.message,
          backupStatus: status,
          backupError: event.stage === "error" ? event.message : null,
          backupFileName: event.stage === "done" ? (event.fileName as string) ?? null : state.backupFileName,
        }));
      } else {
        set({
          restoreJobId: jobId,
          restoreStage: event.stage,
          restorePercent: event.percent,
          restoreMessage: event.message,
          restoreStatus: status,
          restoreError: event.stage === "error" ? event.message : null,
        });
      }

      if (terminal) {
        persistActiveJob(kind, null);
        if (event.stage === "done") {
          toast.success(isBackup ? "Backup complete" : "Restore complete");
          if (!isBackup) {
            // Chat/knowledge state elsewhere in the app is now stale — reload
            // the whole app rather than trying to patch every store in place.
            setTimeout(() => {
              if (typeof window !== "undefined") window.location.href = "/";
            }, 1500);
          }
        } else {
          toast.error(event.message);
        }
      }
    };

    (async () => {
      try {
        const res = await fetch(`/api/backup-restore/jobs/${jobId}/events`, { signal: controller.signal });
        await readSse(res, applyEvent);
      } catch (err) {
        if (controller.signal.aborted) return;
        const message = err instanceof Error ? err.message : "Lost connection to job";
        applyEvent({ stage: "error", message, percent: 100 });
      } finally {
        activeReaders.delete(jobId);
      }
    })();
  },

  resumeActiveJobs: async () => {
    try {
      const res = await fetch("/api/backup-restore/jobs/active");
      const data = (await res.json()) as { backupJobId: string | null; restoreJobId: string | null };
      if (data.backupJobId) get().connectToJob(data.backupJobId, "backup");
      if (data.restoreJobId) get().connectToJob(data.restoreJobId, "restore");
    } catch {
      // best-effort — sessionStorage-only jobIds (if any) still work via connectToJob
      if (typeof window === "undefined") return;
      const backupId = sessionStorage.getItem(`${SESSION_KEY_PREFIX}backup`);
      const restoreId = sessionStorage.getItem(`${SESSION_KEY_PREFIX}restore`);
      if (backupId) get().connectToJob(backupId, "backup");
      if (restoreId) get().connectToJob(restoreId, "restore");
    }
  },

  resetBackup: () =>
    set({
      backupJobId: null,
      backupStatus: "idle",
      backupStage: "",
      backupPercent: 0,
      backupMessage: "",
      backupError: null,
      backupFileName: null,
    }),

  resetRestore: () =>
    set({
      restoreJobId: null,
      restoreStatus: "idle",
      restoreStage: "",
      restorePercent: 0,
      restoreMessage: "",
      restoreError: null,
    }),
}));
