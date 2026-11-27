// The score for a board, worked out from what the game already records, so
// it holds through undo and reloads. Each pair taken is worth points, and a
// cleared board more, with a bonus for every second under par. Shuffles and
// hints cost points. When the tiles turn over, a board that wakes no lost
// souls earns a bonus, and each lost soul costs a little. On a board with a
// shopping list, each thing crossed off it earns points, and the whole list
// more; on a board with doorbusters, each one bought does, though the pairs
// another shopper grabs are not the player's; on a football board, a
// touchdown earns more; and on a board of turtle doves, so does each pair of
// lovebirds, on a board of songbirds each pair that flocks together, on the
// board of gold rings each ring turned to gold, on the board of geese each
// line of goslings, on the lake each swan, a tile and its reflection, and on
// the milk pail each pail of milk taken while it's fresh, its two tiles
// together, on the crown each lord taken while still held down, a leap, on
// the bagpipes each tile that follows a piper out, on New Year's 9 each lit
// pair, two tiles lit by rockets' bursts taken together, on New Year's 8
// each pair that dances in the disco ball's beam, on New Year's 7 the lucky
// coin, worth more the sooner it's found, on New Year's 6 each balloon
// popped before the next net opens, on New Year's 5 each sparkler taken
// while it still burns, the more the more of it is left, on New Year's 4
// each perfect match, a couple of a colour of confetti taken together, on
// New Year's 3 each wish made on a shooting star, and on New Year's 2 the
// toast, as the two glasses meet, worth more the more pairs are still on
// the board; on New Year's Day each match the resolution held through
// January, leaving the sweets alone, and the whole month more; and on
// Valentine's pierced heart each couple Cupid's arrow strikes, taken
// together before his next arrow flies: love at first sight; and on
// Valentine's envelope each sweet nothing said, the pairs with its two
// halves taken one straight after the other; on Valentine's vase of roses
// each rose gathered into the bouquet, taken while it's in bloom; on
// Valentine's first date each candlelit pair, a tile in each candle's glow;
// on Valentine's box of chocolates each chocolate savoured, eaten whole
// before biting into another; on Valentine's hugs and kisses each XOXO,
// kisses from the X and hugs from the O taken in turn, four in a row; on
// April Showers' umbrella each raindrop caught, the tile it was on taken as
// it ran down the canopy; and on its rain boots each splash, a pair from
// the puddle, worth the more the higher it splashed, its place in a run of
// splashes taken one straight after another; on its rainbow each colour
// caught, a pair from the band lit as it was taken; on its seed tray each
// seedling picked in bloom, watered by pairs taken beside it; and on its
// watering can each pour, a pair of its drops taken with water in the can;
// and on its flower bed each pot of honey, the tulip the bee is on taken;
// and on the Start of Spring's thaw, the snow knocked off a tile; and on its
// first robin, each of her songs sung back, pairs of its three kinds taken
// in her order; on its kite, each pair that caught the wind, a tile of it on
// the edge the wind blows on; on its luck of the Irish, each four-leaf
// clover found, its tile taken while it keeps; on its spring cleaning, each
// row swept clean from the top down, by its tiles; and on its day and night,
// each equinox pair, a tile from each half of the board; and on the beach
// season's footprints in the sand, each crab startled back into its burrow,
// on its ice cream, the cherry on top saved for the last pair, and on its
// beach ball, each cool pair, taken before either tile burnt in the sun;
// and on Independence Day's flag, each pair counted off, the next number
// in turn, one to nine.
// Treats are free, and so is undo, though a pair taken back takes its points
// with it.

export const POINTS = {
  pair: 10,
  clear: 250,
  second: 2, // for each second under par
  shuffle: -100,
  hint: -25,
  clean: 150, // turning over without one lost soul
  soul: -10, // each lost soul that wakes
  listed: 25, // each thing crossed off the shopping list
  list: 100, // the whole list, before checkout
  buster: 50, // each doorbuster bought
  touchdown: 60, // each pair taken from the two end zones: six, as in football, times ten
  lovebirds: 30, // each kind's second pair, taken straight after its first
  flock: 20, // each pair whose two tiles touch: birds of a feather
  ring: 50, // each ring whose every tile is taken, turning to gold
  brood: 60, // each line of six goslings, pairs each taken beside or under the one before
  swan: 50, // each swan: a tile and its own reflection in the lake, taken together
  milk: 40, // each pail of milk taken while it's fresh, its two tiles together
  leap: 20, // each lord taken while still held down by the usual rule
  piped: 15, // each tile that follows a piper out
  lit: 30, // each lit pair: two tiles lit by rockets' bursts, taken together
  spotlight: 30, // each pair taken with both its tiles in the disco ball's beam
  balloon: 15, // each balloon popped, its tile taken before the next net opens
  coin: 200, // the lucky coin, found as the first match frees its tile,
  coinFade: 5, // less this for every match before it is found,
  coinLeast: 25, // and never less than this
  spark: 10, // each match a sparkler still had left to burn when it was taken
  perfect: 5, // each couple of a colour of confetti taken together
  wish: 15, // each wish made on a shooting star, a pair from the row it crossed
  toast: 5, // each pair still on the board as the two glasses meet and clink, a toast
  held: 5, // each match of January the resolution held, the sweets left alone,
  resolution: 100, // and holding it through the whole month
  love: 30, // each couple Cupid's arrow strikes, taken together before his next flies
  message: 40, // each sweet nothing said: the pairs with its two halves, one straight after the other
  rose: 20, // each rose taken in bloom, with any tile of its kind, for the bouquet
  candlelit: 20, // each pair with a tile in each candle's glow, his and hers
  savoured: 30, // each chocolate eaten whole, cup and all, before biting into another
  xoxo: 15, // each XOXO: kisses from the X and hugs from the O taken in turn, four in a row
  raindrop: 20, // each raindrop caught on the umbrella: the tile it was on taken as it ran down
  splash: 10, // each splash, a pair from the puddle, times how high it splashed: its place in a run of them
  colour: 15, // each colour caught on the rainbow: a pair from the band lit as it was taken
  bloom: 30, // each seedling picked in bloom, watered three times by pairs taken beside it
  pour: 20, // each pour of the watering can: a pair of its drops taken with water in it
  honey: 20, // each pot of honey on the flower bed: the tulip the bee is on, taken
  snow: 15, // on the thaw, the snow knocked off a tile, a pair taken beside it
  song: 30, // on the first robin, each of her songs sung back: pairs of its three kinds, taken in her order
  wind: 5, // on the kite, each pair that caught the wind: a tile of it on the edge the wind blows on
  luck: 25, // on luck of the Irish, each four-leaf clover found: its tile taken within five matches of its showing
  sweep: 5, // on spring cleaning, each tile of a row swept clean, every row above it swept already
  equinox: 5, // on day and night, each equinox pair: a tile from the day side and one from the night side
  crab: 10, // on the beach season's footprints in the sand, each crab startled back into its burrow by a pair right beside it
  cherry: 50, // on its ice cream, the cherry on top saved for the board's last pair
  cool: 5, // on its beach ball, each cool pair: taken before either of its tiles burnt, left free in the sun too long
  count: 10, // on Independence Day's flag, each pair counted off: a pair of the next number in turn, one to nine
};

// What the lucky coin is worth, found as the match given frees its tile.
export const coinWorth = (match) => Math.max(POINTS.coinLeast, POINTS.coin - POINTS.coinFade * (match - 1));

// The tiles a board has: on a board with a fridge, the table's, its
// containers aside.
const tilesOf = (game) => game.tableCount ?? game.layout.count;

// On New Year's 2, the pairs still on the board as the glasses met, and
// what the toast is worth: so much for each of them.
export const pairsAtToast = (game) => tilesOf(game) / 2 - game.toastAt;
export const toastWorth = (game) => POINTS.toast * pairsAtToast(game);

// Par: five seconds a tile, or six on a board that turns over, as that wants planning.
export const par = (game) => tilesOf(game) * (game.sides.length > 1 ? 6 : 5);

// The words a board's turning over is told in, for its rows: Halloween's,
// unless a board says otherwise (main.js has the Sunday Scaries').
const TURN = { night: 'Midnight', day: 'Sunrise', souls: 'Lost souls', none: 'no lost souls' };

// The score so far, as { total, rows }, each row [what, how, points]. The
// clearing and the speed bonus come in once the board is clear.
export function scoreOf(game, seconds, words = TURN) {
  const times = (n, each) => `${n} × ${Math.abs(each)}`;
  const pairs = game.matches; // the player's own: none another shopper grabbed
  const rows = [['Pairs', times(pairs, POINTS.pair), pairs * POINTS.pair]];
  const turn = game.history.find((e) => e.souls);
  if (turn) {
    const n = turn.souls.length;
    const when = game.sideNames[1] === 'night' ? words.night : words.day;
    rows.push(n ? [words.souls, times(n, POINTS.soul), n * POINTS.soul] : [`${when} with ${words.none}`, '', POINTS.clean]);
  }
  if (game.list) {
    const n = game.crossed.length;
    const all = n > 0 && n === game.list.kinds.length;
    rows.push(['Shopping list', `${n} of ${game.list.kinds.length}${all ? ', the lot' : ''}`, n * POINTS.listed + (all ? POINTS.list : 0)]);
  }
  if (game.busters) {
    const mine = game.busters.filter((d) => d.state === 'mine').length;
    const gone = game.busters.filter((d) => d.state === 'gone').length;
    rows.push(['Doorbusters', `${mine} of ${game.busters.length}${gone ? `, ${gone} grabbed` : ''}`, mine * POINTS.buster]);
  }
  if (game.zones) rows.push(['Touchdowns', times(game.touchdowns, POINTS.touchdown), game.touchdowns * POINTS.touchdown]);
  if (game.rules.lovebirds) rows.push(['Lovebirds', times(game.lovebirds, POINTS.lovebirds), game.lovebirds * POINTS.lovebirds]);
  if (game.rules.flock) rows.push(['Birds of a feather', times(game.flocks, POINTS.flock), game.flocks * POINTS.flock]);
  if (game.rings) rows.push(['Gold rings', times(game.goldRings, POINTS.ring), game.goldRings * POINTS.ring]);
  if (game.rules.goslings) rows.push(['Lines of goslings', times(game.broods, POINTS.brood), game.broods * POINTS.brood]);
  if (game.swans) rows.push(['Swans', times(game.swansFound, POINTS.swan), game.swansFound * POINTS.swan]);
  if (game.pails) {
    const lost = [
      [game.pailsIn('sour'), 'soured'],
      [game.pailsIn('spilt'), 'spilt'],
    ].filter(([n]) => n);
    rows.push(['Fresh milk', [`${game.pailsTaken} of ${game.pails.length}`, ...lost.map(([n, how]) => `${n} ${how}`)].join(', '), game.pailsTaken * POINTS.milk]);
  }
  if (game.lords) rows.push(['Leaping lords', times(game.leaps, POINTS.leap), game.leaps * POINTS.leap]);
  if (game.pipers) rows.push(['Pied pipers', times(game.piped, POINTS.piped), game.piped * POINTS.piped]);
  if (game.rockets) rows.push(['Lit pairs', times(game.litPairs, POINTS.lit), game.litPairs * POINTS.lit]);
  if (game.rules.disco) rows.push(['In the spotlight', times(game.spotlights, POINTS.spotlight), game.spotlights * POINTS.spotlight]);
  if (game.balloons) {
    const how = [`${game.popped} of ${game.dropped} popped`, game.floated && `${game.floated} floated away`].filter(Boolean).join(', ');
    rows.push(['Balloons', how, game.popped * POINTS.balloon]);
  }
  if (game.coin >= 0) rows.push(['Lucky coin', game.foundAt ? `found on match ${game.foundAt}` : 'still hidden', game.foundAt ? coinWorth(game.foundAt) : 0]);
  if (game.sparklers) {
    const taken = game.sparklers.filter((s) => s.state === 'taken');
    const out = game.sparklers.filter((s) => s.state === 'out').length;
    const how = [`${taken.length} of ${game.sparklers.length} taken burning`, out && `${out} burnt out`].filter(Boolean).join(', ');
    rows.push(['Sparklers', how, taken.reduce((sum, s) => sum + s.left, 0) * POINTS.spark]);
  }
  if (game.confetti) rows.push(['Perfect matches', times(game.perfects, POINTS.perfect), game.perfects * POINTS.perfect]);
  if (game.starEvery) rows.push(['Wishes', `${game.wishes} of ${game.starCount} stars`, game.wishes * POINTS.wish]);
  if (game.arrowEvery) {
    const how = [`${game.loves} of ${game.arrowsFlown} couples`, game.heartbreaks && `${game.heartbreaks} ${game.heartbreaks === 1 ? 'heart' : 'hearts'} broken`].filter(Boolean).join(', ');
    rows.push(['Love at first sight', how, game.loves * POINTS.love]);
  }
  if (game.messages) {
    const unsaid = game.messages.filter((m) => m.state === 'unsaid').length;
    const how = [`${game.messagesSaid} of ${game.messages.length} said`, unsaid && `${unsaid} unsaid`].filter(Boolean).join(', ');
    rows.push(['Sweet nothings', how, game.messagesSaid * POINTS.message]);
  }
  if (game.candles) rows.push(['Candlelit pairs', times(game.candlelitPairs, POINTS.candlelit), game.candlelitPairs * POINTS.candlelit]);
  if (game.xoxo) rows.push(['XOXOs', times(game.xoxos, POINTS.xoxo), game.xoxos * POINTS.xoxo]);
  if (game.rain) rows.push(['Raindrops', `${game.dropsCaught} of ${game.dropsLanded} caught`, game.dropsCaught * POINTS.raindrop]);
  if (typeof game.puddleEdge === 'number') {
    const n = game.splashCount;
    rows.push(['Splashes', n ? `${n} ${n === 1 ? 'splash' : 'splashes'}, ${game.splashBest} in a row at the most` : 'none yet', game.splashHeights * POINTS.splash]);
  }
  if (typeof game.colourClouds === 'number') rows.push(['Colours caught', times(game.coloursCaught, POINTS.colour), game.coloursCaught * POINTS.colour]);
  if (game.garden) {
    const [n, pulled] = [game.seedlingsIn('picked'), game.seedlingsIn('pulled')];
    rows.push(['Blooms', [`${n} of ${game.garden.seedlings.length} picked`, pulled && `${pulled} pulled up`].filter(Boolean).join(', '), n * POINTS.bloom]);
  }
  if (game.tulips) rows.push(['Honey', `${game.honey} of ${game.tulips.length} tulips`, game.honey * POINTS.honey]);
  if (game.snowEvery) rows.push(['Snow knocked off', `${game.snowKnocked} of ${game.snowLanded}`, game.snowKnocked * POINTS.snow]);
  if (game.robin) rows.push(['Songs sung back', `${game.robin.sung} of ${game.robin.songs}`, game.robin.sung * POINTS.song]);
  if (game.windEvery) rows.push(['Caught the wind', times(game.windCaught, POINTS.wind), game.windCaught * POINTS.wind]);
  if (game.cloverWithin) rows.push(['Four-leaf clovers', `${game.cloversFound} found${game.cloversLost ? `, ${game.cloversLost} blown away` : ''}`, game.cloversFound * POINTS.luck]);
  if (game.sweepRows) rows.push(['Rows swept clean', `${game.rowsSweptClean} of ${game.sweepRows.rows.length}`, game.sweptTiles * POINTS.sweep]);
  if (game.rules.equinox) rows.push(['Equinox pairs', times(game.equinoxPairs, POINTS.equinox), game.equinoxPairs * POINTS.equinox]);
  if (game.crabEvery) rows.push(['Crabs startled', times(game.crabsStartled, POINTS.crab), game.crabsStartled * POINTS.crab]);
  if (game.cherry >= 0) rows.push(['Cherry on top', game.cherrySaved ? 'saved for last' : game.cherryAt >= 0 ? 'eaten too soon' : 'still on top', game.cherrySaved ? POINTS.cherry : 0]);
  if (game.sunAt) rows.push(['Cool pairs', times(game.coolPairs, POINTS.cool), game.coolPairs * POINTS.cool]);
  if (game.countOff) rows.push(['Counted off', times(game.countOffs, POINTS.count), game.countOffs * POINTS.count]);
  if (game.can) rows.push(['Pours', [`${game.pours} of ${game.dropPairs}`, game.dryPours && `${game.dryPours} dry`].filter(Boolean).join(', '), game.pours * POINTS.pour]);
  if (game.chocolates) {
    const n = game.chocolatesIn('savoured');
    const eaten = game.chocolatesIn('eaten');
    rows.push(['Chocolates', [`${n} of ${game.chocolates.length} savoured`, eaten && `${eaten} just eaten`].filter(Boolean).join(', '), n * POINTS.savoured]);
  }
  if (game.roses) {
    const lost = [
      [game.rosesIn('wasted'), 'wasted in bud'],
      [game.rosesIn('wilted'), 'wilted'],
    ].filter(([n]) => n);
    rows.push(['Roses', [`${game.bouquet} of ${game.roses.length} in the bouquet`, ...lost.map(([n, how]) => `${n} ${how}`)].join(', '), game.bouquet * POINTS.rose]);
  }
  if (game.sweets) {
    const held = game.daysHeld;
    const days = `${held} ${held === 1 ? 'day' : 'days'}`;
    const how = game.brokenAt ? `broken on day ${game.brokenAt}, after ${days}` : game.resolutionKept ? 'kept through January' : `${days} of ${game.january} so far`;
    rows.push(['Resolution', how, held * POINTS.held + (game.resolutionKept ? POINTS.resolution : 0)]);
  }
  if (game.path) {
    const n = pairsAtToast(game);
    rows.push(['A toast', game.toastAt ? `on match ${game.toastAt}, with ${n} ${n === 1 ? 'pair' : 'pairs'} left` : 'the glasses still apart', game.toastAt ? toastWorth(game) : 0]);
  }
  if (game.shuffles) rows.push(['Shuffles', times(game.shuffles, POINTS.shuffle), game.shuffles * POINTS.shuffle]);
  if (game.hints) rows.push(['Hints', times(game.hints, POINTS.hint), game.hints * POINTS.hint]);
  if (game.won) {
    const under = Math.max(0, Math.floor(par(game) - seconds));
    rows.push(['Board cleared', '', POINTS.clear]);
    rows.push(['Speed', under ? `${under} s under par` : 'not under par', under * POINTS.second]);
  }
  return { total: rows.reduce((sum, row) => sum + row[2], 0), rows };
}
