// The holidays and seasons of the year, each a theme of the game: its name,
// its icon, when it falls, and the colour it brings (the night sky behind
// its boards, and an accent). A player picks the ones they want. Two are
// ready to play: Halloween's Long Night, and Thanksgiving week; the others
// are here so that they can be picked, and their boards come next.

// When each falls, worked out for any year, as some move: a fixed day, or
// the nth weekday of a month, counting -1 for the last.
const fixed = (month, day) => (year) => new Date(year, month - 1, day);
const nth = (n, weekday, month) => (year) => {
  if (n < 0) {
    const last = new Date(year, month, 0);
    return new Date(year, month - 1, last.getDate() - ((last.getDay() - weekday + 7) % 7));
  }
  const first = new Date(year, month - 1, 1);
  return new Date(year, month - 1, 1 + ((weekday - first.getDay() + 7) % 7) + (n - 1) * 7);
};
const MONDAY = 1;
const THURSDAY = 4;

// A theme's `on` is its day, or a season's first day, with `until` its last.
// The starts of spring and fall are the days the equinoxes fall on most
// years, the 20th of March and the 22nd of September.
export const THEMES = [
  { id: 'new-year', name: "New Year's", icon: '🎉', on: fixed(1, 1), accent: '#f2c14e', sky: ['#243266', '#080b1f'] },
  { id: 'valentines', name: "Valentine's Day", icon: '💘', on: fixed(2, 14), accent: '#ff6b9a', sky: ['#5c2042', '#1c0913'] },
  { id: 'spring', name: 'Start of Spring', icon: '🌷', on: fixed(3, 20), accent: '#8ad66d', sky: ['#2f6650', '#0e221b'] },
  { id: 'summer', name: 'Summer Beach Season', icon: '🏖️', on: nth(-1, MONDAY, 5), until: nth(1, MONDAY, 9), accent: '#ffc857', sky: ['#1c6a9e', '#082338'] },
  { id: 'independence', name: 'Independence Day', icon: '🎆', on: fixed(7, 4), accent: '#ff5a5f', sky: ['#1d2f6e', '#060a21'] },
  { id: 'labor', name: 'Labor Day', icon: '🛠️', on: nth(1, MONDAY, 9), accent: '#f2a03d', sky: ['#3f4a6e', '#11141f'] },
  { id: 'fall', name: 'Start of Fall', icon: '🍂', on: fixed(9, 22), accent: '#e8833a', sky: ['#69381f', '#1d0f08'] },
  { id: 'halloween', name: 'Halloween', icon: '🎃', on: fixed(10, 31), accent: '#ff9f1c', sky: ['#2a1d40', '#0e0a17'], ready: true },
  { id: 'thanksgiving', name: 'Thanksgiving', icon: '🦃', on: nth(4, THURSDAY, 11), accent: '#de9445', sky: ['#5a381c', '#1b1008'], ready: true },
  { id: 'christmas', name: 'Christmas', icon: '🎄', on: fixed(12, 25), accent: '#ef4f5f', sky: ['#163f2e', '#06140e'] },
];

export const theme = (id) => THEMES.find((t) => t.id === id);

// When a theme next comes round from `today`: its start and end, this year's
// if it has not yet ended, and whether it is on now.
export function when(t, today = new Date()) {
  const day = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  for (const year of [day.getFullYear(), day.getFullYear() + 1]) {
    const start = t.on(year);
    const end = t.until ? t.until(year) : start;
    if (end >= day) return { start, end, now: start <= day };
  }
}

// The themes in the order they come round from `today`: any that is on now
// first, then the next to come.
export function calendar(today = new Date()) {
  return THEMES.map((t) => ({ theme: t, ...when(t, today) })).sort((a, b) => (a.now ? today : a.start) - (b.now ? today : b.start));
}
