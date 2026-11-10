# Feature Specification: Chapter 1 Interactive Lesson — Setting Up Python

**Feature Branch**: `007-python-zero-hero`

**Created**: 2026-11-04

**Status**: Draft

**Input**: User description: "Chapter 1 Analysis & Tutorial: 'Setting Up Python' — generate interactive lesson under `src/content/lessons/python-zero-to-hero/` grounded in *Python Basics: A Practical Introduction to Python 3*."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read & Master the Chapter 1 "Setting Up Python" Tutorial (Priority: P1)

A learner navigates to the Chapter 1 lesson (`Setting Up Python`) from the Python tutorial sidebar or course progression and reads a comprehensive, scannable guide covering Python versions (System Python vs. official `python.org` Python 3.8+, coexistence, and why third-party distributions like Homebrew/Anaconda are avoided), step-by-step installation instructions for Windows, macOS, and Ubuntu Linux, and how to launch IDLE and interpret the interactive Python Shell (`>>>` prompt).

**Why this priority**: Delivering the grounded curriculum content at a valid, navigable static URL is the core value of this feature and forms the standalone MVP.

**Independent Test**: Run `pnpm astro check` and `pnpm build`, open the generated Chapter 1 lesson page in `/learn/python/...`, and verify that all sections (1.1 Versions, 1.2 Windows, 1.3 macOS, 1.4 Ubuntu Linux, and IDLE / Interactive Shell), reference tables, and KaTeX expressions render cleanly with at least 350 words of prose.

**Acceptance Scenarios**:

1. **Given** `src/content/lessons/python-zero-to-hero/01-setting-up-python.mdx` has valid Zod frontmatter (`track: "python"`, `order: 1`, `description` ≥ 30 chars), **When** `pnpm build` runs, **Then** the static lesson page is generated without schema or routing errors and links properly in `LessonSidebar.astro` and course navigation.
2. **Given** a learner views the Chapter 1 lesson page, **When** they read through the tutorial sections, **Then** they find accurate coverage of Section 1.1 (System Python, coexistence, `python.org` vs. Homebrew/Anaconda warning), Section 1.2 (Windows `.exe` installer, checking "Add Python 3.x to PATH", opening IDLE from Start Menu), Section 1.3 (macOS `.pkg` installer, opening IDLE via Finder or Spotlight `Cmd + Spacebar`), Section 1.4 (Ubuntu `python3 --version`, `lsb_release -a`, `apt-get` on Ubuntu 18.04+ vs. `ppa:deadsnakes/ppa` on Ubuntu ≤ 17, launching `idle-python3.8`), and Understanding IDLE & The Interactive Window (IDLE Shell header & `>>>` prompt).
3. **Given** the lesson page contains ≥ 350 words of explanatory prose and inline/display KaTeX math (`$...$`, such as 32-bit $2^{32}$ vs. 64-bit $2^{64}$ memory addressing and version tuple comparisons), **When** rendered in the browser, **Then** all mathematical notation is formatted via KaTeX CSS with zero raw TeX leakage.

---

### User Story 2 - Test Conceptual Understanding with Interactive QuizCard (Priority: P2)

Before or after experimenting with code, a learner answers an interactive multiple-choice self-check quiz (`<QuizCard client:visible />`) that tests key conceptual takeaways from Chapter 1 (such as the purpose of checking "Add Python 3.x to PATH" during Windows setup or why `python.org` installers are preferred over system Python).

**Why this priority**: Active recall reinforces setup pitfalls before learners move on to writing code in subsequent chapters.

**Independent Test**: Load the Chapter 1 lesson page, scroll to the `<QuizCard />`, select both an incorrect and the correct option via mouse or keyboard, and verify immediate visual/text feedback and explanation display.

**Acceptance Scenarios**:

1. **Given** the `<QuizCard client:visible />` component is hydrated on the Chapter 1 page, **When** the learner selects an option, **Then** the card indicates whether the choice is correct or incorrect using accessible text and icons (not color alone) and reveals the grounded explanation.
2. **Given** a keyboard-only user tabs into the `<QuizCard />`, **When** they navigate and activate an option with `Enter` or `Space`, **Then** focus remains visible (`:focus-visible`) and screen-reader semantics announce the result.

---

### User Story 3 - Inspect the Live Python Environment & Simulate the Shell with PythonRunner (Priority: P2)

Because local OS installation steps cannot be executed inside a web browser, the learner uses 1–2 interactive `<PythonRunner client:visible />` islands inside the lesson to inspect the live Python 3 interpreter environment (`sys.version`, `sys.version_info`, `platform.python_version()`, `platform.architecture()`) and experiment with expressions just as they would at IDLE's `>>>` interactive prompt.

**Why this priority**: Bridges the gap between setting up a local IDLE environment and immediately practicing interactive Python 3 verification in-browser without blocking the main thread.

**Independent Test**: Click "Run" on each `<PythonRunner />` in the Chapter 1 lesson and verify that Pyodide executes the starter code in the Web Worker and outputs the version/platform inspection and interactive shell expressions within 5 seconds.

**Acceptance Scenarios**:

1. **Given** the first `<PythonRunner client:visible />` ("Verify Your Python 3 Version & Architecture"), **When** the learner runs the starter code using Python's built-in `sys` and `platform` modules, **Then** the output console displays the running Python 3 version tuple, verifies `sys.version_info >= (3, 8)`, and prints the architecture bit-width.
2. **Given** the second `<PythonRunner client:visible />` ("Practice in the Interactive Shell"), **When** the learner runs or edits starter expressions matching the IDLE `>>>` prompt workflow, **Then** the output console displays the evaluated results without blocking the main UI thread.

---

### Edge Cases

- **Nested lesson directory (`src/content/lessons/python-zero-to-hero/01-setting-up-python.mdx`)**: Astro's `glob` loader produces an `entry.id` containing a slash (`python-zero-to-hero/01-setting-up-python`). The dynamic route under `src/pages/learn/[track]/` MUST support nested lesson IDs (via rest parameter `[...slug].astro`) so static generation and sidebar/prev/next links work seamlessly alongside other lessons.
- **Ordering with existing `01-hello-python.mdx`**: If `01-setting-up-python.mdx` is Chapter 1 (`order: 1`), `01-hello-python.mdx` can be ordered after it (`order: 2`) or kept with deterministic ordering so there is no `order` collision in the `python` track.
- **LaTeX `$` collision with bash `$` prompt**: Bash commands (`$ python3 --version`, `$ lsb_release -a`, `$ sudo apt-get update`) use `$` inside fenced ```` ```bash ```` blocks; prose MUST NOT contain two unescaped literal `$` signs in the same paragraph that would accidentally trigger KaTeX math mode.
- **Removed/missing links in source material**: The source prompt contains `[python.org]([suspicious link removed])`; the MDX lesson MUST use the clean, authoritative `https://www.python.org/downloads/` URL (and OS-specific download paths on `python.org`) rather than broken placeholder text.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST add the Chapter 1 interactive lesson at `src/content/lessons/python-zero-to-hero/01-setting-up-python.mdx` with valid Zod frontmatter (`title`, `track: "python"`, `category: "Python Tutorial"`, `order: 1`, `difficulty: "beginner"`, `xp`, `description` ≥ 30 chars, `topic`, `prerequisites: []`).
- **FR-002**: System MUST support nested lesson file IDs (such as `python-zero-to-hero/01-setting-up-python`) in the `/learn/[track]/[...slug]` route so `getStaticPaths()`, `LessonSidebar.astro`, `LessonLayout.astro` (`❮ Previous` / `Next ❯`), and `LessonProgressPanel.tsx` work without 404 errors or broken URLs.
- **FR-003**: Lesson content MUST be strictly grounded in the provided Chapter 1 source material (*Python Basics: A Practical Introduction to Python 3*, "Setting Up Python"):
  - **Section 1.1 (A Note on Python Versions)**: System Python vs. latest Python 3 (3.8+), side-by-side coexistence without interfering with OS operations, and the warning against third-party distributions/package managers (Homebrew, Anaconda) in favor of official `python.org` installers.
  - **Section 1.2 (Windows Setup Tutorial)**: Downloading the Windows x86-64 (or 32-bit) executable installer from `python.org`, checking **"Add Python 3.x to PATH"** before clicking **Install Now**, and launching **IDLE (Python 3.8+)** from the Windows Start Menu.
  - **Section 1.3 (macOS Setup Tutorial)**: Downloading the macOS installer (`.pkg`) from `python.org` (avoiding pre-installed Python 2), running the installer, and opening IDLE via Finder (`Applications -> Python 3.8 -> IDLE`) or Spotlight (`Cmd + Spacebar`, type `idle`).
  - **Section 1.4 (Ubuntu Linux Setup Tutorial)**: Checking `python3 --version` and `lsb_release -a`, installing `python3.8` and `idle-python3.8` via Universe repository (`Ubuntu 18.04+`) or `ppa:deadsnakes/ppa` (`Ubuntu 17 and lower`), and launching IDLE with `idle-python3.8` (or `idle3` verified at 3.8+).
  - **Understanding IDLE & The Interactive Window**: Reading the Python Shell header info (version, build, OS) and understanding the `>>>` interactive prompt.
- **FR-004**: Lesson MUST include at least **350+ words** of clear conceptual prose, a W3Schools-style summary/reference table comparing setup across Windows, macOS, and Ubuntu Linux, and relevant KaTeX mathematical expressions (`$...$`, e.g., 32-bit $2^{32}$ vs. 64-bit $2^{64}$ address space and semantic version comparison) for AdSense and editorial quality compliance.
- **FR-005**: Lesson MUST embed 1–2 interactive `<PythonRunner client:visible />` islands with starter code that runs purely client-side in the Pyodide Web Worker.
- **FR-006**: Lesson MUST embed 1 `<QuizCard client:visible />` component testing conceptual understanding of Chapter 1 with 4 options, a `correctAnswer` index, and an explanatory rationale.
- **FR-007 (A11Y & DESIGN.md)**: All rendered lesson content, tables, code blocks, and interactive islands MUST conform to `DESIGN.md` tokens (`#A7452A` light / `#E07A5F` dark) and WCAG 2.2 Level AA accessibility requirements (semantic heading hierarchy `h2` → `h3`, accessible table headers, keyboard operability, visible `:focus-visible` states, and zero Cumulative Layout Shift).

### Key Entities

- **Lesson Entry (`01-setting-up-python.mdx`)**: An Astro Content Collection entry in `lessons` with id `python-zero-to-hero/01-setting-up-python`, `track: "python"`, `order: 1`, and MDX body combining prose, KaTeX, tables, `<PythonRunner />`, and `<QuizCard />`.
- **Lesson Route (`/learn/[track]/[...slug]`)**: Static route resolving both flat (`01-hello-python`) and nested (`python-zero-to-hero/01-setting-up-python`) lesson slugs within a track.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `pnpm astro check` and `pnpm build` succeed with 0 errors and emit the static HTML page for `/learn/python/python-zero-to-hero/01-setting-up-python`.
- **SC-002**: The Chapter 1 MDX lesson contains ≥ 350 words of explanatory prose (excluding frontmatter, imports, and code blocks), 1–2 `<PythonRunner client:visible />` islands, 1 `<QuizCard client:visible />` island, at least 1 markdown reference table, and valid KaTeX math expressions.
- **SC-003**: Navigating between `01-setting-up-python` and `01-hello-python` works in both directions via the `❮ Previous` / `Next ❯` buttons and the `LessonSidebar` links.
- **SC-004**: Static accessibility gate (`buddhi scripts verify-a11y`) passes with zero WCAG 2.2 AA violations.

## Assumptions

- Even though Chapter 1 of the textbook references Python 3.8 as the baseline version when the book was authored, the lesson will accurately teach the book's Python 3.8+ baseline while noting that `sys.version_info >= (3, 8)` holds true for modern Python 3 releases (including the Pyodide Python 3.12 runtime in the browser).
- The new lesson is placed in `src/content/lessons/python-zero-to-hero/01-setting-up-python.mdx` (`order: 1`) under the shared `track: "python"`, while existing `src/content/lessons/01-hello-python.mdx` is bumped to `order: 2` (or ordered right after Chapter 1).
