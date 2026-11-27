import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { SAILBOAT } from '../js/engine/layouts.js';
import { FACE, MATCH } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { waveTiles, turnsOf, turned, rollIn } from '../js/engine/waves.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SUMMER } from '../js/summer.js';

const FOURTH = SUMMER[3];
const OPTIONS = dayOptions(FOURTH);
const facesOf = (...keys) => keys.map((key) => FACE[key]);

// Two rows: tiles 0, 1 and 2 across the top, and 3, 4 and 5 along the
// foot, where the waves roll in.
const SHORE = parseLayout('shore', ['###\n###']);

test('a wave reaches the tiles along the foot of the board, and tries turning them one place along, then back, then two places, and so on', () => {
  equal(waveTiles(SHORE, new Uint8Array(6).fill(1)).join(), '3,4,5', 'the tiles along the foot');
  equal(waveTiles(SHORE, Uint8Array.from([1, 1, 1, 1, 0, 1])).join(), '3,5', 'the tiles along the foot still on the board');
  equal(turnsOf(9).join(), '1,8,2,7,3,6,4,5', 'the turns along nine tiles');
  equal(`${turnsOf(2).join()} | ${turnsOf(3).join()}`, '1 | 1,2', 'the turns along two and three');
  const faces = facesOf('eyes-1', 'eyes-2', 'eyes-3', 'bones-1', 'bones-2', 'bones-3');
  equal(Array.from(turned(faces, [3, 4, 5], 1)).join(), facesOf('eyes-1', 'eyes-2', 'eyes-3', 'bones-3', 'bones-1', 'bones-2').join(), 'the faces along the foot turned a place along');
});

test("a wave rolls in every so many matches, turning the tiles along the foot so that the board can still be won, and an undo turns them back", () => {
  // The top row's ends a pair, and the foot's; the middles a pair.
  const faces = facesOf('eyes-1', 'eyes-2', 'eyes-1', 'eyes-3', 'eyes-2', 'eyes-3');
  const g = new Game(SHORE, { faces, waves: { every: 1 } });
  let heard = null;
  g.on('wave', (e) => (heard = e));
  equal(g.untilWave, 1, 'the matches until the first wave');
  const before = Array.from(g.faces);
  const r = g.match(0, 2);
  check(r && r.wave && heard === r, 'no wave after the match');
  equal(r.wave.tiles.join(), '3,4,5', 'the tiles the wave reached');
  equal(Array.from(g.faces).join(), Array.from(turned(before, [3, 4, 5], r.wave.shift)).join(), "the foot's faces not turned as the wave says");
  check(g.outlook === 'win' && g.holds(g.line), 'no way to win after the wave');
  equal(g.wavesRolled, 1, 'the waves rolled in');
  g.undo();
  equal(`${Array.from(g.faces).join()} ${g.wavesRolled}`, `${before.join()} 0`, 'an undo, the foot not turned back');
});

test('a wave falls short with no way to turn the tiles that leaves a board that can be won', () => {
  // A pair, one tile on the other, both along the foot: the one on top
  // holds its partner down, and no turn of them can be won.
  const STACK = parseLayout('stack', ['#', '#']);
  const faces = facesOf('eyes-1', 'eyes-1');
  const present = new Uint8Array(2).fill(1);
  equal(rollIn(STACK, { faces, present }, waveTiles(STACK, present)), null, 'a wave turning tiles that can never be won');
});

test('the sailboat is won through every wave, following the hints, the waves rolling in every six matches', () => {
  let rolled = 0;
  let short = 0;
  for (let seed = 1; seed <= 16; seed++) {
    const g = new Game(SAILBOAT, { seed, ...OPTIONS });
    g.on('wave', ({ wave }) => {
      if (!wave) return short++;
      rolled++;
      check(g.outlook === 'win' && g.line && g.line.length, `seed ${seed}: no way to win after a wave`);
      check(wave.tiles.every((t) => SAILBOAT.y[t] === SAILBOAT.height - 2), `seed ${seed}: a wave reaching off the foot`);
    });
    while (!g.won) {
      const pair = g.hint();
      check(pair && g.match(...pair), `seed ${seed}: the hint with ${g.left} tiles left`);
      if (!pair) break;
    }
  }
  check(rolled >= 16 * 5, `only ${rolled} waves in 16 boards`);
  return `16 boards; ${(rolled / 16).toFixed(1)} waves a board, ${short} falling short`;
});

test("a pair that matched along the foot before a wave may not after it, and the faces only move along the foot", () => {
  const g = new Game(SAILBOAT, { seed: 3, ...OPTIONS });
  const before = Array.from(g.faces);
  let wave = null;
  g.on('wave', (e) => (wave = e.wave));
  for (let k = 0; k < 6; k++) g.match(...g.hint());
  check(wave, 'no wave after six matches');
  const kinds = (faces) => [...faces].map((f) => MATCH[f]).sort((a, b) => a - b).join();
  const foot = (faces) => wave.tiles.map((t) => faces[t]);
  equal(kinds(foot(g.faces)), kinds(foot(wave.before)), "the foot's faces, all told, not the same after the wave");
  for (let i = 0; i < SAILBOAT.count; i++) if (!wave.tiles.includes(i)) check(g.faces[i] === before[i], `tile ${i}, off the foot, changed by a wave`);
});
