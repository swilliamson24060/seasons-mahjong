// XOXO, on Valentine's seventh board, hugs and kisses: an X over an O. A
// pair from the X, both its tiles in it, is a kiss; from the O, a hug.
// Kisses and hugs taken in turn, four in a row, kiss, hug, kiss, hug or the
// other way round, make an XOXO, for a bonus, and the run starts again. Two
// kisses or two hugs together start it again, from the second; a pair with
// a tile in each letter starts it again with nothing.
//
// Dealt as any board is, half its pairs would have a tile in each letter;
// so it's dealt a letter at a time, its own order taking kisses and hugs in
// turn (byTurns), so that the hints make XOXOs. The letters change nothing
// about when a tile can be taken. Game keeps the run and the XOXOs, and
// score.js what they earn.

// The letter a tile is in: the X, above `split` half tiles down, or the O.
export const letterOf = (L, i, split) => (L.y[i] < split ? 'X' : 'O');

// What a pair is: 'X', a kiss, both its tiles in the X; 'O', a hug; or
// null, a tile in each letter.
export function pairLetter(L, a, b, split) {
  const x = letterOf(L, a, split);
  return x === letterOf(L, b, split) ? x : null;
}

// The run after a pair, from the run's letters before it and the pair's:
// { run, xoxo }, xoxo true when the pair made one, the run starting again.
export function runOn(run, letter) {
  if (!letter) return { run: '', xoxo: false };
  if (run.at(-1) === letter) return { run: letter, xoxo: false };
  const next = run + letter;
  return next.length === 4 ? { run: '', xoxo: true } : { run: next, xoxo: false };
}

// How many XOXOs an order of pairs makes, from a run before it.
export function xoxosIn(L, order, split, run = '') {
  let made = 0;
  for (const [a, b] of order) {
    const step = runOn(run, pairLetter(L, a, b, split));
    run = step.run;
    if (step.xoxo) made++;
  }
  return made;
}

// A deal that takes kisses and hugs in turn: as it plays the board through
// (deal.js), it tries first the free tiles of the letter whose turn it is,
// the other's than the last pair's, and the other letter's after; or the
// other's first, when the letter whose turn it is hasn't two free tiles to
// pair. `last` is the letter of the pair before the deal, for a shuffle.
export const byTurns = (L, split, last = 'O') => (free, present, order) => {
  const before = order.length ? pairLetter(L, ...order.at(-1), split) : last;
  const want = before === 'X' ? 'O' : 'X';
  const mine = free.filter((t) => letterOf(L, t, split) === want);
  const other = free.filter((t) => letterOf(L, t, split) !== want);
  return mine.length >= 2 ? [...mine, ...other] : [...other, ...mine];
};
