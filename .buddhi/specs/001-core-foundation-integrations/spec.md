# Feature Specification: Core Foundation & Integrations Setup

**Feature Branch**: `001-core-foundation-integrations`  
**Created**: 2026-11-01  
**Status**: Ready for Planning  
**Input**: User description: "Core Foundation & Integrations Setup: Add required Astro integrations (React, MDX, Tailwind CSS), install client dependencies (@supabase/supabase-js, katex, remark-math/rehype-katex, canvas-confetti), configure astro.config.mjs, configure Tailwind with dark-mode defaults and typography, create .env.example, and verify zero configuration errors with a clean build check."

---

## User Scenarios & Testing

### User Story 1 - Core Framework Integrations (React, MDX, Tailwind) (Priority: P1)

Developers building interactive curriculum lessons need the Astro project configured with React islands, MDX support, and Tailwind CSS so that rich, styled interactive content components can be authored and rendered seamlessly.

- **Why this priority**: Forms the fundamental rendering pipeline and UI foundation for all subsequent feature development, interactive components, and documentation pages.
- **Independent Test**: Run `pnpm build` with a sample MDX page containing Tailwind utility classes and a React component island; verify error-free compilation and expected HTML output.

**Acceptance Scenarios**:
1. **Given** a fresh Astro project, **When** `@astrojs/react`, `@astrojs/mdx`, and Tailwind CSS are added to `astro.config.mjs`, **Then** Astro initializes and builds without module resolution or syntax errors.
2. **Given** Tailwind configuration, **When** `tailwind.config.mjs` is set with `darkMode: 'class'` and `@tailwindcss/typography`, **Then** dark mode classes and prose styling utilities are available for MDX and layout styling.
3. **Given** an MDX document with interactive React islands, **When** processed by Astro during `astro build`, **Then** HTML and client island bundles are generated cleanly.

---

### User Story 2 - Math & Gamification Dependencies (KaTeX & Confetti) (Priority: P2)

Curriculum authors need mathematical formula rendering (via LaTeX / KaTeX) and learners need visual gamification rewards (via celebratory confetti animations) when completing lesson checkpoints.

- **Why this priority**: Critical for domain-specific educational delivery (math/science notation) and learner engagement, layered directly onto the core MDX and React pipelines.
- **Independent Test**: Build a page with inline/display math expressions using `remark-math` and `rehype-katex`, and import `canvas-confetti` in a TypeScript/React island without type or runtime compilation errors.

**Acceptance Scenarios**:
1. **Given** `remark-math` and `rehype-katex` registered in `astro.config.mjs`, **When** markdown or MDX includes math syntax (`$...$` and `$$...$$`), **Then** Astro transforms the expressions into KaTeX HTML and MathML elements.
2. **Given** `canvas-confetti` and `@types/canvas-confetti` installed, **When** imported in client-side React islands or Astro scripts, **Then** TypeScript type checking passes without unresolved module errors.
3. **Given** users with motion sensitivities (`prefers-reduced-motion: reduce`), **When** confetti triggers, **Then** confetti animations gracefully disable or respect user motion settings in accordance with accessibility requirements.

---

### User Story 3 - Supabase Client Readiness & Environment Template (Priority: P3)

Developers and continuous integration pipelines need a standardized environment variable template and the Supabase JavaScript SDK installed to prepare for authentication, user profiles, and lesson progress synchronization.

- **Why this priority**: Prepares data and authentication layers for subsequent backend and auth features without blocking local UI/content development.
- **Independent Test**: Verify presence of `.env.example` with required keys and check that `@supabase/supabase-js` is resolved without peer dependency or bundling issues.

**Acceptance Scenarios**:
1. **Given** `.env.example`, **When** inspected, **Then** it declares `PUBLIC_SUPABASE_URL=` and `PUBLIC_SUPABASE_ANON_KEY=` with clear documentation placeholders.
2. **Given** `@supabase/supabase-js` installed in `package.json`, **When** imported across client or server code, **Then** bundling and type definitions resolve without errors.

---

## Edge Cases

- **KaTeX CSS Missing**: If `katex/dist/katex.min.css` is not loaded in the root layout, rendered math will appear unstyled or misaligned. Layouts must import or link the KaTeX stylesheet.
- **Node & Package Compatibility**: Strict Node version requirements (`>=22.23.4`) and pnpm peer-dependency resolution must remain valid when new packages are added.
- **Dark Mode Flashes**: Class-based dark mode must avoid unstyled white flashes (FOUC) when initializing user theme preference.
- **Reduced Motion Sensitivity**: Gamified confetti animations must be suppressible for users with vestibular disorders or `prefers-reduced-motion` enabled.

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST integrate `@astrojs/react` into Astro configuration to enable client-side interactive islands.
- **FR-002**: System MUST integrate `@astrojs/mdx` into Astro configuration to support MDX lesson authoring.
- **FR-003**: System MUST configure Tailwind CSS with `@tailwindcss/typography` plugin and class-based dark mode (`darkMode: 'class'`).
- **FR-004**: System MUST configure `remark-math` and `rehype-katex` in Astro markdown configuration and include KaTeX CSS styling.
- **FR-005**: System MUST install `@supabase/supabase-js` client SDK.
- **FR-006**: System MUST install `canvas-confetti` and `@types/canvas-confetti`.
- **FR-007**: System MUST provide a `.env.example` file exposing `PUBLIC_SUPABASE_URL=` and `PUBLIC_SUPABASE_ANON_KEY=`.
- **FR-008**: System MUST pass `pnpm build` with zero configuration, type, or linting errors.

### Accessibility (A11Y) Requirements

- **A11Y-001**: Math expressions rendered via KaTeX MUST include accessible MathML output and screen-reader accessible annotations (`aria-hidden` on visual symbols where appropriate).
- **A11Y-002**: Color contrast in Tailwind dark mode defaults MUST comply with WCAG 2.2 AA (minimum 4.5:1 for body copy and 3:1 for large text/interactive borders).
- **A11Y-003**: Celebratory animations (e.g. `canvas-confetti`) MUST honor `prefers-reduced-motion: reduce` media queries.

### Key Entities

- **Astro Config**: Central configuration defining integrations (React, MDX, Tailwind), markdown plugins (remark-math, rehype-katex), and build targets.
- **Tailwind Config**: Styling configuration controlling content paths, theme extensions, dark mode strategy, and typography presets.
- **Environment Schema**: Environment variable definitions (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`) for database and auth connectivity.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: `pnpm build` executes to completion with exit code `0` and generates production assets with zero errors or warnings.
- **SC-002**: All 6 requested integrations and client dependencies are present in `package.json` with resolved versions and no peer-dependency conflicts.
- **SC-003**: Test MDX and math rendering compiles to valid semantic HTML with KaTeX math structures.
- **SC-004**: `.env.example` exists and specifies both required Supabase connection parameters.

---

## Assumptions

- Package manager is `pnpm` (based on `pnpm-lock.yaml` in workspace).
- React (`@astrojs/react`) was chosen over Preact for broader ecosystem and typings support.
- Class-based dark mode (`darkMode: 'class'`) was selected to enable toggleable dark aesthetic.
- Supabase actual credentials will be provided by the user in `.env`; `.env.example` serves as the committed template.
