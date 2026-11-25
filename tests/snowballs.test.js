import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { SNOWMAN, LION } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { landingSpots, landingOf, knocks } from '../js/engine/snowballs.js';
import { touching } from '../js/engine/flock.js';
import { seeded } from '../js/engine/rng.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SPRING, springOf, snowmanPart } from '../js/spring.js';

const SECOND = SPRING[1];
const OPTIONS = dayOptions(SECOND);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Snow knocked off');
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const at = (L, z, y) => [...L.x.keys()].filter((i) => L.z[i] === z && L.y[i] === y).map((i) => L.x[i]).join();

// Three columns of two, each tile alone in its row, so every one is free:
// the top row 0, 1 and 2, the bottom 3, 4 and 5, each touching the one
// above or below it.
const COLUMNS = parseLayout('columns', ['#.#.#\n#.#.#']);

test('a snowball lands on a free tile the way ahead won\'t want before it melts, with a tile beside it; a pair knocks off the snow of the tiles it touches', () => {
  const all = new Uint8Array(COLUMNS.count).fill(1);
  check(touching(COLUMNS, 0, 3) && !touching(COLUMNS, 0, 1), 'the columns not touching as drawn');
  equal(landingSpots(COLUMNS, [0, 1, 2, 3, 4, 5], all, [], 2).join(), '0,1,2,3,4,5', 'where it could land with no way to keep');
  equal(landingSpots(COLUMNS, [0, 1, 2, 3, 4, 5], all, [[0, 1], [2, 3], [4, 5]], 2).join(), '4,5', 'where it could land, the way taking 0 and 1, then 2 and 3, first');
  const lonely = Uint8Array.from([1, 1, 1, 0, 1, 1]);
  equal(landingSpots(COLUMNS, [0, 1, 2, 4, 5], lonely, [], 2).join(), '1,2,4,5', 'where it could land with nothing beside 0 to knock it off with');
  equal(landingOf([], 3, 0), -1, 'a snowball with nowhere to land');
  equal(landingOf([4, 5, 9], 3, 2), landingOf([4, 5, 9], 3, 2), 'where it lands, not the same for the same board');
  check([4, 5, 9].includes(landingOf([4, 5, 9], 3, 2)), 'landing elsewhere than where it could');
  equal(knocks(COLUMNS, [3, 2], 0, 4).join(), '3', 'the snow a pair knocks off');
});

test("a tile snowed in can't be taken until a pair beside it knocks the snow off, for points, or the snow melts; an undo puts it back", () => {
  // 0 and 1 a pair, 2 and 3, 4 and 5.
  const faces = facesOf('eyes-1', 'eyes-1', 'eyes-2', 'eyes-2', 'eyes-3', 'eyes-3');
  const g = new Game(COLUMNS, { faces, snowballs: { every: 100, melt: 3 } });
  equal(`${g.snowedTiles().length} ${g.snowKnocked} ${g.untilSnow}`, '0 0 100', 'the snow at the start');
  g.ice[3] = g.matches + 3; // snowed in, as a snowball does
  check(g.snowedIn(3) && !g.isFree(3) && !g.pairs().some((p) => p.includes(3)), 'a snowed tile free to take');
  const heard = [];
  g.on('snow', (e) => heard.push(e.knocked.join()));
  const r = g.match(0, 1);
  equal(r.knocked.join(), '3', 'the snow the pair beside it knocked off');
  check(!g.snowedIn(3) && g.isFree(3) && !r.thawed.includes(3), 'the snow knocked off still there, or told as melted');
  equal(`${g.snowKnocked} ${row(g)[2]}`, `1 ${POINTS.snow}`, 'the snow knocked off, and what it scores');
  equal(heard.join(), '3', 'the snow knocked off, heard');
  g.undo();
  check(g.snowedIn(3) && g.snowKnocked === 0, 'an undo did not put the snow back');

  // Left alone, it melts: 2, touching only 5, snowed for a match.
  const k = new Game(COLUMNS, { faces, snowballs: { every: 100, melt: 1 } });
  k.ice[2] = k.matches + 1;
  const m = k.match(0, 1);
  check(m.knocked.length === 0 && m.thawed.includes(2) && k.isFree(2), 'snow left alone not melting');

  // With nothing to take but what the snow holds, the sun melts it: 2 and
  // 5 snowed, the pair of 0 and 1, touching neither, leaves nothing else.
  const s = new Game(COLUMNS, { faces, snowballs: { every: 100, melt: 5 } });
  s.ice[2] = s.matches + 5;
  s.ice[5] = s.matches + 5;
  check(!s.match(2, 3) && !s.match(4, 5), 'a snowed tile taken');
  const m2 = s.match(0, 1);
  check(m2.knocked.length === 0 && m2.thawed.includes(2) && m2.thawed.includes(5) && s.pairs().length === 2, 'the snow not melting, with nothing else to take');

  const plain = new Game(COLUMNS, { faces });
  check(!plain.snowEvery && !plain.snowedIn(0) && !plain.match(0, 1).knocked.length && !row(plain), 'a board without snowballs snowing');
});

test('the second chapter is the thaw: a snowman melting, 92 tiles on four layers, nine across, his hat slipping, his base sinking into the slush over a puddle', () => {
  equal(SECOND.name, 'The second chapter', "the second chapter's name");
  equal(SECOND.title, 'The thaw', "the second chapter's title");
  equal(springOf(SNOWMAN), SECOND, "the snowman's chapter");
  equal(SNOWMAN.count, 92, 'tiles');
  equal(SNOWMAN.width / 2, 9, 'tiles across');
  equal(SNOWMAN.height / 2, 10, 'tiles down');
  equal(SNOWMAN.depth, 4, 'layers');
  check(SNOWMAN.count > LION.count, 'no more tiles than the lion');
  equal(JSON.stringify(OPTIONS.snowballs), JSON.stringify({ every: 5, melt: 4 }), 'a snowball every five matches, melting in four');
  equal(at(SNOWMAN, 0, 0), '8,10', "his hat's crown, slipping to the right");
  equal(at(SNOWMAN, 0, 18), '0,2,4,6,8,10,12,14,16', 'the puddle along his foot');
  equal(at(SNOWMAN, 2, 5), '8', 'his carrot nose');
  equal(at(SNOWMAN, 1, 5), '7,9', 'his coal eyes');
  const parts = {};
  for (let i = 0; i < SNOWMAN.count; i++) {
    const p = snowmanPart(SNOWMAN, i);
    parts[p] = (parts[p] || 0) + 1;
  }
  equal(['snow', 'hat', 'twig', 'puddle', 'coal', 'carrot', 'scarf'].map((p) => `${p} ${parts[p]}`).join(', '), 'snow 61, hat 7, twig 4, puddle 11, coal 4, carrot 1, scarf 4', 'his parts, for his look');
  check(['snowball', 'snows', 'beside it', 'knock the snow off', 'melts'].every((w) => SECOND.text.includes(w)), "the card doesn't tell the snowballs");
});

test("the thaw's deals can be cleared following the hints, the snowballs landing as they go and never sticking the board; a player taking pairs at random knocks some snow off", () => {
  let landed = 0;
  let hinted = 0;
  let knocked = 0;
  for (let seed = 1; seed <= 24; seed++) {
    const g = new Game(SNOWMAN, { seed, ...OPTIONS });
    while (g.left) {
      const pair = g.suggest();
      check(pair, `seed ${seed}: no hint with ${g.left} tiles left`);
      if (!pair) break;
      check(g.match(...pair), `seed ${seed}: the hint can't be taken`);
    }
    check(g.won, `seed ${seed}: following the hints, not cleared`);
    landed += g.snowLanded;
    hinted += g.snowKnocked;
    const p = new Game(SNOWMAN, { seed, ...OPTIONS });
    const r = seeded(seed * 41);
    while (p.left && p.pairs().length) p.match(...r.pick(p.pairs()));
    knocked += p.snowKnocked;
  }
  check(landed >= 24 * 6, `only ${landed} snowballs landed`);
  check(knocked > 0, 'no snow knocked off');
  check(hinted > knocked, `following the hints knocked off ${hinted}, no more than pairs at random, ${knocked}`);
  return `24 deals: ${(landed / 24).toFixed(1)} snowballs a board following the hints, ${(hinted / 24).toFixed(1)} knocked off; pairs at random knocked off ${(knocked / 24).toFixed(1)}`;
});

test('a board played the same way sees the same snowballs, however its hints are asked for', () => {
  for (const seed of [1, 2, 3]) {
    const play = (hints) => {
      const k = new Game(SNOWMAN, { seed, ...OPTIONS });
      const rr = seeded(seed * 13);
      const seen = [];
      k.on('snow', (e) => seen.push(`${k.matches}:${e.snowball}/${e.knocked.join('+')}`));
      while (k.left && k.pairs().length) {
        if (hints && k.matches % 3 === 0) k.hint();
        k.match(...rr.pick(k.pairs()));
      }
      return seen.join(' ');
    };
    equal(play(true), play(false), `seed ${seed}: the snowballs, played the same way with hints and without`);
  }
});
