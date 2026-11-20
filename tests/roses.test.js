import { test, check, equal } from './run.js';
import { parseLayout, isFree } from '../js/engine/layout.js';
import { ROSES } from '../js/engine/layouts.js';
import { FACE, MATCH } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { rosesOf, roseState, inBloom, gathers, gather } from '../js/engine/roses.js';
import { seeded } from '../js/engine/rng.js';
import { POINTS, scoreOf } from '../js/score.js';

const BLOOM = { count: 12, every: 3, lasts: 6 };
const OPTIONS = { treats: false, ghostsFloat: false, roses: BLOOM };
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Roses');

// A pair that takes no rose, chosen at random.
const calm = (g, r) => r.pick(g.pairs().filter(([a, b]) => g.roseOf(a) < 0 && g.roseOf(b) < 0));

// A free tile of a tile's kind that is no rose, if one is.
const partner = (g, t) => g.freeTiles().find((u) => u !== t && g.roseOf(u) < 0 && MATCH[g.faces[u]] === MATCH[g.faces[t]]);

test("the roses are the top layer's tiles from the top down; a rose is in bud, then in bloom, then wilted, and taken, it's gathered, wasted or just a tile; and a way can be played to gather them", () => {
  // Three stacks of two: the top tiles are the roses, the lowest first.
  const L = parseLayout('stacks', ['#.#.#\n.....\n#.#..', '#.#.#']);
  equal(rosesOf(L, 3).map((t) => `${L.x[t]},${L.y[t]},${L.z[t]}`).join(' '), '0,0,1 4,0,1 8,0,1', 'the roses, in the order they open');
  equal(rosesOf(L, 2).length, 2, 'two roses of three');

  // Rose 1 opens after six matches, every three, and lasts for six.
  const states = [3, 5, 6, 11, 12, 20].map((m) => roseState(1, 0, m, 3, 6)).join(' ');
  equal(states, 'bud bud bloom bloom wilted wilted', 'rose 1 left on the board, after so many matches');
  const taken = [5, 6, 7, 12, 13].map((m) => roseState(1, m, m, 3, 6)).join(' ');
  equal(taken, 'wasted wasted gathered gathered wilted', 'rose 1 taken as the match given');

  // The deal tries the roses in bloom first, the buds last.
  const prefer = inBloom([10, 11, 12], 3, 6);
  equal(prefer([12, 1, 11, 2, 10], null, [[0, 0], [0, 0], [0, 0]]).join(), '10,1,2,12,11', 'after three matches: rose 0 in bloom first, roses 1 and 2 in bud last');
  equal(prefer([12, 1, 11, 2, 10], null, new Array(10).fill([0, 0])).join(), '11,12,1,2,10', 'after ten: roses 1 and 2 in bloom first, rose 0 wilted, with the rest');
  // An order takes each rose in bloom, or not.
  const order = [[1, 2], [3, 4], [5, 6], [10, 7], [8, 9]];
  check(gathers(order, [10], 3, 6), 'rose 0, taken as the fourth match, not gathered');
  check(!gathers(order, [10, 7], 3, 6), 'rose 1, taken as the fourth match, in bud, counted as gathered');
  check(gathers(order, [10, 7], 3, 6, 12), 'something asked of roses wilted before the order starts');

  // A row of four, its two middle tiles a rose and its partner: a way that
  // takes the rose late, played to take it as soon as it's in bloom.
  const row4 = parseLayout('row', ['####\n....\n####']);
  const faces = ['eyes-1', 'eyes-2', 'eyes-3', 'eyes-4', 'eyes-1', 'eyes-2', 'eyes-3', 'eyes-4'].map((k) => FACE[k]);
  const g = new Game(row4, { faces });
  const way = [[0, 4], [3, 7], [2, 6], [1, 5]];
  check(g.holds(way), 'the way given does not win');
  const board = { L: row4, present: g.present, free: (p, t) => p[t] === 1 && isFree(row4, p, t), kindOf: (t) => MATCH[g.faces[t]], holds: (l) => g.holds(l), matches: 1, roses: [5], every: 1, lasts: 2 };
  const played = gather(way, board);
  check(played && g.holds(played) && played.findIndex((p) => p.includes(5)) === 1, `the rose not taken in bloom: ${JSON.stringify(played)}`);
});

test("the vase's deal takes each of its twelve roses, free from the start, while it's in bloom: following the hints gathers all twelve", () => {
  for (let seed = 1; seed <= 60; seed++) {
    const g = new Game(ROSES, { seed, ...OPTIONS });
    equal(g.roses.length, 12, `seed ${seed}: roses`);
    check(g.roses.every((t) => g.isFree(t) && ROSES.z[t] === ROSES.depth - 1), `seed ${seed}: a rose not free on top`);
    check(g.roses.every((t, k) => k === 0 || ROSES.y[t] >= ROSES.y[g.roses[k - 1]]), `seed ${seed}: the roses not from the top down`);
    check(gathers(g.plan, g.roses, 3, 6), `seed ${seed}: the deal's own order doesn't gather every rose`);
    while (g.left) g.match(...g.suggest());
    check(g.won, `seed ${seed}: following the hints, not cleared`);
    equal(g.bouquet, 12, `seed ${seed}: roses gathered, following the hints`);
    equal(row(g)[2], 12 * POINTS.rose, `seed ${seed}: what the roses score`);
  }
  return '60 deals';
});

test('a rose opens every three matches from the third; taken in bloom it joins the bouquet, taken in bud it is wasted, and left six matches it wilts; and an undo takes each back', () => {
  // Opening and gathering, following the hints.
  const g = new Game(ROSES, { seed: 3, ...OPTIONS });
  const results = [1, 2, 3].map(() => g.match(...g.suggest()));
  check(!results[0].opened.length && !results[1].opened.length && results[2].opened.join() === `${g.roses[0]}`, 'the first rose not opening as the third match is made');
  check(g.roseState(0) === 'bloom' && g.bloomLeft(0) === 6 && g.roseState(1) === 'bud' && g.opensIn(1) === 3, 'the first rose not in bloom for six, or the second not in bud for three');
  const gathered = g.match(...g.suggest());
  check(gathered.gathered.join() === `${g.roses[0]}` && g.bouquet === 1, 'following the hints, the first rose not gathered');
  equal(row(g)[1], '1 of 12 in the bouquet', 'a rose gathered, told');
  g.undo();
  check(g.roseState(0) === 'bloom' && g.bouquet === 0, 'an undo did not take the rose back');
  g.undo();
  check(g.roseState(0) === 'bud', 'an undo did not close the rose again');

  // A rose taken in bud is wasted.
  let waste = null;
  for (let seed = 1; seed <= 20 && !waste; seed++) {
    const h = new Game(ROSES, { seed, ...OPTIONS });
    const t = h.roses.find((r) => partner(h, r) !== undefined);
    if (t !== undefined) waste = { h, t, result: h.match(t, partner(h, t)) };
  }
  check(waste, 'no rose in bud could be taken');
  const { h, t, result } = waste;
  check(result.wasted.join() === `${t}` && h.rosesIn('wasted') === 1 && !h.bouquet, 'a rose taken in bud not wasted');
  equal(row(h)[1], '0 of 12 in the bouquet, 1 wasted in bud', 'a rose wasted, told');
  h.undo();
  check(h.roseState(h.roses.indexOf(t)) === 'bud' && h.rosesIn('wasted') === 0, 'an undo did not put the bud back');

  // A rose left in bloom wilts after six matches, and is just a tile after.
  let wilt = null;
  for (let seed = 1; seed <= 20 && !wilt; seed++) {
    const k = new Game(ROSES, { seed, ...OPTIONS });
    const r = seeded(seed);
    let last = null;
    for (let m = 0; m < 9 && k.pairs().some(([a, b]) => k.roseOf(a) < 0 && k.roseOf(b) < 0); m++) last = k.match(...calm(k, r));
    if (k.matches === 9) wilt = { k, last };
  }
  check(wilt, 'no deal left nine matches without its roses');
  const { k, last } = wilt;
  check(last.wilted.join() === `${k.roses[0]}` && last.opened.join() === `${k.roses[2]}` && k.roseState(0) === 'wilted', 'the first rose not wilting as the ninth match is made, or the third not opening');
  const late = partner(k, k.roses[0]);
  if (late !== undefined) {
    const after = k.match(k.roses[0], late);
    check(!after.gathered.length && !after.wasted.length && k.roseState(0) === 'wilted', 'a wilted rose taken counted as gathered or wasted');
    k.undo();
  }
  k.undo();
  check(k.roseState(0) === 'bloom' && k.bloomLeft(0) === 1, 'an undo did not bring the rose back into bloom');

  const plain = new Game(ROSES, { seed: 3, treats: false });
  check(plain.roses === null && plain.roseOf(0) === -1 && plain.bouquet === 0 && !row(plain), 'a board without roses has them');
});

test("a shuffle keeps the roses where they are and deals again so that each still to gather can be, and an undo puts it back; after pairs of a player's own, the hints still gather most roses; a board reached the same way has the same roses", () => {
  const g = new Game(ROSES, { seed: 9, ...OPTIONS });
  for (let m = 0; m < 4; m++) g.match(...g.suggest());
  const before = JSON.stringify(g.faces);
  const roses = g.roses.slice();
  check(g.shuffle(), 'no shuffle');
  check(g.roses.join() === roses.join() && gathers(g.line, g.roses, 3, 6, g.matches), "after a shuffle, the roses moved, or the hints' way doesn't gather them");
  g.undo();
  equal(JSON.stringify(g.faces), before, 'the tiles, after an undo of the shuffle');
  g.shuffle();
  while (g.left) g.match(...g.suggest());
  equal(g.bouquet, 12, 'roses gathered, following the hints after a shuffle');

  // Six pairs of a player's own, none a rose, and then the hints.
  let gathered = 0;
  let boards = 0;
  for (let seed = 1; seed <= 40; seed++) {
    const h = new Game(ROSES, { seed, ...OPTIONS });
    const r = seeded(seed * 7919 + 13);
    for (let m = 0; m < 6; m++) h.match(...calm(h, r));
    if (!h.wayAhead()) continue; // the board itself lost
    boards++;
    while (h.left) h.match(...h.suggest());
    gathered += h.bouquet;
  }
  check(gathered / (boards * 12) > 0.8, `after six pairs of a player's own, the hints gathered only ${gathered} of ${boards * 12}`);

  for (const seed of [1, 2, 3, 4]) {
    const play = () => {
      const k = new Game(ROSES, { seed, ...OPTIONS });
      const r = seeded(seed * 13);
      const seen = [];
      k.on('rose', (e) => seen.push(`${k.matches}:${e.gathered}/${e.wasted}/${e.opened}/${e.wilted}`));
      while (k.left && k.pairs().length) {
        if (k.matches === 10) k.hint();
        if (k.matches === 20) k.shuffle();
        k.match(...r.pick(k.pairs()));
      }
      return seen.join(' ');
    };
    equal(play(), play(), `seed ${seed}: the roses, played the same way twice`);
  }
  return `after six pairs of a player's own, the hints gathered ${gathered} of ${boards * 12} roses on ${boards} boards still to be won`;
});
