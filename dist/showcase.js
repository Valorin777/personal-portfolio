'use strict';

// Full-viewport project panels follow native page scroll, without wheel or
// touch interception. CSS owns layout; this controller supplies the timeline.
(() => {
  function init() {
    const film = document.querySelector('.project-film');
    if (!film) return;
    const stage = film.querySelector('.film-stage');
    const scenes = [...film.querySelectorAll('.film-scene')].sort((a, b) => Number(a.dataset.index || 0) - Number(b.dataset.index || 0));
    if (!stage || !scenes.length) return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const shortViewport = matchMedia('(max-height: 560px) and (min-width: 701px)');
    const movementPaused = () => reduced.matches || shortViewport.matches || document.body.classList.contains('motion-paused');
    const buttons = [...new Set([...film.querySelectorAll('[data-scene]'), ...document.querySelectorAll('.film-nav [data-scene]')])];
    const currentLabels = [...film.querySelectorAll('.film-current')];
    const counters = [...film.querySelectorAll('.film-counter')];
    const titleLabels = [...film.querySelectorAll('[data-film-title]')];
    const supportsInert = 'inert' in HTMLElement.prototype;
    const focusSelector = 'a[href],button,input,select,textarea,[tabindex],audio[controls],video[controls]';
    const focusStates = new WeakMap();
    const written = scenes.map(() => []);
    const clamp = value => Math.max(0, Math.min(1, value));
    const smooth = value => { const x = clamp(value); return x * x * (3 - 2 * x); };
    let frame = 0, modeFrame = 0, modeVersion = 0, lastTime = 0, dirty = true, synchronize = true;
    let filmTop = 0, filmHeight = 0, viewportHeight = 1, travel = 1, progress = 0, target = 0, lastScrollY = 0;
    let currentIndex = -1, writtenProgress = '', accessDirty = true;
    let disabled = movementPaused();
    let sceneGeometry = [];

    function setAccessible(scene, accessible) {
      if (supportsInert) scene.inert = !accessible;
      else {
        scene.querySelectorAll(focusSelector).forEach(element => {
          if (!focusStates.has(element)) focusStates.set(element, element.getAttribute('tabindex'));
          if (!accessible) element.setAttribute('tabindex', '-1');
          else {
            const previous = focusStates.get(element);
            if (previous === null) element.removeAttribute('tabindex');
            else element.setAttribute('tabindex', previous);
          }
        });
      }
      if (accessible) scene.removeAttribute('aria-hidden');
      else scene.setAttribute('aria-hidden', 'true');
    }

    function setCurrent(index, force = false) {
      if (index === currentIndex && !force && !accessDirty) return;
      accessDirty = false;
      currentIndex = index;
      const scene = scenes[index];
      setAccessible(scene, true);
      // A keyboard user must never be left focused inside a now-inert panel.
      if (!disabled && scenes.some(panel => panel !== scene && panel.contains(document.activeElement))) {
        const control = buttons.find(button => Number(button.dataset.scene) === index);
        const destination = control || scene.querySelector(focusSelector);
        destination?.focus({ preventScroll: true });
      }
      scenes.forEach((panel, i) => {
        if (i !== index) setAccessible(panel, disabled);
        panel.classList.toggle('is-current', i === index);
      });
      buttons.forEach(button => {
        const active = Number(button.dataset.scene) === index;
        button.setAttribute('aria-pressed', String(active));
        button.classList.toggle('is-active', active);
      });
      const number = String(index + 1).padStart(2, '0');
      const total = String(scenes.length).padStart(2, '0');
      currentLabels.forEach(label => { label.textContent = number; });
      counters.forEach(counter => {
        if (!counter.querySelector('.film-current')) counter.textContent = `${number} / ${total}`;
      });
      titleLabels.forEach(label => { label.textContent = scene.dataset.title || ''; });
      film.dataset.currentScene = String(index);
      document.dispatchEvent(new CustomEvent('portfolio:scene-change', { detail: { index, static: disabled } }));
    }

    function entrance(index, value) {
      if (index === 0) return 1;
      const intervals = Math.max(1, scenes.length - 1);
      const start = (index - 1 + .12) / intervals;
      const end = (index - 1 + .84) / intervals;
      return smooth((value - start) / (end - start));
    }

    function render(value) {
      const rootValue = value.toFixed(5);
      if (rootValue !== writtenProgress) {
        film.style.setProperty('--film-progress', rootValue);
        writtenProgress = rootValue;
      }
      let active = 0;
      scenes.forEach((scene, index) => {
        const entering = entrance(index, value);
        const leaving = index < scenes.length - 1 ? entrance(index + 1, value) : 0;
        if (entering >= .5) active = index;
        const values = [
          ((1 - entering) * 100 - leaving * 8).toFixed(3),
          (.78 + entering * .22 - leaving * .14).toFixed(4),
          entering > 0 ? '1' : '0',
          (-leaving * 120).toFixed(2),
          (1 - leaving * .45).toFixed(4)
        ];
        const properties = ['--scene-y', '--scene-scale', '--scene-opacity', '--scene-depth', '--scene-brightness'];
        values.forEach((result, i) => {
          if (written[index][i] === result) return;
          scene.style.setProperty(properties[i], result);
          written[index][i] = result;
        });
      });
      setCurrent(active);
      film.classList.add('is-film-ready');
    }

    function readGeometry(scrollY) {
      // Measure the real sticky stage: 100svh need not equal innerHeight.
      const filmRect = film.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      filmTop = filmRect.top + scrollY;
      filmHeight = filmRect.height;
      viewportHeight = Math.max(1, innerHeight);
      travel = Math.max(1, filmRect.height - stageRect.height);
      if (disabled) sceneGeometry = scenes.map(scene => {
        const rect = scene.getBoundingClientRect();
        return { top: rect.top + scrollY, height: Math.max(1, rect.height) };
      });
      dirty = false;
    }

    function requestFrame() {
      if (!frame && !modeFrame && !document.hidden) frame = requestAnimationFrame(tick);
    }
    function invalidate(sync = false) {
      dirty = true;
      if (sync) synchronize = true;
      requestFrame();
    }
    function tick(now) {
      frame = 0;
      if (document.hidden) return;
      // All layout reads finish before any scene styles or accessibility writes.
      const y = window.scrollY || 0;
      if (dirty) readGeometry(y);
      lastScrollY = y;
      if (disabled) {
        // Static pages retain meaningful current-index controls while every
        // project remains visible and keyboard-accessible. No animation loop.
        const center = y + viewportHeight * .5;
        let nearest = 0, distance = Infinity;
        sceneGeometry.forEach((scene, index) => {
          const difference = Math.abs(scene.top + Math.min(scene.height, viewportHeight) * .5 - center);
          if (difference < distance) { distance = difference; nearest = index; }
        });
        setCurrent(nearest);
        lastTime = 0;
        return;
      }
      target = clamp((y - filmTop) / travel);
      const dt = lastTime ? Math.min(.05, Math.max(.004, (now - lastTime) / 1000)) : 1 / 60;
      lastTime = now;
      if (synchronize) {
        progress = target;
        synchronize = false;
      } else progress += (target - progress) * (1 - Math.exp(-dt / .12));
      if (Math.abs(progress - target) < .00008) progress = target;
      render(progress);
      if (progress !== target) requestFrame();
      else lastTime = 0;
    }

    function clearMotion() {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      film.style.removeProperty('--film-progress');
      film.classList.remove('is-film-ready');
      scenes.forEach((scene, index) => {
        ['--scene-y', '--scene-scale', '--scene-opacity', '--scene-depth', '--scene-brightness'].forEach(property => scene.style.removeProperty(property));
        setAccessible(scene, true);
        written[index] = [];
      });
      writtenProgress = '';
      setCurrent(Math.max(0, currentIndex), true);
    }

    function changeMode(nextDisabled) {
      if (disabled === nextDisabled) return;
      const index = Math.max(0, currentIndex);
      const center = lastScrollY + viewportHeight * .5;
      const preserveScene = filmHeight > 0 && center >= filmTop && center <= filmTop + filmHeight;
      disabled = nextDisabled;
      accessDirty = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(modeFrame);
      frame = modeFrame = 0;
      lastTime = 0;
      dirty = synchronize = true;
      const version = ++modeVersion;
      if (disabled) clearMotion();
      if (!preserveScene) { requestFrame(); return; }
      // Wait for the body's new layout, then keep the same project in view.
      // A version guard prevents a rapid second toggle from applying old work.
      modeFrame = requestAnimationFrame(() => {
        modeFrame = 0;
        if (version !== modeVersion) return;
        const y = window.scrollY || 0;
        readGeometry(y);
        const top = disabled
          ? sceneGeometry[index].top
          : filmTop + travel * index / Math.max(1, scenes.length - 1);
        window.scrollTo({ top, behavior: 'instant' });
        requestFrame();
      });
    }

    buttons.forEach(button => button.addEventListener('click', () => {
      const index = Number(button.dataset.scene);
      if (!Number.isInteger(index) || !scenes[index]) return;
      if (disabled) {
        setCurrent(index);
        scenes[index].scrollIntoView({ behavior: 'auto', block: 'start' });
        return;
      }
      const y = window.scrollY || 0;
      if (dirty) readGeometry(y);
      // Index / intervals lands in each completed entrance's hold region.
      window.scrollTo({ top: filmTop + travel * index / Math.max(1, scenes.length - 1), behavior: 'smooth' });
    }));
    window.addEventListener('scroll', requestFrame, { passive: true });
    window.addEventListener('resize', () => invalidate(), { passive: true });
    window.addEventListener('pageshow', () => invalidate(true));
    document.addEventListener('portfolio:layout-change', () => invalidate());
    document.addEventListener('load', event => {
      if (event.target instanceof HTMLImageElement) invalidate();
    }, true);
    document.addEventListener('loadedmetadata', event => {
      if (event.target instanceof HTMLVideoElement) invalidate();
    }, true);
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(() => invalidate());
      observer.observe(document.body);
      observer.observe(film);
      observer.observe(stage);
    }
    if (document.fonts) {
      document.fonts.ready.then(() => invalidate());
      document.fonts.addEventListener?.('loadingdone', () => invalidate());
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        cancelAnimationFrame(modeFrame);
        frame = 0;
        modeFrame = 0;
        modeVersion++;
        lastTime = 0;
      } else invalidate(true);
    });
    document.addEventListener('portfolio:motion-change', event => changeMode(reduced.matches || shortViewport.matches || Boolean(event.detail?.paused)));
    reduced.addEventListener('change', () => changeMode(movementPaused()));
    shortViewport.addEventListener('change', () => changeMode(movementPaused()));

    if (disabled) clearMotion();
    requestFrame();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
