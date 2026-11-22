import { test, check, equal } from './run.js';
import { BASKET, BED } from '../js/engine/layouts.js';
import { MATCH, LOST } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { isFree } from '../js/engine/layout.js';
import { scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SHOWERS, showerOf, basketPart } from '../js/showers.js';
import { TURNS } from '../js/words.js';

const EIGHTH = SHOWERS[7];
const OPTIONS = dayOptions(EIGHTH);
// The tiles on a layer in a row, given in half tiles, by where each starts
// across.
const at = (z, y) => [...BASKET.x.keys()].filter((i) => BASKET.z[i] === z && BASKET.y[i] === y).map((i) => BASKET.x[i]).join();

test("the eighth chapter is May Day, a May basket: the full set of 144 tiles on six layers, nine across, the most of the eight, starting on the last night of April and turning over to May's side halfway", () => {
  equal(EIGHTH.name, 'The eighth chapter', "the eighth chapter's name");
  equal(EIGHTH.title, 'May Day', "the eighth chapter's title");
  equal(showerOf(BASKET), EIGHTH, "the basket's chapter");
  equal(BASKET.count, 144, 'tiles');
  equal(BASKET.width / 2, 9, 'tiles across');
  equal(BASKET.height / 2, 10, 'tiles down');
  equal(BASKET.depth, 6, 'layers');
  check(BASKET.count > BED.count, 'no more tiles than the flower bed');
  equal(OPTIONS.turnAt, 36, 'the matches before May');
  equal(OPTIONS.firstSide, 'night', "the side it starts on, April's");
  check(!OPTIONS.treats && !OPTIONS.ghostsFloat && OPTIONS.soulsFloat, 'treats, floating ghosts, or wilted flowers held down');
  equal(EIGHTH.words, 'may', 'told as April turning to May');
  equal(SHOWERS.length, 8, 'the chapters made');
  check(SHOWERS.every((d, k) => k === 0 || d.layout.count > SHOWERS[k - 1].layout.count), 'the boards do not grow through the season');
  check(['turns over', 'match on both sides', 'wilted', 'wherever they lie'].every((w) => EIGHTH.text.includes(w)), "the card doesn't tell the turn, or what a tile left alone becomes");
});

test('the basket reads as a May basket: its handle arching over the flowers, a bow tied at its top, the flowers heaped six high in the arch over its rim, and its body round-bellied', () => {
  equal(at(0, 0), '6,8,10', "the handle's top");
  equal([at(0, 1), at(0, 3), at(0, 5)].join(' '), '4,12 2,14 0,16', "the handle's sides, coming down to the rim's ends");
  equal(at(0, 2), '', 'a tile in the window under the handle');
  equal(`${at(1, 0)} ${at(2, 0)}`, '7,9 8', 'the bow, its loops and its knot');
  equal(`${at(0, 8)} ${at(1, 8)}`, '0,2,4,6,8,10,12,14,16 0,2,4,6,8,10,12,14,16', 'the rim, two high all the way across');
  equal(at(0, 4), '4,6,8,10,12', "the flowers' top, on the table, inside the handle");
  equal(at(5, 3), '7,9', 'the flowers not heaped six high in the middle');
  equal([10, 12, 14, 16, 18].map((y) => at(0, y).split(',').length).join(), '9,9,9,8,7', "the basket's body, widest low down and narrowing to its foot");
});

test("the basket's look: its handle, the bow on it, its rim and woven body, and the flowers in May's colours with leaves", () => {
  const parts = {};
  for (let i = 0; i < BASKET.count; i++) {
    const p = basketPart(BASKET, i);
    parts[p] = (parts[p] || 0) + 1;
  }
  equal(`${parts.bow} ${parts.handle} ${parts.rim} ${parts.leaf}`, '3 9 18 6', 'the bow, the handle, the rim and the leaves');
  equal(parts.weave + parts['weave-2'], 73, "the basket's woven body");
  check(Math.abs(parts.weave - parts['weave-2']) <= 3, `the weave's two shades: ${parts.weave} and ${parts['weave-2']}`);
  check(['lilac', 'pink', 'yellow', 'white'].every((c) => parts[c] >= 4), `the flowers' colours: ${JSON.stringify(parts)}`);
  equal(Object.values(parts).reduce((a, b) => a + b), 144, 'tiles with a part');
});

test("May Day's deals can be won through the turn, and a player who takes pairs that match on both sides meets no wilted flowers", () => {
  for (let seed = 1; seed <= 100; seed++) {
    const g = new Game(BASKET, { seed, ...OPTIONS });
    check(g.sideName === 'night', `seed ${seed}: not starting on April's side`);
    let wilted = null;
    for (const [a, b] of g.plan) {
      const m = g.match(a, b);
      check(m, `seed ${seed}: a pair of the deal's own order cannot be taken`);
      if (m.turned) wilted = m.souls.length;
    }
    check(g.won, `seed ${seed}: not cleared`);
    equal(`${wilted} ${g.sideName}`, '0 day', `seed ${seed}: the flowers wilted as April turned to May, and the side it ended on`);
  }
  return '100 deals';
});

test('a wilted flower can be taken wherever it lies, however it is covered or hemmed in, and only with another', () => {
  let wilted = 0;
  let held = 0;
  for (let seed = 1; seed <= 12; seed++) {
    const g = new Game(BASKET, { seed, ...OPTIONS });
    // Pairs that don't match on May's side, taken before the turn, leave
    // their partners alone there.
    while (g.turnAhead && g.pairs().length) {
      const pairs = g.pairs();
      g.match(...(pairs.find(([a, b]) => MATCH[g.sides[1][a]] !== MATCH[g.sides[1][b]]) || pairs[0]));
    }
    if (g.turnAhead) continue; // stuck before May came
    const souls = [...BASKET.x.keys()].filter((i) => g.present[i] && g.faces[i] === LOST);
    wilted += souls.length;
    held += souls.filter((i) => !isFree(BASKET, g.present, i)).length;
    for (const t of souls) check(g.isFree(t), `seed ${seed}: a wilted flower held down`);
    const pairs = g.pairs();
    check(pairs.every(([a, b]) => (g.faces[a] === LOST) === (g.faces[b] === LOST)), `seed ${seed}: a wilted flower paired with a tile of another kind`);
    if (souls.length >= 2) check(pairs.some(([a, b]) => g.faces[a] === LOST && g.faces[b] === LOST), `seed ${seed}: two wilted flowers that cannot be taken together`);
  }
  check(held > 0, 'no wilted flower was covered or hemmed in, to show it free');
  return `12 deals: ${wilted} wilted flowers, ${held} of them covered or hemmed in`;
});

test('the hints find a way through May Day, from a move of your own', () => {
  let tried = 0;
  for (let seed = 1; seed <= 10; seed++) {
    const g = new Game(BASKET, { seed, ...OPTIONS });
    const own = g.pairs().find(([a, b]) => MATCH[g.sides[1][a]] !== MATCH[g.sides[1][b]]) || g.pairs()[0];
    g.match(...own);
    g.suggest();
    if (g.outlook !== 'win') continue;
    tried++;
    while (!g.won) {
      const pair = g.hint();
      check(pair && g.match(...pair), `seed ${seed}: the hint with ${g.left} tiles left`);
      if (!pair) break;
    }
  }
  check(tried >= 8, `only ${tried} of 10 boards stayed winnable`);
  return `${tried} of 10 boards`;
});

test("May Day's score is told in its own words: May Day with no wilted flowers, or so many", () => {
  const g = new Game(BASKET, { seed: 4, ...OPTIONS });
  for (const [a, b] of g.plan) g.match(a, b);
  const rows = scoreOf(g, 0, TURNS.may.score).rows.map((r) => r[0]);
  check(rows.includes('May Day with no wilted flowers'), `the rows: ${rows.join(', ')}`);
  const w = TURNS.may;
  equal(`${w.ahead(3)} | ${w.after()} | ${w.soul}`, '🌸 <b>3</b> to May | 🌸 May Day | 🥀', 'the top bar, before and after');
  check(w.woke(2).includes('2 flowers wilt') && w.woke(1).includes('1 flower wilts') && w.woke(0) === 'Not one flower wilted.', 'the turn, told');
});
