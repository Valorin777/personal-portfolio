'use strict';
(() => {
  if (!('IntersectionObserver' in window) || !('DOMMatrix' in window)) return;
  const beats = [...document.querySelectorAll('.flight-beat')].map(beat => ({
    scene: beat.querySelector('[data-flight-scene]'),
    kind: beat.dataset.flight,
  }));
  if (!beats.length) return;
  const theater = document.querySelector('.project-theater');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 600px)');
  const visible = new Set();
  const clamp = value => Math.max(0, Math.min(1, value));

  const paths = {
    wind: { x: -.29, y: -.265, yCurve: 1.95, lift: .028, z: .81, yaw: 61, pitch: 11, roll: -9, arc: .125, nearX: .112, nearY: -.028 },
    jet: { x: .34, y: -.13, z: .76, yaw: -69, pitch: -12, roll: 10, arc: -.077, nearX: -.09, nearY: .17 },
    shore: { x: -.06, y: -.14, z: .66, yaw: 24, pitch: 59, roll: -5, arc: .032, nearX: .045, nearY: .11 },
  };
  let frame = 0;
  let enabled = false;

  function projectPlane(matrix) {
    // Keep the perspective divisor and projected x/y. The output z is unused
    // for a flat surface and letting WebKit composite it can stretch the image.
    const w = matrix.m44;
    const values = [
      matrix.m11 / w, matrix.m12 / w, 0, matrix.m14 / w,
      matrix.m21 / w, matrix.m22 / w, 0, matrix.m24 / w,
      0, 0, 1, 0, matrix.m41 / w, matrix.m42 / w, 0, 1,
    ];
    return `matrix3d(${values.map(value => Number(value.toFixed(7))).join(',')})`;
  }

  function pose(scene, kind, box, viewport) {
    const mobile = compact.matches;
    // Arrive while the artwork is still in view. The shorter phone pass
    // uses fewer scroll pixels and retains a deliberate rotation in depth.
    const start = viewport * .97;
    const span = Math.min(viewport * (mobile ? .39 : .51), box.height + (mobile ? 56 : 132));
    const progress = clamp((start - box.top) / span);
    if (progress === 1) {
      scene.removeAttribute('data-flight-moving');
      return;
    }
    const remaining = (1 - progress) ** 1.23;
    const arc = Math.sin(Math.PI * progress) ** 2;
    const path = paths[kind];
    const turn = mobile ? .78 : 1;
    const distance = Math.min(box.width * path.z, mobile ? 365 : 710);
    const lens = mobile ? Math.min(570, Math.max(410, innerWidth * 1.25))
      : Math.min(1090, Math.max(570, innerWidth * .76));
    const x = box.width * (path.x * remaining + path.arc * arc) * (mobile ? .8 : 1);
    const y = box.height * (path.y * remaining ** (path.yCurve ?? 1) - (path.lift ?? .075) * arc);
    const z = -distance * remaining + (mobile ? 22 : 62) * arc;
    const camera = new DOMMatrix();
    camera.m34 = -1 / lens;
    camera.translateSelf(x, y, z)
      .rotateAxisAngleSelf(0, 1, 0, path.yaw * remaining * turn)
      .rotateAxisAngleSelf(1, 0, 0, path.pitch * remaining * (mobile ? .84 : 1))
      .rotateAxisAngleSelf(0, 0, 1, (path.roll * remaining - Math.sign(path.roll) * 2.1 * arc) * turn);
    scene.style.setProperty('--flight-frame-transform', projectPlane(camera));

    const nearX = box.width * path.nearX * (remaining + .44 * arc);
    const nearY = box.height * path.nearY * (remaining + .26 * arc);
    const nearZ = (mobile ? 38 : 74) * (remaining + .32 * arc);
    const nearTransform = kind === 'shore'
      ? `translate(${nearX.toFixed(2)}px,${nearY.toFixed(2)}px)`
      : projectPlane(camera.translateSelf(nearX, nearY, nearZ).rotateAxisAngleSelf(0, 0, 1, path.roll * -.38 * remaining));
    scene.style.setProperty('--flight-near-transform', nearTransform);
    scene.setAttribute('data-flight-moving', '');
  }

  function paint() {
    frame = 0;
    const viewport = innerHeight;
    const geometry = [...visible].map(beat => [beat, beat.scene.getBoundingClientRect()]);
    for (const [{ scene, kind }, box] of geometry) pose(scene, kind, box, viewport);
  }

  function schedule() {
    if (enabled && visible.size && !frame) frame = requestAnimationFrame(paint);
  }

  function syncMotion() {
    enabled = !reduced.matches && !theater?.hasAttribute('data-static');
    if (enabled) {
      schedule();
    } else {
      cancelAnimationFrame(frame);
      frame = 0;
      for (const { scene } of beats) scene.removeAttribute('data-flight-moving');
    }
  }

  const byScene = new Map(beats.map(beat => [beat.scene, beat]));
  const observer = new IntersectionObserver(entries => {
    for (const { target, isIntersecting } of entries) {
      const beat = byScene.get(target);
      if (isIntersecting) visible.add(beat);
      else {
        visible.delete(beat);
        target.removeAttribute('data-flight-moving');
      }
    }
    schedule();
  }, { rootMargin: '100px 0px 160px' });
  for (const { scene } of beats) observer.observe(scene);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  reduced.addEventListener('change', syncMotion);
  if (theater) new MutationObserver(syncMotion).observe(theater, { attributeFilter: ['data-static'] });
  syncMotion();
})();
