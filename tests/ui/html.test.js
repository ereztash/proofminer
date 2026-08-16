import { describe, expect, it } from 'vitest';
import { bidi, cx, escapeHtml, html, raw, toString_ } from '../../src/ui/html.js';
import { translator } from '../../src/i18n/index.js';
import heBundle from '../../src/i18n/he.js';
import enBundle from '../../src/i18n/en.js';
import { NOT_ME, firstLightView, onboardingView } from '../../src/ui/views/onboarding.js';
import { emptyState } from '../../src/core/schema.js';

describe('escaping', () => {
  it('escapes every dangerous character', () => {
    expect(escapeHtml(`<script>&"'`)).toBe('&lt;script&gt;&amp;&quot;&#39;');
  });

  it('escapes interpolations by default', () => {
    const evil = '<img src=x onerror=alert(1)>';
    expect(toString_(html`<p>${evil}</p>`)).toBe(
      '<p>&lt;img src=x onerror=alert(1)&gt;</p>',
    );
  });

  it('escapes inside attribute positions', () => {
    const evil = '" onmouseover="alert(1)';
    const out = toString_(html`<div title="${evil}"></div>`);
    expect(out).not.toContain('onmouseover="alert');
    expect(out).toContain('&quot;');
  });

  it('composes nested templates without double-escaping', () => {
    const inner = html`<b>${'A & B'}</b>`;
    expect(toString_(html`<p>${inner}</p>`)).toBe('<p><b>A &amp; B</b></p>');
  });

  it('flattens arrays of templates', () => {
    const items = ['<a>', '<b>'].map((s) => html`<li>${s}</li>`);
    expect(toString_(html`<ul>${items}</ul>`)).toBe('<ul><li>&lt;a&gt;</li><li>&lt;b&gt;</li></ul>');
  });

  it('renders null, undefined and false as empty', () => {
    expect(toString_(html`<p>${null}${undefined}${false}</p>`)).toBe('<p></p>');
  });

  it('only emits unescaped markup through the explicit raw() escape hatch', () => {
    expect(toString_(html`${raw('<hr>')}`)).toBe('<hr>');
  });

  it('escapes inside bdi wrappers', () => {
    expect(toString_(html`${bidi('<b>12</b>')}`)).toBe('<bdi>&lt;b&gt;12&lt;/b&gt;</bdi>');
  });
});

describe('cx', () => {
  it('joins strings, arrays and truthy map keys', () => {
    expect(cx('a', ['b', { c: true, d: false }], null, undefined)).toBe('a b c');
  });
});

describe('i18n', () => {
  it('resolves dotted paths', () => {
    expect(translator('he')('nav.mine')).toBe('מקורות');
    expect(translator('en')('nav.mine')).toBe('Sources');
  });

  it('resolves array paths for keys that themselves contain dots', () => {
    const t = translator('he');
    expect(t(['moves', 'move.addSource', 'title'])).toBeTruthy();
    expect(t(['plays', 'play.outcome', 'title'])).toBeTruthy();
    expect(t(['position', 'issue', 'audience.missing'])).toBeTruthy();
  });

  it('calls function entries with arguments', () => {
    expect(translator('en')('firstLight.title', 14)).toContain('14');
  });

  it('falls back to Hebrew when a key is missing from English', () => {
    expect(translator('en')('nav.dashboard')).toBeTruthy();
  });

  it('returns the path itself for a genuinely unknown key', () => {
    expect(translator('he')('nope.not.here')).toBe('nope.not.here');
  });

  it('keeps the two bundles structurally aligned', () => {
    const shape = (obj, prefix = '') =>
      Object.entries(obj).flatMap(([key, value]) =>
        value && typeof value === 'object' && !Array.isArray(value)
          ? shape(value, `${prefix}${key}.`)
          : [`${prefix}${key}`],
      );
    const heKeys = new Set(shape(heBundle));
    const missing = shape(enBundle).filter((k) => !heKeys.has(k));
    expect(missing).toEqual([]);
  });

  it('never uses the vocabulary that repels this audience', () => {
    const banned = [
      /מיתוג אישי/, /מותג אישי/, /משפיען/, /ויראלי/,
      /personal brand/i, /thought leader/i, /influencer/i, /go viral/i, /crush it/i,
    ];
    const flatten = (obj) =>
      Object.values(obj).flatMap((v) =>
        typeof v === 'string' ? [v] : typeof v === 'object' && v ? flatten(v) : [],
      );
    // Function-valued strings are excluded here; they are covered by usage tests.
    for (const bundle of [heBundle, enBundle]) {
      for (const text of flatten(bundle)) {
        for (const pattern of banned) {
          expect(pattern.test(text), `"${text}" matched ${pattern}`).toBe(false);
        }
      }
    }
  });
});

describe('the first screen qualifies rather than educates', () => {
  // The ICP is an awareness segment: someone who already knows it hurts. A
  // product that cannot say "this is not for you" has no standing to tell a
  // user their visibility exceeds their evidence.
  const t = translator('he');
  const state = { ...emptyState(), profile: { ...emptyState().profile, track: 'independent' } };

  it('offers a real way out, at the same weight as the two situations', () => {
    const markup = toString_(onboardingView(state, t, {}));
    expect(markup).toContain(`value="${NOT_ME}"`);
    expect(markup).toContain(t('onboarding.notMe'));
  });

  it('arrives unanswered — no situation is pre-selected', () => {
    // Seeding from profile.track pre-checked the first pain statement, so the
    // screen asserted something about the visitor and asked them to un-check
    // it, and anyone who ignored the question was recorded as qualified.
    const markup = toString_(onboardingView(state, t, {}));
    expect(markup).not.toContain('checked');
    expect(markup).not.toContain('is-on');
  });

  it('does not show the paste box until the question is answered', () => {
    expect(toString_(onboardingView(state, t, {}))).not.toContain('id="cold-paste"');
    expect(toString_(onboardingView(state, t, { situation: 'job' }))).toContain('id="cold-paste"');
  });

  it('puts no action at all on the exit page', () => {
    // It used to end with "show me on a sample", which onboarded the visitor
    // permanently and landed on "now add something of your own".
    const markup = toString_(onboardingView(state, t, { situation: NOT_ME }));
    expect(markup).not.toContain('data-act=');
  });

  it('remembers a declined visitor across a reload', () => {
    const declined = { ...state, profile: { ...state.profile, declined: true } };
    expect(toString_(onboardingView(declined, t, {}))).toContain(t('notForYou.title'));
  });

  it('replaces the paste box with an honest exit when the visitor says it is not them', () => {
    const markup = toString_(onboardingView(state, t, { situation: NOT_ME }));
    expect(markup).toContain(t('notForYou.title'));
    // No paste box, no analyse button: we are not going to try again.
    expect(markup).not.toContain('id="cold-paste"');
    expect(markup).not.toContain('data-act="coldStart"');
  });

  it('does not empty the paste box when the visitor answers the question above it', () => {
    const ui = { situation: 'job', formCache: { 'cold-paste': 'ניהלתי צוות של שמונה אנשים' } };
    expect(toString_(onboardingView(state, t, ui))).toContain('ניהלתי צוות של שמונה אנשים');
  });

  it('asks how long it has been hurting, not how long they have been working at it', () => {
    for (const locale of ['he', 'en']) {
      const q = translator(locale)('onboarding.weeksQuestion');
      expect(q).toMatch(/מציק|bothering/);
    }
  });
});

describe('First Light on the sample', () => {
  const t = translator('he');
  const demoProof = {
    id: 'p1', claim: 'קיצרתי את זמן האספקה מ-19 יום ל-7 ימים.', score: 61,
    breakdown: { falsifiability: 60 }, demo: true, dismissed: false,
  };

  it('does not tell the visitor that bundled fixtures are theirs', () => {
    // chrome() only wraps the 'app' screen, so this was the one screen with no
    // demo bar — and it is the screen the product calls its entire hook.
    const state = { ...emptyState(), proofs: [demoProof] };
    const markup = toString_(
      firstLightView(state, t, { proofs: [demoProof], top3: [demoProof], demo: true }),
    );
    expect(markup).toContain('demobar');
    expect(markup).not.toContain('במה שהדבקת');
    expect(markup).toContain(t('firstLight.demoSubtitle'));
  });

  it('still speaks in the second person about real evidence', () => {
    const real = { ...demoProof, demo: false };
    const markup = toString_(
      firstLightView({ ...emptyState(), proofs: [real] }, t, {
        proofs: [real], top3: [real], demo: false,
      }),
    );
    expect(markup).not.toContain('demobar');
    expect(markup).toContain('במה שהדבקת');
  });
});
