import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { UMBRELLA, CLOUD } from '../js/engine/layouts.js';
import { Game } from '../js/engine/game.js';
import { ribsOf, topOf, landing, openRibs, stepOf, rainOn, catching, caughtIn } from '../js/engine/raindrops.js';
import { seeded } from '../js/engine/rng.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SHOWERS, showerOf } from '../js/showers.js';

const SECOND = SHOWERS[1];
const OPTIONS = dayOptions(SECOND);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Raindrops');
const all = (L) => new Uint8Array(L.count).fill(1);

// A row of eight, with two tiles over its middle: 0 to 7 along the row, 8
// over 3 and 9 over 4. A rib runs out from the middle each way.
const ROW = parseLayout('row', ['########', '...##...']);
const RIBS = ribsOf(ROW, [
  [[3, 0], [2, 0], [1, 0]],
  [[4, 0], [5, 0], [6, 0]],
]);

// The tiles of the umbrella's bottom layer in a row, given in half tiles,
// by where each starts across.
const across = (L, y, z = 0) => [...L.x.keys()].filter((i) => L.z[i] === z && L.y[i] === y).map((i) => L.x[i]);

test("a raindrop is on the tile at the top of its place: a pair with that tile catches it; drops run a place down their ribs with every match and drip off past the rim; and one lands every so many matches, on a rib that's open to it", () => {
  const present = all(ROW);
  equal(RIBS[0].map((spot) => topOf(spot, present)).join(), '8,2,1', 'the tiles at the top of the first rib');
  present[8] = 0;
  equal(topOf(RIBS[0][0], present), 3, 'the tile under one taken');
  present[3] = 0;
  equal(topOf(RIBS[0][0], present), -1, 'a place with its tiles all taken');

  const start = all(ROW);
  const one = [{ rib: 0, at: 0, state: 'running' }];
  const caught = rainOn(RIBS, 2, 1, one, start, 0, [8, 9]);
  check(caught.caught.length === 1 && caught.caught[0].tile === 8 && caught.drops[0].state === 'caught' && caught.drops[0].caughtOn === 1, 'the drop, on a tile taken, not caught');
  check(one[0].state === 'running' && start[8] === 1, 'the drops or the board given, changed');
  const missed = rainOn(RIBS, 2, 1, one, start, 0, [0, 7]);
  check(!missed.caught.length && missed.drops[0].state === 'running' && stepOf(RIBS, missed.drops[0], 1) === 1, 'a drop not on the pair, not running on');
  const late = rainOn(RIBS, 2, 1, [{ rib: 1, at: 0, state: 'running' }], start, 2, [0, 7]);
  check(late.dripped.length === 1 && late.drops[0].state === 'dripped', 'a drop at the rim, not dripping off');
  // every two matches, another lands, never on the rib the last took while
  // the other is open
  const landed = rainOn(RIBS, 2, 1, one, start, 1, [0, 7]);
  check(landed.landed && landed.drops.length === 2 && landed.landed.at === 2 && landed.landed.rib === 1, 'no drop landed, or on the same rib');
  check(!rainOn(RIBS, 2, 1, one, start, 0, [0, 7]).landed, 'a drop landed between times');

  for (let k = 0; k < 20; k++) equal(landing(RIBS, all(ROW), 7, k, 0), 1, 'a drop landing on the rib the last took');
  const bare = all(ROW);
  for (const t of [9, 4, 5, 6]) bare[t] = 0;
  equal(openRibs(RIBS, bare).join(), '0', 'the ribs open to a drop, the second bare');
  equal(landing(RIBS, bare, 7, 3, 0), 0, 'with one rib open, a drop not landing on it');
  const few = Uint8Array.from([1, 1, 1, 0, 0, 0, 0, 0, 1, 0]); // two pairs left, for ribs of three places
  equal(openRibs(RIBS, few).length, 0, 'ribs open with too few matches left to run down them');
  equal(landing(RIBS, few, 7, 3), -1, 'a drop landing with too few matches left');
});

test("a deal catching the rain takes the tile a drop is on first, and last the tiles still in its way", () => {
  const present = all(ROW);
  present[0] = 0; // so that tile 1, in the first rib's way, is free
  const free = [1, 7, 8, 9];
  equal(catching(RIBS, 2, 1, 0, [{ rib: 0, at: 0, state: 'running' }])(free, present, []).join(), '8,7,9,1', 'the free tiles in the order to try them');
  equal(catching(RIBS, 2, 1, 0, [{ rib: 0, at: 0, state: 'caught' }])(free, present, []).join(), free.join(), 'with no drop running');
});

test("the second chapter is umbrella weather, an open umbrella: 92 tiles on four layers, nine across, its canopy peaked at the top, its rim scalloped in five points, its handle hooked at the foot, and the drops' five ribs fanning out from the peak to the points", () => {
  equal(SECOND.name, 'The second chapter', "the second chapter's name");
  equal(SECOND.title, 'Umbrella weather', "the second chapter's title");
  equal(showerOf(UMBRELLA), SECOND, "the umbrella's chapter");
  equal(UMBRELLA.count, 92, 'tiles');
  equal(UMBRELLA.width / 2, 9, 'tiles across');
  equal(UMBRELLA.height / 2, 10, 'tiles down');
  equal(UMBRELLA.depth, 4, 'layers');
  check(UMBRELLA.count > CLOUD.count, 'no more tiles than the first shower');
  // In half tiles: a tile at x covers x to x + 2 across, its row y to y + 2.
  equal(across(UMBRELLA, 0).join(), '8', 'the peak, a single tile');
  equal(across(UMBRELLA, 8).join(), '0,2,4,6,8,10,12,14,16', 'the canopy at its widest');
  equal(across(UMBRELLA, 10).join(), '0,4,8,12,16', "the rim's five points");
  equal(across(UMBRELLA, 10, 1).join(), '0,4,12,16', 'the outer four points, two high');
  for (const y of [12, 14, 16, 18]) check(across(UMBRELLA, y, 0).includes(8) && across(UMBRELLA, y, 1).join() === '8', `the handle, two high, ${y} half tiles down`);
  equal(across(UMBRELLA, 18).join(), '4,6,8', "the hook's foot");
  equal(across(UMBRELLA, 16).join(), '4,8', "the hook's tip, beside the handle");
  equal(Math.max(...[...UMBRELLA.z.keys()].filter((i) => UMBRELLA.z[i] === 3).map((i) => UMBRELLA.x[i])) - Math.min(...[...UMBRELLA.z.keys()].filter((i) => UMBRELLA.z[i] === 3).map((i) => UMBRELLA.x[i])), 4, 'the top of the dome, three across');

  const { every, ribs } = OPTIONS.raindrops;
  equal(every, 4, 'matches between drops');
  equal(ribs.length, 5, 'ribs');
  const start = all(UMBRELLA);
  const spots = ribsOf(UMBRELLA, ribs);
  ribs.forEach((rib, r) => {
    equal(rib[0].join(), '4,0', `rib ${r}, from the peak`);
    rib.forEach(([, y], k) => equal(y, k, `rib ${r}'s place ${k}, a row down from the one before`));
    spots[r].forEach((spot, k) => check(topOf(spot, start) >= 0, `rib ${r}'s place ${k}, over no tile`));
  });
  equal(ribs.map((rib) => rib.at(-1)[0]).join(), '0,2,4,6,8', 'the ribs ending at the five points');
});

test("the umbrella's deals can be won in their own order, which catches at least ten of the eleven drops; following the hints catches as many, while a player taking pairs at random catches few", () => {
  let own = 0;
  let hinted = 0;
  let random = 0;
  for (let seed = 1; seed <= 60; seed++) {
    const g = new Game(UMBRELLA, { seed, ...OPTIONS });
    const n = caughtIn(g.rain.ribs, OPTIONS.raindrops.every, seed, g.plan, all(UMBRELLA));
    check(n >= 10, `seed ${seed}: the deal's own order catches only ${n} drops`);
    own += n;
    while (g.left) g.match(...g.suggest());
    check(g.won, `seed ${seed}: following the hints, not cleared`);
    equal(g.dropsLanded, 11, `seed ${seed}: drops landed`);
    check(g.dropsCaught >= 10, `seed ${seed}: following the hints caught only ${g.dropsCaught}`);
    hinted += g.dropsCaught;
    equal(row(g)[1], `${g.dropsCaught} of 11 caught`, `seed ${seed}: the raindrops, told`);
    equal(row(g)[2], g.dropsCaught * POINTS.raindrop, `seed ${seed}: what the raindrops score`);
    const p = new Game(UMBRELLA, { seed, ...OPTIONS });
    const r = seeded(seed * 31);
    while (p.left && p.pairs().length) p.match(...r.pick(p.pairs()));
    random += p.dropsCaught;
  }
  check(random < hinted / 2, `taking pairs at random caught ${random}, following the hints ${hinted}`);
  return `60 deals: their own orders catch ${(own / 60).toFixed(2)} of 11 drops, following the hints ${(hinted / 60).toFixed(2)}, and pairs at random ${(random / 60).toFixed(2)}`;
});

test('a drop lands on the peak as the board starts and every four matches; a pair with the tile it is on catches it; an undo takes back a catch, a drip and a landing; and a shuffle leaves the drops where they are', () => {
  const g = new Game(UMBRELLA, { seed: 5, ...OPTIONS });
  const peak = [...UMBRELLA.x.keys()].find((i) => UMBRELLA.y[i] === 0);
  equal(`${g.dropsLanded} ${g.untilRain}`, '1 4', 'drops landed, and the matches until the next, at the start');
  const [first] = g.runningDrops();
  check(first.step === 0 && first.tile === peak && g.dropOn(peak) && g.isFree(peak), 'the first drop, not on the peak');
  const ahead = g.rain.ribs[first.drop.rib].slice(1).map((spot) => topOf(spot, g.present));
  check(ahead.every((t) => g.inRainWay(t)) && !g.inRainWay(peak), "the tiles in the drop's way, not ringed");
  const heard = [];
  g.on('rain', (e) => heard.push(`${g.matches}:${e.catches.length}/${e.drips}/${e.newDrop ? 1 : 0}`));
  let catches = 0;
  let drips = 0;
  let lands = 0;
  const r = seeded(11);
  while (g.left && g.pairs().length && !(catches && drips && lands)) {
    // take pairs at random, none on a drop until one has dripped, and then one catching a drop where one can
    const wet = new Set(g.runningDrops().map((d) => d.tile));
    const catching = g.pairs().filter(([a, b]) => wet.has(a) || wet.has(b));
    const dry = g.pairs().filter(([a, b]) => !wet.has(a) && !wet.has(b));
    const pairs = drips ? (catching.length ? catching : dry) : dry;
    const pair = pairs.length ? r.pick(pairs) : r.pick(g.pairs());
    const [caughtBefore, landedBefore] = [g.dropsCaught, g.dropsLanded];
    const running = JSON.stringify(g.runningDrops().map((d) => [d.drop.rib, d.step]));
    const result = g.match(...pair);
    if (result.catches.length || result.drips || result.newDrop) {
      if (result.catches.length) catches++;
      if (result.drips) drips++;
      if (result.newDrop) lands++;
      g.undo();
      check(g.dropsCaught === caughtBefore && g.dropsLanded === landedBefore, 'an undo did not take back the drops caught or landed');
      equal(JSON.stringify(g.runningDrops().map((d) => [d.drop.rib, d.step])), running, 'the drops running, after an undo');
      g.match(...pair);
    }
  }
  check(catches && drips && lands, `a catch, a drip and a landing not all seen: ${catches}, ${drips}, ${lands}`);
  check(heard.length >= 3, 'the rain not heard');

  const drops = JSON.stringify(g.raindrops);
  const faces = JSON.stringify(Array.from(g.faces));
  check(g.shuffle(), 'no shuffle');
  equal(JSON.stringify(g.raindrops), drops, 'the drops, after a shuffle');
  g.undo();
  equal(JSON.stringify(Array.from(g.faces)), faces, 'the tiles, after an undo of the shuffle');
  g.shuffle();
  while (g.left) g.match(...g.suggest());
  check(g.won, 'following the hints after a shuffle, not cleared');

  const plain = new Game(UMBRELLA, { seed: 5, treats: false });
  check(!plain.rain && !plain.raindrops && !plain.dropOn(peak) && !plain.inRainWay(peak) && plain.untilRain === Infinity && !row(plain), 'a board without rain has raindrops');
  check(!plain.match(...plain.pairs()[0]).catches.length, 'a pair on a board without rain caught a drop');
});

test('a board reached the same way sees the same rain', () => {
  for (const seed of [1, 2, 3, 4]) {
    const play = () => {
      const k = new Game(UMBRELLA, { seed, ...OPTIONS });
      const r = seeded(seed * 13);
      const seen = [JSON.stringify(k.raindrops)];
      k.on('rain', (e) => seen.push(`${k.matches}:${e.catches.join('+')}/${e.drips}/${e.newDrop ? e.newDrop.rib : '-'}`));
      while (k.left && k.pairs().length) {
        if (k.matches === 10) k.hint();
        if (k.matches === 20) k.shuffle();
        k.match(...r.pick(k.pairs()));
      }
      return seen.join(' ');
    };
    equal(play(), play(), `seed ${seed}: the rain, played the same way twice`);
  }
});
