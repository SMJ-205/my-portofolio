// Renders resume-src/resume.html to the single-page PDF served by the site.
// Requires Google Chrome. Run with: npm run resume:pdf
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';

const SRC = path.resolve('resume-src/resume.html');
const OUT = path.resolve('public/assets/resume_sarif_mubdi_jantika.pdf');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'resume-')), 'resume.pdf');
execFileSync(CHROME, [
  '--headless',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${tmp}`,
  `file://${SRC}`,
], { stdio: 'ignore' });

// Guard against spilling onto a second page (pdfinfo ships with poppler: brew install poppler)
let pages = null;
try {
  pages = Number(execFileSync('pdfinfo', [tmp], { encoding: 'utf-8' }).match(/^Pages:\s+(\d+)/m)[1]);
} catch {
  console.warn('pdfinfo not found; skipping the single-page check.');
}
if (pages !== null && pages !== 1) {
  console.error(`Resume renders to ${pages} pages; trim content so it fits on one A4 page.`);
  process.exit(1);
}
fs.copyFileSync(tmp, OUT);
console.log(`Wrote ${path.relative(process.cwd(), OUT)}${pages ? ` (${pages} page)` : ''}.`);
