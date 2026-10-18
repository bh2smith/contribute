import { readFile, writeFile, readdir, unlink, rmdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

// Package this project's single Vite entry point; fail if future assets need handling.
const dist = resolve('dist');
const index = resolve(dist, 'index.html');
let html = await readFile(index, 'utf8');
const inlined = new Set();

async function inline(pattern, wrap) {
  for (const match of html.matchAll(pattern)) {
    const path = resolve(dist, match[1]);
    if (!path.startsWith(`${dist}/assets/`)) throw new Error('Unexpected build asset path.');
    const content = await readFile(path, 'utf8');
    html = html.replace(match[0], () => wrap(content));
    inlined.add(path);
  }
}

await inline(
  /<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/g,
  (js) => `<script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>`,
);
await inline(
  /<link\b(?=[^>]*\brel="stylesheet")[^>]*\bhref="([^"]+)"[^>]*>/g,
  (css) => `<style>${css.replace(/<\/style/gi, '\\3c /style')}</style>`,
);

const files = (await readdir(dist, { recursive: true, withFileTypes: true }))
  .filter((entry) => entry.isFile())
  .map((entry) => resolve(entry.parentPath, entry.name));
if (files.some((path) => path !== index && !inlined.has(path))) {
  throw new Error('Unpackaged assets remain. Inline them before distributing the HTML.');
}
if (/<script\b[^>]*\bsrc=|<link\b[^>]*\brel="(?:stylesheet|modulepreload)"/i.test(html)) {
  throw new Error('External script or stylesheet references remain.');
}
await writeFile(index, html);
for (const path of inlined) await unlink(path);
for (const directory of new Set([...inlined].map(dirname))) await rmdir(directory);
console.log(`Packaged dist/index.html (${Buffer.byteLength(html)} bytes).`);
