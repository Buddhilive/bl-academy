# Choices Ledger: 003-interactive-island-components

Architectural and implementation decisions made during execution.

## 1. CodeMirror Escape Key Navigation
- **Choice**: Implemented an explicit CodeMirror extension mapping `Escape` to blur `contentDOM` and redirect focus to the `Run Code` button, alongside a container-level `onKeyDown` listener.
- **Classification**: `sound`
- **Rationale**: Eliminates WCAG 2.1.2 keyboard trapping without degrading internal editor shortcuts.

## 2. Dynamic SSR Hydration Fallback in `PythonRunner.tsx`
- **Choice**: Rendered a styled read-only `<textarea>` placeholder during Astro SSG pre-rendering, mounting the rich CodeMirror editor client-side once `isMounted` triggers in `useEffect`.
- **Classification**: `sound`
- **Rationale**: Prevents DOM/window reference errors during Astro static build (`pnpm build`) and guarantees zero Cumulative Layout Shift (CLS).

## 3. Immediate Quiz Feedback with Conceptual Disclosure
- **Choice**: Options in `QuizCard.tsx` immediately show success green or terracotta red upon click, subtly highlight the correct answer if the choice was wrong, and display an animated explanation box with `aria-live="polite"`. A "Retry" button allows re-testing without refreshing.
- **Classification**: `sound`
- **Rationale**: Maximizes educational value and provides immediate reinforcement.

