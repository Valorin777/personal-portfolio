import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? 'dist');
const approvedPagesUrls = new Set([
  'https://valorin777.github.io/b2/',
  'https://valorin777.github.io/field-form/',
  'https://valorin777.github.io/focus-plus/study-v7/',
  'https://valorin777.github.io/glavny-geroy-play/#/play/couple',
  'https://valorin777.github.io/one-zaabeel/',
  'https://valorin777.github.io/orbit/',
  'https://valorin777.github.io/rusjet-cinema-concept/',
  'https://valorin777.github.io/sochi/',
  'https://valorin777.github.io/sochi/istochniki/',
  'https://valorin777.github.io/xcelmini/',
]);
const sourceHosts = /(?:^|\.)(?:github\.com|githubusercontent\.com|gitlab\.com|bitbucket\.org|codeberg\.org)$/i;
const excludedPath = /(?:^|\/)\.git(?:[/\w.-]*$)|\.(?:map|zip|tar|tgz|gz|bz2|xz|zst|rar|7z|git|patch|diff|ts|tsx|jsx|mjs|cjs|py|go|rs|rb|php|vue|svelte)$/i;
const codeDownload = /\.(?:js|css|json|md|yml|yaml)(?:$|[?#])/i;
const errors = [];
let checked = 0;

function decodePath(path) {
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}

function decodeEntities(html) {
  const named = { amp: '&', colon: ':', sol: '/', period: '.' };
  return html.replace(/&(?:#(x[\da-f]+|\d+)|(amp|colon|sol|period));/gi, (entity, numeric, name) => {
    if (name) return named[name.toLowerCase()];
    const point = /^x/i.test(numeric) ? parseInt(numeric.slice(1), 16) : Number(numeric);
    return point <= 0x10FFFF ? String.fromCodePoint(point) : entity;
  });
}

function checkExternalUrl(url, page) {
  const host = url.hostname.toLowerCase().replace(/\.$/, '');
  if (sourceHosts.test(host) || (host.endsWith('.github.io') && !approvedPagesUrls.has(url.href))) {
    errors.push(`${page}: repository, profile or unapproved GitHub Pages URL ${url.href}`);
  }
  if (excludedPath.test(decodePath(url.pathname))) {
    errors.push(`${page}: external source file, source map or archive ${url.href}`);
  }
}

function checkText(text, page) {
  const decoded = decodeEntities(text);
  for (const match of decoded.matchAll(/(?:https?:)?\/\/[^\s<>"'`),;]+/gi)) {
    const url = URL.parse(match[0], 'https://valorininfo.online/');
    if (url) checkExternalUrl(url, page);
  }
  // HTML, CSS and JS used to render the site are expected. Do not link to
  // standalone code downloads or publish a source map for those assets.
  for (const match of decoded.matchAll(/<a\b[^>]*?\shref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
    const href = match[1] ?? match[2] ?? match[3];
    const url = URL.parse(href, 'https://valorininfo.online/');
    if (!url || !/^https?:$/.test(url.protocol)) continue;
    const path = decodePath(url.pathname);
    if (excludedPath.test(path) || codeDownload.test(path)) {
      errors.push(`${page}: link to downloadable code or archive ${href}`);
    }
  }
  if (/\bsourceMappingURL\s*=/.test(text)) {
    errors.push(`${page}: source map reference`);
  }
}

function checkDirectory(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    const page = relative(root, file);
    if (excludedPath.test(page)) {
      errors.push(`${page}: source file, source map or archive in published output`);
    } else if (entry.isDirectory()) {
      checkDirectory(file);
    } else if (entry.isFile()) {
      checked++;
      // Font license text retains the upstream copyright notices verbatim.
      if (/\.(?:html|css|js|svg)$/i.test(page)) checkText(readFileSync(file, 'utf8'), page);
    }
  }
}

checkDirectory(root);
if (errors.length) {
  console.error([...new Set(errors)].join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Checked ${checked} published files for repository links, code downloads, source maps and archives.`);
}
