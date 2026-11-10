import { supabase, isSupabaseConfigured } from './supabase';

export interface LessonProgress {
  lesson_slug: string;
  completed: boolean;
  saved_code: string;
  xp_earned: number;
  updated_at: string;
}

export const STORAGE_PREFIX = 'lesson_progress_';
export const MIGRATION_PREFIX = 'lesson_migrated_';
export const MAX_SAVED_CODE_LENGTH = 65536; // 64 KB cap

const SLUG_REGEX = /^[a-z0-9][a-z0-9-_/]*$/i;

/**
 * Validates whether a lesson slug is well-formed.
 */
export function isValidSlug(slug: unknown): slug is string {
  return typeof slug === 'string' && slug.length > 0 && slug.length <= 128 && SLUG_REGEX.test(slug);
}

/**
 * Clamps code string to the maximum allowed byte/character length.
 */
export function clampCode(code: unknown): string {
  if (typeof code !== 'string') return '';
  return code.length > MAX_SAVED_CODE_LENGTH ? code.slice(0, MAX_SAVED_CODE_LENGTH) : code;
}

/**
 * In-memory fallback for environments where window.localStorage is unavailable (SSR, private browsing, quota).
 */
class MemoryStorage {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  get length(): number {
    return this.store.size;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  clear(): void {
    this.store.clear();
  }
}

const memoryStorageFallback = new MemoryStorage();

/**
 * SSR-safe storage accessor.
 */
export function getSafeStorage(): Storage | MemoryStorage {
  if (typeof window === 'undefined') {
    return memoryStorageFallback;
  }
  try {
    const testKey = '__bl_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    return memoryStorageFallback;
  }
}

/**
 * Safely parses and validates a stored JSON record.
 */
function parseStoredProgress(raw: string | null, slug: string): LessonProgress | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;

    return {
      lesson_slug: slug,
      completed: Boolean(parsed.completed),
      saved_code: clampCode(parsed.saved_code ?? ''),
      xp_earned: typeof parsed.xp_earned === 'number' && parsed.xp_earned >= 0 ? Math.floor(parsed.xp_earned) : 0,
      updated_at: typeof parsed.updated_at === 'string' ? parsed.updated_at : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/**
 * Retrieves the progress of a specific lesson.
 * Local storage is the immediate source of truth for UI responsiveness.
 */
export async function getProgress(slug: string): Promise<LessonProgress | null> {
  if (!isValidSlug(slug)) {
    console.warn(`[storage] Invalid lesson slug: "${slug}"`);
    return null;
  }

  const storage = getSafeStorage();
  const raw = storage.getItem(STORAGE_PREFIX + slug);
  return parseStoredProgress(raw, slug);
}

/**
 * Persists progress for a lesson.
 * Writes locally first (instant UI update), then performs background write-through
 * to Supabase if the user is authenticated.
 */
export async function saveProgress(
  slug: string,
  patch: Partial<Omit<LessonProgress, 'lesson_slug'>>
): Promise<LessonProgress | null> {
  if (!isValidSlug(slug)) {
    console.warn(`[storage] Invalid lesson slug: "${slug}"`);
    return null;
  }

  const storage = getSafeStorage();
  const existing = parseStoredProgress(storage.getItem(STORAGE_PREFIX + slug), slug);

  const updatedRecord: LessonProgress = {
    lesson_slug: slug,
    completed: patch.completed !== undefined ? Boolean(patch.completed) : (existing?.completed ?? false),
    saved_code: patch.saved_code !== undefined ? clampCode(patch.saved_code) : (existing?.saved_code ?? ''),
    xp_earned: patch.xp_earned !== undefined ? Math.max(0, Math.floor(patch.xp_earned)) : (existing?.xp_earned ?? 0),
    updated_at: new Date().toISOString(),
  };

  // 1. Write locally
  try {
    storage.setItem(STORAGE_PREFIX + slug, JSON.stringify(updatedRecord));
  } catch (err) {
    console.warn('[storage] Failed to save progress locally:', err);
  }

  // 2. Non-blocking cloud mirror if authenticated
  if (isSupabaseConfigured) {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!session?.user) return;

        return supabase
          .from('user_progress')
          .upsert(
            {
              user_id: session.user.id,
              lesson_slug: updatedRecord.lesson_slug,
              completed: updatedRecord.completed,
              saved_code: updatedRecord.saved_code,
              xp_earned: updatedRecord.xp_earned,
              updated_at: updatedRecord.updated_at,
            },
            { onConflict: 'user_id,lesson_slug' }
          )
          .then(({ error }) => {
            if (error) {
              console.warn('[storage] Cloud mirror upsert error for', slug, error.message);
            }
          });
      })
      .catch((err) => {
        console.warn('[storage] Cloud mirror network error for', slug, err);
      });
  }

  return updatedRecord;
}

/**
 * Clears stored progress for a lesson locally and remotely if authenticated.
 */
export async function clearProgress(slug: string): Promise<void> {
  if (!isValidSlug(slug)) return;

  const storage = getSafeStorage();
  storage.removeItem(STORAGE_PREFIX + slug);

  if (isSupabaseConfigured) {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!session?.user) return;
        return supabase
          .from('user_progress')
          .delete()
          .match({ user_id: session.user.id, lesson_slug: slug });
      })
      .catch((err) => {
        console.warn('[storage] Cloud delete error for', slug, err);
      });
  }
}

/**
 * Returns all local lesson progress records stored in this browser.
 */
export function listLocalProgress(): LessonProgress[] {
  const storage = getSafeStorage();
  const records: LessonProgress[] = [];

  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX)) {
      const slug = key.slice(STORAGE_PREFIX.length);
      if (isValidSlug(slug)) {
        const item = parseStoredProgress(storage.getItem(key), slug);
        if (item) records.push(item);
      }
    }
  }

  return records;
}

/**
 * In-flight lock to prevent concurrent redundant migrations across auth events.
 */
let inFlightMigration: Promise<{ migratedCount: number; errors: number }> | null = null;

/**
 * Migrates anonymous local progress to Supabase for the authenticated user.
 * Idempotent: runs once per user ID using a localStorage migration flag.
 */
export async function syncLocalToSupabase(
  explicitUserId?: string
): Promise<{ migratedCount: number; errors: number }> {
  if (inFlightMigration) {
    return inFlightMigration;
  }

  inFlightMigration = (async () => {
    if (!isSupabaseConfigured) {
      return { migratedCount: 0, errors: 0 };
    }

    let userId = explicitUserId;
    if (!userId) {
      const { data: { session } } = await supabase.auth.getSession();
      userId = session?.user?.id;
    }

    if (!userId) {
      return { migratedCount: 0, errors: 0 };
    }

    const storage = getSafeStorage();
    const migrationFlagKey = MIGRATION_PREFIX + userId;

    if (storage.getItem(migrationFlagKey) === 'true') {
      return { migratedCount: 0, errors: 0 };
    }

    const localItems = listLocalProgress();

    try {
      // 1. Fetch existing remote progress for this user
      const { data: remoteRows, error: fetchError } = await supabase
        .from('user_progress')
        .select('lesson_slug, completed, saved_code, xp_earned, updated_at')
        .eq('user_id', userId);

      if (fetchError) {
        console.warn('[storage] Failed to fetch remote progress for sync:', fetchError.message);
        return { migratedCount: 0, errors: 1 };
      }

      const remoteMap = new Map<string, LessonProgress>();
      if (remoteRows) {
        for (const row of remoteRows) {
          remoteMap.set(row.lesson_slug, {
            lesson_slug: row.lesson_slug,
            completed: Boolean(row.completed),
            saved_code: clampCode(row.saved_code ?? ''),
            xp_earned: Math.max(0, row.xp_earned ?? 0),
            updated_at: row.updated_at || new Date().toISOString(),
          });
        }
      }

      // 2. Deterministic merge:
      // - completed: local || remote
      // - xp_earned: max(local, remote)
      // - saved_code: newer timestamp wins
      const mergedToUpsert: LessonProgress[] = [];

      for (const local of localItems) {
        const remote = remoteMap.get(local.lesson_slug);
        if (!remote) {
          mergedToUpsert.push(local);
        } else {
          const localTime = new Date(local.updated_at).getTime();
          const remoteTime = new Date(remote.updated_at).getTime();
          const useLocalCode = isNaN(remoteTime) || localTime >= remoteTime;

          const merged: LessonProgress = {
            lesson_slug: local.lesson_slug,
            completed: local.completed || remote.completed,
            xp_earned: Math.max(local.xp_earned, remote.xp_earned),
            saved_code: useLocalCode ? local.saved_code : remote.saved_code,
            updated_at: useLocalCode ? local.updated_at : remote.updated_at,
          };
          mergedToUpsert.push(merged);
        }
      }

      // 3. Batch upsert merged items into Supabase
      if (mergedToUpsert.length > 0) {
        const payload = mergedToUpsert.map((item) => ({
          user_id: userId,
          lesson_slug: item.lesson_slug,
          completed: item.completed,
          saved_code: item.saved_code,
          xp_earned: item.xp_earned,
          updated_at: item.updated_at,
        }));

        const { error: upsertError } = await supabase
          .from('user_progress')
          .upsert(payload, { onConflict: 'user_id,lesson_slug' });

        if (upsertError) {
          console.warn('[storage] Batch upsert during migration failed:', upsertError.message);
          return { migratedCount: 0, errors: 1 };
        }
      }

      // 4. Hydrate local storage with all remote progress (including rows from other devices)
      for (const item of mergedToUpsert) {
        storage.setItem(STORAGE_PREFIX + item.lesson_slug, JSON.stringify(item));
      }
      for (const [slug, remote] of remoteMap.entries()) {
        if (!localItems.some((l) => l.lesson_slug === slug)) {
          storage.setItem(STORAGE_PREFIX + slug, JSON.stringify(remote));
        }
      }

      // 5. Mark migration as completed for this user
      storage.setItem(migrationFlagKey, 'true');

      return { migratedCount: mergedToUpsert.length, errors: 0 };
    } catch (err) {
      console.warn('[storage] Unexpected error during syncLocalToSupabase:', err);
      return { migratedCount: 0, errors: 1 };
    }
  })();

  try {
    return await inFlightMigration;
  } finally {
    inFlightMigration = null;
  }
}

/**
 * Initializes listeners for Supabase auth state changes to automatically trigger
 * local-to-cloud progress migration when a user signs in.
 * Returns an unsubscribe cleanup callback.
 */
export function initProgressSync(): () => void {
  if (!isSupabaseConfigured) {
    return () => {};
  }

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
      syncLocalToSupabase(session.user.id).catch((err) => {
        console.warn('[storage] Auto-migration on auth state change failed:', err);
      });
    }
  });

  return () => {
    subscription.unsubscribe();
  };
}

