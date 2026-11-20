import { test, check, equal } from './run.js';
import { parseParts } from '../js/engine/layout.js';
import { XO } from '../js/engine/layouts.js';
import { Game } from '../js/engine/game.js';
import { letterOf, pairLetter, runOn, xoxosIn, byTurns } from '../js/engine/xoxo.js';
import { seeded } from '../js/engine/rng.js';
import { POINTS, scoreOf } from '../js/score.js';

const OPTIONS = { treats: false, ghostsFloat: false, xoxo: { split: 11 } };
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'XOXOs');
const of = (g, [a, b]) => pairLetter(XO, a, b, 11);

test('a pair from the X is a kiss and from the O a hug; four taken in turn make an XOXO, and two of a kind together, or a pair across the letters, start the run again; a deal can be made to take them in turn', () => {
  // Two rows of two, one above the other, as the X over the O.
  const L = parseParts('xo', [{ layers: ['##'] }, { layers: ['##'], dy: 3 }]);
  const [x1, x2, o1, o2] = [0, 1, 2, 3];
  equal([x1, x2, o1, o2].map((t) => letterOf(L, t, 3)).join(''), 'XXOO', 'the letters, split three half tiles down');
  equal([pairLetter(L, x1, x2, 3), pairLetter(L, o1, o2, 3), pairLetter(L, x1, o1, 3)].join(), 'X,O,', 'a kiss, a hug, and a pair across');
  // The run, pair by pair.
  let run = '';
  const told = ['X', 'O', 'X', 'O', 'O', 'X', null, 'X', 'X'].map((letter) => {
    const step = runOn(run, letter);
    run = step.run;
    return step.xoxo ? '!' : run || '-';
  });
  equal(told.join(' '), 'X XO XOX ! O OX - X X', 'the run after each pair, ! for an XOXO');
  equal(xoxosIn(L, [[x1, x2], [o1, o2], [x1, x2], [o1, o2], [x1, x2], [o1, o2], [x1, x2], [o1, o2]], 3), 2, 'XOXOs in an order taking kisses and hugs in turn');
  // The deal tries the letter whose turn it is first.
  const prefer = byTurns(L, 3);
  equal(prefer([o1, x1, o2, x2], null, []).join(), [x1, x2, o1, o2].join(), 'the first turn a kiss');
  equal(prefer([o1, x1, o2, x2], null, [[x1, x2]]).join(), [o1, o2, x1, x2].join(), 'after a kiss, a hug');
  equal(prefer([o1, x1, o2], null, [[o1, o2]]).join(), [o1, o2, x1].join(), "a kiss's turn with only one tile of the X free: the O's first");
});

test("hugs and kisses is dealt a letter at a time, its own order taking kisses and hugs in turn: following the hints makes thirteen XOXOs or more", () => {
  let made = 0;
  for (let seed = 1; seed <= 60; seed++) {
    const g = new Game(XO, { seed, ...OPTIONS });
    check(g.plan.every((pair) => of(g, pair)), `seed ${seed}: the deal's own order takes a pair across the letters`);
    const own = xoxosIn(XO, g.plan, 11);
    check(own >= 13, `seed ${seed}: the deal's own order makes only ${own} XOXOs`);
    while (g.left) g.match(...g.suggest());
    check(g.won, `seed ${seed}: following the hints, not cleared`);
    check(g.xoxos >= 13, `seed ${seed}: following the hints made only ${g.xoxos} XOXOs`);
    equal(row(g)[2], g.xoxos * POINTS.xoxo, `seed ${seed}: what the XOXOs score`);
    made += g.xoxos;
  }
  return `60 deals, ${(made / 60).toFixed(1)} XOXOs each, following the hints`;
});

test('kisses and hugs taken in turn make an XOXO; two of a kind together, or a pair across the letters, start the run again; and an undo takes each back', () => {
  const g = new Game(XO, { seed: 3, ...OPTIONS });
  const results = [1, 2, 3, 4].map(() => g.match(...g.suggest()));
  check(results.slice(0, 3).every((r) => !r.xoxoMade) && results[3].xoxoMade && g.xoxos === 1 && g.run === '', 'four kisses and hugs in turn, following the hints, not an XOXO');
  check([...'XO'].includes(results[0].kiss) && results.every((r, k) => k === 0 || r.kiss !== results[k - 1].kiss), 'the hints not taking kisses and hugs in turn');
  equal(row(g)[1], `1 × ${POINTS.xoxo}`, 'an XOXO, told');
  g.undo();
  check(g.xoxos === 0 && g.run.length === 3, 'an undo did not take the XOXO back');

  // Two of a kind together after a run of three start it again from the
  // second; and a pair across the letters, with nothing.
  const twice = g.pairs().find((pair) => of(g, pair) === g.run.at(-1));
  check(twice, 'no pair of the same letter again to take');
  const r = g.match(...twice);
  check(r.runBroke && !r.xoxoMade && g.run === r.kiss, 'two of a kind together did not start the run again');
  g.undo();
  const across = g.pairs().find((pair) => of(g, pair) === null);
  if (across) {
    const s = g.match(...across);
    check(s.runBroke && s.kiss === null && g.run === '', 'a pair across the letters did not start the run again with nothing');
    g.undo();
  }
  check(g.run.length === 3, 'an undo did not put the run back');

  const plain = new Game(XO, { seed: 3, treats: false });
  check(plain.xoxo === null && plain.xoLetter(0) === null && plain.wantsLetter === null && !row(plain), 'a board without kisses and hugs has them');
});

test("a shuffle deals again taking kisses and hugs in turn, and an undo puts it back; after pairs of a player's own, the hints still carry the run on; a board reached the same way makes the same XOXOs", () => {
  const g = new Game(XO, { seed: 9, ...OPTIONS });
  for (let m = 0; m < 6; m++) g.match(...g.suggest());
  const [faces, run] = [JSON.stringify(g.faces), g.run];
  check(g.shuffle(), 'no shuffle');
  check(g.run === run && of(g, g.line[0]) === g.wantsLetter, "after a shuffle, the run changed, or the hints' way doesn't carry it on");
  g.undo();
  equal(JSON.stringify(g.faces), faces, 'the tiles, after an undo of the shuffle');

  // Six pairs of a player's own, at random, and then the hints.
  let made = 0;
  let boards = 0;
  for (let seed = 1; seed <= 30; seed++) {
    const h = new Game(XO, { seed, ...OPTIONS });
    const r = seeded(seed * 7919 + 13);
    for (let m = 0; m < 6; m++) h.match(...r.pick(h.pairs()));
    if (!h.wayAhead()) continue; // the board itself lost
    boards++;
    while (h.left) h.match(...h.suggest());
    made += h.xoxos;
  }
  check(made / boards >= 10, `after six pairs of a player's own, the hints made only ${made} XOXOs on ${boards} boards`);

  for (const seed of [1, 2, 3, 4]) {
    const play = () => {
      const k = new Game(XO, { seed, ...OPTIONS });
      const r = seeded(seed * 13);
      const seen = [];
      k.on('xoxo', (e) => seen.push(`${k.matches}:${e.xoxoMade}/${e.kiss}`));
      while (k.left && k.pairs().length) {
        if (k.matches === 10) k.hint();
        if (k.matches === 20) k.shuffle();
        k.match(...r.pick(k.pairs()));
      }
      return seen.join(' ');
    };
    equal(play(), play(), `seed ${seed}: the XOXOs, played the same way twice`);
  }
  return `after six pairs of a player's own, the hints made ${(made / boards).toFixed(1)} XOXOs a board on ${boards} boards still to be won`;
});
