/**
 * The evidence inventory.
 *
 * Order inside every row is fixed by docs/UX.md: what is strong comes before
 * what is missing. This audience has spent months being told they are not
 * enough; leading each row with a deficit would reproduce that experience.
 */

import { bidi, html } from '../html.js';
import { button, meter, scoreChip, section, select } from '../components.js';
import { daysUntilStale, decayedScore, extremes } from '../../engine/score.js';
import { activeProofs } from '../../engine/mine.js';
import { DIMENSION_KEYS } from '../../engine/dimensions.js';

export function inventoryView(state, t, { now, filter, expanded }) {
  const active = activeProofs(state);
  const hidden = state.proofs.length - active.length;

  const archetypes = [...new Set(active.flatMap((p) => p.archetypes))];
  const filtered =
    filter === 'all' ? active : active.filter((p) => p.archetypes.includes(filter));

  const sorted = [...filtered].sort(
    (a, b) =>
      Number(b.pinned) - Number(a.pinned) ||
      decayedScore(b, now) - decayedScore(a, now),
  );

  return html`<div class="stack">
    ${section(
      t('inventory.title'),
      '',
      sorted.length
        ? html`<div class="inventory">${sorted.map((p) => row(p, t, now, expanded))}</div>`
        : html`<p class="prose">${t('inventory.empty')}</p>`,
      html`<div class="row">
        ${select('inv-filter', filter, [
          { value: 'all', label: t('inventory.filterAll') },
          ...archetypes.map((a) => ({ value: a, label: t(['archetypes', a]) })),
        ])}
        ${hidden ? button('showHidden', t('inventory.hidden', hidden), { variant: 'ghost' }) : ''}
      </div>`,
    )}
  </div>`;
}

function row(proof, t, now, expanded) {
  const decayed = Math.round(decayedScore(proof, now));
  const { strongest, weakest } = extremes(proof.breakdown);
  const staleDays = daysUntilStale(proof, now);
  const isOpen = expanded.has(proof.id);

  return html`<article class="proof ${proof.pinned ? 'is-pinned' : ''}">
    <div class="proof__score">
      ${scoreChip(decayed, t, { size: 'lg' })}
      ${decayed !== Math.round(proof.score)
        ? html`<span class="proof__decay">${t('inventory.decayed')} · ${bidi(Math.round(proof.score))}</span>`
        : ''}
    </div>

    <div class="proof__main">
      <p class="proof__claim">${proof.claim}</p>
      <p class="proof__meta">
        ${t('inventory.source')}: ${proof.sourceName} · ${t(['inventory', 'origin', proof.origin])}
        ${proof.demo ? html` · <span class="tag tag--demo">${t('mine.demoBadge')}</span>` : ''}
      </p>
      <p class="proof__strong">
        <b>${t('inventory.strong')}:</b> ${strongest ? t(['dimensions', strongest]) : t('common.none')}
      </p>
      <p class="proof__missing">
        <b>${t('inventory.missing')}:</b> ${weakest ? t(['missing', weakest]) : t('common.none')}
      </p>
      ${proof.archetypes.length
        ? html`<p class="proof__tags">
            ${proof.archetypes.map((a) => html`<span class="tag">${t(['archetypes', a])}</span>`)}
          </p>`
        : ''}
      ${staleDays !== null && staleDays <= 90
        ? html`<p class="proof__stale">${t('inventory.stale', Math.max(0, staleDays))}</p>`
        : ''}
    </div>

    <div class="proof__actions">
      ${button('draft', t('inventory.draft'), { variant: 'primary', payload: { id: proof.id } })}
      ${button('pin', proof.pinned ? '★' : '☆', {
        variant: 'ghost',
        payload: { id: proof.id },
        attrs: `aria-label="${t('inventory.pin')}" aria-pressed="${proof.pinned}"`,
      })}
      ${button('dismiss', t('inventory.hide'), { variant: 'ghost', payload: { id: proof.id } })}
      ${button('expand', t('inventory.detail'), {
        variant: 'ghost',
        payload: { id: proof.id },
        attrs: `aria-expanded="${isOpen}" aria-controls="bd-${proof.id}"`,
      })}
    </div>

    <div class="proof__breakdown ${isOpen ? '' : 'is-hidden'}" id="bd-${proof.id}">
      ${DIMENSION_KEYS.filter((k) => Number.isFinite(proof.breakdown[k])).map((key) =>
        meter(t(['dimensions', key]), proof.breakdown[key], { help: t(['dimensionHelp', key]) }),
      )}
    </div>
  </article>`;
}
