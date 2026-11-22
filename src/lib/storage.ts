export interface LessonProgress {
  lesson_slug: string;
  completed: boolean;
  saved_code: string;
  xp_earned: number;
  updated_at: string;
}

export interface ProgressExportEnvelope {
  schema: 'bl-academy-progress';
  version: 1;
  exported_at: string;
  records: LessonProgress[];
}

export const DB_NAME = 'bl_academy_db';
export const DB_VERSION = 1;
export const PROGRESS_STORE = 'lesson_progress';
export const META_STORE = 'meta';

export const STORAGE_PREFIX = 'lesson_progress_';
export const MIGRATION_META_KEY = 'localStorage_migrated_v1';
export const PROGRESS_CHANNEL_NAME = 'bl-academy-progress';
export const PROGRESS_EVENT_NAME = 'bl:progress-updated';

export const MAX_SAVED_CODE_LENGTH = 65536; // 64 KB cap
export const MAX_IMPORT_BYTES = 5 * 1024 * 1024; // 5 MB cap
export const MAX_IMPORT_RECORDS = 5000;

const SLUG_REGEX = /^[a-z0-9][a-z0-9-_/]*$/i;

/**
 * Validates whether a lesson slug is well-formed.
 */
export function isValidSlug(slug: unknown): slug is string {
  return (
    typeof slug === 'string' &&
    slug.length > 0 &&
    slug.length <= 128 &&
    SLUG_REGEX.test(slug)
  );
}

/**
 * Clamps code string to the maximum allowed character length.
 */
export function clampCode(code: unknown): string {
  if (typeof code !== 'string') return '';
  return code.length > MAX_SAVED_CODE_LENGTH
    ? code.slice(0, MAX_SAVED_CODE_LENGTH)
    : code;
}

function normalizeIsoTimestamp(value: unknown): string {
  if (typeof value === 'string' && !Number.isNaN(Date.parse(value))) {
    return new Date(value).toISOString();
  }
  return new Date().toISOString();
}

function normalizeXp(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return Math.floor(value);
  }
  return 0;
}

/**
 * Strictly constructs a sanitized LessonProgress object using allowlisted fields
 * to prevent prototype pollution or malformed data from external JSON imports.
 */
function sanitizeProgressRecord(
  raw: unknown,
  fallbackSlug?: string
): LessonProgress | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const obj = raw as Record<string, unknown>;
  const slug = fallbackSlug ?? obj.lesson_slug;
  if (!isValidSlug(slug)) return null;

  return {
    lesson_slug: slug,
    completed: Boolean(obj.completed),
    saved_code: clampCode(obj.saved_code ?? ''),
    xp_earned: normalizeXp(obj.xp_earned),
    updated_at: normalizeIsoTimestamp(obj.updated_at),
  };
}

/**
 * In-memory fallback for environments where IndexedDB/localStorage are unavailable
 * (SSR, private browsing, restricted iframes, or quota errors).
 */
class MemoryProgressStore {
  private progress = new Map<string, LessonProgress>();
  private meta = new Map<string, unknown>();

  get(slug: string): LessonProgress | null {
    return this.progress.get(slug) ?? null;
  }

  put(record: LessonProgress): void {
    this.progress.set(record.lesson_slug, record);
  }

  delete(slug: string): void {
    this.progress.delete(slug);
  }

  clear(): void {
    this.progress.clear();
  }

  getAll(): LessonProgress[] {
    return Array.from(this.progress.values());
  }

  getMeta(key: string): unknown {
    return this.meta.get(key);
  }

  setMeta(key: string, value: unknown): void {
    this.meta.set(key, value);
  }
}

const memoryFallback = new MemoryProgressStore();

/**
 * SSR-safe localStorage accessor used only for one-time legacy migration and tests.
 */
export function getSafeLocalStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    const testKey = '__bl_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    return null;
  }
}

let dbPromise: Promise<IDBDatabase | null> | null = null;
let migrationPromise: Promise<number> | null = null;
let broadcastChannel: BroadcastChannel | null = null;

function getBroadcastChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') {
    return null;
  }
  if (!broadcastChannel) {
    try {
      broadcastChannel = new BroadcastChannel(PROGRESS_CHANNEL_NAME);
    } catch {
      return null;
    }
  }
  return broadcastChannel;
}

/**
 * Emits a progress update notification to both the current tab and other tabs.
 */
export function notifyProgressUpdate(slug?: string): void {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent(PROGRESS_EVENT_NAME, { detail: { slug } })
  );

  const channel = getBroadcastChannel();
  if (channel) {
    try {
      channel.postMessage({ type: 'progress-updated', slug: slug ?? null });
    } catch {
      // Ignore closed/unavailable channel errors
    }
  }
}

/**
 * Subscribes to same-tab and cross-tab (BroadcastChannel) progress updates.
 * Returns an unsubscribe cleanup callback.
 */
export function subscribeProgressUpdates(listener: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleCustomEvent = () => {
    listener();
  };

  window.addEventListener(PROGRESS_EVENT_NAME, handleCustomEvent);

  let channel: BroadcastChannel | null = null;
  let handleChannelMessage: ((event: MessageEvent) => void) | null = null;

  if (typeof BroadcastChannel !== 'undefined') {
    try {
      channel = new BroadcastChannel(PROGRESS_CHANNEL_NAME);
      handleChannelMessage = (event: MessageEvent) => {
        const data = event.data as { type?: unknown } | null;
        if (data && typeof data === 'object' && data.type === 'progress-updated') {
          listener();
        }
      };
      channel.addEventListener('message', handleChannelMessage);
    } catch {
      channel = null;
    }
  }

  return () => {
    window.removeEventListener(PROGRESS_EVENT_NAME, handleCustomEvent);
    if (channel && handleChannelMessage) {
      channel.removeEventListener('message', handleChannelMessage);
      channel.close();
    }
  };
}

function openDatabase(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || typeof window.indexedDB === 'undefined') {
    return Promise.resolve(null);
  }
  if (dbPromise) return dbPromise;

  dbPromise = new Promise<IDBDatabase | null>((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
          const store = db.createObjectStore(PROGRESS_STORE, {
            keyPath: 'lesson_slug',
          });
          store.createIndex('updated_at', 'updated_at', { unique: false });
          store.createIndex('completed', 'completed', { unique: false });
        }
        if (!db.objectStoreNames.contains(META_STORE)) {
          db.createObjectStore(META_STORE, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => {
          db.close();
          dbPromise = null;
        };
        resolve(db);
      };

      request.onerror = () => {
        console.warn('[storage] IndexedDB open failed, falling back to memory:', request.error);
        dbPromise = null;
        resolve(null);
      };

      request.onblocked = () => {
        console.warn('[storage] IndexedDB open blocked');
      };
    } catch (err) {
      console.warn('[storage] IndexedDB unavailable, falling back to memory:', err);
      dbPromise = null;
      resolve(null);
    }
  });

  return dbPromise;
}

function idbRequest<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbTransactionDone(tx: IDBTransaction): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error ?? new Error('Transaction aborted'));
  });
}

function mergeRecords(
  existing: LessonProgress | null,
  incoming: LessonProgress
): LessonProgress {
  if (!existing) return incoming;
  const existingTime = Date.parse(existing.updated_at);
  const incomingTime = Date.parse(incoming.updated_at);
  const useIncomingCode =
    Number.isNaN(existingTime) ||
    (!Number.isNaN(incomingTime) && incomingTime >= existingTime);

  return {
    lesson_slug: existing.lesson_slug,
    completed: existing.completed || incoming.completed,
    xp_earned: Math.max(existing.xp_earned, incoming.xp_earned),
    saved_code: useIncomingCode ? incoming.saved_code : existing.saved_code,
    updated_at: useIncomingCode ? incoming.updated_at : existing.updated_at,
  };
}

/**
 * One-time idempotent migration of legacy `lesson_progress_*` keys from
 * `window.localStorage` into IndexedDB.
 */
export async function migrateFromLocalStorage(force = false): Promise<number> {
  if (migrationPromise && !force) {
    return migrationPromise;
  }

  const run = (async (): Promise<number> => {
    const ls = getSafeLocalStorage();
    if (!ls) return 0;

    const db = await openDatabase();

    if (db && !force) {
      try {
        const tx = db.transaction(META_STORE, 'readonly');
        const meta = (await idbRequest(
          tx.objectStore(META_STORE).get(MIGRATION_META_KEY)
        )) as { key: string; value: boolean } | undefined;
        if (meta?.value === true) return 0;
      } catch {
        // Proceed to migration check
      }
    } else if (!db && !force && memoryFallback.getMeta(MIGRATION_META_KEY) === true) {
      return 0;
    }

    const legacyRecords: LessonProgress[] = [];
    for (let i = 0; i < ls.length; i++) {
      const key = ls.key(i);
      if (!key || !key.startsWith(STORAGE_PREFIX)) continue;
      const slug = key.slice(STORAGE_PREFIX.length);
      if (!isValidSlug(slug)) continue;
      try {
        const raw = ls.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        const sanitized = sanitizeProgressRecord(parsed, slug);
        if (sanitized) legacyRecords.push(sanitized);
      } catch {
        // Skip malformed legacy entries
      }
    }

    let migratedCount = 0;

    if (db) {
      try {
        const tx = db.transaction([PROGRESS_STORE, META_STORE], 'readwrite');
        const progressStore = tx.objectStore(PROGRESS_STORE);
        const metaStore = tx.objectStore(META_STORE);

        for (const record of legacyRecords) {
          const existingRaw = await idbRequest(
            progressStore.get(record.lesson_slug)
          );
          const existing = sanitizeProgressRecord(existingRaw, record.lesson_slug);
          const merged = mergeRecords(existing, record);
          progressStore.put(merged);
          migratedCount++;
        }

        metaStore.put({
          key: MIGRATION_META_KEY,
          value: true,
          migrated_at: new Date().toISOString(),
        });
        await idbTransactionDone(tx);
      } catch (err) {
        console.warn('[storage] Legacy localStorage migration failed:', err);
        return 0;
      }
    } else {
      for (const record of legacyRecords) {
        const existing = memoryFallback.get(record.lesson_slug);
        memoryFallback.put(mergeRecords(existing, record));
        migratedCount++;
      }
      memoryFallback.setMeta(MIGRATION_META_KEY, true);
    }

    if (migratedCount > 0) {
      notifyProgressUpdate();
    }

    return migratedCount;
  })();

  migrationPromise = run;
  try {
    return await run;
  } finally {
    migrationPromise = null;
  }
}

async function ensureReady(): Promise<IDBDatabase | null> {
  const db = await openDatabase();
  await migrateFromLocalStorage();
  return db;
}

/**
 * Retrieves the progress record for a specific lesson from IndexedDB.
 */
export async function getProgress(slug: string): Promise<LessonProgress | null> {
  if (!isValidSlug(slug)) {
    console.warn(`[storage] Invalid lesson slug: "${slug}"`);
    return null;
  }

  const db = await ensureReady();
  if (!db) {
    return memoryFallback.get(slug);
  }

  try {
    const tx = db.transaction(PROGRESS_STORE, 'readonly');
    const raw = await idbRequest(tx.objectStore(PROGRESS_STORE).get(slug));
    return sanitizeProgressRecord(raw, slug);
  } catch (err) {
    console.warn('[storage] getProgress failed, reading memory fallback:', err);
    return memoryFallback.get(slug);
  }
}

/**
 * Persists progress for a lesson into IndexedDB and notifies active tabs/islands.
 */
export async function saveProgress(
  slug: string,
  patch: Partial<Omit<LessonProgress, 'lesson_slug'>>
): Promise<LessonProgress | null> {
  if (!isValidSlug(slug)) {
    console.warn(`[storage] Invalid lesson slug: "${slug}"`);
    return null;
  }

  const db = await ensureReady();
  const existing = db
    ? await (async () => {
        try {
          const tx = db.transaction(PROGRESS_STORE, 'readonly');
          const raw = await idbRequest(tx.objectStore(PROGRESS_STORE).get(slug));
          return sanitizeProgressRecord(raw, slug);
        } catch {
          return memoryFallback.get(slug);
        }
      })()
    : memoryFallback.get(slug);

  const updatedRecord: LessonProgress = {
    lesson_slug: slug,
    completed:
      patch.completed !== undefined
        ? Boolean(patch.completed)
        : (existing?.completed ?? false),
    saved_code:
      patch.saved_code !== undefined
        ? clampCode(patch.saved_code)
        : (existing?.saved_code ?? ''),
    xp_earned:
      patch.xp_earned !== undefined
        ? normalizeXp(patch.xp_earned)
        : (existing?.xp_earned ?? 0),
    updated_at: new Date().toISOString(),
  };

  memoryFallback.put(updatedRecord);

  if (db) {
    try {
      const tx = db.transaction(PROGRESS_STORE, 'readwrite');
      tx.objectStore(PROGRESS_STORE).put(updatedRecord);
      await idbTransactionDone(tx);
    } catch (err) {
      console.warn('[storage] IndexedDB write failed:', err);
    }
  }

  notifyProgressUpdate(slug);
  return updatedRecord;
}

/**
 * Clears stored progress for a single lesson.
 */
export async function clearProgress(slug: string): Promise<void> {
  if (!isValidSlug(slug)) return;

  memoryFallback.delete(slug);
  const db = await ensureReady();

  if (db) {
    try {
      const tx = db.transaction(PROGRESS_STORE, 'readwrite');
      tx.objectStore(PROGRESS_STORE).delete(slug);
      await idbTransactionDone(tx);
    } catch (err) {
      console.warn('[storage] IndexedDB delete failed:', err);
    }
  }

  notifyProgressUpdate(slug);
}

/**
 * Clears all stored lesson progress from IndexedDB.
 */
export async function clearAllProgress(): Promise<void> {
  memoryFallback.clear();
  const db = await ensureReady();

  if (db) {
    try {
      const tx = db.transaction(PROGRESS_STORE, 'readwrite');
      tx.objectStore(PROGRESS_STORE).clear();
      await idbTransactionDone(tx);
    } catch (err) {
      console.warn('[storage] IndexedDB clearAll failed:', err);
    }
  }

  notifyProgressUpdate();
}

/**
 * Returns all lesson progress records stored in IndexedDB.
 */
export async function listProgress(): Promise<LessonProgress[]> {
  const db = await ensureReady();
  if (!db) {
    return memoryFallback.getAll();
  }

  try {
    const tx = db.transaction(PROGRESS_STORE, 'readonly');
    const rawRows = await idbRequest(tx.objectStore(PROGRESS_STORE).getAll());
    const records: LessonProgress[] = [];
    for (const row of rawRows) {
      const sanitized = sanitizeProgressRecord(row);
      if (sanitized) records.push(sanitized);
    }
    return records;
  } catch (err) {
    console.warn('[storage] listProgress failed, reading memory fallback:', err);
    return memoryFallback.getAll();
  }
}

/**
 * Exports all stored lesson progress as a versioned JSON string.
 */
export async function exportProgressJson(): Promise<string> {
  const records = await listProgress();
  const envelope: ProgressExportEnvelope = {
    schema: 'bl-academy-progress',
    version: 1,
    exported_at: new Date().toISOString(),
    records,
  };
  return JSON.stringify(envelope, null, 2);
}

/**
 * Validates and imports a versioned JSON backup into IndexedDB.
 * Supports 'merge' (deterministic merge with existing) or 'replace' (clears first).
 */
export async function importProgressJson(
  rawJson: string,
  mode: 'merge' | 'replace' = 'merge'
): Promise<{ imported: number; skipped: number }> {
  if (typeof rawJson !== 'string' || rawJson.trim().length === 0) {
    throw new Error('Backup file is empty.');
  }
  if (rawJson.length > MAX_IMPORT_BYTES) {
    throw new Error('Backup file exceeds the 5 MB size limit.');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    throw new Error('Invalid JSON format in backup file.');
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Backup root must be a JSON object.');
  }

  const envelope = parsed as Record<string, unknown>;
  if (envelope.schema !== 'bl-academy-progress' || envelope.version !== 1) {
    throw new Error('Unsupported backup schema or version.');
  }
  if (!Array.isArray(envelope.records)) {
    throw new Error('Backup file is missing a valid records array.');
  }
  if (envelope.records.length > MAX_IMPORT_RECORDS) {
    throw new Error(`Backup exceeds maximum of ${MAX_IMPORT_RECORDS} records.`);
  }

  const validRecords: LessonProgress[] = [];
  let skipped = 0;

  for (const item of envelope.records) {
    const sanitized = sanitizeProgressRecord(item);
    if (sanitized) {
      validRecords.push(sanitized);
    } else {
      skipped++;
    }
  }

  const db = await ensureReady();

  if (mode === 'replace') {
    memoryFallback.clear();
  }

  if (db) {
    const tx = db.transaction(PROGRESS_STORE, 'readwrite');
    const store = tx.objectStore(PROGRESS_STORE);

    if (mode === 'replace') {
      store.clear();
    }

    for (const record of validRecords) {
      if (mode === 'merge') {
        const existingRaw = await idbRequest(store.get(record.lesson_slug));
        const existing = sanitizeProgressRecord(existingRaw, record.lesson_slug);
        const merged = mergeRecords(existing, record);
        store.put(merged);
        memoryFallback.put(merged);
      } else {
        store.put(record);
        memoryFallback.put(record);
      }
    }

    await idbTransactionDone(tx);
  } else {
    for (const record of validRecords) {
      if (mode === 'merge') {
        const existing = memoryFallback.get(record.lesson_slug);
        memoryFallback.put(mergeRecords(existing, record));
      } else {
        memoryFallback.put(record);
      }
    }
  }

  notifyProgressUpdate();
  return { imported: validRecords.length, skipped };
}

/**
 * Resets the localStorage migration flag (primarily for test harness verification).
 */
export async function resetMigrationFlag(): Promise<void> {
  memoryFallback.setMeta(MIGRATION_META_KEY, false);
  const db = await openDatabase();
  if (db) {
    const tx = db.transaction(META_STORE, 'readwrite');
    tx.objectStore(META_STORE).delete(MIGRATION_META_KEY);
    await idbTransactionDone(tx);
  }
}
