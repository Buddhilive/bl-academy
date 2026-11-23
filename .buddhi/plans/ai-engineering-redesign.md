# Implementation Plan: 9-Course Sequential AI Engineering Curriculum & Astro UI Redesign

> **Plan Path**: `.buddhi/plans/ai-engineering-redesign.md`  
> **Scope for Current Session**: Replan the project direction, remove the deprecated 6-phase curriculum and its generated courses/notebooks, update project memory (`.agents/memory/`), update `AGENTS.md` and `.agents/rules/buddhilive-academy.md`, create `ACKNOWLEDGEMENTS.md`, and redesign the Astro UI components and pages (`src/lib/curriculum.ts`, `src/pages/index.astro`, `src/pages/learn/[track]/index.astro`, `src/pages/learn/[track]/[...slug].astro`, `src/layouts/LessonLayout.astro`, `src/components/static/LessonSidebar.astro`, `src/components/static/ColabButton.astro`, `src/components/islands/LessonProgressPanel.tsx`, `src/components/islands/LessonFooter.tsx`).  
> **Out of Scope for Current Session**: Writing the individual `.mdx` tutorial pages and `.ipynb` Google Colab notebooks for Courses 01–08 (to be authored course-by-course in subsequent implementation passes following the new manifest).

---

## 1. Architecture & System Design Decisions

Following the `system-design` skill framework, we evaluated how to represent the 9 connected courses (Course 00 Python + Courses 01–08 AI Engineering) inside Astro's Content Collections and UI routing:

- **Option A (Chosen): 9 Distinct Sequential Tracks (`track` per course) + Central Curriculum Registry (`src/lib/curriculum.ts`) + Course Syllabus Hub (`src/pages/learn/[track]/index.astro`)**
  - *Pros*: Preserves clean `/learn/<course_track>/<lesson_slug>` URLs, keeps each course's sidebar focused on its own modules/categories while adding explicit "Prerequisite Course" and "Up Next in Path" bridges, aligns 1:1 with `./notebook/<course_name>/` folders, and allows courses with 0 authored `.mdx` files to render a rich Course Syllabus Preview Hub at `/learn/<course_track>` without 404s.
  - *Cons*: Requires passing full lesson collection metadata to `LessonLayout.astro` so boundary lessons (`currentIndex === 0` or `trackLessons.length - 1`) can link across tracks.
- **Option B: Single Monolithic `ai-engineering` Track**
  - *Pros*: Simple single-array sorting.
  - *Cons*: Produces a 150+ item sidebar that is unnavigable on desktop and mobile, blurs course boundaries, and breaks 1:1 alignment with `./notebook/<course_name>/`.

---

## 2. The 9-Course Sequential Learning Path & Grounding Rules

Starting from the existing **Python** course (`track: "python"`, folder `src/content/lessons/python-zero-to-hero/`), every course connects sequentially to the next:

| Step | Track ID & Notebook Folder (`<course_name>`) | Course Title | Grounding Reference Repo (`.ref/`) | Planned Lessons | Execution & Cloud Stack |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **00** | `python` (`python-zero-to-hero`) | **Python Zero to Hero** | `/docs` (Existing 12 lessons preserved) | 12 (Live) | In-Browser Pyodide (`<PythonRunner client:visible />`) |
| **01** | `ai-for-beginners` | **AI for Beginners** | `.ref/AI-For-Beginners` | 24 | In-Browser Pyodide + Colab Free CPU/T4 GPU (`PyTorch`, `OpenCV`, ` Transformers`) |
| **02** | `data-science-for-beginners` | **Data Science for Beginners** | `.ref/Data-Science-For-Beginners` | 20 | In-Browser Pyodide + Colab Free CPU (`Pandas`, `SQLite`, `Matplotlib`, `Seaborn`) |
| **03** | `ml-for-beginners` | **ML for Beginners** | `.ref/ML-For-Beginners/ML-For-Beginners-main` | 26 | In-Browser Pyodide + Colab Free CPU (`Scikit-Learn`, `Statsmodels`, `Flask/Gradio`) |
| **04** | `generative-ai-for-beginners` | **Generative AI for Beginners** | `.ref/generative-ai-for-beginners` | 21 | Google AI Studio Free Tier (`GEMINI_API_KEY` via `google-genai`) + Colab Free CPU/T4 GPU (`ChromaDB`, `PEFT/LoRA`) |
| **05** | `mcp-for-beginners` | **MCP for Beginners** | `.ref/mcp-for-beginners` | 13 | Google AI Studio Free Tier + Local/Colab (`mcp` Python SDK, `FastMCP`, JSON-RPC 2.0) |
| **06** | `ai-agents-for-beginners` | **AI Agents for Beginners** | `.ref/ai-agents-for-beginners/ai-agents-for-beginners-main` | 18 | Google AI Studio Free Tier + Colab Free CPU (`google-genai`, `LangGraph` / pure Python loops, `ChromaDB`, `MCP`) |
| **07** | `harness-engineering` | **Harness Engineering** | `.ref/learn-harness-engineering/learn-harness-engineering-main` | 22 (14 Lectures + 8 Projects) | Google AI Studio Free Tier + Local/Colab (`AGENTS.md`, `init.sh`, `feature_list.json`, `pytest` verification gates, loop & graph runners) |
| **08** | `edge-ai-for-beginners` | **Edge AI for Beginners** | `.ref/edgeai-for-beginners/edgeai-for-beginners-main` | 20 | Colab Free T4 GPU + Local (`HuggingFace SLMs`, `Phi/Qwen/Gemma`, `llama.cpp`, `GGUF`, `ONNX Runtime`, `OpenVINO`) |

### Authoring & Adaptation Invariants (Enforced in `AGENTS.md`, `.agents/rules/buddhilive-academy.md`, and `.agents/memory/`)
1. **100% Reference Grounding & Full Lesson Depth**:
   - Every course's lessons must be grounded in its corresponding `.ref/` repository (and `/docs` for Python), covering all detailed conceptual explanations, mathematical formulations, architecture diagrams, code walkthroughs, and exercises from the reference lessons.
2. **No Reference Repo Mentions in Lesson Prose (`ACKNOWLEDGEMENTS.md` Policy)**:
   - Tutorials and UI lesson pages must **never** mention `.ref/` paths or the upstream GitHub repositories inside lesson text.
   - Instead, a root `ACKNOWLEDGEMENTS.md` file (and a dedicated `/acknowledgements` or footer section) credits all upstream open-source repositories with their real GitHub links and MIT licenses.
3. **Signature Voice (`my-writing-style` Skill)**:
   - All tutorial prose must be authored using `.agents/skills/my-writing-style/SKILL.md` (accessible enthusiast, conversational first-person touches, direct opening hook, clean H2 sections, structured highlights, grounded technical context, zero corporate/AI slop).
4. **Open-Source & Google Free-Tier Cloud Replacement Policy**:
   - Where reference lessons use Microsoft Foundry, Azure AI Studio, Azure OpenAI, Azure AI Search, Azure Container Apps, or Microsoft Olive/Foundry Local:
     - Replace cloud LLM/Embedding calls with **Google AI Studio Free Tier** (`GEMINI_API_KEY` using `google-genai` SDK and `gemini-2.5-flash` / `text-embedding-004`).
     - Include a clear, step-by-step **Google AI Studio API Key Guide** (how to create a free key at `aistudio.google.com` and store it in Google Colab Secrets via `google.colab.userdata.get('GEMINI_API_KEY')`).
     - Replace proprietary cloud infrastructure with open-source frameworks executable on the **free tier of Google Colab** (`ChromaDB` / `FAISS` instead of Azure AI Search; `LangGraph` / `FastMCP` / `google-genai` instead of Azure AI Agent Service; `llama.cpp` / `HuggingFace Transformers` / `PEFT` / `ONNX Runtime` instead of Foundry Local / Olive).
5. **Google Colab Notebook Contract**:
   - Companion notebooks live in `./notebook/<course_name>/<lesson_slug>.ipynb`.
   - Linked in lessons via `<ColabButton course="<course_name>" notebook="<lesson_slug>.ipynb" runtime="..." />` pointing to `https://colab.research.google.com/github/buddhilive/bl-academy/blob/main/notebook/<course_name>/<lesson_slug>.ipynb`.

---

## 3. Ordered Implementation Steps

### Phase A: Cleanup of Deprecated 6-Phase Curriculum & Courses
1. **Delete deprecated lesson folders**:
   - Remove `src/content/lessons/data-foundations-and-classical-ml/` (8 `.mdx` files).
   - Remove `src/content/lessons/math-and-neural-nets/` (6 `.mdx` files).
2. **Delete deprecated notebook folders**:
   - Remove `notebook/data-foundations-and-classical-ml/` (8 `.ipynb` files).
   - Remove `notebook/math-and-neural-nets/` (6 `.ipynb` files).
3. **Delete deprecated memory nodes**:
   - Remove `.agents/memory/decisions/002-ai-engineer-6-phase-curriculum.md`.
   - Remove `.agents/memory/conventions/ai-engineer-curriculum-manifest.md`.
   - Preserve `src/content/lessons/python-zero-to-hero/` (`01-setting-up-python.mdx` .. `12-installing-third-party-packages-with-pip.mdx`).

### Phase B: Project Memory, Context Rules & `ACKNOWLEDGEMENTS.md`
1. **Create `ACKNOWLEDGEMENTS.md` (Project Root)**:
   - Credit the upstream open-source projects and educators that inspire and ground Buddhilive Academy's AI Engineering learning path, with direct links to their GitHub repositories:
     - [AI Engineering from Scratch](https://github.com/rohitg00/ai-engineering-from-scratch) by Rohit Ghumare & contributors
     - [AI for Beginners](https://github.com/microsoft/AI-For-Beginners)
     - [Data Science for Beginners](https://github.com/microsoft/Data-Science-For-Beginners)
     - [Machine Learning for Beginners](https://github.com/microsoft/ML-For-Beginners)
     - [Generative AI for Beginners](https://github.com/microsoft/generative-ai-for-beginners)
     - [Model Context Protocol (MCP) for Beginners](https://github.com/microsoft/mcp-for-beginners)
     - [AI Agents for Beginners](https://github.com/microsoft/ai-agents-for-beginners)
     - [Learn Harness Engineering](https://github.com/walkinglabs/learn-harness-engineering)
     - [Edge AI for Beginners](https://github.com/microsoft/edgeai-for-beginners)
2. **Update `.agents/memory/`**:
   - Create `.agents/memory/decisions/002-9-course-ai-engineering-learning-path.md`: Records the architectural decision to replace the 6-phase curriculum with the 9-course sequential learning path (`python` + 8 AI Engineering courses), the open-source Colab + Google AI Studio free-tier replacement rule, the `my-writing-style` requirement, and the `ACKNOWLEDGEMENTS.md` attribution policy.
   - Create `.agents/memory/conventions/ai-engineering-8-course-manifest.md`: Full module-by-module and lesson-by-lesson syllabus manifest for all 8 courses mapped to their exact `.ref/` source files, target notebook paths (`./notebook/<course_name>/`), runtime tiers (`Colab CPU`, `Colab T4 GPU`, `In-Browser Pyodide`), and open-source/Gemini replacements.
   - Update `.agents/memory/MEMORY.md`, `.agents/memory/decisions/index.md`, and `.agents/memory/conventions/index.md`.
3. **Update `AGENTS.md` and `.agents/rules/buddhilive-academy.md`**:
   - Update Grounding & Content Generation principles to document:
     - Grounding Python lessons in `/docs` and the 8 AI Engineering courses in their respective `.ref/` repositories.
     - Sequential learning path connection across all 9 tracks (`python` -> `ai-for-beginners` -> `data-science-for-beginners` -> `ml-for-beginners` -> `generative-ai-for-beginners` -> `mcp-for-beginners` -> `ai-agents-for-beginners` -> `harness-engineering` -> `edge-ai-for-beginners`).
     - Mandatory use of `my-writing-style` skill for tutorial prose.
     - Open-source Google Colab Free Tier + Google AI Studio Free Tier (`GEMINI_API_KEY`) replacement policy for all Microsoft Foundry / Azure services.
     - Companion Colab notebook convention (`./notebook/<course_name>/`) and `<ColabButton />` integration.
     - Prohibition on mentioning `.ref/` or reference repos inside lesson prose, directing all credits to `ACKNOWLEDGEMENTS.md`.

### Phase C: Astro Curriculum Registry & UI Components Redesign
1. **Create `src/lib/curriculum.ts`**:
   - Define `CURRICULUM_COURSES` (Courses `00` through `08`) with complete metadata (`order`, `stepCode`, `track`, `shortLabel`, `title`, `folder`, `notebookFolder`, `plannedLessonCount`, `runtimeBadges`, `prerequisiteTrack`, `nextTrack`, `summary`, `pedagogyFocus`, and `syllabusModules` listing the planned sections and lessons for each course).
   - Export helpers: `getCourseByTrack`, `getAdjacentCourses`, `resolveCourseEntryUrl`, and `GOOGLE_AI_STUDIO_GUIDE` metadata.
2. **Create Course Overview & Syllabus Preview Page (`src/pages/learn/[track]/index.astro`)**:
   - Generates static routes for all 9 tracks (`/learn/python`, `/learn/ai-for-beginners`, ..., `/learn/edge-ai-for-beginners`).
   - Displays the course header (`COURSE 00`..`08`), runtime badges, prerequisite course link, next course link, Google AI Studio API Key & Colab quick-setup drawer (when applicable), and either:
     - The live categorized lesson cards (with XP, difficulty, and "Start Course" CTA) when `.mdx` files are present, OR
     - The full planned module-by-module syllabus preview (grounded in the course manifest) with seamless "← Previous Course" and "Next Course in Path →" navigation so the 9-course chain is 100% browsable today.
3. **Update `src/pages/learn/[track]/[...slug].astro` (`lines 5–31`)**:
   - Pass all lessons (`allLessons: lessons`) to `LessonLayout.astro` so cross-course boundary links (`Course N` last lesson ↔ `Course N+1` first lesson or course hub) resolve automatically.
4. **Update `src/layouts/LessonLayout.astro` (`lines 18–137`)**:
   - Compute `prevUrl`/`nextUrl` across course boundaries using `getAdjacentCourses(entry.data.track)` and `resolveCourseEntryUrl`.
   - On the last lesson of a course (e.g., `python-zero-to-hero/12-installing-third-party-packages-with-pip`), `Next ❯` and `<LessonFooter>` automatically link to `Course 01: AI for Beginners` (`/learn/ai-for-beginners` or its first lesson once authored).
   - Pass `currentTrack={entry.data.track}` and `trackUrls` to `<LessonProgressPanel>`.
5. **Update `src/components/static/LessonSidebar.astro` (`lines 4–125`)**:
   - Show `Course {stepCode} of 08 • {course.title}` in the sidebar header.
   - Render a top prerequisite link (`← Prerequisite: Course {prevCourse.stepCode} {prevCourse.shortLabel}`) when `prevCourse` exists.
   - Render a bottom **"Next Course in Learning Path"** card (`Course {nextCourse.stepCode}: {nextCourse.title} →`) linking to the next course's entry URL.
6. **Update `src/components/islands/LessonProgressPanel.tsx` (`lines 10–172`) & `src/components/islands/LessonFooter.tsx`**:
   - Replace hardcoded `AVAILABLE_TRACKS` (`python`, `numpy`, `pandas`, `dsa`, `sql`, `ai`) with the 9 sequential courses from `CURRICULUM_COURSES`.
   - Highlight the active `currentTrack` dynamically and display `{activeCourse.shortLabel}: {completedCount}/{totalLessons} ({percentage}%)`.
   - Support `nextActionLabel` in `LessonFooter.tsx` (`src/types/islands.ts`) so completing the final lesson of a course displays `"Complete & Continue to Course 01: AI for Beginners"`.
7. **Update `src/components/static/ColabButton.astro` (`lines 1–46`)**:
   - Update default `course` prop to `'ai-for-beginners'` and ensure clean display of `notebook/${course}/${notebook} • ${runtime}`.
8. **Redesign Landing Page (`src/pages/index.astro`)**:
   - Inspired by `AI Engineering from Scratch` (`.ref/ai-engineering-from-scratch/site/index.html` and `learning-paths.html`) while maintaining `DESIGN.md` terracotta tokens (`#A7452A` / `#E07A5F`) and WCAG 2.2 AA contrast:
     - **Hero Masthead + "Start Where You Are" Router**: Two-column layout pairing the main value proposition with a 4-route entry selector (*New to Code → 00 Python*, *Python Dev New to AI → 01 AI for Beginners*, *Data & Classical ML → 02 Data Science & 03 ML*, *LLMs, MCP & Reliable Agents → 04 GenAI to 08 Edge AI*).
     - **4-Step Engineering Pedagogy & Free-Tier Runtime Strip**: Visual breakdown of how every lesson works (`01 The Problem` → `02 The Concept & Math` → `03 Try in Browser / Colab` → `04 Verify & Ship`) plus the 100% Free-Tier stack (In-Browser Pyodide, Google Colab Free CPU/T4 GPU, and Google AI Studio Free Tier API Key onboarding guide).
     - **Connected 9-Course Sequential Learning Path Spine (`#learning-path`)**: Ordered roadmap cards `00` through `08` showing course flow arrows, prerequisite chain, live/planned lesson counts, runtime badges, module highlights, and direct entry CTAs.
     - **Footer with Open-Source Acknowledgements**: Direct link/summary referencing `ACKNOWLEDGEMENTS.md`.

---

## 4. Files to Be Touched

| Action | File Path | Purpose |
| :--- | :--- | :--- |
| **DELETE** | `src/content/lessons/data-foundations-and-classical-ml/*` | Remove old Phase 1 lessons |
| **DELETE** | `src/content/lessons/math-and-neural-nets/*` | Remove old Phase 2 lessons |
| **DELETE** | `notebook/data-foundations-and-classical-ml/*` | Remove old Phase 1 notebooks |
| **DELETE** | `notebook/math-and-neural-nets/*` | Remove old Phase 2 notebooks |
| **DELETE** | `.agents/memory/decisions/002-ai-engineer-6-phase-curriculum.md` | Remove superseded 6-phase decision |
| **DELETE** | `.agents/memory/conventions/ai-engineer-curriculum-manifest.md` | Remove superseded 6-phase manifest |
| **CREATE** | `ACKNOWLEDGEMENTS.md` | Credit upstream open-source repositories with GitHub links |
| **CREATE** | `.agents/memory/decisions/002-9-course-ai-engineering-learning-path.md` | Record 9-course sequential architecture & policies |
| **CREATE** | `.agents/memory/conventions/ai-engineering-8-course-manifest.md` | Authoritative 8-course syllabus manifest mapped to `.ref/` |
| **EDIT** | `.agents/memory/MEMORY.md`, `decisions/index.md`, `conventions/index.md` | Sync OKF v0.2 memory indexes |
| **EDIT** | `AGENTS.md` | Update project principles for 9-course path, `.ref/` grounding, `my-writing-style`, Colab/Gemini free tier, and `ACKNOWLEDGEMENTS.md` |
| **EDIT** | `.agents/rules/buddhilive-academy.md` | Sync always-on workspace rule with `AGENTS.md` |
| **CREATE** | `src/lib/curriculum.ts` | Central 9-course learning path registry & cross-course helpers |
| **CREATE** | `src/pages/learn/[track]/index.astro` | Course overview & syllabus preview hub for all 9 tracks |
| **EDIT** | `src/pages/index.astro` | AI Engineering from Scratch-inspired landing page & 9-course roadmap |
| **EDIT** | `src/pages/learn/[track]/[...slug].astro` | Pass full lesson collection for cross-course navigation |
| **EDIT** | `src/layouts/LessonLayout.astro` | Cross-course Prev/Next boundary linking & dynamic track props |
| **EDIT** | `src/components/static/LessonSidebar.astro` | Course step header, prerequisite badge, and "Up Next in Path" card |
| **EDIT** | `src/components/static/ColabButton.astro` | Update default course folder prop |
| **EDIT** | `src/components/islands/LessonProgressPanel.tsx` | Dynamic 9-course horizontal selector & active track progress |
| **EDIT** | `src/components/islands/LessonFooter.tsx` & `src/types/islands.ts` | Support cross-course completion CTA labels |

---

## 5. Testing & Verification Plan

1. **Cleanup Verification**:
   - Confirm `src/content/lessons/data-foundations-and-classical-ml`, `src/content/lessons/math-and-neural-nets`, `notebook/data-foundations-and-classical-ml`, and `notebook/math-and-neural-nets` are absent, and `src/content/lessons/python-zero-to-hero` (12 lessons) is intact.
2. **TypeScript & Astro Content Schema Check**:
   - Run `pnpm astro check` via `terminal-runner` (must report `0 errors`).
3. **Production Static Build Check**:
   - Run `pnpm build` via `terminal-runner` to verify all 12 Python lesson pages, all 9 `/learn/[track]/index.html` course hub pages, and `/index.html` build cleanly with zero broken links.
4. **Accessibility, Design Tokens & Harness Checks**:
   - Run `buddhi scripts verify-a11y`.
   - Run `uv run --with "buddhi-ai[MCP]" python .agents/skills/design-md/scripts/detect_design_md.py --lint`.
   - Run `uv run --with "buddhi-ai[MCP]" python .agents/skills/agents-md/scripts/detect_agents_md.py --diff`.
