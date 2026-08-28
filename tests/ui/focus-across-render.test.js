/**
 * Focus survives the re-render — including on the one control that had no way
 * to be found again.
 *
 * Its own file, one walk — see the note in `./mount.js`.
 *
 * **The defect, found in a real browser and not in this suite.** A keyboard
 * walk against a preview build of `main` showed focus dropping to `<body>` the
 * moment the visitor chose a situation with the space bar. `render()` already
 * restores focus and does it carefully: fields come back by `id`, buttons by
 * `data-act` plus the payload they carry, with a fallback that keeps a keyboard
 * user inside the list when the element they were on has been destroyed.
 *
 * The situation and weeks radios are the only controls in the application that
 * carry **neither an `id` nor a `data-act`** — they are `<input type="radio">`
 * identified by `name` and `value` inside a wrapping label. So `activeId` and
 * `activeAct` were both undefined, `restored` was null, and the fallback
 * returns null by its own first line when there is nothing to match on. Focus
 * fell through to the document.
 *
 * It is the *first* interaction a keyboard user has with this product, on the
 * screen the whole product hangs on.
 *
 * Which of these fail against the previous implementation:
 *
 *   FAILS BEFORE — the reason this file exists
 *     1. the situation radio keeps focus after it is chosen
 *
 *   PASSED BEFORE — guards on the restoration that already worked, so that a
 *   change to that block cannot quietly cost what it already had
 *     2. a text field keeps focus and its caret
 *     3. a button is restored by identity, not by position, across a re-render
 *        that reorders the list under it
 */

import { describe, expect, it } from 'vitest';
import { mountApp } from '../../src/ui/app.js';
import { check, click, set } from './mount.js';

/** Enough distinct units that pinning one actually re-sorts the list. */
const MATERIAL = [
  'ב-2025 ניהלתי צוות תפעול של שמונה אנשים. בנינו תהליך עבודה חדש, וזמן האספקה ירד מ-19 יום ל-7 ימים בתוך חודשיים.',
  'מנהל התפעול כתב: "בזכותך עמדנו ביעד הרבעוני בפעם הראשונה מזה שנתיים."',
  'בשנת 2024 הקטנתי את אחוז הנטישה מ-12% ל-4% בתוך חצי שנה אצל לקוח בתחום הביטוח.',
  'הובלתי פרויקט הטמעה שנמשך תשעה חודשים מול ארבעה בעלי עניין בארגון.',
].join('\n');

describe('a re-render does not throw a keyboard user back to the top', () => {
  it('keeps focus on the controls it re-renders under', () => {
    localStorage.clear();
    document.body.innerHTML = '<div id="app"></div>';
    const root = document.querySelector('#app');
    mountApp(root);

    // 1 — FAILS BEFORE. Choosing a situation re-renders the whole screen,
    // because the paste box below only exists once a situation is chosen.
    const radio = root.querySelector('input[name="situation"][value="consultant"]');
    radio.focus();
    expect(document.activeElement).toBe(radio);
    check(root, 'input[name="situation"][value="consultant"]');

    const afterRadio = document.activeElement;
    expect(afterRadio, 'focus fell through to the document').not.toBe(document.body);
    expect(afterRadio.getAttribute('name')).toBe('situation');
    expect(afterRadio.getAttribute('value')).toBe('consultant');
    // Still the *checked* one, not merely something in the group.
    expect(afterRadio.checked).toBe(true);

    // 2 — GUARD. Fields were already restored by id, with the caret.
    const paste = root.querySelector('#cold-paste');
    paste.focus();
    set(root, 'cold-paste', MATERIAL);
    expect(document.activeElement.id, 'the paste box lost focus mid-typing').toBe('cold-paste');

    click(root, 'coldStart');

    // 3 — GUARD, and the one worth pinning: pinning a proof re-sorts the list,
    // so a restoration that worked by position would land the user on a
    // different proof's button while looking correct.
    click(root, 'firstLightDone');
    click(root, 'goto', { view: 'inventory' });

    const pins = [...root.querySelectorAll('[data-act="pin"]')];
    expect(pins.length, 'the walk needs at least two proofs to reorder').toBeGreaterThan(1);
    const last = pins[pins.length - 1];
    const targetId = last.dataset.id;
    last.focus();
    last.click();

    const afterPin = document.activeElement;
    expect(afterPin.dataset.act).toBe('pin');
    expect(afterPin.dataset.id, 'focus landed on a different proof after the re-sort').toBe(targetId);
  });
});
