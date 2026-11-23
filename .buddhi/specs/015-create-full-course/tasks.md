# Tasks: Course 05 — MCP for Beginners (`mcp-for-beginners`)

**Input**: Design documents from `.buddhi/specs/015-create-full-course/`
**Prerequisites**: [spec.md](file:///C:/DevDojo/Buddhi/bl-academy/.buddhi/specs/015-create-full-course/spec.md), [plan.md](file:///C:/DevDojo/Buddhi/bl-academy/.buddhi/specs/015-create-full-course/plan.md)

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 [P] Create course directories `src/content/lessons/mcp-for-beginners/` and `notebook/mcp-for-beginners/`
- [x] T002 [P] Create automated course verification script `verify_course_05.py` validating frontmatter schema (`src/content.config.ts`), sequential `order: 1..22`, `prerequisites` chain starting from `generative-ai-for-beginners/22-building-with-meta-llama-models`, word count (`>= 350` words), `H2` → `H3` heading hierarchy, `<PythonRunner />` `initialCode` vs `expectedOutput` deterministic execution (`< 2.0s`), `<ColabButton />` & `<QuizCard />` presence, `nbformat == 4` `.ipynb` JSON validity & self-contained Zava Retail SQLite/OAuth/dataset & `GEMINI_API_KEY` fallback checks, and zero forbidden `.ref/` or proprietary Microsoft Foundry / Azure / Entra ID / APIM / Application Insights terms

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T003 Update `mcp-for-beginners` entry in `src/lib/curriculum.ts` (`plannedLessonCount: 22`, `runtimeBadges: ['In-Browser Pyodide', 'Google AI Studio Free Tier', 'Colab Free CPU']`, `usesGeminiApi: true`, and 5 `syllabusModules` matching Lessons `01`–`22`)

## Phase 3: User Story 1 - Module 1: MCP Foundations, Specification 2026-07-28 & Security (Priority: P1) 🎯 MVP

- [x] T004 [P] [US1] Author Lesson 01 (`src/content/lessons/mcp-for-beginners/01-introduction-to-mcp-and-setup.mdx`) + Colab notebook (`notebook/mcp-for-beginners/01-introduction-to-mcp-and-setup.ipynb`)
- [x] T005 [P] [US1] Author Lesson 02 (`src/content/lessons/mcp-for-beginners/02-core-concepts-primitives-and-json-rpc.mdx`) + Colab notebook (`notebook/mcp-for-beginners/02-core-concepts-primitives-and-json-rpc.ipynb`)
- [x] T006 [P] [US1] Author Lesson 03 (`src/content/lessons/mcp-for-beginners/03-mcp-2026-07-28-stateless-protocol-and-extensions.mdx`) + Colab notebook (`notebook/mcp-for-beginners/03-mcp-2026-07-28-stateless-protocol-and-extensions.ipynb`)
- [x] T007 [P] [US1] Author Lesson 04 (`src/content/lessons/mcp-for-beginners/04-mcp-security-owasp-top-10-and-cimd-auth.mdx`) + Colab notebook (`notebook/mcp-for-beginners/04-mcp-security-owasp-top-10-and-cimd-auth.ipynb`)
- [x] T008 [US1] Verify US1 MVP slice (`01`–`04`) via `python verify_course_05.py` and `pnpm astro check`

## Phase 4: User Story 2 - Module 2: Building MCP Servers, Clients, Gemini Hosts & Transports (Priority: P2)

- [x] T009 [P] [US2] Author Lesson 05 (`src/content/lessons/mcp-for-beginners/05-building-your-first-mcp-server-with-fastmcp.mdx`) + Colab notebook (`notebook/mcp-for-beginners/05-building-your-first-mcp-server-with-fastmcp.ipynb`)
- [x] T010 [P] [US2] Author Lesson 06 (`src/content/lessons/mcp-for-beginners/06-building-mcp-clients-and-gemini-llm-hosts.mdx`) + Colab notebook (`notebook/mcp-for-beginners/06-building-mcp-clients-and-gemini-llm-hosts.ipynb`)
- [x] T011 [P] [US2] Author Lesson 07 (`src/content/lessons/mcp-for-beginners/07-stdio-and-streamable-http-transports.mdx`) + Colab notebook (`notebook/mcp-for-beginners/07-stdio-and-streamable-http-transports.ipynb`)
- [x] T012 [P] [US2] Author Lesson 08 (`src/content/lessons/mcp-for-beginners/08-testing-and-debugging-with-mcp-inspector.mdx`) + Colab notebook (`notebook/mcp-for-beginners/08-testing-and-debugging-with-mcp-inspector.ipynb`)
- [x] T013 [P] [US2] Author Lesson 09 (`src/content/lessons/mcp-for-beginners/09-authentication-rbac-mcp-hosts-and-deployment.mdx`) + Colab notebook (`notebook/mcp-for-beginners/09-authentication-rbac-mcp-hosts-and-deployment.ipynb`)
- [x] T014 [P] [US2] Author Lesson 10 (`src/content/lessons/mcp-for-beginners/10-client-sampling-and-interactive-mcp-apps.mdx`) + Colab notebook (`notebook/mcp-for-beginners/10-client-sampling-and-interactive-mcp-apps.ipynb`)
- [x] T015 [US2] Verify US2 slice (`05`–`10`) via `python verify_course_05.py`

## Phase 5: User Story 3 - Module 3: Practical Implementation, Pagination & Protocol Features (Priority: P3)

- [x] T016 [P] [US3] Author Lesson 11 (`src/content/lessons/mcp-for-beginners/11-practical-implementation-sdks-and-api-gateways.mdx`) + Colab notebook (`notebook/mcp-for-beginners/11-practical-implementation-sdks-and-api-gateways.ipynb`)
- [x] T017 [P] [US3] Author Lesson 12 (`src/content/lessons/mcp-for-beginners/12-cursor-based-pagination-and-large-result-sets.mdx`) + Colab notebook (`notebook/mcp-for-beginners/12-cursor-based-pagination-and-large-result-sets.ipynb`)
- [x] T018 [P] [US3] Author Lesson 13 (`src/content/lessons/mcp-for-beginners/13-protocol-features-progress-cancellation-and-templates.mdx`) + Colab notebook (`notebook/mcp-for-beginners/13-protocol-features-progress-cancellation-and-templates.ipynb`)
- [x] T019 [US3] Verify US3 slice (`11`–`13`) via `python verify_course_05.py`

## Phase 6: User Story 4 - Module 4: Advanced Topics: Multi-Modal, OAuth 2.1, Context Engineering & Debate Agents (Priority: P4)

- [x] T020 [P] [US4] Author Lesson 14 (`src/content/lessons/mcp-for-beginners/14-multimodal-workflows-realtime-streaming-and-web-search.mdx`) + Colab notebook (`notebook/mcp-for-beginners/14-multimodal-workflows-realtime-streaming-and-web-search.ipynb`)
- [x] T021 [P] [US4] Author Lesson 15 (`src/content/lessons/mcp-for-beginners/15-oauth2-oidc-security-and-identity-hardening.mdx`) + Colab notebook (`notebook/mcp-for-beginners/15-oauth2-oidc-security-and-identity-hardening.ipynb`)
- [x] T022 [P] [US4] Author Lesson 16 (`src/content/lessons/mcp-for-beginners/16-context-engineering-root-contexts-and-sampling-migration.mdx`) + Colab notebook (`notebook/mcp-for-beginners/16-context-engineering-root-contexts-and-sampling-migration.ipynb`)
- [x] T023 [P] [US4] Author Lesson 17 (`src/content/lessons/mcp-for-beginners/17-routing-scaling-custom-transports-and-adversarial-agents.mdx`) + Colab notebook (`notebook/mcp-for-beginners/17-routing-scaling-custom-transports-and-adversarial-agents.ipynb`)
- [x] T024 [US4] Verify US4 slice (`14`–`17`) via `python verify_course_05.py`

## Phase 7: User Story 5 - Module 5: Best Practices, Case Studies & Zava Retail Database Capstone Labs (Priority: P5)

- [x] T025 [P] [US5] Author Lesson 18 (`src/content/lessons/mcp-for-beginners/18-community-early-adopters-best-practices-and-reliability-sidecars.mdx`) + Colab notebook (`notebook/mcp-for-beginners/18-community-early-adopters-best-practices-and-reliability-sidecars.ipynb`)
- [x] T026 [P] [US5] Author Lesson 19 (`src/content/lessons/mcp-for-beginners/19-real-world-case-studies-workshops-and-safe-write-servers.mdx`) + Colab notebook (`notebook/mcp-for-beginners/19-real-world-case-studies-workshops-and-safe-write-servers.ipynb`)
- [x] T027 [P] [US5] Author Lesson 20 (`src/content/lessons/mcp-for-beginners/20-zava-retail-database-mcp-architecture-and-rls.mdx`) + Colab notebook (`notebook/mcp-for-beginners/20-zava-retail-database-mcp-architecture-and-rls.ipynb`)
- [x] T028 [P] [US5] Author Lesson 21 (`src/content/lessons/mcp-for-beginners/21-zava-retail-fastmcp-tools-and-semantic-vector-search.mdx`) + Colab notebook (`notebook/mcp-for-beginners/21-zava-retail-fastmcp-tools-and-semantic-vector-search.ipynb`)
- [x] T029 [P] [US5] Author Lesson 22 (`src/content/lessons/mcp-for-beginners/22-zava-retail-testing-observability-and-production-optimization.mdx`) + Colab notebook (`notebook/mcp-for-beginners/22-zava-retail-testing-observability-and-production-optimization.ipynb`)
- [x] T030 [US5] Verify US5 slice (`18`–`22`) via `python verify_course_05.py`

## Phase 8: Polish & Cross-Cutting Verification

- [x] T031 Run full-course validation script `python verify_course_05.py` across all 22 `.mdx` files and 22 `.ipynb` notebooks (`0` errors, `0` forbidden terms)
- [x] T032 Run `pnpm astro check` and `pnpm build` via `terminal-runner` (`0` errors, static HTML generated for `/learn/mcp-for-beginners` and all 22 lessons)
- [x] T033 Run design & A11Y static checks (`detect_design_md.py --lint` and `buddhi scripts verify-a11y`) via `terminal-runner` (note: `detect_design_md.py` requires `buddhi` env; `verify-a11y` reported 0 errors in Course 05 MDX/TSX files)
- [x] T034 Clean up temporary workspace verification script `verify_course_05.py` and confirm clean git status
