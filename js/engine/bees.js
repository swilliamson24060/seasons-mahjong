import { seeded } from './rng.js';

// Busy bees, on April Showers' seventh board, the flower bed: a bee flies
// from tulip to tulip, landing on another with every match, and the tulip
// she's flying to next can be seen, ringed, so a pair can be got ready for
// it. A pair taken with the tulip she's on, the top of its head, makes
// honey, for a bonus. A tulip whose top is taken is done: the bee lands
// only on tulips still standing, and once none are, she flies off.
//
// Which tulip she flies to is shuffled for each flight from the board's
// seed, among the tulips still standing, never the one she's on, so that a
// board reached the same way sees the same bee. The deal is made so that its
// own order makes honey at every tulip (foraging), and the hints take the
// bee's tulip whenever they can. The bee changes nothing about when a tile
// can be taken. Game keeps the bee and the honey, and score.js what the
// honey earns.

// The tulips, by their tops: the tiles on the layer given.
export const tulipsOf = (L, layer) => [...L.x.keys()].filter((i) => L.z[i] === layer);

// The tulip the bee flies to on flight k, counted from 0 for the one she
// lands on as the board starts: one of those standing, by a shuffle of its
// own, and not `from`, the one she's on, while another stands; or -1 with
// none standing.
export function flight(seed, k, standing, from = -1) {
  const open = standing.length > 1 ? standing.filter((t) => t !== from) : standing;
  return open.length ? seeded((seed ^ 0x2545f491) + k * 0x9e3779b1).pick(open) : -1;
}

// The bee as the board starts: { at, next, flights }, the tulip she's on and
// the one she flies to next, by their places in the tulips, and the flights
// made.
export function firstFlight(tulips, seed) {
  const all = tulips.map((_, k) => k);
  const at = flight(seed, 0, all);
  return { at, next: flight(seed, 1, all, at), flights: 2 };
}

// The bee after a match, from where she was, the board after it given: she
// flies to the tulip she was flying to next, or, if that's gone, to another
// still standing, and picks the next.
export function flyOn(tulips, bee, present, seed) {
  const standing = tulips.map((_, k) => k).filter((k) => present[tulips[k]]);
  let { flights } = bee;
  let at = bee.next;
  if (at < 0 || !standing.includes(at)) at = flight(seed, flights++, standing);
  const next = at < 0 ? -1 : flight(seed, flights++, standing, at);
  return { at, next, flights };
}

// Whether a pair makes honey: a tile of it the tulip the bee is on.
export const makesHoney = (tulips, bee, a, b) => bee.at >= 0 && (tulips[bee.at] === a || tulips[bee.at] === b);

// The honey an order of pairs makes, taken from the start, and the bee
// after it.
export function honeyIn(tulips, order, present, seed, bee = null) {
  const board = Uint8Array.from(present);
  let now = bee || firstFlight(tulips, seed);
  let honey = 0;
  for (const [a, b] of order) {
    if (makesHoney(tulips, now, a, b)) honey++;
    board[a] = board[b] = 0;
    now = flyOn(tulips, now, board, seed);
  }
  return { honey, bee: now };
}

// A deal that makes honey at every tulip: as it plays the board through
// (deal.js), the bee flying as she would on the order so far, it tries
// first the tulip she's on, if it's free, and last the other tulips, so
// that each is still standing when she comes to it. `bee` is the bee
// before the deal, for a shuffle.
export const foraging = (tulips, seed, bee = null) => (free, present, order) => {
  const before = Uint8Array.from(present);
  for (const [a, b] of order) before[a] = before[b] = 1;
  const now = honeyIn(tulips, order, before, seed, bee).bee;
  const on = now.at >= 0 ? tulips[now.at] : -1;
  const first = free.includes(on) ? [on] : [];
  const rest = free.filter((t) => t !== on && !tulips.includes(t));
  const others = free.filter((t) => t !== on && tulips.includes(t));
  return [...first, ...rest, ...others];
};
