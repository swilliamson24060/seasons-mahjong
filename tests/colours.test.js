import { test, check, equal } from './run.js';
import { parseLayout } from '../js/engine/layout.js';
import { RAINBOW, BOOTS } from '../js/engine/layouts.js';
import { FACE } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { BANDS, bandOf, litBand, inColour, chasing, coloursIn } from '../js/engine/colours.js';
import { seeded } from '../js/engine/rng.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SHOWERS, showerOf } from '../js/showers.js';

const FOURTH = SHOWERS[3];
const OPTIONS = dayOptions(FOURTH);
const CLOUDS = OPTIONS.colours.clouds;
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Colours caught');
const facesOf = (...keys) => keys.map((key) => FACE[key]);

// A little rainbow: two bands, a pair of tiles on the table, the inner
// band, and a pair on them, the outer; and below them a cloud of two.
// Tiles 0 and 1 are the inner band, 2 and 3 the cloud, 4 and 5 the outer.
const ARCH = parseLayout('arch', ['#.#\n...\n#.#', '#.#']);

test("the rainbow's bands are its layers, red on top, and the clouds no band; one band is lit at a time, red as the board starts and on a band with every match; a pair from the band lit catches its colour, and an undo takes it back", () => {
  equal(BANDS.join(), 'red,orange,yellow,green,blue,violet', 'the bands, from the outside in');
  equal([0, 1, 2, 3, 4, 5].map((i) => bandOf(ARCH, i, 4)).join(), '1,1,-1,-1,0,0', "the tiles' bands, an outer band on an inner one, and a cloud below");
  equal([0, 1, 5, 6, 7, 12].map(litBand).join(), '0,1,5,0,1,0', 'the band lit after so many matches');
  check(inColour(ARCH, 4, 5, 4, 0) && !inColour(ARCH, 4, 5, 4, 1) && !inColour(ARCH, 2, 3, 4, 0), 'a pair catching a colour, both its tiles in the band lit');

  // The outer band's pair, then the cloud's, then the inner band's.
  const g = new Game(ARCH, { faces: facesOf('eyes-2', 'eyes-2', 'eyes-3', 'eyes-3', 'eyes-1', 'eyes-1'), colours: { clouds: 4 } });
  const heard = [];
  g.on('colour', (e) => heard.push(`${g.matches}:${e.colour}`));
  equal(`${g.bandLit} ${g.bandNext}`, '0 1', 'the bands lit now and next, at the start');
  check(g.colourOf(4) === 0 && g.colourOf(2) === -1, "a tile's band");
  equal(g.match(4, 5).colour, 0, 'the red pair, taken while red is lit');
  equal(`${g.bandLit} ${g.bandNext}`, '1 2', 'the bands lit now and next, a match on');
  equal(g.match(2, 3).colour, -1, "the cloud's pair, caught a colour");
  equal(g.match(0, 1).colour, -1, 'the orange pair, taken while yellow is lit, caught a colour');
  check(g.won && g.coloursCaught === 1, 'colours caught');
  equal(heard.join(), '1:0', 'colours caught, heard');
  equal(row(g)[1], `1 × ${POINTS.colour}`, 'the colours caught, told');
  equal(row(g)[2], POINTS.colour, 'what a colour caught scores');
  g.undo();
  g.undo();
  g.undo();
  check(g.coloursCaught === 0 && g.bandLit === 0, 'an undo did not take back a colour caught');

  const plain = new Game(ARCH, { faces: facesOf('eyes-2', 'eyes-2', 'eyes-3', 'eyes-3', 'eyes-1', 'eyes-1') });
  check(plain.colourClouds === null && plain.colourOf(4) === -1 && plain.bandLit === -1 && plain.match(4, 5).colour === -1 && !row(plain), 'a board without a rainbow catches colours');
});

test('a deal chasing colours tries first two free tiles of the band lit, if two are free', () => {
  const all = new Uint8Array(ARCH.count).fill(1);
  equal(chasing(ARCH, 4)([2, 4, 3, 5], all, []).join(), '4,5,2,3', 'the free tiles to try, red lit');
  equal(chasing(ARCH, 4)([2, 4, 3, 5], all, [[2, 3]]).join(), '2,4,3,5', 'the free tiles to try, orange lit, none of it free');
  equal(coloursIn(ARCH, [[4, 5], [2, 3], [0, 1]], 4), 1, 'the colours an order catches');
  equal(coloursIn(ARCH, [[2, 3], [0, 1], [4, 5]], 4), 1, 'the colours another order catches');
});

test('the fourth chapter is the rainbow, arching between two clouds: 104 tiles on six layers, nine across, each band a layer, red on top, half a tile outside the band under it', () => {
  equal(FOURTH.name, 'The fourth chapter', "the fourth chapter's name");
  equal(FOURTH.title, 'The rainbow', "the fourth chapter's title");
  equal(showerOf(RAINBOW), FOURTH, "the rainbow's chapter");
  equal(RAINBOW.count, 104, 'tiles');
  equal(RAINBOW.width / 2, 9, 'tiles across');
  equal(RAINBOW.depth, 6, 'layers');
  check(RAINBOW.count > BOOTS.count, 'no more tiles than the rain boots');
  const tiles = [...RAINBOW.x.keys()];
  const of = (band) => tiles.filter((i) => bandOf(RAINBOW, i, CLOUDS) === band);
  equal(BANDS.map((_, band) => of(band).length).join(), '15,15,13,13,11,11', "the bands' tiles, from red to violet");
  equal(of(-1).length, 26, "the clouds' tiles");
  check(of(-1).every((i) => RAINBOW.z[i] <= 2), 'a cloud more than three high');
  check(of(-1).filter((i) => RAINBOW.x[i] < 8).length === 13 && of(-1).filter((i) => RAINBOW.x[i] > 8).length === 13, 'a cloud at each foot');
  // Each band rests on the one inside it, and lies outside it: its tiles'
  // middles further from the middle of the arch's feet.
  const middle = (i) => Math.hypot(RAINBOW.x[i] + 1 - 9, (RAINBOW.y[i] + 1 - 16) * 0.55);
  const reach = BANDS.map((_, band) => of(band).reduce((s, i) => s + middle(i), 0) / of(band).length);
  for (let band = 1; band < BANDS.length; band++) check(reach[band] < reach[band - 1], `the ${BANDS[band]} band not inside the ${BANDS[band - 1]}`);
  for (const i of tiles) if (RAINBOW.z[i] > 0 && bandOf(RAINBOW, i, CLOUDS) >= 0) check(RAINBOW.below[i].some((j) => bandOf(RAINBOW, j, CLOUDS) === bandOf(RAINBOW, i, CLOUDS) + 1), `a ${BANDS[bandOf(RAINBOW, i, CLOUDS)]} tile not resting on the band inside it`);
  // As the board starts, red is lit, and every red tile is free.
  const g = new Game(RAINBOW, { seed: 1, ...OPTIONS });
  check(of(0).every((i) => g.isFree(i)), 'a red tile not free at the start');
});

test("the rainbow's deals can be won in their own order, which catches fourteen colours or more; following the hints catches as many, and a player taking pairs at random few", () => {
  let own = 0;
  let hinted = 0;
  let random = 0;
  let least = Infinity;
  for (let seed = 1; seed <= 60; seed++) {
    const g = new Game(RAINBOW, { seed, ...OPTIONS });
    const n = coloursIn(RAINBOW, g.plan, CLOUDS);
    check(n >= 14, `seed ${seed}: the deal's own order catches only ${n} colours`);
    own += n;
    while (g.left) g.match(...g.suggest());
    check(g.won, `seed ${seed}: following the hints, not cleared`);
    check(g.coloursCaught >= n, `seed ${seed}: following the hints caught ${g.coloursCaught}, the deal's own order ${n}`);
    hinted += g.coloursCaught;
    least = Math.min(least, g.coloursCaught);
    equal(row(g)[2], g.coloursCaught * POINTS.colour, `seed ${seed}: what the colours caught score`);
    const p = new Game(RAINBOW, { seed, ...OPTIONS });
    const r = seeded(seed * 29);
    while (p.left && p.pairs().length) p.match(...r.pick(p.pairs()));
    random += p.coloursCaught;
  }
  check(random < hinted / 3, `taking pairs at random caught ${random} colours, following the hints ${hinted}`);
  return `60 deals: their own orders catch ${(own / 60).toFixed(1)} colours, following the hints ${(hinted / 60).toFixed(1)}, never fewer than ${least}, and pairs at random ${(random / 60).toFixed(1)}`;
});

test('a shuffle leaves the band lit as it was; a board played the same way catches the same colours', () => {
  const g = new Game(RAINBOW, { seed: 9, ...OPTIONS });
  for (let m = 0; m < 9; m++) g.match(...g.suggest());
  const [lit, caught, faces] = [g.bandLit, g.coloursCaught, JSON.stringify(Array.from(g.faces))];
  check(g.shuffle(), 'no shuffle');
  check(g.bandLit === lit && g.coloursCaught === caught, 'a shuffle changed the band lit, or the colours caught');
  g.undo();
  equal(JSON.stringify(Array.from(g.faces)), faces, 'the tiles, after an undo of the shuffle');
  g.shuffle();
  while (g.left) g.match(...g.suggest());
  check(g.won, 'following the hints after a shuffle, not cleared');

  for (const seed of [1, 2, 3, 4]) {
    const play = () => {
      const k = new Game(RAINBOW, { seed, ...OPTIONS });
      const r = seeded(seed * 13);
      const seen = [];
      k.on('colour', (e) => seen.push(`${k.matches}:${e.colour}`));
      while (k.left && k.pairs().length) {
        if (k.matches === 10) k.hint();
        if (k.matches === 20) k.shuffle();
        k.match(...r.pick(k.pairs()));
      }
      return seen.join(' ');
    };
    equal(play(), play(), `seed ${seed}: the colours caught, played the same way twice`);
  }
});
