// New Year's ball on its pole, for the countdown's card: it drops a notch
// with each board of the countdown cleared, ten notches from the top of the
// pole, and lands at midnight on the 1, lighting the new year's sign below.

const TOP = 14; // where the ball's middle sits before the countdown begins,
const STEP = 8.2; // and how far it drops a notch
export const NOTCHES = 10;

// Where the ball's middle sits, so many notches down.
export const ballAt = (notch) => TOP + Math.max(0, Math.min(NOTCHES, notch)) * STEP;

// The words for the ball, so many notches down, or landed, and the year it
// lands on.
export function ballWords(notch, landed, year) {
  if (landed) return `The ball has landed: happy ${year}!`;
  const left = NOTCHES - notch;
  return `The ball, ${left} ${left === 1 ? 'notch' : 'notches'} from landing at midnight`;
}

// The ball on its pole, so many notches down, or landed, as an SVG: a
// crystal ball, faceted and glinting, and golden once it has landed, and
// the year's sign beneath, lit once it has.
export function ballDrop(notch, landed, year) {
  const y = landed ? ballAt(NOTCHES) : ballAt(notch);
  const foot = ballAt(NOTCHES) + 4;
  const ticks = Array.from({ length: NOTCHES + 1 }, (_, k) => `M22 ${ballAt(k).toFixed(1)}h12`).join('');
  const glass = landed ? ['#fffbea', '#ffe28a', '#e0a526', '#8a5a0c'] : ['#ffffff', '#d6e6ff', '#7a95dc', '#2f3f86'];
  return (
    `<svg viewBox="0 0 56 130" role="img" aria-label="${ballWords(notch, landed, year)}">` +
    `<defs><radialGradient id="ball-glass" cx="0.36" cy="0.32" r="0.75">${glass.map((c, k) => `<stop offset="${[0, 0.28, 0.7, 1][k]}" stop-color="${c}"/>`).join('')}</radialGradient>` +
    `<clipPath id="ball-clip"><circle cx="28" cy="${y.toFixed(1)}" r="10"/></clipPath></defs>` +
    `<rect x="26.6" y="3" width="2.8" height="${foot - 3}" rx="1.4" fill="#9aa3c7"/>` +
    `<path d="${ticks}" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>` +
    (landed ? `<circle cx="28" cy="${y.toFixed(1)}" r="15" fill="rgba(255,214,90,0.28)"/>` : '') +
    `<circle cx="28" cy="${y.toFixed(1)}" r="10" fill="url(#ball-glass)" stroke="rgba(255,255,255,0.85)" stroke-width="0.8"/>` +
    `<g clip-path="url(#ball-clip)" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="0.6">` +
    `<ellipse cx="28" cy="${y.toFixed(1)}" rx="4" ry="10"/><ellipse cx="28" cy="${y.toFixed(1)}" rx="8" ry="10"/>` +
    `<path d="M18 ${(y - 5).toFixed(1)}h20M17 ${y.toFixed(1)}h22M18 ${(y + 5).toFixed(1)}h20"/></g>` +
    `<path d="M23.5 ${(y - 6).toFixed(1)}l1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1z" fill="#fff"/>` +
    `<rect x="8" y="${foot + 6}" width="40" height="17" rx="4" fill="${landed ? '#3a2a08' : 'rgba(255,255,255,0.06)'}" stroke="${landed ? '#ffd54a' : 'rgba(255,255,255,0.18)'}"/>` +
    `<text x="28" y="${foot + 18.5}" text-anchor="middle" font-size="12" font-weight="700" font-family="system-ui, sans-serif" fill="${landed ? '#ffd54a' : 'rgba(255,255,255,0.35)'}">${year}</text>` +
    '</svg>'
  );
}
