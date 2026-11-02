'use strict';
(() => {
  const root = document.documentElement;
  const body = document.body;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const motion = document.querySelector('#motion');
  const reveals = [...document.querySelectorAll('.reveal')];
  let revealObserver;
  let userPaused = body.classList.contains('motion-paused');
  const movementPaused = () => userPaused || reduced.matches;
  const videos = [...document.querySelectorAll('video[data-ambient-video]')].map(video => ({
    video, scene: video.closest('.film-scene'), film: video.closest('.project-film'),
    inView: false, pending: false, blocked: false, retryAfterAbort: false
  }));
  const filmVisibility = new Map(videos.filter(item => item.film).map(item => [item.film, false]));
  const videoRecords = new Map(videos.map(item => [item.video, item]));

  function canPlay(item) {
    return item.inView && !movementPaused() && !document.hidden
      && (!item.film || filmVisibility.get(item.film))
      && (!item.scene || (item.scene.classList.contains('is-current') && !item.scene.inert && item.scene.getAttribute('aria-hidden') !== 'true'));
  }

  function syncVideo(item) {
    const video = item.video;
    if (!canPlay(item)) {
      if (!video.paused) video.pause();
      return;
    }
    if (item.pending) { item.retryAfterAbort = true; return; }
    if (!video.paused || item.blocked) return;
    item.pending = true;
    item.retryAfterAbort = false;
    try {
      const playback = video.play();
      Promise.resolve(playback).then(() => {
        item.pending = false;
        item.retryAfterAbort = false;
        // A pending play promise may finish after the user has paused or left.
        if (!canPlay(item)) video.pause();
      }).catch(error => {
        item.pending = false;
        // Abort is a normal consequence of pausing an in-flight play request.
        if (error?.name === 'AbortError') {
          if (item.retryAfterAbort && canPlay(item)) syncVideo(item);
        } else item.blocked = true;
      });
    } catch {
      item.pending = false;
      item.blocked = true;
    }
  }

  function syncVideos(retry = false) {
    videos.forEach(item => {
      if (retry) item.blocked = false;
      syncVideo(item);
    });
  }

  videos.forEach(item => {
    item.video.autoplay = false;
    item.video.muted = true;
    item.video.playsInline = true;
    item.video.addEventListener('play', () => {
      if (!canPlay(item)) item.video.pause();
    });
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const item = videoRecords.get(entry.target);
        if (item) {
          const visible = entry.isIntersecting && entry.intersectionRatio > .01;
          if (visible && !item.inView) item.blocked = false;
          item.inView = visible;
        } else if (filmVisibility.has(entry.target)) filmVisibility.set(entry.target, entry.isIntersecting);
      });
      syncVideos();
    }, { threshold: [0, .01, .1] });
    videos.forEach(item => observer.observe(item.video));
    filmVisibility.forEach((_, film) => observer.observe(film));
  }
  // Without IntersectionObserver, ambient clips retain their posters.
  document.addEventListener('portfolio:scene-change', () => syncVideos(true));
  document.addEventListener('visibilitychange', () => syncVideos(!document.hidden));

  function revealAll() {
    revealObserver?.disconnect();
    reveals.forEach(element => element.classList.add('is-visible'));
  }
  function syncMotion(retryVideos = false) {
    const paused = movementPaused();
    body.classList.toggle('motion-paused', paused);
    if (motion) {
      const label = paused ? 'Включить анимацию' : 'Остановить анимацию';
      motion.disabled = reduced.matches;
      motion.textContent = label;
      motion.setAttribute('aria-pressed', String(paused));
      motion.setAttribute('aria-label', reduced.matches ? 'Анимация отключена в настройках устройства' : label);
      motion.title = reduced.matches ? 'Анимация отключена в настройках устройства' : label;
    }
    if (paused) revealAll();
    syncVideos(retryVideos);
    document.dispatchEvent(new CustomEvent('portfolio:motion-change', {
      detail: { paused, userPaused, reduced: reduced.matches }
    }));
  }
  motion?.addEventListener('click', () => {
    userPaused = !userPaused;
    syncMotion(!movementPaused());
  });
  reduced.addEventListener('change', () => syncMotion(!movementPaused()));
  const filters = Array.from(document.querySelectorAll('[data-filter]'));
  const cards = Array.from(document.querySelectorAll('.catalog-card[data-category]'));
  if (filters.length && cards.length) {
    const values = new Set(filters.map(button => button.dataset.filter));
    const status = document.querySelector('#filter-status');
    function applyFilter(value, updateURL = false) {
      const selected = values.has(value) ? value : 'all';
      let count = 0;
      cards.forEach(card => {
        const show = selected === 'all' || card.dataset.category.split(/\s+/).includes(selected);
        card.hidden = !show;
        if (show) { count++; card.classList.add('is-visible'); }
      });
      filters.forEach(button => {
        const active = button.dataset.filter === selected;
        button.setAttribute('aria-pressed', String(active));
        button.classList.toggle('is-active', active);
      });
      if (status) status.textContent = `Показано проектов: ${count}`;
      document.dispatchEvent(new CustomEvent('portfolio:layout-change'));
      if (updateURL) {
        const url = new URL(window.location.href);
        url.hash = selected === 'all' ? '' : selected;
        history.replaceState(history.state, '', url);
      }
    }
    filters.forEach(button => button.addEventListener('click', () => applyFilter(button.dataset.filter, true)));
    window.addEventListener('hashchange', () => applyFilter(window.location.hash.slice(1)));
    applyFilter(window.location.hash.slice(1));
  }


  if ('IntersectionObserver' in window && !movementPaused()) {
    revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }), { threshold: .04, rootMargin: '0px 0px 30px 0px' });
    reveals.forEach(element => {
      if (element.getBoundingClientRect().top < innerHeight) element.classList.add('is-visible');
      else revealObserver.observe(element);
    });
  } else revealAll();
  const progress=document.querySelector('#progress');let pending=false;
  function update(){pending=false;if(progress){const d=root.scrollHeight-innerHeight;progress.style.transform=`scaleX(${d>0?Math.min(1,Math.max(0,scrollY/d)):0})`;}}
  addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update);}},{passive:true});
  addEventListener('resize',update,{passive:true});update();syncMotion();root.classList.add('js');
})();
