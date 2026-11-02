import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
const root=resolve('dist');
const walk=d=>readdirSync(d).flatMap(n=>{const p=resolve(d,n);return statSync(p).isDirectory()?walk(p):[p]});
const files=walk(root).filter(p=>p.endsWith('.html'));
const errors=[];
for(const file of files){
 const html=readFileSync(file,'utf8'); const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 if(new Set(ids).size!==ids.length)errors.push(`${relative(root,file)}: duplicate IDs`);
 if((html.match(/<h1\b/g)||[]).length!==1)errors.push(`${relative(root,file)}: must have one h1`);
 for(const m of html.matchAll(/\b(?:src|href)="([^"]+)"/g)){
  const u=m[1];if(/^(?:https?:|mailto:|tel:|data:)/.test(u))continue;
  const [pathPart,hash]=u.split('#');const target=pathPart?resolve(dirname(file),decodeURIComponent(pathPart.split('?')[0])):file;
  if(!target.startsWith(root)||!existsSync(target)){errors.push(`${relative(root,file)}: missing ${u}`);continue;}
  if(hash&&target.endsWith('.html')&&!new RegExp(`id=["']${hash}["']`).test(readFileSync(target,'utf8')))errors.push(`${relative(root,file)}: missing fragment ${u}`);
 }
}
const data=JSON.parse(readFileSync('project-data.json','utf8'));const catalog=readFileSync(resolve(root,'work.html'),'utf8');
const cards=[...catalog.matchAll(/class="catalog-card" data-category="([^"]+)"/g)];
if(cards.length!==9)errors.push(`Expected 9 project cards; found ${cards.length}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(`Checked ${files.length} pages: local links, assets, fragments, headings, IDs; 9 catalog entries.`);
