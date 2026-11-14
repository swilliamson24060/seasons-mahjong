import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { FOUR, FIVE } from '../js/engine/layouts.js';
import { FACE, MATCH } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { seeded } from '../js/engine/rng.js';
import { COLOURS, scatter } from '../js/engine/confetti.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { COUNTDOWN, countdownOf } from '../js/newyear.js';

const FOURTH = COUNTDOWN[6];
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Perfect matches');

// Each kind's tiles still on the board, with the couples among them: two
// tiles of a kind that caught the same colour.
function couplesByKind(g) {
  const kinds = new Map();
  for (let i = 0; i < g.layout.count; i++) if (g.present[i]) kinds.set(MATCH[g.faces[i]], [...(kinds.get(MATCH[g.faces[i]]) || []), i]);
  return [...kinds.values()].map((tiles) => {
    let couples = 0;
    for (let p = 0; p < tiles.length; p++) for (let q = p + 1; q < tiles.length; q++) if (g.confetti[tiles[p]] === g.confetti[tiles[q]]) couples++;
    return { tiles: tiles.length, couples };
  });
}

test('of each kind with two pairs, two tiles catch the same colour of confetti, and none of the rest do; a kind with one pair has none', () => {
  const L = parseLayout('row', ['########']);
  const faces = facesOf('eyes-1', 'eyes-1', 'eyes-2', 'eyes-3', 'eyes-3', 'eyes-2', 'eyes-1', 'eyes-1');
  const order = [[0, 7], [1, 6], [2, 5], [3, 4]];
  for (let seed = 1; seed <= 50; seed++) {
    const c = scatter(L, order, faces, seeded(seed));
    check([...c].every((x) => x >= 0 && x < COLOURS.length), `seed ${seed}: a tile with no colour`);
    const kind = [0, 7, 1, 6];
    let couples = 0;
    for (let p = 0; p < 4; p++) for (let q = p + 1; q < 4; q++) if (c[kind[p]] === c[kind[q]]) couples++;
    equal(couples, 1, `seed ${seed}: couples among a kind's four tiles`);
    check(c[0] === c[7] || c[1] === c[6], `seed ${seed}: the couple not a pair of the order`);
    check(c[2] !== c[5] && c[3] !== c[4], `seed ${seed}: a couple of a kind with one pair`);
  }
});

test('a couple taken together is a perfect match, for points; any other pair is not, and undo takes it back', () => {
  // Four tiles of a kind, all free: the first and third a couple.
  const L = parseLayout('pairs', ['##.##']);
  const g = new Game(L, { faces: facesOf('eyes-1', 'eyes-1', 'eyes-1', 'eyes-1'), confetti: [0, 1, 0, 3] });
  let heard = 0;
  g.on('confetti', () => heard++);
  check(!g.match(0, 1).perfect && g.perfects === 0 && heard === 0, 'a pair of two colours, a perfect match');
  g.undo();
  check(g.match(0, 2).perfect && g.perfects === 1 && heard === 1, 'the couple, not a perfect match');
  check(!g.match(1, 3).perfect && g.won, 'the other two, a perfect match');
  equal(row(g)[2], POINTS.perfect, 'what a perfect match scores');
  g.undo();
  g.undo();
  check(g.perfects === 0, 'an undo did not take the perfect match back');
  const plain = new Game(L, { faces: facesOf('eyes-1', 'eyes-1', 'eyes-1', 'eyes-1') });
  check(plain.confetti === null && !plain.match(0, 2).perfect && !row(plain), 'a board without confetti has perfect matches');
});

test('a shuffle scatters the confetti again, a couple to each kind with two pairs left, and undo puts it back', () => {
  const g = new Game(FOUR, { seed: 4, ...dayOptions(FOURTH) });
  for (const [a, b] of g.plan.slice(0, 10)) g.match(a, b);
  const before = g.confetti.slice();
  check(g.shuffle(), 'the board would not shuffle');
  for (const { tiles, couples } of couplesByKind(g)) equal(couples, tiles === 4 ? 1 : 0, `couples among ${tiles} tiles of a kind`);
  g.undo();
  equal(g.confetti.join(), before.join(), 'the confetti, after an undo');
});

test('the seventh board of the countdown is the 4, with confetti: 128 tiles, nine across', () => {
  equal(FOURTH.name, 'Four', "the seventh board's number");
  equal(FOURTH.title, 'Confetti', "the 4's twist");
  equal(countdownOf(FOUR), FOURTH, "the 4's board");
  equal(FOUR.count, 128, 'tiles');
  equal(FOUR.width / 2, 9, 'tiles across');
  equal(FOUR.depth, 4, 'layers');
  equal(dayOptions(FOURTH).confetti, true, 'confetti');
  check(FOUR.count > FIVE.count, 'no more tiles than the 5');
});

test("the 4's deals can be won in the order they were dealt, which takes every couple together, every tile with a colour", () => {
  const options = dayOptions(FOURTH);
  let couples = 0;
  for (let seed = 1; seed <= 100; seed++) {
    const g = new Game(FOUR, { seed, ...options });
    check([...g.confetti].every((c) => c >= 0), `seed ${seed}: a tile with no confetti`);
    const kinds = couplesByKind(g);
    for (const { tiles, couples: n } of kinds) equal(n, tiles === 4 ? 1 : 0, `seed ${seed}: couples among ${tiles} tiles of a kind`);
    const all = kinds.reduce((sum, k) => sum + k.couples, 0);
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
    equal(g.perfects, all, `seed ${seed}: couples the deal's own order took together`);
    couples += all;
  }
  return `100 deals; ${(couples / 100).toFixed(0)} couples on each, all taken together in the deal's own order`;
});
