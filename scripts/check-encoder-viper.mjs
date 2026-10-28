// Desde el catálogo dentro de la app con npm ci ya ejecutado.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const appRequire = createRequire(new URL('../../package.json', import.meta.url));
const { compile } = await import(pathToFileURL(appRequire.resolve('@pybricks/mpy-cross-v6')).href);
const blocks = JSON.parse(await readFile(new URL('../packages/encoder/blocks/index.json', import.meta.url), 'utf8'));
const generator = blocks[0].generators.micropython;
// El cargador WASM antiguo usa fs cuando fetch no existe; Node no lee file: con fetch.
const savedFetch = globalThis.fetch;
let result;
try {
  globalThis.fetch = undefined;
  result = await compile('encoder.py', generator.imports.join('\n') + '\n' + generator.globals[0], [
    '-march=xtensawin',
  ]);
} finally {
  globalThis.fetch = savedFetch;
}
assert.equal(result.status, 0, result.err.join('\n'));
console.log(`Encoder: Viper ESP32 xtensawin compilado (${result.mpy.length} bytes).`);
