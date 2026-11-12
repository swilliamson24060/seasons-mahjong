// What every set of faces draws with: outlines and small dark details in
// var(--ink) and whites in var(--paper), which a night tile turns pale, so
// one drawing serves both sides; dark fills that stay dark by night; the
// style of a shape, its numbers kept short; and where the pips and the
// sticks of the suits stand.

export const INK = 'var(--ink)';
export const PAPER = 'var(--paper)';
export const DARK = '#231c2b';
export const LEAF = '#3a8f55';

export const style = (fill, stroke = 'none', width = 1.4, extra = '') =>
  `style="fill:${fill};stroke:${stroke};stroke-width:${width};stroke-linejoin:round;stroke-linecap:round${extra}"`;

export const n = (v) => +v.toFixed(2);

// Where the pips sit on a tile of two to nine, as the dots do on a dots
// tile: [x, y, size, centre], the centre one of the five and the nine
// marked, as a dots tile's is red.
export const PIPS = {
  2: [[30, 27, 11], [30, 59, 11]],
  3: [[18, 24, 9], [30, 43, 9], [42, 62, 9]],
  4: [[19, 29, 9.5], [41, 29, 9.5], [19, 57, 9.5], [41, 57, 9.5]],
  5: [[17, 26, 8.5], [43, 26, 8.5], [30, 43, 8.5, true], [17, 60, 8.5], [43, 60, 8.5]],
  6: [[20, 24, 8.5], [40, 24, 8.5], [20, 43, 8.5], [40, 43, 8.5], [20, 62, 8.5], [40, 62, 8.5]],
  7: [[18, 22, 6.5], [30, 31, 6.5], [42, 40, 6.5], [20, 55, 7], [40, 55, 7], [20, 69, 7], [40, 69, 7]],
  8: [[20, 21, 7], [40, 21, 7], [20, 37, 7], [40, 37, 7], [20, 53, 7], [40, 53, 7], [20, 69, 7], [40, 69, 7]],
  9: [[16, 24, 7], [30, 24, 7], [44, 24, 7], [16, 43, 7], [30, 43, 7, true], [44, 43, 7], [16, 62, 7], [30, 62, 7], [44, 62, 7]],
};

// Where the sticks stand, as they do on a bamboo tile: [x, y, length, width].
export const STICKS = {
  2: [[30, 28, 24, 7], [30, 58, 24, 7]],
  3: [[30, 28, 22, 7], [19, 58, 22, 7], [41, 58, 22, 7]],
  4: [[20, 28, 24, 7], [40, 28, 24, 7], [20, 58, 24, 7], [40, 58, 24, 7]],
  5: [[16, 27, 20, 6], [44, 27, 20, 6], [30, 43, 20, 6], [16, 60, 20, 6], [44, 60, 20, 6]],
  6: [[16, 29, 22, 6], [30, 29, 22, 6], [44, 29, 22, 6], [16, 59, 22, 6], [30, 59, 22, 6], [44, 59, 22, 6]],
  7: [[30, 21, 15, 6], [16, 43, 15, 6], [30, 43, 15, 6], [44, 43, 15, 6], [16, 65, 15, 6], [30, 65, 15, 6], [44, 65, 15, 6]],
  8: [[13, 31, 22, 4.6], [24.6, 31, 22, 4.6], [36.2, 31, 22, 4.6], [47.8, 31, 22, 4.6], [13, 60, 22, 4.6], [24.6, 60, 22, 4.6], [36.2, 60, 22, 4.6], [47.8, 60, 22, 4.6]],
  9: [[16, 22, 15, 6], [30, 22, 15, 6], [44, 22, 15, 6], [16, 44, 15, 6], [30, 44, 15, 6], [44, 44, 15, 6], [16, 66, 15, 6], [30, 66, 15, 6], [44, 66, 15, 6]],
};
