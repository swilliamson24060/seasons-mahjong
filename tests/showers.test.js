import { test, check, equal } from './run.js';
import * as layouts from '../js/engine/layouts.js';
import { CLOUD } from '../js/engine/layouts.js';
import { Game } from '../js/engine/game.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SHOWERS, showerOf } from '../js/showers.js';
import { theme } from '../js/themes.js';

const FIRST = SHOWERS[0];

// The tiles of a layout's bottom layer in a row, given in half tiles, by
// where each starts across.
const across = (L, y) => [...L.x.keys()].filter((i) => L.z[i] === 0 && L.y[i] === y).map((i) => L.x[i]);

// The rain cloud's raindrops: the tiles below the cloud, whose foot is at
// eleven half tiles down.
const drops = () => [...CLOUD.x.keys()].filter((i) => CLOUD.y[i] > 11);

test('April Showers is told in eight chapters, each its own board, none more than nine tiles across, and ready to play, all eight made', () => {
  for (const d of SHOWERS) {
    check(d.layout && d.title && d.text && d.sky, `${d.name} is not made`);
    check(d.layout.width / 2 <= 9, `${d.name}'s board is ${d.layout.width / 2} tiles across`);
  }
  equal(new Set(SHOWERS.map((d) => d.layout)).size, SHOWERS.length, 'boards, one a chapter');
  equal(SHOWERS.length, 8, 'chapters');
  check(theme('showers').ready, 'April Showers not ready, with all eight of its boards made');
});

test('the first chapter is the first shower, a rain cloud, the gentle start: 84 tiles on four layers, nine across, and no twist', () => {
  equal(FIRST.name, 'The first chapter', "the first chapter's name");
  equal(FIRST.title, 'The first shower', "the first chapter's title");
  equal(showerOf(CLOUD), FIRST, "the cloud's chapter");
  check(Object.keys(layouts).includes('CLOUD'), 'the cloud plays by its address, #play/cloud');
  equal(CLOUD.count, 84, 'tiles');
  equal(CLOUD.width / 2, 9, 'tiles across');
  equal(CLOUD.depth, 4, 'layers');
  equal(JSON.stringify(dayOptions(FIRST)), JSON.stringify({ treats: false, ghostsFloat: false }), 'no twist');
});

test('the rain cloud reads as a cloud, its biggest puff billowing up in the middle and a smaller one at its left, and its raindrops falling beneath it in three slanting lines', () => {
  // In half tiles: a tile at x covers x to x + 2 across, its row y to y + 2.
  equal(across(CLOUD, 0).join(), '8,10', "the big puff's top");
  equal(across(CLOUD, 2).join(), '2,4,8,10,12', 'the small puff at the left, a gap between it and the big one');
  equal(across(CLOUD, 6).join(), '0,2,4,6,8,10,12,14,16', 'the cloud at its widest');
  equal(across(CLOUD, 10).join(), '2,4,6,8,10,12,14', "the cloud's foot");
  const peak = [...CLOUD.x.keys()].filter((i) => CLOUD.z[i] === 3);
  check(peak.length === 1 && CLOUD.x[peak[0]] === 9 && CLOUD.y[peak[0]] === 4, "the big puff not raised four high at its middle");
  // The rain, half a tile below the cloud: three lines, each drop half a
  // tile to the left of the one above it.
  equal(drops().length, 12, 'raindrops');
  for (const top of [4, 10, 16]) {
    const line = [0, 1, 2, 3].map((k) => drops().find((i) => CLOUD.x[i] === top - k && CLOUD.y[i] === 13 + 2 * k));
    check(line.every((i) => i !== undefined), `the line of raindrops from ${top} half tiles across`);
  }
});

test("the first shower's deals can be won in the order they were dealt, with every raindrop free from the start", () => {
  const options = dayOptions(FIRST);
  let free = 0;
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(CLOUD, { seed, ...options });
    free += g.freeTiles().length;
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
  }
  const g = new Game(CLOUD, { seed: 1, ...options });
  for (const i of drops()) check(g.isFree(i), 'a raindrop is not free at the start');
  check(FIRST.text.includes("raindrop's"), "the card doesn't tell the free-tile rule by the raindrops");
  return `200 deals; ${(free / 200).toFixed(0)} tiles free at the start`;
});
