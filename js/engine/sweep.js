// A clean sweep, on the Start of Spring's sixth board, spring cleaning: the
// house is cleaned from the top down. A row of the board, every tile of it
// taken, on every layer, is swept clean, for points, the more the longer
// the row, but only once every row above it has been swept: a row cleared
// before a row above it scores nothing. The row to sweep next, the highest
// with tiles still in it, is marked.
//
// A row is the tiles across the board at one height, on any layer; the
// spring cleaning's board keeps every tile on a whole row, so that its rows
// are plain to see. The deal is made so that its own order sweeps every
// row from the top down (cleaning), and the hints sweep the row marked when
// they can. Game keeps which rows were swept, and score.js what they earn.

// The board's rows, from the top down, each its tiles; and each tile's row.
export function rowsOf(L) {
  const ys = [...new Set(L.y)].sort((a, b) => a - b);
  const rows = ys.map((y) => [...L.x.keys()].filter((i) => L.y[i] === y));
  const rowOf = new Int16Array(L.count);
  rows.forEach((tiles, r) => tiles.forEach((t) => (rowOf[t] = r)));
  return { rows, rowOf };
}

// The row to sweep next: the highest with a tile still on the board, or -1.
export const nextRow = (rows, present) => rows.findIndex((tiles) => tiles.some((t) => present[t]));

// The rows a pair just taken empties, present the board after it: { swept,
// out }, those swept in turn, every row above them empty, and those cleared
// out of turn.
export function emptied(rows, rowOf, present, a, b) {
  const swept = [];
  const out = [];
  for (const r of [...new Set([rowOf[a], rowOf[b]])].sort((x, y) => x - y)) {
    if (rows[r].some((t) => present[t])) continue;
    (rows.slice(0, r).every((tiles) => tiles.every((t) => !present[t])) ? swept : out).push(r);
  }
  return { swept, out };
}

// The rows an order of pairs sweeps in turn, taken from the board given.
export function sweptIn(rows, rowOf, order, present) {
  const p = Uint8Array.from(present);
  let n = 0;
  for (const [a, b] of order) {
    p[a] = p[b] = 0;
    n += emptied(rows, rowOf, p, a, b).swept.length;
  }
  return n;
}

// A deal that sweeps from the top down: as it plays the board through
// (deal.js), it tries first a free tile of the row to sweep, paired with
// any other free tile, of that row or another, in the deal's own shuffle,
// so that a row's tiles aren't all paired with each other, its ends
// matching; and last the free tiles of rows below with two tiles or fewer
// left, which taking might clear before the rows above them.
export const cleaning = ({ rows, rowOf }) => (free, present) => {
  const next = nextRow(rows, present);
  const left = rows.map((tiles) => tiles.reduce((n, t) => n + present[t], 0));
  const lead = free.find((t) => rowOf[t] === next);
  const rank = (t) => (t === lead ? 0 : rowOf[t] !== next && left[rowOf[t]] <= 2 ? 2 : 1);
  return free.slice().sort((s, t) => rank(s) - rank(t));
};
