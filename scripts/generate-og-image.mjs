import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0f172a"/>
  <rect x="0" y="614" width="1200" height="16" fill="#38bdf8"/>
  <text x="80" y="270" font-family="Segoe UI" font-size="76" font-weight="bold" fill="#f8fafc">Marcin Biszczanik</text>
  <text x="80" y="350" font-family="Segoe UI" font-size="34" fill="#cbd5e1">Cloud and Platform Consultant.</text>
  <text x="80" y="400" font-family="Segoe UI" font-size="34" fill="#cbd5e1">Notes on the decisions behind Azure platform work.</text>
  <text x="80" y="540" font-family="Segoe UI" font-size="30" fill="#38bdf8">mbiszczanik.dev</text>
</svg>`;

const resvg = new Resvg(svg, {
  font: {
    fontFiles: ['C:/Windows/Fonts/segoeui.ttf', 'C:/Windows/Fonts/segoeuib.ttf'],
    loadSystemFonts: false,
    defaultFontFamily: 'Segoe UI',
  },
});

writeFileSync('public/og-default.png', resvg.render().asPng());
console.log('Wrote public/og-default.png (1200x630)');
