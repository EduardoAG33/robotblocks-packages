import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const catalog = JSON.parse(await readFile('catalog.json', 'utf8'));
assert.equal(catalog.schemaVersion, 1);
assert.equal(new Set(catalog.packages.map((item) => item.path)).size, catalog.packages.length);
const safePath = (path) =>
  typeof path === 'string' &&
  !path.includes('\\') &&
  !path.includes(':') &&
  path.split('/').every((part) => part && part !== '.' && part !== '..');
for (const item of catalog.packages) {
  assert(safePath(item.path));
  assert(['board', 'module'].includes(item.kind));
  const root = `${item.path}/`;
  const manifest = JSON.parse(await readFile(root + 'extension.json', 'utf8'));
  assert.equal(manifest.schemaVersion, 2);
  assert.match(manifest.id, /^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)+$/);
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  assert.deepEqual(manifest.permissions, []);
  if (item.kind === 'board') assert(manifest.contributes.boards.length > 0);
  const ids = new Set();
  const ownedId = (id) => {
    assert(id.startsWith(`${manifest.id}:`));
    assert(!ids.has(id));
    ids.add(id);
  };
  for (const group of ['categories', 'devices', 'boards', 'generators', 'monitors'])
    for (const contribution of manifest.contributes[group]) ownedId(contribution.id);
  for (const board of manifest.contributes.boards) {
    assert.equal(new Set(board.resources.map((pin) => pin.id)).size, board.resources.length);
    for (const pin of board.resources)
      assert(pin.capabilities.every((capability) => board.capabilities.includes(capability)));
    assert(!board.capabilities.includes('digitalGPIO'));
    if (board.experimental !== undefined) assert.equal(board.experimental, true);
    if (board.targets?.arduino) assert.match(board.targets.arduino.fqbn, /^[\w-]+:[\w-]+:[\w-]+(?::[\w=,.-]+)?$/);
    if (board.logicLevel !== undefined) assert(board.logicLevel > 0 && board.logicLevel <= 24);
    if (board.adcBits !== undefined)
      assert(Number.isInteger(board.adcBits) && board.adcBits > 0 && board.adcBits <= 32);
    for (const resource of board.resources)
      for (const symbol of Object.values(resource.symbol ?? {}))
        assert.match(symbol, /^(?:[0-9]+|[a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*)$/);
  }
  for (const device of manifest.contributes.devices) {
    assert(Array.isArray(device.pins));
    assert.equal(new Set(device.pins.map((pin) => pin.name)).size, device.pins.length);
    for (const pin of device.pins) {
      assert.match(pin.name, /^[a-zA-Z][a-zA-Z0-9_.-]*$/);
      assert(pin.label && pin.capabilities.length && !pin.capabilities.includes('digitalGPIO'));
    }
  }
  const paths = [
    ...new Set([
      ...manifest.contributes.blocks,
      ...manifest.assets.map((asset) => asset.path),
      ...manifest.contributes.generators.map((generator) => generator.entry),
    ]),
  ];
  let bytes = 0;
  for (const path of paths) {
    assert(safePath(path));
    bytes += (await readFile(root + path)).length;
  }
  assert(bytes < 2 * 1024 * 1024);
  for (const path of manifest.contributes.blocks)
    for (const block of JSON.parse(await readFile(root + path, 'utf8'))) {
      ownedId(block.id);
      assert(block.operation.startsWith(`${manifest.id}:`));
      const names = [...block.fields, ...block.inputs, ...(block.variadic ? [block.variadic.input] : [])].map(
        (input) => input.name,
      );
      assert.equal(new Set(names).size, names.length);
      assert.deepEqual(Object.keys(block.label).sort(), ['en', 'es']);
      assert.deepEqual(Object.keys(block.tooltip).sort(), ['en', 'es']);
      for (const label of Object.values(block.label))
        assert.deepEqual([...label.matchAll(/%([A-Z][A-Z0-9_]*)/g)].map((match) => match[1]).sort(), [...names].sort());
      for (const input of block.inputs) {
        if (input.min !== undefined || input.max !== undefined || input.integer !== undefined)
          assert.equal(input.type, 'number');
        if (input.min !== undefined) assert(Number.isFinite(input.min));
        if (input.max !== undefined) assert(Number.isFinite(input.max));
        if (input.integer !== undefined) assert.equal(typeof input.integer, 'boolean');
        const min = input.min ?? -Infinity,
          max = input.max ?? Infinity;
        assert(min <= max && (!input.integer || Math.ceil(min) <= Math.floor(max)));
        if (typeof input.default === 'number')
          assert(input.default >= min && input.default <= max && (!input.integer || Number.isInteger(input.default)));
      }
    }
}
console.log(`${catalog.packages.length} paquetes: integridad del catálogo aprobada.`);
await import('./check-arduino-boards.mjs');
await import('./check-arduino-extensions.mjs');
await import('./check-r4-xiao.mjs');
await import('./check-spike.mjs');
await import('./check-ev3.mjs');
await import('./check-i2c.mjs');
