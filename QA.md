# Edition 02 — QA, 2026-11-02

## Passed
- `npm run check`: JavaScript syntax plus 13 HTML pages checked for local resource paths, links, fragments, unique IDs and a single h1. Nine catalog cards.
- Consumer-local reference video materialized from Library. Actual 57-second video inspected through 5-second overview and 0.5-second motion frames, before redesign.
- Supported in-app browser, desktop: homepage, front/back identity card, catalog, project case; no new site JavaScript errors after final app integration.
- Pointer drag moved badge +81/-45px; release returned it to 0/0 with damped spring. Drag did not flip the card. Click and Enter flip; ambient pause state toggles correctly.
- Catalog filters: all 9, beauty 3, business 4, experiments 2. Matching hash and aria-pressed state update; hidden projects removed from view. Case navigation opens separate HTML documents.
- All 13 pages checked at viewport 320×780: document clientWidth and scrollWidth both 305px (15px browser scrollbar). Long biography headline fixed after observed overflow.
- Representative 390px mobile and 820px tablet views inspected. Typography, card controls and case pages remain readable.
- Project media and font files are local. Manrope SIL OFL included. Original reference media is not distributed.
- First edition preserved in commit 7f4a1d4 and local archive/v1-20261102 branch.

## Scope limits
- Responsive browser testing, not a physical iPhone/Safari device test.
- Reduced-motion behavior source-reviewed; OS preference emulation not performed in this browser tool.
- Product-cover interfaces are marked illustrations. Project features and statuses were checked against public repositories; no metrics or client relationships invented.

Deployment verification for the final commit is recorded outside the repository in the task's live-verification.json.
