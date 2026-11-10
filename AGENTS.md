# AGENTS.md — Buddhilive Academy

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

1. **Grounding in `/docs`**:
   Whenever creating, revising, or outlining curriculum lessons/tutorials, inspect `/docs` first. Every concept, code snippet, and derivation must cite and originate from authoritative references in `/docs`.
2. **Content Generation Contract (W3Schools Model + Pathfinder Gamification)**:
   - Every tutorial/reference page must be an `.mdx` file in `/src/content/lessons/`.
   - Frontmatter strictly validates against our Zod schema: `title`, `track` (subject), `category`, `order`, `difficulty`, `xp` (for Pathfinder progress), `description`, `topic`, `prerequisites`.
   - Each tutorial must follow a scannable structure: brief conceptual summary, syntax definition, copyable code example with "Try it Yourself" execution, parameter/method tables, and short self-check exercises (at least 350+ words of explanatory prose for high-value AdSense indexing; KaTeX formulas used where mathematically relevant).
   - Use `<PythonRunner client:visible />` for interactive code execution ("Try it Yourself"). Code execution must never block the main thread.
3. **Zero-Backend Code Execution**:
   Maintain clean separation between static layout and hydrated islands. Dynamic Python code execution runs purely client-side via Pyodide v0.26+ in a Web Worker (`/src/workers/pyodide.worker.ts`) with a hard 5-second timeout. Never introduce Node/server-side execution sandboxes.
4. **Theme & Contrast Integrity**:
   Support Light and Dark mode with `#A7452A` as primary color (using approved tints like `#E07A5F` in dark mode). Maintain WCAG 2.2 AA contrast compliance across all states.
5. **Layout Stability (AdSense & CLS)**:
   All advertisement slots must use explicit, fixed-height reserved containers to prevent Cumulative Layout Shift (CLS).
