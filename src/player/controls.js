import gsap from 'gsap';

/**
 * Wires every [data-act] button inside `root` to an action.
 * Each TV view passes its own actions, e.g. on the TV in the room "next" chooses the
 * next channel, while in the full-screen TV it goes to the next page.
 * An action that returns false (nothing further that way) nudges its button.
 *
 * To add a control: add a button with a new data-act in render.js and pass its action here.
 */
export function bindControls(root, actions) {
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-act]');
    if (!btn || !root.contains(btn) || !actions[btn.dataset.act]) return;
    e.preventDefault();
    if (actions[btn.dataset.act](btn) === false) nudge(btn, btn.dataset.act === 'prev' ? -1 : 1);
  });
}

function nudge(el, dir) {
  gsap.fromTo(el, { x: 3 * dir }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
}

// Swap a readout's text with a short glitch, the way a CRT redraws.
export function glitchText(el, text) {
  if (el.textContent === text) return;
  el.textContent = text;
  el.classList.remove('is-glitch');
  void el.offsetWidth; // restart the animation
  el.classList.add('is-glitch');
}

export const trackLabel = (meta) => meta.title;
