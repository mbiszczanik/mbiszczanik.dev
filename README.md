# mbiszczanik.dev

Personal technical blog of Marcin Biszczanik. Astro static site, deployed
on Cloudflare Pages. Content focus: the decisions behind Azure platform
work.

## Development

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server at `localhost:4321` |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Preview the build locally |
| `npm run verify:seo` | Check SEO essentials in the built output |
| `npm run og` | Regenerate `public/og-default.png` |

## Deployment: Cloudflare Pages

Build configuration:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 22 (from `.nvmrc`) |

### One-time setup (manual, requires the Cloudflare account)

1. Log in to the Cloudflare dashboard and open Workers and Pages.
2. Create a new Pages project and connect it to the
   `mbiszczanik/mbiszczanik.dev` GitHub repository.
3. Set the build command to `npm run build` and the output directory to
   `dist`. Cloudflare reads the Node version from `.nvmrc`.
4. Save and deploy. The site is now live on `<project>.pages.dev`.

### Custom domain (manual)

1. Buy the domain (suggested: `mbiszczanik.dev`).
2. In the Pages project, open Custom domains and add the domain.
3. If the domain's DNS is hosted on Cloudflare, the dashboard adds the
   required CNAME record for you. Otherwise create a CNAME record pointing
   the domain to `<project>.pages.dev`.
4. Wait for the certificate to be issued; HTTPS is automatic.

### Web Analytics (manual)

1. In the Cloudflare dashboard open Analytics > Web Analytics and add the
   site.
2. Copy the beacon token.
3. In `src/components/BaseHead.astro`, find the `TODO(author)` marker,
   replace `YOUR_CF_BEACON_TOKEN` with the token, and uncomment the
   script tag.

### DOMAIN placeholder substitution

After the domain is connected, replace the `DOMAIN` placeholder with the
real domain in these files:

| File | What to change |
| --- | --- |
| `astro.config.mjs` | `site: 'https://DOMAIN'` |
| `public/robots.txt` | `Sitemap: https://DOMAIN/sitemap-index.xml` |
| `PUBLISHING.md` | Canonical URL table |
| `scripts/generate-og-image.mjs` | Domain text in the image; run `npm run og` again if it differs from `mbiszczanik.dev` |
| `scripts/verify-seo.mjs` | `BUILT_SITE` constant (use the lowercase real domain) |

Also review `src/pages/privacy.md` before go-live.

## Publishing

See [PUBLISHING.md](PUBLISHING.md) for the dev.to canonical cross-post
workflow.
