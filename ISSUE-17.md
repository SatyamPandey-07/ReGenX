# 🚨 [CRITICAL] Issue #17: Sensor Reliability Index & Health Ledger

Introduce a real-time sensor reliability index to track IoT device uptime, freshness, and network health with a dedicated ledger view.

---

## 🎯 Objective
- Create a persistent **Sensor Ledger** (`localStorage: sensor-ledger`).
- Record health snapshots from IoT simulation ticks.
- Provide a **Sensor Reliability** view for all roles.
- Add a **Sensor Reliability Widget** to dashboards.

---

## ✅ Core Requirements
- **Ledger Schema**
  - `{ id, ts, score, offlineCount, staleCount, total }`
- **Reliability Rules**
  - Offline sensors reduce score
  - Stale sensors (>10 min) reduce score
- **UI**
  - Glassmorphic reliability bar and snapshot list
  - Badge-based health indicators

---

## 🧠 Proposed Modules
- `src/app.js` — ledger helpers, snapshot generation, view rendering
- `src/styles.css` — reliability UI styling

---

## ✅ Quality Standards (Exceptional)
- Full **JSDoc** on new helpers
- Zero console errors
- Responsive layout across roles
- Glassmorphism + micro-animations

---

## ✅ Acceptance Criteria
- Sensor snapshots generated during IoT simulation ticks.
- Sensor Reliability view and widget visible for all roles.
- Health score updates based on offline/stale sensors.
