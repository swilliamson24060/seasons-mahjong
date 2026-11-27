import { isFree, keyOf, freeTiles } from './layout.js';
import { KINDS, MATCH, GHOST, LOST } from './tiles.js';
import { soulsAt } from './midnight.js';
import { seeded } from './rng.js';
import { WINDS, windAt, inWind, acrossOf } from './wind.js';
import { tideAt, covered } from './tide.js';
import { afterPair, goBack } from './crab.js';

// Tuned on a few thousand turtle deals: how much more a pair counts for when
// it frees a tile whose match is already free, how widely ties are broken,
// and the length of the shortest go, in steps. Before midnight a pair that
// will match on the other side too counts for a little more, as taking it
// leaves no tile to wake as a lost soul.
const MATES = 6;
const NOISE = 10;
const UNIT = 500;
const BOTH = 3;

// Finds a way to win from a position: the pairs to take, in order.
//
// Once the faces are settled for good, when every tile left of one kind is
// free, it takes them all without searching: they can only go with each
// other, and taking a tile never pins another down, so taking them can never
// hurt. It also gives up on a position at once when even a generous
// reckoning cannot clear it (see hopeless below). Before midnight neither
// holds, since the tiles will turn over. Otherwise it tries first the pairs
// that free the most tiles, above all tiles whose match is already free.
//
// A search that wanders into a hopeless corner can take a long time to see
// it, so the solver searches in short goes, now and then a longer one,
// breaking ties another way each time and remembering the positions it has
// already proved lost.
//
// The position: faces, the faces showing; present; unlocked, the tiles
// opened with a skeleton key; ghostsFloat; soulsFloat, lost souls free
// wherever they lie, as on April Showers' May Day; turn, while the tiles
// have still to turn over: { after, faces }, the matches until they do and
// the faces they turn over to; ice, on a board with frozen tiles, the
// matches each tile still needs to thaw, which the pairs taken in the
// search count down; and wind, on the Start of Spring's kite, the March
// wind: { every, at, upwind }, how often it turns, the matches made so far,
// and each tile's upwind tiles (wind.js), the tiles on the edge it blows on
// loose as the pairs taken in the search turn it. With the wind blowing,
// nothing is taken without searching: a kind's tiles all free now may not
// all be once the wind turns. And tide, on the beach season's sandcastle:
// { every, high, phase, rows }, how often it moves a row and how far it
// comes in, the matches it is into its coming and going, and each tile's
// row up from the foot (tide.js), the rows under the water not to be taken
// from, and the tide going out at once with nothing else to take. With the
// tide moving, too, nothing is taken without searching, and a position is
// remembered with the tide's place in its coming and going. And crab, on
// its footprints in the sand: the sand crab, { tile, dir, outIn, count,
// every, seed } (crab.js), its tile not to be taken from, carried along as
// the pairs are taken, startled, scuttling and coming out as it would, and
// going back into its burrow at once with nothing else to take; a position
// is remembered with where the crab is.
//
// Returns { result, line, steps }, where result is 'win', 'lost', or
// 'unknown' when the budget of steps ran out first.
export function solve(L, position, { budget = 200000 } = {}) {
  const { faces, unlocked = null, ghostsFloat = false, soulsFloat = false, turn = null, ice = null, wind = null, tide = null, crab = null } = position;
  const n = L.count;
  const K = KINDS.length;
  const present = Uint8Array.from(position.present);
  const next = turn && Int16Array.from(turn.faces); // lost souls are written in as they wake
  let cur = faces; // the faces showing at this point of the search
  let settled = !turn; // no turning over still to come
  let souls = ''; // which tiles woke as lost souls: part of every position after midnight
  const kindOf = (i) => MATCH[cur[i]];
  const loose = (i) => (unlocked !== null && unlocked[i] === 1) || (ghostsFloat && cur[i] === GHOST) || (soulsFloat && cur[i] === LOST);
  let taken = 0; // the pairs taken so far at this point of the search, which thaw the ice and turn the wind
  const windy = (i) => wind !== null && inWind(wind.upwind, windAt(wind.at + taken, wind.every), present, i);
  let ebbed = tide ? -tide.phase : 0; // the pairs taken when the tide last went out, counted from this position
  const level = () => (tide ? tideAt(taken - ebbed, tide.every, tide.high) : 0);
  const wet = (i) => tide !== null && covered(tide.rows, level(), i);
  let crabNow = crab && { tile: crab.tile, dir: crab.dir, outIn: crab.outIn, count: crab.count }; // the crab at this point of the search
  const free = (i) => (ice === null || ice[i] <= taken) && !wet(i) && (crabNow === null || crabNow.tile !== i) && (loose(i) || windy(i) || isFree(L, present, i));
  const cycle = tide ? 2 * tide.high * tide.every : 1;
  const r = seeded(7);
  const line = [];
  const dead = new Set();
  const freeNow = new Uint8Array(n);
  const seen = new Int32Array(n);
  const rest = new Uint8Array(n);
  let stamp = 0;
  let steps = 0;
  let limit = 0;
  let cut = false; // this go ran out of steps

  // Remembers a lost position, unless this go was cut short.
  const lost = (key) => {
    if (!cut) dead.add(key);
    return false;
  };

  // The tiles turn over: the next faces show from here on, with any tiles
  // left without a partner awake as lost souls, as the game wakes them.
  const wake = () => {
    const woke = soulsAt(L, next, present).map((t) => [t, next[t]]);
    for (const [t] of woke) next[t] = LOST;
    cur = next;
    settled = true;
    souls = `|${woke.map(([t]) => t).join(',')}`;
    return woke;
  };

  const sleep = (woke) => {
    for (const [t, had] of woke) next[t] = had;
    cur = faces;
    settled = false;
    souls = '';
  };

  // Plays on as if a kind with more than two tiles left could be taken a tile
  // at a time, and a kind down to its last two only as a pair, as if any
  // ice had thawed, and as if the wind blew from every side at once. If even
  // that cannot clear the board, nothing can. Taking tiles only ever frees
  // others, so the order this plays in makes no difference.
  const across = wind ? acrossOf(L) : null; // the tiles a tile's going may put in the wind
  const hopeless = (tiles, left) => {
    rest.set(present);
    const queue = [];
    for (let i = 0; i < n; i++) if (rest[i]) queue.push(i);
    const take = (t) => {
      rest[t] = 0;
      left--;
      for (const near of [L.below[t], L.opens[t]]) for (const u of near) if (rest[u]) queue.push(u);
      if (across) for (const u of across[t]) if (rest[u]) queue.push(u);
    };
    const freeRest = (t) => loose(t) || isFree(L, rest, t) || (wind !== null && WINDS.some((_, w) => inWind(wind.upwind, w, rest, t)));
    while (queue.length && left > 0) {
      const t = queue.pop();
      if (!rest[t] || !freeRest(t)) continue;
      const own = tiles[kindOf(t)];
      if (own.length !== 2) take(t);
      else {
        const mate = own[0] === t ? own[1] : own[0];
        if (rest[mate] && freeRest(mate)) {
          take(t);
          take(mate);
        }
      }
    }
    return left > 0;
  };

  // How much taking a and b would free: four for each tile that is not free
  // now and would be, and more again when that tile's match is already free.
  const frees = (a, b, open) => {
    stamp++;
    present[a] = present[b] = 0;
    let score = 0;
    for (const near of [L.below[a], L.below[b], L.opens[a], L.opens[b]]) {
      for (const t of near) {
        if (!present[t] || freeNow[t] || seen[t] === stamp) continue;
        seen[t] = stamp;
        if (free(t)) score += 4 + (open[kindOf(t)].some((m) => m !== a && m !== b) ? MATES : 0);
      }
    }
    present[a] = present[b] = 1;
    return score;
  };

  let turnLeft = -1; // the tiles left at the stroke of midnight

  let total = 0; // the tiles there were to begin with
  // A position searched, the tide put back as it was on the way out of it,
  // for one that went out at once in it.
  const search = (left) => {
    const before = ebbed;
    const crabBefore = crabNow;
    const won = node(left);
    ebbed = before;
    crabNow = crabBefore;
    return won;
  };
  const node = (left) => {
    if (left === 0) return true;
    taken = (total - left) / 2;
    if (++steps > limit) {
      cut = true;
      return false;
    }
    const key = keyOf(present) + souls + (tide ? `~${(taken - ebbed) % cycle}` : '') + (crabNow ? `^${crabNow.tile},${crabNow.dir},${crabNow.outIn},${crabNow.count}` : '');
    if (dead.has(key)) return false;

    const tiles = [];
    const open = [];
    for (let k = 0; k < K; k++) {
      tiles.push([]);
      open.push([]);
    }
    for (let i = 0; i < n; i++) {
      if (!present[i]) continue;
      const k = kindOf(i);
      tiles[k].push(i);
      freeNow[i] = free(i) ? 1 : 0;
      if (freeNow[i]) open[k].push(i);
    }

    if (settled) {
      if (hopeless(tiles, left)) return lost(key);
      const forced = wind || tide || crab ? -1 : open.findIndex((o, k) => o.length > 0 && o.length === tiles[k].length);
      if (forced >= 0) {
        const o = open[forced];
        for (const i of o) present[i] = 0;
        for (let m = 0; m < o.length; m += 2) line.push([o[m], o[m + 1]]);
        if (search(left - o.length)) return true;
        line.length -= o.length / 2;
        for (const i of o) present[i] = 1;
        return lost(key);
      }
    }

    const moves = [];
    for (const o of open) {
      for (let p = 0; p < o.length; p++) {
        for (let q = p + 1; q < o.length; q++) {
          const a = o[p];
          const b = o[q];
          const both = !settled && MATCH[next[a]] === MATCH[next[b]] ? BOTH : 0;
          moves.push({ a, b, score: frees(a, b, open) + both + L.z[a] + L.z[b] + r() * NOISE });
        }
      }
    }
    // With nothing to take but what the water covers, the tide goes out at
    // once, and the same tiles are looked at again, dry.
    if (!moves.length && level() > 0) {
      ebbed = taken;
      return node(left);
    }
    // With nothing to take but the crab's tile, the crab goes back into its
    // burrow at once.
    if (!moves.length && crabNow && crabNow.tile >= 0) {
      crabNow = goBack(crabNow, crab.every);
      return node(left);
    }
    moves.sort((m1, m2) => m2.score - m1.score);
    for (const { a, b } of moves) {
      present[a] = present[b] = 0;
      line.push([a, b]);
      const crabHere = crabNow;
      if (crabNow) crabNow = afterPair(L, present, crabNow, a, b, crab.every, crab.seed, () => freeTiles(L, present)).crab;
      const turning = !settled && left - 2 === turnLeft;
      const woke = turning ? wake() : null;
      if (search(left - 2)) return true;
      if (turning) sleep(woke);
      crabNow = crabHere;
      line.pop();
      present[a] = present[b] = 1;
      if (cut) return false;
    }
    return lost(key);
  };

  let left = 0;
  for (let i = 0; i < n; i++) left += present[i];
  total = left;
  if (turn) turnLeft = left - 2 * turn.after;
  for (let go = 1; ; go++) {
    limit = Math.min(steps + UNIT * luby(go), budget);
    cut = false;
    line.length = 0;
    if (search(left)) return { result: 'win', line, steps };
    if (!cut) return { result: 'lost', line: [], steps };
    if (steps >= budget) return { result: 'unknown', line: [], steps };
  }
}

// The lengths of the goes, in units: 1, 1, 2, 1, 1, 2, 4, 1, 1, 2, ... Long
// goes come round now and then, but the search keeps going back to short ones.
function luby(i) {
  for (let k = 1; ; k++) {
    if (i === 2 ** k - 1) return 2 ** (k - 1);
    if (i < 2 ** k - 1) return luby(i - 2 ** (k - 1) + 1);
  }
}
