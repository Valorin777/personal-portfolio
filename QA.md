# QA — 2026-11-02

## Passed on publisher Mac
- Source ZIP byte size 15,640 and SHA-256 `f7cc744dea76db4cda5c97dda5c6cf7a135bc18d2c285ff65f632619de19c4b7` verified before safe extraction.
- `npm run build` passed under Node 22.14.0; no dependency installation required.
- Supported in-app browser: desktop hero visually inspected; badge mouse click sets aria-pressed true, Enter sets it false, animation pause updates accessible name.
- Responsive browser viewport checks at 390×844 and 320×780: document widths 375px and 305px (scrollbar excluded), scrollWidth equal to clientWidth.
- All three project preview images loaded with positive naturalWidth.
- GitHub Pages configured with GitHub Actions source in new public repository `Valorin777/personal-portfolio`.
- Real iPhone/Safari testing remains unperformed; responsive browser checks are not real-device verification.

## Passed in cloud workspace
- `npm run build` (JavaScript syntax check; no dependencies/build transform).
- HTML local resources and fragment IDs resolved by parser check.
- Actual browser inspection through supported managed preview and CUA: desktop hero, projects, biography. Replaced missing arrow glyphs with original CSS icons after visual inspection.
- 390px and 320px iframe viewport visual inspection. Measured content widths 375 and 305px respectively (15px desktop scrollbar); scrollWidth equals clientWidth, no horizontal overflow. Tightened 320px nav to prevent label wrapping.
- Identity badge click flip sets aria-pressed true; Enter flips back. Global animation pause sets aria-pressed true and updates accessible name.
- Project images all returned complete=true and naturalWidth>0 in browser.
- Desktop body scrollWidth equals clientWidth (1165px).
- Main project and biography anchor navigation visually verified.
- Console sample: only pre-existing browser-extension metadata errors, not site-origin errors.
- All external links HTTPS and all new-window links noopener/noreferrer.
- No forms, authentication, analytics, cookies, API keys, private contacts, or copied reference media.

## Implemented and source-reviewed, not fully emulated here
- prefers-reduced-motion live change handling; no-JS content stays visible; canvas stops offscreen/on document hidden; DPR capped at 1.5.
- Touch interaction uses native button tap rather than pointer tilt.
- Safari / real iPhone and exact final Pages deployment still require publisher verification. Cloud browser API has no supported viewport/reduced-motion emulation, so responsive iframe tests do not constitute real-device testing.

## Publication handoff
- Copy all archive contents into new repo (no enclosing directory), preserving .github/workflows/pages.yml.
- npm run check; enable Pages source GitHub Actions; commit/push main; monitor workflow exact commit.
- Verify published homepage, credits.html, CSS/JS, three image loads, badge flip, pause, mobile widths, and anchors at /personal-portfolio/.
- Preview images are intentionally hosted at user's existing public project URLs; text and links remain usable when unavailable. Do not replace them with fabricated client content.
- No screenshot artifacts are included; visual QA screenshots were internal browser inspection only.
