// The disco ball, on New Year's 8: its light sweeps down the board, a band
// of rows, starting at the top and moving a row further down with every
// match, and once it has reached the bottom, starting again at the top. A
// pair taken with both its tiles in the light dances in the spotlight, for
// a bonus, so a player sets pairs up for where the light is heading. The
// light changes nothing about when a tile can be taken, so the deal's own
// order still wins. Game keeps the pairs that dance, and score.js what they
// earn.

// The row of tiles at the top of the band of light after so many matches,
// for a band `deep` rows deep: it stops at every row from the top until its
// bottom row is the board's last, and then goes back to the top. Rows are
// whole tiles; positions are in half tiles (layout.js).
export function lightAt(L, matches, deep) {
  const stops = Math.max(1, Math.ceil(L.height / 2) - deep + 1);
  return matches % stops;
}

// Whether a tile is in the band of light whose top row is `top`: whether
// its middle is, so that a tile half a row out of line is in the light when
// half of it is.
export function inLight(L, i, top, deep) {
  const middle = L.y[i] + 1;
  return middle >= top * 2 && middle <= (top + deep) * 2;
}

// How many pairs taking the pairs in `order`, from the start, would dance
// in the spotlight: for making a deal whose own order dances.
export function dancesIn(L, order, deep) {
  return order.filter(([a, b], k) => {
    const top = lightAt(L, k, deep);
    return inLight(L, a, top, deep) && inLight(L, b, top, deep);
  }).length;
}
