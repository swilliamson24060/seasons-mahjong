import { test, check, equal } from './run.js';
import { Sound, RIVER, LAST_LINE, GATHER, TWELVE_DAYS, verse, AULD, CHORUS, LAST_TOAST, SPRING, WINTER, LIEBESTRAUM, SECOND_TIME, DREAM_LINE, DREAM_HARMONY, PRELUDE, PRELUDE_LEFT, SECOND_PHRASE, RAINDROP, GYMNOPEDIE, GYMNOPEDIE_LEFT, SPRING_SONG, SPRING_SONG_LEFT, THEME_AGAIN } from '../js/ui/sound.js';

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

test("each holiday's music goes with its tiles, every one made having its own, and Halloween's the rest until theirs come", () => {
  const s = new Sound();
  for (const set of ['thanksgiving', 'christmas', 'new-year', 'groundhog', 'valentines', 'spring', 'showers', 'turtle', 'halloween']) {
    s.use(set);
    equal(s.set, set, set);
  }
  s.use('summer');
  equal(s.set, 'halloween', 'a holiday whose music is still to come');
});

test("Chopin's Raindrop keeps time: eight bars of 4/4, the theme and the theme again, the A flat falling through it, ending on D flat", () => {
  const beats = (notes) => notes.reduce((n, [, b]) => n + b, 0);
  check(Math.abs(beats(PRELUDE) - 8 * 4) < 1e-9, `${beats(PRELUDE)} beats, not eight bars`);
  check(Math.abs(beats(PRELUDE.slice(0, SECOND_PHRASE)) - 4 * 4) < 1e-9, 'the theme again not from the fifth bar');
  equal(PRELUDE.slice(0, 10).join(' '), PRELUDE.slice(SECOND_PHRASE, SECOND_PHRASE + 10).join(' '), 'the theme the second time opening as the first does');
  equal(PRELUDE_LEFT.length, 8, "the left hand's bars");
  check(PRELUDE_LEFT.flat().every(([eighth]) => eighth >= 0 && eighth < 8), 'a note of the left hand outside its bar');
  const drops = PRELUDE_LEFT.flat().filter(([, notes]) => notes.includes(RAINDROP)).length;
  check(drops >= 24, `the A flat falling only ${drops} times`);
  equal(RAINDROP % 12, 8, 'the raindrop an A flat');
  equal(PRELUDE.at(-1)[0] % 12, 1, 'ending on D flat');
  check(PRELUDE.every(([note]) => [1, 3, 5, 6, 8, 10, 0, 2].includes(note % 12)), "a note outside D flat's scale, but for the run's D");
});

test("Mendelssohn's Spring Song keeps time: fifteen bars of 2/4, the theme to its half close on E and the theme again to its close on A", () => {
  const beats = (notes) => notes.reduce((n, [, b]) => n + b, 0);
  equal(beats(SPRING_SONG), 15 * 2, 'beats: fifteen bars');
  equal(beats(SPRING_SONG.slice(0, THEME_AGAIN)), 8 * 2, 'the theme again not from the ninth bar');
  equal(SPRING_SONG.slice(0, 10).join(' '), SPRING_SONG.slice(THEME_AGAIN, THEME_AGAIN + 10).join(' '), 'the theme the second time opening as the first does');
  equal(SPRING_SONG.slice(0, 8).map(([note]) => note).join(' '), '73 74 75 76 81 76 74 73', 'the opening: C sharp, running up through D and D sharp to E, the leap to A, and down through E and D to C sharp');
  equal(SPRING_SONG[THEME_AGAIN - 1][0] % 12, 4, 'the theme coming to its half close on E');
  const outside = [...new Set(SPRING_SONG.map(([note]) => note).filter((note) => ![9, 11, 1, 2, 4, 6, 8].includes(note % 12)))].sort((a, b) => a - b);
  equal(outside.join(' '), '70 72 75', "the notes outside A major's scale: the runs' A sharp, B sharp and D sharp");
  equal(SPRING_SONG.at(-1)[0] % 12, 9, 'ending on A');
  equal(SPRING_SONG_LEFT.length, 15, "the left hand's bars");
  check(SPRING_SONG_LEFT.every(([, chord]) => chord.length >= 3), 'a bar without its chord');
  equal(SPRING_SONG_LEFT.map(([bass]) => 'C C# D D# E F F# G G# A A# B'.split(' ')[bass % 12]).join(' '), 'A C# D B G# A F# E A C# D A# B E A', 'the bass, bar by bar');
});

test("Satie's first Gymnopédie keeps time: four bars of chords, then the tune's two phrases, twenty-one bars of 3/4, a bass and a chord to each", () => {
  const beats = (notes) => notes.reduce((n, [, b]) => n + b, 0);
  equal(beats(GYMNOPEDIE), 21 * 3, 'beats: twenty-one bars');
  equal(GYMNOPEDIE_LEFT.length, 21, "the left hand's bars");
  equal(GYMNOPEDIE[0].join(), '0,12', 'four bars of chords before the tune');
  const tune = GYMNOPEDIE.filter(([note]) => note).map(([note]) => note);
  equal(tune.slice(0, 10).join(' '), '78 81 79 78 73 71 73 74 69 66', 'the first phrase, F sharp, A, G, F sharp, C sharp, B, C sharp, D, A, and the long F sharp');
  equal(tune.slice(10, 19).join(' '), tune.slice(0, 9).join(' '), 'the second phrase opening as the first does');
  equal(GYMNOPEDIE.at(-1).join(), '64,9', 'the second phrase coming to rest on E');
  check(GYMNOPEDIE_LEFT.slice(0, 16).every(([bass], k) => bass === (k % 2 ? 38 : 43)), 'the bass not rocking between G and D');
  check(GYMNOPEDIE_LEFT.every(([, chord]) => chord.length >= 2), 'a bar without its chord');
});

test("the turtle's music is all heard, and none too loud", async () => {
  const sounds = {
    'a match': [2.4, (s) => s.match()],
    'a board cleared': [16, (s) => s.win()],
    'the pond stirred, for a shuffle': [1, (s) => s.shuffle()],
    "a frog's croak, for a hint": [0.6, (s) => s.hint()],
    'a koi leaping, for a treat': [2.4, (s) => s.treat()],
    'the turtle tucking into his shell, with no pairs left': [0.8, (s) => s.stuck()],
    'dusk on the pond': [3.6, (s) => s.dusk()],
  };
  const peaks = [];
  for (const [name, [seconds, play]] of Object.entries(sounds)) {
    const peak = peakOf(await render('turtle', seconds, play));
    peaks.push(peak);
    check(peak > 0.02, `${name}: too quiet, at ${peak.toFixed(3)}`);
    check(peak < 0.95, `${name}: too loud, at ${peak.toFixed(2)}`);
  }
  return `peaks ${Math.min(...peaks).toFixed(2)} to ${Math.max(...peaks).toFixed(2)}`;
});

test("April Showers' music is all heard, and none too loud", async () => {
  const sounds = {
    'a match': [2.4, (s) => s.match()],
    'a chapter cleared': [16, (s) => s.win({ day: 0 })],
    'the season seen through': [27, (s) => s.win({ day: 7, last: true })],
    'a spring shower, for a shuffle': [1.2, (s) => s.shuffle()],
    'a raindrop on the window, for a hint': [1, (s) => s.hint()],
    'a rainbow, for a treat': [2.4, (s) => s.treat()],
    'thunder far off, with no pairs left': [2.8, (s) => s.stuck()],
  };
  const peaks = [];
  for (const [name, [seconds, play]] of Object.entries(sounds)) {
    const peak = peakOf(await render('showers', seconds, play));
    peaks.push(peak);
    check(peak > 0.02, `${name}: too quiet, at ${peak.toFixed(3)}`);
    check(peak < 0.95, `${name}: too loud, at ${peak.toFixed(2)}`);
  }
  return `peaks ${Math.min(...peaks).toFixed(2)} to ${Math.max(...peaks).toFixed(2)}`;
});

test("the Start of Spring's music is all heard, and none too loud", async () => {
  const sounds = {
    'a match': [2.4, (s) => s.match()],
    'a chapter cleared': [13, (s) => s.win({ day: 0 })],
    'the season seen through': [23, (s) => s.win({ day: 7, last: true })],
    'a March gust, for a shuffle': [1.6, (s) => s.shuffle()],
    "a robin's chirp, for a hint": [0.8, (s) => s.hint()],
    "a kite's string, for a treat": [2.6, (s) => s.treat()],
    "the lion's roar, with no pairs left": [2, (s) => s.stuck()],
  };
  const peaks = [];
  for (const [name, [seconds, play]] of Object.entries(sounds)) {
    const peak = peakOf(await render('spring', seconds, play));
    peaks.push(peak);
    check(peak > 0.02, `${name}: too quiet, at ${peak.toFixed(3)}`);
    check(peak < 0.95, `${name}: too loud, at ${peak.toFixed(2)}`);
  }
  return `peaks ${Math.min(...peaks).toFixed(2)} to ${Math.max(...peaks).toFixed(2)}`;
});

test("Liszt's Liebestraum keeps time: an upbeat and twelve bars of 6/4, its harmony a chord to each half bar, ending on A flat", () => {
  const beats = (notes) => notes.reduce((n, [, b]) => n + b, 0);
  equal(beats(LIEBESTRAUM), 1 + 12 * 6, 'beats: an upbeat and twelve bars');
  equal(DREAM_HARMONY.length, 12 * 2, 'chords, one to each half bar');
  check(DREAM_HARMONY.every(([, ripple]) => ripple.length === 5), "a chord not rippling through its half bar, an eighth a note after the bass's");
  equal(beats(LIEBESTRAUM.slice(0, SECOND_TIME)), 6 * 6, "the second time's upbeat on the sixth bar's last beat");
  equal(beats(LIEBESTRAUM.slice(0, DREAM_LINE)), 1 + 8 * 6, 'the last line from the ninth bar');
  equal(LIEBESTRAUM.slice(1, 9).join(' '), LIEBESTRAUM.slice(SECOND_TIME + 1, SECOND_TIME + 9).join(' '), 'the second time opening as the first does');
  equal(Math.max(...LIEBESTRAUM.map(([note]) => note)), 77, 'the high F the second time rises to');
  equal(LIEBESTRAUM.at(-1).join(), '68,6', 'ending on A flat, held');
  const [bass, ripple] = DREAM_HARMONY.at(-1);
  check([bass, ...ripple].every((note) => [8, 0, 3].includes(note % 12)), 'the last chord not A flat major');
  equal(bass % 12, 8, 'the bass ending on A flat');
});

test('the harp plays in tune', async () => {
  let worst = 0;
  for (const midi of [44, 56, 68, 72, 77]) {
    const data = await render('valentines', 0.5, (s) => s.harp(midi, 0));
    const expected = 440 * 2 ** ((midi - 69) / 12);
    const cents = 1200 * Math.log2(pitchOf(data, 48000, expected) / expected);
    worst = Math.max(worst, Math.abs(cents));
    check(Math.abs(cents) < 8, `note ${midi} out by ${cents.toFixed(1)} cents`);
  }
  return `within ${worst.toFixed(1)} cents`;
});

test("Valentine's sounds are all heard, and none too loud", async () => {
  const sounds = {
    'a match': [2, (s) => s.match()],
    'a chapter cleared': [17, (s) => s.win({ day: 0 })],
    'the question popped and answered': [26, (s) => s.win({ day: 7, last: true })],
    'a shuffle': [1, (s) => s.shuffle()],
    'a hint': [1.6, (s) => s.hint()],
    'a treat': [2, (s) => s.treat()],
    'no pairs left': [2.2, (s) => s.stuck()],
    "Cupid's arrow": [2, (s) => s.arrow()],
    'love at first sight': [2.4, (s) => s.love()],
    'a heart broken': [2.2, (s) => s.heartbreak()],
    'half a sweet nothing': [1.6, (s) => s.halfSaid()],
    'a sweet nothing said': [2.4, (s) => s.sweetNothing()],
    'a sweet nothing unsaid': [2.2, (s) => s.unsaid()],
    'a rose opening': [2, (s) => s.bloom()],
    'a rose for the bouquet': [2.4, (s) => s.gathered()],
    'a bud snipped': [2.6, (s) => s.snip()],
    'a rose wilting': [2.4, (s) => s.wilt()],
    'a candlelit pair': [2.4, (s) => s.candlelit()],
    'the candles burning down': [2.4, (s) => s.flicker()],
    'the candles guttering out': [2.8, (s) => s.gutter()],
    'a bite of chocolate': [1.2, (s) => s.bite()],
    'a chocolate savoured': [2.6, (s) => s.savoured()],
    'a chocolate just eaten': [2, (s) => s.justEaten()],
    'an XOXO': [3, (s) => s.xoxo()],
    'the question popped': [3.6, (s) => s.question()],
  };
  const peaks = [];
  for (const [name, [seconds, play]] of Object.entries(sounds)) {
    const peak = peakOf(await render('valentines', seconds, play));
    peaks.push(peak);
    check(peak > 0.02, `${name}: too quiet, at ${peak.toFixed(3)}`);
    check(peak < 0.95, `${name}: too loud, at ${peak.toFixed(2)}`);
  }
  return `peaks ${Math.min(...peaks).toFixed(2)} to ${Math.max(...peaks).toFixed(2)}`;
});

test("Vivaldi's Spring and Winter keep time, their voices together, Spring ending on E major and Winter on F minor", () => {
  const beats = (voice) => voice.reduce((n, [, b]) => n + b, 0);
  for (const [k, voice] of SPRING.entries()) equal(beats(voice), 25.5, `Spring's voice ${k + 1}'s beats`);
  for (const [k, voice] of WINTER.entries()) equal(beats(voice), 24, `Winter's voice ${k + 1}'s beats`);
  equal(SPRING[0].filter(([note]) => note).length, 50, "Spring's tune, a note for each match");
  equal(`${SPRING[0].at(-1)[0]} ${SPRING[2].at(-1)[0]}`, '76 40', 'Spring ending on E, over a low E');
  check(WINTER.every((voice) => [5, 8, 0].includes(voice.at(-1)[0] % 12)), "Winter's last notes not F minor's");
});

test('the harpsichord plays in tune', async () => {
  let worst = 0;
  for (const midi of [52, 64, 76, 83]) {
    const data = await render('groundhog', 0.5, (s) => s.harpsichord(midi, 0));
    const expected = 440 * 2 ** ((midi - 69) / 12);
    const cents = 1200 * Math.log2(pitchOf(data, 48000, expected) / expected);
    worst = Math.max(worst, Math.abs(cents));
    check(Math.abs(cents) < 8, `note ${midi} out by ${cents.toFixed(1)} cents`);
  }
  return `within ${worst.toFixed(1)} cents`;
});

test("Groundhog Day's sounds are all heard, and none too loud", async () => {
  const sounds = {
    'a match': [1.6, (s) => s.match()],
    'an early spring': [16, (s) => s.win({ day: 0, last: true, spring: true })],
    'six more weeks of winter': [15, (s) => s.win({ day: 0, last: true })],
    'a shuffle': [1, (s) => s.shuffle()],
    'a hint': [0.8, (s) => s.hint()],
    'a treat': [2, (s) => s.treat()],
    'no pairs left': [1.2, (s) => s.stuck()],
  };
  const peaks = [];
  for (const [name, [seconds, play]] of Object.entries(sounds)) {
    const peak = peakOf(await render('groundhog', seconds, play));
    peaks.push(peak);
    check(peak > 0.02, `${name}: too quiet, at ${peak.toFixed(3)}`);
    check(peak < 0.95, `${name}: too loud, at ${peak.toFixed(2)}`);
  }
  return `peaks ${Math.min(...peaks).toFixed(2)} to ${Math.max(...peaks).toFixed(2)}`;
});

test('Auld Lang Syne keeps time: an upbeat and sixteen bars of 4/4, verse and chorus, its last line and its chorus from where they begin', () => {
  const beats = (notes) => notes.reduce((n, [, b]) => n + b, 0);
  equal(AULD.length, 56, 'notes');
  equal(beats(AULD), 1 + 15 * 4 + 3, 'beats: an upbeat, and the last bar a beat short for it');
  equal(beats(AULD.slice(0, CHORUS + 1)) % 4, 1, 'the chorus coming in on the last beat of a bar');
  equal(beats(AULD.slice(0, LAST_TOAST + 1)) % 4, 1, 'its last line too');
  equal(beats(AULD.slice(LAST_TOAST)), 16, "the last line's beats");
  equal(AULD.slice(CHORUS + 1, CHORUS + 5).join(' '), AULD.slice(LAST_TOAST + 1, LAST_TOAST + 5).join(' '), "the chorus and its last line opening alike, as the song's lines do");
  equal(AULD.at(-1).join(), '65,3', 'ending on F, its keynote, held');
});

test("New Year's sounds are all heard, and none too loud", async () => {
  const sounds = {
    'a match': [2.5, (s) => s.match()],
    'a cleared board': [13, (s) => s.win({ day: 3 })],
    "New Year's Day cleared, the countdown seen through": [25, (s) => s.win({ day: 10, last: true })],
    'midnight': [6.5, (s) => s.newYear()],
    'a shuffle': [1, (s) => s.shuffle()],
    'a hint': [1.2, (s) => s.hint()],
    'a treat': [1.6, (s) => s.treat()],
    'no pairs left': [1.2, (s) => s.stuck()],
  };
  const peaks = [];
  for (const [name, [seconds, play]] of Object.entries(sounds)) {
    const peak = peakOf(await render('new-year', seconds, play));
    peaks.push(peak);
    check(peak > 0.02, `${name}: too quiet, at ${peak.toFixed(3)}`);
    check(peak < 0.95, `${name}: too loud, at ${peak.toFixed(2)}`);
  }
  return `peaks ${Math.min(...peaks).toFixed(2)} to ${Math.max(...peaks).toFixed(2)}`;
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

test("the Start of Spring is heard, and not too loud: a snowball landing and snow knocked off on the thaw, on the first robin each note of her song sung back, a new song sung, a song sung back and one broken, on the kite the wind turning and a pair catching it, on luck of the Irish a four-leaf clover showing, found and blown away, on spring cleaning a row swept clean and one cleared out of turn, on day and night an equinox pair, and March going out like a lamb", async () => {
  const sounds = {
    'a snowball landing': [0.6, (s) => s.snowball()],
    'snow knocked off': [1.6, (s) => s.knockOff()],
    'her first note sung back': [0.5, (s) => s.songNote(0)],
    'her last note sung back': [0.5, (s) => s.songNote(2)],
    'a new song': [1.8, (s) => s.robinSings()],
    'a song sung back': [2.6, (s) => s.songSungBack()],
    'a song broken': [0.5, (s) => s.tutTut()],
    'the wind turning': [1.4, (s) => s.gust()],
    'a pair catching the wind': [0.5, (s) => s.catchWind()],
    'a four-leaf clover showing': [1.2, (s) => s.cloverShows()],
    'a stroke of luck': [2.4, (s) => s.luck()],
    'a clover blown away': [0.8, (s) => s.cloverLost()],
    'a row swept clean': [1.8, (s) => s.sweep()],
    'a row cleared out of turn': [0.7, (s) => s.dust()],
    'an equinox pair': [2.4, (s) => s.equinox()],
    'March going out like a lamb': [3.6, (s) => s.lamb()],
  };
  const peaks = [];
  for (const [name, [seconds, play]] of Object.entries(sounds)) {
    const peak = peakOf(await render('spring', seconds, play));
    peaks.push(peak);
    check(peak > 0.02, `${name}: too quiet, at ${peak.toFixed(3)}`);
    check(peak < 0.95, `${name}: too loud, at ${peak.toFixed(2)}`);
  }
  return `peaks ${Math.min(...peaks).toFixed(2)} to ${Math.max(...peaks).toFixed(2)}`;
});

test("the beach season's tide and sand crab are heard, and not too loud: the tide coming in a row and going out one, and a crab coming out, startled home and going home on its own", async () => {
  const peaks = [];
  const sounds = {
    'the tide coming in': [1.8, (s) => s.tideIn()],
    'the tide going out': [1.6, (s) => s.tideOut()],
    'a crab coming out': [0.8, (s) => s.crabOut()],
    'a crab startled home': [1.6, (s) => s.crabStartled()],
    'a crab going home': [0.8, (s) => s.crabHome()],
  };
  for (const [name, [seconds, play]] of Object.entries(sounds)) {
    const peak = peakOf(await render('halloween', seconds, play));
    peaks.push(peak);
    check(peak > 0.02, `${name}: too quiet, at ${peak.toFixed(3)}`);
    check(peak < 0.95, `${name}: too loud, at ${peak.toFixed(2)}`);
  }
  return `peaks ${peaks.map((p) => p.toFixed(2)).join(', ')}`;
});

test("April Showers' rain is heard, and not too loud: a raindrop landing, one caught and one dripping off the rim, splashes in the puddle, from the first to the tenth in a row, the rainbow's colours caught, the seedlings watered, blooming, picked and pulled up, the watering can filled, poured and tipped empty, a bee buzzing and making honey, and May morning, as April turns to May", async () => {
  const sounds = {
    'a raindrop landing': [0.6, (s) => s.raindrop()],
    'a raindrop caught': [1.2, (s) => s.catchDrop()],
    'a raindrop dripping off': [0.8, (s) => s.drip()],
    'a splash': [0.8, (s) => s.splash(1)],
    'a fourth splash in a row': [1, (s) => s.splash(4)],
    'a tenth splash in a row': [1, (s) => s.splash(10)],
    'red caught': [1.6, (s) => s.colour(0)],
    'violet caught': [1.6, (s) => s.colour(5)],
    'a seedling watered': [0.8, (s) => s.water()],
    'a seedling blooming': [1.8, (s) => s.blossom()],
    'a bloom picked': [2, (s) => s.picked()],
    'a seedling pulled up': [0.8, (s) => s.pulled()],
    'the can filled': [0.8, (s) => s.fill(3)],
    'the can poured': [1.6, (s) => s.sprinkle()],
    'the can tipped empty': [0.6, (s) => s.clank()],
    'the bee buzzing': [0.6, (s) => s.buzz()],
    'honey made': [1.4, (s) => s.honey()],
    'May morning': [3, (s) => s.mayDay()],
  };
  const peaks = [];
  for (const [name, [seconds, play]] of Object.entries(sounds)) {
    const peak = peakOf(await render('showers', seconds, play));
    peaks.push(peak);
    check(peak > 0.02, `${name}: too quiet, at ${peak.toFixed(3)}`);
    check(peak < 0.95, `${name}: too loud, at ${peak.toFixed(2)}`);
  }
  return `peaks ${Math.min(...peaks).toFixed(2)} to ${Math.max(...peaks).toFixed(2)}`;
});
