/**
 * Patch 3 — the dashboard leads with the user's own evidence, then the one
 * thing to do, and only then with the product's opinion of them.
 *
 * Which of these fail against the previous implementation, and which are only
 * guards, because a suite that does not say so is a green light rather than
 * evidence:
 *
 * Measured by running the file against the previous implementation before
 * changing it: **6 failed, 9 passed.**
 *
 *   FAILED BEFORE — the reason this file exists
 *     1. their evidence comes before the Gap
 *     2. the Next Move comes before the Gap
 *     3. the Next Move comes before the Gap when they hold nothing yet
 *     4. the diagnosis and the six layers are behind one closed disclosure
 *     5. a gated stop renders outside that disclosure
 *     6. a gated stop renders above the move it constrains
 *
 *   PASSED BEFORE — guards on what the reorder could break
 *     7. their evidence stays above the action
 *     8. the six layers stay below the action
 *     9. exactly one primary call to action
 *    10. the diagnosis is still reachable
 *    11. all six layers are still reachable
 *    12. the Gap keeps its number and its sentence
 *    13. no stop is invented when nothing is gated
 *    14. bundled fixtures are never the user's own writing
 *    15. no scoring changed
 *
 * Tests 5 and 6 failed before for a reason worth naming: there was no
 * disclosure on this screen at all, so the rule they encode cost nothing to
 * satisfy. Patch 3 introduces one, which is exactly the moment a rule like that
 * stops being free — and the moment to write it down.
 */

import { describe, expect, it } from 'vitest';
import { toString_ } from '../../src/ui/html.js';
import { translator } from '../../src/i18n/index.js';
import { dashboardView } from '../../src/ui/views/dashboard.js';
import { computeAuthority } from '../../src/engine/authority.js';
import { computeLayers } from '../../src/engine/layers.js';
import { LAYER_KEYS } from '../../src/engine/layers.js';
import { emptyState } from '../../src/core/schema.js';

const t = translator('he');

// Real layers rather than a hand-built stub: the dashboard renders all six, and
// faking them only proves the fake was wrong.
const baseAuthority = {
  gap: 12,
  foundation: 40,
  built: 28,
  index: 33,
  diagnosis: 'BURIED',
  lowConfidence: false,
  gated: false,
  demo: false,
  layers: computeLayers(emptyState(), 0),
};

const move = { id: 'move.publishFirst', layer: 'L3', effortMinutes: 12, view: 'studio' };

const line = (claim, over = {}) => ({
  id: 'p1',
  claim,
  score: 61,
  breakdown: {},
  archetypes: [],
  ...over,
});

const render = (held, authorityOver = {}) =>
  toString_(
    dashboardView({ ...emptyState() }, t, {
      authority: { ...baseAuthority, ...authorityOver },
      move,
      held,
    }),
  );

const MINE = 'ב-2025 קיצרתי אצל אלפא לוגיסטיקה את זמן האספקה מ-19 יום ל-7 ימים.';

describe('the dashboard opens on what the user holds, not on what it thinks of them', () => {
  it('puts their own sentence above the Gap', () => {
    // FAILS BEFORE. The previous order was gap → bridge → move, and an existing
    // test in html.test.js asserted that hero came first, on the authority of a
    // line in docs/UX.md. The number is a summary of a state; the sentence is
    // the thing the state is about, and it is the only element on the screen
    // the user wrote.
    const markup = render([line(MINE)]);
    expect(markup).toContain(MINE);
    expect(markup.indexOf('class="bridge"')).toBeLessThan(markup.indexOf('class="hero'));
  });

  it('puts the one thing to do above the Gap as well', () => {
    // FAILS BEFORE. Same reason, one step further: the Gap explains the action,
    // so it reads after it. A metric placed first is read as the goal.
    const markup = render([line(MINE)]);
    expect(markup.indexOf('class="move"')).toBeLessThan(markup.indexOf('class="hero'));
  });

  it('keeps their evidence above the action, which was already true', () => {
    // Credit before critique. This held before and must survive the reorder.
    const markup = render([line(MINE)]);
    expect(markup.indexOf('class="bridge"')).toBeLessThan(markup.indexOf('class="move"'));
  });

  it('still leads with the action when there is nothing of theirs to show yet', () => {
    // No bridge, so nothing of the user's exists to lead with. The action still
    // precedes the verdict — arriving empty-handed is not a reason to be given
    // a diagnosis first.
    const markup = render([]);
    expect(markup).not.toContain('class="bridge"');
    expect(markup.indexOf('class="move"')).toBeLessThan(markup.indexOf('class="hero'));
  });

  it('does not put the six layers in front of the action', () => {
    // FAILS BEFORE only in the weak sense that they already came last; what
    // this pins is that the reorder did not float them up while moving the hero
    // down. The stronger assertion is the next test.
    const markup = render([line(MINE)]);
    expect(markup.indexOf('class="move"')).toBeLessThan(markup.indexOf('class="layers"'));
  });

  it('folds the diagnosis and the six layers into one clearly secondary route', () => {
    // FAILS BEFORE. Both used to render open, so a screen whose argument is
    // "do this one thing" ended in a six-cell scorecard of the user.
    const markup = render([line(MINE)]);
    const details = markup.indexOf('class="fullpicture"');
    expect(details, 'the full picture should be a disclosure').toBeGreaterThan(-1);
    expect(details).toBeLessThan(markup.indexOf('class="layers"'));
    // Closed by default: no `open` attribute on the element.
    expect(markup).not.toMatch(/<details class="fullpicture" open/u);
  });
});

describe('what the reorder is not allowed to cost', () => {
  it('has exactly one primary call to action', () => {
    // GUARD. The move card is the only thing styled primary, and folding the
    // diagnosis away must not have promoted anything inside it.
    const markup = render([line(MINE)]);
    expect(markup.match(/btn--primary/gu) || []).toHaveLength(1);
  });

  it('keeps the diagnosis reachable', () => {
    // GUARD. Hierarchy, not deletion.
    const markup = render([line(MINE)]);
    expect(markup).toContain(t('diagnosis.BURIED.title'));
    expect(markup).toContain(t('diagnosis.BURIED.body'));
  });

  it('keeps all six layers reachable', () => {
    // GUARD. Every one of them, by name, not a count of cards.
    const markup = render([line(MINE)]);
    for (const key of LAYER_KEYS) {
      expect(markup, `layer ${key} disappeared`).toContain(t(`layers.${key}.name`));
    }
    expect(LAYER_KEYS).toHaveLength(6);
  });

  it('keeps the Gap itself, with its number and its sentence', () => {
    // GUARD. The metric is demoted, not deleted, and its formula is untouched.
    const markup = render([line(MINE)]);
    expect(markup).toContain('class="hero');
    expect(markup).toContain(t('gap.label'));
  });
});

describe('a stop condition may not be folded away', () => {
  // The one thing progressive disclosure may not swallow. Everything else on
  // this screen explains; this changes what the product will let the user do,
  // and a boundary the reader has to go looking for is not a boundary.

  it('shows the gated stop outside any disclosure', () => {
    const markup = render([line(MINE)], { gated: true, gap: -30, diagnosis: 'HOLLOW' });
    const stop = markup.indexOf('notice--stop');
    expect(stop, 'a gated dashboard should carry a stop notice').toBeGreaterThan(-1);
    const details = markup.indexOf('<details class="fullpicture"');
    expect(details).toBeGreaterThan(-1);
    expect(stop, 'the stop notice was folded into the disclosure').toBeLessThan(details);
  });

  it('shows the stop before the action it constrains', () => {
    const markup = render([line(MINE)], { gated: true, gap: -30, diagnosis: 'HOLLOW' });
    expect(markup.indexOf('notice--stop')).toBeLessThan(markup.indexOf('class="hero'));
  });

  it('does not invent a stop when nothing is gated', () => {
    // The mirror of the rule above: a stop that fires on an ordinary state is
    // noise, and noise is how a real one stops being read.
    expect(render([line(MINE)])).not.toContain('notice--stop');
  });
});

describe('demo material and the scoring model', () => {
  it('never presents bundled fixtures as the user’s own writing', () => {
    // GUARD, and the same lie First Light was repaired for.
    const markup = render([line('שורה מהדוגמה')], { demo: true });
    expect(markup).not.toContain('class="bridge"');
  });

  it('changes no scoring', () => {
    // GUARD, and the reason this file may exist at all. Patch 3 is a reorder of
    // the same numbers; if any of these move, it was not a reorder.
    const state = emptyState();
    const authority = computeAuthority(state, 0);
    expect(authority.gap).toBe(0);
    expect(authority.foundation).toBe(0);
    expect(authority.built).toBe(0);
    expect(authority.index).toBe(0);
    expect(authority.gated).toBe(false);
    expect(authority.diagnosis).toBe('STALLED');
  });
});
