# Tasks: Course 03 — ML for Beginners (`ml-for-beginners`)

**Input**: Design documents from `.buddhi/specs/013-create-full-course/`
**Prerequisites**: [spec.md](file:///C:/DevDojo/Buddhi/bl-academy/.buddhi/specs/013-create-full-course/spec.md), [plan.md](file:///C:/DevDojo/Buddhi/bl-academy/.buddhi/specs/013-create-full-course/plan.md)

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 [P] Create course directories `src/content/lessons/ml-for-beginners/` and `notebook/ml-for-beginners/`
- [x] T002 [P] Create automated course verification script `verify_course_03.py` validating frontmatter schema (`src/content.config.ts`), word count (`>= 350` words), `H2` → `H3` heading hierarchy, `<PythonRunner />` `initialCode` vs `expectedOutput` execution (`< 2.0s` standard-library deterministic), `<ColabButton />` & `<QuizCard />` presence, `nbformat == 4` `.ipynb` JSON validity & self-contained dataset/helper checks, modern Python 3.11+ / Scikit-Learn / Gymnasium API compatibility, and zero forbidden `.ref/` or proprietary Azure/Foundry terms

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T003 Update `ml-for-beginners` entry in `src/lib/curriculum.ts` (`plannedLessonCount: 27`, `runtimeBadges: ['In-Browser Pyodide', 'Colab Free CPU', 'Google AI Studio Free Tier']`, `usesGeminiApi: true`, and 5 `syllabusModules` matching Lessons `01`–`27`)

## Phase 3: User Story 1 - Module 1: ML Foundations, History, Fairness & Core Techniques (Priority: P1) 🎯 MVP

- [x] T004 [P] [US1] Author Lesson 01 (`src/content/lessons/ml-for-beginners/01-introduction-to-machine-learning.mdx`) + Colab notebook (`notebook/ml-for-beginners/01-introduction-to-machine-learning.ipynb`) covering AI vs ML vs DL vs DS, Google Colab Free Tier & Scikit-Learn setup, and rules-engine vs data-driven learner sandbox
- [x] T005 [P] [US1] Author Lesson 02 (`src/content/lessons/ml-for-beginners/02-history-of-machine-learning.mdx`) + Colab notebook (`notebook/ml-for-beginners/02-history-of-machine-learning.ipynb`) covering Bayes (1763), Least Squares (1805), Markov Chains (1913), Turing Test, Dartmouth 1956, Shakey/ELIZA/SHRDLU, AI Winters, and Expert Systems
- [x] T006 [P] [US1] Author Lesson 03 (`src/content/lessons/ml-for-beginners/03-fairness-and-responsible-ml.mdx`) + Colab notebook (`notebook/ml-for-beginners/03-fairness-and-responsible-ml.ipynb`) covering the 5 fairness harms, 6 Responsible AI principles, impact assessments, and open-source `Fairlearn` `MetricFrame` subgroup auditing
- [x] T007 [P] [US1] Author Lesson 04 (`src/content/lessons/ml-for-beginners/04-techniques-of-machine-learning.mdx`) + Colab notebook (`notebook/ml-for-beginners/04-techniques-of-machine-learning.ipynb`) covering the 7-step ML workflow, feature selection vs extraction, train/val/test splits, and underfitting vs overfitting curves
- [x] T008 [US1] Verify US1 MVP slice (`01`–`04`) via `python verify_course_03.py` and `pnpm astro check`

## Phase 4: User Story 2 - Module 2: Regression Models & Web App Deployment (Priority: P2)

- [x] T009 [P] [US2] Author Lesson 05 (`src/content/lessons/ml-for-beginners/05-regression-tools-and-scikit-learn.mdx`) + Colab notebook (`notebook/ml-for-beginners/05-regression-tools-and-scikit-learn.ipynb`) covering Scikit-Learn `load_diabetes()` BMI linear regression and line plotting
- [x] T010 [P] [US2] Author Lesson 06 (`src/content/lessons/ml-for-beginners/06-preparing-and-visualizing-pumpkin-data.mdx`) + Colab notebook (`notebook/ml-for-beginners/06-preparing-and-visualizing-pumpkin-data.ipynb`) with self-contained `US-pumpkins.csv` bushel normalization (`1 1/9` and `1/2` bushel), Matplotlib bar plots, and Seaborn `relplot`/`catplot`/`heatmap`
- [x] T011 [P] [US2] Author Lesson 07 (`src/content/lessons/ml-for-beginners/07-linear-and-polynomial-regression.mdx`) + Colab notebook (`notebook/ml-for-beginners/07-linear-and-polynomial-regression.ipynb`) covering OLS math, `DayOfYear` linear & degree-2 polynomial pipelines, one-hot encoding, and the 5-model RMSE/$R^2$ progression up to $R^2 = 0.97$
- [x] T012 [P] [US2] Author Lesson 08 (`src/content/lessons/ml-for-beginners/08-logistic-regression-and-roc-curves.mdx`) + Colab notebook (`notebook/ml-for-beginners/08-logistic-regression-and-roc-curves.ipynb`) covering `OrdinalEncoder`, `OneHotEncoder(sparse_output=False)`, `ColumnTransformer`, Sigmoid math, confusion matrix, and ROC-AUC ($0.975$)
- [x] T013 [P] [US2] Author Lesson 09 (`src/content/lessons/ml-for-beginners/09-deploying-ml-models-in-web-apps.mdx`) + Colab notebook (`notebook/ml-for-beginners/09-deploying-ml-models-in-web-apps.ipynb`) with self-contained NUFORC `ufos.csv` model, `pickle` serialization (`ufo-model.pkl`), Flask app architecture, and live Gradio/FastAPI Colab deployment
- [x] T014 [US2] Verify US2 slice (`05`–`09`) via `python verify_course_03.py`

## Phase 5: User Story 3 - Module 3: Multi-Class Classification, ONNX Web Inference & Unsupervised K-Means Clustering (Priority: P3)

- [x] T015 [P] [US3] Author Lesson 10 (`src/content/lessons/ml-for-beginners/10-introduction-to-classification-and-smote.mdx`) + Colab notebook (`notebook/ml-for-beginners/10-introduction-to-classification-and-smote.ipynb`) with self-contained `cuisines.csv`, `create_ingredient_df`, confounder removal (`rice`, `garlic`, `ginger`), and `SMOTE` class balancing
- [x] T016 [P] [US3] Author Lesson 11 (`src/content/lessons/ml-for-beginners/11-multiclass-classification-and-solvers.mdx`) + Colab notebook (`notebook/ml-for-beginners/11-multiclass-classification-and-solvers.ipynb`) covering `ovr` vs `multinomial`, solver matrix (`liblinear`, `lbfgs`, `newton-cg`, `sag`, `saga`), and single-recipe probability ranking
- [x] T017 [P] [US3] Author Lesson 12 (`src/content/lessons/ml-for-beginners/12-comparing-classifiers-svc-knn-ensembles.mdx`) + Colab notebook (`notebook/ml-for-beginners/12-comparing-classifiers-svc-knn-ensembles.ipynb`) benchmarking `Linear SVC`, `KNeighborsClassifier`, RBF `SVC`, `RandomForestClassifier`, and `AdaBoostClassifier`
- [x] T018 [P] [US3] Author Lesson 13 (`src/content/lessons/ml-for-beginners/13-cuisine-recommender-with-onnx.mdx`) + Colab notebook (`notebook/ml-for-beginners/13-cuisine-recommender-with-onnx.ipynb`) covering `skl2onnx` export (`model.onnx`), `onnxruntime` / `onnxruntime-web` 380-feature refrigerator recommender, and Gradio UI
- [x] T019 [P] [US3] Author Lesson 14 (`src/content/lessons/ml-for-beginners/14-introduction-to-clustering.mdx`) + Colab notebook (`notebook/ml-for-beginners/14-introduction-to-clustering.ipynb`) with self-contained `nigerian-songs.csv`, clustering taxonomies & geometry, correlation heatmap, and Seaborn KDE `jointplot`/`FacetGrid`
- [x] T020 [P] [US3] Author Lesson 15 (`src/content/lessons/ml-for-beginners/15-k-means-clustering.mdx`) + Colab notebook (`notebook/ml-for-beginners/15-k-means-clustering.ipynb`) covering Voronoi centroids, boxplots, `KMeans(n_clusters=3)`, Silhouette score ($0.53$), WCSS Elbow method ($k=1..10$), and `StandardScaler` variance analysis
- [x] T021 [US3] Verify US3 slice (`10`–`15`) via `python verify_course_03.py`

## Phase 6: User Story 4 - Module 4: Classical Natural Language Processing & Time Series Forecasting (Priority: P4)

- [x] T022 [P] [US4] Author Lesson 16 (`src/content/lessons/ml-for-beginners/16-introduction-to-nlp-and-conversational-bots.mdx`) + Colab notebook (`notebook/ml-for-beginners/16-introduction-to-nlp-and-conversational-bots.ipynb`) covering Turing Test, ELIZA reflection rules, and building Marvin the Simple Robot
- [x] T023 [P] [US4] Author Lesson 17 (`src/content/lessons/ml-for-beginners/17-common-nlp-tasks-and-textblob.mdx`) + Colab notebook (`notebook/ml-for-beginners/17-common-nlp-tasks-and-textblob.ipynb`) covering tokenization, POS tagging, N-grams, `ConllExtractor` noun phrases, inflection/lemmatization, WordNet, and the sympathetic Marvin bot
- [x] T024 [P] [US4] Author Lesson 18 (`src/content/lessons/ml-for-beginners/18-translation-and-sentiment-analysis.mdx`) + Colab notebook (`notebook/ml-for-beginners/18-translation-and-sentiment-analysis.ipynb`) covering SVO vs VSO grammar, French false cognates, *Pride and Prejudice* `TextBlob` polarity scan, and **Google AI Studio Free Tier (`google-genai`, `GEMINI_API_KEY`)** guide for translation & irony-aware sentiment
- [x] T025 [P] [US4] Author Lesson 19 (`src/content/lessons/ml-for-beginners/19-exploring-european-hotel-reviews.mdx`) + Colab notebook (`notebook/ml-for-beginners/19-exploring-european-hotel-reviews.ipynb`) with self-contained European Hotel Reviews EDA, meta-review discrepancy audits, and the $50\times$ vectorized boolean speedup benchmark
- [x] T026 [P] [US4] Author Lesson 20 (`src/content/lessons/ml-for-beginners/20-hotel-reviews-vader-sentiment.mdx`) + Colab notebook (`notebook/ml-for-beginners/20-hotel-reviews-vader-sentiment.ipynb`) covering 6-city normalization, 8-tag binary encoding, cached NLTK stop-word removal, `NLTK VADER` compound sentiment, and `google-genai` sarcasm comparison
- [x] T027 [P] [US4] Author Lesson 21 (`src/content/lessons/ml-for-beginners/21-introduction-to-time-series-forecasting.mdx`) + Colab notebook (`notebook/ml-for-beginners/21-introduction-to-time-series-forecasting.ipynb`) with self-contained GEFCom2014 `energy.csv`, 6 time-series characteristics, and July 2014 diurnal load visualization
- [x] T028 [P] [US4] Author Lesson 22 (`src/content/lessons/ml-for-beginners/22-time-series-forecasting-with-arima.mdx`) + Colab notebook (`notebook/ml-for-beginners/22-time-series-forecasting-with-arima.ipynb`) covering stationarity, differencing, `SARIMAX` $(p,d,q)\times(P,D,Q)_{24}$, 720-hour sliding-window walk-forward validation, and MAPE ($0.56\%$ / $1.15\%$)
- [x] T029 [P] [US4] Author Lesson 23 (`src/content/lessons/ml-for-beginners/23-time-series-forecasting-with-svr.mdx`) + Colab notebook (`notebook/ml-for-beginners/23-time-series-forecasting-with-svr.ipynb`) covering `timesteps=5` 2D sliding-window tensors, `SVR(kernel='rbf', gamma=0.5, C=10, epsilon=0.05)`, and train/test/full MAPE ($1.72\%$ / $1.26\%$ / $2.06\%$)
- [x] T030 [US4] Verify US4 slice (`16`–`23`) via `python verify_course_03.py`

## Phase 7: User Story 5 - Module 5: Reinforcement Learning, Real-World ML & Open-Source Model Debugging (Priority: P5)

- [x] T031 [P] [US5] Author Lesson 24 (`src/content/lessons/ml-for-beginners/24-reinforcement-learning-and-q-learning.mdx`) + Colab notebook (`notebook/ml-for-beginners/24-reinforcement-learning-and-q-learning.ipynb`) with inline `rlboard.py` *Peter and the Wolf* $8 \times 8$ grid world, Bellman Q-Table updates, and exploration vs exploitation
- [x] T032 [P] [US5] Author Lesson 25 (`src/content/lessons/ml-for-beginners/25-reinforcement-learning-cartpole-gym.mdx`) + Colab notebook (`notebook/ml-for-beginners/25-reinforcement-learning-cartpole-gym.ipynb`) using open-source `gymnasium` `CartPole-v1`, continuous state discretization (`discretize` & `np.digitize`), `Qbest` checkpointing, and `np.convolve` running average
- [x] T033 [P] [US5] Author Lesson 26 (`src/content/lessons/ml-for-beginners/26-real-world-ml-applications.mdx`) + Colab notebook (`notebook/ml-for-beginners/26-real-world-ml-applications.ipynb`) covering classical ML case studies across Finance, Education, Retail, Healthcare, Ecology/Green Tech, Insurance, Arts/Culture, and Marketing
- [x] T034 [P] [US5] Author Lesson 27 (`src/content/lessons/ml-for-beginners/27-debugging-ml-models-and-explainability.mdx`) + Colab notebook (`notebook/ml-for-beginners/27-debugging-ml-models-and-explainability.ipynb`) covering Cohort Error Analysis, `Fairlearn` `MetricFrame` performance & selection-rate disparity, data representation bias, Global/Local `SHAP` explainability, and handoff to Course 04 (`generative-ai-for-beginners`)
- [x] T035 [US5] Verify US5 slice (`24`–`27`) via `python verify_course_03.py`

## Phase 8: Polish & Cross-Cutting Verification

- [x] T036 Run full-course validation script `python verify_course_03.py` across all 27 `.mdx` files and 27 `.ipynb` notebooks (`0` errors, `0` forbidden terms, `0` deprecated API calls)
- [x] T037 Run `pnpm astro check` and `pnpm build` via `terminal-runner` (`0` errors, static HTML generated for `/learn/ml-for-beginners` and all 27 lessons)
- [x] T038 Run design & A11Y static checks (`uv run --with "buddhi-ai[MCP]" python .agents/skills/design-md/scripts/detect_design_md.py --lint` and `buddhi scripts verify-a11y`) via `terminal-runner`
- [x] T039 Clean up temporary workspace verification script `verify_course_03.py` and confirm clean git status
