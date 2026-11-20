// In bloom, on Valentine's fourth board, the vase of roses: its roses, the
// tiles on top over the bouquet, start in bud. From the third match one
// opens every three matches, from the top down, and stays in bloom for six,
// then wilts. A rose taken in bloom, with any tile of its kind, joins the
// bouquet, for a bonus; a bud taken before it opens is wasted; and a wilted
// rose is just a tile.
//
// The roses are free from the start, so the twist is the timing: a tile of
// a rose's kind ready to go with it while it's in bloom. The deal takes
// each rose in its own order while it's in bloom (inBloom, gathers), so
// that the hints gather them all, and the hints keep to a way that gathers
// the roses still to gather (gather). Roses change nothing about when a tile
// can be taken. Game keeps the roses, and score.js what they earn.

// The roses on a board: the top layer's tiles from the top down, and left
// to right along a row, the first `count` of them, in the order they open.
export function rosesOf(L, count) {
  const top = [...L.x.keys()].filter((i) => L.z[i] === L.depth - 1);
  top.sort((a, b) => L.y[a] - L.y[b] || L.x[a] - L.x[b]);
  return top.slice(0, count);
}

// When rose k opens, counted from 0 for the first: after so many matches.
export const opensAt = (k, every) => every * (k + 1);

// The state of rose k: 'bud', 'bloom' or 'wilted' while still on the board,
// with so many matches made; and once taken, as the match given, counted
// from 1, 'gathered' into the bouquet, 'wasted' in bud, or 'wilted'.
export function roseState(k, taken, matches, every, lasts) {
  const open = opensAt(k, every);
  if (taken) return taken <= open ? 'wasted' : taken <= open + lasts ? 'gathered' : 'wilted';
  return matches < open ? 'bud' : matches < open + lasts ? 'bloom' : 'wilted';
}

// A deal that takes each rose while it's in bloom: as it plays the board
// through (deal.js), it tries the roses in bloom first, the soonest to wilt
// first, then the other tiles, and the buds last, `done` being the matches
// made before the deal, for a shuffle.
export const inBloom = (roses, every, lasts, done = 0) => (free, present, order) => {
  const at = done + order.length; // the matches made before this pair
  const k = (t) => roses.indexOf(t);
  const bud = (t) => k(t) >= 0 && at < opensAt(k(t), every);
  const blooming = free.filter((t) => k(t) >= 0 && !bud(t) && at < opensAt(k(t), every) + lasts).sort((a, b) => k(a) - k(b));
  return [...blooming, ...free.filter((t) => !blooming.includes(t) && !bud(t)), ...free.filter(bud)];
};

// Whether an order of pairs takes every rose not yet wilted while it's in
// bloom, `done` matches having been made before it.
export const gathers = (order, roses, every, lasts, done = 0) =>
  order.every((pair, s) =>
    pair.every((t) => {
      const k = roses.indexOf(t);
      if (k < 0) return true;
      const open = opensAt(k, every);
      const m = done + s + 1; // the match that takes it
      return done >= open + lasts || (open < m && m <= open + lasts);
    }),
  );

// Whether tile b lies somewhere over tile a, on it or on a tile on it, so
// that the two can never be taken together.
function over(L, a, b) {
  const seen = new Set();
  const look = [a];
  while (look.length) {
    for (const t of L.above[look.pop()]) {
      if (t === b) return true;
      if (!seen.has(t)) {
        seen.add(t);
        look.push(t);
      }
    }
  }
  return false;
}

// A way to win that gathers the roses still to gather: the way given,
// played as it comes from where the tiles lie. Each time, a rose in bloom
// that can be taken goes, the soonest to wilt first, with the tile the way
// pairs it with or, if that can't go, any other tile of its kind that can,
// the two tiles left by the swap taking each other where the later of
// their two pairs was, as Game's follow() pairs them, unless one lies over
// the other; or else the first pair of the way that can be taken with no
// bud in it; or, failing those, the first that can be taken. Should that
// come to a stop, it is played again without the swaps. The board is given
// as { L, present, free, kindOf, holds, matches, roses, every, lasts }: the
// layout, the tiles still on it, whether a tile can be taken with those
// present, a tile's kind, whether a way wins from where the tiles lie, the
// matches made, the roses, and how they open and how long they last.
// Returns the way as played, if it wins, or else null.
export function gather(way, board) {
  const { present, matches, roses, every, lasts } = board;
  if (!roses.some((t, k) => present[t] === 1 && matches < opensAt(k, every) + lasts)) return way;
  return played(way, board, true) || played(way, board, false);
}

function played(way, { L, present, free, kindOf, holds, matches, roses, every, lasts }, swap) {
  const p = Uint8Array.from(present);
  const todo = way.map((pair) => pair.slice());
  const played = [];
  const mateOf = (pair, t) => (pair[0] === t ? pair[1] : pair[0]);
  const take = (j) => {
    const [pair] = todo.splice(j, 1);
    p[pair[0]] = p[pair[1]] = 0;
    played.push(pair);
  };
  while (todo.length) {
    const at = matches + played.length;
    const bud = (t) => {
      const k = roses.indexOf(t);
      return k >= 0 && at < opensAt(k, every);
    };
    const can = (pair) => free(p, pair[0]) && free(p, pair[1]);
    let taken = false;
    for (const [k, t] of roses.entries()) {
      if (!p[t] || at < opensAt(k, every) || at >= opensAt(k, every) + lasts || !free(p, t)) continue;
      const j = todo.findIndex((pair) => pair.includes(t));
      const mate = mateOf(todo[j], t);
      if (free(p, mate) && !bud(mate)) {
        take(j);
        taken = true;
        break;
      }
      if (!swap) continue;
      const u = todo.flat().find((v) => {
        if (v === t || v === mate || !free(p, v) || bud(v) || kindOf(v) !== kindOf(t)) return false;
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
    let j = todo.findIndex((pair) => can(pair) && !bud(pair[0]) && !bud(pair[1]));
    if (j < 0) j = todo.findIndex(can);
    if (j < 0) return null;
    take(j);
  }
  return holds(played) ? played : null;
}
