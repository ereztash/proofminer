/**
 * The negative test set — what the guidance copy is not allowed to do.
 *
 * Every other copy test asks whether a string is present and correct. This file
 * asks the opposite question. Its rules come from the more useful half of what
 * is known about talking to this audience — not what works, but what loses the
 * room. Four such moves are known, and each is a shape a product screen can
 * reproduce without noticing.
 *
 * **No source material is stored here, and none should be.** `docs/TELOS.md`
 * forbids a phrase library outright, and a bank of real wordings from real
 * people is exactly that, one import away from `drafts.js`. So each rule below
 * is written as a property of our own copy, with the failure it generalises
 * named in a comment and nothing quoted.
 *
 * The fifth check is not automatable and lives in `docs/UX.md` instead: could a
 * person in this audience have said this sentence out loud, about themselves?
 * If not, it is written in the product's language rather than the reader's.
 */

import { describe, expect, it } from 'vitest';
import heBundle from '../../src/i18n/he.js';
import enBundle from '../../src/i18n/en.js';

/**
 * Every plain string in a bundle, with its dotted path. Function-valued
 * entries are skipped: they take arguments, and calling them bare produces
 * text no user ever sees.
 */
function strings(obj, prefix = '') {
  const out = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') out.push([path, value]);
    else if (Array.isArray(value)) {
      value.forEach((v, i) => {
        if (typeof v === 'string') out.push([`${path}[${i}]`, v]);
      });
    } else if (value && typeof value === 'object') out.push(...strings(value, path));
  }
  return out;
}

const BUNDLES = [['he', heBundle], ['en', enBundle]];

describe('the guidance never repeats a move that lost the room', () => {
  it('does not tell the user what their own material is', () => {
    // The failure: putting words in someone's mouth. It reliably draws an
    // objection, and people who are good at this conversation guard against it
    // out loud — "correct me if I am wrong". First Light was doing it at full
    // confidence three minutes after arrival: "what you pasted mostly describes
    // roles".
    const asserts = [
      /מה שהדבקת (הוא|זה|הם)/u,
      /החומר שהדבקת [^.?]{0,40}(לא|אינו|אינה)/u,
      /what you pasted (is|are|mostly)/iu,
      /the material you pasted is not/iu,
    ];
    for (const [locale, bundle] of BUNDLES) {
      for (const [path, text] of strings(bundle)) {
        for (const pattern of asserts) {
          expect(pattern.test(text), `${locale} ${path}: "${text}"`).toBe(false);
        }
      }
    }
  });

  it('does not ask the user to confirm something the product just said', () => {
    // The failure: agreement mistaken for confirmation. Plenty of people stay
    // quiet rather than argue, and a run of agreement in a single conversation
    // looks like ownership while it is an echo. A screen that asks "does that
    // sound right?" and stores the yes is collecting that echo as data.
    const confirms = [
      /נכון\?/u,
      /האם זה (מדויק|נכון)/u,
      /does (that|this) sound right/iu,
      /is (that|this) accurate\?/iu,
    ];
    for (const [locale, bundle] of BUNDLES) {
      for (const [path, text] of strings(bundle)) {
        for (const pattern of confirms) {
          expect(pattern.test(text), `${locale} ${path}: "${text}"`).toBe(false);
        }
      }
    }
  });

  it('does not demand a finished formulation before anything else may happen', () => {
    // The failure: asking for a definition the person cannot produce yet, as
    // the price of proceeding — from someone whose whole presenting problem is
    // that they cannot produce it yet. What works is abandoning the demand and
    // asking something lighter. Screen 0 was running the failed move as a hard
    // gate, so this asserts the refusal string is gone rather than merely
    // unused.
    for (const [locale, bundle] of BUNDLES) {
      expect(bundle.onboarding.needClaim, locale).toBeUndefined();
    }
  });

  it('keeps the claim question, and says out loud that it may be skipped', () => {
    // Asking is not the failure — gating on the answer is. The question does
    // real work in the conversation where it is asked, so it stays.
    for (const [locale, bundle] of BUNDLES) {
      expect(bundle.onboarding.claimQuestion, locale).toBeTruthy();
      expect(bundle.onboarding.claimHint, locale).toMatch(/דלג|skip it/);
    }
  });
});

describe('screen 0 speaks in the reader’s language', () => {
  it('names the complaint people actually arrive with', () => {
    // People in this audience describe their blocker as some version of "I
    // cannot explain what I do". Almost none describe it as choosing between
    // pieces of evidence, which is how this screen used to open — the product's
    // mechanism offered as the reader's symptom.
    for (const [locale, bundle] of BUNDLES) {
      const opening = `${bundle.onboarding.painTitle} ${bundle.onboarding.painBody}`;
      expect(opening, locale).toMatch(/להסביר|explain/);
      expect(bundle.onboarding.painTitle, locale).not.toMatch(/ראיה|evidence/);
    }
  });

  it('carries the sentence that is the product’s whole hook', () => {
    // "What I do is basic, everybody works this way" — the sentence this
    // audience volunteers unprompted. It is the exact belief First Light exists
    // to overturn, and it appeared nowhere in the copy.
    for (const [locale, bundle] of BUNDLES) {
      const opening = `${bundle.onboarding.painBody} ${bundle.notForYou.comeBack.join(' ')}`;
      expect(opening, locale).toMatch(/בייסיק|כולם עושים|basic|everyone does/);
    }
  });

  it('offers an exit a person could recognise in themselves', () => {
    // "I do not need to prove why to choose me" is the product's frame, not a
    // sentence anyone says. The exit has to be as recognisable as the entry or
    // it does not qualify anybody.
    for (const [locale, bundle] of BUNDLES) {
      expect(bundle.onboarding.notMe, locale).not.toMatch(/להוכיח|prove/);
    }
  });

  it('lists moments, not product theory, under “come back when”', () => {
    // Two of the four entries used to be claims about the market — a competitor
    // who looks more convincing because their evidence is simpler, content that
    // builds trust rather than looking like more content. Nobody describes
    // their own week that way.
    for (const [locale, bundle] of BUNDLES) {
      expect(bundle.notForYou.comeBack, locale).toHaveLength(4);
      for (const line of bundle.notForYou.comeBack) {
        expect(line, `${locale}: ${line}`).not.toMatch(/מתחרה|בונה אמון|competitor|builds trust/);
      }
    }
  });
});
