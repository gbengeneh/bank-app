/* =========================================================
   NORTHGATE BANK — frontend, talks to the JSON-backed API
   ========================================================= */

let TOKEN = sessionStorage.getItem('ngb_token') || null;
let STATE = null;

const DB_KEY = 'ngb_demo_db_v1';

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function nextMonthOn(day) {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  d.setDate(day);
  return d.toISOString().slice(0, 10);
}

function seedDemoDB() {
  return {
    user: 
       { username: 'Anny6066', password: 'Mylove1711@', name: 'Gbenga Famodun', email: 'gbengeneh55@gmail.com', initials: 'AN' },
    accounts: [
      { id: 'chk1', type: 'Checking', nickname: 'Everyday Checking', mask: '3475', balance: 8088521.33, available: 8084471.33 },
      { id: 'sav1', type: 'Savings', nickname: 'High-Yield Savings', mask: '7731', balance: 1002890.10, available: 1002890.10 }
    ],
    transactions: [
      { id: 't1', acctId: 'chk1', date: daysAgo(0), merchant: 'Green Valley Grocers', category: 'Groceries', amount: -84.27, pending: true },
      { id: 't2', acctId: 'chk1', date: daysAgo(1), merchant: 'Payroll Deposit - Acme Corp', category: 'Income', amount: 2150, pending: false },
      { id: 't3', acctId: 'chk1', date: daysAgo(2), merchant: 'Citywide Electric', category: 'Utilities', amount: -112.50, pending: false },
      { id: 't4', acctId: 'chk1', date: daysAgo(3), merchant: 'Streamflix', category: 'Subscriptions', amount: -15.99, pending: false },
      { id: 't5', acctId: 'chk1', date: daysAgo(4), merchant: 'Corner Coffee Co.', category: 'Dining', amount: -6.75, pending: false },
      { id: 't6', acctId: 'sav1', date: daysAgo(5), merchant: 'Transfer from Checking', category: 'Transfer', amount: 500, pending: false },
      { id: 't7', acctId: 'chk1', date: daysAgo(5), merchant: 'Transfer to Savings', category: 'Transfer', amount: -500, pending: false },
      { id: 't8', acctId: 'chk1', date: daysAgo(7), merchant: 'Metro Gas & Utility', category: 'Utilities', amount: -64.10, pending: false },
      { id: 't9', acctId: 'chk1', date: daysAgo(9), merchant: 'Riverside Apartments', category: 'Rent', amount: -1450, pending: false },
      { id: 't10', acctId: 'sav1', date: daysAgo(20), merchant: 'Interest Payment', category: 'Interest', amount: 12.44, pending: false }
    ],
    payees: [
      { id: 'p1', name: 'Citywide Electric', acct: '900381223' },
      { id: 'p2', name: 'Metro Gas & Utility', acct: '774920011' },
      { id: 'p3', name: 'Riverside Apartments', acct: 'APT-4B-2291' }
    ],
    scheduled: [
      { id: 's1', payeeId: 'p3', payeeName: 'Riverside Apartments', amount: 1450, freq: 'monthly', nextDate: nextMonthOn(1) },
      { id: 's2', payeeId: 'p1', payeeName: 'Citywide Electric', amount: 112.50, freq: 'monthly', nextDate: nextMonthOn(15) }
    ],
    contacts: [
      { id: 'c1', name: 'Jordan Lee', handle: 'jordan.lee@email.com' },
      { id: 'c2', name: 'Sam Patel', handle: '(555) 019-4432' }
    ],
    settings: { loginAlerts: true, lowBalance: true, marketing: false }
  };
}

function loadDemoDB() {
  try {
    const saved = localStorage.getItem(DB_KEY);
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  const db = seedDemoDB();
  saveDemoDB(db);
  return db;
}

function saveDemoDB(db) {
  try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch (_) {}
}

function fail(message) { return Promise.reject(new Error(message)); }
function requestBody(options) {
  try { return JSON.parse((options && options.body) || '{}'); }
  catch (_) { return {}; }
}

function api(path, options) {
  options = options || {};
  const method = options.method || 'GET';
  const body = requestBody(options);
  let db = loadDemoDB();
  const id = path.split('/').pop();
  const account = (accountId) => db.accounts.find((a) => a.id === accountId);
  const amount = () => parseFloat(body.amount);
  const save = (result) => { saveDemoDB(db); return Promise.resolve(result); };

  if (path === '/api/login' && method === 'POST') {
    if (!body.username || !body.password) return fail('Username and password are required.');
    if (body.username.toLowerCase() !== db.user.username.toLowerCase() || body.password !== db.user.password) return fail('Incorrect username or password.');
    return Promise.resolve({ token: 'browser-demo-session', user: db.user });
  }
  if (path === '/api/logout') return Promise.resolve({ ok: true });
  if (!TOKEN) return fail('Not authenticated. Please sign in again.');
  if (path === '/api/state') return Promise.resolve({ ...db, user: { name: db.user.name, email: db.user.email, initials: db.user.initials } });
  if (path === '/api/reset' && method === 'POST') {
    const profile = db.user;
    db = seedDemoDB();
    db.user = profile;
    return save({ ok: true });
  }
  if (path === '/api/settings' && method === 'PUT') {
    db.settings = Object.assign({}, db.settings, body);
    return save({ ok: true, settings: db.settings });
  }
  if (path === '/api/profile' && method === 'PUT') {
    if (body.name) db.user.name = body.name;
    if (body.email) db.user.email = body.email;
    if (body.name) db.user.initials = initialsOf(body.name);
    return save({ ok: true, user: db.user });
  }
  if (path === '/api/transfer' && method === 'POST') {
    const from = account(body.fromId), to = account(body.toId), amt = amount();
    if (!from || !to || from === to) return fail('Choose two different accounts.');
    if (!amt || amt <= 0) return fail('Enter a valid amount.');
    if (body.when === 'now' && amt > from.available) return fail('Amount exceeds available balance.');
    if (body.when === 'later') {
      db.scheduled.push({ id: 's' + Date.now(), payeeName: 'Transfer to ' + to.nickname, amount: amt, freq: 'once', nextDate: body.date });
      return save({ ok: true, message: 'Transfer scheduled for ' + body.date + '.' });
    }
    from.balance -= amt; from.available -= amt; to.balance += amt; to.available += amt;
    db.transactions.push({ id: 't' + Date.now() + 'a', acctId: from.id, date: todayISO(), merchant: 'Transfer to ' + to.nickname, category: 'Transfer', amount: -amt, pending: false });
    db.transactions.push({ id: 't' + Date.now() + 'b', acctId: to.id, date: todayISO(), merchant: 'Transfer from ' + from.nickname, category: 'Transfer', amount: amt, pending: false });
    return save({ ok: true, message: 'Transfer completed.' });
  }
  if (path === '/api/external-transfer' && method === 'POST') {
    const from = account(body.fromId), amt = amount(), acct = String(body.toAccountNumber || '').replace(/[\s-]/g, '');
    if (!from) return fail('Invalid source account.');
    if (!/^\d{8,17}$/.test(acct)) return fail('Enter a valid account number (8-17 digits).');
    if (!amt || amt <= 0) return fail('Enter a valid amount.');
    if (body.when === 'now' && amt > from.available) return fail('Amount exceeds available balance.');
    const label = 'External Transfer to Account ••••' + acct.slice(-4);
    if (body.when === 'later') {
      db.scheduled.push({ id: 's' + Date.now(), payeeName: label, amount: amt, freq: 'once', nextDate: body.date });
      return save({ ok: true, message: 'External transfer scheduled for ' + body.date + '.' });
    }
    from.balance -= amt; from.available -= amt;
    db.transactions.push({ id: 't' + Date.now(), acctId: from.id, date: todayISO(), merchant: label + (body.memo ? ' — ' + body.memo : ''), category: 'External Transfer', amount: -amt, pending: true });
    return save({ ok: true, message: 'External transfer submitted and is pending.' });
  }
  if (path === '/api/payees' && method === 'POST') {
    if (!body.name) return fail('Enter a payee name.');
    db.payees.push({ id: 'p' + Date.now(), name: body.name, acct: body.acct || '—' });
    return save({ ok: true });
  }
  if (path.startsWith('/api/payees/') && method === 'DELETE') { db.payees = db.payees.filter((p) => p.id !== id); return save({ ok: true }); }
  if (path.startsWith('/api/scheduled/') && method === 'DELETE') { db.scheduled = db.scheduled.filter((s) => s.id !== id); return save({ ok: true }); }
  if (path === '/api/contacts' && method === 'POST') { db.contacts.push({ id: 'c' + Date.now(), name: body.name, handle: body.handle }); return save({ ok: true }); }
  if (path.startsWith('/api/contacts/') && method === 'DELETE') { db.contacts = db.contacts.filter((c) => c.id !== id); return save({ ok: true }); }
  if (path === '/api/billpay' && method === 'POST') {
    const payee = db.payees.find((p) => p.id === body.payeeId), from = account(body.fromId), amt = amount();
    if (!payee || !from) return fail('Payee or account not found.');
    if (!amt || amt <= 0) return fail('Enter a valid amount.');
    if (!body.date) return fail('Choose a date.');
    if (body.freq === 'monthly' || body.date !== todayISO()) {
      db.scheduled.push({ id: 's' + Date.now(), payeeId: payee.id, payeeName: payee.name, amount: amt, freq: body.freq, nextDate: body.date });
      return save({ ok: true, message: body.freq === 'monthly' ? payee.name + ' set up as a monthly payment.' : 'Payment to ' + payee.name + ' scheduled for ' + body.date + '.' });
    }
    if (amt > from.available) return fail('Amount exceeds available balance.');
    from.balance -= amt; from.available -= amt;
    db.transactions.push({ id: 't' + Date.now(), acctId: from.id, date: body.date, merchant: payee.name, category: 'Bill Payment', amount: -amt, pending: false });
    return save({ ok: true, message: 'Payment to ' + payee.name + ' sent.' });
  }
  if (path === '/api/sendmoney' && method === 'POST') {
    const contact = db.contacts.find((c) => c.id === body.contactId), from = account(body.fromId), amt = amount();
    if (!contact || !from) return fail('Recipient or account not found.');
    if (!amt || amt <= 0) return fail('Enter a valid amount.');
    if (amt > from.available) return fail('Amount exceeds available balance.');
    from.balance -= amt; from.available -= amt;
    db.transactions.push({ id: 't' + Date.now(), acctId: from.id, date: todayISO(), merchant: 'Sent to ' + contact.name + (body.note ? ' — ' + body.note : ''), category: 'Person to Person', amount: -amt, pending: true });
    return save({ ok: true, message: amt.toFixed(2) + ' sent to ' + contact.name + '.' });
  }
  return fail('This action is not available in the browser-only demo.');
}

/* ---------------- UTIL ---------------- */
function fmtMoney(n) {
  const neg = n < 0;
  const v = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (neg ? '-$' : '$') + v;
}
function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function acctById(id) { return STATE.accounts.find((a) => a.id === id); }
function todayISO() { return new Date().toISOString().slice(0, 10); }
function initialsOf(name) { return name.split(' ').filter(Boolean).slice(0, 2).map((s) => s[0].toUpperCase()).join(''); }

function toast(msg, kind) {
  const wrap = document.getElementById('toastWrap');
  const el = document.createElement('div');
  el.className = 'toast' + (kind ? ' ' + kind : '');
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

/* ---------------- AUTH ---------------- */
const DEMO_OTP_CODE = '123456';
let pendingLogin = null;
let otpMode = 'demo'; // 'server' (real Telegram delivery) or 'demo' (fixed local fallback)
let serverOtpToken = null;

function handleLogin() {
  const username = document.getElementById('loginUser').value.trim();
  const password = document.getElementById('loginPass').value;
  const errEl = document.getElementById('loginError');
  errEl.style.display = 'none';

  api('/api/login', { method: 'POST', body: JSON.stringify({ username, password }) })
    .then((data) => {
      pendingLogin = data;
      requestOtp();
    })
    .catch((err) => {
      errEl.textContent = err.message;
      errEl.style.display = 'block';
    });
}

/* Tries the real Telegram-backed endpoint; falls back to the local fixed
   demo code whenever that endpoint isn't deployed/configured (e.g. running
   index.html directly as a static file, or Telegram env vars not set yet). */
function requestOtp() {
  serverOtpToken = null;
  otpMode = 'demo';
  fetch('/api/send-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error('unavailable'))))
    .then((data) => {
      serverOtpToken = data.otpToken;
      otpMode = 'server';
    })
    .catch(() => { otpMode = 'demo'; })
    .then(() => showOtpStep());
}

function showOtpStep() {
  document.getElementById('loginStep').classList.add('hidden');
  document.getElementById('otpStep').classList.remove('hidden');
  document.getElementById('otpError').style.display = 'none';
  document.getElementById('otpCode').value = '';
  document.getElementById('otpCode').focus();

  document.getElementById('otpDemoNote').innerHTML = otpMode === 'server'
    ? 'A verification code was sent to your Telegram.'
    : 'Demo mode: use verification code <b>123456</b>. (Telegram delivery isn\'t configured on this deployment yet.)';
}

function backToLoginStep() {
  pendingLogin = null;
  serverOtpToken = null;
  otpMode = 'demo';
  document.getElementById('otpStep').classList.add('hidden');
  document.getElementById('loginStep').classList.remove('hidden');
  document.getElementById('loginPass').value = '';
}

function handleVerifyOtp() {
  const code = document.getElementById('otpCode').value.trim();
  const errEl = document.getElementById('otpError');
  errEl.style.display = 'none';

  if (!pendingLogin) { backToLoginStep(); return; }

  if (otpMode === 'server' && serverOtpToken) {
    fetch('/api/verify-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, otpToken: serverOtpToken }) })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || 'Incorrect verification code.');
        completeLogin();
      })
      .catch((err) => {
        errEl.textContent = err.message;
        errEl.style.display = 'block';
      });
    return;
  }

  if (code !== DEMO_OTP_CODE) {
    errEl.textContent = 'Incorrect verification code. Please try again.';
    errEl.style.display = 'block';
    return;
  }
  completeLogin();
}

function completeLogin() {
  TOKEN = pendingLogin.token;
  sessionStorage.setItem('ngb_token', TOKEN);
  pendingLogin = null;
  serverOtpToken = null;
  enterApp();
}

function enterApp() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('appScreen').style.display = 'block';
  refreshState().then(() => go('dashboard'));
}

function handleLogout() {
  api('/api/logout', { method: 'POST' }).catch(() => {});
  TOKEN = null;
  pendingLogin = null;
  serverOtpToken = null;
  otpMode = 'demo';
  sessionStorage.removeItem('ngb_token');
  document.getElementById('appScreen').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
  document.getElementById('otpStep').classList.add('hidden');
  document.getElementById('loginStep').classList.remove('hidden');
}

function resetDemoData() {
  if (!confirm('Reset all demo data back to the original sample accounts and transactions? Your login stays the same.')) return;
  api('/api/reset', { method: 'POST' })
    .then(() => refreshState())
    .then(() => toast('Demo data has been reset.', 'success'))
    .catch((err) => toast(err.message, 'error'));
}

function refreshState() {
  return api('/api/state')
    .then((data) => { STATE = data; renderAll(); })
    .catch((err) => {
      if (String(err.message).toLowerCase().includes('not authenticated')) {
        handleLogout();
      } else {
        toast(err.message, 'error');
      }
    });
}

/* Auto sign-in if a session token is already stored (e.g. page refresh) */
window.addEventListener('DOMContentLoaded', () => {
  if (TOKEN) enterApp();
});

/* ---------------- NAV ---------------- */
function go(pageId) {
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
  document.getElementById('page-' + pageId).classList.add('active');
  document.querySelectorAll('.nav-link').forEach((a) => a.classList.remove('active'));
  document.querySelector('.nav-link[data-page="' + pageId + '"]').classList.add('active');
  window.scrollTo(0, 0);
}
document.querySelectorAll('.nav-link').forEach((a) => {
  a.addEventListener('click', (e) => { e.preventDefault(); go(a.dataset.page); });
});

/* ---------------- RENDER ---------------- */
function renderAll() {
  renderTopUser();
  renderTotalBalance();
  renderAccountCards();
  renderSpendingOverview();
  renderDashboardTxns();
  renderTransferSelectors();
  renderPayees();
  renderScheduled();
  renderContacts();
  renderActivity();
  renderSettings();
}

function renderTopUser() {
  document.getElementById('topUserName').textContent = STATE.user.name;
  document.getElementById('topAvatar').textContent = STATE.user.initials;
  document.getElementById('dashName').textContent = STATE.user.name.split(' ')[0];
}

function renderTotalBalance() {
  const total = STATE.accounts.reduce((sum, a) => sum + a.balance, 0);
  document.getElementById('totalBalanceBar').innerHTML =
    `<div class="tb-label">Total balance across ${STATE.accounts.length} account${STATE.accounts.length === 1 ? '' : 's'}</div><div class="tb-value">${fmtMoney(total)}</div>`;
}

function renderSpendingOverview() {
  const byCat = {};
  STATE.transactions.forEach((t) => {
    if (t.amount >= 0 || t.category === 'Transfer') return;
    byCat[t.category] = (byCat[t.category] || 0) + Math.abs(t.amount);
  });
  const entries = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const wrap = document.getElementById('spendingOverviewCard');
  if (entries.length === 0) { wrap.innerHTML = `<div class="empty-state">No spending yet.</div>`; return; }
  const max = entries[0][1];
  wrap.innerHTML = entries.map(([cat, amt]) => `
    <div class="spend-row">
      <div class="sr-top"><span class="sr-cat">${cat}</span><span class="sr-amt">${fmtMoney(amt)}</span></div>
      <div class="spend-bar-track"><div class="spend-bar-fill" style="width:${Math.max(6, Math.round(amt / max * 100))}%"></div></div>
    </div>
  `).join('');
}

function renderAccountCards() {
  const wrap = document.getElementById('acctCardsWrap');
  const groups = [
    { title: 'Spend', accounts: STATE.accounts.filter((a) => a.type === 'Checking') },
    { title: 'Save & Invest', accounts: STATE.accounts.filter((a) => a.type !== 'Checking') }
  ].filter((group) => group.accounts.length);
  wrap.innerHTML = groups.map((group) => `
    <section class="account-group">
      <h3 class="account-group-title">${group.title}</h3>
      ${group.accounts.map((a) => `
        <div class="account-summary-row">
          <div>
            <div class="account-link" onclick="go('activity')">${a.nickname}</div>
            <div class="account-mask">${a.type} &nbsp;|&nbsp; •••• ${a.mask}</div>
          </div>
          <div><div class="balance-label">Available balance</div><div class="balance-value">${fmtMoney(a.available)}</div></div>
          <div><div class="balance-label">Current balance</div><div class="balance-value">${fmtMoney(a.balance)}</div></div>
          <div class="account-row-actions">
            <button class="account-action" onclick="go('activity')">View activity</button>
            <button class="account-action" onclick="go('transfers')">Transfer money</button>
            <button class="account-action" onclick="go('billpay')">Pay bills</button>
          </div>
        </div>
      `).join('')}
    </section>
  `).join('');
}

function txnRowsHtml(txns, showAcct) {
  if (txns.length === 0) return `<tr><td colspan="4"><div class="empty-state">No transactions to show.</div></td></tr>`;
  return txns.map((t) => {
    const acct = acctById(t.acctId);
    return `<tr>
      <td><div class="txn-merchant">${t.merchant}</div><div class="txn-cat">${t.category}${showAcct && acct ? ' • ' + acct.nickname : ''}</div></td>
      <td>${fmtDate(t.date)}</td>
      <td>${t.pending ? '<span class="pill pending">Pending</span>' : '<span class="pill">Posted</span>'}</td>
      <td style="text-align:right;" class="${t.amount < 0 ? 'amt-neg' : 'amt-pos'}">${t.amount < 0 ? '-' : '+'}${fmtMoney(Math.abs(t.amount))}</td>
    </tr>`;
  }).join('');
}

function renderDashboardTxns() {
  const sorted = [...STATE.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  document.getElementById('dashTxnTable').innerHTML = `
    <tr><th>Description</th><th>Date</th><th>Status</th><th style="text-align:right;">Amount</th></tr>
    ${txnRowsHtml(sorted, true)}
  `;
}

function renderTransferSelectors() {
  const opts = STATE.accounts.map((a) => `<option value="${a.id}">${a.nickname} (••${a.mask}) — ${fmtMoney(a.balance)}</option>`).join('');
  document.getElementById('xferFrom').innerHTML = opts;
  document.getElementById('xferTo').innerHTML = opts;
  if (STATE.accounts.length > 1) document.getElementById('xferTo').selectedIndex = 1;
  document.getElementById('filterAccount').innerHTML = `<option value="all">All accounts</option>` + opts;
  document.getElementById('payBillFrom').innerHTML = opts;
  document.getElementById('sendMoneyFrom').innerHTML = opts;
}

function renderPayees() {
  const wrap = document.getElementById('payeeList');
  if (STATE.payees.length === 0) { wrap.innerHTML = `<div class="empty-state">No payees yet. Add one to get started.</div>`; return; }
  wrap.innerHTML = STATE.payees.map((p) => `
    <div class="payee-row">
      <div class="payee-info"><div class="p-avatar">${initialsOf(p.name)}</div><div><div class="p-name">${p.name}</div><div class="p-sub">Acct ref: ${p.acct}</div></div></div>
      <div class="row-actions"><button class="btn btn-primary btn-sm" onclick="openPayBill('${p.id}')">Pay</button><button class="btn btn-ghost btn-sm" onclick="removePayee('${p.id}')">Remove</button></div>
    </div>
  `).join('');
}

function renderScheduled() {
  const wrap = document.getElementById('scheduledList');
  if (STATE.scheduled.length === 0) { wrap.innerHTML = `<div class="empty-state">No scheduled or recurring payments.</div>`; return; }
  wrap.innerHTML = STATE.scheduled.map((s) => `
    <div class="payee-row">
      <div class="payee-info"><div class="p-avatar">${initialsOf(s.payeeName)}</div><div><div class="p-name">${s.payeeName}</div><div class="p-sub">${fmtMoney(s.amount)} • ${s.freq === 'monthly' ? 'Monthly' : 'One time'} • Next: ${fmtDate(s.nextDate)}</div></div></div>
      <div class="row-actions"><button class="btn btn-ghost btn-sm" onclick="cancelScheduled('${s.id}')">Cancel</button></div>
    </div>
  `).join('');
}

function renderContacts() {
  const wrap = document.getElementById('contactList');
  if (STATE.contacts.length === 0) { wrap.innerHTML = `<div class="empty-state">No recipients yet. Add one to send money.</div>`; return; }
  wrap.innerHTML = STATE.contacts.map((c) => `
    <div class="contact-row">
      <div class="contact-info"><div class="p-avatar">${initialsOf(c.name)}</div><div><div class="p-name">${c.name}</div><div class="p-sub">${c.handle}</div></div></div>
      <div class="row-actions"><button class="btn btn-primary btn-sm" onclick="openSendMoney('${c.id}')">Send</button><button class="btn btn-ghost btn-sm" onclick="removeContact('${c.id}')">Remove</button></div>
    </div>
  `).join('');
}

function renderActivity() {
  const acctFilter = document.getElementById('filterAccount').value || 'all';
  const typeFilter = document.getElementById('filterType').value || 'all';
  const search = (document.getElementById('filterSearch').value || '').toLowerCase();

  let txns = [...STATE.transactions];
  if (acctFilter !== 'all') txns = txns.filter((t) => t.acctId === acctFilter);
  if (typeFilter === 'debit') txns = txns.filter((t) => t.amount < 0);
  if (typeFilter === 'credit') txns = txns.filter((t) => t.amount > 0);
  if (search) txns = txns.filter((t) => t.merchant.toLowerCase().includes(search) || t.category.toLowerCase().includes(search));
  txns.sort((a, b) => b.date.localeCompare(a.date));

  document.getElementById('activityTable').innerHTML = `
    <tr><th>Description</th><th>Date</th><th>Status</th><th style="text-align:right;">Amount</th></tr>
    ${txnRowsHtml(txns, true)}
  `;
}
['filterAccount', 'filterType', 'filterSearch'].forEach((id) => {
  document.addEventListener('input', (e) => { if (e.target && e.target.id === id) renderActivity(); });
  document.addEventListener('change', (e) => { if (e.target && e.target.id === id) renderActivity(); });
});

function renderSettings() {
  document.getElementById('settingsName').value = STATE.user.name;
  document.getElementById('settingsEmail').value = STATE.user.email;
  setSwitch('toggleLoginAlerts', STATE.settings.loginAlerts);
  setSwitch('toggleLowBalance', STATE.settings.lowBalance);
  setSwitch('toggleMarketing', STATE.settings.marketing);
}
function setSwitch(id, on) { document.getElementById(id).classList.toggle('on', !!on); }
function toggleSwitch(el) {
  el.classList.toggle('on');
  const on = el.classList.contains('on');
  const patch = {};
  if (el.id === 'toggleLoginAlerts') patch.loginAlerts = on;
  if (el.id === 'toggleLowBalance') patch.lowBalance = on;
  if (el.id === 'toggleMarketing') patch.marketing = on;
  api('/api/settings', { method: 'PUT', body: JSON.stringify(patch) })
    .then(() => toast('Preference updated.', 'success'))
    .catch((err) => toast(err.message, 'error'));
}
function saveSettings() {
  const name = document.getElementById('settingsName').value.trim();
  const email = document.getElementById('settingsEmail').value.trim();
  api('/api/profile', { method: 'PUT', body: JSON.stringify({ name, email }) })
    .then(() => refreshState())
    .then(() => toast('Profile updated.', 'success'))
    .catch((err) => toast(err.message, 'error'));
}

/* ---------------- MODALS ---------------- */
function openModal(id) { document.getElementById('modal-' + id).classList.add('active'); }
function closeModal(id) { document.getElementById('modal-' + id).classList.remove('active'); }

/* ---------------- TRANSFERS ---------------- */
function selectWhen(el) {
  const group = el.parentElement;
  group.querySelectorAll('.radio-opt').forEach((o) => o.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('xferDateRow').classList.toggle('hidden', el.dataset.when !== 'later');
}
function selectScope(el) {
  const group = el.parentElement;
  group.querySelectorAll('.radio-opt').forEach((o) => o.classList.remove('selected'));
  el.classList.add('selected');
  const isExternal = el.dataset.scope === 'external';
  document.getElementById('internalToRow').classList.toggle('hidden', isExternal);
  document.getElementById('externalToRow').classList.toggle('hidden', !isExternal);
  document.getElementById('externalRoutingRow').classList.toggle('hidden', !isExternal);
}

let pendingTransfer = null;

function submitTransfer() {
  const scope = document.querySelector('#page-transfers .radio-opt[data-scope].selected').dataset.scope;
  const fromId = document.getElementById('xferFrom').value;
  const amount = parseFloat(document.getElementById('xferAmount').value);
  const when = document.querySelector('#page-transfers .radio-opt[data-when].selected').dataset.when;
  const date = when === 'later' ? document.getElementById('xferDate').value : todayISO();
  const memo = document.getElementById('xferMemo').value.trim();

  if (!amount || amount <= 0) { toast('Enter a valid amount.', 'error'); return; }
  if (when === 'later' && !date) { toast('Please choose a date.', 'error'); return; }
  const fromAcct = acctById(fromId);
  if (when === 'now' && amount > fromAcct.available) { toast('Amount exceeds available balance.', 'error'); return; }

  if (scope === 'internal') {
    const toId = document.getElementById('xferTo').value;
    if (fromId === toId) { toast('Please choose two different accounts.', 'error'); return; }
    const toAcct = acctById(toId);
    pendingTransfer = { scope, fromId, toId, amount, when, date, memo };
    document.getElementById('confirmXferSummary').textContent =
      `Transfer ${fmtMoney(amount)} from ${fromAcct.nickname} to ${toAcct.nickname}` + (when === 'later' ? ` on ${fmtDate(date)}.` : ` now.`);
  } else {
    const toAccountNumber = document.getElementById('xferExternalAcct').value.trim();
    const routingNumber = document.getElementById('xferRouting').value.trim();
    if (!/^\d{8,17}$/.test(toAccountNumber)) { toast('Enter a valid recipient account number (8-17 digits).', 'error'); return; }
    if (routingNumber && !/^\d{9}$/.test(routingNumber)) { toast('Routing number must be 9 digits.', 'error'); return; }
    pendingTransfer = { scope, fromId, toAccountNumber, routingNumber, amount, when, date, memo };
    const masked = '••••' + toAccountNumber.slice(-4);
    document.getElementById('confirmXferSummary').textContent =
      `Transfer ${fmtMoney(amount)} from ${fromAcct.nickname} to account ${masked}` + (when === 'later' ? ` on ${fmtDate(date)}.` : ` now.`);
  }
  openModal('confirmXferModal');
}

function finalizeTransfer() {
  if (!pendingTransfer) return;
  const p = pendingTransfer;
  const call = p.scope === 'internal'
    ? api('/api/transfer', { method: 'POST', body: JSON.stringify(p) })
    : api('/api/external-transfer', { method: 'POST', body: JSON.stringify(p) });

  call.then((data) => {
    toast(data.message, 'success');
    closeModal('confirmXferModal');
    document.getElementById('xferAmount').value = '';
    document.getElementById('xferMemo').value = '';
    document.getElementById('xferExternalAcct').value = '';
    document.getElementById('xferRouting').value = '';
    pendingTransfer = null;
    return refreshState();
  }).then(() => go('dashboard'))
    .catch((err) => { toast(err.message, 'error'); closeModal('confirmXferModal'); });
}

/* ---------------- BILL PAY ---------------- */
function addPayee() {
  const name = document.getElementById('newPayeeName').value.trim();
  const acct = document.getElementById('newPayeeAcct').value.trim();
  if (!name) { toast('Enter a payee name.', 'error'); return; }
  api('/api/payees', { method: 'POST', body: JSON.stringify({ name, acct }) })
    .then(() => {
      document.getElementById('newPayeeName').value = '';
      document.getElementById('newPayeeAcct').value = '';
      closeModal('addPayeeModal');
      return refreshState();
    })
    .then(() => toast('Payee added.', 'success'))
    .catch((err) => toast(err.message, 'error'));
}
function removePayee(id) {
  api('/api/payees/' + id, { method: 'DELETE' })
    .then(() => refreshState())
    .then(() => toast('Payee removed.', 'success'))
    .catch((err) => toast(err.message, 'error'));
}

let currentPayBillId = null;
function openPayBill(payeeId) {
  currentPayBillId = payeeId;
  const payee = STATE.payees.find((p) => p.id === payeeId);
  document.getElementById('payBillName').textContent = payee.name;
  document.getElementById('payBillAmount').value = '';
  document.getElementById('payBillDate').value = todayISO();
  document.querySelectorAll('#modal-payBillModal .radio-opt').forEach((o) => o.classList.remove('selected'));
  document.querySelector('#modal-payBillModal .radio-opt[data-freq="once"]').classList.add('selected');
  openModal('payBillModal');
}
function selectFreq(el) {
  el.parentElement.querySelectorAll('.radio-opt').forEach((o) => o.classList.remove('selected'));
  el.classList.add('selected');
}
function confirmPayBill() {
  const fromId = document.getElementById('payBillFrom').value;
  const amount = parseFloat(document.getElementById('payBillAmount').value);
  const freq = document.querySelector('#modal-payBillModal .radio-opt.selected').dataset.freq;
  const date = document.getElementById('payBillDate').value;

  api('/api/billpay', { method: 'POST', body: JSON.stringify({ payeeId: currentPayBillId, fromId, amount, freq, date }) })
    .then((data) => {
      closeModal('payBillModal');
      return refreshState().then(() => toast(data.message, 'success'));
    })
    .catch((err) => toast(err.message, 'error'));
}
function cancelScheduled(id) {
  api('/api/scheduled/' + id, { method: 'DELETE' })
    .then(() => refreshState())
    .then(() => toast('Scheduled payment canceled.', 'success'))
    .catch((err) => toast(err.message, 'error'));
}

/* ---------------- SEND MONEY ---------------- */
function addContact() {
  const name = document.getElementById('newContactName').value.trim();
  const handle = document.getElementById('newContactHandle').value.trim();
  if (!name || !handle) { toast('Enter a name and email or phone.', 'error'); return; }
  api('/api/contacts', { method: 'POST', body: JSON.stringify({ name, handle }) })
    .then(() => {
      document.getElementById('newContactName').value = '';
      document.getElementById('newContactHandle').value = '';
      closeModal('addContactModal');
      return refreshState();
    })
    .then(() => toast('Recipient added.', 'success'))
    .catch((err) => toast(err.message, 'error'));
}
function removeContact(id) {
  api('/api/contacts/' + id, { method: 'DELETE' })
    .then(() => refreshState())
    .then(() => toast('Recipient removed.', 'success'))
    .catch((err) => toast(err.message, 'error'));
}

let currentSendContactId = null;
function openSendMoney(contactId) {
  currentSendContactId = contactId;
  const contact = STATE.contacts.find((c) => c.id === contactId);
  document.getElementById('sendMoneyName').textContent = contact.name;
  document.getElementById('sendMoneyAmount').value = '';
  document.getElementById('sendMoneyNote').value = '';
  openModal('sendMoneyModal');
}
function confirmSendMoney() {
  const fromId = document.getElementById('sendMoneyFrom').value;
  const amount = parseFloat(document.getElementById('sendMoneyAmount').value);
  const note = document.getElementById('sendMoneyNote').value.trim();

  api('/api/sendmoney', { method: 'POST', body: JSON.stringify({ contactId: currentSendContactId, fromId, amount, note }) })
    .then((data) => {
      closeModal('sendMoneyModal');
      return refreshState().then(() => toast(data.message, 'success'));
    })
    .catch((err) => toast(err.message, 'error'));
}
