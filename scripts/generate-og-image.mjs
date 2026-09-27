// Renders the brand images committed to public/:
// - og-default.png (1200x630): scripts/og/og.html screenshotted by headless Chrome or Edge,
//   so the card uses the real Archivo and JetBrains Mono fonts. Override the browser with CHROME_PATH.
// - favicon.ico (32x32 PNG): public/favicon.svg rasterised with resvg (no text, so no fonts needed).
import { Resvg } from '@resvg/resvg-js';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
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

const og = resolve(ROOT, 'public/og-default.png');
const res = spawnSync(
  browser,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--window-size=1200,630',
    '--virtual-time-budget=2000',
    `--screenshot=${og}`,
    pathToFileURL(resolve(ROOT, 'scripts/og/og.html')).href,
  ],
  { stdio: 'inherit' }
);
if (res.status !== 0) process.exit(res.status ?? 1);
console.log('Wrote public/og-default.png (1200x630)');

const favicon = new Resvg(readFileSync(resolve(ROOT, 'public/favicon.svg'), 'utf8'), {
  fitTo: { mode: 'width', value: 32 },
});
writeFileSync(resolve(ROOT, 'public/favicon.ico'), favicon.render().asPng());
console.log('Wrote public/favicon.ico (32x32 PNG)');
