import { INK, PAPER, DARK, LEAF, PIPS, STICKS, style, n } from './draw.js';

// The turtle's own set of faces, a turtle's pond, which the turtle wears
// whatever holiday is chosen, as it can be played any time: the same 43
// faces as Halloween's, matching just as those do. The eyes are lily pads,
// the one a great pad with a water lily open on it; the bones reeds, each
// topped with its brown cattail, the one a dragonfly perched on a reed; and
// the graves turtle shells, each with its number on its middle scute. The
// four monsters, which stand for the winds, are four turtles: a sea turtle,
// a box turtle, a snapping turtle and a tortoise. The jack-o'-lantern, the
// witch's brew and the ghost, where a set's red, green and white dragons
// stand, are a koi, a frog on a lily pad and an egret. The poison garden is
// the pond's flowers, a water lily, a lotus, a marsh marigold and a water
// hyacinth, and the moons are pond shells, a pond snail's, a ramshorn's, a
// mussel's and a clam's, any two of which match, as any two flowers and any
// two moons do; and the lost soul is a shy turtle, tucked into his shell.
// Drawn as faces.js draws Halloween's, on a tile 60 by 80, whole: faces.js
// shrinks a drawing to make room for its index.

const NUMBERS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const SUITS = { eyes: 'Lily pads', bones: 'Reeds', graves: 'Shells' };

// Each face's name, by its key in tiles.js, and the kinds' that have more
// than one face.
const names = {
  vampire: 'Sea turtle',
  werewolf: 'Box turtle',
  mummy: 'Snapping turtle',
  zombie: 'Tortoise',
  lantern: 'Koi',
  brew: 'Frog',
  ghost: 'Egret',
  nightshade: 'Water lily',
  foxglove: 'Lotus',
  hemlock: 'Marsh marigold',
  wolfsbane: 'Water hyacinth',
  'new-moon': 'Pond snail',
  'waxing-moon': 'Ramshorn',
  'full-moon': 'Mussel',
  'waning-moon': 'Clam',
  'lost-soul': 'Shy turtle',
};
for (const [suit, title] of Object.entries(SUITS)) NUMBERS.forEach((number, k) => (names[`${suit}-${k + 1}`] = `${number} of ${title}`));
const kinds = { flower: 'Pond flower', moon: 'Pond shell' };

function draw(f) {
  if (f.group === 'eyes') return f.index === '1' ? bigPad() : PIPS[f.index].map((p) => pad(...p)).join('');
  if (f.group === 'bones') return f.index === '1' ? dragonfly() : STICKS[f.index].map((s) => reed(...s)).join('');
  if (f.group === 'graves') return shell(f.index);
  if (f.group === 'moon') return pondShell(f.key);
  return ART[f.key]();
}

export const TURTLE_FACES = { draw, names, kinds };

const PAD = '#4fae4a';
const DEEP_PAD = '#2f7a33';
const WATER = '#bfe3ea';
const LILY = '#ffd0e0';
const DEEP_LILY = '#e88aab';
const REED = '#5c9b3c';
const CATTAIL = '#7a4a24';
const SHELL = '#8c7a3e';
const SCUTE = '#b7a45a';
const SHELL_EDGE = '#5a4b22';
const SEA = '#4d9a8a';
const BOX = '#7a5a2c';
const BOX_MARK = '#e8c14a';
const SNAP = '#5d5a3e';
const TORTOISE = '#b08a4e';
const KOI = '#f06a2a';
const FROG = '#6cc24a';
const EGRET = PAPER;
const BILL = '#f2c230';
const STEM = '#2f7d4a';
const GOLD = '#ffcf33';

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

// ------------------------------------------------------------- lily pads

// A lily pad's outline: round, its notch a slit from its edge to its
// middle, at (cx, cy), r its radius.
function padPath(cx, cy, r) {
  const a = 0.32; // the notch's half angle, in radians, opening at the top right
  const at = (t) => `${n(cx + r * Math.cos(t))} ${n(cy + r * Math.sin(t))}`;
  return `M${n(cx)} ${n(cy)} L${at(-Math.PI / 3 + a)} A${n(r)} ${n(r)} 0 1 1 ${at(-Math.PI / 3 - a)} Z`;
}

// A lily pad where a pip stands, green, its veins fanning from its middle;
// the middle one of the five and the nine with a pink bud on it, as a dots
// tile's middle dot is red.
function pad(cx, cy, r, middle = false) {
  const R = r * 1.02;
  const veins = [0.6, 1.6, 2.6, 3.6, 4.6].map((t) => `M${n(cx)} ${n(cy)} L${n(cx + R * 0.8 * Math.cos(t))} ${n(cy + R * 0.8 * Math.sin(t))}`).join(' ');
  return (
    `<path d="${padPath(cx, cy, R)}" ${style(PAD, INK, n(Math.max(0.8, r / 8)))}/>` +
    `<path d="${veins}" ${style('none', DEEP_PAD, n(Math.max(0.5, r / 14)))}/>` +
    (middle ? `<ellipse cx="${n(cx - r * 0.1)}" cy="${n(cy + r * 0.05)}" rx="${n(r * 0.3)}" ry="${n(r * 0.42)}" ${style(LILY, INK, n(Math.max(0.6, r / 12)))}/>` : '')
  );
}

// A water lily open, its petals pointed, round a golden middle, at (cx, cy).
function waterLily(cx, cy, s, colour = LILY, deep = DEEP_LILY) {
  const petal = (deg, len, w) => `<path d="M${cx} ${cy} Q${n(cx - w * s)} ${n(cy - len * s * 0.55)} ${cx} ${n(cy - len * s)} Q${n(cx + w * s)} ${n(cy - len * s * 0.55)} ${cx} ${cy} Z" transform="rotate(${deg} ${cx} ${cy})" ${style(colour, deep, 0.8)}/>`;
  return (
    [-80, -40, 40, 80, -120, 120].map((d) => petal(d, 9, 3.4)).join('') +
    [-50, -15, 15, 50].map((d) => petal(d, 10.5, 3.2)).join('') +
    `<circle cx="${cx}" cy="${n(cy - 1)}" r="${n(2.6 * s)}" ${style(GOLD, '#c9900e', 0.8)}/>`
  );
}

// The one of lily pads: a great pad on the water, a water lily open on it.
function bigPad() {
  return (
    `<ellipse cx="30" cy="63" rx="27" ry="8" ${style(WATER, INK, 1.1)}/>` +
    `<path d="M10 63 C14 61 18 65 22 63 M38 63 C42 61 46 65 50 63" ${style('none', '#6fb7c6', 1)}/>` +
    `<path d="${padPath(30, 47, 21)}" ${style(PAD, INK, 1.5)}/>` +
    `<path d="${[0.5, 1.4, 2.3, 3.2, 4.1, 5.0].map((t) => `M30 47 L${n(30 + 17 * Math.cos(t))} ${n(47 + 17 * Math.sin(t))}`).join(' ')}" ${style('none', DEEP_PAD, 0.9)}/>` +
    waterLily(28, 44, 1.25)
  );
}

// ------------------------------------------------------------------ reeds

// A reed standing where a stick stands, [x, y, length, width]: its green
// stem, a leaf curling from it, and its cattail at the top, brown and
// velvety, its spike above it.
function reed(cx, cy, len, w) {
  const top = cy - len / 2;
  const foot = cy + len / 2;
  const head = len * 0.42; // the cattail's length
  const out = n(Math.max(0.6, w / 8));
  return (
    `<path d="M${cx} ${n(top + head * 0.6)} V${n(foot)}" ${style('none', INK, n(w * 0.46))}/>` +
    `<path d="M${cx} ${n(top + head * 0.6)} V${n(foot)}" ${style('none', REED, n(w * 0.26))}/>` +
    `<path d="M${cx} ${n(foot - len * 0.08)} C${n(cx + w * 0.9)} ${n(foot - len * 0.3)} ${n(cx + w * 0.9)} ${n(foot - len * 0.5)} ${n(cx + w * 0.55)} ${n(foot - len * 0.62)}" ${style('none', REED, n(Math.max(0.7, w * 0.16)))}/>` +
    `<path d="M${cx} ${n(top)} V${n(top + head * 0.25)}" ${style('none', INK, n(Math.max(0.7, w * 0.12)))}/>` +
    `<rect x="${n(cx - w * 0.42)}" y="${n(top + head * 0.18)}" width="${n(w * 0.84)}" height="${n(head)}" rx="${n(w * 0.42)}" ${style(CATTAIL, INK, out)}/>`
  );
}

// The one of reeds: a dragonfly perched on a reed, its four wings spread.
function dragonfly() {
  const wing = (x, y, rx, ry, deg) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${deg} ${x} ${y})" ${style('#e4f6fb', '#6fa9c4', 0.9, ';opacity:0.95')}/>`;
  return (
    `<path d="M40 74 C40 62 39 50 41 34" ${style('none', INK, 2.6)}/><path d="M40 74 C40 62 39 50 41 34" ${style('none', REED, 1.6)}/>` +
    `<rect x="38" y="20" width="6" height="15" rx="3" ${style(CATTAIL, INK, 1.1)}/>` +
    `<path d="M41 20 V14" ${style('none', INK, 1)}/>` +
    wing(19, 36, 11, 3.6, -14) +
    wing(19, 44, 10, 3.4, 12) +
    wing(41, 47, 9, 3.2, -10) +
    wing(40, 54, 8.4, 3, 16) +
    `<path d="M14 45 C22 45 34 48 46 50" ${style('none', INK, 4.4)}/>` +
    `<path d="M14 45 C22 45 34 48 46 50" ${style('none', '#2f86b8', 2.8)}/>` +
    `<circle cx="11.6" cy="44.6" r="3.4" ${style('#2f86b8', INK, 1)}/>` +
    eye(10.6, 43.4, 1.4) +
    `<path d="M24 46.6 L24.6 49.6 M30 47.6 L30.4 50.6 M36 48.8 L36.2 51.6" ${style('none', '#1e5a80', 0.8)}/>`
  );
}

// ----------------------------------------------------------------- shells

// A turtle's shell, seen from above, its scutes round a middle one that
// bears its number, as a grave has its number.
function shell(number) {
  const scutes = 'M30 24 L41 31 L41 47 L30 54 L19 47 L19 31 Z';
  return (
    `<ellipse cx="30" cy="45" rx="20" ry="25" ${style(SHELL, INK, 1.4)}/>` +
    `<path d="M30 20 V24 M41 31 L49 27 M41 47 L49 52 M30 54 V70 M19 47 L11 52 M19 31 L11 27" ${style('none', SHELL_EDGE, 1.1)}/>` +
    `<path d="${scutes}" ${style(SCUTE, SHELL_EDGE, 1.2)}/>` +
    `<text x="30" y="45.5" text-anchor="middle" style="fill:${SHELL_EDGE};font:700 17px Georgia,'Times New Roman',serif">${number}</text>` +
    `<path d="M22 22 C26 20.4 34 20.4 38 22" ${style('none', '#fff', 1.2, ';opacity:0.45')}/>`
  );
}

// ------------------------------------------------------------ pond shells

// Each pond shell, any two of which match.
const POND_SHELLS = {
  // A pond snail's shell: tall and pointed, its whorls wound up to its tip,
  // its mouth open at its foot.
  'new-moon': () =>
    `<path d="M33 14 C38 24 46 40 45 54 C44 65 37 71 29 71 C20 71 15 64 16 55 C17 46 24 36 33 14 Z" ${style('#c8a46a', INK, 1.4)}/>` +
    `<path d="M29.4 24 C33 26.6 36.6 26.6 38.4 25 M24.6 34 C30 37.6 37 37.6 41.4 34.6 M19.6 45 C27 50 37 50 44.4 45.6" ${style('none', '#8a6436', 1.3)}/>` +
    `<path d="M22 56 C20 62 23 68 29 68 C35 68 38 63 36 57 C33 53 25 52 22 56 Z" ${style('#5a3e1e', INK, 1)}/>`,
  // A ramshorn's shell: a flat coil, wound round and round.
  'waxing-moon': () =>
    `<circle cx="30" cy="46" r="20" ${style('#b07c46', INK, 1.4)}/>` +
    `<path d="${spiral(30, 46, 3.2, 18, 0.4)}" ${style('none', '#6e4524', 1.6)}/>` +
    `<path d="M16 34 C20 29 26 27 31 27" ${style('none', '#fff', 1.3, ';opacity:0.5')}/>`,
  // A mussel's shell: long and dark, a blue sheen on it.
  'full-moon': () =>
    `<path d="M14 62 C10 50 16 30 32 22 C42 18 50 22 48 30 C46 44 34 60 22 66 C18 68 15 66 14 62 Z" ${style('#3c4f7a', INK, 1.4)}/>` +
    `<path d="M18 60 C20 48 28 34 40 26 M22 63 C28 52 36 40 44 32" ${style('none', '#7f96c8', 1.1)}/>` +
    `<path d="M24 30 C28 26 33 24 37 24" ${style('none', '#fff', 1.2, ';opacity:0.5')}/>`,
  // A clam's shell: round, ridged, fanning from its hinge.
  'waning-moon': () =>
    `<path d="M30 66 C16 66 10 54 12 42 C14 30 22 24 30 24 C38 24 46 30 48 42 C50 54 44 66 30 66 Z" ${style('#e6d2b0', INK, 1.4)}/>` +
    `<path d="${[-16, -10, -4, 2, 8, 14].map((dx) => `M30 64 Q${n(30 + dx * 0.6)} 46 ${n(30 + dx * 1.2)} 28`).join(' ')}" ${style('none', '#b89668', 1)}/>` +
    `<path d="M24 66 H36 L34 70 H26 Z" ${style('#c9ae84', INK, 1)}/>`,
};
const pondShell = (key) => POND_SHELLS[key]();

// ----------------------------------------------------------------- turtles

// A turtle seen from above: its shell over its four legs, its head and its
// tail, in its shell's colour and its skin's, its scutes marked.
function turtleFromAbove(shellFill, skin, marks = '', flippers = false) {
  const leg = (x, y, deg) =>
    flippers
      ? `<ellipse cx="${x}" cy="${y}" rx="10" ry="3.8" transform="rotate(${deg} ${x} ${y})" ${style(skin, INK, 1.1)}/>`
      : `<ellipse cx="${x}" cy="${y}" rx="5" ry="4" transform="rotate(${deg} ${x} ${y})" ${style(skin, INK, 1.1)}/>`;
  return (
    (flippers ? leg(13, 36, -30) + leg(47, 36, 30) + leg(17, 62, 35) + leg(43, 62, -35) : leg(15, 38, -30) + leg(45, 38, 30) + leg(16, 62, 30) + leg(44, 62, -30)) +
    `<path d="M30 70 L27.6 75 L32.4 75 Z" ${style(skin, INK, 0.9)}/>` +
    `<ellipse cx="30" cy="24" rx="6" ry="7.4" ${style(skin, INK, 1.2)}/>` +
    eye(26.8, 21.6, 1.2) +
    eye(33.2, 21.6, 1.2) +
    `<ellipse cx="30" cy="49" rx="17" ry="21" ${style(shellFill, INK, 1.4)}/>` +
    marks
  );
}

const ART = {
  // A sea turtle, swimming, its flippers out, its shell a sea green with
  // its scutes marked.
  vampire: () =>
    turtleFromAbove(
      SEA,
      '#a7c98a',
      `<path d="M30 30 L38 38 L38 54 L30 62 L22 54 L22 38 Z M30 30 V28 M38 38 L45 34 M38 54 L45 58 M22 38 L15 34 M22 54 L15 58 M30 62 V68" ${style('none', '#2f6a5e', 1.1)}/>`,
      true,
    ),
  // A box turtle, its shell domed and dark, a starburst of gold on each
  // scute.
  werewolf: () =>
    turtleFromAbove(
      BOX,
      '#c48a4a',
      `<path d="M30 30 L38 38 L38 54 L30 62 L22 54 L22 38 Z" ${style('none', '#4a3418', 1.1)}/>` +
        [[30, 46], [30, 34], [30, 58], [20, 42], [40, 42], [20, 56], [40, 56]].map(([x, y]) => `<path d="M${x} ${y - 3} L${x} ${y + 3} M${x - 3} ${y} L${x + 3} ${y} M${x - 2} ${y - 2} L${x + 2} ${y + 2} M${x + 2} ${y - 2} L${x - 2} ${y + 2}" ${style('none', BOX_MARK, 0.9)}/>`).join(''),
    ),
  // A snapping turtle, his shell rugged and ridged, his head big and his
  // beak hooked, seen from the side.
  mummy: () =>
    `<path d="M10 58 C10 40 22 32 34 32 C46 32 52 42 52 56 Z" ${style(SNAP, INK, 1.4)}/>` +
    `<path d="M16 46 L19 41 L22 45 L26 38 L29 43 L33 36 L36 42 L40 37 L43 43 L46 40 L48 47" ${style('none', '#3a3824', 1.2)}/>` +
    `<path d="M8 58 H54 V61 H8 Z" ${style('#7d7a52', INK, 1.1)}/>` +
    `<path d="M14 61 L12 68 L17 68 L19 61 Z M44 61 L42 68 L47 68 L49 61 Z" ${style('#8a8a5a', INK, 1.1)}/>` +
    `<path d="M52 56 L58 62 L55 63 Z" ${style('#8a8a5a', INK, 0.9)}/>` +
    `<path d="M10 52 C4 50 1 46 2.6 42 C4 38 10 38 13 42 C14.6 44.6 13.6 49 10 52 Z" ${style('#8a8a5a', INK, 1.2)}/>` +
    `<path d="M2.6 43.6 L1 46.6 L4 45.6" ${style('none', INK, 1.1)}/>` +
    eye(7.4, 42.4, 1.3),
  // A tortoise, his shell high and domed, on his sturdy legs, plodding
  // left, slow and steady.
  zombie: () =>
    `<path d="M14 60 C14 38 24 26 34 26 C46 26 54 38 54 60 Z" ${style(TORTOISE, INK, 1.4)}/>` +
    `<path d="M24 31 L24 60 M34 26.6 V60 M44 31 L44 60 M15 46 H53" ${style('none', '#7a5a2c', 1.2)}/>` +
    [[19, 39], [29, 37], [39, 37], [49, 41], [19, 53], [29, 53], [39, 53], [49, 53]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" ${style('#d6b47a')}/>`).join('') +
    `<path d="M12 60 H56 V63 H12 Z" ${style('#c9a26a', INK, 1.1)}/>` +
    `<path d="M17 63 V71 H23 V63 Z M45 63 V71 H51 V63 Z" ${style('#a89070', INK, 1.1)}/>` +
    `<path d="M14 52 C8 52 4 48 4 43 C4 38 8 35 12 36 C16 37 18 41 17 46 Z" ${style('#a89070', INK, 1.2)}/>` +
    eye(8.6, 42, 1.3) +
    `<path d="M5 46 Q7.4 47.6 9.6 46.6" ${style('none', DARK, 0.9)}/>`,
  // A koi, orange-red and white, curving through the water.
  lantern: () =>
    `<path d="M14 66 C8 58 8 46 14 38 C20 30 32 26 40 28 C48 30 52 38 48 44 C44 50 34 48 30 54 C26 60 26 66 22 70 C19 72 16 70 14 66 Z" ${style(KOI, INK, 1.4)}/>` +
    `<path d="M22 40 C26 36 32 36 36 40 C34 44 28 46 22 44 Z M18 56 C20 52 24 52 26 56 C24 60 20 60 18 56 Z" ${style(PAPER)}/>` +
    `<path d="M14 66 C8 70 6 76 10 78 C12 74 16 72 20 72 C18 70 16 68 14 66 Z" ${style('#ff9a5a', INK, 1.1)}/>` +
    `<path d="M40 28 C44 20 52 18 54 22 C50 24 47 27 46 31 Z" ${style('#ff9a5a', INK, 1)}/>` +
    eye(44.6, 34, 1.5) +
    `<path d="M49.6 37 C51.6 38 53 40 53 42" ${style('none', INK, 0.9)}/>`,
  // A frog, green, sitting on a lily pad on the water.
  brew: () =>
    `<ellipse cx="30" cy="68" rx="27" ry="6" ${style(WATER, INK, 1)}/>` +
    `<path d="${padPath(30, 64, 18)}" transform="matrix(1 0 0 0.42 0 37.1)" ${style(PAD, INK, 1.3)}/>` +
    `<path d="M15 60 C11 54 14 46 20 47 C23 48 23 54 22 60 Z M45 60 C49 54 46 46 40 47 C37 48 37 54 38 60 Z" ${style('#3f8f2e', INK, 1.1)}/>` +
    `<path d="M18 50 C18 40 23 35 30 35 C37 35 42 40 42 50 C42 58 37 62 30 62 C23 62 18 58 18 50 Z" ${style(FROG, INK, 1.4)}/>` +
    `<ellipse cx="30" cy="53" rx="7" ry="7.4" ${style('#d8f2a8')}/>` +
    `<circle cx="23" cy="35" r="5" ${style(FROG, INK, 1.2)}/><circle cx="37" cy="35" r="5" ${style(FROG, INK, 1.2)}/>` +
    `<circle cx="23" cy="35" r="3" ${style(PAPER, INK, 0.7)}/><circle cx="37" cy="35" r="3" ${style(PAPER, INK, 0.7)}/>` +
    eye(23.4, 35.4, 1.7) +
    eye(36.6, 35.4, 1.7) +
    `<path d="M22.6 44.6 Q30 50.6 37.4 44.6" ${style('none', DARK, 1.2)}/>`,
  // An egret, white, standing on one leg in the shallows, his long neck
  // curved and his bill yellow.
  ghost: () =>
    `<path d="M8 72 C16 69 24 74 32 71 C40 68 46 73 54 70" ${style('none', '#6fb7c6', 1.2)}/>` +
    `<path d="M33 52 L33 71 M33 62 L28 58" ${style('none', '#3a3a3a', 1.3)}/>` +
    `<path d="M20 44 C20 36 28 32 36 34 C44 36 48 44 46 50 C44 55 36 56 30 54 C24 53 20 50 20 44 Z" ${style(EGRET, INK, 1.4)}/>` +
    `<path d="M44 50 C50 54 52 58 50 60 C47 58 44 55 42 52 Z" ${style(EGRET, INK, 1)}/>` +
    `<path d="M24 40 C20 32 18 24 22 18 C24 15 28 15 30 18" ${style('none', INK, 4.4)}/>` +
    `<path d="M24 40 C20 32 18 24 22 18 C24 15 28 15 30 18" ${style('none', EGRET, 2.8)}/>` +
    `<ellipse cx="29" cy="18" rx="4" ry="3.2" ${style(EGRET, INK, 1.1)}/>` +
    `<path d="M32 17 L44 19.6 L32 20 Z" ${style(BILL, INK, 0.9)}/>` +
    eye(29.6, 17.4, 0.9),
  // A water lily, pink, open on its pad.
  nightshade: () =>
    `<ellipse cx="30" cy="62" rx="26" ry="9" ${style(WATER, INK, 1)}/>` +
    `<path d="${padPath(26, 60, 16)}" transform="matrix(1 0 0 0.5 0 30)" ${style(PAD, INK, 1.2)}/>` +
    waterLily(31, 54, 1.7),
  // A lotus, pink, raised on its stem over the water, its seed pod in its
  // middle.
  foxglove: () =>
    `<path d="M30 74 V46" ${style('none', STEM, 2.2)}/>` +
    `<path d="M30 70 C22 70 12 66 10 60 C18 58 26 62 30 66 Z" ${style(PAD, INK, 1)}/>` +
    `<path d="M30 46 C22 46 14 40 13 30 C20 30 26 36 30 46 Z M30 46 C38 46 46 40 47 30 C40 30 34 36 30 46 Z" ${style('#f7a8c8', INK, 1.1)}/>` +
    `<path d="M30 46 C24 42 20 32 22 22 C27 26 30 36 30 46 Z M30 46 C36 42 40 32 38 22 C33 26 30 36 30 46 Z" ${style('#f48fb8', INK, 1.1)}/>` +
    `<path d="M30 46 C27 38 27 28 30 18 C33 28 33 38 30 46 Z" ${style('#ffc2da', INK, 1.1)}/>` +
    `<path d="M25.6 40 H34.4 L33 44 H27 Z" ${style('#d8d06a', INK, 0.9)}/>`,
  // A marsh marigold, its golden cups on their stems, over round leaves.
  hemlock: () => {
    const cup = (x, y, s) =>
      Array.from({ length: 5 }, (_, k) => `<ellipse cx="${x}" cy="${n(y - 4.2 * s)}" rx="${n(3 * s)}" ry="${n(4.4 * s)}" transform="rotate(${k * 72} ${x} ${y})" ${style(GOLD, INK, 0.8)}/>`).join('') +
      `<circle cx="${x}" cy="${y}" r="${n(2 * s)}" ${style('#e09a1a', INK, 0.6)}/>`;
    return (
      `<path d="M22 72 C22 58 20 46 18 36 M38 72 C38 60 40 50 42 40" ${style('none', STEM, 1.8)}/>` +
      `<path d="${padPath(18, 64, 10)}" ${style(LEAF, INK, 1)}/><path d="${padPath(42, 66, 9)}" transform="rotate(200 42 66)" ${style(LEAF, INK, 1)}/>` +
      cup(18, 32, 1.3) +
      cup(42, 36, 1.1)
    );
  },
  // A water hyacinth: its spike of lavender flowers over its swollen leaves.
  wolfsbane: () =>
    `<ellipse cx="30" cy="68" rx="24" ry="6" ${style(WATER, INK, 1)}/>` +
    `<path d="M30 64 V30" ${style('none', STEM, 2)}/>` +
    `<path d="M30 64 C20 64 14 58 16 50 C22 50 28 56 30 64 Z M30 64 C40 64 46 58 44 50 C38 50 32 56 30 64 Z" ${style(LEAF, INK, 1)}/>` +
    [[30, 22], [24, 28], [36, 28], [26, 36], [34, 36], [30, 42], [24, 44], [36, 44]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.6" ${style('#b9a2ea', INK, 0.8)}/><circle cx="${x}" cy="${n(y - 0.6)}" r="1.4" ${style(GOLD)}/>`).join(''),
  // A shy turtle, tucked into his shell: only his shell shows, his eyes
  // peeping out of it.
  'lost-soul': () =>
    `<path d="M10 60 C10 38 20 28 30 28 C40 28 50 38 50 60 Z" ${style(SHELL, INK, 1.4)}/>` +
    `<path d="M20 31.6 L20 60 M30 28.4 V60 M40 31.6 L40 60 M11 46 H49" ${style('none', SHELL_EDGE, 1.2)}/>` +
    `<path d="M8 60 H52 V64 H8 Z" ${style(SCUTE, INK, 1.1)}/>` +
    `<path d="M12 64 C16 66.6 22 66.6 26 64 Z" ${style(DARK)}/>` +
    eye(16, 64.4, 1) +
    eye(21.6, 64.4, 1),
};
