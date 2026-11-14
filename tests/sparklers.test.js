import { test, check, equal } from './run.js';
import { parseLayout, isFree } from '../js/engine/layout.js';
import { FIVE, SIX } from '../js/engine/layouts.js';
import { FACE, MATCH } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { COUNTDOWN, countdownOf } from '../js/newyear.js';

const FIFTH = COUNTDOWN[5];
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Sparklers');

// A row of four, its second tile a sparkler, held down; and three pairs
// apart. The first tile goes with the first of the pairs, the sparkler
// with the second.
const L = parseLayout('party', ['####.##.##.##']);
const faces = facesOf('eyes-1', 'eyes-2', 'eyes-3', 'eyes-3', 'eyes-1', 'eyes-2', 'eyes-4', 'eyes-4', 'eyes-5', 'eyes-5');
const party = () => new Game(L, { faces, sparklers: { tiles: [1], burns: 2 } });

test('a sparkler lights as its tile comes free and burns down; taken while it burns, it scores what is left of it, and undo takes it back', () => {
  const g = party();
  check(g.sparklerOf(1).state === 'unlit' && g.sparklersLeft === 1, 'the sparkler, unlit while held down');
  let heard = 0;
  g.on('sparkler', () => heard++);
  const light = g.match(0, 4);
  equal(light.kindled.join(), '1', 'the sparkler lit, its tile come free');
  equal(g.burnLeft(g.sparklerOf(1)), 2, 'matches it has to burn');
  const take = g.match(1, 5);
  equal(JSON.stringify(take.sparked), JSON.stringify([{ tile: 1, left: 2 }]), 'the sparkler taken, burning, with what was left of it');
  check(heard === 2 && g.sparklersLeft === 0, 'the sparkler, heard and taken');
  equal(row(g)[2], 2 * POINTS.spark, 'what it scores');
  equal(row(g)[1], '1 of 1 taken burning', 'the sparklers, told');
  g.undo();
  check(g.sparklerOf(1).state === 'lit' && g.sparklersLeft === 1, 'an undo did not light the sparkler again');
});

test('a sparkler not taken while it burns burns out, and scores nothing when its tile is taken', () => {
  const g = party();
  g.match(0, 4);
  check(g.match(6, 7).fizzled.length === 0, 'a sparkler out before its time');
  equal(g.match(8, 9).fizzled.join(), '1', 'the sparkler burnt out after two matches');
  check(g.sparklerOf(1) === undefined && g.sparklersLeft === 0, 'a sparkler burnt out, still to take');
  check(g.match(1, 5).sparked.length === 0 && g.match(2, 3) && g.won, 'a burnt-out sparkler scored');
  equal(row(g)[2], 0, 'what a burnt-out sparkler scores');
  equal(row(g)[1], '0 of 1 taken burning, 1 burnt out', 'the sparklers, told');
  g.undo();
  g.undo();
  g.undo();
  check(g.sparklerOf(1).state === 'lit' && g.burnLeft(g.sparklerOf(1)) === 1, 'an undo did not light the sparkler again');
  const plain = new Game(L, { faces });
  check(plain.sparklers === null && plain.sparklerOf(1) === undefined && plain.match(0, 4).kindled.length === 0 && !row(plain), 'a board without sparklers has them');
});

test('the sixth board of the countdown is the 5, with sparklers: 122 tiles, nine across, five sparklers burning five matches', () => {
  equal(FIFTH.name, 'Five', "the sixth board's number");
  equal(FIFTH.title, 'Sparklers', "the 5's twist");
  equal(countdownOf(FIVE), FIFTH, "the 5's board");
  equal(FIVE.count, 122, 'tiles');
  equal(FIVE.width / 2, 9, 'tiles across');
  equal(FIVE.depth, 4, 'layers');
  equal(JSON.stringify(dayOptions(FIFTH).sparklers), JSON.stringify({ count: 5, burns: 5 }), 'the sparklers');
  check(FIVE.count > SIX.count, 'no more tiles than the 6');
});

test("the 5's deals can be won in the order they were dealt, which takes every sparkler while it burns, each held down at the start and of a kind of its own", () => {
  const options = dayOptions(FIFTH);
  let points = 0;
  for (let seed = 1; seed <= 100; seed++) {
    const g = new Game(FIVE, { seed, ...options });
    const tiles = g.sparklers.map((s) => s.tile);
    equal(tiles.length, 5, `seed ${seed}: sparklers`);
    check(tiles.every((t) => !isFree(FIVE, g.present, t)), `seed ${seed}: a sparkler free from the start`);
    equal(new Set(tiles.map((t) => MATCH[g.faces[t]])).size, 5, `seed ${seed}: kinds among the sparklers`);
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
    equal(g.sparklers.filter((s) => s.state === 'taken').length, 5, `seed ${seed}: sparklers the deal's own order took burning`);
    points += row(g)[2];
  }
  return `100 deals; their own order takes all five burning, for ${(points / 100).toFixed(0)} points`;
});
