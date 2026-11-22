import { pathOf } from './glasses.js';
import { seeded } from './rng.js';

// Raindrops, on April Showers' second board, the umbrella: as the board
// starts, and again every so many matches, a raindrop lands on the
// umbrella's peak and runs down the canopy along one of its ribs, a place
// with every match, dripping off at the rim. A drop is on the tile at the
// top of the stack where it is; a pair taken with that tile in it catches
// the drop, for a bonus. Over a place whose tiles are all taken, a drop
// runs on over nothing, and can't be caught there.
//
// Which rib a drop runs down is shuffled for it from the board's seed,
// among the ribs with a tile still on them, so that a board reached the
// same way sees the same rain, and it is never the rib the drop before
// took while another has tiles. A drop lands only on a rib it has the
// matches left to run the whole way down before the board is cleared, so
// the rain stops near the end, and once no rib has a tile left. The deal
// is made so that its own order catches the drops it can (catching), and
// the hints take a drop whenever they can. Drops change nothing about when
// a tile can be taken. Game keeps the drops, and score.js what they earn.

// The ribs, each given as its places, [column, row], from the peak down to
// the rim, in half tiles, as positions are (layout.js): and for each place,
// the tiles that lie over it, the top one first, so that the tile a drop is
// on is the first of them still on the board.
export function ribsOf(L, ribs) {
  return ribs.map((cells) =>
    pathOf(cells).map(([x, y]) => {
      const over = [];
      for (let i = 0; i < L.count; i++) if (Math.abs(L.x[i] - x) < 2 && Math.abs(L.y[i] - y) < 2) over.push(i);
      // the top layer first, and on a layer the tile most squarely over it
      over.sort((a, b) => L.z[b] - L.z[a] || Math.abs(L.x[a] - x) + Math.abs(L.y[a] - y) - (Math.abs(L.x[b] - x) + Math.abs(L.y[b] - y)) || a - b);
      return { place: [x, y], over };
    }),
  );
}

// The tile at the top of a place, still on the board, or -1 with none.
export function topOf(spot, present) {
  for (const i of spot.over) if (present[i]) return i;
  return -1;
}

// Whether a rib still has a tile on it, for a drop to run down.
export const wet = (rib, present) => rib.some((spot) => topOf(spot, present) >= 0);

// The pairs still on a board.
const pairsLeft = (present) => present.reduce((n, p) => n + p, 0) / 2;

// The ribs a drop can land on, as the tiles lie: those with a tile still on
// them, and no longer than the matches left to run down them.
export const openRibs = (ribs, present) => ribs.map((_, r) => r).filter((r) => ribs[r].length <= pairsLeft(present) && wet(ribs[r], present));

// The rib drop k lands on, counted from 0 for the one as the board starts:
// one of the ribs open to it, by a shuffle of its own, and not `last`, the
// rib the drop before took, while another is open; or -1 with none.
export function landing(ribs, present, seed, k, last = -1) {
  const open = openRibs(ribs, present);
  const fresh = open.length > 1 ? open.filter((r) => r !== last) : open;
  return fresh.length ? seeded((seed ^ 0x1b56c4e9) + k * 0x9e3779b1).pick(fresh) : -1;
}

// Where a drop is, with so many matches made: its place along its rib, or
// -1 once it has run past the rim.
export function stepOf(ribs, drop, matches) {
  const k = matches - drop.at;
  return k < ribs[drop.rib].length ? k : -1;
}

// The drops still running, with so many matches made, each { drop, step,
// tile }: where it is along its rib, and the tile it's on, or -1 over a
// place whose tiles are all taken.
export function running(ribs, drops, present, matches) {
  const out = [];
  for (const drop of drops) {
    if (drop.state !== 'running') continue;
    const step = stepOf(ribs, drop, matches);
    if (step >= 0) out.push({ drop, step, tile: topOf(ribs[drop.rib][step], present) });
  }
  return out;
}

// The rain as a match plays out, given the drops before it and the board
// before it: the drops on the pair's tiles are caught, the board loses the
// pair, the drops still running run on a place, those past the rim drip
// off, and every `every` matches, while tiles are left, another lands.
// Returns { drops, caught, dripped, landed }: the drops after it, each a
// copy; the drops caught, with the tiles they were on; those that dripped
// off; and the drop that landed, or null, with no rib open to one.
// `present` is left as it was.
export function rainOn(ribs, every, seed, drops, present, matches, [a, b]) {
  const out = drops.map((d) => ({ ...d }));
  const caught = [];
  for (const { drop, tile } of running(ribs, out, present, matches)) {
    if (tile >= 0 && (tile === a || tile === b)) {
      drop.state = 'caught';
      drop.caughtOn = matches + 1;
      caught.push({ drop, tile });
    }
  }
  const after = Uint8Array.from(present);
  after[a] = after[b] = 0;
  const done = matches + 1;
  const dripped = [];
  for (const drop of out) {
    if (drop.state === 'running' && stepOf(ribs, drop, done) < 0) {
      drop.state = 'dripped';
      dripped.push(drop);
    }
  }
  let landed = null;
  if (done % every === 0) {
    const rib = landing(ribs, after, seed, out.length, out.length ? out.at(-1).rib : -1);
    if (rib >= 0) {
      landed = { rib, at: done, state: 'running' };
      out.push(landed);
    }
  }
  return { drops: out, caught, dripped, landed };
}

// The drops as the board starts: the first, landing on the peak.
export function firstRain(ribs, seed, present) {
  const rib = landing(ribs, present, seed, 0);
  return rib >= 0 ? [{ rib, at: 0, state: 'running' }] : [];
}

// A deal that catches the drops it can: as it plays the board through
// (deal.js), the rain falling as it would on the order so far, it tries
// first the tiles that running drops are on, the drop furthest down its
// rib first, and last the tiles still in a drop's way, further down its
// rib, so that they are still there when it comes. `done` is the matches
// made before the deal, and `drops` the drops then, for a shuffle.
export const catching = (ribs, every, seed, done = 0, drops = null) => (free, present, order) => {
  // the board as it was before the order so far, played through again
  const before = Uint8Array.from(present);
  for (const [a, b] of order) before[a] = before[b] = 1;
  let now = drops ? drops.map((d) => ({ ...d })) : firstRain(ribs, seed, before);
  for (let s = 0; s < order.length; s++) {
    now = rainOn(ribs, every, seed, now, before, done + s, order[s]).drops;
    before[order[s][0]] = before[order[s][1]] = 0;
  }
  const falling = running(ribs, now, present, done + order.length);
  const wanted = falling
    .filter(({ tile }) => tile >= 0 && free.includes(tile))
    .sort((p, q) => q.step - p.step)
    .map(({ tile }) => tile);
  const ahead = new Set();
  for (const { drop, step } of falling) for (const spot of ribs[drop.rib].slice(step + 1)) ahead.add(topOf(spot, present));
  const rest = free.filter((t) => !wanted.includes(t));
  return [...new Set(wanted), ...rest.filter((t) => !ahead.has(t)), ...rest.filter((t) => ahead.has(t))];
};

// How many drops an order of pairs catches, taken from the start: for
// making a deal whose own order catches them.
export function caughtIn(ribs, every, seed, order, present) {
  const board = Uint8Array.from(present);
  let drops = firstRain(ribs, seed, board);
  let n = 0;
  order.forEach((pair, s) => {
    const r = rainOn(ribs, every, seed, drops, board, s, pair);
    drops = r.drops;
    n += r.caught.length;
    board[pair[0]] = board[pair[1]] = 0;
  });
  return n;
}
