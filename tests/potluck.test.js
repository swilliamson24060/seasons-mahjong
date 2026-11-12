import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { POTLUCK } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { DAYS, dayOf, dayOptions } from '../js/thanksgiving.js';

const WEDNESDAY = DAYS.find((d) => d.name === 'Wednesday');
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const count = (g) => g.treats.candle + g.treats.key + g.treats.cat;

test('pairs of the faces a board names leave treats, and an undo never earns a second', () => {
  const L = parseLayout('potluck', ['##.##.##']);
  const g = new Game(L, { faces: facesOf('brew', 'brew', 'eyes-1', 'eyes-1', 'ghost', 'ghost'), treatFaces: [FACE.brew, FACE.ghost] });
  g.match(0, 1);
  equal(count(g), 1, 'a pair of brew leaves one');
  g.undo();
  g.match(0, 1);
  equal(count(g), 1, 'and taking it again after an undo leaves no more');
  g.match(2, 3);
  equal(count(g), 1, 'a pair of eyes leaves none');
  g.match(4, 5);
  equal(count(g), 2, 'a pair of ghosts leaves one');
  const h = new Game(L, { faces: facesOf('brew', 'brew', 'eyes-1', 'eyes-1', 'lantern', 'lantern') });
  h.match(0, 1);
  h.match(4, 5);
  equal(count(h), 1, "unless a board says otherwise, only jack-o'-lanterns leave treats");
});

test("Wednesday is Friendsgiving, on a potluck table of 100 tiles, nine across, whose dishes leave gifts", () => {
  equal(WEDNESDAY.title, 'Friendsgiving', "Wednesday's theme");
  equal(dayOf(POTLUCK), WEDNESDAY, "the table's day");
  equal(WEDNESDAY.gifts, 'potluck', 'its treats are the potluck');
  equal(POTLUCK.count, 100, 'tiles');
  equal(POTLUCK.width / 2, 9, 'tiles across');
  const options = dayOptions(WEDNESDAY);
  check(options.treats && !options.ghostsFloat, "Wednesday's rules: treats, and no floating ghosts");
  equal(options.treatFaces.map((f) => FACE.lantern === f || FACE.brew === f || FACE.ghost === f).join(), 'true,true,true', 'the three dishes');
});

test("Wednesday's deals can be won in the order they were dealt, and bring a gift for each pair of dishes", () => {
  const options = dayOptions(WEDNESDAY);
  let gifts = 0;
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(POTLUCK, { seed, ...options });
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
    check(count(g) >= 3, `seed ${seed}: only ${count(g)} gifts`);
    gifts += count(g);
  }
  return `200 deals; ${(gifts / 200).toFixed(1)} gifts a board`;
});
