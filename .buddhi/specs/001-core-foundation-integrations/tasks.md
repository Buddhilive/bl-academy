# Tasks: Core Foundation & Integrations Setup

**Input**: Design documents from `/.buddhi/specs/001-core-foundation-integrations/`  
**Prerequisites**: [plan.md](file:///C:/DevDojo/Buddhi/bl-academy/.buddhi/specs/001-core-foundation-integrations/plan.md), [spec.md](file:///C:/DevDojo/Buddhi/bl-academy/.buddhi/specs/001-core-foundation-integrations/spec.md)  
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`[US1]`, `[US2]`, `[US3]`)
- Concrete file paths included for all tasks

---

## Phase 1: Setup (Dependency Installation)

**Purpose**: Install all necessary packages and TypeScript definitions for the foundation.

- [x] T001 Install core Astro integrations and dependencies (`@astrojs/react`, `react`, `react-dom`, `@astrojs/mdx`, `@astrojs/tailwind`, `tailwindcss`, `@tailwindcss/typography`, `autoprefixer`, `@types/react`, `@types/react-dom`) in `package.json`
- [x] T002 [P] Install math and gamification dependencies (`katex`, `remark-math`, `rehype-katex`, `canvas-confetti`, `@types/canvas-confetti`) in `package.json`
- [x] T003 [P] Install Supabase client dependency (`@supabase/supabase-js`) in `package.json`

---

## Phase 2: Foundational (Shared Configuration & Base Layout)

**Purpose**: Base project styling and layout structures that stories build upon.

- [x] T004 Create `tailwind.config.mjs` configured with `darkMode: 'class'`, content paths (`./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}`), and `@tailwindcss/typography` plugin
- [x] T005 Update `src/layouts/Layout.astro` to include `class="dark"` on `<html>` and apply base dark theme typography/background classes

**Checkpoint**: Base styling infrastructure in place.

---

## Phase 3: User Story 1 - Core Framework Integrations (React, MDX, Tailwind) (Priority: P1) 🎯 MVP

**Goal**: Configure Astro to process React islands, MDX documents, and Tailwind styling classes with dark mode.

**Independent Test**: Build and verify an MDX page and React island component with Tailwind styling using `pnpm build`.

### Implementation for User Story 1

- [x] T006 [US1] Update `astro.config.mjs` to register `react()`, `mdx()`, and `tailwind()` integrations
- [x] T007 [P] [US1] Create a test React interactive island in `src/components/TestCounter.tsx` verifying React component compilation
- [x] T008 [US1] Create a test MDX lesson page in `src/pages/test-lesson.mdx` using Layout, Tailwind typography classes (`prose prose-invert`), and embedding `TestCounter`
- [x] T009 [US1] Verify User Story 1 compilation independently via `pnpm build`

**Checkpoint**: User Story 1 functional - Astro builds React islands and MDX with Tailwind styling.

---

## Phase 4: User Story 2 - Math & Gamification Dependencies (KaTeX & Confetti) (Priority: P2)

**Goal**: Configure KaTeX mathematical formula parsing in MDX and provide motion-safe celebratory confetti utilities.

**Independent Test**: Render inline and display LaTeX math equations in MDX and invoke confetti with reduced-motion support.

### Implementation for User Story 2

- [x] T010 [US2] Update `astro.config.mjs` to configure `markdown.remarkPlugins` (`remark-math`) and `markdown.rehypePlugins` (`rehype-katex`)
- [x] T011 [US2] Import `katex/dist/katex.min.css` into `src/layouts/Layout.astro` to ensure formula styling and MathML rendering
- [x] T012 [P] [US2] Create motion-safe confetti utility helper in `src/lib/confetti.ts` with `prefers-reduced-motion` detection
- [x] T013 [US2] Add LaTeX math expressions (`$E=mc^2$` and display math block) to `src/pages/test-lesson.mdx`
- [x] T014 [US2] Verify User Story 2 compilation independently via `pnpm build`

**Checkpoint**: User Story 2 functional - KaTeX math rendering and canvas-confetti motion wrapper operational.

---

## Phase 5: User Story 3 - Supabase Client Readiness & Environment Template (Priority: P3)

**Goal**: Provide standardized environment variables template and initialize Supabase client instance.

**Independent Test**: Verify presence of `.env.example` and import `@supabase/supabase-js` without runtime or bundling errors.

### Implementation for User Story 3

- [x] T015 [P] [US3] Create `.env.example` with `PUBLIC_SUPABASE_URL=` and `PUBLIC_SUPABASE_ANON_KEY=`
- [x] T016 [US3] Create Supabase client helper in `src/lib/supabase.ts` reading `import.meta.env.PUBLIC_SUPABASE_URL` and `import.meta.env.PUBLIC_SUPABASE_ANON_KEY`
- [x] T017 [US3] Verify User Story 3 client module resolution independently via `pnpm build`

**Checkpoint**: User Story 3 functional - Supabase client initialized and environment template documented.

---

## Phase 6: Polish & Verification Gate

**Purpose**: Clean up temporary test artifacts, run full production build, and verify zero errors.

- [x] T018 Retain `src/pages/test-lesson.mdx` and `src/components/TestCounter.tsx` as live reference verification samples
- [x] T019 Run full clean build check `pnpm build` verifying exit code 0 and zero configuration warnings
- [x] T020 Run accessibility contrast check on dark theme defaults using `check_contrast` tool (18.16:1 PASS)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Completed (`pnpm add` commands).
- **Foundational (Phase 2)**: Completed (Tailwind config + Layout).
- **User Story 1 (Phase 3 - P1 🎯 MVP)**: Completed.
- **User Story 2 (Phase 4 - P2)**: Completed.
- **User Story 3 (Phase 5 - P3)**: Completed.
- **Polish & Verification Gate (Phase 6)**: Completed.
