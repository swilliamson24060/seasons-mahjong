import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { CART } from '../js/engine/layouts.js';
import { FACE, KINDS, MATCH } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { POINTS, scoreOf } from '../js/score.js';
import { DAYS, dayOf, dayOptions } from '../js/thanksgiving.js';

const TUESDAY = DAYS.find((d) => d.name === 'Tuesday');
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const kindOf = (key) => MATCH[FACE[key]];

// Three pairs side by side, all free, with two of them on a list whose
// checkout is the second match.
const shop = () =>
  new Game(parseLayout('shop', ['##.##.##']), {
    faces: facesOf('eyes-1', 'eyes-1', 'eyes-2', 'eyes-2', 'eyes-3', 'eyes-3'),
    list: { kinds: [kindOf('eyes-2'), kindOf('eyes-3')], checkout: 2 },
  });

test('a pair of a thing on the list crosses it off, until checkout, and undo puts it back', () => {
  const g = shop();
  const seen = [];
  g.on('list', (m) => seen.push(['list', m.crossed]));
  g.on('checkout', () => seen.push(['checkout']));
  check(g.onList(2) && !g.onList(0), 'the tiles on the list');
  equal(g.untilCheckout, 2, 'matches to checkout');
  g.match(2, 3);
  equal(g.crossed.join(), String(kindOf('eyes-2')), 'crossed off');
  check(!g.onList(2) && g.onList(4), 'what is left to find');
  g.undo();
  equal(g.crossed.length, 0, 'put back with an undo');
  g.match(0, 1);
  g.match(2, 3);
  check(!g.listOpen, 'the store has closed');
  check(!g.onList(4), 'nothing more to find after checkout');
  g.match(4, 5);
  equal(g.crossed.join(), String(kindOf('eyes-2')), 'too late for the last thing');
  equal(JSON.stringify(seen), `[["list",${kindOf('eyes-2')}],["list",${kindOf('eyes-2')}],["checkout"]]`, 'what the game said');
});

test('the list scores 25 for each thing crossed off, and 100 more for the whole list', () => {
  const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Shopping list');
  const part = shop();
  part.match(2, 3);
  equal(row(part)[2], POINTS.listed, 'one of two');
  const whole = shop();
  whole.match(2, 3);
  whole.match(4, 5);
  equal(row(whole)[2], 2 * POINTS.listed + POINTS.list, 'the whole list');
  equal(row(whole)[1], '2 of 2, the lot', 'in words');
});

test("Tuesday is the grocery run, on a shopping cart of 94 tiles, nine across", () => {
  equal(TUESDAY.title, 'The grocery run', "Tuesday's theme");
  equal(dayOf(CART), TUESDAY, "the cart's day");
  equal(CART.count, 94, 'tiles');
  equal(CART.width / 2, 9, 'tiles across');
  const options = dayOptions(TUESDAY);
  check(options.list && !options.treats && !options.ghostsFloat, "Tuesday's rules: a list, and no treats or ghosts");
});

test("Tuesday's list is four things the deal takes before checkout, so it can always be finished, and the board won", () => {
  const options = dayOptions(TUESDAY);
  let freeAtStart = 0;
  for (let seed = 1; seed <= 300; seed++) {
    const g = new Game(CART, { seed, ...options });
    const { kinds, checkout } = g.list;
    equal(kinds.length, 4, `seed ${seed}: things on the list`);
    equal(new Set(kinds).size, 4, `seed ${seed}: different things`);
    check(kinds.every((k) => KINDS[k].faces.length === 1), `seed ${seed}: a flower or a moon on the list`);
    equal(checkout, 24, `seed ${seed}: checkout`);
    for (const k of kinds) if (g.freeTiles().filter((i) => MATCH[g.faces[i]] === k).length >= 2) freeAtStart++;
    for (const [a, b] of g.plan) {
      check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
      if (g.matches === checkout) equal(g.crossed.length, 4, `seed ${seed}: the list at checkout`);
    }
    check(g.won, `seed ${seed}: not cleared`);
  }
  check(freeAtStart / 300 < 0.25, `a pair of ${(freeAtStart / 300).toFixed(2)} of the 4 things free at the start, on average`);
  return `300 deals; a pair of ${(freeAtStart / 300).toFixed(2)} of the 4 things free at the start, on average`;
});

test('the same seed gives the same list, so a board comes back as it was', () => {
  const options = dayOptions(TUESDAY);
  for (const seed of [7, 99, 12345]) {
    equal(new Game(CART, { seed, ...options }).list.kinds.join(), new Game(CART, { seed, ...options }).list.kinds.join(), `seed ${seed}`);
  }
});
