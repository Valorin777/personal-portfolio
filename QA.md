# Edition 03 — QA, 2026-11-02

## Verified
- `npm run generate` and `npm run check`: JS syntax, local assets/links/fragments, unique IDs, one h1, 13 catalog cards. 17 content pages plus one compatibility redirect.
- Supported in-app browser at desktop, 820px tablet, 390px and 320px phone viewports. All 13 case pages and home/about/credits have document width equal to scroll width at 320px (305px content plus browser scrollbar); no horizontal overflow.
- Homepage original sculpture renders, switches between shapes and updates pressed states/captions. Ambient pause updates the control and stops ambient movement. Mouse interaction and normal scrolling remain available.
- Catalog counts are data-driven: all 13, beauty 4, business 5, experiments 4. Filtering updates aria-pressed, visible cards and URL hash. Cases navigate to separate documents.
- Old Pocket Chef case URL redirects to the unified L’atelier / Pocket Chef case. Full-name headings wrap correctly on the narrow phone.
- Homepage, catalog and representative case visuals inspected. All checked project images load. No site JavaScript errors during browser checks.
- Small accent text darkened to #bd3c24 on paper; selected dark controls retain light text on hover. Contact remains accessible in mobile navigation.
- No decorative emoji, private repo links, old badge code or copied reference assets in published pages.
- Self-hosted Manrope and Prata with SIL OFL; total static payload approximately 1.1 MB, no package dependencies.

## Source review and limits
- Independent review of app.js and sculpture.js found no blocking runtime defect. Reduced-motion preference disables animations and pointer tilt; shape changes become immediate. Offscreen/hidden pages cancel the animation loop. DPR is capped and mobile geometry is reduced.
- Responsive browser testing is not a physical iPhone test. Actual touch hardware, OS reduced-motion toggling and measured low-end-device frame rates were not tested. Native touch handling was source-reviewed; buttons were exercised in phone-sized browser views.
- Product illustrations are labelled; individual project backends, payments and external games are outside this site's QA. HTTP availability does not imply all external product functions work.
- Zakup and Deal Guard remain outside the catalog because accessible evidence for their implementation/status was not found. Personal Context retrieval was unavailable. No capabilities or results invented for them.

Final deployment receipt and public-byte verification are stored outside the published repository in the task workspace.
