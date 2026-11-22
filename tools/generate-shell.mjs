import {readFileSync,writeFileSync} from 'node:fs';
import {homeCases} from './resume-home.mjs';
import {getTheaterCases} from './theater-cases.mjs';
import {renderFlightReel} from './flight-reel.mjs';
import {renderEditorialArt} from './editorial-art.mjs';
import {cineArt} from './cine-art.mjs';
const data=JSON.parse(readFileSync('project-data.json','utf8'));
const contact=JSON.parse(readFileSync('contact-data.json','utf8'));
const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const n=String(data.length).padStart(2,'0');
const categoryLabel=category=>data.filter(project=>project.category===category).length;
const head=(title,description,extra='')=>`<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#12141c"><title>${title} — Валерий Чарыгин</title><meta name="description" content="${description}"><meta property="og:title" content="${title} — Валерий Чарыгин"><meta property="og:description" content="${description}"><meta property="og:type" content="website"><link rel="icon" href="icon.svg" type="image/svg+xml"><link rel="preload" href="assets/manrope-regular.ttf" as="font" type="font/ttf" crossorigin><link rel="preload" href="assets/manrope-bold.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="style.css?v=6.0.0"><script src="app.js?v=6.0.0" defer></script>${extra}</head>`;
const innerStyle='<link rel="stylesheet" href="folio.css?v=10.0.0"><link rel="stylesheet" href="folio-inner.css?v=10.0.0">';
const header=(active='')=>`<a class="skip" href="#main-content">Перейти к содержанию</a><div id="progress" aria-hidden="true"></div><header class="folio-nav"><div class="section folio-nav-main"><a class="folio-brand" href="index.html" aria-label="Валерий Чарыгин — главная"><span aria-hidden="true">ВЧ</span>Валерий Чарыгин</a><nav aria-label="Главная навигация"><a href="work.html">Проекты</a><a href="about.html" ${active==='about'?'aria-current="page"':''}>Обо мне</a><a href="index.html#contact">Контакт</a></nav></div></header>`;
const footer=()=>`<footer class="site-footer"><span>© 2026 ВАЛЕРИЙ ЧАРЫГИН</span><a href="${escapeHtml(contact.telegramUrl)}" target="_blank" rel="noopener noreferrer">Telegram</a><a href="credits.html">Материалы и авторство</a><a href="#top">Наверх</a></footer>`;
const external='target="_blank" rel="noopener noreferrer"';
const contactActions=()=>`<div class="contact-actions"><a class="button button-primary" href="${escapeHtml(contact.telegramUrl)}" ${external}>Написать в Telegram</a></div>`;
const theaterCases=getTheaterCases(data,homeCases);
const theaterFrame=({id,title,kind,art,accent,word},index)=>{
  const homePose=index===0?'center':index===1?'right':index===theaterCases.length-1?'left':'';
  const source=art?`${homePose?'src':'data-theater-src'}="${escapeHtml(art.src)}"`:'';
  const cover=`<div class="theater-cover"><span>${escapeHtml(kind)}</span><strong>${escapeHtml(word||title)}</strong></div>`;
  const surface=id==='last-wind'
    ? `<img class="theater-field" src="assets/v5/last-wind-field.webp" alt="" width="1672" height="941" fetchpriority="high">`
    : art ? `<img ${source} data-fit="${escapeHtml(art.fit)}" alt="" width="${art.width}" height="${art.height}" decoding="async">` : '';
  const foreground=id==='last-wind'
    ? `<div class="theater-foreground"><img class="theater-ronin" src="assets/v5/last-wind-ronin.webp" alt="" width="1024" height="1536" fetchpriority="high"></div>` : '';
  return `<div class="theater-frame" data-theater-frame="${id}"${homePose?` data-home-pose="${homePose}"`:''} aria-hidden="true">
    <div class="theater-surface" style="--cover-base:${escapeHtml(accent[0])};--cover-light:${escapeHtml(accent[1])}">${cover}${surface}</div>${foreground}
  </div>`;
};
const projectFor=id=>data.find(p=>p.slug===id);
const cFor=id=>theaterCases.find(p=>p.id===id);
const sequenceProjects=[
  {id:'okoshko',label:'Окошко',kind:'Собственный продукт',work:'Сделал сервис записи к частным специалистам. Клиент выбирает свободное время, мастер получает подтверждение в Telegram.',credit:'Обложка и схема записи'},
  {id:'hse-coffee',label:'Coffee',kind:'Совместная разработка',work:'Вместе с однокурсником делаю Telegram Mini App: расписание подключённых групп, оценки из ведомостей и дедлайны.',credit:'Схема учебных экранов'},
  {id:'last-wind',label:'LAST WIND',kind:'Интерактивная графика',work:'Снятый в коде фильм: я связал движение камеры, свет и шейдерную анимацию с прокруткой.',credit:'Подлинные слои проекта'}
];
const cinemaBeat=({id,kind,work,credit},i)=>{
  const c=cFor(id);
  return `<article class="cine-beat" id="cine-${id}" data-cine-stop="${id}">
    <div class="cine-beat-copy"><p class="cine-overline"><span>${i+1} / 3</span>${escapeHtml(kind)}</p>
    <h2>${escapeHtml(c.title)}</h2><p class="cine-beat-text">${escapeHtml(work)}</p>
    <a class="text-link cine-case-link" href="projects/${id}.html" aria-label="Открыть кейс ${escapeHtml(c.title)}">Открыть кейс</a></div>
    <figure class="cine-static-preview">${renderEditorialArt(c,{featured:true})}<figcaption>${escapeHtml(credit)}</figcaption></figure>
  </article>`;
};
const cinemaStage=`<div class="cine-stage-wrap">
  <div class="cine-stage" data-cine-stage>
    <div class="cine-frame" aria-hidden="true">
      <div class="cine-projection"></div>
      <div class="cine-sweep"></div>
      <div class="cine-world" data-cine-world>
        ${sequenceProjects.map(({id})=>`<div class="cine-plate" data-cine-plate="${id}">${cineArt[id]}</div>`).join('')}
      </div>
      <div class="cine-branding"><span>ВЫБРАННЫЕ ПРОЕКТЫ</span><span data-cine-frame-index>01 / 03</span></div>
    </div>
    <nav class="cine-scene-index" aria-label="Три избранные работы">
      ${sequenceProjects.map(({id,label},i)=>`<a href="#cine-${id}" data-cine-tab="${id}"${i===0?' aria-current="location"':''} aria-label="${escapeHtml(cFor(id).title)}"><span aria-hidden="true">0${i+1}</span>${escapeHtml(label)}</a>`).join('')}
    </nav>
  </div>
</div>`;
const galleryCard=c=>{
  const p=projectFor(c.id);
  return `<article class="folio-card" data-work-card data-work-category="${escapeHtml(p.category)}">
    <a class="folio-gallery-link" href="projects/${escapeHtml(c.id)}.html">
      <div class="folio-gallery-media">${renderEditorialArt(c)}</div>
      <div class="folio-card-copy"><p class="folio-kind">${escapeHtml(c.kind)}</p><h3>${escapeHtml(c.title)}</h3></div>
    </a>
  </article>`;
};
const homeHeader=()=>`<a class="skip" href="#main-content">Перейти к содержанию</a><div id="progress" aria-hidden="true"></div>
  <header class="folio-nav" data-folio-nav>
    <div class="folio-nav-main section">
      <a class="folio-brand" href="#top" aria-label="Валерий Чарыгин: главная"><span aria-hidden="true">ВЧ</span>Валерий Чарыгин</a>
      <nav aria-label="Главная навигация"><a href="#selected">Проекты</a><a href="#profile">Обо мне</a><a href="#contact">Контакт</a></nav>
    </div>
  </header>`;
const theaterView=`<div class="project-theater" role="region" aria-label="Витрина проектов">
  <div class="theater-proscenium">
    <div class="theater-stage" data-theater-stage aria-label="Кадры проектов" role="group" aria-describedby="theater-instructions">
      <div class="theater-world">${theaterCases.map(theaterFrame).join('')}</div>
    </div>
  </div>
  <div class="theater-caption">
    <div class="theater-cases">${theaterCases.map(({id,title,kind,work},index)=>`
      <div class="theater-case" data-theater-case="${id}"${index ? ' hidden' : ''}>
        <div><p class="theater-kind">${escapeHtml(kind)}</p><h3 data-theater-title>${escapeHtml(title)}</h3></div>
        <p class="theater-work">${escapeHtml(work)}</p>
        <a class="text-link theater-link" data-theater-link href="projects/${id}.html" aria-label="Открыть кейс ${escapeHtml(title)}">Открыть кейс</a>
      </div>`).join('')}
    </div>
    <div class="theater-controls" data-theater-controls hidden>
      <div class="theater-steps" aria-label="Листать проекты" role="group">
        <button type="button" data-theater-step="-1">Назад</button>
        <span class="theater-count" data-theater-counter aria-hidden="true">01 / ${theaterCases.length}</span>
        <button type="button" data-theater-step="1">Далее</button>
      </div>
    </div>
  </div>
  <p class="visually-hidden" id="theater-instructions">Выберите проект перетаскиванием, кнопками «Назад» и «Далее» или клавишами влево и вправо.</p>
  <p class="visually-hidden" data-theater-status aria-live="polite" aria-atomic="true"></p>
</div>`;
const homeStyle=['editorial.css?v=7.1.0','flight.css?v=9.0.0','reel-product-art.css?v=8.0.0','reel-experiment-art.css?v=8.0.0','editorial-art.css?v=10.0.0','folio.css?v=10.0.0','cinematic.css?v=11.0.0','cine-art.css?v=11.0.0'].map(f=>`<link rel="stylesheet" href="${f}">`).join('');
const home=`${head('Личное портфолио','Веб-разработчик Валерий Чарыгин. Сайты, Telegram Mini Apps и интерактивная графика.',homeStyle)}<body class="home-page folio-page" id="top">${homeHeader()}
<main id="main-content" tabindex="-1">
  <section class="cine-sequence section" id="selected-sequence" aria-label="Валерий Чарыгин: избранные проекты" data-cine-sequence>
    <div class="folio-intro-copy cine-identity" data-folio-intro>
      <p class="folio-kicker"><span></span>Веб-разработчик</p>
      <h1 id="hero-title">Валерий <span>Чарыгин</span></h1>
      <p class="folio-intro-lead">Разрабатываю веб-сервисы и Telegram Mini Apps. Делаю интерактивную графику для сайтов.</p>
      <div class="folio-intro-actions">
        <a class="button button-primary" href="#cine-okoshko">Смотреть проекты</a>
        <a class="text-link" href="${escapeHtml(contact.telegramUrl)}" ${external}>Telegram</a>
      </div>
      <p class="folio-intro-meta">Бизнес-информатика, НИУ ВШЭ</p>
      <button type="button" id="motion" class="motion-control cine-motion" aria-pressed="false" hidden>Остановить движение</button>
    </div>
    ${cinemaStage}
    <div class="cine-beats">${sequenceProjects.map(cinemaBeat).join('')}</div>
    <div class="cine-finale"><a class="text-link" href="#selected">К сетке всех 15 работ</a></div>
  </section>

  <section class="folio-profile section" id="profile" aria-labelledby="profile-title" data-folio-section>
    <div class="folio-divider"><span>Подход и стек</span></div>
    <div class="folio-profile-body">
      <h2 id="profile-title">От интерфейса<br> до запуска.</h2>
      <div>
        <p>Учусь на бизнес-информатике в НИУ ВШЭ. Сам проектирую интерфейсы, связываю их с API и довожу до рабочего продукта. В HSE Coffee работаю вместе с однокурсником.</p>
        <a class="text-link" href="about.html">Подробнее обо мне</a>
      </div>
    </div>
    <dl class="folio-skills">
      <div><dt>Интерфейсы</dt><dd>React, Next.js, TypeScript</dd></div>
      <div><dt>Приложения и API</dt><dd>React Native, Expo, Python, FastAPI</dd></div>
      <div><dt>Графика и движение</dt><dd>Three.js, GLSL, GSAP</dd></div>
    </dl>
  </section>

  <section class="folio-work section" id="selected" aria-labelledby="selected-title" data-work-browser data-folio-section>
    <div class="folio-divider"><span>Портфолио</span></div>
    <div class="folio-work-head">
      <h2 id="selected-title">Проекты <span>${n}</span></h2>
    </div>
    <div class="folio-work-controls" data-work-switch role="group" aria-label="Вид проектов" hidden>
      <button type="button" data-work-mode="grid" aria-controls="work-grid" aria-pressed="true">Сетка</button>
      <button type="button" data-work-mode="theater" aria-controls="project-theater" aria-pressed="false">3D-витрина</button>
      <button type="button" data-work-mode="reel" aria-controls="work-reel" aria-pressed="false">Лента</button>
    </div>
    <div id="work-grid" data-work-view="grid">
      <div class="folio-filters" data-work-filters hidden role="group" aria-label="Направления проектов">
        <button type="button" data-work-filter="all" aria-pressed="true">Все</button>
        <button type="button" data-work-filter="business" aria-pressed="false">Продукты</button>
        <button type="button" data-work-filter="beauty" aria-pressed="false">Веб и графика</button>
        <button type="button" data-work-filter="experiments" aria-pressed="false">Эксперименты</button>
      </div>
      <p class="visually-hidden" data-work-status aria-live="polite"></p>
      <div class="folio-gallery">${theaterCases.map(galleryCard).join('')}</div>
    </div>
    <div id="project-theater" data-work-view="theater" hidden>${theaterView}</div>
    <div id="work-reel" data-work-view="reel" hidden>${renderFlightReel(theaterCases)}</div>
    <noscript><p><a class="text-link" href="work.html">Открыть каталог проектов</a></p></noscript>
  </section>

  <section class="folio-contact section" id="contact" aria-labelledby="contact-title" data-folio-section>
    <div class="folio-divider"><span>Контакт</span></div>
    <div class="folio-contact-inner">
      <div><h2 id="contact-title">Обсудим проект.</h2><p>Для предложений о работе и совместных проектах:</p></div>
      <a class="button button-primary" href="${escapeHtml(contact.telegramUrl)}" ${external}>Написать в Telegram <span>@${escapeHtml(contact.telegramUsername)}</span></a>
    </div>
  </section>
</main>${footer()}<script src="work-views.js?v=10.0.0" defer></script><script src="editorial.js?v=9.0.0" defer></script><script src="flight.js?v=9.0.0" defer></script><script src="folio.js?v=11.0.0" defer></script><script src="cinematic.js?v=11.0.0" defer></script></body></html>`;
const about=`${head('Обо мне','Я учусь на бизнес-информатике в НИУ ВШЭ и разрабатываю сайты и приложения. Мой стек, подход и роли в проектах.',innerStyle)}<body class="about-page folio-page" id="top">${header('about')}<main class="page-main" id="main-content" tabindex="-1">
<section class="about-hero section" aria-labelledby="about-title"><p class="eyebrow">ДИЗАЙН И РАЗРАБОТКА / VALORIN</p><h1 id="about-title">Валерий <em>Чарыгин</em></h1><div class="about-hero-bottom"><span class="oversized-monogram" aria-hidden="true">ВЧ</span><div><p class="large-copy">Разрабатываю сайты,<br>мобильные приложения<br>и Telegram-ботов.</p><p>Учусь на бизнес-информатике в НИУ ВШЭ и занимаюсь веб- и мобильной разработкой. В моих проектах есть сервис записи, Telegram-приложения, учебные инструменты и интерактивные веб-сцены.</p><p>«Окошко» — мой сервис записи к специалистам, а «Лекторий» — совместный проект для работы с лекциями. В отдельных кейсах описаны задачи, технологии и текущий статус.</p></div></div><dl class="about-facts reveal" aria-label="Образование и профессиональные направления"><div><dt>Образование</dt><dd>НИУ ВШЭ</dd></div><div><dt>Программа</dt><dd>Бизнес-информатика</dd></div><div><dt>Направления</dt><dd>Веб, мобильные приложения<br>и интерактивная графика</dd></div><div><dt>В работе</dt><dd>Дизайн, код<br>и AI-инструменты</dd></div></dl></section>
<section class="about-fields section" aria-labelledby="fields-title"><div class="section-heading reveal"><p class="eyebrow">01 / ЧЕМ ЗАНИМАЮСЬ</p><h2 id="fields-title">Что я<br><em>делаю.</em></h2><p>Сервисы, учебные приложения<br>и интерактивные сайты.</p></div><div class="about-field-grid"><article class="reveal"><span class="role-label">ПРОДУКТЫ И СЕРВИСЫ</span><h3>Сервисы и приложения.</h3><p>«Окошко» помогает вести запись к специалистам, «Лекторий» собирает материалы лекций, L’atelier / Pocket Chef подбирает рецепты. Для этих задач разрабатываю интерфейсы и работу с данными.</p><div class="project-references"><a class="text-link" href="projects/okoshko.html">Окошко</a><a class="text-link" href="projects/lektoriy.html">Лекторий</a></div></article><article class="reveal"><span class="role-label">УЧЕБНЫЕ ПРИЛОЖЕНИЯ</span><h3>Практика и обучение.</h3><p>XcelMini помогает осваивать Excel через короткие уроки и сюжетный квест. B2 Sprint объединяет упражнения по английскому и повторение. Focus+ — учебный опрос об эффекте нулевой цены.</p><div class="project-references"><a class="text-link" href="projects/xcelmini.html">XcelMini</a><a class="text-link" href="projects/b2-sprint.html">B2 Sprint</a></div></article><article class="reveal"><span class="role-label">ИНТЕРАКТИВНЫЕ ИСТОРИИ</span><h3>Графика и анимация.</h3><p>В LAST WIND прокрутка управляет камерой, светом и сменой сцен. В ORBIT можно вращать и приближать вымышленные планеты. В этих проектах использую веб-графику и анимацию.</p><div class="project-references"><a class="text-link" href="projects/last-wind.html">LAST WIND</a><a class="text-link" href="projects/orbit.html">ORBIT</a></div></article></div></section>
<section class="about-stack section" aria-labelledby="stack-title"><div class="section-heading reveal"><p class="eyebrow">02 / СТЕК В РЕАЛЬНЫХ РАБОТАХ</p><h2 id="stack-title">Мой стек.<br><em>На примерах.</em></h2><p>Технологии из представленных<br>проектов, с примерами применения.</p></div><div class="stack-groups"><article class="reveal"><span class="role-label">01 / ВЕБ-ИНТЕРФЕЙСЫ</span><h3>Веб-разработка.</h3><ul class="stack-list"><li>React</li><li>Next.js</li><li>TypeScript</li><li>HTML / CSS</li></ul><p>B2 Sprint собран на Next.js и React. В «Лектории» интерфейс работает на HTML, CSS и JavaScript без сборки.</p><div class="project-references"><a class="text-link" href="projects/lektoriy.html">Лекторий</a><a class="text-link" href="projects/b2-sprint.html">B2 Sprint</a></div></article><article class="reveal"><span class="role-label">02 / МОБИЛЬНЫЕ ПРИЛОЖЕНИЯ</span><h3>Мобильная разработка.</h3><ul class="stack-list"><li>React Native</li><li>Expo</li><li>TypeScript</li><li>Capacitor</li></ul><p>«Окошко» использует Expo и React Native, включая веб-версию для Telegram. В истории L’atelier / Pocket Chef есть мобильные проекты на Capacitor для iOS и Android.</p><div class="project-references"><a class="text-link" href="projects/okoshko.html">Окошко</a><a class="text-link" href="projects/latelier.html">L’atelier / Pocket Chef</a></div></article><article class="reveal"><span class="role-label">03 / СЕРВЕР И АВТОМАТИЗАЦИЯ</span><h3>Серверы и боты.</h3><ul class="stack-list"><li>Python</li><li>Node.js</li><li>SQLite</li><li>FastAPI</li><li>Firebase / Firestore</li><li>aiogram</li><li>Telethon</li></ul><p>API, Telegram-боты, хранение данных и обработка событий. XcelMini использует Node.js и SQLite для синхронизации учебного прогресса. В Freelance Bot обработка сообщений помогает отбирать заказы и готовить черновики ответов.</p><div class="project-references"><a class="text-link" href="projects/freelance-bot.html">Freelance Bot</a><a class="text-link" href="projects/lektoriy.html">Лекторий</a></div></article><article class="reveal"><span class="role-label">04 / ГРАФИКА И ДВИЖЕНИЕ</span><h3>Графика и анимация.</h3><ul class="stack-list"><li>Three.js</li><li>GLSL</li><li>GSAP</li><li>Canvas</li><li>CSS</li></ul><p>В LAST WIND графика и шейдеры создают среду, а прокрутка управляет композицией. В RusJet движение построено вокруг реальных видеоматериалов и переходов между сценами.</p><div class="project-references"><a class="text-link" href="projects/last-wind.html">LAST WIND</a><a class="text-link" href="projects/rusjet.html">RusJet</a></div></article></div></section>
<section class="about-process section" aria-labelledby="process-title"><div class="section-heading reveal"><p class="eyebrow">03 / ПРОЦЕСС</p><h2 id="process-title">Как я<br><em>работаю.</em></h2><p>Задача, прототип<br>и проверка результата.</p></div><div class="process-row reveal"><span>01</span><h3>Разобраться<br><em>в задаче.</em></h3><p>Сначала определяю, что должен делать сайт или приложение: какие экраны нужны, какие данные хранить и как пользователь будет с ними работать.</p></div><div class="process-row reveal"><span>02</span><h3>Собрать<br><em>прототип.</em></h3><p>Собираю первую рабочую версию. AI помогает с поиском решений и написанием кода. Затем проверяю, что получилось, и исправляю ошибки.</p></div><div class="process-row reveal"><span>03</span><h3>Проверить<br><em>работу.</em></h3><p>Проверяю ссылки, кнопки, формы и отображение на телефоне. Отдельно смотрю, что происходит при ошибках и повторных действиях. Для анимированных сайтов проверяю режим уменьшения движения.</p></div></section>
<section class="about-roles section" aria-labelledby="roles-title"><div class="section-heading reveal"><p class="eyebrow">04 / МОЯ РОЛЬ В РАБОТАХ</p><h2 id="roles-title">Моя роль<br><em>в проектах.</em></h2><p>Учебные проекты,<br>совместная работа и свои идеи.</p></div><div class="role-list"><article class="reveal"><span class="role-label">УЧЕБНЫЙ ИНСТРУМЕНТ</span><h3>B2 Sprint</h3><p>Собрал тренажёр английского с диагностикой, занятиями и повторением. Прогресс сохраняется в браузере; семидневная структура задаёт порядок практики.</p><div class="project-references"><a class="text-link" href="projects/b2-sprint.html">О тренажёре B2 Sprint</a></div></article><article class="reveal"><span class="role-label">СОВМЕСТНАЯ РАЗРАБОТКА</span><h3>Лекторий</h3><p>Совместный проект с Владиком (@SAMSAIU). Telegram Mini App объединяет аудиозаписи, подготовку конспектов и учебные материалы. В портфолио он представлен как общая работа.</p><div class="project-references"><a class="text-link" href="projects/lektoriy.html">Об устройстве Лектория</a></div></article><article class="reveal"><span class="role-label">КОМАНДНЫЙ УЧЕБНЫЙ ПРОЕКТ</span><h3>Хроносфера</h3><p>Работа команды НИУ ВШЭ по курсу «Основы российской государственности»: документальный маршрут по Сочи с главами, картами и архивами. Авторы отдельных глав указаны на сайте.</p><div class="project-references"><a class="text-link" href="projects/sochi.html">О Хроносфере</a></div></article><article class="reveal"><span class="role-label">АВТОРСКИЕ ПРОЕКТЫ</span><h3>Продукты и эксперименты</h3><p>Собственные идеи развиваю в разных форматах: «Окошко» — как сервис записи, Freelance Bot — как прикладной инструмент, LAST WIND и ORBIT — как исследования интерактивного веба. Учебные работы и независимые концепты отдельно обозначены в кейсах.</p><div class="project-references"><a class="text-link" href="projects/okoshko.html">Окошко</a><a class="text-link" href="projects/freelance-bot.html">Freelance Bot</a><a class="text-link" href="work.html#experiments">Эксперименты</a></div></article></div></section>
<section class="about-contact section" aria-labelledby="about-contact-title"><p class="eyebrow">ОБСУДИМ ВАШУ ИДЕЮ</p><h2 id="about-contact-title">На связи.</h2><p>Если хотите обсудить проект или предложить совместную работу, напишите мне в Telegram.</p>${contactActions()}<p class="contact-handle">Telegram: @${escapeHtml(contact.telegramUsername)}</p></section>
<section class="about-next section"><p class="eyebrow">ПОДРОБНОСТИ — В РАБОТАХ</p><a class="all-work reveal" href="work.html"><span>Смотреть проекты <sup>${n}</sup></span></a><p>В каждом кейсе — задача, устройство, текущий статус и ссылки на доступные материалы.</p></section>
</main>${footer()}</body></html>`;
const credits=`${head('Материалы и авторство','Источники, лицензии и авторство материалов личного портфолио.',innerStyle)}<body class="folio-page" id="top">${header()}<main class="page-main" id="main-content" tabindex="-1"><section class="catalog-hero section"><p class="eyebrow">МАТЕРИАЛЫ И АВТОРСТВО</p><h1>За кадром.</h1></section><div class="credits-content section"><section class="case-section"><h2>Оформление</h2><div class="case-prose"><p>В своём портфолио я использую выразительную типографику и сценарий прокрутки. В портфолио использую кадры, обложки и схемы проектов. Схемы не выдаю за снимки интерфейса.</p><p>В каталоге часть обложек — графические иллюстрации идеи приложения. Они подписаны отдельно и не выдаются за снимки интерфейса.</p></div></section><section class="case-section"><h2>Материалы проектов</h2><div class="case-prose"><p>Для обложки LAST WIND я использовал снимок сайта, а для сцены — фон и AI-персонажа из проекта. «Окошко» — официальная графическая обложка сервиса. XcelMini — снимок опубликованного Excel-тренера.</p><p>Для RusJet я использовал авиационные кадры авторов <a class="text-link" href="https://www.pexels.com/video/airplane-preparing-for-take-off-1650628/" ${external}>Jake Heinemann</a> и <a class="text-link" href="https://www.pexels.com/video/luxury-private-jet-on-tarmac-at-dusk-34746862/" ${external}>Joerg Mangelsen</a>. Использую их по <a class="text-link" href="https://www.pexels.com/license/" ${external}>лицензии Pexels</a>.</p><p><a class="text-link" href="https://valorin777.github.io/sochi/istochniki/" ${external}>Хроносфера: источники и авторство</a> — обложка командного учебного проекта.</p><p>В каждом кейсе я указываю формат работы, статус и доступные демонстрации. Снимки сделаны в ноябре 2026 года; проекты могут меняться.</p></div></section><section class="case-section"><h2>Шрифт</h2><div class="case-prose"><p>Manrope распространяется по SIL Open Font License. Файлы размещены вместе с сайтом.</p><a class="text-link" href="assets/Manrope-OFL.txt">Лицензия Manrope</a></div></section><section class="case-section"><h2>Приватность<br>и движение</h2><div class="case-prose"><p>Сайт не использует аналитику и формы сбора данных. Для связи указан мой Telegram. Шрифты и медиа хранятся вместе с сайтом.</p><p>Кнопка «Остановить движение» останавливает движение на главной, в витрине и в ленте проектов. Системная настройка уменьшения движения учитывается автоматически. Все кейсы доступны из каталога независимо от анимации.</p></div></section></div></main>${footer()}</body></html>`;
for(const [name,html] of Object.entries({index:home,about,credits}))writeFileSync(`dist/${name}.html`,html+'\n');
console.log(`Generated home, about, credits for ${data.length} projects.`);

writeFileSync("dist/projects/pocket-chef.html", `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta name="theme-color" content="#12141c"><link rel="stylesheet" href="../style.css?v=6.0.0"><script src="../app.js?v=6.0.0" defer></script><meta http-equiv="refresh" content="0;url=latelier.html"><link rel="canonical" href="latelier.html"><title>L’atelier / Pocket Chef — один проект</title></head><body><h1>L’atelier / Pocket Chef</h1><p>История версий объединена в один кейс.</p><a href="latelier.html">Открыть кейс</a></body></html>\n`);

