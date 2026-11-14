import { test, check, equal } from './run.js';
import * as layouts from '../js/engine/layouts.js';
import { TEN } from '../js/engine/layouts.js';
import { Game } from '../js/engine/game.js';
import { dayOptions } from '../js/thanksgiving.js';
import { COUNTDOWN, NEW_YEAR, NEW_YEARS_DAY, countdownOf } from '../js/newyear.js';
import { NOTCHES, ballAt, ballWords, ballDrop } from '../js/ui/ball.js';

const FIRST = COUNTDOWN[0];
const NUMBERS = ['Ten', 'Nine', 'Eight', 'Seven', 'Six', 'Five', 'Four', 'Three', 'Two', 'One'];

test("New Year's countdown is counted down from ten, each board its own, none more than nine tiles across", () => {
  for (const d of COUNTDOWN) {
    check(d.layout && d.title && d.text && d.sky, `${d.name} is not made`);
    check(d.layout.width / 2 <= 9, `${d.name}'s board is ${d.layout.width / 2} tiles across`);
  }
  check(COUNTDOWN.length <= 10, `${COUNTDOWN.length} boards, more than ten`);
  COUNTDOWN.forEach((d, k) => equal(d.name, NUMBERS[k], `board ${k + 1}'s number`));
  equal(new Set(COUNTDOWN.map((d) => d.layout)).size, COUNTDOWN.length, 'boards, one a number');
});

test('the first board is the 10, the gentle start: the fewest tiles of the ten, and no twist', () => {
  equal(countdownOf(TEN), FIRST, "the 10's board");
  check(Object.keys(layouts).includes('TEN'), 'the 10 plays by its address, #play/ten');
  equal(TEN.count, 88, 'tiles');
  equal(TEN.width / 2, 9, 'tiles across');
  equal(TEN.depth, 2, 'layers');
  check(COUNTDOWN.every((d) => d === FIRST || d.layout.count > TEN.count), 'the fewest tiles of the ten');
  equal(JSON.stringify(dayOptions(FIRST)), JSON.stringify({ treats: false, ghostsFloat: false }), 'no twist');
});

test('the 10 reads as a 10: the 1 stands apart from the 0, and the 0 is open in its middle', () => {
  // In half-tile units: a tile at x covers x to x + 2 across.
  const at = (from, to) => [...TEN.x.keys()].filter((i) => TEN.x[i] + 2 > from && TEN.x[i] < to);
  equal(at(6, 8).length, 0, 'tiles between the 1 and the 0');
  const hole = at(12, 14).filter((i) => TEN.y[i] >= 4 && TEN.y[i] < 16);
  equal(hole.length, 0, "tiles in the 0's middle");
  check(at(0, 6).length > 0 && at(8, 18).length > 0, 'the 1 and the 0');
});

test("the 10's deals can be won in the order they were dealt", () => {
  const options = dayOptions(FIRST);
  let free = 0;
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(TEN, { seed, ...options });
    free += g.freeTiles().length;
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
  }
  return `200 deals; ${(free / 200).toFixed(0)} tiles free at the start`;
});

test("New Year's boards are reached in turn, the countdown's ten and then New Year's Day, each board of the countdown called by its number", () => {
  equal(NEW_YEAR.map((d) => d.name).join(), [...NUMBERS, "New Year's Day"].join(), "New Year's boards, in turn");
  COUNTDOWN.forEach((d, k) => equal(d.called, `the ${10 - k}`, `${d.name}, in a sentence`));
  check(!NEW_YEARS_DAY.called, "New Year's Day called otherwise than by its name");
  check(NEW_YEAR.every((d) => d.layout && d.title && d.text && d.sky), 'a board not made');
});

test('the ball drops a notch with each board of the countdown cleared, ten in all, and lands at midnight, lighting its year', () => {
  equal(NOTCHES, COUNTDOWN.length, 'a notch a board');
  for (let k = 1; k <= NOTCHES; k++) check(ballAt(k) > ballAt(k - 1), `the ball not lower a notch down, at ${k}`);
  equal(ballAt(NOTCHES + 3), ballAt(NOTCHES), 'the ball below its pole');
  equal(ballWords(0, false, 2027), 'The ball, 10 notches from landing at midnight', 'before the countdown');
  equal(ballWords(9, false, 2027), 'The ball, 1 notch from landing at midnight', 'on the 1');
  equal(ballWords(10, true, 2027), 'The ball has landed: happy 2027!', 'landed');
  const up = ballDrop(3, false, 2027);
  const down = ballDrop(10, true, 2027);
  check(up.includes('2027') && up.includes(`cy="${ballAt(3).toFixed(1)}"`) && !up.includes('#ffd54a'), 'the ball three notches down, its year unlit');
  check(down.includes(`cy="${ballAt(NOTCHES).toFixed(1)}"`) && down.includes('#ffd54a') && down.includes('happy 2027'), 'the ball landed, its year lit');
});
