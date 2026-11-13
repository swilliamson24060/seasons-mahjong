// Rings, on the board of five gold rings: each is the square its tiles go
// round, given as [left, top, across, down] in tiles from the board's top
// left. A tile is a ring's when it lies on that square's edge, on any
// layer, so where two rings cross, the tiles there are both rings'; a tile
// poking through a ring's hole is not that ring's. Once every tile of a
// ring has been taken, it turns to gold.

// The tiles of each ring, in the order the squares are given.
export function ringTiles(L, squares) {
  return squares.map(([left, top, across, down]) => {
    const x0 = 2 * left;
    const y0 = 2 * top;
    const x1 = 2 * (left + across);
    const y1 = 2 * (top + down);
    const tiles = [];
    for (let i = 0; i < L.count; i++) {
      const [x, y] = [L.x[i], L.y[i]];
      const inside = x >= x0 && x + 2 <= x1 && y >= y0 && y + 2 <= y1;
      const inHole = x >= x0 + 2 && x + 2 <= x1 - 2 && y >= y0 + 2 && y + 2 <= y1 - 2;
      if (inside && !inHole) tiles.push(i);
    }
    return tiles;
  });
}

// How the board of gold rings is dealt: a ring at a time, so that a ring's
// tiles are paired with each other where they can be, and a ring can be
// cleared before the board is. The free tiles of the ring with the fewest
// tiles left go first, then those lying on its tiles or beside them, which
// hold them down, and the rest after; rank is the order the rings go in
// when they have as many left, shuffled with each deal. deal.js says how it
// is used.
export function ringByRing(L, rings, rank) {
  const sets = rings.map((tiles) => new Set(tiles));
  return (free, present) => {
    let best = -1;
    let fewest = Infinity;
    for (const k of rank) {
      let left = 0;
      for (const t of rings[k]) left += present[t];
      if (left > 0 && left < fewest) {
        best = k;
        fewest = left;
      }
    }
    if (best < 0) return free;
    const ring = sets[best];
    const holding = new Set();
    for (const t of rings[best]) if (present[t]) for (const j of [...L.above[t], ...L.left[t], ...L.right[t]]) holding.add(j);
    const place = (t) => (ring.has(t) ? 0 : holding.has(t) ? 1 : 2);
    return [0, 1, 2].flatMap((n) => free.filter((t) => place(t) === n));
  };
}
