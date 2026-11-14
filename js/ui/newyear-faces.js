import { INK, PAPER, DARK, LEAF, PIPS, STICKS, style, n } from './draw.js';

// New Year's set of faces: the same 43 as Halloween's, which match just as
// those do, drawn as New Year's. The eyes are clocks, every one at five to
// midnight; the bones party horns; and the graves calendar pages, the first
// nine days of January. The four monsters, which stand for the winds, are
// four who see the new year in: Father Time, with his hourglass, Baby New
// Year, in his top hat and sash, a night owl in a party hat, up for
// midnight, and a polar bear in a swim ring, for the New Year's Day plunge.
// The jack-o'-lantern, the witch's brew and the ghost, where a set's red,
// green and white dragons stand, are a party hat, a bottle of champagne,
// its cork popping, and New Year's ball. The poison garden is lucky charms,
// a four-leaf clover, a horseshoe, a ladybird and a lucky pig; the moons
// are the seasons of the year to come, winter, spring, summer and fall, any
// two of which match, as any two flowers and any two moons do; and the
// lost soul is a sleepyhead, who missed midnight. Drawn as faces.js draws
// Halloween's, on a tile 60 by 80, whole: faces.js shrinks a drawing to
// make room for its index.

const NUMBERS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const SUITS = { eyes: 'Clocks', bones: 'Party horns', graves: 'Calendars' };

// Each face's name, by its key in tiles.js, and the kinds' that have more
// than one face.
const names = {
  vampire: 'Father Time',
  werewolf: 'Baby New Year',
  mummy: 'Night owl',
  zombie: 'Polar bear',
  lantern: 'Party hat',
  brew: 'Champagne',
  ghost: "New Year's ball",
  nightshade: 'Four-leaf clover',
  foxglove: 'Horseshoe',
  hemlock: 'Ladybird',
  wolfsbane: 'Lucky pig',
  'new-moon': 'Winter',
  'waxing-moon': 'Spring',
  'full-moon': 'Summer',
  'waning-moon': 'Fall',
  'lost-soul': 'Sleepyhead',
};
for (const [suit, title] of Object.entries(SUITS)) NUMBERS.forEach((number, k) => (names[`${suit}-${k + 1}`] = `${number} of ${title}`));
const kinds = { flower: 'Lucky charm', moon: 'Season' };

function draw(f) {
  if (f.group === 'eyes') return f.index === '1' ? alarmClock() : PIPS[f.index].map((p) => clock(...p)).join('');
  if (f.group === 'bones') return f.index === '1' ? blower() : STICKS[f.index].map((s) => horn(...s)).join('');
  if (f.group === 'graves') return calendar(f.index);
  if (f.group === 'moon') return season(f.key);
  return ART[f.key]();
}

export const NEW_YEAR_FACES = { draw, names, kinds };

const RED = '#d3263a';
const DEEP_RED = '#93121f';
const GOLD = '#f2c14e';
const DEEP_GOLD = '#b07d12';
const NAVY = '#2b3f86';
const PURPLE = '#7b3fb0';
const PINK = '#f7a8c4';
const DEEP_PINK = '#d9668f';
const SILVER = '#c9ced8';
const WHITE = '#f6f8fc';

// A point at an angle in degrees, clockwise from twelve o'clock, so far
// from (cx, cy).
const at = (cx, cy, deg, len) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return `${n(cx + len * Math.cos(a))} ${n(cy + len * Math.sin(a))}`;
};

// A star of five points round (cx, cy), r across its points.
const star = (cx, cy, r, fill, edge = 'none', w = 0) =>
  `<polygon points="${Array.from({ length: 10 }, (_, k) => at(cx, cy, k * 36, k % 2 ? r * 0.45 : r).replace(' ', ',')).join(' ')}" ${style(fill, edge, w)}/>`;

// A glint: a four-pointed sparkle at (x, y), s its size.
const glint = (x, y, s, fill = '#fff') =>
  `<path d="M${x} ${n(y - s)} L${n(x + s * 0.28)} ${n(y - s * 0.28)} L${n(x + s)} ${y} L${n(x + s * 0.28)} ${n(y + s * 0.28)} L${x} ${n(y + s)} L${n(x - s * 0.28)} ${n(y + s * 0.28)} L${n(x - s)} ${y} L${n(x - s * 0.28)} ${n(y - s * 0.28)} Z" ${style(fill, 'none', 0)}/>`;

// An eye: dark, with a glint.
const eye = (x, y, r = 1.4) => `<circle cx="${x}" cy="${y}" r="${r}" ${style(DARK)}/><circle cx="${n(x - r * 0.35)}" cy="${n(y - r * 0.35)}" r="${n(r * 0.35)}" ${style('#fff')}/>`;

// ----------------------------------------------------------------- clocks

// A clock where a pip stands, at five to midnight: its face, its four hours
// marked, and its hands; the middle one of the five and the nine has a rim
// of gold, as the middle dot of a dots tile is red.
function clock(cx, cy, r, gold = false) {
  const marks = [0, 90, 180, 270].map((d) => `M${at(cx, cy, d, r * 0.6)} L${at(cx, cy, d, r * 0.78)}`).join(' ');
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" ${style(gold ? GOLD : NAVY, INK, n(Math.max(0.8, r / 7)))}/>` +
    `<circle cx="${cx}" cy="${cy}" r="${n(r * 0.8)}" ${style(PAPER, 'none', 0)}/>` +
    `<path d="${marks}" ${style('none', DARK, n(Math.max(0.6, r / 9)))}/>` +
    `<path d="M${cx} ${cy} L${at(cx, cy, -30, r * 0.66)} M${cx} ${cy} L${at(cx, cy, -2.5, r * 0.46)}" ${style('none', DARK, n(Math.max(0.8, r / 6.5)))}/>` +
    `<circle cx="${cx}" cy="${cy}" r="${n(Math.max(0.6, r * 0.11))}" ${style(RED)}/>`
  );
}

// The one of clocks: an alarm clock on its feet, its two bells on top and
// the striker between them, at five to midnight.
function alarmClock() {
  const cx = 30;
  const cy = 46;
  const r = 17;
  const hours = Array.from({ length: 12 }, (_, k) => `M${at(cx, cy, k * 30, r * (k % 3 ? 0.68 : 0.6))} L${at(cx, cy, k * 30, r * 0.78)}`).join(' ');
  return (
    `<path d="M18 61 L13.5 70 M42 61 L46.5 70" ${style('none', INK, 3.2)}/>` +
    `<path d="M18.5 31 C14 26 17 19.5 22.5 21.5 Z M41.5 31 C46 26 43 19.5 37.5 21.5 Z" ${style(GOLD, INK, 1.3)}/>` +
    `<path d="M30 29 V24 M27 23.5 H33" ${style('none', INK, 1.6)}/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" ${style(RED, INK, 1.6)}/>` +
    `<circle cx="${cx}" cy="${cy}" r="${n(r * 0.84)}" ${style(PAPER, 'none', 0)}/>` +
    `<path d="${hours}" ${style('none', DARK, 1.1)}/>` +
    `<path d="M${cx} ${cy} L${at(cx, cy, -30, 12)} M${cx} ${cy} L${at(cx, cy, -2.5, 8.5)}" ${style('none', DARK, 1.9)}/>` +
    `<circle cx="${cx}" cy="${cy}" r="1.6" ${style(RED)}/>` +
    `<ellipse cx="23.5" cy="37" rx="3.4" ry="1.8" transform="rotate(-38 23.5 37)" ${style('#fff', 'none', 0, ';opacity:0.75')}/>`
  );
}

// ------------------------------------------------------------ party horns

// A party horn standing where a stick stands, as long, [x, y, length,
// width]: its mouthpiece at the foot, flaring to its bell at the top, gold
// with purple bands.
function horn(cx, cy, len, w) {
  const top = cy - len / 2 + w * 0.3;
  const foot = cy + len / 2 - w * 0.55;
  const tw = w * 0.8; // half the bell's width,
  const fw = w * 0.26; // and the foot's
  const side = (k, t) => n(cx + k * (fw + (tw - fw) * t));
  const y = (t) => n(foot - (foot - top) * t);
  const band = (t0, t1) => `M${side(-1, t0)} ${y(t0)} L${side(-1, t1)} ${y(t1)} L${side(1, t1)} ${y(t1)} L${side(1, t0)} ${y(t0)} Z`;
  const out = n(Math.max(0.6, w / 7));
  return (
    `<rect x="${n(cx - fw * 0.9)}" y="${n(foot)}" width="${n(fw * 1.8)}" height="${n(w * 0.55)}" rx="${n(fw * 0.5)}" ${style(PAPER, INK, out)}/>` +
    `<path d="M${side(-1, 0)} ${y(0)} L${side(-1, 1)} ${y(1)} L${side(1, 1)} ${y(1)} L${side(1, 0)} ${y(0)} Z" ${style(GOLD, INK, out)}/>` +
    `<path d="${band(0.22, 0.4)} ${band(0.6, 0.78)}" ${style(PURPLE, 'none', 0)}/>` +
    `<ellipse cx="${cx}" cy="${n(top)}" rx="${n(tw)}" ry="${n(w * 0.2)}" ${style('#ffe9a6', INK, out)}/>`
  );
}

// The one of party horns: a great party horn, tilted up as it's blown, its
// fringe flying and confetti and streamers bursting from its bell.
function blower() {
  const foot = 70;
  const top = 25;
  const fw = 2.6; // half the foot's width,
  const tw = 11.5; // and the bell's
  const side = (k, t) => n(30 + k * (fw + (tw - fw) * t));
  const y = (t) => n(foot - (foot - top) * t);
  const band = (t0, t1) => `M${side(-1, t0)} ${y(t0)} L${side(-1, t1)} ${y(t1)} L${side(1, t1)} ${y(t1)} L${side(1, t0)} ${y(t0)} Z`;
  const fringe = Array.from({ length: 9 }, (_, k) => {
    const x = 30 - tw + (k * 2 * tw) / 8;
    return `M${n(x)} ${top} L${n(x + (k - 4) * 0.7)} ${top - 6}`;
  }).join(' ');
  const confetti = [[47, 12, RED], [53, 19, GOLD], [42, 8, '#3d9bd6'], [56, 9, PURPLE], [50, 26, '#3d9bd6'], [38, 13, GOLD], [11, 30, PURPLE], [16, 22, RED]];
  return (
    `<g transform="rotate(32 30 47)">` +
    `<rect x="${n(30 - fw)}" y="${foot - 0.5}" width="${n(2 * fw)}" height="5.5" rx="1.2" ${style(PAPER, INK, 1)}/>` +
    `<path d="M${side(-1, 0)} ${y(0)} L${side(-1, 1)} ${y(1)} L${side(1, 1)} ${y(1)} L${side(1, 0)} ${y(0)} Z" ${style(GOLD, INK, 1.4)}/>` +
    `<path d="${band(0.16, 0.3)} ${band(0.46, 0.6)} ${band(0.76, 0.88)}" ${style(PURPLE, 'none', 0)}/>` +
    `<path d="${fringe}" ${style('none', PINK, 1.7)}/>` +
    `<ellipse cx="30" cy="${top}" rx="${tw}" ry="3" ${style('#ffe9a6', INK, 1.2)}/>` +
    `</g>` +
    `<path d="M45 21 C47 15 51 16 50.5 10.5 M48.5 25 C54 24.5 52.5 18.5 57 16.5" ${style('none', '#3d9bd6', 1.3)}/>` +
    confetti.map(([x, cy, c], k) => `<rect x="${x}" y="${cy}" width="3.4" height="1.9" transform="rotate(${k * 41} ${x} ${cy})" ${style(c, 'none', 0)}/>`).join('')
  );
}

// --------------------------------------------------------- calendar pages

// A calendar page, torn off: January's band across its top, its two rings,
// and the day, the number, big in its middle, as a grave has its number;
// its corner turned up.
function calendar(number) {
  return (
    `<path d="M12 31 H48 V64 L41 71 H12 Z" ${style(PAPER, INK, 1.4)}/>` +
    `<path d="M48 64 L41 71 L42 65.5 Z" ${style('#d9d2c2', INK, 1)}/>` +
    `<rect x="12" y="31" width="36" height="11" ${style(RED, INK, 1.4)}/>` +
    `<text x="30" y="39.6" text-anchor="middle" style="fill:#fff;font:800 8px system-ui,-apple-system,sans-serif;letter-spacing:1.2px">JAN</text>` +
    `<path d="M21 34 V27.5 M39 34 V27.5" ${style('none', INK, 3.4)}/>` +
    `<path d="M21 34 V27.5 M39 34 V27.5" ${style('none', SILVER, 1.8)}/>` +
    `<text x="30" y="64" text-anchor="middle" style="fill:${DARK};font:700 21px Georgia,'Times New Roman',serif">${number}</text>`
  );
}

// ------------------------------------------------------------ the seasons

// The seasons of the year to come, each in a round of its own sky: a
// snowflake for winter, a blossom for spring, the sun for summer and a
// maple leaf for fall.
const SEASONS = {
  'new-moon': () =>
    `<circle cx="30" cy="44" r="19.5" ${style('#cfe6fb', INK, 1.3)}/>` +
    [0, 60, 120, 180, 240, 300]
      .map((turn) => `<g transform="rotate(${turn} 30 44)"><path d="M30 44 V29 M30 34.5 L26 30.5 M30 34.5 L34 30.5 M30 39.5 L27.2 36.7 M30 39.5 L32.8 36.7" ${style('none', '#3d79b8', 2.2)}/></g>`)
      .join('') +
    `<circle cx="30" cy="44" r="2.4" ${style('#3d79b8')}/>`,
  'waxing-moon': () =>
    `<circle cx="30" cy="44" r="19.5" ${style('#dff2d6', INK, 1.3)}/>` +
    Array.from({ length: 5 }, (_, k) => `<path d="M30 44 C25 39.5 25 32.5 30 30.5 C35 32.5 35 39.5 30 44 Z" transform="rotate(${k * 72} 30 44)" ${style(PINK, DEEP_PINK, 0.9)}/>`).join('') +
    Array.from({ length: 5 }, (_, k) => `<path d="M30 44 L${at(30, 44, k * 72 + 36, 6.5)}" ${style('none', DEEP_PINK, 0.7)}/><circle cx="${at(30, 44, k * 72 + 36, 6.5).split(' ')[0]}" cy="${at(30, 44, k * 72 + 36, 6.5).split(' ')[1]}" r="0.9" ${style(GOLD)}/>`).join('') +
    `<circle cx="30" cy="44" r="3" ${style(GOLD, DEEP_GOLD, 0.7)}/>`,
  'full-moon': () =>
    `<circle cx="30" cy="44" r="19.5" ${style('#bfe3ff', INK, 1.3)}/>` +
    Array.from({ length: 12 }, (_, k) => `<path d="M${at(30, 44, k * 30 - 7, 10.5)} L${at(30, 44, k * 30, 16.5)} L${at(30, 44, k * 30 + 7, 10.5)} Z" ${style('#ffb42e', '#d97a0e', 0.6)}/>`).join('') +
    `<circle cx="30" cy="44" r="10" ${style('#ffd84a', '#d97a0e', 1)}/>` +
    `<path d="M25.5 46.5 Q30 50.5 34.5 46.5" ${style('none', '#a3520c', 1.1)}/>` +
    `<circle cx="26.6" cy="42" r="1.1" ${style('#a3520c')}/><circle cx="33.4" cy="42" r="1.1" ${style('#a3520c')}/>`,
  'waning-moon': () =>
    `<circle cx="30" cy="44" r="19.5" ${style('#fbe3c6', INK, 1.3)}/>` +
    `<path d="M30 60 V52" ${style('none', '#8a3d12', 1.6)}/>` +
    `<path d="M30 53 L22.5 55 L24 51.5 L16.5 46.5 L20.5 45.5 L18.5 40 L23.5 41.5 L25 38 L28 41.5 L27.5 33 L30 35 L32.5 33 L32 41.5 L35 38 L36.5 41.5 L41.5 40 L39.5 45.5 L43.5 46.5 L36 51.5 L37.5 55 Z" ${style('#e0601e', '#8a3d12', 1)}/>` +
    `<path d="M30 52 V37 M30 47 L23 44 M30 47 L37 44 M30 50 L24.5 52.5 M30 50 L35.5 52.5" ${style('none', '#a8461a', 0.7)}/>`,
};
const season = (key) => SEASONS[key]();

// ------------------------------------------------------- everything else

// A four-leaf clover's leaf, a heart, its point at (cx, cy), turned so far,
// s its size.
const cloverLeaf = (cx, cy, turn, s = 1) => {
  const X = (v) => n(cx + v * s);
  const Y = (v) => n(cy + v * s);
  return `<path d="M${cx} ${cy} C${X(-9)} ${Y(-5)} ${X(-10)} ${Y(-15)} ${X(-4.5)} ${Y(-16)} C${X(-1.5)} ${Y(-16.5)} ${cx} ${Y(-14)} ${cx} ${Y(-12)} C${cx} ${Y(-14)} ${X(1.5)} ${Y(-16.5)} ${X(4.5)} ${Y(-16)} C${X(10)} ${Y(-15)} ${X(9)} ${Y(-5)} ${cx} ${cy} Z" transform="rotate(${turn} ${cx} ${cy})" ${style('#3fa553', '#1f6b31', 1.1)}/>`;
};

const ART = {
  // Father Time, the old year: an old man in a grey hood, his beard long and
  // white, holding up his hourglass, its sand nearly run.
  vampire: () =>
    `<path d="M9 74 C9 56 15 46 30 46 C45 46 51 56 51 74 Z" ${style('#7d86a6', INK, 1.4)}/>` +
    `<path d="M14 40 C12 22 21 13 30 13 C39 13 48 22 46 40 C46 45 43 48 41 49 L19 49 C17 48 14 45 14 40 Z" ${style('#8e97b8', INK, 1.4)}/>` +
    `<ellipse cx="30" cy="35" rx="10" ry="11" ${style('#f3c9a6', INK, 1.2)}/>` +
    `<path d="M21 36 C20 52 25 64 30 68 C35 64 40 52 39 36 C36 41 33 42 30 41.5 C27 42 24 41 21 36 Z" ${style(WHITE, INK, 1.1)}/>` +
    `<path d="M22.5 31 Q25.5 28.6 28 31 M32 31 Q34.5 28.6 37.5 31" ${style('none', WHITE, 2.2)}/>` +
    `<path d="M23.6 33.6 Q25.4 35 27.2 33.6 M32.8 33.6 Q34.6 35 36.4 33.6" ${style('none', DARK, 1)}/>` +
    `<path d="M27 40.5 Q30 42.8 33 40.5" ${style('none', '#c98a6a', 1)}/>` +
    `<path d="M40 54 H52 M40 70 H52" ${style('none', DEEP_GOLD, 2.4)}/>` +
    `<path d="M41.5 55 L50.5 55 L47 62 L50.5 69 L41.5 69 L45 62 Z" ${style('#eaf4ff', INK, 0.9)}/>` +
    `<path d="M43.4 56.5 L48.6 56.5 L46 60.5 Z M42.8 68.4 L49.2 68.4 L46 64.4 Z" ${style(GOLD, 'none', 0)}/>` +
    `<path d="M46 60.5 V66" ${style('none', GOLD, 0.8)}/>`,
  // Baby New Year: a baby in a black top hat with a band of gold, and a
  // sash across him, red and gold.
  werewolf: () =>
    `<path d="M14 75 C14 62 20 56 30 56 C40 56 46 62 46 75 Z" ${style(PAPER, INK, 1.4)}/>` +
    `<path d="M18.5 59.5 L42.5 72 L41 75 L16.5 62.5 Z" ${style(RED, INK, 1)}/>` +
    `<path d="M20 61 L41 72" ${style('none', GOLD, 1)}/>` +
    `<circle cx="30" cy="42" r="14" ${style('#f8d2b4', INK, 1.4)}/>` +
    `<circle cx="16" cy="43" r="3" ${style('#f8d2b4', INK, 1.1)}/><circle cx="44" cy="43" r="3" ${style('#f8d2b4', INK, 1.1)}/>` +
    eye(25, 41, 1.7) +
    eye(35, 41, 1.7) +
    `<circle cx="22" cy="47" r="2.6" ${style('#f39c9c', 'none', 0, ';opacity:0.7')}/><circle cx="38" cy="47" r="2.6" ${style('#f39c9c', 'none', 0, ';opacity:0.7')}/>` +
    `<path d="M26.5 48.5 Q30 51.5 33.5 48.5" ${style('none', '#b55a5a', 1.2)}/>` +
    `<path d="M29 29.5 C30.5 27.5 32.5 28.5 31.5 30.5" ${style('none', INK, 1)}/>` +
    `<rect x="19" y="27" width="22" height="3.6" rx="1.4" ${style(DARK, INK, 1)}/>` +
    `<rect x="22.5" y="11" width="15" height="17" rx="1.2" ${style(DARK, INK, 1)}/>` +
    `<rect x="22.5" y="22.5" width="15" height="3.6" ${style(GOLD, 'none', 0)}/>`,
  // A night owl, up for midnight: a round brown owl, wide awake, a party
  // hat on her head, on a bough.
  mummy: () =>
    `<path d="M6 68 C20 66 38 69 54 65" ${style('none', INK, 4.4)}/><path d="M6 68 C20 66 38 69 54 65" ${style('none', '#7a5030', 2.8)}/>` +
    `<ellipse cx="30" cy="50" rx="15" ry="17" ${style('#9a6a3e', INK, 1.4)}/>` +
    `<ellipse cx="30" cy="56" rx="9" ry="10" ${style('#e9d2a8', 'none', 0)}/>` +
    `<path d="M25 52 q2.5 2 5 0 q2.5 2 5 0 M24 57 q3 2 6 0 q3 2 6 0 M25.5 62 q2.2 1.6 4.5 0 q2.2 1.6 4.5 0" ${style('none', '#b08a5c', 0.9)}/>` +
    `<path d="M16 40 L19 33 L23 37 Z M44 40 L41 33 L37 37 Z" ${style('#9a6a3e', INK, 1.1)}/>` +
    `<circle cx="24" cy="43" r="6" ${style(PAPER, INK, 1.1)}/><circle cx="36" cy="43" r="6" ${style(PAPER, INK, 1.1)}/>` +
    `<circle cx="24" cy="43" r="3.4" ${style('#f2a922')}/><circle cx="36" cy="43" r="3.4" ${style('#f2a922')}/>` +
    eye(24, 43, 2) +
    eye(36, 43, 2) +
    `<path d="M28.5 47.5 L30 51 L31.5 47.5 Z" ${style('#f2a922', INK, 0.8)}/>` +
    `<path d="M24 66 l-1.6 3 M26 66 l0 3.2 M34 66 l0 3.2 M36 66 l1.6 3" ${style('none', '#f2a922', 1.4)}/>` +
    `<path d="M23 34.5 L30 11 L37 34.5 Z" ${style('#3d9bd6', INK, 1.2)}/>` +
    `<path d="M25.2 27.5 L34.8 27.5 L33.6 23.5 L26.4 23.5 Z M27.6 19.5 L32.4 19.5 L31.4 16 L28.6 16 Z" ${style(GOLD, 'none', 0)}/>` +
    `<circle cx="30" cy="10.5" r="2.4" ${style(RED, INK, 0.9)}/>`,
  // A polar bear in a swim ring, red and white, in the icy water, for the
  // New Year's Day plunge.
  zombie: () =>
    `<path d="M5 60 Q12 56 19 60 T33 60 T47 60 T57 60 V76 H5 Z" ${style('#7fb9e6', INK, 1.2)}/>` +
    `<ellipse cx="30" cy="44" rx="13" ry="12" ${style(WHITE, INK, 1.4)}/>` +
    `<circle cx="20" cy="35" r="3.6" ${style(WHITE, INK, 1.2)}/><circle cx="40" cy="35" r="3.6" ${style(WHITE, INK, 1.2)}/>` +
    `<circle cx="20" cy="35" r="1.6" ${style('#b9c3d6')}/><circle cx="40" cy="35" r="1.6" ${style('#b9c3d6')}/>` +
    eye(25, 41, 1.6) +
    eye(35, 41, 1.6) +
    `<ellipse cx="30" cy="48" rx="5.2" ry="4" ${style('#e4e9f2', 'none', 0)}/>` +
    `<ellipse cx="30" cy="46.4" rx="2.2" ry="1.5" ${style(DARK)}/>` +
    `<path d="M30 48 V49.6 M27.6 50.2 Q30 51.8 32.4 50.2" ${style('none', DARK, 1)}/>` +
    `<ellipse cx="30" cy="61" rx="20" ry="6.5" ${style(RED, INK, 1.4)}/>` +
    `<path d="M14 58 L17.5 63.5 M25 55 L26.5 66.8 M35 55 L33.5 66.8 M46 58 L42.5 63.5" ${style('none', '#fff', 3.4, ';stroke-linecap:butt')}/>` +
    `<ellipse cx="30" cy="59.2" rx="12" ry="3" ${style('#c2e0f5', INK, 0.9)}/>` +
    `<path d="M20 57.5 C19 54 21 52 23.5 52.5 M40 57.5 C41 54 39 52 36.5 52.5" ${style(WHITE, INK, 1.1)}/>`,
  // A party hat, red with gold stars, its band a white fringe and its top a
  // gold pompom.
  lantern: () =>
    `<path d="M15 66 L30 15 L45 66 Z" ${style(RED, INK, 1.6)}/>` +
    `<path d="M21.5 44 L38.5 44 L36.6 37.5 L23.4 37.5 Z" ${style(DEEP_RED, 'none', 0)}/>` +
    star(25.5, 55, 3, GOLD) +
    star(34.5, 52.5, 2.6, GOLD) +
    star(30.5, 30, 2.3, GOLD) +
    `<path d="M13 66 L16 70.5 L19 66 L22 70.5 L25 66 L28 70.5 L31 66 L34 70.5 L37 66 L40 70.5 L43 66 L46 70.5 L47 66 Z" ${style(WHITE, INK, 1)}/>` +
    `<rect x="13" y="63" width="34" height="4" rx="1.6" ${style(WHITE, INK, 1)}/>` +
    `<circle cx="30" cy="13.5" r="5" ${style(GOLD, DEEP_GOLD, 1)}/>` +
    `<path d="M27 11.5 L33 15.5 M27 15.5 L33 11.5 M30 9 V18" ${style('none', DEEP_GOLD, 0.7)}/>`,
  // A bottle of champagne, green, its neck foiled in gold, its cork popping
  // and the fizz spraying.
  brew: () =>
    `<path d="M23 74 C21 74 20 73 20 71 V45 C20 40 23.5 37.5 26 35 V25 H34 V35 C36.5 37.5 40 40 40 45 V71 C40 73 39 74 37 74 Z" ${style('#1f6b3a', INK, 1.5)}/>` +
    `<path d="M25.5 34 V24 H34.5 V34 C33 36 27 36 25.5 34 Z" ${style(GOLD, INK, 1.1)}/>` +
    `<rect x="21" y="48" width="18" height="15" rx="1.2" ${style('#fff6dc', INK, 1)}/>` +
    `<path d="M24.5 52.5 H35.5 M26 56 H34 M27.5 59.5 H32.5" ${style('none', DEEP_GOLD, 1.1)}/>` +
    `<path d="M23.5 44 C22.5 52 22.5 62 23.5 70" ${style('none', '#4fa86e', 1.4, ';opacity:0.8')}/>` +
    `<path d="M27 21 C26.5 18 27.5 16.5 30 16.5 C32.5 16.5 33.5 18 33 21 Z" ${style('#d9a86c', INK, 1)}/>` +
    `<path d="M27 21 L33 21" ${style('none', INK, 0.8)}/>` +
    `<path d="M30 15 C27 11 22 9 17 10 M30 15 C31 10 34 7 38 6 M30 15 C34 12 40 12 44 14" ${style('none', '#fff2b8', 1.6)}/>` +
    [[16, 8, 1.6], [21, 5.5, 1.1], [39, 4.5, 1.4], [45, 11, 1.2], [13, 13, 1], [42, 17, 0.9], [26, 7, 0.9]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" ${style('#fff2b8', DEEP_GOLD, 0.5)}/>`).join(''),
  // New Year's ball: a great crystal ball, silver and white, faceted and
  // glinting, on the top of its pole.
  ghost: () => {
    const cx = 30;
    const cy = 38;
    const r = 18;
    const rows = [-12, -6, 0, 6, 12].map((dy) => {
      const w = Math.sqrt(r * r - dy * dy);
      return `M${n(cx - w)} ${n(cy + dy)} L${n(cx + w)} ${n(cy + dy)}`;
    });
    return (
      `<rect x="28.2" y="54" width="3.6" height="22" rx="1.2" ${style(SILVER, INK, 1.1)}/>` +
      `<path d="M23 74 H37" ${style('none', INK, 2.4)}/>` +
      `<circle cx="${cx}" cy="${cy}" r="${r}" ${style('#e9f0fb', INK, 1.6)}/>` +
      `<g ${style('none', '#9fb2d6', 0.8)}><path d="${rows.join(' ')}"/>` +
      [-0.55, 0, 0.55].map((k) => `<ellipse cx="${cx}" cy="${cy}" rx="${n(r * Math.abs(k) || 0.1)}" ry="${r}"/>`).join('') +
      `<ellipse cx="${cx}" cy="${cy}" rx="${n(r * 0.85)}" ry="${r}"/></g>` +
      [[24, 31, '#b8d6ff'], [36, 32, '#ffd6ec'], [30, 44, '#d6ffe9'], [21, 42, '#fff2b8'], [39, 43, '#b8d6ff'], [30, 26, '#ffd6ec']].map(([x, y, c]) => `<path d="M${x - 2.6} ${y} L${x} ${y - 2.6} L${x + 2.6} ${y} L${x} ${y + 2.6} Z" ${style(c, 'none', 0)}/>`).join('') +
      `<ellipse cx="22.5" cy="28" rx="4.6" ry="2.6" transform="rotate(-38 22.5 28)" ${style('#fff', 'none', 0, ';opacity:0.85')}/>` +
      glint(44, 22, 3.6, '#fff') +
      glint(15, 52, 2.6, '#fff')
    );
  },
  // A four-leaf clover, on its stem.
  nightshade: () =>
    `<path d="M30 44 C31 56 36 64 43 71" ${style('none', '#1f6b31', 3)}/>` +
    [45, 135, 225, 315].map((turn) => cloverLeaf(30, 44, turn, 1.3)).join('') +
    `<path d="M30 44 L20 34 M30 44 L40 34 M30 44 L20 54 M30 44 L40 54" ${style('none', '#8fd49c', 0.9)}/>`,
  // A horseshoe, its open end up to hold the luck in, its nails' holes in a
  // row round it.
  foxglove: () => {
    const holes = [[17.5, 34], [16.5, 44], [18.5, 54], [42.5, 34], [43.5, 44], [41.5, 54]];
    return (
      `<path d="M14 24 L22 24 L22 46 C22 52 25.5 56 30 56 C34.5 56 38 52 38 46 L38 24 L46 24 L46 46 C46 57 39 65 30 65 C21 65 14 57 14 46 Z" ${style('#a8b1c4', INK, 1.5)}/>` +
      `<path d="M16 27 V46 C16 55 22 62 30 62.5" ${style('none', '#e3e8f2', 1.4)}/>` +
      `<rect x="13" y="21" width="10" height="4" rx="1" ${style('#8a93a8', INK, 1)}/><rect x="37" y="21" width="10" height="4" rx="1" ${style('#8a93a8', INK, 1)}/>` +
      holes.map(([x, y]) => `<rect x="${x - 1.1}" y="${y - 1.6}" width="2.2" height="3.2" rx="0.6" ${style(DARK)}/>`).join('') +
      glint(46, 16, 3.2, GOLD) +
      glint(12, 70, 2.4, GOLD)
    );
  },
  // A ladybird, red with black spots, on a green leaf.
  hemlock: () =>
    `<path d="M10 66 C12 46 30 34 52 36 C50 56 32 68 10 66 Z" ${style(LEAF, INK, 1.3)}/>` +
    `<path d="M12 64 C24 56 36 46 50 38" ${style('none', '#1f6b31', 1)}/>` +
    `<ellipse cx="31" cy="49" rx="12" ry="13" transform="rotate(-30 31 49)" ${style(RED, INK, 1.4)}/>` +
    `<path d="M37.6 38 L24.4 60" ${style('none', DARK, 1.2)}/>` +
    `<path d="M33.5 37.5 C36 33 41 33 43 36.5 C44 39.5 41.5 42 38.5 41.5 Z" ${style(DARK, INK, 1)}/>` +
    `<circle cx="40" cy="36.2" r="0.9" ${style('#fff')}/>` +
    `<path d="M38.5 34.6 L41 29.5 M41.5 36 L46 32" ${style('none', DARK, 0.9)}/>` +
    [[26.5, 44, 2.3], [34.5, 47.5, 2.3], [24, 53, 2], [31.5, 56, 2], [29.5, 41.5, 1.4], [37.5, 52, 1.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" ${style(DARK)}/>`).join(''),
  // A lucky pig, pink as marzipan, a four-leaf clover in its mouth.
  wolfsbane: () =>
    `<path d="M47 50 C52 48 52 43 49 43.5 C47 44 48.5 47 50.5 46" ${style('none', DEEP_PINK, 1.4)}/>` +
    `<ellipse cx="31" cy="52" rx="17" ry="13" ${style(PINK, INK, 1.4)}/>` +
    `<path d="M20 63 V70 H24.5 V64 M37 63.5 V70 H41.5 V63" ${style(PINK, INK, 1.2)}/>` +
    `<circle cx="21" cy="44" r="10.5" ${style(PINK, INK, 1.4)}/>` +
    `<path d="M14 36.5 L13 29 L19.5 33.5 Z M25 34 L28.5 27.5 L29.5 35.5 Z" ${style(PINK, INK, 1.1)}/>` +
    `<ellipse cx="14.5" cy="46.5" rx="4.6" ry="3.6" ${style(DEEP_PINK, INK, 1.1)}/>` +
    `<ellipse cx="13.4" cy="46.3" rx="0.8" ry="1.2" ${style(DARK)}/><ellipse cx="15.8" cy="46.3" rx="0.8" ry="1.2" ${style(DARK)}/>` +
    eye(19.5, 40.5, 1.4) +
    eye(26, 41, 1.4) +
    `<path d="M15.5 51.5 C18 53.5 21.5 53.5 23.5 51.5" ${style('none', '#a8466b', 1)}/>` +
    `<path d="M20 52.5 C19 56 16.5 57.5 14 58.5" ${style('none', '#1f6b31', 1.2)}/>` +
    [0, 90, 180, 270].map((turn) => `<path d="M14 58.5 C11.2 57.2 11 54 12.8 53.6 C13.8 53.4 14 54.4 14 55 C14 54.4 14.2 53.4 15.2 53.6 C17 54 16.8 57.2 14 58.5 Z" transform="rotate(${turn} 14 58.5) scale(1) " ${style('#3fa553', '#1f6b31', 0.6)}/>`).join(''),
  // A sleepyhead, who missed midnight: a round face, fast asleep, in a
  // nightcap, and sleep rising from it.
  'lost-soul': () =>
    `<circle cx="28" cy="48" r="15" ${style('#c9c2f2', INK, 1.4)}/>` +
    `<path d="M14 43 C14 28 30 22 42 30 C47 33.5 49 38 46 44 C42 40 36 38 30 38.5 C24 39 18 41 14 43 Z" ${style('#5a6fd6', INK, 1.3)}/>` +
    `<path d="M42 30 C48 31 51 37 50 43" ${style('none', '#5a6fd6', 3.2)}/>` +
    `<circle cx="50" cy="45" r="3.4" ${style(WHITE, INK, 1)}/>` +
    `<path d="M13.5 43.5 C24 38.5 36 38 46.5 44" ${style('none', WHITE, 3.2)}/>` +
    `<path d="M20 50 Q22.6 52.6 25.2 50 M30.8 50 Q33.4 52.6 36 50" ${style('none', DARK, 1.2)}/>` +
    `<ellipse cx="28" cy="57" rx="2.2" ry="1.8" ${style('#8a6fb8', 'none', 0)}/>` +
    `<text x="40" y="22" style="fill:#c9c2f2;stroke:${INK};stroke-width:0.6;paint-order:stroke;font:800 10px system-ui,-apple-system,sans-serif">z</text>` +
    `<text x="46" y="14" style="fill:#c9c2f2;stroke:${INK};stroke-width:0.6;paint-order:stroke;font:800 7.5px system-ui,-apple-system,sans-serif">z</text>`,
};
