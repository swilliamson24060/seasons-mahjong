import { isFree } from './layout.js';
import { MATCH, GHOST, LANTERN, LOST, dealPairs } from './tiles.js';
import { deal, redeal } from './deal.js';
import { soulsAt } from './midnight.js';
import { chooseList } from './list.js';
import { withFridge } from './fridge.js';
import { chooseBusters } from './doorbusters.js';
import { solve } from './solver.js';
import { seeded } from './rng.js';

export const TREATS = ['candle', 'key', 'cat'];

// One board in play: which tiles are left and which can be taken, undo,
// hints, shuffles, treats, ice, the shopping list and the stroke of
// midnight, the fridge and doorbusters. Nothing here touches the page; the
// board listens with on() for what happens: 'match', 'thaw', 'list',
// 'checkout', 'bought', 'grab', 'save', 'turn', 'treat', 'key', 'shuffle',
// 'undo', 'win' and 'stuck'.
//
// Options: the seed for the deal; faces, or sides for a board that turns
// over, to set the tiles instead of dealing them; turnAt, the number of
// matches after which the tiles turn over, and firstSide, 'day' or 'night',
// the side they start on; whether ghosts float, and whether treats are
// left, and by pairs of which faces (treatFaces: jack-o'-lanterns, unless
// a board says otherwise); ice, for a board with frozen tiles: the matches
// each tile takes to thaw (ice.js); list, for a board with a shopping list
// (list.js): { items, by }, how many things it has and after what share of
// the matches checkout comes, or for a board whose faces are set, { kinds,
// checkout }; fridge, for a board with leftovers (fridge.js): how many
// containers it has; and doorbusters, for a board with them
// (doorbusters.js): { pairs, every }, how many there are and after how many
// of the player's matches another shopper grabs one, or for a board whose
// faces are set, { tiles, every }.
//
// On a board with a fridge, the game's layout has the containers after the
// table's tiles: tableCount is how many tiles the table has, and the places
// from there on are the containers.
export class Game {
  constructor(
    table,
    { seed = 1, faces = null, sides = null, turnAt = Infinity, firstSide = 'day', ghostsFloat = true, treats = true, treatFaces = [LANTERN], ice = null, list = null, fridge = 0, doorbusters = null } = {},
  ) {
    const n = table.count;
    const layout = fridge ? withFridge(table, fridge) : table;
    const pairs = n / 2;
    const turns = turnAt !== Infinity;
    if (turns && !(turnAt >= 1 && turnAt < pairs)) throw new Error(`${table.name} cannot turn over after ${turnAt} matches`);
    this.layout = layout;
    this.tableCount = n;
    this.fridgeSize = fridge;
    this.seed = seed;
    this.rules = { ghostsFloat, treats };
    this.treatFaces = treatFaces;
    this.turnAt = turnAt;
    this.r = seeded(seed);
    this.treatR = seeded(seed ^ 0x5bd1e995);
    // What is given for the table's tiles, with nothing yet in the containers.
    const whole = (a, empty) => Int16Array.from({ length: layout.count }, (_, i) => (i < n ? a[i] : empty));
    if (ice && ice.length !== n) throw new Error(`${table.name} has ${n} tiles, not ${ice.length} under ice`);
    this.ice = ice && whole(ice, 0);
    const onTable = Uint8Array.from({ length: layout.count }, (_, i) => (i < n ? 1 : 0));
    if (faces || sides) {
      const given = sides || [faces];
      if (given.length !== (turns ? 2 : 1)) throw new Error(`${table.name} needs ${turns ? 2 : 1} sides of faces`);
      for (const s of given) if (s.length !== n) throw new Error(`${table.name} has ${n} tiles, not ${s.length}`);
      this.sides = given.map((f) => whole(f, -1));
      this.plan = null;
    } else {
      const dealt = deal(layout, (turns ? [0, 1] : [0]).map(() => dealPairs(this.r, pairs)), this.r, { present: onTable, turnAt, ice: this.ice });
      if (!dealt) throw new Error(`${table.name} cannot be dealt`);
      this.sides = dealt.sides;
      this.plan = dealt.order; // the order the deal was made in, which wins
    }
    this.sideNames = turns ? [firstSide, firstSide === 'day' ? 'night' : 'day'] : [firstSide];
    this.present = onTable;
    this.left = n;
    this.matches = 0;
    this.unlocked = new Uint8Array(layout.count);
    this.history = [];
    this.treats = { candle: 0, key: 0, cat: 0 };
    this.treatPairs = 0; // pairs taken that leave treats, as things stand
    this.treatPairsBest = 0; // the most ever taken at once: only a new best earns a treat
    this.hints = 0;
    this.shuffles = 0;
    // The rest of a winning line, kept while the player follows it so that
    // hints are instant, and whether the board can be won, as last found.
    this.line = this.plan && this.plan.slice();
    this.outlook = this.plan ? 'win' : 'unknown';
    this.handlers = {};
    // The shopping list: the kinds on it, and the match at which checkout
    // comes; and the kinds crossed off it so far, in order. A list never
    // asks for a pair that is free from the start, when it can help it.
    this.list = null;
    this.crossed = [];
    if (list) {
      const checkout = list.checkout ?? Math.round(pairs * list.by);
      const freeNow = new Map();
      for (const i of this.freeTiles()) freeNow.set(MATCH[this.faces[i]], (freeNow.get(MATCH[this.faces[i]]) || 0) + 1);
      const avoid = new Set([...freeNow].filter(([, n]) => n >= 2).map(([k]) => k));
      const kinds = list.kinds ?? (this.plan ? chooseList(this.plan, this.sides[0], checkout, list.items, seeded(seed ^ 0x2545f491), avoid) : []);
      this.list = { kinds: Array.from(kinds), checkout };
    }
    // Doorbusters: pairs wearing a sale tag, each 'open', 'mine' once the
    // player has bought it, or 'gone' to another shopper.
    this.busters = null;
    this.busterEvery = 0;
    if (doorbusters) {
      const freeNow = new Set(this.freeTiles());
      const tiles = doorbusters.tiles ?? (this.plan ? chooseBusters(this.plan, doorbusters.pairs, seeded(seed ^ 0x1b873593), freeNow) : []);
      this.busters = tiles.map((t) => ({ tiles: t.slice(), state: 'open' }));
      this.busterEvery = doorbusters.every;
    }
  }

  on(type, fn) {
    (this.handlers[type] || (this.handlers[type] = [])).push(fn);
    return this;
  }

  emit(type, data) {
    for (const fn of this.handlers[type] || []) fn(data);
  }

  // Which side is up: 0 until the tiles turn over, 1 after.
  get side() {
    return this.matches >= this.turnAt ? 1 : 0;
  }

  get sideName() {
    return this.sideNames[this.side];
  }

  // The faces showing.
  get faces() {
    return this.sides[this.side];
  }

  face(i) {
    return this.faces[i];
  }

  get turnAhead() {
    return this.sides.length > 1 && this.side === 0;
  }

  // The matches still to make before the tiles turn over: Infinity on a
  // board that never turns over, and 0 once it has.
  get untilTurn() {
    return Math.max(0, this.turnAt - this.matches);
  }

  // The face a tile will turn over to, for peeking, while that is to come.
  nextFace(i) {
    return this.turnAhead ? this.sides[1][i] : null;
  }

  // How many lost souls would wake if the tiles turned over now.
  soulsIfNow() {
    return this.turnAhead ? soulsAt(this.layout, this.sides[1], this.present).length : 0;
  }

  get won() {
    return this.left === 0;
  }

  // Nothing can be taken, and nothing more can go in the fridge.
  get stuck() {
    return this.left > 0 && this.pairs().length === 0 && !this.canSave();
  }

  // Free whatever lies on them: ghosts, when they float, and tiles opened
  // with a skeleton key. A tile floats only while its ghost face is up.
  loose(i, faces = this.faces) {
    return this.unlocked[i] === 1 || (this.rules.ghostsFloat && faces[i] === GHOST);
  }

  // How many more matches a tile needs before it thaws: 0 once it has, and
  // for a tile never frozen.
  thawIn(i) {
    return this.ice ? Math.max(0, this.ice[i] - this.matches) : 0;
  }

  frozen(i) {
    return this.thawIn(i) > 0;
  }

  // The ice still to thaw on every tile, as the solver and a shuffle want it.
  iceAhead() {
    return this.ice && Int16Array.from(this.ice, (t) => Math.max(0, t - this.matches));
  }

  // Free as the tiles lie, ice aside: nothing on it, and a side open.
  open(i) {
    return this.present[i] === 1 && (this.loose(i) || isFree(this.layout, this.present, i));
  }

  // Free to be taken: open, and not frozen.
  isFree(i) {
    return this.open(i) && !this.frozen(i);
  }

  // Whether the store is still open: the list can be crossed off until the
  // match at checkout has been made.
  get listOpen() {
    return Boolean(this.list) && this.matches < this.list.checkout;
  }

  // The matches still to make before checkout, that one included.
  get untilCheckout() {
    return this.list ? Math.max(0, this.list.checkout - this.matches) : 0;
  }

  // The kinds still on the list, not yet crossed off.
  get listLeft() {
    return this.list ? this.list.kinds.filter((k) => !this.crossed.includes(k)) : [];
  }

  // Whether a tile is one of the things still to find while the store is open.
  onList(i) {
    return this.listOpen && this.listLeft.includes(MATCH[this.faces[i]]);
  }

  // The fridge: whether a place is one of its containers; the first one
  // empty, or -1 when it is full; and how many are empty.
  inFridge(i) {
    return i >= this.tableCount;
  }

  emptySlot() {
    for (let s = this.tableCount; s < this.layout.count; s++) if (!this.present[s]) return s;
    return -1;
  }

  get fridgeRoom() {
    let room = 0;
    for (let s = this.tableCount; s < this.layout.count; s++) if (!this.present[s]) room++;
    return room;
  }

  // Whether a tile could go in the fridge now: a container empty, and a
  // free tile on the table to put in it.
  canSave() {
    return this.fridgeRoom > 0 && this.freeTiles().some((i) => !this.inFridge(i));
  }

  // Puts a free tile from the table in the fridge, in the first container
  // empty, to take with its partner later. Off the table, it holds nothing
  // down any more. A winning line still wins, taking the tile from the
  // fridge where it would have taken it from the table. Returns the
  // container, or -1 if the tile cannot go in.
  save(i) {
    const slot = this.emptySlot();
    if (slot < 0 || this.inFridge(i) || !this.isFree(i)) return -1;
    this.history.push({ type: 'save', tile: i, slot, line: this.line && this.line.slice(), outlook: this.outlook });
    for (const s of this.sides) s[slot] = s[i];
    this.present[i] = 0;
    this.present[slot] = 1;
    if (this.line) this.line = this.line.map(([a, b]) => [a === i ? slot : a, b === i ? slot : b]);
    this.emit('save', { tile: i, slot });
    this.settle();
    return slot;
  }

  // Doorbusters: whether a tile is one still to be had, and how many more
  // of the player's matches before another shopper grabs one.
  isBuster(i) {
    return Boolean(this.busters) && this.present[i] === 1 && this.busters.some((d) => d.state === 'open' && d.tiles.includes(i));
  }

  get untilGrab() {
    return this.busters ? this.busterEvery - (this.matches % this.busterEvery) : 0;
  }

  // Another shopper, after every so many of the player's matches, grabs the
  // first doorbuster still free, both its tiles at once. Its two tiles are a
  // pair the deal's order takes together, so the winning line keeps good.
  // Returns the doorbuster grabbed, or null.
  grab() {
    if (!this.busters || this.matches % this.busterEvery) return null;
    const d = this.busters.find((o) => o.state === 'open' && o.tiles.every((t) => this.isFree(t)));
    if (!d) return null;
    d.state = 'gone';
    const [x, y] = d.tiles;
    this.present[x] = this.present[y] = 0;
    this.left -= 2;
    this.follow(x, y);
    return d;
  }

  freeTiles() {
    const out = [];
    for (let i = 0; i < this.layout.count; i++) if (this.isFree(i)) out.push(i);
    return out;
  }

  canMatch(a, b) {
    return a !== b && this.isFree(a) && this.isFree(b) && MATCH[this.faces[a]] === MATCH[this.faces[b]];
  }

  // Every pair that could be taken now.
  pairs() {
    const free = this.freeTiles();
    const out = [];
    for (let p = 0; p < free.length; p++) {
      for (let q = p + 1; q < free.length; q++) {
        if (MATCH[this.faces[free[p]]] === MATCH[this.faces[free[q]]]) out.push([free[p], free[q]]);
      }
    }
    return out;
  }

  // Takes a pair. Returns { a, b, treat, turned, souls, thawed, crossed,
  // checkout, bought, grab }: the treat the pair left, if any; whether this match struck
  // midnight, and if it did, the tiles that woke as lost souls; the tiles
  // this match thawed; the kind it crossed off the list, or null; and
  // whether it was the match at checkout; whether it bought a doorbuster;
  // and the tiles of the doorbuster another shopper grabbed after it, or
  // null. Null if the pair cannot be taken.
  match(a, b) {
    if (!this.canMatch(a, b)) return null;
    const giving = this.treatFaces.includes(this.faces[a]);
    const listed = this.onList(a);
    const entry = { type: 'match', a, b, giving, line: this.line && this.line.slice(), outlook: this.outlook };
    if (listed) {
      entry.crossed = MATCH[this.faces[a]];
      this.crossed.push(entry.crossed);
    }
    // A pair with a tile of an open doorbuster in it buys that doorbuster.
    const bought = this.busters ? this.busters.filter((d) => d.state === 'open' && (d.tiles.includes(a) || d.tiles.includes(b))) : [];
    for (const d of bought) d.state = 'mine';
    if (bought.length) entry.bought = bought;
    this.present[a] = this.present[b] = 0;
    this.left -= 2;
    this.matches++;
    if (this.matches === this.turnAt) entry.souls = this.wake();
    this.history.push(entry);
    this.follow(a, b);
    const grab = this.grab();
    if (grab) entry.grab = grab;
    let treat = null;
    if (giving) {
      this.treatPairs++;
      if (this.treatPairs > this.treatPairsBest) {
        this.treatPairsBest = this.treatPairs;
        if (this.rules.treats) {
          treat = this.treatR.pick(TREATS);
          this.treats[treat]++;
        }
      }
    }
    const turned = Boolean(entry.souls);
    const thawed = [];
    if (this.ice) for (let i = 0; i < this.layout.count; i++) if (this.present[i] && this.ice[i] === this.matches) thawed.push(i);
    const checkout = Boolean(this.list) && this.matches === this.list.checkout;
    const result = {
      a,
      b,
      treat,
      turned,
      souls: turned ? entry.souls.map(([t]) => t) : [],
      thawed,
      crossed: listed ? entry.crossed : null,
      checkout,
      bought: bought.length > 0,
      grab: grab ? grab.tiles.slice() : null,
    };
    this.emit('match', result);
    if (thawed.length) this.emit('thaw', result);
    if (listed) this.emit('list', result);
    if (checkout) this.emit('checkout', result);
    if (bought.length) this.emit('bought', result);
    if (grab) this.emit('grab', result);
    if (turned) this.emit('turn', result);
    if (treat) this.emit('treat', result);
    this.settle();
    return result;
  }

  // The tiles turn over. Returns the tiles that woke as lost souls, with the
  // faces they had, so that undo can put them back.
  wake() {
    const next = this.sides[1];
    return soulsAt(this.layout, next, this.present).map((t) => {
      const had = next[t];
      next[t] = LOST;
      return [t, had];
    });
  }

  // Takes back the last match, shuffle or tile put in the fridge, and the
  // winning line known before it; a match that struck midnight turns the
  // tiles back again. Treats stay: undo never takes one back, and a turned
  // key stays turned.
  undo() {
    const last = this.history.pop();
    if (!last) return null;
    if (last.type === 'match') {
      if (last.souls) for (const [t, had] of last.souls) this.sides[1][t] = had;
      this.present[last.a] = this.present[last.b] = 1;
      this.left += 2;
      this.matches--;
      if (last.giving) this.treatPairs--;
      if (last.crossed !== undefined) this.crossed.pop();
      if (last.grab) {
        last.grab.state = 'open';
        for (const t of last.grab.tiles) this.present[t] = 1;
        this.left += 2;
      }
      if (last.bought) for (const d of last.bought) d.state = 'open';
    } else if (last.type === 'save') {
      this.present[last.slot] = 0; // out of the fridge, and back on the table
      this.present[last.tile] = 1;
    } else {
      this.sides = last.sides;
      if (last.busterTiles) this.busters.forEach((d, k) => (d.tiles = last.busterTiles[k]));
    }
    this.line = last.line;
    this.outlook = last.outlook;
    this.emit('undo', last);
    return last;
  }

  // The pair to take next: the next step of a winning line when one is found
  // in time, or else the free pair that holds up the most. Null when nothing
  // can be taken. hint() is the one the player pays for. A board found lost
  // stays lost whatever is taken, so it is not searched again.
  suggest() {
    if (!this.line && this.outlook !== 'lost') {
      const { result, line } = solve(this.layout, this.position(), { budget: 20000 });
      this.outlook = result;
      this.line = result === 'win' ? line : null;
    }
    if (this.line && this.line.length) return this.line[0];
    const W = this.layout.weight;
    let best = null;
    for (const p of this.pairs()) if (!best || W[p[0]] + W[p[1]] > W[best[0]] + W[best[1]]) best = p;
    return best;
  }

  hint() {
    const pair = this.suggest();
    if (pair) this.hints++;
    return pair;
  }

  useCandle() {
    if (!this.treats.candle) return null;
    const pair = this.suggest();
    if (pair) this.treats.candle--;
    return pair;
  }

  // Opens a blocked tile with a skeleton key: it stays free until it is
  // taken. A key is no use on ice, which only matches thaw.
  useKey(i) {
    if (!this.treats.key || !this.present[i] || this.isFree(i) || this.frozen(i)) return false;
    this.treats.key--;
    this.unlocked[i] = 1;
    if (this.outlook === 'lost') this.outlook = 'unknown'; // an opened tile may save it
    this.emit('key', i);
    return true;
  }

  // Deals the tiles still on the board onto the same places again, so the
  // board can still be won; a black cat does it for free. Before midnight
  // both sides are dealt again. False when no shuffle can help, as with two
  // tiles left one on top of the other.
  shuffle({ cat = false } = {}) {
    if ((cat && !this.treats.cat) || !this.left) return false;
    const dealt = redeal(this.layout, this.sides, this.side, this.turnAt - this.matches, this.present, this.r, this.iceAhead());
    if (!dealt) return false;
    const busterTiles = this.busters && this.busters.map((d) => d.tiles.slice());
    this.history.push({ type: 'shuffle', sides: this.sides, line: this.line && this.line.slice(), outlook: this.outlook, busterTiles });
    this.sides = dealt.sides;
    // The sale tags go with the stock: each open doorbuster becomes a pair
    // of the new deal's order, one with a tile it had if it can, so that
    // its two tiles match again.
    if (this.busters) {
      const order = dealt.order.slice();
      for (const d of this.busters) {
        if (d.state !== 'open') continue;
        const k = order.findIndex((p) => p.includes(d.tiles[0]) || p.includes(d.tiles[1]));
        d.tiles = order.splice(Math.max(0, k), 1)[0].slice();
      }
    }
    this.line = dealt.order.slice();
    this.outlook = 'win';
    if (cat) this.treats.cat--;
    else this.shuffles++;
    this.emit('shuffle', { cat });
    return true;
  }

  // The board as the solver sees it.
  position() {
    return {
      faces: this.faces,
      present: this.present,
      unlocked: this.unlocked,
      ghostsFloat: this.rules.ghostsFloat,
      turn: this.turnAhead ? { after: this.turnAt - this.matches, faces: this.sides[1] } : null,
      ice: this.iceAhead(),
    };
  }

  // Keeps the winning line good after the player takes a and b. Taking tiles
  // only ever frees others, so a pair taken early from further down the line
  // leaves the rest of it good, unless that brings midnight on sooner. Two
  // tiles that the line pairs with others leave their two partners, which
  // may match each other: they go in where the later of the two pairs was, or
  // else the earlier. Either way the line is played through to be sure.
  follow(a, b) {
    const line = this.line;
    if (!line) return;
    const i = line.findIndex((p) => p[0] === a || p[1] === a);
    const j = line.findIndex((p) => p[0] === b || p[1] === b);
    if (i < 0 || j < 0) return this.forget();
    const rest = line.filter((p, k) => k !== i && k !== j);
    const tries = [rest];
    if (i !== j) {
      const c = line[i][0] === a ? line[i][1] : line[i][0];
      const d = line[j][0] === b ? line[j][1] : line[j][0];
      tries.length = 0;
      for (const at of [Math.max(i, j) - 1, Math.min(i, j)]) tries.push(rest.slice(0, at).concat([[c, d]], rest.slice(at)));
    }
    this.line = tries.find((tried) => this.holds(tried)) || null;
    if (!this.line) this.forget();
  }

  // Whether a line of pairs wins from here, the tiles turning over when they
  // should, lost souls waking as they would, and ice thawing as it would.
  holds(line) {
    const p = Uint8Array.from(this.present);
    const sides = this.sides.map((s) => Int16Array.from(s));
    let matches = this.matches;
    for (const [x, y] of line) {
      const faces = sides[matches >= this.turnAt ? 1 : 0];
      const thawed = (i) => !this.ice || this.ice[i] <= matches;
      const free = (i) => p[i] === 1 && thawed(i) && (this.loose(i, faces) || isFree(this.layout, p, i));
      if (!free(x) || !free(y) || MATCH[faces[x]] !== MATCH[faces[y]]) return false;
      p[x] = p[y] = 0;
      if (++matches === this.turnAt) for (const t of soulsAt(this.layout, sides[1], p)) sides[1][t] = LOST;
    }
    return p.every((v) => v === 0);
  }

  forget() {
    this.line = null;
    this.outlook = 'unknown';
  }

  // Tells the listeners when the board is won or nothing can be taken.
  settle() {
    if (this.won) this.emit('win', this);
    else if (this.stuck) this.emit('stuck', this);
  }
}
