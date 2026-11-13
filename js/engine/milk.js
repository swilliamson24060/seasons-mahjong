import { isFree } from './layout.js';

// Fresh milk, on the milk pail: a few pairs on the board are pails of fresh
// milk. Once either of a pail's tiles is free, its milk keeps for so many
// matches, and then sours: there is that long to dig out its other tile and
// take the two together. Take either with another tile, and it spills. Game
// keeps the pails, and score.js what they earn.

// When each tile first comes free, taking the pairs of an order in turn
// from the tiles present at the start: the pairs taken before it, or -1 for
// a tile never free.
function freedAt(L, start, order) {
  const present = Uint8Array.from(start);
  const at = new Int16Array(L.count).fill(-1);
  const look = (k) => {
    for (let t = 0; t < L.count; t++) if (at[t] < 0 && present[t] && isFree(L, present, t)) at[t] = k;
  };
  order.forEach(([a, b], k) => {
    look(k);
    present[a] = present[b] = 0;
  });
  look(order.length);
  return at;
}

// The pairs of a deal's own order that could be pails: each one the order
// takes within keeps pairs of either of its tiles coming free, so that it
// can be had fresh, and neither of whose tiles is free from the start. Each
// is [pair, its place in the order].
export function possiblePails(L, plan, keeps) {
  const at = freedAt(L, new Uint8Array(L.count).fill(1), plan);
  const out = [];
  plan.forEach(([a, b], k) => {
    const first = Math.min(at[a], at[b]);
    if (first > 0 && k - first < keeps) out.push([[a, b], k]);
  });
  return out;
}

// The pails for a board: so many of the pairs that could be, as the deal's
// own order takes them together, so that the rest of the order still wins
// whoever takes them and whenever. One from each stretch of the order, from
// a tenth of the way through to the end, so that they come free one after
// another; a stretch with none gives one from elsewhere.
export function choosePails(L, plan, n, r, keeps) {
  const possible = possiblePails(L, plan, keeps);
  const from = Math.floor(plan.length / 10);
  const out = [];
  for (let s = 0; s < n; s++) {
    const start = from + Math.floor(((plan.length - from) * s) / n);
    const end = from + Math.floor(((plan.length - from) * (s + 1)) / n);
    const stretch = possible.filter(([p, k]) => k >= start && k < end && !out.includes(p));
    if (stretch.length) out.push(r.pick(stretch)[0]);
  }
  const rest = r.shuffle(possible.map(([p]) => p).filter((p) => !out.includes(p)));
  while (out.length < n && rest.length) out.push(rest.pop());
  return out.map((p) => p.slice());
}

// The places in a deal at which it takes a pair that could be a pail, one
// in each stretch of it from a tenth of the way through, at random.
export function pailSteps(r, count, pairs) {
  const from = Math.floor(pairs / 10);
  return Array.from({ length: count }, (_, k) => from + Math.floor(((pairs - from - 2) * (k + r())) / count));
}

// How the milk pail is dealt: at each of the places at, a pair of tiles
// that have both come free within the last few pairs, where there is one,
// so that there are pails to be had all through the board. deal.js says
// how it is used.
export function plantPails(L, at, keeps) {
  let start = null;
  return (free, present, order) => {
    if (!order.length) start = Uint8Array.from(present);
    if (!at.includes(order.length)) return free;
    const came = freedAt(L, start, order);
    const recent = free.filter((t) => came[t] > 0 && came[t] >= order.length - (keeps - 2));
    if (recent.length < 2) return free;
    return [recent[0], recent[1], ...free.filter((t) => t !== recent[0] && t !== recent[1])];
  };
}
