import { test, check, equal } from './run.js';
import * as layouts from '../js/engine/layouts.js';
import { SANDPAIL, SANDCASTLE, FOOTPRINTS, SAILBOAT, ICECREAM, BEACHBALL } from '../js/engine/layouts.js';
import { Game } from '../js/engine/game.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SUMMER, summerOf, pailPart, castlePart, printPart, sailPart, scoopPart, ballPart } from '../js/summer.js';
import { theme } from '../js/themes.js';

const FIRST = SUMMER[0];
const SECOND = SUMMER[1];
const THIRD = SUMMER[2];
const FOURTH = SUMMER[3];
const FIFTH = SUMMER[4];
const SIXTH = SUMMER[5];

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

test('the second chapter is the sandcastle: 92 tiles on two layers, nine across, every tile on a whole row, and the tide coming in every three matches, as far as three rows', () => {
  equal(SECOND.name, 'The second chapter', "the second chapter's name");
  equal(SECOND.title, 'The sandcastle', "the second chapter's title");
  equal(summerOf(SANDCASTLE), SECOND, "the sandcastle's chapter");
  check(Object.keys(layouts).includes('SANDCASTLE'), 'the sandcastle plays by its address, #play/sandcastle');
  equal(SANDCASTLE.count, 92, 'tiles');
  equal(SANDCASTLE.width / 2, 9, 'tiles across');
  equal(SANDCASTLE.height / 2, 10, 'tiles down');
  equal(SANDCASTLE.depth, 2, 'layers');
  check([...SANDCASTLE.y].every((y) => y % 2 === 0), 'a tile off a whole row, for the tide to half cover');
  check(SANDCASTLE.count > SANDPAIL.count, 'no more tiles than the pail');
  equal(JSON.stringify(dayOptions(SECOND)), JSON.stringify({ treats: false, ghostsFloat: false, tide: { every: 3, high: 3 } }), 'the tide');
  check(['Every three matches', "can't be taken", 'goes out at once'].every((w) => SECOND.text.includes(w)), "the card doesn't tell the tide");
});

test('the sandcastle reads as a sandcastle: two towers and a keep, their flags flying, their tops raised, the battlements, the wall with the gateway through its foot, the moat and the beach', () => {
  equal(at(SANDCASTLE, 0, 0), '2,8,14', 'the flags over the towers and the keep');
  equal(at(SANDCASTLE, 1, 2), '0,2,6,8,10,14,16', "the towers' and the keep's tops, raised");
  equal(at(SANDCASTLE, 0, 8), '0,4,8,12,16', 'the battlements');
  equal(at(SANDCASTLE, 0, 14), '0,2,4,12,14,16', "the castle's foot, the gateway through it");
  equal(`${at(SANDCASTLE, 0, 16)} | ${at(SANDCASTLE, 0, 18)}`, '0,2,4,6,8,10,12,14,16 | 0,2,4,6,8,10,12,14,16', 'the moat and the beach, across the board');
  const parts = {};
  for (let i = 0; i < SANDCASTLE.count; i++) {
    const p = castlePart(SANDCASTLE, i);
    parts[p] = (parts[p] || 0) + 1;
  }
  equal(['flag', 'castle-top', 'castle', 'gate', 'moat', 'sand'].map((p) => `${p} ${parts[p]}`).join(', '), 'flag 3, castle-top 26, castle 42, gate 3, moat 9, sand 9', 'its parts, for its look');
  equal(SECOND.look, castlePart, 'the sandcastle not tinted as its parts are');
});

test('the third chapter is footprints in the sand: 100 tiles on two layers, nine across, every tile on a whole row, and a sand crab coming out three matches after one is startled', () => {
  equal(THIRD.name, 'The third chapter', "the third chapter's name");
  equal(THIRD.title, 'Footprints in the sand', "the third chapter's title");
  equal(summerOf(FOOTPRINTS), THIRD, "the footprints' chapter");
  check(Object.keys(layouts).includes('FOOTPRINTS'), 'the footprints play by their address, #play/footprints');
  equal(FOOTPRINTS.count, 100, 'tiles');
  equal(FOOTPRINTS.width / 2, 9, 'tiles across');
  equal(FOOTPRINTS.height / 2, 10, 'tiles down');
  equal(FOOTPRINTS.depth, 2, 'layers');
  check([...FOOTPRINTS.y].every((y) => y % 2 === 0), "a tile off a whole row, for the crab's row to be unclear");
  check(FOOTPRINTS.count > SANDCASTLE.count, 'no more tiles than the sandcastle');
  equal(JSON.stringify(dayOptions(THIRD)), JSON.stringify({ treats: false, ghostsFloat: false, crab: { every: 3 } }), 'the crab');
  check(["can't be taken while it's there", 'right beside it', 'three matches later', 'goes back on its own'].every((w) => THIRD.text.includes(w)), "the card doesn't tell the crab");
});

test('the footprints read as footprints in the sand: two lines of them winding up the beach from the sea, a foot to a row, between the dunes and the water', () => {
  equal(at(FOOTPRINTS, 1, 16), '4,12', 'the first footprints, at the water\'s edge');
  equal(['14', '12', '10', '8', '6', '4'].map((y) => at(FOOTPRINTS, 1, Number(y))).join(' | '), '2,14 | 4,12 | 2,14 | 4,12 | 6,10 | 4,12', 'the footprints winding up, a foot to a row');
  equal(`${at(FOOTPRINTS, 0, 0)} | ${at(FOOTPRINTS, 0, 18)}`, '2,4,6,8,10,12,14 | 2,4,6,8,10,12,14', 'the dunes and the sea, their ends rounded');
  const parts = {};
  for (let i = 0; i < FOOTPRINTS.count; i++) {
    const p = printPart(FOOTPRINTS, i);
    parts[p] = (parts[p] || 0) + 1;
  }
  equal(['footprint', 'dry-sand', 'wet-sand', 'dune', 'sea'].map((p) => `${p} ${parts[p]}`).join(', '), 'footprint 14, dry-sand 63, wet-sand 9, dune 7, sea 7', 'their parts, for their look');
  equal(THIRD.look, printPart, 'the footprints not tinted as their parts are');
});

test('the fourth chapter is sailing: 108 tiles on three layers, nine across, every tile on a whole row, and a wave rolling in along the foot every six matches', () => {
  equal(FOURTH.name, 'The fourth chapter', "the fourth chapter's name");
  equal(FOURTH.title, 'Sailing', "the fourth chapter's title");
  equal(summerOf(SAILBOAT), FOURTH, "the sailboat's chapter");
  check(Object.keys(layouts).includes('SAILBOAT'), 'the sailboat plays by its address, #play/sailboat');
  equal(SAILBOAT.count, 108, 'tiles');
  equal(SAILBOAT.width / 2, 9, 'tiles across');
  equal(SAILBOAT.height / 2, 10, 'tiles down');
  equal(SAILBOAT.depth, 3, 'layers');
  check([...SAILBOAT.y].every((y) => y % 2 === 0), 'a tile off a whole row');
  check(SAILBOAT.count > FOOTPRINTS.count, 'no more tiles than the footprints');
  equal(JSON.stringify(dayOptions(FOURTH)), JSON.stringify({ treats: false, ghostsFloat: false, waves: { every: 6 } }), 'the waves');
  check(['Every six matches', 'turn round among themselves', 'a place along', 'falls short'].every((w) => FOURTH.text.includes(w)), "the card doesn't tell the waves");
});

test('the sailboat reads as a sailboat: the pennant at the masthead, the mast, the mainsail and the jib full of wind, the deck and the hull, and the sea and the waves', () => {
  equal(at(SAILBOAT, 0, 0), '8', 'the pennant at the masthead');
  equal(at(SAILBOAT, 0, 10), '0,2,4,6,8,10,12,14,16', 'the sails at their widest, either side of the mast');
  equal(['4', '6', '8'].map((y) => at(SAILBOAT, 2, Number(y))).join(' | '), '6 | 4,6 | 4,6,12', 'the sails billowing, raised highest');
  equal(at(SAILBOAT, 2, 14), '6,8,10', "the hull's middle, raised highest");
  equal(`${at(SAILBOAT, 0, 16)} | ${at(SAILBOAT, 0, 18)}`, '0,2,4,6,8,10,12,14,16 | 0,2,4,6,8,10,12,14,16', 'the sea and the waves, across the board');
  const parts = {};
  for (let i = 0; i < SAILBOAT.count; i++) {
    const p = sailPart(SAILBOAT, i);
    parts[p] = (parts[p] || 0) + 1;
  }
  equal(['pennant', 'mast', 'sail', 'jib', 'sail-full', 'deck', 'hull', 'hull-top', 'sea', 'wave'].map((p) => `${p} ${parts[p]}`).join(', '), 'pennant 1, mast 5, sail 14, jib 10, sail-full 25, deck 18, hull 7, hull-top 10, sea 9, wave 9', 'its parts, for its look');
  equal(FOURTH.look, sailPart, 'the sailboat not tinted as its parts are');
});

test('the fifth chapter is an ice cream: 116 tiles on four layers, nine across, and the cherry on top saved for the last pair', () => {
  equal(FIFTH.name, 'The fifth chapter', "the fifth chapter's name");
  equal(FIFTH.title, 'An ice cream', "the fifth chapter's title");
  equal(summerOf(ICECREAM), FIFTH, "the ice cream's chapter");
  check(Object.keys(layouts).includes('ICECREAM'), 'the ice cream plays by its address, #play/icecream');
  equal(ICECREAM.count, 116, 'tiles');
  equal(ICECREAM.width / 2, 9, 'tiles across');
  equal(ICECREAM.height / 2, 11, 'tiles down');
  equal(ICECREAM.depth, 4, 'layers');
  check(ICECREAM.count > SAILBOAT.count, 'no more tiles than the sailboat');
  equal(JSON.stringify(dayOptions(FIFTH)), JSON.stringify({ treats: false, ghostsFloat: false, cherry: true }), 'the cherry');
  check(['save it for last', 'the very last pair', 'just a tile'].every((w) => FIFTH.text.includes(w)), "the card doesn't tell the cherry");
});

test('the ice cream reads as an ice cream: the cherry on top, three scoops, strawberry, vanilla and chocolate, domed, and the cone narrowing to its tip, the chocolate dripping down it', () => {
  equal(at(ICECREAM, 0, 0), '8', 'the cherry on top, on its own');
  equal(['2', '6', '10'].map((y) => at(ICECREAM, 0, Number(y))).join(' | '), '6,8,10 | 2,4,6,8,10,12,14 | 0,2,4,6,8,10,12,14,16', 'the scoops, wider down');
  equal(at(ICECREAM, 3, 10), '6,8,10', 'the chocolate scoop, domed highest');
  equal(['16', '18', '20'].map((y) => at(ICECREAM, 0, Number(y))).join(' | '), '2,4,6,8,10,12,14 | 4,6,8,10,12 | 6,8,10', 'the cone narrowing to its tip');
  const parts = {};
  for (let i = 0; i < ICECREAM.count; i++) {
    const p = scoopPart(ICECREAM, i);
    parts[p] = (parts[p] || 0) + 1;
  }
  equal(['cherry', 'strawberry', 'vanilla', 'chocolate', 'cone-rim', 'cone', 'drip'].map((p) => `${p} ${parts[p]}`).join(', '), 'cherry 1, strawberry 12, vanilla 30, chocolate 48, cone-rim 10, cone 11, drip 4', 'its parts, for its look');
  equal(FIFTH.look, scoopPart, 'the ice cream not tinted as its parts are');
});

test('the sixth chapter is a beach ball: 124 tiles on three layers, nine across, and a tile left free in the sun for six matches burning', () => {
  equal(SIXTH.name, 'The sixth chapter', "the sixth chapter's name");
  equal(SIXTH.title, 'A beach ball', "the sixth chapter's title");
  equal(summerOf(BEACHBALL), SIXTH, "the beach ball's chapter");
  check(Object.keys(layouts).includes('BEACHBALL'), 'the beach ball plays by its address, #play/beachball');
  equal(BEACHBALL.count, 124, 'tiles');
  equal(BEACHBALL.width / 2, 9, 'tiles across');
  equal(BEACHBALL.height / 2, 10, 'tiles down');
  equal(BEACHBALL.depth, 3, 'layers');
  check(BEACHBALL.count > ICECREAM.count, 'no more tiles than the ice cream');
  equal(JSON.stringify(dayOptions(SIXTH)), JSON.stringify({ treats: false, ghostsFloat: false, sunburn: 6 }), 'the sunburn');
  check(['out in the sun', 'six matches', 'cool pair', 'just a pair'].every((w) => SIXTH.text.includes(w)), "the card doesn't tell the sunburn");
});

test('the beach ball reads as a beach ball: round, two layers thick, its panels blue, yellow and green with white between them round the white cap raised on top, clear of the sand as it bounces, its shadow on the sand', () => {
  equal(['0', '2', '6', '12'].map((y) => at(BEACHBALL, 0, Number(y))).join(' | '), '4,6,8,10,12 | 2,4,6,8,10,12,14 | 0,2,4,6,8,10,12,14,16 | 4,6,8,10,12', 'the ball, round');
  for (let y = 0; y <= 12; y += 2) equal(at(BEACHBALL, 1, y), at(BEACHBALL, 0, y), `the ball's row ${y / 2 + 1}, two layers thick`);
  equal(at(BEACHBALL, 0, 14), '', 'the ball, clear of the sand');
  equal([5, 7].map((y) => at(BEACHBALL, 2, y)).join(' | '), '7,9 | 7,9', 'the cap, raised over the middle');
  equal([16, 18].map((y) => at(BEACHBALL, 0, y)).join(' | '), '0,2,4,6,8,10,12,14,16 | 0,2,4,6,8,10,12,14,16', 'the sand');
  const parts = {};
  for (let i = 0; i < BEACHBALL.count; i++) {
    const p = ballPart(BEACHBALL, i);
    parts[p] = (parts[p] || 0) + 1;
  }
  equal(['panel-blue', 'panel-yellow', 'panel-green', 'panel-white', 'ball-cap', 'sand', 'ball-shadow'].map((p) => `${p} ${parts[p]}`).join(', '), 'panel-blue 20, panel-yellow 14, panel-green 16, panel-white 52, ball-cap 4, sand 13, ball-shadow 5', 'its parts, for its look');
  equal(SIXTH.look, ballPart, 'the beach ball not tinted as its parts are');
});

test("the beach ball's upper layer covers the ends of the rows under it, so that few tiles are out in the sun at once: the upper layer's row ends, the cap's and the sand's", () => {
  const g = new Game(BEACHBALL, { seed: 1, ...dayOptions(SIXTH) });
  const free = g.freeTiles();
  equal([0, 1, 2].map((z) => free.filter((t) => BEACHBALL.z[t] === z).length).join(), '4,14,4', 'free from the start, on each layer');
  equal(free.filter((t) => BEACHBALL.z[t] === 0).map((t) => BEACHBALL.y[t]).join(), '16,16,18,18', 'free on the bottom layer, the sand');
});
