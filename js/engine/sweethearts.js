import { MATCH, FACE } from './tiles.js';
import { bare } from './cupid.js';

// Sweethearts, on Valentine's third board, the envelope: eight tiles carry
// candy hearts, each with half a sweet nothing from a secret admirer. Take
// the pair with one half and then, as the very next match, the pair with
// the other, either first, and the message is said, for a bonus; anything
// else taken between leaves it unsaid.
//
// The deal puts each message on two pairs its own order takes one straight
// after the other, a message to each stretch of the order, so that the
// hints say every one, from the first matches to the last; each half on a
// tile where its heart shows from the start (shows); and every half on a
// kind of its own, and never the candy hearts' own kind, so that no pair
// takes two halves at once and no candy heart sits on another.
// A shuffle puts the messages still to say on the new deal as the deal did,
// and the half still to take of a message begun on a pair free now, to be
// said next. The hints keep to a way that says the messages still to say,
// where one does (mend). The hearts change nothing about when a tile can be
// taken. Game keeps the messages, and score.js what they earn.

export const MESSAGES = [
  ['BE', 'MINE'],
  ['TRUE', 'LOVE'],
  ['HUG', 'ME'],
  ['SWEET', 'TALK'],
];

// The candy hearts' own kind, the moons', which no half is put on.
export const CANDY = MATCH[FACE['new-moon']];

// Whether the candy heart on a tile still on the board would show: nothing
// on the tile, and nothing raised in the row above over its top left, where
// the heart peeks over the tile's top edge, and a raised tile's edge, lying
// down and to the left of it, would hide it; nor a tile of the board's top
// row lifted to within a layer of its top, where the heart would peek over
// the board's own top edge, and the bar above it would cut it off on a
// board as tall as the screen. In half tiles, as layout.js places tiles.
export function shows(L, present, i) {
  if (!bare(L, present, i) || (L.y[i] === 0 && L.depth - 1 - L.z[i] < 2)) return false;
  for (let u = 0; u < L.count; u++) {
    if (present[u] !== 1 || L.z[u] <= L.z[i]) continue;
    if (L.x[u] < L.x[i] + 1.5 && L.x[u] + 2 > L.x[i] && L.y[u] < L.y[i] + 1 && L.y[u] + 2 > L.y[i] - 1) return false;
  }
  return true;
}

// Where messages go, on an order of pairs: for each, a tile of each of two
// pairs the order takes one straight after the other, [x, y], x on the
// earlier, the two pairs of kinds of their own, not in `used`, which this
// adds them to, nor `taken` already, the indices of pairs in use. The order,
// as far as the last two pairs that could take a message, is cut into as
// many stretches as there are messages, one message to each, or as near it
// as it can go. A tile that `shows` is chosen over one that doesn't, and
// each pair must have one, unless `loose`; loose, a message with no two
// such pairs left goes on any two pairs together, and failing those, on any
// two of kinds of their own, wherever they are. Returns the tiles, a pair
// for each message placed: fewer than `count` only if not loose.
export function placeMessages(order, kindOf, shows, count, r, { used = new Set(), taken = new Set(), loose = false } = {}) {
  const kinds = order.map(([x]) => kindOf(x));
  const open = (k) => k < order.length && !taken.has(k) && !used.has(kinds[k]);
  const seen = (k) => order[k].some(shows);
  const slots = (see) => {
    const out = [];
    for (let k = 0; k < order.length; k++) if (open(k) && open(k + 1) && kinds[k] !== kinds[k + 1] && (!see || (seen(k) && seen(k + 1)))) out.push(k);
    return out;
  };
  // The slots nearest the stretch from lo to hi: those in it, if any are.
  const nearest = (ks, lo, hi) => {
    const far = (k) => (k < lo ? lo - k : k >= hi ? k - hi + 1 : 0);
    const best = Math.min(...ks.map(far));
    return ks.filter((k) => far(k) === best);
  };
  const tileOn = (k) => {
    const showing = order[k].filter(shows);
    return r.pick(showing.length ? showing : order[k]);
  };
  const first = slots(true);
  const span = first.length ? first.at(-1) + 2 : order.length;
  const out = [];
  for (let s = 0; s < count; s++) {
    const lo = Math.floor((s * span) / count);
    const hi = Math.floor(((s + 1) * span) / count);
    let found = nearest(slots(true), lo, hi);
    if (!found.length && loose) found = nearest(slots(false), lo, hi);
    let ks = null;
    if (found.length) {
      const k = r.pick(found);
      ks = [k, k + 1];
    } else if (loose) {
      const k = order.findIndex((_, i) => open(i));
      const j = k < 0 ? -1 : order.findIndex((_, i) => open(i) && kinds[i] !== kinds[k]);
      if (j >= 0) ks = [k, j];
    }
    if (!ks) break;
    for (const k of ks) {
      taken.add(k);
      used.add(kinds[k]);
    }
    out.push(ks.map(tileOn));
  }
  return out;
}

// A way to win that says the messages still to say: the way given, with
// the other half of a message begun taken first, and each waiting message's
// two halves taken one straight after the other, either first, as soon as
// they can be, as long as the way still wins. A half can go with any tile
// of its kind, the way's own partner for it tried first: the two tiles left
// by the swap take each other where the later of their two pairs was, as
// Game's follow() pairs them. The rest of the way is played as it comes,
// each pair as soon as it can be taken, in the way's own order otherwise,
// so that the digging a message needs can be done first; and a message
// already together in it stays together, as does a message begun first.
// The board is given as { present, free, kindOf, holds }: the tiles still
// on it, whether a tile can be taken with those present, a tile's kind, and
// whether a way wins from where the tiles lie.
export function mend(way, messages, { present, free, kindOf, holds }) {
  let out = way;
  const at = (w, t) => w.findIndex((p) => p.includes(t));
  const mateOf = (p, t) => (p[0] === t ? p[1] : p[0]);
  const together = (w, m) => Math.abs(at(w, m.tiles[0]) - at(w, m.tiles[1])) === 1;
  // The tiles t can be paired with in a way: its own partner first, then
  // the other tiles of its kind.
  const partners = (w, t) => {
    const mate = mateOf(w[at(w, t)], t);
    return [mate, ...w.flat().filter((u) => u !== t && u !== mate && kindOf(u) === kindOf(t))];
  };
  // The way without t's pair, and t's pair with the partner given.
  const alone = (w, t, partner) => {
    const i = at(w, t);
    const mate = mateOf(w[i], t);
    if (partner === mate) return [w.filter((_, k) => k !== i), [t, partner]];
    const j = at(w, partner);
    const rest = w.filter((_, k) => k !== i && k !== j);
    rest.splice(Math.max(i, j) - 1, 0, [mate, mateOf(w[j], partner)]);
    return [rest, [t, partner]];
  };
  const waiting = messages.filter((m) => m.state === 'waiting');
  // A way's pairs as things to take: each pair on its own, but a waiting
  // message's two pairs together, where the way takes them so.
  const things = (w) => {
    const out = [];
    for (let k = 0; k < w.length; k++) {
      const n = waiting.find((n) => w[k].some((t) => n.tiles.includes(t)));
      const both = n && k + 1 < w.length && w[k + 1].some((t) => n.tiles.includes(t));
      out.push(both ? [w[k], w[++k]] : [w[k]]);
    }
    return out;
  };
  // Plays things through from where the tiles lie, each time the first that
  // can be taken; two pairs together, either first, the second straight
  // after the first. Returns the way as played, if it wins.
  const play = (list) => {
    const p = Uint8Array.from(present);
    const can = (pair) => free(p, pair[0]) && free(p, pair[1]);
    const set = (pair, v) => (p[pair[0]] = p[pair[1]] = v);
    const order = (thing) => {
      if (thing.length === 1) return can(thing[0]) ? thing : null;
      for (const [a, b] of [thing, [thing[1], thing[0]]]) {
        if (!can(a)) continue;
        set(a, 0);
        const ok = can(b);
        set(a, 1);
        if (ok) return [a, b];
      }
      return null;
    };
    const todo = list.slice();
    const played = [];
    while (todo.length) {
      let k = -1;
      let pairs = null;
      while (!pairs && ++k < todo.length) pairs = order(todo[k]);
      if (!pairs) return null;
      for (const pair of pairs) {
        set(pair, 0);
        played.push(pair);
      }
      todo.splice(k, 1);
    }
    return holds(played) ? played : null;
  };
  const begun = messages.find((m) => m.state === 'begun');
  const next = begun && begun.tiles[1 - begun.first];
  if (begun && at(out, next) > 0) {
    for (const partner of partners(out, next)) {
      const [rest, pair] = alone(out, next, partner);
      const played = play([[pair], ...things(rest)]);
      if (played && at(played, next) === 0) {
        out = played;
        break;
      }
    }
  }
  const front = begun && at(out, next) === 0;
  for (const m of waiting) {
    if (together(out, m)) continue;
    const [x, y] = m.tiles;
    search: for (const px of partners(out, x)) {
      const [r1, X] = alone(out, x, px);
      for (const py of partners(r1, y)) {
        const [r2, Y] = alone(r1, y, py);
        const played = play(front ? [[r2[0]], [X, Y], ...things(r2.slice(1))] : [[X, Y], ...things(r2)]);
        if (played && (!front || at(played, next) === 0)) {
          out = played;
          break search;
        }
      }
    }
  }
  return out;
}
