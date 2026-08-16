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
          ${situationOption('independent', situation, t('onboarding.trackIndependent'), t('onboarding.trackIndependentHint'))}
          ${situationOption('job', situation, t('onboarding.trackJob'), t('onboarding.trackJobHint'))}
        </div>
        ${situationOption(NOT_ME, situation, t('onboarding.notMe'), t('onboarding.notMeHint'), 'choice__opt--wide')}
      </fieldset>

      ${situation === NOT_ME ? notForYou(t) : ''}
      ${situation && situation !== NOT_ME ? coldStartBody(t, weeks, ui) : ''}
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

function coldStartBody(t, weeks, ui) {
  return html`<div class="cold__step-block">
    <fieldset class="choice">
      <legend>${t('onboarding.weeksQuestion')}</legend>
      <div class="choice__row choice__row--tight">
        ${weeksOption(0, weeks, t('onboarding.weeksNotYet'))}
        ${weeksOption(12, weeks, t('onboarding.weeksMonths'))}
        ${weeksOption(40, weeks, t('onboarding.weeksLong'))}
      </div>
    </fieldset>

    <p class="pledge__lead">${t('onboarding.pledgeLead')}</p>

    <h2 class="cold__step">${t('onboarding.firstStepTitle')}</h2>
    <p class="cold__body">${t('onboarding.firstStepBody')}</p>

    ${field(
      'cold-paste',
      t('onboarding.firstStepTitle'),
      // Rendered from the cache, not blank: answering the situation question
      // re-renders this screen, and a paste box that empties itself when the
      // user answers a question above it is the cruellest possible bug here.
      textArea('cold-paste', ui.formCache?.['cold-paste'] ?? '', {
        placeholder: t('onboarding.placeholder'),
        rows: 9,
      }),
      '',
      { hideLabel: true },
    )}

    <div class="cold__actions">
      ${button('coldStart', t('onboarding.analyze'), { variant: 'primary' })}
      ${button('coldSample', t('onboarding.orSample'), { variant: 'ghost' })}
    </div>

    <details class="pledge">
      <summary class="pledge__title">${t('onboarding.pledgeTitle')}</summary>
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
  if (!proofs.length) {
    return html`<div class="cold">
      <div class="cold__inner">
        <h1 class="cold__title">${t('firstLight.emptyTitle')}</h1>
        <p class="cold__body">${t('firstLight.emptyBody')}</p>
        <div class="cold__actions">
          ${button('goto', t('nav.mine'), { variant: 'primary', payload: { view: 'mine' } })}
        </div>
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

      <h2 class="cold__step">${t('firstLight.threeTitle')}</h2>
      <ol class="reveal">
        ${top3.map((proof, index) => revealCard(proof, index + 1, t, proofs, signalCache))}
      </ol>

      <div class="cold__actions">
        ${button('firstLightDone', t('firstLight.continue'), { variant: 'primary' })}
      </div>
    </div>
  </div>`;
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
