# 🚨 [CRITICAL] Issue #20: Compost Quality Index & Segregation Ledger

Introduce a compost quality index that tracks segregation scores and quality outcomes for processed waste.

---

## 🎯 Objective
- Create a persistent **Quality Ledger** (`localStorage: quality-ledger`).
- Log quality entries on plant intake confirmation.
- Provide a **Quality Index** view for all roles.
- Add a **Quality Widget** to Provider/Rider/Plant dashboards.

---

## ✅ Core Requirements
- **Ledger Schema**
  - `{ id, orderId, org, kg, segScore, score, ts }`
- **Scoring**
  - Score derived from segregation score (0-100)
- **UI**
  - Glassmorphic quality cards and score bar
  - Recent batch list with score badges

---

## 🧠 Proposed Modules
- `src/app.js` — ledger helpers, scoring, view rendering
- `src/styles.css` — quality index styling

---

## ✅ Quality Standards (Exceptional)
- Full **JSDoc** on new helpers
- Zero console errors
- Responsive layout across roles
- Glassmorphism + micro-animations

---

## ✅ Acceptance Criteria
- Quality entries created after plant intake.
- Quality Index view and widget visible for all roles.
- Scores reflect segregation outcomes.
