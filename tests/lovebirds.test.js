import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { DOVES } from '../js/engine/layouts.js';
import { FACE, MATCH } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { TWELVE_DAYS, dayOfChristmas } from '../js/christmas.js';

const SECOND = TWELVE_DAYS[1];
const facesOf = (...keys) => keys.map((key) => FACE[key]);

// A row of tiles set apart, each free.
const row = (faces, lovebirds = true) => new Game(parseLayout('row', [Array(faces.length).fill('#').join('.')]), { faces: facesOf(...faces), lovebirds });

test("a kind's second pair taken straight after its first is a pair of lovebirds, and undo takes it back", () => {
  const g = row(['eyes-1', 'eyes-1', 'eyes-2', 'eyes-2', 'eyes-1', 'eyes-1', 'eyes-2', 'eyes-2']);
  let cooed = 0;
  g.on('lovebirds', () => cooed++);
  check(g.match(0, 1) && g.lovebirds === 0, 'the first pair of a kind is lovebirds');
  check(g.match(2, 3) && g.lovebirds === 0, 'a pair of another kind is lovebirds');
  check(g.match(6, 7).lovebirds && g.lovebirds === 1 && cooed === 1, "the second pair of a kind, straight after its first, isn't lovebirds");
  check(g.match(4, 5) && g.lovebirds === 1, 'a second pair not straight after its first is lovebirds');
  equal(scoreOf(g, 0).rows.find((r) => r[0] === 'Lovebirds')[2], POINTS.lovebirds, 'what they score');
  g.undo();
  equal(g.lovebirds, 1, 'an undo of another pair keeps them');
  g.undo();
  equal(g.lovebirds, 0, 'an undo of the lovebirds takes them back');
});

test('the flowers, any two of which match, are one kind for lovebirds, and a board without them counts none', () => {
  const garden = row(['nightshade', 'foxglove', 'hemlock', 'wolfsbane']);
  garden.match(0, 1);
  garden.match(2, 3);
  equal(garden.lovebirds, 1, 'two pairs of flowers');
  const plain = row(['eyes-1', 'eyes-1', 'eyes-1', 'eyes-1'], false);
  plain.match(0, 1);
  plain.match(2, 3);
  equal(plain.lovebirds, 0, 'lovebirds on a board without them');
  check(!scoreOf(plain, 0).rows.some((r) => r[0] === 'Lovebirds'), 'a Lovebirds row on a board without them');
});

test('the second day is two turtle doves, on a heart of 88 tiles, nine across, with lovebirds', () => {
  equal(SECOND.title, 'Two turtle doves', "the second day's gift");
  equal(dayOfChristmas(DOVES), SECOND, "the heart's day");
  equal(DOVES.count, 88, 'tiles');
  equal(DOVES.width / 2, 9, 'tiles across');
  equal(DOVES.depth, 3, 'layers');
  equal(JSON.stringify(dayOptions(SECOND)), JSON.stringify({ treats: false, ghostsFloat: false, lovebirds: true }), 'its rules');
  check(TWELVE_DAYS[0].layout.count < DOVES.count, 'no more tiles than the first day');
});

test("the second day's deals can be won in the order they were dealt, and that order always takes a pair of lovebirds", () => {
  const options = dayOptions(SECOND);
  let found = 0;
  let most = 0;
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(DOVES, { seed, ...options });
    const kinds = g.plan.map(([a]) => MATCH[g.faces[a]]);
    const inPlan = kinds.filter((k, i) => i > 0 && k === kinds[i - 1]).length;
    check(inPlan >= 1, `seed ${seed}: no lovebirds in the deal's order`);
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
    equal(g.lovebirds, inPlan, `seed ${seed}: lovebirds`);
    found += inPlan;
    most = Math.max(most, inPlan);
  }
  return `200 deals; the deal's own order takes ${(found / 200).toFixed(1)} pairs of lovebirds, ${most} at most`;
});
