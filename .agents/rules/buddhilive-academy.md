---
name: buddhilive-academy
version: 1.0.0
priority: P0
trigger: always_on
---

# Antigravity Rules: Buddhilive Academy

## 1. Grounding Rule (Non-Negotiable)
- Whenever tasked with creating, editing, or outlining tutorials/lessons, inspect `/docs` first.
- Every code snippet, algorithm, and concept must cite and derive from reference documents in `/docs`.
- Hallucinated topics or unreferenced external materials are strictly forbidden without user approval.

## 2. Content Generation Contract (W3Schools Architecture + Pathfinder Progress)
- **File Format**: Every tutorial page is an `.mdx` file located inside `/src/content/lessons/`.
- **Frontmatter Schema**: Strict Zod validation required:
  - `title` (string)
  - `track` (string identifier, e.g. "python", "sql", "numpy")
  - `category` (string section heading, e.g. "Python Tutorial", "Python Functions", "Python Reference")
  - `order` (number)
  - `difficulty` ("beginner" | "intermediate" | "advanced")
  - `xp` (integer, for Pathfinder / My Learning tracking)
  - `description` (string min 30 chars for SEO)
  - `topic` (string optional)
  - `prerequisites` (array of slugs optional)
- **Content & AdSense Standard**: Each article must follow the scannable W3Schools layout:
  1. Quick conceptual explanation & syntax block.
  2. Concrete copyable code example + "Try it Yourself" execution island.
  3. Reference/parameter tables explaining inputs, outputs, and edge cases.
  4. Quick self-check quiz or exercise.
  5. Minimum **350+ words** of clear explanatory prose ensuring top-tier SEO and AdSense indexing. KaTeX formulas used when mathematically relevant.
- **Execution Island**: Interactive execution must use `<PythonRunner client:visible />`. Code execution must never block the main thread.

## 3. Code Integrity & Client-Side Sandbox
- **Zero-Backend Execution**: Python executes 100% in the user's browser via Pyodide v0.26+ in a dedicated Web Worker (`/src/workers/pyodide.worker.ts`).
- **Hard Timeout**: Enforce a 5-second termination watchdog to guard against infinite loops.
- **Dependency Guard**: Never introduce Node or server-side dependencies for code execution. Maintain clean separation between static Astro layouts (`/src/components/static`) and hydrated interactive islands (`/src/components/islands`).

## 4. Theme & Accessibility Standards
- **Color System**: Primary brand color is terracotta `#A7452A` (with calibrated dark mode companion `#E07A5F`).
- **Mode Support**: Support both Light and Dark modes.
- **WCAG 2.2 AA**: All text, surfaces, and interactive focus states (`:focus-visible`) must maintain AA contrast ratios (4.5:1 for normal text, 3.0:1 for large text/borders).
- **Zero CLS**: AdSense containers must have pre-allocated fixed-height dimensions to eliminate Cumulative Layout Shift.
