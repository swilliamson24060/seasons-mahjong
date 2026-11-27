import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { BEACHBALL } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { sunLeft, isCool, keepingCool, coolIn } from '../js/engine/sunburn.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SUMMER } from '../js/summer.js';

const SIXTH = SUMMER[5];
const OPTIONS = dayOptions(SIXTH);
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Cool pairs');

// Two rows of four, 0 to 3 over 4 to 7: their ends, 0, 3, 4 and 7, free
// from the start.
const ROWS = parseLayout('rows', ['####\n####']);
// The rows' ends pairs, and their middles: 0 and 3, 4 and 7, 1 and 2, 5
// and 6.
const FACES = facesOf('eyes-1', 'eyes-3', 'eyes-3', 'eyes-1', 'eyes-2', 'eyes-4', 'eyes-4', 'eyes-2');
const ALL = new Uint8Array(8).fill(1);

test("a tile's time in the sun: none in the shade, so many matches once it's out, and burnt at none; a pair is cool while neither of its tiles is burnt", () => {
  const sunAt = Int16Array.from([-1, 0, 2]);
  equal([0, 1, 2].map((t) => sunLeft(sunAt, t, 3, 6)).join(), 'Infinity,3,5', 'the matches left in the sun after three matches');
  equal(sunLeft(sunAt, 1, 6, 6), 0, 'a tile out from the start, after six matches');
  check(isCool(sunAt, 1, 2, 5, 6), 'a pair taken in the sixth match, not cool');
  check(!isCool(sunAt, 1, 2, 6, 6), 'a pair with a burnt tile, cool');
  check(isCool(sunAt, 0, 2, 0, 6), 'a pair with a tile still in the shade, never burnt, not cool');
});

test('the deal keeps cool, taking the tiles newest in the sun first, and a way is told by the cool pairs it takes', () => {
  const prefer = keepingCool(ROWS, 2);
  equal(prefer([4, 0, 7, 3], ALL, []).join(), '4,0,7,3', 'all out in the sun together, taken as they come');
  const left = Uint8Array.from([0, 1, 1, 0, 1, 1, 1, 1]);
  equal(prefer([4, 1, 7, 2], left, [[0, 3]]).join(), '1,2,4,7', 'the tiles out since the first pair, before those out from the start');
  const sunAt = Int16Array.from([0, -1, -1, 0, 0, -1, -1, 0]);
  equal(coolIn(ROWS, ALL, sunAt, 0, 2, [[0, 3], [1, 2], [4, 7], [5, 6]]), 3, 'the top row first, the bottom row burning');
  equal(coolIn(ROWS, ALL, sunAt, 0, 2, [[0, 3], [4, 7], [1, 2], [5, 6]]), 4, 'the ends of both rows first');
});

test('a free tile left in the sun burns, a pair taken before either of its tiles does is a cool pair, for points, and an undo takes it all back', () => {
  const g = new Game(ROWS, { faces: FACES, sunburn: 2 });
  equal([...g.sunAt].join(), '0,-1,-1,0,0,-1,-1,0', 'the tiles free from the start, out in the sun from the start');
  const heard = [];
  g.on('sun', (e) => heard.push(`${e.coolPair ? 'cool' : 'warm'}${e.sunburnt.length ? ` ${e.sunburnt.join('+')} burnt` : ''}`));
  const r = g.match(0, 3);
  check(r.coolPair, 'the first pair, not cool');
  equal(`${r.sunned.join()} | ${g.untilBurnt(4)} ${g.untilBurnt(1)} ${g.untilBurnt(5)}`, '1,2 | 1 2 Infinity', "the top row's middle out in the sun, and the time left to the bottom row's ends");
  check(g.match(1, 2).sunburnt.join() === '4,7' && g.isBurnt(4) && g.isBurnt(7), "the bottom row's ends, left out two matches, not burnt");
  check(!g.match(4, 7).coolPair, 'a pair of burnt tiles, cool');
  check(g.match(5, 6).coolPair && g.won, "the bottom row's middle, not cool");
  equal(heard.join(', '), 'cool, cool 4+7 burnt, cool', 'the sun heard');
  equal(`${g.coolPairs} ${g.sunburns} ${row(g)[1]} ${row(g)[2]}`, `3 1 3 × ${POINTS.cool} ${3 * POINTS.cool}`, 'the cool pairs, and what they score');
  g.undo();
  g.undo();
  g.undo();
  equal(`${g.coolPairs} ${g.sunburns} ${g.isBurnt(4)} ${g.untilBurnt(4)} ${[...g.sunAt].join()}`, '1 0 false 1 0,1,1,0,0,-1,-1,0', 'three undone, the sun not as it was after the first pair');
});

test('the hints keep cool: of two ways to win, they take the one with more cool pairs', () => {
  const g = new Game(ROWS, { faces: FACES, sunburn: 2 });
  while (!g.won) {
    const pair = g.hint();
    check(pair && g.match(...pair), `the hint with ${g.left} tiles left`);
    if (!pair) break;
  }
  equal(g.coolPairs, 4, 'cool pairs, following the hints');
});

test("the beach ball's deals keep cool in their own order and win, following the hints keeps at least as cool, and a shuffle's new deal still wins", () => {
  let least = Infinity;
  for (let seed = 1; seed <= 100; seed++) {
    const g = new Game(BEACHBALL, { seed, ...OPTIONS });
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: the deal's own order not winning`);
    least = Math.min(least, g.coolPairs);
  }
  check(least >= 40, `a deal's own order with only ${least} cool pairs of 62`);
  let total = 0;
  for (let seed = 1; seed <= 8; seed++) {
    const own = new Game(BEACHBALL, { seed, ...OPTIONS });
    for (const [a, b] of own.plan) own.match(a, b);
    const g = new Game(BEACHBALL, { seed, ...OPTIONS });
    while (!g.won) {
      const pair = g.hint();
      check(pair && g.match(...pair), `seed ${seed}: the hint with ${g.left} tiles left`);
      if (!pair) break;
    }
    check(g.coolPairs >= own.coolPairs, `seed ${seed}: the hints kept ${g.coolPairs} cool, the deal's own order ${own.coolPairs}`);
    total += g.coolPairs;
  }
  const g = new Game(BEACHBALL, { seed: 4, ...OPTIONS });
  for (const [a, b] of g.plan.slice(0, 15)) g.match(a, b);
  const sunAt = [...g.sunAt].join();
  check(g.shuffle(), 'the shuffle');
  equal([...g.sunAt].join(), sunAt, 'the sun moved by the shuffle');
  for (const [a, b] of g.line.slice()) check(g.match(a, b), "a pair of the shuffle's new deal cannot be taken");
  check(g.won && g.coolPairs >= 40, `after the shuffle, ${g.won ? 'won' : 'not won'} with ${g.coolPairs} cool pairs`);
  return `${least} cool pairs of 62 at the least in a deal's own order; ${(total / 8).toFixed(1)} following the hints`;
});
