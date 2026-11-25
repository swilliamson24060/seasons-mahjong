import { seeded } from './rng.js';
import { touching } from './flock.js';

// Snowballs, on the Start of Spring's second board, the thaw: every few
// matches a snowball lands on a free tile and snows it in, so that it can't
// be taken until a pair is taken beside it, touching it on its layer, which
// knocks the snow off, for points; left alone, it melts after a few matches.
//
// The snow rides on the game's ice (as Thanksgiving's frozen turkey does): a
// snowed tile is frozen until it would melt, so that the solver, the hints
// and a shuffle, which all know ice, never count on it before then; knocking
// the snow off early only ever frees a tile sooner. Where a snowball lands
// is found from the board as it stands, and from the board's seed, so that a
// board played the same way sees the same snowballs, however its hints were
// asked for. Game keeps the snow, and score.js what knocking it off earns.

// The tiles a snowball could land on, the board after a match: free tiles
// that `way`, a way to clear the board from here, won't want before the snow
// would melt, `melt` matches on, so that it's still a way; each with a tile
// beside it still on the board, to knock its snow off with.
export function landingSpots(L, free, present, way, melt) {
  const soon = new Set(way.slice(0, melt).flat());
  return free.filter((t) => !soon.has(t) && [...L.x.keys()].some((j) => j !== t && present[j] === 1 && touching(L, t, j)));
}

// The spot the board's kth snowball lands on, chosen from the board's seed,
// or -1 with none to land on.
export const landingOf = (spots, seed, k) => (spots.length ? seeded((seed ^ 0x6b43a9b5) + k * 0x9e3779b1).pick(spots) : -1);

// The snowed tiles a pair knocks the snow off: those a tile of it touches.
export const knocks = (L, snowed, a, b) => snowed.filter((t) => touching(L, t, a) || touching(L, t, b));
