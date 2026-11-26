# Feature Specification: Adapt Animate Video Skills & Explainer Workflow for Google Antigravity

**Feature Branch**: `020-adapt-animate-video`

**Created**: 2026-11-26

**Status**: Draft

**Input**: User description: "Analyze the 'Animate' project in `.ref/animate` which provides agent skills to create animate videos for Claude Code. Analyzing the repo, adapt the skills and the workflow for Google Antigravity under the `.agents` folder following Google Antigravity guidelines. So that we can use those skills to create animated videos as explainers in this education website project."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Antigravity-Native Animate Skill & Core Explainer Workflow (Priority: P1)

As a BuddhiAI Academy author using Google Antigravity, I want the procedural `<canvas>` animation skill from `.ref/animate` adapted under `.agents/skills/animate/` following Google Antigravity's customization guidelines so that I can invoke the skill to plan, storyboard, build, review, and export deterministic `16:9` lesson explainer videos using any of the 7 built-in styles (`cut-paper`, `crosshatch`, `riso`, `sketchbook`, `math`, `pixel`, `isometric`).

**Why this priority**: This is the standalone MVP slice. Without the Antigravity-compliant skill structure, adapted instructions, and working Node/Playwright/ffmpeg pipeline under `.agents/skills/animate/`, no explainer videos can be authored or rendered.

**Independent Test**: Can be fully tested by invoking the `animate` skill in Google Antigravity on a sample lesson concept (or building one of the shipped style demos via `.agents/skills/animate/tools/build.mjs`, verifying determinism with `tile.mjs`, exporting a `16:9` MP4 with `export.mjs`, and passing `review.mjs`).

**Acceptance Scenarios**:

1. **Given** a workspace with `.agents/skills/animate/SKILL.md`, **When** Google Antigravity discovers workspace skills, **Then** the `animate` skill is loaded via progressive disclosure with valid YAML frontmatter (`name`, `description`), concise core instructions, and relative links to reference docs (`references/` or subdirectories) and executable scripts.
2. **Given** an author asks to create an explainer video for a course lesson (e.g., `python/variables`), **When** the agent runs the adapted intake and check-in workflow, **Then** the agent uses Google Antigravity's `ask_question` tool (never Claude's `AskUserQuestion`), defaults to `16:9` landscape format, scaffolds the piece under `pieces/<course>/<slug>/`, and enforces all three approval gates (Story check, Look check, Storyboard check) before animating.
3. **Given** a multi-scene explainer piece (>30s), **When** the agent fans out scene authoring across parallel workers, **Then** the skill instructs using Google Antigravity's `invoke_subagent` (or `run_workflow`) with clear per-scene ownership (`src/era-*.js`) and shared-file boundaries rather than Claude-specific subagent instructions.
4. **Given** a completed piece in `pieces/<course>/<slug>/`, **When** the build, tile, export, and review scripts run on Windows (PowerShell / Node), **Then** the build produces a self-contained deterministic `index.html`, `tile.mjs` confirms `deterministic: true`, `export.mjs` renders a `16:9` MP4 (and optional additional formats such as `9:16` when requested), and `review.mjs` reports measured checks (cut grid, story arc, text overflow, loudness).

---

### User Story 2 - Local Voicebox ("Buddhi") Narration & WebVTT Caption Pipeline (Priority: P2)

As a BuddhiAI Academy author, I want the voice-over workflow to generate narration directly from my local **Voicebox** server (`http://localhost:17493`) using my `"Buddhi"` voice profile—replacing Claude's ElevenLabs connector—and emit both word-level timing (`voice.json`) and WebVTT captions (`.vtt`) so that explainer videos are narrated in my own voice and ready for accessible web playback.

**Why this priority**: Educational explainers over ~30 seconds rely heavily on narration to anchor pacing and comprehension, and WebVTT captions are required for web accessibility (WCAG 2.2 AA). Removing the Claude-only ElevenLabs connector makes the voice workflow functional in Antigravity with zero cloud API fees.

**Independent Test**: Can be fully tested by creating a 2-line `pieces/<course>/<slug>/voice/script.json`, running the Voicebox generation helper against a running local Voicebox instance (or verifying `--scratch` fallback when Voicebox is stopped), running `voice.mjs` to produce `voice.wav` and `voice.json`, and confirming valid `.vtt` caption generation during export.

**Acceptance Scenarios**:

1. **Given** a local Voicebox server is running at `http://localhost:17493` with a voice profile named `"Buddhi"`, **When** the agent or author runs the voice generation step for `pieces/<course>/<slug>/voice/script.json`, **Then** the tool resolves the `"Buddhi"` profile via `GET /profiles`, generates one audio file per script line via `POST /generate`, and updates `script.json` line references cleanly.
2. **Given** per-line audio takes exist in `pieces/<course>/<slug>/voice/`, **When** `voice.mjs` runs, **Then** it concatenates pauses into `voice/voice.wav`, computes word-level timestamps in `voice.json` (via `faster-whisper` when installed, or duration estimates otherwise), and `build.mjs` injects `VOICE` into `index.html`.
3. **Given** a piece has `TIMELINE.narration` or `voice.json`, **When** `export.mjs` renders the final video, **Then** it outputs a WebVTT caption file (`renders/narration.vtt`) in addition to `renders/narration.srt` so the web player can load native closed captions.
4. **Given** the local Voicebox server is not running or `"Buddhi"` is unavailable, **When** the voice tool is invoked, **Then** it fails fast with a clear, actionable message (explaining how to start Voicebox or fall back to `--scratch` timing audio / manual recordings) without hanging or corrupting existing takes.

---

### User Story 3 - Accessible Astro `<ExplainerVideo />` Component & Publishing Flow (Priority: P3)

As a BuddhiAI Academy learner reading a tutorial lesson (`.mdx`), I want an embedded, accessible, zero-CLS explainer video player styled with BuddhiAI Academy's design system so that I can watch animated concept explanations with closed captions, keyboard controls, and readable transcripts in both Light and Dark mode.

**Why this priority**: Turning rendered MP4s into integrated, WCAG-compliant educational assets inside Astro MDX lessons completes the end-to-end value loop from video creation to learner experience.

**Independent Test**: Can be fully tested by publishing a rendered sample video + poster + `.vtt` track into `public/videos/<course>/`, embedding `<ExplainerVideo />` in a test/sample MDX lesson, running `pnpm astro check` and `pnpm build`, and verifying WCAG 2.2 AA contrast, keyboard navigation, caption rendering, and zero layout shift.

**Acceptance Scenarios**:

1. **Given** an approved explainer video in `pieces/<course>/<slug>/renders/`, **When** the author runs the publish step/script, **Then** the final web-optimized MP4 (`<slug>.mp4`), WebVTT captions (`<slug>.vtt`), and poster frame (`<slug>-poster.png`) are copied to `public/videos/<course>/` with a ready-to-paste `<ExplainerVideo />` MDX snippet.
2. **Given** an MDX lesson includes `<ExplainerVideo course="..." slug="..." title="..." />`, **When** the page renders in Light or Dark mode, **Then** the component renders a static Astro `<figure>` with a reserved `16:9` aspect-ratio container (zero CLS), `poster` image, native `<video controls preload="metadata">`, `<track kind="captions" default>` when captions exist, and optional expandable transcript.
3. **Given** a keyboard-only or screen-reader user interacts with `<ExplainerVideo />`, **When** navigating via Tab/Enter/Space, **Then** all interactive controls have visible `:focus-visible` terracotta rings (`#A7452A` light / `#E07A5F` dark), semantic ARIA labels/captions, and meet WCAG 2.2 AA contrast ratios (`>= 4.5:1` text, `>= 3.0:1` UI boundaries).

---

### User Story 4 - Custom Style Creation, Git Hygiene & Attribution (Priority: P4)

As a repository maintainer, I want custom reference-based style creation (`new-style.md`) preserved with strict `.gitignore` hygiene and proper upstream attribution in `ACKNOWLEDGEMENTS.md` so that large intermediate render frames and reference media never bloat the repository and upstream credit obeys project policy.

**Why this priority**: Prevents accidental commits of multi-hundred-megabyte frame sequences or third-party reference screenshots while keeping the workspace clean and compliant with `AGENTS.md`.

**Independent Test**: Can be tested by inspecting `.gitignore` against dummy files in `references/` and `pieces/**/frames/`, verifying `git status` ignores them, and confirming `ACKNOWLEDGEMENTS.md` credits the upstream Animate project while no lesson prose references `.ref/`.

**Acceptance Scenarios**:

1. **Given** a piece has been rendered in `pieces/<course>/<slug>/`, **When** `git status` is checked, **Then** transient render directories (`pieces/**/frames*/`, `pieces/**/review/`, `pieces/**/index.html`, `pieces/**/renders/final.mp4` or raw WAV stems) and `references/` are gitignored, while source files (`piece.json`, `brief.md`, `LOG.md`, `src/`, `voice/script.json`) remain trackable.
2. **Given** an author wants to match a custom visual look from external references, **When** following the adapted `new-style` reference doc, **Then** reference media is stored exclusively in gitignored `references/<look>/` and new reusable styles are saved under `styles/<name>/`.
3. **Given** the repository's attribution rules (`AGENTS.md`), **When** documentation and lesson files are audited, **Then** the upstream Animate project is credited in `ACKNOWLEDGEMENTS.md` and `.ref/` is never mentioned in lesson prose or learner-facing UI.

---

### Edge Cases

- **Missing local prerequisites**: What happens when Node `<18`, global/local `playwright` Chromium, `ffmpeg`, or Python `faster-whisper` is missing on Windows? The skill must check prerequisites upfront and print exact Windows-compatible install commands before failing.
- **Voicebox server unreachable or sandboxed**: Because Antigravity terminal commands run inside a network-isolated sandbox by default, calls to `http://localhost:17493` may be blocked inside the sandbox. The skill must document running the Voicebox fetch step outside the sandbox (or via an approved MCP/localhost path) and handle connection-refused errors cleanly.
- **Voicebox profile `"Buddhi"` not found**: If `/profiles` does not contain a profile named `"Buddhi"` (case-insensitive match), the tool must list the available profile names and exit with a non-zero status rather than silently picking an arbitrary voice.
- **Multi-format text overflow**: A `16:9` explainer adapted to `9:16` for Shorts/Reels may clip captions or overlap safe zones; `review.mjs --format <fmt>` must be run per exported format.
- **Missing captions or poster in `<ExplainerVideo />`**: If a music-only explainer has no `.vtt` file or poster image, `<ExplainerVideo />` must render gracefully without broken `<track>` tags or layout collapse.
- **Windows paths & filenames**: Tool scripts (`build.mjs`, `export.mjs`, `still.mjs`, `review.mjs`, `voice.mjs`) must handle Windows drive letters, backslashes, and spaces via `path.resolve` / `pathToFileURL` without relying on POSIX-only `/tmp` paths.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The adapted skill MUST reside at `.agents/skills/animate/` with a valid Google Antigravity `SKILL.md` (lowercase hyphenated `name: animate`, clear third-person trigger `description`, concise core procedure) and supporting subdirectories following `agy-customizations` progressive disclosure guidelines.
- **FR-002**: All Claude Code-specific instructions, paths, and tool names MUST be replaced with Google Antigravity equivalents:
  - `AskUserQuestion` → `ask_question`
  - `~/.claude/skills/animate` / `/plugin install` → `.agents/skills/animate/`
  - Claude Code parallel agent instructions → `invoke_subagent` / `run_workflow`
  - Claude ElevenLabs connector → local Voicebox (`http://localhost:17493`, default profile `"Buddhi"`)
- **FR-003**: The skill MUST preserve all 7 built-in styles (`cut-paper`, `crosshatch`, `riso`, `sketchbook`, `math`, `pixel`, `isometric`), core `kit/` modules, `grammar/` rules (`FORMATS.md`, `STORY.md`, `FRAME.md`), `templates/`, and `tools/` scripts with deterministic frame-by-frame canvas rendering.
- **FR-004**: The default intake and piece template configuration MUST target `16:9` landscape video (`1920x1080` or `1280x720`) for BuddhiAI Academy web lessons, while retaining multi-format support (`9:16`, `1:1`, `4:5`, `16:9`) when requested.
- **FR-005**: Source animation pieces MUST be organized by course and lesson slug under `pieces/<course>/<slug>/` (e.g., `pieces/python/variables/`), while still supporting arbitrary `pieces/<name>/` paths for standalone explainers.
- **FR-006**: The skill MUST enforce the gated approval workflow (Intake → Story Check → Look Check → Storyboard Check → Build → Deliver & Learn) and measured verification (`tile.mjs` determinism + `review.mjs` checks).
- **FR-007**: The voice-over pipeline MUST support generating per-line speech takes from a local Voicebox server (`http://localhost:17493`, configurable via `VOICEBOX_URL` env var) using profile `"Buddhi"` (configurable via `--profile` or `piece.json`), while retaining `--scratch` OS speech drafts, manual recordings, and `faster-whisper` word-level alignment.
- **FR-008**: The export pipeline MUST generate a WebVTT (`.vtt`) caption file whenever narration timing (`TIMELINE.narration` or `voice.json`) is present, in addition to `.srt`.
- **FR-009**: A publishing helper script MUST copy web-ready explainer deliverables (`<slug>.mp4`, optional `<slug>.vtt`, and `<slug>-poster.png`) from `pieces/<course>/<slug>/renders/` into `public/videos/<course>/` and print the corresponding MDX `<ExplainerVideo />` usage snippet.
- **FR-010**: The website MUST provide a static Astro component (`src/components/static/ExplainerVideo.astro`) usable in `.mdx` lessons that renders an HTML5 `<video>` player with poster frame, optional WebVTT captions track, optional collapsible transcript, and zero client-side JS overhead (preserving static/island separation per `AGENTS.md`).
- **FR-011 (Design System & Accessibility — WCAG 2.2 AA / EN 301 549)**: `<ExplainerVideo />` MUST adhere to `DESIGN.md` tokens (`#A7452A` light / `#E07A5F` dark primary focus accents, `#F7F5F0` / `#1E1E1E` surface framing, `1px` structural border, zero generic gradients) and `.agents/skills/a11y/SKILL.md` Standard (AA) requirements:
  - Fixed `16:9` aspect-ratio container (`aspect-video`) to guarantee zero Cumulative Layout Shift (CLS).
  - Native keyboard-operable video controls and visible `:focus-visible` indicator (`outline-2 outline-offset-2`).
  - Semantic `<figure>` + `<figcaption>`, descriptive `aria-label`, `<track kind="captions" srclang="en" label="English">`, and an accessible `<details>` transcript block when transcript text is provided.
  - Minimum `4.5:1` text contrast and `3.0:1` UI border/focus contrast in both Light and Dark modes (verified via `check_contrast` / `buddhi scripts verify-a11y`).
  - No `autoplay` with sound; `preload="metadata"` by default to protect Core Web Vitals (LCP).
- **FR-012**: `.gitignore` MUST exclude transient animation build/render artifacts (`references/`, `pieces/**/frames*/`, `pieces/**/review/`, `pieces/**/renders/*.wav`) so repository size stays lean while source definitions remain version-controlled.
- **FR-013**: `ACKNOWLEDGEMENTS.md` MUST credit the upstream Animate project (`cth9191/animate`, MIT License), and no learner-facing lesson prose or UI may reference `.ref/`.

### Key Entities

- **AnimationPiece (`pieces/<course>/<slug>/`)**: A self-contained procedural animation project comprising `piece.json` (metadata, style, format list, voice/music config), `brief.md`, `LOG.md`, `src/` (`head.html`, `scenes.js` or `era-*.js`, `bridges.js`, `score.js`), optional `voice/script.json`, and generated `renders/`.
- **StyleKit (`.agents/skills/animate/styles/<name>/` or `styles/<name>/`)**: A plug-in visual look comprising `STYLE.md`, `kit.js` (implementing the `STYLE` hook contract), `sample.png`, and `demo/`.
- **VoiceScript (`pieces/<course>/<slug>/voice/script.json`)**: Structured narration script (`lead`, `tail`, `profile`, `lines[]` with `id`, `text`, `after`, `file`) consumed by Voicebox generation and `voice.mjs` to produce `voice.wav`, `voice.json`, and WebVTT captions.
- **PublishedExplainer (`public/videos/<course>/<slug>.*`)**: The immutable web delivery bundle (`<slug>.mp4`, `<slug>-poster.png`, optional `<slug>.vtt`) referenced by `<ExplainerVideo />` in Astro MDX lessons.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Google Antigravity discovers `.agents/skills/animate/SKILL.md` with zero Claude-specific tool/path references remaining in skill documentation (`0` occurrences of `AskUserQuestion`, `~/.claude`, or Claude ElevenLabs connector instructions).
- **SC-002**: A `16:9` test explainer piece builds cleanly, passes determinism verification (`deterministic: true` via `tile.mjs`), exports a playable MP4 + poster + WebVTT captions, and passes `review.mjs` checks on Windows.
- **SC-003**: When Voicebox is running locally at `http://localhost:17493`, generating a multi-line narration script resolves profile `"Buddhi"`, produces playable audio takes for 100% of lines, and aligns timestamps into `voice.json` + `.vtt`.
- **SC-004**: Embedding `<ExplainerVideo />` in an Astro MDX lesson passes `pnpm astro check`, `pnpm build`, and `buddhi scripts verify-a11y` with zero errors, WCAG 2.2 AA contrast ratios (`>= 4.5:1` text / `>= 3.0:1` borders), and `0` CLS from the reserved `16:9` container.
- **SC-005**: Running `git status` after a full build/render/review cycle shows zero untracked intermediate frame PNGs, raw WAV stems, or `references/` media.

---

## Assumptions

- The author runs Google Antigravity on Windows 11 with Node 22+ (`package.json` engines `>=22.23.4`), and will have Playwright Chromium and `ffmpeg` available on PATH when rendering videos.
- The local Voicebox application (`https://docs.voicebox.sh/`) is installed on the author's machine, serves its FastAPI backend at `http://localhost:17493` when active, and contains a configured voice profile named `"Buddhi"`.
- Python with `faster-whisper` is optional: when installed it provides word-level audio alignment; when absent `voice.mjs` gracefully falls back to duration-based estimates.
- Published explainer MP4s are hosted directly as static assets under `public/videos/<course>/` for v1 (external CDN/object storage migration is out of scope for this feature).
- Only the 7 shipped styles from `.ref/animate` (plus the `new-style` workflow for future custom looks) are included in v1; creating a bespoke BuddhiAI Academy brand style is out of scope for this specification.
