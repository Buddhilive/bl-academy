#!/usr/bin/env node
// Generate per-line speech takes from a local Voicebox server (https://docs.voicebox.sh/)
//   usage: node tools/voicebox.mjs .buddhi/pieces/<course>/<slug> [--profile Buddhi] [--url http://localhost:17493] [--force]
// Reads  <piece>/voice/script.json ({ lead, tail, profile?, lines: [{ id, text, after?, file? }] })
// Writes <piece>/voice/<id>.wav (or updates line.file) via GET /profiles and POST /generate.
// Note: If running inside a network-isolated agent sandbox, execute with localhost access (BypassSandbox: true).
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const opt = (k, d) => {
  const i = argv.indexOf(k);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};
const flag = (k) => argv.includes(k);

if (!argv[0] || argv[0].startsWith('--')) {
  console.error('usage: node tools/voicebox.mjs <piece dir> [--profile Buddhi] [--url http://localhost:17493] [--force]');
  process.exit(2);
}

const ROOT = path.resolve(argv[0]);
const VDIR = path.join(ROOT, 'voice');
const SCRIPT_PATH = path.join(VDIR, 'script.json');
if (!fs.existsSync(SCRIPT_PATH)) {
  console.error(`missing script.json: ${SCRIPT_PATH}`);
  process.exit(1);
}

const script = JSON.parse(fs.readFileSync(SCRIPT_PATH, 'utf8'));
const profileName = opt('--profile', script.profile || 'Buddhi');
const rawUrl = opt('--url', process.env.VOICEBOX_URL || 'http://localhost:17493');
const force = flag('--force');

let baseUrl;
try {
  baseUrl = new URL(rawUrl);
  if (baseUrl.protocol !== 'http:' && baseUrl.protocol !== 'https:') {
    throw new Error('URL must use http or https');
  }
} catch (err) {
  console.error(`invalid Voicebox URL "${rawUrl}": ${err.message}`);
  process.exit(2);
}

const endpoint = (p) => new URL(p, baseUrl).toString();

async function fetchJson(url, init = {}) {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(15000) });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} from ${url}${body ? `: ${body.slice(0, 200)}` : ''}`);
  }
  return res.json();
}

let profiles;
try {
  const data = await fetchJson(endpoint('/profiles'));
  profiles = Array.isArray(data) ? data : (data.profiles || []);
} catch (err) {
  console.error(`Could not reach local Voicebox server at ${baseUrl.origin}: ${err.message}`);
  console.error('Start Voicebox locally (default http://localhost:17493) or use `node tools/voice.mjs <piece> --scratch` for timing drafts.');
  console.error('If running inside an agent sandbox, re-run this command outside the sandbox (BypassSandbox: true).');
  process.exit(1);
}

const target = profiles.find((p) => String(p.name || p.title || '').trim().toLowerCase() === profileName.trim().toLowerCase());
if (!target) {
  const names = profiles.map((p) => p.name || p.title || p.id).filter(Boolean);
  console.error(`Voicebox profile "${profileName}" not found. Available profiles: ${names.length ? names.join(', ') : '(none)'}`);
  process.exit(1);
}

const profileId = target.id || target.profile_id;
let generated = 0;
let skipped = 0;
let updatedScript = false;

for (const [i, line] of (script.lines || []).entries()) {
  const id = String(line.id || `l${i + 1}`);
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    console.error(`invalid line id "${id}" (use only letters, numbers, - and _)`);
    process.exit(1);
  }
  const relFile = line.file || `${id}.wav`;
  const outPath = path.resolve(VDIR, relFile);
  if (!outPath.startsWith(VDIR + path.sep)) {
    console.error(`unsafe output path for line "${id}": ${relFile}`);
    process.exit(1);
  }
  if (fs.existsSync(outPath) && !force) {
    skipped++;
    continue;
  }

  const res = await fetch(endpoint('/generate'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: line.text, profile_id: profileId }),
    signal: AbortSignal.timeout(300000),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error(`Voicebox /generate failed for "${id}" (HTTP ${res.status}): ${body.slice(0, 200)}`);
    process.exit(1);
  }

  const ctype = res.headers.get('content-type') || '';
  if (ctype.includes('application/json')) {
    const payload = await res.json();
    if (payload.audio_base64) {
      fs.writeFileSync(outPath, Buffer.from(payload.audio_base64, 'base64'));
    } else if (payload.audio_url || payload.url) {
      const audioRes = await fetch(endpoint(payload.audio_url || payload.url), { signal: AbortSignal.timeout(30000) });
      if (!audioRes.ok) throw new Error(`Failed downloading generated audio: HTTP ${audioRes.status}`);
      fs.writeFileSync(outPath, Buffer.from(await audioRes.arrayBuffer()));
    } else if (payload.id) {
      // Async generation API: poll /generate/{id}/status then download /audio/{id}
      const genId = payload.id;
      const deadline = Date.now() + 600000;
      let status = payload.status || 'generating';
      while (['generating', 'pending', 'queued', 'processing', 'loading_model'].includes(status)) {
        if (Date.now() > deadline) throw new Error(`Voicebox generation timed out for "${id}" (${genId})`);
        await new Promise((r) => setTimeout(r, 2000));
        const stRes = await fetch(endpoint(`/history/${genId}`), { signal: AbortSignal.timeout(30000) });
        if (!stRes.ok) throw new Error(`Voicebox status check failed for "${id}": HTTP ${stRes.status}`);
        const st = await stRes.json();
        status = st.status || status;
        if (status === 'failed' || status === 'error') throw new Error(`Voicebox generation failed for "${id}": ${st.error || 'unknown error'}`);
      }
      const audioRes = await fetch(endpoint(`/audio/${genId}`), { signal: AbortSignal.timeout(120000) });
      if (!audioRes.ok) throw new Error(`Failed downloading /audio/${genId}: HTTP ${audioRes.status}`);
      fs.writeFileSync(outPath, Buffer.from(await audioRes.arrayBuffer()));
    } else {
      throw new Error(`Unexpected JSON response from /generate for "${id}"`);
    }
  } else {
    fs.writeFileSync(outPath, Buffer.from(await res.arrayBuffer()));
  }

  if (!line.file) {
    line.file = relFile;
    updatedScript = true;
  }
  generated++;
  console.log(`generated ${path.relative(process.cwd(), outPath)} (${profileName})`);
}

if (updatedScript) {
  fs.writeFileSync(SCRIPT_PATH, JSON.stringify(script, null, 2) + '\n');
}
console.log(`voicebox: ${generated} generated, ${skipped} kept (profile "${profileName}", id=${profileId})`);
