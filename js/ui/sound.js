// The sounds, made as they play with Web Audio, so there are no files to
// fetch: a wooden tock for a tile, a tune a note for each match, the clock
// striking twelve at midnight, chimes at sunrise and for treats, and a
// rustle for a shuffle. Browsers let sound start only after a tap or a key,
// so nothing is made until then.
//
// Each holiday has its own music, as it has its own tiles (use): Halloween's
// is a pipe organ in a stone church playing the opening of Bach's Toccata
// and Fugue in D minor; Thanksgiving's a banjo in a farmhouse parlour
// playing "Over the River and Through the Wood", with a reed organ for "We
// Gather Together" when the week is seen through, and its own sounds for a
// shuffle (leaves), a hint (a handbell), a treat (the dinner triangle) and
// no pairs left (a turkey's gobble); Christmas's a music box by the
// fireside playing "The Twelve Days of Christmas", with sleigh bells for a
// shuffle, a silver bell for a hint, a present unwrapped for a treat and a
// lump of coal for no pairs left; New Year's a piano in a ballroom playing
// "Auld Lang Syne", with a party horn for a shuffle, a champagne glass's
// ting for a hint, a cork popping for a treat and a party horn running out
// of breath for no pairs left; Groundhog Day's a harpsichord playing
// Vivaldi's Four Seasons, Spring for an early spring and Winter for six
// more weeks of it, with the groundhog digging for a shuffle, a cardinal's
// whistle for a hint, a candle lit for Candlemas for a treat, and the
// groundhog seeing his shadow for no pairs left; Valentine's Day's a harp
// in a drawing room playing Liszt's Liebestraum, his dream of love, with
// love letters shuffled for a shuffle, a kiss blown for a hint, a box of
// chocolates opened for a treat and a heart breaking for no pairs left;
// April Showers' a piano in a sunroom playing Chopin's Raindrop Prelude,
// with a spring shower pattering on the glass for a shuffle, a raindrop on
// the window for a hint, a rainbow shimmering for a treat and thunder far
// off for no pairs left; and the turtle's own, played any time, a piano by
// a pond playing Satie's first Gymnopédie, slow and steady, with the pond
// stirred for a shuffle, a frog's croak for a hint, a koi leaping for a
// treat and the turtle knocking into his shell for no pairs left. The
// others play Halloween's until theirs come.

// The opening, a note for each match: the mordent on A and its run down to
// D, three times, an octave lower each time.
const TOCCATA = [81, 79, 81, 79, 77, 76, 74, 73, 74, 69, 67, 69, 64, 65, 61, 62, 57, 55, 57, 55, 53, 52, 50, 49, 50];

// Thanksgiving's song, "Over the River and Through the Wood", Lydia Maria
// Child's Thanksgiving poem of 1844 to its traditional tune, in C, in 6/8:
// [note, eighths]. A note for each match, and its last line, from the
// second "Over the river", for a cleared board, over an oom-pah, a chord to
// each beat of it.
export const RIVER = [
  [67, 1], [67, 1], [67, 1], [67, 1], [64, 1], [65, 1], [67, 2], [67, 1], [67, 2], [67, 1],
  [72, 1], [72, 1], [72, 1], [71, 2], [69, 1], [67, 5], [67, 1],
  [65, 1], [65, 1], [65, 1], [65, 2], [65, 1], [64, 1], [64, 1], [64, 1], [64, 2], [64, 0.5], [64, 0.5],
  [62, 2], [62, 1], [62, 2], [64, 1], [62, 3], [67, 3],
  [67, 1], [67, 1], [67, 1], [67, 1], [64, 1], [65, 1], [67, 2], [67, 1], [67, 2], [67, 1],
  [72, 2], [72, 1], [71, 2], [69, 1], [67, 2], [64, 1], [60, 2], [62, 1],
  [64, 1], [64, 1], [65, 1], [64, 2], [62, 1], [60, 6],
];
export const LAST_LINE = 34; // where the second "Over the river" begins
const RIVER_CHORDS = ['C', 'C', 'C', 'C', 'F', 'G7', 'C', 'G7', 'C', 'G7'];
const CHORDS = { C: [48, [60, 64, 67]], F: [41, [60, 65, 69]], G7: [43, [59, 62, 65]] };

// "We Gather Together", the Thanksgiving hymn, its tune a Dutch song of
// 1597 as Eduard Kremser set it in 1877, in D, in 3/4: its four voices,
// soprano, alto, tenor and bass, each as [note, beats], from the upbeat.
export const GATHER = [
  [[69, 1], [69, 1.5], [71, 0.5], [69, 1], [66, 1], [67, 1], [69, 1], [67, 1.5], [66, 0.5], [64, 1], [66, 1], [62, 1],
    [69, 1], [69, 1.5], [71, 0.5], [73, 1], [74, 1.5], [76, 0.5], [73, 1], [71, 1.5], [69, 0.5], [71, 1], [69, 2],
    [69, 1], [69, 1.5], [71, 0.5], [73, 1], [74, 1], [69, 1], [69, 1], [69, 1.5], [71, 0.5], [67, 0.5], [69, 0.5], [66, 1], [62, 1],
    [62, 1], [67, 1.5], [69, 0.5], [71, 0.5], [67, 0.5], [69, 1.5], [67, 0.5], [66, 1], [67, 1], [64, 1.5], [62, 0.5], [62, 2]],
  [[62, 1], [62, 1.5], [62, 0.5], [62, 1], [62, 1], [62, 1], [62, 1], [62, 1.5], [62, 0.5], [61, 1], [62, 1], [62, 1],
    [66, 1], [64, 1.5], [64, 0.5], [64, 1], [66, 1], [64, 1], [64, 1], [66, 1.5], [66, 0.5], [68, 1], [64, 2],
    [64, 1], [64, 1.5], [64, 0.5], [64, 1], [62, 1], [62, 1], [62, 1], [62, 2], [61, 0.5], [61, 0.5], [62, 1], [62, 1],
    [62, 1], [62, 1.5], [62, 0.5], [62, 0.5], [62, 0.5], [64, 2], [62, 1], [59, 1], [61, 1.5], [62, 0.5], [62, 2]],
  [[54, 1], [54, 1.5], [55, 0.5], [54, 1], [57, 1], [57, 1], [57, 1], [59, 1.5], [59, 0.5], [57, 1], [57, 1], [54, 1],
    [57, 1], [57, 1.5], [57, 0.5], [57, 1], [57, 1], [56, 1], [57, 1], [62, 1.5], [62, 0.5], [62, 1], [61, 2],
    [61, 1], [61, 1.5], [59, 0.5], [57, 1], [57, 1], [57, 1], [57, 1], [59, 2], [57, 0.5], [57, 0.5], [57, 1], [54, 1],
    [54, 1], [55, 1.5], [54, 0.5], [55, 0.5], [55, 0.5], [52, 1], [57, 1], [57, 1], [55, 1], [55, 1.5], [54, 0.5], [54, 2]],
  [[50, 1], [50, 1.5], [50, 0.5], [50, 1], [50, 1], [52, 1], [54, 1], [52, 1.5], [52, 0.5], [57, 1], [50, 1], [50, 1],
    [50, 1], [49, 1.5], [49, 0.5], [49, 1], [47, 1], [52, 1], [57, 1], [47, 1.5], [47, 0.5], [52, 1], [57, 2],
    [57, 1], [55, 1.5], [55, 0.5], [55, 1], [54, 1], [54, 1], [54, 1], [52, 2], [57, 0.5], [57, 0.5], [50, 1], [50, 1],
    [50, 1], [47, 1.5], [45, 0.5], [43, 0.5], [47, 0.5], [49, 2], [50, 1], [52, 1], [45, 1.5], [50, 0.5], [50, 2]],
];

// Christmas's carol, "The Twelve Days of Christmas", in F, as Frederic
// Austin set it in 1909, a phrase at a time, the phrases a verse is made
// of: each [notes, bass], a note [note, beats] and a bass note [note, the
// beat of the phrase it falls on]. Played an octave up, on a music box.
const CAROL = {
  on: [[[60, 0.5], [60, 0.5]], []], // On the
  day: [[[60, 1], [65, 0.5], [65, 0.5], [65, 1], [64, 0.5], [65, 0.5]], [[53, 0]]], // first day of Christmas my
  sentA: [[[67, 0.5], [69, 0.5], [70, 0.5], [67, 0.5], [69, 1.5], [70, 0.5]], [[48, 0], [53, 2]]], // true love sent to me a
  sent: [[[67, 0.5], [69, 0.5], [70, 0.5], [67, 0.5], [69, 2]], [[48, 0], [53, 2]]], // true love sent to me
  doves: [[[72, 1], [67, 0.5], [69, 0.5], [70, 1], [69, 0.5], [70, 0.5]], [[48, 0]]], // Two turtle doves and a, in the second verse to the fourth
  hens: [[[72, 1], [67, 0.5], [69, 0.5], [70, 1]], [[48, 0]]], // Three French hens, Four calling birds, in the third and fourth
  geese: [[[72, 1], [67, 0.5], [69, 0.5], [70, 0.5], [67, 0.5]], [[48, 0]]], // Six geese a-laying, and on to Twelve drummers drumming
  rings: [[[72, 2], [74, 0.5], [71, 1.5], [72, 4]], [[48, 0], [43, 2], [48, 4]]], // Five gold rings
  birds: [[[72, 0.5], [70, 0.5], [69, 0.5], [67, 0.5], [65, 1]], [[53, 0]]], // Four calling birds, from the fifth verse
  french: [[[70, 1], [62, 1], [65, 1]], [[46, 0]]], // Three French hens, from the fifth
  turtle: [[[67, 0.5], [65, 0.5], [64, 0.5], [62, 0.5], [60, 1], [69, 0.5], [70, 0.5]], [[48, 0], [53, 2]]], // Two turtle doves and a, from the fifth
  partridge: [[[72, 1], [74, 0.5], [70, 0.5], [69, 0.5], [65, 0.5], [67, 1], [65, 3]], [[46, 0], [48, 2], [53, 4]]], // partridge in a pear tree
};

// A verse of the carol, for its day, 1 to 12: the gifts counting down from
// the day's own to the partridge. `short`, as a cleared board plays it, the
// day's own gift and then straight on from five gold rings down.
export function verse(day, short = false) {
  const c = CAROL;
  const gifts =
    day === 1
      ? []
      : day === 2
        ? [c.doves]
        : day <= 4
          ? [...Array(day - 2).fill(c.hens), c.doves]
          : [...Array(short ? Math.min(1, day - 5) : day - 5).fill(c.geese), c.rings, c.birds, c.french, c.turtle];
  return [c.on, c.day, day === 1 ? c.sentA : c.sent, ...gifts, c.partridge];
}

// The fifth verse's notes, the one with five gold rings: a note for each
// match.
export const TWELVE_DAYS = verse(5).flatMap(([notes]) => notes);

// New Year's song, "Auld Lang Syne", Robert Burns's words of 1788 to the
// old Scots tune they are sung to, in F, in 4/4 from an upbeat, verse and
// chorus: [note, beats]. A note for each match; for a cleared board, the
// chorus's last line, and when the countdown is seen through, the whole
// chorus. Under them, the piano's left hand, a chord or two to each bar
// (AULD_CHORDS, bar by bar from the first whole one, and PIANO_CHORDS:
// each chord's root, its fifth, and the chord).
export const AULD = [
  [60, 1],
  [65, 1.5], [65, 0.5], [65, 1], [69, 1], [67, 1.5], [65, 0.5], [67, 1], [69, 1],
  [65, 1.5], [65, 0.5], [69, 1], [72, 1], [74, 3], [74, 1],
  [72, 1.5], [69, 0.5], [69, 1], [65, 1], [67, 1.5], [65, 0.5], [67, 1], [69, 1],
  [65, 1.5], [62, 0.5], [62, 1], [60, 1], [65, 3], [74, 1],
  [72, 1.5], [69, 0.5], [69, 1], [65, 1], [67, 1.5], [65, 0.5], [67, 1], [74, 1],
  [72, 1.5], [69, 0.5], [69, 1], [72, 1], [74, 3], [74, 1],
  [72, 1.5], [69, 0.5], [69, 1], [65, 1], [67, 1.5], [65, 0.5], [67, 1], [69, 1],
  [65, 1.5], [62, 0.5], [62, 1], [60, 1], [65, 3],
];
export const CHORUS = 28; // the upbeat into "For auld lang syne"
export const LAST_TOAST = 42; // "we'll tak' a cup o' kindness yet"
const AULD_CHORDS = [null, 'F', 'C7', 'F', 'Bb', 'F', 'C7', ['Bb', 'C7'], 'F', 'F', 'C7', 'F', 'Bb', 'F', 'C7', ['Bb', 'C7'], 'F'];
const PIANO_CHORDS = { F: [41, 48, [53, 57, 60]], C7: [48, 43, [52, 55, 58]], Bb: [46, 41, [50, 53, 58]] };

// Groundhog Day's music, from Vivaldi's Four Seasons, 1725, the notes as the
// Mutopia Project's edition gives them: each piece its voices, the tune
// first, each voice [note, beats], 0 a rest. Spring's opening, in E: its
// first theme and its second, the tune of the first violins over the
// second violins and the cello. Its tune is played a note for each match,
// and the whole for a board cleared under par, an early spring.
export const SPRING = [
  [
    [76, 0.5], [80, 0.5], [80, 0.5], [80, 0.5], [78, 0.25], [76, 0.25], [83, 1.5], [83, 0.25], [81, 0.25],
    [80, 0.5], [80, 0.5], [80, 0.5], [78, 0.25], [76, 0.25], [83, 1.5], [83, 0.25], [81, 0.25],
    [80, 0.5], [81, 0.25], [83, 0.25], [81, 0.5], [80, 0.5], [78, 0.5], [75, 0.5], [71, 0.5],
    [76, 0.5], [83, 0.5], [81, 0.25], [80, 0.25], [81, 0.5], [83, 0.5], [85, 0.5], [83, 1],
    [76, 0.5], [83, 0.5], [81, 0.25], [80, 0.25], [81, 0.5], [83, 0.5], [85, 0.5], [83, 1],
    [76, 0.5], [85, 0.5], [83, 1], [81, 0.5], [80, 0.5], [78, 0.25], [76, 0.25], [78, 1], [76, 1],
  ],
  [
    [71, 0.5], [76, 0.5], [76, 0.5], [76, 0.5], [76, 0.5], [80, 1.5], [80, 0.25], [78, 0.25],
    [76, 0.5], [76, 0.5], [76, 0.5], [76, 0.5], [80, 1.5], [80, 0.25], [78, 0.25],
    [76, 0.5], [78, 0.25], [80, 0.25], [78, 0.5], [76, 0.5], [75, 1], [0, 0.5],
    [80, 0.5], [80, 0.5], [78, 0.25], [76, 0.25], [78, 0.5], [80, 0.5], [81, 0.5], [80, 1],
    [80, 0.5], [80, 0.5], [78, 0.25], [76, 0.25], [78, 0.5], [80, 0.5], [81, 0.5], [80, 1],
    [80, 0.5], [81, 0.5], [80, 1], [78, 0.5], [76, 1], [75, 1], [76, 1],
  ],
  [
    [52, 0.5], [52, 1], [52, 1], [52, 1], [52, 1], [52, 1], [52, 1], [52, 1], [52, 1], [52, 0.5], [52, 0.5], [45, 0.5], [46, 0.5], [47, 1], [0, 0.5],
    [52, 0.5], [52, 1], [52, 1], [52, 1], [52, 1], [52, 1], [52, 1], [52, 1], [52, 1], [52, 1], [52, 0.5], [47, 0.5], [52, 0.5], [40, 0.5], [59, 0.5], [47, 0.5], [40, 1],
  ],
];

// Winter's opening, in F minor, for six more weeks of it: the strings'
// shivering eighths, the cello alone, then the violas, the second violins
// and the first, each a bar after the last, to a clash that resolves into
// F minor, and the harpsichord's chord of it to end on.
const shiver = (...runs) => runs.flatMap(([note, beats]) => Array(beats * 2).fill([note, 0.5]));
export const WINTER = [
  [[0, 12], ...shiver([82, 8], [80, 4])],
  [[0, 8], ...shiver([73, 12], [72, 4])],
  [[0, 4], ...shiver([67, 16], [68, 2], [65, 2])],
  shiver([53, 16], [52, 4], [53, 4]),
];
const WINTER_END = [41, 53, 60, 65, 68, 80];

// Valentine's Day's music, Liszt's Liebestraum No. 3, his dream of love,
// of 1850, in A flat, in 6/4: the theme the nocturne is known by, from its
// upbeat, sung twice, the second time rising to its high F. The tune, as
// [note, beats], 0 a rest, an octave above Liszt's, where it sings over
// its harmony on the harp; a note of it for each match. For a chapter of
// the love story cleared, its last line, from the ninth bar; and when the
// question is popped and answered, its whole second time, from the upbeat.
export const LIEBESTRAUM = [
  [63, 1],
  [72, 3], [72, 3],
  [72, 5], [72, 1],
  [72, 2], [72, 1], [73, 2], [72, 1],
  [72, 3], [65, 1], [0, 1], [65, 1],
  [65, 1], [67, 1], [68, 1], [72, 2], [70, 1],
  [68, 5], [63, 1],
  [72, 3], [72, 3],
  [72, 5], [72, 1],
  [72, 2], [72, 1], [73, 2], [72, 1],
  [77, 5], [65, 1],
  [65, 1], [67, 1], [68, 1], [72, 2], [70, 1],
  [68, 6],
];
export const SECOND_TIME = 19; // the upbeat into the theme's second time
export const DREAM_LINE = 24; // the ninth bar, the second time's last line

// Its harmony, from the first whole bar, a chord to each half bar: the
// bass, and then the chord rippling up and back down over it, an eighth a
// note after the bass's own, as Liszt wrote it.
export const DREAM_HARMONY = [
  [56, [63, 68, 72, 68, 63]], [44, [63, 68, 72, 68, 63]],
  [55, [64, 70, 72, 70, 64]], [43, [64, 70, 72, 70, 64]],
  [53, [63, 69, 72, 69, 63]], [41, [63, 69, 72, 69, 63]],
  [46, [62, 68, 72, 68, 62]], [34, [62, 68, 72, 68, 62]],
  [39, [61, 63, 72, 63, 61]], [51, [61, 63, 67, 63, 61]],
  [44, [60, 63, 68, 63, 60]], [32, [56, 60, 68, 51, 56]],
  [56, [63, 68, 72, 68, 63]], [44, [63, 68, 72, 68, 63]],
  [43, [64, 70, 72, 70, 64]], [42, [64, 70, 72, 70, 64]],
  [41, [63, 69, 72, 69, 63]], [53, [63, 65, 72, 69, 63]],
  [46, [62, 68, 77, 72, 68]], [34, [56, 58, 65, 62, 58]],
  [39, [58, 61, 67, 63, 61]], [51, [61, 63, 67, 63, 61]],
  [44, [60, 63, 68, 63, 60]], [32, [60, 68, 63, 60, 56]],
];

// The tune's notes, each with the bass it sings over, for the matches: the
// upbeat over the first bar's.
const DREAM_NOTES = [];
for (let k = 0, beat = 0; k < LIEBESTRAUM.length; beat += LIEBESTRAUM[k++][1]) {
  const [note] = LIEBESTRAUM[k];
  if (note) DREAM_NOTES.push([note, DREAM_HARMONY[Math.max(0, Math.floor((beat - 1) / 3))][0]]);
}

// April Showers' music, Chopin's Prelude in D flat, Op. 28 No. 15, the
// Raindrop, of 1839, in 4/4, Sostenuto, as the Mutopia Project's edition
// gives it: its first eight bars, the theme and the theme again, to its
// close on D flat. The tune, as [note, beats], the run in the fourth bar
// seven notes to a beat; a note of it for each match, over the A flat that
// falls through it all like rain. For a chapter cleared, the theme the
// second time, from the fifth bar; and for April Showers seen through, on
// May Day, all eight bars.
const RUN = 1 / 7;
export const PRELUDE = [
  [77, 0.75], [73, 0.25], [68, 2], [70, 1],
  [72, 3], [73, 1],
  [75, 0.75], [77, 0.25], [78, 2], [77, 1],
  [77, 1.5], [75, 0.5], [73, 1], [75, RUN], [77, RUN], [75, RUN], [74, RUN], [75, RUN], [77, RUN], [78, RUN],
  [77, 0.75], [73, 0.25], [68, 2], [70, 1],
  [72, 3], [73, 1],
  [75, 0.75], [77, 0.25], [78, 2], [77, 1],
  [77, 1.5], [75, 0.5], [73, 1], [72, 0.5], [73, 0.5],
];
export const SECOND_PHRASE = 20; // the fifth bar, where the theme begins again
export const RAINDROP = 56; // the A flat that falls like rain

// Its left hand, bar by bar, as [eighth, notes]: the A flat on most of the
// eighths, the bass and the chords between, and the notes held under them
// struck where they begin.
const LEFT_HAND_BARS = {
  tonic: [[0, [49]], [1, [RAINDROP]], [2, [61, 65]], [2, [49, 53]], [3, [RAINDROP]], [4, [RAINDROP]], [5, [RAINDROP]], [6, [61, 65]], [7, [RAINDROP]]],
  dominant: [[0, [51, 54]], [0, [63, 66]], [1, [44]], [2, [44]], [3, [44]], [4, [46]], [5, [44]], [6, [49, 53]], [7, [44]]],
  ninth: [[0, [66]], [0, [60]], [1, [RAINDROP]], [1.5, [68]], [2, [70]], [3, [RAINDROP]], [4, [RAINDROP]], [5, [RAINDROP]], [6, [61, 68]], [7, [RAINDROP]]],
  turn: [[0, [68]], [0, [60]], [1, [RAINDROP]], [2, [66]], [3, [RAINDROP]], [4, [61, 65]], [5, [RAINDROP]], [6, [60, 66]], [7, [RAINDROP]]],
  close: [[0, [68]], [0, [60]], [1, [RAINDROP]], [2, [63]], [3, [RAINDROP]], [4, [61, 65]], [5, [RAINDROP]], [6, [61, 65]], [7, [RAINDROP]]],
};
export const PRELUDE_LEFT = ['tonic', 'dominant', 'ninth', 'turn', 'tonic', 'dominant', 'ninth', 'close'].map((bar) => LEFT_HAND_BARS[bar]);

// The turtle's music, Satie's first Gymnopédie, of 1888, in 3/4, Lent et
// douloureux, as the Mutopia Project's public-domain edition gives it: its
// first twenty-one bars, four bars of its rocking chords before the tune
// comes in, then the tune's two long phrases. The tune, as [note, beats], 0
// a rest; a note of it for each match, over its bar's bass. For a board
// cleared, its first phrase, from where the tune comes in to its long F
// sharp, over the chord of G.
export const GYMNOPEDIE = [
  [0, 12],
  [0, 1], [78, 1], [81, 1],
  [79, 1], [78, 1], [73, 1],
  [71, 1], [73, 1], [74, 1],
  [69, 3],
  [66, 12],
  [0, 1], [78, 1], [81, 1],
  [79, 1], [78, 1], [73, 1],
  [71, 1], [73, 1], [74, 1],
  [69, 3],
  [73, 3],
  [78, 3],
  [64, 9],
];

// Its left hand, a bar each: the bass on the first beat, and the chord on
// the second, held, rocking between G and D until the second phrase turns.
const G_CHORD = [43, [59, 62, 66]];
const D_CHORD = [38, [57, 61, 66]];
export const GYMNOPEDIE_LEFT = [
  ...Array.from({ length: 16 }, (_, k) => (k % 2 ? D_CHORD : G_CHORD)),
  [42, [57, 61, 66]],
  [35, [59, 62, 66]],
  [40, [55, 59]],
  [40, [59, 62, 67]],
  [38, [53, 57, 62]],
];

// The tune's notes, each with its bar's bass, for the matches.
const POND_NOTES = [];
for (let k = 0, beat = 0; k < GYMNOPEDIE.length; beat += GYMNOPEDIE[k++][1]) {
  const [note] = GYMNOPEDIE[k];
  if (note) POND_NOTES.push([note, GYMNOPEDIE_LEFT[Math.floor(beat / 3)][0]]);
}

// The harp swept up, two octaves of A flat's scale, for the question
// answered.
const GLISSANDO = [68, 70, 72, 73, 75, 77, 79, 80, 82, 84, 85, 87, 89, 91, 92];

// Each holiday's music, as far as it has its own: the room it rings in.
// Holidays not here play Halloween's.
const MUSIC = {
  halloween: { room: 'stone' },
  thanksgiving: { room: 'farmhouse' },
  christmas: { room: 'fireside' },
  'new-year': { room: 'ballroom' },
  groundhog: { room: 'salon' },
  valentines: { room: 'drawing' },
  showers: { room: 'sunroom' },
  turtle: { room: 'lakeside' },
};

// The rooms: a stone church's long echo for the organ and the bells, a
// farmhouse parlour's, short and warm, for the banjo, a fireside's, a
// little longer, for the music box, a ballroom's, wide, for the piano, a
// music room's for the harpsichord, a drawing room's, soft, for the harp,
// a sunroom's, bright, its glass ringing a little, for the piano by the
// rain, and a lakeside's, wide and soft, carrying over the water, for the
// turtle's.
const ROOMS = {
  stone: { seconds: 2.8, fall: 3.2, wet: 0.35 },
  farmhouse: { seconds: 0.8, fall: 3.6, wet: 0.22 },
  fireside: { seconds: 1.3, fall: 3.4, wet: 0.26 },
  ballroom: { seconds: 2, fall: 3, wet: 0.3 },
  salon: { seconds: 1.4, fall: 3.2, wet: 0.24 },
  drawing: { seconds: 1.8, fall: 3, wet: 0.28 },
  sunroom: { seconds: 1.5, fall: 3.3, wet: 0.26 },
  lakeside: { seconds: 2.2, fall: 2.9, wet: 0.3 },
};

// The opening as it is played, for a cleared board: [note, beats], 0 a rest.
const OPENING = [
  [81, 0.25], [79, 0.25], [81, 1.5], [0, 0.5],
  [79, 0.25], [77, 0.25], [76, 0.25], [74, 0.25], [73, 0.75], [74, 1.5], [0, 0.5],
  [69, 0.25], [67, 0.25], [69, 1.5], [0, 0.5],
  [64, 0.25], [65, 0.25], [61, 0.75], [62, 1.5], [0, 0.5],
  [57, 0.25], [55, 0.25], [57, 1.5], [0, 0.5],
  [55, 0.25], [53, 0.25], [52, 0.25], [50, 0.25], [49, 0.75], [50, 1],
];

const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);

export class Sound {
  constructor() {
    this.ctx = null;
    this.next = 0; // the next note of the holiday's tune
    this.set = 'halloween'; // the holiday whose music plays
    this.plucks = new Map(); // the plucked strings worked out so far
    this.song = null; // the music playing for a cleared board, to fade when the next comes
    try {
      this.muted = localStorage.getItem('seasons.sound') === 'off';
    } catch {
      this.muted = false;
    }
    const wake = () => this.start();
    addEventListener('pointerdown', wake, { once: true, capture: true });
    addEventListener('keydown', wake, { once: true, capture: true });
  }

  // Sound begins: on the page, after the first tap or key; in a test, on an
  // offline context, to be listened to as numbers.
  start(ctx = null) {
    if (this.ctx) return;
    ctx = this.ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    this.master = ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.8;
    this.master.connect(ctx.destination);
    this.bus = ctx.createGain();
    this.bus.connect(this.master);
    // The rooms for the instruments to ring in, the bus sent to the one the
    // holiday's music plays in, each made when its music first plays.
    this.rooms = {};
    this.room(MUSIC[this.set].room).gain.value = 1;
    this.noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  // The holiday whose music plays, as its tiles are worn: Thanksgiving's on
  // its week, and on the turtle wearing its tiles; Halloween's for the rest,
  // until theirs come. A new tune begins at its first note, in its own room,
  // the last one's echo dying away.
  use(set) {
    const next = MUSIC[set] ? set : 'halloween';
    if (next === this.set) return;
    this.set = next;
    this.next = 0;
    this.plucks.clear(); // the last holiday's strings, not wanted again
    if (!this.ctx) return;
    this.room(MUSIC[next].room);
    for (const [name, send] of Object.entries(this.rooms)) send.gain.setTargetAtTime(name === MUSIC[next].room ? 1 : 0, this.ctx.currentTime, 0.1);
  }

  // A room for the instruments to ring in, made the first time its music
  // plays, so that only the rooms played in are listened through: its echo,
  // and the bus's send to it, open while its music plays.
  room(name) {
    if (this.rooms[name]) return this.rooms[name];
    const { seconds, fall, wet } = ROOMS[name];
    const room = this.ctx.createConvolver();
    room.buffer = this.echo(seconds, fall);
    const send = this.ctx.createGain();
    send.gain.value = 0;
    const out = this.ctx.createGain();
    out.gain.value = wet;
    this.bus.connect(send).connect(room).connect(out).connect(this.master);
    return (this.rooms[name] = send);
  }

  // A new board: the music still playing for the last one fades away.
  hush() {
    if (this.song) this.song.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
    this.song = null;
  }

  // A piece of music, played through a gain of its own, so that it can fade.
  newSong() {
    this.hush();
    this.song = this.ctx.createGain();
    this.song.connect(this.bus);
    return this.song;
  }

  setMuted(muted) {
    this.muted = muted;
    try {
      localStorage.setItem('seasons.sound', muted ? 'off' : 'on');
    } catch {}
    if (this.ctx) this.master.gain.setTargetAtTime(muted ? 0 : 0.8, this.ctx.currentTime, 0.05);
  }

  // A room's echo: noise dying away, a little different in each ear.
  echo(seconds, fall) {
    const rate = this.ctx.sampleRate;
    const n = Math.floor(rate * seconds);
    const buf = this.ctx.createBuffer(2, n, rate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n) ** fall;
    }
    return buf;
  }

  // Can sound be made now? Not before the first tap, nor while muted.
  get on() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return Boolean(this.ctx) && !this.muted;
  }

  get now() {
    return this.ctx.currentTime;
  }

  // A tone that dies away: the building block of most of what follows.
  ping(f, at, { type = 'sine', gain = 0.2, attack = 0.004, fall = 0.4, into = this.bus } = {}) {
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.value = f;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(gain, at + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, at + attack + fall);
    o.connect(g).connect(into);
    o.start(at);
    o.stop(at + attack + fall + 0.05);
  }

  // A note on a pipe organ: a few pipes sounding together, held, then let go.
  organ(midi, at, length, gain = 0.16, into = this.bus) {
    const out = this.ctx.createGain();
    out.gain.setValueAtTime(0, at);
    out.gain.linearRampToValueAtTime(gain, at + 0.03);
    out.gain.setValueAtTime(gain, at + length);
    out.gain.exponentialRampToValueAtTime(0.0001, at + length + 0.4);
    out.connect(into);
    for (const [k, a] of [[1, 1], [2, 0.55], [3, 0.3], [4, 0.22], [6, 0.1], [8, 0.07]]) {
      const o = this.ctx.createOscillator();
      o.frequency.value = hz(midi) * k;
      const g = this.ctx.createGain();
      g.gain.value = a / 2.3;
      o.connect(g).connect(out);
      o.start(at);
      o.stop(at + length + 0.45);
    }
  }

  // A plucked string, worked out ahead as a buffer, in Karplus and Strong's
  // way: a burst of noise, plucked a fraction `pick` of the way along, runs
  // round a loop as long as the string's period, each time round averaged
  // with its neighbour, which softens it, and a little lost (`keep`), which
  // dies it away. `bright` keeps more of the burst's high notes. The loop
  // is whole samples long, so the string is tuned exactly when it is played.
  // Kept, one buffer a string.
  pluck(midi, { bright, keep, pick, seconds }) {
    const key = [midi, bright, keep, pick, seconds].join();
    let string = this.plucks.get(key);
    if (string) return string;
    const rate = this.ctx.sampleRate;
    const period = rate / hz(midi);
    const n = Math.max(2, Math.floor(period + 0.5)); // averaging two neighbours, the loop rings n - 0.5 samples round
    const burst = new Float32Array(n);
    let soft = 0;
    for (let i = 0; i < n; i++) burst[i] = soft = bright * (Math.random() * 2 - 1) + (1 - bright) * soft;
    const at = Math.max(1, Math.round(n * pick));
    const loop = burst.map((v, i) => v - burst[(i - at + n) % n]); // plucked near the bridge: some partials cancel
    const mean = loop.reduce((a, b) => a + b, 0) / n;
    for (let i = 0; i < n; i++) loop[i] -= mean; // no thump of a constant offset
    const buffer = this.ctx.createBuffer(1, Math.floor(rate * seconds), rate);
    const d = buffer.getChannelData(0);
    let peak = 0;
    for (let i = 0, k = 0; i < d.length; i++, k = (k + 1) % n) {
      d[i] = loop[k];
      peak = Math.max(peak, Math.abs(d[i]));
      loop[k] = keep * 0.5 * (loop[k] + loop[(k + 1) % n]);
    }
    for (let i = 0; i < d.length; i++) d[i] /= peak || 1;
    string = { buffer, tune: (n - 0.5) / period };
    this.plucks.set(key, string);
    return string;
  }

  // A string played: its buffer, tuned, through `through` if given, and
  // with `length`, damped when that is up, as a harpsichord's key let go is.
  string(midi, at, gain, shape, into, through = null, length = 0) {
    const { buffer, tune } = this.pluck(midi, shape);
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.playbackRate.value = tune;
    const g = this.ctx.createGain();
    g.gain.value = gain;
    if (through) src.connect(through).connect(g);
    else src.connect(g);
    g.connect(into);
    src.start(at);
    if (length) {
      g.gain.setValueAtTime(gain, at + length);
      g.gain.exponentialRampToValueAtTime(0.0001, at + length + 0.06);
      src.stop(at + length + 0.08);
    }
  }

  // A harpsichord: each key plucks two strings with quills, one at pitch
  // and one an octave above, bright and jangling; with `length`, the key
  // let go and the strings damped.
  harpsichord(midi, at, gain = 0.15, into = this.bus, length = 0) {
    this.string(midi, at, gain, { bright: 0.95, keep: 0.996, pick: 0.08, seconds: 1.5 }, into, null, length);
    if (midi < 84) this.string(midi + 12, at, gain * 0.4, { bright: 0.95, keep: 0.994, pick: 0.12, seconds: 1.1 }, into, null, length);
  }

  // A harp: a gut string plucked by a fingertip, halfway between round and
  // bright, ringing on, the low strings longest, and rung down to a whisper
  // by the time its buffer ends.
  harp(midi, at, gain = 0.16, into = this.bus) {
    const seconds = midi < 50 ? 2.6 : midi < 72 ? 2 : 1.4;
    const keep = +(0.03 ** (1 / (hz(midi) * seconds))).toFixed(6);
    this.string(midi, at, gain, { bright: 0.4, keep, pick: 0.3, seconds }, into);
  }

  // A whistle: a pure note sliding from one pitch to another, a bird's, or
  // a groundhog's.
  whistle(at, from, to, length, gain = 0.05, into = this.master) {
    const o = this.ctx.createOscillator();
    o.frequency.setValueAtTime(from, at);
    o.frequency.exponentialRampToValueAtTime(to, at + length);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(gain, at + 0.015);
    g.gain.setValueAtTime(gain, at + length * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, at + length);
    o.connect(g).connect(into);
    o.start(at);
    o.stop(at + length + 0.02);
  }

  // A banjo: plucked near the bridge, bright and short-lived, its twang
  // brought out where a banjo's drum head rings.
  banjo(midi, at, gain = 0.25, into = this.bus) {
    const head = this.ctx.createBiquadFilter();
    head.type = 'peaking';
    head.frequency.value = 2200;
    head.Q.value = 1.1;
    head.gain.value = 6;
    this.string(midi, at, gain, { bright: 0.9, keep: 0.995, pick: 0.1, seconds: 1.4 }, into, head);
  }

  // A guitar: warmer, plucked further along, ringing longer, for the
  // oom-pah under the banjo.
  guitar(midi, at, gain = 0.12, into = this.bus) {
    this.string(midi, at, gain, { bright: 0.45, keep: 0.998, pick: 0.2, seconds: 2 }, into);
  }

  // A parlour reed organ, as a farmhouse had: two reeds a note, a hair
  // apart, buzzing through a soft filter, swelling in as the bellows push.
  reed(midi, at, length, gain = 0.045, into = this.bus) {
    const f = hz(midi);
    const tone = this.ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = Math.min(5000, f * 7);
    tone.Q.value = 0.5;
    const out = this.ctx.createGain();
    out.gain.setValueAtTime(0, at);
    out.gain.linearRampToValueAtTime(gain, at + 0.06);
    out.gain.setValueAtTime(gain, at + Math.max(0.07, length - 0.04));
    out.gain.exponentialRampToValueAtTime(0.0001, at + Math.max(0.1, length) + 0.18);
    tone.connect(out).connect(into);
    for (const [type, detune, level] of [['sawtooth', 0, 0.65], ['square', 4, 0.35]]) {
      const o = this.ctx.createOscillator();
      o.type = type;
      o.frequency.value = f;
      o.detune.value = detune;
      const g = this.ctx.createGain();
      g.gain.value = level;
      o.connect(g).connect(tone);
      o.start(at);
      o.stop(at + Math.max(0.1, length) + 0.25);
    }
  }

  // A brass horn: a buzzing tone whose filter opens as the lips start it,
  // with a little vibrato.
  brass(midi, at, length, gain = 0.07, into = this.bus) {
    const f = hz(midi);
    const o = this.ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = f;
    const wobble = this.ctx.createOscillator();
    wobble.frequency.value = 5.5;
    const depth = this.ctx.createGain();
    depth.gain.value = f * 0.005;
    wobble.connect(depth).connect(o.frequency);
    const lips = this.ctx.createBiquadFilter();
    lips.type = 'lowpass';
    lips.Q.value = 1.2;
    lips.frequency.setValueAtTime(f * 1.5, at);
    lips.frequency.linearRampToValueAtTime(f * 8, at + 0.05);
    lips.frequency.exponentialRampToValueAtTime(f * 4, at + length);
    const out = this.ctx.createGain();
    out.gain.setValueAtTime(0, at);
    out.gain.linearRampToValueAtTime(gain, at + 0.03);
    out.gain.setValueAtTime(gain, at + length);
    out.gain.exponentialRampToValueAtTime(0.0001, at + length + 0.12);
    o.connect(lips).connect(out).connect(into);
    for (const osc of [o, wobble]) {
      osc.start(at);
      osc.stop(at + length + 0.15);
    }
  }

  // A bell: partials that are not quite in tune with each other, ringing long.
  bell(f, at, gain = 0.2, ring = 3, into = this.bus) {
    for (const [k, a] of [[0.5, 0.5], [1, 1], [1.19, 0.45], [1.56, 0.35], [2, 0.3], [2.51, 0.2], [2.66, 0.18], [3.01, 0.12]]) {
      this.ping(f * k, at, { gain: gain * a, attack: 0.002, fall: ring / Math.sqrt(k), into });
    }
  }

  // A music box: a steel tine plucked by a pin, a pure note ringing on, and
  // a bright ping over it that dies at once, the tine's next partial, far
  // above it and out of tune with it.
  musicBox(midi, at, gain = 0.18, into = this.bus) {
    const f = hz(midi);
    this.ping(f, at, { gain, attack: 0.002, fall: 1.7, into });
    this.ping(f * 2, at, { gain: gain * 0.1, attack: 0.002, fall: 0.4, into });
    if (f * 6.27 < 15000) this.ping(f * 6.27, at, { gain: gain * 0.3, attack: 0.001, fall: 0.1, into });
  }

  // A piano: a string struck by a felt hammer, its partials a little sharp
  // the higher they go, as a stiff string's are, each dying away the faster
  // the higher it is, the low strings ringing longest.
  piano(midi, at, gain = 0.14, into = this.bus) {
    const f = hz(midi);
    const ring = midi < 55 ? 3.2 : midi < 70 ? 2.4 : 1.8;
    for (let k = 1; k <= 8; k++) {
      const fk = f * k * Math.sqrt(1 + 0.0004 * k * k);
      if (fk > 12000) break;
      this.ping(fk, at, { gain: gain * (k === 1 ? 1 : 0.55 / k ** 1.1), attack: 0.003, fall: ring / k ** 0.6, into });
    }
  }

  // A party horn blown: a paper reed buzzing in its tube, the curl
  // unrolling with a rustle as the note climbs; or with `to` below `from`,
  // a horn running out of breath.
  horn(at, from = 440, to = 520, length = 0.55, gain = 0.15, into = this.master) {
    const o = this.ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(from, at);
    o.frequency.exponentialRampToValueAtTime(to, at + length);
    const tube = this.ctx.createBiquadFilter();
    tube.type = 'bandpass';
    tube.frequency.value = 1400;
    tube.Q.value = 1.4;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(gain, at + 0.03);
    g.gain.setValueAtTime(gain, at + length * 0.8);
    g.gain.exponentialRampToValueAtTime(0.0001, at + length);
    o.connect(tube).connect(g).connect(into);
    o.start(at);
    o.stop(at + length + 0.02);
    this.rustle(at + 0.02, length * 0.6, 3000, 5000, gain * 0.3, into);
  }

  // Sleigh bells shaken once: a cluster of little bells, each ringing high
  // and briefly, and the rattle of the pellets inside them.
  jingle(at, gain = 0.05, into = this.master) {
    for (let k = 0; k < 7; k++) {
      const t = at + Math.random() * 0.03;
      const f = 3800 + Math.random() * 2600;
      this.ping(f, t, { gain: gain * (0.6 + Math.random() * 0.4), attack: 0.001, fall: 0.18, into });
      this.ping(f * 1.48, t, { gain: gain * 0.4, attack: 0.001, fall: 0.1, into });
    }
    this.rustle(at, 0.12, 9000, 6000, gain * 0.8, into);
  }

  // Noise through a moving filter: a rustle or a swish.
  rustle(at, length = 0.35, from = 800, to = 3000, gain = 0.12, into = this.master) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.Q.value = 1.2;
    f.frequency.setValueAtTime(from, at);
    f.frequency.exponentialRampToValueAtTime(to, at + length);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(gain, at + length * 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, at + length);
    src.connect(f).connect(g).connect(into);
    src.start(at);
    src.stop(at + length + 0.05);
  }

  // ------------------------------------------------- what the game asks for

  select() {
    if (this.on) this.ping(720, this.now, { type: 'triangle', gain: 0.1, fall: 0.06, into: this.master });
  }

  blocked() {
    if (this.on) this.ping(150, this.now, { type: 'sine', gain: 0.18, fall: 0.12, into: this.master });
  }

  // A match: the next note of the holiday's tune.
  match() {
    if (!this.on) return;
    if (this.set === 'thanksgiving') this.banjo(RIVER[this.next % RIVER.length][0], this.now);
    else if (this.set === 'christmas') this.musicBox(TWELVE_DAYS[this.next % TWELVE_DAYS.length][0] + 12, this.now);
    else if (this.set === 'new-year') this.piano(AULD[this.next % AULD.length][0], this.now, 0.17);
    else if (this.set === 'groundhog') this.harpsichord(SPRING[0][this.next % SPRING[0].length][0], this.now);
    else if (this.set === 'valentines') {
      // the tune's next note over its bass, the lowest strings an octave up
      const [note, bass] = DREAM_NOTES[this.next % DREAM_NOTES.length];
      this.harp(note, this.now, 0.2);
      this.harp(bass < 44 ? bass + 12 : bass, this.now, 0.09);
    } else if (this.set === 'showers') {
      // the tune's next note on the piano, over the A flat falling like rain
      this.piano(PRELUDE[this.next % PRELUDE.length][0], this.now, 0.17);
      this.piano(RAINDROP, this.now, 0.06);
    } else if (this.set === 'turtle') {
      // the tune's next note on the piano, over its bar's bass
      const [note, bass] = POND_NOTES[this.next % POND_NOTES.length];
      this.piano(note, this.now, 0.17);
      this.piano(bass, this.now, 0.08);
    } else this.organ(TOCCATA[this.next % TOCCATA.length], this.now, 0.38);
    this.next++;
  }

  undo() {
    if (this.on) this.rustle(this.now, 0.22, 2400, 700, 0.08);
  }

  // A shuffle: a rustle, or on Thanksgiving, autumn leaves raked over, at
  // Christmas, sleigh bells shaken, and at New Year's, a party horn.
  shuffle() {
    if (!this.on) return;
    if (this.set === 'thanksgiving') return this.leaves();
    if (this.set === 'christmas') return [0, 0.11, 0.2, 0.33].forEach((t, k) => this.jingle(this.now + t, 0.05 - k * 0.006));
    if (this.set === 'new-year') return this.horn(this.now);
    if (this.set === 'groundhog') {
      // the groundhog digging: his claws scraping, and a clod of earth landing
      for (let k = 0; k < 6; k++) this.rustle(this.now + k * 0.1 + Math.random() * 0.03, 0.08, 1500, 450, 0.1);
      return this.ping(95, this.now + 0.62, { gain: 0.1, attack: 0.002, fall: 0.09, into: this.master });
    }
    if (this.set === 'valentines') {
      // love letters shuffled: a riffle of envelopes, and the pile squared up
      for (let k = 0; k < 16; k++) this.rustle(this.now + k * 0.028 + Math.random() * 0.008, 0.035, 3200 + Math.random() * 1500, 2000, 0.24);
      return this.rustle(this.now + 0.52, 0.08, 900, 500, 0.26);
    }
    if (this.set === 'showers') {
      // a spring shower: rain pattering on the glass, and its hiss
      this.rustle(this.now, 0.9, 3500, 6000, 0.06);
      for (let k = 0; k < 18; k++) this.plip(this.now + Math.random() * 0.85, 1100 + Math.random() * 1500, 2300 + Math.random() * 1800, 0.05 + Math.random() * 0.04, 0.04);
      return;
    }
    if (this.set === 'turtle') {
      // the pond stirred: the water swirled round, and its ripples
      this.rustle(this.now, 0.6, 500, 1500, 0.1);
      for (let k = 0; k < 6; k++) this.plip(this.now + 0.1 + k * 0.09 + Math.random() * 0.03, 300 + k * 40, 700 + k * 60, 0.07, 0.08);
      return;
    }
    for (let k = 0; k < 3; k++) this.rustle(this.now + k * 0.09, 0.3, 600, 3200, 0.1);
  }

  // Autumn leaves, raked up and turned over: the rake's sweep, and dry
  // leaves crackling.
  leaves() {
    for (let k = 0; k < 2; k++) this.rustle(this.now + k * 0.16, 0.38, 700, 2400, 0.07);
    for (let k = 0; k < 18; k++) {
      const at = this.now + 0.03 + Math.random() * 0.55;
      this.rustle(at, 0.015 + Math.random() * 0.02, 2500 + Math.random() * 3500, 1500 + Math.random() * 1500, 0.05 + Math.random() * 0.05);
    }
  }

  // A hint: two high notes, or on Thanksgiving, a small handbell, at
  // Christmas, a little silver bell, and at New Year's, a champagne glass
  // touched.
  hint() {
    if (!this.on) return;
    if (this.set === 'thanksgiving') return this.bell(1568, this.now, 0.06, 1.4);
    if (this.set === 'christmas') return this.bell(2093, this.now, 0.045, 1.2);
    if (this.set === 'new-year') return this.bell(2794, this.now, 0.045, 0.9);
    if (this.set === 'groundhog') return [0, 0.3].forEach((t) => this.whistle(this.now + t, 3900, 2400, 0.22)); // a cardinal: cheer, cheer
    if (this.set === 'valentines') {
      // a kiss blown: the lips' smack, a breath after it, and a twinkle on
      // the harp's top string
      this.rustle(this.now, 0.025, 1900, 1100, 0.45);
      this.ping(1300, this.now + 0.004, { gain: 0.12, attack: 0.001, fall: 0.03, into: this.master });
      this.rustle(this.now + 0.05, 0.28, 1500, 600, 0.09);
      return this.harp(92, this.now + 0.14, 0.12, this.master);
    }
    if (this.set === 'showers') {
      // a raindrop on the window: it lands, and runs down the glass
      this.plip(this.now, 900, 2200, 0.13, 0.08);
      return this.plip(this.now + 0.17, 1500, 3000, 0.07, 0.06);
    }
    if (this.set === 'turtle') return this.croak(this.now); // a frog by the pond: ribbit
    this.ping(1318.5, this.now, { gain: 0.06, fall: 0.5 });
    this.ping(1975.5, this.now + 0.09, { gain: 0.05, fall: 0.6 });
  }

  // A treat: chimes running up, or on Thanksgiving, the dinner triangle,
  // and at Christmas, a present unwrapped: the paper torn, and ta-da.
  treat() {
    if (!this.on) return;
    if (this.set === 'thanksgiving') return this.triangle();
    if (this.set === 'christmas') {
      [0, 0.12].forEach((t) => this.rustle(this.now + t, 0.14, 2500, 6500, 0.08));
      return [72, 76, 79, 84].forEach((note, k) => this.musicBox(note + 12, this.now + 0.3 + k * 0.08, 0.13));
    }
    if (this.set === 'new-year') {
      // a champagne cork popping, and the fizz
      this.rustle(this.now, 0.03, 2600, 900, 0.22);
      this.ping(520, this.now, { gain: 0.12, attack: 0.002, fall: 0.07, into: this.master });
      return this.rustle(this.now + 0.08, 1.3, 6000, 9000, 0.03);
    }
    if (this.set === 'groundhog') {
      // a candle lit for Candlemas: the match struck, the flame catching,
      // and the harpsichord's chord
      this.rustle(this.now, 0.12, 2200, 5200, 0.09);
      this.rustle(this.now + 0.1, 0.6, 500, 800, 0.04);
      return [76, 80, 83].forEach((note, k) => this.harpsichord(note, this.now + 0.3 + k * 0.04, 0.09));
    }
    if (this.set === 'valentines') {
      // a box of chocolates opened: its lid lifted off, and the harp swept
      // up A flat's chord
      this.rustle(this.now, 0.22, 700, 1600, 0.07);
      return [68, 72, 75, 80, 84, 87, 92].forEach((note, k) => this.harp(note, this.now + 0.24 + k * 0.045, 0.1));
    }
    if (this.set === 'showers') {
      // a rainbow coming out: a shimmer up the glockenspiel, a note for each
      // of its colours, and D flat's chord on the piano under it
      [73, 75, 77, 80, 82, 85, 89].forEach((note, k) => this.bell(hz(note), this.now + k * 0.07, 0.04, 1.6));
      return [49, 56, 61, 65].forEach((note, k) => this.piano(note, this.now + 0.5 + k * 0.03, 0.05));
    }
    if (this.set === 'turtle') {
      // a koi leaping: it breaks the water and splashes back, and the piano
      // spreads D's chord
      this.rustle(this.now, 0.12, 1800, 3800, 0.1);
      this.rustle(this.now + 0.32, 0.3, 2600, 800, 0.12);
      return [62, 66, 69, 74, 78].forEach((note, k) => this.piano(note, this.now + 0.5 + k * 0.05, 0.06));
    }
    [1318.5, 1661.2, 1975.5, 2637].forEach((f, k) => this.ping(f, this.now + k * 0.07, { gain: 0.08, fall: 0.5 }));
  }

  // The dinner triangle, rung round and round inside: come and get it! A
  // struck bar's partials, far out of tune with each other, struck a dozen
  // times on its three sides.
  triangle() {
    for (let k = 0; k < 12; k++) {
      const at = this.now + k * 0.055;
      const f = [1580, 1610, 1595][k % 3];
      for (const [m, a] of [[1, 1], [2.756, 0.55], [5.404, 0.3], [8.933, 0.15]]) {
        this.ping(f * m, at, { gain: 0.022 * a * (1 - k / 18), attack: 0.001, fall: 1.5 / Math.sqrt(m) });
      }
    }
  }

  // Sundown on the second Sunday: the alarm clock rings for Monday.
  alarm() {
    if (!this.on) return;
    for (let k = 0; k < 14; k++) this.bell(k % 2 ? 1568 : 1760, this.now + k * 0.07, 0.05, 0.5);
  }

  // A touchdown: the crowd roars, and the band's brass sounds the charge.
  touchdown() {
    if (!this.on) return;
    this.rustle(this.now, 1.4, 1200, 3600, 0.1);
    [[67, 0, 0.12], [72, 0.15, 0.12], [76, 0.3, 0.12], [79, 0.45, 0.28], [76, 0.8, 0.12], [79, 0.95, 0.6]].forEach(([note, t, length]) => this.brass(note, this.now + 0.1 + t, length));
  }

  // A pair of lovebirds: a turtle dove's coo, twice.
  coo() {
    if (!this.on) return;
    [[440, 0], [370, 0.2], [440, 0.5], [370, 0.7]].forEach(([f, t]) => this.ping(f, this.now + t, { gain: 0.08, attack: 0.03, fall: 0.22 }));
  }

  // Birds of a feather flocking together: a flutter of wings, and a chirp.
  flutter() {
    if (!this.on) return;
    for (let k = 0; k < 3; k++) this.rustle(this.now + k * 0.06, 0.07, 2600, 1300, 0.06);
    this.ping(3520, this.now + 0.22, { gain: 0.04, fall: 0.06 });
    this.ping(4186, this.now + 0.28, { gain: 0.035, fall: 0.07 });
  }

  // A ring turning to gold: bright bells, rising, and a glint.
  ring() {
    if (!this.on) return;
    [1568, 1975.5, 2349.3].forEach((f, k) => this.bell(f, this.now + k * 0.08, 0.05, 1.8));
    this.ping(4186, this.now + 0.32, { gain: 0.03, fall: 0.25 });
  }

  // A line of goslings: their mother's honk, twice.
  honk() {
    if (!this.on) return;
    [[370, 0], [330, 0.24]].forEach(([f, t]) => {
      this.ping(f, this.now + t, { type: 'sawtooth', gain: 0.045, attack: 0.02, fall: 0.17 });
      this.ping(f * 1.5, this.now + t, { type: 'square', gain: 0.015, attack: 0.02, fall: 0.14 });
    });
  }

  // A swan and her reflection: a harp's run, gliding up.
  swan() {
    if (!this.on) return;
    [587.3, 740, 880, 1174.7, 1480].forEach((f, k) => this.ping(f, this.now + k * 0.06, { type: 'triangle', gain: 0.05, fall: 0.7 }));
  }

  // A swan swimming off: a ripple on the water.
  ripple() {
    if (!this.on) return;
    this.rustle(this.now, 0.4, 500, 1400, 0.05);
    this.ping(392, this.now + 0.05, { gain: 0.04, fall: 0.3 });
  }

  // A pail of fresh milk: a splash into the churn, and the maid's bell.
  milk() {
    if (!this.on) return;
    this.rustle(this.now, 0.25, 700, 2200, 0.06);
    this.bell(1318.5, this.now + 0.12, 0.05, 1.2);
  }

  // A pail gone sour: a falling sigh.
  sour() {
    if (!this.on) return;
    [[311.1, 0], [261.6, 0.22]].forEach(([f, t]) => this.ping(f, this.now + t, { type: 'triangle', gain: 0.07, attack: 0.03, fall: 0.35 }));
  }

  // The music changes: a bar of a waltz, oom-pah-pah, twice.
  waltz() {
    if (!this.on) return;
    [[196, 0.16], [392, 0.07], [493.9, 0.07], [220, 0.16], [440, 0.07], [523.3, 0.07]].forEach(([f, gain], k) =>
      this.ping(f, this.now + k * 0.17, { type: 'triangle', gain, fall: k % 3 ? 0.18 : 0.32 }),
    );
    this.bell(1568, this.now + 1.02, 0.05, 1.2);
  }

  // Twelfth Night: twelve drummers drumming, a roll and twelve beats.
  drums() {
    if (!this.on) return;
    for (let k = 0; k < 12; k++) {
      const at = this.now + k * 0.15;
      this.ping(k % 4 ? 90 : 70, at, { type: 'sine', gain: k % 4 ? 0.14 : 0.22, attack: 0.002, fall: 0.18, into: this.master });
      this.rustle(at, 0.07, 1800, 900, k % 4 ? 0.05 : 0.08);
    }
    this.bell(784, this.now + 12 * 0.15, 0.06, 1.6);
  }

  // A piper playing: the drone, and a skirl of the chanter over it.
  bagpipe() {
    if (!this.on) return;
    this.ping(110, this.now, { type: 'sawtooth', gain: 0.03, attack: 0.08, fall: 1.4 });
    this.ping(220, this.now, { type: 'sawtooth', gain: 0.02, attack: 0.08, fall: 1.4 });
    [880, 987.8, 1108.7, 1318.5, 1108.7, 1318.5].forEach((f, k) => this.ping(f, this.now + 0.1 + k * 0.11, { type: 'square', gain: 0.025, attack: 0.01, fall: 0.12 }));
  }

  // A rocket going up with a whistle, and bursting: a bang, and the crackle
  // of its sparks.
  firework() {
    if (!this.on) return;
    const at = this.now;
    const o = this.ctx.createOscillator();
    o.frequency.setValueAtTime(700, at);
    o.frequency.exponentialRampToValueAtTime(2600, at + 0.42);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(0.04, at + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.45);
    o.connect(g).connect(this.bus);
    o.start(at);
    o.stop(at + 0.5);
    const bang = at + 0.45;
    this.ping(70, bang, { gain: 0.3, attack: 0.002, fall: 0.35, into: this.master });
    this.rustle(bang, 0.3, 700, 200, 0.16);
    for (let k = 0; k < 9; k++) this.rustle(bang + 0.12 + k * 0.05 + Math.random() * 0.03, 0.05, 5200, 3200, 0.05);
  }

  // A pair dancing in the disco ball's beam: a beat to dance to, its kick
  // and its hi-hat, and a chord on top.
  disco() {
    if (!this.on) return;
    const t = this.now;
    for (let k = 0; k < 4; k++) {
      const at = t + k * 0.13;
      if (k % 2 === 0) this.ping(62, at, { gain: 0.26, attack: 0.002, fall: 0.16, into: this.master });
      this.rustle(at + 0.065, 0.04, 8000, 6000, 0.05);
    }
    [523.3, 659.3, 784, 987.8].forEach((f) => this.ping(f, t + 0.26, { type: 'square', gain: 0.016, attack: 0.005, fall: 0.3 }));
  }

  // A shooting star crossing: a swish across the sky, and a shimmer.
  star() {
    if (!this.on) return;
    this.rustle(this.now, 0.6, 7000, 1500, 0.06);
    [2637, 3136, 3520].forEach((f, k) => this.ping(f, this.now + 0.1 + k * 0.07, { gain: 0.025, fall: 0.6 }));
  }

  // A wish made: a rising run of bells.
  wish() {
    if (!this.on) return;
    [1047, 1319, 1568, 2093].forEach((f, k) => this.bell(f, this.now + k * 0.09, 0.035, 1.2));
  }

  // A resolution broken: the crunch of a sweet, and a falling sigh.
  gaveIn() {
    if (!this.on) return;
    for (let k = 0; k < 3; k++) this.rustle(this.now + k * 0.09, 0.07, 2600, 1400, 0.12);
    [392, 370, 349, 311].forEach((f, k) => this.ping(f, this.now + 0.35 + k * 0.22, { type: 'triangle', gain: 0.06, fall: 0.3 }));
  }

  // A toast: two glasses clinking, ringing high and clear, and the
  // champagne fizzing.
  clink() {
    if (!this.on) return;
    this.bell(2794, this.now, 0.045, 0.9);
    this.bell(3322, this.now + 0.015, 0.035, 0.8);
    this.rustle(this.now + 0.08, 1.1, 5000, 9000, 0.025);
  }

  // A perfect match: a party popper, its paper fluttering, and a chime.
  confetti() {
    if (!this.on) return;
    this.rustle(this.now, 0.05, 2500, 1500, 0.2);
    this.rustle(this.now + 0.05, 0.5, 5000, 2500, 0.05);
    [1319, 1976].forEach((f, k) => this.ping(f, this.now + 0.08 + k * 0.08, { gain: 0.04, fall: 0.35 }));
  }

  // A sparkler lit: a match struck, and the fizz catching.
  light() {
    if (!this.on) return;
    this.rustle(this.now, 0.12, 2000, 5000, 0.08);
    this.rustle(this.now + 0.1, 0.5, 6000, 7000, 0.04);
  }

  // A burning sparkler taken: its crackle, bright and quick.
  sparkler() {
    if (!this.on) return;
    for (let k = 0; k < 7; k++) this.rustle(this.now + k * 0.045 + Math.random() * 0.02, 0.035, 7000, 4500, 0.07);
    this.ping(2093, this.now + 0.05, { gain: 0.03, fall: 0.3 });
  }

  // A sparkler burnt out: a last fizz, falling away.
  fizzle() {
    if (!this.on) return;
    this.rustle(this.now, 0.4, 3000, 400, 0.05);
  }

  // How close a pair came to the lucky coin: hot, two notes rising; warm,
  // one; cold, a low one, quietly.
  heat(level) {
    if (!this.on) return;
    const notes = { hot: [784, 1047], warm: [659], cold: [262] }[level] || [];
    notes.forEach((f, k) => this.ping(f, this.now + k * 0.09, { gain: 0.05, fall: 0.3 }));
  }

  // The lucky coin found: it spins down and settles, ringing, with a
  // sparkle over it.
  coin() {
    if (!this.on) return;
    [1319, 1760, 1319, 1760, 2093].forEach((f, k) => this.ping(f, this.now + k * 0.07, { type: 'triangle', gain: 0.05, fall: 0.25 }));
    this.bell(2637, this.now + 0.4, 0.04, 1.2);
  }

  // A balloon popping: a sharp snap of noise and a little thump.
  pop() {
    if (!this.on) return;
    this.rustle(this.now, 0.06, 3000, 1200, 0.22);
    this.ping(180, this.now, { gain: 0.12, attack: 0.002, fall: 0.08, into: this.master });
  }

  // The net opening: a swish as it lets go, and the balloons bouncing down,
  // soft and low, one after another.
  balloons() {
    if (!this.on) return;
    this.rustle(this.now, 0.4, 600, 2400, 0.08);
    [0.3, 0.42, 0.5, 0.62].forEach((t, k) => this.ping(220 - k * 18, this.now + t, { gain: 0.08, attack: 0.01, fall: 0.18 }));
  }

  // A lit pair taken: a twinkle of bright notes.
  sparkle() {
    if (!this.on) return;
    [1568, 2093, 2637, 3136, 4186].forEach((f, k) => this.ping(f, this.now + k * 0.05, { gain: 0.04, fall: 0.35 }));
  }

  // A lord leaping out: a trumpet call, rising.
  fanfare() {
    if (!this.on) return;
    [[67, 0, 0.12], [67, 0.14, 0.08], [72, 0.24, 0.12], [76, 0.38, 0.12], [79, 0.52, 0.4]].forEach(([note, at, length]) => this.organ(note, this.now + at, length, 0.09));
  }

  // An egg hatching: a chick's cheep, twice.
  cheep() {
    if (!this.on) return;
    [[2794, 0], [3136, 0.06], [2794, 0.2], [3322, 0.26]].forEach(([f, t]) => this.ping(f, this.now + t, { gain: 0.045, fall: 0.07 }));
  }

  // Another shopper grabbing a doorbuster: a quick snatch.
  grab() {
    if (!this.on) return;
    this.rustle(this.now, 0.22, 3200, 500, 0.1);
  }

  // A tile put in the fridge: the door shutting.
  save() {
    if (!this.on) return;
    this.ping(110, this.now, { type: 'sine', gain: 0.2, fall: 0.18, into: this.master });
    this.rustle(this.now, 0.12, 900, 300, 0.05);
  }

  // Everyone dozes off after the feast, and wakes again: the banjo, slowly
  // down, and quickly up.
  nap() {
    if (!this.on) return;
    [67, 64, 60].forEach((note, k) => this.banjo(note, this.now + k * 0.4, 0.2));
  }

  wake() {
    if (!this.on) return;
    [72, 76, 79, 84].forEach((note, k) => this.banjo(note, this.now + k * 0.09, 0.2));
  }

  // A thing crossed off the shopping list: the till's bell.
  listed() {
    if (!this.on) return;
    this.bell(1975.5, this.now, 0.07, 1.4);
    this.ping(2637, this.now + 0.06, { gain: 0.04, fall: 0.3 });
  }

  // Ice thawing: a few drips, falling.
  thaw() {
    if (!this.on) return;
    [2093, 1568, 1760].forEach((f, k) => this.ping(f, this.now + 0.12 + k * 0.11, { gain: 0.06, fall: 0.18 }));
  }

  // The clock strikes twelve.
  midnight() {
    if (!this.on) return;
    for (let k = 0; k < 12; k++) this.bell(196, this.now + k * 0.42, 0.13, 2.4);
  }

  // Midnight on New Year's: the clock strikes twelve, and the new year comes
  // in with a firework's bang and crackle, and a fanfare on the band's brass.
  newYear() {
    if (!this.on) return;
    for (let k = 0; k < 12; k++) this.bell(262, this.now + k * 0.3, 0.1, 1.6);
    const at = this.now + 12 * 0.3;
    this.ping(70, at, { gain: 0.3, attack: 0.002, fall: 0.35, into: this.master });
    this.rustle(at, 0.3, 700, 200, 0.16);
    for (let k = 0; k < 9; k++) this.rustle(at + 0.12 + k * 0.05 + Math.random() * 0.03, 0.05, 5200, 3200, 0.05);
    [[67, 0.2, 0.12], [72, 0.34, 0.12], [76, 0.48, 0.12], [79, 0.62, 0.5]].forEach(([note, t, length]) => this.brass(note, at + t, length));
  }

  sunrise() {
    if (!this.on) return;
    [587.3, 740, 880, 1174.7].forEach((f, k) => this.bell(f, this.now + k * 0.16, 0.08, 2));
  }

  // No pairs left: a low chord on the organ, or on Thanksgiving, the
  // turkey has the last laugh, and at Christmas, a lump of coal drops into
  // the stocking: a dull thud, and its dust.
  stuck() {
    if (!this.on) return;
    if (this.set === 'thanksgiving') return this.gobble();
    if (this.set === 'christmas') {
      this.ping(65, this.now, { gain: 0.3, attack: 0.003, fall: 0.22, into: this.master });
      this.ping(110, this.now, { gain: 0.12, attack: 0.003, fall: 0.12, into: this.master });
      return this.rustle(this.now + 0.02, 0.28, 900, 250, 0.08);
    }
    if (this.set === 'new-year') return this.horn(this.now, 480, 170, 0.9, 0.14); // a party horn running out of breath
    if (this.set === 'groundhog') {
      // the groundhog sees his shadow: his whistle of alarm, and he
      // scurries back down his burrow
      this.whistle(this.now, 2500, 2750, 0.35, 0.06);
      for (let k = 0; k < 7; k++) this.rustle(this.now + 0.4 + k * 0.06, 0.05, 1600 - k * 120, 500, 0.08 * (1 - k / 9));
      return this.ping(80, this.now + 0.85, { gain: 0.12, attack: 0.002, fall: 0.1, into: this.master });
    }
    if (this.set === 'valentines') return this.breakHeart();
    if (this.set === 'showers') {
      // thunder far off: a low rumble rolling in and dying away
      this.rustle(this.now, 2.2, 170, 60, 0.4);
      this.rustle(this.now + 0.3, 1.6, 130, 50, 0.32);
      return this.ping(52, this.now + 0.1, { gain: 0.14, attack: 0.3, fall: 1.6, into: this.master });
    }
    if (this.set === 'turtle') {
      // the turtle tucks into his shell: a hollow knock, and another
      [0, 0.18].forEach((t, k) => {
        this.ping(k ? 120 : 150, this.now + t, { gain: 0.2, attack: 0.002, fall: 0.12, into: this.master });
        this.ping(k ? 410 : 520, this.now + t, { gain: 0.05, attack: 0.001, fall: 0.05, into: this.master });
      });
      return;
    }
    this.organ(38, this.now, 1.2, 0.1);
    this.organ(45, this.now, 1.2, 0.08);
  }

  // A heart breaking: a brittle crack, and two notes falling on the harp, a
  // sigh. Valentine's with no pairs left, and a smitten tile gone off with
  // another.
  breakHeart() {
    this.rustle(this.now, 0.04, 5000, 2500, 0.2);
    for (const f of [2300, 3700, 5100]) this.ping(f, this.now, { gain: 0.04, attack: 0.001, fall: 0.06, into: this.master });
    this.harp(64, this.now + 0.3, 0.2);
    this.harp(63, this.now + 0.8, 0.2);
  }

  heartbreak() {
    if (this.on) this.breakHeart();
  }

  // On Valentine's pierced heart, Cupid lets fly: his bowstring twangs, the
  // arrow swishes through the air and strikes home, and the couple it
  // strikes ring out on the harp.
  arrow() {
    if (!this.on) return;
    this.string(55, this.now, 0.22, { bright: 0.9, keep: 0.978, pick: 0.12, seconds: 0.8 }, this.master);
    this.rustle(this.now + 0.04, 0.32, 3200, 700, 0.14);
    this.ping(180, this.now + 0.38, { gain: 0.16, attack: 0.002, fall: 0.07, into: this.master });
    [80, 84].forEach((note, k) => this.harp(note, this.now + 0.48 + k * 0.1, 0.1));
  }

  // Love at first sight: the harp runs up the chord of A flat, and two of
  // its notes ring out together, a couple.
  love() {
    if (!this.on) return;
    [63, 68, 72, 75].forEach((note, k) => this.harp(note, this.now + k * 0.07, 0.12));
    [80, 84].forEach((note) => this.harp(note, this.now + 0.32, 0.12));
  }

  // On Valentine's envelope, half a sweet nothing read: a note asked on the
  // harp's high strings, waiting for its answer.
  halfSaid() {
    if (this.on) this.harp(87, this.now + 0.14, 0.09);
  }

  // A sweet nothing said: the secret admirer's note unfolded, its two words
  // sung on the harp, rising, be mine, and a candy heart's sparkle above.
  sweetNothing() {
    if (!this.on) return;
    this.rustle(this.now, 0.14, 2600, 1300, 0.12);
    this.harp(75, this.now + 0.12, 0.16);
    this.harp(80, this.now + 0.42, 0.16);
    [84, 87, 92].forEach((note, k) => this.harp(note, this.now + 0.72 + k * 0.05, 0.08));
  }

  // On Valentine's Be mine, the question popped: the ring box's lid snapping
  // open, the harp swept up two octaves, and a hush before its chord.
  question() {
    if (!this.on) return;
    this.ping(1800, this.now, { gain: 0.09, attack: 0.001, fall: 0.04, into: this.master });
    this.rustle(this.now, 0.06, 2600, 1400, 0.14);
    GLISSANDO.forEach((note, k) => this.harp(note, this.now + 0.15 + k * 0.045, 0.07));
    [56, 63, 68, 72].forEach((note) => this.harp(note, this.now + 0.15 + GLISSANDO.length * 0.045 + 0.35, 0.09));
  }

  // On Valentine's hugs and kisses, an XOXO: a kiss, a hug, a kiss and a
  // hug, the lips' smacks and the harp's warm chords in turn, and a twinkle
  // on its top strings.
  xoxo() {
    if (!this.on) return;
    [0, 0.3, 0.6, 0.9].forEach((t, k) => {
      if (k % 2 === 0) {
        this.rustle(this.now + t, 0.05, 3000, 1800, 0.22);
        this.ping(1300, this.now + t, { gain: 0.08, attack: 0.002, fall: 0.05, into: this.master });
      } else [56, 63, 68].forEach((note) => this.harp(note, this.now + t, 0.08));
    });
    [80, 84, 87].forEach((note, k) => this.harp(note, this.now + 1.15 + k * 0.06, 0.08));
  }

  // On Valentine's box of chocolates, a bite of chocolate: its shell
  // snapping, crisp, and a crumb or two falling.
  bite() {
    if (!this.on) return;
    this.rustle(this.now, 0.05, 3400, 1600, 0.3);
    this.rustle(this.now + 0.05, 0.04, 2400, 1200, 0.18);
    this.ping(160, this.now, { gain: 0.1, attack: 0.002, fall: 0.06, into: this.master });
  }

  // A chocolate savoured, cup and all: its paper cup crumpled, and the harp
  // humming up a chord, contented.
  savoured() {
    if (!this.on) return;
    this.rustle(this.now, 0.22, 2800, 1400, 0.14);
    [63, 68, 72, 75].forEach((note, k) => this.harp(note, this.now + 0.2 + k * 0.11, 0.11));
  }

  // A chocolate left half-eaten: a little shrug on the harp, two notes down.
  justEaten() {
    if (!this.on) return;
    this.harp(70, this.now + 0.05, 0.12);
    this.harp(68, this.now + 0.35, 0.12);
  }

  // On Valentine's first date, a candlelit pair: two glasses raised to each
  // other across the table, and a soft chord on the harp.
  candlelit() {
    if (!this.on) return;
    for (const [f, at] of [[1900, 0], [2850, 0.09]]) this.ping(f, this.now + at, { gain: 0.07, attack: 0.002, fall: 0.6, into: this.master });
    [68, 72, 75].forEach((note) => this.harp(note, this.now + 0.25, 0.1));
  }

  // The candles burning down: a breath of air through the flames, and the
  // harp's light lowering.
  flicker() {
    if (!this.on) return;
    this.rustle(this.now, 0.35, 500, 900, 0.1);
    this.rustle(this.now + 0.22, 0.3, 800, 450, 0.08);
    this.harp(60, this.now + 0.1, 0.09);
  }

  // The candles guttering out: a last flicker, a puff, and a low note.
  gutter() {
    if (!this.on) return;
    this.rustle(this.now, 0.25, 900, 500, 0.1);
    this.rustle(this.now + 0.3, 0.6, 1400, 300, 0.14);
    this.harp(56, this.now + 0.5, 0.12);
  }

  // On Valentine's vase of roses, a rose opening: its petals unfurling, and
  // the harp rising softly.
  bloom() {
    if (!this.on) return;
    this.rustle(this.now, 0.3, 900, 2200, 0.06);
    [72, 75, 80].forEach((note, k) => this.harp(note, this.now + 0.05 + k * 0.09, 0.1));
  }

  // A rose for the bouquet: tissue paper rustling round it, and the chord of
  // A flat spread up the harp.
  gathered() {
    if (!this.on) return;
    this.rustle(this.now, 0.18, 3000, 1500, 0.14);
    this.rustle(this.now + 0.16, 0.14, 2600, 1200, 0.1);
    [56, 63, 68, 72].forEach((note, k) => this.harp(note, this.now + 0.2 + k * 0.04, 0.11));
  }

  // A bud snipped before it opened: the secateurs' click, and a low note.
  snip() {
    if (!this.on) return;
    for (const [f, gain] of [[2600, 0.1], [4100, 0.06]]) this.ping(f, this.now, { gain, attack: 0.001, fall: 0.05, into: this.master });
    this.harp(51, this.now + 0.12, 0.16);
  }

  // A rose wilting: three notes drooping on the harp.
  wilt() {
    if (!this.on) return;
    this.harp(75, this.now, 0.1);
    this.harp(72, this.now + 0.4, 0.1);
    this.harp(70, this.now + 0.8, 0.09);
  }

  // A sweet nothing left unsaid: a little sigh on the harp, two notes
  // falling, softer than a heart breaking.
  unsaid() {
    if (!this.on) return;
    this.harp(80, this.now + 0.1, 0.12);
    this.harp(78, this.now + 0.48, 0.12);
  }

  // A drop of water: the little bubble it makes, ringing up in pitch as it
  // closes, quickly gone.
  plip(at, from = 700, to = 1700, gain = 0.12, length = 0.09, into = this.bus) {
    const o = this.ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(from, at);
    o.frequency.exponentialRampToValueAtTime(to, at + length);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(gain, at + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, at + length + 0.03);
    o.connect(g).connect(into);
    o.start(at);
    o.stop(at + length + 0.06);
  }

  // On April Showers' umbrella, a raindrop landing on its peak: a pat on
  // the canopy, and a little plip.
  raindrop() {
    if (!this.on) return;
    this.rustle(this.now, 0.06, 1400, 600, 0.1);
    this.plip(this.now + 0.02, 600, 1300, 0.07);
  }

  // A raindrop caught: a bright plip, and the light catching it.
  catchDrop() {
    if (!this.on) return;
    this.plip(this.now, 900, 2200, 0.14);
    [2637, 3520].forEach((f, k) => this.ping(f, this.now + 0.07 + k * 0.07, { gain: 0.035, fall: 0.5 }));
  }

  // A raindrop dripping off the rim: a lower plop, and a splash below.
  drip() {
    if (!this.on) return;
    this.plip(this.now, 380, 900, 0.1, 0.12);
    this.rustle(this.now + 0.12, 0.1, 3000, 1500, 0.05);
  }

  // On April Showers' flower bed, the bee flying on: a short buzz, rising
  // and falling as she goes.
  buzz() {
    if (!this.on) return;
    const o = this.ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(210, this.now);
    o.frequency.linearRampToValueAtTime(260, this.now + 0.12);
    o.frequency.linearRampToValueAtTime(190, this.now + 0.3);
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 900;
    f.Q.value = 2;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, this.now);
    g.gain.linearRampToValueAtTime(0.11, this.now + 0.04);
    g.gain.linearRampToValueAtTime(0.0001, this.now + 0.34);
    o.connect(f).connect(g).connect(this.master);
    o.start(this.now);
    o.stop(this.now + 0.36);
  }

  // May morning, on April Showers' May Day, as April turns to May: a
  // cuckoo calling twice at dawn, as it does in May, and the bells rung for
  // May morning, up into the spring.
  mayDay() {
    if (!this.on) return;
    [0, 0.75].forEach((t) => {
      this.whistle(this.now + t, 760, 730, 0.2, 0.07);
      this.whistle(this.now + t + 0.28, 610, 585, 0.34, 0.07);
    });
    [1046.5, 1318.5, 1568, 2093, 1568, 2093].forEach((f, k) => this.bell(f, this.now + 1.6 + k * 0.16, 0.06, 2));
  }

  // On the Start of Spring's thaw, a snowball landing: a soft, powdery
  // thump, and the snow settling.
  snowball() {
    if (!this.on) return;
    this.ping(110, this.now, { gain: 0.22, attack: 0.004, fall: 0.12, into: this.master });
    this.rustle(this.now, 0.3, 2600, 900, 0.12);
  }

  // The snow knocked off a tile: a crunch, the snow sliding off, and a
  // bright note of the sun.
  knockOff() {
    if (!this.on) return;
    for (let k = 0; k < 5; k++) this.rustle(this.now + k * 0.035, 0.05, 3200 - k * 200, 1800, 0.12);
    this.rustle(this.now + 0.18, 0.35, 1800, 4200, 0.06);
    this.bell(1568, this.now + 0.3, 0.05, 1.2);
  }

  // On the Start of Spring's first robin, a phrase of her carol: a clear
  // whistle slurred up and back down, as a robin's goes, pitched by which
  // note of her song it is, her first the lowest.
  robinCall(n, at = this.now, gain = 0.07) {
    const f = [2350, 2750, 3150][n] ?? 2750;
    this.whistle(at, f * 0.82, f * 1.12, 0.1, gain);
    this.whistle(at + 0.11, f * 1.1, f * 0.88, 0.13, gain);
  }

  // A note of her song sung back: her phrase for it.
  songNote(n) {
    if (!this.on) return;
    this.robinCall(n);
  }

  // She sings a new song: her three phrases, one after another, after a
  // breath.
  robinSings() {
    if (!this.on) return;
    [0, 1, 2].forEach((n) => this.robinCall(n, this.now + 0.4 + n * 0.32, 0.06));
  }

  // Her song sung back: her carol, cheerily, cheer-up, cheerio, quick and
  // bright, and a chime.
  songSungBack() {
    if (!this.on) return;
    [2, 0, 1, 2, 0, 2].forEach((n, k) => this.robinCall(n, this.now + k * 0.17, 0.06));
    [1568, 2093, 2637].forEach((f, k) => this.bell(f, this.now + 1.1 + k * 0.08, 0.035, 1.4));
  }

  // A song broken, one of her kinds taken out of turn: her tut-tut, two
  // short, low calls of alarm.
  tutTut() {
    if (!this.on) return;
    [0, 0.16].forEach((t) => this.whistle(this.now + t, 1900, 1300, 0.06, 0.08));
  }

  // On the Start of Spring's kite, the March wind turning: a gust rising and
  // falling away, and the kite's tail flapping in it.
  gust() {
    if (!this.on) return;
    this.rustle(this.now, 1, 300, 1400, 0.14);
    this.rustle(this.now + 0.35, 0.7, 1400, 500, 0.09);
    for (let k = 0; k < 4; k++) this.rustle(this.now + 0.5 + k * 0.09, 0.06, 2600, 1800, 0.06);
  }

  // A pair catching the wind: the kite's sail snapping taut, and a bright
  // note rising as it climbs.
  catchWind() {
    if (!this.on) return;
    this.rustle(this.now, 0.08, 3000, 1200, 0.12);
    this.whistle(this.now + 0.05, 880, 1320, 0.25, 0.05);
  }

  // Honey made: the bee's buzz, and a sweet run down the glockenspiel and
  // up again.
  honey() {
    if (!this.on) return;
    this.buzz();
    [2093, 1760, 1568, 2093].forEach((f, k) => this.bell(f, this.now + 0.15 + k * 0.08, 0.035, 1.2));
  }

  // On April Showers' watering can, a measure poured in: water glugging
  // into the can, a little higher the fuller it is.
  fill(level = 1) {
    if (!this.on) return;
    this.rustle(this.now, 0.35, 700, 1300, 0.08);
    [0, 0.12, 0.22].forEach((t, k) => this.plip(this.now + t, 260 + level * 40 + k * 30, 520 + level * 70 + k * 40, 0.08, 0.1));
  }

  // The can poured: its rose sprinkling, drops pattering on the leaves, and
  // a chime.
  sprinkle() {
    if (!this.on) return;
    this.rustle(this.now, 0.6, 4000, 2500, 0.06);
    for (let k = 0; k < 7; k++) this.plip(this.now + 0.05 + k * 0.06 + Math.random() * 0.03, 1000 + Math.random() * 600, 1800 + Math.random() * 800, 0.035, 0.06);
    [1568, 2093].forEach((f, k) => this.bell(f, this.now + 0.25 + k * 0.1, 0.03, 1.2));
  }

  // The can tipped with nothing in it: a hollow clank of tin.
  clank() {
    if (!this.on) return;
    [310, 455, 690].forEach((f, k) => this.ping(f, this.now + k * 0.01, { type: 'triangle', gain: 0.05, attack: 0.002, fall: 0.25, into: this.master }));
  }

  // On April Showers' seed tray, a seedling watered: a little trickle of
  // water from a can, and the soil taking it in.
  water() {
    if (!this.on) return;
    this.rustle(this.now, 0.3, 2500, 1800, 0.06);
    [0, 0.07, 0.15].forEach((t, k) => this.plip(this.now + t, 900 + k * 150, 1700 + k * 200, 0.04));
  }

  // A seedling bloomed: a rising run on the glockenspiel, as it opens.
  blossom() {
    if (!this.on) return;
    [1319, 1568, 1760, 2093].forEach((f, k) => this.bell(f, this.now + k * 0.08, 0.035, 1.2));
  }

  // A bloom picked: a soft snip, and a chord on the glockenspiel.
  picked() {
    if (!this.on) return;
    this.ping(3200, this.now, { gain: 0.05, attack: 0.001, fall: 0.04, into: this.master });
    [1047, 1319, 1568].forEach((f) => this.bell(f, this.now + 0.1, 0.035, 1.6));
  }

  // A seedling pulled up before it bloomed: the soil giving, and a low note.
  pulled() {
    if (!this.on) return;
    this.rustle(this.now, 0.2, 700, 300, 0.1);
    this.ping(220, this.now + 0.12, { type: 'triangle', gain: 0.06, fall: 0.35 });
  }

  // On April Showers' rainbow, a colour caught: a glockenspiel's note for
  // its band, from red's, the lowest, up the pentatonic scale to violet's,
  // so that colours caught in turn ring up the scale, with a shimmer.
  colour(band = 0) {
    if (!this.on) return;
    const f = [1047, 1175, 1319, 1568, 1760, 2093][band] || 1047;
    this.bell(f, this.now, 0.05, 1.4);
    this.bell(f * 2, this.now + 0.01, 0.015, 0.8);
    this.rustle(this.now + 0.05, 0.4, 6000, 9000, 0.02);
  }

  // On April Showers' rain boots, a splash in the puddle, the `height`-th in
  // a run: a boot stamping into the water, the spray flying up, and the
  // drops pattering back down, each splash a little higher in pitch than
  // the one before, and from the fourth with a glint of light in the spray.
  splash(height = 1) {
    if (!this.on) return;
    const up = Math.min(height - 1, 9);
    this.ping(90, this.now, { gain: 0.12, attack: 0.003, fall: 0.12, into: this.master });
    this.rustle(this.now, 0.35, 900 + up * 120, 3200 + up * 400, 0.13);
    [0.12, 0.2, 0.27].forEach((t, k) => this.plip(this.now + t, 600 + up * 70 + k * 120, 1400 + up * 160 + k * 200, 0.06));
    if (height >= 4) this.ping(2093 * 2 ** (Math.min(height - 4, 6) / 12), this.now + 0.18, { gain: 0.03, fall: 0.5 });
  }

  // A turkey's gobble: a quick string of throaty warbles, each falling, and
  // falling as they go.
  gobble() {
    const throat = this.ctx.createBiquadFilter();
    throat.type = 'bandpass';
    throat.frequency.value = 1150;
    throat.Q.value = 1.1;
    throat.connect(this.master);
    for (let k = 0; k < 8; k++) {
      const at = this.now + k * 0.068;
      const top = 720 - k * 28;
      const o = this.ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(top, at);
      o.frequency.exponentialRampToValueAtTime(top * 0.72, at + 0.06);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0, at);
      g.gain.linearRampToValueAtTime(0.09 * (1 - k * 0.06), at + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.062);
      o.connect(g).connect(throat);
      o.start(at);
      o.stop(at + 0.07);
    }
  }

  // A cleared board, its music played as a song of its own, to fade when
  // the next board comes: Halloween's, the Toccata's whole opening and a
  // chord to end on; Thanksgiving's, the last line of its song, and on the
  // last day of the week (`last`), We Gather Together; Christmas's, the
  // verse of its day (`day`, from 0 for the first), and on Twelfth Night,
  // the twelfth verse whole, and the church bells. The turtle, with no day,
  // plays the fifth verse, whose notes its matches have played. New Year's,
  // the last line of Auld Lang Syne, and with the countdown seen through,
  // its whole chorus, the party horns and the cheers. Groundhog Day's, as
  // the groundhog forecasts: an early spring (`spring`), Spring's opening,
  // and six more weeks of winter, Winter's. Valentine's, the last line of
  // Liszt's dream of love, and with the question popped on the last board
  // and answered, its whole second time and the harp swept up. April
  // Showers', the Raindrop's theme the second time, and with the season
  // seen through on May Day, its first eight bars. The turtle's, the
  // Gymnopédie's first phrase.
  win({ day = -1, last = false, spring = false } = {}) {
    if (!this.on) return;
    const into = this.newSong();
    if (this.set === 'thanksgiving' && last) this.gather(into);
    else if (this.set === 'thanksgiving') this.river(into);
    else if (this.set === 'christmas') this.carol(day >= 0 ? day + 1 : 5, last, into);
    else if (this.set === 'new-year') this.auld(last ? CHORUS : LAST_TOAST, last, into);
    else if (this.set === 'groundhog') this.season(spring, into);
    else if (this.set === 'valentines') this.dream(last ? SECOND_TIME : DREAM_LINE, last, into);
    else if (this.set === 'showers') this.prelude(last ? 0 : SECOND_PHRASE, into);
    else if (this.set === 'turtle') this.gymnopedie(into);
    else {
      const beat = 0.32;
      let at = this.now + 0.1;
      for (const [note, beats] of OPENING) {
        if (note) this.organ(note, at, beats * beat * 0.92, 0.14, into);
        at += beats * beat;
      }
      for (const note of [38, 50, 53, 57, 62]) this.organ(note, at, 2.2, 0.09, into);
    }
    this.next = 0;
  }

  // The last line of Thanksgiving's song on the banjo, over a guitar's
  // oom-pah, the bass on each bar's first beat and a chord on its second,
  // ending on a chord strummed.
  river(into) {
    const eighth = 0.2;
    const start = this.now + 0.1;
    let at = start;
    for (const [note, eighths] of RIVER.slice(LAST_LINE)) {
      this.banjo(note, at, 0.24, into);
      at += eighths * eighth;
    }
    RIVER_CHORDS.forEach((name, beat) => {
      const [root, tones] = CHORDS[name];
      const t = start + beat * 3 * eighth;
      if (beat % 2 === 0) this.guitar(root, t, 0.14, into);
      else tones.forEach((note, k) => this.guitar(note, t + k * 0.012, 0.05, into));
    });
    const end = start + RIVER_CHORDS.length * 3 * eighth;
    [48, 55, 60, 64, 67, 72].forEach((note, k) => this.guitar(note, end + k * 0.025, 0.07, into));
    this.banjo(72, end + 0.15, 0.16, into);
  }

  // A verse of The Twelve Days of Christmas on the music box, an octave up,
  // a low tine on each phrase's bass notes and sleigh bells shaken with
  // them; `whole`, every gift counting down, then the church bells ringing
  // Christmas out, down the scale and down again.
  carol(day, whole, into) {
    const beat = 0.375;
    let at = this.now + 0.1;
    for (const [notes, bass] of verse(day, !whole)) {
      for (const [note, b] of bass) {
        this.musicBox(note + 12, at + b * beat, 0.11, into);
        this.jingle(at + b * beat, 0.022, into);
      }
      for (const [note, beats] of notes) {
        this.musicBox(note + 12, at, 0.17, into);
        at += beats * beat;
      }
    }
    if (whole) [77, 76, 74, 72, 70, 69, 77, 76, 74, 72, 70, 65].forEach((note, k) => this.bell(hz(note), at + 0.2 + k * 0.3, 0.035, 2.4, into));
  }

  // Auld Lang Syne on the piano, from its note `from` to its end, the left
  // hand under it from the first whole bar: each bar's bass on its first
  // and third beats and its chord on its second and fourth, or with two
  // chords, one to each half, and the last chord held. With `cheer`, the
  // ballroom's party horns blowing and the room cheering after it.
  auld(from, cheer, into) {
    const beat = 0.62;
    const start = this.now + 0.1;
    const first = AULD.slice(0, from).reduce((n, [, b]) => n + b, 0); // the song's beat it begins on
    let t = 0;
    for (const [note, beats] of AULD.slice(from)) {
      this.piano(note, start + t * beat, 0.17, into);
      t += beats;
    }
    AULD_CHORDS.forEach((chords, bar) => {
      const at = 1 + (bar - 1) * 4 - first; // the bar's first beat, from the start
      if (!chords || at < 0) return;
      const halves = Array.isArray(chords) ? chords : [chords, chords];
      if (bar === AULD_CHORDS.length - 1) {
        const [root, , tones] = PIANO_CHORDS[halves[0]];
        return [root, ...tones].forEach((note, k) => this.piano(note, start + at * beat + k * 0.02, k ? 0.07 : 0.12, into));
      }
      halves.forEach((name, h) => {
        const [root, fifth, tones] = PIANO_CHORDS[name];
        const b = at + h * 2;
        this.piano(Array.isArray(chords) || !h ? root : fifth, start + b * beat, 0.12, into); // a bar's one chord: its root, then its fifth
        tones.forEach((note) => this.piano(note, start + (b + 1) * beat, 0.055, into));
      });
    });
    if (!cheer) return;
    const end = start + t * beat;
    [[430, 520], [470, 560], [400, 470]].forEach(([a, b], k) => this.horn(end + 0.3 + k * 0.18, a, b, 0.6, 0.12, into));
    this.rustle(end + 0.25, 1.8, 900, 2800, 0.09, into);
  }

  // The opening of Vivaldi's Spring, or of his Winter, on the harpsichord,
  // each voice's notes damped as their keys are let go, the tune a little
  // louder than the voices under it; Winter's ends on its chord of F minor.
  season(spring, into) {
    const beat = spring ? 0.536 : 0.517;
    const start = this.now + 0.1;
    let end = start;
    (spring ? SPRING : WINTER).forEach((voice, v) => {
      let at = start;
      for (const [note, beats] of voice) {
        if (note) this.harpsichord(note, at, v ? 0.1 : 0.14, into, beats * beat * 0.9);
        at += beats * beat;
      }
      end = Math.max(end, at);
    });
    if (!spring) WINTER_END.forEach((note, k) => this.harpsichord(note, end + k * 0.03, 0.1, into));
  }

  // Liebestraum on the harp, from the tune's note `from` to its end: the
  // tune over its harmony, each half bar's bass and then its chord rippling
  // up and back down, the tune the loudest; and at its end the chord of A
  // flat spread up the harp, or, the question answered, the harp swept up
  // two octaves first.
  dream(from, answered, into) {
    const beat = 0.55;
    const start = this.now + 0.1;
    const first = LIEBESTRAUM.slice(0, from).reduce((n, [, b]) => n + b, 0); // the tune's beat it begins on
    let t = 0;
    for (const [note, beats] of LIEBESTRAUM.slice(from)) {
      if (note) this.harp(note, start + t * beat, 0.17, into);
      t += beats;
    }
    DREAM_HARMONY.forEach(([bass, ripple], half) => {
      const at = 1 + half * 3 - first; // the half bar's first beat, from the start
      if (at < 0) return;
      this.harp(bass, start + at * beat, 0.11, into);
      ripple.forEach((note, k) => this.harp(note, start + (at + 0.5 + k * 0.5) * beat, 0.055, into));
    });
    let end = start + t * beat;
    if (answered) {
      GLISSANDO.forEach((note, k) => this.harp(note, end + k * 0.04, 0.08 - k * 0.002, into));
      end += 0.9;
    }
    [44, 51, 56, 60, 63, 68, 72].forEach((note, k) => this.harp(note, end + k * 0.06, k ? 0.08 : 0.11, into));
  }

  // The Raindrop on the piano, from the tune's note `from`, the start of its
  // first bar or its fifth, to its close on D flat: the tune over its left
  // hand, the A flat falling through it, the tune the loudest; and D flat's
  // chord spread up the piano to end on.
  prelude(from, into) {
    const beat = 0.7;
    const start = this.now + 0.1;
    const firstBar = Math.round(PRELUDE.slice(0, from).reduce((n, [, b]) => n + b, 0) / 4);
    let t = 0;
    for (const [note, beats] of PRELUDE.slice(from)) {
      this.piano(note, start + t * beat, 0.16, into);
      t += beats;
    }
    PRELUDE_LEFT.slice(firstBar).forEach((bar, k) => {
      for (const [eighth, notes] of bar) notes.forEach((note) => this.piano(note, start + (k * 4 + eighth / 2) * beat, note === RAINDROP || note === 44 ? 0.045 : 0.06, into));
    });
    const end = start + t * beat + 0.15;
    [37, 44, 49, 53, 56, 61, 65, 73].forEach((note, k) => this.piano(note, end + k * 0.05, k ? 0.06 : 0.09, into));
  }

  // The Gymnopédie on the piano, its first phrase, from the fifth bar, where
  // the tune comes in, to the ninth, where it comes to rest on its long F
  // sharp over the chord of G: each bar's bass, its chord on the second
  // beat, and the tune over them, the loudest.
  gymnopedie(into) {
    const beat = 0.85;
    const start = this.now + 0.1;
    const [from, to] = [4 * 3, 9 * 3]; // the fifth bar's first beat, and the ninth's last
    let t = 0;
    for (const [note, beats] of GYMNOPEDIE) {
      if (note && t >= from && t < to) this.piano(note, start + (t - from) * beat, 0.16, into);
      t += beats;
    }
    GYMNOPEDIE_LEFT.slice(4, 9).forEach(([bass, chord], k) => {
      const at = start + k * 3 * beat;
      this.piano(bass, at, 0.11, into);
      chord.forEach((note, j) => this.piano(note, at + beat + j * 0.012, 0.05, into));
    });
  }

  // A frog's croak, ribbit: two quick, rough notes, the second a little
  // higher. The turtle's hint, and at dusk on its pond, the frogs.
  croak(at, gain = 0.06) {
    [0, 0.13].forEach((t, k) => {
      for (let p = 0; p < 4; p++) this.ping(k ? 200 : 170, at + t + p * 0.022, { type: 'square', gain: gain * (1 - p / 6), attack: 0.003, fall: 0.025, into: this.master });
    });
  }

  // Dusk on the turtle's pond, as its tiles turn over: the frogs croaking,
  // one and then another, and a low bell across the water.
  dusk() {
    if (!this.on) return;
    [0, 0.5, 0.85].forEach((t, k) => this.croak(this.now + t, 0.06 - k * 0.012));
    this.bell(196, this.now + 1.3, 0.08, 2.4);
  }

  // We Gather Together on the reed organ, its four voices, for the week seen
  // through, the tune a little louder than the voices under it.
  gather(into) {
    const beat = 60 / 112;
    GATHER.forEach((voice, v) => {
      let at = this.now + 0.1;
      for (const [note, beats] of voice) {
        this.reed(note, at, beats * beat * 0.94, v ? 0.032 : 0.05, into);
        at += beats * beat;
      }
    });
  }
}
