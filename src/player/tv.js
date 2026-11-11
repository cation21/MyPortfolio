import gsap from 'gsap';
import { typeInto } from '../fx/type.js';
import { createStatic } from '../fx/static.js';
import { glitchText, trackLabel } from './controls.js';

/**
 * The TV on the home page. Its screen shows the selected page and throws light
 * up into the room, onto the welcome text. Changing channel bursts into static;
 * play makes the screen flare before the page changes. Buttons are wired by
 * bindControls (main.js); the arrow keys and Enter are handled here.
 */
export function initTV(root, player, router, { reduceMotion = false } = {}) {
  const $ = (s) => root.querySelector(s);
  const el = {
    light: $('.tv__light'),
    dust: $('.tv__dust'),
    screen: $('.tv__screen'),
    picture: $('.tv__picture'),
    staticCanvas: $('.tv__static'),
    name: $('.tv__name'),
    ch: $('.tv__ch'),
    about: $('.tv__about'),
  };
  const pad = (n) => String(n).padStart(2, '0');
  const typed = [...root.querySelectorAll('.tv__title [data-type]')];
  const letters = root.querySelectorAll('.tv__title .lp__name .ch');
  const noise = createStatic(el.staticCanvas, { w: 160, h: 110, fps: 24 });
  typed.forEach((t) => (t.textContent = ''));
  gsap.set(letters, { autoAlpha: 0 });
  gsap.set([el.light, el.dust], { autoAlpha: 0 });
  gsap.set(el.picture, { autoAlpha: 0 });
  if (!reduceMotion) gsap.set(el.screen, { '--on': 0 }); // the tube is off until boot()

  /* what's on screen: the page play will open */
  function showChannel() {
    const { selected, tracks } = player.state;
    const t = tracks[selected];
    glitchText(el.name, trackLabel(t));
    el.name.setAttribute('href', router.path(t.slug));
    el.name.dataset.go = t.slug;
    el.ch.textContent = `CH ${pad(selected + 1)} / ${pad(tracks.length)}`;
    el.about.textContent = t.count ? `${t.label} ♪ ${t.count}` : t.label;
  }

  // a short burst of static between channels; the light in the room flickers with it
  let burst;
  function changeChannel() {
    if (reduceMotion) { showChannel(); return; }
    burst?.kill();
    noise.start();
    burst = gsap.timeline({ onComplete: () => noise.stop() })
      .set(el.staticCanvas, { opacity: 1 })
      .set(el.picture, { opacity: 0 })
      .to(el.light, { opacity: 0.55, duration: 0.06 }, 0)
      .add(showChannel, 0.16)
      .to(el.staticCanvas, { opacity: 0, duration: 0.18, ease: 'steps(3)' }, 0.2)
      .to(el.picture, { opacity: 1, duration: 0.12 }, 0.24)
      .to(el.light, { opacity: 1, duration: 0.3 }, 0.24);
  }

  player.on('change', ({ key, state }) => {
    if (key === 'selected') changeChannel();
    root.classList.toggle('is-tuning', state.tuning);
    // play: the screen and its light flare before the page changes
    if (key === 'tuning' && state.tuning && !reduceMotion) {
      gsap.timeline()
        .to(el.screen, { filter: 'brightness(1.6)', duration: 0.12 })
        .to(el.light, { opacity: 1, scale: 1.04, duration: 0.12 }, 0)
        .to(el.screen, { filter: 'brightness(1)', duration: 0.4 })
        .to(el.light, { scale: 1, duration: 0.4 }, '<');
    }
  });
  showChannel();

  /* keep the cone of light rooted in the lamp on top of the set, at any size */
  const tvEl = $('.tv');
  const rise = $('.tv__rise');
  const ears = $('.tv__ears');
  function alignLight() {
    const box = rise.getBoundingClientRect();
    if (!box.width) return;
    const scale = box.width / rise.offsetWidth; // the TV may be scaled while scrolling
    const lampY = (ears.getBoundingClientRect().bottom - box.top) / scale - ears.offsetWidth * 0.02; // the lamp's centre line
    tvEl.style.setProperty('--lamp-y', `${lampY - el.light.offsetTop}px`);
  }
  new ResizeObserver(alignLight).observe(tvEl);
  router.onChange((slug) => slug === 'home' && requestAnimationFrame(alignLight));
  alignLight();

  /* keys: ← → change channel, Enter plays it (only on the home page) */
  window.addEventListener('keydown', (e) => {
    if (router.current !== 'home' || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest('input, textarea, select, [contenteditable], .nav.open')) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); player.step(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); player.step(1); }
    // Enter on a focused link or button should do its own thing
    if (e.key === 'Enter' && (e.target === document.body || e.target.closest('.tv__set'))) { e.preventDefault(); player.play(); }
  });

  /* boot: the screen switches on from a bright line, its light fills the room, then the welcome types in */
  function boot() {
    if (reduceMotion) {
      gsap.set([el.light, el.dust, el.picture], { autoAlpha: 1 });
      typed.forEach((t) => (t.textContent = t.dataset.type));
      gsap.set(letters, { autoAlpha: 1 });
      return gsap.timeline();
    }
    const tl = gsap.timeline();
    noise.start();
    tl.fromTo(el.screen, { '--on': 0 }, { '--on': 1, duration: 0.5, ease: 'expo.out' })
      .set(el.staticCanvas, { opacity: 1 }, 0)
      .to(el.staticCanvas, { opacity: 0, duration: 0.3, ease: 'steps(4)', onComplete: () => noise.stop() }, 0.55)
      .to(el.picture, { autoAlpha: 1, duration: 0.2 }, 0.75)
      .fromTo(el.light, { autoAlpha: 0, scaleY: 0.2 }, { autoAlpha: 1, scaleY: 1, duration: 0.9, ease: 'power2.out', transformOrigin: '50% 100%' }, 0.4)
      .to(el.dust, { autoAlpha: 1, duration: 1 }, 0.9);

    let at = 0.9;
    gsap.set(letters, { y: '0.3em' });
    typed.forEach((t, i) => {
      if (i === 1) {
        tl.to(letters, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'back.out(2)' }, at);
        at += letters.length * 0.06 + 0.1;
      }
      const speed = t.matches('.tv__role') ? 0.022 : 0.055; // the long line types faster
      tl.add(typeInto(t, t.dataset.type, speed), at);
      at += t.dataset.type.length * speed * 0.7 + 0.15;
    });
    return tl;
  }

  return { boot };
}
