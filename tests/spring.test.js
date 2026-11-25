import { test, check, equal } from './run.js';
import * as layouts from '../js/engine/layouts.js';
import { LION } from '../js/engine/layouts.js';
import { Game } from '../js/engine/game.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SPRING, springOf, lionPart } from '../js/spring.js';
import { theme } from '../js/themes.js';

const FIRST = SPRING[0];

// The tiles on a layer in a row, given in half tiles, by where each starts
// across.
const at = (L, z, y) => [...L.x.keys()].filter((i) => L.z[i] === z && L.y[i] === y).map((i) => L.x[i]).join();

// The locks at the sides of the lion's mane, at the board's edges.
const sideLocks = () => [...LION.x.keys()].filter((i) => LION.z[i] === 0 && (LION.x[i] === 0 || LION.x[i] === 16));

test('the Start of Spring is told in chapters, each its own board, none more than nine tiles across, and not ready while they are being made', () => {
  for (const d of SPRING) {
    check(d.layout && d.title && d.text && d.sky, `${d.name} is not made`);
    check(d.layout.width / 2 <= 9, `${d.name}'s board is ${d.layout.width / 2} tiles across`);
  }
  equal(new Set(SPRING.map((d) => d.layout)).size, SPRING.length, 'boards, one a chapter');
  check(SPRING.length <= 8, `${SPRING.length} chapters, more than eight`);
  check(!theme('spring').ready, 'the Start of Spring ready, with its boards still being made');
});

test('the first chapter is in like a lion, a lion\'s head, the gentle start: 84 tiles on four layers, nine across, and no twist', () => {
  equal(FIRST.name, 'The first chapter', "the first chapter's name");
  equal(FIRST.title, 'In like a lion', "the first chapter's title");
  equal(springOf(LION), FIRST, "the lion's chapter");
  check(Object.keys(layouts).includes('LION'), 'the lion plays by its address, #play/lion');
  equal(LION.count, 84, 'tiles');
  equal(LION.width / 2, 9, 'tiles across');
  equal(LION.height / 2, 9, 'tiles down');
  equal(LION.depth, 4, 'layers');
  equal(JSON.stringify(dayOptions(FIRST)), JSON.stringify({ treats: false, ghostsFloat: false }), 'no twist');
});

test("the lion reads as a lion's head: his mane round his face, its locks out on every side, his ears up, and his eyes, muzzle and nose raised on his face", () => {
  equal(at(LION, 0, 0), '6,8,10', "the locks at the top of his mane");
  equal(at(LION, 0, 2), '2,4,6,8,10,12,14', "his mane across the top of his head");
  equal(at(LION, 0, 8), '0,2,4,6,8,10,12,14,16', 'across his middle, from lock to lock');
  equal(at(LION, 0, 16), '6,8,10', "the locks at the foot of his mane");
  equal(at(LION, 1, 2), '4,12', 'his ears, raised on his mane');
  equal(at(LION, 2, 6), '5,11', 'his eyes');
  equal(at(LION, 2, 9), '7,9', 'his muzzle');
  equal(at(LION, 3, 8), '8', 'his nose, the highest of him');
  const parts = {};
  for (let i = 0; i < LION.count; i++) {
    const p = lionPart(LION, i);
    parts[p] = (parts[p] || 0) + 1;
  }
  equal(['mane', 'ears', 'face', 'eyes', 'muzzle', 'nose'].map((p) => `${p} ${parts[p]}`).join(', '), 'mane 36, ears 2, face 41, eyes 2, muzzle 2, nose 1', "his parts, for his look");
  equal(FIRST.look, lionPart, 'the lion not tinted as his parts are');
});

test("the lion's deals can be won in the order they were dealt, with the locks at the sides of his mane free from the start", () => {
  const options = dayOptions(FIRST);
  let free = 0;
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(LION, { seed, ...options });
    free += g.freeTiles().length;
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
  }
  const g = new Game(LION, { seed: 1, ...options });
  equal(sideLocks().length, 6, 'the locks at the sides of his mane');
  for (const i of sideLocks()) check(g.isFree(i), 'a lock at the side of his mane is not free at the start');
  check(FIRST.text.includes('as the locks at the sides of his mane are'), "the card doesn't tell the free-tile rule by his mane");
  return `200 deals; ${(free / 200).toFixed(0)} tiles free at the start`;
});
