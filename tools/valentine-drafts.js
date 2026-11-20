import { makeLayout } from '../js/engine/layout.js';
import { BOW, HEART, ENVELOPE, ROSES } from '../js/engine/layouts.js';

// Valentine's Day's eight boards as planned (PLAN.md), drawn as layout.js
// reads them, to be checked and looked at (tools/valentine.html) before
// each is made: not yet in the game. As a board is made, its drawing moves
// to js/engine/layouts.js, and may change there as its twist is tried.
//
// A board is drawn as layers, or as parts, each drawn apart and moved by
// dx and dy half tiles, joined into one board: the X and the O.

const X = [
  `
  ###...###
  .###.###.
  ..#####..
  .###.###.
  ###...###
  `,
  `
  >>....>>.
  .>>..>>..
  ..>>>>...
  .>>..>>..
  >>....>>.
  `,
  `
  .#.....#.
  ..#...#..
  ...###...
  ..#...#..
  .#.....#.
  `,
  `
  .........
  .........
  ...>>....
  `,
];

const O = [
  `
  .#######.
  ###...###
  ##.....##
  ###...###
  .#######.
  `,
  `
  .++++++..
  ++....++.
  +......+.
  ++....++.
  .++++++..
  `,
  `
  ..#####..
  .#.....#.
  .#.....#.
  .#.....#.
  ..#####..
  `,
  `
  ....#....
  .........
  .........
  .........
  ....#....
  `,
];

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
  // 5. Dinner by candlelight: two tall candles in their candlesticks, their
  // flames above them, on the table. 108 tiles on four layers, nine across.
  {
    key: 'CANDLES',
    title: 'The first date',
    name: 'Candlelight',
    layers: [
      `
      .>....>..
      .vv...vv.
      .vv...vv.
      .vv...vv.
      .vv...vv.
      .vv...vv.
      +++..+++.
      .+....+..
      vvvvvvvvv
      vvvvvvvvv
      `,
      `
      .>....>..
      .+....+..
      .+....+..
      .+....+..
      .+....+..
      .+....+..
      .vv...vv.
      .........
      .........
      >>>>>>>>.
      `,
      `
      .>....>..
      .+....+..
      .+....+..
      .+....+..
      .+....+..
      .+....+..
      .........
      .........
      .........
      .#######.
      `,
      `
      .>....>..
      .+....+..
      .+....+..
      .+....+..
      .+....+..
      .+....+..
      .........
      .........
      .........
      ..#####..
      `,
    ],
  },
  // 6. A box of chocolates with its lid off: nine chocolates in three rows,
  // each a chocolate raised on its paper cup, inside the box's walls. 118
  // tiles on three layers, nine across and nine down.
  {
    key: 'CHOCOLATES',
    title: 'A box of chocolates',
    name: 'Box of chocolates',
    layers: [
      `
      #########
      ###>>.###
      ###>>.###
      #vv++.vv#
      #vv++.vv#
      #.......#
      ###>>.###
      ###>>.###
      #########
      `,
      `
      #########
      #+..v.+.#
      #.......#
      #.......#
      #>..#.>.#
      #.......#
      #+..v.+.#
      #.......#
      #########
      `,
      `
      .........
      .+..v.+..
      .........
      .........
      .>..#.>..
      .........
      .+..v.+..
      `,
    ],
  },
  // 7. Hugs and kisses: an X over an O, bold, with a ridge along their
  // strokes and a crest along the ridge, the O half a tile lower. 132 tiles
  // on four layers, nine across.
  {
    key: 'XO',
    title: 'Hugs and kisses',
    name: 'X and O',
    parts: [{ layers: X }, { layers: O, dy: 11 }],
  },
  // 8. A ring, its band round an open middle, and a diamond raised high on
  // top, coming to a point where it sits on the band: the full set of 144,
  // on six layers.
  {
    key: 'RING',
    title: 'Be mine',
    name: 'Ring',
    layers: [
      `
      ..#####..
      .#######.
      ..#####..
      ....#....
      ..#####..
      .#######.
      ###...###
      ##.....##
      ###...###
      .#######.
      ..#####..
      `,
      `
      ..>>>>...
      .>>>>>>..
      ..>>>>...
      ...>>....
      ..>>>>...
      .>....>..
      >>....>>.
      >......>.
      >>....>>.
      .>....>..
      ..>>>>...
      `,
      `
      ..#####..
      ..#####..
      ...###...
      ....#....
      ...###...
      ..#...#..
      .#.....#.
      .#.....#.
      .#.....#.
      ..#...#..
      ...###...
      `,
      `
      ...>>....
      ..>>>>...
      ...>>....
      .........
      ...>>....
      .........
      .........
      .........
      .........
      .........
      ...>>....
      `,
      `
      ....#....
      ...###...
      ....#....
      `,
      `
      .........
      ....#....
      `,
    ],
  },
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
