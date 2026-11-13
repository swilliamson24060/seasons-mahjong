import { isFree } from './layout.js';
import { MATCH, GHOST, LANTERN, LOST, dealPairs } from './tiles.js';
import { deal, redeal } from './deal.js';
import { soulsAt } from './midnight.js';
import { chooseList } from './list.js';
import { withFridge } from './fridge.js';
import { chooseBusters } from './doorbusters.js';
import { endZones, isTouchdown } from './football.js';
import { touching } from './flock.js';
import { ringTiles, ringByRing } from './rings.js';
import { followsOn } from './goslings.js';
import { mirrorOf, swansIn, swansCanPart, swanSteps, plantSwans } from './swans.js';
import { choosePails, possiblePails, pailSteps, plantPails } from './milk.js';
import { changePartners } from './dance.js';
import { chooseLords } from './lords.js';
import { choosePipers } from './pipers.js';
import { solve } from './solver.js';
import { seeded } from './rng.js';

export const TREATS = ['candle', 'key', 'cat'];

// One board in play: which tiles are left and which can be taken, undo,
// hints, shuffles, treats, ice, the shopping list and the stroke of
// midnight, the fridge, doorbusters, touchdowns, lovebirds, eggs, flocks,
// gold rings, goslings, swans, fresh milk, the dance, leaping lords and
// pipers. Nothing here touches the page; the board listens with on() for
// what happens: 'match', 'thaw', 'list', 'checkout', 'bought', 'grab',
// 'touchdown', 'lovebirds', 'flock', 'hatch', 'gold', 'gosling', 'swan',
// 'milk', 'dance', 'leap', 'pipe', 'save', 'turn', 'treat', 'key',
// 'shuffle', 'undo', 'win' and 'stuck'.
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
// faces are set, { tiles, every }; touchdown, for a football board
// (football.js): how many rows deep each end zone is; and lovebirds, for a
// board of turtle doves: whether a kind's second pair, taken straight after
// its first, is a pair of lovebirds; eggs, for a board of hens: how many of
// the tiles that start blocked are eggs, whose faces aren't seen until they
// come free and hatch; flock, for a board of songbirds: whether a pair
// whose two tiles touch flocks together (flock.js); rings, for the board of
// gold rings: the square each ring goes round (rings.js), each turning to
// gold once every tile of it is taken; goslings, for the board of geese:
// how many pairs in a line, each taken beside or under the pair before it,
// make a brood (goslings.js); swans, for the board of the swan on the lake:
// how many of its pairs are a tile and its own reflection (swans.js); and
// milk, for the milk pail (milk.js): { pails, keeps }, how many pails of
// fresh milk there are and how many matches each keeps for once either of
// its tiles is free, or for a board whose faces are set, { tiles, keeps };
// dance, for the board of the dancer: every how many matches the free tiles
// change partners (dance.js); lords, for the crown: how many lords there
// are, free wherever they are, or for a board whose faces are set, which
// tiles they are (lords.js); and pipers, for the bagpipes: how many pipers
// there are, whom the rest of their kind follow out, or which tiles they
// are (pipers.js).
//
// On a board with a fridge, the game's layout has the containers after the
// table's tiles: tableCount is how many tiles the table has, and the places
// from there on are the containers.
export class Game {
  constructor(
    table,
    { seed = 1, faces = null, sides = null, turnAt = Infinity, firstSide = 'day', ghostsFloat = true, treats = true, treatFaces = [LANTERN], ice = null, list = null, fridge = 0, doorbusters = null, touchdown = 0, lovebirds = false, eggs = 0, flock = false, rings = null, goslings = 0, swans = 0, milk = null, dance = 0, lords = 0, pipers = 0 } = {},
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
    this.rules = { ghostsFloat, treats, lovebirds, flock, goslings, swans, dance };
    this.danceR = seeded(seed ^ 0x1d872b41); // who dances with whom
    this.lords = null; // until the lords are chosen, below
    this.treatFaces = treatFaces;
    this.turnAt = turnAt;
    this.r = seeded(seed);
    this.treatR = seeded(seed ^ 0x5bd1e995);
    // What is given for the table's tiles, with nothing yet in the containers.
    const whole = (a, empty) => Int16Array.from({ length: layout.count }, (_, i) => (i < n ? a[i] : empty));
    if (ice && ice.length !== n) throw new Error(`${table.name} has ${n} tiles, not ${ice.length} under ice`);
    this.ice = ice && whole(ice, 0);
    const onTable = Uint8Array.from({ length: layout.count }, (_, i) => (i < n ? 1 : 0));
    // On a football board, the end zone each tile is in, and the
    // touchdowns scored so far.
    this.zones = touchdown ? whole(endZones(table, touchdown), 0) : null;
    this.touchdowns = 0;
    this.lovebirds = 0; // on a board of turtle doves, the lovebirds taken so far
    this.flocks = 0; // on a board of songbirds, the pairs that flocked together so far
    // On the board of gold rings, each ring: the square it goes round, its
    // tiles, and whether they have all been taken, turning it to gold.
    this.rings = rings && ringTiles(table, rings).map((tiles, k) => ({ square: rings[k], tiles, gold: false }));
    // On the board of geese, the goslings in the line so far, and the broods
    // they have made.
    this.trail = 0;
    this.broods = 0;
    // On the board of the swan on the lake, each tile's reflection.
    this.mirror = swans ? mirrorOf(table) : null;
    // The board of gold rings is dealt, and shuffled, a ring at a time, in
    // an order of its own; the board of the swan with its swans, a tile and
    // its reflection, coming free at different times; and the milk pail
    // with pairs that could be pails all through it.
    this.prefer = this.rings
      ? ringByRing(layout, this.rings.map((r) => r.tiles), seeded(seed ^ 0x68e31da4).shuffle(this.rings.map((_, k) => k)))
      : swans
        ? plantSwans(this.mirror, swans, swanSteps(seeded(seed ^ 0x3c6ef372), swans, pairs))
        : milk && !milk.tiles
          ? plantPails(table, pailSteps(seeded(seed ^ 0x2f8f9e1d), milk.pails, pairs), milk.keeps)
          : null;
    if (faces || sides) {
      const given = sides || [faces];
      if (given.length !== (turns ? 2 : 1)) throw new Error(`${table.name} needs ${turns ? 2 : 1} sides of faces`);
      for (const s of given) if (s.length !== n) throw new Error(`${table.name} has ${n} tiles, not ${s.length}`);
      this.sides = given.map((f) => whole(f, -1));
      this.plan = null;
    } else {
      // On a football board, dealt again until the deal's own order scores
      // a touchdown, on a board of turtle doves until it takes a pair of
      // lovebirds, and on a board of songbirds until it takes a pair that
      // flocks, so that one can always be had; on the board of the swan
      // until it has its swans, no more and no fewer, each a pair of the
      // deal's own order and of a kind with another pair on the board, which
      // can take a while; and on the milk pail until it has enough pairs
      // that could be pails.
      const swansAsWanted = (faces, order) => {
        const found = swansIn(layout, this.mirror, faces, onTable);
        const planned = (a, b) => order.some(([p, q]) => (p === a && q === b) || (p === b && q === a));
        return found.length === swans && found.every(([a, b]) => planned(a, b)) && swansCanPart(faces, onTable, found);
      };
      const wanted = ({ order, sides }) =>
        (!this.zones || order.some(([a, b]) => isTouchdown(this.zones, a, b))) &&
        (!lovebirds || order.some(([a], k) => k > 0 && MATCH[sides[0][a]] === MATCH[sides[0][order[k - 1][0]]])) &&
        (!flock || order.some(([a, b]) => touching(layout, a, b))) &&
        (!swans || swansAsWanted(sides[0], order)) &&
        (!milk || possiblePails(table, order, milk.keeps).length >= milk.pails);
      let dealt = null;
      for (let tries = 0; ; tries++) {
        dealt = deal(layout, (turns ? [0, 1] : [0]).map(() => dealPairs(this.r, pairs)), this.r, { present: onTable, turnAt, ice: this.ice, prefer: this.prefer });
        if (!dealt) throw new Error(`${table.name} cannot be dealt`);
        if (tries >= (swans ? 400 : 50) || wanted(dealt)) break;
      }
      this.sides = dealt.sides;
      this.plan = dealt.order; // the order the deal was made in, which wins
    }
    this.sideNames = turns ? [firstSide, firstSide === 'day' ? 'night' : 'day'] : [firstSide];
    this.present = onTable;
    // The swans still to be found, each [tile, its reflection], and those
    // found so far.
    this.swans = swans ? swansIn(table, this.mirror, this.sides[0], onTable) : null;
    this.swansFound = 0;
    // On the crown, the lords, 1 for a tile that is one, and the leaps
    // they have made: lords taken while held down by the usual rule.
    this.leaps = 0;
    if (lords) {
      this.lords = new Uint8Array(layout.count);
      for (const i of Array.isArray(lords) ? lords : chooseLords(table, this.sides[0], onTable, lords, seeded(seed ^ 0x6a09e667))) this.lords[i] = 1;
    }
    // On the bagpipes, the pipers, 1 for a tile that is one, and the tiles
    // that have followed them out.
    this.pipers = null;
    this.piped = 0;
    if (pipers) {
      this.pipers = new Uint8Array(layout.count);
      for (const i of Array.isArray(pipers) ? pipers : choosePipers(table, this.sides[0], onTable, pipers, seeded(seed ^ 0x510e527f), this.plan)) this.pipers[i] = 1;
    }
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
    // Eggs: tiles that start blocked, chosen at random from the seed, whose
    // faces aren't seen until they come free and hatch (1 while still an egg).
    this.eggs = null;
    if (eggs) {
      const blocked = [];
      for (let i = 0; i < n; i++) if (!this.isFree(i)) blocked.push(i);
      this.eggs = new Uint8Array(layout.count);
      for (const i of seeded(seed ^ 0x27d4eb2f).shuffle(blocked).slice(0, eggs)) this.eggs[i] = 1;
    }
    // Fresh milk: pails, each a pair of tiles, 'fresh' until 'taken', 'sour'
    // or 'spilt', with the match after which either of its tiles was free
    // and it began to keep, or null; and how many matches a pail keeps for.
    this.pails = null;
    this.keeps = 0;
    if (milk) {
      const tiles = milk.tiles ?? (this.plan ? choosePails(table, this.plan, milk.pails, seeded(seed ^ 0x7f4a7c15), milk.keeps) : []);
      this.pails = tiles.map((t) => ({ tiles: t.slice(), state: 'fresh', freeAt: null }));
      this.keeps = milk.keeps;
      this.age();
    }
  }

  // The fresh pail a tile is in, or -1.
  pailOf(i) {
    return this.pails ? this.pails.findIndex((p) => p.state === 'fresh' && p.tiles.includes(i)) : -1;
  }

  // The matches a fresh pail still keeps for, or null while neither of its
  // tiles is free.
  freshIn(k) {
    const p = this.pails[k];
    return p.freeAt === null ? null : p.freeAt + this.keeps - this.matches;
  }

  // On the board of the dancer, the matches until the music changes, and
  // whether there is anyone left to change partners with: a tile held down.
  get untilDance() {
    return this.rules.dance ? this.rules.dance - (this.matches % this.rules.dance) : Infinity;
  }

  get canDance() {
    for (let i = 0; i < this.layout.count; i++) if (this.present[i] && !this.isFree(i)) return true;
    return false;
  }

  // The music changes: each free tile dances off with a tile held down, and
  // they change places, so long as the board can still be won so (dance.js).
  // Returns { sides, swaps }, the faces before it and the tiles that changed
  // places, or null when there was no dance.
  dance() {
    const held = [];
    for (let i = 0; i < this.layout.count; i++) if (this.present[i] && !this.isFree(i)) held.push(i);
    const free = this.danceR.shuffle(this.freeTiles());
    if (!free.length || !held.length) return null;
    const changed = changePartners(this.layout, this.position(), free, held, this.danceR);
    if (!changed) return null;
    const sides = this.sides;
    this.sides = sides.map((s, k) => (k === this.side ? changed.faces : s));
    this.line = changed.line;
    this.outlook = 'win';
    return { sides, swaps: changed.swaps };
  }

  // The pails taken while fresh, those that soured, and those spilt.
  pailsIn(state) {
    return this.pails ? this.pails.filter((p) => p.state === state).length : 0;
  }

  get pailsTaken() {
    return this.pailsIn('taken');
  }

  // Pails with a tile come free begin to keep, and those that have kept as
  // long as they can sour. Returns the pails that soured.
  age() {
    const soured = [];
    for (const p of this.pails || []) {
      if (p.state !== 'fresh') continue;
      if (p.freeAt !== null && this.matches >= p.freeAt + this.keeps) {
        p.state = 'sour';
        soured.push(p);
      } else if (p.freeAt === null && p.tiles.some((t) => this.isFree(t))) p.freeAt = this.matches;
    }
    return soured;
  }

  // Whether a tile is still an egg, its face not yet seen.
  isEgg(i) {
    return Boolean(this.eggs) && this.eggs[i] === 1;
  }

  // The eggs still to hatch.
  get eggsLeft() {
    return this.eggs ? this.eggs.reduce((sum, e) => sum + e, 0) : 0;
  }

  // Eggs that have come free hatch, and stay hatched: an undo never puts a
  // tile back in its egg. Returns the tiles that hatched.
  hatch() {
    const out = [];
    if (this.eggs) {
      for (let i = 0; i < this.layout.count; i++) {
        if (this.eggs[i] && this.isFree(i)) {
          this.eggs[i] = 0;
          out.push(i);
        }
      }
    }
    return out;
  }

  // On the lake, whether a tile lies in the water: the swan's reflection.
  inLake(i) {
    return Boolean(this.mirror) && this.layout.y[i] >= this.layout.height / 2;
  }

  // The last pair taken, as its entry in the history, or null.
  lastMatch() {
    for (let k = this.history.length - 1; k >= 0; k--) if (this.history[k].type === 'match') return this.history[k];
    return null;
  }

  // Whether taking a tile now would follow on from the pair taken last, on
  // the board of geese: whether it lay beside or under one of its tiles.
  followsFrom(i) {
    const before = this.rules.goslings ? this.lastMatch() : null;
    return before !== null && followsOn(this.layout, [before.a, before.b], [i]);
  }

  // The rings turned to gold so far.
  get goldRings() {
    return this.rings ? this.rings.filter((r) => r.gold).length : 0;
  }

  // Rings whose every tile has now been taken turn to gold. Returns them,
  // by their places in the rings.
  gild() {
    const out = [];
    if (this.rings) {
      this.rings.forEach((r, k) => {
        if (!r.gold && r.tiles.every((t) => !this.present[t])) {
          r.gold = true;
          out.push(k);
        }
      });
    }
    return out;
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

  // Free whatever lies on them: ghosts, when they float, tiles opened with a
  // skeleton key, and lords, who leap. A tile floats only while its ghost
  // face is up.
  loose(i, faces = this.faces) {
    return this.unlocked[i] === 1 || (this.lords !== null && this.lords[i] === 1) || (this.rules.ghostsFloat && faces[i] === GHOST);
  }

  // On the crown, whether a tile is a lord still on the board, and how many
  // lords are.
  isLord(i) {
    return this.lords !== null && this.lords[i] === 1 && this.present[i] === 1;
  }

  get lordsLeft() {
    let n = 0;
    if (this.lords) for (let i = 0; i < this.layout.count; i++) if (this.isLord(i)) n++;
    return n;
  }

  // On the bagpipes, whether a tile is a piper still on the board, and how
  // many pipers are.
  isPiper(i) {
    return this.pipers !== null && this.pipers[i] === 1 && this.present[i] === 1;
  }

  get pipersLeft() {
    let n = 0;
    if (this.pipers) for (let i = 0; i < this.layout.count; i++) if (this.isPiper(i)) n++;
    return n;
  }

  // A piper among a pair just taken plays: the rest of his kind still on
  // the board follow him out, from wherever they are. Returns the tiles that
  // followed.
  pipe(a, b) {
    const piper = this.pipers ? [a, b].find((t) => this.pipers[t] === 1) : undefined;
    if (piper === undefined) return [];
    const kind = MATCH[this.faces[piper]];
    const out = [];
    for (let i = 0; i < this.layout.count; i++) if (this.present[i] && MATCH[this.faces[i]] === kind) out.push(i);
    for (const i of out) this.present[i] = 0;
    this.left -= out.length;
    this.piped += out.length;
    if (out.length === 2) this.follow(out[0], out[1]);
    else if (out.length) this.forget();
    return out;
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
  // checkout, bought, grab, touchdown, lovebirds, flock, hatched, gold }: the
  // treat the pair left, if any; whether this match struck midnight, and if
  // it did, the tiles that woke as lost souls; the tiles this match thawed;
  // the kind it crossed off the list, or null; and whether it was the match
  // at checkout; whether it bought a doorbuster; the tiles of the doorbuster
  // another shopper grabbed after it, or null; whether it was a touchdown;
  // whether it was a pair of lovebirds; whether its two tiles touched, and
  // flocked together; the eggs that hatched as it freed them; the rings it
  // took the last of, turning them to gold; whether it followed on from the
  // pair before it, as a gosling, and made a brood; whether it was a swan, a
  // tile and its reflection, and how many swans it sent swimming off; how
  // many pails of fresh milk it took, how many it spilt, and how many soured
  // after it; and the dance after it, if the music changed: { swaps,
  // before }, the tiles that changed places and the faces before, or
  // sitOut, when no change of partners would have left a board that can be
  // won, and they kept them; how many lords in it leapt; and the tiles that
  // followed a piper in it out. Null if the pair cannot be taken.
  match(a, b) {
    if (!this.canMatch(a, b)) return null;
    const giving = this.treatFaces.includes(this.faces[a]);
    const listed = this.onList(a);
    const kind = MATCH[this.faces[a]];
    const entry = { type: 'match', a, b, kind, giving, line: this.line && this.line.slice(), outlook: this.outlook };
    // On a board of turtle doves, a pair of the same kind as the match just
    // before it is a pair of lovebirds: a kind's two pairs, one straight
    // after the other.
    const before = this.lastMatch();
    const lovebirds = this.rules.lovebirds && before !== null && before.kind === kind;
    if (lovebirds) {
      this.lovebirds++;
      entry.lovebirds = true;
    }
    // On a board of songbirds, a pair whose two tiles touch flocks together.
    const flocked = this.rules.flock && touching(this.layout, a, b);
    if (flocked) {
      this.flocks++;
      entry.flock = true;
    }
    // On the board of geese, a pair taken beside or under the pair before it
    // follows on, as goslings follow their mother: so many in a line make a
    // brood, and a new line starts from the pair that made it.
    const gosling = Boolean(this.rules.goslings) && before !== null && followsOn(this.layout, [before.a, before.b], [a, b]);
    let brood = false;
    if (this.rules.goslings) {
      entry.trail = this.trail; // the line as it was, for an undo
      this.trail = gosling ? this.trail + 1 : 0;
      if (this.trail === this.rules.goslings) {
        brood = true;
        entry.brood = true;
        this.broods++;
        this.trail = 0;
      }
    }
    // On the crown, a lord taken while still held down by the usual rule
    // has leapt.
    const leapt = [a, b].filter((t) => this.isLord(t) && !isFree(this.layout, this.present, t)).length;
    if (leapt) {
      this.leaps += leapt;
      entry.leaps = leapt;
    }
    // On the milk pail, a fresh pail's two tiles taken together take the
    // pail; either taken with another tile spills it.
    if (this.pails) entry.pails = this.pails.map((p) => ({ ...p, tiles: p.tiles.slice() })); // as they were, for an undo
    const fresh = this.pails ? this.pails.filter((p) => p.state === 'fresh') : [];
    const milked = fresh.filter((p) => p.tiles.includes(a) && p.tiles.includes(b));
    const spilt = fresh.filter((p) => p.tiles.includes(a) !== p.tiles.includes(b));
    for (const p of milked) p.state = 'taken';
    for (const p of spilt) p.state = 'spilt';
    // On the lake, a tile and its own reflection that match are a swan:
    // taken together, she's found; a swan one of whose tiles goes with
    // another swims off.
    let swan = false;
    let swamOff = 0;
    if (this.swans) {
      entry.swans = this.swans; // as they were, for an undo
      swan = this.swans.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
      const left = this.swans.filter(([x, y]) => x !== a && x !== b && y !== a && y !== b);
      swamOff = this.swans.length - left.length - (swan ? 1 : 0);
      this.swans = left;
      if (swan) {
        this.swansFound++;
        entry.swan = true;
      }
    }
    if (listed) {
      entry.crossed = MATCH[this.faces[a]];
      this.crossed.push(entry.crossed);
    }
    // A pair with a tile of an open doorbuster in it buys that doorbuster.
    const bought = this.busters ? this.busters.filter((d) => d.state === 'open' && (d.tiles.includes(a) || d.tiles.includes(b))) : [];
    for (const d of bought) d.state = 'mine';
    if (bought.length) entry.bought = bought;
    // A pair with a tile in each end zone is a touchdown.
    const touchdown = Boolean(this.zones) && isTouchdown(this.zones, a, b);
    if (touchdown) {
      this.touchdowns++;
      entry.touchdown = true;
    }
    this.present[a] = this.present[b] = 0;
    this.left -= 2;
    this.matches++;
    if (this.matches === this.turnAt) entry.souls = this.wake();
    this.history.push(entry);
    this.follow(a, b);
    // On the bagpipes, a piper plays, and the rest of his kind follow him.
    const followers = this.pipe(a, b);
    if (followers.length) entry.followers = followers;
    const grab = this.grab();
    if (grab) entry.grab = grab;
    const gold = this.gild();
    if (gold.length) entry.gold = gold;
    const soured = this.age();
    // On the board of the dancer, every so many matches the music changes,
    // and the free tiles change partners.
    const due = Boolean(this.rules.dance) && this.left > 0 && this.matches % this.rules.dance === 0;
    const danced = due ? this.dance() : null;
    if (danced) entry.dance = danced;
    const sitOut = due && !danced && this.canDance; // no change of partners would leave a board that can be won
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
    const hatched = this.hatch();
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
      touchdown,
      lovebirds,
      flock: flocked,
      hatched,
      gold,
      gosling,
      brood,
      swan,
      swamOff,
      milked: milked.length,
      soured: soured.length,
      spilt: spilt.length,
      dance: danced && { swaps: danced.swaps, before: danced.sides[this.side] },
      sitOut,
      leapt,
      piped: followers,
    };
    this.emit('match', result);
    if (thawed.length) this.emit('thaw', result);
    if (listed) this.emit('list', result);
    if (checkout) this.emit('checkout', result);
    if (bought.length) this.emit('bought', result);
    if (grab) this.emit('grab', result);
    if (touchdown) this.emit('touchdown', result);
    if (lovebirds) this.emit('lovebirds', result);
    if (flocked) this.emit('flock', result);
    if (hatched.length) this.emit('hatch', result);
    if (gold.length) this.emit('gold', result);
    if (gosling) this.emit('gosling', result);
    if (swan || swamOff) this.emit('swan', result);
    if (milked.length || soured.length || spilt.length) this.emit('milk', result);
    if (danced || sitOut) this.emit('dance', result);
    if (leapt) this.emit('leap', result);
    if (followers.length) this.emit('pipe', result);
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
      if (last.touchdown) this.touchdowns--;
      if (last.lovebirds) this.lovebirds--;
      if (last.flock) this.flocks--;
      if (last.gold) for (const k of last.gold) this.rings[k].gold = false;
      if (last.trail !== undefined) this.trail = last.trail;
      if (last.brood) this.broods--;
      if (last.swans) this.swans = last.swans;
      if (last.swan) this.swansFound--;
      if (last.pails) this.pails = last.pails;
      if (last.dance) this.sides = last.dance.sides;
      if (last.leaps) this.leaps -= last.leaps;
      if (last.followers) {
        for (const t of last.followers) this.present[t] = 1;
        this.left += last.followers.length;
        this.piped -= last.followers.length;
      }
    } else if (last.type === 'save') {
      this.present[last.slot] = 0; // out of the fridge, and back on the table
      this.present[last.tile] = 1;
    } else {
      this.sides = last.sides;
      if (last.busterTiles) this.busters.forEach((d, k) => (d.tiles = last.busterTiles[k]));
      if (last.swans) this.swans = last.swans;
      if (last.pails) this.pails = last.pails;
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
  // both sides are dealt again. On the lake, the swans still to be found are
  // dealt again too, as many as there were, where they can be. False when no
  // shuffle can help, as with two tiles left one on top of the other.
  shuffle({ cat = false } = {}) {
    if ((cat && !this.treats.cat) || !this.left) return false;
    const swans = this.swans ? this.swans.length : 0;
    let dealt = null;
    for (let tries = 0; ; tries++) {
      const prefer = this.mirror ? plantSwans(this.mirror, swans, swanSteps(this.r, swans, this.left / 2)) : this.prefer;
      dealt = redeal(this.layout, this.sides, this.side, this.turnAt - this.matches, this.present, this.r, this.iceAhead(), prefer);
      if (!dealt || !this.mirror || tries >= 30 || swansIn(this.layout, this.mirror, dealt.sides[this.side], this.present).length === swans) break;
    }
    if (!dealt) return false;
    const busterTiles = this.busters && this.busters.map((d) => d.tiles.slice());
    const pails = this.pails && this.pails.map((p) => ({ ...p, tiles: p.tiles.slice() }));
    this.history.push({ type: 'shuffle', sides: this.sides, line: this.line && this.line.slice(), outlook: this.outlook, busterTiles, swans: this.swans, pails });
    this.sides = dealt.sides;
    if (this.swans) this.swans = swansIn(this.layout, this.mirror, this.faces, this.present);
    // The pails go with the milk: each fresh pail becomes a pair of the new
    // deal's order, one with a tile it had if it can, so that its two tiles
    // match again. It goes on keeping only if a tile of it is free.
    if (this.pails) {
      const order = dealt.order.slice();
      for (const p of this.pails) {
        if (p.state !== 'fresh') continue;
        const k = order.findIndex((q) => q.includes(p.tiles[0]) || q.includes(p.tiles[1]));
        p.tiles = order.splice(Math.max(0, k), 1)[0].slice();
        if (!p.tiles.some((t) => this.isFree(t))) p.freeAt = null;
      }
      this.age();
    }
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
      unlocked: this.lords ? Uint8Array.from(this.unlocked, (u, i) => u | this.lords[i]) : this.unlocked, // lords are as free as tiles opened with a key
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
