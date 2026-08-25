/**
 * The recall route, and the to-do list it produces.
 *
 * Two blocks, and the order between them is the argument. The questions ask
 * for a memory; the list turns that memory into errands addressed to people
 * whose names the user just wrote down. Nothing here is scored — see the
 * module comment in `engine/recall.js` for why that is the whole point — and
 * the screen says so in the first line rather than in a footnote, because a
 * box that looks like the paste box and behaves differently has to say which
 * one it is before anyone types into it.
 */

import { html } from '../html.js';
import { button, field, notice, textArea, textInput } from '../components.js';
import { openRetrievals } from '../../engine/recall.js';

const openAttr = html`open`;

/** Every control in the recall form, cleared together or not at all. */
export const RECALL_FIELDS = ['recall-project', 'recall-room', 'recall-ending'];

/**
 * The three questions.
 *
 * Rendered open when there is nothing else on the screen — that visitor is
 * exactly who this is for — and collapsed once real sources exist, where it is
 * a second route in rather than the main event.
 *
 * `ui.recallOpen` is the third case, and it is a visitor who looks like the
 * second and is really the first: sources exist, they yielded nothing, and
 * First Light sent them here on purpose. Routing someone to a collapsed
 * `<details>` and letting them hunt for it undoes the routing.
 */
export function recallCard(state, t, ui = {}) {
  const cache = ui.formCache || {};
  const expanded = state.sources.length === 0 || Boolean(ui.recallOpen);

  return html`<details class="card recall" ${expanded ? openAttr : ''}>
    <summary class="recall__summary">
      <span class="card__title">${t('recall.title')}</span>
      <span class="recall__hint">${t('recall.summaryHint')}</span>
    </summary>
    <p class="card__lead">${t('recall.subtitle')}</p>
    ${notice('info', t('recall.notEvidence'))}

    ${field(
      'recall-project',
      t('recall.projectQuestion'),
      textInput('recall-project', cache['recall-project'] ?? '', {
        placeholder: t('recall.projectPlaceholder'),
      }),
      t('recall.projectHint'),
    )}
    ${field(
      'recall-room',
      t('recall.roomQuestion'),
      textArea('recall-room', cache['recall-room'] ?? '', {
        placeholder: t('recall.roomPlaceholder'),
        rows: 3,
      }),
      t('recall.roomHint'),
    )}
    ${field(
      'recall-ending',
      t('recall.endingQuestion'),
      textArea('recall-ending', cache['recall-ending'] ?? '', {
        placeholder: t('recall.endingPlaceholder'),
        rows: 3,
      }),
      t('recall.endingHint'),
    )}

    <div class="row row--end">
      ${button('saveRecall', t('recall.build'), { variant: 'primary' })}
    </div>
  </details>`;
}

/**
 * The tasks themselves.
 *
 * Renders nothing when there are none — an empty to-do list on the screen of
 * someone who has just been told they have no evidence is one more zero.
 *
 * Closed tasks stay, collapsed. They are the record that the loop worked, and
 * for this user that record is worth more than the tidiness of deleting it.
 */
export function retrievalList(state, t) {
  const all = state.retrievals || [];
  if (!all.length) return '';
  const open = openRetrievals(state);
  const closed = all.filter((r) => Number.isFinite(r.closedAt));

  return html`<section class="card">
    <header class="card__head">
      <div>
        <h3 class="card__title">${t('recall.tasksTitle', open.length)}</h3>
        <p class="card__lead">${t('recall.tasksLead')}</p>
      </div>
    </header>

    ${open.length
      ? html`<ul class="retrievals">${open.map((r) => retrievalCard(r, t))}</ul>`
      : notice('info', t('recall.allClosed'))}

    ${closed.length
      ? html`<details class="retrievals__closed">
          <summary>${t('recall.closedCount', closed.length)}</summary>
          <ul class="retrievals">
            ${closed.map(
              (r) => html`<li class="retrieval retrieval--closed">
                <b class="retrieval__who">${r.recipient}</b>
                <span class="retrieval__about">${r.about}</span>
              </li>`,
            )}
          </ul>
        </details>`
      : ''}
  </section>`;
}

function retrievalCard(retrieval, t) {
  const asked = Number.isFinite(retrieval.askedAt);

  return html`<li class="retrieval">
    <div class="retrieval__head">
      <b class="retrieval__who">${retrieval.recipient}</b>
      ${asked ? html`<span class="tag">${t('recall.sentTag')}</span>` : ''}
    </div>

    <p class="retrieval__ask">
      ${retrieval.about
        ? t('recall.askLine', retrieval.recipient, retrieval.about)
        : t('recall.askLineBare', retrieval.recipient)}
    </p>

    ${retrieval.recalled
      ? html`<div class="retrieval__memory">
          <span class="retrieval__memoryLabel">${t('recall.memoryLabel')}</span>
          <q class="retrieval__memoryText">${retrieval.recalled}</q>
        </div>`
      : ''}

    <div class="row">
      ${asked
        ? ''
        : button('retrievalSent', t('recall.markSent'), {
            variant: 'secondary',
            payload: { id: retrieval.id },
          })}
      ${button('retrievalArrived', t('recall.markArrived'), {
        variant: 'primary',
        payload: { id: retrieval.id },
      })}
      ${button('retrievalDrop', t('recall.drop'), {
        variant: 'ghost',
        payload: { id: retrieval.id },
      })}
    </div>
  </li>`;
}
