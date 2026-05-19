# 🚨 [CRITICAL] Issue #14: Carbon Credit Reconciliation Ledger

Deploy a reconciliation engine that verifies minted $RGX credits against expected ESG yields and surfaces mismatches in a dedicated ledger view.

---

## 🎯 Objective
- Create a persistent **Credit Ledger** (`localStorage: credit-ledger`).
- Log reconciliation entries on plant intake confirmation.
- Provide a **Reconciliation Center** view for all roles.
- Add a **Reconciliation Widget** to each dashboard.

---

## ✅ Core Requirements
- **Ledger Schema**
  - `{ id, orderId, org, expectedTokens, mintedTokens, deltaPct, trustScore, ts }`
- **Mismatch Threshold**
  - Flag if $|\Delta| \ge 8\%$ (expected vs minted)
- **UI**
  - Glassmorphic ledger list with mismatch badges
  - Reconciliation integrity bar with score

---

## 🧠 Proposed Modules
- `src/app.js` — ledger helpers, reconciliation UI, view routing
- `src/styles.css` — reconciliation components styling

---

## ✅ Quality Standards (Exceptional)
- Full **JSDoc** on new helpers
- Zero console errors
- Responsive layout across roles
- Glassmorphism + micro-animations

---

## ✅ Acceptance Criteria
- Ledger entries created after plant intake.
- Reconciliation view and widget visible for Provider/Rider/Plant.
- Mismatch flags show when $\Delta \ge 8\%$.
