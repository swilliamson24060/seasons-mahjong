import { solve } from './solver.js';

// Changing partners, on the board of the dancer: every so many matches the
// music changes, and each free tile dances off with a tile still held down,
// and they change places, faces and all, so that tiles held down come free
// and the pairs that were free go back under. Partners are chosen at random,
// and tried again until the solver finds the board can still be won so;
// failing that, the music plays on.

// The dance from a position: free, the free tiles, in the order they are
// partnered, and held, the tiles held down. Returns { faces, swaps, line }:
// the faces after it, the pairs of tiles that changed places, and a way to
// win from there; or null.
export function changePartners(L, position, free, held, r, tries = 12) {
  for (let k = 0; k < tries; k++) {
    const partners = r.shuffle(held.slice()).slice(0, free.length);
    const swaps = partners.map((h, j) => [free[j], h]);
    const faces = Int16Array.from(position.faces);
    for (const [f, h] of swaps) [faces[f], faces[h]] = [faces[h], faces[f]];
    const { result, line } = solve(L, { ...position, faces }, { budget: k < 8 ? 5000 : 20000 });
    if (result === 'win') return { faces, swaps, line };
  }
  return null;
}
