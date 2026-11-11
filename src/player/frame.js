import { glitchText, trackLabel } from './controls.js';

/**
 * The full-screen TV's bottom panel says which page is on.
 * Its buttons (prev / power / next) are wired in main.js with bindControls;
 * the zoom in and out of full screen lives in transition.js.
 */
export function initFrameLabel(root, router) {
  const now = root.querySelector('.frame__name');
  const show = (slug) => glitchText(now, trackLabel(router.meta(slug)));
  router.onChange(show);
  if (router.current) show(router.current);
}
