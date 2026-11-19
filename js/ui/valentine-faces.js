import { INK, PAPER, DARK, LEAF, PIPS, STICKS, style, n } from './draw.js';

// Valentine's Day's set of faces: the same 43 as Halloween's, which match
// just as those do, drawn as Valentine's. The eyes are hearts; the bones
// Cupid's arrows, each with a heart for its head; and the graves
// valentines, each a card in its envelope, sealed with a heart that bears
// its number. The four monsters, which stand for the winds, are four
// valentines' puns: a bumblebee with hearts for wings (bee mine), a barn
// owl, his face a heart (owl always love you), a teddy bear holding a
// heart (I love you beary much) and a kitten, her nose a heart (you're
// purr-fect). The jack-o'-lantern, the witch's brew and the ghost, where a
// set's red, green and white dragons stand, are a heart-shaped box of
// chocolates, a love potion, bubbling hearts where the brew bubbled, and a
// paper lace valentine. The poison garden is love's flowers, a red rose, a
// violet, a pink carnation and a daisy, and the moons are candy hearts
// saying BE MINE, XOXO, LOVE YOU and HUG ME, any two of which match, as any
// two flowers and any two moons do; and the lost soul is a broken heart.
// Drawn as faces.js draws Halloween's, on a tile 60 by 80, whole: faces.js
// shrinks a drawing to make room for its index.

const NUMBERS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const SUITS = { eyes: 'Hearts', bones: 'Arrows', graves: 'Valentines' };

// Each face's name, by its key in tiles.js, and the kinds' that have more
// than one face.
const names = {
  vampire: 'Bumblebee',
  werewolf: 'Barn owl',
  mummy: 'Teddy bear',
  zombie: 'Kitten',
  lantern: 'Box of chocolates',
  brew: 'Love potion',
  ghost: 'Lace valentine',
  nightshade: 'Red rose',
  foxglove: 'Violet',
  hemlock: 'Pink carnation',
  wolfsbane: 'Daisy',
  'new-moon': 'Be mine',
  'waxing-moon': 'XOXO',
  'full-moon': 'Love you',
  'waning-moon': 'Hug me',
  'lost-soul': 'Broken heart',
};
for (const [suit, title] of Object.entries(SUITS)) NUMBERS.forEach((number, k) => (names[`${suit}-${k + 1}`] = `${number} of ${title}`));
const kinds = { flower: "Love's flower", moon: 'Candy heart' };

function draw(f) {
  if (f.group === 'eyes') return f.index === '1' ? bigHeart() : PIPS[f.index].map((p) => pip(...p)).join('');
  if (f.group === 'bones') return f.index === '1' ? bow() : STICKS[f.index].map((s) => arrow(...s)).join('');
  if (f.group === 'graves') return envelope(f.index);
  if (f.group === 'moon') return candy(f.key);
  return ART[f.key]();
}

export const VALENTINE_FACES = { draw, names, kinds };

const RED = '#e0284d';
const DEEP_RED = '#9c1031';
const PINK = '#ff8fb1';
const DEEP_PINK = '#d94f7a';
const PALE_PINK = '#ffd3e0';
const BLUSH = '#ff8fab';
const GOLD = '#e8b84a';
const DEEP_GOLD = '#a8780f';
const LILAC = '#e7dcf7';
const PALE_LILAC = '#f3eefb';
const LILAC_EDGE = '#a48bcb';
const CHOCOLATE = '#6b3a1e';
const CUP = '#f1d5aa';
const GLASS = '#e4f2fb';
const POTION = '#62c944';
const DEEP_POTION = '#2f7d1f';
const BEE = '#ffd23f';
const OWL = '#dba65c';
const DEEP_OWL = '#b07a38';
const FUR = '#b47c48';
const PALE_FUR = '#efd5b0';
const GREY = '#aab1c2';
const DEEP_GREY = '#6c7488';
const STEM = '#2f7d4a';

// A heart w wide and as tall, its middle at (cx, cy): two round lobes over
// its point; or, `down`, its point up, as an arrow's head is.
function heart(cx, cy, w, down = false) {
  const s = down ? -1 : 1;
  const r = n(w / 4);
  const top = n(cy - (s * w) / 4);
  const sweep = down ? 0 : 1;
  return (
    `M${n(cx - w / 2)} ${top} A${r} ${r} 0 0 ${sweep} ${n(cx)} ${top} A${r} ${r} 0 0 ${sweep} ${n(cx + w / 2)} ${top} ` +
    `Q${n(cx + w / 2)} ${n(cy + (s * w) / 8)} ${n(cx)} ${n(cy + (s * w) / 2)} Q${n(cx - w / 2)} ${n(cy + (s * w) / 8)} ${n(cx - w / 2)} ${top} Z`
  );
}

// Points round a heart's edge, as heart() draws it, `count` of them evenly
// spaced, from its left side over its lobes and down to its point.
function heartEdge(cx, cy, w, count) {
  const r = w / 4;
  const top = cy - w / 4;
  const path = [];
  for (const lobe of [cx - r, cx + r]) for (let k = 0; k <= 40; k++) path.push([lobe + r * Math.cos(Math.PI + (k * Math.PI) / 40), top + r * Math.sin(Math.PI + (k * Math.PI) / 40)]);
  const side = (a, b, c) => Array.from({ length: 41 }, (_, k) => k / 40).map((t) => [0, 1].map((i) => (1 - t) ** 2 * a[i] + 2 * (1 - t) * t * b[i] + t ** 2 * c[i]));
  path.push(...side([cx + w / 2, top], [cx + w / 2, cy + w / 8], [cx, cy + w / 2]), ...side([cx, cy + w / 2], [cx - w / 2, cy + w / 8], [cx - w / 2, top]));
  const along = [0];
  for (let k = 1; k < path.length; k++) along.push(along[k - 1] + Math.hypot(path[k][0] - path[k - 1][0], path[k][1] - path[k - 1][1]));
  const total = along.at(-1);
  return Array.from({ length: count }, (_, k) => {
    const at = path[along.findIndex((d) => d >= (k * total) / count)];
    return [n(at[0]), n(at[1])];
  });
}

// A shine on a heart's left lobe.
const shine = (cx, cy, w) => {
  const x = n(cx - w * 0.27);
  const y = n(cy - w * 0.27);
  return `<ellipse cx="${x}" cy="${y}" rx="${n(w * 0.055)}" ry="${n(w * 0.1)}" transform="rotate(40 ${x} ${y})" ${style('#fff', 'none', 0, ';opacity:0.8')}/>`;
};

// An eye: dark, with a glint.
const eye = (x, y, r = 1.4) => `<circle cx="${x}" cy="${y}" r="${r}" ${style(DARK)}/><circle cx="${n(x - r * 0.35)}" cy="${n(y - r * 0.35)}" r="${n(r * 0.35)}" ${style('#fff')}/>`;

// Two rosy cheeks.
const cheeks = (y, dx, r = 2.3) => `<circle cx="${30 - dx}" cy="${y}" r="${r}" ${style(BLUSH, 'none', 0, ';opacity:0.75')}/><circle cx="${30 + dx}" cy="${y}" r="${r}" ${style(BLUSH, 'none', 0, ';opacity:0.75')}/>`;

// ----------------------------------------------------------------- hearts

// A heart where a pip stands, red, with a shine on it; the middle one of
// the five and the nine pink, as a dots tile's middle dot is red.
function pip(cx, cy, r, middle = false) {
  const w = r * 2;
  return `<path d="${heart(cx, cy, w)}" ${style(middle ? PINK : RED, INK, n(Math.max(0.9, r / 7)))}/>` + shine(cx, cy, w);
}

// The one of hearts: a great heart with a ribbon round it, a banner across
// it whose ends fold back behind it.
function bigHeart() {
  return (
    `<path d="M11 52 H1.5 L5 57 L1.5 62 H11 Z M49 52 H58.5 L55 57 L58.5 62 H49 Z" ${style(PALE_PINK, INK, 1.1)}/>` +
    `<path d="${heart(30, 44, 44)}" ${style(RED, INK, 1.6)}/>` +
    shine(30, 44, 44) +
    `<path d="M6 48 C18 44.5 42 44.5 54 48 V57 C42 53.5 18 53.5 6 57 Z" ${style(PAPER, INK, 1.2)}/>` +
    `<path d="M6 57 L11 62 V55.6 Z M54 57 L49 62 V55.6 Z" ${style(DEEP_PINK, INK, 0.9)}/>`
  );
}

// ----------------------------------------------------------------- arrows

// Cupid's arrow standing where a stick stands, as long, [x, y, length,
// width]: its head a heart, point up, a golden shaft, and pink feathers.
function arrow(cx, cy, len, w) {
  const top = cy - len / 2;
  const foot = cy + len / 2;
  const head = Math.min(w * 1.55, len * 0.45);
  const fl = len * 0.34; // the feathers, how far up the shaft
  const fw = w * 0.62; // and how far out
  const out = n(Math.max(0.6, w / 8));
  const shaft = `M${cx} ${n(top + head * 0.8)} V${n(foot - 0.4)}`;
  return (
    `<path d="${shaft}" ${style('none', INK, n(w * 0.55))}/>` +
    `<path d="${shaft}" ${style('none', GOLD, n(w * 0.3))}/>` +
    `<path d="M${cx} ${n(foot - fl)} L${n(cx - fw)} ${n(foot - fl + fw)} V${n(foot)} L${cx} ${n(foot - fw)} Z M${cx} ${n(foot - fl)} L${n(cx + fw)} ${n(foot - fl + fw)} V${n(foot)} L${cx} ${n(foot - fw)} Z" ${style(PALE_PINK, INK, out)}/>` +
    `<path d="${heart(cx, top + head / 2, head, true)}" ${style(RED, INK, out)}/>`
  );
}

// The one of arrows: Cupid's bow drawn, an arrow on its string pointing
// up, ready to fly, as on the first board of the love story.
function bow() {
  const limbs = 'M5 57 C8 40 18 32 30 32 C42 32 52 40 55 57';
  const shaft = 'M30 24 V68';
  return (
    `<path d="M5.5 57 L30 67 L54.5 57" ${style('none', INK, 0.9)}/>` +
    `<path d="${limbs}" ${style('none', INK, 5)}/>` +
    `<path d="${limbs}" ${style('none', GOLD, 2.8)}/>` +
    `<circle cx="5" cy="57" r="2" ${style(GOLD, INK, 0.9)}/><circle cx="55" cy="57" r="2" ${style(GOLD, INK, 0.9)}/>` +
    `<rect x="25.5" y="29.6" width="9" height="5" rx="1.2" ${style(DEEP_GOLD, INK, 0.9)}/>` +
    `<path d="${shaft}" ${style('none', INK, 3.6)}/><path d="${shaft}" ${style('none', GOLD, 1.8)}/>` +
    `<path d="M30 55 L24.5 60.5 V70 L30 64.5 Z M30 55 L35.5 60.5 V70 L30 64.5 Z" ${style(PALE_PINK, INK, 1)}/>` +
    `<path d="${heart(30, 19, 14, true)}" ${style(RED, INK, 1.2)}/>`
  );
}

// ------------------------------------------------------------- valentines

// A valentine: a card in its envelope, the flap closed in a V and sealed
// with a heart, the number big on the heart, as a grave has its number.
function envelope(number) {
  return (
    `<rect x="6.5" y="29" width="47" height="38" rx="2.4" ${style(LILAC, INK, 1.4)}/>` +
    `<path d="M7.4 66.2 L25 50.5 M52.6 66.2 L35 50.5" ${style('none', LILAC_EDGE, 1.1)}/>` +
    `<path d="M7.3 29.8 L30 52 L52.7 29.8" ${style(PALE_LILAC, LILAC_EDGE, 1.2)}/>` +
    `<path d="${heart(30, 51, 27)}" ${style(RED, DEEP_RED, 1.1)}/>` +
    `<text x="30" y="57" text-anchor="middle" style="fill:#fff;font:700 18px Georgia,'Times New Roman',serif">${number}</text>`
  );
}

// ----------------------------------------------------------- candy hearts

// The candy hearts, each its own pastel, its words pressed into it in red.
const CANDIES = {
  'new-moon': ['#ffb8ca', ['BE', 'MINE']],
  'waxing-moon': ['#d5bff3', ['XOXO']],
  'full-moon': ['#ffe48a', ['LOVE', 'YOU']],
  'waning-moon': ['#b7ecc8', ['HUG', 'ME']],
};

function candy(key) {
  const [colour, lines] = CANDIES[key];
  const words = (line, y) => `<text x="30" y="${y}" text-anchor="middle" style="fill:#d42f52;font:900 9.5px system-ui,-apple-system,sans-serif">${line}</text>`;
  return (
    `<path d="${heart(30, 46, 42)}" ${style(colour, INK, 1.4)}/>` +
    `<path d="${heart(30, 46.6, 35)}" ${style('none', '#fff', 1.3, ';opacity:0.6')}/>` +
    (lines.length === 1 ? words(lines[0], 48.5) : words(lines[0], 44) + words(lines[1], 54))
  );
}

// ------------------------------------------------------- everything else

// A violet at (x, y), s its size: five purple petals, the lowest the
// biggest, round a yellow eye.
const violet = (x, y, s) => {
  const petal = (deg, rx, ry, d) => `<ellipse cx="${x}" cy="${n(y - d * s)}" rx="${n(rx * s)}" ry="${n(ry * s)}" transform="rotate(${deg} ${x} ${y})" ${style('#7a4cc4', INK, 0.8)}/>`;
  return (
    petal(-38, 3.6, 5, 4.6) +
    petal(38, 3.6, 5, 4.6) +
    petal(-105, 3.4, 4.4, 4.2) +
    petal(105, 3.4, 4.4, 4.2) +
    petal(180, 4.4, 5, 4.4) +
    `<path d="M${x} ${n(y + 2 * s)} V${n(y + 5.5 * s)} M${n(x - 1.6 * s)} ${n(y + 2 * s)} L${n(x - 2.6 * s)} ${n(y + 4.6 * s)} M${n(x + 1.6 * s)} ${n(y + 2 * s)} L${n(x + 2.6 * s)} ${n(y + 4.6 * s)}" ${style('none', '#3e1f78', n(0.6 * s))}/>` +
    `<circle cx="${x}" cy="${y}" r="${n(1.8 * s)}" ${style('#ffd43b', INK, 0.6)}/>`
  );
};

const ART = {
  // A bumblebee, round and fuzzy, his wings two hearts: bee mine.
  vampire: () => {
    const wing = (x, deg) => `<path d="${heart(x, 33, 17)}" transform="rotate(${deg} ${x} 33)" ${style('#eaf6ff', '#6f9cc4', 1.1)}/>`;
    const body = 'M30 33 C41 33 48 41 48 51 C48 62 40 69 30 69 C20 69 12 62 12 51 C12 41 19 33 30 33 Z';
    return (
      wing(14.5, -35) +
      wing(45.5, 35) +
      `<path d="M25 35 C23.5 29.5 21 26.5 18 25 M35 35 C36.5 29.5 39 26.5 42 25" ${style('none', INK, 1.2)}/>` +
      `<path d="${heart(17.5, 23.5, 6)}" ${style(RED, INK, 0.8)}/><path d="${heart(42.5, 23.5, 6)}" ${style(RED, INK, 0.8)}/>` +
      `<path d="${body}" ${style(BEE)}/>` +
      `<path d="M13 56 C20 58.4 40 58.4 47 56 L45.6 61 C39 63 21 63 14.4 61 Z M18.3 65 C24 67 36 67 41.7 65 C38.5 67.9 34 69 30 69 C26 69 21.5 67.9 18.3 65 Z" ${style(DARK)}/>` +
      `<path d="${body}" ${style('none', INK, 1.4)}/>` +
      eye(24.5, 45.5, 2.2) +
      eye(35.5, 45.5, 2.2) +
      cheeks(50.5, 10) +
      `<path d="M26.5 50 Q30 53.4 33.5 50" ${style('none', DARK, 1.2)}/>`
    );
  },
  // A barn owl, his face a white heart, perched: owl always love you.
  werewolf: () =>
    `<path d="M12 72.5 H48" ${style('none', '#7a4f2a', 3)}/>` +
    `<path d="M30 22 C42 22 48 32 48 46 C48 60 41 70 30 70 C19 70 12 60 12 46 C12 32 18 22 30 22 Z" ${style(OWL, INK, 1.4)}/>` +
    `<path d="M13 44 C8.5 52 10.5 63 19 68.5 C21 60 21 51 18 44 Z M47 44 C51.5 52 49.5 63 41 68.5 C39 60 39 51 42 44 Z" ${style(DEEP_OWL, INK, 1.1)}/>` +
    `<path d="M21.5 52 C23 61 37 61 38.5 52 C39 60 35.5 66.5 30 67.5 C24.5 66.5 21 60 21.5 52 Z" ${style('#fbf1df')}/>` +
    [[26, 57], [34, 57], [30, 61], [26.5, 63.5], [33.5, 63.5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.9" ${style('#8a5a32')}/>`).join('') +
    `<path d="${heart(30, 38.5, 28)}" ${style(PAPER, INK, 1.2)}/>` +
    `<path d="${heart(30, 38.5, 22.5)}" ${style('none', '#e9cfa6', 1.1)}/>` +
    eye(24.3, 37.5, 3.1) +
    eye(35.7, 37.5, 3.1) +
    `<path d="M30 41.5 L28.2 45 L30 48.5 L31.8 45 Z" ${style('#e8b98a', INK, 0.7)}/>` +
    `<path d="M24.5 70.4 V73.4 M22.5 70.6 L21.4 73.2 M26.5 70.6 L27.6 73.2 M35.5 70.4 V73.4 M33.5 70.6 L32.4 73.2 M37.5 70.6 L38.6 73.2" ${style('none', '#c98a6a', 1.2)}/>`,
  // A teddy bear, holding out a heart: I love you beary much.
  mummy: () =>
    `<circle cx="19" cy="23.5" r="5" ${style(FUR, INK, 1.2)}/><circle cx="41" cy="23.5" r="5" ${style(FUR, INK, 1.2)}/>` +
    `<circle cx="19" cy="23.5" r="2.4" ${style(PALE_FUR)}/><circle cx="41" cy="23.5" r="2.4" ${style(PALE_FUR)}/>` +
    `<ellipse cx="30" cy="57" rx="15.5" ry="14" ${style(FUR, INK, 1.4)}/>` +
    `<ellipse cx="20.5" cy="69.5" rx="6.6" ry="4.6" ${style(FUR, INK, 1.2)}/><ellipse cx="39.5" cy="69.5" rx="6.6" ry="4.6" ${style(FUR, INK, 1.2)}/>` +
    `<ellipse cx="20.5" cy="70" rx="3.4" ry="2.5" ${style(PALE_FUR)}/><ellipse cx="39.5" cy="70" rx="3.4" ry="2.5" ${style(PALE_FUR)}/>` +
    `<circle cx="30" cy="34" r="12.5" ${style(FUR, INK, 1.4)}/>` +
    `<ellipse cx="30" cy="38.6" rx="6" ry="4.6" ${style(PALE_FUR, INK, 0.9)}/>` +
    `<ellipse cx="30" cy="36.6" rx="2.4" ry="1.7" ${style(DARK)}/>` +
    `<path d="M30 38.2 V40.2 M27.6 40.6 Q30 42.4 32.4 40.6" ${style('none', DARK, 0.9)}/>` +
    eye(25, 31.5, 1.6) +
    eye(35, 31.5, 1.6) +
    `<path d="${heart(30, 56.5, 20)}" ${style(RED, INK, 1.3)}/>` +
    shine(30, 56.5, 20) +
    `<ellipse cx="19.8" cy="54.5" rx="4.2" ry="3.4" transform="rotate(-25 19.8 54.5)" ${style(FUR, INK, 1.1)}/><ellipse cx="40.2" cy="54.5" rx="4.2" ry="3.4" transform="rotate(25 40.2 54.5)" ${style(FUR, INK, 1.1)}/>`,
  // A kitten, a grey tabby, her nose a heart: you're purr-fect.
  zombie: () =>
    `<path d="M41 70 C51 70 55 62 51.5 54 C50 50.5 46.5 50 46 53" ${style('none', INK, 5)}/>` +
    `<path d="M41 70 C51 70 55 62 51.5 54 C50 50.5 46.5 50 46 53" ${style('none', GREY, 3)}/>` +
    `<path d="M17.5 74 C16 61 21 51 30 51 C39 51 44 61 42.5 74 Z" ${style(GREY, INK, 1.4)}/>` +
    `<path d="M24 61 C26 64 34 64 36 61" ${style('none', DEEP_GREY, 1.2)}/>` +
    `<ellipse cx="25" cy="73.4" rx="4" ry="2.6" ${style(GREY, INK, 1)}/><ellipse cx="35" cy="73.4" rx="4" ry="2.6" ${style(GREY, INK, 1)}/>` +
    `<path d="M14.6 34 L15.6 18.5 L27 27 Z M45.4 34 L44.4 18.5 L33 27 Z" ${style(GREY, INK, 1.3)}/>` +
    `<path d="M17.2 29 L17.6 22.4 L22.6 26.2 Z M42.8 29 L42.4 22.4 L37.4 26.2 Z" ${style('#ffb3c6')}/>` +
    `<ellipse cx="30" cy="38" rx="16" ry="13.5" ${style(GREY, INK, 1.4)}/>` +
    `<path d="M30 25 V29.5 M25.6 25.6 L26.5 29.8 M34.4 25.6 L33.5 29.8" ${style('none', DEEP_GREY, 1.4)}/>` +
    `<ellipse cx="23.5" cy="37.6" rx="3.5" ry="4" ${style('#86cf5a', INK, 0.9)}/><ellipse cx="36.5" cy="37.6" rx="3.5" ry="4" ${style('#86cf5a', INK, 0.9)}/>` +
    `<ellipse cx="23.5" cy="37.6" rx="1" ry="3.1" ${style(DARK)}/><ellipse cx="36.5" cy="37.6" rx="1" ry="3.1" ${style(DARK)}/>` +
    `<circle cx="22.4" cy="36.2" r="0.8" ${style('#fff')}/><circle cx="35.4" cy="36.2" r="0.8" ${style('#fff')}/>` +
    `<path d="${heart(30, 43.4, 5)}" ${style('#ff7a9c', INK, 0.6)}/>` +
    `<path d="M30 46 Q28.2 48.4 26 47 M30 46 Q31.8 48.4 34 47" ${style('none', DARK, 0.9)}/>` +
    `<path d="M11.5 41 L21.5 43.5 M11 45.6 L21.5 45.8 M48.5 41 L38.5 43.5 M49 45.6 L38.5 45.8" ${style('none', INK, 0.7)}/>`,
  // A heart-shaped box of chocolates, its lid off, nine chocolates in their
  // paper cups.
  lantern: () => {
    const chocolates = [[16.5, 38], [24.5, 40], [35.5, 40], [43.5, 38], [20.5, 48], [30, 49], [39.5, 48], [25.5, 56.5], [34.5, 56.5]];
    return (
      `<path d="${heart(30, 46, 47)}" ${style('#d81f45', INK, 1.5)}/>` +
      `<path d="${heart(30, 46.6, 38)}" ${style('#8c1131', '#5c0a1f', 0.9)}/>` +
      chocolates
        .map(
          ([x, y]) =>
            `<circle cx="${x}" cy="${y}" r="4.5" ${style(CUP, '#b8925e', 0.6)}/><circle cx="${x}" cy="${y}" r="3.4" ${style(CHOCOLATE, '#3d1f0e', 0.7)}/>` +
            `<circle cx="${n(x - 1.1)}" cy="${n(y - 1.1)}" r="0.9" ${style('#a8714a')}/>`,
        )
        .join('')
    );
  },
  // A love potion, green, in a round flask, little hearts bubbling up out
  // of it where the witch's brew bubbled.
  brew: () => {
    const flask = 'M26 26 V39.5 C17 42 12 48.5 12 56 C12 65.5 20 72 30 72 C40 72 48 65.5 48 56 C48 48.5 43 42 34 39.5 V26 Z';
    return (
      `<path d="${flask}" ${style(GLASS)}/>` +
      `<path d="M13.4 50 C19 47.6 25 52 31 50 C37 48 42 51 46.6 50 C47.5 52 48 54 48 56 C48 65.5 40 72 30 72 C20 72 12 65.5 12 56 C12 54 12.5 52 13.4 50 Z" ${style(POTION, DEEP_POTION, 1)}/>` +
      [[22, 61, 2.2], [36, 57, 1.6], [30, 66, 1.4], [40.5, 63, 1.1]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" ${style('#a8ec8a', DEEP_POTION, 0.6)}/>`).join('') +
      `<path d="${flask}" ${style('none', INK, 1.4)}/>` +
      `<rect x="23.5" y="23" width="13" height="4.6" rx="2" ${style(GLASS, INK, 1.2)}/>` +
      `<path d="M17.5 55 C17.5 61 20.5 65.5 25 67.5" ${style('none', '#fff', 1.6, ';opacity:0.85')}/>` +
      `<path d="${heart(30, 33, 6)}" ${style(PINK, INK, 0.7)}/>` +
      `<path d="${heart(35.5, 16, 7.5)}" ${style(PINK, INK, 0.8)}/>` +
      `<path d="${heart(24.5, 9.5, 6)}" ${style(PINK, INK, 0.7)}/>` +
      `<path d="${heart(33, 3.8, 4.4)}" ${style(PINK, INK, 0.6)}/>`
    );
  },
  // A paper lace valentine: a white heart, scalloped round its edge and
  // pierced with lace, and a little red heart in its middle.
  ghost: () =>
    heartEdge(30, 44, 44, 26)
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" ${style(PAPER, INK, 1.1)}/>`)
      .join('') +
    `<path d="${heart(30, 44, 44)}" ${style(PAPER)}/>` +
    heartEdge(30, 44.5, 33, 20)
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" ${style('#f1bccb')}/>`)
      .join('') +
    `<path d="${heart(30, 45, 26)}" ${style('none', '#f1bccb', 0.9, ';stroke-dasharray:1.6 1.6')}/>` +
    `<path d="${heart(30, 45.5, 15)}" ${style(RED, INK, 1)}/>` +
    shine(30, 45.5, 15),
  // A red rose, the flower of love, on its stem, with its thorns.
  nightshade: () =>
    `<path d="M30 74 C30 63 31 53 30 42" ${style('none', STEM, 2.4)}/>` +
    `<path d="M30.6 66 L33.6 64.6 L31 63.2 Z M29.4 56 L26.4 54.6 L29 53.2 Z" ${style(STEM)}/>` +
    `<path d="M30 61 C22 61 16.5 56 15.5 49.5 C23 50.5 28 54.5 30 61 Z M30.5 51 C38 51 43.5 46.5 44.5 40.5 C37 41 32 45 30.5 51 Z" ${style(LEAF, INK, 0.9)}/>` +
    `<path d="M30 61 C25 57.5 21 54 17.5 51 M30.5 51 C35 48 39 45 42.5 42" ${style('none', '#2b6e40', 0.8)}/>` +
    `<path d="M18.5 34 C16 21 23 13 30 13 C37 13 44 21 41.5 34 Z" ${style('#b8143a', INK, 1.2)}/>` +
    `<path d="M15.5 26 C15.5 37 21.5 44 30 44 C38.5 44 44.5 37 44.5 26 C40.5 31 35 32.5 30 30 C25 32.5 19.5 31 15.5 26 Z" ${style('#e0284d', INK, 1.3)}/>` +
    `<path d="M23.5 25 C23 18.5 27 16 30 16 C33 16 37 18.5 36.5 25 C33 22.5 27 22.5 23.5 25 Z" ${style('#ef4766', INK, 1.1)}/>` +
    `<path d="M27 21.5 C28 19.4 32 19.4 33 21.5 C31.5 20.8 29.6 21.2 29 22.6" ${style('none', '#8e0f2c', 1)}/>` +
    `<path d="M19.5 33 C22 37 26 39 30 39 M40.5 33 C38 37 34 39 30 39" ${style('none', '#a3102f', 1)}/>`,
  // Violets, blue as the rhyme says, over their heart-shaped leaves.
  foxglove: () =>
    `<path d="M22 31 C23 46 26 60 28 74 M40 37 C38 50 34 62 32 74 M27 50 C28 58 29 66 30 74" ${style('none', STEM, 1.5)}/>` +
    `<path d="${heart(17.5, 63, 16, true)}" transform="rotate(-35 17.5 63)" ${style(LEAF, INK, 0.9)}/>` +
    `<path d="${heart(43, 64, 15, true)}" transform="rotate(35 43 64)" ${style(LEAF, INK, 0.9)}/>` +
    `<path d="M22 69 L14 57 M38.5 70 L46.5 58.5" ${style('none', '#2b6e40', 0.8)}/>` +
    violet(22, 28, 1.15) +
    violet(40, 35, 0.95) +
    violet(27, 49, 0.85),
  // A pink carnation, its petals frilled, in its green cup, with its
  // slender leaves.
  hemlock: () =>
    `<path d="M30 74 V50" ${style('none', STEM, 2.4)}/>` +
    `<path d="M30 70 C24 66 19 62 15 55 M30 64 C36 60 41 56 45 49" ${style('none', LEAF, 1.8)}/>` +
    `<path d="M24.5 40 H35.5 L33 51.5 H27 Z" ${style(LEAF, INK, 1)}/>` +
    `<path d="M14 33 L15.5 26.5 L19 30 L20.5 22.5 L24 27 L27 19.5 L30 25 L33 19.5 L36 27 L39.5 22.5 L41 30 L44.5 26.5 L46 33 C42.5 40 36.5 43 30 43 C23.5 43 17.5 40 14 33 Z" ${style(PINK, INK, 1.2)}/>` +
    `<path d="M17.5 35 L20.5 31.5 L23.5 35.5 L26.5 30.5 L30 35 L33.5 30.5 L36.5 35.5 L39.5 31.5 L42.5 35" ${style('none', DEEP_PINK, 1)}/>` +
    `<path d="M21 39.5 L24 36.5 L27 39.5 L30 36.5 L33 39.5 L36 36.5 L39 39.5" ${style('none', DEEP_PINK, 0.9)}/>`,
  // A daisy, white round its yellow eye, one petal falling: she loves me,
  // she loves me not.
  wolfsbane: () =>
    `<path d="M30 74 C30 64 31 54 30 44" ${style('none', STEM, 2.2)}/>` +
    `<path d="M30 66 C23 64 19 59 18.5 53 C24 55 28 59 30 66 Z M30.5 58 C37 56 41 51 41.5 46 C36 47.5 32 51.5 30.5 58 Z" ${style(LEAF, INK, 0.9)}/>` +
    Array.from({ length: 13 }, (_, k) => `<ellipse cx="30" cy="20.5" rx="3.2" ry="8.2" transform="rotate(${n(k * (360 / 13) + 14)} 30 30)" ${style(PAPER, INK, 0.9)}/>`).join('') +
    `<circle cx="30" cy="30" r="5.6" ${style('#ffcf33', '#c9900e', 1.1)}/>` +
    [[28, 28.4], [31.6, 28.6], [29.6, 31.6], [27.6, 31.4], [32.2, 31.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.7" ${style('#c9900e')}/>`).join('') +
    `<ellipse cx="47" cy="54" rx="2.4" ry="6.4" transform="rotate(62 47 54)" ${style(PAPER, INK, 0.9)}/>`,
  // A broken heart, cracked down its middle, its halves fallen apart.
  'lost-soul': () => {
    const crack = [[27, 40], [32.6, 45.5], [27.4, 51.5], [31.6, 57.5], [30, 64]];
    const zig = crack.map(([x, y]) => `L${x} ${y}`).join(' ');
    const back = crack.slice(0, -1).reverse().map(([x, y]) => `L${x} ${y}`).join(' ');
    const left = `M10 34 A10 10 0 0 1 30 34 ${zig} Q10 49 10 34 Z`;
    const right = `M30 34 A10 10 0 0 1 50 34 Q50 49 30 64 ${back} L30 34 Z`;
    return (
      `<g transform="translate(-2.4 0) rotate(-9 30 64)"><path d="${left}" ${style(RED, INK, 1.5)}/>${shine(30, 44, 40)}</g>` +
      `<g transform="translate(2.4 0) rotate(9 30 64)"><path d="${right}" ${style(RED, INK, 1.5)}/></g>`
    );
  },
};
