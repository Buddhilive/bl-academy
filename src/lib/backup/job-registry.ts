import { EventEmitter } from "node:events";
import { nanoid } from "nanoid";

export type JobKind = "backup" | "restore";
export type JobStatus = "running" | "done" | "error";

export interface JobEvent {
  stage: string;
  message: string;
  percent: number;
  code?: string;
  [key: string]: unknown;
}

export interface JobResult {
  fileName?: string;
  sizeBytes?: number;
  /** Absolute path on disk — internal only, never sent to the client. */
  filePath?: string;
}

export interface JobState {
  id: string;
  kind: JobKind;
  status: JobStatus;
  events: JobEvent[];
  createdAt: number;
  updatedAt: number;
  result?: JobResult;
  error?: string;
}

/** Serializable view of a job — strips `result.filePath` before it ever reaches a route handler's response. */
export interface JobStateView extends Omit<JobState, "result"> {
  result?: Omit<JobResult, "filePath">;
}

export class JobBusyError extends Error {
  constructor() {
    super("A backup or restore job is already running");
  }
}

const GC_MAX_AGE_MS = 60 * 60 * 1000;

class JobRegistry {
  private jobs = new Map<string, JobState>();
  private emitter = new EventEmitter();

  create(kind: JobKind): JobState {
    this.gc();
    const busy = [...this.jobs.values()].some((j) => j.status === "running");
    if (busy) throw new JobBusyError();

    const now = Date.now();
    const job: JobState = {
      id: nanoid(12),
      kind,
      status: "running",
      events: [],
      createdAt: now,
      updatedAt: now,
    };
    this.jobs.set(job.id, job);
    return job;
  }

  get(id: string): JobState | undefined {
    return this.jobs.get(id);
  }

  getActive(): { backupJobId: string | null; restoreJobId: string | null } {
    let backupJobId: string | null = null;
    let restoreJobId: string | null = null;
    for (const job of this.jobs.values()) {
      if (job.kind === "backup" && (!backupJobId || job.createdAt > (this.jobs.get(backupJobId)?.createdAt ?? 0))) {
        backupJobId = job.id;
      }
      if (job.kind === "restore" && (!restoreJobId || job.createdAt > (this.jobs.get(restoreJobId)?.createdAt ?? 0))) {
        restoreJobId = job.id;
      }
    }
    return { backupJobId, restoreJobId };
  }

  emitEvent(id: string, event: JobEvent): void {
    const job = this.jobs.get(id);
    if (!job) return;
    job.events.push(event);
    job.updatedAt = Date.now();
    if (event.stage === "done") job.status = "done";
    if (event.stage === "error") {
      job.status = "error";
      job.error = event.message;
    }
    this.emitter.emit(`job:${id}`, event);
  }

  setResult(id: string, result: JobResult): void {
    const job = this.jobs.get(id);
    if (!job) return;
    job.result = result;
  }

  subscribe(id: string, listener: (event: JobEvent) => void): () => void {
    const wrapped = (event: JobEvent) => listener(event);
    this.emitter.on(`job:${id}`, wrapped);
    return () => this.emitter.off(`job:${id}`, wrapped);
  }

  /** Best-effort prune of long-finished jobs, run opportunistically from create(). */
  private gc(): void {
    const cutoff = Date.now() - GC_MAX_AGE_MS;
    for (const [id, job] of this.jobs) {
      if (job.status !== "running" && job.updatedAt < cutoff) this.jobs.delete(id);
    }
  }
}

// Guard against dev-mode module reload spawning a second registry, which would
// silently break "progress survives navigation" (a fresh registry loses all jobs).
declare global {
  var __buddhiJobRegistry: JobRegistry | undefined;
}

export const jobRegistry: JobRegistry = globalThis.__buddhiJobRegistry ?? new JobRegistry();
globalThis.__buddhiJobRegistry = jobRegistry;
