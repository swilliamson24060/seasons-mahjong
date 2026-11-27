import { FACES } from './tiles.js';

// Count off, on Independence Day's flag: the marchers count off as they
// pass, one to nine. A pair of the next number in turn, of any of the
// three suits, counts off, for points, and after the nine they start
// again at one; a pair of another number, or of none, the winds, the
// dragons, the flowers and the moons, leaves the count where it was. A
// number with none of its tiles left on the board is passed over, so that
// the count never waits on what isn't there. The deal lays the count
// along its own order (layCount, below), so that there are numbers to
// count all through the board, and the hints count off where they can.
// Game keeps the count; score.js what it earns.

const SUITED = new Set(['eyes', 'bones', 'graves']);

// A face's number, one to nine, or 0 for a face with none.
export const numberOf = (face) => (face >= 0 && SUITED.has(FACES[face].group) ? Number(FACES[face].index) : 0);

// The number after n, one to nine and round again.
export const after = (n) => (n % 9) + 1;

// The number to count next from n: n itself, or the first after it of
// which there's anything still to count, as has(n) says; 0 with none of
// any number left.
export function nextOf(n, has) {
  for (let k = 0; k < 9; k++, n = after(n)) if (has(n)) return n;
  return 0;
}

// A deal's faces laid along its own order so that, taken in that order, it
// counts off as often as its numbers allow: at each pair of the order a
// pair of the next number, if one is left, after a rest of up to `rest`
// pairs of other numbers, or of none, chosen from r. Whole pairs of faces
// are moved from one place in the order to another, so that the order
// still wins. next is the number to count first. Returns the faces.
export function layCount(order, faces, next, r, rest = 2) {
  const out = Int16Array.from(faces);
  const pool = order.map(([a, b]) => [faces[a], faces[b]]);
  let resting = r.int(rest + 1);
  for (const [a, b] of order) {
    next = nextOf(next || 1, (n) => pool.some(([f]) => numberOf(f) === n));
    const wanted = [];
    const others = [];
    pool.forEach(([f], k) => (next && numberOf(f) === next ? wanted : others).push(k));
    const k = (resting || !wanted.length) && others.length ? r.pick(others) : r.pick(wanted.length ? wanted : others);
    const [f, g] = pool.splice(k, 1)[0];
    out[a] = f;
    out[b] = g;
    if (next && numberOf(f) === next) {
      next = after(next);
      resting = r.int(rest + 1);
    } else if (resting) resting--;
  }
  return out;
}
