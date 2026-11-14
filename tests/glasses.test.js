import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { TWO, THREE } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { pathOf, over, clear, inTheWay, clearingTheWay } from '../js/engine/glasses.js';
import { POINTS, scoreOf, toastWorth } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { COUNTDOWN, countdownOf } from '../js/newyear.js';

const SECOND = COUNTDOWN[8];
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'A toast');

test('the glasses glide a place toward each other with every match, wait while a tile lies in their way, and clink as they meet, for points; and undo takes it back', () => {
  // A row of six along the path, with two tiles lying over its middle two
  // places.
  const L = parseLayout('lane', ['######', '..##..']);
  const path = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]];
  const g = new Game(L, { faces: facesOf('eyes-1', 'eyes-2', 'eyes-4', 'eyes-4', 'eyes-2', 'eyes-1', 'eyes-3', 'eyes-3'), toast: { path } });
  let heard = 0;
  g.on('toast', () => heard++);
  check(g.glasses.left === 0 && g.glasses.right === 5 && g.glassesApart === 4, 'the glasses at the two ends');
  check(g.inGlassesWay(6) && g.inGlassesWay(7) && !g.inGlassesWay(2), 'the tiles in the way: those over the path, not the bottom layer');
  check(!clear(L, g.present, pathOf(path)[2]) && clear(L, g.present, pathOf(path)[1]), 'a place with a tile over it, clear');
  g.match(0, 5);
  check(g.glasses.left === 1 && g.glasses.right === 4, 'the glasses did not glide where the way was clear');
  g.match(1, 4);
  check(g.glasses.left === 1 && g.glasses.right === 4 && !g.toastAt, 'the glasses glided through tiles in their way');
  const toasted = g.match(6, 7);
  check(toasted.toasted && g.toastAt === 3 && g.glasses.left === 2 && g.glasses.right === 3 && heard === 1, 'the glasses did not meet as their way was cleared');
  check(!g.inGlassesWay(6) && g.glassesApart === 0, 'still in the way once they met');
  equal(row(g)[2], toastWorth(g), 'what the toast scores');
  equal(toastWorth(g), POINTS.toast, 'one pair still on the board');
  equal(row(g)[1], 'on match 3, with 1 pair left', 'the toast, told');
  g.match(2, 3);
  check(g.won && g.toastAt === 3 && heard === 1, 'one toast to a board');
  g.undo();
  g.undo();
  check(!g.toastAt && g.glasses.left === 1 && g.glasses.right === 4 && g.inGlassesWay(6), 'an undo did not part the glasses again');
  g.undo();
  g.undo();
  check(g.glasses.left === 0 && g.glasses.right === 5, 'an undo did not take the glasses back');
  const plain = new Game(L, { faces: facesOf('eyes-1', 'eyes-2', 'eyes-4', 'eyes-4', 'eyes-2', 'eyes-1', 'eyes-3', 'eyes-3') });
  check(!plain.path && !plain.inGlassesWay(6) && !plain.match(0, 5).toasted && !row(plain), 'a board without glasses has them');
});

test('a deal that clears the way takes a tile in the way first, whenever one is free, with one that is not', () => {
  const way = Uint8Array.from([0, 1, 0, 1, 0]);
  equal(clearingTheWay(way)([4, 3, 2, 1, 0]).join(), '3,4,2,0,1', 'the free tiles in the order to try them');
  equal(clearingTheWay(way)([4, 2, 0]).join(), '4,2,0', 'with no tile in the way free');
});

test('the ninth board of the countdown is the 2, a toast for two: 138 tiles, nine across, the glasses\' way along its whole stroke, a tile on every other place of it', () => {
  equal(SECOND.name, 'Two', "the ninth board's number");
  equal(SECOND.title, 'A toast for two', "the 2's twist");
  equal(countdownOf(TWO), SECOND, "the 2's board");
  equal(TWO.count, 138, 'tiles');
  equal(TWO.width / 2, 9, 'tiles across');
  equal(TWO.depth, 4, 'layers');
  check(TWO.count > THREE.count, 'no more tiles than the 3');
  const path = pathOf(dayOptions(SECOND).toast.path);
  equal(path.length, 31, 'places along the way');
  equal(new Set(path.map(String)).size, path.length, 'places along the way, each once');
  path.forEach(([x, y], k) => {
    check([...TWO.x.keys()].some((i) => TWO.z[i] === 0 && TWO.x[i] === x && TWO.y[i] === y), `place ${k} of the way, off the 2`);
    if (k) check(Math.abs(x - path[k - 1][0]) + Math.abs(y - path[k - 1][1]) === 2, `place ${k} of the way, not beside the one before`);
  });
  const start = new Uint8Array(TWO.count).fill(1);
  check(clear(TWO, start, path[0]) && clear(TWO, start, path.at(-1)), 'the glasses standing under tiles');
  const blocked = path.map((p) => !clear(TWO, start, p));
  equal(blocked.map((b) => (b ? '#' : '.')).join(''), '..#.#.#.#.#.#.#.#.#.#.#.#.#.#..', 'the places with a tile over them');
  const way = inTheWay(TWO, path);
  equal(way.reduce((a, b) => a + b, 0), 14, 'tiles in the way');
  check([...way.keys()].every((i) => !way[i] || TWO.z[i] === 1), 'a tile in the way above the second layer');
  check([...way.keys()].every((i) => !way[i] || path.filter((p) => over(TWO, i, p)).length === 1), 'a tile in the way over more than one place');
});

test("the 2's deals can be won in the order they were dealt, which brings the glasses together on the way", () => {
  const options = dayOptions(SECOND);
  let at = 0;
  for (let seed = 1; seed <= 100; seed++) {
    const g = new Game(TWO, { seed, ...options });
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
    check(g.toastAt >= 15, `seed ${seed}: no toast, or one sooner than the glasses can meet`);
    at += g.toastAt;
  }
  return `100 deals; their own order brings the glasses together on match ${(at / 100).toFixed(0)} of ${TWO.count / 2}, on average, the soonest 15`;
});
