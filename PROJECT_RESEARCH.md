# Expanded portfolio — source evidence

Verified on 2026-11-02 through public GitHub README/source reads using `gh api`; source repositories were not modified.

## Catalog

Nine cases, three visual projects (Красота), four practical products (Бизнес), two experiments (Эксперименты). `project-data.json` is the content source; `node tools/generate-pages.mjs` regenerates `dist/work.html` and `dist/projects/*.html` without changing other portfolio pages, CSS, or JavaScript.

| Case | Primary evidence | Editorial constraints |
|---|---|---|
| Окошко | [README](https://github.com/Valorin777/okoshko), [bot README](https://github.com/Valorin777/okoshko/blob/main/bot/README.md) | Expo/React Native/TypeScript and Telegram Mini App; primary backend is now FastAPI. Cloudflare Workers/D1 is the original implementation. No store-publication claim. |
| LAST WIND | [README](https://github.com/Valorin777/field-form) | Current project at historical `field-form` address; four compositions, image-based character with localized cloth deformation, not skeletal 3D. |
| Freelance Bot | [README](https://github.com/Valorin777/freelance-bot) | Telethon→Firestore→LLM filter→draft→aiogram card. Final client response is sent manually. No unattended sending claim. |
| Лекторий | [README](https://github.com/Valorin777/lektoriy) | Collaborative project with Владик (@SAMSAIU); audio notes, subject notebooks, attachments, Word export. Avoid claiming future specification items are already complete. |
| RusJet | [README](https://github.com/Valorin777/rusjet-cinema-concept), [media notices](https://github.com/Valorin777/rusjet-cinema-concept/blob/main/THIRD_PARTY.md) | Independent concept; licensed real footage; not an airline client claim, no invented fleet data. Manager link unconfigured. |
| Pocket Chef | [README](https://github.com/Valorin777/pocket-chef) | Offline recipe composition based on ingredients, technique templates and compatibility; Capacitor iOS/Android projects. No published-store claim. |
| Хроносфера | [README](https://github.com/Valorin777/sochi), [sources](https://valorin777.github.io/sochi/istochniki/) | HSE team coursework, twelve location-based chapters, explicit shared authorship. |
| Кто знает Владоса? | [README](https://github.com/Valorin777/vlados-quiz) | TV/phones/admin synced through Firestore; React/TypeScript/Zustand. README states played at a party. Private videos absent from public repo. |
| Focus+ | [study-v7](https://github.com/Valorin777/focus-plus/tree/main/study-v7), [protocol](https://github.com/Valorin777/focus-plus/blob/main/study-v7/PROTOCOL.md) | Educational zero-price experiment; hypothetical choice, random groups, pre-specified protocol. Earlier synthetic/demo data excluded; no claimed experimental result. |

## Public links

HTTP 200 verified for https://getokoshko.ru/, https://valorin777.github.io/field-form/, https://valorin777.github.io/rusjet-cinema-concept/, https://valorin777.github.io/sochi/, and https://valorin777.github.io/focus-plus/study-v7/.

The quiz GitHub Pages root and Pages API returned 404: no demo link included. Freelance Bot, Лекторий and Pocket Chef link to public source, without a guessed live address. GitHub source links use verified repository names.

## Images and preview honesty

LAST WIND, RusJet and Sochi use the existing local image assets already in the portfolio. The other six projects use original HTML/CSS compositions, visibly described as conceptual illustrations rather than screenshots. No usage counts, revenue, conversion metrics, clients, or testimonials invented.

## Checks

Static HTML parser checks cover the catalog and nine case pages: one h1 each, no duplicate IDs, relative asset/page links and fragments, nine cards, and category counts 3/4/2. All cards are in the initial HTML and remain visible without JavaScript. Filters are ordinary buttons with aria-pressed; the initial empty status has aria-live=polite. Parent integrates shared styling, filter behavior, and the About page.
