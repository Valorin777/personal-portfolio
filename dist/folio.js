'use strict';
(() => {
  const page = document.querySelector('.folio-page');
  if (!page) return;
  const intro = page.querySelector('[data-folio-intro]');
  const strip = intro.querySelector('[data-folio-proof]');
  const cards = [...strip.querySelectorAll('[data-proof-card]')];
  const sections = [...page.querySelectorAll('[data-folio-section]')];
  const navLinks = [...page.querySelectorAll('[data-folio-nav] nav a')];
  const theater = page.querySelector('.project-theater');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0, active = false, selected = null;
  const arrival = !location.hash && performance.getEntriesByType('navigation')[0]?.type !== 'back_forward'
    && !reduced.matches ? performance.now() : null;
  const clamp = n => Math.max(0,Math.min(1,n));

  function paint(now) {
    frame = 0;
    const vh = innerHeight;
    // Measure adjacent chapters together and only move their decorative art.
    const offsets = sections.map(section => section.getBoundingClientRect().top);
    const spread = strip.getBoundingClientRect();
    const phase = clamp(-spread.top / (spread.height * .72 || 1));
    if (active) {
      let arranging = false;
      for (let i = 0; i < cards.length; i++) {
        // A short shared lens sweep, not a content reveal. The three paintings
        // enter with different depths and land in the same spread.
        const raw = arrival === null ? 1 : clamp((now - arrival - i*58) / 660);
        const lift = (1 - raw) ** 2.8;
        const depth = i === 0 ? 1 : i === 1 ? .63 : .82;
        const sway = Math.sin(phase*Math.PI*.86);
        const x = lift * (i===1 ? 18 : -25) * depth;
        const y = -sway * (i===0?16:i===1?6:10) + lift * 20 * depth;
        cards[i].style.setProperty('--folio-media-x',x.toFixed(2)+'px');
        cards[i].style.setProperty('--folio-media-y',y.toFixed(2)+'px');
        cards[i].style.setProperty('--folio-media-yaw',(lift*(i===1?8:-10)*depth).toFixed(2)+'deg');
        cards[i].style.setProperty('--folio-media-scale',(1.04 + sway*.055 + lift*.19*depth).toFixed(3));
        if (raw < 1 && spread.bottom > 0) arranging = true;
      }
      if (arranging) schedule();
      for (let i = 0; i < sections.length; i++) {
        const p = clamp((vh*.91-offsets[i])/(vh*.51 || 1));
        sections[i].style.setProperty('--folio-line',Math.round(p*100)+'%');
      }
    }
    let id = null;
    for (let i = 0; i < sections.length; i++) if (offsets[i] <= vh * .33) id = sections[i].id;
    if (scrollY + vh >= document.documentElement.scrollHeight - 18) id = sections.at(-1)?.id ?? id;
    if (id !== selected) {
      for (const link of navLinks) {
        if (link.getAttribute('href') === '#'+id) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      }
      selected = id;
    }
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
  function sync() {
    active = !reduced.matches && !theater?.hasAttribute('data-static');
    page.toggleAttribute('data-folio-motion',active);
    if (!active) {
      for (const card of cards) for (const part of ['x','y','yaw','scale']) card.style.removeProperty('--folio-media-'+part);
      for (const section of sections) section.style.removeProperty('--folio-line');
    }
    schedule();
  }
  for (const event of ['scroll','resize','pageshow','hashchange']) window.addEventListener(event,schedule,{passive:true});
  reduced.addEventListener('change',sync);
  if (theater) new MutationObserver(sync).observe(theater,{attributeFilter:['data-static']});
  sync();
})();
