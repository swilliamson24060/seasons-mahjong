import { isFree } from './layout.js';
import { touching } from './flock.js';

// Fireworks, on New Year's 9: a few tiles are rockets. Take a rocket, with a
// tile of its kind as any pair is taken, and it bursts, lighting up every
// tile touching it: beside it, or just above or below it, on its layer
// (flock.js), and the tiles it sat on. Two lit tiles taken together are a
// lit pair, for a bonus, so a rocket is best set off where pairs are
// waiting. Lighting a tile changes nothing about when it can be taken, so
// the deal's own order still wins. Game keeps the rockets and the lit tiles,
// and score.js what the lit pairs earn.

// The tiles a rocket lights as it bursts: those still on the board touching
// it, or under it.
export function sparksOf(L, present, t) {
  const out = [];
  for (let i = 0; i < L.count; i++) if (present[i] && i !== t && touching(L, t, i)) out.push(i);
  for (const i of L.below[t]) if (present[i]) out.push(i);
  return out;
}

// How many lit pairs taking the pairs in `order` would take, from the tiles
// `present`, with the rockets given (1 for a tile that is one): for making a
// deal whose own order takes one.
export function litPairsIn(L, order, rockets, present) {
  const here = present.slice();
  const lit = new Uint8Array(L.count);
  let n = 0;
  for (const [a, b] of order) {
    if (lit[a] && lit[b]) n++;
    here[a] = here[b] = 0;
    for (const t of [a, b]) if (rockets[t]) for (const i of sparksOf(L, here, t)) lit[i] = 1;
  }
  return n;
}

// The rockets for a board: so many tiles held down at the start, chosen at
// random, each with at least `near` tiles round it to light, and none
// touching another or lying on one, so that each lights a part of the board
// of its own.
export function chooseRockets(L, present, n, r, near = 3) {
  const held = [];
  for (let i = 0; i < L.count; i++) if (present[i] && !isFree(L, present, i) && sparksOf(L, present, i).length >= near) held.push(i);
  const apart = (i, j) => !touching(L, i, j) && !L.below[i].includes(j) && !L.below[j].includes(i);
  const out = [];
  for (const i of r.shuffle(held)) {
    if (out.length === n) break;
    if (out.every((j) => apart(i, j))) out.push(i);
  }
  return out;
}
