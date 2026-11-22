import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { TRAY, RAINBOW } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { seedlingsOf, plotOf, waters, tendIn, tending, bloomsIn } from '../js/engine/watering.js';
import { seeded } from '../js/engine/rng.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SHOWERS, showerOf } from '../js/showers.js';

const FIFTH = SHOWERS[4];
const OPTIONS = dayOptions(FIFTH);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Blooms');
const facesOf = (...keys) => keys.map((key) => FACE[key]);

// A little bed: a seedling in the middle of a row of three, with a leaf
// above it and one below, two tiles apart at the end of the row, and one
// more below them. Tile 0 is the leaf above, 1 to 3 the row, 2 the
// seedling, 4 and 5 the tiles apart, 6 the leaf below and 7 the tile below.
const BED = parseLayout('bed', ['.#....\n###.##\n.#....\n....#.']);

test('a pair with a tile touching a seedling waters it, and watered three times it blooms; a bloom taken is picked, and a seedling taken before it blooms is pulled up; and an undo takes each back', () => {
  const [s] = seedlingsOf(BED, [[1, 1, 0]]);
  equal(s, 2, 'the seedling');
  equal([0, 1, 2, 3, 4, 5, 6].map((i) => plotOf(BED, i, [s])).join(), 'leaf,leaf,seedling,leaf,soil,rim,leaf', "the tiles' plots, the last at the bed's edge");
  check(waters(BED, s, 1, 4) && waters(BED, s, 0, 6) && !waters(BED, s, 4, 5) && !waters(BED, s, 2, 1), 'which pairs water the seedling');
  equal(JSON.stringify(tendIn(BED, [[0, 4], [1, 5], [3, 6], [2, 5]], [s], 3)), JSON.stringify({ water: [3], taken: ['picked'] }), 'the tray, after an order that waters and then picks');
  equal(bloomsIn(BED, [[1, 4], [2, 5], [0, 6], [3, 4]], [s], 3), 0, 'blooms picked, the seedling taken too soon');

  // Two pairs of leaves with the tiles apart, a third, and then the bloom
  // with its partner.
  const faces = facesOf('eyes-1', 'eyes-2', 'eyes-3', 'eyes-4', 'eyes-1', 'eyes-2', 'eyes-4', 'eyes-3');
  const g = new Game(BED, { faces, watering: { seedlings: [[1, 1, 0]], drinks: 3 } });
  const heard = [];
  g.on('garden', (e) => heard.push(`${e.watered.length}/${e.blossomed.length}/${e.picked.length}/${e.pulled.length}`));
  const k = g.seedlingOf(2);
  check(k === 0 && g.thirst(0) === 3 && !g.bloomed(0) && !g.isFree(2), 'the seedling at the start');
  g.match(0, 4);
  check(g.thirst(0) === 2 && g.isFree(2) === false, 'a watering');
  g.match(1, 5);
  check(g.thirst(0) === 1 && g.isFree(2), 'a second watering, its side open');
  g.match(3, 6);
  check(g.bloomed(0) && g.thirst(0) === 0, 'not in bloom after three waterings');
  g.match(2, 7);
  check(g.won && g.seedlingsIn('picked') === 1, 'the bloom not picked');
  equal(heard.join(' '), '1/0/0/0 1/0/0/0 1/1/0/0 0/0/1/0', 'the tray, heard');
  equal(row(g)[1], '1 of 1 picked', 'the blooms, told');
  equal(row(g)[2], POINTS.bloom, 'what a bloom picked scores');
  g.undo();
  g.undo();
  check(g.seedlingsIn('picked') === 0 && g.thirst(0) === 1, 'an undo did not take back a pick, or a watering');
  // Taken now, a watering short, it's pulled up.
  g.match(2, 7);
  check(g.seedlingsIn('pulled') === 1 && g.seedlingsIn('picked') === 0, 'a seedling taken before it bloomed not pulled up');
  equal(row(g)[1], '0 of 1 picked, 1 pulled up', 'the blooms, told, one pulled up');

  const plain = new Game(BED, { faces });
  check(!plain.garden && plain.seedlingOf(2) === -1 && !plain.match(0, 4).watered.length && !row(plain), 'a board without seedlings waters them');
});

test('a deal tending the tray tries first the seedlings in bloom, then the leaves of those still growing, a leaf of each in turn, and the seedlings still growing last', () => {
  const all = new Uint8Array(BED.count).fill(1);
  equal(tending(BED, [2], 3)([4, 2, 1, 0], all, []).join(), '1,0,4,2', 'the free tiles to try, the seedling growing');
  equal(tending(BED, [2], 3, [3], [null])([4, 2, 1, 0], all, []).join(), '2,4,1,0', 'the free tiles to try, the seedling in bloom');
});

test('the fifth chapter is seedlings, a seed tray: 112 tiles on two layers, nine across, its soil filling the tray, and on it eight sprouts, each a seedling with its first leaves raised round it', () => {
  equal(FIFTH.name, 'The fifth chapter', "the fifth chapter's name");
  equal(FIFTH.title, 'Seedlings', "the fifth chapter's title");
  equal(showerOf(TRAY), FIFTH, "the tray's chapter");
  equal(TRAY.count, 112, 'tiles');
  equal(TRAY.width / 2, 9, 'tiles across');
  equal(TRAY.height / 2, 8, 'tiles down');
  equal(TRAY.depth, 2, 'layers');
  check(TRAY.count > RAINBOW.count, 'no more tiles than the rainbow');
  const { seedlings, drinks } = OPTIONS.watering;
  equal(drinks, 3, 'waterings to bloom');
  const tiles = seedlingsOf(TRAY, seedlings);
  equal(tiles.length, 8, 'seedlings');
  const all = [...TRAY.x.keys()];
  equal(all.filter((i) => TRAY.z[i] === 0).length, 72, 'the soil, nine by eight');
  for (const s of tiles) {
    const leaves = all.filter((i) => plotOf(TRAY, i, tiles) === 'leaf' && waters(TRAY, s, i, i));
    equal(leaves.length, 4, `the leaves round the seedling at ${TRAY.x[s] / 2}, ${TRAY.y[s] / 2}`);
    check(TRAY.z[s] === 1 && leaves.every((i) => TRAY.z[i] === 1), 'a seedling or its leaves not raised');
  }
  equal(all.filter((i) => TRAY.z[i] === 1).length, 40, 'the sprouts, eight crosses of five');
  for (let a = 0; a < tiles.length; a++) for (let b = a + 1; b < tiles.length; b++) check(!waters(TRAY, tiles[a], tiles[b], tiles[b]), 'two seedlings touching');
  const g = new Game(TRAY, { seed: 1, ...OPTIONS });
  check(tiles.every((s) => !g.isFree(s)), 'a seedling free at the start');
});

test("the tray's deals can be won in their own order, which waters every seedling and picks it in bloom; following the hints does too, and a player taking pairs at random picks fewer", () => {
  let random = 0;
  for (let seed = 1; seed <= 60; seed++) {
    const g = new Game(TRAY, { seed, ...OPTIONS });
    equal(bloomsIn(TRAY, g.plan, g.garden.seedlings, g.garden.drinks), 8, `seed ${seed}: blooms picked in the deal's own order`);
    while (g.left) g.match(...g.suggest());
    check(g.won, `seed ${seed}: following the hints, not cleared`);
    equal(`${g.seedlingsIn('picked')} ${row(g)[2]}`, `8 ${8 * POINTS.bloom}`, `seed ${seed}: following the hints, the blooms picked and what they score`);
    const p = new Game(TRAY, { seed, ...OPTIONS });
    const r = seeded(seed * 41);
    while (p.left && p.pairs().length) p.match(...r.pick(p.pairs()));
    random += p.seedlingsIn('picked');
  }
  check(random < 60 * 8 * 0.8, `taking pairs at random picked ${random} blooms`);
  return `60 deals: following the hints, all eight every time; pairs at random, ${(random / 60).toFixed(1)}`;
});

test('a shuffle leaves the seedlings as they were; a board played the same way waters the same', () => {
  const g = new Game(TRAY, { seed: 9, ...OPTIONS });
  const r = seeded(3);
  for (let m = 0; m < 10; m++) g.match(...r.pick(g.pairs()));
  const [water, taken, faces] = [JSON.stringify(g.water), JSON.stringify(g.seedlingsTaken), JSON.stringify(Array.from(g.faces))];
  check(g.shuffle(), 'no shuffle');
  check(JSON.stringify(g.water) === water && JSON.stringify(g.seedlingsTaken) === taken, 'a shuffle changed the seedlings');
  g.undo();
  equal(JSON.stringify(Array.from(g.faces)), faces, 'the tiles, after an undo of the shuffle');
  g.shuffle();
  while (g.left) g.match(...g.suggest());
  check(g.won, 'following the hints after a shuffle, not cleared');

  for (const seed of [1, 2, 3, 4]) {
    const play = () => {
      const k = new Game(TRAY, { seed, ...OPTIONS });
      const rr = seeded(seed * 13);
      const seen = [];
      k.on('garden', (e) => seen.push(`${k.matches}:${e.watered.join('+')}/${e.picked.join('+')}/${e.pulled.join('+')}`));
      while (k.left && k.pairs().length) {
        if (k.matches === 10) k.hint();
        if (k.matches === 20) k.shuffle();
        k.match(...rr.pick(k.pairs()));
      }
      return seen.join(' ');
    };
    equal(play(), play(), `seed ${seed}: the tray, played the same way twice`);
  }
});
