import { test, check, equal } from './run.js';
import { parseLayout, isFree } from '../js/engine/layout.js';
import { KITE, ROBIN } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { solve } from '../js/engine/solver.js';
import { WINDS, windAt, upwindOf, inWind, windswept, acrossOf } from '../js/engine/wind.js';
import { seeded } from '../js/engine/rng.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SPRING, springOf, kitePart } from '../js/spring.js';

const FOURTH = SPRING[3];
const OPTIONS = dayOptions(FOURTH);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Caught the wind');
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const at = (L, z, y) => [...L.x.keys()].filter((i) => L.z[i] === z && L.y[i] === y).map((i) => L.x[i]).join();

// Two rows of three, tiles 0, 1 and 2 across the top and 3, 4 and 5 across
// the bottom, and two on top of their middles, 6 on the top row's and 7 on
// the bottom row's.
const BLOCK = parseLayout('block', ['###\n###', '.#.\n.#.']);

test('the wind blows from the east, then the south, the west and the north, turning every so many matches, and the tiles on the edge it blows on are in it', () => {
  equal([0, 3, 4, 8, 12, 15, 16].map((m) => WINDS[windAt(m, 4)]).join(), 'east,east,south,west,north,north,east', 'the wind, match by match');
  const up = upwindOf(BLOCK);
  const all = new Uint8Array(BLOCK.count).fill(1);
  equal(windswept(up, 0, all).join(), '2,5', 'in the east wind, the right column');
  equal(windswept(up, 2, all).join(), '0,3', 'in the west wind, the left column');
  equal(windswept(up, 3, all).join(), '0,1,2,6', 'in the north wind, the top row, the tile on it with them');
  equal(windswept(up, 1, all).join(), '3,4,5,7', 'in the south wind, the bottom row, the tile on it with them');
  const some = Uint8Array.from([1, 1, 0, 1, 1, 1, 1, 1]);
  equal(windswept(up, 0, some).join(), '1,5,6', 'in the east wind, the top row\'s end gone');
  check(!inWind(up, 0, some, 2), 'a tile taken in the wind');
  check(acrossOf(BLOCK)[0].includes(2) && acrossOf(BLOCK)[0].includes(3) && !acrossOf(BLOCK)[0].includes(5), "a tile's row and column");
});

test('a tile in the wind is free whatever lies on it or beside it, and a pair with one catches the wind, for points; the wind turns every so many matches, and an undo takes a catch back', () => {
  // The top row's ends a pair, and the bottom row's; and each row's middle
  // and the tile on it a pair.
  const faces = facesOf('eyes-2', 'eyes-1', 'eyes-2', 'eyes-3', 'eyes-4', 'eyes-3', 'eyes-1', 'eyes-4');
  const g = new Game(BLOCK, { faces, wind: { every: 4 } });
  equal(`${WINDS[g.windFrom]} ${g.untilWindTurns} ${g.windCaught}`, 'east 4 0', 'the wind as the board starts');
  equal(g.windTiles().join(), '2,5', 'the tiles in the east wind');
  check(!g.isFree(1) && !g.isFree(4), 'a tile held down free, out of the wind');
  const heard = [];
  g.on('wind', (e) => heard.push(`${e.caughtWind ? 'caught' : ''}${e.windTurned >= 0 ? WINDS[e.windTurned] : ''}`));
  const r = g.match(0, 2);
  check(r && r.caughtWind && r.windTurned === -1, 'a pair with a tile in the wind not catching it');
  equal(`${g.windCaught} ${row(g)[2]}`, `1 ${POINTS.wind}`, 'the catches, and what they score');
  check(g.match(3, 5).caughtWind && g.windCaught === 2, 'the second catch');
  g.undo();
  equal(g.windCaught, 1, 'an undo, the catch not taken back');
  check(g.match(3, 5), 'the pair taken again');
  // With the top row's end gone, the tile under 6 is on the edge the east
  // wind blows on, and loose, 6 on it or not.
  check(g.inWind(1) && g.isFree(1) && g.match(1, 6).caughtWind, 'the tile under 6 not loose in the wind');
  equal(heard.join(' '), 'caught caught caught caught', 'the wind heard');

  // A wind turning every match: east, then south, then west.
  const k = new Game(BLOCK, { faces, wind: { every: 1 } });
  check(k.match(0, 2).windTurned === 1 && WINDS[k.windFrom] === 'south' && k.untilWindTurns === 1, 'the wind not turning south after a match');
  const m = k.match(3, 5);
  check(m.caughtWind && m.windTurned === 2, 'the bottom row in the south wind not catching it, or the wind not turning west');
  check(k.inWind(1) && k.isFree(1), 'the tile under 6 not loose in the west wind');
  const plain = new Game(BLOCK, { faces });
  check(!plain.windEvery && plain.windFrom === -1 && !plain.inWind(2) && !plain.match(0, 2).caughtWind && !row(plain), 'a board without the wind blowing');
});

test('the wind can win a board nothing else can, and the solver, the hints and a way checked ahead all know it, and that it turns', () => {
  // Two of a kind, one on the other: both on the edge, and loose.
  const STACK = parseLayout('stack', ['#', '#']);
  const faces = facesOf('eyes-5', 'eyes-5');
  const still = new Game(STACK, { faces });
  check(still.pairs().length === 0 && solve(STACK, still.position()).result === 'lost', 'one on the other, taken without the wind');
  const windy = new Game(STACK, { faces, wind: { every: 4 } });
  equal(windy.pairs().length, 1, 'pairs in the wind');
  const { result, line } = solve(STACK, windy.position());
  equal(`${result} ${line.length}`, 'win 1', 'the solver in the wind');
  check(windy.holds(line), "the solver's way not holding in the wind");
  const pair = windy.suggest();
  check(pair && windy.match(...pair).caughtWind && windy.won, 'the hint not catching the wind to win');
  // A row of three, a fourth on its middle, the middle's match: the ends
  // first, and the middle is on the edge of the east wind, or in the south
  // wind, nothing below it; the middle first, and it's held down in the east
  // wind, the end beside it still there.
  const ROW = parseLayout('row', ['###', '.#.']);
  const rowFaces = facesOf('eyes-2', 'eyes-1', 'eyes-2', 'eyes-1');
  for (const every of [1, 4]) {
    const k = new Game(ROW, { faces: rowFaces, wind: { every } });
    check(k.holds([[0, 2], [1, 3]]) && !k.holds([[1, 3], [0, 2]]), `every ${every}: ways checked ahead, the wind not turning as they go`);
    check(solve(ROW, k.position()).result === 'win', `every ${every}: the solver not winning in the wind`);
  }
  check(solve(ROW, new Game(ROW, { faces: rowFaces }).position()).result === 'lost', 'the row won without the wind');
});

test('the fourth chapter is kites in the March wind: a diamond kite, 108 tiles on four layers, nine across, its tail bowed in the wind', () => {
  equal(FOURTH.name, 'The fourth chapter', "the fourth chapter's name");
  equal(FOURTH.title, 'Kites in the March wind', "the fourth chapter's title");
  equal(springOf(KITE), FOURTH, "the kite's chapter");
  equal(KITE.count, 108, 'tiles');
  equal(KITE.width / 2, 9, 'tiles across');
  equal(KITE.height / 2, 10.5, 'tiles down');
  equal(KITE.depth, 4, 'layers');
  check(KITE.count > ROBIN.count, 'no more tiles than the robin');
  equal(JSON.stringify(OPTIONS), JSON.stringify({ treats: false, ghostsFloat: false, wind: { every: 4 } }), 'the wind turning every four matches');
  equal(at(KITE, 0, 0), '8', "the kite's top");
  equal(at(KITE, 0, 6), '0,2,4,6,8,10,12,14,16', 'across it, where its cross spar is');
  equal(at(KITE, 2, 6), '2,4,6,10,12,14', 'its cross spar, raised');
  equal(at(KITE, 3, 6), '8', 'where its spars cross, the highest of it');
  const parts = {};
  for (let i = 0; i < KITE.count; i++) {
    const p = kitePart(KITE, i);
    parts[p] = (parts[p] || 0) + 1;
  }
  const names = ['sail-red', 'sail-yellow', 'sail-blue', 'sail-green', 'spar', 'string', 'ribbon', 'line'];
  equal(names.map((p) => `${p} ${parts[p]}`).join(', '), 'sail-red 18, sail-yellow 14, sail-blue 28, sail-green 23, spar 15, string 5, ribbon 2, line 3', 'its parts, for its look');
  equal(FOURTH.look, kitePart, 'the kite not tinted as its parts are');
  check(['blows from the east', 'the south, the west and the north', 'every four matches', 'loose', `${POINTS.wind} points`].every((w) => FOURTH.text.includes(w)), "the card doesn't tell the wind");
});

test("the kite's deals can be cleared following the hints, catching the wind as they go; a player taking pairs at random catches it less", () => {
  let hinted = 0;
  let windOnly = 0;
  let random = 0;
  for (let seed = 1; seed <= 24; seed++) {
    const g = new Game(KITE, { seed, ...OPTIONS });
    while (g.left) {
      const pair = g.suggest();
      check(pair, `seed ${seed}: no hint with ${g.left} tiles left`);
      if (!pair) break;
      if (pair.some((t) => !isFree(KITE, g.present, t))) windOnly++;
      check(g.match(...pair), `seed ${seed}: the hint can't be taken`);
    }
    check(g.won, `seed ${seed}: following the hints, not cleared`);
    hinted += g.windCaught;
    const p = new Game(KITE, { seed, ...OPTIONS });
    const r = seeded(seed * 41);
    while (p.left && p.pairs().length) p.match(...r.pick(p.pairs()));
    random += p.windCaught;
  }
  check(hinted > random, `following the hints caught the wind ${hinted} times, no more than pairs at random, ${random}`);
  return `24 deals: following the hints caught the wind ${(hinted / 24).toFixed(1)} times a board of 54 pairs, ${(windOnly / 24).toFixed(1)} of them pairs only the wind let go; pairs at random caught it ${(random / 24).toFixed(1)} times`;
});

test('a board played the same way feels the same wind, however its hints are asked for', () => {
  for (const seed of [1, 2, 3]) {
    const play = (hints) => {
      const k = new Game(KITE, { seed, ...OPTIONS });
      const rr = seeded(seed * 13);
      const seen = [];
      k.on('wind', (e) => seen.push(`${k.matches}:${e.caughtWind ? 'c' : ''}${e.windTurned}`));
      while (k.left && k.pairs().length) {
        if (hints && k.matches % 3 === 0) k.hint();
        k.match(...rr.pick(k.pairs()));
      }
      return seen.join(' ');
    };
    equal(play(true), play(false), `seed ${seed}: the wind, played the same way with hints and without`);
  }
});
