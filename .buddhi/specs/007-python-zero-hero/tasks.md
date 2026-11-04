# Tasks: Chapter 1 Interactive Lesson — Setting Up Python

**Input**: Design documents from `.buddhi/specs/007-python-zero-hero/` (`spec.md`, `plan.md`)  
**Feature Branch**: `007-python-zero-hero`

## Organization

Tasks are grouped into foundational routing/ordering prerequisites, prioritized user story slices (`US1` P1 MVP, `US2` P2 QuizCard, `US3` P2 PythonRunner), and final verification gates.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g. `[US1]`, `[US2]`, `[US3]`)

---

## Phase 1: Setup & Foundational Prerequisites

**Purpose**: Route structure, directory layout, and track ordering adjustments required before lesson generation.

- [x] T001 Create lesson target directory `src/content/lessons/python-zero-to-hero/`
- [x] T002 Rename and update dynamic route `src/pages/learn/[track]/[slug].astro` to `src/pages/learn/[track]/[...slug].astro` to support nested collection IDs (`python-zero-to-hero/01-setting-up-python`)
- [x] T003 [P] Update `src/content/lessons/01-hello-python.mdx` frontmatter: bump `order` from `1` to `2` and set `prerequisites: ["python-zero-to-hero/01-setting-up-python"]`
- [x] T004 [P] Update `src/components/islands/LessonProgressPanel.tsx` to dynamically route the Python track link to `trackLessons[0]?.id` rather than hardcoding `01-hello-python`

**Checkpoint**: Base routing and lesson collection order ready. `01-hello-python` is now Lesson 2, paving the way for Chapter 1 at `order: 1`.

---

## Phase 2: User Story 1 - Chapter 1 Tutorial Prose & Static Reference (Priority: P1) 🎯 MVP

**Goal**: Deliver a rich, scannable, W3Schools-style tutorial covering Python versions (System Python vs. python.org Python 3.8+), OS installation tutorials (Windows, macOS, Ubuntu Linux), IDLE & interactive shell navigation (`>>>`), and an accessible OS comparison table with ≥ 350 words of explanatory prose and KaTeX math formulas.

**Independent Test**: Run `pnpm astro check` and `pnpm build`, verify static generation of `/learn/python/python-zero-to-hero/01-setting-up-python`, and confirm all prose, code snippets, reference tables, and math formulas render cleanly.

- [x] T005 [US1] Scaffold `src/content/lessons/python-zero-to-hero/01-setting-up-python.mdx` with Zod frontmatter (`title: "Setting Up Python & Launching IDLE"`, `track: "python"`, `category: "Python Tutorial"`, `order: 1`, `xp: 50`, `difficulty: "beginner"`, `description` ≥ 30 chars, `prerequisites: []`)
- [x] T006 [US1] Author Section 1.1 (Python Versions, System Python, side-by-side coexistence, warning against Homebrew/Anaconda in favor of python.org) and Section 1.2 (Windows Setup Tutorial, PATH checkbox requirement, Start Menu IDLE) in `src/content/lessons/python-zero-to-hero/01-setting-up-python.mdx`
- [x] T007 [US1] Author Section 1.3 (macOS Setup Tutorial, avoiding Python 2, Finder/Spotlight IDLE launch) and Section 1.4 (Ubuntu Linux Setup Tutorial with `python3 --version`, `lsb_release -a`, Universe vs. deadsnakes PPA, and terminal IDLE command) in `src/content/lessons/python-zero-to-hero/01-setting-up-python.mdx`
- [x] T008 [US1] Author Section 1.5 (Understanding IDLE & The Interactive Window, header information, and `>>>` prompt) and the OS Setup Reference Table with accessible markup (`<caption>`, `<th scope="col">`) in `src/content/lessons/python-zero-to-hero/01-setting-up-python.mdx`
- [x] T009 [US1] Audit prose word count (1,362 words, ≥ 350 words) and KaTeX mathematical notation ($2^{32}$ vs $2^{64}$ address space and semantic version tuple comparisons), ensuring shell prompts inside ```` ```bash ```` blocks do not trigger KaTeX syntax collisions

**Checkpoint**: User Story 1 complete and independently readable at its static URL.

---

## Phase 3: User Story 2 - Conceptual Understanding Self-Check (Priority: P2)

**Goal**: Provide an accessible multiple-choice interactive quiz card testing key setup concepts before learners begin writing code.

**Independent Test**: Load the Chapter 1 lesson, test selecting both incorrect and correct options in `<QuizCard />`, verify immediate visual and screen-reader status feedback, and check `:focus-visible` keyboard rings.

- [x] T010 [US2] Import and embed `<QuizCard client:visible />` in `src/content/lessons/python-zero-to-hero/01-setting-up-python.mdx` testing Chapter 1 setup concepts (Windows PATH checkbox purpose and official installer best practices) with 4 options and detailed explanation
- [x] T011 [US2] Verify ARIA radiogroup semantics, keyboard navigation (`Tab`, `Space`, `Enter`), and polite live-region announcements for `<QuizCard />`

**Checkpoint**: User Story 2 active and verifiable alongside User Story 1.

---

## Phase 4: User Story 3 - Interactive Python Environment Inspection & Shell Simulation (Priority: P2)

**Goal**: Provide two client-side Pyodide Web Worker runner islands allowing learners to inspect the live Python 3 runtime and practice shell expressions matching IDLE's `>>>` prompt without blocking the main UI thread.

**Independent Test**: Click "Run" on both `<PythonRunner />` components on the Chapter 1 page; verify stdout output displays the Python version info and interactive expression evaluation within 5 seconds.

- [x] T012 [US3] Import and embed the first `<PythonRunner client:visible />` in `src/content/lessons/python-zero-to-hero/01-setting-up-python.mdx` ("Verify Your Python 3 Version & Architecture" using `sys` and `platform`)
- [x] T013 [US3] Embed the second `<PythonRunner client:visible />` in `src/content/lessons/python-zero-to-hero/01-setting-up-python.mdx` ("Interactive Shell Simulation" evaluating arithmetic and string expressions matching IDLE's `>>>` prompt)
- [x] T014 [US3] Verify client-side Pyodide execution in the Web Worker, ensuring zero main-thread lockup and Escape-key focus release from CodeMirror

**Checkpoint**: User Story 3 fully functional and interactive.

---

## Phase 5: Polish & Quality Gates

**Purpose**: Cross-cutting validation across type safety, production build, navigation, and accessibility standards.

- [x] T015 Run Astro type check via `pnpm astro check` (Passed: 0 errors)
- [x] T016 Build static site production bundle via `pnpm build` and verify output for `/learn/python/python-zero-to-hero/01-setting-up-python` and `/learn/python/01-hello-python` (Passed: 7 pages built)
- [x] T017 Run static accessibility gate via `buddhi scripts verify-a11y` and record conformant choices in `A11Y-DECISIONS.md` (Decision 7 added)

---

## Dependencies & Execution Order

1. **Phase 1 (Setup & Prerequisites)**: Completed.
2. **Phase 2 (User Story 1 - MVP)**: Completed.
3. **Phase 3 (User Story 2)** & **Phase 4 (User Story 3)**: Completed.
4. **Phase 5 (Polish & Quality Gates)**: Completed.
