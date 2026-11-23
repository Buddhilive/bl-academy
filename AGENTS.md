# AGENTS.md — BuddhiAI Academy

Operational instructions and engineering principles for AI coding agents.

## Quick Reference Commands

- **Install dependencies**: `pnpm install`
- **Start dev server (background)**: `astro dev --background` (manage with `astro dev stop`, `astro dev status`, `astro dev logs`)
- **Build production SSG**: `pnpm build`
- **Preview build**: `pnpm preview`
- **Typecheck & schema check**: `pnpm astro check`

## Agent Harness & Skills

Agent skills and lifecycle hooks reside in `.agents/`:
- **Code Graph & MCP**: Use Buddhi MCP (`buddhi-mcp`) and tools (`buddhi scripts autoharness`, `buddhi scripts contrast`).
- **Design Tokens**: Validate `DESIGN.md` against WCAG 2.2 AA contrast via `uv run --with "buddhi-ai[MCP]" python .agents/skills/design-md/scripts/detect_design_md.py --lint`.
- **Agents Spec**: Check agents reference via `uv run --with "buddhi-ai[MCP]" python .agents/skills/agents-md/scripts/detect_agents_md.py --diff`.

## Non-Negotiable Engineering Principles

1. **9-Course Sequential Learning Path & Grounding**:
   The curriculum forms a single connected learning path starting from Python:
   `00 python` → `01 ai-for-beginners` → `02 data-science-for-beginners` → `03 ml-for-beginners` → `04 generative-ai-for-beginners` → `05 mcp-for-beginners` → `06 ai-agents-for-beginners` → `07 harness-engineering` → `08 edge-ai-for-beginners`.
   - Ground Python lessons in `/docs` and Courses 01–08 in their respective `.ref/` repositories (see `.agents/memory/conventions/ai-engineering-8-course-manifest.md`).
   - Include full, detailed conceptual and technical content from each reference lesson.
   - **Never mention `.ref/` or upstream reference repositories in lesson prose.** All upstream credits and GitHub links belong exclusively in `ACKNOWLEDGEMENTS.md`.
2. **Content Generation Contract (W3Schools Model + `my-writing-style` + Pathfinder Gamification)**:
   - Every tutorial/reference page must be an `.mdx` file in `/src/content/lessons/<course_name>/`.
   - Author tutorial prose using the `.agents/skills/my-writing-style/SKILL.md` skill for an authentic, accessible, developer-friendly voice.
   - Frontmatter strictly validates against `src/content.config.ts`: `title`, `track` (course track ID), `category`, `order`, `difficulty`, `xp` (for Pathfinder progress), `description` (min 30 chars), `topic`, `prerequisites`.
   - Each tutorial must follow a scannable structure: opening hook & conceptual summary, syntax/architecture definition, copyable code example with "Try it Yourself" execution (`<PythonRunner client:visible />`), parameter/reference tables, and short self-check exercises (`<QuizCard client:visible />`), with at least 350+ words of explanatory prose and KaTeX formulas where mathematically relevant.
3. **Open-Source Colab Free Tier & Google AI Studio Free Tier Stack**:
   - **No Proprietary Microsoft Foundry / Azure Dependencies**: Where reference material uses Microsoft Foundry, Azure AI, or similar non-Google cloud services, replace them with open-source frameworks runnable on **Google Colab Free Tier** (CPU or T4 GPU).
   - **LLM / Cloud Model Calls**: Use **Google AI Studio Free Tier** (`GEMINI_API_KEY` via `google-genai` SDK) and include a step-by-step guide on obtaining and configuring the free API key.
   - **Google Colab Notebooks**: Place companion notebooks in `./notebook/<course_name>/<lesson_slug>.ipynb` and link them in lessons with `<ColabButton course="<course_name>" notebook="<lesson_slug>.ipynb" runtime="..." />` ("Open with Google Colab" pointing to the GitHub blob URL).
4. **Zero-Backend Browser Execution**:
   Maintain clean separation between static layout (`/src/components/static`) and hydrated islands (`/src/components/islands`). In-browser Python execution runs purely client-side via Pyodide v0.26+ in a Web Worker (`/src/workers/pyodide.worker.ts`) with a hard 5-second timeout. Never introduce Node/server-side execution sandboxes.
5. **Theme & Contrast Integrity**:
   Support Light and Dark mode with `#A7452A` as primary color (using `#E07A5F` in dark mode). Maintain WCAG 2.2 AA contrast compliance across all states.
6. **Layout Stability (AdSense & CLS)**:
   All advertisement slots must use explicit, fixed-height reserved containers to prevent Cumulative Layout Shift (CLS).
