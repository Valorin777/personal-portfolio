'use strict';
(() => {
  const root=document.documentElement;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const motion=document.querySelector('#motion');
  let paused=reduced.matches;
  function syncMotion(){
    document.body.classList.toggle('ambient-paused',paused||reduced.matches);
    if(motion){motion.disabled=reduced.matches;motion.setAttribute('aria-pressed',String(paused||reduced.matches));motion.setAttribute('aria-label',reduced.matches?'Движение отключено в настройках устройства':paused?'Включить движение скульптуры':'Приостановить движение скульптуры');motion.textContent=paused||reduced.matches?'Движение выключено':'Пауза движения';}
    document.dispatchEvent(new CustomEvent('portfolio:motion-change',{detail:{paused:paused||reduced.matches}}));
  }
  motion?.addEventListener('click',()=>{paused=!paused;syncMotion();});
  reduced.addEventListener('change',()=>{paused=reduced.matches;syncMotion();});
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
      document.dispatchEvent(new CustomEvent('portfolio:layout-change'));
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


  const reveals=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window&&!reduced.matches){
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{threshold:.04,rootMargin:'0px 0px 30px 0px'});
    reveals.forEach(el=>{if(el.getBoundingClientRect().top<innerHeight)el.classList.add('is-visible');else observer.observe(el);});
  }else reveals.forEach(el=>el.classList.add('is-visible'));
  reduced.addEventListener('change',()=>{if(reduced.matches)reveals.forEach(el=>el.classList.add('is-visible'));});
  const progress=document.querySelector('#progress');let pending=false;
  function update(){pending=false;if(progress){const d=root.scrollHeight-innerHeight;progress.style.transform=`scaleX(${d>0?Math.min(1,Math.max(0,scrollY/d)):0})`;}}
  addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update);}},{passive:true});
  addEventListener('resize',update,{passive:true});update();syncMotion();root.classList.add('js');
})();
