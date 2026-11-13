// The holidays and seasons of the year, each a theme of the game: its name,
// its icon, when it falls, and the colour it brings (the night sky behind
// its boards, and an accent), and when its boards open. A player picks the
// ones they want. Two are ready to play: Halloween's Long Night, and
// Thanksgiving week; the others are here so that they can be picked, and
// their boards come next.

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
// years, the 20th of March and the 22nd of September. Its `opens` is the day
// its boards open, weeks before, to build up to it: they stay open to the
// end of the year, and with the new year every holiday closes again, until
// its opening day comes round. New Year's opens in December, for the year
// to come. Groundhog Day, the day that comes round again and again, has no
// opening day: it is open `always`, all year, every year.
export const THEMES = [
  { id: 'new-year', name: "New Year's", icon: '🎉', on: fixed(1, 1), opens: fixed(12, 1), accent: '#f2c14e', sky: ['#243266', '#080b1f'] },
  { id: 'groundhog', name: 'Groundhog Day', icon: '🦫', on: fixed(2, 2), always: true, accent: '#8ccff5', sky: ['#34546b', '#0d1820'] },
  { id: 'valentines', name: "Valentine's Day", icon: '💘', on: fixed(2, 14), opens: fixed(2, 1), accent: '#ff6b9a', sky: ['#5c2042', '#1c0913'] },
  { id: 'spring', name: 'Start of Spring', icon: '🌷', on: fixed(3, 20), opens: fixed(3, 1), accent: '#8ad66d', sky: ['#2f6650', '#0e221b'] },
  { id: 'summer', name: 'Summer Beach Season', icon: '🏖️', on: nth(-1, MONDAY, 5), until: nth(1, MONDAY, 9), opens: fixed(5, 1), accent: '#ffc857', sky: ['#1c6a9e', '#082338'] },
  { id: 'independence', name: 'Independence Day', icon: '🎆', on: fixed(7, 4), opens: fixed(6, 1), accent: '#ff5a5f', sky: ['#1d2f6e', '#060a21'] },
  { id: 'labor', name: 'Labor Day', icon: '🛠️', on: nth(1, MONDAY, 9), opens: fixed(8, 1), accent: '#f2a03d', sky: ['#3f4a6e', '#11141f'] },
  { id: 'fall', name: 'Start of Fall', icon: '🍂', on: fixed(9, 22), opens: fixed(8, 1), accent: '#e8833a', sky: ['#69381f', '#1d0f08'] },
  { id: 'halloween', name: 'Halloween', icon: '🎃', on: fixed(10, 31), opens: fixed(10, 1), accent: '#ff9f1c', sky: ['#2a1d40', '#0e0a17'], ready: true },
  { id: 'thanksgiving', name: 'Thanksgiving', icon: '🦃', on: nth(4, THURSDAY, 11), opens: fixed(11, 1), accent: '#de9445', sky: ['#5a381c', '#1b1008'], ready: true },
  { id: 'christmas', name: 'Christmas', icon: '🎄', on: fixed(12, 25), opens: fixed(12, 1), accent: '#ef4f5f', sky: ['#163f2e', '#06140e'] },
];

export const theme = (id) => THEMES.find((t) => t.id === id);

// Today: or, to try the game on another day, the day the address names,
// as ?date=2027-03-01 does.
export function today(search = location.search) {
  const named = new URLSearchParams(search).get('date') || '';
  const day = /^\d{4}-\d{2}-\d{2}$/.test(named) ? new Date(`${named}T12:00`) : null;
  return day && !Number.isNaN(day.getTime()) ? day : new Date();
}

// Whether a holiday's boards can be played on `date`: they are made, and
// they have opened this year, or are always open.
export const isOpen = (t, date = today()) => Boolean(t.ready) && (Boolean(t.always) || date >= t.opens(date.getFullYear()));

// The day a holiday's boards next open: this year's, or next year's once
// this year's has come; for one always open, today.
export function opensOn(t, date = today()) {
  if (t.always) return date;
  const opens = t.opens(date.getFullYear());
  return date < opens ? opens : t.opens(date.getFullYear() + 1);
}

// When a theme next comes round from `date`: its start and end, this year's
// if it has not yet ended, and whether it is on now.
export function when(t, date = today()) {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  for (const year of [day.getFullYear(), day.getFullYear() + 1]) {
    const start = t.on(year);
    const end = t.until ? t.until(year) : start;
    if (end >= day) return { start, end, now: start <= day };
  }
}

// The themes in the order they come round from `date`: any that is on now
// first, then the next to come.
export function calendar(date = today()) {
  return THEMES.map((t) => ({ theme: t, ...when(t, date) })).sort((a, b) => (a.now ? date : a.start) - (b.now ? date : b.start));
}
