/**
 * Cold start and First Light (docs/UX.md).
 *
 * The actor arrives in a shame state after weeks of unanswered applications.
 * The first screen therefore carries no navigation, no score, and no dashboard
 * of zeros — one sentence that names what they already feel, one paste box,
 * and the anti-hype pledge, because the second pain (revulsion at
 * self-promotion) has to be neutralised before they will paste anything
 * personal.
 */

import { html } from '../html.js';
import { button, field, textArea } from '../components.js';
import { scoreBand } from '../../engine/score.js';
import { reasonFor } from '../../engine/explain.js';

export function onboardingView(state, t) {
  const track = state.profile.track;
  const weeks = state.profile.weeksInMotion;

  return html`<div class="cold">
    <div class="cold__inner">
      <h1 class="cold__title">${t('onboarding.painTitle')}</h1>
      <p class="cold__body">${t('onboarding.painBody')}</p>

      <div class="pledge">
        <h2 class="pledge__title">${t('onboarding.pledgeTitle')}</h2>
        <ul class="pledge__list">
          ${t('onboarding.pledge').map((line) => html`<li>${line}</li>`)}
        </ul>
      </div>

      <h2 class="cold__step">${t('onboarding.firstStepTitle')}</h2>
      <p class="cold__body">${t('onboarding.firstStepBody')}</p>

      ${field(
        'cold-paste',
        t('onboarding.firstStepTitle'),
        textArea('cold-paste', '', { placeholder: t('onboarding.placeholder'), rows: 9 }),
        '',
        { hideLabel: true },
      )}

      <div class="cold__actions">
        ${button('coldStart', t('onboarding.analyze'), { variant: 'primary' })}
        ${button('coldSample', t('onboarding.orSample'), { variant: 'ghost' })}
      </div>

      <p class="cold__aside">${t('onboarding.twoMore')}</p>

      <fieldset class="choice">
        <legend>${t('onboarding.trackQuestion')}</legend>
        <div class="choice__row">
          ${trackOption('independent', track, t('onboarding.trackIndependent'), t('onboarding.trackIndependentHint'))}
          ${trackOption('job', track, t('onboarding.trackJob'), t('onboarding.trackJobHint'))}
        </div>
      </fieldset>

      <fieldset class="choice">
        <legend>${t('onboarding.weeksQuestion')}</legend>
        <div class="choice__row choice__row--tight">
          ${weeksOption(0, weeks, t('onboarding.weeksNotYet'))}
          ${weeksOption(12, weeks, t('onboarding.weeksMonths'))}
          ${weeksOption(40, weeks, t('onboarding.weeksLong'))}
        </div>
      </fieldset>

    </div>
  </div>`;
}

const trackOption = (value, current, label, hint) => html`<label
  class="choice__opt ${value === current ? 'is-on' : ''}"
>
  <input type="radio" name="track" value="${value}" ${value === current ? checkedAttr : ''} />
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
 */
export function firstLightView(state, t, { proofs, top3 }) {
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
      <h1 class="cold__title">${t('firstLight.title', proofs.length)}</h1>
      <p class="cold__body">${t('firstLight.subtitle')}</p>

      <h2 class="cold__step">${t('firstLight.threeTitle')}</h2>
      <ol class="reveal">
        ${top3.map((proof, index) => revealCard(proof, index + 1, t, proofs))}
      </ol>

      <div class="cold__actions">
        ${button('firstLightDone', t('firstLight.continue'), { variant: 'primary' })}
      </div>
    </div>
  </div>`;
}

function revealCard(proof, rank, t, inventory) {
  // A reason derived from the signals actually present in this claim, and where
  // possible from how it compares to the rest of the inventory. The previous
  // version printed a static definition of whichever dimension scored highest,
  // which was frequently a non-reason and sometimes plainly false against the
  // card it sat under — "someone else said this about you" over a sentence the
  // user wrote themselves.
  const reason = reasonFor(proof, inventory);
  return html`<li class="reveal__item">
    <span class="reveal__rank">${rank}</span>
    <div>
      <p class="reveal__claim">${proof.claim}</p>
      <p class="reveal__why">
        <b>${t('firstLight.why')}:</b>
        ${reason ? t(reason.id.split('.'), reason.vars) : t('reasons.none')}
      </p>
      <span class="reveal__score score--${scoreBand(proof.score)}">${Math.round(proof.score)}</span>
    </div>
  </li>`;
}
