// The Frozen twist: tiles under ice, which cannot be taken until enough
// matches have been made to thaw them, though their faces show through. A
// board's ice gives each tile the number of matches it takes to thaw, 0 for
// a tile never frozen. Game keeps the count, and a deal, the solver and the
// safe shuffle only ever take a frozen tile once it has thawed.

// Ice that thaws from the outside in, as a frozen turkey does. Seen from
// above, a tile's ring is how many tiles in from the board's outline it
// lies: the outermost ring is thawed from the start, and each ring further
// in thaws `step` matches after the one outside it, through every layer.
export function outsideIn(L, step) {
  // The places the tiles cover, in half tiles, with an empty border round them.
  const W = L.width + 2;
  const H = L.height + 2;
  const covered = new Uint8Array(W * H);
  const cells = (i) => [0, 1].flatMap((dy) => [0, 1].map((dx) => (L.y[i] + 1 + dy) * W + L.x[i] + 1 + dx));
  for (let i = 0; i < L.count; i++) for (const c of cells(i)) covered[c] = 1;
  // How far each place is from the nearest one no tile covers, a step being
  // to any of the eight places round it.
  const far = new Int16Array(W * H).fill(-1);
  const queue = [];
  for (let c = 0; c < W * H; c++) {
    if (covered[c]) continue;
    far[c] = 0;
    queue.push(c);
  }
  for (let q = 0; q < queue.length; q++) {
    const c = queue[q];
    const cx = c % W;
    const cy = (c - cx) / W;
    for (let y = Math.max(0, cy - 1); y <= Math.min(H - 1, cy + 1); y++) {
      for (let x = Math.max(0, cx - 1); x <= Math.min(W - 1, cx + 1); x++) {
        const n = y * W + x;
        if (far[n] >= 0) continue;
        far[n] = far[c] + 1;
        queue.push(n);
      }
    }
  }
  // A tile on the outline is a half tile from the outside, the next one in
  // a tile and a half, and so on.
  return Int16Array.from({ length: L.count }, (_, i) => Math.floor((Math.min(...cells(i).map((c) => far[c])) - 1) / 2) * step);
}
