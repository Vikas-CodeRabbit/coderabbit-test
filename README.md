# coderabbit-test

Scratch repository for exercising a **local** CodeRabbit installation end to end:
GitHub webhook → cloudflared tunnel → `coderabbitHandler` → Cloud Tasks → `pr-reviewer-saas`.

## Layout

- `src/cart.ts` — small shopping-cart module used as the review target.
- `src/discount.ts` — added by PRs to give the reviewer a diff to chew on.

## Note

Pull requests here intentionally contain defects. They exist so a review has
something to find; do not treat this code as exemplary.

## Security and Quality scan fixtures

These files deliberately contain defects to exercise the Hutch scanners:

- `src/scan_demo.py`: localhost-only HTTP demo with SQL injection, path traversal,
  shell command injection, and reflected HTML injection paths. Uses synthetic
  in-memory records and no credentials. **Never deploy or expose this demo.**
  Static scanning does not require starting it.
- `src/order-processing.ts`: deeply nested branching, repeated calculations,
  magic numbers, off-by-one array access, swallowed failures, input mutation,
  and empty-input arithmetic errors for Quality scans.

Scanner findings are not guaranteed to exactly match this list; use it as the
expected fixture inventory when evaluating results. Do not fix these defects
unless intentionally changing the scan test cases.
