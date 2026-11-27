import { isFree } from './layout.js';
import { freedAt } from './milk.js';

// Sunburn, on the beach season's beach ball: once a tile is free, it's out
// in the sun, and left there for so many matches, burn, it gets sunburnt,
// going red, a little pinker with every match until it does. A pair taken
// while neither of its tiles is burnt is a cool pair, for points; a burnt
// tile can still be taken, but only ever in a pair that's just a pair. The
// deal keeps cool in its own order (keepingCool, below), so that there are
// cool pairs to be had all through the board, and the hints keep to a way
// that takes them before they burn. Game keeps when each tile came into the
// sun; score.js what cool pairs earn.

// The matches a tile has left in the sun before it burns: burn as it comes
// into the sun, 0 or less once it's burnt, and Infinity while it's still in
// the shade. sunAt holds the match after which each tile came into the sun,
// or -1.
export const sunLeft = (sunAt, t, matches, burn) => (sunAt[t] < 0 ? Infinity : sunAt[t] + burn - matches);

// Whether a pair of tiles is cool, neither of them burnt.
export const isCool = (sunAt, a, b, matches, burn) => sunLeft(sunAt, a, matches, burn) > 0 && sunLeft(sunAt, b, matches, burn) > 0;

// How the deal keeps cool in its own order (deal.js's prefer): the tiles
// still cool before those burnt, and of them the ones that came into the
// sun last, so that the order takes the tiles as they come free, and lets
// the ones it can't get to in time burn, rather than burning more trying.
// Played through from tiles in the sun already, as a shuffle deals them
// again, sunAt and matches give when they came into it.
export function keepingCool(L, burn, sunAt = null, matches = 0) {
  let start = null;
  return (free, present, order) => {
    if (!order.length) start = Uint8Array.from(present);
    const came = freedAt(L, start, order);
    const at = (t) => (sunAt && sunAt[t] >= 0 ? sunAt[t] - matches : came[t]);
    const left = (t) => at(t) + burn - order.length;
    const cool = free.filter((t) => left(t) > 0).sort((s, t) => at(t) - at(s));
    return [...cool, ...free.filter((t) => left(t) <= 0)];
  };
}

// The cool pairs a way takes, played through from the tiles present, with
// sunAt as it is after so many matches: so that the hints can keep to the
// coolest way. Only the tiles under and beside a pair taken can come free
// with it.
export function coolIn(L, present, sunAt, matches, burn, way) {
  const p = Uint8Array.from(present);
  const at = Int16Array.from(sunAt);
  let n = 0;
  way.forEach(([a, b], k) => {
    if (isCool(at, a, b, matches + k, burn)) n++;
    p[a] = p[b] = 0;
    for (const t of [a, b]) {
      for (const near of [L.below[t], L.opens[t]]) {
        for (const u of near) if (p[u] && at[u] < 0 && isFree(L, p, u)) at[u] = matches + k + 1;
      }
    }
  });
  return n;
}
