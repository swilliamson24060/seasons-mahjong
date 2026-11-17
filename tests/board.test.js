import { test, check, equal } from './run.js';
import { tileFit } from '../js/ui/board.js';
import { TURTLE, UPRIGHT_TURTLE, PUMPKIN, GROUNDHOG } from '../js/engine/layouts.js';

// The space the board has on a phone held upright, in its browser, between
// the bars: 384 by 720, as on a Galaxy S25+, less the bars' 135. And on a
// laptop.
const PHONE = [384, 585];
const LAPTOP = [1280, 640];

test('on a phone held upright, a board nine tiles across fills its width, its tiles 40px wide', () => {
  equal(tileFit(PUMPKIN, ...PHONE), 40, 'the pumpkin');
  equal(tileFit(GROUNDHOG, ...PHONE), 35, 'the groundhog, twelve down, fills its height');
});

test("on a phone held upright, the upright turtle's tiles are much bigger than the classic's, and on a laptop smaller", () => {
  equal(tileFit(TURTLE, ...PHONE), 24, 'the classic, on a phone');
  equal(tileFit(UPRIGHT_TURTLE, ...PHONE), 39, 'the upright turtle, on a phone');
  check(tileFit(TURTLE, ...LAPTOP) > tileFit(UPRIGHT_TURTLE, ...LAPTOP), "on a laptop, the classic's are the bigger");
});

test('tiles are drawn no wider than 88px, nor narrower than 16px', () => {
  equal(tileFit(PUMPKIN, 3000, 3000), 88, 'on a big screen');
  equal(tileFit(TURTLE, 100, 100), 16, 'in a small space');
});
