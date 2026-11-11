import gsap from 'gsap';
import { createEmitter } from './emitter.js';

// How long the screen flares after pressing play, before the page changes.
const TUNE_IN = 0.3;

/**
 * The TV's state and rules. No DOM in here: the TV view subscribes and renders;
 * controls call these actions.
 *
 * Each page is a channel. Previous/next choose one, play takes you there.
 *
 * Events:
 *  - 'change' { key, state }   'selected' or 'tuning' changed
 *  - 'play'   { slug }          play was pressed: go to this page
 */
export function createPlayer({ tracks, reduceMotion = false }) {
  const events = createEmitter();
  const state = {
    tracks, // [{ slug, title, label, count }], without the home page
    selected: 0, // index into tracks
    tuning: false, // play was pressed and the page is about to change
  };
  const changed = (key) => events.emit('change', { key, state });

  return {
    state,
    on: events.on,
    get track() { return state.tracks[state.selected]; },

    // choose a channel; wraps around at either end, like a TV's channel buttons
    select(index) {
      const n = state.tracks.length;
      const i = ((index % n) + n) % n;
      if (i === state.selected) return;
      state.selected = i;
      changed('selected');
    },
    step(dir) {
      this.select(state.selected + dir);
      return true;
    },
    selectSlug(slug) {
      const i = state.tracks.findIndex((t) => t.slug === slug);
      if (i >= 0) this.select(i);
    },

    // flare the screen, then go to the chosen page
    play() {
      if (state.tuning) return;
      state.tuning = true;
      changed('tuning');
      gsap.delayedCall(reduceMotion ? 0 : TUNE_IN, () => {
        state.tuning = false;
        changed('tuning');
        events.emit('play', { slug: state.tracks[state.selected].slug });
      });
    },
  };
}
