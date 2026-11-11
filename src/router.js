import { PAGES, ALIASES, pagePath } from './render.js';

/**
 * Shows one .page at a time and keeps the URL in step (/about/, /work/ ...).
 * Pages are loaded on demand: a page's markup is built the first time it's shown
 * (`renderPage`), then `onFirstShow` runs any setup it needs (e.g. the gallery).
 * Navigation itself, with the TV transitions, lives in transition.js.
 */
export function createRouter({ name, renderPage = () => '', onFirstShow = () => {} }) {
  const els = new Map([...document.querySelectorAll('.page')].map((el) => [el.dataset.page, el]));
  const loaded = new Set([...els].filter(([, el]) => el.childElementCount).map(([slug]) => slug)); // home is built up front
  const base = import.meta.env.BASE_URL;
  const listeners = [];
  let current = null;

  const slugFromLocation = (loc = window.location) => {
    const fromHash = loc.hash.slice(1); // old one-page links like /#about still work
    if (els.has(fromHash)) return fromHash;
    if (ALIASES[fromHash]) return ALIASES[fromHash];
    const path = loc.pathname.startsWith(base) ? loc.pathname.slice(base.length) : loc.pathname.replace(/^\//, '');
    const slug = ALIASES[path.split('/')[0]] || path.split('/')[0];
    return els.has(slug) ? slug : 'home';
  };

  // build a page the first time it's needed
  function load(slug) {
    if (loaded.has(slug)) return;
    loaded.add(slug);
    const el = els.get(slug);
    el.innerHTML = renderPage(slug);
    onFirstShow(slug, el);
  }

  function show(slug) {
    if (!els.has(slug)) slug = 'home';
    load(slug);
    els.forEach((el, k) => { el.hidden = k !== slug; });
    current = slug;
    document.body.dataset.page = slug;
    const pg = PAGES.find((p) => p.slug === slug);
    document.title = slug === 'home' ? `${name} ♪ Portfolio` : `${pg.title} ♪ ${name}`;
    listeners.forEach((fn) => fn(slug));
  }

  return {
    pages: PAGES,
    path: pagePath,
    has: (slug) => els.has(slug),
    el: (slug) => els.get(slug),
    get current() { return current; },
    get index() { return PAGES.findIndex((p) => p.slug === current); },
    meta: (slug) => PAGES.find((p) => p.slug === slug),
    slugFromLocation,
    show,
    onChange: (fn) => listeners.push(fn),
  };
}
