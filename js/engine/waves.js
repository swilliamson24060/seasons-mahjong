import { solve } from './solver.js';

// Waves, on the beach season's sailing: every so many matches a wave rolls
// in over the board's bottom row, and the tiles it reaches turn round among
// themselves, each taking the face of the tile next to it along the row,
// the one at the end going round to the other. A wave's turn is kept only
// if the solver finds the board can still be won after it: one place along
// first, then one place back, then two along and two back, and so on;
// failing all of those, the wave falls short and nothing moves. As on the
// dancer's board (dance.js), a board's own order is broken by its first
// wave, and the board is played on from there by the way the solver found.

// The tiles a wave reaches: those still on the board in its bottom row, on
// any layer, along the row from the left, the lower first where they're
// stacked.
export function waveTiles(L, present) {
  const foot = L.height - 2;
  const out = [];
  for (let t = 0; t < L.count; t++) if (present[t] && L.y[t] === foot) out.push(t);
  return out.sort((a, b) => L.x[a] - L.x[b] || L.z[a] - L.z[b]);
}

// The turns a wave tries along `n` tiles, as how many places along each
// face goes: 1, then back one, then 2 and back two, and so on.
export function turnsOf(n) {
  const out = [];
  for (let d = 1; d <= n / 2; d++) {
    out.push(d);
    if (n - d !== d) out.push(n - d);
  }
  return out;
}

// The faces with those of `tiles` turned `shift` places along them.
export function turned(faces, tiles, shift) {
  const out = Int16Array.from(faces);
  tiles.forEach((t, j) => (out[tiles[(j + shift) % tiles.length]] = faces[t]));
  return out;
}

// A wave rolling in from a position: the first turn of its tiles after
// which the board can still be won. Returns { faces, shift, line }: the
// faces after it, how many places along they went, and a way to win from
// there; or null, the wave falling short.
export function rollIn(L, position, tiles) {
  if (tiles.length < 2) return null;
  for (const shift of turnsOf(tiles.length)) {
    const faces = turned(position.faces, tiles, shift);
    const { result, line } = solve(L, { ...position, faces }, { budget: 20000 });
    if (result === 'win') return { faces, shift, line };
  }
  return null;
}
