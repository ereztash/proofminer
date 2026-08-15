const STORAGE_KEY = 'proofminer-product-v2-preview';

const demoMoment = 'אני רוצה שמנכ״לית שכבר דיברה איתי תרגיש מספיק בטוחה לקבוע שיחת המשך על תהליך הייעוץ.';
const demoSource = `במשך ארבעה חודשים בעל העסק לא ייצר הכנסה חדשה. אחרי שמיפינו יחד את צוואר הבקבוק והעברנו את הפוקוס מתוכן לשיחות מכירה, בתוך חודש נסגרו עסקאות בהיקף 5,500 ש״ח. בהמשך נסגרו עשר עסקאות בהיקף כולל של 27,000 ש״ח. הלקוח כתב: "הצלחתי סוף סוף לראות מה באמת מעכב את העסק ולא רק מה מרגיש דחוף".`;

const initialState = {
  step: 'moment',
  moment: '',
  actor: '',
  nextAction: '',
  sourceName: '',
  sourceText: '',
  sourcePrivate: false,
  result: null,
  alternativeIndex: 0,
  correctionOpen: false,
  draft: '',
  truthChecks: { grounded: false, inference: false, permission: false, useful: false },
  published: false,
};

const state = { ...initialState, ...(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || {}) };
const app = document.querySelector('#app');

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
}

function splitEvidence(text) {
  return String(text)
    .split(/(?<=[.!?])\s+|\n+/u)
    .map(s => s.trim())
    .filter(s => s.length > 24);
}

function evidenceSignal(sentence) {
  const x = sentence.toLowerCase();
  let score = 0;
  if (/\d/.test(sentence)) score += 3;
  if (/לקוח|לקוחה|כתב|כתבה|ראיון|המלצ|ציטט|אמר/.test(x)) score += 3;
  if (/הכנס|הכנסות|מכירות|עסקאות|חסך|הפחית|הגדיל|נסגר|תוצאה|בתוך|אחרי|לפני/.test(x)) score += 4;
  if (/תואר|פרס|כנס|הרצאה|מחקר|פרסום/.test(x)) score += 2;
  if (/יצירתי|סקרן|מקצועי מאוד|אסטרטגי מאוד|שנים של ניסיון/.test(x)) score -= 3;
  return score;
}

function inferClaim(sentence) {
  const x = sentence.toLowerCase();
  if (/הכנס|הכנסות|מכירות|עסקאות|נסגר|הגדיל|חסך|הפחית/.test(x)) {
    return {
      claim: 'יש כאן יכולת שמגיעה עד לתוצאה עסקית נצפית — לא רק לאבחון או לרעיון.',
      support: 'המקור מתאר שינוי ותוצאה קונקרטית במסגרת זמן, ולכן הוא יכול להקטין ספק לגבי היכולת להגיע לביצוע.',
      limit: 'הראיה לא מוכיחה לבדה שהעבודה היא הסיבה היחידה לתוצאה, ולא מבטיחה שאותה תוצאה תחזור אצל כל לקוח.',
      missing: 'אם קיימת עדות ישירה של הלקוח על תרומת העבודה לתוצאה, היא תחזק במיוחד את הקשר בין העבודה לבין השינוי.',
    };
  }
  if (/לקוח|לקוחה|המלצ|כתב|אמר|ציטט/.test(x)) {
    return {
      claim: 'אנשים שעבדו איתך מתארים ערך שהם חוו בפועל, ולא רק הבטחה שאתה מנסח על עצמך.',
      support: 'המקור מכיל קול של לקוח או צד אחר ולכן הוא מוסיף נקודת מבט שאינה רק תיאור עצמי.',
      limit: 'עדות אחת אינה אומרת שהחוויה מייצגת את כל הלקוחות, והיא לא מוכיחה בהכרח תוצאה עסקית מדידה.',
      missing: 'תוצאה ספציפית, מספר או לפני/אחרי מאותו מקרה יהפכו את העדות לראיה שלמה יותר.',
    };
  }
  if (/כתבה|ראיון|כנס|הרצאה|פאנל|מחקר|מאמר/.test(x)) {
    return {
      claim: 'יש כאן מומחיות שקיבלה במה או הכרה מחוץ לערוצים שאתה שולט בהם בעצמך.',
      support: 'המקור מצביע על בחירה חיצונית להציג, להזמין או לצטט את המומחיות.',
      limit: 'במה מקצועית היא אות אמון, אבל אינה מוכיחה לבדה שהעבודה שלך מייצרת את התוצאה שהקונה רוצה.',
      missing: 'מקרה לקוח קרוב להצעה שאתה מוכר יחבר את הסמכות המקצועית לתוצאה מסחרית.',
    };
  }
  if (/תואר|הסמכה|פרס|ציון/.test(x)) {
    return {
      claim: 'יש לך בסיס מקצועי שאפשר להצביע עליו במקום לבקש מהקונה פשוט להאמין לך.',
      support: 'המקור מכיל הישג או הסמכה שניתן לייחס לגוף או מסגרת מוגדרים.',
      limit: 'הסמכה מוכיחה הכשרה או הישג, לא בהכרח יכולת לייצר את התוצאה המסחרית שהקונה מחפש.',
      missing: 'ראיה מהשטח תראה כיצד הבסיס המקצועי מתורגם לעבודה ולתוצאה.',
    };
  }
  return {
    claim: 'יש כאן ניסיון שאפשר להפוך לראיה, אבל כרגע חסרה עקבה חזקה מספיק כדי להישען עליה בהחלטת קנייה.',
    support: 'המקור מתאר ניסיון או יכולת, אך רוב התמיכה עדיין מגיעה מתיאור עצמי.',
    limit: 'אי אפשר להסיק מהטקסט לבדו שהיכולת נצפתה על ידי אדם אחר או שיצרה תוצאה מדידה.',
    missing: 'חפש המלצה, תוצאה, מספר, לפני/אחרי או מקור חיצוני שנוגע לאותה יכולת.',
  };
}

function analyze() {
  const units = splitEvidence(state.sourceText)
    .map((text, index) => ({ text, index, signal: evidenceSignal(text) }))
    .sort((a, b) => b.signal - a.signal);

  if (!units.length) return;
  const candidates = units.slice(0, Math.min(3, units.length)).map(unit => ({ ...unit, ...inferClaim(unit.text) }));
  state.result = { candidates };
  state.alternativeIndex = 0;
  state.step = 'result';
  state.correctionOpen = false;
  state.draft = '';
  state.truthChecks = { grounded: false, inference: false, permission: false, useful: false };
  state.published = false;
  save();
  render();
}

function currentCandidate() {
  return state.result?.candidates?.[state.alternativeIndex] || null;
}

function momentSummary() {
  const parts = [state.actor, state.nextAction].filter(Boolean);
  return parts.length ? parts.join(' · ') : state.moment;
}

function generateDraft() {
  const c = currentCandidate();
  if (!c) return;
  const moment = state.moment || 'להקטין אי־ודאות אצל האדם שמולי';
  state.draft = `${c.text}\n\nמה שמעניין כאן הוא לא המספר או האירוע בפני עצמם. העניין הוא מה השתנה בדרך: במקום להוסיף עוד פעילות, עצרנו לזהות מה באמת חוסם את התוצאה ורק אז בחרנו פעולה.\n\nזו הבחנה שאני חוזר אליה הרבה בעבודה מקצועית: לפעמים הבעיה היא לא שאין מספיק מאמץ — אלא שהמאמץ יושב במקום שלא מזיז את המערכת.\n\nבהקשר של ${moment}, זו בדיוק הראיה שהייתי מעדיף להראות: לא הבטחה גדולה, אלא עקבה שאפשר לבדוק.`;
  state.step = 'draft';
  save();
  render();
}

function allTruthChecksPassed() {
  return Object.values(state.truthChecks).every(Boolean);
}

function progressIndex() {
  return ({ moment: 1, source: 2, result: 3, draft: 4 }[state.step] || 1);
}

function header() {
  const p = progressIndex();
  return `
    <header class="site-header">
      <div class="brand-lockup">
        <div class="logo-mark">P</div>
        <div><b>ProofMiner</b><span>ראיה לפני ניסוח</span></div>
      </div>
      <div class="header-actions">
        <span class="preview-badge">Product v2 · Preview</span>
        <button class="text-btn" data-action="reset">התחל מחדש</button>
      </div>
    </header>
    <div class="progress-wrap" aria-label="התקדמות">
      ${['רגע ההחלטה', 'ראיה אחת', 'המהלך', 'בדיקת אמת'].map((label, i) => `
        <div class="progress-step ${i + 1 <= p ? 'done' : ''} ${i + 1 === p ? 'active' : ''}">
          <span>${i + 1}</span><b>${label}</b>
        </div>`).join('')}
    </div>`;
}

function momentScreen() {
  return `
    <main class="stage stage-narrow">
      <div class="eyebrow">01 · מתחילים בהחלטה, לא בתוכן</div>
      <h1>מה אתה מנסה לגרום לקרות עכשיו?</h1>
      <p class="lead">תאר אדם ורגע אמיתי. ProofMiner יחפש מה שכבר עשית ויכול להקטין את אי־הוודאות שלו עכשיו.</p>

      <section class="paper input-card">
        <label class="big-field">
          <span>תאר את הרגע במילים שלך</span>
          <textarea id="moment" rows="5" placeholder="לדוגמה: אני רוצה שמנכ״לית שכבר דיברה איתי תרגיש מספיק בטוחה לקבוע שיחת המשך...">${esc(state.moment)}</textarea>
        </label>
        <div class="two-fields">
          <label><span>מי צריך להחליט? <small>אופציונלי</small></span><input id="actor" value="${esc(state.actor)}" placeholder="מנכ״לית בחברת שירותים" /></label>
          <label><span>מה הפעולה הבאה? <small>אופציונלי</small></span><input id="nextAction" value="${esc(state.nextAction)}" placeholder="לקבוע שיחת המשך" /></label>
        </div>
        <div class="card-actions">
          <button class="primary" data-action="moment-next">זה הרגע שלי <span>←</span></button>
          <button class="secondary" data-action="demo-moment">טען דוגמה</button>
        </div>
      </section>

      <div class="principle-row">
        <div><b>לא צריך לדעת מה “הספק” של הקונה</b><span>תן לנו את המצב. המודל הוא העבודה שלנו, לא שלך.</span></div>
        <div><b>לא בונים מאגר לפני ערך</b><span>מתחילים מרגע אחד וממקור אחד.</span></div>
        <div><b>אין ציון קסם</b><span>נראה מה הראיה מאפשרת לטעון — וגם מה לא.</span></div>
      </div>
    </main>`;
}

function sourceScreen() {
  return `
    <main class="stage source-stage">
      <aside class="context-strip">
        <span>רגע ההחלטה</span>
        <b>${esc(momentSummary())}</b>
        <button class="text-btn" data-action="back-moment">ערוך</button>
      </aside>

      <div class="source-content">
        <div class="eyebrow">02 · תן לנו דבר אחד שכבר קיים</div>
        <h1>לא צריך למיין. תן מקור אחד.</h1>
        <p class="lead">תמלול, המלצה, מקרה לקוח, הצעה, קורות חיים או טקסט. אם חסר משהו, נבקש רק את הדבר הבא שיכול לשנות את ההכרעה.</p>

        <section class="paper input-card">
          <div class="source-tabs">
            <button class="source-tab active">הדבק טקסט</button>
            <label class="source-tab file-tab">קובץ TXT / MD<input id="fileInput" type="file" accept=".txt,.md,text/plain,text/markdown" /></label>
          </div>
          <label class="field"><span>שם המקור <small>אופציונלי</small></span><input id="sourceName" value="${esc(state.sourceName)}" placeholder="למשל: סיכום שיחת לקוח — יוני 2026" /></label>
          <label class="big-field"><span>התוכן</span><textarea id="sourceText" rows="12" placeholder="הדבק כאן את החומר כמו שהוא. אין צורך לנקות או לסכם.">${esc(state.sourceText)}</textarea></label>
          <label class="privacy-check"><input id="sourcePrivate" type="checkbox" ${state.sourcePrivate ? 'checked' : ''}/><span><b>המקור הזה פרטי / רגיש</b><small>ב־Preview הסימון משפיע על ההמלצה בלבד. במוצר המלא הוא ישלוט בהרשאות ובאנונימיזציה.</small></span></label>
          <div class="card-actions">
            <button class="primary" data-action="analyze">מצא את המהלך הכי חזק <span>←</span></button>
            <button class="secondary" data-action="demo-source">טען מקור לדוגמה</button>
          </div>
        </section>
      </div>
    </main>`;
}

function resultScreen() {
  const c = currentCandidate();
  if (!c) return sourceScreen();
  const candidates = state.result?.candidates || [];
  return `
    <main class="stage result-stage">
      <aside class="context-strip">
        <span>רגע ההחלטה</span><b>${esc(momentSummary())}</b>
        <span class="source-chip">מקור: ${esc(state.sourceName || 'הטקסט שהדבקת')}${state.sourcePrivate ? ' · פרטי' : ''}</span>
      </aside>

      <section class="recommendation paper">
        <div class="recommendation-head">
          <div><div class="eyebrow">03 · המהלך שהייתי עושה עכשיו</div><h1>הייתי מתחיל דווקא מזה.</h1></div>
          <span class="fit-label">התאמה גבוהה לרגע</span>
        </div>

        <div class="claim-block">
          <span>הטענה שכדאי לבסס</span>
          <h2>${esc(c.claim)}</h2>
        </div>

        <div class="proof-trace">
          <div class="trace-node evidence-node"><span>המקור אומר</span><blockquote>“${esc(c.text)}”</blockquote><small>${esc(state.sourceName || 'המקור שהוזן')}</small></div>
          <div class="trace-arrow">↓</div>
          <div class="trace-node relation-node"><span>למה זה תומך בטענה</span><p>${esc(c.support)}</p></div>
          <div class="trace-arrow">↓</div>
          <div class="trace-node limit-node"><span>מה זה עדיין לא מאפשר לטעון</span><p>${esc(c.limit)}</p></div>
        </div>

        <div class="decision-actions">
          <button class="primary" data-action="use-proof">השתמש בזה <span>←</span></button>
          <button class="secondary" data-action="correction">זה לא מדויק</button>
          <button class="secondary" data-action="private-proof">אי אפשר לפרסם את זה</button>
          ${candidates.length > 1 ? '<button class="text-btn" data-action="alternative">תראה לי חלופה</button>' : ''}
        </div>

        ${state.correctionOpen ? correctionPanel() : ''}
      </section>

      <section class="gap-card">
        <div><span>הדבר היחיד שהייתי מחפש אחר כך</span><b>${esc(c.missing)}</b></div>
        <button class="secondary" data-action="add-source">יש לי משהו כזה</button>
      </section>

      <section class="why-section">
        <div class="eyebrow">העיקרון</div>
        <h3>ProofMiner לא אומר “זה נכון”. הוא מראה מי טען מה, איפה, ומה מותר להסיק מזה.</h3>
      </section>
    </main>`;
}

function correctionPanel() {
  return `
    <div class="correction-panel">
      <b>מה לא מדויק?</b>
      <p>התיקון הזה אמור ללמד את המערכת איך לפרש את הראיות שלך בפעם הבאה.</p>
      <div class="correction-options">
        ${['זה לא באמת נובע ממני', 'חסר כאן הקשר', 'לא מתאים לאדם הזה', 'הניסוח חזק מדי', 'המקור עצמו לא אמין מספיק'].map(x => `<button class="correction-chip" data-correction="${esc(x)}">${esc(x)}</button>`).join('')}
      </div>
    </div>`;
}

function draftScreen() {
  const c = currentCandidate();
  if (!c) return resultScreen();
  const passed = allTruthChecksPassed();
  return `
    <main class="stage draft-stage">
      <aside class="context-strip"><span>ה־Proof Move</span><b>${esc(c.claim)}</b><button class="text-btn" data-action="back-result">חזור לראיה</button></aside>

      <div class="draft-grid">
        <section class="paper draft-editor">
          <div class="eyebrow">04 · הופכים ראיה לתקשורת שימושית</div>
          <h1>הקורא צריך לקבל ערך גם אם הוא לא מכיר אותך.</h1>
          <textarea id="draftText" class="draft-text" rows="18">${esc(state.draft)}</textarea>
          <div class="draft-footer"><span>הראיה נשארת העוגן. מותר לערוך את המסר — אסור להמציא עובדות.</span><button class="text-btn" data-action="regenerate">נסח מחדש</button></div>
        </section>

        <aside class="paper truth-card">
          <div class="eyebrow">Truth Check</div>
          <h2>לפני שמוציאים החוצה</h2>
          ${[
            ['grounded', 'כל שם, מספר ותוצאה בטקסט קיימים במקור'],
            ['inference', 'אין מסקנה שמוצגת כעובדה בלי תמיכה'],
            ['permission', state.sourcePrivate ? 'בדקתי שמותר לחשוף / אנונימתי את המקור' : 'אין כאן מידע שאין לי רשות לפרסם'],
            ['useful', 'יש כאן משהו שימושי לקורא מעבר להישג שלי'],
          ].map(([key, label]) => `<label class="truth-item ${state.truthChecks[key] ? 'checked' : ''}"><input type="checkbox" data-truth="${key}" ${state.truthChecks[key] ? 'checked' : ''}/><span>${esc(label)}</span></label>`).join('')}
          <div class="truth-source"><span>העוגן העובדתי</span><blockquote>“${esc(c.text)}”</blockquote></div>
          <button class="primary full" data-action="mark-published" ${passed ? '' : 'disabled'}>${state.published ? 'סומן כפורסם ✓' : 'מוכן לשימוש'}</button>
          ${!passed ? '<small class="blocking-note">הפעולה נפתחת רק אחרי שכל בדיקות האמת עברו.</small>' : ''}
        </aside>
      </div>

      ${state.published ? `
        <section class="outcome-card">
          <div><span>הלולאה לא נגמרת בפרסום</span><h3>בביקור הבא נשאל: מה קרה אחרי שהשתמשת בזה?</h3><p>שום דבר · תגובה משמעותית · ביקור בפרופיל · DM · שיחה מתאימה · עסקה. Outcome הוא evidence ללמידה — לא הוכחת סיבתיות.</p></div>
          <button class="secondary" data-action="reset">פתח Decision Moment חדש</button>
        </section>` : ''}
    </main>`;
}

function render() {
  const screen = state.step === 'source' ? sourceScreen() : state.step === 'result' ? resultScreen() : state.step === 'draft' ? draftScreen() : momentScreen();
  app.innerHTML = `<div class="app-shell">${header()}${screen}<footer>ProofMiner · Product architecture v2 · interactive preview</footer></div>`;
  bind();
}

function syncInputs() {
  const map = { moment: 'moment', actor: 'actor', nextAction: 'nextAction', sourceName: 'sourceName', sourceText: 'sourceText', draftText: 'draft' };
  Object.entries(map).forEach(([id, key]) => {
    const el = document.querySelector(`#${id}`);
    if (el) el.addEventListener('input', e => { state[key] = e.target.value; save(); });
  });
  const priv = document.querySelector('#sourcePrivate');
  if (priv) priv.addEventListener('change', e => { state.sourcePrivate = e.target.checked; save(); });
  const file = document.querySelector('#fileInput');
  if (file) file.addEventListener('change', e => {
    const chosen = e.target.files?.[0];
    if (!chosen) return;
    const reader = new FileReader();
    reader.onload = () => {
      state.sourceName = chosen.name;
      state.sourceText = String(reader.result || '');
      save(); render();
    };
    reader.readAsText(chosen, 'utf-8');
  });
}

function bind() {
  syncInputs();
  document.querySelectorAll('[data-action]').forEach(btn => btn.addEventListener('click', () => handleAction(btn.dataset.action)));
  document.querySelectorAll('[data-correction]').forEach(btn => btn.addEventListener('click', () => {
    state.correctionOpen = false;
    state.lastCorrection = btn.dataset.correction;
    save();
    btn.closest('.correction-panel')?.remove();
  }));
  document.querySelectorAll('[data-truth]').forEach(input => input.addEventListener('change', e => {
    state.truthChecks[e.target.dataset.truth] = e.target.checked;
    save(); render();
  }));
}

function handleAction(action) {
  if (action === 'reset') {
    Object.keys(state).forEach(k => delete state[k]);
    Object.assign(state, structuredClone(initialState));
  }
  if (action === 'demo-moment') {
    state.moment = demoMoment;
    state.actor = 'מנכ״לית שכבר מכירה אותי';
    state.nextAction = 'לקבוע שיחת המשך';
  }
  if (action === 'moment-next') {
    if (!state.moment.trim()) return;
    state.step = 'source';
  }
  if (action === 'back-moment') state.step = 'moment';
  if (action === 'demo-source') {
    state.sourceName = 'סיכום מקרה לקוח · 2026';
    state.sourceText = demoSource;
  }
  if (action === 'analyze') {
    if (!state.sourceText.trim()) return;
    analyze(); return;
  }
  if (action === 'alternative') {
    const count = state.result?.candidates?.length || 1;
    state.alternativeIndex = (state.alternativeIndex + 1) % count;
    state.correctionOpen = false;
  }
  if (action === 'correction') state.correctionOpen = !state.correctionOpen;
  if (action === 'private-proof') {
    state.sourcePrivate = true;
    state.correctionOpen = false;
  }
  if (action === 'add-source') state.step = 'source';
  if (action === 'use-proof') { generateDraft(); return; }
  if (action === 'back-result') state.step = 'result';
  if (action === 'regenerate') { generateDraft(); return; }
  if (action === 'mark-published' && allTruthChecksPassed()) state.published = true;
  save();
  render();
}

render();
