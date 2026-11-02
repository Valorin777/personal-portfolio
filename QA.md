# Edition 04 — QA, 2026-11-02

## Verified in this revision
- `npm run generate` and `npm run check` pass. Four JavaScript files checked; 17 content pages plus one compatibility redirect validated for local resources, links, fragments, headings, unique IDs and 13 catalog cases.
- A publishing check rejects decorative emoji and arrow glyphs in generated HTML. All card, button, navigation and footer arrows are removed; text labels remain.
- Dark theme inspected in the supported in-app browser at desktop1280, tablet820, phone390 and narrow phone320. Main content uses graphite surfaces, soft highlights, muted mineral covers and copper accents; no paper/light UI blocks remain.
- All 13 case pages checked at320: clientWidth and scrollWidth both305px (15px browser scrollbar). Home/contact, catalog and expanded biography also have no horizontal overflow; tablet index/catalog/about widths805px match their scroll widths.
- Actual native scrolling exercised on desktop and phone-sized views. Hero progress changed from0 to0.3719 in desktop check; separate project progress/scale values updated in staggered order. Phone card shift was−10.04px within its reduced18px amplitude. No scroll interception.
- Found and fixed two motion issues: a decorative glow enlarged the overflow area, now clipped to its sculpture stage; reveal specificity previously suppressed three scroll transforms, now corrected with reduced-motion resets retained.
- Catalog filters after scroll integration: business5, beauty4, experiments4, all13. URL and pressed states update; hidden cards do not create overflow.
- Contact buttons on320 are269px wide and54px tall. Telegram href is the owner-supplied public profile; it was opened and matched @valorinin. Telephone href is `tel:+79856147867`, displayed with Russian formatting. No message or phone call was sent.
- Expanded About page has education, work areas, stack linked to examples, AI-assisted process, project roles and contact buttons. Faith over Fear is explicitly commissioned work; collaboration/team cases remain labelled.
- Independent review checked CSS nesting, motion logic and key text/button contrast pairs (sampled ratios at least6.2:1). No new JavaScript errors observed during browser QA.

## Source review and practical limits
- Reduced-motion preference sets static progress, removes animated transforms and disables ambient canvas movement. Offscreen/hidden sculpture and settled scroll controller suspend RAF. Mobile geometry and DPR are capped. These preference paths were source-reviewed; OS preference emulation was not available.
- Viewport testing is not a physical iPhone or Android hardware test. Actual touch hardware and low-end-device frame rates were not measured. Native touch handling is retained; functional controls work without hover.
- External project backends, payments and games are not validated by this portfolio QA. Project covers are labelled illustrations. Zakup and Deal Guard still lack accessible implementation/status evidence and are not added as completed work.
- No other project repository was modified. Public contact publication was explicitly requested by the owner.

The final CI run and byte-for-byte public deployment receipt are recorded outside the repository in the task workspace.
