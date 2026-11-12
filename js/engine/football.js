// Rivalry football, Saturday's twist: the board is the field, running from
// the end zone at the top to the one at the bottom, and a pair taken with a
// tile in each end zone is a touchdown, for a bonus. Game counts them, and a
// deal is made so that its own winning order scores at least one.

// Which end zone each tile is in: -1 the top one, 1 the bottom one, and 0
// for the field between. An end zone is the rows of tiles within `depth`
// of its end of the board, on every layer.
export function endZones(L, depth) {
  const H = L.height;
  return Int8Array.from({ length: L.count }, (_, i) => (L.y[i] < 2 * depth ? -1 : L.y[i] + 2 > H - 2 * depth ? 1 : 0));
}

// Whether a pair is a touchdown: one tile in each end zone.
export const isTouchdown = (zones, a, b) => zones[a] * zones[b] === -1;
