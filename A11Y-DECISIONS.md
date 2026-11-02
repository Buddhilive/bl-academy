# Accessibility Decisions Log (A11Y-DECISIONS.md)

Record of conformant accessibility choices made during development.

## 2026-11-02: Interactive Island Components (`003-interactive-island-components`)

### Decision 1: CodeMirror Focus Trap Mitigation in `PythonRunner.tsx`
- **Pattern**: Code editor keyboard navigation.
- **Rule**: WCAG 2.2 SC 2.1.2 (No Keyboard Trap).
- **Choice**: Implemented dual-layer Escape key listener (CodeMirror keymap extension + DOM container listener) that intercepts `Escape` to blur the CodeMirror `contentDOM` and shift keyboard focus directly to the "Run Code" button. Keyboard users can navigate freely through and out of the editor using Tab/Escape.
- **Evidence**: Verified in CodeMirror keymap extension and `test-islands.astro`.

### Decision 2: WAI-ARIA Radio Group Semantics in `QuizCard.tsx`
- **Pattern**: Multiple-choice assessment options.
- **Rule**: WCAG 2.2 SC 1.3.1 (Info and Relationships) & SC 4.1.2 (Name, Role, Value).
- **Choice**: Implemented `role="radiogroup"` on the options container with `aria-labelledby` linking to the unique question id. Rendered options with `role="radio"` and dynamic `aria-checked` states.
- **Evidence**: `src/components/islands/QuizCard.tsx`.

### Decision 3: Dynamic Feedback with Polite Live Regions
- **Pattern**: Execution output and conceptual quiz explanations.
- **Rule**: WCAG 2.2 SC 4.1.3 (Status Messages).
- **Choice**: Configured `aria-live="polite"` on the `PythonRunner` execution output container and the `QuizCard` conceptual explanation panel. When code completes execution or an answer is chosen, assistive technology announces the result without interrupting current voice synthesis.
- **Evidence**: `src/components/islands/PythonRunner.tsx`, `src/components/islands/QuizCard.tsx`.

### Decision 4: Reduced Motion Guard for Celebratory Confetti
- **Pattern**: Confetti canvas animation on code match.
- **Rule**: WCAG 2.2 SC 2.3.3 (Animation from Interactions).
- **Choice**: `triggerCompletionConfetti` inspects `window.matchMedia('(prefers-reduced-motion: reduce)')`. If enabled, animation execution is suppressed, displaying only the visual "Pass" status banner.
- **Evidence**: `src/lib/confetti.ts` and `src/components/islands/PythonRunner.tsx`.

### Decision 5: Color Contrast Floors (Standard AA)
- **Pattern**: Brand terracotta and semantic state indicators.
- **Rule**: WCAG 2.2 SC 1.4.3 (Contrast Minimum) & SC 1.4.11 (Non-text Contrast).
- **Verification via `check_contrast`**:
  - Primary `#A7452A` on `#FFFFFF`: **5.95:1** (Pass AA >= 4.5:1)
  - Dark Primary `#E07A5F` on `#121212`: **6.35:1** (Pass AA >= 4.5:1)
  - Success Green `#15803d` on `#F7F5F0`: **4.60:1** (Pass AA >= 4.5:1)
  - Dark Success Green `#4ade80` on `#1E1E1E`: **9.57:1** (Pass AA >= 4.5:1)
  - Dark Surface Text `#F5F5F4` on `#1E1E1E`: **15.28:1** (Pass AA >= 4.5:1)

