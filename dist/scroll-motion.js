'use strict';

// Native scrolling stays native; only the presentation follows an eased value.
(() => {
  function init() {
    const root = document.documentElement;
    const hero = document.querySelector('.hero');
    const sections = [...document.querySelectorAll('[data-scroll]')].map(element => ({
      element, top: 0, height: 1, active: true, dirty: true,
      progress: NaN, shift: NaN, scale: NaN
    }));
    const byElement = new Map(sections.map(section => [section.element, section]));
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
    let frame = 0, lastTime = 0, layoutDirty = true, syncPosition = true;
    let viewportHeight = 1, amplitude = 36;
    let heroTop = 0, heroHeight = 1;
    let targetY = 0, easedY = 0, velocity = 0;
    let writtenHero = NaN, writtenVelocity = NaN, dispatchedHero = NaN;

    function writeRoot(progress, speed) {
      const heroValue = Number(progress.toFixed(4));
      const speedValue = Number(speed.toFixed(4));
      if (heroValue !== writtenHero) {
        root.style.setProperty('--hero-progress', String(heroValue));
        writtenHero = heroValue;
      }
      if (speedValue !== writtenVelocity) {
        root.style.setProperty('--scroll-velocity', String(speedValue));
        writtenVelocity = speedValue;
      }
      // Consumers can use the same eased value without their own scroll loop.
      if (hero && (!Number.isFinite(dispatchedHero) || Math.abs(heroValue - dispatchedHero) >= .002 || ((heroValue === 0 || heroValue === 1) && heroValue !== dispatchedHero))) {
        dispatchedHero = heroValue;
        document.dispatchEvent(new CustomEvent('portfolio:scroll-change', { detail: { progress: heroValue } }));
      }
    }

    function writeSection(section, progress, shift, scale) {
      const p = Number(progress.toFixed(4));
      const y = Number(shift.toFixed(2));
      const s = Number(scale.toFixed(4));
      const style = section.element.style;
      if (p !== section.progress) {
        style.setProperty('--section-progress', String(p));
        section.progress = p;
      }
      if (y !== section.shift) {
        style.setProperty('--section-shift', `${y}px`);
        section.shift = y;
      }
      if (s !== section.scale) {
        style.setProperty('--section-scale', String(s));
        section.scale = s;
      }
      section.dirty = false;
    }

    function writeStatic() {
      writeRoot(0, 0);
      sections.forEach(section => writeSection(section, .5, 0, 1));
    }

    function requestFrame() {
      if (!frame && !document.hidden && !reduced.matches) {
        frame = requestAnimationFrame(tick);
      }
    }

    function invalidate(synchronize = false) {
      layoutDirty = true;
      if (synchronize) syncPosition = true;
      requestFrame();
    }

    function tick(now) {
      frame = 0;
      if (document.hidden || reduced.matches) return;

      // Read phase: layout is measured only after an explicit invalidation.
      targetY = window.scrollY || 0;
      if (layoutDirty) {
        viewportHeight = Math.max(1, window.innerHeight);
        amplitude = window.innerWidth < 720 ? 18 : 36;
        if (hero) {
          const rect = hero.getBoundingClientRect();
          heroTop = rect.top + targetY;
          heroHeight = Math.max(1, rect.height);
        }
        sections.forEach(section => {
          const rect = section.element.getBoundingClientRect();
          section.top = rect.top + targetY;
          section.height = Math.max(1, rect.height);
          section.dirty = true;
        });
        layoutDirty = false;
      }

      const dt = lastTime ? clamp((now - lastTime) / 1000, 1 / 240, .05) : 1 / 60;
      lastTime = now;
      const previousY = easedY;
      if (syncPosition) {
        easedY = targetY;
        velocity = 0;
        syncPosition = false;
      } else {
        // Time-based damping behaves consistently on 60 Hz and 120 Hz screens.
        easedY += (targetY - easedY) * (1 - Math.exp(-dt * 12));
        if (Math.abs(targetY - easedY) < .08) easedY = targetY;
        const instantaneous = clamp((easedY - previousY) / dt / viewportHeight / 2, -1, 1);
        velocity += (instantaneous - velocity) * (1 - Math.exp(-dt * 16));
        if (Math.abs(velocity) < .0005 && easedY === targetY) velocity = 0;
      }

      const heroProgress = hero ? clamp((easedY - heroTop) / heroHeight) : 0;
      const updates = [];
      sections.forEach(section => {
        if (!section.active && !section.dirty) return;
        // An exiting section receives its terminal state once, then sleeps.
        const y = section.active ? easedY : targetY;
        const distance = y + viewportHeight - section.top;
        const progress = clamp(distance / (viewportHeight + section.height));
        const entry = clamp(distance / Math.min(section.height, viewportHeight));
        updates.push([section, progress, amplitude * (1 - 2 * progress), .94 + .06 * entry]);
      });

      // Write phase: transform consumers must be children of measured sections.
      updates.forEach(update => writeSection(...update));
      writeRoot(heroProgress, velocity);

      if (Math.abs(targetY - easedY) > .08 || velocity !== 0) requestFrame();
      else lastTime = 0;
    }

    window.addEventListener('scroll', requestFrame, { passive: true });
    window.addEventListener('resize', () => invalidate(), { passive: true });
    window.addEventListener('pageshow', () => invalidate(true));
    document.addEventListener('portfolio:layout-change', () => invalidate());
    document.addEventListener('load', event => {
      if (event.target instanceof HTMLImageElement) invalidate();
    }, true);

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const section = byElement.get(entry.target);
          if (!section) return;
          section.active = entry.isIntersecting;
          section.dirty = true;
        });
        requestFrame();
      }, { rootMargin: '256px 0px', threshold: 0 });
      sections.forEach(section => observer.observe(section.element));
    }

    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(() => invalidate());
      observer.observe(document.body);
      if (hero) observer.observe(hero);
      sections.forEach(section => observer.observe(section.element));
    }
    if (document.fonts) {
      document.fonts.ready.then(() => invalidate());
      document.fonts.addEventListener?.('loadingdone', () => invalidate());
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
      } else invalidate(true);
    });
    reduced.addEventListener('change', () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      if (reduced.matches) writeStatic();
      else invalidate(true);
    });

    if (reduced.matches) writeStatic();
    else requestFrame();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
