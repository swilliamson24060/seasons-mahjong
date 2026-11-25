import { LION } from './engine/layouts.js';

// The Start of Spring: in like a lion, out like a lamb, eight boards
// through March, from the last blustery days of winter to the first of
// spring, the equinox on the 20th, to be reached in turn as Valentine's and
// April Showers' chapters are. The boards grow from 84 tiles to the full set
// of 144, all nine across. The first, in like a lion, is the gentle start,
// with no twist, as the first shower is; the eighth is to be out like a
// lamb, when March goes out like a lamb halfway and every tile turns over.
// Each chapter is as Thanksgiving's days are (thanksgiving.js says what each
// part is for), and PLAN.md has its boards and twists. Until the Start of
// Spring's own tiles are drawn, its boards wear Halloween's.

// The lion's look, each tile's part by where it is, in half tiles, for the
// board to tint (board.js): his mane, its locks flying out on every side,
// his ears up, raised on it, and his face, and on it his eyes, his muzzle
// and his nose.
export function lionPart(L, i) {
  const [x, y, z] = [L.x[i], L.y[i], L.z[i]];
  if (z === 3) return 'nose';
  if (z === 2) return y < 8 ? 'eyes' : 'muzzle';
  if (z === 1) return y < 4 ? 'ears' : 'face';
  return x <= 2 || x >= 14 || y <= 2 || y >= 14 ? 'mane' : 'face';
}

export const SPRING = [
  {
    name: 'The first chapter',
    title: 'In like a lion',
    layout: LION,
    rules: { treats: false, ghostsFloat: false },
    look: lionPart,
    sky: ['#56635c', '#161c19'],
    text: "March comes in like a lion, blustery and wild, and spring is on its way. A tile is free when nothing lies on it and its left or right side is open, as the locks at the sides of his mane are: take two free tiles that match.",
  },
];

// The chapter of the Start of Spring a board is for, if it is one of its
// boards: played freely, by its address (#play/lion), a chapter's board
// plays by that chapter's rules.
export const springOf = (layout) => SPRING.find((d) => d.layout === layout);
