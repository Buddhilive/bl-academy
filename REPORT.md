# A11y Verification Report

## Validation Context
- **Feature/Epic:** Course 07 — Harness Engineering (`018-harness-engineering-full-course`)
- **Test Date:** 11/22/2026
- **Covers interface as of:** `018-harness-engineering-full-course` (`src/lib/curriculum.ts`, `src/content/lessons/harness-engineering/01..24.mdx`, `ColabButton.astro`, `PythonRunner.tsx`, `QuizCard.tsx`)
- **Standard version:** 2.5.0
- **Compliance Status:** ⚠️ CONDITIONAL (Headless automated checks run; browser/screen-reader checkpoints pending human verification)
- **Verification Independence:** self-reported (automated static checks: `verify-a11y`, `verify_course.py`, `pnpm astro check`, `pnpm build`)
- **Static gate (`verify-a11y`):** Run on 2026-11-22

## 1. Technical Verification (Automated & Semantics)
- [ ] **Axe-Core / Lighthouse:** Not verified — headless environment without live browser DOM runner.
- [x] **HTML Semantics:** `ColabButton.astro` uses native `<a href target="_blank" rel="noopener noreferrer">` with `aria-hidden="true"` on decorative SVG and `<span class="sr-only"> (opens in a new tab)</span>`.
- [x] **Heading Hierarchy (H1-H6):** All 8 Phase 1 `.mdx` lessons use `H1` in `LessonLayout.astro` followed sequentially by `H2` and `H3` sections.

## 2. Tab Order and Focus Management
- [x] **Focus Indicator:** `ColabButton.astro` preserves native outline in forced-colors mode and applies `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E07A5F]`.
- [ ] **Logical Navigation:** Not verified — requires interactive browser keyboard walkthrough.
- [ ] **Captured Focus (Modals/Overlays):** N/A for `ColabButton.astro` (no modal/overlay added).

## 3. Behavior and Task Return
- [ ] **Screen Reader Test:** Not verified — headless environment without NVDA/JAWS/VoiceOver.
- [x] **Voice Control:** Visible label `"Open with Google Colab"` matches the accessible link text prefix (`SC 2.5.3` checked by reading).
- [ ] **Interactive states inventoried:** Reuses existing `PythonRunner.tsx` and `QuizCard.tsx` (verified in `A11Y-DECISIONS.md` Decisions 1–4); `ColabButton.astro` is stateless static link.

## 4. Visual Perception and Comprehension
- [x] **Text & UI Contrast:** Measured via `buddhi scripts contrast`:
  | Pair | Foreground | Background | Ratio | Floor | Result |
  | :--- | :--- | :--- | ---: | ---: | :--- |
  | ColabButton Primary | `#A7452A` | `#FFFFFF` | 5.95:1 | 4.5:1 | ✅ |
  | Dark Mode Primary / Focus | `#E07A5F` | `#121212` | 6.35:1 | 4.5:1 | ✅ |
- [x] **Redundancy:** External link status is conveyed with text, icon, and screen-reader hint.
- [ ] **Scale / Zoom:** Not verified — requires browser viewport testing at 200%/320px.

## 5. Time-Based Media and Motion
N/A — no time-based media added in `009-phase-1-data-tutorials`.
