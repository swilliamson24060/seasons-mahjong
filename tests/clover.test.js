import { test, check, equal } from './run.js';
import { parseLayout, isFree } from '../js/engine/layout.js';
import { SHAMROCK, KITE } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { SOON, RESTLESS, hidingPlaces, hidingOf } from '../js/engine/clover.js';
import { seeded } from '../js/engine/rng.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SPRING, springOf, shamrockPart } from '../js/spring.js';

const FIFTH = SPRING[4];
const OPTIONS = dayOptions(FIFTH);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Four-leaf clovers');
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const at = (L, z, y) => [...L.x.keys()].filter((i) => L.z[i] === z && L.y[i] === y).map((i) => L.x[i]).join();

// Two rows of three, tiles 0, 1 and 2 across the top and 3, 4 and 5 across
// the bottom, and 6 and 7 on top of their middles: each middle held down,
// by the tile on it and the ends beside it. The ends a pair a row, the
// middles a pair, and the two on top a pair.
const BLOCK = parseLayout('block', ['###\n###', '.#.\n.#.']);
const FACES = facesOf('eyes-2', 'eyes-1', 'eyes-2', 'eyes-3', 'eyes-1', 'eyes-3', 'eyes-4', 'eyes-4');
const freeAt = (p, t) => isFree(BLOCK, p, t);

test('a four-leaf clover hides on a tile held down that a way to clear the board frees and then takes in time, chosen from the seed', () => {
  const all = new Uint8Array(BLOCK.count).fill(1);
  const way = [[6, 7], [0, 2], [3, 5], [1, 4]];
  equal(hidingPlaces(way, all, [1, 4], freeAt, 5).join(), '1,4', 'where it could hide, taken within five of coming free');
  equal(hidingPlaces(way, all, [1, 4], freeAt, 1).join(), '4', 'where it could hide, taken the match after coming free');
  equal(hidingPlaces(way, all, [1, 4], freeAt, 5, 2).join(), '1', 'where it could hide, coming free within two matches');
  equal(hidingPlaces(way, all, [], freeAt, 5).join(), '', 'where it could hide with nothing held down');
  equal(hidingOf([], 3, 0), -1, 'a clover with nowhere to hide');
  equal(hidingOf([4, 9, 11], 3, 2), hidingOf([4, 9, 11], 3, 2), 'where it hides, not the same for the same board');
  check([4, 9, 11].includes(hidingOf([4, 9, 11], 3, 2)), 'hiding where it could not');
  const g = new Game(BLOCK, { faces: FACES, clover: { within: 5 } });
  check(g.clover && [1, 4].includes(g.clover.tile) && g.clover.shownAt === null && g.cloversHidden === 1, 'no clover hidden on a tile held down as the board starts');
  check(!g.hasClover(g.clover.tile), 'a hidden clover showing');
});

test('the clover shows once its tile comes free, and taken in time is a stroke of luck, for points; left too long it blows away; either way another hides, and an undo puts it back', () => {
  const g = new Game(BLOCK, { faces: FACES, clover: { within: 2 } });
  g.clover = { tile: 4, shownAt: null, hidAt: 0 }; // under 7, between 3 and 5
  const heard = [];
  g.on('clover', (e) => heard.push(`${e.cloverShown >= 0 ? `shown ${e.cloverShown}` : ''}${e.cloverFound >= 0 ? `found ${e.cloverFound}` : ''}${e.cloverLost >= 0 ? `lost ${e.cloverLost}` : ''}`));
  check(g.match(6, 7).cloverShown === -1 && g.match(0, 2).cloverShown === -1, 'the clover showing while its tile is held down');
  const r = g.match(3, 5);
  check(r.cloverShown === 4 && g.hasClover(4) && g.cloverLeft === 2, 'the clover not showing as its tile came free');
  const f = g.match(1, 4);
  check(f.cloverFound === 4 && g.cloversFound === 1, 'the clover taken, not found');
  equal(`${row(g)[1]} ${row(g)[2]}`, `1 found ${POINTS.luck}`, 'the clovers found, and what they score');
  check(g.clover === null, 'a clover hiding with nothing held down');
  equal(heard.join(' | '), 'shown 4 | found 4', 'the clover heard');
  g.undo();
  check(g.hasClover(4) && g.cloversFound === 0 && g.clover.shownAt === 3, 'an undo, the clover not put back as it was');
  // A clover hidden too long, its tile not coming free, hides elsewhere.
  const w = new Game(SHAMROCK, { seed: 5, ...OPTIONS });
  w.clover = { tile: w.clover.tile, shownAt: null, hidAt: -RESTLESS };
  const before = w.cloversHidden;
  const t = w.clover.tile;
  const near = new Set([...w.layout.above[t], ...w.layout.left[t], ...w.layout.right[t]]);
  const pair = w.pairs().find(([x, y]) => !near.has(x) && !near.has(y));
  w.match(...pair);
  check(w.cloversHidden === before + 1 && w.clover && w.clover.hidAt === 1 && !w.isFree(w.clover.tile), 'a clover hidden too long not hiding elsewhere');

  const k = new Game(BLOCK, { faces: FACES, clover: { within: 1 } });
  k.clover = { tile: 1, shownAt: null, hidAt: 0 }; // under 6, between 0 and 2
  k.match(6, 7);
  check(k.match(0, 2).cloverShown === 1 && k.cloverLeft === 1, 'the clover not showing');
  const m = k.match(3, 5);
  check(m.cloverLost === 1 && k.cloversLost === 1 && k.clover === null, 'the clover kept too long not blowing away');
  equal(row(k)[1], '0 found, 1 blown away', 'the clovers found and blown away');
  const plain = new Game(BLOCK, { faces: FACES });
  check(!plain.cloverWithin && plain.clover === null && !plain.hasClover(1) && plain.match(0, 2).cloverShown === -1 && !row(plain), 'a board without clovers hiding them');
});

test('the fifth chapter is luck of the Irish: a shamrock, 116 tiles on four layers, nine across, its three heart-shaped leaves and its stem', () => {
  equal(FIFTH.name, 'The fifth chapter', "the fifth chapter's name");
  equal(FIFTH.title, 'Luck of the Irish', "the fifth chapter's title");
  equal(springOf(SHAMROCK), FIFTH, "the shamrock's chapter");
  equal(SHAMROCK.count, 116, 'tiles');
  equal(SHAMROCK.width / 2, 9, 'tiles across');
  equal(SHAMROCK.height / 2, 10.5, 'tiles down');
  equal(SHAMROCK.depth, 4, 'layers');
  check(SHAMROCK.count > KITE.count, 'no more tiles than the kite');
  equal(JSON.stringify(OPTIONS), JSON.stringify({ treats: false, ghostsFloat: false, clover: { within: 5 } }), 'a clover keeping five matches');
  equal(at(SHAMROCK, 0, 0), '2,4,6,10,12,14', "the top leaf's two lobes, cleft between them");
  equal(at(SHAMROCK, 0, 10), '0,2,4,12,14,16', "the side leaves' lobes, out at the board's edges");
  equal(at(SHAMROCK, 0, 12), '2,4,6,8,10,12,14', 'the side leaves, their clefts at the edges, their points meeting the stem');
  const parts = {};
  for (let i = 0; i < SHAMROCK.count; i++) {
    const p = shamrockPart(SHAMROCK, i);
    parts[p] = (parts[p] || 0) + 1;
  }
  equal(['shamrock', 'shamrock-light', 'stem'].map((p) => `${p} ${parts[p]}`).join(', '), 'shamrock 90, shamrock-light 20, stem 6', 'its parts, for its look');
  equal(FIFTH.look, shamrockPart, 'the shamrock not tinted as its parts are');
  check(['four-leaf clover', 'held down', 'comes free', 'within five matches', `${POINTS.luck} points`, 'another hides'].every((w) => FIFTH.text.includes(w)), "the card doesn't tell the clover");
});

test("the shamrock's deals can be cleared following the hints, finding the clovers as they show; a player taking pairs at random finds fewer", () => {
  let hinted = 0;
  let hidden = 0;
  let random = 0;
  for (let seed = 1; seed <= 24; seed++) {
    const g = new Game(SHAMROCK, { seed, ...OPTIONS });
    while (g.left) {
      const pair = g.suggest();
      check(pair, `seed ${seed}: no hint with ${g.left} tiles left`);
      if (!pair) break;
      check(g.match(...pair), `seed ${seed}: the hint can't be taken`);
    }
    check(g.won, `seed ${seed}: following the hints, not cleared`);
    hinted += g.cloversFound;
    hidden += g.cloversHidden;
    const p = new Game(SHAMROCK, { seed, ...OPTIONS });
    const r = seeded(seed * 41);
    while (p.left && p.pairs().length) p.match(...r.pick(p.pairs()));
    random += p.cloversFound;
  }
  check(hinted > random, `following the hints found ${hinted} clovers, no more than pairs at random, ${random}`);
  check(hidden >= 24 * 6, `only ${hidden} clovers hid, coming free within ${SOON} matches where they could`);
  return `24 deals: following the hints found ${(hinted / 24).toFixed(1)} clovers a board of ${(hidden / 24).toFixed(1)} hidden; pairs at random found ${(random / 24).toFixed(1)}`;
});

test('a board played the same way hides the same clovers, however its hints are asked for', () => {
  for (const seed of [1, 2, 3]) {
    const play = (hints) => {
      const k = new Game(SHAMROCK, { seed, ...OPTIONS });
      const rr = seeded(seed * 13);
      const seen = [`${k.clover && k.clover.tile}`];
      k.on('clover', (e) => seen.push(`${k.matches}:${e.cloverShown}/${e.cloverFound}/${e.cloverLost}/${k.clover && k.clover.tile}`));
      while (k.left && k.pairs().length) {
        if (hints && k.matches % 3 === 0) k.hint();
        k.match(...rr.pick(k.pairs()));
      }
      return seen.join(' ');
    };
    equal(play(true), play(false), `seed ${seed}: the clovers, played the same way with hints and without`);
  }
});
