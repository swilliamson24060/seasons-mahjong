import { test, check, equal } from './run.js';
import * as layouts from '../js/engine/layouts.js';
import { BOW, HEART, ENVELOPE, ROSES, CANDLES } from '../js/engine/layouts.js';
import { Game } from '../js/engine/game.js';
import { dayOptions } from '../js/thanksgiving.js';
import { LOVE_STORY, chapterOf } from '../js/valentines.js';
import { theme } from '../js/themes.js';
import { candlelitIn } from '../js/engine/candles.js';
import { FACE_SETS, faceName } from '../js/ui/faces.js';
import { FACE } from '../js/engine/tiles.js';

const FIRST = LOVE_STORY[0];
const SECOND = LOVE_STORY[1];
const THIRD = LOVE_STORY[2];
const FOURTH = LOVE_STORY[3];
const FIFTH = LOVE_STORY[4];

// The tiles of a layout's bottom layer in a row, given in half tiles, by
// where each starts across.
const across = (L, y) => [...L.x.keys()].filter((i) => L.z[i] === 0 && L.y[i] === y).map((i) => L.x[i]);

test("Valentine's love story is told in chapters, each its own board, none more than nine tiles across", () => {
  for (const d of LOVE_STORY) {
    check(d.layout && d.title && d.text && d.sky, `${d.name} is not made`);
    check(d.layout.width / 2 <= 9, `${d.name}'s board is ${d.layout.width / 2} tiles across`);
  }
  equal(new Set(LOVE_STORY.map((d) => d.layout)).size, LOVE_STORY.length, 'boards, one a chapter');
  check(LOVE_STORY.length <= 8, `${LOVE_STORY.length} chapters, more than eight`);
  check(!theme('valentines').ready, "Valentine's Day ready, with its boards still being made");
});

test("the first chapter is Cupid's bow, the gentle start: 72 tiles on four layers, nine across, and no twist", () => {
  equal(FIRST.name, 'The first chapter', "the first chapter's name");
  equal(FIRST.title, "Cupid's bow", "the first chapter's title");
  equal(chapterOf(BOW), FIRST, "the bow's chapter");
  check(Object.keys(layouts).includes('BOW'), 'the bow plays by its address, #play/bow');
  equal(BOW.count, 72, 'tiles');
  equal(BOW.width / 2, 9, 'tiles across');
  equal(BOW.depth, 4, 'layers');
  check(LOVE_STORY.every((d) => d === FIRST || d.layout.count > BOW.count), 'the fewest tiles of the eight');
  equal(JSON.stringify(dayOptions(FIRST)), JSON.stringify({ treats: false, ghostsFloat: false }), 'no twist');
});

test("Cupid's bow reads as a bow and arrow: the head above the bow, the bow open round the arrow, and the string pulled back to a V", () => {
  // In half tiles: a tile at x covers x to x + 2 across, its row y to y + 2.
  equal(across(BOW, 0).join(), '8', "the arrow's tip");
  equal(across(BOW, 4).join(), '4,6,8,10,12', "the arrowhead's barbs");
  equal(across(BOW, 6).join(), '8', 'the shaft alone between the head and the bow');
  equal(across(BOW, 14).join(), '0,8,16', 'the bow open round the arrow, its tips on either side');
  equal(across(BOW, 18).join(), '4,8,12', 'the string coming in to the arrow');
  equal(across(BOW, 20).join(), '6,8,10', 'the string meeting the arrow at its feathers');
  // The arrow runs down the middle, its shaft raised three high.
  const shaft = [...BOW.x.keys()].filter((i) => BOW.x[i] === 8 && BOW.y[i] >= 6 && BOW.y[i] <= 18);
  equal(shaft.length, 7 * 3, 'tiles of the shaft, from below the head down to the string, on three layers');
});

test("Valentine's tiles are named as the holiday is, so that the turtle wears them too with Valentine's chosen, and a tile left without a partner is a broken heart", () => {
  check(FACE_SETS.includes(theme('valentines').id), "no set of faces called as Valentine's Day is");
  equal(faceName(FACE['lost-soul'], 'valentines'), 'Broken heart', 'the lost soul, for Be mine');
});

test("Cupid's bow's deals can be won in the order they were dealt, with the bow's string free from the start", () => {
  const options = dayOptions(FIRST);
  let free = 0;
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(BOW, { seed, ...options });
    free += g.freeTiles().length;
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
  }
  // The string's tiles, from each tip in to the arrow, as its card says.
  const string = [...BOW.x.keys()].filter((i) => BOW.z[i] === 0 && ((BOW.y[i] === 16 && BOW.x[i] !== 8) || (BOW.y[i] === 18 && BOW.x[i] !== 8)));
  equal(string.length, 4, "the string's tiles");
  const g = new Game(BOW, { seed: 1, ...options });
  for (const i of string) check(g.isFree(i), "a tile of the bow's string is not free at the start");
  check(FIRST.text.includes("bow's string"), "the card doesn't tell the free-tile rule by the string");
  return `200 deals; ${(free / 200).toFixed(0)} tiles free at the start`;
});

test("the second chapter is love at first sight, a heart pierced by Cupid's arrow: 92 tiles on three layers, nine across, an arrow every eight matches", () => {
  equal(SECOND.name, 'The second chapter', "the second chapter's name");
  equal(SECOND.title, 'Love at first sight', "the second chapter's title");
  equal(chapterOf(HEART), SECOND, "the heart's chapter");
  check(Object.keys(layouts).includes('HEART'), 'the heart plays by its address, #play/heart');
  equal(HEART.count, 92, 'tiles');
  equal(HEART.width / 2, 9, 'tiles across');
  equal(HEART.depth, 3, 'layers');
  check(HEART.count > BOW.count, 'no more tiles than the bow');
  equal(dayOptions(SECOND).arrows, 8, 'an arrow every eight matches');
  check(SECOND.text.includes('love at first sight') && SECOND.text.includes('30 points'), "the card doesn't say what the arrows are for");
});

test('the pierced heart reads as a heart with an arrow through it, sticking out at both ends: its feathers at the upper left and its head at the lower right', () => {
  equal(across(HEART, 0).join(), '2', "the feathers' tip");
  equal(across(HEART, 2).join(), '0,2', 'the feathers');
  equal(across(HEART, 4).join(), '2,4,6,10,12,14', "the heart's two lobes, the notch between them");
  equal(across(HEART, 6).join(), '0,2,4,6,8,10,12,14,16', 'the heart at its widest');
  equal(across(HEART, 16).join(), '8,12,14,16', "the heart's point, and the arrow's head beside it");
  // The arrow runs across it, raised, on the top layer from its feathers
  // to its head.
  equal([...HEART.x.keys()].filter((i) => HEART.z[i] === 2).length, 10, 'tiles of the arrow on the top layer');
});

test("the pierced heart's deals can be won in the order they were dealt, Cupid letting fly six times", () => {
  const options = dayOptions(SECOND);
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(HEART, { seed, ...options });
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
    equal(g.arrowsFlown, 6, `seed ${seed}: arrows over 46 matches`);
  }
  return '200 deals';
});

test('the third chapter is a secret admirer, a valentine in its envelope: 100 tiles on three layers, nine across and seven down, with sweet nothings on candy hearts', () => {
  equal(THIRD.name, 'The third chapter', "the third chapter's name");
  equal(THIRD.title, 'A secret admirer', "the third chapter's title");
  equal(chapterOf(ENVELOPE), THIRD, "the envelope's chapter");
  check(Object.keys(layouts).includes('ENVELOPE'), 'the envelope plays by its address, #play/envelope');
  equal(ENVELOPE.count, 100, 'tiles');
  equal(ENVELOPE.width / 2, 9, 'tiles across');
  equal(ENVELOPE.height / 2, 7, 'tiles down');
  equal(ENVELOPE.depth, 3, 'layers');
  check(ENVELOPE.count > HEART.count, 'no more tiles than the heart');
  equal(dayOptions(THIRD).sweethearts, true, 'sweet nothings on candy hearts');
  check(['BE and MINE', 'TRUE and LOVE', 'HUG and ME', 'SWEET and TALK', 'very next match', '40 points'].every((w) => THIRD.text.includes(w)), "the card doesn't tell the messages, or what saying one is worth");
});

test("the envelope reads as a valentine in its envelope: its flap closed in a V down to the middle, a gap along it on both the lower layers, and a heart sealing it at its point, on top", () => {
  equal(across(ENVELOPE, 0).join(), '2,4,6,8,10,12,14', "the envelope's top edge, under the flap");
  equal(across(ENVELOPE, 12).join(), '0,2,4,6,8,10,12,14,16', "the envelope's foot");
  // The V: on each of the rows down to the middle, a gap a tile in from
  // either side, coming in a tile a row, on both the lower layers.
  for (const z of [0, 1]) {
    for (let r = 1; r <= 4; r++) {
      const gap = [2 * r, 16 - 2 * r];
      check(!gap.some((x) => [...ENVELOPE.x.keys()].some((i) => ENVELOPE.z[i] === z && ENVELOPE.y[i] === 2 * r && ENVELOPE.x[i] === x)), `layer ${z + 1}, row ${r + 1}: no gap for the flap's V at ${gap.join(' and ')}`);
    }
  }
  // The seal: on top, below the flap's top rows, two lobes side by side
  // and the point between them, below, over the V's point.
  const seal = [...ENVELOPE.x.keys()].filter((i) => ENVELOPE.z[i] === 2 && ENVELOPE.y[i] >= 4).map((i) => `${ENVELOPE.x[i]},${ENVELOPE.y[i]}`);
  equal(seal.join(' '), '7,5 9,5 8,7', "the heart seal's tiles");
});

test("the envelope's deals can be won in the order they were dealt, saying every sweet nothing", () => {
  const options = dayOptions(THIRD);
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(ENVELOPE, { seed, ...options });
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
    equal(g.messagesSaid, 4, `seed ${seed}: sweet nothings said`);
  }
  return '200 deals';
});

test('the fourth chapter is a dozen roses, a vase of roses: 102 tiles on three layers, nine across and eleven down, its twelve roses in bloom one after another', () => {
  equal(FOURTH.name, 'The fourth chapter', "the fourth chapter's name");
  equal(FOURTH.title, 'A dozen roses', "the fourth chapter's title");
  equal(chapterOf(ROSES), FOURTH, "the vase's chapter");
  check(Object.keys(layouts).includes('ROSES'), 'the vase plays by its address, #play/roses');
  equal(ROSES.count, 102, 'tiles');
  equal(ROSES.width / 2, 9, 'tiles across');
  equal(ROSES.height / 2, 11, 'tiles down');
  equal(ROSES.depth, 3, 'layers');
  check(ROSES.count > ENVELOPE.count, 'no more tiles than the envelope');
  equal(JSON.stringify(dayOptions(FOURTH).roses), JSON.stringify({ count: 12, every: 3, lasts: 6 }), 'twelve roses, one opening every three matches, each in bloom for six');
  check(['third match', 'every three matches', 'in bloom for six', '20 points', 'in bud is wasted', 'wilts'].every((w) => FOURTH.text.includes(w)), "the card doesn't tell how the roses open, or what one is worth");
});

test('the vase of roses reads as twelve roses raised two high over the bouquet, its leaves hanging at its sides, and the vase beneath, its neck narrow and its belly round', () => {
  equal(across(ROSES, 0).join(), '4,8,12', 'the bouquet at its top');
  equal(across(ROSES, 4).join(), '0,2,4,6,8,10,12,14,16', 'the bouquet at its widest');
  equal(across(ROSES, 10).join(), '2,6,8,10,14', 'the leaves at the sides, the stems between');
  equal(across(ROSES, 14).join(), '6,8,10', "the vase's neck");
  equal(across(ROSES, 18).join(), '2,4,6,8,10,12,14', "the vase's belly");
  // The roses: the twelve on top over the bouquet, each on another.
  const top = [...ROSES.x.keys()].filter((i) => ROSES.z[i] === 2 && ROSES.y[i] < 12);
  equal(top.length, 12, 'roses on top');
  check(top.every((i) => [...ROSES.x.keys()].some((j) => ROSES.z[j] === 1 && ROSES.x[j] === ROSES.x[i] && ROSES.y[j] === ROSES.y[i])), 'a rose not raised two high');
});

test("the vase's deals can be won in the order they were dealt, gathering every rose", () => {
  const options = dayOptions(FOURTH);
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(ROSES, { seed, ...options });
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
    equal(g.bouquet, 12, `seed ${seed}: roses gathered`);
  }
  return '200 deals';
});

test('the fifth chapter is the first date, dinner by candlelight: 108 tiles on four layers, nine across and ten and a half down, its candles glowing', () => {
  equal(FIFTH.name, 'The fifth chapter', "the fifth chapter's name");
  equal(FIFTH.title, 'The first date', "the fifth chapter's title");
  equal(chapterOf(CANDLES), FIFTH, "the candles' chapter");
  check(Object.keys(layouts).includes('CANDLES'), 'the candles play by their address, #play/candles');
  equal(CANDLES.count, 108, 'tiles');
  equal(CANDLES.width / 2, 9, 'tiles across');
  equal(CANDLES.height / 2, 10.5, 'tiles down, the table a half tile lower at the front');
  equal(CANDLES.depth, 4, 'layers');
  check(CANDLES.count > ROSES.count, 'no more tiles than the vase');
  equal(JSON.stringify(dayOptions(FIFTH).candles), JSON.stringify({ every: 6, deep: 3, pairs: 6 }), 'the glow sinking every six matches, three rows deep, and six candlelit pairs in the deal');
  check(["Each candle's glow", 'a tile in each glow', '20 points', 'Every six matches', 'gutter out'].every((w) => FIFTH.text.includes(w)), "the card doesn't tell the glow, or what a candlelit pair is worth");
});

test('the first date reads as two tall candles, his and hers, their flames above them, in their candlesticks on the table', () => {
  equal(across(CANDLES, 0).join(), '3,13', 'the two flames');
  equal(across(CANDLES, 3).join(), '2,4,12,14', 'the two candles, two tiles wide');
  equal(across(CANDLES, 13).join(), '1,3,5,11,13,15', "the candlesticks' drip trays");
  equal(across(CANDLES, 15).join(), '3,13', "the candlesticks' stems");
  equal(across(CANDLES, 19).join(), '0,2,4,6,8,10,12,14,16', 'the table');
  // Each flame and each candle's middle, four high.
  for (const x of [3, 13]) {
    for (const y of [0, 3, 5, 7, 9, 11]) {
      equal([...CANDLES.x.keys()].filter((i) => CANDLES.x[i] === x && CANDLES.y[i] === y && CANDLES.z[i] > 0).length, 3, `the stack at ${x},${y}, over the bottom layer`);
    }
  }
});

test("the first date's deals can be won in the order they were dealt, each taking six candlelit pairs or more", () => {
  const options = dayOptions(FIFTH);
  let lit = 0;
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(CANDLES, { seed, ...options });
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
    check(g.candlelitPairs >= 6 && g.candlelitPairs === candlelitIn(CANDLES, g.plan, options.candles), `seed ${seed}: ${g.candlelitPairs} candlelit pairs`);
    lit += g.candlelitPairs;
  }
  return `200 deals, ${(lit / 200).toFixed(1)} candlelit pairs each`;
});
