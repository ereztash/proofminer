/**
 * Measurement (L4-L6) and the calibration readout.
 *
 * This is the least glamorous screen and the most load-bearing one. Without
 * these numbers the two feedback integrations cannot run, and without those
 * this product ranks evidence the same way for every user forever — which is
 * exactly what every competing tool does.
 */

import { bidi, html } from '../html.js';
import { button, field, notice, section, select, textInput } from '../components.js';
import { CONVERSION_TYPES, RECOGNITION_TYPES } from '../../core/schema.js';
import { MIN_OBSERVATIONS, buildObservations, calibrationDelta } from '../../engine/feedback.js';

export function measureView(state, t) {
  const published = state.artifacts.filter((a) => a.status === 'published');
  const measuredIds = new Set(state.receptions.map((r) => r.artifactId));
  const pending = published.filter((a) => !measuredIds.has(a.id));
  const observations = buildObservations(state);
  const calibrated = state.calibration.weights;

  return html`<div class="stack">
    ${section(
      t('measure.title'),
      t('measure.subtitle'),
      published.length
        ? html`
            ${pending.length ? notice('warn', t('measure.pending', pending.length)) : ''}
            ${field(
              'rc-artifact',
              t('measure.artifact'),
              select(
                'rc-artifact',
                pending[0]?.id || published[0]?.id || '',
                published.map((a) => ({
                  value: a.id,
                  label: `${measuredIds.has(a.id) ? '● ' : '○ '}${a.body.slice(0, 60)}`,
                })),
              ),
            )}
            <div class="grid grid--3">
              ${field('rc-impressions', t('measure.impressions'), textInput('rc-impressions', '', { type: 'number' }))}
              ${field('rc-reactions', t('measure.reactions'), textInput('rc-reactions', '', { type: 'number' }))}
              ${field('rc-comments', t('measure.comments'), textInput('rc-comments', '', { type: 'number' }))}
              ${field(
                'rc-substantive',
                t('measure.substantive'),
                textInput('rc-substantive', '', { type: 'number', hint: true }),
                t('measure.substantiveHint'),
              )}
              ${field('rc-saves', t('measure.saves'), textInput('rc-saves', '', { type: 'number' }))}
              ${field('rc-shares', t('measure.shares'), textInput('rc-shares', '', { type: 'number' }))}
            </div>
            <div class="row row--end">
              ${button('saveReception', t('measure.save'), { variant: 'primary' })}
            </div>
          `
        : html`<p class="prose">${t(['layers', 'lockedReason', 'nothing-published'])}</p>`,
    )}
    ${section(
      t('measure.calibrationTitle'),
      '',
      html`
        ${calibrated
          ? html`
              <p class="prose">${t('measure.calibrationActive', state.calibration.observations)}</p>
              <ul class="calib">
                ${calibrationDelta(calibrated)
                  .slice(0, 5)
                  .map(
                    (row) => html`<li class="calib__row">
                      <span>${t(['dimensions', row.key])}</span>
                      <b class="${row.delta > 0 ? 'is-up' : row.delta < 0 ? 'is-down' : ''}">
                        ${bidi(row.delta > 0 ? `+${row.delta}` : String(row.delta))}
                      </b>
                    </li>`,
                  )}
              </ul>
              <p class="hint">${t('measure.calibrationExcluded')}</p>
            `
          : notice(
              'info',
              t('measure.calibrationNeed', Math.max(0, MIN_OBSERVATIONS - observations.length)),
            )}
      `,
    )}
    ${section(
      t('measure.conversions'),
      '',
      html`
        <div class="row">
          ${select(
            'cv-type',
            'call',
            CONVERSION_TYPES.map((type) => ({
              value: type,
              label: t(['measure', 'conversionTypes', type]),
            })),
          )}
          ${textInput('cv-note', '', { placeholder: t('measure.note') })}
          ${button('addConversion', t('measure.addConversion'), { variant: 'secondary' })}
        </div>
        ${state.conversions.length
          ? html`<ul class="events">
              ${state.conversions
                .slice()
                .reverse()
                .slice(0, 8)
                .map(
                  (c) => html`<li>
                    <span class="tag">${t(['measure', 'conversionTypes', c.type])}</span>
                    ${c.note}
                  </li>`,
                )}
            </ul>`
          : ''}
      `,
    )}
    ${section(
      t('measure.recognitions'),
      '',
      html`
        <div class="row">
          ${select(
            'rg-type',
            'citation',
            RECOGNITION_TYPES.map((type) => ({
              value: type,
              label: t(['measure', 'recognitionTypes', type]),
            })),
          )}
          ${textInput('rg-by', '', { placeholder: t('measure.by') })}
          ${textInput('rg-url', '', { placeholder: t('measure.link') })}
          ${button('addRecognition', t('measure.addRecognition'), { variant: 'secondary' })}
        </div>
        ${state.recognitions.length
          ? html`<ul class="events">
              ${state.recognitions
                .slice()
                .reverse()
                .slice(0, 8)
                .map(
                  (r) => html`<li>
                    <span class="tag">${t(['measure', 'recognitionTypes', r.type])}</span>
                    ${r.by}
                  </li>`,
                )}
            </ul>`
          : ''}
      `,
    )}
  </div>`;
}
