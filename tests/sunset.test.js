import { test, check, equal } from './run.js';
import { SUNSET, LIGHTHOUSE } from '../js/engine/layouts.js';
import { MATCH, LOST } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { isFree } from '../js/engine/layout.js';
import { scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SUMMER, summerOf, sunsetPart } from '../js/summer.js';
import { TURNS } from '../js/words.js';

const EIGHTH = SUMMER[7];
const OPTIONS = dayOptions(EIGHTH);
// The tiles on a layer in a row, given in half tiles, by where each starts
// across.
const at = (z, y) => [...SUNSET.x.keys()].filter((i) => SUNSET.z[i] === z && SUNSET.y[i] === y).map((i) => SUNSET.x[i]).join();

test("the eighth chapter is the sunset, the sun going down into the sea: the full set of 144 tiles on four layers, nine across, the most of the eight, turning over halfway from the day's side to the evening's", () => {
  equal(EIGHTH.name, 'The eighth chapter', "the eighth chapter's name");
  equal(EIGHTH.title, 'Sunset', "the eighth chapter's title");
  equal(summerOf(SUNSET), EIGHTH, "the sunset's chapter");
  equal(SUNSET.count, 144, 'tiles');
  equal(SUNSET.width / 2, 9, 'tiles across');
  equal(SUNSET.height / 2, 11, 'tiles down');
  equal(SUNSET.depth, 4, 'layers');
  check(SUNSET.count > LIGHTHOUSE.count, 'no more tiles than the lighthouse');
  equal(OPTIONS.turnAt, 36, 'the matches before sunset');
  equal(new Game(SUNSET, { seed: 1, ...OPTIONS }).sideName, 'day', 'the side it starts on, the day');
  check(!OPTIONS.treats && !OPTIONS.ghostsFloat && !OPTIONS.soulsFloat, 'treats, floating ghosts, or lost flip-flops floating');
  equal(EIGHTH.words, 'sunset', 'told as the sun setting');
  equal(SUMMER.length, 8, 'the chapters made');
  check(SUMMER.every((d, k) => k === 0 || d.layout.count > SUMMER[k - 1].layout.count), 'the boards do not grow through the season');
  check(['turns over', 'match on both sides', 'lost flip-flop', 'stay where they were left'].every((w) => EIGHTH.text.includes(w)), "the card doesn't tell the turn, or what a tile left alone becomes");
});

test('the sunset reads as a sunset: the sun a half-disc on the horizon, domed, highest where it meets the sea, its beams round it, and the sea below, the sun\'s reflection raised on it', () => {
  equal([0, 2, 4].map((y) => at(0, y)).join(' | '), '8 | 2,8,14 | 4,12', 'the sunbeams, straight up and aslant');
  equal(at(0, 6), '0,6,8,10,16', "the sun's top, and a beam either side");
  equal([8, 10].map((y) => at(0, y)).join(' | '), '4,6,8,10,12 | 2,4,6,8,10,12,14', 'the sun, widest on the horizon');
  equal(at(3, 10), '6,8,10', 'the sun, highest where it meets the sea');
  equal([12, 20].map((y) => at(0, y)).join(' | '), '0,2,4,6,8,10,12,14,16 | 0,2,4,6,8,10,12,14,16', 'the sea, across the board');
  equal([12, 20].map((y) => at(2, y)).join(' | '), '4,6,8,10,12 | 8', "the sun's reflection, narrowing away down the water");
  const parts = {};
  for (let i = 0; i < SUNSET.count; i++) {
    const p = sunsetPart(SUNSET, i);
    parts[p] = (parts[p] || 0) + 1;
  }
  equal(['sunbeam', 'setting-sun', 'sun-glow', 'sun-core', 'horizon', 'evening-sea', 'glint'].map((p) => `${p} ${parts[p]}`).join(', '), 'sunbeam 9, setting-sun 30, sun-glow 9, sun-core 3, horizon 16, evening-sea 64, glint 13', 'its parts, for its look');
  equal(EIGHTH.look, sunsetPart, 'the sunset not tinted as its parts are');
});

test("the sunset's deals can be won through the turn, and a player who takes pairs that match on both sides loses no flip-flops", () => {
  for (let seed = 1; seed <= 100; seed++) {
    const g = new Game(SUNSET, { seed, ...OPTIONS });
    let lost = null;
    for (const [a, b] of g.plan) {
      const m = g.match(a, b);
      check(m, `seed ${seed}: a pair of the deal's own order cannot be taken`);
      if (m.turned) lost = m.souls.length;
    }
    check(g.won, `seed ${seed}: not cleared`);
    equal(`${lost} ${g.sideName}`, '0 night', `seed ${seed}: the flip-flops lost as the sun set, and the side it ended on`);
  }
  return '100 deals';
});

test('a lost flip-flop stays where it was left, held down as any tile is, and matches only another', () => {
  let lost = 0;
  let held = 0;
  for (let seed = 1; seed <= 12; seed++) {
    const g = new Game(SUNSET, { seed, ...OPTIONS });
    // Pairs that don't match on the evening's side, taken before sunset,
    // leave their partners alone there.
    while (g.turnAhead && g.pairs().length) {
      const pairs = g.pairs();
      g.match(...(pairs.find(([a, b]) => MATCH[g.sides[1][a]] !== MATCH[g.sides[1][b]]) || pairs[0]));
    }
    if (g.turnAhead) continue; // stuck before the sun set
    const flipflops = [...SUNSET.x.keys()].filter((i) => g.present[i] && g.faces[i] === LOST);
    lost += flipflops.length;
    const down = flipflops.filter((i) => !isFree(SUNSET, g.present, i));
    held += down.length;
    for (const t of down) check(!g.isFree(t), `seed ${seed}: a lost flip-flop held down, free`);
    check(g.pairs().every(([a, b]) => (g.faces[a] === LOST) === (g.faces[b] === LOST)), `seed ${seed}: a lost flip-flop paired with a tile of another kind`);
  }
  check(lost > 0 && held > 0, `${lost} flip-flops lost, ${held} held down: none to show held`);
  return `12 deals: ${lost} lost flip-flops, ${held} of them covered or hemmed in`;
});

// Lost flip-flops held down, a careless pair before sunset can leave one
// under its partner, and the board lost.
test('the hints find a way through the sunset, from a move of your own, wherever one is still there', () => {
  let tried = 0;
  for (let seed = 1; seed <= 10; seed++) {
    const g = new Game(SUNSET, { seed, ...OPTIONS });
    const own = g.pairs().find(([a, b]) => MATCH[g.sides[1][a]] !== MATCH[g.sides[1][b]]) || g.pairs()[0];
    g.match(...own);
    g.suggest();
    if (g.outlook !== 'win') continue;
    tried++;
    while (!g.won) {
      const pair = g.hint();
      check(pair && g.match(...pair), `seed ${seed}: the hint with ${g.left} tiles left`);
      if (!pair) break;
    }
  }
  check(tried >= 6, `only ${tried} of 10 boards stayed winnable`);
  return `${tried} of 10 boards stayed winnable, and the hints won them all`;
});

test("the sunset's score is told in its own words: sunset with no lost flip-flops, or so many", () => {
  const g = new Game(SUNSET, { seed: 4, ...OPTIONS });
  for (const [a, b] of g.plan) g.match(a, b);
  const rows = scoreOf(g, 0, TURNS.sunset.score).rows.map((r) => r[0]);
  check(rows.includes('Sunset with no lost flip-flops'), `the rows: ${rows.join(', ')}`);
  const w = TURNS.sunset;
  equal(`${w.ahead(3)} | ${w.after()} | ${w.soul}`, '☀️ <b>3</b> to sunset | 🌅 the sun has set | 🩴', 'the top bar, before and after');
  check(w.woke(2).includes('2 flip-flops are lost') && w.woke(1).includes('1 flip-flop is lost') && w.woke(0) === 'Not one flip-flop lost.', 'the turn, told');
  equal(w.ring(), 'sunset', 'the sound of the turn');
});
