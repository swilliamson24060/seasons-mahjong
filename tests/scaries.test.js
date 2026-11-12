import { test, check, equal } from './run.js';
import { ALARM } from '../js/engine/layouts.js';
import { MATCH } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { scoreOf } from '../js/score.js';
import { DAYS, dayOf, dayOptions } from '../js/thanksgiving.js';

const SCARIES = DAYS.find((d) => d.name === 'Second Sunday');
const SUNDOWN = { night: 'Sundown', day: 'Sundown', souls: 'Worries', none: 'no worries' };

test('the second Sunday is the Sunday Scaries, on an alarm clock of 102 tiles, nine across, turning over to Monday halfway through', () => {
  equal(SCARIES.title, 'The Sunday Scaries', "the second Sunday's theme");
  equal(dayOf(ALARM), SCARIES, "the clock's day");
  equal(ALARM.count, 102, 'tiles');
  equal(ALARM.width / 2, 9, 'tiles across');
  const options = dayOptions(SCARIES);
  equal(options.turnAt, 26, 'the matches before sundown');
  check(!options.treats && !options.ghostsFloat, 'no treats or floating ghosts');
  equal(SCARIES.words, 'sundown', 'told as sundown');
});

test("the Sunday Scaries' deals can be won through sundown, and a player who takes pairs that match on both sides meets no worries", () => {
  const options = dayOptions(SCARIES);
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(ALARM, { seed, ...options });
    let worries = null;
    for (const [a, b] of g.plan) {
      const m = g.match(a, b);
      check(m, `seed ${seed}: a pair of the deal's own order cannot be taken`);
      if (m.turned) worries = m.souls.length;
    }
    check(g.won, `seed ${seed}: not cleared`);
    equal(worries, 0, `seed ${seed}: worries at sundown`);
  }
});

test('the hints find a way through sundown, from a move of your own', () => {
  const options = dayOptions(SCARIES);
  let tried = 0;
  for (let seed = 1; seed <= 10; seed++) {
    const g = new Game(ALARM, { seed, ...options });
    const own = g.pairs().find(([a, b]) => MATCH[g.sides[1][a]] !== MATCH[g.sides[1][b]]) || g.pairs()[0];
    g.match(...own);
    g.suggest();
    if (g.outlook !== 'win') continue;
    tried++;
    while (!g.won) {
      const pair = g.hint();
      check(pair && g.match(...pair), `seed ${seed}: the hint with ${g.left} tiles left`);
    }
  }
  check(tried >= 8, `only ${tried} of 10 boards stayed winnable`);
  return `${tried} of 10 boards`;
});

test("sundown's score is told in its own words", () => {
  const g = new Game(ALARM, { seed: 4, ...dayOptions(SCARIES) });
  for (const [a, b] of g.plan) g.match(a, b);
  const rows = scoreOf(g, 0, SUNDOWN).rows.map((r) => r[0]);
  check(rows.includes('Sundown with no worries'), `the rows: ${rows.join(', ')}`);
  check(scoreOf(g, 0).rows.some((r) => r[0] === 'Midnight with no lost souls'), "Halloween's words, unless a board says otherwise");
});
