import { test, check, equal } from './run.js';
import { ROBIN, SNOWMAN } from '../js/engine/layouts.js';
import { MATCH } from '../js/engine/tiles.js';
import { Game } from '../js/engine/game.js';
import { NOTES, kindsLeft, songOf, firstSong, hear, songsIn, compose } from '../js/engine/song.js';
import { seeded } from '../js/engine/rng.js';
import { POINTS, scoreOf } from '../js/score.js';
import { dayOptions } from '../js/thanksgiving.js';
import { SPRING, springOf, robinPart } from '../js/spring.js';

const THIRD = SPRING[2];
const OPTIONS = dayOptions(THIRD);
const row = (g) => scoreOf(g, 0).rows.find((r) => r[0] === 'Songs sung back');
const at = (L, z, y) => [...L.x.keys()].filter((i) => L.z[i] === z && L.y[i] === y).map((i) => L.x[i]).join();
const all = (L) => new Uint8Array(L.count).fill(1);

test('the robin sings three kinds of those with a pair left, chosen from the seed, and is quiet with fewer than three', () => {
  const kinds = [1, 1, 2, 2, 3, 3, 4, 4, 5];
  equal(kindsLeft(Uint8Array.from(kinds, () => 1), (t) => kinds[t]).join(), '1,2,3,4', 'the kinds with a pair left, the 5 alone');
  equal(kindsLeft(Uint8Array.of(1, 1, 1, 0, 1, 1, 0, 0, 1), (t) => kinds[t]).join(), '1,3', 'the kinds with a pair left, some taken');
  const song = songOf(7, 0, [1, 2, 3, 4]);
  equal(song.length, NOTES, 'notes in a song');
  equal(new Set(song).size, NOTES, 'a kind sung twice in a song');
  check(song.every((k) => [1, 2, 3, 4].includes(k)), 'a song of a kind with no pair left');
  equal(songOf(7, 0, [1, 2, 3, 4]).join(), song.join(), 'the song, not the same for the same board');
  const songs = new Set(Array.from({ length: 12 }, (_, k) => songOf(7, k, [1, 2, 3, 4, 5, 6]).join()));
  check(songs.size > 4, `only ${songs.size} songs in twelve`);
  equal(songOf(7, 0, [1, 2]), null, 'a song with fewer than three kinds left');
  equal(JSON.stringify(firstSong(7, [1, 2])), JSON.stringify({ song: null, at: 0, songs: 0, sung: 0 }), 'the robin with fewer than three kinds');
});

test("a pair of her next note sings it back, and her three in her order sing her song, for a new one; other kinds don't break it, but hers out of turn do", () => {
  const left = [1, 2, 3, 4, 5, 6];
  const robin = { song: [1, 2, 3], at: 0, songs: 1, sung: 0 };
  let h = hear(robin, 1, left, 9);
  check(h.note && !h.sung && !h.broke && !h.fresh && h.robin.at === 1, 'her first note not sung back');
  h = hear(h.robin, 5, left, 9);
  check(!h.note && !h.broke && h.robin.at === 1, 'another kind in between breaking the song');
  h = hear(h.robin, 2, left, 9);
  check(h.note && h.robin.at === 2, 'her second note not sung back');
  h = hear(h.robin, 3, left, 9);
  check(h.note && h.sung && h.fresh, 'her last note not singing the song back');
  equal(`${h.robin.sung} ${h.robin.songs} ${h.robin.at}`, '1 2 0', 'songs sung back, sung, and notes of the new one');
  equal(h.robin.song.join(), songOf(9, 1, left).join(), 'the new song');

  h = hear({ song: [1, 2, 3], at: 2, songs: 1, sung: 0 }, 2, left, 9);
  check(h.broke && !h.note && h.robin.at === 0 && h.robin.song.join() === '1,2,3', 'a note out of turn not breaking the song begun');
  h = hear({ song: [1, 2, 3], at: 2, songs: 1, sung: 0 }, 1, left, 9);
  check(h.broke && h.note && h.robin.at === 1, 'her first kind out of turn not starting the song again');
  h = hear({ song: [1, 2, 3], at: 0, songs: 1, sung: 0 }, 3, left, 9);
  check(!h.broke && !h.note && !h.fresh && h.robin.at === 0, 'a song not begun broken');

  h = hear({ song: [1, 2, 3], at: 1, songs: 1, sung: 0 }, 5, [1, 3, 4, 5, 6], 9);
  check(h.fresh && !h.sung && h.robin.at === 0 && h.robin.sung === 0 && h.robin.songs === 2, 'a song that cannot be sung back not given up');
  h = hear({ song: [1, 2, 3], at: 2, songs: 1, sung: 0 }, 5, [3, 4, 5], 9);
  check(!h.fresh && h.robin.at === 2, 'a song given up with her last kind still to sing');
  h = hear({ song: [1, 2, 3], at: 2, songs: 4, sung: 1 }, 3, [1, 2], 9);
  check(h.sung && h.robin.song === null && h.robin.songs === 4 && h.robin.sung === 2, 'the robin not sung out, with two kinds left');
  h = hear(h.robin, 1, [2], 9);
  check(!h.note && !h.fresh && h.robin.song === null, 'the robin singing once sung out');
});

test("a deal's faces put on its own order sing back every song she sings, the same pairs of faces moved, and the order still wins", () => {
  for (let seed = 1; seed <= 12; seed++) {
    const g = new Game(ROBIN, { seed, ...OPTIONS });
    const kindOf = (t) => MATCH[g.faces[t]];
    const { sung, robin } = songsIn(g.plan, all(ROBIN), kindOf, seed);
    check(sung >= 8, `seed ${seed}: the deal's order sings back only ${sung} songs`);
    equal(sung, robin.songs, `seed ${seed}: songs sung back of those she sang, in the deal's own order`);
    check(robin.song === null, `seed ${seed}: the robin not sung out by the end`);
    const k = new Game(ROBIN, { seed, ...OPTIONS });
    check(g.plan.every(([a, b]) => k.match(a, b)) && k.won, `seed ${seed}: the deal's own order not winning`);
    equal(k.robin.sung, sung, `seed ${seed}: songs sung back, played`);
  }
  // compose on its own: the faces of pairs moved, not changed.
  const order = [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9], [10, 11], [12, 13], [14, 15]];
  const faces = Int16Array.from([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 0, 0]);
  const start = firstSong(5, kindsLeft(all({ count: 16 }), (t) => faces[t]));
  const out = compose(order, faces, (f) => f, start, 5, seeded(11));
  equal([...out].sort((x, y) => x - y).join(), [...faces].sort((x, y) => x - y).join(), 'the faces, not the same faces');
  check(order.every(([a, b]) => out[a] === out[b]), 'a pair of the order not a pair');
  const heard = songsIn(order, all({ count: 16 }), (t) => out[t], 5);
  check(heard.sung >= 1 && heard.sung === heard.robin.songs, `the order sang back ${heard.sung} of ${heard.robin.songs} songs`);
});

test('the robin hears each pair: a song sung back scores, a shuffle deals so that the way ahead still sings, and an undo takes it back', () => {
  const g = new Game(ROBIN, { seed: 3, ...OPTIONS });
  check(g.robin && g.robin.song && g.robin.song.length === NOTES, 'no song as the board starts');
  equal(`${g.robin.songs} ${g.robin.sung} ${g.robin.at}`, '1 0 0', 'the robin as the board starts');
  check(g.robin.song.every((k) => g.kindsLeft().includes(k)), 'a song of a kind with no pair on the board');
  const heard = [];
  g.on('song', (e) => heard.push(`${e.songNote ? 'n' : ''}${e.songSung ? 's' : ''}${e.songBroke ? 'b' : ''}${e.newSong ? 'f' : ''}`));
  const first = g.robin.song.slice();
  while (g.robin.sung === 0) check(g.match(...g.plan[g.matches]), 'the deal\'s own order cannot be taken');
  check(heard.at(-1).includes('s') && heard.at(-1).includes('f'), `the song sung back not heard: ${heard.join(' ')}`);
  equal(`${row(g)[1]} ${row(g)[2]}`, `1 of 2 ${POINTS.song}`, 'songs sung back, and what they score');
  check(g.robin.song.join() !== first.join() || g.robin.songs === 2, 'no new song');
  g.undo();
  equal(`${g.robin.sung} ${g.robin.songs} ${g.robin.at} ${g.robin.song.join()}`, `0 1 ${NOTES - 1} ${first.join()}`, 'an undo, the robin as she was');
  check(g.isNextNote(g.plan[g.matches][0]) && g.noteOf(g.plan[g.matches][0]) === NOTES - 1, 'her next note not on the next pair of the way');
  // A shuffle deals the board again so that its way sings her next note
  // first, rested or not, and the song carries on.
  check(g.shuffle(), 'no shuffle');
  equal(`${g.robin.at} ${g.robin.song.join()}`, `${NOTES - 1} ${first.join()}`, 'the song, after a shuffle');
  const way = g.wayAhead();
  check(way && songsIn(way, g.present, (t) => MATCH[g.faces[t]], 3, g.robin).sung >= 1, "the shuffled board's way not singing the song back");
  const plain = new Game(SNOWMAN, { seed: 3 });
  check(plain.robin === null && plain.nextNote === -1 && !row(plain) && !plain.match(...plain.plan[0]).songNote, 'a board without the robin singing');
});

test('the third chapter is the first robin: a robin singing on a fence post, 100 tiles on four layers, nine across, her song floating up from her open beak', () => {
  equal(THIRD.name, 'The third chapter', "the third chapter's name");
  equal(THIRD.title, 'The first robin', "the third chapter's title");
  equal(springOf(ROBIN), THIRD, "the robin's chapter");
  equal(ROBIN.count, 100, 'tiles');
  equal(ROBIN.width / 2, 9, 'tiles across');
  equal(ROBIN.height / 2, 10.5, 'tiles down');
  equal(ROBIN.depth, 4, 'layers');
  check(ROBIN.count > SNOWMAN.count, 'no more tiles than the snowman');
  equal(JSON.stringify(OPTIONS), JSON.stringify({ treats: false, ghostsFloat: false, song: true }), 'the robin singing');
  equal(at(ROBIN, 0, 0), '0,5,7', 'a note of her song, and the crown of her head');
  equal(at(ROBIN, 0, 1), '2', 'her beak, open');
  equal(at(ROBIN, 2, 2), '5,7', 'her eye, raised on her head');
  equal(at(ROBIN, 0, 14), '0,2,4,6,8,10,12,14,16', 'the top rail, the post in it under her feet');
  equal(at(ROBIN, 0, 19), '0,2,4,6,8,10,12,14,16', 'the grass along the foot');
  const parts = {};
  for (let i = 0; i < ROBIN.count; i++) {
    const p = robinPart(ROBIN, i);
    parts[p] = (parts[p] || 0) + 1;
  }
  const names = ['notes', 'beak', 'head', 'eye', 'breast', 'belly', 'back', 'wing', 'tail', 'post', 'rails', 'grass'];
  equal(names.map((p) => `${p} ${parts[p]}`).join(', '), 'notes 2, beak 2, head 11, eye 1, breast 18, belly 3, back 17, wing 3, tail 5, post 5, rails 24, grass 9', 'her parts, for her look');
  equal(THIRD.look, robinPart, 'the robin not tinted as her parts are');
  check(['sings a song of three kinds', 'shown at the top', 'in her order', '30 points', 'out of turn', 'breaks the song'].every((w) => THIRD.text.includes(w)), "the card doesn't tell the robin's song");
});

test("the first robin's deals can be cleared following the hints, singing her songs back as they go; a player taking pairs at random sings fewer", () => {
  let hinted = 0;
  let sang = 0;
  let random = 0;
  for (let seed = 1; seed <= 24; seed++) {
    const g = new Game(ROBIN, { seed, ...OPTIONS });
    while (g.left) {
      const pair = g.suggest();
      check(pair, `seed ${seed}: no hint with ${g.left} tiles left`);
      if (!pair) break;
      check(g.match(...pair), `seed ${seed}: the hint can't be taken`);
    }
    check(g.won, `seed ${seed}: following the hints, not cleared`);
    hinted += g.robin.sung;
    sang += g.robin.songs;
    const p = new Game(ROBIN, { seed, ...OPTIONS });
    const r = seeded(seed * 41);
    while (p.left && p.pairs().length) p.match(...r.pick(p.pairs()));
    random += p.robin.sung;
  }
  check(hinted >= 24 * 8, `following the hints sang back only ${hinted} songs`);
  check(hinted > random * 2, `following the hints sang back ${hinted}, not much more than pairs at random, ${random}`);
  return `24 deals: following the hints sang back ${(hinted / 24).toFixed(1)} songs a board of ${(sang / 24).toFixed(1)}; pairs at random ${(random / 24).toFixed(1)}`;
});

test('a board played the same way hears the same songs, however its hints are asked for', () => {
  for (const seed of [1, 2, 3]) {
    const play = (hints) => {
      const k = new Game(ROBIN, { seed, ...OPTIONS });
      const rr = seeded(seed * 13);
      const seen = [];
      k.on('song', (e) => seen.push(`${k.matches}:${e.songSung ? 's' : ''}${e.songBroke ? 'b' : ''}:${k.robin.song ? k.robin.song.join('+') : '-'}`));
      while (k.left && k.pairs().length) {
        if (hints && k.matches % 3 === 0) k.hint();
        k.match(...rr.pick(k.pairs()));
      }
      return seen.join(' ');
    };
    equal(play(true), play(false), `seed ${seed}: the songs, played the same way with hints and without`);
  }
});
