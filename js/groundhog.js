import { GROUNDHOG } from './engine/layouts.js';

// Groundhog Day: the day that comes round again and again, open all year,
// every year. It has one board a day, the same deal for everyone that day,
// made from the date: played as often as you like, the same tiles in the
// same places every time, until it goes just right, and a new one comes
// the next day. Clear it under par and the groundhog sees no shadow, an
// early spring; otherwise he sees it, and it's six more weeks of winter.
// Its board is as Thanksgiving's days are (thanksgiving.js says what each
// part is for), a groundhog peeking out of his burrow, with no twist but
// the day itself. Until Groundhog Day's own tiles are drawn, it wears
// Halloween's.

export const GROUNDHOG_DAY = {
  name: 'Groundhog Day',
  title: 'The same day, again',
  layout: GROUNDHOG,
  rules: { treats: false, ghostsFloat: false },
  sky: ['#34546b', '#0d1820'],
  text: "It's Groundhog Day, again: one board a day, the same deal for everyone. Play it as often as you like, the same tiles in the same places every time, until you get it just right; tomorrow brings a new one. Clear it under par, and the groundhog sees no shadow: an early spring.",
};

// The board of Groundhog Day a layout is, if it is: played freely, by its
// address (#play/groundhog), it plays by its rules.
export const groundhogOf = (layout) => (layout === GROUNDHOG ? GROUNDHOG_DAY : undefined);

// A day's key, its date as 2027-02-02, by the clock where it is played.
export const dayKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

// The day before the one a key gives, as a key.
export function dayBefore(key) {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d - 1, 12));
}

// The seed a day's board is dealt from, the same for everyone, made from
// the day's key alone (FNV-1a), under a billion as the game's seeds are.
export function daySeed(key) {
  let h = 0x811c9dc5;
  for (const ch of key) h = Math.imul(h ^ ch.charCodeAt(0), 0x01000193) >>> 0;
  return h % 1e9;
}

// The days in a row, back from today, whose board was cleared: from today
// once it is, and until then from yesterday, so that a streak holds until
// the day is out. days keeps each day's results by its key.
export function streakOf(days, today) {
  let key = days[today] && days[today].clears ? today : dayBefore(today);
  let n = 0;
  while (days[key] && days[key].clears) {
    n++;
    key = dayBefore(key);
  }
  return n;
}

// The week up to and including today, a key a day, oldest first.
export function weekTo(today) {
  const out = [today];
  while (out.length < 7) out.unshift(dayBefore(out[0]));
  return out;
}
