// Real project materials for the three existing scenes; the other scenes use
// project-specific compositions in the two art modules. No third-party runtime.
import { productArt } from './reel-product-art.mjs';
import { experimentArt } from './reel-experiment-art.mjs';

const esc = value => String(value).replace(/[&<>"']/g, char => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[char]));
const img = (src, width, height) =>
  `<img src="${src}" width="${width}" height="${height}" loading="lazy" decoding="async" alt="">`;
const originals = {
  'last-wind': {
    caption: 'Связал движение камеры, свет и шейдерную анимацию с прокруткой, чтобы зритель сам задавал темп фильма.',
    role: 'Авторский интерактивный фильм', label: 'Два слоя из фильма', layout: 'wide',
    art: `<div class="reel-film-frame reel-wind-field" data-flight-layer="main">${img('assets/v5/last-wind-field.webp', 1672, 941)}</div>
      <div class="reel-wind-character" data-flight-layer="near">${img('assets/v5/last-wind-ronin.webp', 1024, 1536)}</div>`,
  },
  rusjet: {
    caption: 'Собрал независимый авиационный концепт: прокрутка переводит зрителя между лицензированными кадрами аэродрома.',
    role: 'Независимый веб-концепт', label: 'Лицензированные кадры', layout: 'right',
    art: `<div class="reel-film-frame reel-jet-dusk" data-flight-layer="main">${img('assets/v5/rusjet-dusk-poster.jpg', 1600, 904)}</div>
      <div class="reel-film-frame reel-jet-taxi" data-flight-layer="near">${img('assets/v5/rusjet-taxi-poster.jpg', 1600, 900)}</div>`,
  },
  sochi: {
    caption: 'Вместе с командой сделал документальный маршрут по Сочи: в двенадцати главах можно сопоставить архивные фотографии и современные виды.',
    role: 'Командный учебный проект', label: 'Обложка проекта', layout: 'wide',
    art: `<div class="reel-shore-reflection" data-flight-layer="far">${img('assets/sochi.jpg', 1200, 630)}</div>
      <div class="reel-film-frame reel-shore-cover" data-flight-layer="main">${img('assets/sochi.jpg', 1200, 630)}</div>`,
  },
};

const chapters = [
  { id:'reel-sites', title:'От фильма до продукта', note:'Интерактивный веб, собственный сервис и клиентская работа.', end:5 },
  { id:'reel-tools', title:'Инструменты и прототипы', note:'Мобильный интерфейс, автоматизация, обучение и игровая демоверсия.', end:10 },
  { id:'reel-lab', title:'Сцены и эксперименты', note:'Веб-графика, командный сторителлинг и учебный эксперимент.', end:15 },
];

export function renderFlightReel(cases) {
  const subjects = {...originals, ...productArt, ...experimentArt};
  if (cases.length !== Object.keys(subjects).length || cases.some(({id}) => !subjects[id])) {
    throw new Error('Every portfolio case must have its own vertical reel composition.');
  }
  function scene(project) {
    const {id, title, accent} = project;
    const {art, caption, role, label, layout} = subjects[id];
    return `<article class="flight-beat flight-layout-${esc(layout)}" data-flight="${esc(id)}" aria-labelledby="flight-title-${esc(id)}">
      <div class="flight-identity">
        <p class="flight-role">${esc(role)}</p>
        <h4 id="flight-title-${esc(id)}">${esc(title)}</h4>
      </div>
      <figure class="flight-figure">
        <div class="flight-scene" data-flight-scene data-scene="${esc(id)}" style="--scene-base:${esc(accent[0])};--scene-light:${esc(accent[1])}" aria-hidden="true">
          <div class="flight-space">${art}</div>
        </div>
        <figcaption class="flight-provenance">${esc(label)}</figcaption>
      </figure>
      <div class="flight-copy">
        <p>${esc(caption)}</p>
        <a class="text-link flight-cta" data-flight-link href="projects/${esc(id)}.html" aria-label="Открыть кейс ${esc(title)}">Открыть кейс</a>
      </div>
    </article>`;
  }
  return `<nav class="flight-chapters" aria-label="Разделы ленты проектов">
    ${chapters.map(({id,title},i) => `<a href="#${esc(id)}"><span>${i + 1}</span>${esc(title)}</a>`).join('\n    ')}
  </nav>
  ${chapters.map(({id,title,note,end},i) => `<section class="flight-chapter" id="${esc(id)}" aria-labelledby="${esc(id)}-title">
    <header class="flight-chapter-heading">
      <h3 id="${esc(id)}-title">${esc(title)}</h3>
      <p>${esc(note)}</p>
    </header>
    <div class="flight-reel">
      ${cases.slice(chapters[i - 1]?.end ?? 0, end).map(scene).join('\n      ')}
    </div>
  </section>`).join('\n  ')}`;
}
