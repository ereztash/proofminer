/**
 * Text colours against the surfaces they sit on.
 *
 * Found by measuring the built page in Chromium at 1280px in both colour
 * schemes, which is the only place this can be measured properly — jsdom does
 * not compute colour. **Five text styles on First Light were below WCAG AA**,
 * all of them small text, all of them using one token:
 *
 * | | light | dark |
 * |---|---|---|
 * | `.proof-card__eyebrow`, `.score__band`, the definition terms | 3.33 | 4.44 |
 * | `.expected__caveat` | 3.03 | passed |
 *
 * AA asks 4.5:1 for text under 18.66px bold or 24px regular, and every one of
 * these is between 11 and 13px. First Light is the screen every first-time
 * user sees.
 *
 * `--ink-faint` was darkened for light and lightened for dark, and the light
 * value was set twice: the first attempt cleared `--surface` at 4.70 and still
 * read 4.28 inside `.expected__cell`, whose background is tinted. **A token has
 * to be set for the worst background it sits on, not the commonest.** After the
 * second: zero failures in both schemes on both screens.
 *
 * **What this test covers and what it cannot.** It reads the declared tokens
 * out of the stylesheet and checks every ink against every surface, in both
 * schemes. It cannot see a composed background — a tint layered over a surface,
 * an image, a gradient — because that needs a rendering engine. The browser
 * measurement is the instrument for those; this is the tripwire that catches a
 * token being lightened back.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Resolved from the working directory rather than `import.meta.url`: this file
// runs in the jsdom project, where `import.meta.url` is not a file URL.
const CSS = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');

/** WCAG relative luminance, from the sRGB definition. */
function luminance(hex) {
  const channels = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255);
  const linear = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * The tokens as declared in each scheme. The light block is `:root`; the dark
 * block is whatever redefines them afterwards, and reading it this way means
 * the test breaks if the file stops having two blocks rather than silently
 * checking the light values twice.
 */
function tokens() {
  const blocks = CSS.split(/@media[^{]*prefers-color-scheme:\s*dark/u);
  expect(blocks.length, 'style.css no longer has a dark-scheme block').toBeGreaterThan(1);
  const read = (source) => {
    const found = {};
    for (const [, name, value] of source.matchAll(/--(ink|ink-soft|ink-faint|paper|surface):\s*(#[0-9a-f]{6})/giu)) {
      if (!(name in found)) found[name] = value;
    }
    return found;
  };
  return { light: read(blocks[0]), dark: read(blocks[1]) };
}

const INKS = ['ink', 'ink-soft', 'ink-faint'];
const SURFACES = ['paper', 'surface'];
const AA_NORMAL = 4.5;

describe('declared text colours against declared surfaces', () => {
  const declared = tokens();

  for (const scheme of ['light', 'dark']) {
    for (const ink of INKS) {
      for (const surface of SURFACES) {
        it(`${scheme}: --${ink} on --${surface} clears WCAG AA for small text`, () => {
          const values = declared[scheme];
          expect(values[ink], `--${ink} missing from the ${scheme} block`).toBeTruthy();
          expect(values[surface], `--${surface} missing from the ${scheme} block`).toBeTruthy();
          const ratio = contrast(values[ink], values[surface]);
          // Reported to two places so a failure says how far off it is, which
          // is the difference between a token nudge and a redesign.
          expect(
            Number(ratio.toFixed(2)),
            `--${ink} on --${surface} in ${scheme} is ${ratio.toFixed(2)}:1`,
          ).toBeGreaterThanOrEqual(AA_NORMAL);
        });
      }
    }
  }

  it('is a tripwire and not the instrument, and says so', () => {
    // Guarding against the way this test could quietly stop meaning anything:
    // somebody adds a third scheme, or moves the inks out of the token block.
    // Neither is caught by the ratios above.
    expect(Object.keys(declared.light)).toEqual(expect.arrayContaining([...INKS, ...SURFACES]));
    expect(Object.keys(declared.dark)).toEqual(expect.arrayContaining([...INKS, ...SURFACES]));
  });
});
