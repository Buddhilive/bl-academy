#!/usr/bin/env node
// Setup & verification helper for the Animate explainer video pipeline.
//   pnpm animate:setup  -> installs missing Playwright/Chromium and runs the full check + smoke test
//   pnpm animate:test   -> checks prerequisites, Voicebox ("Buddhi"), and runs a build/render smoke test
//   flags: --install (install missing Playwright/Chromium), --test (run smoke test), --with-whisper (pip install faster-whisper)
import { execSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const argv = process.argv.slice(2);
const doInstall = argv.includes('--install');
const doTest = argv.includes('--test') || !doInstall;
const withWhisper = argv.includes('--with-whisper');

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = path.resolve(HERE, '..');
const require = createRequire(import.meta.url);

const results = [];
const record = (name, status, detail) => {
  results.push({ name, status, detail });
  const icon = status === 'PASS' ? '✅' : status === 'WARN' ? '⚠️' : '❌';
  console.log(`${icon} ${name}: ${detail}`);
};

function runCmd(cmd, args, opts = {}) {
  const bin = process.platform === 'win32' && (cmd === 'npm' || cmd === 'npx') ? `${cmd}.cmd` : cmd;
  return spawnSync(bin, args, { encoding: 'utf8', ...opts });
}

function loadPlaywright() {
  try {
    return require('playwright');
  } catch {
    try {
      const root = execSync('npm root -g', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
      return require(path.join(root, 'playwright'));
    } catch {
      return null;
    }
  }
}

console.log('=== Animate Setup & Readiness Check ===\n');

// 1. Node.js >= 18
const major = Number(process.versions.node.split('.')[0]);
if (major >= 18) {
  record('Node.js', 'PASS', `v${process.versions.node}`);
} else {
  record('Node.js', 'FAIL', `v${process.versions.node} found; Node 18+ required`);
}

// 2. ffmpeg on PATH
const ff = runCmd('ffmpeg', ['-version']);
if (ff.status === 0) {
  const firstLine = (ff.stdout || '').split(/\r?\n/)[0].trim();
  record('ffmpeg', 'PASS', firstLine || 'available');
} else {
  const hint = process.platform === 'win32'
    ? 'missing on PATH (install via `winget install Gyan.FFmpeg`)'
    : 'missing on PATH (install via brew/apt)';
  record('ffmpeg', 'FAIL', hint);
}

// 3. Playwright + Chromium
let pw = loadPlaywright();
let chromiumOk = pw ? fs.existsSync(pw.chromium.executablePath()) : false;

if ((!pw || !chromiumOk) && doInstall) {
  console.log('\nInstalling Playwright & Chromium globally...');
  if (!pw) {
    const r1 = runCmd('npm', ['i', '-g', 'playwright'], { stdio: 'inherit' });
    if (r1.status !== 0) console.error('Failed to install global playwright.');
    pw = loadPlaywright();
  }
  if (pw && !fs.existsSync(pw.chromium.executablePath())) {
    const r2 = runCmd('npx', ['playwright', 'install', 'chromium'], { stdio: 'inherit' });
    if (r2.status !== 0) console.error('Failed to install Playwright Chromium.');
  }
  chromiumOk = pw ? fs.existsSync(pw.chromium.executablePath()) : false;
}

if (pw && chromiumOk) {
  record('Playwright + Chromium', 'PASS', pw.chromium.executablePath());
} else if (pw && !chromiumOk) {
  record('Playwright + Chromium', 'FAIL', 'playwright installed, Chromium binary missing (run `npx playwright install chromium` or `pnpm animate:setup`)');
} else {
  record('Playwright + Chromium', 'FAIL', 'missing (run `pnpm animate:setup` or `npm i -g playwright && npx playwright install chromium`)');
}

// 4. Optional Python faster-whisper
const pyBin = process.platform === 'win32' ? 'python' : 'python3';
let fw = runCmd(pyBin, ['-c', 'import faster_whisper; print("ok")']);
if (fw.status !== 0 && doInstall && withWhisper) {
  console.log('\nInstalling faster-whisper...');
  runCmd(pyBin, ['-m', 'pip', 'install', 'faster-whisper'], { stdio: 'inherit' });
  fw = runCmd(pyBin, ['-c', 'import faster_whisper; print("ok")']);
}
if (fw.status === 0) {
  record('faster-whisper (optional)', 'PASS', 'installed (word-level audio alignment enabled)');
} else {
  record('faster-whisper (optional)', 'WARN', 'not installed (word timings will be estimated; install with `pip install faster-whisper`)');
}

// 5. Optional local Voicebox ("Buddhi")
const voiceboxUrl = process.env.VOICEBOX_URL || 'http://localhost:17493';
try {
  const res = await fetch(`${voiceboxUrl.replace(/\/$/, '')}/profiles`, { signal: AbortSignal.timeout(3000) });
  if (res.ok) {
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.profiles || []);
    const hasBuddhi = list.some((p) => String(p.name || p.title || '').trim().toLowerCase() === 'buddhi');
    if (hasBuddhi) {
      record('Voicebox (optional)', 'PASS', `reachable at ${voiceboxUrl} with profile "Buddhi"`);
    } else {
      const names = list.map((p) => p.name || p.title).filter(Boolean).join(', ') || 'none';
      record('Voicebox (optional)', 'WARN', `reachable at ${voiceboxUrl}, but profile "Buddhi" not found (available: ${names})`);
    }
  } else {
    record('Voicebox (optional)', 'WARN', `HTTP ${res.status} at ${voiceboxUrl}`);
  }
} catch {
  record('Voicebox (optional)', 'WARN', `not reachable at ${voiceboxUrl} (start Voicebox app for narration, or use --scratch)`);
}

// 6. Smoke test (build + deterministic tile check when Playwright is ready)
if (doTest) {
  console.log('\nRunning smoke test on styles/math/demo...');
  const demoDir = path.join(SKILL_DIR, 'styles', 'math', 'demo');
  const builtHtml = path.join(demoDir, 'index.html');
  const tmpTile = path.join(os.tmpdir(), `animate-smoke-${Date.now()}.png`);

  try {
    const b = runCmd(process.execPath, [path.join(HERE, 'build.mjs'), demoDir]);
    if (b.status === 0) {
      record('Smoke: build.mjs', 'PASS', 'built styles/math/demo/index.html cleanly');
    } else {
      record('Smoke: build.mjs', 'FAIL', (b.stderr || b.stdout || 'build failed').trim());
    }

    if (b.status === 0 && pw && chromiumOk) {
      const t = runCmd(process.execPath, [path.join(HERE, 'tile.mjs'), demoDir, tmpTile, '12', '48']);
      const out = `${t.stdout || ''}\n${t.stderr || ''}`;
      if (t.status === 0 && /deterministic:\s*true/i.test(out)) {
        record('Smoke: tile.mjs', 'PASS', 'rendered frames and verified deterministic: true');
      } else {
        record('Smoke: tile.mjs', 'FAIL', out.trim() || 'tile render failed');
      }
    } else if (b.status === 0) {
      record('Smoke: tile.mjs', 'WARN', 'skipped (Playwright + Chromium required for headless frame test)');
    }
  } finally {
    if (fs.existsSync(builtHtml)) fs.rmSync(builtHtml, { force: true });
    if (fs.existsSync(tmpTile)) fs.rmSync(tmpTile, { force: true });
  }
}

const failed = results.filter((r) => r.status === 'FAIL');
console.log(`\nSummary: ${results.length - failed.length}/${results.length} checks passed or warned; ${failed.length} failed.`);
process.exit(failed.length ? 1 : 0);
