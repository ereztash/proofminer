/**
 * Shared presentational pieces.
 *
 * Two rules run through all of them, both from docs/UX.md:
 *  - no meaning is carried by colour alone — every band and state also carries
 *    a text label, so the UI is readable in monochrome and by a screen reader;
 *  - absence of data renders as *not started*, never as *failing*.
 */

import { bidi, cx, html, raw } from './html.js';
import { scoreBand } from '../engine/score.js';

export const bandOf = scoreBand;

/** Score chip with its textual band. */
export function scoreChip(score, t, { size = 'md' } = {}) {
  const band = bandOf(score);
  return html`<span
    class="${cx('score', `score--${band}`, size === 'lg' && 'score--lg', size === 'sm' && 'score--sm')}"
  >
    <b>${Math.round(score)}</b><span class="score__band">${t(`bands.${band}`)}</span>
  </span>`;
}

/** Horizontal meter. `label` and the numeric value are always both present. */
export function meter(label, value, { help = '' } = {}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return html`<div class="meter" ${help ? html`title="${help}"` : ''}>
    <span class="meter__label">${label}</span>
    <span
      class="meter__track"
      role="meter"
      aria-valuenow="${pct}"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="${label}"
    >
      <i style="inline-size:${pct}%"></i>
    </span>
    <b class="meter__value">${bidi(pct)}</b>
  </div>`;
}

/** Small tag pill. */
export const tag = (text, variant = '') =>
  html`<span class="${cx('tag', variant && `tag--${variant}`)}">${text}</span>`;

/**
 * Layer card. A locked layer shows why it is locked and what unlocks it —
 * it never shows a zero with a red indicator.
 */
export function layerCard(key, layer, t) {
  if (layer.locked) {
    return html`<div class="layer layer--locked">
      <span class="layer__key">${key}</span>
      <h4 class="layer__name">${t(`layers.${key}.name`)}</h4>
      <p class="layer__locked">${t('layers.locked')}</p>
      <p class="layer__hint">${t(`layers.lockedReason.${layer.reason}`)}</p>
    </div>`;
  }
  const lowConfidence = layer.confidence < 0.4;
  return html`<div class="${cx('layer', `layer--${bandOf(layer.score)}`)}">
    <span class="layer__key">${key}</span>
    <h4 class="layer__name">${t(`layers.${key}.name`)}</h4>
    <div class="layer__score"><b>${Math.round(layer.score)}</b></div>
    <p class="layer__hint">${t(`layers.${key}.question`)}</p>
    ${lowConfidence ? html`<p class="layer__warn">${t('layers.confidenceLow')}</p>` : ''}
  </div>`;
}

/** Section wrapper with an optional lead line. */
export const section = (title, lead, body, extra = '') => html`<section class="card">
  <header class="card__head">
    <div>
      <h3 class="card__title">${title}</h3>
      ${lead ? html`<p class="card__lead">${lead}</p>` : ''}
    </div>
    ${extra}
  </header>
  ${body}
</section>`;

/** Labelled field. `id` is required so the label actually binds. */
export const field = (id, label, control, hint = '') => html`<div class="field">
  <label class="field__label" for="${id}">${label}</label>
  ${control}
  ${hint ? html`<p class="field__hint" id="${id}-hint">${hint}</p>` : ''}
</div>`;

export const textInput = (id, value, { placeholder = '', hint = false, type = 'text' } = {}) =>
  html`<input
    class="input"
    id="${id}"
    name="${id}"
    type="${type}"
    value="${value ?? ''}"
    placeholder="${placeholder}"
    ${hint ? html`aria-describedby="${id}-hint"` : ''}
  />`;

export const textArea = (id, value, { placeholder = '', rows = 5, hint = false } = {}) =>
  html`<textarea
    class="input input--area"
    id="${id}"
    name="${id}"
    rows="${rows}"
    placeholder="${placeholder}"
    ${hint ? html`aria-describedby="${id}-hint"` : ''}
  >${value ?? ''}</textarea>`;

export const select = (id, value, options) =>
  html`<select class="input" id="${id}" name="${id}">
    ${options.map(
      (opt) =>
        html`<option value="${opt.value}" ${opt.value === value ? raw_selected : ''}>
          ${opt.label}
        </option>`,
    )}
  </select>`;

// Static raw fragment, defined once rather than rebuilt per option.
const raw_selected = html`selected`;

/** Empty state. Never phrased as a failure. */
export const empty = (title, body, action = '') => html`<div class="empty">
  <h4>${title}</h4>
  <p>${body}</p>
  ${action}
</div>`;

/** Inline notice. `tone` is one of: info, warn, stop. */
export const notice = (tone, body) =>
  html`<p class="${cx('notice', `notice--${tone}`)}" role="${tone === 'stop' ? 'alert' : 'note'}">
    ${body}
  </p>`;

/** Primary/secondary/ghost button. Actions are dispatched by `data-act`. */
export const button = (act, label, { variant = 'secondary', payload = {}, attrs = '' } = {}) => {
  const data = Object.entries(payload)
    .map(([key, value]) => html`data-${key}="${value}"`)
    .filter(Boolean);
  return html`<button
    type="button"
    class="${cx('btn', `btn--${variant}`)}"
    data-act="${act}"
    ${data}
    ${attrs ? raw(attrs) : ''}
  >
    ${label}
  </button>`;
};
