// Presentation data only. Claims and image metadata come from project-data.json;
// the first three cases retain the reviewed copy in resume-home.mjs.
const featuredOrder = ['last-wind', 'rusjet', 'okoshko', 'hse-coffee', 'faithoverfear'];
const featuredCopy = new Set(featuredOrder.slice(0, 3));

// Each pair is a dark base and a quiet highlight for a typographic cover.
const palettes = {
  'last-wind': ['#141923', '#33314a'],
  rusjet: ['#181c28', '#353143'],
  okoshko: ['#241c26', '#49303e'],
  'hse-coffee': ['#211b21', '#4b343c'],
  faithoverfear: ['#221d31', '#493350'],
  latelier: ['#241d1c', '#4c3731'],
  'freelance-bot': ['#181e2b', '#2d3851'],
  lektoriy: ['#211d2d', '#413354'],
  xcelmini: ['#201e2c', '#3d3a57'],
  'glavny-geroy': ['#221c27', '#4b2f44'],
  orbit: ['#141929', '#2d3556'],
  sochi: ['#251d23', '#54383d'],
  'vlados-quiz': ['#1f1c2a', '#443054'],
  'focus-plus': ['#231d24', '#483240'],
  'b2-sprint': ['#1c1e2b', '#343c55']
};

const conciseWork = {
  'hse-coffee': 'Разрабатываю вместе с однокурсником Telegram-бот и мини-приложение для студентов ВШЭ: расписание подключённых групп, оценки и дедлайны.',
  faithoverfear: 'Разработал магазин на заказ; основной сервер недоступен, сохранён частичный HTML-просмотр без заказов и оплаты.',
  latelier: 'Кулинарный проект в двух версиях: облачный AI-шеф L’atelier и офлайн-движок Pocket Chef для рецептов из домашних продуктов.',
  'freelance-bot': 'Бот отбирает заказы из Telegram-каналов и готовит черновики откликов; окончательный ответ отправляю сам.',
  lektoriy: 'Совместное мини-приложение: записи лекций превращаются в конспекты, а учебные материалы собираются по предметам.',
  xcelmini: 'Excel-тренер в Telegram: короткие уроки, самостоятельная практика и 30 заданий сюжетного квеста с сохранением прогресса.',
  'glavny-geroy': 'Браузерный 3D-прототип с вымышленным игровым сценарием, опубликованный как игровая демоверсия.',
  orbit: 'Интерактивный атлас трёх вымышленных планет: вращение, масштаб, процедурный ландшафт, атмосфера и синтезированный звук.',
  sochi: 'Командный учебный проект о Сочи: двенадцать глав, архивные фотографии, карты и сравнения «тогда и сейчас».',
  'vlados-quiz': 'Викторина для вечеринки: вопросы на общем экране, ответы с телефонов и отдельный пульт ведущего.',
  'focus-plus': 'Учебный эксперимент НИУ ВШЭ об эффекте нулевой цены: два ценовых условия, гипотетический выбор и зафиксированный протокол.',
  'b2-sprint': 'Семидневный тренажёр английского: грамматика, устойчивые сочетания, разговорная практика и повторение сложных тем уровня B2.'
};

function getArt(project) {
  // LAST WIND has a dedicated composition of its separately sourced layers.
  if (project.slug === 'last-wind') return null;
  // The dusk frame is already sourced in ASSET_SOURCES_V5.md and used on site.
  if (project.slug === 'rusjet') {
    return { src: 'assets/v5/rusjet-dusk-poster.jpg', width: 1600, height: 904, fit: 'cover' };
  }
  if (typeof project.image !== 'string' || !project.image
    || !Number.isFinite(project.imageWidth) || project.imageWidth <= 0
    || !Number.isFinite(project.imageHeight) || project.imageHeight <= 0) return null;
  // Only local asset references are accepted; a missing cover stays typographic.
  const relative = project.image.replace(/^assets\//, '');
  if (relative.startsWith('/') || relative.includes('..') || relative.includes(':') || relative.includes('\\')) return null;
  return {
    src: `assets/${relative}`,
    width: project.imageWidth,
    height: project.imageHeight,
    // Branded covers and interface captures retain their complete composition.
    fit: project.slug === 'sochi' || project.imageKind === 'film' ? 'cover' : 'contain'
  };
}

/**
 * Return unique cases in featured order, then the input's canonical order.
 * accent is [baseHex, highlightHex]; art is null or { src, width, height, fit }.
 * No input data is mutated and no source imagery is generated or fetched.
 */
export function getTheaterCases(projectData, homeCases = []) {
  if (!Array.isArray(projectData)) throw new TypeError('projectData must be an array');
  const projects = new Map();
  for (const project of projectData) {
    if (!project?.slug || projects.has(project.slug)) continue;
    projects.set(project.slug, project);
  }
  const reviewed = new Map(homeCases.map(item => [item.id, item]));
  const order = [...featuredOrder.filter(id => projects.has(id)), ...projects.keys()].filter((id, index, all) => all.indexOf(id) === index);
  return order.map(id => {
    const project = projects.get(id);
    const copy = featuredCopy.has(id) ? reviewed.get(id) : null;
    return {
      id,
      title: copy?.title || project.name,
      kind: copy?.kind || project.type,
      work: copy?.work || conciseWork[id] || project.summary,
      art: getArt(project),
      accent: [...(palettes[id] || ['#1c1c28', '#393247'])],
      word: project.visualWord || project.name
    };
  });
}
