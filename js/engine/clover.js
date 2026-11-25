import { seeded } from './rng.js';

// The four-leaf clover, on the Start of Spring's fifth board, luck of the
// Irish: a four-leaf clover hides on a tile held down, and shows once that
// tile comes free. Taken, with a tile of its kind, within so many matches of
// showing, it's a stroke of luck, for points; left longer, it blows away.
// Either way, another hides.
//
// Where a clover hides is chosen from the board as it stands and the
// board's seed: among the tiles held down that a way to clear the board,
// found afresh, frees soon and then takes in time, so that each clover can
// be had, and one comes along every few matches; and so a board played the
// same way hides the same clovers, however its hints were asked for. Game
// keeps the clover, and score.js what the luck earns.

// How many matches the way may take to free the tile a clover hides on, if
// there are tiles it frees that soon; and how many a clover hides for, its
// tile not coming free, before it hides somewhere else, unseen, so that a
// player off that way still comes on clovers.
export const SOON = 6;
export const RESTLESS = 10;

// The tiles a clover could hide on: of the tiles held down, `held`, those
// that `way`, a way to clear the board from here, frees within `soon`
// matches and then takes within `within` matches of freeing; present the
// tiles on the board, and freeAt(p, t) whether tile t is free with the
// tiles p on the board.
export function hidingPlaces(way, present, held, freeAt, within, soon = Infinity) {
  const p = Uint8Array.from(present);
  const freed = new Map(); // a tile held down, and the match of the way after which it came free
  const out = [];
  way.forEach(([a, b], k) => {
    for (const t of [a, b]) if (freed.has(t) && freed.get(t) <= soon && k + 1 - freed.get(t) <= within) out.push(t);
    p[a] = p[b] = 0;
    for (const t of held) if (p[t] && !freed.has(t) && freeAt(p, t)) freed.set(t, k + 1);
  });
  return out.sort((x, y) => x - y);
}

// The tile the board's kth clover hides on, counted from 0 for the one
// hidden as the board starts, chosen from the board's seed; or -1 with
// nowhere to hide.
export const hidingOf = (places, seed, k) => (places.length ? seeded((seed ^ 0x1c8e5a7d) + k * 0x9e3779b1).pick(places) : -1);
