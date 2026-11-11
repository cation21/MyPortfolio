import '@fontsource/bagel-fat-one';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/fraunces/opsz-italic.css';
import '@fontsource-variable/instrument-sans';
import '@fontsource/share-tech-mono';
import 'lenis/dist/lenis.css';
import './style.css';
import gsap from 'gsap';
import { content } from './content.js';
import { renderSite, renderPage, TRACKS, trackCount } from './render.js';
import { createRouter } from './router.js';
import { hideMissingFiles } from './files.js';
import { initScroll } from './scroll.js';
import { createReveals } from './reveals.js';
import { initTransitions } from './transition.js';
import { initNav } from './nav.js';
import { initCursor } from './cursor.js';
import { createPlayer } from './player/player.js';
import { bindControls } from './player/controls.js';
import { initTV } from './player/tv.js';
import { initFrameLabel } from './player/frame.js';
import { initNight } from './night.js';

// Composition root: build each piece and hand it what it needs.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

renderSite(content);

// pages are loaded on demand: built the first time they're opened, with any code they need fetched then
const PAGE_SETUP = {
  projects: async (el) => (await import('./gallery.js')).initGallery(el.querySelector('#gallery'), content.gallery),
  brain: async (el) => (await import('./facts-tv.js')).initMiniTV(el.querySelector('.mini-tv'), content.facts),
  blog: async (el) => (await import('./blog.js')).initBlog(el),
};
const router = createRouter({
  name: content.name,
  renderPage: (slug) => renderPage(slug, content),
  onFirstShow: (slug, el) => {
    hideMissingFiles(el); // e.g. the CV buttons, until public/cv.pdf exists
    PAGE_SETUP[slug]?.(el);
  },
});
router.show(router.slugFromLocation());
initNight(document.getElementById('night'), { router, reduceMotion });

const scroll = initScroll({ reduceMotion });
const transitions = initTransitions({ router, scroll, reveals: createReveals(), reduceMotion });

// the TV: one model, two views. Its channels are the pages.
const tracks = TRACKS.map((t) => ({ ...t, count: trackCount(t.slug, content) }));
const player = createPlayer({ tracks, reduceMotion });
const hero = document.querySelector('.hero');
const frame = document.querySelector('.frame');
const tv = initTV(hero, player, router, { reduceMotion });
initFrameLabel(frame, router);

// the TV in the room: previous/next change the channel, play watches it full screen
bindControls(hero, { prev: () => player.step(-1), next: () => player.step(1), play: () => player.play() });
// the full-screen TV: previous/next go to the neighbouring page, power goes back home
bindControls(frame, { prev: () => transitions.step(-1), next: () => transitions.step(1), power: () => transitions.home() });
player.on('play', ({ slug }) => transitions.goTo(slug));

// back home, the TV is tuned to the page you just left
router.onChange((slug) => { if (slug !== 'home') player.selectSlug(slug); });
if (router.current !== 'home') player.selectSlug(router.current);

const nav = initNav(document.querySelector('.nav'), router, transitions);
// on home, the nav lights up the channel that's on the TV
const tuneNav = () => nav.tune(player.track.slug);
player.on('change', ({ key }) => key === 'selected' && tuneNav());
tuneNav();
initCursor(document.querySelector('.cursor'));

hideMissingFiles(document.querySelector('[data-page="home"]'));

/* intro: the room is dark, the TV rises and switches on, and its light fills the room */
const dark = document.querySelector('.intro-dark');
gsap.timeline({ delay: 0.15 })
  .to(dark, { opacity: 0, duration: reduceMotion ? 0.3 : 1.4, ease: 'power2.inOut' })
  .from('.tv__set', { y: 60, opacity: 0, duration: 1.4, ease: 'power3.out' }, 0.3)
  .from('.tv__shadow', { opacity: 0, duration: 1.2 }, 0.6)
  .from('.nav', { y: -30, opacity: 0, duration: 1 }, 0.8)
  .from('.hero__cue', { opacity: 0, y: 20, duration: 1 }, 1.4)
  .add(() => tv.boot(), 1.0)
  .set(dark, { display: 'none' });
