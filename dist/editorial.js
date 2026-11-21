'use strict';
(() => {
  const opening = document.querySelector('.opening-art');
  const scene = opening?.querySelector('.opening-scene');
  const galleries = [...document.querySelectorAll('.project-art')];
  const video = document.querySelector('[data-ambient-video]');
  const toggle = document.querySelector('#motion');
  if (!scene || !video || !toggle || !('IntersectionObserver' in window)) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const visibleArt = new Set();
  const clamp = value => Math.min(1, Math.max(0, value));
  let paused = false;
  let imagesReady = false;
  let introStarted = false;
  let videoVisible = false;
  let playPending = false;
  let playBlocked = false;
  let frame = 0;

  function allowsMotion() {
    return !paused && !reduced.matches && !document.hidden;
  }

  function tryEntrance(bounds) {
    if (introStarted || !root.classList.contains('opening-pending') || !imagesReady ||
        !visibleArt.has(opening) || !allowsMotion()) return;
    const box = bounds ?? opening.getBoundingClientRect();
    const visibleHeight = Math.min(innerHeight, box.bottom) - Math.max(0, box.top);
    if (visibleHeight < Math.min(72, box.height * 0.2)) return;
    introStarted = true;
    opening.classList.add('is-entrance');
    root.classList.remove('opening-pending');
  }

  scene.addEventListener('animationend', event => {
    if (event.target === scene && event.animationName === 'frame-unfold') {
      opening.classList.remove('is-entrance');
    }
  });

  function paint() {
    frame = 0;
    if (!allowsMotion()) return;
    const height = innerHeight;
    const measurements = [...visibleArt].map(art => [art, art.getBoundingClientRect()]);
    for (const [art, bounds] of measurements) {
      if (art === opening) {
        tryEntrance(bounds);
        const travel = clamp((height - bounds.bottom) / (height * 0.72));
        art.style.setProperty('--field-x', `${travel * 7}%`);
        art.style.setProperty('--field-scale', (1 + travel * 0.24).toFixed(3));
        art.style.setProperty('--ronin-x', `${travel * -23}%`);
        art.style.setProperty('--ronin-y', `${travel * -9}%`);
        art.style.setProperty('--ronin-angle', `${travel * -5}deg`);
      } else {
        const range = Math.min(height * 0.37, Math.max(120, bounds.height * 0.85));
        const entry = clamp((height - bounds.top) / range);
        // Constant artwork boxes let the diagonal cut track scroll while captions stay still.
        const remaining = (1 - entry) ** 1.35;
        art.style.setProperty('--gate', `${remaining * 52}%`);
        art.style.setProperty('--bevel', `${remaining * 30}%`);
        art.style.setProperty('--reel-scale', (1 + remaining * 0.24).toFixed(3));
        art.style.setProperty('--reel-x', `${remaining * 8}%`);
      }
    }
  }

  function requestPaint() {
    if (!frame && visibleArt.size && allowsMotion()) frame = requestAnimationFrame(paint);
  }

  function syncVideo() {
    const wantsVideo = allowsMotion() && videoVisible;
    if (!wantsVideo) {
      if (!video.paused || playPending) video.pause();
      return;
    }
    if (!video.paused || playPending || playBlocked) return;
    playPending = true;
    let interrupted = false;
    video.play().catch(error => {
      interrupted = error.name === 'AbortError';
      if (!interrupted) playBlocked = true;
    }).finally(() => {
      playPending = false;
      if (!allowsMotion() || !videoVisible) video.pause();
      else if (interrupted) syncVideo();
    });
  }

  function syncMotion() {
    const staticPage = paused || reduced.matches;
    document.body.classList.toggle('motion-paused', staticPage);
    toggle.hidden = reduced.matches;
    toggle.textContent = staticPage ? 'Включить анимацию' : 'Остановить анимацию';
    toggle.setAttribute('aria-pressed', String(staticPage));
    if (staticPage) root.classList.remove('opening-pending');

    if (!allowsMotion()) {
      cancelAnimationFrame(frame);
      frame = 0;
      opening.classList.remove('is-entrance');
    } else {
      tryEntrance();
      requestPaint();
    }
    syncVideo();
  }

  const artworkObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) visibleArt.add(entry.target);
      else visibleArt.delete(entry.target);
    }
    tryEntrance();
    requestPaint();
  }, { threshold: 0.06, rootMargin: '0px 0px 44px 0px' });

  const videoObserver = new IntersectionObserver(([entry]) => {
    videoVisible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
    if (!videoVisible) playBlocked = false;
    syncVideo();
  }, { threshold: [0, 0.25] });

  artworkObserver.observe(opening);
  galleries.forEach(art => artworkObserver.observe(art));
  videoObserver.observe(video);
  video.muted = true;
  Promise.all([...scene.querySelectorAll('img')].map(image => image.decode().catch(() => {}))).then(() => {
    imagesReady = true;
    tryEntrance();
  });

  toggle.addEventListener('click', () => {
    paused = !paused;
    if (!paused) playBlocked = false;
    syncMotion();
  });
  reduced.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  window.addEventListener('scroll', requestPaint, { passive: true });
  window.addEventListener('resize', requestPaint, { passive: true });
  syncMotion();
})();
