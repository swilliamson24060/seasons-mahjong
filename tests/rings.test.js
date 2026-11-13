import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { RINGS } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { ringTiles } from '../js/engine/rings.js';
import { Game } from '../js/engine/game.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { TWELVE_DAYS, dayOfChristmas } from '../js/christmas.js';

const FIFTH = TWELVE_DAYS[4];
const facesOf = (...keys) => keys.map((key) => FACE[key]);
// The tile at a place, in half tiles, as the layout has it.
const at = (L, x, y, z = 0) => [...L.x.keys()].find((i) => L.x[i] === x && L.y[i] === y && L.z[i] === z);

test("a ring's tiles lie on its square's edge, on any layer: where two rings cross they are both rings', and a tile poking through a ring's hole is not its", () => {
  // Two rings four tiles square, linked: each one's corner pokes through
  // the other's hole, and the two places where they cross are raised.
  const L = parseLayout('linked', ['####..\n#..#..\n#.####\n####.#\n..#..#\n..####', '......\n......\n...#..\n..#...']);
  const [a, b] = ringTiles(L, [
    [0, 0, 4, 4],
    [2, 2, 4, 4],
  ]);
  equal(a.length, 14, "the first ring's tiles");
  equal(b.length, 14, "the second ring's tiles");
  for (const [x, y, z] of [[6, 4, 0], [4, 6, 0], [6, 4, 1], [4, 6, 1]]) {
    const i = at(L, x, y, z);
    check(a.includes(i) && b.includes(i), `the tile at (${x}, ${y}) on layer ${z}, where the rings cross, is not both rings'`);
  }
  const throughA = at(L, 4, 4);
  check(b.includes(throughA) && !a.includes(throughA), "the second ring's corner, through the first ring's hole");
  const throughB = at(L, 6, 6);
  check(a.includes(throughB) && !b.includes(throughB), "the first ring's corner, through the second ring's hole");
  equal(new Set([...a, ...b]).size, L.count, "every tile is a ring's");
});

test('a ring turns to gold once every tile of it is taken, for points, and undo takes it back', () => {
  // Two rings of two tiles each, side by side.
  const squares = [
    [0, 0, 2, 1],
    [3, 0, 2, 1],
  ];
  const board = (faces) => new Game(parseLayout('two', ['##.##']), { faces: facesOf(...faces), rings: squares });
  const g = board(['eyes-1', 'eyes-1', 'eyes-2', 'eyes-2']);
  let heard = 0;
  g.on('gold', () => heard++);
  equal(JSON.stringify(g.match(0, 1).gold), '[0]', 'the ring taken');
  check(g.rings[0].gold && !g.rings[1].gold && g.goldRings === 1 && heard === 1, 'the first ring did not turn to gold, alone');
  equal(scoreOf(g, 0).rows.find((r) => r[0] === 'Gold rings')[2], POINTS.ring, 'what it scores');
  g.undo();
  check(!g.rings[0].gold && g.goldRings === 0, 'not taken back with an undo');
  equal(scoreOf(g, 0).rows.find((r) => r[0] === 'Gold rings')[2], 0, 'what it scores, taken back');

  // A pair from each ring takes neither, until the last pair takes both.
  const across = board(['eyes-1', 'eyes-2', 'eyes-1', 'eyes-2']);
  equal(across.match(0, 2).gold.length, 0, 'rings turned to gold with tiles still left in them');
  equal(JSON.stringify(across.match(1, 3).gold), '[0,1]', 'the two rings the last pair took');
  equal(across.goldRings, 2, 'gold rings');
  across.undo();
  equal(across.goldRings, 0, 'gold rings, both taken back');

  const plain = new Game(parseLayout('plain', ['##']), { faces: facesOf('eyes-1', 'eyes-1') });
  check(plain.rings === null && plain.match(0, 1).gold.length === 0, 'a ring on a board without them');
  check(!scoreOf(plain, 0).rows.some((r) => r[0] === 'Gold rings'), 'a row for them on a board without them');
});

test('the fifth day is five gold rings, linked as the five spots on a die are: 100 tiles, nine across', () => {
  equal(FIFTH.title, 'Five gold rings', "the fifth day's gift");
  equal(dayOfChristmas(RINGS), FIFTH, "the rings' day");
  equal(RINGS.count, 100, 'tiles');
  equal(RINGS.width / 2, 9, 'tiles across');
  equal(RINGS.depth, 3, 'layers');
  check(TWELVE_DAYS[3].layout.count < RINGS.count, 'no more tiles than the fourth day');
  const rings = ringTiles(RINGS, dayOptions(FIFTH).rings);
  equal(rings.length, 5, 'rings');
  equal(rings.map((r) => r.length).join(' '), '22 22 36 22 22', "the rings' tiles, the middle one's most");
  equal(new Set(rings.flat()).size, RINGS.count, 'tiles in a ring');
  const middle = new Set(rings[2]);
  for (const k of [0, 1, 3, 4]) {
    equal(rings[k].filter((i) => middle.has(i)).length, 6, `ring ${k}'s tiles where it crosses the middle one: two places, three high`);
    for (const j of [0, 1, 3, 4]) if (j !== k) equal(rings[k].filter((i) => rings[j].includes(i)).length, 0, `rings ${k} and ${j} cross`);
  }
});

test("the fifth day's deals can be won in the order they were dealt, a ring at a time, turning all five to gold", () => {
  const options = dayOptions(FIFTH);
  const sum = [0, 0, 0, 0, 0];
  const firstRings = new Set();
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(RINGS, { seed, ...options });
    const when = [];
    for (const [a, b] of g.plan) {
      check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
      if (!when.length && g.goldRings) firstRings.add(g.rings.findIndex((r) => r.gold));
      if (g.goldRings > when.length) when.push(...Array(g.goldRings - when.length).fill(g.matches));
    }
    check(g.won && g.goldRings === 5, `seed ${seed}: ${g.goldRings} gold rings on a cleared board`);
    equal(scoreOf(g, 0).rows.find((r) => r[0] === 'Gold rings')[2], 5 * POINTS.ring, `seed ${seed}: what they score`);
    check(when[0] <= 15, `seed ${seed}: the first ring turns to gold only after ${when[0]} matches`);
    when.forEach((m, k) => (sum[k] += m));
  }
  check(firstRings.size > 1, 'the deal takes the same ring first every time');
  return `200 deals; on the deal's own order of 50 matches, the rings turn to gold after ${sum.map((s) => (s / 200).toFixed(0)).join(', ')}`;
});

test('a shuffle on the board of gold rings deals the tiles left so the board can still be won', () => {
  const g = new Game(RINGS, { seed: 7, ...dayOptions(FIFTH) });
  for (const [a, b] of g.plan.slice(0, 15)) g.match(a, b);
  const gold = g.goldRings;
  check(g.shuffle(), 'no shuffle');
  equal(g.goldRings, gold, 'gold rings after a shuffle');
  while (!g.won) {
    const pair = g.suggest();
    check(pair && g.match(...pair), 'the line after the shuffle cannot be followed');
  }
  equal(g.goldRings, 5, 'gold rings on the board cleared');
});
