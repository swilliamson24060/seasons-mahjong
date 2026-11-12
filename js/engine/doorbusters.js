// Doorbusters, Black Friday's twist: a few pairs on the board wear a sale
// tag. A pair the player takes with a tagged tile in it buys that
// doorbuster; but after every so many of the player's matches, another
// shopper grabs the first doorbuster still free, both its tiles at once.
// Game keeps the doorbusters, and score.js what they earn.

// The doorbusters for a board: so many pairs of the deal's own order, as it
// takes them together. Whoever takes one and whenever, the rest of the
// order still wins, as taking a pair of it early only frees other tiles.
// Rather pairs from between an eighth and two thirds of the way through,
// and none free from the start, so that there is a race for each.
export function chooseBusters(plan, n, r, freeNow = new Set()) {
  const from = Math.floor(plan.length / 8);
  const to = Math.floor((plan.length * 2) / 3);
  const better = plan.slice(from, to).filter(([a, b]) => !(freeNow.has(a) && freeNow.has(b)));
  const rest = plan.filter((p) => !better.includes(p));
  return [...r.shuffle(better.slice()), ...r.shuffle(rest.slice())].slice(0, n).map((p) => p.slice());
}
