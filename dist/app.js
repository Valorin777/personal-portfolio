'use strict';
(() => {
  const root = document.documentElement;
  const body = document.body;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  let ambientPaused = reduced.matches;
  const motion = document.querySelector('#motion');
  let refreshBadge = () => {};

  function updateMotion() {
    body.classList.toggle('ambient-paused', ambientPaused || reduced.matches);
    if (motion) {
      const paused = ambientPaused || reduced.matches;
      const label = reduced.matches
        ? 'Фоновое движение отключено в настройках устройства'
        : paused ? 'Включить фоновое движение' : 'Приостановить фоновое движение';
      motion.disabled = reduced.matches;
      motion.setAttribute('aria-pressed', String(paused));
      motion.setAttribute('aria-label', label);
      motion.setAttribute('title', label);
      motion.dataset.state = paused ? 'paused' : 'playing';
      const text = motion.querySelector('[data-motion-label]');
      const icon = motion.querySelector('[data-motion-icon]');
      if (text) text.textContent = paused ? 'Движение' : 'Пауза';
      if (icon) icon.textContent = paused ? '▶' : 'Ⅱ';
    }
    refreshBadge();
  }
  motion?.addEventListener('click', () => {
    ambientPaused = !ambientPaused;
    updateMotion();
  });
  reduced.addEventListener('change', () => {
    ambientPaused = reduced.matches;
    if (reduced.matches) document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    updateMotion();
  });

  const stage = document.querySelector('#badge-stage');
  const rig = document.querySelector('#badge-rig');
  const badge = document.querySelector('#badge');
  if (stage && rig && badge) {
    const lanyard = document.querySelector('#lanyard');
    const paths = [document.querySelector('#strap'), document.querySelector('#strap-stitch')].filter(Boolean);
    const makeAxis = value => ({ value, velocity: 0 });
    const x = makeAxis(0), y = makeAxis(0), angle = makeAxis(0);
    const yaw = makeAxis(0), pitch = makeAxis(0), ambient = makeAxis(reduced.matches ? 0 : 2);
    let targetYaw = 0, targetPitch = 0;
    let stageWidth = 600, stageHeight = 650, top = 201.5, restAngle = -7;
    let frame = 0, lastTime = 0, ambientTimer = 0, drag = null, suppressClickUntil = 0;
    let inView = true;
    const runnable = () => inView && !document.hidden && !body.classList.contains('dialog-open');
    const ambientEnabled = () => !ambientPaused && !reduced.matches && runnable();
    const spring = (axis, target, stiffness, damping, dt) => {
      axis.velocity += ((target - axis.value) * stiffness - axis.velocity * damping) * dt;
      axis.value += axis.velocity * dt;
      if (Math.abs(axis.value - target) < .015 && Math.abs(axis.velocity) < .025) {
        axis.value = target;
        axis.velocity = 0;
      }
    };
    const moving = (axis, target = 0) => Math.abs(axis.value - target) > .015 || Math.abs(axis.velocity) > .025;
    function render() {
      rig.style.transform = `translate(-50%, 0) translate3d(${x.value.toFixed(2)}px, ${y.value.toFixed(2)}px, 0) rotateZ(${(restAngle + angle.value + ambient.value).toFixed(2)}deg) rotateY(${yaw.value.toFixed(2)}deg) rotateX(${pitch.value.toFixed(2)}deg)`;
      const startX = stageWidth * .5 + 40;
      const endX = stageWidth * .5 + x.value;
      const endY = top + y.value;
      const span = endY + 20;
      const slack = 16 + Math.abs(x.value) * .15;
      const d = `M ${startX} -20 C ${startX + slack} ${span * .36 - 20}, ${endX - slack} ${endY - span * .28}, ${endX} ${endY}`;
      paths.forEach(path => path.setAttribute('d', d));
    }
    function scheduleAmbient() {
      if (ambientTimer || !ambientEnabled()) return;
      ambientTimer = window.setTimeout(() => {
        ambientTimer = 0;
        if (ambientEnabled() && !drag) {
          ambient.velocity += (Math.random() > .5 ? 1 : -1) * 1.6;
          requestFrame();
        }
        scheduleAmbient();
      }, 7000 + Math.random() * 5000);
    }
    function tick(now) {
      frame = 0;
      if (!runnable() || reduced.matches) return;
      const dt = Math.min((now - lastTime) / 1000 || .016, .032);
      lastTime = now;
      if (!drag) {
        spring(x, 0, 55, 10, dt);
        spring(y, 0, 70, 12, dt);
        x.value = clamp(x.value, -110, 110);
        y.value = clamp(y.value, -65, 65);
      }
      const angleTarget = drag ? x.value * .055 : 0;
      spring(angle, angleTarget, 35, 7, dt);
      spring(yaw, targetYaw, 65, 14, dt);
      spring(pitch, targetPitch, 65, 14, dt);
      if (ambientEnabled()) spring(ambient, 0, 18, 3.5, dt);
      render();
      if ((!drag && (moving(x) || moving(y))) || moving(angle, angleTarget) || moving(yaw, targetYaw) || moving(pitch, targetPitch) || (ambientEnabled() && moving(ambient))) requestFrame();
      else scheduleAmbient();
    }
    function requestFrame() {
      if (!frame && runnable() && !reduced.matches) {
        lastTime = performance.now();
        frame = requestAnimationFrame(tick);
      }
    }
    function measure() {
      const bounds = stage.getBoundingClientRect();
      stageWidth = stage.clientWidth || bounds.width || 600;
      stageHeight = stage.clientHeight || bounds.height || 650;
      const style = getComputedStyle(rig);
      const parsedTop = parseFloat(style.top);
      top = Number.isFinite(parsedTop) ? parsedTop : stageHeight * .31;
      const customAngle = parseFloat(style.getPropertyValue('--badge-rest-angle'));
      restAngle = Number.isFinite(customAngle) ? customAngle : -7;
      lanyard?.setAttribute('viewBox', `0 0 ${stageWidth} ${stageHeight}`);
      render();
    }
    function finishDrag(event) {
      if (!drag || (event && event.pointerId !== drag.id)) return;
      const current = drag;
      drag = null;
      badge.classList.remove('is-dragging');
      stage.classList.remove('is-dragging');
      if (current.moved) suppressClickUntil = performance.now() + 400;
      if (performance.now() - current.last > 90) x.velocity = y.velocity = 0;
      if (badge.hasPointerCapture?.(current.id)) badge.releasePointerCapture(current.id);
      targetYaw = targetPitch = 0;
      if (reduced.matches) {
        [x, y, angle, yaw, pitch].forEach(axis => { axis.value = 0; axis.velocity = 0; });
        render();
      } else requestFrame();
    }
    badge.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      suppressClickUntil = 0;
      drag = { id: event.pointerId, startX: event.clientX, startY: event.clientY, originX: x.value, originY: y.value, last: performance.now(), moved: false };
      x.velocity = y.velocity = 0;
      badge.setPointerCapture?.(event.pointerId);
      badge.classList.add('is-dragging');
      stage.classList.add('is-dragging');
    });
    badge.addEventListener('pointermove', event => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.startX, dy = event.clientY - drag.startY;
      if (Math.hypot(dx, dy) > 5) drag.moved = true;
      if (!drag.moved) return;
      event.preventDefault();
      const now = performance.now();
      const dt = Math.max((now - drag.last) / 1000, .008);
      const nextX = clamp(drag.originX + dx, -110, 110), nextY = clamp(drag.originY + dy, -65, 65);
      x.velocity = clamp((nextX - x.value) / dt, -650, 650);
      y.velocity = clamp((nextY - y.value) / dt, -350, 350);
      x.value = nextX;
      y.value = nextY;
      drag.last = now;
      if (reduced.matches) angle.value = x.value * .055;
      render();
      requestFrame();
    });
    badge.addEventListener('pointerup', finishDrag);
    badge.addEventListener('pointercancel', finishDrag);
    badge.addEventListener('lostpointercapture', finishDrag);
    badge.addEventListener('dragstart', event => event.preventDefault());
    badge.addEventListener('click', event => {
      if (event.detail !== 0 && performance.now() < suppressClickUntil) {
        event.preventDefault();
        return;
      }
      const flipped = badge.classList.toggle('is-flipped');
      badge.setAttribute('aria-pressed', String(flipped));
    });
    stage.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' || drag || reduced.matches) return;
      const bounds = stage.getBoundingClientRect();
      targetYaw = clamp((event.clientX - bounds.left) / bounds.width - .5, -.5, .5) * 7;
      targetPitch = clamp((event.clientY - bounds.top) / bounds.height - .5, -.5, .5) * -4;
      requestFrame();
    });
    stage.addEventListener('pointerleave', () => {
      if (drag) return;
      targetYaw = targetPitch = 0;
      requestFrame();
    });
    refreshBadge = () => {
      if (ambientTimer) { clearTimeout(ambientTimer); ambientTimer = 0; }
      if (!runnable() || reduced.matches) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      if (reduced.matches) {
        targetYaw = targetPitch = 0;
        [x, y, angle, yaw, pitch, ambient].forEach(axis => { axis.value = 0; axis.velocity = 0; });
        render();
      } else if (runnable()) {
        requestFrame();
        scheduleAmbient();
      }
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        inView = entries[0].isIntersecting;
        refreshBadge();
      }, { threshold: 0 }).observe(stage);
    }
    if ('ResizeObserver' in window) new ResizeObserver(measure).observe(stage);
    else window.addEventListener('resize', measure, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) finishDrag();
      refreshBadge();
    });
    document.addEventListener('portfolio:dialog-change', refreshBadge);
    measure();
    refreshBadge();
  }

  const dialogs = Array.from(document.querySelectorAll('dialog'));
  const returnFocus = new WeakMap();
  function syncDialogs() {
    body.classList.toggle('dialog-open', dialogs.some(dialog => dialog.open));
    document.dispatchEvent(new Event('portfolio:dialog-change'));
  }
  document.querySelectorAll('[data-case]').forEach(trigger => {
    trigger.addEventListener('click', event => {
      const dialog = document.getElementById(`case-${trigger.dataset.case}`);
      if (!dialog || typeof dialog.showModal !== 'function') return;
      event.preventDefault();
      if (dialog.open) return;
      returnFocus.set(dialog, trigger);
      dialog.showModal();
      syncDialogs();
    });
  });
  dialogs.forEach(dialog => {
    dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
    let backdropPress = false;
    const outside = event => {
      const rect = dialog.getBoundingClientRect();
      return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    };
    dialog.addEventListener('pointerdown', event => { backdropPress = event.target === dialog && outside(event); });
    dialog.addEventListener('click', event => {
      if (backdropPress && event.target === dialog && outside(event)) dialog.close();
      backdropPress = false;
    });
    dialog.addEventListener('close', () => {
      syncDialogs();
      const trigger = returnFocus.get(dialog);
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    });
  });

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

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced.matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .06, rootMargin: '0px 0px 30px 0px' });
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < innerHeight && rect.bottom > 0) el.classList.add('is-visible');
      else revealObserver.observe(el);
    });
  } else revealElements.forEach(el => el.classList.add('is-visible'));

  const navEntries = Array.from(document.querySelectorAll('.nav-link')).flatMap(link => {
    const url = new URL(link.href, window.location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return [];
    const section = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    return section ? [{ link, section }] : [];
  });
  function updateCurrentSection() {
    if (!navEntries.length) return;
    let current = navEntries.find(entry => entry.section.getBoundingClientRect().top <= innerHeight * .42);
    navEntries.forEach(entry => {
      if (entry.section.getBoundingClientRect().top <= innerHeight * .42) current = entry;
    });
    navEntries.forEach(entry => {
      const active = entry === current;
      entry.link.classList.toggle('is-active', active);
      if (active) entry.link.setAttribute('aria-current', 'location');
      else if (entry.link.getAttribute('aria-current') === 'location') entry.link.removeAttribute('aria-current');
    });
  }
  if (navEntries.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(updateCurrentSection, { rootMargin: '-20% 0px -58% 0px', threshold: 0 });
    navEntries.forEach(entry => navObserver.observe(entry.section));
    updateCurrentSection();
  }
  const progress = document.querySelector('#progress');
  let scrollFrame = 0;
  function updateScroll() {
    scrollFrame = 0;
    if (progress) {
      const distance = root.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${distance > 0 ? clamp(scrollY / distance, 0, 1) : 0})`;
    }
  }
  function queueScroll() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }
  if (progress) {
    window.addEventListener('scroll', queueScroll, { passive: true });
    window.addEventListener('resize', queueScroll, { passive: true });
    window.addEventListener('load', queueScroll, { once: true });
    updateScroll();
  }
  updateMotion();
  root.classList.add('js');
})();
