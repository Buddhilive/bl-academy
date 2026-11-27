---
name: animate
description: Make deterministic procedural <canvas> explainer videos, histories, or concept shorts in code with synthesized scores, local Voicebox ("Buddhi") narration, WebVTT captions, and MP4 export. Ships with 7 styles (cut-paper, crosshatch, riso, sketchbook, math, pixel, isometric) and supports custom reference-matched styles. Use when the user asks to create an animated video, lesson explainer, concept visual, or reel in code.
---

# Animate (Google Antigravity Edition)

You create short, deterministic procedural `<canvas>` explainer videos in code: one self-contained `index.html`, drawn and scored procedurally frame by frame, rendered to MP4 via Playwright Chromium and `ffmpeg`, and publishable into BuddhiAI Academy MDX lessons via `<ExplainerVideo />`.

**Requirements (check first):** Run `pnpm animate:test` (or `pnpm animate:setup` to install missing Playwright/Chromium). Requires Node 18+, Playwright with Chromium (`npm i -g playwright && npx playwright install chromium`), and `ffmpeg` on PATH. For word-level voice timing, Python with `faster-whisper` (`pip install faster-whisper`); without it, word timings are estimated. For narrated explainers, local **Voicebox** (`http://localhost:17493`, profile `"Buddhi"`) or `--scratch` / user recordings.

All skill paths below (`kit/`, `styles/`, `templates/`, `references/`, `tools/`) are relative to `.agents/skills/animate/`. Source pieces live in `.buddhi/.buddhi/pieces/<course>/<slug>/` (or `.buddhi/pieces/<name>/` for standalone pieces); published web deliverables go to `public/videos/<course>/`; custom project styles live in `.buddhi/styles/<name>/` (or `styles/<name>/`).

## Non-Negotiables

1. **No animating before the storyboard is approved.** Enforce Intake → Story Check → Look Check → Storyboard Check before full scene animation.
2. **Inspect references before drawing anything** — the user's references, or the style's `sample.png` and `demo/`. Check every key frame against [FRAME.md](grammar/FRAME.md) and the style's `STYLE.md` checklist.
3. **Verify factual claims with `search_web`** and record sources in `brief.md`. Never claim "first" without a source.
4. **Single file, all code:** `tools/build.mjs` enforces zero external URLs and zero `data:` URIs in authored code. Only two opt-in local exceptions exist: `<piece>/assets/` (screenshots/logos embedded at build) and `<piece>/audio/` (user music track muxed at export).
5. **Deterministic:** use seeded `RNG(...)` and boil index `B` only — never `Math.random()` or wall-clock time.
6. **Reference media stays local and gitignored** (`references/<look>/`). Never commit it, copy its code, or mention `.ref/` in lesson prose.
7. **"Done" is measured:** `tools/tile.mjs` prints `deterministic: true` and `tools/review.mjs` passes; inspect contact sheets and report measured numbers.
8. **Ask with options:** use Antigravity's `ask_question` tool with a recommended default first.

## The Workflow

### 0. Intake
Ask only the questions from [references/intake.md](references/intake.md) you cannot infer from the prompt. Default to **16:9 (`1920x1080`)** for BuddhiAI Academy web lessons (multi-format `16:9,9:16,1:1` optional). To show the style gallery, run `node .agents/skills/animate/tools/gallery.mjs <out.png> [styles]` and show it.

### 1. Story Check (Text, Fast)
Pick the format from [FORMATS.md](grammar/FORMATS.md) and read [STORY.md](grammar/STORY.md) and [references/craft.md](references/craft.md). Fact-check claims with `search_web`, then present:
- One-line idea and visual device ("the spark gains a ray each era and ends as the answer")
- Format and rationale, style, length, BPM
- Numbered beat table: time, what happens, bridge into the next beat, and sound role (silence + loudest hit)

Ask via `ask_question`: **Approve / Change beats / Different angle**.

### 2. Look Check (2–4 Style Frames)
Scaffold `.buddhi/pieces/<course>/<slug>/`: copy `piece.json` and `src/` from `styles/<name>/demo/`, `templates/beat-cut/`, or `templates/piece/` (which defaults to `16:9`), then write `brief.md` and `LOG.md` fresh. For custom references, follow [references/new-style.md](references/new-style.md).

Draw 2–4 contrasting beats as full-size frames, render them side-by-side with `node .agents/skills/animate/tools/still.mjs .buddhi/pieces/<course>/<slug> 2.25,9.75,16.5 look.png --scale 0.5`, and ask via `ask_question`: **Thumbs up per frame / Change the look / Try another style**.

### 3. Storyboard Check (Every Beat)
Fill `TIMELINE.board` with one key time per beat (`{ t, title, sound, next }`), render with `node .agents/skills/animate/tools/storyboard.mjs .buddhi/pieces/<course>/<slug>`, and get thumbs up/down per panel before animating.

### 4. Build, Export & Review
1. Write `.buddhi/pieces/<course>/<slug>/brief.md` and keep `LOG.md`.
2. Animate scenes in `src/scenes.js` (or `src/era-*.js` via parallel `invoke_subagent` / `run_workflow` for pieces >30s) and wire transitions in `src/bridges.js`.
3. Build: `node .agents/skills/animate/tools/build.mjs .buddhi/pieces/<course>/<slug>`
4. Verify determinism & transitions: `node .agents/skills/animate/tools/tile.mjs .buddhi/pieces/<course>/<slug> tile.png <frames...>`
5. Score in `src/score.js`.
6. Export MP4 + WebVTT captions: `node .agents/skills/animate/tools/export.mjs .buddhi/pieces/<course>/<slug> --share` (`--formats 16:9,9:16,1:1` for multi-format, `--blur 4` for 1s styles, `--only-audio` to iterate audio fast).
7. Measure & inspect: `node .agents/skills/animate/tools/review.mjs .buddhi/pieces/<course>/<slug>` — fix until text, cut grid, arc, and loudness pass, and log a per-shot PASS table in `LOG.md`.

### 5. Publish to BuddhiAI Academy & Deliver
For web lesson explainers, run:
```powershell
node .agents/skills/animate/tools/publish.mjs .buddhi/pieces/<course>/<slug> <course> <slug>
```
This copies `<slug>.mp4`, `<slug>.vtt` (if present), and `<slug>-poster.png` to `public/videos/<course>/` and prints the `<ExplainerVideo />` MDX snippet. Summarize the measured review numbers, weakest shot, and unverified audio listening check for the user.

### 6. Learn
Append lessons learned to `.buddhi/pieces/<course>/<slug>/LOG.md`. Propose any new durable rule for `references/craft.md` or `STYLE.md`.

## Optional Capabilities

### Voice-Over (Local Voicebox `"Buddhi"` + `voice.mjs`)
When narrated, **the voice is the clock**: each beat starts ~0.3s after the previous line ends, and payoff hits land in a pause *before* the line that names them.
1. Write `.buddhi/pieces/<course>/<slug>/voice/script.json`:
   `{ "lead": 1.2, "tail": 1.8, "profile": "Buddhi", "lines": [{ "id": "open", "text": "As it is spoken.", "after": 0.45 }] }`
2. **Timing draft before recording:** `node .agents/skills/animate/tools/voice.mjs .buddhi/pieces/<course>/<slug> --scratch`
3. **Generate with local Voicebox** (ensure Voicebox desktop/server is running at `http://localhost:17493`; run with `BypassSandbox: true` in Antigravity so localhost HTTP is reachable):
   ```powershell
   node .agents/skills/animate/tools/voicebox.mjs .buddhi/pieces/<course>/<slug> --profile Buddhi
   ```
   Or place manual recordings as `voice/<id>.wav` / `.mp3`.
4. **Align words & build WAV:** `node .agents/skills/animate/tools/voice.mjs .buddhi/pieces/<course>/<slug>` → writes `voice/voice.wav` and `voice.json` (injected as `VOICE` by `build.mjs`).
5. Set `"voice": { "file": "voice/voice.wav", "music": -12 }` in `piece.json`. `export.mjs` ducks music under speech, normalizes to `-14 LUFS`, and emits `renders/narration.srt` + `renders/narration.vtt`.

### User Music Track, Product Assets, Multi-Format & Parallel Subagents
- **Music track:** `node .agents/skills/animate/tools/beats.mjs .buddhi/pieces/<course>/<slug>/audio/track.wav .buddhi/pieces/<course>/<slug> --start 12 --dur <len>` → `beats.json` (`BEATS` + `onBeat(t)`).
- **Real product screenshots:** `node .agents/skills/animate/tools/capture.mjs <url> .buddhi/pieces/<course>/<slug>/assets/home.png` → draw via `drawAsset(...)`.
- **Parallel scenes (>30s):** Split into `src/era-01.js`, `src/era-02.js`, … listed in `piece.json` `"scenes": [...]`, and dispatch one `invoke_subagent` worker per era with `STYLE.md`, time range, cues, and bridge objects while keeping `src/head.html`, `src/bridges.js`, and `src/score.js` coordinator-owned.

## Reference Index

| Path | Purpose | Read When |
|---|---|---|
| [references/intake.md](references/intake.md) | Intake questions and `16:9` defaults | Step 0 |
| [references/craft.md](references/craft.md) | Story, frame, motion, timing, sound, review rules | Before Step 1 & building |
| [references/new-style.md](references/new-style.md) | Creating a custom style from user references | Step 2 (custom look) |
| [grammar/FORMATS.md](grammar/FORMATS.md) | 8 story formats and invariants | Step 1 |
| [grammar/STORY.md](grammar/STORY.md) | Beat-level story rules | Step 1 |
| [grammar/FRAME.md](grammar/FRAME.md) | Universal key-frame checklist | Steps 2–3 |
| [styles/README.md](styles/README.md) | 7 shipped styles and `STYLE` hook contract | Steps 0, 2, building |
| `kit/` & `tools/` | Deterministic canvas kit, audio synth, build/export/review scripts | Throughout |
