import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { SANDCASTLE } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { solve } from '../js/engine/solver.js';
import { tideAt, comingIn, rowsUp, covered } from '../js/engine/tide.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SUMMER } from '../js/summer.js';

const SECOND = SUMMER[1];
const OPTIONS = dayOptions(SECOND);
const facesOf = (...keys) => keys.map((key) => FACE[key]);

// Three rows of two, tiles 0 and 1 at the top, 2 and 3 in the middle and 4
// and 5 at the bottom, each row a pair; every tile free.
const STEPS = parseLayout('steps', ['##\n##\n##']);
const STEP_FACES = facesOf('eyes-1', 'eyes-1', 'eyes-2', 'eyes-2', 'eyes-3', 'eyes-3');

test('the tide comes in a row every so many matches, as far as it comes, and goes back out a row at a time, and in again', () => {
  equal(Array.from({ length: 22 }, (_, m) => tideAt(m, 3, 3)).join(''), '0001112223332221110001', 'the rows it covers, match by match');
  equal([0, 8, 9, 11, 12, 17, 18].map((m) => (comingIn(m, 3, 3) ? 'in' : 'out')).join(), 'in,in,out,out,out,out,in', 'coming in or going out');
  equal(Array.from(rowsUp(STEPS)).join(), '2,2,1,1,0,0', 'each tile\'s row up from the foot');
  const rows = rowsUp(STEPS);
  equal([0, 1, 2].map((level) => [0, 2, 4].filter((t) => covered(rows, level, t)).join(' ')).join(' | '), ' | 4 | 2 4', 'the tiles under the water as it comes in');
});

test("a tile under the water can't be taken; with nothing left to take but what it covers, the tide goes out at once, and an undo brings it back", () => {
  const g = new Game(STEPS, { faces: STEP_FACES, tide: { every: 1, high: 2 } });
  const heard = [];
  g.on('tide', (e) => heard.push(`${e.tideMoved}${e.ebbed ? ' at once' : ''}`));
  equal(`${g.tideLevel} ${g.tideComingIn} ${g.untilTide}`, '0 true 1', 'the tide as the board starts');
  check(g.match(0, 1), 'the top row not taken');
  equal(`${g.tideLevel} ${g.underWater(4)} ${g.underWater(5)} ${g.underWater(2)}`, '1 true true false', 'the bottom row under the water after a match');
  check(!g.isFree(4) && !g.canMatch(4, 5) && !g.match(4, 5), 'a pair under the water taken');
  check(g.match(2, 3), 'the middle row not taken');
  equal(`${g.tideLevel} ${g.tideFrom}`, '0 2', 'the tide not gone out, with nothing left to take but what it covered');
  equal(heard.join(', '), 'in, in, out at once', 'the tide heard');
  check(g.match(4, 5) && g.won, 'the bottom row, dry again, not taken');
  g.undo();
  equal(`${g.tideFrom} ${g.tideLevel}`, '2 0', 'an undo of the last pair, the tide not as it was');
  g.undo();
  equal(`${g.tideFrom} ${g.tideLevel} ${g.underWater(4)}`, '0 1 true', 'an undo of the pair before the tide went out, the tide not back in');
});

test('a line through the tide holds only if its pairs are out of the water, or the tide goes out at once for them, and the solver finds such a line', () => {
  const g = new Game(STEPS, { faces: STEP_FACES, tide: { every: 1, high: 2 } });
  check(g.holds([[4, 5], [0, 1], [2, 3]]), 'the bottom row first, then the top, then the middle as the tide goes out for it');
  check(!g.holds([[0, 1], [4, 5], [2, 3]]), 'the bottom row taken under the water while the middle row was dry to take');
  check(g.holds([[0, 1], [2, 3], [4, 5]]), 'the rows from the top down, the tide going out for the last');
  const found = solve(STEPS, g.position());
  check(found.result === 'win' && g.holds(found.line), "the solver's line doesn't win through the tide");
});

test("the sandcastle's deals can be won in their own order through the tide, never taking a pair under the water", () => {
  let wentOut = 0;
  let held = 0;
  for (let seed = 1; seed <= 100; seed++) {
    const g = new Game(SANDCASTLE, { seed, ...OPTIONS });
    g.on('tide', (e) => (wentOut += e.ebbed ? 1 : 0));
    check(g.holds(g.plan), `seed ${seed}: the deal's own order doesn't hold through the tide`);
    for (const [a, b] of g.plan) {
      check(!g.underWater(a) && !g.underWater(b), `seed ${seed}: a pair of the deal's own order under the water`);
      check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
      held += g.tideLevel;
    }
    check(g.won, `seed ${seed}: not cleared`);
  }
  check(wentOut > 0, 'the tide never went out at once');
  return `100 deals; the tide covering ${(held / 100 / 46).toFixed(1)} rows a match on average, and going out at once ${(wentOut / 100).toFixed(1)} times a board`;
});

test('following the hints wins the sandcastle through the tide, and a shuffle keeps a way through it', () => {
  for (let seed = 1; seed <= 12; seed++) {
    const g = new Game(SANDCASTLE, { seed, ...OPTIONS });
    while (!g.won) {
      const pair = g.hint();
      check(pair && g.match(...pair), `seed ${seed}: the hint with ${g.left} tiles left`);
      if (!pair) break;
    }
  }
  const g = new Game(SANDCASTLE, { seed: 5, ...OPTIONS });
  for (const [a, b] of g.plan.slice(0, 10)) g.match(a, b);
  check(g.tideLevel > 0, 'the tide not in, ten matches on');
  check(g.shuffle(), 'the shuffle');
  check(g.holds(g.line), "the shuffle's new deal doesn't win through the tide");
  for (const [a, b] of g.line.slice()) check(g.match(a, b), "a pair of the shuffle's new deal cannot be taken");
  check(g.won, 'the shuffled board not cleared');
});
