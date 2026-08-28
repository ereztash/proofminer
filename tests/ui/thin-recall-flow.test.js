/**
 * The dead end on First Light, walked end to end through the real app.
 *
 * Its own file, not a third `describe` beside the other two walks — see the
 * note in `./mount.js`.
 *
 * The claim: someone who *did* paste, and whose material yielded nothing, is
 * the same person as the one who arrived with nothing to paste. They just did
 * not know yet that the file they had was not the one that counts. Until this
 * route existed, First Light told them to bring a client email, a project
 * write-up or a reference, and handed them one button — back to the paste box
 * they had come from. If those documents do not exist, that instruction is a
 * loop, and this is the audience most likely to be inside it.
 *
 * So the walk checks the whole way out: the second door is on the screen, it
 * lands on an *opened* recall room rather than a collapsed one, and — the part
 * that matters most — the reveal is postponed rather than spent. The person who
 * takes this exit has not seen First Light. They have seen the screen that says
 * there is nothing yet to reveal, which is its opposite, and they are still
 * owed the real one when their material arrives.
 */

import { describe, expect, it } from 'vitest';
import { mountApp } from '../../src/ui/app.js';
import { computeAuthority } from '../../src/engine/authority.js';
import { loadState } from '../../src/core/store.js';
import heBundle from '../../src/i18n/he.js';
import { check, click, flush, set } from './mount.js';

const persisted = () => {
  flush();
  return loadState(localStorage);
};

/**
 * Edited profile prose: roles and adjectives, and not one line naming who,
 * when, or what changed. This is what a CV actually looks like after the
 * checkable lines have been polished out of it, and it is the commonest first
 * paste there is.
 */
const EDITED_PROSE =
  'יועץ תהליכים עם ניסיון רב בעבודה מול הנהלות. מתמחה בשיפור תהליכי עבודה, ' +
  'בהובלת שינוי ארגוני ובליווי צוותים. בעל יכולת אנליטית גבוהה, תודעת שירות ' +
  'ויכולת עבודה בסביבה דינמית. שולט בעברית ובאנגלית ברמת שפת אם.';

describe('someone whose material yielded nothing', () => {
  it('is offered the errand, and is still owed the reveal', () => {
    localStorage.clear();
    document.body.innerHTML = '<div id="app"></div>';
    const root = document.querySelector('#app');
    mountApp(root);

    check(root, 'input[name="situation"][value="consultant"]');
    set(root, 'cold-paste', EDITED_PROSE);
    click(root, 'coldStart');

    // Precondition for the whole test: this paste really did land on a dead end,
    // and specifically the thin one — rows came back, none of them clearing the
    // bar. That is the harder of the two cases and the one that was silently
    // broken, because sub-band rows look like evidence to everything that only
    // counts proofs. (The empty branch renders the same bridge.) If the miner
    // ever gets good enough to pull a usable proof out of prose like this, that
    // is a different screen and a different test.
    expect(root.innerHTML).toContain(heBundle.firstLight.thinTitle);
    expect(root.innerHTML).toMatch(/cold__bridge/);

    let state = persisted();
    expect(state.sources).toHaveLength(1);
    expect(state.proofs.length).toBeGreaterThan(0);
    expect(state.proofs.every((p) => p.score < 45)).toBe(true);
    expect(state.profile.sawFirstLight).toBe(false);

    // The second door. Before this existed the only button on this screen led
    // back to the paste box.
    click(root, 'gotoRecall');

    // Landed on the recall room, and it is open. Routing someone to a
    // collapsed `<details>` and letting them hunt for it undoes the routing.
    const details = root.querySelector('details.recall');
    expect(details).not.toBeNull();
    expect(details.hasAttribute('open')).toBe(true);

    const before = { proofs: state.proofs, authority: computeAuthority(state) };

    set(root, 'recall-project', 'הטמעת תהליך התפעול באלפא לוגיסטיקה');
    set(root, 'recall-room', 'רונית לוי\nדוד כהן');
    click(root, 'saveRecall');

    state = persisted();
    expect(state.retrievals.map((r) => r.recipient)).toEqual(['רונית לוי', 'דוד כהן']);
    // Same refusal the recall route rests on: remembered material is an errand,
    // never evidence. Two names and a project written down move nothing at all.
    expect(state.proofs).toEqual(before.proofs);
    expect(computeAuthority(state)).toEqual(before.authority);

    // The errands are the thing on the screen now, so the form that made them
    // folds away again.
    expect(root.querySelector('details.recall').hasAttribute('open')).toBe(false);

    // The reveal is still unspent. This is the point of the whole exit: they
    // did not see First Light, they saw the screen that says there is nothing
    // yet to see.
    expect(persisted().profile.sawFirstLight).toBe(false);

    // What comes back from Ronit is a document, and it enters the way every
    // other document does — and only now does the reveal they were owed fire.
    set(
      root,
      'paste',
      'ב-2025 קיצרתי אצל אלפא לוגיסטיקה את זמן האספקה מ-19 יום ל-7 ימים.',
    );
    click(root, 'addText');
    click(root, 'mine');

    state = persisted();
    expect(state.proofs.some((p) => p.score >= 45)).toBe(true);
    expect(computeAuthority(state).foundation).toBeGreaterThan(before.authority.foundation);

    // The real one this time, not the thin screen again. Reading the sub-band
    // rows as evidence used to cancel this: `mine` saw proofs already on file,
    // decided the reveal had been had, and dropped them on the inventory.
    expect(root.innerHTML).toContain('cold--reveal');
    expect(root.querySelector('.proof-card__source'), 'the walk should land on the reveal').not.toBeNull();
    expect(root.innerHTML).not.toContain(heBundle.firstLight.thinTitle);
  });
});
