// Birds of a feather, the twist on Christmas's fourth day: a pair whose two
// tiles touch, side by side or one just above the other, on the same layer,
// flocks together, for a bonus. Game counts them, and a deal is made so that
// its own winning order takes at least one.

// Whether two tiles touch: on the same layer, beside each other with their
// rows overlapping, or one just above the other with their columns
// overlapping. Positions are in half tiles (layout.js).
export function touching(L, a, b) {
  if (L.z[a] !== L.z[b]) return false;
  const dx = Math.abs(L.x[a] - L.x[b]);
  const dy = Math.abs(L.y[a] - L.y[b]);
  return (dx === 2 && dy < 2) || (dy === 2 && dx < 2);
}
