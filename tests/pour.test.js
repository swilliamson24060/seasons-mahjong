import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { CAN, TRAY } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { partOf, pairDoes, pourIn, pouring } from '../js/engine/pour.js';
import { seeded } from '../js/engine/rng.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SHOWERS, showerOf } from '../js/showers.js';

const SIXTH = SHOWERS[5];
const OPTIONS = dayOptions(SIXTH);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Pours');
const facesOf = (...keys) => keys.map((key) => FACE[key]);

// A little can: a body of four tiles in a row, 0 to 3, and below it apart,
// four drops in a row of their own, 4 to 7, and two more tiles, 8 and 9.
const LITTLE = parseLayout('little can', ['####......\n..........\n####.##...']);
const PARTS = { body: [0, 0, 6, 0], drops: [[0, 4], [2, 4], [4, 4], [6, 4]] };

test('a pair from the can\'s body fills it a measure, up to the most it holds; a pair of its drops pours one out, for points, or with the can empty waters nothing; and an undo takes each back', () => {
  equal([0, 3, 4, 7, 8].map((i) => partOf(LITTLE, i, PARTS)).join(), 'body,body,drops,drops,', "the tiles' parts");
  equal([pairDoes(LITTLE, 0, 1, PARTS, 0, 2), pairDoes(LITTLE, 0, 1, PARTS, 2, 2), pairDoes(LITTLE, 4, 5, PARTS, 1, 2), pairDoes(LITTLE, 4, 5, PARTS, 0, 2), pairDoes(LITTLE, 0, 4, PARTS, 1, 2)].join(), 'fill,full,pour,dry,', 'what pairs do to the can');
  equal(JSON.stringify(pourIn(LITTLE, [[0, 1], [4, 5], [6, 7]], PARTS, 2)), JSON.stringify({ level: 0, pours: 1, dry: 1 }), 'the can after an order');

  // A body of six in a row, 0 to 5, and its drops, 6 to 9, in a row below,
  // with two more tiles, 10 and 11: the drops' ends poured dry, the body's
  // two pairs from its ends filling it, a third pair of the body's with the
  // can full, and the drops' middle pair pouring.
  const L = parseLayout('little can', ['######....\n..........\n####.##...']);
  const parts = { body: [0, 0, 10, 0], drops: [[0, 4], [2, 4], [4, 4], [6, 4]] };
  const faces = facesOf('eyes-1', 'eyes-2', 'eyes-3', 'eyes-3', 'eyes-2', 'eyes-1', 'eyes-4', 'eyes-5', 'eyes-5', 'eyes-4', 'eyes-6', 'eyes-6');
  const g = new Game(L, { faces, pour: { ...parts, most: 2 } });
  const heard = [];
  g.on('can', (e) => heard.push(e.canDoes));
  equal(`${g.canLevel} ${g.dropPairs} ${g.dropsLeft}`, '0 2 4', 'the can at the start, its pairs of drops and the drops left');
  g.match(6, 9);
  check(g.dryPours === 1 && g.pours === 0, 'a pair of drops with the can empty not poured dry');
  g.match(0, 5);
  g.match(1, 4);
  equal(g.canLevel, 2, 'the can, after two pairs from its body');
  g.match(2, 3);
  equal(g.canLevel, 2, 'the can, after a pair from its body with it full');
  g.match(7, 8);
  check(g.pours === 1 && g.canLevel === 1 && g.dropsLeft === 0, 'a pair of drops with water in the can not poured');
  equal(heard.join(), 'dry,fill,fill,full,pour', 'the can, heard');
  equal(row(g)[1], '1 of 2, 1 dry', 'the pours, told');
  equal(row(g)[2], POINTS.pour, 'what a pour scores');
  g.undo();
  check(g.pours === 0 && g.canLevel === 2, 'an undo did not take back a pour');
  g.undo();
  g.undo();
  check(g.canLevel === 1 && g.fills === 1, 'an undo did not take back a fill');

  const plain = new Game(L, { faces });
  check(!plain.can && plain.canPart(0) === null && !plain.match(0, 5).canDoes && !row(plain), 'a board without a can fills it');
});

test('a deal pouring the can tries first two drops with water in the can, or else two tiles of its body with room in it, and the drops last', () => {
  const all = new Uint8Array(LITTLE.count).fill(1);
  equal(pouring(LITTLE, PARTS, 2)([8, 4, 0, 5, 1], all, []).join(), '0,1,8,4,5', 'the free tiles to try, the can empty');
  equal(pouring(LITTLE, PARTS, 2)([8, 4, 0, 5, 1], all, [[2, 3]]).join(), '4,5,8,0,1', 'the free tiles to try, a measure in the can');
  equal(pouring(LITTLE, PARTS, 2)([8, 4, 0, 5], all, []).join(), '8,0,4,5', 'the free tiles to try, the can empty and one tile of its body free');
});

test('the sixth chapter is the watering can: 116 tiles on five layers, nine across, its body a box rising in steps, its handle arching over it, its spout rising to the rose, and fourteen drops falling from it', () => {
  equal(SIXTH.name, 'The sixth chapter', "the sixth chapter's name");
  equal(SIXTH.title, 'The watering can', "the sixth chapter's title");
  equal(showerOf(CAN), SIXTH, "the can's chapter");
  equal(CAN.count, 116, 'tiles');
  equal(CAN.width / 2, 9, 'tiles across');
  equal(CAN.height / 2, 10, 'tiles down');
  equal(CAN.depth, 5, 'layers');
  check(CAN.count > TRAY.count, 'no more tiles than the seed tray');
  const { body, drops, most } = OPTIONS.pour;
  equal(most, 5, 'the most the can holds');
  const tiles = [...CAN.x.keys()];
  const of = (part) => tiles.filter((i) => partOf(CAN, i, { body, drops }) === part);
  equal(of('body').length, 81, "the body's tiles");
  equal(of('drops').length, 14, 'the drops');
  check(of('drops').every((i) => CAN.z[i] === 0), 'a drop raised');
  check(of('drops').every((i) => CAN.x[i] >= 12), 'a drop not to the right of the body');
  const g = new Game(CAN, { seed: 1, ...OPTIONS });
  check(of('drops').filter((i) => g.isFree(i)).length >= 7, 'fewer than half the drops free at the start');
  check(of('body').some((i) => g.isFree(i)), 'none of the body free at the start');
});

test("the can's deals can be won in their own order, which pours every pair of drops with water in the can; following the hints does too, and a player taking pairs at random pours some dry", () => {
  let random = 0;
  let dry = 0;
  for (let seed = 1; seed <= 60; seed++) {
    const g = new Game(CAN, { seed, ...OPTIONS });
    equal(pourIn(CAN, g.plan, g.can, g.canMost).pours, 7, `seed ${seed}: pours in the deal's own order`);
    while (g.left) g.match(...g.suggest());
    check(g.won, `seed ${seed}: following the hints, not cleared`);
    equal(`${g.pours} ${g.dryPours} ${row(g)[2]}`, `7 0 ${7 * POINTS.pour}`, `seed ${seed}: following the hints, the pours, those dry and what they score`);
    const p = new Game(CAN, { seed, ...OPTIONS });
    const r = seeded(seed * 43);
    while (p.left && p.pairs().length) p.match(...r.pick(p.pairs()));
    random += p.pours;
    dry += p.dryPours;
  }
  check(random < 60 * 7 * 0.7 && dry > 0, `taking pairs at random poured ${random}, ${dry} dry`);
  return `60 deals: following the hints, all seven pours every time; pairs at random, ${(random / 60).toFixed(1)} pours and ${(dry / 60).toFixed(1)} dry`;
});

test('a shuffle leaves the can as it was; a board played the same way pours the same', () => {
  const g = new Game(CAN, { seed: 9, ...OPTIONS });
  const r = seeded(3);
  for (let m = 0; m < 10; m++) g.match(...r.pick(g.pairs()));
  const [can, faces] = [`${g.canLevel} ${g.fills} ${g.pours} ${g.dryPours}`, JSON.stringify(Array.from(g.faces))];
  check(g.shuffle(), 'no shuffle');
  equal(`${g.canLevel} ${g.fills} ${g.pours} ${g.dryPours}`, can, 'the can, after a shuffle');
  g.undo();
  equal(JSON.stringify(Array.from(g.faces)), faces, 'the tiles, after an undo of the shuffle');
  g.shuffle();
  while (g.left) g.match(...g.suggest());
  check(g.won, 'following the hints after a shuffle, not cleared');

  for (const seed of [1, 2, 3, 4]) {
    const play = () => {
      const k = new Game(CAN, { seed, ...OPTIONS });
      const rr = seeded(seed * 13);
      const seen = [];
      k.on('can', (e) => seen.push(`${k.matches}:${e.canDoes}`));
      while (k.left && k.pairs().length) {
        if (k.matches === 10) k.hint();
        if (k.matches === 20) k.shuffle();
        k.match(...rr.pick(k.pairs()));
      }
      return seen.join(' ');
    };
    equal(play(), play(), `seed ${seed}: the can, played the same way twice`);
  }
});
