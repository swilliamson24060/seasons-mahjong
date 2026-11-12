import { test, check, equal } from './run.js';
import { parseLayout, isFree } from '../js/engine/layout.js';
import { TURKEY } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { outsideIn } from '../js/engine/ice.js';
import { Game } from '../js/engine/game.js';
import { DAYS, dayOf, dayOptions } from '../js/thanksgiving.js';

const MONDAY = DAYS.find((d) => d.name === 'Monday');
const facesOf = (...keys) => keys.map((key) => FACE[key]);

// Plays a line of pairs, checking that no pair is taken while frozen.
function playThrough(g, line, what) {
  for (const [a, b] of line) {
    check(!g.frozen(a) && !g.frozen(b), `${what}: a pair taken while frozen, ${g.matches} matches in`);
    check(g.match(a, b), `${what}: a pair from the line cannot be taken, ${g.matches} matches in`);
  }
  check(g.won, `${what}: not cleared`);
}

test('a frozen tile cannot be taken until enough matches thaw it, and undo freezes it again', () => {
  const L = parseLayout('ice', ['##.##']);
  const g = new Game(L, { faces: facesOf('eyes-1', 'eyes-1', 'eyes-2', 'eyes-2'), ice: [0, 0, 1, 1] });
  let thawed = null;
  g.on('thaw', (m) => (thawed = m.thawed));
  check(g.open(2) && g.frozen(2) && !g.isFree(2), 'open, but frozen');
  equal(g.thawIn(2), 1, 'matches to thaw');
  equal(g.match(2, 3), null, 'a frozen pair');
  check(g.match(0, 1), 'a pair with no ice');
  equal(thawed && thawed.join(), '2,3', 'the tiles that match thawed');
  check(!g.frozen(2) && g.isFree(2), 'thawed');
  g.undo();
  check(g.frozen(2) && g.frozen(3), 'frozen again after an undo');
  check(g.match(0, 1) && g.match(2, 3) && g.won, 'cleared through the thaw');
});

test('a skeleton key cannot thaw ice', () => {
  const L = parseLayout('ice', ['##.##']);
  const g = new Game(L, { faces: facesOf('eyes-1', 'eyes-1', 'eyes-2', 'eyes-2'), ice: [0, 0, 1, 1] });
  g.treats.key = 1;
  equal(g.useKey(2), false, 'a key on ice');
  equal(g.treats.key, 1, 'the key is kept');
});

test('the frozen turkey thaws from the outside in: its outline from the start, then a ring at a time', () => {
  const ice = outsideIn(TURKEY, 8);
  const tally = {};
  for (const t of ice) tally[t] = (tally[t] || 0) + 1;
  equal(JSON.stringify(tally), '{"0":42,"8":40,"16":8}', 'tiles thawing after so many matches');
  for (let i = 0; i < TURKEY.count; i++) {
    if (TURKEY.y[i] >= 12) equal(ice[i], 0, 'the drumsticks are thawed');
    if (TURKEY.z[i] === 3 && TURKEY.x[i] === 8) equal(ice[i], 16, 'the top of the breast thaws last');
  }
});

test('Thanksgiving week has seven days, Sunday to Saturday, and Monday is the frozen turkey', () => {
  equal(DAYS.map((d) => d.name).join(' '), 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday', 'the days');
  equal(DAYS[0].title, 'Traffic', "Sunday's theme");
  equal(dayOf(TURKEY), MONDAY, "the turkey's day");
  equal(MONDAY.title, 'Thawing the turkey', "Monday's theme");
  check(dayOptions(MONDAY).ice && !dayOptions(MONDAY).treats && !dayOptions(MONDAY).ghostsFloat, "Monday's rules: ice, and no treats or ghosts");
  equal(TURKEY.count, 90, 'tiles');
  equal(TURKEY.width / 2, 9, 'tiles across');
});

test("Monday's deals can be won through the thaw, in the order they were dealt", () => {
  const options = dayOptions(MONDAY);
  let frozenAtStart = 0;
  for (let seed = 1; seed <= 300; seed++) {
    const g = new Game(TURKEY, { seed, ...options });
    for (let i = 0; i < TURKEY.count; i++) if (g.frozen(i) && isFree(TURKEY, g.present, i)) frozenAtStart++;
    playThrough(g, g.plan, `seed ${seed}`);
  }
  return `300 deals; ${(frozenAtStart / 300).toFixed(1)} tiles that would be free are frozen at the start`;
});

test('after a move of your own, the hints find a way through the thaw', () => {
  const options = dayOptions(MONDAY);
  let tried = 0;
  for (let seed = 1; seed <= 12; seed++) {
    const g = new Game(TURKEY, { seed, ...options });
    const own = g.pairs()[seed % g.pairs().length];
    g.match(...own);
    g.suggest();
    if (g.outlook !== 'win') continue; // that move happened to lose the board
    tried++;
    while (!g.won) {
      const pair = g.hint();
      check(pair && !g.frozen(pair[0]) && !g.frozen(pair[1]) && g.match(...pair), `seed ${seed}: the hint with ${g.left} tiles left`);
    }
  }
  check(tried >= 10, `only ${tried} of 12 boards stayed winnable`);
  return `${tried} of 12 boards`;
});

test('a shuffle on a frozen board keeps the ice, and deals the tiles so the board can still be won', () => {
  const options = dayOptions(MONDAY);
  for (let seed = 1; seed <= 40; seed++) {
    const g = new Game(TURKEY, { seed, ...options });
    for (let n = 0; n < seed % 14; n++) g.match(...g.suggest());
    const ice = Array.from(g.ice).join();
    check(g.shuffle(), `seed ${seed}: no shuffle`);
    equal(Array.from(g.ice).join(), ice, `seed ${seed}: the ice`);
    playThrough(g, g.line.slice(), `seed ${seed}, shuffled`);
  }
});
