// Leftovers, Thursday's twist: a fridge beside the table, with a few
// containers. A free tile put in one is off the table, so it holds nothing
// down any more, and it still matches: it waits there for its partner, and
// everything in the fridge has to be eaten by the end.
//
// The containers are places of their own, added to the board's layout after
// its tiles: places with nothing on them and nothing beside them, so that a
// tile in one is always free and frees whatever it held down when it left
// the table. A tile goes into a container by moving there, so a deal, the
// solver, the hints and the safe shuffle treat it as they treat any tile.

// A layout with k containers after its tiles: a copy, the board's tiles
// keeping their places and their numbers, its size still the table's.
export function withFridge(L, k) {
  const n = L.count;
  const extend = (a, v) => Int16Array.from({ length: n + k }, (_, i) => (i < n ? a[i] : v));
  const none = () => Array.from({ length: k }, () => []);
  return {
    ...L,
    count: n + k,
    tableCount: n,
    x: extend(L.x, -1),
    y: extend(L.y, -1),
    z: extend(L.z, 0),
    above: [...L.above, ...none()],
    below: [...L.below, ...none()],
    left: [...L.left, ...none()],
    right: [...L.right, ...none()],
    weight: extend(L.weight, 0),
  };
}
