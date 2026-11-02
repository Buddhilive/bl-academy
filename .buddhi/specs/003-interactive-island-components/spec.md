# Feature Specification: Interactive Island Components

**Feature Branch**: `003-interactive-island-components`  
**Created**: 2026-11-01  
**Status**: Ready for Planning  
**Input**: User description: "Interactive Island Components in src/components/islands/: PythonRunner.tsx, QuizCard.tsx, LessonFooter.tsx"

---

## Overview

Buddhilive Academy requires a cohesive trio of interactive React island components inside `src/components/islands/` to power bite-sized STEM lessons:
1. `PythonRunner.tsx`: An in-browser Python execution environment powered by client-side Pyodide Web Worker (`usePyodide`), CodeMirror editor with Python syntax highlighting, execution console, and optional automated test validation with celebratory confetti.
2. `QuizCard.tsx`: An accessible multiple-choice assessment card delivering instant visual feedback, conceptual explanations, and emitting completion events.
3. `LessonFooter.tsx`: A sticky or bottom lesson action bar highlighting visual XP progression and providing a "Complete & Next Lesson" transition trigger.

All components adhere strictly to the project's DESIGN.md tokens (terracotta `#A7452A` / dark mode `#E07A5F`), WCAG 2.2 AA accessibility standards, zero-backend execution constraints, and Astro `client:visible` hydration lifecycles.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Interactive Code Execution Island (Priority: P1)

As a STEM student reading a lesson,  
I want to edit and execute Python code snippets directly in the browser and see immediate output,  
So that I can practice computational concepts interactively without installing local software or relying on a server backend.

**Why this priority**: Core value proposition of Buddhilive Academy. Interactive coding is the primary differentiator and learning mechanism of the platform.

**Independent Test**: Mount `PythonRunner` in isolation on any lesson or test page (`client:visible`). Provide initial code `print("Hello Buddhi")`. Click "Run Code" (or press `Ctrl+Enter`). Verify the code executes via the Pyodide Web Worker, displays the stdout in the terminal console, displays the execution timer/status, and if `expectedOutput` matches, triggers confetti and passes the challenge.

**Acceptance Scenarios**:

1. **Successful Execution**:
   - **Given** a mounted `PythonRunner` with valid Python code,
   - **When** the user clicks "Run Code" or presses `Ctrl+Enter` (`Cmd+Enter` on macOS),
   - **Then** the button transitions to a loading state with spinner, the Pyodide Web Worker processes the code within the 5s watchdog limit, and the output appears in the console panel.
2. **Automated Verification & Confetti**:
   - **Given** `PythonRunner` is configured with `expectedOutput="42"`,
   - **When** the user runs code that outputs `"42\n"`,
   - **Then** a "Pass / Success" badge appears, `triggerCompletionConfetti()` is invoked (respecting `prefers-reduced-motion`), and screen readers announce the success status via `aria-live`.
3. **Execution Error Handling**:
   - **Given** a user inputs syntax-invalid code (e.g. `print(`),
   - **When** the user executes the code,
   - **Then** the error console highlights the Python traceback in red/amber high-contrast typography without breaking the page or crashing the worker.
4. **Keyboard & Focus Accessibility**:
   - **Given** a keyboard-only user focusing inside the CodeMirror editor,
   - **When** the user presses `Escape`,
   - **Then** the editor releases key trapping so `Tab` moves focus to the "Run Code" button.

---

### User Story 2 - Conceptual Assessment Island (Priority: P2)

As a learner finishing an explanation section,  
I want to test my conceptual understanding through a multiple-choice question with instant feedback,  
So that I can verify my mastery before moving forward to deeper challenges.

**Why this priority**: Bridges conceptual reading and hands-on coding. Provides structured checkpoints throughout the lesson content.

**Independent Test**: Mount `QuizCard` with a question, 4 option strings, correct answer index, and an explanation. Select option A (incorrect): verify immediate red/warning indicator and explanation text. Select option B (correct): verify green success indicator, celebration feedback, and check that `onAnswer(true)` is dispatched.

**Acceptance Scenarios**:

1. **Correct Answer Selection**:
   - **Given** an unselected `QuizCard` with 4 options,
   - **When** the user selects the correct option,
   - **Then** the chosen option card highlights in success green (WCAG AA compliant), the conceptual explanation is revealed, and `onAnswer(true)` is emitted.
2. **Incorrect Answer Selection**:
   - **Given** an unselected `QuizCard`,
   - **When** the user selects an incorrect option,
   - **Then** that option highlights with an error state, the explanation displays to clarify the misconception, and `onAnswer(false)` is emitted.
3. **Screen Reader Semantic Feedback**:
   - **Given** a screen-reader user navigating the quiz,
   - **When** an option is selected,
   - **Then** an `aria-live="polite"` region immediately announces whether the choice was correct and reads the conceptual explanation.

---

### User Story 3 - Lesson Progress & XP Reward Footer (Priority: P3)

As a student completing all parts of a lesson,  
I want to see my earned XP and click a clear completion action,  
So that my learning progress is acknowledged and I am seamlessly routed to the next lesson in the curriculum.

**Why this priority**: Retains user engagement, drives gamified curriculum progression, and anchors the bottom of every lesson layout.

**Independent Test**: Mount `LessonFooter` with `xp={25}` and `nextLessonUrl="/lessons/variables"`. Verify sticky/bottom positioning, badge showing "+25 XP", and "Complete & Next Lesson" button. When clicked, verify button indicates loading/completion and navigates to the target URL.

**Acceptance Scenarios**:

1. **Visual Presentation & Sticky Anchoring**:
   - **Given** a long lesson page,
   - **When** the student reaches the end (or views the viewport),
   - **Then** `LessonFooter` remains anchored with 1px border divider, surface background matching DESIGN.md, and high-contrast typography.
2. **Completion Trigger & Navigation**:
   - **Given** a user clicks "Complete & Next Lesson",
   - **When** the action is activated,
   - **Then** optional `onComplete` callback fires, visual feedback displays, and navigation routes to `nextLessonUrl`.
3. **Accessibility & Responsive Layout**:
   - **Given** a mobile viewport (<640px),
   - **When** viewing `LessonFooter`,
   - **Then** touch targets measure at least 44x44px, and the layout stacks or wraps gracefully without horizontal overflow.

---

## Edge Cases

- **Worker Timeout / Infinite Loop**: If user code in `PythonRunner` runs a `while True:` loop, `usePyodide` terminates the worker after 5,000ms. `PythonRunner` must display "Execution timed out (5s limit)" in the error console and reset the button back to "Run Code".
- **Empty / Blank Code Input**: Running empty code should not crash; it should emit empty output or prompt the user gracefully.
- **Large Output Volume**: If code prints 10,000 lines, the console must enforce a bounded height (`max-h-64` or `max-h-80`) with `overflow-y: auto` to prevent page layout blowout.
- **SSR / Hydration Safety**: Neither CodeMirror, Pyodide worker, nor `window.matchMedia` must execute during Astro static build (SSG). All DOM/worker accesses must be deferred to `useEffect` or client lifecycle.
- **Multiple Runners on One Page**: When multiple `PythonRunner` instances exist in one lesson, each must maintain independent state and console output without cross-talk.
- **Reduced Motion**: When `prefers-reduced-motion: reduce` is detected by the OS/browser, confetti animations must be disabled automatically via `triggerCompletionConfetti`.

---

## Requirements *(mandatory)*

### Functional Requirements

#### Component 1: `PythonRunner.tsx`
- **FR-001**: Component MUST accept props:
  - `initialCode?: string`: Default Python code loaded into the editor.
  - `expectedOutput?: string`: Optional expected stdout string for automated validation.
  - `packages?: string[]`: Optional micropip packages to preload in the worker.
  - `title?: string`: Optional label/title for the code exercise (e.g. "Exercise: Matrix Multiplication").
  - `minLines?: number`: Minimum editor height/lines (default: 6).
- **FR-002**: Editor MUST use CodeMirror (via `@uiw/react-codemirror` or `@codemirror/*`) configured with Python language support (`@codemirror/lang-python`).
- **FR-003**: Editor MUST support both light and dark themes consistent with DESIGN.md color tokens (vellum canvas `#FFFFFF`/`#F7F5F0` vs obsidian `#121212`/`#1E1E1E`).
- **FR-004**: Editor MUST handle `Ctrl+Enter` and `Cmd+Enter` as a run shortcut.
- **FR-005**: Editor MUST provide an accessible escape key sequence to release Tab trapping for keyboard navigators.
- **FR-006**: "Run Code" button MUST display an accessible loading spinner while execution is in progress, and disable re-submission until execution finishes or times out.
- **FR-007**: Execution console MUST display stdout in standard text and stderr/runtime errors in styled error format with `aria-live="polite"`.
- **FR-008**: When `expectedOutput` is provided:
  - System MUST compare trimmed `output` with trimmed `expectedOutput`.
  - On match, system MUST display a "Pass" status badge and invoke `triggerCompletionConfetti()`.
  - On mismatch, system MUST display "Try Again" with a diff or expected vs received output view.
- **FR-009**: Component MUST integrate cleanly with `src/hooks/usePyodide.ts`.

#### Component 2: `QuizCard.tsx`
- **FR-010**: Component MUST accept props:
  - `question: string`: The quiz question prompt (supports inline LaTeX or plain text).
  - `options: string[]`: Array of 2 to 6 multiple-choice answer strings.
  - `correctAnswer: number`: 0-indexed index of the correct option.
  - `explanation?: string`: Conceptual explanation revealed after selection.
  - `onAnswer?: (correct: boolean) => void`: Callback emitted when an answer is selected.
- **FR-011**: Component MUST render options using accessible radio group semantics (`role="radiogroup"`, `aria-checked`, keyboard arrow/tab navigation).
- **FR-012**: Upon selection, component MUST immediately style the chosen option:
  - Correct selection: Green border/background tint (`#15803d` / `#166534` AA compliant), checkmark indicator.
  - Incorrect selection: Terracotta/red border/background tint (`#b91c1c` / `#991b1b`), cross indicator, with subtle indicator pointing to the right answer.
- **FR-013**: Conceptual explanation MUST appear in a dedicated animated panel with `aria-live="polite"` so screen-reader users hear the explanation immediately.

#### Component 3: `LessonFooter.tsx`
- **FR-014**: Component MUST accept props:
  - `xp?: number`: XP reward value (default: 10).
  - `nextLessonUrl?: string`: URL of the subsequent lesson.
  - `nextLessonTitle?: string`: Optional title of the next lesson (e.g. "Next: Control Flow").
  - `onComplete?: () => void`: Optional callback triggered before navigation.
  - `isCompleted?: boolean`: Whether the lesson has already been finished.
- **FR-015**: Component MUST display an XP indicator with an iconic reward symbol (e.g. spark / star / gem) styled with brand accent tokens.
- **FR-016**: "Complete & Next Lesson" button MUST feature primary brand terracotta styling (`#A7452A` light, `#E07A5F` dark), minimum 44px touch target, and high-contrast text.
- **FR-017**: Component MUST support fixed sticky bottom docking or static bottom container docking via a `sticky?: boolean` prop (default `true`).

#### Shared & Accessibility Requirements
- **FR-018**: All interactive elements MUST provide explicit `:focus-visible` outline rings with minimum 3:1 contrast against adjacent surfaces.
- **FR-019**: All text colors and badge combinations MUST strictly satisfy WCAG 2.2 AA (minimum 4.5:1 for standard text, 3.0:1 for large text and UI components).
- **FR-020**: All three components MUST be safe for Astro SSG pre-rendering and hydrate smoothly under Astro's `client:visible` directive.

---

## Key Entities & Type Definitions

```typescript
// src/types/islands.ts

export interface PythonRunnerProps {
  initialCode?: string;
  expectedOutput?: string;
  packages?: string[];
  title?: string;
  minLines?: number;
}

export interface QuizCardProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  onAnswer?: (correct: boolean) => void;
}

export interface LessonFooterProps {
  xp?: number;
  nextLessonUrl?: string;
  nextLessonTitle?: string;
  onComplete?: () => void;
  isCompleted?: boolean;
  sticky?: boolean;
}
```

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `PythonRunner` executes standard Python operations (math, string formatting, loops) in under 300ms once Pyodide worker is loaded.
- **SC-002**: 100% of interactive elements are operable via keyboard alone (Tab, Enter, Space, Escape, Arrow keys).
- **SC-003**: 0 Cumulative Layout Shift (CLS = 0) during Astro `client:visible` hydration across all 3 components.
- **SC-004**: Automated accessibility checks (`buddhi scripts verify-a11y` / Axe / Lighthouse) return 0 AA violations.
- **SC-005**: CodeMirror bundle and worker interaction add 0 blocking time to the main thread during code execution.

---

## Assumptions & Dependencies

- Client-side Pyodide worker infrastructure (`src/workers/pyodide.worker.ts` and `src/hooks/usePyodide.ts`) is functional as validated in Spec 002.
- `canvas-confetti` and `@types/canvas-confetti` are already installed and configured via `src/lib/confetti.ts`.
- CodeMirror React wrapper (e.g. `@uiw/react-codemirror` and `@codemirror/lang-python`) will be added to `package.json` dependencies during implementation.
- All lessons import these components inside MDX using Astro island hydration: `<PythonRunner client:visible />`, `<QuizCard client:visible />`, `<LessonFooter client:visible />`.
