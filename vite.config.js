import { defineConfig } from 'vite';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = import.meta.dirname;

// Page slugs, read from PAGES in src/render.js so there is one list to edit.
const slugs = () =>
  [...readFileSync(resolve(root, 'src/render.js'), 'utf8').matchAll(/\{ slug: '([a-z0-9-]+)'/g)]
    .map((m) => m[1])
    .filter((s) => s !== 'home')
    .concat(['papers', 'gallery', 'brain', 'quotes']); // old addresses, now inside other pages (see ALIASES)

// The site is one app with a page per section (/about/, /work/ ...).
// After building, copy index.html into a folder per page so every URL loads
// directly on any static host, and as 404.html for anything unknown.
const pageFolders = () => ({
  name: 'page-folders',
  apply: 'build',
  closeBundle() {
    const dist = resolve(root, 'dist');
    if (!existsSync(resolve(dist, 'index.html'))) return; // the build itself failed; let its error show
    const html = readFileSync(resolve(dist, 'index.html'), 'utf8');
    for (const slug of slugs()) {
      mkdirSync(resolve(dist, slug), { recursive: true });
      writeFileSync(resolve(dist, slug, 'index.html'), html);
    }
    writeFileSync(resolve(dist, '404.html'), html);
  },
});

/* ---------- the Blog page's posts, from the Substack feed ----------
   Browsers can't read a Substack feed from another site (no CORS), so the feed is read
   here instead: live in dev at /blog.json, and saved into dist/blog.json at build time.
   A new post shows up on the next build/deploy. The Substack address lives in content.js. */
const substackUrl = () => readFileSync(resolve(root, 'src/content.js'), 'utf8').match(/substack:\s*'([^']+)'/)?.[1];
const text = (xml, tag) => {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? m[1].replace(/^<!\[CDATA\[|\]\]>$/g, '').trim() : '';
};
const plain = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, '’').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
async function readFeed() {
  const url = substackUrl();
  if (!url) return { url: null, posts: [] };
  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/feed`, { signal: AbortSignal.timeout(10000) });
    const xml = await res.text();
    const posts = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 12).map(([, it]) => ({
      title: plain(text(it, 'title')),
      link: text(it, 'link'),
      date: new Date(text(it, 'pubDate')).toISOString().slice(0, 10),
      summary: plain(text(it, 'description')).slice(0, 220),
      image: it.match(/<enclosure[^>]+url="([^"]+)"/)?.[1] || null,
    }));
    return { url, posts };
  } catch {
    return { url, posts: [], error: true }; // offline or Substack down: the page shows the subscribe link only
  }
}
const blogFeed = () => ({
  name: 'blog-feed',
  configureServer(server) {
    server.middlewares.use(`${server.config.base}blog.json`, async (_req, res) => {
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify(await readFeed()));
    });
  },
  async closeBundle() {
    const dist = resolve(root, 'dist');
    if (!existsSync(dist)) return;
    writeFileSync(resolve(dist, 'blog.json'), JSON.stringify(await readFeed()));
  },
});

export default defineConfig({
  // GitHub Pages serves this repo at /MyPortfolio/; set BASE=/ for a host at the domain root
  base: process.env.BASE || '/MyPortfolio/',
  build: { chunkSizeWarningLimit: 1200 },
  plugins: [pageFolders(), blogFeed()],
});
