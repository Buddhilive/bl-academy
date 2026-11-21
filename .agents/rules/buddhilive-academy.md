---
name: buddhilive-academy
version: 2.0.0
priority: P0
trigger: always_on
---

# Antigravity Rules: Buddhilive Academy

## 1. Grounding & Attribution Rule (Non-Negotiable)
- Whenever creating, editing, or outlining tutorials/lessons:
  - Inspect `/docs` first for `python` lessons.
  - Inspect the mapped `.ref/` repository (per `.agents/memory/conventions/ai-engineering-8-course-manifest.md`) for Courses `01`–`08` (`ai-for-beginners` through `edge-ai-for-beginners`).
- Include full, detailed lesson content grounded in the reference repositories; hallucinated topics or unreferenced external materials are strictly forbidden without user approval.
- **Zero Reference Mentions in Lessons**: Never mention `.ref/` or upstream reference repositories inside lesson prose. All GitHub repository attributions belong exclusively in `ACKNOWLEDGEMENTS.md`.

## 2. Sequential 9-Course Learning Path & Content Contract
- **Course Order**: `python` → `ai-for-beginners` → `data-science-for-beginners` → `ml-for-beginners` → `generative-ai-for-beginners` → `mcp-for-beginners` → `ai-agents-for-beginners` → `harness-engineering` → `edge-ai-for-beginners`.
- **File Format**: Every tutorial page is an `.mdx` file located inside `/src/content/lessons/<course_name>/`.
- **Writing Tone**: Use the `my-writing-style` skill (`.agents/skills/my-writing-style/SKILL.md`) when drafting tutorial prose.
- **Frontmatter Schema** (`src/content.config.ts`):
  - `title` (string)
  - `track` (string identifier matching `src/lib/curriculum.ts`, e.g. `"python"`, `"ai-for-beginners"`, `"generative-ai-for-beginners"`)
  - `category` (string section heading for sidebar grouping)
  - `order` (number)
  - `difficulty` (`"beginner"` | `"intermediate"` | `"advanced"`)
  - `xp` (integer, for Pathfinder / My Learning tracking)
  - `description` (string min 30 chars for SEO)
  - `topic` (string optional)
  - `prerequisites` (array of slugs optional)
- **Content & AdSense Standard**:
  1. Direct opening hook & conceptual explanation (following `my-writing-style`).
  2. Concrete copyable code example + `<PythonRunner client:visible />` in-browser sandbox (where runnable in Pyodide) and/or `<ColabButton />`.
  3. Reference/parameter tables explaining inputs, outputs, and edge cases.
  4. Quick self-check quiz (`<QuizCard client:visible />`) or exercise.
  5. Minimum **350+ words** of clear explanatory prose; KaTeX formulas where mathematically relevant.

## 3. Open-Source Colab & Google AI Studio Free-Tier Policy
- **Replace Microsoft Foundry / Azure Services**: Convert any Microsoft Foundry, Azure OpenAI, Azure AI Search, or proprietary cloud steps into open-source tools/frameworks runnable on **Google Colab Free Tier** (CPU or T4 GPU).
- **LLM APIs**: Use **Google AI Studio Free Tier** (`GEMINI_API_KEY` via `google-genai`) and include a guide on obtaining and storing the free API key.
- **Notebooks**: Create companion Colab notebooks in `./notebook/<course_name>/<lesson_slug>.ipynb` and link them via `<ColabButton course="<course_name>" notebook="<lesson_slug>.ipynb" runtime="..." />`.

## 4. Code Integrity & Client-Side Sandbox
- **Zero-Backend Execution**: Browser Python executes 100% client-side via Pyodide v0.26+ in `/src/workers/pyodide.worker.ts` with a hard 5-second timeout.
- **Dependency Guard**: Never introduce Node or server-side dependencies for code execution. Maintain clean separation between static Astro layouts (`/src/components/static`) and hydrated interactive islands (`/src/components/islands`).

## 5. Theme & Accessibility Standards
- **Color System**: Primary brand color is terracotta `#A7452A` (with calibrated dark mode companion `#E07A5F`).
- **Mode Support**: Support both Light and Dark modes.
- **WCAG 2.2 AA**: All text, surfaces, and interactive focus states (`:focus-visible`) must maintain AA contrast ratios (4.5:1 normal text, 3.0:1 large text/borders).
- **Zero CLS**: AdSense containers must have pre-allocated fixed-height dimensions to eliminate Cumulative Layout Shift.
