# PR: Carbon Credit Reconciliation Ledger

## Summary
- Add a persistent credit ledger (`credit-ledger`) for minted $RGX reconciliation.
- Log reconciliation entries on plant intake confirmation.
- Add Reconciliation Center view and navigation for all roles.
- Add Reconciliation widgets to dashboards.

## Changes
- Add ledger helpers and reconciliation UI in `app.js`.
- Add reconciliation styles in `styles.css`.
- Add new issue spec in `ISSUE-14.md`.

## Testing
- Manual: Complete a dispatch and verify ledger entry appears.
- Manual: Open Reconciliation Center and confirm mismatch badges render.

## Checklist
- [x] UI verified across Provider, Rider, Plant.
- [x] No console errors in normal flow.
- [x] Responsive layout preserved.
