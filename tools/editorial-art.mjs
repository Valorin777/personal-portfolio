// Headline plates use approved repository imagery and original labeled diagrams.

const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset = (src, w, h, featured=false, name='') =>
  `<img ${name ? `class="${name}" ` : ''}src="${esc(src)}" width="${w}" height="${h}" alt="" ${featured ? '' : 'loading="lazy" '}decoding="async">`;
const image = (file, w, h, featured, name) => asset('assets/v5/'+file,w,h,featured,name);
const key = (top, title, foot='') => `<div class="ea-key"><small>${top}</small><b>${title}</b>${foot ? `<span>${foot}</span>` : ''}</div>`;

const wind = featured =>
  `${image('last-wind-field.webp',1672,941,featured,'ea-field')}${image('last-wind-ronin.webp',1024,1536,featured,'ea-ronin')}<span class="ea-cross ea-wind-cross"></span>`;

const slot = featured =>
  `<div class="ea-slot-grid"></div><div class="ea-slot-print">${image('okoshko-og.png',1200,630,featured)}</div>` +
  `<div class="ea-slot-confirm">${key('СХЕМА ЗАПИСИ','Выбор времени','Подтверждение')}<div class="ea-slot-tabs"><i></i><i></i><i></i><i></i></div></div>`;

const timetable = () =>
  `<div class="ea-coffee-spine">HSE<br>COFFEE</div><div class="ea-coffee-plan">${key('УЧЕБНАЯ ГРУППА','Расписание')}
  <div class="ea-coffee-grid">${['ПН','ВТ','СР','ЧТ','ПТ'].map(x=>`<span>${x}</span>`).join('')}${'<i></i>'.repeat(10)}</div></div>
  <div class="ea-coffee-grade">${key('СХЕМА ВЕДОМОСТИ','Оценки','Результат по дисциплине')}</div>`;

// A compact figure is drawn as a figure, rather than shrinking full-size UI prose.
const screen = (x,y,w,h,fill,stroke,angle=0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${fill}" stroke="${stroke}" transform="rotate(${angle} ${x+w/2} ${y+h/2})"/>`;
const lines = (x,y,widths,color) => widths.map((w,i)=>`<path d="M${x} ${y+i*8}h${w}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`).join('');
const solid = (x,y,r,c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
const compactArt = {
  latelier: `${screen(31,23,76,70,'#eed3b4','#ffebd3',-13)}${screen(111,31,77,72,'#f1ab86','#ffd2ba',12)}
    <circle cx="69" cy="58" r="21" fill="#aa5a48" stroke="#fff0c9" stroke-width="5"/><path d="M57 55q10-14 24 8l-14 6z" fill="#f3ce8e"/>
    <circle cx="149" cy="67" r="21" fill="#714154" stroke="#ffe0a8" stroke-width="5"/><path d="M134 69q10-16 30-7l-9 15z" fill="#d49062"/>`,
  'freelance-bot': `<path d="M22 28h43l48 34 54-27h32M21 63h92m-91 34h43l48-34 54 26h32" stroke="#acbef0" stroke-dasharray="3 5" fill="none"/>
    ${screen(22,37,52,51,'#252641','#9fa8dd',-7)}${lines(32,51,[31,21,34,24],'#b1b9ee')}
    ${solid(109,63,22,'#b5a4e1')}<path d="M99 55h20l-7 9v7l-6 3V64Z" fill="#443563"/>
    ${screen(145,37,55,51,'#d4e1f6','#fff',8)}${lines(155,53,[29,22,34],'#596485')}`,
  lektoriy: `${screen(25,20,140,58,'#302746','#9f90c1',-7)}
    <path d="M36 51h10l5-8 4 15 7-21 6 31 6-24 6 12 6-17 7 22 7-13 8 6 8-11 7 9 9-4" stroke="#ddb1e9" stroke-width="3" fill="none" stroke-linejoin="round"/>
    ${screen(107,52,91,52,'#ebd2ad','#fff1cb',8)}${lines(124,66,[45,51,37,47],'#906f78')}`,
  'glavny-geroy': `<path d="M7 112l61-30h82l63 30M46 111l45-29m85 29-42-30M20 100h180" stroke="#e79e8e" stroke-opacity=".45" fill="none"/>
    <path d="M67 89V43l42-23 44 23v46l-15-7V48l-29-16-29 16v34z" fill="#5d384e" stroke="#eea686"/>
    <path d="M89 86V62a20 20 0 0 1 40 0v24Z" fill="#9e5c71" stroke="#f4ba9f"/><path d="m109 57 8 8-8 8-8-8z" fill="#ffd3af"/>`,
  orbit: `<ellipse cx="110" cy="63" rx="83" ry="27" fill="none" stroke="#88cbd1" transform="rotate(-12 110 63)" opacity=".64"/>
    <ellipse cx="110" cy="63" rx="90" ry="17" fill="none" stroke="#88cbd1" transform="rotate(12 110 63)" opacity=".42"/>
    ${solid(110,55,29,'#71b0af')}${solid(46,75,17,'#d99272')}${solid(177,45,13,'#abb9e8')}
    <path d="M88 48q19 4 45-7m-49 17q19 7 53-3m-42 13q16 8 33 1M35 70l21-5m113-22 18-4" stroke="#f5f4f7" stroke-opacity=".38" fill="none"/>`,
  'vlados-quiz': `${screen(33,18,139,79,'#322341','#e4a9db')}${screen(41,26,123,62,'#694675','#9368a2')}
    <text x="103" y="70" text-anchor="middle" fill="#f8d4ed" font-size="35" font-weight="800">?</text><path d="M88 102h31" stroke="#b58cad" stroke-width="4"/>
    ${screen(150,49,36,62,'#2b2140','#e7bce6',12)}${lines(159,67,[13,12,15],'#d88bc7')}
    ${screen(28,86,56,23,'#523450','#be83b0',-9)}${solid(40,98,3,'#e7a9ba')}${solid(51,97,3,'#b995e7')}${solid(63,96,3,'#d18caf')}`,
  'focus-plus': `${screen(32,29,78,66,'#c7988b','#f6d4ad',-8)}${screen(112,31,77,65,'#f7cc86','#ffedc1',8)}
    ${lines(53,56,[37,28,17],'#64474f')}<text x="151" y="73" text-anchor="middle" fill="#653f2b" font-size="27" font-weight="800">0 ₽</text>`,
  'b2-sprint': `<path d="M30 85 C66 88 72 60 106 64S148 42 190 37" stroke="#cbe1ac" stroke-width="2" stroke-dasharray="4 5" fill="none"/>
    ${[[30,85],[57,80],[84,67],[111,64],[137,55],[164,44],[190,37]].map(([x,y],i)=>solid(x,y,i===0||i===6?7:4,i===0||i===6?'#f0d39e':'#c2d0a0')).join('')}
    <text x="39" y="47" fill="#e8ebcc" font-size="23" font-weight="800">B2</text>`
};
const compact = id => `<svg class="ea-compact" viewBox="0 0 220 125" preserveAspectRatio="xMidYMid meet" fill="none">${compactArt[id]}</svg>`;

export function renderEditorialArt(caseData, {featured=false}={}) {
  const {id,title,art,accent} = caseData;
  let markup, kind;
  if(id==='last-wind'){markup=wind(featured);kind='wind';}
  else if(id==='okoshko'){markup=slot(featured);kind='slot';}
  else if(id==='hse-coffee'){markup=timetable();kind='coffee';}
  else if(art){markup=asset(art.src,art.width,art.height,featured,'ea-source');kind=art.fit==='contain'?'contain':'cover';}
  else {
    if(!compactArt[id]) throw new Error('Missing editorial visual: '+id+' / '+title);
    markup=compact(id);
    kind='model';
  }
  return `<div class="editorial-art editorial-art-${kind}${featured?' editorial-art-featured':''}" aria-hidden="true" style="--ea-base:${esc(accent[0])};--ea-light:${esc(accent[1])}">${markup}</div>`;
}
