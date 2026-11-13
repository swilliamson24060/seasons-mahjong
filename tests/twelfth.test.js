import { test, check, equal } from './run.js';
import { DRUM } from '../js/engine/layouts.js';
import { MATCH } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { TWELVE_DAYS, dayOfChristmas } from '../js/christmas.js';

const TWELFTH = TWELVE_DAYS[11];
// Twelfth Night's words for the score, as main.js tells it.
const WORDS = { night: 'Twelfth Night', day: 'Twelfth Night', souls: 'Lumps of coal', none: 'no coal' };

test('the twelfth day is twelve drummers drumming, on a drum of 128 tiles, nine across, the most of the twelve, turning over halfway on Twelfth Night', () => {
  equal(TWELFTH.title, 'Twelve drummers drumming', "the twelfth day's gift");
  equal(dayOfChristmas(DRUM), TWELFTH, "the drum's day");
  equal(DRUM.count, 128, 'tiles');
  equal(DRUM.width / 2, 9, 'tiles across');
  equal(DRUM.depth, 4, 'layers');
  const options = dayOptions(TWELFTH);
  equal(options.turnAt, 32, 'the matches before Twelfth Night');
  check(!options.treats && !options.ghostsFloat, 'no treats or floating ghosts');
  equal(TWELFTH.words, 'twelfth', 'told as Twelfth Night');
  equal(TWELVE_DAYS.length, 12, 'the days made');
  check(TWELVE_DAYS.every((d) => d === TWELFTH || d.layout.count < DRUM.count), 'not the most tiles of the twelve');
  check(TWELVE_DAYS.every((d, k) => k === 0 || d.layout.count > TWELVE_DAYS[k - 1].layout.count), 'the boards do not grow through the twelve days');
});

test("Twelfth Night's deals can be won through the turn, and a player who takes pairs that match on both sides meets no coal", () => {
  const options = dayOptions(TWELFTH);
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(DRUM, { seed, ...options });
    let coal = null;
    for (const [a, b] of g.plan) {
      const m = g.match(a, b);
      check(m, `seed ${seed}: a pair of the deal's own order cannot be taken`);
      if (m.turned) coal = m.souls.length;
    }
    check(g.won, `seed ${seed}: not cleared`);
    equal(coal, 0, `seed ${seed}: lumps of coal on Twelfth Night`);
  }
});

test('the hints find a way through Twelfth Night, from a move of your own', () => {
  const options = dayOptions(TWELFTH);
  let tried = 0;
  for (let seed = 1; seed <= 10; seed++) {
    const g = new Game(DRUM, { seed, ...options });
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

test("Twelfth Night's score is told in its own words", () => {
  const g = new Game(DRUM, { seed: 4, ...dayOptions(TWELFTH) });
  for (const [a, b] of g.plan) g.match(a, b);
  const rows = scoreOf(g, 0, WORDS).rows.map((r) => r[0]);
  check(rows.includes('Twelfth Night with no coal'), `the rows: ${rows.join(', ')}`);
});
