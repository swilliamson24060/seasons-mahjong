// The sounds, made as they play with Web Audio, so there are no files to
// fetch: a wooden tock for a tile, a pipe organ that plays the opening of
// Bach's Toccata and Fugue in D minor a note for each match, the clock
// striking twelve at midnight, chimes at sunrise and for treats, and a
// rustle for a shuffle. Browsers let sound start only after a tap or a key,
// so nothing is made until then.

// The opening, a note for each match: the mordent on A and its run down to
// D, three times, an octave lower each time.
const TOCCATA = [81, 79, 81, 79, 77, 76, 74, 73, 74, 69, 67, 69, 64, 65, 61, 62, 57, 55, 57, 55, 53, 52, 50, 49, 50];

// The opening as it is played, for a cleared board: [note, beats], 0 a rest.
const OPENING = [
  [81, 0.25], [79, 0.25], [81, 1.5], [0, 0.5],
  [79, 0.25], [77, 0.25], [76, 0.25], [74, 0.25], [73, 0.75], [74, 1.5], [0, 0.5],
  [69, 0.25], [67, 0.25], [69, 1.5], [0, 0.5],
  [64, 0.25], [65, 0.25], [61, 0.75], [62, 1.5], [0, 0.5],
  [57, 0.25], [55, 0.25], [57, 1.5], [0, 0.5],
  [55, 0.25], [53, 0.25], [52, 0.25], [50, 0.25], [49, 0.75], [50, 1],
];

const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);

export class Sound {
  constructor() {
    this.ctx = null;
    this.next = 0; // the next note of the Toccata
    try {
      this.muted = localStorage.getItem('seasons.sound') === 'off';
    } catch {
      this.muted = false;
    }
    const wake = () => this.start();
    addEventListener('pointerdown', wake, { once: true, capture: true });
    addEventListener('keydown', wake, { once: true, capture: true });
  }

  start() {
    if (this.ctx) return;
    const ctx = (this.ctx = new (window.AudioContext || window.webkitAudioContext)());
    this.master = ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.8;
    this.master.connect(ctx.destination);
    // A stone room for the organ and the bells to ring in.
    this.room = ctx.createConvolver();
    this.room.buffer = this.echo(2.8, 3.2);
    const wet = ctx.createGain();
    wet.gain.value = 0.35;
    this.room.connect(wet).connect(this.master);
    this.bus = ctx.createGain();
    this.bus.connect(this.master);
    this.bus.connect(this.room);
    this.noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  setMuted(muted) {
    this.muted = muted;
    try {
      localStorage.setItem('seasons.sound', muted ? 'off' : 'on');
    } catch {}
    if (this.ctx) this.master.gain.setTargetAtTime(muted ? 0 : 0.8, this.ctx.currentTime, 0.05);
  }

  // A room's echo: noise dying away, a little different in each ear.
  echo(seconds, fall) {
    const rate = this.ctx.sampleRate;
    const n = Math.floor(rate * seconds);
    const buf = this.ctx.createBuffer(2, n, rate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n) ** fall;
    }
    return buf;
  }

  // Can sound be made now? Not before the first tap, nor while muted.
  get on() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return Boolean(this.ctx) && !this.muted;
  }

  get now() {
    return this.ctx.currentTime;
  }

  // A tone that dies away: the building block of most of what follows.
  ping(f, at, { type = 'sine', gain = 0.2, attack = 0.004, fall = 0.4, into = this.bus } = {}) {
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.value = f;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(gain, at + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, at + attack + fall);
    o.connect(g).connect(into);
    o.start(at);
    o.stop(at + attack + fall + 0.05);
  }

  // A note on a pipe organ: a few pipes sounding together, held, then let go.
  organ(midi, at, length, gain = 0.16) {
    const out = this.ctx.createGain();
    out.gain.setValueAtTime(0, at);
    out.gain.linearRampToValueAtTime(gain, at + 0.03);
    out.gain.setValueAtTime(gain, at + length);
    out.gain.exponentialRampToValueAtTime(0.0001, at + length + 0.4);
    out.connect(this.bus);
    for (const [k, a] of [[1, 1], [2, 0.55], [3, 0.3], [4, 0.22], [6, 0.1], [8, 0.07]]) {
      const o = this.ctx.createOscillator();
      o.frequency.value = hz(midi) * k;
      const g = this.ctx.createGain();
      g.gain.value = a / 2.3;
      o.connect(g).connect(out);
      o.start(at);
      o.stop(at + length + 0.45);
    }
  }

  // A bell: partials that are not quite in tune with each other, ringing long.
  bell(f, at, gain = 0.2, ring = 3) {
    for (const [k, a] of [[0.5, 0.5], [1, 1], [1.19, 0.45], [1.56, 0.35], [2, 0.3], [2.51, 0.2], [2.66, 0.18], [3.01, 0.12]]) {
      this.ping(f * k, at, { gain: gain * a, attack: 0.002, fall: ring / Math.sqrt(k) });
    }
  }

  // Noise through a moving filter: a rustle or a swish.
  rustle(at, length = 0.35, from = 800, to = 3000, gain = 0.12) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.Q.value = 1.2;
    f.frequency.setValueAtTime(from, at);
    f.frequency.exponentialRampToValueAtTime(to, at + length);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(gain, at + length * 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, at + length);
    src.connect(f).connect(g).connect(this.master);
    src.start(at);
    src.stop(at + length + 0.05);
  }

  // ------------------------------------------------- what the game asks for

  select() {
    if (this.on) this.ping(720, this.now, { type: 'triangle', gain: 0.1, fall: 0.06, into: this.master });
  }

  blocked() {
    if (this.on) this.ping(150, this.now, { type: 'sine', gain: 0.18, fall: 0.12, into: this.master });
  }

  match() {
    if (!this.on) return;
    this.organ(TOCCATA[this.next % TOCCATA.length], this.now, 0.38);
    this.next++;
  }

  undo() {
    if (this.on) this.rustle(this.now, 0.22, 2400, 700, 0.08);
  }

  shuffle() {
    if (!this.on) return;
    for (let k = 0; k < 3; k++) this.rustle(this.now + k * 0.09, 0.3, 600, 3200, 0.1);
  }

  hint() {
    if (!this.on) return;
    this.ping(1318.5, this.now, { gain: 0.06, fall: 0.5 });
    this.ping(1975.5, this.now + 0.09, { gain: 0.05, fall: 0.6 });
  }

  treat() {
    if (!this.on) return;
    [1318.5, 1661.2, 1975.5, 2637].forEach((f, k) => this.ping(f, this.now + k * 0.07, { gain: 0.08, fall: 0.5 }));
  }

  // Sundown on the second Sunday: the alarm clock rings for Monday.
  alarm() {
    if (!this.on) return;
    for (let k = 0; k < 14; k++) this.bell(k % 2 ? 1568 : 1760, this.now + k * 0.07, 0.05, 0.5);
  }

  // A touchdown: the crowd roars, and the band plays.
  touchdown() {
    if (!this.on) return;
    this.rustle(this.now, 1.1, 1200, 3600, 0.1);
    [60, 64, 67, 72].forEach((note, k) => this.organ(note, this.now + 0.1 + k * 0.12, 0.5, 0.09));
  }

  // A pair of lovebirds: a turtle dove's coo, twice.
  coo() {
    if (!this.on) return;
    [[440, 0], [370, 0.2], [440, 0.5], [370, 0.7]].forEach(([f, t]) => this.ping(f, this.now + t, { gain: 0.08, attack: 0.03, fall: 0.22 }));
  }

  // Birds of a feather flocking together: a flutter of wings, and a chirp.
  flutter() {
    if (!this.on) return;
    for (let k = 0; k < 3; k++) this.rustle(this.now + k * 0.06, 0.07, 2600, 1300, 0.06);
    this.ping(3520, this.now + 0.22, { gain: 0.04, fall: 0.06 });
    this.ping(4186, this.now + 0.28, { gain: 0.035, fall: 0.07 });
  }

  // A ring turning to gold: bright bells, rising, and a glint.
  ring() {
    if (!this.on) return;
    [1568, 1975.5, 2349.3].forEach((f, k) => this.bell(f, this.now + k * 0.08, 0.05, 1.8));
    this.ping(4186, this.now + 0.32, { gain: 0.03, fall: 0.25 });
  }

  // A line of goslings: their mother's honk, twice.
  honk() {
    if (!this.on) return;
    [[370, 0], [330, 0.24]].forEach(([f, t]) => {
      this.ping(f, this.now + t, { type: 'sawtooth', gain: 0.045, attack: 0.02, fall: 0.17 });
      this.ping(f * 1.5, this.now + t, { type: 'square', gain: 0.015, attack: 0.02, fall: 0.14 });
    });
  }

  // A swan and her reflection: a harp's run, gliding up.
  swan() {
    if (!this.on) return;
    [587.3, 740, 880, 1174.7, 1480].forEach((f, k) => this.ping(f, this.now + k * 0.06, { type: 'triangle', gain: 0.05, fall: 0.7 }));
  }

  // A swan swimming off: a ripple on the water.
  ripple() {
    if (!this.on) return;
    this.rustle(this.now, 0.4, 500, 1400, 0.05);
    this.ping(392, this.now + 0.05, { gain: 0.04, fall: 0.3 });
  }

  // A pail of fresh milk: a splash into the churn, and the maid's bell.
  milk() {
    if (!this.on) return;
    this.rustle(this.now, 0.25, 700, 2200, 0.06);
    this.bell(1318.5, this.now + 0.12, 0.05, 1.2);
  }

  // A pail gone sour: a falling sigh.
  sour() {
    if (!this.on) return;
    [[311.1, 0], [261.6, 0.22]].forEach(([f, t]) => this.ping(f, this.now + t, { type: 'triangle', gain: 0.07, attack: 0.03, fall: 0.35 }));
  }

  // The music changes: a bar of a waltz, oom-pah-pah, twice.
  waltz() {
    if (!this.on) return;
    [[196, 0.16], [392, 0.07], [493.9, 0.07], [220, 0.16], [440, 0.07], [523.3, 0.07]].forEach(([f, gain], k) =>
      this.ping(f, this.now + k * 0.17, { type: 'triangle', gain, fall: k % 3 ? 0.18 : 0.32 }),
    );
    this.bell(1568, this.now + 1.02, 0.05, 1.2);
  }

  // Twelfth Night: twelve drummers drumming, a roll and twelve beats.
  drums() {
    if (!this.on) return;
    for (let k = 0; k < 12; k++) {
      const at = this.now + k * 0.15;
      this.ping(k % 4 ? 90 : 70, at, { type: 'sine', gain: k % 4 ? 0.14 : 0.22, attack: 0.002, fall: 0.18, into: this.master });
      this.rustle(at, 0.07, 1800, 900, k % 4 ? 0.05 : 0.08);
    }
    this.bell(784, this.now + 12 * 0.15, 0.06, 1.6);
  }

  // A piper playing: the drone, and a skirl of the chanter over it.
  bagpipe() {
    if (!this.on) return;
    this.ping(110, this.now, { type: 'sawtooth', gain: 0.03, attack: 0.08, fall: 1.4 });
    this.ping(220, this.now, { type: 'sawtooth', gain: 0.02, attack: 0.08, fall: 1.4 });
    [880, 987.8, 1108.7, 1318.5, 1108.7, 1318.5].forEach((f, k) => this.ping(f, this.now + 0.1 + k * 0.11, { type: 'square', gain: 0.025, attack: 0.01, fall: 0.12 }));
  }

  // A lord leaping out: a trumpet call, rising.
  fanfare() {
    if (!this.on) return;
    [[67, 0, 0.12], [67, 0.14, 0.08], [72, 0.24, 0.12], [76, 0.38, 0.12], [79, 0.52, 0.4]].forEach(([note, at, length]) => this.organ(note, this.now + at, length, 0.09));
  }

  // An egg hatching: a chick's cheep, twice.
  cheep() {
    if (!this.on) return;
    [[2794, 0], [3136, 0.06], [2794, 0.2], [3322, 0.26]].forEach(([f, t]) => this.ping(f, this.now + t, { gain: 0.045, fall: 0.07 }));
  }

  // Another shopper grabbing a doorbuster: a quick snatch.
  grab() {
    if (!this.on) return;
    this.rustle(this.now, 0.22, 3200, 500, 0.1);
  }

  // A tile put in the fridge: the door shutting.
  save() {
    if (!this.on) return;
    this.ping(110, this.now, { type: 'sine', gain: 0.2, fall: 0.18, into: this.master });
    this.rustle(this.now, 0.12, 900, 300, 0.05);
  }

  // Everyone dozes off after the feast, and wakes again.
  nap() {
    if (!this.on) return;
    [392, 329.6, 261.6].forEach((f, k) => this.ping(f, this.now + k * 0.35, { gain: 0.07, fall: 0.9 }));
  }

  wake() {
    if (!this.on) return;
    [523.3, 659.3, 784, 1046.5].forEach((f, k) => this.ping(f, this.now + k * 0.09, { gain: 0.06, fall: 0.4 }));
  }

  // A thing crossed off the shopping list: the till's bell.
  listed() {
    if (!this.on) return;
    this.bell(1975.5, this.now, 0.07, 1.4);
    this.ping(2637, this.now + 0.06, { gain: 0.04, fall: 0.3 });
  }

  // Ice thawing: a few drips, falling.
  thaw() {
    if (!this.on) return;
    [2093, 1568, 1760].forEach((f, k) => this.ping(f, this.now + 0.12 + k * 0.11, { gain: 0.06, fall: 0.18 }));
  }

  // The clock strikes twelve.
  midnight() {
    if (!this.on) return;
    for (let k = 0; k < 12; k++) this.bell(196, this.now + k * 0.42, 0.13, 2.4);
  }

  sunrise() {
    if (!this.on) return;
    [587.3, 740, 880, 1174.7].forEach((f, k) => this.bell(f, this.now + k * 0.16, 0.08, 2));
  }

  stuck() {
    if (!this.on) return;
    this.organ(38, this.now, 1.2, 0.1);
    this.organ(45, this.now, 1.2, 0.08);
  }

  // A cleared board: the whole opening, then a chord to end on.
  win() {
    if (!this.on) return;
    const beat = 0.32;
    let at = this.now + 0.1;
    for (const [note, beats] of OPENING) {
      if (note) this.organ(note, at, beats * beat * 0.92, 0.14);
      at += beats * beat;
    }
    for (const note of [38, 50, 53, 57, 62]) this.organ(note, at, 2.2, 0.09);
    this.next = 0;
  }
}
