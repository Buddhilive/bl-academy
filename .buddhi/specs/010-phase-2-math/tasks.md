# Tasks: Phase 2 Math & Neural Networks from First Principles Tutorials

**Input**: Design documents from `/.buddhi/specs/010-phase-2-math/`
**Prerequisites**: `plan.md` (required), `spec.md` (required)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`US1`, `US2`, `US3`, `US4`)

---

## Phase 1: Setup

**Purpose**: Initialize target directories for Phase 2 lessons and companion Google Colab notebooks.

- [x] T001 Create `src/content/lessons/math-and-neural-nets/` and `notebook/math-and-neural-nets/` directories

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend `ColabButton.astro` to support runtime tier labeling (`Free Tier CPU` vs. `Free Tier T4 GPU`) before authoring Phase 2 MDX lessons.

**⚠️ CRITICAL**: Must complete before authoring MDX lessons that pass the `runtime` prop to `ColabButton.astro`.

- [x] T002 Update `src/components/static/ColabButton.astro` to accept an optional `runtime?: string` prop (defaulting to `'Free Tier CPU'`) and render `notebook/{course}/{notebook} • {runtime}` while preserving WCAG 2.2 AA contrast, `min-h-[44px]`, `:focus-visible` outline, and `rel="noopener noreferrer"`
- [x] T003 Run `buddhi scripts verify-a11y` on `src/components/static/ColabButton.astro` to confirm zero static accessibility violations

**Checkpoint**: `ColabButton.astro` supports `Free Tier CPU` and `Free Tier T4 GPU` labels — User Story authoring can begin in parallel.

---

## Phase 3: User Story 1 - Progressive Phase 2 MDX Lessons (Priority: P1) 🎯 MVP

**Goal**: Deliver all 6 progressive Phase 2 `.mdx` tutorials in `src/content/lessons/math-and-neural-nets/` (`track: "math-neural-nets"`, `category: "Phase 2: Math & Neural Networks from First Principles"`, `difficulty: "intermediate"`, `order: 1..6`), grounded in `.ref/ai-engineering-from-scratch` and `.ref/AI-For-Beginners`, with explicit runtime tier notes, KaTeX math, `<PythonRunner client:visible />` pure-NumPy snippets, `<ColabButton />`, `<QuizCard client:visible />`, Reference Mapping, and `>= 350` words of prose.

**Independent Test**: Run `pnpm astro check` and `pnpm build`; verify all 6 pages render at `/learn/math-neural-nets/math-and-neural-nets/<slug>`, pass Zod schema validation, and contain `>= 350` words of prose plus all mandatory sections.

- [x] T004 [P] [US1] Author Lesson 1 in `src/content/lessons/math-and-neural-nets/01-linear-algebra-vectors-and-matrices.mdx` (`order: 1`, `xp: 50`, `Colab CPU`, `prerequisites: ["data-foundations-and-classical-ml/08-tabular-evaluation-and-pipelines"]`, grounded in `.ref/ai-engineering-from-scratch/phases/01-math-foundations/01-linear-algebra-intuition/docs/en.md`, `02-vectors-matrices-operations/docs/en.md`, `03-matrix-transformations/docs/en.md`, `12-tensor-operations/docs/en.md`)
- [x] T005 [P] [US1] Author Lesson 2 in `src/content/lessons/math-and-neural-nets/02-calculus-chain-rule-and-probability.mdx` (`order: 2`, `xp: 55`, `Colab CPU`, `prerequisites: ["math-and-neural-nets/01-linear-algebra-vectors-and-matrices"]`, grounded in `.ref/ai-engineering-from-scratch/phases/01-math-foundations/04-calculus-for-ml/docs/en.md`, `05-chain-rule-and-autodiff/docs/en.md`, `06-probability-and-distributions/docs/en.md`, `07-bayes-theorem/docs/en.md`, `08-optimization/docs/en.md`, `09-information-theory/docs/en.md`)
- [x] T006 [P] [US1] Author Lesson 3 in `src/content/lessons/math-and-neural-nets/03-perceptron-and-mlp-from-scratch.mdx` (`order: 3`, `xp: 60`, `Colab CPU`, `prerequisites: ["math-and-neural-nets/02-calculus-chain-rule-and-probability"]`, grounded in `.ref/AI-For-Beginners/lessons/3-NeuralNetworks/03-Perceptron/README.md`, `04-OwnFramework/README.md`, `.ref/ai-engineering-from-scratch/phases/03-deep-learning-core/01-the-perceptron/docs/en.md`, `02-multi-layer-networks/docs/en.md`)
- [x] T007 [P] [US1] Author Lesson 4 in `src/content/lessons/math-and-neural-nets/04-backpropagation-activations-and-losses.mdx` (`order: 4`, `xp: 65`, `Colab CPU`, `prerequisites: ["math-and-neural-nets/03-perceptron-and-mlp-from-scratch"]`, grounded in `.ref/ai-engineering-from-scratch/phases/03-deep-learning-core/03-backpropagation/docs/en.md`, `04-activation-functions/docs/en.md`, `05-loss-functions/docs/en.md`, `10-mini-framework/docs/en.md`)
- [x] T008 [P] [US1] Author Lesson 5 in `src/content/lessons/math-and-neural-nets/05-optimizers-regularization-and-pytorch.mdx` (`order: 5`, `xp: 70`, `Colab T4 GPU`, `prerequisites: ["math-and-neural-nets/04-backpropagation-activations-and-losses"]`, grounded in `.ref/ai-engineering-from-scratch/phases/03-deep-learning-core/06-optimizers/docs/en.md`, `07-regularization/docs/en.md`, `11-intro-to-pytorch/docs/en.md`, `.ref/AI-For-Beginners/lessons/3-NeuralNetworks/05-Frameworks/README.md`)
- [x] T009 [P] [US1] Author Lesson 6 in `src/content/lessons/math-and-neural-nets/06-cnns-rnns-and-attention-foundations.mdx` (`order: 6`, `xp: 80`, `Colab T4 GPU`, `prerequisites: ["math-and-neural-nets/05-optimizers-regularization-and-pytorch"]`, grounded in `.ref/AI-For-Beginners/lessons/4-ComputerVision/07-ConvNets/README.md`, `5-NLP/16-RNN/README.md`, `5-NLP/18-Transformers/README.md`, `.ref/ai-engineering-from-scratch/phases/07-transformers-deep-dive/02-self-attention-from-scratch/docs/en.md`, `03-multi-head-attention/docs/en.md`, `04-positional-encoding/docs/en.md`)
- [x] T010 [US1] Checkpoint: Run `pnpm astro check`, `pnpm build`, and validate all 6 `.mdx` lessons pass `>= 350`-word prose, pure-NumPy `<PythonRunner>` (no `torch` in Pyodide), `<QuizCard>`, `<ColabButton course="math-and-neural-nets" ... />`, runtime tier labels, and Reference Mapping checks

**Checkpoint**: User Story 1 (MVP) is complete and independently verifiable.

---

## Phase 4: User Story 2 - Companion Google Colab Notebooks (Priority: P2)

**Goal**: Provide 6 self-contained, open-source Python `.ipynb` notebooks in `notebook/math-and-neural-nets/` — Lessons 1–4 for `Colab CPU` (`numpy`, `matplotlib`) and Lessons 5–6 for `Colab T4 GPU` (`torch`, `numpy`, `matplotlib`) — with zero non-Google cloud AI services.

**Independent Test**: Validate all 6 `.ipynb` files are valid nbformat v4 JSON, pass `ast.parse()` on every Python code cell, contain zero proprietary/non-Google cloud imports, include `cuda`/CPU device fallback in Lessons 5–6, and match the exact filenames linked by `<ColabButton>` in `T004`–`T009`.

- [x] T011 [P] [US2] Create Colab CPU notebook `notebook/math-and-neural-nets/01-linear-algebra-vectors-and-matrices.ipynb`
- [x] T012 [P] [US2] Create Colab CPU notebook `notebook/math-and-neural-nets/02-calculus-chain-rule-and-probability.ipynb`
- [x] T013 [P] [US2] Create Colab CPU notebook `notebook/math-and-neural-nets/03-perceptron-and-mlp-from-scratch.ipynb`
- [x] T014 [P] [US2] Create Colab CPU notebook `notebook/math-and-neural-nets/04-backpropagation-activations-and-losses.ipynb`
- [x] T015 [P] [US2] Create Colab T4 GPU notebook `notebook/math-and-neural-nets/05-optimizers-regularization-and-pytorch.ipynb`
- [x] T016 [P] [US2] Create Colab T4 GPU notebook `notebook/math-and-neural-nets/06-cnns-rnns-and-attention-foundations.ipynb`
- [x] T017 [US2] Checkpoint: Run Python validation script on `notebook/math-and-neural-nets/*.ipynb` (nbformat v4 JSON, `ast.parse` on code cells, zero non-Google cloud SDKs, `torch.cuda.is_available()` check in 05–06, 1:1 match with lesson `<ColabButton>` links)

**Checkpoint**: User Story 2 is complete and independently verifiable.

---

## Phase 5: User Story 3 - Track Continuity & Homepage Discoverability (Priority: P3)

**Goal**: Surface the Phase 2 `math-neural-nets` track on `src/pages/index.astro` so learners can discover and launch Lesson 1 directly from the homepage.

**Independent Test**: Build the site and inspect `src/pages/index.astro` to verify the `Math & Neural Networks` card links to `/learn/math-neural-nets/math-and-neural-nets/01-linear-algebra-vectors-and-matrices`.

- [x] T018 [US3] Update `src/pages/index.astro` to query `track === 'math-neural-nets'` and add the **Math & Neural Networks** subject card (`New • 6 Lessons`) linking to Lesson 1

---

## Phase 6: User Story 4 - Curriculum Manifest Synchronization (Priority: P4)

**Goal**: Synchronize `.agents/memory/` with the shipped Phase 2 track ID (`math-neural-nets`), paths, and `.ref/` mappings.

**Independent Test**: Inspect `.agents/memory/conventions/ai-engineer-curriculum-manifest.md` and `.agents/memory/decisions/002-ai-engineer-6-phase-curriculum.md` for accurate Phase 2 metadata.

- [x] T019 [P] [US4] Update `.agents/memory/conventions/ai-engineer-curriculum-manifest.md` Phase 2 section with `track: "math-neural-nets"`, `src/content/lessons/math-and-neural-nets/`, `notebook/math-and-neural-nets/`, `order: 1..6`, and verified `.ref/` paths
- [x] T020 [P] [US4] Update `.agents/memory/decisions/002-ai-engineer-6-phase-curriculum.md` with Phase 2 (`010-phase-2-math`) grounding and runtime-aware `ColabButton` note

---

## Phase 7: Polish & Cross-Cutting Verification

**Purpose**: Final accessibility, build, and clean-state verification across all modified files.

- [x] T021 [P] Update `A11Y-DECISIONS.md` if `ColabButton.astro` runtime badge adds new accessibility notes, and run `buddhi scripts verify-a11y`
- [x] T022 Run final `pnpm astro check` and `pnpm build` after all edits and verify `git status`
