/**
 * What the market wrote back — kept in the market's own words, and measured
 * by nothing.
 *
 * The measurement screen took six numbers and nothing else. But the strongest
 * output of this whole loop is not a number: it is the sentence a real
 * recipient actually used, which is where a claim gets its language and where a
 * user finds out that the thing they call *process design* the market calls
 * *stopping the fires*. That sentence had nowhere to live, so it was lost every
 * time.
 *
 * **This is a notebook, and the screen says so before the box.** Four fields up
 * sits `substantiveComments`, weight 6 in L4. `verification` is the
 * highest-weighted dimension in the proof scorer. A field captioned "what did
 * they reply" that fed either one would make *the client said I am the best* a
 * scorable input, typed one screen away from the numbers it would move — so
 * nothing here is read by any layer, dimension, conversion, drift check or
 * `nonGoals` entry, and none of it becomes a proof unit. The refusal is pinned
 * in `tests/engine/replies.test.js` the same way the recall route's is.
 *
 * The route to making a reply count is the ordinary one and the copy says it:
 * if those words arrived in an email, paste the email into sources. A document
 * the user was sent is evidence; a document the user retyped into a box the
 * product put in front of them is a declaration, and the verbatim gate cannot
 * tell the two apart — see honesty rule 8 in `docs/METHOD.md`.
 *
 * **Verbatim is a commitment, not a label.** Nothing is trimmed out of the
 * middle, nothing is truncated in the list, and the text renders with its line
 * breaks intact (`.reply__text` is `pre-wrap`). A reply reflowed into one
 * paragraph is no longer the thing that was said.
 */

import { html } from '../html.js';
import { button, field, notice, section, select, textArea } from '../components.js';
import { sortByDesc } from '../../core/util.js';

/** Every control in the reply form, cleared together or not at all. */
export const REPLY_FIELDS = ['rp-text'];

/** Newest first. `at` is authoritative, not array order. */
export const repliesNewestFirst = (state) => sortByDesc(state.replies || [], (r) => r.at);

export function repliesCard(state, t, ui = {}) {
  const published = state.artifacts.filter((a) => a.status === 'published');
  // Same gate as the reception form above it: with nothing published there is
  // nothing for a reply to be a reply *to*, and the screen already says so.
  if (!published.length) return '';

  const replies = repliesNewestFirst(state);
  const artifactById = new Map(state.artifacts.map((a) => [a.id, a]));

  return section(
    t('replies.title'),
    t('replies.subtitle'),
    html`
      ${notice('info', t('replies.notCounted'))}

      ${field(
        'rp-artifact',
        t('replies.artifact'),
        select(
          'rp-artifact',
          published[published.length - 1]?.id || '',
          published.map((a) => ({ value: a.id, label: a.body.slice(0, 60) })),
        ),
      )}
      ${field(
        'rp-text',
        t('replies.text'),
        textArea('rp-text', ui.formCache?.['rp-text'] ?? '', {
          placeholder: t('replies.placeholder'),
          rows: 4,
          hint: true,
        }),
        t('replies.hint'),
      )}
      <div class="row row--end">
        ${button('saveReply', t('replies.save'), { variant: 'secondary' })}
      </div>

      ${replies.length
        ? html`<ul class="replies">
            ${replies.map((reply) => replyItem(reply, artifactById, t))}
          </ul>`
        : ''}
    `,
  );
}

function replyItem(reply, artifactById, t) {
  const artifact = reply.artifactId ? artifactById.get(reply.artifactId) : null;

  return html`<li class="reply">
    <blockquote class="reply__text">${reply.text}</blockquote>
    <p class="reply__about">
      ${artifact ? t('replies.inAnswerTo', artifact.body.slice(0, 60)) : t('replies.unattached')}
    </p>
    <div class="row row--end">
      ${button('removeReply', t('replies.remove'), {
        variant: 'ghost',
        payload: { id: reply.id },
      })}
    </div>
  </li>`;
}
