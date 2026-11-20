import { seeded } from './rng.js';

// Cupid's arrows, on Valentine's second board, the pierced heart: as the
// board starts, and again every so many matches, Cupid lets fly an arrow
// that strikes two tiles of a kind, and they're smitten. Taken together
// before his next arrow flies, they're love at first sight, for a bonus;
// either taken with another tile, a heart is broken; and left, they get
// over it when the next arrow flies.
//
// An arrow strikes two tiles with nothing on them, so that the hearts on
// them show, and not both free, so that the couple has to be dug for; and a
// way to win from where the tiles lie takes the two together within the
// matches before the next arrow, so that the couple can always be had: the
// hints' way, or one made from it by taking the couple sooner, which the
// hints then follow. Which couple is shuffled for that arrow from the
// board's seed, so that a board reached the same way sees the same arrows.
// Arrows change nothing about when a tile can be taken. Game keeps the
// couples, and score.js what they earn.

// Whether a tile still on the board has nothing on it.
export const bare = (L, present, i) => present[i] === 1 && L.above[i].every((j) => !present[j]);

// The couples an arrow can strike, as the tiles lie: pairs of tiles of a
// kind, both with nothing on them, and not both free.
export function couplesFor(L, present, faces, kindOf, free) {
  const tiles = [];
  for (let i = 0; i < L.count; i++) if (bare(L, present, i)) tiles.push(i);
  const out = [];
  for (let p = 0; p < tiles.length; p++) {
    for (let q = p + 1; q < tiles.length; q++) {
      const [a, b] = [tiles[p], tiles[q]];
      if (kindOf(faces[a]) === kindOf(faces[b]) && !(free(a) && free(b))) out.push([a, b]);
    }
  }
  return out;
}

// A way to win that takes a couple, [x, y], together within its first
// `within` pairs: the way given, if it does already; or else the way with
// x and y taken together as soon as that still wins, and the two tiles it
// had paired them with taken together where the later or the earlier of
// their pairs was, as Game's follow() pairs them; or null. `holds` says
// whether a way wins from where the tiles lie.
export function wayWith(way, [x, y], within, holds) {
  const i = way.findIndex((p) => p.includes(x));
  const j = way.findIndex((p) => p.includes(y));
  if (i < 0 || j < 0) return null;
  if (i === j) {
    if (i < within) return way;
    const rest = way.filter((_, k) => k !== i);
    for (let at = 0; at < within; at++) {
      const tried = [...rest.slice(0, at), [x, y], ...rest.slice(at)];
      if (holds(tried)) return tried;
    }
    return null;
  }
  const c = way[i][0] === x ? way[i][1] : way[i][0];
  const d = way[j][0] === y ? way[j][1] : way[j][0];
  const rest = way.filter((_, k) => k !== i && k !== j);
  for (let at = 0; at < within; at++) {
    for (const there of [Math.max(i, j) - 1, Math.min(i, j)]) {
      const tried = rest.slice();
      tried.splice(there, 0, [c, d]);
      tried.splice(at, 0, [x, y]);
      if (holds(tried)) return tried;
    }
  }
  return null;
}

// The couple a board's arrow strikes, counted from 0 for the one as it
// starts, and the way to win that takes it in time: the first of the
// couples, in a shuffle of their own for that arrow, that a way made from
// the hints' way takes within `within` matches; failing those, a pair the
// hints' way itself takes in time, both its tiles with nothing on them,
// free already; and with no way to win, the first of the couples. Returns
// { tiles, way }, with way null where no way to win was found, or null with
// no couple to strike.
export function aim(couples, way, within, holds, isBare, seed, k) {
  const r = seeded((seed ^ 0x2c1b3c6d) + k * 0x9e3779b1);
  const order = r.shuffle(couples.slice());
  if (way) {
    for (const tiles of order) {
      const tried = wayWith(way, tiles, within, holds);
      if (tried) return { tiles, way: tried };
    }
    const soon = way.slice(0, within).filter(([a, b]) => isBare(a) && isBare(b));
    if (soon.length) return { tiles: r.pick(soon).slice(), way };
  }
  return order.length ? { tiles: order[0], way: null } : null;
}
