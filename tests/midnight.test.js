import { test, check, equal } from './run.js';
import { ONE, TWO } from '../js/engine/layouts.js';
import { MATCH } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { COUNTDOWN, countdownOf } from '../js/newyear.js';

const LAST = COUNTDOWN[9];
// Midnight's words for the score, as main.js tells it.
const WORDS = { night: 'Midnight', day: 'Midnight', souls: 'Sleepyheads', none: 'everyone awake' };

test('the last board of the countdown is the 1, midnight: the full set of 144 tiles, nine across, turning over halfway', () => {
  equal(LAST.name, 'One', "the last board's number");
  equal(LAST.title, 'Midnight', "the 1's twist");
  equal(countdownOf(ONE), LAST, "the 1's board");
  equal(ONE.count, 144, 'tiles: the full set');
  equal(ONE.width / 2, 9, 'tiles across');
  equal(ONE.depth, 5, 'layers');
  check(ONE.count > TWO.count, 'no more tiles than the 2');
  const options = dayOptions(LAST);
  equal(options.turnAt, 36, 'the matches before midnight');
  check(!options.treats && !options.ghostsFloat, 'no treats or floating ghosts');
  equal(LAST.words, 'newyear', "told as New Year's midnight");
  equal(COUNTDOWN.length, 10, 'the boards made');
  check(COUNTDOWN.every((d, k) => k === 0 || d.layout.count > COUNTDOWN[k - 1].layout.count), 'the boards do not grow toward midnight');
});

test('the 1 reads as a 1: its stem stands alone below its flag, which reaches out to the left at the top, and its foot runs across the bottom', () => {
  // In half-tile units: a tile at x covers x to x + 2 across, and at y, y
  // to y + 2 down.
  const rows = (from, to) => [...ONE.x.keys()].filter((i) => ONE.y[i] + 2 > from && ONE.y[i] < to);
  const across = (tiles) => [Math.min(...tiles.map((i) => ONE.x[i])), Math.max(...tiles.map((i) => ONE.x[i] + 2))].join();
  equal(across(rows(8, 20)), '6,14', "the stem's sides, below the flag");
  equal(across(rows(0, 8)), '0,14', 'the flag and the top of the stem');
  equal(across(rows(20, 24)), '0,18', "the foot's ends");
});

test("midnight's deals can be won through the turn, and a player who takes pairs that match on both sides meets no sleepyheads", () => {
  const options = dayOptions(LAST);
  let free = 0;
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(ONE, { seed, ...options });
    free += g.freeTiles().length;
    let asleep = null;
    for (const [a, b] of g.plan) {
      const m = g.match(a, b);
      check(m, `seed ${seed}: a pair of the deal's own order cannot be taken`);
      if (m.turned) asleep = m.souls.length;
    }
    check(g.won, `seed ${seed}: not cleared`);
    equal(asleep, 0, `seed ${seed}: sleepyheads at midnight`);
  }
  return `200 deals; ${(free / 200).toFixed(0)} tiles free at the start`;
});

test('the hints find a way through midnight, from a move of your own', () => {
  const options = dayOptions(LAST);
  let tried = 0;
  for (let seed = 1; seed <= 10; seed++) {
    const g = new Game(ONE, { seed, ...options });
    const own = g.pairs().find(([a, b]) => MATCH[g.sides[1][a]] !== MATCH[g.sides[1][b]]) || g.pairs()[0];
    g.match(...own);
    g.suggest();
    if (g.outlook !== 'win') continue;
    tried++;
    while (!g.won) {
      const pair = g.hint();
      check(pair && g.match(...pair), `seed ${seed}: the hint with ${g.left} tiles left`);
      if (!pair) break;
    }
  }
  check(tried >= 8, `only ${tried} of 10 boards stayed winnable`);
  return `${tried} of 10 boards`;
});

test("midnight's score is told in its own words", () => {
  const g = new Game(ONE, { seed: 4, ...dayOptions(LAST) });
  for (const [a, b] of g.plan) g.match(a, b);
  const rows = scoreOf(g, 0, WORDS).rows.map((r) => r[0]);
  check(rows.includes('Midnight with everyone awake'), `the rows: ${rows.join(', ')}`);
});
