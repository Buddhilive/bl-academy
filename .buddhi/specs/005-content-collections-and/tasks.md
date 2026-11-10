# Tasks: Content Collections & Course Layout

**Input**: Design documents from `/.buddhi/specs/005-content-collections-and/` (`spec.md`, `plan.md`)  
**Prerequisites**: `spec.md` (required), `plan.md` (required)  
**Organization**: Tasks are grouped by phase and user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Exact file paths are specified in all task descriptions

---

## Phase 1: Setup & Foundational (Blocking Prerequisites)

**Purpose**: Core content collection schema, baseline layout slots, and sample content required across all user stories.

- [x] T001 Define `lessons` content collection with Zod schema (`title`, `track`, `order`, `difficulty`, `xp`, `description`, optional `topic`, optional `prerequisites`) in `src/content.config.ts`
- [x] T002 [P] Update `src/layouts/Layout.astro` to support per-page metadata (`title`, `description` props) and provide a `<slot name="head" />` injection point
- [x] T003 Create sample lesson `src/content/lessons/01-hello-python.mdx` meeting the 350+ word prose requirement and KaTeX math formulas

**Checkpoint**: Collection schema is compiled; `pnpm astro check` succeeds on the sample content.

---

## Phase 2: User Story 1 - Read a lesson at a stable URL (Priority: P1) 🎯 MVP

**Goal**: Deliver a statically generated page at `/learn/[track]/[slug]` rendering MDX content, math with KaTeX, and semantic layout tags.

- [x] T004 [US1] Create dynamic SSG route in `src/pages/learn/[track]/[slug].astro` implementing `getStaticPaths()` for the `lessons` collection and rendering MDX with semantic tags (`<main>`, `<article>`)
- [x] T005 [US1] Create basic layout wrapper `src/layouts/LessonLayout.astro` ensuring KaTeX CSS is included in `<head>` and rendering page content inside an accessible layout structure
- [x] T006 [US1] Verify MVP slice by running `pnpm build` and confirming `/learn/python-zero-to-hero/01-hello-python` generates valid static HTML with rendered KaTeX formulas

**Checkpoint**: User Story 1 is fully functional and independently testable. Any valid lesson MDX can be viewed at its permalink.

---

## Phase 3: User Story 2 - Navigate the track via sidebar (Priority: P2)

**Goal**: Display an accessible, ordered sidebar listing all lessons in the track, marking current lesson and displaying completion indicators.

- [x] T007 [P] [US2] Create static sidebar component in `src/components/static/LessonSidebar.astro` fetching track lessons sorted by `order`, with accessible landmark `nav` (`aria-label="Course lessons"`), `aria-current="page"` on active item, and mobile collapse disclosure (`<details><summary>`)
- [x] T008 [US2] Integrate `LessonSidebar.astro` into `src/layouts/LessonLayout.astro` with responsive drawer/sidebar styling
- [x] T009 [US2] Verify sidebar keyboard operability (Tab, Enter, Escape) and contrast on active links using `buddhi scripts contrast`

**Checkpoint**: User Stories 1 and 2 work independently. Users can navigate lessons sequentially with full keyboard support.

---

## Phase 4: User Story 3 - See progress and XP (Priority: P2)

**Goal**: Hydrate top progress bar and total XP tracker from local storage without causing Cumulative Layout Shift (CLS).

- [x] T010 [P] [US3] Create `src/components/islands/LessonProgressPanel.tsx` island reading progress from `src/lib/storage.ts` (`listLocalProgress()`), updating progress percentage (`role="progressbar"`), total XP, and updating sidebar check marks with accessible textual labels
- [x] T011 [US3] Integrate `LessonProgressPanel.tsx` into `src/layouts/LessonLayout.astro` with fixed-dimension pre-allocated SSR containers (0% / 0 XP placeholders) to eliminate layout shift upon hydration
- [x] T012 [US3] Verify progress hydration by testing local storage updates and checking layout stability (CLS = 0)

**Checkpoint**: User Stories 1, 2, and 3 work together. Progress and XP reflect saved state instantly on client hydration.

---

## Phase 5: User Story 4 - Ad slots without layout shift (Priority: P3)

**Goal**: Provide top and bottom AdSense placement slots reserving minimum heights to guarantee zero layout shift.

- [x] T013 [P] [US4] Create `src/components/static/AdSlot.astro` with explicit `min-h-[90px]` fixed container, `aria-label="Advertisement"`, and fallback placeholder
- [x] T014 [US4] Place `AdSlot.astro` in top and bottom banner sections inside `src/layouts/LessonLayout.astro`
- [x] T015 [US4] Verify layout stability with and without ad content rendered, ensuring CLS ≤ 0.1

**Checkpoint**: Ad placements are locked and do not shift content during page lifecycle.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification, accessibility audit, and validation against project constraints.

- [x] T016 Run invalid schema validation test (e.g. short description or invalid difficulty enum) to verify build failure behavior (SC-001)
- [x] T017 Execute `buddhi scripts verify-a11y` to check for WCAG 2.2 AA compliance across `LessonLayout` and generated lesson routes
- [x] T018 Run complete production build (`pnpm build`) and typecheck (`pnpm astro check`) to verify zero errors across the entire application

---

## Dependencies & Execution Order

- **Phase 1 (Setup)**: T001, T002, T003 can start immediately. (T002 and T003 run in parallel once T001 is ready).
- **Phase 2 (US1 MVP)**: T004 & T005 depend on Phase 1 completion. T006 validates MVP.
- **Phase 3 (US2 Sidebar)**: T007 can be built in parallel, then integrated in T008, tested in T009.
- **Phase 4 (US3 Progress & XP)**: T010 can be developed in parallel, then integrated into layout in T011, tested in T012.
- **Phase 5 (US4 Ad Slots)**: T013 can be created in parallel, integrated in T014, verified in T015.
- **Phase 6 (Polish & A11Y)**: Final checks after all stories are completed.

