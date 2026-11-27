import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { FOOTPRINTS } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { solve } from '../js/engine/solver.js';
import { scuttle, startles, comeOut, goBack } from '../js/engine/crab.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SUMMER } from '../js/summer.js';

const THIRD = SUMMER[2];
const OPTIONS = dayOptions(THIRD);
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Crabs startled');

// A row of six, tiles 0 to 5 from the left; and a row of five with a tile
// raised over its middle one, tile 5.
const ROW = parseLayout('row', ['######']);
const RAISED = parseLayout('raised', ['#####', '..#..']);

test('a sand crab scuttles sideways along the tops of its row, a tile at a time, turning back at its end, and goes home with nowhere to go', () => {
  const all = new Uint8Array(ROW.count).fill(1);
  const crab = { tile: 2, dir: 1, outIn: 0, count: 1 };
  equal(scuttle(ROW, all, crab, 3).tile, 3, 'the next tile to the right');
  equal(JSON.stringify(scuttle(ROW, all, { ...crab, tile: 5 }, 3)), JSON.stringify({ tile: 4, dir: -1, outIn: 0, count: 1 }), 'at the row\'s end, turning back');
  equal(scuttle(ROW, Uint8Array.from([1, 1, 1, 0, 1, 1]), crab, 3).tile, 4, 'over a tile taken, to the next');
  equal(JSON.stringify(scuttle(ROW, Uint8Array.from([0, 0, 1, 0, 0, 0]), crab, 3)), JSON.stringify({ tile: -1, dir: 1, outIn: 3, count: 1 }), 'with nowhere to go, home');
  const raised = new Uint8Array(RAISED.count).fill(1);
  equal(scuttle(RAISED, raised, { ...crab, tile: 1 }, 3).tile, 5, 'onto the raised tile, over the one under it');
  check(startles(ROW, crab, 1, 4) && startles(ROW, crab, 3, 0) && !startles(ROW, crab, 0, 4), 'a pair right beside the crab, a tile touching its tile');
  check(!startles(ROW, { ...crab, tile: -1 }, 1, 3), 'a crab in its burrow startled');
  const out = comeOut([3, 0, 4], { tile: -1, dir: 1, outIn: 0, count: 2 }, 7);
  equal(JSON.stringify(out), JSON.stringify(comeOut([0, 4, 3], { tile: -1, dir: 1, outIn: 0, count: 2 }, 7)), 'a crab coming out not chosen the same from the same tiles');
  check([0, 3, 4].includes(out.tile) && out.count === 3 && out.outIn === 0, 'a crab coming out onto a tile not free');
  equal(JSON.stringify(goBack(crab, 3)), JSON.stringify({ tile: -1, dir: 1, outIn: 3, count: 1 }), 'a crab going home');
});

test("the crab's tile can't be taken; a pair right beside it startles it home, for points, and another comes out later; an undo puts it back", () => {
  // Two pairs side by side, 0 and 1 touching, and 2 and 3: 0 and 2 a pair,
  // and 1 and 3.
  const L = parseLayout('pairs', ['##.##']);
  const g = new Game(L, { faces: facesOf('eyes-1', 'eyes-2', 'eyes-1', 'eyes-2'), crab: { every: 2 } });
  g.crab = { tile: 1, dir: 1, outIn: 0, count: 1 };
  check(!g.isFree(1) && !g.canMatch(1, 3) && !g.match(1, 3), "the crab's tile taken");
  const heard = [];
  g.on('crab', (e) => heard.push(e.crabStartled >= 0 ? 'startled' : e.crabCameOut >= 0 ? 'out' : 'home'));
  const r = g.match(0, 2);
  check(r && r.crabStartled === 1, 'a pair right beside the crab not startling it');
  equal(`${g.crab.tile} ${g.crab.outIn} ${g.crabsStartled} ${row(g)[2]}`, `-1 2 1 ${POINTS.crab}`, 'the crab home, the matches till the next, the crabs startled and what they score');
  g.undo();
  equal(`${g.crab.tile} ${g.crabsStartled}`, '1 0', 'an undo, the crab not back on its tile');
  equal(heard.join(), 'startled', 'the crab heard');
});

test('with nothing left to take but the tile the crab is on, it goes home at once, and lines and the solver go round it', () => {
  const L = parseLayout('two', ['#.#']);
  const g = new Game(L, { faces: facesOf('eyes-1', 'eyes-1'), crab: { every: 2 } });
  g.crab = { tile: 0, dir: 1, outIn: 0, count: 1 };
  check(g.holds([[0, 1]]), "a line taking the crab's tile, with nothing else to take, not holding as the crab goes home");
  const found = solve(L, g.position());
  check(found.result === 'win', 'the solver lost, the crab going home');
  equal(g.pairs().length, 0, 'a pair with the crab on a tile of it');
  const heard = [];
  g.on('crab', (e) => heard.push(e.crabWentBack ? 'home at once' : '?'));
  g.settle();
  equal(`${g.crab.tile} ${heard.join()}`, '-1 home at once', 'the crab not gone home, with nothing else to take');
  check(g.match(0, 1) && g.won, 'the pair, the crab gone, not taken');
});

test("the footprints' deals can be won in their own order round the crab, never taking its tile, and following the hints startles more crabs", () => {
  let startled = 0;
  for (let seed = 1; seed <= 100; seed++) {
    const g = new Game(FOOTPRINTS, { seed, ...OPTIONS });
    check(g.holds(g.plan), `seed ${seed}: the deal's own order doesn't hold round the crab`);
    for (const [a, b] of g.plan) {
      check(!g.crabOn(a) && !g.crabOn(b), `seed ${seed}: a pair of the deal's own order with the crab on it`);
      check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    }
    check(g.won, `seed ${seed}: not cleared`);
    startled += g.crabsStartled;
  }
  let hinted = 0;
  for (let seed = 1; seed <= 12; seed++) {
    const g = new Game(FOOTPRINTS, { seed, ...OPTIONS });
    while (!g.won) {
      const pair = g.hint();
      check(pair && g.match(...pair), `seed ${seed}: the hint with ${g.left} tiles left`);
      if (!pair) break;
    }
    hinted += g.crabsStartled;
  }
  check(hinted / 12 > startled / 100, 'the hints startling no more crabs than the deal\'s own order');
  return `the deal's own order startles ${(startled / 100).toFixed(1)} crabs a board, following the hints ${(hinted / 12).toFixed(1)}`;
});

test('a shuffle keeps a way round the crab', () => {
  const g = new Game(FOOTPRINTS, { seed: 9, ...OPTIONS });
  for (const [a, b] of g.plan.slice(0, 12)) g.match(a, b);
  check(g.shuffle(), 'the shuffle');
  check(g.holds(g.line), "the shuffle's new deal doesn't win round the crab");
  for (const [a, b] of g.line.slice()) check(g.match(a, b), "a pair of the shuffle's new deal cannot be taken");
  check(g.won, 'the shuffled board not cleared');
});
