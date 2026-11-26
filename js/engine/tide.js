// The tide, on the beach season's sandcastle: every few matches it comes in
// a row up the board from the bottom, until it's in as far as it comes, and
// then goes back out a row at a time, and comes in again; while a row is
// under the water, its tiles, on every layer, can't be taken. With nothing
// left to take but what the water covers, the tide goes out at once, and
// comes in again from there. Every tile on the sandcastle lies on a whole
// row, so that which rows are under the water is plain to see.
//
// Where the tide is is a matter of the matches made, and of when it last
// went out at once, so a board played the same way meets the same tide.
// The game's rules, the solver, the hints and the deal all know it: the
// deal is played through with the tide coming in and going out as its own
// order goes (ebbing, below), so that its order wins through it. Going out
// at once, the deal counts on fewer than two free tiles being out of the
// water, and the game on no pair being out of it to take; along the deal's
// own order the two come to the same, as its next pair is always one to
// take.

// The rows the tide covers `at` matches into its coming and going: none to
// begin with, a row more every `every` matches up to `high`, then a row
// fewer every `every` matches back to none, and again.
export function tideAt(at, every, high) {
  const step = Math.floor(at / every) % (2 * high);
  return step <= high ? step : 2 * high - step;
}

// Whether the tide is coming in `at` matches into its coming and going, as
// it is from low tide until it's in as far as it comes.
export const comingIn = (at, every, high) => Math.floor(at / every) % (2 * high) < high;

// Each tile's row counted up from the board's foot, 0 for the bottom row.
export const rowsUp = (L) => Int16Array.from(L.y, (y) => (L.height - 2 - y) / 2);

// Whether a tile is under the water, the tide covering `level` rows.
export const covered = (rows, level, i) => rows[i] < level;

// A deal played through with the tide (deal.js's prefer): at each match of
// the order being made, it leaves out the free tiles under the water, but
// when fewer than two free tiles are out of it, the tide goes out at once
// and all of them are there to take. `phase` is the matches the tide is
// into its coming and going as the dealing starts, for a shuffle.
export function ebbing(L, every, high, phase = 0) {
  const rows = rowsUp(L);
  const outAt = []; // the match the tide last went out at, as of each match of the order made so far
  return (free, present, order) => {
    const m = order.length;
    let out = m === 0 ? -phase : outAt[m - 1];
    const level = tideAt(m - out, every, high);
    let dry = free.filter((t) => !covered(rows, level, t));
    if (level > 0 && dry.length < 2) {
      out = m;
      dry = free;
    }
    outAt[m] = out;
    return dry;
  };
}
