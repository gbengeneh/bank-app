/* Verbatim markup lifted from the original static index.html body. */
export const legacyMarkupHtml = `
<div id="loginScreen">

  <header class="landing-header">
    <div class="landing-header-inner">
      <div class="brand"><img class="brand-logo" src="/logo-placeholder.svg" alt="Northgate Bank"></div>
      <nav class="landing-nav">
        <a href="#">Personal Banking</a>
        <a href="#">Small Business</a>
        <a href="#">Wealth Management</a>
        <a href="#">About Us</a>
      </nav>
      <div class="landing-header-actions">
        <a href="#" class="landing-locations">Locations &amp; ATMs</a>
        <button class="btn btn-primary btn-sm" onclick="document.getElementById('loginUser').focus()">Open an Account</button>
      </div>
    </div>
  </header>

  <section class="landing-hero">
    <div class="landing-hero-inner">
      <div class="hero-copy">
        <h1>Banking built around you</h1>
        <p>Checking, savings, and simple tools to help you manage your money — wherever life takes you.</p>
        <div class="hero-cta">
          <a href="#" class="btn btn-primary" onclick="document.getElementById('loginUser').focus();return false;">Open an Account</a>
          <a href="#products" class="btn btn-ghost-light">Explore Products</a>
        </div>
      </div>

      <div class="login-card">
        <div id="loginStep">
          <div class="brand"><img class="brand-logo" src="/logo-placeholder.svg" alt="Northgate Bank"></div>
          <h1>Sign in</h1>
          <p class="sub">Access your accounts securely.</p>
          <div class="login-error" id="loginError"></div>
          <div class="field"><label>Username</label><input type="text" id="loginUser" placeholder="Username"></div>
          <div class="field"><label>Password</label><input type="password" id="loginPass" placeholder="••••••••"></div>
          <button class="btn btn-primary btn-block" onclick="handleLogin()">Sign in</button>
          <div class="login-help">
            <p>Forgot <a href="https://login.regions.com/forgot-username?channel=olb&amp;product=accountoverview" target="_blank" rel="noopener noreferrer">username</a> or <a href="https://login.regions.com/signin?channel=olb&amp;product=accountoverview" target="_blank" rel="noopener noreferrer">password</a>?</p>
            <p>Don't have an Online Banking account? <a href="https://onlinebanking.regions.com/enrollment/home" target="_blank" rel="noopener noreferrer">Enroll now</a>.</p>
          </div>
        </div>

        <div id="otpStep" class="hidden">
          <div class="brand"><img class="brand-logo" src="/logo-placeholder.svg" alt="Northgate Bank"></div>
          <h1>Verify it's you</h1>
          <p class="sub">Enter the 6-digit verification code to finish signing in.</p>
          <div class="login-error" id="otpError"></div>
          <div class="field"><label>Verification code</label><input type="text" id="otpCode" placeholder="6-digit code" inputmode="numeric" maxlength="6" autocomplete="one-time-code"></div>
          <button class="btn btn-primary btn-block" onclick="handleVerifyOtp()">Verify &amp; sign in</button>
          <button class="btn btn-ghost btn-block" style="margin-top:10px;" onclick="backToLoginStep()">Back to sign in</button>
          <div class="demo-note" id="otpDemoNote">Demo mode: use verification code <b>123456</b>.</div>
        </div>
      </div>
    </div>
  </section>

  <section class="landing-promos" id="products">
    <div class="landing-section-inner">
      <h2>Products made for your goals</h2>
      <div class="promo-grid">
        <div class="promo-card">
          <div class="promo-ic">&#127974;</div>
          <h3>Checking Accounts</h3>
          <p>No monthly fees, mobile check deposit, and 24/7 account access.</p>
          <a href="#" class="link-btn">Learn more &rarr;</a>
        </div>
        <div class="promo-card">
          <div class="promo-ic">&#128176;</div>
          <h3>Savings &amp; CDs</h3>
          <p>Competitive rates to help your money grow, with flexible terms.</p>
          <a href="#" class="link-btn">Learn more &rarr;</a>
        </div>
        <div class="promo-card">
          <div class="promo-ic">&#128179;</div>
          <h3>Credit Cards</h3>
          <p>Cards with rewards that fit the way you spend.</p>
          <a href="#" class="link-btn">Learn more &rarr;</a>
        </div>
        <div class="promo-card">
          <div class="promo-ic">&#127968;</div>
          <h3>Loans &amp; Mortgages</h3>
          <p>From home loans to auto loans, we'll help you find the right fit.</p>
          <a href="#" class="link-btn">Learn more &rarr;</a>
        </div>
      </div>
    </div>
  </section>

  <section class="landing-features">
    <div class="landing-section-inner features-grid">
      <div class="feature-item"><div class="feature-ic">&#128241;</div><h4>Mobile Banking</h4><p>Manage your money anytime, anywhere with our mobile app.</p></div>
      <div class="feature-item"><div class="feature-ic">&#128274;</div><h4>Bank-Grade Security</h4><p>Your accounts are protected with industry-leading security.</p></div>
      <div class="feature-item"><div class="feature-ic">&#128184;</div><h4>Send Money Fast</h4><p>Send money to friends and family in minutes.</p></div>
      <div class="feature-item"><div class="feature-ic">&#127974;</div><h4>Nationwide Access</h4><p>Thousands of ATMs and branches across the country.</p></div>
    </div>
  </section>

  <footer class="landing-footer">
    <div class="landing-section-inner footer-grid">
      <div class="footer-col">
        <h5>Personal</h5>
        <a href="#">Checking</a><a href="#">Savings</a><a href="#">Credit Cards</a><a href="#">Loans</a>
      </div>
      <div class="footer-col">
        <h5>Business</h5>
        <a href="#">Business Checking</a><a href="#">Merchant Services</a><a href="#">Business Loans</a>
      </div>
      <div class="footer-col">
        <h5>About</h5>
        <a href="#">About Northgate</a><a href="#">Careers</a><a href="#">Newsroom</a>
      </div>
      <div class="footer-col">
        <h5>Support</h5>
        <a href="#">Contact Us</a><a href="#">Locations &amp; ATMs</a><a href="#">Security Center</a>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="landing-section-inner">
        <p>&copy; 2026 Northgate Bank. Member FDIC. Equal Housing Lender.</p>
        <p class="footer-legal">This is a demo application for educational purposes only. Not a real bank.</p>
      </div>
    </div>
  </footer>

</div>

<div id="appScreen">
  <div class="topbar">
    <div class="brand"><img class="brand-logo" src="/logo-placeholder.svg" alt="Northgate Bank"></div>
    <div class="topbar-right">
      <span class="alert-bell" title="Alerts">&#128276;</span>
      <div class="userchip"><div class="avatar" id="topAvatar">GB</div><span id="topUserName">Gbenga</span></div>
      <span class="logout-link" onclick="handleLogout()">Log Off</span>
    </div>
  </div>

  <div class="layout">
    <nav class="sidebar">
      <a href="#dashboard" class="nav-link" data-page="dashboard"><span class="ic">&#8962;</span> Accounts</a>
      <a href="#transfers" class="nav-link" data-page="transfers"><span class="ic">&#8646;</span> Transfers</a>
      <a href="#billpay" class="nav-link" data-page="billpay"><span class="ic">&#128179;</span> Bill Pay</a>
      <a href="#sendmoney" class="nav-link" data-page="sendmoney"><span class="ic">&#128176;</span> Send Money</a>
      <a href="#activity" class="nav-link" data-page="activity"><span class="ic">&#128203;</span> Activity</a>
      <a href="#settings" class="nav-link" data-page="settings"><span class="ic">&#9881;</span> Profile &amp; Settings</a>
    </nav>

    <main class="content">

      <section class="page" id="page-dashboard">
        <h2 class="page-title">Welcome back, <span id="dashName">Gbenga</span></h2>
        <p class="page-sub">Here's what's happening with your accounts today.</p>
        <div class="total-balance-bar" id="totalBalanceBar"></div>
        <div class="account-overview" id="acctCardsWrap"></div>
        <div class="section-title"><h3>Quick actions</h3></div>
        <div class="quick-actions">
          <button class="qa-btn" onclick="go('transfers')"><div class="ic">&#8646;</div><div class="t">Transfer Money</div></button>
          <button class="qa-btn" onclick="go('billpay')"><div class="ic">&#128179;</div><div class="t">Pay a Bill</div></button>
          <button class="qa-btn" onclick="go('sendmoney')"><div class="ic">&#128176;</div><div class="t">Send Money</div></button>
          <button class="qa-btn" onclick="go('activity')"><div class="ic">&#128203;</div><div class="t">View Activity</div></button>
        </div>
        <div class="grid-2" style="margin-top:28px;align-items:start;">
          <div>
            <div class="section-title" style="margin-top:0;"><h3>Recent transactions</h3><span class="link-btn" onclick="go('activity')">View all</span></div>
            <div class="card" style="padding:8px 12px;"><table class="txn-table" id="dashTxnTable"></table></div>
          </div>
          <div>
            <div class="section-title" style="margin-top:0;"><h3>Spending overview</h3></div>
            <div class="card" id="spendingOverviewCard"></div>
          </div>
        </div>
      </section>

      <section class="page" id="page-transfers">
        <h2 class="page-title">Transfer Money</h2>
        <p class="page-sub">Move money between your own accounts, or send to someone else's bank account.</p>
        <div class="card" style="max-width:540px;">
          <div class="form-row">
            <label>Transfer type</label>
            <div class="radio-group">
              <div class="radio-opt selected" data-scope="internal" onclick="selectScope(this)">Between my accounts</div>
              <div class="radio-opt" data-scope="external" onclick="selectScope(this)">To another bank account</div>
            </div>
          </div>

          <div class="form-row"><label>From account</label><select id="xferFrom"></select></div>

          <div id="internalToRow" class="form-row">
            <label>To account</label>
            <select id="xferTo"></select>
          </div>

          <div id="externalToRow" class="form-row hidden">
            <label>Recipient account number</label>
            <input type="text" id="xferExternalAcct" placeholder="e.g. 40012345678" inputmode="numeric">
            <div class="form-hint">Enter the recipient's bank account number (8–17 digits).</div>
          </div>
          <div id="externalRoutingRow" class="form-row hidden">
            <label>Routing number (optional)</label>
            <input type="text" id="xferRouting" placeholder="9-digit routing number" inputmode="numeric">
          </div>

          <div class="form-row"><label>Amount</label><input type="number" id="xferAmount" placeholder="0.00" min="0.01" step="0.01"></div>

          <div class="form-row">
            <label>When</label>
            <div class="radio-group">
              <div class="radio-opt selected" data-when="now" onclick="selectWhen(this)">Send now</div>
              <div class="radio-opt" data-when="later" onclick="selectWhen(this)">Schedule for later</div>
            </div>
          </div>
          <div class="form-row hidden" id="xferDateRow"><label>Date</label><input type="date" id="xferDate"></div>
          <div class="form-row"><label>Memo (optional)</label><input type="text" id="xferMemo" placeholder="e.g. Move to savings"></div>
          <button class="btn btn-primary btn-block" onclick="submitTransfer()">Review Transfer</button>
        </div>
      </section>

      <section class="page" id="page-billpay">
        <h2 class="page-title">Bill Pay</h2>
        <p class="page-sub">Pay existing payees or set up recurring payments.</p>
        <div class="section-title"><h3>Your payees</h3><span class="link-btn" onclick="openModal('addPayeeModal')">+ Add payee</span></div>
        <div class="payee-list" id="payeeList"></div>
        <div class="section-title"><h3>Scheduled &amp; recurring payments</h3></div>
        <div class="payee-list" id="scheduledList"></div>
      </section>

      <section class="page" id="page-sendmoney">
        <h2 class="page-title">Send Money</h2>
        <p class="page-sub">Send money to friends and family using their email or phone number.</p>
        <div class="section-title"><h3>Recipients</h3><span class="link-btn" onclick="openModal('addContactModal')">+ Add recipient</span></div>
        <div class="contact-list" id="contactList"></div>
      </section>

      <section class="page" id="page-activity">
        <h2 class="page-title">Account Activity</h2>
        <p class="page-sub">Full transaction history across your accounts.</p>
        <div class="filter-bar">
          <select id="filterAccount"></select>
          <select id="filterType"><option value="all">All types</option><option value="debit">Money out</option><option value="credit">Money in</option></select>
          <input type="text" id="filterSearch" placeholder="Search merchant or memo...">
        </div>
        <div class="card" style="padding:8px 12px;"><table class="txn-table" id="activityTable"></table></div>
      </section>

      <section class="page" id="page-settings">
        <h2 class="page-title">Settings</h2>
        <p class="page-sub">Manage your profile and notification preferences.</p>
        <div class="card" style="max-width:520px;">
          <div class="form-row"><label>Full name</label><input type="text" id="settingsName"></div>
          <div class="form-row"><label>Email</label><input type="text" id="settingsEmail"></div>
          <button class="btn btn-secondary" onclick="saveSettings()">Save changes</button>
        </div>
        <div class="card" style="max-width:520px;margin-top:16px;">
          <div class="settings-row"><div><div class="t">Login alerts</div><div class="s">Get notified of new sign-ins</div></div><div class="switch on" id="toggleLoginAlerts" onclick="toggleSwitch(this)"></div></div>
          <div class="settings-row"><div><div class="t">Low balance alerts</div><div class="s">Notify when checking drops below $100</div></div><div class="switch on" id="toggleLowBalance" onclick="toggleSwitch(this)"></div></div>
          <div class="settings-row"><div><div class="t">Marketing emails</div><div class="s">Product updates and offers</div></div><div class="switch" id="toggleMarketing" onclick="toggleSwitch(this)"></div></div>
        </div>
      </section>

    </main>
  </div>
</div>

<div class="modal-backdrop" id="modal-addPayeeModal">
  <div class="modal">
    <h3>Add a payee</h3><p class="sub">Add a company or person to pay.</p>
    <div class="form-row"><label>Payee name</label><input type="text" id="newPayeeName" placeholder="e.g. Citywide Electric"></div>
    <div class="form-row"><label>Account / reference number</label><input type="text" id="newPayeeAcct" placeholder="e.g. 900381223"></div>
    <div class="modal-actions"><button class="btn btn-ghost" onclick="closeModal('addPayeeModal')">Cancel</button><button class="btn btn-primary" onclick="addPayee()">Add payee</button></div>
  </div>
</div>

<div class="modal-backdrop" id="modal-payBillModal">
  <div class="modal">
    <h3>Pay <span id="payBillName"></span></h3><p class="sub">Choose amount and date for this payment.</p>
    <div class="form-row"><label>From account</label><select id="payBillFrom"></select></div>
    <div class="form-row"><label>Amount</label><input type="number" id="payBillAmount" min="0.01" step="0.01" placeholder="0.00"></div>
    <div class="form-row"><label>Frequency</label>
      <div class="radio-group">
        <div class="radio-opt selected" data-freq="once" onclick="selectFreq(this)">One time</div>
        <div class="radio-opt" data-freq="monthly" onclick="selectFreq(this)">Monthly</div>
      </div>
    </div>
    <div class="form-row"><label>Date</label><input type="date" id="payBillDate"></div>
    <div class="modal-actions"><button class="btn btn-ghost" onclick="closeModal('payBillModal')">Cancel</button><button class="btn btn-primary" onclick="confirmPayBill()">Confirm payment</button></div>
  </div>
</div>

<div class="modal-backdrop" id="modal-addContactModal">
  <div class="modal">
    <h3>Add a recipient</h3><p class="sub">Send money using an email address or phone number.</p>
    <div class="form-row"><label>Full name</label><input type="text" id="newContactName" placeholder="e.g. Jordan Lee"></div>
    <div class="form-row"><label>Email or phone</label><input type="text" id="newContactHandle" placeholder="e.g. jordan@email.com"></div>
    <div class="modal-actions"><button class="btn btn-ghost" onclick="closeModal('addContactModal')">Cancel</button><button class="btn btn-primary" onclick="addContact()">Add recipient</button></div>
  </div>
</div>

<div class="modal-backdrop" id="modal-sendMoneyModal">
  <div class="modal">
    <h3>Send to <span id="sendMoneyName"></span></h3><p class="sub">Funds typically arrive within minutes.</p>
    <div class="form-row"><label>From account</label><select id="sendMoneyFrom"></select></div>
    <div class="form-row"><label>Amount</label><input type="number" id="sendMoneyAmount" min="0.01" step="0.01" placeholder="0.00"></div>
    <div class="form-row"><label>Note (optional)</label><input type="text" id="sendMoneyNote" placeholder="e.g. Dinner split"></div>
    <div class="modal-actions"><button class="btn btn-ghost" onclick="closeModal('sendMoneyModal')">Cancel</button><button class="btn btn-primary" onclick="confirmSendMoney()">Send money</button></div>
  </div>
</div>

<div class="modal-backdrop" id="modal-confirmXferModal">
  <div class="modal">
    <h3>Confirm transfer</h3><p class="sub" id="confirmXferSummary"></p>
    <div class="modal-actions"><button class="btn btn-ghost" onclick="closeModal('confirmXferModal')">Back</button><button class="btn btn-primary" onclick="finalizeTransfer()">Confirm &amp; send</button></div>
  </div>
</div>

<div class="toast-wrap" id="toastWrap"></div>
`;
