import { test, check, equal } from './run.js';
import { THEMES, theme, when, calendar, isOpen, opensOn, today, menuList } from '../js/themes.js';

const day = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
const ids = (list) => list.map((e) => e.theme.id).join(' ');

test("there are the twelve holidays and seasons, each once, with Halloween, Thanksgiving, Christmas, New Year's, Groundhog Day and Valentine's Day ready to play", () => {
  equal(THEMES.length, 12, 'themes');
  equal(new Set(THEMES.map((t) => t.id)).size, 12, 'different themes');
  const names = THEMES.map((t) => t.name);
  for (const name of ['Thanksgiving', 'Christmas', "New Year's", 'Groundhog Day', "Valentine's Day", 'Start of Spring', 'April Showers', 'Summer Beach Season', 'Independence Day', 'Labor Day', 'Start of Fall', 'Halloween']) {
    check(names.includes(name), `${name} is missing`);
  }
  equal(THEMES.filter((t) => t.ready).map((t) => t.id).join(), 'new-year,groundhog,valentines,halloween,thanksgiving,christmas', 'the ones ready');
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
  equal(ids(november), 'thanksgiving christmas new-year groundhog valentines spring showers summer independence labor fall halloween', 'from the 11th of November');
  equal(day(november[2].start), '2027-1-1', "next New Year's");
  const july = calendar(new Date(2026, 6, 10));
  equal(july[0].theme.id, 'summer', 'the beach in July');
  check(july[0].now, 'on now');
  equal(july.at(-1).theme.id, 'independence', 'the Fourth just gone, so last');
  const christmas = when(theme('christmas'), new Date(2026, 11, 25, 20));
  check(christmas.now && day(christmas.start) === '2026-12-25', 'Christmas, on the day itself');
});

test('April Showers is a season, April and May, between the Start of Spring and the beach season', () => {
  const showers = theme('showers');
  equal(day(showers.on(2027)), '2027-4-1', 'from the 1st of April');
  equal(day(showers.until(2027)), '2027-5-31', 'to the 31st of May');
  const april = calendar(new Date(2027, 3, 15));
  equal(april[0].theme.id, 'showers', 'in April it comes first');
  check(april[0].now, 'on now');
  check(when(showers, new Date(2027, 4, 31, 20)).now, 'still on on the 31st of May');
  const june = when(showers, new Date(2027, 5, 1));
  check(!june.now && day(june.start) === '2028-4-1', 'and in June, next April');
  equal(ids(calendar(new Date(2027, 2, 21))).split(' ').slice(0, 3).join(' '), 'showers summer independence', 'just after the Start of Spring, the showers come next');
});

test('the menu lists every holiday, those open first, then the rest, each saying when it opens, or soon', () => {
  const ids = (list) => list.map((e) => e.theme.id).join(' ');
  const november = menuList(new Date(2026, 10, 18, 12));
  equal(november.length, THEMES.length, 'the holidays listed');
  equal(ids(november.filter((e) => e.open)), 'thanksgiving groundhog valentines halloween', 'open on the 18th of November, in the order they come round');
  equal(ids(november.slice(0, 4)), 'thanksgiving groundhog valentines halloween', 'listed first');
  const note = (id) => november.find((e) => e.theme.id === id).note;
  equal(note('thanksgiving'), 'Nov 26', "an open holiday's day");
  equal(note('christmas'), 'opens Dec 1', 'a holiday whose boards are made, not yet open');
  equal(note('valentines'), 'Feb 14', 'another, its day months off');
  equal(note('spring'), 'Mar 20 · soon', 'one whose boards are still to come');
  equal(note('showers'), 'Apr 1 – May 31 · soon', 'a season');
  equal(ids(menuList(new Date(2026, 11, 10, 12)).filter((e) => e.open)), 'christmas new-year groundhog valentines halloween thanksgiving', 'open on the 10th of December');
  equal(ids(menuList(new Date(2027, 0, 10, 12)).filter((e) => e.open)), 'groundhog', 'with the new year, Groundhog Day alone');
  equal(ids(menuList(new Date(2027, 1, 5, 12)).filter((e) => e.open)), 'valentines groundhog', "from the 1st of February, Valentine's Day too");
});

test('each holiday but Groundhog Day opens on the first of a month, weeks before its day', () => {
  const opens = { 'new-year': 'Dec 1', valentines: 'Feb 1', spring: 'Mar 1', showers: 'Mar 1', summer: 'May 1', independence: 'Jun 1', labor: 'Aug 1', fall: 'Aug 1', halloween: 'Oct 1', thanksgiving: 'Nov 1', christmas: 'Dec 1' };
  for (const t of THEMES.filter((t) => !t.always)) {
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
  const christmas = theme('christmas');
  check(!isOpen(christmas, new Date(2026, 10, 30, 20)), 'Christmas is open on the 30th of November');
  check(isOpen(christmas, new Date(2026, 11, 1, 9)), 'Christmas is shut on the 1st of December');
  check(isOpen(christmas, new Date(2026, 11, 31, 23)), "Christmas is shut on New Year's Eve");
  check(!isOpen(christmas, new Date(2027, 0, 1, 9)), "Christmas is open on New Year's Day");
  const newYear = theme('new-year');
  check(!isOpen(newYear, new Date(2026, 10, 30, 20)), "New Year's is open on the 30th of November");
  check(isOpen(newYear, new Date(2026, 11, 1, 9)), "New Year's is shut on the 1st of December");
  check(isOpen(newYear, new Date(2026, 11, 31, 23, 59)), "New Year's is shut on New Year's Eve");
  check(!isOpen(newYear, new Date(2027, 0, 1, 0, 1)), "New Year's is open once the new year has begun");
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

test('Groundhog Day, and it alone, is open all year, every year, once its boards are made', () => {
  equal(THEMES.filter((t) => t.always).map((t) => t.id).join(), 'groundhog', 'always open');
  const groundhog = theme('groundhog');
  equal(day(groundhog.on(2027)), '2027-2-2', 'on the 2nd of February');
  check(!isOpen({ ...groundhog, ready: false }, new Date(2027, 1, 2, 9)), 'Groundhog Day is open before its boards are made');
  check(groundhog.ready, "Groundhog Day's boards not made");
  for (const date of [new Date(2026, 11, 31, 23, 59), new Date(2027, 0, 1, 0, 1), new Date(2027, 1, 2, 6), new Date(2027, 6, 4), new Date(2030, 9, 31)]) {
    check(isOpen(groundhog, date), `Groundhog Day is shut on ${date.toDateString()}`);
  }
});
