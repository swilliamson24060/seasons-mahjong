import { KINDS, MATCH } from './tiles.js';

// The shopping list, Tuesday's twist: a few things to find before checkout.
// Taking a pair of a kind on the list crosses it off, while the store is
// open: up to and including the match at checkout. Game keeps the list, and
// score.js what it earns.

// The kinds for a list: as many as it wants, each a kind that the deal's own
// winning order takes a pair of before checkout, so that a player can always
// finish the list in time and still clear the board. Only kinds of one face
// go on it, so that what to find is plain: not the flowers or the moons, any
// two of which match.
//
// Things worth looking for come first: none with a pair free from the start
// (avoid), and none the deal takes in the first third of the way to
// checkout. Only if there are too few of those does the list take others.
export function chooseList(plan, faces, checkout, items, r, avoid = new Set()) {
  const firstAt = new Map(); // each kind of one face, and when the deal's order first takes a pair of it
  plan.forEach(([a], at) => {
    const k = MATCH[faces[a]];
    if (KINDS[k].faces.length === 1 && !firstAt.has(k)) firstAt.set(k, at);
  });
  const early = [...firstAt].filter(([, at]) => at < checkout);
  const from = Math.floor(checkout / 3);
  const better = early.filter(([k, at]) => at >= from && !avoid.has(k)).map(([k]) => k);
  const rest = early.map(([k]) => k).filter((k) => !better.includes(k));
  return [...r.shuffle(better), ...r.shuffle(rest)].slice(0, items);
}
