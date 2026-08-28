/**
 * Cold start and First Light (docs/UX.md).
 *
 * The actor arrives in a shame state after weeks of unanswered applications.
 * The first screen therefore carries no navigation, no score, and no dashboard
 * of zeros — one sentence that names what they already feel, one paste box,
 * and the anti-hype pledge, because the second pain (revulsion at
 * self-promotion) has to be neutralised before they will paste anything
 * personal.
 *
 * The screen opens on **recognition, not education**. The ICP is defined by
 * awareness: someone who already knows this hurts. So the first interaction is
 * a question the right person answers instantly — and the third option is an
 * honest way out. A product that will not say "this is not for you" cannot be
 * trusted when it says "this is what your evidence is worth."
 */

import { html } from '../html.js';
import { button, field, scoreChip, textArea } from '../components.js';
import { inventorySignals, reasonFor } from '../../engine/explain.js';
import { BAND_USABLE } from '../../engine/score.js';

/**
 * Situations, phrased as the pain rather than as the goal.
 *
 * "Looking for work" is a category; "I sent applications and the silence is
 * getting to me" is something a person recognises about themselves. Only the
 * second one qualifies an audience by awareness. `NOT_ME` is a first-class
 * option, not a link in small print.
 */
export const NOT_ME = 'none';

export function onboardingView(state, t, ui = {}) {
  // No default. Seeding this from `profile.track` pre-selected the first pain
  // statement — accent border and all — so the screen asserted something about
  // the visitor's life and asked them to un-check it, and anyone who ignored
  // the question was silently recorded as qualified and tracked `independent`.
  // A qualifying question that arrives answered has not qualified anybody.
  const situation = ui.situation ?? (state.profile.declined ? NOT_ME : null);
  const weeks = ui.weeks ?? null;

  return html`<div class="cold">
    <div class="cold__inner">
      <h1 class="cold__title">${t('onboarding.painTitle')}</h1>
      <p class="cold__body">${t('onboarding.painBody')}</p>

      <fieldset class="choice choice--lead">
        <legend>${t('onboarding.situationQuestion')}</legend>
        <p class="choice__note">${t('onboarding.situationNote')}</p>
        <div class="choice__row">
          ${situationOption('consultant', situation, t('onboarding.modeConsultant'), t('onboarding.modeConsultantHint'))}
          ${situationOption('expert', situation, t('onboarding.modeExpert'), t('onboarding.modeExpertHint'))}
        </div>
        ${situationOption(NOT_ME, situation, t('onboarding.notMe'), t('onboarding.notMeHint'), 'choice__opt--wide')}
      </fieldset>

      ${situation === NOT_ME ? notForYou(t) : ''}
      ${situation && situation !== NOT_ME ? coldStartBody(t, weeks, ui, situation) : ''}
    </div>
  </div>`;
}

/**
 * The honest exit. No waitlist capture, no "are you sure", no reframing of the
 * user's own answer back at them, and — deliberately — **no action at all**.
 *
 * This page used to end with "just show me how it works", which loaded the
 * sample, set `onboarded` permanently, and landed on a dashboard whose single
 * primary card read "now add something of your own": a second attempt at
 * persuasion two clicks after promising there would be none. The only way back
 * in is the question above, which stays on screen — the visitor changes their
 * own answer or they leave.
 */
function notForYou(t) {
  return html`<div class="notme">
    <h2 class="notme__title">${t('notForYou.title')}</h2>
    <p class="cold__body">${t('notForYou.body')}</p>
    <p class="cold__body">${t('notForYou.forWhom')}</p>
    <h3 class="cold__step">${t('notForYou.comeBackTitle')}</h3>
    <ul class="pledge__list">
      ${t('notForYou.comeBack').map((line) => html`<li>${line}</li>`)}
    </ul>
    <p class="cold__aside">${t('notForYou.changedMind')}</p>
  </div>`;
}

function coldStartBody(t, weeks, ui, situation) {
  const confidence = ui.formCache?.['fit-confidence'] ?? '5';
  const modeRead = t(['onboarding', 'modeRead', situation]);

  return html`<div class="cold__step-block">
    <p class="wizard__lead">${modeRead}</p>

    <section class="wizard__step wizard__step--material">
      <h2 class="wizard__title">${t('onboarding.firstStepTitle')}</h2>
      <p class="cold__body">${t('onboarding.firstStepBody')}</p>

      ${field(
        'cold-paste',
        t('onboarding.firstStepTitle'),
        // Rendered from the cache, not blank: answering the situation question
        // re-renders this screen, and a paste box that empties itself when the
        // user answers a question above it is the cruellest possible bug here.
        textArea('cold-paste', ui.formCache?.['cold-paste'] ?? '', {
          placeholder: t('onboarding.placeholder'),
          rows: 8,
        }),
        '',
        { hideLabel: true },
      )}

      <div class="cold__actions">
        ${button('coldStart', t('onboarding.analyze'), { variant: 'primary' })}
        ${button('coldRecall', t('onboarding.orRecall'))}
      </div>
      <p class="cold__aside">${t('onboarding.routeNote')}</p>
      <p class="cold__aside">${button('coldSample', t('onboarding.orSample'), { variant: 'ghost' })}</p>
    </section>

    <details class="pledge">
      <summary class="pledge__title">${t('onboarding.optionalTitle')}</summary>
      <p class="pledge__lead">${t('onboarding.optionalLead')}</p>

      <fieldset class="choice">
        <legend>${t('onboarding.fitQuestion')}</legend>
        <p class="choice__note">${t('onboarding.fitNote')}</p>
        <input
          class="input input--range"
          id="fit-confidence"
          name="fit-confidence"
          type="range"
          min="1"
          max="10"
          step="1"
          value="${confidence}"
          aria-describedby="fit-confidence-scale"
        />
        <div class="range-scale" id="fit-confidence-scale">
          <span>${t('onboarding.fitLow')}</span>
          <b>${confidence}</b>
          <span>${t('onboarding.fitHigh')}</span>
        </div>
      </fieldset>

      ${field(
        'fit-claim',
        t('onboarding.claimQuestion'),
        textArea('fit-claim', ui.formCache?.['fit-claim'] ?? '', {
          placeholder: t('onboarding.claimPlaceholder'),
          rows: 3,
        }),
        t('onboarding.claimHint'),
      )}

      ${field(
        'fit-evidence',
        t('onboarding.evidenceQuestion'),
        textArea('fit-evidence', ui.formCache?.['fit-evidence'] ?? '', {
          placeholder: t('onboarding.evidencePlaceholder'),
          rows: 3,
        }),
        t('onboarding.evidenceHint'),
      )}

      <fieldset class="choice choice--compact">
        <legend>${t('onboarding.weeksQuestion')}</legend>
        <div class="choice__row choice__row--tight">
          ${weeksOption(0, weeks, t('onboarding.weeksNotYet'))}
          ${weeksOption(12, weeks, t('onboarding.weeksMonths'))}
          ${weeksOption(40, weeks, t('onboarding.weeksLong'))}
        </div>
      </fieldset>
    </details>

    <details class="pledge">
      <summary class="pledge__title">${t('onboarding.pledgeTitle')}</summary>
      <p class="pledge__lead">${t('onboarding.pledgeLead')}</p>
      <ul class="pledge__list">
        ${t('onboarding.pledge').map((line) => html`<li>${line}</li>`)}
      </ul>
    </details>

  </div>`;
}

const situationOption = (value, current, label, hint, extra = '') => html`<label
  class="choice__opt ${extra} ${value === current ? 'is-on' : ''}"
>
  <input type="radio" name="situation" value="${value}" ${value === current ? checkedAttr : ''} />
  <span class="choice__label">${label}</span>
  <span class="choice__hint">${hint}</span>
</label>`;

const weeksOption = (value, current, label) => html`<label
  class="choice__opt choice__opt--sm ${value === current ? 'is-on' : ''}"
>
  <input type="radio" name="weeks" value="${value}" ${value === current ? checkedAttr : ''} />
  <span class="choice__label">${label}</span>
</label>`;

const checkedAttr = html`checked`;

const SUPPORT_STOP_WORDS = new Set([
  'אני', 'אתה', 'את', 'הוא', 'היא', 'הם', 'הן', 'זה', 'זו', 'של', 'עם', 'מול',
  'למה', 'נכון', 'לבחור', 'לקוח', 'לקוחות', 'פרויקט', 'עבודה', 'יותר', 'יודע',
  'יודעת', 'יכול', 'יכולה', 'אפשר', 'כדי',
  'the', 'and', 'for', 'you', 'your', 'with', 'this', 'that', 'can', 'able',
  'from', 'into', 'client', 'project', 'choose', 'alternative', 'someone', 'over',
  'why',
]);

/**
 * First Light — the reveal, deliberately a screen of its own rather than a
 * redirect into the dashboard. This is the product's entire hook and it has to
 * land within a few minutes of arrival: *you already had this*.
 *
 * On the sample it must say the opposite, and say it here rather than relying
 * on the app chrome: `chrome()` only wraps the `app` screen, so this was the
 * one screen with no demo bar — and it opened by telling someone in a shame
 * state that eight bundled fixtures were things they hold and nobody sees.
 */
export function firstLightView(state, t, { proofs, top3, demo = false }) {
  const signalCache = inventorySignals(proofs);
  // The escape hatch fired only at *zero* proofs, so a paste that yielded four
  // Card-wise, not inventory-wise. Gating only on "does anything clear the
  // band" left one 45-scoring unit switching the honest state off for the whole
  // screen, and `revealPicks` backfills to three unconditionally — so the
  // headline promised "three you would never have published yourself" over a
  // pleasantry and a list of languages spoken, each annotated "not enough signs
  // here to say anything definite". Show what actually clears the bar.
  const strong = top3.filter((p) => p.score >= BAND_USABLE);
  const shown = demo ? top3 : strong;
  const primary = top3.find((p) => p.score >= BAND_USABLE) || proofs.find((p) => p.score >= BAND_USABLE) || top3[0] || proofs[0];
  const thin = !demo && (!primary || primary.score < BAND_USABLE);
  if (!proofs.length) {
    return html`<div class="cold">
      <div class="cold__inner">
        <h1 class="cold__title">${t('firstLight.emptyTitle')}</h1>
        <p class="cold__body">${t('firstLight.emptyBody')}</p>
        <div class="cold__actions">
          ${button('goto', t('nav.mine'), { variant: 'primary', payload: { view: 'mine' } })}
        </div>
        ${noDocsBridge(t)}
      </div>
    </div>`;
  }

  return html`<div class="cold cold--reveal">
    <div class="cold__inner">
      ${demo ? html`<p class="demobar" role="note">${t('mine.demoWarning')}</p>` : ''}
      <h1 class="cold__title">
        ${demo ? t('firstLight.demoTitle', proofs.length) : t('firstLight.title', proofs.length)}
      </h1>
      <p class="cold__body">${demo ? t('firstLight.demoSubtitle') : t('firstLight.subtitle')}</p>
      <!--
        This screen is the first place a number and an allowed action level are
        put in front of somebody, and a measurement shown without saying what it
        measured reads as a ruling on whether the thing is true. Screen 0 does
        say the product takes your input as given, but it says it before there
        is any result to mistake for a verdict.
      -->
      <p class="cold__note" role="note">${t('firstLight.scoreScope')}</p>

      <h2 class="cold__step">
        ${thin ? t('firstLight.thinTitle') : t('firstLight.threeTitle')}
      </h2>
      ${thin ? html`<p class="cold__body">${t('firstLight.thinBody')}</p>` : ''}
      ${primary ? proofLoopCard(primary, t, proofs, signalCache, state, { thin }) : ''}

      <ol class="reveal">
        ${shown.map((proof, index) => revealCard(proof, index + 1, t, proofs, signalCache))}
      </ol>

      ${demo ? '' : expectedCard(state, primary, t)}
      ${thin ? noDocsBridge(t) : ''}
    </div>
  </div>`;
}

/**
 * The way out of the two dead ends on this screen.
 *
 * `emptyBody` and `thinBody` both close on the same instruction: bring more
 * material — a client email, a project write-up, a reference. That is a
 * complete answer for someone whose inbox holds one of those, and it is the
 * paste box again for someone whose work ended in a room and left no file
 * behind. The second person is the one this screen is hardest on, and the only
 * door it offered them led straight back to where they had just come from.
 *
 * The recall route is the machinery that *produces* those three documents, and
 * it was reachable only from screen 0, by a visitor who said up front that they
 * had nothing at all to paste. This is that same visitor, one paste later —
 * they simply did not know yet that the file they had was not the one that
 * counts.
 *
 * Rendered under the primary action rather than in place of it: pasting more is
 * still the faster route for whoever can, and this is the second door, not a
 * correction of the first.
 */
function noDocsBridge(t) {
  return html`<section class="cold__bridge">
    <h2 class="cold__step">${t('firstLight.noDocsTitle')}</h2>
    <p class="cold__body">${t('firstLight.noDocsBody')}</p>
    <div class="cold__actions">
      ${button('gotoRecall', t('firstLight.noDocsAction'), { variant: 'secondary' })}
    </div>
  </section>`;
}

/**
 * What the user said would hold their claim, beside what actually scored
 * highest.
 *
 * The onboarding collects `profile.expectedEvidence` and, until now, nothing
 * ever read it. This is the only place the answer can pay the user back.
 *
 * Three constraints shape it, and all three are constraints against the
 * obvious version of this feature:
 *
 * 1. **It runs after the three reveals, never before.** `docs/UX.md` requires
 *    credit before critique, for someone who has spent months being told they
 *    are not enough. The discoveries land first; this is a footnote to them.
 * 2. **It compares evidence to evidence, and nothing else.** The neighbouring
 *    idea — set `profile.fitConfidence` against L1's band — is not built and
 *    should not be. See the note on that field in `core/schema.js`.
 * 3. **It never says the user was wrong.** The comparison is token overlap,
 *    which cannot tell a blind spot from a miner that did not pick the line
 *    up. So the copy states the caveat rather than implying a verdict, and a
 *    match is reported as confirmation — which is also credit.
 *
 * Renders nothing at all when the field is empty. An unanswered optional
 * question must not produce a half-filled row.
 */
function expectedCard(state, primary, t) {
  const expected = state.profile?.expectedEvidence?.trim() || '';
  if (!expected || !primary) return '';
  const aligned = overlapsClaim(primary.claim, expected);

  return html`<section class="expected" aria-labelledby="expected-title">
    <h2 class="expected__title" id="expected-title">${t('firstLight.expectedTitle')}</h2>
    <dl class="expected__grid">
      <div class="expected__cell">
        <dt>${t('firstLight.expectedLabel')}</dt>
        <dd>${expected}</dd>
      </div>
      <div class="expected__cell">
        <dt>${t('firstLight.foundLabel')}</dt>
        <dd>${primary.claim}</dd>
      </div>
    </dl>
    <p class="expected__verdict">
      ${aligned ? t('firstLight.expectedAligned') : t('firstLight.expectedDiffers')}
    </p>
    ${aligned ? '' : html`<p class="expected__caveat">${t('firstLight.expectedCaveat')}</p>`}
  </section>`;
}

function proofLoopCard(proof, t, inventory, signalCache, state, { thin = false } = {}) {
  const reason = reasonFor(proof, inventory, signalCache);
  const archetype = proof.archetypes?.[0] || 'OUTCOME';
  const dimension = strongestDimension(proof.breakdown || {});
  const limit = transferLimit(proof);
  const claim = state.positioning?.claim?.trim() || '';
  const claimMatches = claim ? overlapsClaim(proof.claim, claim) : false;
  const blocked = thin || proof.score < BAND_USABLE || Boolean(claim && !claimMatches);
  const actionLevel = blocked ? 'R4' : 'R3';

  return html`<section class="proof-card" aria-labelledby="proof-card-title">
    <p class="proof-card__eyebrow">${t('proofCard.eyebrow')}</p>
    <h3 class="proof-card__title" id="proof-card-title">
      ${blocked ? t('proofCard.titleWeak') : t('proofCard.title')}
    </h3>
    <p class="proof-card__verdict">
      ${blocked ? t('proofCard.weakVerdict') : t('proofCard.readyVerdict')}
    </p>
    <p class="proof-card__authority">
      <b>${t('proofCard.actionLevelLabel')}</b> ${t(['proofCard', 'actionLevels', actionLevel])}
    </p>

    <dl class="proof-card__grid">
      <div class="proof-card__cell proof-card__cell--wide">
        <dt>${t('proofCard.traceLabel')}</dt>
        <dd class="proof-card__claim">${proof.claim}</dd>
      </div>
      <div class="proof-card__cell">
        <dt>${t('proofCard.mechanismLabel')}</dt>
        <dd>${reason ? t(reason.id.split('.'), reason.vars) : t(['proofCard', 'mechanisms', archetype])}</dd>
      </div>
      <div class="proof-card__cell">
        <dt>${t('proofCard.supportLabel')}</dt>
        <dd>
          ${claim && claimMatches
            ? t('proofCard.supportsSpecific', claim)
            : t(['proofCard', 'supports', archetype])}
        </dd>
      </div>
      <div class="proof-card__cell">
        <dt>${t('proofCard.confidenceLabel')}</dt>
        <dd>${t(['bands', proof.score >= 70 ? 'strong' : proof.score >= BAND_USABLE ? 'usable' : 'weak'])} · ${t(['dimensions', dimension])}</dd>
      </div>
      <div class="proof-card__cell">
        <dt>${t('proofCard.limitLabel')}</dt>
        <dd>${t(['proofCard', 'limits', limit])}</dd>
      </div>
    </dl>

    <div class="proof-card__actions">
      ${blocked
        ? button('goto', t('proofCard.strengthen'), { variant: 'primary', payload: { view: 'mine' } })
        : button('draft', t('proofCard.draft'), { variant: 'primary', payload: { id: proof.id } })}
      ${button('firstLightDone', t('proofCard.fullPicture'), { variant: 'ghost' })}
    </div>
  </section>`;
}

function overlapsClaim(proofClaim, targetClaim) {
  const proofTerms = contentTerms(proofClaim);
  const claimTerms = contentTerms(targetClaim);
  if (!proofTerms.size || !claimTerms.size) return false;
  let hits = 0;
  for (const term of claimTerms) {
    if (proofTerms.has(term)) hits += 1;
  }
  return hits >= 2 || hits / claimTerms.size >= 0.34;
}

function contentTerms(text = '') {
  return new Set(
    (text.toLowerCase().match(/[\p{L}\p{N}]+/gu) || [])
      .map((term) => term.replace(/^[והבכלש](?=.{3,})/u, ''))
      .filter((term) => term.length >= 3 && !SUPPORT_STOP_WORDS.has(term)),
  );
}

function strongestDimension(breakdown) {
  return Object.entries(breakdown).sort((a, b) => b[1] - a[1])[0]?.[0] || 'specificity';
}

function transferLimit(proof) {
  const breakdown = proof.breakdown || {};
  if ((breakdown.falsifiability ?? 0) < 45) return 'falsifiability';
  if ((breakdown.verification ?? 0) < 45) return 'verification';
  if ((breakdown.outcome ?? 0) < 45) return 'outcome';
  if (proof.kind === 'experience') return 'domain';
  return 'scope';
}

function revealCard(proof, rank, t, inventory, signalCache) {
  // A reason derived from the signals actually present in this claim, and where
  // possible from how it compares to the rest of the inventory. The previous
  // version printed a static definition of whichever dimension scored highest,
  // which was frequently a non-reason and sometimes plainly false against the
  // card it sat under — "someone else said this about you" over a sentence the
  // user wrote themselves.
  const reason = reasonFor(proof, inventory, signalCache);
  return html`<li class="reveal__item">
    <span class="reveal__rank">${rank}</span>
    <div>
      <p class="reveal__claim">${proof.claim}</p>
      <p class="reveal__why">
        <b>${t('firstLight.why')}:</b>
        ${reason ? t(reason.id.split('.'), reason.vars) : t('reasons.none')}
      </p>
      <span class="reveal__score">${scoreChip(proof.score, t, { size: 'sm' })}</span>
    </div>
  </li>`;
}
