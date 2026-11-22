'use strict';
(() => {
  const theater = document.querySelector('.project-theater');
  if (!theater || !('IntersectionObserver' in window) || !('ResizeObserver' in window)) return;
  const stage = theater.querySelector('[data-theater-stage]');
  const panels = [...theater.querySelectorAll('[data-theater-frame]')];
  const cases = [...theater.querySelectorAll('[data-theater-case]')];
  const controls = theater.querySelector('[data-theater-controls]');
  const counter = theater.querySelector('[data-theater-counter]');
  const status = theater.querySelector('[data-theater-status]');
  const stop = theater.querySelector('#motion');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 750px)');
  const count = panels.length;

  let selected = 0;
  let position = 0;
  let target = 0;
  let velocity = 0;
  let paused = false;
  let frame = 0;
  let previousTime = 0;
  let stageWidth = stage.clientWidth;
  let stageHeight = stage.clientHeight;
  let onscreen = false;
  let entranceVisible = false;
  let entranceSeen = false;
  let entranceStart = null;
  let gesture;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const mix = (from, to, amount) => from + (to - from) * amount;
  const modulo = (value, size) => ((value % size) + size) % size;
  const motionActive = () => !paused && !reduced.matches;
  const custom = (element, name, value, unit = '') =>
    element.style.setProperty(name, String(Math.round(value * 1000) / 1000) + unit);

  function announce(index) {
    selected = index;
    const active = cases[index];
    theater.dataset.active = active.dataset.theaterCase;
    counter.textContent = `${index + 1} / ${count}`;
    panels.forEach((panel, i) => panel.toggleAttribute('data-center', i === index));
    cases.forEach((item, i) => { item.hidden = i !== index; });
    status.textContent = `${index + 1} из ${count}. ${active.querySelector('[data-theater-title]').textContent}`;
  }

  function setPose(entrance, positionBias, departure) {
    const side = stageWidth * (narrow.matches ? .52 : .375);
    panels.forEach((panel, index) => {
      // The far seam wraps behind the room, where both poses are already hidden.
      const offset = modulo(index - position - positionBias + 1.5, count) - 1.5;
      const distance = Math.abs(offset);
      const near = Math.min(distance, 1);
      const rear = clamp((distance - 1) * 2, 0, 1);
      const sideYaw = panel.dataset.theaterFrame === 'okoshko' ? 43 : 37;
      const lift = (1 - near) * entrance;
      custom(panel, '--pose-x', side * offset * (1 - rear * .55), 'px');
      custom(panel, '--pose-y', near * 18 - lift * stageHeight * .15 - departure * 30, 'px');
      custom(panel, '--pose-z', mix(42, -245, near) - rear * 260 + lift * 74 - departure * 140, 'px');
      custom(panel, '--pose-yaw', -sideYaw * offset + 14 * lift, 'deg');
      custom(panel, '--pose-pitch', -32 * lift + departure * (13 + near * 12), 'deg');
      custom(panel, '--pose-roll', 5 * offset + 7 * lift, 'deg');
      custom(panel, '--pose-size', 1 - near * .08 + lift * .04);
      custom(panel, '--pose-shade', near * .36 + rear * .27);
      custom(panel, '--pose-opacity', 1 - rear * rear);
      custom(panel, '--actor-x', stageWidth * (-.067 * offset + .075 * lift), 'px');
      custom(panel, '--actor-y', stageHeight * (.042 * near - .125 * lift), 'px');
      custom(panel, '--actor-tilt', -4 * offset + 8.5 * lift, 'deg');
    });
  }

  function schedule() {
    if (!frame && motionActive() && onscreen && !document.hidden) frame = requestAnimationFrame(tick);
  }

  function tick(now) {
    frame = 0;
    const dt = clamp((now - (previousTime || now - 16)) / 1000, .004, .028);
    previousTime = now;
    let settling = false;
    if (!gesture) {
      velocity += ((target - position) * 120 - velocity * 17) * dt;
      position += velocity * dt;
      settling = Math.abs(target - position) > .0008 || Math.abs(velocity) > .006;
      if (!settling) {
        target = selected;
        position = target;
        velocity = 0;
      }
    }
    let pulse = 0;
    let bias = 0;
    if (entranceStart !== null) {
      const progress = clamp((now - entranceStart) / 1370, 0, 1);
      pulse = Math.sin(Math.PI * progress) ** 1.25;
      bias = Math.sin(progress * Math.PI * 2.05) * .31 * Math.sin(Math.PI * progress);
      if (progress === 1) entranceStart = null;
    }
    const stageTop = stage.getBoundingClientRect().top;
    const departure = clamp(-stageTop / Math.max(1, stageHeight), 0, 1);
    setPose(pulse, bias, departure);
    if (settling || entranceStart !== null) schedule();
  }

  function selectBy(step) {
    entranceStart = null;
    target += step;
    announce(modulo(target, count));
    if (motionActive()) {
      schedule();
    } else {
      position = selected;
      target = selected;
      setPose(0, 0, 0);
    }
  }

  function finishGesture(cancelled = false) {
    if (!gesture) return;
    const { id, travel, axis } = gesture;
    gesture = undefined;
    theater.removeAttribute('data-dragging');
    if (stage.hasPointerCapture(id)) stage.releasePointerCapture(id);
    const step = !cancelled && axis === 'x' && Math.abs(travel) >= .2 ? Math.sign(travel) : 0;
    if (step) selectBy(step);
    else schedule();
  }

  stage.addEventListener('pointerdown', event => {
    if (!motionActive() || gesture || !event.isPrimary || event.button !== 0) return;
    entranceStart = null;
    velocity = 0;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, origin: position, axis: '', travel: 0 };
    stage.setPointerCapture(event.pointerId);
    schedule();
  });
  stage.addEventListener('pointermove', event => {
    if (gesture?.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (!gesture.axis && Math.hypot(dx, dy) >= 8) {
      gesture.axis = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'x' : 'y';
      theater.toggleAttribute('data-dragging', gesture.axis === 'x');
    }
    if (gesture.axis !== 'x') return;
    gesture.travel = clamp(-dx / Math.max(130, stageWidth * .43), -.84, .84);
    position = gesture.origin + gesture.travel;
    schedule();
  });
  stage.addEventListener('pointerup', event => {
    if (gesture?.id === event.pointerId) finishGesture();
  });
  for (const eventName of ['pointercancel', 'lostpointercapture']) {
    stage.addEventListener(eventName, event => {
      if (gesture?.id === event.pointerId) finishGesture(true);
    });
  }

  controls.addEventListener('click', event => {
    const button = event.target.closest('[data-theater-step]');
    if (button) {
      finishGesture(true);
      selectBy(Number(button.dataset.theaterStep));
    }
  });
  theater.addEventListener('keydown', event => {
    if ((event.target !== stage && !event.target.matches('[data-theater-step]')) ||
        event.altKey || event.ctrlKey || event.metaKey) return;
    const step = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
    if (step) {
      event.preventDefault();
      finishGesture(true);
      selectBy(step);
    }
  });

  function syncMotion() {
    const still = !motionActive();
    theater.toggleAttribute('data-static', still);
    stop.hidden = reduced.matches;
    stop.textContent = paused ? 'Включить движение' : 'Остановить движение';
    stop.setAttribute('aria-pressed', String(paused));
    if (still) {
      cancelAnimationFrame(frame);
      frame = 0;
      entranceStart = null;
      entranceSeen = true;
      finishGesture(true);
      target = selected;
      position = selected;
      velocity = 0;
      // A previously side-on panel may still have a nonzero shade when motion is disabled.
      setPose(0, 0, 0);
    } else {
      schedule();
    }
  }

  function startEntrance() {
    if (entranceSeen || !entranceVisible || !motionActive() || document.hidden) return;
    entranceSeen = true;
    entranceStart = performance.now();
    schedule();
  }

  const observer = new IntersectionObserver(([entry]) => {
    onscreen = entry.isIntersecting;
    entranceVisible = entry.intersectionRatio >= .18;
    startEntrance();
    if (onscreen) schedule();
  }, { threshold: .18 });
  const resize = new ResizeObserver(() => {
    stageWidth = stage.clientWidth;
    stageHeight = stage.clientHeight;
    schedule();
  });
  observer.observe(stage);
  resize.observe(stage);
  window.addEventListener('scroll', schedule, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      entranceStart = null;
      finishGesture(true);
    } else {
      startEntrance();
      schedule();
    }
  });
  reduced.addEventListener('change', syncMotion);
  stop.addEventListener('click', () => {
    paused = !paused;
    syncMotion();
  });

  theater.dataset.ready = '';
  stage.tabIndex = 0;
  controls.hidden = false;
  announce(selected);
  syncMotion();
})();
