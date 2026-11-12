import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { SALE } from '../js/engine/layouts.js';
import { FACE, MATCH } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { POINTS, scoreOf } from '../js/score.js';
import { DAYS, dayOf, dayOptions } from '../js/thanksgiving.js';

const FRIDAY = DAYS.find((d) => d.name === 'Friday');
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const states = (g) => g.busters.map((d) => d.state).join();

// Four pairs side by side, all free, two of them doorbusters, with another
// shopper grabbing after every second match.
const store = () =>
  new Game(parseLayout('store', ['##.##.##.##']), {
    faces: facesOf('eyes-1', 'eyes-1', 'eyes-2', 'eyes-2', 'eyes-3', 'eyes-3', 'eyes-4', 'eyes-4'),
    doorbusters: { tiles: [[2, 3], [4, 5]], every: 2 },
  });

test('a pair with a doorbuster in it is yours, another shopper grabs the first free one after so many matches, and undo puts it all back', () => {
  const g = store();
  const said = [];
  g.on('bought', () => said.push('bought'));
  g.on('grab', (m) => said.push(`grab ${m.grab.join('+')}`));
  check(g.isBuster(2) && !g.isBuster(0), 'the tagged tiles');
  equal(g.untilGrab, 2, 'matches to the first grab');
  g.match(0, 1);
  equal(states(g), 'open,open', 'nothing yet');
  g.match(2, 3);
  equal(states(g), 'mine,gone', 'one bought, and the other grabbed');
  check(!g.present[4] && !g.present[5], 'the grabbed pair is gone');
  equal(g.left, 2, 'tiles left');
  equal(scoreOf(g, 0).rows.find((r) => r[0] === 'Doorbusters')[2], POINTS.buster, 'the one bought scores');
  equal(scoreOf(g, 0).rows[0][2], 2 * POINTS.pair, "the grabbed pair isn't the player's");
  g.undo();
  equal(states(g), 'open,open', 'both open again after an undo');
  check(g.present[4] && g.present[5] && g.left === 6, 'the grabbed pair is back');
  equal(said.join(' | '), 'bought | grab 4+5', 'what the game said');
});

test('another shopper only grabs a doorbuster when both its tiles are free', () => {
  const L = parseLayout('shelf', ['##.##.####']);
  const g = new Game(L, {
    faces: facesOf('eyes-1', 'eyes-1', 'eyes-2', 'eyes-2', 'eyes-3', 'eyes-4', 'eyes-3', 'eyes-4'),
    doorbusters: { tiles: [[4, 6]], every: 1 },
  });
  g.match(0, 1);
  equal(states(g), 'open', 'its middle tile is hemmed in, so it stays');
  g.match(2, 3);
  equal(states(g), 'open', 'still hemmed in');
});

test('Friday is Black Friday, on a sale tag of 110 tiles, seven across, with four doorbusters', () => {
  equal(FRIDAY.title, 'Black Friday', "Friday's theme");
  equal(dayOf(SALE), FRIDAY, "the tag's day");
  equal(SALE.count, 110, 'tiles');
  equal(SALE.width / 2, 7, 'tiles across');
  const options = dayOptions(FRIDAY);
  check(options.doorbusters && options.doorbusters.pairs === 4 && options.doorbusters.every === 5 && !options.treats, "Friday's rules");
});

test("Friday's doorbusters are pairs its deal takes together, none free from the start, and its boards can be won whoever takes them", () => {
  const options = dayOptions(FRIDAY);
  let mine = 0;
  let gone = 0;
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(SALE, { seed, ...options });
    equal(g.busters.length, 4, `seed ${seed}: doorbusters`);
    for (const d of g.busters) {
      check(g.plan.some(([a, b]) => (a === d.tiles[0] && b === d.tiles[1]) || (a === d.tiles[1] && b === d.tiles[0])), `seed ${seed}: a doorbuster that is not a pair of the deal`);
      check(!(g.isFree(d.tiles[0]) && g.isFree(d.tiles[1])), `seed ${seed}: a doorbuster free from the start`);
    }
    // A player who takes the pairs of the line as it goes, other shoppers grabbing as they will.
    while (!g.won) {
      const pair = g.suggest();
      check(pair && g.match(...pair), `seed ${seed}: the line with ${g.left} tiles left`);
    }
    mine += g.busters.filter((d) => d.state === 'mine').length;
    gone += g.busters.filter((d) => d.state === 'gone').length;
  }
  return `200 deals; following the line, ${(mine / 200).toFixed(1)} bought and ${(gone / 200).toFixed(1)} grabbed a board`;
});

test('a shuffle keeps each open doorbuster a pair that matches, and an undo puts the tags back', () => {
  const options = dayOptions(FRIDAY);
  for (let seed = 1; seed <= 40; seed++) {
    const g = new Game(SALE, { seed, ...options });
    for (let n = 0; n < seed % 12; n++) g.match(...g.suggest());
    const before = g.busters.map((d) => d.tiles.join('+')).join();
    check(g.shuffle(), `seed ${seed}: no shuffle`);
    const open = g.busters.filter((d) => d.state === 'open');
    for (const d of open) check(MATCH[g.faces[d.tiles[0]]] === MATCH[g.faces[d.tiles[1]]] && g.present[d.tiles[0]] && g.present[d.tiles[1]], `seed ${seed}: a doorbuster that does not match`);
    equal(new Set(open.flatMap((d) => d.tiles)).size, open.length * 2, `seed ${seed}: doorbusters sharing a tile`);
    g.undo();
    equal(g.busters.map((d) => d.tiles.join('+')).join(), before, `seed ${seed}: the tags after an undo`);
  }
});
