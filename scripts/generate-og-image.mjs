// Renders the brand images committed to public/:
// - og-default.png (1200x630): scripts/og/og.html screenshotted by headless Chrome or Edge,
//   so the card uses the real Archivo and JetBrains Mono fonts. Override the browser with CHROME_PATH.
// - og/<slug>.png (1200x630) and og/<slug>-devto.png (1000x420, the dev.to cover ratio) for every
//   post in src/content/blog, from scripts/og/post.html filled with the post's title and ogEyebrow (default: first two tags),
//   plus optional art: scripts/og/art/<slug>.svg, the SVG export of <slug>.excalidraw (brand "Druk" diagram
//   style: sharp corners, roughness 0, paper #f2efe9, accent #1d4ed8). Export it with excalidraw.com
//   "Export image > SVG" or the skycraft-akademia renderer; the brand fonts are applied here.
// - favicon.ico (32x32 PNG): public/favicon.svg rasterised with resvg (no text, so no fonts needed).
import { Resvg } from '@resvg/resvg-js';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '..');

const BROWSERS = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);
const browser = BROWSERS.find((p) => existsSync(p));
if (!browser) {
  console.error('No Chrome or Edge found; set CHROME_PATH.');
  process.exit(1);
}

const screenshot = (html, out, width, height) => {
  const res = spawnSync(
    browser,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--window-size=${width},${height}`,
      '--virtual-time-budget=2000',
      `--screenshot=${out}`,
      pathToFileURL(html).href,
    ],
    { stdio: 'inherit' }
  );
  if (res.status !== 0) process.exit(res.status ?? 1);
};

screenshot(resolve(ROOT, 'scripts/og/og.html'), resolve(ROOT, 'public/og-default.png'), 1200, 630);
console.log('Wrote public/og-default.png (1200x630)');

// Excalidraw's SVG export uses its own fonts and a white background; the card supplies both.
const brandSvg = (svg) =>
  svg
    .replace(/font-family="Helvetica[^"]*"/g, 'font-family="Archivo, sans-serif"')
    .replace(/font-family="Cascadia[^"]*"/g, 'font-family="JetBrains Mono, monospace"')
    .replace(/<style class="style-fonts">[\s\S]*?<\/style>/, '')
    .replace(/<rect x="0" y="0" width="[\d.]+" height="[\d.]+" fill="#ffffff"><\/rect>/, '');

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const template = readFileSync(resolve(ROOT, 'scripts/og/post.html'), 'utf8');
// Rendered next to the template so its relative font URLs still resolve.
const tmp = resolve(ROOT, 'scripts/og/.post-render.html');
const BLOG = resolve(ROOT, 'src/content/blog');
mkdirSync(resolve(ROOT, 'public/og'), { recursive: true });

for (const file of readdirSync(BLOG).filter((f) => /\.mdx?$/.test(f))) {
  const slug = file.replace(/\.mdx?$/, '');
  const source = readFileSync(resolve(BLOG, file), 'utf8');
  const title = source.match(/^title:\s*"(.*)"\s*$/m)?.[1];
  const tags = JSON.parse(source.match(/^tags:\s*(\[.*\])\s*$/m)?.[1] ?? '[]');
  if (!title) {
    console.error(`No title in ${file}; skipped.`);
    continue;
  }
  const eyebrow =
    source.match(/^ogEyebrow:\s*"(.*)"\s*$/m)?.[1] ??
    tags.slice(0, 2).map((t) => t.replace(/-/g, ' ')).join(' · ');
  const artFile = resolve(ROOT, `scripts/og/art/${slug}.svg`);
  const art = existsSync(artFile) ? brandSvg(readFileSync(artFile, 'utf8')) : '';
  for (const [size, suffix, width, height] of [
    ['og', '', 1200, 630],
    ['devto', '-devto', 1000, 420],
  ]) {
    writeFileSync(
      tmp,
      template
        .replaceAll('{{size}}', size)
        .replaceAll('{{eyebrow}}', escape(eyebrow))
        .replaceAll('{{title}}', escape(title))
        .replaceAll('{{art}}', art)
    );
    screenshot(tmp, resolve(ROOT, `public/og/${slug}${suffix}.png`), width, height);
    console.log(`Wrote public/og/${slug}${suffix}.png (${width}x${height})`);
  }
}
rmSync(tmp, { force: true });

const favicon = new Resvg(readFileSync(resolve(ROOT, 'public/favicon.svg'), 'utf8'), {
  fitTo: { mode: 'width', value: 32 },
});
writeFileSync(resolve(ROOT, 'public/favicon.ico'), favicon.render().asPng());
console.log('Wrote public/favicon.ico (32x32 PNG)');
