import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Top navigation: burger menu, the current page (or, on home, the channel on the TV), and a darker bar once scrolled.
export function initNav(navEl, router, transitions) {
  const burger = navEl.querySelector('.nav__burger');
  const links = [...navEl.querySelectorAll('.nav__links a')];
  let tuned = null; // the channel on the TV in the room

  const setOpen = (open) => {
    navEl.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  };
  burger.addEventListener('click', () => setOpen(!navEl.classList.contains('open')));
  transitions.onNavigate(() => setOpen(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

  // on a page, its link is current; on home, the link for the channel on screen is lit
  const mark = () => links.forEach((l) => {
    const current = l.dataset.go === router.current;
    l.classList.toggle('active', current || (router.current === 'home' && l.dataset.go === tuned));
    current ? l.setAttribute('aria-current', 'page') : l.removeAttribute('aria-current');
  });
  router.onChange(mark);
  mark();

  ScrollTrigger.create({ start: 80, onToggle: (s) => navEl.classList.toggle('scrolled', s.isActive) });

  return { tune: (slug) => { tuned = slug; mark(); } };
}
