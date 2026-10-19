// Author: Krishan Navas. Run against the original workspace, outside the published dist/.
import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const workspace = resolve(process.argv[2] || '..');
const ffmpeg = process.argv[3] || 'ffmpeg';
const media = join(root, 'dist/media');
await mkdir(join(media, 'fonts'), { recursive: true });
for (const weight of [400, 500, 600]) {
  const name = `InstrumentSans-${weight}.woff2`;
  await copyFile(join(workspace, 'motion-design/synapse-rfp-v5/assets/fonts', name), join(media, 'fonts', name));
}
await copyFile(join(workspace, 'synapse-video/assets/synapse-mark.svg'), join(media, 'synapse-mark.svg'));

function run(args) {
  const result = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { encoding: 'utf8' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr || `FFmpeg exited ${result.status}`);
}

// Preserve complete final films, including original sound and quality.
const films = JSON.parse(await readFile(new URL('./media-manifest.json', import.meta.url), 'utf8'));
for (const { name, source, poster } of films) {
  run(['-i', join(workspace, source), '-map', '0:v:0', '-map', '0:a:0', '-c', 'copy', '-movflags', '+faststart', join(media, `${name}.mp4`)]);
  run(['-ss', String(poster), '-i', join(media, `${name}.mp4`), '-frames:v', '1', '-vf', 'scale=1280:-2', '-q:v', '3', join(media, `${name}.jpg`)]);
}
console.log(`Prepared ${films.length} complete films with original audio, posters and local brand assets.`);
