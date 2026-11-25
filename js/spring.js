import { LION, SNOWMAN, ROBIN } from './engine/layouts.js';

// The Start of Spring: in like a lion, out like a lamb, eight boards
// through March, from the last blustery days of winter to the first of
// spring, the equinox on the 20th, to be reached in turn as Valentine's and
// April Showers' chapters are. The boards grow from 84 tiles to the full set
// of 144, all nine across. The first, in like a lion, is the gentle start,
// with no twist, as the first shower is; on the second, the thaw, a
// snowman melting, snowballs land and snow tiles in, to be knocked off by
// pairs taken beside them (engine/snowballs.js); on the third, the first
// robin sings songs of three kinds of tile, to be sung back by pairs of
// each taken in her order (engine/song.js); the eighth is to be out like a
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

// The snowman's look, each tile's part by where it is, in half tiles: his
// top hat, his stick arms, the puddle and the slush round his foot, his coal
// eyes and buttons, his carrot nose, his scarf, and the snow of him.
export function snowmanPart(L, i) {
  const [x, y, z] = [L.x[i], L.y[i], L.z[i]];
  if ((z === 0 && y <= 2) || (z === 1 && y === 0)) return 'hat';
  if (z === 0 && (x <= 1 || x >= 15) && y <= 7) return 'twig';
  if (z === 0 && (y >= 18 || ((x === 0 || x === 16) && y >= 16))) return 'puddle';
  if ((z === 1 && y === 5) || (z === 2 && y === 10)) return 'coal';
  if (z === 2 && y === 5) return 'carrot';
  if (z === 1 && y === 7) return 'scarf';
  return 'snow';
}

// The robin's look, each tile's part by where it is, in half tiles: the
// notes of her song, her beak, her dark head and her eye on it, her red
// breast, her white belly, her grey-brown back and the wing raised on it,
// her tail, the fence post and its rails, and the grass.
export function robinPart(L, i) {
  const [x, y, z] = [L.x[i], L.y[i], L.z[i]];
  if (y >= 19) return 'grass';
  if (y >= 14) return x >= 5 && x <= 9 ? 'post' : 'rails';
  if (z === 0 && x === 0) return 'notes';
  if (z === 0 && x === 2 && y <= 4) return 'beak';
  if (z === 2 && y <= 4 && x <= 5) return 'eye';
  if (y <= 4) return 'head';
  if (x >= 14) return 'tail';
  if (z >= 2) return x < 8 ? 'breast' : 'wing';
  if (z === 0 && y === 12 && x <= 7) return 'belly';
  return x <= 6 + z ? 'breast' : 'back';
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
  {
    name: 'The second chapter',
    title: 'The thaw',
    layout: SNOWMAN,
    rules: { treats: false, ghostsFloat: false, snowballs: { every: 5, melt: 4 } },
    look: snowmanPart,
    sky: ['#5b6b6f', '#171d1f'],
    text: "The March sun is out, and the snowman is melting, but there's snow in him yet. Every five matches a snowball lands on a free tile ❄️ and snows it in, so that it can't be taken. Take a pair right beside it to knock the snow off, for 15 points, or leave it, and it melts in four matches.",
  },
  {
    name: 'The third chapter',
    title: 'The first robin',
    layout: ROBIN,
    rules: { treats: false, ghostsFloat: false, song: true },
    look: robinPart,
    sky: ['#5f7487', '#182029'],
    text: "The first robin of spring is back, singing on the fence post. She sings a song of three kinds of tile 🎶, shown at the top: take a pair of each, in her order, to sing it back to her, for 30 points, and she sings another. Pairs of other kinds in between don't matter, but one of hers out of turn breaks the song, and she starts it again.",
  },
];

// The chapter of the Start of Spring a board is for, if it is one of its
// boards: played freely, by its address (#play/lion), a chapter's board
// plays by that chapter's rules.
export const springOf = (layout) => SPRING.find((d) => d.layout === layout);
