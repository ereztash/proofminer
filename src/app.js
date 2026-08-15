const STORAGE_KEY = 'proofminer-transition-v6-workspace';

const uid = () => Math.random().toString(36).slice(2, 10);

const demoActions = [
  { title: 'לשכתב את האתר', hours: 16, status: 'now' },
  { title: 'להתחיל לפרסם יותר בלינקדאין', hours: 14, status: 'now' },
  { title: 'לבנות וובינר למנהלים', hours: 10, status: 'later' },
];

const blank = {
  transition: '',
  desiredState: '',
  horizon: 3,
  totalHours: 50,
  actions: [],
  baselineFrozen: false,
  baselineSnapshot: null,
  systemChallenge: null,
  selectedActionId: null,
  newAction: '',
};

const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
const state = { ...blank, ...(stored || {}) };
if (!Array.isArray(state.actions)) state.actions = [];

const app = document.querySelector('#app');

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[c]));
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, Number(n) || 0));
}

function allocatedHours() {
  return state.actions.reduce((sum, action) => sum + (Number(action.hours) || 0), 0);
}

function reserveHours() {
  return Math.max(0, Number(state.totalHours || 0) - allocatedHours());
}

function actionById(id) {
  return state.actions.find(action => action.id === id);
}

function addAction(title, status = 'now', hours = 0) {
  const clean = String(title || '').trim();
  if (!clean) return;
  const available = reserveHours();
  state.actions.push({
    id: uid(),
    title: clean,
    status,
    hours: Math.min(Number(hours) || 0, available),
    source: 'user',
  });
  state.newAction = '';
  state.systemChallenge = null;
  save();
  render();
}

function removeAction(id) {
  state.actions = state.actions.filter(action => action.id !== id);
  state.systemChallenge = null;
  save();
  render();
}

function moveAction(id, direction) {
  const index = state.actions.findIndex(action => action.id === id);
  if (index < 0) return;
  const target = index + direction;
  if (target < 0 || target >= state.actions.length) return;
  const next = [...state.actions];
  [next[index], next[target]] = [next[target], next[index]];
  state.actions = next;
  save();
  render();
}

function setActionStatus(id, status) {
  const action = actionById(id);
  if (!action) return;
  action.status = status;
  save();
  render();
}

function setActionHours(id, requested) {
  const action = actionById(id);
  if (!action) return;
  const current = Number(action.hours) || 0;
  const maxAllowed = current + reserveHours();
  action.hours = clamp(requested, 0, maxAllowed);
  save();
  render();
}

function updateTotalHours(value) {
  const next = Math.max(1, Number(value) || 1);
  state.totalHours = next;
  const totalAllocated = allocatedHours();
  if (totalAllocated > next && totalAllocated > 0) {
    const ratio = next / totalAllocated;
    let used = 0;
    state.actions.forEach((action, index) => {
      if (index === state.actions.length - 1) {
        action.hours = Math.max(0, next - used);
      } else {
        action.hours = Math.floor((Number(action.hours) || 0) * ratio);
        used += action.hours;
      }
    });
  }
  save();
  render();
}

function freezeBaseline() {
  if (!state.transition.trim() || !state.actions.length) return;
  state.baselineSnapshot = {
    transition: state.transition,
    desiredState: state.desiredState,
    horizon: state.horizon,
    totalHours: state.totalHours,
    actions: state.actions.map(({ id, title, hours, status }) => ({ id, title, hours, status })),
    frozenAt: new Date().toISOString(),
  };
  state.baselineFrozen = true;
  state.systemChallenge = null;
  save();
  render();
}

function unfreezeBaseline() {
  state.baselineFrozen = false;
  state.baselineSnapshot = null;
  state.systemChallenge = null;
  save();
  render();
}

function runChallenge() {
  if (!state.baselineFrozen) return;
  const text = `${state.transition} ${state.desiredState}`.toLowerCase();
  const orgTransition = /ארגונ|מנהלים|חברות|enterprise|b2b/.test(text);
  const suggestions = [];

  state.actions.forEach((action, index) => {
    const title = action.title.toLowerCase();
    let suggestedStatus = action.status;
    let reason = 'אין כרגע סיבה מבנית לשנות את המיקום שלך.';
    let reverse = 'ראיה חדשה שמגלה dependency, קהל אחר או מנגנון אחר יכולה לשנות את ההמלצה.';

    if (orgTransition && /אתר|פודקאסט|תוכן|לינקדאין|וובינר|מיתוג/.test(title)) {
      suggestedStatus = 'later';
      reason = 'זו פעולה סבירה, אבל היא מקבעת מסר/ערוץ לפני שנבדק מספיק טוב מי בוחר ולפי איזה קריטריון.';
      reverse = 'אם כבר קיימת ראיה ישירה ועדכנית לגבי buyer, criterion ו-proof נדרש — אפשר להחזיר אותה קדימה.';
    } else if (/שיח|ראיונ|לקוח|מנהלים|פנייה|outreach|מחקר/.test(title)) {
      suggestedStatus = 'learn';
      reason = 'הפעולה הזאת יכולה להחזיר מידע שמבדיל בין כמה מסלולים לפני התחייבות גדולה יותר.';
      reverse = 'אם המידע כבר קיים ממקור חיצוני אמין, אין צורך לבצע את הלמידה שוב.';
    } else if (index === 0) {
      suggestedStatus = 'now';
      reason = 'הפעולה הראשונה שלך נשארת ברירת המחדל כל עוד אין ראיה שמצדיקה להפוך אותה.';
    }

    if (suggestedStatus !== action.status || reason !== 'אין כרגע סיבה מבנית לשנות את המיקום שלך.') {
      suggestions.push({ actionId: action.id, suggestedStatus, reason, reverse, applied: false, rejected: false });
    }
  });

  const hasDiscoveryAction = state.actions.some(action => /שיח|ראיונ|לקוח|מנהלים|מחקר/.test(action.title.toLowerCase()));
  const proposedAction = orgTransition && !hasDiscoveryAction ? {
    id: uid(),
    title: 'לקיים 5 שיחות קצרות עם בעלי תפקידים רלוונטיים לפני בניית המעטפת',
    status: 'learn',
    hours: Math.min(8, reserveHours()),
    reason: 'החוב המרכזי כרגע הוא להבין מי בוחר, לפי מה, ואיזה proof מוריד סיכון. זו פעולה שמחזירה מידע לפני lock-in.',
    reverse: 'אם המידע הזה כבר קיים ממקור חיצוני עדכני ואמין, אין צורך להוסיף את הפעולה.',
  } : null;

  state.systemChallenge = {
    generatedAt: new Date().toISOString(),
    suggestions,
    proposedAction,
  };
  save();
  render();
}

function applySuggestion(actionId) {
  const challenge = state.systemChallenge?.suggestions?.find(item => item.actionId === actionId);
  const action = actionById(actionId);
  if (!challenge || !action) return;
  action.status = challenge.suggestedStatus;
  challenge.applied = true;
  challenge.rejected = false;
  save();
  render();
}

function rejectSuggestion(actionId) {
  const challenge = state.systemChallenge?.suggestions?.find(item => item.actionId === actionId);
  if (!challenge) return;
  challenge.rejected = true;
  challenge.applied = false;
  save();
  render();
}

function acceptProposedAction() {
  const proposed = state.systemChallenge?.proposedAction;
  if (!proposed) return;
  const available = reserveHours();
  state.actions.push({
    id: proposed.id,
    title: proposed.title,
    status: proposed.status,
    hours: Math.min(proposed.hours, available),
    source: 'system-proposal',
  });
  state.systemChallenge.proposedAction = null;
  save();
  render();
}

function reset() {
  Object.assign(state, JSON.parse(JSON.stringify(blank)));
  save();
  render();
}

function loadDemo() {
  Object.assign(state, JSON.parse(JSON.stringify(blank)));
  state.transition = 'אני רוצה לעבור מייעוץ לעצמאים קטנים לייעוץ לארגונים בלי לבזבז חודשים על מיתוג שלא יזיז את העסק.';
  state.desiredState = 'שמנהלים בארגונים יראו בי אופציה לגיטימית ויקבעו שיחות על תהליכי ייעוץ.';
  state.horizon = 3;
  state.totalHours = 50;
  state.actions = demoActions.map(action => ({ id: uid(), source: 'user', ...action }));
  save();
  render();
}

const statusLabel = status => ({ now: 'עכשיו', later: 'אחר כך', learn: 'לברר' }[status] || status);

function header() {
  return `
    <header class="site-header">
      <div class="brand-lockup">
        <div class="logo-mark">P</div>
        <div><b>ProofMiner</b><span>מרחב החלטה מקצועי</span></div>
      </div>
      <div class="header-actions">
        <span class="preview-badge">Preview ניסויי</span>
        <button class="text-btn" data-action="demo">טען דוגמה</button>
        <button class="text-btn" data-action="reset">אפס</button>
      </div>
    </header>`;
}

function setupPanel() {
  return `
    <section class="setup-panel paper">
      <div class="section-head">
        <div>
          <span class="eyebrow">01 · מגדירים את המעבר</span>
          <h1>מה אתה מנסה לשנות מקצועית?</h1>
        </div>
        <span class="quiet-badge">לא צריך לדעת עדיין מה הפתרון</span>
      </div>
      <label class="big-field">
        <span>המעבר במילים שלך</span>
        <textarea id="transition" rows="4" placeholder="לדוגמה: אני רוצה לעבור מייעוץ לעצמאים לייעוץ לארגונים, ולא ברור לי במה להשקיע קודם.">${esc(state.transition)}</textarea>
      </label>
      <div class="two-fields">
        <label><span>מה היית רוצה שיהיה נכון במקום? <small>אופציונלי</small></span><input id="desiredState" value="${esc(state.desiredState)}" placeholder="למשל: שמנהלים יפנו אליי..." /></label>
        <label class="horizon-field"><span>אופק החלטה: <b>${esc(state.horizon)} חודשים</b></span><input id="horizon" type="range" min="1" max="12" step="1" value="${esc(state.horizon)}" /></label>
      </div>
    </section>`;
}

function actionComposer() {
  return `
    <section class="action-composer paper">
      <div>
        <span class="eyebrow">02 · מה באמת על השולחן?</span>
        <h2>הוסף את הפעולות שאתה שוקל</h2>
        <p>לא צריך תוכנית מלאה. רק דברים שבאמת מתחרים עכשיו על הזמן שלך.</p>
      </div>
      <div class="composer-row">
        <input id="newAction" value="${esc(state.newAction)}" placeholder="למשל: לשכתב אתר" />
        <button class="primary" data-action="add-action">הוסף פעולה</button>
      </div>
    </section>`;
}

function resourceBar() {
  const total = Math.max(1, Number(state.totalHours) || 1);
  const segments = state.actions.filter(action => action.hours > 0).map(action => {
    const width = Math.max(2, (action.hours / total) * 100);
    return `<div class="resource-segment" style="--segment:${width}%" title="${esc(action.title)} · ${esc(action.hours)} שעות"><span>${esc(action.hours)}h</span></div>`;
  }).join('');
  const reserve = reserveHours();
  const reserveWidth = Math.max(0, (reserve / total) * 100);
  return `
    <section class="resource-panel paper">
      <div class="resource-head">
        <div><span class="eyebrow">03 · משאב מוגבל</span><h2>יש לך ${esc(total)} שעות להקצות</h2></div>
        <label class="total-hours"><span>סה״כ שעות</span><input id="totalHours" type="number" min="1" max="500" value="${esc(total)}" /></label>
      </div>
      <div class="allocation-bar" aria-label="חלוקת שעות">${segments}<div class="reserve-segment" style="--segment:${reserveWidth}%"><span>${esc(reserve)}h פנויות</span></div></div>
      <p class="resource-rule">כשאתה נותן יותר שעות לפעולה אחת, הן נגרעות מהיתרה. אי אפשר לתת לכולן עדיפות מלאה.</p>
    </section>`;
}

function actionCard(action) {
  const max = (Number(action.hours) || 0) + reserveHours();
  const challenge = state.systemChallenge?.suggestions?.find(item => item.actionId === action.id);
  return `
    <article class="action-card" draggable="true" data-action-id="${esc(action.id)}">
      <div class="drag-handle" aria-hidden="true">⋮⋮</div>
      <div class="action-main">
        <input class="action-title-input" data-action-title="${esc(action.id)}" value="${esc(action.title)}" aria-label="שם הפעולה" />
        <div class="status-switch" role="group" aria-label="מצב הפעולה">
          ${['now','later','learn'].map(status => `<button class="status-btn ${action.status === status ? 'active' : ''}" data-set-status="${status}" data-id="${esc(action.id)}">${statusLabel(status)}</button>`).join('')}
        </div>
        <div class="hours-control">
          <div class="hours-label"><span>שעות</span><b>${esc(action.hours)}h</b><small>מקסימום זמין עכשיו: ${esc(max)}h</small></div>
          <input type="range" min="0" max="${esc(max)}" step="1" value="${esc(action.hours)}" data-hours="${esc(action.id)}" aria-label="שעות לפעולה ${esc(action.title)}" />
          <div class="hours-buttons"><button data-hours-step="-1" data-id="${esc(action.id)}">−</button><button data-hours-step="1" data-id="${esc(action.id)}">+</button></div>
        </div>
      </div>
      <div class="action-tools">
        <button class="icon-btn" data-move="-1" data-id="${esc(action.id)}" title="הזז למעלה">↑</button>
        <button class="icon-btn" data-move="1" data-id="${esc(action.id)}" title="הזז למטה">↓</button>
        <button class="icon-btn danger" data-remove="${esc(action.id)}" title="מחק">×</button>
      </div>
      ${challenge ? challengeBlock(action, challenge) : ''}
    </article>`;
}

function challengeBlock(action, challenge) {
  const changed = challenge.suggestedStatus !== action.status;
  return `
    <div class="challenge-block ${challenge.applied ? 'accepted' : ''} ${challenge.rejected ? 'rejected' : ''}">
      <div class="challenge-head"><span>אתגר של המערכת</span>${changed ? `<b>${statusLabel(action.status)} → ${statusLabel(challenge.suggestedStatus)}</b>` : '<b>בדיקת הנחה</b>'}</div>
      <p>${esc(challenge.reason)}</p>
      <details><summary>מה יגרום לאתגר הזה להיעלם?</summary><p>${esc(challenge.reverse)}</p></details>
      <div class="challenge-actions">
        <button class="mini-primary" data-apply-suggestion="${esc(action.id)}">החל את השינוי</button>
        <button class="mini-secondary" data-reject-suggestion="${esc(action.id)}">אני לא מקבל</button>
      </div>
    </div>`;
}

function lane(status, title, subtitle) {
  const actions = state.actions.filter(action => action.status === status);
  return `
    <section class="lane" data-lane="${status}">
      <header><div><span>${title}</span><small>${subtitle}</small></div><b>${actions.length}</b></header>
      <div class="lane-dropzone" data-drop-status="${status}">
        ${actions.length ? actions.map(actionCard).join('') : '<div class="empty-lane">גרור לכאן פעולה או השתמש בכפתורי המצב</div>'}
      </div>
    </section>`;
}

function baselineStrip() {
  if (!state.baselineFrozen || !state.baselineSnapshot) return '';
  const count = state.baselineSnapshot.actions.length;
  return `
    <section class="baseline-strip">
      <div><span>נקודת ההתחלה נשמרה</span><b>${count} פעולות · ${esc(state.baselineSnapshot.totalHours)} שעות</b></div>
      <button class="text-btn" data-action="unfreeze">פתח מחדש</button>
    </section>`;
}

function proposedActionBlock() {
  const proposed = state.systemChallenge?.proposedAction;
  if (!proposed) return '';
  return `
    <section class="proposed-action paper">
      <span class="eyebrow">פעולה שהמערכת מציעה להוסיף — לא עובדה מהשטח</span>
      <h3>${esc(proposed.title)}</h3>
      <p>${esc(proposed.reason)}</p>
      <div><b>${esc(proposed.hours)} שעות מוצעות</b><button class="primary" data-action="accept-proposed">הוסף למרחב שלי</button></div>
    </section>`;
}

function workspaceScreen() {
  const canFreeze = state.transition.trim() && state.actions.length > 0;
  return `
    ${header()}
    <main class="workspace-shell">
      ${setupPanel()}
      ${actionComposer()}
      ${state.actions.length ? resourceBar() : ''}
      ${baselineStrip()}

      ${state.actions.length ? `
        <section class="board-head">
          <div><span class="eyebrow">04 · תזיז את התוכנית, לא את הטקסט</span><h2>איפה כל פעולה נמצאת עכשיו?</h2><p>גרור בין אזורים, סדר מחדש, או השתמש בכפתורים. המודל נשמר תוך כדי.</p></div>
          <div class="board-actions">
            ${!state.baselineFrozen ? `<button class="primary" data-action="freeze" ${canFreeze ? '' : 'disabled'}>שמור את התוכנית שלי לפני האתגר</button>` : `<button class="primary" data-action="challenge">${state.systemChallenge ? 'הרץ אתגר מחדש' : 'אתגר את התוכנית שלי'}</button>`}
          </div>
        </section>
        <section class="decision-board direct-board">
          ${lane('now', 'עכשיו', 'משהו שאתה באמת מתכוון לבצע')}
          ${lane('later', 'אחר כך', 'סביר, אבל לא צריך משאב עכשיו')}
          ${lane('learn', 'לברר', 'פעולה שמטרתה להחזיר מידע')}
        </section>
        ${proposedActionBlock()}
      ` : '<section class="empty-workspace"><b>המרחב ייבנה מתוך הפעולות שלך.</b><span>הוסף פעולה אחת כדי להתחיל.</span></section>'}

      <footer class="workspace-footer">
        <span>Preview ניסויי · האתגרים כאן הם מסקנות/השערות של המערכת, לא מחקר שוק מאומת.</span>
      </footer>
    </main>`;
}

function render() {
  app.innerHTML = workspaceScreen();
  bind();
}

function bind() {
  document.querySelector('#transition')?.addEventListener('input', e => { state.transition = e.target.value; save(); });
  document.querySelector('#desiredState')?.addEventListener('input', e => { state.desiredState = e.target.value; save(); });
  document.querySelector('#horizon')?.addEventListener('input', e => { state.horizon = Number(e.target.value); save(); render(); });
  document.querySelector('#newAction')?.addEventListener('input', e => { state.newAction = e.target.value; save(); });
  document.querySelector('#newAction')?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addAction(e.target.value); } });
  document.querySelector('#totalHours')?.addEventListener('change', e => updateTotalHours(e.target.value));

  document.querySelectorAll('[data-action-title]').forEach(input => {
    input.addEventListener('change', e => {
      const action = actionById(e.target.dataset.actionTitle);
      if (!action) return;
      action.title = e.target.value.trim() || action.title;
      save();
      render();
    });
  });

  document.querySelectorAll('[data-hours]').forEach(input => {
    input.addEventListener('input', e => setActionHours(e.target.dataset.hours, e.target.value));
  });

  document.querySelectorAll('[data-hours-step]').forEach(button => {
    button.addEventListener('click', () => {
      const action = actionById(button.dataset.id);
      if (!action) return;
      setActionHours(action.id, (Number(action.hours) || 0) + Number(button.dataset.hoursStep));
    });
  });

  document.querySelectorAll('[data-set-status]').forEach(button => {
    button.addEventListener('click', () => setActionStatus(button.dataset.id, button.dataset.setStatus));
  });

  document.querySelectorAll('[data-move]').forEach(button => {
    button.addEventListener('click', () => moveAction(button.dataset.id, Number(button.dataset.move)));
  });

  document.querySelectorAll('[data-remove]').forEach(button => {
    button.addEventListener('click', () => removeAction(button.dataset.remove));
  });

  document.querySelectorAll('[data-apply-suggestion]').forEach(button => {
    button.addEventListener('click', () => applySuggestion(button.dataset.applySuggestion));
  });

  document.querySelectorAll('[data-reject-suggestion]').forEach(button => {
    button.addEventListener('click', () => rejectSuggestion(button.dataset.rejectSuggestion));
  });

  document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      if (action === 'add-action') addAction(state.newAction);
      if (action === 'freeze') freezeBaseline();
      if (action === 'unfreeze') unfreezeBaseline();
      if (action === 'challenge') runChallenge();
      if (action === 'accept-proposed') acceptProposedAction();
      if (action === 'demo') loadDemo();
      if (action === 'reset') reset();
    });
  });

  let draggedId = null;
  document.querySelectorAll('.action-card[draggable="true"]').forEach(card => {
    card.addEventListener('dragstart', e => {
      draggedId = card.dataset.actionId;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    card.addEventListener('dragend', () => {
      draggedId = null;
      card.classList.remove('dragging');
      document.querySelectorAll('.lane').forEach(x => x.classList.remove('drag-over'));
    });
  });

  document.querySelectorAll('[data-drop-status]').forEach(zone => {
    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.closest('.lane')?.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', () => zone.closest('.lane')?.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      const targetStatus = zone.dataset.dropStatus;
      if (draggedId && targetStatus) setActionStatus(draggedId, targetStatus);
    });
  });
}

render();
