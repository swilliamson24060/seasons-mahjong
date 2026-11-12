// The score for a board, worked out from what the game already records, so
// it holds through undo and reloads. Each pair taken is worth points, and a
// cleared board more, with a bonus for every second under par. Shuffles and
// hints cost points. When the tiles turn over, a board that wakes no lost
// souls earns a bonus, and each lost soul costs a little. On a board with a
// shopping list, each thing crossed off it earns points, and the whole list
// more; on a board with doorbusters, each one bought does, though the pairs
// another shopper grabs are not the player's; and on a football board, a
// touchdown earns more. Treats are free, and so is undo, though a pair taken
// back takes its points with it.

export const POINTS = {
  pair: 10,
  clear: 250,
  second: 2, // for each second under par
  shuffle: -100,
  hint: -25,
  clean: 150, // turning over without one lost soul
  soul: -10, // each lost soul that wakes
  listed: 25, // each thing crossed off the shopping list
  list: 100, // the whole list, before checkout
  buster: 50, // each doorbuster bought
  touchdown: 60, // each pair taken from the two end zones: six, as in football, times ten
};

// The tiles a board has: on a board with a fridge, the table's, its
// containers aside.
const tilesOf = (game) => game.tableCount ?? game.layout.count;

// Par: five seconds a tile, or six on a board that turns over, as that wants planning.
export const par = (game) => tilesOf(game) * (game.sides.length > 1 ? 6 : 5);

// The words a board's turning over is told in, for its rows: Halloween's,
// unless a board says otherwise (main.js has the Sunday Scaries').
const TURN = { night: 'Midnight', day: 'Sunrise', souls: 'Lost souls', none: 'no lost souls' };

// The score so far, as { total, rows }, each row [what, how, points]. The
// clearing and the speed bonus come in once the board is clear.
export function scoreOf(game, seconds, words = TURN) {
  const times = (n, each) => `${n} × ${Math.abs(each)}`;
  const pairs = game.matches; // the player's own: none another shopper grabbed
  const rows = [['Pairs', times(pairs, POINTS.pair), pairs * POINTS.pair]];
  const turn = game.history.find((e) => e.souls);
  if (turn) {
    const n = turn.souls.length;
    const when = game.sideNames[1] === 'night' ? words.night : words.day;
    rows.push(n ? [words.souls, times(n, POINTS.soul), n * POINTS.soul] : [`${when} with ${words.none}`, '', POINTS.clean]);
  }
  if (game.list) {
    const n = game.crossed.length;
    const all = n > 0 && n === game.list.kinds.length;
    rows.push(['Shopping list', `${n} of ${game.list.kinds.length}${all ? ', the lot' : ''}`, n * POINTS.listed + (all ? POINTS.list : 0)]);
  }
  if (game.busters) {
    const mine = game.busters.filter((d) => d.state === 'mine').length;
    const gone = game.busters.filter((d) => d.state === 'gone').length;
    rows.push(['Doorbusters', `${mine} of ${game.busters.length}${gone ? `, ${gone} grabbed` : ''}`, mine * POINTS.buster]);
  }
  if (game.zones) rows.push(['Touchdowns', times(game.touchdowns, POINTS.touchdown), game.touchdowns * POINTS.touchdown]);
  if (game.shuffles) rows.push(['Shuffles', times(game.shuffles, POINTS.shuffle), game.shuffles * POINTS.shuffle]);
  if (game.hints) rows.push(['Hints', times(game.hints, POINTS.hint), game.hints * POINTS.hint]);
  if (game.won) {
    const under = Math.max(0, Math.floor(par(game) - seconds));
    rows.push(['Board cleared', '', POINTS.clear]);
    rows.push(['Speed', under ? `${under} s under par` : 'not under par', under * POINTS.second]);
  }
  return { total: rows.reduce((sum, row) => sum + row[2], 0), rows };
}
