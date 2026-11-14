import { isFree } from './layout.js';
import { inLight } from './disco.js';
import { seeded } from './rng.js';

// Shooting stars, on New Year's 3: as the board starts, and again every so
// many matches, a shooting star streaks across one row of the board, and
// the row glows until the next. A pair taken with both its tiles in that
// row makes a wish, one wish to a star, for a bonus. Each star crosses a
// row where a wish can be made. Stars change nothing about when a tile can
// be taken. Game keeps the stars and the wishes, and score.js what they
// earn.

// Whether a tile lies in a row: whether its middle does, so that a tile
// half a row out of line lies in both the rows it lies across (disco.js).
export const inRow = (L, i, row) => inLight(L, i, row, 1);

// The rows a star can cross, as the tiles lie: those with two free tiles of
// a kind in them, to wish on at once; or with none of those, the rows with
// two tiles of a kind in them, to dig a wish out of.
export function wishRows(L, present, faces, kindOf) {
  const free = [];
  const held = [];
  for (let row = 0; row < Math.ceil(L.height / 2); row++) {
    const kinds = new Map();
    for (let i = 0; i < L.count; i++) {
      if (!present[i] || !inRow(L, i, row)) continue;
      const k = kindOf(faces[i]);
      const e = kinds.get(k) || { all: 0, free: 0 };
      e.all++;
      if (isFree(L, present, i)) e.free++;
      kinds.set(k, e);
    }
    if ([...kinds.values()].some((e) => e.free >= 2)) free.push(row);
    else if ([...kinds.values()].some((e) => e.all >= 2)) held.push(row);
  }
  return free.length ? free : held;
}

// The row a board's star crosses, counted from 0 for the one as it starts:
// one of the rows given, picked by a shuffle of its own, so that a board
// reached the same way sees the same stars; or -1 with none to cross.
export function starRow(rows, seed, k) {
  return rows.length ? seeded((seed ^ 0x6c62272e) + k * 0x9e3779b1).pick(rows) : -1;
}
