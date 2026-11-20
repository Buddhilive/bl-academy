# Tasks: Phase 1 Data Foundations & Classical ML Tutorials

**Input**: Design documents from `/.buddhi/specs/009-phase-1-data-tutorials/`
**Prerequisites**: `plan.md` (required), `spec.md` (required)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`US1`, `US2`, `US3`, `US4`)

---

## Phase 1: Setup

**Purpose**: Initialize target directories and verify design-token contrast before building UI.

- [x] T001 Create `src/content/lessons/ai-engineer/` and `notebook/ai-engineer/` directories
- [x] T002 [P] Verify WCAG 2.2 AA contrast for `ColabButton` colors (`#A7452A` on `#FFFFFF`, `#E07A5F` on `#121212`) via `buddhi scripts contrast`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the reusable, accessible "Open with Google Colab" static component required by all 8 Phase 1 lessons.

**⚠️ CRITICAL**: Must complete before authoring MDX lessons that import `ColabButton.astro`.

- [x] T003 Create `src/components/static/ColabButton.astro` accepting `notebook` (e.g., `"01-python-data-science-and-pandas.ipynb"`) and optional `course` (default `"ai-engineer"`) props, rendering an accessible `<a href="https://colab.research.google.com/github/buddhilive/bl-academy/blob/main/notebook/{course}/{notebook}" target="_blank" rel="noopener noreferrer">` CTA with `min-h-[44px]`, WCAG 2.2 AA contrast, `:focus-visible` ring, screen-reader `(opens in a new tab)` text, and zero CLS
- [x] T004 Run `buddhi scripts verify-a11y` on `src/components/static/ColabButton.astro` to confirm zero static accessibility violations

**Checkpoint**: `ColabButton.astro` is ready and verified — User Story authoring can begin in parallel.

---

## Phase 3: User Story 1 - Progressive Phase 1 MDX Lessons (Priority: P1) 🎯 MVP

**Goal**: Deliver all 8 progressive Phase 1 `.mdx` tutorials in `src/content/lessons/ai-engineer/` written in `my-writing-style`, grounded in `.ref/Data-Science-For-Beginners` and `.ref/ML-For-Beginners/ML-For-Beginners-main`, with Learning Objectives, Concept Walkthrough (+ KaTeX), `<PythonRunner client:visible />`, Colab code walkthrough + `<ColabButton />`, `<QuizCard client:visible />` exercises, and Reference Mapping.

**Independent Test**: Run `pnpm astro check` and `pnpm build`; verify all 8 pages render cleanly, pass Zod schema validation, and contain `>= 350` words of prose plus all mandatory sections.

- [x] T005 [P] [US1] Author Lesson 1 in `src/content/lessons/ai-engineer/01-python-data-science-and-pandas.mdx` (`order: 1`, `xp: 40`, `prerequisites: ["python-zero-to-hero/12-installing-third-party-packages-with-pip"]`, grounded in `.ref/Data-Science-For-Beginners/1-Introduction/01-defining-data-science/README.md`, `03-defining-data/README.md`, `2-Working-With-Data/07-python/README.md`)
- [x] T006 [P] [US1] Author Lesson 2 in `src/content/lessons/ai-engineer/02-data-preparation-and-cleaning.mdx` (`order: 2`, `xp: 45`, `prerequisites: ["ai-engineer/01-python-data-science-and-pandas"]`, grounded in `.ref/Data-Science-For-Beginners/2-Working-With-Data/05-relational-databases/README.md`, `06-non-relational/README.md`, `08-data-preparation/README.md`)
- [x] T007 [P] [US1] Author Lesson 3 in `src/content/lessons/ai-engineer/03-stats-probability-and-visualization.mdx` (`order: 3`, `xp: 45`, `prerequisites: ["ai-engineer/02-data-preparation-and-cleaning"]`, grounded in `.ref/Data-Science-For-Beginners/1-Introduction/04-stats-and-probability/README.md`, `3-Data-Visualization/09-visualization-quantities/README.md`, `10-visualization-distributions/README.md`, `12-visualization-relationships/README.md`, `13-meaningful-visualizations/README.md`)
- [x] T008 [P] [US1] Author Lesson 4 in `src/content/lessons/ai-engineer/04-regression-linear-and-logistic.mdx` (`order: 4`, `xp: 50`, `prerequisites: ["ai-engineer/03-stats-probability-and-visualization"]`, grounded in `.ref/ML-For-Beginners/ML-For-Beginners-main/2-Regression/1-Tools/README.md`, `2-Data/README.md`, `3-Linear/README.md`, `4-Logistic/README.md`)
- [x] T009 [P] [US1] Author Lesson 5 in `src/content/lessons/ai-engineer/05-classification-methods.mdx` (`order: 5`, `xp: 50`, `prerequisites: ["ai-engineer/04-regression-linear-and-logistic"]`, grounded in `.ref/ML-For-Beginners/ML-For-Beginners-main/4-Classification/1-Introduction/README.md`, `2-Classifiers-1/README.md`, `3-Classifiers-2/README.md`, `4-Applied/README.md`)
- [x] T010 [P] [US1] Author Lesson 6 in `src/content/lessons/ai-engineer/06-clustering-kmeans.mdx` (`order: 6`, `xp: 50`, `prerequisites: ["ai-engineer/05-classification-methods"]`, grounded in `.ref/ML-For-Beginners/ML-For-Beginners-main/5-Clustering/1-Visualize/README.md`, `2-K-Means/README.md`)
- [x] T011 [P] [US1] Author Lesson 7 in `src/content/lessons/ai-engineer/07-time-series-forecasting.mdx` (`order: 7`, `xp: 55`, `prerequisites: ["ai-engineer/06-clustering-kmeans"]`, grounded in `.ref/ML-For-Beginners/ML-For-Beginners-main/7-TimeSeries/1-Introduction/README.md`, `2-ARIMA/README.md`, `3-SVR/README.md`)
- [x] T012 [P] [US1] Author Lesson 8 in `src/content/lessons/ai-engineer/08-tabular-evaluation-and-pipelines.mdx` (`order: 8`, `xp: 60`, `prerequisites: ["ai-engineer/07-time-series-forecasting"]`, grounded in `.ref/ML-For-Beginners/ML-For-Beginners-main/9-Real-World/2-Debugging-ML-Models/README.md`, `.ref/Data-Science-For-Beginners/4-Data-Science-Lifecycle/15-analyzing/README.md`, `16-communication/README.md`)
- [x] T013 [US1] Checkpoint: Run `pnpm astro check`, `pnpm build`, and validate all 8 `.mdx` lessons pass >=350-word prose, required sections, `<PythonRunner>`, `<QuizCard>`, `<ColabButton>`, and Reference Mapping checks

**Checkpoint**: User Story 1 (MVP) is complete and independently verifiable.

---

## Phase 4: User Story 2 - Companion Google Colab Notebooks (Priority: P2)

**Goal**: Provide 8 self-contained, open-source Python `.ipynb` notebooks in `notebook/ai-engineer/` runnable top-to-bottom on Google Colab free tier CPU, replacing any Azure ML Studio / proprietary cloud labs.

**Independent Test**: Validate all 8 `.ipynb` files are valid nbformat v4 JSON, pass `ast.parse()` on all Python code cells, contain zero Azure ML / proprietary cloud imports, and match the exact filenames linked by `<ColabButton>` in `T005`–`T012`.

- [x] T014 [P] [US2] Create companion Colab notebook `notebook/ai-engineer/01-python-data-science-and-pandas.ipynb`
- [x] T015 [P] [US2] Create companion Colab notebook `notebook/ai-engineer/02-data-preparation-and-cleaning.ipynb`
- [x] T016 [P] [US2] Create companion Colab notebook `notebook/ai-engineer/03-stats-probability-and-visualization.ipynb`
- [x] T017 [P] [US2] Create companion Colab notebook `notebook/ai-engineer/04-regression-linear-and-logistic.ipynb`
- [x] T018 [P] [US2] Create companion Colab notebook `notebook/ai-engineer/05-classification-methods.ipynb`
- [x] T019 [P] [US2] Create companion Colab notebook `notebook/ai-engineer/06-clustering-kmeans.ipynb`
- [x] T020 [P] [US2] Create companion Colab notebook `notebook/ai-engineer/07-time-series-forecasting.ipynb`
- [x] T021 [P] [US2] Create companion Colab notebook `notebook/ai-engineer/08-tabular-evaluation-and-pipelines.ipynb`
- [x] T022 [US2] Checkpoint: Run Python validation script on `notebook/ai-engineer/*.ipynb` (nbformat v4 JSON, `ast.parse` on code cells, zero Azure/proprietary SDKs, 1:1 match with lesson `<ColabButton>` links)

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Track Continuity & Homepage Discoverability (Priority: P3)

**Goal**: Surface the `ai-engineer` Phase 1 track on the homepage (`src/pages/index.astro`) so learners can launch Lesson 1 directly.

**Independent Test**: Inspect `src/pages/index.astro` and run `pnpm astro check`, `pnpm build`, and `buddhi scripts verify-a11y`.

- [x] T023 [US3] Update `src/pages/index.astro` to add an active **AI Engineer: Phase 1** subject card pointing to the first `ai-engineer` lesson (`/learn/ai-engineer/ai-engineer/01-python-data-science-and-pandas`)
- [x] T024 [US3] Checkpoint: Verify `pnpm astro check`, `pnpm build`, and `buddhi scripts verify-a11y` on `src/pages/index.astro`

---

## Phase 6: User Story 4 - Curriculum Manifest Synchronization (Priority: P4)

**Goal**: Keep `.agents/memory/` synchronized with the populated `.ref/ML-For-Beginners/ML-For-Beginners-main/` tree and the 8-lesson Phase 1 sequence (`order: 1..8`).

**Independent Test**: Verify `.agents/memory/conventions/ai-engineer-curriculum-manifest.md` and `.agents/memory/decisions/002-ai-engineer-6-phase-curriculum.md` reflect the 8 Phase 1 lessons and `notebook/ai-engineer/` Colab integration.

- [x] T025 [P] [US4] Update `.agents/memory/conventions/ai-engineer-curriculum-manifest.md` with the 8-lesson Phase 1 table (`order: 1..8`, Phase 2 shifted to `order: 9+`) and `.ref/ML-For-Beginners/ML-For-Beginners-main/` paths
- [x] T026 [P] [US4] Update `.agents/memory/decisions/002-ai-engineer-6-phase-curriculum.md` to record populated `.ref/ML-For-Beginners` and `notebook/ai-engineer/` Colab integration

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Record accessibility governance decisions and run final end-to-end verification.

- [x] T027 Record `ColabButton.astro` WCAG 2.2 AA contrast, focus ring, and external-link semantics in `A11Y-DECISIONS.md`
- [x] T028 Run final verification suite (`pnpm astro check`, `pnpm build`, `buddhi scripts verify-a11y`, and full `.mdx` + `.ipynb` Python validator)

---

## Dependencies & Execution Order

- **Phase 1 (Setup)** → **Phase 2 (Foundational: `ColabButton.astro`)** → **Phase 3 (US1: 8 `.mdx` lessons in parallel)** → **Phase 4 (US2: 8 `.ipynb` notebooks in parallel)** → **Phase 5 (US3: `index.astro`)** → **Phase 6 (US4: `.agents/memory/` sync in parallel)** → **Phase 7 (Polish & Final Verification)**.
- Within Phase 3 (`T005`–`T012`), Phase 4 (`T014`–`T021`), and Phase 6 (`T025`–`T026`), all `[P]` tasks touch distinct files and can run concurrently.
