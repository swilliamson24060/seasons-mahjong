import { isFree } from './layout.js';
import { seeded } from './rng.js';

// A sand crab, on the beach season's footprints in the sand: a crab comes
// out of its burrow onto a free tile and scuttles sideways along its row, a
// tile with every match, along the tops of the tiles in it, turning back at
// the row's end; the tile it sits on can't be taken while it's there. A
// pair taken right beside it, a tile of the pair touching its tile on its
// layer, startles it back into its burrow, for points, and another comes
// out `every` matches later. With nowhere left in its row to scuttle to,
// or nothing left to take but the tile it's on, it goes back into its
// burrow at once, so that it never sits on a tile for good. Every tile on
// the board lies on a whole row, so that a crab's row is plain to see.
//
// Where the crab goes is a matter of the board and the pairs taken, each
// crab's tile and way chosen from the board's seed as it comes out, so the
// game, the solver, the hints and the deal all follow it the same way: the
// deal is played through with the crab on the board (scuttling, below), so
// that its own order wins round it, and the solver carries the crab along
// as it searches. Going back at once, the deal counts on fewer than two
// free tiles being left besides the crab's, and the game on no pair being
// left to take; along the deal's own order the two come to the same.
//
// The crab: { tile, dir, outIn, count }: the tile it's on, or -1 while
// it's in its burrow; the way it's scuttling, 1 to the right and -1 to the
// left; while it's in its burrow, the matches until the next comes out;
// and the crabs come out so far.

// The crab goes back into its burrow, the next to come out `every` matches
// on.
export const goBack = (crab, every) => ({ ...crab, tile: -1, outIn: every });

// Whether a tile is on the top of its stack, for the crab to walk on.
const onTop = (L, present, t) => present[t] === 1 && L.above[t].every((j) => !present[j]);

// The crab's next tile along its row: the nearest the way it's going, or
// if there's none that way, the nearest the other way, turning back; or
// with nowhere else in the row to go, back into its burrow, the next crab
// to come out `every` matches on.
export function scuttle(L, present, crab, every) {
  const { tile, dir } = crab;
  let ahead = -1;
  let back = -1;
  for (let t = 0; t < L.count; t++) {
    if (t === tile || L.y[t] !== L.y[tile] || !onTop(L, present, t)) continue;
    const d = (L.x[t] - L.x[tile]) * dir;
    if (d > 0 && (ahead < 0 || d < (L.x[ahead] - L.x[tile]) * dir)) ahead = t;
    if (d < 0 && (back < 0 || d > (L.x[back] - L.x[tile]) * dir)) back = t;
  }
  if (ahead >= 0) return { ...crab, tile: ahead };
  if (back >= 0) return { ...crab, tile: back, dir: -dir };
  return goBack(crab, every);
}

// A crab comes out onto one of the free tiles, chosen from the board's seed
// and how many have come out before it, and its way with it; or stays in
// its burrow with none free.
export function comeOut(free, crab, seed) {
  if (!free.length) return { ...crab, tile: -1, outIn: 1 };
  const r = seeded((seed ^ 0x5bd1e995 ^ Math.imul(crab.count + 1, 0x9e3779b1)) >>> 0);
  const sorted = free.slice().sort((a, b) => a - b);
  return { tile: sorted[Math.floor(r() * sorted.length)], dir: r() < 0.5 ? 1 : -1, outIn: 0, count: crab.count + 1 };
}

// The first crab, out as the board starts.
export const firstCrab = (L, present, seed) => comeOut(freeOf(L, present), { tile: -1, dir: 1, outIn: 0, count: 0 }, seed);

const freeOf = (L, present) => {
  const out = [];
  for (let t = 0; t < L.count; t++) if (present[t] && isFree(L, present, t)) out.push(t);
  return out;
};

// Whether a pair startles the crab: a tile of it touching the crab's tile
// on its layer.
export const startles = (L, crab, a, b) => crab.tile >= 0 && [L.left[crab.tile], L.right[crab.tile]].some((side) => side.includes(a) || side.includes(b));

// The crab after a pair is taken, the board as it is once it's gone:
// startled back into its burrow, or scuttling on a tile, or going back
// with nowhere to go, or in its burrow a match nearer to the next coming
// out, onto a tile free then. `free` gives the tiles free once the pair is
// gone. Returns { crab, startled, cameOut }.
export function afterPair(L, present, crab, a, b, every, seed, free) {
  if (startles(L, crab, a, b)) return { crab: { ...crab, tile: -1, outIn: every }, startled: true, cameOut: false };
  if (crab.tile >= 0) return { crab: scuttle(L, present, crab, every), startled: false, cameOut: false };
  if (crab.outIn > 1) return { crab: { ...crab, outIn: crab.outIn - 1 }, startled: false, cameOut: false };
  const out = comeOut(free(), crab, seed);
  return { crab: out, startled: false, cameOut: out.tile >= 0 };
}


// A deal played through with the crab on the board (deal.js's prefer): at
// each match of the order being made, the crab's tile is left out of the
// free tiles to take from, but when fewer than two others are free, the
// crab goes back into its burrow at once. `start` is the crab as the
// dealing starts, for a shuffle, or null for a new board's first crab.
export function scuttling(L, every, seed, start = null) {
  const crabs = []; // the crab as of each match of the order made so far, once it's gone back if it must
  const prefer = (free, present, order) => {
    const m = order.length;
    let crab;
    if (m === 0) crab = start || firstCrab(L, present, seed);
    else {
      const [a, b] = order[m - 1];
      crab = afterPair(L, present, crabs[m - 1], a, b, every, seed, () => free).crab;
    }
    let open = free.filter((t) => t !== crab.tile);
    if (crab.tile >= 0 && open.length < 2) {
      crab = goBack(crab, every);
      open = free;
    }
    crabs[m] = crab;
    return open;
  };
  // Where the crab is as of the m-th pair, for the deal to remember a dead
  // end with.
  prefer.key = (m) => `${crabs[m].tile},${crabs[m].dir},${crabs[m].outIn},${crabs[m].count}`;
  return prefer;
}
