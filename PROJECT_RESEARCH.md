# Portfolio project inventory and source evidence

Verified on 2026-11-02 through the owner’s GitHub repository metadata, public README/source reads, and public deployment responses. Source repositories were not modified. Private application code and user materials were not read or copied.

## Coverage

`project-data.json` currently contains **13 distinct cases**: four visual projects (Красота), five practical products (Бизнес), and four experiments (Эксперименты). The GitHub account inventory contains 17 repositories: 16 public repositories and one private development repository. Repository count is not used as project count: supporting repositories and alternate versions are grouped, while independently deployed projects within the public site repository receive their own cases.

Five missing public entries were researched: Faith over Fear, L’atelier, Главный герой, ORBIT, and B2 Sprint. The user then explicitly clarified that L’atelier and Pocket Chef are one project; they are consolidated into the `latelier` case, reducing the integrated total from 14 to 13. `node tools/generate-pages.mjs` regenerates the catalog and case pages from the complete data array. This inventory task edits only the data and this evidence document; page generation, styling and integrated browser checks belong to the parent task.

## Catalog

| Case / slug | Primary evidence | Editorial constraints |
|---|---|---|
| Faith over Fear / `faithoverfear` | [package](https://github.com/Valorin777/faithoverfear/blob/main/package.json), [source](https://github.com/Valorin777/faithoverfear/tree/main/src), [deployment](https://faithoverfear-one.vercel.app/) | Commissioned client project, explicitly confirmed by the user in this session: «Упомяни что faithof это проект на заказ был». Next.js/React/TypeScript, Payload CMS, Tailwind. Catalog, product, cart, checkout, account and CMS implementation exist. Product fixtures use placeholder imagery. Do not infer client identity, successful payments, sales, budget, live stock or commercial traction. |
| Окошко / `okoshko` | [README](https://github.com/Valorin777/okoshko), [bot README](https://github.com/Valorin777/okoshko/blob/main/bot/README.md) | Expo/React Native/TypeScript and Telegram Mini App; primary backend is FastAPI. Cloudflare Workers/D1 is the original implementation. No app-store publication claim. |
| L’atelier / Pocket Chef / `latelier` | [L’atelier README](https://github.com/Valorin777/latelier/blob/main/README.md), [Pocket Chef README](https://github.com/Valorin777/pocket-chef/blob/main/README.md), [older repository](https://github.com/Valorin777/latelier-ai-platform) | User-confirmed single project with version history. L’atelier: home-ingredient cooking PWA/TMA, JavaScript/Firebase, FastAPI/aiogram, OpenRouter. Pocket Chef: later offline recipe-composition engine with Capacitor iOS/Android projects. No essay-generator, app-store publication or proven nutrition-precision claim. |
| LAST WIND / `last-wind` | [README](https://github.com/Valorin777/field-form) | Current project at historical `field-form` address; four compositions, image-based character with localized cloth deformation, not skeletal 3D. |
| Freelance Bot / `freelance-bot` | [README](https://github.com/Valorin777/freelance-bot) | Telethon → Firestore → LLM filter → draft → aiogram card. Final client response is sent manually. No unattended sending claim. |
| Лекторий / `lektoriy` | [README](https://github.com/Valorin777/lektoriy) | Collaborative project with Владик (@SAMSAIU); audio notes, subject notebooks, attachments, Word export. Avoid claiming future specification items are complete. |
| RusJet / `rusjet` | [README](https://github.com/Valorin777/rusjet-cinema-concept), [media notices](https://github.com/Valorin777/rusjet-cinema-concept/blob/main/THIRD_PARTY.md) | Independent concept; licensed real footage; not an airline client claim, no invented fleet data. Manager link unconfigured. |
| Главный герой / `glavny-geroy` | [public-build README](https://github.com/Valorin777/glavny-geroy-play/blob/main/README.md), [demo](https://valorin777.github.io/glavny-geroy-play/#/play/couple) | Public browser 3D story build. The source application and user data remain private; the authoring workshop is not part of the Pages build. Link label is “Опубликованная сборка,” not “Исходный код.” No private memories or personal story content included in the case. |
| ORBIT / `orbit` | [published page](https://valorin777.github.io/orbit/), [implementation](https://github.com/Valorin777/Valorin777.github.io/blob/main/orbit/index.html) | Separate single-file visual experiment: three imagined planets, Three.js/GLSL, OrbitControls, optional Web Audio. Public page credits creation with Codex. No real geographic/scientific data claim. |
| Хроносфера / `sochi` | [README](https://github.com/Valorin777/sochi), [sources](https://valorin777.github.io/sochi/istochniki/) | HSE team coursework, twelve location-based chapters, explicit shared authorship. |
| Кто знает Владоса? / `vlados-quiz` | [README](https://github.com/Valorin777/vlados-quiz) | TV/phones/admin synced through Firestore; React/TypeScript/Zustand. README states played at a party. Public source repository omits private videos. Do not copy media from historical deployed builds. |
| Focus+ / `focus-plus` | [study-v7](https://github.com/Valorin777/focus-plus/tree/main/study-v7), [protocol](https://github.com/Valorin777/focus-plus/blob/main/study-v7/PROTOCOL.md) | Educational zero-price experiment; hypothetical choice, random groups, pre-specified protocol. Earlier synthetic/demo data excluded; no experimental result claimed. |
| B2 Sprint / `b2-sprint` | [published app](https://valorin777.github.io/b2/), [compiled build](https://github.com/Valorin777/Valorin777.github.io/tree/main/b2), [course bundle](https://valorin777.github.io/b2/_next/static/chunks/37jfep3pbo1yi.js) | Seven-day English practice app: diagnostic/final tests, course days, drills, review cards, speaking and error log. Next.js/React, localStorage, optional Firebase sync. Do not present “B1 to B2 in seven days” as a proven learning outcome or claim backend/coach availability from code alone. |

## Grouping and exclusions

- The user explicitly confirmed that L’atelier and Pocket Chef are the same project. `latelier`, `latelier-ai-platform`, and `pocket-chef` are grouped into the `latelier` case as version history: cloud AI cooking app followed by an offline mobile implementation. The earlier assumption of two distinct products is superseded by this correction. Source READMEs establish their technical differences, not separate product identity.
- `pocketchef-privacy` is supporting policy hosting for the same cooking project, not an additional app. The `pocket-chef` case entry was removed; the parent task handles any legacy case URL redirect. No GitHub repositories were modified by this inventory task.
- The private development repository and public `glavny-geroy-play` build form one Главный герой case. Only the public build is linked.
- `Valorin777.github.io` hosts Окошко’s landing/legal/deep-link files plus several deployments. `b2/` and `orbit/` are distinct projects; `sochi/` and `sochi-preview/` belong to Хроносфера; `vlados/` and `vlados-preview/` belong to the existing quiz. The root is not another portfolio project.
- `personal-portfolio` is the current site, not a separate duplicate case. `field-form` is the repository for the current LAST WIND project.
- Zakup and Deal Guard were supplied as project leads, but no matching repository or relevant entry in the inspected artifacts index was found. A narrowly scoped Personal Context query for their ownership, scope and implementation status returned “Personal context is unavailable for this conversation.” No implementation, live deployment, or outcome is inferred. They remain outside the verified catalog pending a specific source or conversation evidence.

## Public links and availability

The existing audit verified HTTP 200 for getokoshko.ru, LAST WIND, RusJet, Хроносфера, and Focus+ study-v7. The expanded audit verified HTTP 200 for Faith over Fear’s Vercel deployment, ORBIT, and B2 Sprint. Главный герой’s public root HTML loads, and its exact hash demo route `#/play/couple` matches the public README.

`https://faithof.ru` timed out after a network check, so the verified Vercel deployment is used. `https://prolatelier.ru/` produced an SSL hostname mismatch; no current live link is shown. The original quiz project Pages root returned 404 in the earlier audit. Historical domain-repository quiz deployments were identified but are not added as demos because their bundled private event media were not reviewed for reuse. Freelance Bot, Лекторий and the merged cooking project link to verified public sources without guessed live addresses.

HTTP responses establish public availability, not correctness of every interactive or server-backed feature. Gameplay and learning progress were not interacted with during this inventory audit.

## Visual assets and truthful presentation

LAST WIND, RusJet and Sochi retain existing local project assets. New application covers use typographic/graphic compositions, visibly identified as illustrations rather than screenshots. No external stock garment images or invented product screenshots are supplied.

Faith over Fear has a verified [512px brand icon](https://raw.githubusercontent.com/Valorin777/faithoverfear/main/public/icons/icon-512.png), but no verified public garment images in the inspected product data. L’atelier’s public assets include [featured dish artwork](https://raw.githubusercontent.com/Valorin777/latelier/main/images/dish_steak.webp) and [brand icon](https://raw.githubusercontent.com/Valorin777/latelier/main/icon-512.png); original image provenance was not independently established, so this task did not import them.

Faith over Fear’s commissioned-client status comes from the user’s explicit statement. No client identity, budget, sales, revenue, audience metrics, testimonials or measured outcomes were invented. The new data contains no decorative emoji. Private repository source and personal memories were not used as portfolio content.

## Validation

Data validation checks unique slugs, required scalar/array fields, four feature objects per added case, known categories, public-only source/demo URLs and absence of private repository links. Case generation and visual QA must be run after the final catalog is integrated; earlier checks for nine pages and category counts 3/4/2 are superseded by this inventory.

## Professional biography update

The user explicitly requested that Faith over Fear be described as commissioned work. This direct user statement establishes the client-project relationship without requiring a public client name or contract. The portfolio copy now marks it as a client store project. Professional background and stack evidence are mapped in `BIO_EVIDENCE.md`; missing first-year and Moscow details are not inferred from repository activity.
