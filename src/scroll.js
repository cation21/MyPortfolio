import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// Smooth scrolling, shared by everything that scrolls the page.
export function initScroll({ reduceMotion = false } = {}) {
  const lenis = new Lenis({ lerp: 0.085, smoothWheel: !reduceMotion });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  window.addEventListener('load', () => ScrollTrigger.refresh());

  const NAV_OFFSET = -80; // keep anchors clear of the fixed nav
  return {
    toTop: (immediate = false) => lenis.scrollTo(0, { immediate, force: true }),
    toElement: (el) => lenis.scrollTo(el, { offset: NAV_OFFSET }),
    refresh: () => ScrollTrigger.refresh(),
  };
}
