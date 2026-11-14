import { isFree } from './layout.js';
import { seeded } from './rng.js';

// The balloon drop, on New Year's 6: as the board starts, and again every
// so many matches, a net opens over the board and balloons drop onto a few
// of the free tiles, each a tile with no other of its kind free, so that
// popping it means digging one out. A balloon pops when its tile is taken,
// for a bonus, and the balloons still on the board when the next net opens
// float away. Balloons change nothing about when a tile can be taken, so
// the deal's own order still wins. Game keeps the balloons, and score.js
// what the pops earn.

// Where a net's balloons can land, as the tiles lie: the free tiles with no
// other tile of their kind free.
export function spots(L, present, faces, kindOf) {
  const free = [];
  const freeOf = new Map();
  for (let i = 0; i < L.count; i++) {
    if (!present[i] || !isFree(L, present, i)) continue;
    free.push(i);
    freeOf.set(kindOf(faces[i]), (freeOf.get(kindOf(faces[i])) || 0) + 1);
  }
  return free.filter((i) => freeOf.get(kindOf(faces[i])) === 1);
}

// Where the balloons of a board's net land, counted from 0 for the one as
// it starts: so many of the spots, where a shuffle of their own puts them,
// so that a board reached the same way drops the same.
export function landing(spots, drop, seed, k) {
  return seeded((seed ^ 0x5be0cd19) + k * 0x9e3779b1).shuffle(spots).slice(0, drop);
}

// How many balloons taking the pairs in `order` from the start would pop,
// with the nets given ({ every, drop }), from the tiles `present` with the
// faces given: for making a deal whose own order pops one.
export function poppedIn(L, order, present, { every, drop }, seed, faces, kindOf) {
  const here = present.slice();
  let on = new Set(landing(spots(L, here, faces, kindOf), drop, seed, 0));
  let popped = 0;
  order.forEach(([a, b], k) => {
    popped += (on.has(a) ? 1 : 0) + (on.has(b) ? 1 : 0);
    on.delete(a);
    on.delete(b);
    here[a] = here[b] = 0;
    if ((k + 1) % every === 0 && k + 1 < order.length) on = new Set(landing(spots(L, here, faces, kindOf), drop, seed, (k + 1) / every));
  });
  return popped;
}
