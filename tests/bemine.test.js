import { test, check, equal } from './run.js';
import { RING } from '../js/engine/layouts.js';
import { MATCH } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { LOVE_STORY, chapterOf } from '../js/valentines.js';

const EIGHTH = LOVE_STORY[7];
// Be mine's words for the score, as main.js tells it.
const WORDS = { night: 'The answer is yes,', day: 'The answer is yes,', souls: 'Broken hearts', none: 'no broken hearts' };

// The tiles of the ring's bottom layer in a row, given in half tiles, by
// where each starts across.
const across = (y) => [...RING.x.keys()].filter((i) => RING.z[i] === 0 && RING.y[i] === y).map((i) => RING.x[i]);

test('the eighth chapter is be mine, a diamond ring: the full set of 144 tiles on six layers, nine across, the most of the eight, turning over halfway when the question is popped', () => {
  equal(EIGHTH.name, 'The eighth chapter', "the eighth chapter's name");
  equal(EIGHTH.title, 'Be mine', "the eighth chapter's title");
  equal(chapterOf(RING), EIGHTH, "the ring's chapter");
  equal(RING.count, 144, 'tiles');
  equal(RING.width / 2, 9, 'tiles across');
  equal(RING.depth, 6, 'layers');
  const options = dayOptions(EIGHTH);
  equal(options.turnAt, 36, 'the matches before the question');
  check(!options.treats && !options.ghostsFloat, 'no treats or floating ghosts');
  equal(EIGHTH.words, 'question', 'told as the question popped');
  equal(LOVE_STORY.length, 8, 'the chapters made');
  check(LOVE_STORY.every((d, k) => k === 0 || d.layout.count > LOVE_STORY[k - 1].layout.count), 'the boards do not grow through the love story');
  check(['question is popped', 'turns over', 'match on both sides', 'broken heart'].every((w) => EIGHTH.text.includes(w)), "the card doesn't tell the turn, or what a tile left alone becomes");
});

test('the ring reads as a diamond raised high on a band round an open middle, coming to a point where it sits on the band', () => {
  equal(across(0).join(), '4,6,8,10,12', "the diamond's table");
  equal(across(2).join(), '2,4,8,12,14', "the diamond's foot, hollow under its crown beside its middle");
  equal([...RING.x.keys()].filter((i) => RING.z[i] === 3 && RING.y[i] === 2).map((i) => RING.x[i]).join(), '3,5,7,9,11,13', 'the crown at its widest, raised');
  equal(across(6).join(), '8', 'the point, where the diamond sits on the band');
  equal(across(12).join(), '0,2,4,12,14,16', "the band's shoulders");
  equal(across(14).join(), '0,2,14,16', "the band's sides, round its open middle");
  check(![...RING.x.keys()].some((i) => RING.x[i] + 2 > 6 && RING.x[i] < 12 && RING.y[i] + 2 > 12 && RING.y[i] < 18), 'a tile in the open middle of the band');
  const peak = [...RING.x.keys()].filter((i) => RING.z[i] === 5);
  check(peak.length === 1 && RING.x[peak[0]] === 8 && RING.y[peak[0]] === 2, 'the diamond not raised six high at its middle');
});

test("be mine's deals can be won through the turn, and a player who takes pairs that match on both sides meets no broken hearts", () => {
  const options = dayOptions(EIGHTH);
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(RING, { seed, ...options });
    let broken = null;
    for (const [a, b] of g.plan) {
      const m = g.match(a, b);
      check(m, `seed ${seed}: a pair of the deal's own order cannot be taken`);
      if (m.turned) broken = m.souls.length;
    }
    check(g.won, `seed ${seed}: not cleared`);
    equal(broken, 0, `seed ${seed}: broken hearts as the question is popped`);
  }
  return '200 deals';
});

test('the hints find a way through be mine, from a move of your own', () => {
  const options = dayOptions(EIGHTH);
  let tried = 0;
  for (let seed = 1; seed <= 10; seed++) {
    const g = new Game(RING, { seed, ...options });
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
  check(tried >= 8, `only ${tried} of 10 boards stayed winnable`);
  return `${tried} of 10 boards`;
});

test("be mine's score is told in its own words: the answer is yes, with no broken hearts, or so many", () => {
  const g = new Game(RING, { seed: 4, ...dayOptions(EIGHTH) });
  for (const [a, b] of g.plan) g.match(a, b);
  const rows = scoreOf(g, 0, WORDS).rows.map((r) => r[0]);
  check(rows.includes('The answer is yes, with no broken hearts'), `the rows: ${rows.join(', ')}`);
});
