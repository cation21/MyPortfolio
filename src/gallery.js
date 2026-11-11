// Filter chips and a lightbox for the gallery section.
export function initGallery(root, items) {
  if (!root) return;
  const figures = [...root.querySelectorAll('.gallery__item')];
  const chips = [...root.querySelectorAll('.gallery__filter')];
  const box = root.querySelector('.lightbox');
  const img = box.querySelector('img');
  const cap = box.querySelector('figcaption');
  let visible = items.map((_, i) => i);
  let cur = 0;

  chips.forEach((chip) =>
    chip.addEventListener('click', () => {
      const kind = chip.dataset.kind;
      chips.forEach((c) => { c.classList.toggle('is-on', c === chip); c.setAttribute('aria-pressed', c === chip); });
      visible = [];
      figures.forEach((f, i) => {
        const show = kind === 'All' || f.dataset.kind === kind;
        f.hidden = !show;
        if (show) visible.push(i);
      });
      window.dispatchEvent(new Event('resize')); // let ScrollTrigger re-measure
    })
  );

  const show = (i) => {
    cur = i;
    const g = items[i];
    img.src = `/gallery/${g.src}`;
    img.alt = `${g.title}: ${g.note}`;
    cap.innerHTML = '';
    const t = document.createElement('strong'); t.textContent = g.title;
    const n = document.createElement('span'); n.textContent = g.note;
    cap.append(t, n);
  };
  const step = (d) => {
    const at = visible.indexOf(cur);
    show(visible[(at + d + visible.length) % visible.length]);
  };

  root.querySelectorAll('.gallery__open').forEach((b) =>
    b.addEventListener('click', () => { show(Number(b.dataset.i)); box.showModal(); })
  );
  box.querySelector('.lightbox__close').addEventListener('click', () => box.close());
  box.querySelector('.lightbox__prev').addEventListener('click', () => step(-1));
  box.querySelector('.lightbox__next').addEventListener('click', () => step(1));
  box.addEventListener('click', (e) => { if (e.target === box) box.close(); });
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
}
