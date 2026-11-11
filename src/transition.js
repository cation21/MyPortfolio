import gsap from 'gsap';
import { createStatic } from './fx/static.js';

/**
 * Page navigation, told as a TV:
 *  - home -> a page: the TV's screen grows until it fills the window. You're now
 *    watching that page full screen, inside the TV's bezel, with its buttons below.
 *  - page -> page: a channel change inside the full-screen TV (static + the page's name).
 *  - a page -> home: the screen shrinks back into the TV in the room.
 * Also handles [data-go] links, in-page #anchors, and back/forward.
 */
export function initTransitions({ router, scroll, reveals, reduceMotion = false }) {
  const frame = document.querySelector('.frame');
  const panel = frame.querySelector('.frame__panel');
  const caseEl = frame.querySelector('.frame__case');
  const glass = frame.querySelector('.frame__glass');
  const staticEl = frame.querySelector('.frame__static');
  const title = frame.querySelector('.frame__title');
  const noise = createStatic(staticEl, { w: 200, h: 120, fps: 30 });
  const listeners = [];
  let running = null; // the transition in progress, if any

  /* the screen "hole" in the bezel, as insets from the window edges */
  const FULL = { wide: { l: 16, t: 16, r: 16, b: 92, rad: 26 }, narrow: { l: 8, t: 8, r: 8, b: 76, rad: 18 } };
  const fullHole = () => (window.matchMedia('(max-width: 760px)').matches ? FULL.narrow : FULL.wide);
  const tvHole = () => {
    const r = document.querySelector('.tv__screen').getBoundingClientRect();
    return { l: r.left, t: r.top, r: window.innerWidth - r.right, b: window.innerHeight - r.bottom, rad: r.width * 0.08 };
  };
  // the window currently cut in the case; tweened as plain numbers, then painted as a clip-path
  // (cheap to animate, unlike the giant box-shadow it replaces)
  const hole = { l: 0, t: 0, r: 0, b: 0, rad: 0, shade: 0 };
  function paint() {
    const W = window.innerWidth, H = window.innerHeight;
    const x1 = hole.l, y1 = hole.t, x2 = W - hole.r, y2 = H - hole.b;
    const R = Math.max(0, Math.min(hole.rad, (x2 - x1) / 2, (y2 - y1) / 2));
    caseEl.style.clipPath = `path(evenodd, "M0 0H${W}V${H}H0Z M${x1 + R} ${y1}H${x2 - R}A${R} ${R} 0 0 1 ${x2} ${y1 + R}V${y2 - R}A${R} ${R} 0 0 1 ${x2 - R} ${y2}H${x1 + R}A${R} ${R} 0 0 1 ${x1} ${y2 - R}V${y1 + R}A${R} ${R} 0 0 1 ${x1 + R} ${y1}Z")`;
    caseEl.style.opacity = hole.shade;
    frame.style.setProperty('--hl', `${hole.l}px`);
    frame.style.setProperty('--ht', `${hole.t}px`);
    frame.style.setProperty('--hr', `${hole.r}px`);
    frame.style.setProperty('--hb', `${hole.b}px`);
    frame.style.setProperty('--hrad', `${hole.rad}px`);
  }
  const setHole = (h) => { Object.assign(hole, h); paint(); };
  const moveHole = (to) => ({ ...to, onUpdate: paint });
  // function-based values are read when the tween starts, i.e. after the page has changed
  const lazy = (get) => ({ l: () => get().l, t: () => get().t, r: () => get().r, b: () => get().b, rad: () => get().rad });

  function showPage(slug) {
    router.show(slug);
    scroll.toTop(true);
    reveals.prepare(router.el(slug));
    scroll.refresh();
  }

  function setFrame(on) {
    frame.classList.toggle('is-on', on);
    gsap.set(frame, { autoAlpha: on ? 1 : 0 });
    setHole({ ...fullHole(), shade: on ? 1 : 0 });
    gsap.set(glass, { opacity: on ? 1 : 0 });
    gsap.set(panel, { yPercent: on ? 0 : 100 });
    gsap.set([staticEl, title], { opacity: 0 });
  }
  window.addEventListener('resize', () => { if (frame.classList.contains('is-on') && !running) setHole(fullHole()); });

  function goTo(slug, { push = true } = {}) {
    if (!router.has(slug)) return;
    // a new request wins: finish the running transition at once (its page change included)
    running?.progress(1);
    const from = router.current;
    if (slug === from) { scroll.toTop(); return; }
    if (push) history.pushState({ slug }, '', router.path(slug));
    listeners.forEach((fn) => fn(slug));
    if (reduceMotion) { showPage(slug); setFrame(slug !== 'home'); return; }

    title.textContent = slug === 'home' ? '' : router.meta(slug).title;
    noise.start();
    const done = () => { running = null; noise.stop(); setFrame(slug !== 'home'); };
    const tl = (running = gsap.timeline({ onComplete: done }));

    if (from === 'home') {
      // zoom in: the bezel closes around the TV's screen, then the screen grows to fill the window
      frame.classList.add('is-on');
      setHole({ ...tvHole(), shade: 0 });
      tl.set(frame, { autoAlpha: 1 })
        .set(glass, { opacity: 0 })
        .set(panel, { yPercent: 100 })
        .set([staticEl, title], { opacity: 0 })
        .to(hole, moveHole({ shade: 1, duration: 0.25, ease: 'power2.out' }))
        .to(staticEl, { opacity: 1, duration: 0.12 }, 0.1)
        .add(() => showPage(slug), 0.3)
        .to(hole, moveHole({ ...fullHole(), duration: 0.7, ease: 'power3.inOut' }), 0.3)
        .to(panel, { yPercent: 0, duration: 0.5, ease: 'power3.out' }, 0.6)
        .fromTo(title, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.25 }, 0.55)
        .to(glass, { opacity: 1, duration: 0.3 }, 1.0)
        .to([staticEl, title], { opacity: 0, duration: 0.3, ease: 'steps(4)' }, 1.05);
    } else if (slug === 'home') {
      // zoom out: static, the home page comes back underneath, the screen shrinks into the TV
      tl.to(staticEl, { opacity: 1, duration: 0.1 })
        .to(glass, { opacity: 0, duration: 0.1 }, 0)
        .add(() => showPage('home'), 0.12)
        .to(panel, { yPercent: 100, duration: 0.3, ease: 'power2.in' }, 0.12)
        .to(hole, moveHole({ ...lazy(tvHole), duration: 0.65, ease: 'power3.inOut' }), 0.18)
        .to(staticEl, { opacity: 0, duration: 0.25, ease: 'steps(3)' }, 0.72)
        .to(hole, moveHole({ shade: 0, duration: 0.3, ease: 'power2.in' }), 0.82);
    } else {
      // channel change inside the full-screen TV
      tl.to(staticEl, { opacity: 1, duration: 0.06 })
        .fromTo(title, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.18 }, 0.05)
        .add(() => showPage(slug), 0.3)
        .to([staticEl, title], { opacity: 0, duration: 0.25, ease: 'steps(3)' }, 0.55);
    }
  }

  // previous / next page, like changing channel; false at either end
  function step(dir) {
    running?.progress(1); // so a quick double-press moves two pages, not one
    const next = router.pages[router.index + dir];
    if (!next) return false;
    goTo(next.slug);
    return true;
  }

  document.addEventListener('click', (e) => {
    // let ctrl/cmd/shift/middle clicks open links in a new tab as usual
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const page = e.target.closest('[data-go]');
    if (page) { e.preventDefault(); goTo(page.dataset.go); return; }
    const anchor = e.target.closest('a[href^="#"]');
    const target = anchor && anchor.getAttribute('href').length > 1 && document.querySelector(anchor.getAttribute('href'));
    if (target) { e.preventDefault(); scroll.toElement(target); }
  });

  window.addEventListener('popstate', () => goTo(router.slugFromLocation(), { push: false }));

  // first page: arriving straight on a page means the TV is already full screen
  setFrame(router.current !== 'home');
  reveals.prepare(router.el(router.current));
  // an old one-page link (/#about) becomes the real page URL
  if (location.hash && router.has(location.hash.slice(1))) history.replaceState({ slug: router.current }, '', router.path(router.current));

  return { goTo, step, home: () => goTo('home'), onNavigate: (fn) => listeners.push(fn) };
}
