import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const pages=['dist/index.html','dist/about.html','dist/credits.html','dist/work.html',...readdirSync('dist/projects').map(p=>'dist/projects/'+p)];
const phone=/(?:tel:|(?:\+7|8)[\s().-]*\d{3}[\s().-]*\d{3}[\s().-]*\d{2}[\s().-]*\d{2})/i;
const forbidden=['Довести<br><em>поведение','Конкретный контекст','Веб-сцена с собственным характером','Характер и структура','Свет, пространство, ритм'];
for(const p of pages){const html=read(p);assert(!phone.test(html),`${p}: phone found`);for(const phrase of forbidden)assert(!html.includes(phrase),`${p}: vague phrase`);}
const contact=JSON.parse(read('contact-data.json'));assert.deepEqual(Object.keys(contact).sort(),['telegramUrl','telegramUsername']);
assert.equal(contact.telegramUrl,'https://t.me/valorinin');
for(const p of ['dist/index.html','dist/about.html']){assert(read(p).includes(contact.telegramUrl));assert(read(p).includes('НИУ ВШЭ'));assert(read(p).includes('Лекторий'));}
assert(!read('tools/generate-shell.mjs').includes('contact.phone'));
assert(!read('tools/check-site.mjs').includes('missing phone contact'));
assert(phone.test('<a href="tel:+70000000000">test</a>'));
assert(phone.test('<meta name="telephone" content="+7 (000) 000-00-00">'));
console.log(`Copy/privacy checks passed for ${pages.length} pages; phone detection covers links and metadata.`);

for(const p of pages)assert(!/faithoverfear|Faith over Fear/i.test(read(p)),`${p}: withdrawn project resurfaced`);
