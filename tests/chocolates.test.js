import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { CHOCOLATES } from '../js/engine/layouts.js';
import { MATCH } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { chocolatesOf, eat, oneAtATime, savoursAll } from '../js/engine/chocolates.js';
import { seeded } from '../js/engine/rng.js';
import { POINTS, scoreOf } from '../js/score.js';

const OPTIONS = { treats: false, ghostsFloat: false, chocolates: true };
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Chocolates');
const tileAt = (L, x, y, z) => [...L.x.keys()].find((i) => L.x[i] === x && L.y[i] === y && L.z[i] === z);

// The top of a chocolate still whole, if a tile is one.
const wholeTop = (g, t) => g.chocolates.some((c, k) => c.top === t && g.chocolateStates[k] === 'whole');

test('a chocolate is a top with the tiles under it; a top taken bites into it, and its last tiles taken savour it, unless another is bitten into first; a deal can be made to eat them one at a time', () => {
  // Two chocolates, each a top on a chocolate on a cup of two tiles, and a
  // row of four walls.
  const L = parseLayout('box', ['##.##\n.....\n####.', '+..+.', '+..+.']);
  const cs = chocolatesOf(L);
  const at = (x, y, z) => tileAt(L, x, y, z);
  equal(JSON.stringify(cs), JSON.stringify([
    { top: at(1, 1, 2), tiles: [at(1, 1, 2), at(1, 1, 1), at(0, 0, 0), at(2, 0, 0)] },
    { top: at(7, 1, 2), tiles: [at(7, 1, 2), at(7, 1, 1), at(6, 0, 0), at(8, 0, 0)] },
  ]), 'the chocolates');
  const [a, b] = cs;
  const walls = [at(0, 4, 0), at(2, 4, 0), at(4, 4, 0), at(6, 4, 0)];
  const order = [[a.top, walls[0]], [a.tiles[1], walls[1]], [a.tiles[2], a.tiles[3]], [b.top, walls[2]], [b.tiles[1], walls[3]], [b.tiles[2], b.tiles[3]]];
  // Played through, one at a time: each bitten, then savoured.
  let states = ['whole', 'whole'];
  const gone = new Set();
  const told = order.map((pair) => {
    for (const t of pair) gone.add(t);
    const r = eat(cs, states, pair, (t) => gone.has(t));
    states = r.states;
    return `${r.bitten.join('+') || '-'}/${r.savoured}/${r.eaten.join('+') || '-'}`;
  });
  equal(told.join(' '), '0/-1/- -/-1/- -/0/- 1/-1/- -/-1/- -/1/-', 'what each pair did: bitten / savoured / eaten');
  check(savoursAll(order, cs), 'eaten one at a time, not savoured');
  // Biting into the second before the first is finished leaves it eaten.
  const r = eat(cs, ['bitten', 'whole'], [b.top, walls[2]], (t) => [a.top, b.top, walls[2]].includes(t));
  equal(`${r.states} ${r.bitten} ${r.eaten}`, 'eaten,bitten 1 0', 'a second chocolate bitten into before the first is eaten');
  check(!savoursAll([order[0], order[3], order[1], order[2], order[4], order[5]], cs), 'eaten two at a time, counted as savoured');
  equal(eat(cs, ['whole', 'whole'], [a.top, b.top], () => false).states.join(), 'eaten,eaten', 'two bitten into at once');
  // The deal tries the chocolate bitten into first, and with none, a top.
  const prefer = oneAtATime(cs);
  const all = new Uint8Array(L.count).fill(1);
  equal(prefer([walls[0], b.top, a.top, walls[1]], all).join(), [b.top, walls[0], walls[1], a.top].join(), 'with none bitten into, one top first');
  const bitten = Uint8Array.from(all);
  bitten[a.top] = 0;
  equal(prefer([walls[0], b.top, a.tiles[1]], bitten).join(), [a.tiles[1], walls[0], b.top].join(), 'with one bitten into, its tiles first and the tops last');
});

test("the box's deal eats its nine chocolates, six tiles each, one at a time in its own order: following the hints savours all nine", () => {
  for (let seed = 1; seed <= 60; seed++) {
    const g = new Game(CHOCOLATES, { seed, ...OPTIONS });
    equal(g.chocolates.map((c) => c.tiles.length).join(), '6,6,6,6,6,6,6,6,6', `seed ${seed}: the chocolates' tiles`);
    check(g.chocolates.every((c) => g.isFree(c.top)), `seed ${seed}: a chocolate's top not free at the start`);
    check(savoursAll(g.plan, g.chocolates), `seed ${seed}: the deal's own order doesn't savour every chocolate`);
    while (g.left) g.match(...g.suggest());
    check(g.won, `seed ${seed}: following the hints, not cleared`);
    equal(g.chocolatesIn('savoured'), 9, `seed ${seed}: chocolates savoured, following the hints`);
    equal(row(g)[2], 9 * POINTS.savoured, `seed ${seed}: what the chocolates score`);
  }
  return '60 deals';
});

test('a top taken bites into its chocolate; eaten whole, cup and all, it is savoured; another bitten into first leaves it just eaten; and an undo takes each back', () => {
  // Savoured, following the hints.
  const g = new Game(CHOCOLATES, { seed: 3, ...OPTIONS });
  let bite = null;
  while (!bite) {
    const r = g.match(...g.suggest());
    if (r.bitten.length) bite = r;
  }
  const k = bite.bitten[0];
  check(bite.bitten.length === 1 && g.openChocolate === k && !g.present[g.chocolates[k].top], 'a top taken did not bite into its chocolate');
  let done = null;
  while (!done) {
    const r = g.match(...g.suggest());
    check(!r.bitten.length || r.savoured === k, 'the hints bit into another before finishing the first');
    if (r.savoured >= 0) done = r;
  }
  check(done.savoured === k && g.chocolateStates[k] === 'savoured' && g.openChocolate === -1, 'eaten whole, the chocolate not savoured');
  equal(row(g)[1], '1 of 9 savoured', 'a chocolate savoured, told');
  g.undo();
  check(g.chocolateStates[k] === 'bitten' && g.chocolatesIn('savoured') === 0, 'an undo did not take the chocolate back');

  // Just eaten: one bitten into, and then another.
  const h = new Game(CHOCOLATES, { seed: 5, ...OPTIONS });
  let first = -1;
  while (first < 0) {
    const r = h.match(...h.suggest());
    if (r.bitten.length) first = r.bitten[0];
  }
  const other = h.pairs().find(([x, y]) => wholeTop(h, x) !== wholeTop(h, y));
  check(other, 'no other chocolate could be bitten into');
  const r = h.match(...other);
  const second = h.chocolates.findIndex((c) => other.includes(c.top));
  check(r.eaten.join() === `${first}` && r.bitten.join() === `${second}` && h.chocolateStates[first] === 'eaten' && h.openChocolate === second, 'another bitten into did not leave the first just eaten');
  equal(row(h)[1], '0 of 9 savoured, 1 just eaten', 'a chocolate just eaten, told');
  h.undo();
  check(h.chocolateStates[first] === 'bitten' && h.chocolateStates[second] === 'whole', 'an undo did not put the bite back');

  const plain = new Game(CHOCOLATES, { seed: 3, treats: false });
  check(plain.chocolates === null && plain.chocolateOf(0) === -1 && plain.openChocolate === -1 && !row(plain), 'a board without chocolates has them');
});

test("a shuffle deals again so that the chocolates still to eat can be savoured, and an undo puts it back; after pairs of a player's own, the hints savour what they can; a board reached the same way eats the same chocolates", () => {
  const g = new Game(CHOCOLATES, { seed: 9, ...OPTIONS });
  for (let m = 0; m < 5; m++) g.match(...g.suggest());
  const [faces, states] = [JSON.stringify(g.faces), g.chocolateStates.join()];
  check(g.shuffle(), 'no shuffle');
  check(g.chocolateStates.join() === states && savoursAll(g.line, g.chocolates, g.chocolateStates, g.present), "after a shuffle, the chocolates changed, or the hints' way doesn't savour them");
  g.undo();
  equal(JSON.stringify(g.faces), faces, 'the tiles, after an undo of the shuffle');
  g.shuffle();
  while (g.left) g.match(...g.suggest());
  equal(g.chocolatesIn('savoured'), 9, 'chocolates savoured, following the hints after a shuffle');

  // Six pairs of a player's own, all of them the box's walls, and then the
  // hints: the walls taken were partners the chocolates needed.
  let savoured = 0;
  let boards = 0;
  for (let seed = 1; seed <= 30; seed++) {
    const h = new Game(CHOCOLATES, { seed, ...OPTIONS });
    const r = seeded(seed * 7919 + 13);
    for (let m = 0; m < 6; m++) {
      const walls = h.pairs().filter(([x, y]) => h.chocolateOf(x) < 0 && h.chocolateOf(y) < 0);
      if (walls.length) h.match(...r.pick(walls));
    }
    if (!h.wayAhead()) continue; // the board itself lost
    boards++;
    while (h.left) h.match(...h.suggest());
    savoured += h.chocolatesIn('savoured');
  }
  check(savoured / (boards * 9) > 0.5, `after six pairs of a player's own, the hints savoured only ${savoured} of ${boards * 9}`);

  for (const seed of [1, 2, 3, 4]) {
    const play = () => {
      const k = new Game(CHOCOLATES, { seed, ...OPTIONS });
      const r = seeded(seed * 13);
      const seen = [];
      k.on('chocolate', (e) => seen.push(`${k.matches}:${e.bitten}/${e.savoured}/${e.eaten}`));
      while (k.left && k.pairs().length) {
        if (k.matches === 10) k.hint();
        if (k.matches === 20) k.shuffle();
        k.match(...r.pick(k.pairs()));
      }
      return seen.join(' ');
    };
    equal(play(), play(), `seed ${seed}: the chocolates, played the same way twice`);
  }
  return `after six pairs of the walls, the hints savoured ${savoured} of ${boards * 9} chocolates on ${boards} boards still to be won`;
});
