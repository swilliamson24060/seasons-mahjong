import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { SCALES, WINDOW } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { sideOf, isEquinox, equinoxIn } from '../js/engine/equinox.js';
import { seeded } from '../js/engine/rng.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SPRING, springOf, scalesPart } from '../js/spring.js';

const SEVENTH = SPRING[6];
const OPTIONS = dayOptions(SEVENTH);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Equinox pairs');
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const at = (L, z, y) => [...L.x.keys()].filter((i) => L.z[i] === z && L.y[i] === y).map((i) => L.x[i]).join();

// Three tiles apart in a row, and a fourth on the middle one: the left one
// day, the right one night, and the middle two on the board's middle,
// neither.
const POST = parseLayout('post', ['#.#.#', '..#..']);
// Four tiles apart in a row, every one free: two on the day side, two on
// the night side.
const GAPS = parseLayout('gaps', ['#.#.#.#']);

test("the board's left half is day and its right half night, its middle neither; a pair with a tile from each side is an equinox pair", () => {
  equal([0, 1, 2, 3].map((i) => sideOf(POST, i)).join(), 'day,,night,', 'the sides, the middle on neither');
  equal([0, 1, 2, 3].map((i) => sideOf(GAPS, i)).join(), 'day,day,night,night', 'the sides of four in a row');
  check(isEquinox(POST, 0, 2) && isEquinox(POST, 2, 0), 'day and night together not an equinox pair');
  check(!isEquinox(POST, 0, 1) && !isEquinox(POST, 1, 3) && !isEquinox(GAPS, 0, 1) && !isEquinox(GAPS, 2, 3), 'a pair from one side, or the middle, an equinox pair');
  equal(equinoxIn(GAPS, [[0, 3], [1, 2]]), 2, 'equinox pairs in an order, each across');
  equal(equinoxIn(GAPS, [[0, 1], [2, 3]]), 0, 'equinox pairs in an order, each on one side');
});

test('an equinox pair scores, a pair from one side nothing, and an undo takes one back', () => {
  const g = new Game(GAPS, { faces: facesOf('eyes-1', 'eyes-2', 'eyes-2', 'eyes-1'), equinox: true });
  const heard = [];
  g.on('equinox', (e) => heard.push(`${e.a}+${e.b}`));
  check(g.match(0, 3).equinoxPair && g.match(1, 2).equinoxPair, 'pairs across not equinox pairs');
  equal(`${g.equinoxPairs} ${row(g)[1]} ${row(g)[2]}`, `2 2 × ${POINTS.equinox} ${2 * POINTS.equinox}`, 'the equinox pairs, and what they score');
  equal(heard.join(' '), '0+3 1+2', 'the equinox pairs heard');
  g.undo();
  equal(g.equinoxPairs, 1, 'an undo, the equinox pair not taken back');
  const k = new Game(GAPS, { faces: facesOf('eyes-1', 'eyes-1', 'eyes-2', 'eyes-2'), equinox: true });
  check(!k.match(0, 1).equinoxPair && !k.match(2, 3).equinoxPair && k.equinoxPairs === 0, 'pairs from one side equinox pairs');
  const plain = new Game(GAPS, { faces: facesOf('eyes-1', 'eyes-2', 'eyes-2', 'eyes-1') });
  check(!plain.match(0, 3).equinoxPair && !row(plain), 'a board without day and night taking equinox pairs');
});

test('the seventh chapter is day and night: the sun and the moon in balance on a pair of scales, 132 tiles on four layers, nine across, day and night equal', () => {
  equal(SEVENTH.name, 'The seventh chapter', "the seventh chapter's name");
  equal(SEVENTH.title, 'Day and night', "the seventh chapter's title");
  equal(springOf(SCALES), SEVENTH, "the scales' chapter");
  equal(SCALES.count, 132, 'tiles');
  equal(SCALES.width / 2, 9, 'tiles across');
  equal(SCALES.height / 2, 10, 'tiles down');
  equal(SCALES.depth, 4, 'layers');
  check(SCALES.count > WINDOW.count, 'no more tiles than the window');
  equal(JSON.stringify(OPTIONS), JSON.stringify({ treats: false, ghostsFloat: false, equinox: true }), 'day meeting night');
  const sides = { day: 0, night: 0, none: 0 };
  for (let i = 0; i < SCALES.count; i++) sides[sideOf(SCALES, i) || 'none']++;
  equal(`${sides.day} ${sides.night} ${sides.none}`, '57 57 18', 'day and night not equal, the post on neither');
  equal(at(SCALES, 0, 0), '0,2,4,6,8,10,12,14,16', 'the beam across the top');
  equal(at(SCALES, 0, 6), '0,2,4,6,8,14,16', "the sun's disc, the post, and the moon's crescent, hollow toward the post");
  equal(at(SCALES, 3, 0), '8', 'the beam highest over the post');
  const parts = {};
  for (let i = 0; i < SCALES.count; i++) {
    const p = scalesPart(SCALES, i);
    parts[p] = (parts[p] || 0) + 1;
  }
  equal(['pillar', 'scale-day', 'scale-night', 'sun', 'ray', 'moon', 'star'].map((p) => `${p} ${parts[p]}`).join(', '), 'pillar 18, scale-day 27, scale-night 27, sun 26, ray 4, moon 26, star 4', 'its parts, for its look');
  equal(SEVENTH.look, scalesPart, 'the scales not tinted as their parts are');
  check(['equinox', 'left half is day', 'right half night', 'a tile from each', `${POINTS.equinox} points`, 'neither side'].every((w) => SEVENTH.text.includes(w)), "the card doesn't tell day and night");
});

test("the scales' deals pair day with night in their own order, and can be cleared following the hints, taking equinox pairs as they go; a player taking pairs at random takes fewer", () => {
  let planned = 0;
  let hinted = 0;
  let random = 0;
  let pairs = 0;
  for (let seed = 1; seed <= 24; seed++) {
    const g = new Game(SCALES, { seed, ...OPTIONS });
    planned += equinoxIn(SCALES, g.plan);
    while (g.left) {
      const pair = g.suggest();
      check(pair, `seed ${seed}: no hint with ${g.left} tiles left`);
      if (!pair) break;
      check(g.match(...pair), `seed ${seed}: the hint can't be taken`);
    }
    check(g.won, `seed ${seed}: following the hints, not cleared`);
    hinted += g.equinoxPairs;
    const p = new Game(SCALES, { seed, ...OPTIONS });
    const r = seeded(seed * 41);
    while (p.left && p.pairs().length) p.match(...r.pick(p.pairs()));
    random += p.equinoxPairs;
    pairs += p.matches;
  }
  check(planned >= 24 * 45, `the deals' own orders take only ${planned} equinox pairs`);
  check(hinted > random * 1.2, `following the hints took ${hinted} equinox pairs, not many more than pairs at random, ${random}`);
  return `24 deals: their own orders take ${(planned / 24).toFixed(1)} equinox pairs a board of 66; following the hints ${(hinted / 24).toFixed(1)}; pairs at random ${(random / 24).toFixed(1)} of ${(pairs / 24).toFixed(1)}`;
});
