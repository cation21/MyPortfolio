import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Scroll-in animations for one page. Hidden pages have no size, so each page's
// triggers are created the first time it is shown (see createReveals().prepare).
export function createReveals() {
  const ready = new Set();

  function prepare(pageEl) {
    if (!pageEl || ready.has(pageEl)) return;
    ready.add(pageEl);
    const $$ = (s) => [...pageEl.querySelectorAll(s)];

    // the TV sinks a little as you scroll past it
    $$('.hero').forEach((hero) => {
      // a plain slide snapped to whole pixels: scaling it left hairlines at the edges of its glowing layers
      const tv = hero.querySelector('.tv');
      gsap.to(tv, {
        y: () => Math.round(tv.offsetHeight * 0.14), ease: 'none', snap: { y: 1 },
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
      });
    });

    // section titles rise out of blur
    $$('.section').forEach((sec) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 72%', once: true } });
      tl.fromTo(sec.querySelector('.section__glow'), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' })
        .to(sec.querySelector('.section__glow'), { opacity: 0.25, duration: 1.6, ease: 'power2.inOut' })
        .fromTo(
          sec.querySelectorAll('.section__title .ch'),
          { y: 70, opacity: 0, filter: 'blur(14px)', rotate: () => gsap.utils.random(-14, 14) },
          { y: 0, opacity: 1, filter: 'blur(0px)', rotate: 0, duration: 1.1, ease: 'expo.out', stagger: 0.045 },
          0.1
        )
        .fromTo(sec.querySelector('.kicker'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 0.1)
        .fromTo(sec.querySelector('.section__halo ellipse'), { strokeDashoffset: 1300 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.out' }, 0.3);
    });

    $$('.reveal').forEach((el) => {
      gsap.fromTo(el, { y: 50, opacity: 0, filter: 'blur(10px)' }, {
        y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out', clearProps: 'filter',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });

    // project records slide out of their sleeves
    $$('.record').forEach((rec) => {
      gsap.fromTo(rec.querySelector('.vinyl'), { xPercent: 0, rotate: 0 }, {
        xPercent: 34, rotate: 120, ease: 'power2.out', duration: 1.4,
        scrollTrigger: { trigger: rec, start: 'top 75%', once: true },
      });
    });

    // wave text bands
    $$('.wave-band').forEach((band) => {
      const bi = Number(band.querySelector('path').id.replace(/\D/g, '')) || 0; // wp1, wp2 ... alternate their curve
      const tp = band.querySelector('textPath');
      let d = 'M -600 110';
      for (let x = -600; x < 9000; x += 360) d += ` Q ${x + 180} ${bi % 2 ? 135 : 85} ${x + 360} 110`;
      band.querySelector('path').setAttribute('d', d);
      tp.textContent = tp.textContent.repeat(10);
      const unitLen = band.querySelector('text').getComputedTextLength() / 10 || 900;
      const obj = { o: 0 };
      // the text only scrolls while the band is on screen (it re-lays out the text every frame)
      const marquee = gsap.to(obj, { o: -unitLen, duration: 14, ease: 'none', repeat: -1, paused: true, onUpdate: () => tp.setAttribute('startOffset', obj.o) });
      ScrollTrigger.create({ trigger: band, start: 'top bottom', end: 'bottom top', onToggle: (st) => (st.isActive ? marquee.play() : marquee.pause()) });
      gsap.fromTo(band.querySelector('svg'), { yPercent: 20 }, {
        yPercent: -20, ease: 'none',
        scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }

  return { prepare };
}
