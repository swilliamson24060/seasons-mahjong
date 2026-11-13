import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { SONGBIRD } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { touching } from '../js/engine/flock.js';
import { Game } from '../js/engine/game.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { TWELVE_DAYS, dayOfChristmas } from '../js/christmas.js';

const FOURTH = TWELVE_DAYS[3];
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const board = (drawing, faces, flock = true) => new Game(parseLayout('perch', [drawing]), { faces: facesOf(...faces), flock });

test('two tiles touch side by side, or one just above the other, on the same layer: not corner to corner, or across a gap', () => {
  // Three tiles in a row with a gap before the third, and one under the first.
  const L = parseLayout('perch', ['##.#\n#...']);
  check(touching(L, 0, 1), 'side by side');
  check(!touching(L, 0, 2), 'across a gap');
  check(touching(L, 0, 3), 'one just above the other');
  check(!touching(L, 1, 3), 'corner to corner');
  // A tile half a tile lower beside another still touches it.
  const H = parseLayout('half', ['#v']);
  check(touching(H, 0, 1), 'beside a tile half a tile lower');
  const Z = parseLayout('stack', ['##', '##']);
  check(!touching(Z, 0, 2), 'on different layers');
});

test('a pair whose two tiles touch flocks together, for points, and undo takes it back', () => {
  const g = board('##.##', ['eyes-1', 'eyes-1', 'eyes-2', 'eyes-2']);
  let heard = 0;
  g.on('flock', () => heard++);
  check(g.match(0, 1).flock && g.flocks === 1 && heard === 1, 'a pair side by side did not flock');
  equal(scoreOf(g, 0).rows.find((r) => r[0] === 'Birds of a feather')[2], POINTS.flock, 'what it scores');
  g.undo();
  equal(g.flocks, 0, 'taken back with an undo');
  const above = board('#\n#', ['eyes-1', 'eyes-1']);
  check(above.match(0, 1).flock, 'a pair one above the other did not flock');
  const apart = board('#.#', ['eyes-1', 'eyes-1']);
  check(!apart.match(0, 1).flock && apart.flocks === 0, 'a pair apart flocked');
  const plain = board('##', ['eyes-1', 'eyes-1'], false);
  check(!plain.match(0, 1).flock && plain.flocks === 0, 'a pair flocked on a board without it');
  check(!scoreOf(plain, 0).rows.some((r) => r[0] === 'Birds of a feather'), 'a row for it on a board without it');
});

test('the fourth day is four calling birds, on a songbird of 96 tiles, nine across, with birds of a feather', () => {
  equal(FOURTH.title, 'Four calling birds', "the fourth day's gift");
  equal(dayOfChristmas(SONGBIRD), FOURTH, "the songbird's day");
  equal(SONGBIRD.count, 96, 'tiles');
  equal(SONGBIRD.width / 2, 9, 'tiles across');
  equal(SONGBIRD.depth, 3, 'layers');
  equal(dayOptions(FOURTH).flock, true, 'birds of a feather');
  check(TWELVE_DAYS[2].layout.count < SONGBIRD.count, 'no more tiles than the third day');
});

test("the fourth day's deals can be won in the order they were dealt, and that order always takes a pair that flocks", () => {
  const options = dayOptions(FOURTH);
  let found = 0;
  let most = 0;
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(SONGBIRD, { seed, ...options });
    const inPlan = g.plan.filter(([a, b]) => touching(SONGBIRD, a, b)).length;
    check(inPlan >= 1, `seed ${seed}: no pair that flocks in the deal's order`);
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
    equal(g.flocks, inPlan, `seed ${seed}: pairs that flocked`);
    found += inPlan;
    most = Math.max(most, inPlan);
  }
  return `200 deals; the deal's own order takes ${(found / 200).toFixed(1)} pairs that flock, ${most} at most`;
});
