import { HIGHWAY, TURKEY, CART, POTLUCK, FEAST, SALE, FOOTBALL, ALARM } from './engine/layouts.js';
import { FACE } from './engine/tiles.js';
import { outsideIn } from './engine/ice.js';

// The dishes friends bring to the potluck, whose pairs leave gifts: until
// Thanksgiving has tiles of its own, the three faces that stand where the
// dragons do in a set.
const DISHES = [FACE.lantern, FACE.brew, FACE.ghost];

// Thanksgiving week: eight boards, one a day from the Sunday before
// Thanksgiving to the Sunday after it, the first Sunday's the traffic on the
// way and the second's the Sunday Scaries, the day before work and school
// again. Each day: its name and its theme,
// and once its board is made, the board; the rules for Game (thaw, on a
// board with ice, says how many matches each ring of it takes to thaw, and
// list, on a board with a shopping list, how many things are on it and how
// far through the board checkout comes); the sky behind it, top and bottom;
// what to tell the player before it starts; on a board with treats, which
// set of them it gives (main.js names them); and on a board with a nap, how
// far through it comes and for how many matches the clock stops; and on a
// board that turns over, the words it is told in (main.js has them). The
// first Sunday's board is the gentle start, with no twist, as the Long
// Night's 6 pm is; the second Sunday's turns over to Monday at sundown, as
// the Long Night's boards turn over at midnight.

export const DAYS = [
  {
    name: 'First Sunday',
    title: 'Traffic',
    layout: HIGHWAY,
    rules: { treats: false, ghostsFloat: false },
    sky: ['#4a5566', '#151a22'],
    text: "Everyone's on the road to Grandma's, and the highway's jammed. A tile can pull out only when nothing is on it and its lane is clear at one end: take two free tiles that match.",
  },
  {
    name: 'Monday',
    title: 'Thawing the turkey',
    layout: TURKEY,
    rules: { treats: false, ghostsFloat: false, thaw: 8 },
    sky: ['#4f6a80', '#16202b'],
    text: "The turkey is out of the freezer, and it thaws from the outside in. A frozen tile can't be taken until it thaws: the number on its ice is how many more matches that takes.",
  },
  {
    name: 'Tuesday',
    title: 'The grocery run',
    layout: CART,
    rules: { treats: false, ghostsFloat: false, list: { items: 4, by: 1 / 2 } },
    sky: ['#5d6b52', '#1a2016'],
    text: 'The list has four things on it. Take a pair of each before checkout, halfway through the board: each one crossed off is worth 25 points, and the whole list 100 more.',
  },
  {
    name: 'Wednesday',
    title: 'Friendsgiving',
    layout: POTLUCK,
    rules: { treats: true, ghostsFloat: false, treatFaces: DISHES },
    gifts: 'potluck',
    sky: ['#6b4a3a', '#1f1410'],
    text: "Friends have brought dishes to share, and a pair of jack-o'-lanterns, witch's brew or ghosts leaves a gift: a friend's tip shows you a match, a saved seat frees a blocked tile, and musical chairs shuffles the tiles for free.",
  },
  {
    name: 'Thursday',
    title: 'The Feast',
    layout: FEAST,
    rules: { treats: false, ghostsFloat: false, fridge: 3 },
    nap: { by: 1 / 2, matches: 10 },
    sky: ['#7a4a22', '#22130a'],
    text: "Beside the table is the fridge, with three containers for leftovers. Tap a free tile and then a container to save it for later: off the table, it holds nothing down, and it still matches its partner whenever that's free. Everything in the fridge has to be eaten by the end. Halfway through, everyone naps, and the clock stops for the next 10 matches.",
  },
  {
    name: 'Friday',
    title: 'Black Friday',
    layout: SALE,
    rules: { treats: false, ghostsFloat: false, doorbusters: { pairs: 4, every: 5 } },
    sky: ['#3a1d24', '#0d0709'],
    text: "The doors open early. Four pairs are doorbusters, with a red sale tag: take one, and it's yours, for 50 points. But you're not the only shopper: after every 5 of your matches, someone else grabs the first doorbuster that's free.",
  },
  {
    name: 'Saturday',
    title: 'Rivalry football',
    layout: FOOTBALL,
    rules: { treats: false, ghostsFloat: false, touchdown: 3 },
    sky: ['#2f5a3a', '#0e1a11'],
    text: "It's the big game. The field runs from the end zone at the top to the one at the bottom, and each end zone's tiles carry its team's pennant. A pair taken with a tile in each end zone is a touchdown, for 60 points.",
  },
  {
    name: 'Second Sunday',
    title: 'The Sunday Scaries',
    layout: ALARM,
    rules: { treats: false, ghostsFloat: false, turn: 1 / 2 },
    words: 'sundown',
    sky: ['#8a4a3a', '#22142a'],
    text: "The weekend's nearly over. Halfway through, the sun goes down and every tile turns over to its Monday side: hold the moon, or Space, to see Monday coming. Before sundown, take pairs that match on both sides. A tile left without a partner wakes as a worry, and worries match each other.",
  },
];

// The options for Game for a day: its rules, with its thaw as the ice, and
// its turn, the share of its matches before the tiles turn over, as a
// number of matches.
export function dayOptions(day) {
  const { thaw, turn, ...rules } = day.rules;
  const options = thaw ? { ...rules, ice: outsideIn(day.layout, thaw) } : rules;
  return turn ? { ...options, turnAt: Math.round((day.layout.count / 2) * turn) } : options;
}

// The day a board is for, if it is one of the week's: played freely, by its
// address (#play/turkey), a day's board plays by that day's rules.
export const dayOf = (layout) => DAYS.find((d) => d.layout === layout);
