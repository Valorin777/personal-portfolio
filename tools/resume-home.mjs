// Copy grounded in BIO_EVIDENCE.md, project-data.json and the existing about page.
export const resumeHome = `
<section class="resume-brief section" id="about-brief" aria-labelledby="resume-brief-title">
  <h2 id="resume-brief-title">Коротко обо мне</h2>
  <div class="resume-grid">
    <div class="resume-line">
      <h3>Образование</h3>
      <p>Учусь на бизнес-информатике в НИУ ВШЭ.</p>
    </div>
    <div class="resume-line">
      <h3>Что делаю</h3>
      <p>Разрабатываю сайты, приложения и Telegram-инструменты. Продумываю интерфейсы, связываю их с данными и добавляю интерактивную графику.</p>
    </div>
    <div class="resume-line">
      <h3>Стек в моих проектах</h3>
      <p>React / Next.js, TypeScript, React Native / Expo, Python / FastAPI, Three.js, GLSL и GSAP.</p>
    </div>
    <div class="resume-line">
      <h3>Командная работа</h3>
      <p>Работаю в команде над проектом «Лекторий».</p>
    </div>
  </div>
  <a class="text-link" href="about.html">Подробнее обо мне</a>
</section>`;

export const homeCases = [
  {
    id: 'okoshko',
    title: 'Окошко',
    kind: 'Собственный сервис записи',
    work: 'Объединяю приложение, API, Telegram-бот и публичный сайт в сервис записи к частным специалистам.'
  },
  {
    id: 'hse-coffee',
    title: 'HSE Coffee',
    kind: 'Совместная разработка',
    work: 'Вместе с однокурсником делаю Telegram Mini App с расписанием подключённых групп, оценками из ведомостей и дедлайнами.'
  },
  {
    id: 'one-zaabeel',
    title: 'One Za’abeel',
    kind: 'Архитектурный концепт',
    work: 'Собрал сайт о двух башнях в Дубае. Камера проходит под The Link, а три схемы помогают сравнить планировки.'
  }
];
