import { test, check, equal } from './run.js';
import { FACES, KINDS, MATCH, FACE } from '../js/engine/tiles.js';
import { sprite, symbolId, faceName, kindName, FACE_SETS } from '../js/ui/faces.js';
import { DAYS } from '../js/thanksgiving.js';
import { TWELVE_DAYS } from '../js/christmas.js';
import { COUNTDOWN } from '../js/newyear.js';
import { Game } from '../js/engine/game.js';
import { TURTLE } from '../js/engine/layouts.js';
import { Board } from '../js/ui/board.js';

const INDEXED = ['eyes', 'bones', 'graves', 'monster', 'flower', 'moon'];

test("there are Halloween's faces, Thanksgiving's, Christmas's, New Year's, Groundhog Day's and Valentine's, each a drawing of every face", () => {
  equal(FACE_SETS.join(' '), 'halloween thanksgiving christmas new-year groundhog valentines', 'the sets');
  const svg = sprite();
  const ids = [...svg.querySelectorAll('symbol')].map((s) => s.id);
  equal(ids.length, FACES.length * FACE_SETS.length + 1, 'symbols, and the egg'); // the egg a tile hides in, on the hens' board
  equal(new Set(ids).size, ids.length, 'symbols with ids of their own');
  for (const set of FACE_SETS) {
    for (const f of FACES) {
      const symbol = svg.querySelector(`#${symbolId(f.id, set)}`);
      check(symbol && symbol.children.length > 1, `${set}: ${f.key} has no drawing`);
    }
  }
  check(svg.querySelector('#egg') && svg.querySelector('#egg').children.length > 1, 'the egg has no drawing');
  for (const bad of ['NaN', 'undefined', 'null']) check(!svg.innerHTML.includes(bad), `a drawing has ${bad} in it`);
  return `${ids.length} faces`;
});

test("Halloween's faces keep their names, and Thanksgiving's, Christmas's, New Year's, Groundhog Day's and Valentine's have names of their own", () => {
  for (const f of FACES) equal(faceName(f.id), f.name, f.key);
  for (const k of KINDS) equal(kindName(k.id), k.name, k.key);
  for (const set of ['thanksgiving', 'christmas', 'new-year', 'groundhog', 'valentines']) {
    const names = new Map();
    for (const f of FACES) {
      const name = faceName(f.id, set);
      check(typeof name === 'string' && name.length > 1, `${f.key} has no ${set} name`);
      check(!names.has(name), `${set}: ${f.key} and ${names.get(name)} are both called ${name}`);
      names.set(name, f.key);
    }
    // A kind of one face is called by that face's name; the flowers and the
    // moons, any two of which match, have a name for the kind.
    for (const k of KINDS) {
      const name = kindName(k.id, set);
      check(typeof name === 'string' && name.length > 1, `the kind ${k.key} has no ${set} name`);
      if (k.faces.length === 1) equal(name, faceName(k.faces[0], set), `${set}: ${k.key}`);
    }
  }
  equal(faceName(FACE['eyes-3'], 'thanksgiving'), 'Three of Cranberries', 'the three of eyes');
  equal(faceName(FACE['bones-9'], 'thanksgiving'), 'Nine of Corn', 'the nine of bones');
  equal(faceName(FACE['graves-1'], 'thanksgiving'), 'One of Leaves', 'the one of graves');
  equal(faceName(FACE['lost-soul'], 'thanksgiving'), 'Worry', 'the lost soul');
  equal(kindName(MATCH[FACE.nightshade], 'thanksgiving'), 'Autumn flower', 'the flowers');
  equal(kindName(MATCH[FACE['full-moon']], 'thanksgiving'), 'Pie', 'the moons');
  equal(faceName(FACE['eyes-3'], 'christmas'), 'Three of Ornaments', "Christmas's three of eyes");
  equal(faceName(FACE['bones-9'], 'christmas'), 'Nine of Candy Canes', "Christmas's nine of bones");
  equal(faceName(FACE['graves-1'], 'christmas'), 'One of Presents', "Christmas's one of graves");
  equal(['vampire', 'werewolf', 'mummy', 'zombie'].map((k) => faceName(FACE[k], 'christmas')).join(', '), 'Partridge, Turtle dove, French hen, Calling bird', "the song's four birds, for the monsters");
  equal(kindName(MATCH[FACE.nightshade], 'christmas'), 'Christmas plant', "Christmas's flowers");
  equal(kindName(MATCH[FACE['full-moon']], 'christmas'), 'Snowflake', "Christmas's moons");
  equal(faceName(FACE['eyes-3'], 'new-year'), 'Three of Clocks', "New Year's three of eyes");
  equal(faceName(FACE['bones-9'], 'new-year'), 'Nine of Party horns', "New Year's nine of bones");
  equal(faceName(FACE['graves-1'], 'new-year'), 'One of Calendars', "New Year's one of graves");
  equal(['vampire', 'werewolf', 'mummy', 'zombie'].map((k) => faceName(FACE[k], 'new-year')).join(', '), 'Father Time, Baby New Year, Night owl, Polar bear', 'four who see the new year in, for the monsters');
  equal(['lantern', 'brew', 'ghost'].map((k) => faceName(FACE[k], 'new-year')).join(', '), "Party hat, Champagne, New Year's ball", 'the red, the green and the white');
  equal(kindName(MATCH[FACE.nightshade], 'new-year'), 'Lucky charm', "New Year's flowers");
  equal(kindName(MATCH[FACE['full-moon']], 'new-year'), 'Season', "New Year's moons");
  equal(['new-moon', 'waxing-moon', 'full-moon', 'waning-moon'].map((k) => faceName(FACE[k], 'new-year')).join(', '), 'Winter, Spring, Summer, Fall', 'the seasons of the year to come, in turn');
  equal(faceName(FACE['eyes-3'], 'groundhog'), 'Three of Burrows', "Groundhog Day's three of eyes");
  equal(faceName(FACE['bones-9'], 'groundhog'), 'Nine of Candles', "Groundhog Day's nine of bones");
  equal(faceName(FACE['graves-1'], 'groundhog'), 'One of Scrolls', "Groundhog Day's one of graves");
  equal(['vampire', 'werewolf', 'mummy', 'zombie'].map((k) => faceName(FACE[k], 'groundhog')).join(', '), 'Groundhog, Hedgehog, Badger, Bear', 'the four weather prophets, for the monsters');
  equal(['lantern', 'brew', 'ghost'].map((k) => faceName(FACE[k], 'groundhog')).join(', '), 'Sun, Weather vane, Cloud', 'the red, the green and the white');
  equal(kindName(MATCH[FACE.nightshade], 'groundhog'), 'Spring flower', "Groundhog Day's flowers");
  equal(kindName(MATCH[FACE['full-moon']], 'groundhog'), 'Songbird', "Groundhog Day's moons");
  equal(faceName(FACE['lost-soul'], 'groundhog'), 'Shadow', "Groundhog Day's lost soul, the groundhog's shadow");
  equal(faceName(FACE['eyes-3'], 'valentines'), 'Three of Hearts', "Valentine's three of eyes");
  equal(faceName(FACE['bones-9'], 'valentines'), 'Nine of Arrows', "Valentine's nine of bones, Cupid's arrows");
  equal(faceName(FACE['graves-1'], 'valentines'), 'One of Valentines', "Valentine's one of graves");
  equal(['vampire', 'werewolf', 'mummy', 'zombie'].map((k) => faceName(FACE[k], 'valentines')).join(', '), 'Bumblebee, Barn owl, Teddy bear, Kitten', "four valentines' puns, for the monsters");
  equal(['lantern', 'brew', 'ghost'].map((k) => faceName(FACE[k], 'valentines')).join(', '), 'Box of chocolates, Love potion, Lace valentine', 'the red, the green and the white');
  equal(kindName(MATCH[FACE.nightshade], 'valentines'), "Love's flower", "Valentine's flowers");
  equal(kindName(MATCH[FACE['full-moon']], 'valentines'), 'Candy heart', "Valentine's moons");
  equal(['new-moon', 'waxing-moon', 'full-moon', 'waning-moon'].map((k) => faceName(FACE[k], 'valentines')).join(', '), 'Be mine, XOXO, Love you, Hug me', "the candy hearts' words");
  equal(faceName(FACE['lost-soul'], 'valentines'), 'Broken heart', "Valentine's lost soul, a broken heart, for Be mine");
});

test("on Twelfth Night a tile left without a partner turns to coal, as Christmas's lost soul is drawn", () => {
  equal(faceName(FACE['lost-soul'], 'christmas'), 'Lump of coal', "Christmas's lost soul");
  check(TWELVE_DAYS.at(-1).text.includes('turns to coal'), "Twelfth Night's card says what a tile left without a partner turns to");
});

test("at midnight on the 1 a tile left without a partner is a sleepyhead, as New Year's lost soul is drawn", () => {
  equal(faceName(FACE['lost-soul'], 'new-year'), 'Sleepyhead', "New Year's lost soul");
  check(COUNTDOWN.at(-1).text.includes('sleepyheads match each other'), "the 1's card says what a tile left without a partner becomes");
});

test("each set's corner numbers have a colour by day and by night", async () => {
  const css = await (await fetch('css/game.css')).text();
  for (const prefix of ['index', 'index-tg', 'index-xm', 'index-ny', 'index-gh', 'index-vl']) {
    for (const group of INDEXED) {
      const found = css.match(new RegExp(`--${prefix}-${group}:\\s*#[0-9a-f]{6};`, 'g')) || [];
      equal(found.length, 2, `--${prefix}-${group}, by day and by night`);
    }
  }
});

test("Friendsgiving's card names the dishes as Thanksgiving's faces draw them", () => {
  const wednesday = DAYS.find((d) => d.name === 'Wednesday');
  for (const face of [FACE.lantern, FACE.brew, FACE.ghost]) {
    const dish = faceName(face, 'thanksgiving').toLowerCase();
    check(wednesday.text.includes(dish), `Wednesday's card has no ${dish}`);
    check(!wednesday.text.includes(FACES[face].name.toLowerCase()), `Wednesday's card still has ${FACES[face].name}`);
  }
});

test("a board's tiles can change to another set's faces, each tile the same face, named the new way", () => {
  const el = document.createElement('div').appendChild(document.createElement('div'));
  const game = new Game(TURTLE, { seed: 3 });
  const board = new Board(el, game);
  const wears = (set) => {
    equal(el.dataset.faces, set, 'the set the board says it wears');
    for (let i = 0; i < TURTLE.count; i++) {
      const face = game.face(i);
      equal(board.tiles[i].use.getAttribute('href'), `#${symbolId(face, set)}`, `${set}: tile ${i}'s face`);
      equal(board.tiles[i].el.getAttribute('aria-label'), faceName(face, set), `${set}: tile ${i}'s name`);
    }
  };
  wears('halloween');
  board.setFaces('thanksgiving');
  wears('thanksgiving');
  board.setFaces('christmas');
  wears('christmas');
  board.setFaces('new-year');
  wears('new-year');
  board.setFaces('groundhog');
  wears('groundhog');
  board.setFaces('valentines');
  wears('valentines');
  board.setFaces('halloween');
  wears('halloween');
});
