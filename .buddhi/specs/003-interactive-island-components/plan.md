# Implementation Plan: Interactive Island Components

**Branch**: `003-interactive-island-components` | **Date**: 2026-11-02 | **Spec**: [`.buddhi/specs/003-interactive-island-components/spec.md`](./spec.md)

**Input**: Feature specification from `/.buddhi/specs/003-interactive-island-components/spec.md`

---

## Summary

Implement three core interactive React island components inside `src/components/islands/` to power interactive STEM lessons in Buddhilive Academy:
1. `PythonRunner.tsx`: Client-side Python code editor with CodeMirror 6, execution via existing Pyodide Web Worker hook (`usePyodide`), high-contrast console, keyboard shortcut (`Ctrl+Enter`), escape key trap release, and automated test output verification with celebratory confetti (`triggerCompletionConfetti`).
2. `QuizCard.tsx`: Accessible multiple-choice assessment card implementing WAI-ARIA Radio Group pattern, instant high-contrast visual feedback (AA green / AA red), conceptual explanation disclosure with `aria-live`, and `onAnswer(correct: boolean)` event emission.
3. `LessonFooter.tsx`: Bottom and sticky-docked action bar featuring visual XP reward progress badge, high-contrast terracotta primary action button ("Complete & Next Lesson"), 44px minimum touch targets, and navigation handling.

All components run client-side under Astro `client:visible` hydration with zero server-side execution and 0 Cumulative Layout Shift (CLS).

---

## Technical Context

**Language/Version**: TypeScript 5.9+, React 19.3+, Astro 7.4+  
**Primary Dependencies**:
- Existing: `@astrojs/react`, `canvas-confetti`, `tailwindcss`, `@astrojs/mdx`
- New package(s): `@uiw/react-codemirror` and `@codemirror/lang-python` (or lightweight `@codemirror/*` modules)  
**Execution Environment**: Browser Web Worker running Pyodide v0.26+ with hard 5,000ms watchdog (`src/workers/pyodide.worker.ts`, `src/hooks/usePyodide.ts`)  
**Storage**: N/A (client-side state; progress events emitted to consumers)  
**Testing**: Astro type check (`pnpm astro check`), production build (`pnpm build`), and interactive harness page (`src/pages/test-islands.astro`)  
**Target Platform**: Modern web browsers (desktop and mobile responsive)  
**Performance Goals**:
- <300ms Python execution latency for standard algorithmic exercises
- Zero main thread blocking during code execution
- 0 Cumulative Layout Shift (CLS = 0) upon `client:visible` hydration
- <50KB gzipped component bundle overhead  
**Constraints**:
- Strict WCAG 2.2 Level AA compliance (4.5:1 text contrast, 3.0:1 UI boundaries)
- Respect `prefers-reduced-motion` for confetti animations
- Zero SSR execution of DOM/Worker APIs (build-safe for Astro SSG)  

---

## AGENTS.md & DESIGN.md Compliance Check

*GATE: Passed before Phase 0 research. Re-checked for design.*

- [x] **Grounding in `/docs`**: Verified against curriculum contracts and lesson schema constraints.
- [x] **Zero-Backend Code Execution**: Confirmed. Code execution is 100% isolated inside Pyodide Web Worker with 5s timeout.
- [x] **Theme & Contrast Integrity**:
  - Light mode primary `#A7452A` on `#FFFFFF` (5.95:1, WCAG AA pass).
  - Dark mode primary `#E07A5F` on `#121212` (6.35:1, WCAG AA pass).
  - 1px hairline dividers `#57534E` (light) / `#78716C` (dark).
- [x] **Layout Stability (AdSense & CLS)**: Explicit bounded dimensions and reserved space for editors, consoles, and footers.
- [x] **Project Build & Check Commands**: Adheres to `pnpm astro check`, `pnpm build`, `pnpm dev`.

---

## Project Structure

### Documentation (this feature)

```text
.buddhi/specs/003-interactive-island-components/
├── spec.md              # Feature specification
├── plan.md              # Architectural implementation plan (this file)
└── tasks.md             # Work breakdown tasks (created by /spec-tasks)
```

### Source Code Layout

```text
src/
├── types/
│   ├── pyodide.ts             # Existing Pyodide worker message contracts
│   └── islands.ts             # NEW: Island component props and state contracts
├── hooks/
│   └── usePyodide.ts          # Existing client-side Pyodide execution hook
├── lib/
│   └── confetti.ts            # Existing accessible completion confetti trigger
├── components/
│   └── islands/
│       ├── PyodideTester.tsx  # Existing debug tester island
│       ├── PythonRunner.tsx   # NEW: In-browser CodeMirror Python runner
│       ├── QuizCard.tsx       # NEW: Accessible multiple-choice assessment island
│       └── LessonFooter.tsx   # NEW: Progress XP and completion navigation footer
└── pages/
    └── test-islands.astro     # NEW: Integration smoke test harness page
```

**Structure Decision**: Clean component separation under `src/components/islands/` following the existing Astro islands architecture. Common interfaces defined in `src/types/islands.ts`. Decoupled from page layouts so any MDX lesson can import and hydrate them with `<Component client:visible />`.

---

## Architectural Evaluation (Three Lenses)

### 1. Fewest-Slices Lens
Deliver the MVP through 3 focused vertical slices:
- **Slice 1**: Data contracts in `src/types/islands.ts` + dependency installation (`@uiw/react-codemirror`, `@codemirror/lang-python`).
- **Slice 2**: Core islands implementation: `PythonRunner.tsx` (with CodeMirror and `usePyodide`), `QuizCard.tsx` (radio group with feedback), `LessonFooter.tsx` (XP and navigation).
- **Slice 3**: Smoke test integration harness in `src/pages/test-islands.astro` to verify hydration, accessibility, keyboard navigation, and theme compatibility.

### 2. Risk-First Lens
- **Risk 1: CodeMirror SSR Crash in Astro SSG**  
  *Mitigation*: Ensure CodeMirror is rendered only on client-side (deferred mount via `useEffect` / state flag `mounted` or `@uiw/react-codemirror` which handles client hydration safely).
- **Risk 2: Keyboard Trapping inside CodeMirror**  
  *Mitigation*: Register an explicit `Escape` keybinding that blurs the editor view (`view.contentDOM.blur()`) or moves focus to the "Run Code" button, enabling keyboard-only navigators to leave the editor without getting stuck.
- **Risk 3: Pyodide Worker Timeout & State Corruption**  
  *Mitigation*: `usePyodide` automatically handles termination after 5,000ms. `PythonRunner` observes the error and resets its UI state (`isRunning: false`), enabling immediate retry without needing page refresh.
- **Risk 4: Contrast Degradation in Dark Mode**  
  *Mitigation*: Apply exact DESIGN.md tokens: `#E07A5F` for primary accents, `#1E1E1E` for elevated surfaces, `#4ade80`/`#f87171` for dark mode success/error indicators.

### 3. Seam-Quality Lens
- `PythonRunner` receives `initialCode`, `expectedOutput`, `packages`, `title`, and consumes `usePyodide()` and `triggerCompletionConfetti()`. It produces zero leaked worker state.
- `QuizCard` is a controlled/uncontrolled hybrid receiving `question`, `options`, `correctAnswer`, `explanation`, and emitting `onAnswer(boolean)`. It has zero dependencies on Pyodide or Astro routing.
- `LessonFooter` receives `xp`, `nextLessonUrl`, and optional `onComplete`. It operates independently as a bottom navigation anchor.

---

## Detailed Component Specifications

### 1. `src/types/islands.ts`
```typescript
export interface PythonRunnerProps {
  initialCode?: string;
  expectedOutput?: string;
  packages?: string[];
  title?: string;
  minLines?: number;
  className?: string;
}

export interface QuizCardProps {
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation?: string;
  onAnswer?: (correct: boolean) => void;
  className?: string;
}

export interface LessonFooterProps {
  xp?: number;
  nextLessonUrl?: string;
  nextLessonTitle?: string;
  onComplete?: () => void;
  isCompleted?: boolean;
  sticky?: boolean;
  className?: string;
}
```

### 2. `PythonRunner.tsx`
- **State**:
  - `code: string` (current editor contents)
  - `validationState: 'idle' | 'pass' | 'fail'`
  - `isMounted: boolean` (SSR hydration guard)
- **Editor**:
  - `@uiw/react-codemirror` with `@codemirror/lang-python`
  - Keyboard listener: `Mod-Enter` (Ctrl+Enter / Cmd+Enter) executes `handleRun()`.
  - Escape key handling: blurs editor to release focus trap.
  - Line numbers, active line highlight, font monospace (`JetBrains Mono`, `Fira Code`).
  - Supports light mode (custom light theme matching `#F7F5F0`) and dark mode (One Dark or custom obsidian `#1E1E1E`).
- **Action Bar**:
  - Title and status indicator (e.g., "Ready" / "Running...").
  - "Run Code" button styled with primary brand color `#A7452A` (`#E07A5F` dark), minimum 44px height, loading spinner with `aria-busy`.
  - "Reset" button to restore `initialCode`.
- **Execution & Validation**:
  - Calls `runCode(code, packages)` from `usePyodide()`.
  - Compares output with `expectedOutput` (trimmed string comparison).
  - If matched: sets `validationState = 'pass'`, triggers `triggerCompletionConfetti()`, shows green "Pass" banner.
  - If mismatched: sets `validationState = 'fail'`, shows amber "Try Again" banner with expected vs received.
- **Console Region**:
  - Monospace preformatted `<pre>` panel with `role="region"`, `aria-label="Code output"`, `aria-live="polite"`.
  - Max height `max-h-60` with smooth scrolling.
  - Errors formatted with red tint `#b91c1c` (light) / `#f87171` (dark).

### 3. `QuizCard.tsx`
- **State**:
  - `selectedIndex: number | null`
  - `submitted: boolean`
- **Semantics**:
  - Outer container: `role="region"` with `aria-label="Concept Quiz"`.
  - Option list: `role="radiogroup"` with `aria-labelledby="quiz-question"`.
  - Each item: `role="radio"`, `aria-checked={selectedIndex === index}`, `tabIndex={isFocused ? 0 : -1}`.
  - Keyboard: Arrow keys navigate between options, Space/Enter selects.
- **Visual Feedback**:
  - Default: Neutral surface (`#F7F5F0` light, `#1E1E1E` dark), 1px border.
  - Correct selection: Green border (`#15803d` light, `#4ade80` dark), checkmark icon, success banner.
  - Incorrect selection: Terracotta/red border (`#b91c1c` light, `#f87171` dark), cross icon, highlighting correct answer index subtly.
- **Explanation Panel**:
  - Revealed upon answer selection.
  - Animated disclosure container with `aria-live="polite"`.
  - Renders conceptual explanation prose clearly with high-contrast text.

### 4. `LessonFooter.tsx`
- **Layout**:
  - Sticky bottom anchor (`sticky bottom-0 z-20`) or static container based on `sticky` prop.
  - 1px top border divider (`#57534E` light / `#78716C` dark), background with subtle backdrop blur or solid surface.
  - Container width aligned with lesson grid (`max-w-4xl mx-auto`).
- **Elements**:
  - **XP Indicator**: Badge displaying "+{xp} XP" with Spark icon, amber/terracotta border badge.
  - **Action Button**: Primary button "Complete & Next Lesson", with forward arrow icon, 44px min touch target.
  - Handles `onComplete` callback, then performs navigation via `window.location.href = nextLessonUrl` or link.

---

## Accessibility Strategy & Design Tokens

### Keyboard & Screen Reader Protocols
1. **Focus Rings**:
   All interactive buttons and radio items provide `focus-visible:ring-2 focus-visible:ring-[#A7452A] dark:focus-visible:ring-[#E07A5F] focus-visible:outline-none focus-visible:ring-offset-2`.
2. **Keyboard Trap Release**:
   CodeMirror captures Tab by default. We configure a custom extension mapping `Escape` to blur the editor view, restoring natural page tab flow.
3. **Live Regions**:
   Execution output and quiz feedback use `aria-live="polite"` so assistive technologies announce results without disrupting current speech.
4. **Contrast Verification**:
   - Primary Light (`#A7452A` on `#FFFFFF`): **5.95:1** (Pass AA).
   - Primary Dark (`#E07A5F` on `#121212`): **6.35:1** (Pass AA).
   - Correct Green (`#15803d` on `#F7F5F0`): **4.62:1** (Pass AA).
   - Error Red (`#b91c1c` on `#F7F5F0`): **5.48:1** (Pass AA).
   - Divider borders (`#57534E` on `#FFFFFF`): **5.80:1** (Pass AA non-text >3.0:1).

---

## Verification & Testing Strategy

### 1. Verification Commands
- **Type Checking**: `pnpm astro check`
- **Production Build**: `pnpm build` (ensures zero SSR failure with CodeMirror / Pyodide)
- **Accessibility Lint**: `buddhi scripts contrast` checks on key color pairs

### 2. Integration Harness: `src/pages/test-islands.astro`
Create a test page rendering all 3 components with sample lesson data:
- `PythonRunner` loaded with sample code (`for i in range(5): print(i * 2)`), `expectedOutput="0\n2\n4\n6\n8"`.
- `QuizCard` loaded with a STEM question, 4 choices, and explanation.
- `LessonFooter` loaded with `xp={20}` and `nextLessonUrl="/test-pyodide"`.

### Manual Acceptance Verification Steps:
1. Open `/test-islands` in browser.
2. Click "Run Code": verify Pyodide loads and outputs numbers within 300ms.
3. Verify confetti fires upon expected output match.
4. Modify code to syntax error: verify error output renders in red without breaking the page.
5. In `QuizCard`, click an incorrect option: verify red highlight and explanation.
6. Click the correct option: verify green highlight and `onAnswer(true)` emitted.
7. Click "Complete & Next Lesson": verify navigation and callback.
8. Navigate entire page using keyboard (`Tab`, `Space`, `Enter`, `Escape`, `Arrow keys`).

---

## Complexity Tracking

No architectural violations. All components adhere strictly to project principles: zero-backend execution, client-side islands, WCAG 2.2 AA contrast compliance, and Astro SSG safety.
