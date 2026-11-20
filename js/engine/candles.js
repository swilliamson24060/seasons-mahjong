// Candlelight, on Valentine's fifth board, the first date: dinner by
// candlelight. Each candle's glow tinges the tiles round its flame gold,
// his candle's on the board's left and hers on its right, and a pair with
// one tile in each candle's glow, a table for two, is a candlelit pair, for
// a bonus. Where the disco ball's beam wants both tiles in one band of
// light (disco.js), candlelight wants one by his candle and one by hers.
// The candles burn down as the matches go by: every so many matches their
// glow sinks a row toward the table, until they gutter out near the end.
// The glow changes nothing about when a tile can be taken. The deal is made
// so that its own order takes several candlelit pairs. Game keeps the
// pairs taken by candlelight, and score.js what they earn.

// The top row of the candles' glow after so many matches, or -1 once
// they've guttered out: from the top of the board, it sinks a row every
// `every` matches, for as long as a glow `deep` rows deep still fits on
// the board. Rows are whole tiles; positions are in half tiles (layout.js).
export function glowTop(L, matches, { every, deep }) {
  const top = Math.floor(matches / every);
  return top + deep <= L.height / 2 ? top : -1;
}

// Which candle's glow a tile is in, the glow's top row given: 'his', on the
// left of the board, 'hers', on the right, or null. A tile is in it when
// its middle is, as in the disco ball's light, so that a tile half a row
// out of line is in the glow when half of it is.
export function glowOf(L, i, top, deep) {
  if (top < 0) return null;
  const middle = L.y[i] + 1;
  if (middle < top * 2 || middle > (top + deep) * 2) return null;
  const across = L.x[i] + 1;
  return across < L.width / 2 ? 'his' : across > L.width / 2 ? 'hers' : null;
}

// Whether two tiles make a candlelit pair, the glow's top row given: one
// in each candle's glow.
export function candlelit(L, a, b, top, deep) {
  const x = glowOf(L, a, top, deep);
  const y = glowOf(L, b, top, deep);
  return x !== null && y !== null && x !== y;
}

// How many pairs of an order, taken from the start, `done` matches having
// been made before it, are candlelit: for making a deal whose own order
// takes several.
export function candlelitIn(L, order, rules, done = 0) {
  return order.filter(([a, b], k) => candlelit(L, a, b, glowTop(L, done + k, rules), rules.deep)).length;
}
