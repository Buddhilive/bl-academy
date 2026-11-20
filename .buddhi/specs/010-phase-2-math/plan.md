# Implementation Plan: Phase 2 Math & Neural Networks from First Principles Tutorials

**Branch**: `010-phase-2-math` (branched from `develop`; Colab GitHub links target `main` once merged/pushed) | **Date**: 2026-11-20 | **Spec**: [spec.md](file:///C:/DevDojo/Buddhi/bl-academy/.buddhi/specs/010-phase-2-math/spec.md)

**Input**: Feature specification from `.buddhi/specs/010-phase-2-math/spec.md`

---

## Summary

Deliver **Phase 2: Math & Neural Networks from First Principles** for Buddhilive Academy as a 6-lesson progressive track (`track: "math-neural-nets"`, `order: 1..6`, `difficulty: "intermediate"`) in `src/content/lessons/math-and-neural-nets/*.mdx`, paired 1:1 with 6 runnable Google Colab notebooks in `notebook/math-and-neural-nets/*.ipynb`.

- **Curriculum Progression**: Linear algebra, vectors, and matrix transformations in raw NumPy → calculus, chain rule, probability, and optimization in raw NumPy → perceptrons and multi-layer networks from scratch → backpropagation, activation functions, and loss functions → optimizers, regularization, and PyTorch training loops → CNNs, sequence models (RNNs/LSTMs), and Transformer self-attention mechanics.
- **Runtime Tier Hybrid**:
  - In-browser **Pyodide** (`<PythonRunner client:visible />`): Fast, deterministic pure-Python + `numpy` snippets across all 6 lessons (respecting the 5-second Web Worker timeout).
  - **Google Colab Free Tier**: Lessons 1–4 target **Colab CPU** (`numpy`, `matplotlib`), while Lessons 5–6 target **Colab T4 GPU** (`torch`, `numpy`, `matplotlib`). All non-Google cloud AI services (Azure ML, etc.) are replaced with open-source `numpy` and `torch`.
- **UI & Discoverability**: Extend `src/components/static/ColabButton.astro` with an optional `runtime` prop (default `'Free Tier CPU'`) so Lessons 5–6 accurately display `Free Tier T4 GPU`, add the Phase 2 card to `src/pages/index.astro`, link Lesson 1 from `data-foundations-and-classical-ml/08-tabular-evaluation-and-pipelines`, and sync `.agents/memory/`.

---

## Technical Context

- **Framework & Content Layer**: Astro `^7.4.4` (SSG), `@astrojs/mdx` `^8.1.2`, Zod content schema in `src/content.config.ts`, `remark-math` + `rehype-katex` for KaTeX formulas.
- **Interactive Islands**: `src/components/islands/PythonRunner.tsx` (Pyodide v0.26+ Web Worker, 5s timeout) and `src/components/islands/QuizCard.tsx` (WAI-ARIA `radiogroup` self-check).
- **Static UI Components**: `src/components/static/ColabButton.astro` (add optional `runtime?: string = 'Free Tier CPU'`, zero client JS, zero CLS, WCAG 2.2 AA).
- **Notebook Runtime**: Jupyter `nbformat` v4 JSON (`.ipynb`) targeting Google Colab Free Tier CPU (Lessons 1–4) and Google Colab Free Tier T4 GPU (Lessons 5–6) using open-source `numpy`, `torch`, and `matplotlib`.
- **Storage**: Static `.mdx` and `.ipynb` files in the repository; no backend or database changes.
- **Testing & Verification**: `pnpm astro check`, `pnpm build`, Python validation script (nbformat v4 + `ast.parse` + zero non-Google cloud imports + >= 350 words prose + Zod frontmatter + `ColabButton` runtime/URL alignment), and `buddhi scripts verify-a11y`.
- **Constraints**: Zero backend code execution, minimum 350+ words explanatory prose per lesson, WCAG 2.2 AA contrast & keyboard operability, zero CLS.

---

## AGENTS.md & DESIGN.md Compliance Check

- [x] **Grounding in `.ref/`**: Every lesson cites exact verified paths in `.ref/ai-engineering-from-scratch/` and `.ref/AI-For-Beginners/`.
- [x] **Content Generation Contract**: `.mdx` files in `src/content/lessons/math-and-neural-nets/` strictly match `src/content.config.ts` Zod schema (`title`, `track`, `category`, `order`, `difficulty`, `xp`, `description` >= 30 chars, `topic`, `prerequisites`).
- [x] **Zero-Backend Code Execution**: All in-browser execution uses `<PythonRunner client:visible />` (Pyodide Web Worker) with pure `numpy`; PyTorch training loops run on `Colab T4 GPU`.
- [x] **Theme & Contrast Integrity (`DESIGN.md`)**: Preserves `#A7452A` / `#FFFFFF` (5.95:1) and `#E07A5F` / `#121212` (6.35:1) tokens; `ColabButton.astro` uses `min-h-[44px]` and forced-colors-safe `focus-visible:outline-2`.
- [x] **Layout Stability (Zero CLS)**: `ColabButton.astro` and `index.astro` cards use explicit padding/min-height in static flow; `AdSlot.astro` containers remain untouched.
- [x] **No Unapproved Dependencies**: Zero new npm or Python dependencies added to `package.json`.

---

## Architectural Evaluation (Multi-Angle Lenses)

1. **Fewest-Slices**: Extending `ColabButton.astro` with one optional `runtime` prop, adding 6 `.mdx` lessons + 6 `.ipynb` notebooks, and adding 1 subject card in `src/pages/index.astro` delivers Phase 2 end-to-end without touching `LessonLayout.astro`, `LessonSidebar.astro`, `[...slug].astro`, or `src/content.config.ts`.
2. **Risk-First**:
   - *Pyodide Timeout / Missing `torch` in Browser*: Pyodide in the browser cannot run PyTorch GPU workloads and enforces a 5-second timeout. **Mitigation**: Keep `<PythonRunner client:visible />` snippets in Lessons 5–6 strictly to fast, deterministic pure-NumPy calculations (e.g., an Adam update step or a 4-token NumPy scaled dot-product attention matrix), while full `torch.nn.Module` training loops live in the `Colab T4 GPU` code sections and `.ipynb` notebooks.
   - *Colab GPU Availability Fallback*: A learner might open Lessons 5–6 before switching Colab to T4 GPU. **Mitigation**: Every PyTorch notebook starts with `device = torch.device("cuda" if torch.cuda.is_available() else "cpu")` plus an explicit runtime check cell and instructions (`Runtime -> Change runtime type -> T4 GPU`), so cells never crash on CPU fallback.
   - *External Dataset Failures in Colab*: Relative paths from `.ref/` fail when opened from GitHub. **Mitigation**: Notebooks use self-contained synthetic tensors/datasets or `torchvision`/`numpy` built-in generators so every notebook runs 100% offline-safe top-to-bottom.
3. **Seam-Quality**: Static UI (`ColabButton.astro`), interactive islands (`PythonRunner.tsx`, `QuizCard.tsx`), lessons (`src/content/lessons/math-and-neural-nets/`), and notebooks (`notebook/math-and-neural-nets/`) remain cleanly decoupled.

---

## Accessibility Strategy (WCAG 2.2 AA)

- **Component (`src/components/static/ColabButton.astro`)**:
  - Add optional `runtime = 'Free Tier CPU'` prop to `Props` and render it in the metadata badge (`notebook/{course}/{notebook} • {runtime}`).
  - Preserve existing Decision 8 compliance from `A11Y-DECISIONS.md`: semantic `<a href={colabUrl} target="_blank" rel="noopener noreferrer">`, `min-h-[44px]`, `<span class="sr-only"> (opens in a new tab)</span>`, `aria-hidden="true"` on the icon, and `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E07A5F]` (no `focus:outline-none`, preserving Windows Forced Colors).
- **Homepage (`src/pages/index.astro`)**:
  - New subject card reuses the existing semantic `<a>` card pattern with `focus-visible:ring-2 focus-visible:ring-[#E07A5F]` and `aria-hidden="true"` on decorative color dots.
- **MDX Lessons**:
  - Strict heading hierarchy (`<h2>` for main sections, `<h3>` for subsections; `<h1>` is rendered by `LessonLayout.astro`).
  - Standard Markdown tables for parameters and Reference Mapping (`<thead>`, `<th scope="col">`, `<tbody>`).
  - KaTeX inline/block math strictly separated from fenced bash blocks to avoid `$` delimiter collisions (`A11Y-DECISIONS.md` Decision 7).
- **Gate**: Run `buddhi scripts verify-a11y` after implementation and record any new UI decisions in `A11Y-DECISIONS.md`.

---

## 6-Lesson Phase 2 Curriculum & Reference Mapping

All lessons share:
- `track: "math-neural-nets"`
- `category: "Phase 2: Math & Neural Networks from First Principles"`
- `difficulty: "intermediate"`
- Lesson folder: `src/content/lessons/math-and-neural-nets/`
- Notebook folder: `notebook/math-and-neural-nets/`
- Colab URL pattern: `https://colab.research.google.com/github/buddhilive/bl-academy/blob/main/notebook/math-and-neural-nets/<slug>.ipynb`

| Order | Slug & Notebook Filename | Title | Runtime Tier | XP | Prerequisites | Exact `.ref/` Source Files |
| :---: | :--- | :--- | :--- | :---: | :--- | :--- |
| 1 | `01-linear-algebra-vectors-and-matrices` | Linear Algebra: Vectors, Matrices & Transformations | `Colab CPU` (`numpy`) | 50 | `["data-foundations-and-classical-ml/08-tabular-evaluation-and-pipelines"]` | `.ref/ai-engineering-from-scratch/phases/01-math-foundations/01-linear-algebra-intuition/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/01-math-foundations/02-vectors-matrices-operations/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/01-math-foundations/03-matrix-transformations/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/01-math-foundations/12-tensor-operations/docs/en.md` |
| 2 | `02-calculus-chain-rule-and-probability` | Calculus, Chain Rule, Probability & Optimization | `Colab CPU` (`numpy`) | 55 | `["math-and-neural-nets/01-linear-algebra-vectors-and-matrices"]` | `.ref/ai-engineering-from-scratch/phases/01-math-foundations/04-calculus-for-ml/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/01-math-foundations/05-chain-rule-and-autodiff/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/01-math-foundations/06-probability-and-distributions/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/01-math-foundations/07-bayes-theorem/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/01-math-foundations/08-optimization/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/01-math-foundations/09-information-theory/docs/en.md` |
| 3 | `03-perceptron-and-mlp-from-scratch` | The Perceptron & Multi-Layer Networks from Scratch | `Colab CPU` (`numpy`) | 60 | `["math-and-neural-nets/02-calculus-chain-rule-and-probability"]` | `.ref/AI-For-Beginners/lessons/3-NeuralNetworks/03-Perceptron/README.md`<br>`.ref/AI-For-Beginners/lessons/3-NeuralNetworks/04-OwnFramework/README.md`<br>`.ref/ai-engineering-from-scratch/phases/03-deep-learning-core/01-the-perceptron/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/03-deep-learning-core/02-multi-layer-networks/docs/en.md` |
| 4 | `04-backpropagation-activations-and-losses` | Backpropagation, Activation Functions & Loss Functions | `Colab CPU` (`numpy`) | 65 | `["math-and-neural-nets/03-perceptron-and-mlp-from-scratch"]` | `.ref/ai-engineering-from-scratch/phases/03-deep-learning-core/03-backpropagation/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/03-deep-learning-core/04-activation-functions/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/03-deep-learning-core/05-loss-functions/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/03-deep-learning-core/10-mini-framework/docs/en.md` |
| 5 | `05-optimizers-regularization-and-pytorch` | Optimizers, Regularization & PyTorch Training Loops | `Colab T4 GPU` (`torch`, `numpy`) | 70 | `["math-and-neural-nets/04-backpropagation-activations-and-losses"]` | `.ref/ai-engineering-from-scratch/phases/03-deep-learning-core/06-optimizers/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/03-deep-learning-core/07-regularization/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/03-deep-learning-core/11-intro-to-pytorch/docs/en.md`<br>`.ref/AI-For-Beginners/lessons/3-NeuralNetworks/05-Frameworks/README.md` |
| 6 | `06-cnns-rnns-and-attention-foundations` | CNNs, Sequence Models & Transformer Attention Mechanics | `Colab T4 GPU` (`torch`, `numpy`) | 80 | `["math-and-neural-nets/05-optimizers-regularization-and-pytorch"]` | `.ref/AI-For-Beginners/lessons/4-ComputerVision/07-ConvNets/README.md`<br>`.ref/AI-For-Beginners/lessons/5-NLP/16-RNN/README.md`<br>`.ref/AI-For-Beginners/lessons/5-NLP/18-Transformers/README.md`<br>`.ref/ai-engineering-from-scratch/phases/07-transformers-deep-dive/02-self-attention-from-scratch/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/07-transformers-deep-dive/03-multi-head-attention/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/07-transformers-deep-dive/04-positional-encoding/docs/en.md` |

---

## Project Structure

```text
bl-academy/
├── src/
│   ├── components/static/
│   │   └── ColabButton.astro                                  # Add optional `runtime` prop ('Free Tier CPU' | 'Free Tier T4 GPU')
│   ├── pages/
│   │   └── index.astro                                        # Add Phase 2 'Math & Neural Networks' subject card
│   └── content/lessons/math-and-neural-nets/
│       ├── 01-linear-algebra-vectors-and-matrices.mdx
│       ├── 02-calculus-chain-rule-and-probability.mdx
│       ├── 03-perceptron-and-mlp-from-scratch.mdx
│       ├── 04-backpropagation-activations-and-losses.mdx
│       ├── 05-optimizers-regularization-and-pytorch.mdx
│       └── 06-cnns-rnns-and-attention-foundations.mdx
├── notebook/math-and-neural-nets/
│   ├── 01-linear-algebra-vectors-and-matrices.ipynb           # Colab CPU
│   ├── 02-calculus-chain-rule-and-probability.ipynb           # Colab CPU
│   ├── 03-perceptron-and-mlp-from-scratch.ipynb              # Colab CPU
│   ├── 04-backpropagation-activations-and-losses.ipynb        # Colab CPU
│   ├── 05-optimizers-regularization-and-pytorch.ipynb         # Colab T4 GPU
│   └── 06-cnns-rnns-and-attention-foundations.ipynb         # Colab T4 GPU
└── .agents/memory/
    ├── conventions/ai-engineer-curriculum-manifest.md         # Sync Phase 2 track & paths
    └── decisions/002-ai-engineer-6-phase-curriculum.md        # Record Phase 2 track decision
```

---

## Verification & Testing Strategy

1. **Typecheck & Static Site Build**:
   - `pnpm astro check` (validates Zod frontmatter in `src/content.config.ts` and TypeScript props on `ColabButton.astro`).
   - `pnpm build` (renders all 6 `/learn/math-neural-nets/...` pages, KaTeX math, and `index.astro`).
2. **Notebook & Content Contract Validation (Python check script)**:
   - Parse all 6 `.ipynb` files as valid Jupyter `nbformat` v4 JSON and run `ast.parse()` on every Python code cell.
   - Assert zero proprietary/non-Google cloud imports (`azure`, `boto3`, `openai`, `anthropic`, `tensorflow` cloud SDKs).
   - Assert every `.mdx` lesson has >= 350 words of prose, `<PythonRunner client:visible />` with `packages={["numpy"]}` (no `torch` in Pyodide), `<QuizCard client:visible />`, `<ColabButton course="math-and-neural-nets" ... />`, and accurate `runtime` (`Free Tier CPU` for 1–4, `Free Tier T4 GPU` for 5–6).
3. **Accessibility Gate**:
   - Run `buddhi scripts verify-a11y` via `terminal-runner` after updating `ColabButton.astro` and `index.astro`.

---

## Complexity Tracking

No architectural complexity violations: zero new npm dependencies, zero backend services, and zero changes to core routing or layout contracts.
