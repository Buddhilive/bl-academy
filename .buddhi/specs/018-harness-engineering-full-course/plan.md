# Implementation Plan: Course 07 — Harness Engineering (`harness-engineering`)

**Branch**: `018-harness-engineering-full-course` | **Date**: 2026-11-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/.buddhi/specs/018-harness-engineering-full-course/spec.md`

---

## Summary

Deliver the complete 24-lesson **Course 07 — Harness Engineering (`harness-engineering`)** curriculum on **Buddhilive Academy**, positioned between Course 06 (`ai-agents-for-beginners`) and Course 08 (`edge-ai-for-beginners`). Ground every lesson in the 14 theoretical lectures, 8 progressive hands-on projects, resource library templates, `harness-creator` skill patterns, and 4 frontier harness breakdowns from the reference curriculum—while aligning all agent customization, rules, progressive disclosure skills, lifecycle hooks, plugins, MCP integrations, subagents, worktrees, and loop/graph orchestration with **Google Antigravity** (`https://antigravity.google/docs/features/`).

Each of the 24 lessons will be delivered as:
1. An interactive `.mdx` tutorial/reference page in `src/content/lessons/harness-engineering/` authored in the `my-writing-style` voice (350+ words of clear prose, Mermaid diagrams, KaTeX formulas, reference tables, an in-browser Pyodide `<PythonRunner client:visible />` simulation with `expectedOutput`, a `<ColabButton />`, and a `<QuizCard client:visible />`).
2. A self-contained companion Google Colab notebook in `notebook/harness-engineering/` (`.ipynb`, `nbformat: 4`) configured for **Google Colab Free Tier** (CPU) and **Google AI Studio Free Tier** (`GEMINI_API_KEY` via `google-genai` SDK with `gemini-2.5-flash` and deterministic offline fallback), adapting the 8 progressive projects into an open-source **Python + FastAPI/Gradio + SQLite/ChromaDB Knowledge Base** engineered and verified through Google Antigravity harness artifacts.
3. An updated curriculum registry in `src/lib/curriculum.ts` setting `plannedLessonCount: 24`, adding `'In-Browser Pyodide'` to `runtimeBadges`, and listing the 5 structured `syllabusModules`.

---

## Technical Context

- **Language/Version**: TypeScript 5.9.3 / Astro 7.4.4 / React 19.3.1 (SSG platform); Python 3.11+ / Pyodide v0.26+ (in-browser Web Worker & Google Colab Free Tier notebooks)
- **Primary Dependencies**:
  - Platform: `astro`, `@astrojs/mdx`, `@astrojs/react`, `@astrojs/tailwind`, `katex`, `rehype-katex`, `remark-math`, `@uiw/react-codemirror`
  - Colab Notebooks: `google-genai` (`GEMINI_API_KEY`), `google-antigravity` (Python SDK concepts), `fastapi`, `gradio`, `chromadb`, `langgraph`, `pytest`, Python standard library (`sqlite3`, `json`, `ast`, `re`, `dataclasses`, `hashlib`, `time`)
- **Storage**: Static MDX Content Layer (`src/content/lessons/harness-engineering/*.mdx`), static Jupyter notebooks (`notebook/harness-engineering/*.ipynb`), client-side Pathfinder XP progress (`localStorage` / Supabase island)
- **Testing & Verification**:
  - `pnpm astro check` (Astro & TypeScript typecheck + Zod frontmatter schema validation)
  - `pnpm build` (Full production SSG build verifying all 24 `/learn/harness-engineering/*` routes and KaTeX/Mermaid rendering)
  - Python verification script validating all 24 `.mdx` lessons ($\ge 350$ prose words, zero `.ref/` mentions, zero unescaped `$` currency collisions, `ast.parse` + execution of all 24 `<PythonRunner />` `initialCode` blocks against `expectedOutput`) and all 24 `.ipynb` files (valid JSON `nbformat: 4`, `ast.parse` of all code cells)
  - `buddhi scripts verify-a11y` & `detect_design_md.py --lint` (WCAG 2.2 AA & design token gate)
- **Target Platform**: Static Web SSG (Astro + Web Worker Pyodide WASM) & Google Colab Free Tier (CPU + Google AI Studio Free Tier)
- **Project Type**: Interactive STEM Educational Web Application & Curriculum Repository
- **Performance Goals**:
  - Static lesson HTML renders with 0 bytes of blocking main-thread execution JS (`client:visible` islands only)
  - Every `<PythonRunner />` snippet executes in `< 1.0` second inside Pyodide (well within the hard 5-second Web Worker timeout)
  - Zero Cumulative Layout Shift ($\text{CLS} = 0$) via fixed-height AdSense slots (`AdSlot.astro`)
- **Constraints**:
  - Zero mention of `.ref/` or upstream repositories in lesson prose or notebooks (credits live exclusively in `ACKNOWLEDGEMENTS.md`)
  - No proprietary Microsoft Foundry / Azure dependencies or local GUI Electron requirements in runnable labs
  - Full WCAG 2.2 Level AA compliance across Light (`#A7452A` on `#FFFFFF`, 5.95:1) and Dark (`#E07A5F` on `#121212`, 6.35:1) themes
- **Scale/Scope**: 24 new `.mdx` lesson files, 24 new `.ipynb` Colab notebooks, 1 curriculum registry update (`src/lib/curriculum.ts`), and accessibility evidence update (`REPORT.md` / `A11Y-DECISIONS.md`).

---

## Multi-Angle Architectural Evaluation & System Design (`system-design`)

### 1. Three Architectural Lenses
- **Fewest-Slices Lens**: Reuse existing, battle-tested layout and island components (`LessonLayout.astro`, `LessonSidebar.astro`, `PythonRunner.tsx`, `ColabButton.astro`, `QuizCard.tsx`) with zero new UI component churn. Only `src/lib/curriculum.ts` needs a metadata update while the 24 `.mdx` lessons and 24 `.ipynb` notebooks slot directly into Astro's Content Layer (`src/content.config.ts`).
- **Risk-First Lens**:
  1. *MDX / KaTeX Dollar-Sign Collision Risk*: Lectures 01, 09, 11, 13, and 14 cite real-world run costs (`\$9`, `\$200`, `\$124.70`). In `remark-math`, two unescaped `$` in the same paragraph trigger math mode and corrupt rendering. **Mitigation**: Escape all currency `$` as `\$` in prose and validate mechanically.
  2. *Pyodide Sandbox Execution Risk*: Harness engineering involves file systems, git worktrees, shell hooks (`hooks.json`), and LLM loops. Running subprocesses or network calls in Pyodide fails or times out. **Mitigation**: All in-browser `<PythonRunner />` examples model the harness state machines, pass-gate verifiers, AST architectural linters, protojson hook handlers, compaction calculators, and graph routers in pure in-memory Python (`dataclasses`, `json`, `ast`, `re`, `sqlite3`) with deterministic `expectedOutput`. Full `google-genai` and multi-file disk/git executions run in the companion `.ipynb` Colab notebooks (with offline fallback when `GEMINI_API_KEY` is absent).
  3. *Component Prop Contract Risk*: Verified against `src/content/lessons/ai-agents-for-beginners/19-securing-ai-agents-with-cryptographic-receipts.mdx`, `PythonRunner.tsx`, and `QuizCard.tsx`:
     - `PythonRunner` uses `initialCode={...}` and `expectedOutput="..."` (not `code`).
     - `QuizCard` uses `correctAnswer={number}` (0-based index, not `correctIndex`).
     - `ColabButton` is a default Astro import from `'../../../components/static/ColabButton.astro'` with `course="harness-engineering"`, `notebook="<slug>.ipynb"`, `runtime="Free Tier CPU"`.
- **Seam-Quality Lens**: Clean separation between in-browser deterministic harness physics (`<PythonRunner />`) and cloud/Colab execution (`notebook/harness-engineering/*.ipynb`), with 1:1 slug parity between `src/content/lessons/harness-engineering/<slug>.mdx` and `notebook/harness-engineering/<slug>.ipynb`.

### 2. Structural Trade-Off Analysis (`system-design`): Adapting the 8 Progressive Projects
- **Alternative A (Rejected)**: Keep the upstream TypeScript + Electron desktop app verbatim in prose and skip runnable Python code for Projects 01–08. *Rejected because* learners cannot run Electron GUI windows inside Pyodide or headless Google Colab Free Tier notebooks, violating Principle 3 & 4 of `AGENTS.md`.
- **Alternative B (Selected)**: Adapt the 8 progressive projects to an open-source **Python Knowledge Base & Grounded Q&A Application** (using `sqlite3` / JSON document store, text chunking + metadata indexing, `google-genai` `gemini-2.5-flash` grounded Q&A with citations, structured Python logger, AST/regex architecture boundary guard, multi-turn conversation history, and `LangGraph` / Google Antigravity workflow orchestration) wrapped in authentic **Google Antigravity** harness artifacts (`AGENTS.md`, `GEMINI.md`, `init.sh`, `feature_list.json`, `PROGRESS.md`, `DECISIONS.md`, `session-handoff.md`, `clean-state-checklist.md`, `sprint-contract.md`, `evaluator-rubric.md`, `.agents/hooks.json`, `goal.md`, `loop-state.md`, `graph.md`). *Selected because* every single project runs 100% end-to-end in both Pyodide and Google Colab Free Tier while teaching the exact same harness engineering invariants (WIP=1, pass-state gating, architectural boundary checks, 3-role planner/generator/evaluator separation, capstone ablation, autonomous loops, and execution graphs).

---

## AGENTS.md & DESIGN.md Compliance Check

*GATE: Passed.*

- [x] **9-Course Sequential Learning Path & Grounding**: Connects `06 ai-agents-for-beginners` → `07 harness-engineering` → `08 edge-ai-for-beginners` via `src/lib/curriculum.ts` and `prerequisites` frontmatter (`["ai-agents-for-beginners/19-securing-ai-agents-with-cryptographic-receipts"]` on Lesson 01, chained sequentially through Lesson 24).
- [x] **Zero `.ref/` Mentions**: All 24 `.mdx` lessons and 24 `.ipynb` notebooks are grounded in the reference repo and official Google Antigravity docs (`https://antigravity.google/docs/features/`) without ever citing `.ref/` in prose. Upstream credit already resides in `ACKNOWLEDGEMENTS.md`.
- [x] **W3Schools + `my-writing-style` + Pathfinder Contract**: Every lesson uses `.agents/skills/my-writing-style/SKILL.md`, validates against `src/content.config.ts`, includes 350+ words of prose, Mermaid diagrams, KaTeX formulas, `<PythonRunner client:visible />`, `<ColabButton />`, reference tables, and `<QuizCard client:visible />`.
- [x] **Open-Source Colab Free Tier & Google AI Studio Free Tier Stack**: Uses `GEMINI_API_KEY` (`google-genai`) with step-by-step setup instructions and offline fallback; companion notebooks live in `./notebook/harness-engineering/<lesson_slug>.ipynb`.
- [x] **Zero-Backend Browser Execution**: Pure client-side Pyodide execution via `<PythonRunner client:visible />` with zero server-side execution dependencies.
- [x] **DESIGN.md & WCAG 2.2 AA Integrity**: Reuses existing accessible components (`PythonRunner`, `ColabButton`, `QuizCard`, `LessonLayout`) adhering to `#A7452A` / `#E07A5F` terracotta tokens and fixed-height `AdSlot` containers.

---

## Accessibility Strategy (A11Y.md & DESIGN.md)

1. **Compliance Profile**: **Standard (WCAG 2.2 Level AA)** per `.agents/rules/a11y.md` and `.agents/skills/a11y/SKILL.md`.
2. **Component Reuse & Semantic Structure**:
   - Reuse verified accessible islands: `PythonRunner.tsx` (Decision 1 Escape focus release, Decision 3 polite live region, Decision 4 reduced-motion confetti guard), `QuizCard.tsx` (Decision 2 `role="radiogroup"` and `role="radio"` with `aria-checked`), and `ColabButton.astro` (Decision 8 & 9 forced-colors-safe `:focus-visible` outline, `44px` minimum touch target, and `<span class="sr-only"> (opens in a new tab)</span>`).
   - Maintain strict heading hierarchy inside all 24 `.mdx` files: `LessonLayout.astro` renders the page `<h1>`, so lesson prose MUST use `<h2>` (`##`) for primary sections and `<h3>` (`###`) for subsections without skipping levels.
   - Format all reference/comparison tables using standard GitHub-Flavored Markdown tables so Astro outputs semantic `<table>`, `<thead>`, `<th scope="col">`, and `<tbody>`.
3. **Contrast & Governance Verification**:
   - Primary terracotta `#A7452A` on `#FFFFFF` = **5.95:1** (Pass AA $\ge 4.5:1$); Dark mode `#E07A5F` on `#121212` = **6.35:1** (Pass AA $\ge 4.5:1$).
   - Run `buddhi scripts verify-a11y` and `uv run --with "buddhi-ai[MCP]" python .agents/skills/design-md/scripts/detect_design_md.py --lint` via `terminal-runner`, and update `REPORT.md` / `A11Y-DECISIONS.md` with release evidence.

---

## Project Structure

### Documentation (this feature)

```text
.buddhi/specs/018-harness-engineering-full-course/
├── spec.md              # Feature specification (24 lessons, P1-P4 user stories, FR-001..008, SC-001..005)
├── plan.md              # This architectural implementation plan
└── tasks.md             # Actionable task list organized by user story (/spec-tasks output)
```

### Source Code & Content Layout (repository root)

```text
src/
├── lib/
│   └── curriculum.ts                                                                    # Update Course 07 metadata (plannedLessonCount: 24, 5 syllabusModules, runtimeBadges)
└── content/
    └── lessons/
        └── harness-engineering/
            ├── 01-why-capable-agents-still-fail.mdx                                     # Module 1 (Order 1)
            ├── 02-what-a-harness-actually-is.mdx                                        # Module 1 (Order 2)
            ├── 03-project-01-prompt-only-vs-rules-first-harness.mdx                     # Module 1 (Order 3)
            ├── 04-repository-as-system-of-record.mdx                                    # Module 2 (Order 4)
            ├── 05-splitting-instructions-and-progressive-disclosure.mdx                 # Module 2 (Order 5)
            ├── 06-project-02-agent-readable-workspace-and-handoffs.mdx                  # Module 2 (Order 6)
            ├── 07-multi-session-continuity-and-context-anxiety.mdx                      # Module 3 (Order 7)
            ├── 08-dedicated-initialization-phase.mdx                                    # Module 3 (Order 8)
            ├── 09-task-boundaries-and-wip-limits.mdx                                    # Module 3 (Order 9)
            ├── 10-feature-lists-as-harness-primitives.mdx                               # Module 3 (Order 10)
            ├── 11-project-03-multi-session-continuity-and-pass-gating.mdx               # Module 3 (Order 11)
            ├── 12-project-04-runtime-feedback-and-architecture-guards.mdx               # Module 3 (Order 12)
            ├── 13-preventing-premature-victory-and-confidence-calibration.mdx           # Module 4 (Order 13)
            ├── 14-end-to-end-verification-and-agent-oriented-errors.mdx                 # Module 4 (Order 14)
            ├── 15-project-05-role-separation-and-grounded-qa-verification.mdx           # Module 4 (Order 15)
            ├── 16-runtime-and-process-observability.mdx                                 # Module 4 (Order 16)
            ├── 17-clean-session-exits-and-entropy-control.mdx                           # Module 4 (Order 17)
            ├── 18-project-06-capstone-complete-agent-harness-and-ablation.mdx           # Module 4 (Order 18)
            ├── 19-loop-engineering-from-manual-prompting-to-autonomous-loops.mdx        # Module 5 (Order 19)
            ├── 20-project-07-building-automated-goal-timer-and-maker-checker-loops.mdx  # Module 5 (Order 20)
            ├── 21-graph-engineering-nodes-edges-shared-state-and-routing.mdx            # Module 5 (Order 21)
            ├── 22-project-08-multi-agent-graph-workflows-parallelism-and-hitl.mdx       # Module 5 (Order 22)
            ├── 23-google-antigravity-harness-architecture-deep-dive.mdx                 # Module 5 (Order 23)
            └── 24-frontier-harness-design-breakdowns-claude-code-codex-deepseek-and-pi.mdx # Module 5 (Order 24)

notebook/
└── harness-engineering/
    ├── 01-why-capable-agents-still-fail.ipynb
    ├── 02-what-a-harness-actually-is.ipynb
    ├── 03-project-01-prompt-only-vs-rules-first-harness.ipynb
    ├── 04-repository-as-system-of-record.ipynb
    ├── 05-splitting-instructions-and-progressive-disclosure.ipynb
    ├── 06-project-02-agent-readable-workspace-and-handoffs.ipynb
    ├── 07-multi-session-continuity-and-context-anxiety.ipynb
    ├── 08-dedicated-initialization-phase.ipynb
    ├── 09-task-boundaries-and-wip-limits.ipynb
    ├── 10-feature-lists-as-harness-primitives.ipynb
    ├── 11-project-03-multi-session-continuity-and-pass-gating.ipynb
    ├── 12-project-04-runtime-feedback-and-architecture-guards.ipynb
    ├── 13-preventing-premature-victory-and-confidence-calibration.ipynb
    ├── 14-end-to-end-verification-and-agent-oriented-errors.ipynb
    ├── 15-project-05-role-separation-and-grounded-qa-verification.ipynb
    ├── 16-runtime-and-process-observability.ipynb
    ├── 17-clean-session-exits-and-entropy-control.ipynb
    ├── 18-project-06-capstone-complete-agent-harness-and-ablation.ipynb
    ├── 19-loop-engineering-from-manual-prompting-to-autonomous-loops.ipynb
    ├── 20-project-07-building-automated-goal-timer-and-maker-checker-loops.ipynb
    ├── 21-graph-engineering-nodes-edges-shared-state-and-routing.ipynb
    ├── 22-project-08-multi-agent-graph-workflows-parallelism-and-hitl.ipynb
    ├── 23-google-antigravity-harness-architecture-deep-dive.ipynb
    └── 24-frontier-harness-design-breakdowns-claude-code-codex-deepseek-and-pi.ipynb
```

**Structure Decision**: Matches the exact Astro Content Layer and companion notebook convention established by Courses 01–06 (`src/content/lessons/<track>/<slug>.mdx` + `notebook/<track>/<slug>.ipynb`).Note that `entry.id` in Astro's glob loader (`base: './src/content/lessons'`) resolves to `harness-engineering/<slug>`, which `LessonLayout.astro`, `LessonSidebar.astro`, and `src/pages/learn/[track]/[...slug].astro` automatically route to `/learn/harness-engineering/harness-engineering/<slug>`.

---

## Complexity Tracking

No `AGENTS.md` or `DESIGN.md` violations exist; zero architectural exceptions required.
