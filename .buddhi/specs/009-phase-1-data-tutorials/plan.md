# Implementation Plan: Phase 1 Data Foundations & Classical ML Tutorials

**Branch**: `009-phase-1-data-tutorials` (branched from `develop`; Colab GitHub links target `main` once merged/pushed) | **Date**: 2026-11-20 | **Spec**: [spec.md](file:///C:/DevDojo/Buddhi/bl-academy/.buddhi/specs/009-phase-1-data-tutorials/spec.md)

**Input**: Feature specification from `.buddhi/specs/009-phase-1-data-tutorials/spec.md`

---

## Summary

Deliver **Phase 1: Data Foundations & Classical ML** for Buddhilive Academy as an 8-lesson progressive track (`track: "ai-engineer"`, `order: 1..8`) in `src/content/lessons/ai-engineer/*.mdx` paired 1:1 with 8 runnable Google Colab notebooks in `notebook/ai-engineer/*.ipynb`.

- **Authoring & Pedagogical Model**: Written in the `my-writing-style` voice, grounded strictly in `.ref/Data-Science-For-Beginners/` and `.ref/ML-For-Beginners/ML-For-Beginners-main/`, skipping redundant Python setup fluff, and replacing any Azure ML Studio or proprietary cloud labs with open-source Python (`pandas`, `numpy`, `scikit-learn`, `matplotlib`, `statsmodels`, `sqlite3`) on Google Colab free tier CPU.
- **Hybrid Execution Architecture**: Each lesson pairs lightweight, deterministic in-browser `<PythonRunner client:visible />` snippets (pure Python / `numpy` within the 5-second Pyodide Web Worker budget) with a full Colab `.ipynb` lab launched via a new static accessible component, `src/components/static/ColabButton.astro`.
- **Discoverability & Memory Sync**: Surface the `ai-engineer` track on `src/pages/index.astro`, link Lesson 1 from `python-zero-to-hero/12-installing-third-party-packages-with-pip`, and update `.agents/memory/` to reflect the populated `.ref/ML-For-Beginners` tree and 8-lesson Phase 1 sequence.

---

## Technical Context

- **Framework & Content Layer**: Astro `^7.4.4` (SSG), `@astrojs/mdx` `^8.1.2`, Zod content schema in `src/content.config.ts`, `remark-math` + `rehype-katex` for KaTeX formulas.
- **Interactive Islands**: `src/components/islands/PythonRunner.tsx` (Pyodide v0.26+ Web Worker, 5s timeout) and `src/components/islands/QuizCard.tsx` (WAI-ARIA `radiogroup` self-check).
- **New Static UI Component**: `src/components/static/ColabButton.astro` (zero client JS, zero CLS, WCAG 2.2 AA).
- **Notebook Runtime**: Jupyter `nbformat` v4 JSON (`.ipynb`) targeting Google Colab Free Tier CPU (`python3` kernel, open-source `pandas`, `numpy`, `scikit-learn`, `matplotlib`, `statsmodels`, `sqlite3`).
- **Storage**: Static `.mdx` and `.ipynb` files in the repository; no backend or database changes.
- **Testing & Verification**: `pnpm astro check`, `pnpm build`, Python validation script (nbformat v4 + `ast.parse` + no proprietary cloud imports + lesson contract check), and `buddhi scripts verify-a11y`.
- **Constraints**: Zero backend code execution, minimum 350+ words explanatory prose per lesson, WCAG 2.2 AA contrast & keyboard operability, zero CLS.

---

## AGENTS.md & DESIGN.md Compliance Check

- [x] **Grounding in `.ref/`**: Every lesson cites exact paths in `.ref/Data-Science-For-Beginners` and `.ref/ML-For-Beginners/ML-For-Beginners-main`.
- [x] **Content Generation Contract**: `.mdx` files in `src/content/lessons/ai-engineer/` strictly match `src/content.config.ts` Zod schema (`title`, `track`, `category`, `order`, `difficulty`, `xp`, `description` >= 30 chars, `topic`, `prerequisites`).
- [x] **Zero-Backend Code Execution**: All in-browser execution uses `<PythonRunner client:visible />` (Pyodide Web Worker); heavier ML/plotting labs run in Google Colab free tier.
- [x] **Theme & Contrast Integrity (`DESIGN.md`)**: Uses `#A7452A` / `#FFFFFF` and `#E07A5F` / `#121212` tokens, verified via `check_contrast` (5.95:1 and 6.35:1, both PASS AA >= 4.5:1).
- [x] **Layout Stability (Zero CLS)**: `ColabButton.astro` uses explicit padding/min-height (`min-h-[44px]`) inside static flow; existing `AdSlot.astro` containers remain untouched.
- [x] **No Unapproved Dependencies**: Zero new npm or Python dependencies added to `package.json`.

---

## Architectural Evaluation (Multi-Angle Lenses)

1. **Fewest-Slices**: Creating `ColabButton.astro`, the 8 `.mdx` lessons, the 8 `.ipynb` notebooks, and updating `src/pages/index.astro` delivers the complete Phase 1 experience without modifying `LessonLayout.astro`, `LessonSidebar.astro`, or `src/content.config.ts` (since `LessonSidebar.astro` already dynamically filters and groups by `track` and `category` sorted by `order`).
2. **Risk-First**:
   - *Pyodide Timeout / Package Risk*: `pandas`/`scikit-learn`/`matplotlib` imports in Pyodide can exceed the 5s Web Worker timeout or fail without GUI backends. **Mitigation**: Keep `<PythonRunner client:visible />` snippets strictly to fast pure-Python or `numpy` calculations, while `pandas`/`scikit-learn`/`matplotlib`/`statsmodels` workflows run in the Colab `.ipynb` notebooks.
   - *Broken Relative Dataset Paths in Colab*: Source notebooks in `.ref/` load local relative CSVs (e.g., `../data/pumpkins.csv`). When opened from GitHub in Colab, relative paths fail. **Mitigation**: Every `.ipynb` notebook generates self-contained synthetic/sklearn datasets OR fetches raw datasets directly via verified public HTTPS URLs (e.g., `raw.githubusercontent.com/microsoft/ML-For-Beginners/...` / `Data-Science-For-Beginners/...`) so cells run top-to-bottom out of the box.
   - *Colab GitHub Link Resolution*: Colab links point to `https://colab.research.google.com/github/buddhilive/bl-academy/blob/main/notebook/ai-engineer/<slug>.ipynb`. Once merged from `009-phase-1-data-tutorials` -> `develop` -> `main` and pushed, all 8 links resolve on GitHub.
3. **Seam-Quality**: Static Astro UI (`ColabButton.astro`) stays cleanly separated in `src/components/static/`, interactive islands stay in `src/components/islands/`, lessons stay in `src/content/lessons/ai-engineer/`, and notebooks stay in `notebook/ai-engineer/`.

---

## Accessibility Strategy (WCAG 2.2 AA)

- **Component**: `src/components/static/ColabButton.astro`
  - Uses a semantic `<a href={colabUrl} target="_blank" rel="noopener noreferrer">` element (not a clickable `<div>`), styled as a tactile button with `min-h-[44px]` touch target.
  - Includes an inline SVG Colab/external-link icon with `aria-hidden="true"` and explicit accessible text (`Open with Google Colab` + `<span class="sr-only"> (opens in a new tab)</span>`).
  - **Contrast** (verified via `check_contrast`): Primary surface `#A7452A` with `#FFFFFF` text (5.95:1 PASS AA) and dark-mode accent `#E07A5F` with `#121212` text (6.35:1 PASS AA), plus `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950`.
- **MDX Tables & Math**: All Reference Mapping and parameter tables use standard Markdown tables (`<thead>`, `<th scope="col">`, `<tbody>`); KaTeX inline/block math avoids colliding with bash `$` prompts (consistent with `A11Y-DECISIONS.md` Decision 7).
- **Governance & Gate**: Run `buddhi scripts verify-a11y` before completion and append `ColabButton.astro` contrast/focus decisions to `A11Y-DECISIONS.md`.

---

## 8-Lesson Phase 1 Curriculum & Reference Mapping

All lessons share:
- `track: "ai-engineer"`
- `category: "Phase 1: Data Foundations & Classical ML"`
- `difficulty: "beginner"`
- Notebook folder: `notebook/ai-engineer/`
- Colab URL pattern: `https://colab.research.google.com/github/buddhilive/bl-academy/blob/main/notebook/ai-engineer/<slug>.ipynb`

| Order | Slug & Notebook Filename | Title | XP | Prerequisites | Exact `.ref/` Source Files |
| :---: | :--- | :--- | :---: | :--- | :--- |
| 1 | `01-python-data-science-and-pandas` | Python Data Science & Pandas (EDA) | 40 | `["python-zero-to-hero/12-installing-third-party-packages-with-pip"]` | `.ref/Data-Science-For-Beginners/1-Introduction/01-defining-data-science/README.md`<br>`.ref/Data-Science-For-Beginners/1-Introduction/03-defining-data/README.md`<br>`.ref/Data-Science-For-Beginners/2-Working-With-Data/07-python/README.md`<br>`.ref/Data-Science-For-Beginners/2-Working-With-Data/07-python/notebook.ipynb` |
| 2 | `02-data-preparation-and-cleaning` | Data Cleaning, Relational & JSON Sources | 45 | `["ai-engineer/01-python-data-science-and-pandas"]` | `.ref/Data-Science-For-Beginners/2-Working-With-Data/05-relational-databases/README.md`<br>`.ref/Data-Science-For-Beginners/2-Working-With-Data/06-non-relational/README.md`<br>`.ref/Data-Science-For-Beginners/2-Working-With-Data/08-data-preparation/README.md`<br>`.ref/Data-Science-For-Beginners/2-Working-With-Data/08-data-preparation/notebook.ipynb` |
| 3 | `03-stats-probability-and-visualization` | Statistics, Probability & Data Visualization | 45 | `["ai-engineer/02-data-preparation-and-cleaning"]` | `.ref/Data-Science-For-Beginners/1-Introduction/04-stats-and-probability/README.md`<br>`.ref/Data-Science-For-Beginners/3-Data-Visualization/09-visualization-quantities/README.md`<br>`.ref/Data-Science-For-Beginners/3-Data-Visualization/10-visualization-distributions/README.md`<br>`.ref/Data-Science-For-Beginners/3-Data-Visualization/12-visualization-relationships/README.md`<br>`.ref/Data-Science-For-Beginners/3-Data-Visualization/13-meaningful-visualizations/README.md` |
| 4 | `04-regression-linear-and-logistic` | Regression: Linear, Polynomial & Logistic | 50 | `["ai-engineer/03-stats-probability-and-visualization"]` | `.ref/ML-For-Beginners/ML-For-Beginners-main/2-Regression/1-Tools/README.md`<br>`.ref/ML-For-Beginners/ML-For-Beginners-main/2-Regression/2-Data/README.md`<br>`.ref/ML-For-Beginners/ML-For-Beginners-main/2-Regression/3-Linear/README.md`<br>`.ref/ML-For-Beginners/ML-For-Beginners-main/2-Regression/4-Logistic/README.md` |
| 5 | `05-classification-methods` | Classification: Multi-Class & Applied Classifiers | 50 | `["ai-engineer/04-regression-linear-and-logistic"]` | `.ref/ML-For-Beginners/ML-For-Beginners-main/4-Classification/1-Introduction/README.md`<br>`.ref/ML-For-Beginners/ML-For-Beginners-main/4-Classification/2-Classifiers-1/README.md`<br>`.ref/ML-For-Beginners/ML-For-Beginners-main/4-Classification/3-Classifiers-2/README.md`<br>`.ref/ML-For-Beginners/ML-For-Beginners-main/4-Classification/4-Applied/README.md` |
| 6 | `06-clustering-kmeans` | Unsupervised Clustering & K-Means | 50 | `["ai-engineer/05-classification-methods"]` | `.ref/ML-For-Beginners/ML-For-Beginners-main/5-Clustering/1-Visualize/README.md`<br>`.ref/ML-For-Beginners/ML-For-Beginners-main/5-Clustering/2-K-Means/README.md` |
| 7 | `07-time-series-forecasting` | Time Series Forecasting: ARIMA & SVR | 55 | `["ai-engineer/06-clustering-kmeans"]` | `.ref/ML-For-Beginners/ML-For-Beginners-main/7-TimeSeries/1-Introduction/README.md`<br>`.ref/ML-For-Beginners/ML-For-Beginners-main/7-TimeSeries/2-ARIMA/README.md`<br>`.ref/ML-For-Beginners/ML-For-Beginners-main/7-TimeSeries/3-SVR/README.md` |
| 8 | `08-tabular-evaluation-and-pipelines` | Tabular Evaluation, Feature Engineering & Pipelines | 60 | `["ai-engineer/07-time-series-forecasting"]` | `.ref/ML-For-Beginners/ML-For-Beginners-main/9-Real-World/2-Debugging-ML-Models/README.md`<br>`.ref/Data-Science-For-Beginners/4-Data-Science-Lifecycle/15-analyzing/README.md`<br>`.ref/Data-Science-For-Beginners/4-Data-Science-Lifecycle/16-communication/README.md` |

---

## Project Structure

### Documentation (this feature)

```text
.buddhi/specs/009-phase-1-data-tutorials/
├── spec.md              # Feature specification (/specify output)
├── plan.md              # This file (/spec-plan output)
└── tasks.md             # Phase 2 task breakdown (/spec-tasks output)
```

### Source Code & Notebooks (repository root)

```text
src/
├── components/
│   └── static/
│       └── ColabButton.astro               # Accessible "Open with Google Colab" CTA
├── content/
│   └── lessons/
│       └── ai-engineer/
│           ├── 01-python-data-science-and-pandas.mdx
│           ├── 02-data-preparation-and-cleaning.mdx
│           ├── 03-stats-probability-and-visualization.mdx
│           ├── 04-regression-linear-and-logistic.mdx
│           ├── 05-classification-methods.mdx
│           ├── 06-clustering-kmeans.mdx
│           ├── 07-time-series-forecasting.mdx
│           └── 08-tabular-evaluation-and-pipelines.mdx
└── pages/
    └── index.astro                         # Link AI Engineer Phase 1 track card

notebook/
└── ai-engineer/
    ├── 01-python-data-science-and-pandas.ipynb
    ├── 02-data-preparation-and-cleaning.ipynb
    ├── 03-stats-probability-and-visualization.ipynb
    ├── 04-regression-linear-and-logistic.ipynb
    ├── 05-classification-methods.ipynb
    ├── 06-clustering-kmeans.ipynb
    ├── 07-time-series-forecasting.ipynb
    └── 08-tabular-evaluation-and-pipelines.ipynb

.agents/memory/
├── conventions/ai-engineer-curriculum-manifest.md
└── decisions/002-ai-engineer-6-phase-curriculum.md

A11Y-DECISIONS.md                           # Record ColabButton AA contrast & focus decision
```

**Structure Decision**: Reuse the existing Astro content collection (`src/content/lessons/`), `LessonLayout.astro`, and `LessonSidebar.astro` without modifying routing or schema. Add `ColabButton.astro` as a zero-JS static component alongside `AdSlot.astro` and `LessonSidebar.astro`, and place all `.ipynb` notebooks in `notebook/ai-engineer/`.

---

## Verification & Testing Strategy

1. **Typecheck & Schema Validation**: `pnpm astro check` must pass with 0 errors (verifies Zod frontmatter on all 8 `.mdx` files and `ColabButton.astro` / `index.astro` types).
2. **Production SSG Build**: `pnpm build` must succeed with 0 errors and emit `/learn/ai-engineer/ai-engineer/01-*` through `08-*`.
3. **Automated Content & Notebook Validator** (run via `uv run python` one-liner or scratch script):
   - Verify all 8 `.ipynb` files in `notebook/ai-engineer/` parse as `nbformat: 4`, contain markdown + code cells, pass `ast.parse()` on every Python code cell (ignoring `%` / `!` Colab magic lines), and contain zero Azure ML / proprietary cloud imports (`azureml`, `azure.ai`).
   - Verify all 8 `.mdx` files contain `>= 350` words of prose, Learning Objectives, Concept Walkthrough, `<PythonRunner`, `<QuizCard`, `<ColabButton`, and Reference Mapping citing `.ref/`.
4. **Accessibility Gate**: Run `buddhi scripts verify-a11y` via `terminal-runner` after implementing `ColabButton.astro` and `index.astro`.

---

## Complexity Tracking

No `AGENTS.md` or `DESIGN.md` violations or architectural trade-offs requiring exceptions.
