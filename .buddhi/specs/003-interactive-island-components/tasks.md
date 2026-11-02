# Tasks: Interactive Island Components

**Input**: Design documents from `.buddhi/specs/003-interactive-island-components/` (`spec.md`, `plan.md`)  
**Prerequisites**: `plan.md` (complete), `spec.md` (complete)  
**Organization**: Tasks are grouped by phase and user story to enable independent implementation and testing of each story.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`US1`, `US2`, `US3`)
- Exact file paths are explicitly specified in every task description.

---

## Phase 1: Setup (Dependencies & Contracts)

**Purpose**: Dependency installation and shared interface definitions

- [x] T001 Install `@uiw/react-codemirror` and `@codemirror/lang-python` dependencies via `pnpm add @uiw/react-codemirror @codemirror/lang-python`
- [x] T002 [P] Create TypeScript contracts for island props and state in `src/types/islands.ts`
- [x] T003 [P] Verify Pyodide worker hook exports and types in `src/hooks/usePyodide.ts` and `src/types/pyodide.ts`

**Checkpoint**: Shared types and editor dependencies ready.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Verification scaffold and shared harness setup before building island components

**⚠️ CRITICAL**: Must be completed before testing user stories in the browser

- [x] T004 Scaffold smoke test harness page structure in `src/pages/test-islands.astro` using `Layout.astro`
- [x] T005 [P] Verify `triggerCompletionConfetti` helper in `src/lib/confetti.ts` respects `prefers-reduced-motion`

**Checkpoint**: Foundation ready — user story implementation can begin.

---

## Phase 3: User Story 1 - Interactive Code Execution Island (Priority: P1) 🎯 MVP

**Goal**: Deliver an in-browser Python editor and runner with Pyodide Web Worker execution, console output, keyboard shortcuts, and automated output testing.

**Independent Test**: Load `/test-islands` in the browser, execute sample Python code in `PythonRunner`, verify output displays in the terminal console, verify error traceback rendering on syntax error, and verify confetti triggers on expected output match.

### Implementation for User Story 1

- [x] T006 [P] [US1] Create CodeMirror theme configuration and Escape-key focus trap release extension for `PythonRunner`
- [x] T007 [US1] Implement core `PythonRunner.tsx` in `src/components/islands/PythonRunner.tsx` integrating `@uiw/react-codemirror`, `usePyodide()`, and `Ctrl+Enter` / `Cmd+Enter` execution shortcut
- [x] T008 [US1] Implement Run Code action button with accessible loading spinner, disabled state during execution, and reset action
- [x] T009 [US1] Implement scrollable console output and error display with monospace typography and `aria-live="polite"` in `src/components/islands/PythonRunner.tsx`
- [x] T010 [US1] Implement `expectedOutput` automated evaluation with Pass / Try Again badges and `triggerCompletionConfetti()` on match in `src/components/islands/PythonRunner.tsx`
- [x] T011 [US1] Add `PythonRunner` test cases (standard execution, error handling, expectedOutput match) to `src/pages/test-islands.astro`

**Checkpoint**: User Story 1 is fully functional and independently testable as an MVP slice.

---

## Phase 4: User Story 2 - Conceptual Assessment Island (Priority: P2)

**Goal**: Deliver an accessible multiple-choice quiz island with immediate high-contrast visual feedback, conceptual explanation disclosure, and completion event emission.

**Independent Test**: In `/test-islands`, select an incorrect answer to verify red highlighting and explanation text; select the correct answer to verify green highlighting, celebration feedback, and check that `onAnswer(true)` is emitted.

### Implementation for User Story 2

- [x] T012 [P] [US2] Implement `QuizCard.tsx` component in `src/components/islands/QuizCard.tsx` with WAI-ARIA Radio Group pattern (`role="radiogroup"`, `role="radio"`, `aria-checked`, keyboard arrow navigation)
- [x] T013 [US2] Implement instant visual feedback styles adhering to WCAG 2.2 AA contrast (AA green for correct, AA terracotta/red for wrong) matching `DESIGN.md` tokens
- [x] T014 [US2] Implement conceptual explanation disclosure panel with `aria-live="polite"` and emit `onAnswer(correct: boolean)` callback in `src/components/islands/QuizCard.tsx`
- [x] T015 [US2] Add `QuizCard` interactive verification instances (single choice, explanation check, callback logging) to `src/pages/test-islands.astro`

**Checkpoint**: User Story 2 is fully functional and independently testable.

---

## Phase 5: User Story 3 - Lesson Progress & XP Reward Footer (Priority: P3)

**Goal**: Deliver a sticky or bottom-anchored lesson action bar featuring visual XP reward progress, high-contrast terracotta button, 44px touch targets, and next-lesson navigation.

**Independent Test**: In `/test-islands`, verify `LessonFooter` anchors to viewport/bottom, shows "+XP" badge, and clicking "Complete & Next Lesson" triggers the completion callback and navigates to the target URL.

### Implementation for User Story 3

- [x] T016 [P] [US3] Implement `LessonFooter.tsx` in `src/components/islands/LessonFooter.tsx` with sticky bottom docking, 1px top border divider, and responsive container layout
- [x] T017 [US3] Implement visual XP reward badge ("+{xp} XP") with spark icon and accessible `aria-label` in `src/components/islands/LessonFooter.tsx`
- [x] T018 [US3] Implement terracotta primary action button ("Complete & Next Lesson", min 44x44px touch target) with `onComplete` callback and navigation handling
- [x] T019 [US3] Add `LessonFooter` verification instance with custom XP and navigation link to `src/pages/test-islands.astro`

**Checkpoint**: User Story 3 is fully functional and independently testable.

---

## Phase 6: Polish, Accessibility & Cross-Cutting Verification

**Purpose**: System-wide integration verification, accessibility compliance checks, and production SSG build audit.

- [x] T020 Run WCAG 2.2 AA contrast checks via `buddhi scripts contrast` on primary terracotta, dark mode tints, and quiz feedback states
- [x] T021 Verify full keyboard accessibility across all islands (`Tab`, `Escape`, `Arrow keys`, `Space`, `Enter`) with 0 focus trapping
- [x] T022 Execute Astro typecheck via `pnpm astro check` to verify TypeScript typing with zero errors
- [x] T023 Execute production static build via `pnpm build` to confirm zero SSR hydration failures under Astro `client:visible`
