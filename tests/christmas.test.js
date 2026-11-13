import { test, check, equal } from './run.js';
import { PEARTREE } from '../js/engine/layouts.js';
import { Game } from '../js/engine/game.js';
import { dayOptions } from '../js/thanksgiving.js';
import { TWELVE_DAYS, dayOfChristmas } from '../js/christmas.js';

const FIRST = TWELVE_DAYS[0];

test("Christmas's days each have their board, none more than nine tiles across, each its own", () => {
  for (const d of TWELVE_DAYS) {
    check(d.layout && d.title && d.text && d.sky, `${d.name} is not made`);
    check(d.layout.width / 2 <= 9, `${d.name}'s board is ${d.layout.width / 2} tiles across`);
  }
  equal(new Set(TWELVE_DAYS.map((d) => d.layout)).size, TWELVE_DAYS.length, 'boards, one a day');
  check(TWELVE_DAYS.length <= 12, `${TWELVE_DAYS.length} days, more than twelve`);
});

test('the first day is a partridge in a pear tree, the gentle start: the fewest tiles of the twelve, and no twist', () => {
  equal(FIRST.title, 'A partridge in a pear tree', "the first day's gift");
  equal(dayOfChristmas(PEARTREE), FIRST, "the pear tree's day");
  equal(PEARTREE.count, 80, 'tiles');
  equal(PEARTREE.width / 2, 9, 'tiles across');
  equal(PEARTREE.depth, 2, 'layers');
  check(TWELVE_DAYS.every((d) => d === FIRST || d.layout.count > PEARTREE.count), 'the fewest tiles of the twelve');
  equal(JSON.stringify(dayOptions(FIRST)), JSON.stringify({ treats: false, ghostsFloat: false }), 'no twist');
});

test("the first day's deals can be won in the order they were dealt, with its pears free from the start", () => {
  const options = dayOptions(FIRST);
  let free = 0;
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(PEARTREE, { seed, ...options });
    free += g.freeTiles().length;
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
  }
  // The pears hang on their own, half a tile below the boughs.
  const pears = [...PEARTREE.y.keys()].filter((i) => PEARTREE.y[i] % 2 === 1);
  equal(pears.length, 2, 'pears');
  const g = new Game(PEARTREE, { seed: 1, ...options });
  for (const i of pears) check(g.isFree(i), 'a pear is not free at the start');
  return `200 deals; ${(free / 200).toFixed(0)} tiles free at the start`;
});
