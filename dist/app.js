'use strict';
const root=document.documentElement;
root.classList.add('js');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduced.matches;
const motion=document.querySelector('#motion');
const badge=document.querySelector('#badge');
const identity=document.querySelector('#identity');
const canvas=document.querySelector('#space');
const ctx=canvas.getContext('2d');
let width=0,height=0,dpr=1,frame=0,visible=true,last=0,time=0,x=0,y=0,tx=0,ty=0;
const particles=Array.from({length:55},(_,i)=>({x:((i*7919)%101)/101,y:((i*3571)%103)/103,r:i%3===0?1.1:.55,s:.2+(i%7)/10}));
function resize(){width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=width*dpr;canvas.height=height*dpr;ctx?.setTransform(dpr,0,0,dpr,0,0);draw();}
function draw(){if(!ctx)return;ctx.clearRect(0,0,width,height);for(const p of particles){ctx.beginPath();ctx.fillStyle=`rgba(167,184,239,${.25+p.s*.35})`;ctx.arc(p.x*width,(p.y*height-time*p.s*3+height*100)%height,p.r,0,Math.PI*2);ctx.fill();}}
function loop(now){frame=0;if(paused||document.hidden||!visible)return;const dt=Math.min((now-last)/1000,.04)||.016;last=now;time+=dt;x+=(tx-x)*.06;y+=(ty-y)*.06;badge.style.transform=`rotate(${6+Math.sin(time*.8)*2+x*.6}deg) rotateY(${x}deg) rotateX(${-y}deg)`;draw();frame=requestAnimationFrame(loop);}
function start(){if(!paused&&!document.hidden&&visible&&!frame){last=performance.now();frame=requestAnimationFrame(loop);}}
function state(){motion.setAttribute('aria-pressed',String(paused));motion.setAttribute('aria-label',paused?'Включить анимацию':'Приостановить анимацию');motion.textContent=paused?'▶':'II';document.body.classList.toggle('paused',paused);root.classList.toggle('motion-enabled',!paused&&!reduced.matches);if(paused){cancelAnimationFrame(frame);frame=0;}else start();}
motion.addEventListener('click',()=>{paused=!paused;state();});
reduced.addEventListener('change',()=>{paused=reduced.matches;state();});
identity.addEventListener('click',()=>identity.setAttribute('aria-pressed',String(identity.getAttribute('aria-pressed')!=='true')));
document.querySelector('.badge-scene').addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();tx=((e.clientX-r.left)/r.width-.5)*24;ty=((e.clientY-r.top)/r.height-.5)*14;});
document.querySelector('.badge-scene').addEventListener('pointerleave',()=>{tx=0;ty=0;});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)start();else{cancelAnimationFrame(frame);frame=0;}},{threshold:0}).observe(document.querySelector('.hero'));
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else start();});
addEventListener('resize',resize,{passive:true});resize();state();
