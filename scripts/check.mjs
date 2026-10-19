// Author: Krishan Navas. Dependency-free publication and interaction checks.
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const dist = resolve(fileURLToPath(new URL('../dist', import.meta.url)));
const html = await readFile(resolve(dist, 'index.html'), 'utf8');
const css = await readFile(resolve(dist, 'styles.css'), 'utf8');
const js = await readFile(resolve(dist, 'app.js'), 'utf8');
const filmManifest = JSON.parse(await readFile(new URL('./media-manifest.json', import.meta.url), 'utf8'));
assert.ok(filmManifest.every((film) => film.productVersion === 2 && film.source.startsWith('synapse-video/RFP-v2/')), 'Only validated Synapse v2 films');
assert.deepEqual(filmManifest.map((film) => film.name), ['synapse-rfp-en', 'synapse-roi-en', 'synapse-mcp-en'], 'Synapse v2 collection: configuration, ROI and MCP');
assert.match(html, /<html lang="fr">/);
assert.equal([...html.matchAll(/<h1\b/g)].length, 1, 'One primary heading');
assert.equal([...html.matchAll(/<video\b/g)].length, filmManifest.length, 'All current product films');
const filmSources = [...html.matchAll(/<source src="([^"]+)" type="video\/mp4">/g)].map((match) => match[1]);
assert.deepEqual(filmSources, filmManifest.map((film) => `media/${film.name}.mp4`), 'Final Synapse v2 RFP, ROI and MCP films');
assert.doesNotMatch(html, /synapse-overview-en|synapse-ebonding-en|0:44|0:50/, 'No Synapse v1 films or obsolete durations');
assert.doesNotMatch(html, /Capture sans audio|en français, 40 secondes|media\/(?:presentation|diagnostic|assistant|reconciliation)\.(?:mp4|jpg)/, 'No obsolete clips or labels');
assert.doesNotMatch(html, /\bautoplay\b|https?:\/\/localhost|file:\/\//, 'No autoplay or local URLs');
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /max-width:480px/);
assert.match(css, /forced-colors/);
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Unique IDs');
const references = [...html.matchAll(/\b(?:src|href|poster)="([^"]+)"/g)].map((match) => match[1]);
references.push(...[...css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)].map((match) => match[1]));
let checked = 0;
for (const reference of new Set(references)) {
  if (reference.startsWith('#')) { assert.ok(ids.includes(reference.slice(1)), `Anchor ${reference} exists`); continue; }
  if (/^https?:/.test(reference)) continue;
  const path = resolve(dist, reference.split(/[?#]/, 1)[0]);
  assert.ok(path.startsWith(dist + '/') || path.startsWith(dist + '\\'), `Asset stays in dist: ${reference}`);
  const info = await stat(path);
  assert.ok(info.isFile() && info.size > 0, `Asset is non-empty: ${reference}`);
  assert.ok(info.size < 100 * 1024 * 1024, `Asset fits GitHub file limit: ${reference}`);
  checked++;
}
for (const video of html.matchAll(/<video\b([^>]+)>/g)) {
  for (const required of ['controls', 'playsinline', 'preload', 'aria-label', 'poster', 'aria-describedby']) {
    assert.ok(video[1].includes(required), `Video has ${required}`);
  }
}
// Exercise playback policy without requiring an installed browser.
class MockVideo {
  constructor() { this.pausedCalls = 0; }
  pause() { this.pausedCalls++; }
  addEventListener() {}
  querySelector() { return { addEventListener() {} }; }
}
const videos = Array.from({ length: filmManifest.length }, () => new MockVideo());
let playHandler;
vm.runInNewContext(js, { HTMLVideoElement: MockVideo, document: {
  querySelectorAll: () => videos,
  addEventListener: (name, handler) => { assert.equal(name, 'play'); playHandler = handler; },
} });
playHandler({ target: videos[1] });
assert.deepEqual(videos.map((video) => video.pausedCalls), [1, 0, 1]);
playHandler({ target: {} });
assert.deepEqual(videos.map((video) => video.pausedCalls), [1, 0, 1]);
assert.ok(!js.includes('localStorage') && !js.includes('fetch('), 'No tracking or network calls');
console.log(`PASS: ${checked} local assets, anchors, French metadata, video accessibility attributes and single-video playback.`);
