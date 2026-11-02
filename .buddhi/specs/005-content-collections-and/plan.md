# Implementation Plan: Content Collections & Course Layout

**Branch**: `005-content-collections-and` | **Spec**: [spec.md](./spec.md)

## Summary

Add a typed `lessons` content collection, a `LessonLayout.astro` (sidebar, progress bar, XP tracker, CLS-safe ad slots, KaTeX CSS) and a fully static route `/learn/[track]/[slug]`. Everything is rendered at build time except one small React island that reads local progress from `src/lib/storage.ts` and fills the sidebar checks, progress bar and XP.

## Technical Context

- **Stack**: Astro 7, `@astrojs/mdx`, React 19 islands, Tailwind 3 + typography, `katex` + `remark-math`/`rehype-katex` (already wired in `astro.config.mjs`).
- **State**: `listLocalProgress()` in `src/lib/storage.ts` returns `{lesson_slug, completed, xp_earned}`. Key = `lesson_progress_<slug>`. `isValidSlug` allows letters, digits, `-`, `_`, `/`, so the collection entry `id` is a valid progress slug. Use `id` as the single slug everywhere.
- **Existing**: `src/layouts/Layout.astro` (dark root, already imports KaTeX CSS), `src/pages/test-lesson.mdx` (stays untouched). `src/content/` does not exist yet.
- **Graph**: stale (`built_at_commit` ≠ HEAD); `.buddhi/docs/` is absent, so grounding was done from source.
- **Commands**: `pnpm build`, `pnpm astro check`.

### Key decisions

| Decision | Choice | Why |
|---|---|---|
| Collection loader | `glob({ pattern: '**/*.mdx', base: './src/content/lessons' })` | Matches the AGENTS.md lesson location; Astro 7 content layer. |
| Config file | `src/content.config.ts` | As requested. |
| Progress rendering | One island `LessonProgressPanel.tsx`, `client:load`, receives `lessons[]` (id, title, xp) and `currentId` as props | Sidebar HTML is static for SEO. The island only hydrates checks, bar and XP. |
| Initial state | Server renders 0% / 0 XP / unchecked in fixed-size boxes | Hydration changes text only, no size change, so no CLS. |
| Layout split | `LessonLayout` wraps `Layout.astro` and adds a `<slot name="head">` for per-page meta | Keeps one root document. Needs `description` and a head slot added to `Layout.astro` (small edit). |
| Ad slots | `AdSlot.astro` with `min-h-[90px]` wrapper, `aria-label="Advertisement"`, a placeholder until a client ID is set | Fixed container, no CLS. |
| Sidebar on mobile | `<details>` disclosure, open by default at `lg:` | Keyboard operable without JS. |
| Schema extras | `topic` and `prerequisites` optional | Per FR-010. |

### Trade-off lenses

- **Fewest-slices**: collection + route + bare layout first (US1). Rest layers on it.
- **Risk-first**: the risks are (a) hydrated progress shifting layout, (b) invalid-slug progress keys, (c) MDX math rendering in collection `render()`. Mitigate by reserving sizes, reusing `id`, and building a sample lesson early.
- **Seam-quality**: the layout stays presentational and the island owns all storage reads. No storage code in `.astro` files.

## AGENTS.md & DESIGN.md Compliance Check

- Zero-backend, client-side only: ✅ (no server code added).
- Lesson MDX at `/src/content/lessons/`: ✅. Prose ≥ 350 words applies to authored lessons. The sample lesson will meet it.
- `<PythonRunner client:visible />` unchanged: ✅.
- Light and dark support, primary `#A7452A` / `#E07A5F`: ⚠ `Layout.astro` is hard-coded dark. The layout will use `dark:` utility variants, and a theme toggle is out of scope. No `DESIGN.md` exists, so token validation is skipped. Consider `/design-md` later.
- Ads in fixed-height containers: ✅.
- Build commands: `pnpm build`, `pnpm astro check` ✅.

## Accessibility Strategy

- Landmarks: skip link → `header`, `aside nav aria-label="Course lessons"`, `main > article`.
- Sidebar: ordered list of links, `aria-current="page"`, completion shown as text ("Completed", visually hidden or icon with a label), never colour only.
- Progress bar: `role="progressbar"` with `aria-valuemin/max/now` and `aria-label`. XP in plain text, no live-region spam (`aria-live` off).
- Mobile disclosure: native `<details><summary>`, visible `:focus-visible` ring.
- Contrast: check `#A7452A` on light surfaces and `#E07A5F` on dark with `buddhi scripts contrast` before finalizing. Never estimate.
- Gates: `buddhi scripts verify-a11y` via `terminal-runner`. Record choices in `A11Y-DECISIONS.md` and `REPORT.md`.

## Project Structure

```text
src/
├── content.config.ts                 # NEW: lessons collection (zod)
├── content/lessons/
│   └── 01-hello-python.mdx           # NEW: sample lesson (350+ words, KaTeX)
├── layouts/
│   ├── Layout.astro                  # EDIT: description prop + head slot
│   └── LessonLayout.astro            # NEW
├── components/
│   ├── static/
│   │   ├── AdSlot.astro              # NEW
│   │   └── LessonSidebar.astro       # NEW: static list
│   └── islands/
│       └── LessonProgressPanel.tsx   # NEW: reads storage, updates checks/bar/XP
└── pages/learn/[track]/[slug].astro  # NEW: getStaticPaths + render()
```

Schema:

```ts
z.object({
  title: z.string(),
  track: z.enum(['python-zero-to-hero']),
  order: z.number(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  xp: z.number(),
  description: z.string().min(30),
  topic: z.string().optional(),
  prerequisites: z.array(z.string()).optional(),
})
```

Route: `getStaticPaths` maps each entry to `params: { track: data.track, slug: id }`, with `props: { entry }`. Sidebar lessons are fetched with `getCollection('lessons', e => e.data.track === track)`, sorted by `order` and then `id`. MDX body comes from `render(entry)`.

## Open items to settle during implementation

- **Hydration sync**: the island listens for the `storage` event so other tabs update.
- **Island coupling**: `LessonFooter.tsx` already exists. Check whether it writes progress. If it does, the panel should also refresh when it completes a lesson (a small custom event).
- **Duplicate `order`**: tie-break by `id`, and warn in `getStaticPaths`.
- **Ad client ID**: via `PUBLIC_ADSENSE_CLIENT` env, rendering the placeholder when empty.

## Complexity Tracking

| Item | Why needed | Simpler alternative rejected |
|---|---|---|
| React island for progress | Storage is browser-only | Inline `<script>` is workable, but the repo already uses React islands and the panel needs shared state across bar, XP and checks. |
| Head slot in `Layout.astro` | Per-page title and description for SEO | Duplicate `<head>` in the lesson layout. |

## Verification

1. `pnpm astro check` and `pnpm build` pass with the sample lesson.
2. A lesson with a 10-character description fails the build with the file and field in the error.
3. Manual: set `lesson_progress_<id>` in local storage and confirm the check, bar and XP.
4. CLS measured with ads blocked and not blocked; `verify-a11y` clean.
