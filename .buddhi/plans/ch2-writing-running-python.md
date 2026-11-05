# Implementation Plan: Chapter 2 Interactive Lesson (Writing and Running Python)

**Date**: 2026-11-05
**Target File**: `src/content/lessons/python-zero-to-hero/02-writing-and-running-python.mdx`
**Antislop Mode**: `during` (session choice; user confirmed dropping em dashes per **R-02**)
**Design Read**: Reading this as: interactive developer tutorial & reference page for Python beginners, in a high-contrast terracotta digital atelier (`DESIGN.md`) style, dial `ENERGY 1 / RHYTHM 2 / MOTION 1`.

---

## 1. Architecture & Codebase Grounding

### Content Collection & Routing Integration
- **Schema Validation** (`src/content.config.ts#L5-L18`):
  - Collection `lessons` loads `**/*.mdx` under `./src/content/lessons`.
  - Frontmatter for `02-writing-and-running-python.mdx`:
    - `title`: `"Writing, Executing, and Debugging Python Code"`
    - `track`: `"python"`
    - `category`: `"Python Tutorial"`
    - `order`: `2` (immediately follows `python-zero-to-hero/01-setting-up-python` at `order: 1`)
    - `difficulty`: `"beginner"`
    - `xp`: `50`
    - `description`: `"Learn how to execute Python in IDLE's REPL and Script Window, debug SyntaxError and NameError tracebacks, follow PEP 8 variable naming, inspect values, and write helpful comments."` (180 chars, satisfies `min(30)`)
    - `topic`: `"Writing & Running Python"`
    - `prerequisites`: `["python-zero-to-hero/01-setting-up-python"]`
- **Dynamic SSG Routing & Navigation** (`src/pages/learn/[track]/[...slug].astro#L5-L31`, `src/layouts/LessonLayout.astro#L18-L37`, `src/components/static/LessonSidebar.astro#L13-L26`):
  - `getStaticPaths()` automatically emits `/learn/python/python-zero-to-hero/02-writing-and-running-python`.
  - `LessonLayout.astro#L30-L36` automatically wires `Next ❯` on Lesson 01 (`01-setting-up-python.mdx`) to Lesson 02, and `❮ Previous` on Lesson 02 back to Lesson 01.
  - `LessonSidebar.astro#L18-L26` lists Lesson 02 under the `Python Tutorial` category with its `+50xp` badge and completion checkmark.

---

## 2. Lesson Structure & Content Specification (`02-writing-and-running-python.mdx`)

Grounded strictly in the provided Chapter 2 curriculum context from *Python Basics: A Practical Introduction to Python 3*, with all em dashes (`—`) replaced by colons, commas, or parentheses per `antislop` **R-02**, and heading levels starting at `##` (`<h2>`) since `LessonLayout.astro#L83` renders the page `<h1>`.

### Section Breakdown
1. **`## 2.1 Writing and Executing Python Code`**
   - **The Interactive Window & REPL**: Explains IDLE's Python shell, startup header, `>>>` prompt, and the 3-step **Read-Evaluate-Print Loop (REPL)** cycle ($\text{Read} \rightarrow \text{Evaluate} \rightarrow \text{Print}$).
   - **The `print()` Function**: Defines a programming function, arguments, return outputs, and **side effects** (contrasting a pure mathematical function $f: X \rightarrow Y$ with stateful I/O side effects like writing to standard output). Includes copyable `print("Hello, world")` syntax block.
   - **Script Window vs. Interactive Window**: Contrasts single-line REPL exploration (`>>>`) with reusable `.py` files (`hello_world.py`), noting why running a `.py` script inside IDLE preserves the output window compared to double-clicking in a file manager.
2. **`## 2.2 Understanding and Debugging Errors`**
   - **Syntax Errors**: Structural violations caught *before* execution starts (`print("Hello, world)` triggering `SyntaxError: EOL while scanning string literal`, defining **EOL** as *End Of Line* and **string literal**).
   - **Run-Time Errors and Tracebacks**: Failures during active execution (`print(Hello, world)` triggering `NameError: name 'Hello' is not defined`), detailing the 4 components of a Python traceback (file path & line number, offending statement, exception type, diagnostic message).
3. **`## 2.3 Variables and Naming Conventions`**
   - **Assigning Variables**: Using the `=` assignment operator (`phrase = "Hello, world"`), explaining **Accessibility** (reusing computed values across $N$ references in $O(1)$ lookup without recomputing) and **Context** (`seconds_per_hour = 3600`, where $60 \times 60 = 3600\text{ s}$).
   - **Rules for Valid Variable Names**: Allowed characters (`A-Z`, `a-z`, `0-9`, `_`), no leading digits (`9lives` invalid vs. `string1` and `_a1p4a` valid), and strict case-sensitivity ($\text{phrase} \neq \text{Phrase}$, where referencing the wrong case raises a `NameError`).
   - **PEP 8 Naming Conventions**: Official Python style guide rules: `snake_case` vs. `camelCase`, descriptive multi-word identifiers (`num_students`, `seconds_per_hour`) vs. single-letter `s`, keeping identifiers concise (under 3 to 4 words).
4. **`## 2.4 Inspecting Values in the Interactive Window`**
   - **Inspection vs. `print()`**: Contrasts `print(variable)` (human-readable output without quotes) against direct REPL variable inspection (developer representation `repr()` showing `'Hello, world'` and distinguishing integer `2` from string `'2'`). Notes that standalone variable expressions inside `.py` script files produce no output.
5. **`## 2.5 Writing Helpful Comments`**
   - **Types of Comments**: Block comments (`#` on its own line), in-line comments (code followed by at least 2 spaces and `#`), and multi-line comments (consecutive `#` lines).
   - **Best Practices & PEP 8 Rules**: Commenting out code for testing (`Alt + 3` on Windows, `Ctrl + 3` on macOS/Linux), separating in-line comments by $\ge 2$ spaces, avoiding obvious restatements of *what* the code does, and explaining *why* a design choice was made.
6. **Reference Tables (`<h2>` / `<h3>` + Semantic Markdown Tables)**
   - **Table 1**: Error Categories, Variable Identifier Rules, and Inspection vs. `print()` comparison table (valid vs. invalid variable names, `SyntaxError` vs. `NameError`, `print(x)` vs. REPL inspection).

### Interactive Islands (`src/components/islands/`)
1. **`<PythonRunner client:visible />` #1 (`Example 1: Variables, PEP 8 snake_case, and print() vs. Inspection`)**
   - Starter code demonstrating `phrase = "Hello, world"`, `seconds_per_hour = 60 * 60`, PEP 8 `snake_case` variables, inline/block comments with $\ge 2$ spaces, and comparing `print( value )` with `repr( value )` (simulating REPL value inspection vs. `print()` output for integer `2` vs. string `"2"`).
2. **`<PythonRunner client:visible />` #2 (`Example 2: Debugging Syntax and NameError Pitfalls`)**
   - Starter code where learners inspect and run fixed variable assignments (`greeting = "Hello, world"`, case-sensitive identifiers, and commented-out buggy lines explaining `SyntaxError` and `NameError`) inside the Pyodide Web Worker.
3. **`<QuizCard client:visible />` (`Quick Self-Check`)**
   - Multiple-choice conceptual check testing Chapter 2 principles (distinguishing `SyntaxError` vs. `NameError`, valid PEP 8 variable names, and `print()` vs. interactive inspection), with 4 options, `correctAnswer`, and detailed explanation.

---

## 3. Files to Touch

| File Path | Action | Description |
| :--- | :--- | :--- |
| `src/content/lessons/python-zero-to-hero/02-writing-and-running-python.mdx` | **CREATE** | Complete Chapter 2 interactive tutorial (350+ words prose, KaTeX math, reference table, 2 `<PythonRunner client:visible />` islands, 1 `<QuizCard client:visible />` island). |
| `A11Y-DECISIONS.md` | **UPDATE** | Record Chapter 2 lesson accessibility conformance (heading hierarchy `h2` -> `h3`, semantic reference table headers, KaTeX math notation, and island reuse). |

*(No route or layout code changes needed; `src/pages/learn/[track]/[...slug].astro` and `src/layouts/LessonLayout.astro` dynamically resolve all lessons in `src/content/lessons/`.)*

---

## 4. Ordered Implementation Steps

1. **Author `src/content/lessons/python-zero-to-hero/02-writing-and-running-python.mdx`**:
   - Write validated Zod frontmatter (`order: 2`, `track: "python"`, `category: "Python Tutorial"`, `xp: 50`, `prerequisites: ["python-zero-to-hero/01-setting-up-python"]`).
   - Author Sections 2.1 through 2.5, Reference Table, 2 `<PythonRunner client:visible />` islands, and 1 `<QuizCard client:visible />` island.
   - Audit prose against `antislop` and `antislop-copywriting` checklists (zero em dashes `—` per **R-02**, no AI buzzwords per **R-16**, active voice, $\ge 350$ words of grounded prose).
2. **Update `A11Y-DECISIONS.md`**:
   - Log Decision 8 documenting Chapter 2 table semantics, heading hierarchy, and reused accessible islands.
3. **Run Verification & Delivery Gates** (via `terminal-runner`):
   - Execute `pnpm astro check`, `pnpm build`, and `buddhi scripts verify-a11y`.

---

## 5. Testing & Verification Strategy

1. **Schema & Typecheck Gate**:
   - Run `pnpm astro check` to verify `02-writing-and-running-python.mdx` frontmatter against `src/content.config.ts#L7-L17` and validate TypeScript props on `<PythonRunner />` and `<QuizCard />`.
2. **SSG Build & Route Verification**:
   - Run `pnpm build` and confirm `dist/learn/python/python-zero-to-hero/02-writing-and-running-python/index.html` is generated cleanly with rendered KaTeX markup and linked from `dist/learn/python/python-zero-to-hero/01-setting-up-python/index.html`.
3. **Accessibility Static Gate**:
   - Run `buddhi scripts verify-a11y` via `terminal-runner` to verify zero WCAG 2.2 AA regressions.
4. **Content & Antislop Gate**:
   - Verify prose word count $\ge 350$ words, 2 `<PythonRunner client:visible />` components, 1 `<QuizCard client:visible />` component, valid KaTeX math expressions, and 0 em dashes (`—`).

