import { test, check, equal } from './run.js';
import { THEMES, theme, when, calendar } from '../js/themes.js';

const day = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
const ids = (list) => list.map((e) => e.theme.id).join(' ');

test('there are the ten holidays and seasons, each once, with Halloween ready to play', () => {
  equal(THEMES.length, 10, 'themes');
  equal(new Set(THEMES.map((t) => t.id)).size, 10, 'different themes');
  const names = THEMES.map((t) => t.name);
  for (const name of ['Thanksgiving', 'Christmas', "New Year's", "Valentine's Day", 'Start of Spring', 'Summer Beach Season', 'Independence Day', 'Labor Day', 'Start of Fall', 'Halloween']) {
    check(names.includes(name), `${name} is missing`);
  }
  equal(THEMES.filter((t) => t.ready).map((t) => t.id).join(), 'halloween', 'the ones ready');
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
