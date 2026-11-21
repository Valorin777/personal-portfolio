import {readFileSync,writeFileSync} from 'node:fs';
const data=JSON.parse(readFileSync('project-data.json','utf8'));
const contact=JSON.parse(readFileSync('contact-data.json','utf8'));
const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const n=String(data.length).padStart(2,'0');
const categoryLabel=category=>data.filter(project=>project.category===category).length;
const head=(title,description,extra='')=>`<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#12141c"><title>${title} — Валерий Чарыгин</title><meta name="description" content="${description}"><meta property="og:title" content="${title} — Валерий Чарыгин"><meta property="og:description" content="${description}"><meta property="og:type" content="website"><link rel="icon" href="icon.svg" type="image/svg+xml"><link rel="preload" href="assets/manrope-regular.ttf" as="font" type="font/ttf" crossorigin><link rel="preload" href="assets/manrope-bold.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="style.css?v=6.0.0"><script src="app.js?v=6.0.0" defer></script>${extra}</head>`;
const header=(active='')=>`<a class="skip" href="#main-content">Перейти к содержанию</a><div id="progress" aria-hidden="true"></div><header class="site-header"><a class="wordmark" href="index.html" aria-label="Валерий Чарыгин — главная">Валерий Чарыгин<small>Разработка и дизайн</small></a><nav class="main-nav" aria-label="Главная навигация"><a href="work.html">Проекты <sup>${n}</sup></a><a href="about.html" ${active==='about'?'aria-current="page"':''}>Обо мне</a><a href="index.html#contact">Контакт</a></nav></header>`;
const footer=()=>`<footer class="site-footer"><span>© 2026 ВАЛЕРИЙ ЧАРЫГИН</span><a href="${escapeHtml(contact.telegramUrl)}" target="_blank" rel="noopener noreferrer">Telegram</a><a href="credits.html">Материалы и авторство</a><a href="#top">Наверх</a></footer>`;
const external='target="_blank" rel="noopener noreferrer"';
const contactActions=()=>`<div class="contact-actions"><a class="button button-primary" href="${escapeHtml(contact.telegramUrl)}" ${external}>Написать в Telegram</a></div>`;
const openingHead=`<script>
  if (matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    document.documentElement.classList.add('opening-pending');
    window.addEventListener('load', () => {
      if (!document.querySelector('#motion:not([hidden])')) {
        document.documentElement.classList.remove('opening-pending');
      }
    }, { once: true });
  }
</script><link rel="stylesheet" href="editorial.css?v=6.1.0">`;
const home=`${head('Личное портфолио','Я делаю сайты, приложения и интерактивные истории. Мои проекты, стек и контакты.',openingHead)}<body class="home-page" id="top">${header()}
<main id="main-content" tabindex="-1">
  <section class="opening section" aria-labelledby="hero-title">
    <div class="opening-copy">
      <p class="edition-note">Личное портфолио</p>
      <h1 id="hero-title">Валерий <span>Чарыгин</span></h1>
      <p class="opening-lead">Делаю сайты, приложения и интерактивные истории.</p>
      <div class="opening-actions"><a class="button button-primary" href="work.html">Все проекты <sup>${n}</sup></a><a class="text-link" href="#selected">Избранные работы</a></div>
    </div>
    <figure class="opening-figure">
      <a class="opening-art moving-art" href="projects/last-wind.html" aria-label="Открыть кейс LAST WIND">
        <span class="opening-scene">
          <img class="opening-field" src="assets/v5/last-wind-field.webp" alt="" width="1672" height="941" fetchpriority="high">
          <img class="opening-ronin" src="assets/v5/last-wind-ronin.webp" alt="" width="1024" height="1536">
        </span>
      </a>
      <figcaption>
        <div><a href="projects/last-wind.html">LAST WIND</a><span>Интерактивный фильм</span></div>
        <button id="motion" class="motion-control" type="button" aria-pressed="false" hidden>Остановить анимацию</button>
      </figcaption>
    </figure>
    <div class="opening-foot"><span>Бизнес-информатика, НИУ ВШЭ</span><a class="text-link" href="about.html">Обо мне</a></div>
  </section>

  <section class="selected-work section" id="selected" aria-labelledby="selected-title">
    <div class="selected-header">
      <h2 id="selected-title">Избранные работы</h2>
    </div>
    <div class="editorial-grid">
      <article class="editorial-project editorial-jet">
        <a class="project-art moving-art" href="projects/rusjet.html" aria-label="Открыть кейс RusJet">
          <span class="project-reel">
            <video data-ambient-video muted loop playsinline preload="none" poster="assets/v5/rusjet-taxi-poster.jpg" aria-hidden="true"><source src="assets/v5/rusjet-taxi.mp4" type="video/mp4"></video>
          </span>
        </a>
        <div class="project-caption">
          <div><p class="project-kind">Независимый концепт</p><h3><a href="projects/rusjet.html">RusJet</a></h3></div>
          <p>Авиационный сайт с реальной съёмкой и переходами, которые связаны с прокруткой.</p>
        </div>
      </article>
      <article class="editorial-project editorial-sochi">
        <a class="project-art moving-art" href="projects/sochi.html" aria-label="Открыть кейс Хроносферы">
          <span class="project-reel">
            <img src="assets/sochi.jpg" alt="Закат над Чёрным морем" width="1200" height="630" loading="lazy" decoding="async">
          </span>
        </a>
        <div class="project-caption">
          <div><p class="project-kind">Командный учебный проект</p><h3><a href="projects/sochi.html">Хроносфера</a></h3></div>
          <p>Двенадцать глав об истории Сочи. Архивные кадры, карты и сравнения «тогда и сейчас».</p>
        </div>
      </article>
      <article class="editorial-project editorial-okoshko">
        <a class="project-art moving-art" href="projects/okoshko.html" aria-label="Открыть кейс Окошка">
          <span class="project-reel">
            <img src="assets/v5/okoshko-og.png" alt="Графическая обложка сервиса Окошко" width="1200" height="630" loading="lazy" decoding="async">
          </span>
        </a>
        <div class="project-caption">
          <div><p class="project-kind">Сервис онлайн-записи</p><h3><a href="projects/okoshko.html">Окошко</a></h3></div>
          <p>Объединил запись, расписание и уведомления в одном сервисе для мастеров и преподавателей.</p>
        </div>
      </article>
    </div>
    <nav class="work-index" id="project-index-title" aria-label="Каталог проектов">
      <a href="work.html"><strong>Все проекты</strong><span>${n}</span></a>
      <a href="work.html#beauty"><strong>Красота</strong><span>${categoryLabel('beauty')}</span></a>
      <a href="work.html#business"><strong>Бизнес</strong><span>${categoryLabel('business')}</span></a>
      <a href="work.html#experiments"><strong>Эксперименты</strong><span>${categoryLabel('experiments')}</span></a>
    </nav>
  </section>

  <section class="personal-essay section" aria-labelledby="personal-title">
    <h2 id="personal-title">Обо мне</h2>
    <div>
      <p>Учусь на бизнес-информатике в НИУ ВШЭ. Делаю сайты на React и Next.js, приложения на React Native и Expo, ботов на Python.</p>
      <p>«Лекторий» делаю вместе с Владиком. «Хроносфера» — командный учебный проект. В разработке использую AI и проверяю полученный результат.</p>
      <a class="text-link" href="about.html">Образование, стек и подход</a>
    </div>
  </section>

  <section class="editorial-contact section" id="contact" aria-labelledby="contact-title">
    <h2 id="contact-title">На связи</h2>
    ${contactActions()}
    <span class="contact-handle">@${escapeHtml(contact.telegramUsername)}</span>
  </section>
</main>${footer()}<script src="editorial.js?v=6.1.0" defer></script></body></html>`;
const about=`${head('Обо мне','Я учусь на бизнес-информатике в НИУ ВШЭ и разрабатываю сайты и приложения. Мой стек, подход и роли в проектах.')}<body class="about-page" id="top">${header('about')}<main class="page-main" id="main-content" tabindex="-1">
<section class="about-hero section" aria-labelledby="about-title"><p class="eyebrow">ДИЗАЙН И РАЗРАБОТКА / VALORIN</p><h1 id="about-title">Валерий <em>Чарыгин</em></h1><div class="about-hero-bottom"><span class="oversized-monogram" aria-hidden="true">ВЧ</span><div><p class="large-copy">Разрабатываю сайты,<br>мобильные приложения<br>и Telegram-ботов.</p><p>Учусь на бизнес-информатике в НИУ ВШЭ и занимаюсь веб- и мобильной разработкой. В моих проектах есть сервис записи, Telegram-приложения, учебные инструменты и интерактивные веб-сцены.</p><p>«Окошко» — мой сервис записи к специалистам, а «Лекторий» — совместный проект для работы с лекциями. В отдельных кейсах описаны задачи, технологии и текущий статус.</p></div></div><dl class="about-facts reveal" aria-label="Образование и профессиональные направления"><div><dt>Образование</dt><dd>НИУ ВШЭ</dd></div><div><dt>Программа</dt><dd>Бизнес-информатика</dd></div><div><dt>Направления</dt><dd>Веб, мобильные приложения<br>и интерактивная графика</dd></div><div><dt>В работе</dt><dd>Дизайн, код<br>и AI-инструменты</dd></div></dl></section>
<section class="about-fields section" aria-labelledby="fields-title"><div class="section-heading reveal"><p class="eyebrow">01 / ЧЕМ ЗАНИМАЮСЬ</p><h2 id="fields-title">Что я<br><em>делаю.</em></h2><p>Сервисы, учебные приложения<br>и интерактивные сайты.</p></div><div class="about-field-grid"><article class="reveal"><span class="role-label">ПРОДУКТЫ И СЕРВИСЫ</span><h3>Сервисы и приложения.</h3><p>«Окошко» помогает вести запись к специалистам, «Лекторий» собирает материалы лекций, L’atelier / Pocket Chef подбирает рецепты. Для этих задач разрабатываю интерфейсы и работу с данными.</p><div class="project-references"><a class="text-link" href="projects/okoshko.html">Окошко</a><a class="text-link" href="projects/lektoriy.html">Лекторий</a></div></article><article class="reveal"><span class="role-label">УЧЕБНЫЕ ПРИЛОЖЕНИЯ</span><h3>Практика и обучение.</h3><p>XcelMini помогает осваивать Excel через короткие уроки и сюжетный квест. B2 Sprint объединяет упражнения по английскому и повторение. Focus+ — учебный опрос об эффекте нулевой цены.</p><div class="project-references"><a class="text-link" href="projects/xcelmini.html">XcelMini</a><a class="text-link" href="projects/b2-sprint.html">B2 Sprint</a></div></article><article class="reveal"><span class="role-label">ИНТЕРАКТИВНЫЕ ИСТОРИИ</span><h3>Графика и анимация.</h3><p>В LAST WIND прокрутка управляет камерой, светом и сменой сцен. В ORBIT можно вращать и приближать вымышленные планеты. В этих проектах использую веб-графику и анимацию.</p><div class="project-references"><a class="text-link" href="projects/last-wind.html">LAST WIND</a><a class="text-link" href="projects/orbit.html">ORBIT</a></div></article></div></section>
<section class="about-stack section" aria-labelledby="stack-title"><div class="section-heading reveal"><p class="eyebrow">02 / СТЕК В РЕАЛЬНЫХ РАБОТАХ</p><h2 id="stack-title">Мой стек.<br><em>На примерах.</em></h2><p>Технологии из представленных<br>проектов, с примерами применения.</p></div><div class="stack-groups"><article class="reveal"><span class="role-label">01 / ВЕБ-ИНТЕРФЕЙСЫ</span><h3>Веб-разработка.</h3><ul class="stack-list"><li>React</li><li>Next.js</li><li>TypeScript</li><li>HTML / CSS</li></ul><p>B2 Sprint собран на Next.js и React. В «Лектории» интерфейс работает на HTML, CSS и JavaScript без сборки.</p><div class="project-references"><a class="text-link" href="projects/lektoriy.html">Лекторий</a><a class="text-link" href="projects/b2-sprint.html">B2 Sprint</a></div></article><article class="reveal"><span class="role-label">02 / МОБИЛЬНЫЕ ПРИЛОЖЕНИЯ</span><h3>Мобильная разработка.</h3><ul class="stack-list"><li>React Native</li><li>Expo</li><li>TypeScript</li><li>Capacitor</li></ul><p>«Окошко» использует Expo и React Native, включая веб-версию для Telegram. В истории L’atelier / Pocket Chef есть мобильные проекты на Capacitor для iOS и Android.</p><div class="project-references"><a class="text-link" href="projects/okoshko.html">Окошко</a><a class="text-link" href="projects/latelier.html">L’atelier / Pocket Chef</a></div></article><article class="reveal"><span class="role-label">03 / СЕРВЕР И АВТОМАТИЗАЦИЯ</span><h3>Серверы и боты.</h3><ul class="stack-list"><li>Python</li><li>Node.js</li><li>SQLite</li><li>FastAPI</li><li>Firebase / Firestore</li><li>aiogram</li><li>Telethon</li></ul><p>API, Telegram-боты, хранение данных и обработка событий. XcelMini использует Node.js и SQLite для синхронизации учебного прогресса. В Freelance Bot обработка сообщений помогает отбирать заказы и готовить черновики ответов.</p><div class="project-references"><a class="text-link" href="projects/freelance-bot.html">Freelance Bot</a><a class="text-link" href="projects/lektoriy.html">Лекторий</a></div></article><article class="reveal"><span class="role-label">04 / ГРАФИКА И ДВИЖЕНИЕ</span><h3>Графика и анимация.</h3><ul class="stack-list"><li>Three.js</li><li>GLSL</li><li>GSAP</li><li>Canvas</li><li>CSS</li></ul><p>В LAST WIND графика и шейдеры создают среду, а прокрутка управляет композицией. В RusJet движение построено вокруг реальных видеоматериалов и переходов между сценами.</p><div class="project-references"><a class="text-link" href="projects/last-wind.html">LAST WIND</a><a class="text-link" href="projects/rusjet.html">RusJet</a></div></article></div></section>
<section class="about-process section" aria-labelledby="process-title"><div class="section-heading reveal"><p class="eyebrow">03 / ПРОЦЕСС</p><h2 id="process-title">Как я<br><em>работаю.</em></h2><p>Задача, прототип<br>и проверка результата.</p></div><div class="process-row reveal"><span>01</span><h3>Разобраться<br><em>в задаче.</em></h3><p>Сначала определяю, что должен делать сайт или приложение: какие экраны нужны, какие данные хранить и как пользователь будет с ними работать.</p></div><div class="process-row reveal"><span>02</span><h3>Собрать<br><em>прототип.</em></h3><p>Собираю первую рабочую версию. AI помогает с поиском решений и написанием кода. Затем проверяю, что получилось, и исправляю ошибки.</p></div><div class="process-row reveal"><span>03</span><h3>Проверить<br><em>работу.</em></h3><p>Проверяю ссылки, кнопки, формы и отображение на телефоне. Отдельно смотрю, что происходит при ошибках и повторных действиях. Для анимированных сайтов проверяю режим уменьшения движения.</p></div></section>
<section class="about-roles section" aria-labelledby="roles-title"><div class="section-heading reveal"><p class="eyebrow">04 / МОЯ РОЛЬ В РАБОТАХ</p><h2 id="roles-title">Моя роль<br><em>в проектах.</em></h2><p>Учебные проекты,<br>совместная работа и свои идеи.</p></div><div class="role-list"><article class="reveal"><span class="role-label">УЧЕБНЫЙ ИНСТРУМЕНТ</span><h3>B2 Sprint</h3><p>Собрал тренажёр английского с диагностикой, занятиями и повторением. Прогресс сохраняется в браузере; семидневная структура задаёт порядок практики.</p><div class="project-references"><a class="text-link" href="projects/b2-sprint.html">О тренажёре B2 Sprint</a></div></article><article class="reveal"><span class="role-label">СОВМЕСТНАЯ РАЗРАБОТКА</span><h3>Лекторий</h3><p>Совместный проект с Владиком (@SAMSAIU). Telegram Mini App объединяет аудиозаписи, подготовку конспектов и учебные материалы. В портфолио он представлен как общая работа.</p><div class="project-references"><a class="text-link" href="projects/lektoriy.html">Об устройстве Лектория</a></div></article><article class="reveal"><span class="role-label">КОМАНДНЫЙ УЧЕБНЫЙ ПРОЕКТ</span><h3>Хроносфера</h3><p>Работа команды НИУ ВШЭ по курсу «Основы российской государственности»: документальный маршрут по Сочи с главами, картами и архивами. Авторы отдельных глав указаны на сайте.</p><div class="project-references"><a class="text-link" href="projects/sochi.html">О Хроносфере</a></div></article><article class="reveal"><span class="role-label">АВТОРСКИЕ ПРОЕКТЫ</span><h3>Продукты и эксперименты</h3><p>Собственные идеи развиваю в разных форматах: «Окошко» — как сервис записи, Freelance Bot — как прикладной инструмент, LAST WIND и ORBIT — как исследования интерактивного веба. Учебные работы и независимые концепты отдельно обозначены в кейсах.</p><div class="project-references"><a class="text-link" href="projects/okoshko.html">Окошко</a><a class="text-link" href="projects/freelance-bot.html">Freelance Bot</a><a class="text-link" href="work.html#experiments">Эксперименты</a></div></article></div></section>
<section class="about-contact section" aria-labelledby="about-contact-title"><p class="eyebrow">ОБСУДИМ ВАШУ ИДЕЮ</p><h2 id="about-contact-title">На связи.</h2><p>Если хотите обсудить проект или предложить совместную работу, напишите мне в Telegram.</p>${contactActions()}<p class="contact-handle">Telegram: @${escapeHtml(contact.telegramUsername)}</p></section>
<section class="about-next section"><p class="eyebrow">ПОДРОБНОСТИ — В РАБОТАХ</p><a class="all-work reveal" href="work.html"><span>Смотреть проекты <sup>${n}</sup></span></a><p>В каждом кейсе — задача, устройство, текущий статус и ссылки на доступные материалы.</p></section>
</main>${footer()}</body></html>`;
const credits=`${head('Материалы и авторство','Источники, лицензии и авторство материалов личного портфолио.')}<body id="top">${header()}<main class="page-main" id="main-content" tabindex="-1"><section class="catalog-hero section"><p class="eyebrow">МАТЕРИАЛЫ И АВТОРСТВО</p><h1>За кадром.</h1></section><div class="credits-content section"><section class="case-section"><h2>Оформление</h2><div class="case-prose"><p>В своём портфолио я использую выразительную типографику и сценарий прокрутки. Главная показывает материалы реальных проектов.</p><p>В каталоге часть обложек — графические иллюстрации идеи приложения. Они подписаны отдельно и не выдаются за снимки интерфейса.</p></div></section><section class="case-section"><h2>Материалы проектов</h2><div class="case-prose"><p>Для обложки LAST WIND я использовал снимок сайта, а для сцены — фон и AI-персонажа из проекта. «Окошко» — официальная графическая обложка сервиса. XcelMini — снимок опубликованного Excel-тренера.</p><p>Для RusJet я использовал авиационные кадры авторов <a class="text-link" href="https://www.pexels.com/video/airplane-preparing-for-take-off-1650628/" ${external}>Jake Heinemann</a> и <a class="text-link" href="https://www.pexels.com/video/luxury-private-jet-on-tarmac-at-dusk-34746862/" ${external}>Joerg Mangelsen</a>. Использую их по <a class="text-link" href="https://www.pexels.com/license/" ${external}>лицензии Pexels</a>.</p><p><a class="text-link" href="https://valorin777.github.io/sochi/istochniki/" ${external}>Хроносфера: источники и авторство</a> — обложка командного учебного проекта.</p><p>В каждом кейсе я указываю формат работы, статус и доступные демонстрации. Снимки сделаны в ноябре 2026 года; проекты могут меняться.</p></div></section><section class="case-section"><h2>Шрифт</h2><div class="case-prose"><p>Manrope распространяется по SIL Open Font License. Файлы размещены вместе с сайтом.</p><a class="text-link" href="assets/Manrope-OFL.txt">Лицензия Manrope</a></div></section><section class="case-section"><h2>Приватность<br>и движение</h2><div class="case-prose"><p>Сайт не использует аналитику и формы сбора данных. Для связи указан мой Telegram. Шрифты и медиа хранятся вместе с сайтом.</p><p>Кнопка «Остановить анимацию» останавливает движение изображений и видео в избранных работах. Системная настройка уменьшения движения учитывается автоматически. Все кейсы доступны из каталога независимо от анимации.</p></div></section></div></main>${footer()}</body></html>`;
for(const [name,html] of Object.entries({index:home,about,credits}))writeFileSync(`dist/${name}.html`,html+'\n');
console.log(`Generated home, about, credits for ${data.length} projects.`);

writeFileSync("dist/projects/pocket-chef.html", `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta name="theme-color" content="#12141c"><link rel="stylesheet" href="../style.css?v=6.0.0"><script src="../app.js?v=6.0.0" defer></script><meta http-equiv="refresh" content="0;url=latelier.html"><link rel="canonical" href="latelier.html"><title>L’atelier / Pocket Chef — один проект</title></head><body><h1>L’atelier / Pocket Chef</h1><p>История версий объединена в один кейс.</p><a href="latelier.html">Открыть кейс</a></body></html>\n`);

