import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { DANCER } from '../js/engine/layouts.js';
import { FACE, MATCH } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { dayOptions } from '../js/thanksgiving.js';
import { TWELVE_DAYS, dayOfChristmas } from '../js/christmas.js';

const NINTH = TWELVE_DAYS[8];
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const kindsOf = (g, tiles) => JSON.stringify(tiles.map((t) => MATCH[g.faces[t]]));
const kinds = (...keys) => JSON.stringify(keys.map((key) => MATCH[FACE[key]]));

test('when the music changes, each free tile changes places with a tile held down, leaving a board that can be won; and an undo puts them back', () => {
  // A row of four with two tiles on top of its middle two: the ends and the
  // two on top are free, the middle two held down.
  const g = new Game(parseLayout('floor', ['####', '.##.']), { faces: facesOf('eyes-1', 'eyes-3', 'eyes-3', 'eyes-1', 'eyes-2', 'eyes-2'), dance: 1 });
  equal(g.untilDance, 1, 'matches until the music changes');
  let heard = null;
  g.on('dance', (m) => (heard = m));
  const m = g.match(0, 3);
  check(m.dance && m.dance.swaps.length === 2 && heard === m, 'no dance after the match');
  equal(kindsOf(g, [4, 5, 1, 2]), kinds('eyes-3', 'eyes-3', 'eyes-2', 'eyes-2'), 'the faces after the dance: the held tiles come up, and the free go under');
  equal(JSON.stringify([...m.dance.before.slice(1, 3)]), JSON.stringify(facesOf('eyes-3', 'eyes-3')), 'the faces before it, for the board to show as it begins');
  check(g.outlook === 'win' && g.suggest(), 'the board cannot be won after the dance');
  g.undo();
  equal(kindsOf(g, [4, 5]), kinds('eyes-2', 'eyes-2'), 'the faces after an undo');

  // With no tile held down, there is no one to change partners with.
  const open = new Game(parseLayout('open', ['#.#.#.#']), { faces: facesOf('eyes-1', 'eyes-1', 'eyes-2', 'eyes-2'), dance: 1 });
  const o = open.match(0, 1);
  check(!o.dance && !o.sitOut && !open.canDance, 'a dance with no tile held down');
  const plain = new Game(parseLayout('plain', ['####', '.##.']), { faces: facesOf('eyes-1', 'eyes-3', 'eyes-3', 'eyes-1', 'eyes-2', 'eyes-2') });
  check(!plain.match(0, 3).dance && plain.untilDance === Infinity, 'a dance on a board without one');
});

test('the ninth day is nine ladies dancing, on a dancer of 116 tiles, nine across, changing partners every nine matches', () => {
  equal(NINTH.title, 'Nine ladies dancing', "the ninth day's gift");
  equal(dayOfChristmas(DANCER), NINTH, "the dancer's day");
  equal(DANCER.count, 116, 'tiles');
  equal(DANCER.width / 2, 9, 'tiles across');
  equal(DANCER.depth, 5, 'layers');
  equal(dayOptions(NINTH).dance, 9, 'matches between dances');
  check(TWELVE_DAYS[7].layout.count < DANCER.count, 'no more tiles than the eighth day');
});

test("the ninth day's boards can be won through every dance, following the hints, and the music changes every nine matches", () => {
  const options = dayOptions(NINTH);
  let dances = 0;
  let sat = 0;
  let moved = 0;
  for (let seed = 1; seed <= 20; seed++) {
    const g = new Game(DANCER, { seed, ...options });
    g.on('dance', ({ dance }) => {
      equal(g.matches % 9, 0, `seed ${seed}: the music changed after ${g.matches} matches`);
      if (!dance) return sat++;
      dances++;
      moved += dance.swaps.length;
      check(g.outlook === 'win' && g.line && g.line.length, `seed ${seed}: no way to win after a dance`);
    });
    while (!g.won) {
      const pair = g.suggest();
      check(pair && g.match(...pair), `seed ${seed}: the hints cannot go on after ${g.matches} matches`);
      if (!pair) break;
    }
    check(g.won, `seed ${seed}: not cleared`);
  }
  check(dances >= 20 * 4, `only ${dances} dances in 20 boards`);
  return `20 boards; ${(dances / 20).toFixed(1)} dances a board, each moving ${((moved * 2) / dances).toFixed(0)} tiles, and ${sat} times the dancers kept their partners`;
});
