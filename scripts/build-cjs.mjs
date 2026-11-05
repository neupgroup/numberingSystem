import { mkdir, readFile, writeFile } from 'node:fs/promises';

// Converts the compiled ESM entry into a CommonJS entry for require consumers.
const source = await readFile(new URL('../dist/esm/index.js', import.meta.url), 'utf8');
const commonJs = source
  .replace(/^export type NumberingSystem =[^;]+;\n/m, '')
  .replace(/^export function /gm, 'function ')
  .replace(/\/\*\*[\s\S]*?\*\/\n/g, '')
  .concat('\nmodule.exports = { formatNumber, formatIndianReadable, formatNepaliReadable, formatIndianReadable2, formatNepaliReadable2, formatIndianReadableDevanagari, formatNepaliReadableDevanagari };\n');

await mkdir(new URL('../dist/cjs/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/cjs/index.cjs', import.meta.url), commonJs);
