/**
 * What the reveal screen owes the person reading it, after Patch 2.
 *
 * The order is the argument: the sentence they wrote, what it can carry, one
 * thing to do — and everything that judges rather than shows behind a closed
 * question. These tests pin the parts of that which a redesign could quietly
 * undo. Three of the six **fail against the version before the patch** and are
 * the reason it exists: the sentence printed once, the source above the
 * analysis, and the apparatus present but closed. The other three — one primary
 * action, weak evidence keeping its weak action, sample material never passed
 * off as the reader's — passed before it too, and are here because moving the
 * action level out of sight is exactly the kind of change that grants authority
 * by accident. They are guards, not evidence that the patch worked, and saying
 * so is the difference between a test suite and a green light.
 *
 * Rendered directly rather than walked, so this file mounts nothing.
 */

import { describe, expect, it } from 'vitest';
import { firstLightView } from '../../src/ui/views/onboarding.js';
import { toString_ } from '../../src/ui/html.js';
import { translator } from '../../src/i18n/index.js';
import { emptyState } from '../../src/core/schema.js';

const t = translator('he');

const unit = (id, score, demo = false) => ({
  id,
  claim: `SENTENCE_${id} ב-2025 קיצרתי את זמני האספקה מ-19 יום ל-7 ימים.`,
  sourceId: 's',
  sourceName: 'מקור',
  kind: 'outcome',
  archetypes: ['OUTCOME'],
  breakdown: { outcome: 70 },
  score,
  occurredAt: null,
  demo,
  origin: 'mined',
  pinned: false,
  dismissed: false,
  createdAt: 0,
});

const render = (proofs, extra = {}) =>
  toString_(firstLightView({ ...emptyState(), proofs }, t, { proofs, top3: proofs, ...extra }));

const occurrences = (haystack, needle) => haystack.split(needle).length - 1;

describe('the reveal puts the source first and the apparatus last', () => {
  it('prints the strongest sentence exactly once', () => {
    // Before this patch: twice. `primary` was picked out of `top3` by the same
    // threshold that built the list beneath it, so the headline was rendered as
    // the card and again as item 1. Measured at 62/55, the 62 appeared twice.
    const markup = render([unit('AAA', 62), unit('BBB', 55)]);
    expect(occurrences(markup, 'SENTENCE_AAA')).toBe(1);
    expect(occurrences(markup, 'SENTENCE_BBB')).toBe(1);
  });

  it('puts the source above every piece of analysis of it', () => {
    const markup = render([unit('AAA', 62), unit('BBB', 55)]);
    const source = markup.indexOf('proof-card__source');
    expect(source).toBeGreaterThan(-1);
    for (const later of [
      t('proofCard.howTitle'),
      t('proofCard.actionLevelLabel'),
      t('proofCard.mechanismLabel'),
      t('proofCard.confidenceLabel'),
      t('proofCard.limitLabel'),
      t('firstLight.scoreScope'),
    ]) {
      expect(markup.indexOf(later), `${later} should come after the source`).toBeGreaterThan(source);
    }
  });

  it('offers one primary action and no second one competing with it', () => {
    const markup = render([unit('AAA', 62), unit('BBB', 55)]);
    expect(occurrences(markup, 'btn--primary')).toBe(1);
    // The way out of the screen is still reachable; it is simply not primary.
    expect(markup).toContain(t('proofCard.fullPicture'));
  });

  it('keeps the whole apparatus, closed rather than deleted', () => {
    const markup = render([unit('AAA', 62)]);
    const open = markup.indexOf('<details class="proof-card__how"');
    expect(open, 'the disclosure should exist').toBeGreaterThan(-1);
    // Closed: no `open` attribute on that element.
    expect(markup.slice(open, markup.indexOf('>', open))).not.toContain('open');
    for (const kept of [
      t('proofCard.actionLevelLabel'),
      t('proofCard.mechanismLabel'),
      t('proofCard.confidenceLabel'),
      t('proofCard.limitLabel'),
      t('proofCard.scoreLabel'),
      t('firstLight.scoreScope'),
    ]) {
      expect(markup, `${kept} must survive the move`).toContain(kept);
    }
  });

  it('shows no score outside the disclosure, with several findings on screen', () => {
    // The regression this exists for: `revealCard` printed a chip for every
    // secondary finding, so a screen with two or more results showed numbers
    // while the note explaining what the number measures was folded into the
    // primary card's disclosure. That combination is the worst of both — a
    // score with no scope — and it invalidated the reason the note was moved.
    //
    // Two strong findings, because one leaves the list empty and proves nothing.
    const markup = render([unit('AAA', 71), unit('BBB', 64)]);
    expect(markup).toContain('SENTENCE_BBB');

    const closed = markup.slice(0, markup.indexOf('<details class="proof-card__how"'));
    const afterDisclosure = markup.slice(markup.lastIndexOf('</details>'));
    const outside = closed + afterDisclosure;
    expect(outside, 'no score chip may render outside the disclosure').not.toMatch(
      /class="[^"]*\bscore\b/,
    );

    // And the primary's score is still there, inside it.
    const inside = markup.slice(
      markup.indexOf('<details class="proof-card__how"'),
      markup.lastIndexOf('</details>'),
    );
    expect(inside).toMatch(/class="[^"]*\bscore\b/);
    expect(inside).toContain(t('proofCard.scoreLabel'));
  });

  it('names where the sentence came from, when the model knows', () => {
    const markup = render([unit('AAA', 62)]);
    expect(markup).toContain(t('proofCard.sourceLabel'));
    expect(markup).toContain('מקור');
    const source = markup.indexOf('proof-card__source');
    expect(markup.indexOf('proof-card__provenance')).toBeGreaterThan(source);
  });

  it('does not let weak evidence pick up a stronger action than it had', () => {
    // The redesign moves the action level out of sight. That must not change
    // which action is offered — a promotion here would be the redesign quietly
    // granting authority the evidence never earned.
    const weak = render([unit('AAA', 33), unit('BBB', 31)]);
    expect(weak).toContain(t('proofCard.strengthen'));
    expect(weak).not.toContain(t('proofCard.draft'));
    expect(weak).toContain(t(['proofCard', 'actionLevels', 'R4']));
    expect(weak).not.toContain(t(['proofCard', 'actionLevels', 'R3']));

    const strong = render([unit('AAA', 62)]);
    expect(strong).toContain(t('proofCard.draft'));
    expect(strong).toContain(t(['proofCard', 'actionLevels', 'R3']));
  });

  it('never presents bundled sample material as the reader own evidence', () => {
    const markup = render([unit('AAA', 62, true), unit('BBB', 55, true)], { demo: true });
    expect(markup).toContain(t('mine.demoWarning'));
    expect(markup).toContain(t('firstLight.demoSubtitle'));
    expect(markup).not.toContain(t('firstLight.subtitle'));
  });
});
