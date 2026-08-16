/**
 * The gap engine's surface (integration I3).
 *
 * This view is the difference between a ranker and a companion: it does not
 * only tell the user what they have, it tells them exactly what to go and get,
 * in what order, and how long each one takes.
 *
 * **One play is primary.** This screen used to render all seven uncovered
 * archetypes as equally weighted cards with no buttons on any of them, so the
 * Next Move — the product's one-action promise — landed on a menu, and the
 * play the dashboard had chosen was indistinguishable from the six it had
 * rejected. The chosen play now leads, carries the action that collects the
 * evidence, and the rest fold away beneath it.
 */

import { html } from '../html.js';
import { button, notice, section } from '../components.js';
import { acquisitionPlays, archetypeCoverage, stalingProofs } from '../../engine/gaps.js';

export function gapsView(state, t, { now, selectedPlay = null }) {
  const coverage = archetypeCoverage(state, now);
  const plays = acquisitionPlays(state, now);
  const staling = stalingProofs(state, now);

  // The play the Next Move sent them here for, when there is one.
  const lead = plays.find((p) => p.id === selectedPlay) ?? plays[0] ?? null;
  const rest = plays.filter((p) => p !== lead);

  return html`<div class="stack">
    ${lead ? playCard(lead, t, { primary: true }) : notice('info', t('gaps.allCovered'))}

    ${rest.length
      ? html`<details class="plays-more">
          <summary class="plays-more__title">${t('gaps.otherPlays', rest.length)}</summary>
          <div class="stack">${rest.map((play) => playCard(play, t, { primary: false }))}</div>
        </details>`
      : ''}

    ${section(
      t('gaps.title'),
      t('gaps.subtitle'),
      html`<div class="coverage">
        ${coverage.map(
          (c) => html`<div class="coverage__item ${c.covered ? 'is-covered' : ''}">
            <span class="coverage__name">${t(['archetypes', c.archetype])}</span>
            <span class="coverage__state">
              ${c.covered ? t('gaps.covered') : t('gaps.notCovered')}
            </span>
            <span class="coverage__best">${t('gaps.bestOf', c.best, c.threshold)}</span>
          </div>`,
        )}
      </div>`,
    )}

    ${staling.length
      ? section(
          t('inventory.decayed'),
          '',
          html`<ul class="staling">
            ${staling.slice(0, 5).map(
              (entry) => html`<li>
                <span class="staling__days">${t('inventory.stale', entry.daysLeft)}</span>
                <p>${entry.proof.claim}</p>
                ${button('draft', t('inventory.draft'), {
                  variant: 'secondary',
                  payload: { id: entry.proof.id },
                })}
              </li>`,
            )}
          </ul>`,
        )
      : ''}
  </div>`;
}

function playCard(play, t, { primary }) {
  return html`<section class="play ${primary ? 'play--primary' : ''}">
    <h3 class="play__title">${t(['plays', play.id, 'title'])}</h3>
    <p class="play__body">${t(['plays', play.id, 'body'])}</p>
    <p class="play__needs">${t(['plays', play.id, 'needs'])}</p>

    ${play.shortOfBar
      ? // Closing the loop the reviewer found open: the play was re-issued
        // every fortnight, identical, with no acknowledgement that the user had
        // already gone and done it and the result had landed short.
        notice('warn', t('gaps.shortOfBar', play.currentBest, play.threshold))
      : ''}

    <p class="play__meta">
      ${t(['archetypes', play.archetype])} · ${t('gaps.effort', play.effortMinutes)}
    </p>

    ${primary
      ? html`<div class="row row--end">
          ${button('goto', t('gaps.collect'), {
            variant: 'primary',
            payload: { view: 'mine', archetype: play.archetype },
          })}
        </div>`
      : ''}
  </section>`;
}
