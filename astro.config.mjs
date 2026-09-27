// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// Unicode subsets of the brand's variable fonts (latin + latin-ext files).
const LATIN = [
	'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
];
const LATIN_EXT = [
	'U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF',
];

// https://astro.build/config
export default defineConfig({
	site: 'https://mbiszczanik.dev',
	integrations: [mdx(), sitemap()],
	markdown: {
		// Light theme to match the paper background; the block background is removed in global.css.
		shikiConfig: { theme: 'github-light' },
	},
	// Brand "Druk" typography: Archivo for text, JetBrains Mono for labels and code (SIL OFL).
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Archivo',
			cssVariable: '--font-archivo',
			fallbacks: ['system-ui', '-apple-system', 'sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/Archivo-var-latin.woff2'],
						weight: '100 900',
						style: 'normal',
						display: 'swap',
						unicodeRange: LATIN,
					},
					{
						src: ['./src/assets/fonts/Archivo-var-latin-ext.woff2'],
						weight: '100 900',
						style: 'normal',
						display: 'swap',
						unicodeRange: LATIN_EXT,
					},
				],
			},
		},
		{
			provider: fontProviders.local(),
			name: 'JetBrains Mono',
			cssVariable: '--font-jetbrains-mono',
			fallbacks: ['ui-monospace', 'SFMono-Regular', 'monospace'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/JetBrainsMono-var-latin.woff2'],
						weight: '100 800',
						style: 'normal',
						display: 'swap',
						unicodeRange: LATIN,
					},
					{
						src: ['./src/assets/fonts/JetBrainsMono-var-latin-ext.woff2'],
						weight: '100 800',
						style: 'normal',
						display: 'swap',
						unicodeRange: LATIN_EXT,
					},
				],
			},
		},
	],
});
