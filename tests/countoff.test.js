import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { FLAG } from '../js/engine/layouts.js';
import { FACE, FACES } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { numberOf, after, nextOf, layCount } from '../js/engine/countoff.js';
import { seeded } from '../js/engine/rng.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { INDEPENDENCE } from '../js/independence.js';

const SECOND = INDEPENDENCE[1];
const OPTIONS = dayOptions(SECOND);
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Counted off');

// A row of eight, its ends free: 0 and 7, then 1 and 6, and so on in.
const ROW = parseLayout('row', ['########']);

test("a face's number is its number in its suit, one to nine, and the winds, the dragons, the flowers and the moons have none; the count goes round from nine to one, passing over numbers with none left", () => {
  equal(['eyes-1', 'bones-5', 'graves-9', 'vampire', 'lantern', 'nightshade', 'full-moon'].map((k) => numberOf(FACE[k])).join(), '1,5,9,0,0,0,0', 'the numbers');
  equal([1, 8, 9].map(after).join(), '2,9,1', 'the next numbers');
  equal(nextOf(4, (n) => n !== 4 && n !== 5), 6, 'four and five passed over, with none left');
  equal(nextOf(8, (n) => n === 2), 2, 'round from eight past nine and one to two');
  equal(nextOf(3, () => false), 0, 'nothing left to count');
});

test("the deal lays the count along its own order, whole pairs moved from place to place, so that it still wins and counts off as its numbers allow", () => {
  const order = [[0, 7], [1, 6], [2, 5], [3, 4]];
  const faces = Int16Array.from(facesOf('eyes-3', 'vampire', 'eyes-2', 'eyes-1', 'eyes-1', 'eyes-2', 'vampire', 'eyes-3'));
  const laid = layCount(order, faces, 1, seeded(1), 0);
  equal(order.map(([a, b]) => `${numberOf(laid[a])}${numberOf(laid[b])}`).join(' '), '11 22 33 00', 'counted off one, two, three in turn, the wind after');
  equal(order.every(([a, b]) => FACES[laid[a]].kind === FACES[laid[b]].kind), true, 'every pair of the order still a pair');
});

test('a pair of the next number counts off, for points, and the count goes on; another leaves it; an undo takes it back', () => {
  // 0 and 7 ones, 1 and 6 a wind, 2 and 5 twos, 3 and 4 fives.
  const faces = facesOf('eyes-1', 'vampire', 'bones-2', 'graves-5', 'graves-5', 'bones-2', 'vampire', 'eyes-1');
  const g = new Game(ROW, { faces, countOff: true });
  equal(`${g.countNext} ${g.countOffs}`, '1 0', 'counting from one');
  const heard = [];
  g.on('count', (e) => heard.push(e.countedOff));
  check(g.match(0, 7).countedOff === 1, 'the ones not counted off');
  equal(g.countNext, 2, 'two next');
  check(g.match(1, 6).countedOff === 0 && g.countNext === 2, 'the wind moving the count');
  check(g.match(2, 5).countedOff === 2, 'the twos not counted off');
  equal(g.countNext, 5, 'three and four passed over, with none left, five next');
  check(g.match(3, 4).countedOff === 5 && g.won, 'the fives not counted off');
  equal(`${g.countNext} ${heard.join()}`, '0 1,2,5', 'nothing left to count, and the count heard');
  equal(`${row(g)[1]} ${row(g)[2]}`, `3 × ${POINTS.count} ${3 * POINTS.count}`, 'the pairs counted off, and what they score');
  g.undo();
  g.undo();
  equal(`${g.countNext} ${g.countOffs}`, '2 1', 'two undone, the count back at two');
});

test("the flag's deals count off in their own order and win, following the hints counts off at least as often, and a shuffle's new deal still wins", () => {
  let least = Infinity;
  let total = 0;
  for (let seed = 1; seed <= 100; seed++) {
    const g = new Game(FLAG, { seed, ...OPTIONS });
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: the deal's own order not winning`);
    least = Math.min(least, g.countOffs);
    total += g.countOffs;
  }
  check(least >= 12, `a deal's own order counting off only ${least} times`);
  let hinted = 0;
  for (let seed = 1; seed <= 8; seed++) {
    const g = new Game(FLAG, { seed, ...OPTIONS });
    while (!g.won) {
      const pair = g.hint();
      check(pair && g.match(...pair), `seed ${seed}: the hint with ${g.left} tiles left`);
      if (!pair) break;
    }
    hinted += g.countOffs;
  }
  check(hinted / 8 >= total / 100, `the hints counting off ${hinted / 8} times a board, the deals' own order ${total / 100}`);
  const g = new Game(FLAG, { seed: 4, ...OPTIONS });
  for (const [a, b] of g.plan.slice(0, 15)) g.match(a, b);
  const next = g.countNext;
  check(g.shuffle(), 'the shuffle');
  equal(g.countNext, next, 'the count moved by the shuffle');
  for (const [a, b] of g.line.slice()) check(g.match(a, b), "a pair of the shuffle's new deal cannot be taken");
  check(g.won, "the shuffle's new deal not won");
  return `${(total / 100).toFixed(1)} counted off of 46 pairs in a deal's own order, ${least} at the least; ${(hinted / 8).toFixed(1)} following the hints`;
});
