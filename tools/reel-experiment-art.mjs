const layer=(depth,cls,art)=>`<div class="rx-layer ${cls}" data-flight-layer="${depth}">${art}</div>`;
const portal = `<svg viewBox="0 0 720 390" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet"><path d="M0 315 220 239 500 239 720 315M56 390l214-151m394 151L450 239m-266 151 126-151m226 151L410 239m-50 151V239M0 366h720M0 328h720M66 292h588M151 260h418" stroke="#d49c82" stroke-opacity=".32"/><path d="M180 266V125l180-72 180 72v141l-46 20V145L360 92l-134 53v141z" fill="#33223a" stroke="#9f6977" stroke-width="2"/><path d="M270 265v-97a90 90 0 1 1 180 0v97z" fill="#271a28" stroke="#ffb49a" stroke-width="3"/><path d="M296 262v-88a64 64 0 1 1 128 0v88z" fill="#9f4e62" fill-opacity=".48" stroke="#ffb49a"/><path d="M306 332h108M321 311h78M337 291h46M348 273h24" stroke="#ffcaa0" stroke-width="3"/><circle cx="360" cy="177" r="24" fill="#ffd0ac" fill-opacity=".15" stroke="#ffd0ac"/><path d="M347 178h26m-13-13v26" stroke="#ffd0ac" stroke-width="2"/></svg>`;
const orbitLabels=['Kepler','Ember','Nival'];
const b2DayHeights=[72,63,56,56,41,30,24];
const b2Days=b2DayHeights.map((height,i)=>`<li style="--day:${i};--day-height:${height}%"><i></i><b>${i+1}</b></li>`).join('');
export const experimentArt = {
  'glavny-geroy': {
    caption:'Превратил идею персонального подарка в браузерную 3D-историю, которую зритель проходит сам.',
    role:'Игровой прототип',
    label:'Иллюстрация механики',
    layout:'left',
    art:`${layer('far','rx-hero-haze','<i></i>')}${layer('main','rx-hero-portal',portal)}${layer('near','rx-hero-find','<div><b></b><span>Памятная<br>деталь</span></div>')}`
  },
  orbit: {
    caption:'Сделал атлас трёх вымышленных планет с управляемой камерой и процедурным ландшафтом.',
    role:'3D и шейдеры',
    label:'Визуализация трёх миров',
    layout:'wide',
    art:`${layer('far','rx-orbit-space','<i></i><i></i>')}${layer('main','rx-orbit-kepler','<div class="rx-planet"></div>')}${layer('near','rx-orbit-ember','<div class="rx-planet"></div>')}${layer('detail','rx-orbit-nival','<div class="rx-planet"></div>')}<div class="rx-orbit-labels">${orbitLabels.map((t,i)=>`<span><i>0${i+1}</i>${t}</span>`).join('')}</div>`
  },
  'vlados-quiz': {
    caption:'Связал телевизор, телефоны гостей и пульт ведущего в одну викторину, которую использовали на вечеринке.',
    role:'Разработка викторины',
    label:'Схема экранов',
    layout:'right',
    art:`${layer('far','rx-quiz-light','<div></div>')}${layer('main','rx-quiz-tv','<div><small>ЭКРАН ШОУ</small><strong>Кто знает<br>Владоса?</strong><b></b></div>')}${layer('near','rx-quiz-phone','<div><small>ГОСТЬ</small><i>А</i><i>Б</i><i>В</i></div>')}${layer('detail','rx-quiz-deck','<div><small>ВЕДУЩИЙ</small><i></i><i></i><i></i></div>')}`
  },
  'focus-plus': {
    caption:'Перенёс протокол эксперимента в браузер: он случайно назначает одно из двух ценовых условий.',
    role:'Учебное исследование',
    label:'Схема условий',
    layout:'left',
    art:`${layer('far','rx-focus-delta','<div>Разница цен одинакова</div>')}${layer('main','rx-focus-a','<div><small>УСЛОВИЕ A</small><strong>Оба платные</strong><span>Два платных варианта</span></div>')}${layer('near','rx-focus-b','<div><small>УСЛОВИЕ B</small><strong><em>0 ₽</em></strong><span>Один вариант бесплатный</span></div>')}`
  },
  'b2-sprint': {
    caption:'Собрал семь дней практики уровня B2 между стартовой и финальной проверками.',
    role:'Разработка тренажёра',
    label:'Схема учебного маршрута',
    layout:'right',
    art:`${layer('far','rx-b2-route','<svg viewBox="0 0 700 300" preserveAspectRatio="none" fill="none" aria-hidden="true"><path d="M0 235 C28 227 34 224 50 216 S111 194 150 189 S217 170 250 168 S329 171 350 168 S427 130 450 123 S515 96 550 90 S620 78 650 72 S683 63 700 58" stroke="currentColor" stroke-width="3" stroke-dasharray="3 8" stroke-linecap="round"/></svg>')}${layer('main','rx-b2-days',`<ol>${b2Days}</ol>`)}${layer('near','rx-b2-start','<div><small>ДО ПРАКТИКИ</small><b>Стартовый тест</b></div>')}${layer('detail','rx-b2-end','<div><small>ПОСЛЕ ПРАКТИКИ</small><b>Финальный тест</b></div>')}`
  },
  xcelmini: {
    caption:'Разработал Excel-тренажёр в Telegram и отделил короткие уроки от квеста с 30 самостоятельными заданиями.',
    role:'Интерфейс, API и бот',
    label:'Экран тренажёра и схема квеста',
    layout:'wide',
    art:`${layer('far','rx-xcel-cells','<div></div>')}${layer('main','rx-xcel-screen','<img src="assets/v5/xcelmini-site.jpg" width="788" height="420" alt="" loading="lazy" decoding="async">')}${layer('near','rx-xcel-missions','<div><small>СЮЖЕТНЫЙ КВЕСТ</small><strong>30</strong><span>заданий</span></div>')}`
  }
};
