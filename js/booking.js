/**
 * PIVOT AIDE TAX — BOOKING & CONSULTATION HANDLER
 * Provides interactive scheduling modal for consultations, scoping calls,
 * Second Look reviews, and urgent notice triage.
 */

window.openBookingModal = function(serviceType = 'general') {
  let modal = document.getElementById('booking-modal');
  if (!modal) {
    createBookingModalDOM();
    modal = document.getElementById('booking-modal');
  }

  // Pre-select service in dropdown
  const select = modal.querySelector('#booking-service');
  if (select && serviceType) {
    for (let opt of select.options) {
      if (opt.value === serviceType || opt.value.includes(serviceType)) {
        select.value = opt.value;
        break;
      }
    }
  }

  openModal('booking-modal');
};

function createBookingModalDOM() {
  const modalDiv = document.createElement('div');
  modalDiv.id = 'booking-modal';
  modalDiv.className = 'modal-backdrop';
  modalDiv.innerHTML = `
    <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-header">
        <div>
          <span class="eyebrow">Pivot Aide Tax</span>
          <h3 id="modal-title" style="margin-top:2px">Schedule Your Strategy Session</h3>
        </div>
        <button type="button" class="modal-close" aria-label="Close modal">&times;</button>
      </div>
      <div class="modal-body">
        <form id="booking-form" onsubmit="handleBookingSubmit(event)">
          <div class="form-group">
            <label class="form-label" for="booking-service">Service / Consultation Type</label>
            <select id="booking-service" class="form-control" required>
              <option value="scoping">The Standing File — 45-Minute Scoping Call (Free)</option>
              <option value="second-look">Second Look — 3-Year Prior Return Review (Free)</option>
              <option value="triage">Notice Triage — IRS / State Letter Review ($0 Review)</option>
              <option value="consultation">General Tax Consultation (1 Hour, Free)</option>
              <option value="quickprepare">QuickPrepare Filing ($295 Deposit)</option>
              <option value="business">Business & Bookkeeping Onboarding</option>
            </select>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="form-group">
              <label class="form-label" for="booking-name">Full Name</label>
              <input type="text" id="booking-name" class="form-control" placeholder="Jane Doe" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="booking-phone">Phone Number</label>
              <input type="tel" id="booking-phone" class="form-control" placeholder="(571) 000-0000" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="booking-email">Email Address</label>
            <input type="email" id="booking-email" class="form-control" placeholder="jane@example.com" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="booking-notes">Brief Overview of Your Situation</label>
            <textarea id="booking-notes" class="form-control" rows="3" placeholder="Tell us about your tax filing, business entity, or any letter received..."></textarea>
          </div>

          <div class="callout" style="margin-bottom:18px;font-size:.82rem">
            <span class="h">Our Commitment</span>
            <p>We do not sell client data, we do not employ aggressive sales reps, and we review submissions within two business days.</p>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:10px">
            <button type="button" class="btn btn-o modal-close">Cancel</button>
            <button type="submit" class="btn btn-p">Confirm Consultation Request &rarr;</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modalDiv);
}

window.handleBookingSubmit = function(e) {
  e.preventDefault();
  const form = e.target;
  const nameInput = form.querySelector('#booking-name') || form.querySelector('#page-booking-name') || form.querySelector('input[type="text"]');
  const emailInput = form.querySelector('#booking-email') || form.querySelector('#page-booking-email') || form.querySelector('input[type="email"]');
  const name = nameInput ? nameInput.value : 'Taxpayer';
  const email = emailInput ? emailInput.value : 'your email address';

  const modalBody = form.closest('.modal-body') || form.closest('.card') || form.parentElement;
  if (modalBody) {
    modalBody.innerHTML = `
      <div style="text-align:center;padding:24px 12px">
        <div style="width:52px;height:52px;border-radius:50%;background:rgba(31,138,84,.15);color:var(--ok);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:1.8rem">
          &#10003;
        </div>
        <h3 style="font-size:1.35rem">Consultation Request Received</h3>
        <p class="small" style="margin-top:8px;max-width:44ch;margin-left:auto;margin-right:auto">
          Thank you, <strong>${name}</strong>. An advisor from Pivot Aide Tax will reach out to <strong>${email}</strong> within two business days to confirm your appointment time and prepare your intake.
        </p>
        <div style="margin-top:24px">
          <button type="button" class="btn btn-g" onclick="typeof closeModal === 'function' ? closeModal('booking-modal') : location.reload()">Close</button>
        </div>
      </div>
    `;
  }
};


window.viewChecklist = function(tradeName) {
  const checklists = {
    'Realtor': {
      title: 'Realtors & Real Estate Brokers',
      items: [
        'Desk fees, brokerage splits, and E&O liability insurance',
        'MLS dues, local board fees, and national association dues',
        'Staging furniture, professional photography, virtual tours, drone videography',
        'Business mileage (67¢/mile for TY 2026) or actual auto lease expenses',
        'Client closing gifts (subject to $25 per recipient statutory limit under IRC §274)',
        'Continuing professional education (CE), licensing renewals, exam fees',
        'Open house hospitality, promotional signage, lockboxes, and yard stakes'
      ]
    },
    'Contractor': {
      title: 'Contractors & Construction Trades',
      items: [
        'Section 179 first-year full expensing on heavy machinery and work trucks',
        'Hand tools, power equipment, safety gear, steel-toed boots, and PPE',
        'Subcontractor 1099-NEC payments and worker compensation premiums',
        'Job site temporary power, dumpster rentals, portable sanitation units',
        'Materials, fasteners, lumber, and specialized equipment rentals',
        'Builder’s risk insurance, general commercial liability, bonding fees'
      ]
    },
    'Trucker': {
      title: 'Truckers & Owner-Operators',
      items: [
        'Special per diem meal allowance (80% deductible rate for DOT hours-of-service)',
        'Heavy Highway Vehicle Use Tax (Form 2290 compliance and payment)',
        'International Fuel Tax Agreement (IFTA) state diesel road taxes',
        'Electronic Logging Device (ELD) hardware and telematics subscriptions',
        'Sleeper berth bedding, cab inverter, mini-refrigerator, CB radio gear',
        'Tire chain sets, load locks, straps, tarps, and truck wash expenses'
      ]
    },
    'Healthcare': {
      title: 'Home Care & Nursing Agencies',
      items: [
        'Disposable medical gloves, blood pressure monitors, sanitizing agents, scrubs',
        'Caregiver CPR/BLS certification renewals and state background checks',
        'Accountable plan mileage reimbursements for travel between client homes',
        'Professional nursing liability insurance and healthcare agency licensing',
        'HIPAA-compliant scheduling software and secure charting subscriptions'
      ]
    },
    'Salon': {
      title: 'Salons, Barbers & Stylists',
      items: [
        'Weekly or monthly booth rental / station chair lease payments',
        'Professional shears, clippers, trimmers, blades, and sharpening services',
        'Backbar shampoos, conditioners, developer, dyes, foil, and cape laundry',
        'Autoclaves, Barbicide disinfectant, UV sterilizers, and neck strips',
        'Client booking apps (Acuity, Square, Vagaro) and merchant processing fees'
      ]
    },
    'Rideshare': {
      title: 'Rideshare & Delivery Drivers',
      items: [
        'Standard business mileage rate (67¢ per mile) from pickup to drop-off',
        'Cell phone split (business percentage of monthly phone bill and data)',
        'Dashboard mounts, multi-port USB chargers, dash cam equipment',
        'Car washes, interior vacuuming, detailing, and air fresheners',
        'Tolls and parking fees incurred while actively operating for hire'
      ]
    }
  };

  const data = checklists[tradeName] || checklists['Realtor'];

  let modal = document.getElementById('checklist-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'checklist-modal';
    modal.className = 'modal-backdrop';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-panel" role="dialog" aria-modal="true">
      <div class="modal-header">
        <div>
          <span class="eyebrow">Industry Deduction Guide</span>
          <h3 style="margin-top:2px">${data.title}</h3>
        </div>
        <button type="button" class="modal-close" onclick="closeModal('checklist-modal')">&times;</button>
      </div>
      <div class="modal-body">
        <p class="small" style="color:var(--ink-2);margin-bottom:14px">
          These key deduction categories apply directly to your federal Schedule C or business return:
        </p>
        <ul class="ticks" style="line-height:1.6;font-size:.88rem">
          ${data.items.map(it => `<li><b>${it.split(',')[0]}:</b> ${it}</li>`).join('')}
        </ul>
        <div class="callout" style="margin-top:18px">
          <span class="h">IRS Audit Standard</span>
          <p class="small">Every deduction requires contemporaneously maintained receipts or mileage logs. Pivot Aide Tax provides free log templates when you file with us.</p>
        </div>
        <div style="margin-top:20px;display:flex;justify-content:flex-end;gap:10px">
          <button type="button" class="btn btn-o sm" onclick="closeModal('checklist-modal')">Close</button>
          <button type="button" class="btn btn-g sm" onclick="closeModal('checklist-modal'); openBookingModal('consultation')">Discuss With Uncle Pat &rarr;</button>
        </div>
      </div>
    </div>
  `;

  openModal('checklist-modal');
};

