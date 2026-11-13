import { touching } from './flock.js';

// Goslings, on the board of geese, follow their mother in a line. A pair
// follows on from the pair taken just before it when one of its tiles lay
// beside one of that pair's, touching it on the same layer (flock.js), or
// under it. So many goslings in a line make a brood, which scores, and a
// new line starts from the pair that made it.

// Whether a pair follows on from the pair taken before it.
export function followsOn(L, before, pair) {
  return before.some((p) => pair.some((t) => touching(L, p, t) || L.below[p].includes(t)));
}
