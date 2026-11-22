'use strict';
(() => {
  const browser = document.querySelector('[data-work-browser]');
  if (!browser) return;
  const control = browser.querySelector('[data-work-switch]');
  if (!control) return;
  const modes = [...control.querySelectorAll('button[data-work-mode]')];
  const views = new Map([...browser.querySelectorAll('[data-work-view]')]
    .map(view => [view.dataset.workView, view]));
  if (!['grid', 'theater', 'reel'].every(mode =>
    views.has(mode) && modes.some(button => button.dataset.workMode === mode))) return;

  const grid = views.get('grid');
  const filters = [...grid.querySelectorAll('button[data-work-filter]')];
  const cards = [...grid.querySelectorAll('[data-work-card]')];
  const categories = new Set(filters.map(button => button.dataset.workFilter));
  const status = grid.querySelector('[data-work-status]');
  const anchors = new Map([
    ['#project-theater', 'theater'],
    ['#reel-sites', 'reel'],
    ['#reel-tools', 'reel'],
    ['#reel-lab', 'reel'],
  ]);
  const privateKey = 'valorinPortfolioWorkViews';
  const returning = performance.getEntriesByType('navigation')[0]?.type === 'back_forward';
  const saved = returning ? history.state?.[privateKey] : null;
  let mode = 'grid', category = 'all';

  function showMode(value) {
    mode = views.has(value) ? value : 'grid';
    for (const [name, view] of views) view.hidden = name !== mode;
    for (const button of modes) {
      button.setAttribute('aria-pressed', String(button.dataset.workMode === mode));
    }
  }

  function filterGrid(value) {
    category = categories.has(value) ? value : 'all';
    let shown = 0;
    for (const card of cards) {
      const keep = category === 'all' ||
        (card.dataset.workCategory || '').split(/\s+/).includes(category);
      card.hidden = !keep;
      if (keep) shown++;
    }
    for (const button of filters) {
      button.setAttribute('aria-pressed', String(button.dataset.workFilter === category));
    }
    if (status) status.textContent = `Показано проектов: ${shown} из ${cards.length}`;
  }

  function openFragment() {
    const hash = location.hash;
    if (!anchors.has(hash)) return;
    showMode(anchors.get(hash));
    // Unhide synchronously so native fragment navigation can find the target.
    // If it ran before deferred scripts, replay only this known fragment.
    requestAnimationFrame(() => {
      if (location.hash !== hash || mode !== anchors.get(hash)) return;
      document.getElementById(hash.slice(1))?.scrollIntoView({block: 'start', behavior: 'instant'});
    });
  }

  for (const button of modes) {
    button.addEventListener('click', () => showMode(button.dataset.workMode));
  }
  for (const button of filters) {
    button.addEventListener('click', () => filterGrid(button.dataset.workFilter));
  }
  window.addEventListener('hashchange', openFragment);
  window.addEventListener('pagehide', () => {
    try {
      history.replaceState({...history.state, [privateKey]: {mode, category}}, '');
    } catch {
      // Back still uses native navigation if writes are unavailable.
    }
  });

  filterGrid(saved?.category);
  if (views.has(saved?.mode)) showMode(saved.mode);
  else if (anchors.has(location.hash)) openFragment();
  else showMode('grid');
  control.hidden = false;
  const filterControls = grid.querySelector('[data-work-filters]');
  if (filterControls) filterControls.hidden = false;
})();
