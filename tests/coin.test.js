import { test, check, equal } from './run.js';
import { parseLayout, isFree } from '../js/engine/layout.js';
import { SEVEN, EIGHT } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { seeded } from '../js/engine/rng.js';
import { apart, heatOf, hideCoin } from '../js/engine/coin.js';
import { POINTS, scoreOf, coinWorth } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { COUNTDOWN, countdownOf } from '../js/newyear.js';

const SEVENTH = COUNTDOWN[3];
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Lucky coin');

test('the lucky coin says how close each pair came to it, hot, warm or cold, until it turns up as its tile comes free, worth more the sooner; and undo takes it back', () => {
  // A row of four, its middle two held down, the coin in the second of
  // them; then a pair three tiles from it, and another further off.
  const L = parseLayout('cake', ['####.##.##']);
  const rules = { hot: 1, warm: 3 };
  equal(apart(L, 2, 3), 1, 'tiles side by side, a tile apart');
  equal(heatOf(L, [3, 6], 2, rules), 'hot', 'a pair with a tile beside the coin');
  check(['1', '2'].includes(String(hideCoin(L, Uint8Array.from({ length: 8 }, () => 1), seeded(5)))), 'the coin hidden in a tile not held down');
  const g = new Game(L, { faces: facesOf('eyes-2', 'eyes-3', 'eyes-3', 'eyes-2', 'eyes-1', 'eyes-1', 'eyes-4', 'eyes-4'), coin: { ...rules, tile: 2 } });
  const heard = [];
  g.on('coin', ({ found, heat }) => heard.push(found ? 'found' : heat));
  check(g.coin === 2 && g.reading === null && !g.foundAt, 'the coin, hidden');
  equal(g.match(6, 7).heat, 'cold', 'a pair six tiles off');
  equal(g.match(4, 5).heat, 'warm', 'a pair three tiles off');
  const find = g.match(0, 3);
  check(find.found && find.heat === null && g.foundAt === 3, 'the pair that freed the coin did not find it');
  equal(heard.join(), 'cold,warm,found', 'what the coin said');
  check(isFree(L, g.present, 2), "the coin's tile, free");
  equal(row(g)[2], coinWorth(3), 'what the coin scores');
  equal(coinWorth(3), POINTS.coin - 2 * POINTS.coinFade, 'found on the third match');
  equal(coinWorth(200), POINTS.coinLeast, 'found late, at the least');
  g.match(1, 2);
  check(g.won && g.foundAt === 3 && g.match(1, 2) === null, 'the coin taken with its tile');
  g.undo();
  g.undo();
  check(!g.foundAt && g.reading === 'warm', 'an undo did not hide the coin again');
  const plain = new Game(L, { faces: facesOf('eyes-2', 'eyes-3', 'eyes-3', 'eyes-2', 'eyes-1', 'eyes-1', 'eyes-4', 'eyes-4') });
  check(plain.coin === -1 && plain.match(6, 7).heat === null && !row(plain), 'a board without a coin has one');
});

test('the fourth board of the countdown is the 7, a lucky seven: 110 tiles, nine across, a coin hidden in it', () => {
  equal(SEVENTH.name, 'Seven', "the fourth board's number");
  equal(SEVENTH.title, 'Lucky seven', "the 7's twist");
  equal(countdownOf(SEVEN), SEVENTH, "the 7's board");
  equal(SEVEN.count, 110, 'tiles');
  equal(SEVEN.width / 2, 9, 'tiles across');
  equal(SEVEN.depth, 4, 'layers');
  equal(JSON.stringify(dayOptions(SEVENTH).coin), JSON.stringify({ hot: 1, warm: 3 }), 'how near is hot, and how near warm');
  check(SEVEN.count > EIGHT.count, 'no more tiles than the 8');
});

test("the 7's deals can be won in the order they were dealt, the coin hidden in a tile on the bottom layer held down at the start, and found on the way", () => {
  const options = dayOptions(SEVENTH);
  let found = 0;
  for (let seed = 1; seed <= 100; seed++) {
    const g = new Game(SEVEN, { seed, ...options });
    check(g.coin >= 0 && SEVEN.z[g.coin] === 0 && !isFree(SEVEN, g.present, g.coin), `seed ${seed}: the coin not in a tile on the bottom layer held down`);
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
    check(g.foundAt >= 1, `seed ${seed}: the coin never found`);
    found += g.foundAt;
  }
  return `100 deals; their own order finds the coin on match ${(found / 100).toFixed(0)} of ${SEVEN.count / 2}, on average`;
});
