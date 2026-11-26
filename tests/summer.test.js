import { test, check, equal } from './run.js';
import * as layouts from '../js/engine/layouts.js';
import { SANDPAIL } from '../js/engine/layouts.js';
import { Game } from '../js/engine/game.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SUMMER, summerOf, pailPart } from '../js/summer.js';
import { theme } from '../js/themes.js';

const FIRST = SUMMER[0];

// The tiles on a layer in a row, given in half tiles, by where each starts
// across.
const at = (L, z, y) => [...L.x.keys()].filter((i) => L.z[i] === z && L.y[i] === y).map((i) => L.x[i]).join();

// The spade's handle, standing on its own between its grip and its blade.
const spadeHandle = () => [...SANDPAIL.x.keys()].filter((i) => SANDPAIL.z[i] === 0 && SANDPAIL.x[i] === 15);

test('the beach season is told in chapters, each its own board, none more than nine tiles across, and not ready while they are being made', () => {
  for (const d of SUMMER) {
    check(d.layout && d.title && d.text && d.sky, `${d.name} is not made`);
    check(d.layout.width / 2 <= 9, `${d.name}'s board is ${d.layout.width / 2} tiles across`);
  }
  equal(new Set(SUMMER.map((d) => d.layout)).size, SUMMER.length, 'boards, one a chapter');
  check(SUMMER.length <= 8, `${SUMMER.length} chapters, more than eight`);
  check(!theme('summer').ready, 'the beach season ready, with its boards still being made');
});

test('the first chapter is a pail and spade, the gentle start: 84 tiles on three layers, nine across, and no twist', () => {
  equal(FIRST.name, 'The first chapter', "the first chapter's name");
  equal(FIRST.title, 'A pail and spade', "the first chapter's title");
  equal(summerOf(SANDPAIL), FIRST, "the pail's chapter");
  check(Object.keys(layouts).includes('SANDPAIL'), 'the pail plays by its address, #play/sandpail');
  equal(SANDPAIL.count, 84, 'tiles');
  equal(SANDPAIL.width / 2, 9, 'tiles across');
  equal(SANDPAIL.height / 2, 10, 'tiles down');
  equal(SANDPAIL.depth, 3, 'layers');
  equal(JSON.stringify(dayOptions(FIRST)), JSON.stringify({ treats: false, ghostsFloat: false }), 'no twist');
});

test('the pail and spade read as a pail and spade: the pail, its handle arching over it, its rim and a band raised round it, a starfish on the band, and its spade beside it, stuck in the sand, with shells on the sand', () => {
  equal(at(SANDPAIL, 0, 0), '4,6,8,14,16', "the top of the pail's handle, and the spade's grip");
  equal(at(SANDPAIL, 0, 2), '1,11,15', "the handle's sides, and the spade's handle");
  equal(at(SANDPAIL, 0, 4), '0,2,4,6,8,10,12,15', "the pail's rim");
  equal(at(SANDPAIL, 0, 14), '3,5,7,9,14,16', "the pail's foot, narrowest, and the spade's blade");
  equal(at(SANDPAIL, 0, 16), '0,2,4,6,8,10,12,14,16', 'the sand, the blade sunk in it');
  equal(at(SANDPAIL, 1, 4), '0,2,4,6,8,10,12', 'the rim, raised');
  equal(at(SANDPAIL, 1, 8), '1,3,5,7,9,11', 'the band, raised');
  equal(at(SANDPAIL, 2, 8), '5,7', 'the starfish on the band');
  equal(at(SANDPAIL, 1, 18), '2,8,14', 'the shells on the sand');
  const parts = {};
  for (let i = 0; i < SANDPAIL.count; i++) {
    const p = pailPart(SANDPAIL, i);
    parts[p] = (parts[p] || 0) + 1;
  }
  equal(['pail', 'pail-rim', 'pail-band', 'starfish', 'pail-handle', 'spade', 'spade-grip', 'sand', 'shell'].map((p) => `${p} ${parts[p]}`).join(', '), 'pail 26, pail-rim 14, pail-band 6, starfish 2, pail-handle 5, spade 10, spade-grip 2, sand 16, shell 3', 'their parts, for their look');
  equal(FIRST.look, pailPart, 'the pail and spade not tinted as their parts are');
});

test("the pail's deals can be won in the order they were dealt, with the spade's handle free from the start", () => {
  const options = dayOptions(FIRST);
  let free = 0;
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(SANDPAIL, { seed, ...options });
    free += g.freeTiles().length;
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
  }
  const g = new Game(SANDPAIL, { seed: 1, ...options });
  equal(spadeHandle().length, 6, "the spade's handle");
  for (const i of spadeHandle()) check(g.isFree(i), "a tile of the spade's handle is not free at the start");
  check(FIRST.text.includes("as the spade's handle is"), "the card doesn't tell the free-tile rule by the spade's handle");
  return `200 deals; ${(free / 200).toFixed(0)} tiles free at the start`;
});
