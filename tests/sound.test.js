import { test, check, equal } from './run.js';
import { Sound, RIVER, LAST_LINE, GATHER, TWELVE_DAYS, verse } from '../js/ui/sound.js';

// A Sound playing into an offline context, `seconds` long, for Thanksgiving
// or another holiday: what it plays is rendered, to be measured as numbers.
async function render(set, seconds, play) {
  const ctx = new OfflineAudioContext(1, Math.ceil(48000 * seconds), 48000);
  ctx.resume = async () => {}; // nothing to resume before rendering
  const s = new Sound();
  s.muted = false;
  s.use(set);
  s.start(ctx);
  play(s);
  return (await ctx.startRendering()).getChannelData(0);
}

const peakOf = (data) => data.reduce((m, v) => Math.max(m, Math.abs(v)), 0);

// The pitch of a note, by where it best matches itself a period on, near
// the period expected, a little after its start.
function pitchOf(data, rate, expected) {
  const from = Math.floor(rate * 0.05);
  const span = Math.floor(rate * 0.25);
  const corr = (lag) => {
    let s = 0;
    for (let i = from; i < from + span; i++) s += data[i] * data[i + lag];
    return s;
  };
  let lag = 0;
  let best = -Infinity;
  for (let l = Math.floor(rate / (expected * 1.15)); l <= Math.ceil((rate * 1.15) / expected); l++) {
    const c = corr(l);
    if (c > best) [best, lag] = [c, l];
  }
  const [a, c] = [corr(lag - 1), corr(lag + 1)];
  return rate / (lag + (a - c) / (2 * (a - 2 * best + c)));
}

test("Thanksgiving's song is its tune as written: fourteen bars of 6/8, its last line from the second Over the river", () => {
  const eighths = (list) => list.reduce((n, [, e]) => n + e, 0);
  equal(RIVER.length, 58, 'notes');
  equal(eighths(RIVER), 14 * 6, 'eighths');
  equal(eighths(RIVER.slice(0, LAST_LINE)), 8 * 6, 'eighths before the last line');
  equal(RIVER.slice(LAST_LINE, LAST_LINE + 10).join(' '), RIVER.slice(0, 10).join(' '), 'the last line beginning as the first does');
  equal(RIVER.at(-1)[0], 60, 'ending on middle C, its keynote');
});

test("We Gather Together's four voices keep time together, sixteen bars of 3/4 from an upbeat, and end on D major", () => {
  for (const [k, voice] of GATHER.entries()) equal(voice.reduce((n, [, b]) => n + b, 0), 16 * 3, `voice ${k + 1}'s beats, the last bar a beat short for the upbeat`);
  check(GATHER.every((voice) => [2, 6, 9].includes(voice.at(-1)[0] % 12)), 'the last chord not D major');
  equal(GATHER[3].at(-1)[0] % 12, 2, 'the bass ending on D');
});

test("each holiday's music goes with its tiles: Thanksgiving's and Christmas's on their own, Halloween's on the others until theirs come", () => {
  const s = new Sound();
  for (const set of ['thanksgiving', 'christmas']) {
    s.use(set);
    equal(s.set, set, set);
  }
  for (const set of ['new-year', 'groundhog', 'halloween']) {
    s.use(set);
    equal(s.set, 'halloween', set);
  }
});

test("The Twelve Days of Christmas keeps time, each verse counting its gifts down to the partridge in a pear tree", () => {
  const beats = (phrases) => phrases.reduce((n, [notes]) => n + notes.reduce((m, [, b]) => m + b, 0), 0);
  // An upbeat, then whole bars of 4/4 and 3/4: the first verse's sixteen
  // beats, and three more for each gift a later one adds, four for the
  // turtle doves and eight for the five gold rings.
  const expected = { 1: 16, 2: 20, 3: 23, 4: 26, 5: 34, 6: 37, 12: 55 };
  for (const [day, n] of Object.entries(expected)) equal(beats(verse(Number(day))), n, `the ${day} verse's beats`);
  equal(beats(verse(9, true)), 37, "a cleared board's ninth verse, the ninth gift and then from the rings down");
  equal(TWELVE_DAYS.length, 39, "the fifth verse's notes, for the matches");
  for (let day = 1; day <= 12; day++) equal(verse(day).at(-1)[0].at(-1).join(), '65,3', `the ${day} verse ending on F, its keynote, held`);
});

test("Christmas's sounds are all heard, and none too loud", async () => {
  const sounds = {
    'a match': [2, (s) => s.match()],
    'the first day cleared': [8, (s) => s.win({ day: 0 })],
    'the sixth day cleared': [16, (s) => s.win({ day: 5 })],
    'Twelfth Night, the twelve days seen through': [28, (s) => s.win({ day: 11, last: true })],
    'a turtle cleared': [15, (s) => s.win()],
    'a shuffle': [1, (s) => s.shuffle()],
    'a hint': [1.5, (s) => s.hint()],
    'a treat': [2.5, (s) => s.treat()],
    'no pairs left': [0.6, (s) => s.stuck()],
  };
  const peaks = [];
  for (const [name, [seconds, play]] of Object.entries(sounds)) {
    const peak = peakOf(await render('christmas', seconds, play));
    peaks.push(peak);
    check(peak > 0.02, `${name}: too quiet, at ${peak.toFixed(3)}`);
    check(peak < 0.95, `${name}: too loud, at ${peak.toFixed(2)}`);
  }
  return `peaks ${Math.min(...peaks).toFixed(2)} to ${Math.max(...peaks).toFixed(2)}`;
});

test("Thanksgiving's banjo plays in tune", async () => {
  let worst = 0;
  for (const midi of [60, 64, 67, 72, 84]) {
    const data = await render('thanksgiving', 0.5, (s) => s.banjo(midi, 0));
    const expected = 440 * 2 ** ((midi - 69) / 12);
    const cents = 1200 * Math.log2(pitchOf(data, 48000, expected) / expected);
    worst = Math.max(worst, Math.abs(cents));
    check(Math.abs(cents) < 8, `note ${midi} out by ${cents.toFixed(1)} cents`);
  }
  return `within ${worst.toFixed(1)} cents`;
});

test("Thanksgiving's sounds are all heard, and none too loud", async () => {
  const sounds = {
    'a match': [0.6, (s) => s.match()],
    'a cleared board': [9, (s) => s.win()],
    'the week seen through': [27, (s) => s.win({ day: 7, last: true })],
    'a shuffle': [1, (s) => s.shuffle()],
    'a hint': [1.5, (s) => s.hint()],
    'a treat': [2.2, (s) => s.treat()],
    'no pairs left': [0.8, (s) => s.stuck()],
    'the nap': [1.6, (s) => s.nap()],
    'waking': [1, (s) => s.wake()],
    'a touchdown': [2, (s) => s.touchdown()],
  };
  const peaks = [];
  for (const [name, [seconds, play]] of Object.entries(sounds)) {
    const peak = peakOf(await render('thanksgiving', seconds, play));
    peaks.push(peak);
    check(peak > 0.02, `${name}: too quiet, at ${peak.toFixed(3)}`);
    check(peak < 0.95, `${name}: too loud, at ${peak.toFixed(2)}`);
  }
  return `peaks ${Math.min(...peaks).toFixed(2)} to ${Math.max(...peaks).toFixed(2)}`;
});
