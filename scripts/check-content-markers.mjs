// Fails the build when a post still carries an internal marker.
// HTML comments reach the published page source even though they do not render.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.argv[2] ?? 'src/content';
const MARKERS = [/<!--/, /\bTODO\b/, /\bFIXME\b/, /\bDRAFT\b/];

const files = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name)) : /\.mdx?$/.test(e.name) ? [join(dir, e.name)] : []
  );

const hits = [];
for (const file of files(ROOT)) {
  let fence = null;
  readFileSync(file, 'utf8').split(/\r?\n/).forEach((line, i) => {
    const open = line.match(/^\s*(```|~~~)/);
    if (open) fence = fence === null ? open[1] : fence === open[1] ? null : fence;
    else if (fence === null && MARKERS.some((m) => m.test(line))) hits.push(`${file}:${i + 1}: ${line.trim()}`);
  });
}

if (hits.length) {
  console.error(`Internal markers in published content:\n${hits.join('\n')}`);
  process.exit(1);
}
console.log(`check-content-markers: ${ROOT} clean`);
