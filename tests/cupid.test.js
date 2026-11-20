import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { HEART } from '../js/engine/layouts.js';
import { FACE, MATCH } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { bare, couplesFor, wayWith } from '../js/engine/cupid.js';
import { seeded } from '../js/engine/rng.js';
import { POINTS, scoreOf } from '../js/score.js';

const OPTIONS = { treats: false, ghostsFloat: false, arrows: 8 };
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Love at first sight');
const kindOf = (f) => MATCH[f];

// Whether a way to win takes a couple together within its first so many
// pairs.
const takesSoon = (way, [x, y], within) => way.slice(0, within).some(([a, b]) => (a === x && b === y) || (a === y && b === x));

test('an arrow can strike two tiles of a kind with nothing on them, not both free; and a way can be made to take them sooner, if it still wins', () => {
  // Two rows of three, apart: each row's ends free, its middle held.
  const L = parseLayout('rows', ['###.###']);
  const faces = ['eyes-1', 'eyes-2', 'eyes-1', 'eyes-2', 'eyes-1', 'eyes-1'].map((k) => FACE[k]);
  const present = new Uint8Array(L.count).fill(1);
  const free = (i) => [0, 2, 3, 5].includes(i);
  const couples = couplesFor(L, present, faces, kindOf, free).map((c) => c.join()).join(' ');
  equal(couples, '0,4 1,3 2,4 4,5', 'the couples: never two tiles both free already, nor of two kinds');
  // With a tile on one, it can't be struck: its heart wouldn't show.
  const stacked = parseLayout('stack', ['###', '.#.']);
  check(!bare(stacked, new Uint8Array(4).fill(1), 1) && bare(stacked, new Uint8Array(4).fill(1), 3), 'a tile with another on it counted as bare');
  // A way that takes the middle tiles late: made to take them together
  // first, once the ends are gone, it still wins.
  const way = [[0, 5], [2, 4], [1, 3]];
  const g = new Game(L, { faces });
  const holds = (line) => g.holds(line);
  check(holds(way), 'the way given does not win');
  const sooner = wayWith(way, [2, 4], 1, holds);
  equal(JSON.stringify(sooner), JSON.stringify(null), 'a couple taken first though its tile is held');
  equal(JSON.stringify(wayWith(way, [2, 4], 2, holds)), JSON.stringify(way), 'a couple the way takes in time already');
  const made = wayWith(way, [0, 4], 2, holds);
  check(made && takesSoon(made, [0, 4], 2) && holds(made), 'a couple the way pairs apart, not taken together in time');
});

test("Cupid's arrows strike as the board starts and every eight matches, each a couple whose hearts show, to be dug for, that the hints' way takes in time: following the hints, every one is love at first sight", () => {
  let arrows = 0;
  let dug = 0;
  for (let seed = 1; seed <= 60; seed++) {
    const g = new Game(HEART, { seed, ...OPTIONS });
    const look = (tiles) => {
      const [x, y] = tiles;
      arrows++;
      check(MATCH[g.faces[x]] === MATCH[g.faces[y]], `seed ${seed}: a couple of two kinds`);
      check(bare(HEART, g.present, x) && bare(HEART, g.present, y), `seed ${seed}: a couple with a tile under another, its heart hidden`);
      check(takesSoon(g.line, tiles, 8), `seed ${seed}: a couple the hints' way doesn't take within eight matches`);
      if (!(g.isFree(x) && g.isFree(y))) dug++;
    };
    look(g.couple.tiles);
    g.on('arrow', ({ arrow }) => arrow && look(arrow));
    while (g.left) g.match(...g.suggest());
    check(g.won, `seed ${seed}: following the hints, not cleared`);
    equal(g.arrowsFlown, 6, `seed ${seed}: arrows over 46 matches`);
    equal(g.loves, 6, `seed ${seed}: couples taken together, following the hints`);
    equal(row(g)[2], 6 * POINTS.love, `seed ${seed}: what love at first sight scores`);
  }
  check(dug / arrows > 0.85, `only ${dug} of ${arrows} couples had to be dug for`);
  return `60 deals; ${dug} of ${arrows} couples dug for, the rest free already when struck`;
});

test('the couple taken together is love at first sight; one taken with another tile breaks a heart; left, they get over it as the next arrow flies; and an undo takes each back', () => {
  // Love at first sight, following the hints to it.
  const g = new Game(HEART, { seed: 3, ...OPTIONS });
  const first = g.couple.tiles.join();
  const heard = [];
  g.on('arrow', (r) => heard.push(r));
  while (g.couple.state === 'smitten') g.match(...g.suggest());
  check(g.couple.state === 'love' && g.loves === 1 && heard.at(-1).love, 'following the hints, the couple was not taken together');
  equal(row(g)[1], '1 of 1 couples', 'love at first sight, told');
  g.undo();
  check(g.couple.state === 'smitten' && g.loves === 0 && g.couple.tiles.join() === first, 'an undo did not take love at first sight back');

  // A broken heart: a careless player, taking whatever pair comes first,
  // takes a smitten tile with another tile of its kind.
  let broken = null;
  for (let seed = 1; seed <= 40 && !broken; seed++) {
    const h = new Game(HEART, { seed, ...OPTIONS });
    while (h.left && !broken) {
      const [x, y] = h.couple ? h.couple.tiles : [-1, -1];
      const arrowNext = (h.matches + 1) % 8 === 0; // a heart broken just as the next arrow flies is a story of its own
      const parting = arrowNext ? undefined : h.pairs().find(([a, b]) => h.isSmitten(a) !== h.isSmitten(b));
      const pair = parting || h.pairs().find(([a, b]) => ![x, y].includes(a) && ![x, y].includes(b));
      if (!pair) break;
      const result = h.match(...pair);
      if (parting) broken = { h, result, other: [x, y].find((t) => !pair.includes(t)) };
    }
  }
  check(broken, 'no smitten tile could be taken with another');
  const { h, result, other } = broken;
  check(result.heartbreak && !result.love && h.heartbreaks === 1 && h.couple.state === 'broken', 'a smitten tile taken with another did not break a heart');
  check(!h.isSmitten(other), 'its partner still smitten');
  equal(row(h)[1], `${h.loves} of ${h.arrowsFlown} couples, 1 heart broken`, 'a broken heart, told');
  h.undo();
  check(h.couple.state === 'smitten' && h.heartbreaks === 0 && h.isSmitten(other), 'an undo did not mend the heart');

  // Getting over it: eight matches leaving the couple alone, and Cupid lets
  // fly again.
  const k = new Game(HEART, { seed: 5, ...OPTIONS });
  const old = k.couple.tiles.slice();
  let last = null;
  for (let m = 0; m < 8; m++) {
    const pair = k.pairs().find(([a, b]) => !old.includes(a) && !old.includes(b));
    check(pair, 'no pair leaving the couple alone');
    last = k.match(...pair);
  }
  check(last.arrowDue && last.overIt && last.overIt.join() === old.join() && last.arrow, 'eight matches on, no new arrow, or the old couple not over it');
  check(k.couple.tiles.join() !== old.join() && k.couple.state === 'smitten' && k.arrowsFlown === 2 && k.untilArrow === 8, 'the new couple not smitten, or the old one still');
  k.undo();
  check(k.couple.tiles.join() === old.join() && k.couple.state === 'smitten' && k.arrowsFlown === 1 && k.untilArrow === 1, 'an undo did not take the arrow back');

  const plain = new Game(HEART, { seed: 3, treats: false });
  check(plain.couple === null && plain.untilArrow === Infinity && !row(plain), 'a board without the arrows has them');
});

test('a shuffle moves the couple with the tiles, so that its two tiles still match, and an undo puts it back; a board reached the same way sees the same arrows', () => {
  const g = new Game(HEART, { seed: 7, ...OPTIONS });
  const before = g.couple.tiles.join();
  check(g.shuffle(), 'no shuffle');
  const [x, y] = g.couple.tiles;
  check(g.couple.state === 'smitten' && MATCH[g.faces[x]] === MATCH[g.faces[y]], 'after a shuffle, the couple no longer a pair');
  g.undo();
  equal(g.couple.tiles.join(), before, 'the couple, after an undo of the shuffle');

  for (const seed of [1, 2, 3, 4]) {
    const play = () => {
      const h = new Game(HEART, { seed, ...OPTIONS });
      const r = seeded(seed * 13);
      const seen = [h.couple.tiles.join()];
      h.on('arrow', ({ arrow }) => arrow && seen.push(arrow.join()));
      while (h.left && h.pairs().length) {
        if (h.matches === 10) h.hint();
        h.match(...r.pick(h.pairs()));
      }
      return seen.join(' | ');
    };
    equal(play(), play(), `seed ${seed}: the arrows, played the same way twice`);
  }
});
