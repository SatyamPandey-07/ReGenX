# 🚨 [CRITICAL] Issue #16: Energy Yield Scorecard & Conversion Ledger

Introduce a real-time energy yield scorecard that quantifies bio-waste to energy conversion efficiency and stores results in a ledger.

---

## 🎯 Objective
- Create a persistent **Energy Ledger** (`localStorage: energy-ledger`).
- Log conversion outcomes on plant intake confirmation.
- Provide an **Energy Scorecard** view for all roles.
- Add an **Energy Widget** to Provider/Rider/Plant dashboards.

---

## ✅ Core Requirements
- **Ledger Schema**
  - `{ id, orderId, org, kg, energyKwh, efficiencyPct, score, ts }`
- **Scoring**
  - Efficiency + segregation weighted scoring (70/30)
- **UI**
  - Glassmorphic energy cards and score bar
  - Recent batch list with score badges

---

## 🧠 Proposed Modules
- `src/app.js` — ledger helpers, scoring, view rendering
- `src/styles.css` — energy scorecard styling

---

## ✅ Quality Standards (Exceptional)
- Full **JSDoc** on new helpers
- Zero console errors
- Responsive layout across roles
- Glassmorphism + micro-animations

---

## ✅ Acceptance Criteria
- Energy entries created after plant intake.
- Energy Scorecard view and widget visible for all roles.
- Score and kWh totals reflect completed batches.
