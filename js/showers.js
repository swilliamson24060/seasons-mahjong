import { CLOUD, UMBRELLA, BOOTS, RAINBOW, TRAY, CAN } from './engine/layouts.js';

// April Showers: from showers to flowers, eight boards from the first
// shower to May Day, the sky clearing as they go, to be reached in turn as
// Valentine's chapters are. The boards grow from 84 tiles to the full set of
// 144, all nine across: the first four are April's, in the rain, and the
// last four May's, coming into flower. The first, the first shower, is the
// gentle start, with no twist, as Cupid's bow is; on the second, umbrella
// weather, raindrops land on the umbrella and run down its ribs, to be
// caught (engine/raindrops.js); on the third, puddle jumping, rain boots
// splash in a puddle, pairs from it taken one after another splashing
// higher (engine/splash.js); on the fourth, the rainbow, its bands light
// up in turn, a pair from the band lit catching its colour
// (engine/colours.js); on the fifth, seedlings, the first of May's, a seed
// tray's seedlings are watered by pairs taken beside them, to bloom and be
// picked (engine/watering.js); on the sixth, the watering can, its body
// fills it and its drops pour it (engine/pour.js); the eighth is to be May
// Day, when April turns to May halfway and every tile turns over. Each chapter is as
// Thanksgiving's days are (thanksgiving.js says what each part is for), and
// PLAN.md has the season's boards and twists. Until April Showers' own
// tiles are drawn, its boards wear Halloween's.

// The umbrella's ribs, fanning out from its peak to the five points of its
// rim, each as its places, [column, row]: the outer two along the canopy's
// edges, and the middle one straight down over its handle.
const RIBS = [
  [[4, 0], [2, 1], [1, 2], [0, 3], [0, 4], [0, 5]],
  [[4, 0], [3, 1], [3, 2], [2, 3], [2, 4], [2, 5]],
  [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5]],
  [[4, 0], [5, 1], [5, 2], [6, 3], [6, 4], [6, 5]],
  [[4, 0], [6, 1], [7, 2], [8, 3], [8, 4], [8, 5]],
];

// The seed tray's seedlings, each [column, row, layer]: the middles of its
// sprouts' crosses, three across the top, two in the middle and three below.
const SEEDLINGS = [
  [1, 1, 1],
  [4, 1, 1],
  [7, 1, 1],
  [2, 4, 1],
  [5, 4, 1],
  [1, 6, 1],
  [4, 6, 1],
  [7, 6, 1],
];

// The watering can's body, a box, [x0, y0, x1, y1], and its drops, falling
// from its rose, [x, y] each, all in half tiles, as positions are.
const CAN_BODY = [0, 6, 8, 18];
const CAN_DROPS = [
  [16, 6],
  [16, 8],
  [16, 10],
  [16, 12],
  [16, 14],
  [16, 16],
  [16, 18],
  [14, 9],
  [14, 11],
  [14, 13],
  [14, 15],
  [14, 17],
  [12, 16],
  [12, 18],
];

export const SHOWERS = [
  {
    name: 'The first chapter',
    title: 'The first shower',
    layout: CLOUD,
    rules: { treats: false, ghostsFloat: false },
    sky: ['#59626d', '#15191e'],
    text: "April comes in with its first shower, and the season begins. A tile is free when nothing lies on it and its left or right side is open, as every raindrop's is: take two free tiles that match.",
  },
  {
    name: 'The second chapter',
    title: 'Umbrella weather',
    layout: UMBRELLA,
    rules: { treats: false, ghostsFloat: false, raindrops: { every: 4, ribs: RIBS } },
    sky: ['#56677a', '#141b24'],
    text: "Showers on and off all day: umbrella weather. As the board starts and every four matches, a raindrop 💧 lands on the umbrella's peak and runs down the canopy along a rib, a row with every match, dripping off at the rim; the tiles still in its way are ringed in blue. Take the tile a drop is on, with any tile of its kind, to catch it: 20 points.",
  },
  {
    name: 'The third chapter',
    title: 'Puddle jumping',
    layout: BOOTS,
    rules: { treats: false, ghostsFloat: false, splash: { edge: 10 } },
    sky: ['#5a6b74', '#151c21'],
    text: "Rain boots on, and straight into the puddle. Its tiles, along the bottom, tinged blue, are the splash zone 💦: take a pair from it, both tiles in the puddle, and it splashes, 10 points. Take another straight after and it splashes higher, 20, then 30, and on, 10 more each time; a pair from anywhere else lets the puddle settle, and the next splash starts again at 10. The boots are standing in it: it's all yours once they're out.",
  },
  {
    name: 'The fourth chapter',
    title: 'The rainbow',
    layout: RAINBOW,
    rules: { treats: false, ghostsFloat: false, colours: { clouds: 16 } },
    sky: ['#5f7584', '#182128'],
    text: "The sun comes out while it rains, and a rainbow arches from cloud to cloud. One band of it is lit at a time, red, orange, yellow, green, blue, violet, and round again, moving on a band with every match. Take a pair from the band that's lit, both tiles in it, and you catch its colour: 15 points. The band lit next is ringed, so you can get a pair ready for it.",
  },
  {
    name: 'The fifth chapter',
    title: 'Seedlings',
    layout: TRAY,
    rules: { treats: false, ghostsFloat: false, watering: { seedlings: SEEDLINGS, drinks: 3 } },
    sky: ['#61798a', '#1a242c'],
    text: "May comes in, and the seeds sown in April are up. Eight seedlings 🌱 stand in the tray, each with its first leaves round it. A pair taken beside a seedling, touching its tile, waters it 💧; watered three times, it blooms 🌷, and a bloom taken, with any tile of its kind, is picked: 30 points. A seedling taken before it blooms is pulled up, just a tile, so water it first.",
  },
  {
    name: 'The sixth chapter',
    title: 'The watering can',
    layout: CAN,
    rules: { treats: false, ghostsFloat: false, pour: { body: CAN_BODY, drops: CAN_DROPS, most: 5 } },
    sky: ['#63809a', '#1b2733'],
    text: "Sunshine, and the garden wants watering. The can starts empty. Take a pair from its body, both tiles in it, and it fills a measure 💧, up to five. Take a pair from the drops sprinkling from its rose, both tiles drops, and it pours one out onto the garden: 20 points. With the can empty a pair of drops waters nothing, and with it full a pair from its body fills nothing: so fill, pour, and fill again.",
  },
];

// The chapter of April Showers a board is for, if it is one of its boards:
// played freely, by its address (#play/cloud), a chapter's board plays by
// that chapter's rules.
export const showerOf = (layout) => SHOWERS.find((d) => d.layout === layout);
