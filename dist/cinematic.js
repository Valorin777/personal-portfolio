'use strict';
(() => {
  const sequence = document.querySelector('[data-cine-sequence]');
  if (!sequence) return;
  const stage = sequence.querySelector('[data-cine-stage]');
  const scene = stage.querySelector('.cine-frame');
  const plates = [...stage.querySelectorAll('[data-cine-plate]')];
  const tabs = [...stage.querySelectorAll('[data-cine-tab]')];
  const stops = [...sequence.querySelectorAll('[data-cine-stop]')];
  const indicator = stage.querySelector('[data-cine-frame-index]');
  const theater = document.querySelector('.project-theater');
  if (!scene || plates.length !== 3 || stops.length !== 3) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 850px)');
  const navigation = performance.getEntriesByType('navigation')[0]?.type;
  const begin = !location.hash && navigation !== 'back_forward' ? performance.now() : null;
  // x and y are fractions of the scene; z, yaw, pitch and bank are physical camera values.
  const poses = [
    [[ .04, .094,  93, -11,   8,  -6, .86],[-.235,-.196,-142,  23, -10, -15,.78],[ .23,-.147,-166,-23,-12, 16,.83]],
    [[ .00, .028,  65,  -2,   2,  -1,1.02],[-.395,-.255,-212,  42, -23, -28,.73],[ .435,-.19,-184,-35,-19, 17,.70]],
    [[-.40, .175,-190,  44,  13, -19,.72],[ .003, .032,  90,  0,   4,   1,.99],[ .332,-.222,-188,-32,-23, 22,.76]],
    [[-.47, .155,-254,  43,  19, -25,.73],[ .42,-.225,-190, -44, -19,  22,.70],[ .006, .047,  94, -1,  0, -1,1.04]],
  ];
  const light = [[94,78,149],[169,86,117],[120,81,165],[74,100,134]];
  const enter = [[-.16,-.17,-218,34,-24, -9,.96],[ .46,.20,-143,-56,31,22,.95],[-.41,.16, 142,44,21,-26,.92]];
  const clamp = (value, a=0, b=1) => Math.max(a,Math.min(b,value));
  const blend = (a,b,p) => a+(b-a)*p;
  const smooth = v => v*v*(3-2*v);
  const k = n => Number(n.toFixed(3));
  let running = false, frame = 0, visualIndex = -1, points = [], width = 0, height = 0;
  let compact = false, scrollDriven = 0, mouseX = 0, mouseY = 0, panX = 0, panY = 0, dirty = true;

  function measure() {
    const rect = scene.getBoundingClientRect();
    width = rect.width; height = rect.height;
    compact = narrow.matches;
    const readerY = compact
      ? Math.min(innerHeight*.70,rect.height + 140)
      : innerHeight*.49;
    points = stops.map(stop => Math.max(1,stop.getBoundingClientRect().top + scrollY - readerY));
    dirty = false;
  }
  function progress(position) {
    let previous = 0;
    for (let i=0;i<points.length;i++) {
      if (position<=points[i]) {
        const t = clamp((position-previous)/Math.max(1,points[i]-previous));
        return i+t;
      }
      previous = points[i];
    }
    return points.length;
  }
  function highlight(index) {
    if (index === visualIndex) return;
    visualIndex = index;
    indicator.textContent = '0'+(index+1)+' / 03';
    for (let i=0;i<tabs.length;i++) {
      if (i===index) tabs[i].setAttribute('aria-current','location');
      else tabs[i].removeAttribute('aria-current');
    }
  }
  function paint(now) {
    frame = 0;
    if(!running || document.hidden) return;
    if(dirty) measure();
    if (!width || !height) return;
    const q = progress(scrollY);
    scrollDriven = Math.abs(q-scrollDriven)>.92 ? q : blend(scrollDriven,q,.34);
    if(Math.abs(q-scrollDriven)<.002) scrollDriven=q;
    const sceneT = scrollDriven;
    const left = Math.min(2,Math.floor(sceneT));
    const between = smooth(clamp(sceneT-left));
    const palette = light[left].map((v,i)=>Math.round(blend(v,light[left+1][i],between)));
    scene.style.setProperty('--cine-light',`rgb(${palette[0]} ${palette[1]} ${palette[2]} / .78)`);
    panX=blend(panX,mouseX,.19); panY=blend(panY,mouseY,.19);
    let unfolding = false;
    for(let i=0;i<plates.length;i++) {
      const raw = begin===null ? 1 : clamp((now-begin-i*73)/1020);
      // Underdamped initial unfold; no image or information is gated by opacity.
      const away = (1-raw)**2.25 * Math.cos(raw*Math.PI*1.48) * (1-clamp(sceneT*.72));
      const pose = poses[left][i].map((v,j)=>blend(v,poses[left+1][i][j],between));
      const zDepth = compact ? .72 : 1;
      const x = width*(pose[0] + enter[i][0]*away + panX*.015*(i+1));
      const y = height*(pose[1] + enter[i][1]*away + panY*.015);
      const z = (pose[2]+enter[i][2]*away)*zDepth;
      const yaw = (pose[3]+enter[i][3]*away + panX*4)*(compact?.92:1);
      const pitch = pose[4]+enter[i][4]*away-panY*4;
      const bank = pose[5]+enter[i][5]*away;
      const scale = pose[6] * (1+(enter[i][6]-1)*away);
      const cut = smooth(clamp((sceneT-i-.14)/.86));
      plates[i].style.setProperty('--cine-x',k(x)+'px');
      plates[i].style.setProperty('--cine-y',k(y)+'px');
      plates[i].style.setProperty('--cine-z',k(z)+'px');
      plates[i].style.setProperty('--cine-yaw',k(yaw)+'deg');
      plates[i].style.setProperty('--cine-pitch',k(pitch)+'deg');
      plates[i].style.setProperty('--cine-bank',k(bank)+'deg');
      plates[i].style.setProperty('--cine-scale',k(scale));
      plates[i].style.setProperty('--cine-cut',k(cut));
      if(raw<1 && sceneT<1.35) unfolding=true;
    }
    highlight(sceneT<1.5 ? 0 : sceneT<2.5 ? 1 : 2);
    if(unfolding || Math.abs(q-scrollDriven)>.002 || Math.abs(mouseX-panX)+Math.abs(mouseY-panY)>.01) schedule();
  }
  function schedule(){if(running && !frame) frame=requestAnimationFrame(paint);}
  function refresh(){dirty=true;schedule();}
  function sync(){
    running = !reduced.matches && !theater?.hasAttribute('data-static');
    if(running) {
      sequence.setAttribute('data-cine-ready','');
      refresh();
    } else {
      cancelAnimationFrame(frame);
      frame=0;
      {
        sequence.removeAttribute('data-cine-ready');
        for(const plate of plates) plate.removeAttribute('style');
        scene.style.removeProperty('--cine-light');
        mouseX=mouseY=panX=panY=scrollDriven=0;
        highlight(0);
      }
    }
  }
  stage.addEventListener('pointermove',event=>{
    if(event.pointerType==='touch'||!running||narrow.matches) return;
    const rect=scene.getBoundingClientRect();
    mouseX=clamp((event.clientX-rect.left)/rect.width*2-1,-1,1);
    mouseY=clamp((event.clientY-rect.top)/rect.height*2-1,-1,1);
    schedule();
  },{passive:true});
  stage.addEventListener('pointerleave',()=>{mouseX=mouseY=0;schedule();});
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',refresh,{passive:true});
  window.addEventListener('pageshow',refresh,{passive:true});
  if('ResizeObserver' in window) new ResizeObserver(refresh).observe(sequence);
  reduced.addEventListener('change',sync);
  narrow.addEventListener('change',refresh);
  if(theater) new MutationObserver(sync).observe(theater,{attributeFilter:['data-static']});
  document.addEventListener('visibilitychange',schedule);
  if ('IntersectionObserver' in window) {
    const archive = new IntersectionObserver(entries=>{
      for (const {isIntersecting,target} of entries) {
        if (!isIntersecting) continue;
        archive.unobserve(target);
        if (!running) continue;
        target.setAttribute('data-cine-archive-enter','');
        target.addEventListener('animationend',()=>target.removeAttribute('data-cine-archive-enter'),{once:true});
      }
    },{threshold:.16});
    for (const card of document.querySelectorAll('[data-work-card]')) archive.observe(card);
  }
  sync();
})();
