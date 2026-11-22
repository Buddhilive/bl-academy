---
description: "Actionable task list for Course 07: Harness Engineering (harness-engineering)"
---

# Tasks: Course 07 — Harness Engineering (`harness-engineering`)

**Input**: Design documents from `.buddhi/specs/018-harness-engineering-full-course/` (`spec.md`, `plan.md`)

**Format**: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (`US1`, `US2`, `US3`, `US4`)

---

## Phase 1: Setup (Directories & Verification Harness)

**Purpose**: Create the target lesson/notebook directories and verification script so every user story slice can be mechanically validated.

- [x] T001 Create target directories `src/content/lessons/harness-engineering/` and `notebook/harness-engineering/`
- [x] T002 [P] Create scratch verification script in `.buddhi/specs/018-harness-engineering-full-course/verify_course.py` to check: frontmatter schema fields, prose word count ($\ge 350$), `<PythonRunner />` `initialCode` syntax + execution against `expectedOutput`, `<ColabButton />` & `<QuizCard />` presence, zero `.ref/` mentions, zero unescaped currency `$` collisions, and valid `nbformat: 4` `.ipynb` JSON + `ast.parse()` of all code cells

---

## Phase 2: Foundational (Curriculum Registry Update)

**Purpose**: Update the central curriculum registry so Course 07 (`harness-engineering`) exposes the 24-lesson syllabus, runtime badges, and cross-course links (`ai-agents-for-beginners` → `harness-engineering` → `edge-ai-for-beginners`).

- [x] T003 Update `harness-engineering` entry in `src/lib/curriculum.ts` with `plannedLessonCount: 24`, `runtimeBadges: ['In-Browser Pyodide', 'Google AI Studio Free Tier', 'Colab Free CPU']`, and the 5 structured `syllabusModules`

**Checkpoint**: Foundation ready — `pnpm astro check` passes and `/learn/harness-engineering` displays all 5 modules and 24 planned lessons.

---

## Phase 3: User Story 1 — Harness Foundations, System of Record & Modular Instructions (Priority: P1) 🎯 MVP

**Goal**: Deliver Modules 1 & 2 (Lessons 01–06 + Projects 01–02) and their 6 companion Google Colab notebooks, establishing the 5-Subsystem Harness Model, Google AI Studio `GEMINI_API_KEY` onboarding, Repository as System of Record, and Google Antigravity progressive disclosure rules/skills.

**Independent Test**: Run `python verify_course.py --orders 1-6` and `pnpm astro check` to confirm Lessons 01–06 and Notebooks 01–06 pass all prose, Pyodide simulation, and schema checks.

### Implementation for User Story 1

- [x] T004 [P] [US1] Author Lesson 01 in `src/content/lessons/harness-engineering/01-why-capable-agents-still-fail.mdx` (Capability Gap, 5 failure modes, Verification Gap formula, Diagnostic Loop, Definition of Done, Google AI Studio `GEMINI_API_KEY` setup, Google Antigravity `AGENTS.md` + `/plan` intro)
- [x] T005 [P] [US1] Create Companion Notebook 01 in `notebook/harness-engineering/01-why-capable-agents-still-fail.ipynb` (`google-genai` setup with offline fallback, 5-layer failure attribution & Verification Gap diagnostic runner)
- [x] T006 [P] [US1] Author Lesson 02 in `src/content/lessons/harness-engineering/02-what-a-harness-actually-is.mdx` (5-Subsystem Harness Model $\mathcal{H} = \langle I, T, E, S, F \rangle$, "Repo IS the Spec," "Give a Map, Not a Manual," Gulf of Execution vs. Evaluation, Controlled Variable Exclusion Test, Google Antigravity 5-subsystem mapping)
- [x] T007 [P] [US1] Create Companion Notebook 02 in `notebook/harness-engineering/02-what-a-harness-actually-is.ipynb` (5-subsystem audit scorer & ablation simulator with Gemini failure-attribution analysis)
- [x] T008 [P] [US1] Author Lesson 03 in `src/content/lessons/harness-engineering/03-project-01-prompt-only-vs-rules-first-harness.mdx` (Project 01: Prompt-Only vs. Rules-First Python Knowledge Base shell across `p01-baseline/` vs. `p01-improved/` with `AGENTS.md`, `GEMINI.md`, `init.sh`, `feature_list.json`, `PROGRESS.md`)
- [x] T009 [P] [US1] Create Companion Notebook 03 in `notebook/harness-engineering/03-project-01-prompt-only-vs-rules-first-harness.ipynb` (Runnable Project 01 Knowledge Base shell + baseline vs. minimal-harness benchmark runner)
- [x] T010 [P] [US1] Author Lesson 04 in `src/content/lessons/harness-engineering/04-repository-as-system-of-record.mdx` (Knowledge Visibility Gap, 5-Question Fresh Session Test, Discovery Cost, Knowledge Decay Rate, ACID State Management, proximity-based module docs)
- [x] T011 [P] [US1] Create Companion Notebook 04 in `notebook/harness-engineering/04-repository-as-system-of-record.ipynb` (Automated 5-Question Fresh Session Test & Knowledge Visibility Gap scorer)
- [x] T012 [P] [US1] Author Lesson 05 in `src/content/lessons/harness-engineering/05-splitting-instructions-and-progressive-disclosure.mdx` (Instruction Bloat, Lost in the Middle U-curve, Signal-to-Noise Ratio $\text{SNR}$, ETH Zurich vs. Lulla et al. studies, Google Antigravity `24 KB` cap, `20,000`-token `defaultRulesBudget`, and `.agents/skills/*/SKILL.md` progressive disclosure)
- [x] T013 [P] [US1] Create Companion Notebook 05 in `notebook/harness-engineering/05-splitting-instructions-and-progressive-disclosure.ipynb` (Instruction SNR calculator, Antigravity `20,000`-token budget demotion simulator, and `SKILL.md` progressive loader)
- [x] T014 [P] [US1] Author Lesson 06 in `src/content/lessons/harness-engineering/06-project-02-agent-readable-workspace-and-handoffs.mdx` (Project 02: Agent-Readable Workspace & Handoffs adding document import, full document detail view, SQLite/JSON persistence, `docs/ARCHITECTURE.md`, `docs/PRODUCT.md`, and `session-handoff.md`)
- [x] T015 [P] [US1] Create Companion Notebook 06 in `notebook/harness-engineering/06-project-02-agent-readable-workspace-and-handoffs.ipynb` (Runnable Project 02 SQLite Knowledge Base + Fresh Session Handoff validator)
- [x] T016 [US1] Run `verify_course.py --orders 1-6` and `pnpm astro check` to validate User Story 1 MVP

**Checkpoint**: User Story 1 (MVP) is complete and independently verified.

---

## Phase 4: User Story 2 — Multi-Session Continuity, Dedicated Initialization, Scope & Feature Lists (Priority: P2)

**Goal**: Deliver Module 3 (Lessons 07–12 + Projects 03–04) and their 6 companion Colab notebooks, covering cross-session persistence, Context Anxiety, `SessionStart` initialization, $\text{WIP} = 1$ scope bounds, `feature_list.json` pass-state gating, and runtime observability/architecture guards.

**Independent Test**: Run `python verify_course.py --orders 7-12` and `pnpm astro check` to confirm Lessons 07–12 and Notebooks 07–12 pass all checks.

### Implementation for User Story 2

- [x] T017 [P] [US2] Author Lesson 07 in `src/content/lessons/harness-engineering/07-multi-session-continuity-and-context-anxiety.mdx` (Finite context windows, Rebuild Cost, Drift, Context Anxiety, Compaction vs. Context Reset, `/compact`, `PROGRESS.md` & `DECISIONS.md`, 60% handoff threshold, LangChain Terminal Bench 2.0)
- [x] T018 [P] [US2] Create Companion Notebook 07 in `notebook/harness-engineering/07-multi-session-continuity-and-context-anxiety.ipynb` (Session rebuild-cost simulator + `PROGRESS.md` / `DECISIONS.md` state serializer)
- [x] T019 [P] [US2] Author Lesson 08 in `src/content/lessons/harness-engineering/08-dedicated-initialization-phase.mdx` (Unverified accumulation, 5 outputs of Dedicated Initialization, From Template vs. From Scratch, 60% rebuild reduction, Google Antigravity `SessionStart` hooks in `.agents/hooks.json` + `init.sh`)
- [x] T020 [P] [US2] Create Companion Notebook 08 in `notebook/harness-engineering/08-dedicated-initialization-phase.ipynb` (Initializer phase runner, Startup Readiness Checklist validator, and `SessionStart` protojson hook handler)
- [x] T021 [P] [US2] Author Lesson 09 in `src/content/lessons/harness-engineering/09-task-boundaries-and-wip-limits.mdx` (Attention math $C / k$, Overreach vs. Under-finish, Little's Law $L = \lambda W$, $\text{WIP} = 1$, Completion Evidence, Scope Surface DAG, Verified Completion Rate $\text{VCR}$)
- [x] T022 [P] [US2] Create Companion Notebook 09 in `notebook/harness-engineering/09-task-boundaries-and-wip-limits.ipynb` ($\text{WIP} = 1$ vs. $\text{WIP} = 5$ Scope Surface DAG scheduler & VCR calculator)
- [x] T023 [P] [US2] Author Lesson 10 in `src/content/lessons/harness-engineering/10-feature-lists-as-harness-primitives.mdx` (Feature Triple `(behavior, verification, state)`, 4-state machine, Pass-State Gating, Scheduler/Verifier/Handoff/Tracker consumers, Back-Pressure, session granularity)
- [x] T024 [P] [US2] Create Companion Notebook 10 in `notebook/harness-engineering/10-feature-lists-as-harness-primitives.ipynb` (Executable `feature_list.json` state machine enforcing Pass-State Gating)
- [x] T025 [P] [US2] Author Lesson 11 in `src/content/lessons/harness-engineering/11-project-03-multi-session-continuity-and-pass-gating.mdx` (Project 03: Multi-Session Continuity & Pass-Gating on Python Knowledge Base: chunking, metadata extraction, indexing status, grounded citation Q&A with Gemini)
- [x] T026 [P] [US2] Create Companion Notebook 11 in `notebook/harness-engineering/11-project-03-multi-session-continuity-and-pass-gating.ipynb` (Runnable Project 03 RAG Knowledge Base + Pass-Gate verifier + `session-handoff.md` generator)
- [x] T027 [P] [US2] Author Lesson 12 in `src/content/lessons/harness-engineering/12-project-04-runtime-feedback-and-architecture-guards.mdx` (Project 04: Runtime Feedback & Architecture Guards: diagnosing seeded large-file chunking defect via structured `logger.py`, `check_architecture.py`, and Google Antigravity `PreToolUse` / `PostToolUse` hooks)
- [x] T028 [P] [US2] Create Companion Notebook 12 in `notebook/harness-engineering/12-project-04-runtime-feedback-and-architecture-guards.ipynb` (Runnable Project 04 structured JSON logger, AST boundary checker, and `PreToolUse` hook simulator)
- [x] T029 [US2] Run `verify_course.py --orders 7-12` and `pnpm astro check` to validate User Story 2

**Checkpoint**: User Stories 1 and 2 are complete and independently verified.

---

## Phase 5: User Story 3 — Verification Gates, Dual-Layer Observability & Clean Session Exits (Priority: P3)

**Goal**: Deliver Module 4 (Lessons 13–18 + Projects 05–06 Capstone) and their 6 companion Colab notebooks, covering confidence calibration, `Stop` hooks, E2E verification, agent-oriented errors, 3-role separation, OpenTelemetry observability, clean session exits, and the Capstone ablation study.

**Independent Test**: Run `python verify_course.py --orders 13-18` and `pnpm astro check` to confirm Lessons 13–18 and Notebooks 13–18 pass all checks.

### Implementation for User Story 3

- [x] T030 [P] [US3] Author Lesson 13 in `src/content/lessons/harness-engineering/13-preventing-premature-victory-and-confidence-calibration.mdx` (Confidence Calibration Bias / $\text{ECE}$, why unit tests $\neq$ done, Worker vs. Checker separation, 3-Layer Termination Validation, Google Antigravity `Stop` hooks with `continuationActive`)
- [x] T031 [P] [US3] Create Companion Notebook 13 in `notebook/harness-engineering/13-preventing-premature-victory-and-confidence-calibration.ipynb` (3-layer termination validator & Antigravity `Stop` hook handler with loop-guard)
- [x] T032 [P] [US3] Author Lesson 14 in `src/content/lessons/harness-engineering/14-end-to-end-verification-and-agent-oriented-errors.mdx` (Testing Adequacy Gradient, OpenAI Layered Domain Architecture `Types→Config→Repo→Service→Runtime→UI`, Agent-Oriented Error Messages `ERROR`/`WHY`/`FIX`, Review Feedback Promotion)
- [x] T033 [P] [US3] Create Companion Notebook 14 in `notebook/harness-engineering/14-end-to-end-verification-and-agent-oriented-errors.ipynb` (AST layer-dependency linter emitting `ERROR`/`WHY`/`FIX` + E2E boundary test suite)
- [x] T034 [P] [US3] Author Lesson 15 in `src/content/lessons/harness-engineering/15-project-05-role-separation-and-grounded-qa-verification.mdx` (Project 05: Role Separation ablation adding Multi-Turn Conversation History & Citation Verification across `single-role` 1.6/5, `gen-eval` 3.3/5, and `plan-gen-eval` 4.9/5 using `invoke_subagent`)
- [x] T035 [P] [US3] Create Companion Notebook 15 in `notebook/harness-engineering/15-project-05-role-separation-and-grounded-qa-verification.ipynb` (Runnable Project 05 3-variant role-separation evaluator with `sprint-contract.md` and `evaluator-rubric.md`)
- [x] T036 [P] [US3] Author Lesson 16 in `src/content/lessons/harness-engineering/16-runtime-and-process-observability.mdx` (Dual-Layer Runtime & Process Observability, Sprint Contracts, Evaluator Rubrics, OpenTelemetry trace/span model, Anthropic DAW 3-agent experiment, calibrating generous evaluators)
- [x] T037 [P] [US3] Create Companion Notebook 16 in `notebook/harness-engineering/16-runtime-and-process-observability.ipynb` (Structured task-trace span collector & rubric-based evaluator grader)
- [x] T038 [P] [US3] Author Lesson 17 in `src/content/lessons/harness-engineering/17-clean-session-exits-and-entropy-control.mdx` (Lehman's Laws & codebase entropy, 5 Clean State dimensions, Dual-Mode Cleanup, active Quality Documents, Monthly Harness Simplification, Idempotent Cleanup Scripts, High-Throughput Merge Philosophy, 12-week decay study)
- [x] T039 [P] [US3] Create Companion Notebook 17 in `notebook/harness-engineering/17-clean-session-exits-and-entropy-control.ipynb` (5-dimension Clean State gate, `QUALITY.md` module grader, and idempotent cleanup scanner)
- [x] T040 [P] [US3] Author Lesson 18 in `src/content/lessons/harness-engineering/18-project-06-capstone-complete-agent-harness-and-ablation.mdx` (Project 06 Capstone: Complete 5-subsystem harness + `harness-creator` 7 reference patterns & 15 gotchas + full benchmark + 5-subsystem ablation experiment)
- [x] T041 [P] [US3] Create Companion Notebook 18 in `notebook/harness-engineering/18-project-06-capstone-complete-agent-harness-and-ablation.ipynb` (Runnable Project 06 Capstone Knowledge Base harness benchmark, cleanup scanner, and ablation runner)
- [x] T042 [US3] Run `verify_course.py --orders 13-18` and `pnpm astro check` to validate User Story 3

**Checkpoint**: User Stories 1, 2, and 3 are complete and independently verified.

---

## Phase 6: User Story 4 — Loop Engineering, Graph Engineering & Frontier Harness Architectures (Priority: P4)

**Goal**: Deliver Module 5 (Lessons 19–24 + Projects 07–08) and their 6 companion Colab notebooks, covering autonomous loops (`/goal`, `/schedule`, Maker-Checker, Karpathy's `autoresearch`), multi-agent execution graphs (`run_workflow` & `LangGraph`), Google Antigravity's complete harness architecture, and Frontier Breakdowns (Claude Code, Codex, DeepSeek `dsh`, Pi).

**Independent Test**: Run `python verify_course.py --orders 19-24` and `pnpm astro check` to confirm Lessons 19–24 and Notebooks 19–24 pass all checks and Lesson 24 bridges cleanly to Course 08 (`edge-ai-for-beginners`).

### Implementation for User Story 4

- [x] T043 [P] [US4] Author Lesson 19 in `src/content/lessons/harness-engineering/19-loop-engineering-from-manual-prompting-to-autonomous-loops.mdx` (Stepping outside the loop, 4-stage `/goal` evolution, Loop Taxonomy, `/goal` vs. `/loop` / `/schedule`, 6 Loop Primitives, Maker-Checker separation, Karpathy's 9-step `autoresearch` ratchet, 4 Silent Costs including $\mathcal{O}(N^2)$ token blowout, 5-Level Loop Maturity Ladder)
- [x] T044 [P] [US4] Create Companion Notebook 19 in `notebook/harness-engineering/19-loop-engineering-from-manual-prompting-to-autonomous-loops.ipynb` (Ratchet loop simulator, Maker-Checker controller, and linear vs. quadratic token-cost tracker)
- [x] T045 [P] [US4] Author Lesson 20 in `src/content/lessons/harness-engineering/20-project-07-building-automated-goal-timer-and-maker-checker-loops.mdx` (Project 07: 3 progressive loops — `p07-goal-loop` with `goal.md`, `p07-timer-loop` heartbeat with `/schedule`, and `p07-maker-checker` 5-round isolated loop with `loop-state.md` using `google-genai` / `google-antigravity` SDK)
- [x] T046 [P] [US4] Create Companion Notebook 20 in `notebook/harness-engineering/20-project-07-building-automated-goal-timer-and-maker-checker-loops.ipynb` (Runnable Project 07 Goal, Timer, and 5-round Maker-Checker loop implementations)
- [x] T047 [P] [US4] Author Lesson 21 in `src/content/lessons/harness-engineering/21-graph-engineering-nodes-edges-shared-state-and-routing.mdx` (July 2026 origin & goddaehee fact-check, Rohit's 4-layer stack atop Harness, 4 Graph Components, Deferred vs. Up-Front decisions, 3 Structural Failures & Anchors, Graph vs. Workflow + iii.dev critique, 6-step blueprint, Orchestration Tax, 5 Graph Criteria, Antigravity `run_workflow` & `LangGraph`)
- [x] T048 [P] [US4] Create Companion Notebook 21 in `notebook/harness-engineering/21-graph-engineering-nodes-edges-shared-state-and-routing.ipynb` (Checkpointable 4-node Research→Implement→Verify→Merge graph engine with fresh-context Verify node)
- [x] T049 [P] [US4] Author Lesson 22 in `src/content/lessons/harness-engineering/22-project-08-multi-agent-graph-workflows-parallelism-and-hitl.mdx` (Project 08: Explicit Graph from P07 loop, Parallel Fan-Out/Fan-In with `workspace: "share"` / git worktrees, and Layer-Targeted Conditional Rollback + Human-Approval HITL interrupt with timeout/escalation)
- [x] T050 [P] [US4] Create Companion Notebook 22 in `notebook/harness-engineering/22-project-08-multi-agent-graph-workflows-parallelism-and-hitl.ipynb` (Runnable Project 08 `LangGraph` + `run_workflow` parallel fan-out/fan-in and HITL approval graph)
- [x] T051 [P] [US4] Author Lesson 23 in `src/content/lessons/harness-engineering/23-google-antigravity-harness-architecture-deep-dive.mdx` (Google Antigravity 5-Subsystem Deep-Dive: Multi-Surface IDE/2.0/CLI `agy`/Python SDK; 5-level rules precedence & `24 KB`/`20,000`-token budget; Progressive Skills, Plugins, MCP `mcp_config.json`; Sandbox & Policies; 6 Lifecycle Hooks in `hooks.json` + `run_workflow` + `/goal` + `/schedule`)
- [x] T052 [P] [US4] Create Companion Notebook 23 in `notebook/harness-engineering/23-google-antigravity-harness-architecture-deep-dive.ipynb` (Google Antigravity `hooks.json` protojson validator, 5-level rule-precedence resolver, and `google-antigravity` SDK workflow simulation)
- [x] T053 [P] [US4] Author Lesson 24 in `src/content/lessons/harness-engineering/24-frontier-harness-design-breakdowns-claude-code-codex-deepseek-and-pi.mdx` (Frontier Harness Breakdowns & Synthesis: Claude Code, OpenAI Codex, DeepSeek Harness `dsh`, Pi, and Google Antigravity side-by-side 5-Subsystem Matrix + bridge to Course 08 `edge-ai-for-beginners`)
- [x] T054 [P] [US4] Create Companion Notebook 24 in `notebook/harness-engineering/24-frontier-harness-design-breakdowns-claude-code-codex-deepseek-and-pi.ipynb` (Interactive 5-Subsystem Frontier Harness Comparator + DeepSeek-style Event Pipeline & Pi-style Session Tree simulator)
- [x] T055 [US4] Run `verify_course.py --orders 19-24` and `pnpm astro check` to validate User Story 4

**Checkpoint**: All 24 lessons and 24 companion Colab notebooks are complete and individually verified.

---

## Phase 7: Polish, Full Build, A11Y Gate & Governance

**Purpose**: End-to-end validation across the entire Astro site, design tokens, accessibility compliance, and clean SDD governance.

- [x] T056 Run full course verification suite `python .buddhi/specs/018-harness-engineering-full-course/verify_course.py --orders 1-24` confirming 24/24 lessons and 24/24 notebooks pass
- [x] T057 Run `pnpm astro check` and `pnpm build` via `terminal-runner` confirming 0 errors and all `/learn/harness-engineering/*` routes build cleanly
- [x] T058 Run `buddhi scripts verify-a11y` and `uv run --with "buddhi-ai[MCP]" python .agents/skills/design-md/scripts/detect_design_md.py --lint` via `terminal-runner`
- [x] T059 Update `REPORT.md` and `A11Y-DECISIONS.md` with Course 07 release verification evidence

---

## Dependencies & Execution Order

- **Phase 1 (Setup)** → **Phase 2 (Foundational)** → **Phase 3 (US1 MVP)** → **Phase 4 (US2)** → **Phase 5 (US3)** → **Phase 6 (US4)** → **Phase 7 (Polish & Gates)**.
- Within each User Story (`US1`–`US4`), all `[P]` lesson/notebook pairs touch independent files and can be authored in parallel, followed by that story's verification checkpoint.
