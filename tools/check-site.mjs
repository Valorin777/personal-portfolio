import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
const root=resolve('dist');
const walk=d=>readdirSync(d).flatMap(n=>{const p=resolve(d,n);return statSync(p).isDirectory()?walk(p):[p]});
const files=walk(root).filter(p=>p.endsWith('.html'));
const errors=[];
const contact=JSON.parse(readFileSync('contact-data.json','utf8'));
if(contact.telegramUrl!==`https://t.me/${contact.telegramUsername}`)errors.push('Contact source: Telegram URL and username differ');
if(Object.keys(contact).some(key=>/phone|telephone/i.test(key)))errors.push('Contact source: phone fields must not be published');
for(const file of files){
 const html=readFileSync(file,'utf8');
 const page=relative(root,file);
 const hrefs=[...html.matchAll(/\bhref="([^"]+)"/g)].map(match=>match[1]);
 const redirect=/<meta\b[^>]*http-equiv="refresh"/i.test(html);
 if(!redirect&&!hrefs.includes(contact.telegramUrl))errors.push(`${page}: missing Telegram contact from contact-data.json`);
 if(hrefs.some(href=>/^https:\/\/(?:www\.)?t\.me\//i.test(href)&&href!==contact.telegramUrl))errors.push(`${page}: Telegram link differs from contact-data.json`);
 if(/tel:|(?:\+7|8)[\s().-]*\d{3}[\s().-]*\d{3}[\s().-]*\d{2}[\s().-]*\d{2}/i.test(html))errors.push(`${page}: phone number or tel link must not be published`);
 if(/\bsrc="(?:[^"?#]*\/)?(?:sculpture|scroll-motion)\.js(?:[?#][^"]*)?"/i.test(html))errors.push(`${page}: obsolete pre-v5 motion script reference`);
 if(/[\p{Emoji_Presentation}\uFE0F\u2190-\u21ff\u27f0-\u27ff\u2900-\u297f\u{1f800}-\u{1f8ff}]/u.test(html))errors.push(`${relative(root,file)}: emoji or arrow glyph found`); const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 if(new Set(ids).size!==ids.length)errors.push(`${relative(root,file)}: duplicate IDs`);
 if((html.match(/<h1\b/g)||[]).length!==1)errors.push(`${relative(root,file)}: must have one h1`);
 for(const m of html.matchAll(/\b(?:src|href|poster)="([^"]+)"/g)){
  const u=m[1];if(/^(?:https?:|mailto:|tel:|data:)/.test(u))continue;
  const [pathPart,hash]=u.split('#');const target=pathPart?resolve(dirname(file),decodeURIComponent(pathPart.split('?')[0])):file;
  if(!target.startsWith(root)||!existsSync(target)){errors.push(`${relative(root,file)}: missing ${u}`);continue;}
  if(hash&&target.endsWith('.html')&&!new RegExp(`id=["']${hash}["']`).test(readFileSync(target,'utf8')))errors.push(`${relative(root,file)}: missing fragment ${u}`);
 }
}
const data=JSON.parse(readFileSync('project-data.json','utf8'));const catalog=readFileSync(resolve(root,'work.html'),'utf8');
const cards=[...catalog.matchAll(/<article\b[^>]*class="catalog-card(?: reveal)?"[^>]*data-category="([^"]+)"/g)];
if(cards.length!==data.length)errors.push(`Expected ${data.length} project cards; found ${cards.length}`);
if(files.length!==data.length+5)errors.push(`Expected ${data.length+5} HTML pages; found ${files.length}`);
for(const project of data)if(!existsSync(resolve(root,`projects/${project.slug}.html`)))errors.push(`Missing case ${project.slug}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(`Checked ${files.length} pages: local links, assets, fragments, headings, IDs, source contact links and motion scripts; ${data.length} catalog entries.`);

