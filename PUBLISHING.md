# Publishing workflow

This blog is the canonical source of truth. dev.to is a secondary channel
for reach and feedback. SEO equity stays with the blog through canonical
URLs.

## Before merging a post

Lessons from the posts so far. `npm run build` enforces the last one; the
rest are checked by hand on the day of the merge.

- When a post states a fact that can change (version, support date, module
  status, count), the post shall name its primary source and the date it was
  checked.
- If that date is more than 14 days before `pubDate`, then the merge shall
  wait until the check is run again.
  The landing zone article's source decision record, written in June, was
  wrong by October.
- When a post states a count produced by a script or a pattern match, the
  count shall be confirmed by a second method (list the items, or count
  another way).
  A module count came out 22 instead of 23 because the pattern skipped digits.
- When a post gives the reader a command, the command shall be run on the
  merge day and its output shall match what the post says it shows.
- When a post includes a diagram, the diagram shall be rendered in light and
  dark mode at the published width and inspected before the merge, and its
  alt text shall state the conclusion, not only the shapes.
  An overlapping label showed only in the rendered image, not in the SVG source.
- When a post changes a conclusion of its source record (an ADR, a decision
  log entry), the source shall be updated in the same week the post is
  published.
- If a post contains `<!--`, `TODO`, `FIXME` or `DRAFT` outside a code block,
  then `npm run build` shall fail (`scripts/check-content-markers.mjs`).
  HTML comments do not render but reach the published page source.

## Publishing a new post

1. Run `npm run og` and commit the new images. It renders the post's
   social card (`public/og/<slug>.png`, 1200x630) and its dev.to cover
   (`public/og/<slug>-devto.png`, 1000x420) from the title and the `ogEyebrow`
   frontmatter field (default: the first two tags). A post can have its
   own card instead, `scripts/og/cards/<slug>.html`: a short hook rather than
   the title (dev.to prints the title under the cover). Without the images the post falls back to the site card.
2. Publish the post on the blog first. Merge to `main`; Cloudflare Workers
   Builds deploys automatically.
3. On dev.to, create a new post and paste the same Markdown.
4. In the dev.to post settings, set the canonical URL to the blog post URL:
   `https://mbiszczanik.dev/blog/<slug>/`. If you use dev.to frontmatter, the
   `canonical_url` field must match the blog URL exactly, character for
   character, including the trailing slash. Set `cover_image` to
   `https://mbiszczanik.dev/og/<slug>-devto.png`. Diagrams live in
   `public/diagrams/<slug>/` and the post links them root-relative; in the
   dev.to copy make every diagram URL absolute
   (`https://mbiszczanik.dev/diagrams/<slug>/...`) and check in the preview
   that dev.to renders the SVG. If it does not, link a PNG rendered with
   headless Chrome instead.
5. Optionally post a short LinkedIn update linking to the blog post (not
   the dev.to copy).

## Canonical URLs of published posts

| Post | Canonical URL |
| --- | --- |
| When Azure Verified Modules appeared, I had to decide what of my own work to throw away | `https://mbiszczanik.dev/blog/keep-adapt-drop-avm/` |
| Which Azure landing zone implementation should you build on in Bicep? | `https://mbiszczanik.dev/blog/choose-landing-zone-bicep/` |
