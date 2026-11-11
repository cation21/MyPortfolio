/* Analog TV static on a small canvas, with a rolling tear band. Returns a controller.
   `tint` is [r, g, b] multipliers (0..1+): [1, 1, 1] is grey static, the default leans pink. */
export function createStatic(canvas, { w = 220, h = 165, fps = 30, tint = [1.1, 0.55, 0.8] } = {}) {
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(w, h);
  const buf = new Uint32Array(img.data.buffer);
  const [tr, tg, tb] = tint;
  let raf = 0, last = 0, on = false, roll = 0;

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (now - last < 1000 / fps) return;
    last = now;
    roll = (roll + 3) % h;
    for (let y = 0; y < h; y++) {
      const band = Math.abs(y - roll) < 6 ? 60 : 0; // the bright tearing band
      const rowBias = (Math.random() * 30) | 0;
      for (let x = 0; x < w; x++) {
        const v = ((Math.random() * 255) | 0) * 0.85 + band + rowBias;
        const r = Math.min(255, v * tr), g = Math.min(255, v * tg), b = Math.min(255, v * tb);
        buf[y * w + x] = (255 << 24) | (b << 16) | (g << 8) | r;
      }
    }
    ctx.putImageData(img, 0, 0);
  }
  return {
    start() { if (!on) { on = true; raf = requestAnimationFrame(frame); } },
    stop() { on = false; cancelAnimationFrame(raf); },
  };
}
