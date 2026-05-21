# PR: Compost Quality Index & Segregation Ledger

## Summary
- Add a persistent quality ledger (`quality-ledger`) for segregation outcomes.
- Log quality entries on plant intake confirmation.
- Add Quality Index view and navigation across roles.
- Add quality widgets to dashboards.

## Changes
- Add quality ledger helpers and view rendering in `app.js`.
- Add quality index styles in `styles.css`.
- Add new issue spec in `ISSUE-20.md`.

## Testing
- Manual: Complete a dispatch and verify quality entry appears.
- Manual: Open Quality Index view and confirm stats render.

## Checklist
- [x] UI verified across Provider, Rider, Plant.
- [x] No console errors in normal flow.
- [x] Responsive layout preserved.
