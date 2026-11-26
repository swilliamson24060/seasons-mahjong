import { SANDPAIL } from './engine/layouts.js';

// The Summer Beach Season: a day at the beach, eight boards from a pail and
// spade in the morning to the sun setting into the sea, to be reached in
// turn as the Start of Spring's and April Showers' chapters are. The boards
// are to grow from 84 tiles to the full set of 144, all nine across. The
// first, a pail and spade, is the gentle start, with no twist, as in like a
// lion is; the last, sunset, is planned to turn over halfway as the sun
// sets into the sea, a tile left without a partner a lost flip-flop.
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
];

// The chapter of the beach season a board is for, if it is one of its
// boards: played freely, by its address (#play/sandpail), a chapter's board
// plays by that chapter's rules.
export const summerOf = (layout) => SUMMER.find((d) => d.layout === layout);
