import { test, check, equal } from './run.js';
import * as layouts from '../js/engine/layouts.js';
import { BOW } from '../js/engine/layouts.js';
import { Game } from '../js/engine/game.js';
import { dayOptions } from '../js/thanksgiving.js';
import { LOVE_STORY, chapterOf } from '../js/valentines.js';
import { theme } from '../js/themes.js';

const FIRST = LOVE_STORY[0];

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
