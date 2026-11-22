// Fill and pour, on April Showers' sixth board, the watering can: the can
// starts empty. A pair with both its tiles in its body fills it a measure,
// up to so many; a pair with both its tiles in the drops sprinkling from
// its rose pours one out onto the garden, for a bonus, and with the can
// empty it waters nothing. So the can is filled before it's poured, but
// never more than so many measures ahead: a pair from the body taken with
// the can full fills nothing.
//
// The drops hang free from the start, as rain does, so the twist is the
// order: fill, then pour, and fill again. The deal is made so that its own
// order pours every pair of drops with water in the can (pouring), and the
// hints keep to a way that does. The can changes nothing about when a tile
// can be taken. Game keeps the can, and score.js what its pours earn.

// The can's parts, given by its rules: { body, drops }, the body a box,
// [x0, y0, x1, y1], and the drops their places, [x, y], all in half tiles,
// as positions are (layout.js). Which part a tile is in: 'body', 'drops',
// or null.
export function partOf(L, i, { body, drops }) {
  const [x0, y0, x1, y1] = body;
  if (L.x[i] >= x0 && L.x[i] <= x1 && L.y[i] >= y0 && L.y[i] <= y1) return 'body';
  return L.z[i] === 0 && drops.some(([x, y]) => L.x[i] === x && L.y[i] === y) ? 'drops' : null;
}

// What a pair does to the can, as full as `level` and no fuller than
// `most`: 'fill', a pair from its body with room in it; 'full', a pair from
// its body with none; 'pour', a pair from its drops with water in it;
// 'dry', a pair from its drops with none; or null.
export function pairDoes(L, a, b, can, level, most) {
  const [p, q] = [partOf(L, a, can), partOf(L, b, can)];
  if (p !== q || !p) return null;
  if (p === 'body') return level < most ? 'fill' : 'full';
  return level > 0 ? 'pour' : 'dry';
}

// The can after an order of pairs, from `level`: how full it is and how
// many pours it made, and how many dry.
export function pourIn(L, order, can, most, level = 0) {
  let now = level;
  let pours = 0;
  let dry = 0;
  for (const [a, b] of order) {
    const does = pairDoes(L, a, b, can, now, most);
    if (does === 'fill') now++;
    if (does === 'pour') {
      now--;
      pours++;
    }
    if (does === 'dry') dry++;
  }
  return { level: now, pours, dry };
}

// A deal that pours every pair of drops with water in the can: as it plays
// the board through (deal.js), the can filled and poured as it would be on
// the order so far, it tries first two drops, with water in the can; or
// else two tiles of its body, with room in it; then the rest, and the drops
// last. `level` is the can before the deal, for a shuffle.
export const pouring = (L, can, most, level = 0) => (free, present, order) => {
  const now = pourIn(L, order, can, most, level).level;
  const drops = free.filter((t) => partOf(L, t, can) === 'drops');
  const body = free.filter((t) => partOf(L, t, can) === 'body');
  const rest = free.filter((t) => !partOf(L, t, can));
  if (now > 0 && drops.length >= 2) return [...drops, ...rest, ...body];
  if (now < most && body.length >= 2) return [...body, ...rest, ...drops];
  return [...rest, ...body, ...drops];
};
