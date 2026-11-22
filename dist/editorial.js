'use strict';
(() => {
  const theater = document.querySelector('.project-theater');
  if (!theater || !('IntersectionObserver' in window) || !('ResizeObserver' in window)) return;
  const stage = theater.querySelector('[data-theater-stage]');
  const panels = [...theater.querySelectorAll('[data-theater-frame]')];
  const artwork = panels.map(panel => panel.querySelector('img[data-theater-src]'));
  const cases = [...theater.querySelectorAll('[data-theater-case]')];
  const controls = theater.querySelector('[data-theater-controls]');
  const counter = theater.querySelector('[data-theater-counter]');
  const status = theater.querySelector('[data-theater-status]');
  const stop = theater.querySelector('#motion');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 750px)');
  const count = panels.length;
  const visiblePanels = new Set();

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
  let openingLift = 0;
  let openingBias = 0;
  let gesture;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const mix = (from, to, amount) => from + (to - from) * amount;
  const modulo = (value, size) => ((value % size) + size) % size;
  const motionActive = () => !paused && !reduced.matches;
  const custom = (element, name, value, unit = '') =>
    element.style.setProperty(name, String(Math.round(value * 1000) / 1000) + unit);

  function prepareImage(index) {
    const image = artwork[modulo(index, count)];
    if (image && !image.hasAttribute('src')) image.src = image.dataset.theaterSrc;
  }

  function announce(index) {
    selected = index;
    const active = cases[index];
    theater.dataset.active = active.dataset.theaterCase;
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${count}`;
    panels.forEach((panel, i) => panel.toggleAttribute('data-center', i === index));
    cases.forEach((item, i) => { item.hidden = i !== index; });
    for (const nearby of [-1, 0, 1]) prepareImage(index + nearby);
    status.textContent = `${index + 1} из ${count}. ${active.querySelector('[data-theater-title]').textContent}`;
  }

  function setPose(entrance, positionBias, departure) {
    const side = stageWidth * (narrow.matches ? .52 : .375);
    const view = position + positionBias;
    const first = Math.ceil(view - 1.6);
    const last = Math.floor(view + 1.6);
    const nextVisible = new Set();
    for (let slot = first; slot <= last; slot++) {
      const index = modulo(slot, count);
      const panel = panels[index];
      const offset = slot - view;
      const distance = Math.abs(offset);
      const near = Math.min(distance, 1);
      const rear = clamp((distance - 1) / .6, 0, 1);
      const passage = Math.sin(Math.PI * near) ** 4;
      const sideYaw = panel.dataset.theaterFrame === 'okoshko' ? 43 : 37;
      const lift = (1 - near) * entrance;
      const depth = mix(42, -245, near) - rear * 260 + lift * 74 - departure * 140;
      nextVisible.add(panel);
      prepareImage(index);
      if (!visiblePanels.has(panel)) panel.setAttribute('data-pose-visible', '');
      custom(panel, '--pose-x', side * offset * (1 - rear * .55), 'px');
      custom(panel, '--pose-y', near * 18 - lift * stageHeight * .15 - departure * 30, 'px');
      custom(panel, '--pose-z', depth, 'px');
      // Sort projected planes explicitly so compositing does not reorder them in WebKit.
      custom(panel, '--pose-stack', Math.round(depth));
      custom(panel, '--pose-yaw', -sideYaw * offset - Math.sign(offset) * 25 * passage + 14 * lift, 'deg');
      custom(panel, '--pose-pitch', -32 * lift + departure * (13 + near * 12), 'deg');
      custom(panel, '--pose-roll', 5 * offset + 7 * lift, 'deg');
      custom(panel, '--pose-size', 1 - near * .08 - passage * .1 + lift * .04);
      custom(panel, '--pose-shade', near * .36 + rear * .27);
      custom(panel, '--pose-opacity', (1 - rear) ** 2);
      custom(panel, '--actor-x', stageWidth * (-.067 * offset + .075 * lift), 'px');
      custom(panel, '--actor-y', stageHeight * (.042 * near - .125 * lift), 'px');
      custom(panel, '--actor-tilt', -4 * offset + 8.5 * lift, 'deg');
    }
    for (const panel of visiblePanels) {
      if (!nextVisible.has(panel)) panel.removeAttribute('data-pose-visible');
    }
    visiblePanels.clear();
    for (const panel of nextVisible) visiblePanels.add(panel);
  }

  function schedule() {
    if (!frame && motionActive() && onscreen && !document.hidden) frame = requestAnimationFrame(tick);
  }

  function tick(now) {
    frame = 0;
    const dt = clamp((now - (previousTime || now - 16)) / 1000, .004, .028);
    previousTime = now;
    let settling = false;
    if (gesture?.axis !== 'x') {
      velocity += ((target - position) * 140 - velocity * 23) * dt;
      position += velocity * dt;
      settling = Math.abs(target - position) > .0008 || Math.abs(velocity) > .006;
      if (!settling) {
        target = selected;
        position = target;
        velocity = 0;
      }
    }
    if (entranceStart !== null) {
      const progress = clamp((now - entranceStart) / 1370, 0, 1);
      openingLift = Math.sin(Math.PI * progress) ** 1.25;
      openingBias = Math.sin(progress * Math.PI * 2.05) * .31 * Math.sin(Math.PI * progress);
      if (progress === 1) entranceStart = null;
    } else {
      openingLift *= Math.exp(-19 * dt);
      if (openingLift < .003) openingLift = 0;
    }
    const stageTop = stage.getBoundingClientRect().top;
    const departure = clamp(-stageTop / Math.max(1, stageHeight), 0, 1);
    setPose(openingLift, openingBias, departure);
    if (settling || entranceStart !== null || openingLift > 0) schedule();
  }

  function holdOpeningPose() {
    position += openingBias;
    openingBias = 0;
    entranceStart = null;
  }

  function goTo(destination) {
    target = destination;
    const index = modulo(target, count);
    if (selected !== index) announce(index);
    if (motionActive()) {
      schedule();
    } else {
      position = selected;
      target = selected;
      setPose(0, 0, 0);
    }
  }

  function selectBy(step) {
    holdOpeningPose();
    goTo(target + step);
  }

  function releaseVelocity(samples, now) {
    const end = samples.at(-1);
    if (!end || now - end.time > 95) return 0;
    const start = samples.find(sample => end.time - sample.time <= 105);
    const elapsed = end.time - start.time;
    if (elapsed < 8) return 0;
    const speed = (end.position - start.position) * 1000 / elapsed;
    return clamp(speed, -3.35, 3.35) * (1 - Math.max(0, now - end.time) / 95);
  }

  function finishGesture(event) {
    if (!gesture) return;
    const { id, axis, origin, anchor, samples } = gesture;
    gesture = undefined;
    theater.removeAttribute('data-dragging');
    if (stage.hasPointerCapture(id)) stage.releasePointerCapture(id);
    if (axis === 'x' && event?.type === 'pointerup') {
      velocity = Math.abs(position - origin) >= .12 ? releaseVelocity(samples, event.timeStamp) : 0;
      const projected = position + velocity * .14;
      goTo(clamp(Math.round(projected), anchor - 1, anchor + 1));
    } else {
      schedule();
    }
  }

  stage.addEventListener('pointerdown', event => {
    if (!motionActive() || gesture || !event.isPrimary || event.button !== 0) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, started: event.timeStamp, axis: '' };
  });
  window.addEventListener('pointermove', event => {
    if (gesture?.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (!gesture.axis) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 7) return;
      if (Math.abs(dx) <= Math.abs(dy) * 1.15) {
        gesture.axis = 'y';
        return;
      }
      holdOpeningPose();
      velocity = 0;
      gesture.axis = 'x';
      gesture.origin = position;
      gesture.anchor = Math.round(position);
      gesture.unit = Math.max(120, stageWidth * (narrow.matches ? .64 : .58));
      gesture.samples = [{ time: gesture.started, position }];
      theater.setAttribute('data-dragging', '');
      stage.setPointerCapture(event.pointerId);
    }
    if (gesture.axis !== 'x') return;
    const raw = gesture.origin - dx / gesture.unit - gesture.anchor;
    const beyond = Math.max(0, Math.abs(raw) - 1);
    // After one project, the remaining travel compresses without a hard stop.
    const stretch = .17 * beyond / (.17 + beyond);
    position = gesture.anchor + Math.sign(raw) * (Math.min(Math.abs(raw), 1) + stretch);
    const samples = gesture.samples;
    if (Math.abs(samples.at(-1).position - position) > .001) {
      if (samples.length >= 24) samples.shift();
      samples.push({ time: event.timeStamp, position });
    }
    schedule();
  }, { passive: true });
  for (const eventName of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    window.addEventListener(eventName, event => {
      if (gesture?.id === event.pointerId) finishGesture(event);
    });
  }
  window.addEventListener('blur', () => finishGesture());

  controls.addEventListener('click', event => {
    const button = event.target.closest('[data-theater-step]');
    if (button) {
      finishGesture();
      selectBy(Number(button.dataset.theaterStep));
    }
  });
  theater.addEventListener('keydown', event => {
    if ((event.target !== stage && !event.target.matches('[data-theater-step]')) ||
        event.altKey || event.ctrlKey || event.metaKey) return;
    const step = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
    if (step) {
      event.preventDefault();
      finishGesture();
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
      openingLift = 0;
      openingBias = 0;
      entranceSeen = true;
      finishGesture();
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
      holdOpeningPose();
      finishGesture();
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
  setPose(0, 0, 0);
  syncMotion();
})();
