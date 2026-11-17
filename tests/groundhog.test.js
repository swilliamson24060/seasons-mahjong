import { test, check, equal } from './run.js';
import { GROUNDHOG } from '../js/engine/layouts.js';
import { Game } from '../js/engine/game.js';
import { dayOptions } from '../js/thanksgiving.js';
import { GROUNDHOG_DAY, groundhogOf, dayKey, dayBefore, daySeed, streakOf, weekTo } from '../js/groundhog.js';

const options = dayOptions(GROUNDHOG_DAY);

test("Groundhog Day's board is the same for everyone all day, and a new one comes the next", () => {
  equal(dayKey(new Date(2027, 1, 2, 9)), '2027-02-02', "a day's key");
  equal(dayKey(new Date(2027, 1, 2, 23, 59)), '2027-02-02', 'the same day, late');
  equal(daySeed('2027-02-02'), daySeed('2027-02-02'), "a day's seed, again");
  check(daySeed('2027-02-02') !== daySeed('2027-02-03'), 'two days with one seed');
  const seeds = new Set();
  let key = '2027-12-31';
  for (let k = 0; k < 365; k++, key = dayBefore(key)) seeds.add(daySeed(key));
  equal(seeds.size, 365, 'seeds through a year, each its own');
  const a = new Game(GROUNDHOG, { seed: daySeed('2027-02-02'), ...options });
  const b = new Game(GROUNDHOG, { seed: daySeed('2027-02-02'), ...options });
  equal(a.faces.join(), b.faces.join(), "two players' boards on the same day");
});

test('a day comes after the one before it, across months and years, and a week ends today', () => {
  equal(dayBefore('2027-03-01'), '2027-02-28', 'into February');
  equal(dayBefore('2028-03-01'), '2028-02-29', 'into a leap February');
  equal(dayBefore('2027-01-01'), '2026-12-31', 'into the year before');
  equal(weekTo('2027-01-03').join(), '2026-12-28,2026-12-29,2026-12-30,2026-12-31,2027-01-01,2027-01-02,2027-01-03', 'the week to the 3rd of January');
});

test("the days in a row cleared count back from today once today's is cleared, and from yesterday until then", () => {
  const days = { '2027-02-01': { clears: 1 }, '2027-02-02': { clears: 2 }, '2027-01-30': { clears: 1 } };
  equal(streakOf(days, '2027-02-02'), 2, 'cleared today and yesterday');
  equal(streakOf(days, '2027-02-03'), 2, "today's not yet cleared: the streak still holds");
  equal(streakOf(days, '2027-02-04'), 0, 'a day missed');
  equal(streakOf({}, '2027-02-02'), 0, 'none cleared');
  equal(streakOf({ '2027-02-02': { clears: 0 } }, '2027-02-02'), 0, 'played, not cleared');
});

test("Groundhog Day's board is a groundhog peeking out of his burrow: 118 tiles, nine across, his eyes two holes", () => {
  equal(groundhogOf(GROUNDHOG), GROUNDHOG_DAY, "the groundhog's board");
  equal(GROUNDHOG_DAY.name, 'Groundhog Day', 'its name');
  equal(GROUNDHOG.count, 118, 'tiles');
  equal(GROUNDHOG.width / 2, 9, 'tiles across');
  equal(GROUNDHOG.depth, 3, 'layers');
  // In half tiles: his eyes, on the fourth row, the third tile in from each side.
  for (const x of [4, 12]) check(![...GROUNDHOG.x.keys()].some((i) => Math.abs(GROUNDHOG.x[i] - x) < 2 && Math.abs(GROUNDHOG.y[i] - 6) < 2), `a tile in his eye at ${x}`);
  check(!options.treats && !options.ghostsFloat && !options.turnAt, 'a twist, but for the day itself');
});

test("every day's board through a year can be won in the order it was dealt", () => {
  let free = 0;
  let key = '2027-12-31';
  for (let k = 0; k < 365; k++, key = dayBefore(key)) {
    const g = new Game(GROUNDHOG, { seed: daySeed(key), ...options });
    free += g.freeTiles().length;
    for (const [a, b] of g.plan) check(g.match(a, b), `${key}: a pair of the deal's own order cannot be taken`);
    check(g.won, `${key}: not cleared`);
  }
  return `365 days; ${(free / 365).toFixed(0)} tiles free at the start`;
});
