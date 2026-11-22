# Tasks: Course 06 — AI Agents for Beginners (`ai-agents-for-beginners`)

**Input**: Design documents from `.buddhi/specs/016-create-full-course/`
**Prerequisites**: [spec.md](file:///c:/DevDojo/Buddhi/bl-academy/.buddhi/specs/016-create-full-course/spec.md), [plan.md](file:///c:/DevDojo/Buddhi/bl-academy/.buddhi/specs/016-create-full-course/plan.md)

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 [P] Create course directories `src/content/lessons/ai-agents-for-beginners/` and `notebook/ai-agents-for-beginners/`
- [x] T002 [P] Create automated course verification script `verify_course_06.py` validating frontmatter schema (`src/content.config.ts`), sequential `order: 1..19`, `prerequisites` chain starting from `mcp-for-beginners/22-zava-retail-testing-observability-and-production-optimization`, word count (`>= 350` words), `H2` → `H3` heading hierarchy, `<PythonRunner />` `initialCode` vs `expectedOutput` deterministic execution (`< 2.0s`), `<ColabButton />` & `<QuizCard />` presence, `nbformat == 4` `.ipynb` JSON validity & self-contained dataset/SQLite/receipt fixture & `GEMINI_API_KEY` fallback checks, and zero forbidden `.ref/` or proprietary Microsoft Foundry / Foundry Agent Service / Microsoft Agent Framework / Foundry Local / Azure OpenAI / Azure AI Search / Bing Grounding / Project Opal terms

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T003 Update `ai-agents-for-beginners` entry in `src/lib/curriculum.ts` (`plannedLessonCount: 19`, `runtimeBadges: ['In-Browser Pyodide', 'Google AI Studio Free Tier', 'Colab Free CPU', 'Colab Free T4 GPU']`, `usesGeminiApi: true`, and 5 `syllabusModules` matching Lessons `01`–`19`)

## Phase 3: User Story 1 - Module 1: Agent Foundations, Frameworks & Core Design Patterns (Priority: P1) 🎯 MVP

**Goal**: Deliver Lessons `01–04` and their companion Colab notebooks covering Google AI Studio & Colab Setup, AI Agent taxonomies & smoke tests, Agentic Frameworks vs. Stateful Thread/Run Runtimes, and Human-Centric Agentic Design Principles.
**Independent Test**: Verify `src/content/lessons/ai-agents-for-beginners/01..04.mdx` and `notebook/ai-agents-for-beginners/01..04.ipynb` via `python verify_course_06.py` and `pnpm astro check`.

- [x] T004 [P] [US1] Author Lesson 01 (`src/content/lessons/ai-agents-for-beginners/01-course-setup-colab-and-gemini-agent-stack.mdx`) + Colab notebook (`notebook/ai-agents-for-beginners/01-course-setup-colab-and-gemini-agent-stack.ipynb`)
- [x] T005 [P] [US1] Author Lesson 02 (`src/content/lessons/ai-agents-for-beginners/02-introduction-to-ai-agents-and-use-cases.mdx`) + Colab notebook (`notebook/ai-agents-for-beginners/02-introduction-to-ai-agents-and-use-cases.ipynb`)
- [x] T006 [P] [US1] Author Lesson 03 (`src/content/lessons/ai-agents-for-beginners/03-exploring-ai-agentic-frameworks.mdx`) + Colab notebook (`notebook/ai-agents-for-beginners/03-exploring-ai-agentic-frameworks.ipynb`)
- [x] T007 [P] [US1] Author Lesson 04 (`src/content/lessons/ai-agents-for-beginners/04-ai-agentic-design-principles.mdx`) + Colab notebook (`notebook/ai-agents-for-beginners/04-ai-agentic-design-principles.ipynb`)
- [x] T008 [US1] Verify US1 MVP slice (`01`–`04`) via `python verify_course_06.py` and `pnpm astro check`

## Phase 4: User Story 2 - Module 2: Tool Use, Agentic RAG & Trustworthy Agents (Priority: P2)

**Goal**: Deliver Lessons `05–07` and companion Colab notebooks covering Function Calling, MCP Streamable HTTP tools & read-only SQL guards, Iterative Maker-Checker Agentic RAG, and the 4-Step Meta System Message Framework + 5-Threat Defense & HITL gates.
**Independent Test**: Verify `05..07.mdx` and `05..07.ipynb` via `python verify_course_06.py`.

- [x] T009 [P] [US2] Author Lesson 05 (`src/content/lessons/ai-agents-for-beginners/05-tool-use-design-pattern.mdx`) + Colab notebook (`notebook/ai-agents-for-beginners/05-tool-use-design-pattern.ipynb`)
- [x] T010 [P] [US2] Author Lesson 06 (`src/content/lessons/ai-agents-for-beginners/06-agentic-rag.mdx`) + Colab notebook (`notebook/ai-agents-for-beginners/06-agentic-rag.ipynb`)
- [x] T011 [P] [US2] Author Lesson 07 (`src/content/lessons/ai-agents-for-beginners/07-building-trustworthy-ai-agents.mdx`) + Colab notebook (`notebook/ai-agents-for-beginners/07-building-trustworthy-ai-agents.ipynb`)
- [x] T012 [US2] Verify US2 slice (`05`–`07`) via `python verify_course_06.py`

## Phase 5: User Story 3 - Module 3: Planning, Multi-Agent Systems, Metacognition & Production Observability (Priority: P3)

**Goal**: Deliver Lessons `08–11` and companion Colab notebooks covering Pydantic `TravelPlan` Decomposition & Iterative Re-Planning, Multi-Agent Group Chat/Handoff/Collaborative Filtering & 15-Agent Topologies, Metacognitive Self-Reflection/Corrective RAG/Intent Search/SQL RAG, and OpenTelemetry Observability + Offline/Online Evaluation & Cost Routing.
**Independent Test**: Verify `08..11.mdx` and `08..11.ipynb` via `python verify_course_06.py`.

- [x] T013 [P] [US3] Author Lesson 08 (`src/content/lessons/ai-agents-for-beginners/08-planning-design-pattern.mdx`) + Colab notebook (`notebook/ai-agents-for-beginners/08-planning-design-pattern.ipynb`)
- [x] T014 [P] [US3] Author Lesson 09 (`src/content/lessons/ai-agents-for-beginners/09-multi-agent-design-patterns.mdx`) + Colab notebook (`notebook/ai-agents-for-beginners/09-multi-agent-design-patterns.ipynb`)
- [x] T015 [P] [US3] Author Lesson 10 (`src/content/lessons/ai-agents-for-beginners/10-metacognition-in-ai-agents.mdx`) + Colab notebook (`notebook/ai-agents-for-beginners/10-metacognition-in-ai-agents.ipynb`)
- [x] T016 [P] [US3] Author Lesson 11 (`src/content/lessons/ai-agents-for-beginners/11-ai-agents-in-production-observability-and-evaluation.mdx`) + Colab notebook (`notebook/ai-agents-for-beginners/11-ai-agents-in-production-observability-and-evaluation.ipynb`)
- [x] T017 [US3] Verify US3 slice (`08`–`11`) via `python verify_course_06.py`

## Phase 6: User Story 4 - Module 4: Agentic Protocols, Context Engineering, Memory & Graph Workflows (Priority: P4)

**Goal**: Deliver Lessons `12–15` and companion Colab notebooks covering MCP/A2A/NLWeb Protocols, Context Engineering & 4-Failure Mitigation, Agentic Memory with Mem0 & Cognee Knowledge Graphs, and Open-Source Agent Workflows, Middleware, 5-Edge Graphs & LangGraph `/responses` Hosting.
**Independent Test**: Verify `12..15.mdx` and `12..15.ipynb` via `python verify_course_06.py`.

- [x] T018 [P] [US4] Author Lesson 12 (`src/content/lessons/ai-agents-for-beginners/12-agentic-protocols-mcp-a2a-and-nlweb.mdx`) + Colab notebook (`notebook/ai-agents-for-beginners/12-agentic-protocols-mcp-a2a-and-nlweb.ipynb`)
- [x] T019 [P] [US4] Author Lesson 13 (`src/content/lessons/ai-agents-for-beginners/13-context-engineering-for-ai-agents.mdx`) + Colab notebook (`notebook/ai-agents-for-beginners/13-context-engineering-for-ai-agents.ipynb`)
- [x] T020 [P] [US4] Author Lesson 14 (`src/content/lessons/ai-agents-for-beginners/14-managing-agentic-memory.mdx`) + Colab notebook (`notebook/ai-agents-for-beginners/14-managing-agentic-memory.ipynb`)
- [x] T021 [P] [US4] Author Lesson 15 (`src/content/lessons/ai-agents-for-beginners/15-open-source-agent-workflows-middleware-and-langgraph.mdx`) + Colab notebook (`notebook/ai-agents-for-beginners/15-open-source-agent-workflows-middleware-and-langgraph.ipynb`)
- [x] T022 [US4] Verify US4 slice (`12`–`15`) via `python verify_course_06.py`

## Phase 7: User Story 5 - Module 5: Computer Use, Scalable Deployment, Local SLM Agents & Cryptographic Security (Priority: P5)

**Goal**: Deliver Lessons `16–19` and companion Colab notebooks covering Hybrid Browser-Use & Playwright CDP Computer Use Agents, Scalable Production Support & SaaS Billing Agents with Evaluation Gates & Smoke Tests, Local On-Device Qwen Function-Calling Agents with Ollama & ChromaDB, and RFC 8785 JCS + Ed25519 Cryptographic Receipts & Human Approval Binding, linking forward to Course 07 (`harness-engineering`).
**Independent Test**: Verify `16..19.mdx` and `16..19.ipynb` via `python verify_course_06.py` and confirm Lesson 19 links forward to Course 07.

- [x] T023 [P] [US5] Author Lesson 16 (`src/content/lessons/ai-agents-for-beginners/16-building-computer-use-agents.mdx`) + Colab notebook (`notebook/ai-agents-for-beginners/16-building-computer-use-agents.ipynb`)
- [x] T024 [P] [US5] Author Lesson 17 (`src/content/lessons/ai-agents-for-beginners/17-deploying-scalable-agents-in-production.mdx`) + Colab notebook (`notebook/ai-agents-for-beginners/17-deploying-scalable-agents-in-production.ipynb`)
- [x] T025 [P] [US5] Author Lesson 18 (`src/content/lessons/ai-agents-for-beginners/18-creating-local-ai-agents-with-ollama-and-qwen.mdx`) + Colab notebook (`notebook/ai-agents-for-beginners/18-creating-local-ai-agents-with-ollama-and-qwen.ipynb`)
- [x] T026 [P] [US5] Author Lesson 19 (`src/content/lessons/ai-agents-for-beginners/19-securing-ai-agents-with-cryptographic-receipts.mdx`) + Colab notebook (`notebook/ai-agents-for-beginners/19-securing-ai-agents-with-cryptographic-receipts.ipynb`)
- [x] T027 [US5] Verify US5 slice (`16`–`19`) via `python verify_course_06.py`

## Phase 8: Polish & Cross-Cutting Verification

- [x] T028 Run full-course validation script `python verify_course_06.py` across all 19 `.mdx` files and 19 `.ipynb` notebooks (`0` errors, `0` forbidden terms)
- [x] T029 Run `pnpm astro check` and `pnpm build` via `terminal-runner` (`0` errors, static HTML generated for `/learn/ai-agents-for-beginners` and all 19 lessons)
- [x] T030 Run design & A11Y static checks (`detect_design_md.py --lint` and `buddhi scripts verify-a11y`) via `terminal-runner`
- [x] T031 Clean up temporary workspace verification script `verify_course_06.py` and confirm clean git status

---

## Dependencies & Execution Order

- **Phase 1 (`T001–T002`)** → **Phase 2 (`T003`)** (blocks all user stories) → **Phases 3–7 (`US1`–`US5`)** (each module slice can execute in parallel once `T001–T003` are complete, with lesson tasks `[P]` parallelized within each module) → **Phase 8 (`T028–T031`)**.
