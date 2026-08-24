/**
 * Settings — language, data ownership, and the optional BYOK rewriter.
 *
 * The LLM section states the browser-key security caveat in the UI itself
 * rather than burying it in documentation, because the person entering the key
 * is the one who carries the risk.
 *
 * Extraction has its own switch nested inside the rewriting one, and its own
 * disclosure, because it sends a whole document rather than a single draft. One
 * toggle covering both would have let the smaller consent authorise the larger
 * disclosure.
 */

import { html } from '../html.js';
import { button, field, notice, section, select, textInput } from '../components.js';

export function settingsView(state, t, { storageError }) {
  const llm = state.settings.llm;

  return html`<div class="stack">
    ${section(
      t('settings.title'),
      '',
      field(
        'set-locale',
        t('settings.language'),
        select('set-locale', state.locale, [
          { value: 'he', label: 'עברית' },
          { value: 'en', label: 'English' },
        ]),
      ),
    )}
    ${section(
      t('settings.data'),
      '',
      html`
        <p class="prose">${t('settings.dataBody')}</p>
        ${storageError ? notice('stop', t('settings.storageError')) : ''}
        <div class="row">
          ${button('exportData', t('settings.export'), { variant: 'secondary' })}
          <label class="btn btn--secondary" for="import-file">${t('settings.import')}</label>
          <input id="import-file" class="visually-hidden" type="file" accept="application/json" />
          ${button('resetData', t('settings.reset'), { variant: 'ghost' })}
        </div>
      `,
    )}
    ${section(
      t('settings.llm'),
      '',
      html`
        <p class="prose">${t('settings.llmBody')}</p>
        <label class="switch">
          <input type="checkbox" id="llm-enabled" ${llm.enabled ? checkedAttr : ''} />
          <span>${t('settings.llmEnable')}</span>
        </label>
        ${llm.enabled
          ? html`
              ${field('llm-key', t('settings.llmKey'), textInput('llm-key', llm.apiKey, { type: 'password' }))}
              ${field('llm-model', t('settings.llmModel'), textInput('llm-model', llm.model, { placeholder: 'claude-sonnet-5' }))}

              <div class="divider"></div>

              <p class="prose">${t('settings.llmExtractBody')}</p>
              <label class="switch">
                <input type="checkbox" id="llm-extract" ${llm.extract ? checkedAttr : ''} />
                <span>${t('settings.llmExtract')}</span>
              </label>
              ${notice('info', t('settings.llmExtractNote'))}
            `
          : ''}
        ${notice('info', t('settings.llmNever'))}
        <div class="row row--end">${button('saveSettings', t('common.save'), { variant: 'primary' })}</div>
      `,
    )}
  </div>`;
}

const checkedAttr = html`checked`;
