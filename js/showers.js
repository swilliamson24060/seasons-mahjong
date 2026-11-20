import { CLOUD } from './engine/layouts.js';

// April Showers: from showers to flowers, eight boards from the first
// shower to May Day, the sky clearing as they go, to be reached in turn as
// Valentine's chapters are. The boards grow from 84 tiles to the full set of
// 144, all nine across: the first four are April's, in the rain, and the
// last four May's, coming into flower. The first, the first shower, is the
// gentle start, with no twist, as Cupid's bow is; the eighth is to be May
// Day, when April turns to May halfway and every tile turns over. Each
// chapter is as Thanksgiving's days are (thanksgiving.js says what each part
// is for), and PLAN.md has the season's boards and twists. Until April
// Showers' own tiles are drawn, its boards wear Halloween's.

export const SHOWERS = [
  {
    name: 'The first chapter',
    title: 'The first shower',
    layout: CLOUD,
    rules: { treats: false, ghostsFloat: false },
    sky: ['#59626d', '#15191e'],
    text: "April comes in with its first shower, and the season begins. A tile is free when nothing lies on it and its left or right side is open, as every raindrop's is: take two free tiles that match.",
  },
];

// The chapter of April Showers a board is for, if it is one of its boards:
// played freely, by its address (#play/cloud), a chapter's board plays by
// that chapter's rules.
export const showerOf = (layout) => SHOWERS.find((d) => d.layout === layout);
