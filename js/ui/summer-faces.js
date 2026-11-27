import { INK, PAPER, DARK, LEAF, PIPS, STICKS, style, n } from './draw.js';

// The Summer Beach Season's set of faces: the same 43 as Halloween's, which
// match just as those do, drawn as a day at the beach's. The eyes are beach
// balls, their panels red, blue and yellow round a white cap, the one a
// great ball bouncing on the sand; the bones surfboards standing in the
// sand, the one a surfer riding a wave; and the graves sandcastles, each
// with its number on its flag. The four monsters, which stand for the
// winds, are four from the shore: a crab, a seagull, a pelican and a
// dolphin. The jack-o'-lantern, the witch's brew and the ghost, where a
// set's red, green and white dragons stand, are a pail and spade, a palm
// tree and a sailboat. The poison garden is summer treats, an ice cream
// cone, a popsicle, a slice of watermelon and a glass of lemonade, and the
// moons are seashells, a conch, a scallop, a sand dollar and a cowrie, any
// two of which match, as any two flowers and any two moons do; and the
// lost soul is a lost flip-flop, its partner nowhere to be found, for the
// sunset. Drawn as faces.js draws Halloween's, on a tile 60 by 80, whole:
// faces.js shrinks a drawing to make room for its index.

const NUMBERS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const SUITS = { eyes: 'Beach balls', bones: 'Surfboards', graves: 'Sandcastles' };

// Each face's name, by its key in tiles.js, and the kinds' that have more
// than one face.
const names = {
  vampire: 'Crab',
  werewolf: 'Seagull',
  mummy: 'Pelican',
  zombie: 'Dolphin',
  lantern: 'Pail and spade',
  brew: 'Palm tree',
  ghost: 'Sailboat',
  nightshade: 'Ice cream cone',
  foxglove: 'Popsicle',
  hemlock: 'Slice of watermelon',
  wolfsbane: 'Glass of lemonade',
  'new-moon': 'Conch',
  'waxing-moon': 'Scallop',
  'full-moon': 'Sand dollar',
  'waning-moon': 'Cowrie',
  'lost-soul': 'Lost flip-flop',
};
for (const [suit, title] of Object.entries(SUITS)) NUMBERS.forEach((number, k) => (names[`${suit}-${k + 1}`] = `${number} of ${title}`));
const kinds = { flower: 'Summer treat', moon: 'Seashell' };

function draw(f) {
  if (f.group === 'eyes') return f.index === '1' ? bouncing() : PIPS[f.index].map((p) => ball(...p)).join('');
  if (f.group === 'bones') return f.index === '1' ? surfer() : STICKS[f.index].map((s, k) => board(...s, k)).join('');
  if (f.group === 'graves') return castle(f.index);
  return ART[f.key]();
}

export const SUMMER_FACES = { draw, names, kinds };

const RED = '#e8453c';
const DEEP_RED = '#b8302a';
const BLUE = '#2f86d8';
const YELLOW = '#f6c42b';
const ORANGE = '#f7882f';
const GREEN = '#3fb56a';
const VIOLET = '#9a5bd0';
const SAND = '#efcf8f';
const DEEP_SAND = '#cfa45c';
const SEA = '#3aa0e0';
const DEEP_SEA = '#1f6fb5';
const FOAM = '#e8f7ff';
const WOOD = '#a8743c';
const DEEP_WOOD = '#7a5228';
const PINK = '#f7a1c4';
const SHELL = '#f6cfae';
const DEEP_SHELL = '#d9956a';

// The surfboards' colours, by turns: coral with a yellow stripe, and aqua
// with a white one.
const BOARDS = [
  ['#ff8552', '#ffd23f'],
  ['#2ec4d6', '#fff6d0'],
];

// The sandcastles' flags, a colour to a number, the rainbow round from red.
const FLAGS = ['#e2493b', '#f08a24', '#f2c22b', '#5cb84a', '#2fa9a0', '#3b82d6', '#5a5fd0', '#9a5bd0', '#e06aa6'];

// ---------------------------------------------------------- beach balls

// A beach ball where a pip stands: six panels swirling round its white cap,
// red, white, blue, white, yellow and white, the light on it; the middle one
// of the five and the nine orange, green and violet, as a dots tile's
// middle dot is red.
function ball(cx, cy, r, middle = false) {
  const colours = middle ? [ORANGE, PAPER, GREEN, PAPER, VIOLET, PAPER] : [RED, PAPER, BLUE, PAPER, YELLOW, PAPER];
  const at = (a, rr) => [n(cx + rr * Math.cos(a)), n(cy + rr * Math.sin(a))];
  const swirl = 0.48;
  const w = n(Math.max(0.9, r / 7));
  const panels = colours.map((c, k) => {
    const a0 = ((k * 60 - 80) * Math.PI) / 180;
    const a1 = a0 + Math.PI / 3;
    const [x0, y0] = at(a0, r);
    const [x1, y1] = at(a1, r);
    const [p0, q0] = at(a0 - swirl, r * 0.55);
    const [p1, q1] = at(a1 - swirl, r * 0.55);
    return `<path d="M${n(cx)} ${n(cy)} Q${p0} ${q0} ${x0} ${y0} A${n(r)} ${n(r)} 0 0 1 ${x1} ${y1} Q${p1} ${q1} ${n(cx)} ${n(cy)} Z" ${style(c, INK, n(w * 0.45))}/>`;
  });
  return (
    panels.join('') +
    `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r * 0.22)}" ${style(PAPER, INK, n(w * 0.8))}/>` +
    `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" ${style('none', INK, w)}/>` +
    `<path d="M${n(cx - r * 0.66)} ${n(cy - r * 0.18)} A${n(r * 0.7)} ${n(r * 0.7)} 0 0 1 ${n(cx - r * 0.18)} ${n(cy - r * 0.66)}" ${style('none', '#fff', n(r * 0.13), ';opacity:0.75')}/>`
  );
}

// The one of beach balls: a great ball bouncing on the sand, the arcs of
// its bounce behind it and its shadow under it.
function bouncing() {
  return (
    `<path d="M0 72 C14 68 46 68 60 72 V80 H0 Z" ${style(SAND)}/>` +
    `<ellipse cx="31" cy="71.4" rx="13" ry="2.6" ${style(DARK, 'none', 0, ';opacity:0.25')}/>` +
    `<path d="M3 70 C4 54 8 44 12 40 M9 70 C10 60 13 54 15 51" ${style('none', INK, 1.3, ';stroke-dasharray:2.4 2.6')}/>` +
    `<path d="M19 62 Q30 66 41 62 M23 66.4 Q30 68.6 37 66.4" ${style('none', INK, 1.2)}/>` +
    ball(31, 36, 20)
  );
}

// ------------------------------------------------------------ surfboards

// A surfboard where a stick stands, [x, y, length, width], standing on its
// tail in the sand, its nose up, leaning a little one way or the other: a
// stripe down it either side of its stringer, and a little mound of sand
// at its foot.
function board(cx, cy, len, w, k = 0) {
  const [fill, stripe] = BOARDS[k % 2];
  const lean = k % 2 ? 6 : -6;
  const top = cy - len / 2;
  const foot = cy + len / 2;
  const h = (w * 1.2) / 2;
  const shape =
    `M${n(cx)} ${n(top)} C${n(cx + h * 0.9)} ${n(top + len * 0.1)} ${n(cx + h)} ${n(top + len * 0.32)} ${n(cx + h)} ${n(cy + len * 0.12)} ` +
    `C${n(cx + h)} ${n(foot - len * 0.08)} ${n(cx + h * 0.5)} ${n(foot)} ${n(cx)} ${n(foot)} ` +
    `C${n(cx - h * 0.5)} ${n(foot)} ${n(cx - h)} ${n(foot - len * 0.08)} ${n(cx - h)} ${n(cy + len * 0.12)} ` +
    `C${n(cx - h)} ${n(top + len * 0.32)} ${n(cx - h * 0.9)} ${n(top + len * 0.1)} ${n(cx)} ${n(top)} Z`;
  const stripes = [-0.42, 0.42].map((f) => `M${n(cx + h * f)} ${n(top + len * 0.2)} V${n(foot - len * 0.12)}`).join(' ');
  return (
    `<g transform="rotate(${lean} ${n(cx)} ${n(foot)})">` +
    `<path d="${shape}" ${style(fill, INK, n(Math.max(0.7, w / 7)))}/>` +
    `<path d="${stripes}" ${style('none', stripe, n(Math.max(0.8, w / 6)))}/>` +
    `<path d="M${n(cx)} ${n(top + 1.6)} V${n(foot - 1.2)}" ${style('none', DARK, n(Math.max(0.4, w / 14)))}/>` +
    `</g>` +
    `<path d="M${n(cx - w * 1.1)} ${n(foot + 0.6)} C${n(cx - w * 0.8)} ${n(foot - w * 0.55)} ${n(cx + w * 0.8)} ${n(foot - w * 0.55)} ${n(cx + w * 1.1)} ${n(foot + 0.6)} Z" ${style(SAND, INK, n(Math.max(0.5, w / 9)))}/>`
  );
}

// The one of surfboards: a surfer riding a curling wave, crouched on his
// board, his arms out.
function surfer() {
  return (
    `<path d="M0 78 V44 C2 26 14 12 30 11 C43 10.4 53 18 55 29 C49 24 41 23.4 36.4 28 C32.6 32 33.4 39 39 42 C46 45.6 54 46 60 50 V78 Z" ${style(SEA, INK, 1.4)}/>` +
    `<path d="M2 46 C4 30 14 18 28 15.4 C40 13.4 50 19 53 26 C48 22.6 41 22 37 25.4 C40 20 34 17.4 28 18.6 C18 21 10 32 8 46 Z" ${style(FOAM, INK, 1)}/>` +
    `<path d="M10 60 C20 56 28 60 36 58 M6 68 C18 64 30 68 42 65 M30 74 C38 72 46 74 54 71" ${style('none', DEEP_SEA, 1.3)}/>` +
    `<ellipse cx="44" cy="56" rx="13" ry="2.6" transform="rotate(-18 44 56)" ${style('#ffd23f', INK, 1.2)}/>` +
    `<path d="M38.6 55.4 L41.6 47.4 L46.6 51.6 L49.4 52.4 M41.6 47.4 L43.4 39.6 M36 41.6 L43.4 39.6 L51 37" ${style('none', DARK, 2.6)}/>` +
    `<circle cx="43.6" cy="35" r="3.6" ${style(DARK)}/>`
  );
}

// ----------------------------------------------------------- sandcastles

// A sandcastle, its keep between two towers, each crenellated, its gate
// at its foot, on a mound of sand, a flag flying from the keep in its
// number's colour with its number on it, dark on white by day and by night.
function castle(number) {
  const colour = FLAGS[Number(number) - 1];
  const teeth = (x0, x1, y) => {
    const step = (x1 - x0) / 5;
    let d = `M${x0} ${y + 4}`;
    for (let k = 0; k < 5; k++) d += ` V${k % 2 ? y + 4 : y} H${n(x0 + (k + 1) * step)}`;
    return `${d} V${y + 4}`;
  };
  const tower = (x0, x1, top) => `<path d="${teeth(x0, x1, top)} V68 H${x0} Z" ${style(SAND, INK, 1.2)}/>` + `<path d="M${n(x1 - 2.4)} ${top + 5} V67" ${style('none', DEEP_SAND, 1.6)}/>`;
  return (
    `<path d="M1 76 C8 66 20 64.6 30 64.6 C40 64.6 52 66 59 76 Z" ${style(DEEP_SAND, INK, 1.2)}/>` +
    tower(6, 19, 40) +
    tower(41, 54, 40) +
    tower(19, 41, 30) +
    `<path d="M25.6 68 V61 A4.4 4.4 0 0 1 34.4 61 V68 Z" ${style(DARK)}/>` +
    `<path d="M11.4 49 V53.6 M48.6 49 V53.6 M30 39 V44" ${style('none', DARK, 1.8)}/>` +
    `<path d="M30 30 V3" ${style('none', DARK, 1.4)}/>` +
    `<path d="M29.4 3.6 H7 L11 11.4 L7 19.2 H29.4 Z" ${style(colour, INK, 1.2)}/>` +
    `<circle cx="19" cy="11.4" r="6.6" ${style('#fffdf6', INK, 0.9)}/>` +
    `<text x="19" y="15.6" text-anchor="middle" style="fill:${DARK};font:700 12px Georgia,'Times New Roman',serif">${number}</text>`
  );
}

// ------------------------------------------------------ everything else

// A post of an old pier, its top and the grain down it, from y down.
const post = (y) => `<path d="M20 ${y} H40 V80 H20 Z" ${style(WOOD, INK, 1.2)}/>` + `<path d="M26 ${y + 3} V78 M33 ${y + 5} V78" ${style('none', DEEP_WOOD, 1)}/>`;

// Waves along the foot, from y down.
const sea = (y) => `<path d="M0 ${y} C8 ${y - 4} 14 ${y + 4} 22 ${y} C30 ${y - 4} 36 ${y + 4} 44 ${y} C52 ${y - 4} 56 ${y + 2} 60 ${y} V80 H0 Z" ${style(SEA, INK, 1.2)}/>`;

// A crab's leg, bent at its knee, from its hip out to its tip.
const leg = (hip, knee, tip) => {
  const d = `M${hip} L${knee} L${tip}`;
  return `<path d="${d}" ${style('none', INK, 3.4)}/>` + `<path d="${d}" ${style('none', '#e8553c', 1.8)}/>`;
};

// A crab's claw raised on its arm: the arm from the body to the wrist, and
// the pincer, open, at the wrist, its jaws to the side given.
function claw(side) {
  const s = side;
  const x = (v) => n(30 + s * v);
  return (
    `<path d="M${x(13)} 48 C${x(18)} 46 ${x(20)} 41 ${x(20)} 36" ${style('none', INK, 4.4)}/>` +
    `<path d="M${x(13)} 48 C${x(18)} 46 ${x(20)} 41 ${x(20)} 36" ${style('none', '#e8553c', 2.6)}/>` +
    `<path d="M${x(20)} 37 C${x(13)} 34 ${x(12)} 24 ${x(17)} 18 C${x(19)} 22 ${x(19)} 25 ${x(21)} 27.6 C${x(22)} 23 ${x(24)} 20 ${x(28)} 19.4 C${x(29)} 27 ${x(26)} 34 ${x(20)} 37 Z" ${style('#e8553c', INK, 1.3)}/>`
  );
}

// A shell's ribs, fanning out from its hinge at (x, y) to its edge.
const ribs = (x, y, ends, colour) => ends.map(([ex, ey]) => `<path d="M${x} ${y} L${ex} ${ey}" ${style('none', colour, 1.1)}/>`).join('');

const ART = {
  // A red crab, scuttling, its claws raised, its eyes up on their stalks.
  vampire: () =>
    leg('16 54', '8 58', '6 66') +
    leg('17 58', '10 64', '10 71') +
    leg('20 61', '16 67', '17 73') +
    leg('44 54', '52 58', '54 66') +
    leg('43 58', '50 64', '50 71') +
    leg('40 61', '44 67', '43 73') +
    claw(-1) +
    claw(1) +
    `<path d="M26 44 L24 36 M34 44 L36 36" ${style('none', INK, 1.4)}/>` +
    `<ellipse cx="30" cy="53" rx="17" ry="10.6" ${style('#e8553c', INK, 1.4)}/>` +
    `<path d="M17 51 C22 47 38 47 43 51" ${style('none', '#ffb19a', 1.4)}/>` +
    `<circle cx="24" cy="34" r="3" ${style('#fff', INK, 1)}/><circle cx="24.4" cy="34" r="1.5" ${style(DARK)}/>` +
    `<circle cx="36" cy="34" r="3" ${style('#fff', INK, 1)}/><circle cx="35.6" cy="34" r="1.5" ${style(DARK)}/>` +
    `<path d="M26 57 Q30 60 34 57" ${style('none', DARK, 1.2)}/>`,
  // A seagull standing on an old pier's post, facing left: white, his back
  // and wings grey, their tips black, his yellow beak with its red spot.
  werewolf: () =>
    post(64) +
    `<path d="M27 54 L26 64 M33 54 L34 64" ${style('none', '#f0a040', 1.8)}/>` +
    `<path d="M16 40 C16 31 24 27.6 32 30 C42 32.6 51 40 55 50 C46 53.6 36 55 28 53 C20 51 16 47 16 40 Z" ${style('#fbfbfb', INK, 1.4)}/>` +
    `<path d="M25 37 C35 33.4 46 39 55 50 C45 51 34 49 27.6 44 Z" ${style('#9aa7b4', INK, 1.2)}/>` +
    `<path d="M47 45 C51 46.6 54 48.4 57.4 51 C53 52 49.6 51 46 48.6 Z" ${style(DARK, INK, 0.9)}/>` +
    `<circle cx="17" cy="29" r="7.6" ${style('#fbfbfb', INK, 1.3)}/>` +
    `<path d="M10 29 L1.6 31.6 L10.4 33.4 Z" ${style('#f2b51e', INK, 1)}/>` +
    `<circle cx="4.6" cy="32.2" r="1" ${style('#e0403a')}/>` +
    `<circle cx="14.6" cy="27.4" r="1.4" ${style(DARK)}/>`,
  // A pelican perched on an old pier's post, facing left, his great beak
  // and the pouch under it.
  mummy: () =>
    post(66) +
    `<path d="M24 40 C34 32 48 35 53 46 C57 56 52 66 41 67.6 C31 68.6 22 62 22 52 C22 47 22.6 43 24 40 Z" ${style('#ece7de', INK, 1.4)}/>` +
    `<path d="M30 46 C38 42 48 45 52 54 C50 62 44 66 37 66 C42 60 40 52 30 46 Z" ${style('#8d8a86', INK, 1.1)}/>` +
    `<path d="M26 42 C24 34 20 30 20 24" ${style('none', INK, 5.6)}/>` +
    `<path d="M26 42 C24 34 20 30 20 24" ${style('none', '#ece7de', 3.6)}/>` +
    `<circle cx="20.6" cy="20.6" r="6.4" ${style('#ece7de', INK, 1.3)}/>` +
    `<path d="M15.6 18.6 C14 16.6 15 14.6 17.4 14.6 C19 14 21.6 14.6 22.6 16" ${style('#f4d46a', INK, 0.9)}/>` +
    `<path d="M15 20.4 L1.6 30.6 L3.4 32.6 L16.6 25 Z" ${style('#f4a442', INK, 1.1)}/>` +
    `<path d="M16 25 C13 34 7.4 36.6 3.2 32.4 C8 31 12 28 16 25 Z" ${style('#f7c16a', INK, 1.1)}/>` +
    `<circle cx="20" cy="19.4" r="1.3" ${style(DARK)}/>`,
  // A dolphin leaping out of the sea in an arc, the water splashing.
  zombie: () =>
    sea(66) +
    `<path d="M8 66 C6 62 3 60 1.6 60.6 M12 64 C13 60 12 57 10.6 56 M52 64 C53 61 55.6 59.6 57.6 60" ${style('none', SEA, 1.6)}/>` +
    `<path d="M30.4 19 C31.4 12 35 8.4 40 8 C38.6 12 38 16 38.6 20.6 Z" ${style('#5f85ad', INK, 1.2)}/>` +
    `<path d="M5 44 C8 39 12 36.6 16.6 35 C22 24 33 17.6 44 20.4 C51 22.4 55 29 55.6 37 C52 33 47.6 31.6 44.6 34 C44 41 41.4 47 36.6 52 C33.4 44.6 27.6 40.6 20.6 41.6 C16 42.4 12 44 8 45.6 C6 46.2 4.4 45.6 5 44 Z" ${style('#6f93b8', INK, 1.4)}/>` +
    `<path d="M9 44.6 C14 42.6 18.6 41 23 41 C28 41 33 44 36.4 50.4 C31 47 26 45 21 45.6 C17 46 13 46 9 44.6 Z" ${style('#cfe0ef')}/>` +
    `<path d="M53.4 36 C56.4 33 59.6 34 59.6 38 C57 38 55 40 54.6 44 C53 41 51 39.6 48 39.6 C50 38.6 52 37.4 53.4 36 Z" ${style('#5f85ad', INK, 1.1)}/>` +
    `<path d="M26 44 C27 49 25.6 52 22.6 54 C22 50 23 47 26 44 Z" ${style('#5f85ad', INK, 1)}/>` +
    `<circle cx="14" cy="38.4" r="1.5" ${style(DARK)}/>` +
    `<path d="M5 44 C7.4 44.4 9.4 43.6 11 42.6" ${style('none', DARK, 1)}/>`,
  // A bright red sand pail on the sand, its handle up over it and a yellow
  // band round it, and its blue spade leaning against it.
  lantern: () =>
    `<path d="M2 76 C12 70 48 70 58 76 V80 H2 Z" ${style(SAND)}/>` +
    `<path d="M14 40 C14 22 46 22 46 40" ${style('none', INK, 3)}/>` +
    `<path d="M14 40 C14 22 46 22 46 40" ${style('none', '#f4f4f4', 1.4)}/>` +
    `<path d="M14.4 40 H45.6 L41.4 72 H18.6 Z" ${style(RED, INK, 1.4)}/>` +
    `<path d="M15.4 49 H44.6 L43.8 55.4 H16.2 Z" ${style(YELLOW, INK, 1)}/>` +
    `<path d="M12.6 36.6 H47.4 V42 H12.6 Z" ${style(DEEP_RED, INK, 1.3)}/>` +
    `<path d="M21 44 L23 68" ${style('none', '#fff', 1.6, ';opacity:0.5')}/>` +
    `<path d="M45 70 L55 14" ${style('none', INK, 4)}/>` +
    `<path d="M45 70 L55 14" ${style('none', BLUE, 2.4)}/>` +
    `<path d="M50.6 13.4 H59.4 M55 14 V11" ${style('none', INK, 3.4)}/>` +
    `<path d="M50.6 13.4 H59.4" ${style('none', BLUE, 1.8)}/>` +
    `<path d="M40.4 64 C40 70 42 75 46 76 C50 76 52 71 51.6 65.6 Z" ${style(BLUE, INK, 1.2)}/>`,
  // A palm tree on a little island of sand, its trunk curving up, its
  // fronds spreading green over its coconuts.
  brew: () => {
    const frond = (d) => `<path d="${d}" ${style(LEAF, INK, 1.2)}/>`;
    return (
      `<path d="M3 76 C12 66 48 66 57 76 Z" ${style(SAND, INK, 1.2)}/>` +
      `<path d="M23 70 C24 52 28 36 35 24 L39 25.4 C33 38 30 54 30.4 70 Z" ${style(WOOD, INK, 1.3)}/>` +
      `<path d="M24.6 62 H30 M25.4 54 H30.6 M26.6 46 H32 M28.4 38 H33.6 M30.6 31 H36" ${style('none', DEEP_WOOD, 1.1)}/>` +
      frond('M37 23 C28 18 16 20 7 30 C15 26 25 25 37 25.6 Z') +
      frond('M37 23 C30 12 22 8 14 8 C22 12 29 17 36 25 Z') +
      frond('M37 23 C40 12 48 7 56 8 C50 12 44 17 38.6 25 Z') +
      frond('M38 24 C47 20 56 24 59 34 C52 28 45 27 38 26.4 Z') +
      frond('M37 25 C32 30 28 38 28 46 C32 39 35 33 38.6 27 Z') +
      `<path d="M10 28 C18 24 27 24 36 24.6 M17 10 C24 14 30 19 35.6 24 M53 10 C47 14 42 19 38.4 24.4 M56 31 C50 27 44 26 38.6 25.4" ${style('none', '#2b6e40', 0.8)}/>` +
      `<circle cx="34" cy="28" r="3" ${style('#7a5228', INK, 1)}/><circle cx="39.4" cy="28.6" r="3" ${style('#7a5228', INK, 1)}/>`
    );
  },
  // A sailboat on the sea, her white mainsail and jib full, a pennant at
  // her masthead.
  ghost: () =>
    sea(66) +
    `<path d="M30 6 V58" ${style('none', DARK, 1.6)}/>` +
    `<path d="M30 6 L40 9 L30 12 Z" ${style(RED, INK, 0.9)}/>` +
    `<path d="M31.6 12 C42 22 50 38 52 54 H31.6 Z" ${style('#fbfbfb', INK, 1.4)}/>` +
    `<path d="M28.4 17 C21 28 14 41 11 54 H28.4 Z" ${style('#fbfbfb', INK, 1.3)}/>` +
    `<path d="M38 28 C42 34 45 41 46.6 48 M22 32 C20 38 18 44 17 50" ${style('none', '#d9e2ec', 1)}/>` +
    `<path d="M8 57 H54 L48 67 H15 Z" ${style('#2f5fa0', INK, 1.4)}/>` +
    `<path d="M10.4 60.6 H52" ${style('none', '#fff', 1.2)}/>`,
  // An ice cream cone, its waffle cone criss-crossed, its strawberry scoop
  // with sprinkles on it and a drip running down.
  nightshade: () =>
    `<path d="M18 40 L30 75 L42 40 Z" ${style('#e0a458', INK, 1.4)}/>` +
    `<path d="M20.4 47 L35.4 46 M22.4 53 L33.6 52.4 M24.6 59.4 L32 59 M23 41 L35.6 66 M29 41 L38.4 50 M37 41 L40 44 M35 41 L25.6 64 M29.4 41 L21 50 M22 41 L19.6 44" ${style('none', '#b87a35', 1)}/>` +
    `<path d="M15 41 C12 32 18 20 30 20 C42 20 48 32 45 41 C41 44 38 41.4 34 44 C31 41.4 27 44.6 23 42 C20 44 17 43.4 15 41 Z" ${style(PINK, INK, 1.4)}/>` +
    `<path d="M38 42.6 C38.6 46 38 49 36.4 50 C35.4 48 35.4 45 36 43 Z" ${style(PINK, INK, 1)}/>` +
    [[22, 30, 20, '#3b82d6'], [30, 26, -30, YELLOW], [37, 31, 40, '#5cb84a'], [27, 35, -10, '#9a5bd0'], [34, 37, 30, RED], [24, 25, 60, '#fff']]
      .map(([x, y, t, c]) => `<path d="M${x - 1.6} ${y} H${x + 1.6}" transform="rotate(${t} ${x} ${y})" ${style('none', c, 1.4)}/>`)
      .join('') +
    `<path d="M20 28 C21 25 23.4 23.4 26 23" ${style('none', '#fff', 1.4, ';opacity:0.8')}/>`,
  // A popsicle, orange, a bite taken out of its corner, on its stick, a
  // drip running down it.
  foxglove: () =>
    `<path d="M26.6 56 H33.4 V73 A3.4 3.4 0 0 1 26.6 73 Z" ${style('#e8c98a', INK, 1.2)}/>` +
    `<path d="M17 22 C17 14 22 10 30 10 C33 10 36 10.6 38 12 C36.6 14 37 17 39.6 18 C40.6 20 42.6 20.6 43 22.6 V56 C43 59 41 61 38 61 H22 C19 61 17 59 17 56 Z" ${style(ORANGE, INK, 1.4)}/>` +
    `<path d="M21 18 V52" ${style('none', '#fff', 2, ';opacity:0.5')}/>` +
    `<path d="M43 40 C45 41 45.4 45 44 47.6 C43 46 42.6 43 43 40 Z" ${style(ORANGE, INK, 1)}/>` +
    `<path d="M24 28 C26 30 28 30 30 28 M32 36 C34 38 36 38 38 36 M23 44 C25 46 27 46 29 44" ${style('none', '#d96a1a', 1.1)}/>`,
  // A slice of watermelon, its red flesh and black seeds under the curve
  // of its green rind.
  hemlock: () =>
    `<path d="M30 12 L55 62 C47 70 13 70 5 62 Z" ${style('#3a9a48', INK, 1.4)}/>` +
    `<path d="M30 16.6 L51.6 59.6 C44 65.6 16 65.6 8.4 59.6 Z" ${style('#c9eab0')}/>` +
    `<path d="M30 20 L49 57.6 C42 62.4 18 62.4 11 57.6 Z" ${style('#f0505a', INK, 0.9)}/>` +
    [[30, 32], [25, 42], [35, 42], [20, 51], [30, 51], [40, 51]]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.3" ry="2.2" ${style(DARK)}/>`)
      .join(''),
  // A glass of lemonade, ice in it, a slice of lemon on its rim and a
  // striped straw.
  wolfsbane: () =>
    `<path d="M33 30 L41 4 L44.4 5 L36.4 31" ${style('none', INK, 3.6)}/>` +
    `<path d="M33 30 L41 4 L44.4 5 L36.4 31" ${style('#fff', 'none', 0)}/>` +
    `<path d="M35 23 L37 16.4 M37.6 14 L39.6 7.4" ${style('none', RED, 2.6)}/>` +
    `<path d="M17.4 30.6 H42.6 L39.6 70 H20.4 Z" ${style('#ffe26a', 'none', 0)}/>` +
    `<path d="M22 36 h8 v8 h-8 Z M30.6 42 h7.4 v7.4 h-7.4 Z" ${style('#fffbe6', INK, 0.9, ';opacity:0.85')}/>` +
    `<path d="M15 22 H45 L41 72 H19 Z" ${style('none', INK, 1.4)}/>` +
    `<path d="M18.6 30.6 H41.4" ${style('none', '#f2c41e', 1.2)}/>` +
    `<path d="M20 40 L21.4 64" ${style('none', '#fff', 1.6, ';opacity:0.7')}/>` +
    `<path d="M40 22 A9 9 0 0 1 58 22 Z" ${style('#ffe26a', INK, 1.2)}/>` +
    `<path d="M42.4 22 A6.6 6.6 0 0 1 55.6 22 M49 22 V15.4 M49 22 L44.4 17.4 M49 22 L53.6 17.4" ${style('none', '#f2c41e', 1)}/>`,
  // A conch, its spire twisting up, its body whorl wide and knobbed, its
  // lip flared open and pink inside.
  'new-moon': () =>
    `<path d="M28 7 C33 11 38 17 42 23 C51 29 55 40 53 50 C51 60 43 68 34 75 C31.6 70 28 66 24 62.6 C15.6 56 11.6 46 13.6 36 C15.6 27 21 19 25 13 C26 10 27 8 28 7 Z" ${style(SHELL, INK, 1.4)}/>` +
    `<path d="M24 14 C27 15 31 17 34 18 M20 21.4 C25 22.6 32 24.6 39 24 M16 30 C24 31 34 32 44 28" ${style('none', DEEP_SHELL, 1.2)}/>` +
    [[18, 33], [26, 35.6], [34, 35], [42, 31]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.9" ${style(DEEP_SHELL, INK, 0.8)}/>`).join('') +
    `<path d="M37 34 C48 37 53 46 49 57 C47 63 42 67 36.6 69 C39 60 39.6 47 37 34 Z" ${style('#f49ab0', INK, 1.2)}/>` +
    `<path d="M40 41 C43 46 44 53 42 60" ${style('none', '#fff', 1.2, ';opacity:0.7')}/>`,
  // A scallop, its ribbed fan spreading from its hinge, its two ears there.
  'waxing-moon': () => {
    const edge = [];
    for (let k = 0; k <= 8; k++) edge.push([n(8 + k * 5.5), n(32 - Math.sin((k / 8) * Math.PI) * 18)]);
    let d = `M30 64 L8 34`;
    for (let k = 1; k < edge.length; k++) {
      const [x0, y0] = edge[k - 1];
      const [x1, y1] = edge[k];
      d += ` Q${n((x0 + x1) / 2)} ${n(Math.min(y0, y1) - 3)} ${x1} ${y1}`;
    }
    return (
      `<path d="M21 58 L30 64 L39 58 L41 69 H19 Z" ${style('#f39a62', INK, 1.2)}/>` +
      `<path d="${d} Z" ${style('#f7b07a', INK, 1.4)}/>` +
      ribs(30, 63, edge.slice(1, -1), '#d97a45') +
      `<path d="M16 32 C20 24 25 20 30 19" ${style('none', '#fff', 1.4, ';opacity:0.7')}/>`
    );
  },
  // A sand dollar, round and flat, the five petals of its flower on it.
  'full-moon': () =>
    `<circle cx="30" cy="40" r="23" ${style('#ece0c4', INK, 1.4)}/>` +
    `<circle cx="30" cy="40" r="19" ${style('none', '#d8c6a0', 1)}/>` +
    Array.from({ length: 5 }, (_, k) => `<path d="M30 40 C27 34 27 26 30 21.6 C33 26 33 34 30 40 Z" transform="rotate(${k * 72} 30 40)" ${style('#f6eedb', '#a8906a', 1.2)}/>`).join('') +
    `<circle cx="30" cy="40" r="2" ${style('#a8906a')}/>` +
    Array.from({ length: 5 }, (_, k) => `<path d="M30 52 V56" transform="rotate(${k * 72 + 36} 30 40)" ${style('none', '#a8906a', 1.4)}/>`).join(''),
  // A cowrie, glossy and spotted, seen from below, its long slit toothed.
  'waning-moon': () =>
    `<path d="M30 12 C44 12 50 26 50 40 C50 56 42 68 30 68 C18 68 10 56 10 40 C10 26 16 12 30 12 Z" ${style('#d9a066', INK, 1.4)}/>` +
    [[17, 28], [44, 30], [15, 46], [45, 48], [20, 60], [41, 61]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" ${style('#8a5a35')}/>`).join('') +
    `<path d="M30 16 C37 16 41 28 41 40 C41 53 37 64 30 64 C23 64 19 53 19 40 C19 28 23 16 30 16 Z" ${style('#f4e6cf', INK, 1)}/>` +
    `<path d="M30 18 C32 28 32.4 46 30 62" ${style('none', DARK, 2.2)}/>` +
    [22, 28, 34, 40, 46, 52, 58].map((y) => `<path d="M${n(30 + (y < 40 ? 0.8 : 0.4) - 4)} ${y} H${n(30 + 4)}" ${style('none', '#b98c5a', 1)}/>`).join('') +
    `<path d="M14 30 C15 22 20 16 26 14.6" ${style('none', '#fff', 1.4, ';opacity:0.8')}/>`,
  // A flip-flop on its own, its partner nowhere to be found: its sole and
  // its strap, sand on it.
  'lost-soul': () =>
    `<g transform="rotate(-14 30 42)">` +
    `<path d="M30 10 C40 10 45 19 44 30 C43 39 40 44 40 52 C40 62 37 72 30 72 C23 72 20 64 20.6 55 C21 47 17 40 17 30 C17 18 22 10 30 10 Z" ${style('#ff9f43', INK, 1.5)}/>` +
    `<path d="M30 13.6 C38 13.6 41 21 40.4 30 C39.6 38 36.6 43 36.6 52 C36.6 60 34.4 68 30 68 C25.6 68 24 62 24.4 55 C25 47 20.6 40 20.6 30 C20.6 20 24 13.6 30 13.6 Z" ${style('#ffc07a')}/>` +
    `<path d="M30 20 C26 26 22 32 19 39 M30 20 C34 26 38 32 41.6 39" ${style('none', INK, 4.6)}/>` +
    `<path d="M30 20 C26 26 22 32 19 39 M30 20 C34 26 38 32 41.6 39" ${style('none', '#2ec4d6', 3)}/>` +
    `<circle cx="30" cy="20" r="2.4" ${style('#2ec4d6', INK, 1)}/>` +
    `</g>` +
    [[14, 70], [19, 74], [44, 72], [49, 68], [40, 76]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.9" ${style(DEEP_SAND)}/>`).join(''),
};
