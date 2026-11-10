# Feature Specification: Content Collections & Course Layout

**Feature Branch**: `005-content-collections-and`

**Created**: 2026-11-02

**Status**: Draft

**Input**: User description: "Content Collections & Course Layout: `lessons` collection with Zod-validated frontmatter; `LessonLayout.astro` with sidebar, progress bar, XP tracker, CLS-safe AdSense slots, KaTeX CSS; static route `/learn/[track]/[slug]`."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read a lesson at a stable URL (Priority: P1)

A learner opens `/learn/python-zero-to-hero/<slug>` and sees the lesson MDX rendered (headings, prose, KaTeX math, islands) inside semantic HTML, with correct title and meta description.

**Why this priority**: Without validated content and a route there is no product. This is the MVP slice.

**Independent Test**: Add one valid lesson MDX, run `pnpm build`, open the generated page. Delivers a readable lesson.

**Acceptance Scenarios**:

1. **Given** a lesson with valid frontmatter, **When** the site is built, **Then** a static page exists at `/learn/<track>/<slug>`.
2. **Given** a lesson whose `description` is under 30 characters or whose `track`/`difficulty` is outside the enum, **When** the site is built, **Then** the build fails with a message naming the file and field.
3. **Given** a lesson containing `$...$` math, **When** the page loads, **Then** the formula is styled by the KaTeX stylesheet loaded in `<head>`.
4. **Given** a URL with an unknown track or slug, **When** requested, **Then** the site's 404 page is served.

---

### User Story 2 - Navigate the track via sidebar (Priority: P2)

A learner sees every lesson in the track, ordered by `order`, with the current one highlighted and completed ones checked, and can jump to any of them.

**Why this priority**: Navigation and a sense of progress drive retention, but a single lesson is readable without it.

**Independent Test**: Build with 3 lessons, mark one complete in local storage, confirm the sidebar order, active state and check mark.

**Acceptance Scenarios**:

1. **Given** lessons with orders 1, 2, 3, **When** any lesson page renders, **Then** the sidebar lists them in ascending `order` as links.
2. **Given** a lesson marked complete in local-first state (spec 004), **When** the page hydrates, **Then** its sidebar entry shows a check with an accessible text label.
3. **Given** a narrow viewport, **When** the page renders, **Then** the sidebar collapses to a keyboard-operable disclosure and content does not scroll horizontally.

---

### User Story 3 - See progress and XP (Priority: P2)

A learner sees a top progress bar (completed / total lessons in the track) and their total XP.

**Why this priority**: Core gamification, depends on local state from spec 004.

**Independent Test**: Complete a lesson, reload, and confirm the bar and XP total reflect it.

**Acceptance Scenarios**:

1. **Given** 1 of 4 lessons completed, **When** the page hydrates, **Then** the bar shows 25% with `role="progressbar"` and correct `aria-valuenow`.
2. **Given** completed lessons with xp 10 and 20, **When** the page hydrates, **Then** the tracker shows 30 XP.
3. **Given** no stored progress, **When** the page renders, **Then** the bar shows 0% and XP shows 0, with no layout shift on hydration.

---

### User Story 4 - Ad slots without layout shift (Priority: P3)

Top and bottom ad banners reserve space before any ad loads.

**Why this priority**: Monetization; must not harm reading or CLS.

**Independent Test**: Measure CLS on a lesson page with the ad script blocked and unblocked.

**Acceptance Scenarios**:

1. **Given** the page is rendering, **When** an ad is absent, blocked or slow, **Then** the slot still occupies at least 90px height.
2. **Given** an ad loads, **When** it fills the slot, **Then** no content shifts.

---

### Edge Cases

- Duplicate `order` values within a track: build should fail or warn deterministically (tie-break by slug).
- Track with a single lesson: progress bar shows 0% or 100%, previous/next absent.
- Corrupted or unavailable local storage: fall back to 0 progress, no crash.
- Lessons in the collection with a `track` that has no route entry are never emitted.
- Slug derived from file ID, including nested folders.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST define a `lessons` collection in `src/content.config.ts` validating (plus the optional fields in FR-010) `title` (string), `track` (enum `python-zero-to-hero`), `order` (number), `difficulty` (enum beginner/intermediate/advanced), `xp` (number), `description` (string, min 30 chars).
- **FR-002**: System MUST create `src/layouts/LessonLayout.astro` wrapping the base layout, with a sidebar listing all lessons in the current track sorted by `order`.
- **FR-003**: Sidebar MUST mark the current lesson (`aria-current="page"`) and show a completion check from client-side progress state.
- **FR-004**: Layout MUST show a top progress bar and XP tracker driven by client-side state, with reserved dimensions.
- **FR-005**: Layout MUST include top and bottom AdSense slots with `min-h-[90px]` in fixed containers.
- **FR-006**: KaTeX CSS MUST be injected in `<head>` for lesson pages.
- **FR-007**: `src/pages/learn/[track]/[slug].astro` MUST implement `getStaticPaths()` from the collection and render MDX inside semantic wrappers (`main`, `article`, `nav`, `aside`).
- **FR-008**: Page `<title>` and meta description MUST come from frontmatter.
- **FR-009**: Existing test lesson `src/pages/test-lesson.mdx` is not migrated by this feature unless the user asks.
- **FR-010**: The schema MUST also keep `topic` (string) and `prerequisites` (array of lesson slugs) from AGENTS.md, as optional fields so lessons without them still validate.
- **FR-011**: Progress and XP MUST be read from the local storage in `src/lib/storage.ts` (spec 004).
- **FR-012 (A11Y)**: UI MUST meet WCAG 2.2 AA: keyboard-operable sidebar toggle, visible `:focus-visible`, AA contrast in light and dark with `#A7452A` / `#E07A5F`, check state conveyed by text and not color alone, landmark roles, a skip-to-content link. Contrast verified with `buddhi scripts contrast`.

### Key Entities

- **Lesson**: collection entry with the six frontmatter fields, an id (slug) and MDX body.
- **Track**: grouping by `track` value, an ordered list of lessons.
- **Progress**: set of completed lesson ids and total XP, held in local-first storage.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A lesson with invalid frontmatter fails the build 100% of the time and names the offending field.
- **SC-002**: Every valid lesson has a statically generated page with no server runtime.
- **SC-003**: Cumulative Layout Shift ≤ 0.1 on lesson pages, with and without ads.
- **SC-004**: Sidebar, progress bar and XP reflect stored progress within 1 second of page load.
- **SC-005**: Automated a11y check (`buddhi scripts verify-a11y`) reports zero AA violations on the layout.

## Assumptions

- Only the `python-zero-to-hero` track exists for now; the route generalizes to more tracks.
- Progress and XP come from existing local-first storage (spec 004); the layout only reads it, via a small hydrated island.
- Ad slots hold a placeholder until an AdSense client ID is configured.
- Tailwind and `@tailwindcss/typography` are used for styling, following `DESIGN.md` if present.
- `rehype-katex` and `remark-math` are already installed; MDX config wiring is checked in planning.
- Astro's content layer (glob loader) is used, given Astro 7.
