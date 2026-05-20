# PR: Energy Yield Scorecard & Conversion Ledger

## Summary
- Add a persistent energy ledger (`energy-ledger`) for conversion results.
- Log energy yield records on plant intake confirmation.
- Add Energy Scorecard view and navigation across roles.
- Add energy widgets to dashboards.

## Changes
- Add energy ledger helpers and view rendering in `app.js`.
- Add energy scorecard styles in `styles.css`.
- Add new issue spec in `ISSUE-16.md`.

## Testing
- Manual: Complete a dispatch and verify energy entry appears.
- Manual: Open Energy Scorecard view and confirm stats render.

## Checklist
- [x] UI verified across Provider, Rider, Plant.
- [x] No console errors in normal flow.
- [x] Responsive layout preserved.
