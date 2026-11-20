/*
 * Dependency-free conservative JavaScript whitespace compressor.
 * This is NOT an optimizing minifier (no mangling, no dead-code elimination).
 * Designed for this project's no-regex-literal source. Use Terser for further optimization.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(resolve(root, 'src/library.js'), 'utf8');
const banner = source.match(/^\/\*![^]*?\*\//)?.[0] || '';

function compress(code) {
    let output = '';
    let i = 0;
    let stringDelimiter = null;
    let escaping = false;
    let pendingSpace = false;
    while (i < code.length) {
        const current = code[i];
        const next = code[i + 1];
        if (stringDelimiter) {
            output += current;
            if (escaping) escaping = false;
            else if (current === '\\') escaping = true;
            else if (current === stringDelimiter) stringDelimiter = null;
            i++;
            continue;
        }
        if (current === '/' && next === '*') {
            const end = code.indexOf('*/', i + 2);
            if (end < 0) throw new Error('Unterminated block comment');
            i = end + 2;
            pendingSpace = true;
            continue;
        }
        if (current === '/' && next === '/') {
            const end = code.indexOf('\n', i + 2);
            i = end < 0 ? code.length : end + 1;
            pendingSpace = true;
            continue;
        }
        if (/\s/.test(current)) {
            pendingSpace = true;
            i++;
            continue;
        }
        const last = output.at(-1) || '';
        const word = /[\w$]/;
        if (pendingSpace && ((word.test(last) && word.test(current)) ||
            ((last === '+' || last === '-') && current === last) ||
            (last === '/' && (current === '*' || current === '/')))) {
            output += ' ';
        }
        pendingSpace = false;
        if (current === '"' || current === "'" || current === '`') stringDelimiter = current;
        output += current;
        i++;
    }
    return output;
}

if (source.includes('`')) {
    throw new Error('El compresor básico no admite template literals; usar Terser.');
}
const compact = `${banner}\n${compress(source)}\n`;
mkdirSync(resolve(root, 'dist'), { recursive: true });
writeFileSync(resolve(root, 'dist/library.js'), source);
writeFileSync(resolve(root, 'dist/library.min.js'), compact);
console.log(`dist/library.min.js: ${Buffer.byteLength(compact)} bytes (${Math.round((1 - Buffer.byteLength(compact) / Buffer.byteLength(source)) * 100)}% menos).`);
