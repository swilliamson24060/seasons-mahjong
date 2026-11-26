import { isFree } from './layout.js';
import { MATCH, GHOST, LANTERN, LOST, dealPairs } from './tiles.js';
import { deal, redeal } from './deal.js';
import { soulsAt } from './midnight.js';
import { chooseList } from './list.js';
import { withFridge } from './fridge.js';
import { chooseBusters } from './doorbusters.js';
import { endZones, isTouchdown } from './football.js';
import { touching } from './flock.js';
import { ringTiles, ringByRing } from './rings.js';
import { followsOn } from './goslings.js';
import { mirrorOf, swansIn, swansCanPart, swanSteps, plantSwans } from './swans.js';
import { choosePails, possiblePails, pailSteps, plantPails } from './milk.js';
import { changePartners } from './dance.js';
import { chooseLords } from './lords.js';
import { choosePipers } from './pipers.js';
import { sparksOf, chooseRockets, litPairsIn } from './fireworks.js';
import { lightAt, inLight, dancesIn } from './disco.js';
import { landing, spots, poppedIn } from './balloons.js';
import { heatOf, hideCoin } from './coin.js';
import { chooseSparklers } from './sparklers.js';
import { scatter } from './confetti.js';
import { inRow, wishRows, starRow } from './stars.js';
import { pathOf, over, inTheWay, clearingTheWay, glide, together } from './glasses.js';
import { chooseSweets, resisting, holdsOut } from './sweets.js';
import { bare, couplesFor, aim, wayWith } from './cupid.js';
import { MESSAGES, CANDY, shows, placeMessages, mend } from './sweethearts.js';
import { rosesOf, roseState, opensAt, inBloom, gathers, gather } from './roses.js';
import { glowTop, glowOf, candlelit, candlelitIn } from './candles.js';
import { chocolatesOf, eat, oneAtATime, savoursAll, savour } from './chocolates.js';
import { letterOf, pairLetter, runOn, byTurns } from './xoxo.js';
import { ribsOf, topOf, wet, running, rainOn, firstRain, catching } from './raindrops.js';
import { inPuddle, isSplash, runAfter, dryFirst, runsIn } from './splash.js';
import { bandOf, litBand, inColour, chasing } from './colours.js';
import { seedlingsOf, waters, tending, bloomsIn } from './watering.js';
import { partOf, pairDoes, pourIn, pouring } from './pour.js';
import { tulipsOf, firstFlight, flyOn, makesHoney, honeyIn, foraging } from './bees.js';
import { landingSpots, landingOf, knocks } from './snowballs.js';
import { kindsLeft, firstSong, hear, songsIn, compose } from './song.js';
import { windAt, upwindOf, inWind, windswept, catches } from './wind.js';
import { tideAt, comingIn, rowsUp, covered, ebbing } from './tide.js';
import { SOON, RESTLESS, hidingPlaces, hidingOf } from './clover.js';
import { rowsOf, nextRow, emptied, sweptIn, cleaning } from './sweep.js';
import { isEquinox, balancing } from './equinox.js';
import { solve } from './solver.js';
import { seeded } from './rng.js';

export const TREATS = ['candle', 'key', 'cat'];

// One board in play: which tiles are left and which can be taken, undo,
// hints, shuffles, treats, ice, the shopping list and the stroke of
// midnight, the fridge, doorbusters, touchdowns, lovebirds, eggs, flocks,
// gold rings, goslings, swans, fresh milk, the dance, leaping lords, pipers,
// fireworks, the disco ball, the balloon drop, the lucky coin, sparklers,
// confetti, shooting stars, a toast for two, Cupid's arrows, sweethearts,
// roses in bloom, candlelight, a box of chocolates, hugs and kisses,
// raindrops, the splash zone, chasing colours, watering, the watering can,
// busy bees, snowballs, the robin's song, the March wind, the four-leaf
// clover, the clean sweep and day meeting night. Nothing here touches the
// page; the board
// listens with on() for what happens: 'match', 'thaw', 'list', 'checkout',
// 'bought', 'grab', 'touchdown', 'lovebirds', 'flock', 'hatch', 'gold',
// 'gosling', 'swan', 'milk', 'dance', 'leap', 'pipe', 'firework',
// 'spotlight', 'balloon', 'coin', 'sparkler', 'confetti', 'star', 'toast',
// 'arrow', 'message', 'rose', 'candlelight', 'chocolate', 'xoxo', 'rain',
// 'splash', 'colour', 'garden', 'can', 'bee', 'snow', 'song', 'wind', 'clover', 'sweep', 'equinox', 'save', 'turn', 'treat',
// 'key', 'shuffle', 'undo', 'win' and 'stuck'.
//
// Options: the seed for the deal; faces, or sides for a board that turns
// over, to set the tiles instead of dealing them; turnAt, the number of
// matches after which the tiles turn over, and firstSide, 'day' or 'night',
// the side they start on; whether ghosts float, and whether lost souls do
// (soulsFloat, free wherever they lie, as May Day's wilted flowers are);
// whether treats are left, and by pairs of which faces (treatFaces:
// jack-o'-lanterns, unless a board says otherwise); ice, for a board with
// frozen tiles: the matches each tile takes to thaw (ice.js); list, for a
// board with a shopping list
// (list.js): { items, by }, how many things it has and after what share of
// the matches checkout comes, or for a board whose faces are set, { kinds,
// checkout }; fridge, for a board with leftovers (fridge.js): how many
// containers it has; and doorbusters, for a board with them
// (doorbusters.js): { pairs, every }, how many there are and after how many
// of the player's matches another shopper grabs one, or for a board whose
// faces are set, { tiles, every }; touchdown, for a football board
// (football.js): how many rows deep each end zone is; and lovebirds, for a
// board of turtle doves: whether a kind's second pair, taken straight after
// its first, is a pair of lovebirds; eggs, for a board of hens: how many of
// the tiles that start blocked are eggs, whose faces aren't seen until they
// come free and hatch; flock, for a board of songbirds: whether a pair
// whose two tiles touch flocks together (flock.js); rings, for the board of
// gold rings: the square each ring goes round (rings.js), each turning to
// gold once every tile of it is taken; goslings, for the board of geese:
// how many pairs in a line, each taken beside or under the pair before it,
// make a brood (goslings.js); swans, for the board of the swan on the lake:
// how many of its pairs are a tile and its own reflection (swans.js); and
// milk, for the milk pail (milk.js): { pails, keeps }, how many pails of
// fresh milk there are and how many matches each keeps for once either of
// its tiles is free, or for a board whose faces are set, { tiles, keeps };
// dance, for the board of the dancer: every how many matches the free tiles
// change partners (dance.js); lords, for the crown: how many lords there
// are, free wherever they are, or for a board whose faces are set, which
// tiles they are (lords.js); pipers, for the bagpipes: how many pipers
// there are, whom the rest of their kind follow out, or which tiles they
// are (pipers.js); fireworks, for New Year's 9: how many rockets there
// are, each lighting up the tiles round it as it bursts, or which tiles
// they are (fireworks.js); disco, for New Year's 8: how many rows deep the
// band of the disco ball's light is, sweeping down the board a row with
// every match (disco.js); balloons, for New Year's 6: { every, drop }, a
// net of balloons opening as the board starts and every so many matches,
// dropping so many balloons onto free tiles with no other of their kind
// free (balloons.js); coin, for New Year's 7: { hot, warm }, a lucky coin
// hidden under a tile, saying after each pair whether it came within so
// many tiles of it, or for a board whose faces are set, { hot, warm, tile },
// the tile it is under (coin.js); sparklers, for New Year's 5: { count,
// burns }, how many sparklers there are, each lit as its tile comes free and
// burning for so many matches, or for a board whose faces are set, { tiles,
// burns } (sparklers.js); confetti, for New Year's 4: whether every tile
// has caught a fleck of confetti, of each kind two of the same colour, or
// for a board whose faces are set, each tile's colour (confetti.js); and
// stars, for New Year's 3: how often a shooting star crosses a row where a
// wish can be made, as the board starts and every so many matches after
// (stars.js); and toast, for New Year's 2: { path }, the places, [column,
// row] each, along which two glasses glide toward each other from its two
// ends, a place a match, wherever the way is clear (glasses.js); and
// sweets, for New Year's Day: { count, days }, how many sweets sit free on
// top of the board, and for how many matches, January, the resolution is
// to leave them alone, or for a board whose faces are set, { tiles, days }
// (sweets.js); and arrows, for Valentine's pierced heart: how often Cupid
// lets fly, as the board starts and every so many matches after, an arrow
// striking a couple of tiles of a kind to take together before his next
// (cupid.js); and sweethearts, for Valentine's envelope: whether tiles
// carry candy hearts, each with half a sweet nothing, its two halves' pairs
// to be taken one straight after the other, or for a board whose faces are
// set, the tiles each message's halves are on (sweethearts.js); and roses,
// for Valentine's vase of roses: { count, every, lasts }, how many roses
// sit on top, opening every so many matches from the top down, and for how
// many matches each stays in bloom, to be taken for the bouquet, or for a
// board whose faces are set, { tiles, every, lasts } (roses.js); and
// candles, for Valentine's first date: { every, deep, pairs }, every how
// many matches the candles' glow sinks a row, how many rows deep it is, and
// how many candlelit pairs, a tile in each candle's glow, the deal's own
// order takes (candles.js); and chocolates, for Valentine's box of
// chocolates: whether its top layer's tiles are the tops of chocolates, to
// be eaten one at a time, each with the tiles under it (chocolates.js); and
// xoxo, for Valentine's hugs and kisses: { split }, the half tiles down
// where the X ends and the O begins, a pair from the X a kiss and from the
// O a hug, to be taken in turn (xoxo.js); and raindrops, for April Showers'
// umbrella: { every, ribs }, every how many matches a raindrop lands on
// the umbrella's peak, as the board starts and after, and the ribs it runs
// down, a place a match, each given as its places, [column, row], from the
// peak to the rim: a pair taken with the tile a drop is on catches it
// (raindrops.js); and splash, for April Showers' rain boots: { edge }, the
// half tiles down where the puddle begins, a pair from it a splash, and
// splashes taken one straight after another splashing higher (splash.js);
// and colours, for April Showers' rainbow: { clouds }, the half tiles down
// where the clouds at its feet begin, each band of the arch a layer, red on
// top, one band lit at a time, moving on a band with every match
// (colours.js); and watering, for April Showers' seed tray: { seedlings,
// drinks }, where its seedlings sit, each [column, row, layer], and how many
// waterings, pairs taken touching one, make one bloom, to be picked
// (watering.js); and pour, for its watering can: { body, drops, most }, the
// can's body, a box, and its drops, their places, a pair from the body
// filling it a measure, up to `most`, and a pair of drops pouring one out
// (pour.js); and bees, for its flower bed: { tops }, the layer its tulips'
// tops are on, a bee flying from tulip to tulip with every match, a pair
// with the tulip she's on making honey (bees.js); and on the Start of
// Spring's thaw, snowballs: { every, melt }, a snowball landing every so
// many matches on a free tile and snowing it in, frozen until a pair is
// taken beside it or it melts, `melt` matches on (snowballs.js); and on its
// first robin, song: whether the robin sings songs of three kinds, sung
// back by pairs of each taken in her order (song.js); and on its kite, wind:
// { every }, the March wind blowing from the east, the south, the west and
// the north, turning every so many matches, the tiles on the edge it blows
// on loose, and a pair with one of them catching the wind (wind.js); and on
// its luck of the Irish, clover: { within }, a four-leaf clover hiding on a
// tile held down, showing once it comes free, to be taken within so many
// matches, and another hiding after it (clover.js); and on its spring
// cleaning, sweep: whether the board's rows, each swept clean as its last
// tile goes, score only swept from the top down (sweep.js); and on its day
// and night, equinox: whether a pair with a tile from each half of the
// board, day and night together, is an equinox pair (equinox.js); and on
// the beach season's sandcastle, tide: { every, high }, the tide coming in
// a row up the board every so many matches, as far as `high` rows, and
// going back out, the rows under the water not to be taken from, and with
// nothing else to take, the tide going out at once (tide.js).
//
// On a board with a fridge, the game's layout has the containers after the
// table's tiles: tableCount is how many tiles the table has, and the places
// from there on are the containers.
export class Game {
  constructor(
    table,
    { seed = 1, faces = null, sides = null, turnAt = Infinity, firstSide = 'day', ghostsFloat = true, soulsFloat = false, treats = true, treatFaces = [LANTERN], ice = null, list = null, fridge = 0, doorbusters = null, touchdown = 0, lovebirds = false, eggs = 0, flock = false, rings = null, goslings = 0, swans = 0, milk = null, dance = 0, lords = 0, pipers = 0, fireworks = 0, disco = 0, balloons = null, coin = null, sparklers = null, confetti = false, stars = 0, toast = null, sweets = null, arrows = 0, sweethearts = false, roses = null, candles = null, chocolates = false, xoxo = null, raindrops = null, splash = null, colours = null, watering = null, pour = null, bees = null, snowballs = null, song = false, wind = null, clover = null, sweep = false, equinox = false, tide = null } = {},
  ) {
    const n = table.count;
    const layout = fridge ? withFridge(table, fridge) : table;
    const pairs = n / 2;
    const turns = turnAt !== Infinity;
    if (turns && !(turnAt >= 1 && turnAt < pairs)) throw new Error(`${table.name} cannot turn over after ${turnAt} matches`);
    this.layout = layout;
    this.tableCount = n;
    this.fridgeSize = fridge;
    this.seed = seed;
    this.rules = { ghostsFloat, soulsFloat, treats, lovebirds, flock, goslings, swans, dance, disco, equinox };
    this.danceR = seeded(seed ^ 0x1d872b41); // who dances with whom
    this.lords = null; // until the lords are chosen, below
    this.treatFaces = treatFaces;
    this.turnAt = turnAt;
    this.r = seeded(seed);
    this.treatR = seeded(seed ^ 0x5bd1e995);
    // What is given for the table's tiles, with nothing yet in the containers.
    const whole = (a, empty) => Int16Array.from({ length: layout.count }, (_, i) => (i < n ? a[i] : empty));
    if (ice && ice.length !== n) throw new Error(`${table.name} has ${n} tiles, not ${ice.length} under ice`);
    // A board with snowballs has ice for the snow to freeze, none of it
    // frozen to begin with.
    this.ice = ice ? whole(ice, 0) : snowballs ? new Int16Array(layout.count) : null;
    const onTable = Uint8Array.from({ length: layout.count }, (_, i) => (i < n ? 1 : 0));
    // On a football board, the end zone each tile is in, and the
    // touchdowns scored so far.
    this.zones = touchdown ? whole(endZones(table, touchdown), 0) : null;
    this.touchdowns = 0;
    this.lovebirds = 0; // on a board of turtle doves, the lovebirds taken so far
    this.flocks = 0; // on a board of songbirds, the pairs that flocked together so far
    // On the board of gold rings, each ring: the square it goes round, its
    // tiles, and whether they have all been taken, turning it to gold.
    this.rings = rings && ringTiles(table, rings).map((tiles, k) => ({ square: rings[k], tiles, gold: false }));
    // On the board of geese, the goslings in the line so far, and the broods
    // they have made.
    this.trail = 0;
    this.broods = 0;
    // On the board of the swan on the lake, each tile's reflection.
    this.mirror = swans ? mirrorOf(table) : null;
    // On New Year's Day, the sweets, 1 for a tile that is one, chosen by
    // where they lie, before the deal, so that it can be made to leave them
    // alone through January; and January, the matches it lasts.
    this.sweets = null;
    this.january = 0;
    if (sweets) {
      this.sweets = new Uint8Array(layout.count);
      for (const i of sweets.tiles || chooseSweets(table, onTable, sweets.count, seeded(seed ^ 0x7f4a7c15))) this.sweets[i] = 1;
      this.january = sweets.days;
    }
    // On Valentine's vase of roses, the roses, in the order they open; how
    // often one opens and how long it stays in bloom; and the match each was
    // taken on, 0 while it's still on the board (roses.js).
    this.roses = roses && (roses.tiles ? roses.tiles.slice() : rosesOf(table, roses.count));
    this.bloom = roses && { every: roses.every, lasts: roses.lasts };
    this.rosesTaken = this.roses && new Int16Array(this.roses.length);
    // On Valentine's box of chocolates, the chocolates, each its top and the
    // tiles under it, and each one 'whole', 'bitten', 'savoured' or 'eaten'
    // (chocolates.js).
    this.chocolates = chocolates ? chocolatesOf(table) : null;
    this.chocolateStates = this.chocolates && this.chocolates.map(() => 'whole');
    // On April Showers' umbrella, the rain: how often a drop lands, and the
    // ribs the drops run down, each place with the tiles over it
    // (raindrops.js).
    this.rain = raindrops && { every: raindrops.every, ribs: ribsOf(table, raindrops.ribs) };
    // On April Showers' rain boots, where the puddle begins, half tiles down,
    // or null on a board without one (splash.js).
    this.puddleEdge = splash ? splash.edge : null;
    // On April Showers' rainbow, where the clouds at its feet begin, half
    // tiles down, or null on a board without one (colours.js).
    this.colourClouds = colours ? colours.clouds : null;
    // On April Showers' seed tray, its seedlings' tiles and the waterings
    // that make one bloom (watering.js).
    this.garden = watering && { seedlings: seedlingsOf(table, watering.seedlings), drinks: watering.drinks };
    // On its watering can, the can's body and drops, and the most it holds
    // (pour.js).
    this.can = pour && { body: pour.body, drops: pour.drops };
    this.canMost = pour ? pour.most : 0;
    // On its flower bed, the tulips, by their tops (bees.js).
    this.tulips = bees ? tulipsOf(table, bees.tops) : null;
    // On the Start of Spring's spring cleaning, the board's rows, from the
    // top down, and each tile's row (sweep.js).
    this.sweepRows = sweep ? rowsOf(table) : null;
    // The board of gold rings is dealt, and shuffled, a ring at a time, in
    // an order of its own; the board of the swan with its swans, a tile and
    // its reflection, coming free at different times; the milk pail with
    // pairs that could be pails all through it; New Year's 2 with each
    // tile in the glasses' way paired with one free along with it, so that
    // their way can be cleared from the start (glasses.js); New Year's Day
    // leaving its sweets till after January (sweets.js); Valentine's vase of
    // roses taking each rose while it's in bloom (roses.js); the box of
    // chocolates eating them one at a time (chocolates.js); hugs and kisses
    // taking a kiss and a hug in turn (xoxo.js); April Showers' umbrella
    // catching the raindrops it can (raindrops.js); and its rain boots
    // keeping the puddle till last, to take it in one run of splashes
    // (splash.js); its rainbow catching the colours it can (colours.js); its
    // seed tray watering every seedling and picking it in bloom
    // (watering.js); its watering can pouring every pair of drops with water
    // in the can (pour.js); its flower bed making honey at every tulip
    // (bees.js); the Start of Spring's spring cleaning sweeping every row
    // from the top down (sweep.js); and its day and night pairing day with
    // night where it can (equinox.js).
    this.prefer = this.rings
      ? ringByRing(layout, this.rings.map((r) => r.tiles), seeded(seed ^ 0x68e31da4).shuffle(this.rings.map((_, k) => k)))
      : swans
        ? plantSwans(this.mirror, swans, swanSteps(seeded(seed ^ 0x3c6ef372), swans, pairs))
        : milk && !milk.tiles
          ? plantPails(table, pailSteps(seeded(seed ^ 0x2f8f9e1d), milk.pails, pairs), milk.keeps)
          : toast
            ? clearingTheWay(inTheWay(layout, pathOf(toast.path)))
            : this.sweets
              ? resisting(this.sweets, this.january)
              : this.roses
                ? inBloom(this.roses, roses.every, roses.lasts)
                : this.chocolates
                  ? oneAtATime(this.chocolates)
                  : xoxo
                    ? byTurns(table, xoxo.split)
                    : this.rain
                      ? catching(this.rain.ribs, this.rain.every, seed)
                      : splash
                        ? dryFirst(table, splash.edge)
                        : colours
                          ? chasing(table, colours.clouds)
                          : this.garden
                            ? tending(table, this.garden.seedlings, this.garden.drinks)
                            : this.can
                              ? pouring(table, this.can, this.canMost)
                              : this.tulips
                                ? foraging(this.tulips, seed)
                                : this.sweepRows
                                  ? cleaning(this.sweepRows)
                                  : equinox
                                    ? balancing(table)
                                    : tide
                                      ? ebbing(table, tide.every, tide.high)
                                      : null;
    // On New Year's 9, the rockets, 1 for a tile that is one, chosen by
    // where they lie, before the deal, so that it can be made with them.
    this.rockets = null;
    if (fireworks) {
      this.rockets = new Uint8Array(layout.count);
      for (const i of Array.isArray(fireworks) ? fireworks : chooseRockets(table, onTable, fireworks, seeded(seed ^ 0x9b05688c))) this.rockets[i] = 1;
    }
    // On Valentine's envelope, where the messages go on a deal: each on two
    // pairs its order takes one straight after the other, every half on a
    // tile whose candy heart shows (sweethearts.js).
    let seen = null;
    const hearts = (order, faces) => {
      seen ||= Uint8Array.from({ length: layout.count }, (_, t) => shows(layout, onTable, t));
      return placeMessages(order, (t) => MATCH[faces[t]], (t) => seen[t] === 1, MESSAGES.length, seeded(seed ^ 0x165667b1), { used: new Set([CANDY]) });
    };
    if (faces || sides) {
      const given = sides || [faces];
      if (given.length !== (turns ? 2 : 1)) throw new Error(`${table.name} needs ${turns ? 2 : 1} sides of faces`);
      for (const s of given) if (s.length !== n) throw new Error(`${table.name} has ${n} tiles, not ${s.length}`);
      this.sides = given.map((f) => whole(f, -1));
      this.plan = null;
    } else {
      // On a football board, dealt again until the deal's own order scores
      // a touchdown, on a board of turtle doves until it takes a pair of
      // lovebirds, and on a board of songbirds until it takes a pair that
      // flocks, so that one can always be had; on the board of the swan
      // until it has its swans, no more and no fewer, each a pair of the
      // deal's own order and of a kind with another pair on the board, which
      // can take a while; on the milk pail until it has enough pairs that
      // could be pails; on New Year's 9 until its own order takes a lit
      // pair; on New Year's 8 until a pair of its own order dances in the
      // disco ball's light; on New Year's 6 until its own order pops a
      // balloon; on New Year's Day until its own order leaves the sweets
      // alone through January; on Valentine's envelope until every message
      // can go on two pairs its own order takes one straight after the
      // other; on the vase of roses until its own order takes every rose in
      // bloom; on the first date until its own order takes so many
      // candlelit pairs; on the box of chocolates until its own order
      // savours every chocolate; on hugs and kisses until its own order
      // takes every pair from one letter; on April Showers' rain boots
      // until its own order takes the whole puddle in one run of splashes;
      // on its seed tray until its own order picks every seedling in bloom;
      // on its watering can until its own order pours every pair of drops
      // with water in the can; and on its flower bed until its own order
      // makes honey at every tulip.
      const dropPairs = this.can ? [...table.x.keys()].filter((i) => partOf(table, i, this.can) === 'drops').length / 2 : 0;
      const puddlePairs = splash ? [...table.x.keys()].filter((i) => inPuddle(table, i, splash.edge)).length / 2 : 0;
      const swansAsWanted = (faces, order) => {
        const found = swansIn(layout, this.mirror, faces, onTable);
        const planned = (a, b) => order.some(([p, q]) => (p === a && q === b) || (p === b && q === a));
        return found.length === swans && found.every(([a, b]) => planned(a, b)) && swansCanPart(faces, onTable, found);
      };
      const wanted = ({ order, sides }) =>
        (!this.zones || order.some(([a, b]) => isTouchdown(this.zones, a, b))) &&
        (!lovebirds || order.some(([a], k) => k > 0 && MATCH[sides[0][a]] === MATCH[sides[0][order[k - 1][0]]])) &&
        (!flock || order.some(([a, b]) => touching(layout, a, b))) &&
        (!swans || swansAsWanted(sides[0], order)) &&
        (!milk || possiblePails(table, order, milk.keeps).length >= milk.pails) &&
        (!this.rockets || litPairsIn(layout, order, this.rockets, onTable) > 0) &&
        (!disco || dancesIn(layout, order, disco) > 0) &&
        (!balloons || poppedIn(layout, order, onTable, balloons, seed, sides[0], (f) => MATCH[f]) > 0) &&
        (!this.sweets || holdsOut(order, this.sweets, this.january)) &&
        (!sweethearts || hearts(order, sides[0]).length === MESSAGES.length) &&
        (!this.roses || gathers(order, this.roses, roses.every, roses.lasts)) &&
        (!candles || candlelitIn(layout, order, candles) >= candles.pairs) &&
        (!this.chocolates || savoursAll(order, this.chocolates)) &&
        (!xoxo || order.every(([a, b]) => pairLetter(layout, a, b, xoxo.split) !== null)) &&
        (!splash || runsIn(layout, order, splash.edge).includes(puddlePairs)) &&
        (!this.garden || bloomsIn(layout, order, this.garden.seedlings, this.garden.drinks) === this.garden.seedlings.length) &&
        (!this.can || pourIn(layout, order, this.can, this.canMost).pours === dropPairs) &&
        (!this.tulips || honeyIn(this.tulips, order, onTable, seed).honey === this.tulips.length) &&
        (!this.sweepRows || sweptIn(this.sweepRows.rows, this.sweepRows.rowOf, order, onTable) === this.sweepRows.rows.length);
      let dealt = null;
      for (let tries = 0; ; tries++) {
        dealt = deal(layout, (turns ? [0, 1] : [0]).map(() => dealPairs(this.r, pairs)), this.r, { present: onTable, turnAt, ice: this.ice, prefer: this.prefer });
        if (!dealt) throw new Error(`${table.name} cannot be dealt`);
        if (tries >= (swans ? 400 : 50) || wanted(dealt)) break;
      }
      // On the first robin, the faces are put on the deal's own order so
      // that it sings back every song the robin sings, as she sings it
      // (song.js).
      if (song && !turns) {
        const left = kindsLeft(onTable, (t) => MATCH[dealt.sides[0][t]]);
        dealt.sides[0] = compose(dealt.order, dealt.sides[0], (f) => MATCH[f], firstSong(seed, left), seed, seeded(seed ^ 0x1b56c4e9));
      }
      this.sides = dealt.sides;
      this.plan = dealt.order; // the order the deal was made in, which wins
    }
    this.sideNames = turns ? [firstSide, firstSide === 'day' ? 'night' : 'day'] : [firstSide];
    this.present = onTable;
    // The swans still to be found, each [tile, its reflection], and those
    // found so far.
    this.swans = swans ? swansIn(table, this.mirror, this.sides[0], onTable) : null;
    this.swansFound = 0;
    // On the crown, the lords, 1 for a tile that is one, and the leaps
    // they have made: lords taken while held down by the usual rule.
    this.leaps = 0;
    if (lords) {
      this.lords = new Uint8Array(layout.count);
      for (const i of Array.isArray(lords) ? lords : chooseLords(table, this.sides[0], onTable, lords, seeded(seed ^ 0x6a09e667))) this.lords[i] = 1;
    }
    // On the bagpipes, the pipers, 1 for a tile that is one, and the tiles
    // that have followed them out.
    this.pipers = null;
    this.piped = 0;
    if (pipers) {
      this.pipers = new Uint8Array(layout.count);
      for (const i of Array.isArray(pipers) ? pipers : choosePipers(table, this.sides[0], onTable, pipers, seeded(seed ^ 0x510e527f), this.plan)) this.pipers[i] = 1;
    }
    // On New Year's 9, the tiles the rockets' bursts have lit, 1 for a lit
    // tile; the rockets set off; and the lit pairs taken.
    this.lit = this.rockets && new Uint8Array(layout.count);
    this.bursts = 0;
    this.litPairs = 0;
    this.spotlights = 0; // on New Year's 8, the pairs that have danced in the disco ball's light
    // On Valentine's first date, the candles: how their glow sinks and how
    // deep it is; and the candlelit pairs taken.
    this.candles = candles;
    this.candlelitPairs = 0;
    // On Valentine's hugs and kisses, where the X ends and the O begins; the
    // run of kisses and hugs taken in turn so far, its letters; and the
    // XOXOs made.
    this.xoxo = xoxo;
    this.run = '';
    this.xoxos = 0;
    // On New Year's 6, the balloon drops: how often and how many; the
    // balloons on the board, 1 for a tile with one on it; and the nets
    // opened, the balloons dropped, popped and floated away so far.
    this.drops = balloons;
    this.balloons = null;
    this.nets = 0;
    this.dropped = 0;
    this.popped = 0;
    this.floated = 0;
    // On New Year's 7, the lucky coin: how near is hot and how near warm,
    // the tile it is under, or -1, the match it was found on, 0 while it is
    // still hidden, and the last pair's reading.
    this.coinRules = coin;
    this.coin = coin ? (coin.tile ?? hideCoin(table, onTable, seeded(seed ^ 0x3f84d5b5))) : -1;
    this.foundAt = 0;
    this.reading = null;
    this.left = n;
    this.matches = 0;
    this.unlocked = new Uint8Array(layout.count);
    this.history = [];
    this.treats = { candle: 0, key: 0, cat: 0 };
    this.treatPairs = 0; // pairs taken that leave treats, as things stand
    this.treatPairsBest = 0; // the most ever taken at once: only a new best earns a treat
    this.hints = 0;
    this.shuffles = 0;
    // The rest of a winning line, kept while the player follows it so that
    // hints are instant, and whether the board can be won, as last found.
    this.line = this.plan && this.plan.slice();
    this.outlook = this.plan ? 'win' : 'unknown';
    this.handlers = {};
    // The shopping list: the kinds on it, and the match at which checkout
    // comes; and the kinds crossed off it so far, in order. A list never
    // asks for a pair that is free from the start, when it can help it.
    this.list = null;
    this.crossed = [];
    if (list) {
      const checkout = list.checkout ?? Math.round(pairs * list.by);
      const freeNow = new Map();
      for (const i of this.freeTiles()) freeNow.set(MATCH[this.faces[i]], (freeNow.get(MATCH[this.faces[i]]) || 0) + 1);
      const avoid = new Set([...freeNow].filter(([, n]) => n >= 2).map(([k]) => k));
      const kinds = list.kinds ?? (this.plan ? chooseList(this.plan, this.sides[0], checkout, list.items, seeded(seed ^ 0x2545f491), avoid) : []);
      this.list = { kinds: Array.from(kinds), checkout };
    }
    // Doorbusters: pairs wearing a sale tag, each 'open', 'mine' once the
    // player has bought it, or 'gone' to another shopper.
    this.busters = null;
    this.busterEvery = 0;
    if (doorbusters) {
      const freeNow = new Set(this.freeTiles());
      const tiles = doorbusters.tiles ?? (this.plan ? chooseBusters(this.plan, doorbusters.pairs, seeded(seed ^ 0x1b873593), freeNow) : []);
      this.busters = tiles.map((t) => ({ tiles: t.slice(), state: 'open' }));
      this.busterEvery = doorbusters.every;
    }
    // Eggs: tiles that start blocked, chosen at random from the seed, whose
    // faces aren't seen until they come free and hatch (1 while still an egg).
    this.eggs = null;
    if (eggs) {
      const blocked = [];
      for (let i = 0; i < n; i++) if (!this.isFree(i)) blocked.push(i);
      this.eggs = new Uint8Array(layout.count);
      for (const i of seeded(seed ^ 0x27d4eb2f).shuffle(blocked).slice(0, eggs)) this.eggs[i] = 1;
    }
    // Fresh milk: pails, each a pair of tiles, 'fresh' until 'taken', 'sour'
    // or 'spilt', with the match after which either of its tiles was free
    // and it began to keep, or null; and how many matches a pail keeps for.
    this.pails = null;
    this.keeps = 0;
    if (milk) {
      const tiles = milk.tiles ?? (this.plan ? choosePails(table, this.plan, milk.pails, seeded(seed ^ 0x7f4a7c15), milk.keeps) : []);
      this.pails = tiles.map((t) => ({ tiles: t.slice(), state: 'fresh', freeAt: null }));
      this.keeps = milk.keeps;
      this.age();
    }
    // The first net of balloons opens as the board starts.
    if (balloons) {
      this.balloons = new Uint8Array(layout.count);
      this.dropBalloons();
    }
    // On New Year's 5, the sparklers, each its tile; 'unlit', 'lit', 'taken'
    // or 'out'; the match after which it was lit, or null; and the matches
    // it had left to burn when it was taken. And how many matches one burns.
    this.sparklers = null;
    this.burns = 0;
    if (sparklers) {
      const tiles = sparklers.tiles ?? (this.plan ? chooseSparklers(table, this.sides[0], onTable, sparklers.count, seeded(seed ^ 0x1f83d9ab), this.plan, sparklers.burns) : []);
      this.sparklers = tiles.map((tile) => ({ tile, state: 'unlit', litAt: null, left: 0 }));
      this.burns = sparklers.burns;
      this.kindle();
    }
    // On New Year's 4, the colour of confetti each tile caught, by its place
    // in confetti.js's COLOURS, and the perfect matches taken: couples of a
    // colour taken together.
    this.confetti = null;
    this.perfects = 0;
    if (confetti) this.confetti = Array.isArray(confetti) ? Int8Array.from(confetti) : this.plan ? scatter(layout, this.plan, this.sides[0], seeded(seed ^ 0x2b992ddf)) : null;
    // On New Year's 3, the shooting stars: how often one crosses; the star
    // crossing now, { row, wished }, or null; how many have crossed; and the
    // wishes made. The first crosses as the board starts.
    this.starEvery = stars;
    this.star = null;
    this.starCount = 0;
    this.wishes = 0;
    if (stars) this.shootStar();
    // On New Year's 2, the path along which the two glasses glide, their
    // places along it, { left, right }, and the match they met on, 0 till
    // then.
    this.path = toast && pathOf(toast.path);
    this.glasses = toast && { left: 0, right: this.path.length - 1 };
    this.toastAt = 0;
    // On New Year's Day, the match the resolution was broken on, a sweet
    // taken in January, or 0 while it holds.
    this.brokenAt = 0;
    // On Valentine's pierced heart, Cupid's arrows: how often he lets fly;
    // the couple his last arrow struck, { tiles, state }, 'smitten' until
    // they're taken together, 'love', or one of them with another tile,
    // 'broken', or null; the arrows flown so far; and the couples taken
    // together, love at first sight, and the hearts broken. The first flies
    // as the board starts.
    this.arrowEvery = arrows;
    this.couple = null;
    this.arrowsFlown = 0;
    this.loves = 0;
    this.heartbreaks = 0;
    if (arrows) this.letFly();
    // On Valentine's envelope, the sweethearts: each message, its two
    // words, the tiles its halves are on, and 'waiting' until a half is
    // taken; then 'begun', first being the half taken, until the very next
    // match says it, 'said', or leaves it 'unsaid'.
    this.messages = null;
    if (sweethearts) {
      const tiles = Array.isArray(sweethearts) ? sweethearts : this.plan ? hearts(this.plan, this.sides[0]) : [];
      this.messages = tiles.map((t, k) => ({ words: MESSAGES[k].slice(), tiles: t.slice(), state: 'waiting', first: -1 }));
    }
    // On April Showers' umbrella, the raindrops that have landed, each { rib,
    // at, state }: the rib it runs down, the matches made as it landed, and
    // 'running' until it's 'caught' or has 'dripped' off the rim. The first
    // lands as the board starts.
    this.raindrops = this.rain ? firstRain(this.rain.ribs, seed, onTable) : null;
    // On April Showers' rain boots, the splashes in the run now, one straight
    // after another; and the splashes so far, how high they splashed all
    // told, their places in their runs added up, and the highest.
    this.splashRun = 0;
    this.splashCount = 0;
    this.splashHeights = 0;
    this.splashBest = 0;
    // On April Showers' rainbow, the colours caught: pairs taken from the
    // band lit as they were taken.
    this.coloursCaught = 0;
    // On April Showers' seed tray, each seedling's water so far, and how it
    // was taken, 'picked' in bloom or 'pulled' before, or null while it's
    // still in the tray.
    this.water = this.garden ? this.garden.seedlings.map(() => 0) : null;
    this.seedlingsTaken = this.garden ? this.garden.seedlings.map(() => null) : null;
    // On its watering can, how full the can is, and the measures it was
    // filled with, the pours made and the pairs of drops poured dry.
    this.canLevel = 0;
    this.fills = 0;
    this.pours = 0;
    this.dryPours = 0;
    // On its flower bed, the bee, { at, next, flights }, the tulip she's on
    // and the one she flies to next, by their places in the tulips, or -1
    // once she's flown off; and the honey made.
    this.bee = this.tulips ? firstFlight(this.tulips, seed) : null;
    this.honey = 0;
    // On the Start of Spring's thaw, how often a snowball lands and how long
    // its snow takes to melt, and the snowballs landed and knocked off.
    this.snowEvery = snowballs ? snowballs.every : 0;
    this.snowMelt = snowballs ? snowballs.melt : 0;
    this.snowLanded = 0;
    this.snowKnocked = 0;
    // On its first robin, the robin, { song, at, songs, sung }: the song
    // she's singing, three kinds, or null once she's sung herself out; the
    // notes of it sung back so far; the songs she has sung, and those sung
    // back to her (song.js).
    this.robin = song ? firstSong(seed, this.kindsLeft()) : null;
    // On its kite, how often the March wind turns, each tile's upwind tiles
    // in each wind, and the pairs that caught the wind (wind.js).
    this.windEvery = wind ? wind.every : 0;
    this.upwind = wind ? upwindOf(layout) : null;
    this.windCaught = 0;
    // On the beach season's sandcastle, how often the tide moves a row and
    // how far it comes in, each tile's row up from the foot, and the match
    // the tide last went out at, at once or from the start (tide.js).
    this.tideEvery = tide ? tide.every : 0;
    this.tideHigh = tide ? tide.high : 0;
    this.rowsUp = tide ? rowsUp(layout) : null;
    this.tideFrom = 0;
    // On its luck of the Irish, the four-leaf clover, { tile, shownAt, hidAt }:
    // the tile it hides on, the match after which that tile came free and it
    // showed, or null while it's hidden, and the match it hid after; or null
    // with nowhere to hide.
    // And how many matches it keeps for once it shows, the clovers hidden
    // so far, and those found and blown away (clover.js). The first hides as
    // the board starts.
    this.cloverWithin = clover ? clover.within : 0;
    this.clover = null;
    this.cloversHidden = 0;
    this.cloversFound = 0;
    this.cloversLost = 0;
    if (clover) this.hideClover();
    // On its spring cleaning, each row 1 once swept in turn, -1 once cleared
    // out of turn, and 0 till then (sweep.js).
    this.rowsSwept = this.sweepRows ? new Int8Array(this.sweepRows.rows.length) : null;
    this.equinoxPairs = 0; // on its day and night, the equinox pairs taken (equinox.js)
  }

  // On Valentine's envelope, the message a tile still on the board carries
  // half of, still to be said, and which half, { message, half }; or null.
  heartOf(i) {
    if (!this.messages || this.present[i] !== 1) return null;
    for (const message of this.messages) {
      if (message.state !== 'waiting' && message.state !== 'begun') continue;
      const half = message.tiles.indexOf(i);
      if (half >= 0) return { message, half };
    }
    return null;
  }

  // The word on a tile's candy heart, or null; whether it is the half still
  // to take of the message begun, to say it; and the messages said.
  wordOn(i) {
    const h = this.heartOf(i);
    return h && h.message.words[h.half];
  }

  awaited(i) {
    const h = this.heartOf(i);
    return h !== null && h.message.state === 'begun';
  }

  get messagesSaid() {
    return this.messages ? this.messages.filter((m) => m.state === 'said').length : 0;
  }

  // The candy hearts go with the tiles as they are shuffled: the half still
  // to take of a message begun onto a pair of the new deal free now, moved
  // to the front of its order, to be said next; and each message waiting
  // onto two pairs the order takes one straight after the other, as the
  // deal put them (sweethearts.js). Returns the order, for the hints.
  reheart(order) {
    const kindOf = (t) => MATCH[this.faces[t]];
    const showing = (t) => shows(this.layout, this.present, t);
    const used = new Set([CANDY]);
    const taken = new Set();
    this.messages = this.messages.map((m) => ({ ...m, tiles: m.tiles.slice() }));
    let line = order;
    const begun = this.messages.find((m) => m.state === 'begun');
    if (begun) {
      const fits = (p) => !used.has(kindOf(p[0]));
      const now = order.findIndex((p) => fits(p) && this.isFree(p[0]) && this.isFree(p[1]));
      const k = now >= 0 ? now : order.findIndex(fits); // one always fits: the half's own kind is still here
      const seen = order[k].filter(showing);
      begun.tiles[1 - begun.first] = this.r.pick(seen.length ? seen : order[k]);
      used.add(kindOf(order[k][0]));
      if (now >= 0) {
        line = [order[k], ...order.slice(0, k), ...order.slice(k + 1)];
        taken.add(0);
      } else taken.add(k);
    }
    const waiting = this.messages.filter((m) => m.state === 'waiting');
    placeMessages(line, kindOf, showing, waiting.length, this.r, { used, taken, loose: true }).forEach((t, k) => (waiting[k].tiles = t));
    return line;
  }

  // On Valentine's vase of roses, which rose a tile still on the board is,
  // counted from 0 in the order they open, or -1; the state of rose k, as
  // roses.js names it; and while rose k is in bloom, the matches it has left.
  roseOf(i) {
    return this.roses && this.present[i] === 1 ? this.roses.indexOf(i) : -1;
  }

  roseState(k) {
    return roseState(k, this.rosesTaken[k], this.matches, this.bloom.every, this.bloom.lasts);
  }

  bloomLeft(k) {
    return opensAt(k, this.bloom.every) + this.bloom.lasts - this.matches;
  }

  // While rose k is in bud, the matches until it opens.
  opensIn(k) {
    return opensAt(k, this.bloom.every) - this.matches;
  }

  // The roses gathered into the bouquet, wasted in bud and wilted so far.
  rosesIn(state) {
    return this.roses ? this.roses.filter((_, k) => this.roseState(k) === state).length : 0;
  }

  get bouquet() {
    return this.rosesIn('gathered');
  }

  // On Valentine's box of chocolates, which chocolate a tile still on the
  // board is part of, or -1; the one bitten into, or -1; and how many are
  // in a state.
  chocolateOf(i) {
    return this.chocolates && this.present[i] === 1 ? this.chocolates.findIndex((c) => c.tiles.includes(i)) : -1;
  }

  get openChocolate() {
    return this.chocolates ? this.chocolateStates.indexOf('bitten') : -1;
  }

  chocolatesIn(state) {
    return this.chocolates ? this.chocolateStates.filter((s) => s === state).length : 0;
  }

  // On Valentine's hugs and kisses, the letter a tile still on the board is
  // in, 'X' or 'O', or null; and the letter a pair must be from to carry the
  // run on, or null with no run.
  xoLetter(i) {
    return this.xoxo && this.present[i] === 1 ? letterOf(this.layout, i, this.xoxo.split) : null;
  }

  get wantsLetter() {
    return this.xoxo && this.run ? (this.run.at(-1) === 'X' ? 'O' : 'X') : null;
  }

  // The hints' way taking next a pair that carries the run on, if one can
  // be taken now and the board still won: the way given, if it does
  // already; or else the first of its pairs that does and can be taken now,
  // moved to the front; or else a pair of the letter made to be taken first,
  // as Cupid's couples are (cupid.js); or, with none, the way given.
  carryOn(way) {
    const want = this.wantsLetter;
    const of = (p) => pairLetter(this.layout, p[0], p[1], this.xoxo.split);
    if (!want || !way.length || of(way[0]) === want) return way;
    const k = way.findIndex((p) => of(p) === want && this.isFree(p[0]) && this.isFree(p[1]));
    if (k > 0) {
      const tried = [way[k], ...way.slice(0, k), ...way.slice(k + 1)];
      if (this.holds(tried)) return tried;
    }
    const free = this.freeTiles().filter((t) => this.xoLetter(t) === want);
    for (let i = 0; i < free.length; i++) {
      for (let j = i + 1; j < free.length; j++) {
        if (MATCH[this.faces[free[i]]] !== MATCH[this.faces[free[j]]]) continue;
        const made = wayWith(way, [free[i], free[j]], 1, (l) => this.holds(l));
        if (made) return made;
      }
    }
    return way;
  }

  // On Valentine's first date, the top row of the candles' glow now, or -1
  // once they've guttered out; which candle's glow a tile still on the
  // board is in, 'his', 'hers' or null; and the matches until the glow
  // sinks again.
  get glowTop() {
    return this.candles ? glowTop(this.layout, this.matches, this.candles) : -1;
  }

  glowOf(i) {
    return this.candles && this.present[i] === 1 ? glowOf(this.layout, i, this.glowTop, this.candles.deep) : null;
  }

  get untilSink() {
    return this.candles && this.glowTop >= 0 ? this.candles.every - (this.matches % this.candles.every) : Infinity;
  }

  // On Valentine's first date, the hints' way taking a candlelit pair now,
  // if one can be taken and the board still won after it: the way given, if
  // it takes one first already; or else made to take one first, as Cupid's
  // couples are (cupid.js), or else a way found from where it leaves the
  // tiles; or, with none, the way given.
  byCandlelight(way) {
    const top = this.glowTop;
    const lit = (a, b) => MATCH[this.faces[a]] === MATCH[this.faces[b]] && candlelit(this.layout, a, b, top, this.candles.deep);
    if (top < 0 || (way[0] && lit(...way[0]))) return way;
    const free = this.freeTiles();
    for (let i = 0; i < free.length; i++) {
      for (let j = i + 1; j < free.length; j++) {
        const [a, b] = [free[i], free[j]];
        if (!lit(a, b)) continue;
        const made = wayWith(way, [a, b], 1, (l) => this.holds(l));
        if (made) return made;
        const present = Uint8Array.from(this.present);
        present[a] = present[b] = 0;
        const { result, line } = solve(this.layout, { ...this.position(), present }, { budget: 20000 });
        if (result === 'win') return [[a, b], ...line];
      }
    }
    return way;
  }

  // On Valentine's pierced heart, Cupid lets fly: his arrow strikes a
  // couple, two tiles of a kind with nothing on them, not both free, that a
  // way to win from here takes together before his next, and the hints
  // follow that way from now on (cupid.js). Returns the couple, or null
  // with none to strike.
  letFly() {
    const couples = couplesFor(this.layout, this.present, this.faces, (f) => MATCH[f], (t) => this.isFree(t));
    const holds = (line) => this.holds(line);
    const aimed = aim(couples, this.wayAhead(), this.arrowEvery, holds, (t) => bare(this.layout, this.present, t), this.seed, this.arrowsFlown);
    this.arrowsFlown++;
    if (aimed && aimed.way) {
      this.line = aimed.way;
      this.outlook = 'win';
    }
    this.couple = aimed ? { tiles: aimed.tiles.slice(), state: 'smitten' } : null;
    return this.couple;
  }

  // Whether a tile still on the board is smitten, struck by Cupid's arrow,
  // its couple still to be taken together; and the matches until he lets
  // fly again.
  isSmitten(i) {
    return this.couple !== null && this.couple.state === 'smitten' && this.present[i] === 1 && this.couple.tiles.includes(i);
  }

  get untilArrow() {
    return this.arrowEvery ? this.arrowEvery - (this.matches % this.arrowEvery) : Infinity;
  }

  // On New Year's Day, whether a tile still on the board is a sweet; whether
  // the resolution still holds, with January still to see through; and
  // whether a tile is a sweet that would break it.
  isSweet(i) {
    return this.sweets !== null && this.sweets[i] === 1 && this.present[i] === 1;
  }

  get resolving() {
    return this.sweets !== null && !this.brokenAt && this.matches < this.january;
  }

  tempting(i) {
    return this.resolving && this.isSweet(i);
  }

  // The days of January the resolution held, a match each, and whether it
  // held through the month.
  get daysHeld() {
    if (!this.sweets) return 0;
    return this.brokenAt ? this.brokenAt - 1 : Math.min(this.matches, this.january);
  }

  get resolutionKept() {
    return this.sweets !== null && !this.brokenAt && this.matches >= this.january;
  }

  // On New Year's 2, whether a tile still on the board is in the glasses'
  // way, over a place between them, before they meet; and the places
  // between them, still to glide.
  inGlassesWay(i) {
    if (!this.path || this.toastAt || !this.present[i]) return false;
    for (let k = this.glasses.left + 1; k < this.glasses.right; k++) if (over(this.layout, i, this.path[k])) return true;
    return false;
  }

  get glassesApart() {
    return this.path ? this.glasses.right - this.glasses.left - 1 : 0;
  }

  // On April Showers' umbrella, the raindrops still running, each { drop,
  // step, tile }: how far down its rib it is, and the tile it's on, or -1
  // over a place whose tiles are all taken (raindrops.js).
  runningDrops() {
    return this.rain ? running(this.rain.ribs, this.raindrops, this.present, this.matches) : [];
  }

  // The running drop a tile still on the board has on it, { drop, step,
  // tile }, or null; and whether a tile lies in a running drop's way, at the
  // top of a place further down its rib.
  dropOn(i) {
    if (!this.rain || !this.present[i]) return null;
    return this.runningDrops().find((d) => d.tile === i) || null;
  }

  inRainWay(i) {
    if (!this.rain || !this.present[i]) return false;
    return this.runningDrops().some(({ drop, step }) => this.rain.ribs[drop.rib].slice(step + 1).some((spot) => topOf(spot, this.present) === i));
  }

  // The drops caught so far, and those landed; and the matches until the
  // next lands, while one still can: while a rib with a tile on it is no
  // longer than the matches that will be left then (raindrops.js).
  get dropsCaught() {
    return this.raindrops ? this.raindrops.filter((d) => d.state === 'caught').length : 0;
  }

  get dropsLanded() {
    return this.raindrops ? this.raindrops.length : 0;
  }

  get untilRain() {
    if (!this.rain) return Infinity;
    const until = this.rain.every - (this.matches % this.rain.every);
    const then = this.left / 2 - until; // the pairs left as it's due
    return this.rain.ribs.some((rib) => rib.length <= then && wet(rib, this.present)) ? until : Infinity;
  }

  // On April Showers' rain boots, whether a tile still on the board is in
  // the puddle, the splash zone; and how high the next splash would splash,
  // its place in the run (splash.js).
  inSplashZone(i) {
    return this.puddleEdge !== null && this.present[i] === 1 && inPuddle(this.layout, i, this.puddleEdge);
  }

  get nextSplash() {
    return this.splashRun + 1;
  }

  // The puddle's tiles still on the board, two of which are a splash still
  // to be had.
  get puddleLeft() {
    let n = 0;
    if (this.puddleEdge !== null) for (let i = 0; i < this.layout.count; i++) if (this.inSplashZone(i)) n++;
    return n;
  }

  // On April Showers' flower bed, whether a tile still on the board is the
  // tulip the bee is on, and whether it's the tulip she flies to next; and
  // the tulips still standing.
  beeOn(i) {
    return this.bee !== null && this.bee.at >= 0 && this.tulips[this.bee.at] === i && this.present[i] === 1;
  }

  beeNext(i) {
    return this.bee !== null && this.bee.next >= 0 && this.tulips[this.bee.next] === i && this.present[i] === 1;
  }

  get tulipsLeft() {
    return this.tulips ? this.tulips.filter((t) => this.present[t]).length : 0;
  }

  // On its flower bed, the hints' way making honey now, if the bee's tulip
  // can be taken and the board still won after it: the way given, if it
  // does already; or else made to take her tulip first, with a free tile of
  // its kind, as Cupid's couples are (cupid.js), or else a way found from
  // where that leaves the tiles; or else, with another tulip first, the
  // first pair that can be taken now without one moved there; or the way
  // given.
  forage(way) {
    if (!way.length) return way;
    const tulip = (t) => this.tulips.includes(t);
    if (makesHoney(this.tulips, this.bee, ...way[0])) return way;
    const on = this.bee.at >= 0 ? this.tulips[this.bee.at] : -1;
    if (on >= 0 && this.isFree(on)) {
      for (const p of this.freeTiles()) {
        if (p === on || MATCH[this.faces[p]] !== MATCH[this.faces[on]]) continue;
        const made = wayWith(way, [on, p], 1, (l) => this.holds(l));
        if (made) return made;
        const present = Uint8Array.from(this.present);
        present[on] = present[p] = 0;
        const { result, line } = solve(this.layout, { ...this.position(), present }, { budget: 20000 });
        if (result === 'win') return [[on, p], ...line];
      }
    }
    if (way[0].some(tulip)) {
      const k = way.findIndex((p) => !p.some(tulip) && this.isFree(p[0]) && this.isFree(p[1]));
      if (k > 0) {
        const tried = [way[k], ...way.slice(0, k), ...way.slice(k + 1)];
        if (this.holds(tried)) return tried;
      }
    }
    return way;
  }

  // On the Start of Spring's thaw, whether a tile still on the board is
  // snowed in, all of the ice there being snow; the tiles that are; and the
  // matches until the next snowball.
  snowedIn(i) {
    return this.snowEvery > 0 && this.present[i] === 1 && this.frozen(i);
  }

  snowedTiles() {
    const out = [];
    for (let i = 0; i < this.layout.count; i++) if (this.snowedIn(i)) out.push(i);
    return out;
  }

  get untilSnow() {
    return this.snowEvery ? this.snowEvery - (this.matches % this.snowEvery) : Infinity;
  }

  // A snowball lands, on the thaw: on a free tile that a way to clear the
  // board, found afresh from the board as it stands, won't want before its
  // snow would melt, beside a tile to knock it off with, and leaving a pair
  // to take; chosen from the board's seed. The hints' way, if the snowball
  // falls across it, is found again. Returns the tile, or -1.
  snowOn() {
    const { result, line } = solve(this.layout, this.position(), { budget: 20000 });
    const pairs = this.pairs();
    const spots = landingSpots(this.layout, this.freeTiles(), this.present, result === 'win' ? line : [], this.snowMelt).filter((t) => pairs.some(([x, y]) => x !== t && y !== t));
    const t = landingOf(spots, this.seed, this.snowLanded);
    if (t < 0) return -1;
    this.ice[t] = this.matches + this.snowMelt;
    this.snowLanded++;
    if (this.line && !this.holds(this.line)) this.forget();
    return t;
  }

  // On the thaw, the hints' way knocking snow off when it can: a pair
  // further along it that is free now and beside a snowed tile, taken
  // first, if the way still holds then; or the way given.
  knockFirst(way) {
    const snowed = this.snowedTiles();
    if (!way.length || !snowed.length) return way;
    const knocking = ([x, y]) => knocks(this.layout, snowed, x, y).length > 0;
    if (knocking(way[0])) return way;
    for (let k = 1; k < way.length; k++) {
      if (!knocking(way[k]) || !this.isFree(way[k][0]) || !this.isFree(way[k][1])) continue;
      const tried = [way[k], ...way.slice(0, k), ...way.slice(k + 1)];
      if (this.holds(tried)) return tried;
    }
    return way;
  }

  // On the Start of Spring's first robin, the kinds with a pair still to
  // take; the kind of her next note, or -1 with no song; whether a tile
  // still on the board is of it; and which note of her song a tile still on
  // the board is of, counted from 0, or -1.
  kindsLeft() {
    return kindsLeft(this.present, (t) => MATCH[this.faces[t]]);
  }

  get nextNote() {
    return this.robin && this.robin.song ? this.robin.song[this.robin.at] : -1;
  }

  isNextNote(i) {
    return this.present[i] === 1 && this.nextNote >= 0 && MATCH[this.faces[i]] === this.nextNote;
  }

  noteOf(i) {
    return this.robin && this.robin.song && this.present[i] === 1 ? this.robin.song.indexOf(MATCH[this.faces[i]]) : -1;
  }

  // On the first robin, the hints' way singing her songs back: the way
  // given, if it sings her next note now; or else one made to, if it sings
  // as many of her songs back as the way given does, or more, as a way
  // dealt to sing them all, resting between them, does.
  singAlong(way) {
    const want = this.nextNote;
    if (want < 0 || !way.length || MATCH[this.faces[way[0][0]]] === want) return way;
    const mended = this.singNow(way);
    if (mended === way) return way;
    const sings = (w) => songsIn(w, this.present, (t) => MATCH[this.faces[t]], this.seed, this.robin).sung;
    return sings(mended) >= sings(way) ? mended : way;
  }

  // The hints' way made to sing her next note now: a pair of it further
  // along the way, free now, taken first, or two free tiles of its kind
  // made into a pair to take first, as Cupid's couples are (cupid.js), or
  // else a way found from where they leave the tiles, if the board is still
  // won after it; or else, with a pair of another of her kinds first, out of
  // turn, the first pair of the way that can be taken now without one moved
  // there; or the way given.
  singNow(way) {
    const want = this.nextNote;
    const kindOf = (p) => MATCH[this.faces[p[0]]];
    for (let k = 1; k < way.length; k++) {
      if (kindOf(way[k]) !== want || !this.isFree(way[k][0]) || !this.isFree(way[k][1])) continue;
      const tried = [way[k], ...way.slice(0, k), ...way.slice(k + 1)];
      if (this.holds(tried)) return tried;
    }
    const free = this.freeTiles().filter((t) => MATCH[this.faces[t]] === want);
    for (let i = 0; i < free.length; i++) {
      for (let j = i + 1; j < free.length; j++) {
        const made = wayWith(way, [free[i], free[j]], 1, (l) => this.holds(l));
        if (made) return made;
        const present = Uint8Array.from(this.present);
        present[free[i]] = present[free[j]] = 0;
        const { result, line } = solve(this.layout, { ...this.position(), present }, { budget: 20000 });
        if (result === 'win') return [[free[i], free[j]], ...line];
      }
    }
    const { song } = this.robin;
    if (song.includes(kindOf(way[0]))) {
      const k = way.findIndex((p) => !song.includes(kindOf(p)) && this.isFree(p[0]) && this.isFree(p[1]));
      if (k > 0) {
        const tried = [way[k], ...way.slice(0, k), ...way.slice(k + 1)];
        if (this.holds(tried)) return tried;
      }
    }
    return way;
  }

  // On the Start of Spring's kite, where the wind blows from, by its place
  // in wind.js's WINDS, or -1 with no wind; the matches until it turns;
  // whether a tile still on the board is in it, on the edge it blows on,
  // and loose; and the tiles that are.
  get windFrom() {
    return this.windEvery ? windAt(this.matches, this.windEvery) : -1;
  }

  get untilWindTurns() {
    return this.windEvery ? this.windEvery - (this.matches % this.windEvery) : Infinity;
  }

  inWind(i) {
    return this.windEvery > 0 && inWind(this.upwind, this.windFrom, this.present, i);
  }

  windTiles() {
    return this.windEvery ? windswept(this.upwind, this.windFrom, this.present) : [];
  }

  // On the kite, the hints' way catching the wind when it can: the way
  // given, if its next pair does already; or else a pair of it further
  // along, free now with a tile in the wind, taken first, if the way still
  // holds then; or else two free tiles of a kind, one in the wind, made into
  // a pair to take first, as Cupid's couples are (cupid.js); or the way
  // given.
  catchWind(way) {
    if (!way.length) return way;
    const w = this.windFrom;
    const catching = ([x, y]) => catches(this.upwind, w, this.present, x, y);
    if (catching(way[0])) return way;
    for (let k = 1; k < way.length; k++) {
      if (!catching(way[k]) || !this.isFree(way[k][0]) || !this.isFree(way[k][1])) continue;
      const tried = [way[k], ...way.slice(0, k), ...way.slice(k + 1)];
      if (this.holds(tried)) return tried;
    }
    const free = this.freeTiles();
    for (const t of free) {
      if (!this.inWind(t)) continue;
      for (const u of free) {
        if (u === t || MATCH[this.faces[u]] !== MATCH[this.faces[t]]) continue;
        const made = wayWith(way, [t, u], 1, (l) => this.holds(l));
        if (made) return made;
      }
    }
    return way;
  }

  // On the Start of Spring's luck of the Irish, a four-leaf clover hides: on
  // a tile held down that a way to clear the board, found afresh from the
  // board as it stands, frees soon and then takes while the clover would
  // keep, chosen from the board's seed; or, with none it frees that soon,
  // one it frees later; or, with no such tile, on any tile held down; or
  // nowhere, with none. Returns the tile, or -1.
  hideClover() {
    const held = [];
    for (let t = 0; t < this.tableCount; t++) if (this.present[t] && !this.isFree(t)) held.push(t);
    const { result, line } = held.length ? solve(this.layout, this.position(), { budget: 20000 }) : { result: 'none', line: [] };
    const freeAt = (p, t) => this.loose(t) || isFree(this.layout, p, t);
    const soon = result === 'win' ? hidingPlaces(line, this.present, held, freeAt, this.cloverWithin, SOON) : [];
    const places = soon.length || result !== 'win' ? soon : hidingPlaces(line, this.present, held, freeAt, this.cloverWithin);
    const t = hidingOf(places.length ? places : held, this.seed, this.cloversHidden);
    if (t >= 0) this.cloversHidden++;
    this.clover = t >= 0 ? { tile: t, shownAt: null, hidAt: this.matches } : null;
    return t;
  }

  // Whether a tile still on the board has the clover on it, showing; and,
  // while it shows, the matches it keeps for still.
  hasClover(i) {
    return this.clover !== null && this.clover.shownAt !== null && this.clover.tile === i && this.present[i] === 1;
  }

  get cloverLeft() {
    return this.clover && this.clover.shownAt !== null ? this.cloverWithin - (this.matches - this.clover.shownAt) : 0;
  }

  // On luck of the Irish, the hints' way taking the clover while it keeps:
  // the way given, if it takes the clover's tile in time; or else made to
  // take it first, its pair further along the way taken first if both its
  // tiles are free, or its tile made into a pair with a free tile of its
  // kind to take first, as Cupid's couples are (cupid.js), or else a way
  // found from where that leaves the tiles; or the way given.
  pickClover(way) {
    if (!this.clover || this.clover.shownAt === null || !way.length) return way;
    const t = this.clover.tile;
    const k = way.findIndex((p) => p.includes(t));
    if (k >= 0 && k < this.cloverLeft) return way;
    if (k > 0 && this.isFree(way[k][0]) && this.isFree(way[k][1])) {
      const tried = [way[k], ...way.slice(0, k), ...way.slice(k + 1)];
      if (this.holds(tried)) return tried;
    }
    if (!this.isFree(t)) return way;
    for (const u of this.freeTiles()) {
      if (u === t || MATCH[this.faces[u]] !== MATCH[this.faces[t]]) continue;
      const made = wayWith(way, [t, u], 1, (l) => this.holds(l));
      if (made) return made;
      const present = Uint8Array.from(this.present);
      present[t] = present[u] = 0;
      const { result, line } = solve(this.layout, { ...this.position(), present }, { budget: 20000 });
      if (result === 'win') return [[t, u], ...line];
    }
    return way;
  }

  // On the Start of Spring's spring cleaning, the row to sweep next, the
  // highest with tiles still in it, or -1; whether a tile still on the board
  // is in it; the tiles left in a row; the rows swept clean in turn; and the
  // tiles they had, all told.
  get rowToSweep() {
    return this.sweepRows ? nextRow(this.sweepRows.rows, this.present) : -1;
  }

  inRowToSweep(i) {
    return this.sweepRows !== null && this.present[i] === 1 && this.sweepRows.rowOf[i] === this.rowToSweep;
  }

  rowLeft(r) {
    return this.sweepRows.rows[r].reduce((n, t) => n + this.present[t], 0);
  }

  get rowsSweptClean() {
    return this.rowsSwept ? this.rowsSwept.filter((s) => s === 1).length : 0;
  }

  get sweptTiles() {
    return this.rowsSwept ? this.sweepRows.rows.reduce((n, tiles, r) => n + (this.rowsSwept[r] === 1 ? tiles.length : 0), 0) : 0;
  }

  // On spring cleaning, the hints' way sweeping from the top down: of the
  // way given, and that way with its first pair free now that takes a tile
  // of the row to sweep, or that clears no row out of turn, moved to the
  // front, the one that sweeps the most rows in turn, the way given if none
  // sweeps more.
  sweepDown(way) {
    if (!way.length) return way;
    const { rows, rowOf } = this.sweepRows;
    const next = nextRow(rows, this.present);
    const sweeps = (w) => sweptIn(rows, rowOf, w, this.present);
    const clears = ([x, y]) => {
      const p = Uint8Array.from(this.present);
      p[x] = p[y] = 0;
      return emptied(rows, rowOf, p, x, y).out.length > 0;
    };
    let best = way;
    let most = sweeps(way);
    for (const wanted of [(p) => rowOf[p[0]] === next || rowOf[p[1]] === next, (p) => !clears(p)]) {
      if (wanted(way[0])) continue;
      const k = way.findIndex((p, j) => j > 0 && wanted(p) && this.isFree(p[0]) && this.isFree(p[1]));
      if (k < 0) continue;
      const tried = [way[k], ...way.slice(0, k), ...way.slice(k + 1)];
      if (!this.holds(tried)) continue;
      const n = sweeps(tried);
      if (n > most) [best, most] = [tried, n];
    }
    return best;
  }

  // On the Start of Spring's day and night, the hints' way taking an equinox
  // pair when it can: the way given, if its next pair is one already; or
  // else one of its pairs further along, free now, taken first, if the way
  // still holds then; or else two free tiles of a kind, one from each side,
  // made into a pair to take first, as Cupid's couples are (cupid.js); or
  // the way given.
  meetHalfway(way) {
    if (!way.length || isEquinox(this.layout, ...way[0])) return way;
    for (let k = 1; k < way.length; k++) {
      if (!isEquinox(this.layout, ...way[k]) || !this.isFree(way[k][0]) || !this.isFree(way[k][1])) continue;
      const tried = [way[k], ...way.slice(0, k), ...way.slice(k + 1)];
      if (this.holds(tried)) return tried;
    }
    const free = this.freeTiles();
    for (let i = 0; i < free.length; i++) {
      for (let j = i + 1; j < free.length; j++) {
        if (MATCH[this.faces[free[i]]] !== MATCH[this.faces[free[j]]] || !isEquinox(this.layout, free[i], free[j])) continue;
        const made = wayWith(way, [free[i], free[j]], 1, (l) => this.holds(l));
        if (made) return made;
      }
    }
    return way;
  }

  // On April Showers' watering can, which part of it a tile still on the
  // board is in, 'body', 'drops' or null; and the drops' pairs, all told.
  canPart(i) {
    return this.can && this.present[i] === 1 ? partOf(this.layout, i, this.can) : null;
  }

  get dropPairs() {
    if (!this.can) return 0;
    let n = 0;
    for (let i = 0; i < this.tableCount; i++) if (partOf(this.layout, i, this.can) === 'drops') n++;
    return n / 2;
  }

  // The drops still on the board, two of which are a pour still to be had.
  get dropsLeft() {
    let n = 0;
    if (this.can) for (let i = 0; i < this.tableCount; i++) if (this.canPart(i) === 'drops') n++;
    return n;
  }

  // On its watering can, the hints' way pouring when the can has water and
  // a pair of drops can be had, and leaving the drops while the can is
  // empty, and its body while it's full, while anything else can go: a
  // pair of the way that does so moved to the front, if it can be taken now
  // and the board still won after it; or the way given.
  pourWell(way) {
    if (!way.length) return way;
    const does = (p) => pairDoes(this.layout, p[0], p[1], this.can, this.canLevel, this.canMost);
    const first = (want) => {
      const k = way.findIndex((p) => want(p) && this.isFree(p[0]) && this.isFree(p[1]));
      if (k <= 0) return null;
      const tried = [way[k], ...way.slice(0, k), ...way.slice(k + 1)];
      return this.holds(tried) ? tried : null;
    };
    const now = does(way[0]);
    if (now === 'pour') return way;
    if (this.canLevel > 0) {
      const poured = first((p) => does(p) === 'pour');
      if (poured) return poured;
    }
    if (now === 'dry' || now === 'full') return first((p) => does(p) !== 'dry' && does(p) !== 'full') || way;
    return way;
  }

  // On April Showers' seed tray, which seedling a tile still on the board
  // is, or -1; whether seedling k has bloomed; the waterings it still needs;
  // and how many seedlings were taken each way, 'picked' or 'pulled'.
  seedlingOf(i) {
    return this.garden && this.present[i] === 1 ? this.garden.seedlings.indexOf(i) : -1;
  }

  bloomed(k) {
    return this.water[k] >= this.garden.drinks;
  }

  thirst(k) {
    return Math.max(0, this.garden.drinks - this.water[k]);
  }

  seedlingsIn(how) {
    return this.seedlingsTaken ? this.seedlingsTaken.filter((h) => h === how).length : 0;
  }

  // On April Showers' seed tray, the hints' way picking a bloom when one can
  // be picked, and leaving a seedling still to bloom while anything else can
  // go first: a pair of the way that picks one moved to the front, if it can
  // be taken now and the board still won; or else, with a seedling in bud
  // first, the first pair that can be taken now without one moved there; or
  // the way given.
  tend(way) {
    if (!way.length) return way;
    const kOf = (t) => this.garden.seedlings.indexOf(t);
    const waiting = (t) => kOf(t) >= 0 && !this.seedlingsTaken[kOf(t)];
    const bloom = (t) => waiting(t) && this.bloomed(kOf(t));
    const bud = (t) => waiting(t) && !this.bloomed(kOf(t));
    const first = (want) => {
      const k = way.findIndex((p) => want(p) && this.isFree(p[0]) && this.isFree(p[1]));
      if (k <= 0) return null;
      const tried = [way[k], ...way.slice(0, k), ...way.slice(k + 1)];
      return this.holds(tried) ? tried : null;
    };
    if (!way[0].some(bloom)) {
      const picking = first((p) => p.some(bloom));
      if (picking) return picking;
    }
    if (way[0].some(bud)) return first((p) => !p.some(bud)) || way;
    return way;
  }

  // On April Showers' rainbow, the band a tile still on the board is in, 0
  // for red to 5 for violet, or -1, a cloud's or on a board without one;
  // and the band lit now and the band lit next, or -1 (colours.js).
  colourOf(i) {
    return this.colourClouds !== null && this.present[i] === 1 ? bandOf(this.layout, i, this.colourClouds) : -1;
  }

  get bandLit() {
    return this.colourClouds !== null ? litBand(this.matches) : -1;
  }

  get bandNext() {
    return this.colourClouds !== null ? litBand(this.matches + 1) : -1;
  }

  // On April Showers' rainbow, the hints' way catching the colour lit now,
  // if a pair from its band can be taken and the board still won after it:
  // the way given, if its first pair does already; or else made to take
  // one first, as Cupid's couples are (cupid.js), or else a way found from
  // where that leaves the tiles; or, with none, the way given.
  byColour(way) {
    const band = this.bandLit;
    const L = this.layout;
    const caught = (a, b) => MATCH[this.faces[a]] === MATCH[this.faces[b]] && inColour(L, a, b, this.colourClouds, band);
    if (way[0] && inColour(L, way[0][0], way[0][1], this.colourClouds, band)) return way;
    const free = this.freeTiles().filter((t) => this.colourOf(t) === band);
    for (let i = 0; i < free.length; i++) {
      for (let j = i + 1; j < free.length; j++) {
        const [a, b] = [free[i], free[j]];
        if (!caught(a, b)) continue;
        const made = wayWith(way, [a, b], 1, (l) => this.holds(l));
        if (made) return made;
        const present = Uint8Array.from(this.present);
        present[a] = present[b] = 0;
        const { result, line } = solve(this.layout, { ...this.position(), present }, { budget: 20000 });
        if (result === 'win') return [[a, b], ...line];
      }
    }
    return way;
  }

  // On April Showers' rain boots, the hints' way keeping out of the puddle
  // while anything else is left, and then splashing through it in one run:
  // the way given with its splashes, its pairs from the puddle, moved after
  // all the rest, where that still wins; or else the way given.
  savePuddle(way) {
    const L = this.layout;
    const edge = this.puddleEdge;
    const splash = (p) => isSplash(L, p[0], p[1], edge);
    const tried = [...way.filter((p) => !splash(p)), ...way.filter(splash)];
    if (tried.every((p, k) => p === way[k])) return way;
    return this.holds(tried) ? tried : way;
  }

  // On April Showers' umbrella, the hints' way catching a drop now, if one
  // can be caught and the board still won after it: the way given, if its
  // first pair catches one already; or else made to take a pair that does
  // first, the drop furthest down its rib first, as Cupid's couples are
  // (cupid.js), or else a way found from where that leaves the tiles; or,
  // with none, the way given.
  byRaindrops(way) {
    const drops = this.runningDrops()
      .filter(({ tile }) => tile >= 0 && this.isFree(tile))
      .sort((p, q) => q.step - p.step);
    if (!drops.length || (way[0] && way[0].some((t) => drops.some((d) => d.tile === t)))) return way;
    const free = this.freeTiles();
    for (const { tile } of drops) {
      for (const p of free) {
        if (p === tile || MATCH[this.faces[p]] !== MATCH[this.faces[tile]]) continue;
        const made = wayWith(way, [tile, p], 1, (l) => this.holds(l));
        if (made) return made;
        const present = Uint8Array.from(this.present);
        present[tile] = present[p] = 0;
        const { result, line } = solve(this.layout, { ...this.position(), present }, { budget: 20000 });
        if (result === 'win') return [[tile, p], ...line];
      }
    }
    return way;
  }

  // On New Year's 3, a shooting star crosses a row where a wish can be made
  // (stars.js), or none, with nowhere one can. Returns the star, or null.
  shootStar() {
    const rows = wishRows(this.layout, this.present, this.faces, (f) => MATCH[f]);
    const row = starRow(rows, this.seed, this.starCount);
    this.starCount++;
    this.star = row >= 0 ? { row, wished: false } : null;
    return this.star;
  }

  // Whether a tile still on the board lies in the row of the star crossing
  // now, its wish still to make; and the matches until the next star.
  inStarRow(i) {
    return this.star !== null && !this.star.wished && this.present[i] === 1 && inRow(this.layout, i, this.star.row);
  }

  get untilStar() {
    return this.starEvery ? this.starEvery - (this.matches % this.starEvery) : Infinity;
  }

  // On New Year's 5, the sparkler a tile still on the board is, unlit or
  // burning, or undefined; the matches a burning one has left to burn; and
  // how many sparklers are still to be taken, unlit or burning.
  sparklerOf(i) {
    return this.sparklers && this.present[i] ? this.sparklers.find((s) => s.tile === i && (s.state === 'unlit' || s.state === 'lit')) : undefined;
  }

  burnLeft(s) {
    return s.litAt + this.burns - this.matches;
  }

  get sparklersLeft() {
    return this.sparklers ? this.sparklers.filter((s) => this.sparklerOf(s.tile)).length : 0;
  }

  // Sparklers whose tiles have come free are lit. Returns their tiles.
  kindle() {
    const out = [];
    for (const s of this.sparklers || []) {
      if (s.state === 'unlit' && this.present[s.tile] && this.isFree(s.tile)) {
        s.state = 'lit';
        s.litAt = this.matches;
        out.push(s.tile);
      }
    }
    return out;
  }

  // Burning sparklers that have burnt as long as they can burn out.
  // Returns their tiles.
  burnOut() {
    const out = [];
    for (const s of this.sparklers || []) {
      if (s.state === 'lit' && this.burnLeft(s) <= 0) {
        s.state = 'out';
        out.push(s.tile);
      }
    }
    return out;
  }

  // On New Year's 6, a net opens: the balloons still on the board float
  // away, and new ones drop onto free tiles with no other of their kind
  // free (balloons.js). Returns { landed, floated }, the tiles of each.
  dropBalloons() {
    const floated = [];
    for (let i = 0; i < this.layout.count; i++) {
      if (this.balloons[i]) {
        this.balloons[i] = 0;
        if (this.present[i]) floated.push(i);
      }
    }
    const landed = landing(spots(this.layout, this.present, this.faces, (f) => MATCH[f]), this.drops.drop, this.seed, this.nets);
    for (const i of landed) this.balloons[i] = 1;
    this.nets++;
    this.dropped += landed.length;
    this.floated += floated.length;
    return { landed, floated };
  }

  // Whether a tile still on the board has a balloon on it, and how many do;
  // and the matches until the next net opens.
  hasBalloon(i) {
    return this.balloons !== null && this.balloons[i] === 1 && this.present[i] === 1;
  }

  get balloonsLeft() {
    let n = 0;
    if (this.balloons) for (let i = 0; i < this.layout.count; i++) if (this.hasBalloon(i)) n++;
    return n;
  }

  get untilDrop() {
    return this.drops ? this.drops.every - (this.matches % this.drops.every) : Infinity;
  }

  // The fresh pail a tile is in, or -1.
  pailOf(i) {
    return this.pails ? this.pails.findIndex((p) => p.state === 'fresh' && p.tiles.includes(i)) : -1;
  }

  // The matches a fresh pail still keeps for, or null while neither of its
  // tiles is free.
  freshIn(k) {
    const p = this.pails[k];
    return p.freeAt === null ? null : p.freeAt + this.keeps - this.matches;
  }

  // On the board of the dancer, the matches until the music changes, and
  // whether there is anyone left to change partners with: a tile held down.
  get untilDance() {
    return this.rules.dance ? this.rules.dance - (this.matches % this.rules.dance) : Infinity;
  }

  get canDance() {
    for (let i = 0; i < this.layout.count; i++) if (this.present[i] && !this.isFree(i)) return true;
    return false;
  }

  // The music changes: each free tile dances off with a tile held down, and
  // they change places, so long as the board can still be won so (dance.js).
  // Returns { sides, swaps }, the faces before it and the tiles that changed
  // places, or null when there was no dance.
  dance() {
    const held = [];
    for (let i = 0; i < this.layout.count; i++) if (this.present[i] && !this.isFree(i)) held.push(i);
    const free = this.danceR.shuffle(this.freeTiles());
    if (!free.length || !held.length) return null;
    const changed = changePartners(this.layout, this.position(), free, held, this.danceR);
    if (!changed) return null;
    const sides = this.sides;
    this.sides = sides.map((s, k) => (k === this.side ? changed.faces : s));
    this.line = changed.line;
    this.outlook = 'win';
    return { sides, swaps: changed.swaps };
  }

  // The pails taken while fresh, those that soured, and those spilt.
  pailsIn(state) {
    return this.pails ? this.pails.filter((p) => p.state === state).length : 0;
  }

  get pailsTaken() {
    return this.pailsIn('taken');
  }

  // Pails with a tile come free begin to keep, and those that have kept as
  // long as they can sour. Returns the pails that soured.
  age() {
    const soured = [];
    for (const p of this.pails || []) {
      if (p.state !== 'fresh') continue;
      if (p.freeAt !== null && this.matches >= p.freeAt + this.keeps) {
        p.state = 'sour';
        soured.push(p);
      } else if (p.freeAt === null && p.tiles.some((t) => this.isFree(t))) p.freeAt = this.matches;
    }
    return soured;
  }

  // Whether a tile is still an egg, its face not yet seen.
  isEgg(i) {
    return Boolean(this.eggs) && this.eggs[i] === 1;
  }

  // The eggs still to hatch.
  get eggsLeft() {
    return this.eggs ? this.eggs.reduce((sum, e) => sum + e, 0) : 0;
  }

  // Eggs that have come free hatch, and stay hatched: an undo never puts a
  // tile back in its egg. Returns the tiles that hatched.
  hatch() {
    const out = [];
    if (this.eggs) {
      for (let i = 0; i < this.layout.count; i++) {
        if (this.eggs[i] && this.isFree(i)) {
          this.eggs[i] = 0;
          out.push(i);
        }
      }
    }
    return out;
  }

  // On the lake, whether a tile lies in the water: the swan's reflection.
  inLake(i) {
    return Boolean(this.mirror) && this.layout.y[i] >= this.layout.height / 2;
  }

  // The last pair taken, as its entry in the history, or null.
  lastMatch() {
    for (let k = this.history.length - 1; k >= 0; k--) if (this.history[k].type === 'match') return this.history[k];
    return null;
  }

  // Whether taking a tile now would follow on from the pair taken last, on
  // the board of geese: whether it lay beside or under one of its tiles.
  followsFrom(i) {
    const before = this.rules.goslings ? this.lastMatch() : null;
    return before !== null && followsOn(this.layout, [before.a, before.b], [i]);
  }

  // The rings turned to gold so far.
  get goldRings() {
    return this.rings ? this.rings.filter((r) => r.gold).length : 0;
  }

  // Rings whose every tile has now been taken turn to gold. Returns them,
  // by their places in the rings.
  gild() {
    const out = [];
    if (this.rings) {
      this.rings.forEach((r, k) => {
        if (!r.gold && r.tiles.every((t) => !this.present[t])) {
          r.gold = true;
          out.push(k);
        }
      });
    }
    return out;
  }

  on(type, fn) {
    (this.handlers[type] || (this.handlers[type] = [])).push(fn);
    return this;
  }

  emit(type, data) {
    for (const fn of this.handlers[type] || []) fn(data);
  }

  // Which side is up: 0 until the tiles turn over, 1 after.
  get side() {
    return this.matches >= this.turnAt ? 1 : 0;
  }

  get sideName() {
    return this.sideNames[this.side];
  }

  // The faces showing.
  get faces() {
    return this.sides[this.side];
  }

  face(i) {
    return this.faces[i];
  }

  get turnAhead() {
    return this.sides.length > 1 && this.side === 0;
  }

  // The matches still to make before the tiles turn over: Infinity on a
  // board that never turns over, and 0 once it has.
  get untilTurn() {
    return Math.max(0, this.turnAt - this.matches);
  }

  // The face a tile will turn over to, for peeking, while that is to come.
  nextFace(i) {
    return this.turnAhead ? this.sides[1][i] : null;
  }

  // How many lost souls would wake if the tiles turned over now.
  soulsIfNow() {
    return this.turnAhead ? soulsAt(this.layout, this.sides[1], this.present).length : 0;
  }

  get won() {
    return this.left === 0;
  }

  // Nothing can be taken, and nothing more can go in the fridge.
  get stuck() {
    return this.left > 0 && this.pairs().length === 0 && !this.canSave();
  }

  // Free whatever lies on them: ghosts, when they float, tiles opened with a
  // skeleton key, lords, who leap, and on April Showers' May Day, wilted
  // flowers, the lost souls there. A tile floats only while its ghost face,
  // or its lost soul's, is up.
  loose(i, faces = this.faces) {
    return this.unlocked[i] === 1 || (this.lords !== null && this.lords[i] === 1) || (this.rules.ghostsFloat && faces[i] === GHOST) || (this.rules.soulsFloat && faces[i] === LOST);
  }

  // On the crown, whether a tile is a lord still on the board, and how many
  // lords are.
  isLord(i) {
    return this.lords !== null && this.lords[i] === 1 && this.present[i] === 1;
  }

  get lordsLeft() {
    let n = 0;
    if (this.lords) for (let i = 0; i < this.layout.count; i++) if (this.isLord(i)) n++;
    return n;
  }

  // On the bagpipes, whether a tile is a piper still on the board, and how
  // many pipers are.
  isPiper(i) {
    return this.pipers !== null && this.pipers[i] === 1 && this.present[i] === 1;
  }

  get pipersLeft() {
    let n = 0;
    if (this.pipers) for (let i = 0; i < this.layout.count; i++) if (this.isPiper(i)) n++;
    return n;
  }

  // On New Year's 9, whether a tile is a rocket still to be set off, or a
  // tile still on the board that a burst has lit; and how many rockets are
  // left.
  isRocket(i) {
    return this.rockets !== null && this.rockets[i] === 1 && this.present[i] === 1;
  }

  isLit(i) {
    return this.lit !== null && this.lit[i] === 1 && this.present[i] === 1;
  }

  get rocketsLeft() {
    let n = 0;
    if (this.rockets) for (let i = 0; i < this.layout.count; i++) if (this.isRocket(i)) n++;
    return n;
  }

  // On New Year's 8, the row at the top of the disco ball's band of light,
  // or -1 on a board without one; and whether a tile still on the board is
  // in the light.
  get lightTop() {
    return this.rules.disco ? lightAt(this.layout, this.matches, this.rules.disco) : -1;
  }

  inSpotlight(i) {
    return Boolean(this.rules.disco) && this.present[i] === 1 && inLight(this.layout, i, this.lightTop, this.rules.disco);
  }

  // The rockets in a pair just taken burst, lighting up the tiles round
  // them still on the board. Returns the tiles newly lit.
  burst(set) {
    const out = [];
    for (const t of set) {
      for (const i of sparksOf(this.layout, this.present, t)) {
        if (!this.lit[i]) {
          this.lit[i] = 1;
          out.push(i);
        }
      }
    }
    this.bursts += set.length;
    return out;
  }

  // A piper among a pair just taken plays: the rest of his kind still on
  // the board follow him out, from wherever they are. Returns the tiles that
  // followed.
  pipe(a, b) {
    const piper = this.pipers ? [a, b].find((t) => this.pipers[t] === 1) : undefined;
    if (piper === undefined) return [];
    const kind = MATCH[this.faces[piper]];
    const out = [];
    for (let i = 0; i < this.layout.count; i++) if (this.present[i] && MATCH[this.faces[i]] === kind) out.push(i);
    for (const i of out) this.present[i] = 0;
    this.left -= out.length;
    this.piped += out.length;
    if (out.length === 2) this.follow(out[0], out[1]);
    else if (out.length) this.forget();
    return out;
  }

  // How many more matches a tile needs before it thaws: 0 once it has, and
  // for a tile never frozen.
  thawIn(i) {
    return this.ice ? Math.max(0, this.ice[i] - this.matches) : 0;
  }

  frozen(i) {
    return this.thawIn(i) > 0;
  }

  // The ice still to thaw on every tile, as the solver and a shuffle want it.
  iceAhead() {
    return this.ice && Int16Array.from(this.ice, (t) => Math.max(0, t - this.matches));
  }

  // Free as the tiles lie, ice aside: nothing on it, and a side open.
  open(i) {
    return this.present[i] === 1 && (this.loose(i) || this.inWind(i) || isFree(this.layout, this.present, i));
  }

  // Free to be taken: open, not frozen, and out of the water.
  isFree(i) {
    return this.open(i) && !this.frozen(i) && !this.underWater(i);
  }

  // On the sandcastle, the rows the tide covers now, whether it's coming in
  // or going out, and the matches until it moves a row.
  get tideLevel() {
    return this.tideEvery ? tideAt(this.matches - this.tideFrom, this.tideEvery, this.tideHigh) : 0;
  }

  get tideComingIn() {
    return this.tideEvery > 0 && comingIn(this.matches - this.tideFrom, this.tideEvery, this.tideHigh);
  }

  get untilTide() {
    return this.tideEvery ? this.tideEvery - ((this.matches - this.tideFrom) % this.tideEvery) : Infinity;
  }

  // Whether a tile still on the board is under the water.
  underWater(i) {
    return this.tideEvery > 0 && this.present[i] === 1 && covered(this.rowsUp, this.tideLevel, i);
  }

  // With the tide in and nothing to take but what it covers, it goes out at
  // once, to come in again from here. Returns whether it went.
  ebb() {
    if (!this.tideEvery || this.left === 0 || this.tideLevel === 0 || this.pairs().length) return false;
    this.tideFrom = this.matches;
    return true;
  }

  // Whether the store is still open: the list can be crossed off until the
  // match at checkout has been made.
  get listOpen() {
    return Boolean(this.list) && this.matches < this.list.checkout;
  }

  // The matches still to make before checkout, that one included.
  get untilCheckout() {
    return this.list ? Math.max(0, this.list.checkout - this.matches) : 0;
  }

  // The kinds still on the list, not yet crossed off.
  get listLeft() {
    return this.list ? this.list.kinds.filter((k) => !this.crossed.includes(k)) : [];
  }

  // Whether a tile is one of the things still to find while the store is open.
  onList(i) {
    return this.listOpen && this.listLeft.includes(MATCH[this.faces[i]]);
  }

  // The fridge: whether a place is one of its containers; the first one
  // empty, or -1 when it is full; and how many are empty.
  inFridge(i) {
    return i >= this.tableCount;
  }

  emptySlot() {
    for (let s = this.tableCount; s < this.layout.count; s++) if (!this.present[s]) return s;
    return -1;
  }

  get fridgeRoom() {
    let room = 0;
    for (let s = this.tableCount; s < this.layout.count; s++) if (!this.present[s]) room++;
    return room;
  }

  // Whether a tile could go in the fridge now: a container empty, and a
  // free tile on the table to put in it.
  canSave() {
    return this.fridgeRoom > 0 && this.freeTiles().some((i) => !this.inFridge(i));
  }

  // Puts a free tile from the table in the fridge, in the first container
  // empty, to take with its partner later. Off the table, it holds nothing
  // down any more. A winning line still wins, taking the tile from the
  // fridge where it would have taken it from the table. Returns the
  // container, or -1 if the tile cannot go in.
  save(i) {
    const slot = this.emptySlot();
    if (slot < 0 || this.inFridge(i) || !this.isFree(i)) return -1;
    this.history.push({ type: 'save', tile: i, slot, line: this.line && this.line.slice(), outlook: this.outlook });
    for (const s of this.sides) s[slot] = s[i];
    this.present[i] = 0;
    this.present[slot] = 1;
    if (this.line) this.line = this.line.map(([a, b]) => [a === i ? slot : a, b === i ? slot : b]);
    this.emit('save', { tile: i, slot });
    this.settle();
    return slot;
  }

  // Doorbusters: whether a tile is one still to be had, and how many more
  // of the player's matches before another shopper grabs one.
  isBuster(i) {
    return Boolean(this.busters) && this.present[i] === 1 && this.busters.some((d) => d.state === 'open' && d.tiles.includes(i));
  }

  get untilGrab() {
    return this.busters ? this.busterEvery - (this.matches % this.busterEvery) : 0;
  }

  // Another shopper, after every so many of the player's matches, grabs the
  // first doorbuster still free, both its tiles at once. Its two tiles are a
  // pair the deal's order takes together, so the winning line keeps good.
  // Returns the doorbuster grabbed, or null.
  grab() {
    if (!this.busters || this.matches % this.busterEvery) return null;
    const d = this.busters.find((o) => o.state === 'open' && o.tiles.every((t) => this.isFree(t)));
    if (!d) return null;
    d.state = 'gone';
    const [x, y] = d.tiles;
    this.present[x] = this.present[y] = 0;
    this.left -= 2;
    this.follow(x, y);
    return d;
  }

  freeTiles() {
    const out = [];
    for (let i = 0; i < this.layout.count; i++) if (this.isFree(i)) out.push(i);
    return out;
  }

  canMatch(a, b) {
    return a !== b && this.isFree(a) && this.isFree(b) && MATCH[this.faces[a]] === MATCH[this.faces[b]];
  }

  // Every pair that could be taken now.
  pairs() {
    const free = this.freeTiles();
    const out = [];
    for (let p = 0; p < free.length; p++) {
      for (let q = p + 1; q < free.length; q++) {
        if (MATCH[this.faces[free[p]]] === MATCH[this.faces[free[q]]]) out.push([free[p], free[q]]);
      }
    }
    return out;
  }

  // Takes a pair. Returns { a, b, treat, turned, souls, thawed, crossed,
  // checkout, bought, grab, touchdown, lovebirds, flock, hatched, gold }: the
  // treat the pair left, if any; whether this match struck midnight, and if
  // it did, the tiles that woke as lost souls; the tiles this match thawed;
  // the kind it crossed off the list, or null; and whether it was the match
  // at checkout; whether it bought a doorbuster; the tiles of the doorbuster
  // another shopper grabbed after it, or null; whether it was a touchdown;
  // whether it was a pair of lovebirds; whether its two tiles touched, and
  // flocked together; the eggs that hatched as it freed them; the rings it
  // took the last of, turning them to gold; whether it followed on from the
  // pair before it, as a gosling, and made a brood; whether it was a swan, a
  // tile and its reflection, and how many swans it sent swimming off; how
  // many pails of fresh milk it took, how many it spilt, and how many soured
  // after it; and the dance after it, if the music changed: { swaps,
  // before }, the tiles that changed places and the faces before, or
  // sitOut, when no change of partners would have left a board that can be
  // won, and they kept them; how many lords in it leapt; the tiles that
  // followed a piper in it out; whether it was a lit pair, its two tiles
  // lit by a burst, the rockets in it, and the tiles their bursts lit;
  // whether it danced in the disco ball's light; the balloons it popped, and
  // the net that opened after it, if one did: { landed, floated }, the tiles
  // the new balloons dropped on and those the old ones floated away from;
  // whether it found the lucky coin, or else how close it came to it: 'hot',
  // 'warm' or 'cold', or null with no coin still to find; and the burning
  // sparklers it took, each { tile, left }, with the matches it had left to
  // burn, and the sparklers that went out and were lit after it, by their
  // tiles; whether it was a perfect match, two tiles that caught the same
  // colour of confetti; and whether it made the wish of the star crossing,
  // and whether another star was due after it, and the star that crossed,
  // or null where there was nowhere a wish could be made; whether the
  // glasses came together after it, for a toast; and whether it was love at
  // first sight, the couple Cupid's arrow struck taken together, or broke a
  // heart, taking one of them with another tile, and whether Cupid let fly
  // again after it: the couple his arrow struck, or null with none to
  // strike, and the couple still smitten before it, who got over it; on
  // April Showers' umbrella, the tiles the raindrops it caught were on, how
  // many drops dripped off the rim after it, and the drop that landed after
  // it, or null; on its rain boots, how high it splashed, its place in the
  // run, or 0 for no splash, and the run it let settle, or 0; on its
  // rainbow, the band whose colour it caught, or -1; on its seed tray, the
  // seedlings it watered and those that bloomed, and those it picked in
  // bloom or pulled up before; on its watering can, what it did to the can:
  // 'fill', 'full', 'pour', 'dry', or null; and on its flower bed, whether it
  // made honey, and the tulip the bee flew from after it, or -1; on the Start
  // of Spring's thaw, the tile a snowball landed on after it, or -1, and the
  // snowed tiles it knocked the snow off; and on its first robin, whether it
  // sang a note of the robin's song back, whether that sang the whole song,
  // whether it broke a song begun, and whether she sang a new song after it;
  // and on its kite, whether it caught the wind, a tile of it on the edge the
  // wind blows on, and where the wind blows from if it turned after it, or
  // -1; on its luck of the Irish, the tile of the clover it found, the tile
  // of one blown away after it, and the tile of one showing after it, each
  // -1 with none; on its spring cleaning, the rows it swept clean in turn
  // and those it cleared out of turn; and on its day and night, whether it
  // was an equinox pair, a tile from each half of the board. Null if the
  // pair cannot be taken.
  match(a, b) {
    if (!this.canMatch(a, b)) return null;
    const giving = this.treatFaces.includes(this.faces[a]);
    const listed = this.onList(a);
    const kind = MATCH[this.faces[a]];
    const entry = { type: 'match', a, b, kind, giving, line: this.line && this.line.slice(), outlook: this.outlook };
    // On a board of turtle doves, a pair of the same kind as the match just
    // before it is a pair of lovebirds: a kind's two pairs, one straight
    // after the other.
    const before = this.lastMatch();
    const lovebirds = this.rules.lovebirds && before !== null && before.kind === kind;
    if (lovebirds) {
      this.lovebirds++;
      entry.lovebirds = true;
    }
    // On the Start of Spring's day and night, a pair with a tile from each
    // half of the board, day and night together, is an equinox pair.
    const equinoxPair = this.rules.equinox && isEquinox(this.layout, a, b);
    if (equinoxPair) {
      this.equinoxPairs++;
      entry.equinox = true;
    }
    // On a board of songbirds, a pair whose two tiles touch flocks together.
    const flocked = this.rules.flock && touching(this.layout, a, b);
    if (flocked) {
      this.flocks++;
      entry.flock = true;
    }
    // On the board of geese, a pair taken beside or under the pair before it
    // follows on, as goslings follow their mother: so many in a line make a
    // brood, and a new line starts from the pair that made it.
    const gosling = Boolean(this.rules.goslings) && before !== null && followsOn(this.layout, [before.a, before.b], [a, b]);
    let brood = false;
    if (this.rules.goslings) {
      entry.trail = this.trail; // the line as it was, for an undo
      this.trail = gosling ? this.trail + 1 : 0;
      if (this.trail === this.rules.goslings) {
        brood = true;
        entry.brood = true;
        this.broods++;
        this.trail = 0;
      }
    }
    // On the crown, a lord taken while still held down by the usual rule
    // has leapt.
    const leapt = [a, b].filter((t) => this.isLord(t) && !isFree(this.layout, this.present, t)).length;
    if (leapt) {
      this.leaps += leapt;
      entry.leaps = leapt;
    }
    // On the milk pail, a fresh pail's two tiles taken together take the
    // pail; either taken with another tile spills it.
    if (this.pails) entry.pails = this.pails.map((p) => ({ ...p, tiles: p.tiles.slice() })); // as they were, for an undo
    const fresh = this.pails ? this.pails.filter((p) => p.state === 'fresh') : [];
    const milked = fresh.filter((p) => p.tiles.includes(a) && p.tiles.includes(b));
    const spilt = fresh.filter((p) => p.tiles.includes(a) !== p.tiles.includes(b));
    for (const p of milked) p.state = 'taken';
    for (const p of spilt) p.state = 'spilt';
    // On the lake, a tile and its own reflection that match are a swan:
    // taken together, she's found; a swan one of whose tiles goes with
    // another swims off.
    let swan = false;
    let swamOff = 0;
    if (this.swans) {
      entry.swans = this.swans; // as they were, for an undo
      swan = this.swans.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
      const left = this.swans.filter(([x, y]) => x !== a && x !== b && y !== a && y !== b);
      swamOff = this.swans.length - left.length - (swan ? 1 : 0);
      this.swans = left;
      if (swan) {
        this.swansFound++;
        entry.swan = true;
      }
    }
    if (listed) {
      entry.crossed = MATCH[this.faces[a]];
      this.crossed.push(entry.crossed);
    }
    // A pair with a tile of an open doorbuster in it buys that doorbuster.
    const bought = this.busters ? this.busters.filter((d) => d.state === 'open' && (d.tiles.includes(a) || d.tiles.includes(b))) : [];
    for (const d of bought) d.state = 'mine';
    if (bought.length) entry.bought = bought;
    // A pair with a tile in each end zone is a touchdown.
    const touchdown = Boolean(this.zones) && isTouchdown(this.zones, a, b);
    if (touchdown) {
      this.touchdowns++;
      entry.touchdown = true;
    }
    // On New Year's 8, a pair taken with both its tiles in the disco ball's
    // light dances in the spotlight.
    const spotlight = this.inSpotlight(a) && this.inSpotlight(b);
    if (spotlight) {
      this.spotlights++;
      entry.spotlight = true;
    }
    // On Valentine's box of chocolates, a top taken bites into its
    // chocolate; the chocolate bitten into, its last tiles taken, is
    // savoured, and one bitten into before it is, is just eaten.
    let ate = null;
    if (this.chocolates) {
      entry.chocolates = this.chocolateStates; // as they were, for an undo
      ate = eat(this.chocolates, this.chocolateStates, [a, b], (t) => !this.present[t] || t === a || t === b);
      this.chocolateStates = ate.states;
    }
    // On Valentine's hugs and kisses, a pair from the X is a kiss and from
    // the O a hug: taken in turn, four in a row make an XOXO, and the run
    // starts again; two of a kind together, or a pair with a tile in each
    // letter, start it again.
    const letter = this.xoxo ? pairLetter(this.layout, a, b, this.xoxo.split) : null;
    let xoxoMade = false;
    let runBroke = false;
    if (this.xoxo) {
      entry.xoxo = { run: this.run, made: this.xoxos }; // as they were, for an undo
      const step = runOn(this.run, letter);
      xoxoMade = step.xoxo;
      runBroke = !xoxoMade && this.run.length >= 2 && step.run.length <= 1;
      this.run = step.run;
      if (xoxoMade) this.xoxos++;
    }
    // On April Showers' rain boots, a pair from the puddle is a splash, one
    // higher than the one before it while a run goes on; a pair with a tile
    // anywhere else lets the puddle settle, and the run starts again.
    let splashed = 0;
    let settled = 0;
    if (this.puddleEdge !== null) {
      entry.splash = { run: this.splashRun, count: this.splashCount, heights: this.splashHeights, best: this.splashBest }; // as they were, for an undo
      const run = runAfter(this.splashRun, isSplash(this.layout, a, b, this.puddleEdge));
      if (run) {
        splashed = run;
        this.splashCount++;
        this.splashHeights += run;
        this.splashBest = Math.max(this.splashBest, run);
      } else settled = this.splashRun;
      this.splashRun = run;
    }
    // On April Showers' rainbow, a pair from the band lit catches its colour.
    const colour = this.colourClouds !== null && inColour(this.layout, a, b, this.colourClouds, litBand(this.matches)) ? litBand(this.matches) : -1;
    if (colour >= 0) {
      this.coloursCaught++;
      entry.colour = true;
    }
    // On April Showers' seed tray, a pair with a tile touching a seedling
    // waters it, and one watered enough blooms; a seedling taken in bloom is
    // picked, and one taken before is pulled up.
    const watered = [];
    const blossomed = [];
    const picked = [];
    const pulled = [];
    if (this.garden) {
      entry.garden = { water: this.water.slice(), taken: this.seedlingsTaken.slice() }; // as they were, for an undo
      this.garden.seedlings.forEach((s, k) => {
        if (this.seedlingsTaken[k]) return;
        if (s === a || s === b) {
          this.seedlingsTaken[k] = this.bloomed(k) ? 'picked' : 'pulled';
          (this.bloomed(k) ? picked : pulled).push(s);
        } else if (waters(this.layout, s, a, b)) {
          this.water[k]++;
          watered.push(s);
          if (this.water[k] === this.garden.drinks) blossomed.push(s);
        }
      });
    }
    // On April Showers' watering can, a pair from its body fills it a
    // measure, if there's room, and a pair of its drops pours one out, if
    // there's water in it.
    // On April Showers' flower bed, a pair with the tulip the bee is on
    // makes honey.
    const honey = this.bee !== null && makesHoney(this.tulips, this.bee, a, b);
    if (this.bee) entry.bee = { ...this.bee, honey: this.honey }; // as it was, for an undo
    if (honey) this.honey++;
    const poured = this.can ? pairDoes(this.layout, a, b, this.can, this.canLevel, this.canMost) : null;
    if (poured) {
      entry.can = { level: this.canLevel, fills: this.fills, pours: this.pours, dry: this.dryPours }; // as they were, for an undo
      if (poured === 'fill') {
        this.canLevel++;
        this.fills++;
      } else if (poured === 'pour') {
        this.canLevel--;
        this.pours++;
      } else if (poured === 'dry') this.dryPours++;
    }
    // On Valentine's first date, a pair with a tile in each candle's glow,
    // one by his candle and one by hers, is a candlelit pair.
    const byCandlelight = Boolean(this.candles) && candlelit(this.layout, a, b, this.glowTop, this.candles.deep);
    if (byCandlelight) {
      this.candlelitPairs++;
      entry.candlelit = true;
    }
    // On New Year's 9, a pair whose two tiles a burst has lit is a lit pair.
    const litPair = this.isLit(a) && this.isLit(b);
    if (litPair) {
      this.litPairs++;
      entry.litPair = true;
    }
    const rockets = this.rockets ? [a, b].filter((t) => this.rockets[t] === 1) : [];
    // On New Year's 3, a pair with both its tiles in the row of the star
    // crossing makes its wish.
    if (this.starEvery) entry.stars = { star: this.star && { ...this.star }, count: this.starCount, wishes: this.wishes }; // as they were, for an undo
    const wish = this.inStarRow(a) && this.inStarRow(b);
    if (wish) {
      this.star.wished = true;
      this.wishes++;
    }
    // On Valentine's pierced heart, the smitten couple taken together is
    // love at first sight; either taken with another tile, a broken heart.
    if (this.arrowEvery) entry.cupid = { couple: this.couple && { ...this.couple, tiles: this.couple.tiles.slice() }, flown: this.arrowsFlown, loves: this.loves, heartbreaks: this.heartbreaks }; // as they were, for an undo
    const love = this.isSmitten(a) && this.isSmitten(b);
    const heartbreak = !love && (this.isSmitten(a) || this.isSmitten(b));
    if (love) {
      this.couple.state = 'love';
      this.loves++;
    } else if (heartbreak) {
      this.couple.state = 'broken';
      this.heartbreaks++;
    }
    // On Valentine's envelope, the pair with half of a message begins it;
    // the pair with its other half, taken as the very next match, says it,
    // and anything else taken first leaves it unsaid.
    let said = null;
    let unsaid = null;
    let begun = null;
    if (this.messages) {
      entry.messages = this.messages.map((m) => ({ ...m, tiles: m.tiles.slice() })); // as they were, for an undo
      const open = this.messages.find((m) => m.state === 'begun');
      const half = this.heartOf(a) || this.heartOf(b);
      if (open && half && half.message === open) {
        open.state = 'said';
        said = open;
      } else {
        if (open) {
          open.state = 'unsaid';
          unsaid = open;
        }
        if (half) {
          half.message.state = 'begun';
          half.message.first = half.half;
          begun = half.message;
        }
      }
    }
    // On Valentine's vase of roses, a rose taken in bloom joins the bouquet,
    // and one taken in bud is wasted; a wilted rose is just a tile.
    const gathered = [];
    const wasted = [];
    if (this.roses) {
      const taken = [a, b].map((t) => this.roses.indexOf(t)).filter((k) => k >= 0);
      for (const k of taken) {
        const state = this.roseState(k);
        if (state === 'bloom') gathered.push(this.roses[k]);
        if (state === 'bud') wasted.push(this.roses[k]);
        this.rosesTaken[k] = this.matches + 1;
      }
      if (taken.length) entry.roses = taken; // for an undo
    }
    // On New Year's 4, two tiles that caught the same colour of confetti,
    // taken together, are a perfect match.
    const perfect = Boolean(this.confetti) && this.confetti[a] >= 0 && this.confetti[a] === this.confetti[b];
    if (perfect) {
      this.perfects++;
      entry.perfect = true;
    }
    // On New Year's 6, a balloon on a tile taken pops.
    const pops = [a, b].filter((t) => this.hasBalloon(t));
    // On New Year's 5, a burning sparkler in the pair is taken, with what is
    // left of it to burn; one never lit goes out with its tile.
    const sparked = [];
    if (this.sparklers) {
      entry.sparklers = this.sparklers.map((s) => ({ ...s })); // as they were, for an undo
      for (const t of [a, b]) {
        const s = this.sparklerOf(t);
        if (!s) continue;
        if (s.state === 'lit') {
          s.left = this.burnLeft(s);
          s.state = 'taken';
          sparked.push({ tile: t, left: s.left });
        } else s.state = 'out';
      }
    }
    // On April Showers' umbrella, a pair with the tile a raindrop is on
    // catches it; then the drops still running run on a place down their
    // ribs, those past the rim drip off, and every so many matches another
    // lands on the peak.
    const rain = this.rain ? rainOn(this.rain.ribs, this.rain.every, this.seed, this.raindrops, this.present, this.matches, [a, b]) : null;
    if (rain) {
      entry.raindrops = this.raindrops; // as they were, for an undo
      this.raindrops = rain.drops;
    }
    // On the thaw, the snow as it was, for an undo, and the tiles snowed in.
    const snowedBefore = this.snowEvery ? this.snowedTiles() : [];
    if (this.snowEvery) entry.snow = { ice: Int16Array.from(this.ice), landed: this.snowLanded, knocked: this.snowKnocked };
    if (this.robin) entry.robin = this.robin; // as she was, for an undo
    // On the Start of Spring's kite, a pair with a tile on the edge the wind
    // blows on catches the wind.
    const caughtWind = this.windEvery > 0 && catches(this.upwind, this.windFrom, this.present, a, b);
    if (caughtWind) {
      this.windCaught++;
      entry.caughtWind = true;
    }
    // On its luck of the Irish, a pair with the clover's tile, the clover
    // showing, is a stroke of luck.
    const lucky = this.clover !== null && this.clover.shownAt !== null && (a === this.clover.tile || b === this.clover.tile);
    if (this.cloverWithin) entry.clover = { clover: this.clover, hidden: this.cloversHidden, found: this.cloversFound, lost: this.cloversLost }; // as it was, for an undo
    if (this.tideEvery) entry.tideFrom = this.tideFrom; // as it was, for an undo
    this.present[a] = this.present[b] = 0;
    this.left -= 2;
    this.matches++;
    // On the Start of Spring's first robin, the robin hears the pair: her
    // next note sung back, or one of her kinds out of turn, breaking a song
    // begun; and she sings a new song once one is sung back, or can't be.
    const heard = this.robin ? hear(this.robin, kind, this.kindsLeft(), this.seed) : null;
    if (heard) this.robin = heard.robin;
    // On its spring cleaning, the rows it empties, swept in turn or cleared
    // out of turn.
    const cleaned = this.sweepRows ? emptied(this.sweepRows.rows, this.sweepRows.rowOf, this.present, a, b) : null;
    if (cleaned && (cleaned.swept.length || cleaned.out.length)) {
      entry.rows = Int8Array.from(this.rowsSwept); // as they were, for an undo
      for (const r of cleaned.swept) this.rowsSwept[r] = 1;
      for (const r of cleaned.out) this.rowsSwept[r] = -1;
    }
    // And on its kite, every so many matches the wind turns.
    const windTurned = this.windEvery > 0 && this.left > 0 && this.matches % this.windEvery === 0 ? this.windFrom : -1;
    // On the beach season's sandcastle, the tide coming in a row, or going
    // out one.
    const tideWas = this.tideEvery ? tideAt(this.matches - 1 - this.tideFrom, this.tideEvery, this.tideHigh) : 0;
    const tideMoved = this.tideEvery > 0 && this.left > 0 && this.tideLevel !== tideWas ? (this.tideLevel > tideWas ? 'in' : 'out') : null;
    // On its flower bed, the bee flies on to another tulip.
    const flew = this.bee ? this.bee.at : -1;
    if (this.bee) this.bee = flyOn(this.tulips, this.bee, this.present, this.seed);
    // A rocket in the pair bursts, lighting up the tiles round it.
    let lit = [];
    if (rockets.length) {
      entry.litBefore = this.lit.slice(); // as they were, for an undo
      entry.rockets = rockets.length;
      lit = this.burst(rockets);
    }
    if (this.matches === this.turnAt) entry.souls = this.wake();
    this.history.push(entry);
    this.follow(a, b);
    // On the Start of Spring's thaw, a pair taken beside a snowed tile knocks
    // its snow off, and every so many matches another snowball lands.
    let knocked = [];
    let snowball = -1;
    if (this.snowEvery) {
      knocked = knocks(this.layout, snowedBefore, a, b);
      for (const t of knocked) this.ice[t] = this.matches;
      this.snowKnocked += knocked.length;
      if (this.left > 0 && this.matches % this.snowEvery === 0) snowball = this.snowOn();
    }
    // On its luck of the Irish, the clover found, or blown away once it has
    // kept as long as it does, another hides; the tile the clover hides on,
    // come free, shows it; and one hidden too long, its tile not coming
    // free, hides elsewhere, unseen.
    let cloverFound = -1;
    let cloverLost = -1;
    let cloverShown = -1;
    if (this.cloverWithin) {
      if (lucky) {
        cloverFound = this.clover.tile;
        this.cloversFound++;
        this.hideClover();
      } else if (this.clover && this.clover.shownAt !== null && this.matches - this.clover.shownAt >= this.cloverWithin) {
        cloverLost = this.clover.tile;
        this.cloversLost++;
        this.hideClover();
      }
      if (this.clover && this.clover.shownAt === null && this.isFree(this.clover.tile)) {
        this.clover = { ...this.clover, shownAt: this.matches };
        cloverShown = this.clover.tile;
      } else if (this.clover && this.clover.shownAt === null && this.matches - this.clover.hidAt >= RESTLESS) this.hideClover();
    }
    // On the bagpipes, a piper plays, and the rest of his kind follow him.
    const followers = this.pipe(a, b);
    if (followers.length) entry.followers = followers;
    const grab = this.grab();
    if (grab) entry.grab = grab;
    const gold = this.gild();
    if (gold.length) entry.gold = gold;
    const soured = this.age();
    // On New Year's 6, the balloons popped go, and every so many matches a
    // net opens: the balloons left float away, and more drop.
    const netDue = Boolean(this.balloons) && this.left > 0 && this.matches % this.drops.every === 0;
    if (pops.length || netDue) entry.balloons = { on: this.balloons.slice(), nets: this.nets, dropped: this.dropped, popped: this.popped, floated: this.floated }; // as they were, for an undo
    for (const t of pops) this.balloons[t] = 0;
    this.popped += pops.length;
    const net = netDue ? this.dropBalloons() : null;
    // On New Year's 7, the lucky coin is found as its tile comes free; until
    // then, each pair says how close it came.
    const seeking = this.coin >= 0 && !this.foundAt;
    const found = seeking && this.isFree(this.coin);
    let heat = null;
    if (seeking) {
      entry.reading = this.reading; // as it was, for an undo
      if (found) {
        this.foundAt = this.matches;
        entry.found = true;
      } else heat = this.reading = heatOf(this.layout, [a, b], this.coin, this.coinRules);
    }
    // On New Year's 5, sparklers that have burnt as long as they can go out,
    // and those whose tiles have come free are lit.
    const fizzled = this.sparklers ? this.burnOut() : [];
    const kindled = this.sparklers ? this.kindle() : [];
    // On New Year's Day, a sweet taken in January breaks the resolution,
    // and a match that sees January out without one keeps it.
    let gaveIn = false;
    let keptMonth = false;
    if (this.sweets && !this.brokenAt && this.matches <= this.january) {
      if (this.sweets[a] || this.sweets[b]) {
        this.brokenAt = this.matches;
        entry.gaveIn = true;
        gaveIn = true;
      } else if (this.matches === this.january) keptMonth = true;
    }
    // On New Year's 2, the glasses glide on toward each other where their
    // way is clear, and clink as they come together.
    let toasted = false;
    if (this.path && !this.toastAt) {
      entry.glasses = this.glasses; // as they were, for an undo
      this.glasses = glide(this.layout, this.present, this.path, this.glasses);
      if (together(this.glasses)) {
        this.toastAt = this.matches;
        toasted = true;
      }
    }
    // On New Year's 3, every so many matches another star crosses.
    const starDue = Boolean(this.starEvery) && this.left > 0 && this.matches % this.starEvery === 0;
    const star = starDue ? this.shootStar() : null;
    // On Valentine's pierced heart, every so many matches Cupid lets fly
    // again, and a couple still smitten gets over it.
    const arrowDue = Boolean(this.arrowEvery) && this.left > 0 && this.matches % this.arrowEvery === 0;
    const overIt = arrowDue && this.couple !== null && this.couple.state === 'smitten' ? this.couple.tiles.slice() : null;
    const arrow = arrowDue ? this.letFly() : null;
    // On Valentine's first date, every so many matches the candles burn
    // down and their glow sinks a row toward the table, until they gutter
    // out.
    const burnt = Boolean(this.candles) && this.left > 0 && this.matches % this.candles.every === 0 && glowTop(this.layout, this.matches - 1, this.candles) >= 0;
    const guttered = burnt && this.glowTop < 0;
    // On Valentine's vase of roses, every so many matches another rose
    // opens, from the top down, and one left in bloom too long wilts.
    const opened = this.roses ? this.roses.filter((t, k) => this.present[t] && opensAt(k, this.bloom.every) === this.matches) : [];
    const wilted = this.roses ? this.roses.filter((t, k) => this.present[t] && opensAt(k, this.bloom.every) + this.bloom.lasts === this.matches) : [];
    // On the board of the dancer, every so many matches the music changes,
    // and the free tiles change partners.
    const due = Boolean(this.rules.dance) && this.left > 0 && this.matches % this.rules.dance === 0;
    const danced = due ? this.dance() : null;
    if (danced) entry.dance = danced;
    const sitOut = due && !danced && this.canDance; // no change of partners would leave a board that can be won
    let treat = null;
    if (giving) {
      this.treatPairs++;
      if (this.treatPairs > this.treatPairsBest) {
        this.treatPairsBest = this.treatPairs;
        if (this.rules.treats) {
          treat = this.treatR.pick(TREATS);
          this.treats[treat]++;
        }
      }
    }
    const turned = Boolean(entry.souls);
    // On the thaw, with nothing left to take but what the snow holds, the sun
    // melts it at once, so that the board never sticks on the snow.
    if (this.snowEvery && this.left > 0 && !this.pairs().length) for (const t of this.snowedTiles()) this.ice[t] = this.matches;
    const thawed = [];
    if (this.ice) for (let i = 0; i < this.layout.count; i++) if (this.present[i] && this.ice[i] === this.matches && !knocked.includes(i)) thawed.push(i);
    const checkout = Boolean(this.list) && this.matches === this.list.checkout;
    const hatched = this.hatch();
    const result = {
      a,
      b,
      treat,
      turned,
      souls: turned ? entry.souls.map(([t]) => t) : [],
      thawed,
      crossed: listed ? entry.crossed : null,
      checkout,
      bought: bought.length > 0,
      grab: grab ? grab.tiles.slice() : null,
      touchdown,
      lovebirds,
      flock: flocked,
      hatched,
      gold,
      gosling,
      brood,
      swan,
      swamOff,
      milked: milked.length,
      soured: soured.length,
      spilt: spilt.length,
      dance: danced && { swaps: danced.swaps, before: danced.sides[this.side] },
      sitOut,
      leapt,
      piped: followers,
      litPair,
      rockets,
      lit,
      spotlight,
      popped: pops,
      net,
      found,
      heat,
      sparked,
      kindled,
      fizzled,
      perfect,
      wish,
      star,
      starDue,
      toasted,
      gaveIn,
      keptMonth,
      love,
      heartbreak,
      arrowDue,
      arrow: arrow && arrow.tiles.slice(),
      overIt,
      said: said && said.words.slice(),
      unsaid: unsaid && unsaid.words.slice(),
      begun: begun && { words: begun.words.slice(), first: begun.first, next: begun.tiles[1 - begun.first] },
      gathered,
      wasted,
      opened,
      wilted,
      byCandlelight,
      sank: burnt && !guttered,
      guttered,
      bitten: ate ? ate.bitten : [],
      savoured: ate ? ate.savoured : -1,
      eaten: ate ? ate.eaten : [],
      kiss: letter,
      xoxoMade,
      runBroke,
      catches: rain ? rain.caught.map((c) => c.tile) : [],
      drips: rain ? rain.dripped.length : 0,
      newDrop: rain ? rain.landed : null,
      splashed,
      settled,
      colour,
      watered,
      blossomed,
      picked,
      pulled,
      canDoes: poured,
      honey,
      beeFrom: flew >= 0 ? this.tulips[flew] : -1,
      snowball,
      knocked,
      songNote: Boolean(heard && heard.note),
      songSung: Boolean(heard && heard.sung),
      songBroke: Boolean(heard && heard.broke),
      newSong: Boolean(heard && heard.fresh),
      caughtWind,
      windTurned,
      tideMoved,
      cloverFound,
      cloverLost,
      cloverShown,
      swept: cleaned ? cleaned.swept : [],
      sweptOut: cleaned ? cleaned.out : [],
      equinoxPair,
    };
    this.emit('match', result);
    if (thawed.length) this.emit('thaw', result);
    if (listed) this.emit('list', result);
    if (checkout) this.emit('checkout', result);
    if (bought.length) this.emit('bought', result);
    if (grab) this.emit('grab', result);
    if (touchdown) this.emit('touchdown', result);
    if (lovebirds) this.emit('lovebirds', result);
    if (flocked) this.emit('flock', result);
    if (hatched.length) this.emit('hatch', result);
    if (gold.length) this.emit('gold', result);
    if (gosling) this.emit('gosling', result);
    if (swan || swamOff) this.emit('swan', result);
    if (milked.length || soured.length || spilt.length) this.emit('milk', result);
    if (danced || sitOut) this.emit('dance', result);
    if (leapt) this.emit('leap', result);
    if (followers.length) this.emit('pipe', result);
    if (litPair || rockets.length) this.emit('firework', result);
    if (spotlight) this.emit('spotlight', result);
    if (pops.length || net) this.emit('balloon', result);
    if (seeking) this.emit('coin', result);
    if (sparked.length || kindled.length || fizzled.length) this.emit('sparkler', result);
    if (perfect) this.emit('confetti', result);
    if (wish || starDue) this.emit('star', result);
    if (toasted) this.emit('toast', result);
    if (love || heartbreak || arrowDue) this.emit('arrow', result);
    if (said || unsaid || begun) this.emit('message', result);
    if (gathered.length || wasted.length || opened.length || wilted.length) this.emit('rose', result);
    if (byCandlelight || burnt) this.emit('candlelight', result);
    if (ate && (ate.bitten.length || ate.savoured >= 0 || ate.eaten.length)) this.emit('chocolate', result);
    if (xoxoMade || runBroke) this.emit('xoxo', result);
    if (rain && (rain.caught.length || rain.dripped.length || rain.landed)) this.emit('rain', result);
    if (splashed || settled) this.emit('splash', result);
    if (colour >= 0) this.emit('colour', result);
    if (watered.length || picked.length || pulled.length) this.emit('garden', result);
    if (poured) this.emit('can', result);
    if (this.tulips && flew >= 0) this.emit('bee', result);
    if (snowball >= 0 || knocked.length) this.emit('snow', result);
    if (heard && (heard.note || heard.broke || heard.fresh)) this.emit('song', result);
    if (caughtWind || windTurned >= 0) this.emit('wind', result);
    if (tideMoved) this.emit('tide', result);
    if (cloverFound >= 0 || cloverLost >= 0 || cloverShown >= 0) this.emit('clover', result);
    if (cleaned && (cleaned.swept.length || cleaned.out.length)) this.emit('sweep', result);
    if (equinoxPair) this.emit('equinox', result);
    if (gaveIn || keptMonth) this.emit('resolution', result);
    if (turned) this.emit('turn', result);
    if (treat) this.emit('treat', result);
    this.settle();
    return result;
  }

  // The tiles turn over. Returns the tiles that woke as lost souls, with the
  // faces they had, so that undo can put them back.
  wake() {
    const next = this.sides[1];
    return soulsAt(this.layout, next, this.present).map((t) => {
      const had = next[t];
      next[t] = LOST;
      return [t, had];
    });
  }

  // Takes back the last match, shuffle or tile put in the fridge, and the
  // winning line known before it; a match that struck midnight turns the
  // tiles back again. Treats stay: undo never takes one back, and a turned
  // key stays turned.
  undo() {
    const last = this.history.pop();
    if (!last) return null;
    if (last.type === 'match') {
      if (last.souls) for (const [t, had] of last.souls) this.sides[1][t] = had;
      this.present[last.a] = this.present[last.b] = 1;
      this.left += 2;
      this.matches--;
      if (last.giving) this.treatPairs--;
      if (last.crossed !== undefined) this.crossed.pop();
      if (last.grab) {
        last.grab.state = 'open';
        for (const t of last.grab.tiles) this.present[t] = 1;
        this.left += 2;
      }
      if (last.bought) for (const d of last.bought) d.state = 'open';
      if (last.touchdown) this.touchdowns--;
      if (last.lovebirds) this.lovebirds--;
      if (last.flock) this.flocks--;
      if (last.gold) for (const k of last.gold) this.rings[k].gold = false;
      if (last.trail !== undefined) this.trail = last.trail;
      if (last.brood) this.broods--;
      if (last.swans) this.swans = last.swans;
      if (last.swan) this.swansFound--;
      if (last.pails) this.pails = last.pails;
      if (last.dance) this.sides = last.dance.sides;
      if (last.leaps) this.leaps -= last.leaps;
      if (last.followers) {
        for (const t of last.followers) this.present[t] = 1;
        this.left += last.followers.length;
        this.piped -= last.followers.length;
      }
      if (last.litPair) this.litPairs--;
      if (last.spotlight) this.spotlights--;
      if (last.candlelit) this.candlelitPairs--;
      if (last.chocolates) this.chocolateStates = last.chocolates;
      if (last.xoxo) Object.assign(this, { run: last.xoxo.run, xoxos: last.xoxo.made });
      if (last.balloons) Object.assign(this, { balloons: last.balloons.on, nets: last.balloons.nets, dropped: last.balloons.dropped, popped: last.balloons.popped, floated: last.balloons.floated });
      if (last.found) this.foundAt = 0;
      if ('reading' in last) this.reading = last.reading;
      if (last.sparklers) this.sparklers = last.sparklers;
      if (last.perfect) this.perfects--;
      if (last.stars) Object.assign(this, { star: last.stars.star, starCount: last.stars.count, wishes: last.stars.wishes });
      if (last.cupid) Object.assign(this, { couple: last.cupid.couple, arrowsFlown: last.cupid.flown, loves: last.cupid.loves, heartbreaks: last.cupid.heartbreaks });
      if (last.messages) this.messages = last.messages;
      if (last.roses) for (const k of last.roses) this.rosesTaken[k] = 0;
      if (last.glasses) {
        this.glasses = last.glasses;
        this.toastAt = 0;
      }
      if (last.gaveIn) this.brokenAt = 0;
      if (last.raindrops) this.raindrops = last.raindrops;
      if (last.splash) Object.assign(this, { splashRun: last.splash.run, splashCount: last.splash.count, splashHeights: last.splash.heights, splashBest: last.splash.best });
      if (last.colour) this.coloursCaught--;
      if (last.garden) Object.assign(this, { water: last.garden.water, seedlingsTaken: last.garden.taken });
      if (last.can) Object.assign(this, { canLevel: last.can.level, fills: last.can.fills, pours: last.can.pours, dryPours: last.can.dry });
      if (last.bee) {
        const { honey, ...bee } = last.bee;
        Object.assign(this, { bee, honey });
      }
      if (last.robin) this.robin = last.robin;
      if (last.caughtWind) this.windCaught--;
      if (last.clover) Object.assign(this, { clover: last.clover.clover, cloversHidden: last.clover.hidden, cloversFound: last.clover.found, cloversLost: last.clover.lost });
      if (last.rows) this.rowsSwept = last.rows;
      if (last.equinox) this.equinoxPairs--;
      if (last.tideFrom !== undefined) this.tideFrom = last.tideFrom;
      if (last.snow) {
        this.ice.set(last.snow.ice);
        this.snowLanded = last.snow.landed;
        this.snowKnocked = last.snow.knocked;
      }
      if (last.litBefore) {
        this.lit = last.litBefore;
        this.bursts -= last.rockets;
      }
    } else if (last.type === 'save') {
      this.present[last.slot] = 0; // out of the fridge, and back on the table
      this.present[last.tile] = 1;
    } else {
      this.sides = last.sides;
      if (last.busterTiles) this.busters.forEach((d, k) => (d.tiles = last.busterTiles[k]));
      if (last.swans) this.swans = last.swans;
      if (last.pails) this.pails = last.pails;
      if (last.confetti) this.confetti = last.confetti;
      if (last.couple) this.couple = last.couple;
      if (last.messages) this.messages = last.messages;
      if (last.tideFrom !== undefined) this.tideFrom = last.tideFrom;
    }
    this.line = last.line;
    this.outlook = last.outlook;
    this.emit('undo', last);
    return last;
  }

  // The pair to take next: the next step of a winning line when one is found
  // in time, or else the free pair that holds up the most. Null when nothing
  // can be taken. hint() is the one the player pays for. A board found lost
  // stays lost whatever is taken, so it is not searched again.
  suggest() {
    this.wayAhead();
    if (this.line && this.line.length) return this.line[0];
    const W = this.layout.weight;
    let best = null;
    for (const p of this.pairs()) if (!best || W[p[0]] + W[p[1]] > W[best[0]] + W[best[1]]) best = p;
    return best;
  }

  // The hints' way through the board from here: the winning line kept, or
  // one found now; null when none is found. On Valentine's envelope it is
  // kept to a way that says the messages still to say, where one does; on
  // the vase of roses to one that gathers the roses still to gather; on the
  // first date to one that takes a candlelit pair whenever it can; on the
  // box of chocolates to one that savours the chocolates still to eat; on
  // hugs and kisses to one that carries the run of kisses and hugs on; on
  // April Showers' umbrella to one that catches a raindrop whenever it can;
  // on its rain boots to one that keeps the puddle till last, to splash
  // through it in one run; on its rainbow to one that catches the colour
  // lit whenever it can; on its seed tray to one that picks each seedling
  // in bloom; on its watering can to one that pours with water in it; on
  // its flower bed to one that makes honey whenever it can; on the Start of
  // Spring's thaw to one that knocks snow off when it can; on its first
  // robin to one that sings her song back; on its kite to one that catches
  // the wind when it can; on its luck of the Irish to one that takes the
  // four-leaf clover while it keeps; on its spring cleaning to one that
  // sweeps from the top down; and on its day and night to one that takes an
  // equinox pair when it can.
  wayAhead() {
    if (!this.line && this.outlook !== 'lost') {
      const { result, line } = solve(this.layout, this.position(), { budget: 20000 });
      this.outlook = result;
      this.line = result === 'win' ? line : null;
    }
    if (this.line && this.messages) {
      const free = (p, t) => p[t] === 1 && (this.loose(t) || isFree(this.layout, p, t));
      this.line = mend(this.line, this.messages, { present: this.present, free, kindOf: (t) => MATCH[this.faces[t]], holds: (l) => this.holds(l) });
    }
    if (this.line && this.roses) {
      const free = (p, t) => p[t] === 1 && (this.loose(t) || isFree(this.layout, p, t));
      const board = { L: this.layout, present: this.present, free, kindOf: (t) => MATCH[this.faces[t]], holds: (l) => this.holds(l), matches: this.matches, roses: this.roses, ...this.bloom };
      this.line = gather(this.line, board) || this.line;
    }
    if (this.line && this.candles) this.line = this.byCandlelight(this.line);
    if (this.line && this.rain) this.line = this.byRaindrops(this.line);
    if (this.line && this.puddleEdge !== null) this.line = this.savePuddle(this.line);
    if (this.line && this.colourClouds !== null) this.line = this.byColour(this.line);
    if (this.line && this.garden) this.line = this.tend(this.line);
    if (this.line && this.can) this.line = this.pourWell(this.line);
    if (this.line && this.tulips) this.line = this.forage(this.line);
    if (this.line && this.snowEvery) this.line = this.knockFirst(this.line);
    if (this.line && this.robin) this.line = this.singAlong(this.line);
    if (this.line && this.windEvery) this.line = this.catchWind(this.line);
    if (this.line && this.cloverWithin) this.line = this.pickClover(this.line);
    if (this.line && this.sweepRows) this.line = this.sweepDown(this.line);
    if (this.line && this.rules.equinox) this.line = this.meetHalfway(this.line);
    if (this.line && this.xoxo) this.line = this.carryOn(this.line);
    if (this.line && this.chocolates) {
      const free = (p, t) => p[t] === 1 && (this.loose(t) || isFree(this.layout, p, t));
      const board = { L: this.layout, present: this.present, free, kindOf: (t) => MATCH[this.faces[t]], holds: (l) => this.holds(l), chocolates: this.chocolates, states: this.chocolateStates };
      this.line = savour(this.line, board) || this.line;
    }
    return this.line;
  }

  hint() {
    const pair = this.suggest();
    if (pair) this.hints++;
    return pair;
  }

  useCandle() {
    if (!this.treats.candle) return null;
    const pair = this.suggest();
    if (pair) this.treats.candle--;
    return pair;
  }

  // Opens a blocked tile with a skeleton key: it stays free until it is
  // taken. A key is no use on ice, which only matches thaw.
  useKey(i) {
    if (!this.treats.key || !this.present[i] || this.isFree(i) || this.frozen(i)) return false;
    this.treats.key--;
    this.unlocked[i] = 1;
    if (this.outlook === 'lost') this.outlook = 'unknown'; // an opened tile may save it
    this.emit('key', i);
    return true;
  }

  // Deals the tiles still on the board onto the same places again, so the
  // board can still be won; a black cat does it for free. Before midnight
  // both sides are dealt again. On the lake, the swans still to be found are
  // dealt again too, as many as there were, where they can be. False when no
  // shuffle can help, as with two tiles left one on top of the other.
  shuffle({ cat = false } = {}) {
    if ((cat && !this.treats.cat) || !this.left) return false;
    const swans = this.swans ? this.swans.length : 0;
    let dealt = null;
    // On New Year's Day, while the resolution holds, the board is dealt
    // again so that the sweets can still be left alone through what is left
    // of January; on Valentine's vase of roses, so that each rose still to
    // gather can be taken while it's in bloom; on the box of chocolates, so
    // that each chocolate still to eat can be savoured; on April Showers'
    // umbrella, so that the raindrops are caught where they can be; on its
    // rain boots, so that what is left of the puddle goes last, in a run;
    // on its rainbow, so that the colours lit are caught where they can be;
    // on its seed tray, so that the seedlings still in it are watered and
    // picked in bloom; on its watering can, so that the drops still to pour
    // are poured with water in the can; and on its flower bed, so that the
    // bee makes honey at the tulips still standing. On the Start of Spring's
    // first robin, the faces go on the new deal's own order so that it sings
    // back her songs, from where she is in the one she's singing.
    const january = this.resolving ? this.january - this.matches : 0;
    for (let tries = 0; ; tries++) {
      const prefer = this.mirror
        ? plantSwans(this.mirror, swans, swanSteps(this.r, swans, this.left / 2))
        : this.sweets
          ? january
            ? resisting(this.sweets, january)
            : null
          : this.roses
            ? inBloom(this.roses, this.bloom.every, this.bloom.lasts, this.matches)
            : this.chocolates
              ? oneAtATime(this.chocolates, this.chocolateStates.map((s, k) => (s === 'eaten' ? k : -1)).filter((k) => k >= 0))
              : this.xoxo
                ? byTurns(this.layout, this.xoxo.split, this.run ? this.run.at(-1) : 'O')
                : this.rain
                  ? catching(this.rain.ribs, this.rain.every, this.seed, this.matches, this.raindrops)
                  : this.puddleEdge !== null
                    ? dryFirst(this.layout, this.puddleEdge)
                    : this.colourClouds !== null
                      ? chasing(this.layout, this.colourClouds, this.matches)
                      : this.garden
                        ? tending(this.layout, this.garden.seedlings, this.garden.drinks, this.water, this.seedlingsTaken)
                        : this.can
                          ? pouring(this.layout, this.can, this.canMost, this.canLevel)
                          : this.tulips
                            ? foraging(this.tulips, this.seed, this.bee)
                            : this.tideEvery
                              ? ebbing(this.layout, this.tideEvery, this.tideHigh, this.matches - this.tideFrom)
                              : this.prefer;
      dealt = redeal(this.layout, this.sides, this.side, this.turnAt - this.matches, this.present, this.r, this.iceAhead(), prefer);
      const fine = (d) =>
        (!this.mirror || swansIn(this.layout, this.mirror, d.sides[this.side], this.present).length === swans) &&
        (!january || holdsOut(d.order, this.sweets, january)) &&
        (!this.roses || gathers(d.order, this.roses, this.bloom.every, this.bloom.lasts, this.matches)) &&
        (!this.chocolates || savoursAll(d.order, this.chocolates, this.chocolateStates, this.present));
      if (!dealt || tries >= 30 || fine(dealt)) break;
    }
    if (!dealt) return false;
    if (this.robin && this.sides.length === 1) dealt.sides[this.side] = compose(dealt.order, dealt.sides[this.side], (f) => MATCH[f], this.robin, this.seed, this.r);
    const busterTiles = this.busters && this.busters.map((d) => d.tiles.slice());
    const pails = this.pails && this.pails.map((p) => ({ ...p, tiles: p.tiles.slice() }));
    this.history.push({ type: 'shuffle', sides: this.sides, line: this.line && this.line.slice(), outlook: this.outlook, busterTiles, swans: this.swans, pails, confetti: this.confetti, couple: this.couple, messages: this.messages, tideFrom: this.tideFrom });
    this.sides = dealt.sides;
    // The candy hearts go with the tiles, put on the new deal as the deal
    // put them, a message begun to be said next.
    const line = this.messages ? this.reheart(dealt.order) : dealt.order;
    // The smitten couple goes with the tiles: a pair of the new deal's
    // order with a tile it had, so that its two tiles match again.
    if (this.couple && this.couple.state === 'smitten') {
      const [x, y] = this.couple.tiles;
      const k = dealt.order.findIndex((p) => p.includes(x) || p.includes(y));
      if (k >= 0) this.couple = { tiles: dealt.order[k].slice(), state: 'smitten' };
    }
    // The confetti goes with the tiles: scattered again over the new deal,
    // a couple of each kind with two pairs left among the pairs of its order.
    if (this.confetti) this.confetti = scatter(this.layout, dealt.order, this.faces, this.r);
    if (this.swans) this.swans = swansIn(this.layout, this.mirror, this.faces, this.present);
    // The pails go with the milk: each fresh pail becomes a pair of the new
    // deal's order, one with a tile it had if it can, so that its two tiles
    // match again. It goes on keeping only if a tile of it is free.
    if (this.pails) {
      const order = dealt.order.slice();
      for (const p of this.pails) {
        if (p.state !== 'fresh') continue;
        const k = order.findIndex((q) => q.includes(p.tiles[0]) || q.includes(p.tiles[1]));
        p.tiles = order.splice(Math.max(0, k), 1)[0].slice();
        if (!p.tiles.some((t) => this.isFree(t))) p.freeAt = null;
      }
      this.age();
    }
    // The sale tags go with the stock: each open doorbuster becomes a pair
    // of the new deal's order, one with a tile it had if it can, so that
    // its two tiles match again.
    if (this.busters) {
      const order = dealt.order.slice();
      for (const d of this.busters) {
        if (d.state !== 'open') continue;
        const k = order.findIndex((p) => p.includes(d.tiles[0]) || p.includes(d.tiles[1]));
        d.tiles = order.splice(Math.max(0, k), 1)[0].slice();
      }
    }
    this.line = line.slice();
    this.outlook = 'win';
    if (cat) this.treats.cat--;
    else this.shuffles++;
    this.emit('shuffle', { cat });
    // On the sandcastle, the new deal leaves nothing to take but what the
    // water covers only when its order has the tide go out at once.
    if (this.ebb()) this.emit('tide', { tideMoved: 'out', ebbed: true });
    return true;
  }

  // The board as the solver sees it.
  position() {
    return {
      faces: this.faces,
      present: this.present,
      unlocked: this.lords ? Uint8Array.from(this.unlocked, (u, i) => u | this.lords[i]) : this.unlocked, // lords are as free as tiles opened with a key
      ghostsFloat: this.rules.ghostsFloat,
      soulsFloat: this.rules.soulsFloat,
      turn: this.turnAhead ? { after: this.turnAt - this.matches, faces: this.sides[1] } : null,
      ice: this.iceAhead(),
      wind: this.windEvery ? { every: this.windEvery, at: this.matches, upwind: this.upwind } : null,
      tide: this.tideEvery ? { every: this.tideEvery, high: this.tideHigh, phase: this.matches - this.tideFrom, rows: this.rowsUp } : null,
    };
  }

  // Keeps the winning line good after the player takes a and b. Taking tiles
  // only ever frees others, so a pair taken early from further down the line
  // leaves the rest of it good, unless that brings midnight on sooner. Two
  // tiles that the line pairs with others leave their two partners, which
  // may match each other: they go in where the later of the two pairs was, or
  // else the earlier. Either way the line is played through to be sure.
  follow(a, b) {
    const line = this.line;
    if (!line) return;
    const i = line.findIndex((p) => p[0] === a || p[1] === a);
    const j = line.findIndex((p) => p[0] === b || p[1] === b);
    if (i < 0 || j < 0) return this.forget();
    const rest = line.filter((p, k) => k !== i && k !== j);
    const tries = [rest];
    if (i !== j) {
      const c = line[i][0] === a ? line[i][1] : line[i][0];
      const d = line[j][0] === b ? line[j][1] : line[j][0];
      tries.length = 0;
      for (const at of [Math.max(i, j) - 1, Math.min(i, j)]) tries.push(rest.slice(0, at).concat([[c, d]], rest.slice(at)));
    }
    this.line = tries.find((tried) => this.holds(tried)) || null;
    if (!this.line) this.forget();
  }

  // Whether a line of pairs wins from here, the tiles turning over when they
  // should, lost souls waking as they would, ice thawing as it would, the
  // March wind turning as it would, and the tide coming in and going out as
  // it would: a pair under the water is taken only as the tide goes out at
  // once, with no other pair out of it to take.
  holds(line) {
    const p = Uint8Array.from(this.present);
    const sides = this.sides.map((s) => Int16Array.from(s));
    let matches = this.matches;
    let tideFrom = this.tideFrom;
    for (const [x, y] of line) {
      const faces = sides[matches >= this.turnAt ? 1 : 0];
      const thawed = (i) => !this.ice || this.ice[i] <= matches;
      const windy = (i) => this.windEvery > 0 && inWind(this.upwind, windAt(matches, this.windEvery), p, i);
      const open = (i) => p[i] === 1 && thawed(i) && (this.loose(i, faces) || windy(i) || isFree(this.layout, p, i));
      if (!open(x) || !open(y) || MATCH[faces[x]] !== MATCH[faces[y]]) return false;
      const level = this.tideEvery ? tideAt(matches - tideFrom, this.tideEvery, this.tideHigh) : 0;
      if (level > 0 && (covered(this.rowsUp, level, x) || covered(this.rowsUp, level, y))) {
        const kinds = new Set();
        for (let i = 0; i < p.length; i++) {
          if (!open(i) || covered(this.rowsUp, level, i)) continue;
          if (kinds.has(MATCH[faces[i]])) return false; // another pair out of the water, to be taken instead
          kinds.add(MATCH[faces[i]]);
        }
        tideFrom = matches;
      }
      p[x] = p[y] = 0;
      if (++matches === this.turnAt) for (const t of soulsAt(this.layout, sides[1], p)) sides[1][t] = LOST;
    }
    return p.every((v) => v === 0);
  }

  forget() {
    this.line = null;
    this.outlook = 'unknown';
  }

  // Tells the listeners when the board is won or nothing can be taken; on
  // the sandcastle, after the tide goes out at once if it must.
  settle() {
    if (this.ebb()) this.emit('tide', { tideMoved: 'out', ebbed: true });
    if (this.won) this.emit('win', this);
    else if (this.stuck) this.emit('stuck', this);
  }
}
