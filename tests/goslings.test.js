import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { GOOSE } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { followsOn } from '../js/engine/goslings.js';
import { Game } from '../js/engine/game.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { TWELVE_DAYS, dayOfChristmas } from '../js/christmas.js';

const SIXTH = TWELVE_DAYS[5];
const facesOf = (...keys) => keys.map((key) => FACE[key]);
// A row of fourteen tiles, whose only free tiles are its two ends, so that
// each pair taken from the ends lies beside the pair before it: seven pairs,
// the first and then six goslings.
const ROW = '##############';
const rowFaces = facesOf('eyes-1', 'eyes-2', 'eyes-3', 'eyes-4', 'eyes-5', 'eyes-6', 'eyes-7', 'eyes-7', 'eyes-6', 'eyes-5', 'eyes-4', 'eyes-3', 'eyes-2', 'eyes-1');
const line = (drawing = ROW, faces = rowFaces, goslings = 6) => new Game(parseLayout('pond', [drawing]), { faces, goslings });
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Lines of goslings');

test('a pair follows on when one of its tiles lay beside one of the pair before it, or under it: not across a gap, or corner to corner', () => {
  // Three tiles in a row with a gap before the third, one under the first,
  // and a tile on top of the second and of the third.
  const L = parseLayout('pond', ['##.#\n#...', '.#.#']);
  check(followsOn(L, [0], [1]), 'side by side');
  check(followsOn(L, [0], [3]), 'one just above the other');
  check(!followsOn(L, [1], [2]), 'across a gap');
  check(!followsOn(L, [1], [3]), 'corner to corner');
  check(followsOn(L, [4], [1]), 'the tile it lay on');
  check(followsOn(L, [2, 4], [3, 1]), 'a pair follows on if either of its tiles does, from either tile before it');
});

test('six goslings in a line score, and a new line starts; a pair that does not follow on breaks the line, and undo puts it back', () => {
  const g = line();
  let heard = 0;
  let broods = 0;
  g.on('gosling', ({ brood }) => {
    heard++;
    if (brood) broods++;
  });
  check(!g.match(0, 13).gosling, 'the first pair taken followed on');
  for (let k = 1; k <= 5; k++) check(g.match(k, 13 - k).gosling && g.trail === k, `the pair ${k} in from the ends did not follow on`);
  const last = g.match(6, 7);
  check(last.gosling && last.brood && g.broods === 1 && g.trail === 0, 'six goslings did not make a line, and start a new one');
  equal(heard, 6, 'goslings heard');
  equal(broods, 1, 'lines heard');
  equal(row(g)[2], POINTS.brood, 'what a line scores');
  g.undo();
  check(g.broods === 0 && g.trail === 5, 'an undo did not take the line back');
  equal(row(g)[2], 0, 'what it scores, taken back');

  // A pair away from the line breaks it.
  const apart = line(`${ROW}\n..............\n##`, [...rowFaces, ...facesOf('eyes-8', 'eyes-8')]);
  apart.match(0, 13);
  apart.match(1, 12);
  check(!apart.match(14, 15).gosling && apart.trail === 0, 'a pair away from the line did not break it');
  apart.undo();
  equal(apart.trail, 1, 'the line, after an undo');

  const plain = new Game(parseLayout('plain', ['####']), { faces: facesOf('eyes-1', 'eyes-2', 'eyes-2', 'eyes-1') });
  plain.match(0, 3);
  check(!plain.match(1, 2).gosling && plain.trail === 0, 'a gosling on a board without them');
  check(!row(plain), 'a row for them on a board without them');
});

test('a shuffle does not part the line, and the free tiles that would follow on are known', () => {
  const g = line();
  check(!g.followsFrom(0), 'a tile follows on before any pair is taken');
  g.match(0, 13);
  check(g.followsFrom(1) && g.followsFrom(12) && !g.followsFrom(6), 'the tiles beside the pair taken');
  g.match(1, 12);
  check(g.shuffle(), 'no shuffle');
  equal(g.trail, 1, 'the line after a shuffle');
  check(g.match(2, 11).gosling && g.trail === 2, 'the line did not go on after a shuffle');
});

test('the sixth day is six geese a-laying, on a goose of 104 tiles, nine across, with goslings in a line', () => {
  equal(SIXTH.title, 'Six geese a-laying', "the sixth day's gift");
  equal(dayOfChristmas(GOOSE), SIXTH, "the goose's day");
  equal(GOOSE.count, 104, 'tiles');
  equal(GOOSE.width / 2, 9, 'tiles across');
  equal(GOOSE.depth, 4, 'layers');
  equal(dayOptions(SIXTH).goslings, 6, 'goslings to a line');
  check(TWELVE_DAYS[4].layout.count < GOOSE.count, 'no more tiles than the fifth day');
  // The eggs on the front of the nest lie half a tile lower, each on its own.
  const eggs = [...GOOSE.y.keys()].filter((i) => GOOSE.y[i] % 2 === 1);
  equal(eggs.length, 4, 'eggs');
  const g = new Game(GOOSE, { seed: 1, ...dayOptions(SIXTH) });
  for (const i of eggs) check(g.isFree(i), 'an egg is not free at the start');
});

test("the sixth day's deals can be won in the order they were dealt, and a player who follows on whenever they can makes lines of six", () => {
  const options = dayOptions(SIXTH);
  for (let seed = 1; seed <= 200; seed++) {
    const g = new Game(GOOSE, { seed, ...options });
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won, `seed ${seed}: not cleared`);
  }
  // Following on whenever a pair would, the first such pair found; and
  // otherwise the first pair found.
  let lines = 0;
  let some = 0;
  for (let seed = 1; seed <= 50; seed++) {
    const g = new Game(GOOSE, { seed, ...options });
    for (let pairs = g.pairs(); pairs.length; pairs = g.pairs()) {
      const last = g.lastMatch();
      g.match(...(pairs.find((p) => last && followsOn(GOOSE, [last.a, last.b], p)) || pairs[0]));
    }
    lines += g.broods;
    if (g.broods) some++;
  }
  check(some >= 30, `lines of six in only ${some} of 50 games, following on`);
  return `200 deals; following on whenever it can, a player makes ${(lines / 50).toFixed(1)} lines of six a board, and some in ${some} of 50`;
});
