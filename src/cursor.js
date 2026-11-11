// A soft glow that follows the mouse (mouse and trackpad only).
export function initCursor(el) {
  if (!window.matchMedia('(pointer: fine)').matches) { el.style.display = 'none'; return; }
  window.addEventListener('pointermove', (e) => {
    el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    el.classList.add('on');
  });
  document.documentElement.addEventListener('pointerleave', () => el.classList.remove('on'));
}
