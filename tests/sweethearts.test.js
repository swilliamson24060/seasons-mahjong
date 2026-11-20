import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { ENVELOPE } from '../js/engine/layouts.js';
import { FACE, MATCH } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { MESSAGES, CANDY, shows, placeMessages, mend } from '../js/engine/sweethearts.js';
import { isFree } from '../js/engine/layout.js';
import { seeded } from '../js/engine/rng.js';
import { POINTS, scoreOf } from '../js/score.js';

const OPTIONS = { treats: false, ghostsFloat: false, sweethearts: true };
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Sweet nothings');
const at = (way, t) => way.findIndex((p) => p.includes(t));
const together = (way, [x, y]) => Math.abs(at(way, x) - at(way, y)) === 1;
const tileAt = (L, x, y, z) => [...L.x.keys()].find((i) => L.x[i] === x && L.y[i] === y && L.z[i] === z);

// The halves still to take, each its tile, of messages waiting or begun.
const halves = (g) => g.messages.flatMap((m) => (m.state === 'waiting' ? m.tiles : m.state === 'begun' ? [m.tiles[1 - m.first]] : []));

// A pair that takes no half of a message, chosen at random.
const calm = (g, r) => r.pick(g.pairs().filter(([a, b]) => !g.wordOn(a) && !g.wordOn(b)));

// A message's half, taken with a tile of its kind that is free, if both are.
function halfPair(g, t) {
  if (!g.isFree(t)) return null;
  const u = g.freeTiles().find((v) => v !== t && MATCH[g.faces[v]] === MATCH[g.faces[t]]);
  return u === undefined ? null : [t, u];
}

test("a candy heart shows on a tile with nothing on it and nothing raised in the row above, where it peeks over the tile's top; messages go on two pairs taken one after the other, of kinds of their own; and a way can be mended to say one", () => {
  // A raised tile in the row above hides the top of the tile below it; one
  // on the same layer doesn't; and the board's own top row, unless lifted
  // no higher than two layers below the top, would have it cut off.
  const steps = parseLayout('steps', ['##\n##\n#.', '..\n#.']);
  const all = new Uint8Array(steps.count).fill(1);
  const [low, under, high] = [tileAt(steps, 0, 4, 0), tileAt(steps, 0, 2, 0), tileAt(steps, 0, 2, 1)];
  check(!shows(steps, all, low), "a heart counted as showing below a raised tile's edge");
  check(!shows(steps, all, under) && shows(steps, all, high), 'a heart counted as showing under a tile, or not on top');
  const flat = parseLayout('flat', ['#\n#']);
  check(shows(flat, new Uint8Array(2).fill(1), tileAt(flat, 0, 2, 0)), 'a heart hidden by a tile on its own layer above it');
  check(!shows(flat, new Uint8Array(2).fill(1), tileAt(flat, 0, 0, 0)), "a heart counted as showing over the board's top edge");

  // Two messages on an order of five pairs, the first pair's kind used
  // already: on pairs 1 and 2 and pairs 3 and 4, of four kinds.
  const order = [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9]];
  const kinds = [7, 7, 1, 1, 2, 2, 3, 3, 4, 4];
  const placed = placeMessages(order, (t) => kinds[t], () => true, 2, seeded(1), { used: new Set([7]) });
  equal(placed.map((tiles) => tiles.map((t) => at(order, t)).join('+')).join(' '), '1+2 3+4', 'where two messages go');
  equal(placeMessages(order, (t) => kinds[t], () => true, 3, seeded(1)).length, 2, 'three messages on five pairs, without loose');
  equal(placeMessages(order, (t) => kinds[t], () => true, 2, seeded(1), { used: new Set([1, 2, 3]), loose: true }).length, 1, 'loose, on what is left');

  // Two rows of three: a way taking a message's halves, on tiles 0 and 1,
  // apart, mended to take them together, once the middle is free.
  const rows = parseLayout('rows', ['###.###']);
  const faces = ['eyes-1', 'eyes-2', 'eyes-3', 'eyes-3', 'eyes-2', 'eyes-1'].map((k) => FACE[k]);
  const g = new Game(rows, { faces });
  const way = [[0, 5], [2, 3], [1, 4]];
  check(g.holds(way), 'the way given does not win');
  const board = { present: g.present, free: (p, t) => p[t] === 1 && isFree(rows, p, t), kindOf: (t) => MATCH[g.faces[t]], holds: (l) => g.holds(l) };
  const mended = mend(way, [{ words: ['BE', 'MINE'], tiles: [0, 1], state: 'waiting', first: -1 }], board);
  check(together(mended, [0, 1]) && g.holds(mended), `the way, mended, does not say the message: ${JSON.stringify(mended)}`);
  // Begun, its other half's pair goes first.
  const begun = mend(way, [{ words: ['BE', 'MINE'], tiles: [2, 1], state: 'begun', first: 0 }], board);
  check(begun[0].includes(1) || !g.isFree(1), 'the half still to take of a message begun not first');
});

test("the envelope's deal puts four sweet nothings on two pairs each, taken one straight after the other in its own order, spread through it, every heart showing, every half of a kind of its own: following the hints says all four", () => {
  const firsts = [[], [], [], []];
  let dug = 0;
  for (let seed = 1; seed <= 60; seed++) {
    const g = new Game(ENVELOPE, { seed, ...OPTIONS });
    equal(g.messages.map((m) => m.words.join(' ')).join(', '), MESSAGES.map((w) => w.join(' ')).join(', '), `seed ${seed}: the messages`);
    const kinds = halves(g).map((t) => MATCH[g.faces[t]]);
    equal(new Set(kinds).size, 8, `seed ${seed}: halves of a kind`);
    check(!kinds.includes(CANDY), `seed ${seed}: a half on a candy heart's own tile`);
    g.messages.forEach((m, k) => {
      const [i, j] = m.tiles.map((t) => at(g.plan, t));
      equal(j, i + 1, `seed ${seed}: ${m.words.join(' ')}'s pairs in the deal's own order`);
      check(m.tiles.every((t) => shows(ENVELOPE, g.present, t)), `seed ${seed}: ${m.words.join(' ')}'s heart hidden`);
      firsts[k].push(i);
      if (!(halfPair(g, m.tiles[0]) && halfPair(g, m.tiles[1]))) dug++;
    });
    while (g.left) g.match(...g.suggest());
    check(g.won, `seed ${seed}: following the hints, not cleared`);
    equal(g.messagesSaid, 4, `seed ${seed}: messages said, following the hints`);
    equal(row(g)[2], 4 * POINTS.message, `seed ${seed}: what the sweet nothings score`);
  }
  const mean = firsts.map((a) => a.reduce((s, v) => s + v, 0) / a.length);
  check(mean.every((v, k) => k === 0 || v > mean[k - 1] + 5), `the messages not spread through the deal's order: ${mean.map((v) => v.toFixed(1)).join(', ')}`);
  check(dug / 240 > 0.65, `only ${dug} of 240 messages had to be dug for`);
  return `60 deals; the messages' first pairs ${mean.map((v) => v.toFixed(0)).join(', ')} on average; ${dug} of 240 dug for, the rest ready to say from the start`;
});

test('the pair with half a message begins it; the pair with the other half, straight after, either first, says it; anything else taken first leaves it unsaid; and an undo takes each back', () => {
  // Said, following the hints to it.
  const g = new Game(ENVELOPE, { seed: 3, ...OPTIONS });
  const heard = [];
  g.on('message', (r) => heard.push(r));
  while (!g.messagesSaid) g.match(...g.suggest());
  const said = g.messages.find((m) => m.state === 'said');
  const [begin, end] = heard.slice(-2);
  check(begin.begun && begin.begun.words.join() === said.words.join() && end.said && end.said.join() === said.words.join(), 'the message not begun and then said');
  equal(row(g)[1], '1 of 4 said', 'a sweet nothing said, told');
  g.undo();
  const back = g.messages.find((m) => m.words.join() === said.words.join());
  check(back.state === 'begun' && g.messagesSaid === 0 && g.awaited(back.tiles[1 - back.first]), 'an undo did not take the message back to begun');
  g.undo();
  check(g.messages.find((m) => m.words.join() === said.words.join()).state === 'waiting', 'a second undo did not take the message back to waiting');

  // Either half first: a message whose two pairs can both be taken, its
  // second word's taken first.
  let either = null;
  for (let seed = 1; seed <= 40 && !either; seed++) {
    const h = new Game(ENVELOPE, { seed, ...OPTIONS });
    for (const m of h.messages) {
      const [p, q] = [halfPair(h, m.tiles[1]), halfPair(h, m.tiles[0])];
      if (p && q) {
        either = { h, m, p, q };
        break;
      }
    }
  }
  check(either, 'no message ready to say from the start');
  const { h, m, p, q } = either;
  const first = h.match(...p);
  check(first.begun && first.begun.first === 1 && h.awaited(m.tiles[0]) && h.wordOn(m.tiles[0]) === m.words[0], "its second word's pair taken first did not begin it");
  check(h.match(...q).said && h.messagesSaid === 1, 'its first word straight after did not say it');

  // Unsaid: the same message begun on the same deal, and another pair taken.
  const k = new Game(ENVELOPE, { seed: h.seed, ...OPTIONS });
  const n = k.messages[h.messages.indexOf(m)];
  k.match(...halfPair(k, n.tiles[0]));
  const between = calm(k, seeded(5));
  const result = k.match(...between);
  check(result.unsaid && result.unsaid.join() === n.words.join() && n.state === 'unsaid', 'another pair taken between did not leave the message unsaid');
  check(k.wordOn(n.tiles[1]) === null && !k.awaited(n.tiles[1]), "the unsaid message's other half still carries its heart");
  equal(row(k)[1], '0 of 4 said, 1 unsaid', 'a sweet nothing unsaid, told');
  k.undo();
  check(k.messages.find((x) => x.words.join() === n.words.join()).state === 'begun' && k.awaited(n.tiles[1]), 'an undo did not take the message back to begun');

  const plain = new Game(ENVELOPE, { seed: 3, treats: false });
  check(plain.messages === null && plain.wordOn(0) === null && !plain.awaited(0) && plain.messagesSaid === 0 && !row(plain), 'a board without sweethearts has them');
});

test("a shuffle puts the messages on the new deal, a message begun to be said next, and an undo puts them back; after pairs of the player's own, the hints still say nearly every message; a board reached the same way has the same hearts", () => {
  // A message begun, and the board shuffled.
  const g = new Game(ENVELOPE, { seed: 9, ...OPTIONS });
  const m = g.messages.find((x) => halfPair(g, x.tiles[0]));
  g.match(...halfPair(g, m.tiles[0]));
  const before = JSON.stringify(g.messages);
  check(g.shuffle(), 'no shuffle');
  const begun = g.messages.find((x) => x.state === 'begun');
  const next = begun.tiles[1 - begun.first];
  check(begun.words.join() === m.words.join() && g.line[0].includes(next) && g.isFree(next), 'after a shuffle, the message begun cannot be said next');
  const kinds = halves(g).map((t) => MATCH[g.faces[t]]);
  check(new Set(kinds).size === kinds.length && !kinds.includes(CANDY), 'after a shuffle, two halves of a kind, or a half on a candy heart');
  const way = g.wayAhead();
  check(way[0].includes(next) && g.messages.filter((x) => x.state === 'waiting').every((x) => together(way, x.tiles)), "after a shuffle, the hints' way doesn't say every message");
  g.match(...g.suggest());
  equal(g.messagesSaid, 1, 'the message begun, said straight after the shuffle');
  g.undo();
  g.undo();
  equal(JSON.stringify(g.messages), before, 'the messages, after an undo of the shuffle');

  // Six pairs of a player's own, none with a half, and then the hints.
  let said = 0;
  let boards = 0;
  for (let seed = 1; seed <= 40; seed++) {
    const h = new Game(ENVELOPE, { seed, ...OPTIONS });
    const r = seeded(seed * 7919 + 13);
    for (let k = 0; k < 6; k++) h.match(...calm(h, r));
    if (!h.wayAhead()) continue; // the board itself lost
    boards++;
    while (h.left) h.match(...h.suggest());
    said += h.messagesSaid;
  }
  check(said / (boards * 4) > 0.9, `after six pairs of a player's own, the hints said only ${said} of ${boards * 4}`);

  for (const seed of [1, 2, 3, 4]) {
    const play = () => {
      const k = new Game(ENVELOPE, { seed, ...OPTIONS });
      const r = seeded(seed * 13);
      const seen = [JSON.stringify(k.messages)];
      k.on('message', (e) => seen.push(JSON.stringify(e.said || e.unsaid || e.begun)));
      while (k.left && k.pairs().length) {
        if (k.matches === 10) k.hint();
        if (k.matches === 20) k.shuffle();
        k.match(...r.pick(k.pairs()));
      }
      return seen.join(' | ');
    };
    equal(play(), play(), `seed ${seed}: the hearts, played the same way twice`);
  }
  return `after six pairs of a player's own, the hints said ${said} of ${boards * 4} messages on ${boards} boards still to be won`;
});
