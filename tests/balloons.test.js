import { test, check, equal } from './run.js';
import { parseLayout, isFree } from '../js/engine/layout.js';
import { SIX, SEVEN } from '../js/engine/layouts.js';
import { FACE, MATCH } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { spots, poppedIn } from '../js/engine/balloons.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { COUNTDOWN, countdownOf } from '../js/newyear.js';

const SIXTH = COUNTDOWN[4];
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Balloons');
const sorted = (a) => JSON.stringify([...a].sort((x, y) => x - y));

test('balloons drop on free tiles with no other of their kind free; one pops when its tile is taken, for points, the rest float away when the net opens again, and undo takes it all back', () => {
  // Two rows of three: the ends free, the middles hemmed in. The kinds: the
  // top row's first two tiles, the bottom row's first two, and the two at
  // the right-hand end.
  const L = parseLayout('party', ['###\n###']);
  const faces = facesOf('eyes-1', 'eyes-1', 'eyes-2', 'eyes-3', 'eyes-3', 'eyes-2');
  equal(sorted(spots(L, Uint8Array.from(faces, () => 1), faces, (f) => MATCH[f])), '[0,3]', 'where balloons can land: the free tiles alone of their kind');
  const g = new Game(L, { faces, balloons: { every: 2, drop: 2 } });
  check(g.hasBalloon(0) && g.hasBalloon(3) && g.balloonsLeft === 2 && g.dropped === 2 && g.untilDrop === 2, 'the net opening as the board starts');
  let heard = 0;
  g.on('balloon', () => heard++);
  const quiet = g.match(2, 5);
  check(quiet.popped.length === 0 && quiet.net === null && heard === 0 && g.untilDrop === 1, 'a pair with no balloon, and no net due');
  const pop = g.match(0, 1);
  equal(sorted(pop.popped), '[0]', 'the balloon popped');
  equal(sorted(pop.net.floated), '[3]', 'the balloon that floated away as the net opened again');
  equal(pop.net.landed.length, 0, 'balloons dropped where no tile is alone of its kind');
  check(g.popped === 1 && g.floated === 1 && g.balloonsLeft === 0 && heard === 1, 'the pop and the net');
  check(!g.match(3, 4).popped.length && g.won, 'a balloon that had floated away, popped');
  equal(row(g)[2], POINTS.balloon, 'what a balloon popped scores');
  equal(row(g)[1], '1 of 2 popped, 1 floated away', 'the balloons, told');
  g.undo();
  g.undo();
  check(g.hasBalloon(0) && g.hasBalloon(3) && g.popped === 0 && g.floated === 0 && g.nets === 1, 'an undo did not put the balloons back as they were');
  const plain = new Game(L, { faces });
  check(plain.balloons === null && !plain.hasBalloon(0) && plain.untilDrop === Infinity && !row(plain), 'a board without a net has balloons');
});

test('the fifth board of the countdown is the 6, with the balloon drop: 114 tiles, nine across, three balloons every six matches', () => {
  equal(SIXTH.name, 'Six', "the fifth board's number");
  equal(SIXTH.title, 'The balloon drop', "the 6's twist");
  equal(countdownOf(SIX), SIXTH, "the 6's board");
  equal(SIX.count, 114, 'tiles');
  equal(SIX.width / 2, 9, 'tiles across');
  equal(SIX.depth, 4, 'layers');
  equal(JSON.stringify(dayOptions(SIXTH).balloons), JSON.stringify({ every: 6, drop: 3 }), 'the nets');
  check(SIX.count > SEVEN.count, 'no more tiles than the 7');
});

test("the 6's deals can be won in the order they were dealt, which pops a balloon, the first three landing on free tiles alone of their kind", () => {
  const options = dayOptions(SIXTH);
  let popped = 0;
  let dropped = 0;
  for (let seed = 1; seed <= 100; seed++) {
    const g = new Game(SIX, { seed, ...options });
    const first = [...g.balloons.keys()].filter((i) => g.balloons[i]);
    equal(first.length, 3, `seed ${seed}: balloons as the board starts`);
    for (const i of first) {
      check(isFree(SIX, g.present, i), `seed ${seed}: a balloon on a tile not free`);
      check(g.freeTiles().filter((j) => MATCH[g.faces[j]] === MATCH[g.faces[i]]).length === 1, `seed ${seed}: a balloon on a tile with another of its kind free`);
    }
    const counted = poppedIn(SIX, g.plan, g.present, options.balloons, seed, g.faces, (f) => MATCH[f]);
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
    check(g.popped >= 1, `seed ${seed}: the deal's own order pops no balloon`);
    equal(g.popped, counted, `seed ${seed}: balloons popped, as the deal counted them`);
    popped += g.popped;
    dropped += g.dropped;
  }
  return `100 deals; their own order pops ${(popped / 100).toFixed(1)} of ${(dropped / 100).toFixed(1)} balloons`;
});
