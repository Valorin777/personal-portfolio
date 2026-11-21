'use strict';
(() => {
  const opening = document.querySelector('.opening-art');
  const video = document.querySelector('[data-ambient-video]');
  const toggle = document.querySelector('#motion');
  if (!opening || !video || !toggle || !('IntersectionObserver' in window)) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  let openingVisible = false;
  let videoVisible = false;
  let frame = 0;
  let playPending = false;
  let playBlocked = false;

  function allowsMotion() {
    return !paused && !reduced.matches && !document.hidden;
  }

  function paintOpening() {
    frame = 0;
    if (!openingVisible || !allowsMotion()) return;
    const bounds = opening.getBoundingClientRect();
    const travel = Math.min(1, Math.max(0, 1 - bounds.bottom / (innerHeight * .72)));
    opening.style.setProperty('--field-y', `${travel * 13}px`);
    opening.style.setProperty('--ronin-y', `${travel * -38}px`);
  }

  function requestOpening() {
    if (!frame && openingVisible && allowsMotion()) frame = requestAnimationFrame(paintOpening);
  }

  function wantsVideo() {
    return allowsMotion() && videoVisible;
  }

  function syncVideo() {
    if (!wantsVideo()) {
      video.pause();
      return;
    }
    if (!video.paused || playPending || playBlocked) return;
    playPending = true;
    video.play().catch(error => {
      if (error.name !== 'AbortError') playBlocked = true;
    }).finally(() => {
      playPending = false;
      if (!wantsVideo()) video.pause();
    });
  }

  function syncMotion() {
    const staticPage = paused || reduced.matches;
    document.body.classList.toggle('motion-paused', staticPage);
    toggle.hidden = reduced.matches;
    toggle.textContent = staticPage ? 'Включить анимацию' : 'Остановить анимацию';
    toggle.setAttribute('aria-pressed', String(staticPage));

    if (!allowsMotion()) {
      cancelAnimationFrame(frame);
      frame = 0;
      opening.style.removeProperty('--field-y');
      opening.style.removeProperty('--ronin-y');
    } else {
      requestOpening();
    }
    syncVideo();
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.target === opening) openingVisible = entry.isIntersecting;
      if (entry.target === video) {
        videoVisible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        if (!videoVisible) playBlocked = false;
      }
    }
    requestOpening();
    syncVideo();
  }, { threshold: [0, 0.25] });

  observer.observe(opening);
  observer.observe(video);
  video.muted = true;
  toggle.addEventListener('click', () => {
    paused = !paused;
    if (!paused) playBlocked = false;
    syncMotion();
  });
  reduced.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  window.addEventListener('scroll', requestOpening, { passive: true });
  window.addEventListener('resize', requestOpening, { passive: true });
  syncMotion();
})();
