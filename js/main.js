import { Game } from './engine/game.js';
import * as layouts from './engine/layouts.js';
import { HOURS, gameOptions } from './night.js';
import { DAYS, dayOf, dayOptions } from './thanksgiving.js';
import { TWELVE_DAYS, dayOfChristmas } from './christmas.js';
import { NEW_YEAR, newYearOf } from './newyear.js';
import { GROUNDHOG_DAY, groundhogOf, dayKey, daySeed, streakOf, weekTo } from './groundhog.js';
import { LOVE_STORY, chapterOf } from './valentines.js';
import { showerOf } from './showers.js';
import { BANDS } from './engine/colours.js';
import { GIFTS, TURNS, wordsOf } from './words.js';
import { ballDrop } from './ui/ball.js';
import { KINDS, MATCH } from './engine/tiles.js';
import { sprite, symbolId, faceName, kindName, FACE_SETS } from './ui/faces.js';
import { Board, tileFit } from './ui/board.js';
import { Magnifier } from './ui/magnifier.js';
import { Sound } from './ui/sound.js';
import { POINTS, par, scoreOf, coinWorth, toastWorth } from './score.js';
import { Leaderboard, BOARDS, NIGHT, boardOf, nameOf, nameProblem, tidy } from './leaderboard.js';
import { theme, when, isOpen, opensOn, today, short, menuList } from './themes.js';

const MIDNIGHT = HOURS.findIndex((h) => h.name === 'Midnight');

// The treats the board in play gives, and how its turning over is told,
// in its holiday's words (words.js).
let gifts = GIFTS.halloween;
let turnWords = TURNS.midnight;

// On New Year's 7, how close a pair came to the lucky coin, as a sign.
const HEAT = { hot: '🔥', warm: '🌡️', cold: '🧊' };

// On April Showers' rainbow, each band's colour, as a sign, red to violet.
const DOTS = ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣'];

// The set of faces the board in play's tiles wear, and are named by
// (faces.js): Halloween's on the night's boards, Thanksgiving's on the
// week's, Christmas's on the twelve days', New Year's on its countdown and
// New Year's Day, Groundhog Day's on its board of the day, Valentine's on
// its love story, and on the turtle and the rest outside them, the holiday
// chosen's (holidayFaces).
let faceSet = 'halloween';

// Every layout by the name an address can give it, for free play: #play/raven/12345.
const FREE = Object.fromEntries(Object.entries(layouts).map(([k, L]) => [k.toLowerCase(), L]));

const $ = (id) => document.getElementById(id);
const newSeed = () => Math.floor(Math.random() * 1e9);
const sound = new Sound();

let game = null;
let board = null;
let hour = -1; // the hour of the Long Night being played, or -1
let runDay = -1; // the day being played of a run of days, Thanksgiving week, Christmas's twelve or New Year's boards, or -1; with hour, both -1 for free play
let runId = null; // the run that day is of: 'thanksgiving', 'christmas', 'new-year', 'groundhog' or 'valentines' (RUNS)
let boardDate = null; // on Groundhog Day, the day the board in play is the board of, as its key
let moves = []; // what has been done on this board, to play it back after a reload
let elapsed = 0; // seconds played before the clock last started
let started = 0; // when the clock last started, or 0 while it is held
let nap = null; // on a board with a nap, { from, to }: the clock stops from the one match to the other
let finished = false;
let woke = 0;
let prompted = false;

// What is kept between visits: the holiday chosen last, whose look the page
// and the turtle wear, and what was on the table, the night's board, a
// run's or the one played freely, to go back to; the latest hour of the
// Long Night reached, the best time and the best score for each hour, with
// the time that score took;
// the same for Thanksgiving week, for Christmas's twelve days, for New
// Year's boards and for Valentine's chapters, by the day, and for Groundhog
// Day's board by the date,
// with how often each day's was cleared;
// the boards in play, the night's, the week's, the twelve days' and the one
// outside them all, each as its seed and its moves; and the player's name on
// the leaderboard, with what has been posted there.
let saved = {
  theme: 'halloween',
  table: null, // 'halloween', a run's id or 'free'
  reached: 0,
  best: {},
  scores: {},
  times: {},
  playing: null,
  week: { reached: 0, best: {}, scores: {}, times: {}, playing: null },
  twelve: { reached: 0, best: {}, scores: {}, times: {}, playing: null },
  newyear: { reached: 0, best: {}, scores: {}, times: {}, playing: null },
  valentines: { reached: 0, best: {}, scores: {}, times: {}, playing: null },
  groundhog: { reached: 0, best: {}, scores: {}, times: {}, playing: null, days: {} },
  free: null,
  name: '',
  declined: false,
  posted: {},
};
try {
  saved = { ...saved, ...JSON.parse(localStorage.getItem('seasons.night')) };
} catch {}
delete saved.holidays; // the holidays a player once chose to play: now every one is there to choose
delete saved.allHolidays;

function store() {
  const onTable = hour >= 0 ? saved.playing : runDay >= 0 ? RUNS[runId].progress().playing : saved.free; // while it is not yet cleared
  if (onTable) onTable.elapsed = played();
  try {
    localStorage.setItem('seasons.night', JSON.stringify(saved));
  } catch {}
}

document.body.prepend(sprite());

// Holding a tile shows it up close: from the start on a phone, whose tiles
// are small, and on anything by the switch on the night's card.
const magnifier = new Magnifier();
let magnifying = matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 600;
try {
  const kept = localStorage.getItem('seasons.magnifier');
  if (kept) magnifying = kept === 'on';
} catch {}

// Tiles that can't be taken yet are dimmed, so that only the free ones need
// looking over: from the start, unless switched off on the night's card.
let dimming = true;
try {
  dimming = localStorage.getItem('seasons.dim') !== 'off';
} catch {}
$('board').classList.toggle('dimming', dimming);

const leaderboard = new Leaderboard();

// ------------------------------------------------------------- the boards

// Sets up a board: deals it from its seed, plays back any moves already
// made on it, and puts it on the page. The board it takes the place of is
// kept first, with all the time played on it.
function play({ layout, options, seed, replay = [], playedFor = 0, at = -1, onDay = -1, ofRun = null, treatSet = 'halloween', treatBar = true, napAt = null, turnSet = 'midnight', faces = 'halloween', look = null }) {
  if (game && !finished) store();
  hideCard();
  hour = at;
  runDay = onDay;
  runId = onDay >= 0 ? ofRun : null;
  nap = napAt;
  faceSet = faces;
  sound.use(faces); // the holiday's music with its tiles
  sound.hush(); // the last board's music fading
  speak({ turnSet, treatSet }, treatBar);
  game = new Game(layout, { seed, ...options });
  for (const move of replay) redo(move);
  moves = replay.slice();
  $('fridge').hidden = !game.fridgeSize;
  if (!game.fridgeSize) $('fridge').querySelector('.slots').replaceChildren(); // no containers left over from a board that had them
  const fridge = game.fridgeSize ? $('fridge').querySelector('.slots') : null;
  board = new Board($('board'), game, { say: toast, sound, magnifier: magnifying ? magnifier : null, keyName: gifts.keyName, fridge, faceSet, look });
  game.on('match', ({ a, b }) => {
    sound.match();
    board.float(`+${POINTS.pair}`, b);
    record(['m', a, b]);
    if (nap && game.matches === nap.from) {
      sound.nap();
      toast(`The feast is over, and everyone dozes off: the clock stops for the next ${nap.to - nap.from} matches.`);
    } else if (nap && game.matches === nap.to && !game.won) {
      sound.wake();
      toast('Everyone wakes up, and the clock runs again.');
    }
    napClock();
  });
  game.on('undo', () => {
    sound.undo();
    record(['u']);
    if (finished) {
      finished = false; // taking back the last match of a cleared board starts the clock again
      run();
    }
    napClock();
  });
  game.on('save', ({ tile }) => record(['f', tile]));
  game.on('shuffle', ({ cat }) => {
    sound.shuffle();
    if (!cat) board.float(signed(POINTS.shuffle), -1, true);
    record([cat ? 'c' : 's']);
  });
  game.on('key', (i) => record(['k', i]));
  game.on('thaw', () => sound.thaw());
  game.on('list', ({ b, crossed }) => {
    const left = game.listLeft.length;
    sound.listed();
    if (!left) setTimeout(() => sound.treat(), 250);
    setTimeout(() => board.float(`+${POINTS.listed + (left ? 0 : POINTS.list)}`, b), 500); // after the pair's own points
    toast(left ? `Crossed off the list: ${kindName(crossed, faceSet)}. ${left} more to find.` : `That's the whole list: ${POINTS.list} more points.`);
  });
  game.on('checkout', () => {
    const left = game.listLeft.length;
    if (left) toast(`Checkout: ${left === 1 ? 'one thing' : `${left} things`} left on the list.`);
  });
  game.on('bought', ({ b }) => {
    sound.listed();
    setTimeout(() => board.float(`+${POINTS.buster}`, b), 500); // after the pair's own points
    toast(`Doorbuster! It's yours: ${POINTS.buster} points.`);
  });
  game.on('grab', ({ grab }) => {
    sound.grab();
    toast(`Another shopper grabbed a doorbuster: ${dealName(grab[0])}.`);
  });
  game.on('touchdown', ({ b }) => {
    sound.touchdown();
    setTimeout(() => board.float(`+${POINTS.touchdown}`, b), 500); // after the pair's own points
    toast(`Touchdown! ${POINTS.touchdown} points.`);
  });
  game.on('lovebirds', ({ b }) => {
    sound.coo();
    setTimeout(() => board.float(`+${POINTS.lovebirds}`, b), 500); // after the pair's own points
    toast(`Lovebirds! ${POINTS.lovebirds} points.`);
  });
  game.on('flock', ({ b }) => {
    sound.flutter();
    setTimeout(() => board.float(`+${POINTS.flock}`, b), 500); // after the pair's own points
    toast(`Birds of a feather! ${POINTS.flock} points.`);
  });
  game.on('hatch', ({ hatched }) => {
    sound.cheep();
    for (const t of hatched) setTimeout(() => board.float('🐣', t), 300);
    const names = hatched.map((t) => faceName(game.faces[t], faceSet));
    toast(names.length > 1 ? `${names.length} eggs hatched: ${names.slice(0, -1).join(', ')} and ${names.at(-1)}.` : `An egg hatched: ${names[0]}.`);
  });
  game.on('gold', ({ b, gold }) => {
    const n = gold.length;
    sound.ring();
    setTimeout(() => board.float(`+${n * POINTS.ring}`, b), 500); // after the pair's own points
    toast(`${n > 1 ? `${['Two', 'Three', 'Four', 'Five'][n - 2]} gold rings` : 'A gold ring'}! ${n * POINTS.ring} points.`);
  });
  game.on('gosling', ({ b, brood }) => {
    if (!brood) {
      sound.cheep();
      setTimeout(() => board.float('🐣', b), 300);
      return;
    }
    sound.honk();
    setTimeout(() => board.float(`+${POINTS.brood}`, b), 500); // after the pair's own points
    const n = game.rules.goslings;
    toast(`A line of ${['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][n] ?? n} goslings! ${POINTS.brood} points.`);
  });
  game.on('swan', ({ b, swan, swamOff }) => {
    if (swan) {
      sound.swan();
      setTimeout(() => board.float(`+${POINTS.swan}`, b), 500); // after the pair's own points
      toast(`A swan and her reflection! ${POINTS.swan} points.`);
      return;
    }
    sound.ripple();
    toast(swamOff > 1 ? 'Two swans swam off: their tiles went without their reflections.' : 'A swan swam off: her tile went without its reflection.');
  });
  game.on('milk', ({ b, milked, soured, spilt }) => {
    const lost = [spilt && (spilt > 1 ? `${spilt} pails spilt` : 'a pail spilt'), soured && (soured > 1 ? `${soured} pails went sour` : 'a pail went sour')].filter(Boolean).join(', and ');
    if (milked) {
      sound.milk();
      setTimeout(() => board.float(`+${milked * POINTS.milk}`, b), 500); // after the pair's own points
      toast(`Fresh milk! ${milked * POINTS.milk} points.${lost ? ` But ${lost}.` : ''}`);
      return;
    }
    sound.sour();
    toast(spilt ? `Oops: ${lost}. A pail's two tiles go together.` : `Too late: ${lost}.`);
  });
  game.on('pipe', ({ b, piped }) => {
    const n = piped.length;
    sound.bagpipe();
    for (const t of piped) setTimeout(() => board.float('🎶', t), 200);
    setTimeout(() => board.float(`+${n * POINTS.piped}`, b), 500); // after the pair's own points
    toast(`The piper plays, and ${n === 2 ? 'two follow' : n === 1 ? 'one follows' : `${n} follow`} him out! ${n * POINTS.piped} points.`);
  });
  game.on('leap', ({ b, leapt }) => {
    sound.fanfare();
    setTimeout(() => board.float(`+${leapt * POINTS.leap}`, b), 500); // after the pair's own points
    toast(`${leapt > 1 ? 'Two lords leapt out' : 'A lord leapt out'}! ${leapt * POINTS.leap} points.`);
  });
  // On New Year's 9: a lit pair scores, and a rocket goes up with a whistle
  // and bursts, the tiles round it sparkling as they light up.
  game.on('firework', ({ b, litPair, rockets, lit }) => {
    const words = [];
    if (litPair) {
      sound.sparkle();
      setTimeout(() => board.float(`+${POINTS.lit}`, b), 500); // after the pair's own points
      words.push(`A lit pair! ${POINTS.lit} points.`);
    }
    if (rockets.length) {
      sound.firework();
      for (const t of rockets) board.float('🎆', t);
      setTimeout(() => board.litUp(lit), 450); // as it bursts
      const what = rockets.length > 1 ? 'Two rockets burst' : 'A rocket bursts';
      words.push(lit.length ? `${what}, lighting up ${lit.length} ${lit.length === 1 ? 'tile' : 'tiles'}.` : `${what}, with nothing left round it to light.`);
    }
    toast(words.join(' '));
  });
  // On New Year's 7: each pair says how close it came to the lucky coin,
  // over where it was taken, until the coin turns up, gleaming, in its tile.
  game.on('coin', ({ b, found, heat }) => {
    if (found) {
      const worth = coinWorth(game.foundAt);
      sound.coin();
      board.float('🪙', game.coin);
      setTimeout(() => board.float(`+${worth}`, game.coin), 500);
      toast(`You found the lucky coin! ${worth} points.`);
      return;
    }
    sound.heat(heat);
    board.float(HEAT[heat], b);
  });
  // On New Year's 3: a pair taken from the row the star crossed makes its
  // wish, and every so many matches another star crosses.
  game.on('star', ({ b, wish, starDue, star }) => {
    const words = [];
    if (wish) {
      sound.wish();
      board.float('🌠', b);
      setTimeout(() => board.float(`+${POINTS.wish}`, b), 500); // after the pair's own points
      words.push(`Your wish comes true! ${POINTS.wish} points.`);
    }
    if (starDue && star) {
      setTimeout(() => sound.star(), wish ? 400 : 0);
      board.starCrossed();
      words.push('A shooting star! Make a wish: take a pair from the row it crossed.');
    }
    if (words.length) toast(words.join(' '));
  });
  // On Valentine's pierced heart: the couple Cupid's arrow struck, taken
  // together, is love at first sight, and one of them taken with another
  // tile breaks a heart; and every so many matches he lets fly again, a
  // couple still smitten getting over it.
  game.on('arrow', ({ b, love, heartbreak, arrow, overIt }) => {
    const words = [];
    if (love) {
      sound.love();
      board.float('💘', b);
      setTimeout(() => board.float(`+${POINTS.love}`, b), 500); // after the pair's own points
      words.push(`Love at first sight! ${POINTS.love} points.`);
    }
    if (heartbreak) {
      sound.heartbreak();
      board.float('💔', b);
      words.push('A smitten tile went off with another: a broken heart.');
    }
    if (overIt) words.push('The smitten couple got over it.');
    if (arrow) {
      setTimeout(() => sound.arrow(), love || heartbreak ? 450 : 0);
      board.struck(arrow);
      words.push(`Cupid lets fly again: take the two smitten tiles together within ${game.arrowEvery} matches.`);
    }
    if (words.length) toast(words.join(' '));
  });
  // On Valentine's hugs and kisses: kisses and hugs taken in turn, four in
  // a row, make an XOXO, and a run of two or more is broken by two of a
  // kind together or a pair with a tile in each letter.
  game.on('xoxo', ({ b, kiss, xoxoMade }) => {
    if (xoxoMade) {
      sound.xoxo();
      board.float('💋', b);
      setTimeout(() => board.float(`+${POINTS.xoxo}`, b), 500); // after the pair's own points
      toast(`XOXO! Hugs and kisses: ${POINTS.xoxo} points.`);
      return;
    }
    toast(kiss ? `Two ${kiss === 'X' ? 'kisses' : 'hugs'} together: the XOXO starts again.` : 'A pair with a tile in each letter: the XOXO starts again.');
  });
  // On April Showers' umbrella: a pair with the tile a raindrop is on
  // catches it, drops run past the rim and drip off, and every so many
  // matches another lands on the peak.
  game.on('rain', ({ catches, drips, newDrop }) => {
    const words = [];
    if (catches.length) {
      const pts = catches.length * POINTS.raindrop;
      sound.catchDrop();
      for (const t of catches) board.float('💧', t);
      setTimeout(() => board.float(`+${pts}`, catches[0]), 500); // after the pair's own points
      words.push(`${catches.length > 1 ? 'Two raindrops' : 'A raindrop'} caught! ${pts} points.`);
    }
    if (drips) {
      setTimeout(() => sound.drip(), catches.length ? 400 : 0);
      words.push(drips > 1 ? 'Two raindrops dripped off the rim.' : 'A raindrop dripped off the rim.');
    }
    if (newDrop) {
      setTimeout(() => sound.raindrop(), catches.length || drips ? 700 : 0);
      words.push("A raindrop lands on the umbrella's peak.");
    }
    toast(words.join(' '));
  });
  // On April Showers' rain boots: a pair from the puddle splashes, higher
  // with each one straight after another, and a pair from anywhere else
  // lets the puddle settle.
  game.on('splash', ({ b, splashed, settled }) => {
    if (splashed) {
      const pts = splashed * POINTS.splash;
      sound.splash(splashed);
      board.splashed(b);
      board.float('💦', b);
      setTimeout(() => board.float(`+${pts}`, b), 500); // after the pair's own points
      const what = splashed > 1 ? `Splash! ${splashed} in a row: ${pts} points.` : `Splash! ${pts} points.`;
      toast(game.puddleLeft >= 2 ? `${what} Another from the puddle straight after splashes higher.` : what);
      return;
    }
    toast(`The puddle settles${settled > 1 ? ` after ${settled} splashes in a row` : ''}: the next splash starts again at ${POINTS.splash}.`);
  });
  // On April Showers' seed tray: a pair taken beside a seedling waters it,
  // one watered enough blooms, and a bloom taken is picked, while a seedling
  // taken before it blooms is pulled up.
  game.on('garden', ({ b, watered, blossomed, picked, pulled }) => {
    const words = [];
    if (picked.length) {
      const pts = picked.length * POINTS.bloom;
      sound.picked();
      for (const t of picked) board.float('🌷', t);
      setTimeout(() => board.float(`+${pts}`, b), 500); // after the pair's own points
      words.push(`${picked.length > 1 ? 'Two blooms' : 'A bloom'} picked! ${pts} points.`);
    }
    if (pulled.length) {
      sound.pulled();
      words.push(pulled.length > 1 ? 'Two seedlings pulled up before they bloomed.' : 'A seedling pulled up before it bloomed: just a tile.');
    }
    if (watered.length) {
      setTimeout(() => (blossomed.length ? sound.blossom() : sound.water()), picked.length || pulled.length ? 450 : 0);
      board.wateredSeedlings(watered, blossomed);
      for (const t of watered) board.float('💧', t);
      if (blossomed.length) words.push(`${blossomed.length > 1 ? 'Two seedlings bloom' : 'A seedling blooms'} 🌷: pick ${blossomed.length > 1 ? 'them' : 'it'} with a tile of its kind for ${POINTS.bloom} points.`);
      else if (!words.length) words.push(watered.length > 1 ? 'Two seedlings watered.' : `Watered: ${game.thirst(game.garden.seedlings.indexOf(watered[0]))} more and it blooms.`);
    }
    toast(words.join(' '));
  });
  // On April Showers' flower bed: a pair with the tulip the bee is on makes
  // honey, and with every match she flies to another.
  game.on('bee', ({ honey, beeFrom }) => {
    if (honey) {
      sound.honey();
      board.float('🍯', beeFrom);
      setTimeout(() => board.float(`+${POINTS.honey}`, beeFrom), 500); // after the pair's own points
      toast(`Honey! ${POINTS.honey} points.${game.bee.at >= 0 ? ' The bee flies on to another tulip.' : ' The bee flies off: every tulip is picked.'}`);
    } else if (game.bee.at >= 0) sound.buzz();
  });
  // On April Showers' watering can: a pair from its body fills it, if
  // there's room, and a pair of its drops pours it, if there's water in it.
  game.on('can', ({ b, canDoes }) => {
    if ((canDoes === 'fill' || canDoes === 'full') && game.dropsLeft < 2) return; // nothing left to pour
    if (canDoes === 'fill') {
      sound.fill(game.canLevel);
      board.float('💧', b);
      toast(`The can fills: ${game.canLevel} ${game.canLevel === 1 ? 'measure' : 'measures'} in it, of ${game.canMost}.`);
    } else if (canDoes === 'pour') {
      sound.sprinkle();
      board.float('🌼', b);
      setTimeout(() => board.float(`+${POINTS.pour}`, b), 500); // after the pair's own points
      toast(`The garden's watered! ${POINTS.pour} points. ${game.canLevel ? `${game.canLevel} left in the can.` : 'The can is empty: fill it from its body.'}`);
    } else if (canDoes === 'dry') {
      sound.clank();
      toast('The can was empty: those drops watered nothing. Fill it from its body first.');
    } else toast('The can is full: pour some out before filling it again.');
  });
  // On April Showers' rainbow: a pair from the band lit catches its colour.
  game.on('colour', ({ b, colour }) => {
    sound.colour(colour);
    board.caughtColour(colour, b);
    board.float(DOTS[colour], b);
    setTimeout(() => board.float(`+${POINTS.colour}`, b), 500); // after the pair's own points
    toast(`${BANDS[colour][0].toUpperCase()}${BANDS[colour].slice(1)} caught! ${POINTS.colour} points. Next, ${BANDS[game.bandLit]}.`);
  });
  // On Valentine's box of chocolates: a top taken bites into its chocolate,
  // the chocolate eaten whole is savoured, and one bitten into before it is
  // finished is just eaten.
  game.on('chocolate', ({ b, bitten, savoured, eaten }) => {
    const words = [];
    if (savoured >= 0) {
      sound.savoured();
      board.float('😋', b);
      setTimeout(() => board.float(`+${POINTS.savoured}`, b), 500); // after the pair's own points
      words.push(`Savoured, cup and all! ${POINTS.savoured} points.`);
    }
    if (eaten.length) {
      sound.justEaten();
      words.push(bitten.length > 1 ? 'Two chocolates bitten into at once: neither can be savoured now.' : 'You bit into another before finishing the last: that one is just eaten.');
    }
    if (bitten.length === 1) {
      setTimeout(() => sound.bite(), savoured >= 0 || eaten.length ? 600 : 0);
      words.push('A bite of chocolate: eat the rest of it, cup and all, before biting into another.');
    }
    toast(words.join(' '));
  });
  // On Valentine's first date: a pair with a tile in each candle's glow is
  // candlelit, and every so many matches the candles burn down and their
  // glow sinks a row, until they gutter out.
  game.on('candlelight', ({ b, byCandlelight, sank, guttered }) => {
    const words = [];
    if (byCandlelight) {
      sound.candlelit();
      board.float('🕯️', b);
      setTimeout(() => board.float(`+${POINTS.candlelit}`, b), 500); // after the pair's own points
      words.push(`A candlelit pair! ${POINTS.candlelit} points.`);
    }
    if (sank) {
      setTimeout(() => sound.flicker(), byCandlelight ? 700 : 0);
      words.push('The candles burn down: their glow sinks a row toward the table.');
    }
    if (guttered) {
      setTimeout(() => sound.gutter(), byCandlelight ? 700 : 0);
      words.push('The candles gutter out.');
    }
    toast(words.join(' '));
  });
  // On Valentine's vase of roses: a rose taken in bloom joins the bouquet,
  // one taken in bud is wasted, one left in bloom too long wilts, and every
  // so many matches another opens.
  game.on('rose', ({ b, gathered, wasted, opened, wilted }) => {
    const words = [];
    if (gathered.length) {
      const pts = gathered.length * POINTS.rose;
      sound.gathered();
      board.float('🌹', b);
      setTimeout(() => board.float(`+${pts}`, b), 500); // after the pair's own points
      words.push(`${gathered.length > 1 ? 'Two roses' : 'A rose'} for the bouquet! ${pts} points.`);
    }
    if (wasted.length) {
      sound.snip();
      words.push(wasted.length > 1 ? 'Those roses were still in bud: wasted.' : 'That rose was still in bud: wasted.');
    }
    if (wilted.length) {
      setTimeout(() => sound.wilt(), gathered.length || wasted.length ? 500 : 0);
      words.push(wilted.length > 1 ? 'Two roses wilted before they were taken.' : 'A rose wilted before it was taken.');
    }
    if (opened.length) {
      setTimeout(() => sound.bloom(), gathered.length || wasted.length || wilted.length ? 800 : 0);
      board.opened(opened);
      words.push(`A rose opens: take it with a tile of its kind within ${game.bloom.lasts} matches.`);
    }
    toast(words.join(' '));
  });
  // On Valentine's envelope: the pair with half of a sweet nothing begins
  // it, the pair with its other half, taken straight after, says it, and
  // anything else taken first leaves it unsaid.
  game.on('message', ({ b, said, unsaid, begun }) => {
    const words = [];
    if (said) {
      sound.sweetNothing();
      board.float('💌', b);
      setTimeout(() => board.float(`+${POINTS.message}`, b), 500); // after the pair's own points
      words.push(`${said.join(' ')}! A sweet nothing from your secret admirer: ${POINTS.message} points.`);
    }
    if (unsaid) {
      sound.unsaid();
      words.push(`${unsaid.join(' ')} went unsaid: another pair came between its halves.`);
    }
    if (begun) {
      setTimeout(() => sound.halfSaid(), unsaid ? 600 : 0);
      const [now, next] = [begun.words[begun.first], begun.words[1 - begun.first]];
      words.push(`${now}… Take the pair with ${next} straight after, to say ${begun.words.join(' ')}.`);
    }
    toast(words.join(' '));
  });
  // On New Year's Day: a sweet taken in January breaks the resolution, and
  // a match that sees January out without one keeps it.
  game.on('resolution', ({ b, gaveIn }) => {
    const held = game.daysHeld;
    if (gaveIn) {
      sound.gaveIn();
      board.float('💔', b);
      toast(held ? `You gave in to a sweet: your resolution lasted ${held} ${held === 1 ? 'day' : 'days'}, for ${held * POINTS.held} points.` : "You gave in to a sweet on New Year's Day itself: the resolution is broken.");
      return;
    }
    sound.fanfare();
    board.float('💪', b);
    setTimeout(() => board.float(`+${POINTS.resolution}`, b), 500); // after the pair's own points
    toast(`You made it through January! Your resolution held: ${held * POINTS.held + POINTS.resolution} points. The sweets are fair game now.`);
  });
  // On New Year's 2: the two glasses meet, and clink, a toast.
  game.on('toast', () => {
    const worth = toastWorth(game);
    sound.clink();
    board.clink();
    setTimeout(() => board.meetingAt && board.floatAt(`+${worth}`, board.meetingAt), 600); // after the glasses' own
    toast(`Cheers! The glasses meet and clink: a toast, ${worth} points.`);
  });
  // On New Year's 4: a couple of a colour of confetti, taken together, is
  // a perfect match.
  game.on('confetti', ({ b }) => {
    sound.confetti();
    board.float('✨', b);
    setTimeout(() => board.float(`+${POINTS.perfect}`, b), 500); // after the pair's own points
    toast(`Perfect match! ${POINTS.perfect} points.`);
  });
  // On New Year's 5: burning sparklers taken score what's left of them,
  // sparklers lit as their tiles come free, and others burn out.
  game.on('sparkler', ({ b, sparked, kindled, fizzled }) => {
    const words = [];
    if (sparked.length) {
      const pts = sparked.reduce((sum, s) => sum + s.left, 0) * POINTS.spark;
      sound.sparkler();
      setTimeout(() => board.float(`+${pts}`, b), 500); // after the pair's own points
      words.push(`${sparked.length > 1 ? 'Two sparklers' : 'A sparkler'}, still burning! ${pts} points.`);
    }
    if (fizzled.length) {
      sound.fizzle();
      for (const t of fizzled) board.float('💨', t);
      words.push(fizzled.length > 1 ? `${fizzled.length} sparklers burnt out.` : 'A sparkler burnt out.');
    }
    if (kindled.length) {
      setTimeout(() => sound.light(), sparked.length ? 300 : 0);
      for (const t of kindled) board.float('🎇', t);
      words.push(`${kindled.length > 1 ? `${kindled.length} sparklers are` : 'A sparkler is'} lit: take ${kindled.length > 1 ? 'them' : 'it'} within ${game.burns} matches.`);
    }
    toast(words.join(' '));
  });
  // On New Year's 6: balloons pop, and every so many matches the net opens
  // again, the balloons left floating away and more dropping.
  game.on('balloon', ({ b, popped, net }) => {
    const words = [];
    if (popped.length) {
      sound.pop();
      setTimeout(() => board.float(`+${popped.length * POINTS.balloon}`, b), 500); // after the pair's own points
      words.push(`${popped.length > 1 ? 'Pop, pop' : 'Pop'}! ${popped.length * POINTS.balloon} points.`);
    }
    if (net) {
      setTimeout(() => sound.balloons(), popped.length ? 250 : 0);
      board.netOpened(net);
      const away = net.floated.length;
      if (away) words.push(`${away > 1 ? `${away} balloons float` : 'A balloon floats'} away.`);
      words.push(net.landed.length ? `The net opens: ${net.landed.length === 1 ? 'a balloon drops' : `${net.landed.length} balloons drop`}.` : 'The net opens, but there is nowhere for a balloon to land.');
    }
    toast(words.join(' '));
  });
  // On New Year's 8: a pair taken in the disco ball's beam dances.
  game.on('spotlight', ({ b }) => {
    sound.disco();
    setTimeout(() => board.float(`+${POINTS.spotlight}`, b), 500); // after the pair's own points
    toast(`In the spotlight! ${POINTS.spotlight} points.`);
  });
  game.on('dance', ({ dance }) => {
    sound.waltz();
    toast(dance ? 'The music changes, and the free tiles change partners with tiles held down.' : 'The music changes, but the dancers keep their partners this time.');
  });
  game.on('treat', ({ treat }) => {
    sound.treat();
    toast(gifts.came(gifts.names[treat]));
  });
  game.on('turn', turned);
  game.on('win', () => {
    // its day's music, and the last day's its own, where a holiday has them;
    // on Groundhog Day, as the groundhog forecasts, an early spring under par
    sound.win({ day: runDay, last: runDay >= 0 && runDay === RUNS[runId].days.length - 1, spring: played() < par(game) });
    won();
  });
  game.on('stuck', () => {
    sound.stuck();
    stuck();
  });
  elapsed = playedFor;
  started = 0;
  finished = false;
  cover(true); // until its clock starts
  const turn = game.history.find((e) => e.souls);
  woke = turn ? turn.souls.length : 0;
  prompted = false;
  update();
}

function redo([what, a, b]) {
  if (what === 'm') game.match(a, b);
  else if (what === 'u') game.undo();
  else if (what === 's') game.shuffle();
  else if (what === 'c') game.shuffle({ cat: true });
  else if (what === 'k') game.useKey(a);
  else if (what === 'f') game.save(a);
  else if (what === 'h') game.hint();
  else if (what === 'l') game.useCandle();
}

function record(move) {
  moves.push(move);
  store();
  update();
}

// Starts an hour of the Long Night, or goes on with one from where it was left.
function beginHour(at, keep = null) {
  const spec = HOURS[at];
  const seed = keep ? keep.seed : newSeed();
  play({ layout: spec.layout, options: gameOptions(at), seed, replay: keep ? keep.moves : [], playedFor: keep ? keep.elapsed : 0, at });
  saved.playing = { hour: at, seed, moves, elapsed };
  saved.theme = 'halloween';
  saved.table = 'halloween';
  store();
  history.replaceState(null, '', location.pathname + location.search);
  if (keep) {
    run();
    toast(`Back at ${spec.name}.`);
  } else {
    showCard(`${spec.name}: ${spec.title}`, spec.text, [['Play', () => (hideCard(), run())]]);
  }
}

// The turtles, by their keys: the classic, fifteen tiles across, and the
// upright one, nine across, for a phone held upright.
const TURTLES = ['turtle', 'upright_turtle'];

// The turtle to deal: the classic, unless the upright one's tiles come out
// bigger in the space the board has, as they do on a phone held upright.
function turtleKey() {
  const { width, height } = $('table').getBoundingClientRect();
  return tileFit(layouts.UPRIGHT_TURTLE, width, height) > tileFit(layouts.TURTLE, width, height) ? 'upright_turtle' : 'turtle';
}

// A board outside the night, as often as you like: the turtle that fits the
// screen, or any of the night's boards by name, with or without a midnight.
// It wears the faces of the holiday chosen, as the page wears its look, and
// speaks its words, its treats and its turning over; a day's board wears
// and speaks its holiday's. Like the night's, the board in play is kept,
// to go on with after a reload or a visit to the night: `keep` is that
// board.
let freeKey = 'turtle'; // the board free play deals,
let freeTurn = 0; // and after how many matches its tiles turn over, if they do
function freePlay(key = turtleKey(), seed = newSeed(), turnAt = 0, keep = null) {
  if (!FREE[key]) key = turtleKey();
  // A holiday's board before the holiday opens: a turtle instead. A
  // holiday's boards still being made play freely, to try them.
  const owner = holidayOf(FREE[key]);
  const shut = owner && owner.ready && !isOpen(owner) ? owner : null;
  if (shut) [key, turnAt, keep] = [turtleKey(), 0, null];
  freeKey = key;
  freeTurn = turnAt;
  // A holiday's day's board plays by its day's rules, and gives its own
  // treats or none; any other is told in the words of the tiles it wears.
  const today = dayFor(FREE[key]);
  const { options, ...rest } = today ? dayPlay(today) : { options: {}, faces: holidayFaces(), ...wordsOf(holidayFaces()) };
  if (turnAt) options.turnAt = turnAt;
  play({ layout: FREE[key], options, seed, replay: keep ? keep.moves : [], playedFor: keep ? keep.elapsed : 0, ...rest });
  saved.free = { key, seed, turnAt, moves, elapsed };
  saved.table = 'free';
  store();
  history.replaceState(null, '', `#play/${key}/${seed}${turnAt ? `/${turnAt}` : ''}`);
  const fresh = !(keep && keep.moves.length);
  if (today && fresh) dayCard(today);
  else run();
  if (shut) toast(`${shut.name}'s boards open on ${short(opensOn(shut))}. Until then, a turtle.`);
  else if (!fresh) toast(`Back to your ${game.layout.name.toLowerCase()}.`);
}

// The holiday a board belongs to, which must be open for it to be played:
// the night's are Halloween's, the week's Thanksgiving's, the twelve days'
// Christmas's, the countdown's and New Year's Day's New Year's, the love
// story's Valentine's Day's, April Showers' its own, and the turtle is no
// one's.
function holidayOf(layout) {
  if (HOURS.some((h) => h.layout === layout)) return theme('halloween');
  if (dayOf(layout)) return theme('thanksgiving');
  if (dayOfChristmas(layout)) return theme('christmas');
  if (groundhogOf(layout)) return theme('groundhog');
  if (chapterOf(layout)) return theme('valentines');
  if (showerOf(layout)) return theme('showers');
  return newYearOf(layout) ? theme('new-year') : null;
}

// The day a board is for, if it is one of Thanksgiving week's, one of
// Christmas's twelve, one of New Year's, its countdown's or New Year's
// Day's, a chapter of Valentine's love story or one of April Showers':
// played freely, it plays by that day's rules.
const dayFor = (layout) => dayOf(layout) || dayOfChristmas(layout) || newYearOf(layout) || groundhogOf(layout) || chapterOf(layout) || showerOf(layout);

// ------------- Thanksgiving week, Christmas's twelve days, and New Year's boards

// The holidays played as runs of days, reached in turn, as the Long Night's
// hours are: Thanksgiving week, Christmas's twelve days, New Year's boards,
// the countdown from the 10 to the 1 and then New Year's Day, and
// Valentine's love story, a chapter a board, from Cupid's bow to the ring. For
// each: its days; where its progress is kept in saved, as the night's is;
// and the words its card and its end are told in. New Year's also has the
// ball on its card, dropping a notch with each board of the countdown
// cleared, and words for each one cleared.
const RUNS = {
  thanksgiving: {
    days: DAYS,
    progress: () => saved.week,
    title: 'Thanksgiving week',
    intro: 'Eight boards, one a day from the Sunday before Thanksgiving to the Sunday after. Each day you reach can be played again.',
    begin: 'Begin on the first Sunday',
    back: 'Back to the week',
    meanwhile: 'Thanksgiving week',
    score: "Your week's score",
    over: ['The week is over', 'You have seen Thanksgiving week through, from the traffic there to the Sunday Scaries.'],
  },
  christmas: {
    days: TWELVE_DAYS,
    progress: () => saved.twelve,
    title: 'The Twelve Days of Christmas',
    intro: 'Twelve boards, one for each gift of the song, from a partridge in a pear tree to twelve drummers drumming on Twelfth Night. Each day you reach can be played again.',
    begin: 'Begin on the first day',
    back: 'Back to the twelve days',
    meanwhile: "Christmas's twelve days",
    score: 'Your Christmas score',
    over: ['Twelfth Night is over', 'You have seen the twelve days of Christmas through, from a partridge in a pear tree to the drummers on Twelfth Night.'],
  },
  'new-year': {
    days: NEW_YEAR,
    progress: () => saved.newyear,
    title: "The countdown to New Year's",
    intro: "Ten boards counted down from the 10 to the 1, the ball dropping a notch with each one you clear and landing at midnight, halfway through the 1; then New Year's Day, with a resolution to keep. Each board you reach can be played again.",
    begin: 'Begin the countdown',
    back: 'Back to the countdown',
    meanwhile: "New Year's countdown",
    score: "Your New Year's score",
    over: ['Happy New Year!', 'You have counted the old year out, from the 10 down to midnight, and seen the new one in.'],
    figure: ballFigure,
    cleared: (at) => {
      const left = NEW_YEAR.length - 2 - at; // boards still to clear before the 1's midnight
      if (at < NEW_YEAR.length - 2) return `The ball drops a notch: ${left} ${left === 1 ? 'board' : 'boards'} to midnight.`;
      return at === NEW_YEAR.length - 2 ? 'The ball has landed: happy New Year!' : '';
    },
  },
  valentines: {
    days: LOVE_STORY,
    progress: () => saved.valentines,
    title: "Valentine's Day: a love story",
    intro: 'Eight boards, a love story told a chapter at a time, from Cupid taking aim to the ring, when the question is popped. Each chapter you reach can be played again.',
    begin: 'Begin the first chapter',
    back: 'Back to the love story',
    meanwhile: "Valentine's love story",
    score: "Your Valentine's score",
    over: ['Yes!', 'The question is answered: you have seen the love story through, from Cupid taking aim to the ring.'],
  },
  // Groundhog Day: one board, dealt afresh each day from the date, the
  // same for everyone, and played again as often as one likes (daily).
  groundhog: {
    days: [GROUNDHOG_DAY],
    progress: () => saved.groundhog,
    daily: true,
    title: 'Groundhog Day',
    intro: "It's Groundhog Day, again: one board a day, the same deal for everyone. Play it as often as you like until you get it just right, and come back tomorrow for a new one.",
    begin: "Play today's board",
    back: "Back to today's board",
    meanwhile: "Groundhog Day's board of the day",
    score: '',
    over: ['', ''],
  },
};

// New Year's ball on its pole, for the countdown's card: a notch down for
// each board of the countdown cleared, and landed once the 1 is cleared, or
// with the 1 on the table, once its clock has struck midnight; with the year
// it lands on.
function ballFigure() {
  const reached = saved.newyear.reached;
  const one = NEW_YEAR.length - 2;
  const landed = reached > one || (runId === 'new-year' && runDay === one && Boolean(game) && game.sides.length > 1 && !game.turnAhead);
  return ballDrop(Math.min(reached, one + 1), landed, when(theme('new-year')).start.getFullYear());
}

// A day's name in the middle of a sentence: the first day, Monday, or the 9.
const named = (d) => d.called || d.name.replace(/^The /, 'the ');

// What play() wants for a day's board: its options, the treats it gives or
// none, in its own words or its holiday's, its nap, the words its turning
// over is told in, its holiday's faces: Thanksgiving's, Christmas's, New
// Year's, Groundhog Day's or Valentine's, and Halloween's for a holiday
// whose own are still to come, April Showers'; and its look, the parts of
// a board whose tiles are tinted by them, as May Day's basket is.
function dayPlay(d) {
  const options = { ...dayOptions(d) };
  const napFrom = d.nap ? Math.round((d.layout.count / 2) * d.nap.by) : 0;
  const faces = DAYS.includes(d) ? 'thanksgiving' : TWELVE_DAYS.includes(d) ? 'christmas' : NEW_YEAR.includes(d) ? 'new-year' : d === GROUNDHOG_DAY ? 'groundhog' : LOVE_STORY.includes(d) ? 'valentines' : 'halloween';
  return {
    options,
    treatSet: d.gifts || wordsOf(faces).treatSet,
    treatBar: Boolean(options.treats),
    napAt: napFrom ? { from: napFrom, to: napFrom + d.nap.matches } : null,
    turnSet: d.words || 'midnight',
    faces,
    look: d.look || null,
  };
}

// A day's card, before its board: what is new, and today's list or
// doorbusters, on a board with them.
function dayCard(d) {
  let text = d.text;
  if (game.list) text += ` Today's list: ${listNames(game.list.kinds)}.`;
  if (game.busters) text += ` Today's doorbusters: ${listNames(game.busters.map((b) => MATCH[game.faces[b.tiles[0]]]))}.`;
  showCard(`${d.name}: ${d.title}`, text, [['Play', () => (hideCard(), run())]]);
}

// Starts a day of a run, or goes on with one from where it was left, as
// beginHour does an hour of the night.
function beginDay(id, at, keep = null) {
  const r = RUNS[id];
  const d = r.days[at];
  // Groundhog Day's board is the day's: today's, dealt from the date, or
  // the one in play, kept from the day it was begun.
  if (r.daily) boardDate = keep && keep.date ? keep.date : dayKey(today());
  const seed = keep ? keep.seed : r.daily ? daySeed(boardDate) : newSeed();
  play({ layout: d.layout, seed, replay: keep ? keep.moves : [], playedFor: keep ? keep.elapsed : 0, onDay: at, ofRun: id, ...dayPlay(d) });
  r.progress().playing = r.daily ? { day: at, seed, moves, elapsed, date: boardDate } : { day: at, seed, moves, elapsed };
  saved.theme = id;
  saved.table = id;
  store();
  history.replaceState(null, '', location.pathname + location.search);
  if (keep) {
    run();
    toast(`Back to ${r.daily ? "today's board" : named(d)}.`);
  } else if (r.daily) dailyCard();
  else dayCard(d);
}

// A run's board in progress: kept, with moves made on it, and not yet
// cleared. Choosing the holiday goes back to it; with none, its boards are
// listed, to choose one.
function runInPlay(id) {
  const p = RUNS[id].progress().playing;
  return p && RUNS[id].days[p.day] && stillToday(id, p) && p.moves.length > 0 ? p : null;
}

// Whether a run's board in play is still to be played: always, but on
// Groundhog Day only while it is the day it was the board of.
const stillToday = (id, p) => !RUNS[id].daily || p.date === dayKey(today());

// A day from a run's card: the run's board in play, if it is that day's, or
// else the day dealt afresh, once the player has agreed to give up a board
// begun on another day.
function toDay(id, i) {
  const days = RUNS[id].days;
  const w = runInPlay(id);
  if (w && w.day === i) {
    if (runId === id && runDay === i) {
      hideCard();
      run();
    } else beginDay(id, i, w);
    return;
  }
  if (w && w.moves.length) {
    askToLose({ which: `your board on ${named(days[w.day])}`, then: `${named(days[i])} begins`, go: () => beginDay(id, i), back: () => runMenu(id), keep: 'Keep it' });
    return;
  }
  beginDay(id, i);
}

// A run's score: the best score on each day, added up.
function runScore(id) {
  const scores = Object.values(RUNS[id].progress().scores);
  if (!scores.length) return '';
  return `${RUNS[id].score}, your best each day added up, is ${signed(scores.reduce((a, b) => a + b, 0), '')}.`;
}

// A run's boards, to choose one, as the Long Night's hours are Halloween's:
// shown when the holiday is chosen with none of them in progress. Each day
// reached so far can be played, with its best score, and the latest one
// reached is the one to go on to; the days still to come are greyed out.
function runMenu(id) {
  const r = RUNS[id];
  if (r.daily) return dailyMenu(id);
  hold();
  wear(theme(id));
  sky();
  const reached = r.progress().reached;
  const scores = r.progress().scores;
  const actions = [
    [reached > 0 ? `On to ${named(r.days[reached])}` : r.begin, () => toDay(id, reached)],
    ['Back', showHolidays],
  ];
  const days = r.days.map((d, i) => ({
    label: d.name,
    sub: scores[i] !== undefined ? `★ ${signed(scores[i], '')}` : d.title,
    act: () => toDay(id, i),
    disabled: i > reached,
  }));
  showCard(`${theme(id).icon} ${r.title}`, `${r.intro} ${runScore(id)}`.trim(), actions, days);
  $('card-grid').classList.add('themes'); // room for the days' names
  if (r.figure) showFigure(r.figure());
}

// A day of a run cleared: its best kept, the next day reached, and on its
// last day, the run seen through.
function wonDay(total, time, lines, timing) {
  const id = runId;
  const r = RUNS[id];
  if (r.daily) return dailyWon(total, time, lines, timing);
  const w = r.progress();
  const at = runDay;
  const best = w.scores[at];
  const better = best === undefined || total > best;
  if (better) {
    w.scores[at] = total;
    w.times[at] = Math.floor(time);
  }
  if (!w.best[at] || time < w.best[at]) w.best[at] = time;
  w.reached = Math.max(w.reached, Math.min(at + 1, r.days.length - 1));
  w.playing = null;
  store();
  const note = best === undefined ? '' : better ? ' Your best yet.' : ` Your best is ${signed(best, '')}.`;
  if (at === r.days.length - 1) {
    showCard(r.over[0], `${r.over[1]} ${runScore(id)}`, [
      ['Begin again', () => beginDay(id, 0)],
      ['Holidays', showHolidays],
    ], [], lines);
  } else {
    const words = r.cleared ? ` ${r.cleared(at)}` : '';
    showCard(`${r.days[at].name}: cleared`, `${timing}${note}${words}`, [
      [`On to ${named(r.days[at + 1])}`, () => beginDay(id, at + 1)],
      ['Play it again', () => beginDay(id, at)],
    ], [], lines);
  }
}

// ------------------------------------------------------------ Groundhog Day

// Groundhog Day's card, shown when it is chosen with today's board not in
// progress: today's board, the same for everyone, to play as often as you
// like; the best today, the days in a row cleared, and the week's days,
// each with its best, today's to play.
function dailyMenu(id) {
  const r = RUNS[id];
  hold();
  wear(theme(id));
  sky();
  const key = dayKey(today());
  const days = r.progress().days;
  const actions = [
    [days[key] && days[key].clears ? 'Play it again' : r.begin, () => beginDay(id, 0)],
    ['Back', showHolidays],
  ];
  const week = weekTo(key).map((k) => ({
    label: new Date(`${k}T12:00`).toLocaleDateString('en-US', { weekday: 'short' }),
    sub: days[k] && days[k].score !== undefined ? `★ ${signed(days[k].score, '')}` : k === key ? 'today' : '–',
    act: () => beginDay(id, 0),
    disabled: k !== key,
    on: k === key,
  }));
  showCard(`${theme(id).icon} ${r.title}`, `${r.intro}${dailyWords(key)}`, actions, week);
}

// How a day's board has gone: the best so far, how often cleared, and the
// days in a row cleared, up to it.
function dailyWords(key) {
  const day = saved.groundhog.days[key];
  const streak = streakOf(saved.groundhog.days, key);
  const best = day && day.score !== undefined ? ` Your best today is ${signed(day.score, '')}${day.clears > 1 ? `, cleared ${day.clears} times` : ''}.` : '';
  return `${best}${streak > 1 ? ` You've cleared the board of the day ${streak} days in a row.` : ''}`;
}

// The card before the day's board: what Groundhog Day is, and the best so far.
function dailyCard() {
  const d = GROUNDHOG_DAY;
  showCard(`${d.name}: ${short(new Date(`${boardDate}T12:00`))}`, `${d.text}${dailyWords(boardDate)}`, [['Play', () => (hideCard(), run())]]);
}

// The day's board cleared: the best for its day kept, how often it has been
// cleared, and the groundhog's forecast, an early spring for a board
// cleared under par and otherwise six more weeks of winter. To play again,
// the same deal, while the day lasts.
function dailyWon(total, time, lines, timing) {
  const id = runId;
  const g = RUNS[id].progress();
  const key = boardDate;
  const day = g.days[key] || { clears: 0 };
  const best = day.score;
  const better = best === undefined || total > best;
  if (better) Object.assign(day, { score: total, time: Math.floor(time) });
  day.clears = (day.clears || 0) + 1;
  g.days[key] = day;
  for (const old of Object.keys(g.days).sort().slice(0, -400)) delete g.days[old]; // a year and more is plenty
  g.playing = null;
  store();
  const early = time < par(game);
  const note = best === undefined ? '' : better ? ' Your best today yet.' : ` Your best today is ${signed(best, '')}.`;
  const streak = streakOf(g.days, key);
  const forecast = early ? 'Under par, the groundhog sees no shadow. 🌷' : 'The groundhog sees his shadow. ❄️ Clear it under par for an early spring.';
  showCard(early ? 'An early spring!' : 'Six more weeks of winter', `${timing} ${forecast}${note}${streak > 1 ? ` That's ${streak} days in a row.` : ''}`, [
    ['Play it again', () => beginDay(id, 0)],
    ['Holidays', showHolidays],
  ], [], lines);
}

function turned({ souls }) {
  woke = souls.length;
  const night = game.sideName === 'night';
  sound[turnWords.ring(night)]();
  toast(`${turnWords.turned(night)} ${turnWords.woke(woke)}`);
  // On New Year's, fireworks over the board: as the clock finishes
  // striking twelve, or with no sound, once the tiles have turned.
  if (turnWords.fireworks) {
    const wait = sound.on ? 3600 : 1000;
    ['🎆', '🎉', '🎇', '🥳', '🎆'].forEach((s, k) => setTimeout(() => board.float(s, game.freeTiles()[k * 3] ?? -1), wait + k * 220));
  }
  const earned = woke ? woke * POINTS.soul : POINTS.clean;
  setTimeout(() => board.float(signed(earned), -1, earned < 0), 900); // once the tiles have turned
  update();
}

// A cleared board: its score, line by line, and the best for its hour kept.
function won() {
  finished = true;
  hold();
  const time = played();
  const { total, rows } = scoreOf(game, time, turnWords.score);
  const lines = [...rows, ['Score', '', total]];
  const timing = `In ${clock(time)}, against a par of ${clock(par(game))}.`;
  update();
  if (runDay >= 0) return wonDay(total, time, lines, timing);
  if (hour < 0) {
    saved.free = null;
    store();
    showCard('The board is clear!', timing, [['Deal again', dealAgain], ['Holidays', showHolidays]], [], lines);
    return;
  }
  const spec = HOURS[hour];
  const best = saved.scores[hour];
  const better = best === undefined || total > best;
  if (better) {
    saved.scores[hour] = total;
    saved.times[hour] = Math.floor(time);
  }
  if (!saved.best[hour] || time < saved.best[hour]) saved.best[hour] = time;
  saved.reached = Math.max(saved.reached, Math.min(hour + 1, HOURS.length - 1));
  saved.playing = null;
  store();
  const note = best === undefined ? '' : better ? ' Your best yet.' : ` Your best is ${signed(best, '')}.`;
  if (hour === HOURS.length - 1) {
    showCard('Dawn', `The sun is up, and you have seen the Long Night through. ${nightScore()}`, [
      ['Begin again', () => beginHour(0)],
      ['Holidays', showHolidays],
      ...toLeaderboard(boardOf(hour)),
    ], [], lines);
  } else {
    showCard(`${spec.name}: cleared`, `${timing}${note}`, [
      [`On to ${HOURS[hour + 1].name}`, () => beginHour(hour + 1)],
      ['Play it again', () => beginHour(hour)],
      ...toLeaderboard(boardOf(hour)),
    ], [], lines);
  }
  if (better && hour === HOURS.length - 1) postAndRank(NIGHT, Object.values(saved.scores).reduce((a, b) => a + b, 0));
  else if (better) postAndRank(boardOf(hour), total);
}

// The night score: the best score at each hour, added up.
function nightScore() {
  const scores = Object.values(saved.scores);
  if (!scores.length) return '';
  return `Your night score, your best at each hour added up, is ${signed(scores.reduce((a, b) => a + b, 0), '')}.`;
}

function stuck() {
  const actions = [['Shuffle', () => help('shuffle')], ['Undo', () => help('undo')]];
  if (game.treats.cat) actions.unshift([gifts.buttons.cat, () => help('cat')]);
  if (game.treats.key) actions.push([gifts.buttons.key, () => help('key')]);
  actions.push(['Give up', giveUp]);
  showCard('No pairs left', 'Shuffle the tiles left, take back a move, or give up the board.', actions);
}

// Halloween's boards, the Long Night's hours, to choose one: shown when the
// holiday is chosen with none of them in progress. Each hour reached so far
// can be played, with its best score, and the latest one reached is the one
// to go on to; the hours still to come are greyed out. And the leaderboard.
function menu() {
  hold();
  wear(theme('halloween'));
  sky();
  const actions = [[saved.reached > 0 ? `On to ${HOURS[saved.reached].name}` : 'Begin at 6 pm', () => toHour(saved.reached)]];
  if (leaderboard.on) actions.push(['Leaderboard', () => showLeaderboard(NIGHT)]);
  actions.push(['Back', showHolidays]);
  const hours = HOURS.map((h, i) => ({
    label: h.name,
    sub: saved.scores[i] !== undefined ? `★ ${signed(saved.scores[i], '')}` : '',
    act: () => toHour(i),
    disabled: i > saved.reached,
  }));
  const intro = 'Thirteen boards, one an hour from dusk to dawn. Each hour you reach can be played again.';
  showCard('The Long Night', `${intro} ${nightScore()}`.trim(), actions, hours);
}

// The switches under the holidays in the menu: the magnifier, and dimming.
function showOptions() {
  $('magnify').checked = magnifying;
  $('dim').checked = dimming;
  $('card-options').hidden = false;
}

// The night's board in progress: kept, with moves made on it, and not yet
// cleared. Choosing Halloween goes back to it; with none, its hours are
// listed, to choose one.
function nightInPlay() {
  const p = saved.playing;
  return p && HOURS[p.hour] && p.moves.length > 0 ? p : null;
}

// An hour from the menu: the night's board in play, if it is at that hour,
// or else the hour dealt afresh, once the player has agreed to give up a
// board begun at another hour.
function toHour(i) {
  const night = nightInPlay();
  if (night && night.hour === i) {
    if (hour === i) {
      hideCard();
      run();
    } else beginHour(i, night);
    return;
  }
  if (night && night.moves.length) {
    askToLose({ which: `your board at ${HOURS[night.hour].name}`, then: `${HOURS[i].name} begins`, go: () => beginHour(i), back: () => menu(), keep: 'Keep it' });
    return;
  }
  beginHour(i);
}

// The turtle: the one on the table, or kept, if there is one, or else a new
// deal, once the player has agreed to give up any other board begun outside
// the holidays' own.
function toTurtle() {
  const f = saved.free;
  if (f && TURTLES.includes(f.key) && hour < 0 && runDay < 0 && game && !finished) {
    hideCard();
    run();
  } else if (f && TURTLES.includes(f.key)) freePlay(f.key, f.seed, f.turnAt, f);
  else if (f && f.moves.length) {
    askToLose({ which: `your ${FREE[f.key].name.toLowerCase()}`, then: 'a turtle is dealt', go: () => freePlay(turtleKey()), back: showHolidays, keep: 'Keep it' });
  } else freePlay(turtleKey());
}

// Another deal of the board free play dealt last: a turtle deals the one
// that fits the screen now, which may have been turned since.
const dealAgain = () => freePlay(TURTLES.includes(freeKey) ? turtleKey() : freeKey, newSeed(), freeTurn);

// Gives up the board in play, once the player has said so: an hour of the
// night or a day of a run deals afresh, with no moves on it, and its
// holiday's boards come up, to choose one; today's board on Groundhog Day
// starts over; and outside them, a new board is dealt.
function giveUp() {
  const [h, id, at] = [hour, runId, runDay];
  const daily = at >= 0 && RUNS[id].daily;
  askToLose({
    which: 'this board',
    then: daily ? "today's board starts over" : h >= 0 || at >= 0 ? 'you choose a board again' : 'a new one is dealt',
    go: h >= 0 ? () => (beginHour(h), menu()) : daily ? () => beginDay(id, at) : at >= 0 ? () => (beginDay(id, at), runMenu(id)) : dealAgain,
    back: () => (hideCard(), run()),
  });
}

// A new deal outside the night: at once, unless this one has moves to lose.
function newDeal() {
  if (!finished && moves.length) giveUp();
  else dealAgain();
}

// Asks before throwing away a board with moves on it: which board, and what
// happens instead. The way back, `keep`, comes first, so that a key pressed
// without thinking keeps the board.
function askToLose({ which, then, go, back, keep = 'Keep playing' }) {
  hold();
  showCard(`Give up ${which}?`, `The moves made on it will be lost, and ${then}.`, [[keep, back], ['Give up', go]]);
}

// ----------------------------------------------------------- the holidays

// The holiday whose look the page wears: Halloween's while the Long Night
// is on the table, Thanksgiving's or Christmas's while a day of theirs is,
// and otherwise the one chosen last, whose faces the board then wears too,
// unless it is one of a holiday's days played freely. Another holiday
// chosen with the turtle on the table changes its tiles with its colours,
// and its music and words with them.
function applyTheme() {
  wear(theme(hour >= 0 ? 'halloween' : runDay >= 0 ? runId : saved.theme) || theme('halloween'));
  // The day is found by the key free play dealt: a board with a fridge
  // plays on a layout of its own, with the containers added.
  const faces = hour < 0 && runDay < 0 && !dayFor(FREE[freeKey]) ? holidayFaces() : faceSet;
  if (faces !== faceSet) {
    board.setFaces((faceSet = faces));
    sound.use(faceSet); // and its music
    speak(wordsOf(faceSet)); // and its words
  }
}

// The faces of the holiday chosen last, for a board outside the night and the
// week: Halloween's while that holiday's own are still to come.
const holidayFaces = () => (FACE_SETS.includes(saved.theme) ? saved.theme : 'halloween');

// A holiday's look: its colour as the accent, and Halloween its own
// lettering. With no holiday, Seasons' own, for choosing them.
function wear(t) {
  const body = document.body;
  body.dataset.theme = t ? t.id : 'seasons';
  if (t) body.style.setProperty('--accent', t.accent);
  else body.style.removeProperty('--accent');
}

// The board on the table: one of Halloween's, one of a run's, the turtle,
// or none of these, for a holiday's board played freely by its address.
const onTable = () => (hour >= 0 ? 'halloween' : runDay >= 0 ? runId : TURTLES.includes(freeKey) ? 'turtle' : null);

// The menu: the holidays, to choose one. Those open come first, then the
// rest, greyed out, each saying when it opens, or soon for one whose boards
// are still to come; and the turtle, always there. With a board on the
// table, back to it or give it up; and under it all, the switches. On a
// first visit a turtle is dealt behind it, to look at.
function showHolidays(opening = false) {
  hold();
  if (opening === true) cover(false);
  wear(null);
  sky();
  const here = onTable();
  const grid = menuList().map((e) => ({
    label: `${e.theme.icon} ${e.theme.name}`,
    sub: e.note,
    disabled: !e.open,
    on: e.theme.id === here,
    act: () => openHoliday(e.theme.id),
  }));
  grid.push({ label: '🐢 The turtle', sub: 'any time', on: here === 'turtle', act: toTurtle });
  const actions = [];
  if (game && !finished && opening !== true) actions.push(['Back to the board', () => (hideCard(), run())]);
  if (game && !finished && moves.length) actions.push(['Give up this board', giveUp]);
  const text = 'Choose a holiday to play its boards, or the turtle. Each holiday opens weeks before its day, to build up to it, and stays open to the end of the year; Groundhog Day is open all year.';
  showCard('Holidays', text, actions, grid);
  $('card-grid').classList.add('themes');
  showOptions();
}

// A holiday chosen: back to its board in progress, if it has one, or else
// its boards, to choose one. From now on the turtle wears its tiles.
function openHoliday(id) {
  saved.theme = id;
  store();
  const p = id === 'halloween' ? nightInPlay() : runInPlay(id);
  if (!p && id === 'halloween') menu();
  else if (!p) runMenu(id);
  else if (onTable() === id) {
    hideCard();
    run();
  } else if (id === 'halloween') beginHour(p.hour, p);
  else beginDay(id, p.day, p);
}

// -------------------------------------------------------- the leaderboard

// The win card's way to the leaderboard: straight there, or by joining it
// first, for a player who has not yet said whether they would.
function toLeaderboard(where) {
  if (!leaderboard.on) return [];
  if (!saved.name && !saved.declined) return [['Join the leaderboard', () => askName(() => showLeaderboard(where))]];
  return [['Leaderboard', () => showLeaderboard(where)]];
}

// Puts the player's bests on the leaderboard, those not there yet: each
// hour's, with the time it took, and the night's, the bests added up. What
// cannot go now goes the next time. One posting at a time.
let posting = Promise.resolve();
function postScores() {
  posting = posting.then(sendScores).catch(() => {});
  return posting;
}

async function sendScores() {
  if (!leaderboard.on || !saved.name) return;
  const due = (where, score) => {
    const was = saved.posted[where];
    return score >= 0 && !(was && was.score === score && was.name === saved.name);
  };
  const entries = [];
  for (const [h, score] of Object.entries(saved.scores)) {
    const where = boardOf(Number(h));
    if (due(where, score)) entries.push({ board: where, name: saved.name, score, seconds: Math.floor(saved.times[h] ?? saved.best[h]) });
  }
  const bests = Object.values(saved.scores);
  const night = bests.reduce((a, b) => a + b, 0);
  if (bests.length && due(NIGHT, night)) entries.push({ board: NIGHT, name: saved.name, score: night, hours: bests.length });
  if (!entries.length) return;
  for (const e of await leaderboard.post(entries)) saved.posted[e.board] = { score: e.score, name: e.name };
  store();
}

// After a new best, up it goes, and the win card, while it is still up,
// says where it stands.
async function postAndRank(where, score) {
  if (!leaderboard.on || !saved.name) return;
  const title = $('card-title').textContent;
  const still = () => !$('card').hidden && $('card-title').textContent === title;
  await postScores();
  if (!still() || !saved.posted[where] || saved.posted[where].score !== score) return;
  try {
    const place = ordinal(await leaderboard.rank(where, score));
    if (!still()) return;
    $('card-text').textContent += where === NIGHT ? ` Your night is ${place} on the leaderboard.` : ` That's ${place} on the leaderboard.`;
  } catch {}
}

// The leaderboard's card: the best ten on a board, and the player's own
// place if they are further down, with every board to choose from.
let shown = null; // the board the card shows, while it is up
async function showLeaderboard(where) {
  hold();
  const grid = BOARDS.map((b) => ({
    label: nameOf(b),
    sub: saved.posted[b] ? `★ ${saved.posted[b].score.toLocaleString()}` : '',
    act: () => showLeaderboard(b),
    on: b === where,
  }));
  const actions = [
    ['Back', showHolidays],
    [saved.name ? 'Your name' : 'Join the leaderboard', () => askName(() => showLeaderboard(where))],
  ];
  const about = where === NIGHT ? "The whole night: each player's best at every hour, added up." : `The best at ${nameOf(where)}.`;
  showCard('Leaderboard', `${about} Fetching…`, actions, grid);
  showRanks([], null); // its ten places, empty, so that nothing moves when they come
  shown = where;
  try {
    const rows = await leaderboard.top(where);
    const mine = saved.posted[where];
    let below = null; // the player, when they are on the board but not in its first ten
    if (mine && leaderboard.me && !rows.some((r) => r.id === leaderboard.me)) {
      below = { name: mine.name, score: mine.score, place: await leaderboard.rank(where, mine.score) };
    }
    if (shown !== where) return;
    $('card-text').textContent = rows.length ? about : `${about} No one is on it yet.`;
    showRanks(rows, below);
  } catch {
    if (shown === where) $('card-text').textContent = `${about} The leaderboard can't be reached just now.`;
  }
}

function showRanks(rows, below) {
  const table = $('card-ranks');
  table.replaceChildren();
  const add = (place, name, score, me) => {
    const tr = table.insertRow();
    if (me) tr.className = 'me';
    tr.insertCell().textContent = place;
    tr.insertCell().textContent = name;
    tr.insertCell().textContent = score.toLocaleString();
  };
  rows.forEach((r, k) => add(k + 1, r.name, r.score, r.id === leaderboard.me));
  for (let k = rows.length; k < 10; k++) table.insertRow().insertCell().colSpan = 3;
  if (below) {
    const gap = table.insertRow().insertCell();
    gap.colSpan = 3;
    gap.textContent = '⋯';
    add(below.place, below.name, below.score, true);
  }
  table.hidden = false;
}

// The card for joining the leaderboard, or for changing the name on it or
// coming off it. `then` is where to go afterwards.
function askName(then) {
  hold();
  const joined = Boolean(saved.name);
  const input = $('card-input');
  const save = async () => {
    const name = tidy(input.value);
    const problem = nameProblem(name);
    if (problem) {
      $('card-text').textContent = problem;
      input.focus();
      return;
    }
    saved.name = name;
    saved.declined = false;
    store();
    $('card-text').textContent = 'Putting your best scores up…';
    await postScores();
    then();
  };
  const actions = [['Save', save]];
  if (joined) actions.push(['Leave the leaderboard', () => leave(then)]);
  actions.push([
    joined ? 'Back' : 'Not now',
    () => {
      if (!joined) {
        saved.declined = true;
        store();
      }
      then();
    },
  ]);
  showCard(joined ? 'Your name' : 'Join the leaderboard', 'The name everyone will see beside your best scores: 16 letters at most.', actions);
  input.hidden = false;
  input.value = saved.name;
  input.onkeydown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      save();
    }
  };
  input.focus();
}

// Takes the player's scores off every board, and forgets their name.
async function leave(then) {
  $('card-text').textContent = 'Taking your scores down…';
  try {
    await posting;
    await leaderboard.leave();
  } catch {
    $('card-text').textContent = "The leaderboard can't be reached just now: try again later.";
    return;
  }
  saved.name = '';
  saved.declined = true;
  saved.posted = {};
  store();
  toast('Your scores are off the leaderboard.');
  then();
}

// 1st, 2nd, 3rd, 4th, ... 11th, 12th, 13th, ... 21st.
function ordinal(n) {
  const teen = n % 100 >= 11 && n % 100 <= 13;
  return `${n.toLocaleString()}${(!teen && { 1: 'st', 2: 'nd', 3: 'rd' }[n % 10]) || 'th'}`;
}

// --------------------------------------------------------- what's showing

function update() {
  const g = game;
  $('where').innerHTML =
    hour >= 0
      ? `${theme('halloween').icon} <b>${HOURS[hour].name}</b> ${HOURS[hour].layout.name}`
      : runDay >= 0
        ? `${theme(runId).icon} <b>${RUNS[runId].days[runDay].name}</b> ${RUNS[runId].daily ? short(new Date(`${boardDate}T12:00`)) : RUNS[runId].days[runDay].title}`
        : `<b>Free play</b> ${g.layout.name}`;
  applyTheme();
  $('new').hidden = hour >= 0 || runDay >= 0; // the night's and the runs' boards deal by their own cards
  $('left').innerHTML = `<b>${g.left}</b> tiles`;
  $('score').innerHTML = `★ <b>${signed(scoreOf(g, played(), turnWords.score).total, '')}</b>`;
  const turns = g.sides.length > 1;
  const night = g.sideNames[1] === 'night';
  $('clock').hidden = !turns;
  if (turns) $('clock').innerHTML = g.turnAhead ? turnWords.ahead(g.untilTurn, night) : turnWords.after(night);
  $('souls').hidden = !turns;
  $('souls').title = g.turnAhead ? turnWords.soulsAhead : turnWords.soulsWoke;
  $('souls').innerHTML = `${turnWords.soul} <b>${g.turnAhead ? g.soulsIfNow() : woke}</b>`;
  // The touchdowns scored, on a football board.
  $('touchdowns').hidden = !g.zones;
  if (g.zones) $('touchdowns').innerHTML = `🏈 <b>${g.touchdowns}</b>`;
  // The eggs still to hatch, on a board of hens.
  $('eggs').hidden = !g.eggs;
  if (g.eggs) $('eggs').innerHTML = `🥚 <b>${g.eggsLeft}</b>`;
  // The pairs that flocked together, on a board of songbirds.
  $('flocks').hidden = !g.rules.flock;
  if (g.rules.flock) $('flocks').innerHTML = `🐦 <b>${g.flocks}</b>`;
  // The rings turned to gold, on the board of gold rings.
  $('rings').hidden = !g.rings;
  if (g.rings) $('rings').innerHTML = `💍 <b>${g.goldRings}</b>`;
  // The goslings in the line so far, on the board of geese, of the number
  // that make a brood.
  $('goslings').hidden = !g.rules.goslings;
  if (g.rules.goslings) $('goslings').innerHTML = `🐣 <b>${g.trail}</b>/${g.rules.goslings}`;
  // The swans found, on the lake, out of those found and still to find.
  $('swans').hidden = !g.swans;
  if (g.swans) $('swans').innerHTML = `🦢 <b>${g.swansFound}</b>/${g.swansFound + g.swans.length}`;
  // The pails of milk taken while fresh, on the milk pail, out of them all.
  $('milk').hidden = !g.pails;
  if (g.pails) $('milk').innerHTML = `🥛 <b>${g.pailsTaken}</b>/${g.pails.length}`;
  // The matches until the music changes, on the board of the dancer, while
  // there are tiles held down to change partners with.
  $('dance').hidden = !g.rules.dance || !g.canDance;
  if (g.rules.dance) $('dance').innerHTML = `💃 <b>${g.untilDance}</b>`;
  // The lords still on the board, on the crown.
  $('lords').hidden = !g.lords;
  if (g.lords) $('lords').innerHTML = `👑 <b>${g.lordsLeft}</b>`;
  // The pipers still on the board, on the bagpipes.
  $('pipers').hidden = !g.pipers;
  if (g.pipers) $('pipers').innerHTML = `🎶 <b>${g.pipersLeft}</b>`;
  // The rockets still to set off, on New Year's 9.
  $('rockets').hidden = !g.rockets;
  if (g.rockets) $('rockets').innerHTML = `🚀 <b>${g.rocketsLeft}</b>`;
  // The pairs that have danced in the disco ball's beam, on New Year's 8.
  $('disco').hidden = !g.rules.disco;
  if (g.rules.disco) $('disco').innerHTML = `🪩 <b>${g.spotlights}</b>`;
  // The balloons to pop, and the matches until the net opens again, on New
  // Year's 6.
  $('balloons').hidden = !g.balloons;
  if (g.balloons) $('balloons').innerHTML = `🎈 <b>${g.balloonsLeft}</b> · ⏳ <b>${g.untilDrop}</b>`;
  // On New Year's 7, how close the last pair came to the lucky coin, or
  // that it is found.
  $('coin').hidden = g.coin < 0;
  if (g.coin >= 0) $('coin').innerHTML = g.foundAt ? '🪙 <b>found</b>' : `🪙 ${g.reading ? `${HEAT[g.reading]} <b>${g.reading}</b>` : '<b>?</b>'}`;
  // On New Year's 5, the sparklers still to take, unlit or burning.
  $('sparklers').hidden = !g.sparklers;
  if (g.sparklers) $('sparklers').innerHTML = `🎇 <b>${g.sparklersLeft}</b>`;
  // On New Year's 4, the perfect matches taken.
  $('confetti').hidden = !g.confetti;
  if (g.confetti) $('confetti').innerHTML = `✨ <b>${g.perfects}</b>`;
  // On New Year's 3, the wishes made, and the matches until the next star.
  $('stars').hidden = !g.starEvery;
  if (g.starEvery) $('stars').innerHTML = `🌠 <b>${g.wishes}</b> · ⏳ <b>${g.untilStar}</b>`;
  // On New Year's Day, the days of January the resolution has held, or
  // whether it was kept or broken.
  $('resolution').hidden = !g.sweets;
  if (g.sweets) $('resolution').innerHTML = g.brokenAt ? `💔 <b>day ${g.brokenAt}</b>` : g.resolutionKept ? '💪 <b>kept</b>' : `📅 <b>${g.daysHeld}</b>/${g.january}`;
  // On New Year's 2, the places still between the two glasses, or the toast.
  $('glasses').hidden = !g.path;
  if (g.path) $('glasses').innerHTML = g.toastAt ? '🥂 <b>cheers!</b>' : `🥂 <b>${g.glassesApart}</b>`;
  // On Valentine's pierced heart, the couples taken together, love at first
  // sight.
  $('arrows').hidden = !g.arrowEvery;
  if (g.arrowEvery) $('arrows').innerHTML = `💘 <b>${g.loves}</b>`;
  // On Valentine's envelope, the sweet nothings said, of them all.
  $('messages').hidden = !g.messages;
  if (g.messages) $('messages').innerHTML = `💌 <b>${g.messagesSaid}</b>/${g.messages.length}`;
  // On Valentine's vase of roses, the roses in the bouquet, of the dozen.
  $('roses').hidden = !g.roses;
  if (g.roses) $('roses').innerHTML = `🌹 <b>${g.bouquet}</b>/${g.roses.length}`;
  // On Valentine's hugs and kisses, the XOXOs made, and the run so far.
  $('kisses').hidden = !g.xoxo;
  if (g.xoxo) $('kisses').innerHTML = `💋 <b>${g.xoxos}</b>${g.run ? ` · <b>${g.run}</b>` : ''}`;
  // On Valentine's box of chocolates, the chocolates savoured, of the nine.
  $('chocolates').hidden = !g.chocolates;
  if (g.chocolates) $('chocolates').innerHTML = `🍫 <b>${g.chocolatesIn('savoured')}</b>/${g.chocolates.length}`;
  // On Valentine's first date, the candlelit pairs, and while the candles
  // burn, the matches until their glow sinks.
  $('candles').hidden = !g.candles;
  if (g.candles) $('candles').innerHTML = `🕯️ <b>${g.candlelitPairs}</b>${g.glowTop >= 0 ? ` · ⏳ <b>${g.untilSink}</b>` : ''}`;
  // On April Showers' umbrella, the raindrops caught, and the matches until
  // the next lands, while one still can.
  $('raindrops').hidden = !g.rain;
  if (g.rain) $('raindrops').innerHTML = `💧 <b>${g.dropsCaught}</b>${g.untilRain !== Infinity ? ` · ⏳ <b>${g.untilRain}</b>` : ''}`;
  // On its rain boots, the splashes in a row now, and while the puddle has a
  // splash left in it, what the next would score.
  // On its flower bed, the honey made, of the tulips.
  $('honey').hidden = !g.tulips;
  if (g.tulips) $('honey').innerHTML = `🍯 <b>${g.honey}</b>/${g.tulips.length}`;
  // On its watering can, how full it is, and the pours made.
  $('can').hidden = !g.can;
  if (g.can) $('can').innerHTML = `💧 <b>${g.canLevel}</b>/${g.canMost} · 🌼 <b>${g.pours}</b>`;
  // On its seed tray, the blooms picked, of the seedlings.
  $('blooms').hidden = !g.garden;
  if (g.garden) $('blooms').innerHTML = `🌷 <b>${g.seedlingsIn('picked')}</b>/${g.garden.seedlings.length}`;
  // On its rainbow, the colours caught, and the bands lit now and next.
  $('colours').hidden = g.colourClouds === null;
  if (g.colourClouds !== null) $('colours').innerHTML = `🌈 <b>${g.coloursCaught}</b> · ${DOTS[g.bandLit]} → ${DOTS[g.bandNext]}`;
  $('splashes').hidden = g.puddleEdge === null;
  if (g.puddleEdge !== null) $('splashes').innerHTML = `💦 <b>${g.splashRun}</b>${g.puddleLeft >= 2 ? ` · <b>+${g.nextSplash * POINTS.splash}</b>` : ''}`;
  // The lovebirds taken, on a board of turtle doves.
  $('lovebirds').hidden = !g.rules.lovebirds;
  if (g.rules.lovebirds) $('lovebirds').innerHTML = `🕊️ <b>${g.lovebirds}</b>`;
  // The nap, on a board with one: the matches until it, and while everyone
  // sleeps, the matches left of it.
  $('nap').hidden = !nap || g.matches >= nap.to;
  if (nap) {
    $('nap').innerHTML = napping() ? `💤 <b>${nap.to - g.matches}</b>` : `😴 in <b>${nap.from - g.matches}</b>`;
    $('nap').title = napping() ? 'Everyone is napping, and the clock has stopped' : `The nap: after ${nap.from} matches, the clock stops for ${nap.to - nap.from}`;
  }
  for (const t of ['candle', 'key', 'cat']) {
    $(t).querySelector('.count').textContent = g.treats[t];
    $(t).classList.toggle('none', !g.treats[t]);
  }
  $('key').classList.toggle('on', board.keying);
  showList();
  showDeals();
  $('pause').disabled = finished;
  $('undo').disabled = !g.history.length;
  $('moon').disabled = !g.turnAhead;
  document.body.classList.toggle('night', g.sideName === 'night');
  sky();
  if ((hour === MIDNIGHT || turnWords !== TURNS.midnight) && g.turnAhead && g.untilTurn === 3 && !prompted) {
    prompted = true;
    toast(turnWords.prompt);
  }
  tick();
}

// The sky behind the board: the hour's own, or the dawn once the sun is up;
// on a day of a run, the day's; and outside them, the sky of the holiday
// chosen last; but for the night sky of the page's styles once the tiles
// turn over.
function sky() {
  const s = document.body.style;
  let colours = null;
  if (hour >= 0) {
    const spec = HOURS[hour];
    colours = spec.dawn && game.sideName === 'day' ? spec.dawn : spec.sky;
  } else if (game.sideName !== 'night') colours = runDay >= 0 ? RUNS[runId].days[runDay].sky : (theme(saved.theme) || theme('halloween')).sky;
  if (colours) {
    s.setProperty('--sky-top', colours[0]);
    s.setProperty('--sky-low', colours[1]);
  } else {
    s.removeProperty('--sky-top');
    s.removeProperty('--sky-low');
  }
}

// The words the board in play is told in (words.js): its turning over, and
// its treats, whose buttons show while it gives them.
function speak({ turnSet, treatSet }, bar = true) {
  turnWords = TURNS[turnSet] || TURNS.midnight;
  $('moon').title = turnWords.moon;
  showGifts(treatSet, bar);
  if (board) board.keyName = gifts.keyName;
}

// The treat buttons in the board's own words, with their icons, the key's
// on a tile it freed too; hidden on a day's board with no treats, as none
// will come.
function showGifts(set, bar) {
  gifts = GIFTS[set] || GIFTS.halloween;
  for (const t of ['candle', 'key', 'cat']) {
    $(t).querySelector('.icon').firstChild.textContent = gifts.icons[t];
    $(t).title = gifts.help[t].replace(/\.$/, '');
  }
  document.querySelector('.treats').hidden = !bar;
  $('board').style.setProperty('--key-icon', JSON.stringify(gifts.icons.key));
}

// The shopping list, on a board with one: a small tile for each thing on
// it, ticked once it is crossed off, and the matches left before checkout.
function showList() {
  const g = game;
  const el = $('list');
  el.hidden = !g.list;
  if (!g.list) return;
  el.querySelector('.things').replaceChildren(
    ...g.list.kinds.map((k) => {
      const tile = document.createElement('span');
      tile.className = g.crossed.includes(k) ? 'tile done' : 'tile';
      tile.innerHTML = `<svg viewBox="0 0 60 80" aria-hidden="true"><use href="#${symbolId(KINDS[k].faces[0], faceSet)}"/></svg>`;
      return tile;
    }),
  );
  const found = g.crossed.length;
  const all = found === g.list.kinds.length;
  el.querySelector('.checkout').textContent = all ? 'all found' : g.listOpen ? `${g.untilCheckout} to checkout` : 'checked out';
  el.setAttribute('aria-label', `Shopping list, ${found} of ${g.list.kinds.length} found: ${listNames(g.list.kinds)}`);
}

// Black Friday's doorbusters, on a board with them: a small tile for each,
// ticked once bought, crossed once another shopper grabs it, and the
// matches before the next grab.
function showDeals() {
  const g = game;
  const el = $('deals');
  el.hidden = !g.busters;
  if (!g.busters) return;
  el.querySelector('.things').replaceChildren(
    ...g.busters.map((d) => {
      const tile = document.createElement('span');
      tile.className = { open: 'tile', mine: 'tile done', gone: 'tile grabbed' }[d.state];
      tile.innerHTML = `<svg viewBox="0 0 60 80" aria-hidden="true"><use href="#${symbolId(g.faces[d.tiles[0]], faceSet)}"/></svg>`;
      return tile;
    }),
  );
  const open = g.busters.filter((d) => d.state === 'open').length;
  const mine = g.busters.filter((d) => d.state === 'mine').length;
  el.querySelector('.checkout').textContent = open ? `grab in ${g.untilGrab}` : `${mine} yours`;
  el.setAttribute('aria-label', `Doorbusters: ${mine} yours, ${open} still to be had${open ? `, and another shopper grabs one in ${matchWords(g.untilGrab)}` : ''}`);
}

// A doorbuster's name, by a tile of it: its kind's.
const dealName = (tile) => kindName(MATCH[game.faces[tile]], faceSet);

const matchWords = (n) => `${n} ${n === 1 ? 'match' : 'matches'}`;

// What the doorbusters' row says when it is tapped.
function aboutDeals() {
  const g = game;
  if (!g || !g.busters) return;
  const open = g.busters.filter((d) => d.state === 'open');
  const mine = g.busters.filter((d) => d.state === 'mine').length;
  if (!open.length) toast(`The doorbusters are all gone, ${mine} of them yours.`);
  else toast(`Still to be had: ${listNames(open.map((d) => MATCH[g.faces[d.tiles[0]]]))}. Take a tagged pair before another shopper does: the next grab is in ${matchWords(g.untilGrab)}.`);
}

// The things on a list, in words: A, B, C and D.
function listNames(kinds) {
  const names = kinds.map((k) => kindName(k, faceSet));
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : names.join('');
}

// What the list says when it is tapped.
function aboutList() {
  const g = game;
  if (!g || !g.list) return;
  const left = g.listLeft;
  if (!left.length) toast(`The whole list is found: ${listNames(g.list.kinds)}.`);
  else if (g.listOpen) toast(`Still to find: ${listNames(left)}. Take a pair of each in the next ${g.untilCheckout} ${g.untilCheckout === 1 ? 'match' : 'matches'}, before checkout.`);
  else toast(`Checked out, with ${listNames(left)} left on the list.`);
}

// The clock runs while a board is in play, and holds while a card is up.
// While it holds on a board not yet cleared, the board is hidden, so that
// no one can study it with the clock stopped.
function run() {
  if (!started && !finished && !napping()) started = performance.now();
  paused = false;
  cover(false);
}

function hold() {
  elapsed = played();
  started = 0;
  cover(!finished);
}

function cover(on) {
  document.body.classList.toggle('covered', on);
}

// The nap, on a board with one: whether everyone is asleep, the matches
// since it came not yet as many as it lasts. The clock stops when it comes,
// and runs again when they wake, or when an undo takes the board back to
// before it.
const napping = () => Boolean(nap && game) && game.matches >= nap.from && game.matches < nap.to;

function napClock() {
  if (!nap || finished) return;
  if (napping()) {
    if (started) {
      elapsed = played();
      started = 0;
    }
  } else if (!started && $('card').hidden) started = performance.now();
}

// A pause, from its button, the P key, or the player leaving the page: the
// clock stops and the board is hidden until they come back.
let paused = false;
function pause() {
  if (!game || finished || (!started && !napping())) return;
  hold();
  showCard('Paused', 'The clock has stopped, and the board is hidden until you come back.', [['Resume', () => (hideCard(), run())]]);
  paused = true;
}

const played = () => elapsed + (started ? (performance.now() - started) / 1000 : 0);
const clock = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

// Points with their sign, the minus a true one: +10, −100. With no plus, for totals.
const signed = (n, plus = '+') => (n < 0 ? `−${(-n).toLocaleString()}` : `${n ? plus : ''}${n.toLocaleString()}`);

// The clock, against par.
function tick() {
  if (!game) return;
  $('time').textContent = `⏱ ${clock(played())} / ${clock(par(game))}`;
  $('time').title = 'Time, against par: two points for every second under it';
}

let toastTimer = 0;
function toast(text) {
  const el = $('toast');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3600);
}

// A card over the board: a title, a few words, buttons, and perhaps a grid
// of smaller buttons with a line under each, or a score line by line, the
// last line its total. Only the night's card shows the options under them,
// and only the leaderboard's its places, and the name card its box.
function showCard(title, text, actions, grid = [], lines = []) {
  shown = null;
  paused = false;
  showFigure(null);
  $('card-options').hidden = true;
  $('card-input').hidden = true;
  $('card-ranks').hidden = true;
  $('card-title').textContent = title;
  $('card-text').textContent = text;
  const table = $('card-score');
  table.replaceChildren();
  table.hidden = !lines.length;
  lines.forEach(([what, how, n], k) => {
    const tr = table.insertRow();
    if (k === lines.length - 1) tr.className = 'total';
    tr.insertCell().textContent = what;
    tr.insertCell().textContent = how;
    tr.insertCell().textContent = k === lines.length - 1 ? signed(n, '') : signed(n);
  });
  const box = $('card-grid');
  box.replaceChildren();
  box.className = 'hours';
  box.hidden = !grid.length;
  for (const { label, sub, act, disabled, on } of grid) {
    const b = document.createElement('button');
    b.type = 'button';
    b.disabled = disabled;
    b.classList.toggle('on', Boolean(on));
    b.innerHTML = `${label}<small>${sub || '&nbsp;'}</small>`;
    b.onclick = act;
    box.append(b);
  }
  const row = $('card-actions');
  row.replaceChildren();
  for (const [label, act] of actions) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.onclick = act;
    row.append(b);
  }
  $('card').hidden = false;
  (row.firstChild || box.querySelector('button:enabled'))?.focus(); // a card with only a grid, as the menu on a first visit
}

// A picture on the card, beside its words, as New Year's ball on its pole
// is on the countdown's; or none.
function showFigure(svg) {
  const box = $('card-figure');
  box.innerHTML = svg || '';
  box.hidden = !svg;
}

function hideCard() {
  $('card').hidden = true;
  if (game) update(); // the board's own colours again, after a holiday's card
}

// ---------------------------------------------------------- buttons and keys

// Everything the buttons and keys do. A treat with none in hand says what it
// would do, and where treats come from.
function help(what) {
  if (!game || board.busy || (finished && what !== 'undo')) return;
  if (gifts.help[what] && !game.treats[what]) {
    toast(`${gifts.help[what]} ${gifts.from(game.rules.treats)}`);
    return;
  }
  hideCard();
  run();
  if (what === 'undo') game.undo();
  else if (what === 'hint' || what === 'candle') {
    const pair = what === 'hint' ? game.hint() : game.useCandle();
    record([what === 'hint' ? 'h' : 'l']);
    if (pair) {
      sound.hint();
      board.show(pair);
      if (what === 'hint') board.float(signed(POINTS.hint), pair[0], true);
      else toast(gifts.used.candle);
    }
    if (game.outlook === 'lost') toast("This board can't be won from here: undo, or shuffle.");
  } else if (what === 'shuffle' || what === 'cat') {
    if (!game.shuffle({ cat: what === 'cat' })) toast('No shuffle can help now: undo instead.');
    else if (what === 'cat') toast(gifts.used.cat);
  } else if (what === 'key') {
    if (!game.treats.key) return;
    board.setKeying(!board.keying);
    if (board.keying) toast(gifts.used.key);
  }
  update();
}

$('menu').onclick = () => showHolidays();
$('sound').onclick = () => toggleSound();

function toggleSound() {
  sound.setMuted(!sound.muted);
  showSound();
}

function showSound() {
  $('sound').querySelector('.icon').textContent = sound.muted ? '🔇' : '🔊';
  $('sound').querySelector('.label').textContent = sound.muted ? 'Sound off' : 'Sound on';
  $('sound').title = sound.muted ? 'Sound is off (M)' : 'Sound is on (M)';
}
showSound();
$('new').onclick = newDeal;
$('pause').onclick = pause;
$('list').onclick = aboutList;
$('deals').onclick = aboutDeals;

$('magnify').onchange = (e) => {
  magnifying = e.target.checked;
  try {
    localStorage.setItem('seasons.magnifier', magnifying ? 'on' : 'off');
  } catch {}
  if (board) board.setMagnifier(magnifying ? magnifier : null);
};

$('dim').onchange = (e) => {
  dimming = e.target.checked;
  try {
    localStorage.setItem('seasons.dim', dimming ? 'on' : 'off');
  } catch {}
  $('board').classList.toggle('dimming', dimming);
};
for (const what of ['undo', 'hint', 'shuffle', 'candle', 'key', 'cat']) $(what).onclick = () => help(what);
$('hint').title = `A hint, for ${-POINTS.hint} points (H)`;
$('shuffle').title = `A shuffle, for ${-POINTS.shuffle} points (S)`;

const moon = $('moon');
moon.onpointerdown = (e) => {
  try {
    moon.setPointerCapture(e.pointerId); // keep peeking if the finger slides off
  } catch {}
  board.peek(true);
};
moon.onpointerup = moon.onpointercancel = () => board.peek(false);
moon.oncontextmenu = (e) => e.preventDefault();

document.addEventListener('keydown', (e) => {
  if (e.target instanceof HTMLInputElement) return; // a name being typed
  if (e.key === ' ') {
    e.preventDefault();
    if (!e.repeat) board.peek(true);
    return;
  }
  if (e.metaKey || e.ctrlKey || e.altKey) {
    if (e.key === 'z') {
      e.preventDefault();
      help('undo');
    }
    return;
  }
  const act = { h: 'hint', u: 'undo', z: 'undo', s: 'shuffle' }[e.key.toLowerCase()];
  if (act) help(act);
  else if (e.key.toLowerCase() === 'n' && hour < 0 && runDay < 0) $('new').click();
  else if (e.key.toLowerCase() === 'm') toggleSound();
  else if (e.key.toLowerCase() === 'p') {
    if (paused) {
      hideCard();
      run();
    } else pause();
  }
  else if (e.key === 'Escape') {
    board.setKeying(false);
    board.select(-1);
    if (!$('card').hidden && game && !finished) {
      hideCard();
      run();
    }
    update();
  }
});
document.addEventListener('keyup', (e) => {
  if (e.target instanceof HTMLInputElement) return;
  if (e.key === ' ') {
    e.preventDefault();
    board.peek(false);
  }
});

// Offline play: sw.js keeps every file the game needs. Not when the game is
// framed in another site's page, as it is on itch.io, where keeping it
// offline is not the game's to do.
if ('serviceWorker' in navigator && window.top === window) navigator.serviceWorker.register('sw.js').catch(() => {});

new ResizeObserver(() => board && board.fit()).observe($('table'));
setInterval(tick, 1000);
addEventListener('pagehide', store);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) return;
  pause(); // called away: the clock stops while the player is gone
  store();
});

// An address of #play/name/seed plays that board freely, going on with it if
// it is the one kept (as it is when the page is reloaded). Otherwise the
// game goes back to the board left on the table, while it is kept and its
// holiday is still open: one of the night's, of a run's, or the board played
// freely; a save from before the table was kept goes back to the holiday
// chosen last. With none, as on a first visit, a turtle is dealt, under the
// menu, to choose a holiday.
function goOn() {
  const at = saved.table || saved.theme;
  const p = at === 'halloween' ? saved.playing : RUNS[at] ? RUNS[at].progress().playing : null;
  const f = saved.free;
  if (at === 'halloween' && p && HOURS[p.hour] && isOpen(theme(at))) beginHour(p.hour, p);
  else if (RUNS[at] && p && RUNS[at].days[p.day] && stillToday(at, p) && isOpen(theme(at))) beginDay(at, p.day, p);
  else if (f && (at === 'free' || f.moves.length)) freePlay(f.key, f.seed, f.turnAt, f);
  else return false;
  return true;
}
const [mode, key, seed, turnAt] = location.hash.slice(1).split('/');
if (mode === 'play') {
  const f = saved.free;
  const kept = f && f.key === key && (!seed || f.seed === Number(seed)) && f.turnAt === (Number(turnAt) || 0) ? f : null;
  freePlay(key, kept ? kept.seed : Number(seed) || newSeed(), Number(turnAt) || 0, kept);
} else if (!goOn()) {
  freePlay(turtleKey());
  showHolidays(true);
}
postScores(); // any bests that could not go up last time
