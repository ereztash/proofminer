/**
 * Application shell: routing, rendering, and the action table.
 *
 * The whole UI is a pure function of (state, ephemeral view state) rendered
 * into one root, with a single delegated click handler dispatching to a table
 * of named actions. That keeps every mutation in one readable place and means
 * no view holds a reference to the DOM it produced.
 */

import { createStore, stripImportedCredentials } from '../core/store.js';
import { LEGACY_STORAGE_KEY } from '../core/schema.js';
import { makeId, now as realNow } from '../core/util.js';
import { translator } from '../i18n/index.js';
import { html, renderInto } from './html.js';
import { sampleFor } from '../data/sample.js';

import { isDemoMode, mineSources, realProofs, rescoreProofs } from '../engine/mine.js';
import { computeAuthority, nextMove, unpublishedProofs } from '../engine/authority.js';
import { revealPicks } from '../engine/explain.js';
import { parseAnalyticsPaste } from '../engine/analytics.js';
import { activeWeights, calibrate, compound } from '../engine/feedback.js';
import { provenanceFooter } from '../engine/drafts.js';
import { draftRetrievals } from '../engine/recall.js';
import { MAX_SOURCE_CHARS, extractClaims, refineDraft } from '../adapters/llm.js';
import { sortByDesc } from '../core/util.js';
import { BAND_USABLE, decayedScore } from '../engine/score.js';

import { NOT_ME, firstLightView, onboardingView } from './views/onboarding.js';
import { RECALL_FIELDS } from './views/recall.js';
import { REPLY_FIELDS } from './views/replies.js';
import { BRIDGE_LINES, dashboardView } from './views/dashboard.js';
import { mineView } from './views/mine.js';
import { positionView } from './views/position.js';
import { inventoryView } from './views/inventory.js';
import { gapsView } from './views/gaps.js';
import { studioView } from './views/studio.js';
import { measureView } from './views/measure.js';
import { settingsView } from './views/settings.js';

/** Every field of the reception form, cleared together or not at all. */
const RECEPTION_FIELDS = [
  'rc-impressions', 'rc-reactions', 'rc-comments',
  'rc-substantive', 'rc-saves', 'rc-shares', 'rc-paste',
];

const VIEWS = ['dashboard', 'mine', 'position', 'inventory', 'gaps', 'studio', 'measure', 'settings'];

/**
 * Ephemeral view state. Deliberately *not* persisted: which tab is open and
 * which row is expanded are not part of the user's evidence base, and writing
 * them to storage on every click is how the persisted state ends up churning.
 */
const ui = {
  view: 'dashboard',
  screen: 'app', // 'onboarding' | 'firstLight' | 'app'
  /**
   * Which situation the visitor recognised on the first screen, including
   * `NOT_ME`. Held here rather than in the profile because "this is not my
   * problem" is not a track — it must never be written into the record as one.
   */
  situation: null,
  /** Play the Next Move routed to, so the gaps screen leads with that one. */
  selectedPlay: null,
  /** Answer to the awareness-clock question, null until explicitly given. */
  weeks: null,
  filter: 'all',
  expanded: new Set(),
  /** Text-field values that must survive a re-render. Cleared on submit. */
  formCache: {},
  /**
   * Whether the recall room was opened on purpose, by someone routed there
   * from First Light. The card opens itself for a visitor with no sources at
   * all; this is the other case — sources exist, they just yielded nothing —
   * and without the flag that person lands on a collapsed `<details>` and has
   * to find it.
   */
  recallOpen: false,
  /** Numbers extracted from a pasted analytics block, pre-filling the form. */
  parsedAnalytics: {},
  selectedProofId: null,
  angle: 'bare',
  cta: 'none',
  /** Surface the current draft is destined for. Feeds L3's format mix. */
  channel: 'post',
  draftBody: null,
  /** Artifact this studio session is editing, so save+publish is one record. */
  artifactId: null,
  refining: false,
  /** Source id currently out at the model, so the row can say so and lock. */
  extracting: null,
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
    ui.view = 'dashboard';
    ui.angle = 'bare';
    ui.cta = 'none';
    ui.refining = false;
    ui.extracting = null;
    ui.toast = '';
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
        existing.channel = ui.channel;
        // Publishing is one-way. `Save draft` on an already-published artifact
        // used to demote it: L3 collapsed to locked, the record vanished from
        // the measurement screen, and its reception was orphaned.
        if (status === 'published') {
          existing.status = 'published';
          if (!existing.publishedAt) existing.publishedAt = realNow();
        }
        if (url) existing.url = url;
        return;
      }
      const created = {
        id: makeId('art'),
        proofIds: [proofId],
        channel: ui.channel,
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

  /**
   * Read and validate everything on screen 0 except the paste box.
   *
   * Shared by the two ways off that screen — with material and without it —
   * because every question but the document is the same either way, and a
   * second copy of this would drift from the first.
   *
   * The paste box is only rendered once the qualifying question is answered,
   * so the situation branch is not reachable through the UI. It exists so an
   * unanswered or declined qualification can never be recorded as a track —
   * the defect was a default that answered it for the user.
   *
   * @returns {object|null} null once the visitor has been told what is missing
   */
  function readColdProfile() {
    const situation = root.querySelector('input[name="situation"]:checked')?.value;
    if (!situation || situation === NOT_ME) {
      toast(t('onboarding.needSituation'));
      return null;
    }
    // Asked, never required. The move that loses this audience most reliably is
    // demanding a finished formulation as the price of proceeding, from someone
    // who cannot produce one yet; what works is dropping the demand and asking
    // something lighter, letting the formulation arrive later. This screen was
    // doing the failed move as a hard gate,
    // to a person whose whole presenting problem is that they cannot say it
    // yet. The product's own thesis is that the material tells you the
    // sentence, not the other way round.
    const claim = val('fit-claim').trim();
    const weeks = Number.parseInt(
      root.querySelector('input[name="weeks"]:checked')?.value ?? '0',
      10,
    );
    return {
      practiceMode: situation === 'expert' ? 'expert' : 'consultant',
      expectedEvidence: val('fit-evidence').trim(),
      weeksInMotion: Number.isFinite(weeks) ? weeks : 0,
      claim,
    };
  }

  function applyColdProfile(draft, profile) {
    draft.profile.track = 'independent';
    draft.profile.practiceMode = profile.practiceMode;
    draft.profile.expectedEvidence = profile.expectedEvidence;
    draft.profile.weeksInMotion = profile.weeksInMotion;
    draft.profile.onboarded = true;
    draft.positioning.claim = profile.claim;
    draft.positioning.offer =
      profile.practiceMode === 'expert'
        ? t('onboarding.modeExpertOffer')
        : t('onboarding.modeConsultantOffer');
  }

  const actions = {
    goto(payload) {
      // Record that an acquisition play was actually shown, so the guidance
      // does not re-issue it to someone who has already gone and done it.
      if (payload.archetype) {
        store.update((draft) => {
          draft.playLog[payload.archetype] = realNow();
        });
      }
      if (payload.play) ui.selectedPlay = payload.play;
      if (VIEWS.includes(payload.view)) ui.view = payload.view;
      if (payload.proof) ui.selectedProofId = payload.proof;
      ui.screen = 'app';
    },

    coldStart() {
      const profile = readColdProfile();
      if (!profile) return;
      const text = val('cold-paste').trim();
      if (!text) {
        toast(t('onboarding.needPaste'));
        return;
      }
      store.update((draft) => {
        applyColdProfile(draft, profile);
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

    /**
     * "I do not have anything to paste."
     *
     * The commonest way this product fails a real person, and until now the
     * screen had two answers for them: paste something anyway, or look at our
     * sample. Both are ways of saying *you are not who we built this for* to
     * someone whose work simply left no file behind.
     *
     * They are onboarded on exactly the answers they did give, and land on the
     * recall route rather than on a dashboard of zeros. First Light is not
     * skipped, only postponed — `sawFirstLight` stays false, so the reveal is
     * still waiting for the day their material arrives and gets mined.
     */
    coldRecall() {
      const profile = readColdProfile();
      if (!profile) return;
      store.update((draft) => {
        applyColdProfile(draft, profile);
      });
      ui.screen = 'app';
      ui.view = 'mine';
    },

    /**
     * From either dead end on First Light into the recall room.
     *
     * `sawFirstLight` is deliberately left alone, the same way `coldRecall`
     * leaves it. This person has not had the reveal — they have had the screen
     * that says there is nothing yet to reveal, which is the opposite. When a
     * retrieval comes back and gets mined, the reveal they are still owed fires
     * for the first time.
     */
    gotoRecall() {
      ui.recallOpen = true;
      ui.view = 'mine';
      ui.screen = 'app';
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

    /**
     * Turn a recall pass into retrieval tasks.
     *
     * The room question is the only required one, and it is required for the
     * reason the whole route exists: without a name there is no recipient, and
     * without a recipient this is a diary entry. The other two answers travel
     * on the task so it still means something in a fortnight; neither is ever
     * measured. See `engine/recall.js`.
     */
    saveRecall() {
      const answers = {
        project: val('recall-project').trim(),
        room: val('recall-room').trim(),
        ending: val('recall-ending').trim(),
      };
      if (!answers.room) {
        toast(t('recall.needRoom'));
        return;
      }
      const { retrievals, found, ignored, skipped } = draftRetrievals(answers, {
        now: realNow(),
        existing: state.retrievals,
      });
      if (!retrievals.length) {
        // Keyed on whether a name was read at all, not on whether anything was
        // ignored: a box holding only punctuation reads zero names and ignores
        // nothing, and telling that user "everyone you named is already on the
        // list" is a false statement about an empty list.
        toast(found ? t('recall.allAlreadyOpen') : t('recall.noNames'));
        return;
      }
      store.update((draft) => {
        draft.retrievals.push(...retrievals);
      });
      // Append forms must clear their cache, or `val()` falls back to the stale
      // value and a second click duplicates the pass.
      for (const key of RECALL_FIELDS) delete ui.formCache[key];
      // The errands are the thing on the screen now, so the form that produced
      // them folds away — including for the visitor who was routed here.
      ui.recallOpen = false;
      toast(t('recall.built', retrievals.length, ignored + skipped));
    },

    retrievalSent(payload) {
      store.update((draft) => {
        const task = draft.retrievals.find((r) => r.id === payload.id);
        if (task) task.askedAt = realNow();
      });
    },

    /**
     * The material came back.
     *
     * Closing a task adds nothing to the evidence base — what arrived is a
     * document, and it enters the way every other document does, through the
     * paste box. So this marks the errand done and says where to put what they
     * were sent; it never writes their reply into the inventory on their
     * behalf.
     */
    retrievalArrived(payload) {
      store.update((draft) => {
        const task = draft.retrievals.find((r) => r.id === payload.id);
        if (task) task.closedAt = realNow();
      });
      toast(t('recall.arrivedHint'));
    },

    retrievalDrop(payload) {
      store.update((draft) => {
        draft.retrievals = draft.retrievals.filter((r) => r.id !== payload.id);
      });
    },

    addText() {
      const text = val('paste').trim();
      if (!text) return;
      delete ui.formCache.paste;
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
      // First Light is the product's entire hook and it is shown once. A
      // visitor who arrived with nothing to paste took the recall route and had
      // no reveal to be given; the reveal is owed to them on the day their
      // material finally lands, not written off because they were empty-handed
      // on the first screen. Gated on *this* mine being the one that produced
      // their first evidence, so adding a fifth source never yanks a working
      // user out of the inventory and back to the opening reveal.
      //
      // "Had nothing" means what the screen meant by it, which is not "held no
      // proof at all". Someone on the thin path was told in those words that
      // there was too little here to say anything definite, and offered the
      // errand; the sub-band rows behind that sentence are not evidence they
      // have, they are the reason the sentence was shown. Reading them as
      // evidence let the reveal be quietly cancelled by the very paste that had
      // failed to earn it — so when Ronit's email finally arrived and produced
      // the first proof that cleared the bar, the hook of the entire product
      // was skipped and they landed on the inventory instead. The bar here is
      // the same `BAND_USABLE` the screen drew, and the raw score is the one it
      // printed.
      const hadNothing = !realProofs(state).some((p) => p.score >= BAND_USABLE);
      remine();
      if (hadNothing && !store.get().profile.sawFirstLight && realProofs(store.get()).length) {
        ui.screen = 'firstLight';
        return;
      }
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
      store.update((draftState) => {
        draftState.profile.sawFirstLight = true;
      });
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
      // A published artifact is finished; the next draft starts a new record.
      ui.artifactId = null;
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

    /**
     * Hand one source to the model to mark up, then re-mine.
     *
     * The disclosure is restated here rather than left in Settings: this is the
     * moment a whole document leaves the device, and it is a bigger moment than
     * the one the rewriting toggle described. What comes back is already through
     * the gate — `extractClaims` returns spans located in this source's own text
     * — so what is stored is the user's characters, and the count of rejected
     * candidates is reported rather than quietly dropped.
     */
    async extractSource({ id }) {
      const source = state.sources.find((src) => src.id === id);
      if (!source || ui.extracting) return;
      if (!globalThis.confirm?.(t('mine.extractDisclosure'))) return;

      ui.extracting = id;
      render();
      const result = await extractClaims({
        settings: state.settings,
        source,
        locale: state.locale,
        mode: state.profile.practiceMode,
      });
      ui.extracting = null;

      if (!result.ok) {
        toast(t('mine.extractFailed'));
        return;
      }
      if (!result.spans.length) {
        toast(t('mine.extractNone'));
        return;
      }

      store.update((draft) => {
        const target = draft.sources.find((src) => src.id === id);
        if (!target) return;
        target.extracted = result.spans;
        target.extractedAt = realNow();
        // Cleared here and re-stamped by the `remine()` on the next line. It
        // matters only if that call never happens: `nextMove` reads `minedAt`
        // to decide whether a source is waiting, and a source whose boundaries
        // just changed is waiting until it has been mined at them.
        target.minedAt = null;
      });
      remine();
      // Both facts, when both are true. A truncation notice that swallowed the
      // count would leave the user unable to tell a partial read from a rejected
      // one, and those call for different next steps.
      const report = t('mine.extractResult', result.spans.length, result.rejected.length);
      toast(
        result.truncated ? `${report} ${t('mine.extractTruncated', MAX_SOURCE_CHARS)}` : report,
      );
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
      for (const key of RECEPTION_FIELDS) delete ui.formCache[key];
      ui.parsedAnalytics = {};
      // Say plainly when a saved record cannot answer the question the screen
      // is about, rather than confirming a save that counts for nothing.
      toast(record.impressions > 0 ? t('measure.saved') : t('measure.savedPartial'));
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
      const note = val('cv-note').trim();
      // A conversion with nothing attached to it is a stray click, not an
      // event. Five of them used to move the index from 14 to 34 and flip the
      // diagnosis to COMPOUNDING — fabricating standing out of nothing, in a
      // product whose whole premise is that standing must be evidence-backed.
      if (!note && !artifactId) {
        toast(t('measure.needDetail'));
        return;
      }
      store.update((draft) => {
        draft.conversions.push({
          id: makeId('cnv'),
          type: val('cv-type'),
          // Attribution is what makes integration I4 possible at all: without
          // it, `detectDrift` filters on `artifactId` and returns null in every
          // state the app can produce.
          artifactId: artifactId || null,
          note,
          at: realNow(),
        });
      });
      // Every field of this form, not just the note. `val()` prefers the cache
      // over the live control, so a stale `cv-artifact` silently attributed the
      // next conversion to the previously selected post while the select on
      // screen showed the default — a wrong attribution the user cannot see,
      // feeding integration I4.
      for (const key of ['cv-note', 'cv-artifact', 'cv-type']) delete ui.formCache[key];
    },

    /**
     * Record that nothing has come in yet.
     *
     * A null result is a result. Without somewhere to put it, the single Next
     * Move stayed "who got in touch because of this?" every visit, for the rest
     * of time, with the gap frozen — asking the person whose named pain is *I
     * post and nothing happens* to type in that nothing happened.
     */
    noInbound() {
      store.update((draft) => {
        draft.profile.noInboundAt = realNow();
      });
      toast(t('measure.noInboundSaved'));
    },

    /**
     * Record what a real recipient wrote back, exactly as they wrote it.
     *
     * Nothing is normalised, trimmed out of the middle, or read by anything
     * that computes a number — see the module comment in `ui/views/replies.js`
     * and honesty rule 8. The only edit is the outer trim that stops an
     * accidental empty submit, and it is applied to the emptiness test rather
     * than to what gets stored.
     */
    saveReply() {
      const text = val('rp-text');
      if (!text.trim()) {
        toast(t('replies.needText'));
        return;
      }
      store.update((draft) => {
        draft.replies.push({
          id: makeId('rpl'),
          // Whatever is on screen. An orphan is tolerated by the schema, but
          // the form never creates one: the picker only lists published work.
          artifactId: val('rp-artifact') || null,
          text,
          at: realNow(),
        });
      });
      for (const key of REPLY_FIELDS) delete ui.formCache[key];
      toast(t('replies.saved'));
    },

    removeReply(payload) {
      store.update((draft) => {
        draft.replies = draft.replies.filter((r) => r.id !== payload.id);
      });
    },

    addRecognition() {
      const by = val('rg-by').trim();
      const url = val('rg-url').trim();
      // Recognition is someone else vouching for you. Without a who or a where
      // there is nobody in the record.
      if (!by && !url) {
        toast(t('measure.needWho'));
        return;
      }
      store.update((draft) => {
        draft.recognitions.push({
          id: makeId('rec'),
          type: val('rg-type'),
          by,
          url,
          at: realNow(),
        });
      });
      // NEW-2: append forms must clear their cache, or `val()` falls back to
      // the stale value and a second click silently duplicates the record.
      delete ui.formCache['rg-by'];
      delete ui.formCache['rg-url'];
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

    if (ui.screen === 'onboarding') return onboardingView(state, t, ui);

    if (ui.screen === 'firstLight') {
      const active = state.proofs.filter((p) => !p.dismissed);
      const ranked = sortByDesc(active, (p) => p.score);
      return firstLightView(state, t, {
        proofs: ranked,
        top3: revealPicks(ranked),
        demo: isDemoMode(state),
      });
    }

    switch (ui.view) {
      case 'mine':
        return mineView(state, t, {
          extracting: ui.extracting,
          formCache: ui.formCache,
          recallOpen: ui.recallOpen,
        });
      case 'position':
        return positionView(state, t);
      case 'inventory':
        return inventoryView(state, t, {
          now: nowTs,
          filter: ui.filter,
          expanded: ui.expanded,
        });
      case 'gaps':
        return gapsView(state, t, { now: nowTs, selectedPlay: ui.selectedPlay });
      case 'studio':
        return studioView(state, t, {
          now: nowTs,
          selectedProofId: currentProofId(),
          angle: ui.angle,
          cta: ui.cta,
          body: ui.draftBody,
          refining: ui.refining,
          channel: ui.channel,
          formCache: ui.formCache,
        });
      case 'measure':
        return measureView(state, t, { parsed: ui.parsedAnalytics, formCache: ui.formCache });
      case 'settings':
        return settingsView(state, t, { storageError: Boolean(store.persistError()) });
      default:
        return dashboardView(state, t, {
          authority: computeAuthority(state, nowTs),
          move: nextMove(state, nowTs),
          // Computed here rather than in the view so it runs on the same
          // injected clock as everything else on this screen.
          held: unpublishedProofs(state, nowTs, { limit: BRIDGE_LINES }),
        });
    }
  }

  function chrome(inner) {
    // Onboarding and First Light carry no header or nav — there is nowhere to
    // navigate to yet — but they were also returning no landmark at all, so
    // the two screens every first-time user sees had no `main` for a screen
    // reader to jump to. The chrome differs; the landmark does not.
    if (ui.screen !== 'app') {
      return html`<main id="main" class="main main--bare" tabindex="-1">${inner}</main>`;
    }
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
    // The radios are the only controls in the app carrying neither an id nor a
    // data-act: they are identified by name and value inside a wrapping label.
    // Both lookups above therefore missed them, the fallback returns null on
    // its own first line when there is nothing to match on, and focus fell
    // through to the document — on the *first* keyboard interaction anyone has
    // with this product, on the screen the whole product hangs on. Found in a
    // browser, not here, because this suite never asked where focus went.
    const activeName = active?.tagName === 'INPUT' ? active.getAttribute('name') : null;
    const activeValue = active?.getAttribute?.('value');

    renderInto(root, chrome(body()));
    restoreFormValues();

    let restored = null;
    if (activeId) {
      restored = root.querySelector(`#${CSS.escape(activeId)}`);
    } else if (activeAct) {
      restored = [...root.querySelectorAll(`[data-act="${CSS.escape(activeAct)}"]`)].find(
        (el) => (el.dataset.id ?? el.dataset.view ?? '') === activeKey,
      );
    } else if (activeName) {
      // Name *and* value: the group is not the control. Landing a keyboard user
      // on the first radio of the group after they chose the third is a quieter
      // version of the same defect, and it would have looked fixed.
      restored =
        [...root.querySelectorAll(`input[name="${CSS.escape(activeName)}"]`)].find(
          (el) => el.getAttribute('value') === activeValue,
        ) ?? null;
    }
    liveRegion.textContent = ui.toast;

    // Falling through to the document is the failure this block exists to
    // prevent, and it happened on exactly the actions where it hurts: hiding a
    // proof or removing a source destroys the focused button, nothing matches,
    // and a keyboard user is thrown to the top of the page mid-task. When the
    // element itself is gone, keep the user where they were working.
    const fallback = () => {
      // `activeName` is in this guard for the same reason the branch above
      // exists: a radio whose whole group is gone from the next screen should
      // still leave the user at the top of the content, not at the top of the
      // document. It reaches `#main` below, because there is no `data-act` to
      // match on.
      if (!activeAct && !activeId && !activeName) return null;
      return (
        root.querySelector(`[data-act="${CSS.escape(activeAct ?? '')}"]`) ??
        root.querySelector('#main') ??
        null
      );
    };
    const target = restored ?? fallback();

    if (target) {
      target.focus();
      if (target === restored && typeof selectionStart === 'number' && 'setSelectionRange' in target) {
        try {
          target.setSelectionRange(selectionStart, selectionStart);
        } catch {
          // Not all input types support selection ranges.
        }
      }
    }
  }

  /**
   * Put cached field values back into the freshly rendered controls.
   *
   * `ui.formCache` existed because a full re-render re-emits every control at
   * its *default* value, and `val()` read the cache when the live control came
   * back empty. That kept the data but broke the correspondence between what
   * the user sees and what gets submitted: the six reception fields blanked on
   * screen while still holding the previous artifact's numbers, so selecting a
   * different post and saving wrote impressions the user never typed for it —
   * into L4, into calibration, and into a compounded traction proof asserting a
   * reach that had never happened.
   *
   * Writing the cache back means the visible form *is* the submitted form.
   */
  function restoreFormValues() {
    for (const [id, value] of Object.entries(ui.formCache)) {
      if (typeof value !== 'string') continue;
      const el = root.querySelector(`#${CSS.escape(id)}`);
      if (el && 'value' in el && el.value === '') el.value = value;
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
    if (el.id === 'rc-artifact') {
      // The metrics belong to the post that was on screen when they were
      // typed. Carrying them to the next selection is how a number entered for
      // one artifact ended up stored against another.
      for (const key of RECEPTION_FIELDS) delete ui.formCache[key];
      ui.parsedAnalytics = {};
      render();
    } else if (el.name === 'situation') {
      ui.situation = el.value;
      // Persisted, so the exit is still there after a reload. Held ephemerally
      // it let a disqualified visitor back into the product on the next visit,
      // which is the funnel the exit exists to refuse.
      store.update((draft) => {
        draft.profile.declined = el.value === NOT_ME;
      });
      render();
    } else if (el.name === 'weeks') {
      ui.weeks = Number.parseInt(el.value, 10);
      render();
    } else if (el.id === 'inv-filter') {
      ui.filter = el.value;
      render();
    } else if (el.id === 'studio-proof') {
      ui.selectedProofId = el.value;
      ui.draftBody = null;
      ui.artifactId = null;
      render();
    } else if (el.id === 'studio-channel') {
      ui.channel = el.value;
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
    } else if (el.id === 'llm-extract') {
      // Persisted immediately, like the switch above it and for the same
      // reason: a consent the UI shows as granted must be the consent stored.
      const extract = el.checked;
      store.update((draft) => {
        draft.settings.llm.extract = extract;
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
      store.replace(stripImportedCredentials(parsed));
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
