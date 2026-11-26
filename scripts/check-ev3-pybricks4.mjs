import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const read = async (path) => JSON.parse(await readFile(path, 'utf8'));
const boardPackage = await read('packages/lego-ev3-pybricks4/extension.json');
const devices = await read('packages/lego-ev3-pybricks4-devices/extension.json');
for (const manifest of [boardPackage, devices]) {
  assert.equal(manifest.metadata.experimental, true);
  assert.match(manifest.name, /· experimental/);
  assert.deepEqual(manifest.assets, []);
  assert.deepEqual(manifest.permissions, []);
  assert.deepEqual(manifest.contributes.generators, []);
}
const board = boardPackage.contributes.boards[0];
assert.deepEqual(board.targets, { pybricks: { upload: 'webserial-pybricks' } });
assert.deepEqual(board.companionExtensions, [devices.id]);
assert.deepEqual(devices.supportedBoards, [board.id]);
assert.deepEqual(
  board.resources.slice(0, 8).map((r) => [r.label.es, r.symbol.pybricks, r.capabilities]),
  [
    ...[...'ABCD'].map((p) => [p, `Port.${p}`, ['ev3MotorPort']]),
    ...['S1', 'S2', 'S3', 'S4'].map((p) => [p, `Port.${p}`, ['ev3SensorPort']]),
  ],
);
const blocks = await read('packages/lego-ev3-pybricks4-devices/blocks/index.json');
const microsd = await read('packages/lego-ev3-devices/blocks/index.json');
// The same blocks as the microSD package, without the three file blocks.
assert.deepEqual(
  blocks.map((b) => b.id.split(':')[1]),
  microsd.map((b) => b.id.split(':')[1]).filter((slug) => !slug.startsWith('file-')),
);
for (const block of blocks) {
  assert.deepEqual(Object.keys(block.generators), ['pybricks']);
  const template = block.generators.pybricks;
  const code = JSON.stringify(template);
  assert(!/rb_blocking|rb_drive_move|rb_beep|sysfs|_thread|ev3_os|pupdevices/.test(code), block.id);
  if (/\bawait\b/.test((template.statement ?? '') + (template.expression ?? '')))
    assert.equal(template.cooperative, true);
  assert(!/2\.0|microSD/.test(JSON.stringify(block.tooltip ?? '')), block.id);
}
for (const pkg of ['lego-ev3-pybricks4', 'lego-ev3-pybricks4-devices'])
  assert.match(await readFile(`packages/${pkg}/README.md`, 'utf8'), /experimental/);
console.log('EV3 Pybricks 4: 44 plantillas asíncronas, carga por USB y fuentes aprobados.');
