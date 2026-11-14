import { TEN, NINE, EIGHT, SEVEN, SIX, FIVE, FOUR, THREE, TWO, ONE, JANUARY } from './engine/layouts.js';

// New Year's: the countdown, ten boards counted down from 10 to 1, each
// shaped as its own number, as the giant numbers on the screens in Times
// Square are, so that the countdown is the boards themselves. They are to be
// reached in turn, as Christmas's twelve days are; each board cleared drops
// the ball a notch down its pole, and clearing the last, the 1, is midnight:
// the ball lands, and it's a new year. The first board, the 10, is the
// gentle start, with no twist, as the first day's is, and the boards grow
// toward midnight. Each board is as Thanksgiving's days are (thanksgiving.js
// says what each part is for), with fireworks, on the 9, for how many tiles
// are rockets, each lighting up the tiles round it as it bursts, and disco,
// on the 8, for how many rows deep the band of the disco ball's light is,
// sweeping down the board a row with every match, coin, on the 7, for how
// near a pair must come to the lucky coin hidden under a tile to be hot or
// warm, balloons, on the 6, for how often a net of balloons opens and how
// many it drops, sparklers, on the 5, for how many sparklers there are and
// how many matches one burns once lit, confetti, on the 4, for every tile
// catching a fleck of confetti, a couple of each kind the same colour, and
// stars, on the 3, for every how many matches a shooting star crosses a
// row, and toast, on the 2, for the path along its stroke that two glasses
// glide along toward each other; and each is called by its number in the
// middle of a sentence, on to the 9. The last, the 1, is midnight: halfway
// through, the ball lands and every tile turns over to the new year's side,
// as Twelfth Night's do, told in its own words (main.js has them), its lost
// souls sleepyheads who missed midnight. After it comes New Year's Day,
// the last of New Year's boards: a calendar turned to January, with a
// resolution to keep, sweets, for how many sweets sit on top of the board
// and for how many matches, January, they are to be left alone. Its tiles
// wear New Year's own faces (ui/newyear-faces.js), whose lost soul is a
// sleepyhead.

export const COUNTDOWN = [
  {
    name: 'Ten',
    called: 'the 10',
    title: 'The countdown begins',
    layout: TEN,
    rules: { treats: false, ghostsFloat: false },
    sky: ['#28377a', '#0a0f2e'],
    text: 'The countdown to the new year begins: ten boards, from ten down to one, each its own number. A tile is free when nothing lies on it and its left or right side is open, as each tile of the ridge down the 1 is: take two free tiles that match.',
  },
  {
    name: 'Nine',
    called: 'the 9',
    title: 'Fireworks',
    layout: NINE,
    rules: { treats: false, ghostsFloat: false, fireworks: 9 },
    sky: ['#2b2870', '#0b0a28'],
    text: 'Nine rockets are among the tiles, each marked 🚀. Take a rocket with a tile of its kind and it bursts, lighting up every tile touching it ✨. Take two lit tiles together, a lit pair, for 30 points: a rocket is best set off where pairs are waiting.',
  },
  {
    name: 'Eight',
    called: 'the 8',
    title: 'The disco ball',
    layout: EIGHT,
    rules: { treats: false, ghostsFloat: false, disco: 1 },
    sky: ['#3a2466', '#100a22'],
    text: 'A disco ball hangs over the dance floor 🪩, and its beam sweeps down the board a row at a time, a row further down with every match, starting again at the top once it reaches the bottom. Take a pair with both its tiles in the light, a tile half in it counting, and they dance in the spotlight, for 30 points: set pairs up for where the beam is heading.',
  },
  {
    name: 'Seven',
    called: 'the 7',
    title: 'Lucky seven',
    layout: SEVEN,
    rules: { treats: false, ghostsFloat: false, coin: { hot: 1, warm: 3 } },
    sky: ['#2c3270', '#0c0e26'],
    text: "A lucky coin 🪙 is hidden in one of the 7's tiles, on its bottom layer. After every pair you take, it says how close that pair came: 🔥 hot, a tile away or less, 🌡️ warm, three or less, or 🧊 cold. The coin turns up as soon as its tile comes free, so dig where it's hot: found at once it's worth 200 points, and 5 less for every match before.",
  },
  {
    name: 'Six',
    called: 'the 6',
    title: 'The balloon drop',
    layout: SIX,
    rules: { treats: false, ghostsFloat: false, balloons: { every: 6, drop: 3 } },
    sky: ['#2e2a68', '#0d0b24'],
    text: 'A net of balloons hangs over the party 🎈. As the board starts, and again every six matches, it opens and three balloons drop onto free tiles, each with no other tile of its kind free. Pop a balloon by taking its tile before the next net opens, for 15 points: dig out a tile of its kind in time. Balloons still left when the net opens again float away.',
  },
  {
    name: 'Five',
    called: 'the 5',
    title: 'Sparklers',
    layout: FIVE,
    rules: { treats: false, ghostsFloat: false, sparklers: { count: 5, burns: 5 } },
    sky: ['#30285f', '#0e0b22'],
    text: "Five sparklers 🎇 are planted among the tiles, unlit while they're held down. Each lights as soon as its tile comes free, and burns down over five matches: take it while it still burns, for 10 points for every match it has left. So light a sparkler with a tile of its kind already free to take it with.",
  },
  {
    name: 'Four',
    called: 'the 4',
    title: 'Confetti',
    layout: FOUR,
    rules: { treats: false, ghostsFloat: false, confetti: true },
    sky: ['#33285c', '#0f0b21'],
    text: 'Confetti in four colours has fallen over the board, and every tile has caught a fleck: red ♥, gold ★, silver ● or blue ◆. Of a kind with four tiles here, two caught the same colour: take that couple together for a perfect match ✨, 5 points; the other two can make none. So with three or four of a kind free, choose which go together.',
  },
  {
    name: 'Three',
    called: 'the 3',
    title: 'Shooting stars',
    layout: THREE,
    rules: { treats: false, ghostsFloat: false, stars: 3 },
    sky: ['#1f2766', '#080a22'],
    text: 'As the board starts, and again every three matches, a shooting star 🌠 streaks across one row of the board, and the row glows until the next. Make a wish by taking a pair with both its tiles in that row, a tile half in it counting, before the next star comes, for 15 points: one wish to a star. Every star crosses a row where a wish can be made.',
  },
  {
    name: 'Two',
    called: 'the 2',
    title: 'A toast for two',
    layout: TWO,
    // The glasses' way: from the curl at the top left, over the arc, down
    // the right and the slant, and along the foot to its right-hand end.
    rules: {
      treats: false,
      ghostsFloat: false,
      toast: {
        path: [
          [1, 3], [1, 2], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [7, 2], [7, 3], [7, 4], [6, 4], [6, 5], [5, 5],
          [5, 6], [4, 6], [4, 7], [3, 7], [3, 8], [2, 8], [2, 9], [1, 9], [1, 10], [2, 10], [3, 10], [4, 10], [5, 10], [6, 10], [7, 10], [8, 10],
        ],
      },
    },
    sky: ['#2a1f5c', '#0b0820'],
    text: 'Two glasses of champagne 🥂 stand at the two ends of the 2, one in its curl and one at the end of its foot. With every match, each glides one tile along the 2 toward the other, unless a tile lies in its way: the tiles in their way glow gold. Clear them, and when the glasses meet they clink, a toast worth 5 points for every pair still on the board.',
  },
  {
    name: 'One',
    called: 'the 1',
    title: 'Midnight',
    layout: ONE,
    rules: { treats: false, ghostsFloat: false, turn: 1 / 2 },
    words: 'newyear',
    sky: ['#1b1446', '#050312'],
    text: "It's nearly midnight: the last board of the countdown. Halfway through, the ball lands, the clock strikes twelve and every tile turns over to the new year's side: hold the moon, or Space, to see it coming. Before midnight, take pairs that match on both sides. A tile left without a partner misses midnight, fast asleep, and sleepyheads match each other.",
  },
];

// New Year's Day, the morning after midnight: a resolution to keep.
export const NEW_YEARS_DAY = {
  name: "New Year's Day",
  title: 'Resolutions',
  layout: JANUARY,
  rules: { treats: false, ghostsFloat: false, sweets: { count: 6, days: 31 } },
  sky: ['#4a6fb0', '#1a2850'],
  text: "Happy New Year! It's the first of January, and time for a resolution: no sweets. Six sweets sit on top of the calendar, free from the start, each tinted pink with its treat on it 🍩 and holding a tile down. Leave them alone through January, the first 31 matches: every match you hold out scores 5 points, and the whole month 100 more. Take one before then and the resolution is broken. After January, they're fair game.",
};

// All of New Year's boards, in the order they are to be reached: the
// countdown, and then New Year's Day.
export const NEW_YEAR = [...COUNTDOWN, NEW_YEARS_DAY];

// The board of the countdown a layout is for, if it is one of the ten; and
// the board of New Year's, the countdown's or New Year's Day's: played
// freely, by its address (#play/ten), it plays by that board's rules.
export const countdownOf = (layout) => COUNTDOWN.find((d) => d.layout === layout);
export const newYearOf = (layout) => NEW_YEAR.find((d) => d.layout === layout);
