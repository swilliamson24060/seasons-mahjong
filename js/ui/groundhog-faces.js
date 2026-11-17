import { INK, PAPER, DARK, LEAF, PIPS, STICKS, style, n } from './draw.js';

// Groundhog Day's set of faces: the same 43 as Halloween's, which match just
// as those do, drawn as Groundhog Day. The eyes are burrows, two eyes
// peeping out of each; the bones candles, for Candlemas, the old feast on
// the same day; and the graves scrolls, for the forecast proclaimed. The
// four monsters, which stand for the winds, are the day's four weather
// prophets, each of whom comes out on the second of February to look for
// his shadow, in one land or another: the groundhog himself, in his top
// hat, a hedgehog, a badger and a bear, just woken. The jack-o'-lantern,
// the witch's brew and the ghost, where a set's red, green and white
// dragons stand, are the sun, a weather vane and a cloud: in sunshine he
// sees his shadow, and under a cloud he doesn't. The poison garden is
// spring's first flowers, a snowdrop, a crocus, a daffodil and a tulip, and
// the moons are songbirds, singing for spring, a robin, a bluebird, a
// cardinal and a chickadee, any two of which match, as any two flowers and
// any two moons do; and the lost soul is his shadow. Drawn as faces.js
// draws Halloween's, on a tile 60 by 80, whole: faces.js shrinks a drawing
// to make room for its index.

const NUMBERS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const SUITS = { eyes: 'Burrows', bones: 'Candles', graves: 'Scrolls' };

// Each face's name, by its key in tiles.js, and the kinds' that have more
// than one face.
const names = {
  vampire: 'Groundhog',
  werewolf: 'Hedgehog',
  mummy: 'Badger',
  zombie: 'Bear',
  lantern: 'Sun',
  brew: 'Weather vane',
  ghost: 'Cloud',
  nightshade: 'Snowdrop',
  foxglove: 'Crocus',
  hemlock: 'Daffodil',
  wolfsbane: 'Tulip',
  'new-moon': 'Robin',
  'waxing-moon': 'Bluebird',
  'full-moon': 'Cardinal',
  'waning-moon': 'Chickadee',
  'lost-soul': 'Shadow',
};
for (const [suit, title] of Object.entries(SUITS)) NUMBERS.forEach((number, k) => (names[`${suit}-${k + 1}`] = `${number} of ${title}`));
const kinds = { flower: 'Spring flower', moon: 'Songbird' };

function draw(f) {
  if (f.group === 'eyes') return f.index === '1' ? bigBurrow() : PIPS[f.index].map((p) => burrow(...p)).join('');
  if (f.group === 'bones') return f.index === '1' ? candlestick() : STICKS[f.index].map((s) => candle(...s)).join('');
  if (f.group === 'graves') return scroll(f.index);
  if (f.group === 'moon') return songbird(f.key);
  return ART[f.key]();
}

export const GROUNDHOG_FACES = { draw, names, kinds };

const EARTH = '#8a5a32';
const DEEP_EARTH = '#5a3a1e';
const GRASS = '#5c9e45';
const SNOW = '#f3f8ff';
const SNOW_EDGE = '#9fb6d3';
const PEEP = '#fff1bd'; // eyes peeping out of the dark
const FUR = '#a3713f';
const PALE_FUR = '#e3c69c';
const WAX = '#f4dfa0';
const FLAME = '#ff9a1f';
const FLAME_EDGE = '#c25a0e';
const FLAME_HEART = '#ffe46b';
const GOLD = '#e2b443';
const DEEP_GOLD = '#a8780f';
const PARCHMENT = '#f6e7c1';
const ROLL = '#e5cd94';
const SEAL = '#b3232e';
const VERDIGRIS = '#5fae94';
const DEEP_VERDIGRIS = '#2c6b5a';
const SKY = '#d9ecfa';
const SHADOW = '#47425f';

// A point at an angle in degrees, clockwise from twelve o'clock, so far
// from (cx, cy).
const at = (cx, cy, deg, len) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return `${n(cx + len * Math.cos(a))} ${n(cy + len * Math.sin(a))}`;
};

// An eye: dark, with a glint.
const eye = (x, y, r = 1.4) => `<circle cx="${x}" cy="${y}" r="${r}" ${style(DARK)}/><circle cx="${n(x - r * 0.35)}" cy="${n(y - r * 0.35)}" r="${n(r * 0.35)}" ${style('#fff')}/>`;

// A snowflake of six arms at (x, y), s from its middle to an arm's end.
const flake = (x, y, s) => {
  const arm = (deg) => `M${at(x, y, deg, s)} L${at(x, y, deg + 180, s)}`;
  return `<path d="${[0, 60, 120].map(arm).join(' ')}" ${style('none', SNOW_EDGE, n(Math.max(0.6, s / 3)))}/>`;
};

// ---------------------------------------------------------------- burrows

// A burrow where a pip stands: a ring of earth, snow on its top, round a
// dark hole, two eyes peeping out of it; the middle one of the five and the
// nine ringed with spring's grass, as a dots tile's middle dot is red.
function burrow(cx, cy, r, grass = false) {
  const snow = r * 0.82;
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" ${style(grass ? GRASS : EARTH, INK, n(Math.max(0.8, r / 7)))}/>` +
    `<circle cx="${cx}" cy="${n(cy + r * 0.06)}" r="${n(r * 0.62)}" ${style(DARK)}/>` +
    `<path d="M${at(cx, cy, -64, snow)} A${n(snow)} ${n(snow)} 0 0 1 ${at(cx, cy, 64, snow)}" ${style('none', SNOW, n(r * 0.3))}/>` +
    `<circle cx="${n(cx - r * 0.24)}" cy="${n(cy + r * 0.12)}" r="${n(r * 0.14)}" ${style(PEEP)}/>` +
    `<circle cx="${n(cx + r * 0.24)}" cy="${n(cy + r * 0.12)}" r="${n(r * 0.14)}" ${style(PEEP)}/>`
  );
}

// The one of burrows: the groundhog's own, in a snowy mound, two eyes
// peeping out of it, as the snow comes down.
function bigBurrow() {
  return (
    `<path d="M5 71 C7 46 17 30 30 30 C43 30 53 46 55 71 Z" ${style(EARTH, INK, 1.5)}/>` +
    `<path d="M7.6 55 C11 40 20 32.6 30 32.6 C40 32.6 49 40 52.4 55 C47.5 50 43 51.5 39 47.5 C35 51 25 51 21 47.5 C17 51.5 12.5 50 7.6 55 Z" ${style(SNOW, SNOW_EDGE, 0.9)}/>` +
    `<ellipse cx="30" cy="59" rx="13" ry="11" ${style(DARK, DEEP_EARTH, 1.4)}/>` +
    `<ellipse cx="25" cy="57.5" rx="2.6" ry="3" ${style(PEEP)}/><ellipse cx="35" cy="57.5" rx="2.6" ry="3" ${style(PEEP)}/>` +
    `<circle cx="25.3" cy="58.3" r="1.25" ${style(DARK)}/><circle cx="35.3" cy="58.3" r="1.25" ${style(DARK)}/>` +
    `<path d="M3 71 H57" ${style('none', INK, 1.6)}/>` +
    [[12, 17, 2.4], [25, 10, 1.8], [40, 14, 2.2], [50, 24, 1.8], [8, 30, 1.6], [52, 8, 2]].map((f) => flake(...f)).join('')
  );
}

// ---------------------------------------------------------------- candles

// A candle's flame, a drop of fire from its tip down to its round foot,
// half as wide as w, with a heart of yellow.
function flame(cx, tip, foot, w, edge) {
  const drop = (t, f, r) => {
    const mid = t + (f - t) * 0.5;
    return `M${cx} ${n(t)} C${n(cx + r * 0.35)} ${n(t + (f - t) * 0.25)} ${n(cx + r)} ${n(mid)} ${n(cx + r)} ${n(f - r)} A${n(r)} ${n(r)} 0 0 1 ${n(cx - r)} ${n(f - r)} C${n(cx - r)} ${n(mid)} ${n(cx - r * 0.35)} ${n(t + (f - t) * 0.25)} ${cx} ${n(t)} Z`;
  };
  return `<path d="${drop(tip, foot, w)}" ${style(FLAME, FLAME_EDGE, edge)}/><path d="${drop(tip + (foot - tip) * 0.35, foot - w * 0.12, w * 0.5)}" ${style(FLAME_HEART)}/>`;
}

// A candle standing where a stick stands, as long, [x, y, length, width]:
// beeswax, lit, its flame the top part of it.
function candle(cx, cy, len, w) {
  const top = cy - len / 2;
  const foot = cy + len / 2;
  const wax = top + len * 0.4; // where the wax begins,
  const tip = top - w * 0.15; // and the flame
  const fire = wax - w * 0.2;
  const bw = w * 1.05;
  const out = n(Math.max(0.6, w / 7));
  return (
    `<rect x="${n(cx - bw / 2)}" y="${n(wax)}" width="${n(bw)}" height="${n(foot - wax)}" rx="${n(bw * 0.2)}" ${style(WAX, INK, out)}/>` +
    `<path d="M${cx} ${n(wax)} V${n(wax - w * 0.3)}" ${style('none', DARK, n(Math.max(0.5, w / 9)))}/>` +
    flame(cx, tip, fire, Math.min(w * 0.48, (fire - tip) * 0.36), out)
  );
}

// The one of candles: a candle in a brass chamberstick, its handle a ring,
// its flame tall and glowing.
function candlestick() {
  return (
    `<circle cx="30" cy="21" r="14" ${style('#ffd75e', 'none', 0, ';opacity:0.35')}/>` +
    `<path d="M45 64.5 C54 64 54 53.5 46 54.5" ${style('none', INK, 4.4)}/><path d="M45 64.5 C54 64 54 53.5 46 54.5" ${style('none', GOLD, 2.4)}/>` +
    `<ellipse cx="30" cy="67" rx="19" ry="5.5" ${style(GOLD, INK, 1.4)}/>` +
    `<ellipse cx="30" cy="65.6" rx="13.5" ry="3" ${style('#f3d77f', DEEP_GOLD, 0.8)}/>` +
    `<rect x="23.5" y="57.5" width="13" height="8" rx="1.6" ${style(GOLD, INK, 1.2)}/>` +
    `<rect x="25" y="32" width="10" height="26" rx="1.6" ${style(WAX, INK, 1.3)}/>` +
    `<path d="M25.6 34.5 C27.5 34.2 27.3 40.5 28.6 40.5 C30 40.5 29.4 34.4 31.5 34.2" ${style('none', '#e6c873', 1.2)}/>` +
    `<path d="M30 32 V28.5" ${style('none', DARK, 1.3)}/>` +
    flame(30, 9, 29.5, 5.4, 1.1)
  );
}

// ---------------------------------------------------------------- scrolls

// A scroll, unrolled: rolled at its top and foot, two lines of its
// proclamation, the number big in its middle, as a grave has its number,
// and a seal of red wax.
function scroll(number) {
  const roll = (y) =>
    `<rect x="9" y="${y - 4}" width="42" height="8" rx="4" ${style(ROLL, INK, 1.3)}/>` + `<ellipse cx="13" cy="${y}" rx="1.7" ry="2.6" ${style('none', '#a8854a', 0.9)}/>`;
  return (
    `<rect x="12.5" y="22" width="35" height="46" ${style(PARCHMENT, INK, 1.4)}/>` +
    `<path d="M17 30 H35 M17 34.5 H31.5" ${style('none', '#b08850', 1.3)}/>` +
    `<circle cx="41.4" cy="32" r="3.6" ${style(SEAL, '#7a1018', 0.8)}/>` +
    `<circle cx="40.4" cy="31" r="1" ${style('#e0606a')}/>` +
    `<text x="30" y="61.5" text-anchor="middle" style="fill:#3b2614;font:700 25px Georgia,'Times New Roman',serif">${number}</text>` +
    roll(20) +
    roll(68)
  );
}

// -------------------------------------------------------------- songbirds

// The songbirds, each perched on a snowy branch in a round of pale sky:
// its breast, its wing and tail, its head and its beak, and the robin's,
// the bluebird's, the cardinal's and the chickadee's own markings.
const BIRDS = {
  'new-moon': { breast: '#ef6a2c', wing: '#6f6258', head: '#3b302c', beak: '#f2c14e' },
  'waxing-moon': { breast: '#e0803a', wing: '#3d7fd6', head: '#3d7fd6', beak: DARK },
  'full-moon': { breast: '#e23b4c', wing: '#a5182e', head: '#d3263a', beak: '#ff8a2a', crest: true, mask: true },
  'waning-moon': { breast: '#efe3cc', wing: '#8d96a6', head: '#f7f5ef', beak: DARK, cap: true },
};

function songbird(key) {
  const b = BIRDS[key];
  return (
    `<circle cx="30" cy="44" r="19.5" ${style(SKY, INK, 1.3)}/>` +
    `<path d="M13.5 56.5 C22 54.5 35 55.5 46.5 51.5" ${style('none', '#6b4423', 2.6)}/>` +
    `<path d="M39.5 53.8 L44 48.5" ${style('none', '#6b4423', 1.5)}/>` +
    `<path d="M15.5 55 C18 53.2 21 53.2 23 54.6 M36 53.6 C38.5 52 41.5 51.6 43.5 52.4" ${style('none', SNOW, 2.2)}/>` +
    `<path d="M37 47.5 L46.5 55 L43.5 57.5 L35 51.5 Z" ${style(b.wing, INK, 0.9)}/>` +
    `<ellipse cx="30" cy="46.5" rx="9.5" ry="7.8" transform="rotate(28 30 46.5)" ${style(b.breast, INK, 1.1)}/>` +
    `<path d="M27.5 40.5 C33.5 39 39 43 39.5 50.5 C34 50.5 29 46.5 27.5 40.5 Z" ${style(b.wing, INK, 0.9)}/>` +
    (b.crest ? `<path d="M20.5 33.5 C22.5 28.5 26 26 29.5 25.5 C28 28.5 28 31.5 28.6 34.5 Z" ${style(b.head, INK, 0.9)}/>` : '') +
    `<circle cx="23" cy="37.5" r="6" ${style(b.head, INK, 1.1)}/>` +
    (b.mask ? `<path d="M17.4 35.6 C19 34.4 20.8 34.8 21.4 36.8 C21 39.4 19.6 41 17.4 40.6 Z" ${style(DARK)}/>` : '') +
    (b.cap
      ? `<path d="M17 37 C17 30.2 29 30.2 29 37 C25.5 35.4 20.5 35.4 17 37 Z" ${style(DARK)}/>` + `<path d="M18.6 40.6 C20.4 44.4 24.4 44.8 26.6 41.6 C23.8 42.2 21 41.8 18.6 40.6 Z" ${style(DARK)}/>`
      : '') +
    `<path d="M17.6 36.4 L12.8 38.4 L17.9 39.7 Z" ${style(b.beak, INK, 0.6)}/>` +
    eye(21.2, 36.6, 1.25) +
    `<path d="M27.5 54 V56 M31 54 V55.6" ${style('none', DARK, 0.9)}/>`
  );
}

// ------------------------------------------------------- everything else

// A snowdrop's flower, hanging from (x, y), s its size: a green cap and a
// white bell, split at its foot, with the green mark inside.
const snowdrop = (x, y, s) => {
  const X = (v) => n(x + v * s);
  const Y = (v) => n(y + v * s);
  return (
    `<ellipse cx="${x}" cy="${Y(2.2)}" rx="${n(1.9 * s)}" ry="${n(2.2 * s)}" ${style('#5fae5f', INK, 0.7)}/>` +
    `<path d="M${x} ${Y(3.6)} C${X(-7)} ${Y(5)} ${X(-7.5)} ${Y(14)} ${X(-2.6)} ${Y(18.5)} C${X(-1)} ${Y(15)} ${X(1)} ${Y(15)} ${X(2.6)} ${Y(18.5)} C${X(7.5)} ${Y(14)} ${X(7)} ${Y(5)} ${x} ${Y(3.6)} Z" ${style(PAPER, INK, 1)}/>` +
    `<path d="M${X(-1.8)} ${Y(14.6)} Q${x} ${Y(16.6)} ${X(1.8)} ${Y(14.6)}" ${style('none', '#4f9e4f', 1)}/>`
  );
};

// A crocus at (x, y), s its size: a purple cup of three petals, open at
// the top on its orange heart, on a pale stem, with grassy leaves.
const crocus = (x, y, s) => {
  const X = (v) => n(x + v * s);
  const Y = (v) => n(y + v * s);
  return (
    `<path d="M${x} ${Y(11)} V70" ${style('none', '#d9e6c2', n(2.2 * s))}/>` +
    `<path d="M${X(-1.5)} 70 C${X(-4)} ${Y(24)} ${X(-6)} ${Y(18)} ${X(-8)} ${Y(13)} M${X(1.5)} 70 C${X(4)} ${Y(24)} ${X(6)} ${Y(18)} ${X(8.5)} ${Y(14)}" ${style('none', LEAF, n(1.5 * s))}/>` +
    `<path d="M${X(-1.2)} ${Y(-5)} L${X(-2.6)} ${Y(-9)} M${X(1.2)} ${Y(-5)} L${X(2.6)} ${Y(-9)}" ${style('none', '#ff9a1f', n(1.2 * s))}/>` +
    `<path d="M${X(-7)} ${Y(-5)} C${X(-8)} ${Y(5)} ${X(-4.5)} ${Y(12)} ${x} ${Y(12)} C${X(4.5)} ${Y(12)} ${X(8)} ${Y(5)} ${X(7)} ${Y(-5)} L${X(3.4)} ${Y(-1.5)} L${x} ${Y(-10)} L${X(-3.4)} ${Y(-1.5)} Z" ${style('#9b5de5', INK, 1)}/>` +
    `<path d="M${X(-3.4)} ${Y(-1.5)} C${X(-2.8)} ${Y(4)} ${X(-1.6)} ${Y(8.5)} ${x} ${Y(12)} M${X(3.4)} ${Y(-1.5)} C${X(2.8)} ${Y(4)} ${X(1.6)} ${Y(8.5)} ${x} ${Y(12)}" ${style('none', '#6a35b0', 0.9)}/>`
  );
};

const ART = {
  // The groundhog himself, in his top hat, tipped, with a red band: his
  // buck teeth showing and his paws up.
  vampire: () =>
    `<path d="M9 76 C9 62 17 55.5 30 55.5 C43 55.5 51 62 51 76 Z" ${style(FUR, INK, 1.4)}/>` +
    `<ellipse cx="30" cy="69.5" rx="10" ry="7.5" ${style(PALE_FUR)}/>` +
    `<circle cx="16.5" cy="37" r="3.6" ${style(FUR, INK, 1.2)}/><circle cx="43.5" cy="37" r="3.6" ${style(FUR, INK, 1.2)}/>` +
    `<circle cx="16.9" cy="37.3" r="1.7" ${style(DEEP_EARTH)}/><circle cx="43.1" cy="37.3" r="1.7" ${style(DEEP_EARTH)}/>` +
    `<ellipse cx="30" cy="45.5" rx="14.5" ry="13" ${style(FUR, INK, 1.4)}/>` +
    `<ellipse cx="30" cy="51" rx="8.2" ry="6.2" ${style(PALE_FUR, INK, 1)}/>` +
    eye(24, 42.5, 1.8) +
    eye(36, 42.5, 1.8) +
    `<ellipse cx="30" cy="47.6" rx="2.9" ry="2.1" ${style(DARK)}/>` +
    `<path d="M30 49.6 V51.4 M26.8 51.4 Q30 53.4 33.2 51.4" ${style('none', DARK, 1)}/>` +
    `<path d="M28 52.6 H32 V56.2 H28 Z M30 52.6 V56.2" ${style(PAPER, INK, 0.8)}/>` +
    `<ellipse cx="21.5" cy="62.5" rx="3.8" ry="2.7" ${style(FUR, INK, 1)}/><ellipse cx="38.5" cy="62.5" rx="3.8" ry="2.7" ${style(FUR, INK, 1)}/>` +
    `<g transform="rotate(-8 30 32)">` +
    `<rect x="18" y="29.5" width="24" height="3.6" rx="1.6" ${style(DARK, INK, 1)}/>` +
    `<rect x="21.5" y="12.5" width="17" height="17.5" rx="1.2" ${style(DARK, INK, 1)}/>` +
    `<rect x="21.5" y="24.6" width="17" height="3.4" ${style(SEAL)}/>` +
    `</g>`,
  // A hedgehog, the weather prophet of the old country, his spines up and
  // his snout out, on the snow.
  werewolf: () => {
    const spines = Array.from({ length: 31 }, (_, k) => {
      const a = Math.PI + (k / 30) * Math.PI;
      const r = k % 2 ? 1 : 0.84;
      return `${n(33 + 21 * r * Math.cos(a))} ${n(60 + 22 * r * Math.sin(a))}`;
    });
    return (
      `<g transform="translate(29 68) scale(1.1) translate(-30 -68)">` +
      `<path d="M7 70 C17 65 43 65 53 70 V73 H7 Z" ${style(SNOW, SNOW_EDGE, 0.9)}/>` +
      `<ellipse cx="24" cy="65" rx="3.2" ry="1.9" ${style('#8a6440', INK, 1)}/><ellipse cx="41" cy="65" rx="3.2" ry="1.9" ${style('#8a6440', INK, 1)}/>` +
      `<path d="M${spines.join(' L')} Z" ${style('#5e4026', INK, 1.3)}/>` +
      `<path d="M26 47 l3 -4 M33 44 l3 -4 M40 46 l3 -3.5 M45 52 l3.5 -2.5 M31 51 l3 -4 M38 53 l3 -3.5" ${style('none', '#b08a5e', 1.1)}/>` +
      `<path d="M27.5 46.5 C19 42.5 11 50 6.5 57.5 C11 61.5 19 64.5 27 63 C31 58.5 31 51 27.5 46.5 Z" ${style('#e8cfa4', INK, 1.3)}/>` +
      `<path d="M21.5 47 C20.8 43.4 24.8 42.6 25.6 45.6" ${style('#e8cfa4', INK, 1)}/>` +
      `<circle cx="6.9" cy="57.3" r="2" ${style(DARK)}/>` +
      eye(17.5, 52, 1.6) +
      `<path d="M10 60 Q13 61.2 16 60" ${style('none', '#a8805a', 0.9)}/>` +
      `</g>`
    );
  },
  // A badger, another, his face white with its two black stripes, his eyes
  // in them.
  mummy: () =>
    `<path d="M8 76 C8 63 17 57.5 30 57.5 C43 57.5 52 63 52 76 Z" ${style('#8d8f9c', INK, 1.4)}/>` +
    `<ellipse cx="15.5" cy="31.5" rx="3.8" ry="3.4" ${style(DARK, PAPER, 1.2)}/><ellipse cx="44.5" cy="31.5" rx="3.8" ry="3.4" ${style(DARK, PAPER, 1.2)}/>` +
    `<path d="M13 37 C13 25 47 25 47 37 C47 47 38 60 30 63 C22 60 13 47 13 37 Z" ${style(PAPER, INK, 1.4)}/>` +
    `<path d="M19 28.6 C22 27.3 25.6 28.4 26.3 31 L28.6 57 C25.5 55 22.5 50.5 20.5 46 C18 40 17 33 19 28.6 Z M41 28.6 C38 27.3 34.4 28.4 33.7 31 L31.4 57 C34.5 55 37.5 50.5 39.5 46 C42 40 43 33 41 28.6 Z" ${style(DARK)}/>` +
    `<circle cx="23.6" cy="41" r="1.9" ${style('#f2c14e')}/><circle cx="36.4" cy="41" r="1.9" ${style('#f2c14e')}/>` +
    eye(23.6, 41.2, 1.1) +
    eye(36.4, 41.2, 1.1) +
    `<ellipse cx="30" cy="59.6" rx="3.3" ry="2.4" ${style(DARK)}/>`,
  // A bear, a third, just woken for it: yawning, his eyes still shut, snow
  // on his head.
  zombie: () =>
    `<path d="M8 76 C8 64.5 17 58.5 30 58.5 C43 58.5 52 64.5 52 76 Z" ${style('#6e4524', INK, 1.4)}/>` +
    `<circle cx="16" cy="32.5" r="6" ${style('#6e4524', INK, 1.3)}/><circle cx="44" cy="32.5" r="6" ${style('#6e4524', INK, 1.3)}/>` +
    `<circle cx="16" cy="32.5" r="3" ${style('#c48e5a')}/><circle cx="44" cy="32.5" r="3" ${style('#c48e5a')}/>` +
    `<circle cx="30" cy="45.5" r="16" ${style('#6e4524', INK, 1.4)}/>` +
    `<path d="M20 34 C21.5 27.5 38.5 27.5 40 34 C36.5 32.4 33 34 30 33 C27 34 23.5 32.4 20 34 Z" ${style(SNOW, SNOW_EDGE, 0.9)}/>` +
    `<path d="M21.5 42.5 Q24 45 26.5 42.5 M33.5 42.5 Q36 45 38.5 42.5" ${style('none', DARK, 1.4)}/>` +
    `<ellipse cx="30" cy="53" rx="8.5" ry="7" ${style('#d9ad7c', INK, 1.1)}/>` +
    `<ellipse cx="30" cy="49.2" rx="3.4" ry="2.4" ${style(DARK)}/>` +
    `<ellipse cx="30" cy="55.6" rx="3.2" ry="3.3" ${style('#7a2335', INK, 0.9)}/>` +
    `<ellipse cx="30" cy="57.4" rx="2" ry="1.2" ${style('#e07a8a')}/>`,
  // The sun, beaming, its rays red-orange: in sunshine the groundhog sees
  // his shadow.
  lantern: () =>
    Array.from({ length: 12 }, (_, k) => `<path d="M${at(30, 42, k * 30 - 10, 13.5)} L${at(30, 42, k * 30, 23)} L${at(30, 42, k * 30 + 10, 13.5)} Z" ${style('#f26a1b', '#b8400c', 1)}/>`).join('') +
    `<circle cx="30" cy="42" r="14.5" ${style('#ffc83a', '#b8400c', 1.5)}/>` +
    `<path d="M22.5 40.5 Q25 37.8 27.5 40.5 M32.5 40.5 Q35 37.8 37.5 40.5" ${style('none', '#8a3a0c', 1.4)}/>` +
    `<circle cx="21.6" cy="46" r="2.4" ${style('#ff8a5a', 'none', 0, ';opacity:0.7')}/><circle cx="38.4" cy="46" r="2.4" ${style('#ff8a5a', 'none', 0, ';opacity:0.7')}/>` +
    `<path d="M24.5 46.5 Q30 52 35.5 46.5" ${style('none', '#8a3a0c', 1.4)}/>`,
  // A weather vane, green with verdigris: a rooster on its arrow, over the
  // four quarters of the wind.
  brew: () =>
    `<path d="M30 37 V73 M13 54 H47 M24 59.5 L36 48.5 M11 36.5 H48 M28.5 33.5 L28 36.5 M32.5 34.2 L32.5 36.5" ${style('none', INK, 3.6)}/>` +
    `<path d="M30 37 V73 M13 54 H47 M24 59.5 L36 48.5 M11 36.5 H48 M28.5 33.5 L28 36.5 M32.5 34.2 L32.5 36.5" ${style('none', VERDIGRIS, 1.6)}/>` +
    `<path d="M22 74 H38" ${style('none', INK, 2.4)}/>` +
    [['W', 9.5, 56.4], ['E', 50.5, 56.4], ['N', 38.6, 47.2], ['S', 21.4, 64.6]]
      .map(([letter, x, y]) => `<text x="${x}" y="${y}" text-anchor="middle" style="fill:${INK};font:800 6.5px system-ui,-apple-system,sans-serif">${letter}</text>`)
      .join('') +
    `<circle cx="30" cy="40" r="2" ${style(VERDIGRIS, INK, 1)}/>` +
    `<path d="M46.5 32 L55 36.5 L46.5 41 L48.5 36.5 Z" ${style(VERDIGRIS, INK, 1.1)}/>` +
    `<path d="M5.5 31.5 L13 31.5 L16 36.5 L13 41.5 L5.5 41.5 L8.5 36.5 Z" ${style(VERDIGRIS, INK, 1.1)}/>` +
    `<path d="M18.5 21.5 L21.5 19.6 L21.2 16.4 L23 17.4 L23.8 14 L25.6 16.6 L27 14.4 L27.8 18 L28.6 21.4 C29.4 24 31 25.6 33.5 25.2 L36 21.6 L38.2 15.6 L41.6 12.2 C44.6 14 45.2 19.6 43.6 24.2 L46.6 26 L44 30.4 L40.6 32.6 C37 34.6 31 35 27.4 33 C24 31 22.4 27.6 22.8 24.6 L21.6 26.6 L20.6 25.4 L21 23.2 Z" ${style(VERDIGRIS, INK, 1.1)}/>` +
    `<path d="M27 27.6 C30.5 30.2 34.2 30.4 37.6 28.4" ${style('none', DEEP_VERDIGRIS, 0.9)}/>` +
    `<circle cx="22.8" cy="20.4" r="0.9" ${style(DEEP_VERDIGRIS)}/>`,
  // A cloud, white and soft, smiling: under a cloud the groundhog sees no
  // shadow, and spring comes early.
  ghost: () =>
    `<path d="M35 31 C37 25 46 24.5 48.5 30 C53.5 29.5 56 34.5 53 37.5" ${style('#e3e9f3', INK, 1.2)}/>` +
    `<path d="M14 58.5 C6.5 58.5 5.5 47 13 46 C12 37 22 33 27.5 38.5 C29.5 28.5 44 28 46 38.5 C53 37 57 45 52.5 49.5 C57.5 52 56 58.5 50 58.5 Z" ${style(PAPER, INK, 1.5)}/>` +
    `<path d="M11 55.5 C20 57.6 40 57.6 53.5 54.5 C54 57 52.5 58.5 50 58.5 L14 58.5 C12 58.5 11 57.5 11 55.5 Z" ${style('#dbe3ef')}/>` +
    `<circle cx="25" cy="47" r="1.7" ${style(DARK)}/><circle cx="37" cy="47" r="1.7" ${style(DARK)}/>` +
    `<circle cx="21.6" cy="51" r="2.2" ${style('#f7a8c4', 'none', 0, ';opacity:0.7')}/><circle cx="40.4" cy="51" r="2.2" ${style('#f7a8c4', 'none', 0, ';opacity:0.7')}/>` +
    `<path d="M27.5 51 Q31 54 34.5 51" ${style('none', DARK, 1.3)}/>`,
  // A snowdrop, the first flower of spring, two bells hanging from their
  // arching stems.
  nightshade: () =>
    `<path d="M27 74 C23 62 22 52 24.5 42 C27 52 28.5 62 30 74 Z" ${style(LEAF, INK, 0.9)}/>` +
    `<path d="M33 74 C37 64 39.5 56 38.5 47 C35.5 56 33 64 31 74 Z" ${style(LEAF, INK, 0.9)}/>` +
    `<path d="M30 74 C30 54 32 34 41 27 C43.5 25.5 45 26.5 45 29" ${style('none', LEAF, 1.6)}/>` +
    `<path d="M29 74 C28 58 25 42 17.5 36 C15.6 34.8 14 35.6 14 38" ${style('none', LEAF, 1.4)}/>` +
    snowdrop(45, 29, 1) +
    snowdrop(14, 38, 0.82),
  // Crocuses, purple, out of the snow.
  foxglove: () =>
    crocus(21, 47, 0.82) +
    crocus(37, 36, 1) +
    `<path d="M5 71 C16 65.5 44 65.5 55 71 V74 H5 Z" ${style(SNOW, SNOW_EDGE, 0.9)}/>`,
  // A daffodil, yellow, its trumpet orange, facing out.
  hemlock: () =>
    `<path d="M30 74 C30 64 31 56 30 47" ${style('none', LEAF, 2.4)}/>` +
    `<path d="M28.5 74 C22 64 18 56 17 46 C22 54 26 62 30 74 Z" ${style(LEAF, INK, 0.9)}/>` +
    `<path d="M31.5 74 C38 66 42 60 44 52 C38 58 34 64 30.5 74 Z" ${style(LEAF, INK, 0.9)}/>` +
    Array.from({ length: 6 }, (_, k) => `<ellipse cx="30" cy="24.5" rx="5.4" ry="9.5" transform="rotate(${k * 60} 30 34)" ${style('#ffe066', '#c9a10e', 1)}/>`).join('') +
    `<path d="${Array.from({ length: 16 }, (_, k) => `${k ? 'L' : 'M'}${at(30, 34, k * 22.5, k % 2 ? 6 : 7.2)}`).join(' ')} Z" ${style('#ffa51f', '#c96a0a', 1.1)}/>` +
    `<circle cx="30" cy="34" r="3.4" ${style('#ff8a0f')}/>`,
  // A tulip, red, in its cup of three petals, between its broad leaves.
  wolfsbane: () =>
    `<path d="M30 74 V50" ${style('none', LEAF, 2.4)}/>` +
    `<path d="M29 74 C18 68 13 56 16 44 C23 52 27 62 30 74 Z" ${style(LEAF, INK, 1)}/>` +
    `<path d="M31 74 C41 68 46 58 44 48 C38 55 33 62 30 72 Z" ${style(LEAF, INK, 1)}/>` +
    `<path d="M19 27 C18 40 21 49 30 51 C39 49 42 40 41 27 C38 30 36 31.5 34.5 34 C33 29.5 31.5 25.5 30 23 C28.5 25.5 27 29.5 25.5 34 C24 31.5 22 30 19 27 Z" ${style('#e8456a', INK, 1.3)}/>` +
    `<path d="M25.5 34 C26 42 27.5 47 30 51 M34.5 34 C34 42 32.5 47 30 51" ${style('none', '#b3233f', 1)}/>` +
    `<path d="M22 32 C21.6 39 23 44 25.4 47" ${style('none', '#ff8fa8', 1.2)}/>`,
  // His shadow, standing up beside him on the snow, its eyes wide: the
  // sight that sends him back into his burrow.
  'lost-soul': () => {
    const shape =
      `<circle cx="20.6" cy="24" r="2.9"/><circle cx="39.4" cy="24" r="2.9"/>` +
      `<ellipse cx="30" cy="31" rx="11.5" ry="10.5"/>` +
      `<path d="M17 69 C14 57 16 44 24 39 L36 39 C44 44 46 57 43 69 Z"/>` +
      `<ellipse cx="21" cy="48" rx="3.2" ry="5" transform="rotate(-30 21 48)"/><ellipse cx="39" cy="48" rx="3.2" ry="5" transform="rotate(30 39 48)"/>` +
      `<ellipse cx="22.5" cy="69.5" rx="5" ry="2.8"/><ellipse cx="37.5" cy="69.5" rx="5" ry="2.8"/>`;
    return (
      `<path d="M5 73 C18 68.5 42 68.5 55 73" ${style('none', SNOW_EDGE, 1.6)}/>` +
      `<g ${style(INK, INK, 2.4)}>${shape}</g><g ${style(SHADOW)}>${shape}</g>` +
      `<ellipse cx="25.5" cy="30" rx="2.6" ry="3.2" ${style(PAPER)}/><ellipse cx="34.5" cy="30" rx="2.6" ry="3.2" ${style(PAPER)}/>` +
      `<circle cx="25.9" cy="31" r="1.25" ${style(DARK)}/><circle cx="34.9" cy="31" r="1.25" ${style(DARK)}/>`
    );
  },
};
