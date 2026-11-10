# Tasks: Local-First State & Supabase Integration

**Input**: Design documents from `/.buddhi/specs/004-local-first-state/` (`spec.md`, `plan.md`)

**Prerequisites**: `spec.md`, `plan.md`

**Organization**: Tasks are grouped by phase and user story to enable independent implementation and testing of each slice.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Exact file paths are specified in descriptions

---

## Phase 1: Setup & Foundational Prerequisites

**Purpose**: Database schema, setup documentation, and client initialization required across stories.

- [x] T001 [P] [US5] Create `supabase/schema.sql` defining `public.user_progress` table with constraints (`xp_earned >= 0`, `char_length(saved_code) <= 65536`), `updated_at` trigger, and RLS policies restricted to `auth.uid() = user_id`.
- [x] T002 [P] [US5] Create root `supabase.md` documenting project setup, OAuth credentials (Google), Magic Link configuration, Site/Redirect URLs, and environment variables.
- [x] T003 [US5] Harden `src/lib/supabase.ts` with `isSupabaseConfigured` flag, fallback client handling when env vars are missing, and PKCE auth configuration.

**Checkpoint**: Database schema and hardened client foundation complete.

---

## Phase 2: User Story 1 - Anonymous Progress Persists Locally (Priority: P1) 🎯 MVP

**Goal**: Enable visitors to complete lessons and have their progress, code, and XP persist reliably in `localStorage` without requiring an account or network connectivity.

**Independent Test**: With empty Supabase environment variables, save lesson progress via storage API, reload browser session, and verify state is restored from `localStorage` under `lesson_progress_<slug>`.

### Implementation for User Story 1

- [x] T004 [US1] Define `LessonProgress` interface and serialization types in `src/lib/storage.ts`.
- [x] T005 [US1] Implement SSR-safe storage helper `safeLocal()` with in-memory `Map` fallback and slug validation in `src/lib/storage.ts`.
- [x] T006 [US1] Implement core local CRUD operations (`getProgress`, `saveProgress`, `clearProgress`, `listLocalProgress`) under key prefix `lesson_progress_<slug>` in `src/lib/storage.ts`.
- [x] T007 [US1] Verify local-only offline mode: test saving and retrieving lesson progress with corrupted data resilience and 64 KB code clamping.

**Checkpoint**: User Story 1 functional and independently testable as a standalone local-first MVP.

---

## Phase 3: User Story 3 - Authenticated Progress Syncs to Supabase (Priority: P2)

**Goal**: Mirror progress writes to Supabase `user_progress` table when a user session exists, with graceful fallback to local storage on network errors.

**Independent Test**: Sign in with an active session, update lesson progress, and verify row is upserted into `user_progress` with `(user_id, lesson_slug)`. Simulate offline network to ensure local writes still succeed.

### Implementation for User Story 3

- [x] T008 [US3] Extend `saveProgress` in `src/lib/storage.ts` to perform non-blocking write-through upsert to Supabase `user_progress` when an authenticated session is active.
- [x] T009 [US3] Add authenticated cloud fetch / fallback resolution in `src/lib/storage.ts` to hydrate local cache when authenticated.
- [x] T010 [US3] Add error handling and network failure swallowing in `src/lib/storage.ts` to ensure UI never blocks when cloud sync encounters errors.

**Checkpoint**: User Story 3 functional. Dual-layer storage seamlessly handles both anonymous and authenticated persistence.

---

## Phase 4: User Story 2 - Sign In with Google or Magic Link (Priority: P2)

**Goal**: Provide an accessible, responsive authentication modal allowing users to sign in via Google OAuth or Magic Link email.

**Independent Test**: Render `<AuthModal open={true} />`, verify keyboard trapping, Escape dismissal, submit Magic Link request, and trigger Google OAuth redirect.

### Implementation for User Story 2

- [x] T011 [US2] Create `src/components/islands/AuthModal.tsx` scaffolding dialog structure with Google OAuth and Email Magic Link form.
- [x] T012 [US2] Implement dialog accessibility in `src/components/islands/AuthModal.tsx`: `role="dialog"`, `aria-modal="true"`, focus trap, Escape key handling, and return-focus on close.
- [x] T013 [US2] Add inline validation, accessible error announcements (`aria-live="polite"` / `role="alert"`), and disabled state when `isSupabaseConfigured` is false in `src/components/islands/AuthModal.tsx`.
- [x] T014 [US2] Style modal using Design System tokens (`#A7452A` / `#E07A5F`) with 44px touch targets and verify contrast against WCAG 2.2 AA standards.

**Checkpoint**: User Story 2 functional. Auth modal is accessible and operational.

---

## Phase 5: User Story 4 - One-Time Migration of Anonymous Progress on Login (Priority: P3)

**Goal**: Migrate anonymous local progress to Supabase when a user signs in, preserving user work without duplicates.

**Independent Test**: Seed multiple `lesson_progress_<slug>` entries locally, log in, verify all rows are merged into `user_progress`, and verify migration flag `lesson_migrated_<user_id>` prevents re-running.

### Implementation for User Story 4

- [x] T015 [US4] Implement `syncLocalToSupabase(userId)` in `src/lib/storage.ts` with deterministic merge logic (`completed = local || remote`, `xp = max`, `saved_code` latest) and per-user migration marker.
- [x] T016 [US4] Implement `initProgressSync()` in `src/lib/storage.ts` subscribing to `supabase.auth.onAuthStateChange` to trigger migration upon `SIGNED_IN` event.
- [x] T017 [US4] Add in-flight guard to `syncLocalToSupabase` in `src/lib/storage.ts` to prevent race conditions across tabs or duplicate auth events.

**Checkpoint**: User Story 4 functional. Anonymous progress migrates smoothly upon sign-in.

---

## Phase 6: Polish & Verification

**Purpose**: Validate end-to-end type safety, build integrity, accessibility, and documentation.

- [x] T018 [P] Run typecheck and Astro validation: `pnpm astro check`.
- [x] T019 [P] Run production build verification: `pnpm build`.
- [x] T020 Run accessibility static gate (`buddhi scripts verify-a11y`) and record compliance in `A11Y-DECISIONS.md`.
- [x] T021 Manual verification of RLS security policies and end-to-end sync flows per `supabase.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Can start immediately.
- **Phase 2 (US1 - MVP)**: Depends on T003 from Phase 1. Delivers local-first MVP.
- **Phase 3 (US3 - Cloud Sync)**: Depends on Phase 1 and Phase 2.
- **Phase 4 (US2 - Auth Modal)**: Depends on Phase 1 (T003). Can run in parallel with Phase 2/3.
- **Phase 5 (US4 - Migration)**: Depends on Phase 2 (local storage), Phase 3 (cloud sync), and Phase 4 (auth events).
- **Phase 6 (Polish)**: Depends on all prior phases.

### Parallel Opportunities

- T001 and T002 can be developed in parallel.
- Phase 4 (`AuthModal.tsx`) can be implemented in parallel with Phase 2 & 3 (`storage.ts`).
- T018 and T019 can run concurrently in Phase 6.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup: schema, docs, supabase client).
2. Complete Phase 2 (Local storage manager).
3. Validate independent local persistence (MVP achieved!).

### Incremental Delivery

1. Setup + Local MVP (US1 + US5)
2. Add Cloud Mirroring (US3)
3. Add Auth Modal (US2)
4. Add One-Time Sync Migration (US4)
5. Full verification and A11Y sign-off (Phase 6)

