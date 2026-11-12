import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { FEAST } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { scoreOf, par } from '../js/score.js';
import { DAYS, dayOf, dayOptions } from '../js/thanksgiving.js';

const THURSDAY = DAYS.find((d) => d.name === 'Thursday');
const facesOf = (...keys) => keys.map((key) => FACE[key]);

// A row of four, its ends free, with no pair among them until one of them
// goes in the fridge.
const row = (fridge) => new Game(parseLayout('row', ['####']), { faces: facesOf('eyes-1', 'eyes-2', 'eyes-1', 'eyes-2'), fridge });

test('a free tile put in the fridge holds nothing down, still matches, and undo puts it back', () => {
  const g = row(1);
  equal(g.pairs().length, 0, 'no pair on the table');
  check(!g.stuck, 'not stuck, with room in the fridge');
  const slot = g.save(0);
  equal(slot, 4, 'the container, after the table');
  check(g.inFridge(slot) && g.present[slot] && !g.present[0], 'moved from the table to the fridge');
  check(g.isFree(1), 'the tile it held down is free');
  equal(g.save(3), -1, 'a full fridge takes no more');
  check(g.match(1, 3), 'a pair on the table');
  check(!g.won, 'not cleared while a tile is in the fridge');
  check(g.match(slot, 2), 'the tile in the fridge, with its partner');
  check(g.won, 'cleared');
  g.undo();
  g.undo();
  g.undo();
  check(g.present[0] && !g.present[slot] && g.fridgeRoom === 1, 'back on the table, the fridge empty');
});

test('stuck means nothing can be taken, and nothing more can go in the fridge', () => {
  check(row(0).stuck, 'with no fridge');
  check(!row(1).stuck, 'with room in the fridge');
});

test('Thursday is the feast, on a Thanksgiving table of 108 tiles, nine across, with a fridge of three and a nap', () => {
  equal(THURSDAY.title, 'The Feast', "Thursday's theme");
  equal(dayOf(FEAST), THURSDAY, "the table's day");
  equal(FEAST.count, 108, 'tiles');
  equal(FEAST.width / 2, 9, 'tiles across');
  const options = dayOptions(THURSDAY);
  check(options.fridge === 3 && !options.treats && !options.ghostsFloat, "Thursday's rules: a fridge of three, and no treats or ghosts");
  equal(JSON.stringify(THURSDAY.nap), JSON.stringify({ by: 1 / 2, matches: 10 }), 'the nap: halfway through, for ten matches');
});

test("Thursday's deals can be won in the order they were dealt", () => {
  const options = dayOptions(THURSDAY);
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(FEAST, { seed, ...options });
    equal(g.layout.count, 111, `seed ${seed}: places, the containers with the table`);
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
  }
});

test('with tiles in the fridge, the hints still find a way to win', () => {
  const options = dayOptions(THURSDAY);
  let tried = 0;
  for (let seed = 1; seed <= 12; seed++) {
    const g = new Game(FEAST, { seed, ...options });
    for (let k = 0; k < 1 + (seed % 3); k++) g.save(g.freeTiles().filter((i) => !g.inFridge(i))[seed % 5]);
    g.suggest();
    if (g.outlook !== 'win') continue; // what went in the fridge happened to lose the board
    tried++;
    while (!g.won) {
      const pair = g.hint();
      check(pair && g.match(...pair), `seed ${seed}: the hint with ${g.left} tiles left`);
    }
  }
  check(tried >= 10, `only ${tried} of 12 boards stayed winnable`);
  return `${tried} of 12 boards`;
});

test('a shuffle deals the tiles in the fridge too, and the board can still be won', () => {
  const options = dayOptions(THURSDAY);
  for (let seed = 1; seed <= 30; seed++) {
    const g = new Game(FEAST, { seed, ...options });
    for (let n = 0; n < seed % 10; n++) g.match(...g.suggest());
    g.save(g.freeTiles().filter((i) => !g.inFridge(i))[0]);
    g.save(g.freeTiles().filter((i) => !g.inFridge(i))[0]);
    check(g.shuffle(), `seed ${seed}: no shuffle`);
    equal(g.fridgeRoom, 1, `seed ${seed}: the fridge after the shuffle`);
    for (const [a, b] of g.line.slice()) check(g.match(a, b), `seed ${seed}: a pair of the shuffle's line cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
  }
});

test("the score counts the table's tiles, not the fridge's places", () => {
  const g = new Game(FEAST, { seed: 3, ...dayOptions(THURSDAY) });
  for (let n = 0; n < 5; n++) g.match(...g.suggest());
  equal(scoreOf(g, 0).rows[0][2], 50, 'five pairs');
  equal(par(g), 108 * 5, 'par, five seconds a tile');
});
