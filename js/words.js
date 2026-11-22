// The words a board is told in, in its holiday's own: its treats, and its
// turning over. A holiday's own boards speak its words wherever they are
// played; a board outside them all, the turtle or one of the night's played
// by its address, speaks those of the tiles it wears, the holiday chosen's:
// no black cats at Christmas.

// The treats a board gives, in its own words. The game knows them as
// candle, key and cat: a free hint, a blocked tile freed, and a free
// shuffle. Each holiday's tiles bring their own, left by the pairs that
// leave treats, the jack-o'-lanterns, as each set draws them:
//
// - Halloween's candle, skeleton key and black cat, which the
//   jack-o'-lanterns leave;
// - the gifts friends bring at Thanksgiving, a tip, a saved seat and
//   musical chairs, from the potluck's dishes on Friendsgiving and from the
//   turkeys elsewhere;
// - Christmas's star, Santa's key and sleigh ride, in the stockings;
// - New Year's sparkler, party popper and rattle, the party hats' party
//   favours;
// - Groundhog Day's sunshine, warm spell and gust of wind, the suns' change
//   in the weather;
// - and Valentine's matchmaker, key to your heart and speed dating, the
//   boxes of chocolates' sweet surprises.
//
// For each: its icon, which a tile freed by its key wears too; its name, as
// a toast gives it when one comes; its button on the card when no pairs are
// left; what it does, for a player who taps one with none in hand, and
// where they come from; what it says when used; and its key's name, for
// when the key can't be used.
const POTLUCK = {
  icons: { candle: '💬', key: '🪑', cat: '🎶' },
  names: { candle: 'a tip, to show you a match', key: 'a saved seat, to free a blocked tile', cat: 'musical chairs, for a free shuffle' },
  buttons: { key: 'Saved seat', cat: 'Musical chairs' },
  help: { candle: "A friend's tip shows you a match, for free.", key: 'A saved seat frees one blocked tile.', cat: 'Musical chairs shuffles the tiles for free.' },
  came: (name) => `A friend brought ${name}.`,
  from: () => 'Each pair of turkeys, green beans or mashed potatoes leaves a gift.',
  used: { candle: "A friend's tip: there's a match.", cat: 'Musical chairs: everyone moves round, a free shuffle.', key: 'Choose a blocked tile for the saved seat.' },
  keyName: 'saved seat',
};

export const GIFTS = {
  halloween: {
    icons: { candle: '🕯️', key: '🗝️', cat: '🐈‍⬛' },
    names: { candle: 'a candle, to show you a match', key: 'a skeleton key, to free a blocked tile', cat: 'a black cat, for a free shuffle' },
    buttons: { key: 'Skeleton key', cat: 'Black cat' },
    help: { candle: 'A candle shows you a match, for free.', key: 'A skeleton key frees one blocked tile.', cat: 'A black cat shuffles the tiles for free.' },
    came: (name) => `The jack-o'-lanterns left ${name}.`,
    from: (on) => (on ? "Each pair of jack-o'-lanterns leaves a treat." : 'Treats begin at 7 pm.'),
    used: { candle: 'The candle shows you a match, for free.', cat: 'The black cat knocks the tiles about: a free shuffle.', key: 'Choose a blocked tile for the skeleton key.' },
    keyName: 'key',
  },
  potluck: POTLUCK,
  thanksgiving: { ...POTLUCK, from: () => 'Each pair of turkeys leaves a gift.' },
  christmas: {
    icons: { candle: '⭐', key: '🗝️', cat: '🛷' },
    names: { candle: 'a star, to show you a match', key: "Santa's key, to free a blocked tile", cat: 'a sleigh ride, for a free shuffle' },
    buttons: { key: "Santa's key", cat: 'Sleigh ride' },
    help: { candle: 'A star shows you a match, for free.', key: "Santa's key frees one blocked tile.", cat: 'A sleigh ride shuffles the tiles for free.' },
    came: (name) => `In the stockings: ${name}.`,
    from: () => 'Each pair of stockings holds a gift.',
    used: { candle: 'The star shows you the way to a match, for free.', cat: 'The sleigh takes the tiles for a ride: a free shuffle.', key: "Choose a blocked tile for Santa's key." },
    keyName: 'key',
  },
  'new-year': {
    icons: { candle: '🎇', key: '🎉', cat: '🪇' },
    names: { candle: 'a sparkler, to show you a match', key: 'a party popper, to free a blocked tile', cat: 'a rattle, for a free shuffle' },
    buttons: { key: 'Party popper', cat: 'Rattle' },
    help: { candle: 'A sparkler lights up a match, for free.', key: 'A party popper pops one blocked tile free.', cat: 'A rattle shakes the tiles up, for free.' },
    came: (name) => `A party favour: ${name}.`,
    from: () => 'Each pair of party hats brings a party favour.',
    used: { candle: 'The sparkler lights up a match, for free.', cat: 'The rattle shakes the tiles up: a free shuffle.', key: 'Choose a blocked tile for the party popper.' },
    keyName: 'party popper',
  },
  groundhog: {
    icons: { candle: '☀️', key: '🌡️', cat: '🌬️' },
    names: { candle: 'sunshine, to show you a match', key: 'a warm spell, to free a blocked tile', cat: 'a gust of wind, for a free shuffle' },
    buttons: { key: 'Warm spell', cat: 'Gust of wind' },
    help: { candle: 'Sunshine shows you a match, for free.', key: 'A warm spell thaws one blocked tile free.', cat: 'A gust of wind blows the tiles about, for free.' },
    came: (name) => `The forecast: ${name}.`,
    from: () => 'Each pair of suns brings a change in the weather.',
    used: { candle: 'The sun comes out and shows you a match, for free.', cat: 'A gust of wind blows the tiles about: a free shuffle.', key: 'Choose a blocked tile for the warm spell.' },
    keyName: 'warm spell',
  },
  valentines: {
    icons: { candle: '💕', key: '🔑', cat: '⏱️' },
    names: { candle: 'a matchmaker, to show you a match', key: 'the key to your heart, to free a blocked tile', cat: 'speed dating, for a free shuffle' },
    buttons: { key: 'Key to your heart', cat: 'Speed dating' },
    help: { candle: 'A matchmaker shows you a match, for free.', key: 'The key to your heart frees one blocked tile.', cat: 'Speed dating shuffles the tiles for free.' },
    came: (name) => `A sweet surprise: ${name}.`,
    from: () => 'Each pair of boxes of chocolates hides a sweet surprise.',
    used: { candle: 'The matchmaker shows you a match, for free.', cat: 'The bell rings, and everyone moves on to someone new: a free shuffle.', key: 'Choose a blocked tile for the key to your heart.' },
    keyName: 'key',
  },
};

// How a board's turning over is told: Halloween's midnight, or its sunrise
// on a board that starts on its night side; the Sunday Scaries' sundown,
// when the weekend turns over to Monday and its lost souls are worries;
// Christmas's Twelfth Night, when the drummers drum, the tiles turn over,
// and its lost souls are lumps of coal, for the board that is left; New
// Year's midnight, on the 1, when the ball lands, the clock strikes twelve
// and the new year comes in, its lost souls sleepyheads who missed it;
// Valentine's question, on Be mine, when the ring comes out and the
// question is popped, its lost souls broken hearts; April Showers' May
// morning, on May Day, when dawn breaks and April turns to May, its lost
// souls flowers that wilted; and Groundhog Day's
// forecast, on a board in its tiles turning over outside its own, when the
// groundhog comes out to look for his shadow, its lost souls shadows. For
// each: the clock in the top bar, before the turn and after; what its lost
// souls are; what it says at the turn, and three matches before; the moon's
// title; the score's words; the sound it rings, by its name in sound.js;
// and on New Year's, fireworks over the board.
export const TURNS = {
  midnight: {
    ahead: (n, night) => `${night ? '🕛' : '🌅'} <b>${n}</b> to ${night ? 'midnight' : 'sunrise'}`,
    after: (night) => (night ? '🌙 night' : '☀️ day'),
    soul: '👻',
    soulsAhead: 'Lost souls if the tiles turned over now',
    soulsWoke: 'Lost souls that woke',
    turned: (night) => (night ? 'Midnight! The tiles turn over.' : 'Sunrise! The tiles turn back to day.'),
    woke: (n) => (n ? `${n} lost ${n === 1 ? 'soul wakes' : 'souls wake'}: lost souls match each other.` : 'Not one lost soul.'),
    prompt: 'Three matches to midnight. Hold the moon to see the night side, and take pairs that match on both sides.',
    moon: 'Hold to see the night side (or hold Space)',
    score: { night: 'Midnight', day: 'Sunrise', souls: 'Lost souls', none: 'no lost souls' },
    ring: (night) => (night ? 'midnight' : 'sunrise'),
  },
  sundown: {
    ahead: (n) => `🌇 <b>${n}</b> to sundown`,
    after: () => '😟 Monday',
    soul: '😟',
    soulsAhead: 'Worries if the tiles turned over now',
    soulsWoke: 'Worries that woke',
    turned: () => "Sundown! The weekend's over, and the tiles turn over to Monday.",
    woke: (n) => (n ? `${n} ${n === 1 ? 'worry wakes' : 'worries wake'}: worries match each other.` : 'Not one worry.'),
    prompt: 'Three matches to sundown. Hold the moon to see Monday coming, and take pairs that match on both sides.',
    moon: "Hold to see Monday's side (or hold Space)",
    score: { night: 'Sundown', day: 'Sundown', souls: 'Worries', none: 'no worries' },
    ring: () => 'alarm',
  },
  twelfth: {
    ahead: (n) => `🌟 <b>${n}</b> to Twelfth Night`,
    after: () => '🎭 Twelfth Night',
    soul: '🪨',
    soulsAhead: 'Lumps of coal if the tiles turned over now',
    soulsWoke: 'Lumps of coal on the board',
    turned: () => 'Twelfth Night! The drummers drum, and the tiles turn over.',
    woke: (n) => (n ? `${n} ${n === 1 ? 'tile turns' : 'tiles turn'} to coal: coal matches coal.` : 'Not one lump of coal.'),
    prompt: 'Three matches to Twelfth Night. Hold the moon to see the other side, and take pairs that match on both sides.',
    moon: "Hold to see Twelfth Night's side (or hold Space)",
    score: { night: 'Twelfth Night', day: 'Twelfth Night', souls: 'Lumps of coal', none: 'no coal' },
    ring: () => 'drums',
  },
  newyear: {
    ahead: (n) => `🕛 <b>${n}</b> to midnight`,
    after: () => '🎆 New Year',
    soul: '😴',
    soulsAhead: 'Sleepyheads if the tiles turned over now',
    soulsWoke: 'Sleepyheads on the board',
    turned: () => 'Happy New Year! The ball lands, the clock strikes twelve, and the tiles turn over.',
    woke: (n) => (n ? `${n} ${n === 1 ? 'tile' : 'tiles'} missed midnight, fast asleep: sleepyheads match each other.` : 'Everyone made it to midnight.'),
    prompt: "Three matches to midnight. Hold the moon to see the new year's side, and take pairs that match on both sides.",
    moon: "Hold to see the new year's side (or hold Space)",
    score: { night: 'Midnight', day: 'Midnight', souls: 'Sleepyheads', none: 'everyone awake' },
    ring: () => 'newYear',
    fireworks: true,
  },
  question: {
    ahead: (n) => `💍 <b>${n}</b> to the question`,
    after: () => '💍 Be mine?',
    soul: '💔',
    soulsAhead: 'Broken hearts if the tiles turned over now',
    soulsWoke: 'Broken hearts on the board',
    turned: () => 'The question is popped: will you be mine? The tiles turn over.',
    woke: (n) => (n ? `${n} ${n === 1 ? 'heart breaks' : 'hearts break'}: broken hearts match each other.` : 'Not one broken heart.'),
    prompt: 'Three matches to the question. Hold the moon to see the other side coming, and take pairs that match on both sides.',
    moon: 'Hold to see the other side (or hold Space)',
    score: { night: 'The answer is yes,', day: 'The answer is yes,', souls: 'Broken hearts', none: 'no broken hearts' },
    ring: () => 'question',
  },
  may: {
    ahead: (n) => `🌸 <b>${n}</b> to May`,
    after: () => '🌸 May Day',
    soul: '🥀',
    soulsAhead: 'Wilted flowers if the tiles turned over now',
    soulsWoke: 'Wilted flowers on the board',
    turned: () => 'May morning! April turns to May, and the tiles turn over.',
    woke: (n) => (n ? `${n} ${n === 1 ? 'flower wilts' : 'flowers wilt'}: wilted flowers match each other.` : 'Not one flower wilted.'),
    prompt: "Three matches to May. Hold the moon to see May's side coming, and take pairs that match on both sides.",
    moon: "Hold to see May's side (or hold Space)",
    score: { night: 'May Day', day: 'May Day', souls: 'Wilted flowers', none: 'no wilted flowers' },
    ring: () => 'mayDay',
  },
  forecast: {
    ahead: (n) => `⛅ <b>${n}</b> to the forecast`,
    after: () => '⛅ the forecast',
    soul: '👤',
    soulsAhead: 'Shadows if the tiles turned over now',
    soulsWoke: 'Shadows on the board',
    turned: () => 'The groundhog comes out to look for his shadow, and the tiles turn over.',
    woke: (n) => (n ? `${n} ${n === 1 ? 'shadow falls' : 'shadows fall'}: shadows match each other.` : 'Not one shadow: an early spring.'),
    prompt: 'Three matches to the forecast. Hold the moon to see the other side coming, and take pairs that match on both sides.',
    moon: 'Hold to see the other side (or hold Space)',
    score: { night: 'The forecast', day: 'The forecast', souls: 'Shadows', none: 'no shadows' },
    ring: () => 'sunrise',
  },
};

// The turning over each holiday's tiles are told in, on a board outside
// its own that turns over.
const TURN_OF = { halloween: 'midnight', thanksgiving: 'sundown', christmas: 'twelfth', 'new-year': 'newyear', groundhog: 'forecast', valentines: 'question' };

// The words a board outside the holidays' own is told in: those of the
// tiles it wears, or Halloween's for tiles with none of their own.
export const wordsOf = (faces) => ({
  treatSet: GIFTS[faces] ? faces : 'halloween',
  turnSet: TURN_OF[faces] || 'midnight',
});
