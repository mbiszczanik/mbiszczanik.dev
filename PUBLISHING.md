# Publishing workflow

This blog is the canonical source of truth. dev.to is a secondary channel
for reach and feedback. SEO equity stays with the blog through canonical
URLs.

## Publishing a new post

1. Publish the post on the blog first. Merge to `main`; Cloudflare Workers
   Builds deploys automatically.
2. On dev.to, create a new post and paste the same Markdown.
3. In the dev.to post settings, set the canonical URL to the blog post URL:
   `https://mbiszczanik.dev/blog/<slug>/`. If you use dev.to frontmatter, the
   `canonical_url` field must match the blog URL exactly, character for
   character, including the trailing slash.
4. Optionally post a short LinkedIn update linking to the blog post (not
   the dev.to copy).

## Canonical URLs of published posts

| Post | Canonical URL |
| --- | --- |
| When Azure Verified Modules appeared, I had to decide what of my own work to throw away | `https://mbiszczanik.dev/blog/keep-adapt-drop-avm/` |
