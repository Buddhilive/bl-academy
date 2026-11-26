# Tasks: Adapt Animate Video Skills & Explainer Workflow for Google Antigravity

**Input**: Design documents from `.buddhi/specs/020-adapt-animate-video/`
**Prerequisites**: [plan.md](file:///c:/DevDojo/Buddhi/bl-academy/.buddhi/specs/020-adapt-animate-video/plan.md) (required), [spec.md](file:///c:/DevDojo/Buddhi/bl-academy/.buddhi/specs/020-adapt-animate-video/spec.md) (required)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`US1`, `US2`, `US3`, `US4`)

---

## Phase 1: Setup & Hygiene (Blocking Prerequisites)

**Purpose**: Ensure gitignore hygiene and directory structure are in place before any skill files or test renders are created.

- [x] T001 Update `.gitignore` to ignore `references/`, `pieces/**/frames*/`, `pieces/**/review/`, `pieces/**/index.html`, `pieces/**/renders/*.wav`, `pieces/**/renders/final*.mp4`, `pieces/**/renders/share*.mp4`, `pieces/**/voice/*.scratch.wav`, and `pieces/**/voice/voice.wav`
- [x] T002 Create `.agents/skills/animate/` directory skeleton (`references/`, `grammar/`, `kit/`, `styles/`, `templates/`, `examples/`, `tools/`)
- [x] T003 [P] Verify local rendering prerequisites on Windows (`node -v`, `playwright` Chromium availability, `ffmpeg -version`, optional Python `faster-whisper`)

**Checkpoint**: `.gitignore` protects the repo from transient render artifacts and the `.agents/skills/animate/` directory structure is ready.

---

## Phase 2: User Story 1 - Antigravity-Native Animate Skill & Core Explainer Workflow (Priority: P1) 🎯 MVP

**Goal**: Port `.ref/animate/plugins/animate/skills/animate/` to `.agents/skills/animate/` with full Google Antigravity adaptation (`ask_question`, `invoke_subagent` / `run_workflow`, `16:9` default, `pieces/<course>/<slug>/` layout) and verified deterministic rendering.

**Independent Test**: Build one shipped style demo (e.g., `.agents/skills/animate/styles/math/demo`) or a minimal `16:9` test piece via `build.mjs`, verify `deterministic: true` with `tile.mjs`, export MP4 with `export.mjs`, and pass `review.mjs`.

### Implementation for User Story 1

- [x] T004 [P] [US1] Copy core runtime assets from `.ref/animate/plugins/animate/skills/animate/` (`kit/`, `grammar/`, `styles/`, `examples/`, `tools/`) into `.agents/skills/animate/`
- [x] T005 [P] [US1] Copy and update `.agents/skills/animate/templates/piece/` (`piece.json`, `src/head.html`) and `.agents/skills/animate/templates/beat-cut/` (`piece.json`, `src/head.html`) to default to `16:9` (`1920x1080`, `SAFE` for `16:9`, `formats: ["16:9", "9:16", "1:1", "4:5"]`)
- [x] T006 [US1] Author Antigravity-native `.agents/skills/animate/SKILL.md` with valid YAML frontmatter (`name: animate`, third-person `description`), progressive disclosure links to `references/`, `ask_question` gates, `invoke_subagent` / `run_workflow` parallel scene guidance, `pieces/<course>/<slug>/` paths, and `16:9` web lesson defaults
- [x] T007 [P] [US1] Adapt `.ref/animate/plugins/animate/skills/animate/intake.md` into `.agents/skills/animate/references/intake.md` (replace `AskUserQuestion` with `ask_question`, default `16:9`, replace ElevenLabs with Voicebox `"Buddhi"`)
- [x] T008 [P] [US1] Adapt `.ref/animate/plugins/animate/skills/animate/craft.md` into `.agents/skills/animate/references/craft.md` (update Voicebox pause/ducking notes and `16:9` framing rules)
- [x] T009 [P] [US1] Adapt `.ref/animate/plugins/animate/skills/animate/new-style.md` into `.agents/skills/animate/references/new-style.md` (Windows/Antigravity paths and `references/<look>/` guidance)
- [x] T010 [US1] Verify zero Claude-specific references (`AskUserQuestion`, `~/.claude`, `ElevenLabs connector`) remain in `.agents/skills/animate/SKILL.md` and `.agents/skills/animate/references/*.md`
- [ ] T011 [US1] Run end-to-end MVP pipeline verification on `.agents/skills/animate/styles/math/demo` (`build.mjs`, `tile.mjs` confirming `deterministic: true`, `still.mjs`, `export.mjs`, `review.mjs`)

**Checkpoint**: User Story 1 (MVP) is complete and independently verified — Antigravity discovers `.agents/skills/animate/` and can build, test, export, and review deterministic `16:9` explainers.

---

## Phase 3: User Story 2 - Local Voicebox ("Buddhi") Narration & WebVTT Caption Pipeline (Priority: P2)

**Goal**: Replace Claude's ElevenLabs connector with a local Voicebox (`http://localhost:17493`, profile `"Buddhi"`) generator script and emit WebVTT (`.vtt`) captions during export.

**Independent Test**: Run `voicebox.mjs` against local Voicebox (or `--scratch` fallback via `voice.mjs`) for a 2-line `script.json`, confirm `voice.wav` and `voice.json` generation, and verify `export.mjs` produces `renders/narration.vtt`.

### Implementation for User Story 2

- [x] T012 [P] [US2] Create `.agents/skills/animate/tools/voicebox.mjs` to query `GET /profiles` on `VOICEBOX_URL` (default `http://localhost:17493`), resolve profile `"Buddhi"` (case-insensitive, configurable via `--profile`), call `POST /generate` per `voice/script.json` line with `15s` timeout, validate line `id` filenames, and fail fast with clear `BypassSandbox` / `--scratch` fallback instructions if unreachable
- [x] T013 [P] [US2] Update `.agents/skills/animate/tools/voice.mjs` header comments and error messages to reference `voicebox.mjs` instead of the ElevenLabs MCP connector
- [x] T014 [US2] Update `.agents/skills/animate/tools/export.mjs` to emit `renders/narration.vtt` (WebVTT format) alongside `renders/narration.srt` whenever `meta.narration` is present
- [ ] T015 [US2] Verify `voice.mjs --scratch` and `export.mjs` WebVTT output on a minimal 2-line test narration script (and test `voicebox.mjs` against local Voicebox if running)

**Checkpoint**: Voicebox narration generation, `voice.mjs` timing alignment, and `.vtt` caption export work independently.

---

## Phase 4: User Story 3 - Accessible Astro `<ExplainerVideo />` Component & Publishing Flow (Priority: P3)

**Goal**: Provide `publish.mjs` to copy web deliverables into `public/videos/<course>/` and build `src/components/static/ExplainerVideo.astro` with `DESIGN.md` styling and WCAG 2.2 AA compliance.

**Independent Test**: Publish a sample video bundle to `public/videos/`, embed `<ExplainerVideo />` in a test page or lesson check, and pass `pnpm astro check`, `pnpm build`, and `buddhi scripts verify-a11y`.

### Implementation for User Story 3

- [x] T016 [P] [US3] Create `.agents/skills/animate/tools/publish.mjs` to copy `renders/final.mp4` (or `share.mp4` via `--share`) as `<slug>.mp4`, `renders/narration.vtt` as `<slug>.vtt` (if present), and a poster frame via `still.mjs` as `<slug>-poster.png` into `public/videos/<course>/`, and print the ready-to-paste `<ExplainerVideo />` MDX snippet
- [x] T017 [P] [US3] Create `src/components/static/ExplainerVideo.astro` with validated props (`course`, `slug`, `title`, `description?`, `captions?`, `lang?`, `transcript?`), `aspect-video` zero-CLS container, `<video controls preload="metadata">`, `<track kind="captions">`, accessible `<details>` transcript, and `DESIGN.md` Light/Dark tokens (`#A7452A` / `#E07A5F` focus rings, `border-stone-300 dark:border-stone-700`, `bg-stone-50 dark:bg-neutral-900`)
- [x] T018 [US3] Run `pnpm astro check` and `pnpm build` via `terminal-runner` to verify TypeScript props and Astro SSG compilation
- [ ] T019 [US3] Run `buddhi scripts verify-a11y` (and `check_contrast` if any custom classes are added) on `src/components/static/ExplainerVideo.astro` and verify keyboard operability and WCAG 2.2 AA compliance

**Checkpoint**: `<ExplainerVideo />` and `publish.mjs` are verified, accessible, and ready for any `.mdx` lesson.

---

## Phase 5: User Story 4 & Polish - Attribution, Docs & Final Verification (Priority: P4)

**Goal**: Credit upstream `cth9191/animate` in `ACKNOWLEDGEMENTS.md`, ensure zero `.ref/` leaks, and run final workspace checks.

- [x] T020 [P] [US4] Update `ACKNOWLEDGEMENTS.md` to credit `cth9191/animate` (MIT License) for the procedural `<canvas>` animation skill and kit
- [x] T021 [P] Update `.agents/skills/README.md` (if present) or verify skill discovery listing includes `animate`
- [x] T022 Verify `git status` shows zero untracked intermediate frames, WAV stems, or `references/` media after test renders, and clean up any temporary test piece artifacts

---

## Dependencies & Execution Order

- **Phase 1 (Setup & Hygiene)**: Start immediately (`T001`–`T003`).
- **Phase 2 (US1 — MVP)**: Depends on Phase 1. `T004`–`T009` can run largely in parallel, followed by `T010` and `T011`.
- **Phase 3 (US2 — Voicebox & WebVTT)**: Depends on `T004` (`tools/` copied). `T012` and `T013` run in parallel, followed by `T014` and `T015`.
- **Phase 4 (US3 — `<ExplainerVideo />` & Publish)**: `T016` and `T017` can run in parallel once Phase 1 is done, followed by `T018` and `T019`.
- **Phase 5 (US4 & Polish)**: `T020` and `T021` can run anytime in parallel; `T022` runs last after all verifications.
