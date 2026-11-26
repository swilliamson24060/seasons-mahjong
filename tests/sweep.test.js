import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { WINDOW, SHAMROCK } from '../js/engine/layouts.js';
import { FACE, MATCH } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { rowsOf, nextRow, emptied, sweptIn } from '../js/engine/sweep.js';
import { seeded } from '../js/engine/rng.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SPRING, springOf, windowPart } from '../js/spring.js';

const SIXTH = SPRING[5];
const OPTIONS = dayOptions(SIXTH);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Rows swept clean');
const facesOf = (...keys) => keys.map((key) => FACE[key]);
const at = (L, z, y) => [...L.x.keys()].filter((i) => L.z[i] === z && L.y[i] === y).map((i) => L.x[i]).join();

// Two rows of three, tiles 0, 1 and 2 across the top and 3, 4 and 5 across
// the bottom, and 6 and 7 on top of their middles: the top row 0, 1, 2 and
// 6, the bottom 3, 4, 5 and 7. The ends a pair a row, the middles a pair,
// and the two on top a pair.
const BLOCK = parseLayout('block', ['###\n###', '.#.\n.#.']);
const FACES = facesOf('eyes-2', 'eyes-1', 'eyes-2', 'eyes-3', 'eyes-1', 'eyes-3', 'eyes-4', 'eyes-4');

test("a board's rows are its tiles at each height, on every layer, from the top down; a row emptied is swept in turn once every row above it is empty, and out of turn before", () => {
  const { rows, rowOf } = rowsOf(BLOCK);
  equal(rows.map((r) => r.join()).join(' | '), '0,1,2,6 | 3,4,5,7', 'the rows');
  equal([...rowOf].join(), '0,0,0,1,1,1,0,1', "each tile's row");
  const all = new Uint8Array(BLOCK.count).fill(1);
  equal(nextRow(rows, all), 0, 'the row to sweep as the board starts');
  const topGone = Uint8Array.from([0, 0, 0, 1, 1, 1, 0, 1]);
  equal(nextRow(rows, topGone), 1, 'the row to sweep, the top row gone');
  equal(nextRow(rows, new Uint8Array(BLOCK.count)), -1, 'the row to sweep with nothing left');
  equal(JSON.stringify(emptied(rows, rowOf, topGone, 0, 2)), JSON.stringify({ swept: [0], out: [] }), 'the top row emptied');
  const bottomGone = Uint8Array.from([1, 0, 1, 0, 0, 0, 0, 0]);
  equal(JSON.stringify(emptied(rows, rowOf, bottomGone, 1, 4)), JSON.stringify({ swept: [], out: [1] }), 'the bottom row emptied with the top row still there');
  equal(JSON.stringify(emptied(rows, rowOf, new Uint8Array(BLOCK.count), 1, 4)), JSON.stringify({ swept: [0, 1], out: [] }), 'both rows emptied at once, the top one first');
  equal(sweptIn(rows, rowOf, [[6, 7], [0, 2], [3, 5], [1, 4]], all), 2, 'rows an order sweeps in turn');
  equal(sweptIn(rows, rowOf, [[6, 7], [3, 5], [1, 4], [0, 2]], all), 1, 'rows an order sweeps in turn, the bottom row first');
});

test('a row swept clean in turn scores by its tiles, one cleared out of turn nothing; the row to sweep is marked, and an undo takes a sweep back', () => {
  const g = new Game(BLOCK, { faces: FACES, sweep: true });
  equal(`${g.rowToSweep} ${g.rowLeft(0)} ${g.rowsSweptClean}`, '0 4 0', 'the sweeping as the board starts');
  check(g.inRowToSweep(6) && g.inRowToSweep(0) && !g.inRowToSweep(3), 'the top row not marked to sweep');
  const heard = [];
  g.on('sweep', (e) => heard.push(`${e.swept.join('+')}/${e.sweptOut.join('+')}`));
  g.match(6, 7);
  g.match(0, 2);
  g.match(3, 5);
  const r = g.match(1, 4);
  equal(`${r.swept.join()} ${r.sweptOut.join()}`, '0,1 ', 'both rows swept by the last pair');
  equal(`${g.rowsSweptClean} ${g.sweptTiles} ${row(g)[1]} ${row(g)[2]}`, `2 8 2 of 2 ${8 * POINTS.sweep}`, 'the rows swept, and what they score');
  equal(heard.join(' '), '0+1/', 'the sweeping heard');
  g.undo();
  equal(`${g.rowsSweptClean} ${g.rowToSweep}`, '0 0', 'an undo, the sweep not taken back');

  // Each row's pairs its own: the bottom row cleared first, out of turn.
  const k = new Game(BLOCK, { faces: facesOf('eyes-1', 'eyes-1', 'eyes-2', 'eyes-3', 'eyes-3', 'eyes-4', 'eyes-2', 'eyes-4'), sweep: true });
  k.match(5, 7);
  const m = k.match(3, 4);
  equal(`${m.swept.join()}|${m.sweptOut.join()}`, '|1', 'the bottom row, cleared before the top, out of turn');
  k.match(6, 2);
  check(k.match(0, 1).swept.join() === '0', 'the top row, swept after, not swept in turn');
  equal(`${k.rowsSweptClean} ${k.sweptTiles}`, '1 4', 'the rows swept in turn, and their tiles');
  const plain = new Game(BLOCK, { faces: FACES });
  check(plain.rowToSweep === -1 && !plain.inRowToSweep(0) && !plain.match(0, 2).swept.length && !row(plain), 'a board without the sweeping sweeping');
});

test('the sixth chapter is spring cleaning: a window thrown open, 124 tiles on three layers, nine across, every tile on a whole row', () => {
  equal(SIXTH.name, 'The sixth chapter', "the sixth chapter's name");
  equal(SIXTH.title, 'Spring cleaning', "the sixth chapter's title");
  equal(springOf(WINDOW), SIXTH, "the window's chapter");
  equal(WINDOW.count, 124, 'tiles');
  equal(WINDOW.width / 2, 9, 'tiles across');
  equal(WINDOW.height / 2, 10, 'tiles down');
  equal(WINDOW.depth, 3, 'layers');
  check(WINDOW.count > SHAMROCK.count, 'no more tiles than the shamrock');
  check([...WINDOW.y].every((y) => y % 2 === 0), 'a tile on half a row');
  equal(rowsOf(WINDOW).rows.length, 10, 'rows');
  equal(JSON.stringify(OPTIONS), JSON.stringify({ treats: false, ghostsFloat: false, sweep: true }), 'the sweeping');
  equal(at(WINDOW, 0, 0), '0,2,4,6,8,10,12,14,16', 'the curtain rod across the top');
  equal(at(WINDOW, 2, 2), '4,12', "the frame's top corners, raised");
  const parts = {};
  for (let i = 0; i < WINDOW.count; i++) {
    const p = windowPart(WINDOW, i);
    parts[p] = (parts[p] || 0) + 1;
  }
  equal(['rod', 'frame', 'pane', 'curtain', 'sill', 'box', 'flowers'].map((p) => `${p} ${parts[p]}`).join(', '), 'rod 9, frame 38, pane 12, curtain 48, sill 13, box 3, flowers 1', 'its parts, for its look');
  equal(SIXTH.look, windowPart, 'the window not tinted as its parts are');
  check(['from the top down', 'every tile of a row', `${POINTS.sweep} points a tile`, 'every row above it', 'scores nothing', 'marked'].every((w) => SIXTH.text.includes(w)), "the card doesn't tell the sweeping");
});

test("the window's deals sweep every row from the top down in their own order, without a row's ends matching more than by chance, and can be cleared following the hints, sweeping as they go; a player taking pairs at random sweeps fewer", () => {
  const { rows, rowOf } = rowsOf(WINDOW);
  const all = new Uint8Array(WINDOW.count).fill(1);
  let planned = 0;
  let mirrored = 0;
  let hinted = 0;
  let random = 0;
  for (let seed = 1; seed <= 24; seed++) {
    const g = new Game(WINDOW, { seed, ...OPTIONS });
    if (sweptIn(rows, rowOf, g.plan, all) === rows.length) planned++;
    for (const tiles of rows) {
      const ends = tiles.filter((t) => WINDOW.z[t] === 0).sort((a, b) => WINDOW.x[a] - WINDOW.x[b]);
      if (ends.length > 2 && MATCH[g.faces[ends[0]]] === MATCH[g.faces[ends.at(-1)]]) mirrored++;
    }
    while (g.left) {
      const pair = g.suggest();
      check(pair, `seed ${seed}: no hint with ${g.left} tiles left`);
      if (!pair) break;
      check(g.match(...pair), `seed ${seed}: the hint can't be taken`);
    }
    check(g.won, `seed ${seed}: following the hints, not cleared`);
    hinted += g.rowsSweptClean;
    const p = new Game(WINDOW, { seed, ...OPTIONS });
    const r = seeded(seed * 41);
    while (p.left && p.pairs().length) p.match(...r.pick(p.pairs()));
    random += p.rowsSweptClean;
  }
  check(planned >= 20, `only ${planned} of 24 deals sweep every row from the top down in their own order`);
  check(mirrored <= 24, `rows whose two ends match, ${mirrored} in 24 deals: the deal pairing a row's ends`);
  check(hinted > random, `following the hints swept ${hinted} rows, no more than pairs at random, ${random}`);
  return `24 deals: ${planned} sweep every row in their own order; following the hints swept ${(hinted / 24).toFixed(1)} rows a board of ${rows.length}; pairs at random ${(random / 24).toFixed(1)}`;
});
