# Implementation Plan: Beginner-Friendly Curriculum & Repo Cleanup

## Summary

Update BuddhiAI Academy (`bl-academy`) across four areas:
1. Remove `<PythonRunner>` (Pyodide) from Courses 01–08 (`180` lessons), replacing each with a static fenced `python` code block and expected output note while keeping `<PythonRunner>` in Course 00 (`python-zero-to-hero`, `12` lessons).
2. Fill repository placeholders (e.g., `<your-username>/<repo>`) with `buddhilive/bl-academy`.
3. Audit and revise all `192` lessons across Courses 00–08 to be beginner-friendly (plain-English analogies first, step-by-step math symbol breakdowns, no unexplained algorithm dumps).
4. Update `README.md` to match the current 9-course architecture and add an MIT `LICENSE` (`Copyright (c) 2026 BuddhiLive`).

---

## Ordered Implementation Steps

### 1. Update Curriculum Metadata & Landing Page Copy
- **`src/lib/curriculum.ts`** (lines `83`, `150`, `209`, `282`, `353`, `421`, `489`, `559`): Remove `'In-Browser Pyodide'` from `runtimeBadges` for Courses `01`–`08`, keeping `'In-Browser Pyodide'` exclusive to Course `00` (`python-zero-to-hero`, line `43`).
- **`src/pages/index.astro`** (line `292`): Clarify that In-Browser Pyodide powers Course `00` (Python Zero to Hero) fundamentals, while Courses `01`–`08` run on Google Colab Free Tier and Google AI Studio Free Tier.

### 2. Remove `<PythonRunner>` from Courses 01–08 & Fix Placeholders
- **Target files**: All `180` `.mdx` files in:
  - `src/content/lessons/ai-for-beginners/` (`26` files)
  - `src/content/lessons/data-science-for-beginners/` (`20` files)
  - `src/content/lessons/ml-for-beginners/` (`27` files)
  - `src/content/lessons/generative-ai-for-beginners/` (`22` files)
  - `src/content/lessons/mcp-for-beginners/` (`22` files)
  - `src/content/lessons/ai-agents-for-beginners/` (`19` files)
  - `src/content/lessons/harness-engineering/` (`24` files)
  - `src/content/lessons/edge-ai-for-beginners/` (`20` files)
- **Changes per file**:
  - Remove `import PythonRunner from '../../../components/islands/PythonRunner';`.
  - Convert `<PythonRunner client:visible title="..." expectedOutput="..." initialCode={\`...\`} />` into a static fenced ` ```python ` block plus an `**Expected Output:**` fenced ` ```text ` block (styled via `src/layouts/LessonLayout.astro:151` and `:239-242`).
  - Keep `<PythonRunner>` intact in `src/content/lessons/python-zero-to-hero/*.mdx` (`12` files).
- **Placeholders**:
  - In `src/content/lessons/ai-agents-for-beginners/01-course-setup-colab-and-gemini-agent-stack.mdx` (lines `28`, `31`, `32`), replace `https://github.com/<your-username>/<repo>.git` with `https://github.com/buddhilive/bl-academy.git` and `cd <repo>` with `cd bl-academy` (matching `src/components/static/ColabButton.astro:16`).
  - Sweep all `192` `.mdx` files for any other `<your-*>`, `<repo>`, `TODO`, or `FIXME` placeholders and replace them with accurate values.

### 3. Beginner-Friendly Prose Pass (All 9 Courses, 192 Lessons)
- Audit and edit lessons across `src/content/lessons/<course>/*.mdx` in course batches (`00` through `08`) while preserving:
  - `src/content.config.ts` frontmatter schema (`title`, `track`, `category`, `order`, `difficulty`, `xp`, `description` >= 30 chars, `topic`, `prerequisites`).
  - `my-writing-style` voice, `<ColabButton>` / `<QuizCard>` components, minimum `350+` words per lesson, and zero `.ref/` mentions.
- **Pedagogical improvements per lesson**:
  - Lead every new concept or algorithm with a plain-English analogy or concrete intuition before introducing technical terms or formulas.
  - Break down KaTeX formulas symbol-by-symbol immediately after displaying them (avoiding unexplained notation like "homogeneous coordinates" or dense summations without intuition).
  - Replace unexplained algorithm lists with clear, plain-English explanations of what each algorithm does and when a beginner would use it.

### 4. Update `README.md` & Add MIT `LICENSE`
- **`LICENSE`** (new file at repo root): Standard MIT License with `Copyright (c) 2026 BuddhiLive`.
- **`README.md`**: Rewrite to document:
  - The 9-course sequential AI Engineering curriculum (`00 Python` → `08 Edge AI`).
  - Zero-backend Astro 7 SSG + React islands architecture (`src/layouts/LessonLayout.astro`, `src/lib/curriculum.ts`).
  - Execution model: In-Browser Pyodide for Course `00`, Google Colab Free Tier (`notebook/<course>/`) + Google AI Studio Free Tier (`GEMINI_API_KEY`) for Courses `01`–`08`.
  - Accurate directory structure (`src/content/lessons/`, `notebook/`, `ACKNOWLEDGEMENTS.md`), dev/build/check commands (`pnpm install`, `pnpm dev`, `pnpm build`, `pnpm astro check`), and MIT License reference.

---

## Testing & Verification Plan

1. **Content & Placeholder Audit Script**:
   - Verify `0` occurrences of `PythonRunner` across Courses `01`–`08` (`180` files) and `12` lessons retaining `PythonRunner` in `python-zero-to-hero`.
   - Verify `0` occurrences of `<your-username>`, `<repo>`, `TODO`, `FIXME`, or `.ref/` in `src/content/lessons/`.
   - Verify all `192` `.mdx` files meet the `350+` word minimum and retain valid MDX syntax.
2. **Typecheck & Schema Validation**:
   - Run `pnpm astro check` to validate TypeScript and `src/content.config.ts` frontmatter schemas across all `192` lessons.
3. **Production SSG Build**:
   - Run `pnpm build` (outputs to gitignored `./docs` per `astro.config.mjs:14` and `.gitignore:3`) to confirm zero MDX compilation or KaTeX rendering errors.
4. **Git Hygiene**:
   - Create a feature branch (e.g., `feat/beginner-curriculum-cleanup`) from `main`, keep `./docs` untracked/ignored, and group commits logically (metadata/UI, Pyodide removal + placeholders, beginner-friendly course updates, `README.md` + `LICENSE`).
