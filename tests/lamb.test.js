import { test, check, equal } from './run.js';
import { LAMB, SCALES } from '../js/engine/layouts.js';
import { MATCH, LOST } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { isFree } from '../js/engine/layout.js';
import { scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SPRING, springOf, lambPart } from '../js/spring.js';
import { TURNS } from '../js/words.js';

const EIGHTH = SPRING[7];
const OPTIONS = dayOptions(EIGHTH);
// The tiles on a layer in a row, given in half tiles, by where each starts
// across.
const at = (z, y) => [...LAMB.x.keys()].filter((i) => LAMB.z[i] === z && LAMB.y[i] === y).map((i) => LAMB.x[i]).join();

test("the eighth chapter is out like a lamb, a lamb in the new grass: the full set of 144 tiles on six layers, nine across, the most of the eight, starting on March's wild side and turning over to spring's halfway", () => {
  equal(EIGHTH.name, 'The eighth chapter', "the eighth chapter's name");
  equal(EIGHTH.title, 'Out like a lamb', "the eighth chapter's title");
  equal(springOf(LAMB), EIGHTH, "the lamb's chapter");
  equal(LAMB.count, 144, 'tiles');
  equal(LAMB.width / 2, 9, 'tiles across');
  equal(LAMB.height / 2, 10, 'tiles down');
  equal(LAMB.depth, 6, 'layers');
  check(LAMB.count > SCALES.count, 'no more tiles than the scales');
  equal(OPTIONS.turnAt, 36, 'the matches before the lamb');
  equal(OPTIONS.firstSide, 'night', "the side it starts on, March's wild side");
  check(!OPTIONS.treats && !OPTIONS.ghostsFloat && !OPTIONS.soulsFloat, 'treats, floating ghosts, or melted snowmen floating');
  equal(EIGHTH.words, 'lamb', 'told as March going out like a lamb');
  equal(SPRING.length, 8, 'the chapters made');
  check(SPRING.every((d, k) => k === 0 || d.layout.count > SPRING[k - 1].layout.count), 'the boards do not grow through the season');
  check(['turns over', 'match on both sides', 'snowman, melted', 'stay where they melted'].every((w) => EIGHTH.text.includes(w)), "the card doesn't tell the turn, or what a tile left alone becomes");
});

test('the lamb reads as a lamb in the new grass: her head and her ear, her fleece piled high, her legs, and the meadow with daisies in it', () => {
  equal(at(0, 0), '2', 'the top of her head');
  equal(at(0, 2), '0,2,4,6,8,10,12,14', 'her head, and her back');
  equal(at(0, 14), '5,8,11,14', 'her four legs');
  equal(`${at(0, 16)} | ${at(0, 18)}`, '0,2,4,6,8,10,12,14,16 | 0,2,4,6,8,10,12,14,16', 'the meadow, two rows across');
  equal(at(5, 7), '9,11', 'her fleece, piled six high');
  const parts = {};
  for (let i = 0; i < LAMB.count; i++) {
    const p = lambPart(LAMB, i);
    parts[p] = (parts[p] || 0) + 1;
  }
  equal(['fleece', 'fleece-top', 'lamb-face', 'lamb-ear', 'hoof', 'meadow', 'daisy'].map((p) => `${p} ${parts[p]}`).join(', '), 'fleece 82, fleece-top 22, lamb-face 12, lamb-ear 1, hoof 4, meadow 18, daisy 5', 'her parts, for her look');
  equal(EIGHTH.look, lambPart, 'the lamb not tinted as her parts are');
});

test("the lamb's deals can be won through the turn, and a player who takes pairs that match on both sides meets no melted snowmen", () => {
  for (let seed = 1; seed <= 100; seed++) {
    const g = new Game(LAMB, { seed, ...OPTIONS });
    check(g.sideName === 'night', `seed ${seed}: not starting on March's wild side`);
    let melted = null;
    for (const [a, b] of g.plan) {
      const m = g.match(a, b);
      check(m, `seed ${seed}: a pair of the deal's own order cannot be taken`);
      if (m.turned) melted = m.souls.length;
    }
    check(g.won, `seed ${seed}: not cleared`);
    equal(`${melted} ${g.sideName}`, '0 day', `seed ${seed}: the snowmen melted as March went out like a lamb, and the side it ended on`);
  }
  return '100 deals';
});

test('a melted snowman stays where it melted, held down as any tile is, and matches only another', () => {
  let melted = 0;
  let held = 0;
  for (let seed = 1; seed <= 12; seed++) {
    const g = new Game(LAMB, { seed, ...OPTIONS });
    // Pairs that don't match on spring's side, taken before the turn, leave
    // their partners alone there.
    while (g.turnAhead && g.pairs().length) {
      const pairs = g.pairs();
      g.match(...(pairs.find(([a, b]) => MATCH[g.sides[1][a]] !== MATCH[g.sides[1][b]]) || pairs[0]));
    }
    if (g.turnAhead) continue; // stuck before the lamb came
    const souls = [...LAMB.x.keys()].filter((i) => g.present[i] && g.faces[i] === LOST);
    melted += souls.length;
    const down = souls.filter((i) => !isFree(LAMB, g.present, i));
    held += down.length;
    for (const t of down) check(!g.isFree(t), `seed ${seed}: a melted snowman held down, free`);
    check(g.pairs().every(([a, b]) => (g.faces[a] === LOST) === (g.faces[b] === LOST)), `seed ${seed}: a melted snowman paired with a tile of another kind`);
  }
  check(melted > 0 && held > 0, `${melted} snowmen melted, ${held} held down: none to show held`);
  return `12 deals: ${melted} melted snowmen, ${held} of them covered or hemmed in`;
});

// Melted snowmen held down, a careless pair before the turn can leave one
// under its partner, and the board lost: of ten boards begun with a pair
// that doesn't match on spring's side, seven can still be won.
test('the hints find a way through out like a lamb, from a move of your own, wherever one is still there', () => {
  let tried = 0;
  for (let seed = 1; seed <= 10; seed++) {
    const g = new Game(LAMB, { seed, ...OPTIONS });
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
  check(tried >= 6, `only ${tried} of 10 boards stayed winnable`);
  return `${tried} of 10 boards stayed winnable, and the hints won them all`;
});

test("out like a lamb's score is told in its own words: out like a lamb with no melted snowmen, or so many", () => {
  const g = new Game(LAMB, { seed: 4, ...OPTIONS });
  for (const [a, b] of g.plan) g.match(a, b);
  const rows = scoreOf(g, 0, TURNS.lamb.score).rows.map((r) => r[0]);
  check(rows.includes('Out like a lamb with no melted snowmen'), `the rows: ${rows.join(', ')}`);
  const w = TURNS.lamb;
  equal(`${w.ahead(3)} | ${w.after()} | ${w.soul}`, '🦁 <b>3</b> to the lamb | 🐑 out like a lamb | ⛄', 'the top bar, before and after');
  check(w.woke(2).includes('2 snowmen melt') && w.woke(1).includes('1 snowman melts') && w.woke(0) === 'Not one snowman melted.', 'the turn, told');
  equal(w.ring(), 'lamb', 'the sound of the turn');
});
