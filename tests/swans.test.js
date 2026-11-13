import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { SWAN } from '../js/engine/layouts.js';
import { FACE, MATCH } from '../js/engine/tiles.js';
import { mirrorOf, swansIn, swansCanPart } from '../js/engine/swans.js';
import { Game } from '../js/engine/game.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { TWELVE_DAYS, dayOfChristmas } from '../js/christmas.js';

const SEVENTH = TWELVE_DAYS[6];
const facesOf = (...keys) => keys.map((key) => FACE[key]);
// A pond of two rows, the second the first's reflection: tiles 0 to 3 above
// the water, and 4 to 7 below it, each straight below its own.
const POND = '####\n####';
const pond = (faces) => new Game(parseLayout('pond', [POND]), { faces: facesOf(...faces), swans: 7 });
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Swans');

test("a tile's reflection is the tile as far below the water as it is above, on the same layer", () => {
  const L = parseLayout('lake', ['#..\n.#.\n.#.\n#..', '....\n.#..\n.#..']);
  const mirror = mirrorOf(L);
  equal(mirror[0], 3, 'the top corner, and the bottom one');
  equal(mirror[1], 2, 'the two either side of the water');
  equal(mirror[4], 5, 'on the layer above');
  equal(mirror[mirror[4]], 4, 'and back again');
  const lone = mirrorOf(parseLayout('lone', ['###\n.#.']));
  equal(lone[0], -1, 'a tile with nothing where its reflection would be');
  equal(lone[1], 3, 'a tile with its reflection');
});

test('a tile and its own reflection, taken together, are a swan, for points; a swan whose tile goes with another swims off; and undo puts them back', () => {
  // Above: eyes-1, eyes-2, eyes-3, eyes-3. Below: eyes-1, eyes-3, eyes-2, eyes-3.
  // Swans: tiles 0 and 4 (eyes-1), and 3 and 7 (eyes-3).
  const g = pond(['eyes-1', 'eyes-2', 'eyes-3', 'eyes-3', 'eyes-1', 'eyes-3', 'eyes-2', 'eyes-3']);
  equal(JSON.stringify(g.swans), '[[0,4],[3,7]]', 'the swans');
  let heard = 0;
  g.on('swan', ({ swan }) => swan && heard++);
  check(g.match(0, 4).swan && g.swansFound === 1 && heard === 1, 'a tile and its reflection were not a swan');
  equal(row(g)[2], POINTS.swan, 'what a swan scores');
  const off = g.match(3, 5);
  check(!off.swan && off.swamOff === 1 && g.swans.length === 0, 'a swan whose tile went with another did not swim off');
  g.undo();
  check(g.swans.length === 1 && g.swansFound === 1, 'an undo did not bring her back');
  g.undo();
  check(g.swans.length === 2 && g.swansFound === 0, 'an undo did not take the swan found back');
  equal(row(g)[2], 0, 'what it scores, taken back');
  check(g.inLake(4) && !g.inLake(3), 'the lake is the bottom half');

  const plain = new Game(parseLayout('plain', [POND]), { faces: facesOf('eyes-1', 'eyes-2', 'eyes-3', 'eyes-3', 'eyes-1', 'eyes-3', 'eyes-2', 'eyes-3') });
  check(plain.swans === null && !plain.match(0, 4).swan && !plain.inLake(4), 'a swan on a board without them');
  check(!row(plain), 'a row for them on a board without them');
});

test('the seventh day is seven swans a-swimming, on a swan of 108 tiles, nine across, mirrored in the lake', () => {
  equal(SEVENTH.title, 'Seven swans a-swimming', "the seventh day's gift");
  equal(dayOfChristmas(SWAN), SEVENTH, "the swan's day");
  equal(SWAN.count, 108, 'tiles');
  equal(SWAN.width / 2, 9, 'tiles across');
  equal(SWAN.depth, 4, 'layers');
  equal(dayOptions(SEVENTH).swans, 7, 'swans');
  check(TWELVE_DAYS[5].layout.count < SWAN.count, 'no more tiles than the sixth day');
  const mirror = mirrorOf(SWAN);
  check([...mirror].every((m, i) => m >= 0 && mirror[m] === i && SWAN.z[m] === SWAN.z[i] && SWAN.x[m] === SWAN.x[i]), 'a tile without its reflection');
  equal([...SWAN.y].filter((y) => y >= SWAN.height / 2).length, SWAN.count / 2, 'tiles in the lake');
});

test("the seventh day's deals can be won in the order they were dealt, with seven swans, each of a kind with another pair, coming free at different times", () => {
  const options = dayOptions(SEVENTH);
  let atStart = 0;
  const comeFree = [];
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(SWAN, { seed, ...options });
    equal(g.swans.length, 7, `seed ${seed}: swans`);
    check(swansCanPart(g.faces, g.present, g.swans), `seed ${seed}: a swan whose kind has no other pair`);
    for (const [a, b] of g.swans) check(MATCH[g.faces[a]] === MATCH[g.faces[b]] && g.mirror[a] === b, `seed ${seed}: a swan that is not a tile and its matching reflection`);
    atStart += g.swans.filter(([a, b]) => g.isFree(a) && g.isFree(b)).length;
    const seen = new Set();
    for (const [a, b] of g.plan) {
      for (const [x, y] of g.swans) {
        if (!seen.has(x) && g.isFree(x) && g.isFree(y)) {
          seen.add(x);
          comeFree.push(g.matches);
        }
      }
      check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    }
    check(g.won && g.swansFound === 7, `seed ${seed}: ${g.swansFound} swans found on the deal's own order`);
  }
  comeFree.sort((p, q) => p - q);
  const half = comeFree[comeFree.length >> 1];
  check(atStart / 200 < 2 && half >= 8, 'the swans are free too soon');
  return `200 deals; ${(atStart / 200).toFixed(1)} swans free at the start, and half the rest by match ${half} of 54, on the deal's own order`;
});

test('a shuffle on the lake deals the swans still to be found again, as many as there were, and an undo puts them back', () => {
  const g = new Game(SWAN, { seed: 5, ...dayOptions(SEVENTH) });
  for (const [a, b] of g.plan.slice(0, 12)) g.match(a, b);
  const before = JSON.stringify(g.swans);
  const found = g.swansFound;
  check(g.shuffle(), 'no shuffle');
  equal(g.swans.length, JSON.parse(before).length, 'swans still to find after a shuffle');
  equal(g.swansFound, found, 'swans found after a shuffle');
  g.undo();
  equal(JSON.stringify(g.swans), before, 'the swans after an undo');
  for (const [a, b] of swansIn(SWAN, g.mirror, g.faces, g.present)) check(g.swans.some(([x, y]) => x === a && y === b), 'a swan the game does not know');
});
