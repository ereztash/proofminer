import { describe, expect, it } from 'vitest';
import {
  ANGLES,
  composeDraft,
  extractNumbers,
  lengthAdvice,
  provenanceFooter,
  validateGrounding,
} from '../../src/engine/drafts.js';
import { proofFrom, STRONG_HE, STRONG_EN } from '../helpers.js';

describe('grounding validator', () => {
  it('normalises number formatting before comparing', () => {
    expect(extractNumbers('5,500 ו-27000')).toEqual(['5500', '27000']);
  });

  it('passes text whose numbers all come from the evidence', () => {
    const proof = proofFrom('ההכנסות גדלו ב-38% והגיעו ל-27,000 שקל');
    const result = validateGrounding('גדילה של 38% עד 27000 שקל', [proof]);
    expect(result.ok).toBe(true);
  });

  it('catches an invented number', () => {
    const proof = proofFrom('ההכנסות גדלו ב-38%');
    const result = validateGrounding('ההכנסות גדלו ב-38% אצל 40 לקוחות', [proof]);
    expect(result.ok).toBe(false);
    expect(result.unsupported).toContain('40');
  });

  it('treats a differently-formatted same number as supported', () => {
    const proof = proofFrom('הגענו ל-27,000 שקל');
    expect(validateGrounding('הגענו ל-27000 שקל', [proof]).ok).toBe(true);
  });
});

describe('composeDraft', () => {
  const proof = proofFrom(STRONG_HE);

  it('produces a grounded draft for every angle', () => {
    for (const angle of ANGLES) {
      const draft = composeDraft({ proofs: [proof], angle, locale: 'he' });
      expect(draft.body.length).toBeGreaterThan(40);
      expect(draft.grounding.ok).toBe(true);
      expect(draft.warnings).not.toContain('ungrounded-numbers');
    }
  });

  it('inserts the evidence text verbatim', () => {
    const draft = composeDraft({ proofs: [proof], angle: 'direct', locale: 'he' });
    expect(draft.body).toContain(proof.claim);
  });

  it('carries provenance as proof ids', () => {
    const draft = composeDraft({ proofs: [proof], locale: 'he' });
    expect(draft.proofIds).toEqual([proof.id]);
  });

  it('warns when the evidence is demo material', () => {
    const demo = proofFrom('[דמו בלבד] ' + STRONG_HE, { demo: true });
    const draft = composeDraft({ proofs: [demo], locale: 'he' });
    expect(draft.warnings).toContain('demo-proof');
  });

  it('strips the demo marker out of the body', () => {
    const demo = proofFrom('[דמו בלבד] ' + STRONG_HE, { demo: true });
    const draft = composeDraft({ proofs: [demo], locale: 'he' });
    expect(draft.body).not.toContain('[דמו בלבד]');
  });

  it('returns an empty draft rather than inventing content with no evidence', () => {
    const draft = composeDraft({ proofs: [], locale: 'he' });
    expect(draft.body).toBe('');
    expect(draft.warnings).toContain('no-proof');
  });

  it('works in English too', () => {
    const draft = composeDraft({ proofs: [proofFrom(STRONG_EN)], angle: 'insight', locale: 'en' });
    expect(draft.grounding.ok).toBe(true);
    expect(draft.body).toContain('38%');
  });

  it('never introduces a number the framing invented, across all angles and CTAs', () => {
    for (const angle of ANGLES) {
      for (const cta of ['none', 'discussion', 'dm', 'call']) {
        for (const locale of ['he', 'en']) {
          const draft = composeDraft({ proofs: [proof], angle, cta, locale });
          expect(draft.grounding.ok).toBe(true);
        }
      }
    }
  });
});

describe('provenance and length', () => {
  it('lists every cited proof in the footer', () => {
    const a = proofFrom('הכנסות גדלו בשלושים ושמונה אחוזים');
    const b = proofFrom('התראיינתי לכתבה מקצועית בנושא');
    const footer = provenanceFooter([a, b], 'he');
    expect(footer).toContain(a.claim);
    expect(footer).toContain(b.claim);
  });

  it('returns nothing for no proofs', () => {
    expect(provenanceFooter([], 'he')).toBe('');
  });

  it('reports the pre-fold slice and length flags', () => {
    const advice = lengthAdvice('a'.repeat(300));
    expect(advice.chars).toBe(300);
    expect(advice.beforeFold.length).toBe(210);
    expect(advice.tooShort).toBe(false);
    expect(lengthAdvice('short').tooShort).toBe(true);
  });
});
