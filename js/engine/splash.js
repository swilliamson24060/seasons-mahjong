// The splash zone, on April Showers' third board: a pair of rain boots
// standing in a puddle. The puddle's tiles, on the table below its edge,
// are the splash zone: a pair with both its tiles in the puddle is a
// splash, and splashes taken one straight after another splash higher and
// higher, each worth more than the one before; a pair with a tile anywhere
// else lets the puddle settle, and the next splash starts again from the
// bottom.
//
// The boots' soles stand in the puddle, so the whole of it opens up only
// once the boots are gone: splashing as soon as a pair can be had breaks
// the puddle into short runs, and keeping out of it until then saves it
// for one long one. The puddle holds nothing else down, so the boots can
// always come off first. The deal is made so that its own order does just
// that, the puddle last, in one run (dryFirst), and the hints keep to such
// a way (Game's savePuddle). Splashes change nothing about when a tile can
// be taken. Game keeps the run and the splashes, and score.js what they
// earn: so much for each splash, times how high it splashed, its place in
// its run.

// Whether a tile is in the puddle: on the table, the bottom layer, its
// middle below the puddle's edge, `edge` half tiles down (layout.js).
export const inPuddle = (L, i, edge) => L.z[i] === 0 && L.y[i] + 1 > edge;

// Whether a pair is a splash: both its tiles in the puddle.
export const isSplash = (L, a, b, edge) => inPuddle(L, a, edge) && inPuddle(L, b, edge);

// The run after a pair, from the run before it: one higher for a splash,
// and back to none for anything else.
export const runAfter = (run, splash) => (splash ? run + 1 : 0);

// A deal that keeps out of the puddle while anything else is left, and
// then takes it in one run of splashes: as it plays the board through
// (deal.js), it takes two tiles out of the puddle together while two of
// them are free, and tries a tile of the puddle only when fewer are, so
// that keeping out of it never brings the deal to a dead end. Game deals
// again while its own order takes the puddle in more than one run.
export const dryFirst = (L, edge) => (free) => {
  const dry = free.filter((t) => !inPuddle(L, t, edge));
  return dry.length >= 2 ? dry : [...dry, ...free.filter((t) => inPuddle(L, t, edge))];
};

// The runs of splashes an order of pairs makes, taken from the start, the
// run before it given: each run's length, as a list.
export function runsIn(L, order, edge, run = 0) {
  const runs = [];
  let now = run;
  for (const [a, b] of order) {
    const next = runAfter(now, isSplash(L, a, b, edge));
    if (!next && now) runs.push(now);
    now = next;
  }
  if (now) runs.push(now);
  return runs;
}
