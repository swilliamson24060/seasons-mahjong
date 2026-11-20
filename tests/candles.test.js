import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { CANDLES } from '../js/engine/layouts.js';
import { Game } from '../js/engine/game.js';
import { glowTop, glowOf, candlelit, candlelitIn } from '../js/engine/candles.js';
import { seeded } from '../js/engine/rng.js';
import { POINTS, scoreOf } from '../js/score.js';

const RULES = { every: 6, deep: 3, pairs: 6 };
const OPTIONS = { treats: false, ghostsFloat: false, candles: RULES };
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Candlelit pairs');
const tileAt = (L, x, y, z = 0) => [...L.x.keys()].find((i) => L.x[i] === x && L.y[i] === y && L.z[i] === z);

test("the candles' glow starts at the top and sinks a row every so many matches, until a glow so deep no longer fits; a tile is in his glow on the left or hers on the right; a candlelit pair takes one in each", () => {
  // Five rows of four, two tiles a side.
  const L = parseLayout('rows', ['##.##\n##.##\n##.##\n##.##\n##.##']);
  const rules = { every: 6, deep: 2 };
  equal([0, 5, 6, 17, 18, 23, 24].map((m) => glowTop(L, m, rules)).join(), '0,0,1,2,3,3,-1', "the glow's top row after so many matches");
  const [hisTop, hersTop, hisLow] = [tileAt(L, 0, 0), tileAt(L, 8, 0), tileAt(L, 2, 6)];
  check(glowOf(L, hisTop, 0, 2) === 'his' && glowOf(L, hersTop, 0, 2) === 'hers', 'the top row not lit, left his and right hers');
  check(glowOf(L, hisLow, 0, 2) === null && glowOf(L, hisLow, 2, 2) === 'his' && glowOf(L, hisTop, -1, 2) === null, 'a tile lit outside the glow, or once the candles are out');
  check(candlelit(L, hisTop, hersTop, 0, 2) && !candlelit(L, hisTop, tileAt(L, 2, 0), 0, 2) && !candlelit(L, hisLow, hersTop, 0, 2), 'a candlelit pair not one in each glow');
  // An order taking the two top tiles across the table first, and then two
  // on the same side: one candlelit pair.
  equal(candlelitIn(L, [[hisTop, hersTop], [tileAt(L, 2, 0), tileAt(L, 0, 2)]], rules), 1, 'candlelit pairs in an order');
  equal(candlelitIn(L, [[hisTop, hersTop]], rules, 24), 0, 'candlelit pairs after the candles are out');
});

test("the first date's deal takes at least six candlelit pairs in its own order, and the hints take one whenever they can: following them, every deal takes more", () => {
  let own = 0;
  let hinted = 0;
  let least = Infinity;
  for (let seed = 1; seed <= 60; seed++) {
    const g = new Game(CANDLES, { seed, ...OPTIONS });
    const n = candlelitIn(CANDLES, g.plan, RULES);
    check(n >= 6, `seed ${seed}: the deal's own order takes only ${n} candlelit pairs`);
    own += n;
    while (g.left) g.match(...g.suggest());
    check(g.won, `seed ${seed}: following the hints, not cleared`);
    hinted += g.candlelitPairs;
    least = Math.min(least, g.candlelitPairs);
    equal(row(g)[2], g.candlelitPairs * POINTS.candlelit, `seed ${seed}: what the candlelit pairs score`);
  }
  check(hinted > own, `following the hints took ${hinted} candlelit pairs, the deals' own orders ${own}`);
  return `60 deals: their own orders take ${(own / 60).toFixed(1)} candlelit pairs, and following the hints ${(hinted / 60).toFixed(1)}, never fewer than ${least}`;
});

test('a pair with a tile in each glow is candlelit; every six matches the glow sinks a row, until the candles gutter out; and an undo takes each back', () => {
  const g = new Game(CANDLES, { seed: 3, ...OPTIONS });
  equal(`${g.glowTop} ${g.untilSink}`, '0 6', "the glow's top row, and the matches until it sinks, at the start");
  const sinks = [];
  let said = 0;
  while (g.left) {
    let result = g.match(...g.suggest());
    if (result.byCandlelight && !said) {
      said = g.candlelitPairs;
      g.undo();
      check(g.candlelitPairs === said - 1, 'an undo did not take the candlelit pair back');
      result = g.match(result.a, result.b);
      check(result.byCandlelight && g.candlelitPairs === said, 'the candlelit pair, taken again, not candlelit');
    }
    if (result.sank) sinks.push(g.matches);
    if (result.guttered) sinks.push(`out at ${g.matches}`);
  }
  check(said, 'no candlelit pair taken');
  equal(row(g)[1], `${g.candlelitPairs} × ${POINTS.candlelit}`, 'candlelit pairs, told');
  equal(sinks.join(), '6,12,18,24,30,36,42,out at 48', 'the glow sinking, and the candles guttering out');
  equal(`${g.glowTop} ${g.untilSink}`, `-1 ${Infinity}`, 'the glow, once the candles are out');

  const plain = new Game(CANDLES, { seed: 3, treats: false });
  check(plain.candles === null && plain.glowOf(0) === null && plain.glowTop === -1 && !row(plain), 'a board without candles has their glow');
});

test('a shuffle leaves the glow as it was, and an undo puts the tiles back; a board reached the same way sees the same candlelit pairs', () => {
  const g = new Game(CANDLES, { seed: 9, ...OPTIONS });
  for (let m = 0; m < 8; m++) g.match(...g.suggest());
  const [top, until, faces] = [g.glowTop, g.untilSink, JSON.stringify(g.faces)];
  check(g.shuffle(), 'no shuffle');
  check(g.glowTop === top && g.untilSink === until, 'a shuffle moved the glow');
  g.undo();
  equal(JSON.stringify(g.faces), faces, 'the tiles, after an undo of the shuffle');
  g.shuffle();
  while (g.left) g.match(...g.suggest());
  check(g.won, 'following the hints after a shuffle, not cleared');

  for (const seed of [1, 2, 3, 4]) {
    const play = () => {
      const k = new Game(CANDLES, { seed, ...OPTIONS });
      const r = seeded(seed * 13);
      const seen = [];
      k.on('candlelight', (e) => seen.push(`${k.matches}:${e.byCandlelight}/${e.sank}/${e.guttered}`));
      while (k.left && k.pairs().length) {
        if (k.matches === 10) k.hint();
        if (k.matches === 20) k.shuffle();
        k.match(...r.pick(k.pairs()));
      }
      return seen.join(' ');
    };
    equal(play(), play(), `seed ${seed}: the candlelight, played the same way twice`);
  }
});
