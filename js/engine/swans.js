import { MATCH } from './tiles.js';

// Swans, on the board of the swan on the lake, whose bottom half is its top
// half mirrored in the water. A tile's reflection is the tile as far below
// the waterline as it is above, on the same layer; a tile and its own
// reflection that match are a swan, to be taken together.

// Each tile's reflection, or -1 for a tile with none.
export function mirrorOf(L) {
  const at = new Map();
  for (let i = 0; i < L.count; i++) at.set(`${L.x[i]},${L.y[i]},${L.z[i]}`, i);
  return Int16Array.from({ length: L.count }, (_, i) => {
    const m = at.get(`${L.x[i]},${L.height - 2 - L.y[i]},${L.z[i]}`);
    return m === undefined || m === i ? -1 : m;
  });
}

// The swans among the tiles present, each [tile, its reflection].
export function swansIn(L, mirror, faces, present) {
  const out = [];
  for (let a = 0; a < L.count; a++) {
    const b = mirror[a];
    if (b > a && present[a] && present[b] && MATCH[faces[a]] === MATCH[faces[b]]) out.push([a, b]);
  }
  return out;
}

// Whether each swan's tiles could go with others: her kind has another pair
// among the tiles present, so that she's found only by taking her two tiles
// together, not by having no other way to take them.
export function swansCanPart(faces, present, swans) {
  const count = new Map();
  for (let i = 0; i < faces.length; i++) if (present[i]) count.set(MATCH[faces[i]], (count.get(MATCH[faces[i]]) || 0) + 1);
  return swans.every(([a]) => count.get(MATCH[faces[a]]) > 2);
}

// The steps of a deal at which its swans are wanted, the first from the
// first, spread over the board's pairs but for the last few.
export function swanSteps(r, count, pairs) {
  const span = Math.max(1, pairs - 6);
  return Array.from({ length: count }, () => r.int(span)).sort((a, b) => a - b);
}

// How the board of the swan is dealt: count of its pairs are a tile and its
// own reflection, the kth taken once the deal is at[k] pairs in, and from
// tiles that were not both free from the start where it can, so that the
// swans come free at different times as the board opens; otherwise no tile
// goes first with its own reflection, so that there are no more swans.
// deal.js says how it is used.
export function plantSwans(mirror, count, at) {
  let atStart = null;
  return (free, present, order) => {
    if (!order.length) atStart = new Set(free);
    let planted = 0;
    for (const [a, b] of order) if (mirror[a] === b) planted++;
    if (planted < count && order.length >= at[planted]) {
      const open = new Set(free);
      const both = free.filter((i) => mirror[i] >= 0 && open.has(mirror[i]));
      const t = both.find((i) => !atStart.has(i) || !atStart.has(mirror[i])) ?? both[0];
      if (t !== undefined) return [t, mirror[t], ...free.filter((i) => i !== t && i !== mirror[t])];
    }
    if (free.length > 2 && mirror[free[0]] === free[1]) return [free[0], free[2], free[1], ...free.slice(3)];
    return free;
  };
}
