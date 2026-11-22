'use strict';
(() => {
  const signature = document.querySelector('[data-signature]');
  if (!signature || !('ResizeObserver' in window) || !('IntersectionObserver' in window)) return;
  const stage = signature.querySelector('[data-signature-stage]');
  const card = signature.querySelector('[data-signature-object]');
  const grab = signature.querySelector('[data-signature-grab]');
  const hint = signature.querySelector('[data-signature-hint]');
  const cord = signature.querySelector('[data-signature-cord]');
  const threads = [...cord.querySelectorAll('path')];
  const handoff = document.querySelector('[data-signature-handoff]');
  const theater = document.querySelector('.project-theater');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const f = n => Number(n.toFixed(2));
  let theta = -.59, swing = .6, twist = -1.04, spin = .7, stretch = 0, recoil = 0;
  let pitch = 0, pitchVelocity = 0, hover = 0, frame = 0, previous = 0;
  let width = 0, height = 0, length = 0, limit = .75, compact = false;
  let active = false, visible = false, prepared = true, drag, ignoreClick = false, impulseDirection = 1;
  const top = -18;

  function draw() {
    if (!width || !height) return;
    const ax = width * .5;
    const x = ax + Math.sin(theta) * (length + stretch);
    const y = top + Math.cos(theta) * (length + stretch);
    const displacement = x - ax;
    const roll = compact ? clamp(-theta * 34 - swing * 1.15, -13, 13) : -theta * 62 - swing * 3.15;
    const tilt = 5 + pitch * 35;
    // The contact point follows the visible face's metal socket through a flip.
    const bank = roll * Math.PI / 180, arc = tilt * Math.PI / 180;
    const depth = (width <= 560 ? 3.5 : 4.5) * (Math.cos(twist) >= 0 ? 1 : -1);
    const dx = Math.sin(twist) * Math.cos(arc) * depth, dy = -Math.sin(arc) * depth;
    const eyeX = x + dx * Math.cos(bank) - dy * Math.sin(bank);
    const eyeY = y + dx * Math.sin(bank) + dy * Math.cos(bank);
    const cable = `M${f(ax)},${top} C${f(ax + displacement * .14)},${f(top + 29)} ${f(ax + displacement * .83)},${f(y - 29)} ${f(eyeX)},${f(eyeY)}`;
    for (const thread of threads) thread.setAttribute('d', cable);
    card.style.setProperty('--sig-x', f(x) + 'px');
    card.style.setProperty('--sig-y', f(y - 22) + 'px');
    card.style.setProperty('--sig-roll', f(roll) + 'deg');
    card.style.setProperty('--sig-yaw', f(twist * 180 / Math.PI) + 'deg');
    card.style.setProperty('--sig-pitch', f(tilt) + 'deg');
  }

  function drawHandoff() {
    if (!handoff) return;
    if (!active) handoff.style.removeProperty('--signature-iris');
    else {
      const y = handoff.getBoundingClientRect().top;
      const fill = clamp((innerHeight * 1.0 - y) / (innerHeight * .59), 0, 1);
      handoff.style.setProperty('--signature-iris', f((1 - fill) ** .82));
    }
  }

  function rest() {
    theta = 0; swing = 0; twist = -.16; spin = 0;
    stretch = 0; recoil = 0; pitch = .04; pitchVelocity = 0; hover = 0;
  }

  function measure() {
    width = stage.clientWidth;
    height = stage.clientHeight;
    const cardW = card.offsetWidth, cardH = card.offsetHeight;
    length = clamp(Math.min(height * .29, height - cardH - 18) - top, 62, 235);
    const space = Math.max(30, width * .5 - cardW * .30);
    compact = width < 440;
    limit = compact
      ? clamp((width - cardW) * .43 / (length + cardH * .37), .21, .54)
      : clamp(Math.asin(clamp(space / length, .24, .93)), .40, 1.02);
    theta = clamp(theta, -limit, limit);
    cord.setAttribute('viewBox', `0 0 ${width} ${height}`);
    draw();
    drawHandoff();
  }

  function step(time) {
    frame = 0;
    if (!active || !visible || document.hidden) { previous = 0; return; }
    const dt = clamp(previous ? (time - previous) / 1000 : 1 / 60, .001, .033);
    previous = time;
    const angleForce = drag ? 46 * (drag.target - theta) - 10 * swing : -8.9 * Math.sin(theta) - 1.04 * swing;
    swing += angleForce * dt;
    theta += swing * dt;
    if (Math.abs(theta) > limit) {
      theta = clamp(theta, -limit, limit);
      swing *= -.32;
    }
    const wantedTwist = drag ? drag.yaw : -.16 + hover * .2 + swing * .15;
    spin += ((wantedTwist - twist) * (drag ? 29 : 8.2) - spin * (drag ? 7.8 : 1.27)) * dt;
    twist = clamp(twist + spin * dt, -2.72, 2.72);
    recoil += ((drag ? drag.pull : 0) - stretch) * 40 * dt - recoil * 6.3 * dt;
    stretch += recoil * dt;
    pitchVelocity += ((drag ? drag.pull * -.027 : .045 + Math.abs(swing) * .08) - pitch) * 20 * dt - pitchVelocity * 6 * dt;
    pitch += pitchVelocity * dt;
    draw();
    if (drag || Math.abs(theta) + Math.abs(swing) + Math.abs(twist - wantedTwist) + Math.abs(spin) + Math.abs(recoil) > .045) schedule();
    else previous = 0;
  }

  function schedule() {
    if (!frame && active && visible && !document.hidden) frame = requestAnimationFrame(step);
  }

  function finish(event, cancelled = false) {
    if (!drag || (event && event.pointerId !== drag.id)) return;
    const {id, moved, velocity} = drag;
    drag = undefined;
    if (grab.hasPointerCapture(id)) grab.releasePointerCapture(id);
    stage.removeAttribute('data-signature-dragging');
    if (moved) ignoreClick = true;
    if (!cancelled && moved) {
      swing = clamp(swing * .38 + velocity / length * .49, -4.8, 4.8);
      spin = clamp(spin + velocity * .0052, -6.3, 6.3);
    }
    schedule();
  }

  grab.addEventListener('pointerdown', event => {
    if (!active || event.button !== 0 || drag) return;
    ignoreClick = false;
    drag = {id:event.pointerId, x:event.clientX, y:event.clientY, lastX:event.clientX, lastTime:event.timeStamp,
      start:theta, initialTwist:twist, target:theta, yaw:twist, pull:0, velocity:0, moved:false};
    grab.setPointerCapture(event.pointerId);
    stage.setAttribute('data-signature-dragging', '');
    schedule();
  });

  grab.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    const elapsed = Math.max(8, event.timeStamp - drag.lastTime);
    drag.velocity = drag.velocity * .35 + (event.clientX - drag.lastX) * 650 / elapsed;
    drag.lastTime = event.timeStamp; drag.lastX = event.clientX;
    drag.moved ||= Math.abs(dx) + Math.abs(dy) > 6;
    drag.target = clamp(drag.start + dx / length * 1.06, -limit, limit);
    drag.yaw = clamp(drag.initialTwist + dx * .017, -2.62, 2.62);
    drag.pull = clamp(dy * .30, -22, 30);
    schedule();
  });
  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    grab.addEventListener(event, e => finish(e, event !== 'pointerup'));
  }
  grab.addEventListener('click', event => {
    if (!active || (ignoreClick && event.detail !== 0)) { ignoreClick = false; return; }
    const direction = theta > .35 ? -1 : theta < -.35 ? 1 : impulseDirection;
    impulseDirection *= -1;
    swing = direction * 3.2;
    spin = direction * 7;
    if (event.detail === 0) ignoreClick = false;
    schedule();
  });
  stage.addEventListener('pointermove', event => {
    if (drag || !active || event.pointerType === 'touch') return;
    const box = stage.getBoundingClientRect();
    hover = clamp((event.clientX - box.left) / width * 2 - 1, -1, 1);
    schedule();
  }, {passive:true});
  stage.addEventListener('pointerleave', () => { hover = 0; schedule(); });

  function sync() {
    active = !reduced.matches && !theater?.hasAttribute('data-static');
    // Keep a control out of the tab order when motion is disabled.
    grab.hidden = !active;
    hint.hidden = !active;
    signature.toggleAttribute('data-signature-active', active);
    if (!active) {
      finish(undefined, true);
      cancelAnimationFrame(frame); frame = 0; previous = 0;
      rest(); prepared = false; draw();
    } else if (!prepared) previous = 0;
    drawHandoff();
    schedule();
  }

  new ResizeObserver(measure).observe(stage);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) {
      finish(undefined, true); cancelAnimationFrame(frame); frame = 0; previous = 0;
      if (prepared) { rest(); draw(); prepared = false; }
    } else schedule();
  }, {rootMargin:'35px'}).observe(stage);
  reduced.addEventListener('change', sync);
  if (theater) new MutationObserver(sync).observe(theater, {attributeFilter:['data-static']});
  let transfer = 0;
  window.addEventListener('scroll', () => {
    if (active && !transfer) transfer = requestAnimationFrame(() => { transfer = 0; drawHandoff(); });
  }, {passive:true});
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { finish(undefined, true); cancelAnimationFrame(frame); frame = 0; previous = 0; }
    else schedule();
  });
  measure();
  sync();
})();
