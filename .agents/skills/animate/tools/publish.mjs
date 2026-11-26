#!/usr/bin/env node
// Publish a rendered explainer piece into public/videos/<course>/ for BuddhiAI Academy MDX lessons.
//   usage: node tools/publish.mjs pieces/<course>/<slug> <course> <slug> [--poster-time 1.5] [--share]
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const argv = process.argv.slice(2);
const opt = (k, d) => {
  const i = argv.indexOf(k);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};
const flag = (k) => argv.includes(k);

const positional = argv.filter((a, i) => !a.startsWith('--') && argv[i - 1] !== '--poster-time');
if (positional.length < 3) {
  console.error('usage: node tools/publish.mjs <piece dir> <course> <slug> [--poster-time 1.5] [--share]');
  process.exit(2);
}

const [pieceArg, course, slug] = positional;
if (!/^[a-z0-9-]+$/i.test(course) || !/^[a-z0-9-]+$/i.test(slug)) {
  console.error('course and slug must contain only letters, numbers, and hyphens');
  process.exit(2);
}

const ROOT = path.resolve(pieceArg);
const RENDERS = path.join(ROOT, 'renders');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, '../../../..');
const OUT_DIR = path.join(REPO_ROOT, 'public', 'videos', course);

const srcMp4 = path.join(RENDERS, flag('--share') ? 'share.mp4' : 'final.mp4');
if (!fs.existsSync(srcMp4)) {
  console.error(`missing rendered video: ${srcMp4} (run export.mjs first)`);
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const destMp4 = path.join(OUT_DIR, `${slug}.mp4`);
fs.copyFileSync(srcMp4, destMp4);
console.log(`copied ${path.relative(REPO_ROOT, destMp4)}`);

const srcVtt = path.join(RENDERS, 'narration.vtt');
let hasCaptions = false;
if (fs.existsSync(srcVtt)) {
  const destVtt = path.join(OUT_DIR, `${slug}.vtt`);
  fs.copyFileSync(srcVtt, destVtt);
  hasCaptions = true;
  console.log(`copied ${path.relative(REPO_ROOT, destVtt)}`);
}

const posterPath = path.join(OUT_DIR, `${slug}-poster.png`);
const posterTime = opt('--poster-time', '1.5');
const stillRes = spawnSync(process.execPath, [path.join(HERE, 'still.mjs'), ROOT, posterTime, posterPath, '--scale', '0.5'], { stdio: 'inherit' });
if (stillRes.status !== 0) {
  console.warn('warning: could not generate poster frame via still.mjs');
} else {
  console.log(`wrote ${path.relative(REPO_ROOT, posterPath)}`);
}

console.log('\nPaste into your MDX lesson:\n');
console.log(`<ExplainerVideo course="${course}" slug="${slug}" title="Concept Explainer"${hasCaptions ? ' captions' : ''} />`);
