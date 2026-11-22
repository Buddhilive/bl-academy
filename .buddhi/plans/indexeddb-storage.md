# Implementation Plan: Replace Supabase with Local IndexedDB Storage

## 1. Architecture & Trade-Off Decisions (`system-design`)

### Storage Engine: Native IndexedDB Wrapper vs. `idb` Dependency
- **Option A — Zero-dependency native `indexedDB` Promise wrapper** inside `src/lib/storage.ts`:
  - *Gains*: Zero bundle bloat, zero new npm dependencies, full control over schema versioning, `MemoryStorage` fallback (SSR / private browsing / restricted iframes), and strict validation.
  - *Costs*: ~80–100 lines of explicit `IDBOpenDBRequest` / transaction Promise boilerplate.
- **Option B — Add `idb` npm package**:
  - *Gains*: Slightly terser transaction syntax.
  - *Costs*: Extra dependency for a single-store CRUD + bulk import/export workload.
- **Decision**: **Option A (Zero-dependency native `indexedDB` wrapper)** with automatic fallback to `MemoryStorage` when `window` or `window.indexedDB` is unavailable or throws (e.g., SSR, Safari private mode, blocked storage).

### Cross-Tab Sync: `BroadcastChannel` + `CustomEvent`
- IndexedDB does not fire `window`'s `storage` event across tabs.
- **Decision**: Combine `BroadcastChannel('bl-academy-progress')` (for cross-tab notifications) with `window.dispatchEvent(new CustomEvent('bl:progress-updated', { detail }))` (for same-tab React islands), exposed via a single `subscribeProgressUpdates(callback)` helper.

### One-Time `localStorage` Migration
- Existing users may have `lesson_progress_<slug>` keys in `window.localStorage` (defined in `src/lib/storage.ts:11`).
- **Decision**: On first IndexedDB open/read (`ensureMigrated()`), scan `localStorage` for `STORAGE_PREFIX` keys, validate and upsert them into IndexedDB (preserving newer `updated_at` / `completed ||` / `max(xp_earned)`), set a `meta` store flag (`localStorage_migrated_v1`), and leave `localStorage` intact (or optionally clean up after verified write) so no user data is lost.

---

## 2. Ordered Implementation Steps

### Step 1: Remove Supabase Client, Auth UI, and Dependencies
1. Delete `src/lib/supabase.ts` and `src/components/islands/AuthModal.tsx`.
2. Remove `"@supabase/supabase-js": "^2.118.0"` from `package.json` (line 22) and run `pnpm install` to update `pnpm-lock.yaml`.
3. Remove `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` from `.env.example` (lines 1–3), replacing with a comment noting 100% client-side IndexedDB persistence (or keeping `.env.example` minimal).

### Step 2: Re-architect `src/lib/storage.ts` on IndexedDB
1. **IndexedDB Schema**:
   - Database name: `'bl_academy_db'`, version `1`.
   - Object store `'lesson_progress'` with `keyPath: 'lesson_slug'`, indexes: `'updated_at'`, `'completed'`.
   - Object store `'meta'` with `keyPath: 'key'` (stores `localStorage_migrated_v1` and export/import metadata).
   - Record shape (`LessonProgress`, extending `src/lib/storage.ts:3-9`):
     - `lesson_slug: string`
     - `completed: boolean`
     - `saved_code: string` (clamped to `MAX_SAVED_CODE_LENGTH = 65536`)
     - `xp_earned: number` (non-negative integer)
     - `updated_at: string` (ISO 8601)
2. **Core Async CRUD + Fallback**:
   - `getProgress(slug: string): Promise<LessonProgress | null>`
   - `saveProgress(slug: string, patch: Partial<Omit<LessonProgress, 'lesson_slug'>>): Promise<LessonProgress | null>`
   - `clearProgress(slug: string): Promise<void>`
   - `clearAllProgress(): Promise<void>`
   - `listProgress(): Promise<LessonProgress[]>` (replaces synchronous `listLocalProgress()`)
   - Graceful fallback to in-memory `Map` (`MemoryStorage` pattern from `src/lib/storage.ts:35-63`) if `window.indexedDB` is unavailable or fails to open.
3. **One-Time `localStorage` Migration**:
   - `migrateFromLocalStorage(): Promise<number>` guarded by an in-flight Promise lock and `'meta'` store flag `localStorage_migrated_v1`.
   - Automatically invoked before the first read/write (`ensureInitialized()`).
4. **Cross-Tab & Same-Tab Reactivity**:
   - `notifyProgressUpdate(slug?: string)` posts `{ type: 'progress-updated', slug }` on `BroadcastChannel('bl-academy-progress')` (when supported) and dispatches `window` `'bl:progress-updated'`.
   - `subscribeProgressUpdates(listener: () => void): () => void` subscribes to both `'bl:progress-updated'` and `BroadcastChannel.onmessage`, returning a cleanup function.
5. **JSON Export / Import Backup**:
   - `exportProgressJson(): Promise<string>` returning a versioned envelope:
     `{ schema: 'bl-academy-progress', version: 1, exported_at: string, records: LessonProgress[] }`.
   - `importProgressJson(rawJson: string, mode: 'merge' | 'replace' = 'merge'): Promise<{ imported: number; skipped: number }>`.

### Step 3: Security & Input Validation Hardening (`src/lib/storage.ts`)
1. Enforce a max JSON import payload size (e.g., 5 MB) and max record count (e.g., 5,000 records) before `JSON.parse`.
2. Validate envelope (`schema === 'bl-academy-progress'`, `version === 1`, `Array.isArray(records)`).
3. Sanitize every imported record with strict field allowlisting (never spread raw parsed objects, preventing `__proto__`/`constructor`/`prototype` pollution):
   - `isValidSlug(rec.lesson_slug)` (`SLUG_REGEX`, length <= 128)
   - `Boolean(rec.completed)`
   - `clampCode(rec.saved_code)` (64 KB cap)
   - `xp_earned`: finite non-negative integer (`Math.max(0, Math.floor(Number(rec.xp_earned) || 0))`)
   - `updated_at`: valid `Date.parse` ISO string, falling back to `new Date().toISOString()`.
4. In `'merge'` mode, apply deterministic merge (`completed: a || b`, `xp_earned: max`, `saved_code: newer updated_at wins`).
5. Validate `BroadcastChannel` message shape (`data?.type === 'progress-updated'`) before triggering UI refresh.

### Step 4: Wire Interactive Islands to IndexedDB
1. **`src/types/islands.ts`**:
   - Add optional `lessonSlug?: string` to `PythonRunnerProps` (lines 5–37), `QuizCardProps` (lines 39–69), and `LessonFooterProps` (lines 71–111).
2. **`src/layouts/LessonLayout.astro`**:
   - Pass `lessonSlug={entry.id}` to `<LessonFooter ... />` (lines 211–218).
3. **`src/components/islands/LessonFooter.tsx`** (lines 4–31):
   - When `lessonSlug` is provided, load initial `completed` state from `getProgress(lessonSlug)` on mount.
   - On `handleAction`, call `await saveProgress(lessonSlug, { completed: true, xp_earned: xp })` before navigating to `nextLessonUrl` (if present), updating `completedState` immediately.
4. **`src/components/islands/PythonRunner.tsx`** (lines 9–87):
   - When `lessonSlug` is provided, hydrate `code` from `getProgress(lessonSlug)?.saved_code` on mount (if non-empty) and debounced-save (`~500ms`) code changes via `saveProgress(lessonSlug, { saved_code: code })`.
   - On `handleReset`, reset `code` to `initialCode` and update saved code in IndexedDB.
5. **`src/components/islands/LessonProgressPanel.tsx`** (lines 19–150):
   - Convert `refreshProgress()` to async using `await listProgress()`.
   - Replace `window.addEventListener('storage', ...)` / `'bl:progress-updated'` with `subscribeProgressUpdates(refreshProgress)` (covers both same-tab and cross-tab `BroadcastChannel` updates).
   - Add a compact, WCAG 2.2 AA accessible **Backup (Export / Import)** menu/popover (`min-h-[44px]`, `:focus-visible` ring `#A7452A` / `#E07A5F`, `aria-expanded`, `aria-controls`, file input for `.json` import with status feedback) so learners can back up and restore progress from any lesson or track page.

### Step 5: Refactor Verification Harness (`StorageTester` & `test-storage.astro`)
1. Replace `src/components/islands/StorageAuthTester.tsx` with `src/components/islands/StorageTester.tsx` (removing all `supabase` and `AuthModal` references).
2. Add interactive controls to `StorageTester.tsx` for:
   - IndexedDB CRUD (`saveProgress`, `getProgress`, `clearProgress`, `clearAllProgress`).
   - Seeding mock `localStorage` keys and testing `migrateFromLocalStorage()`.
   - Testing `BroadcastChannel` cross-tab sync (shows live update timestamp when another tab saves).
   - Testing JSON Export (download/preview) and JSON Import (`merge` vs `replace`, plus malformed payload error handling).
3. Update `src/pages/test-storage.astro` (lines 3–23) to mount `<StorageTester client:load />` and update headings/copy to reflect local IndexedDB persistence.

---

## 3. Files to Be Touched

| Action | File | Purpose |
| :--- | :--- | :--- |
| **Delete** | `src/lib/supabase.ts` | Remove Supabase client & env checks |
| **Delete** | `src/components/islands/AuthModal.tsx` | Remove Supabase OAuth / Magic Link modal |
| **Delete** | `src/components/islands/StorageAuthTester.tsx` | Replaced by `StorageTester.tsx` |
| **Create** | `src/components/islands/StorageTester.tsx` | IndexedDB, migration, BroadcastChannel & JSON backup test harness |
| **Modify** | `package.json` | Remove `@supabase/supabase-js` |
| **Modify** | `.env.example` | Remove `PUBLIC_SUPABASE_URL` & `PUBLIC_SUPABASE_ANON_KEY` |
| **Modify** | `src/lib/storage.ts` | IndexedDB engine, `localStorage` migration, `BroadcastChannel`, JSON export/import |
| **Modify** | `src/types/islands.ts` | Add optional `lessonSlug?: string` to island props |
| **Modify** | `src/layouts/LessonLayout.astro` | Pass `lessonSlug={entry.id}` to `LessonFooter` |
| **Modify** | `src/components/islands/LessonFooter.tsx` | Persist lesson completion & XP to IndexedDB |
| **Modify** | `src/components/islands/PythonRunner.tsx` | Hydrate & debounced-save `saved_code` when `lessonSlug` is set |
| **Modify** | `src/components/islands/LessonProgressPanel.tsx` | Async `listProgress()`, `subscribeProgressUpdates()`, Export/Import UI |
| **Modify** | `src/pages/test-storage.astro` | Mount `StorageTester` and update page copy |

---

## 4. Testing & Verification Plan

1. **Static & Reference Checks**:
   - `git grep -i "supabase" -- src/ package.json .env*` returns 0 matches.
   - `pnpm astro check` passes with 0 type/schema errors.
   - `pnpm build` succeeds cleanly with static SSG output.
2. **Accessibility Check**:
   - Run `buddhi scripts verify-a11y` via `terminal-runner` to confirm `LessonProgressPanel.tsx`, `LessonFooter.tsx`, and `StorageTester.tsx` pass WCAG 2.2 AA rules.
3. **Functional Browser Verification** (`pnpm preview` / `astro dev`):
   - **`/test-storage`**:
     - Save, read, and clear a lesson record; reload page and confirm IndexedDB retains it.
     - Seed `localStorage` `lesson_progress_*` entries, trigger/reload migration, and verify records appear in IndexedDB.
     - Open `/test-storage` in two tabs: save in Tab A and verify Tab B updates automatically via `BroadcastChannel`.
     - Export JSON, clear IndexedDB, re-import JSON (both `merge` and `replace` modes), and test an invalid/oversized JSON file to verify rejection without corrupting existing data.
   - **Lesson Page (`/learn/python/...`) & `/test-islands`**:
     - Edit code in `PythonRunner`, reload, and verify `saved_code` restores (when `lessonSlug` is wired).
     - Click `Complete & Next Lesson` in `LessonFooter`, verify `LessonProgressPanel` XP and completion count update immediately and persist across reloads.
