import { isFree } from './layout.js';
import { MATCH } from './tiles.js';

// Pipers, on the bagpipes: a few tiles are pipers. Take a piper, with a tile
// of his kind as any pair is taken, and he plays: the rest of his kind still
// on the board follow him out, from wherever they are, buried or not. A
// kind's tiles all go together, and taking tiles never pins another down, so
// the rest of the deal's own order still wins. Game keeps the pipers, and
// score.js what their followers earn.

// The pipers for a board: so many tiles held down at the start, each of a
// kind of his own, and of a kind with two pairs on the board, so that there
// are two to follow him; chosen at random. Given the deal's own order, each
// is a tile of the first of his kind's pairs that it takes, so that taking
// the pairs in that order, every piper leads two out.
export function choosePipers(L, faces, present, n, r, plan = null) {
  const count = new Map();
  for (let i = 0; i < L.count; i++) if (present[i]) count.set(MATCH[faces[i]], (count.get(MATCH[faces[i]]) || 0) + 1);
  const first = new Set();
  if (plan) {
    const seen = new Set();
    for (const [a, b] of plan) {
      const kind = MATCH[faces[a]];
      if (!seen.has(kind)) first.add(a).add(b);
      seen.add(kind);
    }
  }
  const held = [];
  for (let i = 0; i < L.count; i++) if (present[i] && !isFree(L, present, i) && count.get(MATCH[faces[i]]) >= 4 && (!plan || first.has(i))) held.push(i);
  const kinds = new Set();
  const out = [];
  for (const i of r.shuffle(held)) {
    if (out.length === n) break;
    if (kinds.has(MATCH[faces[i]])) continue;
    kinds.add(MATCH[faces[i]]);
    out.push(i);
  }
  return out;
}
