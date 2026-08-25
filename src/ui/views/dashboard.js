/**
 * The dashboard.
 *
 * Order is the argument: the Visibility Gap first (the user's own conscious
 * pain, quantified), then the single Next Move, then the diagnosis, and only
 * then the six layers. The composite index is present but subordinate — it is
 * a summary, and a summary is not what gets someone to act at 2am.
 */

import { bidi, html } from '../html.js';
import { button, layerCard, notice, section } from '../components.js';
import { LAYER_KEYS } from '../../engine/layers.js';

/**
 * How many of the user's own lines the return bridge carries.
 *
 * Three, not the whole inventory: this is a bridge back into the work, not a
 * second inventory screen one scroll above the real one.
 */
export const BRIDGE_LINES = 3;

export function dashboardView(state, t, { authority, move, held = [] }) {
  const { gap, foundation, built, index, diagnosis, lowConfidence, gated } = authority;
  // The onboarding asked how long they had been at this. It changes the
  // register of one line — quietly, without a countdown or a guilt mechanic.
  const urgency = state.profile.weeksInMotion >= 40 ? 'long' : state.profile.weeksInMotion >= 12 ? 'months' : '';

  return html`<div class="stack">
    ${urgency ? html`<p class="urgency">${t(['dashboard', 'urgency', urgency])}</p>` : ''}
    ${gapCard(gap, foundation, built, index, lowConfidence, t)}
    ${bridgeCard(held, authority.demo, t)}
    ${moveCard(move, t)}
    ${diagnosisCard(diagnosis, gated, t)}
    ${section(
      t('nav.dashboard'),
      '',
      html`<div class="layers">
        ${LAYER_KEYS.map((key) => layerCard(key, authority.layers[key], t))}
      </div>`,
    )}
  </div>`;
}

function gapCard(gap, foundation, built, index, lowConfidence, t) {
  const f = Math.round(foundation);
  const b = Math.round(built);
  const direction = gap > 4 ? 'positive' : gap < -4 ? 'negative' : 'zero';

  return html`<section class="hero ${direction === 'negative' ? 'hero--stop' : ''}">
    <div class="hero__main">
      <p class="hero__label">${t('gap.label')}</p>
      <p class="hero__number ${direction === 'negative' ? 'is-negative' : ''}">
        ${bidi(gap > 0 ? `+${gap}` : String(gap))}
      </p>
      <p class="hero__sentence">
        ${direction === 'zero' ? t('gap.zero') : t(`gap.${direction}`, f, b)}
      </p>
      <p class="hero__explain">
        ${direction === 'negative' ? t('gap.explainNegative') : t('gap.explainPositive')}
      </p>
      ${lowConfidence ? html`<p class="hero__estimate">${t('gap.estimate')}</p>` : ''}
    </div>
    <div class="hero__side">
      <div class="hero__stat">
        <!-- L1 alone. This stat used to read "Evidence + Positioning" over a
             number containing no positioning at all, so a user who completed
             the form on the product's own instruction watched the figure it was
             labelled under stay frozen. -->
        <span>${t('layers.L1.name')}</span>
        <b>${bidi(f)}</b>
      </div>
      <div class="hero__stat">
        <span>${t('layers.L3.name')} → ${t('layers.L6.name')}</span>
        <b>${bidi(b)}</b>
      </div>
      <div class="hero__stat hero__stat--muted">
        <span>${t('gap.index')}</span>
        <b>${bidi(Math.round(index))}</b>
      </div>
    </div>
  </section>`;
}

/**
 * The return bridge: the user's own sentences, above the instruction.
 *
 * The move that produced the richest turns in the corpus was reading a person's
 * own words back to them, and the dashboard opened on a number with nothing of
 * theirs anywhere on it. These are the units they hold that nobody has seen —
 * the Visibility Gap in their own handwriting, sitting directly above the thing
 * they are being told to do about it. Credit before critique (`docs/UX.md`).
 *
 * **No clock, deliberately.** The version this replaces keyed off a
 * `lastActiveAt` and a thirty-day threshold — "welcome back, here is what you
 * were doing". Measuring absence is a re-engagement mechanic, and per
 * `docs/TELOS.md` a month away may be exactly the relief this product exists to
 * produce. So it renders on every visit, and the product never learns how long
 * anyone was gone.
 *
 * Renders nothing on bundled fixtures: "what you already wrote" over eight
 * sample sentences is the same lie First Light was repaired for.
 */
function bridgeCard(held, demo, t) {
  if (demo || !held.length) return '';
  return html`<section class="bridge" aria-labelledby="bridge-label">
    <p class="bridge__label" id="bridge-label">${t('bridge.label', held.length)}</p>
    <ul class="bridge__list">
      ${held.map((proof) => html`<li class="bridge__line">${proof.claim}</li>`)}
    </ul>
    <p class="bridge__note">${t('bridge.note')}</p>
  </section>`;
}

/**
 * The only element on the page styled as primary. If the user does nothing but
 * this card, repeatedly, that is the whole product working as intended.
 */
function moveCard(move, t) {
  // Move ids contain dots, so the array path form is required here.
  // The whole payload, not one field of it. This used to pass `daysLeft`
  // positionally, so every later move that wanted to name something concrete —
  // a person, a source — had no way to reach it and said "someone" instead.
  const why = t(['moves', move.id, 'why'], move.payload ?? {});

  return html`<section class="move">
    <div class="move__head">
      <span class="move__label">${t('moves.label')}</span>
      <span class="move__only">${t('moves.only')}</span>
    </div>
    <h2 class="move__title">${t(['moves', move.id, 'title'])}</h2>
    <p class="move__why">${typeof why === 'string' ? why : ''}</p>
    <div class="move__foot">
      ${button('goto', t('moves.do'), {
        variant: 'primary',
        payload: {
          view: move.view,
          proof: move.payload?.proofId || '',
          artifact: move.payload?.artifactId || '',
          archetype: move.payload?.play?.archetype || '',
          // So the gaps screen leads with the play the dashboard chose rather
          // than re-deciding and showing a menu of seven.
          play: move.payload?.play?.id || '',
        },
      })}
      <span class="move__meta">
        ${t('moves.minutes', move.effortMinutes)} · ${t(`layers.${move.layer}.name`)}
      </span>
    </div>
  </section>`;
}

function diagnosisCard(diagnosis, gated, t) {
  return section(
    t(`diagnosis.${diagnosis}.title`),
    '',
    html`<p class="prose">${t(`diagnosis.${diagnosis}.body`)}</p>
      ${gated ? notice('stop', t('gap.explainNegative')) : ''}`,
  );
}
