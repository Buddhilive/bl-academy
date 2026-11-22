# Implementation Plan: Course 05 — MCP for Beginners (`mcp-for-beginners`)

**Branch**: `015-create-full-course` | **Date**: 2026-11-22 | **Spec**: [spec.md](file:///C:/DevDojo/Buddhi/bl-academy/.buddhi/specs/015-create-full-course/spec.md)

**Input**: Feature specification from `/.buddhi/specs/015-create-full-course/spec.md`

---

## Summary

Deliver the complete 22-lesson **Course 05: MCP for Beginners** (`track: "mcp-for-beginners"`) curriculum and 22 companion **Google Colab Free Tier** Jupyter notebooks (`./notebook/mcp-for-beginners/<slug>.ipynb`), grounded in `.ref/mcp-for-beginners/` (`00-Introduction` through `12-tooling`, including the `2026-07-28` stateless specification updates, the `CIMD vs. DCR` OAuth 2.1 security sample, all 15 `03-GettingStarted` guides, `04-PracticalImplementation` pagination & SDK guides, all 17 `05-AdvancedTopics` deep-dives, `08-BestPractices` reliability sidecar pattern, `09-CaseStudy` 8 real-world architectures, `10` 4-lab workshop, and `11-MCPServerHandsOnLabs` 13-lab Zava Retail PostgreSQL/vector database capstone).

Every lesson is authored as an Astro Content Collection `.mdx` file under `src/content/lessons/mcp-for-beginners/` using the `my-writing-style` skill, includes KaTeX mathematical and algorithmic definitions, structured reference tables (including Python, TypeScript, C#, Java Spring, Rust, and Go SDK comparisons), a fast pure-Python `<PythonRunner client:visible />` in-browser sandbox (`json`, `sqlite3`, `hashlib`, `base64`, `re`, `math`, `statistics`, `urllib.parse`, `dataclasses`, `typing`), a `<ColabButton />` deep-link to its self-contained Google AI Studio (`google-genai`) / `mcp` (`FastMCP`) / `httpx` / `fastapi` / `PyJWT` / `sqlite3` / `chromadb` / `opentelemetry-api` Colab notebook, and a `<QuizCard client:visible />` assessment. Proprietary cloud dependencies (Microsoft Foundry, Microsoft Foundry Toolkit, Azure OpenAI Service, Azure AI Content Safety, Microsoft Prompt Shields, Microsoft Entra ID, Azure Key Vault, Azure API Management, Azure Container Apps, Azure Functions, and Azure Application Insights) are replaced with open-source Python frameworks on **Google Colab Free Tier** (CPU) and **Google AI Studio Free Tier** (`GEMINI_API_KEY` via `google-genai` SDK).

---

## Technical Context

**Language/Version**: TypeScript 5.9.3, Astro 7.4.4, React 19.3.1, MDX (`@astrojs/mdx` 8.1.2), Python 3.11+ (Pyodide v0.26+ in-browser Web Worker & Jupyter `nbformat` v4 notebooks)

**Primary Dependencies**:
- **Frontend / SSG**: `astro`, `@astrojs/mdx`, `@astrojs/react`, `@astrojs/tailwind`, `remark-math`, `rehype-katex`, `katex`, `@uiw/react-codemirror`
- **Colab Notebook Stack (Free Tier)**: `mcp` (`FastMCP`), `google-genai`, `python-dotenv`, `httpx`, `fastapi`, `uvicorn`, `pydantic`, `PyJWT`, `cryptography`, `sqlite3`, `numpy`, `chromadb`, `pytest`, `pytest-asyncio`, `opentelemetry-api`, `opentelemetry-sdk`

**Storage**: Static Git-tracked files (`src/content/lessons/mcp-for-beginners/*.mdx`, `notebook/mcp-for-beginners/*.ipynb`, `src/lib/curriculum.ts`) + browser `localStorage` for Pathfinder XP progress

**Testing & Verification**:
- `pnpm astro check` (Astro content collection Zod schema + TypeScript validation)
- `pnpm build` (Static site generation across all 22 new lesson routes + course hub `/learn/mcp-for-beginners`)
- Automated Python verification script (`verify_course_05.py`) checking all 22 `.mdx` files (frontmatter schema, sequential `order: 1..22`, `prerequisites` chain starting from `["generative-ai-for-beginners/22-building-with-meta-llama-models"]`, word count >= 350 words, component imports/usages, deterministic execution of `initialCode` matching `expectedOutput` in `< 2.0s`, zero forbidden upstream/Azure/Foundry/Entra/APIM terms) and all 22 `.ipynb` notebooks (valid JSON `nbformat: 4`, self-contained datasets and Zava Retail SQLite seed data, graceful `GEMINI_API_KEY` fallback, zero broken local relative file paths)
- Accessibility & Design Token Gates: `uv run --with "buddhi-ai[MCP]" python .agents/skills/design-md/scripts/detect_design_md.py --lint` and `buddhi scripts verify-a11y`

**Target Platform**: Static Web (SSG) + In-Browser WebAssembly (`Pyodide` Web Worker) + Google Colab Free Tier (CPU) + Google AI Studio Free Tier (`GEMINI_API_KEY`)

**Project Type**: Static Educational Web Application & Interactive Curriculum Platform

**Performance Goals**:
- Zero main-thread blocking on page load (`client:visible` hydration for `PythonRunner` and `QuizCard`)
- Every `<PythonRunner />` `initialCode` executes deterministically in `< 2.0s` (well inside the hard 5-second `pyodide.worker.ts` timeout)
- Zero Cumulative Layout Shift (`CLS = 0`) across lesson pages and `AdSlot` containers

**Constraints**:
- Zero mentions of `.ref/`, `microsoft/mcp-for-beginners`, Microsoft Foundry, Microsoft Foundry Toolkit, Azure OpenAI, Azure AI Content Safety, Microsoft Prompt Shields, Microsoft Entra ID, Azure Key Vault, Azure API Management, Azure Container Apps, Azure Application Insights, or `learn.microsoft.com` in lesson prose or notebooks (credits live solely in `ACKNOWLEDGEMENTS.md`)
- Self-contained `.ipynb` notebooks: must embed or deterministically synthesize all datasets, OAuth JWKS/JWT test fixtures, reliability sidecar SQLite tables, and the Zava Retail multi-store (`seattle`, `redmond`, `bellevue`, `online`) database and product embeddings so they execute out-of-the-box on Google Colab Free Tier without Docker or external database setup
- Strict WCAG 2.2 AA contrast and heading hierarchy (`H1` rendered by `LessonLayout.astro`, so MDX bodies use `H2` → `H3` without skipping levels)

**Scale/Scope**:
- 1 curriculum registry update (`src/lib/curriculum.ts`)
- 22 `.mdx` tutorial lessons (`src/content/lessons/mcp-for-beginners/01-*.mdx` through `22-*.mdx`)
- 22 `.ipynb` companion Google Colab notebooks (`notebook/mcp-for-beginners/01-*.ipynb` through `22-*.ipynb`)

---

## Multi-Angle Architectural Evaluation & System Design

### 1. Architectural Lenses
- **Fewest-Slices Lens**: Reuse existing layout and interactive components (`LessonLayout.astro`, `LessonSidebar.astro`, `ColabButton.astro`, `PythonRunner.tsx`, `QuizCard.tsx`) with zero new npm dependencies or UI component changes. Updating `src/lib/curriculum.ts` and adding `.mdx` files under `src/content/lessons/mcp-for-beginners/` automatically populates `/learn/mcp-for-beginners`, the left sidebar, the Pathfinder progress bar, and the cross-course handoff links from Course 04 (`generative-ai-for-beginners/22-building-with-meta-llama-models`) and into Course 06 (`ai-agents-for-beginners`).
- **Risk-First Lens**:
  1. *Pyodide 5s Timeout & No Subprocess/Socket Network Access in Browser Web Worker*: The `mcp` (`FastMCP`) package, `google-genai`, `httpx`, `fastapi`, and `chromadb` use async network sockets or subprocess `stdio` pipes that cannot run inside the 5-second browser Pyodide Web Worker (`src/workers/pyodide.worker.ts`). **Mitigation**: Each lesson's `<PythonRunner />` uses Python's standard library (`json`, `sqlite3`, `hashlib`, `base64`, `re`, `math`, `statistics`, `urllib.parse`, `dataclasses`, `typing`) to execute the exact protocol, cryptographic, and database mechanics—$M \times N$ vs. $M + N$ matrix reduction, JSON-RPC 2.0 primitive dispatchers (`resources/read`, `prompts/get`, `tools/call`) with Tool Annotations, `2026-07-28` stateless `_meta` + `Mcp-Method`/`Mcp-Name` header validation + `InputRequiredResult` multi-round-trip elicitation, CIMD vs. DCR classification + Spotlighting prompt shields + tool-schema hash pinning, FastMCP calculator & schema validator, Gemini LLM Host tool-call router, `stdio` vs. Streamable HTTP SSE framing, automated conformance & Inspector test runner, JWT + RBAC middleware & `.vscode/mcp.json` generator, `ui://` MCP App HTML manifest compiler, token-bucket API Gateway rate limiter, base64 opaque cursor pagination, `notifications/progress` + cooperative cancellation + RFC 6570 URI template matcher + Tasks state machine, multimodal `ImageContent` & search orchestrator, OAuth 2.1 S256 PKCE & RFC 9207 `iss` validator, Context Utilization Ratio & Token Efficiency calculator, 3-agent Adversarial Debate simulator, SQLite Reliability Sidecar idempotency guard, Write-Capable Social Publishing server with `playground` no-op target, and the 3-part Zava Retail Multi-Tenant SQLite + Row-Level Security + Cosine Semantic Search + OpenTelemetry P95 latency suite—deterministically in `< 150ms` with exact `expectedOutput`, while full `mcp` (`FastMCP`) and `google-genai` workflows run in the linked Colab `.ipynb` notebook.
  2. *Docker & PostgreSQL/`pgvector` Dependency in Reference Module 11 (`11-MCPServerHandsOnLabs`)*: Google Colab Free Tier does not support running Docker Desktop containers (`docker-compose up` for PostgreSQL + `pgvector`). **Mitigation**: Lessons `20–22` teach the complete production PostgreSQL + `pgvector` + `CREATE POLICY` Row-Level Security SQL DDL in prose and reference tables, while pairing it in both `<PythonRunner />` and the Colab notebooks (`20`–`22`) with a 100% self-contained **Python `sqlite3` Multi-Tenant Retail Database Engine** (enforcing store-level RLS context isolation across `seattle`, `redmond`, `bellevue`, and `online` stores) plus **`google-genai` (`gemini-embedding-001`) / `ChromaDB` / NumPy cosine similarity vector search**.
  3. *Missing `GEMINI_API_KEY` in Google Colab*: Every notebook that uses `google-genai` includes a `get_gemini_client()` helper that reads `google.colab.userdata.get('GEMINI_API_KEY')` or `os.environ.get('GEMINI_API_KEY')` and falls back cleanly to a deterministic offline simulation mode if a learner clicks "Run All" before configuring their free API key.
- **Seam-Quality Lens**: Clean 1-to-1 slug parity (`<slug>.mdx` ↔ `notebook/mcp-for-beginners/<slug>.ipynb`) across all 22 lessons (`01` through `22`).

### 2. System Design Trade-Off Analysis (`system-design`)

| Decision Area | Option A (Chosen) | Option B (Rejected) | Trade-off Rationale |
| :--- | :--- | :--- | :--- |
| **LLM Host & Sampling Provider (Lessons 01, 06, 10, 14, 16, 17, 19, 21)** | **Google AI Studio Free Tier** (`google-genai` SDK with `GEMINI_API_KEY`, `gemini-2.5-flash`, and `gemini-embedding-001`) + Colab Secrets guide | Azure OpenAI Service / GitHub Models / Microsoft Foundry Agent Service | Google AI Studio provides a generous free tier requiring no credit card or Azure subscription, while supporting native function calling (`types.Tool`), structured Pydantic schemas, multimodal vision, and text embeddings (`gemini-embedding-001`). |
| **Security, Auth & API Gateway Stack (Lessons 04, 09, 11, 15)** | Open-source **Python Spotlighting/Datamarking prompt shields + CIMD/OAuth 2.1 S256 PKCE + `PyJWT`/`cryptography` + FastAPI Reverse-Proxy MCP Gateway** | Azure AI Content Safety, Microsoft Prompt Shields, Microsoft Entra ID, Azure Key Vault, and Azure API Management (APIM) | Runs 100% in Python on Google Colab Free Tier with zero external cloud tenants while teaching the exact cryptographic and protocol mechanisms (S256 PKCE, JWKS verification, RFC 9207 `iss` validation, CIMD metadata matching, and token-bucket rate limiting). |
| **Zava Retail Multi-Tenant Database & Semantic Search (Lessons 20–22 / Ref `11`)** | **PostgreSQL + `pgvector` DDL in prose** paired with executable **Python `sqlite3` Multi-Tenant RLS Engine + `gemini-embedding-001` / `ChromaDB` / NumPy Cosine Search + OpenTelemetry tracing** in Pyodide & Colab | Docker Desktop PostgreSQL + `pgvector` container + Azure OpenAI + Azure Container Apps + Application Insights | Docker Desktop cannot run inside Google Colab Free Tier. By teaching the exact PostgreSQL `CREATE POLICY` & `pgvector` `<=>` DDL while running an in-memory/file `sqlite3` RLS engine + vector search in Python, learners get both enterprise SQL mastery and 100% zero-config execution in the browser and Colab. |
| **Multi-Language SDK Coverage (Lessons 02, 05, 07, 11, 12, 13)** | **Python-First Executable Code (`mcp` / `FastMCP`) + Polyglot SDK Reference Tables** (comparing Python, TypeScript, C#, Java Spring, Rust, and Go idioms) | Polyglot Colab Notebooks requiring Node/DotNet/JDK installs inside Colab | Keeps every `<PythonRunner />` sandbox and Colab notebook fast, self-contained, and Pythonic while preserving the reference repo's cross-language SDK patterns in structured comparison tables. |

---

## AGENTS.md & DESIGN.md Compliance Check

*GATE: Verified against `AGENTS.md`, `DESIGN.md`, `A11Y-DECISIONS.md`, and `.agents/rules/`.*

- [x] **Project build & test commands adhered to**: Uses `pnpm astro check` and `pnpm build`.
- [x] **9-Course Sequential Learning Path & Grounding**: Course 05 (`mcp-for-beginners`) connects directly from `generative-ai-for-beginners/22-building-with-meta-llama-models` (`Course 04`) and hands off to `ai-agents-for-beginners` (`Course 06`). All 22 lessons are grounded in `.ref/mcp-for-beginners/` (`00`–`12`) with zero `.ref/` mentions in lesson prose.
- [x] **Content Generation Contract**: Every `.mdx` file validates against `src/content.config.ts`, uses `my-writing-style`, and includes opening hook, KaTeX math/formulas, `<PythonRunner client:visible />`, `<ColabButton course="mcp-for-beginners" />`, reference tables, `<QuizCard client:visible />`, and 350+ words of explanatory prose.
- [x] **Open-Source Colab Free Tier & Google AI Studio Free Tier Stack**: Replaces Microsoft Foundry, Foundry Toolkit, Azure OpenAI, Azure Content Safety, Prompt Shields, Entra ID, Azure API Management, Azure Container Apps, and Application Insights with open-source Python on Colab Free Tier and Google AI Studio Free Tier (`GEMINI_API_KEY` via `google-genai`).
- [x] **Zero-Backend Browser Execution**: Pure client-side Pyodide execution in `/src/workers/pyodide.worker.ts`; zero server-side execution dependencies.
- [x] **Theme, Contrast & Accessibility Strategy (`DESIGN.md` & `A11Y-DECISIONS.md`)**:
  - Reuses accessible `<PythonRunner client:visible />` (Decision 1: Escape key focus-trap release; Decision 3: `aria-live="polite"` output region; Decision 4: reduced-motion confetti guard), `<QuizCard client:visible />` (Decision 2: `role="radiogroup"`, `aria-checked`, polite explanation region), and `<ColabButton />` (Decision 8 & 9: `min-h-[44px]`, forced-colors-safe focus outline, `.sr-only` new-tab announcement, high-contrast runtime metadata).
  - Maintains strict `H2` → `H3` heading hierarchy inside MDX articles (since `LessonLayout.astro` renders `H1`).
  - Uses standard Markdown tables (rendered with semantic `<table>`, `<thead>`, `<th scope="col">`, `<tbody>`) and fences all shell/CLI commands or escapes literal `$` (`\$1`) so `$` never collides with KaTeX math delimiters.
  - Preserves fixed-height `AdSlot.astro` containers for zero CLS.

---

## Project Structure

### Documentation (this feature)

```text
.buddhi/specs/015-create-full-course/
├── spec.md              # Feature specification (22 lessons, 5 user stories, requirements)
├── plan.md              # This implementation plan (/spec-plan output)
└── tasks.md             # Actionable task list (/spec-tasks output)
```

### Source Code (repository root)

```text
src/
├── content.config.ts                                    # Zod schema for lessons collection
├── lib/
│   └── curriculum.ts                                    # Update mcp-for-beginners: plannedLessonCount: 22, runtimeBadges, 5 syllabusModules
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
        └── mcp-for-beginners/                           # 22 MDX lessons (order: 1..22)
            ├── 01-introduction-to-mcp-and-setup.mdx
            ├── 02-core-concepts-primitives-and-json-rpc.mdx
            ├── 03-mcp-2026-07-28-stateless-protocol-and-extensions.mdx
            ├── 04-mcp-security-owasp-top-10-and-cimd-auth.mdx
            ├── 05-building-your-first-mcp-server-with-fastmcp.mdx
            ├── 06-building-mcp-clients-and-gemini-llm-hosts.mdx
            ├── 07-stdio-and-streamable-http-transports.mdx
            ├── 08-testing-and-debugging-with-mcp-inspector.mdx
            ├── 09-authentication-rbac-mcp-hosts-and-deployment.mdx
            ├── 10-client-sampling-and-interactive-mcp-apps.mdx
            ├── 11-practical-implementation-sdks-and-api-gateways.mdx
            ├── 12-cursor-based-pagination-and-large-result-sets.mdx
            ├── 13-protocol-features-progress-cancellation-and-templates.mdx
            ├── 14-multimodal-workflows-realtime-streaming-and-web-search.mdx
            ├── 15-oauth2-oidc-security-and-identity-hardening.mdx
            ├── 16-context-engineering-root-contexts-and-sampling-migration.mdx
            ├── 17-routing-scaling-custom-transports-and-adversarial-agents.mdx
            ├── 18-community-early-adopters-best-practices-and-reliability-sidecars.mdx
            ├── 19-real-world-case-studies-workshops-and-safe-write-servers.mdx
            ├── 20-zava-retail-database-mcp-architecture-and-rls.mdx
            ├── 21-zava-retail-fastmcp-tools-and-semantic-vector-search.mdx
            └── 22-zava-retail-testing-observability-and-production-optimization.mdx

notebook/
└── mcp-for-beginners/                                   # 22 self-contained Colab notebooks (nbformat v4)
    ├── 01-introduction-to-mcp-and-setup.ipynb
    ├── 02-core-concepts-primitives-and-json-rpc.ipynb
    ├── 03-mcp-2026-07-28-stateless-protocol-and-extensions.ipynb
    ├── 04-mcp-security-owasp-top-10-and-cimd-auth.ipynb
    ├── 05-building-your-first-mcp-server-with-fastmcp.ipynb
    ├── 06-building-mcp-clients-and-gemini-llm-hosts.ipynb
    ├── 07-stdio-and-streamable-http-transports.ipynb
    ├── 08-testing-and-debugging-with-mcp-inspector.ipynb
    ├── 09-authentication-rbac-mcp-hosts-and-deployment.ipynb
    ├── 10-client-sampling-and-interactive-mcp-apps.ipynb
    ├── 11-practical-implementation-sdks-and-api-gateways.ipynb
    ├── 12-cursor-based-pagination-and-large-result-sets.ipynb
    ├── 13-protocol-features-progress-cancellation-and-templates.ipynb
    ├── 14-multimodal-workflows-realtime-streaming-and-web-search.ipynb
    ├── 15-oauth2-oidc-security-and-identity-hardening.ipynb
    ├── 16-context-engineering-root-contexts-and-sampling-migration.ipynb
    ├── 17-routing-scaling-custom-transports-and-adversarial-agents.ipynb
    ├── 18-community-early-adopters-best-practices-and-reliability-sidecars.ipynb
    ├── 19-real-world-case-studies-workshops-and-safe-write-servers.ipynb
    ├── 20-zava-retail-database-mcp-architecture-and-rls.ipynb
    ├── 21-zava-retail-fastmcp-tools-and-semantic-vector-search.ipynb
    └── 22-zava-retail-testing-observability-and-production-optimization.ipynb
```

**Structure Decision**: Uses Astro's existing file-based content collection (`src/content/lessons/mcp-for-beginners/<slug>.mdx`) and top-level `./notebook/mcp-for-beginners/<slug>.ipynb` directory so `ColabButton.astro` resolves `https://colab.research.google.com/github/buddhilive/bl-academy/blob/main/notebook/mcp-for-beginners/<slug>.ipynb` without modifying any routing or component code.

---

## Detailed Module & Lesson Implementation Blueprint

### Module 1: MCP Foundations, Specification 2026-07-28 & Security (`category: "Module 1: MCP Foundations, Specification 2026-07-28 & Security"`)
1. **Lesson 01 (`01-introduction-to-mcp-and-setup`, `order: 1`, `xp: 55`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["generative-ai-for-beginners/22-building-with-meta-llama-models"]`
   - **Reference**: `.ref/mcp-for-beginners/README.md`, `study_guide.md`, `00-Introduction/README.md`
   - **Content**: What is the **Model Context Protocol (MCP)** ("USB-C for AI applications"); Why standardization matters for scalable AI pipelines: solving the $M \times N$ fragmentation problem by reducing custom integrations between $M$ AI applications/models and $N$ external tools/data sources from quadratic complexity $C_{\text{custom}} = M \times N$ to linear complexity $C_{\text{MCP}} = M + N$; High-level MCP Architecture (**MCP Hosts**, **MCP Clients**, **MCP Servers**); Detailed breakdown of **MCP Host Components** (`Tool Registry`, `Authentication`, `Request Handler`, `Response Formatter`); The **Two-Layer Protocol Stack**:
     1. *Data Layer*: JSON-RPC 2.0 messages, per-request `_meta`, capability discovery (`server/discover`), and core primitives (**Resources**, **Prompts**, **Tools**, **Elicitation**, plus deprecated **Sampling** & **Roots**).
     2. *Transport Layer*: Local subprocess **`stdio`** and remote **`Streamable HTTP`** (with optional SSE response framing).
     - **Knowledge & Tool Federation ("Universal Connector")**: How Server A and Server B federate tools and knowledge across multi-server agent topologies; Step-by-step onboarding guide for obtaining a free **Google AI Studio API Key (`GEMINI_API_KEY`)**, storing it in **Google Colab Secrets (`google.colab.userdata`)** or local `.env` (`python-dotenv`), and installing the official Python `mcp` SDK (`FastMCP`) and `google-genai`.
   - **Pyodide Sandbox**: Pure-Python $M \times N \rightarrow M + N$ Integration Savings Calculator & MCP Host-Client-Server Federation Simulator that computes connector reduction percentages across enterprise topologies and traces a federated user prompt through `Host (Tool Registry -> Auth -> Request Handler)` across two MCP servers (`ServerA: Knowledge` and `ServerB: Action Tools`) into `Response Formatter`.
   - **Colab Notebook**: `01-introduction-to-mcp-and-setup.ipynb` (Installing `mcp` and `google-genai`, configuring `GEMINI_API_KEY` from Colab Secrets, spinning up a first in-memory MCP tool registry, and connecting it to `gemini-2.5-flash`).
2. **Lesson 02 (`02-core-concepts-primitives-and-json-rpc`, `order: 2`, `xp: 65`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["mcp-for-beginners/01-introduction-to-mcp-and-setup"]`
   - **Reference**: `.ref/mcp-for-beginners/01-CoreConcepts/README.md`
   - **Content**: Deep architectural dive into **Hosts**, **Clients** (logical 1:1 relationship with a server), and **Servers**; The 4 Core Trust & Safety Principles (*User Control and Consent*, *Data Privacy Protection*, *Tool Execution Safety*, *Transport Security*); Comprehensive analysis of the **3 Server Primitives**:
     1. **Resources (`resources/list`, `resources/read`)**: Read-only contextual data identified by URIs (`file://documents/project-spec.md`, `database://production/users/schema`, `api://weather/current`), supporting `text` and base64 `blob` MIME payloads.
     2. **Prompts (`prompts/list`, `prompts/get`)**: Parameterized, reusable interaction workflows and few-shot templates (`Generate a {{task_type}} for {{product}} targeting {{audience}}`).
     3. **Tools (`tools/list`, `tools/call`)**: Model-invoked executable functions validated by **Full JSON Schema 2020-12** (`inputSchema`, `outputSchema`, `structuredContent`) and enriched with **Behavioral Tool Annotations** (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`) and icons.
     - **Client Primitives**: **Elicitation (`elicitation/create`)** for structured user input schemas, plus legacy `2025-11-25` **Sampling (`sampling/createMessage`)** and **Roots (`roots/list`)**; **JSON-RPC 2.0 Wire Framing & Error Codes** (`-32700` Parse Error, `-32600` Invalid Request, `-32601` Method Not Found, `-32602` Invalid Params / Missing Resource per `SEP-2164`, `-32603` Internal Error); Multi-language SDK comparison table (.NET/C#, Java Spring, TypeScript, Python `FastMCP`, Rust).
   - **Pyodide Sandbox**: Pure-Python JSON-RPC 2.0 MCP Protocol Engine implementing `server/discover`, `resources/list`, `resources/read`, `prompts/list`, `prompts/get`, `tools/list`, and `tools/call` with JSON Schema 2020-12 validation, Tool Annotation safety checks (`destructiveHint: True` human-consent gate), and standard JSON-RPC error code responses (`-32601`, `-32602`).
   - **Colab Notebook**: `02-core-concepts-primitives-and-json-rpc.ipynb` (Building and inspecting all 3 Server Primitives + Client Elicitation in Python `FastMCP`, validating JSON Schema 2020-12 `inputSchema`/`outputSchema`, and testing JSON-RPC 2.0 error responses).
3. **Lesson 03 (`03-mcp-2026-07-28-stateless-protocol-and-extensions`, `order: 3`, `xp: 70`, `difficulty: "intermediate"`)**:
   - **Prerequisites**: `["mcp-for-beginners/02-core-concepts-primitives-and-json-rpc"]`
   - **Reference**: `.ref/mcp-for-beginners/01-CoreConcepts/mcp-2026-07-28.md`
   - **Content**: Complete breakdown of **MCP Specification `2026-07-28`** (the largest architectural revision of MCP):
     1. **Stateless Protocol Core (`SEP-2575` & `SEP-2567`)**: Why `2025-11-25` stateful `initialize`/`initialized` handshakes and `Mcp-Session-Id` headers forced sticky load-balancer routing and shared session stores; How `2026-07-28` makes every request self-contained by passing `io.modelcontextprotocol/protocolVersion`, `clientInfo`, and `clientCapabilities` inside `_meta` and using `server/discover` for capability lookup.
     2. **Stateless Protocol, Stateful Applications**: Passing explicit domain handles (`basket_id: "b_123"`, `browser_id`) as ordinary tool arguments across any horizontally scaled server instance.
     3. **Restructured Server-to-Client Requests & Multi-Round-Trip Elicitation (`SEP-2260` & `SEP-2322`)**: Eliminating idle open SSE streams by returning `resultType: "input_required"` with `inputRequests` and an opaque base64 `requestState` token (`\text{requestState} = \text{BASE64}(\text{JSON}(\text{state}))$), which the client echoes back with `inputResponses` on retry to any server replica.
     4. **Routable, Cacheable & Traceable HTTP Traffic**:
        - Required **`Mcp-Method`** and **`Mcp-Name`** HTTP headers (`SEP-2243`) for L7 gateway routing and rate limiting without JSON body inspection (and server rejection when headers disagree with body).
        - List & Resource Caching (`SEP-2549`): `ttlMs` and `cacheScope` (`"private"` vs `"public"`).
        - Distributed Tracing (`SEP-414`): W3C Trace Context (`traceparent`, `tracestate`, `baggage`) in `_meta` for OpenTelemetry spans.
     5. **First-Class Extensions Framework (`SEP-2133`)**: Reverse-DNS extension IDs, independent `ext-*` versioning, **MCP Apps (`SEP-1865`)**, and the **Tasks Extension (`SEP-2663`)** (`tasks/get`, `tasks/update`, `tasks/cancel`, removing `tasks/list`).
     6. **Authorization Hardening, Full JSON Schema 2020-12 (`SEP-2106`), and Feature Lifecycle Policy (`SEP-2577`)**: 12-month deprecation window for **Roots**, **Sampling**, **Logging**, and **Dynamic Client Registration (DCR)** with their modern replacements.
   - **Pyodide Sandbox**: Pure-Python `2026-07-28` Stateless MCP Router, Header/Body Integrity Verifier & Multi-Round-Trip Elicitation Engine that validates `Mcp-Method`/`Mcp-Name` headers against JSON-RPC payloads, evaluates `ttlMs`/`cacheScope` freshness, propagates W3C `traceparent` spans, and executes a 2-round `create_basket` / `delete_files` elicitation flow using base64 `requestState` across simulated stateless worker instances.
   - **Colab Notebook**: `03-mcp-2026-07-28-stateless-protocol-and-extensions.ipynb` (Hands-on migration lab comparing `2025-11-25` session code against `2026-07-28` stateless `_meta` requests, multi-round-trip elicitation, `ttlMs` caching, and Full JSON Schema 2020-12 `$defs`/`oneOf` validation).
4. **Lesson 04 (`04-mcp-security-owasp-top-10-and-cimd-auth`, `order: 4`, `xp: 75`, `difficulty: "intermediate"`)**:
   - **Prerequisites**: `["mcp-for-beginners/03-mcp-2026-07-28-stateless-protocol-and-extensions"]`
   - **Reference**: `.ref/mcp-for-beginners/02-Security/README.md`, `mcp-security-best-practices.md`, `mcp-security-controls.md`, `mcp-best-practices.md`, `samples/cimd-dcr-auth/README.md`
   - **Content**: Defense-in-depth security architecture for MCP ("vulnerable $\rightarrow$ exploit $\rightarrow$ fix $\rightarrow$ validate"); Complete breakdown of the **OWASP MCP Top 10 Security Risks (`MCP01` through `MCP10`)**:
     - `MCP01` Token Mismanagement & Secret Exposure, `MCP02` Privilege Escalation via Scope Creep, `MCP03` Tool Poisoning, `MCP04` Software Supply Chain Attacks, `MCP05` Command Injection & Execution, `MCP06` Intent Flow Subversion, `MCP07` Insufficient AuthN/AuthZ, `MCP08` Lack of Audit & Telemetry, `MCP09` Shadow MCP Servers, `MCP10` Context Injection & Over-Sharing.
     - **Why Token Passthrough Is Explicitly Prohibited**: How accepting upstream client tokens without audience (`aud == MCP_SERVER_URL`) validation breaks audit trails, enables confused-deputy lateral movement, and allows data exfiltration.
     - **AI-Specific Attack Vectors & Open-Source Mitigations**:
       1. *Indirect Prompt Injection (XPIA)* in scraped documents/emails/DB rows $\rightarrow$ mitigated with **Spotlighting & Datamarking Delimiters** (wrapping untrusted external data in randomized boundary tokens and instruction hierarchy rules).
       2. *Tool Poisoning & Dynamic "Rug Pulls"* (hidden malicious instructions in tool descriptions or post-approval remote definition changes) $\rightarrow$ mitigated with **Cryptographic Tool Schema Hash Pinning** ($\text{SHA256}(\text{canonical\_json}(\text{tool}))$) and metadata sanitization.
     - **Hands-On Authorization Architecture: CIMD vs. DCR (`02-Security/samples/cimd-dcr-auth`)**:
       - Comparing **Client ID Metadata Documents (CIMD)** (preferred in `2026-07-28`: client hosts a JSON document at a public HTTPS URL with a non-root path, where `client_id` is byte-for-byte identical to that HTTPS URL) against deprecated **Dynamic Client Registration (DCR)** (`POST /register` opaque client ID fallback).
       - Registration priority order (`1. Pre-registered -> 2. CIMD -> 3. DCR fallback -> 4. Manual prompt`), RFC 9207 `iss` validation against multi-server mix-up attacks, `.well-known/oauth-protected-resource` discovery, and enforcing `tool:greet` scope inside an MCP resource server.
   - **Pyodide Sandbox**: Pure-Python MCP Security Gate implementing (1) **CIMD vs. DCR Registration Classifier & URL Validator** (enforcing HTTPS, non-root path, no query/fragment, and byte-for-byte `client_id` match), (2) **Anti-Passthrough JWT Audience/Issuer/Scope Verifier** (`aud == "http://127.0.0.1:3001/mcp"`, `scope` contains `"tool:greet"`), (3) **SHA-256 Tool-Pinning "Rug Pull" Detector**, and (4) **Datamarking Spotlighting Prompt Shield**.
   - **Colab Notebook**: `04-mcp-security-owasp-top-10-and-cimd-auth.ipynb` (Porting the complete 12-test `cimd-dcr-auth` verification suite to Python: CIMD document validation, DCR fallback classification, RS256/HS256 JWT `iss`/`aud`/`exp`/`scope` verification, `registration-info` & `greet` MCP tool calls, plus Tool Poisoning & XPIA Spotlighting red-team exercises).

### Module 2: Building MCP Servers, Clients, Gemini Hosts & Transports (`category: "Module 2: Building MCP Servers, Clients, Gemini Hosts & Transports"`)
5. **Lesson 05 (`05-building-your-first-mcp-server-with-fastmcp`, `order: 5`, `xp: 75`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["mcp-for-beginners/04-mcp-security-owasp-top-10-and-cimd-auth"]`
   - **Reference**: `.ref/mcp-for-beginners/03-GettingStarted/README.md`, `01-first-server/README.md`, `samples/python/mcp_calculator_server.py`
   - **Content**: Setting up a Python MCP Server project with `uv` / `pip` and `FastMCP`; Designing strongly-typed tools with `@mcp.tool()` and Pydantic/type-hint schemas; Building the **Complete Scientific Calculator & Engineering Reference MCP Server** (`add`, `subtract`, `multiply`, `divide` with zero-division error handling, `power`, `sqrt` with non-negative domain checks, `factorial`, `logarithm`, and statistical `summary_stats`); Exposing dynamic contextual data with `@mcp.resource("calc://constants/{name}")` and `calc://history`; Registering guided workflow templates with `@mcp.prompt()` (`explain_calculation_step_by_step`); Polyglot SDK Comparison Table comparing the exact same Calculator Tool registration across **Python (`FastMCP`)**, **TypeScript (`@modelcontextprotocol/sdk`)**, **C# (`.NET ModelContextProtocol`)**, **Java (`Spring AI MCP`)**, and **Rust (`rmcp`)**.
   - **Pyodide Sandbox**: Pure-Python `FastMCP`-Style Decorator Registry & Scientific Calculator Server Simulator that auto-generates JSON Schema 2020-12 `inputSchema` from Python function type annotations and docstrings, dispatches `tools/list`, `tools/call`, `resources/read`, and `prompts/get`, and validates edge-case error handling (`ZeroDivisionError`, negative square roots).
   - **Colab Notebook**: `05-building-your-first-mcp-server-with-fastmcp.ipynb` (Building and running the real `FastMCP` Calculator & Engineering Reference Server in Python, inspecting its generated JSON schemas, and calling every tool, resource, and prompt).
6. **Lesson 06 (`06-building-mcp-clients-and-gemini-llm-hosts`, `order: 6`, `xp: 80`, `difficulty: "intermediate"`)**:
   - **Prerequisites**: `["mcp-for-beginners/05-building-your-first-mcp-server-with-fastmcp"]`
   - **Reference**: `.ref/mcp-for-beginners/03-GettingStarted/02-client/README.md`, `03-llm-client/README.md`
   - **Content**: Architecture of an MCP Client vs. an **MCP Host Application**; Part 1 — **Building a Deterministic MCP Client (`02-client`)**: establishing a client transport session, discovering server capabilities (`list_tools`, `list_resources`, `list_prompts`), invoking tools with validated arguments, reading resource URIs, and rendering prompt templates; Part 2 — **Upgrading to an Autonomous Gemini LLM Host (`03-llm-client`)**:
     - Replacing Azure OpenAI / GitHub Models (`azure-ai-inference`) with **Google AI Studio Free Tier (`google-genai`, `gemini-2.5-flash`)**.
     - **Dynamic Schema Translation (`convert_mcp_tool_to_gemini_declaration`)**: Mapping MCP `Tool.inputSchema` properties and required fields into `google.genai.types.FunctionDeclaration` and `types.Tool`.
     - **The 4-Step Host Negotiation Loop**:
       1. User submits a natural-language request (`"Calculate (24 * 15) + sqrt(144) and explain the physics constant for speed of light"`).
       2. Host passes user prompt + discovered MCP tool declarations to `client.models.generate_content(model="gemini-2.5-flash", contents=..., config=types.GenerateContentConfig(tools=...))`.
       3. Host intercepts `response.function_calls`, routes each tool invocation to the MCP Server via `session.call_tool(name, args)`, and collects structured tool outputs.
       4. Host appends the `FunctionResponse` part to the conversation history and invokes Gemini to synthesize the final grounded answer.
   - **Pyodide Sandbox**: Pure-Python MCP-to-Gemini Schema Translator & Autonomous Multi-Tool Negotiation Loop Simulator that converts MCP JSON Schema tool definitions into Gemini `FunctionDeclaration` objects, executes a multi-step tool-calling loop (`multiply(24, 15)` $\rightarrow$ `sqrt(144)` $\rightarrow$ `add(360, 12)`), and synthesizes the final response.
   - **Colab Notebook**: `06-building-mcp-clients-and-gemini-llm-hosts.ipynb` (Connecting a Python MCP Client and a live **Gemini 2.5 Flash LLM Host** (`google-genai`) to the FastMCP Calculator & Reference Server, demonstrating automatic multi-tool negotiation and grounded response generation).
7. **Lesson 07 (`07-stdio-and-streamable-http-transports`, `order: 7`, `xp: 80`, `difficulty: "intermediate"`)**:
   - **Prerequisites**: `["mcp-for-beginners/06-building-mcp-clients-and-gemini-llm-hosts"]`
   - **Reference**: `.ref/mcp-for-beginners/03-GettingStarted/05-stdio-server/README.md`, `06-http-streaming/README.md`
   - **Content**: Deep dive into MCP's Transport Layer; **Transport 1 — Subprocess `stdio` (`05-stdio-server`)**:
     - How the Host spawns the MCP Server as a child process and communicates over newline-delimited JSON-RPC on `stdin` and `stdout`.
     - Security & process isolation benefits, environment variable allowlisting, graceful `SIGTERM`/`SIGINT` cleanup, and the Golden Rule of `stdio`: **never write `print()` debug logs to `stdout` (which corrupts JSON-RPC framing)—always log to `sys.stderr`**.
     - **Transport 2 — Stateless Streamable HTTP & SSE Framing (`06-http-streaming`)**:
     - Why the legacy `2024-11-05` dual-endpoint `HTTP+SSE` transport (`/sse` persistent stream + `/messages` POST) failed at enterprise scale and was deprecated.
     - How **Streamable HTTP** uses a single unified `/mcp` endpoint supporting standard `POST` requests with `MCP-Protocol-Version: 2026-07-28`, `Mcp-Method`, and `Mcp-Name` headers.
     - Returning immediate `application/json` for fast tool calls vs. upgrading the HTTP response to `text/event-stream` (`SSE`) when streaming incremental `notifications/progress` events before the final JSON-RPC result frame.
   - **Pyodide Sandbox**: Pure-Python Dual-Transport Wire Framing Engine (`stdio` Newline Frame Parser with `stdout` Corruption Detector + `2026-07-28` Streamable HTTP / SSE Chunk Multiplexer) that detects stray `stdout` print statements, validates `Mcp-Method`/`Mcp-Name` HTTP headers, and formats/parses multi-event `text/event-stream` (`data: {...}\n\n`) progress streams.
   - **Colab Notebook**: `07-stdio-and-streamable-http-transports.ipynb` (Running both a subprocess `stdio` FastMCP server and an ASGI Streamable HTTP FastMCP/FastAPI server with chunked SSE progress streaming and `httpx` async client consumption).
8. **Lesson 08 (`08-testing-and-debugging-with-mcp-inspector`, `order: 8`, `xp: 75`, `difficulty: "intermediate"`)**:
   - **Prerequisites**: `["mcp-for-beginners/07-stdio-and-streamable-http-transports"]`
   - **Reference**: `.ref/mcp-for-beginners/03-GettingStarted/08-testing/README.md`, `13-mcp-inspector/README.md`
   - **Content**: Engineering reliable MCP servers through systematic testing and visual/CLI protocol inspection; **The 4-Tier MCP Testing Pyramid (`08-testing`)**:
     1. *Unit Testing Primitives*: Direct testing of tool functions, Pydantic validation, and error boundaries.
     2. *In-Memory Client-Server Session Testing*: Using `pytest`, `pytest-asyncio`, and in-memory memory streams (`create_connected_server_and_client_session`) to test full JSON-RPC serialization without network flakiness.
     3. *Schema & Conformance Testing*: Validating `tools/list` against JSON Schema 2020-12 rules, checking `readOnlyHint`/`destructiveHint` annotations, and verifying `-32602` error codes on missing resources or invalid parameters.
     4. *Load, Timeout & Chaos Testing*: Simulating slow downstream APIs and malformed JSON payloads.
     - **Interactive Debugging with MCP Inspector (`13-mcp-inspector`)**:
     - Architecture of `@modelcontextprotocol/inspector` (Client UI port `6274` + Proxy Server port `6277`), inspecting Resources, Prompts, and Tools interactively, viewing raw JSON-RPC message histories, and troubleshooting transport/auth failures.
     - Building a **Python MCP Inspector & Conformance CLI Auditor** for automated CI pipelines and Google Colab notebooks.
   - **Pyodide Sandbox**: Pure-Python Automated MCP Conformance & Inspector Test Suite that runs 8 automated protocol assertions (schema validity, annotation presence, happy-path tool execution, division-by-zero error handling, unknown-tool `-32601`, missing-resource `-32602`, header mismatch rejection, and latency budget check) and outputs a structured Inspector trace table.
   - **Colab Notebook**: `08-testing-and-debugging-with-mcp-inspector.ipynb` (Running an automated `pytest` test suite and an interactive Python MCP Inspector diagnostic harness against a FastMCP server).
9. **Lesson 09 (`09-authentication-rbac-mcp-hosts-and-deployment`, `order: 9`, `xp: 80`, `difficulty: "intermediate"`)**:
   - **Prerequisites**: `["mcp-for-beginners/08-testing-and-debugging-with-mcp-inspector"]`
   - **Reference**: `.ref/mcp-for-beginners/03-GettingStarted/04-vscode/README.md`, `07-aitk/README.md`, `09-deployment/README.md`, `10-advanced/README.md`, `11-simple-auth/README.md`, `12-mcp-hosts/README.md`
   - **Content**: Taking an MCP server from local script to authenticated IDE/Host integration and containerized production deployment:
     1. **Simple Auth to JWT & Role-Based Access Control (`11-simple-auth` & `10-advanced`)**: Implementing Starlette/FastAPI ASGI `AuthMiddleware` supporting Basic Auth and Bearer JWT tokens, binding caller identity to request context, and enforcing a fine-grained **RBAC Permission Matrix** (`admin`: full read/write/delete; `developer`: read + non-destructive tools; `viewer`: read-only resources and `readOnlyHint: True` tools).
     2. **Configuring MCP Hosts (`04-vscode`, `07-aitk`, `12-mcp-hosts`)**: Writing production `.vscode/mcp.json` configurations (`inputs` with `password: true` secret prompts, `servers` supporting both `stdio` and `http` transports), plus configuration schemas for **Claude Desktop** (`claude_desktop_config.json`), **Cursor**, **Cline**, and **Windsurf**, and workflow patterns for visual Agent Builders and Playgrounds.
     3. **Containerization & Cloud Deployment (`09-deployment`)**: Packaging a Streamable HTTP MCP server in a hardened, non-root multi-stage **Dockerfile**, exposing `/health` and `/ready` probes, configuring environment secrets and horizontal autoscaling rules.
   - **Pyodide Sandbox**: Pure-Python ASGI Auth + RBAC Policy Enforcer & Multi-Host Config Generator (`vscode/mcp.json` & `claude_desktop_config.json`) that validates Bearer tokens, enforces role permissions (`viewer` blocked from `destructiveHint: True` tools with HTTP `403`), and compiles validated host configuration JSON files with `${input:api-key}` secret bindings.
   - **Colab Notebook**: `09-authentication-rbac-mcp-hosts-and-deployment.ipynb` (Building a JWT + RBAC protected FastMCP/Starlette server, testing role enforcement across `admin`/`developer`/`viewer` tokens, validating `.vscode/mcp.json` configs, and generating a production multi-stage `Dockerfile`).
10. **Lesson 10 (`10-client-sampling-and-interactive-mcp-apps`, `order: 10`, `xp: 80`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["mcp-for-beginners/09-authentication-rbac-mcp-hosts-and-deployment"]`
    - **Reference**: `.ref/mcp-for-beginners/03-GettingStarted/14-sampling/README.md`, `15-mcp-apps/README.md`
    - **Content**: Bridging two pivotal client-server collaboration patterns:
      1. **Server-Initiated Sampling & `2026-07-28` Migration (`14-sampling`)**: How the legacy `2025-11-25` `sampling/createMessage` method allowed an MCP server to request LLM completions from the client host using `modelPreferences` (`hints`, `costPriority`, `speedPriority`, `intelligencePriority` $\in [0.0, 1.0]$) with human-in-the-loop prompt/response approval; Why `2026-07-28` deprecates protocol-level Sampling and how modern MCP servers integrate directly with **Google AI Studio (`google-genai`)** or return structured data for the host model to reason over.
      2. **Interactive MCP Apps (`15-mcp-apps` & `SEP-1865`)**: How MCP servers ship rich, interactive HTML/CSS/JS user interfaces rendered inside a sandboxed iframe by the MCP Host (`Claude Desktop`, `VS Code`):
         - The Two-Part Registration Pattern: (a) Registering a **Tool** with `_meta.ui.resourceUri` (e.g., `"ui://weather-server/dashboard-template"`), and (b) Registering a **`ui://` Resource** (`mimeType: "text/html;profile=mcp-app"`) containing the pre-declared HTML template so hosts can prefetch, cache, and security-review the UI before execution.
         - The **Host $\leftrightarrow$ Iframe `postMessage` JSON-RPC Bridge**: `ui/initialize` handshake, receiving initial tool results, and invoking `tools/call` directly from interactive chart buttons or filter controls inside the sandboxed widget.
    - **Pyodide Sandbox**: Pure-Python Sampling Model-Preference Scorer ($S = w_c C + w_s V + w_i I$), Direct Gemini Migration Wrapper & `SEP-1865` MCP App Manifest/Widget Compiler that links a `get_weather_analytics` tool to a `ui://weather-server/dashboard` HTML resource and simulates the `ui/initialize` $\rightarrow$ `tools/call` iframe bridge.
    - **Colab Notebook**: `10-client-sampling-and-interactive-mcp-apps.ipynb` (Comparing legacy `sampling/createMessage` against direct `google-genai` integration, then building and rendering a live interactive `ui://` MCP App HTML dashboard inside Google Colab).

### Module 3: Practical Implementation, Pagination & Protocol Features (`category: "Module 3: Practical Implementation, Pagination & Protocol Features"`)
11. **Lesson 11 (`11-practical-implementation-sdks-and-api-gateways`, `order: 11`, `xp: 80`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["mcp-for-beginners/10-client-sampling-and-interactive-mcp-apps"]`
    - **Reference**: `.ref/mcp-for-beginners/04-PracticalImplementation/README.md`, `samples/python/README.md`
    - **Content**: Practical architecture patterns across official MCP SDKs (**Python `FastMCP`**, **TypeScript**, **Java with Spring Reactor**, **C# ASP.NET Core**, **Go**, **Kotlin**); Combining Resources, Prompts, and Tools into cohesive domain workflows; **Securing & Operating Remote MCP Servers with an Open-Source API Gateway** (replacing Azure API Management):
      - Why production remote MCP servers need an edge gateway in front of `/mcp`: **Token-Bucket Rate Limiting**, **OAuth 2.1 / JWT Validation**, **Header-Based Routing (`Mcp-Method`, `Mcp-Name`)**, **Request/Response Policy Enforcement**, **Load Balancing**, and **Centralized Audit Logging**.
      - Mathematical formulation of the **Token-Bucket Rate Limiter**:
        $$B(t) = \min\left(B_{\max}, \; B(t_0) + r \cdot (t - t_0)\right)$$
        where $B_{\max}$ is burst capacity, $r$ is refill rate (tokens/second), and each tool call consumes $c \ge 1$ tokens (allowing expensive tools to cost more tokens than `tools/list`).
      - Building a complete Python **FastAPI / Starlette MCP Reverse-Proxy Gateway** and testing it with MCP Inspector.
    - **Pyodide Sandbox**: Pure-Python MCP API Gateway Policy Engine & Token-Bucket Rate Limiter that enforces per-tenant token buckets ($B_{\max}=5, r=1\text{/s}$), inspects `Mcp-Method`/`Mcp-Name` headers to apply method-specific costs (`tools/list` $= 1$, `tools/call` $= 2$), validates JWT claims, and returns HTTP `429 Too Many Requests` with `Retry-After` headers when burst capacity is exceeded.
    - **Colab Notebook**: `11-practical-implementation-sdks-and-api-gateways.ipynb` (Building a complete Python FastAPI Reverse-Proxy MCP Gateway fronting a FastMCP server with token-bucket rate limiting, JWT verification, policy transformation, and request telemetry).
12. **Lesson 12 (`12-cursor-based-pagination-and-large-result-sets`, `order: 12`, `xp: 80`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["mcp-for-beginners/11-practical-implementation-sdks-and-api-gateways"]`
    - **Reference**: `.ref/mcp-for-beginners/04-PracticalImplementation/pagination/README.md`
    - **Content**: Why pagination is critical in MCP (preventing server memory exhaustion, request timeouts, and LLM context window overflow when listing thousands of tools, database rows, or document resources); Which MCP methods support native pagination (`tools/list`, `resources/list`, `prompts/list`, `resources/templates/list`); **How Opaque Cursor-Based Pagination Works**:
      - Why MCP uses opaque string cursors (`cursor` request param $\rightarrow$ `nextCursor` response field, `nextCursor: null` at end of stream) rather than raw integer page numbers.
      - Designing **Base64-Encoded Structured JSON Cursors** (`encode_cursor(offset=20, filter_tag="active", snapshot_ts=...)`) so servers can evolve cursor internals without breaking clients.
      - Writing resilient client-side **`paginate_all(session, method)`** async generators that loop until `nextCursor` is `None`.
      - Best practices: choosing optimal page sizes ($10\text{–}100$ items), validating corrupt/expired cursors cleanly (returning JSON-RPC `-32602 Invalid Params` or safe fallback), deterministic sort ordering, and combining pagination with `2026-07-28` list caching metadata (`ttlMs` and `cacheScope`).
    - **Pyodide Sandbox**: Pure-Python Base64 Opaque Cursor Pagination Server & Async Client Iterator (`paginate_all`) that pages through a 45-item MCP resource/tool catalog in chunks of 10, attaches `ttlMs`/`cacheScope` metadata, verifies zero duplicate or skipped items across pages, and catches tampered base64 cursors with JSON-RPC `-32602`.
    - **Colab Notebook**: `12-cursor-based-pagination-and-large-result-sets.ipynb` (Implementing cursor-based pagination across `list_tools`, `list_resources`, and custom search tools in Python `FastMCP`, plus client-side `paginate_all` async generators and cursor tampering tests).
13. **Lesson 13 (`13-protocol-features-progress-cancellation-and-templates`, `order: 13`, `xp: 85`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["mcp-for-beginners/12-cursor-based-pagination-and-large-result-sets"]`
    - **Reference**: `.ref/mcp-for-beginners/05-AdvancedTopics/mcp-protocol-features/README.md`
    - **Content**: Mastering advanced MCP protocol mechanics for responsive, long-running production workloads:
      1. **Progress Notifications (`notifications/progress`)**: Emitting real-time `ProgressNotification` frames (`progressToken`, `progress`, `total`, `message`) during chunked file processing or batch ETL tools so host UIs render live progress bars.
      2. **Cooperative Request Cancellation (`notifications/cancelled`)**: Handling client cancellation signals (`requestId`, `reason`) inside async server loops (`asyncio.CancelledError`), cleaning up temporary files/transactions, and halting expensive downstream calls immediately.
      3. **Dynamic Resource Templates (`resources/templates/list`)**: Defining **RFC 6570 URI Templates** (`users://{user_id}/profile`, `reports://{year}/{month}`, `search://{category}?q={query}&limit={limit}`) with regex parameter extraction and validation.
      4. **Application Lifecycle & Observability**: Clean async context-manager startup/shutdown hooks (database pools, cache warmers) and why `2026-07-28` replaces deprecated MCP protocol logging with `stderr` and OpenTelemetry.
      5. **The `2026-07-28` Tasks Extension (`SEP-2663`)**: How a server promotes a long-running `tools/call` into a stateless task handle and how the client drives it via `tasks/get`, `tasks/update`, and `tasks/cancel`.
    - **Pyodide Sandbox**: Pure-Python MCP Protocol Features Harness implementing (1) Chunked Progress Notification emitter (`10%` $\rightarrow$ `100%`), (2) Cooperative Cancellation with transaction rollback at chunk 3, (3) RFC 6570 URI Template router (`users://{user_id}/profile`, `reports://{year}/{month}`), and (4) `SEP-2663` Tasks Extension state machine (`running` $\rightarrow$ `tasks/get` $\rightarrow$ `completed` / `cancelled`).
    - **Colab Notebook**: `13-protocol-features-progress-cancellation-and-templates.ipynb` (Hands-on implementation of `notifications/progress`, `asyncio.CancelledError` request cancellation, parameterized RFC 6570 Resource Templates, and the `2026-07-28` Tasks extension in Python).

### Module 4: Advanced Topics: Multi-Modal, OAuth 2.1, Context Engineering & Debate Agents (`category: "Module 4: Advanced Topics: Multi-Modal, OAuth 2.1, Context Engineering & Debate Agents"`)
14. **Lesson 14 (`14-multimodal-workflows-realtime-streaming-and-web-search`, `order: 14`, `xp: 85`, `difficulty: "advanced"`)**:
    - **Prerequisites**: `["mcp-for-beginners/13-protocol-features-progress-cancellation-and-templates"]`
    - **Reference**: `.ref/mcp-for-beginners/05-AdvancedTopics/README.md`, `mcp-multi-modality/README.md`, `web-search-mcp/README.md`, `mcp-realtimestreaming/README.md`, `mcp-realtimesearch/README.md`
    - **Content**: Extending MCP beyond static text:
      1. **Multi-Modal MCP Primitives (`mcp-multi-modality`)**: Returning and consuming heterogeneous content blocks in a single tool response—`TextContent`, `ImageContent` (`type: "image"`, base64 `data`, `mimeType: "image/png"`), `AudioContent` (`type: "audio"`, base64 `data`, `mimeType: "audio/wav"`), and `EmbeddedResource`—and piping them directly into **Google AI Studio (`gemini-2.5-flash`)** for multimodal reasoning.
      2. **Realtime Data Streaming (`mcp-realtimestreaming`)**: Streaming high-frequency telemetry and chunked sensor/market updates over Streamable HTTP SSE with backpressure control and window aggregation.
      3. **Realtime Multi-Tool Web Search Orchestration (`web-search-mcp` & `mcp-realtimesearch`)**: Building the 4-tool Search MCP Server (`general_search`, `news_search`, `product_search`, `qna` with structured Pydantic parameters, HTTP timeout/retry guards, and freshness ranking) and wiring a Gemini LLM Host that selects the right search tool based on query intent.
    - **Pyodide Sandbox**: Pure-Python Multimodal Content Block Assembler (`TextContent` + base64 `ImageContent` + `EmbeddedResource`) & 4-Tool Realtime Search Orchestrator (`general_search`, `news_search`, `product_search`, `qna`) that routes user intents, merges streaming search chunks, and formats grounded citations.
    - **Colab Notebook**: `14-multimodal-workflows-realtime-streaming-and-web-search.ipynb` (Building a Multi-Modal FastMCP server generating chart `ImageContent` for Gemini 2.5 Flash vision analysis, plus the 4-tool Web/News/Product/Q&A Search MCP server with streaming HTTP client orchestration).
15. **Lesson 15 (`15-oauth2-oidc-security-and-identity-hardening`, `order: 15`, `xp: 85`, `difficulty: "advanced"`)**:
    - **Prerequisites**: `["mcp-for-beginners/14-multimodal-workflows-realtime-streaming-and-web-search"]`
    - **Reference**: `.ref/mcp-for-beginners/05-AdvancedTopics/mcp-oauth2-demo/`, `mcp-security/README.md`, `mcp-security-entra/README.md`
    - **Content**: Deep dive into Enterprise OAuth 2.1 & OpenID Connect Authentication for MCP Servers:
      - Separating the **OAuth 2.1 Authorization Server** (issuing signed JWTs and publishing `/.well-known/oauth-authorization-server` + JWKS) from the **MCP Resource Server** (publishing `/.well-known/oauth-protected-resource` and validating Bearer tokens).
      - Mathematical and cryptographic mechanics of **Authorization Code Flow with S256 PKCE**:
        $$\text{code\_challenge} = \text{BASE64URL-ENCODE}\left(\text{SHA256}\left(\text{ASCII}(\text{code\_verifier})\right)\right)$$
        preventing authorization code interception on public/native MCP clients.
      - **MCP `2026-07-28` Authorization Hardening (`SEP-2468`, `SEP-2352`, `SEP-2350`, `SEP-2351`)**:
        - Mandatory **RFC 9207 `iss` parameter validation** on authorization responses to block multi-server mix-up attacks.
        - Strict Audience (`aud == MCP_SERVER_URL`) and Issuer binding.
        - **Step-Up Scope Accumulation**: Dynamically challenging a client with `403 insufficient_scope` and `WWW-Authenticate: Bearer scope="mcp:read mcp:write"` when a user escalates from read-only tools to write-capable tools.
    - **Pyodide Sandbox**: Pure-Python OAuth 2.1 + S256 PKCE Handshake, RFC 9207 `iss` Mix-Up Guard & Step-Up Scope Accumulation Simulator that computes `code_challenge` from `code_verifier`, verifies `.well-known/oauth-protected-resource` discovery, blocks an authorization response with a mismatched `iss`, and executes a step-up authorization flow (`mcp:read` $\rightarrow$ `403 WWW-Authenticate` $\rightarrow$ `mcp:read mcp:write`).
    - **Colab Notebook**: `15-oauth2-oidc-security-and-identity-hardening.ipynb` (Building a complete Python OAuth 2.1 Authorization Server + Protected FastMCP Resource Server using `PyJWT` and `cryptography` RS256 keys, testing S256 PKCE, JWKS verification, RFC 9207 `iss` validation, and step-up scope enforcement).
16. **Lesson 16 (`16-context-engineering-root-contexts-and-sampling-migration`, `order: 16`, `xp: 85`, `difficulty: "advanced"`)**:
    - **Prerequisites**: `["mcp-for-beginners/15-oauth2-oidc-security-and-identity-hardening"]`
    - **Reference**: `.ref/mcp-for-beginners/05-AdvancedTopics/mcp-contextengineering/README.md`, `mcp-root-contexts/README.md`, `mcp-sampling/README.md`
    - **Content**: **Context Engineering in the MCP Ecosystem (`mcp-contextengineering`)**:
      - Why context engineering is the systems-level evolution of prompt engineering: dynamically selecting, structuring, delivering, maintaining, and evaluating context across multi-turn MCP workflows.
      - Tracing the **5-Stage Context Journey**: *1. User Input $\rightarrow$ 2. Context Assembly $\rightarrow$ 3. Model Processing $\rightarrow$ 4. Response Generation $\rightarrow$ 5. State Management*.
      - The **3 Emerging Principles of Context Engineering**:
        1. *Share Context Completely* (why fragmented context across isolated sub-agents causes conflicting implicit decisions vs. a unified shared context ledger).
        2. *Recognize That Actions Carry Implicit Decisions* (preferring linear context-aware execution when steps depend on prior assumptions).
        3. *Balance Context Depth with Window Limitations* (progressive resource loading via MCP URIs, priority-tiered context assembly, and semantic compression).
      - **Quantitative Context Effectiveness Metrics**:
        $$\text{Context Utilization Ratio (CUR)} = \frac{|C_{\text{cited}}|}{|C_{\text{assembled}}|}, \quad \text{Relevance Density} = \frac{\sum_{i=1}^k \text{sim}(q, c_i) \cdot \text{tokens}(c_i)}{T_{\text{budget}}}$$
      - **Migrating Legacy `2025-11-25` Root Contexts (`mcp-root-contexts`) & Sampling (`mcp-sampling`) to `2026-07-28`**: Replacing ambient client `roots/list` with explicit, sandboxed workspace URI parameters (`Path.resolve().is_relative_to(allowed_workspace)`) and replacing recursive server sampling with direct `google-genai` reasoning calls.
    - **Pyodide Sandbox**: Pure-Python Context Engineering Assembler, Token-Budget Optimizer, Path-Traversal Root Sandbox & Context Utilization Evaluator that ranks and packs candidate MCP resources/tools into a strict token budget using greedy value-density packing, blocks `../../etc/passwd` directory traversal outside the workspace boundary, and computes `CUR` and `Relevance Density` metrics.
    - **Colab Notebook**: `16-context-engineering-root-contexts-and-sampling-migration.ipynb` (Implementing an automated Context Engineering pipeline for a FastMCP + Gemini 2.5 Flash agent with progressive resource loading, conversation state summarization, workspace URI sandboxing, and context utilization telemetry).
17. **Lesson 17 (`17-routing-scaling-custom-transports-and-adversarial-agents`, `order: 17`, `xp: 90`, `difficulty: "advanced"`)**:
    - **Prerequisites**: `["mcp-for-beginners/16-context-engineering-root-contexts-and-sampling-migration"]`
    - **Reference**: `.ref/mcp-for-beginners/05-AdvancedTopics/mcp-integration/README.md`, `mcp-routing/README.md`, `mcp-scaling/README.md`, `mcp-foundry-agent-integration/README.md`, `mcp-transport/README.md`, `mcp-adversarial-agents/README.md`
    - **Content**: Scaling MCP to distributed multi-server topologies and multi-agent reasoning:
      1. **MCP Routing & Horizontal Scaling (`mcp-routing`, `mcp-scaling`, `mcp-integration`)**: Content-based, capability-based, and `2026-07-28` header-based (`Mcp-Method`, `Mcp-Name`) request routing across specialized server pools; stateless horizontal load balancing, circuit breaking, and response caching (`ttlMs`).
      2. **Custom MCP Transports (`mcp-transport`)**: Implementing a custom async Queue / WebSocket transport adapter that conforms to the MCP JSON-RPC 2.0 read/write stream contract for air-gapped or event-driven message buses.
      3. **Adversarial Multi-Agent Reasoning with Shared MCP Tools (`mcp-adversarial-agents`)**:
         - Why single-agent pipelines suffer from confirmation bias and sycophancy.
         - Designing the **3-Agent Structured Debate Architecture**:
           - **`ForAgent`** (system prompt assigned to argue in favor of a technical claim or architecture proposal).
           - **`AgainstAgent`** (system prompt assigned to stress-test, find vulnerabilities, and argue against the claim).
           - **Shared FastMCP Tool Server** (`web_search`, `run_python_sandbox`, `doc_reader`): Both agents query the **exact same MCP server** so disagreements reflect genuine reasoning and evidence analysis rather than information asymmetry.
           - **`JudgeAgent`**: Evaluates the multi-round tool-backed debate transcript (`Opening Argument` $\rightarrow$ `Rebuttal` $\rightarrow$ `Counter-Rebuttal`) across Evidence Quality, Logical Soundness, and Risk Identification to issue a calibrated final verdict.
    - **Pyodide Sandbox**: Pure-Python Stateless `Mcp-Method`/`Mcp-Name` Federation Router & 3-Agent Adversarial Debate Engine (`ForAgent` vs. `AgainstAgent` + `JudgeAgent`) that routes tool calls across a shared MCP server (`web_search`, `run_python`, `doc_reader`), records a 2-round tool-backed debate on an MCP deployment architecture claim, and computes the Judge Agent's evidence-weighted verdict scorecard.
    - **Colab Notebook**: `17-routing-scaling-custom-transports-and-adversarial-agents.ipynb` (Building the Shared FastMCP Debate Tool Server and running a live multi-round **Adversarial Multi-Agent Debate** between two `gemini-2.5-flash` debater agents and a `gemini-2.5-flash` Judge Agent).

### Module 5: Best Practices, Case Studies & Zava Retail Database Capstone Labs (`category: "Module 5: Best Practices, Case Studies & Zava Retail Database Capstone Labs"`)
18. **Lesson 18 (`18-community-early-adopters-best-practices-and-reliability-sidecars`, `order: 18`, `xp: 90`, `difficulty: "advanced"`)**:
    - **Prerequisites**: `["mcp-for-beginners/17-routing-scaling-custom-transports-and-adversarial-agents"]`
    - **Reference**: `.ref/mcp-for-beginners/06-CommunityContributions/README.md`, `07-LessonsfromEarlyAdoption/README.md`, `07-LessonsfromEarlyAdoption/microsoft-mcp-servers.md`, `08-BestPractices/README.md`, `08-BestPractices/reliability-sidecars/README.md`
    - **Content**: Part 1 — **Contributing to the MCP Ecosystem & Lessons from Early Adopters (`06` & `07`)**:
      - The Specification Enhancement Proposal (**SEP**) process (*Define $\rightarrow$ Prototype $\rightarrow$ Write $\rightarrow$ Conformance Suite* `SEP-2484` & SDK Tier System `SEP-1777`).
      - Early Adopter Enterprise Architectures (*Customer Support Unified Interface*, *HIPAA Healthcare Diagnostic Assistant*, *Financial Risk Analysis*) and 10 Production Reference MCP Server Archetypes (*Documentation Retrieval, Cloud Resource Connector, GitHub Automation, Issue Tracker, MarkItDown Document Converter, SQL Database Server, Playwright Browser Automation, Dev Environment Manager, Agent Registry, Workspace Collaboration*).
      - Part 2 — **Production MCP Best Practices & The Safe Retries Reliability Sidecar Pattern (`08-BestPractices` & `reliability-sidecars/README.md`)**:
      - Why **"A Timeout Means Outcome Unknown"**: When `create_support_ticket` commits ticket `T-0001` in a downstream system but the network drops before the reply reaches the MCP client, a blind retry creates duplicate ticket `T-0002`.
      - Distinguishing the **4 Orthogonal Identifiers**: **JSON-RPC ID** (per request attempt), **MCP Task ID** (long-running execution polling), **Operation Key** (`operation_key: "op-login-ticket-0001"` — stable across retries of one intended action), and **Ticket ID** (`T-0001` — the external domain artifact).
      - Building the **SQLite-Backed Reliability Sidecar**:
        - Scoping claims to `(caller_id, tool_name, tool_version, input_sha256_hash)` where:
          $$h_{\text{input}} = \text{SHA256}\left(\text{canonical\_json}(\text{normalized\_inputs})\right)$$
        - Atomic state transitions: `planned` $\rightarrow$ `claimed` $\rightarrow$ `completed` $\rightarrow$ `verified`.
        - **Recover Before You Retry (Reconciliation Flow)**: Checking the authoritative ticket store on retry when a claim is non-terminal (`claimed`), verifying and returning `T-0001` when found, rejecting reused keys with mutated parameters (`title` mismatch $\rightarrow$ contract error), and **failing closed** (`outcome unknown`) when external state cannot be conclusively verified.
    - **Pyodide Sandbox**: Pure-Python SQLite Reliability Sidecar & Crash-Recovery State Machine implementing `create_support_ticket(operation_key, title)` with Python's built-in `sqlite3`: simulates a lost network reply after `T-0001` is committed, proves that retrying `op-login-ticket-0001` reconciles against the ticket table and returns `{"ticket_id": "T-0001", "status": "verified"}` without creating `T-0002`, and proves that reusing `op-login-ticket-0001` with a mutated `title` raises an input-hash conflict error.
    - **Colab Notebook**: `18-community-early-adopters-best-practices-and-reliability-sidecars.ipynb` (Complete runnable implementation of the SQLite Reliability Sidecar Pattern with fault injection — lost response after commit, crash before external call, mutated-input key reuse, and fail-closed reconciliation).
19. **Lesson 19 (`19-real-world-case-studies-workshops-and-safe-write-servers`, `order: 19`, `xp: 85`, `difficulty: "advanced"`)**:
    - **Prerequisites**: `["mcp-for-beginners/18-community-early-adopters-best-practices-and-reliability-sidecars"]`
    - **Reference**: `.ref/mcp-for-beginners/09-CaseStudy/README.md`, `travelagentsample.md`, `UpdateADOItemsFromYT.md`, `docs-mcp/README.md`, `apimsample.md`, `publora-social-publishing.md`, `10-StreamliningAIWorkflowsBuildingAnMCPServerWithAIToolkit/README.md` (`lab1`–`lab4`), `12-tooling/README.md`
    - **Content**: Analyzing **8 Real-World MCP Case Studies** and the **4-Lab Developer Workflow Workshop**:
      1. *Multi-Agent AI Travel Planner* (Triage, Flight, Hotel, Activity, and Summarizer agents coordinated via MCP servers).
      2. *YouTube-to-Issue-Tracker Workflow Automation* (extracting video metadata/transcripts and updating project work items).
      3. *Real-Time Console Documentation Retriever* (Streamable HTTP client streaming official technical docs into terminal workflows).
      4. *Interactive Conversational Study-Plan Generator* (generating week-by-week certification study plans grounded in live documentation).
      5. *In-Editor Documentation & Smart GitHub Repository Clone Server (`Module 10 Labs 1–4` & `Module 12`)*.
      6. *API Gateway MCP Server* & *7. The GitHub MCP Registry* (solving server discoverability, curation, and one-click host installation).
      7. *8. Designing a Write-Capable Remote MCP Server (`publora-social-publishing.md`)*:
         - Why reading data is forgiving, whereas **writing/publishing** takes irreversible external actions.
         - The **6 Design Rules for Write-Capable Remote MCP Servers**:
           1. *Open Discovery, Authenticated Execution*: `tools/list` succeeds unauthenticated for registries/catalogs, while `tools/call` requires a valid Bearer token or returns `401` with `WWW-Authenticate`.
           2. *Draft-First Human Approval Workflow*: `create_post` without `scheduledTime` saves a draft; only human-approved `update_post(status="scheduled")` schedules publication.
           3. *Tool Annotations as Client Confirmation Signals*: `readOnlyHint: False`, `destructiveHint: True`, `idempotentHint: True`.
           4. *Un-Inventable Opaque Identifiers*: Rejecting hallucinated social account IDs immediately if they were not returned verbatim by `list_connections`.
           5. *Actionable Pre-Publish Validation & Idempotency Keys*: Returning specific platform errors (`"Instagram requires media — attach an image or video"`) instead of generic `400`s, and deduplicating `create_post`/`update_post` via idempotency keys.
           6. *Documented No-Op Test Target (`platforms: ["playground"]`)*: Exercising the full write validation path in CI and connector reviews while publishing nothing.
    - **Pyodide Sandbox**: Pure-Python Write-Capable Social Publishing & Study-Plan MCP Server implementing open `tools/list` vs. authenticated `tools/call` (`401 WWW-Authenticate`), opaque connection-ID validation (catching a hallucinated `"linkedin-my-account"` ID), platform media validation (`Instagram` requiring an image URL), idempotency-key replay deduplication, and the `platforms: ["playground"]` no-op test target.
    - **Colab Notebook**: `19-real-world-case-studies-workshops-and-safe-write-servers.ipynb` (Building and testing the Write-Capable Social Publishing MCP Server + the Week-by-Week Study Plan Generator MCP Server orchestrated by `gemini-2.5-flash`).
20. **Lesson 20 (`20-zava-retail-database-mcp-architecture-and-rls`, `order: 20`, `xp: 90`, `difficulty: "advanced"`)**:
    - **Prerequisites**: `["mcp-for-beginners/19-real-world-case-studies-workshops-and-safe-write-servers"]`
    - **Reference**: `.ref/mcp-for-beginners/11-MCPServerHandsOnLabs/README.md`, `00-Introduction/README.md`, `01-Architecture/README.md`, `02-Security/README.md`, `03-Setup/README.md`, `04-Database/README.md`
    - **Content**: **Zava Retail Database Integration Capstone (Part 1 — Labs 00–04)**:
      - Introducing the **Zava Retail Multi-Store Analytics Use Case**: 4 retail tenants (`seattle` flagship, `redmond` standard, `bellevue` standard, `online` ecommerce).
      - The **4-Layer Enterprise MCP Server Architecture (`01-Architecture`)**:
        1. *Layer 1 — Protocol Layer (`FastMCP`)*: Tool/resource registration, Pydantic schemas, JSON-RPC routing.
        2. *Layer 2 — Business Logic Layer (`SalesAnalyticsService`)*: Store access validation, KPI calculation, caching.
        3. *Layer 3 — Data Access Layer (`DatabaseProvider`)*: Connection pooling, query timeouts, transaction management, and **Row-Level Security (RLS)** session context binding.
        4. *Layer 4 — Infrastructure Layer*: Structured logging, metrics, and configuration.
      - **Multi-Tenant Relational Schema & Row-Level Security (`02-Security` & `04-Database`)**:
        - Shared-database, shared-schema multi-tenancy across `retail.stores`, `retail.customers`, `retail.product_categories`, `retail.products`, `retail.sales_transactions`, `retail.sales_transaction_items`, and `retail.product_embeddings`.
        - Production PostgreSQL + `pgvector` DDL and RLS policies:
          ```sql
          ALTER TABLE retail.customers ENABLE ROW LEVEL SECURITY;
          CREATE POLICY customers_store_isolation ON retail.customers
              FOR ALL TO mcp_user
              USING (store_id = current_setting('app.current_store_id', true));
          ```
        - Building the **Zero-Docker Python `sqlite3` Multi-Tenant Zava Retail Engine with Enforced RLS Context Guards**: seeding realistic stores, customers, categories, products, and transactions, and enforcing tenant isolation so setting `current_store_id = 'seattle'` mathematically guarantees zero leakage of `redmond` or `bellevue` rows.
    - **Pyodide Sandbox**: Pure-Python Zava Retail 4-Layer Database Engine (`sqlite3`) with Row-Level Security (`RLS`) Context Isolation that provisions the complete 6-table Zava Retail schema (`stores`, `customers`, `product_categories`, `products`, `sales_transactions`, `sales_transaction_items`), seeds multi-store retail data (`seattle`, `redmond`, `bellevue`, `online`), and proves that querying customers and revenue under `rls_store_id="seattle"` vs. `rls_store_id="redmond"` enforces strict row-level tenant isolation.
    - **Colab Notebook**: `20-zava-retail-database-mcp-architecture-and-rls.ipynb` (Provisioning the full Zava Retail multi-tenant SQLite database with RLS enforcement, inspecting the PostgreSQL + `pgvector` migration DDL, and testing the 4-layer architecture across store tenants).
21. **Lesson 21 (`21-zava-retail-fastmcp-tools-and-semantic-vector-search`, `order: 21`, `xp: 95`, `difficulty: "advanced"`)**:
    - **Prerequisites**: `["mcp-for-beginners/20-zava-retail-database-mcp-architecture-and-rls"]`
    - **Reference**: `.ref/mcp-for-beginners/11-MCPServerHandsOnLabs/05-MCP-Server/README.md`, `06-Tools/README.md`, `07-Semantic-Search/README.md`
    - **Content**: **Zava Retail Database Integration Capstone (Part 2 — Labs 05–07)**:
      - **Building the Zava Retail `FastMCP` Server & Database Introspection Tools (`05-MCP-Server` & `06-Tools`)**:
        1. `get_database_schema(ctx, table_name)`: Dynamic schema introspection returning column names, types, foreign keys, and RLS status so the LLM never guesses table structures.
        2. `execute_sales_query(ctx, sql_query)`: Parameterized read-only SQL execution tool with an **SQL AST / Keyword Safety Guard** (blocking `DROP`, `DELETE`, `UPDATE`, `INSERT`, `ALTER`, `PRAGMA`, stacked `;` statements, and comments) and automatic RLS tenant filtering.
        3. `get_store_performance(ctx, time_period)`: Aggregating total revenue, order count, average order value ($\text{AOV} = \frac{\text{Total Revenue}}{\text{Total Orders}}$), and top-selling product categories for the authenticated store.
      - **AI-Powered Semantic & Hybrid Product Search (`07-Semantic-Search`)**:
        - Replacing Azure OpenAI `text-embedding-3-small` with **Google AI Studio `gemini-embedding-001`** (and open-source **`ChromaDB` / NumPy vector indexing**) while teaching PostgreSQL `pgvector` cosine distance (`embedding <=> query_vector`):
          $$\text{Cosine Similarity} = \cos(\theta) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\|_2 \|\mathbf{v}\|_2}, \quad d_{\text{cosine}}(\mathbf{u}, \mathbf{v}) = 1 - \cos(\theta)$$
        - Implementing `EmbeddingManager` with SHA-256 content-hash caching and **Hybrid Search** combining semantic vector similarity ($w_{\text{vec}} \cdot \text{sim}_{\text{cos}}$) with SQL attribute filters (`store_id`, `max_price`, `in_stock_only`) to answer queries like *"comfortable waterproof running shoes for rainy Seattle weather"*.
    - **Pyodide Sandbox**: Pure-Python Zava Retail FastMCP Tool Suite (`get_database_schema`, `execute_sales_query` with SQLi/DML Safety Guard, `get_store_performance`, and `hybrid_semantic_product_search`) that introspects the Zava schema, blocks an attempted `DROP TABLE` injection, computes Seattle store KPIs, and executes hybrid vector + price/store-filtered product search for *"comfortable running shoes for rainy weather"*.
    - **Colab Notebook**: `21-zava-retail-fastmcp-tools-and-semantic-vector-search.ipynb` (Wiring the Zava Retail `FastMCP` Server with `sqlite3` RLS, `ChromaDB` / NumPy vector search, and **Google AI Studio `gemini-embedding-001` + `gemini-2.5-flash`** to answer natural-language retail analytics and product discovery queries).
22. **Lesson 22 (`22-zava-retail-testing-observability-and-production-optimization`, `order: 22`, `xp: 100`, `difficulty: "advanced"`)**:
    - **Prerequisites**: `["mcp-for-beginners/21-zava-retail-fastmcp-tools-and-semantic-vector-search"]`
    - **Reference**: `.ref/mcp-for-beginners/11-MCPServerHandsOnLabs/08-Testing/README.md`, `09-VS-Code/README.md`, `10-Deployment/README.md`, `11-Monitoring/README.md`, `12-Best-Practices/README.md`
    - **Content**: **Zava Retail Database Integration Capstone (Part 3 — Labs 08–12)**:
      1. **Comprehensive Automated Testing & Security Auditing (`08-Testing`)**: Writing automated `pytest` tests verifying (a) zero cross-tenant RLS data leakage across `seattle`, `redmond`, `bellevue`, and `online`, (b) SQL injection and DDL/DML blocking, (c) semantic search recall@k and threshold accuracy, and (d) concurrent query load stability.
      2. **VS Code AI Chat Integration (`09-VS-Code`)**: Configuring `.vscode/mcp.json` with store-scoped RLS environment variables (`RLS_USER_ID`, `GEMINI_API_KEY`) and crafting natural-language retail analyst prompts.
      3. **Container Deployment & Production Scaling (`10-Deployment`)**: Multi-container `docker-compose.yml` architecture, connection pool sizing ($N_{\text{connections}} = (2 \times N_{\text{cores}}) + N_{\text{spindles}}$), and zero-downtime health checks.
      4. **OpenTelemetry Distributed Tracing & Performance Monitoring (`11-Monitoring`)**: Replacing Azure Application Insights with open-source **OpenTelemetry (`traceparent` propagation per `SEP-414`)** and a Python Telemetry Collector tracking query latency percentiles ($P_{50}, P_{95}, P_{99}$), error rates, and embedding cache hit ratios ($\text{Hit Ratio} = \frac{H}{H + M}$).
      5. **Production Optimization & Hardening (`12-Best-Practices`)**: Prepared-statement query plan caching, HNSW/IVFFlat vector index pre-filtering, circuit breakers, and security hardening checklist.
      6. **Course 05 Synthesis & Handoff to Course 06: AI Agents for Beginners (`/learn/ai-agents-for-beginners`)**: How MCP servers form the standardized tool and memory backbone for autonomous multi-agent systems in Course 06.
    - **Pyodide Sandbox**: Pure-Python Zava Retail Security Audit Suite, OpenTelemetry W3C `traceparent` Span Tracer & Latency Percentile ($P_{50}, P_{95}, P_{99}$) / Cache-Hit Profiler that executes a 6-test RLS & SQLi security audit, traces distributed spans across `Host -> FastMCP -> RLS_DB -> VectorIndex`, and computes the production readiness scorecard.
    - **Colab Notebook**: `22-zava-retail-testing-observability-and-production-optimization.ipynb` (End-to-end Zava Retail Capstone verification: running the automated RLS & SQLi test suite, OpenTelemetry span tracer, query cache & latency benchmark, and an autonomous Gemini 2.5 Flash retail analyst agent querying the finished Zava Retail MCP Server).

---

## Verification & Quality Gates

1. **Automated Content, Sandbox & Notebook Validator (`verify_course_05.py`)**:
   - Validate every `.mdx` frontmatter against `src/content.config.ts` (`track: "mcp-for-beginners"`, `order: 1..22`, `description.length >= 30`, valid `prerequisites` chain starting from `["generative-ai-for-beginners/22-building-with-meta-llama-models"]`).
   - Confirm each `.mdx` has `>= 350` words of prose, `<PythonRunner`, `<QuizCard`, `<ColabButton`, and markdown table headers (`| :---` or `| ---`), with strict `H2` (`## `) → `H3` (`### `) heading hierarchy.
   - Execute every `<PythonRunner />` `initialCode` snippet in Python 3 and verify `stdout.strip() == expectedOutput.strip()` in `< 2.0` seconds.
   - Parse every `.ipynb` file in `notebook/mcp-for-beginners/` as JSON (`nbformat == 4`), verify self-contained dataset/SQLite initialization cells and graceful `GEMINI_API_KEY` handling, and scan both `.mdx` and `.ipynb` files for forbidden terms (`.ref/`, `mcp-for-beginners` upstream repo links, `Microsoft Foundry`, `Microsoft Foundry Toolkit`, `Azure OpenAI`, `Azure AI Content Safety`, `Microsoft Prompt Shields`, `Microsoft Entra ID`, `Azure API Management`, `Azure Container Apps`, `Application Insights`, `learn.microsoft.com`).
2. **Build & Type Verification**:
   - `pnpm astro check` (`0` errors, `0` warnings)
   - `pnpm build` (`0` errors, static HTML generated for `/learn/mcp-for-beginners/` and all 22 lessons)
3. **Accessibility & Design Token Verification**:
   - `uv run --with "buddhi-ai[MCP]" python .agents/skills/design-md/scripts/detect_design_md.py --lint`
   - `buddhi scripts verify-a11y` via `terminal-runner`

---

## Complexity Tracking

No `AGENTS.md` or `DESIGN.md` violations exist. Zero new npm dependencies or architectural layers are introduced.
