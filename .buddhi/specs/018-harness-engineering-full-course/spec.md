# Feature Specification: Course 07 — Harness Engineering (`harness-engineering`)

**Feature Branch**: `018-harness-engineering-full-course`

**Created**: 2026-11-22

**Status**: Approved

**Input**: User description: `Create full course for "Harness Engineering" based on .ref/learn-harness-engineering repo project.`

---

## Course Overview & Pedagogical Contract

Course 07 (**Harness Engineering**, track ID: `harness-engineering`) is the seventh course in the 9-course sequential AI Engineering learning path on **Buddhilive Academy**:
`00 python` → `01 ai-for-beginners` → `02 data-science-for-beginners` → `03 ml-for-beginners` → `04 generative-ai-for-beginners` → `05 mcp-for-beginners` → `06 ai-agents-for-beginners` → **`07 harness-engineering`** → `08 edge-ai-for-beginners`.

- **Grounding & Zero Reference Leakage**: All 24 lessons are grounded in the reference curriculum (14 lectures, 8 progressive hands-on projects, resource library templates, and 4 frontier harness design breakdowns) and mapped to **Google Antigravity** (`https://antigravity.google/docs/features/`) alongside comparative industry patterns. Lesson prose MUST NEVER mention `.ref/` or upstream reference repositories; all attributions live exclusively in `ACKNOWLEDGEMENTS.md`.
- **Google Antigravity Alignment (`https://antigravity.google/docs/features/`)**:
  - **Surfaces**: Antigravity 2.0 (desktop Electron orchestrator, Left-hand Sidebar, Chat Canvas, Scheduled Tasks, HTML Auxiliary Pane), Antigravity IDE (Passive Tab / Supercomplete / Tab-to-Jump / Tab-to-Import, Instructive `Ctrl+I` / `Cmd+I` inline command, Collaborative Sidebar Chat & Agent / Planning Mode, Inline Code Lenses, Visual Diff Overlays, Diagnostic Auto-Fix), Antigravity CLI (`agy`, `~/.gemini/antigravity-cli/settings.json`), and Antigravity Python SDK (`pip install google-antigravity`, `Agent`, `LocalAgentConfig`, `CapabilitiesConfig`, `response.thoughts`, `response.tool_calls`, `run_interactive_loop`).
  - **Instruction & Rules Subsystem**: Hierarchical discovery (`GEMINI.md`, `AGENTS.md`, `.agents/rules/*.md`, `.agents/rules.json`, `~/.gemini/config/`), 5-level loading priority (1. Workspace Project → 2. Declared Configs `skills.json`/`plugins.json` → 3. Global Discovery `~/.gemini/config/` → 4. Built-in → 5. Global Declared Configs), per-file `24 KB` (`24,000` bytes) cap, aggregate `20,000`-token `defaultRulesBudget` with automatic path-pointer demotion, and file-path deduplication.
  - **Skills & Progressive Disclosure**: `.agents/skills/<name>/SKILL.md` (with `scripts/`, `examples/`, `resources/`, `references/`), metadata-only injection until triggered (`trigger: model_decision` vs `always_on`), and `harness-creator` skill patterns (Memory Persistence, Skill Runtime, Context Engineering, Tool Registry, Multi-Agent Coordination, Lifecycle & Bootstrap, 15 Gotchas).
  - **Lifecycle Hooks (`hooks.json`)**: `SessionStart`, `PreToolUse`, `PostToolUse`, `PreInvocation`, `PostInvocation`, and `Stop` hooks using camelCase protojson payloads (`decision: "allow" | "deny" | "ask" | "force_ask"`, `overwrite`, `injectSteps`, `terminationBehavior: "force_continue" | "terminate"`, `continuationActive`, `terminationReason`).
  - **Plugins & MCP (`plugin.json`, `mcp_config.json`)**: Namespaced plugin bundles (`plugin.json`, root `hooks.json`, `mcp_config.json`, `rules/AGENTS.md`, `skills/`), Stdio vs. Streamable HTTP MCP transports, and Terminal Sandbox + Tool Execution Policies (`always-proceed`, `request-review`, `strict`, `proceed-in-sandbox`).
  - **Subagents, Loop & Graph Primitives**: Built-in slash commands (`/goal`, `/schedule`, `/compact`, `/plan`, `/grill-me`, `/teamwork`, `/learn`, `/boost`, `/browser`), `invoke_subagent` with workspace isolation (`inherit`, `share` git-worktree-style working copy, `branch` isolated clone), and `run_workflow` Python orchestration (`agent`, `parallel`, `pipeline`, `phase`).
- **Open-Source Python + Google Colab Free Tier + Google AI Studio Stack**:
  - Every lesson includes an in-browser `<PythonRunner client:visible />` executable simulation (pure Python 3.12 via Pyodide v0.26+ Web Worker, under 5s timeout) AND a companion Google Colab notebook in `./notebook/harness-engineering/<lesson_slug>.ipynb` linked via `<ColabButton course="harness-engineering" notebook="<lesson_slug>.ipynb" runtime="..." />`.
  - All LLM calls use **Google AI Studio Free Tier** (`GEMINI_API_KEY` via `google-genai` SDK with `gemini-2.5-flash`) with a clear onboarding guide and deterministic offline fallback so every notebook and sandbox runs cleanly even without a live key.
  - The 8 hands-on projects adapt the knowledge-base application (document import, detail view, SQLite/JSON persistence, document chunking & metadata indexing, citation-based grounded Q&A, structured runtime logger, architectural boundary linter, multi-turn conversation history, benchmark/cleanup runner, automated loops, and multi-agent graph execution) into an open-source **Python + FastAPI/Gradio + SQLite/ChromaDB Knowledge Base** engineered and verified through Google Antigravity harness artifacts (`AGENTS.md`, `GEMINI.md`, `init.sh`, `feature_list.json`, `PROGRESS.md`, `DECISIONS.md`, `session-handoff.md`, `clean-state-checklist.md`, `sprint-contract.md`, `evaluator-rubric.md`, `hooks.json`, `goal.md`, `loop-state.md`, `graph.md`).

---

## Complete 24-Lesson Syllabus (`src/content/lessons/harness-engineering/`)

### Module 1: Why Agents Fail & The 5-Subsystem Harness Anatomy
1. **`01-why-capable-agents-still-fail.mdx`** (Order: 1, Category: `Module 1: Harness Anatomy & Foundations`, XP: 50)
   - *Grounded In*: `lectures/lecture-01-why-capable-agents-still-fail/` (`index.md`, `code/failure-signals-checklist.md`, `code/underspecified-task.md`)
   - *Core Topics*: SWE-bench Verified vs. real-world Capability Gap, the 5 failure modes (vague specs, implicit conventions, broken environments, missing verification & Context Anxiety, cross-session state loss), Harness-Induced Failure, Verification Gap ($G_{\text{verify}} = P(\text{claimed done}) - P(\text{verified pass})$), the 5-Layer Diagnostic Loop, Definition of Done, OpenAI's 1M-line Codex experiment (1,500 PRs, 3.5 PRs/engineer/day), and Google Antigravity's first-run `AGENTS.md` + `/plan` setup + Google AI Studio `GEMINI_API_KEY` onboarding.
2. **`02-what-a-harness-actually-is.mdx`** (Order: 2, Category: `Module 1: Harness Anatomy & Foundations`, XP: 50)
   - *Grounded In*: `lectures/lecture-02-what-a-harness-actually-is/` (`index.md`, `code/harness-components.md`)
   - *Core Topics*: Formal 5-Subsystem Harness Model ($\mathcal{H} = \langle I, T, E, S, F \rangle$: Instructions, Tools, Environment, State, Feedback), "The Repo IS the Spec," "Give a Map, Not a Manual," "Constrain, Don't Micromanage," Gulf of Execution vs. Gulf of Evaluation, Controlled Variable Exclusion Tests (ablation vs. failure attribution), 4-stage progression (20% → 60% → 80% → 100%), and how Google Antigravity implements all 5 subsystems across Antigravity 2.0, IDE, CLI (`agy`), and Python SDK.
3. **`03-project-01-prompt-only-vs-rules-first-harness.mdx`** (Order: 3, Category: `Module 1: Harness Anatomy & Foundations`, XP: 75)
   - *Grounded In*: `projects/project-01-baseline-vs-minimal-harness/` (`index.md`), `resources/templates/`
   - *Core Topics*: Hands-on comparison experiment building the Knowledge Base application shell (4 core features: app launch/health, document list, question panel, local data directory creation). Side-by-side protocol: Weak Harness (`p01-baseline/`, bare `task-prompt.md`) vs. Strong Google Antigravity Harness (`p01-improved/` with `AGENTS.md`, `GEMINI.md`, `init.sh`, `feature_list.json`, `PROGRESS.md`, `docs/ARCHITECTURE.md`, `docs/PRODUCT.md`), contaminated-branch avoidance, and quantitative measurement (Completion, First Successful Launch, Retries, Missing Items, Premature Stop).

### Module 2: Repository as System of Record & Modular Instructions
4. **`04-repository-as-system-of-record.mdx`** (Order: 4, Category: `Module 2: System of Record & Modular Instructions`, XP: 50)
   - *Grounded In*: `lectures/lecture-03-why-the-repository-must-become-the-system-of-record/` (`index.md`, `code/system-of-record-checklist.md`)
   - *Core Topics*: Knowledge Visibility Gap ($G_{\text{vis}} = 1 - \frac{|K_{\text{repo}}|}{|K_{\text{total}}|}$), System of Record, the 5-Question Fresh Session Test (What is this system? How is it organized? How do I run it? How do I verify it? Where are we now?), Discovery Cost, Knowledge Decay Rate, ACID State Management for Agents (Atomicity, Consistency, Isolation, Durability), and proximity-based architecture docs (`src/api/ARCHITECTURE.md`, `src/db/CONSTRAINTS.md`).
5. **`05-splitting-instructions-and-progressive-disclosure.mdx`** (Order: 5, Category: `Module 2: System of Record & Modular Instructions`, XP: 50)
   - *Grounded In*: `lectures/lecture-04-why-one-giant-instruction-file-fails/` (`index.md`, `code/AGENTS-short.md`, `code/anti-patterns.md`)
   - *Core Topics*: The Giant Instruction File Trap, Instruction Bloat (10–15% context tax), "Lost in the Middle" U-shaped positional recall curve (Liu et al., 2023), Instruction Signal-to-Noise Ratio ($\text{SNR}(t) = \frac{|I_{\text{relevant}}(t)|}{|I_{\text{loaded}}(t)|}$), ETH Zurich `AGENTS.md` cost study vs. Lulla et al. paired efficiency study (28.64% faster runtime, 16.58% fewer output tokens), rule lifecycle metadata (source, applicability, expiry), and Google Antigravity's Progressive Disclosure architecture (`24 KB` per-file cap, `20,000`-token `defaultRulesBudget`, hierarchical `AGENTS.md`/`GEMINI.md` merging, and on-demand `.agents/skills/*/SKILL.md`).
6. **`06-project-02-agent-readable-workspace-and-handoffs.mdx`** (Order: 6, Category: `Module 2: System of Record & Modular Instructions`, XP: 75)
   - *Grounded In*: `projects/project-02-agent-readable-workspace/` (`index.md`)
   - *Core Topics*: Hands-on project adding workspace readability and cross-session handoff to the Python Knowledge Base app (3 new product features: document import, full document detail loading, and local SQLite/JSON persistence across restarts). Comparing thin docs without handoff against a routed `AGENTS.md`, expanded `docs/ARCHITECTURE.md` & `docs/PRODUCT.md`, and `session-handoff.md` passing the 5-Question Fresh Session Test with zero verbal context.

### Module 3: Multi-Session Continuity, Initialization, Scope & Feature Lists
7. **`07-multi-session-continuity-and-context-anxiety.mdx`** (Order: 7, Category: `Module 3: Continuity, Scope & Feature Lists`, XP: 55)
   - *Grounded In*: `lectures/lecture-05-why-long-running-tasks-lose-continuity/` (`index.md`, `code/continuity-checklist.md`, `code/session-handoff.md`)
   - *Core Topics*: Why finite context windows lose the "why" while keeping the "what," Rebuild Cost, Compounding Drift, Context Anxiety ("rushed finish" behavior near context limits), Compaction vs. Context Reset (and Google Antigravity's `/compact` command + transcript logs), the 4 persistence tools (`PROGRESS.md`, `DECISIONS.md`, atomic Git checkpoints, clock-in/clock-out routines), the 60% context handoff threshold, and LangChain's Terminal Bench 2.0 jump (52.8% → 66.5%, +13.7 pp).
8. **`08-dedicated-initialization-phase.mdx`** (Order: 8, Category: `Module 3: Continuity, Scope & Feature Lists`, XP: 55)
   - *Grounded In*: `lectures/lecture-06-why-initialization-needs-its-own-phase/` (`index.md`, `code/initializer-output-checklist.md`)
   - *Core Topics*: Why mixing initialization and feature implementation creates a conflicting multi-objective problem and "unverified accumulation," the 5 outputs of a Dedicated Initialization Phase (runnable environment, passing example test, Startup Readiness Checklist, ordered Task Breakdown, clean Git checkpoint), From Template vs. From Scratch, Time to First Passing Test, 60% total rebuild time reduction, and automating initialization in Google Antigravity with `SessionStart` hooks in `.agents/hooks.json` and `init.sh`.
9. **`09-task-boundaries-and-wip-limits.mdx`** (Order: 9, Category: `Module 3: Continuity, Scope & Feature Lists`, XP: 55)
   - *Grounded In*: `lectures/lecture-07-why-agents-overreach-and-under-finish/` (`index.md`, `code/next-task-template.md`, `code/scope-surface-example.md`)
   - *Core Topics*: Attention math ($C / k$ reasoning budget per task), Overreach vs. Under-finish symbiosis, Little's Law ($L = \lambda \cdot W$) applied to agent sessions, enforcing $\text{WIP} = 1$, executable Completion Evidence, the Scope Surface DAG (`not_started`, `active`, `blocked`, `passing`), Verified Completion Rate ($\text{VCR} = \frac{N_{\text{verified}}}{N_{\text{activated}}}$), and 87.5% vs. 37.5% completion case study.
10. **`10-feature-lists-as-harness-primitives.mdx`** (Order: 10, Category: `Module 3: Continuity, Scope & Feature Lists`, XP: 55)
    - *Grounded In*: `lectures/lecture-08-why-feature-lists-are-harness-primitives/` (`index.md`, `code/pass-gate-policy.md`)
    - *Core Topics*: Why feature lists are system primitives rather than human memos, the Feature Triple `(behavior, verification, state)`, the 4-state machine and Pass-State Gating (why agents cannot self-mark `passing`), how the 4 harness components (Scheduler, Verifier, Handoff Reporter, Progress Tracker) consume `feature_list.json`, Back-Pressure ($B = N_{\text{total}} - N_{\text{passing}}$), and session-sized granularity calibration.
11. **`11-project-03-multi-session-continuity-and-pass-gating.mdx`** (Order: 11, Category: `Module 3: Continuity, Scope & Feature Lists`, XP: 75)
    - *Grounded In*: `projects/project-03-multi-session-continuity/` (`index.md`)
    - *Core Topics*: Hands-on project implementing 4 RAG knowledge-base features across session restarts under strict $\text{WIP} = 1$ and pass-state gating: document chunking, metadata extraction, indexing progress status, and citation-based grounded Q&A with Gemini (`google-genai`). Building the pass-gate verifier script that refuses to transition `feature_list.json` to `passing` without execution evidence and generates `session-handoff.md`.
12. **`12-project-04-runtime-feedback-and-architecture-guards.mdx`** (Order: 12, Category: `Module 3: Continuity, Scope & Feature Lists`, XP: 75)
    - *Grounded In*: `projects/project-04-incremental-indexing/` (`index.md`)
    - *Core Topics*: Hands-on project planting and diagnosing a large-file incremental indexing chunking defect using structured runtime observability (`logger.py` covering startup, import, indexing, and error states) and mechanical architectural boundary guards (`check_architecture.py` + Google Antigravity `PreToolUse` / `PostToolUse` hooks in `.agents/hooks.json`). Comparing root-cause discovery speed with and without structured runtime feedback.

### Module 4: Verification Gates, Observability & Clean Handoffs
13. **`13-preventing-premature-victory-and-confidence-calibration.mdx`** (Order: 13, Category: `Module 4: Verification Gates, Observability & Clean State`, XP: 60)
    - *Grounded In*: `lectures/lecture-09-why-agents-declare-victory-too-early/` (`index.md`, `code/clean-state-checklist.md`)
    - *Core Topics*: Neural network overconfidence and Confidence Calibration Bias ($\text{ECE}$, Guo et al. ICML 2017), why passing unit tests $\neq$ task complete (interface mismatch, state propagation errors, environment dependency), why "refactoring while we're at it" poisons completion judgment, Worker vs. Checker separation (Anthropic's 1-agent \$9 broken game vs. 3-agent Planner-Generator-Evaluator \$200 playable game), Three-Layer Termination Validation (Static → Runtime Behavior → System E2E), and Google Antigravity `Stop` hooks (`decision: "continue"`, `continuationActive`) that block premature exits.
14. **`14-end-to-end-verification-and-agent-oriented-errors.mdx`** (Order: 14, Category: `Module 4: Verification Gates, Observability & Clean State`, XP: 60)
    - *Grounded In*: `lectures/lecture-10-why-end-to-end-testing-changes-results/` (`index.md`, `code/architecture-rules.md`, `code/review-feedback-to-rule.md`)
    - *Core Topics*: The Testing Adequacy Gradient ($\text{Defects}_{\text{Unit}} \subseteq \text{Defects}_{\text{Integration}} \subseteq \text{Defects}_{\text{E2E}}$), how knowing E2E tests exist changes how agents write code, OpenAI's Layered Domain Architecture (`Types → Config → Repo → Service → Runtime → UI`), Agent-Oriented Error Messages (`ERROR` + `WHY` + `FIX`), Review Feedback Promotion (5-step loop turning review comments into permanent lint/CI checks), and the 5 component-boundary defects case study.
15. **`15-project-05-role-separation-and-grounded-qa-verification.mdx`** (Order: 15, Category: `Module 4: Verification Gates, Observability & Clean State`, XP: 75)
    - *Grounded In*: `projects/project-05-grounded-qa-verification/` (`index.md`)
    - *Core Topics*: Hands-on ablation experiment adding Multi-Turn Conversation History & Citation Verification to the Knowledge Base app across three role architectures in Google Antigravity (`invoke_subagent`): Variant 1 (`single-role`, score 1.6/5), Variant 2 (`gen-eval`, Generator + Evaluator with revision evidence, score 3.3/5), and Variant 3 (`plan-gen-eval`, Planner + Generator + Evaluator with `sprint-contract.md` and `evaluator-rubric.md`, score 4.9/5).
16. **`16-runtime-and-process-observability.mdx`** (Order: 16, Category: `Module 4: Verification Gates, Observability & Clean State`, XP: 60)
    - *Grounded In*: `lectures/lecture-11-why-observability-belongs-inside-the-harness/` (`index.md`, `code/evaluator-rubric.md`, `code/sprint-contract.md`)
    - *Core Topics*: The 4 costs of missing observability, Dual-Layer Observability (Runtime Observability: lifecycle, feature path traces, data flow, resource usage, error context; Process Observability: Sprint Contracts and Evaluator Rubrics), OpenTelemetry tracing (session trace → task span → verification sub-span), Anthropic's 3-Agent Web Audio DAW experiment (Opus 4.5 sprints vs. Opus 4.6 continuous build + QA rounds, 3h 50m, \$124.70), and calibrating an overly generous QA evaluator by inspecting its logs.
17. **`17-clean-session-exits-and-entropy-control.mdx`** (Order: 17, Category: `Module 4: Verification Gates, Observability & Clean State`, XP: 60)
    - *Grounded In*: `lectures/lecture-12-why-every-session-must-leave-a-clean-state/` (`index.md`, `code/benchmark-comparison-template.md`, `code/cleanup-loop.md`)
    - *Core Topics*: Lehman's Laws of Software Evolution & codebase entropy ("broken windows" pattern copying by agents), OpenAI's transition from "20% Friday manual AI-slop cleanup" to Golden Rules + background cleanup agents, the 5 Clean State dimensions (build passes, tests pass, progress recorded, temp artifacts removed, standard startup works), Dual-Mode Cleanup (Immediate reference-counting cleanup vs. Periodic tracing cleanup), active Quality Documents (A–D module health grading), Monthly Harness Simplification (ablation as models improve), Idempotent Cleanup Scripts, High-Throughput Merge Philosophy ($C_{\text{fix}} < C_{\text{wait}}$), and the 12-week decay study (97% vs. 68% build pass rate, 9 min vs. 60+ min startup).
18. **`18-project-06-capstone-complete-agent-harness-and-ablation.mdx`** (Order: 18, Category: `Module 4: Verification Gates, Observability & Clean State`, XP: 85)
    - *Grounded In*: `projects/project-06-runtime-observability-and-debugging/` (`index.md`), `skills/index.md` (`harness-creator`)
    - *Core Topics*: Capstone harness assembly combining all 5 subsystems (`AGENTS.md`, `GEMINI.md`, `feature_list.json`, `init.sh`, `session-handoff.md`, `clean-state-checklist.md`, `QUALITY.md`, `evaluator-rubric.md`, `benchmark.py`, `cleanup_scanner.py`, and `.agents/hooks.json`), plus the `harness-creator` 7 reference patterns and 15 non-obvious gotchas. Running the full benchmark, executing an idempotent cleanup pass, and performing a 5-subsystem ablation study.

### Module 5: Loop Engineering, Graph Engineering & Frontier Harness Breakdowns
19. **`19-loop-engineering-from-manual-prompting-to-autonomous-loops.mdx`** (Order: 19, Category: `Module 5: Loop, Graph & Frontier Harness Engineering`, XP: 65)
    - *Grounded In*: `lectures/lecture-13-loop-engineering/` (`index.md`, `code/checker-prompt.md`, `code/goal-template.md`, `code/loop-state-template.md`, `code/maker-prompt.md`)
    - *Core Topics*: Stepping outside the loop (Steinberger, Cherny's 259 PRs in 30 days, Addy Osmani's Loop Engineering), the 4-stage evolution of `/goal` (Goal + Verification + Stopping Condition), Loop Taxonomy (Turn-based, Goal-based `/goal`, Time-based `/schedule` / `/loop`, Event-driven), `/goal` vs. `/loop` ("Does this thing have an end?"), the 6 Primitives of a Loop (Automations, Worktrees, Skills, Connectors/MCP, Sub-agents, External State), Generator/Evaluator Separation ("Someone in your crew must not believe you"), Karpathy's `autoresearch` 9-Step Ratchet Loop (`prepare.py`, `train.py`, `program.md`, `results.tsv`, 10.9% GPT-2 speedup), the 4 Silent Costs (Verification Debt, Comprehension Rot, Cognitive Surrender, Quadratic Token Blowout $\mathcal{O}(N^2)$), and the 5-Level Loop Maturity Ladder in Google Antigravity (`/goal`, `/schedule`, `invoke_subagent` with `workspace: "share"`).
20. **`20-project-07-building-automated-goal-timer-and-maker-checker-loops.mdx`** (Order: 20, Category: `Module 5: Loop, Graph & Frontier Harness Engineering`, XP: 80)
    - *Grounded In*: `projects/project-07-loop-engineering-first-loop/` (`index.md`)
    - *Core Topics*: Hands-on execution of 3 progressive autonomous loops on the Knowledge Base harness using Google Antigravity and the `google-antigravity` Python SDK / `google-genai`: Experiment 1 (`p07-goal-loop` with `goal.md` and `/goal`), Experiment 2 (`p07-timer-loop` heartbeat monitoring with `/schedule`), and Experiment 3 (`p07-maker-checker` 5-round autonomous Maker-Checker loop with isolated contexts and `loop-state.md`).
21. **`21-graph-engineering-nodes-edges-shared-state-and-routing.mdx`** (Order: 21, Category: `Module 5: Loop, Graph & Frontier Harness Engineering`, XP: 65)
    - *Grounded In*: `lectures/lecture-14-graph-engineering/` (`index.md`, `code/index.md`)
    - *Core Topics*: The July 2026 Graph Engineering origin & goddaehee fact-check (debunking the fake "+18% accuracy, -85% cost" P&ID numbers), Rohit's 4-Layer AI Engineering Stack (Prompt → Context → Loop → Graph, built atop the Harness foundation), the 4 Graph Components (Nodes, Edges, Shared State with merge reducers, Routing Rules), Deferred Decisions (Loops) vs. Up-Front Decisions (Graphs), the 3 Structural Failures of a Single Loop at Scale (Goodhart's Law, Blindness Upward, Multi-Loop Conflict) & Real-World Anchors, Graph vs. Workflow (agent nodes + dynamic routing vs. deterministic functions, plus iii.dev's replayability/observability/recoverability critique), the 6-Step Graph Construction Blueprint (with fresh-context `verify` node and checkpoints), Addy Osmani's Orchestration Tax ("You are the GIL of your AI agents"), the 5 Criteria for When You Actually Need a Graph ($\ge 3$ of 5), and orchestrating graphs in Google Antigravity (`run_workflow` with `agent`, `parallel`, `pipeline`, `phase`) and LangGraph.
22. **`22-project-08-multi-agent-graph-workflows-parallelism-and-hitl.mdx`** (Order: 22, Category: `Module 5: Loop, Graph & Frontier Harness Engineering`, XP: 80)
    - *Grounded In*: `projects/project-08-graph-engineering-first-graph/` (`index.md`)
    - *Core Topics*: Hands-on transition from Loop to Graph across 3 branches: Experiment 1 (`p08-explicit-graph`: decomposing the P07 Maker-Checker loop into `graph.md` with explicit nodes, conditional/rollback edges, `state.md`, and uncovering hidden implicit edges), Experiment 2 (`p08-parallel`: parallel fan-out/fan-in verification & implementation nodes with git worktree / `workspace: "share"` isolation and coordination-cost measurement), and Experiment 3 (`p08-human-in-the-loop`: layer-targeted conditional rollback to `research` vs. `implement` plus a Human-Approval interrupt node with timeout/escalation rules). Implemented with both Google Antigravity `run_workflow` and `LangGraph`.
23. **`23-google-antigravity-harness-architecture-deep-dive.mdx`** (Order: 23, Category: `Module 5: Loop, Graph & Frontier Harness Engineering`, XP: 70)
    - *Grounded In*: Official Google Antigravity documentation (`https://antigravity.google/docs/features/`) and course 5-subsystem framework (`harness-designs/index.md`)
    - *Core Topics*: Complete architectural breakdown of **Google Antigravity** mapped to the 5-Subsystem Harness Framework:
      1. **Multi-Surface Architecture**: Antigravity 2.0 (Electron app, Scheduled Tasks, HTML Auxiliary Pane), Antigravity IDE (Passive Tab/Supercomplete, Instructive `Ctrl+I`, Collaborative Agent/Planning Mode, Code Lenses, Visual Diffs, Diagnostic Auto-Fix), Antigravity CLI (`agy`), and Python SDK (`google.antigravity.Agent`, `LocalAgentConfig`, `CapabilitiesConfig`, `response.thoughts`, `response.tool_calls`).
      2. **Instruction & Context Subsystem**: 5-level discovery precedence, `GEMINI.md` & `AGENTS.md`, `24 KB` file cap, `20,000`-token `defaultRulesBudget` with automatic path-pointer demotion, file-path deduplication, and `/compact`.
      3. **Tool & Extension Subsystem**: Progressive-disclosure Skills (`.agents/skills/<name>/SKILL.md`), namespaced Plugins (`plugin.json`, `plugins.json`, `skills.json` with `inherits`/`entries`/`include_only`/`exclude`), and MCP Servers (`mcp_config.json` with Stdio and Streamable HTTP).
      4. **Environment & Sandbox Subsystem**: Standard Sandbox Mode (`BypassSandbox: false`), Tool Execution Policies (`always-proceed`, `request-review`, `strict`, `proceed-in-sandbox`), File/Internet/Browser Allowlists, and Subagent Workspace Isolation (`inherit`, `share`, `branch`).
      5. **Feedback, Hooks & Orchestration Subsystem**: The 6 Lifecycle Hooks in `.agents/hooks.json` (`SessionStart`, `PreToolUse` with `overwrite`/`permissionOverrides`, `PostToolUse`, `PreInvocation`, `PostInvocation` with `force_continue`, and `Stop` with `continuationActive`), plus `run_workflow` and native `/goal` & `/schedule` loops.
24. **`24-frontier-harness-design-breakdowns-claude-code-codex-deepseek-and-pi.mdx`** (Order: 24, Category: `Module 5: Loop, Graph & Frontier Harness Engineering`, XP: 70)
    - *Grounded In*: `harness-designs/index.md`, `harness-designs/claude-code/index.md`, `harness-designs/codex/index.md`, `harness-designs/deepseek/index.md`, `harness-designs/pi/index.md`
    - *Core Topics*: Side-by-side 5-Subsystem architectural breakdown and synthesis comparing **Google Antigravity**, **Claude Code**, **OpenAI Codex**, **DeepSeek Harness (`dsh`)**, and **Pi (`@earendil-works/pi-coding-agent`)**:
      - **Claude Code ("Addition / Complete Runtime")**: 4-scope `CLAUDE.md` hierarchy + subdirectory on-demand loading + 200-line/25KB auto-memory, 5-layer compaction funnel (lossless pruning → structured distillation → lossy summary + circuit breakers) + `history.jsonl`, 4 extensions (Skills, MCP, Hooks, Sidechain Subagents), and permission modes (`Manual`, `Plan`, `acceptEdits`, `Auto`, `dontAsk`, `bypassPermissions`).
      - **OpenAI Codex ("Subtraction / Conventions & Worktrees")**: Monolithic Rust CLI, `AGENTS.md` as ~100-line directory page ("give the map, not the manual") + "enforce invariants, don't micromanage implementation," Write-Select-Compress-Isolate context framework, incremental environment deltas (`build_environment_update_item`), per-task git worktree + local observability stack, and `.codex/agents/*.toml` (`spawn_agent`/`wait_agent`).
      - **DeepSeek Harness (`dsh`, "Harness as Model-Independent OS / Everything is a Plugin")**: Cordis plugin core with zero privileged core, 3-layer Capability Seams (`Service Definition → Service Provider → Consumer` across Local/E2B/Remote FS, Shell, Sandbox, LLM), 12-stage observable Turn Flow Event Pipeline (`turn/start` → `agent/pre-step` → `tools/pre-execute` → `step/end`), and append-only Session Event Log with the runtime invariant **"Model-visible means logged."**
      - **Pi ("Minimal Core + Programmable Extensions")**: Minimal `SYSTEM.md` + 3-level `AGENTS.md`, 4 customizable layers (TypeScript Extensions, Agent Skills, `/name` Prompt Templates, TUI Themes), programmable compaction (~20,000-token retention split point + chained handoffs), Session Trees (`/tree` single-file branching & HTML/gist export), and `pi-agent-harness` self-learning files (`VISION.md`, `PROGRESS.md`, `LESSONS.md`, `STANDARDS.md`).
      - **Master Cross-Harness Matrix & Synthesis**: Mapping every frontier design pattern into actionable patterns you can adopt in your own repositories and bridges to Course 08 (`edge-ai-for-beginners`).

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Master Harness Foundations, System of Record & Modular Instructions (Priority: P1)

As an AI Engineer progressing from Course 06 (`ai-agents-for-beginners`), I want to learn why capable models still fail without a harness, master the 5-Subsystem Harness Model ($\mathcal{H} = \langle I, T, E, S, F \rangle$), organize a repository as the single source of record, and split bloated instruction files using Google Antigravity's progressive disclosure rules and skills (Lessons 01–06 + Projects 01–02), executing every diagnostic and verification simulation in-browser via Pyodide and in Google Colab Free Tier notebooks.

**Why this priority**: Establishes the foundational mental model, `curriculum.ts` metadata for `PlannedLessonCount = 24`, Google AI Studio `GEMINI_API_KEY` setup, and the first 6 lessons + 6 companion Colab notebooks (Modules 1 & 2). Delivers a standalone, testable MVP slice of Course 07.

**Independent Test**: Navigate to `/learn/harness-engineering`, verify the 5 modules and 24 planned lessons render in the course syllabus hub, open Lessons 01–06, execute each `<PythonRunner client:visible />` simulation within 5 seconds, click each `<ColabButton />` to confirm valid `./notebook/harness-engineering/01-*.ipynb` through `06-*.ipynb` notebooks exist, and answer each `<QuizCard client:visible />`.

**Acceptance Scenarios**:

1. **Given** a learner visiting `/learn/harness-engineering`, **When** they open Lesson 01 (`01-why-capable-agents-still-fail`), **Then** they see 350+ words of `my-writing-style` tutorial prose explaining the Capability Gap, the 5 failure modes, the Verification Gap formula, OpenAI's 1M-line experiment, a step-by-step Google AI Studio `GEMINI_API_KEY` setup guide, an interactive `<PythonRunner client:visible />`, a `<ColabButton />` pointing to `./notebook/harness-engineering/01-why-capable-agents-still-fail.ipynb`, reference tables, and a `<QuizCard client:visible />`.
2. **Given** a learner reading Lessons 02–06 (including Projects 01 and 02), **When** they run the in-browser PythonRunner examples, **Then** the scripts deterministically simulate the 5-subsystem ablation test, the Prompt-Only vs. Rules-First Knowledge Base comparison, the 5-Question Fresh Session Test, the Instruction Signal-to-Noise Ratio ($\text{SNR}$) & Google Antigravity `20,000`-token rules budget demotion calculator, and Project 02's workspace readability audit in under 5 seconds.

---

### User Story 2 - Engineer Multi-Session Continuity, Dedicated Initialization, Scope Limits & Feature Lists (Priority: P2)

As an AI Engineer building multi-session features, I want to prevent context loss and context anxiety across sessions, run dedicated initialization phases (`init.sh` + `SessionStart` hooks), enforce $\text{WIP} = 1$ task boundaries, and build pass-state gated `feature_list.json` primitives with runtime feedback and architectural boundary scripts (Lessons 07–12 + Projects 03–04).

**Why this priority**: Builds directly on the repository system of record from P1 to solve multi-session continuity, scope creep, and runtime feedback across 6 lessons and 6 companion Colab notebooks (Module 3).

**Independent Test**: Open Lessons 07–12 under `/learn/harness-engineering/`, run each `<PythonRunner client:visible />` state machine / pass-gate / architecture linter simulation, verify companion notebooks `07-*.ipynb` through `12-*.ipynb` exist and contain complete executable Python + `google-genai` RAG knowledge-base code, and verify `pnpm astro check` passes.

**Acceptance Scenarios**:

1. **Given** a learner on Lessons 07–10, **When** they run the interactive `<PythonRunner />` sandboxes, **Then** they execute working Python simulations of Compaction vs. Context Reset rebuild costs, the 5-item Initialization Acceptance Checklist, Little's Law ($\text{WIP} = 1$ vs. $\text{WIP} = 5$) Verified Completion Rate ($\text{VCR}$), and the 4-state `feature_list.json` Pass-State Gate.
2. **Given** a learner completing Projects 03 and 04 (Lessons 11–12), **When** they open the companion Colab notebooks (`11-*.ipynb` and `12-*.ipynb`), **Then** they can run the Python Knowledge Base chunking, metadata extraction, grounded citation Q&A with Gemini (`google-genai`), structured runtime logger, and AST/regex architectural boundary checker + Google Antigravity `PreToolUse`/`PostToolUse` hook payloads.

---

### User Story 3 - Enforce Verification Gates, Dual-Layer Observability & Clean Session Exits (Priority: P3)

As an AI Engineer hardening agent reliability, I want to eliminate premature victory declarations via 3-layer termination gates and Google Antigravity `Stop` hooks, design agent-oriented error messages (`ERROR`/`WHY`/`FIX`) with review feedback promotion, separate Planner/Generator/Evaluator roles, instrument runtime and process observability (`sprint-contract.md`, `evaluator-rubric.md`, OpenTelemetry spans), and enforce idempotent clean-state session exits (Lessons 13–18 + Projects 05–06 Capstone).

**Why this priority**: Completes the core single-session and multi-session harness engineering lifecycle through Project 06 (Capstone Complete Harness & Ablation Study) across 6 lessons and 6 companion Colab notebooks (Module 4).

**Independent Test**: Open Lessons 13–18, execute every `<PythonRunner client:visible />` verification gate, evaluator rubric, OpenTelemetry span tracer, and 12-week entropy decay / capstone ablation script, and validate notebooks `13-*.ipynb` through `18-*.ipynb`.

**Acceptance Scenarios**:

1. **Given** a learner studying Lessons 13–15 (including Project 05), **When** they run the interactive code and Colab notebooks, **Then** they can execute a 3-layer termination gate, a Google Antigravity `Stop` hook handler checking `continuationActive`, an agent-oriented architectural lint promoter, and the 3-variant role-separation experiment (`single-role` 1.6/5 vs. `gen-eval` 3.3/5 vs. `plan-gen-eval` 4.9/5).
2. **Given** a learner completing Lessons 16–18 (including Project 06 Capstone), **When** they execute the capstone harness benchmark and cleanup scanner, **Then** the code verifies all 5 clean-state dimensions, computes module quality grades (`QUALITY.md`), and runs a 5-subsystem ablation study.

---

### User Story 4 - Scale to Autonomous Loop Engineering, Graph Engineering & Frontier Harness Architectures (Priority: P4)

As an AI Engineer scaling beyond manual prompting, I want to design autonomous loops (`/goal`, `/schedule`, Maker-Checker, and Karpathy's 9-step `autoresearch` ratchet), architect multi-agent execution graphs (nodes, conditional/rollback edges, shared state reducers, parallel worktrees, human-in-the-loop approval interrupts, and real-world anchors), and master the internal harness architectures of Google Antigravity, Claude Code, OpenAI Codex, DeepSeek Harness (`dsh`), and Pi (Lessons 19–24 + Projects 07–08).

**Why this priority**: Completes Module 5 (the final 6 lessons and 6 companion Colab notebooks) and bridges Course 07 (`harness-engineering`) seamlessly into Course 08 (`edge-ai-for-beginners`).

**Independent Test**: Open Lessons 19–24, verify the bottom lesson navigation on Lesson 24 bridges to Course 08 (`edge-ai-for-beginners`), execute all `<PythonRunner client:visible />` loop/graph/frontier simulations, validate notebooks `19-*.ipynb` through `24-*.ipynb`, and run `pnpm astro check` + `pnpm build` + `buddhi scripts verify-a11y`.

**Acceptance Scenarios**:

1. **Given** a learner on Lessons 19–22 (Loop & Graph Engineering + Projects 07–08), **When** they execute the PythonRunner sandboxes and Colab notebooks, **Then** they run working implementations of a `/goal` loop, a `/schedule` timer loop, a 5-round Maker-Checker loop, Karpathy's 9-step ratchet loop, quadratic token blowout compaction, and a multi-agent execution graph with parallel fan-out/fan-in, layer-targeted rollback edges, and human-approval interrupts (in both Google Antigravity `run_workflow` format and `LangGraph`).
2. **Given** a learner on Lessons 23–24 (Google Antigravity Deep-Dive & Frontier Breakdowns), **When** they inspect the lessons, **Then** they find a complete 5-subsystem reference of Google Antigravity (`https://antigravity.google/docs/features/`) alongside a comparative synthesis of Claude Code, OpenAI Codex, DeepSeek Harness (`dsh`), and Pi, with zero mentions of `.ref/` anywhere in the course.

---

### Edge Cases

- **Missing `GEMINI_API_KEY` in Google Colab**: All 24 companion Colab notebooks MUST check for `GEMINI_API_KEY` (via `google.colab.userdata` or `os.environ`) and gracefully fall back to a deterministic local mock LLM / rule-based responder so learners can run every cell end-to-end without uncaught auth exceptions.
- **Pyodide 5-Second Web Worker Timeout**: All `<PythonRunner client:visible />` code blocks MUST use pure Python standard library (`json`, `dataclasses`, `ast`, `re`, `hashlib`, `sqlite3`, `time`, `typing`) and complete in `< 1` second so they never hit the 5-second Web Worker termination limit or attempt network calls inside the browser sandbox.
- **Windows vs. POSIX Path & Shell Differences in Harness Scripts**: When showing `init.sh` or `.agents/hooks.json` command handlers, lessons MUST explain cross-platform invocation (e.g., `python` scripts in `.agents/hooks/` and protojson camelCase `stdin`/`stdout` contracts) so Windows, macOS, and Linux learners can run them reliably.
- **KaTeX / Prose Dollar-Sign Collision**: All literal dollar amounts in prose (e.g., `\$9`, `\$200`, `\$124.70`) MUST be escaped as `\$` so KaTeX does not misinterpret two dollar signs in the same paragraph as an inline math block.
- **Mermaid Diagram Syntax Safety**: All Mermaid diagrams MUST use supported diagram types (`flowchart TD`, `flowchart LR`, `sequenceDiagram`, `stateDiagram-v2`) and quote any node labels containing parentheses, brackets, slashes, or colons (e.g., `id["Label (Detail)"]`).

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 (24-Lesson MDX Content Creation)**: The system MUST provide 24 `.mdx` lesson files under `src/content/lessons/harness-engineering/` (`01-why-capable-agents-still-fail.mdx` through `24-frontier-harness-design-breakdowns-claude-code-codex-deepseek-and-pi.mdx`) covering all 14 lectures, 8 hands-on projects, resource templates, `harness-creator` skill patterns, Google Antigravity harness architecture, and the 4 frontier harness breakdowns.
- **FR-002 (Frontmatter Schema Compliance)**: Every `.mdx` lesson file MUST validate strictly against `src/content.config.ts` with `title`, `track: "harness-engineering"`, `category`, `order` (`1` through `24`), `difficulty` (`"intermediate"` or `"advanced"`), `xp` (`50` to `85`), `description` ($\ge 30$ characters), `topic`, and `prerequisites`.
- **FR-003 (Curriculum Registry Update)**: `src/lib/curriculum.ts` MUST be updated so Course 07 (`track: "harness-engineering"`) reflects `plannedLessonCount: 24`, `runtimeBadges: ['In-Browser Pyodide', 'Google AI Studio Free Tier', 'Colab Free CPU']`, and the 5 structured `syllabusModules` matching the 24 lessons.
- **FR-004 (W3Schools + `my-writing-style` Pedagogical Contract)**: Every lesson MUST be written in the authentic, accessible, developer-friendly voice defined in `.agents/skills/my-writing-style/SKILL.md`, contain at least **350+ words** of clear explanatory prose, include KaTeX mathematical formulas where relevant, and contain:
  1. Direct opening hook & conceptual explanation with Mermaid architecture diagrams.
  2. Concrete copyable code example + `<PythonRunner client:visible title="..." code={...} />`.
  3. `<ColabButton course="harness-engineering" notebook="<lesson_slug>.ipynb" runtime="Colab Free CPU + Gemini API" />`.
  4. Reference / parameter tables explaining subsystems, files, metrics, and edge cases.
  5. Quick self-check quiz (`<QuizCard client:visible question="..." options={[...]} correctIndex={...} explanation="..." />`).
- **FR-005 (24 Companion Google Colab Notebooks)**: The system MUST provide 24 valid Jupyter Notebook v4 files (`.ipynb`) in `./notebook/harness-engineering/` matching each lesson slug (`01-*.ipynb` through `24-*.ipynb`). Each notebook MUST include a Google AI Studio Free Tier (`GEMINI_API_KEY` via `google-genai`) setup cell with deterministic offline fallback, full runnable Python code implementing the lesson's harness mechanisms or Knowledge Base project slice, and verification assertions.
- **FR-006 (Google Antigravity Mapping)**: Wherever the reference material discusses agent instructions, memory, compaction, skills, permissions, hooks, subagents, worktrees, `/goal`, `/loop`, or workflows (in Claude Code, OpenAI Codex, Cursor, etc.), the lessons MUST align and teach the official **Google Antigravity** implementation (`https://antigravity.google/docs/features/`)—including `GEMINI.md`/`AGENTS.md`, `24 KB` file cap & `20,000`-token `defaultRulesBudget`, `.agents/skills/*/SKILL.md`, `.agents/hooks.json` (`SessionStart`, `PreToolUse`, `PostToolUse`, `PreInvocation`, `PostInvocation`, `Stop`), `plugin.json`, `mcp_config.json`, `invoke_subagent` (`inherit`/`share`/`branch`), `run_workflow`, `/goal`, `/schedule`, `/compact`, and `google-antigravity` Python SDK—while preserving comparative industry insights.
- **FR-007 (Zero `.ref/` Mention & Attribution Integrity)**: No lesson `.mdx` file or Colab `.ipynb` notebook may mention `.ref/` or upstream reference repository paths. Upstream attribution to `walkinglabs/learn-harness-engineering` MUST remain exclusively in `ACKNOWLEDGEMENTS.md`.
- **FR-008 (Accessibility & Design System Compliance — A11Y & DESIGN.md)**: All rendered lesson pages, tables, Mermaid diagrams, and interactive islands (`PythonRunner`, `ColabButton`, `QuizCard`) MUST comply with `DESIGN.md` tokens (`#A7452A` light primary, `#E07A5F` dark primary, 1px tactile borders, zero CLS fixed-height AdSense slots) and pass **WCAG 2.2 Level AA** requirements (4.5:1 normal text contrast, 3.0:1 non-text contrast, full keyboard operability, visible `:focus-visible` rings, and semantic HTML structure) verified via `.agents/skills/a11y/SKILL.md` and `buddhi scripts verify-a11y`.

### Key Entities

- **Lesson MDX (`src/content/lessons/harness-engineering/<slug>.mdx`)**: Tutorial & reference page containing frontmatter, `my-writing-style` prose, Mermaid diagrams, KaTeX equations, `<PythonRunner />`, `<ColabButton />`, reference tables, and `<QuizCard />`.
- **Companion Colab Notebook (`notebook/harness-engineering/<slug>.ipynb`)**: Self-contained Jupyter notebook with Google AI Studio `GEMINI_API_KEY` onboarding, open-source Python harness/project implementation, and self-verifying tests.
- **Course Metadata (`src/lib/curriculum.ts`)**: Central curriculum registry entry for `track: 'harness-engineering'` driving sidebar grouping, course overview hub (`/learn/harness-engineering`), Pathfinder XP totals, and cross-course navigation (`ai-agents-for-beginners` → `harness-engineering` → `edge-ai-for-beginners`).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001 (Completeness)**: All 24 `.mdx` lesson files exist in `src/content/lessons/harness-engineering/` and all 24 companion `.ipynb` notebooks exist in `notebook/harness-engineering/`, with a 1:1 slug match.
- **SC-002 (Prose Depth & Quality)**: Every lesson `.mdx` file contains at least 350+ words of explanatory prose in `my-writing-style`, at least one `<PythonRunner client:visible />`, one `<ColabButton />`, one markdown reference table, and one `<QuizCard client:visible />`, with zero unescaped `$` currency collisions and zero `.ref/` mentions.
- **SC-003 (Typecheck & Static Build)**: `pnpm astro check` reports 0 errors and `pnpm build` compiles all static pages (including `/learn/harness-engineering` and all 24 lesson routes) cleanly with exit code 0.
- **SC-004 (Notebook & Python Validity)**: All 24 `.ipynb` files parse as valid JSON matching `nbformat: 4`, and every embedded Python snippet in `<PythonRunner />` and `.ipynb` code cells passes `ast.parse()` syntax validation with 0 errors.
- **SC-005 (Accessibility & Design Gate)**: `buddhi scripts verify-a11y` and `detect_design_md.py --lint` pass with 0 WCAG 2.2 AA violations.

---

## Assumptions

- Learners entering Course 07 have completed or are familiar with Python (`00`), Generative AI (`04`), MCP (`05`), and AI Agents (`06`).
- All hands-on project code runs on free, open-source Python packages (`google-genai`, `fastapi`, `gradio`, `sqlite3`, `chromadb`, `langgraph`, `pytest`) on Google Colab Free Tier CPU without requiring paid cloud subscriptions or local Electron GUI display servers.
