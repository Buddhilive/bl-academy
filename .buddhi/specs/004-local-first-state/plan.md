# Implementation Plan: Local-First State & Supabase Integration

**Branch**: `004-local-first-state` | **Date**: 2026-11-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/.buddhi/specs/004-local-first-state/spec.md`

## Summary

Add a local-first progress layer. `localStorage` is always written first and is the source of truth for the UI. When a Supabase session exists, the same writes are mirrored to `user_progress`. On login, a one-time, idempotent `syncLocalToSupabase()` merges anonymous progress into the account. `AuthModal` (Google + Magic Link) is the only new UI. The schema and RLS live in `supabase/schema.sql`. Dashboard setup steps live in root `supabase.md` (decision on spec FR-018).

## Technical Context

**Language/Version**: TypeScript 5.9 (strict), React 19 islands, Astro 7 SSG, Node >= 22

**Primary Dependencies**: `@supabase/supabase-js` ^2.118 (already installed). No new packages.

**Storage**: Browser `localStorage` (`lesson_progress_<slug>`, `lesson_migrated_<user_id>`) plus Supabase Postgres `public.user_progress`.

**Testing**: No test runner is installed. Verification uses `pnpm astro check`, `pnpm build`, and `buddhi scripts verify-a11y`. A Vitest dev dependency for `storage.ts` pure logic is proposed but needs approval (see Complexity Tracking). Without it, verification is manual using the quickstart checklist.

**Target Platform**: Static site, evergreen browsers, client-side only.

**Project Type**: Web (static Astro + React islands).

**Performance Goals**: Local reads and writes are synchronous (< 5 ms). Cloud writes are fire-and-forget and never block the UI. Migration is one batched upsert.

**Constraints**: Zero-backend (anon key only, no service role). SSR-safe (no `window` at module scope). WCAG 2.2 AA in light and dark themes. Zero CLS.

**Scale/Scope**: Tens to hundreds of lessons per user, with `saved_code` capped at 64 KB.

## AGENTS.md & DESIGN.md Compliance Check

- [x] Build and check commands: `pnpm build`, `pnpm astro check`.
- [x] Zero-backend: only the anon key is used, and security rests on RLS. No Node or server code is added.
- [x] Islands live in `src/components/islands/`. Pure logic lives in `src/lib/`.
- [x] Theme: the modal uses the `#A7452A` / `#E07A5F` tokens, matching `LessonFooter` classes. Run `check_contrast` on the final colors. The dark-mode `#E07A5F` button uses `text-neutral-950`, as in `LessonFooter`.
- [x] No new dependencies.
- [ ] `DESIGN.md` lint (`detect_design_md.py --lint`) to be run at implementation time. The file was not found at repo root during planning.

## Architecture Decisions

**Data flow: local-first with write-through mirror.**

| Lens | Finding |
|------|---------|
| Fewest-slices | `storage.ts` (local only) + `schema.sql` is shippable alone (US1, US5). Cloud and auth layer on top. |
| Risk-first | Riskiest parts: (1) merge and idempotency in migration, (2) RLS correctness, (3) SSR and unavailable storage. Build and verify these first. |
| Seam-quality | One async API (`getProgress`, `saveProgress`, `clearProgress`) with no auth branching in callers. Backend selection is internal to `storage.ts`, and `supabase.ts` exposes `isSupabaseConfigured`. |

**Alternatives considered (system-design):**

1. *Cloud-as-truth for signed-in users* (per spec wording "read/write to Supabase"). Rejected: needs a loading and offline state in every lesson, violating local-first.
2. *Local-first write-through, cloud read on login/hydrate* (chosen). Writes go local then cloud. On session start, remote rows are merged into local, so the UI reads local only.
3. *Offline retry queue.* Deferred (spec FR-016 question). Default: failed cloud writes are retried by the next save of the same slug and by the login merge. A `pending` flag per record is not added in v1.

**Defaults taken for the open clarifications (confirm during review):**

- Spec #1: after successful migration, keep local keys (flag prevents re-run). Deletion risks loss if a sync was partial. Rows are merged, so keeping is safe.
- Spec #2: merge `completed = local || remote`, `xp = max`, `saved_code` from the newer `updatedAt`.
- Spec #3: no persistent retry queue in v1.
- Spec #4 (answered): setup guide goes in root `supabase.md`.

## Module Design

### `src/lib/supabase.ts` (edit existing)
- Keep `createClient` from `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY`.
- Add `export const isSupabaseConfigured = Boolean(url && key)`.
- Create the client lazily or with a placeholder when unconfigured, so import does not throw during build. Auth options: `persistSession`, `detectSessionInUrl`, and PKCE flow.

### `src/lib/storage.ts` (new)
- `type LessonProgress = { lesson_slug; completed; saved_code; xp_earned; updated_at }`.
- Helpers: `isValidSlug` (`/^[a-z0-9][a-z0-9-_/]*$/i`, max length), `safeLocal()` (guards `typeof window` and try/catch, with an in-memory `Map` fallback), `clampCode` (64 KB).
- Public API: `getProgress(slug)`, `saveProgress(slug, patch)`, `clearProgress(slug)`, `listLocalProgress()`, `syncLocalToSupabase(userId?)`, `initProgressSync()` (subscribes to `onAuthStateChange`, runs sync on `SIGNED_IN`).
- `saveProgress`: validate, merge into local, write local, then if a session exists, `upsert(..., { onConflict: 'user_id,lesson_slug' })` in the background and swallow and log errors.
- `syncLocalToSupabase`: skip if `lesson_migrated_<user_id>` is set. Otherwise fetch remote rows, merge per slug, upsert a batch, write merged results back to local, and set the flag only after the upsert succeeds. Guard with an in-flight promise to avoid duplicate runs from multiple tabs or events.
- Cross-tab: a `storage` event listener is optional (last-write-wins by `updated_at`).

### `src/components/islands/AuthModal.tsx` (new)
- Props: `open`, `onClose`, optional `redirectTo`. Use `client:load` or an on-demand open from a trigger island.
- Methods: `signInWithOAuth({ provider: 'google', options: { redirectTo } })` and `signInWithOtp({ email, options: { emailRedirectTo } })`.
- States: idle, sending, sent, error, unavailable (when `!isSupabaseConfigured`).
- Reuses the repo's Tailwind patterns from `LessonFooter` for the button and focus ring.

### `supabase/schema.sql` (new)
- `public.user_progress`: `user_id uuid references auth.users on delete cascade`, `lesson_slug text`, `completed boolean default false`, `saved_code text` (`check (char_length(saved_code) <= 65536)`), `xp_earned integer default 0 check (xp_earned >= 0)`, `created_at`, `updated_at`, `primary key (user_id, lesson_slug)`.
- `set_updated_at()` trigger.
- `alter table ... enable row level security`, with `select/insert/update/delete` policies `using/with check (auth.uid() = user_id)` written as `to authenticated`. No anon grants. All statements are idempotent (`if not exists`, `drop policy if exists`).

### `supabase.md` (new, repo root)
- Create the project, run `schema.sql`, enable the Google provider (OAuth client ID and secret, authorized redirect URI is the Supabase callback), enable Email (magic link) provider, set Site URL and redirect URL allow-list (localhost and production), copy the URL and anon key into `.env`, and warn never to expose the service-role key.
- Add a short verification checklist.

## Accessibility Strategy

- Per `.agents/skills/a11y` dialog guidance: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap, Escape to close, focus return to the trigger, and background `inert`.
- Labelled `<input type="email" autocomplete="email">`, status and error via `aria-live="polite"` (`role="alert"` for errors).
- 44 px minimum targets, and `:focus-visible` rings at 3:1 or better.
- Verify contrast with `check_contrast` for each text and surface pair in both themes. Run `buddhi scripts verify-a11y` before delivery, then record the decision in `A11Y-DECISIONS.md`.

## Security Notes

- RLS is the only enforcement. Test with two accounts and an anon client.
- Anon key only. `.env` is already git-ignored (to verify).
- XP is client-reported and is not trusted for rankings (out of scope).
- Validate slugs and cap the code size on the client and in the DB.
- Do not render Supabase error text unsanitized. Use friendly mapped messages.

## Project Structure

### Documentation (this feature)

```text
.buddhi/specs/004-local-first-state/
├── spec.md
├── plan.md              # This file
└── tasks.md             # Produced by /spec-tasks
```

### Source Code (repository root)

```text
supabase.md                          # NEW: dashboard setup guide
supabase/
└── schema.sql                       # NEW: table, trigger, RLS
src/
├── lib/
│   ├── supabase.ts                  # EDIT: isSupabaseConfigured, auth options
│   └── storage.ts                   # NEW: dual-layer manager + migration
└── components/islands/
    └── AuthModal.tsx                # NEW: Google + Magic Link modal
.env.example                         # EDIT only if new vars (none expected)
```

**Structure Decision**: Single Astro project. Pure logic in `src/lib`, UI in `src/components/islands`, backend artifacts under `supabase/`. Wiring `saveProgress` into `PythonRunner`, `QuizCard`, and `LessonFooter` (`onComplete`) and adding a sign-in trigger to `Layout.astro` are not requested. They are deferred as follow-up integration unless you want them included.

## Delivery Order (maps to spec stories)

1. `schema.sql` and `supabase.md` (US5)
2. `supabase.ts` hardening and `storage.ts` local layer (US1)
3. `storage.ts` cloud mirror (US3)
4. `AuthModal.tsx` (US2)
5. `syncLocalToSupabase` and `initProgressSync` (US4)
6. Verification: `pnpm astro check`, `pnpm build`, `verify-a11y`, manual RLS and migration checklist.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Optional Vitest dev dependency | Merge and migration logic needs automated regression tests | Manual testing cannot guard idempotency. Requires user approval, so not added by default. |
| Specialist subagent dispatch skipped | Scope is small and the plan is grounded by direct file inspection | Would add overhead without new findings. |
