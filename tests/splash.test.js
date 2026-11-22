import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { BOOTS, UMBRELLA } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { inPuddle, isSplash, runAfter, dryFirst, runsIn } from '../js/engine/splash.js';
import { seeded } from '../js/engine/rng.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SHOWERS, showerOf } from '../js/showers.js';

const THIRD = SHOWERS[2];
const OPTIONS = dayOptions(THIRD);
const EDGE = OPTIONS.splash.edge;
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Splashes');
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const puddleOf = (L) => [...L.x.keys()].filter((i) => inPuddle(L, i, EDGE));

// A boot over a puddle: the boot two tiles side by side, 0 and 1, and a
// row down the puddle, four, 2 to 5.
const POND = parseLayout('pond', ['##..\n####']);

test('a pair from the puddle is a splash, and splashes one straight after another splash higher, 10 points more each; a pair from anywhere else lets the puddle settle; and an undo takes each back', () => {
  check(!inPuddle(POND, 0, 2) && !inPuddle(POND, 1, 2) && inPuddle(POND, 2, 2) && inPuddle(POND, 5, 2), 'the puddle, below its edge');
  check(isSplash(POND, 2, 3, 2) && !isSplash(POND, 0, 2, 2), 'a splash, both tiles in the puddle');
  check(!inPuddle(parseLayout('raised', ['#', '#']), 1, -2), 'a tile on another in the puddle');
  equal([runAfter(0, true), runAfter(2, true), runAfter(3, false)].join(), '1,3,0', 'the run after a pair');
  equal(runsIn(POND, [[2, 5], [3, 4], [0, 1]], 2).join(), '2', 'the runs in an order');
  equal(runsIn(POND, [[2, 5], [0, 1], [3, 4]], 2).join(), '1,1', 'the runs in an order broken by the boot');

  // The boot's two tiles a pair, and the puddle's four two pairs.
  const g = new Game(POND, { faces: facesOf('eyes-1', 'eyes-1', 'eyes-2', 'eyes-3', 'eyes-3', 'eyes-2'), splash: { edge: 2 } });
  const heard = [];
  g.on('splash', (e) => heard.push(`${e.splashed}/${e.settled}`));
  check(g.inSplashZone(2) && !g.inSplashZone(0) && g.nextSplash === 1 && g.puddleLeft === 4, 'the splash zone, the first splash and the puddle left, at the start');
  g.match(2, 5);
  check(g.splashRun === 1 && g.nextSplash === 2, 'a splash not one high');
  equal(row(g)[2], POINTS.splash, 'what the first splash scores');
  g.match(0, 1);
  check(g.splashRun === 0 && g.splashCount === 1, 'the boot did not let the puddle settle');
  g.match(3, 4);
  check(g.won && g.splashRun === 1 && g.splashCount === 2 && g.splashBest === 1 && g.puddleLeft === 0, 'the next splash not one high again');
  equal(heard.join(' '), '1/0 0/1 1/0', 'splashes and settling, heard');
  equal(row(g)[1], '2 splashes, 1 in a row at the most', 'the splashes, told');
  g.undo();
  g.undo();
  check(g.splashRun === 1 && g.splashCount === 1 && g.splashHeights === 1, 'an undo did not take back a splash, or the settling');
  g.match(3, 4);
  check(g.splashRun === 2 && g.splashHeights === 3 && g.splashBest === 2, 'a splash straight after another not two high');
  equal(row(g)[2], 3 * POINTS.splash, 'what two splashes in a row score: 10 and 20');

  const plain = new Game(POND, { faces: facesOf('eyes-1', 'eyes-1', 'eyes-2', 'eyes-3', 'eyes-3', 'eyes-2') });
  check(plain.puddleEdge === null && !plain.inSplashZone(2) && !plain.match(2, 5).splashed && !row(plain), 'a board without a puddle splashes');
});

test('a deal keeping out of the puddle takes two tiles out of it together while two of them are free, and a tile of the puddle only when fewer are', () => {
  equal(dryFirst(POND, 2)([2, 0, 5, 1]).join(), '0,1', 'the free tiles to try, two out of the puddle');
  equal(dryFirst(POND, 2)([2, 0, 5]).join(), '0,2,5', 'the free tiles to try, one out of the puddle');
  equal(dryFirst(POND, 2)([5, 2]).join(), '5,2', 'the free tiles to try, all in the puddle');
});

test("the third chapter is puddle jumping, a pair of rain boots standing in a puddle: 100 tiles on four layers, nine across, the boots' soles in the puddle, which lies flat, sixteen tiles", () => {
  equal(THIRD.name, 'The third chapter', "the third chapter's name");
  equal(THIRD.title, 'Puddle jumping', "the third chapter's title");
  equal(showerOf(BOOTS), THIRD, "the boots' chapter");
  equal(BOOTS.count, 100, 'tiles');
  equal(BOOTS.width / 2, 9, 'tiles across');
  equal(BOOTS.height / 2, 7, 'tiles down');
  equal(BOOTS.depth, 4, 'layers');
  check(BOOTS.count > UMBRELLA.count, 'no more tiles than the umbrella');
  const puddle = puddleOf(BOOTS);
  equal(puddle.length, 16, "the puddle's tiles");
  check(puddle.every((i) => BOOTS.z[i] === 0) && puddle.every((i) => BOOTS.above[i].every((j) => !puddle.includes(j))), 'the puddle not lying flat');
  // The soles stand on the puddle's top row, the arch under each foot
  // and the gap between the boots open to it.
  const soles = [...BOOTS.x.keys()].filter((i) => BOOTS.z[i] === 1 && BOOTS.y[i] === EDGE);
  equal(soles.map((i) => BOOTS.x[i]).join(), '0,2,6,10,12,16', 'the soles');
  check(soles.every((i) => puddle.some((j) => BOOTS.above[j].includes(i))), 'a sole not standing in the puddle');
});

test("the boots' deals can be won in their own order, which keeps the puddle till last and splashes through it in one run; following the hints does too, while splashing as soon as a pair can be had breaks it up", () => {
  let greedy = 0;
  let patient = 0;
  for (let seed = 1; seed <= 60; seed++) {
    const g = new Game(BOOTS, { seed, ...OPTIONS });
    equal(runsIn(BOOTS, g.plan, EDGE).join(), '8', `seed ${seed}: the runs of splashes in the deal's own order`);
    check(g.plan.slice(-8).every(([a, b]) => isSplash(BOOTS, a, b, EDGE)), `seed ${seed}: the deal's own order not leaving the puddle till last`);
    while (g.left) g.match(...g.suggest());
    check(g.won, `seed ${seed}: following the hints, not cleared`);
    equal(`${g.splashBest} ${row(g)[2]}`, `8 ${36 * POINTS.splash}`, `seed ${seed}: following the hints, the best run and what the splashes score`);
    // splashing whenever a pair from the puddle can be had, and otherwise
    // taking pairs at random
    const h = new Game(BOOTS, { seed, ...OPTIONS });
    const r = seeded(seed * 17);
    while (h.left && h.pairs().length) {
      const wet = h.pairs().filter(([a, b]) => isSplash(BOOTS, a, b, EDGE));
      h.match(...r.pick(wet.length ? wet : h.pairs()));
    }
    greedy += h.splashHeights * POINTS.splash;
    patient += g.splashHeights * POINTS.splash;
  }
  check(greedy < patient * 0.6, `splashing as soon as a pair can be had scored ${greedy}, keeping the puddle till last ${patient}`);
  return `60 deals: following the hints, 360 every time; splashing as soon as a pair can be had, ${(greedy / 60).toFixed(0)}`;
});

test('a shuffle leaves the run as it was and deals what is left of the puddle to go last; a board played the same way splashes the same', () => {
  const g = new Game(BOOTS, { seed: 9, ...OPTIONS });
  const r = seeded(5);
  for (let m = 0; m < 10; m++) g.match(...r.pick(g.pairs()));
  const [run, count, faces] = [g.splashRun, g.splashCount, JSON.stringify(Array.from(g.faces))];
  check(g.shuffle(), 'no shuffle');
  check(g.splashRun === run && g.splashCount === count, 'a shuffle changed the splashes');
  const left = runsIn(BOOTS, g.line, EDGE);
  check(left.length <= 1, `the shuffle's way splashing in ${left.length} runs`);
  g.undo();
  equal(JSON.stringify(Array.from(g.faces)), faces, 'the tiles, after an undo of the shuffle');
  g.shuffle();
  while (g.left) g.match(...g.suggest());
  check(g.won, 'following the hints after a shuffle, not cleared');

  for (const seed of [1, 2, 3, 4]) {
    const play = () => {
      const k = new Game(BOOTS, { seed, ...OPTIONS });
      const rr = seeded(seed * 13);
      const seen = [];
      k.on('splash', (e) => seen.push(`${k.matches}:${e.splashed}/${e.settled}`));
      while (k.left && k.pairs().length) {
        if (k.matches === 10) k.hint();
        if (k.matches === 20) k.shuffle();
        k.match(...rr.pick(k.pairs()));
      }
      return seen.join(' ');
    };
    equal(play(), play(), `seed ${seed}: the splashes, played the same way twice`);
  }
});
