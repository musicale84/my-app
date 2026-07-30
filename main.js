
// ===== STATE =====
let S={
  onboarded:false,
  settings:{baseline:0,taxRate:.32,hstRate:.13,duesRate:.03,enjoyPct:.20},
  balances:{checking:0,savings:0,tfsa:0,invest:0},
  debt:{cc:0,loan:0},
  selfLoan:0,
  currency:'$',
  expenses:[
    {id:1,name:'Rent / Mortgage',amt:0},
    {id:2,name:'Groceries',amt:0},
    {id:3,name:'Utilities',amt:0},
    {id:4,name:'Transit / Car',amt:0},
    {id:5,name:'Childcare',amt:0},
    {id:6,name:'Other fixed costs',amt:0}
  ],
  buckets:[],invAccounts:[],gigs:[],
  funFund:{current:0,next:0,lastResetMonth:-1},
  learnMode:true,toggleCarry:false,toggleBuffer:false,
  analytics:{
    onboardingDropStep:null,
    sessionsCount:0,
    gigsLogged:0,
    screenVisits:{},
    learnModeChanges:0
  }
};

// ===== LOCK SCREEN =====
// CHANGE THIS PASSWORD before deploying
const ACCESS_PASSWORD = '3gDP4h6fs';

function checkPwd(){
  var val=document.getElementById('lock-pwd').value;
  var err=document.getElementById('lock-err');
  if(val===ACCESS_PASSWORD){
    document.getElementById('lock').style.display='none';
    document.getElementById('app-shell').style.display='flex';
    try{ load(); }catch(loadErr){ alert('Load error: '+loadErr.message); }
    try{ track('app_unlocked'); }catch(e){}
  } else {
    if(err){ err.style.display='block'; err.textContent='Incorrect password'; }
    var pwd=document.getElementById('lock-pwd');
    if(pwd){ pwd.value=''; pwd.focus(); }
  }
}

// ===== PERSISTENCE =====
function checkFunFundReset(){
  const now=new Date(); const thisMonth=now.getMonth();
  if(S.funFund.lastResetMonth!==thisMonth){
    S.funFund.current=S.toggleCarry?(S.funFund.current||0)+(S.funFund.next||0):(S.funFund.next||0);
    S.funFund.next=0; S.funFund.lastResetMonth=thisMonth;
  }
}
function migrateOldData(){
  // Check for data saved under previous storage keys and migrate automatically
  var oldKeys=['aa_v4','aa_v3','aa_v2','aa2','aa3'];
  for(var i=0;i<oldKeys.length;i++){
    try{
      var old=localStorage.getItem(oldKeys[i]);
      if(old){
        var parsed=JSON.parse(old);
        // Merge old data into current state, preserving gigs and settings
        if(parsed.gigs && parsed.gigs.length>0) S.gigs=parsed.gigs;
        if(parsed.settings) S.settings=Object.assign({},S.settings,parsed.settings);
        if(parsed.expenses && parsed.expenses.length>0) S.expenses=parsed.expenses;
        if(parsed.buckets) S.buckets=parsed.buckets;
        if(parsed.invAccounts) S.invAccounts=parsed.invAccounts;
        if(parsed.onboarded) S.onboarded=parsed.onboarded;
        if(parsed.funFund) S.funFund=Object.assign({},S.funFund,parsed.funFund);
        // Save under new key and remove old
        localStorage.setItem('aa_v5',JSON.stringify(S));
        localStorage.removeItem(oldKeys[i]);
        console.log('Migrated data from',oldKeys[i]);
        return true;
      }
    }catch(e){ console.log('Migration error for',oldKeys[i],e); }
  }
  return false;
}

function load(){
  try{
    const d=localStorage.getItem('aa_v5');
    if(d){
      const saved=JSON.parse(d);
      S=Object.assign({},S,saved);
      if(!S.analytics)S.analytics={onboardingDropStep:null,sessionsCount:0,gigsLogged:0,screenVisits:{},learnModeChanges:0};
      if(!S.debt)S.debt={cc:0,loan:0};
      if(!S.balances)S.balances={checking:0,savings:0,tfsa:0,invest:0};
      if(!S.funFund)S.funFund={current:0,next:0,lastResetMonth:-1};
      if(typeof S.selfLoan!=='number')S.selfLoan=0;
      if(!S.currency)S.currency='$';
      // hasSeenReadinessCheck intentionally NOT defaulted — existing users should see it once
      // Backfill entryOrder for gigs logged before sort feature existed
      if(S.gigs && S.gigs.length){
        S.gigs.forEach((g,i)=>{ if(!g.entryOrder) g.entryOrder = new Date(g.date+'T12:00:00').getTime() + i; });
      }
    } else {
      // No v5 data found - check if there is older data to migrate
      migrateOldData();
    }
  }catch(e){console.log('Load error:',e);}
  S.analytics.sessionsCount=(S.analytics.sessionsCount||0)+1;
  save();
  checkFunFundReset();
  if(S.onboarded){
    document.getElementById('fab').style.display='flex';
    showPage('dashboard');
    applyLearnMode();
    // Show readiness check once for all users (new and existing)
    if(!S.hasSeenReadinessCheck){
      setTimeout(()=>openOv('readiness-modal'), 800);
    }
  } else {
    try{ renderObExpRows(); }catch(e){ console.log('renderObExpRows error:',e); }
  }
}
function save(){try{localStorage.setItem('aa_v5',JSON.stringify(S));}catch(e){}}

// ===== ANALYTICS (privacy-safe, local only) =====
function track(event,data){
  if(!S.analytics)S.analytics={};
  S.analytics.lastEvent=event;
  S.analytics.lastEventTime=new Date().toISOString();
  if(event==='screen_view'&&data){
    if(!S.analytics.screenVisits)S.analytics.screenVisits={};
    S.analytics.screenVisits[data]=(S.analytics.screenVisits[data]||0)+1;
  }
  if(event==='gig_logged')S.analytics.gigsLogged=(S.analytics.gigsLogged||0)+1;
  if(event==='learn_mode_changed')S.analytics.learnModeChanges=(S.analytics.learnModeChanges||0)+1;
  save();
  // PostHog — active when POSTHOG_KEY is set
  if(window.posthog && typeof posthog.capture === 'function') {
    try { posthog.capture(event, Object.assign({}, typeof data==='object'?data:{value:data}, {anon_id:getAnonId()})); } catch(e){}
  }
}
function getAnonId(){
  let id=localStorage.getItem('aa_anon_id');
  if(!id){id='anon_'+Math.random().toString(36).substr(2,9);localStorage.setItem('aa_anon_id',id);}
  return id;
}

// ===== HELPERS =====
function currSym(){ return S.currency || '$'; }
function fmt(n){ return currSym()+(+n||0).toLocaleString('en-CA',{minimumFractionDigits:0,maximumFractionDigits:0}); }
function fmt2(n){ return currSym()+(+n||0).toFixed(2); }
function fmtD(d){return new Date(d+'T12:00:00').toLocaleDateString('en-CA',{month:'short',day:'numeric'});}
function fmtFull(d){return new Date(d+'T12:00:00').toLocaleDateString('en-CA',{year:'numeric',month:'long',day:'numeric'});}

// ===== OVERLAY SYSTEM =====
function openOv(id){document.getElementById(id).classList.add('open');}
function closeOv(id){document.getElementById(id).classList.remove('open');}
function closeOvIf(e,id){if(e.target===document.getElementById(id))closeOv(id);}

// ===== DRAWER =====
function openDrawer(){document.getElementById('drawer').classList.add('open');document.getElementById('menu-btn').setAttribute('aria-expanded','true');}
function closeDrawer(){document.getElementById('drawer').classList.remove('open');document.getElementById('menu-btn').setAttribute('aria-expanded','false');}
function closeDrawerIf(e){if(e.target===document.getElementById('drawer'))closeDrawer();}

// ===== PAGE ROUTING =====
function showPage(name){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  const nb=document.getElementById('nav-'+name);if(nb)nb.classList.add('active');
  track('screen_view',name);
  if(name==='dashboard')updateDash();
  if(name==='gigs'){
    const sel = document.getElementById('gig-sort');
    if(sel && S.lastGigSort) sel.value = S.lastGigSort;
    else if(sel) sel.value = 'newest';
    renderGigs();
  }
  if(name==='settings')renderSettings();
  if(name==='invoice')initInvoice();
  if(name==='reports')renderRepList();
}

// ===== ONBOARDING =====
let obStep=1;
function goOb(n){
  document.querySelectorAll('.ob-step').forEach(s=>s.classList.remove('active'));
  document.getElementById('ob'+n).classList.add('active');
  obStep=n;
  document.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('active',i<n));
  if(n===1)renderObExpRows();
  if(n===3){renderObBuckets();updateObPctLeft();}
  if(n===4)renderObInvList();
  S.analytics.onboardingDropStep=n;save();
}
function obNext(){
  if(obStep===1) S.settings.baseline=S.expenses.reduce((t,e)=>t+e.amt,0);
  if(obStep===2){
    S.settings.taxRate=(parseFloat(document.getElementById('t-tax').value)||32)/100;
    S.settings.hstRate=(parseFloat(document.getElementById('t-hst').value)||13)/100;
    S.settings.duesRate=(parseFloat(document.getElementById('t-dues').value)||3)/100;
    const cur = document.getElementById('t-currency')?.value || '$';
    S.currency = cur==='other' ? (document.getElementById('t-currency-other')?.value.trim()||'$') : cur;
  }
  if(obStep<4) goOb(obStep+1);
}
// Show/hide the "other" currency text field
document.addEventListener('DOMContentLoaded', function(){
  const sel = document.getElementById('t-currency');
  if(sel) sel.addEventListener('change', function(){
    const f = document.getElementById('t-currency-other-field');
    if(f) f.style.display = this.value==='other' ? 'block' : 'none';
  });
});
function obPrev(){if(obStep>1)goOb(obStep-1);}

// Expense rows
function renderObExpRows(){
  const el=document.getElementById('ob-exp-rows');if(!el)return;
  el.innerHTML=S.expenses.map(e=>`
    <div class="exp-row">
      <input type="text" value="${e.name}" style="flex:1" onchange="updExpName(${e.id},this.value)" aria-label="Expense name">
      <input type="number" value="${e.amt||''}" placeholder="$" style="width:90px" onchange="updExpAmt(${e.id},this.value,'ob')" aria-label="Amount">
      <button class="exp-del" onclick="delExp(${e.id},'ob')" aria-label="Remove ${e.name}"><i class="ti ti-x" aria-hidden="true"></i></button>
    </div>`).join('');
  calcExpTotal('ob');
}
function updExpName(id,val){const e=S.expenses.find(x=>x.id===id);if(e)e.name=val;}
function updExpAmt(id,val,ctx){const e=S.expenses.find(x=>x.id===id);if(e){e.amt=parseFloat(val)||0;calcExpTotal(ctx);}}
function delExp(id,ctx){S.expenses=S.expenses.filter(x=>x.id!==id);if(ctx==='ob')renderObExpRows();else renderEditExpRows();}
function addObExp(){S.expenses.push({id:Date.now(),name:'',amt:0});renderObExpRows();}
function addEditExp(){S.expenses.push({id:Date.now(),name:'',amt:0});renderEditExpRows();}
function calcExpTotal(ctx){
  const t=S.expenses.reduce((s,e)=>s+e.amt,0);
  const el=document.getElementById(ctx==='ob'?'ob-total':'edit-exp-total');
  if(el)el.textContent=fmt(t);return t;
}

// Savings buckets
function usedPct(){return S.buckets.reduce((t,b)=>t+b.pct,0);}
function addObBucket(){
  const name=document.getElementById('ob-bn').value.trim();
  const pct=parseFloat(document.getElementById('ob-bp').value)||0;
  if(!name||pct<=0)return;
  if(usedPct()+pct>100){alert('Total would exceed 100%.');return;}
  S.buckets.push({id:Date.now(),name,pct});
  document.getElementById('ob-bn').value='';document.getElementById('ob-bp').value='';
  renderObBuckets();updateObPctLeft();
}
function removeBucket(id){S.buckets=S.buckets.filter(b=>b.id!==id);renderObBuckets();updateObPctLeft();renderEditBktList();}
function renderObBuckets(){
  const el=document.getElementById('ob-bkt-list');if(!el)return;
  el.innerHTML=S.buckets.map(b=>`<div class="bucket-item"><span class="bucket-name">${b.name}</span><span class="bucket-pct">${b.pct}%</span><button class="bucket-del" onclick="removeBucket(${b.id})" aria-label="Remove ${b.name}"><i class="ti ti-x" aria-hidden="true"></i></button></div>`).join('');
}
function updateObPctLeft(){
  const l=100-usedPct();
  const el=document.getElementById('ob-pct-left');
  if(el){el.innerHTML=`Remaining for investing: <strong>${l}%</strong>`;el.className='pct-note'+(l<0?' pct-warn':'');}
}

// Investment accounts
function addObInv(){
  const type=document.getElementById('ob-inv-type').value;
  const pct=parseFloat(document.getElementById('ob-inv-pct').value)||0;
  if(!type||pct<=0)return;
  S.invAccounts.push({id:Date.now(),type,pct});
  document.getElementById('ob-inv-type').value='';document.getElementById('ob-inv-pct').value='';
  renderObInvList();
}
function removeInv(id){S.invAccounts=S.invAccounts.filter(a=>a.id!==id);renderObInvList();renderEditBktList();}
function renderObInvList(){
  const el=document.getElementById('ob-inv-list');if(!el)return;
  el.innerHTML=S.invAccounts.map(a=>`<div class="bucket-item"><span class="bucket-name">${a.type}</span><span class="bucket-pct">${a.pct}%</span><button class="bucket-del" onclick="removeInv(${a.id})" aria-label="Remove ${a.type}"><i class="ti ti-x" aria-hidden="true"></i></button></div>`).join('');
}

function completeOb(){
  S.settings.enjoyPct=(parseFloat(document.getElementById('ob-enjoy')?.value)||20)/100;
  S.settings.baseline=S.expenses.reduce((t,e)=>t+e.amt,0);
  S.onboarded=true;
  S.analytics.onboardingDropStep=null;
  track('onboarding_complete');
  save();
  document.getElementById('fab').style.display='flex';
  showPage('dashboard');
  // Show readiness check for new users after onboarding
  if(!S.hasSeenReadinessCheck){
    setTimeout(()=>openOv('readiness-modal'), 1000);
  }
}

// ===== GIG CALCULATIONS =====
// ===== CORE CALCULATION ENGINE (matches spreadsheet blueprint) =====
// Column mapping from spreadsheet:
// K=workDues (scale fee only), L=salesTax (scale fee only)  
// M=incomeTax (scale+cartage+tips), O=HISA=K+L+M
// P=netLiquid=netDeposit-HISA, U=gatedSurplus
// AA=moveToHISA=O+savingsBuckets (gov money + year-end savings parked in HISA)
function calcGig(fee, cart, type, applyHst, applyDues){
  const s = S.settings;
  let workDues = 0, salesTax = 0, incomeTax = 0;
  // Work dues: scale fee ONLY (not cartage/tips per design note)
  if(applyDues && type === 'Freelance') workDues = fee * s.duesRate;
  // Sales tax: scale fee ONLY (cartage/tips exempt per design note)
  if(applyHst && type === 'Freelance') salesTax = fee * s.hstRate;
  // Income tax: scale + cartage + tips for Freelance and Other (not Employment)
  if(type !== 'Employment') incomeTax = (fee + cart) * s.taxRate;
  const hisa = incomeTax + salesTax;
  const netDeposit = (fee + cart) + salesTax - workDues;
  const netLiquid = netDeposit - hisa;
  return { workDues, salesTax, incomeTax, hisa, netDeposit, netLiquid };
}

function getMonthNetLiquid(forDate, excludeId){
  const d = new Date(forDate + 'T12:00:00');
  return S.gigs.filter(g => {
    if(g.status !== 'Received') return false;
    if(excludeId && g.id === excludeId) return false;
    const gd = new Date(g.date + 'T12:00:00');
    return gd.getMonth()===d.getMonth() && gd.getFullYear()===d.getFullYear();
  }).reduce((t,g) => t + g.netLiquid, 0);
}

function calcSurplus(fee, cart, type, applyHst, applyDues, date, excludeId, selfLoanBorrowReq, selfLoanRepayReq, ccPayReq, loanPayReq){
  const c = calcGig(fee, cart, type, applyHst, applyDues);
  const monthNetSoFar = getMonthNetLiquid(date, excludeId);
  const baselineGap = Math.max(0, S.settings.baseline - monthNetSoFar);
  const gigSurplus = Math.max(0, c.netLiquid - baselineGap);
  // Self-loan borrow is capped at the gig surplus available — can't borrow more than what's actually free
  const selfLoanBorrow = Math.min(Math.max(0, selfLoanBorrowReq||0), gigSurplus);
  const selfLoanCapped = (selfLoanBorrowReq||0) > gigSurplus;
  const surplusAfterBorrow = gigSurplus - selfLoanBorrow;
  // Paying yourself back also comes out of this gig's surplus — same pocket as borrow, just a different destination
  const selfLoanRepay = Math.min(Math.max(0, selfLoanRepayReq||0), surplusAfterBorrow);
  const selfLoanRepayCapped = (selfLoanRepayReq||0) > surplusAfterBorrow;
  const surplusAfterSelfLoan = surplusAfterBorrow - selfLoanRepay;
  // Debt payments (credit card / other) also come out of this gig's surplus, same pocket
  const ccPay = Math.min(Math.max(0, ccPayReq||0), surplusAfterSelfLoan);
  const ccPayCapped = (ccPayReq||0) > surplusAfterSelfLoan;
  const surplusAfterCc = surplusAfterSelfLoan - ccPay;
  const loanPay = Math.min(Math.max(0, loanPayReq||0), surplusAfterCc);
  const loanPayCapped = (loanPayReq||0) > surplusAfterCc;
  const surplusAfterLoan = surplusAfterCc - loanPay;
  const enjoy = surplusAfterLoan * S.settings.enjoyPct;
  const bktAmts = S.buckets.map(b => ({name:b.name, pct:b.pct, amt: surplusAfterLoan * b.pct/100}));
  const totalBkts = bktAmts.reduce((t,b) => t + b.amt, 0);
  const invest = Math.max(0, surplusAfterLoan - enjoy - totalBkts);
  // HISA transfer = gov money + savings buckets (parked in HISA per user preference)
  const moveToHisa = c.hisa + totalBkts;
  return {
    ...c, gigSurplus, baselineGap,
    baselineCovered: monthNetSoFar >= S.settings.baseline,
    selfLoanBorrow, selfLoanCapped, selfLoanRepay, selfLoanRepayCapped,
    ccPay, ccPayCapped, loanPay, loanPayCapped,
    enjoy, buckets: bktAmts, invest, moveToHisa
  };
}

function updateGigTypeDefaults(){
  const type = document.getElementById('g-type').value;
  if(type === 'Employment'){
    document.getElementById('g-hst').checked = false;
    document.getElementById('g-dues').checked = false;
  } else {
    document.getElementById('g-dues').checked = true;
  }
  calcGigModal();
}

function reverseCalcFee(){
  const checkAmt = parseFloat(document.getElementById('g-check-amt')?.value)||0;
  const cart = parseFloat(document.getElementById('g-cart')?.value)||0;
  const applyHst = document.getElementById('g-hst')?.checked||false;
  const applyDues = document.getElementById('g-dues')?.checked!==false;
  const type = document.getElementById('g-type')?.value||'Freelance';
  const resultEl = document.getElementById('g-check-result');
  if(!checkAmt){ if(resultEl) resultEl.textContent='—'; return; }
  // Check = scale + cartage + HST(on scale) - dues(on scale)
  // Check - cartage = scale * (1 + hstRate - duesRate) for Freelance
  // Solve: scale = (check - cartage) / (1 + hstRate - duesRate)
  const s = S.settings;
  const hstMult = (applyHst && type==='Freelance') ? s.hstRate : 0;
  const duesMult = (applyDues && type==='Freelance') ? s.duesRate : 0;
  const divisor = 1 + hstMult - duesMult;
  const scaleFee = divisor > 0 ? (checkAmt - cart) / divisor : checkAmt - cart;
  if(resultEl) resultEl.textContent = scaleFee > 0 ? fmt2(scaleFee) : '—';
  // Auto-fill scale fee field
  const feeEl = document.getElementById('g-fee');
  if(feeEl && scaleFee > 0){
    feeEl.value = scaleFee.toFixed(2);
    document.getElementById('f-fee')?.classList.remove('error');
    calcGigModal();
  }
}
function checkHistoricalToggle(){
  const dateEl = document.getElementById('g-date');
  const row = document.getElementById('historical-toggle-row');
  if(!dateEl || !row) return;
  const d = new Date(dateEl.value + 'T12:00:00');
  const today = new Date();
  today.setHours(0,0,0,0);
  const isPast = d < today;
  row.style.display = isPast ? 'block' : 'none';
  if(!isPast){
    document.getElementById('g-historical').checked = false;
    toggleHistoricalMode();
  }
}
function toggleHistoricalMode(){
  const on = document.getElementById('g-historical')?.checked;
  const hFields = document.getElementById('historical-fields');
  const mainFields = document.getElementById('main-gig-fields');
  const splitArea = document.getElementById('gig-split-area');
  if(hFields) hFields.style.display = on ? 'block' : 'none';
  if(mainFields) mainFields.style.display = on ? 'none' : 'block';
  if(splitArea && on) splitArea.style.display = 'none';
}
function calcHistoricalHisa(){
  const tax = parseFloat(document.getElementById('h-tax')?.value)||0;
  const hst = parseFloat(document.getElementById('h-hst')?.value)||0;
  const dues = parseFloat(document.getElementById('h-dues')?.value)||0;
  const total = tax + hst + dues;
  const preview = document.getElementById('h-hisa-preview');
  const amt = document.getElementById('h-hisa-amt');
  if(preview) preview.style.display = total > 0 ? 'block' : 'none';
  if(amt) amt.textContent = fmt2(total);
}
function calcGigModal(){
  const fee = parseFloat(document.getElementById('g-fee').value)||0;
  const cart = parseFloat(document.getElementById('g-cart').value)||0;
  if(!fee && !cart){ document.getElementById('gig-split-area').style.display='none'; return; }
  const type = document.getElementById('g-type').value;
  const applyHst = document.getElementById('g-hst')?.checked || false;
  const applyDues = document.getElementById('g-dues')?.checked !== false;
  const date = document.getElementById('g-date').value || new Date().toISOString().split('T')[0];
  const selfLoanBorrowReq = parseFloat(document.getElementById('g-selfloan-borrow')?.value)||0;
  const selfLoanRepayReq = parseFloat(document.getElementById('g-selfloan-repay')?.value)||0;
  const ccPayReq = parseFloat(document.getElementById('g-cc-pay')?.value)||0;
  const loanPayReq = parseFloat(document.getElementById('g-loan-pay')?.value)||0;
  const r = calcSurplus(fee, cart, type, applyHst, applyDues, date, null, selfLoanBorrowReq, selfLoanRepayReq, ccPayReq, loanPayReq);
  const dot = (c) => '<span style="width:7px;height:7px;border-radius:2px;background:'+c+';display:inline-block;margin-right:4px" aria-hidden="true"></span>';
  let surplusNote = '';
  if(r.baselineCovered) surplusNote = '<div style="font-size:11px;color:var(--green);padding:3px 0 5px">Baseline already covered this month</div>';
  else if(r.gigSurplus===0) surplusNote = '<div style="font-size:11px;color:var(--amber);padding:3px 0 5px">This gig goes toward your baseline ('+fmt(r.baselineGap)+' still needed)</div>';
  else surplusNote = '<div style="font-size:11px;color:var(--sage);padding:3px 0 5px">Surplus from this gig: '+fmt(r.gigSurplus)+'</div>';
  const selfLoanWarn = r.selfLoanCapped ? '<div style="font-size:11px;color:var(--red);padding:3px 0 5px">Borrow capped at available surplus ('+fmt(r.gigSurplus)+') — can\'t borrow more than this gig generated</div>' : '';
  const selfLoanRepayWarn = r.selfLoanRepayCapped ? '<div style="font-size:11px;color:var(--red);padding:3px 0 5px">Repayment capped at remaining surplus — not enough left in this gig to pay back that much</div>' : '';
  const ccPayWarn = r.ccPayCapped ? '<div style="font-size:11px;color:var(--red);padding:3px 0 5px">Credit card payment capped — not enough surplus left in this gig</div>' : '';
  const loanPayWarn = r.loanPayCapped ? '<div style="font-size:11px;color:var(--red);padding:3px 0 5px">Other debt payment capped — not enough surplus left in this gig</div>' : '';
  const selfLoanRow = r.selfLoanBorrow>0 ? '<div class="split-row-item"><span class="sl">'+dot('var(--gold-d)')+'Self-loan borrowed</span><span class="sv">-'+fmt2(r.selfLoanBorrow)+'</span></div>' : '';
  const selfLoanRepayRow = r.selfLoanRepay>0 ? '<div class="split-row-item"><span class="sl">'+dot('var(--gold-d)')+'Paying yourself back</span><span class="sv">-'+fmt2(r.selfLoanRepay)+'</span></div>' : '';
  const ccPayRow = r.ccPay>0 ? '<div class="split-row-item"><span class="sl">'+dot('var(--red)')+'Credit card payment</span><span class="sv">-'+fmt2(r.ccPay)+'</span></div>' : '';
  const loanPayRow = r.loanPay>0 ? '<div class="split-row-item"><span class="sl">'+dot('var(--gold)')+'Other debt payment</span><span class="sv">-'+fmt2(r.loanPay)+'</span></div>' : '';
  const bktRows = r.buckets.filter(b=>b.name.toLowerCase()!=='invest').map(b => '<div class="split-row-item"><span class="sl">'+dot('var(--gold)')+b.name+'</span><span class="sv">'+fmt2(b.amt)+'</span></div>').join('');
  document.getElementById('gig-split-rows').innerHTML =
    '<div class="split-row-item"><span class="sl">Income tax set-aside</span><span class="sv">'+fmt2(r.incomeTax)+'</span></div>'+
    (r.salesTax>0?'<div class="split-row-item"><span class="sl">Sales tax collected</span><span class="sv">'+fmt2(r.salesTax)+'</span></div>':'')+
    (r.workDues>0?'<div class="split-row-item"><span class="sl">Work dues</span><span class="sv">'+fmt2(r.workDues)+'</span></div>':'')+
    '<div class="split-row-item" style="border-top:1px solid rgba(74,102,91,.15);margin-top:4px;padding-top:6px"><span class="sl" style="font-weight:600;color:var(--sage-d)">Net liquid</span><span class="sv" style="color:var(--sage)">'+fmt2(r.netLiquid)+'</span></div>'+
    surplusNote+selfLoanWarn+selfLoanRepayWarn+ccPayWarn+loanPayWarn+selfLoanRow+selfLoanRepayRow+ccPayRow+loanPayRow+
    (r.gigSurplus>0?
      '<div class="split-row-item"><span class="sl">'+dot('var(--gold-d)')+'Enjoy next month</span><span class="sv">'+fmt2(r.enjoy)+'</span></div>'+
      bktRows+
      '<div class="split-row-item" style="font-weight:600"><span class="sl">'+dot('var(--sage)')+'Invest (remainder)</span><span class="sv">'+fmt2(r.invest)+'</span></div>'
    :'');
  document.getElementById('gig-hisa-amt').textContent = fmt2(r.moveToHisa);
  const tip = document.getElementById('gig-hisa-tip');
  if(tip) tip.style.display = S.learnMode ? 'block' : 'none';
  document.getElementById('gig-split-area').style.display = 'block';
}

function saveGig(){
  const name = document.getElementById('g-name').value.trim();
  const date = document.getElementById('g-date').value;
  const isHistorical = document.getElementById('g-historical')?.checked || false;
  const fee = isHistorical ? 0 : (parseFloat(document.getElementById('g-fee').value)||0);
  const payer = document.getElementById('g-payer').value.trim();
  // Clear previous errors
  ['f-date','f-name','f-payer','f-fee'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.classList.remove('error');
  });
  let hasError = false;
  if(!date){ const el=document.getElementById('f-date'); if(el) el.classList.add('error'); hasError=true; }
  if(!name){ const el=document.getElementById('f-name'); if(el) el.classList.add('error'); hasError=true; }
  if(!payer){ const el=document.getElementById('f-payer'); if(el) el.classList.add('error'); hasError=true; }
  if(!isHistorical && !fee){ const el=document.getElementById('f-fee'); if(el) el.classList.add('error'); hasError=true; }
  if(hasError){
    const sheet = document.querySelector('#gig-modal .sheet');
    if(sheet) sheet.scrollTop = 0;
    return;
  }
  // Historical entry — use manual fields directly, bypass calculation
  if(isHistorical){
    const editId = window.editingGigId || null;
    const notes = document.getElementById('g-notes')?.value.trim()||'';
    const status = document.getElementById('g-status').value;
    const hFee = parseFloat(document.getElementById('h-fee')?.value)||0;
    const hCart = parseFloat(document.getElementById('h-cart')?.value)||0;
    const hTax = parseFloat(document.getElementById('h-tax')?.value)||0;
    const hHst = parseFloat(document.getElementById('h-hst')?.value)||0;
    const hDues = parseFloat(document.getElementById('h-dues')?.value)||0;
    const hNet = parseFloat(document.getElementById('h-net')?.value)||0;
    const hEnjoy = parseFloat(document.getElementById('h-enjoy')?.value)||0;
    const hInvest = parseFloat(document.getElementById('h-invest')?.value)||0;
    const hCc = parseFloat(document.getElementById('h-cc')?.value)||0;
    const hLoan = parseFloat(document.getElementById('h-loan')?.value)||0;
    const hSlBorrow = parseFloat(document.getElementById('h-sl-borrow')?.value)||0;
    const hSlRepay = parseFloat(document.getElementById('h-sl-repay')?.value)||0;
    const hType = document.getElementById('h-type')?.value||'Freelance';
    const hNotes = document.getElementById('h-notes')?.value.trim()||'';
    const hisa = hTax + hHst + hDues;
    const gig = {
      id: editId || Date.now(), entryOrder: editId ? (S.gigs.find(g=>g.id===editId)?.entryOrder||Date.now()) : Date.now(),
      date, name, payer, notes:hNotes||notes, status, type:hType,
      fee:hFee, cart:hCart, applyHst:false, applyDues:false,
      isHistorical:true,
      incomeTax:hTax, salesTax:hHst, workDues:hDues,
      hisa, netLiquid:hNet, gigSurplus:Math.max(0,hNet),
      enjoy:hEnjoy, buckets:[], invest:hInvest, moveToHisa:hisa,
      ccPay:hCc, loanPay:hLoan, selfLoanBorrow:hSlBorrow, selfLoanRepay:hSlRepay, flag:''
    };
    if(editId){ S.gigs = S.gigs.map(g=>g.id===editId?gig:g); }
    else { S.gigs.push(gig); }
    if(hCc>0) S.debt.cc = Math.max(0,(S.debt.cc||0)-hCc);
    if(hLoan>0) S.debt.loan = Math.max(0,(S.debt.loan||0)-hLoan);
    if(hSlBorrow>0) S.selfLoan = (S.selfLoan||0)+hSlBorrow;
    if(hSlRepay>0) S.selfLoan = Math.max(0,(S.selfLoan||0)-hSlRepay);
    S.funFund.next = (S.funFund.next||0)+hEnjoy;
    track(editId?'gig_edited':'gig_logged_historical');
    save();
    closeOv('gig-modal');
    window.editingGigId = null;
    document.getElementById('hm-amt').textContent = fmt2(hisa);
    document.getElementById('hm-sub').textContent = '"'+name+'" logged as historical entry.';
    const saName2 = getSetAsideName();
    const hdrEl2 = document.getElementById('hm-acct-header');
    const tfrEl2 = document.getElementById('hm-transfer-header');
    if(hdrEl2) hdrEl2.textContent = 'Move to '+saName2+' now';
    if(tfrEl2) tfrEl2.textContent = 'Transfer to '+saName2;
    const bd = document.getElementById('hm-breakdown');
    if(bd) bd.innerHTML = hisa>0 ?
      '<div style="font-size:13px;color:var(--muted);padding:4px 0">Tax + dues: '+fmt2(hisa)+' — stays in HISA until needed</div>' : '';
    openOv('hisa-modal');
    updateDash(); renderGigs();
    return;
  }
  if(!fee){ const el=document.getElementById('f-fee'); if(el) el.classList.add('error'); hasError=true; }
  if(hasError){ 
    // Scroll to top of sheet so errors are visible
    const sheet = document.querySelector('#gig-modal .sheet');
    if(sheet) sheet.scrollTop = 0;
    return; 
  }
  const cart = parseFloat(document.getElementById('g-cart').value)||0;
  const type = document.getElementById('g-type').value;
  const status = document.getElementById('g-status').value;
  const notes = document.getElementById('g-notes')?.value.trim()||'';
  const applyHst = document.getElementById('g-hst')?.checked||false;
  const applyDues = document.getElementById('g-dues')?.checked!==false;
  S.lastHstToggle = applyHst;
  S.lastDuesToggle = applyDues;
  const ccPayReq = parseFloat(document.getElementById('g-cc-pay')?.value)||0;
  const loanPayReq = parseFloat(document.getElementById('g-loan-pay')?.value)||0;
  const selfLoanBorrowReq = parseFloat(document.getElementById('g-selfloan-borrow')?.value)||0;
  const selfLoanRepayReq = parseFloat(document.getElementById('g-selfloan-repay')?.value)||0;
  const editId = window.editingGigId || null;
  const r = calcSurplus(fee, cart, type, applyHst, applyDues, date, editId, selfLoanBorrowReq, selfLoanRepayReq, ccPayReq, loanPayReq);
  const gig = {
    id: editId || Date.now(), entryOrder: editId ? (S.gigs.find(g=>g.id===editId)?.entryOrder || Date.now()) : Date.now(),
    date, name, payer, notes, type, status,
    fee, cart, applyHst, applyDues,
    workDues:r.workDues, salesTax:r.salesTax, incomeTax:r.incomeTax,
    hisa:r.hisa, netLiquid:r.netLiquid, gigSurplus:r.gigSurplus,
    enjoy:r.enjoy, buckets:r.buckets, invest:r.invest, moveToHisa:r.moveToHisa,
    ccPay:r.ccPay, loanPay:r.loanPay, selfLoanBorrow:r.selfLoanBorrow, selfLoanRepay:r.selfLoanRepay,
    flag: (!r.baselineCovered && (r.ccPay>0||r.loanPay>0)) ? 'Payment made before baseline covered this month' : ''
  };
  if(editId){
    // Editing: reverse the old gig's effect on debt/self-loan before applying new values
    const old = S.gigs.find(g=>g.id===editId);
    if(old){
      if(old.ccPay>0) S.debt.cc = (S.debt.cc||0)+old.ccPay;
      if(old.loanPay>0) S.debt.loan = (S.debt.loan||0)+old.loanPay;
      if(old.selfLoanBorrow>0) S.selfLoan = Math.max(0,(S.selfLoan||0)-old.selfLoanBorrow);
      if(old.selfLoanRepay>0) S.selfLoan = (S.selfLoan||0)+old.selfLoanRepay;
    }
    S.gigs = S.gigs.map(g=>g.id===editId?gig:g);
  } else {
    S.gigs.push(gig);
  }
  if(r.ccPay>0) S.debt.cc = Math.max(0,(S.debt.cc||0)-r.ccPay);
  if(r.loanPay>0) S.debt.loan = Math.max(0,(S.debt.loan||0)-r.loanPay);
  if(r.selfLoanBorrow>0) S.selfLoan = (S.selfLoan||0)+r.selfLoanBorrow;
  if(r.selfLoanRepay>0) S.selfLoan = Math.max(0,(S.selfLoan||0)-r.selfLoanRepay);
  S.funFund.next = (S.funFund.next||0) + r.enjoy;
  track(editId?'gig_edited':'gig_logged',{type,status});
  save();
  closeOv('gig-modal');
  window.editingGigId = null;
  document.getElementById('hm-amt').textContent = fmt2(r.moveToHisa);
  document.getElementById('hm-sub').textContent = '"'+name+'" is logged.';
  const saName = getSetAsideName();
  const hdrEl = document.getElementById('hm-acct-header');
  const tfrEl = document.getElementById('hm-transfer-header');
  if(hdrEl) hdrEl.textContent = 'Move to '+saName+' now';
  if(tfrEl) tfrEl.textContent = 'Transfer to '+saName;
  const hmtip = document.getElementById('hm-tip');
  if(hmtip) hmtip.style.display = S.learnMode ? 'block' : 'none';
  // HISA breakdown: stays vs moves back on 1st
  const govMoney = r.incomeTax + r.salesTax;
  const savingsBkts = r.buckets.reduce((t,b)=>t+b.amt, 0);
  const breakdownEl = document.getElementById('hm-breakdown');
  if(breakdownEl){
    const row = (label, val, sub) =>
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;padding:4px 0;border-bottom:1px solid rgba(74,102,91,.1);font-size:13px">'+
      '<span style="color:var(--muted);flex:1">'+label+(sub?'<br><span style="font-size:10px;color:var(--sage)">'+sub+'</span>':'')+'</span>'+
      '<span style="font-weight:600;color:var(--sage-d);margin-left:8px">'+fmt2(val)+'</span></div>';
    breakdownEl.innerHTML =
      (govMoney>0 ? row('Tax set-aside',''+govMoney,'stays in HISA until tax time') : '')+
      (savingsBkts>0 ? row('Savings goals',''+savingsBkts,'stays until you need it') : '')+
      (r.enjoy>0 ? row('Enjoy-life allocation',''+r.enjoy,'move back to savings on the 1st') : '');
  }
  openOv('hisa-modal');
  updateDash(); renderGigs();
}

function editGig(id){
  const g = S.gigs.find(x=>x.id===id); if(!g) return;
  window.editingGigId = id;
  document.getElementById('g-date').value = g.date;
  document.getElementById('g-status').value = g.status;
  document.getElementById('g-name').value = g.name;
  document.getElementById('g-payer').value = g.payer||'';
  document.getElementById('g-type').value = g.type||'Freelance';
  document.getElementById('g-fee').value = g.fee||'';
  document.getElementById('g-cart').value = g.cart||'';
  document.getElementById('g-hst').checked = !!g.applyHst;
  document.getElementById('g-dues').checked = g.applyDues!==false;
  document.getElementById('g-cc-pay').value = g.ccPay||'';
  document.getElementById('g-loan-pay').value = g.loanPay||'';
  document.getElementById('g-selfloan-borrow').value = g.selfLoanBorrow||'';
  document.getElementById('g-selfloan-repay').value = g.selfLoanRepay||'';
  document.getElementById('g-notes').value = g.notes||'';
  ['f-date','f-name','f-payer','f-fee'].forEach(fid=>{const el=document.getElementById(fid);if(el)el.classList.remove('error');});
  const histToggle = document.getElementById('g-historical');
  if(g.isHistorical){
    if(histToggle) histToggle.checked = true;
    document.getElementById('historical-toggle-row').style.display='block';
    toggleHistoricalMode();
    const setH = (hid, val) => { const el=document.getElementById(hid); if(el) el.value=val||''; };
    setH('h-fee', g.fee); setH('h-cart', g.cart);
    setH('h-tax', g.incomeTax); setH('h-hst', g.salesTax); setH('h-dues', g.workDues);
    setH('h-net', g.netLiquid); setH('h-enjoy', g.enjoy); setH('h-invest', g.invest);
    setH('h-cc', g.ccPay); setH('h-loan', g.loanPay);
    setH('h-sl-borrow', g.selfLoanBorrow); setH('h-sl-repay', g.selfLoanRepay);
    setH('h-notes', g.notes);
    const hTypeEl = document.getElementById('h-type');
    if(hTypeEl) hTypeEl.value = g.type||'Freelance';
    calcHistoricalHisa();
  } else {
    if(histToggle) histToggle.checked = false;
    document.getElementById('historical-toggle-row').style.display='none';
    document.getElementById('historical-fields').style.display='none';
    document.getElementById('main-gig-fields').style.display='block';
    calcGigModal();
  }
  document.querySelector('#gig-modal .m-title').textContent = 'Edit gig';
  document.querySelector('#gig-modal .btn-p').textContent = 'Save changes';
  openOv('gig-modal');
}

function deleteGig(id){
  const g = S.gigs.find(x=>x.id===id); if(!g) return;
  const confirmed = confirm('"'+g.name+'" on '+fmtD(g.date)+' — permanently remove this entry?');
  if(!confirmed) return;
  // Reverse any effects on debt and self-loan balances
  if(g.ccPay>0) S.debt.cc = (S.debt.cc||0)+g.ccPay;
  if(g.loanPay>0) S.debt.loan = (S.debt.loan||0)+g.loanPay;
  if(g.selfLoanBorrow>0) S.selfLoan = Math.max(0,(S.selfLoan||0)-g.selfLoanBorrow);
  if(g.selfLoanRepay>0) S.selfLoan = (S.selfLoan||0)+g.selfLoanRepay;
  // Reverse enjoy-life from fun fund (from next month's amount)
  if(g.enjoy>0) S.funFund.next = Math.max(0,(S.funFund.next||0)-g.enjoy);
  S.gigs = S.gigs.filter(x=>x.id!==id);
  save();
  track('gig_deleted');
  showPage('gigs');
  updateDash();
}

function updateDash(){
  const s=S.settings; const now=new Date(); const m=now.getMonth(); const y=now.getFullYear();
  const rec=S.gigs.filter(g=>g.status==='Received');
  const mG=rec.filter(g=>{const d=new Date(g.date+'T12:00:00');return d.getMonth()===m&&d.getFullYear()===y;});
  const mInc=mG.reduce((t,g)=>t+g.netLiquid,0);
  const st=document.getElementById('d-status');
  if(mInc>=s.baseline&&s.baseline>0){st.className='pill pill-green';st.innerHTML='<i class="ti ti-circle-check" aria-hidden="true"></i> Baseline covered';}
  else if(mInc>0){st.className='pill pill-amber';st.innerHTML='<i class="ti ti-alert-circle" aria-hidden="true"></i> '+fmt(s.baseline-mInc)+' to go';}
  else{st.className='pill pill-red';st.innerHTML='<i class="ti ti-alert-circle" aria-hidden="true"></i> No income this month yet';}
  document.getElementById('d-income').textContent=fmt(mInc);
  document.getElementById('d-baseline').textContent=fmt(s.baseline);
  document.getElementById('fun-amt').textContent=fmt(S.funFund.current||0);
  const ytd=rec.filter(g=>new Date(g.date+'T12:00:00').getFullYear()===y);
  document.getElementById('d-ytd').textContent=fmt(ytd.reduce((t,g)=>t+g.netLiquid,0));
  document.getElementById('d-hisa').textContent=fmt(ytd.reduce((t,g)=>t+(g.moveToHisa||0),0));
  // Runway from account balances
  const totalLiquid=(S.balances?.checking||0)+(S.balances?.savings||0);
  const runway=s.baseline>0?totalLiquid/s.baseline:0;
  document.getElementById('d-runway').textContent=runway>0?runway.toFixed(1):'—';
  const pct=Math.min(100,(runway/6)*100);
  document.getElementById('rwfill').style.width=pct+'%';
  document.getElementById('rwfill').style.background=runway<1?'var(--red)':runway<3?'var(--amber)':'var(--sage)';
  // Building future %
  const ago=new Date(now-90*864e5);
  const r90=rec.filter(g=>new Date(g.date+'T12:00:00')>=ago);
  const n90=r90.reduce((t,g)=>t+g.netLiquid,0);
  const b90=r90.reduce((t,g)=>t+(g.invest||0)+g.buckets.reduce((s2,b)=>s2+b.amt,0),0);
  document.getElementById('d-bld').textContent=n90>0?Math.round(b90/n90*100)+'%':'0%';
  // Debt section
  const totalDebt=(S.debt?.cc||0)+(S.debt?.loan||0);
  const debtEl=document.getElementById('d-debt-section');
  if(debtEl){
    if(totalDebt>0){
      const ytdDebt=ytd.reduce((t,g)=>t+(g.ccPay||0)+(g.loanPay||0),0);
      debtEl.innerHTML='<div style="margin:0 14px 10px;background:var(--gold-l);border-radius:var(--rs);padding:12px 13px">'+
        '<div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--red);margin-bottom:6px">Debt</div>'+
        '<div style="display:flex;justify-content:space-between;font-size:14px;padding:3px 0"><span style="color:var(--muted)">Total owing</span><span style="font-weight:600;color:var(--red)">'+fmt(totalDebt)+'</span></div>'+
        '<div style="display:flex;justify-content:space-between;font-size:14px;padding:3px 0"><span style="color:var(--muted)">Paid down this year</span><span style="font-weight:500">'+fmt(ytdDebt)+'</span></div>'+
        '</div>';
    } else { debtEl.innerHTML=''; }
  }
  // Self-loan section (separate from debt — owed to yourself)
  const selfLoanEl=document.getElementById('d-selfloan-section');
  if(selfLoanEl){
    if((S.selfLoan||0)>0){
      const ytdRepaid=ytd.reduce((t,g)=>t+(g.selfLoanRepay||0),0);
      selfLoanEl.innerHTML='<div style="margin:0 14px 10px;background:var(--gold-l);border-radius:var(--rs);padding:12px 13px">'+
        '<div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--gold-d);margin-bottom:6px">Self-loan</div>'+
        '<div style="display:flex;justify-content:space-between;font-size:14px;padding:3px 0"><span style="color:var(--muted)">Currently owed to yourself</span><span style="font-weight:600;color:var(--gold-d)">'+fmt(S.selfLoan)+'</span></div>'+
        '<div style="display:flex;justify-content:space-between;font-size:14px;padding:3px 0"><span style="color:var(--muted)">Repaid this year</span><span style="font-weight:500">'+fmt(ytdRepaid)+'</span></div>'+
        '</div>';
    } else { selfLoanEl.innerHTML=''; }
  }
  // Momentum chart
  const months=['J','F','M','A','M','J','J','A','S','O','N','D'];
  const mData=months.map((_,i)=>{
    const mg=rec.filter(g=>{const d=new Date(g.date+'T12:00:00');return d.getMonth()===i&&d.getFullYear()===y;});
    return{l:months[i],b:mg.reduce((t,g)=>t+(g.invest||0)+g.buckets.reduce((s2,b)=>s2+b.amt,0),0),d:mg.reduce((t,g)=>t+(g.ccPay||0)+(g.loanPay||0),0)};
  });
  const maxV=Math.max(...mData.map(d=>d.b+d.d),1);
  document.getElementById('mbars').innerHTML=mData.map(d=>{
    const bH=Math.round(d.b/maxV*62);const dH=Math.round(d.d/maxV*62);
    return'<div class="bar-g"><div class="bar-s">'+(d.d>0?'<div class="bar-seg" style="height:'+dH+'px;background:var(--gold)"></div>':'')+
      '<div class="bar-seg" style="height:'+Math.max(bH,3)+'px;background:'+(bH>2?'var(--sage)':'#e5e7eb')+'"></div></div><div class="bar-lbl">'+d.l+'</div></div>';
  }).join('');
  const recent=S.gigs.slice().sort((a,b)=>new Date(b.date)-new Date(a.date) || (b.entryOrder||0)-(a.entryOrder||0)).slice(0,4);
  document.getElementById('d-recent').innerHTML=recent.length?recent.map(gigRow).join(''):'<div class="empty"><i class="ti ti-music" aria-hidden="true"></i><p>No gigs yet. Tap + to log your first one.</p></div>';
}

function gigRow(g){
  const ico={Freelance:'ti-music',Employment:'ti-building',Instruction:'ti-school',Other:'ti-receipt'}[g.type]||'ti-music';
  const bc=g.status==='Received'?'b-g':'b-a';
  const histBadge=g.isHistorical?'<span class="badge" style="background:var(--gold-l);color:var(--gold-d);margin-left:3px">H</span>':'';
  const amt=g.isHistorical?(g.netLiquid||0).toFixed(0):(g.fee||0).toFixed(0);
  return'<div class="gig-row" onclick="showDetail('+g.id+')" role="button" tabindex="0" aria-label="'+g.name+', '+fmtD(g.date)+'" onkeydown="if(event.keyCode===13||event.key==="Enter")showDetail('+g.id+')">'+
    '<div class="gig-ico" aria-hidden="true"><i class="ti '+ico+'"></i></div>'+
    '<div class="gig-info"><div class="gig-name">'+g.name+'</div><div class="gig-meta">'+fmtD(g.date)+(g.payer?' · '+g.payer:'')+'</div></div>'+
    '<div class="gig-right"><div class="gig-amt">'+currSym()+amt+'</div><span class="badge '+bc+'">'+g.status+'</span>'+histBadge+'</div></div>';
}

function showDetail(id){
  const g=S.gigs.find(x=>x.id===id); if(!g) return;
  const bc=g.status==='Received'?'b-g':'b-a';
  const dot=(c)=>'<span style="width:7px;height:7px;border-radius:2px;background:'+c+';display:inline-block;margin-right:4px"></span>';
  let html='<div class="det-sec">';
  html+='<div class="det-row"><span>Date</span><span>'+fmtD(g.date)+'</span></div>';
  html+='<div class="det-row"><span>Status</span><span><span class="badge '+bc+'">'+g.status+'</span></span></div>';
  html+='<div class="det-row"><span>Payer</span><span>'+(g.payer||'—')+'</span></div>';
  html+='<div class="det-row"><span>Type</span><span>'+g.type+'</span></div>';
  html+='<div class="det-row"><span>Scale fee</span><span>'+fmt2(g.fee)+'</span></div>';
  if(g.cart>0) html+='<div class="det-row"><span>Cartage / tips</span><span>'+fmt2(g.cart)+'</span></div>';
  if(g.notes) html+='<div class="det-row"><span>Notes</span><span>'+g.notes+'</span></div>';
  html+='</div>';
  if(g.flag) html+='<div style="background:var(--amber-l);border-left:3px solid var(--amber);border-radius:var(--rs);padding:10px 12px;font-size:12px;color:var(--amber);margin:8px 16px">'+g.flag+'</div>';
  html+='<div class="det-hisa"><span>Transfer to HISA</span><span>'+fmt2(g.moveToHisa||0)+'</span></div>';
  html+='<div class="det-sec">';
  html+='<div class="det-row"><span>Income tax set-aside</span><span>'+fmt2(g.incomeTax||0)+'</span></div>';
  if((g.salesTax||0)>0) html+='<div class="det-row"><span>Sales tax collected</span><span>'+fmt2(g.salesTax)+'</span></div>';
  if((g.workDues||0)>0) html+='<div class="det-row"><span>Work dues</span><span>'+fmt2(g.workDues)+'</span></div>';
  html+='<div class="det-row" style="font-weight:600;color:var(--sage-d)"><span>Net liquid</span><span>'+fmt2(g.netLiquid||0)+'</span></div>';
  html+='</div>';
  if((g.gigSurplus||0)>0){
    html+='<div class="det-sec">';
    html+='<div class="det-row"><span style="color:var(--muted)">Surplus this gig</span><span style="color:var(--sage)">'+fmt2(g.gigSurplus)+'</span></div>';
    html+='<div class="det-row"><span>'+dot('var(--gold-d)')+'Enjoy next month</span><span>'+fmt2(g.enjoy||0)+'</span></div>';
    if(g.buckets) html+=g.buckets.filter(b=>b.name.toLowerCase()!=='invest').map(b=>'<div class="det-row"><span>'+dot('var(--gold)')+b.name+'</span><span>'+fmt2(b.amt)+'</span></div>').join('');
    html+='<div class="det-row" style="font-weight:600"><span>'+dot('var(--sage)')+'Invest</span><span>'+fmt2(g.invest||0)+'</span></div>';
    html+='</div>';
  }
  if((g.ccPay||0)>0||(g.loanPay||0)>0){
    html+='<div class="det-sec">';
    if(g.ccPay>0) html+='<div class="det-row" style="color:var(--red)"><span>Credit card payment</span><span>'+fmt2(g.ccPay)+'</span></div>';
    if(g.loanPay>0) html+='<div class="det-row" style="color:var(--gold-d)"><span>Other debt payment</span><span>'+fmt2(g.loanPay)+'</span></div>';
    html+='</div>';
  }
  if((g.selfLoanBorrow||0)>0||(g.selfLoanRepay||0)>0){
    html+='<div class="det-sec">';
    if(g.selfLoanBorrow>0) html+='<div class="det-row" style="color:var(--gold-d)"><span>Self-loan borrowed</span><span>'+fmt2(g.selfLoanBorrow)+'</span></div>';
    if(g.selfLoanRepay>0) html+='<div class="det-row" style="color:var(--gold-d)"><span>Self-loan repaid</span><span>'+fmt2(g.selfLoanRepay)+'</span></div>';
    html+='</div>';
  }
  html+='<div style="padding:12px 16px 4px"><button class="btn-outline" onclick="editGig('+g.id+')">Edit this entry</button></div>';
  html+='<div style="margin:8px 16px 0;border-top:1px solid var(--border)"></div>';
  html+='<div style="padding:8px 16px 28px"><button style="width:100%;padding:12px;border-radius:var(--rs);border:1.5px solid var(--red);background:none;color:var(--red);font-size:14px;font-family:var(--font);cursor:pointer" onclick="deleteGig('+g.id+')">Remove this entry</button></div>';
  document.getElementById('det-content').innerHTML=html;
  track('gig_detail_viewed');
  showPage('detail');
}

function openGigModal(){
  window.editingGigId = null;
  document.getElementById('g-date').value=new Date().toISOString().split('T')[0];
  ['g-name','g-payer','g-fee','g-cart','g-notes','g-cc-pay','g-loan-pay','g-selfloan-borrow','g-selfloan-repay'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  ['h-fee','h-cart','h-tax','h-hst','h-dues','h-net','h-enjoy','h-invest','h-cc','h-loan','h-sl-borrow','h-sl-repay','h-notes','g-check-amt'].forEach(id=>{const el=document.getElementById(id);if(el)el.value=''});
  const hTypeEl=document.getElementById('h-type'); if(hTypeEl) hTypeEl.value='Freelance';
  const checkRes=document.getElementById('g-check-result'); if(checkRes) checkRes.textContent='—';
  ['f-date','f-name','f-payer','f-fee'].forEach(id=>{const el=document.getElementById(id);if(el)el.classList.remove('error');});
  const hist=document.getElementById('g-historical'); if(hist) hist.checked=false;
  const gType=document.getElementById('g-type'); if(gType) gType.value='Freelance';
  const hst=document.getElementById('g-hst'); if(hst) hst.checked = S.lastHstToggle===true;
  const dues=document.getElementById('g-dues'); if(dues) dues.checked = S.lastDuesToggle!==false;
  document.getElementById('gig-split-area').style.display='none';
  document.getElementById('historical-toggle-row').style.display='none';
  document.getElementById('historical-fields').style.display='none';
  document.getElementById('main-gig-fields').style.display='block';
  document.querySelector('#gig-modal .m-title').textContent = 'Log a gig';
  document.querySelector('#gig-modal .btn-p').textContent = 'Add gig';
  openOv('gig-modal');
}
document.addEventListener('DOMContentLoaded',function(){
  const fab=document.getElementById('fab');
  if(fab) fab.addEventListener('click',openGigModal);
});
let filtState='all';
function updateFilterPills(){
  const hasPending = S.gigs.some(g=>g.status==='Pending');
  ['all','Received','Pending'].forEach(x=>{
    const el=document.getElementById('f'+{all:'a',Received:'r',Pending:'p'}[x]);
    if(!el) return;
    el.className='pill';el.style.cursor='pointer';el.style.border='none';
    el.style.background='';el.style.color='';
    if(x===filtState){el.className='pill pill-green';}
    else if(x==='Pending'&&hasPending){el.className='pill pill-amber';}
    else{el.style.background='var(--sage-l)';el.style.color='var(--muted)';}
  });
}
function filt(f){
  filtState=f;
  updateFilterPills();
  renderGigs();
}
function renderGigs(){
  updateFilterPills();
  // Populate year dropdown once
  const yearSel = document.getElementById('gig-year');
  if(yearSel && yearSel.options.length<=1){
    const years = new Set(S.gigs.map(g=>new Date(g.date+'T12:00:00').getFullYear()));
    years.add(new Date().getFullYear());
    Array.from(years).sort((a,b)=>b-a).forEach(y=>{
      const opt = document.createElement('option');
      opt.value=y; opt.textContent=y;
      yearSel.appendChild(opt);
    });
  }
  let list=filtState==='all'?S.gigs.slice():S.gigs.filter(g=>g.status===filtState);
  const yearFilter = document.getElementById('gig-year')?.value || 'all';
  if(yearFilter!=='all') list = list.filter(g=>new Date(g.date+'T12:00:00').getFullYear()===parseInt(yearFilter));
  // Search filter
  const searchTerm = (document.getElementById('gig-search')?.value||'').toLowerCase().trim();
  if(searchTerm) list = list.filter(g=>
    (g.name||'').toLowerCase().includes(searchTerm) ||
    (g.payer||'').toLowerCase().includes(searchTerm) ||
    (g.notes||'').toLowerCase().includes(searchTerm)
  );
  const sortMode = document.getElementById('gig-sort')?.value || 'newest';
  if(sortMode==='newest') list.sort((a,b)=>new Date(b.date)-new Date(a.date) || (b.entryOrder||0)-(a.entryOrder||0));
  else if(sortMode==='oldest') list.sort((a,b)=>new Date(a.date)-new Date(b.date) || (a.entryOrder||0)-(b.entryOrder||0));
  else if(sortMode==='historical'){
    const hist = list.filter(g=>g.isHistorical).sort((a,b)=>new Date(b.date)-new Date(a.date));
    const reg = list.filter(g=>!g.isHistorical).sort((a,b)=>new Date(b.date)-new Date(a.date));
    list = [...hist, ...reg];
  }
  else if(sortMode==='pending'){
    const pend = list.filter(g=>g.status==='Pending').sort((a,b)=>new Date(a.date)-new Date(b.date));
    const recv = list.filter(g=>g.status!=='Pending').sort((a,b)=>new Date(b.date)-new Date(a.date));
    list = [...pend, ...recv];
  }
  document.getElementById('gigs-ct').textContent=list.length+' entr'+(list.length===1?'y':'ies');
  document.getElementById('gigs-list').innerHTML=list.length?list.map(gigRow).join(''):'<div class="empty"><i class="ti ti-music" aria-hidden="true"></i><p>No gigs here yet.</p></div>';
}

// ===== REPORTS =====
function getReportYears(){
  const years = new Set(S.gigs.filter(g=>g.status==='Received').map(g=>new Date(g.date+'T12:00:00').getFullYear()));
  years.add(new Date().getFullYear());
  return Array.from(years).sort((a,b)=>b-a);
}
function renderRepList(){
  const sel = document.getElementById('rep-year');
  if(sel && sel.options.length===0){
    getReportYears().forEach(y=>{
      const opt = document.createElement('option');
      opt.value=y; opt.textContent='Tax year: '+y;
      sel.appendChild(opt);
    });
  }
}
function showRep(type){
  const y = parseInt(document.getElementById('rep-year')?.value) || new Date().getFullYear();
  const rec = S.gigs.filter(g=>g.status==='Received' && new Date(g.date+'T12:00:00').getFullYear()===y);
  const reps = {
    accountant: { title:'For your accountant', rows:[], custom: true },
    giglog: { title:'Gig log', rows:[
      ['Tax year',y],['Total entries',rec.length],
      ['Total gross',fmt(rec.reduce((t,g)=>t+g.fee+(g.cart||0),0))],
      ['Total net liquid',fmt(rec.reduce((t,g)=>t+g.netLiquid,0))]
    ]},
    snapshot: { title:'Year-end snapshot', rows:[
      ['Tax year',y],
      ['Net income',fmt(rec.reduce((t,g)=>t+g.netLiquid,0))],
      ['Total to HISA',fmt(rec.reduce((t,g)=>t+(g.moveToHisa||0),0))],
      ['Enjoy-life total',fmt(rec.reduce((t,g)=>t+(g.enjoy||0),0))],
      ['Savings total',fmt(rec.reduce((t,g)=>t+g.buckets.reduce((s2,b)=>s2+b.amt,0),0))],
      ['Invested total',fmt(rec.reduce((t,g)=>t+(g.invest||0),0))],
      ['Debt paid down',fmt(rec.reduce((t,g)=>t+(g.ccPay||0)+(g.loanPay||0),0))],
      ['Self-loan borrowed',fmt(rec.reduce((t,g)=>t+(g.selfLoanBorrow||0),0))],
      ['Self-loan repaid',fmt(rec.reduce((t,g)=>t+(g.selfLoanRepay||0),0))],
      ['Building future %',(rec.reduce((t,g)=>t+g.netLiquid,0)>0
        ?Math.round(rec.reduce((t,g)=>t+(g.invest||0)+g.buckets.reduce((s2,b)=>s2+b.amt,0),0)/rec.reduce((t,g)=>t+g.netLiquid,0)*100)
        :0)+'%']
    ]},
    invest: { title:'Investment tracker', rows:
      S.invAccounts.length
        ? [['Tax year',y],...S.invAccounts.map(a=>[a.type+' allocated YTD',fmt(rec.reduce((t,g)=>t+(g.invest||0)/Math.max(1,S.invAccounts.length),0))]),
           ...S.buckets.map(b=>[b.name+' YTD',fmt(rec.reduce((t,g)=>t+(g.buckets.find(x=>x.name===b.name)||{amt:0}).amt,0))])]
        : [['No investment accounts set up yet','—']]
    }
  };
  const r = reps[type];
  document.getElementById('rep-title').textContent = r.title+' — '+y;
  if(type==='accountant'){
    // Custom accountant report: freelance/other only, gig-by-gig table
    const freelanceRec = rec.filter(g=>g.type!=='Employment');
    const totalGross = freelanceRec.reduce((t,g)=>t+(g.fee||0)+(g.cart||0),0);
    const totalHst = freelanceRec.reduce((t,g)=>t+(g.salesTax||0),0);
    const totalDues = freelanceRec.reduce((t,g)=>t+(g.workDues||0),0);
    const totalTax = freelanceRec.reduce((t,g)=>t+(g.incomeTax||0),0);
    const rows = freelanceRec.map(g=>`
      <div class="rep-row" style="font-size:12px;flex-wrap:wrap;gap:2px">
        <span style="flex:0 0 70px;color:var(--muted)">${fmtD(g.date)}</span>
        <span style="flex:1;min-width:100px">${g.name}</span>
        <span style="flex:0 0 90px;color:var(--muted);font-size:11px">${g.payer||'—'}</span>
        <span style="flex:0 0 60px;text-align:right">${fmt2((g.fee||0)+(g.cart||0))}</span>
        <span style="flex:0 0 55px;text-align:right;color:var(--sage)">${g.salesTax>0?fmt2(g.salesTax):'—'}</span>
        <span style="flex:0 0 50px;text-align:right;color:var(--muted)">${g.workDues>0?fmt2(g.workDues):'—'}</span>
        <span style="flex:0 0 60px;text-align:right;color:var(--gold-d)">${fmt2(g.incomeTax||0)}</span>
      </div>`).join('');
    document.getElementById('rep-content').innerHTML =
      '<div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);margin-bottom:8px">Freelance & other income only — T4 employment excluded</div>'+
      '<div class="rep-row" style="font-size:10px;font-weight:600;color:var(--muted);border-bottom:2px solid var(--border);padding-bottom:4px">'+
        '<span style="flex:0 0 70px">Date</span><span style="flex:1">Description</span><span style="flex:0 0 90px">Payer</span>'+
        '<span style="flex:0 0 60px;text-align:right">Gross</span><span style="flex:0 0 55px;text-align:right">HST</span>'+
        '<span style="flex:0 0 50px;text-align:right">Dues</span><span style="flex:0 0 60px;text-align:right">Tax set</span>'+
      '</div>'+
      (freelanceRec.length ? rows : '<div style="color:var(--muted);font-size:13px;padding:12px 0">No freelance income found for '+y+'</div>')+
      '<div class="rep-row" style="font-weight:600;border-top:2px solid var(--border);margin-top:8px;padding-top:8px">'+
        '<span style="flex:1">Totals</span>'+
        '<span style="flex:0 0 60px;text-align:right">'+fmt2(totalGross)+'</span>'+
        '<span style="flex:0 0 55px;text-align:right;color:var(--sage)">'+fmt2(totalHst)+'</span>'+
        '<span style="flex:0 0 50px;text-align:right;color:var(--muted)">'+fmt2(totalDues)+'</span>'+
        '<span style="flex:0 0 60px;text-align:right;color:var(--gold-d)">'+fmt2(totalTax)+'</span>'+
      '</div>';
  } else {
    document.getElementById('rep-content').innerHTML = r.rows.map(([l,v])=>'<div class="rep-row"><span>'+l+'</span><span>'+v+'</span></div>').join('');
  }
  document.getElementById('rep-list').style.display='none';
  document.getElementById('rep-detail').style.display='block';
  track('report_viewed', type);
}
function hideRep(){ document.getElementById('rep-list').style.display='block'; document.getElementById('rep-detail').style.display='none'; }

// ===== INVOICE GENERATOR =====
let invLines=[{id:1,desc:'',amt:0}];
function initInvoice(){
  const today=new Date();
  const dateStr=today.toISOString().split('T')[0];
  const due=new Date(today);due.setDate(due.getDate()+30);
  const dueStr=due.toISOString().split('T')[0];
  document.getElementById('inv-date').value=dateStr;
  document.getElementById('inv-due').value=dueStr;
  const invCount=S.gigs.length+1;
  document.getElementById('inv-num').value='INV-'+String(invCount).padStart(3,'0');
  document.getElementById('inv-tax-toggle').onchange=function(){
    const show=this.value==='yes';
    document.getElementById('inv-tax-rate-field').style.display=show?'block':'none';
    document.getElementById('inv-tax-reg-field').style.display=show?'block':'none';
  };
  renderInvLines();
}
function renderInvLines(){
  const el=document.getElementById('inv-lines');if(!el)return;
  el.innerHTML=invLines.map(l=>`
    <div style="display:flex;gap:7px;margin-bottom:8px;align-items:center">
      <input type="text" value="${l.desc}" placeholder="Description (e.g. Performance fee)" style="flex:1;padding:10px 11px;border:1.5px solid var(--border);border-radius:var(--rs);font-size:14px;font-family:var(--font);outline:none" onchange="updInvLine(${l.id},'desc',this.value)" aria-label="Line item description">
      <input type="number" value="${l.amt||''}" placeholder="$" style="width:90px;padding:10px 11px;border:1.5px solid var(--border);border-radius:var(--rs);font-size:14px;font-family:var(--font);outline:none" onchange="updInvLine(${l.id},'amt',this.value)" aria-label="Amount">
      ${invLines.length>1?`<button onclick="delInvLine(${l.id})" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:4px" aria-label="Remove line"><i class="ti ti-x" aria-hidden="true"></i></button>`:''}
    </div>`).join('');
}
function addInvLine(){invLines.push({id:Date.now(),desc:'',amt:0});renderInvLines();}
function delInvLine(id){if(invLines.length>1){invLines=invLines.filter(l=>l.id!==id);renderInvLines();}}
function updInvLine(id,field,val){const l=invLines.find(x=>x.id===id);if(l)l[field]=field==='amt'?(parseFloat(val)||0):val;}

function previewInvoice(){
  const yourName=document.getElementById('inv-your-name').value.trim()||'Your Name';
  const yourAddr=document.getElementById('inv-your-addr').value.trim();
  const yourEmail=document.getElementById('inv-your-email').value.trim();
  const yourPhone=document.getElementById('inv-your-phone').value.trim();
  const clientName=document.getElementById('inv-client-name').value.trim()||'Client Name';
  const clientAddr=document.getElementById('inv-client-addr').value.trim();
  const invNum=document.getElementById('inv-num').value.trim()||'INV-001';
  const invDate=document.getElementById('inv-date').value;
  const invDue=document.getElementById('inv-due').value;
  const taxType=document.getElementById('inv-tax-toggle').value;
  const taxPct=parseFloat(document.getElementById('inv-tax-pct').value)||13;
  const taxReg=document.getElementById('inv-tax-reg')?.value.trim()||'';
  const payNote=document.getElementById('inv-payment-note').value.trim();
  const premType=document.getElementById('inv-premium-toggle')?.value||'no';
  const premPct=parseFloat(document.getElementById('inv-premium-pct')?.value)||0;
  const subtotal=invLines.reduce((t,l)=>t+(+l.amt||0),0);
  const premAmt=premType==='yes'?subtotal*(premPct/100):0;
  const afterPremium=subtotal+premAmt;
  const taxAmt=taxType==='yes'?afterPremium*(taxPct/100):0;
  const total=afterPremium+taxAmt;

  document.getElementById('inv-preview').innerHTML=`
    <div class="inv-hdr">
      <div>
        <div style="font-size:20px;font-weight:700;color:var(--sage-d)">${yourName}</div>
        ${yourAddr?'<div style="font-size:12px;color:var(--muted);margin-top:2px">'+yourAddr.replace(/\n/g,'<br>')+'</div>':''}
        ${yourEmail?'<div style="font-size:12px;color:var(--muted)">'+yourEmail+'</div>':''}
        ${yourPhone?'<div style="font-size:12px;color:var(--muted)">'+yourPhone+'</div>':''}
      </div>
      <div class="inv-meta">
        <h2>Invoice</h2>
        <p># ${invNum}</p>
        <p>Date: ${invDate?fmtFull(invDate):''}</p>
        <p>Due: ${invDue?fmtFull(invDue):''}</p>
      </div>
    </div>
    <div class="inv-parties">
      <div class="inv-party">
        <h4>From</h4>
        <p><strong>${yourName}</strong><br>${yourAddr.replace(/\n/g,'<br>')}${yourEmail?'<br>'+yourEmail:''}${yourPhone?'<br>'+yourPhone:''}</p>
      </div>
      <div class="inv-party">
        <h4>Bill to</h4>
        <p><strong>${clientName}</strong><br>${clientAddr.replace(/\n/g,'<br>')}</p>
      </div>
    </div>
    <table class="inv-table">
      <thead><tr><th>Description</th><th>Amount</th></tr></thead>
      <tbody>${invLines.filter(l=>l.desc||l.amt).map(l=>`<tr><td>${l.desc||'—'}</td><td>${fmt2(+l.amt||0)}</td></tr>`).join('')}</tbody>
    </table>
    <div class="inv-totals">
      <div class="inv-total-row"><span>Subtotal</span><span>${fmt2(subtotal)}</span></div>
      ${premType==='yes'?`<div class="inv-total-row"><span>Premium (${premPct}%)</span><span>${fmt2(premAmt)}</span></div>`:''}
      ${taxType==='yes'?`<div class="inv-total-row"><span>Sales tax (${taxPct}%)${taxReg?' — Reg #'+taxReg:''}</span><span>${fmt2(taxAmt)}</span></div>`:''}
      <div class="inv-total-row total"><span>Total</span><span>${fmt2(total)}</span></div>
    </div>
    ${payNote?`<div class="inv-note"><strong>Payment:</strong> ${payNote}</div>`:''}
  `;
  document.getElementById('inv-preview-section').style.display='block';
  document.getElementById('inv-preview-section').scrollIntoView({behavior:'smooth'});
  track('invoice_generated');
}

// ===== SETTINGS =====
function renderSettings(){
  document.getElementById('set-base').textContent=fmt(S.settings.baseline);
  document.getElementById('set-currency').textContent=S.currency||'$';
  document.getElementById('set-tax').textContent=Math.round(S.settings.taxRate*100)+'%';
  document.getElementById('set-hst').textContent=Math.round(S.settings.hstRate*100)+'%';
  // Populate account name fields
  const an = S.acctNames||{};
  const chk=document.getElementById('acct-chequing'); if(chk) chk.value=an.chequing||'';
  const sa=document.getElementById('acct-setaside'); if(sa) sa.value=an.setaside||'';
  const inv=document.getElementById('acct-invest'); if(inv) inv.value=an.invest||'';
  // CPP folded into tax set-aside
  document.getElementById('learn-tog').checked=S.learnMode!==false;
  document.getElementById('carry-tog').checked=!!S.toggleCarry;
  document.getElementById('buf-tog').checked=!!S.toggleBuffer;
  const el=document.getElementById('set-bkts');
  el.innerHTML=S.buckets.length
    ?S.buckets.map(b=>`<div class="set-row"><span class="set-label">${b.name}</span><span class="set-val">${b.pct}%</span></div>`).join('')+
      S.invAccounts.map(a=>`<div class="set-row"><span class="set-label">${a.type}</span><span class="set-val">${a.pct}%</span></div>`).join('')+
      `<div class="set-row"><span class="set-label">Enjoy-life</span><span class="set-val">${Math.round(S.settings.enjoyPct*100)}%</span></div>`
    :'<p style="font-size:13px;color:var(--muted);padding:8px 0">No savings buckets set up yet.</p>';
  // Populate balance/debt/self-loan inputs
  if(document.getElementById('bal-chk')) document.getElementById('bal-chk').value=S.balances?.checking||'';
  if(document.getElementById('bal-sav')) document.getElementById('bal-sav').value=S.balances?.savings||'';
  if(document.getElementById('bal-tfsa')) document.getElementById('bal-tfsa').value=S.balances?.tfsa||'';
  if(document.getElementById('bal-inv')) document.getElementById('bal-inv').value=S.balances?.invest||'';
  if(document.getElementById('debt-cc')) document.getElementById('debt-cc').value=S.debt?.cc||'';
  if(document.getElementById('debt-loan')) document.getElementById('debt-loan').value=S.debt?.loan||'';
  if(document.getElementById('set-selfloan')) document.getElementById('set-selfloan').textContent=fmt(S.selfLoan||0);
}
function addSelfLoanLump(){
  const amt=parseFloat(document.getElementById('selfloan-add').value)||0;
  if(amt<=0) return;
  S.selfLoan=(S.selfLoan||0)+amt;
  document.getElementById('selfloan-add').value='';
  save(); renderSettings();
}
function dismissReadiness(){
  S.hasSeenReadinessCheck = true;
  save();
  closeOv('readiness-modal');
}
function getAcctName(type, fallback){
  const n = S.acctNames?.[type];
  return (n && n.trim()) ? n.trim() : fallback;
}
function getSetAsideName(){ return getAcctName('setaside','your set-aside account'); }
function getInvestName(){ return getAcctName('invest','your investment account'); }
function getChequingName(){ return getAcctName('chequing','your chequing account'); }
function saveAcctNames(){
  S.acctNames = {
    chequing: document.getElementById('acct-chequing')?.value.trim()||'',
    setaside: document.getElementById('acct-setaside')?.value.trim()||'',
    invest: document.getElementById('acct-invest')?.value.trim()||''
  };
  save();
}
function openBalanceOverride(){
  document.getElementById('bo-selfloan').value=(S.selfLoan||0).toFixed(2);
  document.getElementById('bo-cc').value=(S.debt?.cc||0).toFixed(2);
  document.getElementById('bo-loan').value=(S.debt?.loan||0).toFixed(2);
  openOv('balance-override-modal');
}
function saveBalanceOverride(){
  S.selfLoan=parseFloat(document.getElementById('bo-selfloan').value)||0;
  if(!S.debt) S.debt={cc:0,loan:0};
  S.debt.cc=parseFloat(document.getElementById('bo-cc').value)||0;
  S.debt.loan=parseFloat(document.getElementById('bo-loan').value)||0;
  save(); closeOv('balance-override-modal'); renderSettings(); updateDash();
  track('balance_override_saved');
}
function saveBalances(){
  S.balances={
    checking:parseFloat(document.getElementById('bal-chk')?.value)||0,
    savings:parseFloat(document.getElementById('bal-sav')?.value)||0,
    tfsa:parseFloat(document.getElementById('bal-tfsa')?.value)||0,
    invest:parseFloat(document.getElementById('bal-inv')?.value)||0
  };
  S.debt={
    cc:parseFloat(document.getElementById('debt-cc')?.value)||0,
    loan:parseFloat(document.getElementById('debt-loan')?.value)||0
  };
  save(); if(S.onboarded) updateDash();
}
function saveS(){
  const prevLearn=S.learnMode;
  S.learnMode=document.getElementById('learn-tog').checked;
  const learnNote=document.getElementById('ob3-learn-note');
  if(learnNote)learnNote.style.display=S.learnMode?'block':'none';
  S.toggleCarry=document.getElementById('carry-tog').checked;
  S.toggleBuffer=document.getElementById('buf-tog').checked;
  if(S.learnMode!==prevLearn)track('learn_mode_changed',{on:S.learnMode});
  applyLearnMode();
  save();
}
function applyLearnMode(){
  const on = S.learnMode!==false;
  // Show/hide all educational tip elements
  document.querySelectorAll('.learn-tip,.hisa-tip,.edu-note').forEach(el=>{
    el.style.display = on ? 'block' : 'none';
  });
  // Show/hide How It Works educational note blocks
  document.querySelectorAll('.help-term p').forEach(el=>{
    el.style.display = on ? '' : 'none';
  });
  // HISA modal tip
  const hmtip = document.getElementById('hm-tip');
  if(hmtip) hmtip.style.display = on ? 'block' : 'none';
  // Self-loan explanation
  const slTip = document.getElementById('sl-tip');
  if(slTip) slTip.style.display = on ? 'block' : 'none';
}

// Edit expense modal
function renderEditExpRows(){
  const el=document.getElementById('edit-exp-rows');if(!el)return;
  el.innerHTML=S.expenses.map(e=>`
    <div class="exp-row">
      <input type="text" value="${e.name}" style="flex:1" onchange="updExpName(${e.id},this.value)" aria-label="Expense name">
      <input type="number" value="${e.amt||''}" placeholder="$" style="width:90px" onchange="updExpAmt(${e.id},this.value,'edit')" aria-label="Amount">
      <button class="exp-del" onclick="delExp(${e.id},'edit')" aria-label="Remove ${e.name}"><i class="ti ti-x" aria-hidden="true"></i></button>
    </div>`).join('');
  calcExpTotal('edit');
}
// Override openOv for exp-modal to pre-render
const _origOpenOv=openOv;
function openOv(id){
  if(id==='exp-modal')renderEditExpRows();
  if(id==='tax-modal'){
    document.getElementById('et-tax').value=Math.round(S.settings.taxRate*100);
    document.getElementById('et-hst').value=Math.round(S.settings.hstRate*100);
    document.getElementById('et-dues').value=Math.round(S.settings.duesRate*100);
    const knownCurrencies=['$','€','£','¥','₹'];
    const cur = S.currency||'$';
    const sel = document.getElementById('et-currency');
    if(sel){
      sel.value = knownCurrencies.includes(cur) ? cur : 'other';
      const otherField = document.getElementById('et-currency-other-field');
      const otherInput = document.getElementById('et-currency-other');
      if(!knownCurrencies.includes(cur)){ if(otherField) otherField.style.display='block'; if(otherInput) otherInput.value=cur; }
      else { if(otherField) otherField.style.display='none'; }
    }
  }
  if(id==='bkt-modal'){renderEditBktList();document.getElementById('ee-enjoy').value=Math.round(S.settings.enjoyPct*100);}
  document.getElementById(id).classList.add('open');
}
function saveExpenses(){S.settings.baseline=S.expenses.reduce((t,e)=>t+e.amt,0);save();closeOv('exp-modal');renderSettings();track('expenses_updated');}
function saveTax(){
  S.settings.taxRate=(parseFloat(document.getElementById('et-tax').value)||32)/100;
  S.settings.hstRate=(parseFloat(document.getElementById('et-hst').value)||13)/100;
  S.settings.duesRate=(parseFloat(document.getElementById('et-dues').value)||3)/100;
  const cur = document.getElementById('et-currency')?.value || '$';
  S.currency = cur==='other' ? (document.getElementById('et-currency-other')?.value.trim()||'$') : cur;
  save(); closeOv('tax-modal'); renderSettings(); track('tax_settings_updated');
}

function renderEditBktList(){
  const el=document.getElementById('edit-bkt-list');if(!el)return;
  el.innerHTML=S.buckets.map(b=>`
    <div class="bucket-item" id="bkt-item-${b.id}">
      <input class="bucket-name-input" value="${b.name}" onchange="updateBucket(${b.id},'name',this.value)" style="flex:1;border:none;background:transparent;font-size:15px;font-family:var(--font);color:var(--text);outline:none;cursor:text">
      <div style="display:flex;align-items:center;gap:4px">
        <input type="number" class="bucket-pct-input" value="${b.pct}" min="0" max="100" onchange="updateBucket(${b.id},'pct',this.value);renderEditBktList()" style="width:48px;border:1px solid var(--border);border-radius:6px;padding:4px 6px;font-size:14px;font-family:var(--font);text-align:right;outline:none">
        <span style="font-size:13px;color:var(--muted)">%</span>
        <button class="bucket-del" onclick="removeBucket(${b.id});renderEditBktList()" aria-label="Remove ${b.name}"><i class="ti ti-x" aria-hidden="true"></i></button>
      </div>
    </div>`).join('')+
    S.invAccounts.map(a=>`<div class="bucket-item"><span class="bucket-name">${a.type}</span><span class="bucket-pct">${a.pct}%</span><button class="bucket-del" onclick="removeInv(${a.id});renderEditBktList()" aria-label="Remove ${a.type}"><i class="ti ti-x" aria-hidden="true"></i></button></div>`).join('');
  updateEditPctLeft();
}
function saveGigSort(){
  const sel = document.getElementById('gig-sort');
  if(sel) S.lastGigSort = sel.value;
  save();
}
function updateBucket(id, field, val){
  const b = S.buckets.find(x=>x.id===id); if(!b) return;
  if(field==='name') b.name = val.trim()||b.name;
  if(field==='pct'){
    const p = parseFloat(val)||0;
    const otherTotal = S.buckets.filter(x=>x.id!==id).reduce((t,x)=>t+x.pct,0);
    if(otherTotal + p > 100){ alert('Total would exceed 100%.'); return; }
    b.pct = p;
    // 0% keeps bucket visible but inactive — don't remove
  }
  save();
}
function addEditBucket(){
  const name=document.getElementById('eb-name').value.trim();
  const pct=parseFloat(document.getElementById('eb-pct').value)||0;
  if(!name||pct<=0)return;
  if(usedPct()+pct>100){alert('Total would exceed 100%.');return;}
  S.buckets.push({id:Date.now(),name,pct});
  document.getElementById('eb-name').value='';document.getElementById('eb-pct').value='';
  renderEditBktList();
}
function updateEditPctLeft(){
  const l=100-usedPct();
  const el=document.getElementById('edit-pct-left');
  if(!el) return;
  if(l<=0){
    el.textContent='⚠️ Nothing left to invest — consider reducing a bucket.';
    el.style.color='var(--red)';
  } else {
    el.textContent=l+'% → Invest (automatic)';
    el.style.color='var(--sage)';
  }
}
function saveBuckets(){S.settings.enjoyPct=(parseFloat(document.getElementById('ee-enjoy').value)||20)/100;save();closeOv('bkt-modal');renderSettings();track('buckets_updated');}

// ===== DATA EXPORT / IMPORT =====
function exportData(){
  const exportObj={
    version:'aa_v4',
    exportDate:new Date().toISOString(),
    data:S
  };
  const blob=new Blob([JSON.stringify(exportObj,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download='artisticautonomy_backup_'+new Date().toISOString().split('T')[0]+'.json';
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  URL.revokeObjectURL(url);
  track('data_exported');
  alert('Your data has been exported. Keep this file safe to restore your data at any time.');
}
function importData(input){
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=function(e){
    try{
      const obj=JSON.parse(e.target.result);
      if(!obj.version||!obj.data){alert('This file does not appear to be a valid artisticAutonomy backup.');return;}
      if(confirm('This will replace your current data with the backup from '+new Date(obj.exportDate).toLocaleDateString()+'. Continue?')){
        S={...S,...obj.data};
        save();
        renderSettings();
        updateDash();
        alert('Data restored successfully.');
        track('data_imported');
      }
    }catch(err){alert('Could not read the backup file. Please use a valid artisticAutonomy export.');}
  };
  reader.readAsText(file);
  input.value='';
}



// PostHog — defined after all app functions
(function(){try{
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.people.toString(1)+" (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('phc_r6fQPiBALkq68Z4QkyWjtstrkK4EVHev9aJz2PBY4TSs',{api_host:'https://us.i.posthog.com',autocapture:false,capture_pageview:false,loaded:function(ph){ph.identify(getAnonId());}});
}catch(e){console.log('analytics err',e);}})();
