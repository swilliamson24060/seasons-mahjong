import { BOW } from './engine/layouts.js';

// Valentine's Day: a love story, eight boards told from Cupid taking aim to
// "be mine", each board a moment of it, to be reached in turn as Christmas's
// twelve days are. Each board is shaped by its moment, and the boards grow
// through the story, from 72 tiles to the full set of 144. The first,
// Cupid's bow, is the gentle start, with no twist, as the first day's and
// the 10 are; the eighth is to be Be mine, when the question is popped
// halfway and every tile turns over. Each chapter is as Thanksgiving's days
// are (thanksgiving.js says what each part is for). PLAN.md has the story's
// boards and twists, and tools/valentine-drafts.js the boards still to be
// made, drawn. Until Valentine's own tiles are drawn, its boards wear
// Halloween's.

export const LOVE_STORY = [
  {
    name: 'The first chapter',
    title: "Cupid's bow",
    layout: BOW,
    rules: { treats: false, ghostsFloat: false },
    sky: ['#7d3a5e', '#25101d'],
    text: "Cupid draws his bow and takes aim, and the love story begins. A tile is free when nothing lies on it and its left or right side is open, as each tile of the bow's string is: take two free tiles that match.",
  },
];

// The chapter of the love story a board is for, if it is one of its boards:
// played freely, by its address (#play/bow), a chapter's board plays by that
// chapter's rules.
export const chapterOf = (layout) => LOVE_STORY.find((d) => d.layout === layout);
