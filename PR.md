# PR: Sensor Reliability Index & Health Ledger

## Summary
- Add a persistent sensor ledger (`sensor-ledger`) for IoT health snapshots.
- Record reliability snapshots during simulation ticks.
- Add Sensor Reliability view and navigation across roles.
- Add sensor reliability widgets to dashboards.

## Changes
- Add sensor ledger helpers and view rendering in `app.js`.
- Add sensor reliability styles in `styles.css`.
- Add new issue spec in `ISSUE-17.md`.

## Testing
- Manual: Open IoT view and wait for a simulation tick, then check Sensor Reliability view.
- Manual: Toggle bin status to offline and verify score changes.

## Checklist
- [x] UI verified across Provider, Rider, Plant.
- [x] No console errors in normal flow.
- [x] Responsive layout preserved.
