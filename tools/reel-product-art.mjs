// Original editorial diagrams are intentionally not screenshots or user data.
const img = (src, w, h) => `<img src="assets/v5/${src}" width="${w}" height="${h}" alt="" loading="lazy" decoding="async">`;
const layer = (depth, name, content) => `<div class="rp-layer rp-${name}" data-flight-layer="${depth}">${content}</div>`;
const pills = (list) => list.map(item => `<span>${item}</span>`).join('');
const trace = (kind) => `<svg viewBox="0 0 500 170" fill="none" preserveAspectRatio="none"><path d="${kind}" stroke="currentColor" stroke-width="1.2" vector-effect="non-scaling-stroke" stroke-dasharray="3 6"/></svg>`;

export const productArt = {
  okoshko: {
    caption:'Связал график мастера, выбор свободного времени и подтверждение записи в веб-сервисе и Telegram.',
    role:'Собственный сервис записи',
    label:'Фрагмент обложки · Схема записи',
    layout:'right',
    art:
      layer('far','ok-grid','') +
      layer('main','ok-print',`<div>${img('okoshko-og.png',1200,630)}</div>`) +
      layer('near','ok-slot','<div><small>ПУТЬ КЛИЕНТА</small><b>Выбор времени</b><div class="rp-slots"><i></i><i></i><i></i><i></i></div><span>Подтверждение записи</span></div>') +
      layer('detail','ok-tab','<div>РАБОЧИЙ ГРАФИК</div>'),
  },
  'hse-coffee': {
    caption:'Вместе с однокурсником разрабатываю мини-приложение, где студент видит расписание подключённой группы, оценки и дедлайны.',
    role:'Совместная разработка',
    label:'Схема',
    layout:'left',
    art:
      layer('far','hse-spine','<div>HSE<br>COFFEE</div>') +
      layer('main','hse-plan',`<div><small>УЧЕБНАЯ ГРУППА</small><b>Расписание</b><div class="rp-days">${pills(['ПН','ВТ','СР','ЧТ','ПТ'])}<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>`) +
      layer('near','hse-grades','<div><small>ПОДКЛЮЧЁННЫЕ ВЕДОМОСТИ</small><b>Оценки</b><p>Учебные работы</p><p>Результат по дисциплине</p></div>') +
      layer('detail','hse-note','<div>ДЕДЛАЙНЫ И ФАЙЛЫ</div>'),
  },
  faithoverfear: {
    caption:'Сделал на заказ интернет-магазин бренда одежды: от витрины и карточек товаров до корзины; в портфолио сохранил часть интерфейса.',
    role:'Клиентский интернет-магазин',
    label:'Снимок главной страницы',
    layout:'wide',
    art:
      layer('far','faith-halo','<div></div><div></div><div></div>') +
      layer('main','faith-print',`<div>${img('faith-site.jpg',1250,500)}</div>`) +
      layer('near','faith-ticket','<div><small>FAITH OVER FEAR</small><b>Фрагмент витрины</b><span>Архивный экран</span></div>'),
  },
  latelier: {
    caption:'Развил кулинарный проект от облачного AI-шефа L’atelier до Pocket Chef, который составляет рецепты на устройстве без интернета.',
    role:'Кулинарное приложение · Две версии',
    label:'Схема версий',
    layout:'left',
    art:
      layer('far','chef-route',trace('M5 144 C95 40 164 30 240 101 S400 136 493 45')) +
      layer('main','chef-cloud','<div><small>ОБЛАЧНАЯ ВЕРСИЯ</small><b>L’atelier</b><i class="rp-plate"><i></i></i><span>AI-шеф</span></div>') +
      layer('near','chef-offline','<div><small>ЛОКАЛЬНЫЙ ДВИЖОК</small><b>Pocket Chef</b><i class="rp-plate"><i></i></i><span>Рецепт без интернета</span></div>') +
      layer('detail','chef-note','<div>ИЗ ПРОДУКТОВ, КОТОРЫЕ ЕСТЬ ДОМА</div>'),
  },
  'freelance-bot': {
    caption:'Автоматизировал отбор заказов из Telegram и подготовку черновиков; отправку отклика оставил человеку.',
    role:'Персональный инструмент автоматизации',
    label:'Схема обработки',
    layout:'right',
    art:
      layer('far','bot-route',trace('M0 19 H113 L209 73 H279 L384 52 H499 M0 85 H132 L209 73 M0 149 H120 L209 73')) +
      layer('main','bot-in','<div><small>TELEGRAM-КАНАЛЫ</small><b>Поток заказов</b><i></i><i></i><i></i></div>') +
      layer('detail','bot-filter','<div><small>ОТБОР</small><b>Стек<br>Бюджет</b></div>') +
      layer('near','bot-draft','<div><small>НА ПРОВЕРКУ</small><b>Черновик отклика</b><p>Решение за человеком</p></div>'),
  },
  lektoriy: {
    caption:'Вместе с командой разрабатываю Telegram-приложение, которое превращает запись лекции в конспект и связывает его с материалами по предмету.',
    role:'Совместная разработка · Telegram',
    label:'Схема конспекта',
    layout:'left',
    art:
      layer('far','lec-back','<div></div>') +
      layer('main','lec-wave',`<div><small>ИСХОДНЫЙ МАТЕРИАЛ</small><b>Запись лекции</b><i>${[12,20,34,19,44,48,22,64,38,50,77,42,82,54,30,65,23,44,29,18,28,15,22,12].map(h=>`<em style="--rp-wave:${h}%"></em>`).join('')}</i></div>`) +
      layer('near','lec-paper','<div><small>ПОСЛЕ РАСПОЗНАВАНИЯ</small><b>Конспект</b><p>01&nbsp; Темы</p><p>02&nbsp; Основные тезисы</p><p>03&nbsp; Материалы</p></div>') +
      layer('detail','lec-tab','<div>ТЕТРАДЬ ПО ПРЕДМЕТУ</div>'),
  },
};
