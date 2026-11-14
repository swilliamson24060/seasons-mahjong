import { MATCH } from './tiles.js';

// Confetti, on New Year's 4: confetti in four colours has fallen over the
// board, and every tile has caught a fleck of one. Of each kind's tiles, two
// caught the same colour, a couple, and the rest colours unlike theirs and
// each other's; a kind with one pair on the board has none. Taken together,
// a couple is a perfect match, for a bonus, so with three or four of a kind
// free, which go together matters. Confetti changes nothing about when a
// tile can be taken. Game keeps the confetti, and score.js what perfect
// matches earn.

export const COLOURS = ['red', 'gold', 'silver', 'blue'];

// The colour each tile caught, by its place in COLOURS, or -1 for a place
// with no tile, from an order of pairs that takes every tile: of each kind
// with two pairs in it, one pair, chosen at random, is the couple, so that
// taking the pairs in that order takes every couple together.
export function scatter(L, order, faces, r) {
  const colour = new Int8Array(L.count).fill(-1);
  const kinds = new Map();
  for (const pair of order) {
    const k = MATCH[faces[pair[0]]];
    kinds.set(k, [...(kinds.get(k) || []), pair]);
  }
  for (const pairs of kinds.values()) {
    const [first, second, third] = r.shuffle(COLOURS.map((_, c) => c));
    const couple = pairs.length > 1 ? r.int(pairs.length) : -1;
    pairs.forEach(([a, b], k) => {
      // The couple's colour; for the kind's other pair, two unlike it and
      // each other; and for a kind with one pair, two that differ.
      if (k === couple) colour[a] = colour[b] = first;
      else [colour[a], colour[b]] = couple < 0 ? [first, second] : [second, third];
    });
  }
  return colour;
}
