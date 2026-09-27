# mbiszczanik.dev

Personal technical blog of Marcin Biszczanik. Astro static site, deployed
as a Cloudflare Worker (static assets) at https://mbiszczanik.dev. Content
focus: the decisions behind Azure platform work.

## Development

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server at `localhost:4321` |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Preview the build locally |
| `npm run verify:seo` | Check SEO essentials in the built output |
| `npm run og` | Regenerate `public/og-default.png` and `public/favicon.ico` (needs Chrome or Edge; override with `CHROME_PATH`) |

## Brand

The site uses brand "Druk" (light mode), the same system as SkyCraft:
Akademia Chmury. Tokens live at the top of `src/styles/global.css`; fonts
are Archivo and JetBrains Mono variable woff2 files in `src/assets/fonts`
(SIL Open Font License), wired up in `astro.config.mjs`. The rules: no
box-shadow, text-shadow, border-radius or italics, and no font weight above
600. The Open Graph card template is `scripts/og/og.html`.

## Deployment: Cloudflare Workers

The site deploys as the `mbiszczanik-dev` Worker, serving `dist` as static
assets. Worker settings live in `wrangler.jsonc`; Workers Builds (connected
to this repository) runs:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command (`main`) | `npx wrangler deploy` |
| Deploy command (other branches) | `npx wrangler preview` |
| Node version | 22 (from `.nvmrc`) |

Pushing to `main` deploys to production. Pull request branches get a
preview deployment, linked from the PR.

### Custom domain

`mbiszczanik.dev` is attached through `routes` in `wrangler.jsonc`
(`custom_domain: true`). The zone is on Cloudflare, so the deploy creates
the DNS record and certificate. The apex must not have another A/AAAA/CNAME
record, or the deploy fails.

### Web Analytics (manual)

1. In the Cloudflare dashboard open Analytics > Web Analytics and add the
   site.
2. Copy the beacon token.
3. In `src/components/BaseHead.astro`, find the `TODO(author)` marker,
   replace `YOUR_CF_BEACON_TOKEN` with the token, and uncomment the
   script tag.

### Changing the domain

The domain appears in `wrangler.jsonc` (`routes`), `astro.config.mjs`
(`site`), `public/robots.txt`, `scripts/verify-seo.mjs` (`BUILT_SITE`),
`scripts/generate-og-image.mjs` (run `npm run og` afterwards) and the
canonical URL table in `PUBLISHING.md`.

Also review `src/pages/privacy.md` before go-live.

## Publishing

See [PUBLISHING.md](PUBLISHING.md) for the dev.to canonical cross-post
workflow.
