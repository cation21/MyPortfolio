/* The night behind every page: a near-black sky warming to a pink horizon, faint stars
   with a little of the album's cobalt high up, and on the home page a neon perspective
   grid the TV stands on, its rows rolling towards you. Content pages get the sky only.

   Kept cheap on purpose:
   - everything that doesn't move (sky, glow, floor, the grid's long lines) is painted once
     into an offscreen canvas and only repainted when the window or horizon changes;
   - each frame just copies that, then draws the stars and the grid's rows, at 30 fps;
   - the TV's position is read on scroll and resize, never every frame. */

const read = (name) => getComputedStyle(document.documentElement).getPropertyValue(`--${name}-rgb`).trim().split(/\s+/).map(Number);
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const FRAME_MS = 1000 / 30;

function rng(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

export function initNight(canvas, { router, reduceMotion = false }) {
  const ctx = canvas.getContext('2d');
  const base = document.createElement('canvas'); // the still layer
  const bctx = base.getContext('2d');
  const C = { ink: read('ink'), night: read('night'), plum: read('plum'), wine: read('wine'), pink: read('pink'), cobalt: read('cobalt'), cream: read('cream') };
  const GRID = [255, 111, 181];
  let W = 0, H = 0, dpr = 1, stars = [], hz = null, baseKey = '';

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth;
    H = window.innerHeight;
    for (const c of [canvas, base]) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
    const R = rng(5);
    stars = Array.from({ length: Math.round((W * H) / 6000) }, () => ({
      x: R() * W, y: R() * H, s: 0.8 + R() * 1.8, a: 0.2 + R() * 0.65, tw: 0.5 + R() * 2, ph: R() * 6,
      c: R() < 0.22 ? 'rgba(160,172,255,' : 'rgba(255,242,248,',
    }));
    measure();
  }

  // where the floor meets the sky: the bottom of the TV's screen, while the home page shows
  function measure() {
    hz = null;
    if (router.current === 'home') {
      const screen = document.querySelector('.tv__screen')?.getBoundingClientRect();
      const hero = document.querySelector('.hero')?.getBoundingClientRect();
      if (screen?.width && hero && hero.bottom > 0) hz = { y: Math.round(screen.bottom), x: Math.round(screen.left + screen.width / 2), bottom: Math.round(Math.min(H, hero.bottom)) };
    }
  }

  // paint the parts that don't move, only when something about them changed
  function paintBase() {
    const key = `${W}x${H}:${hz ? `${hz.x},${hz.y},${hz.bottom}` : '-'}`;
    if (key === baseKey) return;
    baseKey = key;
    const g = bctx;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const skyEnd = hz ? hz.y : H;
    const sky = g.createLinearGradient(0, 0, 0, skyEnd);
    sky.addColorStop(0, rgba(C.ink, 1));
    sky.addColorStop(0.55, rgba(C.night, 1));
    sky.addColorStop(0.88, rgba(C.plum, 1));
    sky.addColorStop(1, hz ? rgba(C.wine, 1) : rgba(C.plum, 1));
    g.fillStyle = sky;
    g.fillRect(0, 0, W, H);
    const band = g.createRadialGradient(W / 2, 0, 0, W / 2, 0, Math.max(W, H) * 0.7); // the album's cobalt, high up
    band.addColorStop(0, rgba(C.cobalt, 0.16));
    band.addColorStop(1, rgba(C.cobalt, 0));
    g.fillStyle = band;
    g.fillRect(0, 0, W, H);
    if (!hz) return;
    const glow = g.createRadialGradient(hz.x, hz.y, 0, hz.x, hz.y, Math.max(W, H) * 0.45); // the horizon glows behind the TV
    glow.addColorStop(0, rgba(C.pink, 0.55));
    glow.addColorStop(1, rgba(C.pink, 0));
    g.fillStyle = glow;
    g.fillRect(0, 0, W, H);
    const depth = hz.bottom - hz.y;
    if (depth <= 0) return;
    const floor = g.createLinearGradient(0, hz.y, 0, hz.bottom);
    floor.addColorStop(0, rgba(C.plum, 1));
    floor.addColorStop(1, rgba(C.ink, 1));
    g.fillStyle = floor;
    g.fillRect(0, hz.y, W, depth);
    g.save();
    g.beginPath(); g.rect(0, hz.y, W, depth); g.clip();
    const spread = W / 12;
    for (let i = -24; i <= 24; i++) { // the long lines, running to the vanishing point (a soft wide stroke under a thin one reads as glow)
      const a = Math.max(0, 0.55 - Math.abs(i) * 0.012);
      for (const [w, k] of [[5, 0.18], [1.4, 1]]) {
        g.strokeStyle = rgba(GRID, a * k); g.lineWidth = w;
        g.beginPath(); g.moveTo(hz.x + i * 6, hz.y); g.lineTo(hz.x + i * spread, hz.y + depth * 1.4); g.stroke();
      }
    }
    g.restore();
    const pool = g.createRadialGradient(hz.x, hz.y + 60, 0, hz.x, hz.y + 60, 330); // the TV's pool of light on the floor
    pool.addColorStop(0, rgba(C.pink, 0.32));
    pool.addColorStop(1, rgba(C.pink, 0));
    g.fillStyle = pool;
    g.fillRect(0, hz.y, W, depth);
    // the floor fades into the night at the end of the home section, and the sky below it stays dark
    const fade = Math.min(160, depth);
    const end = g.createLinearGradient(0, hz.bottom - fade, 0, hz.bottom);
    end.addColorStop(0, rgba(C.ink, 0));
    end.addColorStop(1, rgba(C.ink, 1));
    g.fillStyle = end;
    g.fillRect(0, hz.bottom - fade, W, fade);
    if (hz.bottom < H) { g.fillStyle = rgba(C.ink, 1); g.fillRect(0, hz.bottom, W, H - hz.bottom); }
  }

  function draw(t) {
    paintBase();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(base, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (const s of stars) { // stars, twinkling, above the horizon
      if (hz && s.y > hz.y - 20) continue;
      ctx.fillStyle = s.c + (s.a * (0.55 + 0.45 * Math.sin(t * s.tw + s.ph))).toFixed(2) + ')';
      ctx.fillRect(s.x, s.y, s.s, s.s);
    }
    if (!hz) return;
    const depth = hz.bottom - hz.y;
    if (depth <= 0) return;
    ctx.save();
    ctx.beginPath(); ctx.rect(0, hz.y, W, depth); ctx.clip();
    const roll = (t * 0.35) % 1;
    for (let k = 0; k < 14; k++) { // the rows, rolling towards you
      const z = (k + roll) / 14, y = hz.y + depth * 1.4 * z * z, a = 0.15 + z * 0.6;
      for (const [w, f] of [[4 + z * 5, 0.2], [1 + z * 1.6, 1]]) {
        ctx.strokeStyle = rgba(GRID, a * f); ctx.lineWidth = w;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
    }
    ctx.restore();
  }

  size();
  window.addEventListener('resize', size);
  let pending = false; // re-measure on scroll, at most once per frame
  window.addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(() => { pending = false; measure(); }); } }, { passive: true });
  router.onChange(() => requestAnimationFrame(measure));
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body);

  if (reduceMotion) { // a still scene, repainted only when something moves
    const still = () => draw(0);
    window.addEventListener('scroll', () => requestAnimationFrame(still), { passive: true });
    window.addEventListener('resize', () => requestAnimationFrame(still));
    router.onChange(() => requestAnimationFrame(still));
    requestAnimationFrame(still);
    return;
  }
  let t = 0, last = performance.now(), acc = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    if (document.hidden) { last = now; return; }
    const dt = Math.min(now - last, 100);
    last = now;
    acc += dt;
    if (acc < FRAME_MS) return; // 30 fps is plenty for twinkling and a slow roll
    t += acc / 1000;
    acc = 0;
    draw(t);
  }
  requestAnimationFrame(frame);
}
