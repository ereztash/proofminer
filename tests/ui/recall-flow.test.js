/**
 * The recall route, walked end to end through the real app.
 *
 * Every other UI test renders a view function with a hand-built state. This
 * one mounts `mountApp` and clicks buttons, because the claim PM-05 rests on is
 * not about a template: it is that a person who types their memory into this
 * product cannot move their own score by doing it. That has to be checked
 * against the actual action table and the actual store, since the way it would
 * break is a handler pushing recall text somewhere the views never look.
 */

import { describe, expect, it } from 'vitest';
import { mountApp } from '../../src/ui/app.js';
import { computeAuthority } from '../../src/engine/authority.js';
import { loadState } from '../../src/core/store.js';

// jsdom ships no `CSS.escape`, and every field lookup in the app goes through
// it. Browsers have had it since 2016; this is a test-environment gap.
globalThis.CSS = globalThis.CSS || {
  escape: (v) => String(v).replace(/[^\w-]/g, '\\$&'),
};

/** Persistence is debounced. The app flushes on `beforeunload`, so we do too. */
const flush = () => window.dispatchEvent(new window.Event('beforeunload'));

const click = (root, act, id) => {
  const el = [...root.querySelectorAll(`[data-act="${act}"]`)].find(
    (e) => !id || e.dataset.id === id,
  );
  if (!el) throw new Error(`no button for ${act}${id ? ` #${id}` : ''}`);
  el.click();
};

const set = (root, id, value) => {
  const el = root.querySelector(`#${id}`);
  if (!el) throw new Error(`no field #${id}`);
  el.value = value;
  el.dispatchEvent(new window.Event('input', { bubbles: true }));
};

const persisted = () => {
  flush();
  return loadState(localStorage);
};

describe('someone who arrives with nothing to paste', () => {
  it('gets from the first screen to a named errand, and never to a score', () => {
    localStorage.clear();
    document.body.innerHTML = '<div id="app"></div>';
    const root = document.querySelector('#app');
    mountApp(root);

    const situation = root.querySelector('input[name="situation"][value="consultant"]');
    situation.checked = true;
    situation.dispatchEvent(new window.Event('change', { bubbles: true }));
    set(root, 'fit-claim', 'אני יודע להפוך צוות מבולגן לתהליך עבודה שאפשר לנהל.');

    // The third answer. Before this existed the only replies to "I have no
    // documents" were paste something anyway, or look at our sample.
    click(root, 'coldRecall');

    let state = persisted();
    expect(state.profile.onboarded).toBe(true);
    expect(state.sources).toEqual([]);
    // Postponed, not skipped: the reveal is still owed to them.
    expect(state.profile.sawFirstLight).toBe(false);
    expect(root.innerHTML).toContain('id="recall-room"');

    set(root, 'recall-project', 'הטמעת תהליך התפעול באלפא לוגיסטיקה');
    set(root, 'recall-room', 'רונית לוי\nדוד כהן');
    set(root, 'recall-ending', 'רונית אמרה שזה התהליך היחיד ששרד אצלם שנה שלמה');
    click(root, 'saveRecall');

    state = persisted();
    expect(state.retrievals.map((r) => r.recipient)).toEqual(['רונית לוי', 'דוד כהן']);

    // The point of the whole route. Three boxes of remembered material, one of
    // them naming a real outcome, and the evidence base is still empty.
    expect(state.sources).toEqual([]);
    expect(state.proofs).toEqual([]);
    expect(computeAuthority(state).foundation).toBe(0);
    expect(computeAuthority(state).gap).toBe(0);

    // Cleared, so a second click cannot silently duplicate the pass.
    expect(root.querySelector('#recall-room').value).toBe('');

    const first = state.retrievals[0].id;
    click(root, 'retrievalSent', first);
    expect(Number.isFinite(persisted().retrievals[0].askedAt)).toBe(true);

    click(root, 'retrievalArrived', first);
    state = persisted();
    expect(Number.isFinite(state.retrievals[0].closedAt)).toBe(true);
    // Closing the errand adds nothing. What arrived is a document, and it
    // enters the way every other document does.
    expect(state.proofs).toEqual([]);

    set(
      root,
      'paste',
      'ב-2025 קיצרתי אצל אלפא לוגיסטיקה את זמן האספקה מ-19 יום ל-7 ימים.',
    );
    click(root, 'addText');
    click(root, 'mine');

    state = persisted();
    expect(state.proofs.length).toBeGreaterThan(0);
    expect(computeAuthority(state).foundation).toBeGreaterThan(0);
    // And now the reveal they were owed on arrival.
    expect(root.innerHTML).toContain('cold--reveal');
  });
});
