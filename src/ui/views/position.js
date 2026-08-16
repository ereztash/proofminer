/**
 * Positioning (L2).
 *
 * Editing here re-ranks the entire evidence inventory, which is the product's
 * central claim: evidence is not strong in the abstract, it is strong for
 * someone specific.
 */

import { html } from '../html.js';
import { button, field, meter, notice, section, textArea, textInput } from '../components.js';
import { detectDrift, scorePositioning } from '../../engine/positioning.js';

export function positionView(state, t) {
  // Recognitions are not optional here. Dropping them left the defensibility
  // meter pinned at the unvouched floor of 20 while L2 — which passes them —
  // computed 88 from the same state, so the one component the user cannot
  // raise by typing was invisible to the person who had actually earned it.
  const result = scorePositioning(state.positioning, state.recognitions || []);
  const drift = detectDrift(state);
  const p = state.positioning;

  return html`<div class="stack">
    ${section(
      t('position.title'),
      t('position.subtitle'),
      html`
        ${field(
          'pos-audience',
          t('position.audience'),
          textInput('pos-audience', p.audience, { hint: true }),
          t('position.audienceHint'),
        )}
        ${field(
          'pos-transformation',
          t('position.transformation'),
          textInput('pos-transformation', p.transformation, { hint: true }),
          t('position.transformationHint'),
        )}
        ${field(
          'pos-claim',
          t('position.claim'),
          textInput('pos-claim', p.claim, { hint: true }),
          t('position.claimHint'),
        )}
        ${field(
          'pos-offer',
          t('position.offer'),
          textInput('pos-offer', p.offer, { hint: true }),
          t('position.offerHint'),
        )}
        ${field(
          'pos-nongoals',
          t('position.nonGoals'),
          textArea('pos-nongoals', p.nonGoals.join('\n'), { rows: 3, hint: true }),
          t('position.nonGoalsHint'),
        )}
        <div class="row row--end">
          ${button('savePositioning', t('position.rescore'), { variant: 'primary' })}
        </div>
      `,
    )}
    ${section(
      t('position.issues'),
      '',
      html`
        <div class="meters">
          ${Object.entries(result.components).map(([key, value]) =>
            meter(t(['position', key]), value, {
              help: key === 'defensibility' ? t('position.defensibilityHint') : '',
            }),
          )}
        </div>
        ${result.issues.length
          ? html`<ul class="issues">
              ${result.issues.map(
                (issue) => html`<li class="issues__item issues__item--sev${issue.severity}">
                  ${t(['position', 'issue', issue.id])}
                </li>`,
              )}
            </ul>`
          : notice('info', t('gaps.allCovered'))}
      `,
    )}
    ${drift?.drifting
      ? section(
          t('position.drift.title'),
          '',
          notice(
            'warn',
            t(
              'position.drift.body',
              t(['archetypes', drift.topArchetype]),
              Math.round(drift.convertingShare * 100),
              Math.round(drift.publishedShare * 100),
            ),
          ),
        )
      : ''}
  </div>`;
}
