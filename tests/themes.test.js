import { test, check, equal } from './run.js';
import { THEMES, theme, when, calendar, isOpen, opensOn, today } from '../js/themes.js';

const day = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
const ids = (list) => list.map((e) => e.theme.id).join(' ');

test('there are the ten holidays and seasons, each once, with Halloween and Thanksgiving ready to play', () => {
  equal(THEMES.length, 10, 'themes');
  equal(new Set(THEMES.map((t) => t.id)).size, 10, 'different themes');
  const names = THEMES.map((t) => t.name);
  for (const name of ['Thanksgiving', 'Christmas', "New Year's", "Valentine's Day", 'Start of Spring', 'Summer Beach Season', 'Independence Day', 'Labor Day', 'Start of Fall', 'Halloween']) {
    check(names.includes(name), `${name} is missing`);
  }
  equal(THEMES.filter((t) => t.ready).map((t) => t.id).join(), 'halloween,thanksgiving', 'the ones ready');
});

test('the holidays that move fall on their weekdays', () => {
  equal(day(theme('thanksgiving').on(2026)), '2026-11-26', 'Thanksgiving, the fourth Thursday of November');
  equal(day(theme('thanksgiving').on(2027)), '2027-11-25', 'and the next year');
  equal(day(theme('labor').on(2026)), '2026-9-7', 'Labor Day, the first Monday of September');
  equal(day(theme('summer').on(2026)), '2026-5-25', 'the beach season, from Memorial Day');
  equal(day(theme('summer').on(2027)), '2027-5-31', 'Memorial Day when the 31st is a Monday');
  equal(day(theme('summer').until(2026)), '2026-9-7', 'to Labor Day');
});

test('the calendar runs from today, with a season on now first', () => {
  const november = calendar(new Date(2026, 10, 11, 15));
  equal(ids(november), 'thanksgiving christmas new-year valentines spring summer independence labor fall halloween', 'from the 11th of November');
  equal(day(november[2].start), '2027-1-1', "next New Year's");
  const july = calendar(new Date(2026, 6, 10));
  equal(july[0].theme.id, 'summer', 'the beach in July');
  check(july[0].now, 'on now');
  equal(july.at(-1).theme.id, 'independence', 'the Fourth just gone, so last');
  const christmas = when(theme('christmas'), new Date(2026, 11, 25, 20));
  check(christmas.now && day(christmas.start) === '2026-12-25', 'Christmas, on the day itself');
});

test('each holiday opens on the first of a month, weeks before its day', () => {
  const opens = { 'new-year': 'Dec 1', valentines: 'Feb 1', spring: 'Mar 1', summer: 'May 1', independence: 'Jun 1', labor: 'Aug 1', fall: 'Aug 1', halloween: 'Oct 1', thanksgiving: 'Nov 1', christmas: 'Dec 1' };
  for (const t of THEMES) {
    const o = t.opens(2026);
    equal(o.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), opens[t.id], `${t.name} opens`);
    const itsDay = t.id === 'new-year' ? t.on(2027) : t.on(2026); // New Year's opens for the year to come
    const weeks = (itsDay - o) / (7 * 24 * 3600 * 1000);
    check(weeks >= 1.5 && weeks <= 8, `${t.name} opens ${weeks.toFixed(1)} weeks before its day`);
  }
});

test('a holiday made can be played from its opening day to the end of the year, and the new year closes it again', () => {
  const halloween = theme('halloween');
  const thanksgiving = theme('thanksgiving');
  check(!isOpen(halloween, new Date(2026, 8, 30, 20)), 'Halloween is open on the 30th of September');
  check(isOpen(halloween, new Date(2026, 9, 1, 0, 5)), 'Halloween is shut on the 1st of October');
  check(isOpen(halloween, new Date(2026, 10, 12)), 'Halloween is shut in November');
  check(isOpen(halloween, new Date(2026, 11, 31, 23, 59)), "Halloween is shut on New Year's Eve");
  check(!isOpen(halloween, new Date(2027, 0, 1, 0, 1)), "Halloween is open on New Year's Day");
  check(!isOpen(halloween, new Date(2027, 6, 4)), 'Halloween is open in July');
  check(isOpen(halloween, new Date(2027, 9, 1, 9)), 'Halloween is shut on the 1st of October the next year');
  check(!isOpen(thanksgiving, new Date(2026, 9, 31, 20)), 'Thanksgiving is open on Halloween');
  check(isOpen(thanksgiving, new Date(2026, 10, 1, 9)), 'Thanksgiving is shut on the 1st of November');
  check(isOpen(thanksgiving, new Date(2026, 10, 29, 20)), 'Thanksgiving is shut on the second Sunday');
  check(!isOpen(theme('christmas'), new Date(2026, 11, 20)), 'Christmas, whose boards are still to come, is open');
  equal(day(opensOn(halloween, new Date(2027, 2, 1))), '2027-10-1', 'in March, Halloween opens in October');
  equal(day(opensOn(halloween, new Date(2026, 10, 12))), '2027-10-1', 'once open, it next opens the year after');
  equal(day(opensOn(thanksgiving, new Date(2026, 9, 15))), '2026-11-1', 'in October, Thanksgiving opens in November');
});

test('an address can name the day to try the game on', () => {
  const named = today('?date=2027-03-01');
  equal(day(named), '2027-3-1', 'the day named');
  check(!isOpen(theme('halloween'), named), 'Halloween is open on the day named');
  for (const search of ['', '?date=soon', '?date=2027-13-45', '?set=thanksgiving']) {
    check(Math.abs(today(search) - new Date()) < 5000, `${search || 'no address'} is not today`);
  }
});
