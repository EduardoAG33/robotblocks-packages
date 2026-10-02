import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const catalog = JSON.parse(await readFile('catalog.json', 'utf8'));
assert.equal(catalog.schemaVersion, 1);
assert.equal(new Set(catalog.packages.map((item) => item.path)).size, catalog.packages.length);
const safePath = (path) => typeof path === 'string' && !path.includes('\\') && !path.includes(':') && path.split('/').every((part) => part && part !== '.' && part !== '..');
for (const item of catalog.packages) {
  assert(safePath(item.path)); assert(['board', 'module'].includes(item.kind));
  const root = `${item.path}/`; const manifest = JSON.parse(await readFile(root + 'extension.json', 'utf8'));
  assert.equal(manifest.schemaVersion, 1); assert.match(manifest.id, /^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)+$/);
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/); assert.deepEqual(manifest.permissions, []);
  if (item.kind === 'board') assert(manifest.contributes.boards.length > 0);
  const ids = new Set();
  const ownedId = (id) => { assert(id.startsWith(`${manifest.id}:`)); assert(!ids.has(id)); ids.add(id); };
  for (const group of ['categories', 'devices', 'boards', 'generators', 'monitors']) for (const contribution of manifest.contributes[group]) ownedId(contribution.id);
  for (const board of manifest.contributes.boards) {
    assert.equal(new Set(board.resources.map((pin) => pin.id)).size, board.resources.length);
    for (const pin of board.resources) assert(pin.capabilities.every((capability) => board.capabilities.includes(capability)));
  }
  const paths = [...new Set([...manifest.contributes.blocks, ...manifest.assets.map((asset) => asset.path), ...manifest.contributes.generators.map((generator) => generator.entry)])];
  let bytes = 0;
  for (const path of paths) { assert(safePath(path)); bytes += (await readFile(root + path)).length; }
  assert(bytes < 2 * 1024 * 1024);
  for (const path of manifest.contributes.blocks) for (const block of JSON.parse(await readFile(root + path, 'utf8'))) {
    ownedId(block.id); assert(block.operation.startsWith(`${manifest.id}:`));
    const names = [...block.fields, ...block.inputs].map((input) => input.name);
    assert.equal(new Set(names).size, names.length);
    assert.deepEqual([...block.label.matchAll(/%([A-Z][A-Z0-9_]*)/g)].map((match) => match[1]).sort(), names.sort());
  }
}
console.log(`${catalog.packages.length} paquetes: integridad del catálogo aprobada.`);
