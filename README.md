# MyPortfolio

This site's color pallette is inspired by TV Girl's Who Really Cares album.(IKIK)
The rest of the aesthetic elements are inspired by cyberpunk and musical elements.

| Page | URL |
| --- | --- |
| Home: the player, liner notes and a tracklist | `/` |
| About, plus Skills and Off duty | `/about/` |
| Work, Research, Education | `/work/`, `/research/`, `/education/` |
| Papers, Projects, Gallery, Brain facts, Contact | `/papers/`, `/projects/`, `/gallery/`, `/brain/`, `/contact/` |


## Run it

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # serve the build
```

The build writes `dist/<page>/index.html` for every page, plus a `404.html`, so each URL loads directly on any static host (Netlify, Vercel, GitHub Pages) with no rewrite rules. Opening `index.html` straight from disk won't work, because ES modules need a server.

## Edit your content

If you want to use this or make tweaks here's info to help:

Everything lives in `src/content.js`: bio, education, research, work, papers, projects, gallery, skills, languages and the brain facts.

Gallery images go in `public/gallery/`. Add an entry to `gallery` in `content.js` for each one, with a `kind` (Research, Honours, Leadership, or a new one: filter chips are made from these automatically).

Add these files to `public/`:
- `me.jpg`: your photo. It gets the pink halftone duotone treatment automatically.
- `cv.pdf`: your CV. Every "Download CV" link stays hidden until this file exists, so no visitor ever hits a broken link.

To add a page, add it to `PAGES` in `src/render.js` and wrap its sections in `<div class="page" data-page="…" hidden>`. The nav, tracklist, record grooves, prev/next, page titles and build folders all come from `PAGES`.

## Colours

The palette is at the top of `style.css`, and nothing else defines colours (the canvas code reads them from there through `palette.js`):

- **night** (ink, night, plum): backgrounds
- **pink**: projected light and music, the hologram, the record label, play
- **cyan**: hardware, the deck's neon edge, focus rings, the background traces
- **violet**: blends pink and cyan
- **amber**: a sparing highlight (the role line, dates)
- **cream**: text

## How the code is organised

Each module has one job. `main.js` builds everything and hands each piece what it needs.

**The record player** (`src/player/`):
- `player.js`: the player's state and rules (choose a track, play, spin). It has no DOM code. It emits `change`, `play` and `frame` events.
- `controls.js`: wires `[data-act]` buttons to actions. The deck and the mini player each pass their own: on the deck, prev/next choose a track; in the mini player they change page. **To add a control**, add a button with a new `data-act` in `render.js` and pass its action in `main.js`.
- `deck.js`: the turntable. It handles the spin, the tonearm over the selected groove, aligning the light with the spindle, and the arrow keys.
- `holo.js`: the hologram, covering the boot sequence and what it shows. **New data for the display goes here.**
- `mini.js`: the corner player on other pages.

**Pages and motion:**
- `router.js`: shows one page at a time and maps URLs to pages.
- `transition.js`: page navigation, the record-spin transition, links, anchors, back/forward.
- `reveals.js`: scroll-in animations, set up per page the first time it is shown.
- `scroll.js`: smooth scrolling (Lenis).
- `nav.js`: top navigation, burger menu, current-page highlight.
- `cursor.js`: the neon glow behind the pointer.

**Everything else:**
- `render.js`: all page markup, plus the `PAGES` list.
- `bg.js`: the pixel background.
- `palette.js`: reads the CSS palette for canvas code.
- `files.js`: hides links to files that aren't in `public/` yet.
- `facts-tv.js`: the brain-facts mini TV.
- `gallery.js`: gallery filters and lightbox.
- `fx/type.js`: the typewriter effect.
- `style.css`: styles. The palette is at the top.

`ocean.js` and `plankton.js` are earlier experiments (a WebGL ocean and a plankton swirl) that nothing imports any more. `three` is only used by `ocean.js`.

## Stack

Vite, GSAP + ScrollTrigger and Lenis. Fonts are self-hosted via Fontsource: Syncopate and Share Tech Mono on displays, Bagel Fat One for titles, Fraunces and Instrument Sans for text.

All motion slows down or turns off when the visitor has `prefers-reduced-motion` set, and pages then change without the transition.

## Note
Claude was used for some repititive sections and formatting.
