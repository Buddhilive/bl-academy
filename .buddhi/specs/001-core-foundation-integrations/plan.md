# Implementation Plan: Core Foundation & Integrations Setup

**Branch**: `001-core-foundation-integrations` | **Date**: 2026-11-01 | **Spec**: [spec.md](file:///C:/DevDojo/Buddhi/bl-academy/.buddhi/specs/001-core-foundation-integrations/spec.md)

**Input**: Feature specification from `/.buddhi/specs/001-core-foundation-integrations/spec.md`

---

## Summary

Establish the project foundation for bl-academy by installing and configuring Astro integrations for React interactive islands (`@astrojs/react`, `react`, `react-dom`), MDX lesson content authoring (`@astrojs/mdx`), and Tailwind CSS (`@astrojs/tailwind`, `tailwindcss`, `@tailwindcss/typography`) with class-based dark mode defaults. Integrate mathematical formula rendering via `katex`, `remark-math`, and `rehype-katex`, install `canvas-confetti` (with TypeScript definitions) for gamified completion rewards, add `@supabase/supabase-js` for backend client connectivity, and generate `.env.example` with Supabase credential placeholders. Verify zero configuration errors with a clean production build (`pnpm build`).

---

## Technical Context

**Language/Version**: TypeScript 5.x / JavaScript (ESM), Node.js `>=22.23.4`, Astro `v7.4.4`  
**Primary Dependencies**:
- Astro Integrations: `@astrojs/react`, `@astrojs/mdx`, `@astrojs/tailwind`
- UI & Islands: `react`, `react-dom`, `@types/react`, `@types/react-dom`
- Styling: `tailwindcss`, `@tailwindcss/typography`, `autoprefixer`
- Math Rendering: `katex`, `remark-math`, `rehype-katex`
- Gamification: `canvas-confetti`, `@types/canvas-confetti`
- Backend Client: `@supabase/supabase-js`  
**Storage**: Supabase (PostgreSQL client SDK configured via `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`)  
**Testing**: Static build check (`pnpm build`), Astro diagnostics (`pnpm astro check`), and A11Y contrast/motion verification  
**Target Platform**: Modern web browsers (ESM, SSG/SSR via Node.js runtime)  
**Project Type**: Interactive Educational Web Application (Astro Content + React Islands)  
**Performance Goals**: Zero runtime JavaScript for static MDX content; selective partial hydration for React islands; optimized CSS bundle via Tailwind purge  
**Constraints**:
- Strict class-based dark mode (`darkMode: 'class'`) with dark theme as default
- WCAG 2.2 AA accessibility compliance (minimum 4.5:1 text contrast)
- Reduced-motion compliance for animated celebration effects (`prefers-reduced-motion`)
- Clean zero-warning compilation on `pnpm build`  
**Scale/Scope**: Core project infrastructure across configuration, base layouts, markdown plugins, client dependencies, and environment templates.

---

## AGENTS.md & Rules Compliance Check

*GATE: Verified against repository rules before implementation.*

- [x] **Project Build & Dev Commands**: Conforms to `AGENTS.md` (`pnpm dev` / `astro dev --background`, `pnpm build`).
- [x] **Sandbox Installation Protocol**: Package installation commands will run with `BypassSandbox: true` as required by terminal sandbox rules on Windows for `pnpm`.
- [x] **A11Y Protocol**: Conforms to `.agents/rules/a11y.md` (WCAG 2.2 AA standard profile, contrast floors, accessible MathML, and reduced-motion handling).
- [x] **Anti-slop Protocol**: Clean, unbloated configuration adhering to `.agents/rules/antislop.md`.

---

## Architectural Lenses Evaluation

### 1. Fewest-Slices Lens (Minimal Viable Path)
- **Slice 1 (P1)**: Install React, MDX, and Tailwind dependencies. Configure `astro.config.mjs` and `tailwind.config.mjs` with `darkMode: 'class'` and `@tailwindcss/typography`.
- **Slice 2 (P2)**: Install `katex`, `remark-math`, `rehype-katex`, `canvas-confetti`, and `@types/canvas-confetti`. Register markdown plugins in `astro.config.mjs` and include KaTeX stylesheet in `src/layouts/Layout.astro`.
- **Slice 3 (P3)**: Install `@supabase/supabase-js`, create `.env.example` with `PUBLIC_SUPABASE_URL=` and `PUBLIC_SUPABASE_ANON_KEY=`. Run `pnpm build` to verify zero configuration errors.

### 2. Risk-First Lens (De-risking Hotspots)
- **Astro v7 Compatibility**: Verify that Astro official integrations (`@astrojs/react`, `@astrojs/mdx`, `@astrojs/tailwind`) cleanly peer-resolve with Astro v7.
- **KaTeX Styling Seam**: Without the KaTeX stylesheet, rendered HTML/MathML expressions render unstyled or scattered. Ensure `katex/dist/katex.min.css` is imported directly into `src/layouts/Layout.astro`.
- **Dark Mode Flash (FOUC)**: Default `class="dark"` on `<html>` in `src/layouts/Layout.astro` ensures immediate dark theme rendering without client hydration flash.
- **Vestibular & Motion Safety**: `canvas-confetti` invocations must check `window.matchMedia('(prefers-reduced-motion: reduce)')` to avoid disorientation for motion-sensitive users.

### 3. Seam-Quality Lens (Boundary Decoupling)
- **Declarative Astro Config**: All integrations, markdown remark plugins, and rehype plugins are registered cleanly in `astro.config.mjs` using typed imports.
- **Tailwind Boundary**: Content paths (`./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}`) and typography plugins are isolated in `tailwind.config.mjs`.
- **Environment Boundary**: Only `PUBLIC_` variables are exposed in `.env.example`; no secret service role keys are introduced to client scopes.

---

## Accessibility (A11Y) Strategy

- **Compliance Profile**: Standard (WCAG 2.2 AA / EN 301 549).
- **Contrast Ratios**: Dark theme base colors must maintain at least 4.5:1 for body copy (e.g. `text-neutral-100` on `bg-neutral-900`) and 3:1 for interactive controls.
- **MathML & Formula Accessibility**: `rehype-katex` generates semantic MathML output alongside HTML representations, allowing screen readers to interpret mathematical expressions accurately.
- **Motion Accessibility**: Provide helper utility or guidelines for confetti triggering that suppresses particle animations when `prefers-reduced-motion: reduce` is detected.

---

## Security Boundaries

- **Public Environment Variables**: Only `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` are exposed. Any future service-role keys must never use the `PUBLIC_` prefix.
- **Content Sanitization**: MDX content authored internally runs in a trusted context, while KaTeX operates with secure math parsing defaults preventing script injection.

---

## Project Structure

### Documentation (this feature)

```text
.buddhi/specs/001-core-foundation-integrations/
├── spec.md              # Feature specification
├── plan.md              # This implementation plan
└── tasks.md             # Task breakdown (created by /spec-tasks)
```

### Source Code Changes

```text
c:\DevDojo\Buddhi\bl-academy/
├── .env.example             # NEW: Template for Supabase environment keys
├── astro.config.mjs         # MODIFIED: Register React, MDX, Tailwind, remark-math, rehype-katex
├── package.json             # MODIFIED: Dependencies and integrations added
├── pnpm-lock.yaml           # MODIFIED: Dependency lockfile updated
├── tailwind.config.mjs      # NEW: Tailwind configuration (darkMode: 'class', typography plugin)
└── src/
    └── layouts/
        └── Layout.astro     # MODIFIED: KaTeX CSS import, dark class default on <html>
```

---

## Implementation Sequence

1. **Phase 1: Dependencies Installation**
   - Execute `pnpm add @astrojs/react react react-dom @astrojs/mdx @astrojs/tailwind tailwindcss @tailwindcss/typography katex remark-math rehype-katex canvas-confetti @supabase/supabase-js` (with `BypassSandbox: true` as per pnpm rule).
   - Execute `pnpm add -D @types/react @types/react-dom @types/canvas-confetti` (with `BypassSandbox: true`).

2. **Phase 2: Configuration Setup**
   - Create `tailwind.config.mjs` with:
     - `darkMode: 'class'`
     - Content paths covering Astro, React, and MDX files
     - `@tailwindcss/typography` plugin
   - Update `astro.config.mjs`:
     - Import `react` from `@astrojs/react`
     - Import `mdx` from `@astrojs/mdx`
     - Import `tailwind` from `@astrojs/tailwind`
     - Import `remarkMath` from `remark-math`
     - Import `rehypeKatex` from `rehype-katex`
     - Register `integrations: [react(), mdx(), tailwind()]`
     - Register `markdown: { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }`

3. **Phase 3: Base Layout & Styling**
   - In `src/layouts/Layout.astro`:
     - Import `katex/dist/katex.min.css`
     - Add `class="dark"` to `<html>` tag to default to dark theme
     - Ensure base body classes support typography and background contrast

4. **Phase 4: Environment Configuration**
   - Create `.env.example` with:
     ```env
     PUBLIC_SUPABASE_URL=
     PUBLIC_SUPABASE_ANON_KEY=
     ```

5. **Phase 5: Verification & Gate Check**
   - Run `pnpm build` via `terminal-runner` to verify zero errors, clean output, and proper integration initialization.

---

## Complexity Tracking

No architectural violations or unneeded abstractions introduced. All integrations follow official Astro ecosystem patterns.
