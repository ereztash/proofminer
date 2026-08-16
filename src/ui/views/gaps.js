/**
 * The gap engine's surface (integration I3).
 *
 * This view is the difference between a ranker and a companion: it does not
 * only tell the user what they have, it tells them exactly what to go and get,
 * in what order, and how long each one takes.
 */

import { html } from '../html.js';
import { button, notice, section } from '../components.js';
import { acquisitionPlays, archetypeCoverage } from '../../engine/gaps.js';
import { stalingProofs } from '../../engine/gaps.js';

export function gapsView(state, t, { now }) {
  const coverage = archetypeCoverage(state, now);
  const plays = acquisitionPlays(state, now);
  const staling = stalingProofs(state, now);

  return html`<div class="stack">
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
            <span class="coverage__best">${t('gaps.best')}: ${c.best}</span>
          </div>`,
        )}
      </div>`,
    )}
    ${plays.length
      ? html`<div class="stack">
          ${plays.map(
            (play) => html`<section class="play">
              <h3 class="play__title">${t(['plays', play.id, 'title'])}</h3>
              <p class="play__body">${t(['plays', play.id, 'body'])}</p>
              <p class="play__meta">
                ${t(['archetypes', play.archetype])} · ${t('gaps.effort', play.effortMinutes)}
              </p>
            </section>`,
          )}
        </div>`
      : notice('info', t('gaps.allCovered'))}
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
