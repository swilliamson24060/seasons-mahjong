import { test, check, equal } from './run.js';
import * as layouts from '../js/engine/layouts.js';
import { FIFEDRUM, FLAG } from '../js/engine/layouts.js';
import { Game } from '../js/engine/game.js';
import { dayOptions } from '../js/thanksgiving.js';
import { INDEPENDENCE, independenceOf, drumPart, flagPart } from '../js/independence.js';
import { theme } from '../js/themes.js';

const FIRST = INDEPENDENCE[0];
const SECOND = INDEPENDENCE[1];

// The tiles on a layer in a row, given in half tiles, by where each starts
// across.
const at = (L, z, y) => [...L.x.keys()].filter((i) => L.z[i] === z && L.y[i] === y).map((i) => L.x[i]).join();

// The drumsticks' tips, out on their own over the drum.
const tips = () => [...FIFEDRUM.x.keys()].filter((i) => FIFEDRUM.y[i] === 0);

test('Independence Day is told in chapters, each its own board, none more than nine tiles across, and not ready while they are being made', () => {
  for (const d of INDEPENDENCE) {
    check(d.layout && d.title && d.text && d.sky, `${d.name} is not made`);
    check(d.layout.width / 2 <= 9, `${d.name}'s board is ${d.layout.width / 2} tiles across`);
  }
  equal(new Set(INDEPENDENCE.map((d) => d.layout)).size, INDEPENDENCE.length, 'boards, one a chapter');
  check(INDEPENDENCE.length <= 8, `${INDEPENDENCE.length} chapters, more than eight`);
  check(!theme('independence').ready, 'Independence Day ready, with its boards still being made');
});

test('the first chapter is the fife and drum, the gentle start: 84 tiles on three layers, nine across, and no twist', () => {
  equal(FIRST.name, 'The first chapter', "the first chapter's name");
  equal(FIRST.title, 'The fife and drum', "the first chapter's title");
  equal(independenceOf(FIFEDRUM), FIRST, "the fife and drum's chapter");
  check(Object.keys(layouts).includes('FIFEDRUM'), 'the fife and drum play by their address, #play/fifedrum');
  equal(FIFEDRUM.count, 84, 'tiles');
  equal(FIFEDRUM.width / 2, 9, 'tiles across');
  equal(FIFEDRUM.height / 2, 11, 'tiles down');
  equal(FIFEDRUM.depth, 3, 'layers');
  equal(JSON.stringify(dayOptions(FIRST)), JSON.stringify({ treats: false, ghostsFloat: false }), 'no twist');
});

test('the fife and drum read as a fife and drum: the drumsticks crossed over the drum, its red hoops, its shell laced round with its rope, the gold eagle raised on it, and the fife lying in front of it', () => {
  equal([0, 2, 4].map((y) => at(FIFEDRUM, 0, y)).join(' | '), '4,12 | 6,10 | 8', 'the drumsticks, crossing over the drum');
  equal([6, 8, 16].map((y) => at(FIFEDRUM, 0, y)).join(' | '), '2,4,6,8,10,12,14 | 0,2,4,6,8,10,12,14,16 | 2,4,6,8,10,12,14', "the drum's top hoop, its shell, widest, and its bottom hoop");
  equal(at(FIFEDRUM, 0, 18), '', 'the drum, clear of the fife');
  equal(at(FIFEDRUM, 0, 20), '2,4,6,8,10,12,14', 'the fife, lying in front of it');
  equal(at(FIFEDRUM, 1, 8), '4,6,8,10,12', "the drum's shell, raised");
  equal([10, 12].map((y) => at(FIFEDRUM, 2, y)).join(' | '), '8 | 8', 'the eagle, raised on its middle');
  const parts = {};
  for (let i = 0; i < FIFEDRUM.count; i++) {
    const p = drumPart(FIFEDRUM, i);
    parts[p] = (parts[p] || 0) + 1;
  }
  equal(['drumstick', 'drumstick-tip', 'drum-hoop', 'drum-shell', 'drum-rope', 'drum-eagle', 'fife', 'fife-hole'].map((p) => `${p} ${parts[p]}`).join(', '), 'drumstick 3, drumstick-tip 2, drum-hoop 14, drum-shell 36, drum-rope 20, drum-eagle 2, fife 4, fife-hole 3', 'their parts, for their look');
  equal(FIRST.look, drumPart, 'the fife and drum not tinted as their parts are');
});

test("the fife and drum's deals can be won in the order they were dealt, with the drumsticks' tips free from the start", () => {
  const options = dayOptions(FIRST);
  let free = 0;
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(FIFEDRUM, { seed, ...options });
    free += g.freeTiles().length;
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
  }
  const g = new Game(FIFEDRUM, { seed: 1, ...options });
  equal(tips().length, 2, "the drumsticks' tips");
  for (const i of tips()) check(g.isFree(i), "a drumstick's tip is not free at the start");
  check(FIRST.text.includes('as the tips of the drumsticks are'), "the card doesn't tell the free-tile rule by the drumsticks' tips");
  return `200 deals; ${(free / 200).toFixed(0)} tiles free at the start`;
});

test('the second chapter is the flag: 92 tiles on three layers, nine across, the marchers counting off one to nine', () => {
  equal(SECOND.name, 'The second chapter', "the second chapter's name");
  equal(SECOND.title, 'The flag', "the second chapter's title");
  equal(independenceOf(FLAG), SECOND, "the flag's chapter");
  check(Object.keys(layouts).includes('FLAG'), 'the flag plays by its address, #play/flag');
  equal(FLAG.count, 92, 'tiles');
  equal(FLAG.width / 2, 9, 'tiles across');
  equal(FLAG.height / 2, 11, 'tiles down');
  equal(FLAG.depth, 3, 'layers');
  check(FLAG.count > FIFEDRUM.count, 'no more tiles than the fife and drum');
  equal(JSON.stringify(dayOptions(SECOND)), JSON.stringify({ treats: false, ghostsFloat: false, countOff: true }), 'counting off');
  check(['count off', 'the next number', 'start again at one', 'passed over'].every((w) => SECOND.text.includes(w)), "the card doesn't tell the count");
});

test('the flag reads as Old Glory: the gold ball on its pole, the canton raised at its top left with its stars raised on it, seven stripes red and white by turns, and the stand at the pole\'s foot', () => {
  equal(at(FLAG, 0, 0), '0', 'the gold ball on the pole');
  for (let y = 2; y <= 14; y += 2) equal(at(FLAG, 0, y), '0,2,4,6,8,10,12,14,16', `the flag's row ${y / 2}, from the pole across`);
  equal([2, 4, 6, 8].map((y) => at(FLAG, 1, y)).join(' | '), '2,4,6,8 | 2,4,6,8 | 2,4,6,8 | 2,4,6,8', 'the canton, raised');
  equal([4, 6].map((y) => at(FLAG, 2, y)).join(' | '), '4,6 | 4,6', 'its stars, raised on it');
  equal(`${at(FLAG, 0, 16)} | ${at(FLAG, 0, 20)} | ${at(FLAG, 1, 20)}`, '0 | 0,2,4,6 | 2,4', 'the pole, and its stand');
  const parts = {};
  for (let i = 0; i < FLAG.count; i++) {
    const p = flagPart(FLAG, i);
    parts[p] = (parts[p] || 0) + 1;
  }
  equal(['finial', 'flagpole', 'flag-stand', 'canton', 'flag-star', 'stripe-red', 'stripe-white'].map((p) => `${p} ${parts[p]}`).join(', '), 'finial 1, flagpole 9, flag-stand 6, canton 32, flag-star 4, stripe-red 24, stripe-white 16', 'its parts, for its look');
  equal(SECOND.look, flagPart, 'the flag not tinted as its parts are');
});
