import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { BED, CAN } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { tulipsOf, flight, firstFlight, flyOn, makesHoney, honeyIn, foraging } from '../js/engine/bees.js';
import { seeded } from '../js/engine/rng.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SHOWERS, showerOf } from '../js/showers.js';

const SEVENTH = SHOWERS[6];
const OPTIONS = dayOptions(SEVENTH);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Honey');
const facesOf = (...keys) => keys.map((key) => FACE[key]);

// A little bed: a row of four leaves, 0 to 3, and on them two tulips' tops,
// 4 and 5.
const PLOT = parseLayout('plot', ['####', '#..#']);

test('the bee flies to another tulip with every match, to the one she was flying to next while it stands, never the one she is on; a pair with the tulip she is on makes honey; and an undo takes it back', () => {
  const tulips = tulipsOf(PLOT, 1);
  equal(tulips.join(), '4,5', "the tulips' tops");
  for (let k = 0; k < 20; k++) equal(flight(3, k, [0, 1], 0), 1, 'the bee flying to the tulip she is on');
  equal(flight(3, 5, [], -1), -1, 'the bee flying with no tulip standing');
  equal(flight(3, 5, [0], 0), 0, 'the bee not staying on the one tulip standing');
  const bee = firstFlight(tulips, 3);
  check(bee.at >= 0 && bee.next >= 0 && bee.at !== bee.next, 'the bee as the board starts');
  check(makesHoney(tulips, bee, tulips[bee.at], 0) && !makesHoney(tulips, bee, tulips[bee.next], 0), 'honey, a pair with the tulip the bee is on');
  const present = new Uint8Array(PLOT.count).fill(1);
  equal(flyOn(tulips, bee, present, 3).at, bee.next, 'the bee, flying on, not to the tulip she was flying to next');
  present[tulips[bee.next]] = 0;
  equal(flyOn(tulips, bee, present, 3).at, bee.at, 'the bee, her next tulip taken, not flying to the one left');
  present[tulips[bee.at]] = 0;
  equal(flyOn(tulips, bee, present, 3).at, -1, 'the bee, no tulip standing, not flying off');

  // The two tulips a pair, the leaves two pairs.
  const faces = facesOf('eyes-1', 'eyes-2', 'eyes-2', 'eyes-1', 'eyes-3', 'eyes-3');
  const g = new Game(PLOT, { faces, bees: { tops: 1 } });
  const heard = [];
  g.on('bee', (e) => heard.push(`${e.honey}`));
  const on = g.tulips[g.bee.at];
  check(g.beeOn(on) && !g.beeOn(4 + 5 - on) && g.beeNext(4 + 5 - on), 'the bee on one tulip, flying to the other');
  equal(`${g.tulipsLeft} ${g.honey}`, '2 0', 'the tulips standing, and the honey, at the start');
  const r = g.match(4, 5);
  check(r.honey && g.honey === 1 && r.beeFrom === on && g.bee.at === -1, 'the tulips taken together, with the bee on one, not making honey, or she not flying off');
  equal(row(g)[1], '1 of 2 tulips', 'the honey, told');
  equal(row(g)[2], POINTS.honey, 'what honey scores');
  g.undo();
  check(g.honey === 0 && g.bee.at >= 0 && g.tulips[g.bee.at] === on, 'an undo did not take back the honey, or the bee');
  equal(heard.join(), 'true', 'the bee, heard');

  const plain = new Game(PLOT, { faces });
  check(!plain.tulips && !plain.bee && !plain.beeOn(4) && !plain.match(4, 5).honey && !row(plain), 'a board without a bee makes honey');
});

test('a deal foraging takes first the tulip the bee is on, if it is free, and last the other tulips', () => {
  const tulips = tulipsOf(PLOT, 1);
  const all = new Uint8Array(PLOT.count).fill(1);
  const bee = { at: 1, next: 0, flights: 2 };
  equal(foraging(tulips, 3, bee)([4, 0, 5, 3], all, []).join(), '5,0,3,4', 'the free tiles to try');
  equal(honeyIn(tulips, [[5, 4]], all, 3, bee).honey, 1, 'the honey an order makes');
});

test('the seventh chapter is the flower bed: 130 tiles on three layers, nine across, sixteen tulips in staggered rows, each a head raised over its leaves, over two rows of soil', () => {
  equal(SEVENTH.name, 'The seventh chapter', "the seventh chapter's name");
  equal(SEVENTH.title, 'The flower bed', "the seventh chapter's title");
  equal(showerOf(BED), SEVENTH, "the bed's chapter");
  equal(BED.count, 130, 'tiles');
  equal(BED.width / 2, 9, 'tiles across');
  equal(BED.height / 2, 10, 'tiles down');
  equal(BED.depth, 3, 'layers');
  check(BED.count > CAN.count, 'no more tiles than the watering can');
  const tulips = tulipsOf(BED, OPTIONS.bees.tops);
  equal(tulips.length, 16, 'tulips');
  for (const t of tulips) equal(BED.below[t].filter((j) => BED.z[j] === 1).length, 2, "a tulip's top not resting on the two halves of its head");
  equal([...BED.x.keys()].filter((i) => BED.z[i] === 0 && BED.y[i] >= 16).length, 18, 'the soil, two rows of nine');
  const g = new Game(BED, { seed: 1, ...OPTIONS });
  check(tulips.every((t) => g.isFree(t)), 'a tulip not free at the start');
});

test("the bed's deals can be won in their own order, which makes honey at every tulip; following the hints does too, and a player taking pairs at random makes little", () => {
  let random = 0;
  for (let seed = 1; seed <= 60; seed++) {
    const g = new Game(BED, { seed, ...OPTIONS });
    equal(honeyIn(g.tulips, g.plan, new Uint8Array(BED.count).fill(1), seed).honey, 16, `seed ${seed}: honey in the deal's own order`);
    while (g.left) g.match(...g.suggest());
    check(g.won, `seed ${seed}: following the hints, not cleared`);
    equal(`${g.honey} ${row(g)[2]}`, `16 ${16 * POINTS.honey}`, `seed ${seed}: following the hints, the honey and what it scores`);
    const p = new Game(BED, { seed, ...OPTIONS });
    const r = seeded(seed * 47);
    while (p.left && p.pairs().length) p.match(...r.pick(p.pairs()));
    random += p.honey;
  }
  check(random < 60 * 16 * 0.5, `taking pairs at random made ${random} honey`);
  return `60 deals: following the hints, honey at all sixteen every time; pairs at random, ${(random / 60).toFixed(1)}`;
});

test('a shuffle leaves the bee where she was; a board played the same way sees the same bee', () => {
  const g = new Game(BED, { seed: 9, ...OPTIONS });
  const r = seeded(3);
  for (let m = 0; m < 10; m++) g.match(...r.pick(g.pairs()));
  const [bee, honey, faces] = [JSON.stringify(g.bee), g.honey, JSON.stringify(Array.from(g.faces))];
  check(g.shuffle(), 'no shuffle');
  check(JSON.stringify(g.bee) === bee && g.honey === honey, 'a shuffle moved the bee');
  g.undo();
  equal(JSON.stringify(Array.from(g.faces)), faces, 'the tiles, after an undo of the shuffle');
  g.shuffle();
  while (g.left) g.match(...g.suggest());
  check(g.won, 'following the hints after a shuffle, not cleared');

  for (const seed of [1, 2, 3, 4]) {
    const play = () => {
      const k = new Game(BED, { seed, ...OPTIONS });
      const rr = seeded(seed * 13);
      const seen = [JSON.stringify(k.bee)];
      k.on('bee', (e) => seen.push(`${k.matches}:${e.honey}/${e.beeFrom}/${k.bee.at}`));
      while (k.left && k.pairs().length) {
        if (k.matches === 10) k.hint();
        if (k.matches === 20) k.shuffle();
        k.match(...rr.pick(k.pairs()));
      }
      return seen.join(' ');
    };
    equal(play(), play(), `seed ${seed}: the bee, played the same way twice`);
  }
});
