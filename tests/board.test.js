import { test, check, equal } from './run.js';
import { tileFit, tileSpots } from '../js/ui/board.js';
import * as layouts from '../js/engine/layouts.js';
import { TURTLE, UPRIGHT_TURTLE, PUMPKIN, GROUNDHOG } from '../js/engine/layouts.js';

// The space the board has on a phone held upright, in its browser, between
// the bars: 384 by 720, as on a Galaxy S25+, less the bars' 135. And on a
// laptop.
const PHONE = [384, 585];
const LAPTOP = [1280, 640];

test('on a phone held upright, a board nine tiles across fills its width, its tiles 40px wide', () => {
  equal(tileFit(PUMPKIN, ...PHONE), 40, 'the pumpkin');
  equal(tileFit(GROUNDHOG, ...PHONE), 35, 'the groundhog, twelve down, fills its height');
});

test("on a phone held upright, the upright turtle's tiles are much bigger than the classic's, and on a laptop smaller", () => {
  equal(tileFit(TURTLE, ...PHONE), 24, 'the classic, on a phone');
  equal(tileFit(UPRIGHT_TURTLE, ...PHONE), 39, 'the upright turtle, on a phone');
  check(tileFit(TURTLE, ...LAPTOP) > tileFit(UPRIGHT_TURTLE, ...LAPTOP), "on a laptop, the classic's are the bigger");
});

test('tiles are drawn no wider than 88px, nor narrower than 16px', () => {
  equal(tileFit(PUMPKIN, 3000, 3000), 88, 'on a big screen');
  equal(tileFit(TURTLE, 100, 100), 16, 'in a small space');
});

// Whether two boxes, each [left, top, right, bottom], overlap.
const overlap = (a, b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];

test('on every board, a taller stack beside a tile may lie over its top left corner, but never over its top right, where its number is', () => {
  const over = new Set(); // the tiles, 40px wide, with a stack over a number in their top left corner
  for (const w of [24, 40, 88]) {
    // A tile's face as the page draws it, less the gap between tiles.
    const gap = Math.max(1, Math.round(w * 0.04));
    const [fw, fh] = [w - gap, Math.round((w * 4) / 3) - gap];
    for (const [name, L] of Object.entries(layouts)) {
      const at = tileSpots(L, w);
      // Part of a face, as faces.js draws it on 60 by 80: its number, ring
      // and all, from 35 to 60 across and 2 to 28 down; and a digit where
      // the numbers were, from 4 to 18 across and 5 to 25 down.
      const part = (i, [x0, y0, x1, y1]) => [at[i][0] + (fw * x0) / 60, at[i][1] + (fh * y0) / 80, at[i][0] + (fw * x1) / 60, at[i][1] + (fh * y1) / 80];
      for (let a = 0; a < L.x.length; a++) {
        for (let b = 0; b < L.x.length; b++) {
          const onIt = Math.abs(L.x[a] - L.x[b]) < 2 && Math.abs(L.y[a] - L.y[b]) < 2; // on top of it, not beside it
          if (L.z[b] <= L.z[a] || onIt) continue;
          const face = [at[b][0], at[b][1], at[b][0] + fw, at[b][1] + fh];
          check(!overlap(face, part(a, [35, 2, 60, 28])), `on ${name}, ${w}px wide, a stack beside tile ${a} lies over its number`);
          if (w === 40 && overlap(face, part(a, [4, 5, 18, 25]))) over.add(`${name} ${a}`);
        }
      }
    }
  }
  const tiles = Object.values(layouts).reduce((n, L) => n + L.x.length, 0);
  check(over.size > 0, 'no stack lies over a top left corner');
  return `40px wide, a stack would lie over a number in the top left of ${over.size} of the ${tiles} tiles`;
});

// Each badge a twist puts on a tile: the tile's class, what it shows, and
// for a frozen tile, the matches still to thaw it.
const BADGES = [
  ['lord'], ['piper'], ['rocket'], ['lit'], ['sweet', { sweet: '🍩' }], ['coin'], ['balloon'], ['', { confetti: 'red' }],
  ['sparkler'], ['sparkler burning', { burn: '5' }], ['pail', { fresh: '8' }], ['follows'], ['unlocked'], ['listed'],
  ['zone-top'], ['zone-bottom'], ['buster'], ['frozen', {}, '12'],
];

test('no badge a twist puts on a tile covers its number, nor lies where a stack one layer taller on its left lies over it', async () => {
  // How far a layer lifts a tile, at every width: under 14% of it.
  const stack = { x: [0, 0], y: [0, 0], z: [0, 1], depth: 2 }; // one tile on another
  const lift = (w) => tileSpots(stack, w)[1][0] - tileSpots(stack, w)[0][0];
  let most = 0;
  for (let w = 16; w <= 88; w++) most = Math.max(most, lift(w) / w);
  check(most < 0.14, `a layer lifts ${Math.round(most * 100)}% of a tile`);
  // The game's styles, for a moment, and a tile with each badge on it.
  const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: 'css/game.css' });
  const loaded = new Promise((resolve) => (link.onload = resolve));
  document.head.append(link);
  await loaded;
  const place = document.createElement('div');
  document.body.append(place);
  try {
    for (const w of [34, 40, 60, 88]) {
      place.style.cssText = `position:absolute;left:-3000px;top:0;--tile-w:${w}px;--tile-h:${Math.round((w * 4) / 3)}px;--gap:${Math.max(1, Math.round(w * 0.04))}px`;
      for (const [kind, data = {}, ice] of BADGES) {
        const tile = document.createElement('div');
        tile.className = `tile ${kind}`.trim();
        Object.assign(tile.dataset, data);
        if (ice) tile.innerHTML = `<span class="ice"><b>${ice}</b></span>`;
        place.append(tile);
        const t = tile.getBoundingClientRect();
        // Its number, as faces.js draws it on a tile 60 by 80: ending 57.5
        // across, no wider than 20.2, the widest digit, and 4 to 26 down.
        const number = [(t.width * 37.3) / 60, (t.height * 4) / 80, (t.width * 57.5) / 60, (t.height * 26) / 80];
        const boxes = ['::before', '::after']
          .map((p) => getComputedStyle(tile, p))
          .filter((s) => s.position === 'absolute' && s.content !== 'none')
          .map((s) => {
            const [left, top] = [parseFloat(s.left), parseFloat(s.top)];
            return [left, top, left + parseFloat(s.width) + parseFloat(s.paddingLeft) + parseFloat(s.paddingRight), top + parseFloat(s.height) + parseFloat(s.paddingTop) + parseFloat(s.paddingBottom)];
          });
        if (ice) {
          const b = tile.querySelector('b').getBoundingClientRect();
          boxes.push([b.left - t.left, b.top - t.top, b.right - t.left, b.bottom - t.top]);
        }
        const name = `${kind || 'confetti'}, ${w}px wide`;
        check(boxes.length === 1 && boxes[0].every(Number.isFinite), `${name}: its badge not found`);
        check(!overlap(boxes[0], number), `${name}: its badge covers the number`);
        check(boxes[0][0] >= lift(w), `${name}: its badge starts ${boxes[0][0].toFixed(1)}px in, under a layer's ${lift(w)}px`);
        tile.remove();
      }
    }
  } finally {
    place.remove();
    link.remove();
  }
  return `a layer lifts ${(most * 100).toFixed(1)}% of a tile at the most`;
});
