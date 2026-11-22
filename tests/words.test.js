import { test, check, equal } from './run.js';
import { GIFTS, TURNS, wordsOf } from '../js/words.js';
import { FACE_SETS, faceName } from '../js/ui/faces.js';
import { FACE } from '../js/engine/tiles.js';
import { TREATS } from '../js/engine/game.js';
import { Sound } from '../js/ui/sound.js';

// Everything a set of treats can say: its icons, names, buttons, what each
// does and says when used, where they come from, one coming, and its key.
const giftsSay = (g) => [
  ...TREATS.flatMap((t) => [g.icons[t], g.names[t], g.help[t], g.used[t]]),
  g.buttons.key,
  g.buttons.cat,
  g.came('something'),
  g.from(true),
  g.from(false),
  g.keyName,
];

// And everything a board's turning over can say, before it and after.
const turnSays = (w) => [
  w.ahead(3, true),
  w.ahead(3, false),
  w.after(true),
  w.after(false),
  w.soul,
  w.soulsAhead,
  w.soulsWoke,
  w.turned(true),
  w.turned(false),
  w.woke(0),
  w.woke(1),
  w.woke(2),
  w.prompt,
  w.moon,
  ...Object.values(w.score),
];

// Halloween's own words, and its own icons.
const HALLOWEEN = /jack-o'-lantern|skeleton|black cat|ghost|lost soul|witch|7 pm|🐈‍⬛|👻|🎃/i;

test("every holiday's tiles bring treats of their own, three, each with its icon, name, button, what it does and what it says when used", () => {
  for (const set of FACE_SETS) {
    const { treatSet } = wordsOf(set);
    equal(treatSet, set, `${set}'s treats`);
    const g = GIFTS[set];
    for (const t of TREATS) check(g.icons[t] && g.names[t] && g.help[t] && g.used[t], `${set}'s ${t} is not told`);
    equal(new Set(TREATS.map((t) => g.icons[t])).size, 3, `${set}'s icons, one a treat`);
    check(g.buttons.key && g.buttons.cat && g.keyName, `${set}'s buttons, or its key's name`);
    check(g.came('X').includes('X'), `${set}'s treat coming doesn't name it`);
    // Treats come from pairs of the face Halloween draws as a jack-o'-lantern,
    // which each set draws its own way.
    const giver = faceName(FACE.lantern, set).toLowerCase().split(' ')[0];
    check(g.from(true).toLowerCase().includes(giver), `${set}'s treats don't come from its ${giver}s`);
  }
});

test("no holiday but Halloween speaks Halloween's words: no jack-o'-lanterns, skeleton keys, black cats, ghosts or lost souls", () => {
  for (const set of FACE_SETS.filter((s) => s !== 'halloween')) {
    const { treatSet, turnSet } = wordsOf(set);
    for (const w of [...giftsSay(GIFTS[treatSet]), ...turnSays(TURNS[turnSet])]) check(!HALLOWEEN.test(w), `${set} says "${w}"`);
  }
  for (const w of giftsSay(GIFTS.potluck)) check(!HALLOWEEN.test(w), `the potluck says "${w}"`);
  check(giftsSay(GIFTS.halloween).some((w) => HALLOWEEN.test(w)) && turnSays(TURNS.midnight).some((w) => HALLOWEEN.test(w)), "Halloween doesn't speak its own words");
});

test('a board outside the holidays\' own that turns over is told in its tiles\' words, naming a tile left without a partner as they draw it, and ringing a sound there is', () => {
  for (const set of FACE_SETS) {
    const w = TURNS[wordsOf(set).turnSet];
    check(w, `${set} has no words for turning over`);
    const soul = faceName(FACE['lost-soul'], set).toLowerCase().slice(0, 4);
    check(w.score.souls.toLowerCase().startsWith(soul), `${set}'s lost souls are ${w.score.souls}`);
  }
  for (const [name, w] of Object.entries(TURNS)) {
    for (const night of [true, false]) check(typeof Sound.prototype[w.ring(night)] === 'function', `${name} rings ${w.ring(night)}, which isn't a sound`);
  }
  equal(`${wordsOf('showers').treatSet} ${wordsOf('showers').turnSet}`, 'showers may', "April Showers' treats and turning over, in its own words");
});
