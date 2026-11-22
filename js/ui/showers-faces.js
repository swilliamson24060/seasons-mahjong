import { INK, PAPER, DARK, LEAF, PIPS, STICKS, style, n } from './draw.js';

// April Showers' set of faces: the same 43 as Halloween's, which match just
// as those do, drawn as April's showers and May's flowers. The eyes are
// raindrops, the one a great drop landing with a splash; the bones
// umbrellas, furled, the one opened; and the graves seed packets, each with
// its number on the packet. The four monsters, which stand for the winds,
// are four who love the rain: a duck, a frog, a snail and a worm. The
// jack-o'-lantern, the witch's brew and the ghost, where a set's red, green
// and white dragons stand, are red rain boots, a green watering can and a
// white paper boat. The poison garden is May's flowers, lily of the valley,
// lilac, an iris and a peony, and the moons are butterflies out after the
// rain, a monarch, a swallowtail, a spring azure and a cabbage white, any
// two of which match, as any two flowers and any two moons do; and the lost
// soul is a wilted flower, for May Day. Drawn as faces.js draws
// Halloween's, on a tile 60 by 80, whole: faces.js shrinks a drawing to
// make room for its index.

const NUMBERS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const SUITS = { eyes: 'Raindrops', bones: 'Umbrellas', graves: 'Seed packets' };

// Each face's name, by its key in tiles.js, and the kinds' that have more
// than one face.
const names = {
  vampire: 'Duck',
  werewolf: 'Frog',
  mummy: 'Snail',
  zombie: 'Worm',
  lantern: 'Rain boots',
  brew: 'Watering can',
  ghost: 'Paper boat',
  nightshade: 'Lily of the valley',
  foxglove: 'Lilac',
  hemlock: 'Iris',
  wolfsbane: 'Peony',
  'new-moon': 'Monarch',
  'waxing-moon': 'Swallowtail',
  'full-moon': 'Spring azure',
  'waning-moon': 'Cabbage white',
  'lost-soul': 'Wilted flower',
};
for (const [suit, title] of Object.entries(SUITS)) NUMBERS.forEach((number, k) => (names[`${suit}-${k + 1}`] = `${number} of ${title}`));
const kinds = { flower: 'May flower', moon: 'Butterfly' };

function draw(f) {
  if (f.group === 'eyes') return f.index === '1' ? splash() : PIPS[f.index].map((p) => raindrop(...p)).join('');
  if (f.group === 'bones') return f.index === '1' ? openUmbrella() : STICKS[f.index].map((s) => furled(...s)).join('');
  if (f.group === 'graves') return packet(f.index);
  if (f.group === 'moon') return butterfly(f.key);
  return ART[f.key]();
}

export const SHOWERS_FACES = { draw, names, kinds };

const RAIN = '#3d8fe0';
const DEEP_RAIN = '#1f5fa8';
const SPLASH = '#7cc0f5';
const PUDDLE = '#cce8ff';
const SUNLIT = '#a8e3ff';
const CANOPY = '#16a092';
const DEEP_CANOPY = '#0c6b62';
const PALE_CANOPY = '#bdeee6';
const HANDLE = '#9a5b2c';
const KRAFT = '#f3e2bf';
const DEEP_KRAFT = '#d8bb85';
const SEED_INK = '#7a4515';
const SOIL = '#8a5a35';
const SPROUT = '#56b04a';
const DUCK = '#ffd84a';
const DEEP_DUCK = '#e8ae17';
const BILL = '#f39321';
const FROG = '#6cc24a';
const DEEP_FROG = '#3f8f2e';
const PALE_FROG = '#d8f2a8';
const SNAIL = '#d9c6a5';
const SHELL = '#e39a4c';
const DEEP_SHELL = '#a3591d';
const WORM = '#f2a1a8';
const DEEP_WORM = '#c86f7a';
const BOOT = '#dc3b34';
const DEEP_BOOT = '#9c1f1d';
const CAN = '#3ea84f';
const DEEP_CAN = '#23712f';
const STEM = '#2f7d4a';
const LILAC = '#b48ae0';
const PALE_LILAC = '#d9c2f5';
const DEEP_LILAC = '#7d52b8';
const IRIS = '#5b5fd6';
const DEEP_IRIS = '#363a9e';
const PEONY = '#f6a5c3';
const DEEP_PEONY = '#e0679a';
const PALE_PEONY = '#ffd6e6';
const WILTED = '#c9a0b4';
const BROWN = '#8e6650';
const DRY_LEAF = '#9a9a5a';

// A raindrop's outline, its round foot at the bottom and its point at the
// top, its middle at (cx, cy), r its size as a pip's.
function drop(cx, cy, r) {
  const R = r * 0.82;
  const foot = cy + r * 0.28;
  const top = cy - r * 1.18;
  return (
    `M${n(cx)} ${n(top)} C${n(cx + R * 0.25)} ${n(top + r * 0.55)} ${n(cx + R)} ${n(foot - R * 0.75)} ${n(cx + R)} ${n(foot)} ` +
    `A${n(R)} ${n(R)} 0 0 1 ${n(cx - R)} ${n(foot)} C${n(cx - R)} ${n(foot - R * 0.75)} ${n(cx - R * 0.25)} ${n(top + r * 0.55)} ${n(cx)} ${n(top)} Z`
  );
}

// The light catching a raindrop, on its foot's left.
const glint = (cx, cy, r) => {
  const x = n(cx - r * 0.36);
  const y = n(cy + r * 0.12);
  return `<ellipse cx="${x}" cy="${y}" rx="${n(r * 0.13)}" ry="${n(r * 0.3)}" transform="rotate(18 ${x} ${y})" ${style('#fff', 'none', 0, ';opacity:0.85')}/>`;
};

// An eye: dark, with a glint.
const eye = (x, y, r = 1.4) => `<circle cx="${x}" cy="${y}" r="${r}" ${style(DARK)}/><circle cx="${n(x - r * 0.35)}" cy="${n(y - r * 0.35)}" r="${n(r * 0.35)}" ${style('#fff')}/>`;

// A spiral from its middle out, `turns` times round, to radius r.
function spiral(cx, cy, turns, r, start = 0) {
  const steps = Math.round(turns * 28);
  const points = Array.from({ length: steps + 1 }, (_, k) => {
    const t = start + (k / 28) * 2 * Math.PI;
    const d = (r * k) / steps;
    return `${n(cx + d * Math.cos(t))} ${n(cy + d * Math.sin(t))}`;
  });
  return `M${points.join(' L')}`;
}

// -------------------------------------------------------------- raindrops

// A raindrop where a pip stands, rain blue, the light catching it; the
// middle one of the five and the nine sunlit, as a dots tile's middle dot
// is red.
function raindrop(cx, cy, r, middle = false) {
  return `<path d="${drop(cx, cy, r)}" ${style(middle ? SUNLIT : RAIN, INK, n(Math.max(0.9, r / 7)))}/>` + glint(cx, cy, r);
}

// The one of raindrops: a great drop about to land in a puddle, which
// splashes up in a crown to meet it.
function splash() {
  const flying = [[11, 50, 1.9], [19.5, 43.5, 1.6], [40.5, 43.5, 1.6], [49, 50, 1.9], [30, 41.5, 1.4]];
  return (
    `<ellipse cx="30" cy="66" rx="25" ry="7" ${style(PUDDLE, INK, 1.2)}/>` +
    `<ellipse cx="30" cy="66.6" rx="13.5" ry="3.4" ${style('none', RAIN, 1.1)}/>` +
    `<path d="M14.5 66 L11.5 53.5 L18.5 60.5 L20 47.5 L25 59 L30 49 L35 59 L40 47.5 L41.5 60.5 L48.5 53.5 L45.5 66 C38 69 22 69 14.5 66 Z" ${style(SPLASH, INK, 1.1)}/>` +
    flying.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" ${style(SPLASH, INK, 0.8)}/>`).join('') +
    `<path d="${drop(30, 23, 11.5)}" ${style(RAIN, INK, 1.5)}/>` +
    glint(30, 23, 11.5)
  );
}

// -------------------------------------------------------------- umbrellas

// A furled umbrella standing where a stick stands, [x, y, length, width]:
// its tip at the top, its canopy wrapped slim round the shaft, pleated and
// strapped, widest at its hem, and its handle hooked at the foot.
function furled(cx, cy, len, w) {
  const top = cy - len / 2;
  const foot = cy + len / 2;
  const tip = top + len * 0.08; // where the tip meets the canopy
  const hem = top + len * 0.66; // where the canopy is widest
  const end = top + len * 0.76; // where it closes on the shaft
  const hw = w * 0.55;
  const hook = Math.min(w * 0.48, len * 0.16);
  const out = n(Math.max(0.6, w / 8));
  const canopy =
    `M${cx} ${n(tip)} C${n(cx + hw * 0.25)} ${n(tip + len * 0.25)} ${n(cx + hw * 0.8)} ${n(hem - len * 0.18)} ${n(cx + hw)} ${n(hem)} ` +
    `Q${n(cx + hw * 0.8)} ${n(end)} ${cx} ${n(end)} Q${n(cx - hw * 0.8)} ${n(end)} ${n(cx - hw)} ${n(hem)} ` +
    `C${n(cx - hw * 0.8)} ${n(hem - len * 0.18)} ${n(cx - hw * 0.25)} ${n(tip + len * 0.25)} ${cx} ${n(tip)} Z`;
  const pleats = `M${cx} ${n(tip + len * 0.07)} L${n(cx + hw * 0.42)} ${n(hem + len * 0.03)} M${cx} ${n(tip + len * 0.07)} L${n(cx - hw * 0.45)} ${n(hem + len * 0.03)}`;
  const strap = `M${n(cx - hw * 0.55)} ${n(hem - len * 0.2)} H${n(cx + hw * 0.55)}`;
  const handle = `M${cx} ${n(end - 0.5)} V${n(foot - hook)} A${n(hook)} ${n(hook)} 0 0 1 ${n(cx - hook * 2)} ${n(foot - hook)}`;
  return (
    `<path d="M${cx} ${n(top)} V${n(tip + 1)}" ${style('none', INK, n(Math.max(0.9, w * 0.22)))}/>` +
    `<path d="${handle}" ${style('none', INK, n(w * 0.46))}/>` +
    `<path d="${handle}" ${style('none', HANDLE, n(w * 0.26))}/>` +
    `<path d="${canopy}" ${style(CANOPY, INK, out)}/>` +
    `<path d="${pleats}" ${style('none', DEEP_CANOPY, n(Math.max(0.45, w * 0.1)))}/>` +
    `<path d="${strap}" ${style('none', PALE_CANOPY, n(Math.max(0.8, len * 0.06)))}/>`
  );
}

// The one of umbrellas: an umbrella opened, its canopy scalloped at the
// rim, its panels in turn teal and pale, its handle hooked.
function openUmbrella() {
  const rim = 'C51.5 38.5 47 38.5 42.5 42 C38.5 38.5 34 38.5 30 42 C26 38.5 21.5 38.5 17.5 42 C13 38.5 8.5 38.5 5 42';
  const canopy = `M5 42 C5 24 16 13 30 13 C44 13 55 24 55 42 ${rim} Z`;
  const handle = 'M30 41 V64 C30 71.5 20.5 71.5 20.5 64';
  return (
    `<path d="${handle}" ${style('none', INK, 4)}/>` +
    `<path d="${handle}" ${style('none', HANDLE, 2.2)}/>` +
    `<path d="M30 6.5 V14" ${style('none', INK, 1.8)}/>` +
    `<path d="${canopy}" ${style(CANOPY)}/>` +
    `<path d="M30 13 C24.5 20 19.5 30 17.5 42 C21.5 38.5 26 38.5 30 42 Z M30 13 C44 13 55 24 55 42 C51.5 38.5 47 38.5 42.5 42 C40.5 30 35.5 20 30 13 Z" ${style(PALE_CANOPY)}/>` +
    `<path d="M30 13 C24.5 20 19.5 30 17.5 42 M30 13 V42 M30 13 C35.5 20 40.5 30 42.5 42" ${style('none', INK, 0.9)}/>` +
    `<path d="${canopy}" ${style('none', INK, 1.5)}/>` +
    `<path d="M12 31 C14 24 19 19 24 17" ${style('none', '#fff', 1.4, ';opacity:0.7')}/>`
  );
}

// ----------------------------------------------------------- seed packets

// A seed packet, kraft paper, sealed and crimped along its top, a sprout
// pictured on it coming up out of the soil, and its number big below, as a
// grave has its number.
function packet(number) {
  const crimps = Array.from({ length: 9 }, (_, k) => `M${n(14.5 + k * 3.9)} 21.6 V26`).join(' ');
  return (
    `<rect x="11" y="19" width="38" height="53" rx="2" ${style(KRAFT, INK, 1.4)}/>` +
    `<rect x="11" y="19" width="38" height="8.6" rx="2" ${style(DEEP_KRAFT, INK, 1.2)}/>` +
    `<path d="${crimps}" ${style('none', SEED_INK, 0.8, ';opacity:0.6')}/>` +
    `<rect x="16" y="31" width="28" height="19" rx="3" ${style('#e6f4d6', SEED_INK, 0.9)}/>` +
    `<path d="M16.5 47 C21 43.5 39 43.5 43.5 47 V47.6 C43.5 49 42.8 49.6 41.4 49.6 H18.6 C17.2 49.6 16.5 49 16.5 47.6 Z" ${style(SOIL)}/>` +
    `<path d="M30 45 V38" ${style('none', STEM, 1.3)}/>` +
    `<path d="M30 39 C26 39 23 37 22 34 C26 33.4 29 35.4 30 39 Z M30 38 C34 38 37 36 38 33 C34 32.4 31 34.4 30 38 Z" ${style(SPROUT, INK, 0.8)}/>` +
    `<text x="30" y="67" text-anchor="middle" style="fill:${SEED_INK};font:700 17px Georgia,'Times New Roman',serif">${number}</text>`
  );
}

// ------------------------------------------------------------ butterflies

// Each butterfly's look: its wings' colour and their edge's, and what marks
// them, drawn on the left wings and mirrored on the right.
const BUTTERFLIES = {
  // A monarch: orange, its veins and border black, white dots in the border.
  'new-moon': {
    wing: '#f28a1d',
    marks:
      `<path d="M28 40 C21 36 14 30 9 24 M27.5 41 C21 40 13 37 7 31 M28 44 C22 47 17 51 14 57 M28 46 C25 51 23 56 21 61" ${style('none', DARK, 0.9)}/>` +
      `<path d="M6.4 24 C4.6 28 5 32.5 7 36 C9 39.6 13 42 18 43.4" ${style('none', DARK, 2.8)}/>` +
      [[6.2, 28], [6.8, 32.6], [9.2, 36.6], [13, 39.8], [8, 24.8]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.75" ${style('#fff')}/>`).join(''),
  },
  // A swallowtail: yellow, striped black, its hindwings tailed, with a blue
  // spot by the tail.
  'waxing-moon': {
    wing: '#ffd640',
    tail: true,
    marks:
      `<path d="M23 29 C20 30 18 34 18.5 38.6 M16.5 26 C13.5 28 12 32 13 37 M11 24 C8.4 26 7 29.4 7.6 33" ${style('none', DARK, 2)}/>` +
      `<path d="M6.4 24 C4.6 28 5 32.5 7 36 C9 39.6 13 42 18 43.4" ${style('none', DARK, 2)}/>` +
      `<circle cx="20" cy="60" r="1.7" ${style('#4d7be8', DARK, 0.6)}/>`,
  },
  // A spring azure: pale blue, deeper toward its body, edged in grey.
  'full-moon': {
    wing: '#a9cfff',
    marks: `<path d="M28.6 40 C24 37 21 34 19.5 30 C23 32 26 35 28.6 38 Z M28.6 45 C25 46.5 22 49 20.5 52.5 C24 51.6 27 49 28.6 46.6 Z" ${style('#5f95e6')}/>`,
    edge: '#6a7a92',
  },
  // A cabbage white: white, its forewings tipped black, with a black spot.
  'waning-moon': {
    wing: PAPER,
    marks:
      `<path d="M8 22.4 C5.4 22.6 4.4 25.6 5.4 29.4 C8 28.6 10.6 26.4 12 23.2 C10.6 22.5 9.3 22.3 8 22.4 Z" ${style(DARK)}/>` +
      `<circle cx="16.5" cy="32.4" r="1.9" ${style(DARK)}/>`,
  },
};

// A butterfly seen from above, its wings spread: forewings and hindwings
// round a dark body, with its feelers.
function butterfly(key) {
  const { wing, marks, tail = false, edge = INK } = BUTTERFLIES[key];
  const fore = 'M29 40 C24 30 16 22 8.4 22 C5 22 4 26 5.6 31.6 C8 39.6 17.6 44 29 42.4 Z';
  const hind = tail
    ? 'M29 43.4 C20 44.6 12.6 48.6 12.6 56 C12.6 59.4 14.4 61.6 17 61.2 L15.4 68.6 L19.6 61.6 C24.4 60 28.4 52 29 45.2 Z'
    : 'M29 43.4 C20 44.6 12.6 48.6 12.6 56 C12.6 62 18 64.4 23 60.4 C27 57 29 51 29 45.2 Z';
  const half = `<path d="${hind}" ${style(wing, edge, 1.2)}/><path d="${fore}" ${style(wing, edge, 1.2)}/>${marks}`;
  return (
    half +
    `<g transform="matrix(-1 0 0 1 60 0)">${half}</g>` +
    `<path d="M29 31 C27 25 24.5 21 21.4 19 M31 31 C33 25 35.5 21 38.6 19" ${style('none', INK, 0.9)}/>` +
    `<circle cx="21.4" cy="19" r="1.2" ${style(INK)}/><circle cx="38.6" cy="19" r="1.2" ${style(INK)}/>` +
    `<ellipse cx="30" cy="45" rx="2.2" ry="12.5" ${style(DARK, INK, 0.8)}/>` +
    `<circle cx="30" cy="32" r="2.6" ${style(DARK, INK, 0.8)}/>`
  );
}

// ------------------------------------------------------- everything else

// A rain boot, toe to the left, its heel at x: its tall shaft, its foot
// and its sole, the light catching its shaft.
function boot(x) {
  const shape = `M${x + 6} 22 H${x + 21} V61 C${x + 21} 66.5 ${x + 19} 68.6 ${x + 15} 68.6 H${x - 3} C${x - 7.4} 68.6 ${x - 9} 65.4 ${x - 8} 62.4 C${x - 7} 59.4 ${x - 2} 57.4 ${x + 6} 56.4 Z`;
  return (
    `<path d="${shape}" ${style(BOOT, INK, 1.4)}/>` +
    `<path d="M${x - 8.6} 64.6 C${x - 8.4} 67.2 ${x - 6.4} 68.6 ${x - 3} 68.6 H${x + 15} C${x + 19} 68.6 ${x + 21} 66.5 ${x + 21} 64.6 Z" ${style(DARK, INK, 1)}/>` +
    `<rect x="${x + 5}" y="20.4" width="17" height="5.2" rx="1.6" ${style(DEEP_BOOT, INK, 1.2)}/>` +
    `<path d="M${x + 10} 29 V52" ${style('none', '#fff', 2, ';opacity:0.55')}/>`
  );
}

// A sprig of lilac florets, a cone of them, at the top of its stem.
function lilacCone() {
  const florets = [];
  for (let row = 0; row < 9; row++) {
    const y = 14.5 + row * 4.1;
    const half = Math.min(2 + row * 1.9, 13.5 - Math.max(0, row - 6) * 2.4);
    const count = Math.max(1, Math.round((half * 2) / 4.6) + 1);
    for (let k = 0; k < count; k++) {
      const x = count === 1 ? 30 : 30 - half + (k * half * 2) / (count - 1) + (row % 2 ? 0.8 : -0.8);
      florets.push([n(x), n(y), (row + k) % 3 === 0]);
    }
  }
  return florets
    .map(([x, y, pale]) => `<circle cx="${x}" cy="${y}" r="2.7" ${style(pale ? PALE_LILAC : LILAC, DEEP_LILAC, 0.6)}/><circle cx="${x}" cy="${y}" r="0.7" ${style('#f7f0ff')}/>`)
    .join('');
}

// A lily of the valley's bell, hanging, its mouth scalloped, at (x, y).
const bell = (x, y, s = 1) =>
  `<path d="M${n(x - 3.1 * s)} ${n(y + 2.2 * s)} C${n(x - 3.3 * s)} ${n(y - 2 * s)} ${n(x - 2 * s)} ${n(y - 3.6 * s)} ${x} ${n(y - 3.6 * s)} C${n(x + 2 * s)} ${n(y - 3.6 * s)} ${n(x + 3.3 * s)} ${n(y - 2 * s)} ${n(x + 3.1 * s)} ${n(y + 2.2 * s)} ` +
  `L${n(x + 3.9 * s)} ${n(y + 3.6 * s)} L${n(x + 1.9 * s)} ${n(y + 3 * s)} L${x} ${n(y + 4 * s)} L${n(x - 1.9 * s)} ${n(y + 3 * s)} L${n(x - 3.9 * s)} ${n(y + 3.6 * s)} Z" ${style(PAPER, INK, 0.8)}/>`;

const ART = {
  // A duckling, yellow, afloat on a puddle in the rain, facing left.
  vampire: () =>
    [[48, 20], [54, 31], [9, 19], [37, 15]].map(([x, y]) => `<path d="${drop(x, y, 2.6)}" ${style(RAIN, INK, 0.6)}/>`).join('') +
    `<ellipse cx="31" cy="65" rx="26" ry="6.6" ${style(PUDDLE, INK, 1.1)}/>` +
    `<path d="M14.5 54 C14.5 46 22.4 43.2 31 44 C39 44.6 45 46 49.6 42.6 C52.8 40.4 55.4 43.2 54.4 47.6 C53 57.6 45.4 64 33 64 C22.6 64 14.5 61 14.5 54 Z" ${style(DUCK, INK, 1.4)}/>` +
    `<path d="M29 50.4 C34 47 43 46.8 46.6 51 C42.6 56.6 34.6 57.4 29 54 Z" ${style(DEEP_DUCK, INK, 1)}/>` +
    `<circle cx="24" cy="33" r="10" ${style(DUCK, INK, 1.4)}/>` +
    `<path d="M14.8 32.6 C10.6 31.8 7.4 33.4 7 35.8 C9.6 37.6 13.8 37.6 16.6 36.6 Z" ${style(BILL, INK, 1.1)}/>` +
    eye(21.6, 30.4, 1.8) +
    `<path d="M24 23.4 C24.4 20.6 26.6 19.6 28.6 20.4 M24.6 23.2 C26 21 28.6 21 30 22.6" ${style('none', INK, 0.9)}/>` +
    `<path d="M14 64.4 C20 66.4 26 63 32 65 C38 67 44 64 49 65.4" ${style('none', RAIN, 1)}/>`,
  // A frog, green, sitting front on, its eyes up on top, smiling.
  werewolf: () =>
    `<path d="M13 71 C8 63 11 52 19.6 53.6 C24 55 24.4 64 22 71 Z M47 71 C52 63 49 52 40.4 53.6 C36 55 35.6 64 38 71 Z" ${style(DEEP_FROG, INK, 1.2)}/>` +
    `<path d="M17 51 C17 41 22.6 35.6 30 35.6 C37.4 35.6 43 41 43 51 C43 63 37.6 70.4 30 70.4 C22.4 70.4 17 63 17 51 Z" ${style(FROG, INK, 1.4)}/>` +
    `<ellipse cx="30" cy="57.6" rx="8.4" ry="10" ${style(PALE_FROG)}/>` +
    `<path d="M22.6 66 C21 69 19 70.6 16.4 71.4 M22.6 66 C22.2 69.4 21.4 71 20.4 72.4 M37.4 66 C39 69 41 70.6 43.6 71.4 M37.4 66 C37.8 69.4 38.6 71 39.6 72.4" ${style('none', DEEP_FROG, 1.8)}/>` +
    `<path d="M9.6 37 C9.6 28 18.6 23.4 30 23.4 C41.4 23.4 50.4 28 50.4 37 C50.4 44.6 41.4 47.6 30 47.6 C18.6 47.6 9.6 44.6 9.6 37 Z" ${style(FROG, INK, 1.4)}/>` +
    `<circle cx="19.6" cy="23.6" r="6.4" ${style(FROG, INK, 1.3)}/><circle cx="40.4" cy="23.6" r="6.4" ${style(FROG, INK, 1.3)}/>` +
    `<circle cx="19.6" cy="23.6" r="4.1" ${style(PAPER, INK, 0.8)}/><circle cx="40.4" cy="23.6" r="4.1" ${style(PAPER, INK, 0.8)}/>` +
    eye(20.4, 24, 2.2) +
    eye(39.6, 24, 2.2) +
    `<path d="M18.6 37.6 Q30 46 41.4 37.6" ${style('none', DARK, 1.4)}/>` +
    `<circle cx="27" cy="33" r="0.8" ${style(DARK)}/><circle cx="33" cy="33" r="0.8" ${style(DARK)}/>` +
    `<circle cx="14.6" cy="40" r="2.4" ${style('#ff9fb0', 'none', 0, ';opacity:0.6')}/><circle cx="45.4" cy="40" r="2.4" ${style('#ff9fb0', 'none', 0, ';opacity:0.6')}/>`,
  // A snail out in the wet, gliding left, its shell a spiral on its back,
  // its eyes up on their stalks.
  mummy: () =>
    `<path d="M7 67 C7 63.4 10.6 61.4 15 61 L17.4 46.6 C18 41.6 22.6 39.4 25.4 42.4 C26.8 45.4 26 51.4 26.6 58.6 L48 60.4 C53.4 61.2 55.6 64.4 54.6 67.6 C40 69.6 20.4 69.6 7 67 Z" ${style(SNAIL, INK, 1.3)}/>` +
    `<path d="M20.6 42.6 L15.4 30.6 M23.6 41.6 L24.4 28.4" ${style('none', INK, 1.4)}/>` +
    `<path d="M20.6 42.6 L15.4 30.6 M23.6 41.6 L24.4 28.4" ${style('none', SNAIL, 0.6)}/>` +
    eye(15.4, 30.2, 2) +
    eye(24.4, 28, 2) +
    `<path d="M17 52.6 Q19.6 55 22.4 52.8" ${style('none', DARK, 1.1)}/>` +
    `<circle cx="38.6" cy="46" r="15.4" ${style(SHELL, INK, 1.4)}/>` +
    `<path d="${spiral(38.6, 46.6, 2.6, 13.2, 1.2)}" ${style('none', DEEP_SHELL, 1.6)}/>` +
    `<path d="M31 37 C33 34.6 36 33.6 39 33.6" ${style('none', '#fff', 1.4, ';opacity:0.6')}/>`,
  // An earthworm, pink, up out of the wet soil, curling, with its rings,
  // and smiling.
  zombie: () => {
    const body = 'M27 66 C24 56 35.6 52.4 36.6 43 C37.4 35.4 31.6 30.4 25.6 31.6';
    return (
      [[13, 22], [46, 20], [50, 34]].map(([x, y]) => `<path d="${drop(x, y, 2.6)}" ${style(RAIN, INK, 0.6)}/>`).join('') +
      `<path d="${body}" ${style('none', INK, 10)}/>` +
      `<path d="${body}" ${style('none', WORM, 7.6)}/>` +
      `<path d="M26.6 64 C24.6 56 35.4 52.4 36.4 43.6 C37 37.6 33.4 33.4 29 32.4" ${style('none', DEEP_WORM, 7.2, ';stroke-linecap:butt;stroke-dasharray:1.1 3.4')}/>` +
      `<circle cx="23.6" cy="31.6" r="6.2" ${style(WORM, INK, 1.3)}/>` +
      eye(21.4, 30, 1.4) +
      eye(26, 30.4, 1.4) +
      `<path d="M20.6 34 Q23 36.4 25.8 34.4" ${style('none', DARK, 1)}/>` +
      `<path d="M5 73 C9 64 18 60.6 30 60.6 C42 60.6 51 64 55 73 Z" ${style(SOIL, INK, 1.3)}/>` +
      [[16, 68], [24, 65], [37, 66.4], [44, 69.4], [31, 70.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.9" ${style('#5e3a1e')}/>`).join('')
    );
  },
  // Red rain boots, a pair of wellies standing side by side.
  lantern: () => boot(29.5) + boot(12),
  // A watering can, green, its handle arched over it and its spout raised
  // to the rose, sprinkling.
  brew: () =>
    [[56, 40], [52, 46], [57.4, 50], [53, 56]].map(([x, y]) => `<path d="${drop(x, y, 2.2)}" ${style(RAIN, INK, 0.6)}/>`).join('') +
    `<path d="M36 60 L50.4 33" ${style('none', INK, 6.2)}/>` +
    `<path d="M36 60 L50.4 33" ${style('none', CAN, 4)}/>` +
    `<ellipse cx="51.6" cy="30.6" rx="4.6" ry="2.6" transform="rotate(-35 51.6 30.6)" ${style(DEEP_CAN, INK, 1.2)}/>` +
    `<path d="M13 39 C13 24 37 24 37 39" ${style('none', INK, 5)}/>` +
    `<path d="M13 39 C13 24 37 24 37 39" ${style('none', CAN, 3)}/>` +
    `<path d="M8.6 39 H41.4 L40 68 C40 70 38.6 71 36.6 71 H13.4 C11.4 71 10 70 10 68 Z" ${style(CAN, INK, 1.4)}/>` +
    `<path d="M8.6 39 H41.4 V43.6 H8.6 Z" ${style(DEEP_CAN, INK, 1.1)}/>` +
    `<path d="M10.4 62 H39.6" ${style('none', DEEP_CAN, 1.6)}/>` +
    `<path d="M15 48 V58" ${style('none', '#fff', 2, ';opacity:0.5')}/>`,
  // A paper boat, white, folded from a page, afloat on a puddle.
  ghost: () =>
    `<path d="M3.6 64 C11 60.4 17 67.6 25 64 C33 60.4 39 67.6 47 64 C51 62.2 54 62.4 56.4 63.4 V72 C40 74 20 74 3.6 72 Z" ${style(PUDDLE, INK, 1.1)}/>` +
    `<path d="M18 50 L30 21 L42 50 Z" ${style(PAPER, INK, 1.4)}/>` +
    `<path d="M30 21 V50" ${style('none', INK, 0.9)}/>` +
    `<path d="M7 49.6 H53 L44.4 64.4 H15.6 Z" ${style(PAPER, INK, 1.4)}/>` +
    `<path d="M16.6 49.6 L30 57.4 L43.4 49.6" ${style('none', INK, 0.9)}/>` +
    `<path d="M21 41.6 L29 41.6 M21.8 46 L29 46 M32 39 L38 39" ${style('none', '#9aa7c4', 0.8)}/>`,
  // Lily of the valley: little white bells hanging along an arching stem,
  // over two broad leaves.
  nightshade: () =>
    `<path d="M24.6 74 C13 62 12.4 42 18.6 29 C25.6 41 28.6 58 27.4 74 Z" ${style(LEAF, INK, 1)}/>` +
    `<path d="M35 74 C45.6 62 47 45 43.6 33 C37 44 33 59 32.6 74 Z" ${style('#4ea366', INK, 1)}/>` +
    `<path d="M22 66 C18 56 18.4 42 19.6 33 M38 66 C42 56 43.4 44 43 37" ${style('none', '#2b6e40', 0.8)}/>` +
    `<path d="M29.4 74 C29 58 28.4 40 31.4 29 C34 20.6 41 16.6 48.6 18.4" ${style('none', STEM, 1.6)}/>` +
    [[30.8, 33.4, 31, 40], [33.6, 25.6, 35.4, 32], [38.6, 20.6, 41.4, 27.4], [44, 18.4, 47.6, 25.4]]
      .map(([sx, sy, bx, by]) => `<path d="M${sx} ${sy} Q${n((sx + bx) / 2 + 1.4)} ${n(sy + 1)} ${bx} ${n(by - 4.2)}" ${style('none', STEM, 0.9)}/>` + bell(bx, by, 1.25))
      .join('') +
    `<ellipse cx="49.6" cy="21.4" rx="1.6" ry="2.2" ${style('#e8f4dc', INK, 0.7)}/>`,
  // Lilac: a cone of little purple florets, over its heart-shaped leaves.
  foxglove: () =>
    `<path d="M30 74 V50" ${style('none', STEM, 2.2)}/>` +
    `<path d="M30 66 C24 66 16 63 13 55 C16 52 24 53 30 60 Z M30 62 C36 62 44 59 47 51 C44 48 36 49 30 56 Z" ${style(LEAF, INK, 0.9)}/>` +
    `<path d="M30 63.6 C24 61.6 19 59 15.6 55.6 M30 59.6 C36 57.6 41 55 44.4 51.6" ${style('none', '#2b6e40', 0.7)}/>` +
    lilacCone(),
  // An iris, blue-violet: three falls drooping, each with a yellow beard,
  // and three standards upright, over its sword-shaped leaves.
  hemlock: () =>
    `<path d="M17 74 C17 62 18.6 52 23 44 C23 54 22.6 64 23.4 74 Z M43 74 C43 62 41.6 52 37.4 45 C37.6 55 37.6 64 36.6 74 Z" ${style(LEAF, INK, 0.9)}/>` +
    `<path d="M30 74 V42" ${style('none', STEM, 2.2)}/>` +
    `<path d="M29 34 C22 32 17 26 19.4 19 C24.6 21.6 28 27 29 34 Z M31 34 C38 32 43 26 40.6 19 C35.4 21.6 32 27 31 34 Z" ${style(IRIS, INK, 1)}/>` +
    `<path d="M30 35 C25.6 29 25.4 19 30 12 C34.6 19 34.4 29 30 35 Z" ${style('#7a7ef0', INK, 1.1)}/>` +
    `<path d="M28.4 36 C21 33.4 12.4 36.6 12.4 44 C13.6 49.6 21.4 47.6 28.4 39.6 Z M31.6 36 C39 33.4 47.6 36.6 47.6 44 C46.4 49.6 38.6 47.6 31.6 39.6 Z" ${style(IRIS, INK, 1.1)}/>` +
    `<path d="M30 37 C26.4 42.6 26.4 50 30 55 C33.6 50 33.6 42.6 30 37 Z" ${style(DEEP_IRIS, INK, 1)}/>` +
    `<path d="M26 38.6 C22 39.6 18.6 41.6 16.4 44 M34 38.6 C38 39.6 41.4 41.6 43.6 44 M30 40 V49" ${style('none', '#ffcf33', 1.6)}/>`,
  // A peony, pink and full, its petals ruffled round and round, over its
  // leaves.
  wolfsbane: () =>
    `<path d="M30 74 V52" ${style('none', STEM, 2.2)}/>` +
    `<path d="M30 68 C23 68 16 64.6 13.4 58 C18.6 55.6 25 57.6 30 63 Z M30 64 C37 64 44 60.6 46.6 54 C41.4 51.6 35 53.6 30 59 Z" ${style(LEAF, INK, 0.9)}/>` +
    Array.from({ length: 9 }, (_, k) => `<ellipse cx="30" cy="20.6" rx="7.4" ry="11" transform="rotate(${k * 40} 30 33)" ${style(PEONY, INK, 1)}/>`).join('') +
    Array.from({ length: 7 }, (_, k) => `<ellipse cx="30" cy="25.4" rx="6" ry="8" transform="rotate(${k * (360 / 7) + 20} 30 33)" ${style(PALE_PEONY, DEEP_PEONY, 0.9)}/>`).join('') +
    `<circle cx="30" cy="33" r="7.6" ${style(PEONY, DEEP_PEONY, 1)}/>` +
    `<path d="M24.4 33 C25.4 28.6 29 27 31.6 28.6 M35.6 33.6 C34.6 37.6 30.4 39 27.6 37 M27 31.6 C28.6 30.6 31 31 32 33" ${style('none', DEEP_PEONY, 1.1)}/>`,
  // A wilted flower: its stem bent over, its head hanging, its petals faded
  // and falling, its leaves drooping.
  'lost-soul': () =>
    `<path d="M31 74 C31 60 32.6 44 31.6 34 C30.6 24 24 19.4 18.6 23 C16 25 15.4 28.4 16.4 31.4" ${style('none', BROWN, 2.2)}/>` +
    `<path d="M31.4 58 C25 57 19.4 60 16 66.6 C21.6 66.4 27.4 63.6 31.4 60 Z M31.8 50 C38 49.4 43 52.6 45.4 59 C40 58.6 35 55.6 31.8 52 Z" ${style(DRY_LEAF, INK, 0.9)}/>` +
    `<path d="M17 31.6 C12 33 9.4 38.6 10.4 44.6 C14 43 16.4 38.4 17 31.6 Z M17.6 32 C16.6 37.6 17.6 43.6 21 47.4 C22.6 43 21.6 37 17.6 32 Z M18 31.4 C21.6 34 24.4 39.6 24.4 45 C20.4 43 18.4 37.6 18 31.4 Z" ${style(WILTED, INK, 1)}/>` +
    `<ellipse cx="17.2" cy="30.6" rx="3" ry="2.4" ${style(BROWN, INK, 0.8)}/>` +
    `<ellipse cx="40" cy="71.4" rx="3.6" ry="1.6" transform="rotate(-15 40 71.4)" ${style(WILTED, INK, 0.8)}/>` +
    `<ellipse cx="47.6" cy="69.6" rx="3" ry="1.4" transform="rotate(20 47.6 69.6)" ${style(WILTED, INK, 0.8)}/>`,
};
