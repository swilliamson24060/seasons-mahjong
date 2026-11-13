import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { HEN } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { dayOptions } from '../js/thanksgiving.js';
import { TWELVE_DAYS, dayOfChristmas } from '../js/christmas.js';
import { EGG, symbolId, faceName } from '../js/ui/faces.js';

const THIRD = TWELVE_DAYS[2];
const facesOf = (...keys) => keys.map((key) => FACE[key]);

// Four tiles side by side: the two at the ends free, and the two between
// them blocked, to be eggs.
const nest = (eggs) => new Game(parseLayout('nest', ['####']), { faces: facesOf('eyes-1', 'eyes-2', 'eyes-2', 'eyes-1'), eggs });

test('eggs are tiles that start blocked, each hatching as it comes free, and staying hatched through an undo', () => {
  const g = nest(3);
  equal([0, 1, 2, 3].map((i) => g.isEgg(i)).join(), 'false,true,true,false', 'only the blocked tiles are eggs, however many are asked for');
  equal(g.eggsLeft, 2, 'eggs');
  let heard = [];
  g.on('hatch', ({ hatched }) => (heard = hatched));
  equal(g.match(0, 3).hatched.join(), '1,2', 'the eggs that came free hatched');
  equal(heard.join(), '1,2', 'and said so');
  equal(g.eggsLeft, 0, 'eggs left');
  g.undo();
  check(!g.isEgg(1) && !g.isEgg(2), 'an undo put a tile back in its egg');
  check(!g.isFree(1), 'the tile is free after the undo');
  equal(g.match(0, 3).hatched.length, 0, 'tiles hatched a second time');
});

test('a board shows an egg in place of the tile inside it, and names it so', () => {
  equal(symbolId(EGG), 'egg', "the egg's drawing");
  equal(symbolId(EGG, 'thanksgiving'), 'egg', 'the same in every set');
  equal(faceName(EGG, 'thanksgiving'), 'An egg, still to hatch', "the egg's name");
  equal(nest(0).eggs, null, 'eggs on a board without them');
});

test('the third day is three French hens, on a hen of 92 tiles, nine across, with a dozen eggs', () => {
  equal(THIRD.title, 'Three French hens', "the third day's gift");
  equal(dayOfChristmas(HEN), THIRD, "the hen's day");
  equal(HEN.count, 92, 'tiles');
  equal(HEN.width / 2, 9, 'tiles across');
  equal(HEN.depth, 3, 'layers');
  equal(dayOptions(THIRD).eggs, 12, 'eggs');
  check(TWELVE_DAYS[1].layout.count < HEN.count, 'no more tiles than the second day');
});

test("the third day's deals can be won in the order they were dealt, with a dozen eggs, all hatched by the end", () => {
  const options = dayOptions(THIRD);
  let lastSum = 0;
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(HEN, { seed, ...options });
    equal(g.eggsLeft, 12, `seed ${seed}: eggs`);
    check(g.freeTiles().every((i) => !g.isEgg(i)), `seed ${seed}: an egg is free from the start`);
    let last = 0;
    for (const [a, b] of g.plan) {
      check(!g.isEgg(a) && !g.isEgg(b), `seed ${seed}: an egg taken before it hatched`);
      check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
      if (!last && g.eggsLeft === 0) last = g.matches;
    }
    check(g.won && g.eggsLeft === 0, `seed ${seed}: not cleared, or eggs left`);
    lastSum += last;
  }
  return `200 deals; the last egg hatches after ${(lastSum / 200).toFixed(0)} of ${HEN.count / 2} matches, on the deal's own order`;
});
