import { MATCH } from './tiles.js';
import { freedAt } from './milk.js';

// Sparklers, on New Year's 5: a few tiles are sparklers, unlit while they
// are held down. Each is lit as its tile comes free, and burns down over so
// many matches: taken while it still burns, it scores the more the more of
// it is left, and burnt out, it's a tile like any other. So a sparkler is
// best lit with a tile of its kind already free to take it with. Sparklers
// change nothing about when a tile can be taken. Game keeps the sparklers,
// and score.js what they earn.

// The sparklers for a board, given the deal's own order: tiles held down
// at the start, each of a kind of its own, that the order takes within
// `burns` matches of their coming free, so that taking the pairs in that
// order takes every sparkler while it still burns. One from each stretch of
// the order, from a tenth of the way through, so that they are lit one
// after another; a stretch with none gives one from elsewhere. Chosen at
// random.
export function chooseSparklers(L, faces, present, n, r, plan, burns) {
  const at = freedAt(L, present, plan);
  const possible = [];
  plan.forEach(([a, b], k) => {
    for (const t of [a, b]) if (at[t] > 0 && k + 1 - at[t] <= burns) possible.push([t, k]);
  });
  const from = Math.floor(plan.length / 10);
  const out = [];
  const kinds = new Set();
  const take = ([t]) => {
    out.push(t);
    kinds.add(MATCH[faces[t]]);
  };
  const open = ([t]) => !kinds.has(MATCH[faces[t]]);
  for (let s = 0; s < n; s++) {
    const start = from + Math.floor(((plan.length - from) * s) / n);
    const end = from + Math.floor(((plan.length - from) * (s + 1)) / n);
    const stretch = possible.filter(([t, k]) => k >= start && k < end && open([t]));
    if (stretch.length) take(r.pick(stretch));
  }
  for (const p of r.shuffle(possible.slice())) if (out.length < n && open(p)) take(p);
  return out;
}
