import { test, check, equal } from './run.js';
import * as layouts from '../js/engine/layouts.js';
import { BOW, HEART } from '../js/engine/layouts.js';
import { Game } from '../js/engine/game.js';
import { dayOptions } from '../js/thanksgiving.js';
import { LOVE_STORY, chapterOf } from '../js/valentines.js';
import { theme } from '../js/themes.js';
import { FACE_SETS, faceName } from '../js/ui/faces.js';
import { FACE } from '../js/engine/tiles.js';

const FIRST = LOVE_STORY[0];
const SECOND = LOVE_STORY[1];

// The tiles of a layout's bottom layer in a row, given in half tiles, by
// where each starts across.
const across = (L, y) => [...L.x.keys()].filter((i) => L.z[i] === 0 && L.y[i] === y).map((i) => L.x[i]);

test("Valentine's love story is told in chapters, each its own board, none more than nine tiles across", () => {
  for (const d of LOVE_STORY) {
    check(d.layout && d.title && d.text && d.sky, `${d.name} is not made`);
    check(d.layout.width / 2 <= 9, `${d.name}'s board is ${d.layout.width / 2} tiles across`);
  }
  equal(new Set(LOVE_STORY.map((d) => d.layout)).size, LOVE_STORY.length, 'boards, one a chapter');
  check(LOVE_STORY.length <= 8, `${LOVE_STORY.length} chapters, more than eight`);
  check(!theme('valentines').ready, "Valentine's Day ready, with its boards still being made");
});

test("the first chapter is Cupid's bow, the gentle start: 72 tiles on four layers, nine across, and no twist", () => {
  equal(FIRST.name, 'The first chapter', "the first chapter's name");
  equal(FIRST.title, "Cupid's bow", "the first chapter's title");
  equal(chapterOf(BOW), FIRST, "the bow's chapter");
  check(Object.keys(layouts).includes('BOW'), 'the bow plays by its address, #play/bow');
  equal(BOW.count, 72, 'tiles');
  equal(BOW.width / 2, 9, 'tiles across');
  equal(BOW.depth, 4, 'layers');
  check(LOVE_STORY.every((d) => d === FIRST || d.layout.count > BOW.count), 'the fewest tiles of the eight');
  equal(JSON.stringify(dayOptions(FIRST)), JSON.stringify({ treats: false, ghostsFloat: false }), 'no twist');
});

test("Cupid's bow reads as a bow and arrow: the head above the bow, the bow open round the arrow, and the string pulled back to a V", () => {
  // In half tiles: a tile at x covers x to x + 2 across, its row y to y + 2.
  equal(across(BOW, 0).join(), '8', "the arrow's tip");
  equal(across(BOW, 4).join(), '4,6,8,10,12', "the arrowhead's barbs");
  equal(across(BOW, 6).join(), '8', 'the shaft alone between the head and the bow');
  equal(across(BOW, 14).join(), '0,8,16', 'the bow open round the arrow, its tips on either side');
  equal(across(BOW, 18).join(), '4,8,12', 'the string coming in to the arrow');
  equal(across(BOW, 20).join(), '6,8,10', 'the string meeting the arrow at its feathers');
  // The arrow runs down the middle, its shaft raised three high.
  const shaft = [...BOW.x.keys()].filter((i) => BOW.x[i] === 8 && BOW.y[i] >= 6 && BOW.y[i] <= 18);
  equal(shaft.length, 7 * 3, 'tiles of the shaft, from below the head down to the string, on three layers');
});

test("Valentine's tiles are named as the holiday is, so that the turtle wears them too with Valentine's chosen, and a tile left without a partner is a broken heart", () => {
  check(FACE_SETS.includes(theme('valentines').id), "no set of faces called as Valentine's Day is");
  equal(faceName(FACE['lost-soul'], 'valentines'), 'Broken heart', 'the lost soul, for Be mine');
});

test("Cupid's bow's deals can be won in the order they were dealt, with the bow's string free from the start", () => {
  const options = dayOptions(FIRST);
  let free = 0;
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(BOW, { seed, ...options });
    free += g.freeTiles().length;
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
  }
  // The string's tiles, from each tip in to the arrow, as its card says.
  const string = [...BOW.x.keys()].filter((i) => BOW.z[i] === 0 && ((BOW.y[i] === 16 && BOW.x[i] !== 8) || (BOW.y[i] === 18 && BOW.x[i] !== 8)));
  equal(string.length, 4, "the string's tiles");
  const g = new Game(BOW, { seed: 1, ...options });
  for (const i of string) check(g.isFree(i), "a tile of the bow's string is not free at the start");
  check(FIRST.text.includes("bow's string"), "the card doesn't tell the free-tile rule by the string");
  return `200 deals; ${(free / 200).toFixed(0)} tiles free at the start`;
});

test("the second chapter is love at first sight, a heart pierced by Cupid's arrow: 92 tiles on three layers, nine across, an arrow every eight matches", () => {
  equal(SECOND.name, 'The second chapter', "the second chapter's name");
  equal(SECOND.title, 'Love at first sight', "the second chapter's title");
  equal(chapterOf(HEART), SECOND, "the heart's chapter");
  check(Object.keys(layouts).includes('HEART'), 'the heart plays by its address, #play/heart');
  equal(HEART.count, 92, 'tiles');
  equal(HEART.width / 2, 9, 'tiles across');
  equal(HEART.depth, 3, 'layers');
  check(HEART.count > BOW.count, 'no more tiles than the bow');
  equal(dayOptions(SECOND).arrows, 8, 'an arrow every eight matches');
  check(SECOND.text.includes('love at first sight') && SECOND.text.includes('30 points'), "the card doesn't say what the arrows are for");
});

test('the pierced heart reads as a heart with an arrow through it, sticking out at both ends: its feathers at the upper left and its head at the lower right', () => {
  equal(across(HEART, 0).join(), '2', "the feathers' tip");
  equal(across(HEART, 2).join(), '0,2', 'the feathers');
  equal(across(HEART, 4).join(), '2,4,6,10,12,14', "the heart's two lobes, the notch between them");
  equal(across(HEART, 6).join(), '0,2,4,6,8,10,12,14,16', 'the heart at its widest');
  equal(across(HEART, 16).join(), '8,12,14,16', "the heart's point, and the arrow's head beside it");
  // The arrow runs across it, raised, on the top layer from its feathers
  // to its head.
  equal([...HEART.x.keys()].filter((i) => HEART.z[i] === 2).length, 10, 'tiles of the arrow on the top layer');
});

test("the pierced heart's deals can be won in the order they were dealt, Cupid letting fly six times", () => {
  const options = dayOptions(SECOND);
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(HEART, { seed, ...options });
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
    equal(g.arrowsFlown, 6, `seed ${seed}: arrows over 46 matches`);
  }
  return '200 deals';
});
