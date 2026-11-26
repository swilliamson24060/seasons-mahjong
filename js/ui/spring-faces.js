import { INK, DARK, LEAF, PIPS, STICKS, style, n } from './draw.js';

// The Start of Spring's set of faces: the same 43 as Halloween's, which
// match just as those do, drawn as March's. The eyes are robin's eggs, sky
// blue and speckled, the one a nest with three in it; the bones green
// shoots coming up through the soil, the one a fern's fiddlehead,
// uncurling; and the graves kites, each a diamond with its number on it and
// its tail bowed. The four monsters, which stand for the winds, are the
// four winds of March, each a face puffing out its cheeks to blow, as on an
// old map. The jack-o'-lantern, the witch's brew and the ghost, where a
// set's red, green and white dragons stand, are a robin, a shamrock and a
// lamb. The poison garden is March's flowers, a primrose, a hyacinth,
// forsythia and magnolia, and the moons are the equinox's day, equal to its
// night: dawn, noon, dusk and midnight, any two of which match, as any two
// flowers and any two moons do; and the lost soul is a snowman, melted, his
// hat, his carrot and his coals in a puddle, for out like a lamb. Drawn as
// faces.js draws Halloween's, on a tile 60 by 80, whole: faces.js shrinks a
// drawing to make room for its index.

const NUMBERS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const SUITS = { eyes: "Robin's eggs", bones: 'Shoots', graves: 'Kites' };

// Each face's name, by its key in tiles.js, and the kinds' that have more
// than one face.
const names = {
  vampire: 'East wind',
  werewolf: 'South wind',
  mummy: 'West wind',
  zombie: 'North wind',
  lantern: 'Robin',
  brew: 'Shamrock',
  ghost: 'Lamb',
  nightshade: 'Primrose',
  foxglove: 'Hyacinth',
  hemlock: 'Forsythia',
  wolfsbane: 'Magnolia',
  'new-moon': 'Dawn',
  'waxing-moon': 'Noon',
  'full-moon': 'Dusk',
  'waning-moon': 'Midnight',
  'lost-soul': 'Melted snowman',
};
for (const [suit, title] of Object.entries(SUITS)) NUMBERS.forEach((number, k) => (names[`${suit}-${k + 1}`] = `${number} of ${title}`));
const kinds = { flower: 'March flower', moon: 'Hour of the equinox' };

function draw(f) {
  if (f.group === 'eyes') return f.index === '1' ? nest() : PIPS[f.index].map((p) => egg(...p)).join('');
  if (f.group === 'bones') return f.index === '1' ? fiddlehead() : STICKS[f.index].map((s) => shoot(...s)).join('');
  if (f.group === 'graves') return kite(f.index);
  if (f.group === 'moon') return hour(f.key);
  return ART[f.key]();
}

export const SPRING_FACES = { draw, names, kinds };

const EGG = '#8fd0ec';
const DEEP_EGG = '#4aa6d2';
const SPECKLE = '#6e5640';
const NEST = '#b58a52';
const DEEP_NEST = '#7a5530';
const SOIL = '#8a5a35';
const DEEP_SOIL = '#5e3a1e';
const SHOOT = '#5cba4a';
const DEEP_SHOOT = '#2e8a3a';
const PALE_SHOOT = '#c9edb0';
const FERN = '#4f9f45';
const BREAST = '#e8622c';
const BACK = '#7c6656';
const HEAD = '#3f3733';
const BEAK = '#f2b51e';
const CLOVER = '#3faa4f';
const DEEP_CLOVER = '#21753a';
const PALE_CLOVER = '#bfe8b8';
const WOOL = '#fbf8f1';
const WOOL_SHADE = '#ddd5c6';
const LAMB_FACE = '#f3e3d3';
const PINK = '#f4a7b5';
const PRIMROSE = '#f7e27a';
const DEEP_PRIMROSE = '#e0b827';
const HYACINTH = '#7b6be0';
const PALE_HYACINTH = '#b6abf5';
const FORSYTHIA = '#f7c71e';
const TWIG = '#7d5a3c';
const MAGNOLIA = '#fbe1ea';
const DEEP_MAGNOLIA = '#d97aa0';
const BRANCH = '#6f6a66';
const PUDDLE = '#cbe6f8';
const CARROT = '#f0862a';
const SCARF = '#d94a3e';

// The kites' colours, a kite to a number, the rainbow round from red.
const KITES = ['#e2493b', '#f08a24', '#f2c22b', '#5cb84a', '#2fa9a0', '#3b82d6', '#5a5fd0', '#9a5bd0', '#e06aa6'];

// -------------------------------------------------------- robin's eggs

// A robin's egg's outline, its narrow end up, its middle at (cx, cy), r
// its size as a pip's.
function eggShape(cx, cy, r) {
  const top = cy - r * 1.12;
  const foot = cy + r * 0.92;
  const w = r * 0.86;
  return (
    `M${n(cx)} ${n(top)} C${n(cx + w * 0.7)} ${n(top)} ${n(cx + w)} ${n(cy - r * 0.15)} ${n(cx + w)} ${n(cy + r * 0.25)} ` +
    `C${n(cx + w)} ${n(cy + r * 0.72)} ${n(cx + w * 0.55)} ${n(foot)} ${n(cx)} ${n(foot)} ` +
    `C${n(cx - w * 0.55)} ${n(foot)} ${n(cx - w)} ${n(cy + r * 0.72)} ${n(cx - w)} ${n(cy + r * 0.25)} ` +
    `C${n(cx - w)} ${n(cy - r * 0.15)} ${n(cx - w * 0.7)} ${n(top)} ${n(cx)} ${n(top)} Z`
  );
}

// A robin's egg where a pip stands, sky blue, speckled brown, the light on
// it; the middle one of the five and the nine a deeper blue, as a dots
// tile's middle dot is red.
function egg(cx, cy, r, middle = false) {
  const speckles = [[0.3, -0.35, 0.09], [-0.35, 0.1, 0.08], [0.25, 0.45, 0.1], [-0.1, -0.7, 0.07], [0.5, 0.05, 0.06]];
  return (
    `<path d="${eggShape(cx, cy, r)}" ${style(middle ? DEEP_EGG : EGG, INK, n(Math.max(0.9, r / 7)))}/>` +
    speckles.map(([dx, dy, s]) => `<circle cx="${n(cx + dx * r)}" cy="${n(cy + dy * r)}" r="${n(Math.max(0.45, s * r))}" ${style(SPECKLE)}/>`).join('') +
    `<ellipse cx="${n(cx - r * 0.4)}" cy="${n(cy - r * 0.3)}" rx="${n(r * 0.14)}" ry="${n(r * 0.3)}" transform="rotate(20 ${n(cx - r * 0.4)} ${n(cy - r * 0.3)})" ${style('#fff', 'none', 0, ';opacity:0.8')}/>`
  );
}

// The one of robin's eggs: a nest woven of twigs, three eggs in it.
function nest() {
  const twigs = Array.from({ length: 6 }, (_, k) => {
    const y = 49 + k * 3.6;
    const w = 24 - Math.abs(k - 2.2) * 2.6;
    return `M${n(30 - w)} ${n(y)} Q30 ${n(y + 4)} ${n(30 + w)} ${n(y - 1)}`;
  }).join(' ');
  return (
    `<path d="M5 46 C5 62 16 71 30 71 C44 71 55 62 55 46 Z" ${style(NEST, INK, 1.4)}/>` +
    egg(19, 40, 8.6) +
    egg(41, 40, 8.6) +
    egg(30, 36, 9.4, true) +
    `<path d="M3.6 45 C10 50 20 51.6 30 51.6 C40 51.6 50 50 56.4 45 C55 43 53 42.6 51 43.4 C44 46.4 37 47.4 30 47.4 C23 47.4 16 46.4 9 43.4 C7 42.6 5 43 3.6 45 Z" ${style(DEEP_NEST, INK, 1.2)}/>` +
    `<path d="${twigs}" ${style('none', DEEP_NEST, 1.1)}/>` +
    `<path d="M8 50 L3 47 M52 50 L57.4 46.4 M12 62 L7 64" ${style('none', DEEP_NEST, 1.2)}/>`
  );
}

// --------------------------------------------------------------- shoots

// A green shoot where a stick stands, [x, y, length, width]: coming up out
// of a mound of soil at its foot, its stem bending a little, its two seed
// leaves opening at its top.
function shoot(cx, cy, len, w) {
  const top = cy - len / 2;
  const foot = cy + len / 2;
  const leaf = Math.max(2.6, w * 0.95);
  const stem = `M${n(cx)} ${n(foot - 1.5)} C${n(cx - w * 0.25)} ${n(foot - len * 0.35)} ${n(cx + w * 0.3)} ${n(top + len * 0.4)} ${n(cx)} ${n(top + len * 0.24)}`;
  const tip = top + len * 0.24;
  return (
    `<path d="${stem}" ${style('none', INK, n(Math.max(1.6, w * 0.42)))}/>` +
    `<path d="${stem}" ${style('none', SHOOT, n(Math.max(0.9, w * 0.24)))}/>` +
    `<path d="M${n(cx)} ${n(tip)} C${n(cx - leaf * 0.4)} ${n(tip - leaf * 0.2)} ${n(cx - leaf * 1.5)} ${n(tip - leaf * 0.5)} ${n(cx - leaf * 1.7)} ${n(tip - leaf * 1.1)} C${n(cx - leaf * 0.9)} ${n(tip - leaf * 1.4)} ${n(cx - leaf * 0.15)} ${n(tip - leaf * 0.8)} ${n(cx)} ${n(tip)} Z` +
      ` M${n(cx)} ${n(tip)} C${n(cx + leaf * 0.4)} ${n(tip - leaf * 0.2)} ${n(cx + leaf * 1.5)} ${n(tip - leaf * 0.5)} ${n(cx + leaf * 1.7)} ${n(tip - leaf * 1.1)} C${n(cx + leaf * 0.9)} ${n(tip - leaf * 1.4)} ${n(cx + leaf * 0.15)} ${n(tip - leaf * 0.8)} ${n(cx)} ${n(tip)} Z" ${style(SHOOT, INK, n(Math.max(0.6, w / 8)))}/>` +
    `<path d="M${n(cx - leaf * 1.3)} ${n(tip - leaf * 0.85)} Q${n(cx - leaf * 0.6)} ${n(tip - leaf * 0.55)} ${n(cx - leaf * 0.15)} ${n(tip - leaf * 0.15)} M${n(cx + leaf * 1.3)} ${n(tip - leaf * 0.85)} Q${n(cx + leaf * 0.6)} ${n(tip - leaf * 0.55)} ${n(cx + leaf * 0.15)} ${n(tip - leaf * 0.15)}" ${style('none', DEEP_SHOOT, n(Math.max(0.4, w / 14)))}/>` +
    `<path d="M${n(cx - w * 1.15)} ${n(foot + 0.4)} C${n(cx - w * 0.9)} ${n(foot - w * 0.75)} ${n(cx + w * 0.9)} ${n(foot - w * 0.75)} ${n(cx + w * 1.15)} ${n(foot + 0.4)} Z" ${style(SOIL, INK, n(Math.max(0.6, w / 8)))}/>`
  );
}

// The one of shoots: a fern's fiddlehead uncurling, its frond coiled at
// the top of its stem, little leaflets opening along it, out of the soil.
function fiddlehead() {
  const coil = [];
  for (let k = 0; k <= 60; k++) {
    const t = (k / 60) * 2.3 * Math.PI;
    const r = 1.2 + k * 0.19;
    coil.push(`${n(34 + r * Math.cos(t + 2.4))} ${n(26 + r * Math.sin(t + 2.4))}`);
  }
  const stem = 'M27 69 C25 58 25 47 26.4 40 C27.6 34 30 31 32 29.6';
  const leaflets = [[26, 60, -1], [26.2, 53, 1], [25.6, 46.6, -1], [26.4, 40.6, 1]]
    .map(([x, y, side]) => `<path d="M${x} ${y} C${n(x + side * 4)} ${n(y - 1.5)} ${n(x + side * 8)} ${n(y - 1)} ${n(x + side * 10)} ${n(y + 1.5)} C${n(x + side * 6)} ${n(y + 2.6)} ${n(x + side * 2.6)} ${n(y + 2)} ${x} ${y} Z" ${style(SHOOT, INK, 0.8)}/>`)
    .join('');
  return (
    `<path d="${stem}" ${style('none', INK, 4.4)}/>` +
    `<path d="${stem}" ${style('none', FERN, 2.8)}/>` +
    leaflets +
    `<path d="M${coil.join(' L')}" ${style('none', INK, 4.6)}/>` +
    `<path d="M${coil.join(' L')}" ${style('none', FERN, 3)}/>` +
    `<circle cx="34" cy="26" r="2.6" ${style(PALE_SHOOT, INK, 0.9)}/>` +
    `<path d="M9 73 C13 65 21 62.6 30 62.6 C39 62.6 47 65 51 73 Z" ${style(SOIL, INK, 1.3)}/>` +
    [[18, 69], [26, 66.6], [36, 67.6], [43, 70.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.9" ${style(DEEP_SOIL)}/>`).join('')
  );
}

// ---------------------------------------------------------------- kites

// A kite, a diamond in its number's colour, its spars crossing, its number
// on it, dark on white by day and by night, flying a little tilted, its
// tail bowed in the wind under it, bows tied along it.
function kite(number) {
  const colour = KITES[Number(number) - 1];
  const tail = 'M31 56 C26 61 35 65 30 70 C26 74 31 76 29 79';
  const bows = [[30.4, 62.6], [29.6, 72]]
    .map(([x, y]) => `<path d="M${n(x - 4.2)} ${n(y - 2.2)} L${x} ${y} L${n(x - 4.2)} ${n(y + 2.2)} Z M${n(x + 4.2)} ${n(y - 2.2)} L${x} ${y} L${n(x + 4.2)} ${n(y + 2.2)} Z" ${style(colour, INK, 0.9)}/>`)
    .join('');
  return (
    `<path d="${tail}" ${style('none', INK, 1.2)}/>` +
    bows +
    `<g transform="rotate(-8 30 30)">` +
    `<path d="M30 2.6 L52 25 L30 56 L8 25 Z" ${style(colour, INK, 1.5)}/>` +
    `<path d="M30 2.6 L52 25 L30 25 Z M30 25 L30 56 L8 25 Z" ${style('#fff', 'none', 0, ';opacity:0.32')}/>` +
    `<path d="M30 2.6 V56 M8 25 H52" ${style('none', INK, 1)}/>` +
    `<circle cx="30" cy="28.6" r="9.4" ${style('#fffdf6', INK, 1.1)}/>` +
    `<text x="30" y="34.6" text-anchor="middle" style="fill:${DARK};font:700 17px Georgia,'Times New Roman',serif">${number}</text>` +
    `</g>`
  );
}

// ------------------------------------------------------ hours of the day

// Each hour's look: its sky, its far hills and its near, and what's in its
// sky, inside a round window on the day.
const HOURS = {
  // Dawn: the sun coming up over the hills, the sky rose and gold.
  'new-moon': {
    sky: ['#ffd9b8', '#ffb4a2'],
    hills: ['#86b56c', '#5c9a4c'],
    sky2: `<circle cx="30" cy="52" r="10.6" ${style('#ffcf3a', '#e8902a', 1.2)}/>` + rays(30, 52, 13, 17.4, 7, 180, '#ffb72b'),
  },
  // Noon: the sun high in a blue sky, over green hills.
  'waxing-moon': {
    sky: ['#a8dcff', '#7cc4f5'],
    hills: ['#7cc45e', '#4f9f3f'],
    sky2: `<circle cx="30" cy="30" r="8.6" ${style('#ffd83a', '#e8a02a', 1.2)}/>` + rays(30, 30, 11, 14, 12, 0, '#ffc52b'),
  },
  // Dusk: the sun going down behind the hills, the sky orange and violet.
  'full-moon': {
    sky: ['#ffb26a', '#b884d6'],
    hills: ['#6f6a9a', '#4a4570'],
    sky2: `<circle cx="30" cy="54" r="11" ${style('#ff8a3a', '#d65a2a', 1.2)}/>` + `<circle cx="44" cy="26" r="1" ${style('#fff6c8')}/>`,
  },
  // Midnight: a crescent moon and the stars, over dark hills.
  'waning-moon': {
    sky: ['#2c3a78', '#1b2452'],
    hills: ['#3a4a6e', '#26324e'],
    sky2:
      `<path d="M35 22 A10 10 0 1 0 35 42 A7.6 7.6 0 1 1 35 22 Z" ${style('#fff1b8', '#e8c95a', 1)}/>` +
      [[17, 26, 1.3], [21, 38, 0.9], [44, 30, 1.1], [40, 46, 0.8], [15, 46, 0.8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" ${style('#fff6d0')}/>`).join(''),
  },
};

// A sun's rays round (cx, cy), from r1 out to r2, `count` of them spread
// over all the way round, or over the top half from `from` degrees.
function rays(cx, cy, r1, r2, count, from, colour) {
  const all = from === 0;
  return Array.from({ length: count }, (_, k) => {
    const a = all ? (k * 2 * Math.PI) / count : Math.PI + ((k + 0.5) * Math.PI) / count;
    return `<path d="M${n(cx + r1 * Math.cos(a))} ${n(cy + r1 * Math.sin(a))} L${n(cx + r2 * Math.cos(a))} ${n(cy + r2 * Math.sin(a))}" ${style('none', colour, 1.6)}/>`;
  }).join('');
}

// An hour of the equinox's day, in a round window: its sky, what's in it,
// and its hills, each drawn to the window's edge.
function hour(key) {
  const { sky, hills, sky2 } = HOURS[key];
  const [cx, cy, r] = [30, 40, 25];
  const across = (y) => n(Math.sqrt(r * r - (y - cy) * (y - cy))); // half the window's width at y
  // A band of the window from the line at y down to its foot, its top edge
  // the path given, from its left end to its right.
  const band = (y0, y1, top) => `M${n(cx - across(y0))} ${y0} ${top} L${n(cx + across(y1))} ${y1} A${r} ${r} 0 ${y0 + y1 < 2 * cy ? 1 : 0} 1 ${n(cx - across(y0))} ${y0} Z`;
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" ${style(sky[0])}/>` +
    `<path d="${band(38, 38, '')}" ${style(sky[1], 'none', 0, ';opacity:0.7')}/>` +
    sky2 +
    `<path d="${band(54, 52, 'C14 47 24 50 32 53 C40 56 46 50 51.93 52')}" ${style(hills[0])}/>` +
    `<path d="${band(60, 59, 'C18 55 28 58 36 61 C42 62.6 46 59.6 52 59')}" ${style(hills[1])}/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" ${style('none', INK, 1.6)}/>`
  );
}

// ------------------------------------------------------ everything else

// A face puffing out its cheeks to blow, as the winds do on an old map: its
// hair and beard curling, its cheeks round, its lips pursed, and its breath
// streaming out to the left. skin and hair its colours, and beard whether
// it has one.
function wind(skin, hair, cheek, { beard = false, frost = false } = {}) {
  const breath = `M17 47 C11 45 7 47 4 44 M18 51 C12 52 8 55 3 53 M17.4 55 C13 58 10 62 6 61`;
  return (
    `<g transform="translate(-3.5 -6) scale(1.12)">` +
    `<path d="M33 18 C44 16 54 24 54 36 C55 44 52 50 47 54 C49 48 47 42 44 39 C46 33 43 25 33 22 Z" ${style(hair, INK, 1.1)}/>` +
    (beard ? `<path d="M23 58 C24 66 30 72 38 72 C46 72 51 66 49 58 C45 62 41 63 36 63 C30 63 26 61 23 58 Z" ${style(hair, INK, 1.1)}/>` : '') +
    `<circle cx="35" cy="45" r="16" ${style(skin, INK, 1.4)}/>` +
    `<circle cx="27" cy="50" r="6.4" ${style(cheek, INK, 1)}/>` +
    `<circle cx="42" cy="51" r="5" ${style(cheek, 'none', 0, ';opacity:0.75')}/>` +
    `<path d="M29 37.4 Q32 35.2 35 37.6 M39.6 37.6 Q42.6 35.6 45.4 38" ${style('none', INK, 1.2)}/>` +
    `<path d="M30.6 41 Q32.4 42.4 34.2 41 M40.4 41.4 Q42.2 42.8 44 41.4" ${style('none', DARK, 1.2)}/>` +
    `<ellipse cx="20.6" cy="51" rx="2.6" ry="2.2" ${style('#c0505a', INK, 1)}/>` +
    `<path d="M33 20 C30 14 22 13 18 17 C22 17 25 19 26 23 C23 22 20 24 19 27 C23 26 27 27 29 30" ${style(hair, INK, 1.1)}/>` +
    (frost ? [[46, 30], [50, 40], [40, 24]].map(([x, y]) => `<path d="M${x - 2} ${y} H${x + 2} M${x} ${y - 2} V${y + 2} M${x - 1.4} ${y - 1.4} L${x + 1.4} ${y + 1.4} M${x - 1.4} ${y + 1.4} L${x + 1.4} ${y - 1.4}" ${style('none', '#e6f4ff', 0.8)}/>`).join('') : '') +
    `<path d="${breath}" ${style('none', INK, 1.6)}/>` +
    `<path d="${breath}" ${style('none', '#cfe6ff', 0.9)}/>` +
    `</g>`
  );
}

// A shamrock's heart-shaped leaf, its point at (x, y), turned `turn`
// degrees from straight up, s its size.
const cloverLeaf = (x, y, turn, s = 1) =>
  `<path d="M0 0 C-4 -3 -11 -6 -11 -13 C-11 -18 -6 -20 -3 -17 C-2 -16 -0.6 -15 0 -13 C0.6 -15 2 -16 3 -17 C6 -20 11 -18 11 -13 C11 -6 4 -3 0 0 Z" transform="translate(${x} ${y}) rotate(${turn}) scale(${s})" ${style(CLOVER, INK, 1.2)}/>` +
  `<path d="M0 -2 L0 -12" transform="translate(${x} ${y}) rotate(${turn}) scale(${s})" ${style('none', DEEP_CLOVER, 0.9)}/>`;

// A star-shaped hyacinth floret at (x, y).
const floret = (x, y, pale = false) =>
  `<path d="M${x} ${n(y - 3)} L${n(x + 0.9)} ${n(y - 0.9)} L${n(x + 3)} ${y} L${n(x + 0.9)} ${n(y + 0.9)} L${x} ${n(y + 3)} L${n(x - 0.9)} ${n(y + 0.9)} L${n(x - 3)} ${y} L${n(x - 0.9)} ${n(y - 0.9)} Z" ${style(pale ? PALE_HYACINTH : HYACINTH, INK, 0.6)}/>`;

// A forsythia flower, four yellow petals, at (x, y).
const forsythia = (x, y, turn = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${turn})">` +
  [0, 90, 180, 270].map((a) => `<ellipse cx="0" cy="-2.6" rx="1.4" ry="2.8" transform="rotate(${a})" ${style(FORSYTHIA, INK, 0.6)}/>`).join('') +
  `<circle cx="0" cy="0" r="0.9" ${style('#d38a12')}/></g>`;

const ART = {
  // The east wind, golden-haired as the dawn he blows from.
  vampire: () => wind('#ffe2c4', '#f2c04a', '#ffb3a6'),
  // The south wind, warm and ruddy, his hair a fiery red.
  werewolf: () => wind('#ffd2b0', '#d9562e', '#ff9a86'),
  // The west wind, grey-blue, his hair long and silver.
  mummy: () => wind('#e8eef5', '#9fb2c9', '#f7b8c0', { beard: true }),
  // The north wind, old and icy, his beard and hair white with frost.
  zombie: () => wind('#e6f2fb', '#f4f9ff', '#bcd9f2', { beard: true, frost: true }),
  // A robin, perched, facing left, her red breast out and her beak open.
  lantern: () =>
    `<path d="M24 68 L26 61 M32 68 L32.4 61" ${style('none', INK, 1.4)}/>` +
    `<path d="M14 69 H46" ${style('none', '#8a6a4a', 2.6)}/>` +
    `<path d="M41 44 C48 46 54 52 56.4 60 C51 59 46 55 43 51 Z" ${style(HEAD, INK, 1.1)}/>` +
    `<path d="M14.6 42 C14.6 31 22 25 31 25 C40 25 46 32 46 43 C46 54 39 62 29.4 62 C20 62 14.6 54 14.6 42 Z" ${style(BACK, INK, 1.4)}/>` +
    `<path d="M14.6 42 C14.6 36 17.6 33.6 21 33.6 C25 34 29 39 29.6 46 C30 53 27 60 23 61 C17.6 59 14.6 51 14.6 42 Z" ${style(BREAST, INK, 1.1)}/>` +
    `<path d="M32 36 C38 36 43 41 44 48 C40 46 35 46 31.6 43 Z" ${style('#5e4c40', INK, 0.9)}/>` +
    `<circle cx="23" cy="22.6" r="9" ${style(HEAD, INK, 1.3)}/>` +
    `<path d="M14.6 20.6 L6.6 17.6 L14.4 23.4 Z M14.6 23.6 L7.4 26 L15 25.4 Z" ${style(BEAK, INK, 0.9)}/>` +
    `<circle cx="19.6" cy="20.6" r="2.2" ${style('#fff')}/><circle cx="19.4" cy="20.6" r="1.3" ${style(DARK)}/>` +
    `<path d="M5 13 C7 11 9 11 10 12.6 M3.6 8.6 C6.4 6 9.6 6 11 8" ${style('none', '#4a8fd6', 1.1)}/>`,
  // A shamrock, its three heart-shaped leaves and its stem.
  brew: () =>
    `<path d="M30 42 C31 52 34 62 40 72" ${style('none', INK, 4)}/>` +
    `<path d="M30 42 C31 52 34 62 40 72" ${style('none', DEEP_CLOVER, 2.4)}/>` +
    cloverLeaf(30, 42, 0, 1.05) +
    cloverLeaf(30, 42, -118, 1.05) +
    cloverLeaf(30, 42, 118, 1.05) +
    `<path d="M25 24 C25 21 27 19.6 29 20" ${style('none', PALE_CLOVER, 1.2)}/>`,
  // A lamb, white and woolly, standing, facing left.
  ghost: () => {
    const curls = [[24, 38], [31, 35], [38, 36], [44, 40], [22, 46], [29, 44], [36, 44], [43, 47], [26, 53], [34, 53], [41, 54]];
    return (
      `<path d="M25 60 V71 M30.6 61 V72 M39 61 V71.6 M44.4 59 V70.6" ${style('none', INK, 3.6)}/>` +
      `<path d="M25 60 V71 M30.6 61 V72 M39 61 V71.6 M44.4 59 V70.6" ${style('none', '#4d4440', 2.2)}/>` +
      `<path d="M18 46 C16 38 22 31 30 31 C36 29 44 31 48 37 C53 41 53 51 49 56 C46 61 39 62 33 61 C26 62 19 59 18 52 Z" ${style(WOOL, INK, 1.4)}/>` +
      curls.map(([x, y]) => `<path d="M${x - 2.2} ${y} A2.4 2.4 0 1 1 ${x + 2.2} ${y}" ${style('none', WOOL_SHADE, 1)}/>`).join('') +
      `<path d="M49.4 44 C53 43 55 45.4 54.6 48.6 C53.6 47 51.6 46.6 50 47" ${style(WOOL, INK, 1)}/>` +
      `<ellipse cx="14.6" cy="36" rx="7.6" ry="9" transform="rotate(-14 14.6 36)" ${style(LAMB_FACE, INK, 1.3)}/>` +
      `<path d="M15 26.6 C17 23.6 21 23 24 25 C22.4 27.6 19 28.6 15.6 28.6 Z" ${style(WOOL, INK, 1)}/>` +
      `<path d="M8.6 30.6 C4.6 29.6 2.6 31.6 2.6 33.6 C5 34.4 8 33.6 9.6 32.6 Z M20.4 29.6 C24 27.4 26.6 28.6 27 30.4 C25 32 22 32 20 31.4 Z" ${style(PINK, INK, 0.9)}/>` +
      `<circle cx="11.6" cy="35" r="1.4" ${style(DARK)}/>` +
      `<path d="M9 42.6 Q11 44.4 13.4 43" ${style('none', DARK, 1)}/>` +
      `<ellipse cx="9.6" cy="40.4" rx="1.6" ry="1" ${style('#c98a8a')}/>`
    );
  },
  // A primrose, pale yellow, its five notched petals round a deeper eye,
  // over its rosette of crinkled leaves.
  nightshade: () =>
    `<path d="M30 72 C22 72 12 68 9 60 C16 58 24 61 30 66 Z M30 72 C38 72 48 68 51 60 C44 58 36 61 30 66 Z M30 71 C27 64 26 57 28 51 C31 56 32 63 30 71 Z" ${style(LEAF, INK, 1)}/>` +
    `<path d="M13 61 C18 62 24 64 29 69 M47 61 C42 62 36 64 31 69" ${style('none', '#2b6e40', 0.7)}/>` +
    Array.from({ length: 5 }, (_, k) => `<path d="M30 36 C25 33 22 25 25 20 C27 19 29 21 30 22.6 C31 21 33 19 35 20 C38 25 35 33 30 36 Z" transform="rotate(${k * 72} 30 36)" ${style(PRIMROSE, INK, 1.1)}/>`).join('') +
    `<circle cx="30" cy="36" r="5.4" ${style(DEEP_PRIMROSE, INK, 0.9)}/>` +
    `<circle cx="30" cy="36" r="2" ${style('#8bb33a')}/>`,
  // A hyacinth: a spike of star-shaped florets, blue-violet, packed round
  // its thick stem, over its strap-shaped leaves.
  foxglove: () => {
    const florets = [];
    for (let row = 0; row < 8; row++) {
      const y = 16 + row * 4.6;
      const half = 6 + Math.sin((row / 7) * Math.PI) * 4;
      for (let k = 0; k < 3; k++) florets.push(floret(n(30 - half + k * half + (row % 2 ? 1.6 : -1.6)), n(y), (row + k) % 3 === 0));
    }
    return (
      `<path d="M18 74 C16 64 17 56 21 48 C22 58 22 66 23 74 Z M42 74 C44 64 43 56 39 48 C38 58 38 66 37 74 Z" ${style(LEAF, INK, 1)}/>` +
      `<path d="M30 74 V50" ${style('none', '#3f8a4a', 4)}/>` +
      florets.join('')
    );
  },
  // Forsythia: arching brown twigs, starred with yellow flowers.
  hemlock: () =>
    `<path d="M30 74 C28 56 20 40 10 30 M30 74 C31 54 34 38 42 22 M30 74 C35 60 44 52 52 48" ${style('none', TWIG, 1.6)}/>` +
    [[13, 33, 10], [17.4, 38.6, -20], [22, 45, 30], [25.6, 52.6, 0], [40.6, 26, 15], [38, 33, -10], [35.6, 41, 20], [33.4, 49, -5], [48.6, 49.6, 25], [43, 53, 0], [38.6, 57.4, -15], [9.4, 28, 0], [44, 19.6, 10]]
      .map(([x, y, t]) => forsythia(x, y, t))
      .join(''),
  // A magnolia: a great tulip-shaped bloom, pale pink deepening at its foot,
  // on a bare grey branch, a furred bud beside it.
  wolfsbane: () =>
    `<path d="M8 72 C18 66 26 62 30 54 M30 54 C36 58 44 60 52 58" ${style('none', BRANCH, 2.6)}/>` +
    `<path d="M45 59 C47 55 50 53 52.6 54 C53 57 50 60 46.6 60 Z" ${style('#9a8e86', INK, 0.9)}/>` +
    `<path d="M30 54 C22 52 16 44 17 34 C21 37 25 41 27 47 Z M30 54 C38 52 44 44 43 34 C39 37 35 41 33 47 Z" ${style(MAGNOLIA, INK, 1.1)}/>` +
    `<path d="M30 54 C24 48 22 36 26 22 C28 20 32 20 34 22 C38 36 36 48 30 54 Z" ${style(MAGNOLIA, INK, 1.2)}/>` +
    `<path d="M30 54 C27 50 26 44 27.6 38 M30 54 C33 50 34 44 32.4 38 M24 50 C21 47 19.6 43 19.4 39 M36 50 C39 47 40.4 43 40.6 39" ${style('none', DEEP_MAGNOLIA, 1.4)}/>` +
    `<path d="M27 25 C28 23.6 30 23.4 31.4 24" ${style('none', '#fff', 1, ';opacity:0.8')}/>`,
  // A snowman, melted: a puddle on the ground, his top hat and his scarf in
  // it, his carrot nose and his coal eyes lying where his head was.
  'lost-soul': () =>
    `<ellipse cx="30" cy="58" rx="26" ry="11" ${style(PUDDLE, INK, 1.3)}/>` +
    `<path d="M10 58 C16 54 22 57 28 55 C35 53 40 57 48 55" ${style('none', '#9fcbea', 1)}/>` +
    `<path d="M11 52 C10 46 15 43 20 45 C24 43 29 45 29 50 C29 54 24 56 19 55 C14 56 11 55 11 52 Z" ${style(WOOL, INK, 1.1)}/>` +
    `<path d="M33 49 L44 38 L48 42 L37 53 Z" ${style(DARK, INK, 1.2)}/>` +
    `<path d="M30.6 51.4 L39.4 56.6 L42 54 L33.2 48.8 Z" ${style(DARK, INK, 1.2)}/>` +
    `<path d="M37 41 L41.4 45.4" ${style('none', SCARF, 2)}/>` +
    `<path d="M14 62 C20 60 26 64 30 61 C33 63 30 68 26 67" ${style('none', SCARF, 2.6)}/>` +
    `<path d="M41 61 L54 58.6 L41.6 64.4 Z" ${style(CARROT, INK, 1)}/>` +
    `<circle cx="22" cy="63.6" r="1.8" ${style(DARK)}/><circle cx="33" cy="66.4" r="1.6" ${style(DARK)}/>` +
    `<path d="M18 49 C19 47 22 47 23 48.6" ${style('none', '#fff', 1, ';opacity:0.9')}/>`,
};
