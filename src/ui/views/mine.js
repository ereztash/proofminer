/**
 * Sources — where raw material enters the system.
 */

import { html } from '../html.js';
import { button, field, notice, section, textArea } from '../components.js';

export function mineView(state, t) {
  const hasDemo = state.sources.some((s) => s.demo);

  return html`<div class="stack">
    ${section(
      t('mine.title'),
      t('mine.subtitle'),
      html`
        ${field(
          'paste',
          t('mine.paste'),
          textArea('paste', '', { placeholder: t('onboarding.placeholder'), rows: 8 }),
          '',
          { hideLabel: true },
        )}
        <div class="row">
          ${button('addText', t('mine.addSource'), { variant: 'primary' })}
          ${button('addSample', t('mine.sample'), { variant: 'ghost' })}
        </div>

        <div class="divider"></div>

        ${field(
          'file',
          t('mine.file'),
          html`<input class="input" type="file" id="file" accept=".txt,.md,text/plain,text/markdown" multiple />`,
          t('mine.fileHint'),
        )}
      `,
    )}
    ${hasDemo ? notice('warn', t('mine.demoWarning')) : ''}
    ${section(
      t('mine.sourcesCount', state.sources.length),
      '',
      html`
        ${state.sources.length
          ? html`<ul class="sources">
              ${state.sources.map(
                (source) => html`<li class="sources__item">
                  <div>
                    <b>${source.name}</b>
                    ${source.demo ? html`<span class="tag tag--demo">${t('mine.demoBadge')}</span>` : ''}
                    <p class="sources__preview">${source.text.slice(0, 160)}</p>
                  </div>
                  ${button('removeSource', t('mine.remove'), {
                    variant: 'ghost',
                    payload: { id: source.id },
                  })}
                </li>`,
              )}
            </ul>`
          : ''}
        <div class="row row--end">
          ${button('mine', t('mine.run'), {
            variant: 'primary',
            disabled: state.sources.length === 0,
          })}
        </div>
      `,
    )}
  </div>`;
}
