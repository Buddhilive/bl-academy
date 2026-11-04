# Implementation Plan: Chapter 1 Interactive Lesson — Setting Up Python

**Branch**: `007-python-zero-hero` | **Date**: 2026-11-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `.buddhi/specs/007-python-zero-hero/spec.md`

## Summary

Author the Chapter 1 interactive tutorial (`src/content/lessons/python-zero-to-hero/01-setting-up-python.mdx`, `order: 1`, `track: "python"`) grounded strictly in *Python Basics: A Practical Introduction to Python 3* ("Setting Up Python"), and upgrade the lesson dynamic route from single-segment `src/pages/learn/[track]/[slug].astro` to rest-parameter `src/pages/learn/[track]/[...slug].astro` so nested collection IDs (`python-zero-to-hero/01-setting-up-python`) resolve statically alongside top-level lessons (`01-hello-python.mdx`, updated to `order: 2`).

## Technical Context

**Language/Version**: TypeScript 5.x, Astro 5.x (Content Layer + MDX), React 19, Python 3.12 (via Pyodide v0.26+ in Web Worker)

**Primary Dependencies**: `astro`, `@astrojs/mdx`, `@astrojs/react`, `katex`, `remark-math`, `rehype-katex`, `@uiw/react-codemirror`

**Storage**: Client-side `localStorage` (`src/lib/storage.ts`, where `SLUG_REGEX = /^[a-z0-9][a-z0-9-_/]*$/i` already supports `/` in nested lesson slugs)

**Testing**: `pnpm astro check`, `pnpm build`, and `buddhi scripts verify-a11y`

**Target Platform**: Static Site Generation (SSG) + modern browsers with WebAssembly & Web Workers

**Project Type**: Interactive educational web application (Astro SSG + React islands)

**Performance Goals**: Zero main-thread blocking during Python execution (Web Worker with 5s timeout); zero Cumulative Layout Shift (CLS ≤ 0.1) via fixed-height AdSense containers and `client:visible` island hydration

**Constraints**:
- Strictly grounded in Chapter 1 source text (1.1 Python Versions, 1.2 Windows Setup, 1.3 macOS Setup, 1.4 Ubuntu Linux Setup, and Understanding IDLE & The Interactive Window).
- Minimum 350+ words of clear conceptual prose with KaTeX math (`$...$`) and W3Schools-style reference table.
- 1–2 `<PythonRunner client:visible />` islands and 1 `<QuizCard client:visible />` island.
- No server-side code execution or new external dependencies.

**Scale/Scope**: 1 new MDX lesson file, 1 route rename/update (`[slug].astro` → `[...slug].astro`), 1 order bump in `01-hello-python.mdx`, and 1 dynamic first-lesson href update in `LessonProgressPanel.tsx`.

### Architectural Lenses & Trade-Off Analysis

1. **Fewest-slices**:
   - Renaming `src/pages/learn/[track]/[slug].astro` to `src/pages/learn/[track]/[...slug].astro` allows Astro's `getStaticPaths()` to pass `slug: entry.id` unchanged (`python-zero-to-hero/01-setting-up-python` and `01-hello-python`).
   - Because `LessonLayout.astro`, `LessonSidebar.astro`, `index.astro`, and `storage.ts` already construct URLs as `/learn/${lesson.data.track}/${lesson.id}` and validate `/` in `isValidSlug()`, zero slug-stripping shims are needed across layouts or storage.
2. **Risk-first**:
   - **Route slash resolution**: Single-segment `[slug].astro` throws a build error when `params.slug` contains `/`. Switching to rest parameter `[...slug].astro` de-risks SSG builds immediately.
   - **KaTeX vs. Shell `$` prompt**: Ubuntu terminal snippets (`$ python3 --version`) use `$` prompts inside ```` ```bash ```` blocks; prose will avoid unescaped literal `$` characters and use backticks for shell commands so `remark-math` only parses intended `$...$` mathematical formulas.
   - **Top nav link consistency**: `LessonProgressPanel.tsx` currently hardcodes `/learn/python/01-hello-python` in `AVAILABLE_TRACKS`. Updating it to resolve the first ordered lesson (`trackLessons[0]?.id`) ensures the top "Python" pill always routes to `order: 1` (`python-zero-to-hero/01-setting-up-python`).
3. **Seam-quality**:
   - Reuses existing hydrated islands (`PythonRunner.tsx` and `QuizCard.tsx`) via relative MDX imports (`../../../components/islands/...`) with `client:visible` hydration, keeping static prose and interactive islands cleanly separated.

## AGENTS.md & DESIGN.md Compliance Check

- [x] **Grounding in curriculum source**: Every section, OS installation step, command, and IDLE concept derives directly from Chapter 1 ("Setting Up Python").
- [x] **Content Generation Contract**: `.mdx` file in `/src/content/lessons/python-zero-to-hero/01-setting-up-python.mdx` validated by `src/content.config.ts` Zod schema; ≥ 350 words of prose; KaTeX math formulas; W3Schools scannable structure; `<PythonRunner client:visible />` and `<QuizCard client:visible />`.
- [x] **Zero-Backend Code Execution**: All Python starter snippets (`sys`, `platform`, arithmetic/shell expressions) execute in `/src/workers/pyodide.worker.ts` with a 5-second watchdog timeout.
- [x] **Theme & Contrast Integrity (`DESIGN.md`)**: Uses approved terracotta tokens (`#A7452A` light / `#E07A5F` dark) and neutral obsidian/vellum surfaces meeting WCAG 2.2 AA contrast ratios.
- [x] **Layout Stability (AdSense & CLS)**: Rendered inside `LessonLayout.astro` with pre-allocated `AdSlot.astro` containers.
- [x] **Build & Verification Commands**: `pnpm astro check`, `pnpm build`, and `buddhi scripts verify-a11y`.

## Accessibility Strategy (WCAG 2.2 AA & `a11y` Skill)

- **Compliance Profile**: Standard (WCAG 2.2 Level AA).
- **Heading Hierarchy**: `LessonLayout.astro` renders `<h1>{entry.data.title}</h1>`. The MDX body MUST use strictly sequential `<h2>` and `<h3>` headings (never `<h1>` or skipped levels).
- **Data Tables (`references/guide-tables.md`)**: The OS Setup & IDLE Reference Table will use semantic table markup (including `<caption>` and `<th scope="col">`) so screen readers announce column headers and table dimensions accurately.
- **Interactive Islands (`A11Y-DECISIONS.md`)**:
  - `QuizCard.tsx` provides `role="radiogroup"`, `role="radio"`, `aria-checked`, keyboard navigation, and `aria-live="polite"` explanation feedback (Decision 2 & 3).
  - `PythonRunner.tsx` provides Escape-key focus trap mitigation, `aria-live="polite"` output status, and `prefers-reduced-motion` confetti guard (Decision 1, 3 & 4).
- **Contrast & Static Gate**:
  - Verify color pairings via `buddhi scripts contrast` (Primary `#A7452A` on `#FFFFFF` = 5.95:1; Dark Primary `#E07A5F` on `#121212` = 6.35:1).
  - Run `buddhi scripts verify-a11y` via `terminal-runner` after implementation and update `A11Y-DECISIONS.md` / `REPORT.md` if any new UI patterns are introduced.

## Project Structure

### Documentation (this feature)

```text
.buddhi/specs/007-python-zero-hero/
├── spec.md              # Feature specification (/specify output)
├── plan.md              # Implementation plan (/spec-plan output)
└── tasks.md             # Actionable task list (/spec-tasks output)
```

### Source Code (repository root)

```text
src/
├── content.config.ts                                           # Existing Zod schema for lessons collection
├── content/
│   └── lessons/
│       ├── 01-hello-python.mdx                                 # UPDATE: bump order from 1 -> 2, prerequisites -> ["python-zero-to-hero/01-setting-up-python"]
│       └── python-zero-to-hero/
│           └── 01-setting-up-python.mdx                        # NEW: Chapter 1 interactive lesson (order: 1)
├── components/
│   ├── islands/
│   │   ├── LessonProgressPanel.tsx                             # UPDATE: link Python track pill to first lesson in trackLessons
│   │   ├── PythonRunner.tsx                                    # Existing interactive code runner island
│   │   └── QuizCard.tsx                                        # Existing multiple-choice quiz island
│   └── static/
│       └── LessonSidebar.astro                                 # Existing sidebar navigation
├── layouts/
│   └── LessonLayout.astro                                      # Existing lesson layout with KaTeX & AdSlots
└── pages/
    └── learn/
        └── [track]/
            └── [...slug].astro                                 # RENAME/UPDATE from [slug].astro to support nested folder IDs
```

**Structure Decision**: Single Astro SSG project. Renaming `[slug].astro` to `[...slug].astro` cleanly supports nested subdirectories under `src/content/lessons/` while preserving existing collection IDs and local storage keys.

## Complexity Tracking

No `AGENTS.md` or `DESIGN.md` violations or extra architectural complexity introduced.
