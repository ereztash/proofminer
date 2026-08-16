/**
 * Application shell: routing, rendering, and the action table.
 *
 * The whole UI is a pure function of (state, ephemeral view state) rendered
 * into one root, with a single delegated click handler dispatching to a table
 * of named actions. That keeps every mutation in one readable place and means
 * no view holds a reference to the DOM it produced.
 */

import { createStore } from '../core/store.js';
import { LEGACY_STORAGE_KEY } from '../core/schema.js';
import { makeId, now as realNow } from '../core/util.js';
import { translator } from '../i18n/index.js';
import { html, renderInto } from './html.js';
import { sampleFor } from '../data/sample.js';

import { isDemoMode, mineSources, rescoreProofs } from '../engine/mine.js';
import { computeAuthority, nextMove } from '../engine/authority.js';
import { revealPicks } from '../engine/explain.js';
import { parseAnalyticsPaste } from '../engine/analytics.js';
import { activeWeights, calibrate, compound } from '../engine/feedback.js';
import { provenanceFooter } from '../engine/drafts.js';
import { refineDraft } from '../adapters/llm.js';
import { sortByDesc } from '../core/util.js';
import { decayedScore } from '../engine/score.js';

import { firstLightView, onboardingView } from './views/onboarding.js';
import { dashboardView } from './views/dashboard.js';
import { mineView } from './views/mine.js';
import { positionView } from './views/position.js';
import { inventoryView } from './views/inventory.js';
import { gapsView } from './views/gaps.js';
import { studioView } from './views/studio.js';
import { measureView } from './views/measure.js';
import { settingsView } from './views/settings.js';

const VIEWS = ['dashboard', 'mine', 'position', 'inventory', 'gaps', 'studio', 'measure', 'settings'];

/**
 * Ephemeral view state. Deliberately *not* persisted: which tab is open and
 * which row is expanded are not part of the user's evidence base, and writing
 * them to storage on every click is how the persisted state ends up churning.
 */
const ui = {
  view: 'dashboard',
  screen: 'app', // 'onboarding' | 'firstLight' | 'app'
  filter: 'all',
  expanded: new Set(),
  /** Text-field values that must survive a re-render. Cleared on submit. */
  formCache: {},
  /** Numbers extracted from a pasted analytics block, pre-filling the form. */
  parsedAnalytics: {},
  selectedProofId: null,
  angle: 'direct',
  cta: 'none',
  draftBody: null,
  /** Artifact this studio session is editing, so save+publish is one record. */
  artifactId: null,
  refining: false,
  toast: '',
};

export function mountApp(root) {
  const store = createStore();
  let state = store.get();

  if (!state.profile.onboarded) ui.screen = 'onboarding';

  /**
   * Live value of a form control.
   *
   * Values also land in `ui.formCache` on input, because a full re-render
   * re-emits every control at its *default* value. A debounced render from
   * typing a draft silently wiped the URL field next to it, and clicking "add
   * conversion" wiped the six reception numbers above it — producing a
   * published artifact with no link and an all-zero reception record.
   */
  const val = (id) => {
    const live = root.querySelector(`#${CSS.escape(id)}`)?.value;
    if (live !== undefined && live !== '') return live;
    return ui.formCache[id] ?? live ?? '';
  };
  const intVal = (id) => {
    const n = Number.parseInt(val(id), 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  };

  /** Drop view state that points at records the new state no longer contains. */
  function resetEphemeral() {
    ui.selectedProofId = null;
    ui.artifactId = null;
    ui.draftBody = null;
    ui.expanded = new Set();
    ui.formCache = {};
    ui.parsedAnalytics = {};
    ui.filter = 'all';
  }

  let toastTimer = null;
  function toast(message) {
    ui.toast = message;
    render();
    if (toastTimer !== null) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastTimer = null;
      ui.toast = '';
      render();
    }, 2400);
  }

  /** Re-mine and re-rank, then run the compounding integration. */
  function remine() {
    store.update((draft) => {
      const weights = activeWeights(draft);
      draft.proofs = mineSources(draft, { now: realNow(), weights });
      const created = compound(draft, { now: realNow() });
      if (created.length) draft.proofs = sortByDesc([...draft.proofs, ...created], (p) => p.score);
    });
  }

  /** Recompute calibrated weights and re-score the inventory with them. */
  function recalibrate() {
    store.update((draft) => {
      const result = calibrate(draft);
      draft.calibration = {
        weights: result.weights,
        observations: result.observations,
        confidence: result.confidence,
        updatedAt: result.weights ? realNow() : draft.calibration.updatedAt,
      };
      if (result.weights) {
        draft.proofs = rescoreProofs(draft.proofs, {
          positioning: draft.positioning,
          weights: result.weights,
          now: realNow(),
        });
      }
    });
  }

  /**
   * Write the studio's current draft to state as one artifact.
   *
   * Saving a draft and then marking it published used to push two separate
   * records with identical bodies — an undeletable orphan in the studio list
   * and a double count in the L3 cadence. The draft this session created is
   * updated in place instead.
   */
  function upsertArtifact({ status, url = '' }) {
    const body = val('studio-body');
    const proofId = currentProofId();
    if (!body.trim() || !proofId) return false;
    store.update((draft) => {
      const existing = ui.artifactId && draft.artifacts.find((a) => a.id === ui.artifactId);
      if (existing) {
        existing.body = body;
        existing.proofIds = [proofId];
        existing.angle = ui.angle;
        existing.status = status;
        if (url) existing.url = url;
        if (status === 'published' && !existing.publishedAt) existing.publishedAt = realNow();
        return;
      }
      const created = {
        id: makeId('art'),
        proofIds: [proofId],
        channel: 'post',
        angle: ui.angle,
        body,
        status,
        publishedAt: status === 'published' ? realNow() : null,
        url,
        createdAt: realNow(),
      };
      draft.artifacts.push(created);
      ui.artifactId = created.id;
    });
    return true;
  }

  const actions = {
    goto(payload) {
      if (VIEWS.includes(payload.view)) ui.view = payload.view;
      if (payload.proof) ui.selectedProofId = payload.proof;
      ui.screen = 'app';
    },

    coldStart() {
      const text = val('cold-paste').trim();
      const track = root.querySelector('input[name="track"]:checked')?.value || 'independent';
      const weeks = Number.parseInt(
        root.querySelector('input[name="weeks"]:checked')?.value ?? '0',
        10,
      );
      if (!text) {
        toast(state.locale === 'en' ? 'Paste something first' : 'הדבק משהו קודם');
        return;
      }
      store.update((draft) => {
        draft.profile.track = track;
        draft.profile.weeksInMotion = Number.isFinite(weeks) ? weeks : 0;
        draft.profile.onboarded = true;
        draft.sources.push({
          id: makeId('src'),
          name: state.locale === 'en' ? 'First source' : 'מקור ראשון',
          text,
          demo: false,
          addedAt: realNow(),
        });
      });
      remine();
      ui.screen = 'firstLight';
    },

    coldSample() {
      const sample = sampleFor(state.locale);
      store.update((draft) => {
        draft.profile.onboarded = true;
        draft.sources.push({
          id: makeId('src'),
          name: sample.name,
          text: sample.text,
          demo: true,
          addedAt: realNow(),
        });
      });
      remine();
      ui.screen = 'firstLight';
    },

    firstLightDone() {
      store.update((draft) => {
        draft.profile.sawFirstLight = true;
      });
      ui.screen = 'app';
      ui.view = 'dashboard';
    },

    addText() {
      const text = val('paste').trim();
      if (!text) return;
      store.update((draft) => {
        draft.sources.push({
          id: makeId('src'),
          name: `${state.locale === 'en' ? 'Text' : 'טקסט'} ${draft.sources.length + 1}`,
          text,
          demo: false,
          addedAt: realNow(),
        });
      });
    },

    addSample() {
      const sample = sampleFor(state.locale);
      store.update((draft) => {
        draft.sources.push({
          id: makeId('src'),
          name: sample.name,
          text: sample.text,
          demo: true,
          addedAt: realNow(),
        });
      });
    },

    removeSource(payload) {
      store.update((draft) => {
        draft.sources = draft.sources.filter((s) => s.id !== payload.id);
        draft.proofs = draft.proofs.filter((p) => p.sourceId !== payload.id);
      });
    },

    mine() {
      remine();
      ui.view = 'inventory';
    },

    savePositioning() {
      store.update((draft) => {
        draft.positioning = {
          audience: val('pos-audience'),
          transformation: val('pos-transformation'),
          claim: val('pos-claim'),
          offer: val('pos-offer'),
          nonGoals: val('pos-nongoals')
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean),
        };
        draft.proofs = rescoreProofs(draft.proofs, {
          positioning: draft.positioning,
          weights: activeWeights(draft),
          now: realNow(),
        });
      });
    },

    pin(payload) {
      store.update((draft) => {
        const proof = draft.proofs.find((p) => p.id === payload.id);
        if (proof) proof.pinned = !proof.pinned;
      });
    },

    dismiss(payload) {
      store.update((draft) => {
        const proof = draft.proofs.find((p) => p.id === payload.id);
        if (proof) proof.dismissed = true;
      });
    },

    showHidden() {
      store.update((draft) => {
        for (const proof of draft.proofs) proof.dismissed = false;
      });
    },

    expand(payload) {
      if (ui.expanded.has(payload.id)) ui.expanded.delete(payload.id);
      else ui.expanded.add(payload.id);
    },

    draft(payload) {
      ui.selectedProofId = payload.id;
      ui.draftBody = null;
      ui.artifactId = null;
      ui.view = 'studio';
      ui.screen = 'app';
    },

    setAngle(payload) {
      ui.angle = payload.angle;
      ui.draftBody = null;
    },

    async copyDraft() {
      const body = val('studio-body');
      await writeClipboard(body);
      toast(t('studio.copied'));
    },

    async copyWithSources() {
      const body = val('studio-body');
      const proof = state.proofs.find((p) => p.id === currentProofId());
      const footer = proof ? provenanceFooter([proof], state.locale) : '';
      await writeClipboard(body + footer);
      toast(t('studio.copied'));
    },

    saveDraft() {
      upsertArtifact({ status: 'draft' });
      toast(t('studio.save'));
    },

    markPublished() {
      if (!upsertArtifact({ status: 'published', url: val('studio-url') })) return;
      delete ui.formCache['studio-url'];
      ui.view = 'measure';
    },

    async refine() {
      const proof = state.proofs.find((p) => p.id === currentProofId());
      if (!proof) return;
      // Restated at the point of the action, not only in Settings: this is the
      // one moment the user's evidence leaves the device, and the first-screen
      // pledge told them nothing ever would.
      if (!globalThis.confirm?.(t('settings.refineDisclosure'))) return;
      ui.refining = true;
      render();
      const result = await refineDraft({
        settings: state.settings,
        body: val('studio-body'),
        proofs: [proof],
        locale: state.locale,
      });
      ui.refining = false;
      if (result.ok) {
        ui.draftBody = result.body;
        render();
      } else {
        toast(result.reason === 'ungrounded' ? t('studio.refineFailed') : `${result.reason}`);
      }
    },

    saveReception() {
      const artifactId = val('rc-artifact');
      if (!artifactId) return;
      const comments = intVal('rc-comments');
      const record = {
        impressions: intVal('rc-impressions'),
        reactions: intVal('rc-reactions'),
        comments,
        substantiveComments: Math.min(intVal('rc-substantive'), comments),
        saves: intVal('rc-saves'),
        shares: intVal('rc-shares'),
      };
      // An all-zero record is a mis-click, not a measurement, and it poisons
      // the baseline every other artifact is scored against.
      const total =
        record.reactions + record.comments + record.saves + record.shares + record.impressions;
      if (total === 0) {
        toast(t('measure.empty'));
        return;
      }
      store.update((draft) => {
        draft.receptions.push({
          id: makeId('rcp'),
          artifactId,
          ...record,
          capturedAt: realNow(),
        });
      });
      for (const key of ['rc-impressions', 'rc-reactions', 'rc-comments', 'rc-substantive', 'rc-saves', 'rc-shares', 'rc-paste']) delete ui.formCache[key];
      ui.parsedAnalytics = {};
      toast(t('measure.saved'));
      // Both feedback integrations run on new reception data.
      recalibrate();
      store.update((draft) => {
        const created = compound(draft, { now: realNow() });
        if (created.length) draft.proofs = sortByDesc([...draft.proofs, ...created], (p) => p.score);
      });
    },

    parsePaste() {
      const { found, matched } = parseAnalyticsPaste(val('rc-paste'));
      if (!matched) {
        toast(t('measure.pasteFailed'));
        return;
      }
      ui.parsedAnalytics = found;
      for (const [key, value] of Object.entries(found)) {
        ui.formCache[`rc-${key}`] = String(value);
      }
    },

    addConversion() {
      const artifactId = val('cv-artifact');
      store.update((draft) => {
        draft.conversions.push({
          id: makeId('cnv'),
          type: val('cv-type'),
          // Attribution is what makes integration I4 possible at all: without
          // it, `detectDrift` filters on `artifactId` and returns null in every
          // state the app can produce.
          artifactId: artifactId || null,
          note: val('cv-note'),
          at: realNow(),
        });
      });
      delete ui.formCache['cv-note'];
    },

    addRecognition() {
      store.update((draft) => {
        draft.recognitions.push({
          id: makeId('rec'),
          type: val('rg-type'),
          by: val('rg-by'),
          url: val('rg-url'),
          at: realNow(),
        });
      });
    },

    saveSettings() {
      store.update((draft) => {
        draft.settings.llm.enabled = root.querySelector('#llm-enabled')?.checked ?? false;
        if (draft.settings.llm.enabled) {
          draft.settings.llm.apiKey = val('llm-key');
          draft.settings.llm.model = val('llm-model');
        } else {
          // Disabling clears the key. Leaving a credential in storage after the
          // user turned the feature off would be indefensible.
          draft.settings.llm.apiKey = '';
        }
      });
      toast(t('common.save'));
    },

    exportData() {
      const blob = new Blob([JSON.stringify(store.exportSnapshot(), null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `proofminer-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    },

    resetData() {
      if (!globalThis.confirm?.(t('settings.resetConfirm'))) return;
      // "There is no undo" has to be true of the pre-rewrite key as well, or a
      // returning v1 user's CV and client material survive the wipe.
      try {
        globalThis.localStorage?.removeItem(LEGACY_STORAGE_KEY);
      } catch {
        // Storage unavailable; nothing to clear.
      }
      store.replace({});
      resetEphemeral();
      ui.screen = 'onboarding';
      ui.view = 'dashboard';
    },
  };

  let t = translator(state.locale);

  /**
   * The proof the studio is actually showing.
   *
   * This must resolve identically to `studioView`'s own selection or a draft
   * gets saved citing a different proof than the one on screen — which breaks
   * the single guarantee the product is built on. The shared fallback is why
   * it re-checks membership of the active set rather than trusting the stored
   * id: dismissing or removing the selected proof used to leave the view
   * rendering one unit and the save action writing another.
   */
  const currentProofId = () => {
    const active = state.proofs.filter((p) => !p.dismissed);
    if (!active.length) return null;
    if (ui.selectedProofId && active.some((p) => p.id === ui.selectedProofId)) {
      return ui.selectedProofId;
    }
    return sortByDesc(active, (p) => decayedScore(p, realNow()))[0].id;
  };

  function body() {
    const nowTs = realNow();

    if (ui.screen === 'onboarding') return onboardingView(state, t);

    if (ui.screen === 'firstLight') {
      const active = state.proofs.filter((p) => !p.dismissed);
      const ranked = sortByDesc(active, (p) => p.score);
      return firstLightView(state, t, { proofs: ranked, top3: revealPicks(ranked) });
    }

    switch (ui.view) {
      case 'mine':
        return mineView(state, t);
      case 'position':
        return positionView(state, t);
      case 'inventory':
        return inventoryView(state, t, {
          now: nowTs,
          filter: ui.filter,
          expanded: ui.expanded,
        });
      case 'gaps':
        return gapsView(state, t, { now: nowTs });
      case 'studio':
        return studioView(state, t, {
          now: nowTs,
          selectedProofId: currentProofId(),
          angle: ui.angle,
          cta: ui.cta,
          body: ui.draftBody,
          refining: ui.refining,
        });
      case 'measure':
        return measureView(state, t, { parsed: ui.parsedAnalytics });
      case 'settings':
        return settingsView(state, t, { storageError: Boolean(store.persistError()) });
      default:
        return dashboardView(state, t, {
          authority: computeAuthority(state, nowTs),
          move: nextMove(state, nowTs),
        });
    }
  }

  function chrome(inner) {
    if (ui.screen !== 'app') return inner;
    return html`
      <a class="skip" href="#main">${t('nav.skip')}</a>
      <header class="topbar">
        <div class="brand">
          <h1>${t('app.name')}</h1>
          <p>${t('app.tagline')}</p>
        </div>
        <nav class="nav" aria-label="${t('nav.dashboard')}">
          ${VIEWS.map(
            (view) => html`<button
              type="button"
              class="nav__item ${view === ui.view ? 'is-on' : ''}"
              data-act="goto"
              data-view="${view}"
              aria-current="${view === ui.view ? 'page' : 'false'}"
            >
              ${t(['nav', view])}
            </button>`,
          )}
        </nav>
      </header>
      ${isDemoMode(state)
        ? html`<p class="demobar" role="note">${t('mine.demoWarning')}</p>`
        : ''}
      <main id="main" class="main" tabindex="-1">${inner}</main>
    `;
  }

  // Kept outside the re-rendered tree: a live region that is destroyed and
  // recreated on every render is not tracked by assistive technology.
  const liveRegion = document.createElement('div');
  liveRegion.className = 'toast';
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', 'polite');
  root.after(liveRegion);

  function render() {
    state = store.get();
    t = translator(state.locale);
    document.documentElement.lang = state.locale;
    document.documentElement.dir = state.locale === 'he' ? 'rtl' : 'ltr';
    document.documentElement.classList.toggle('reduce-motion', state.settings.reduceMotion);

    // Full re-render destroys focus, which makes the whole app unusable from a
    // keyboard: pinning three proofs meant tabbing from the top of the document
    // three times. Fields are restored by id; buttons carry no id, so they are
    // restored by their action and payload instead.
    const active = document.activeElement;
    const activeId = active?.id;
    const activeAct = active?.dataset?.act;
    const activeKey = active?.dataset?.id ?? active?.dataset?.view ?? '';
    const selectionStart = active?.selectionStart;

    renderInto(root, chrome(body()));

    let restored = null;
    if (activeId) {
      restored = root.querySelector(`#${CSS.escape(activeId)}`);
    } else if (activeAct) {
      restored = [...root.querySelectorAll(`[data-act="${CSS.escape(activeAct)}"]`)].find(
        (el) => (el.dataset.id ?? el.dataset.view ?? '') === activeKey,
      );
    }
    liveRegion.textContent = ui.toast;

    if (restored) {
      restored.focus();
      if (typeof selectionStart === 'number' && 'setSelectionRange' in restored) {
        try {
          restored.setSelectionRange(selectionStart, selectionStart);
        } catch {
          // Not all input types support selection ranges.
        }
      }
    }
  }

  // ---- Event wiring: one delegated listener per event type. ----

  root.addEventListener('click', (event) => {
    const target = event.target.closest('[data-act]');
    if (!target) return;
    const act = actions[target.dataset.act];
    if (!act) return;
    event.preventDefault();
    const result = act({ ...target.dataset });
    if (result instanceof Promise) {
      result.then(render, () => render());
    } else {
      render();
    }
  });

  root.addEventListener('change', async (event) => {
    const el = event.target;
    if (el.id && el.type !== 'file' && el.type !== 'checkbox') ui.formCache[el.id] = el.value;
    if (el.id === 'inv-filter') {
      ui.filter = el.value;
      render();
    } else if (el.id === 'studio-proof') {
      ui.selectedProofId = el.value;
      ui.draftBody = null;
      ui.artifactId = null;
      render();
    } else if (el.id === 'studio-cta') {
      ui.cta = el.value;
      ui.draftBody = null;
      render();
    } else if (el.id === 'set-locale') {
      store.update((draft) => {
        draft.locale = el.value;
      });
      render();
    } else if (el.id === 'llm-enabled') {
      // Persist immediately rather than on Save: leaving the UI showing the
      // feature as off while the credential is still in storage is the kind of
      // gap a user cannot see and would not forgive.
      const enabled = el.checked;
      store.update((draft) => {
        draft.settings.llm.enabled = enabled;
        if (!enabled) draft.settings.llm.apiKey = '';
      });
      render();
    } else if (el.id === 'file') {
      await ingestFiles(el.files);
    } else if (el.id === 'import-file') {
      await importFile(el.files?.[0]);
    }
  });

  // Keep the edited draft in ephemeral state so re-renders do not discard it,
  // and re-render on a short debounce so the grounding verdict updates while
  // the user types. A verdict that only appears on the next click is a verdict
  // the user learns about after they have already copied the text out.
  let draftTimer = null;
  root.addEventListener('input', (event) => {
    if (event.target.id) ui.formCache[event.target.id] = event.target.value;
    if (event.target.id !== 'studio-body') return;
    ui.draftBody = event.target.value;
    if (draftTimer !== null) clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
      draftTimer = null;
      render();
    }, 250);
  });

  async function ingestFiles(fileList) {
    const files = [...(fileList || [])];
    if (!files.length) return;
    const MAX_BYTES = 2_000_000;
    const readable = files.filter((f) => f.size <= MAX_BYTES);
    const texts = await Promise.all(readable.map((f) => f.text().then((text) => ({ f, text }))));
    store.update((draft) => {
      for (const { f, text } of texts) {
        if (!text.trim()) continue;
        draft.sources.push({
          id: makeId('src'),
          name: f.name,
          text,
          demo: false,
          addedAt: realNow(),
        });
      }
    });
    if (readable.length < files.length) {
      toast(state.locale === 'en' ? 'Some files were too large' : 'חלק מהקבצים גדולים מדי');
    } else {
      render();
    }
  }

  async function importFile(file) {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      store.replace(parsed);
      resetEphemeral();
      ui.screen = store.get().profile.onboarded ? 'app' : 'onboarding';
      render();
    } catch {
      toast(state.locale === 'en' ? 'Could not read that file' : 'לא הצלחנו לקרוא את הקובץ');
    }
  }

  globalThis.addEventListener?.('beforeunload', () => store.flush());

  render();
  return { store, render };
}

async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Clipboard API is unavailable in insecure contexts; fall back silently
    // rather than throwing into a click handler.
  }
}
