import { opensOf } from './layout.js';

// The spiral stairs, on the beach season's lighthouse: in its tower the
// stairs run up and down, so a tile there is free when the tile above it or
// the tile below it on its layer is gone, and nothing lies on it, where
// elsewhere it's the tile to its left or right. withStairs gives the
// tower's tiles those as their two sides, so that the game's rule, the
// solver, the deal and the hints all keep to the stairs as they keep to any
// board's sides, and nothing else need know them.

// A layout whose tiles for which onStairs(L, i) holds are on the stairs:
// each one's sides the tiles touching it above and below on its layer, so
// that the tiles beside it on the stairs are no longer its sides. A tile
// off the stairs keeps its own sides, a tile of the stairs beside it among
// them. stairs marks the tiles on them.
export function withStairs(L, onStairs) {
  const stairs = Uint8Array.from({ length: L.count }, (_, i) => (onStairs(L, i) ? 1 : 0));
  const touching = (i, dy) => {
    const out = [];
    for (let j = 0; j < L.count; j++) if (L.z[j] === L.z[i] && L.y[j] - L.y[i] === dy && Math.abs(L.x[j] - L.x[i]) < 2) out.push(j);
    return out;
  };
  const left = L.left.map((side, i) => (stairs[i] ? touching(i, -2) : side));
  const right = L.right.map((side, i) => (stairs[i] ? touching(i, 2) : side));
  const opens = opensOf(left, right);
  const weight = Int16Array.from(L.below, (b, i) => b.length + opens[i].length);
  return { ...L, left, right, opens, weight, stairs };
}
