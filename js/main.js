import { Game } from './engine/game.js';
import * as layouts from './engine/layouts.js';
import { HOURS, gameOptions } from './night.js';
import { DAYS, dayOf, dayOptions } from './thanksgiving.js';
import { KINDS, MATCH } from './engine/tiles.js';
import { sprite, symbolId, kindName, FACE_SETS } from './ui/faces.js';
import { Board } from './ui/board.js';
import { Magnifier } from './ui/magnifier.js';
import { Sound } from './ui/sound.js';
import { POINTS, par, scoreOf } from './score.js';
import { Leaderboard, BOARDS, NIGHT, boardOf, nameOf, nameProblem, tidy } from './leaderboard.js';
import { THEMES, theme, when, calendar } from './themes.js';

const MIDNIGHT = HOURS.findIndex((h) => h.name === 'Midnight');

// The treats a board gives, in its own words: Halloween's, which the
// jack-o'-lanterns leave, and the potluck's, the gifts friends bring at
// Friendsgiving. The game knows them as candle, key and cat: a free hint, a
// blocked tile freed, and a free shuffle. For each: its icon; its name, as
// a toast gives it when one comes; what it does, for a player who taps one
// with none in hand, and where they come from; and what it says when used.
const GIFTS = {
  halloween: {
    icons: { candle: '🕯️', key: '🗝️', cat: '🐈‍⬛' },
    names: { candle: 'a candle, to show you a match', key: 'a skeleton key, to free a blocked tile', cat: 'a black cat, for a free shuffle' },
    help: { candle: 'A candle shows you a match, for free.', key: 'A skeleton key frees one blocked tile.', cat: 'A black cat shuffles the tiles for free.' },
    came: (name) => `The jack-o'-lanterns left ${name}.`,
    from: (on) => (on ? "Each pair of jack-o'-lanterns leaves a treat." : 'Treats begin at 7 pm.'),
    used: { candle: 'The candle shows you a match, for free.', cat: 'The black cat knocks the tiles about: a free shuffle.', key: 'Choose a blocked tile for the skeleton key.' },
    keyName: 'key',
  },
  potluck: {
    icons: { candle: '💬', key: '🪑', cat: '🎶' },
    names: { candle: 'a tip, to show you a match', key: 'a saved seat, to free a blocked tile', cat: 'musical chairs, for a free shuffle' },
    help: { candle: "A friend's tip shows you a match, for free.", key: 'A saved seat frees one blocked tile.', cat: 'Musical chairs shuffles the tiles for free.' },
    came: (name) => `A friend brought ${name}.`,
    from: () => 'Each pair of turkeys, green beans or mashed potatoes leaves a gift.',
    used: { candle: "A friend's tip: there's a match.", cat: 'Musical chairs: everyone moves round, a free shuffle.', key: 'Choose a blocked tile for the saved seat.' },
    keyName: 'saved seat',
  },
};
let gifts = GIFTS.halloween; // the board in play's

// How a board's turning over is told: Halloween's midnight, or its sunrise
// on a board that starts on its night side; and the Sunday Scaries'
// sundown, when the weekend turns over to Monday and its lost souls are
// worries. For each: the clock in the top bar, before the turn and after;
// what its lost souls are; what it says at the turn, and three matches
// before; the moon's title; the score's words; and its sound.
const TURNS = {
  midnight: {
    ahead: (n, night) => `${night ? '🕛' : '🌅'} <b>${n}</b> to ${night ? 'midnight' : 'sunrise'}`,
    after: (night) => (night ? '🌙 night' : '☀️ day'),
    soul: '👻',
    soulsAhead: 'Lost souls if the tiles turned over now',
    soulsWoke: 'Lost souls that woke',
    turned: (night) => (night ? 'Midnight! The tiles turn over.' : 'Sunrise! The tiles turn back to day.'),
    woke: (n) => (n ? `${n} lost ${n === 1 ? 'soul wakes' : 'souls wake'}: lost souls match each other.` : 'Not one lost soul.'),
    prompt: 'Three matches to midnight. Hold the moon to see the night side, and take pairs that match on both sides.',
    moon: 'Hold to see the night side (or hold Space)',
    score: { night: 'Midnight', day: 'Sunrise', souls: 'Lost souls', none: 'no lost souls' },
    ring: (night) => (night ? sound.midnight() : sound.sunrise()),
  },
  sundown: {
    ahead: (n) => `🌇 <b>${n}</b> to sundown`,
    after: () => '😟 Monday',
    soul: '😟',
    soulsAhead: 'Worries if the tiles turned over now',
    soulsWoke: 'Worries that woke',
    turned: () => "Sundown! The weekend's over, and the tiles turn over to Monday.",
    woke: (n) => (n ? `${n} ${n === 1 ? 'worry wakes' : 'worries wake'}: worries match each other.` : 'Not one worry.'),
    prompt: 'Three matches to sundown. Hold the moon to see Monday coming, and take pairs that match on both sides.',
    moon: "Hold to see Monday's side (or hold Space)",
    score: { night: 'Sundown', day: 'Sundown', souls: 'Worries', none: 'no worries' },
    ring: () => sound.alarm(),
  },
};
let turnWords = TURNS.midnight; // the board in play's

// The set of faces the board in play's tiles wear, and are named by
// (faces.js): Halloween's on the night's boards, Thanksgiving's on the
// week's, and on the turtle and the rest outside them, the holiday chosen's
// (holidayFaces).
let faceSet = 'halloween';

// Every layout by the name an address can give it, for free play: #play/raven/12345.
const FREE = Object.fromEntries(Object.entries(layouts).map(([k, L]) => [k.toLowerCase(), L]));

const $ = (id) => document.getElementById(id);
const newSeed = () => Math.floor(Math.random() * 1e9);
const sound = new Sound();

let game = null;
let board = null;
let hour = -1; // the hour of the Long Night being played, or -1
let weekDay = -1; // the day of Thanksgiving week being played, or -1; both -1 for free play
let moves = []; // what has been done on this board, to play it back after a reload
let elapsed = 0; // seconds played before the clock last started
let started = 0; // when the clock last started, or 0 while it is held
let nap = null; // on a board with a nap, { from, to }: the clock stops from the one match to the other
let finished = false;
let woke = 0;
let prompted = false;

// What is kept between visits: the holidays the player chose, and the one
// whose card the menu opens; the latest hour of the Long Night reached, the
// best time and the best score for each hour, with the time that score took;
// the same for Thanksgiving week, by the day; the boards in play, the
// night's, the week's and the one outside both, each as its seed and its
// moves; and the player's name on the leaderboard, with what has been
// posted there.
let saved = {
  holidays: null,
  theme: 'halloween',
  reached: 0,
  best: {},
  scores: {},
  times: {},
  playing: null,
  week: { reached: 0, best: {}, scores: {}, times: {}, playing: null },
  free: null,
  name: '',
  declined: false,
  posted: {},
};
try {
  saved = { ...saved, ...JSON.parse(localStorage.getItem('seasons.night')) };
} catch {}

function store() {
  const onTable = hour >= 0 ? saved.playing : weekDay >= 0 ? saved.week.playing : saved.free; // while it is not yet cleared
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
function play({ layout, options, seed, replay = [], playedFor = 0, at = -1, onDay = -1, treatSet = 'halloween', treatBar = true, napAt = null, turnSet = 'midnight', faces = 'halloween' }) {
  if (game && !finished) store();
  hideCard();
  hour = at;
  weekDay = onDay;
  nap = napAt;
  faceSet = faces;
  turnWords = TURNS[turnSet] || TURNS.midnight;
  $('moon').title = turnWords.moon;
  game = new Game(layout, { seed, ...options });
  for (const move of replay) redo(move);
  moves = replay.slice();
  showGifts(treatSet, treatBar);
  $('fridge').hidden = !game.fridgeSize;
  if (!game.fridgeSize) $('fridge').querySelector('.slots').replaceChildren(); // no containers left over from a board that had them
  const fridge = game.fridgeSize ? $('fridge').querySelector('.slots') : null;
  board = new Board($('board'), game, { say: toast, sound, magnifier: magnifying ? magnifier : null, keyName: gifts.keyName, fridge, faceSet });
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
  game.on('treat', ({ treat }) => {
    sound.treat();
    toast(gifts.came(gifts.names[treat]));
  });
  game.on('turn', turned);
  game.on('win', () => {
    sound.win();
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
  store();
  history.replaceState(null, '', location.pathname + location.search);
  if (keep) {
    run();
    toast(`Back at ${spec.name}.`);
  } else {
    showCard(`${spec.name}: ${spec.title}`, spec.text, [['Play', () => (hideCard(), run())]]);
  }
}

// A board outside the night, as often as you like: the turtle, or any of the
// night's boards by name, with or without a midnight. It wears the faces of
// the holiday chosen, as the page wears its look, and a day's board
// Thanksgiving's. Like the night's, the board in play is kept, to go on with
// after a reload or a visit to the night: `keep` is that board.
let freeKey = 'turtle'; // the board free play deals,
let freeTurn = 0; // and after how many matches its tiles turn over, if they do
function freePlay(key = 'turtle', seed = newSeed(), turnAt = 0, keep = null) {
  if (!FREE[key]) key = 'turtle';
  freeKey = key;
  freeTurn = turnAt;
  const today = dayOf(FREE[key]); // a Thanksgiving day's board plays by its day's rules, and gives its own treats or none
  const { options, ...rest } = today ? dayPlay(today) : { options: {}, faces: holidayFaces() };
  if (turnAt) options.turnAt = turnAt;
  play({ layout: FREE[key], options, seed, replay: keep ? keep.moves : [], playedFor: keep ? keep.elapsed : 0, ...rest });
  saved.free = { key, seed, turnAt, moves, elapsed };
  store();
  history.replaceState(null, '', `#play/${key}/${seed}${turnAt ? `/${turnAt}` : ''}`);
  const fresh = !(keep && keep.moves.length);
  if (today && fresh) dayCard(today);
  else run();
  if (!fresh) toast(`Back to your ${game.layout.name.toLowerCase()}.`);
}

// -------------------------------------------------------- Thanksgiving week

// What play() wants for a day's board: its options, the treats it gives or
// none, its nap, the words its turning over is told in, and Thanksgiving's
// faces.
function dayPlay(d) {
  const options = { ...dayOptions(d) };
  const napFrom = d.nap ? Math.round((d.layout.count / 2) * d.nap.by) : 0;
  return {
    options,
    treatSet: d.gifts || 'halloween',
    treatBar: Boolean(options.treats),
    napAt: napFrom ? { from: napFrom, to: napFrom + d.nap.matches } : null,
    turnSet: d.words || 'midnight',
    faces: 'thanksgiving',
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

// Starts a day of Thanksgiving week, or goes on with one from where it was
// left, as beginHour does an hour of the night.
function beginDay(at, keep = null) {
  const d = DAYS[at];
  const seed = keep ? keep.seed : newSeed();
  play({ layout: d.layout, seed, replay: keep ? keep.moves : [], playedFor: keep ? keep.elapsed : 0, onDay: at, ...dayPlay(d) });
  saved.week.playing = { day: at, seed, moves, elapsed };
  saved.theme = 'thanksgiving';
  store();
  history.replaceState(null, '', location.pathname + location.search);
  if (keep) {
    run();
    toast(`Back to ${d.name}.`);
  } else dayCard(d);
}

// The week's board in play: come to, or begun, and not yet cleared.
function weekInPlay() {
  const p = saved.week.playing;
  return p && DAYS[p.day] && (p.day > 0 || p.moves.length > 0) ? p : null;
}

// A day from the week's card: the week's board in play, if it is that day's,
// or else the day dealt afresh, once the player has agreed to give up a
// board begun on another day.
function toDay(i) {
  const w = weekInPlay();
  if (w && w.day === i) {
    if (weekDay === i) {
      hideCard();
      run();
    } else beginDay(i, w);
    return;
  }
  if (w && w.moves.length) {
    askToLose({ which: `your board on ${DAYS[w.day].name}`, then: `${DAYS[i].name} begins`, go: () => beginDay(i), back: () => weekMenu(), keep: 'Keep it' });
    return;
  }
  beginDay(i);
}

// Back to Thanksgiving week: its board in play, or the latest day reached.
function toWeek() {
  const p = saved.week.playing;
  if (p && DAYS[p.day]) beginDay(p.day, p);
  else beginDay(saved.week.reached);
}

// The week score: the best score on each day, added up.
function weekScore() {
  const scores = Object.values(saved.week.scores);
  if (!scores.length) return '';
  return `Your week's score, your best each day added up, is ${signed(scores.reduce((a, b) => a + b, 0), '')}.`;
}

// Thanksgiving week's card, as the Long Night's is Halloween's: back to the
// board or give it up, on to the next day or back to the week, the turtle,
// and any day reached so far. On a first visit it opens over the week's
// first board, not yet begun.
function weekMenu(opening = false) {
  if (opening === true && weekDay < 0) beginDay(saved.week.reached); // a board of the week to look at behind its card
  hold();
  wear(theme('thanksgiving'));
  sky();
  if (opening === true) cover(false);
  const playing = game && !finished && opening !== true;
  const week = weekInPlay();
  const reached = saved.week.reached;
  const onward = [reached > 0 ? `On to ${DAYS[reached].name}` : 'Begin on the first Sunday', () => beginDay(reached)];
  const actions = [];
  if (playing) actions.push(['Back to the board', () => (hideCard(), run())]);
  if (playing && moves.length) actions.push(['Give up this board', giveUp]);
  if (weekDay < 0) actions.push(saved.week.playing ? ['Back to the week', toWeek] : onward);
  else if (!week) actions.push(onward);
  if (weekDay >= 0) actions.push(['Play the turtle', toTurtle]);
  actions.push(['Your holidays', showHolidays]);
  const days = DAYS.map((d, i) => ({
    label: d.name,
    sub: saved.week.scores[i] !== undefined ? `★ ${signed(saved.week.scores[i], '')}` : d.title,
    act: () => toDay(i),
    disabled: i > reached,
    on: Boolean(week) && week.day === i,
  }));
  const intro = 'Eight boards, one a day from the Sunday before Thanksgiving to the Sunday after. Each day you reach can be played again.';
  showCard(`${theme('thanksgiving').icon} Thanksgiving week`, `${intro} ${weekScore()}`.trim(), actions, days);
  $('card-grid').classList.add('themes'); // room for the days' names
  showOptions();
}

// A day of the week cleared: its best kept, the next day reached, and on
// the second Sunday, the week seen through.
function wonDay(total, time, lines, timing) {
  const w = saved.week;
  const at = weekDay;
  const best = w.scores[at];
  const better = best === undefined || total > best;
  if (better) {
    w.scores[at] = total;
    w.times[at] = Math.floor(time);
  }
  if (!w.best[at] || time < w.best[at]) w.best[at] = time;
  w.reached = Math.max(w.reached, Math.min(at + 1, DAYS.length - 1));
  w.playing = null;
  store();
  const note = best === undefined ? '' : better ? ' Your best yet.' : ` Your best is ${signed(best, '')}.`;
  if (at === DAYS.length - 1) {
    showCard('The week is over', `You have seen Thanksgiving week through, from the traffic there to the Sunday Scaries. ${weekScore()}`, [
      ['Begin again', () => beginDay(0)],
      ['Play the turtle', toTurtle],
    ], [], lines);
  } else {
    showCard(`${DAYS[at].name}: cleared`, `${timing}${note}`, [
      [`On to ${DAYS[at + 1].name}`, () => beginDay(at + 1)],
      ['Play it again', () => beginDay(at)],
    ], [], lines);
  }
}

function turned({ souls }) {
  woke = souls.length;
  const night = game.sideName === 'night';
  turnWords.ring(night);
  toast(`${turnWords.turned(night)} ${turnWords.woke(woke)}`);
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
  if (weekDay >= 0) return wonDay(total, time, lines, timing);
  if (hour < 0) {
    saved.free = null;
    store();
    // Back to the holiday's boards: the week's, when Thanksgiving is the one chosen.
    const back = saved.theme === 'thanksgiving' ? ['Back to the week', toWeek] : ['Back to the Long Night', toNight];
    showCard('The board is clear!', timing, [['Deal again', () => freePlay(freeKey, newSeed(), freeTurn)], back], [], lines);
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
      ['Play the turtle', toTurtle],
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
  if (game.treats.cat) actions.unshift(['Black cat', () => help('cat')]);
  if (game.treats.key) actions.push(['Skeleton key', () => help('key')]);
  actions.push(['Give up', giveUp]);
  showCard('No pairs left', 'Shuffle the tiles left, take back a move, or give up the board.', actions);
}

// The menu: back to the board or give it up, the Long Night or the turtle,
// any hour reached so far, and the leaderboard. On a first visit it opens
// over the first board, not yet begun. The night's board in play and the
// turtle's are both kept, so that going from one to the other loses neither.
function menu(opening = false) {
  hold();
  wear(theme('halloween'));
  sky();
  if (opening === true) cover(false); // a first board to look at, dealt afresh before it is played
  const playing = game && !finished && opening !== true;
  const night = nightInPlay();
  const actions = [];
  if (playing) actions.push(['Back to the board', () => (hideCard(), run())]);
  if (playing && moves.length) actions.push(['Give up this board', giveUp]);
  if (hour < 0) actions.push(['Back to the Long Night', toNight]);
  else if (!night) actions.push(saved.reached > 0 ? [`On to ${HOURS[saved.reached].name}`, () => beginHour(saved.reached)] : ['Begin at 6 pm', () => beginHour(0)]);
  if (hour >= 0) actions.push(['Play the turtle', toTurtle]);
  if (leaderboard.on) actions.push(['Leaderboard', () => showLeaderboard(hour >= 0 ? boardOf(hour) : NIGHT)]);
  actions.push(['Your holidays', showHolidays]);
  const hours = HOURS.map((h, i) => ({
    label: h.name,
    sub: saved.scores[i] !== undefined ? `★ ${signed(saved.scores[i], '')}` : '',
    act: () => toHour(i),
    disabled: i > saved.reached,
    on: night && night.hour === i,
  }));
  const intro = 'Thirteen boards, one an hour from dusk to dawn. Each hour you reach can be played again.';
  showCard('The Long Night', `${intro} ${nightScore()}`.trim(), actions, hours);
  showOptions();
}

// The switches under each holiday's card: the magnifier, and dimming.
function showOptions() {
  $('magnify').checked = magnifying;
  $('dim').checked = dimming;
  $('card-options').hidden = false;
}

// The night's board in play: come to, or begun, and not yet cleared.
function nightInPlay() {
  const p = saved.playing;
  return p && HOURS[p.hour] && (p.hour > 0 || p.moves.length > 0) ? p : null;
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

// Back to the Long Night: its board in play, or the latest hour reached.
function toNight() {
  const p = saved.playing;
  saved.theme = 'halloween';
  if (p && HOURS[p.hour]) beginHour(p.hour, p);
  else beginHour(saved.reached);
}

// The turtle: the one in play, if there is one, or else a new deal, once the
// player has agreed to give up any other board begun outside the night.
function toTurtle() {
  const f = saved.free;
  if (f && f.key === 'turtle') freePlay('turtle', f.seed, f.turnAt, f);
  else if (f && f.moves.length) {
    askToLose({ which: `your ${FREE[f.key].name.toLowerCase()}`, then: 'a turtle is dealt', go: () => freePlay('turtle'), back: () => menu(), keep: 'Keep it' });
  } else freePlay('turtle');
}

// Gives up the board in play, once the player has said so: the same hour of
// the night or day of the week deals again, or the same board outside them.
function giveUp() {
  const at = weekDay;
  askToLose({
    which: 'this board',
    then: hour >= 0 ? `${HOURS[hour].name} deals again` : at >= 0 ? `${DAYS[at].name} deals again` : 'a new one is dealt',
    go: hour >= 0 ? () => beginHour(hour) : at >= 0 ? () => beginDay(at) : () => freePlay(freeKey, newSeed(), freeTurn),
    back: () => (hideCard(), run()),
  });
}

// A new deal outside the night: at once, unless this one has moves to lose.
function newDeal() {
  if (!finished && moves.length) giveUp();
  else freePlay(freeKey, newSeed(), freeTurn);
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
// is on the table, Thanksgiving's while its week is, and otherwise the one
// chosen last, whose faces the board then wears too, unless it is one of the
// week's days played freely. Another holiday chosen with the turtle on the
// table changes its tiles with its colours.
function applyTheme() {
  wear(theme(hour >= 0 ? 'halloween' : weekDay >= 0 ? 'thanksgiving' : saved.theme) || theme('halloween'));
  // The day is found by the key free play dealt: a board with a fridge
  // plays on a layout of its own, with the containers added.
  const faces = hour < 0 && weekDay < 0 && !dayOf(FREE[freeKey]) ? holidayFaces() : faceSet;
  if (faces !== faceSet) board.setFaces((faceSet = faces));
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

// A holiday's day as a card gives it: Nov 26, or a season's first and last,
// or today, or now while a season is on.
function dated({ theme: t, start, end, now }) {
  const short = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (now) return t.until ? `now, to ${short(end)}` : 'today';
  return t.until ? `${short(start)} – ${short(end)}` : short(start);
}

// The holidays the player plays, in the order they come round from today.
const mine = () => calendar().filter((e) => (saved.holidays || []).includes(e.theme.id));

// Choosing the holidays to play, on a first visit and later from the menu:
// all the year's, in the order they come round from today, any number of
// them. Their boards are all to come but Halloween's and Thanksgiving's.
function chooseHolidays(first = false) {
  hold();
  wear(null);
  sky();
  if (first === true) cover(false); // the first board behind, dealt afresh before it is played
  const chosen = new Set(saved.holidays || []);
  // Then the holiday to open: the one chosen last, while it is still one of
  // them, or else, as on a first visit, the soonest of those ready to play,
  // or the soonest of all.
  const done = () => {
    saved.holidays = THEMES.filter((t) => chosen.has(t.id)).map((t) => t.id);
    if (first === true || !chosen.has(saved.theme)) saved.theme = (mine().find((e) => e.theme.ready) || mine()[0]).theme.id;
    store();
    openTheme(first);
  };
  const entries = calendar();
  const buttons = () => $('card-grid').children;
  const show = () => {
    entries.forEach((e, k) => {
      buttons()[k].classList.toggle('on', chosen.has(e.theme.id));
      buttons()[k].setAttribute('aria-pressed', String(chosen.has(e.theme.id)));
    });
    $('card-actions').firstChild.disabled = !chosen.size;
  };
  const toggle = (id) => {
    if (chosen.has(id)) chosen.delete(id);
    else chosen.add(id);
    show();
  };
  const all = () => {
    for (const t of THEMES) chosen.add(t.id);
    show();
  };
  const grid = entries.map((e) => ({ label: `${e.theme.icon} ${e.theme.name}`, sub: dated(e), act: () => toggle(e.theme.id) }));
  const text = "Pick the holidays and seasons you'd like to play, as many as you like. Halloween's and Thanksgiving's boards are ready, and the rest are on their way. You can change them from the menu.";
  showCard('Choose your holidays', text, [[first === true ? 'Start' : 'Done', done], ['All of them', all]], grid);
  $('card-grid').classList.add('themes');
  show();
  if (!chosen.size) buttons()[0].focus(); // not Start, which waits for a choice
}

// A holiday's own card: the Long Night's for Halloween, the week's for
// Thanksgiving, and for the others, whose boards are to come, a card to say
// so.
const MENUS = { halloween: (opening) => menu(opening), thanksgiving: (opening) => weekMenu(opening) };
function openTheme(opening = false) {
  if (!saved.holidays) return chooseHolidays(opening);
  const t = theme(saved.theme);
  if (MENUS[t.id]) MENUS[t.id](opening);
  else comingSoon(t, opening);
}

// The player's holidays, in the order they come round, to go to any of.
function showHolidays() {
  hold();
  wear(null);
  sky();
  const grid = mine().map((e) => ({
    label: `${e.theme.icon} ${e.theme.name}`,
    sub: e.theme.ready ? dated(e) : `${dated(e)} · soon`,
    on: e.theme.id === saved.theme,
    act: () => {
      saved.theme = e.theme.id;
      store();
      openTheme();
    },
  }));
  showCard('Your holidays', 'The holidays and seasons you play, in the order they come round.', [['Change your holidays', () => chooseHolidays()], ['Back', () => openTheme()]], grid);
  $('card-grid').classList.add('themes');
}

// A holiday whose boards are still to come, in its own colours: its day,
// and what to play meanwhile.
function comingSoon(t, opening = false) {
  hold();
  if (opening === true) cover(false);
  wear(t);
  document.body.style.setProperty('--sky-top', t.sky[0]);
  document.body.style.setProperty('--sky-low', t.sky[1]);
  const e = { theme: t, ...when(t) };
  const day = dated(e);
  const comes = e.now ? (t.until ? `is on ${day}` : 'is today') : t.until ? `runs ${day}` : `falls on ${day}`;
  const actions = [];
  if (game && !finished && opening !== true) actions.push(['Back to the board', () => (hideCard(), run())]);
  // The holidays ready to play meanwhile, each to its own card.
  for (const [id, words] of [['halloween', "Halloween's Long Night"], ['thanksgiving', 'Thanksgiving week']]) {
    actions.push([
      words,
      () => {
        saved.theme = id;
        store();
        MENUS[id](opening);
      },
    ]);
  }
  if (hour >= 0 || weekDay >= 0) actions.push(['Play the turtle', toTurtle]);
  actions.push(['Your holidays', showHolidays]);
  const text = `${t.name} ${comes}. Its boards are on their way; until they come, there are Halloween's Long Night and Thanksgiving week, and the classic turtle.`;
  showCard(`${t.icon} ${t.name}`, text, actions);
  showOptions();
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
    ['Back', () => menu()],
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
      : weekDay >= 0
        ? `${theme('thanksgiving').icon} <b>${DAYS[weekDay].name}</b> ${DAYS[weekDay].title}`
        : `<b>Free play</b> ${g.layout.name}`;
  applyTheme();
  $('new').hidden = hour >= 0 || weekDay >= 0; // the night's and the week's boards deal by their own cards
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
  if ((hour === MIDNIGHT || turnWords === TURNS.sundown) && g.turnAhead && g.untilTurn === 3 && !prompted) {
    prompted = true;
    toast(turnWords.prompt);
  }
  tick();
}

// The sky behind the board: the hour's own, or the dawn once the sun is up;
// on Thanksgiving week, the day's; and outside them, the sky of the holiday
// chosen last; but for the night sky of the page's styles once the tiles
// turn over.
function sky() {
  const s = document.body.style;
  let colours = null;
  if (hour >= 0) {
    const spec = HOURS[hour];
    colours = spec.dawn && game.sideName === 'day' ? spec.dawn : spec.sky;
  } else if (game.sideName !== 'night') colours = weekDay >= 0 ? DAYS[weekDay].sky : (theme(saved.theme) || theme('halloween')).sky;
  if (colours) {
    s.setProperty('--sky-top', colours[0]);
    s.setProperty('--sky-low', colours[1]);
  } else {
    s.removeProperty('--sky-top');
    s.removeProperty('--sky-low');
  }
}

// The treat buttons in the board's own words, with their icons; hidden on
// a Thanksgiving day's board with no treats, as none will come.
function showGifts(set, bar) {
  gifts = GIFTS[set] || GIFTS.halloween;
  for (const t of ['candle', 'key', 'cat']) {
    $(t).querySelector('.icon').firstChild.textContent = gifts.icons[t];
    $(t).title = gifts.help[t].replace(/\.$/, '');
  }
  document.querySelector('.treats').hidden = !bar;
  $('board').classList.toggle('potluck', set === 'potluck');
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
  row.firstChild.focus();
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

$('menu').onclick = () => openTheme();
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
  else if (e.key.toLowerCase() === 'n' && hour < 0 && weekDay < 0) $('new').click();
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
// it is the one kept (as it is when the page is reloaded). Otherwise, for a
// player whose holiday is Thanksgiving, the week goes on where it was left,
// or opens on its card; and for the rest the night goes on where it was
// left, or begins, as it does for a visitor who only looked at the first
// board last time.
const [mode, key, seed, turnAt] = location.hash.slice(1).split('/');
const p = saved.playing;
const f = saved.free;
const w = saved.week.playing;
const goingOn = p && HOURS[p.hour] && (saved.reached > 0 || p.hour > 0 || p.moves.length > 0);
const weekGoingOn = w && DAYS[w.day] && (saved.week.reached > 0 || w.day > 0 || w.moves.length > 0);
if (mode === 'play') {
  const kept = f && f.key === key && (!seed || f.seed === Number(seed)) && f.turnAt === (Number(turnAt) || 0) ? f : null;
  freePlay(key, kept ? kept.seed : Number(seed) || newSeed(), Number(turnAt) || 0, kept);
} else if (saved.holidays && saved.theme === 'thanksgiving') {
  if (weekGoingOn) beginDay(w.day, w);
  else {
    beginDay(saved.week.reached);
    weekMenu(true);
  }
} else if (goingOn) beginHour(p.hour, p);
else {
  beginHour(0);
  openTheme(true); // the holidays to choose, on a first visit
}
postScores(); // any bests that could not go up last time
