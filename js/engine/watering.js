import { touching } from './flock.js';

// Watering, on April Showers' fifth board, the seed tray: its seedlings
// sit in the tray, each a tile with its first leaves round it. A pair with
// a tile touching a seedling, beside it or just above or below it on its
// layer (flock.js), waters it; watered so many times, it blooms, and a
// bloom taken, with any tile of its kind, is picked, for a bonus. A
// seedling taken before it blooms is pulled up, just a tile.
//
// So it pays to water a seedling first and take it after: a seedling comes
// free as soon as a leaf beside it is taken, a watering already, and the
// rest of its leaves are still to go. The deal is made so that its own
// order waters every seedling and picks it in bloom (tending), and the
// hints keep to a way that does. Seedlings change nothing about when a
// tile can be taken. Game keeps the seedlings and their water, and
// score.js what the blooms earn.

// The seedlings' tiles, from where they sit, each [column, row, layer].
export function seedlingsOf(L, cells) {
  return cells.map(([c, r, z]) => {
    const i = [...L.x.keys()].find((t) => L.x[t] === c * 2 && L.y[t] === r * 2 && L.z[t] === z);
    if (i === undefined) throw new Error(`${L.name} has no tile for a seedling at ${c}, ${r} on layer ${z}`);
    return i;
  });
}

// What a tile is in the tray: 'seedling', 'leaf', touching a seedling on
// its layer, 'rim', the soil round the tray's edge, or 'soil'.
export function plotOf(L, i, seedlings) {
  if (seedlings.includes(i)) return 'seedling';
  if (seedlings.some((s) => touching(L, s, i))) return 'leaf';
  const edge = L.x[i] === 0 || L.y[i] === 0 || L.x[i] + 2 === L.width || L.y[i] + 2 === L.height;
  return L.z[i] === 0 && edge ? 'rim' : 'soil';
}

// Whether a pair waters a seedling: a tile of it touching the seedling,
// neither tile the seedling itself.
export const waters = (L, s, a, b) => a !== s && b !== s && (touching(L, s, a) || touching(L, s, b));

// The tray as an order of pairs plays out, from the water given and which
// seedlings were taken: each seedling's water, and how each taken was
// taken, 'picked' in bloom or 'pulled' before, or null still in the tray.
export function tendIn(L, order, seedlings, drinks, water = null, taken = null) {
  const w = water ? Array.from(water) : seedlings.map(() => 0);
  const how = taken ? Array.from(taken) : seedlings.map(() => null);
  for (const [a, b] of order) {
    seedlings.forEach((s, k) => {
      if (how[k]) return;
      if (s === a || s === b) how[k] = w[k] >= drinks ? 'picked' : 'pulled';
      else if (waters(L, s, a, b)) w[k]++;
    });
  }
  return { water: w, taken: how };
}

// A deal that waters the seedlings and picks them in bloom: as it plays the
// board through (deal.js), the tray tended as it would be on the order so
// far, it tries first the seedlings in bloom, then the leaves of those
// still growing, a leaf of each in turn, so that one pair waters two, then
// the rest, and the seedlings still growing last. `water` and `taken` are
// the tray before the deal, for a shuffle.
export const tending = (L, seedlings, drinks, water = null, taken = null) => (free, present, order) => {
  const now = tendIn(L, order, seedlings, drinks, water, taken);
  const kOf = (t) => seedlings.indexOf(t);
  const growing = (k) => !now.taken[k] && now.water[k] < drinks;
  const blooms = free.filter((t) => kOf(t) >= 0 && !growing(kOf(t)));
  const buds = free.filter((t) => kOf(t) >= 0 && growing(kOf(t)));
  const leaves = seedlings.map((s, k) => (growing(k) && present[s] ? free.filter((t) => kOf(t) < 0 && touching(L, s, t)) : []));
  const turns = [];
  for (let n = 0; leaves.some((l) => l.length > n); n++) for (const l of leaves) if (l.length > n && !turns.includes(l[n])) turns.push(l[n]);
  const rest = free.filter((t) => kOf(t) < 0 && !turns.includes(t));
  return [...blooms, ...turns, ...rest, ...buds];
};

// How many seedlings an order of pairs picks in bloom, taken from the
// start: for making a deal whose own order picks them all.
export const bloomsIn = (L, order, seedlings, drinks) => tendIn(L, order, seedlings, drinks).taken.filter((h) => h === 'picked').length;
