# Feature Specification: Phase 2 Math & Neural Networks from First Principles Tutorials

**Feature Branch**: `010-phase-2-math`

**Created**: 2026-11-20

**Status**: Draft

**Input**: User description: "Generate the Phase 2 tutorials (`src/content/lessons/math-and-neural-nets/`) for Buddhilive Academy using `.ref/ai-engineering-from-scratch` (math, ML/DL foundations, and transformer/attention sections) and `.ref/AI-For-Beginners` as reference sources, arranged from linear algebra/calculus/probability in raw NumPy → backpropagation & training loops → CNNs, sequence models, and Transformer/attention mechanics, noting runtime tier per lesson (Colab CPU vs Colab T4 GPU), replacing any non-Google cloud AI services with open-source Python (`numpy`, `torch`) on Google Colab free tier, following `AGENTS.md` and `src/content.config.ts`, with notebooks in `./notebook/math-and-neural-nets/` linked via an 'Open with Google Colab' button."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Progressive Phase 2 MDX Lessons (Priority: P1)

A learner who has completed Phase 1 (`data-foundations-and-classical-ml/08-tabular-evaluation-and-pipelines`) starts the `math-neural-nets` track in `src/content/lessons/math-and-neural-nets/` and works through 6 progressive lessons (`order: 1` through `6`) moving from linear algebra, calculus, and probability in raw NumPy, to perceptrons, MLPs, and backpropagation from scratch, to optimizers, PyTorch, CNNs, RNNs, and Transformer self-attention mechanics.

**Why this priority**: P1 delivers the core educational content, KaTeX mathematical derivations, and in-browser interactive NumPy exercises on Buddhilive Academy. Without valid, well-structured `.mdx` lessons, the Phase 2 track cannot be built, navigated, or studied.

**Independent Test**: Run `pnpm astro check` and `pnpm build` after authoring the 6 `.mdx` files; verify all 6 pages render at `/learn/math-neural-nets/math-and-neural-nets/<slug>`, pass `src/content.config.ts` Zod frontmatter validation, include `<PythonRunner client:visible />` and self-check exercises, explicitly state the lesson's Colab runtime tier (`Colab CPU` or `Colab T4 GPU`), and contain >= 350 words of explanatory prose.

**Acceptance Scenarios**:

1. **Given** a learner opens Lesson 1 (`01-linear-algebra-vectors-and-matrices`), **When** the page renders, **Then** they see Learning Objectives, an explicit `Colab CPU` runtime badge/note, a Concept Walkthrough with KaTeX linear algebra formulations, an in-browser `<PythonRunner client:visible />` NumPy snippet, a Colab walkthrough, self-check exercises, and a Reference Mapping table citing `.ref/ai-engineering-from-scratch`.
2. **Given** the 6 lessons (`order: 1` through `6`) share `track: "math-neural-nets"` and `category: "Phase 2: Math & Neural Networks from First Principles"`, **When** `LessonSidebar.astro` and `LessonLayout.astro` render, **Then** the sidebar lists all 6 lessons in ascending order and Previous/Next navigation links step sequentially from Lesson 1 to Lesson 6.
3. **Given** any lesson introduces mathematical foundations (dot products, matrix transformations, chain rule, Bayes' theorem/entropy, cross-entropy loss, gradient descent, convolution, scaled dot-product attention), **When** rendered, **Then** KaTeX math expressions render cleanly alongside explanatory prose.

---

### User Story 2 - Companion Google Colab Notebooks & Runtime-Aware Launch Button (Priority: P2)

A learner reading any Phase 2 lesson clicks the **"Open with Google Colab"** button to launch the lesson's dedicated `.ipynb` notebook in Google Colab free tier, with Lessons 1–4 configured for **Colab CPU** (pure `numpy`) and Lessons 5–6 configured for **Colab T4 GPU** (`torch` and `numpy`), with zero non-Google cloud AI services or proprietary SDKs.

**Why this priority**: Pure NumPy math exercises run fast on `Colab CPU` (and in-browser Pyodide), whereas PyTorch neural network training loops, CNNs, RNNs, and mini-Transformer attention training in Lessons 5–6 require a GPU-accelerated `Colab T4 GPU` runtime.

**Independent Test**: Validate every `.ipynb` file in `./notebook/math-and-neural-nets/` is valid Jupyter nbformat v4 JSON with runnable code cells (using only open-source `numpy`, `torch`, and standard library packages), verify `ColabButton.astro` displays the accurate runtime tier (`Free Tier CPU` vs `Free Tier T4 GPU`), and verify every button links to `https://colab.research.google.com/github/buddhilive/bl-academy/blob/main/notebook/math-and-neural-nets/<notebook>.ipynb`.

**Acceptance Scenarios**:

1. **Given** a learner is on Lessons 1–4, **When** they view the Colab launch banner, **Then** it displays `Free Tier CPU` and opens `https://colab.research.google.com/github/buddhilive/bl-academy/blob/main/notebook/math-and-neural-nets/<notebook>.ipynb` in a new tab (`target="_blank"`, `rel="noopener noreferrer"`).
2. **Given** a learner is on Lessons 5–6, **When** they view the Colab launch banner, **Then** it displays `Free Tier T4 GPU`, instructs the learner to select `Runtime -> Change runtime type -> T4 GPU` in Colab, and executes PyTorch training on CUDA when available (with CPU fallback).
3. **Given** the learner runs all cells top-to-bottom in Google Colab free tier, **When** cells execute, **Then** all imports (`numpy`, `torch`, `matplotlib`) and synthetic/built-in datasets run without Azure ML, AWS, OpenAI, or any non-Google cloud service credentials.

---

### User Story 3 - Track Continuity & Homepage Discoverability (Priority: P3)

A learner finishing Phase 1 (`data-foundations-and-classical-ml/08-tabular-evaluation-and-pipelines`) or visiting the Buddhilive Academy homepage can discover and launch the Phase 2 `math-neural-nets` track seamlessly.

**Why this priority**: Connects Phase 1 to Phase 2 in the curriculum progression and surfaces the new track on the homepage without altering core lesson mechanics.

**Independent Test**: Inspect `src/content/lessons/math-and-neural-nets/01-linear-algebra-vectors-and-matrices.mdx` frontmatter (`prerequisites: ["data-foundations-and-classical-ml/08-tabular-evaluation-and-pipelines"]`) and verify `src/pages/index.astro` includes an active card/link to Lesson 1 of `math-neural-nets`.

**Acceptance Scenarios**:

1. **Given** a visitor opens `/` (`src/pages/index.astro`), **When** they browse the Subjects section, **Then** they see an active card/link for **Math & Neural Networks** pointing to `/learn/math-neural-nets/...` with a badge showing `6 Lessons`.

---

### User Story 4 - Curriculum Manifest Synchronization (Priority: P4)

Project memory reflects the shipped Phase 2 track (`track: "math-neural-nets"`, `src/content/lessons/math-and-neural-nets/`, `notebook/math-and-neural-nets/`, `order: 1..6`) and its exact `.ref/` mappings so Phases 3–6 remain consistent with the standalone-track convention established in Phase 1.

**Why this priority**: Keeps `.agents/memory/` accurate as the single source of truth for subsequent phase authoring without blocking P1–P3 delivery.

**Independent Test**: Verify `.agents/memory/conventions/ai-engineer-curriculum-manifest.md` and `.agents/memory/decisions/002-ai-engineer-6-phase-curriculum.md` record Phase 2's track ID (`math-neural-nets`), folder paths, and `.ref/` source mappings.

**Acceptance Scenarios**:

1. **Given** Phase 1 uses `track: "data-ml"` and Phase 2 uses `track: "math-neural-nets"`, **When** future phases are specified, **Then** the manifest clearly documents the per-phase track convention and exact file paths.

---

### Edge Cases

- **Pyodide vs. Colab T4 GPU boundary**: `<PythonRunner client:visible />` executes in a Pyodide Web Worker with a hard 5-second timeout and no GPU/PyTorch support; therefore, all in-browser `<PythonRunner>` snippets (even in Lessons 5 and 6) MUST use fast, deterministic pure-Python + `numpy` toy calculations (e.g., an Adam step or a 4-token NumPy self-attention matrix), while full PyTorch `nn.Module` training loops live in the `Colab T4 GPU` code sections and `.ipynb` notebooks.
- **Runtime Tier Visibility**: `src/components/static/ColabButton.astro` currently hardcodes `Free Tier CPU`. Without adding an optional `runtime` prop, Lessons 5 and 6 would falsely label PyTorch GPU notebooks as `Free Tier CPU`.
- **Non-Google Cloud Removal**: Any Azure ML, TensorFlow/Keras cloud endpoints, or proprietary API references in `.ref/AI-For-Beginners` or `.ref/ai-engineering-from-scratch` must be replaced with open-source `numpy` and `torch` on Google Colab free tier.
- **Zero CLS & WCAG 2.2 AA**: All interactive buttons, `<PythonRunner>` islands, `<QuizCard>` components, and `ColabButton` banners must preserve fixed/stable layout dimensions (zero CLS) and meet WCAG 2.2 AA contrast (`#A7452A` / `#FFFFFF` in light mode, `#E07A5F` / `#121212` or `neutral-900` in dark mode) with visible `:focus-visible` outlines.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 (Progressive 6-Lesson Sequence)**: The system MUST provide 6 `.mdx` lessons in `src/content/lessons/math-and-neural-nets/` ordered `1` through `6` under `track: "math-neural-nets"` and `category: "Phase 2: Math & Neural Networks from First Principles"`:
  1. `01-linear-algebra-vectors-and-matrices.mdx` — Linear Algebra: Vectors, Matrices & Transformations (`Colab CPU`, `numpy`)
  2. `02-calculus-chain-rule-and-probability.mdx` — Calculus, Chain Rule, Probability & Optimization (`Colab CPU`, `numpy`)
  3. `03-perceptron-and-mlp-from-scratch.mdx` — The Perceptron & Multi-Layer Networks from Scratch (`Colab CPU`, `numpy`)
  4. `04-backpropagation-activations-and-losses.mdx` — Backpropagation, Activation Functions & Loss Functions (`Colab CPU`, `numpy`)
  5. `05-optimizers-regularization-and-pytorch.mdx` — Optimizers, Regularization & PyTorch Training Loops (`Colab T4 GPU`, `torch`, `numpy`)
  6. `06-cnns-rnns-and-attention-foundations.mdx` — CNNs, Sequence Models & Transformer Attention Mechanics (`Colab T4 GPU`, `torch`, `numpy`)
- **FR-002 (Strict Schema & Prerequisite Compliance)**: Every lesson's YAML frontmatter MUST validate against `src/content.config.ts` (`title`, `track: "math-neural-nets"`, `category`, `order`, `difficulty: "intermediate"`, `xp`, `description` >= 30 chars, `topic`, `prerequisites`). Lesson 1 MUST list `["data-foundations-and-classical-ml/08-tabular-evaluation-and-pipelines"]` in `prerequisites`, and Lessons 2–6 MUST chain sequentially.
- **FR-003 (Mandatory Lesson Structure & Depth)**: Every lesson MUST follow the W3Schools scannable layout with:
  1. **Learning Objectives** (including explicit runtime tier note: `Colab CPU` or `Colab T4 GPU`)
  2. **Concept Walkthrough** (with KaTeX formulas and reference/parameter tables)
  3. **Runnable Python Code** (both an in-browser `<PythonRunner client:visible />` pure-NumPy snippet and a Colab-ready Python walkthrough)
  4. **Exercises / Checkpoints** (`<QuizCard client:visible />` and/or structured self-check)
  5. **Reference Mapping** (table citing exact `.ref/ai-engineering-from-scratch/...` and `.ref/AI-For-Beginners/...` files)
  6. At least **350+ words** of clear explanatory prose per lesson.
- **FR-004 (Explicit Runtime Tier per Lesson)**: Each lesson MUST explicitly state its Colab runtime tier (`Colab CPU` for Lessons 1–4 pure NumPy math; `Colab T4 GPU` for Lessons 5–6 PyTorch neural network and mini-transformer training) both in lesson prose/callouts and in the `ColabButton` banner.
- **FR-005 (Open-Source Stack Only)**: All code examples and notebooks MUST use open-source Python (`numpy`, `torch`, `matplotlib`, standard library) on Google Colab free tier, replacing any non-Google cloud AI services or proprietary frameworks.
- **FR-006 (Companion Google Colab Notebooks)**: Each of the 6 lessons MUST have a corresponding `.ipynb` notebook in `./notebook/math-and-neural-nets/` (`01-linear-algebra-vectors-and-matrices.ipynb` through `06-cnns-rnns-and-attention-foundations.ipynb`) formatted as valid Jupyter nbformat v4 JSON, executable top-to-bottom on Google Colab free tier.
- **FR-007 (Runtime-Aware Open with Google Colab Button)**: `src/components/static/ColabButton.astro` MUST accept an optional `runtime` prop (defaulting to `'Free Tier CPU'`) alongside `course` and `notebook`, and each Phase 2 lesson MUST render `<ColabButton course="math-neural-nets" notebook="..." runtime="..." />` linking to `https://colab.research.google.com/github/buddhilive/bl-academy/blob/main/notebook/math-and-neural-nets/<notebook>.ipynb` (`target="_blank"`, `rel="noopener noreferrer"`).
- **FR-008 (Accessibility — WCAG 2.2 AA)**: Any UI updates (`ColabButton.astro`, `index.astro`, MDX markup) MUST comply with WCAG 2.2 AA (`a11y` skill) and `DESIGN.md` tokens (`#A7452A` / `#E07A5F`, >= 4.5:1 text contrast, >= 44px touch targets, visible `:focus-visible` indicator, semantic HTML, zero CLS).
- **FR-009 (Homepage Integration)**: `src/pages/index.astro` MUST include an active card/link for `Math & Neural Networks` pointing to Lesson 1 of `math-neural-nets`.

### Key Entities

- **Phase 2 Lesson (`.mdx`)**: Content collection entry in `src/content/lessons/math-and-neural-nets/` validated by `src/content.config.ts`, containing frontmatter metadata, MDX prose, KaTeX math, `<PythonRunner client:visible />`, `<QuizCard client:visible />`, `<ColabButton />`, and reference mapping.
- **Companion Colab Notebook (`.ipynb`)**: Self-contained Jupyter notebook in `./notebook/math-and-neural-nets/` aligned 1:1 with its lesson's runnable Python code and exercises, tagged for `Colab CPU` (Lessons 1–4) or `Colab T4 GPU` (Lessons 5–6).
- **Reference Mapping**: Citation table at the end of each lesson linking Buddhilive Academy topics to exact files in `.ref/ai-engineering-from-scratch` (`phases/01-math-foundations`, `phases/03-deep-learning-core`, `phases/07-transformers-deep-dive`) and `.ref/AI-For-Beginners` (`lessons/3-NeuralNetworks`, `lessons/4-ComputerVision`, `lessons/5-NLP`).

---

## Success Criteria *(mandatory)*

- **SC-001 (Schema & Build Pass)**: `pnpm astro check` and `pnpm build` exit with code `0`, generating all 6 Phase 2 lesson routes under `/learn/math-neural-nets/...` with zero Zod or TypeScript errors.
- **SC-002 (Prose & Pedagogy Compliance)**: All 6 `.mdx` files contain >= 350 words of prose, KaTeX math expressions, a `<PythonRunner client:visible />` pure-NumPy island, a `<QuizCard client:visible />` self-check, explicit runtime tier documentation, and verified `.ref/` citations.
- **SC-003 (Notebook Validity & URL Integrity)**: All 6 `.ipynb` files in `./notebook/math-and-neural-nets/` parse as valid nbformat v4 JSON, contain zero non-Google cloud SDKs, and match their lesson's `ColabButton` GitHub URL 1:1.
- **SC-004 (Runtime Tier Accuracy)**: Lessons 1–4 display `Free Tier CPU` and Lessons 5–6 display `Free Tier T4 GPU` on their `ColabButton` banner and in lesson instructions.
- **SC-005 (Accessibility Verification)**: `buddhi scripts verify-a11y` (or equivalent static A11Y check) passes with zero WCAG 2.2 AA violations on modified components (`ColabButton.astro`, `index.astro`).
- **SC-006 (Discoverability)**: `src/pages/index.astro` renders an active link to Lesson 1 of `math-neural-nets`, and Lesson 1 links back to Phase 1 Lesson 8 via `prerequisites`.
