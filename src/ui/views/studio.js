/**
 * The drafting surface.
 *
 * The grounding verdict is rendered as a first-class element, not a footnote.
 * If the text contains a number that no cited proof unit contains, the user is
 * told before they publish — because at that point it stops being evidence and
 * the whole premise of the product is gone.
 */

import { bidi, html } from '../html.js';
import { button, field, notice, section, select, textArea, textInput } from '../components.js';
import { ANGLES, composeDraft, lengthAdvice, validateGrounding } from '../../engine/drafts.js';
import { activeProofs } from '../../engine/mine.js';
import { decayedScore } from '../../engine/score.js';
import { isConfigured } from '../../adapters/llm.js';

export function studioView(state, t, { now, selectedProofId, angle, cta, body, refining }) {
  const proofs = activeProofs(state).sort((a, b) => decayedScore(b, now) - decayedScore(a, now));
  const selected = proofs.find((p) => p.id === selectedProofId) || proofs[0] || null;

  if (!selected) {
    return html`<div class="stack">
      ${section(t('studio.title'), t('studio.subtitle'), html`<p class="prose">${t('inventory.empty')}</p>`)}
    </div>`;
  }

  const draft = composeDraft({ proofs: [selected], angle, cta, locale: state.locale });
  const text = body ?? draft.body;
  const advice = lengthAdvice(text);
  // Validate the *edited* text, not the generated one: the user can type
  // anything into the textarea, and that is exactly when this check matters.
  const liveGrounding = validateGrounding(text, [selected]);

  return html`<div class="stack">
    ${section(
      t('studio.title'),
      t('studio.subtitle'),
      html`
        ${field(
          'studio-proof',
          t('studio.pick'),
          select(
            'studio-proof',
            selected.id,
            proofs.map((p) => ({
              value: p.id,
              label: `${Math.round(decayedScore(p, now))} · ${p.claim.slice(0, 70)}`,
            })),
          ),
        )}
        ${selected.demo ? notice('warn', t('studio.demoWarning')) : ''}

        <div class="row">
          <div class="tabs" role="tablist" aria-label="${t('studio.angle')}">
            ${ANGLES.map(
              (a) => html`<button
                type="button"
                role="tab"
                class="tab ${a === angle ? 'is-on' : ''}"
                aria-selected="${a === angle}"
                data-act="setAngle"
                data-angle="${a}"
              >
                ${t(['studio', 'angles', a])}
              </button>`,
            )}
          </div>
          ${field(
            'studio-cta',
            t('studio.cta'),
            select('studio-cta', cta, [
              { value: 'none', label: t('studio.ctas.none') },
              { value: 'discussion', label: t('studio.ctas.discussion') },
              { value: 'dm', label: t('studio.ctas.dm') },
              { value: 'call', label: t('studio.ctas.call') },
            ]),
          )}
        </div>

        ${field('studio-body', t('studio.title'), textArea('studio-body', text, { rows: 14 }))}

        ${liveGrounding.ok
          ? notice('info', t('studio.grounded'))
          : notice('stop', t('studio.ungrounded', liveGrounding.unsupported.join(', ')))}

        <p class="studio__meta">
          ${t('studio.chars', advice.chars)}
          ${advice.tooShort ? html` · ${t('studio.tooShort')}` : ''}
          ${advice.tooLong ? html` · ${t('studio.tooLong')}` : ''}
        </p>
        <blockquote class="studio__fold">
          <span>${t('studio.fold')}</span>
          <p>${advice.beforeFold}</p>
        </blockquote>

        <div class="row">
          ${button('copyDraft', t('studio.copy'), { variant: 'primary' })}
          ${button('copyWithSources', t('studio.copyWithSources'), { variant: 'secondary' })}
          ${button('saveDraft', t('studio.save'), { variant: 'secondary' })}
          ${isConfigured(state.settings)
            ? button('refine', refining ? t('studio.refining') : t('studio.refine'), {
                variant: 'ghost',
                attrs: refining ? 'disabled' : '',
              })
            : html`<span class="hint">${t('studio.refineOff')}</span>`}
        </div>
      `,
    )}
    ${section(
      t('studio.markPublished'),
      '',
      html`
        ${field('studio-url', t('studio.urlLabel'), textInput('studio-url', ''))}
        <div class="row row--end">
          ${button('markPublished', t('studio.markPublished'), {
            variant: 'primary',
            payload: { id: selected.id },
            attrs: liveGrounding.ok ? '' : 'disabled',
          })}
        </div>
      `,
    )}
    ${state.artifacts.length
      ? section(
          t('nav.studio'),
          '',
          html`<ul class="drafts">
            ${state.artifacts
              .slice()
              .reverse()
              .slice(0, 8)
              .map(
                (a) => html`<li class="drafts__item">
                  <span class="tag">${a.status === 'published' ? '●' : '○'} ${a.channel}</span>
                  <p>${a.body.slice(0, 120)}</p>
                  <span class="hint">${bidi(a.proofIds.length)} · ${a.angle}</span>
                </li>`,
              )}
          </ul>`,
        )
      : ''}
  </div>`;
}
