'use strict';

// A single ruled surface, three studies. All geometry is generated locally.
(() => {
  const canvas = document.querySelector('#sculpture');
  const stage = document.querySelector('#sculpture-stage');
  if (!canvas || !stage) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const buttons = [...document.querySelectorAll('[data-shape]')];
  const caption = document.querySelector('#sculpture-caption');
  const names = ['form', 'flow', 'system'];
  const captions = {
    form: '01 — Форма. Непрерывная поверхность.',
    flow: '02 — Поток. Движение одной плоскости.',
    system: '03 — Система. Порядок в каждой линии.'
  };
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const mix = (a, b, t) => a + (b - a) * t;
  const TAU = Math.PI * 2;
  let width = 600, height = 620, scale = 175;
  let uCount = 144, vCount = 36;
  let forms = [], current, source, projected;
  let patches = [];
  let selected = 'form', morph = 1;
  let paused = document.body.classList.contains('ambient-paused');
  let inView = true, frame = 0, previousTime = 0;
  let phase = 0, yaw = 0, pitch = 0, targetYaw = 0, targetPitch = 0;
  let drag = null;
  let ink = '#c4d5d1', accent = '#d8a17c', paper = '#111619';

  function point(shape, u, v) {
    if (shape === 'flow') {
      const s = u / Math.PI - 1;
      return [
        1.28 * s,
        .74 * v + .13 * Math.sin(s * Math.PI),
        .36 * Math.sin(s * Math.PI + 1.4 * v) + .13 * Math.cos(v * 2.6)
      ];
    }
    if (shape === 'system') {
      const phi = v * Math.PI / 2;
      return [1.12 * Math.cos(phi) * Math.cos(u), 1.12 * Math.cos(phi) * Math.sin(u), 1.12 * Math.sin(phi)];
    }
    // Full twist, closed boundary: each line returns to its starting point.
    const radius = .94 + .50 * v * Math.cos(u);
    return [radius * Math.cos(u), radius * Math.sin(u), .50 * v * Math.sin(u)];
  }

  function buildGeometry() {
    const length = (uCount + 1) * (vCount + 1) * 3;
    forms = names.map(name => {
      const points = new Float32Array(length);
      for (let u = 0; u <= uCount; u++) {
        for (let v = 0; v <= vCount; v++) {
          points.set(point(name, u / uCount * TAU, v / vCount * 2 - 1), (u * (vCount + 1) + v) * 3);
        }
      }
      return points;
    });
    current = new Float32Array(forms[names.indexOf(selected)]);
    source = new Float32Array(current);
    projected = new Float32Array(length);
    morph = 1;
    patches = [];
    const stepU = 4, stepV = 4;
    for (let u = 0; u < uCount; u += stepU) {
      for (let v = 0; v < vCount; v += stepV) {
        patches.push({ u, v, endU: Math.min(u + stepU, uCount), endV: Math.min(v + stepV, vCount), depth: 0 });
      }
    }
  }

  const offset = (u, v) => (u * (vCount + 1) + v) * 3;
  function vertex(u, v, move = false) {
    const i = offset(u, v);
    if (move) ctx.moveTo(projected[i], projected[i + 1]);
    else ctx.lineTo(projected[i], projected[i + 1]);
  }

  function render() {
    if (!width || !height || !current) return;
    ctx.clearRect(0, 0, width, height);
    // Slow, bounded rotation keeps the opening and the silhouette legible.
    const ax = -.76 + pitch + Math.sin(phase * .67) * .065;
    const ay = .38 + yaw + Math.sin(phase) * .19;
    const az = -.36 + Math.sin(phase * .43) * .055;
    const sx = Math.sin(ax), cx = Math.cos(ax);
    const sy = Math.sin(ay), cy = Math.cos(ay);
    const sz = Math.sin(az), cz = Math.cos(az);
    for (let i = 0; i < current.length; i += 3) {
      const x = current[i], y = current[i + 1], z = current[i + 2];
      const y1 = y * cx - z * sx, z1 = y * sx + z * cx;
      const x2 = x * cy + z1 * sy, z2 = -x * sy + z1 * cy;
      const perspective = 5.6 / (5.6 - z2);
      projected[i] = width * .5 + (x2 * cz - y1 * sz) * scale * perspective;
      projected[i + 1] = height * .49 + (x2 * sz + y1 * cz) * scale * perspective;
      projected[i + 2] = z2;
    }
    patches.forEach(patch => {
      patch.depth = (projected[offset(patch.u, patch.v) + 2] + projected[offset(patch.endU, patch.v) + 2] + projected[offset(patch.endU, patch.endV) + 2] + projected[offset(patch.u, patch.endV) + 2]) * .25;
    });
    patches.sort((a, b) => a.depth - b.depth);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    const accentV = Math.round(vCount * .78);
    for (const patch of patches) {
      const { u, v, endU, endV, depth } = patch;
      // Small opaque surface patches supply actual occlusion, preserving the
      // engraved contours without turning the sculpture into a wireframe cloud.
      ctx.globalAlpha = 1;
      ctx.fillStyle = paper;
      ctx.beginPath();
      vertex(u, v, true);
      for (let a = u + 1; a <= endU; a++) vertex(a, v);
      for (let b = v + 1; b <= endV; b++) vertex(endU, b);
      for (let a = endU - 1; a >= u; a--) vertex(a, endV);
      for (let b = endV - 1; b > v; b--) vertex(u, b);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = ink;
      ctx.globalAlpha = clamp(.48 + depth * .19, .22, .74);
      ctx.lineWidth = width < 440 ? .62 : .70;
      ctx.beginPath();
      // Long contour lines are dense; cross-ribs give only a hint of structure.
      for (let b = v; b <= endV; b++) {
        if (b === accentV || (b === endV && endV !== vCount)) continue;
        vertex(u, b, true);
        for (let a = u + 1; a <= endU; a++) vertex(a, b);
      }
      ctx.stroke();
      ctx.globalAlpha = clamp(.18 + depth * .08, .08, .30);
      ctx.lineWidth = .55;
      ctx.beginPath();
      for (let a = u; a < endU; a++) {
        if (a % 6 !== 0) continue;
        vertex(a, v, true);
        for (let b = v + 1; b <= endV; b++) vertex(a, b);
      }
      ctx.stroke();

      if (accentV >= v && accentV < endV) {
        ctx.strokeStyle = accent;
        ctx.globalAlpha = clamp(.86 + depth * .1, .62, 1);
        ctx.lineWidth = width < 440 ? 1.25 : 1.45;
        ctx.beginPath();
        vertex(u, accentV, true);
        for (let a = u + 1; a <= endU; a++) vertex(a, accentV);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    stage.classList.add('is-canvas-ready');
  }

  function runnable() {
    return inView && !document.hidden && !document.body.classList.contains('dialog-open');
  }
  function ambientEnabled() { return !paused && !reduced.matches; }
  function needsFrame() {
    return ambientEnabled() || morph < 1 || Math.abs(yaw - targetYaw) + Math.abs(pitch - targetPitch) > .0002;
  }
  function requestFrame() {
    if (!frame && runnable() && !reduced.matches) {
      previousTime = performance.now();
      frame = requestAnimationFrame(tick);
    }
  }
  function tick(now) {
    frame = 0;
    if (!runnable() || reduced.matches) return;
    const dt = Math.min((now - previousTime) / 1000 || .016, .05);
    previousTime = now;
    if (ambientEnabled() && !drag) phase += dt * .17;
    const smoothing = 1 - Math.exp(-dt * 7);
    yaw = mix(yaw, targetYaw, smoothing);
    pitch = mix(pitch, targetPitch, smoothing);
    if (morph < 1) {
      morph = Math.min(1, morph + dt / 1.15);
      const t = morph * morph * (3 - 2 * morph);
      const target = forms[names.indexOf(selected)];
      for (let i = 0; i < current.length; i++) current[i] = mix(source[i], target[i], t);
    }
    render();
    if (needsFrame()) frame = requestAnimationFrame(tick);
  }
  function refresh() {
    if (!runnable() || reduced.matches || !needsFrame()) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
    if (reduced.matches) {
      morph = 1;
      current.set(forms[names.indexOf(selected)]);
      yaw = pitch = targetYaw = targetPitch = 0;
      if (runnable()) render();
    } else requestFrame();
  }

  function measure() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width || stage.clientWidth || 600;
    height = rect.height || stage.clientHeight || 620;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    scale = Math.min(width * .305, height * .32);
    const nextU = width < 440 ? 112 : 144;
    const nextV = width < 440 ? 28 : 40;
    const style = getComputedStyle(stage);
    ink = style.getPropertyValue('--sculpture-ink').trim() || '#c4d5d1';
    accent = style.getPropertyValue('--sculpture-accent').trim() || '#d8a17c';
    paper = style.getPropertyValue('--sculpture-paper').trim() || '#111619';
    if (!current || uCount !== nextU || vCount !== nextV) {
      uCount = nextU;
      vCount = nextV;
      buildGeometry();
    }
    render();
    refresh();
  }

  function setShape(name, button) {
    if (!names.includes(name)) return;
    buttons.forEach(control => {
      const active = control.dataset.shape === name;
      control.setAttribute('aria-pressed', String(active));
      control.classList.toggle('is-active', active);
    });
    if (caption) caption.textContent = button?.dataset.caption || captions[name];
    stage.dataset.shape = name;
    if (selected === name) return;
    source.set(current);
    selected = name;
    morph = 0;
    if (reduced.matches) {
      current.set(forms[names.indexOf(name)]);
      morph = 1;
      render();
    } else requestFrame();
  }
  buttons.forEach(button => button.addEventListener('click', () => setShape(button.dataset.shape, button)));

  // Mouse-only manipulation deliberately leaves native touch scrolling intact.
  canvas.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || reduced.matches) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw: targetYaw, pitch: targetPitch };
    canvas.setPointerCapture?.(event.pointerId);
    stage.classList.add('is-dragging');
  });
  canvas.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || reduced.matches) return;
    if (drag && event.pointerId === drag.id) {
      targetYaw = clamp(drag.yaw + (event.clientX - drag.x) * .0038, -.55, .55);
      targetPitch = clamp(drag.pitch + (event.clientY - drag.y) * .003, -.32, .32);
    } else {
      const rect = canvas.getBoundingClientRect();
      targetYaw = clamp((event.clientX - rect.left) / width - .5, -.5, .5) * .30;
      targetPitch = clamp((event.clientY - rect.top) / height - .5, -.5, .5) * .18;
    }
    requestFrame();
  });
  function finishDrag(event) {
    if (!drag || (event && event.pointerId !== drag.id)) return;
    const id = drag.id;
    drag = null;
    if (canvas.hasPointerCapture?.(id)) canvas.releasePointerCapture(id);
    stage.classList.remove('is-dragging');
    targetYaw = targetPitch = 0;
    requestFrame();
  }
  canvas.addEventListener('pointerup', finishDrag);
  canvas.addEventListener('pointercancel', finishDrag);
  canvas.addEventListener('lostpointercapture', finishDrag);
  canvas.addEventListener('pointerleave', () => {
    if (!drag) { targetYaw = targetPitch = 0; requestFrame(); }
  });
  const motionChanged = event => {
    paused = event.detail?.paused ?? document.body.classList.contains('ambient-paused');
    refresh();
  };
  document.addEventListener('portfolio:motion-change', motionChanged);
  window.addEventListener('portfolio:motion-change', motionChanged);
  document.addEventListener('portfolio:dialog-change', refresh);
  reduced.addEventListener('change', refresh);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) finishDrag();
    refresh();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      refresh();
    }, { threshold: 0 }).observe(stage);
  }
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(canvas);
  else window.addEventListener('resize', measure, { passive: true });

  measure();
  setShape('form', buttons.find(button => button.dataset.shape === 'form'));
})();
