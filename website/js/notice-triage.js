/**
 * PIVOT AIDE TAX — INTERACTIVE NOTICE TRIAGE (SORABAN SUITE)
 * State-switching engine for IRS & State letter diagnosis.
 * Features 6 notice selection cards, dynamic lower drawer cross-fade morphing,
 * color-coded monospace severity badges, and tactile hover micro-physics.
 */

const NOTICE_DATABASE = {
  'cp2000': {
    title: 'IRS Notice CP2000 — Underreporter Inquiry',
    cardTitle: 'IRS CP2000',
    cardDesc: 'Underreporter / mismatch inquiry with proposed tax change.',
    urgency: 'MEDIUM (30-DAY RESPONSE WINDOW)',
    severityClass: 'severity-medium',
    severityLevel: 'medium',
    summary: 'The IRS computer matched third-party information (such as 1099s, W-2s, or brokerage statements) against your return and found a discrepancy. It proposes additional tax, interest, and penalties.',
    unclePatSays: 'This is not an audit, and the IRS calculation is very frequently mistaken. They assume gross revenue is 100% net profit without accounting for basis or deductible expenses. Do not pay it blindly.',
    tier: 'Tier 1: Notice Response ($450)',
    action: 'Send us the notice and the related documents. We recalculate the real discrepancy and file the formal rebuttal.'
  },
  'cp14': {
    title: 'IRS Notice CP14 — Balance Due',
    cardTitle: 'IRS CP14 / Balance',
    cardDesc: 'Initial unpaid tax bill with interest and penalties.',
    urgency: 'HIGH (IMMEDIATE INTEREST & PENALTY ACCRUAL)',
    severityClass: 'severity-high',
    severityLevel: 'high',
    summary: 'The initial notice stating you owe unpaid federal taxes. If ignored, it leads to escalating notices (CP501, CP503, CP504) and eventual levy action.',
    unclePatSays: 'The IRS wants payment. If the balance is correct, we arrange an affordable installment agreement or CNC status. If it is incorrect, we freeze collections while resolving the underlying error.',
    tier: 'Tier 1 or Tier 3: Collections & Resolution',
    action: 'We pull your account transcripts to verify the statutory assessment date and assess penalty abatement eligibility.'
  },
  'cp504': {
    title: 'IRS Notice CP504 — Notice of Intent to Levy',
    cardTitle: 'IRS CP504 / Notice of Intent',
    cardDesc: 'Threat of levy or state refund garnishment.',
    urgency: 'CRITICAL (30 DAYS BEFORE ASSET SEIZURE)',
    severityClass: 'severity-critical',
    severityLevel: 'critical',
    summary: 'This is an urgent collections letter warning that the IRS intends to levy state tax refunds and may seize assets or issue wage garnishments if unresolved.',
    unclePatSays: 'Do not wait. A CP504 requires fast intervention to secure a collection hold while an installment plan or settlement is submitted.',
    tier: 'Tier 3: Collections & Resolution (from $1,500)',
    action: 'We establish immediate representation, contact IRS collections, halt enforcement, and negotiate resolution terms.'
  },
  'lt11': {
    title: 'Letter 11 / Letter 1058 — Final Notice of Intent to Levy & Hearing Rights',
    cardTitle: 'Letter 11 / Final Notice',
    cardDesc: '30-day strict CDP hearing deadline before bank levy.',
    urgency: 'EMERGENCY (STRICT 30-DAY STATUTORY CDP DEADLINE)',
    severityClass: 'severity-emergency',
    severityLevel: 'emergency',
    summary: 'The final statutory warning before bank levies and wage garnishments begin. Triggers your right to request a Collection Due Process (CDP) hearing on Form 12153.',
    unclePatSays: 'The 30-day deadline on this letter cannot be extended by any IRS employee. Missing it loses your statutory judicial appeal rights.',
    tier: 'Tier 3: Collections & Appeals',
    action: 'File Form 12153 immediately to protect judicial rights and move your file to IRS Independent Office of Appeals.'
  },
  'state': {
    title: 'State Department of Revenue Assessment (MD, VA, DC, etc.)',
    cardTitle: 'State DOR Assessment',
    cardDesc: 'MD Comptroller, VA Tax, DC OTR, or any of 50 states.',
    urgency: 'HIGH (STATE REVENUE AGENCIES MOVE FAST)',
    severityClass: 'severity-high',
    severityLevel: 'high',
    summary: 'State tax departments (Maryland Comptroller, Virginia Dept of Taxation, DC OTR, etc.) issue notices for missing state returns, nexus adjustments, or withholding discrepancies.',
    unclePatSays: 'National tax-relief mills ignore state agencies. Pivot Aide works directly with all 50 state tax authorities. We know their administrative appeals process inside out.',
    tier: 'State Desk & Resolution ($450 or quoted)',
    action: 'We handle state apportionment disputes, sales tax audits, and state payment agreements.'
  },
  'unfiled': {
    title: 'Multiple Unfiled Tax Years / Non-Filer',
    cardTitle: 'Multiple Unfiled Years',
    cardDesc: 'Back returns, non-filing, or IRS SFR assessments.',
    urgency: 'URGENT (RISK OF SUBSTITUTE FOR RETURN - SFR)',
    severityClass: 'severity-medium',
    severityLevel: 'urgent',
    summary: 'Missing tax filings for one or more past years. When unfiled, the IRS files an SFR with zero deductions, creating an artificially high tax assessment.',
    unclePatSays: 'Unfiled returns create sleepless nights. The IRS only requires the last six years for compliance restoration. We pull wage & income transcripts and reconstruct the real returns.',
    tier: 'Tier 4: Back Years & Non-Filers ($350/yr + $500 reconstruction)',
    action: 'Transcript analysis, SFR replacement, and return to good standing.'
  }
};

window.renderNoticeTriage = function(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="triage-step" id="triage-step-root">
      <label class="form-label triage-step-label" id="triage-step-label">Step 1: Select the letter or notice you received</label>
      <div class="triage-options" id="triage-options" role="tablist" aria-label="Notice selection options">
        <button type="button" class="triage-opt selected" data-notice-key="cp2000" role="tab" aria-selected="true" id="tab-cp2000">
          <h4 class="triage-opt-title">IRS CP2000</h4>
          <p class="triage-opt-desc">Underreporter / mismatch inquiry with proposed tax change.</p>
        </button>
        <button type="button" class="triage-opt" data-notice-key="cp14" role="tab" aria-selected="false" id="tab-cp14">
          <h4 class="triage-opt-title">IRS CP14 / Balance</h4>
          <p class="triage-opt-desc">Initial unpaid tax bill with interest and penalties.</p>
        </button>
        <button type="button" class="triage-opt" data-notice-key="cp504" role="tab" aria-selected="false" id="tab-cp504">
          <h4 class="triage-opt-title">IRS CP504 / Notice of Intent</h4>
          <p class="triage-opt-desc">Threat of levy or state refund garnishment.</p>
        </button>
        <button type="button" class="triage-opt" data-notice-key="lt11" role="tab" aria-selected="false" id="tab-lt11">
          <h4 class="triage-opt-title">Letter 11 / Final Notice</h4>
          <p class="triage-opt-desc">30-day strict CDP hearing deadline before bank levy.</p>
        </button>
        <button type="button" class="triage-opt" data-notice-key="state" role="tab" aria-selected="false" id="tab-state">
          <h4 class="triage-opt-title">State DOR Assessment</h4>
          <p class="triage-opt-desc">MD Comptroller, VA Tax, DC OTR, or any of 50 states.</p>
        </button>
        <button type="button" class="triage-opt" data-notice-key="unfiled" role="tab" aria-selected="false" id="tab-unfiled">
          <h4 class="triage-opt-title">Multiple Unfiled Years</h4>
          <p class="triage-opt-desc">Back returns, non-filing, or IRS SFR assessments.</p>
        </button>
      </div>
      <div id="triage-result-area" class="triage-result" role="tabpanel" aria-live="polite"></div>
    </div>
  `;

  const resultArea = container.querySelector('#triage-result-area');
  const buttons = Array.from(container.querySelectorAll('.triage-opt'));
  let activeKey = 'cp2000';
  let isTransitioning = false;

  function buildDrawerHTML(key) {
    const data = NOTICE_DATABASE[key] || NOTICE_DATABASE['cp2000'];
    return `
      <div class="triage-result-header">
        <h3 class="triage-result-title">${data.title}</h3>
        <span class="triage-severity-tag ${data.severityClass}">
          ${data.urgency}
        </span>
      </div>
      <p class="triage-result-summary">${data.summary}</p>
      <div class="callout triage-callout">
        <span class="triage-callout-tag">Uncle Pat's Read</span>
        <p class="triage-callout-quote">&ldquo;${data.unclePatSays}&rdquo;</p>
      </div>
      <div class="triage-result-actions">
        <div class="triage-path-wrap">
          <span class="triage-path-label">Recommended Path</span>
          <strong class="triage-path-tier">${data.tier}</strong>
        </div>
        <button type="button" class="btn btn-g triage-cta-btn" onclick="openBookingModal('${key}')">
          <span>Request Notice Triage (2-Day Review)</span>
        </button>
      </div>
    `;
  }

  function updateResult(key, animate = true) {
    if (!resultArea) return;
    const nextHTML = buildDrawerHTML(key);

    if (!animate || typeof gsap === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      resultArea.innerHTML = nextHTML;
      return;
    }

    isTransitioning = true;
    const currentChildren = Array.from(resultArea.children);

    if (currentChildren.length === 0) {
      resultArea.innerHTML = nextHTML;
      gsap.fromTo(resultArea.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', stagger: 0.04, onComplete: () => { isTransitioning = false; } }
      );
      return;
    }

    gsap.to(currentChildren, {
      opacity: 0,
      y: -10,
      duration: 0.14,
      ease: 'power2.in',
      onComplete: () => {
        resultArea.innerHTML = nextHTML;
        gsap.fromTo(resultArea.children,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power2.out',
            stagger: 0.04,
            onComplete: () => { isTransitioning = false; }
          }
        );
      }
    });
  }

  // Card Click Handler & State Physics
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-notice-key');
      if (key === activeKey || isTransitioning) return;

      activeKey = key;
      buttons.forEach(b => {
        const isCurrent = b === btn;
        b.classList.toggle('selected', isCurrent);
        b.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
        if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          if (isCurrent) {
            gsap.to(b, {
              y: 0,
              opacity: 1,
              duration: 0.25,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          } else {
            gsap.to(b, {
              y: 0,
              opacity: 0.7,
              borderColor: 'rgba(255, 255, 255, 0.12)',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              duration: 0.25,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        }
      });

      updateResult(key, true);
    });

    // Tactile Hover Micro-Physics
    btn.addEventListener('mouseenter', () => {
      if (btn.classList.contains('selected')) return;
      if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.to(btn, {
          y: -3,
          opacity: 0.95,
          borderColor: 'rgba(1, 159, 255, 0.5)',
          backgroundColor: 'rgba(1, 159, 255, 0.03)',
          duration: 0.22,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto'
        });
      }
    });

    btn.addEventListener('mouseleave', () => {
      if (btn.classList.contains('selected')) return;
      if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.to(btn, {
          y: 0,
          opacity: 0.7,
          borderColor: 'rgba(255, 255, 255, 0.12)',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          duration: 0.25,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto'
        });
      }
    });
  });

  // Initial render of default Card 1 (CP2000)
  updateResult('cp2000', false);
};
