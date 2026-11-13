import { PEARTREE, DOVES, HEN, SONGBIRD, RINGS, GOOSE, SWAN, PAIL, DANCER, CROWN, BAGPIPES, DRUM } from './engine/layouts.js';

// Christmas: the Twelve Days, twelve boards, one for each gift of the song,
// from a partridge in a pear tree to twelve drummers drumming, reached in
// turn as Thanksgiving week's days are. Each board is shaped by its gift,
// and the boards grow through the twelve days, as the song does. The first
// day's is the gentle start, with no twist, as the first Sunday's and the
// Long Night's 6 pm are; the twelfth's is Twelfth Night, when the tiles turn
// over halfway, as the Sunday Scaries' do at sundown, and is told in its own
// words (main.js has them), its lost souls lumps of coal. Each day is as
// Thanksgiving's are (thanksgiving.js says what each part is for), with
// lovebirds, on the second day's board, for a kind's two pairs taken one
// straight after the other, eggs, on the third's, for how many of the tiles
// that start blocked are eggs, hatching as they come free, flock, on the
// fourth's, for pairs whose two tiles touch,
// rings, on the fifth's, for the square each ring goes round, turning to
// gold once every tile of it is taken, goslings, on the sixth's, for how
// many pairs in a line, each beside or under the one before, make a brood,
// swans, on the seventh's, for how many of its pairs are a tile and its own
// reflection in the lake, milk, on the eighth's, for its pails of fresh
// milk and how long each keeps once a tile of it is free, dance, on the
// ninth's, for every how many matches the free tiles change partners,
// lords, on the tenth's, for how many tiles are lords, free wherever they
// are, and pipers, on the eleventh's, for how many tiles are pipers, whom
// the rest of their kind follow out. Until Christmas's own tiles are drawn,
// its boards wear Halloween's.

export const TWELVE_DAYS = [
  {
    name: 'The first day',
    title: 'A partridge in a pear tree',
    layout: PEARTREE,
    rules: { treats: false, ghostsFloat: false },
    sky: ['#2b4a43', '#0d1714'],
    text: 'The first of the twelve days brings the first gift: a partridge, perched at the top of a pear tree. A tile is free when nothing lies on it and its left or right side is open, as the pears hanging from the lower boughs are: take two free tiles that match.',
  },
  {
    name: 'The second day',
    title: 'Two turtle doves',
    layout: DOVES,
    rules: { treats: false, ghostsFloat: false, lovebirds: true },
    sky: ['#4d4058', '#16121c'],
    text: "Two turtle doves, beak to beak, make a heart. Every kind of tile comes as two pairs: take a kind's second pair straight after its first, and they're lovebirds, for 30 points.",
  },
  {
    name: 'The third day',
    title: 'Three French hens',
    layout: HEN,
    rules: { treats: false, ghostsFloat: false, eggs: 12 },
    sky: ['#5b4a32', '#1a140c'],
    text: "The hens have been sitting on their eggs: a dozen tiles are still eggs, and there's no telling what's inside one until it comes free and hatches.",
  },
  {
    name: 'The fourth day',
    title: 'Four calling birds',
    layout: SONGBIRD,
    rules: { treats: false, ghostsFloat: false, flock: true },
    sky: ['#38506b', '#10161f'],
    text: 'The calling birds are singing on the branch, and birds of a feather flock together: take a pair whose two tiles touch, side by side or one just above the other, for 20 points.',
  },
  {
    name: 'The fifth day',
    title: 'Five gold rings',
    layout: RINGS,
    // The rings' squares, [left, top, across, down] in tiles: the four
    // corners', and the middle one's, linked through them all.
    rules: {
      treats: false,
      ghostsFloat: false,
      rings: [
        [0, 0, 4, 4],
        [5, 0, 4, 4],
        [2, 2, 5, 5],
        [0, 5, 4, 4],
        [5, 5, 4, 4],
      ],
    },
    sky: ['#6b2433', '#1f0a10'],
    text: 'Five rings lie linked, the middle one through the other four. Take every tile of a ring, and it turns to gold where it lay, for 50 points.',
  },
  {
    name: 'The sixth day',
    title: 'Six geese a-laying',
    layout: GOOSE,
    rules: { treats: false, ghostsFloat: false, goslings: 6 },
    sky: ['#4a5a2c', '#15190c'],
    text: "The goose is sitting on her eggs, and her goslings follow her in a line. Take a pair beside or just under the pair you took before, marked with a gosling, and it follows on: six in a line score 60 points.",
  },
  {
    name: 'The seventh day',
    title: 'Seven swans a-swimming',
    layout: SWAN,
    rules: { treats: false, ghostsFloat: false, swans: 7 },
    sky: ['#1f4f63', '#08161d'],
    text: 'A swan glides on a still lake, mirrored in it. Seven tiles match their own reflection, the tile as far below the water as they are above it: take a tile and its reflection together, a swan, for 50 points. Take either with another, and she swims off.',
  },
  {
    name: 'The eighth day',
    title: 'Eight maids a-milking',
    layout: PAIL,
    rules: { treats: false, ghostsFloat: false, milk: { pails: 8, keeps: 8 } },
    sky: ['#3f5a5c', '#111a1b'],
    text: "The maids have milked eight pails, each a pair of tiles marked 🥛. Once either of a pail's tiles is free, its milk keeps for eight matches, counted down on it: dig out the other, and take the two together while it's fresh, for 40 points. Take either with another tile, and it spills.",
  },
  {
    name: 'The ninth day',
    title: 'Nine ladies dancing',
    layout: DANCER,
    rules: { treats: false, ghostsFloat: false, dance: 9 },
    sky: ['#6a3a4a', '#1e1015'],
    text: 'The ladies are dancing, and every nine matches the music changes: each free tile dances off with a tile still held down, and they change places. Take the pairs you can see before the music changes. The board can always still be won.',
  },
  {
    name: 'The tenth day',
    title: 'Ten lords a-leaping',
    layout: CROWN,
    rules: { treats: false, ghostsFloat: false, lords: 10 },
    sky: ['#3a2a6b', '#110c21'],
    text: "Ten lords are leaping among the tiles, each marked 👑: a lord is free wherever he is, under other tiles or hemmed in, and goes with any free tile of his kind. Take one while he's still held down, and he's leapt, for 20 points; or keep him to get you out of a tight spot.",
  },
  {
    name: 'The eleventh day',
    title: 'Eleven pipers piping',
    layout: BAGPIPES,
    rules: { treats: false, ghostsFloat: false, pipers: 11 },
    sky: ['#24443a', '#0a1511'],
    text: 'Eleven pipers are among the tiles, each marked 🎶. Take a piper with a tile of his kind, and he plays: the rest of his kind still on the board follow him out, from wherever they are, for 15 points each. Play him while they are still buried, and they dig the board open.',
  },
  {
    name: 'The twelfth day',
    title: 'Twelve drummers drumming',
    layout: DRUM,
    rules: { treats: false, ghostsFloat: false, turn: 1 / 2 },
    words: 'twelfth',
    sky: ['#262055', '#0a0818'],
    text: "It's Twelfth Night, the last of Christmas. Halfway through, the drummers drum and every tile turns over: hold the moon, or Space, to see its other side coming. Before then, take pairs that match on both sides. A tile left without a partner turns to coal, and coal matches coal.",
  },
];

// The day of Christmas a board is for, if it is one of the twelve: played
// freely, by its address (#play/peartree), a day's board plays by that
// day's rules.
export const dayOfChristmas = (layout) => TWELVE_DAYS.find((d) => d.layout === layout);
