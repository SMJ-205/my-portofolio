// Generates downscaled WebP copies of images for mobile viewports (< 768px).
// Originals are left untouched and still served to desktop. Requires `cwebp`
// (brew install webp) and macOS `sips`. Run with: npm run images:mobile
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const OUT_DIR = 'public/assets/m';
const JOBS = [
  { src: 'public/assets/profile.png', out: `${OUT_DIR}/profile.webp`, width: 480 },
  ...fs.readdirSync('public/assets/projects')
    .filter(name => /\.(png|jpe?g)$/i.test(name) && !name.startsWith('exclude'))
    .map(name => ({
      src: `public/assets/projects/${name}`,
      out: `${OUT_DIR}/projects/${name.replace(/\.(png|jpe?g)$/i, '.webp')}`,
      width: 800,
    })),
];

let written = 0;
for (const { src, out, width } of JOBS) {
  // Skip when the mobile copy is already newer than its source
  if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs) continue;
  fs.mkdirSync(path.dirname(out), { recursive: true });
  // Only downscale; never enlarge images that are already narrower than the target
  const srcWidth = Number(execFileSync('sips', ['-g', 'pixelWidth', src], { encoding: 'utf-8' }).match(/pixelWidth: (\d+)/)[1]);
  const resize = srcWidth > width ? ['-resize', String(width), '0'] : [];
  execFileSync('cwebp', ['-quiet', '-q', '72', ...resize, src, '-o', out]);
  written++;
}
console.log(`Mobile images: ${written} written, ${JOBS.length - written} up to date.`);
