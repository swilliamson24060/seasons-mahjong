import { SANDPAIL, SANDCASTLE, FOOTPRINTS, SAILBOAT, ICECREAM, BEACHBALL, LIGHTHOUSE } from './engine/layouts.js';

// The Summer Beach Season: a day at the beach, eight boards from a pail and
// spade in the morning to the sun setting into the sea, to be reached in
// turn as the Start of Spring's and April Showers' chapters are. The boards
// are to grow from 84 tiles to the full set of 144, all nine across. The
// first, a pail and spade, is the gentle start, with no twist, as in like a
// lion is; on the second, the sandcastle, the tide comes in a row up the
// board every few matches and goes back out, and the rows under the water
// can't be taken from (engine/tide.js); on the third, footprints in the
// sand, a sand crab scuttles along its row, the tile it's on not to be
// taken, until a pair taken right beside it sends it back into its burrow
// (engine/crab.js); on the fourth, sailing, every six matches a wave rolls
// in over the bottom row and its tiles turn round among themselves, so long
// as the board can still be won (engine/waves.js); on the fifth, an ice
// cream, the cherry on top, saved for the last pair, scores (engine/
// cherry.js); on the sixth, a beach ball, a tile left free in the sun for
// six matches burns, and a pair taken before either of its tiles does is a
// cool pair, for points (engine/sunburn.js); on the seventh, the
// lighthouse, the stairs in its tower run up and down, so that a tile there
// is free when there's no tile above it or none below it, rather than to
// its left or right (engine/stairs.js); the last, sunset, is planned to
// turn over halfway as the sun sets into the sea, a tile left without a
// partner a lost flip-flop.
// Each chapter is as Thanksgiving's days are (thanksgiving.js says what each
// part is for), and PLAN.md has its boards and twists. Until the beach
// season's own tiles are drawn, its boards wear Halloween's.

// The pail and spade's look, each tile's part by where it is, in half
// tiles: the spade, its grip at the top of its handle and its blade sunk in
// the sand; the sand and the shells on it; and the pail, its handle, its
// rim, the band round it, and the starfish on the band.
export function pailPart(L, i) {
  const [x, y, z] = [L.x[i], L.y[i], L.z[i]];
  if (x >= 14 && y <= 16) return y === 0 ? 'spade-grip' : 'spade';
  if (y >= 16) return z ? 'shell' : 'sand';
  if (y <= 2) return 'pail-handle';
  if (y === 4) return 'pail-rim';
  if (z === 2) return 'starfish';
  if (z === 1) return 'pail-band';
  return 'pail';
}

// The sandcastle's look, each tile's part by where it is, in half tiles:
// the flags over its towers and its keep, the raised tops of those and the
// battlements, catching the sun, the walls, the lintel over the gate, the
// moat, and the beach.
export function castlePart(L, i) {
  const [x, y, z] = [L.x[i], L.y[i], L.z[i]];
  if (y >= 18) return 'sand';
  if (y === 16) return 'moat';
  if (y === 0) return 'flag';
  if (y === 12 && x >= 6 && x <= 10) return 'gate';
  if (z > 0 || y === 8) return 'castle-top';
  return 'castle';
}

// The footprints' look, each tile's part by where it is, in half tiles: the
// footprints raised on the sand, the dunes at the top, the sea at the foot,
// the wet sand at the water's edge, and the dry sand.
export function printPart(L, i) {
  const [y, z] = [L.y[i], L.z[i]];
  if (z > 0) return 'footprint';
  if (y === 0) return 'dune';
  if (y >= 18) return 'sea';
  if (y === 16) return 'wet-sand';
  return 'dry-sand';
}

// The sailboat's look, each tile's part by where it is, in half tiles: the
// waves along the foot and the sea above them, the hull, its raised middle
// lighter, and the deck, the pennant at the masthead, the mast, and the
// mainsail to its left and the jib to its right, billowing where they're
// raised.
export function sailPart(L, i) {
  const [x, y, z] = [L.x[i], L.y[i], L.z[i]];
  if (y >= 18) return 'wave';
  if (y === 16) return 'sea';
  if (y === 14) return z ? 'hull-top' : 'hull';
  if (y === 12) return 'deck';
  if (y === 0) return 'pennant';
  if (x === 8 && z === 0) return 'mast';
  if (z > 0) return 'sail-full';
  return x < 8 ? 'sail' : 'jib';
}

// The ice cream's look, each tile's part by where it is, in half tiles: the
// cherry on top, the three scoops, strawberry, vanilla and chocolate from
// the top down, the cone's rim, the cone, and the chocolate dripping down
// its sides.
export function scoopPart(L, i) {
  const [x, y] = [L.x[i], L.y[i]];
  if (y === 0) return 'cherry';
  if (y <= 4) return 'strawberry';
  if (y <= 8) return 'vanilla';
  if (y <= 12) return 'chocolate';
  if (y === 14) return 'cone-rim';
  if ((y === 16 && (x === 2 || x === 14)) || (y === 18 && (x === 4 || x === 12))) return 'drip';
  return 'cone';
}

// The beach ball's look, each tile's part by where it is, in half tiles:
// the white cap raised on top, and round it the ball's six panels, blue,
// white, yellow, white, green and white from the top round to the right,
// by the way each tile lies from the ball's middle (tiles being a third
// taller than they are wide); and under the ball the sand, with the ball's
// shadow on it.
const PANELS = ['panel-blue', 'panel-white', 'panel-yellow', 'panel-white', 'panel-green', 'panel-white'];
export function ballPart(L, i) {
  const [x, y, z] = [L.x[i], L.y[i], L.z[i]];
  if (y >= 16) return y === 16 && x >= 4 && x <= 12 ? 'ball-shadow' : 'sand';
  if (z === 2) return 'ball-cap';
  const turn = (Math.atan2(((y + 1 - 7) * 4) / 3, x + 1 - 9) * 180) / Math.PI + 450; // from the top, round to the right
  return PANELS[Math.floor(turn / 60) % 6];
}

// The lighthouse's look, each tile's part by where it is, in half tiles:
// its roof, the lamp raised in the lantern room, the gallery round that,
// the tower in bands of red and white from the top down, its door at its
// foot, the rocks, and the sea about them.
export function lightPart(L, i) {
  const [x, y, z] = [L.x[i], L.y[i], L.z[i]];
  if (y === 0) return 'light-roof';
  if (y === 2) return z === 2 ? 'lamp' : 'lantern';
  if (y === 4) return 'gallery';
  if (y === 14 && x === 8) return 'tower-door';
  if (y <= 14) return (y / 2) % 2 ? 'tower-red' : 'tower-white';
  if (y === 20 || (y === 18 && (x === 0 || x === 16))) return 'sea';
  return 'rocks';
}

export const SUMMER = [
  {
    name: 'The first chapter',
    title: 'A pail and spade',
    layout: SANDPAIL,
    rules: { treats: false, ghostsFloat: false },
    look: pailPart,
    sky: ['#7db4d8', '#173750'],
    text: "Summer's here, and it's the first morning at the beach, the pail and spade first out of the bag. A tile is free when nothing lies on it and its left or right side is open, as the spade's handle is, standing on its own: take two free tiles that match.",
  },
  {
    name: 'The second chapter',
    title: 'The sandcastle',
    layout: SANDCASTLE,
    rules: { treats: false, ghostsFloat: false, tide: { every: 3, high: 3 } },
    look: castlePart,
    sky: ['#6fb0e0', '#13385a'],
    text: "The sandcastle's built, its flags are flying, and the tide's on its way. Every three matches it comes in a row up the beach 🌊, over the beach, the moat and the castle's foot, three rows at the most, and then goes back out a row at a time. While a row is under the water, its tiles can't be taken. With nothing left to take but what the water covers, the tide goes out at once.",
  },
  {
    name: 'The third chapter',
    title: 'Footprints in the sand',
    layout: FOOTPRINTS,
    rules: { treats: false, ghostsFloat: false, crab: { every: 3 } },
    look: printPart,
    sky: ['#62acec', '#11365a'],
    text: "Two lines of footprints wind up the beach from the sea, and a sand crab's out of its burrow 🦀. It scuttles sideways along its row a tile with every match, and the tile it's on can't be taken while it's there. Take a pair right beside it, a tile touching its tile, to send it scuttling back into its burrow, for 10 points; another comes out three matches later. With nowhere left in its row to go, or nothing to take but its tile, it goes back on its own.",
  },
  {
    name: 'The fourth chapter',
    title: 'Sailing',
    layout: SAILBOAT,
    rules: { treats: false, ghostsFloat: false, waves: { every: 6 } },
    look: sailPart,
    sky: ['#5aa8f0', '#0f3560'],
    text: "The wind's up and the boat's out on the water, her sails full. Every six matches a wave rolls in along the foot of the board 🌊, and the tiles it reaches turn round among themselves: each takes the face of the one beside it, a place along, the end one's going round to the other end. A wave never leaves a board that can't be won: with no way to turn the tiles that would, it falls short.",
  },
  {
    name: 'The fifth chapter',
    title: 'An ice cream',
    layout: ICECREAM,
    rules: { treats: false, ghostsFloat: false, cherry: true },
    look: scoopPart,
    sky: ['#58a6f2', '#0e3562'],
    text: "It's a hot one, and the ice cream's three scoops high, a cherry on top 🍒. The cherry's free from the start, but save it for last: take it in the very last pair, after every other tile, for 50 points. Take it any sooner and it's just a tile.",
  },
  {
    name: 'The sixth chapter',
    title: 'A beach ball',
    layout: BEACHBALL,
    rules: { treats: false, ghostsFloat: false, sunburn: 6 },
    look: ballPart,
    sky: ['#4ea2f5', '#0c3466'],
    text: "The sun's at its height, and the beach ball's out, bouncing on the sand. A tile that's free is out in the sun, and goes a little pinker with every match: left there six matches, it burns, going red. Take a pair before either of its tiles burns, a cool pair 😎, for 5 points. A sunburnt tile can still be taken, but only ever in a pair that's just a pair.",
  },
  {
    name: 'The seventh chapter',
    title: 'The lighthouse',
    layout: LIGHTHOUSE,
    rules: { treats: false, ghostsFloat: false },
    look: lightPart,
    sky: ['#7ea5d4', '#1b2e57'],
    text: "The afternoon's drawing on, and the lighthouse stands on the rocks, its lamp ready for the night. In its tower the stairs run up and down: a tile in the tower, red or white, is free when there's no tile above it or none below it, and nothing lies on it, whatever's to its left and right. The lantern, the gallery, the rocks and the sea keep the usual rule.",
  },
];

// The chapter of the beach season a board is for, if it is one of its
// boards: played freely, by its address (#play/sandpail), a chapter's board
// plays by that chapter's rules.
export const summerOf = (layout) => SUMMER.find((d) => d.layout === layout);
