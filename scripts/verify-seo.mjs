import { readFileSync, existsSync } from 'node:fs';

const POST = 'dist/blog/keep-adapt-drop-avm/index.html';

const read = (p) => readFileSync(p, 'utf8');
const checks = [];
const check = (name, fn) => checks.push({ name, fn });

check('post page exists', () => existsSync(POST));
const BUILT_SITE = 'https://mbiszczanik.dev';
check('post has canonical link', () =>
  read(POST).includes(
    `<link rel="canonical" href="${BUILT_SITE}/blog/keep-adapt-drop-avm/"`
  )
);
check('post has meta description', () =>
  read(POST).includes('name="description" content="A repeatable keep / adapt / drop method')
);
check('post has its own og:image', () =>
  read(POST).includes(`property="og:image" content="${BUILT_SITE}/og/keep-adapt-drop-avm.png"`)
);
check('post has twitter card', () =>
  read(POST).includes('name="twitter:card" content="summary_large_image"')
);
check('post has og:type article', () =>
  read(POST).includes('property="og:type" content="article"')
);
check('post has BlogPosting JSON-LD', () =>
  read(POST).includes('"@type":"BlogPosting"')
);
check('post JSON-LD has image', () =>
  read(POST).includes(`"image":"${BUILT_SITE}/og/keep-adapt-drop-avm.png"`)
);
check('post JSON-LD has author name', () =>
  read(POST).includes('"author":{"@type":"Person","name":"Marcin Biszczanik"')
);
check('post has exactly one h1', () => (read(POST).match(/<h1[\s>]/g) || []).length === 1);
check('home page exists', () => existsSync('dist/index.html'));
check('home has Person JSON-LD', () => read('dist/index.html').includes('"@type":"Person"'));
check('home has exactly one h1', () =>
  (read('dist/index.html').match(/<h1[\s>]/g) || []).length === 1
);
check('about page exists', () => existsSync('dist/about/index.html'));
check('about has Person JSON-LD', () =>
  read('dist/about/index.html').includes('"@type":"Person"')
);
check('privacy page exists', () => existsSync('dist/privacy/index.html'));
check('privacy has contact email', () =>
  read('dist/privacy/index.html').includes('mbiszczanik@hotmail.com')
);
check('footer links privacy on home', () => read('dist/index.html').includes('href="/privacy/"'));
check('nav links about on home', () => read('dist/index.html').includes('href="/about"'));
check('robots.txt references sitemap', () =>
  existsSync('dist/robots.txt') &&
  read('dist/robots.txt').includes('Sitemap: https://mbiszczanik.dev/sitemap-index.xml')
);
check('sitemap exists', () => existsSync('dist/sitemap-index.xml'));
check('rss exists and lists the post', () =>
  existsSync('dist/rss.xml') && read('dist/rss.xml').includes('When Azure Verified Modules appeared')
);
check('og image file exists', () => existsSync('dist/og-default.png'));
check('post og and dev.to cover files exist', () =>
  existsSync('dist/og/keep-adapt-drop-avm.png') && existsSync('dist/og/keep-adapt-drop-avm-devto.png')
);
check('analytics placeholder in BaseHead source', () =>
  read('src/components/BaseHead.astro').includes('TODO(author)')
);

let failed = 0;
for (const { name, fn } of checks) {
  let ok = false;
  try {
    ok = fn();
  } catch {
    ok = false;
  }
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) failed++;
}
console.log(`${checks.length - failed}/${checks.length} checks passed`);
process.exit(failed ? 1 : 0);
