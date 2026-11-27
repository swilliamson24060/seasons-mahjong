import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { ICECREAM } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { cherryOf, savingCherry } from '../js/engine/cherry.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SUMMER } from '../js/summer.js';

const FIFTH = SUMMER[4];
const OPTIONS = dayOptions(FIFTH);
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Cherry on top');

// A cherry on its own at the top, tile 0, over a row of three, 1, 2 and 3.
const SUNDAE = parseLayout('sundae', ['.#.\n###']);

test("the cherry is the board's top tile, holding nothing down, and a deal leaves it out until the last pair", () => {
  equal(cherryOf(SUNDAE), 0, 'the cherry on the sundae');
  equal(ICECREAM.y[cherryOf(ICECREAM)], 0, "the cherry on the ice cream, on its top row");
  equal(ICECREAM.above[cherryOf(ICECREAM)].length + ICECREAM.below[cherryOf(ICECREAM)].length, 0, 'the cherry on or under another tile');
  const save = savingCherry(0);
  equal(save([0, 1, 3], new Uint8Array(4).fill(1)).join(), '1,3', 'the cherry taken with more than one other tile left');
  equal(save([0, 2], Uint8Array.from([1, 0, 1, 0])).join(), '0,2', 'the cherry kept back from the last pair');
});

test('the cherry taken in the last pair is saved, for points; taken sooner, it is just a tile; an undo puts it back', () => {
  // The cherry and 2 a pair, and the row's ends.
  const faces = facesOf('eyes-1', 'eyes-2', 'eyes-1', 'eyes-2');
  const g = new Game(SUNDAE, { faces, cherry: true });
  equal(`${g.cherry} ${row(g)[1]} ${row(g)[2]}`, '0 still on top 0', 'the cherry as the board starts');
  const heard = [];
  g.on('cherry', (e) => heard.push(e.cherrySaved ? 'saved' : 'eaten'));
  check(g.match(1, 3), 'the row\'s ends not taken');
  const r = g.match(0, 2);
  check(r && r.cherryTaken && r.cherrySaved && g.won, 'the cherry not saved in the last pair');
  equal(`${row(g)[1]} ${row(g)[2]}`, `saved for last ${POINTS.cherry}`, 'the cherry saved, and what it scores');
  g.undo();
  equal(`${g.cherryAt} ${g.cherrySaved} ${row(g)[1]}`, '-1 false still on top', 'an undo, the cherry not back on top');
  // Sooner: the cherry first, with the row's left end.
  const h = new Game(SUNDAE, { faces: facesOf('eyes-1', 'eyes-1', 'eyes-2', 'eyes-2'), cherry: true });
  h.on('cherry', (e) => heard.push(e.cherrySaved ? 'saved' : 'eaten'));
  check(h.match(0, 1) && h.match(2, 3) && h.won, 'the board not cleared, the cherry taken first');
  equal(`${h.cherrySaved} ${row(h)[1]} ${row(h)[2]}`, 'false eaten too soon 0', 'a cherry eaten too soon scoring');
  equal(heard.join(), 'saved,eaten', 'the cherry heard');
});

test("the ice cream's deals save the cherry for the last pair in their own order, following the hints saves it, and a shuffle keeps it for last", () => {
  for (let seed = 1; seed <= 100; seed++) {
    const g = new Game(ICECREAM, { seed, ...OPTIONS });
    check(g.plan.at(-1).includes(g.cherry), `seed ${seed}: the deal's own order not ending with the cherry`);
    for (const [a, b] of g.plan) check(g.match(a, b), `seed ${seed}: a pair of the deal's own order cannot be taken`);
    check(g.won && g.cherrySaved, `seed ${seed}: the cherry not saved`);
  }
  let saved = 0;
  for (let seed = 1; seed <= 12; seed++) {
    const g = new Game(ICECREAM, { seed, ...OPTIONS });
    while (!g.won) {
      const pair = g.hint();
      check(pair && g.match(...pair), `seed ${seed}: the hint with ${g.left} tiles left`);
      if (!pair) break;
    }
    if (g.cherrySaved) saved++;
  }
  equal(saved, 12, 'boards whose cherry the hints saved, of 12');
  const g = new Game(ICECREAM, { seed: 4, ...OPTIONS });
  for (const [a, b] of g.plan.slice(0, 15)) g.match(a, b);
  check(g.shuffle(), 'the shuffle');
  check(g.line.at(-1).includes(g.cherry), "the shuffle's new deal not saving the cherry for last");
  for (const [a, b] of g.line.slice()) check(g.match(a, b), "a pair of the shuffle's new deal cannot be taken");
  check(g.won && g.cherrySaved, 'the cherry not saved after the shuffle');
});
