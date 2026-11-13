import { isFree } from './layout.js';
import { MATCH } from './tiles.js';

// Lords, on the crown: a few tiles are lords, and a lord leaps: he is free
// wherever he is, under other tiles or hemmed in, and goes with any free
// tile of his kind. One taken while he's still held down by the usual rule
// has leapt. Taking a lord never pins another tile down, so the deal's own
// order still wins with lords among the tiles. Game keeps the lords, and
// score.js what their leaps earn.

// The lords for a board: so many tiles held down at the start, each of a
// kind of his own among them, so that a lord always needs another tile of
// his kind to go with, chosen at random.
export function chooseLords(L, faces, present, n, r) {
  const held = [];
  for (let i = 0; i < L.count; i++) if (present[i] && !isFree(L, present, i)) held.push(i);
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
