import { over } from './roses.js';

// Savour each one, on Valentine's sixth board, the box of chocolates: nine
// chocolates in three rows inside the box's walls, each its top, the
// chocolate under it and its paper cup of four tiles under that. Bite into
// a chocolate by taking its top, and eat the rest of it, cup and all,
// before biting into another, and it's savoured, for a bonus; bite into
// another first, and the one left half-eaten is just eaten. The box's walls
// can be taken at any time, and give the chocolates' tiles partners. The
// chocolates change nothing about when a tile can be taken.
//
// The deal eats them one at a time in its own order (oneAtATime,
// savoursAll), so that the hints savour all nine, and the hints keep to a
// way that savours the chocolates still to eat (savour). Game keeps the
// chocolates, and score.js what they earn.

// The chocolates on a board: each tile of its top layer, with the tiles
// under it and under those, from the top down; in rows from the top of the
// board, left to right. Each is { top, tiles }.
export function chocolatesOf(L) {
  const tops = [...L.x.keys()].filter((i) => L.z[i] === L.depth - 1);
  tops.sort((a, b) => L.y[a] - L.y[b] || L.x[a] - L.x[b]);
  return tops.map((top) => {
    const tiles = [top];
    for (let k = 0; k < tiles.length; k++) for (const j of L.below[tiles[k]]) if (!tiles.includes(j)) tiles.push(j);
    tiles.sort((p, q) => L.z[q] - L.z[p] || L.y[p] - L.y[q] || L.x[p] - L.x[q]);
    return { top, tiles };
  });
}

// What a match taking tiles a and b does to the chocolates, from their
// states before it, each 'whole', 'bitten', 'savoured' or 'eaten'; `gone`
// says whether a tile is gone once the match is made. The chocolate bitten
// into, its last tiles taken, is savoured; then a top taken bites into its
// chocolate, and a chocolate still bitten into is left half-eaten, just
// eaten, as are two bitten into at once. Returns { states, bitten,
// savoured, eaten }: the states after it, the chocolates it bit into, the
// one it savoured or -1, and those it left just eaten.
export function eat(chocolates, states, [a, b], gone) {
  const out = states.slice();
  let savoured = -1;
  const open = out.indexOf('bitten');
  if (open >= 0 && chocolates[open].tiles.every(gone)) {
    out[open] = 'savoured';
    savoured = open;
  }
  const bitten = chocolates.map((_, k) => k).filter((k) => out[k] === 'whole' && (chocolates[k].top === a || chocolates[k].top === b));
  const eaten = [];
  if (bitten.length) {
    const still = out.indexOf('bitten');
    if (still >= 0) eaten.push(still);
    if (bitten.length > 1) eaten.push(...bitten);
    for (const k of bitten) out[k] = 'bitten';
    for (const k of eaten) out[k] = 'eaten';
  }
  return { states: out, bitten, savoured, eaten };
}

// A deal that eats the chocolates one at a time: as it plays the board
// through (deal.js), it tries the tiles of the chocolate bitten into first,
// then the walls and any other tiles, and the tops of chocolates still
// whole last; with none bitten into, one top first, to bite into it. `skip`
// holds the chocolates left just eaten, for a shuffle: their tiles are as
// the walls'.
export const oneAtATime = (chocolates, skip = []) => (free, present) => {
  const open = chocolates.findIndex((c, k) => !skip.includes(k) && !present[c.top] && c.tiles.some((t) => present[t]));
  const tops = free.filter((t) => chocolates.some((c) => c.top === t));
  const rest = free.filter((t) => !tops.includes(t));
  if (open < 0) return [...tops.slice(0, 1), ...rest, ...tops.slice(1)];
  const mine = rest.filter((t) => chocolates[open].tiles.includes(t));
  return [...mine, ...rest.filter((t) => !mine.includes(t)), ...tops];
};

// Whether an order of pairs savours every chocolate not yet savoured or
// eaten: from their states before it, and the tiles present before it.
export function savoursAll(order, chocolates, states = chocolates.map(() => 'whole'), present = null) {
  const taken = new Set();
  let now = states;
  for (const pair of order) {
    for (const t of pair) taken.add(t);
    now = eat(chocolates, now, pair, (t) => taken.has(t) || (present !== null && !present[t])).states;
  }
  return chocolates.every((_, k) => states[k] === 'savoured' || states[k] === 'eaten' || now[k] === 'savoured');
}

// A way to win that savours the chocolates still to eat: the way given,
// played as it comes from where the tiles lie. Each time, with a chocolate
// bitten into, a tile of it that can be taken goes, the top one first, with
// the tile the way pairs it with or, if that can't go, any other tile of
// its kind that can, the two tiles left by the swap taking each other where
// the later of their two pairs was, unless one lies over the other; or else
// the first pair of the way that can be taken without biting into another,
// or with none bitten into, into two at once; or, failing those, the first
// that can be taken. Should that come to a stop, it is played again without
// the swaps. The board is given as { L, present, free, kindOf, holds,
// chocolates, states }: the layout, the tiles still on it, whether a tile
// can be taken with those present, a tile's kind, whether a way wins from
// where the tiles lie, and the chocolates and their states. Returns the way
// as played, if it wins, or else null.
export function savour(way, board) {
  if (!board.states.some((s) => s === 'whole' || s === 'bitten')) return way;
  return played(way, board, true) || played(way, board, false);
}

function played(way, { L, present, free, kindOf, holds, chocolates, states }, swap) {
  const p = Uint8Array.from(present);
  let now = states.slice();
  const todo = way.map((pair) => pair.slice());
  const out = [];
  const tops = new Map(chocolates.map((c, k) => [c.top, k]));
  const whole = (t) => tops.has(t) && now[tops.get(t)] === 'whole';
  const mateOf = (pair, t) => (pair[0] === t ? pair[1] : pair[0]);
  const can = (pair) => free(p, pair[0]) && free(p, pair[1]);
  const take = (j) => {
    const [pair] = todo.splice(j, 1);
    now = eat(chocolates, now, pair, (t) => !p[t] || pair.includes(t)).states;
    p[pair[0]] = p[pair[1]] = 0;
    out.push(pair);
  };
  while (todo.length) {
    const open = now.indexOf('bitten');
    let taken = false;
    for (const t of open >= 0 ? chocolates[open].tiles : []) {
      if (!p[t] || !free(p, t)) continue;
      const j = todo.findIndex((pair) => pair.includes(t));
      const mate = mateOf(todo[j], t);
      if (free(p, mate) && !whole(mate)) {
        take(j);
        taken = true;
        break;
      }
      if (!swap) continue;
      const u = todo.flat().find((v) => {
        if (v === t || v === mate || !free(p, v) || whole(v) || kindOf(v) !== kindOf(t)) return false;
        const other = mateOf(todo.find((pair) => pair.includes(v)), v);
        return !over(L, mate, other) && !over(L, other, mate);
      });
      if (u === undefined) continue;
      const i = todo.findIndex((pair) => pair.includes(u));
      todo[Math.max(i, j)] = [mate, mateOf(todo[i], u)];
      todo[Math.min(i, j)] = [t, u];
      take(Math.min(i, j));
      taken = true;
      break;
    }
    if (taken) continue;
    let j = todo.findIndex((pair) => can(pair) && (open >= 0 ? !pair.some(whole) : pair.filter(whole).length < 2));
    if (j < 0) j = todo.findIndex(can);
    if (j < 0) return null;
    take(j);
  }
  return holds(out) ? out : null;
}
