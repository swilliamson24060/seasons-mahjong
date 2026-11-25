import { seeded } from './rng.js';

// The robin's song, on the Start of Spring's third board, the first robin:
// the robin sings a song of three kinds of tile, and a pair of each, taken
// in the order she sang them, sings it back to her, for points; then she
// sings another. A pair of any other kind in between doesn't break the
// song, but a pair of one of her kinds out of turn does, once it's begun:
// she starts it again from the top, that pair its first note if it's of the
// first kind. A song that can't be sung back any more, a kind still to sing
// with no pair of it left, she gives up for a new one; and with fewer than
// three kinds left with a pair to take, she's sung herself out.
//
// Which kinds she sings is chosen for each song from the board's seed,
// among the kinds still on the board with a pair to take, so that a board
// played the same way hears the same songs, however its hints were asked
// for. The deal is made so that its own order sings every song back as it
// comes (compose), and the hints sing her next note whenever they can. The
// song changes nothing about when a tile can be taken. Game keeps the
// robin, and score.js what the songs sung back earn.

export const NOTES = 3;

// The kinds with a pair still to take, two tiles of them or more on the
// board, in order; kindOf gives a tile's kind.
export function kindsLeft(present, kindOf) {
  const count = new Map();
  for (let t = 0; t < present.length; t++) {
    if (!present[t]) continue;
    const k = kindOf(t);
    count.set(k, (count.get(k) || 0) + 1);
  }
  return [...count].filter(([, n]) => n >= 2).map(([k]) => k).sort((a, b) => a - b);
}

// Song k, counted from 0 for the one she sings as the board starts: three
// of the kinds left, in the order she sings them, by a shuffle of its own;
// or null with fewer than three left.
export function songOf(seed, k, left) {
  if (left.length < NOTES) return null;
  return seeded((seed ^ 0x4f1bbcdc) + k * 0x9e3779b1).shuffle(left.slice()).slice(0, NOTES);
}

// The robin as the board starts, `left` the kinds with a pair to take: {
// song, at, songs, sung }, the song she's singing, or null once she's sung
// out; the notes of it sung back so far; the songs she has sung, this one
// with them; and those sung back to her.
export function firstSong(seed, left) {
  const song = songOf(seed, 0, left);
  return { song, at: 0, songs: song ? 1 : 0, sung: 0 };
}

// What she hears in a pair of a kind, `left` the kinds with a pair to take
// after it: { robin, note, sung, broke, fresh }, the robin after it; whether
// it sang a note of her song back, her next or, starting it again, her
// first; whether it was her last, singing the whole song back; whether it
// broke a song begun, out of turn; and whether she sang a new song after it,
// the old one sung back or given up.
export function hear(robin, kind, left, seed) {
  let { song, at, songs, sung } = robin;
  if (!song) return { robin, note: false, sung: false, broke: false, fresh: false };
  let note = false;
  let done = false;
  let broke = false;
  if (kind === song[at]) {
    at++;
    note = true;
    if (at === NOTES) {
      done = true;
      sung++;
    }
  } else if (song.includes(kind)) {
    broke = at > 0;
    at = kind === song[0] ? 1 : 0;
    note = at === 1;
  }
  const fresh = done || !song.slice(at).every((k) => left.includes(k));
  if (fresh) {
    song = songOf(seed, songs, left);
    if (song) songs++;
    at = 0;
  }
  return { robin: { song, at, songs, sung }, note, sung: done, broke, fresh };
}

// The songs an order of pairs sings back, taken from the start, and the
// robin after it; kindOf gives a tile's kind, present the tiles on the
// board before it.
export function songsIn(order, present, kindOf, seed, robin = null) {
  const board = Uint8Array.from(present);
  let now = robin || firstSong(seed, kindsLeft(board, kindOf));
  const from = now.sung;
  for (const [a, b] of order) {
    board[a] = board[b] = 0;
    now = hear(now, kindOf(a), kindsLeft(board, kindOf), seed).robin;
  }
  return { sung: now.sung - from, robin: now };
}

// A deal's faces put on its own order so that, taken in that order, it
// sings back every song the robin sings, a note a pair, with a rest of up
// to `rest` pairs of other kinds before each song, chosen from r: whole
// pairs of faces moved from one place in the order to another, so that the
// order still wins. faceKind gives a face's kind, and robin is the robin as
// the order starts. Returns the faces.
export function compose(order, faces, faceKind, robin, seed, r, rest = 2) {
  const out = Int16Array.from(faces);
  const pool = order.map(([a, b]) => [faces[a], faces[b]]);
  const kindsOfPool = () => [...new Set(pool.map(([f]) => faceKind(f)))].sort((x, y) => x - y);
  let now = robin;
  let resting = r.int(rest + 1);
  for (const [a, b] of order) {
    // Her next note, or while she rests, a pair of another kind, if there's
    // one left; the song always has a pair of each kind still to sing.
    const next = now.song ? now.song[now.at] : -1;
    const notes = pool.map((p, k) => (faceKind(p[0]) === next ? k : -1)).filter((k) => k >= 0);
    const others = pool.map((p, k) => (!now.song || !now.song.includes(faceKind(p[0])) ? k : -1)).filter((k) => k >= 0);
    const k = (resting || !notes.length) && others.length ? r.pick(others) : notes.length ? r.pick(notes) : r.int(pool.length);
    const [f, g] = pool.splice(k, 1)[0];
    out[a] = f;
    out[b] = g;
    const heard = hear(now, faceKind(f), kindsOfPool(), seed);
    now = heard.robin;
    if (resting) resting--;
    if (heard.fresh) resting = r.int(rest + 1);
  }
  return out;
}
