# Tasks: Course 02 — Data Science for Beginners (`data-science-for-beginners`)

**Input**: Design documents from `.buddhi/specs/012-create-full-course/`
**Prerequisites**: [spec.md](file:///C:/DevDojo/Buddhi/bl-academy/.buddhi/specs/012-create-full-course/spec.md), [plan.md](file:///C:/DevDojo/Buddhi/bl-academy/.buddhi/specs/012-create-full-course/plan.md)

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 [P] Create course directories `src/content/lessons/data-science-for-beginners/` and `notebook/data-science-for-beginners/`
- [x] T002 [P] Create automated course verification script `verify_course_02.py` validating frontmatter schema, word count (`>= 350` words), `<PythonRunner />` `initialCode` vs `expectedOutput` execution, `<ColabButton />` & `<QuizCard />` presence, `nbformat == 4` `.ipynb` JSON validity, and zero forbidden `.ref/` or proprietary Azure/Cosmos DB terms

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T003 Update `data-science-for-beginners` entry in `src/lib/curriculum.ts` (`plannedLessonCount: 20`, `runtimeBadges` including `'Google AI Studio Free Tier'`, `usesGeminiApi: true`, and 4 `syllabusModules` matching Lessons `01`–`20`)

## Phase 3: User Story 1 - Module 1: Data Foundations, Ethics, Taxonomies & Probability/Statistics (Priority: P1) 🎯 MVP

- [x] T004 [P] [US1] Author Lesson 01 in `src/content/lessons/data-science-for-beginners/01-defining-data-science.mdx` (including Colab & Google AI Studio `GEMINI_API_KEY` setup)
- [x] T005 [P] [US1] Create Colab notebook `notebook/data-science-for-beginners/01-defining-data-science.ipynb`
- [x] T006 [P] [US1] Author Lesson 02 in `src/content/lessons/data-science-for-beginners/02-data-science-ethics.mdx`
- [x] T007 [P] [US1] Create Colab notebook `notebook/data-science-for-beginners/02-data-science-ethics.ipynb`
- [x] T008 [P] [US1] Author Lesson 03 in `src/content/lessons/data-science-for-beginners/03-defining-data.mdx`
- [x] T009 [P] [US1] Create Colab notebook `notebook/data-science-for-beginners/03-defining-data.ipynb`
- [x] T010 [P] [US1] Author Lesson 04 in `src/content/lessons/data-science-for-beginners/04-statistics-and-probability.mdx`
- [x] T011 [P] [US1] Create Colab notebook `notebook/data-science-for-beginners/04-statistics-and-probability.ipynb`
- [x] T012 [US1] Verify US1 MVP slice via `verify_course_02.py` and `pnpm astro check`

## Phase 4: User Story 2 - Module 2: Working with Relational SQL, Non-Relational JSON/NoSQL, Pandas & Data Preparation (Priority: P2)

- [x] T013 [P] [US2] Author Lesson 05 + notebook (`05-working-with-relational-data` with `sqlite3` `cities`/`rainfall` & `airports.db` `INNER JOIN` queries)
- [x] T014 [P] [US2] Author Lesson 06 + notebook (`06-working-with-nosql-data` with open-source `TinyDB`/`DuckDB`/JSON document querying on `PersonsData.json` & `TwitterData.json`)
- [x] T015 [P] [US2] Author Lesson 07 + notebook (`07-working-with-python-and-pandas` with Pandas `Series`/`DataFrame`, JHU COVID spread, and CORD-19 medical entity extraction via `google-genai`)
- [x] T016 [P] [US2] Author Lesson 08 + notebook (`08-data-preparation-and-cleaning` with Iris & `form.csv` `NaN`/`None` imputation and `drop_duplicates`)
- [x] T017 [US2] Verify US2 slice via `verify_course_02.py`

## Phase 5: User Story 3 - Module 3: Exploratory & Meaningful Data Visualization (Priority: P3)

- [x] T018 [P] [US3] Author Lesson 09 + notebook (`09-visualizing-quantities` with self-contained Minnesota `birds.csv` & Matplotlib line/scatter/bar charts)
- [x] T019 [P] [US3] Author Lesson 10 + notebook (`10-visualizing-distributions` with self-contained `birds.csv` histograms, 2D histograms & Seaborn `kdeplot`)
- [x] T020 [P] [US3] Author Lesson 11 + notebook (`11-visualizing-proportions` with self-contained `mushrooms.csv` pie, donut & `PyWaffle` charts)
- [x] T021 [P] [US3] Author Lesson 12 + notebook (`12-visualizing-relationships` with self-contained USDA `honey.csv` Seaborn `relplot`, `FacetGrid` & `ax.twinx()`)
- [x] T022 [P] [US3] Author Lesson 13 + notebook (`13-meaningful-visualizations` with deceptive chart diagnostics, 3D plots & `NetworkX`/`Plotly` *Les Liaisons Dangereuses* network graph)
- [x] T023 [US3] Verify US3 slice via `verify_course_02.py`

## Phase 6: User Story 4 - Module 4: Data Science Lifecycle, Open-Source Cloud AutoML/Gradio, Scikit-Learn Pipelines & Real-World Applications (Priority: P4)

- [x] T024 [P] [US4] Author Lesson 14 + notebook (`14-data-science-lifecycle-introduction` with TDSP vs CRISP-DM & hot/cold storage)
- [x] T025 [P] [US4] Author Lesson 15 + notebook (`15-data-science-lifecycle-analyzing` with self-contained `emails.csv` EDA profiling, sampling & querying)
- [x] T026 [P] [US4] Author Lesson 16 + notebook (`16-data-science-lifecycle-communication` with 5 C's storytelling & Emerson case study)
- [x] T027 [P] [US4] Author Lesson 17 + notebook (`17-data-science-in-the-cloud` with Google Colab & Google AI Studio `GEMINI_API_KEY` streaming sentiment & medical paper extraction)
- [x] T028 [P] [US4] Author Lesson 18 + notebook (`18-low-code-data-science-and-automl` with Heart Failure Clinical Records open-source AutoML leaderboard & interactive `Gradio` web app)
- [x] T029 [P] [US4] Author Lesson 19 + notebook (`19-cloud-ml-sdk-and-pipelines` with programmatic `Scikit-Learn Pipeline`, `GridSearchCV`, `MLflow` tracking & `score.py` JSON endpoint)
- [x] T030 [P] [US4] Author Lesson 20 + notebook (`20-data-science-in-the-wild` with MIT *Gender Shades* audit, Emily Dickinson `google-genai` sentiment & `pystac-client` Earth observation, handing off to Course 03)
- [x] T031 [US4] Verify US4 slice via `verify_course_02.py`

## Phase 7: Polish & Cross-Cutting Verification

- [x] T032 Run full-course validation script `verify_course_02.py` across all 20 `.mdx` files and 20 `.ipynb` notebooks
- [x] T033 Run `pnpm astro check` and `pnpm build` (`0` errors, static HTML generated for `/learn/data-science-for-beginners` and all 20 lessons)
- [x] T034 Run design & A11Y static checks (`uv run --with "buddhi-ai[MCP]" python .agents/skills/design-md/scripts/detect_design_md.py --lint` and `buddhi scripts verify-a11y`)
- [x] T035 Clean up temporary workspace verification script `verify_course_02.py` and confirm clean status
