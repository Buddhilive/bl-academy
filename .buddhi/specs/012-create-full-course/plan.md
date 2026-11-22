# Implementation Plan: Course 02 — Data Science for Beginners (`data-science-for-beginners`)

**Branch**: `012-create-full-course` | **Date**: 2026-11-21 | **Spec**: [spec.md](file:///C:/DevDojo/Buddhi/bl-academy/.buddhi/specs/012-create-full-course/spec.md)

**Input**: Feature specification from `/.buddhi/specs/012-create-full-course/spec.md`

---

## Summary

Deliver the complete 20-lesson **Course 02: Data Science for Beginners** (`track: "data-science-for-beginners"`) curriculum and 20 companion **Google Colab Free Tier** Jupyter notebooks (`./notebook/data-science-for-beginners/<slug>.ipynb`), grounded in `.ref/Data-Science-For-Beginners/`. Every lesson is authored as an Astro Content Collection `.mdx` file under `src/content/lessons/data-science-for-beginners/` using the `my-writing-style` skill, includes KaTeX mathematical and statistical definitions, structured reference tables, a fast pure-Python `<PythonRunner client:visible />` in-browser sandbox (`sqlite3`, `json`, `statistics`, `math`, `collections`), a `<ColabButton />` deep-link to its self-contained Pandas/Matplotlib/Seaborn/Scikit-Learn Colab notebook, and a `<QuizCard client:visible />` assessment. Proprietary cloud and emulator references (Azure Machine Learning Studio, Azure ML SDK, Azure Cosmos DB Emulator, Azure Stream Analytics, Text Analytics for Health, Power Automate) are replaced with open-source frameworks (`SQLite3`, `TinyDB`/`DuckDB`, `Pandas`, `Matplotlib`, `Seaborn`, `PyWaffle`, `NetworkX`, `Scikit-Learn`, `FLAML`/`PyCaret`, `MLflow`, `Gradio`, `Fairlearn`, `pystac-client`) and **Google AI Studio Free Tier** (`GEMINI_API_KEY` via `google-genai`).

---

## Technical Context

**Language/Version**: TypeScript 5.9.3, Astro 7.4.4, React 19.3.1, MDX (`@astrojs/mdx` 8.1.2), Python 3.11+ (Pyodide v0.26+ in-browser Web Worker & Jupyter `nbformat` v4 notebooks)

**Primary Dependencies**:
- **Frontend / SSG**: `astro`, `@astrojs/mdx`, `@astrojs/react`, `@astrojs/tailwind`, `remark-math`, `rehype-katex`, `katex`, `@uiw/react-codemirror`
- **Colab Notebook Stack (Free Tier)**: `numpy`, `pandas`, `scipy`, `matplotlib`, `seaborn`, `pywaffle`, `tinydb`, `duckdb`, `networkx`, `scikit-learn`, `flaml`, `mlflow`, `gradio`, `fairlearn`, `pystac-client`, `google-genai`

**Storage**: Static Git-tracked files (`src/content/lessons/data-science-for-beginners/*.mdx`, `notebook/data-science-for-beginners/*.ipynb`, `src/lib/curriculum.ts`) + browser `localStorage` for Pathfinder XP progress

**Testing & Verification**:
- `pnpm astro check` (Astro content collection Zod schema + TypeScript validation)
- `pnpm build` (Static site generation across all 20 new lesson routes + course hub `/learn/data-science-for-beginners`)
- Automated Python verification script (`verify_course_02.py`) checking all 20 `.mdx` files (frontmatter schema, word count >= 350 words, component imports/usages, deterministic execution of `initialCode` matching `expectedOutput`, zero forbidden upstream/Azure/Cosmos DB terms) and all 20 `.ipynb` notebooks (valid JSON `nbformat: 4`, self-contained datasets, zero broken local relative file paths)
- Accessibility & Design Token Gates: `uv run --with "buddhi-ai[MCP]" python .agents/skills/design-md/scripts/detect_design_md.py --lint` and `buddhi scripts verify-a11y`

**Target Platform**: Static Web (SSG) + In-Browser WebAssembly (`Pyodide` Web Worker) + Google Colab Free Tier (CPU) + Google AI Studio Free Tier (`GEMINI_API_KEY`)

**Project Type**: Static Educational Web Application & Interactive Curriculum Platform

**Performance Goals**:
- Zero main-thread blocking on page load (`client:visible` hydration for `PythonRunner` and `QuizCard`)
- Every `<PythonRunner />` `initialCode` executes deterministically in `< 2.0s` (well inside the hard 5-second `pyodide.worker.ts` timeout)
- Zero Cumulative Layout Shift (`CLS = 0`) across lesson pages and `AdSlot` containers

**Constraints**:
- Zero mentions of `.ref/`, `microsoft/Data-Science-For-Beginners`, Microsoft Learn, Azure Machine Learning, Cosmos DB, Azure Stream Analytics, Text Analytics for Health, or Microsoft Foundry in lesson prose or notebooks (credits live solely in `ACKNOWLEDGEMENTS.md`)
- Self-contained `.ipynb` notebooks: must embed or deterministically generate/fetch all datasets (`birds.csv`, `mushrooms.csv`, `honey.csv`, MLB heights/weights, `airports.db`, `PersonsData.json`, `TwitterData.json`, `form.csv`, `emails.csv`, `liaisons.json`, `heart_failure_clinical_records_dataset.csv`) so they execute out-of-the-box on Google Colab without missing `../../data/` errors
- Strict WCAG 2.2 AA contrast and heading hierarchy (`H1` rendered by `LessonLayout.astro`, so MDX bodies use `H2` → `H3` without skipping levels)

**Scale/Scope**:
- 1 curriculum registry update (`src/lib/curriculum.ts`)
- 20 `.mdx` tutorial lessons (`src/content/lessons/data-science-for-beginners/01-*.mdx` through `20-*.mdx`)
- 20 `.ipynb` companion Google Colab notebooks (`notebook/data-science-for-beginners/01-*.ipynb` through `20-*.ipynb`)

---

## Multi-Angle Architectural Evaluation & System Design

### 1. Architectural Lenses
- **Fewest-Slices Lens**: Reuse existing, battle-tested layout and interactive components (`LessonLayout.astro`, `LessonSidebar.astro`, `ColabButton.astro`, `PythonRunner.tsx`, `QuizCard.tsx`) with zero new npm dependencies or UI component changes. Updating `src/lib/curriculum.ts` and adding `.mdx` files under `src/content/lessons/data-science-for-beginners/` automatically populates `/learn/data-science-for-beginners`, the left sidebar, the Pathfinder progress bar, and the cross-course handoff links from Course 01 (`ai-for-beginners/25-multimodal-networks-clip-and-vqgan`) and into Course 03 (`ml-for-beginners`).
- **Risk-First Lens**:
  1. *Pyodide 5s Timeout & Plotting Constraints*: Heavy plotting libraries (`seaborn`, `pywaffle`, `gradio`, `flaml`) cannot render interactive GUI windows inside the 5-second stdout-based Pyodide Web Worker (`src/workers/pyodide.worker.ts`). **Mitigation**: Each lesson's `<PythonRunner />` uses Python's standard library (`sqlite3`, `json`, `math`, `statistics`, `collections`, `csv`) to execute the exact statistical calculation, SQL `INNER JOIN`, JSON document filter, missing-value imputation, wingspan outlier detector, waffle proportion grid, or Heart Failure JSON scoring function deterministically in `< 150ms` with exact `expectedOutput`, while full `Matplotlib` / `Seaborn` / `PyWaffle` / `Gradio` visual charts run in the linked Colab `.ipynb` notebook.
  2. *Missing Relative CSV/DB Files in Google Colab*: Reference notebooks in `.ref/Data-Science-For-Beginners` load local relative paths (`../../data/birds.csv`, `../../data/mushrooms.csv`, `../../data/honey.csv`, `airports.db`, `PersonsData.json`, `TwitterData.json`, `form.csv`, `emails.csv`, `liaisons.json`). **Mitigation**: Every notebook in `./notebook/data-science-for-beginners/` includes a self-contained data loader cell that creates the dataset inline (or fetches from a verified raw GitHub URL with a full inline DataFrame fallback) so `FileNotFoundError` never occurs.
- **Seam-Quality Lens**: Clean 1-to-1 slug parity (`<slug>.mdx` ↔ `notebook/data-science-for-beginners/<slug>.ipynb`) across all 20 lessons (`01` through `20`).

### 2. System Design Trade-Off Analysis (`system-design`)

| Decision Area | Option A (Chosen) | Option B (Rejected) | Trade-off Rationale |
| :--- | :--- | :--- | :--- |
| **In-Browser `<PythonRunner />` Sandbox Design** | Pure-Python standard-library (`sqlite3`, `json`, `statistics`, `math`, `collections`) data pipelines with deterministic `expectedOutput` | Loading `pandas`/`matplotlib`/`seaborn` via `micropip` inside the 5s Web Worker on every page load | Standard library modules (`sqlite3`, `json`, `statistics`) run in `< 100ms` inside Pyodide with zero network dependency or 5s timeout risk, while teaching the exact SQL/JSON/statistical mechanics. |
| **NoSQL & Document Database Replacement (Lesson 06)** | Open-source Python JSON document stores (`TinyDB`, `DuckDB`, and `sqlite3` JSON queries) running in-browser and on Google Colab | Windows-only Azure Cosmos DB Local Emulator | Cosmos DB Emulator requires Windows local installation and Azure-specific metadata (`_rid`, `_etag`). Open-source JSON document querying runs anywhere in seconds and directly transfers to modern document DBs and DuckDB analytics. |
| **Cloud AutoML, SDK & LLM Replacement (Lessons 07, 17, 18, 19, 20)** | Open-source `FLAML`/`PyCaret` + `Scikit-Learn Pipeline` + `MLflow` + `Gradio` + **Google AI Studio Free Tier** (`google-genai` with `GEMINI_API_KEY`) | Paid Azure ML Workspace + Compute Clusters + Azure Container Instances + Azure Text Analytics for Health | Eliminates paid Azure subscriptions, 45-minute cluster provisioning delays, and deprecated `azureml-core` v1 SDK calls, giving learners instant free-tier reproducibility on Google Colab. |

---

## AGENTS.md & DESIGN.md Compliance Check

*GATE: Verified against `AGENTS.md`, `DESIGN.md`, `A11Y-DECISIONS.md`, and `.agents/rules/`.*

- [x] **Project build & test commands adhered to**: Uses `pnpm astro check` and `pnpm build`.
- [x] **9-Course Sequential Learning Path & Grounding**: Course 02 (`data-science-for-beginners`) connects directly from `ai-for-beginners/25-multimodal-networks-clip-and-vqgan` (`Course 01`) and hands off to `ml-for-beginners` (`Course 03`). All 20 lessons are grounded in `.ref/Data-Science-For-Beginners/` with zero `.ref/` mentions in lesson prose.
- [x] **Content Generation Contract**: Every `.mdx` file validates against `src/content.config.ts`, uses `my-writing-style`, and includes opening hook, KaTeX math/formulas, `<PythonRunner client:visible />`, `<ColabButton course="data-science-for-beginners" />`, reference tables, `<QuizCard client:visible />`, and 350+ words of explanatory prose.
- [x] **Open-Source Colab Free Tier & Google AI Studio Free Tier Stack**: Replaces Azure ML, Cosmos DB, Stream Analytics, and Text Analytics for Health with open-source Python on Colab Free Tier and Google AI Studio Free Tier (`GEMINI_API_KEY` via `google-genai`).
- [x] **Zero-Backend Browser Execution**: Pure client-side Pyodide execution in `/src/workers/pyodide.worker.ts`; zero server-side execution dependencies.
- [x] **Theme, Contrast & Accessibility Strategy (`DESIGN.md` & `A11Y-DECISIONS.md`)**:
  - Reuses accessible `<PythonRunner client:visible />` (Decision 1: Escape key focus-trap release; Decision 3: `aria-live="polite"` output region; Decision 4: reduced-motion confetti guard), `<QuizCard client:visible />` (Decision 2: `role="radiogroup"`, `aria-checked`, polite explanation region), and `<ColabButton />` (Decision 8 & 9: `min-h-[44px]`, forced-colors-safe focus outline, `.sr-only` new-tab announcement, high-contrast runtime metadata).
  - Maintains strict `H2` → `H3` heading hierarchy inside MDX articles (since `LessonLayout.astro` renders `H1`).
  - Uses standard Markdown tables (rendered with semantic `<table>`, `<thead>`, `<th scope="col">`, `<tbody>`) and fences all shell/SQL commands so `$` never collides with KaTeX math delimiters.
  - Preserves fixed-height `AdSlot.astro` containers for zero CLS.

---

## Project Structure

### Documentation (this feature)

```text
.buddhi/specs/012-create-full-course/
├── spec.md              # Feature specification (20 lessons, 4 user stories, requirements)
├── plan.md              # This implementation plan (/spec-plan output)
└── tasks.md             # Actionable task list (/spec-tasks output)
```

### Source Code (repository root)

```text
src/
├── content.config.ts                                    # Zod schema for lessons collection
├── lib/
│   └── curriculum.ts                                    # Update data-science-for-beginners: plannedLessonCount: 20, usesGeminiApi: true, runtimeBadges, 4 syllabusModules
├── components/
│   ├── islands/
│   │   ├── PythonRunner.tsx                             # Reused in-browser Pyodide runner
│   │   └── QuizCard.tsx                                 # Reused accessible quiz component
│   └── static/
│       ├── ColabButton.astro                            # Reused Google Colab deep-link CTA
│       ├── LessonSidebar.astro                          # Dynamic category-grouped sidebar
│       └── AdSlot.astro                                 # Zero-CLS reserved ad slot
└── content/
    └── lessons/
        └── data-science-for-beginners/                  # 20 MDX lessons (order: 1..20)
            ├── 01-defining-data-science.mdx
            ├── 02-data-science-ethics.mdx
            ├── 03-defining-data.mdx
            ├── 04-statistics-and-probability.mdx
            ├── 05-working-with-relational-data.mdx
            ├── 06-working-with-nosql-data.mdx
            ├── 07-working-with-python-and-pandas.mdx
            ├── 08-data-preparation-and-cleaning.mdx
            ├── 09-visualizing-quantities.mdx
            ├── 10-visualizing-distributions.mdx
            ├── 11-visualizing-proportions.mdx
            ├── 12-visualizing-relationships.mdx
            ├── 13-meaningful-visualizations.mdx
            ├── 14-data-science-lifecycle-introduction.mdx
            ├── 15-data-science-lifecycle-analyzing.mdx
            ├── 16-data-science-lifecycle-communication.mdx
            ├── 17-data-science-in-the-cloud.mdx
            ├── 18-low-code-data-science-and-automl.mdx
            ├── 19-cloud-ml-sdk-and-pipelines.mdx
            └── 20-data-science-in-the-wild.mdx

notebook/
└── data-science-for-beginners/                          # 20 self-contained Colab notebooks (nbformat v4)
    ├── 01-defining-data-science.ipynb
    ├── 02-data-science-ethics.ipynb
    ├── 03-defining-data.ipynb
    ├── 04-statistics-and-probability.ipynb
    ├── 05-working-with-relational-data.ipynb
    ├── 06-working-with-nosql-data.ipynb
    ├── 07-working-with-python-and-pandas.ipynb
    ├── 08-data-preparation-and-cleaning.ipynb
    ├── 09-visualizing-quantities.ipynb
    ├── 10-visualizing-distributions.ipynb
    ├── 11-visualizing-proportions.ipynb
    ├── 12-visualizing-relationships.ipynb
    ├── 13-meaningful-visualizations.ipynb
    ├── 14-data-science-lifecycle-introduction.ipynb
    ├── 15-data-science-lifecycle-analyzing.ipynb
    ├── 16-data-science-lifecycle-communication.ipynb
    ├── 17-data-science-in-the-cloud.ipynb
    ├── 18-low-code-data-science-and-automl.ipynb
    ├── 19-cloud-ml-sdk-and-pipelines.ipynb
    └── 20-data-science-in-the-wild.ipynb
```

**Structure Decision**: Uses Astro's existing file-based content collection (`src/content/lessons/data-science-for-beginners/<slug>.mdx`) and top-level `./notebook/data-science-for-beginners/<slug>.ipynb` directory so `ColabButton.astro` resolves `https://colab.research.google.com/github/buddhilive/bl-academy/blob/main/notebook/data-science-for-beginners/<slug>.ipynb` without modifying any routing or component code.

---

## Detailed Module & Lesson Implementation Blueprint

### Module 1: Data Foundations & Statistics (`category: "Module 1: Data Foundations & Statistics"`)
1. **Lesson 01 (`01-defining-data-science`, `order: 1`, `xp: 50`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["ai-for-beginners/25-multimodal-networks-clip-and-vqgan"]`
   - **Reference**: `.ref/Data-Science-For-Beginners/1-Introduction/01-defining-data-science/README.md`, `notebook.ipynb`, `assignment.md`
   - **Content**: What is Data & Data Science (extracting actionable insights from structured, semi-structured, and unstructured data); Jim Gray's Four Paradigms of Science (Empirical, Theoretical, Computational, Data-Driven); Relationship to Databases, Big Data (Parquet/Data Lakes), Machine Learning, AI, and Visualization; The 5-Step Data Journey (Acquisition, Storage, Processing, Visualization, Predictive Modeling); Digitalization vs Digital Transformation (online course normalized completion time $\bar{t}_m = \frac{1}{N}\sum_{i=1}^N \frac{t_{i,m}}{L_m}$ and concept-mapped assessment analysis); Setting up Google Colab Free Tier and a free **Google AI Studio API Key** (`GEMINI_API_KEY`).
   - **Pyodide Sandbox**: Pure-Python text concept extractor & normalized module difficulty analyzer (extracting top domain keywords across Data Science, Big Data, and Machine Learning corpus snippets and computing character-normalized module difficulty scores).
   - **Colab Notebook**: `01-defining-data-science.ipynb` (Wikipedia text extraction, stopword filtering, `wordcloud` + `matplotlib` frequency visualization for Data Science, Big Data, and Machine Learning, plus Colab environment check).
2. **Lesson 02 (`02-data-science-ethics`, `order: 2`, `xp: 60`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["data-science-for-beginners/01-defining-data-science"]`
   - **Reference**: `.ref/Data-Science-For-Beginners/1-Introduction/02-ethics/README.md`, `assignment.md`
   - **Content**: Living in a datafied world (zettabyte scale & algorithmic influence); Ethics vs Data Ethics vs Applied Ethics vs Ethics Culture; The 6 Core Responsible AI Principles (Accountability, Transparency, Fairness, Reliability & Safety, Privacy & Security, Inclusiveness); 10 Ethical Challenges in Data Collection & Algorithm Design (Data Ownership, Informed Consent, Intellectual Property, Data Privacy & $k$-Anonymity, Right to Be Forgotten/Erasure, Dataset Collection Bias, Data Quality, Algorithm Fairness: Allocation vs Quality-of-Service harms, Data Misrepresentation, Illusion of Free Choice / Dark Patterns); Landmark Case Studies Table (Tuskegee Syphilis Study, Netflix Prize De-anonymization via IMDb linkage, Boston Street Bump pothole digital divide, MIT Gender Shades & Apple Card, Georgia COVID-19 non-chronological chart, ABCmouse FTC dark patterns, 530M User Data Breach); Operationalizing ethics via Professional Codes (ACM, DSA), Checklists (`Deon`), Regulations (1974 US Privacy Act, HIPAA, COPPA, GDPR 8 User Rights, CCPA, PIPL), and pulling the Andon Cord.
   - **Pyodide Sandbox**: Pure-Python Privacy & Fairness Auditor checking $k$-anonymity quasi-identifier re-identification risk (simulating Netflix/IMDb linkage) and subgroup error-rate / disparate impact disparity.
   - **Colab Notebook**: `02-data-science-ethics.ipynb` (Hands-on Deon checklist generator, quasi-identifier $k$-anonymity auditor in Pandas, and subgroup fairness auditing with open-source `fairlearn` + Case Study analysis).
3. **Lesson 03 (`03-defining-data`, `order: 3`, `xp: 55`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["data-science-for-beginners/02-data-science-ethics"]`
   - **Reference**: `.ref/Data-Science-For-Beginners/1-Introduction/03-defining-data/README.md`, `assignment.md`
   - **Content**: Raw data vs curated datasets; Quantitative data (continuous & discrete numerical measurements, AQI seasonal trends, traffic probability) vs Qualitative / Categorical data (nominal, ordinal, and numerical identifiers like phone numbers or zip codes that aren't used arithmetically); Structural Taxonomy: Structured Data (strict row/column schemas, constraints, relational tables, cost of schema evolution), Unstructured Data (raw text, video, sensor logs with corrupted `'e'` error tokens), and Semi-Structured Data (JSON, CSV, HTML, hierarchical metadata tags/attributes); Primary vs Secondary Data Sources (databases, files, REST APIs, web scraping).
   - **Pyodide Sandbox**: Pure-Python Dataset Taxonomy & Sensor Log Sanitizer that classifies mixed fields (quantitative vs qualitative, structured vs semi-structured JSON vs corrupted sensor stream with `'e'` error tokens) and computes clean summary metrics.
   - **Colab Notebook**: `03-defining-data.ipynb` (Inspecting and classifying 5 real-world structured, semi-structured JSON/CSV, and unstructured text datasets in Pandas + Assignment: Classifying Datasets).
4. **Lesson 04 (`04-statistics-and-probability`, `order: 4`, `xp: 75`, `difficulty: "intermediate"`)**:
   - **Prerequisites**: `["data-science-for-beginners/03-defining-data"]`
   - **Reference**: `.ref/Data-Science-For-Beginners/1-Introduction/04-stats-and-probability/README.md`, `notebook.ipynb`, `assignment.md`
   - **Content**: Probability $P(E) \in [0,1]$, sample space $S$, and Discrete vs Continuous Random Variables; Probability Mass Function vs Probability Density Function $P(t_1 \le X < t_2) = \int_{t_1}^{t_2} p(x)\,dx$; Uniform and Normal Distributions $\mathcal{N}(\mu, \sigma^2)$; Expectation $\mathbb{E}[X] = \sum x_i p_i$, Sample Mean $\mu$, Variance $\sigma^2 = \frac{1}{n}\sum (x_i - \mu)^2$, and Standard Deviation $\sigma$; Median, Mode (and multimodal distributions), Quartiles ($Q_1, Q_3$), Inter-Quartile Range $\text{IQR} = Q_3 - Q_1$, and Box-Plot Outlier boundaries $[Q_1 - 1.5\,\text{IQR},\, Q_3 + 1.5\,\text{IQR}]$; Confidence Intervals using Student's $t$-distribution $\bar{X} \pm t_{(1-p)/2, \nu}\frac{s}{\sqrt{n}}$ (and William Sealy Gosset's Guinness brewery history); Hypothesis Testing & two-sample Welch's $t$-test (`scipy.stats.ttest_ind`) on the UCLA SOCR Major League Baseball (MLB) dataset (proving First Basemen are significantly taller than Second Basemen / Designated Hitters); Central Limit Theorem & Law of Large Numbers; Covariance $\text{Cov}(X,Y) = \mathbb{E}[(X-\mathbb{E}[X])(Y-\mathbb{E}[Y])]$ and Pearson Correlation Coefficient $r_{XY} = \frac{\text{Cov}(X,Y)}{\sigma_X \sigma_Y} \in [-1, 1]$.
   - **Pyodide Sandbox**: Pure-Python Statistical Engine analyzing the MLB player dataset (computing mean, $\sigma$, quartiles/IQR outliers, 95% confidence intervals, Pearson height-weight correlation $r \approx 0.53$, and two-sample $t$-statistics across First Basemen, Second Basemen, Shortstops, and Third Basemen).
   - **Colab Notebook**: `04-statistics-and-probability.ipynb` (Complete MLB Heights/Weights statistical analysis, histograms, box plots by role, Student's $t$-interval tables at $p \in \{0.85, 0.90, 0.95\}$, `scipy.stats.ttest_ind` hypothesis tests, and Assignment: Small Diabetes Study).

### Module 2: Working with Data (`category: "Module 2: Working with Data"`)
5. **Lesson 05 (`05-working-with-relational-data`, `order: 5`, `xp: 65`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["data-science-for-beginners/04-statistics-and-probability"]`
   - **Reference**: `.ref/Data-Science-For-Beginners/2-Working-With-Data/05-relational-databases/README.md`, `assignment.md`, `airports.db`
   - **Content**: From flat spreadsheets to Relational Databases; Shortcomings of a single-table approach (row duplication vs schema-altering year columns `2018 | 2019 | 2020`); Normalization, Primary Keys (`PK` — immutable identifiers like `city_id`), and Foreign Keys (`FK` — relational pointers in `rainfall`); Structured Query Language (SQL) fundamentals: `SELECT`, `FROM`, case-sensitivity conventions, filtering rows with `WHERE`, and combining normalized tables with `INNER JOIN ... ON cities.city_id = rainfall.city_id`; Exploring the `airports.db` schema (`airports`, `cities`, `countries`) with Python's built-in `sqlite3`.
   - **Pyodide Sandbox**: In-browser `sqlite3` relational database executing the `cities` + `rainfall` `INNER JOIN` for 2019 rainfall and querying the multi-table `airports` database (`cities` + `airports` joined on `city_id`) for United Kingdom and international airport codes.
   - **Colab Notebook**: `05-working-with-relational-data.ipynb` (Self-contained `sqlite3` + Pandas SQL workbench building `cities`/`rainfall` and the complete `airports.db` database, executing all assignment queries).
6. **Lesson 06 (`06-working-with-nosql-data`, `order: 6`, `xp: 65`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["data-science-for-beginners/05-working-with-relational-data"]`
   - **Reference**: `.ref/Data-Science-For-Beginners/2-Working-With-Data/06-non-relational/README.md`, `PersonsData.json`, `TwitterData.json`, `assignment.md`
   - **Content**: When data doesn't fit rigid relational tables; Spreadsheet anatomy (Workbooks, Worksheets, Cells, Row/Column coordinates `B3`, Formulas `=QTY * COST` vs Functions `=SUM(...)` on the `InventoryExample` dataset); The 4 NoSQL Database Categories: Key-Value stores (hash tables & O(1) lookup), Graph databases (Nodes, Edges, Properties for social/financial networks), Columnar data stores (Column Families like `Identity` and `Contact Info` read/updated as a unit), and Document data stores (JSON documents, flexible schemas, partition keys `/id`, system metadata timestamps); Querying `PersonsData.json` (`age < 40`) and `TwitterData.json` (`text LIKE '%Microsoft%'`) using open-source Python JSON document stores (`TinyDB` / `DuckDB` / `sqlite3` JSON1) in place of the Windows-only Cosmos DB Emulator.
   - **Pyodide Sandbox**: Pure-Python Spreadsheet Formula Evaluator (`InventoryExample` & `Soda Profits` calculations) + Document Store Query Engine filtering `PersonsData.json` (`age < 40`) and `TwitterData.json` (`LIKE '%Microsoft%'`).
   - **Colab Notebook**: `06-working-with-nosql-data.ipynb` (Querying `PersonsData.json` and `TwitterData.json` with `TinyDB` and `DuckDB` SQL-on-JSON + Assignment: Soda Profits Spreadsheet & Document Analysis).
7. **Lesson 07 (`07-working-with-python-and-pandas`, `order: 7`, `xp: 75`, `difficulty: "intermediate"`)**:
   - **Prerequisites**: `["data-science-for-beginners/06-working-with-nosql-data"]`
   - **Reference**: `.ref/Data-Science-For-Beginners/2-Working-With-Data/07-python/README.md`, `notebook.ipynb`, `notebook-covidspread.ipynb`, `notebook-papers.ipynb`, `assignment.md`
   - **Content**: Why Python leads data science alongside R and Julia; Core scientific stack (`NumPy` tensors, `Pandas` DataFrames, `Matplotlib`, `SciPy`); Pandas `Series` and index-aligned arithmetic (daily ice-cream sales `pd.date_range`, weekly party packs `freq="W"`, why `s1 + s2` yields `NaN` without `.add(fill_value=0)`, and monthly `.resample("1ME").mean()`); Constructing and transposing `DataFrame`s (`.T.rename()`); Column selection (`df['A']` vs `df[['B','A']]`), boolean mask filtering with `&` and parentheses `df[(df['A']>5) & (df['A']<7)]`, vectorized computable columns (`df['DivA'] = df['A'] - df['A'].mean()`), why `len(df['B'])` broadcasts total length vs row-wise `.apply(len)`, positional slicing `.iloc[:5]`, and pivot-style `.groupby(by='LenB').aggregate(...)`; Challenge 1: Modeling JHU CSSE epidemiological time-series curves ($R_t$ and daily new cases); Challenge 2: Extracting structured medical entities (diagnoses, treatments, medications) from unstructured CORD-19 scientific abstracts using open-source Python NLP and **Google AI Studio Free Tier** (`google-genai` with `GEMINI_API_KEY`, replacing Azure Text Analytics for Health).
   - **Pyodide Sandbox**: Pure-Python index-aligned time-series resampler, DataFrame groupby aggregator, and medical abstract entity/treatment frequency extractor.
   - **Colab Notebook**: `07-working-with-python-and-pandas.ipynb` (Complete Pandas `Series`/`DataFrame` tutorial, JHU epidemiological time-series analysis, and CORD-19 scientific paper analysis with Pandas + optional `google-genai` Gemini structured entity extraction).
8. **Lesson 08 (`08-data-preparation-and-cleaning`, `order: 8`, `xp: 75`, `difficulty: "intermediate"`)**:
   - **Prerequisites**: `["data-science-for-beginners/07-working-with-python-and-pandas"]`
   - **Reference**: `.ref/Data-Science-For-Beginners/2-Working-With-Data/08-data-preparation/README.md`, `notebook.ipynb`, `assignment.md`, `form.csv`
   - **Content**: Why data cleaning determines model accuracy, consistency, and reusability; Common dirty-data challenges (formatting, whitespace, date standards, duplicates, missing values); Inspecting massive DataFrames (`info()`, `head()`, `tail()`) on the classic `Iris` dataset; How Pandas represents missing data: IEEE 754 floating-point `NaN` (and automatic integer-to-float upcasting) vs Python `None` object, and why `0` and `''` (empty string) are *not* null (`isnull()`, `notnull()`); Dropping nulls with `dropna(axis='rows'|'columns', how='any'|'all', thresh=k)`; Imputing nulls with `fillna(value)`, forward-fill (`ffill`), and back-fill (`bfill`) across rows and columns; Detecting and removing duplicate records with `duplicated()` and `drop_duplicates(subset=['letters'])`.
   - **Pyodide Sandbox**: Pure-Python Data Cleaning Pipeline demonstrating `isnull` detection (distinguishing `0` and `''` from `None`/`NaN`), `dropna(thresh=3)`, `ffill`/`bfill` imputation, and `drop_duplicates` on the lesson's exact matrices and `form.csv` survey records.
   - **Colab Notebook**: `08-data-preparation-and-cleaning.ipynb` (Complete Iris inspection, `NaN`/`None` upcasting, `dropna`/`fillna`/`ffill`/`bfill`, deduplication, and Assignment: Evaluating & Cleaning `form.csv`).

### Module 3: Data Visualization (`category: "Module 3: Data Visualization"`)
9. **Lesson 09 (`09-visualizing-quantities`, `order: 9`, `xp: 70`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["data-science-for-beginners/08-data-preparation-and-cleaning"]`
   - **Reference**: `.ref/Data-Science-For-Beginners/3-Data-Visualization/09-visualization-quantities/README.md`, `notebook.ipynb`, `data/birds.csv`, `assignment.md`
   - **Content**: Choosing the right chart for quantitative questions (trends over time → line; comparing values → bar/column/scatter; parts of a whole → pie); Exploring the 443-species **Minnesota Birds (`birds.csv`)** dataset (`Name`, `ScientificName`, `Category`, `Order`, `Family`, `Genus`, `ConservationStatus`, `MinLength`, `MaxLength`, `MinBodyMass`, `MaxBodyMass`, `MinWingspan`, `MaxWingspan`); Spotting data entry errors visually: why a naive line plot reveals a 2,300 cm (23-meter "Pterodactyl"!) wingspan spike; Labeling outliers in-place on a scatter plot (`MaxWingspan > 500` revealing the mislabeled `Bald eagle` at 2300 cm and `Prairie falcon` at 2500 cm) and filtering them out; Building readable horizontal bar charts (`value_counts().plot.barh()`) showing `Ducks/Geese/Waterfowl` dominance in the Land of 10,000 Lakes; Superimposed horizontal bar charts comparing `MinLength` vs `MaxLength` ranges across bird categories.
   - **Pyodide Sandbox**: Pure-Python Minnesota Birds Quantity & Outlier Analyzer that scans `birds.csv` records, detects the `> 500 cm` wingspan outliers (`Bald eagle`, `Prairie falcon`), filters them, and renders an ASCII horizontal bar chart of species counts and superimposed `MinLength`/`MaxLength` ranges by category.
   - **Colab Notebook**: `09-visualizing-quantities.ipynb` (Self-contained Minnesota `birds.csv` dataset + Matplotlib line plots, annotated outlier scatterplots, horizontal category count bar charts, superimposed min/max length charts, and Assignment: Lines, Scatters, and Bars).
10. **Lesson 10 (`10-visualizing-distributions`, `order: 10`, `xp: 75`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["data-science-for-beginners/09-visualizing-quantities"]`
    - **Reference**: `.ref/Data-Science-For-Beginners/3-Data-Visualization/10-visualization-distributions/README.md`, `notebook.ipynb`, `data/birds.csv`, `assignment.md`
    - **Content**: From individual quantities to statistical distributions along an axis; Scatter distribution overview (`MaxLength` per `Order`); Histograms in Matplotlib (`kind='hist'`, tuning granularity from `bins=10` to `bins=30` and filtering skewed tails with `(MaxBodyMass > 1) & (MaxBodyMass < 60)` at `bins=40`); Bivariate 2D Histograms (`ax.hist2d(MaxBodyMass, MaxLength)`); Overlaying categorical distributions using IUCN Red List Conservation Status codes (`EX` Extinct, `CR` Critically Endangered, `EN` Endangered, `NT` Near Threatened, `VU` Vulnerable, `LC` Least Concern) with `alpha=0.5`; Continuous probability density curves with **Seaborn Kernel Density Estimation (`sns.kdeplot`)**: bandwidth smoothing (`bw_adjust=0.2`), multi-order filled density ridges (`hue="Order", fill=True, palette="crest"`), and 2D contour density maps (`x="MinLength", y="MaxLength", hue="ConservationStatus"`).
    - **Pyodide Sandbox**: Pure-Python Histogram Binning & Gaussian Kernel Density Estimator ($\hat{f}_h(x) = \frac{1}{nh}\sum_{i=1}^n K\left(\frac{x - x_i}{h}\right)$) on Minnesota bird body masses and IUCN conservation statuses.
    - **Colab Notebook**: `10-visualizing-distributions.ipynb` (Self-contained `birds.csv` histograms, 2D histograms, IUCN Red List multi-histogram overlays, and Seaborn 1D/2D `kdeplot` charts).
11. **Lesson 11 (`11-visualizing-proportions`, `order: 11`, `xp: 70`, `difficulty: "beginner"`)**:
    - **Prerequisites**: `["data-science-for-beginners/10-visualizing-distributions"]`
    - **Reference**: `.ref/Data-Science-For-Beginners/3-Data-Visualization/11-visualization-proportions/README.md`, `notebook.ipynb`, `data/mushrooms.csv`, `assignment.md`
    - **Content**: Visualizing discrete and grouped percentages on the **Audubon Gilled Mushrooms (`mushrooms.csv`)** dataset (8,124 specimens across 23 species in the Agaricus and Lepiota families with 22 categorical features: `class`, `cap-shape`, `cap-surface`, `cap-color`, `bruises`, `odor`, `habitat`, etc.); Converting `object` columns to `category` dtype and aggregating with `.groupby(['class']).count()`; Building Pie Charts (`plt.pie(..., autopct='%.1f %%')` showing 51.8% Edible vs 48.2% Poisonous) and why label ordering must strictly match the grouped index; Building Donut Charts across the 7 mushroom habitats (`Grasses`, `Leaves`, `Meadows`, `Paths`, `Urban`, `Waste`, `Wood`) by adding a white `plt.Circle((0,0), 0.40, fc='white')` artist (`pctdistance=0.85`); Building 2D grid **Waffle Charts** with `PyWaffle` (`FigureClass=Waffle, rows=100`) to compare 9 mushroom cap colors (`brown`, `buff`, `cinnamon`, `green`, `pink`, `purple`, `red`, `white`, `yellow`); When to choose Pie vs Donut vs Waffle vs Stacked Bar charts.
    - **Pyodide Sandbox**: Pure-Python Mushroom Proportion & 10x10 ASCII Waffle Grid Generator computing exact Edible/Poisonous splits, 7-habitat percentages, and a 100-cell Waffle chart of mushroom cap colors.
    - **Colab Notebook**: `11-visualizing-proportions.ipynb` (Self-contained `mushrooms.csv` dataset + Matplotlib Pie charts, Donut habitat charts, and `pywaffle` cap-color Waffle charts).
12. **Lesson 12 (`12-visualizing-relationships`, `order: 12`, `xp: 75`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["data-science-for-beginners/11-visualizing-proportions"]`
    - **Reference**: `.ref/Data-Science-For-Beginners/3-Data-Visualization/12-visualization-relationships/README.md`, `notebook.ipynb`, `data/honey.csv`, `assignment.md`
    - **Content**: Exploring multivariable correlations and time trends on the **USDA Honey Production (`honey.csv`)** dataset (~600 state-year records from 1998–2012 covering `state`, `numcol`, `yieldpercol`, `totalprod`, `stocks`, `priceperlb`, `prodvalue`, `year` across the 2006 Colony Collapse Disorder crisis); Seaborn `sns.relplot` scatterplots mapping `priceperlb` by `state` with color palettes (`hue="year", palette="YlOrBr"`) and accessible dot-size encoding (`size="year"` for colorblind accessibility); Aggregated Line Charts with 95% confidence intervals (`kind="line"`, investigating the 2003 honey price spike vs total production decline); Small-multiple **Facet Grids** (`col="year", col_wrap=3`) comparing `yieldpercol` vs `numcol` year-over-year; Superimposed **Dual-Axis Line Plots** (`ax2 = ax.twinx()` and `sns.despine()`) revealing that while yield per colony declined, total U.S. bee colony counts began stabilizing after 2008.
    - **Pyodide Sandbox**: Pure-Python USDA Honey Production Analyzer tracking Arizona and national `priceperlb`, `numcol`, and `yieldpercol` trends (1998–2012), computing 95% confidence bands and pre/post-Colony Collapse Disorder correlations.
    - **Colab Notebook**: `12-visualizing-relationships.ipynb` (Self-contained USDA `honey.csv` dataset + Seaborn `relplot` hue/size scatterplots, confidence-interval line plots, 15-panel `FacetGrid`, and `ax.twinx()` dual-axis line plots).
13. **Lesson 13 (`13-meaningful-visualizations`, `order: 13`, `xp: 80`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["data-science-for-beginners/12-visualizing-relationships"]`
    - **Reference**: `.ref/Data-Science-For-Beginners/3-Data-Visualization/13-meaningful-visualizations/README.md`, `starter/src/assets/liaisons.json`, `assignment.md`
    - **Content**: Ronald Coase's dictum (*"If you torture the data long enough, it will confess to anything"*); Master Chart Selection Matrix (Trends, Categories, Totals, Relationships, Distributions, Proportions); Anatomy of Deceptive Visualizations (Alberto Cairo's *How Charts Lie*: reversed chronological X-axes, non-chronological date sorting in Georgia's COVID-19 bar chart, inverted Y-axis + blood-red fill in the Florida gun-deaths chart, distorted 3D/icon scaling in the female height chart, and Tyler Vigen's spurious correlations); Color Theory, Cultural Symbolism, and WCAG Colorblind Accessibility (`viridis`, `cividis`, Okabe-Ito palettes + redundant shape/size encoding); Styling for readability, 3D plotting (`mpl_toolkits.mplot3d`), and scrollytelling/animation principles (Shirley Wu's *Film Flowers* & *Bussed Out*); Hands-on Project: Modeling the social network of Choderlos de Laclos's 1782 epistolary novel ***Les Liaisons Dangereuses*** (`liaisons.json` letter exchanges between the Vicomte de Valmont, Marquise de Merteuil, Cécile Volanges, Madame de Tourvel, and Danceny) by building the node/edge link graph (`sid`, `tid`) and visualizing degree centrality and community structure.
    - **Pyodide Sandbox**: Pure-Python *Les Liaisons Dangereuses* Epistolary Network Graph Builder (`create_links` algorithm mapping characters and letters into `sid`/`tid` edges, computing out-degree, in-degree, and dyadic letter volume between Valmont, Merteuil, and Tourvel, plus an axis-integrity deception auditor).
    - **Colab Notebook**: `13-meaningful-visualizations.ipynb` (Deceptive vs Honest Chart reconstruction in Matplotlib, 3D scatter/surface plots, and interactive *Les Liaisons Dangereuses* social network graph using `NetworkX` and `Plotly`).

### Module 4: Data Science Lifecycle & Cloud Alternatives (`category: "Module 4: Data Science Lifecycle & Cloud Alternatives"`)
14. **Lesson 14 (`14-data-science-lifecycle-introduction`, `order: 14`, `xp: 65`, `difficulty: "beginner"`)**:
    - **Prerequisites**: `["data-science-for-beginners/13-meaningful-visualizations"]`
    - **Reference**: `.ref/Data-Science-For-Beginners/4-Data-Science-Lifecycle/14-Introduction/README.md`, `assignment.md`
    - **Content**: The 5 Stages of the Data Science Lifecycle (Capturing, Processing, Analyzing, Communicating, Maintaining); Stage 1 — Capturing: aligning stakeholder business objectives with data acquisition (6 stakeholder goal questions + 6 data quality/privacy/sufficiency questions); Stage 2 — Processing: pattern discovery and predictive modeling (Classification, Clustering, Regression); Stage 3 — Maintaining: storage architecture trade-offs (On-Premise vs Off-Premise vs Public/Private Cloud; Frequently accessed **Hot Data** vs archival **Cold Data** cost/latency curves), automated data cleansing/aggregation/compression pipelines, and Data Security governance (encryption at rest/in transit, transparency notices, revoking departed team member access, role-based write permissions); Comparing **TDSP (Team Data Science Process)** vs **CRISP-DM (Cross-Industry Standard Process for Data Mining)**.
    - **Pyodide Sandbox**: Pure-Python Lifecycle Storage & Readiness Evaluator comparing Hot vs Cold storage tier costs/latencies and scoring a dataset against the 12 Capturing & Security governance checkpoints.
    - **Colab Notebook**: `14-data-science-lifecycle-introduction.ipynb` (Interactive CRISP-DM vs TDSP lifecycle mapper, hot/cold storage cost optimizer, and Assignment: Assessing a Dataset for Lifecycle Readiness).
15. **Lesson 15 (`15-data-science-lifecycle-analyzing`, `order: 15`, `xp: 75`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["data-science-for-beginners/14-data-science-lifecycle-introduction"]`
    - **Reference**: `.ref/Data-Science-For-Beginners/4-Data-Science-Lifecycle/15-analyzing/README.md`, `notebook.ipynb`, `data/emails.csv`, `assignment.md`
    - **Content**: The Analyzing stage and Exploratory Data Analysis (EDA) as the bridge confirming whether captured data can actually answer stakeholder questions; Data Profiling & Descriptive Statistics (`df.describe()` count, mean, std, min, quantiles) on the **Kaggle Email Spam Classification (`emails.csv`)** word-frequency dataset; Random Sampling (`df.sample(n)`) and why larger sample sizes tighten statistical generalizations; Targeted Querying (`df.query()`) to test specific domain hypotheses; Visual EDA before final cleaning; Diagnosing missing and inconsistent values (`isna()`, `isnull()`) and investigating *why* values went missing (MCAR, MAR, MNAR) before choosing a remediation strategy.
    - **Pyodide Sandbox**: Pure-Python Email Spam EDA Profiler & Query Engine computing word-frequency descriptive statistics, stratified random sampling, targeted boolean queries, and spam-vs-ham discriminative token lift ratios.
    - **Colab Notebook**: `15-data-science-lifecycle-analyzing.ipynb` (Self-contained Email Spam Classification dataset EDA using Pandas `describe()`, `sample()`, `query()`, `isna()`, correlation heatmaps, and Assignment: Exploring for Answers).
16. **Lesson 16 (`16-data-science-lifecycle-communication`, `order: 16`, `xp: 65`, `difficulty: "beginner"`)**:
    - **Prerequisites**: `["data-science-for-beginners/15-data-science-lifecycle-analyzing"]`
    - **Reference**: `.ref/Data-Science-For-Beginners/4-Data-Science-Lifecycle/16-communication/README.md`, `assignment.md`
    - **Content**: Communication (Sender/Communicator → Receiver/Audience) and why data storytelling beats raw number dumps; **One-Way Communication** (conferences, mass reports—requiring deep upfront context and clarity) vs **Two-Way Communication** (stakeholder buy-in meetings—requiring timing and scope control); The 5 Strategies for Data Storytelling:
      1. *Understand Your Audience, Channel & Method*: Jim Stikeleather's 5 HBR Audience Categories (**Novice**, **Generalist**, **Managerial**, **Expert**, **Executive**).
      2. *Begin with the End in Mind*: defining intended takeaways while strictly avoiding **Cherry-Picking** (transparently presenting counter-evidence).
      3. *Approach It Like an Actual Story*: The **5 C's Narrative Arc** (**Context**, **Conflict**, **Climax**, **Closure**, **Conclusion**).
      4. *Use Meaningful Words & Phrases*: replacing vague adjectives (*"a long time"*, *"impressive year"*, *"dramatically"*) with concrete metrics (*"3 minutes average onboarding"*).
      5. *Use Emotion*: pairing quantitative metrics with qualitative user testimonials, imagery, and culturally aware color choices.
      - Complete walkthrough of the **Emerson Mobile App Product Manager Case Study** (42% more complaints on weekends; unanswered complaints after 48 hours are 32% more likely to yield 1–2 star app store ratings; 30-minute leadership pitch comparing the failed time allocation vs the 5 C's time allocation projecting a 2.5 → 4.0 rating lift, 20–30% ASO visibility boost, and 10% revenue increase).
    - **Pyodide Sandbox**: Pure-Python Emerson App Store SLA & 5 C's ROI Simulator modeling weekend complaint queues, 48-hour SLA breaches, star-rating decay, and projected revenue lift from hiring weekend reps + ticket prioritization.
    - **Colab Notebook**: `16-data-science-lifecycle-communication.ipynb` (Executive vs Managerial vs Novice dashboard views, cherry-picking sensitivity audit, Emerson SLA simulation, and Assignment: Market Research Presentation Builder).
17. **Lesson 17 (`17-data-science-in-the-cloud`, `order: 17`, `xp: 75`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["data-science-for-beginners/16-data-science-lifecycle-communication"]`
    - **Reference**: `.ref/Data-Science-For-Beginners/5-Data-Science-In-Cloud/17-Introduction/README.md`, `assignment.md`
    - **Content**: What is Cloud Computing? Deployment topologies (**Public Cloud**, **Private Cloud**, **Hybrid Cloud**) and service layers (**IaaS** — Infrastructure as a Service, **PaaS** — Platform as a Service, **SaaS** — Software as a Service); The 7 core reasons data teams choose the Cloud (Innovation, Flexibility, Budget/Pay-as-you-go, Scalability, Productivity, Reliability/Disaster Recovery, Security); Solving the 5 Data Science Scale Challenges in the Cloud (Large-scale storage, Data integration/ETL pipelines, Distributed processing, Analytics warehouses, Managed ML & AI APIs); Step-by-step guide to configuring **Google Colab Free Tier** and obtaining a free **Google AI Studio API Key** (`GEMINI_API_KEY` stored in Colab Secrets); Hands-on Cloud Scenario 1: Real-time social media hashtag & sentiment stream analytics; Hands-on Cloud Scenario 2: Scientific medical paper knowledge extraction using `google-genai` (`gemini-2.5-flash` structured JSON extraction replacing Azure Text Analytics for Health & Cosmos DB).
    - **Pyodide Sandbox**: Pure-Python Cloud Streaming Window & Medical Abstract Knowledge Extractor (sliding-window hashtag volume + sentiment aggregator and biomedical entity/relation extractor).
    - **Colab Notebook**: `17-data-science-in-the-cloud.ipynb` (Google AI Studio `GEMINI_API_KEY` setup, live social stream sentiment analysis, and scientific paper structured knowledge extraction with `google-genai` + DuckDB analytics).
18. **Lesson 18 (`18-low-code-data-science-and-automl`, `order: 18`, `xp: 80`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["data-science-for-beginners/17-data-science-in-the-cloud"]`
    - **Reference**: `.ref/Data-Science-For-Beginners/5-Data-Science-In-Cloud/18-Low-Code/README.md`, `assignment.md`
    - **Content**: Low-Code/No-Code AutoML vs Programmatic SDK workflows (speed of POC vs production automation); Choosing Cloud Compute Resources: Compute Instances vs Compute Clusters vs Inference Endpoints, **CPU vs GPU** architecture trade-offs (clock speed vs massively parallel cores), Cluster/VM sizing, and **Dedicated vs Low-Priority (Spot/Preemptible)** instances; The Clinical **Heart Failure Prediction Project & Dataset** (299 patients, 12 clinical features: `age`, `anaemia`, `creatinine_phosphokinase`, `diabetes`, `ejection_fraction`, `high_blood_pressure`, `platelets`, `serum_creatinine`, `serum_sodium`, `sex`, `smoking`, `time`, and target `DEATH_EVENT`); How Automated Machine Learning (**AutoML**) searches across algorithms, preprocessing pipelines, and hyperparameters optimizing `AUC_weighted` and generates feature-importance explanations; Low-code AutoML training and interactive web service deployment on Google Colab using open-source **FLAML / PyCaret / Scikit-Learn AutoML Leaderboard** and **Gradio** (replacing Azure ML Studio GUI and ACI containers), plus consuming the deployed scoring function with the two clinical test records (`[True, False]`).
    - **Pyodide Sandbox**: Pure-Python AutoML Model Leaderboard & Clinical Heart Failure Endpoint Scorer that evaluates candidate classifiers (Decision Stump, Logistic Model, Ensemble Voting) by weighted AUC/accuracy on clinical records, computes feature importance (`ejection_fraction`, `serum_creatinine`, `time`, `age`), and scores the exact two-patient JSON payload (`result: [True, False]`).
    - **Colab Notebook**: `18-low-code-data-science-and-automl.ipynb` (Self-contained 299-row Heart Failure Clinical Records dataset, open-source low-code AutoML leaderboard & SHAP/permutation explanations, interactive **Gradio** clinical prediction web app, and REST/JSON endpoint consumption test).
19. **Lesson 19 (`19-cloud-ml-sdk-and-pipelines`, `order: 19`, `xp: 85`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["data-science-for-beginners/18-low-code-data-science-and-automl"]`
    - **Reference**: `.ref/Data-Science-For-Beginners/5-Data-Science-In-Cloud/19-Azure/README.md`, `notebook.ipynb`, `assignment.md`
    - **Content**: Why production data science requires programmatic SDKs and reproducible pipelines over manual GUI clicking; The 5 pillars of programmatic ML lifecycle management (Dataset versioning, Experiment tracking, Automated model search & hyperparameter tuning, Model Registry & serialization, Reproducible Inference Endpoints); Translating the Heart Failure project into a 100% open-source programmatic Python workflow (replacing legacy `azureml.core` `Workspace`, `Experiment`, `AutoMLConfig`, `register_model`, and `AciWebservice`):
      1. *Experiment & Workspace Setup*: Configuring **MLflow** (`mlflow.set_experiment('heart-failure-automl')`) and loading the Heart Failure dataset.
      2. *Declarative Pipelines*: Building a **Scikit-Learn `Pipeline`** and `ColumnTransformer` (`StandardScaler` for numerical features + boolean pass-through).
      3. *Programmatic AutoML Search*: Running multi-model hyperparameter search (`GridSearchCV` / `RandomizedSearchCV` / `FLAML` with `scoring='roc_auc'`, early stopping, and concurrency).
      4. *Model Registry & Scoring Script (`score.py`)*: Logging metrics, parameters, and the best fitted estimator artifact (`best_run`, `fitted_model`), and writing a production JSON scoring handler (`init()` and `run(raw_json)`).
      5. *Endpoint Consumption*: Sending the 60-year-old patient JSON test sample (`age: 60, ejection_fraction: 38, serum_creatinine: 1.40, serum_sodium: 137, time: 130`) and verifying `{"result": [false]}`.
    - **Pyodide Sandbox**: Pure-Python Programmatic ML Pipeline, Experiment Tracker & `score.py` JSON Inference Service that standardizes features, fits regularized logistic weights on Heart Failure training records, logs run metrics (`AUC_weighted`), serializes model metadata, and executes `run(test_sample)` returning `'{"result": [false]}'`.
    - **Colab Notebook**: `19-cloud-ml-sdk-and-pipelines.ipynb` (Programmatic Scikit-Learn `Pipeline`, `GridSearchCV` AutoML search, `MLflow` experiment tracking & model registry, `score.py` JSON endpoint verification, and Challenge: Multi-step ML Pipelines).
20. **Lesson 20 (`20-data-science-in-the-wild`, `order: 20`, `xp: 85`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["data-science-for-beginners/19-cloud-ml-sdk-and-pipelines"]`
    - **Reference**: `.ref/Data-Science-For-Beginners/6-Data-Science-In-Wild/20-Real-World-Examples/README.md`, `assignment.md`
    - **Content**: Synthesizing the 20-lesson journey into real-world impact across 4 domains:
      1. *Data Science + Industry*: Google Flu Trends (and the lesson of overfitting search queries to seasonal winter terms), UPS ORION route optimization, Chris Whong's NYC FOIL Taxicab 24-hour visualization, Uber Data Science Workbench (pricing, fraud, ETA), Sports Analytics (*Moneyball*), Banking (credit scoring & fraud detection), and Healthcare (medical imaging, genomics, drug discovery).
      2. *Data Science + Research*: Innovation prototyping vs deployment harm investigation — deep dive into the **MIT *Gender Shades* Study** by Joy Buolamwini and Timnit Gebru (evaluating intersectional gender/skin-type accuracy across Pilot Parliaments Benchmark subgroups and driving representative dataset curation).
      3. *Data Science + Digital Humanities*: Combining computational methods with literary inquiry — Jen Looper's ***"Emily Dickinson and the Meter of Mood"*** workflow (Data Acquisition from PoetryDB/Project Gutenberg, Data Cleaning, Notebook Analysis in Pandas, and automated seasonal poem sentiment classification using **Google AI Studio Free Tier** `google-genai` replacing cognitive services/Power Automate).
      4. *Data Science + Sustainability*: The UN 2030 Agenda (17 SDGs) and petabyte-scale Earth Systems observation using open **STAC (SpatioTemporal Asset Catalog)** APIs (`pystac-client` querying Sentinel-2 / Landsat / Land Cover collections across space and time); Inspiring student projects (NYC Subway reliability, Sirkap archaeological GIS StoryMaps) and handoff to **Course 03: ML for Beginners** (`/learn/ml-for-beginners`).
    - **Pyodide Sandbox**: Pure-Python Real-World Capstone Suite combining an intersectional *Gender Shades* subgroup error-rate matrix auditor, an Emily Dickinson seasonal poem sentiment analyzer, and a STAC geospatial bounding-box catalog query filter.
    - **Colab Notebook**: `20-data-science-in-the-wild.ipynb` (Emily Dickinson PoetryDB + `google-genai` Gemini API seasonal sentiment analysis, MIT Gender Shades intersectional fairness replication, and Assignment: Exploring Earth Observation STAC Datasets with `pystac-client`).

---

## Verification & Quality Gates

1. **Automated Content & Sandbox Validator (`verify_course_02.py`)**:
   - Validate every `.mdx` frontmatter against `src/content.config.ts` (`track: "data-science-for-beginners"`, `order: 1..20`, `description.length >= 30`, valid `prerequisites` chain).
   - Confirm each `.mdx` has `>= 350` words of prose, `<PythonRunner`, `<QuizCard`, `<ColabButton`, and markdown table headers (`| :---` or `| ---`).
   - Execute every `<PythonRunner />` `initialCode` snippet in Python 3 and verify `stdout.strip() == expectedOutput.strip()` in `< 2.0` seconds.
   - Parse every `.ipynb` file in `notebook/data-science-for-beginners/` as JSON (`nbformat == 4`) and scan both `.mdx` and `.ipynb` files for forbidden terms (`.ref/`, `Azure Machine Learning`, `Cosmos DB`, `Microsoft Foundry`, `Text Analytics for Health`, `learn.microsoft.com`).
2. **Build & Type Verification**:
   - `pnpm astro check` (`0` errors, `0` warnings)
   - `pnpm build` (`0` errors, static HTML generated for `/learn/data-science-for-beginners/` and all 20 lessons)
3. **Accessibility & Design Token Verification**:
   - `uv run --with "buddhi-ai[MCP]" python .agents/skills/design-md/scripts/detect_design_md.py --lint`
   - `buddhi scripts verify-a11y` via `terminal-runner`

---

## Complexity Tracking

No `AGENTS.md` or `DESIGN.md` violations exist. Zero new npm dependencies or architectural layers are introduced.
