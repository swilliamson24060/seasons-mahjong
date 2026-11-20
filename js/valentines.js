import { BOW, HEART, ENVELOPE, ROSES, CANDLES, CHOCOLATES, XO, RING } from './engine/layouts.js';

// Valentine's Day: a love story, eight boards told from Cupid taking aim to
// "be mine", each board a moment of it, to be reached in turn as Christmas's
// twelve days are. Each board is shaped by its moment, and the boards grow
// through the story, from 72 tiles to the full set of 144. The first,
// Cupid's bow, is the gentle start, with no twist, as the first day's and
// the 10 are; on the second his arrow has struck, and goes on striking
// couples to be taken together (engine/cupid.js); on the third a secret
// admirer's valentine comes, its sweet nothings in two halves to be taken
// one after the other (engine/sweethearts.js); on the fourth a dozen roses,
// each to be taken while it's in bloom (engine/roses.js); on the fifth, the
// first date, a pair is candlelit with a tile in each candle's glow
// (engine/candles.js); on the sixth a box of chocolates, each to be eaten
// whole before the next (engine/chocolates.js); on the seventh hugs and
// kisses, taken in turn for XOXOs (engine/xoxo.js); and the eighth is Be
// mine, the ring, when the question is popped halfway and every tile turns
// over, told in its own words (main.js), as Twelfth Night is. Each chapter
// is as Thanksgiving's days are (thanksgiving.js says what each part is
// for). PLAN.md has the story's boards and twists, and
// tools/valentine-drafts.js has them drawn as they were planned. Its boards wear Valentine's own tiles (ui/valentine-faces.js)
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
  {
    name: 'The fourth chapter',
    title: 'A dozen roses',
    layout: ROSES,
    rules: { treats: false, ghostsFloat: false, roses: { count: 12, every: 3, lasts: 6 } },
    sky: ['#86304b', '#290d18'],
    text: "The secret admirer sends a dozen roses, the twelve on top of the vase still in bud. From the third match one opens every three matches, from the top down, and stays in bloom for six. Take a rose in bloom with any tile of its kind, and it joins the bouquet: 20 points. A rose taken in bud is wasted, and one left too long wilts.",
  },
  {
    name: 'The fifth chapter',
    title: 'The first date',
    layout: CANDLES,
    rules: { treats: false, ghostsFloat: false, candles: { every: 6, deep: 3, pairs: 6 } },
    sky: ['#5e2f3e', '#1c0b12'],
    text: "Dinner by candlelight, the first date. Each candle's glow tinges the tiles round its flame gold, his on the left and hers on the right. Take a pair with a tile in each glow, a table for two, and it's a candlelit pair: 20 points. Every six matches the candles burn down and their glow sinks a row toward the table, until they gutter out near the end.",
  },
  {
    name: 'The sixth chapter',
    title: 'A box of chocolates',
    layout: CHOCOLATES,
    rules: { treats: false, ghostsFloat: false, chocolates: true },
    sky: ['#5a3328', '#1d0f0b'],
    text: "A box of chocolates, the lid off: nine in three rows, each on its paper cup. Bite into a chocolate by taking its top, then eat the rest of it, cup and all, before biting into another, and it's savoured: 30 points. Bite into another first, and the one left half-eaten is just eaten. The box's walls can be taken at any time.",
  },
  {
    name: 'The seventh chapter',
    title: 'Hugs and kisses',
    layout: XO,
    rules: { treats: false, ghostsFloat: false, xoxo: { split: 11 } },
    sky: ['#7a2f5c', '#260d1d'],
    text: 'Hugs and kisses. A pair from the X, both its tiles in it, is a kiss; from the O, a hug. Take kisses and hugs in turn, four in a row, kiss, hug, kiss, hug or the other way round, and it makes an XOXO: 15 points. Two kisses or two hugs together, or a pair with a tile in each letter, start it again.',
  },
  {
    name: 'The eighth chapter',
    title: 'Be mine',
    layout: RING,
    rules: { treats: false, ghostsFloat: false, turn: 1 / 2 },
    words: 'question',
    sky: ['#2a1a46', '#0a0613'],
    text: "The ring comes out, and halfway through, the question is popped: will you be mine? Every tile turns over then: hold the moon, or Space, to see the other side coming, and before then, take pairs that match on both sides. A tile left without a partner is a broken heart, and broken hearts match each other.",
  },
];

// The chapter of the love story a board is for, if it is one of its boards:
// played freely, by its address (#play/bow), a chapter's board plays by that
// chapter's rules.
export const chapterOf = (layout) => LOVE_STORY.find((d) => d.layout === layout);
