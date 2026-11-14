import { test, check, equal } from './run.js';
import { parseLayout, isFree } from '../js/engine/layout.js';
import { NINE, TEN } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { touching } from '../js/engine/flock.js';
import { sparksOf, litPairsIn } from '../js/engine/fireworks.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { COUNTDOWN, countdownOf } from '../js/newyear.js';

const NINTH = COUNTDOWN[1];
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Lit pairs');
const sorted = (a) => JSON.stringify([...a].sort((x, y) => x - y));

test('a rocket taken bursts, lighting up the tiles touching it; two lit tiles taken together are a lit pair, for points, and undo takes it all back', () => {
  // Two rows: the rocket at the end of the top one, beside one tile and
  // above another; its partner at the far end of the bottom row.
  const L = parseLayout('sky', ['##..\n####']);
  const g = new Game(L, { faces: facesOf('eyes-2', 'eyes-1', 'eyes-3', 'eyes-2', 'eyes-3', 'eyes-1'), fireworks: [1] });
  check(g.isRocket(1) && g.rocketsLeft === 1 && !g.isLit(0), 'the rocket, before it is set off');
  let heard = 0;
  g.on('firework', () => heard++);
  const burst = g.match(1, 5);
  equal(sorted(burst.rockets), '[1]', 'the rocket that burst');
  equal(sorted(burst.lit), '[0,3]', 'the tiles it lit: the one beside it and the one below it, not the one only corner to corner');
  check(g.isLit(0) && g.isLit(3) && !g.isLit(2) && g.bursts === 1 && g.rocketsLeft === 0 && heard === 1, 'the burst');
  check(!g.match(2, 4).litPair, 'two tiles never lit, a lit pair');
  const pair = g.match(0, 3);
  check(pair.litPair && g.litPairs === 1 && heard === 2 && g.won, 'two lit tiles taken together, not a lit pair');
  equal(row(g)[2], POINTS.lit, 'what a lit pair scores');
  g.undo();
  check(g.litPairs === 0 && g.isLit(0), 'an undo did not take the lit pair back');
  g.undo();
  g.undo();
  check(!g.isLit(0) && !g.isLit(3) && g.bursts === 0 && g.rocketsLeft === 1, 'an undo did not put the rocket back unburst');

  // A rocket on top of two tiles lights the two it sat on.
  const stack = new Game(parseLayout('stack', ['##.#', '>...']), { faces: facesOf('eyes-2', 'eyes-2', 'eyes-1', 'eyes-1'), fireworks: [3] });
  equal(sorted(stack.match(3, 2).lit), '[0,1]', 'the tiles under the rocket, lit');
  check(stack.match(0, 1).litPair && stack.won, 'the two it sat on, not a lit pair');

  // On a board with no rockets, no fireworks.
  const plain = new Game(L, { faces: facesOf('eyes-2', 'eyes-1', 'eyes-3', 'eyes-2', 'eyes-3', 'eyes-1') });
  check(plain.rockets === null && plain.lit === null && !plain.isRocket(1) && !row(plain), 'a board without rockets has fireworks');
});

test('the second board of the countdown is the 9, with fireworks: 98 tiles, nine across, nine rockets', () => {
  equal(NINTH.name, 'Nine', "the second board's number");
  equal(NINTH.title, 'Fireworks', "the 9's twist");
  equal(countdownOf(NINE), NINTH, "the 9's board");
  equal(NINE.count, 98, 'tiles');
  equal(NINE.width / 2, 9, 'tiles across');
  equal(NINE.depth, 3, 'layers');
  equal(dayOptions(NINTH).fireworks, 9, 'rockets');
  check(NINE.count > TEN.count, 'no more tiles than the 10');
});

test("the 9's deals can be won in the order they were dealt, with nine rockets held down at the start, each apart from the rest, and a lit pair in the deal's own order", () => {
  const options = dayOptions(NINTH);
  let pairs = 0;
  let lit = 0;
  for (let seed = 1; seed <= 100; seed++) {
    const g = new Game(NINE, { seed, ...options });
    const rockets = [...g.rockets.keys()].filter((i) => g.rockets[i]);
    equal(rockets.length, 9, `seed ${seed}: rockets`);
    check(rockets.every((i) => !isFree(NINE, g.present, i)), `seed ${seed}: a rocket free from the start`);
    check(rockets.every((i) => sparksOf(NINE, g.present, i).length >= 3), `seed ${seed}: a rocket with fewer than three tiles round it to light`);
    for (const i of rockets) {
      for (const j of rockets) {
        check(i === j || (!touching(NINE, i, j) && !NINE.below[i].includes(j)), `seed ${seed}: two rockets touching`);
      }
    }
    const counted = litPairsIn(NINE, g.plan, g.rockets, g.present);
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
    check(g.litPairs >= 1, `seed ${seed}: the deal's own order takes no lit pair`);
    equal(g.litPairs, counted, `seed ${seed}: lit pairs taken, as the deal counted them`);
    equal(g.bursts, 9, `seed ${seed}: rockets set off`);
    pairs += g.litPairs;
    lit += g.lit.reduce((sum, x) => sum + x, 0);
  }
  return `100 deals; their own order takes ${(pairs / 100).toFixed(1)} lit pairs, and lights ${(lit / 100).toFixed(0)} tiles`;
});
