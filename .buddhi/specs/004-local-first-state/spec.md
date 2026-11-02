# Feature Specification: Local-First State & Supabase Integration

**Feature Branch**: `004-local-first-state`

**Created**: 2026-11-02

**Status**: Draft

**Input**: User description: "Local-First State & Supabase Integration: `src/lib/supabase.ts` client from public env vars; `src/lib/storage.ts` dual-layer storage (localStorage `lesson_progress_<slug>` for anonymous, Supabase `user_progress` for authenticated) with one-time `syncLocalToSupabase()` on login; `src/components/islands/AuthModal.tsx` with Google and Magic Link sign-in; `supabase/schema.sql` documenting schema and RLS."

## Codebase Grounding

- `src/lib/supabase.ts` already exists: `createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)` with `''` fallbacks. `@supabase/supabase-js` is already a dependency; `.env.example` already lists both variables. This feature *hardens* that file rather than creating it.
- Existing islands (`LessonFooter.tsx`, `PythonRunner.tsx`, `QuizCard.tsx`) live in `src/components/islands/`; `AuthModal.tsx` follows that convention. Whether they already persist progress should be checked in `/spec-plan`.
- No `src/lib/storage.ts` or `supabase/` directory exists yet.
- Constraint (AGENTS.md): zero-backend execution, light/dark theme with `#A7452A` / `#E07A5F`, WCAG 2.2 AA, no CLS.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Anonymous progress persists locally (Priority: P1)

A visitor completes a lesson and writes code without signing in. Reloading or returning later restores completion state, saved code, and XP.

**Why this priority**: Core local-first promise. It works with no account and no backend, and it is a viable MVP on its own.

**Independent Test**: With Supabase env vars empty, save progress for a lesson, reload, and confirm state is restored from `localStorage` key `lesson_progress_<slug>`.

**Acceptance Scenarios**:

1. **Given** an anonymous user, **When** they complete a lesson, **Then** `lesson_progress_<slug>` holds `completed`, `saved_code`, and `xp_earned`.
2. **Given** saved local progress, **When** the page reloads, **Then** the lesson shows the stored state.
3. **Given** corrupted or unparsable JSON under a key, **When** it is read, **Then** the app treats it as no progress and does not crash.

---

### User Story 2 - Sign in with Google or Magic Link (Priority: P2)

A user opens a minimalist modal and signs in via Google OAuth or an emailed magic link.

**Why this priority**: Enables cross-device persistence, but depends on US1's data model.

**Independent Test**: Open the modal, trigger each method against a Supabase project, and confirm a session is established (or a clear error is shown).

**Acceptance Scenarios**:

1. **Given** the modal is open, **When** the user chooses Google, **Then** they are redirected through Supabase OAuth and return signed in.
2. **Given** a valid email, **When** the user requests a magic link, **Then** a "check your email" confirmation appears and the link signs them in.
3. **Given** an invalid email or a network or provider error, **When** submitted, **Then** an inline, screen-reader-announced error appears.
4. **Given** the modal is open, **When** the user presses Escape or activates close, **Then** it closes and focus returns to the trigger.

---

### User Story 3 - Authenticated progress syncs to Supabase (Priority: P2)

A signed-in user's progress reads and writes go to `user_progress`, so it follows them across devices.

**Why this priority**: Delivers the cloud half of the dual-layer manager.

**Independent Test**: While signed in, save progress and confirm a row in `user_progress` for `(auth.uid(), lesson_slug)`. Confirm another user cannot read or write it.

**Acceptance Scenarios**:

1. **Given** a signed-in user, **When** progress changes, **Then** it is upserted to `user_progress`.
2. **Given** a signed-in user who is offline or whose request fails, **When** progress changes, **Then** it is still written locally and does not appear lost.
3. **Given** RLS is enabled, **When** user A queries, **Then** only A's rows are returned.

---

### User Story 4 - One-time migration of anonymous progress on login (Priority: P3)

When an anonymous user with local progress signs in, `syncLocalToSupabase()` migrates that progress once.

**Why this priority**: Prevents loss of pre-login work, but only matters after US1–US3 exist.

**Independent Test**: Seed several `lesson_progress_*` keys, sign in, and confirm the rows exist remotely and the migration does not run again.

**Acceptance Scenarios**:

1. **Given** local progress for N lessons, **When** login occurs, **Then** N rows are upserted.
2. **Given** a remote row already exists for a slug, **When** migrating, **Then** the merge keeps the more advanced result (see FR-009).
3. **Given** migration already ran for this user, **When** they sign in again, **Then** it is not re-run.
4. **Given** the migration fails partway, **When** it is retried on the next login, **Then** it is idempotent and loses no data.

---

### User Story 5 - Documented database schema and RLS (Priority: P1)

A maintainer applies `supabase/schema.sql` to a fresh Supabase project and gets a working, secure `user_progress` table.

**Why this priority**: Required for any authenticated behavior. It is a standalone, reviewable artifact.

**Independent Test**: Run the SQL on an empty project and confirm the table, constraints, and RLS policies exist, and that anonymous access is denied.

**Acceptance Scenarios**:

1. **Given** a fresh project, **When** the script runs, **Then** `user_progress` exists with `lesson_slug`, `completed`, `saved_code`, `xp_earned`, plus `user_id` and timestamps.
2. **Given** the script is run twice, **Then** it is idempotent.

---

### Edge Cases

- Supabase env vars missing or empty: the app stays fully functional in local-only mode, and auth UI shows a "sign-in unavailable" state instead of throwing.
- `localStorage` unavailable (private mode, quota exceeded, SSR/build): reads return empty and writes fail silently with an in-memory fallback. Nothing may reference `window` during Astro SSG.
- Large `saved_code`: enforce a size cap (see FR-010).
- Slug validation: malformed slugs must not create arbitrary keys.
- Multiple tabs: a `storage` event or last-write-wins must not corrupt state.
- Sign-out: local anonymous data is not wiped by sign-out, and one user's cloud data is never shown to the next user.
- Different users signing in on the same browser: migration must be scoped to the user ID.
- OAuth redirect URL mismatch or a popup blocked.
- Magic-link rate limiting.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `src/lib/supabase.ts` MUST initialize the client from `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` only. No service-role key may be referenced anywhere in client code.
- **FR-002**: The system MUST expose whether Supabase is configured, and degrade to local-only mode when it is not.
- **FR-003**: `src/lib/storage.ts` MUST provide read/write/clear of per-lesson progress `{ completed, saved_code, xp_earned }`.
- **FR-004**: Anonymous users MUST be persisted to `localStorage` under `lesson_progress_<slug>`.
- **FR-005**: Authenticated users MUST be persisted to Supabase `user_progress` (`lesson_slug`, `completed`, `saved_code`, `xp_earned`), upserted on `(user_id, lesson_slug)`.
- **FR-006**: The storage API MUST be identical for both user types. Callers MUST NOT branch on auth state.
- **FR-007**: `syncLocalToSupabase()` MUST run once per user on login, and MUST be idempotent and safe to retry.
- **FR-008**: After a successful migration, the system MUST record a per-user flag to prevent re-runs. [NEEDS CLARIFICATION: after migration, keep or delete the local `lesson_progress_*` keys?]
- **FR-009**: Merge on conflict MUST be deterministic: `completed = local OR remote`, `xp_earned = max`, and `saved_code` from the more recently updated side. [NEEDS CLARIFICATION: confirm the merge policy]
- **FR-010**: `saved_code` MUST be capped at a defined size (proposed 64 KB), enforced both client-side and in the schema.
- **FR-011**: `AuthModal.tsx` MUST offer Google OAuth and email Magic Link via Supabase Auth, as a hydrated island.
- **FR-012**: `AuthModal` MUST be accessible: focus trap, `role="dialog"` with `aria-modal` and a label, Escape to close, focus return, visible `:focus-visible`, keyboard operability, labelled email input, and `aria-live` status/error messages. It MUST meet WCAG 2.2 AA in light and dark themes using the `DESIGN.md` tokens, and contrast MUST be verified with `check_contrast`.
- **FR-013**: `supabase/schema.sql` MUST define `user_progress` with a `user_id` referencing `auth.users`, a unique `(user_id, lesson_slug)`, `xp_earned >= 0`, a `saved_code` length check, and an `updated_at` trigger.
- **FR-014**: `supabase/schema.sql` MUST enable RLS with select/insert/update/delete policies restricted to `auth.uid() = user_id`, and no anon access.
- **FR-015**: Storage and auth code MUST be SSR-safe (guarded `window`/`localStorage` access) and add no Node/server execution (AGENTS.md).
- **FR-016**: Cloud write failures MUST NOT block the UI. Writes always land locally first (local-first) and retry on a later write or sign-in. [NEEDS CLARIFICATION: is a persistent offline retry queue in scope?]
- **FR-017**: The modal MUST not introduce layout shift on the host page.
- **FR-018**: Document the required Supabase dashboard setup (Google provider, redirect URLs, magic-link enablement) in the root `supabase.md` file (resolved).

### Key Entities

- **LessonProgress**: `{ lesson_slug, completed, saved_code, xp_earned }`, keyed by the lesson slug.
- **user_progress (row)**: LessonProgress plus `user_id` and `updated_at`, unique per user and lesson.
- **AuthSession**: Supabase session, which determines the storage backend.
- **MigrationFlag**: per-user marker recording that local-to-cloud sync completed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: With no network and no env vars, 100% of progress reads and writes work via local storage with zero uncaught errors.
- **SC-002**: A new user can sign in via either method in under 60 seconds, excluding email delivery time.
- **SC-003**: After login, 100% of valid local progress records appear remotely, with zero duplicates after repeated logins.
- **SC-004**: Under automated RLS tests, user A reads 0 rows belonging to user B, and an unauthenticated client reads 0 rows.
- **SC-005**: The modal passes the `verify-a11y` gate and keyboard-only operation, with contrast ≥ 4.5:1 for text and ≥ 3:1 for UI components in both themes.
- **SC-006**: The production build (`pnpm build`) and `pnpm astro check` pass with no new errors, and the modal causes 0 CLS.

## Assumptions

- The Supabase project is created and configured by the maintainer. Google OAuth credentials are supplied outside this repo.
- The lesson slug is the stable identifier shared by Astro content and the DB.
- `xp_earned` is computed by the client, so it is not trusted for competitive purposes (no leaderboard in v1).
- Only the `anon` key is shipped to the browser, and security rests on RLS.
- Out of scope: profiles, leaderboards, email/password auth, account deletion, and server-side validation of XP.
- Depends on the existing `@supabase/supabase-js` dependency and the island and theme conventions in `DESIGN.md`.
