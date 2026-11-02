import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const projects = JSON.parse(readFileSync(resolve(root, 'project-data.json'), 'utf8'));
const categories = { beauty: 'Красота', business: 'Бизнес', experiments: 'Эксперименты' };
if (!Array.isArray(projects) || !projects.length) throw new Error('Project data must be a non-empty array');
const slugs = new Set();
for (const project of projects) {
  if (!project || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug) || slugs.has(project.slug)) throw new Error(`Invalid or duplicate project slug: ${project?.slug}`);
  if (!Object.hasOwn(categories, project.category)) throw new Error(`Unknown category for ${project.slug}: ${project.category}`);
  slugs.add(project.slug);
}
const textOnly = value => String(value).replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F\u200D\u20E3]/gu, '');
const esc = value => textOnly(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const num = number => String(number).padStart(2, '0');
const projectNoun = number => number % 100 >= 11 && number % 100 <= 14 ? 'проектов' : number % 10 === 1 ? 'проект' : number % 10 >= 2 && number % 10 <= 4 ? 'проекта' : 'проектов';
const countLabel = `${num(projects.length)} ${projectNoun(projects.length)}`;
const external = 'target="_blank" rel="noopener noreferrer"';

function head(title, description, prefix = '') {
  return `<!doctype html>
<html lang="ru"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f1efe8">
<title>${esc(title)} — Валерий Чарыгин</title><meta name="description" content="${esc(description)}">
<meta property="og:title" content="${esc(title)} — Валерий Чарыгин"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="website">
<link rel="icon" href="${prefix}icon.svg" type="image/svg+xml"><link rel="preload" href="${prefix}assets/manrope-bold.ttf" as="font" type="font/ttf" crossorigin>
<link rel="stylesheet" href="${prefix}style.css?v=3.0.0"><script src="${prefix}app.js?v=3.0.0" defer></script>
</head>`;
}

function header(prefix = '') {
  return `<a class="skip" href="#main-content">Перейти к содержанию</a><div id="progress" aria-hidden="true"></div>
<header class="site-header">
<a class="wordmark" href="${prefix}index.html" aria-label="Валерий Чарыгин — главная">ВАЛЕРИЙ<span>ЧАРЫГИН</span><small>DESIGN &amp; DEVELOPMENT</small></a>
<nav class="main-nav" aria-label="Главная навигация"><a href="${prefix}work.html" aria-current="page">Проекты <sup>${num(projects.length)}</sup></a><a href="${prefix}about.html">Об авторе</a><a href="${prefix}index.html#contact">Контакт ↗</a></nav>
</header>`;
}

function footer(prefix = '') {
  return `<footer class="site-footer"><span>© 2026 ВАЛЕРИЙ ЧАРЫГИН</span><a href="${prefix}credits.html">Материалы и авторство ↗</a><a href="#top">Наверх ↑</a></footer>`;
}

function visual(project, prefix = '', cover = false) {
  if (project.image) {
    return `<div class="catalog-card-media visual-${esc(project.visual)}${cover ? ' case-image-cover' : ''}"><img src="${prefix}assets/${esc(project.image)}" alt="${esc(project.imageAlt)}" loading="${cover ? 'eager' : 'lazy'}" ${project.visual === 'wind' ? 'width="1024" height="1536"' : project.visual === 'jet' ? 'width="1280" height="720"' : 'width="1200" height="630"'}><span class="product-kicker">${esc(project.visualKicker)}</span><span class="product-word">${esc(project.visualWord)}</span><span class="round-arrow" aria-hidden="true">↗</span></div>`;
  }
  return `<div class="catalog-card-media product-visual visual-${esc(project.visual)}" aria-hidden="true"><span class="product-orbit"></span><span class="product-kicker">${esc(project.visualKicker)}</span><span class="product-word">${esc(project.visualWord)}</span><div class="product-ui">${project.visualRows.map((row, i) => `<div class="product-ui-row"><span>${num(i + 1)}</span><b>${esc(row)}</b><i>↗</i></div>`).join('')}</div><span class="product-pill">${esc(project.stack.slice(0, 2).join(' / '))}</span><span class="round-arrow">↗</span></div>`;
}

function card(project, i) {
  return `<article class="catalog-card reveal" data-category="${project.category}">
<a class="catalog-card-link" href="projects/${project.slug}.html" aria-label="${esc(project.name)} — о проекте">${visual(project)}</a>
<div class="catalog-card-copy"><div class="catalog-meta"><span>${num(i + 1)} / ${categories[project.category]}</span><span>${esc(project.type)}</span></div><h2><a href="projects/${project.slug}.html">${esc(project.name)} <span aria-hidden="true">↗</span></a></h2><p>${esc(project.summary)}</p><div class="case-stack">${project.stack.slice(0, 3).map(item => `<span>${esc(item)}</span>`).join('')}</div></div>
</article>`;
}

const filterButtons = [['all', 'Все работы'], ...Object.entries(categories)].map(([key, label]) => `<button type="button" id="${key}" data-filter="${key}" aria-pressed="${key === 'all'}">${label} <span class="filter-count">${num(key === 'all' ? projects.length : projects.filter(project => project.category === key).length)}</span></button>`).join('');
const catalog = `${head('Проекты', `${projects.length} ${projectNoun(projects.length)} Валерия Чарыгина: визуальные сайты, сервисы, мобильные приложения и эксперименты.`)}
<body class="catalog-page" id="top">${header()}
<main class="page-main" id="main-content">
<section class="catalog-hero section" aria-labelledby="catalog-title"><p class="eyebrow">АРХИВ / ${countLabel.toLocaleUpperCase('ru')}</p><h1 id="catalog-title">От идеи<br>до <em>действия.</em></h1><div class="catalog-intro"><p>Визуальные сайты, прикладные продукты<br>и авторские эксперименты.</p><p>У каждой работы — своя задача.<br>Внутри — идея, устройство и детали.</p></div></section>
<section class="catalog-section section" aria-label="Каталог проектов"><div class="filter-bar" role="group" aria-label="Фильтр по направлению">${filterButtons}</div><p id="filter-status" class="filter-status" aria-live="polite" aria-atomic="true"></p><div class="catalog-grid">${projects.map(card).join('\n')}</div><p class="visual-note catalog-note">Обложки приложений — графические иллюстрации их идеи. Это не снимки реальных экранов.</p></section>
<section class="catalog-outro section reveal"><p class="eyebrow">ЧЕЛОВЕК ЗА ПРОЕКТАМИ</p><h2>Сначала любопытство.<br>Потом — всё остальное.</h2><a class="text-link" href="about.html">Обо мне и моём подходе <span aria-hidden="true">↗</span></a></section>
</main>${footer()}</body></html>\n`;
writeFileSync(resolve(root, 'dist/work.html'), catalog);
mkdirSync(resolve(root, 'dist/projects'), {recursive: true});

for (const [i, project] of projects.entries()) {
  const next = projects[(i + 1) % projects.length];
  const repoLink = typeof project.repo === 'string' && /^[A-Za-z0-9_.-]+$/.test(project.repo)
    ? `<a class="text-link" href="https://github.com/Valorin777/${esc(project.repo)}" ${external}>${esc(project.repoLabel || 'Исходный код')} <span aria-hidden="true">↗</span></a>`
    : '';
  const sourceLinks = project.sources.map((source, sourceIndex) => `<a href="${source}" ${external}>${sourceIndex === 0 ? 'Описание и исходные материалы' : 'Дополнительный источник'} <span aria-hidden="true">↗</span></a>`).join('');
  const page = `${head(project.name, project.summary, '../')}
<body class="case-page" id="top">${header('../')}
<main class="page-main" id="main-content">
<section class="case-hero section" aria-labelledby="case-title"><nav class="case-breadcrumb" aria-label="Хлебные крошки"><a href="../work.html">← Все работы</a><span>${categories[project.category]} / ${num(i + 1)}</span></nav><p class="eyebrow">${esc(project.type).toLocaleUpperCase('ru')}</p><h1 id="case-title">${esc(project.name)}${/[.!?]$/.test(project.name) ? '' : '<span>.</span>'}</h1><p class="case-tagline">${esc(project.tagline)}</p><p class="case-intro">${esc(project.summary)}</p><div class="case-facts"><div><span>НАПРАВЛЕНИЕ</span><strong>${categories[project.category]}</strong></div><div><span>ФОРМАТ</span><strong>${esc(project.type)}</strong></div></div><div class="case-actions">${project.demo ? `<a class="button button-primary" href="${project.demo}" ${external}>${esc(project.demoLabel)} <span aria-hidden="true">↗</span></a>` : ''}${repoLink}</div></section>
<figure class="case-cover section reveal">${visual(project, '../', true)}<figcaption class="visual-note">${project.image ? esc(project.name) + ' — визуальный материал проекта.' : 'Графическая иллюстрация идеи проекта; не снимок рабочего интерфейса.'}</figcaption></figure>
<div class="case-content section"><section class="case-section reveal" aria-labelledby="task-title"><div><p class="eyebrow">01 / ЗАДАЧА</p><h2 id="task-title">С чего всё<br>началось.</h2></div><div class="case-prose">${project.task.map(text => `<p>${esc(text)}</p>`).join('')}</div></section>
<section class="case-section reveal" aria-labelledby="architecture-title"><div><p class="eyebrow">02 / КАК УСТРОЕНО</p><h2 id="architecture-title">За первым<br>экраном.</h2></div><div class="case-prose">${project.architecture.map(text => `<p>${esc(text)}</p>`).join('')}<div class="case-stack">${project.stack.map(item => `<span>${esc(item)}</span>`).join('')}</div></div></section>
<section class="case-section case-section-wide reveal" aria-labelledby="features-title"><div><p class="eyebrow">03 / ЧТО ВНУТРИ</p><h2 id="features-title">Детали складываются<br>в целое.</h2></div><div class="case-columns">${project.features.map((feature, featureIndex) => `<article><span class="case-feature-number">${num(featureIndex + 1)}</span><h3>${esc(feature.title)}</h3><p>${esc(feature.text)}</p></article>`).join('')}</div></section>
<section class="case-section reveal" aria-labelledby="status-title"><div><p class="eyebrow">04 / СТАТУС</p><h2 id="status-title">Где проект<br>сейчас.</h2></div><div class="case-prose"><p>${esc(project.status)}</p><div class="case-sources">${sourceLinks}</div></div></section></div>
<nav class="case-navigation section" aria-label="Другие проекты"><a class="text-link" href="../work.html">← Все работы</a><a class="next-project" href="${next.slug}.html"><span class="eyebrow">СЛЕДУЮЩИЙ ПРОЕКТ</span><strong>${esc(next.name)} <span aria-hidden="true">↗</span></strong></a></nav>
</main>${footer('../')}</body></html>\n`;
  writeFileSync(resolve(root, 'dist/projects', `${project.slug}.html`), page);
}
console.log(`Generated catalog and ${projects.length} case pages.`);
