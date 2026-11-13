import { INK, PAPER, DARK, LEAF, PIPS, STICKS, style, n } from './draw.js';

// Christmas's set of faces: the same 43 as Halloween's, which match just as
// those do, drawn as Christmas. The eyes are ornaments, the bones candy
// canes and the graves presents; the four monsters, which stand for the
// winds, are the song's four birds, the partridge, the turtle dove, the
// French hen and the calling bird; the jack-o'-lantern, the witch's brew and
// the ghost, where a set's red, green and white dragons stand, are the
// stocking, the tree and the snowman; the poison garden is Christmas's
// plants, poinsettia, holly, mistletoe and the Christmas rose, and the moons
// are snowflakes, any two of which match, as any two flowers and any two
// moons do, though no two snowflakes are alike; and the lost soul is a lump
// of coal, for Twelfth Night. Drawn as faces.js draws Halloween's, on a tile
// 60 by 80, whole: faces.js shrinks a drawing to make room for its index.

const NUMBERS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const SUITS = { eyes: 'Ornaments', bones: 'Candy Canes', graves: 'Presents' };

// Each face's name, by its key in tiles.js, and the kinds' that have more
// than one face.
const names = {
  vampire: 'Partridge',
  werewolf: 'Turtle dove',
  mummy: 'French hen',
  zombie: 'Calling bird',
  lantern: 'Stocking',
  brew: 'Christmas tree',
  ghost: 'Snowman',
  nightshade: 'Poinsettia',
  foxglove: 'Holly',
  hemlock: 'Mistletoe',
  wolfsbane: 'Christmas rose',
  'new-moon': 'Star snowflake',
  'waxing-moon': 'Fern snowflake',
  'full-moon': 'Plate snowflake',
  'waning-moon': 'Twelve-pointed snowflake',
  'lost-soul': 'Lump of coal',
};
for (const [suit, title] of Object.entries(SUITS)) NUMBERS.forEach((number, k) => (names[`${suit}-${k + 1}`] = `${number} of ${title}`));
const kinds = { flower: 'Christmas plant', moon: 'Snowflake' };

function draw(f) {
  if (f.group === 'eyes') return f.index === '1' ? bigBauble() : PIPS[f.index].map((p) => bauble(...p)).join('');
  if (f.group === 'bones') return f.index === '1' ? bigCane() : STICKS[f.index].map((s) => cane(...s)).join('');
  if (f.group === 'graves') return present(f.index);
  if (f.group === 'moon') return flake(f.key);
  return ART[f.key]();
}

export const CHRISTMAS = { draw, names, kinds };

const RED = '#d3263a';
const DEEP_RED = '#93121f';
const GOLD = '#f2c14e';
const DEEP_GOLD = '#b07d12';
const GREEN = '#2e8a47';
const DEEP_GREEN = '#1c5e30';
const SILVER = '#c9ced8';

// A bow of ribbon tied at (x, y), s its size: two loops, two tails and the
// knot.
function bow(x, y, s, fill, edge = INK) {
  const loop = (k) => {
    const X = (v) => n(x + k * v * s);
    const Y = (v) => n(y + v * s);
    return `M${x} ${y} C${X(0.5)} ${Y(-1.5)} ${X(2.3)} ${Y(-1.3)} ${X(2.1)} ${Y(-0.15)} C${X(2)} ${Y(0.55)} ${X(0.9)} ${Y(0.45)} ${x} ${y} Z`;
  };
  const tail = (k) => {
    const X = (v) => n(x + k * v * s);
    const Y = (v) => n(y + v * s);
    return `M${X(0.15)} ${Y(0.2)} L${X(1.15)} ${Y(1.95)} L${X(0.6)} ${Y(1.7)} L${X(0.25)} ${Y(2)} L${X(-0.1)} ${Y(0.35)} Z`;
  };
  const w = n(Math.max(0.6, s * 0.16));
  return (
    `<path d="${tail(-1)} ${tail(1)}" ${style(fill, edge, w)}/>` +
    `<path d="${loop(-1)} ${loop(1)}" ${style(fill, edge, w)}/>` +
    `<ellipse cx="${x}" cy="${y}" rx="${n(s * 0.42)}" ry="${n(s * 0.38)}" ${style(fill, edge, w)}/>`
  );
}

// A leaf from (x, y), pointing at the angle given in degrees, len long and
// wide wide, with its midrib.
function leaf(x, y, deg, len, wide, fill = LEAF, rib = DEEP_GREEN, edge = 0.8) {
  const a = (deg * Math.PI) / 180;
  const [ux, uy] = [Math.cos(a), Math.sin(a)];
  const at = (along, across) => `${n(x + ux * len * along - uy * wide * across)} ${n(y + uy * len * along + ux * wide * across)}`;
  return (
    `<path d="M${n(x)} ${n(y)} C${at(0.25, 1)} ${at(0.72, 0.8)} ${at(1, 0)} C${at(0.72, -0.8)} ${at(0.25, -1)} ${n(x)} ${n(y)} Z" ${style(fill, INK, edge)}/>` +
    (rib ? `<path d="M${n(x)} ${n(y)} L${at(0.82, 0)}" ${style('none', rib, 0.7)}/>` : '')
  );
}

// A berry, round and glossy.
const berry = (cx, cy, r, fill = RED, edge = INK) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" ${style(fill, edge, n(Math.max(0.6, r / 4.5)))}/>` +
  `<circle cx="${n(cx - r * 0.35)}" cy="${n(cy - r * 0.35)}" r="${n(r * 0.28)}" ${style('#fff', 'none', 0, ';opacity:0.85')}/>`;

// ------------------------------------------------------------- ornaments

// An ornament, a glass bauble hanging from its cap, with a band round it
// and a shine: the middle one of the five and the nine is gold, as the
// middle dot of a dots tile is red.
function bauble(cx, cy, r, gold = false) {
  const [body, band, cap] = gold ? [GOLD, RED, SILVER] : [RED, GOLD, GOLD];
  const y = cy + r * 0.14; // the glass's middle, below its cap
  const g = r * 0.86; // and its radius
  const at = (deg) => {
    const a = (deg * Math.PI) / 180;
    return `${n(cx + g * Math.cos(a))} ${n(y + g * Math.sin(a))}`;
  };
  const capTop = cy - r * 0.98;
  return (
    `<circle cx="${cx}" cy="${n(y)}" r="${n(g)}" ${style(body, INK, n(Math.max(1, r / 7)))}/>` +
    `<path d="M${at(172)} Q${cx} ${n(y + g * 0.42)} ${at(8)} A${n(g)} ${n(g)} 0 0 1 ${at(28)} Q${cx} ${n(y + g * 0.84)} ${at(152)} A${n(g)} ${n(g)} 0 0 1 ${at(172)} Z" ${style(band, 'none', 0)}/>` +
    `<ellipse cx="${n(cx - g * 0.4)}" cy="${n(y - g * 0.42)}" rx="${n(g * 0.24)}" ry="${n(g * 0.14)}" transform="rotate(-40 ${n(cx - g * 0.4)} ${n(y - g * 0.42)})" ${style('#fff', 'none', 0, ';opacity:0.8')}/>` +
    `<rect x="${n(cx - r * 0.3)}" y="${n(capTop)}" width="${n(r * 0.6)}" height="${n(r * 0.3)}" rx="${n(r * 0.06)}" ${style(cap, INK, n(Math.max(0.6, r / 11)))}/>` +
    `<path d="M${n(cx - r * 0.13)} ${n(capTop)} A${n(r * 0.13)} ${n(r * 0.15)} 0 1 1 ${n(cx + r * 0.13)} ${n(capTop)}" ${style('none', INK, n(Math.max(0.6, r / 12)))}/>`
  );
}

// The one of ornaments: a great bauble hanging by its ribbon from a bow,
// a band of gold round it set with stars.
function bigBauble() {
  const y = 50;
  const g = 18.5;
  const at = (deg) => {
    const a = (deg * Math.PI) / 180;
    return `${n(30 + g * Math.cos(a))} ${n(y + g * Math.sin(a))}`;
  };
  const stars = [17.5, 23.8, 30, 36.2, 42.5].map((x, k) => {
    const sy = y + 5.6 + Math.abs(k - 2) * -0.9;
    const pts = Array.from({ length: 10 }, (_, j) => {
      const a = -Math.PI / 2 + (j * Math.PI) / 5;
      const rr = j % 2 ? 0.9 : 2.1;
      return `${n(x + rr * Math.cos(a))},${n(sy + rr * Math.sin(a))}`;
    });
    return `<polygon points="${pts.join(' ')}" ${style('#fff', 'none', 0)}/>`;
  });
  return (
    `<path d="M30 30 V15" ${style('none', RED, 1.6)}/>` +
    bow(30, 14, 4.4, RED) +
    `<circle cx="30" cy="${y}" r="${g}" ${style(RED, INK, 1.6)}/>` +
    `<path d="M${at(176)} Q30 ${n(y + 7.5)} ${at(4)} A${g} ${g} 0 0 1 ${at(34)} Q30 ${n(y + 19)} ${at(146)} A${g} ${g} 0 0 1 ${at(176)} Z" ${style(GOLD, DEEP_GOLD, 0.8)}/>` +
    stars.join('') +
    `<path d="M17.5 42 C19 36 23.5 33 28 32.5" ${style('none', '#ff9aa4', 2.6)}/>` +
    `<rect x="25.5" y="28.5" width="9" height="5" rx="1" ${style(GOLD, INK, 1.1)}/>` +
    `<path d="M27 30 V32.5 M29.2 30 V32.5 M31.4 30 V32.5 M33.6 30 V32.5" ${style('none', DEEP_GOLD, 0.7)}/>`
  );
}

// ----------------------------------------------------------- candy canes

// A candy cane standing where a bone stands, as long, [x, y, length, width]:
// its crook to the left, white with red stripes and a thin green one
// between each two.
function cane(cx, cy, len, w) {
  const t = w * 0.75; // how thick the cane is
  const r = w * 0.65; // its crook's radius, to the middle of the cane
  const top = cy - len / 2 + t / 2;
  const foot = cy + len / 2 - t / 2;
  return stick(`M${n(cx + r)} ${n(foot)} V${n(top + r)} A${n(r)} ${n(r)} 0 0 0 ${n(cx - r)} ${n(top + r)} V${n(top + r * 1.7)}`, t);
}

// A cane's stick along the path d, t thick: outlined, white, and striped.
function stick(d, t) {
  const out = n(Math.max(0.6, t * 0.15));
  const red = n(t * 0.55);
  const gap = n(t * 0.8);
  const green = n(t * 0.18);
  return (
    `<path d="${d}" ${style('none', INK, n(t + out * 2))}/>` +
    `<path d="${d}" ${style('none', '#fff', n(t))}/>` +
    `<path d="${d}" ${style('none', RED, n(t), `;stroke-linecap:butt;stroke-dasharray:${red} ${gap}`)}/>` +
    `<path d="${d}" ${style('none', GREEN, n(t), `;stroke-linecap:butt;stroke-dasharray:${green} ${n(red + gap - green)};stroke-dashoffset:${n(-(red + gap / 2 - green / 2))}`)}/>`
  );
}

// The one of candy canes: a great cane tied with a green bow.
function bigCane() {
  return (
    stick('M37.5 73 V24 A8 8 0 0 0 21.5 24 V30', 8.4) +
    bow(37.5, 42, 5.4, GREEN) +
    leaf(38.5, 46.5, 115, 9, 3.2, LEAF, DEEP_GREEN, 0.7) +
    berry(39.5, 46, 1.9)
  );
}

// -------------------------------------------------------------- presents

// A present with its number on the tag where its ribbons cross, as a grave
// has its number.
function present(number) {
  const box = '#3d69c6';
  const lid = '#5480dc';
  const ribbon = style(GOLD, DEEP_GOLD, 0.7);
  return (
    `<rect x="11" y="40" width="38" height="32" rx="1.2" ${style(box, INK, 1.4)}/>` +
    `<path d="M14 42.5 V69" ${style('none', '#6f93e2', 1.4)}/>` +
    `<rect x="26.8" y="40.5" width="6.4" height="31" ${ribbon}/>` +
    `<rect x="11.5" y="52.5" width="37" height="6" ${ribbon}/>` +
    `<rect x="9" y="33" width="42" height="8" rx="1.2" ${style(lid, INK, 1.4)}/>` +
    `<rect x="26.8" y="33.5" width="6.4" height="7" ${ribbon}/>` +
    bow(30, 32.5, 6, GOLD) +
    `<circle cx="30" cy="55.5" r="10" ${style('#fff8e6', DEEP_GOLD, 1.2)}/>` +
    `<text x="30" y="62.4" text-anchor="middle" style="fill:${DEEP_RED};font:700 19px Georgia,'Times New Roman',serif">${number}</text>`
  );
}

// ------------------------------------------------------------ snowflakes

// A snowflake on a winter night, each of the four its own: its six arms are
// drawn once, pointing up from the middle, and turned round it.
const SKY = '#1f3a6e';
const SNOW = '#f4fbff';
const ICE = '#7fb3e8';

// Lines of ice along d: a glow of blue, and the white on it.
const ice = (d, w) => `<path d="${d}" ${style('none', ICE, n(w + 1.6), ';opacity:0.7')}/><path d="${d}" ${style('none', SNOW, w)}/>`;

// A hexagon of radius r round (cx, cy), a point up.
const hexagon = (cx, cy, r) =>
  `M${Array.from({ length: 6 }, (_, k) => {
    const a = -Math.PI / 2 + (k * Math.PI) / 3;
    return `${n(cx + r * Math.cos(a))} ${n(cy + r * Math.sin(a))}`;
  }).join(' L')} Z`;

const FLAKES = {
  'new-moon': {
    arm: ice('M30 44 V28 M30 35.6 L24.8 31 M30 35.6 L35.2 31', 2.4),
  },
  'waxing-moon': {
    arm: ice('M30 44 V27.5 M30 40.6 L27.6 38.4 M30 40.6 L32.4 38.4 M30 36.8 L26.4 33.6 M30 36.8 L33.6 33.6 M30 32.8 L27.2 30.3 M30 32.8 L32.8 30.3', 1.7),
  },
  'full-moon': {
    arm: ice('M30 38 V29.5 M30 34 L27.6 32 M30 34 L32.4 32', 2.1) + `<path d="${hexagon(30, 28.6, 2.6)}" ${style(SNOW, ICE, 0.9)}/>`,
    middle: `<path d="${hexagon(30, 44, 7)}" ${style(SNOW, ICE, 1.2)}/><path d="${hexagon(30, 44, 4)}" ${style('none', ICE, 1)}/>`,
  },
  'waning-moon': {
    arm: ice('M30 44 V29.5 M30 44 L34.25 36.64', 1.7) + `<circle cx="30" cy="28.2" r="2.1" ${style(SNOW, ICE, 0.8)}/><circle cx="34.75" cy="35.77" r="1.4" ${style(SNOW, ICE, 0.7)}/>`,
    middle: `<circle cx="30" cy="44" r="2.6" ${style(SNOW, ICE, 0.8)}/>`,
  },
};

function flake(key) {
  const { arm, middle = '' } = FLAKES[key];
  const specks = [[16, 33, 0.8], [43.5, 31, 0.7], [45, 55, 0.9], [15.5, 55.5, 0.7], [37, 61, 0.6], [22, 26.5, 0.6]];
  return (
    `<circle cx="30" cy="44" r="19.5" ${style(SKY, INK, 1.3)}/>` +
    specks.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" ${style(SNOW, 'none', 0, ';opacity:0.8')}/>`).join('') +
    [0, 60, 120, 180, 240, 300].map((turn) => `<g transform="rotate(${turn} 30 44)">${arm}</g>`).join('') +
    middle
  );
}

// ------------------------------------------------------- everything else

// A spiky holly leaf from (x, y), pointing at the angle given in degrees.
function hollyLeaf(x, y, deg, len, wide) {
  const a = (deg * Math.PI) / 180;
  const [ux, uy] = [Math.cos(a), Math.sin(a)];
  const at = (along, across) => `${n(x + ux * len * along - uy * wide * across)} ${n(y + uy * len * along + ux * wide * across)}`;
  const edge = [[0.1, 0.5], [0.22, 1.05], [0.34, 0.66], [0.48, 1.05], [0.62, 0.62], [0.76, 0.92], [0.88, 0.42]];
  const side = (s) => edge.map(([p, q]) => at(p, s * q));
  return (
    `<path d="M${at(0, 0)} L${side(1).join(' L')} L${at(1.05, 0)} L${side(-1).reverse().join(' L')} Z" ${style(GREEN, INK, 0.8)}/>` +
    `<path d="M${at(0, 0)} L${at(0.9, 0)}" ${style('none', '#7fc28f', 0.8)}/>`
  );
}

// The petals of a flower round its middle: count of them, each a rounded
// petal len long and wide wide, its middle dist from the flower's.
const petals = (cx, cy, count, dist, len, wide, fill, edge, turn = 0) =>
  Array.from(
    { length: count },
    (_, k) => `<ellipse cx="${cx}" cy="${n(cy - dist)}" rx="${wide}" ry="${len}" transform="rotate(${n((k * 360) / count + turn)} ${cx} ${cy})" ${style(fill, edge, 0.8)}/>`,
  ).join('');

// A bird's eye: dark, with a glint.
const eye = (x, y, r = 1.4, ring = '') =>
  (ring ? `<circle cx="${x}" cy="${y}" r="${n(r + 0.8)}" ${style(ring)}/>` : '') +
  `<circle cx="${x}" cy="${y}" r="${r}" ${style(DARK)}/><circle cx="${n(x - r * 0.35)}" cy="${n(y - r * 0.35)}" r="${n(r * 0.35)}" ${style('#fff')}/>`;

// A bough for a bird to perch on, from one side to the other.
const bough = (d) => `<path d="${d}" ${style('none', INK, 4.4)}/><path d="${d}" ${style('none', '#7a5030', 2.8)}/>`;

// A quaver, a note of a bird's song, its head at (x, y).
const note = (x, y) =>
  `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="1.8" transform="rotate(-25 ${x} ${y})" ${style(INK)}/>` +
  `<path d="M${n(x + 2.1)} ${n(y - 0.6)} V${n(y - 10)} C${n(x + 3)} ${n(y - 7.5)} ${n(x + 6.5)} ${n(y - 7)} ${n(x + 5)} ${n(y - 3.5)}" ${style('none', INK, 1.1)}/>`;

const ART = {
  // The partridge, in her pear tree: a plump grey bird, her face orange, a
  // chestnut horseshoe on her breast and chestnut bars on her flanks.
  vampire: () =>
    bough('M5 65 C18 63 34 65.5 55 61.5') +
    `<path d="M46.5 63.5 C46.5 66 46 67.5 46 68.5" ${style('none', '#6b4423', 1.4)}/>` +
    leaf(46.3, 64.5, -10, 7, 2.6) +
    `<path d="M46 68 C43.6 68 43.8 70.6 42.6 72.6 C41.2 75 43 77.6 46 77.6 C49 77.6 50.8 75 49.4 72.6 C48.2 70.6 48.4 68 46 68 Z" ${style('#c3d64c', INK, 1)}/>` +
    `<path d="M43.6 72.8 C43.2 74.4 43.8 75.8 45 76.4" ${style('none', '#eef3a6', 1.2)}/>` +
    `<path d="M27 59.5 L26 64.5 M33 60 L33.6 64.8" ${style('none', '#8a8278', 1.6)}/>` +
    `<path d="M11.5 37 C11.5 46 16 58 30 60.5 C40 61.5 46 57 49 52 L56.5 49.5 L51 43.5 C46 37 36 34 27 35.5 C25.5 31 24 27 18.5 26.4 C13.5 26 10.5 29.5 10.6 33 C10.6 35 11 36.2 11.5 37 Z" ${style('#a9a59c', INK, 1.4)}/>` +
    `<path d="M27 36 C36 33.5 46 36.5 51 43.5 L56 49.2 L49 50.5 C44 47.5 37 44.5 29.5 43 C27.6 41 27 38.5 27 36 Z" ${style('#8c6c4a', INK, 0.9)}/>` +
    `<path d="M33 37.5 L36 40 M39 38.5 L42 41.5 M44.5 41 L47 44.5 M35 42.5 L38.5 44" ${style('none', '#d1b183', 1.1)}/>` +
    `<path d="M36.5 47 L35.6 55.5 M40.5 46.5 L40 55 M44.5 47.5 L44 53" ${style('none', '#a4552a', 1.8)}/>` +
    `<path d="M23 48 C23.5 54.5 32.5 55 33.5 48 L30.7 48.2 C30.2 51.6 26.8 51.6 26.2 48.2 Z" ${style('#7a3518')}/>` +
    `<path d="M10.7 33 C11 29.5 14 27.5 17 28.5 C18.8 31.5 19.8 35 18.6 38.6 C16 40.5 13 39.8 11.5 37 C10.9 35.8 10.6 34.4 10.7 33 Z" ${style('#e2883a')}/>` +
    `<path d="M11 31 C12 27.5 15 25.9 19 26.5 C22 27 24.3 28.5 25.3 31.2 C21.5 29.6 17.5 29.2 13.5 30.6 Z" ${style('#7c6b58')}/>` +
    `<path d="M11 32.2 L6.6 34.2 L11.3 35.8 Z" ${style('#6f6a64', INK, 0.8)}/>` +
    eye(15.3, 32.4),

  // A turtle dove on a twig, a heart over her: slender and pink, her wings
  // scaled in rust and black, and the black and white stripes on her neck.
  werewolf: () =>
    bough('M6 60 C20 57.5 34 59.5 52 56.5') +
    leaf(14, 59, 150, 7, 2.6) +
    leaf(44, 57.5, -40, 7, 2.6) +
    `<path d="M27 53.8 L26.4 58.6 M31.4 54.4 L31.8 59" ${style('none', '#c9505a', 1.5)}/>` +
    `<path d="M11 33 C12 40 15 50 26 53.5 C33 55.5 40 55 44 53.5 L57 56.5 L56 51 L45 47 C40 40 32 35 24 34 C22.5 30 20.5 24.5 15.5 24.2 C12 24.3 10.2 27 10.3 30 C10.4 31.5 10.6 32.3 11 33 Z" ${style('#d9aea4', INK, 1.4)}/>` +
    `<path d="M10.3 30 C10.2 27 12 24.3 15.5 24.2 C20.5 24.5 22.5 30 24 34 C21 36.5 15.5 37 11 33 C10.6 32.3 10.4 31.5 10.3 30 Z" ${style('#a3abbd')}/>` +
    `<path d="M45 47 L56 51 L57 56.5 L44.5 53.6 Z" ${style('#6c6470', INK, 0.9)}/>` +
    `<path d="M25 37 C33 36 42 40 47 47 L51.5 50.5 C44 50.5 35 48.5 28 45 C25.5 43 24.5 40 25 37 Z" ${style('#c27b3f', INK, 0.9)}/>` +
    [[29, 40], [33.5, 41.5], [38, 43.5], [42.5, 46], [31, 44.5], [35.5, 46], [40, 48]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.7" ry="1.2" ${style(DARK)}/>`).join('') +
    `<g transform="rotate(-25 21.5 33)"><rect x="18.6" y="31" width="5.8" height="4.4" rx="1" ${style('#fff', INK, 0.5)}/><path d="M20 31.4 V35 M21.5 31.4 V35 M23 31.4 V35" ${style('none', DARK, 0.9)}/></g>` +
    `<path d="M10.6 29.3 L6.8 30.9 L10.8 32.2 Z" ${style('#4a3f45', INK, 0.7)}/>` +
    eye(14.6, 28.8, 1.3, '#e0703a') +
    `<path d="M41 24.5 C37.5 21.5 36 18 38.2 16.2 C40 14.8 41.2 16.4 41 17.6 C41.2 16.4 42.4 14.8 44.2 16.2 C46.4 18 44.5 21.5 41 24.5 Z" ${style(RED, INK, 0.9)}/>`,

  // A French hen, white, her tail black and her comb and wattle red,
  // standing in the straw.
  mummy: () =>
    `<path d="M8 72.5 C20 69.5 40 69.5 53 72.5" ${style('none', '#c9a04a', 3)}/>` +
    `<path d="M11 71 L15 68.5 M19 71.5 L21.5 68 M38 71 L41.5 68.5 M45 72 L49 69.5 M28 71 L30 68.6" ${style('none', '#e2c062', 1.2)}/>` +
    `<path d="M28 66 L27 70.5 L24.5 71.2 M27 70.5 L29.5 71.3 M35 66 L36 70.5 L33.6 71.3 M36 70.5 L38.6 71.2" ${style('none', '#e8a628', 1.5)}/>` +
    `<path d="M45.5 27 C48 24.5 52 24 55 26 L49 42 L44 40 Z" ${style('#2f2b33', INK, 1.2)}/>` +
    `<path d="M47.5 28.5 C49 31 49.5 35 48.6 38.5" ${style('none', '#55636a', 1.2)}/>` +
    `<path d="M13 33.5 C13 40 14 44 16 47 C18 60 26 66.5 33 66.5 C41 66.5 47 61 48.5 54 C49.5 50 50 46 49 42 C46 39 43 37.5 38 38 C32 39.5 27 37 25.2 33 C25.5 27 22.5 23.5 19 23.5 C15.5 23.5 12.8 26.5 12.6 29 L13 33.5 Z" ${style('#f2ebdc', INK, 1.4)}/>` +
    `<path d="M26 45 C33 42 42 44 46 50 C45 56 39 59 32 58.5 C27 57 24.5 52 26 45 Z" ${style('#e3d8c2', INK, 0.9)}/>` +
    `<path d="M30 49 C34 48 39 49.5 42 52 M30.5 53 C34 52.5 38 53.5 40.5 55.5" ${style('none', '#c2b498', 1)}/>` +
    [[19, 52], [22, 58], [37, 62.5], [43, 58], [27, 61], [20.5, 46.5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.9" ${style('#b49c7c')}/>`).join('') +
    `<path d="M14.5 25 C14 21 16.5 20.5 17 23 C17.5 19.5 20.5 19.5 20.5 22.8 C21.5 20 24.5 20.8 23.5 24.5 C22.5 26.5 16 27 14.5 25 Z" ${style(RED, INK, 0.9)}/>` +
    `<path d="M13.6 33 C12 35.5 13 38.5 15 38 C16.5 37.6 16.5 35 15.6 33 Z" ${style(RED, INK, 0.8)}/>` +
    `<path d="M12.8 29 L8.6 31 L12.9 32.8 Z" ${style('#f0b429', INK, 0.8)}/>` +
    eye(17.6, 29, 1.3, '#e38b2c'),

  // The calling bird, a blackbird singing on a bough, his beak open and
  // gold, a ring of gold round his eye, and his song in the air.
  zombie: () =>
    bough('M6 63 C20 60 35 61.5 54 58') +
    leaf(12, 62.5, 160, 7.5, 2.8) +
    leaf(49, 58.5, -30, 7.5, 2.8) +
    `<path d="M26 54 L25 60 M30.5 55 L31 60.5" ${style('none', '#4a4552', 1.5)}/>` +
    `<path d="M12 34 C12 42 16 51 25 54 C32 56 38 55 42 53 L55 60 L57.5 56 L45 47 C40 40 31 34.5 23.5 34.5 C23.5 29 21 25 17 25 C13.5 25 11.2 27.5 11.3 30 Z" ${style('#272231', INK, 1.4)}/>` +
    `<path d="M26 38 C33 37.5 41 41 45.5 47.5 L49 50.5 C42 51 34.5 49 29.5 46 C26.5 44 25.5 41 26 38 Z" ${style('#3a3448', '#5a5470', 0.9)}/>` +
    `<path d="M15.5 44 C17 48.5 20.5 51.5 25 53" ${style('none', '#4d4760', 1.4)}/>` +
    `<path d="M11.6 29 L4.8 27.2 L11.4 31.2 Z" ${style('#f2a51c', INK, 0.8)}/>` +
    `<path d="M11.8 32.2 L5.8 34.8 L12.2 33.8 Z" ${style('#f2a51c', INK, 0.8)}/>` +
    eye(16, 29.5, 1.1, '#f2c94c') +
    note(29, 22) +
    note(39, 15.5),

  // The stocking, hung up by its loop, its cuff white and its heel and toe
  // green, with a gold star on it.
  lantern: () =>
    `<path d="M17.5 13 C13.5 6.5 19 3.5 22 9" ${style('none', DEEP_RED, 1.6)}/>` +
    `<path d="M18 22 V56 C18 64 22 69 29 70 L45 71.5 C51.5 72 54.5 67.5 53 63.5 C51.5 59 47 57.5 43 55.5 C40 54 39 52 39 48 V22 Z" ${style(RED, INK, 1.4)}/>` +
    `<path d="M18 55 C18 64 22 69 29 70 L30.5 62.5 C25.5 61.5 21.5 59 18 54 Z" ${style(GREEN, INK, 1)}/>` +
    `<path d="M45 71.5 C51.5 72 54.5 67.5 53 63.5 C51.5 59 47.5 57.7 44.6 56.6 C44.2 61.5 44.2 66.5 45 71.5 Z" ${style(GREEN, INK, 1)}/>` +
    `<path d="M21.5 30 V50" ${style('none', '#f2737f', 2)}/>` +
    `<polygon points="${Array.from({ length: 10 }, (_, k) => {
      const a = -Math.PI / 2 + (k * Math.PI) / 5;
      const rr = k % 2 ? 2.9 : 6.6;
      return `${n(29 + rr * Math.cos(a))},${n(40 + rr * Math.sin(a))}`;
    }).join(' ')}" ${style(GOLD, DEEP_GOLD, 1)}/>` +
    `<path d="M14.5 12 H42.5 V20.5 Q40.2 24 38 21 Q35.8 24.2 33.5 21 Q31.2 24.2 28.8 21 Q26.5 24.2 24.2 21 Q21.9 24.2 19.5 21 Q17 24 14.5 20.5 Z" ${style(PAPER, '#9db3cf', 1.4)}/>` +
    `<path d="M17.5 15.5 C20 14.5 23 16.5 25.5 15 M30 15.5 C32.5 14.5 35.5 16.5 38.5 15" ${style('none', '#cfdbe9', 1.1)}/>`,

  // The tree, a star at its top, hung with ornaments and a garland of gold,
  // in its tub.
  brew: () => {
    const tier = (top, foot, half) =>
      `<path d="M30 ${top} L${30 + half} ${foot} Q${30 + half * 0.5} ${foot + 2.6} 30 ${foot + 1} Q${30 - half * 0.5} ${foot + 2.6} ${30 - half} ${foot} Z" ${style(GREEN, INK, 1.3)}/>`;
    const lights = [[25, 29, RED], [34, 34, '#3d69c6'], [22, 44, GOLD], [37.5, 47, RED], [29, 41.5, '#3d69c6'], [17.5, 58, RED], [30, 56, GOLD], [42, 58.5, '#3d69c6'], [24, 52, '#3d69c6'], [36, 52.5, GOLD]];
    return (
      `<path d="M19 67 H41 L38.5 76 H21.5 Z" ${style(RED, INK, 1.3)}/>` +
      `<path d="M19.8 70 H40.2" ${style('none', GOLD, 1.8)}/>` +
      `<rect x="26.5" y="61" width="7" height="7" ${style('#7a4a22', INK, 1.1)}/>` +
      tier(36, 60.5, 22) +
      tier(25, 47, 16.5) +
      tier(15, 34, 11) +
      `<path d="M21 31.5 Q30 36 39 30.5 M16.5 45 Q30 50.5 44 44" ${style('none', GOLD, 1.5)}/>` +
      lights.map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="2.1" ${style(c, INK, 0.7)}/>`).join('') +
      `<polygon points="${Array.from({ length: 10 }, (_, k) => {
        const a = -Math.PI / 2 + (k * Math.PI) / 5;
        const rr = k % 2 ? 2.6 : 6.2;
        return `${n(30 + rr * Math.cos(a))},${n(12 + rr * Math.sin(a))}`;
      }).join(' ')}" ${style(GOLD, DEEP_GOLD, 1)}/>`
    );
  },

  // The snowman, in his hat and scarf, with a carrot for his nose and coal
  // for his eyes and buttons.
  ghost: () =>
    `<path d="M17 52 L6 45 M9.5 47 L5.5 49 M9 47 L8 42.5 M43 52 L54 45 M50.5 47 L54.5 49 M51 47 L52 42.5" ${style('none', '#7a5030', 1.6)}/>` +
    `<circle cx="30" cy="58.5" r="15" ${style(PAPER, '#8aa2c2', 1.6)}/>` +
    `<path d="M19.5 66 C23 70 29 71.5 34 70.5" ${style('none', '#c9d6e6', 1.6)}/>` +
    `<circle cx="30" cy="34" r="10.5" ${style(PAPER, '#8aa2c2', 1.6)}/>` +
    `<path d="M19.5 42.5 C25 45.5 35 45.5 40.5 42.5 L40.8 46.5 C35 49 25 49 19.2 46.5 Z" ${style(RED, INK, 1)}/>` +
    `<path d="M34.5 46.5 L37.5 58 L33.4 58.6 L31.5 47.3 Z" ${style(RED, INK, 1)}/>` +
    `<path d="M33.6 51.5 L36 51.2 M34.6 55 L37 54.6" ${style('none', GREEN, 1.2)}/>` +
    [[30, 53], [30, 59.5], [30, 66]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" ${style(DARK)}/>`).join('') +
    `<circle cx="26.3" cy="31.5" r="1.5" ${style(DARK)}/><circle cx="33.7" cy="31.5" r="1.5" ${style(DARK)}/>` +
    `<path d="M30 34 L40 36.6 L30 37.2 Z" ${style('#f08a24', INK, 0.8)}/>` +
    `<path d="M25.5 39.5 Q30 41.8 34.5 39.5" ${style('none', DARK, 1.2, ';stroke-dasharray:0.1 2.2;stroke-width:1.6')}/>` +
    `<rect x="22.5" y="10.5" width="15" height="14" rx="1" ${style(DARK, INK, 1)}/>` +
    `<rect x="22.5" y="19.5" width="15" height="3" ${style(RED)}/>` +
    `<ellipse cx="30" cy="24.6" rx="12" ry="2.4" ${style(DARK, INK, 1)}/>` +
    leaf(36, 20.5, -30, 5, 2, LEAF, null, 0.6) +
    berry(35.6, 21.2, 1.2),

  // Christmas's plants, any two of which match: the poinsettia, its red
  // leaves round its little flowers.
  nightshade: () =>
    leaf(30, 43, 30, 25, 8.5) +
    leaf(30, 43, 150, 25, 8.5) +
    leaf(30, 43, 90, 29, 7.5) +
    [0, 60, 120, 180, 240, 300].map((d) => leaf(30, 43, d - 90, 21.5, 7.8, RED, '#f26a78', 0.9)).join('') +
    [30, 90, 150, 210, 270, 330].map((d) => leaf(30, 43, d - 90, 14, 5.8, '#e8434f', '#ff97a1', 0.8)).join('') +
    [[30, 43], [27.3, 41.3], [32.7, 41.3], [27.3, 44.7], [32.7, 44.7], [30, 39.5], [30, 46.5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" ${style('#e9d23a', '#6b8a1f', 0.6)}/>`).join(''),

  // Holly: its spiky leaves, and its berries.
  foxglove: () =>
    hollyLeaf(30, 46, -150, 25, 8) +
    hollyLeaf(30, 46, -30, 25, 8) +
    hollyLeaf(30, 46, 95, 24, 7.5) +
    berry(30, 42.5, 4.2) +
    berry(25, 48.5, 4.2) +
    berry(35, 48.5, 4.2),

  // Mistletoe, hung up by a red bow: its leaves in pairs, and its white
  // berries.
  hemlock: () => {
    const sprig = 'M30 22 V40 M30 34 C26 40 22 45 18 50 M30 34 C34 40 38 45 42 50 M30 40 C29.5 48 30 55 30.5 62';
    const pale = '#a6c45e';
    return (
      '<g transform="translate(30 44) scale(1.18) translate(-30 -44)">' +
      `<path d="${sprig}" ${style('none', INK, 3)}/><path d="${sprig}" ${style('none', '#7f9a3e', 1.7)}/>` +
      leaf(18, 50, 150, 12, 4.4, pale, '#6f8a2c') +
      leaf(18, 50, 230, 12, 4.4, pale, '#6f8a2c') +
      leaf(42, 50, 30, 12, 4.4, pale, '#6f8a2c') +
      leaf(42, 50, -50, 12, 4.4, pale, '#6f8a2c') +
      leaf(30.5, 62, 60, 12, 4.4, pale, '#6f8a2c') +
      leaf(30.5, 62, 120, 12, 4.4, pale, '#6f8a2c') +
      leaf(30, 30, 160, 11, 4, pale, '#6f8a2c') +
      leaf(30, 30, 20, 11, 4, pale, '#6f8a2c') +
      [[16.8, 51.8], [19.6, 52.8], [43.2, 51.8], [40.4, 52.8], [28.8, 64.2], [32.2, 64.4], [30.5, 61.4], [28.1, 33.3], [31.9, 33.3]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" ${style('#f7f4e6', INK, 0.7)}/>`).join('') +
      bow(30, 20, 4.2, RED) +
      '</g>'
    );
  },

  // The Christmas rose, white, its stamens gold, among its dark leaves.
  wolfsbane: () =>
    `<path d="M30 74 C29 66 31.5 58 30 48" ${style('none', DEEP_GREEN, 2.4)}/>` +
    leaf(30, 64, 205, 16, 5, '#2f6b3a', '#8fbf8f') +
    leaf(30.5, 58, -25, 16, 5, '#2f6b3a', '#8fbf8f') +
    petals(30, 37, 5, 9.2, 9.8, 8, '#fbf6f2', INK) +
    petals(30, 37, 5, 5.6, 5, 4, '#f4d3da', 'none') +
    `<circle cx="30" cy="37" r="4.6" ${style('#cfe06a', '#7d9a2a', 0.7)}/>` +
    Array.from({ length: 12 }, (_, k) => {
      const a = (k * Math.PI) / 6;
      return `<circle cx="${n(30 + 5.3 * Math.cos(a))}" cy="${n(37 + 5.3 * Math.sin(a))}" r="1.05" ${style('#f2c21c', '#a8790a', 0.4)}/>`;
    }).join(''),

  // A lump of coal, its facets catching the light.
  'lost-soul': () =>
    `<path d="M12.5 52 L17.5 38.5 L28 31.5 L42 33 L50 43 L48.5 57 L38 64.5 L22.5 63.5 Z" ${style('#2c2a31', INK, 1.5)}/>` +
    `<path d="M17.5 38.5 L28 31.5 L30.5 41 L21 46 Z" ${style('#4a4752')}/>` +
    `<path d="M28 31.5 L42 33 L38.5 41.5 L30.5 41 Z" ${style('#5d5a66')}/>` +
    `<path d="M42 33 L50 43 L41.5 47.5 L38.5 41.5 Z" ${style('#423f4a')}/>` +
    `<path d="M21 46 L30.5 41 L38.5 41.5 L41.5 47.5 L35.5 54.5 L25 53.5 Z" ${style('#37353d')}/>` +
    `<path d="M12.5 52 L21 46 L25 53.5 L22.5 63.5 Z" ${style('#3b3943')}/>` +
    `<path d="M17.5 38.5 L28 31.5 L42 33 M28 31.5 L30.5 41 L21 46 L17.5 38.5 M30.5 41 L38.5 41.5 L42 33 M38.5 41.5 L41.5 47.5 L50 43 M41.5 47.5 L35.5 54.5 L38 64.5 M35.5 54.5 L25 53.5 L21 46 M25 53.5 L22.5 63.5 M21 46 L12.5 52" ${style('none', '#1b1a1f', 0.7)}/>` +
    `<path d="M31.5 35.5 L33.5 34.8 M36 37 L37.2 36.4 M22.5 42.5 L24 41.4 M44 41 L45 42.2" ${style('none', '#fff', 1.1, ';opacity:0.85')}/>`,
};
