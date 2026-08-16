const STORAGE_KEY='proofminer-commitment-gate-v1';
const uid=()=>Math.random().toString(36).slice(2,10);

const MECHANISMS={
  visibility:{label:'חשיפה',statement:'שהחסם המרכזי הוא חשיפה: אם יותר מהאנשים הנכונים יראו אותך, המעבר יתקדם.',alt:['תרגום/מיצוב','הוכחה/לגיטימציה','גישה לאנשים הנכונים'],test:'בדוק עם 5 אנשים מקהל היעד: האם כבר נחשפו אליך, האם הם מבינים במה אתה רלוונטי, ומה עדיין מונע מהם להתקדם איתך.'},
  translation:{label:'תרגום ומיצוב',statement:'שהחסם המרכזי הוא איך הערך שלך מתורגם ומוצג: שינוי המסר או הנכס יפתח את המעבר.',alt:['הוכחה/לגיטימציה','גישה לאנשים הנכונים','התאמת ההצעה'],test:'הצג את המסר/העמוד הנוכחי ל-5 אנשים מקהל היעד ובקש מהם להסביר בחזרה למי זה מיועד, איזו בעיה זה פותר ומה חסר להם כדי להאמין שזה רלוונטי.'},
  proof:{label:'הוכחה ולגיטימציה',statement:'שהחסם המרכזי הוא proof: יותר ראיות, cases או לגיטימציה יורידו מספיק סיכון כדי לאפשר את הצעד הבא.',alt:['גישה','תרגום ומיצוב','התאמת ההצעה'],test:'שאל 5 אנשים מקהל היעד איזה proof הם היו צריכים לראות כדי להסכים לצעד הבא, והשווה את התשובות למה שכבר יש לך.'},
  access:{label:'גישה',statement:'שהחסם המרכזי הוא גישה: אם תגיע לאנשים הנכונים, מה שכבר יש לך מספיק טוב כדי להתקדם.',alt:['תרגום ומיצוב','הוכחה/לגיטימציה','התאמת ההצעה'],test:'בצע 10 פניות ממוקדות עם ההצעה והחומרים הנוכחיים. הפרד בין לא-הגעתי, הגעתי-אבל-לא-הבנתי, והבנתי-אבל-לא-השתכנעתי.'},
  offer:{label:'מבנה ההצעה',statement:'שהחסם המרכזי הוא ההצעה עצמה: תמחור, packaging או צורת השירות מונעים את הצעד הבא.',alt:['גישה','הוכחה/לגיטימציה','תרגום ומיצוב'],test:'הצג את ההצעה הנוכחית ללא שינוי ל-5 לקוחות מתאימים ותעד את קריטריון הסירוב לפני שאתה משנה מחיר או packaging.'},
  capability:{label:'יכולת',statement:'שהחסם המרכזי הוא יכולת: לפני שהמעבר יכול להתקדם חסרה לך מיומנות או כשירות מקצועית.',alt:['גישה','הוכחה/לגיטימציה','תרגום ומיצוב'],test:'נסה 2 משימות אמיתיות שמייצגות את העבודה החדשה לפני השקעה בהכשרה נוספת, ותעד איפה היכולת הנוכחית באמת נשברת.'},
  capacity:{label:'קיבולת ותפעול',statement:'שהחסם המרכזי הוא קיבולת: בלי שינוי בתהליך, אוטומציה או חלוקת עבודה לא תוכל לבצע את המעבר.',alt:['ביקוש/גישה','התאמת ההצעה','סדר הפעולות'],test:'מדוד שבוע עבודה אמיתי אחד: איפה הזמן נצרך, איזה עומס באמת חוסם את המהלך, ומה יקרה אם לא תבנה תשתית נוספת.'},
  unknown:{label:'הנחת ביצוע',statement:'שהפעולות שבחרת תוקפות את החסם הנכון — למרות שהתוכנית עדיין לא מכילה דרך ברורה לבדוק זאת.',alt:['החסם נמצא מוקדם יותר','החסם נמצא אצל ה-buyer','הפעולה נכונה אבל הסדר שגוי'],test:'לפני הרחבת הביצוע, אסוף 5 תצפיות קצרות מהשטח שמסוגלות לשנות את הפעולה הבאה שלך.'}
};

const blank={transition:'',desiredState:'',horizon:3,totalHours:50,actions:[],newAction:'',baseline:null,reveal:null,betOverride:null};
const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
const state={...blank,...(saved||{})};
if(!Array.isArray(state.actions))state.actions=[];
const app=document.querySelector('#app');

const esc=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const save=()=>localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
const allocated=()=>state.actions.reduce((s,a)=>s+(Number(a.hours)||0),0);
const reserve=()=>Math.max(0,(Number(state.totalHours)||0)-allocated());
const byId=id=>state.actions.find(a=>a.id===id);

function classify(title){
  const t=String(title||'').toLowerCase();
  if(/ראיונ|מחקר|שיחות עם|buyer|סקר|survey|ניסוי|בדיק|validation|ללמוד מהשוק/.test(t))return'discovery';
  if(/קייס|case study|case|testimonial|המלצ|הוכח|proof|פורטפוליו|portfolio/.test(t))return'proof';
  if(/פנייה|פניות|outreach|נטוורק|network|קשרים|לידים|cold|מנכ|שיחת מכירה|referral/.test(t))return'access';
  if(/אתר|מיצוב|מסר|מיתוג|דף נחיתה|פרופיל|ניסוח|position|branding|website/.test(t))return'translation';
  if(/לינקדאין|תוכן|פוסט|וובינר|פודקאסט|הרצא|פרסום|קמפיין|חשיפה|content|linkedin|webinar/.test(t))return'visibility';
  if(/מחיר|תמחור|חבילה|הצעה|מוצר|שירות|pricing|package|offer/.test(t))return'offer';
  if(/קורס|ללמוד|הכשרה|הסמכה|מיומנות|training|course|skill/.test(t))return'capability';
  if(/אוטומצ|מערכת|תהליך|תפעול|להעסיק|עובד|delegate|automation|process/.test(t))return'capacity';
  return'unknown';
}

function exposure(){
  const groups={};let discoveryHours=0,nonDiscovery=0;
  state.actions.forEach((a,index)=>{
    const kind=classify(a.title),hours=Number(a.hours)||0,weight=allocated()>0?hours:1;
    if(kind==='discovery'){discoveryHours+=weight;return;}
    nonDiscovery+=weight;
    if(!groups[kind])groups[kind]={kind,weight:0,actions:[],firstIndex:index};
    groups[kind].weight+=weight;groups[kind].actions.push(a);
  });
  const sorted=Object.values(groups).sort((a,b)=>b.weight-a.weight);
  return{sorted,dominant:sorted[0]||null,nonDiscovery,discoveryHours};
}

function deriveReveal(){
  const ex=exposure();
  const chosen=state.betOverride||ex.dominant?.kind||'unknown';
  const m=MECHANISMS[chosen]||MECHANISMS.unknown;
  const dominantWeight=ex.dominant?.weight||0;
  const share=ex.nonDiscovery?dominantWeight/ex.nonDiscovery:0;
  const dominantHours=allocated()>0?dominantWeight:null;
  const total=Number(state.totalHours)||0;
  const substantial=allocated()>0?dominantWeight>=Math.min(10,total*.2):dominantWeight>=2;
  const concentrated=share>=.5;
  const discoveryAction=state.actions.find(a=>classify(a.title)==='discovery');
  let outcome='KEEP',why='לא זוהה כרגע הימור יחיד שמרכז מספיק מהתוכנית כדי להצדיק עצירה או שינוי.';
  if(concentrated&&substantial&&!discoveryAction){
    outcome='TEST_FIRST';
    why='חלק גדול מהמחויבות שלך תלוי באותו מנגנון, אבל התוכנית עצמה אינה כוללת כרגע פעולה שמבדילה אם המנגנון הזה באמת load-bearing.';
  }else if(concentrated&&discoveryAction){
    const idxDiscovery=state.actions.findIndex(a=>a.id===discoveryAction.id);
    const idxDominant=ex.dominant?.firstIndex??0;
    if(idxDiscovery>idxDominant){
      outcome='CHANGE';
      why='כבר יש בתוכנית פעולה שמייצרת מידע, אבל היא מופיעה אחרי חלק מהמחויבות שהיא אמורה לבדוק. השינוי המינימלי הוא להקדים את הלמידה.';
    }else{
      outcome='KEEP';
      why='התוכנית מרכזת משאבים בהימור ברור, אבל כבר כוללת פעולה מוקדמת שמחזירה מידע לפני רוב המחויבות. כרגע אין סיבה מבנית לשנות מעבר לכך.';
    }
  }
  const structural=`${dominantHours!==null?`${Math.round(dominantHours)} מתוך ${Math.round(allocated())} השעות שהקצית`:`רוב הפעולות שבחרת`} מכוונות בעיקר ל${m.label}.`;
  return{
    mechanism:chosen,label:m.label,statement:m.statement,alternatives:m.alt,test:m.test,outcome,why,structural,
    evidence:[
      {type:'F2',relation:'OBSERVED',text:structural},
      {type:'MISSING',relation:'MISSING',text:'עדיין לא צורפה ראיה חיצונית שמסוגלת להכריע אם ההימור הזה הוא אכן החסם המרכזי.'}
    ],
    reversal: outcome==='TEST_FIRST'?'אם התצפית הקטנה תראה שההימור הנוכחי כן מסביר היטב את החסם, נחזור לתוכנית ונאיץ אותה.':outcome==='CHANGE'?'אם יתברר שהלמידה אינה יכולה לשנות את הפעולות שכבר לפניה, אין הצדקה להקדים אותה.':'ראיה חדשה שמראה שמנגנון אחר הוא prerequisite או צוואר בקבוק מוקדם יותר תפתח את התוכנית מחדש.'
  };
}

function addAction(title,hours=0){
  const clean=String(title||'').trim();if(!clean)return;
  state.actions.push({id:uid(),title:clean,hours:Math.min(Number(hours)||0,reserve())});
  state.newAction='';state.baseline=null;state.reveal=null;state.betOverride=null;save();render();
}
function removeAction(id){state.actions=state.actions.filter(a=>a.id!==id);state.baseline=null;state.reveal=null;state.betOverride=null;save();render();}
function moveAction(id,d){const i=state.actions.findIndex(a=>a.id===id),j=i+d;if(i<0||j<0||j>=state.actions.length)return;[state.actions[i],state.actions[j]]=[state.actions[j],state.actions[i]];state.baseline=null;state.reveal=null;save();render();}
function setHours(id,v){const a=byId(id);if(!a)return;const max=(Number(a.hours)||0)+reserve();a.hours=Math.max(0,Math.min(max,Number(v)||0));state.baseline=null;state.reveal=null;save();render();}
function updateTotal(v){state.totalHours=Math.max(1,Number(v)||1);if(allocated()>state.totalHours){let left=state.totalHours;state.actions.forEach(a=>{a.hours=Math.min(Number(a.hours)||0,left);left-=a.hours;});}state.baseline=null;state.reveal=null;save();render();}
function freezeAndReveal(){
  if(!state.transition.trim()||!state.actions.length)return;
  state.baseline={transition:state.transition,desiredState:state.desiredState,horizon:state.horizon,totalHours:state.totalHours,actions:state.actions.map(a=>({...a})),frozenAt:new Date().toISOString()};
  state.reveal=deriveReveal();save();render();
}
function applyBetOverride(kind){state.betOverride=kind||null;state.reveal=deriveReveal();save();render();}
function applyOutcome(){
  if(!state.reveal)return;
  if(state.reveal.outcome==='TEST_FIRST'){
    const budget=Math.min(6,Math.max(2,Math.floor((Number(state.totalHours)||10)*.12)));
    let need=budget;
    [...state.actions].sort((a,b)=>(b.hours||0)-(a.hours||0)).forEach(a=>{if(need<=0)return;const take=Math.min(Number(a.hours)||0,need);a.hours-=take;need-=take;});
    state.actions.unshift({id:uid(),title:`ניסוי קטן: ${state.reveal.test}`,hours:budget,status:'test'});
  }else if(state.reveal.outcome==='CHANGE'){
    const i=state.actions.findIndex(a=>classify(a.title)==='discovery');if(i>0){const [a]=state.actions.splice(i,1);state.actions.unshift(a);}
  }
  state.baseline=null;state.reveal=null;state.betOverride=null;save();render();
}
function reset(){Object.assign(state,JSON.parse(JSON.stringify(blank)));save();render();}
function demo(){Object.assign(state,JSON.parse(JSON.stringify(blank)));state.transition='אני רוצה לעבור מייעוץ לעצמאים קטנים לייעוץ לארגונים, ולא לבזבז חודשים על מהלך שלא יזיז את העסק.';state.desiredState='שמנהלים בארגונים יראו בי אופציה לגיטימית ויקבעו איתי שיחות.';state.totalHours=50;state.actions=[{id:uid(),title:'לשכתב את האתר',hours:16},{id:uid(),title:'להתחיל לפרסם יותר בלינקדאין',hours:14},{id:uid(),title:'לבנות וובינר למנהלים',hours:10}];save();render();}

function allocationBar(){
  const total=Math.max(1,Number(state.totalHours)||1);
  const segs=state.actions.filter(a=>a.hours>0).map(a=>`<div class="resource-segment" style="--segment:${Math.max(2,a.hours/total*100)}%"><span><strong>${a.hours}h</strong><small>${esc(a.title)}</small></span></div>`).join('');
  return `<div class="allocation-bar">${segs}<div class="reserve-segment" style="--segment:${Math.max(0,reserve()/total*100)}%"><span>${reserve()}h פנויות</span></div></div>`;
}
function header(){return `<header class="site-header"><div class="brand-lockup"><div class="logo-mark">P</div><div><b>ProofMiner</b><span>בדיקת מחויבות לפני שאתה משלם עליה</span></div></div><div class="header-actions"><span class="preview-badge">Commitment Gate · ניסוי</span><button class="text-btn" data-act="demo">טען דוגמה</button><button class="text-btn" data-act="reset">אפס</button></div></header>`;}
function intro(){return `<section class="setup-panel"><div class="section-head"><div><span class="eyebrow">לפני שאתה מתחייב</span><h1>על מה התוכנית שלך בעצם מהמרת?</h1><p class="lead">ספר מה אתה מנסה לשנות ומה אתה עומד לעשות. המערכת לא תחפש "אבחנה חכמה" — היא תבדוק מה חייב להיות נכון כדי שההשקעה שלך תהיה הגיונית.</p></div></div><label class="big-field"><span>מה אתה מנסה לשנות מקצועית?</span><textarea id="transition" placeholder="לדוגמה: לעבור מייעוץ לעצמאים לייעוץ לארגונים">${esc(state.transition)}</textarea></label><div class="two-fields"><label><span>מה היית רוצה שיהיה נכון במקום? <small>אופציונלי</small></span><input id="desired" value="${esc(state.desiredState)}" placeholder="למשל: שמנהלים יקבעו איתי שיחות" /></label><label class="horizon-field"><span>אופק: <b data-horizon>${state.horizon} חודשים</b></span><input id="horizon" type="range" min="1" max="12" value="${state.horizon}" /></label></div></section>`;}
function plan(){return `<section class="commitment-plan"><div class="section-head"><div><span class="eyebrow">התוכנית שלך לפני המערכת</span><h2>מה אתה באמת עומד לעשות?</h2><p>הכנס פעולות אמיתיות והקצה להן זמן. זה ה-baseline — לא תשובה לשאלון.</p></div><label class="total-hours"><span>סה״כ שעות זמינות</span><input id="totalHours" type="number" min="1" max="500" value="${state.totalHours}" /></label></div><div class="composer-row"><input id="newAction" value="${esc(state.newAction)}" placeholder="למשל: לשכתב את האתר"/><button class="primary" data-act="add">הוסף פעולה</button></div>${state.actions.length?`<div class="plan-list">${state.actions.map((a,i)=>`<article class="plan-action"><div class="plan-order"><button data-move="-1" data-id="${a.id}" ${i===0?'disabled':''}>↑</button><button data-move="1" data-id="${a.id}" ${i===state.actions.length-1?'disabled':''}>↓</button></div><input class="action-title-input" data-title="${a.id}" value="${esc(a.title)}"/><div class="plan-hours"><b>${a.hours}h</b><input type="range" min="0" max="${a.hours+reserve()}" value="${a.hours}" data-hours="${a.id}"/><button class="icon-btn danger" data-remove="${a.id}">×</button></div></article>`).join('')}</div><section class="resource-panel"><div class="resource-head"><div><span class="eyebrow">המחויבות בפועל</span><h2>${allocated()} מתוך ${state.totalHours} שעות כבר מוקצות</h2></div></div>${allocationBar()}</section><button class="primary reveal-cta" data-act="reveal">בדוק על מה התוכנית שלי מהמרת</button>`:`<div class="empty-workspace"><b>הוסף לפחות פעולה אחת.</b><span>הערך מתחיל מהתוכנית שאתה באמת עומד לבצע.</span></div>`}</section>`;}

function reveal(){
  const r=state.reveal;if(!r)return'';
  const outcomeLabel={KEEP:'KEEP · אפשר להמשיך',CHANGE:'CHANGE · שנה את הסדר',TEST_FIRST:'TEST FIRST · בדוק לפני שאתה מתחייב'}[r.outcome];
  const opts=Object.entries(MECHANISMS).filter(([k])=>k!=='unknown').map(([k,v])=>`<option value="${k}" ${r.mechanism===k?'selected':''}>${v.label}</option>`).join('');
  return `<section class="reveal-shell"><div class="reveal-title"><span class="eyebrow">Diagnostic Reveal — בלי להעמיד פנים שזו אמת מהשוק</span><h2>${outcomeLabel}</h2><p>${esc(r.why)}</p></div><div class="reveal-grid"><article class="reveal-panel user-panel"><span>1 · המחויבות שלך</span><h3>${esc(r.structural)}</h3><p>זה נתון מהתוכנית שהקפאת — לא פרשנות של המערכת.</p></article><article class="reveal-panel system-panel"><span>2 · ההימור שהמערכת מזהה</span><h3>${esc(r.statement)}</h3><p>זו inference מהפעולות שלך. היא יכולה להיות שגויה.</p><label class="bet-correction">הפירוש שלי שונה:<select id="betOverride">${opts}<option value="unknown" ${r.mechanism==='unknown'?'selected':''}>לא ניתן להסיק מנגנון אחד</option></select></label></article><article class="reveal-panel evidence-panel"><span>3 · מה אנחנו באמת יודעים</span>${r.evidence.map(e=>`<div class="evidence-row ${e.relation.toLowerCase()}"><b>${e.type}</b><p>${esc(e.text)}</p></div>`).join('')}<div class="alternatives"><b>מה עוד יכול להסביר את אותו מצב?</b><div>${r.alternatives.map(a=>`<span>${esc(a)}</span>`).join('')}</div></div></article></div><article class="decision-consequence ${r.outcome.toLowerCase()}"><span>4 · המשמעות להקצאה</span>${r.outcome==='TEST_FIRST'?`<h3>אל תחליף 40 שעות ב-40 שעות אחרות. קנה קודם מידע זול יותר.</h3><p><b>ניסוי מוצע:</b> ${esc(r.test)}</p>`:r.outcome==='CHANGE'?`<h3>הקדם את פעולת הלמידה לפני הפעולות שהיא אמורה לבדוק.</h3><p>לא צריך כרגע להחליף את כל האסטרטגיה — רק לתקן את הסדר.</p>`:`<h3>אין כרגע סיבה מבנית לשנות את התוכנית.</h3><p>KEEP אינו כישלון. המשמעות היא שה-pass הזה לא מצא הימור מרוכז ולא-נבדק שמצדיק שינוי.</p>`}<details><summary>מה יגרום לנו לשנות שוב?</summary><p>${esc(r.reversal)}</p></details>${r.outcome!=='KEEP'?`<button class="primary" data-act="apply">החל את השינוי על התוכנית</button>`:''}</article></section>`;
}

function render(){app.innerHTML=`${header()}<main class="workspace-shell">${intro()}${plan()}${reveal()}<footer class="workspace-footer">Preview ניסויי · המערכת חושפת הימורים ומבנה מחויבות; היא לא טוענת שזיהתה את "הבעיה האמיתית" בלי ראיות מהשטח.</footer></main>`;bind();}
function bind(){
  document.querySelector('#transition')?.addEventListener('input',e=>{state.transition=e.target.value;state.baseline=null;state.reveal=null;save();});
  document.querySelector('#desired')?.addEventListener('input',e=>{state.desiredState=e.target.value;state.baseline=null;state.reveal=null;save();});
  document.querySelector('#horizon')?.addEventListener('input',e=>{state.horizon=Number(e.target.value);document.querySelector('[data-horizon]').textContent=`${state.horizon} חודשים`;save();});
  document.querySelector('#newAction')?.addEventListener('input',e=>{state.newAction=e.target.value;save();});
  document.querySelector('#newAction')?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();addAction(e.target.value);}});
  document.querySelector('#totalHours')?.addEventListener('change',e=>updateTotal(e.target.value));
  document.querySelector('#betOverride')?.addEventListener('change',e=>applyBetOverride(e.target.value));
  document.querySelectorAll('[data-title]').forEach(x=>x.addEventListener('change',e=>{const a=byId(e.target.dataset.title);if(a){a.title=e.target.value.trim()||a.title;state.baseline=null;state.reveal=null;state.betOverride=null;save();render();}}));
  document.querySelectorAll('[data-hours]').forEach(x=>x.addEventListener('change',e=>setHours(e.target.dataset.hours,e.target.value)));
  document.querySelectorAll('[data-remove]').forEach(x=>x.addEventListener('click',()=>removeAction(x.dataset.remove)));
  document.querySelectorAll('[data-move]').forEach(x=>x.addEventListener('click',()=>moveAction(x.dataset.id,Number(x.dataset.move))));
  document.querySelectorAll('[data-act]').forEach(x=>x.addEventListener('click',()=>{const a=x.dataset.act;if(a==='demo')demo();if(a==='reset')reset();if(a==='add')addAction(state.newAction);if(a==='reveal')freezeAndReveal();if(a==='apply')applyOutcome();}));
}
render();
