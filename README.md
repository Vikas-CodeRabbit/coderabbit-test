# coderabbit-test

Scratch repository for exercising a **local** CodeRabbit installation end to end:
GitHub webhook → cloudflared tunnel → `coderabbitHandler` → Cloud Tasks → `pr-reviewer-saas`.

## Layout

- `src/cart.ts` — small shopping-cart module used as the review target.
- `src/discount.ts` — added by PRs to give the reviewer a diff to chew on.

## Note

Pull requests here intentionally contain defects. They exist so a review has
something to find; do not treat this code as exemplary.
