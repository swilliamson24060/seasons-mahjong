import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { FOOTBALL } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { endZones, isTouchdown } from '../js/engine/football.js';
import { Game } from '../js/engine/game.js';
import { POINTS, scoreOf } from '../js/score.js';
import { DAYS, dayOf, dayOptions } from '../js/thanksgiving.js';

const SATURDAY = DAYS.find((d) => d.name === 'Saturday');
const facesOf = (...keys) => keys.map((key) => FACE[key]);

// A column of four tiles, each free, the top and bottom ones in the two end zones.
const field = () =>
  new Game(parseLayout('field', ['#\n.\n#\n.\n#\n.\n#']), {
    faces: facesOf('eyes-1', 'eyes-2', 'eyes-2', 'eyes-1'),
    touchdown: 1,
  });

test('a pair with a tile in each end zone is a touchdown, and undo takes it back', () => {
  const g = field();
  let scored = 0;
  g.on('touchdown', () => scored++);
  equal(Array.from(g.zones).join(), '-1,0,0,1', 'the end zones');
  check(g.match(1, 2) && g.touchdowns === 0, 'a pair in midfield is no touchdown');
  check(g.match(0, 3) && g.touchdowns === 1 && scored === 1, 'a pair from end zone to end zone is');
  equal(scoreOf(g, 0).rows.find((r) => r[0] === 'Touchdowns')[2], POINTS.touchdown, 'what it scores');
  g.undo();
  equal(g.touchdowns, 0, 'taken back with an undo');
});

test("Saturday is rivalry football, on a football of 100 tiles, seven across, with end zones of fourteen tiles", () => {
  equal(SATURDAY.title, 'Rivalry football', "Saturday's theme");
  equal(dayOf(FOOTBALL), SATURDAY, "the ball's day");
  equal(FOOTBALL.count, 100, 'tiles');
  equal(FOOTBALL.width / 2, 7, 'tiles across');
  const zones = endZones(FOOTBALL, dayOptions(SATURDAY).touchdown);
  equal(zones.filter((z) => z === -1).length, 14, 'tiles in the top end zone');
  equal(zones.filter((z) => z === 1).length, 14, 'tiles in the bottom end zone');
  check(!dayOptions(SATURDAY).treats && !dayOptions(SATURDAY).ghostsFloat, 'no treats or ghosts');
});

test("Saturday's deals can be won in the order they were dealt, and that order always scores a touchdown", () => {
  const options = dayOptions(SATURDAY);
  let scored = 0;
  let most = 0;
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(FOOTBALL, { seed, ...options });
    const inPlan = g.plan.filter(([a, b]) => isTouchdown(g.zones, a, b)).length;
    check(inPlan >= 1, `seed ${seed}: no touchdown in the deal's order`);
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
    equal(g.touchdowns, inPlan, `seed ${seed}: touchdowns`);
    scored += inPlan;
    most = Math.max(most, inPlan);
  }
  return `200 deals; the deal's own order scores ${(scored / 200).toFixed(1)} touchdowns, ${most} at most`;
});
