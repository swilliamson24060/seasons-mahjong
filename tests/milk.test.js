import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { PAIL } from '../js/engine/layouts.js';
import { FACE, MATCH } from '../js/engine/tiles.js';
import { possiblePails } from '../js/engine/milk.js';
import { Game } from '../js/engine/game.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { TWELVE_DAYS, dayOfChristmas } from '../js/christmas.js';

const EIGHTH = TWELVE_DAYS[7];
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Fresh milk');
// Two rows, apart: a row of six, whose second and fifth tiles are a pail,
// and a row of four.
const dairy = (keeps = 2) =>
  new Game(parseLayout('dairy', ['######\n......\n####']), {
    faces: facesOf('eyes-1', 'eyes-2', 'eyes-3', 'eyes-3', 'eyes-2', 'eyes-1', 'eyes-4', 'eyes-5', 'eyes-5', 'eyes-4'),
    milk: { tiles: [[1, 4]], keeps },
  });

test("a pail keeps from when either of its tiles comes free, so many matches, counted down; then it sours, and an undo freshens it", () => {
  const g = dairy();
  check(g.freshIn(0) === null, 'a pail keeping before either tile is free');
  g.match(0, 5);
  equal(g.freshIn(0), 2, 'matches it keeps for, once a tile is free');
  equal(g.pailOf(1), 0, "a tile's pail");
  g.match(6, 9);
  equal(g.freshIn(0), 1, 'matches it keeps for, a match later');
  let soured = 0;
  g.on('milk', (m) => (soured += m.soured));
  g.match(7, 8);
  check(g.pails[0].state === 'sour' && soured === 1 && g.pailOf(1) === -1, 'the pail did not sour');
  equal(row(g)[1], '0 of 1, 1 soured', 'the row, soured');
  g.undo();
  check(g.pails[0].state === 'fresh' && g.freshIn(0) === 1, 'an undo did not freshen it');
});

test("a pail's two tiles taken together take it, for points; either taken with another tile spills it", () => {
  const g = dairy();
  g.match(0, 5);
  const m = g.match(1, 4);
  check(m.milked === 1 && g.pails[0].state === 'taken' && g.pailsTaken === 1, 'the pail was not taken');
  equal(row(g)[2], POINTS.milk, 'what it scores');
  g.undo();
  equal(g.pailsTaken, 0, 'taken back with an undo');

  // Four of a kind in a row, the first and third a pail: the first taken
  // with the fourth spills it.
  const spill = new Game(parseLayout('spill', ['####']), { faces: facesOf('eyes-1', 'eyes-1', 'eyes-1', 'eyes-1'), milk: { tiles: [[0, 2]], keeps: 8 } });
  equal(spill.freshIn(0), 8, 'a pail with a tile free from the start keeps from the start');
  const s = spill.match(0, 3);
  check(s.spilt === 1 && s.milked === 0 && spill.pails[0].state === 'spilt', 'the pail did not spill');
  equal(row(spill)[1], '0 of 1, 1 spilt', 'the row, spilt');
  spill.undo();
  equal(spill.pails[0].state, 'fresh', 'an undo did not put the milk back');

  const plain = new Game(parseLayout('plain', ['##']), { faces: facesOf('eyes-1', 'eyes-1') });
  check(plain.pails === null && plain.pailOf(0) === -1 && plain.match(0, 1).milked === 0, 'a pail on a board without them');
  check(!row(plain), 'a row for them on a board without them');
});

test('the eighth day is eight maids a-milking, on a milk pail of 112 tiles, nine across, with eight pails of fresh milk', () => {
  equal(EIGHTH.title, 'Eight maids a-milking', "the eighth day's gift");
  equal(dayOfChristmas(PAIL), EIGHTH, "the pail's day");
  equal(PAIL.count, 112, 'tiles');
  equal(PAIL.width / 2, 9, 'tiles across');
  equal(PAIL.depth, 4, 'layers');
  equal(JSON.stringify(dayOptions(EIGHTH).milk), JSON.stringify({ pails: 8, keeps: 8 }), 'pails, and how long each keeps');
  check(TWELVE_DAYS[6].layout.count < PAIL.count, 'no more tiles than the seventh day');
});

test("the eighth day's deals can be won in the order they were dealt, and that order takes all eight pails fresh, as they come free through the board", () => {
  const options = dayOptions(EIGHTH);
  const starts = [];
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(PAIL, { seed, ...options });
    equal(g.pails.length, 8, `seed ${seed}: pails`);
    const free = new Set(g.freeTiles());
    for (const p of g.pails) {
      check(g.plan.some(([a, b]) => p.tiles.includes(a) && p.tiles.includes(b)), `seed ${seed}: a pail that is not a pair of the deal's own order`);
      check(!p.tiles.some((t) => free.has(t)), `seed ${seed}: a pail with a tile free from the start`);
    }
    check(possiblePails(PAIL, g.plan, 8).length >= 8, `seed ${seed}: too few pairs that could be pails`);
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won && g.pailsTaken === 8, `seed ${seed}: ${g.pailsTaken} pails taken fresh on the deal's own order`);
    starts.push(...g.pails.map((p) => p.freeAt));
  }
  starts.sort((p, q) => p - q);
  const [first, half, last] = [0.1, 0.5, 0.9].map((q) => starts[Math.floor(starts.length * q)]);
  check(first < 12 && last > 36, 'the pails do not come free all through the board');
  return `200 deals; on the deal's own order, the pails begin to keep after ${first}, ${half} and ${last} of 56 matches (a tenth, half and nine tenths of them)`;
});

test('a shuffle on the milk pail keeps each fresh pail a pair that matches, and an undo puts the pails back', () => {
  const g = new Game(PAIL, { seed: 9, ...dayOptions(EIGHTH) });
  for (const [a, b] of g.plan.slice(0, 14)) g.match(a, b);
  const before = JSON.stringify(g.pails);
  check(g.shuffle(), 'no shuffle');
  for (const p of g.pails.filter((q) => q.state === 'fresh')) check(MATCH[g.faces[p.tiles[0]]] === MATCH[g.faces[p.tiles[1]]], 'a fresh pail whose tiles no longer match');
  g.undo();
  equal(JSON.stringify(g.pails), before, 'the pails after an undo');
});
