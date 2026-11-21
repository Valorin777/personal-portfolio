# Valerii Charygin — personal portfolio

Russian-language multipage personal portfolio, edition 06.
Live: https://valorininfo.online/

## Run and publish

No package dependencies. Serve `dist/` through a static HTTP server. `npm run generate` produces the catalog, cases, homepage, biography and credits from data and templates. `npm run check` validates JavaScript, page structure, local resources (including video posters), links, fragments, catalog count and approved contact links. GitHub Actions publishes `dist/` to GitHub Pages from `main`. Relative URLs support the project subpath.

## Experience

The homepage opens with Valerii’s name and a composition from LAST WIND. An editorial gallery presents RusJet, Хроносфера and Окошко alongside a category index.

Title, copy and controls remain in document flow. The opening frame unfolds when the artwork enters view, and scrolling moves its layers and opens the three gallery images along diagonal cuts. RusJet video plays while visible, with a poster fallback. The motion button and system reduced-motion setting show the full static artwork. Project and contact links work without JavaScript.

The site has 19 content pages, including 15 project cases, plus the Pocket Chef redirect and the separate Faith over Fear preview. Categories: Красота (4), Бизнес (7), Эксперименты (4).

## Content and contacts

The biography covers education, work areas, technologies with project examples, AI-assisted process and authorship. Faith over Fear is owner-confirmed commissioned work. Team work, independent concepts and prototypes are identified explicitly. No invented clients, revenue, audiences or results.

Public repository and deployment evidence is recorded in PROJECT_RESEARCH.md and BIO_EVIDENCE.md. L’atelier and Pocket Chef are one user-confirmed project with different versions. ASSET_SOURCES_V5.md identifies actual screenshots, official graphics, generated artwork and licensed footage. Remaining graphic covers are labelled as illustrations.

Contact buttons link to the Telegram profile in `contact-data.json`.

Manrope is served locally with its SIL OFL notice. There are no trackers, external font calls, runtime dependencies or paid services. RESEARCH.md documents the earlier design research.

Earlier editions remain in Git history: v1 `7f4a1d4`, v2 `4111ba9`, v3 `5e5994b`, v4 `2c5be8e`. Archive branches preserve previous editions.

## Faith over Fear archive (2026-11-07)

The catalog links directly to `previews/faithoverfear/index.html`. This is a partial static presentation of the preserved hero, about and mission blocks, not a complete restoration of the live store. The original domain/server is not modified. The notice explains the owner-reported server expiry and lack of server access. Current CMS media, products and reviews are unavailable and are not invented or replaced with demo stock.

Only rendered HTML/CSS and locally hosted OFL fonts are included. No application source, backend, CMS, account data, secrets, forms, scripts, payment integration, analytics or service worker are included. CSP blocks scripts, form submissions and network connections. Font license notices are next to the font assets. The private application repository remains private. The static preview is maintained separately from the portfolio page generators.
