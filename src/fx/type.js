import gsap from 'gsap';

// Types `text` into `el`, each letter flickering through a random glyph first.
export function typeInto(el, text, speed = 0.045) {
  const tl = gsap.timeline();
  const chars = [...text];
  const glyphs = '#%&*+/<>=?@ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  chars.forEach((ch, i) => {
    tl.call(() => {
      const done = chars.slice(0, i).join('');
      el.textContent = done + (ch === ' ' ? ' ' : glyphs[(Math.random() * glyphs.length) | 0]);
    }, null, i * speed);
    tl.call(() => { el.textContent = chars.slice(0, i + 1).join(''); }, null, i * speed + speed * 0.6);
  });
  return tl;
}
