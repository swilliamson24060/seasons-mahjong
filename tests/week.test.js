import { test, check, equal } from './run.js';
import { HIGHWAY } from '../js/engine/layouts.js';
import { Game } from '../js/engine/game.js';
import { DAYS, dayOf, dayOptions } from '../js/thanksgiving.js';

const SUNDAY = DAYS[0];

test('every day of Thanksgiving week has its board, none more than nine tiles across, each its own', () => {
  for (const d of DAYS) {
    check(d.layout && d.title && d.text && d.sky, `${d.name} is not made`);
    check(d.layout.width / 2 <= 9, `${d.name}'s board is ${d.layout.width / 2} tiles across`);
  }
  equal(new Set(DAYS.map((d) => d.layout)).size, 8, 'boards, one a day');
});

test("the first Sunday is traffic, on the highway, the week's gentle start: its fewest tiles, and no twist", () => {
  equal(SUNDAY.title, 'Traffic', "the first Sunday's theme");
  equal(dayOf(HIGHWAY), SUNDAY, "the highway's day");
  equal(HIGHWAY.count, 84, 'tiles');
  equal(HIGHWAY.width / 2, 9, 'tiles across');
  check(DAYS.every((d) => d === SUNDAY || !d.layout || d.layout.count > HIGHWAY.count), 'the fewest tiles of the week');
  equal(JSON.stringify(dayOptions(SUNDAY)), JSON.stringify({ treats: false, ghostsFloat: false }), 'no twist');
});

test("the first Sunday's deals can be won in the order they were dealt", () => {
  const options = dayOptions(SUNDAY);
  let free = 0;
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(HIGHWAY, { seed, ...options });
    free += g.freeTiles().length;
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
  }
  return `200 deals; ${(free / 200).toFixed(0)} tiles free at the start`;
});
