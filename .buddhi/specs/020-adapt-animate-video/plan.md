# Implementation Plan: Adapt Animate Video Skills & Explainer Workflow for Google Antigravity

**Branch**: `020-adapt-animate-video` | **Date**: 2026-11-26 | **Spec**: [spec.md](file:///c:/DevDojo/Buddhi/bl-academy/.buddhi/specs/020-adapt-animate-video/spec.md)

**Input**: Feature specification from `.buddhi/specs/020-adapt-animate-video/spec.md`

---

## Summary

Adapt the `.ref/animate` procedural `<canvas>` animation skill into `.agents/skills/animate/` following Google Antigravity's customization guidelines (`agy-customizations`), replace all Claude Code-specific primitives (`AskUserQuestion`, `~/.claude/`, ElevenLabs connector) with Antigravity equivalents (`ask_question`, `invoke_subagent` / `run_workflow`, local **Voicebox** at `http://localhost:17493` with voice profile `"Buddhi"`), default lesson explainers to `16:9` (`1920x1080`) under `pieces/<course>/<slug>/`, add WebVTT (`.vtt`) caption export and a publishing helper to `public/videos/<course>/`, and build a zero-JS, WCAG 2.2 AA accessible `<ExplainerVideo />` Astro static component (`src/components/static/ExplainerVideo.astro`) aligned with `DESIGN.md`.

---

## Technical Context

**Language/Version**: Node.js `>=22.23.4` (ESM `.mjs` tools + client-side ES2022 `<canvas>`), Astro `^7.4.4`, TypeScript `^5.9.3`, Tailwind CSS `^3.4.19`, Python 3 (optional `faster-whisper`)

**Primary Dependencies**:
- Runtime/Rendering (local authoring): `playwright` (Chromium), `ffmpeg` (on PATH), local Voicebox FastAPI server (`http://localhost:17493`)
- Website (Astro SSG): zero new npm dependencies; uses existing Astro + Tailwind CSS

**Storage**: File-based (`pieces/<course>/<slug>/` for source & renders; `public/videos/<course>/` for published MP4/VTT/poster; `styles/<name>/` for project-local custom styles; `references/<look>/` gitignored)

**Testing**:
- Skill/Pipeline: `node .agents/skills/animate/tools/build.mjs`, `tile.mjs` (`deterministic: true`), `export.mjs`, `review.mjs`, `voice.mjs` (`--scratch` and Voicebox modes)
- Website/A11Y: `pnpm astro check`, `pnpm build`, `buddhi scripts verify-a11y`, `check_contrast` MCP tool

**Target Platform**: Windows 11 authoring environment (PowerShell / Node) + Static Web (Astro SSG)

**Project Type**: Agent Skill + CLI Media Pipeline + Static Astro Component

**Performance Goals**:
- Deterministic 24fps canvas rendering (`tile.mjs` pixel-identical hash check)
- Zero Cumulative Layout Shift (`0` CLS) in `<ExplainerVideo />` via `aspect-video` reservation
- `preload="metadata"` on `<video>` to avoid blocking LCP

**Constraints**:
- Single-file self-contained `index.html` per animation piece (no external URLs or `data:` URIs in authored scene code; only `<piece>/assets/` embedded by `build.mjs`)
- Zero Node/server-side execution in website runtime (`AGENTS.md` principle #4)
- Zero `.ref/` mentions in lesson prose or learner-facing UI (`AGENTS.md` principle #1)
- Localhost Voicebox (`http://localhost:17493`) requires `BypassSandbox: true` when invoked from Antigravity's network-isolated terminal sandbox

**Scale/Scope**: 1 workspace skill (`.agents/skills/animate/` with 7 built-in styles, 3 templates, 1 example, ~15 Node/Python tools), 1 Astro static component, `.gitignore` updates, and `ACKNOWLEDGEMENTS.md` attribution

---

## AGENTS.md & DESIGN.md Compliance Check

*GATE: Verified against `AGENTS.md`, `DESIGN.md`, `.agents/rules/a11y.md`, and `.agents/rules/buddhilive-academy.md`.*

- [x] **Project build & test commands adhered to**: `pnpm astro check` and `pnpm build` remain the website verification gates; no new npm packages required.
- [x] **Zero-backend browser execution**: `<ExplainerVideo />` is a pure static Astro component (`/src/components/static/ExplainerVideo.astro`) with zero client-side JS islands or server dependencies.
- [x] **Attribution & `.ref/` isolation**: Upstream Animate (`cth9191/animate`, MIT) is credited exclusively in `ACKNOWLEDGEMENTS.md`. No lesson `.mdx` or UI component references `.ref/`.
- [x] **DESIGN.md tokens & Light/Dark fidelity**: Uses `#A7452A` (light) / `#E07A5F` (dark) focus accents, `stone-50`/`#F7F5F0` & `neutral-900`/`#1E1E1E` surfaces, `1px` borders (`border-stone-300 dark:border-stone-700`), and zero generic gradients.

---

## Architectural Evaluation (Multi-Angle Lenses)

1. **Fewest-Slices**:
   - **Slice 1 (MVP)**: Port `.ref/animate/plugins/animate/skills/animate/` to `.agents/skills/animate/` with Antigravity-adapted docs (`SKILL.md`, `references/intake.md`, `references/craft.md`, `references/new-style.md`), `16:9` default in `templates/piece/` & `templates/beat-cut/`, and verified Windows execution of `build.mjs` / `tile.mjs` / `export.mjs` / `review.mjs`.
   - **Slice 2**: Add `tools/voicebox.mjs` (local Voicebox `GET /profiles` + `POST /generate` for `"Buddhi"`), update `voice.mjs` docs, and add `.vtt` WebVTT emission to `export.mjs`.
   - **Slice 3**: Add `tools/publish.mjs` + `src/components/static/ExplainerVideo.astro` + `.gitignore` + `ACKNOWLEDGEMENTS.md`.
2. **Risk-First**:
   - *Sandbox Network Isolation*: Antigravity's `run_command` blocks `localhost:17493` by default. `voicebox.mjs` will fail fast with a 5s timeout and explicit instructions to run with `BypassSandbox: true` (or fall back to `voice.mjs --scratch`).
   - *Large Binary Bloat*: Rendering 24fps PNG frames and WAV stems creates hundreds of MBs. `.gitignore` rules must land before any test render runs.
   - *Windows Path / Font Handling*: Existing `review.mjs` and `still.mjs` already use `pathToFileURL` and `C:/Windows/Fonts/consolab.ttf`; `publish.mjs` and `voicebox.mjs` will use `node:path` and `pathToFileURL` exclusively (zero `/tmp` assumptions).
3. **Seam-Quality**:
   - The skill (`SKILL.md` + `references/` + `tools/`) is completely decoupled from Astro (`src/components/static/ExplainerVideo.astro`) via the clean `public/videos/<course>/<slug>.{mp4,vtt,-poster.png}` artifact boundary.

---

## Accessibility Strategy (`a11y` Standard AA)

Per `.agents/skills/a11y/SKILL.md` and `references/guide-media.md`:

- **Media Classification**: Explainer videos are **Informative** media (SC 1.2.2 Captions, SC 1.2.3/1.2.8 Transcript).
- **Semantic Structure**:
  - `<figure class="not-prose my-6 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-neutral-900 overflow-hidden">`
  - `<div class="aspect-video w-full bg-neutral-950">` reserving exact `16:9` geometry (zero CLS).
  - Native `<video controls preload="metadata" poster={posterUrl} aria-label={title} class="h-full w-full">` (never `autoplay`, always keyboard-operable).
  - Optional `<track kind="captions" src={captionsUrl} srclang={lang} label={captionsLabel} default />` when captions exist.
  - `<figcaption>` with title/description and optional `<details>` expandable transcript for screen-reader and text-first learners.
- **Focus & Tap Targets**:
  - `<summary>` transcript toggle and any action links use `min-h-[44px]` and `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7452A] dark:focus-visible:ring-[#E07A5F] focus-visible:ring-offset-2`.
- **Contrast Verification (measured via `check_contrast` MCP)**:
  - Light surface `#F7F5F0` + `#1C1917` text: **16.05:1** (PASS >= 4.5:1)
  - Light surface `#F7F5F0` + `#57534E` muted text: **7.00:1** (PASS >= 4.5:1)
  - Dark surface `#1E1E1E` + `#F5F5F4` text: **15.28:1** (PASS >= 4.5:1)
  - Dark surface `#1E1E1E` + `#A8A29E` muted text: **6.61:1** (PASS >= 4.5:1)
  - Light primary `#A7452A` on `#FFFFFF`: **5.95:1** (PASS >= 4.5:1)
  - Dark primary `#E07A5F` on `#121212`: **6.35:1** (PASS >= 4.5:1)
- **Verification Gate**: Run `buddhi scripts verify-a11y` via `terminal-runner` after implementing `ExplainerVideo.astro` and record evidence in `REPORT.md` / `A11Y-DECISIONS.md` if applicable.

---

## Security & Git Hygiene Strategy

- **Voicebox Client (`tools/voicebox.mjs`)**:
  - Restrict `VOICEBOX_URL` (default `http://localhost:17493`) to `http:` / `https:` schemes via `new URL(...)`.
  - Use `fetch` with `AbortSignal.timeout(15000)` and JSON body serialization (no shell interpolation).
  - Validate `script.json` line `id` values against `/^[a-zA-Z0-9_-]+$/` before writing audio files into `<piece>/voice/`.
- **Astro Component (`ExplainerVideo.astro`)**:
  - Validate `course` and `slug` props against `/^[a-z0-9-]+$/i` (or strip unsafe `..` segments) when constructing `/videos/${course}/${slug}.mp4` URLs.
- **Git Hygiene (`.gitignore`)**:
  - Ignore `references/`, `pieces/**/frames*/`, `pieces/**/review/`, `pieces/**/index.html`, `pieces/**/renders/*.wav`, `pieces/**/renders/final*.mp4`, `pieces/**/renders/share*.mp4`, `pieces/**/voice/*.scratch.wav`, and `pieces/**/voice/voice.wav`.
  - Keep `pieces/**/piece.json`, `brief.md`, `LOG.md`, `src/`, `voice/script.json`, and `public/videos/` trackable.

---

## Project Structure

### Documentation (this feature)

```text
.buddhi/specs/020-adapt-animate-video/
├── spec.md              # Feature specification (/specify output)
├── plan.md              # This file (/spec-plan output)
└── tasks.md             # Phase 2 output (/spec-tasks output)
```

### Source Code (repository root)

```text
.agents/skills/animate/
├── SKILL.md                     # Antigravity-native entrypoint (progressive disclosure)
├── references/
│   ├── intake.md                # Adapted intake (ask_question, 16:9 default, Voicebox)
│   ├── craft.md                 # Adapted craft rules (Voicebox pause timing, 16:9 notes)
│   └── new-style.md             # Adapted custom style creation from references
├── grammar/
│   ├── FORMATS.md
│   ├── FRAME.md
│   └── STORY.md
├── kit/                         # core.js, morph.js, board.js, score-head.js, score-tail.js
├── styles/                      # 7 built-in styles (cut-paper, crosshatch, riso, sketchbook, math, pixel, isometric)
├── templates/
│   ├── piece/                   # Updated to default 16:9 (1920x1080)
│   ├── beat-cut/                # Updated to default 16:9 (1920x1080)
│   └── style/
├── examples/
│   └── history-of-ai/
└── tools/
    ├── build.mjs
    ├── tile.mjs
    ├── still.mjs
    ├── storyboard.mjs
    ├── export.mjs               # Enhanced to also emit renders/narration.vtt
    ├── review.mjs
    ├── voice.mjs                # Updated docs/comments for Voicebox
    ├── voicebox.mjs             # NEW: Local Voicebox (localhost:17493, "Buddhi") generator
    ├── publish.mjs              # NEW: Copy MP4 + VTT + poster to public/videos/<course>/
    ├── voice_words.py
    ├── beats.mjs
    ├── capture.mjs
    ├── compare.mjs
    ├── framehash.mjs
    ├── gallery.mjs
    ├── gpu.mjs
    ├── textcheck.mjs
    └── measure/

src/components/static/
└── ExplainerVideo.astro         # NEW: Static, zero-CLS, WCAG 2.2 AA video player for MDX

.gitignore                       # Updated with references/ and pieces/**/ transient render ignores
ACKNOWLEDGEMENTS.md              # Updated with upstream cth9191/animate (MIT) attribution
```

**Structure Decision**: The skill lives entirely under `.agents/skills/animate/` so Google Antigravity discovers it automatically via workspace customization traversal, while `src/components/static/ExplainerVideo.astro` integrates rendered outputs (`public/videos/<course>/`) into Astro MDX lessons with zero client-side JS overhead.

---

## Complexity Tracking

No `AGENTS.md` or `DESIGN.md` violations or architectural trade-offs requiring exceptions.
