import { isFree } from './layout.js';

// The lucky coin, on New Year's 7: a coin is hidden in one of the tiles,
// one on the bottom layer held down at the start. After every pair taken
// until it is found, the coin says how close the pair came to it, by the
// nearer of its two tiles: hot, warm or cold. It is found as its tile comes
// free, and the sooner, the more it's worth, so it pays to dig where it's
// hot. The coin changes nothing about when a tile can be taken. Game keeps
// the coin and its readings, and score.js what finding it earns.

// How far apart two tiles are, in tiles, across or down, whichever is
// further, whatever their layers: a tile lying on another is no way from it.
export const apart = (L, a, b) => Math.max(Math.abs(L.x[a] - L.x[b]), Math.abs(L.y[a] - L.y[b])) / 2;

// How close a pair came to the coin, by the nearer of its tiles: 'hot'
// within `hot` tiles of it, 'warm' within `warm`, and otherwise 'cold'.
export function heatOf(L, pair, coin, { hot, warm }) {
  const near = Math.min(...pair.map((t) => apart(L, t, coin)));
  return near <= hot ? 'hot' : near <= warm ? 'warm' : 'cold';
}

// Where the coin is hidden: a tile on the bottom layer held down at the
// start, chosen at random.
export function hideCoin(L, present, r) {
  const held = [];
  for (let i = 0; i < L.count; i++) if (present[i] && L.z[i] === 0 && !isFree(L, present, i)) held.push(i);
  return held.length ? r.pick(held) : -1;
}
