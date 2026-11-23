---
title: UI, Mobile Responsiveness & SEO Optimization Plan
status: draft
domain: https://academy.buddhilive.com
---

# Implementation Plan: UI, Mobile Responsiveness & SEO Optimization

## Guardrails & Constraints
- **Zero Course Content Edits**: Do not modify any `.mdx` files under `src/content/lessons/`.
- **Design System & Accessibility**: Preserve `DESIGN.md` tokens (`#A7452A` primary, `#E07A5F` dark primary, `#121212`/`#1E1E1E` dark surfaces), WCAG 2.2 AA contrast, `:focus-visible` rings, `min-h-[44px]` mobile tap targets, and fixed-height CLS-safe `AdSlot.astro` (`min-h-[90px]`).
- **Zero-Backend Execution**: Keep all Python execution client-side via Pyodide in `src/workers/pyodide.worker.ts`.

---

## Step 1: Responsive "Courses" Dropdown & Unified Header Navigation

1. **Create `src/components/islands/CoursesDropdown.tsx`**
   - Props: `currentTrack?: string`, `trackUrls?: Record<string, string>`, `buttonLabel?: string`.
   - Renders a single accessible trigger button (`aria-expanded`, `aria-haspopup="true"`, `aria-controls`) displaying the active course `shortLabel` (or `"Courses"` on the homepage) with a chevron indicator.
   - Opens a responsive dropdown panel listing all 9 `CURRICULUM_COURSES` from `src/lib/curriculum.ts` (step code, title, difficulty badge, and active indicator via `aria-current="page"`).
   - Responsive sizing: `w-[calc(100vw-2rem)] sm:w-80 max-h-[70vh] overflow-y-auto` anchored cleanly so it never overflows or clips on mobile viewports (`375px`).
   - Keyboard & pointer behavior: `Escape` closes the menu and returns focus to the trigger button; clicking outside closes the menu.

2. **Replace overflowing course strip in `src/components/islands/LessonProgressPanel.tsx` (lines 94–169)**
   - Remove the inline 9-course `<nav>` inside `overflow-x-auto py-1 scrollbar-none` (lines 99–133) that causes horizontal/vertical scrollbars.
   - Render:
     - Brand link (`/` with `BL` mark + `BuddhiLive` label)
     - `<CoursesDropdown currentTrack={currentTrack} trackUrls={trackUrls} />`
     - Right-aligned Pathfinder progress bar + XP pill (`hidden xs:flex` / compact sizing on narrow screens so the header stays on one clean row).

3. **Upgrade homepage header in `src/pages/index.astro` (lines 87–112)**
   - Pass `trackUrls={buildTrackUrlMap(allLessons)}` to `<CoursesDropdown client:load trackUrls={trackUrls} />` inside the homepage `<header>`.
   - Keep desktop section links (`#learning-path`, `#how-it-works`, `#free-stack`, `#acknowledgements`) for `md:flex`, and add a `<details>` or lightweight mobile menu toggle (`md:hidden`) for `< 768px` screens so mobile visitors can navigate all sections and courses cleanly.

---

## Step 2: Overall Mobile & Responsive Optimization

1. **`src/layouts/Layout.astro` (lines 18, 26)**
   - Update viewport meta to `<meta name="viewport" content="width=device-width, initial-scale=1" />`.
   - Add `overflow-x-clip` to `<body>` to prevent stray horizontal page scroll without breaking `position: sticky` on sidebars/headers.

2. **`src/layouts/LessonLayout.astro` (lines 83–173)**
   - Make the top `❮ Previous` / `Next ❯` bar (lines 125–151) `flex-wrap` with `min-h-[44px]` touch targets and `max-w-full truncate` on long cross-course labels so buttons never overflow on `375px` screens.
   - Ensure `<article class="prose ...">` handles wide Markdown tables, `<pre>` code blocks, and `.katex-display` math blocks cleanly on mobile (`overflow-x-auto` wrappers / global CSS rules for `.prose table` and `.katex-display`).

3. **`src/components/static/LessonSidebar.astro` (lines 40–103)**
   - Increase mobile disclosure link padding (`py-2.5` / `min-h-[44px]`) inside `<details class="lg:hidden ...">` for comfortable mobile tapping.

4. **`src/components/islands/PythonRunner.tsx` (lines 116–170) & `src/components/islands/LessonFooter.tsx` (lines 41–75)**
   - Ensure `PythonRunner` toolbar buttons (`Copy`, `Reset`, `Run Code`) wrap cleanly on narrow mobile viewports (`375px`) with accessible `min-h-[40px]`/`44px` tap targets.
   - Ensure `LessonFooter` stacks/wraps cleanly on small screens without clipping the XP badge or action button.

5. **`src/pages/learn/[track]/index.astro` (lines 66–245)**
   - Add `flex-wrap` to breadcrumb `<nav>` (line 68) and ensure course action buttons and lesson row cards (`line-clamp-2` on mobile) remain readable and tappable on `375px` viewports.

---

## Step 3: SEO Improvements (`https://academy.buddhilive.com`)

1. **Install & configure sitemap in `astro.config.mjs`**
   - Install `@astrojs/sitemap` (`pnpm add @astrojs/sitemap`).
   - Set `site: 'https://academy.buddhilive.com'` and add `sitemap()` to `integrations` in `astro.config.mjs`.

2. **Add `public/robots.txt`**
   - Allow all crawlers (`User-agent: *`, `Allow: /`) and reference `Sitemap: https://academy.buddhilive.com/sitemap-index.xml`.

3. **Upgrade meta tags in `src/layouts/Layout.astro` (lines 4–25)**
   - Add optional props: `canonicalUrl?: string`, `ogType?: 'website' | 'article'`, `ogImage?: string`, `noindex?: boolean`.
   - Compute canonical URL from `Astro.site` + `Astro.url.pathname` when not explicitly passed.
   - Output `<link rel="canonical">`, Open Graph tags (`og:type`, `og:title`, `og:description`, `og:url`, `og:site_name`), and Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`).

4. **Add JSON-LD Structured Data**
   - `src/pages/index.astro`: `WebSite` + `EducationalOrganization` JSON-LD in `slot="head"`.
   - `src/pages/learn/[track]/index.astro`: `Course` + `BreadcrumbList` JSON-LD in `slot="head"`.
   - `src/layouts/LessonLayout.astro`: `LearningResource` (linked to parent `Course`) + `BreadcrumbList` JSON-LD in `slot="head"`, and pass `ogType="article"` to `<Layout>`.

---

## Step 4: Verification & Testing

1. **Typecheck & Production Build**
   - Run `pnpm astro check` and `pnpm build` via `terminal-runner`.
   - Verify `dist/sitemap-index.xml` and `dist/robots.txt` are generated and contain `https://academy.buddhilive.com`.
   - Inspect built HTML in `dist/index.html`, `dist/learn/python/index.html`, and a sample lesson page for `<link rel="canonical">`, `og:*` tags, and `application/ld+json`.

2. **Content Integrity Check**
   - Run `git status` and `git diff -- src/content/lessons/` to confirm zero modifications to course `.mdx` files.

3. **Accessibility & Responsive Verification**
   - Run `buddhi scripts verify-a11y` via `terminal-runner`.
   - Verify keyboard navigation (`Tab`, `Enter`, `Escape`) on `CoursesDropdown` and mobile menu, and verify zero horizontal overflow or header scrollbar at `375px` (mobile), `768px` (tablet), and `1280px` (desktop).
