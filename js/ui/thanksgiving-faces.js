import { INK, PAPER, LEAF, PIPS, STICKS, style, n } from './draw.js';

// Thanksgiving's set of faces: the same 43 as Halloween's, which match just
// as those do, drawn as the harvest and the feast. The eyes are cranberries,
// the bones ears of corn and the graves fallen leaves; the four monsters,
// which stand for the winds, are the harvest's apple, gourd, acorn and
// pinecone; the jack-o'-lantern, the witch's brew and the ghost, where a
// set's dragons stand, are the dishes friends bring to the potluck, the
// turkey, the green beans and the mashed potatoes; the poison garden is
// autumn's flowers and the moons are pies, any two of which match, as any
// two flowers and any two moons do; and the lost soul is a worry, for the
// Sunday Scaries. Drawn as faces.js draws Halloween's, on a tile 60 by 80,
// whole: faces.js shrinks a drawing to make room for its index.

const NUMBERS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const SUITS = { eyes: 'Cranberries', bones: 'Corn', graves: 'Leaves' };

// Each face's name, by its key in tiles.js, and the kinds' that have more
// than one face.
const names = {
  vampire: 'Apple',
  werewolf: 'Gourd',
  mummy: 'Acorn',
  zombie: 'Pinecone',
  lantern: 'Turkey',
  brew: 'Green beans',
  ghost: 'Mashed potatoes',
  nightshade: 'Sunflower',
  foxglove: 'Mum',
  hemlock: 'Aster',
  wolfsbane: 'Marigold',
  'new-moon': 'Pumpkin pie',
  'waxing-moon': 'Apple pie',
  'full-moon': 'Pecan pie',
  'waning-moon': 'Cherry pie',
  'lost-soul': 'Worry',
};
for (const [suit, title] of Object.entries(SUITS)) NUMBERS.forEach((number, k) => (names[`${suit}-${k + 1}`] = `${number} of ${title}`));
const kinds = { flower: 'Autumn flower', moon: 'Pie' };

function draw(f) {
  if (f.group === 'eyes') return f.index === '1' ? sprig() : PIPS[f.index].map((p) => berry(...p)).join('');
  if (f.group === 'bones') return f.index === '1' ? flintCorn() : STICKS[f.index].map((s) => ear(...s)).join('');
  if (f.group === 'graves') return leaf(f.index);
  if (f.group === 'moon') return pie(f.key);
  return ART[f.key]();
}

export const THANKSGIVING = { draw, names, kinds };

// ------------------------------------------------------------- cranberries

// A cranberry, glossy, darker below: the middle one of the five and the
// nine is still ripening, pale, as the middle dot of a dots tile is red.
function berry(cx, cy, r, pale = false) {
  const [under, over] = pale ? ['#d4607c', '#f4a9bb'] : ['#9a1430', '#d42c4c'];
  return (
    `<ellipse cx="${cx}" cy="${cy}" rx="${n(r * 0.95)}" ry="${r}" ${style(under, INK, n(Math.max(1, r / 7)))}/>` +
    `<ellipse cx="${n(cx - r * 0.1)}" cy="${n(cy - r * 0.13)}" rx="${n(r * 0.72)}" ry="${n(r * 0.76)}" ${style(over)}/>` +
    `<ellipse cx="${n(cx - r * 0.36)}" cy="${n(cy - r * 0.4)}" rx="${n(r * 0.25)}" ry="${n(r * 0.15)}" transform="rotate(-35 ${n(cx - r * 0.36)} ${n(cy - r * 0.4)})" ${style('#fff', 'none', 0, ';opacity:0.85')}/>`
  );
}

// The one of cranberries: a cluster of them under a leafy bough, one still
// ripening.
function sprig() {
  return (
    `<path d="M7 25 C18 22 32 21 52 14" ${style('none', '#6b3a22', 2.4)}/>` +
    leafAt(12, 23.8, -120, 9, 3.8) +
    leafAt(26, 21.6, -80, 9, 3.8) +
    leafAt(42, 17.6, -60, 9, 3.8) +
    leafAt(51, 14.4, -10, 8, 3.6) +
    leafAt(19, 22.8, 140, 8.5, 3.6) +
    berry(21, 33, 8) +
    berry(38, 28.5, 8) +
    berry(29.5, 46, 9.5) +
    berry(16, 47, 6.5, true)
  );
}

// A small leaf from (x, y), pointing at the angle given in degrees.
function leafAt(x, y, deg, len, wide) {
  const a = (deg * Math.PI) / 180;
  const [ux, uy] = [Math.cos(a), Math.sin(a)];
  const at = (along, across) => `${n(x + ux * len * along - uy * wide * across)} ${n(y + uy * len * along + ux * wide * across)}`;
  return (
    `<path d="M${x} ${y} C${at(0.3, 1)} ${at(0.8, 0.7)} ${at(1, 0)} C${at(0.8, -0.7)} ${at(0.3, -1)} ${x} ${y} Z" ${style('#3f7d3a', INK, 0.9)}/>` +
    `<path d="M${x} ${y} L${at(0.8, 0)}" ${style('none', '#2a5a28', 0.7)}/>`
  );
}

// ------------------------------------------------------------------ corn

// An ear of corn standing up, in its husk: where a bone stands, as long,
// [x, y, length, width].
function ear(cx, cy, len, w) {
  const r = w * 0.7; // half the cob's width
  const top = cy - len / 2;
  const foot = cy + len / 2;
  const rows = [];
  for (let y = top + r * 0.95; y < cy + len * 0.22; y += w * 0.5) rows.push(`M${n(cx - r * 0.82)} ${n(y)} H${n(cx + r * 0.82)}`);
  const husk = (s) =>
    `<path d="M${cx} ${n(foot)} C${n(cx + s * r * 1.7)} ${n(foot - len * 0.1)} ${n(cx + s * r * 1.45)} ${n(cy + len * 0.2)} ${n(cx + s * r * 1.02)} ${n(cy + len * 0.06)} ` +
    `C${n(cx + s * r * 0.7)} ${n(cy + len * 0.24)} ${n(cx + s * r * 0.28)} ${n(foot - len * 0.12)} ${cx} ${n(foot)} Z" ${style('#6aa43c', INK, n(w * 0.13))}/>`;
  return (
    `<path d="M${n(cx - r)} ${n(foot - len * 0.06)} V${n(top + r)} A${n(r)} ${n(r)} 0 0 1 ${n(cx + r)} ${n(top + r)} V${n(foot - len * 0.06)} Z" ${style('#f4c63d', INK, n(w * 0.15))}/>` +
    `<path d="${rows.join(' ')} M${cx} ${n(top + r * 0.45)} V${n(cy + len * 0.24)}" ${style('none', '#c48a12', n(w * 0.11))}/>` +
    husk(-1) +
    husk(1)
  );
}

// The one of corn: an ear of flint corn, its kernels every colour, its
// husk peeled back.
function flintCorn() {
  const colours = ['#b8322a', '#e3a92f', '#6d3a7a', '#d9692a', '#f2dfa5', '#8c2b22', '#e8c04a'];
  let kernels = '';
  for (let row = 0; row < 11; row++) {
    const y = 21 + row * 3.9;
    const half = 5.6 + (y - 21) * 0.09; // the cob's half-width there, less a kernel's
    const count = Math.max(2, Math.round((half * 2) / 3.9) + 1);
    for (let k = 0; k < count; k++) {
      const x = 30 - half + (k * half * 2) / (count - 1);
      kernels += `<ellipse cx="${n(x)}" cy="${n(y)}" rx="2.05" ry="1.8" ${style(colours[(row * 3 + k * 5 + ((row * k) % 4)) % colours.length], '#3a1a10', 0.5)}/>`;
    }
  }
  const husk = (d) => `<path d="${d}" ${style('#e8d49a', INK, 1.1)}/>`;
  return (
    husk('M30 61 C22 61 14 64 9 72 C16 71.5 22 70 30 64 Z') +
    husk('M30 61 C38 61 46 64 51 72 C44 71.5 38 70 30 64 Z') +
    husk('M29 62 C26 67 26 72 29 78 C31 73 32.5 67 31 62 Z') +
    `<path d="M21 62 C20 45 21.5 28 24 21 C26.5 14.5 33.5 14.5 36 21 C38.5 28 40 45 39 62 Z" ${style('#4a2216', INK, 1.4)}/>` +
    kernels +
    `<path d="M21.5 62.5 C25 59.5 35 59.5 38.5 62.5" ${style('none', INK, 1.2)}/>`
  );
}

// ---------------------------------------------------------------- leaves

// A maple leaf, its right half from the tip down to the stem.
const MAPLE = [[30, 15], [33, 22], [37, 19.5], [36.5, 28], [36, 34], [42, 31], [44.5, 26], [46.5, 31], [53, 28.5], [49, 37], [52, 40], [41, 47], [46, 50.5], [47.5, 57], [40, 55], [35, 59], [31.5, 61]];
const MAPLE_PATH = `M${MAPLE.concat(MAPLE.slice(1).reverse().map(([x, y]) => [60 - x, y]))
  .map(([x, y]) => `${x} ${y}`)
  .join(' L')} Z`;

// A fallen leaf with its number on it, as a grave has.
function leaf(number) {
  return (
    `<path d="M30 58 C31 65 30.5 70 27 75.5" ${style('none', '#7a3e12', 2.4)}/>` +
    `<path d="${MAPLE_PATH}" ${style('#e0702c', INK, 1.3)}/>` +
    `<path d="M30 60 V20 M30 51 L48.5 30.5 M30 51 L11.5 30.5 M30 56 L45 55.5 M30 56 L15 55.5" ${style('none', '#b5501c', 1)}/>` +
    `<text x="30" y="50" text-anchor="middle" style="fill:#3a1606;stroke:#e0702c;stroke-width:3;stroke-linejoin:round;paint-order:stroke;font:700 22px Georgia,'Times New Roman',serif">${number}</text>`
  );
}

// ------------------------------------------------------------------ pies

// A pie in a blue dish, from a little above: its crimped crust, and what
// shows of it, each pie's own. Drawn a little small, and then made bigger.
const CRUST = '#e2ae5e';
const EDGE = '#a8722b'; // the crust's browned edges
const SQUASH = 8.2 / 17; // how much a circle on the pie is foreshortened

function pie(key) {
  const crimps = Array.from({ length: 22 }, (_, k) => {
    const a = (k * 2 * Math.PI) / 22;
    return `M${n(30 + 17.8 * Math.cos(a))} ${n(44 + 8.8 * Math.sin(a))} L${n(30 + 21.2 * Math.cos(a))} ${n(44 + 10.5 * Math.sin(a))}`;
  }).join(' ');
  return (
    `<g transform="translate(30 46) scale(1.15) translate(-30 -44)">` +
    `<path d="M7.5 44 L11 57 C14 64 46 64 49 57 L52.5 44 Z" ${style('#3f63a8', INK, 1.3)}/>` +
    `<path d="M14 52.6 L14.8 58 M21 55 L21.4 60.6 M30 56 V62 M39 55 L38.6 60.6 M46 52.6 L45.2 58" ${style('none', '#86a6e6', 1)}/>` +
    `<ellipse cx="30" cy="44" rx="22.5" ry="11.2" ${style(CRUST, INK, 1.3)}/>` +
    `<path d="${crimps}" ${style('none', EDGE, 1)}/>` +
    PIES[key]() +
    '</g>'
  );
}

const filling = (colour) => `<ellipse cx="30" cy="44" rx="17" ry="8.2" ${style(colour, EDGE, 0.9)}/>`;

// A point on the pie's top, given on the circle it is before foreshortening.
const onPie = (x, y) => [n(30 + x), n(44 + y * SQUASH)];

// A strip of lattice crust across a pie of radius 17: at angle a, offset o
// from the middle, w wide.
function strip(a, o, w) {
  const u = [Math.cos(a), Math.sin(a)];
  const v = [-u[1], u[0]];
  const ends = (e, s) => {
    const t = Math.sqrt(17 * 17 - e * e) * s;
    return onPie(e * v[0] + t * u[0], e * v[1] + t * u[1]);
  };
  const corners = [ends(o - w / 2, -1), ends(o - w / 2, 1), ends(o + w / 2, 1), ends(o + w / 2, -1)];
  return `<path d="M${corners.map((p) => p.join(' ')).join(' L')} Z" ${style('#ebbf72', EDGE, 0.7)}/>`;
}

const PIES = {
  'new-moon': () =>
    filling('#d4691c') +
    [[20, 46], [40, 43], [24, 48.8], [37, 48], [33, 39.5], [22.5, 41.5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.7" ${style('#8a3f12')}/>`).join('') +
    `<path d="M23 45.5 C20.5 42.5 23.5 39 26.5 39.8 C26 35 34 35 33.5 39.6 C36.5 39 39.5 42.5 37 45.5 Z" ${style(PAPER, INK, 0.9)}/>` +
    `<path d="M27.5 39.2 C28.5 36.5 31.5 37 31.2 34.6 M25 43 C27 41.5 30 41.5 31.5 43" ${style('none', '#cfc3ad', 0.9)}/>`,

  'waxing-moon': () =>
    `<ellipse cx="30" cy="43.4" rx="18.4" ry="9.2" ${style('#e9bd6e', EDGE, 0.9)}/>` +
    `<path d="M16.5 41.5 C19.5 37.5 25.5 35.6 31 35.6" ${style('none', '#f7da9c', 1.6)}/>` +
    `<path d="M18.5 47.5 C20.5 44.8 24.5 44.6 26.2 46.6 C24.4 49.3 20.4 49.6 18.5 47.5 Z M41.5 47.5 C39.5 44.8 35.5 44.6 33.8 46.6 C35.6 49.3 39.6 49.6 41.5 47.5 Z" ${style('#f1cb83', EDGE, 0.7)}/>` +
    `<path d="M30 38.5 V44 M25 40.2 L27.6 44 M35 40.2 L32.4 44" ${style('none', '#7a4a16', 1.4)}/>`,

  'full-moon': () => {
    const nuts = Array.from({ length: 8 }, (_, k) => {
      const a = (k * 2 * Math.PI) / 8 + Math.PI / 8;
      const [x, y] = onPie(11 * Math.cos(a), 11 * Math.sin(a));
      const turn = n((Math.atan2(Math.sin(a) * SQUASH, Math.cos(a)) * 180) / Math.PI);
      return (
        `<ellipse cx="${x}" cy="${y}" rx="3.1" ry="1.75" transform="rotate(${turn} ${x} ${y})" ${style('#a85c2a', '#4a1f08', 0.6)}/>` +
        `<path d="M${n(x - 2 * Math.cos((turn * Math.PI) / 180))} ${n(y - 2 * Math.sin((turn * Math.PI) / 180))} L${n(x + 2 * Math.cos((turn * Math.PI) / 180))} ${n(y + 2 * Math.sin((turn * Math.PI) / 180))}" ${style('none', '#5e2a0c', 0.6)}/>`
      );
    }).join('');
    return (
      filling('#7a3814') +
      nuts +
      `<ellipse cx="30" cy="44" rx="3.3" ry="1.9" ${style('#a85c2a', '#4a1f08', 0.6)}/><path d="M27.8 44 H32.2" ${style('none', '#5e2a0c', 0.6)}/>`
    );
  },

  'waning-moon': () =>
    filling('#b3132c') +
    [[30, 44], [24, 41.5], [36, 46.5], [36, 41.5], [24, 46.5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.9" ${style('#ff7186')}/>`).join('') +
    [-11, -3.6, 3.6, 11].map((o) => strip(Math.PI / 4, o, 3.4)).join('') +
    [-11, -3.6, 3.6, 11].map((o) => strip(-Math.PI / 4, o, 3.4)).join(''),
};

// ------------------------------------------------------- everything else

// A flower's stem and two leaves, rising to its head.
const stem = (top) =>
  `<path d="M30 74 C29 66 31.5 58 30 ${top}" ${style('none', LEAF, 2.4)}/>` +
  `<path d="M30 64 C23 60 16 62 13 67 C19 70 26 69 30 64 Z M30.5 58 C37 53.5 44 54.5 47 59 C41 63 35 62.5 30.5 58 Z" ${style(LEAF, INK, 0.8)}/>`;

// Petals round a flower's middle: count of them, each len long and wide
// wide, their middles at dist from it.
const petals = (cx, cy, count, dist, len, wide, fill, edge, turn = 0) =>
  Array.from(
    { length: count },
    (_, k) => `<ellipse cx="${cx}" cy="${n(cy - dist)}" rx="${wide}" ry="${len}" transform="rotate(${n((k * 360) / count + turn)} ${cx} ${cy})" ${style(fill, edge, 0.6)}/>`,
  ).join('');

// A ruffled ring, as a marigold's petals are: bumps of them round a circle r.
function ruff(cx, cy, r, bumps, fill, turn = 0) {
  const at = (rr, a) => `${n(cx + rr * Math.cos(a))} ${n(cy + rr * Math.sin(a))}`;
  let d = `M${at(r, turn)}`;
  for (let k = 0; k < bumps; k++) {
    const a = turn + (k * 2 * Math.PI) / bumps;
    const b = turn + ((k + 1) * 2 * Math.PI) / bumps;
    d += ` Q${at(r * 1.32, (a + b) / 2)} ${at(r, b)}`;
  }
  return `<path d="${d} Z" ${style(fill, '#9a4210', 0.7)}/>`;
}

// A frill on the end of a drumstick's bone.
function frill(cx, cy, r) {
  const points = Array.from({ length: 14 }, (_, k) => {
    const a = (k * Math.PI) / 7;
    const rr = k % 2 ? r * 0.6 : r;
    return `${n(cx + rr * Math.cos(a))},${n(cy + rr * Math.sin(a))}`;
  });
  return `<polygon points="${points.join(' ')}" ${style(PAPER, INK, 0.8)}/>`;
}

// A green bean, curving from one end to the other.
const bean = (x1, y1, x2, y2, bend) => {
  const mx = (x1 + x2) / 2 - ((y2 - y1) * bend) / 10;
  const my = (y1 + y2) / 2 + ((x2 - x1) * bend) / 10;
  const d = `M${x1} ${y1} Q${n(mx)} ${n(my)} ${x2} ${y2}`;
  return `<path d="${d}" ${style('none', INK, 5)}/><path d="${d}" ${style('none', '#6cb33f', 3.4)}/>`;
};

const ART = {
  vampire: () =>
    `<path d="M30.5 29 C30 23 31 19 33.5 15.5" ${style('none', '#6b4423', 2.4)}/>` +
    `<path d="M32 21.5 C35 15 42 13.5 47 15.5 C44 21 37 23.5 32 21.5 Z" ${style(LEAF, INK, 1)}/>` +
    `<path d="M33.5 20.5 C37 18.5 41 17 44.5 16.5" ${style('none', '#2a6b3c', 0.8)}/>` +
    `<path d="M30 29.5 C24 24 10 26 10.5 44 C11 59 21 71 30 67.5 C39 71 49 59 49.5 44 C50 26 36 24 30 29.5 Z" ${style('#cf2f2c', INK, 1.4)}/>` +
    `<path d="M17 37.5 C18.5 33 22 30.8 25.5 31.2" ${style('none', '#ff9d8a', 2.6)}/>`,

  werewolf: () => {
    const outline = 'M26.5 25 C26.5 21 33.5 21 33.5 25 C33.5 34 47 39.5 47 54 C47 66 39 72 30 72 C21 72 13 66 13 54 C13 39.5 26.5 34 26.5 25 Z';
    return (
      `<path d="M30 22.5 C30 18.5 31.5 16 34 14.5" ${style('none', '#6b4423', 2.6)}/>` +
      `<path d="M33.2 16.2 C38 12.6 42.4 16 39.4 18.6 C37.4 20.2 35.4 18.2 37.2 16.9" ${style('none', LEAF, 1.1)}/>` +
      `<path d="${outline}" ${style('#f1c23e')}/>` +
      `<path d="M13.3 57 C16.5 52 20 58.5 23.5 53.5 C26.5 58.5 33.5 58.5 36.5 53.5 C40 58.5 43.5 52 46.7 57 C45.6 66.5 38.5 72 30 72 C21.5 72 14.4 66.5 13.3 57 Z" ${style('#4b8a3a')}/>` +
      `<path d="M30 26 V71 M27.5 30 C20 40 17.5 56 21.5 70 M32.5 30 C40 40 42.5 56 38.5 70" ${style('none', '#fff', 1.1, ';opacity:0.45')}/>` +
      `<path d="${outline}" ${style('none', INK, 1.4)}/>`
    );
  },

  mummy: () => {
    const scales = [
      [33, [23.25, 27.75, 32.25, 36.75]],
      [37.5, [16.5, 21, 25.5, 30, 34.5, 39, 43.5]],
      [42, [14.25, 18.75, 23.25, 27.75, 32.25, 36.75, 41.25, 45.75]],
    ]
      .flatMap(([y, xs]) => xs.map((x) => `M${x - 2.25} ${y} q2.25 2.6 4.5 0`))
      .join(' ');
    return (
      `<path d="M30 31 C30 27 31.5 24 34 22" ${style('none', '#5a3418', 2.8)}/>` +
      `<path d="M14.5 45.5 C14 60 23 68 30 74 C37 68 46 60 45.5 45.5 Z" ${style('#c98a45', INK, 1.4)}/>` +
      `<path d="M19.5 50 C20 57 23.5 63 27.5 67" ${style('none', '#e8b87e', 2.2)}/>` +
      `<path d="M11 44 C10 26 50 26 49 44 C41 47.5 19 47.5 11 44 Z" ${style('#7a4b26', INK, 1.4)}/>` +
      `<path d="${scales}" ${style('none', '#4d2c13', 0.9)}/>`
    );
  },

  zombie: () => {
    const rows = [[67, 1], [61, 2], [55, 3], [49, 4], [43, 5], [37, 4], [31, 3], [25, 2]];
    const scales = rows
      .map(([y, count]) =>
        Array.from({ length: count }, (_, k) => {
          const x = 30 + (k - (count - 1) / 2) * 6.6;
          return `<path d="M${n(x - 3.4)} ${y - 3} V${y + 0.8} C${n(x - 3.4)} ${y + 4.6} ${n(x + 3.4)} ${y + 4.6} ${n(x + 3.4)} ${y + 0.8} V${y - 3} Z" ${style('#a86b34', '#4d2c13', 0.8)}/>`;
        }).join(''),
      )
      .join('');
    return (
      `<path d="M30 20 L22 9.5 M30 20 L26 7.5 M30 20 L31 6.5 M30 20 L36 8 M30 20 L40.5 11" ${style('none', '#3f7d3a', 1.5)}/>` +
      `<path d="M30 22 V15" ${style('none', '#5a3418', 2.4)}/>` +
      `<path d="M30 18 C40 18 47 28 46.5 40 C46 55 38 67 30 73 C22 67 14 55 13.5 40 C13 28 20 18 30 18 Z" ${style('#5a3418', INK, 1.2)}/>` +
      scales
    );
  },

  lantern: () => {
    const greens = (s) => {
      const x = (v) => n(30 + s * (v - 30));
      return `<path d="M${x(5)} 61 C${x(7)} 56 ${x(12)} 57 ${x(12)} 60 C${x(14)} 57 ${x(18)} 59 ${x(16)} 62 C${x(17)} 65 ${x(12)} 67 ${x(10)} 64.5 C${x(7)} 67 ${x(3)} 64 ${x(5)} 61 Z" ${style(LEAF, INK, 0.8)}/>`;
    };
    const drumstick = (s) => {
      const x = (v) => n(30 + s * (v - 30));
      return (
        `<path d="M${x(13.2)} 31.6 L${x(9.4)} 26.6" ${style('none', INK, 3.8)}/>` +
        `<path d="M${x(13.2)} 31.6 L${x(9.4)} 26.6" ${style('none', PAPER, 2.2)}/>` +
        frill(x(8.8), 25.6, 3.1) +
        `<ellipse cx="${x(18.5)}" cy="38.5" rx="6.2" ry="8.6" transform="rotate(${-38 * s} ${x(18.5)} 38.5)" ${style('#a95a22', INK, 1.2)}/>` +
        `<path d="M${x(16)} 36 C${x(17)} 33.5 ${x(19)} 33 ${x(20.5)} 34" ${style('none', '#d68a48', 1.6)}/>`
      );
    };
    return (
      `<ellipse cx="30" cy="63" rx="27.5" ry="9" ${style(PAPER, INK, 1.4)}/>` +
      `<ellipse cx="30" cy="62.5" rx="22" ry="6" ${style('none', '#c8bda8', 1)}/>` +
      greens(1) +
      greens(-1) +
      `<path d="M9.5 60 C7 47 16 33 30 33 C44 33 53 47 50.5 60 C43 64.5 17 64.5 9.5 60 Z" ${style('#b4642a', INK, 1.4)}/>` +
      `<path d="M16.5 47 C19.5 41 25 37.5 31 37.5" ${style('none', '#dd9654', 2.8)}/>` +
      `<path d="M21 58.5 C18 52.5 21 46.5 27 45.5 M39 58.5 C42 52.5 39 46.5 33 45.5" ${style('none', '#8a4618', 1.3)}/>` +
      drumstick(1) +
      drumstick(-1)
    );
  },

  brew: () =>
    `<rect x="2.5" y="50" width="8" height="4.6" rx="2.3" ${style('#b5452f', INK, 1.1)}/>` +
    `<rect x="49.5" y="50" width="8" height="4.6" rx="2.3" ${style('#b5452f', INK, 1.1)}/>` +
    `<path d="M7.5 49 L10.5 61 C13 67.5 47 67.5 49.5 61 L52.5 49 Z" ${style('#c8553d', INK, 1.4)}/>` +
    `<path d="M12 57 C20 61.5 40 61.5 48 57" ${style('none', '#e8866e', 1.4)}/>` +
    `<ellipse cx="30" cy="49" rx="23" ry="7.5" ${style('#d8674c', INK, 1.4)}/>` +
    `<ellipse cx="30" cy="49" rx="19.5" ry="5.6" ${style('#3f7a2e')}/>` +
    bean(13, 47, 27, 40.5, -2) +
    bean(32, 47.5, 47, 44, 2) +
    bean(18, 42, 33, 35, 3) +
    bean(22, 48, 38, 40, 2.5) +
    bean(28, 37.5, 43, 33.5, -3) +
    bean(36, 44, 46, 37.5, 2) +
    `<path d="M20 37 q2 -2 4 0 M33 31 q2 -2 4 0 M39.5 40.5 q2 -2 4 0 M26 44.2 q2 -2 4 0 M15 44.5 q1.6 -2 3.2 0 M30.5 39 q1.6 -2 3.2 0" ${style('none', '#7a4416', 2.6)}/>` +
    `<path d="M20 37 q2 -2 4 0 M33 31 q2 -2 4 0 M39.5 40.5 q2 -2 4 0 M26 44.2 q2 -2 4 0 M15 44.5 q1.6 -2 3.2 0 M30.5 39 q1.6 -2 3.2 0" ${style('none', '#eab04e', 1.4)}/>` +
    `<path d="M7 49 A23 7.5 0 0 0 53 49 L49.5 49 A19.5 5.6 0 0 1 10.5 49 Z" ${style('#d8674c', INK, 1.2)}/>`,

  ghost: () =>
    `<path d="M22 69.5 L23.5 73.5 H36.5 L38 69.5 Z" ${style('#3f6fb8', INK, 1.2)}/>` +
    `<path d="M8.5 47 C8.5 61 18 70 30 70 C42 70 51.5 61 51.5 47 Z" ${style('#3f6fb8', INK, 1.4)}/>` +
    `<path d="M11.8 56 C20 60.8 40 60.8 48.2 56" ${style('none', '#a9c6f0', 1.8)}/>` +
    `<ellipse cx="30" cy="47" rx="21.5" ry="4" ${style('#2c5394', INK, 1.2)}/>` +
    `<path d="M10.5 47.5 C9 41 14 36.5 19.5 37.5 C19 31 26.5 27.5 30.5 31 C34.5 26.5 43 29.5 41.5 36 C47 35.5 52 41 49.5 47.5 Z" ${style(PAPER, INK, 1.3)}/>` +
    `<path d="M16 44 C18.5 41 22.5 41.5 23.5 44.5 M27.5 37.5 C30 34.5 34.5 35.5 35 39 M33.5 44.5 C36 42 40.5 42.5 41.5 45.5" ${style('none', '#cbbd9e', 1.2)}/>` +
    `<path d="M8.5 47 A21.5 4 0 0 0 51.5 47 L49.6 47 A19.6 3 0 0 1 10.4 47 Z" ${style('#3f6fb8', INK, 1)}/>` +
    `<path d="M25.5 29.5 L32.5 27 L35 32 L28 34.5 Z" ${style('#ffd54a', INK, 0.9)}/>` +
    `<path d="M28.6 34.6 C28.7 37 30 38 30.6 36.2" ${style('none', '#f2c234', 1.6)}/>`,

  nightshade: () =>
    stem(46) +
    petals(30, 34, 14, 11.5, 6.6, 3, '#f6c21c', '#a87408') +
    `<circle cx="30" cy="34" r="8" ${style('#5e3317', INK, 1)}/>` +
    `<circle cx="30" cy="34" r="5" ${style('#7a4420')}/>` +
    [[27, 31.6], [30, 30.6], [33, 31.6], [26.2, 34.5], [30, 34], [33.8, 34.5], [27.5, 37.4], [32.5, 37.4]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.9" ${style('#2e1708')}/>`)
      .join(''),

  foxglove: () =>
    stem(48) +
    petals(30, 35, 20, 10.5, 5.2, 1.9, '#9b2335', '#5e1420') +
    petals(30, 35, 15, 7, 4.2, 1.8, '#b8344a', '#5e1420', 12) +
    petals(30, 35, 10, 3.8, 3.2, 1.6, '#d04e63', '#5e1420', 18) +
    `<circle cx="30" cy="35" r="2.2" ${style('#e8808e')}/>`,

  hemlock: () => {
    const head = (cx, cy, r) => petals(cx, cy, 16, n(r * 0.6), n(r * 0.42), n(r * 0.13), '#8b64cc', '#4e3388') + `<circle cx="${cx}" cy="${cy}" r="${n(r * 0.27)}" ${style('#f2c21c', '#a8790a', 0.6)}/>`;
    return (
      `<path d="M30 74 C29 66 31.5 60 30 56 M30 57 C26 52 22.5 46 20 41 M30 56 C34 50 38 44 40 39" ${style('none', LEAF, 2)}/>` +
      `<path d="M30 66 C23 62 17 64 14 68.5 C20 71 26 70.5 30 66 Z M30.5 61 C36.5 57 42.5 58 45.5 62 C40 65.5 35 65 30.5 61 Z" ${style(LEAF, INK, 0.8)}/>` +
      head(20, 32, 11) +
      head(40, 30, 10) +
      head(30, 48, 9.5)
    );
  },

  wolfsbane: () =>
    stem(48) +
    ruff(30, 35, 12.5, 14, '#e0661a') +
    ruff(30, 35, 9, 11, '#f08a22', 0.3) +
    ruff(30, 35, 5.6, 8, '#f7ac34', 0.6) +
    `<circle cx="30" cy="35" r="2.2" ${style('#c2560f')}/>`,

  'lost-soul': () =>
    `<circle cx="30" cy="45" r="18" ${style('#bfe2f4', '#3e8fb8', 1.5)}/>` +
    `<path d="M18.5 36.5 L25.5 33 M41.5 36.5 L34.5 33" ${style('none', '#1b4a5c', 1.8)}/>` +
    `<ellipse cx="24" cy="42" rx="2.3" ry="3.1" ${style('#1b4a5c')}/><ellipse cx="36" cy="42" rx="2.3" ry="3.1" ${style('#1b4a5c')}/>` +
    `<path d="M21.5 55.5 C23.5 52.5 26 52.5 27.5 54.5 C29 56.5 31 56.5 32.5 54.5 C34 52.5 36.5 52.5 38.5 55.5" ${style('none', '#1b4a5c', 1.7)}/>` +
    `<path d="M46 25 C48.5 29.5 50.5 32 48.8 35 C47.3 37.5 43.6 36.8 43.8 33.6 C44 31.2 45.3 28.6 46 25 Z" ${style('#6cc6ef', '#2d7fae', 0.9)}/>` +
    `<circle cx="45.4" cy="33.4" r="0.9" ${style('#fff')}/>`,
};
