// Author: Krishan Navas. Run against the original workspace, outside the published dist/.
import { copyFile, mkdir } from 'node:fs/promises';
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

// Preserve the approved French presentation and its sound, with fast-start metadata.
run(['-i', join(workspace, 'synapse-video/synapse-v4-elevenlabs-equilibre.mp4'), '-c', 'copy', '-movflags', '+faststart', join(media, 'presentation.mp4')]);
const excerpts = [
  { name: 'diagnostic', source: 'Transaction en erreur.mp4', start: 0, duration: 27, poster: 15 },
  { name: 'assistant', source: 'Assistant IA.mp4', start: 35, duration: 27, poster: 8 },
  { name: 'reconciliation', source: 'Reconciliation.mp4', start: 13, duration: 19, poster: 12 },
];
for (const clip of excerpts) {
  run(['-ss', String(clip.start), '-i', join(workspace, 'synapse-video', clip.source), '-t', String(clip.duration), '-vf', 'scale=1280:-2', '-r', '24', '-c:v', 'libx264', '-preset', 'fast', '-crf', '23', '-pix_fmt', 'yuv420p', '-an', '-movflags', '+faststart', join(media, `${clip.name}.mp4`)]);
}
for (const { name, poster } of [{ name: 'presentation', poster: 6 }, ...excerpts]) {
  run(['-ss', String(poster), '-i', join(media, `${name}.mp4`), '-frames:v', '1', '-vf', 'scale=1280:-2', '-q:v', '3', join(media, `${name}.jpg`)]);
}
console.log('Prepared 4 videos, 4 posters, 3 local fonts and the original Synapse mark.');
