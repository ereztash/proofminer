import { describe, expect, it } from 'vitest';
import { bidi, cx, escapeHtml, html, raw, toString_ } from '../../src/ui/html.js';
import { translator } from '../../src/i18n/index.js';
import heBundle from '../../src/i18n/he.js';
import enBundle from '../../src/i18n/en.js';
import { NOT_ME, firstLightView, onboardingView } from '../../src/ui/views/onboarding.js';
import { mineView } from '../../src/ui/views/mine.js';
import { measureView } from '../../src/ui/views/measure.js';
import { dashboardView } from '../../src/ui/views/dashboard.js';
import { positionView } from '../../src/ui/views/position.js';
import { computeLayers } from '../../src/engine/layers.js';
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

describe('the route for someone with no documents', () => {
  const t = translator('he');
  const source = {
    id: 's1', name: 'cv', text: 'טקסט כלשהו', demo: false,
    addedAt: 0, minedAt: 0, extracted: [], extractedAt: null,
  };
  const retrieval = {
    id: 'rtv_1',
    recipient: 'רונית לוי',
    about: 'הטמעת תהליך התפעול',
    recalled: 'רונית אמרה שזה התהליך היחיד ששרד אצלם שנה',
    askedAt: null,
    closedAt: null,
    createdAt: 0,
  };
  const withState = (over = {}, ui = {}) =>
    toString_(mineView({ ...emptyState(), ...over }, t, ui));

  it('says in the box itself that nothing typed there is evidence', () => {
    // The one thing this screen must never be read as is a second paste box.
    for (const locale of ['he', 'en']) {
      const copy = translator(locale)('recall.notEvidence');
      expect(copy.length).toBeGreaterThan(60);
      expect(copy).toMatch(/ראיה|evidence/);
    }
    expect(withState()).toContain(t('recall.notEvidence'));
  });

  it('opens itself for the visitor who has nothing, and folds away once they do', () => {
    expect(withState()).toMatch(/<details class="card recall" open/);
    expect(withState({ sources: [source] })).not.toMatch(/<details class="card recall" open/);
  });

  it('asks the one question that produces a recipient', () => {
    const markup = withState();
    expect(markup).toContain('id="recall-room"');
    expect(markup).toContain('data-act="saveRecall"');
  });

  it('does not empty the recall boxes when the screen re-renders', () => {
    // Deliberately a name the placeholder does not already contain: the first
    // version of this test asserted 'רונית לוי', which the placeholder supplies
    // on its own, so it passed against a control rendered permanently blank.
    const markup = withState({}, { formCache: { 'recall-room': 'מיכל ברק' } });
    expect(markup).toContain('מיכל ברק');
  });

  it('renders no task list at all when there are no tasks', () => {
    expect(withState()).not.toContain(t('recall.tasksLead'));
  });

  it('puts the person’s name on the task, with something to do about it', () => {
    const markup = withState({ retrievals: [retrieval] });
    expect(markup).toContain('רונית לוי');
    expect(markup).toContain(t('recall.askLine', retrieval.recipient, retrieval.about));
    expect(markup).toContain('data-act="retrievalSent"');
    expect(markup).toContain('data-act="retrievalArrived"');
    expect(markup).toContain('data-act="retrievalDrop"');
  });

  it('labels the remembered words as the part that is not counted', () => {
    const markup = withState({ retrievals: [retrieval] });
    expect(markup).toContain(t('recall.memoryLabel'));
    expect(markup).toContain(retrieval.recalled);
  });

  it('drops the send button once it has been sent', () => {
    const sent = { ...retrieval, askedAt: 1 };
    const markup = withState({ retrievals: [sent] });
    expect(markup).not.toContain('data-act="retrievalSent"');
    expect(markup).toContain(t('recall.sentTag'));
  });

  it('keeps what came back, folded away rather than deleted', () => {
    const closed = { ...retrieval, closedAt: 1 };
    const markup = withState({ retrievals: [closed] });
    expect(markup).toContain(t('recall.closedCount', 1));
    expect(markup).toContain(t('recall.allClosed'));
  });

  it('escapes a name that arrived from an imported backup', () => {
    const evil = { ...retrieval, recipient: '<img src=x onerror=alert(1)>' };
    const markup = withState({ retrievals: [evil] });
    expect(markup).not.toContain('<img src=x');
    expect(markup).toContain('&lt;img');
  });
});

describe('the first screen finally has a third answer', () => {
  const t = translator('he');
  const state = emptyState();

  it('offers the recall route as a peer, not as an escape hatch', () => {
    const markup = toString_(onboardingView(state, t, { situation: 'consultant' }));
    expect(markup).toContain('data-act="coldRecall"');
    expect(markup).toContain(t('onboarding.routeNote'));

    // The point of the route is lost if it is offered in the styling reserved
    // for the thing nobody is meant to click. It used to be a ghost link inside
    // a paragraph below three wizard steps; it is now a bordered button beside
    // the primary one, and `secondary` is what carries that.
    const recall = markup.slice(markup.indexOf('data-act="coldRecall"') - 200, markup.indexOf('data-act="coldRecall"'));
    expect(recall).toContain('btn--secondary');
    expect(recall).not.toContain('btn--ghost');
  });

  it('puts the material above the questions it used to sit below', () => {
    const markup = toString_(onboardingView(state, t, { situation: 'consultant' }));
    const paste = markup.indexOf('id="cold-paste"');
    // Every one of these is optional and always was. What changed is that a
    // person holding material no longer scrolls past a self-rating and two
    // boxes asking for the output this product exists to produce.
    for (const later of ['id="fit-confidence"', 'id="fit-claim"', 'id="fit-evidence"', 'name="weeks"']) {
      expect(markup.indexOf(later), `${later} should come after the paste box`).toBeGreaterThan(paste);
    }
  });

  it('still puts no action on the exit page', () => {
    expect(toString_(onboardingView(state, t, { situation: NOT_ME }))).not.toContain('data-act=');
  });

  it('stops the sample from claiming to answer "I have nothing"', () => {
    // The sample teaches how the ranking works and measures nobody. Offering
    // it as the reply to an empty-handed visitor was the dead end.
    for (const bundle of [heBundle, enBundle]) {
      expect(bundle.onboarding.orSample).not.toMatch(/אין לי כלום|nothing ready/);
    }
  });
});

describe('the words the market used', () => {
  const t = translator('he');
  const published = {
    id: 'art_1', proofIds: [], channel: 'post', angle: 'direct',
    body: 'מה שלמדתי מהטמעת תהליך תפעול', status: 'published',
    publishedAt: 1, url: '', createdAt: 1,
  };
  const reply = (over = {}) => ({
    id: 'rpl_1', artifactId: 'art_1', text: 'זה בדיוק מה שקרה אצלנו.', at: 100, ...over,
  });
  const render = (over = {}, ui = {}) =>
    toString_(measureView({ ...emptyState(), artifacts: [published], ...over }, t, ui));

  it('does not exist before there is anything to be a reply to', () => {
    const markup = toString_(measureView({ ...emptyState() }, t, {}));
    expect(markup).not.toContain('id="rp-text"');
    expect(markup).not.toContain(t('replies.title'));
  });

  it('states the boundary before the box, in both locales', () => {
    // It sits four fields below `substantiveComments`, which carries weight 6
    // in L4. A user must not be able to read this as an input.
    for (const locale of ['he', 'en']) {
      const copy = translator(locale)('replies.notCounted');
      expect(copy.length).toBeGreaterThan(60);
      expect(copy).toMatch(/ראיה|evidence/);
    }
    const markup = render();
    expect(markup.indexOf(t('replies.notCounted'))).toBeLessThan(markup.indexOf('id="rp-text"'));
  });

  it('gives back the whole reply, never a preview of it', () => {
    // Every other list on this screen truncates — `body.slice(0, 60)` twice
    // over. Truncating here would break the one thing the field promises.
    const long = `${'א'.repeat(300)} סוף`;
    const markup = render({ replies: [reply({ text: long })] });
    expect(markup).toContain(long);
  });

  it('keeps the line breaks that came with it', () => {
    const text = 'שלום,\n\nזה עבד.\n\nרונית';
    const markup = render({ replies: [reply({ text })] });
    expect(markup).toContain(text);
    // The class carrying `white-space: pre-wrap`, without which the markup
    // above renders as one paragraph and the promise is not kept.
    expect(markup).toContain('reply__text');
  });

  it('names what each reply answered, and says so when that is gone', () => {
    const attached = render({ replies: [reply()] });
    expect(attached).toContain(t('replies.inAnswerTo', published.body));

    const orphan = render({ replies: [reply({ artifactId: null })] });
    expect(orphan).toContain(t('replies.unattached'));
  });

  it('puts the newest first, by timestamp rather than by array order', () => {
    const markup = render({
      replies: [reply({ id: 'a', text: 'ישן', at: 1 }), reply({ id: 'b', text: 'חדש', at: 9 })],
    });
    expect(markup.indexOf('חדש')).toBeLessThan(markup.indexOf('ישן'));
  });

  it('escapes a reply that arrived from an imported backup', () => {
    const markup = render({ replies: [reply({ text: '<img src=x onerror=alert(1)>' })] });
    expect(markup).not.toContain('<img src=x');
    expect(markup).toContain('&lt;img');
  });

  it('does not empty the box when the screen re-renders', () => {
    expect(render({}, { formCache: { 'rp-text': 'טיוטה שלא נשמרה' } })).toContain(
      'טיוטה שלא נשמרה',
    );
  });
});

describe('the filler issue names the words', () => {
  const t = translator('he');

  it('puts the user’s own words on the screen, not a count of them', () => {
    // It used to say "there are words here everyone in your field uses" and
    // never say which — a verdict nobody can act on.
    const state = {
      ...emptyState(),
      positioning: {
        audience: 'ארגונים',
        transformation: 'פתרונות הוליסטיים',
        claim: 'גישה אסטרטגית וחדשנית',
        offer: '',
        nonGoals: [],
      },
    };
    const markup = toString_(positionView(state, t));
    expect(markup).toContain('אסטרטגית');
    expect(markup).toContain('הוליסטיים');
  });

  it('asks a question about the word rather than passing sentence on it', () => {
    for (const locale of ['he', 'en']) {
      const line = translator(locale)(['position', 'issue', 'filler'], ['אסטרטגי'], 0);
      expect(line).toContain('אסטרטגי');
      expect(line).toContain('?');
    }
  });

  it('survives being resolved with no arguments', () => {
    // The structural-alignment and banned-vocabulary sweeps call every key
    // bare; a function string that throws there takes the whole suite with it.
    for (const locale of ['he', 'en']) {
      expect(() => translator(locale)(['position', 'issue', 'filler'])).not.toThrow();
    }
  });
});

describe('the return bridge', () => {
  const t = translator('he');
  // Real layers rather than a hand-built stub: the dashboard renders all six,
  // and faking them only proved that the fake was wrong.
  const authority = {
    gap: 12, foundation: 40, built: 28, index: 33, diagnosis: 'BURIED',
    lowConfidence: false, gated: false, demo: false,
    layers: computeLayers(emptyState(), 0),
  };
  const move = { id: 'move.publishFirst', layer: 'L3', effortMinutes: 12, view: 'studio' };
  const line = (claim) => ({ id: 'p1', claim, score: 61, breakdown: {}, archetypes: [] });
  const render = (held, over = {}) =>
    toString_(
      dashboardView({ ...emptyState() }, t, {
        authority: { ...authority, ...over },
        move,
        held,
      }),
    );

  it('shows the user’s own sentence, above the instruction', () => {
    const claim = 'ב-2025 קיצרתי אצל אלפא לוגיסטיקה את זמן האספקה מ-19 יום ל-7 ימים.';
    const markup = render([line(claim)]);
    expect(markup).toContain(claim);
    // Credit before critique: their words come before the thing to go and do.
    expect(markup.indexOf('class="bridge"')).toBeLessThan(markup.indexOf('class="move"'));
    // And after the headline number, which docs/UX.md puts first.
    expect(markup.indexOf('class="hero')).toBeLessThan(markup.indexOf('class="bridge"'));
  });

  it('renders nothing at all when there is nothing of theirs to show', () => {
    expect(render([])).not.toContain('class="bridge"');
  });

  it('never puts bundled fixtures under “what you already wrote”', () => {
    expect(render([line('שורה מהדוגמה')], { demo: true })).not.toContain('class="bridge"');
  });

  it('does not wait for an absence it never measures', () => {
    // The version this replaces keyed off a lastActiveAt and a 30-day gap.
    // Measuring absence is a re-engagement mechanic, and per docs/TELOS.md a
    // month away may be the relief this product exists to produce.
    expect(render([line('שורה שלי')])).toContain('class="bridge"');
    expect(Object.keys(emptyState().profile)).not.toContain('lastActiveAt');
  });

  it('escapes a claim that arrived from an imported backup', () => {
    const markup = render([line('<img src=x onerror=alert(1)>')]);
    expect(markup).not.toContain('<img src=x');
    expect(markup).toContain('&lt;img');
  });
});

describe('First Light names the stage, not the person', () => {
  it('reads as the expected result of a first pass, not a verdict on the material', () => {
    for (const locale of ['he', 'en']) {
      const tt = translator(locale);
      for (const key of ['firstLight.emptyBody', 'firstLight.thinBody']) {
        const copy = tt(key);
        expect(copy, `${locale} ${key}`).toMatch(/צפויה|צפוי|expected/);
        // The sentences these replaced: "the material you pasted is not
        // concrete enough" and "what you pasted mostly describes roles".
        expect(copy, `${locale} ${key}`).not.toMatch(/לא מספיק קונקרטי|not concrete enough/);
        expect(copy, `${locale} ${key}`).not.toMatch(/מה שהדבקת הוא|What you pasted mostly/);
      }
    }
  });

  it('no longer opens the instruction with a number', () => {
    // Seven of the eight evidence routes need no magnitude (docs/METHOD.md I3).
    // Leading the thin-result advice with one contradicts the plays copy.
    for (const locale of ['he', 'en']) {
      expect(translator(locale)('firstLight.thinBody')).not.toMatch(/מספר|number/);
    }
  });
});
