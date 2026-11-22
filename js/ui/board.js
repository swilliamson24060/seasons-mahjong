import { LOST } from '../engine/tiles.js';
import { symbolId, faceName, EGG } from './faces.js';
import { COLOURS } from '../engine/confetti.js';
import { BANDS, bandOf } from '../engine/colours.js';

const SVG = 'http://www.w3.org/2000/svg';
const LIFT = 0.11; // how far each layer sits up and to the right, in tile widths
const MARGIN = 2; // the room left round the board, in px, so that on a phone its tiles are as big as they can be
const BIGGEST = 88; // the widest a tile is drawn, in px
const HOLD = 400; // how long a press must last to hold a tile, in ms
const WINDOW = 42 / 110; // how far down the planchette its window sits

// Players who have asked their device for less motion get no shaking or
// turning waves: things simply change, and a hint glows without pulsing.
const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// When a frozen tile thaws, in words: thaws in 3 matches.
const thawWords = (n) => `thaws in ${n} ${n === 1 ? 'match' : 'matches'}`;

// The planchette that points out a hint: heart-shaped wood with a glass
// window near its point, which comes to rest over a tile.
function planchette() {
  const el = document.createElement('div');
  el.className = 'planchette';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML =
    '<svg viewBox="0 0 100 110">' +
    '<path d="M50 3 C62 22 96 44 94 70 C92 94 70 107 50 107 C30 107 8 94 6 70 C4 44 38 22 50 3 Z" fill="#c8955a" stroke="#5b3a1a" stroke-width="3"/>' +
    '<path d="M50 15 C60 31 86 50 84 70 C82 89 66 98 50 98 C34 98 18 89 16 70 C14 50 40 31 50 15 Z" fill="none" stroke="#e7c08a" stroke-width="1.5" opacity="0.7"/>' +
    '<circle cx="50" cy="42" r="15" fill="rgba(255,255,240,0.18)" stroke="#5b3a1a" stroke-width="3"/>' +
    '<path d="M42 35 Q46 31 51 31" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.7"/>' +
    '<circle cx="34" cy="76" r="2.4" fill="#5b3a1a"/><circle cx="66" cy="76" r="2.4" fill="#5b3a1a"/><circle cx="50" cy="88" r="2.4" fill="#5b3a1a"/>' +
    '</svg>';
  return el;
}

// A glass of champagne, for the toast on New Year's 2: a tall flute, the
// champagne in it golden and fizzing, on a slender stem. k tells the two
// glasses' champagne apart.
function flute(k) {
  return (
    '<svg viewBox="0 0 24 48">' +
    `<defs><linearGradient id="fizz-${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset="1" stop-color="#eab53c"/></linearGradient></defs>` +
    '<path d="M5 1.5 H19 L17.6 19 Q16.8 27 12 27 Q7.2 27 6.4 19 Z" fill="rgba(255,255,255,0.22)"/>' +
    `<path d="M5.6 8 H18.4 L17.6 19 Q16.8 27 12 27 Q7.2 27 6.4 19 Z" fill="url(#fizz-${k})"/>` +
    '<g fill="#fffbe8"><circle cx="10" cy="21" r="0.9"/><circle cx="13.6" cy="16" r="0.75"/><circle cx="11.2" cy="12" r="0.6"/><circle cx="14.2" cy="22.5" r="0.6"/></g>' +
    '<path d="M5 1.5 H19 L17.6 19 Q16.8 27 12 27 Q7.2 27 6.4 19 Z" fill="none" stroke="#fffdf5" stroke-width="1.3" stroke-linejoin="round"/>' +
    '<path d="M7.6 4 L8.6 18" stroke="#fff" stroke-width="1.1" stroke-linecap="round" opacity="0.75"/>' +
    '<path d="M12 27 V43" stroke="#fffdf5" stroke-width="1.7" stroke-linecap="round"/>' +
    '<ellipse cx="12" cy="44" rx="6.2" ry="1.9" fill="#fffdf5"/>' +
    '</svg>'
  );
}

// A raindrop, for April Showers' umbrella: a drop of rain, clear blue with
// the light catching it, pointed at the top and round below.
const RAINDROP =
  '<svg viewBox="0 0 24 32">' +
  '<defs><radialGradient id="rain-blue" cx="0.38" cy="0.62" r="0.7"><stop offset="0" stop-color="#d9f1ff"/><stop offset="0.55" stop-color="#5fb4ec"/><stop offset="1" stop-color="#1f6fb2"/></radialGradient></defs>' +
  '<path d="M12 1.5 C12 1.5 3.2 13 3.2 20.2 A8.8 8.8 0 0 0 20.8 20.2 C20.8 13 12 1.5 12 1.5 Z" fill="url(#rain-blue)" stroke="#16588f" stroke-width="1.2" stroke-linejoin="round"/>' +
  '<path d="M7.6 19 Q7.8 14.5 10.6 10.6" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity="0.85"/>' +
  '<circle cx="8.4" cy="23" r="1.3" fill="#fff" opacity="0.7"/>' +
  '</svg>';

// The treats New Year's Day's sweets carry, one to a sweet, in turn.
const SWEETS = ['🍩', '🍪', '🧁', '🍫', '🍬', '🍰'];

// A tile w pixels wide: how tall it is, and how far each layer lifts it.
const sizes = (w) => ({ h: Math.round((w * 4) / 3), lift: Math.max(2, Math.round(w * LIFT)) });

// How wide a layout's tiles are drawn in a space of width by height, in
// whole pixels: the widest at which the board, with its layers lifted and
// their sides showing, fits in it, but for a margin round it, up to a
// limit, and never under 16. The board is drawn as wide as this says.
export function tileFit(layout, width, height) {
  const cols = layout.width / 2;
  const rows = layout.height / 2;
  const deep = layout.depth - 1;
  for (let w = BIGGEST; w > 16; w--) {
    const { h, lift } = sizes(w);
    if (Math.ceil(cols * w + (deep + 1.6) * lift) <= width - 2 * MARGIN && Math.ceil(rows * h + (deep + 1.6) * lift) <= height - 2 * MARGIN) return w;
  }
  return 16;
}

// Where each of a layout's tiles goes on the board, tiles w pixels wide: its
// left and top, in whole pixels. Each layer is lifted up and to the right of
// the one below it, its sides showing on the left and below, so a taller
// stack beside a tile lies over its left side, or over its foot from below,
// and never over its top right corner, where its number is.
export function tileSpots(layout, w) {
  const { h, lift } = sizes(w);
  const deep = layout.depth - 1;
  return Array.from(layout.x, (x, i) => [Math.round(1.4 * lift + (x / 2) * w + layout.z[i] * lift), Math.round((deep - layout.z[i]) * lift + (layout.y[i] / 2) * h)]);
}

// The board on the page: one button per tile, stacked so that each layer
// sits up and to the right of the one under it, with the tiles' sides
// showing below and to the left. It draws what the game says, and turns
// clicks, taps and keys into moves. say(text) reports things for the page
// to show, sound, if given, plays a tock for each tile pressed, magnifier,
// if given, shows a tile held down up close, keyName is what the treat
// that frees a blocked tile is called on this board, fridge, on a board
// with leftovers, is where its containers go: a tile chosen and then an
// empty container goes in it, to be taken from there with its partner, and
// faceSet is the set of faces its tiles wear (faces.js), and are named by,
// which the board says as data-faces, for the page's style to follow.
export class Board {
  constructor(el, game, { say = () => {}, sound = null, magnifier = null, keyName = 'key', fridge = null, faceSet = 'halloween' } = {}) {
    this.el = el;
    this.game = game;
    this.faceSet = faceSet;
    el.dataset.faces = faceSet;
    this.say = say;
    this.sound = sound;
    this.keyName = keyName;
    this.fridgeEl = fridge;
    this.tableCount = game.tableCount;
    this.selected = -1;
    this.keying = false; // the next tile pressed gets the skeleton key, or the saved seat
    this.busy = 0; // while the tiles turn over, presses wait
    this.held = -1; // the tile held down: shown up close, or peeked at
    this.at = [0, 0]; // where the pointer is on the screen
    this.swallowUntil = 0; // the click that ends a long press is not a press
    this.tiles = [];
    this.tileWidth = 0;
    this.build();
    this.setMagnifier(magnifier);
    game.on('match', (m) => this.matched(m));
    game.on('undo', (entry) => this.undone(entry));
    game.on('shuffle', () => this.shuffled());
    game.on('key', () => this.refresh());
    game.on('hatch', ({ hatched }) => this.hatched(hatched));
    game.on('gold', ({ gold }) => this.gild(gold));
    game.on('dance', ({ dance }) => dance && this.danced(dance));
    game.on('save', ({ slot }) => {
      this.selected = -1;
      this.paint(slot);
      this.refresh();
    });
  }

  build() {
    const L = this.game.layout;
    const el = this.el;
    el.replaceChildren();
    // In the page in reading order, so Tab goes row by row; the stacking
    // comes from z-index: upper layers over lower, and within a layer each
    // tile over the one above it and the one to its right, whose sides
    // would otherwise show over it.
    const order = [...L.x.keys()].filter((i) => i < this.tableCount).sort((a, b) => L.y[a] - L.y[b] || L.x[a] - L.x[b] || L.z[a] - L.z[b]);
    for (const i of order) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'tile';
      button.dataset.i = i;
      button.style.zIndex = L.z[i] * 10000 + L.y[i] * 100 + (99 - L.x[i]);
      // On a football board, each end zone's tiles carry its team's pennant;
      // on the lake, the swan's reflection lies in the water.
      if (this.game.zones && this.game.zones[i]) button.classList.add(this.game.zones[i] < 0 ? 'zone-top' : 'zone-bottom');
      if (this.game.inLake(i)) button.classList.add('lake');
      // On April Showers' rainbow, each tile is tinted its band's colour,
      // or a cloud's white.
      if (this.game.colourClouds !== null) {
        const band = bandOf(L, i, this.game.colourClouds);
        button.dataset.band = band >= 0 ? BANDS[band] : 'cloud';
      }
      const svg = document.createElementNS(SVG, 'svg');
      svg.setAttribute('viewBox', '0 0 60 80');
      svg.setAttribute('aria-hidden', 'true');
      const use = document.createElementNS(SVG, 'use');
      svg.append(use);
      button.append(svg);
      this.tiles[i] = { el: button, use, ice: null };
      // A tile that starts frozen has its ice over it, with the matches it
      // still needs to thaw: the ice fades away as it thaws, and back with
      // an undo.
      if (this.game.ice && this.game.ice[i] > 0) {
        const ice = document.createElement('span');
        ice.className = 'ice';
        ice.setAttribute('aria-hidden', 'true');
        ice.append(document.createElement('b'));
        button.append(ice);
        this.tiles[i].ice = ice.firstChild;
      }
      el.append(button);
    }
    // On the board of gold rings, a gold ring for each ring, lying under the
    // tiles where it is, which shines out once the ring's tiles are all taken.
    this.rings = (this.game.rings || []).map((r, k) => {
      const ring = document.createElement('div');
      ring.className = r.gold ? 'gold-ring won' : 'gold-ring';
      ring.setAttribute('aria-hidden', 'true');
      ring.innerHTML =
        `<svg><defs><linearGradient id="gold-${k}" x1="0" y1="0" x2="1" y2="1">` +
        '<stop offset="0" stop-color="#fff4b8"/><stop offset="0.3" stop-color="#f4c542"/><stop offset="0.62" stop-color="#a8740e"/><stop offset="1" stop-color="#ffe07a"/>' +
        `</linearGradient></defs><ellipse class="rim"/><ellipse class="band" stroke="url(#gold-${k})"/><ellipse class="shine" pathLength="100"/></svg>`;
      el.append(ring);
      return ring;
    });
    // On New Year's 3, the row the shooting star crossed, glowing.
    this.starBand = null;
    if (this.game.starEvery) {
      this.starBand = document.createElement('div');
      this.starBand.className = 'star-band';
      this.starBand.setAttribute('aria-hidden', 'true');
      el.append(this.starBand);
    }
    // On New Year's 2, the two glasses of champagne, standing at their
    // places along the 2, with the bottom tile at each place of the path,
    // which a glass stands on while it is there.
    this.glassEls = null;
    if (this.game.path) {
      const g = this.game;
      this.glassEls = [0, 1].map((k) => {
        const glass = document.createElement('div');
        glass.className = 'glass';
        glass.setAttribute('aria-hidden', 'true');
        glass.innerHTML = flute(k);
        el.append(glass);
        return glass;
      });
      this.baseAt = g.path.map(([x, y]) => {
        for (let i = 0; i < L.count; i++) if (L.z[i] === 0 && L.x[i] === x && L.y[i] === y) return i;
        return -1;
      });
    }
    // On April Showers' umbrella, the raindrops drawn, by their places in
    // the game's drops, made as they land.
    this.dropEls = new Map();
    // On New Year's Day, the treat each sweet carries.
    this.sweetOf = new Map();
    if (this.game.sweets) for (let i = 0; i < L.count; i++) if (this.game.sweets[i]) this.sweetOf.set(i, SWEETS[this.sweetOf.size % SWEETS.length]);
    // On New Year's 8, the disco ball's beam, across the board over the
    // tiles in its light, the ball itself at its end.
    this.beam = null;
    if (this.game.rules.disco) {
      this.beam = document.createElement('div');
      this.beam.className = 'disco-beam';
      this.beam.setAttribute('aria-hidden', 'true');
      el.append(this.beam);
    }

    el.onclick = (e) => {
      const t = e.target.closest('.tile');
      if (!t || performance.now() < this.swallowUntil) return;
      this.press(Number(t.dataset.i));
    };
    el.oncontextmenu = (e) => e.preventDefault();
    el.onpointerdown = (e) => {
      const t = e.target.closest('.tile');
      if (!t || (!this.magnifier && !this.game.turnAhead)) return;
      this.at = [e.clientX, e.clientY];
      clearTimeout(this.holding);
      this.holding = setTimeout(() => this.hold(Number(t.dataset.i)), HOLD);
    };
    el.onpointermove = (e) => {
      this.at = [e.clientX, e.clientY];
      if (this.held >= 0 && this.magnifier) this.hold(this.held);
    };
    el.onpointerup = el.onpointercancel = el.onpointerleave = () => {
      clearTimeout(this.holding);
      if (this.held < 0) return;
      if (this.magnifier) this.magnifier.hide();
      else this.paint(this.held);
      this.held = -1;
      this.swallowUntil = performance.now() + 250;
    };
    // A finger held on the board to magnify a tile may slide on to others,
    // and the page does not pan under it; two fingers still zoom the page.
    el.ontouchmove = (e) => {
      if (this.magnifier && e.touches.length === 1 && e.cancelable) e.preventDefault();
    };
    el.onkeydown = (e) => {
      if (!e.key.startsWith('Arrow')) return;
      e.preventDefault();
      this.move(e.key);
    };
    this.buildFridge();

    for (let i = 0; i < L.count; i++) this.paint(i);
    this.refresh();
    this.fit();
  }

  // The fridge's containers, one button each, after the table's tiles; a
  // tap on one with a tile in it chooses that tile, and on an empty one
  // puts the tile chosen in it. With no fridge, there are none.
  buildFridge() {
    const box = this.fridgeEl;
    if (!box) return;
    box.replaceChildren();
    for (let s = this.tableCount; s < this.game.layout.count; s++) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'tile slot';
      button.dataset.i = s;
      const svg = document.createElementNS(SVG, 'svg');
      svg.setAttribute('viewBox', '0 0 60 80');
      svg.setAttribute('aria-hidden', 'true');
      const use = document.createElementNS(SVG, 'use');
      svg.append(use);
      button.append(svg);
      this.tiles[s] = { el: button, use, ice: null };
      box.append(button);
    }
    box.onclick = (e) => {
      const t = e.target.closest('.tile');
      if (!t) return;
      const s = Number(t.dataset.i);
      if (this.game.present[s]) this.press(s);
      else this.saveChosen();
    };
  }

  // A tap on an empty container: the tile chosen goes in it, if it is a
  // free one from the table.
  saveChosen() {
    const g = this.game;
    if (this.busy) return;
    if (this.selected < 0 || g.inFridge(this.selected)) {
      this.say('Choose a free tile on the table, then a container, to save it for later.');
      return;
    }
    if (g.save(this.selected) < 0) this.say("That tile can't go in the fridge.");
    else if (this.sound) this.sound.save();
  }

  // Sizes the tiles to fill the space the board has, and places them.
  fit() {
    const L = this.game.layout;
    const box = this.el.parentElement.getBoundingClientRect();
    const cols = L.width / 2;
    const rows = L.height / 2;
    const deep = L.depth - 1;
    const w = tileFit(L, box.width, box.height);
    const { h, lift } = sizes(w);
    this.tileWidth = w;
    const s = this.el.style;
    s.setProperty('--tile-w', `${w}px`);
    s.setProperty('--tile-h', `${h}px`);
    s.setProperty('--lift', `${lift}px`);
    s.setProperty('--gap', `${Math.max(1, Math.round(w * 0.04))}px`);
    s.width = `${Math.ceil(cols * w + (deep + 1.6) * lift)}px`;
    s.height = `${Math.ceil(rows * h + (deep + 1.6) * lift)}px`;
    const spots = tileSpots(L, w);
    for (let i = 0; i < this.tableCount; i++) {
      const t = this.tiles[i].el.style;
      t.left = `${spots[i][0]}px`;
      t.top = `${spots[i][1]}px`;
    }
    this.rowTop = (row) => Math.round(deep * lift + row * h); // where a row of the bottom layer starts
    this.rowHeight = h;
    this.spotOf = (x, y, z) => [1.4 * lift + (x / 2) * w + z * lift, (deep - z) * lift + (y / 2) * h]; // a tile's top left, were one there
    this.placeBeam();
    // Each gold ring goes round the middle of its ring's tiles, on the
    // bottom layer, as broad as a tile is.
    (this.game.rings || []).forEach(({ square: [left, top, across, down] }, k) => {
      const ring = this.rings[k];
      const width = across * w;
      const height = down * h;
      Object.assign(ring.style, { left: `${Math.round(1.4 * lift + left * w)}px`, top: `${Math.round(deep * lift + top * h)}px`, width: `${width}px`, height: `${height}px` });
      const svg = ring.firstChild;
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      const broad = { rim: 0.62, band: 0.5, shine: 0.1 };
      for (const e of svg.querySelectorAll('ellipse')) {
        const inset = e.classList.contains('shine') ? w * 0.1 : 0; // the glint, on the band's top left
        e.setAttribute('cx', width / 2 - inset / 2);
        e.setAttribute('cy', height / 2 - inset / 2);
        e.setAttribute('rx', ((across - 1) * w) / 2 - inset);
        e.setAttribute('ry', ((down - 1) * h) / 2 - inset);
        e.setAttribute('stroke-width', w * broad[e.classList[0]]);
      }
    });
  }

  // Moves the disco ball's beam to the rows its light is on now, gliding
  // there from where it was.
  placeBeam() {
    this.placeStar();
    this.placeGlasses();
    this.placeDrops();
    if (!this.beam || !this.rowTop) return;
    const s = this.beam.style;
    s.top = `${this.rowTop(this.game.lightTop)}px`;
    s.height = `${this.game.rules.disco * this.rowHeight}px`;
  }

  // On New Year's 3, the glow on the row the star crossed, fading once its
  // wish is made; and a star streaking across a row as it comes.
  placeStar() {
    if (!this.starBand || !this.rowTop) return;
    const star = this.game.star;
    this.starBand.classList.toggle('wished', !star || star.wished);
    if (!star) return;
    this.starBand.style.top = `${this.rowTop(star.row)}px`;
    this.starBand.style.height = `${this.rowHeight}px`;
  }

  starCrossed() {
    this.placeStar();
    if (this.starBand) this.restart(this.starBand, 'streak');
  }

  // On New Year's 2, where each glass stands now, at the top left of its
  // place, as a tile's badges sit, so that the tile there, and its number,
  // still show: on the bottom tile there, or the table once that is taken.
  // Once they have met, the two stand together between their places, tilted
  // to each other.
  placeGlasses() {
    if (!this.glassEls || !this.spotOf) return;
    const g = this.game;
    const w = this.tileWidth;
    const feet = [g.glasses.left, g.glasses.right].map((k) => {
      const [x, y] = g.path[k];
      const base = this.baseAt[k];
      const [left, top] = this.spotOf(x, y, base >= 0 && g.present[base] ? 1 : 0);
      return [left + w * 0.3, top + w * 0.36];
    });
    const met = Boolean(g.toastAt);
    if (met) {
      const [mx, my] = [(feet[0][0] + feet[1][0]) / 2, Math.max(feet[0][1], feet[1][1])];
      feet[0] = [mx - w * 0.17, my];
      feet[1] = [mx + w * 0.17, my];
    }
    this.glassEls.forEach((glass, k) => {
      glass.style.transform = `translate(${Math.round(feet[k][0] - glass.offsetWidth / 2)}px, ${Math.round(feet[k][1] - glass.offsetHeight)}px)`;
      glass.classList.toggle('clinked', met);
      glass.style.setProperty('--tilt', k ? '-16deg' : '16deg');
    });
    this.meetingAt = met ? [(feet[0][0] + feet[1][0]) / 2, feet[0][1] - w * 0.6] : null;
  }

  // On April Showers' umbrella, where each raindrop still running is: at
  // the top left of its place, as a tile's badges sit, on the tile at the
  // top there, or on the table where its tiles are all taken, gliding a
  // place down its rib with every match. A drop just landed falls onto the
  // peak; one caught splashes; one past the rim drips off and falls away;
  // and one an undo takes back goes, or comes back.
  placeDrops() {
    const g = this.game;
    if (!g.rain || !this.spotOf) return;
    const L = g.layout;
    const w = this.tileWidth;
    const forward = g.matches > (this.dropsAt ?? g.matches); // a match made, not taken back
    this.dropsAt = g.matches;
    const running = new Map(g.runningDrops().map((d) => [g.raindrops.indexOf(d.drop), d]));
    for (const [k, el] of this.dropEls) {
      if (running.has(k)) continue;
      const drop = g.raindrops[k];
      const how = drop && drop.state === 'caught' ? 'caught' : drop && drop.state === 'dripped' ? 'dripping' : null;
      this.dropEls.delete(k);
      if (!how || !forward || still()) {
        el.remove();
        continue;
      }
      el.classList.add('going', how);
      el.addEventListener('animationend', () => el.remove(), { once: true });
      setTimeout(() => el.remove(), 1000); // should the animation never end, as in a tab out of sight
    }
    for (const [k, { drop, step, tile }] of running) {
      let el = this.dropEls.get(k);
      const fresh = !el;
      if (fresh) {
        el = document.createElement('div');
        el.className = 'raindrop';
        el.setAttribute('aria-hidden', 'true');
        el.innerHTML = RAINDROP;
        this.el.append(el);
        this.dropEls.set(k, el);
      }
      const [x, y] = g.rain.ribs[drop.rib][step].place;
      const [left, top] = tile >= 0 ? this.spotOf(L.x[tile], L.y[tile], L.z[tile]) : this.spotOf(x, y, 0);
      el.style.transform = `translate(${Math.round(left + w * 0.1)}px, ${Math.round(top - w * 0.12)}px)`;
      el.classList.toggle('bare', tile < 0); // over a place whose tiles are all taken
      if (fresh && forward && drop.at === g.matches) this.restart(el, 'landing');
    }
  }

  // The glasses meet: they clink, tilting together, and a toast rises
  // from them.
  clink() {
    this.placeGlasses();
    if (!this.glassEls) return;
    for (const glass of this.glassEls) this.restart(glass, 'clinking');
    if (this.meetingAt) this.floatAt('🥂', this.meetingAt);
  }

  // Rings whose every tile is taken turn to gold: each one's gold ring
  // shines out where its tiles were.
  gild(rings) {
    for (const k of rings) {
      this.rings[k].classList.add('won');
      this.restart(this.rings[k], 'gilding');
    }
  }

  // Shows one side of a tile: the side up, unless told otherwise; or the
  // egg it is still inside; or a face given, as it was before a dance.
  paint(i, side = this.game.side, face = this.game.isEgg(i) ? EGG : this.game.sides[side][i]) {
    const g = this.game;
    const t = this.tiles[i];
    if (face < 0 && face !== EGG) {
      t.use.removeAttribute('href'); // a container never yet used
      return;
    }
    t.use.setAttribute('href', `#${symbolId(face, this.faceSet)}`);
    t.el.classList.toggle('night', g.sideNames[side] === 'night');
    t.el.classList.toggle('soul', face === LOST);
    t.el.setAttribute('aria-label', this.label(i, face));
  }

  // The music changes, and the tiles that change partners twirl, each
  // showing the face it had until halfway round, then its new partner's.
  danced({ swaps, before }) {
    const tiles = swaps.flat();
    if (still()) {
      for (const i of tiles) this.paint(i);
      return this.refresh();
    }
    this.busy++;
    tiles.forEach((i, k) => {
      const el = this.tiles[i].el;
      const delay = (k % 6) * 40;
      this.paint(i, undefined, before[i]);
      el.style.animationDelay = `${delay}ms`;
      this.restart(el, 'twirl');
      setTimeout(() => this.paint(i), delay + 300);
    });
    setTimeout(() => {
      this.busy--;
      this.refresh();
    }, 5 * 40 + 650);
  }

  // A net of balloons opens: the balloons left float up and away from their
  // tiles, and the new ones drop on to theirs.
  netOpened({ landed, floated }) {
    this.refresh();
    for (const i of floated) this.float('🎈', i);
    for (const i of landed) this.restart(this.tiles[i].el, 'landing');
  }

  // A rose opens on the vase: its rose pops out as it blooms.
  opened(tiles) {
    this.refresh();
    for (const i of tiles) this.restart(this.tiles[i].el, 'opening');
  }

  // A splash on April Showers' rain boots: the puddle's tiles still there
  // ripple, outward from where the pair was taken.
  splashed(from) {
    const L = this.game.layout;
    for (let i = 0; i < this.tableCount; i++) {
      if (!this.game.inSplashZone(i)) continue;
      const el = this.tiles[i].el;
      el.style.animationDelay = `${Math.round(Math.hypot(L.x[i] - L.x[from], L.y[i] - L.y[from]) * 35)}ms`;
      this.restart(el, 'ripple');
    }
  }

  // A colour caught on April Showers' rainbow: the tiles left in its band
  // shimmer, outward from where the pair was taken.
  caughtColour(band, from) {
    const L = this.game.layout;
    for (let i = 0; i < this.tableCount; i++) {
      if (this.game.colourOf(i) !== band) continue;
      const el = this.tiles[i].el;
      el.style.animationDelay = `${Math.round(Math.hypot(L.x[i] - L.x[from], L.y[i] - L.y[from]) * 30)}ms`;
      this.restart(el, 'shimmer');
    }
  }

  // Cupid's arrow strikes: its couple's hearts beat as they're smitten.
  struck(tiles) {
    this.refresh();
    for (const i of tiles) this.restart(this.tiles[i].el, 'struck');
  }

  // A rocket bursts: the tiles it lights up sparkle as they catch the light.
  litUp(tiles) {
    this.refresh();
    for (const i of tiles) this.restart(this.tiles[i].el, 'sparkle');
  }

  // Eggs come free and hatch: each shows the tile inside it, with a wobble.
  hatched(tiles) {
    for (const i of tiles) {
      this.paint(i);
      this.restart(this.tiles[i].el, 'hatching');
    }
  }

  // A tile's name, as a screen reader says it: its face, and any ice on it;
  // or a container in the fridge, empty, or with the tile saved in it.
  label(i, face = this.game.isEgg(i) ? EGG : this.game.face(i)) {
    const g = this.game;
    if (g.inFridge(i)) return g.present[i] && face >= 0 ? `${faceName(face, this.faceSet)}, in the fridge` : 'An empty container in the fridge';
    const name = faceName(face, this.faceSet);
    if (this.tiles[i].ice && g.frozen(i)) return `${name}, frozen: ${thawWords(g.thawIn(i))}`;
    if (g.isLord(i)) return `${name}, a lord: free wherever he is`;
    if (g.isPiper(i)) return `${name}, a piper: the rest of his kind follow him out`;
    if (g.isRocket(i)) return `${name}, a rocket: take it and it bursts, lighting up the tiles round it`;
    if (g.isLit(i)) return `${name}, lit up: take it with another lit tile for a lit pair`;
    if (g.inSpotlight(i)) return `${name}, in the spotlight`;
    if (g.hasBalloon(i)) return `${name}, with a balloon on it: take it before the net opens again`;
    if (g.foundAt && i === g.coin && g.present[i]) return `${name}, where the lucky coin was hidden`;
    if (g.confetti && g.confetti[i] >= 0) return `${name}, with ${COLOURS[g.confetti[i]]} confetti`;
    if (g.inStarRow(i)) return `${name}, in the shooting star's row`;
    if (g.isSmitten(i)) return `${name}, smitten by Cupid's arrow: take it with the other smitten tile within ${g.untilArrow} ${g.untilArrow === 1 ? 'match' : 'matches'}`;
    const candy = this.candyOf(i);
    if (candy) {
      const { words, tiles } = g.messages[candy.message];
      if (g.awaited(i)) return `${name}, a candy heart saying ${candy.word}: take its pair now to say ${words.join(' ')}`;
      return `${name}, a candy heart saying ${candy.word}: take its pair, and the pair with ${words[1 - tiles.indexOf(i)]} straight after, to say ${words.join(' ')}`;
    }
    const letter = g.xoLetter(i);
    if (letter) {
      const what = letter === 'X' ? 'in the X: a pair from it is a kiss' : 'in the O: a pair from it is a hug';
      return `${name}, ${what}${g.wantsLetter === letter ? `, and the XOXO wants a ${letter === 'X' ? 'kiss' : 'hug'} next` : ''}`;
    }
    const choc = g.chocolateOf(i);
    if (choc >= 0 && g.chocolateStates[choc] === 'whole' && g.chocolates[choc].top === i) return `${name}, the top of a chocolate: take it to bite into it, and eat the rest before biting into another`;
    if (choc >= 0 && choc === g.openChocolate) return `${name}, part of the chocolate you bit into: eat it all, cup and all, before biting into another`;
    const glow = g.glowOf(i);
    if (glow) return `${name}, in the glow of ${glow === 'his' ? 'his' : 'her'} candle: take it with a tile of its kind in the glow of ${glow === 'his' ? 'hers' : 'his'}, for a candlelit pair`;
    const rose = g.roseOf(i);
    if (rose >= 0) {
      const state = g.roseState(rose);
      const matches = (n) => `${n} ${n === 1 ? 'match' : 'matches'}`;
      if (state === 'bud') return `${name}, a rose in bud: it opens in ${matches(g.opensIn(rose))}, and taken before, it's wasted`;
      if (state === 'bloom') return `${name}, a rose in bloom: take it with a tile of its kind within ${matches(g.bloomLeft(rose))}, for the bouquet`;
      return `${name}, a wilted rose`;
    }
    if (g.inGlassesWay(i)) return `${name}, in the glasses' way`;
    if (g.dropOn(i)) return `${name}, with a raindrop on it: take it with a tile of its kind to catch the drop`;
    if (g.inRainWay(i)) return `${name}, in a raindrop's way down the umbrella`;
    if (g.inSplashZone(i)) return `${name}, in the puddle: a pair from it splashes${g.splashRun ? `, ${g.nextSplash} in a row` : ''}`;
    const band = g.colourOf(i);
    if (band >= 0) return `${name}, in the rainbow's ${BANDS[band]} band${band === g.bandLit ? ', lit now: take it with a tile of its kind from the same band to catch its colour' : band === g.bandNext ? ', lit next' : ''}`;
    if (g.tempting(i)) return `${name}, a sweet: leave it alone through January to keep your resolution`;
    if (g.isSweet(i)) return `${name}, a sweet, fair game now`;
    const spark = g.sparklerOf(i);
    if (spark) {
      const left = spark.state === 'lit' ? g.burnLeft(spark) : 0;
      return spark.state === 'lit' ? `${name}, a sparkler burning: ${left} ${left === 1 ? 'match' : 'matches'} left` : `${name}, a sparkler, lit once it comes free`;
    }
    const pail = g.pails && g.present[i] ? g.pailOf(i) : -1;
    if (pail < 0) return name;
    const keeps = g.freshIn(pail);
    return keeps === null ? `${name}, a pail of fresh milk` : `${name}, a pail of fresh milk: it sours in ${keeps} ${keeps === 1 ? 'match' : 'matches'}`;
  }

  // Whether holding a tile shows it up close, in the magnifier given, or
  // (with none) turns it over to peek at the side it will turn to.
  setMagnifier(magnifier) {
    this.magnifier = magnifier;
    this.el.classList.toggle('magnifying', Boolean(magnifier));
  }

  // A tile held down. The magnifier shows whichever tile is under the
  // pointer, and follows it as it slides from tile to tile.
  hold(i) {
    if (!this.magnifier) {
      this.held = i;
      this.paint(i, 1);
      return;
    }
    const [x, y] = this.at;
    const under = document.elementFromPoint(x, y)?.closest('.tile');
    this.held = under && this.el.contains(under) ? Number(under.dataset.i) : i;
    this.magnifier.show(this.sidesOf(this.held), this.tileWidth, x, y, this.faceSet, this.candyOf(this.held));
  }

  // On Valentine's envelope, the candy heart a tile carries: the word on
  // it, and which message it is half of, for its colour; or null.
  candyOf(i) {
    const h = this.game.heartOf(i);
    return h && { word: h.message.words[h.half], message: this.game.messages.indexOf(h.message) };
  }

  // A tile's faces as the magnifier shows them, each [face, night]: the side
  // up and, before the tiles turn over, the side they will turn to; or the
  // egg it is still inside.
  sidesOf(i) {
    const g = this.game;
    return (g.turnAhead ? [0, 1] : [g.side]).map((s) => [g.isEgg(i) ? EGG : g.sides[s][i], g.sideNames[s] === 'night']);
  }

  // Brings every tile's state up to date: here or gone, free, blocked by
  // the tiles round it or frozen, chosen.
  refresh() {
    const g = this.game;
    for (let i = 0; i < g.layout.count; i++) {
      const t = this.tiles[i];
      const el = t.el;
      const here = g.present[i] === 1;
      if (g.inFridge(i)) {
        // A container: empty, or holding a tile, which is always free.
        el.classList.toggle('empty', !here);
        el.classList.toggle('selected', i === this.selected);
        if (!here) el.classList.remove('hint');
        el.setAttribute('aria-label', this.label(i));
        continue;
      }
      const frozen = here && g.frozen(i);
      const free = here && g.isFree(i);
      el.classList.toggle('gone', !here);
      el.classList.toggle('blocked', here && !g.open(i));
      el.classList.toggle('frozen', frozen);
      el.classList.toggle('listed', here && g.onList(i));
      el.classList.toggle('buster', here && g.isBuster(i));
      el.classList.toggle('follows', free && g.followsFrom(i)); // on the board of geese: a gosling's place, following on
      // On the milk pail, a tile of a fresh pail carries a bottle, and once
      // either of its tiles is free, the matches it still keeps for.
      const pail = here ? g.pailOf(i) : -1;
      const keeps = pail >= 0 ? g.freshIn(pail) : null;
      el.classList.toggle('pail', pail >= 0);
      el.classList.toggle('souring', keeps !== null && keeps <= 3);
      if (pail >= 0) el.dataset.fresh = keeps ?? '';
      if (g.pails) el.setAttribute('aria-label', this.label(i));
      if (t.ice) {
        if (frozen) t.ice.textContent = g.thawIn(i); // kept as it was while the ice fades
        el.setAttribute('aria-label', this.label(i));
      }
      if (!here) el.classList.remove('hint');
      el.classList.toggle('selected', i === this.selected);
      el.classList.toggle('unlocked', here && g.unlocked[i] === 1);
      el.classList.toggle('lord', g.isLord(i)); // on the crown: a lord, free wherever he is
      el.classList.toggle('piper', g.isPiper(i)); // on the bagpipes: a piper, whom his kind follow out
      el.classList.toggle('rocket', g.isRocket(i)); // on New Year's 9: a rocket, to set off
      el.classList.toggle('lit', g.isLit(i)); // and a tile a rocket's burst has lit
      el.classList.toggle('spotlit', g.inSpotlight(i)); // on New Year's 8: a tile in the disco ball's beam
      el.classList.toggle('balloon', g.hasBalloon(i)); // on New Year's 6: a tile with a balloon on it, to pop
      el.classList.toggle('coin', Boolean(g.foundAt) && i === g.coin && here); // on New Year's 7: where the lucky coin turned up
      // On New Year's 5, a sparkler, unlit, or burning with the matches it
      // has left, amber at the last.
      const spark = g.sparklerOf(i);
      const burning = Boolean(spark) && spark.state === 'lit';
      el.classList.toggle('sparkler', Boolean(spark));
      el.classList.toggle('burning', burning);
      el.classList.toggle('short', burning && g.burnLeft(spark) <= 2);
      if (burning) el.dataset.burn = g.burnLeft(spark);
      el.classList.toggle('starlit', g.inStarRow(i)); // on New Year's 3: in the row the star crossed, its wish to make
      // On Valentine's pierced heart, a smitten tile carries a heart, with
      // the matches until Cupid's next arrow, deeper at the last two.
      const smitten = g.isSmitten(i);
      el.classList.toggle('smitten', smitten);
      el.classList.toggle('pining', smitten && g.untilArrow <= 2);
      if (smitten) el.dataset.arrow = g.untilArrow;
      // On Valentine's envelope, a tile with half a sweet nothing on it
      // carries a candy heart saying it, in its message's colour; the half
      // still to take of a message begun beats, to be taken next.
      const candy = this.candyOf(i);
      el.classList.toggle('candy', Boolean(candy));
      el.classList.toggle('awaited', g.awaited(i));
      if (candy) Object.assign(el.dataset, { word: candy.word, message: candy.message });
      else {
        delete el.dataset.word;
        delete el.dataset.message;
      }
      // On Valentine's vase of roses, a rose in bud carries a bud; in bloom,
      // it blushes, with a rose counting down the matches it has left,
      // deeper at the last two; and wilted, a wilted rose.
      const rose = g.roseOf(i);
      const bloom = rose >= 0 ? g.roseState(rose) : null;
      el.classList.toggle('bud', bloom === 'bud');
      el.classList.toggle('bloom', bloom === 'bloom');
      el.classList.toggle('fading', bloom === 'bloom' && g.bloomLeft(rose) <= 2);
      el.classList.toggle('wilted', bloom === 'wilted');
      if (bloom === 'bloom') el.dataset.bloom = g.bloomLeft(rose);
      el.classList.toggle('glow', Boolean(g.glowOf(i))); // on Valentine's first date: in a candle's glow
      el.classList.toggle('bitten', g.openChocolate >= 0 && g.chocolateOf(i) === g.openChocolate); // on the box of chocolates: the chocolate bitten into
      el.classList.toggle('xo-next', free && g.wantsLetter !== null && g.xoLetter(i) === g.wantsLetter); // on hugs and kisses: the letter the run wants next
      el.classList.toggle('in-way', g.inGlassesWay(i)); // on New Year's 2: in the glasses' way
      el.classList.toggle('rain-way', g.inRainWay(i)); // on April Showers' umbrella: in a raindrop's way down
      el.classList.toggle('puddle', g.inSplashZone(i)); // on its rain boots: in the puddle, the splash zone
      // On its rainbow, the band lit now shines, and the band lit next is
      // ringed in its colour.
      const band = g.colourOf(i);
      el.classList.toggle('shining', band >= 0 && band === g.bandLit);
      el.classList.toggle('next-band', band >= 0 && band === g.bandNext);
      // On New Year's Day, a sweet carries its treat, and through January,
      // while the resolution holds, it is a tempting pink.
      el.classList.toggle('sweet', g.isSweet(i));
      el.classList.toggle('tempting', g.tempting(i));
      if (g.isSweet(i)) el.dataset.sweet = this.sweetOf.get(i);
      else delete el.dataset.sweet;
      // On New Year's 4, the fleck of confetti a tile caught.
      if (g.confetti && here && g.confetti[i] >= 0) el.dataset.confetti = COLOURS[g.confetti[i]];
      else delete el.dataset.confetti;
      if (g.lords || g.pipers || g.rockets || g.rules.disco || g.balloons || g.coin >= 0 || g.sparklers || g.confetti || g.starEvery || g.path || g.sweets || g.arrowEvery || g.messages || g.roses || g.candles || g.chocolates || g.xoxo || g.rain || g.puddleEdge !== null || g.colourClouds !== null) el.setAttribute('aria-label', this.label(i));
      el.tabIndex = free ? 0 : -1;
      el.setAttribute('aria-disabled', String(!free));
    }
    this.placeBeam();
  }

  press(i) {
    const g = this.game;
    if (this.busy || !g.present[i]) return;
    if (this.keying) {
      this.setKeying(false);
      if (g.frozen(i)) this.say(`A ${this.keyName} can't thaw ice: the ${this.keyName} is still yours.`);
      else if (!g.useKey(i)) this.say(`That tile is free already: the ${this.keyName} is still yours.`);
      return;
    }
    if (!g.isFree(i)) {
      if (g.frozen(i)) this.say(`That tile is still frozen: it ${thawWords(g.thawIn(i))}.`);
      if (this.sound) this.sound.blocked();
      return this.restart(this.tiles[i].el, 'shake');
    }
    if (this.selected === i) return this.select(-1);
    if (this.selected >= 0 && g.canMatch(this.selected, i)) {
      const a = this.selected;
      this.selected = -1;
      g.match(a, i);
      return;
    }
    if (this.sound) this.sound.select();
    // On New Year's Day, a sweet chosen in January is a temptation.
    if (g.tempting(i)) this.say('Tempting… but taking a sweet before February breaks your resolution.');
    this.select(i);
  }

  select(i) {
    this.selected = i;
    this.refresh();
  }

  setKeying(on) {
    this.keying = on;
    this.el.classList.toggle('keying', on);
  }

  // Puts the tiles in another set of faces, and names them by it: as when
  // another holiday is chosen with the turtle on the table.
  setFaces(set) {
    this.faceSet = set;
    this.el.dataset.faces = set;
    for (let i = 0; i < this.game.layout.count; i++) this.paint(i);
    this.refresh();
  }

  matched({ turned }) {
    if (turned) this.turnOver(0);
    this.refresh();
  }

  undone(entry) {
    this.selected = -1;
    if (entry.type === 'match') {
      this.paint(entry.a);
      this.paint(entry.b);
      if (entry.souls) this.turnOver(1);
      if (entry.gold) for (const k of entry.gold) this.rings[k].classList.remove('won');
      if (entry.dance) for (const i of entry.dance.swaps.flat()) this.paint(i);
      if (entry.followers) for (const i of entry.followers) this.paint(i);
    } else if (entry.type === 'save') this.paint(entry.tile);
    else this.shuffled();
    this.refresh();
  }

  shuffled() {
    this.selected = -1;
    const g = this.game;
    for (let i = 0; i < g.layout.count; i++) {
      if (!g.present[i]) continue;
      this.restart(this.tiles[i].el, 'jiggle');
      setTimeout(() => this.paint(i), 140);
    }
    this.refresh();
  }

  // The tiles turn over, in a wave from left to right, showing the side
  // they were on until they reach the middle of their turn.
  turnOver(from) {
    const g = this.game;
    const L = g.layout;
    if (still()) {
      for (let i = 0; i < L.count; i++) if (g.present[i]) this.paint(i);
      return;
    }
    this.busy++;
    let last = 0;
    for (let i = 0; i < L.count; i++) {
      if (!g.present[i]) continue;
      this.paint(i, from);
      const delay = Math.round((L.x[i] / L.width) * 900 + L.z[i] * 60);
      last = Math.max(last, delay);
      const el = this.tiles[i].el;
      el.style.animationDelay = `${delay}ms`;
      this.restart(el, 'flip');
      setTimeout(() => this.paint(i), delay + 200);
    }
    setTimeout(() => this.busy--, last + 420);
  }

  // Shows the faces the tiles will turn over to, while the moon is held.
  peek(on) {
    const g = this.game;
    this.el.classList.toggle('peeking', on && g.turnAhead);
    for (let i = 0; i < g.layout.count; i++) if (g.present[i]) this.paint(i, on && g.turnAhead ? 1 : g.side);
  }

  // A hint: the planchette glides to one tile of the pair and then the
  // other, and the two of them glow. A tile in the fridge only glows: the
  // planchette keeps to the table.
  show(pair) {
    for (const i of pair) this.restart(this.tiles[i].el, 'hint');
    const onTable = pair.filter((i) => i < this.tableCount);
    if (!onTable.length) return;
    if (!this.planchette) {
      this.planchette = planchette();
      this.el.append(this.planchette);
      this.glide(this.el.offsetWidth / 2, this.el.offsetHeight + this.planchette.offsetHeight);
    }
    const p = this.planchette;
    clearTimeout(this.gliding);
    void p.offsetWidth;
    p.classList.add('on');
    this.glide(...this.centre(onTable[0]));
    this.gliding = setTimeout(() => {
      this.glide(...this.centre(onTable.at(-1)));
      this.gliding = setTimeout(() => p.classList.remove('on'), 1500);
    }, 700);
  }

  // The middle of a tile on the board, or of the board itself.
  centre(i = -1) {
    if (i < 0) return [this.el.offsetWidth / 2, this.el.offsetHeight / 2];
    const t = this.tiles[i].el;
    return [t.offsetLeft + t.offsetWidth / 2, t.offsetTop + t.offsetHeight / 2];
  }

  // A few words, such as the points a move earned, rising from a tile or
  // the middle of the board, or a point on it, and fading away.
  float(text, i = -1, cost = false) {
    this.floatAt(text, this.centre(i), cost);
  }

  floatAt(text, [x, y], cost = false) {
    const el = document.createElement('div');
    el.className = cost ? 'float cost' : 'float';
    el.textContent = text;
    el.setAttribute('aria-hidden', 'true');
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    this.el.append(el);
    setTimeout(() => el.remove(), 1300);
  }

  // Moves the planchette so that its window sits over a point on the board.
  glide(x, y) {
    const p = this.planchette;
    p.style.transform = `translate(${x - p.offsetWidth / 2}px, ${y - p.offsetHeight * WINDOW}px)`;
  }

  // Plays an animation on a tile from the start, and takes it off at the end.
  restart(el, name) {
    if (still()) {
      if (name === 'hint') {
        el.classList.add('hint');
        setTimeout(() => el.classList.remove('hint'), 2400);
      }
      return;
    }
    el.classList.remove(name);
    void el.offsetWidth;
    el.classList.add(name);
    el.addEventListener(
      'animationend',
      () => {
        el.classList.remove(name);
        el.style.animationDelay = '';
      },
      { once: true },
    );
  }

  // Moves the keyboard's focus to the nearest free tile in a direction.
  move(key) {
    const g = this.game;
    const L = g.layout;
    const free = g.freeTiles().filter((j) => j < this.tableCount); // on the table: the fridge has its own buttons
    if (!free.length) return;
    const at = document.activeElement && document.activeElement.closest && document.activeElement.closest('.tile');
    if (!at) return this.tiles[free[0]].el.focus();
    const i = Number(at.dataset.i);
    const [dx, dy] = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[key];
    let best = -1;
    let bestScore = Infinity;
    for (const j of free) {
      const vx = L.x[j] - L.x[i];
      const vy = L.y[j] - L.y[i];
      const along = vx * dx + vy * dy;
      if (j === i || along <= 0) continue;
      const score = along + 2 * Math.abs(vx * dy - vy * dx);
      if (score < bestScore) {
        best = j;
        bestScore = score;
      }
    }
    if (best >= 0) this.tiles[best].el.focus();
  }
}
