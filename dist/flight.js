'use strict';
(() => {
  if (!('IntersectionObserver' in window) || !('DOMMatrix' in window)) return;
  // x/y departure, depth, yaw, pitch, bank, path bend, near-plane offset.
  // The paths are authored for the compositions. Layout and copy never move.
  const paths = {
    'last-wind':     [-.29, -.25, .78,  62,  13, -10,  .13,  .12, -.04],
    'rusjet':        [ .34, -.13, .81, -63, -13,  11, -.09, -.09,  .16],
    'okoshko':       [-.17,  .11, .68,  41,  27,  -6,  .11,  .10, -.10],
    'one-zaabeel':   [-.34, -.16, .79,  58, -10,  -8,  .12,  .15,  .02],
    'hse-coffee':    [ .22,  .09, .55, -37,  21,   5, -.04, -.11,  .10],
    'faithoverfear': [-.20, -.11, .76,  51,  -9,  -7,  .05,  .13,  .06],
    'latelier':      [ .26, -.08, .63, -46,  16,  13, -.10, -.13,  .06],
    'freelance-bot': [-.30,  .12, .50,  50,  18, -12,  .13,  .11, -.06],
    'lektoriy':      [ .15, -.16, .74, -36,  30,   7, -.05, -.08,  .13],
    'xcelmini':      [-.23, -.08, .58,  45,  17,  -9,  .09,  .09, -.09],
    'glavny-geroy':  [ .30,  .13, .85, -51, -29,  12, -.10, -.09, -.05],
    'orbit':         [-.13, -.20, .77,  53,  12, -12,  .15,  .14,  .07],
    'sochi':         [-.06, -.12, .65,  25,  53,  -5,  .03,  .05,  .11],
    'vlados-quiz':   [ .28,  .12, .56, -48,  30,  13, -.12, -.08,  .12],
    'focus-plus':    [-.13,  .17, .58,  34, -29,  -7,  .09,  .13, -.10],
    'b2-sprint':     [ .29, -.14, .60, -39,  31,  10, -.09, -.16,  .07],
  };
  // Long establishing shots, fast cuts and quieter reveals are authored in
  // viewport space. They all have a settled reading interval before exit.
  const shots = {
    establish: { start:1.09, span:.68, mobile:.53, exit:.23, lift:.22, pace:1.48, arc:1, delay:.06, exitDir:1 },
    swing:     { start:1.06, span:.55, mobile:.48, exit:.20, lift:.24, pace:1.24, arc:.75, delay:.05, exitDir:-1 },
    dissolve:  { start:1.03, span:.45, mobile:.39, exit:.14, lift:.12, pace:1.64, arc:.30, delay:.025, exitDir:1 },
    cut:       { start:1.02, span:.32, mobile:.29, exit:.10, lift:.10, pace:1.40, arc:.44, delay:0, exitDir:-1 },
  };
  const shotFor = {
    'last-wind':'establish', rusjet:'establish', okoshko:'establish',
    'hse-coffee':'dissolve', 'one-zaabeel':'establish', faithoverfear:'swing', latelier:'swing',
    'freelance-bot':'cut', lektoriy:'dissolve', xcelmini:'cut',
    'glavny-geroy':'swing', orbit:'establish', sochi:'dissolve',
    'vlados-quiz':'cut', 'focus-plus':'cut', 'b2-sprint':'dissolve',
  };
  const depth = {
    main:   { x:0, y:0, gain:1, z:0, bank:0, phase:0 },
    near:   { x:1, y:1, gain:.82, z:.17, bank:-.32, phase:.80 },
    far:    { x:-.53, y:-.52, gain:.52, z:-.12, bank:.20, phase:-.70 },
    detail: { x:-.55, y:1.37, gain:1.15, z:.07, bank:.24, phase:1 },
  };
  const beats = [...document.querySelectorAll('[data-flight]')].flatMap(beat => {
    const scene = beat.querySelector('[data-flight-scene]');
    const path = paths[beat.dataset.flight];
    if (!scene || !path) return [];
    const shot = shots[shotFor[beat.dataset.flight]] || shots.dissolve;
    return [{ scene, path, shot, layers:[...new Set([...scene.querySelectorAll('[data-flight-layer]')]
      .map(layer => layer.dataset.flightLayer))] }];
  });
  if (!beats.length) return;
  const theater = document.querySelector('.project-theater');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 600px)');
  const visible = new Set();
  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = value => value * value * (3 - 2 * value);
  let frame = 0, enabled = false;

  function projectPlane(matrix) {
    // Return flat projective coordinates. No output Z depth is needed;
    // keeping it separate prevents stretched layers in WebKit.
    const w = matrix.m44;
    return 'matrix3d(' + [matrix.m11 / w, matrix.m12 / w, 0, matrix.m14 / w,
      matrix.m21 / w, matrix.m22 / w, 0, matrix.m24 / w,
      0, 0, 1, 0, matrix.m41 / w, matrix.m42 / w, 0, 1]
      .map(value => Number(value.toFixed(7))).join(',') + ')';
  }

  function pose({scene, path, shot, layers}, box, viewport, mobile) {
    const span = Math.min(viewport * (mobile ? shot.mobile : shot.span),
      box.height + (mobile ? 88 : 185));
    const entry = clamp((viewport * shot.start - box.top) / span);
    const leaving = shot.lift * smooth(clamp((viewport * shot.exit - box.bottom) / (viewport * .24)));
    if (entry === 1 && leaving === 0) {
      scene.removeAttribute('data-flight-moving');
      return;
    }
    const [x,y,z,yaw,pitch,bank,bend,nx,ny] = path;
    const softness = mobile ? .70 : 1;
    const distance = Math.min(box.width * z, mobile ? 325 : 690);
    const lens = mobile ? Math.max(420, Math.min(570, innerWidth * 1.23))
      : Math.max(585, Math.min(1100, innerWidth * .82));
    for (const key of layers) {
      const config = depth[key];
      if (!config) continue;
      // Phase offsets ping-pong across depths but are exactly zero at both
      // endpoints: no jump to the static composition on fast/reverse scrolling.
      const wave = 4 * entry * (1 - entry);
      const time = clamp(entry - config.phase * shot.delay * wave);
      const remaining = (1 - time) ** shot.pace;
      const arc = shot.arc * Math.sin(Math.PI * time) ** 2;
      const delta = remaining + arc * .45;
      const direction = shot.exitDir + config.x * .35;
      const px = box.width * softness * (x * remaining * config.gain + bend * arc
        + nx * config.x * delta - x * leaving * direction);
      const py = box.height * (y * remaining * config.gain + ny * config.y * delta
        - .05 * arc - (.29 + config.z) * leaving);
      const pz = -distance * remaining + Math.min(box.width, 730) * config.z * delta
        + arc * (mobile ? 15 : 40) - leaving * 45;
      const camera = new DOMMatrix();
      camera.m34 = -1 / lens;
      camera.translateSelf(px, py, pz)
        .rotateAxisAngleSelf(0, 1, 0, yaw * (remaining * config.gain - leaving * .56 * direction) * softness)
        .rotateAxisAngleSelf(1, 0, 0, pitch * (remaining + leaving * .31) * softness)
        .rotateAxisAngleSelf(0, 0, 1, bank * (remaining * (1 + config.bank) - arc * .14) * softness);
      scene.style.setProperty('--flight-' + key, projectPlane(camera));
    }
    scene.setAttribute('data-flight-moving', '');
  }

  function paint() {
    frame = 0;
    const viewport = innerHeight, mobile = compact.matches;
    // Read geometry first; never alternate layout reads and transform writes.
    const geometry = [...visible].map(beat => [beat, beat.scene.getBoundingClientRect()]);
    for (const [beat, box] of geometry) pose(beat, box, viewport, mobile);
  }
  function schedule() {
    if (enabled && visible.size && !frame) frame = requestAnimationFrame(paint);
  }
  function syncMotion() {
    enabled = !reduced.matches && !theater?.hasAttribute('data-static');
    if (enabled) schedule();
    else {
      cancelAnimationFrame(frame);
      frame = 0;
      for (const {scene} of beats) scene.removeAttribute('data-flight-moving');
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
  }, {rootMargin:'60px 0px 110px'});
  for (const {scene} of beats) observer.observe(scene);
  for (const event of ['scroll', 'resize', 'pageshow']) window.addEventListener(event, schedule, {passive:true});
  reduced.addEventListener('change', syncMotion);
  if (theater) new MutationObserver(syncMotion).observe(theater, {attributeFilter:['data-static']});
  syncMotion();
})();
