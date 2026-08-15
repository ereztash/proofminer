const STORAGE_KEY = 'proofminer-transition-v6-workspace';
const uid = () => Math.random().toString(36).slice(2, 10);

const blank = {
  transition: '', desiredState: '', horizon: 3, totalHours: 50,
  actions: [], baselineFrozen: false, baselineSnapshot: null,
  systemChallenge: null, newAction: '',
};

const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
const state = { ...blank, ...(stored || {}) };
if (!Array.isArray(state.actions)) state.actions = [];
const app = document.querySelector('#app');

function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function esc(v=''){ return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }
function clamp(n,min,max){ return Math.max(min,Math.min(max,Number(n)||0)); }
function allocatedHours(){ return state.actions.reduce((s,a)=>s+(Number(a.hours)||0),0); }
function reserveHours(){ return Math.max(0,Number(state.totalHours||0)-allocatedHours()); }
function actionById(id){ return state.actions.find(a=>a.id===id); }
const statusLabel=s=>({now:'עכשיו',later:'אחר כך',learn:'לברר'}[s]||s);

function allocationSegmentsHTML(){
  const total=Math.max(1,Number(state.totalHours)||1);
  const used=state.actions.filter(a=>a.hours>0).map(a=>{
    const w=Math.max(2,(a.hours/total)*100);
    return `<div class="resource-segment" style="--segment:${w}%" title="${esc(a.title)} · ${esc(a.hours)} שעות"><span><strong>${esc(a.hours)}h</strong><small>${esc(a.title)}</small></span></div>`;
  }).join('');
  const reserve=reserveHours();
  const rw=Math.max(0,(reserve/total)*100);
  return `${used}<div class="reserve-segment" style="--segment:${rw}%"><span>${esc(reserve)}h פנויות</span></div>`;
}

function refreshAllocationUI(){
  const bar=document.querySelector('.allocation-bar');
  if(bar) bar.innerHTML=allocationSegmentsHTML();
  state.actions.forEach(action=>{
    const value=document.querySelector(`[data-hours-value="${action.id}"]`);
    const maxLabel=document.querySelector(`[data-hours-max="${action.id}"]`);
    const slider=document.querySelector(`[data-hours="${action.id}"]`);
    const max=(Number(action.hours)||0)+reserveHours();
    if(value) value.textContent=`${action.hours}h`;
    if(maxLabel) maxLabel.textContent=`מקסימום זמין עכשיו: ${max}h`;
    if(slider){ slider.max=String(max); slider.value=String(action.hours); }
  });
}

function addAction(title,status='now',hours=0){
  const clean=String(title||'').trim(); if(!clean)return;
  state.actions.push({id:uid(),title:clean,status,hours:Math.min(Number(hours)||0,reserveHours()),source:'user'});
  state.newAction=''; state.systemChallenge=null; save(); render();
}
function removeAction(id){ state.actions=state.actions.filter(a=>a.id!==id); state.systemChallenge=null; save(); render(); }
function moveAction(id,d){
  const i=state.actions.findIndex(a=>a.id===id),t=i+d; if(i<0||t<0||t>=state.actions.length)return;
  const next=[...state.actions]; [next[i],next[t]]=[next[t],next[i]]; state.actions=next; save(); render();
}
function setActionStatus(id,status){ const a=actionById(id); if(!a)return; a.status=status; save(); render(); }
function setActionHours(id,requested,{renderAfter=false}={}){
  const a=actionById(id); if(!a)return;
  const current=Number(a.hours)||0,max=current+reserveHours();
  a.hours=clamp(requested,0,max); save();
  if(renderAfter) render(); else refreshAllocationUI();
}
function updateTotalHours(v){
  const next=Math.max(1,Number(v)||1); state.totalHours=next;
  const used=allocatedHours();
  if(used>next&&used>0){
    const ratio=next/used; let allocated=0;
    state.actions.forEach((a,i)=>{
      if(i===state.actions.length-1)a.hours=Math.max(0,next-allocated);
      else{ a.hours=Math.floor((Number(a.hours)||0)*ratio); allocated+=a.hours; }
    });
  }
  save(); render();
}

function freezeBaseline(){
  if(!state.transition.trim()||!state.actions.length)return;
  state.baselineSnapshot={transition:state.transition,desiredState:state.desiredState,horizon:state.horizon,totalHours:state.totalHours,actions:state.actions.map(({id,title,hours,status})=>({id,title,hours,status})),frozenAt:new Date().toISOString()};
  state.baselineFrozen=true; state.systemChallenge=null; save(); render();
}
function unfreezeBaseline(){ state.baselineFrozen=false; state.baselineSnapshot=null; state.systemChallenge=null; save(); render(); }

function runChallenge(){
  if(!state.baselineFrozen)return;
  const text=`${state.transition} ${state.desiredState}`.toLowerCase();
  const org=/ארגונ|מנהלים|חברות|enterprise|b2b/.test(text),suggestions=[];
  state.actions.forEach((a,index)=>{
    const title=a.title.toLowerCase(); let suggestedStatus=a.status;
    let reason='אין כרגע סיבה מבנית לשנות את המיקום שלך.';
    let reverse='ראיה חדשה שמגלה dependency, קהל אחר או מנגנון אחר יכולה לשנות את האתגר.';
    if(org&&/אתר|פודקאסט|תוכן|לינקדאין|וובינר|מיתוג/.test(title)){
      suggestedStatus='later';
      reason='זו פעולה סבירה, אבל היא מקבעת מסר או ערוץ לפני שנבדק מספיק טוב מי בוחר ולפי איזה קריטריון.';
      reverse='אם כבר קיימת ראיה ישירה ועדכנית לגבי buyer, criterion ו-proof נדרש — אפשר להחזיר אותה קדימה.';
    }else if(/שיח|ראיונ|לקוח|מנהלים|פנייה|outreach|מחקר/.test(title)){
      suggestedStatus='learn';
      reason='הפעולה יכולה להחזיר מידע שמבדיל בין כמה מסלולים לפני התחייבות גדולה יותר.';
      reverse='אם המידע כבר קיים ממקור חיצוני אמין, אין צורך לבצע את הלמידה שוב.';
    }else if(index===0){
      suggestedStatus='now'; reason='הפעולה הראשונה נשארת ברירת המחדל כל עוד אין ראיה שמצדיקה להפוך אותה.';
    }
    if(suggestedStatus!==a.status||reason!=='אין כרגע סיבה מבנית לשנות את המיקום שלך.') suggestions.push({actionId:a.id,suggestedStatus,reason,reverse,applied:false,rejected:false});
  });
  const hasDiscovery=state.actions.some(a=>/שיח|ראיונ|לקוח|מנהלים|מחקר/.test(a.title.toLowerCase()));
  const proposedAction=org&&!hasDiscovery?{id:uid(),title:'לקיים 5 שיחות קצרות עם בעלי תפקידים רלוונטיים לפני בניית המעטפת',status:'learn',hours:Math.min(8,reserveHours()),reason:'החוב המרכזי הוא להבין מי בוחר, לפי מה, ואיזה proof מוריד סיכון. זו פעולה שמחזירה מידע לפני lock-in.',reverse:'אם המידע כבר קיים ממקור חיצוני עדכני ואמין, אין צורך להוסיף את הפעולה.'}:null;
  state.systemChallenge={generatedAt:new Date().toISOString(),suggestions,proposedAction}; save(); render();
}
function applySuggestion(id){ const c=state.systemChallenge?.suggestions?.find(x=>x.actionId===id),a=actionById(id); if(!c||!a)return; a.status=c.suggestedStatus;c.applied=true;c.rejected=false;save();render(); }
function rejectSuggestion(id){ const c=state.systemChallenge?.suggestions?.find(x=>x.actionId===id);if(!c)return;c.rejected=true;c.applied=false;save();render(); }
function acceptProposedAction(){ const p=state.systemChallenge?.proposedAction;if(!p)return;state.actions.push({id:p.id,title:p.title,status:p.status,hours:Math.min(p.hours,reserveHours()),source:'system-proposal'});state.systemChallenge.proposedAction=null;save();render(); }
function reset(){ Object.assign(state,JSON.parse(JSON.stringify(blank)));save();render(); }
function loadDemo(){
  Object.assign(state,JSON.parse(JSON.stringify(blank)));
  state.transition='אני רוצה לעבור מייעוץ לעצמאים קטנים לייעוץ לארגונים בלי לבזבז חודשים על מיתוג שלא יזיז את העסק.';
  state.desiredState='שמנהלים בארגונים יראו בי אופציה לגיטימית ויקבעו שיחות על תהליכי ייעוץ.';
  state.horizon=3;state.totalHours=50;
  state.actions=[
    {id:uid(),title:'לשכתב את האתר',hours:16,status:'now',source:'user'},
    {id:uid(),title:'להתחיל לפרסם יותר בלינקדאין',hours:14,status:'now',source:'user'},
    {id:uid(),title:'לבנות וובינר למנהלים',hours:10,status:'later',source:'user'},
  ];save();render();
}

function header(){return `<header class="site-header"><div class="brand-lockup"><div class="logo-mark">P</div><div><b>ProofMiner</b><span>מרחב החלטה מקצועי</span></div></div><div class="header-actions"><span class="preview-badge">Preview ניסויי</span><button class="text-btn" data-action="demo">טען דוגמה</button><button class="text-btn" data-action="reset">אפס</button></div></header>`;}

function setupPanel(){return `<section class="setup-panel paper"><div class="section-head"><div><span class="eyebrow">01 · מגדירים את המעבר</span><h1>מה אתה מנסה לשנות מקצועית?</h1></div><span class="quiet-badge">לא צריך לדעת עדיין מה הפתרון</span></div><label class="big-field"><span>המעבר במילים שלך</span><textarea id="transition" rows="4" placeholder="לדוגמה: אני רוצה לעבור מייעוץ לעצמאים לייעוץ לארגונים, ולא ברור לי במה להשקיע קודם.">${esc(state.transition)}</textarea></label><div class="two-fields"><label><span>מה היית רוצה שיהיה נכון במקום? <small>אופציונלי</small></span><input id="desiredState" value="${esc(state.desiredState)}" placeholder="למשל: שמנהלים יפנו אליי..." /></label><label class="horizon-field"><span>אופק החלטה: <b data-horizon-value>${esc(state.horizon)} חודשים</b></span><input id="horizon" type="range" min="1" max="12" step="1" value="${esc(state.horizon)}" /></label></div></section>`;}
function actionComposer(){return `<section class="action-composer paper"><div><span class="eyebrow">02 · מה באמת על השולחן?</span><h2>הוסף את הפעולות שאתה שוקל</h2><p>לא צריך תוכנית מלאה. רק דברים שבאמת מתחרים עכשיו על הזמן שלך.</p></div><div class="composer-row"><input id="newAction" value="${esc(state.newAction)}" placeholder="למשל: לשכתב אתר" /><button class="primary" data-action="add-action">הוסף פעולה</button></div></section>`;}
function resourceBar(){const total=Math.max(1,Number(state.totalHours)||1);return `<section class="resource-panel paper"><div class="resource-head"><div><span class="eyebrow">03 · משאב מוגבל</span><h2>יש לך ${esc(total)} שעות להקצות</h2></div><label class="total-hours"><span>סה״כ שעות</span><input id="totalHours" type="number" min="1" max="500" value="${esc(total)}" /></label></div><div class="allocation-bar" aria-label="חלוקת שעות">${allocationSegmentsHTML()}</div><p class="resource-rule">כשאתה נותן יותר שעות לפעולה אחת, הן נגרעות מהיתרה. אי אפשר לתת לכולן עדיפות מלאה.</p></section>`;}

function challengeBlock(a,c){const changed=c.suggestedStatus!==a.status;return `<div class="challenge-block ${c.applied?'accepted':''} ${c.rejected?'rejected':''}"><div class="challenge-head"><span aria-label="אתגר של המערכת">אתגר</span>${changed?`<b>${statusLabel(a.status)} → ${statusLabel(c.suggestedStatus)}</b>`:'<b>בדיקת הנחה</b>'}</div><p>${esc(c.reason)}</p><details><summary>מה יגרום לאתגר הזה להיעלם?</summary><p>${esc(c.reverse)}</p></details><div class="challenge-actions"><button class="mini-primary" data-apply-suggestion="${esc(a.id)}">החל את השינוי</button><button class="mini-secondary" data-reject-suggestion="${esc(a.id)}">אני לא מקבל</button></div></div>`;}
function actionCard(a){const max=(Number(a.hours)||0)+reserveHours(),c=state.systemChallenge?.suggestions?.find(x=>x.actionId===a.id);return `<article class="action-card" draggable="true" data-action-id="${esc(a.id)}"><div class="drag-handle" aria-hidden="true">⋮⋮</div><div class="action-main"><input class="action-title-input" data-action-title="${esc(a.id)}" value="${esc(a.title)}" aria-label="שם הפעולה" /><div class="status-switch" role="group" aria-label="מצב הפעולה">${['now','later','learn'].map(s=>`<button class="status-btn ${a.status===s?'active':''}" data-set-status="${s}" data-id="${esc(a.id)}">${statusLabel(s)}</button>`).join('')}</div><div class="hours-control"><div class="hours-label"><span>שעות</span><b data-hours-value="${esc(a.id)}">${esc(a.hours)}h</b><small data-hours-max="${esc(a.id)}">מקסימום זמין עכשיו: ${esc(max)}h</small></div><input type="range" min="0" max="${esc(max)}" step="1" value="${esc(a.hours)}" data-hours="${esc(a.id)}" aria-label="שעות לפעולה ${esc(a.title)}" /><div class="hours-buttons"><button data-hours-step="-1" data-id="${esc(a.id)}">−</button><button data-hours-step="1" data-id="${esc(a.id)}">+</button></div></div></div><div class="action-tools"><button class="icon-btn" data-move="-1" data-id="${esc(a.id)}" title="הזז למעלה">↑</button><button class="icon-btn" data-move="1" data-id="${esc(a.id)}" title="הזז למטה">↓</button><button class="icon-btn danger" data-remove="${esc(a.id)}" title="מחק">×</button></div>${c?challengeBlock(a,c):''}</article>`;}
function lane(status,title,subtitle){const actions=state.actions.filter(a=>a.status===status);return `<section class="lane" data-lane="${status}"><header><div><span>${title}</span><small>${subtitle}</small></div><b>${actions.length}</b></header><div class="lane-dropzone" data-drop-status="${status}">${actions.length?actions.map(actionCard).join(''):'<div class="empty-lane">גרור לכאן פעולה או השתמש בכפתורי המצב</div>'}</div></section>`;}
function baselineStrip(){if(!state.baselineFrozen||!state.baselineSnapshot)return'';return `<section class="baseline-strip"><div><span>נקודת ההתחלה נשמרה</span><b>${state.baselineSnapshot.actions.length} פעולות · ${esc(state.baselineSnapshot.totalHours)} שעות</b></div><button class="text-btn" data-action="unfreeze">פתח מחדש</button></section>`;}
function proposedActionBlock(){const p=state.systemChallenge?.proposedAction;if(!p)return'';return `<section class="proposed-action paper"><span class="eyebrow">פעולה שהמערכת מציעה להוסיף — לא עובדה מהשטח</span><h3>${esc(p.title)}</h3><p>${esc(p.reason)}</p><div><b>${esc(p.hours)} שעות מוצעות</b><button class="primary" data-action="accept-proposed">הוסף למרחב שלי</button></div></section>`;}

function workspaceScreen(){const canFreeze=state.transition.trim()&&state.actions.length>0;return `${header()}<main class="workspace-shell">${setupPanel()}${actionComposer()}${state.actions.length?resourceBar():''}${baselineStrip()}${state.actions.length?`<section class="board-head"><div><span class="eyebrow">04 · תזיז את התוכנית, לא את הטקסט</span><h2>איפה כל פעולה נמצאת עכשיו?</h2><p>גרור בין אזורים, סדר מחדש, או השתמש בכפתורים. המודל נשמר תוך כדי.</p></div><div class="board-actions">${!state.baselineFrozen?`<button class="primary" data-action="freeze" ${canFreeze?'':'disabled'}>שמור את התוכנית שלי לפני האתגר</button>`:`<button class="primary" data-action="challenge">${state.systemChallenge?'הרץ אתגר מחדש':'אתגר את התוכנית שלי'}</button>`}</div></section><section class="decision-board direct-board">${lane('now','עכשיו','משהו שאתה באמת מתכוון לבצע')}${lane('later','אחר כך','סביר, אבל לא צריך משאב עכשיו')}${lane('learn','לברר','פעולה שמטרתה להחזיר מידע')}</section>${proposedActionBlock()}`:'<section class="empty-workspace"><b>המרחב ייבנה מתוך הפעולות שלך.</b><span>הוסף פעולה אחת כדי להתחיל.</span></section>'}<footer class="workspace-footer"><span>Preview ניסויי · האתגרים כאן הם מסקנות/השערות של המערכת, לא מחקר שוק מאומת.</span></footer></main>`;}

function render(){app.innerHTML=workspaceScreen();bind();}
function bind(){
  document.querySelector('#transition')?.addEventListener('input',e=>{state.transition=e.target.value;save();});
  document.querySelector('#desiredState')?.addEventListener('input',e=>{state.desiredState=e.target.value;save();});
  document.querySelector('#horizon')?.addEventListener('input',e=>{state.horizon=Number(e.target.value);save();const n=document.querySelector('[data-horizon-value]');if(n)n.textContent=`${state.horizon} חודשים`;});
  document.querySelector('#newAction')?.addEventListener('input',e=>{state.newAction=e.target.value;save();});
  document.querySelector('#newAction')?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();addAction(e.target.value);}});
  document.querySelector('#totalHours')?.addEventListener('change',e=>updateTotalHours(e.target.value));
  document.querySelectorAll('[data-action-title]').forEach(input=>input.addEventListener('change',e=>{const a=actionById(e.target.dataset.actionTitle);if(!a)return;a.title=e.target.value.trim()||a.title;save();render();}));
  document.querySelectorAll('[data-hours]').forEach(input=>{input.addEventListener('input',e=>setActionHours(e.target.dataset.hours,e.target.value));input.addEventListener('change',e=>setActionHours(e.target.dataset.hours,e.target.value,{renderAfter:true}));});
  document.querySelectorAll('[data-hours-step]').forEach(b=>b.addEventListener('click',()=>{const a=actionById(b.dataset.id);if(a)setActionHours(a.id,(Number(a.hours)||0)+Number(b.dataset.hoursStep),{renderAfter:true});}));
  document.querySelectorAll('[data-set-status]').forEach(b=>b.addEventListener('click',()=>setActionStatus(b.dataset.id,b.dataset.setStatus)));
  document.querySelectorAll('[data-move]').forEach(b=>b.addEventListener('click',()=>moveAction(b.dataset.id,Number(b.dataset.move))));
  document.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>removeAction(b.dataset.remove)));
  document.querySelectorAll('[data-apply-suggestion]').forEach(b=>b.addEventListener('click',()=>applySuggestion(b.dataset.applySuggestion)));
  document.querySelectorAll('[data-reject-suggestion]').forEach(b=>b.addEventListener('click',()=>rejectSuggestion(b.dataset.rejectSuggestion)));
  document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>{const x=b.dataset.action;if(x==='add-action')addAction(state.newAction);if(x==='freeze')freezeBaseline();if(x==='unfreeze')unfreezeBaseline();if(x==='challenge')runChallenge();if(x==='accept-proposed')acceptProposedAction();if(x==='demo')loadDemo();if(x==='reset')reset();}));
  let draggedId=null;
  document.querySelectorAll('.action-card[draggable="true"]').forEach(card=>{card.addEventListener('dragstart',e=>{draggedId=card.dataset.actionId;card.classList.add('dragging');e.dataTransfer.effectAllowed='move';});card.addEventListener('dragend',()=>{draggedId=null;card.classList.remove('dragging');document.querySelectorAll('.lane').forEach(x=>x.classList.remove('drag-over'));});});
  document.querySelectorAll('[data-drop-status]').forEach(zone=>{zone.addEventListener('dragover',e=>{e.preventDefault();zone.closest('.lane')?.classList.add('drag-over');});zone.addEventListener('dragleave',()=>zone.closest('.lane')?.classList.remove('drag-over'));zone.addEventListener('drop',e=>{e.preventDefault();if(draggedId&&zone.dataset.dropStatus)setActionStatus(draggedId,zone.dataset.dropStatus);});});
}
render();