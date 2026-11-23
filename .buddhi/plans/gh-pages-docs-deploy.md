# Implementation Plan: GitHub Pages `/docs` Deployment Configuration

## Goal
Configure the Astro build to output static site artifacts into `./docs` for GitHub Pages deployment from the `/docs` folder, retain `CNAME` (`academy.buddhilive.com`) across builds, and prevent Jekyll from stripping `_astro/` assets—without adding a GitHub Actions workflow.

## Context & Grounding
- [astro.config.mjs](file:///c:/DevDojo/Buddhi/bl-academy/astro.config.mjs#L12-L28): Sets `site: 'https://academy.buddhilive.com'` (line 13) and `sitemap()` (line 17); currently has no `outDir` (defaults to `dist/`).
- [package.json](file:///c:/DevDojo/Buddhi/bl-academy/package.json#L8-L13): `build` runs `astro build` and `preview` runs `astro preview`.
- [public/robots.txt](file:///c:/DevDojo/Buddhi/bl-academy/public/robots.txt#L1-L4): References `https://academy.buddhilive.com/sitemap-index.xml`.
- [src/layouts/Layout.astro](file:///c:/DevDojo/Buddhi/bl-academy/src/layouts/Layout.astro#L22-L35): Resolves canonical/OG URLs against `Astro.site` and references `/favicon.ico` at root (`base: '/'`).
- [src/hooks/usePyodide.ts](file:///c:/DevDojo/Buddhi/bl-academy/src/hooks/usePyodide.ts#L31): Bundles `pyodide.worker.ts` via `new URL('../workers/pyodide.worker.ts', import.meta.url)` into `_astro/`.
- [.gitignore](file:///c:/DevDojo/Buddhi/bl-academy/.gitignore#L1-L27): Ignores `dist/` (line 2), `.astro/` (line 5), `node_modules/` (line 8), `.env*` (lines 17–18), and `.buddhi/docs-plan.json` (line 27). `docs/` is not ignored and is currently empty.

## Ordered Implementation Steps

1. **Configure Astro output directory in [astro.config.mjs](file:///c:/DevDojo/Buddhi/bl-academy/astro.config.mjs)**
   - Add `outDir: './docs'` to `defineConfig({...})` (line 12).
   - Keep `site: 'https://academy.buddhilive.com'` (line 13) and default `base: '/'` so canonical links, `sitemap-index.xml`, and root-relative paths (`/favicon.ico`, `/_astro/...`) resolve correctly under the custom domain.

2. **Add `CNAME` retention via `public/CNAME`**
   - Create [public/CNAME](file:///c:/DevDojo/Buddhi/bl-academy/public/CNAME) containing:
     ```text
     academy.buddhilive.com
     ```
   - Because Astro cleans `outDir` on rebuild and copies `public/` verbatim into `outDir`, placing `CNAME` in `public/` guarantees `docs/CNAME` is retained on every `pnpm build`.

3. **Disable Jekyll processing via `public/.nojekyll`**
   - Create an empty [public/.nojekyll](file:///c:/DevDojo/Buddhi/bl-academy/public/.nojekyll) file.
   - Astro copies it to `docs/.nojekyll` on every build so GitHub Pages serves `_astro/` (CSS, JS, and Pyodide Web Worker bundles) without Jekyll filtering underscore-prefixed directories.

4. **Verify Git tracking and `.gitignore`**
   - Keep [.gitignore](file:///c:/DevDojo/Buddhi/bl-academy/.gitignore) as-is (`dist/` remains ignored; `docs/` remains tracked).
   - Note: `AGENTS.md` mentions `Ground Python lessons in /docs`, which is currently empty; `/docs` will now hold the generated GitHub Pages build output.

5. **Run build to populate `./docs`**
   - Run `pnpm build` so `./docs` is populated with `index.html`, `CNAME`, `.nojekyll`, `robots.txt`, `ads.txt`, `sitemap-index.xml`, `sitemap-0.xml`, and `_astro/`.

## Files to Create / Modify
- Modify: [astro.config.mjs](file:///c:/DevDojo/Buddhi/bl-academy/astro.config.mjs) (`outDir: './docs'`)
- Create: [public/CNAME](file:///c:/DevDojo/Buddhi/bl-academy/public/CNAME) (`academy.buddhilive.com`)
- Create: [public/.nojekyll](file:///c:/DevDojo/Buddhi/bl-academy/public/.nojekyll) (empty file)
- Generated on build: `docs/` (static site output ready to commit for GitHub Pages)

## Verification Plan
1. **Typecheck & Schema Validation**:
   - Run `pnpm astro check` and confirm 0 errors.
2. **Build & Output Verification**:
   - Run `pnpm build` and verify exit code `0`.
   - Confirm `./docs` contains `CNAME` (content `academy.buddhilive.com`), `.nojekyll`, `index.html`, `robots.txt`, `ads.txt`, `sitemap-index.xml`, and `_astro/`.
3. **CNAME & `.nojekyll` Retention Across Rebuilds**:
   - Run `pnpm build` a second time and verify `docs/CNAME` and `docs/.nojekyll` are still present.
4. **Local Preview**:
   - Run `pnpm preview` (which serves from `outDir`, i.e., `./docs`) and verify the home page and a lesson page render with working `_astro/` assets.
