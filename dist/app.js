'use strict';
(() => {
  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.catalog-card[data-category]')];
  if (filters.length && cards.length) {
    const values = new Set(filters.map(button => button.dataset.filter));
    const status = document.querySelector('#filter-status');

    function applyFilter(value, updateURL = false) {
      const selected = values.has(value) ? value : 'all';
      let count = 0;
      for (const card of cards) {
        const show = selected === 'all' || card.dataset.category.split(/\s+/).includes(selected);
        card.hidden = !show;
        if (show) count++;
      }

      for (const button of filters) {
        const active = button.dataset.filter === selected;
        button.setAttribute('aria-pressed', String(active));
        button.classList.toggle('is-active', active);
      }
      if (status) status.textContent = `Показано проектов: ${count}`;
      if (updateURL) {
        const url = new URL(window.location.href);
        url.hash = selected === 'all' ? '' : selected;
        history.replaceState(history.state, '', url);
      }
    }

    for (const button of filters) {
      button.addEventListener('click', () => applyFilter(button.dataset.filter, true));
    }
    window.addEventListener('hashchange', () => applyFilter(location.hash.slice(1)));
    applyFilter(location.hash.slice(1));
  }

  const progress = document.querySelector('#progress');
  if (!progress) return;
  let frame = 0;

  function paintProgress() {
    frame = 0;
    const range = document.documentElement.scrollHeight - innerHeight;
    const amount = range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0;
    progress.style.transform = `scaleX(${amount})`;
  }

  function requestProgress() {
    if (!frame) frame = requestAnimationFrame(paintProgress);
  }

  window.addEventListener('scroll', requestProgress, { passive: true });
  window.addEventListener('resize', requestProgress, { passive: true });
  window.addEventListener('load', requestProgress, { once: true });
  if ('ResizeObserver' in window) new ResizeObserver(requestProgress).observe(document.body);
  requestProgress();
})();
