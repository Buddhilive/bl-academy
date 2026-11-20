# Feature Specification: Phase 1 Data Foundations & Classical ML Tutorials

**Feature Branch**: `009-phase-1-data-tutorials`

**Created**: 2026-11-20

**Status**: Draft

**Input**: User description: "Generate the Phase 1 tutorials for Buddhilive Academy using `.ref/Data-Science-For-Beginners` and `.ref/ML-For-Beginners` as reference sources, ordered progressively from data cleaning/EDA/visualization to regression, classification, clustering, time series, and tabular evaluation, with runnable Google Colab notebooks in `./notebook/ai-engineer/` linked via an 'Open with Google Colab' button, written in `my-writing-style`."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Progressive Phase 1 MDX Lessons (Priority: P1)

A Python programmer who has completed the `python` track (`python-zero-to-hero/12-installing-third-party-packages-with-pip`) navigates to the `ai-engineer` track and works through 8 progressive Phase 1 lessons in `src/content/lessons/ai-engineer/` covering data cleaning/EDA/visualization, regression, classification, clustering, time series, and tabular evaluation—without redundant Python installation or environment-setup fluff.

**Why this priority**: P1 delivers the core educational content and interactive browser experience on Buddhilive Academy. Without valid, well-structured `.mdx` lessons, the track cannot be built, navigated, or studied.

**Independent Test**: Run `pnpm astro check` and `pnpm build` after authoring the 8 `.mdx` files; verify all 8 pages render at `/learn/ai-engineer/<slug>`, pass Zod frontmatter validation, include `<PythonRunner client:visible />` and self-check exercises, and contain >= 350 words of prose in `my-writing-style`.

**Acceptance Scenarios**:

1. **Given** a learner opens `/learn/ai-engineer/ai-engineer/01-python-data-science-and-pandas` (or its resolved Astro content ID), **When** the page renders, **Then** they see Learning Objectives, a Concept Walkthrough written in `my-writing-style`, an in-browser `<PythonRunner client:visible />` snippet, a Google Colab code walkthrough, Exercises/Checkpoints, and a Reference Mapping table citing `.ref/Data-Science-For-Beginners`.
2. **Given** the 8 lessons (`order: 1` through `order: 8`) are grouped under `category: "Phase 1: Data Foundations & Classical ML"`, **When** `LessonSidebar.astro` and `LessonLayout.astro` render, **Then** the sidebar lists all 8 lessons in ascending order and Previous/Next navigation links step sequentially from Lesson 1 to Lesson 8.
3. **Given** any lesson involves mathematical formulations (e.g., MSE, OLS normal equation, sigmoid/log-loss, Euclidean distance/K-Means inertia, ARIMA differencing, precision/recall/F1), **When** rendered, **Then** KaTeX math expressions render cleanly alongside explanatory prose.

---

### User Story 2 - Companion Google Colab Notebooks & Launch Button (Priority: P2)

A learner reading any Phase 1 lesson clicks the **"Open with Google Colab"** button to launch the lesson's dedicated `.ipynb` notebook directly in Google Colab (free tier CPU), running open-source Python (`pandas`, `numpy`, `scikit-learn`, `matplotlib`, `statsmodels`) with zero Azure ML Studio or proprietary cloud dependencies.

**Why this priority**: Heavy tabular/ML workflows (`scikit-learn`, `matplotlib` plots, real CSV datasets) exceed lightweight Pyodide toy snippets and require a full Python data-science runtime on Colab CPU.

**Independent Test**: Validate every `.ipynb` file in `./notebook/ai-engineer/` is valid nbformat v4 JSON with runnable code cells (no Azure ML SDK or proprietary cloud calls), and verify every lesson's "Open with Google Colab" button links to `https://colab.research.google.com/github/buddhilive/bl-academy/blob/main/notebook/ai-engineer/<notebook>.ipynb`.

**Acceptance Scenarios**:

1. **Given** a learner is on any Phase 1 lesson page, **When** they click "Open with Google Colab", **Then** a new browser tab opens the corresponding notebook in Google Colab via its GitHub `main` branch URL (`rel="noopener noreferrer"`, `target="_blank"`).
2. **Given** the learner runs all cells top-to-bottom in Google Colab free tier, **When** cells execute, **Then** all imports (`pandas`, `numpy`, `scikit-learn`, `matplotlib`) and datasets resolve using open-source packages or self-contained/public CSV URLs without proprietary cloud credentials.

---

### User Story 3 - Track Continuity & Homepage Discoverability (Priority: P3)

A learner finishing the Python track or visiting the Buddhilive Academy homepage can discover and start the `ai-engineer` Phase 1 track seamlessly.

**Why this priority**: Connects the existing 12-lesson `python` track to Phase 1 and surfaces the new track on the landing page without altering core lesson mechanics.

**Independent Test**: Inspect `src/content/lessons/ai-engineer/01-*.mdx` frontmatter (`prerequisites: ["python-zero-to-hero/12-installing-third-party-packages-with-pip"]`) and verify `src/pages/index.astro` includes an active link to the first `ai-engineer` lesson.

**Acceptance Scenarios**:

1. **Given** a visitor opens `/` (`src/pages/index.astro`), **When** they browse the Subjects section, **Then** they see an active card/link for **AI & Data Science** (or **AI Engineer: Phase 1**) pointing to `/learn/ai-engineer/...` rather than a dead `#` placeholder.

---

### User Story 4 - Curriculum Manifest Synchronization (Priority: P4)

Project memory reflects the populated `.ref/ML-For-Beginners/ML-For-Beginners-main/` source tree and the updated 8-lesson Phase 1 sequence so future phases (Phases 2–6) stay aligned on `order` numbering (`9+`).

**Why this priority**: Keeps `.agents/memory/` accurate as the single source of truth for subsequent phase authoring, without blocking P1–P3 delivery.

**Independent Test**: Verify `.agents/memory/conventions/ai-engineer-curriculum-manifest.md` and `.agents/memory/decisions/002-ai-engineer-6-phase-curriculum.md` list the 8 Phase 1 lessons and their `.ref/Data-Science-For-Beginners` + `.ref/ML-For-Beginners/ML-For-Beginners-main` mappings.

**Acceptance Scenarios**:

1. **Given** Phase 1 uses `order: 1..8`, **When** Phase 2 lessons are authored later, **Then** the manifest clearly records Phase 2 starting at `order: 9`.

---

### Edge Cases

- **Pyodide vs. Colab boundary**: `<PythonRunner client:visible />` runs in a Pyodide Web Worker with a 5-second timeout and limited/no interactive Matplotlib GUI; in-browser snippets must use fast, deterministic pure-Python or `numpy` calculations, while `pandas`/`scikit-learn`/`matplotlib` plotting workflows live in the Colab-designed code sections and `.ipynb` files.
- **Unpopulated vs. populated `.ref/ML-For-Beginners` layout**: `.ref/ML-For-Beginners` stores its repository contents under `.ref/ML-For-Beginners/ML-For-Beginners-main/` rather than at the root; all Reference Mapping citations must use exact existing paths.
- **Proprietary cloud labs in source repos**: Any Azure ML Studio, Azure ML Designer, or cloud-specific CLI steps in `.ref/Data-Science-For-Beginners` or `.ref/ML-For-Beginners/ML-For-Beginners-main` must be replaced with equivalent open-source `pandas`/`scikit-learn`/`matplotlib` code.
- **Zero CLS & A11Y on buttons**: The "Open with Google Colab" button/banner must not cause layout shift and must meet WCAG 2.2 AA contrast in both Light (`#A7452A` / `#FFFFFF`) and Dark (`#E07A5F` / `#121212`) modes.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 (Progressive Lesson Sequence)**: The system MUST provide 8 `.mdx` lessons in `src/content/lessons/ai-engineer/` ordered `1` through `8` under `track: "ai-engineer"` and `category: "Phase 1: Data Foundations & Classical ML"`, progressing through:
  1. `01-python-data-science-and-pandas.mdx` — Python Data Science & Pandas (EDA)
  2. `02-data-preparation-and-cleaning.mdx` — Data Cleaning, Relational (SQLite) & JSON Sources
  3. `03-stats-probability-and-visualization.mdx` — Statistics, Probability & Data Visualization
  4. `04-regression-linear-and-logistic.mdx` — Regression: Linear, Polynomial & Logistic
  5. `05-classification-methods.mdx` — Classification: Multi-Class & Applied Classifiers
  6. `06-clustering-kmeans.mdx` — Unsupervised Clustering & K-Means
  7. `07-time-series-forecasting.mdx` — Time Series Forecasting: ARIMA & SVR
  8. `08-tabular-evaluation-and-pipelines.mdx` — Tabular Evaluation, Feature Engineering & Pipelines
- **FR-002 (Strict Schema Compliance)**: Every lesson's YAML frontmatter MUST validate against `src/content.config.ts` (`title`, `track`, `category`, `order`, `difficulty: "beginner"`, `xp`, `description` >= 30 chars, `topic`, `prerequisites`). Lesson 1 MUST list `["python-zero-to-hero/12-installing-third-party-packages-with-pip"]` in `prerequisites`.
- **FR-003 (Mandatory Lesson Sections)**: Every lesson MUST include:
  1. **Learning Objectives**
  2. **Concept Walkthrough** (with KaTeX formulas where mathematically relevant)
  3. **Runnable Python Code** (both an in-browser `<PythonRunner client:visible />` snippet and Colab-ready Python code)
  4. **Exercises / Checkpoints** (including `<QuizCard />` or structured self-check)
  5. **Reference Mapping** (explicitly citing the exact `.ref/Data-Science-For-Beginners/...` and `.ref/ML-For-Beginners/ML-For-Beginners-main/...` source files)
- **FR-004 (Skip Redundant Setup Fluff)**: Lessons MUST assume learners already know Python fundamentals and `pip`, omitting beginner Python installation, IDE setup, and virtual-environment boilerplate.
- **FR-005 (Authoring Voice & Minimum Depth)**: All lesson prose MUST follow the `my-writing-style` skill (direct opening hook, conversational yet pragmatic developer voice, clean H2/H3 structure, concise wrap-up, zero corporate fluff) and contain at least **350+ words** of explanatory prose per lesson.
- **FR-006 (Open-Source Stack Only)**: All code examples and notebooks MUST use open-source Python (`pandas`, `numpy`, `scikit-learn`, `matplotlib`, `statsmodels`, `sqlite3`) runnable on Google Colab free tier, replacing any Azure ML Studio or proprietary cloud labs.
- **FR-007 (Google Colab Notebooks)**: Each of the 8 lessons MUST have a corresponding `.ipynb` notebook in `./notebook/ai-engineer/` (e.g., `01-python-data-science-and-pandas.ipynb` through `08-tabular-evaluation-and-pipelines.ipynb`) formatted as valid Jupyter nbformat v4 JSON.
- **FR-008 (Open with Google Colab Button)**: Each lesson MUST render a prominent, accessible **"Open with Google Colab"** button/link pointing to `https://colab.research.google.com/github/buddhilive/bl-academy/blob/main/notebook/ai-engineer/<notebook>.ipynb` (`target="_blank"`, `rel="noopener noreferrer"`).
- **FR-009 (Accessibility — WCAG 2.2 AA)**: Any new UI component (such as a `ColabButton` static Astro component) and lesson markup MUST comply with WCAG 2.2 AA (`a11y` skill) and `DESIGN.md` tokens (`#A7452A` light / `#E07A5F` dark, >= 4.5:1 text contrast, visible `:focus-visible` indicator, semantic `<a href>` with clear accessible name, zero CLS).
- **FR-010 (Homepage & Track Integration)**: `src/pages/index.astro` MUST link to the `ai-engineer` Phase 1 track so learners can reach Lesson 1 from the homepage.

### Key Entities

- **Phase 1 Lesson (`.mdx`)**: Content collection entry in `src/content/lessons/ai-engineer/` validated by `src/content.config.ts`, containing frontmatter metadata, MDX prose, KaTeX math, `<PythonRunner client:visible />`, `<QuizCard />`, Colab link button, and reference mapping.
- **Companion Colab Notebook (`.ipynb`)**: Self-contained Jupyter notebook in `./notebook/ai-engineer/` aligned 1:1 with its lesson's runnable Python code and exercises, executable top-to-bottom on Google Colab free tier.
- **Reference Mapping**: Structured citation table at the end of each lesson linking Buddhilive Academy concepts to exact source lessons in `.ref/Data-Science-For-Beginners` and `.ref/ML-For-Beginners/ML-For-Beginners-main`.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `pnpm astro check` exits with `0` errors across all 8 new `.mdx` files and any new/updated `.astro` components.
- **SC-002**: `pnpm build` completes cleanly with `0` errors and generates static HTML pages for all 8 `ai-engineer` Phase 1 lessons.
- **SC-003**: 100% of lessons (8/8) contain >= 350 words of prose, Learning Objectives, Concept Walkthrough, `<PythonRunner client:visible />`, Exercises/Checkpoints, Reference Mapping, and a valid `https://colab.research.google.com/github/buddhilive/bl-academy/blob/main/notebook/ai-engineer/...` link.
- **SC-004**: 100% of companion notebooks (8/8) in `./notebook/ai-engineer/` parse as valid nbformat v4 JSON and contain zero references to Azure ML Studio or proprietary cloud SDKs.
- **SC-005**: Static accessibility verification (`buddhi scripts verify-a11y`) and contrast checks (`DESIGN.md` tokens) pass with zero WCAG 2.2 AA violations on any new/modified UI components.

---

## Assumptions

- The canonical GitHub repository for Colab links is `buddhilive/bl-academy` on branch `main` (`origin/HEAD`), and notebooks will be committed under `notebook/ai-engineer/`.
- Learners have already completed Python basics (`python-zero-to-hero` track or equivalent) and have internet access to open Google Colab free tier for `.ipynb` labs.
- `.ref/Data-Science-For-Beginners` and `.ref/ML-For-Beginners/ML-For-Beginners-main` remain the authoritative curriculum sources for Phase 1.
