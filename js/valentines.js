import { BOW, HEART, ENVELOPE } from './engine/layouts.js';

// Valentine's Day: a love story, eight boards told from Cupid taking aim to
// "be mine", each board a moment of it, to be reached in turn as Christmas's
// twelve days are. Each board is shaped by its moment, and the boards grow
// through the story, from 72 tiles to the full set of 144. The first,
// Cupid's bow, is the gentle start, with no twist, as the first day's and
// the 10 are; on the second his arrow has struck, and goes on striking
// couples to be taken together (engine/cupid.js); the eighth is to be Be
// mine, when the question is popped halfway and every tile turns over. Each chapter is as Thanksgiving's days
// are (thanksgiving.js says what each part is for). PLAN.md has the story's
// boards and twists, and tools/valentine-drafts.js the boards still to be
// made, drawn. Its boards wear Valentine's own tiles (ui/valentine-faces.js)
// and play its music, Liszt's Liebestraum on a harp (ui/sound.js).

export const LOVE_STORY = [
  {
    name: 'The first chapter',
    title: "Cupid's bow",
    layout: BOW,
    rules: { treats: false, ghostsFloat: false },
    sky: ['#7d3a5e', '#25101d'],
    text: "Cupid draws his bow and takes aim, and the love story begins. A tile is free when nothing lies on it and its left or right side is open, as each tile of the bow's string is: take two free tiles that match.",
  },
  {
    name: 'The second chapter',
    title: 'Love at first sight',
    layout: HEART,
    rules: { treats: false, ghostsFloat: false, arrows: 8 },
    sky: ['#8a3554', '#2a0e1b'],
    text: "Cupid's arrow has struck the heart. As the board starts, and again every eight matches, he lets fly: his arrow strikes two tiles of a kind, and they're smitten, a heart on each. Take the two together before his next arrow flies, and it's love at first sight: 30 points. Take either with another tile, and a heart is broken.",
  },
  {
    name: 'The third chapter',
    title: 'A secret admirer',
    layout: ENVELOPE,
    rules: { treats: false, ghostsFloat: false, sweethearts: true },
    sky: ['#70366e', '#240f25'],
    text: 'A valentine has come from a secret admirer, sealed with a heart. Eight tiles carry candy hearts, each with half a sweet nothing, its other half the same colour: BE and MINE, TRUE and LOVE, HUG and ME, SWEET and TALK. Take the pair with one half, and then, as the very next match, the pair with the other, and the message is said: 40 points. Take anything between, and it goes unsaid.',
  },
];

// The chapter of the love story a board is for, if it is one of its boards:
// played freely, by its address (#play/bow), a chapter's board plays by that
// chapter's rules.
export const chapterOf = (layout) => LOVE_STORY.find((d) => d.layout === layout);
