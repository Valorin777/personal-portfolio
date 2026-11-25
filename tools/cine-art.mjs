// The covers are real local assets. The editorial operating layers are diagrams.
const img=(p,w,h,cls='')=>`<img class="${cls}" src="assets/v5/${p}" width="${w}" height="${h}" decoding="async" alt="">`;
const layer=(name,text='')=>`<div class="cine-art-layer ca-${name}">${text}</div>`;
const squares=(n)=>'<i></i>'.repeat(n);

export const cineArt = {
  okoshko:
    layer('ok-bed','<div class="ca-bed-trim"></div>') +
    layer('ok-grid','<div class="ca-ok-calendar" aria-hidden="true">'+squares(24)+'</div>') +
    layer('ok-brand',`<div class="ca-ok-print">${img('okoshko-og.png',1200,630)}</div>`) +
    layer('ok-choice','<small>СХЕМА ЗАПИСИ</small><b>Выбор времени</b><div class="ca-slots"><i></i><i class="ca-slot-active"></i><i></i></div>') +
    layer('ok-confirm','<i></i><div><small>ПОДТВЕРЖДЕНИЕ</small><b>Запись</b></div>'),
  'hse-coffee':
    layer('hse-bed','<div class="ca-bed-trim"></div><p>HSE<br>COFFEE</p>') +
    layer('hse-paper','<small>СХЕМА · УЧЕБНАЯ ГРУППА</small><b>Расписание</b><div class="ca-hse-days">'+['ПН','ВТ','СР','ЧТ','ПТ'].map(d=>`<span>${d}</span>`).join('')+squares(15)+'</div>') +
    layer('hse-fold','<small>ПОДКЛЮЧЁННЫЕ ВЕДОМОСТИ</small><b>Оценки</b><div><span>Работы</span><i></i></div><div><span>Результат</span><i></i></div>') +
    layer('hse-tab','<i></i> ДЕДЛАЙНЫ'),
  'one-zaabeel':
    layer('zaabeel-image', img('one-zaabeel-link.jpg',1920,1278)) +
    layer('zaabeel-grid','<i></i><i></i><i></i><i></i>') +
    layer('zaabeel-title','<b>One Za’abeel</b><span>The Link / Дубай</span>'),
};
