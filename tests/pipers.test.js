import { test, check, equal } from './run.js';
import { parseLayout, isFree } from '../js/engine/layout.js';
import { BAGPIPES } from '../js/engine/layouts.js';
import { FACE, MATCH } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { TWELVE_DAYS, dayOfChristmas } from '../js/christmas.js';

const ELEVENTH = TWELVE_DAYS[10];
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Pied pipers');
// A row of four with two tiles on top of its middle two: the piper is the
// first tile, and the rest of his kind lie under the two on top.
const HALL = parseLayout('hall', ['####', '.##.']);

test('a piper taken plays: the rest of his kind follow him out from wherever they are, buried or not, for points, and undo brings them back', () => {
  const g = new Game(HALL, { faces: facesOf('eyes-1', 'eyes-1', 'eyes-1', 'eyes-1', 'eyes-2', 'eyes-2'), pipers: [0] });
  check(g.isPiper(0) && g.pipersLeft === 1, 'the piper');
  check(!isFree(HALL, g.present, 1) && !isFree(HALL, g.present, 2), 'the rest of his kind are not buried');
  let heard = null;
  g.on('pipe', ({ piped }) => (heard = piped));
  const m = g.match(0, 3);
  equal(JSON.stringify(m.piped), '[1,2]', 'the tiles that followed him');
  check(heard === m.piped && !g.present[1] && !g.present[2] && g.left === 2 && g.piped === 2, 'the rest of his kind did not follow him out');
  equal(row(g)[2], 2 * POINTS.piped, 'what they score');
  check(g.suggest() && g.match(4, 5) && g.won, 'the board left could not be won');
  g.undo();
  g.undo();
  check(g.present[1] && g.present[2] && g.left === 6 && g.piped === 0 && g.isPiper(0), 'an undo did not bring them back');

  // A piper whose kind has no others left on the board leads none out.
  const lone = new Game(HALL, { faces: facesOf('eyes-1', 'eyes-3', 'eyes-3', 'eyes-1', 'eyes-2', 'eyes-2'), pipers: [0] });
  check(lone.match(0, 3).piped.length === 0 && lone.piped === 0, 'a piper with none of his kind left led some out');
  const plain = new Game(HALL, { faces: facesOf('eyes-1', 'eyes-1', 'eyes-1', 'eyes-1', 'eyes-2', 'eyes-2') });
  check(plain.match(0, 3).piped.length === 0 && plain.left === 4 && !row(plain), 'tiles followed out on a board without pipers');
});

test('the eleventh day is eleven pipers piping, on bagpipes of 124 tiles, nine across, with eleven pipers', () => {
  equal(ELEVENTH.title, 'Eleven pipers piping', "the eleventh day's gift");
  equal(dayOfChristmas(BAGPIPES), ELEVENTH, "the bagpipes' day");
  equal(BAGPIPES.count, 124, 'tiles');
  equal(BAGPIPES.width / 2, 9, 'tiles across');
  equal(BAGPIPES.depth, 3, 'layers');
  equal(dayOptions(ELEVENTH).pipers, 11, 'pipers');
  check(TWELVE_DAYS[9].layout.count < BAGPIPES.count, 'no more tiles than the tenth day');
});

test("the eleventh day's eleven pipers are each of a kind of his own, with two pairs, held down at the start; and following the hints, every one leads two out", () => {
  const options = dayOptions(ELEVENTH);
  let piped = 0;
  for (let seed = 1; seed <= 60; seed++) {
    const g = new Game(BAGPIPES, { seed, ...options });
    const pipers = [...g.pipers.keys()].filter((i) => g.pipers[i]);
    equal(pipers.length, 11, `seed ${seed}: pipers`);
    const kinds = pipers.map((i) => MATCH[g.faces[i]]);
    equal(new Set(kinds).size, 11, `seed ${seed}: kinds among the pipers`);
    for (const k of kinds) equal(g.faces.filter((f, i) => g.present[i] && MATCH[f] === k).length, 4, `seed ${seed}: tiles of a piper's kind`);
    check(pipers.every((i) => !isFree(BAGPIPES, g.present, i)), `seed ${seed}: a piper free from the start`);
    while (!g.won) {
      const pair = g.suggest();
      check(pair && g.match(...pair), `seed ${seed}: the hints cannot go on after ${g.matches} matches`);
      if (!pair) break;
    }
    check(g.won, `seed ${seed}: not cleared`);
    equal(g.piped, 22, `seed ${seed}: tiles that followed the pipers out`);
    piped += g.piped;
  }
  return `60 deals, each won by the hints, the pipers leading ${piped / 60} tiles out of every one`;
});
