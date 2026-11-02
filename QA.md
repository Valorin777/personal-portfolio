# Edition 05 — QA, 2026-11-02

V5 was checked through source inspection, the repository's static checks, actual CUA browser interaction, and timestamped screenshot sequences. Browser results below are the root agent's observed results; capture reviews identify their evidence separately. Deployment is not asserted by this document.

## Static checks and content

- Final `npm run check` passes. `app.js` and `showcase.js` parse successfully. All 18 generated HTML pages pass local resource, video-poster, link, fragment, heading, unique-ID, contact-source and obsolete-script checks: 17 content pages plus one compatibility redirect.
- The catalog contains 13 cases: 4 beauty, 5 business and 4 experiments. The former Pocket Chef URL redirects to the combined L'atelier / Pocket Chef case.
- Contact hrefs match `contact-data.json`; the displayed phone digits match the telephone URL. Every content page includes the supplied Telegram profile, and Home and About include the telephone URL. Temporary-copy regression tests confirmed that incorrect Telegram links and obsolete `sculpture.js` / `scroll-motion.js` references fail the check.
- Generated HTML contains no arrow glyphs or decorative emoji. A separate decoded-HTML review also found none. CSS braces are balanced. The v5 theme uses graphite, violet and coral; the checked CSS literals contain no green theme colors. Real project imagery retains its original colors.
- Sampled contrast ratios: muted text/page background 8.28:1; primary button text/background 7.73:1; attribution text/page background 7.20:1; case prose/page background 9.41:1. Film text and controls were also inspected visually in the captures below; this is not an exhaustive contrast audit of every video frame.
- LAST WIND and Faith over Fear use actual published-page captures. Catalog media distinguishes captures, official graphics and film frames; illustrative product covers remain labelled. Faith over Fear is identified as commissioned work, and collaborative/team/educational cases retain their qualifications.
- About covers education, work areas, project-based technology examples, process, roles and contacts. No unverified client results or usage metrics were added.

## Observed browser results

- At **320 × 740**, all **17 content pages** were loaded, including every one of the 13 cases. Each document's `scrollWidth` equalled `clientWidth`: **305 px**, with a 15 px browser scrollbar. Home, catalog, About and Credits passed these checks. Every case retained its Telegram contact link.
- A catalog overflow defect was found and fixed using explicit media width, `minmax(0, 1fr)` grid columns, a 300 px minimum height for narrow graphic covers, and wrapping for long graphic titles. The corrected «Главный герой» card was inspected visually.
- All four filters were exercised through their real buttons. Visible counts and URL hashes matched **13 / 4 / 5 / 4** for all / beauty / business / experiments.
- At **390 × 844**, Home and the three-scene film were scrolled and captured. The hero, project collage, toolbar, scene navigation, settled copy and project CTAs were readable. Film controls have a minimum 44 px hit height.
- The 390 px pause control was exercised: all three scenes had `aria-hidden` removed and `inert=false`, the video reported `paused=true`, and scenes returned to normal document flow. The video was also observed paused when the film was offscreen.
- At **320 px**, contact buttons were visible and their Telegram/telephone hrefs matched the supplied destinations. About passed visual inspection. No message or call was sent.
- At **844 × 390 landscape**, the film reported `is-film-ready=false`; all three scenes were relative-positioned, 720 px high and `inert=false`. Document `scrollWidth` and `clientWidth` were both **829 px**. Native scrolling placed the checked project CTA at **252–307 px** vertically, fully inside the 390 px viewport.
- At **1280 × 800**, the root and motion reviewer inspected the desktop sequence. Opaque receding panels prevent old LAST WIND text/character imagery from showing through RusJet. Dark toolbar and navigation backgrounds preserve readable controls over the pale airplane footage.
- Actual CUA `dev.logs` error checks returned **`[]`** on both desktop and phone.
- During card entrances, incoming content briefly passes behind the fixed navigation pill. The navigation remains readable, and settled scene CTAs are unobstructed; no persistent text ghosting was seen in the reviewed final desktop and phone frames.

## Motion and accessibility implementation

- Native page scrolling is preserved; no wheel or touch interception is used. Programmatic scrolling serves explicit scene navigation and retaining the current project when changing modes.
- The static/no-JavaScript layout keeps scenes in document flow. Animated mode applies `inert` and `aria-hidden` to inactive scenes, with a tabindex fallback and focus transfer before hiding a focused scene.
- The pause control exposes every scene and stops ambient video. Reduced-motion preference follows the same static path in source, and short-height viewports use the observed static fallback.
- RusJet video has a local poster, muted inline playback, `preload="none"`, and no HTML autoplay attribute. Playback is gated by the active scene, viewport visibility, document visibility and motion state. Interrupted/rejected playback requests are handled.

## Capture evidence

Evidence is stored **outside this repository**, under the task workspace's `qa-captures/` directory:

| Capture | Files | Timing and scope |
|---|---|---|
| `v4-before-scroll/` | `before-first13.mp4`, `before-first13-contact.jpg`, `manifest-first13.json`, `before-first13-verification.json` | First 13 original frames, 0–1994 ms; 500 ms final hold. A later 27,745 ms gap was excluded in a separate manifest. V4 comparison evidence only. |
| `v5-desktop-final/` | `capture.mp4`, `post-fix-contact-sheet.jpg`, `visual-review.json` | 47 original frames, 0–6586 ms; 500 ms final hold. Post-fix review confirms opaque panels and protected controls. |
| `v5-phone-final/` | `phone-final.mp4`, `phone-final-contact.jpg`, `phone-final-keyframes.jpg`, `phone-final-verification.json` | All 44 source timestamps, 0–7146 ms, match decoded video exactly; repeated final frame at 7646 ms. |
| `v5-phone-hero/` | `frame-000.jpg`, `manifest.json` | Separate final phone opening capture. |

The first post-fix desktop frame is partially painted; the source frame at **210 ms** is complete. The cause cannot be established from screenshots. That first frame was retained, and no source frame was removed or altered to conceal it.

Phone screenshots have a saved raster of **375 × 812**, distinct from the configured 390 × 844 browser viewport. Encoding pads one column to 376 × 812; it does not rescale or interpolate frames. Original manifests and screenshot files remain unchanged.

## Practical limits

- The operating system's reduced-motion preference was **not changed during browser testing**. That preference path, no-JavaScript fallback and older-browser tabindex fallback were source-reviewed; they are not claimed as live OS/screen-reader compatibility tests.
- Timestamped screenshot videos are not hardware screen recordings. They preserve observed timestamps and repeat only the final source frame for its hold; they do not establish continuous 30/60 FPS performance or capture every intermediate rendered frame.
- Viewport tests do not substitute for physical iPhone/Android hardware, low-end-device performance, a full assistive-technology audit, or every browser engine.
- External project backends, payments and game completion are outside this portfolio QA. External contact-account ownership was not rechecked in this v5 pass.
- Deployment and public-byte verification are not claimed here; the root records those separately after performing them.
