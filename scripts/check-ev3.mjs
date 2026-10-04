import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const read = async (path) => JSON.parse(await readFile(path, 'utf8'));
const boardPackage = await read('packages/lego-ev3/extension.json');
const devices = await read('packages/lego-ev3-devices/extension.json');
for (const manifest of [boardPackage, devices]) {
  assert.equal(manifest.metadata.experimental, true);
  assert.match(manifest.name, /· experimental/);
  assert.deepEqual(manifest.assets, []);
  assert.deepEqual(manifest.permissions, []);
  assert.deepEqual(manifest.contributes.generators, []);
}
assert.equal(boardPackage.metadata.group, 'boards');
assert.equal(devices.metadata.group, 'actuators');
const board = boardPackage.contributes.boards[0];
assert.deepEqual(board.targets, { pybricks: { upload: 'ev3dev-manual' } });
assert.deepEqual(devices.supportedBoards, [board.id]);
assert.deepEqual(
  board.resources.slice(0, 8).map((r) => [r.label.es, r.symbol.pybricks, r.capabilities]),
  [
    ...[...'ABCD'].map((p) => [p, `Port.${p}`, ['ev3MotorPort']]),
    ...['S1', 'S2', 'S3', 'S4'].map((p) => [p, `Port.${p}`, ['ev3SensorPort']]),
  ],
);
assert.deepEqual(board.resources.find((r) => r.id === 'back').capabilities, []);
const blocks = await read('packages/lego-ev3-devices/blocks/index.json');
// 27 de motores, sensores y ladrillo, más 7 de UART en los puertos de sensor (fase 11).
assert.equal(blocks.length, 34);
for (const block of blocks) {
  assert.deepEqual(Object.keys(block.generators), ['pybricks']);
  const template = block.generators.pybricks;
  assert(!template.expression?.includes('await'));
  if (/\bawait\b/.test(template.statement ?? '')) assert.equal(template.cooperative, true);
  assert(!JSON.stringify(template).includes('pupdevices'));
}
for (const pkg of ['lego-ev3', 'lego-ev3-devices']) {
  const readme = await readFile(`packages/${pkg}/README.md`, 'utf8');
  for (const page of ['hubs', 'parameters']) assert(readme.includes(`https://docs.pybricks.com/en/v2.0/${page}.html`));
  assert.match(readme, /experimental/);
}
const sources = await readFile('packages/lego-ev3-devices/README.md', 'utf8');
for (const page of ['ev3devices', 'robotics', 'tools'])
  assert(sources.includes(`https://docs.pybricks.com/en/v2.0/${page}.html`));
console.log('EV3: puertos separados, 34 plantillas v2.0 y fuentes oficiales aprobados.');
