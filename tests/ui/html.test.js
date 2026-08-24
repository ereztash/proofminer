import { describe, expect, it } from 'vitest';
import { bidi, cx, escapeHtml, html, raw, toString_ } from '../../src/ui/html.js';
import { translator } from '../../src/i18n/index.js';
import heBundle from '../../src/i18n/he.js';
import enBundle from '../../src/i18n/en.js';
import { NOT_ME, firstLightView, onboardingView } from '../../src/ui/views/onboarding.js';
import { mineView } from '../../src/ui/views/mine.js';
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

  it('has localized validation copy for the opening wizard', () => {
    expect(translator('he')('onboarding.needPaste')).not.toBe('onboarding.needPaste');
    expect(translator('en')('onboarding.needPaste')).not.toBe('onboarding.needPaste');
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
    expect(toString_(onboardingView(state, t, { situation: 'consultant' }))).toContain('id="cold-paste"');
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

  it('starts with evidence choice, not only a pain category', () => {
    const markup = toString_(onboardingView(state, t, { situation: 'expert' }));

    expect(markup).toContain(t('onboarding.fitQuestion'));
    expect(markup).toContain('id="fit-claim"');
    expect(markup).toContain('id="fit-evidence"');
    expect(markup).toContain(t(['onboarding', 'modeRead', 'expert']));
  });

  it('does not empty the paste box when the visitor answers the question above it', () => {
    const ui = { situation: 'consultant', formCache: { 'cold-paste': 'ניהלתי צוות של שמונה אנשים' } };
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

  it('turns the first reveal into one proof loop, not only an inventory teaser', () => {
    const real = {
      ...demoProof,
      id: 'proof_loop',
      demo: false,
      archetypes: ['OUTCOME'],
      kind: 'experience',
    };
    const markup = toString_(
      firstLightView({ ...emptyState(), proofs: [real] }, t, {
        proofs: [real], top3: [real], demo: false,
      }),
    );
    expect(markup).toContain(t('proofCard.title'));
    expect(markup).toContain(t('proofCard.limitLabel'));
    expect(markup).toContain(t('proofCard.actionLevelLabel'));
    expect(markup).toContain(t(['proofCard', 'actionLevels', 'R3']));
    expect(markup).toContain('data-act="draft"');
    expect(markup).toContain('data-id="proof_loop"');
  });

  it('uses the usable proof for the proof loop when a weaker proof is ranked first', () => {
    const weak = {
      ...demoProof,
      id: 'weak_loop',
      claim: 'כתבתי שיטה אישית לניהול צוותים.',
      score: 31,
      demo: false,
      archetypes: ['METHOD'],
      kind: 'method',
    };
    const usable = {
      ...demoProof,
      id: 'usable_loop',
      claim: 'קיצרתי את זמן האספקה מ-19 יום ל-7 ימים.',
      score: 61,
      demo: false,
      archetypes: ['OUTCOME'],
      kind: 'experience',
    };
    const markup = toString_(
      firstLightView({ ...emptyState(), proofs: [usable, weak] }, t, {
        proofs: [usable, weak], top3: [weak], demo: false,
      }),
    );

    expect(markup).toContain('data-act="draft"');
    expect(markup).toContain('data-id="usable_loop"');
  });

  it('does not claim unrelated evidence supports the user\'s choice claim', () => {
    const state = {
      ...emptyState(),
      positioning: { ...emptyState().positioning, claim: 'אני יודע לשפר צוותי מכירות' },
    };
    const unrelated = {
      ...demoProof,
      id: 'unrelated_loop',
      claim: 'בניתי תהליך מלאי שהפחית זמני אספקה מ-19 יום ל-7 ימים.',
      score: 81,
      demo: false,
      archetypes: ['OUTCOME'],
      kind: 'experience',
    };
    const markup = toString_(
      firstLightView({ ...state, proofs: [unrelated] }, t, {
        proofs: [unrelated], top3: [unrelated], demo: false,
      }),
    );

    expect(markup).toContain(t('proofCard.titleWeak'));
    expect(markup).toContain(t(['proofCard', 'actionLevels', 'R4']));
    expect(markup).toContain(t(['proofCard', 'supports', 'OUTCOME']));
    expect(markup).not.toContain('data-act="draft"');
    expect(markup).not.toContain(t('proofCard.supportsSpecific', state.positioning.claim));
  });

  it('does not turn weak evidence into a draftable recommendation', () => {
    const weak = {
      ...demoProof,
      id: 'weak_loop',
      score: 31,
      demo: false,
      archetypes: ['OUTCOME'],
      kind: 'experience',
    };
    const markup = toString_(
      firstLightView({ ...emptyState(), proofs: [weak] }, t, {
        proofs: [weak], top3: [weak], demo: false,
      }),
    );

    expect(markup).toContain(t('proofCard.titleWeak'));
    expect(markup).toContain(t('proofCard.strengthen'));
    expect(markup).toContain(t(['proofCard', 'actionLevels', 'R4']));
    expect(markup).not.toContain('data-act="draft"');
  });
});

describe('the reveal does not promise more than it found', () => {
  const t = translator('he');
  const unit = (score) => ({
    id: `p${score}`, claim: 'אני אחראי על תחום השירות בארגון.', score,
    breakdown: { falsifiability: 30 }, demo: false, dismissed: false,
  });

  it('says so plainly when nothing in the paste reaches the usable band', () => {
    // The escape hatch fired only at zero proofs, so four weak fragments still
    // got "three you would never have published yourself" printed over them.
    const proofs = [unit(33), unit(32), unit(29)];
    const markup = toString_(
      firstLightView({ ...emptyState(), proofs }, t, { proofs, top3: proofs, demo: false }),
    );
    expect(markup).toContain(t('firstLight.thinTitle'));
    expect(markup).not.toContain(t('firstLight.threeTitle'));
  });

  it('still makes the promise when the evidence carries it', () => {
    const proofs = [unit(61), unit(48), unit(33)];
    const markup = toString_(
      firstLightView({ ...emptyState(), proofs }, t, { proofs, top3: proofs, demo: false }),
    );
    expect(markup).toContain(t('firstLight.threeTitle'));
  });
});

describe('the extraction consent surface', () => {
  const t = translator('he');
  const withSource = (llm) => {
    const state = emptyState();
    state.sources = [
      {
        id: 's1',
        name: 'cv',
        text: 'טקסט מקור כלשהו שאפשר לחלץ ממנו ראיות בהמשך.',
        demo: false,
        addedAt: 0,
        minedAt: null,
        extracted: [],
        extractedAt: null,
      },
    ];
    state.settings.llm = { ...state.settings.llm, ...llm };
    return state;
  };

  it('offers nothing to send anywhere until both consents are given', () => {
    const off = toString_(mineView(withSource({}), t));
    expect(off).not.toContain('data-act="extractSource"');
    expect(off).toContain(t('mine.extractSetup'));

    // The rewriting toggle alone must not authorise sending a whole document.
    const rewriteOnly = toString_(
      mineView(withSource({ enabled: true, apiKey: 'k', extract: false }), t),
    );
    expect(rewriteOnly).not.toContain('data-act="extractSource"');
  });

  it('offers it once extraction is explicitly consented to', () => {
    const on = toString_(mineView(withSource({ enabled: true, apiKey: 'k', extract: true }), t));
    expect(on).toContain('data-act="extractSource"');
    expect(on).toContain(t('mine.extract'));
  });

  it('locks every row while one source is out at the model', () => {
    const state = withSource({ enabled: true, apiKey: 'k', extract: true });
    const markup = toString_(mineView(state, t, { extracting: 's1' }));
    expect(markup).toContain(t('mine.extractRunning'));
    expect(markup).toContain('disabled');
  });
});

describe('what you expected, beside what was found', () => {
  const t = translator('he');
  const withExpectation = (expectedEvidence, claim) => {
    const state = emptyState();
    state.profile.expectedEvidence = expectedEvidence;
    const proof = {
      id: 'p1', claim, sourceId: 's', sourceName: 'src',
      kind: 'outcome', archetypes: ['OUTCOME'],
      breakdown: { falsifiability: 70, verification: 70, outcome: 70, specificity: 70 },
      score: 62, occurredAt: null, demo: false, origin: 'mined',
      pinned: false, dismissed: false, createdAt: 0,
    };
    return toString_(firstLightView(state, t, { proofs: [proof], top3: [proof] }));
  };

  it('renders nothing when the question went unanswered', () => {
    const out = withExpectation('', 'ב-2025 קיצרתי את זמן האספקה מ-19 יום ל-7 ימים באלפא.');
    expect(out).not.toContain(t('firstLight.expectedTitle'));
  });

  it('reports a match as confirmation, not as a correction', () => {
    const out = withExpectation(
      'סיכום פרויקט שבו זמני האספקה ירדו',
      'ב-2025 קיצרתי אצל אלפא את זמני האספקה מ-19 יום ל-7 ימים.',
    );
    expect(out).toContain(t('firstLight.expectedAligned'));
    expect(out).not.toContain(t('firstLight.expectedDiffers'));
    // A match needs no caveat: nothing is being asserted about the user.
    expect(out).not.toContain(t('firstLight.expectedCaveat'));
  });

  it('states the caveat instead of a verdict when the two diverge', () => {
    const out = withExpectation(
      'המלצה בכתב ממנכ"ל שעבדתי איתו',
      'ב-2025 קיצרתי אצל אלפא את זמני האספקה מ-19 יום ל-7 ימים.',
    );
    expect(out).toContain(t('firstLight.expectedDiffers'));
    expect(out).toContain(t('firstLight.expectedCaveat'));
  });

  it('lands after the three reveals, never before them', () => {
    const out = withExpectation(
      'המלצה בכתב ממנכ"ל שעבדתי איתו',
      'ב-2025 קיצרתי אצל אלפא את זמני האספקה מ-19 יום ל-7 ימים.',
    );
    // credit before critique (docs/UX.md)
    expect(out.indexOf('class="reveal"')).toBeLessThan(out.indexOf('class="expected"'));
  });

  it('never puts the self-reported confidence on screen', () => {
    const state = emptyState();
    state.profile.fitConfidence = 9;
    state.profile.expectedEvidence = 'המלצה בכתב';
    const proof = {
      id: 'p1', claim: 'ב-2025 קיצרתי אצל אלפא את זמני האספקה.', sourceId: 's', sourceName: 'src',
      kind: 'outcome', archetypes: ['OUTCOME'], breakdown: { outcome: 70 }, score: 31,
      occurredAt: null, demo: false, origin: 'mined', pinned: false, dismissed: false, createdAt: 0,
    };
    const out = toString_(firstLightView(state, t, { proofs: [proof], top3: [proof] }));
    // The number itself, and any pairing of it with the measured score, are the
    // feature this deliberately does not build — see core/schema.js.
    expect(out).not.toMatch(/\b9\b/);
  });

  it('no longer promises a comparison the product will not make', () => {
    for (const bundle of [heBundle, enBundle]) {
      expect(bundle.onboarding.fitNote).not.toMatch(/סיכון|הזדמנות|risk|opportunity/);
    }
  });
});
