import gsap from 'gsap';
import { createStatic } from './fx/static.js';

/* Brain-facts mini TV */
export function initMiniTV(root, facts) {
  const canvas = root.querySelector('.mini-tv__static');
  const factEl = root.querySelector('.mini-tv__fact');
  const chEl = root.querySelector('.mini-tv__ch');
  const fx = createStatic(canvas, { w: 160, h: 120, fps: 24 });
  let i = 0;
  const set = () => {
    factEl.textContent = facts[i];
    chEl.textContent = `CH ${String(i + 1).padStart(2, '0')} / ${String(facts.length).padStart(2, '0')}`;
  };
  set();
  gsap.set(canvas, { opacity: 0.08 });
  fx.start();

  const go = (dir) => {
    i = (i + dir + facts.length) % facts.length;
    gsap.timeline()
      .to(canvas, { opacity: 1, duration: 0.04 })
      .to(factEl, { autoAlpha: 0, duration: 0.04 }, '<')
      .call(set, null, '+=0.3')
      .to(canvas, { opacity: 0.08, duration: 0.35, ease: 'steps(4)' })
      .to(factEl, { autoAlpha: 1, duration: 0.1 }, '<0.1');
  };
  root.querySelectorAll('.knob').forEach((b) =>
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      gsap.fromTo(b, { rotate: 0 }, { rotate: Number(b.dataset.dir) * 90, duration: 0.4, ease: 'back.out(2)' });
      go(Number(b.dataset.dir));
    })
  );
  root.querySelector('.mini-tv__screen').addEventListener('click', () => go(1));
}
