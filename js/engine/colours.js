// Chasing colours, on April Showers' fourth board, the rainbow: one band of
// the rainbow is lit at a time, red as the board starts, then orange,
// yellow, green, blue and violet, and round again, moving on a band with
// every match. A pair with both its tiles in the band that's lit catches
// its colour, for a bonus; and as the band lit next can be seen, a pair can
// be got ready for it.
//
// Each band is a layer of the arch: red on top, on the outside, and each
// band inside it a layer lower, down to violet on the table, so the
// rainbow comes apart from the outside in. The clouds at its feet are no
// band. The deal is made so that its own order catches the colours it can
// (chasing), and the hints catch one whenever they can. The colours change
// nothing about when a tile can be taken. Game keeps the colours caught,
// and score.js what they earn.

// The rainbow's bands, from the outside in.
export const BANDS = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];

// The band a tile is in, 0 for red to 5 for violet, by its layer, red on
// top; or -1 for a cloud's tile, below `clouds` half tiles down.
export const bandOf = (L, i, clouds) => (L.y[i] >= clouds ? -1 : L.depth - 1 - L.z[i]);

// The band lit with so many matches made: red as the board starts, and on
// a band with every match.
export const litBand = (matches) => matches % BANDS.length;

// Whether a pair catches the colour of the band given: both its tiles in
// that band.
export const inColour = (L, a, b, clouds, band) => bandOf(L, a, clouds) === band && bandOf(L, b, clouds) === band;

// A deal that catches the colours it can: as it plays the board through
// (deal.js), it tries first two free tiles of the band lit then, if two are
// free, `done` being the matches made before the deal, for a shuffle.
export const chasing = (L, clouds, done = 0) => (free, present, order) => {
  const band = litBand(done + order.length);
  const lit = free.filter((t) => bandOf(L, t, clouds) === band);
  return lit.length >= 2 ? [...lit, ...free.filter((t) => bandOf(L, t, clouds) !== band)] : free;
};

// How many pairs of an order catch their colours, taken from the start,
// `done` matches having been made before it.
export const coloursIn = (L, order, clouds, done = 0) => order.filter(([a, b], k) => inColour(L, a, b, clouds, litBand(done + k))).length;
