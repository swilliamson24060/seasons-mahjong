// March winds, on the Start of Spring's fourth board, kites in the March
// wind: the wind blows from the east, then the south, the west and the
// north, turning every few matches, and the tiles on the edge of the board
// it blows on are loose, free to take as a floating ghost is, whatever lies
// on them; a pair with one of them catches the wind, for points. As tiles
// go, the board's edge moves in, and the wind finds new tiles on it.
//
// A tile is on the edge the wind blows on when no tile still on the board,
// on any layer, lies further upwind across its row, for an east or west
// wind, or its column, for a north or south one: within a tile of it across
// the wind. Which way the wind blows is a matter of the matches made, so a
// board played the same way feels the same wind. The game's rules, the
// solver and the hints all count the wind's loose tiles (solver.js takes
// the wind in its position). Game keeps the pairs that caught the wind, and
// score.js what they earn.

export const WINDS = ['east', 'south', 'west', 'north'];

// The wind after so many matches, by its place in WINDS: from the east to
// begin with, turning every `every` matches.
export const windAt = (matches, every) => Math.floor(matches / every) % WINDS.length;

// The tiles upwind of each tile, in each wind: upwind[w][i], the tiles
// further upwind than tile i across its row, for an east or west wind, or
// its column, for a north or south one, on any layer. Made once a layout.
const made = new WeakMap();

export function upwindOf(L) {
  if (made.has(L)) return made.get(L);
  const n = L.count;
  const upwind = WINDS.map((w) =>
    Array.from({ length: n }, (_, i) => {
      const out = [];
      for (let j = 0; j < n; j++) {
        if (j === i) continue;
        const across = w === 'east' || w === 'west' ? Math.abs(L.y[j] - L.y[i]) < 2 : Math.abs(L.x[j] - L.x[i]) < 2;
        const ahead = w === 'east' ? L.x[j] > L.x[i] : w === 'west' ? L.x[j] < L.x[i] : w === 'north' ? L.y[j] < L.y[i] : L.y[j] > L.y[i];
        if (across && ahead) out.push(j);
      }
      return Int16Array.from(out);
    }),
  );
  made.set(L, upwind);
  return upwind;
}

// The tiles across each tile's row or column, any layer: those whose way to
// the wind it can stand in, for some wind or other, so that its going may
// put them on the edge. Made once a layout.
const crossed = new WeakMap();

export function acrossOf(L) {
  if (crossed.has(L)) return crossed.get(L);
  const n = L.count;
  const across = Array.from({ length: n }, (_, t) => {
    const out = [];
    for (let i = 0; i < n; i++) if (i !== t && (Math.abs(L.y[i] - L.y[t]) < 2 || Math.abs(L.x[i] - L.x[t]) < 2)) out.push(i);
    return Int16Array.from(out);
  });
  crossed.set(L, across);
  return across;
}

// Whether tile i, still on the board, is in wind w: on the edge it blows
// on, nothing still on the board upwind of it.
export function inWind(upwind, w, present, i) {
  if (!present[i]) return false;
  for (const j of upwind[w][i]) if (present[j]) return false;
  return true;
}

// The tiles in wind w, the board as it is.
export function windswept(upwind, w, present) {
  const out = [];
  for (let i = 0; i < present.length; i++) if (inWind(upwind, w, present, i)) out.push(i);
  return out;
}

// Whether a pair catches the wind: a tile of it in wind w as it's taken.
export const catches = (upwind, w, present, a, b) => inWind(upwind, w, present, a) || inWind(upwind, w, present, b);
