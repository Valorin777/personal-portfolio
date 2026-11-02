# Valerii Charygin — personal portfolio

Russian-language multipage personal portfolio, edition 05.
Live: https://valorin777.github.io/personal-portfolio/

## Run and publish

No package dependencies. Serve `dist/` through a static HTTP server. `npm run generate` produces the catalog, cases, homepage, biography and credits from data and templates. `npm run check` validates JavaScript, page structure, local resources (including video posters), links, fragments, catalog count and approved contact links. GitHub Actions publishes `dist/` to GitHub Pages from `main`. Relative URLs support the project subpath.

## Experience

Personal identity leads the design: large Manrope typography, real project media, layered graphite surfaces, violet and coral accents. No green UI palette, studio framing, abstract sculpture, arrow glyphs or emoji.

The homepage contains a native-scroll sequence of three full-screen projects. Panels enter from below, enlarge and cover the preceding scene while it recedes and darkens. The local RusJet video plays only when its active scene is visible. It pauses when covered, offscreen, hidden or motion is disabled. The controller does not intercept wheel or touch scrolling.

The pause control and system reduced-motion preference use a static, accessible sequence. Short landscape viewports also use ordinary document flow. Navigation and case links remain available without JavaScript. See QA.md for actual browser checks and their limits.

The site has 17 content pages: home, catalog, biography, credits and 13 individual project cases. A legacy `projects/pocket-chef.html` redirect preserves old links to the unified L’atelier / Pocket Chef case. Categories: Красота (4), Бизнес (5), Эксперименты (4). Hash filters are shareable.

## Content and contacts

The biography covers education, work areas, technologies with project examples, AI-assisted process and authorship. Faith over Fear is owner-confirmed commissioned work. Team work, independent concepts and prototypes are identified explicitly. No invented clients, revenue, audiences or results.

Public repository and deployment evidence is recorded in PROJECT_RESEARCH.md and BIO_EVIDENCE.md. L’atelier and Pocket Chef are one user-confirmed project with different versions. ASSET_SOURCES_V5.md identifies actual screenshots, official graphics, generated artwork and licensed footage. Remaining graphic covers are labelled as illustrations.

Contact buttons use only the Telegram profile and phone number supplied by the owner in `contact-data.json`. The phone link uses `tel:`. No contact message or call is initiated automatically.

Manrope is served locally with its SIL OFL notice. There are no trackers, external font calls, runtime dependencies or paid services. RESEARCH.md describes earlier research; edition 05 supersedes the previous sculpture design.

Earlier editions remain in Git history: v1 `7f4a1d4`, v2 `4111ba9`, v3 `5e5994b`, v4 `2c5be8e`. Archive branches preserve previous editions.
