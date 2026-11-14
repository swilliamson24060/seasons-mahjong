import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { THREE, FOUR } from '../js/engine/layouts.js';
import { FACE, MATCH } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { wishRows, starRow } from '../js/engine/stars.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { COUNTDOWN, countdownOf } from '../js/newyear.js';

const THIRD = COUNTDOWN[7];
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Wishes');

test('a star crosses a row with two free tiles of a kind in it, or with none of those, a row with two tiles of a kind', () => {
  // Four rows: two free tiles of a kind at the top; a held pair in the
  // third, its second tile hemmed in.
  const L = parseLayout('rows', ['##.\n#.#\n###\n#..']);
  const faces = facesOf('eyes-1', 'eyes-1', 'eyes-2', 'eyes-3', 'eyes-4', 'eyes-4', 'eyes-5', 'eyes-2');
  const present = new Uint8Array(L.count).fill(1);
  const kindOf = (f) => MATCH[f];
  equal(wishRows(L, present, faces, kindOf).join(), '0', 'the row to wish on at once');
  present[0] = present[1] = 0;
  equal(wishRows(L, present, faces, kindOf).join(), '2', 'with none, the row to dig a wish out of');
  equal(starRow([3, 5, 8], 7, 2), starRow([3, 5, 8], 7, 2), 'the same star, reached the same way');
  equal(starRow([], 7, 2), -1, 'no star with no row');
});

test('a pair taken from the row the star crossed makes its wish, one to a star, for points; another star crosses every so many matches, and undo takes it all back', () => {
  // Two rows of two pairs: across the top, a pair at each end; below, two
  // pairs each across the gap.
  const L = parseLayout('sky', ['##..##\n##..##']);
  const g = new Game(L, { faces: facesOf('eyes-1', 'eyes-1', 'eyes-2', 'eyes-2', 'eyes-3', 'eyes-4', 'eyes-3', 'eyes-4'), stars: 2 });
  const pairsIn = { 0: [[0, 1], [2, 3]], 1: [[4, 6], [5, 7]] };
  const first = g.star.row;
  check(g.starCount === 1 && g.untilStar === 2 && g.wishes === 0, 'the star as the board starts');
  let heard = 0;
  g.on('star', () => heard++);
  const wish = g.match(...pairsIn[first][0]);
  check(wish.wish && !wish.starDue && g.wishes === 1 && g.star.wished && heard === 1, 'a pair from its row did not make the wish');
  const next = g.match(...pairsIn[1 - first][0]);
  check(!next.wish && next.starDue && next.star && g.starCount === 2 && !g.star.wished && heard === 2, 'another star, two matches on');
  equal(row(g)[2], POINTS.wish, 'what a wish scores');
  equal(row(g)[1], '1 of 2 stars', 'the wishes, told');
  g.undo();
  check(g.starCount === 1 && g.star.row === first && g.star.wished && g.wishes === 1, 'an undo did not take the second star back');
  g.undo();
  check(!g.star.wished && g.wishes === 0, 'an undo did not take the wish back');
  const plain = new Game(L, { faces: facesOf('eyes-1', 'eyes-1', 'eyes-2', 'eyes-2', 'eyes-3', 'eyes-4', 'eyes-3', 'eyes-4') });
  check(plain.star === null && plain.untilStar === Infinity && !plain.match(0, 1).wish && !row(plain), 'a board without stars has them');
});

test('the eighth board of the countdown is the 3, with shooting stars: 134 tiles, nine across, a star every three matches', () => {
  equal(THIRD.name, 'Three', "the eighth board's number");
  equal(THIRD.title, 'Shooting stars', "the 3's twist");
  equal(countdownOf(THREE), THIRD, "the 3's board");
  equal(THREE.count, 134, 'tiles');
  equal(THREE.width / 2, 9, 'tiles across');
  equal(THREE.depth, 5, 'layers');
  equal(dayOptions(THIRD).stars, 3, 'a star every three matches');
  check(THREE.count > FOUR.count, 'no more tiles than the 4');
});

test("the 3's deals can be won in the order they were dealt, a star crossing every three matches where a wish can be made, until near the end there's nowhere one can", () => {
  const options = dayOptions(THIRD);
  let wishes = 0;
  let none = 0;
  for (let seed = 1; seed <= 100; seed++) {
    const g = new Game(THREE, { seed, ...options });
    g.on('star', ({ starDue, star }) => {
      if (!starDue) return;
      if (star) check(wishRows(g.layout, g.present, g.faces, (f) => MATCH[f]).includes(star.row), `seed ${seed}: a star crossing a row where no wish can be made`);
      else {
        none++;
        check(g.left <= 30, `seed ${seed}: no star with ${g.left} tiles left`);
      }
    });
    check(g.star !== null, `seed ${seed}: no star as the board starts`);
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
    equal(g.starCount, Math.ceil(THREE.count / 2 / 3), `seed ${seed}: stars due`);
    wishes += g.wishes;
  }
  return `100 deals; their own order makes ${(wishes / 100).toFixed(1)} wishes on ${Math.ceil(THREE.count / 2 / 3)} stars, ${(none / 100).toFixed(1)} of them, near the end, with nowhere to cross`;
});
