/**
 * The reply bank, walked end to end through the real app.
 *
 * Its own file, not a second `describe` beside the recall walk — see the note
 * in `./mount.js`. The claim being checked is the same shape as that one: a box
 * on the measurement screen, four fields below an input that carries weight 6
 * in L4, must move nothing at all when a user types the most score-shaped
 * sentence they can into it.
 */

import { describe, expect, it } from 'vitest';
import { mountApp } from '../../src/ui/app.js';
import { computeAuthority } from '../../src/engine/authority.js';
import { STORAGE_KEY, emptyState } from '../../src/core/schema.js';
import { loadState } from '../../src/core/store.js';
import { click, flush, set } from './mount.js';

const persisted = () => {
  flush();
  return loadState(localStorage);
};

/**
 * Seeded rather than clicked into existence: reaching a published artifact
 * means walking the studio, and none of that is what this checks.
 */
function seedPublished() {
  const state = emptyState();
  state.profile.onboarded = true;
  state.profile.sawFirstLight = true;
  state.artifacts = [
    {
      id: 'art_1',
      proofIds: [],
      channel: 'post',
      angle: 'direct',
      body: 'מה שלמדתי מהטמעת תהליך תפעול',
      status: 'published',
      publishedAt: 1,
      url: '',
      createdAt: 1,
    },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

describe('what a real recipient wrote back', () => {
  it('is kept exactly, and moves nothing', () => {
    localStorage.clear();
    seedPublished();
    document.body.innerHTML = '<div id="app"></div>';
    const root = document.querySelector('#app');
    mountApp(root);

    click(root, 'goto', { view: 'measure' });
    const before = computeAuthority(persisted());

    const text = 'שלום,\n\n  זה בדיוק מה שקרה אצלנו — 38% פחות עיכובים.\n\nרונית';
    set(root, 'rp-text', text);
    click(root, 'saveReply');

    const after = persisted();
    expect(after.replies).toHaveLength(1);
    // Character for character, blank lines and indentation included.
    expect(after.replies[0].text).toBe(text);
    expect(after.replies[0].artifactId).toBe('art_1');

    // The point of the whole field: a sentence carrying a magnitude, an
    // attribution and an outcome, typed one screen away from the numbers it
    // looks like it should move.
    expect(computeAuthority(after)).toEqual(before);
    expect(after.proofs).toEqual([]);
    expect(after.sources).toEqual([]);
    expect(after.receptions).toEqual([]);
    expect(after.conversions).toEqual([]);
    expect(after.positioning.nonGoals).toEqual([]);

    // Rendered back whole — never truncated, because that is the promise.
    expect(root.innerHTML).toContain('38% פחות עיכובים');
    // And the box is cleared, so a second click cannot duplicate it.
    expect(root.querySelector('#rp-text').value).toBe('');

    click(root, 'removeReply', { id: after.replies[0].id });
    expect(persisted().replies).toEqual([]);
  });
});
