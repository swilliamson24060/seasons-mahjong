// The cherry on top, on the beach season's ice cream: a cherry sits on the
// top scoop, a tile on its own at the very top of the board, free from the
// start and holding nothing down. Saved for last, taken in the board's last
// pair, after every other tile of the ice cream, it's the cherry on top,
// for points; taken any sooner, it's just a tile. The deal saves it for
// last in its own order (savingCherry, below), and the hints keep to a way
// that does, where they can.

// The cherry's tile: the board's top tile, the highest of them if more
// than one lies on the top row.
export function cherryOf(L) {
  let top = 0;
  for (let t = 1; t < L.count; t++) if (L.y[t] < L.y[top] || (L.y[t] === L.y[top] && L.z[t] > L.z[top])) top = t;
  return top;
}

// A deal that saves the cherry for last (deal.js's prefer): its tile left
// out of the free tiles to take until only it and one other are left.
// Holding nothing down, it keeps no other tile from coming free.
export const savingCherry = (cherry) => (free, present) => {
  let left = 0;
  for (const p of present) left += p;
  return left > 2 ? free.filter((t) => t !== cherry) : free;
};
