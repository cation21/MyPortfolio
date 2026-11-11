// title letters cycle through the palette's warm lights: pink, blush, peach
const PALETTE = ['var(--pink)', 'var(--blush)', 'var(--peach)'];

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// multicolour, letter-by-letter title
const rainbow = (text, offset = 0) => {
  let i = 0;
  // letters are grouped per word so a title only ever wraps between words
  return text
    .split(' ')
    .map((word) =>
      `<span class="w">${[...word]
        .map((ch) => `<span class="ch" style="--c:${PALETTE[(i++ + offset) % PALETTE.length]}">${esc(ch)}</span>`)
        .join('')}</span>`
    )
    .join('<span class="sp"> </span>');
};

// one page per "track". slug '' is the home page.
export const PAGES = [
  { slug: 'home', side: 'A', nav: 'Home', title: 'Intro', label: 'welcome' },
  { slug: 'about', side: 'A', nav: 'About', title: 'About', label: 'meet the host' },
  { slug: 'work', side: 'A', nav: 'Work', title: 'Work', label: "where i've worked, and served" },
  { slug: 'research', side: 'A', nav: 'Research', title: 'Research', label: 'in the lab, and in print' },
  { slug: 'education', side: 'A', nav: 'Education', title: 'Education', label: 'where it started' },
  { slug: 'projects', side: 'B', nav: 'Projects', title: 'Projects', label: 'things i built, freelance and the scrapbook' },
  { slug: 'extras', side: 'B', nav: 'Extras', title: 'Extras', label: 'brain facts and words on repeat' },
  { slug: 'blog', side: 'B', nav: 'Blog', title: 'Blog', label: 'notes from the night shift' },
  { slug: 'contact', side: 'B', nav: 'Contact', title: 'Contact', label: "i'd love to hear from you" },
];
// old addresses that now live inside another page
export const ALIASES = { papers: 'research', gallery: 'projects', brain: 'extras', quotes: 'extras' };
const BASE = import.meta.env.BASE_URL; // '/' unless the site is served from a sub-folder
export const pagePath = (slug) => (slug === 'home' ? BASE : `${BASE}${slug}/`);

const ext = (href) => (href && href.startsWith('http') ? ' target="_blank" rel="noopener"' : '');

const kicker = (label) => `<p class="kicker">${esc(label)}</p>`;

const sectionHead = (label, title, offset) => `
  <header class="section__head">
    ${kicker(label)}
    <h2 class="section__title" aria-label="${esc(title)}">${rainbow(title, offset)}</h2>
    <svg class="section__halo" viewBox="0 0 400 80" aria-hidden="true"><ellipse cx="200" cy="40" rx="190" ry="26"/></svg>
  </header>`;

const tracklist = (items) =>
  `<ol class="tracks">${items
    .map(
      (it, i) => `
      <li class="track reveal">
        <div class="track__main">
          <h3 class="track__title">${esc(it.title)}</h3>
          <p class="track__org">${it.link ? `<a href="${it.link}"${ext(it.link)}>${esc(it.org)} ↗</a>` : esc(it.org)}</p>
          ${it.points?.length ? `<ul class="track__pts">${it.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
        </div>
        <span class="track__when">${esc(it.when || '♪')}</span>
      </li>`
    )
    .join('')}</ol>`;

/* ---------- illustrations ---------- */

const vinyl = (labelColor, text) => `
  <div class="vinyl" style="--label:${labelColor}">
    <div class="vinyl__grooves"></div>
    <div class="vinyl__label"><span>${esc(text)}</span></div>
  </div>`;

// the pages, as channels on the TV (home is the TV itself)
export const TRACKS = PAGES.filter((pg) => pg.slug !== 'home');

// dust drifting up the TV's beam: each speck gets its own drift, speed and start (deterministic, so no layout shift)
const DUST = Array.from({ length: 32 }, (_, i) => {
  const dx = (((i * 37) % 100) / 100) * 2 - 1; // -1..1 across the beam
  return `<i style="--dx:${(dx * 50).toFixed(1)}cqw; --s:${(0.25 + ((i * 7) % 10) / 22).toFixed(2)}cqw; --t:${(4 + ((i * 13) % 10) / 3).toFixed(2)}s; --d:${(-((i * 0.53) % 7)).toFixed(2)}s"></i>`;
}).join('');

const ICON = {
  download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 3h2v10.2l3.6-3.6 1.4 1.4-6 6-6-6 1.4-1.4 3.6 3.6z"/><path d="M4 18h16v2H4z"/></svg>',
  prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h2.5v14H6zM20 5v14L9.5 12z"/></svg>',
  next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 5H18v14h-2.5zM4 5v14l10.5-7z"/></svg>',
  play: '<svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15L19.5 12z"/></svg>',
  power: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 3h2v9h-2z"/><path d="M7.05 5.6l1.4 1.4A6.5 6.5 0 1 0 15.55 7l1.4-1.4A8.5 8.5 0 1 1 7.05 5.6z"/></svg>',
};

/* cover art motifs (original, generated) */
const cover = (motif) => {
  switch (motif) {
    case 'lidar':
      return `<svg viewBox="0 0 200 200">${[30, 55, 80, 105, 130].map((r) => `<path d="M100 170 m-${r} 0 a ${r} ${r} 0 0 1 ${r * 2} 0" fill="none" stroke="#07060f" stroke-width="5"/>`).join('')}
        ${Array.from({ length: 40 }, (_, i) => { const a = Math.PI + (i / 39) * Math.PI; const r = 40 + ((i * 37) % 90); return `<circle cx="${100 + Math.cos(a) * r}" cy="${170 + Math.sin(a) * r}" r="3" fill="#ffc44d"/>`; }).join('')}
        <circle cx="100" cy="170" r="10" fill="#07060f"/></svg>`;
    case 'waves':
      return `<svg viewBox="0 0 200 200">${Array.from({ length: 7 }, (_, i) => `<path d="M0 ${50 + i * 18} ${Array.from({ length: 10 }, (_, k) => `Q ${k * 20 + 10} ${50 + i * 18 + (k % 2 ? -1 : 1) * (6 + i * 2)} ${k * 20 + 20} ${50 + i * 18}`).join(' ')}" fill="none" stroke="${i === 3 ? '#ffc44d' : '#f3f0ff'}" stroke-width="${i === 3 ? 5 : 3}"/>`).join('')}</svg>`;
    case 'jelly':
      return `<svg viewBox="0 0 200 200"><path d="M50 100 Q 50 40 100 40 Q 150 40 150 100 Q 138 94 125 102 Q 112 94 100 102 Q 88 94 75 102 Q 62 94 50 100Z" fill="#ff2d8f"/>
        ${[62, 80, 100, 120, 138].map((x, i) => `<path d="M${x} 102 q ${i % 2 ? 10 : -10} 20 0 40 t 0 40" stroke="#ffc44d" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('')}</svg>`;
    case 'sun':
      return `<svg viewBox="0 0 200 200"><circle cx="100" cy="120" r="40" fill="#ff2d8f"/>${Array.from({ length: 14 }, (_, i) => { const a = Math.PI + (i / 13) * Math.PI; return `<line x1="${100 + Math.cos(a) * 54}" y1="${120 + Math.sin(a) * 54}" x2="${100 + Math.cos(a) * 92}" y2="${120 + Math.sin(a) * 92}" stroke="#07060f" stroke-width="6" stroke-linecap="round"/>`; }).join('')}<rect x="0" y="160" width="200" height="40" fill="#07060f"/></svg>`;
    case 'grid':
      return `<svg viewBox="0 0 200 200">${Array.from({ length: 9 }, (_, i) => `<rect x="${30 + (i % 3) * 50}" y="${40 + Math.floor(i / 3) * 46}" width="40" height="36" rx="6" fill="${i === 4 ? '#ff2d8f' : '#07060f'}"/><circle cx="${62 + (i % 3) * 50}" cy="${58 + Math.floor(i / 3) * 46}" r="3" fill="#ffc44d"/>`).join('')}</svg>`;
    case 'nodes':
    default: {
      const pts = [[40, 60], [100, 40], [160, 70], [70, 120], [130, 130], [100, 170], [30, 160], [170, 160]];
      const edges = [[0, 1], [1, 2], [0, 3], [1, 3], [1, 4], [2, 4], [3, 4], [3, 6], [4, 5], [5, 6], [4, 7], [5, 7]];
      return `<svg viewBox="0 0 200 200">${edges.map(([a, b]) => `<line x1="${pts[a][0]}" y1="${pts[a][1]}" x2="${pts[b][0]}" y2="${pts[b][1]}" stroke="#f3f0ff" stroke-width="3"/>`).join('')}${pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i === 4 ? 14 : 9}" fill="${i === 4 ? '#ffc44d' : '#07060f'}" stroke="#f3f0ff" stroke-width="3"/>`).join('')}</svg>`;
    }
  }
};

// a row of project records: each sleeve slides its vinyl out as it comes into view
const records = (list) => `<div class="records">${list
  .map(
    (p, i) => `
    <article class="record reveal">
      <div class="record__stage">
        ${vinyl(`var(--${p.color})`, p.title)}
        <a class="sleeve sleeve--${p.color}" ${p.link ? `href="${p.link}"${ext(p.link)}` : 'role="presentation"'}>
          <div class="sleeve__art">${cover(p.motif)}</div>
          <div class="sleeve__dots"></div>
          <h3 class="sleeve__title">${rainbow(p.title, i)}</h3>
          <span class="sleeve__no">No. ${String(i + 1).padStart(2, '0')}</span>
        </a>
      </div>
      <p class="record__blurb">${esc(p.blurb)}</p>
      <p class="record__tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</p>
    </article>`
  )
  .join('')}</div>`;

const waveBand = (id, text, tone) => `
  <div class="wave-band wave-band--${tone}" aria-hidden="true">
    <svg viewBox="0 0 1600 220" preserveAspectRatio="xMidYMid slice">
      <path id="${id}" d="" fill="none"/>
      <text><textPath href="#${id}" startOffset="0">${esc(text)}</textPath></text>
    </svg>
  </div>`;

// a quote's text, with its highlight (if any) lit up
const quoteText = (q) => {
  const at = q.highlight ? q.text.indexOf(q.highlight) : -1;
  if (at < 0) return esc(q.text);
  return `${esc(q.text.slice(0, at))}<mark class="quote__hl">${esc(q.highlight)}</mark>${esc(q.text.slice(at + q.highlight.length))}`;
};

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
export const trackCount = (slug, c) => ({
  about: 'bio · off duty',
  work: `${plural(c.work.length, 'role')} ♪ leadership & service`,
  research: `${plural(c.research.length, 'position')} ♪ ${plural(c.publications.length, 'paper')}`,
  education: plural(c.education.length, 'qualification'),
  projects: `${plural(c.projects.filter((p) => !p.freelance).length, 'project')} ♪ ${plural(c.projects.filter((p) => p.freelance).length, 'freelance site')} ♪ ${plural(c.gallery.length, 'photo')}`,
  extras: `${plural(c.facts.length, 'brain fact')} ♪ ${plural(c.quotes.length, 'quote')}`,
  blog: 'essays on substack',
  contact: 'say hello',
}[slug] || '');

/* ---------- page ---------- */

export function renderSite(c) {
  const app = document.getElementById('app');

  app.innerHTML = `
  <header class="nav">
    <a class="nav__logo" href="${pagePath('home')}" data-go="home">a<span>.</span>p</a>
    <nav class="nav__links" aria-label="Pages">
      ${PAGES.filter((pg) => pg.slug !== 'home').map((pg) => `<a href="${pagePath(pg.slug)}" data-go="${pg.slug}">${pg.nav}</a>`).join('')}
    </nav>
    <button class="nav__burger" aria-label="Menu" aria-expanded="false"><span></span><span></span></button>
  </header>

  <!-- on every page but home you're watching the TV full screen: its bezel frames the page -->
  <div class="frame">
    <div class="frame__case" aria-hidden="true"></div>
    <div class="frame__hole" aria-hidden="true"><canvas class="frame__static"></canvas><strong class="frame__title"></strong></div>
    <div class="frame__glass" aria-hidden="true"></div>
    <div class="frame__panel" role="group" aria-label="TV controls">
      <p class="frame__brand">${esc(c.first)}’s <small>portfolio</small></p>
      <span class="tv__grille" aria-hidden="true"></span>
      <div class="frame__controls">
        <button class="tv__btn" data-act="prev" aria-label="Previous page">${ICON.prev}<span>prev</span></button>
        <button class="tv__btn tv__btn--power" data-act="power" aria-label="Turn the TV back to the home page">${ICON.power}<span>home</span></button>
        <button class="tv__btn" data-act="next" aria-label="Next page">${ICON.next}<span>next</span></button>
      </div>
      <span class="tv__grille" aria-hidden="true"></span>
      <p class="frame__now"><span class="frame__k">now showing</span><span class="frame__name">Intro</span></p>
    </div>
  </div>

  <main>
    <div class="page" data-page="home">
      <section id="home" class="hero">
        <div class="tv">
          <div class="tv__rise">
            <div class="tv__light" aria-hidden="true"><b class="tv__core"></b></div>
            <div class="tv__dust" aria-hidden="true">${DUST}</div>
            <div class="tv__title">
              <p class="lp__l1" data-type="WELCOME TO"></p>
              <h1 class="lp__name" aria-label="${esc(c.first)}'s portfolio">${rainbow(c.first.toUpperCase() + "'S", 0)}</h1>
              <p class="lp__l3" data-type="PORTFOLIO"></p>
              <p class="tv__role" data-type="${esc(c.role.toUpperCase())}"></p>
            </div>
            <div class="tv__set" role="group" aria-label="TV: choose a page with previous and next, then press play">
              <div class="tv__ears" aria-hidden="true"><i></i><i></i></div>
              <div class="tv__case">
                <div class="tv__screen">
                  <div class="tv__tube">
                    <p class="tv__ch" aria-hidden="true"></p>
                    <div class="tv__picture" aria-live="polite">
                      <a class="tv__name" href="${pagePath(TRACKS[0].slug)}" data-go="${TRACKS[0].slug}"></a>
                      <p class="tv__about"></p>
                    </div>
                    <canvas class="tv__static" aria-hidden="true"></canvas>
                  </div>
                  <div class="tv__glass" aria-hidden="true"></div>
                </div>
                <div class="tv__panel">
                  <span class="tv__grille" aria-hidden="true"></span>
                  <div class="tv__controls">
                    <button class="tv__btn" data-act="prev" aria-label="Previous page">${ICON.prev}<span>prev</span></button>
                    <button class="tv__btn tv__btn--play" data-act="play" aria-label="Watch: open the page on screen full screen">${ICON.play}<span>watch</span></button>
                    <button class="tv__btn" data-act="next" aria-label="Next page">${ICON.next}<span>next</span></button>
                  </div>
                  <span class="tv__grille" aria-hidden="true"></span>
                </div>
              </div>
              <div class="tv__feet" aria-hidden="true"><i></i><i></i></div>
            </div>
          </div>
          <div class="tv__shadow" aria-hidden="true"></div>
        </div>
        <a class="hero__cue" href="#guide"><span>channel guide</span><i aria-hidden="true">↓</i></a>
      </section>

      ${waveBand('wp1', `${c.name.toUpperCase()} ✺ AI ENGINEER ✺ NEURO-CURIOUS ✺ `, 'pink')}

      <section id="hello" class="section liner">
        <div class="section__glow" aria-hidden="true"></div>
        ${sectionHead('a word from the host', 'Hello', 1)}
        <div class="liner__grid">
          <p class="liner__lead reveal">${esc(c.about[0])}</p>
          <div class="liner__side reveal">
            <figure class="portrait">
              <img src="${c.photo}" alt="${esc(c.name)}" width="720" height="720" loading="lazy" decoding="async" onerror="this.closest('.portrait').remove()" />
              <figcaption>${esc(c.name)} <span>♪ on air</span></figcaption>
            </figure>
          <div class="liner__actions">
            <a class="btn btn--cv" href="${c.links.cv}" download="${esc(c.name.replace(/ /g, '_'))}_CV.pdf" data-file data-missing="CV coming soon">${ICON.download}<span data-label>Download CV <small>PDF</small></span></a>
            <a class="btn btn--ghost" href="mailto:${c.email}">Email me</a>
            <p class="liner__links">
              <a href="${c.links.linkedin}"${ext(c.links.linkedin)}>LinkedIn ↗</a>
              <a href="${c.links.github}"${ext(c.links.github)}>GitHub ↗</a>
              <a href="${c.links.substack}"${ext(c.links.substack)}>Substack ↗</a>
              <a href="${pagePath('about')}" data-go="about">More about me →</a>
            </p>
          </div>
          </div>
        </div>
      </section>

      <section id="guide" class="section setlist">
        <div class="section__glow" aria-hidden="true"></div>
        ${sectionHead('pick a channel', 'Channel guide', 2)}
        <div class="setlist__sides">
          ${['A', 'B']
            .map(
              (side) => `
          <div class="setlist__side">
            <ol class="setlist__list">
              ${PAGES.filter((pg) => pg.side === side && pg.slug !== 'home')
                .map(
                  (pg) => `
              <li class="setlist__item reveal">
                <a href="${pagePath(pg.slug)}" data-go="${pg.slug}">
                  <span class="setlist__title">${esc(pg.title)}</span>
                  <span class="setlist__label">${esc(pg.label)}</span>
                  <span class="setlist__count">${esc(trackCount(pg.slug, c))}</span>
                  <span class="setlist__play" aria-hidden="true">${ICON.play}</span>
                </a>
              </li>`
                )
                .join('')}
            </ol>
          </div>`
            )
            .join('')}
        </div>
      </section>
    </div>

    <div class="page" data-page="about" hidden></div>

    <div class="page" data-page="work" hidden></div>

    <div class="page" data-page="research" hidden></div>

    <div class="page" data-page="education" hidden></div>

    <div class="page" data-page="projects" hidden></div>


    <div class="page" data-page="extras" hidden></div>

    <div class="page" data-page="blog" hidden></div>

    <div class="page" data-page="contact" hidden></div>

  </main>

  <footer class="footer">
    <p>© ${new Date().getFullYear()} ${esc(c.name)}</p>
    <p class="footer__mid">death of a portfolio girl</p>
    <p>made after dark, ${esc(c.location.split(',')[0])}</p>
  </footer>`;
}

/* ---------- pages, rendered the first time each one is opened (router.js) ---------- */

const PAGE_MARKUP = {
  about: (c) => `
      <section id="about" class="section">
        <div class="section__glow" aria-hidden="true"></div>
        ${sectionHead('meet the host', 'About', 0)}
        <div class="about">
          <aside class="card idcard reveal">
            <div class="duotone">
              <img src="${c.photo}" alt="${esc(c.name)}" onerror="this.remove()" />
              <div class="duotone__ph"><span>${esc(c.first[0])}</span></div>
            </div>
            <h3 class="idcard__name">${esc(c.name)}</h3>
            <p class="idcard__role">${esc(c.role)}</p>
            <ul class="idcard__links">
              <li><a href="mailto:${c.email}">${esc(c.email)}</a></li>
              <li><a href="${c.links.linkedin}"${ext(c.links.linkedin)}>LinkedIn ↗</a></li>
              <li><a href="${c.links.github}"${ext(c.links.github)}>GitHub ↗</a></li>
            </ul>
            <a class="btn btn--cv" href="${c.links.cv}" download="${esc(c.name.replace(/ /g, '_'))}_CV.pdf" data-file data-missing="CV coming soon">${ICON.download}<span data-label>Download CV <small>PDF</small></span></a>
          </aside>
          <div class="about__text">
            ${c.about.map((p, i) => `<p class="reveal ${i === 0 ? 'lead' : ''}">${esc(p)}</p>`).join('')}
          </div>
        </div>
      </section>

      <section id="offduty" class="section">
        <div class="section__glow" aria-hidden="true"></div>
        ${sectionHead('out of office', 'Off duty', 2)}
        <div class="offduty">
          <div class="card reveal">
            <h3 class="card__h">Languages</h3>
            <ul class="langs">
              ${c.languages.map((l) => `<li><span>${esc(l.name)}</span><i style="--v:${l.value}"></i><em>${esc(l.level)}</em></li>`).join('')}
            </ul>
          </div>
          <div class="card reveal">
            <h3 class="card__h">Other interests</h3>
            <ul class="interests">${c.interests.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
          </div>
        </div>
      </section>
`,

  work: (c) => `
      <section id="work" class="section">
        <div class="section__glow" aria-hidden="true"></div>
        ${sectionHead("where i've worked", 'Work', 3)}
        ${tracklist(c.work)}
      </section>

      <section id="service" class="section">
        <div class="section__glow" aria-hidden="true"></div>
        ${sectionHead('off the clock, on the ground', 'Leadership & service', 1)}
        ${tracklist(c.service)}
      </section>
`,

  research: (c) => `
      <section id="research" class="section">
        <div class="section__glow" aria-hidden="true"></div>
        ${sectionHead('in the lab', 'Research', 1)}
        ${tracklist(c.research)}
      </section>

      <section id="publications" class="section">
        <div class="section__glow" aria-hidden="true"></div>
        ${sectionHead('in print', 'Papers', 4)}
        <div class="pubs">
          ${c.publications
            .map(
              (p) => `
            <article class="pub card reveal">
              <p class="pub__tag">${esc(p.tag)}</p>
              <h3 class="pub__title">${p.link ? `<a href="${p.link}"${ext(p.link)}>${esc(p.title)}</a>` : esc(p.title)}</h3>
              <p class="pub__note">${esc(p.note)}</p>
            </article>`
            )
            .join('')}
        </div>
      </section>
`,

  education: (c) => `
      <section id="education" class="section">
        <div class="section__glow" aria-hidden="true"></div>
        ${sectionHead('where it started', 'Education', 2)}
        ${tracklist(c.education)}
      </section>

`,

  projects: (c) => `
      <section id="projects" class="section section--wide">
        <div class="section__glow" aria-hidden="true"></div>
        ${sectionHead('things i built', 'Projects', 5)}
        ${records(c.projects.filter((p) => !p.freelance))}
      </section>

      <section id="freelance" class="section section--wide">
        <div class="section__glow" aria-hidden="true"></div>
        ${sectionHead('client work with nozel, my web studio', 'Freelance', 2)}
        ${records(c.projects.filter((p) => p.freelance))}
      </section>

      <section id="gallery" class="section section--wide">
        <div class="section__glow" aria-hidden="true"></div>
        ${sectionHead('the scrapbook', 'Gallery', 4)}
        <div class="gallery__filters" role="group" aria-label="Filter the gallery">
          ${['All', ...new Set(c.gallery.map((g) => g.kind))]
            .map((k, i) => `<button class="chip gallery__filter${i === 0 ? ' is-on' : ''}" data-kind="${esc(k)}" aria-pressed="${i === 0}">${esc(k)}</button>`)
            .join('')}
        </div>
        <div class="gallery">
          ${c.gallery
            .map(
              (g, i) => `
            <figure class="gallery__item reveal" data-kind="${esc(g.kind)}">
              <button class="gallery__open" data-i="${i}" aria-label="Open ${esc(g.title)}">
                <img src="${import.meta.env.BASE_URL}gallery/${g.src}" alt="${esc(g.title)}: ${esc(g.note)}" loading="lazy" decoding="async" />
              </button>
              <figcaption><strong>${esc(g.title)}</strong><span>${esc(g.note)}</span></figcaption>
            </figure>`
            )
            .join('')}
        </div>
        <dialog class="lightbox" aria-label="Gallery image">
          <button class="lightbox__close" aria-label="Close">×</button>
          <button class="lightbox__nav lightbox__prev" aria-label="Previous">‹</button>
          <figure><img alt="" /><figcaption></figcaption></figure>
          <button class="lightbox__nav lightbox__next" aria-label="Next">›</button>
        </dialog>
      </section>
`,

  extras: (c) => `
      <section id="brain" class="section">
        <div class="section__glow" aria-hidden="true"></div>
        ${sectionHead('who really cares (i do)', 'Brain facts', 1)}
        <div class="mini-tv reveal">
          <div class="mini-tv__ant" aria-hidden="true"></div>
          <div class="mini-tv__body">
            <div class="mini-tv__screen">
              <canvas class="mini-tv__static"></canvas>
              <p class="mini-tv__ch">CH 01</p>
              <p class="mini-tv__fact" aria-live="polite"></p>
              <div class="mini-tv__scan"></div>
            </div>
            <div class="mini-tv__panel">
              <button class="knob" data-dir="-1" aria-label="Previous fact">◂</button>
              <button class="knob" data-dir="1" aria-label="Next fact">▸</button>
              <span class="mini-tv__hint">turn<br />the dial</span>
            </div>
          </div>
        </div>
      </section>

      <section id="quotes" class="section">
        <div class="section__glow" aria-hidden="true"></div>
        ${sectionHead('words on repeat', 'Quotes', 2)}
        <div class="quotes">
          ${c.quotes
            .map(
              (q, i) => `
          <figure class="quote reveal${i === 0 ? ' quote--lead' : ''}">
            <blockquote><p>${quoteText(q)}</p></blockquote>
            <figcaption><strong>${esc(q.who)}</strong>${q.source ? `<span>${esc(q.source)}</span>` : ''}</figcaption>
          </figure>`
            )
            .join('')}
        </div>
      </section>
`,

  blog: (c) => `
      <section id="blog" class="section">
        <div class="section__glow" aria-hidden="true"></div>
        ${sectionHead('notes from the night shift', 'Blog', 3)}
        <p class="blog__intro reveal">I write about attention, brains and the machines we build to copy them, on Substack.</p>
        <div class="posts" aria-live="polite"></div>
        <p class="blog__actions reveal">
          <a class="btn btn--cv" href="${c.links.substack}/subscribe" target="_blank" rel="noopener"><span>Subscribe on Substack</span></a>
          <a class="btn btn--ghost" href="${c.links.substack}" target="_blank" rel="noopener">Read all posts ↗</a>
        </p>
      </section>
`,

  contact: (c) => `
      ${waveBand('wp2', 'SAY HELLO ✺ SAY HELLO ✺ ', 'blush')}

      <section id="contact" class="section contact">
        <div class="section__glow" aria-hidden="true"></div>
        ${sectionHead("i'd love to hear from you", 'Contact', 3)}
        <div class="contact__grid">
          <div class="contact__vinyl reveal">${vinyl('var(--pink)', 'side B')}</div>
          <div class="contact__links reveal">
            <a class="big-link" href="mailto:${c.email}">${esc(c.email)}</a>
            <a class="big-link" href="${c.links.linkedin}"${ext(c.links.linkedin)}>LinkedIn ↗</a>
            <a class="big-link" href="${c.links.github}"${ext(c.links.github)}>GitHub ↗</a>
            <a class="big-link" href="${c.links.substack}"${ext(c.links.substack)}>Substack ↗</a>
            <a class="big-link" href="${c.links.cv}" download="${esc(c.name.replace(/ /g, '_'))}_CV.pdf" data-file data-missing="CV coming soon">Download my CV (PDF) ↓</a>
          </div>
        </div>
      </section>
`,

};

export const renderPage = (slug, c) => PAGE_MARKUP[slug]?.(c) ?? '';
