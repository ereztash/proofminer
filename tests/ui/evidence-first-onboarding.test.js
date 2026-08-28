/**
 * The one walk this patch exists to make possible: material in, First Light
 * out, and nothing asked in between.
 *
 * Its own file, one walk — see the note in `./mount.js`.
 *
 * **The audit finding this pins.** The brief that motivated the change said the
 * three pre-analysis questions had to stop *blocking* First Light. They never
 * blocked it: `readColdProfile` requires only the situation radio and reads
 * every other field with a fallback, and the file said so in a comment. The
 * defect was that they were rendered *above* the paste box, so the person who
 * arrived holding material had to scroll past a self-rating and two boxes
 * asking them to produce the very sentence they came unable to produce.
 *
 * A test that only asserted "reaching First Light is possible without them"
 * would therefore have passed before the change as well as after it, and would
 * have proved that the patch was unnecessary rather than that it worked. So
 * this walk asserts the two things that were actually false yesterday: the
 * questions are **not on the page** until somebody opens them, and the second
 * route is offered at the same weight as the first.
 */

import { describe, expect, it } from 'vitest';
import { mountApp } from '../../src/ui/app.js';
import heBundle from '../../src/i18n/he.js';
import { check, click, set } from './mount.js';

/** Concrete enough to clear the bar, so the walk reaches the reveal branch. */
const MATERIAL =
  'ב-2025 ניהלתי צוות תפעול של שמונה אנשים. בנינו תהליך עבודה חדש, וזמן ' +
  'האספקה ירד מ-19 יום ל-7 ימים בתוך חודשיים.';

describe('material first, questions later', () => {
  it('reaches First Light on material alone, with the questions folded away', () => {
    localStorage.clear();
    document.body.innerHTML = '<div id="app"></div>';
    const root = document.querySelector('#app');
    mountApp(root);

    check(root, 'input[name="situation"][value="consultant"]');

    // The questions exist — nothing was deleted from the model — but they are
    // behind a closed disclosure, so they are not work the visitor must pass.
    const folded = root.querySelector('#fit-claim')?.closest('details');
    expect(folded, 'the optional questions should live inside a disclosure').not.toBeNull();
    expect(folded.hasAttribute('open')).toBe(false);
    expect(folded.querySelector('#fit-evidence')).not.toBeNull();

    // The self-rating is gone from the screen entirely, not folded. It was
    // written to `profile.fitConfidence` and read by nothing: the use it was
    // collected for — setting a self-report against L1's measured band — is
    // refused on the record in `core/schema.js`, because it reverses the
    // product's emotional direction. The schema field stays so old saves load;
    // asking for the number does not.
    expect(root.querySelector('#fit-confidence'), 'the dead self-rating should not be on screen').toBeNull();

    // And the paste box is not inside it.
    expect(root.querySelector('#cold-paste').closest('details')).toBeNull();

    // Both routes are offered, and the second is not a ghost.
    const recall = root.querySelector('[data-act="coldRecall"]');
    expect(recall).not.toBeNull();
    expect(recall.className).toContain('btn--secondary');

    set(root, 'cold-paste', MATERIAL);
    click(root, 'coldStart');

    // First Light, with no claim and no expected evidence ever entered.
    expect(root.innerHTML).toContain(heBundle.firstLight.threeTitle);

    // The comparison card is what expected-evidence feeds. Skipping the
    // question costs that card and nothing else — it must not appear empty,
    // half-rendered, or asserting a match against a blank.
    expect(root.querySelector('.expected')).toBeNull();
  });
});
