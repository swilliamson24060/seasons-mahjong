import { FIFEDRUM, FLAG } from './engine/layouts.js';

// Independence Day: the parade, eight boards from the fife and drum at its
// head to the fireworks after dark, a float or a band of marchers each, to
// be reached in turn as the beach season's chapters are. The boards are to
// grow from 84 tiles to the full set of 144, all nine across. The first,
// the fife and drum, is the gentle start, with no twist; on the second,
// the flag, the marchers count off, one to nine, a pair of the next number
// in turn counting off (engine/countoff.js); the last, the fireworks, is
// planned to turn over halfway as night falls and the
// fireworks begin, a tile left without a partner a dud, a firecracker that
// fizzled. Each chapter is as Thanksgiving's days are (thanksgiving.js
// says what each part is for), and PLAN.md has its boards and twists.
// Until Independence Day's own tiles are drawn, its boards wear
// Halloween's.

// The fife and drum's look, each tile's part by where it is, in half
// tiles: the drumsticks crossed over the drum, the beads at their tips;
// the drum's red hoops, top and bottom; its blue shell, the rope laced
// round it crossing and crossing again; the gold eagle painted on its
// middle, raised; and the fife lying in front of it, its finger holes in
// the middle of it.
export function drumPart(L, i) {
  const [x, y, z] = [L.x[i], L.y[i], L.z[i]];
  if (y === 20) return x >= 6 && x <= 10 ? 'fife-hole' : 'fife';
  if (y < 6) return y === 0 ? 'drumstick-tip' : 'drumstick';
  if (y === 6 || y === 16) return 'drum-hoop';
  if (z === 2) return 'drum-eagle';
  const row = (y - 6) / 2;
  const col = x / 2;
  return (col + row) % 4 === 0 || (col - row + 40) % 4 === 0 ? 'drum-rope' : 'drum-shell';
}

// The flag's look, each tile's part by where it is, in half tiles: the
// gold ball at the top of the pole, the pole and its stand; the canton's
// blue, raised at the flag's top left, and the stars raised on it; and the
// stripes, red and white by turns from the top.
export function flagPart(L, i) {
  const [x, y, z] = [L.x[i], L.y[i], L.z[i]];
  if (y === 20) return 'flag-stand';
  if (x === 0) return y === 0 ? 'finial' : 'flagpole';
  if (z === 2) return 'flag-star';
  if (x <= 8 && y <= 8) return 'canton';
  return ((y - 2) / 2) % 2 ? 'stripe-white' : 'stripe-red';
}

export const INDEPENDENCE = [
  {
    name: 'The first chapter',
    title: 'The fife and drum',
    layout: FIFEDRUM,
    rules: { treats: false, ghostsFloat: false },
    look: drumPart,
    sky: ['#8bbbe8', '#15294f'],
    text: "It's the Fourth of July, and here comes the parade, the fife and drum at its head, the drummer's sticks crossed over his drum. A tile is free when nothing lies on it and its left or right side is open, as the tips of the drumsticks are, out on their own: take two free tiles that match.",
  },
  {
    name: 'The second chapter',
    title: 'The flag',
    layout: FLAG,
    rules: { treats: false, ghostsFloat: false, countOff: true },
    look: flagPart,
    sky: ['#86b8e6', '#14284e'],
    text: "Here comes Old Glory, flying high, and the marchers behind her count off as they pass, one to nine. Take a pair of the next number, of any suit, and it counts off, for 10 points 🥁: after the nine, they start again at one. A pair of another number, or of none, leaves the count where it was, and a number with none of its tiles left is passed over.",
  },
];

// The chapter of Independence Day a board is for, if it is one of its
// boards: played freely, by its address (#play/fifedrum), a chapter's
// board plays by that chapter's rules.
export const independenceOf = (layout) => INDEPENDENCE.find((d) => d.layout === layout);
