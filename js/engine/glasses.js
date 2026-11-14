// A toast for two, on New Year's 2: two glasses of champagne stand at the
// two ends of a path along the 2's stroke. With every match, each glides
// one place along it toward the other, if its way is clear: a place is
// clear once no tile lies over it above the bottom layer. When they come
// side by side they clink, a toast, worth the more the sooner. The glasses
// change nothing about when a tile can be taken. Game keeps the glasses,
// and score.js what the toast earns.

// A path's places, given as [column, row] of the board's grid, in half
// tiles, as positions are (layout.js).
export const pathOf = (cells) => cells.map(([column, row]) => [column * 2, row * 2]);

// Whether a tile lies over a place, on a layer above the bottom one.
export const over = (L, i, [x, y]) => L.z[i] >= 1 && Math.abs(L.x[i] - x) < 2 && Math.abs(L.y[i] - y) < 2;

// Whether a place is clear: no tile still on the board lies over it.
export function clear(L, present, place) {
  for (let i = 0; i < L.count; i++) if (present[i] && over(L, i, place)) return false;
  return true;
}

// The tiles in the glasses' way as the board starts, 1 for each: those
// over the places between the two they start on.
export function inTheWay(L, path) {
  const way = new Uint8Array(L.count);
  for (let k = 1; k < path.length - 1; k++) for (let i = 0; i < L.count; i++) if (over(L, i, path[k])) way[i] = 1;
  return way;
}

// A deal that pairs each tile in the way with one of the tiles free with
// it, as it plays the board through taking a tile in the way first,
// whenever one is free (deal.js), so that the way can be cleared from
// the start; though not two tiles in the way together, and not in the
// order the glasses come to them.
export const clearingTheWay = (way) => (free) => {
  const k = free.findIndex((i) => way[i]);
  if (k < 0) return free;
  return [free[k], ...free.filter((i) => !way[i]), ...free.filter((i, j) => way[i] && j !== k)];
};

// The glasses after a match, { left, right }, their places along the path:
// each glides one place on toward the other, if its way is clear.
export function glide(L, present, path, { left, right }) {
  let l = left;
  let r = right;
  if (l + 1 < r && clear(L, present, path[l + 1])) l++;
  if (r - 1 > l && clear(L, present, path[r - 1])) r--;
  return { left: l, right: r };
}

// Whether the glasses have come together, side by side along the path.
export const together = ({ left, right }) => right - left <= 1;
