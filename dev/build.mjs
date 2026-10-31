// Builds src/shared.liquid from dev/shared.src.liquid and dev/nachtklok.js: minified script, no comments.
// Usage: node dev/build.mjs   (fetches terser through npx on first run, like Daydial)
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = new URL('.', import.meta.url).pathname;
const out = join(mkdtempSync(join(tmpdir(), 'nachtklok-')), 'nachtklok.min.js');
execFileSync('npx', ['-y', 'terser@5.36.0', join(dir, 'nachtklok.js'), '-c', 'passes=2', '-m', '--format', 'ascii_only=true', '-o', out], { stdio: 'inherit' });
const js = readFileSync(out, 'utf8').trim();
if (/\{\{|\{%|endraw/.test(js)) throw new Error('minified script contains Liquid delimiters');
let liquid = readFileSync(join(dir, 'shared.src.liquid'), 'utf8')
  .replace(/\{%-? comment -?%\}[\s\S]*?\{%-? endcomment -?%\}\n?/g, '')   // Liquid comments
  .replace(/\/\*[\s\S]*?\*\//g, (m) => (m === '/*SCRIPT*/' ? m : ''))       // CSS comments
  .replace(/^\s+/gm, '').replace(/\n{2,}/g, '\n');                          // indentation and blank lines
liquid = liquid.replace('/*SCRIPT*/', () => js);
writeFileSync(join(dir, '../src/shared.liquid'), liquid);
console.log(`src/shared.liquid: ${Buffer.byteLength(liquid)} bytes (script ${Buffer.byteLength(js)})`);
