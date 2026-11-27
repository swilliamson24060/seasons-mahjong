import { test, check, equal } from './run.js';
import * as layouts from '../js/engine/layouts.js';
import { LIGHTHOUSE } from '../js/engine/layouts.js';
import { parseLayout, isFree } from '../js/engine/layout.js';
import { withStairs } from '../js/engine/stairs.js';
import { FACE } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { seeded } from '../js/engine/rng.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SUMMER } from '../js/summer.js';

const SEVENTH = SUMMER[6];
const OPTIONS = dayOptions(SEVENTH);
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const byNumber = (list) => [...list].sort((a, b) => a - b).join();

// A column of three, 0 to 2, standing on a row of three, 3 to 5, the
// column on the stairs.
const COLUMN = parseLayout('column', ['.#.\n.#.\n.#.\n###']);
const STAIRS = withStairs(COLUMN, (L, i) => L.y[i] <= 4);
const ALL = new Uint8Array(6).fill(1);
const freeIn = (L, present) => [...L.x.keys()].filter((i) => present[i] && isFree(L, present, i)).join();

test("on the stairs a tile's sides are the tiles above and below it, so that it's free when there's no tile above it or none below it; off them, the usual rule holds", () => {
  equal([...STAIRS.stairs].join(''), '111000', 'the tiles on the stairs');
  equal(freeIn(COLUMN, ALL), '0,1,2,3,5', 'free by the usual rule, the column open at both sides');
  equal(freeIn(STAIRS, ALL), '0,3,5', "free with the column on the stairs: its top, and the row's ends");
  equal(`${STAIRS.left[1]} | ${STAIRS.right[1]} | ${STAIRS.right[2]} | ${STAIRS.left[4]} ${STAIRS.right[4]}`, '0 | 2 | 4 | 3 5', "the sides of the column's middle and its foot, above and below them, and of the row's middle, beside it");
  equal(freeIn(STAIRS, Uint8Array.from([0, 1, 1, 1, 1, 1])), '1,3,5', 'the top gone, the tile below it free');
  equal(freeIn(STAIRS, Uint8Array.from([1, 1, 1, 0, 1, 0])), '0,4', "the row's ends gone: its middle free, and the column's foot, standing on it, not");
  equal(freeIn(STAIRS, Uint8Array.from([1, 1, 1, 0, 0, 0])), '0,2', "the row gone, the column's foot free");
});

test("a tile's going may free the tiles whose side it is: the row's middle frees the column's foot, standing on it; on every other board, they're the tiles beside it", () => {
  equal([0, 1, 2, 4].map((t) => byNumber(STAIRS.opens[t])).join(' | '), '1 | 0,2 | 1 | 2,3,5', 'the tiles each frees, going');
  for (const [name, L] of Object.entries(layouts)) {
    if (L === LIGHTHOUSE || !L || !L.opens) continue;
    for (let i = 0; i < L.count; i++) {
      const beside = byNumber([...L.left[i], ...L.right[i]]);
      if (byNumber(L.opens[i]) !== beside) throw new Error(`${name}'s tile ${i} frees ${byNumber(L.opens[i])} going, beside ${beside}`);
    }
  }
});

test('a board with stairs is played by them: the game, the solver and the hints all keep to them', () => {
  // The column's top with the row's left end, its middle with the row's
  // right end, and its foot with the row's middle.
  const g = new Game(STAIRS, { faces: facesOf('eyes-1', 'eyes-2', 'eyes-3', 'eyes-1', 'eyes-3', 'eyes-2') });
  equal(g.freeTiles().join(), '0,3,5', 'free as the board starts');
  check(!g.match(1, 5), "the column's middle taken, a tile above and below it");
  const pair = g.hint();
  equal(pair && byNumber(pair), '0,3', 'the hint');
  check(g.match(0, 3) && g.match(1, 5) && g.match(2, 4) && g.won, 'the board not won down the stairs');
});

test("the lighthouse's deals can be won in their own order, up and down its stairs, following the hints wins, and so does a shuffle's new deal", () => {
  for (let seed = 1; seed <= 100; seed++) {
    const g = new Game(LIGHTHOUSE, { seed, ...OPTIONS });
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: the deal's own order not winning`);
  }
  for (let seed = 1; seed <= 12; seed++) {
    const g = new Game(LIGHTHOUSE, { seed, ...OPTIONS });
    while (!g.won) {
      const pair = g.hint();
      check(pair && g.match(...pair), `seed ${seed}: the hint with ${g.left} tiles left`);
      if (!pair) break;
    }
  }
  const g = new Game(LIGHTHOUSE, { seed: 4, ...OPTIONS });
  for (const [a, b] of g.plan.slice(0, 20)) g.match(a, b);
  check(g.shuffle(), 'the shuffle');
  for (const [a, b] of g.line.slice()) check(g.match(a, b), "a pair of the shuffle's new deal cannot be taken");
  check(g.won, "the shuffle's new deal not won");
  let won = 0;
  for (let seed = 1; seed <= 100; seed++) {
    const h = new Game(LIGHTHOUSE, { seed, ...OPTIONS });
    const r = seeded(seed * 31 + 7);
    while (!h.won && h.pairs().length) {
      const pairs = h.pairs();
      h.match(...pairs[Math.floor(r() * pairs.length)]);
    }
    if (h.won) won++;
  }
  return `${won} of 100 boards won taking pairs at random`;
});
