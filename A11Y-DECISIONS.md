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

## 2026-11-04: Chapter 1 Interactive Lesson — Setting Up Python (`007-python-zero-hero`)

### Decision 7: Accessible OS Setup Reference Table & KaTeX Integration in `01-setting-up-python.mdx`
- **Pattern**: Data table and mathematical formulas in MDX curriculum content (`01-setting-up-python.mdx`).
- **Rule**: WCAG 2.2 SC 1.3.1 (Info and Relationships) & SC 1.3.2 (Meaningful Sequence).
- **Choice**:
  1. Formatted OS setup reference table using standard markdown table structure with header scope, rendered into semantic `<table>`, `<thead>`, `<th scope="col">`, and `<tbody>` elements by Astro's MDX parser.
  2. Integrated KaTeX inline math (`$...$`) for bit-width address space formulas ($2^{32}$ and $2^{64}$) and version tuples, while strictly fencing terminal/bash commands with ```` ```bash ```` to eliminate any unescaped shell `$` delimiter collisions.
  3. Reused conformant `<PythonRunner client:visible />` (Decision 1, 3, 4) and `<QuizCard client:visible />` (Decision 2, 3) interactive islands with zero main-thread blocking.


### Decision 6: WAI-ARIA Modal Dialog & Keyboard Focus Management in `AuthModal.tsx`
- **Pattern**: Accessible Authentication Dialog (`AuthModal.tsx`).
- **Rule**: WCAG 2.2 SC 2.1.2 (No Keyboard Trap), SC 2.4.3 (Focus Order), SC 1.3.1 (Info and Relationships), SC 4.1.3 (Status Messages).
- **Choice**:
  1. Conforms to WAI-ARIA Dialog (Modal) Pattern: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="auth-modal-title"`, and `aria-describedby="auth-modal-desc"`.
  2. Traps focus within modal while open (Tab and Shift+Tab cycle within focusable dialog elements).
  3. Dismisses on `Escape` key press and background overlay click, returning focus to the triggering element upon exit (`previousActiveElementRef`).
  4. Explicit semantic input binding using `<label htmlFor="auth-email-input">Email address</label>`.
  5. Dynamic status notifications using `aria-live="polite"` and `role="alert"` for authentication errors.
  6. Color contrast verified via `check_contrast`:
     - Light Mode Primary `#FFFFFF` on `#A7452A`: **5.95:1** (Pass AA >= 4.5:1)
     - Dark Mode Primary `#0A0A0A` on `#E07A5F`: **6.71:1** (Pass AA >= 4.5:1)
     - Secondary Surface `#F5F5F4` on `#262626`: **13.87:1** (Pass AA >= 4.5:1)

## 2026-11-05: Chapter 2 Interactive Lesson — Writing and Running Python

### Decision 8: Heading Structure, Accessible Reference Table, and KaTeX Integration in `02-writing-and-running-python.mdx`
- **Pattern**: Document heading hierarchy, semantic reference tables, and mathematical formulas in MDX curriculum content (`02-writing-and-running-python.mdx`).
- **Rule**: WCAG 2.2 SC 1.3.1 (Info and Relationships), SC 1.3.2 (Meaningful Sequence), SC 2.4.6 (Headings and Labels).
- **Choice**:
  1. Maintained strict heading hierarchy: `LessonLayout.astro` renders `<h1>`, so the MDX content strictly uses `<h2>` for main sections and `<h3>` for subtopics without skipping levels.
  2. Implemented the Python syntax and diagnostics reference table using semantic markdown table structure with header cells, rendered into `<table>`, `<thead>`, `<th scope="col">`, and `<tbody>` by Astro's MDX parser.
  3. Formatted mathematical mappings ($f: X \rightarrow Y$) and Big-O runtime notations ($O(1)$) using KaTeX math blocks without unescaped shell `$` collision.
  4. Reused accessible interactive islands `<PythonRunner client:visible />` and `<QuizCard client:visible />` with zero main-thread blocking.




## 2026-11-20: Google Colab Launch Button & Phase 1 Lessons (`009-phase-1-data-tutorials`)

### Decision 8: Forced-Colors Safe Focus Indicator & External Link Semantics in `ColabButton.astro`
- **Pattern**: External notebook launch link styled as a primary CTA button (`src/components/static/ColabButton.astro`).
- **Rule**: WCAG 2.2 SC 2.4.7 (Focus Visible), SC 1.4.3 (Contrast Minimum), SC 2.5.8 (Target Size Minimum).
- **Choice**:
  1. Used semantic `<a href={colabUrl} target="_blank" rel="noopener noreferrer">` instead of a clickable `<div>`, with `min-h-[44px]` touch target and `<span class="sr-only"> (opens in a new tab)</span>`.
  2. Avoided `focus:outline-none` so focus indicators remain visible in Windows Forced Colors / High Contrast mode, using `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E07A5F]`.
  3. Verified contrast via `buddhi scripts contrast` (`#A7452A` on `#FFFFFF` = 5.95:1 PASS AA; `#E07A5F` on `#121212` = 6.35:1 PASS AA).
- **Evidence**: `src/components/static/ColabButton.astro`.
