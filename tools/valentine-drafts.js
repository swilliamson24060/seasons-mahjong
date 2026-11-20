import { makeLayout } from '../js/engine/layout.js';
import { BOW, HEART, ENVELOPE, ROSES, CANDLES, CHOCOLATES, XO, RING } from '../js/engine/layouts.js';

// Valentine's Day's eight boards as planned (PLAN.md), drawn as layout.js
// reads them, to be checked and looked at (tools/valentine.html) before
// each was made. Each has been made since, its drawing moved to
// js/engine/layouts.js, where some changed as their twists were tried.
//
// A board is drawn as layers, or as parts, each drawn apart and moved by
// dx and dy half tiles, joined into one board, as the X and the O were.

export const DRAFTS = [
  // 1. Cupid's bow drawn, an arrow on its string pointing up, ready to fly:
  // made, and drawn in js/engine/layouts.js.
  { key: 'BOW', title: "Cupid's bow", name: "Cupid's bow", layout: BOW },
  // 2. A heart pierced by Cupid's arrow: made, and drawn in
  // js/engine/layouts.js.
  { key: 'HEART', title: 'Love at first sight', name: 'Pierced heart', layout: HEART },
  // 3. A valentine in its envelope, the flap closed in a V and sealed with
  // a heart at its point: made, and drawn in js/engine/layouts.js.
  { key: 'ENVELOPE', title: 'A secret admirer', name: 'Envelope', layout: ENVELOPE },
  // 4. A dozen roses in a vase: made, and drawn in js/engine/layouts.js.
  { key: 'ROSES', title: 'A dozen roses', name: 'Vase of roses', layout: ROSES },
  // 5. Dinner by candlelight: made, and drawn in js/engine/layouts.js.
  { key: 'CANDLES', title: 'The first date', name: 'Candlelight', layout: CANDLES },
  // 6. A box of chocolates with its lid off: made, and drawn in
  // js/engine/layouts.js.
  { key: 'CHOCOLATES', title: 'A box of chocolates', name: 'Box of chocolates', layout: CHOCOLATES },
  // 7. Hugs and kisses, an X over an O: made, and drawn in
  // js/engine/layouts.js in two parts.
  { key: 'XO', title: 'Hugs and kisses', name: 'X and O', layout: XO },
  // 8. A ring, a diamond on its band: made, and drawn in
  // js/engine/layouts.js, its bottom layer hollow under the crown beside the
  // diamond's middle and the crown two tiles wider, so that the peak never
  // stands over a number.
  { key: 'RING', title: 'Be mine', name: 'Ring', layout: RING },
];

// A draft's cells, [x, y, layer], as layout.js reads a drawing.
const SHIFT = { '#': [0, 0], '>': [1, 0], v: [0, 1], '+': [1, 1] };
function cellsOf(layers, dx = 0, dy = 0) {
  const cells = [];
  layers.forEach((drawing, z) => {
    const lines = drawing.split('\n').filter((line) => line.trim());
    const indent = Math.min(...lines.map((line) => line.length - line.trimStart().length));
    lines.forEach((line, y) => {
      [...line.slice(indent).trimEnd()].forEach((ch, x) => {
        const s = SHIFT[ch];
        if (s) cells.push([x * 2 + s[0] + dx, y * 2 + s[1] + dy, z]);
      });
    });
  });
  return cells;
}

// A draft as a layout, its parts joined, or the board itself once made: it
// throws, as layout.js does, if two tiles overlap, a tile has nothing under
// it, or the count is odd.
export function draftLayout(d) {
  if (d.layout) return d.layout;
  const parts = d.parts || [{ layers: d.layers }];
  return makeLayout(d.name, parts.flatMap((p) => cellsOf(p.layers, p.dx, p.dy)));
}
