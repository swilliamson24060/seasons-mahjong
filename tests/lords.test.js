import { test, check, equal } from './run.js';
import { parseLayout, isFree } from '../js/engine/layout.js';
import { CROWN } from '../js/engine/layouts.js';
import { FACE, MATCH } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { TWELVE_DAYS, dayOfChristmas } from '../js/christmas.js';

const TENTH = TWELVE_DAYS[9];
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Leaping lords');

test("a lord is free wherever he is, hemmed in or under another tile; taken while held down, he's leapt, for points, and undo takes it back", () => {
  // A row of three, the lord hemmed in in the middle, and a tile of his kind
  // apart from them.
  const L = parseLayout('court', ['###.#']);
  const g = new Game(L, { faces: facesOf('eyes-1', 'eyes-2', 'eyes-1', 'eyes-2'), lords: [1] });
  check(g.isLord(1) && g.isFree(1) && !isFree(L, g.present, 1), 'a lord hemmed in is not free');
  equal(g.lordsLeft, 1, 'lords on the board');
  let heard = 0;
  g.on('leap', ({ leapt }) => (heard += leapt));
  check(g.match(1, 3).leapt === 1 && g.leaps === 1 && heard === 1, 'a lord taken while hemmed in did not leap');
  equal(row(g)[2], POINTS.leap, 'what a leap scores');
  equal(g.lordsLeft, 0, 'lords on the board, once taken');
  g.undo();
  check(g.leaps === 0 && g.lordsLeft === 1, 'an undo did not take the leap back');
  // Free by the usual rule, he doesn't leap.
  g.match(0, 2);
  check(g.match(1, 3).leapt === 0 && g.leaps === 0, 'a lord already free leapt');

  // Two tiles, one on top of the other, can't be taken, unless the one
  // underneath is a lord: and the hints know it.
  const stack = new Game(parseLayout('stack', ['#', '#']), { faces: facesOf('eyes-5', 'eyes-5'), lords: [0] });
  equal(JSON.stringify(stack.suggest().slice().sort()), '[0,1]', 'the hint, with a lord underneath');
  check(stack.match(0, 1).leapt === 1 && stack.won, 'a lord under another tile could not be taken with it');
  const plain = new Game(parseLayout('stack', ['#', '#']), { faces: facesOf('eyes-5', 'eyes-5') });
  check(!plain.canMatch(0, 1) && plain.lords === null && !row(plain), 'two tiles one on top of the other taken without a lord');
});

test('the tenth day is ten lords a-leaping, on a crown of 120 tiles, nine across, with ten lords', () => {
  equal(TENTH.title, 'Ten lords a-leaping', "the tenth day's gift");
  equal(dayOfChristmas(CROWN), TENTH, "the crown's day");
  equal(CROWN.count, 120, 'tiles');
  equal(CROWN.width / 2, 9, 'tiles across');
  equal(CROWN.depth, 4, 'layers');
  equal(dayOptions(TENTH).lords, 10, 'lords');
  check(TWELVE_DAYS[8].layout.count < CROWN.count, 'no more tiles than the ninth day');
});

test("the tenth day's deals can be won in the order they were dealt and by the hints, with ten lords, each of a kind of his own and held down at the start", () => {
  const options = dayOptions(TENTH);
  let leaps = 0;
  for (let seed = 1; seed <= 100; seed++) {
    const g = new Game(CROWN, { seed, ...options });
    const lords = [...g.lords.keys()].filter((i) => g.lords[i]);
    equal(lords.length, 10, `seed ${seed}: lords`);
    equal(new Set(lords.map((i) => MATCH[g.faces[i]])).size, 10, `seed ${seed}: kinds among the lords`);
    check(lords.every((i) => !isFree(CROWN, g.present, i)), `seed ${seed}: a lord free from the start by the usual rule`);
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared on the deal's own order`);
    if (seed <= 20) {
      const h = new Game(CROWN, { seed, ...options });
      while (!h.won) {
        const pair = h.suggest();
        check(pair && h.match(...pair), `seed ${seed}: the hints cannot go on after ${h.matches} matches`);
        if (!pair) break;
      }
      leaps += h.leaps;
    }
  }
  return `100 deals; following the hints, the lords leap ${(leaps / 20).toFixed(1)} times a board`;
});
