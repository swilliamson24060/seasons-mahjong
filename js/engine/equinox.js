// Day and night, on the Start of Spring's seventh board: day and night are
// equal at the equinox, the sun in one pan of the scales and the moon in
// the other. The board's left half is day and its right half night, either
// side of its middle, where the scales' post stands, which is neither; a
// pair with a tile from each, day and night together, is an equinox pair,
// for points. The deal pairs day with night where it can (balancing), so
// that most kinds have tiles on both sides, and pairing them across or
// along is the player's to choose. Game counts the equinox pairs, and
// score.js what they earn.

// The side of the board a tile is on: 'day', its middle left of the
// board's, 'night', right of it, or null, on it.
export function sideOf(L, i) {
  const centre = L.x[i] + 1;
  const middle = L.width / 2;
  return centre < middle ? 'day' : centre > middle ? 'night' : null;
}

// Whether a pair is an equinox pair: a tile from each side.
export function isEquinox(L, a, b) {
  const s = sideOf(L, a);
  const t = sideOf(L, b);
  return s !== null && t !== null && s !== t;
}

// The equinox pairs an order of pairs takes.
export const equinoxIn = (L, order) => order.filter(([a, b]) => isEquinox(L, a, b)).length;

// A deal that pairs day with night: as it plays the board through
// (deal.js), it tries first a free tile from the day side with one from
// the night side, the first of each in its own shuffle, and then the rest.
export const balancing = (L) => (free) => {
  const day = free.find((t) => sideOf(L, t) === 'day');
  const night = free.find((t) => sideOf(L, t) === 'night');
  if (day === undefined || night === undefined) return free;
  return [day, night, ...free.filter((t) => t !== day && t !== night)];
};
