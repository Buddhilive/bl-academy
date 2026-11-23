# Implementation Plan: Course 03 — ML for Beginners (`ml-for-beginners`)

**Branch**: `013-create-full-course` | **Date**: 2026-11-22 | **Spec**: [spec.md](file:///C:/DevDojo/Buddhi/bl-academy/.buddhi/specs/013-create-full-course/spec.md)

**Input**: Feature specification from `/.buddhi/specs/013-create-full-course/spec.md`

---

## Summary

Deliver the complete 27-lesson **Course 03: ML for Beginners** (`track: "ml-for-beginners"`) curriculum and 27 companion **Google Colab Free Tier** Jupyter notebooks (`./notebook/ml-for-beginners/<slug>.ipynb`), grounded in `.ref/ML-For-Beginners/ML-For-Beginners-main/`. Every lesson is authored as an Astro Content Collection `.mdx` file under `src/content/lessons/ml-for-beginners/` using the `my-writing-style` skill, includes KaTeX mathematical and algorithmic definitions, structured reference tables, a fast pure-Python `<PythonRunner client:visible />` in-browser sandbox (`math`, `statistics`, `random`, `collections`, `csv`, `json`, `pickle`), a `<ColabButton />` deep-link to its self-contained Scikit-Learn/Pandas/Matplotlib/Seaborn/Statsmodels/Gymnasium Colab notebook, and a `<QuizCard client:visible />` assessment. Proprietary cloud and legacy dependencies (Azure Machine Learning Designer/AutoML, Azure Responsible AI Dashboard, Azure Custom Vision, Lobe.ai, Azure Text Analytics, deprecated `TextBlob.translate()`, and unmaintained OpenAI `gym`) are replaced with open-source frameworks (`Scikit-Learn`, `Pandas`, `NumPy`, `Matplotlib`, `Seaborn`, `imbalanced-learn`/`SMOTE`, `skl2onnx`, `ONNX Runtime`, `Flask`, `FastAPI`, `Gradio`, `TextBlob`, `NLTK VADER`, `statsmodels`, `Gymnasium`, `Fairlearn`, `SHAP`) and **Google AI Studio Free Tier** (`GEMINI_API_KEY` via `google-genai`).

---

## Technical Context

**Language/Version**: TypeScript 5.9.3, Astro 7.4.4, React 19.3.1, MDX (`@astrojs/mdx` 8.1.2), Python 3.11+ (Pyodide v0.26+ in-browser Web Worker & Jupyter `nbformat` v4 notebooks)

**Primary Dependencies**:
- **Frontend / SSG**: `astro`, `@astrojs/mdx`, `@astrojs/react`, `@astrojs/tailwind`, `remark-math`, `rehype-katex`, `katex`, `@uiw/react-codemirror`
- **Colab Notebook Stack (Free Tier)**: `numpy`, `pandas`, `scipy`, `matplotlib`, `seaborn`, `scikit-learn`, `imbalanced-learn`, `skl2onnx`, `onnxruntime`, `flask`, `fastapi`, `gradio`, `textblob`, `nltk`, `statsmodels`, `gymnasium`, `fairlearn`, `shap`, `google-genai`

**Storage**: Static Git-tracked files (`src/content/lessons/ml-for-beginners/*.mdx`, `notebook/ml-for-beginners/*.ipynb`, `src/lib/curriculum.ts`) + browser `localStorage` for Pathfinder XP progress

**Testing & Verification**:
- `pnpm astro check` (Astro content collection Zod schema + TypeScript validation)
- `pnpm build` (Static site generation across all 27 new lesson routes + course hub `/learn/ml-for-beginners`)
- Automated Python verification script (`verify_course_03.py`) checking all 27 `.mdx` files (frontmatter schema, word count >= 350 words, component imports/usages, deterministic execution of `initialCode` matching `expectedOutput`, zero forbidden upstream/Azure/Foundry terms, zero deprecated NumPy/Scikit-Learn/Gym calls) and all 27 `.ipynb` notebooks (valid JSON `nbformat: 4`, self-contained datasets and helpers, zero broken local relative file paths)
- Accessibility & Design Token Gates: `uv run --with "buddhi-ai[MCP]" python .agents/skills/design-md/scripts/detect_design_md.py --lint` and `buddhi scripts verify-a11y`

**Target Platform**: Static Web (SSG) + In-Browser WebAssembly (`Pyodide` Web Worker) + Google Colab Free Tier (CPU) + Google AI Studio Free Tier (`GEMINI_API_KEY`)

**Project Type**: Static Educational Web Application & Interactive Curriculum Platform

**Performance Goals**:
- Zero main-thread blocking on page load (`client:visible` hydration for `PythonRunner` and `QuizCard`)
- Every `<PythonRunner />` `initialCode` executes deterministically in `< 2.0s` (well inside the hard 5-second `pyodide.worker.ts` timeout)
- Zero Cumulative Layout Shift (`CLS = 0`) across lesson pages and `AdSlot` containers

**Constraints**:
- Zero mentions of `.ref/`, `microsoft/ML-For-Beginners`, Microsoft Learn, Azure Machine Learning, Azure Custom Vision, Lobe.ai, Azure Text Analytics, Azure Responsible AI Dashboard, or Microsoft Foundry in lesson prose or notebooks (credits live solely in `ACKNOWLEDGEMENTS.md`)
- Self-contained `.ipynb` notebooks: must embed or deterministically generate/fetch all datasets and helpers (`US-pumpkins.csv`, `ufos.csv`, `cuisines.csv`, `cleaned_cuisines.csv`, `ingredient_indexes.csv`, `nigerian-songs.csv`, `Hotel_Reviews.csv`, `energy.csv`, `common/utils.py`, `rlboard.py`) so they execute out-of-the-box on Google Colab without missing `../data/` or `ModuleNotFoundError` errors
- Strict WCAG 2.2 AA contrast and heading hierarchy (`H1` rendered by `LessonLayout.astro`, so MDX bodies use `H2` → `H3` without skipping levels)

**Scale/Scope**:
- 1 curriculum registry update (`src/lib/curriculum.ts`)
- 27 `.mdx` tutorial lessons (`src/content/lessons/ml-for-beginners/01-*.mdx` through `27-*.mdx`)
- 27 `.ipynb` companion Google Colab notebooks (`notebook/ml-for-beginners/01-*.ipynb` through `27-*.ipynb`)

---

## Multi-Angle Architectural Evaluation & System Design

### 1. Architectural Lenses
- **Fewest-Slices Lens**: Reuse existing, battle-tested layout and interactive components (`LessonLayout.astro`, `LessonSidebar.astro`, `ColabButton.astro`, `PythonRunner.tsx`, `QuizCard.tsx`) with zero new npm dependencies or UI component changes. Updating `src/lib/curriculum.ts` and adding `.mdx` files under `src/content/lessons/ml-for-beginners/` automatically populates `/learn/ml-for-beginners`, the left sidebar, the Pathfinder progress bar, and the cross-course handoff links from Course 02 (`data-science-for-beginners/20-data-science-in-the-wild`) and into Course 04 (`generative-ai-for-beginners`).
- **Risk-First Lens**:
  1. *Pyodide 5s Timeout & Heavy C-Extension Constraints*: Libraries like `imbalanced-learn`, `skl2onnx`, `onnxruntime`, `statsmodels`, `gymnasium`, `fairlearn`, and `shap` cannot be downloaded and compiled inside the 5-second stdout-based Pyodide Web Worker (`src/workers/pyodide.worker.ts`). **Mitigation**: Each lesson's `<PythonRunner />` uses Python's standard library (`math`, `statistics`, `random`, `collections`, `csv`, `json`, `pickle`) to execute the exact algorithmic calculation—Ordinary Least Squares, polynomial feature expansion, logistic sigmoid & ROC-AUC, `pickle` model serialization, SMOTE nearest-neighbor interpolation, OvR softmax probabilities, K-Means Lloyd's iterations & Silhouette/WCSS scores, ELIZA/Marvin NLP parsers, VADER lexicon polarity, SARIMA walk-forward MAPE, or Q-Learning Bellman updates—deterministically in `< 150ms` with exact `expectedOutput`, while full `Scikit-Learn` / `Statsmodels` / `Gymnasium` / `Fairlearn` / `SHAP` / `Gradio` code runs in the linked Colab `.ipynb` notebook.
  2. *Missing Relative CSV Files & Helper Modules in Google Colab*: Reference notebooks in `.ref/ML-For-Beginners` load local relative paths (`../data/US-pumpkins.csv`, `./data/ufos.csv`, `../data/cuisines.csv`, `../data/nigerian-songs.csv`, `../../data/Hotel_Reviews.csv`, `./data/energy.csv`, `from common.utils import load_data`, `from rlboard import *`). **Mitigation**: Every notebook in `./notebook/ml-for-beginners/` includes a self-contained data/module initialization cell that writes or loads the dataset and helper classes inline so `FileNotFoundError` and `ModuleNotFoundError` never occur.
  3. *Deprecated API Calls in Reference Code*: The upstream repo contains `mean_squared_error(..., squared=False)` (removed in recent Scikit-Learn), `OneHotEncoder(sparse=False)` (replaced by `sparse_output=False`), `np.float`/`np.int` (removed in NumPy 1.24+), `TextBlob.translate()` (broken Google Translate web endpoint), and legacy OpenAI `gym` (broken on Python 3.11+ in Colab). **Mitigation**: All lesson code and Colab notebooks standardize on `np.sqrt(mean_squared_error(...))`, `OneHotEncoder(sparse_output=False)`, native `float`/`int`, `google-genai` (`GEMINI_API_KEY`) for translation & sarcasm sentiment, and `gymnasium` (`import gymnasium as gym`).
- **Seam-Quality Lens**: Clean 1-to-1 slug parity (`<slug>.mdx` ↔ `notebook/ml-for-beginners/<slug>.ipynb`) across all 27 lessons (`01` through `27`).

### 2. System Design Trade-Off Analysis (`system-design`)

| Decision Area | Option A (Chosen) | Option B (Rejected) | Trade-off Rationale |
| :--- | :--- | :--- | :--- |
| **In-Browser `<PythonRunner />` Sandbox Design** | Pure-Python standard-library (`math`, `statistics`, `random`, `collections`, `csv`, `json`, `pickle`) algorithmic implementations with deterministic `expectedOutput` | Loading `scikit-learn`/`statsmodels`/`nltk` via `micropip` inside the 5s Web Worker on every page load | Standard library modules run in `< 100ms` inside Pyodide with zero network dependency or 5s timeout risk, while illuminating the exact math behind OLS, Sigmoid, SMOTE, K-Means, VADER, ARIMA, and Q-Learning. |
| **Responsible AI & Model Debugging Replacement (Lessons 03 & 27)** | Open-source **`Fairlearn`** (`MetricFrame`, selection-rate & error disparity) + **`SHAP`** (global/local explanations) + decision-tree cohort error analysis on Google Colab | Proprietary Azure Machine Learning Responsible AI Dashboard | Runs 100% free in any Jupyter/Colab notebook without an Azure subscription while teaching the exact same 4 debugging pillars (Error Analysis, Model Overview, Data Analysis, Feature Importance). |
| **NLP Translation & Nuanced Sentiment Replacement (Lessons 18 & 20)** | Open-source `TextBlob` + `NLTK VADER` paired with **Google AI Studio Free Tier** (`google-genai` with `GEMINI_API_KEY`) | Legacy `TextBlob.translate()` (broken HTTP endpoint) and paid Azure Text Analytics API | Fixes the broken `TextBlob.translate()` call and replaces Azure Text Analytics with Google AI Studio's free tier, letting learners compare lexicon rules against LLM context awareness on Regency irony and sarcastic hotel reviews. |
| **Reinforcement Learning Environment (Lesson 25)** | Open-source **`Gymnasium`** (`import gymnasium as gym`) on Google Colab Free Tier | Legacy unmaintained `gym` (`0.21`/`0.26`) | `gymnasium` installs cleanly on Python 3.11+ in Google Colab with zero `setuptools` build failures and is the active Farama Foundation standard. |

---

## AGENTS.md & DESIGN.md Compliance Check

*GATE: Verified against `AGENTS.md`, `DESIGN.md`, `A11Y-DECISIONS.md`, and `.agents/rules/`.*

- [x] **Project build & test commands adhered to**: Uses `pnpm astro check` and `pnpm build`.
- [x] **9-Course Sequential Learning Path & Grounding**: Course 03 (`ml-for-beginners`) connects directly from `data-science-for-beginners/20-data-science-in-the-wild` (`Course 02`) and hands off to `generative-ai-for-beginners` (`Course 04`). All 27 lessons are grounded in `.ref/ML-For-Beginners/ML-For-Beginners-main/` with zero `.ref/` mentions in lesson prose.
- [x] **Content Generation Contract**: Every `.mdx` file validates against `src/content.config.ts`, uses `my-writing-style`, and includes opening hook, KaTeX math/formulas, `<PythonRunner client:visible />`, `<ColabButton course="ml-for-beginners" />`, reference tables, `<QuizCard client:visible />`, and 350+ words of explanatory prose.
- [x] **Open-Source Colab Free Tier & Google AI Studio Free Tier Stack**: Replaces Azure ML, Azure Custom Vision, Azure RAI Dashboard, and Azure Text Analytics with open-source Python on Colab Free Tier and Google AI Studio Free Tier (`GEMINI_API_KEY` via `google-genai`).
- [x] **Zero-Backend Browser Execution**: Pure client-side Pyodide execution in `/src/workers/pyodide.worker.ts`; zero server-side execution dependencies.
- [x] **Theme, Contrast & Accessibility Strategy (`DESIGN.md` & `A11Y-DECISIONS.md`)**:
  - Reuses accessible `<PythonRunner client:visible />` (Decision 1: Escape key focus-trap release; Decision 3: `aria-live="polite"` output region; Decision 4: reduced-motion confetti guard), `<QuizCard client:visible />` (Decision 2: `role="radiogroup"`, `aria-checked`, polite explanation region), and `<ColabButton />` (Decision 8 & 9: `min-h-[44px]`, forced-colors-safe focus outline, `.sr-only` new-tab announcement, high-contrast runtime metadata).
  - Maintains strict `H2` → `H3` heading hierarchy inside MDX articles (since `LessonLayout.astro` renders `H1`).
  - Uses standard Markdown tables (rendered with semantic `<table>`, `<thead>`, `<th scope="col">`, `<tbody>`) and fences all shell/CLI commands so `$` never collides with KaTeX math delimiters.
  - Preserves fixed-height `AdSlot.astro` containers for zero CLS.

---

## Project Structure

### Documentation (this feature)

```text
.buddhi/specs/013-create-full-course/
├── spec.md              # Feature specification (27 lessons, 5 user stories, requirements)
├── plan.md              # This implementation plan (/spec-plan output)
└── tasks.md             # Actionable task list (/spec-tasks output)
```

### Source Code (repository root)

```text
src/
├── content.config.ts                                    # Zod schema for lessons collection
├── lib/
│   └── curriculum.ts                                    # Update ml-for-beginners: plannedLessonCount: 27, usesGeminiApi: true, runtimeBadges, 5 syllabusModules
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
        └── ml-for-beginners/                            # 27 MDX lessons (order: 1..27)
            ├── 01-introduction-to-machine-learning.mdx
            ├── 02-history-of-machine-learning.mdx
            ├── 03-fairness-and-responsible-ml.mdx
            ├── 04-techniques-of-machine-learning.mdx
            ├── 05-regression-tools-and-scikit-learn.mdx
            ├── 06-preparing-and-visualizing-pumpkin-data.mdx
            ├── 07-linear-and-polynomial-regression.mdx
            ├── 08-logistic-regression-and-roc-curves.mdx
            ├── 09-deploying-ml-models-in-web-apps.mdx
            ├── 10-introduction-to-classification-and-smote.mdx
            ├── 11-multiclass-classification-and-solvers.mdx
            ├── 12-comparing-classifiers-svc-knn-ensembles.mdx
            ├── 13-cuisine-recommender-with-onnx.mdx
            ├── 14-introduction-to-clustering.mdx
            ├── 15-k-means-clustering.mdx
            ├── 16-introduction-to-nlp-and-conversational-bots.mdx
            ├── 17-common-nlp-tasks-and-textblob.mdx
            ├── 18-translation-and-sentiment-analysis.mdx
            ├── 19-exploring-european-hotel-reviews.mdx
            ├── 20-hotel-reviews-vader-sentiment.mdx
            ├── 21-introduction-to-time-series-forecasting.mdx
            ├── 22-time-series-forecasting-with-arima.mdx
            ├── 23-time-series-forecasting-with-svr.mdx
            ├── 24-reinforcement-learning-and-q-learning.mdx
            ├── 25-reinforcement-learning-cartpole-gym.mdx
            ├── 26-real-world-ml-applications.mdx
            └── 27-debugging-ml-models-and-explainability.mdx

notebook/
└── ml-for-beginners/                                    # 27 self-contained Colab notebooks (nbformat v4)
    ├── 01-introduction-to-machine-learning.ipynb
    ├── 02-history-of-machine-learning.ipynb
    ├── 03-fairness-and-responsible-ml.ipynb
    ├── 04-techniques-of-machine-learning.ipynb
    ├── 05-regression-tools-and-scikit-learn.ipynb
    ├── 06-preparing-and-visualizing-pumpkin-data.ipynb
    ├── 07-linear-and-polynomial-regression.ipynb
    ├── 08-logistic-regression-and-roc-curves.ipynb
    ├── 09-deploying-ml-models-in-web-apps.ipynb
    ├── 10-introduction-to-classification-and-smote.ipynb
    ├── 11-multiclass-classification-and-solvers.ipynb
    ├── 12-comparing-classifiers-svc-knn-ensembles.ipynb
    ├── 13-cuisine-recommender-with-onnx.ipynb
    ├── 14-introduction-to-clustering.ipynb
    ├── 15-k-means-clustering.ipynb
    ├── 16-introduction-to-nlp-and-conversational-bots.ipynb
    ├── 17-common-nlp-tasks-and-textblob.ipynb
    ├── 18-translation-and-sentiment-analysis.ipynb
    ├── 19-exploring-european-hotel-reviews.ipynb
    ├── 20-hotel-reviews-vader-sentiment.ipynb
    ├── 21-introduction-to-time-series-forecasting.ipynb
    ├── 22-time-series-forecasting-with-arima.ipynb
    ├── 23-time-series-forecasting-with-svr.ipynb
    ├── 24-reinforcement-learning-and-q-learning.ipynb
    ├── 25-reinforcement-learning-cartpole-gym.ipynb
    ├── 26-real-world-ml-applications.ipynb
    └── 27-debugging-ml-models-and-explainability.ipynb
```

**Structure Decision**: Uses Astro's existing file-based content collection (`src/content/lessons/ml-for-beginners/<slug>.mdx`) and top-level `./notebook/ml-for-beginners/<slug>.ipynb` directory so `ColabButton.astro` resolves `https://colab.research.google.com/github/buddhilive/bl-academy/blob/main/notebook/ml-for-beginners/<slug>.ipynb` without modifying any routing or component code.

---

## Detailed Module & Lesson Implementation Blueprint

### Module 1: ML Foundations, History, Fairness & Techniques (`category: "Module 1: ML Foundations, History, Fairness & Techniques"`)
1. **Lesson 01 (`01-introduction-to-machine-learning`, `order: 1`, `xp: 50`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["data-science-for-beginners/20-data-science-in-the-wild"]`
   - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/1-Introduction/1-intro-to-ML/README.md`, `assignment.md`
   - **Content**: What is Machine Learning (automated pattern discovery vs hardcoded rules engines); Brain plasticity & human perception analogy; Terminology & Venn hierarchy: **Artificial Intelligence (AI)** vs **Machine Learning (ML)** vs **Deep Learning (DL)** vs **Data Science (DS)**; What Classical ML covers (Regression, Classification, Clustering, Classical NLP, Time Series, Reinforcement Learning with Scikit-Learn) vs what belongs to Deep Learning; Why data quality determines model performance ($f_{\theta}(X) \approx y$); Real-world applied ML domains; Setting up **Google Colab Free Tier** and Scikit-Learn.
   - **Pyodide Sandbox**: Pure-Python Rules-Engine vs Data-Driven Pattern Learner comparator demonstrating how a learned threshold/weight classifier adapts to noisy clinical/weather observations where brittle `if/else` rules fail.
   - **Colab Notebook**: `01-introduction-to-machine-learning.ipynb` (Colab environment setup, Scikit-Learn estimator API tour (`fit`, `predict`, `score`), AI/ML/DL/DS taxonomy visualization, and Assignment: Get Up and Running).
2. **Lesson 02 (`02-history-of-machine-learning`, `order: 2`, `xp: 55`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["ml-for-beginners/01-introduction-to-machine-learning"]`
   - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/1-Introduction/2-history-of-ML/README.md`, `assignment.md`
   - **Content**: Mathematical foundations predating modern computers: **Bayes' Theorem** (1763/1812, $P(A|B) = \frac{P(B|A)P(A)}{P(B)}$), Adrien-Marie Legendre's **Least Squares** (1805), Andrey Markov's **Markov Chains** (1913), Frank Rosenblatt's **Perceptron** (1957), **Nearest Neighbor** (1967), **Backpropagation** (1970), and **Recurrent Neural Networks** (1982); Alan Turing's 1950 *"Computing Machinery and Intelligence"* & Turing Test; The 1956 **Dartmouth Summer Research Project** (John McCarthy & Marvin Minsky); The Golden Years (1956–1974): **Shakey the Robot**, Joseph Weizenbaum's **ELIZA**, and Terry Winograd's **SHRDLU** blocks micro-world; The **1974–1980 AI Winter** (compute limits, combinatorial explosion, paucity of data, John Searle's Chinese Room argument, and **"Neats vs. Scruffies"**); 1980s **Expert Systems** (hybrid rules + inference engines); The **1987–1993 AI Chill** (specialized Lisp hardware collapse vs personal computer revolution); 1993–2011 Smartphone & Big Data explosion to the modern era.
   - **Pyodide Sandbox**: Pure-Python Historical Algorithms Time Capsule executing three landmark equations side-by-side: 1763 Bayes posterior update, 1805 Legendre Ordinary Least Squares line fit, and 1913 Markov Chain state transition probabilities.
   - **Colab Notebook**: `02-history-of-machine-learning.ipynb` (Interactive mathematical timeline simulating Bayes, Least Squares, Markov Chains, 1957 Perceptron, and 1967 Nearest Neighbor + Assignment: Create an Annotated Historical Timeline).
3. **Lesson 03 (`03-fairness-and-responsible-ml`, `order: 3`, `xp: 65`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["ml-for-beginners/02-history-of-machine-learning"]`
   - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/1-Introduction/3-fairness/README.md`, `assignment.md`
   - **Content**: Why sociotechnical fairness matters in healthcare, lending, and hiring; The **5 Fairness-Related Harms**: **Allocation** (favoring one demographic in loans/hiring), **Quality of Service** (e.g., infrared soap dispensers failing on dark skin), **Denigration** (offensive mislabeling), **Over- or Under-representation** (skewed occupational training data), and **Stereotyping** (gender-neutral Turkish `O bir hemşire / O bir doktor` round-trip translating into gendered English `"She is a nurse / He is a doctor"`); The **6 Core Responsible AI Principles** (Fairness, Reliability & Safety under outliers, Inclusiveness for 1B+ people with disabilities, Privacy & Security / GDPR, Glass-Box Transparency, Accountability in high-stakes facial recognition); Conducting a pre-training **Impact Assessment** (Adverse impact, Data requirements, Summary of impact, Principle goals); Introduction to model debugging with open-source **`Fairlearn`** (Error analysis, Model overview disparity, Data analysis, Interpretability).
   - **Pyodide Sandbox**: Pure-Python Fairness Harm & Cohort Disparity Auditor computing Selection Rate ($\text{SR}_g$), Demographic Parity Difference ($\Delta \text{DP}$), Equalized Odds (TPR/FPR disparity), and Quality-of-Service accuracy gaps across demographic subgroups.
   - **Colab Notebook**: `03-fairness-and-responsible-ml.ipynb` (Auditing a credit/hiring classifier with open-source `fairlearn.metrics.MetricFrame`, mitigating allocation harm, and Assignment: Responsible ML Impact Assessment).
4. **Lesson 04 (`04-techniques-of-machine-learning`, `order: 4`, `xp: 65`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["ml-for-beginners/03-fairness-and-responsible-ml"]`
   - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/1-Introduction/4-techniques-of-ML/README.md`, `assignment.md`
   - **Content**: The 7-Step ML Engineering Workflow (1. Decide on the question, 2. Collect & prepare data, 3. Choose a training method, 4. Train the model, 5. Evaluate the model, 6. Parameter tuning, 7. Predict); Pre-building tasks: **Features ($X$)** vs **Target ($y$)**; **Feature Selection** (choosing a subset of existing columns) vs **Feature Extraction** (creating new derived representations from raw inputs); Visualizing data to spot correlations and imbalance; **Splitting the Dataset**: Training set (majority used for `model.fit(X, y)`), Validation set (for tuning hyperparameters), and Testing set (held-out unseen data for final evaluation); **Model Fitting**: diagnosing **Underfitting** (high bias—fails on both train and test) vs **Overfitting** (high variance—memorizes training noise and fails on unseen test data); Hyperparameter tuning and production inference.
   - **Pyodide Sandbox**: Pure-Python 7-Step ML Workflow Simulator demonstrating feature extraction, 70/15/15 train/val/test splitting, and comparing Underfit (Degree 1), Balanced (Degree 2), and Overfit (Degree 8) polynomial models across training vs testing RMSE.
   - **Colab Notebook**: `04-techniques-of-machine-learning.ipynb` (Visualizing underfitting vs overfitting curves in Scikit-Learn, train/validation/test split mechanics, hyperparameter grid search, and Assignment: ML Practitioner Workflow Design).

### Module 2: Regression Models & Web App Deployment (`category: "Module 2: Regression Models & Web App Deployment"`)
5. **Lesson 05 (`05-regression-tools-and-scikit-learn`, `order: 5`, `xp: 70`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["ml-for-beginners/04-techniques-of-machine-learning"]`
   - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/2-Regression/1-Tools/README.md`, `notebook.ipynb`, `solution/notebook.ipynb`, `assignment.md`
   - **Content**: Linear vs Logistic Regression (predicting continuous numeric targets vs categorical assignments); The Python ML Authoring Environment (Jupyter `.ipynb` notebooks, virtual environments, Google Colab, `numpy`, `matplotlib`, `scikit-learn`); Exploring Scikit-Learn's built-in **Diabetes Dataset** (`datasets.load_diabetes(return_X_y=True)` — 442 patient samples, 10 normalized baseline features: `age`, `sex`, `bmi`, `bp`, and 6 blood serum measurements `s1`–`s6` predicting quantitative disease progression 1 year after baseline, plus ethical reflection on binary `sex` encoding in clinical trials); Slicing the 3rd feature column (`bmi` at index `2`) and reshaping to a 2D matrix `X.reshape((-1, 1))`; Splitting with `train_test_split(X, y, test_size=0.33)`; Fitting `linear_model.LinearRegression()`, predicting `y_pred = model.predict(X_test)`, and plotting the black scatter points against the blue regression line.
   - **Pyodide Sandbox**: Pure-Python Diabetes BMI Linear Regression Engine executing the exact 2D reshape, 67/33 train-test split, Ordinary Least Squares slope/intercept fit (`model.fit`), and test predictions on clinical BMI vs disease progression samples.
   - **Colab Notebook**: `05-regression-tools-and-scikit-learn.ipynb` (Complete Scikit-Learn `load_diabetes()` regression walkthrough, `bmi` scatter/line plot, challenge comparing `bp` and `s5` features, and Assignment: Linnerud Dataset Multi-Output Regression).
6. **Lesson 06 (`06-preparing-and-visualizing-pumpkin-data`, `order: 6`, `xp: 75`, `difficulty: "intermediate"`)**:
   - **Prerequisites**: `["ml-for-beginners/05-regression-tools-and-scikit-learn"]`
   - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/2-Regression/2-Data/README.md`, `notebook.ipynb`, `data/US-pumpkins.csv`, `assignment.md`
   - **Content**: Asking the right question of messy real-world data; Case Study: The 1,757-row USDA **North American Pumpkin Market (`US-pumpkins.csv`)** dataset; Checking missing values (`pumpkins.isnull().sum()`) and selecting target columns with `.loc[:, ['Package', 'Low Price', 'High Price', 'Date']]`; Computing average price $\text{Price} = \frac{\text{Low Price} + \text{High Price}}{2}$ and extracting `Month = pd.DatetimeIndex(pumpkins['Date']).month`; Solving the inconsistent package weight problem: filtering to ~415 rows sold by the bushel (`pumpkins['Package'].str.contains('bushel', case=True, regex=True)`) and normalizing `1 1/9 bushel` prices ($\text{Price} / (1 + 1/9)$) and `1/2 bushel` prices ($\text{Price} / (1/2)$), plus why half-bushel miniature pumpkins cost more per bushel; Visualizing with **Matplotlib** (why raw `plt.scatter(price, month)` is uninformative vs grouped `new_pumpkins.groupby(['Month'])['Price'].mean().plot(kind='bar')` showing the September–October harvest peak); Visualizing with **Seaborn** (`sns.relplot` scatter and `kind="line"` with 95% confidence band, `sns.catplot(x="Month", y="Price", kind="bar")`, and `sns.heatmap(correlations, annot=True, cmap="coolwarm")` demonstrating why Pearson correlation misses non-linear seasonal peaks).
   - **Pyodide Sandbox**: Pure-Python USDA Pumpkin Bushel Normalizer & Seasonal Aggregator that filters raw `US-pumpkins.csv` records for `'bushel'`, normalizes `1 1/9` and `1/2` bushel prices, computes the monthly mean price bar chart (August–December), and outputs the $4 \times 4$ Pearson correlation matrix (`Month`, `Low Price`, `High Price`, `Price`).
   - **Colab Notebook**: `06-preparing-and-visualizing-pumpkin-data.ipynb` (Self-contained 1,757-row `US-pumpkins.csv` dataset + Pandas bushel normalization, Matplotlib scatter/bar plots, and Seaborn `relplot`, `catplot`, and correlation `heatmap`).
7. **Lesson 07 (`07-linear-and-polynomial-regression`, `order: 7`, `xp: 85`, `difficulty: "intermediate"`)**:
   - **Prerequisites**: `["ml-for-beginners/06-preparing-and-visualizing-pumpkin-data"]`
   - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/2-Regression/3-Linear/README.md`, `notebook.ipynb`, `solution/notebook.ipynb`, `assignment.md`
   - **Content**: Mathematical foundations of **Least-Squares Linear Regression**:
     $$Y = a + bX, \quad b = \frac{N\sum XY - (\sum X)(\sum Y)}{N\sum X^2 - (\sum X)^2}, \quad a = \frac{\sum Y - b\sum X}{N}$$
     Why we square vertical residuals (Magnitude over Direction + Penalizing Outliers); Engineering `DayOfYear` (`(dt - datetime(dt.year, 1, 1)).days`) and inspecting weak aggregate correlations ($-0.15$ by `Month`, $-0.17$ by `DayOfYear`); Color-coding scatter plots by `Variety` (`PIE TYPE`, `MINIATURE`, `FAIRYTALE`, `MIXED HEIRLOOM VARIETIES`) and isolating `PIE TYPE` pumpkins ($r \approx -0.27$); **Regression Four Ways (+ Combined Pipeline)**:
     1. *Simple Linear Regression (`DayOfYear` on `PIE TYPE`)*: `lin_reg.coef_` ($\approx -0.017$, ~2 cents/day drop), `lin_reg.intercept_` ($\approx 21$), $\text{RMSE} = \sqrt{\frac{1}{n}\sum (y_i - \hat{y}_i)^2} = 2.77$ ($17.2\%$), and Coefficient of Determination $R^2 = 0.07$.
     2. *Polynomial Regression (`DayOfYear` Degree 2)*: `make_pipeline(PolynomialFeatures(2), LinearRegression())`, plotting smooth curves with `np.linspace`, $\text{RMSE} = 2.73$ ($17.0\%$), $R^2 = 0.08$.
     3. *Categorical Features & One-Hot Encoding (`Variety`)*: Why numeric index encoding fails for linear regression vs **One-Hot Encoding** (`pd.get_dummies(new_pumpkins['Variety'])`), jumping determination to $R^2 = 0.77$ ($\text{RMSE} = 5.24$).
     4. *All Features Linear Regression (`Variety + Month + City + Package`)*: Joining one-hot encoded categoricals with `Month`, achieving $\text{RMSE} = 2.84$ ($10.5\%$) and $R^2 = 0.94$.
     5. *All Features Degree-2 Polynomial Pipeline*: Combining all one-hot features with `PolynomialFeatures(2)`, achieving $\text{RMSE} = 2.23$ ($8.25\%$) and **$R^2 = 0.97$**.
   - **Pyodide Sandbox**: Pure-Python 5-Model Pumpkin Regression Benchmark executing Simple Linear (`DayOfYear`), Degree-2 Polynomial (`DayOfYear`), One-Hot `Variety` Linear, All-Features Linear, and All-Features Polynomial Regression and printing the exact 5-row RMSE & $R^2$ determination comparison table.
   - **Colab Notebook**: `07-linear-and-polynomial-regression.ipynb` (Self-contained `US-pumpkins.csv` cleaned dataframe, variety-colored scatterplots, all 5 Scikit-Learn linear/polynomial/one-hot pipelines, and Assignment: Ridge, Lasso & ElasticNet Comparison).
8. **Lesson 08 (`08-logistic-regression-and-roc-curves`, `order: 8`, `xp: 85`, `difficulty: "intermediate"`)**:
   - **Prerequisites**: `["ml-for-beginners/07-linear-and-polynomial-regression"]`
   - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/2-Regression/4-Logistic/README.md`, `notebook.ipynb`, `solution/notebook.ipynb`, `assignment.md`
   - **Content**: Why Logistic Regression is actually a linear classification algorithm; Binary vs Multinomial vs Ordinal logistic regression; Predicting `Color` (`ORANGE` vs `WHITE` "Ghost" pumpkins) from `['City Name', 'Package', 'Variety', 'Origin', 'Item Size']`; Visualizing category distributions with Seaborn `catplot(y="Variety", hue="Color", kind="count")`; Feature & Label Encoding pipeline:
     - **`OrdinalEncoder`** on `Item Size` (`[['sml', 'med', 'med-lge', 'lge', 'xlge', 'jbo', 'exjbo']]` $\rightarrow 0..6$).
     - **`OneHotEncoder(sparse_output=False)`** on nominal columns (`City Name`, `Package`, `Variety`, `Origin`).
     - Combining encoders with **`ColumnTransformer(..., set_output(transform='pandas'))`** and encoding target `Color` with **`LabelEncoder`** ($0 = \text{ORANGE}, 1 = \text{WHITE}$).
     - Visualizing encoded relationships with horizontal `kind="box"` `catplot` and `sns.swarmplot(x="Color", y="ord__Item Size")`.
     - Mathematical foundation: Maximum Likelihood & the **Logistic Sigmoid Function**:
       $$\sigma(z) = \frac{L}{1 + e^{-k(z - z_0)}} = \frac{1}{1 + e^{-z}}$$
     - Training `LogisticRegression()`, interpreting the **$2 \times 2$ Confusion Matrix** ($\text{TN}=162, \text{FP}=4, \text{FN}=11, \text{TP}=22$), deriving **Precision** ($\frac{\text{TP}}{\text{TP}+\text{FP}} = \frac{22}{26} = 0.846$), **Recall** ($\frac{\text{TP}}{\text{TP}+\text{FN}} = \frac{22}{33} = 0.667$), **$F_1$-Score** ($\frac{2 \cdot P \cdot R}{P + R} = 0.746$), **Support**, **Accuracy** ($0.92$), **Macro Avg**, and **Weighted Avg**; Plotting the **ROC Curve** (True Positive Rate vs False Positive Rate across decision thresholds) and computing **`roc_auc_score`** ($\text{AUC} = 0.975$).
   - **Pyodide Sandbox**: Pure-Python Sigmoid Classifier, Confusion Matrix & ROC-AUC Evaluator that encodes ordinal `Item Size` and one-hot pumpkin features, computes logistic probabilities $\sigma(w^T x + b)$, outputs the exact confusion matrix ($\text{TN}=162, \text{FP}=4, \text{FN}=11, \text{TP}=22$), Precision, Recall, $F_1$-score, and trapezoidal ROC-AUC ($0.975$).
   - **Colab Notebook**: `08-logistic-regression-and-roc-curves.ipynb` (Self-contained full pumpkin dataset, `OrdinalEncoder` + `OneHotEncoder` `ColumnTransformer`, Seaborn box/swarm plots, `LogisticRegression`, confusion matrix, and ROC curve plot).
9. **Lesson 09 (`09-deploying-ml-models-in-web-apps`, `order: 9`, `xp: 80`, `difficulty: "intermediate"`)**:
   - **Prerequisites**: `["ml-for-beginners/08-logistic-regression-and-roc-curves"]`
   - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/3-Web-App/1-Web-App/README.md`, `notebook.ipynb`, `data/ufos.csv`, `web-app/`, `assignment.md`
   - **Content**: Architectural considerations for serving ML models in production (Web vs Mobile/IoT with TensorFlow Lite, Cloud vs Local/Offline inference, Python `pickle`/Flask/FastAPI/Gradio vs browser `ONNX Runtime Web`); Cleaning the 80,000-row **NUFORC UFO Sightings (`ufos.csv`)** dataset: extracting `Seconds` (`duration (seconds)`), `Country`, `Latitude`, `Longitude`, dropping nulls, filtering `1 <= Seconds <= 60`, and encoding alphabetical country codes with `LabelEncoder` (`0: Australia, 1: Canada, 2: Germany, 3: UK, 4: US`); Training `LogisticRegression` on `['Seconds', 'Latitude', 'Longitude']` ($\sim 95\%$ accuracy); **Serializing ("Pickling") the Model** with Python's `pickle.dump(model, open('ufo-model.pkl', 'wb'))` and security precautions against untrusted `.pkl` files; Testing `model.predict([[50, 44, -12]])` $\rightarrow$ `3` (`'UK'`); Building the full-stack **Flask Web App** (`app.py` with `@app.route("/")` and `@app.route("/predict", methods=["POST"])`, Jinja2 `templates/index.html` mustache `{{ prediction_text }}`, and `static/css/styles.css`); Modern Cloud/Colab Deployment: serving the exact same pickled UFO model interactively via **Gradio** and **FastAPI** inside Google Colab.
   - **Pyodide Sandbox**: Pure-Python UFO Model Trainer, `pickle` Serializer & Web Endpoint Simulator that trains the multi-class UFO location classifier, serializes and reloads the model bytes in-memory using Python's built-in `pickle` module (`pickle.dumps` / `pickle.loads`), and processes `/predict` form payloads (`[50, 44, -12]` $\rightarrow$ `'Likely country: UK'`).
   - **Colab Notebook**: `09-deploying-ml-models-in-web-apps.ipynb` (Self-contained NUFORC `ufos.csv` dataset, `LogisticRegression` training, `pickle` serialization to `ufo-model.pkl`, Flask `app.py` generator, and live interactive **Gradio** UFO predictor UI).

### Module 3: Classification & Unsupervised Clustering (`category: "Module 3: Classification & Unsupervised Clustering"`)
10. **Lesson 10 (`10-introduction-to-classification-and-smote`, `order: 10`, `xp: 75`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ml-for-beginners/09-deploying-ml-models-in-web-apps"]`
    - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/4-Classification/1-Introduction/README.md`, `notebook.ipynb`, `data/cuisines.csv`, `assignment.md`
    - **Content**: Binary vs Multiclass Classification; Regional Case Study: **Delicious Asian and Indian Cuisines (`cuisines.csv`)** (2,448 recipes across 385 columns—`cuisine` label + 383 binary ingredient indicators from `almond` to `zucchini`); Inspecting severe class imbalance (`thai`: 289, `japanese`: 320, `chinese`: 442, `indian`: 598, `korean`: 799); Writing `create_ingredient_df(df)` (`df.T.drop(['cuisine', 'Unnamed: 0']).sum(axis=1).to_frame('value')`) to plot the top 10 signature ingredients for Thai, Japanese, Chinese, Indian, and Korean cuisines; Feature hygiene: dropping ubiquitous cross-cuisine confounders (`rice`, `garlic`, `ginger`) that blur class boundaries; **Balancing the Dataset with SMOTE (`Synthetic Minority Over-sampling Technique`)**: how `SMOTE().fit_resample(feature_df, labels_df)` interpolates synthetic minority examples in feature space ($x_{\text{new}} = x_i + \lambda (x_{zi} - x_i)$) so all 5 cuisines have exactly 799 rows (3,995 balanced rows total across 380 ingredients), exporting `cleaned_cuisines.csv`.
    - **Pyodide Sandbox**: Pure-Python Cuisine Ingredient Profiler & SMOTE Synthetic Oversampler that computes top signature ingredients per cuisine, drops `rice`/`garlic`/`ginger`, and runs $k$-nearest-neighbor synthetic interpolation to balance all 5 cuisines to equal class counts.
    - **Colab Notebook**: `10-introduction-to-classification-and-smote.ipynb` (Self-contained `cuisines.csv` dataset, top-10 ingredient horizontal bar charts for all 5 cuisines, `imblearn.over_sampling.SMOTE` balancing to 799 per class, and saving `cleaned_cuisines.csv`).
11. **Lesson 11 (`11-multiclass-classification-and-solvers`, `order: 11`, `xp: 80`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ml-for-beginners/10-introduction-to-classification-and-smote"]`
    - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/4-Classification/2-Classifiers-1/README.md`, `notebook.ipynb`, `solution/notebook.ipynb`, `assignment.md`
    - **Content**: Navigating Scikit-Learn's Supervised Learning classification families (Linear Models, SVM, SGD, Nearest Neighbors, Gaussian Processes, Decision Trees, Ensembles, Multiclass/Multioutput); Reasoning through algorithm constraints (why neural nets are overkill for small tabular data, why binary-only classifiers fail without a multiclass wrapper, why boosted ranking trees solve a different task); Multiclass Logistic Regression schemes: **One-vs-Rest (`ovr`)** ($K$ separate binary classifiers) vs **Multinomial Cross-Entropy (`multinomial`)** ($\text{Softmax}(z_k) = \frac{e^{z_k}}{\sum_{j=1}^K e^{z_j}}$); Comprehensive **Scikit-Learn Solvers Reference Table** comparing `liblinear` (coordinate descent, L1/L2, OvR only), `lbfgs` (quasi-Newton L2, multinomial support), `newton-cg`, `sag`, and `saga` (L1/L2/ElasticNet, large datasets); Training `LogisticRegression(multi_class='ovr', solver='liblinear')` on `cleaned_cuisines.csv` (>80% test accuracy); Inspecting single-recipe inference (`X_test.iloc[50]` with `cilantro, onion, pea, potato, tomato, vegetable_oil` $\rightarrow$ `predict_proba` ranking `indian: 0.716`, `chinese: 0.229`, `japanese: 0.030`, `korean: 0.017`, `thai: 0.008`) and full 5-class `classification_report`.
    - **Pyodide Sandbox**: Pure-Python Multiclass OvR vs Multinomial Logistic Solver & Recipe Probability Engine that scores ingredient vectors (including `['cilantro', 'onion', 'pea', 'potato', 'tomato', 'vegetable_oil']`), prints the ranked 5-cuisine probability table, and compares `liblinear` (OvR) vs `lbfgs` (Multinomial) accuracy.
    - **Colab Notebook**: `11-multiclass-classification-and-solvers.ipynb` (Self-contained `cleaned_cuisines.csv`, training and comparing `liblinear`, `lbfgs`, `newton-cg`, and `saga` solvers, inspecting recipe probabilities, and Assignment: Solver Benchmark Study).
12. **Lesson 12 (`12-comparing-classifiers-svc-knn-ensembles`, `order: 12`, `xp: 85`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ml-for-beginners/11-multiclass-classification-and-solvers"]`
    - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/4-Classification/3-Classifiers-2/README.md`, `notebook.ipynb`, `solution/notebook.ipynb`, `assignment.md`
    - **Content**: Walking the **Scikit-Learn Machine Learning Estimator Map** (`>50 samples` $\rightarrow$ `predicting a category` $\rightarrow$ `labeled data` $\rightarrow$ `<100K samples` $\rightarrow$ `Linear SVC` $\rightarrow$ `KNeighborsClassifier` $\rightarrow$ `SVC` & `Ensemble Classifiers`); Mathematical intuition and hyperparameter anatomy of 5 classifier families:
      1. **Linear Support Vector Classifier (`SVC(kernel='linear', C=10, probability=True)`)**: Maximum-margin separating hyperplane and regularization parameter $C$ ($78.6\%$ accuracy).
      2. **K-Nearest Neighbors (`KNeighborsClassifier(n_neighbors=10)`)**: Distance-based majority voting among $k$ neighbors ($73.8\%$ accuracy).
      3. **RBF Support Vector Classifier (`SVC()`)**: Non-linear kernel mapping points into higher-dimensional space ($83.2\%$ accuracy).
      4. **Random Forest (`RandomForestClassifier(n_estimators=100)`)**: Bagging ensemble averaging 100 randomized decision trees to prevent overfitting (**$84.5\%$ accuracy**).
      5. **AdaBoost (`AdaBoostClassifier(n_estimators=100)`)**: Adaptive boosting sequentially re-weighting misclassified samples ($72.4\%$ accuracy).
   - **Pyodide Sandbox**: Pure-Python Multi-Classifier Benchmark Harness evaluating Linear SVC, K-Nearest Neighbors, Kernel SVC, Random Forest, and AdaBoost on cuisine test folds and outputting the comparative accuracy, precision, recall, and macro-$F_1$ leaderboard.
   - **Colab Notebook**: `12-comparing-classifiers-svc-knn-ensembles.ipynb` (Self-contained `cleaned_cuisines.csv`, automated loop benchmarking `Linear SVC`, `KNN`, `SVC`, `RandomForestClassifier`, and `AdaBoostClassifier`, and Assignment: Hyperparameter Play).
13. **Lesson 13 (`13-cuisine-recommender-with-onnx`, `order: 13`, `xp: 85`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ml-for-beginners/12-comparing-classifiers-svc-knn-ensembles"]`
    - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/4-Classification/4-Applied/README.md`, `notebook.ipynb`, `data/ingredient_indexes.csv`, `assignment.md`
    - **Content**: Why cross-platform model interoperability matters (training in Python Scikit-Learn, running offline client-side inference in browser JavaScript or edge runtimes via **ONNX — Open Neural Network Exchange**); Training `SVC(kernel='linear', C=10, probability=True, random_state=0)` on the 380-ingredient matrix `X = data.iloc[:, 2:]`; Converting Scikit-Learn to ONNX with **`skl2onnx`**:
      - Specifying tensor input signature `initial_type = [('float_input', FloatTensorType([None, 380]))]`.
      - Setting conversion options `options = {id(model): {'nocl': True, 'zipmap': False}}` (stripping bulky ZipMap dictionary lists and class metadata to shrink `.onnx` binary size).
      - Serializing `onx.SerializeToString()` to `model.onnx` and inspecting the 380-input computation graph in **Netron**.
      - Building the Client-Side **JavaScript `onnxruntime-web` Refrigerator Recommender** (`index.html`, mapping ingredient checkboxes `apple=4`, `pear=247`, `cherry=77`, `fenugreek=126`, `sake=302`, `soy_sauce=327`, `cumin=112` into a `Float32Array(380)` tensor `[1, 380]` and running `session.run({ float_input: input })`).
      - Running and testing the exported `model.onnx` directly in Google Colab with `onnxruntime.InferenceSession` and an interactive **Gradio** refrigerator matcher.
   - **Pyodide Sandbox**: Pure-Python 380-Tensor ONNX Inference Simulator mapping refrigerator ingredient indices (`4: apple`, `77: cherry`, `112: cumin`, `126: fenugreek`, `247: pear`, `302: sake`, `327: soy_sauce`) into a `[1, 380]` float32 tensor and executing linear SVC margin inference across distinct ingredient combinations.
   - **Colab Notebook**: `13-cuisine-recommender-with-onnx.ipynb` (Training the 380-feature SVC, exporting `model.onnx` with `skl2onnx`, verifying inference with `onnxruntime`, generating the standalone `onnxruntime-web` `index.html`, and launching an interactive Gradio cuisine recommender).
14. **Lesson 14 (`14-introduction-to-clustering`, `order: 14`, `xp: 75`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ml-for-beginners/13-cuisine-recommender-with-onnx"]`
    - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/5-Clustering/1-Visualize/README.md`, `notebook.ipynb`, `data/nigerian-songs.csv`, `assignment.md`
    - **Content**: Unsupervised Learning & Clustering (discovering structure in unlabeled data, market segmentation, credit card fraud anomaly detection, medical imaging, and privacy-preserving cluster IDs); Complete **10-Algorithm Scikit-Learn Clustering Reference Table** (`K-Means`, `Affinity propagation`, `Mean-shift`, `Spectral clustering`, `Ward hierarchical`, `Agglomerative`, `DBSCAN`, `OPTICS`, `Gaussian mixtures`, `BIRCH`); Core Clustering Vocabulary & Geometry:
      - **Transductive vs. Inductive Inference** (grouping observed test cases directly vs learning general rules applied to unseen points).
      - **Flat (Euclidean) vs. Non-Flat (Non-Euclidean / Riemannian) Geometry** and **Centroids** (mean coordinates) vs. **Clustroids** (closest existing data point).
      - **Constrained Clustering** (`must-link` and `cannot-link` semi-supervised constraints) and **Density** (DBSCAN/HDBSCAN vs K-Means on uneven noise).
      - The 5 Major Clustering Families (Hierarchical, Centroid, Distribution-based, Density-based, Grid-based).
      - Regional Case Study: **Exploring Nigerian Musical Tastes (`nigerian-songs.csv`)** (530 Spotify tracks across 16 columns: `name`, `album`, `artist`, `artist_top_genre`, `release_date`, `length`, `popularity`, `danceability`, `acousticness`, `energy`, `instrumentalness`, `liveness`, `loudness`, `speechiness`, `tempo`, `time_signature`); Filtering out `'Missing'` genre tags and `popularity == 0` noise to focus on the top 3 genres (`afro dancehall`, `afropop`, `nigerian pop`, 286 tracks); Computing the correlation matrix (`energy` vs. `loudness` strong correlation; correlation $\neq$ causation) and visualizing overlapping distributions via Seaborn bivariate KDE `jointplot` concentric rings and `FacetGrid` scatter plots.
   - **Pyodide Sandbox**: Pure-Python Nigerian Spotify Audio Profiler & Euclidean/Clustroid Distance Engine that filters `'Missing'` genres and zero-popularity tracks, computes genre counts and the `energy`–`loudness` Pearson correlation, and compares Euclidean centroid vs non-Euclidean clustroid assignments.
   - **Colab Notebook**: `14-introduction-to-clustering.ipynb` (Self-contained 530-row `nigerian-songs.csv` dataset, genre barplots, correlation heatmap, Seaborn KDE `jointplot`, and `FacetGrid` scatter plots).
15. **Lesson 15 (`15-k-means-clustering`, `order: 15`, `xp: 80`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ml-for-beginners/14-introduction-to-clustering"]`
    - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/5-Clustering/2-K-Means/README.md`, `notebook.ipynb`, `solution/notebook.ipynb`, `assignment.md`
    - **Content**: Signal-processing origins of **K-Means Clustering** and **Voronoi Diagrams**; Lloyd's 3-Step Iterative Algorithm (1. Sample $k$ initial centroids, 2. Assign each point $x_i$ to nearest centroid $\arg\min_{\mu_j} \|x_i - \mu_j\|^2$, 3. Recompute centroids $\mu_j = \frac{1}{|C_j|}\sum_{x_i \in C_j} x_i$ until convergence); Visualizing 12-column outlier distributions with a $4 \times 3$ grid of Seaborn `boxplot()` charts; Selecting `['artist_top_genre', 'popularity', 'danceability', 'acousticness', 'loudness', 'energy']` and encoding `artist_top_genre` with `LabelEncoder`; Fitting `KMeans(n_clusters=3, random_state=0)` and evaluating cluster separation with the **Silhouette Score**:
      $$s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))} \in [-1, 1]$$
      (yielding $s \approx 0.53$); Defining **Within-Cluster Sum of Squares (WCSS) / Inertia** ($\sum_{j=1}^k \sum_{x_i \in C_j} \|x_i - \mu_j\|^2$) and **`k-means++`** distant-centroid initialization; Sweeping $k \in [1, 10]$ to plot the **Elbow Method** curve confirming the bend at $k = 3$; Plotting the clustered `popularity` vs `danceability` scatterplot, measuring label alignment, and diagnosing the **Variance & Feature Scale** problem (how unscaled `popularity` $[1..73]$ dominates `danceability` $[0.25..0.96]$, and how `StandardScaler` transforms the elbow curve and clusters).
   - **Pyodide Sandbox**: Pure-Python K-Means (`k-means++`), WCSS Elbow & Silhouette Score Engine running on Nigerian Spotify audio tracks for $k=1..6$, outputting WCSS inertia drop, the $k=3$ Silhouette score ($\approx 0.53$), and comparing unscaled vs z-score standardized cluster assignments.
   - **Colab Notebook**: `15-k-means-clustering.ipynb` (Self-contained `nigerian-songs.csv`, $4 \times 3$ boxplots, `KMeans(n_clusters=3)`, `silhouette_score`, WCSS Elbow plot for $k=1..10$, and `StandardScaler` variance experiment).

### Module 4: Classical NLP & Time Series Forecasting (`category: "Module 4: Classical NLP & Time Series Forecasting"`)
16. **Lesson 16 (`16-introduction-to-nlp-and-conversational-bots`, `order: 16`, `xp: 70`, `difficulty: "beginner"`)**:
    - **Prerequisites**: `["ml-for-beginners/15-k-means-clustering"]`
    - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/6-NLP/1-Introduction-to-NLP/README.md`, `solution/bot.py`, `assignment.md`
    - **Content**: Computational linguistics & Natural Language Processing (dictation, virtual assistants, spell check, parsing grammar vs understanding humor/sarcasm); Talking to machines: Alan Turing's 1950 **Imitation Game & Turing Test**; Joseph Weizenbaum's 1966 **ELIZA** psychotherapist bot—how pattern matching and pronoun/tense reflection (`"I am sad"` $\rightarrow$ `"How long have you been sad?"`, and why `"You are a bicycle"` tricks it into `"How long have I been a bicycle?"`) create an illusion of comprehension without semantic understanding or conversational memory; Designing and building **Marvin the Simple Robot** (the 3-stage conversational REPL loop, randomized generic responses, exit handling, and architectural reflection on what makes a bot believable).
    - **Pyodide Sandbox**: Pure-Python Conversational Bot & ELIZA Reflection Simulator running a deterministic multi-turn transcript through both Marvin's random-response loop and an ELIZA regex pronoun-reflection engine (`"I am ..."` / `"You are ..."`).
    - **Colab Notebook**: `16-introduction-to-nlp-and-conversational-bots.ipynb` (Interactive Marvin conversational bot, ELIZA rule-based therapist implementation, and Assignment: Conversational Bot Architecture Analysis).
17. **Lesson 17 (`17-common-nlp-tasks-and-textblob`, `order: 17`, `xp: 75`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ml-for-beginners/16-introduction-to-nlp-and-conversational-bots"]`
    - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/6-NLP/2-Tasks/README.md`, `solution/bot.py`, `assignment.md`
    - **Content**: The 10 Core Classical NLP Tasks:
      1. **Tokenization** (splitting punctuation and word/sentence boundaries on Jane Austen's *Pride and Prejudice*).
      2. **Word Embeddings** (mapping words to dense numeric vectors where semantically similar words cluster together).
      3. **Parsing & Part-of-Speech (POS) Tagging** (`"the quick red fox jumped over the lazy brown dog"` $\rightarrow$ adjective-noun-verb sequences).
      4. **Word & Phrase Frequencies** (case-sensitive vs case-insensitive counting on Rudyard Kipling's poem *The Winners*: `"the"` $= 6$, `"a friend"` $= 2$, `"travels"` $= 2$).
      5. **N-Grams** (sliding window of unigrams $n=1$, bigrams $n=2$, and trigrams $n=3$).
      6. **Noun Phrase Extraction** (`TextBlob` & **`ConllExtractor`** chunk parser trained on 211,727 Wall Street Journal tokens from the CoNLL-2000 conference).
      7. **Sentiment Analysis** (Polarity $\in [-1.0, 1.0]$ and Subjectivity $\in [0.0, 1.0]$).
      8. **Inflection** (singularization & pluralization) and **Lemmatization** (*flew, flies, flying* $\rightarrow$ lemma *fly*).
      9. **WordNet** (Princeton lexical database of synsets, synonyms, and antonyms).
      - Hands-on Project: Upgrading Marvin into a **Sympathetic Context-Aware Bot** that classifies input into 4 polarity gradients ($\le -0.5$, $\le 0$, $\le 0.5$, $\le 1.0$), extracts noun phrases via `ConllExtractor`, pluralizes them (`"lovely cat"` $\rightarrow$ `"Can you tell me more about lovely cats?"`), and responds empathetically.
    - **Pyodide Sandbox**: Pure-Python NLP Pipeline & Sympathetic Marvin Bot executing Kipling word/phrase frequency counts, bigram/trigram sliding windows, noun-phrase chunking + plural inflection, and 4-gradient polarity replies on the lesson's exact dialogue transcript.
    - **Colab Notebook**: `17-common-nlp-tasks-and-textblob.ipynb` (`TextBlob` + `NLTK` tokenization, POS tagging, N-grams, `ConllExtractor` noun-phrase extraction, inflection/lemmatization, WordNet exploration, and the complete Sympathetic Marvin Bot).
18. **Lesson 18 (`18-translation-and-sentiment-analysis`, `order: 18`, `xp: 80`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ml-for-beginners/17-common-nlp-tasks-and-textblob"]`
    - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/6-NLP/3-Translation-Sentiment/README.md`, `solution/notebook.ipynb`, `assignment.md`
    - **Content**: Why word-by-word rule translation fails across language families: English SVO (`"I feel happy"` — Subject + Verb + Adjective) vs Irish VSO (`"Tá áthas orm"` — Verb + Adjective + Subject, literally *"Happy is upon me"*, vs the broken literal mistranslation `"Mise bhraitheann áthas"`); Statistical & corpus-based ML translation and French **false cognates** (`"I have no money"` $\rightarrow$ idiomatic `"Je n'ai pas d'argent"` vs false cognate `"monnaie"` meaning loose change); Comparing ML translation against V. Leconte & Ch. Pressoir's ornate 1932 human French translation of the opening line of Jane Austen's 1813 ***Pride and Prejudice***; Lexicon vs ML Sentiment Analysis (why sarcasm like `"Great, that was a wonderful waste of time, I'm glad we are lost on this dark road"` tricks word-sum lexicons, and how supervised email sorting learns `"for"` vs `"against"` patterns without semantic comprehension); Analyzing *Pride and Prejudice* first and last sentences (`polarity=0.210, subjectivity=0.271` vs `polarity=0.700, subjectivity=0.800`) and scanning the novel for absolute $+1.0$ and $-1.0$ polarity sentences; Critical evaluation of Regency irony & lexicon false positives (`"Our distress, my dear Lizzy, is very great"` scored $+1.0$ because of `"dear"` and `"great"`, and `"Happy shall I be, when his stay at Netherfield is over!"`); **Modern Cloud Upgrade**: Replacing deprecated `TextBlob.translate()` and Azure Text Analytics with **Google AI Studio Free Tier** (`GEMINI_API_KEY` via `google-genai`) for idiomatic English/Irish/French translation and Regency irony/sarcasm detection.
    - **Pyodide Sandbox**: Pure-Python *Pride and Prejudice* Sentiment Scanner & Irony Auditor that computes polarity and subjectivity on the novel's opening/closing quotes and the 15 Knowledge Check sentences, separating genuine positive/negative sentences from Regency irony false positives (`"Our distress, my dear Lizzy, is very great"`).
    - **Colab Notebook**: `18-translation-and-sentiment-analysis.ipynb` (Full *Pride and Prejudice* `TextBlob` polarity scan + step-by-step **Google AI Studio Free Tier `GEMINI_API_KEY`** setup and `google-genai` idiomatic translation & irony-aware sentiment comparison).
19. **Lesson 19 (`19-exploring-european-hotel-reviews`, `order: 19`, `xp: 80`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ml-for-beginners/18-translation-and-sentiment-analysis"]`
    - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/6-NLP/4-Hotel-Reviews-1/README.md`, `solution/notebook.ipynb`, `assignment.md`
    - **Content**: Exploratory Data Analysis (EDA) on the 515,738-row, 17-column **European Hotel Reviews (`Hotel_Reviews.csv`)** dataset (1,493 hotels across 6 European capitals); Architectural breakdown of the 4 column groups:
      1. *Hotel Identification*: `Hotel_Name`, `Hotel_Address`, `lat`, `lng`.
      2. *Hotel Meta-Reviews*: `Average_Score`, `Total_Number_of_Reviews`, `Additional_Number_of_Scoring`—investigating the *Britannia International Hotel Canary Wharf* discrepancy (4,789 dataset rows + 2,682 additional scorings $= 7,471 \neq 9,086$ reported total, and reported `Average_Score` $7.1$ vs calculated mean $6.8$).
      3. *Review Columns*: `Reviewer_Score` ($[2.5, 10.0]$), `Negative_Review` (`"No Negative"` sentinel and misplaced positive comments), `Positive_Review` (`"No Positive"` sentinel and misplaced 7-word warnings `"Nothing Terrible place Stay away"`), word counts, `Review_Date`, `days_since_review`, and the unstandardized `Tags` string list (1,025 unique group variations).
      4. *Reviewer Columns*: `Total_Number_of_Reviews_Reviewer_Has_Given` and `Reviewer_Nationality` (ethical warning against encoding national stereotypes into recommendation models).
      - Coding and solving all **9 DataFrame Verification Tasks**: dataset shape `(515738, 17)`, 227 distinct `Reviewer_Nationality` frequencies (UK: 245,246; USA: 35,437; Australia: 21,686), most reviewed hotel for each of the top 10 nationalities, per-hotel `Total_Reviews_Found` vs `Total_Number_of_Reviews`, computing `Calc_Average_Score` and `Average_Score_Difference` (identifying outliers like *Kube Hotel Ice Bar* $+1.3$ and *Best Western Hotel Astoria* $-0.8$), and benchmarking `.apply(lambda ...)` ($9.64\text{ s}$) against **vectorized boolean series summation** (`sum(df.Negative_Review == "No Negative")`, $0.19\text{ s}$ — a **$50\times$ speedup**) on `"No Negative"` (127,890), `"No Positive"` (35,946), and dual-empty (127) rows.
    - **Pyodide Sandbox**: Pure-Python European Hotel Reviews EDA & Discrepancy Auditor executing all 9 exploratory checks (nationality rankings, Britannia Canary Wharf review-count & `Calc_Average_Score` discrepancy audit, `"No Negative"`/`"No Positive"` sentinel counts, and lambda vs vectorized timing comparison).
    - **Colab Notebook**: `19-exploring-european-hotel-reviews.ipynb` (Self-contained European Hotel Reviews dataset loader + all 9 Pandas EDA tasks, `Average_Score_Difference` distribution analysis, and vectorized boolean optimization benchmark).
20. **Lesson 20 (`20-hotel-reviews-vader-sentiment`, `order: 20`, `xp: 85`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ml-for-beginners/19-exploring-european-hotel-reviews"]`
    - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/6-NLP/5-Hotel-Reviews-2/README.md`, `solution/1-notebook.ipynb`, `solution/3-notebook.ipynb`, `assignment.md`
    - **Content**: End-to-end feature engineering and sentiment enrichment pipeline on European Hotel Reviews:
      1. *Geographic Normalization*: Dropping `lat`/`lng` and normalizing `Hotel_Address` via `replace_address()` into the 6 canonical city-country hubs (`Amsterdam, Netherlands`: 105 hotels; `Barcelona, Spain`: 211; `London, United Kingdom`: 400; `Milan, Italy`: 162; `Paris, France`: 458; `Vienna, Austria`: 158).
      2. *Recalculating Trustworthy Meta-Columns*: Dropping `Additional_Number_of_Scoring` and overwriting `Total_Number_of_Reviews` and `Average_Score` with verified `.groupby('Hotel_Name').transform('count'|'mean')` values.
      3. *NLP Tag Parsing & Multi-Word Phrase Filtering*: Stripping brackets/quotes (`df.Tags.str.strip("[']")`), expanding variable-length comma-separated tag lists into 6 temporary columns to count all 2,428 unique tags across 6.76M words, discarding irrelevant device (`Submitted from a mobile device`: 307,640), length-of-stay (`Stayed 1 night`: 193,645), and room-type tags, and extracting the **8 High-Signal Binary Trip & Guest Columns** (`Leisure_trip`, `Couple`, `Solo_traveler`, `Business_trip`, `Group` combined with `Travelers with friends`, `Family_with_young_children`, `Family_with_older_children`, `With_a_pet`).
      4. *High-Speed Stop-Word Removal*: Caching `cache = set(stopwords.words("english"))` to shrink 395-word reviews to 195 sentiment-bearing words across 515K rows in ~3.3 seconds.
      5. *VADER Compound Sentiment Scoring & Gemini Sarcasm Comparison*: Running NLTK's **VADER (`SentimentIntensityAnalyzer`)** (Hutto & Gilbert, 2014) with `calc_sentiment()` (returning `0` for `"No Negative"` / `"No Positive"` and `polarity_scores(review)["compound"]` otherwise), reordering the 18 final columns into `Hotel_Reviews_NLP.csv`, and comparing VADER against **Google AI Studio Free Tier (`google-genai`)** on sarcastic reviews (`"Of course I LOVED sleeping in a room with no heating"`).
    - **Pyodide Sandbox**: Pure-Python Hotel Review Feature Engineer & VADER-Style Compound Sentiment Scorer that normalizes raw European addresses into the 6 city hubs, extracts the 8 binary trip/guest tag indicators, strips cached English stop words, and computes compound sentiment scores (including handling `"No Negative"` sentinels and negation/caps emphasis).
    - **Colab Notebook**: `20-hotel-reviews-vader-sentiment.ipynb` (Self-contained European Hotel Reviews filtering pipeline, 8-tag binary encoding, cached NLTK stop-word removal, `nltk.sentiment.vader.SentimentIntensityAnalyzer`, and `google-genai` Gemini sarcasm comparison).
21. **Lesson 21 (`21-introduction-to-time-series-forecasting`, `order: 21`, `xp: 70`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ml-for-beginners/20-hotel-reviews-vader-sentiment"]`
    - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/7-TimeSeries/1-Introduction/README.md`, `working/notebook.ipynb`, `data/energy.csv`, `assignment.md`
    - **Content**: Smart parking meter dynamic pricing & power-grid load forecasting motivation; Core Definitions: **Time Series** (equally spaced chronological observations $y_t$), **Time Series Analysis** (frequency-domain vs time-domain, interrupted time series), and **Time Series Forecasting** (predicting $y_{t+h}$ from historical lags and errors); Univariate vs Multivariate time series (Mauna Loa Observatory monthly $\text{CO}_2$ concentration table); The **6 Core Time Series Characteristics**: **Trends**, **Seasonality**, **Outliers**, **Long-run cycles**, **Constant variance**, and **Abrupt changes** (e.g., pandemic lockdown shifts); Exploring the **GEFCom2014 Hourly Electricity Load (`energy.csv`)** dataset (3 years of hourly electricity `load` and `temperature` from `2012-01-01` to `2014-12-31`, 26,304 hours): plotting the full 2012–2014 annual seasonal wave and zooming into the July 1–7, 2014 (`energy['2014-07-01':'2014-07-07']`) daily diurnal cycle.
    - **Pyodide Sandbox**: Pure-Python Time Series Characteristic Decomposer & GEFCom2014 Diurnal Load Analyzer that computes moving-average trends, 24-hour diurnal seasonal indices, outlier z-scores, and daily peak/trough load ratios on the July 2014 power usage window.
    - **Colab Notebook**: `21-introduction-to-time-series-forecasting.ipynb` (Self-contained GEFCom2014 `energy.csv` generator/loader, full 2012–2014 load visualization, July 2014 weekly slice, seasonal decomposition, and Assignment: Visualizing Time Series Characteristics).
22. **Lesson 22 (`22-time-series-forecasting-with-arima`, `order: 22`, `xp: 85`, `difficulty: "advanced"`)**:
    - **Prerequisites**: `["ml-for-beginners/21-introduction-to-time-series-forecasting"]`
    - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/7-TimeSeries/2-ARIMA/README.md`, `working/notebook.ipynb`, `solution/notebook.ipynb`, `assignment.md`
    - **Content**: Statistical foundations of **Stationarity** (time-invariant mean and variance) and **Differencing** ($\nabla y_t = y_t - y_{t-1}$ and seasonal differencing $\nabla_s y_t = y_t - y_{t-s}$ to stabilize non-stationary trends); Unpacking **ARIMA $(p, d, q)$** and Seasonal **SARIMAX $(p, d, q) \times (P, D, Q)_s$**:
      - **AR ($p$ — AutoRegressive)**: regressing on $p$ prior lag values $\sum_{i=1}^p \phi_i y_{t-i}$.
      - **I ($d$ — Integrated)**: applying $d$ differencing steps to achieve stationarity.
      - **MA ($q$ — Moving Average)**: incorporating $q$ past forecast errors $\sum_{j=1}^q \theta_j \varepsilon_{t-j}$.
      - **Seasonal $(P, D, Q)_s$**: seasonal lags, differencing, and error terms over period $s = 24$ hours.
      - Strict Temporal Train/Test Splitting (preventing future data leakage): Training window `2014-11-01 00:00:00` to `2014-12-29 23:00:00` (`(1416, 1)`) and Testing window `2014-12-30 00:00:00` to `2014-12-31 23:00:00` (`(48, 1)`); Scaling to $[0, 1]$ with `MinMaxScaler()`; Fitting `SARIMAX(endog=train, order=(4, 1, 0), seasonal_order=(1, 1, 0, 24))`; Shifting multi-step horizons (`HORIZON = 3`: `load+1`, `load+2`, `load+3`) and executing 720-hour sliding-window **Walk-Forward Validation** (`order=(2, 1, 0), seasonal_order=(1, 1, 0, 24)`); Inverse-scaling predictions (`3,008.74` vs actual `3,023.00` MW) and evaluating accuracy with **Mean Absolute Percentage Error (MAPE)**:
        $$\text{MAPE} = \frac{100\%}{n} \sum_{t=1}^n \left| \frac{\text{actual}_t - \text{predicted}_t}{\text{actual}_t} \right|$$
        (achieving **$0.56\%$** one-step MAPE and **$1.15\%$** 3-step MAPE).
    - **Pyodide Sandbox**: Pure-Python Differencing, Autoregressive SARIMA Walk-Forward & MAPE Engine that scales hourly electricity loads to $[0, 1]$, performs 24-hour seasonal differencing and 3-step walk-forward forecasting (`t+1`, `t+2`, `t+3`), inverse-transforms back to megawatts, and computes one-step ($0.56\%$) and multi-step ($1.15\%$) MAPE.
    - **Colab Notebook**: `22-time-series-forecasting-with-arima.ipynb` (Self-contained GEFCom2014 dataset, `MinMaxScaler`, `statsmodels.tsa.statespace.sarimax.SARIMAX`, 3-step walk-forward validation loop, MAPE evaluation, and multi-horizon forecast plots).
23. **Lesson 23 (`23-time-series-forecasting-with-svr`, `order: 23`, `xp: 85`, `difficulty: "advanced"`)**:
    - **Prerequisites**: `["ml-for-beginners/22-time-series-forecasting-with-arima"]`
    - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/7-TimeSeries/3-SVR/README.md`, `working/notebook.ipynb`, `solution/notebook.ipynb`, `assignment.md`
    - **Content**: Why **Support Vector Regressor (SVR)** excels when time series exhibit non-linear dynamics that linear ARIMA cannot capture; Mathematical formulation of $\varepsilon$-insensitive SVR and the **Radial Basis Function (RBF) Kernel**:
      $$K(x, x') = \exp\left(-\gamma \|x - x'\|^2\right)$$
      Role of hyperparameters: `kernel='rbf'`, `gamma=0.5` (kernel curvature radius), `C=10` (box regularization penalty for errors outside the $\varepsilon$-tube), and `epsilon=0.05` (width of the zero-penalty $\varepsilon$-insensitive tube); Transforming a 1D time series into a **2D Sliding-Window Tensor `[batch, timesteps]`** with `timesteps = 5`:
      - Nested list comprehension slicing `train_data` `(1416, 1)` into `(1412, 5)` and splitting into 4 input lags `x_train` `(1412, 4)` and 1 target step `y_train` `(1412, 1)`.
      - Slicing `test_data` `(48, 1)` into `x_test` `(44, 4)` and `y_test` `(44, 1)`.
      - Fitting `SVR(kernel='rbf', gamma=0.5, C=10, epsilon=0.05)`, inverse-scaling predictions with `scaler.inverse_transform()`, and evaluating **MAPE** across Training ($1.72\%$), Testing ($1.26\%$), and the Full 26,300-sample dataset ($2.06\%$).
    - **Pyodide Sandbox**: Pure-Python Sliding-Window Time-Step Tensor Builder & RBF Kernel SVR Predictor that transforms hourly load series into `[batch, 5]` windows (`x` shape `(N, 4)`, `y` shape `(N, 1)`), fits an RBF kernel regression predictor, inverse-scales megawatt forecasts, and reports train/test MAPE.
    - **Colab Notebook**: `23-time-series-forecasting-with-svr.ipynb` (Self-contained GEFCom2014 dataset, `timesteps=5` 2D tensor reshaping, `sklearn.svm.SVR(kernel='rbf', gamma=0.5, C=10, epsilon=0.05)`, train/test/full-dataset MAPE plots, and hyperparameter tuning challenge).

### Module 5: Reinforcement Learning & Real-World ML (`category: "Module 5: Reinforcement Learning & Real-World ML"`)
24. **Lesson 24 (`24-reinforcement-learning-and-q-learning`, `order: 24`, `xp: 90`, `difficulty: "advanced"`)**:
    - **Prerequisites**: `["ml-for-beginners/23-time-series-forecasting-with-svr"]`
    - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/8-Reinforcement/1-QLearning/README.md`, `notebook.ipynb`, `rlboard.py`, `assignment.md`
    - **Content**: Supervised vs Unsupervised vs Semi-Supervised vs **Reinforcement Learning (RL)** (learning optimal decisions via simulated environment interaction and delayed rewards); Regional Case Study: Sergei Prokofiev's ***Peter and the Wolf*** $8 \times 8$ Grid World (`Board` in `rlboard.py` with cell types: `ground`, `water`, `tree`/`grass`, `apple`, `wolf`); Defining the Action Space `actions = {"U": (0,-1), "D": (0,1), "L": (-1,0), "R": (1,0)}` and **Policy** $\pi(s) \rightarrow a$; Baseline **Random Walk Policy** (`random_policy` averaging 30–40 steps with frequent wolf attacks vs 5–6 step optimal distance); Designing the **Reward Function** (`move_reward = -0.1`, `goal_reward = +10`, `end_reward = -10`); Initializing the $8 \times 8 \times 4$ **Q-Table** (`0.25` uniform prior); Dynamic Programming & the **Bellman Equation**:
      $$Q(s, a) \leftarrow (1 - \alpha) Q(s, a) + \alpha \left( r + \gamma \max_{a'} Q(s', a') \right)$$
      Balancing **Exploration vs. Exploitation** via probability-weighted action sampling `probs(v, eps=1e-4)` across 5,000 epochs ($\alpha = \exp(-n / 10^6), \gamma = 0.5$); Comparing strict greedy policy `qpolicy_strict` (and why two mutually pointing states can cause infinite loops requiring a max-step cap or visited-state memory) against stochastic `qpolicy` (reducing average path length to **3–6 steps**); Analyzing the 3 phases of the learning curve (initial path-length rise as Peter learns to avoid wolves $\rightarrow$ steady path-length drop as apples are found $\rightarrow$ occasional stochastic spikes motivating learning-rate decay).
    - **Pyodide Sandbox**: Pure-Python *Peter and the Wolf* $8 \times 8$ Q-Learning Simulator that embeds the `Board` grid world, benchmarks 100 episodes of `random_policy`, runs Bellman Q-Table training epochs, and prints the before/after average path length, wolf survival rate, and ASCII policy arrow map (`↑ ↓ ← →`).
    - **Colab Notebook**: `24-reinforcement-learning-and-q-learning.ipynb` (Self-contained notebook embedding `rlboard.py` inline so no external file download is needed, visual board plots with policy arrows, 5,000-epoch Q-Learning loop, learning-curve plots, and Challenge tasks 1 & 2).
25. **Lesson 25 (`25-reinforcement-learning-cartpole-gym`, `order: 25`, `xp: 90`, `difficulty: "advanced"`)**:
    - **Prerequisites**: `["ml-for-beginners/24-reinforcement-learning-and-q-learning"]`
    - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/8-Reinforcement/2-Gym/README.md`, `notebook.ipynb`, `assignment.md`
    - **Content**: Scaling Q-Learning from discrete grid boards to **Continuous State Spaces**; Helping Peter escape the wolf on a skateboard via the classic **CartPole-v1** inverted pendulum control problem in open-source **Gymnasium** (`import gymnasium as gym`); Anatomy of `CartPole-v1`:
      - **4D Continuous Observation Vector**: Cart Position $x \in [-4.8, 4.8]$, Cart Velocity $\dot{x} \in (-\infty, \infty)$, Pole Angle $\theta \in [-0.418, 0.418]\text{ rad}$, and Pole Angular Velocity $\dot{\theta} \in (-\infty, \infty)$.
      - **Discrete Action Space**: `Discrete(2)` (`0` push cart left, `1` push cart right) and $+1.0$ survival reward per step (formally solved at average cumulative reward $\ge 195$ over 100 consecutive trials).
      - **Two State Discretization Strategies**:
        1. *Scaling & Integer Rounding*: `discretize(x) = tuple((x / np.array([0.25, 0.25, 0.01, 0.1])).astype(int))`.
        2. *Interval Binning with `np.digitize`*: `create_bins(interval, num)` across `ints = [(-5,5), (-2,2), (-0.5,0.5), (-2,2)]` and `nbins = [20, 20, 10, 10]`.
      - **Sparse Dictionary Q-Table**: Representing unbounded discretized state-action pairs as `Q[(state, action)]` with helper `qvalues(state) = [Q.get((state, a), 0) for a in (0, 1)]`.
      - Training Loop & Algorithmic Improvements ($\alpha = 0.3, \gamma = 0.9, \epsilon = 0.90$): Tracking `Qmax` and snapshotting `Qbest` to prevent late-training catastrophic forgetting, smoothing raw episodic rewards with a 100-episode running average via `np.convolve(rewards, np.ones(100)/100, mode='valid')`, and scheduling decaying $\alpha$ and increasing $\epsilon$.
    - **Pyodide Sandbox**: Pure-Python CartPole Physics Simulator & Discretized Dictionary Q-Learning Solver that implements the exact Euler CartPole kinematics equations, tests both `discretize()` and `discretize_bins()`, trains a sparse dictionary Q-Table across episodes, and verifies that the trained policy balances the pole far longer than random actions.
    - **Colab Notebook**: `25-reinforcement-learning-cartpole-gym.ipynb` (Open-source `gymnasium` `CartPole-v1` environment, both state discretization functions, dictionary Q-Learning training loop with `Qbest` checkpointing, `np.convolve` running-average plots, and Assignment: MountainCar-v0).
26. **Lesson 26 (`26-real-world-ml-applications`, `order: 26`, `xp: 75`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ml-for-beginners/25-reinforcement-learning-cartpole-gym"]`
    - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/9-Real-World/1-Applications/README.md`, `assignment.md`
    - **Content**: Why classical machine learning remains indispensable in production alongside deep learning (interpretability, tabular efficiency, low latency, small-data reliability); Deep-dive case studies across **8 Real-World Sectors**:
      1. **Finance**: Credit card fraud detection via K-Means clustering outlier distance scoring; Wealth management fund performance attribution against benchmarks via simple & multiple linear regression ($\alpha, \beta$, $p$-values).
      2. **Education**: Coursera controlled regression quantifying the impact of Net Promoter Score (NPS) course ratings on learner retention; Grammarly NLP engineering to mitigate gender bias in autocorrect and writing assistance.
      3. **Retail**: Wayfair Query Intent Engine combining NLP entity extraction, opinion mining, sentiment tagging, and classifiers; StitchFix human-in-the-loop styling recommendations and genetic algorithms for apparel inventory design.
      4. **Healthcare**: Random Forest classifiers predicting clinical trial drug toxicity; K-Means clustering grouping hospital readmission causes; ARIMA, SARIMA, logistic curves, and linear regression forecasting infectious disease transmission.
      5. **Ecology & Green Tech**: Canadian researchers inverting Reinforcement Learning / Markov Decision Processes (Spatially Spreading Process where the wildfire is the agent taking N/S/E/W spread actions on satellite grids); IoT accelerometer + ROC curve classification of farm sheep postures; Combining clustering, regression, and time-series forecasting on Irish smart electricity meters.
      6. **Insurance**: MetLife Investment Management binary/ordinal classification and macroeconomic volatility forecasting.
      7. **Arts, Culture & Literature**: Multi-classifier Fake News detection pipeline (TF-IDF/NLP feature extraction feeding Naive Bayes, SVM, Random Forest, SGD, and Logistic Regression); Museum ML (*In Codice Ratio* paleographic transcription of the Vatican Archives and the Art Institute of Chicago predicting exhibit attendance within $1\%$ accuracy).
      8. **Marketing**: Unsupervised customer segmentation clustering for differentiated marketing campaigns.
    - **Pyodide Sandbox**: Pure-Python Multi-Industry Classical ML Workbench executing three real-world mini-pipelines: (1) Finance K-Means credit-card transaction outlier fraud detector, (2) Wealth Management OLS alpha/beta benchmark regressor, and (3) Journalism multi-feature Fake News Naive-Bayes/Logistic ensemble scorer.
    - **Colab Notebook**: `26-real-world-ml-applications.ipynb` (Hands-on implementation of Credit Card Fraud K-Means Outlier Detection, Clinical Trial Random Forest Toxicity Classification, and Fake News Multi-Classifier Benchmarking in Scikit-Learn + Assignment: ML Scavenger Hunt).
27. **Lesson 27 (`27-debugging-ml-models-and-explainability`, `order: 27`, `xp: 90`, `difficulty: "advanced"`)**:
    - **Prerequisites**: `["ml-for-beginners/26-real-world-ml-applications"]`
    - **Reference**: `.ref/ML-For-Beginners/ML-For-Beginners-main/9-Real-World/2-Debugging-ML-Models/README.md`, `assignment.md`
    - **Content**: Why aggregate metrics (e.g., $89\%$ overall accuracy, $0.001$ average loss) hide catastrophic subgroup failures (e.g., a model failing $42\%$ of the time in a critical demographic cohort) and black-box risks; Mastering the **4 Pillars of Responsible ML Model Debugging** using an open-source Python stack (**`Fairlearn` + `SHAP` + Decision-Tree Cohort Error Analysis** on Google Colab):
      1. **Error Analysis**: Breaking down aggregate error rates using an error-partitioning decision tree and 2D feature error heatmaps to automatically discover high-failure data cohorts.
      2. **Model Overview & Cohort Disparity**: Comparing multiple metrics simultaneously (accuracy, error rate, precision, recall, MAE) across custom feature cohorts (e.g., clinical `time_in_hospital < 3` vs `time_in_hospital >= 7`) and computing the two core disparity classes with `Fairlearn` `MetricFrame`:
         - *Disparity in Model Performance* (accuracy, error rate, precision, recall, MAE differences across subgroups).
         - *Disparity in Selection Rate* (favorable prediction rate differences, e.g., loan approval or executive job ad targeting).
      3. **Data Analysis & Representation Bias**: Ronald Coase's data-torturing warning; diagnosing representation skew (e.g., a corporate dataset with $27\%$ women vs $73\%$ men in executive roles causing a job-targeting model to exclude women), label noise, and feature noise across cohorts to guide targeted data collection.
      4. **Model Interpretability & Feature Importance**: Opening black-box models for debugging, human-AI clinical collaboration, and regulatory audits using Permutation Importance and **SHAP (SHapley Additive exPlanations)**:
         - *Global Explanations*: Top features driving overall model behavior (e.g., across all patients in a 30-day diabetes hospital readmission classifier).
         - *Local Explanations*: Individual feature attributions explaining *why* a specific diabetic patient over 60 with prior hospitalizations was predicted for readmission, and detecting whether sensitive attributes (or correlated proxies) are driving predictions.
      - Reviewing the 5 Societal Harms Checklist (Allocation, Quality of Service, Stereotyping, Denigration, Over/Under-representation) and concluding Course 03 with a direct handoff to **Course 04: Generative AI for Beginners** (`/learn/generative-ai-for-beginners`).
    - **Pyodide Sandbox**: Pure-Python Responsible AI Model Debugger that audits an 89%-accurate hospital readmission / executive hiring classifier, discovers the 42%-error high-risk cohort (`time_in_hospital >= 7`), computes `Fairlearn`-style Performance & Selection Rate Disparity metrics across demographic cohorts, and calculates Global & Local Shapley feature attributions for an individual patient over 60.
    - **Colab Notebook**: `27-debugging-ml-models-and-explainability.ipynb` (Complete open-source Responsible AI debugging suite using `Fairlearn` `MetricFrame`, decision-tree Cohort Error Analysis + 2D Seaborn error heatmaps, representation bias diagnostics, and Global/Local `SHAP` explainability on a clinical readmission dataset).

---

## Verification & Quality Gates

1. **Automated Content, Sandbox & Notebook Validator (`verify_course_03.py`)**:
   - Validate every `.mdx` frontmatter against `src/content.config.ts` (`track: "ml-for-beginners"`, `order: 1..27`, `description.length >= 30`, valid `prerequisites` chain starting from `["data-science-for-beginners/20-data-science-in-the-wild"]`).
   - Confirm each `.mdx` has `>= 350` words of prose, `<PythonRunner`, `<QuizCard`, `<ColabButton`, and markdown table headers (`| :---` or `| ---`), with strict `H2` (`## `) → `H3` (`### `) heading hierarchy.
   - Execute every `<PythonRunner />` `initialCode` snippet in Python 3 and verify `stdout.strip() == expectedOutput.strip()` in `< 2.0` seconds.
   - Parse every `.ipynb` file in `notebook/ml-for-beginners/` as JSON (`nbformat == 4`), verify self-contained dataset/helper initialization cells, verify modern API compatibility (zero `squared=False`, `sparse=False`, `np.float`/`np.int`, or legacy `import gym`), and scan both `.mdx` and `.ipynb` files for forbidden terms (`.ref/`, `ML-For-Beginners`, `Azure Machine Learning`, `Azure Custom Vision`, `Azure Text Analytics`, `Azure RAI`, `Microsoft Foundry`, `learn.microsoft.com`, `Lobe.ai`).
2. **Build & Type Verification**:
   - `pnpm astro check` (`0` errors, `0` warnings)
   - `pnpm build` (`0` errors, static HTML generated for `/learn/ml-for-beginners/` and all 27 lessons)
3. **Accessibility & Design Token Verification**:
   - `uv run --with "buddhi-ai[MCP]" python .agents/skills/design-md/scripts/detect_design_md.py --lint`
   - `buddhi scripts verify-a11y` via `terminal-runner`

---

## Complexity Tracking

No `AGENTS.md` or `DESIGN.md` violations exist. Zero new npm dependencies or architectural layers are introduced.
