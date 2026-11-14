import { test, check, equal } from './run.js';
import { parseLayout, isFree } from '../js/engine/layout.js';
import { JANUARY } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { seeded } from '../js/engine/rng.js';
import { touching } from '../js/engine/flock.js';
import { chooseSweets, holdsOut } from '../js/engine/sweets.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { COUNTDOWN, NEW_YEAR, NEW_YEARS_DAY, countdownOf, newYearOf } from '../js/newyear.js';

const facesOf = (...keys) => keys.map((key) => FACE[key]);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Resolution');

test('the sweets are tiles free at the start that hold others down, none touching another', () => {
  // A row of five, with a tile on each end and in the middle.
  const L = parseLayout('jar', ['#####', '#.#.#']);
  const present = new Uint8Array(L.count).fill(1);
  equal(chooseSweets(L, present, 3, seeded(1)).sort((a, b) => a - b).join(), '5,6,7', 'the three tiles on top');
  equal(chooseSweets(L, present, 2, seeded(1)).length, 2, 'sweets, two asked for');
  // Two tiles side by side on top of a row of four: only one of them.
  const M = parseLayout('box', ['####', '##..']);
  const sweets = chooseSweets(M, new Uint8Array(M.count).fill(1), 2, seeded(3));
  check(sweets.length === 1 && M.z[sweets[0]] === 1, `two touching sweets, or one not on top: ${sweets}`);
});

test("a sweet taken in January breaks the resolution; each match held out scores, and the whole month more; after January a sweet is fair game; and undo takes it back", () => {
  // Seven tiles apart in a row, with a sweet on the first; January two
  // matches long.
  const L = parseLayout('shelf', ['#.#.#.#.#.#.#', '#............']);
  const faces = facesOf('eyes-4', 'eyes-1', 'eyes-1', 'eyes-2', 'eyes-2', 'eyes-3', 'eyes-4', 'eyes-3');
  const g = new Game(L, { faces, sweets: { tiles: [7], days: 2 } });
  const heard = [];
  g.on('resolution', ({ gaveIn, keptMonth }) => heard.push(gaveIn ? 'gave in' : keptMonth ? 'kept' : '?'));
  check(g.isSweet(7) && g.tempting(7) && !g.isSweet(5) && g.resolving, 'the sweet, tempting, as the board starts');
  g.match(1, 2);
  check(g.daysHeld === 1 && g.resolving, 'a day held');
  const broke = g.match(5, 7);
  check(broke.gaveIn && g.brokenAt === 2 && g.daysHeld === 1 && !g.resolving && !g.resolutionKept, 'a sweet taken in January did not break the resolution');
  equal(row(g)[1], 'broken on day 2, after 1 day', 'the broken resolution, told');
  equal(row(g)[2], POINTS.held, 'what a day held scores');
  g.undo();
  check(!g.brokenAt && g.tempting(7), 'an undo did not mend the resolution');
  const kept = g.match(3, 4);
  check(kept.keptMonth && g.resolutionKept && g.daysHeld === 2 && !g.tempting(7) && g.isSweet(7), 'January seen out without a sweet, and the sweet not fair game');
  check(!g.match(5, 7).gaveIn && !g.brokenAt, 'a sweet after January broke the resolution');
  g.match(0, 6);
  check(g.won, 'not cleared');
  equal(row(g)[1], 'kept through January', 'the kept resolution, told');
  equal(row(g)[2], 2 * POINTS.held + POINTS.resolution, 'what a kept resolution scores');
  equal(heard.join(), 'gave in,kept', 'what the resolution said');
  g.undo();
  g.undo();
  g.undo();
  check(g.resolving && g.daysHeld === 1, 'an undo did not take January back');
  const plain = new Game(L, { faces });
  check(plain.sweets === null && !plain.isSweet(7) && !plain.tempting(7) && plain.daysHeld === 0 && !row(plain), 'a board without sweets has them');
});

test("New Year's Day comes after the countdown, on January's calendar: 118 tiles, nine across, six sweets to leave alone for 31 matches", () => {
  equal(NEW_YEARS_DAY.name, "New Year's Day", 'the day');
  equal(NEW_YEARS_DAY.title, 'Resolutions', 'its twist');
  equal(NEW_YEAR.length, COUNTDOWN.length + 1, "New Year's boards");
  equal(NEW_YEAR.at(-1), NEW_YEARS_DAY, 'the last of them');
  equal(newYearOf(JANUARY), NEW_YEARS_DAY, "January's day");
  check(!countdownOf(JANUARY) && newYearOf(COUNTDOWN[0].layout) === COUNTDOWN[0], 'one of the countdown');
  equal(JANUARY.count, 118, 'tiles');
  equal(JANUARY.width / 2, 9, 'tiles across');
  equal(JANUARY.depth, 4, 'layers');
  equal(JSON.stringify(dayOptions(NEW_YEARS_DAY).sweets), JSON.stringify({ count: 6, days: 31 }), 'six sweets, through January');
  check(JANUARY.count / 2 > 31 + 10, 'January too much of the board');
});

test("New Year's Day's deals can be won in their own order, which leaves the sweets alone through January, each free at the start and holding a tile down", () => {
  const options = dayOptions(NEW_YEARS_DAY);
  let free = 0;
  for (let seed = 1; seed <= 100; seed++) {
    const g = new Game(JANUARY, { seed, ...options });
    const sweets = [...g.sweets.keys()].filter((i) => g.sweets[i]);
    equal(sweets.length, 6, `seed ${seed}: sweets`);
    for (const i of sweets) check(isFree(JANUARY, g.present, i) && JANUARY.below[i].length > 0, `seed ${seed}: a sweet held down or holding nothing`);
    check(sweets.every((i) => sweets.every((j) => !touching(JANUARY, i, j))), `seed ${seed}: two sweets touching`);
    check(holdsOut(g.plan, g.sweets, 31), `seed ${seed}: the deal's own order takes a sweet in January`);
    free += g.freeTiles().length;
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won && g.resolutionKept && g.daysHeld === 31, `seed ${seed}: the resolution not kept`);
  }
  return `100 deals; ${(free / 100).toFixed(0)} tiles free at the start`;
});

test('a shuffle in January deals the board again so that the sweets can still be left alone through it, the line the hints follow keeping to it', () => {
  const options = dayOptions(NEW_YEARS_DAY);
  for (let seed = 1; seed <= 40; seed++) {
    const g = new Game(JANUARY, { seed, ...options });
    for (const [a, b] of g.plan.slice(0, 12)) g.match(a, b);
    check(g.shuffle(), `seed ${seed}: the board would not shuffle`);
    check(holdsOut(g.line, g.sweets, g.january - g.matches), `seed ${seed}: the new deal's line takes a sweet in January`);
    while (!g.won) {
      const pair = g.hint();
      check(pair && g.match(...pair), `seed ${seed}: the hint with ${g.left} tiles left`);
      if (!pair) break;
    }
    check(g.won && g.resolutionKept, `seed ${seed}: following the hints after a shuffle broke the resolution`);
  }
});
