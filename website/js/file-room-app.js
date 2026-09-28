/**
 * THE FILE ROOM — COMPLETE INTERACTIVE WEB APPLICATION ENGINE
 * Pivot Aide Tax · Hyattsville, MD
 * 
 * Supports all 10 Screens:
 * 01 Sign In & FTC Safeguards MFA
 * 02 Your File Dashboard & 6-Step Spine
 * 03 Documents Dropzone, Malware Scan & Vault
 * 04 Regulated IRS Form 8879 Signing & KBA Quiz (Pub 1345)
 * 05 Prepared Return Review & 3 YoY Changes
 * 06 Threaded Messages with Denise R. & Uncle Pat
 * 07 Service Catalogue & Scope Acceptance
 * 08 Invoice Billing & Card Surcharge Checkout
 * 09 Updates Feed & Notification Controls
 * 10 Firm Console & Practice Board Management
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'pivotaide_fileroom_v2';

  // Demo seed state for Marcus Whitfield client file
  const SAMPLE_CLIENT_STATE = {
    currentUser: {
      id: 'client_mw',
      name: 'Marcus & Elena Whitfield',
      initials: 'MW',
      email: 'm.whitfield@example.com',
      role: 'client',
      phone: '•••• 4417'
    },
    authStatus: 'authenticated',
    deviceMode: 'desk',
    activeScreen: 'home',
    returnProgress: 68,
    returnStage: 'in_prep',
    spineSteps: [
      { id: 1, title: 'Engagement letter signed', date: '14 January', status: 'done' },
      { id: 2, title: 'Documents received — 11 of 13', date: 'Last upload 2 September', status: 'done' },
      { id: 3, title: 'Two documents still needed', date: 'Rental 1099-MISC and Q4 mileage log', status: 'now' },
      { id: 4, title: 'Return prepared and reviewed', date: 'Estimated 9–11 September', status: 'pending' },
      { id: 5, title: 'You approve and sign Form 8879', date: 'Takes about four minutes', status: 'pending' },
      { id: 6, title: 'Filed and accepted', date: 'We watch for acceptance and tell you', status: 'pending' }
    ],
    documents: [
      { id: 'd1', name: '1099-MISC — Keystone Property Group', type: 'Rental income', status: 'needed', date: 'Requested 24 Aug', size: 'Pending' },
      { id: 'd2', name: 'Q4 mileage log', type: 'Schedule C log', status: 'needed', date: 'Requested 28 Aug', size: 'Pending' },
      { id: 'd3', name: 'Closing disclosure — 214 Halcyon Row', type: 'Real estate', status: 'review', date: 'Uploaded 2 Sep', size: '2.4 MB', reviewer: 'Denise R.' },
      { id: 'd4', name: 'W-2 — Halstead Medical Group', type: 'Wage income', status: 'received', date: 'Uploaded 28 Aug', size: '184 KB' },
      { id: 'd5', name: '1099-NEC — Whitfield Design Co.', type: 'Contract earnings', status: 'received', date: 'Uploaded 28 Aug', size: '142 KB' },
      { id: 'd6', name: '1098 — Mortgage Interest', type: 'Deductions', status: 'received', date: 'Uploaded 26 Aug', size: '210 KB' },
      { id: 'd7', name: 'Brokerage 1099 Composite', type: 'Dividends & gains', status: 'received', date: 'Uploaded 26 Aug', size: '1.8 MB' },
      { id: 'd8', name: 'Prior year return — TY2025', type: 'Form 1040', status: 'received', date: 'Carried over from file', size: '4.2 MB' }
    ],
    messages: [
      { id: 'm1', sender: 'preparer', name: 'Denise R.', time: '2 Sep, 9:14', text: 'I have the closing disclosure — thank you. One question: was the Halcyon Row property let for the whole year, or was there a vacant stretch after the tenants left in March?' },
      { id: 'm2', sender: 'client', name: 'You', time: '2 Sep, 9:31', text: 'Vacant for six weeks, then relet from mid-May. I can dig out the new lease if that helps.' },
      { id: 'm3', sender: 'preparer', name: 'Denise R.', time: '2 Sep, 9:38', text: 'The lease would help — upload it whenever. Six weeks vacant while it was available to let does not cost you the deduction, so this is good news rather than bad.' },
      { id: 'm4', sender: 'uncle_pat', name: 'Uncle Pat · automatic', time: 'Yesterday, 8:00', text: 'Reminder: your Q3 estimated payment is due 15 September. The voucher is in your documents, and you can pay it from the Billing tab.' }
    ],
    invoice: {
      number: '2026-0418',
      dueDate: '15 Sep 2026',
      subtotal: 1240.00,
      paymentMethod: 'ach',
      cardSurchargeRate: 0.03,
      isPaid: false,
      paidAt: null,
      transactionId: null,
      history: [
        { id: 'inv-prev-1', desc: 'Invoice 2026-0207 · Q1 planning session', date: 'Paid 3 Apr 2026', amount: '$350.00' },
        { id: 'inv-prev-2', desc: 'Invoice 2025-1140 · TY2025 return', date: 'Paid 12 Feb 2026', amount: '$1,105.00' }
      ]
    }
  };

  // Initial Clean State: Starts on empty Login Screen
  const INITIAL_STATE = {
    currentUser: {
      id: '',
      name: '',
      initials: '',
      email: '',
      role: 'guest',
      phone: ''
    },
    pendingEmail: '',
    authStatus: 'signin', // 'signin', 'mfa', 'authenticated'
    deviceMode: 'desk', // Desktop web app portal
    activeScreen: 'signin', // Starts on sign in screen
    returnProgress: 0,
    returnStage: 'new',
    spineSteps: [
      { id: 1, title: 'Engagement letter signed', date: 'Pending intake', status: 'pending' },
      { id: 2, title: 'Documents received', date: '0 uploaded', status: 'pending' },
      { id: 3, title: 'Two documents still needed', date: 'Awaiting upload', status: 'pending' },
      { id: 4, title: 'Return prepared and reviewed', date: 'Pending', status: 'pending' },
      { id: 5, title: 'You approve and sign Form 8879', date: 'Takes about four minutes', status: 'pending' },
      { id: 6, title: 'Filed and accepted', date: 'We watch for acceptance and tell you', status: 'pending' }
    ],
    documents: [],
    kba: {
      step: 1,
      selectedAnswer: null,
      attemptsUsed: 0,
      maxAttempts: 3,
      verified: false,
      failed: false
    },
    signature: {
      signed: false,
      signerName: '',
      spouseSigned: false,
      signatureMethod: 'electronic',
      signatureData: null,
      timestamp: null,
      ipAddress: '73.194.28.102',
      certId: null
    },
    messages: [],
    invoice: {
      number: '2026-0001',
      dueDate: 'Due upon completion',
      subtotal: 0.00,
      paymentMethod: 'ach',
      cardSurchargeRate: 0.03,
      isPaid: false,
      paidAt: null,
      transactionId: null,
      history: []
    },
    notifications: {
      urgent: true,
      stageChanges: true,
      deadlines: true,
      ruleChanges: true,
      marketing: false
    },
    firmQueue: [
      { id: 'fq1', client: 'Okonjo, A.', issue: 'Form 8879 unsigned 6 days', detail: 'Two reminders sent · escalate to a phone call', status: 'warn', actionText: 'Escalate to Call', actionType: 'call' },
      { id: 'fq2', client: 'Brennan Holdings LLC', issue: 'KBA failed 3×', detail: 'Automated switch to wet signature', status: 'warn', actionText: 'Generate Wet Sign Packet', actionType: 'wetsign' },
      { id: 'fq3', client: 'Whitfield, M. & E.', issue: '2 docs outstanding', detail: 'Auto-reminder scheduled', status: 'pending', actionText: 'Send Chaser', actionType: 'chase' },
      { id: 'fq4', client: 'Ferrante, L.', issue: 'IRS Notice CP2000 uploaded', detail: 'Free read promised within 2 business days', status: 'pending', actionText: 'Review Notice', actionType: 'notice' }
    ],
    auditLogs: []
  };

  // Active state initialized from localStorage if present
  let state = loadState();

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.deviceMode = 'desk'; // Always desktop web app portal
        return Object.assign({}, INITIAL_STATE, parsed);
      }
    } catch (e) {
      console.warn('Could not read saved File Room state, using defaults', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_STATE));
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save File Room state', e);
    }
  }

  function resetState() {
    state = JSON.parse(JSON.stringify(INITIAL_STATE));
    // Clear input forms
    const emailEl = document.getElementById('signin-email');
    const passEl = document.getElementById('signin-password');
    if (emailEl) emailEl.value = '';
    if (passEl) passEl.value = '';
    document.querySelectorAll('.mfa-digit-input').forEach(i => i.value = '');
    saveState();
    renderAll();
    showToast('Demo data reset to clean initial login screen', 'info');
  }

  // DOM Elements cache
  let dom = {};

  document.addEventListener('DOMContentLoaded', () => {
    cacheDom();
    bindEvents();
    renderAll();
  });

  function cacheDom() {
    dom.device = document.getElementById('app-device');
    dom.btnPhone = document.getElementById('btn-mode-phone');
    dom.btnDesk = document.getElementById('btn-mode-desk');
    dom.btnReset = document.getElementById('btn-reset-demo');
    dom.screenTabs = document.querySelectorAll('.app-screen-tab');
    dom.sidebarLinks = document.querySelectorAll('.app-sidebar-link');
    dom.mobileTabBtns = document.querySelectorAll('.app-mobile-tab-btn');
    dom.screenPanels = document.querySelectorAll('.app-screen-panel');
    dom.scrollBody = document.getElementById('app-scroll-body');

    // Modals
    dom.internalModal = document.getElementById('app-internal-modal');
    dom.modalTitle = document.getElementById('app-modal-title');
    dom.modalBody = document.getElementById('app-modal-body');
    dom.modalFooter = document.getElementById('app-modal-footer');
    dom.modalCloseBtn = document.getElementById('app-modal-close-btn');

    // Toasts
    dom.toastContainer = document.getElementById('app-toast-container');
  }

  function bindEvents() {
    // Device switch
    if (dom.btnPhone) dom.btnPhone.addEventListener('click', () => setDeviceMode('phone'));
    if (dom.btnDesk) dom.btnDesk.addEventListener('click', () => setDeviceMode('desk'));
    if (dom.btnReset) dom.btnReset.addEventListener('click', resetState);

    // Screen navigation clicks
    dom.screenTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const screen = tab.getAttribute('data-screen');
        if (screen) navigateTo(screen);
      });
    });

    dom.sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const screen = link.getAttribute('data-screen');
        if (screen) navigateTo(screen);
      });
    });

    dom.mobileTabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const screen = btn.getAttribute('data-screen');
        if (screen) navigateTo(screen);
      });
    });

    // Global click delegate for [data-app-go] buttons
    document.addEventListener('click', (e) => {
      const goBtn = e.target.closest('[data-app-go]');
      if (goBtn) {
        e.preventDefault();
        const target = goBtn.getAttribute('data-app-go');
        if (target) navigateTo(target);
      }
    });

    // Internal Modal close
    if (dom.modalCloseBtn) {
      dom.modalCloseBtn.addEventListener('click', closeModal);
    }
    if (dom.internalModal) {
      dom.internalModal.addEventListener('click', (e) => {
        if (e.target === dom.internalModal) closeModal();
      });
    }

    // Attach screen-specific events
    bindScreen01Auth();
    bindScreen03Docs();
    bindScreen04Sign();
    bindScreen05Return();
    bindScreen06Messages();
    bindScreen07Services();
    bindScreen08Pay();
    bindScreen09Updates();
    bindScreen10Firm();
  }

  function setDeviceMode(mode) {
    state.deviceMode = 'desk';
    if (dom.device) {
      dom.device.classList.remove('mode-phone');
      dom.device.classList.add('mode-desk');
    }
    saveState();
  }

  function navigateTo(screenId) {
    state.activeScreen = screenId;

    // Update screen tabs
    dom.screenTabs.forEach(tab => {
      const active = tab.getAttribute('data-screen') === screenId;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    // Update sidebar
    dom.sidebarLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-screen') === screenId);
    });

    // Update mobile tab bar
    dom.mobileTabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-screen') === screenId);
    });

    // Show panel
    dom.screenPanels.forEach(panel => {
      const active = panel.id === `screen-${screenId}`;
      panel.classList.toggle('active', active);
    });

    if (dom.scrollBody) dom.scrollBody.scrollTop = 0;
    saveState();
  }

  function renderAll() {
    setDeviceMode('desk');
    navigateTo(state.activeScreen);
    renderScreen01Auth();
    renderScreen02Dashboard();
    renderScreen03Docs();
    renderScreen04Sign();
    renderScreen05Return();
    renderScreen06Messages();
    renderScreen08Pay();
    renderScreen09Updates();
    renderScreen10Firm();
  }

  /* ============================================================
     SCREEN 01: SIGN IN & MULTI-FACTOR AUTHENTICATION
     ============================================================ */
  function bindScreen01Auth() {
    const signinForm = document.getElementById('signin-step1-form');
    const mfaForm = document.getElementById('signin-step2-form');
    const quickClientBtn = document.getElementById('demo-login-client');
    const quickStaffBtn = document.getElementById('demo-login-staff');
    const mfaInputs = document.querySelectorAll('.mfa-digit-input');

    if (signinForm) {
      signinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailEl = document.getElementById('signin-email');
        state.pendingEmail = (emailEl && emailEl.value.trim()) ? emailEl.value.trim() : 'client@example.com';
        state.authStatus = 'mfa';
        renderScreen01Auth();
        showToast('Password verified. Verification code sent via SMS.', 'info');
      });
    }

    if (quickClientBtn) {
      quickClientBtn.addEventListener('click', () => {
        // Load populated demo client state
        Object.assign(state, JSON.parse(JSON.stringify(SAMPLE_CLIENT_STATE)));
        state.authStatus = 'authenticated';
        state.activeScreen = 'home';
        saveState();
        renderAll();
        showToast('Signed in as Marcus Whitfield (Demo Client)', 'ok');
      });
    }

    if (quickStaffBtn) {
      quickStaffBtn.addEventListener('click', () => {
        state.currentUser = {
          id: 'staff_dr',
          name: 'Denise R.',
          initials: 'DR',
          email: 'denise@pivotaidetax.com',
          role: 'firm',
          phone: 'Staff Office'
        };
        state.authStatus = 'authenticated';
        state.activeScreen = 'firm';
        saveState();
        renderAll();
        showToast('Signed in as Denise R. (Firm Console)', 'ok');
      });
    }

    // Auto advance MFA inputs
    mfaInputs.forEach((inp, idx) => {
      inp.addEventListener('input', (e) => {
        if (inp.value && idx < mfaInputs.length - 1) {
          mfaInputs[idx + 1].focus();
        }
      });
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !inp.value && idx > 0) {
          mfaInputs[idx - 1].focus();
        }
      });
    });

    if (mfaForm) {
      mfaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userEmail = state.pendingEmail || 'client@example.com';
        const userPart = userEmail.split('@')[0];
        const userName = userPart.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Client';
        const userInitials = (userName.split(' ').map(w => w[0]).join('').slice(0, 2) || 'CL').toUpperCase();

        state.currentUser = {
          id: 'client_active',
          name: userName,
          initials: userInitials,
          email: userEmail,
          role: 'client',
          phone: '•••• 4417'
        };
        state.authStatus = 'authenticated';
        saveState();
        renderAll();
        navigateTo('home');
        showToast('Identity verified under FTC Safeguards Rule. Welcome to The File Room!', 'ok');
        logAudit(`User login authenticated for ${userEmail}`);
      });
    }

    // Sign out button
    const signoutBtn = document.getElementById('app-signout-btn');
    if (signoutBtn) {
      signoutBtn.addEventListener('click', () => {
        state.authStatus = 'signin';
        state.activeScreen = 'signin';
        state.currentUser = JSON.parse(JSON.stringify(INITIAL_STATE.currentUser));
        // Clear input values
        const emailEl = document.getElementById('signin-email');
        const passEl = document.getElementById('signin-password');
        if (emailEl) emailEl.value = '';
        if (passEl) passEl.value = '';
        mfaInputs.forEach(i => i.value = '');
        saveState();
        renderAll();
        showToast('Signed out of The File Room', 'info');
      });
    }
  }

  function renderScreen01Auth() {
    const cardStep1 = document.getElementById('card-signin-step1');
    const cardStep2 = document.getElementById('card-signin-step2');
    const cardUserActive = document.getElementById('card-user-active');
    const userInitialsEl = document.getElementById('app-top-avatar');
    const userRoleBadge = document.getElementById('app-user-role-badge');
    const userBadgeContainer = document.getElementById('app-user-badge');
    const guestBadgeContainer = document.getElementById('app-guest-badge');

    const isAuthenticated = state.authStatus === 'authenticated';

    if (userBadgeContainer) userBadgeContainer.style.display = isAuthenticated ? 'flex' : 'none';
    if (guestBadgeContainer) guestBadgeContainer.style.display = isAuthenticated ? 'none' : 'block';

    if (userInitialsEl) userInitialsEl.textContent = state.currentUser.initials || '??';
    if (userRoleBadge) {
      userRoleBadge.textContent = state.currentUser.role === 'firm' ? 'Staff' : 'Client';
      userRoleBadge.className = `app-chip ${state.currentUser.role === 'firm' ? 'warn' : 'gold'}`;
    }

    if (cardStep1 && cardStep2 && cardUserActive) {
      if (state.authStatus === 'signin') {
        cardStep1.style.display = 'block';
        cardStep2.style.display = 'none';
        cardUserActive.style.display = 'none';
      } else if (state.authStatus === 'mfa') {
        cardStep1.style.display = 'none';
        cardStep2.style.display = 'block';
        cardUserActive.style.display = 'none';
      } else {
        cardStep1.style.display = 'none';
        cardStep2.style.display = 'none';
        cardUserActive.style.display = 'block';
        const activeName = document.getElementById('active-user-name');
        if (activeName) activeName.textContent = state.currentUser.name;
      }
    }
  }

  /* ============================================================
     SCREEN 02: YOUR FILE DASHBOARD
     ============================================================ */
  function renderScreen02Dashboard() {
    const meterFill = document.getElementById('home-progress-fill');
    const meterPct = document.getElementById('home-progress-pct');
    const spineContainer = document.getElementById('home-spine-steps');
    const unreadCountBadge = document.getElementById('home-unread-count');
    const invoiceDueBadge = document.getElementById('home-invoice-due');

    if (meterFill) meterFill.style.width = `${state.returnProgress}%`;
    if (meterPct) meterPct.textContent = `${state.returnProgress}%`;

    if (unreadCountBadge) unreadCountBadge.textContent = state.messages.length > 0 ? '1' : '0';
    if (invoiceDueBadge) invoiceDueBadge.textContent = state.invoice.isPaid ? '$0.00 (Paid)' : `$${state.invoice.subtotal.toFixed(2)}`;

    // Render spine steps
    if (spineContainer) {
      spineContainer.innerHTML = state.spineSteps.map(step => `
        <div class="spine-item ${step.status}">
          <span class="spine-badge"></span>
          <div class="spine-content">
            <div class="spine-title">${step.title}</div>
            <div class="spine-sub">${step.date}</div>
          </div>
        </div>
      `).join('');
    }
  }

  /* ============================================================
     SCREEN 03: DOCUMENTS DROPZONE & VAULT
     ============================================================ */
  function bindScreen03Docs() {
    const dropzone = document.getElementById('docs-dropzone');
    const fileInput = document.getElementById('docs-file-input');
    const cameraBtn = document.getElementById('btn-camera-scan');

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          simulateUploadFile(e.dataTransfer.files[0].name, `${(e.dataTransfer.files[0].size / 1024).toFixed(0)} KB`);
        }
      });
      fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files.length > 0) {
          simulateUploadFile(fileInput.files[0].name, `${(fileInput.files[0].size / 1024).toFixed(0)} KB`);
          fileInput.value = '';
        }
      });
    }

    if (cameraBtn) {
      cameraBtn.addEventListener('click', () => {
        openModal(
          'Mobile Document Camera Scanner',
          `
          <div style="text-align:center;padding:12px 0">
            <div style="width:100%;height:220px;background:#07202E;border-radius:6px;display:grid;place-items:center;position:relative;overflow:hidden">
              <div style="border:2px dashed #EAE42F;width:80%;height:75%;border-radius:4px;display:grid;place-items:center;color:#fff">
                <span style="font-family:var(--f-mono);font-size:.75rem;letter-spacing:.1em;color:var(--gold)">[ ALIGN W-2 OR 1099 HERE ]</span>
              </div>
              <div style="position:absolute;bottom:10px;color:#9FBECF;font-size:.72rem">Auto-edge detection active · High dynamic range</div>
            </div>
            <p style="font-size:.84rem;color:var(--ink-2);margin-top:14px">Hold still. The camera detects edges, deskews perspective, and strips background noise automatically.</p>
          </div>
          `,
          `
          <button class="btn btn-o sm" onclick="window.closeAppModal()">Cancel</button>
          <button class="btn btn-p sm" id="btn-snap-photo">Snap & Upload</button>
          `
        );
        setTimeout(() => {
          const snapBtn = document.getElementById('btn-snap-photo');
          if (snapBtn) {
            snapBtn.addEventListener('click', () => {
              closeModal();
              simulateUploadFile('W-2 Camera Scan_2026.pdf', '1.2 MB');
            });
          }
        }, 100);
      });
    }
  }

  function simulateUploadFile(fileName, sizeStr) {
    showToast(`Uploading ${fileName}... Scanning for malware...`, 'info');

    setTimeout(() => {
      // Check if this matches a needed document
      let resolvedNeeded = false;
      state.documents.forEach(doc => {
        if (doc.status === 'needed' && !resolvedNeeded) {
          doc.status = 'review';
          doc.size = sizeStr;
          doc.date = 'Uploaded Today';
          doc.reviewer = 'Denise R.';
          resolvedNeeded = true;
        }
      });

      if (!resolvedNeeded) {
        state.documents.unshift({
          id: `doc_${Date.now()}`,
          name: fileName,
          type: 'Client Upload',
          status: 'review',
          date: 'Uploaded Today',
          size: sizeStr,
          reviewer: 'Denise R.'
        });
      }

      // Check if needed items remain
      const remainingNeeded = state.documents.filter(d => d.status === 'needed').length;
      if (remainingNeeded === 0) {
        state.returnProgress = 85;
        state.spineSteps[2].status = 'done';
        state.spineSteps[3].status = 'now';
      }

      saveState();
      renderScreen02Dashboard();
      renderScreen03Docs();
      showToast(`Scan complete: ${fileName} is clean and encrypted (AES-256). Staff notified.`, 'ok');
      logAudit(`Document uploaded: ${fileName} (${sizeStr})`);
    }, 1200);
  }

  function renderScreen03Docs() {
    const listNeeded = document.getElementById('docs-list-needed');
    const listReview = document.getElementById('docs-list-review');
    const listReceived = document.getElementById('docs-list-received');
    const countNeeded = document.getElementById('docs-count-needed');

    const neededDocs = state.documents.filter(d => d.status === 'needed');
    const reviewDocs = state.documents.filter(d => d.status === 'review');
    const receivedDocs = state.documents.filter(d => d.status === 'received');

    if (countNeeded) countNeeded.textContent = neededDocs.length;

    if (listNeeded) {
      if (neededDocs.length === 0) {
        listNeeded.innerHTML = `<div class="doc-row-item"><div class="info-cell" style="color:var(--ok)">✓ All requested documents received!</div></div>`;
      } else {
        listNeeded.innerHTML = neededDocs.map(doc => `
          <div class="doc-row-item">
            <div class="icon-cell" style="color:var(--warn)">⚠</div>
            <div class="info-cell">
              <div class="doc-name">${doc.name}</div>
              <div class="doc-sub">${doc.type} · ${doc.date}</div>
            </div>
            <button class="btn btn-o sm" onclick="window.uploadMissingDoc('${doc.id}')">Upload</button>
          </div>
        `).join('');
      }
    }

    if (listReview) {
      listReview.innerHTML = reviewDocs.map(doc => `
        <div class="doc-row-item">
          <div class="icon-cell" style="color:var(--blue)">◯</div>
          <div class="info-cell">
            <div class="doc-name">${doc.name}</div>
            <div class="doc-sub">${doc.date} · ${doc.reviewer ? doc.reviewer + ' is reviewing' : doc.size}</div>
          </div>
          <span class="app-chip">In review</span>
        </div>
      `).join('');
    }

    if (listReceived) {
      listReceived.innerHTML = receivedDocs.map(doc => `
        <div class="doc-row-item">
          <div class="icon-cell" style="color:var(--ok)">✓</div>
          <div class="info-cell">
            <div class="doc-name">${doc.name}</div>
            <div class="doc-sub">${doc.type} · ${doc.date} · ${doc.size}</div>
          </div>
          <div class="actions-cell">
            <button class="btn btn-o sm" onclick="window.previewDoc('${doc.name}')">View</button>
            <span class="app-chip ok">Received</span>
          </div>
        </div>
      `).join('');
    }
  }

  // Exposed helper for missing doc upload button
  window.uploadMissingDoc = function (docId) {
    const doc = state.documents.find(d => d.id === docId);
    if (!doc) return;
    simulateUploadFile(`${doc.name.split('—')[0].trim()}_Signed.pdf`, '420 KB');
  };

  // Exposed helper for doc preview
  window.previewDoc = function (docName) {
    openModal(
      docName,
      `
      <div style="border:1px solid var(--line);border-radius:4px;padding:24px;background:#fff;font-family:var(--f-mono);font-size:.8rem;line-height:1.6">
        <div style="display:flex;justify-content:space-between;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:16px">
          <b>INTERNAL REVENUE SERVICE ARCHIVE</b>
          <span>ENCRYPTED VAULT RECORD</span>
        </div>
        <div style="margin-bottom:12px">DOCUMENT: <b>${docName}</b></div>
        <div style="margin-bottom:12px">TAXPAYER: <b>WHITFIELD, MARCUS & ELENA</b> (SSN: •••-••-4417)</div>
        <div style="margin-bottom:12px">STATUS: <b>VERIFIED & ACCEPTED BY PIVOT AIDE PREPARATION TEAM</b></div>
        <div style="background:var(--surface-2);padding:12px;border-radius:4px;margin-top:16px">
          SHA-256 HASH: a8f4e29b710c55d048e9182312bba401948fe2c7<br>
          STORAGE TIER: WORM Tamper-Proof 3-Year Safeguards Archive<br>
          ACCESS LOG: Checked by ${state.currentUser.name} on ${new Date().toLocaleDateString()}
        </div>
      </div>
      `,
      `
      <button class="btn btn-o sm" onclick="window.closeAppModal()">Close</button>
      <button class="btn btn-p sm" onclick="window.downloadSimulatedDoc('${docName}')">Download PDF</button>
      `
    );
    logAudit(`Document preview opened: ${docName}`);
  };

  window.downloadSimulatedDoc = function (docName) {
    showToast(`Downloading secure PDF: ${docName}`, 'ok');
    logAudit(`Document downloaded: ${docName}`);
  };

  /* ============================================================
     SCREEN 04: FORM 8879 REGULATED E-SIGN & KBA QUIZ
     ============================================================ */
  let sigCanvas = null;
  let isDrawing = false;

  function bindScreen04Sign() {
    const readBtn = document.getElementById('btn-read-8879');
    const kbaRadios = document.querySelectorAll('.kba-radio-label');
    const kbaSubmitBtn = document.getElementById('btn-kba-submit');
    const confirmSigBtn = document.getElementById('btn-confirm-sign');
    const clearCanvasBtn = document.getElementById('btn-clear-canvas');

    if (readBtn) {
      readBtn.addEventListener('click', openForm8879Modal);
    }

    kbaRadios.forEach(label => {
      label.addEventListener('click', () => {
        kbaRadios.forEach(l => l.classList.remove('selected'));
        label.classList.add('selected');
        state.kba.selectedAnswer = label.getAttribute('data-val');
      });
    });

    if (kbaSubmitBtn) {
      kbaSubmitBtn.addEventListener('click', handleKbaSubmit);
    }

    // Canvas Signature Setup
    sigCanvas = document.getElementById('sig-drawing-canvas');
    if (sigCanvas) {
      const ctx = sigCanvas.getContext('2d');
      setupSignatureCanvas(sigCanvas, ctx);

      if (clearCanvasBtn) {
        clearCanvasBtn.addEventListener('click', () => {
          ctx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
          drawCanvasGuide(ctx, sigCanvas.width, sigCanvas.height);
          state.signature.signatureData = null;
        });
      }
    }

    if (confirmSigBtn) {
      confirmSigBtn.addEventListener('click', handleSignSubmission);
    }
  }

  function setupSignatureCanvas(canvas, ctx) {
    // Set actual resolution
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawCanvasGuide(ctx, canvas.width, canvas.height);

    function getCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function startDraw(e) {
      e.preventDefault();
      isDrawing = true;
      const pos = getCoords(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#07202E';
    }

    function moveDraw(e) {
      if (!isDrawing) return;
      e.preventDefault();
      const pos = getCoords(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      state.signature.signatureData = 'captured_strokes';
    }

    function stopDraw() {
      isDrawing = false;
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', moveDraw);
    window.addEventListener('mouseup', stopDraw);

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', moveDraw, { passive: false });
    window.addEventListener('touchend', stopDraw);
  }

  function drawCanvasGuide(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#E5EDF3';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, h - 30);
    ctx.lineTo(w - 20, h - 30);
    ctx.stroke();

    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#9FBECF';
    ctx.fillText('✕ SIGN ON THE LINE ABOVE', 20, h - 14);
  }

  function handleKbaSubmit() {
    if (!state.kba.selectedAnswer) {
      showToast('Please select one of the identity verification answers.', 'warn');
      return;
    }

    state.kba.step++;
    if (state.kba.step <= 3) {
      renderScreen04Sign();
      showToast(`Identity question ${state.kba.step} of 3 loaded`, 'info');
    } else {
      state.kba.verified = true;
      renderScreen04Sign();
      showToast('Knowledge-Based Authentication (KBA) passed! Please provide your signature.', 'ok');
      logAudit('KBA Identity verification passed under IRS Pub 1345');
    }
  }

  function handleSignSubmission() {
    if (!state.kba.verified) {
      showToast('You must complete the identity verification step first.', 'warn');
      return;
    }

    const typeInput = document.getElementById('sig-typed-input');
    const hasTyped = typeInput && typeInput.value.trim().length > 0;
    const hasDrawn = state.signature.signatureData !== null;

    if (!hasTyped && !hasDrawn) {
      showToast('Please sign on the canvas or type your legal name.', 'warn');
      return;
    }

    state.signature.signed = true;
    state.signature.timestamp = new Date().toISOString();
    state.signature.certId = 'CERT-8879-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    state.returnStage = 'signed';
    state.returnProgress = 95;
    state.spineSteps[4].status = 'done';
    state.spineSteps[5].status = 'now';

    saveState();
    renderScreen02Dashboard();
    renderScreen04Sign();

    // Show Evidence Certificate Modal
    openModal(
      'IRS Form 8879 Electronic Signature Evidence Record',
      `
      <div style="background:var(--ok-bg);border:1px solid var(--ok);border-radius:6px;padding:16px;margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:1.4rem;color:var(--ok)">✓</span>
          <div>
            <b style="color:var(--ok)">Form 8879 Authorized & Secured</b>
            <div style="font-size:.78rem;color:var(--ink)">Tamper-proof evidence record created under IRS Publication 1345.</div>
          </div>
        </div>
      </div>

      <div style="font-family:var(--f-mono);font-size:.78rem;background:#fff;border:1px solid var(--line);border-radius:4px;padding:16px;line-height:1.6">
        <div style="border-bottom:1px solid var(--line-2);padding-bottom:8px;margin-bottom:10px">
          <b>TRANSACTION EVIDENCE ID:</b> ${state.signature.certId}
        </div>
        <div>SIGNER: <b>${state.signature.signerName}</b></div>
        <div>DATE/TIME: <b>${new Date().toLocaleString()} (UTC-4)</b></div>
        <div>IP ADDRESS: <b>${state.signature.ipAddress}</b> (ISP: Comcast Cable)</div>
        <div>AUTHENTICATION: <b>KBA Passed (Lender Record 3-of-3)</b></div>
        <div>HASH VERIFICATION: <b>SHA-256 (Tamper-evident WORM Storage)</b></div>
        <div>RETENTION MANDATE: <b>3 Years through 15 Oct 2029</b></div>
      </div>
      <p class="legal" style="margin-top:14px">Your return is now in the queue for immediate transmission to the IRS. Denise R. has been notified.</p>
      `,
      `
      <button class="btn btn-p sm" onclick="window.closeAppModal(); window.navigateToScreen('return')">View Prepared Return &rarr;</button>
      `
    );

    logAudit(`Form 8879 e-signed by ${state.signature.signerName}. Cert: ${state.signature.certId}`);
  }

  function renderScreen04Sign() {
    const kbaCard = document.getElementById('card-kba-step');
    const sigCard = document.getElementById('card-signature-pad');
    const kbaProgressTag = document.getElementById('kba-step-tag');
    const kbaQuestionText = document.getElementById('kba-question-text');
    const signedBanner = document.getElementById('card-signed-success');

    if (state.signature.signed) {
      if (kbaCard) kbaCard.style.display = 'none';
      if (sigCard) sigCard.style.display = 'none';
      if (signedBanner) signedBanner.style.display = 'block';
      return;
    }

    if (signedBanner) signedBanner.style.display = 'none';

    if (state.kba.verified) {
      if (kbaCard) kbaCard.style.display = 'none';
      if (sigCard) sigCard.style.display = 'block';
    } else {
      if (kbaCard) kbaCard.style.display = 'block';
      if (sigCard) sigCard.style.display = 'none';

      if (kbaProgressTag) kbaProgressTag.textContent = `Identity check · step ${state.kba.step} of 3`;

      const questions = [
        'Which of these lenders held a mortgage in your name?',
        'In which year did you purchase a vehicle registered in Prince George\'s County?',
        'Which of the following street names have you resided at in the past 10 years?'
      ];
      if (kbaQuestionText) kbaQuestionText.textContent = questions[state.kba.step - 1];
    }
  }

  function openForm8879Modal() {
    openModal(
      'IRS Form 8879 (TY 2026) Preview',
      `
      <div style="background:#fff;border:1px solid var(--line);border-radius:4px;padding:20px;font-family:var(--f-mono);font-size:.76rem;line-height:1.5">
        <div style="display:flex;justify-content:space-between;border-bottom:2px solid #000;padding-bottom:12px;margin-bottom:14px">
          <div>
            <b style="font-size:1.1rem">Form 8879</b><br>
            Department of the Treasury<br>Internal Revenue Service
          </div>
          <div style="text-align:center">
            <b style="font-size:1.05rem">IRS e-file Signature Authorization</b><br>
            For Form 1040, 1040-SR, and 1040-NR<br>
            For calendar year 2026
          </div>
          <div style="text-align:right">
            OMB No. 1545-0074<br>
            <b>TY 2026</b>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:2fr 1fr;gap:12px;margin-bottom:12px;border-bottom:1px solid var(--line-2);padding-bottom:8px">
          <div>Taxpayer name: <b>WHITFIELD, MARCUS</b></div>
          <div>Social security number: <b>•••-••-4417</b></div>
        </div>
        <div style="display:grid;grid-template-columns:2fr 1fr;gap:12px;margin-bottom:14px;border-bottom:1px solid var(--line-2);padding-bottom:8px">
          <div>Spouse name: <b>WHITFIELD, ELENA</b></div>
          <div>Social security number: <b>•••-••-8912</b></div>
        </div>

        <div style="background:var(--surface-2);padding:10px 14px;border-radius:4px;margin-bottom:14px">
          <b>Part I — Tax Return Information (Whole dollars only)</b>
          <div style="display:flex;justify-content:space-between;margin-top:6px">
            <span>1. Adjusted gross income (Form 1040, line 11)</span>
            <b>$214,806</b>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:4px">
            <span>2. Total tax (Form 1040, line 24)</span>
            <b>$30,491</b>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:4px">
            <span>3. Federal income tax withheld (Form 1040, line 25d)</span>
            <b>$33,909</b>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:4px;color:var(--ok)">
            <span>4. Refund amount to be direct deposited (line 35a)</span>
            <b>$3,418</b>
          </div>
        </div>

        <div style="font-size:.7rem;color:var(--ink-2);line-height:1.4">
          <b>Part II — Taxpayer Declaration and Signature Authorization:</b> Under penalties of perjury, I declare that I have examined a copy of my 2026 electronic individual income tax return and accompanying schedules, and to the best of my knowledge and belief, it is true, correct, and accurately lists all amounts.
        </div>
      </div>
      `,
      `
      <button class="btn btn-o sm" onclick="window.closeAppModal()">Close Preview</button>
      <button class="btn btn-p sm" onclick="window.closeAppModal(); window.navigateToScreen('sign')">Proceed to Identity Check &rarr;</button>
      `
    );
  }

  /* ============================================================
     SCREEN 05: PREPARED RETURN & 3 CHANGES
     ============================================================ */
  function bindScreen05Return() {
    const downloadPdfBtn = document.getElementById('btn-download-return-pdf');
    if (downloadPdfBtn) {
      downloadPdfBtn.addEventListener('click', () => {
        showToast('Generating 1040 Return Client Package PDF (38 pages)...', 'info');
        setTimeout(() => {
          showToast('Return Package TY2026 downloaded successfully.', 'ok');
          logAudit('Prepared Return PDF downloaded by taxpayer');
        }, 1200);
      });
    }
  }

  function renderScreen05Return() {
    // Return figures are populated
  }

  /* ============================================================
     SCREEN 06: THREADED MESSAGING
     ============================================================ */
  function bindScreen06Messages() {
    const msgInput = document.getElementById('chat-msg-input');
    const sendBtn = document.getElementById('btn-send-msg');
    const promptPills = document.querySelectorAll('.quick-prompt-pill');

    if (sendBtn && msgInput) {
      sendBtn.addEventListener('click', () => {
        const text = msgInput.value.trim();
        if (text) {
          sendClientMessage(text);
          msgInput.value = '';
        }
      });
      msgInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const text = msgInput.value.trim();
          if (text) {
            sendClientMessage(text);
            msgInput.value = '';
          }
        }
      });
    }

    promptPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const question = pill.textContent.trim();
        sendClientMessage(question);
      });
    });
  }

  function sendClientMessage(text) {
    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'client',
      name: 'You',
      time: 'Just now',
      text: text
    };
    state.messages.push(newMsg);
    renderScreen06Messages();

    // Auto reply logic
    setTimeout(() => {
      let replyText = 'Thanks for reaching out! Denise will review this and reply within one business day.';
      let senderType = 'preparer';
      let senderName = 'Denise R.';

      const lower = text.toLowerCase();
      if (lower.includes('owe') || lower.includes('balance') || lower.includes('refund')) {
        replyText = 'Federal refund is $3,418.00; Maryland state balance due is $612.00. Payment voucher is available on the Billing tab.';
      } else if (lower.includes('filed') || lower.includes('when')) {
        replyText = 'As soon as both signatures on Form 8879 are completed, we transmit to the IRS within 24 hours. The IRS typically confirms acceptance in 24–48 hours.';
      } else if (lower.includes('letter') || lower.includes('notice')) {
        replyText = 'You can upload a photo of the notice directly using the "Free Notice Read" button in Services, and Uncle Pat will review what it actually says.';
        senderType = 'uncle_pat';
        senderName = 'Uncle Pat · automatic';
      } else if (lower.includes('spouse')) {
        replyText = 'Yes, married filing jointly returns require both spouses to review and sign Form 8879. Elena can sign directly via the link emailed to her.';
      } else if (lower.includes('call') || lower.includes('book')) {
        replyText = 'You can book a direct strategy or review call anytime from the Appointments tab on pivotaidetax.com.';
      }

      state.messages.push({
        id: `msg_rep_${Date.now()}`,
        sender: senderType,
        name: senderName,
        time: 'Just now',
        text: replyText
      });

      saveState();
      renderScreen06Messages();
      showToast(`New message from ${senderName}`, 'info');
    }, 900);
  }

  function renderScreen06Messages() {
    const chatContainer = document.getElementById('chat-messages-list');
    if (!chatContainer) return;

    chatContainer.innerHTML = state.messages.map(m => {
      const isMe = m.sender === 'client';
      const isPat = m.sender === 'uncle_pat';
      let avatarContent = isMe ? 'MW' : isPat ? `<img src="assets/brand/uncle-pat-avatar.svg" alt="Uncle Pat" style="width:100%;height:100%;border-radius:50%;object-fit:cover">` : 'DR';

      return `
        <div class="chat-message-bubble ${isMe ? 'me' : ''} ${isPat ? 'pat' : ''}">
          <span class="msg-avatar">${avatarContent}</span>
          <div class="msg-content-box">
            <div class="msg-header-meta">${m.name} · ${m.time}</div>
            <div class="msg-body-text">${m.text}</div>
          </div>
        </div>
      `;
    }).join('');

    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  /* ============================================================
     SCREEN 07: SERVICES CATALOGUE & SCOPE
     ============================================================ */
  function bindScreen07Services() {
    const addButtons = document.querySelectorAll('.btn-add-service');
    addButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-service-title') || 'Tax Advisory Service';
        const price = btn.getAttribute('data-service-price') || 'Quoted';
        openScopeAcceptanceModal(title, price);
      });
    });
  }

  function openScopeAcceptanceModal(title, price) {
    openModal(
      `Add to Your File: ${title}`,
      `
      <div style="border-left:3px solid var(--gold);padding-left:14px;margin-bottom:16px">
        <h4 style="font-size:1.1rem;color:var(--ink)">${title}</h4>
        <div style="font-family:var(--f-mono);font-size:.88rem;color:var(--blue);margin-top:4px">Pricing: ${price}</div>
      </div>
      <p style="font-size:.86rem;color:var(--ink-2);line-height:1.6">
        Pivot Aide Tax works strictly on clear scopes agreed in writing. Adding this service generates a scoped engagement addendum attached directly to your file.
      </p>
      <div class="app-card" style="background:var(--surface-2);margin-top:14px;font-size:.82rem">
        <b>What is included:</b>
        <ul style="margin:6px 0 0;padding-left:18px;color:var(--ink-2)">
          <li>Assigned licensed Circular 230 practitioner</li>
          <li>Encrypted document room & direct messaging</li>
          <li>Representation coverage and IRS notice review</li>
        </ul>
      </div>
      `,
      `
      <button class="btn btn-o sm" onclick="window.closeAppModal()">Cancel</button>
      <button class="btn btn-p sm" onclick="window.confirmServiceAddition('${title}')">Accept Scope &amp; Add &rarr;</button>
      `
    );
  }

  window.confirmServiceAddition = function (title) {
    closeModal();
    showToast(`Service "${title}" added to your active file. Engagement letter sent for review.`, 'ok');
    logAudit(`Service scope accepted by client: ${title}`);
  };

  /* ============================================================
     SCREEN 08: INVOICE BILLING & CARD SURCHARGE
     ============================================================ */
  function bindScreen08Pay() {
    const achTab = document.getElementById('seg-pay-ach');
    const cardTab = document.getElementById('seg-pay-card');
    const paySubmitBtn = document.getElementById('btn-execute-pay');

    if (achTab && cardTab) {
      achTab.addEventListener('click', () => {
        achTab.classList.add('active');
        cardTab.classList.remove('active');
        state.invoice.paymentMethod = 'ach';
        renderScreen08Pay();
      });

      cardTab.addEventListener('click', () => {
        cardTab.classList.add('active');
        achTab.classList.remove('active');
        state.invoice.paymentMethod = 'card';
        renderScreen08Pay();
      });
    }

    if (paySubmitBtn) {
      paySubmitBtn.addEventListener('click', executePayment);
    }
  }

  function renderScreen08Pay() {
    const feeRow = document.getElementById('billing-fee-row');
    const feeAmountEl = document.getElementById('billing-fee-amount');
    const totalAmountEl = document.getElementById('billing-total-amount');
    const executePayBtn = document.getElementById('btn-execute-pay');
    const paymentBox = document.getElementById('billing-payment-card');
    const paidNotice = document.getElementById('billing-paid-banner');

    if (state.invoice.isPaid) {
      if (paymentBox) paymentBox.style.display = 'none';
      if (paidNotice) paidNotice.style.display = 'block';
      return;
    }

    if (paymentBox) paymentBox.style.display = 'block';
    if (paidNotice) paidNotice.style.display = 'none';

    const isCard = state.invoice.paymentMethod === 'card';
    const subtotal = state.invoice.subtotal;
    const fee = isCard ? subtotal * state.invoice.cardSurchargeRate : 0;
    const finalTotal = subtotal + fee;

    if (feeRow) feeRow.style.display = isCard ? 'flex' : 'none';
    if (feeAmountEl) feeAmountEl.textContent = `$${fee.toFixed(2)}`;
    if (totalAmountEl) totalAmountEl.textContent = `$${finalTotal.toFixed(2)}`;
    if (executePayBtn) executePayBtn.textContent = `Pay $${finalTotal.toFixed(2)}`;
  }

  function executePayment() {
    const isCard = state.invoice.paymentMethod === 'card';
    const fee = isCard ? state.invoice.subtotal * 0.03 : 0;
    const total = state.invoice.subtotal + fee;

    showToast(`Processing ${isCard ? 'Card' : 'Bank Transfer (ACH)'} payment for $${total.toFixed(2)}...`, 'info');

    setTimeout(() => {
      state.invoice.isPaid = true;
      state.invoice.paidAt = new Date().toLocaleDateString();
      state.invoice.transactionId = 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();

      state.invoice.history.unshift({
        id: `inv-${Date.now()}`,
        desc: `Invoice 2026-0418 · TY2026 Tax Preparation (${isCard ? 'Card' : 'ACH'})`,
        date: `Paid ${state.invoice.paidAt}`,
        amount: `$${total.toFixed(2)}`
      });

      saveState();
      renderScreen02Dashboard();
      renderScreen08Pay();

      openModal(
        'Payment Receipt & Confirmation',
        `
        <div style="text-align:center;padding:12px 0">
          <div style="width:48px;height:48px;border-radius:50%;background:var(--ok-bg);color:var(--ok);display:grid;place-items:center;margin:0 auto 12px;font-size:1.6rem">✓</div>
          <h3 style="font-size:1.3rem;color:var(--ink)">Payment Confirmed: $${total.toFixed(2)}</h3>
          <p style="font-size:.85rem;color:var(--ink-2);margin-top:4px">Invoice #2026-0418 marked PAID in full.</p>
        </div>

        <div style="font-family:var(--f-mono);font-size:.76rem;background:var(--surface-2);border-radius:4px;padding:14px;margin-top:14px;line-height:1.6">
          <div>TRANSACTION ID: <b>${state.invoice.transactionId}</b></div>
          <div>DATE: <b>${new Date().toLocaleString()}</b></div>
          <div>METHOD: <b>${isCard ? 'Visa •••• 1048' : 'Cardinal Trust Checking •••• 8842'}</b></div>
          <div>PROCESSOR: <b>CPACharge Hosted Vault (SAQ-A Compliant)</b></div>
          <div>BALANCE REMAINING: <b>$0.00</b></div>
        </div>
        `,
        `
        <button class="btn btn-p sm" onclick="window.closeAppModal()">Close Receipt</button>
        `
      );

      logAudit(`Invoice #2026-0418 paid: $${total.toFixed(2)} via ${isCard ? 'Card' : 'ACH'}`);
    }, 1200);
  }

  /* ============================================================
     SCREEN 09: UPDATES & NOTIFICATION CONTROLS
     ============================================================ */
  function bindScreen09Updates() {
    const checkboxes = document.querySelectorAll('.notif-toggle-check');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        showToast('Notification preferences saved to your profile.', 'info');
      });
    });
  }

  function renderScreen09Updates() {
    // Updated timeline is static and dynamically responsive
  }

  /* ============================================================
     SCREEN 10: FIRM VIEW PRACTICE MANAGEMENT
     ============================================================ */
  function bindScreen10Firm() {
    const queueList = document.getElementById('firm-queue-list');
    const stageSelect = document.getElementById('firm-stage-selector');

    if (queueList) {
      queueList.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('[data-firm-action]');
        if (actionBtn) {
          const action = actionBtn.getAttribute('data-firm-action');
          const itemId = actionBtn.getAttribute('data-item-id');
          handleFirmAction(action, itemId);
        }
      });
    }

    if (stageSelect) {
      stageSelect.addEventListener('change', () => {
        const newStage = stageSelect.value;
        state.returnStage = newStage;
        if (newStage === 'in_prep') state.returnProgress = 68;
        if (newStage === 'ready_to_sign') state.returnProgress = 85;
        if (newStage === 'signed') state.returnProgress = 95;
        if (newStage === 'accepted') state.returnProgress = 100;

        saveState();
        renderScreen02Dashboard();
        showToast(`Client return stage updated to: ${stageSelect.options[stageSelect.selectedIndex].text}`, 'ok');
        logAudit(`Staff updated Whitfield return status to ${newStage}`);
      });
    }
  }

  function handleFirmAction(action, itemId) {
    const item = state.firmQueue.find(q => q.id === itemId);
    if (!item) return;

    if (action === 'call') {
      item.detail = 'Escalated to phone call by staff · Outreach in progress';
      item.actionText = 'Call Logged';
      showToast(`Phone escalation logged for ${item.client}.`, 'ok');
    } else if (action === 'wetsign') {
      item.detail = 'Wet signature packet mailed via USPS Priority Tracked';
      item.actionText = 'Packet Sent';
      showToast(`Wet signature packet generated for ${item.client}.`, 'ok');
    } else if (action === 'chase') {
      item.detail = 'Urgent reminder SMS and email sent to client';
      item.actionText = 'Chaser Sent';
      showToast(`Automated chaser sent to ${item.client}.`, 'ok');
    } else if (action === 'notice') {
      openModal(
        `Notice Triage: ${item.client}`,
        `
        <div style="font-family:var(--f-mono);font-size:.8rem;line-height:1.6">
          <div style="margin-bottom:10px">NOTICE: <b>IRS CP2000 (TY 2024 Proposed Assessment)</b></div>
          <div style="margin-bottom:10px">DISCREPANCY: <b>Unreported 1099-B Crypto Trading Gain</b></div>
          <div style="margin-bottom:10px">PROPOSED DEFICIENCY: <b>$4,290.00</b></div>
          <div style="background:var(--surface-2);padding:12px;border-radius:4px;margin-top:12px">
            <b>Staff Assessment (Denise R.):</b> Basis was omitted on Schedule D. Filing Form 1040-X with reconstructed 8949 will reduce deficiency to $180. Response deadline: 28 Sep 2026.
          </div>
        </div>
        `,
        `
        <button class="btn btn-o sm" onclick="window.closeAppModal()">Close</button>
        <button class="btn btn-p sm" onclick="window.closeAppModal(); window.showAppToast('Notice response draft generated for Ferrante, L.', 'ok')">Generate Client Brief &rarr;</button>
        `
      );
    }

    saveState();
    renderScreen10Firm();
    logAudit(`Firm queue action taken: ${action} on ${item.client}`);
  }

  function renderScreen10Firm() {
    const queueList = document.getElementById('firm-queue-list');
    const auditTable = document.getElementById('firm-audit-logs');

    if (queueList) {
      queueList.innerHTML = state.firmQueue.map(item => `
        <div class="firm-priority-item">
          <span class="status-icon" style="color:var(--${item.status === 'warn' ? 'warn' : 'blue'})">
            ${item.status === 'warn' ? '⚠' : '◯'}
          </span>
          <div class="info-cell">
            <div class="client-title">${item.client} — ${item.issue}</div>
            <div class="client-meta">${item.detail}</div>
          </div>
          <button class="btn btn-o sm firm-action-btn" data-firm-action="${item.actionType}" data-item-id="${item.id}">
            ${item.actionText}
          </button>
        </div>
      `).join('');
    }

    if (auditTable) {
      auditTable.innerHTML = state.auditLogs.map(log => `
        <tr style="border-bottom:1px solid var(--line-2)">
          <td style="padding:8px 12px;font-family:var(--f-mono);font-size:.72rem;color:var(--ink-3)">${log.time}</td>
          <td style="padding:8px 12px;font-size:.78rem;font-weight:600">${log.actor}</td>
          <td style="padding:8px 12px;font-size:.78rem;color:var(--ink)">${log.event}</td>
          <td style="padding:8px 12px;font-family:var(--f-mono);font-size:.72rem;color:var(--ink-3)">${log.ip}</td>
        </tr>
      `).join('');
    }
  }

  function logAudit(eventText) {
    const nowStr = new Date().toLocaleString();
    state.auditLogs.unshift({
      time: nowStr,
      actor: `${state.currentUser.initials} (${state.currentUser.role === 'firm' ? 'Staff' : 'Client'})`,
      event: eventText,
      ip: state.signature.ipAddress
    });
    if (state.auditLogs.length > 30) state.auditLogs.pop();
    saveState();
  }

  /* ============================================================
     GLOBAL MODAL & TOAST HELPERS
     ============================================================ */
  function openModal(title, bodyHtml, footerHtml) {
    if (!dom.internalModal) return;
    if (dom.modalTitle) dom.modalTitle.textContent = title;
    if (dom.modalBody) dom.modalBody.innerHTML = bodyHtml;
    if (dom.modalFooter) dom.modalFooter.innerHTML = footerHtml || `<button class="btn btn-o sm" onclick="window.closeAppModal()">Close</button>`;
    dom.internalModal.classList.add('open');
  }

  function closeModal() {
    if (dom.internalModal) {
      dom.internalModal.classList.remove('open');
    }
  }

  function showToast(message, type = 'info') {
    if (!dom.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `app-toast`;
    if (type === 'ok') toast.style.borderLeftColor = 'var(--ok)';
    if (type === 'warn') toast.style.borderLeftColor = 'var(--warn)';
    if (type === 'info') toast.style.borderLeftColor = 'var(--gold)';

    toast.innerHTML = `
      <span style="color:${type === 'ok' ? 'var(--ok)' : type === 'warn' ? 'var(--warn)' : 'var(--gold)'}">●</span>
      <span>${message}</span>
    `;

    dom.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity .3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // Window exposures for inline event callbacks
  window.closeAppModal = closeModal;
  window.showAppToast = showToast;
  window.navigateToScreen = navigateTo;

})();
