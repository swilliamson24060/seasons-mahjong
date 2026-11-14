import { isFree } from './layout.js';
import { touching } from './flock.js';

// Resolutions, on New Year's Day: a few sweets sit free on top of the
// board, each holding tiles down, and the resolution is to leave them alone
// through January, the board's first so many matches. Each match held out
// earns points, and the whole month a bonus; take a sweet before then and
// the resolution is broken. After January the sweets are fair game. Sweets
// change nothing about when a tile can be taken. Game keeps the sweets and
// the resolution, and score.js what holding out earns.

// The sweets for a board: so many tiles free at the start that hold others
// down, chosen at random, none touching another, so that each tempts in a
// part of the board of its own.
export function chooseSweets(L, present, n, r) {
  const tops = [];
  for (let i = 0; i < L.count; i++) if (present[i] && isFree(L, present, i) && L.below[i].some((j) => present[j])) tops.push(i);
  const out = [];
  for (const i of r.shuffle(tops)) {
    if (out.length === n) break;
    if (out.every((j) => !touching(L, i, j))) out.push(i);
  }
  return out;
}

// A deal that leaves the sweets alone through January: as it plays the
// board through (deal.js), it tries every other free tile before a sweet
// for its first `days` pairs, so that its own order can keep the
// resolution.
export const resisting = (sweets, days) => (free, present, order) => (order.length < days ? [...free.filter((i) => !sweets[i]), ...free.filter((i) => sweets[i])] : free);

// Whether an order of pairs leaves the sweets alone for its first `days`
// pairs.
export const holdsOut = (order, sweets, days) => order.slice(0, days).every(([a, b]) => !sweets[a] && !sweets[b]);
