# Pivot Aide Tax — Website, Brand & Service Architecture

> **"Uncle Sam looks out for the government. Uncle Pat looks out for you."**

Official repository for **Pivot Aide Tax** (Hyattsville, MD), providing year-round tax strategy, representation across all 50 states, and monthly business accounting.

---

## Repository Structure

```
.
├── website/                            # Production Multi-Page Website Build
│   ├── index.html                      # Home (The Thesis, 12-Month Timeline, 4 Doors)
│   ├── file-taxes.html                 # Storefront: 1040, Business ($1,150/$1,950), QuickPrepare ($295)
│   ├── tax-strategy.html               # Flagship: The Standing File, S-Corp ($1,500), S-Corp Calculator
│   ├── audit-resolution.html           # Resolution: 4 Tiers, 50-State Desk, Audit Shield ($95), Notice Triage
│   ├── business.html                   # Recurring: Bookkeeping (Ledger $350-$1,200), Payroll, 50% Return Discount
│   ├── free-help.html                  # Complimentary: Second Look (3 Returns), Notice Triage, 6 Trade Checklists
│   ├── resources.html                  # Reference: Official 2026 IRS figures, Mileage (67¢), Deadlines
│   ├── appointments.html               # Direct Consultation & Scoping Call Scheduling
│   ├── file-room.html                  # The File Room Portal Overview & Client Sign-In
│   ├── meet-uncle-pat.html             # Brand Character: Philosophy, Why an Owl, 5 Voice Rules, Team
│   ├── css/                            # Modular Design System (fonts, variables, base, components, pages)
│   ├── js/                             # Interactive Tools (Notice Triage, S-Corp Calc, Booking, Cursor Tracking)
│   └── assets/                         # Vector Brand Assets (Uncle Pat SVGs) & Self-Hosted WOFF2 Fonts
│
└── Pivot Aide Tax - Website Package/   # Original Architecture & Reference Documents
    ├── 1 - Site Prototype (open in any browser).html
    ├── 2 - Site Prototype (PDF version).pdf
    ├── 3 - Service Architecture and Uncle Pat Brand File.pdf
    ├── 4 - App Prototype - The File Room.html
    ├── 5 - App Prototype - The File Room (PDF version).pdf
    ├── 6 - App Build Plan - The File Room.pdf
    ├── 7 - Uncle Pat Mark Sheet.html
    ├── 8 - Uncle Pat Mark Sheet (PDF version).pdf
    ├── 9 - Uncle Pat artwork/          # Source vector SVGs and PNGs
    └── START HERE.txt
```

---

## Typography System

* **Fraunces (Display):** 300, 400, 600 (`font-variation-settings: 'SOFT' 20`)
* **Poppins (Body):** 300, 400, 500, 600
* **JetBrains Mono (Utility):** 400, 500 (`font-variant-numeric: tabular-nums`)
* 100% self-hosted WOFF2 files with zero external Google Fonts latency.

---

## Local Development & Preview

To preview the website locally:

```bash
# Python
python -m http.server 8080 --directory website

# Or open website/index.html directly in any modern browser
```

---

© 2026 Pivot Aide Tax · Hyattsville, MD · (571) 470-3754
