// Fails the build when an internal marker would reach a published page.
// HTML comments do not render but ship in the page source; Astro's {/* */} comments do not ship.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.argv[2] ?? 'src';
const WORD = /\b(TODO|FIXME|DRAFT)\b/;

const files = (dir, ext) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name), ext) : ext.test(e.name) ? [join(dir, e.name)] : []
  );

const hits = [];
const hit = (file, i, line) => hits.push(`${file}:${i + 1}: ${line.trim()}`);

// Posts: any HTML comment or marker outside fenced code.
for (const file of files(ROOT, /\.mdx?$/)) {
  let fence = null;
  readFileSync(file, 'utf8').split(/\r?\n/).forEach((line, i) => {
    const open = line.match(/^\s*(```|~~~)/);
    if (open) fence = fence === null ? open[1] : fence === open[1] ? null : fence;
    else if (fence === null && (line.includes('<!--') || WORD.test(line))) hit(file, i, line);
  });
}

// Templates: a marker inside an HTML comment.
for (const file of files(ROOT, /\.astro$/)) {
  let inComment = false;
  readFileSync(file, 'utf8').split(/\r?\n/).forEach((line, i) => {
    let rest = line;
    let flagged = false;
    while (rest) {
      if (!inComment) {
        const at = rest.indexOf('<!--');
        if (at < 0) break;
        inComment = true;
        rest = rest.slice(at + 4);
      } else {
        const end = rest.indexOf('-->');
        const body = end < 0 ? rest : rest.slice(0, end);
        if (!flagged && WORD.test(body)) flagged = true;
        if (end < 0) break;
        inComment = false;
        rest = rest.slice(end + 3);
      }
    }
    if (flagged) hit(file, i, line);
  });
}

if (hits.length) {
  console.error(`Internal markers that would be published:\n${hits.join('\n')}`);
  process.exit(1);
}
console.log(`check-content-markers: ${ROOT} clean`);
