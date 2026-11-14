import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { EIGHT, NINE } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { lightAt, inLight, dancesIn } from '../js/engine/disco.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { COUNTDOWN, countdownOf } from '../js/newyear.js';

const EIGHTH = COUNTDOWN[2];
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'In the spotlight');

test("the disco ball's beam sweeps down the board a row with every match, and starts again at the top once it reaches the bottom", () => {
  const floor = parseLayout('floor', ['##\n##\n##\n##']); // four rows
  equal([0, 1, 2, 3, 4, 5].map((k) => lightAt(floor, k, 1)).join(), '0,1,2,3,0,1', 'a beam a row deep');
  equal([0, 1, 2, 3].map((k) => lightAt(floor, k, 3)).join(), '0,1,0,1', 'a band three rows deep stops where its bottom row is the last');
  // A tile half a row out of line is in the light when half of it is.
  const step = parseLayout('step', ['##\n##', 'vv']);
  const half = [...step.z.keys()].find((i) => step.z[i] === 1);
  const lower = [...step.y.keys()].find((i) => step.z[i] === 0 && step.y[i] === 2);
  check(inLight(step, half, 0, 1) && inLight(step, half, 1, 1), 'a tile across two rows, lit by the beam on either');
  check(!inLight(step, lower, 0, 1) && inLight(step, lower, 1, 1), 'a tile in a row of its own, lit only by the beam on its row');
});

test('a pair taken with both its tiles in the beam dances in the spotlight, for points, and undo takes it back', () => {
  const floor = parseLayout('floor', ['##\n##\n##\n##']);
  const g = new Game(floor, { faces: facesOf('eyes-1', 'eyes-1', 'eyes-2', 'eyes-3', 'eyes-2', 'eyes-3', 'eyes-4', 'eyes-4'), disco: 1 });
  check(g.lightTop === 0 && g.inSpotlight(0) && g.inSpotlight(1) && !g.inSpotlight(2), 'the beam on the top row at the start');
  let heard = 0;
  g.on('spotlight', () => heard++);
  check(g.match(0, 1).spotlight && g.spotlights === 1 && heard === 1, 'a pair in the beam did not dance');
  check(g.lightTop === 1 && g.inSpotlight(2) && !g.inSpotlight(4), 'the beam, a row down after the match');
  check(!g.match(2, 4).spotlight, 'a pair with a tile out of the beam danced');
  check(!g.match(3, 5).spotlight, 'a pair with a tile the beam had just left danced');
  check(g.match(6, 7).spotlight && g.spotlights === 2 && g.won, 'a pair on the bottom row, when the beam reached it, did not dance');
  equal(row(g)[2], 2 * POINTS.spotlight, 'what two pairs in the spotlight score');
  g.undo();
  check(g.spotlights === 1 && g.lightTop === 3, 'an undo did not take the dance back, and the beam with it');
  const plain = new Game(floor, { faces: facesOf('eyes-1', 'eyes-1', 'eyes-2', 'eyes-3', 'eyes-2', 'eyes-3', 'eyes-4', 'eyes-4') });
  check(plain.lightTop === -1 && !plain.inSpotlight(0) && !plain.match(0, 1).spotlight && !row(plain), 'a board without a disco ball has a spotlight');
});

test('the third board of the countdown is the 8, with the disco ball: 104 tiles, nine across, its beam a row deep', () => {
  equal(EIGHTH.name, 'Eight', "the third board's number");
  equal(EIGHTH.title, 'The disco ball', "the 8's twist");
  equal(countdownOf(EIGHT), EIGHTH, "the 8's board");
  equal(EIGHT.count, 104, 'tiles');
  equal(EIGHT.width / 2, 9, 'tiles across');
  equal(EIGHT.height / 2, 12, 'rows for the beam to sweep down');
  equal(EIGHT.depth, 3, 'layers');
  equal(dayOptions(EIGHTH).disco, 1, 'rows the beam is deep');
  check(EIGHT.count > NINE.count, 'no more tiles than the 9');
});

test("the 8's deals can be won in the order they were dealt, which dances in the spotlight at least once", () => {
  const options = dayOptions(EIGHTH);
  let dances = 0;
  for (let seed = 1; seed <= 100; seed++) {
    const g = new Game(EIGHT, { seed, ...options });
    const counted = dancesIn(EIGHT, g.plan, options.disco);
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
    check(g.spotlights >= 1, `seed ${seed}: the deal's own order never dances`);
    equal(g.spotlights, counted, `seed ${seed}: pairs in the spotlight, as the deal counted them`);
    dances += g.spotlights;
  }
  return `100 deals; their own order dances ${(dances / 100).toFixed(1)} times`;
});
