import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const board = JSON.parse(await readFile('packages/lego-spike-prime/extension.json', 'utf8'));
const module = JSON.parse(await readFile('packages/lego-spike/extension.json', 'utf8'));
for (const manifest of [board, module]) {
  assert.equal(manifest.metadata.experimental, true);
  assert.match(manifest.name, /· experimental/);
  assert.deepEqual(manifest.assets, []);
  assert.deepEqual(manifest.contributes.generators, []);
}
assert.equal(board.metadata.group, 'boards');
const hub = board.contributes.boards[0];
assert.deepEqual(hub.targets, { pybricks: { upload: 'webbluetooth-pybricks' } });
assert.deepEqual(
  hub.resources.slice(0, 6).map((r) => [r.label, r.symbol.pybricks]),
  [...'ABCDEF'].map((p) => [p, `Port.${p}`]),
);
assert(hub.resources.every((r) => !r.symbol?.micropython && !r.symbol?.arduino));
assert.deepEqual(module.supportedBoards, [hub.id]);
const blocks = JSON.parse(await readFile('packages/lego-spike/blocks/index.json', 'utf8'));
assert.equal(blocks.length, 25);
for (const block of blocks) {
  assert.deepEqual(Object.keys(block.generators), ['pybricks']);
  const template = block.generators.pybricks;
  if (/\bawait\b/.test(template.statement ?? template.expression)) assert.equal(template.cooperative, true);
}
const boardReadme = await readFile('packages/lego-spike-prime/README.md', 'utf8');
assert.match(boardReadme, /code\.pybricks\.com/);
assert.match(boardReadme, /4\.0\.0/);
assert.match(boardReadme, /3\.6\.1/);
assert.match(boardReadme, /technical-info/);
const readme = await readFile('packages/lego-spike/README.md', 'utf8');
for (const source of [
  'pupdevices/motor.html',
  'robotics.html',
  'pupdevices/colorsensor.html',
  'pupdevices/ultrasonicsensor.html',
  'pupdevices/forcesensor.html',
  'hubs/primehub.html',
  'tools/index.html',
])
  assert(readme.includes(`https://docs.pybricks.com/en/v3.6.1/${source}`));
console.log('SPIKE: puertos, plantillas declarativas y fuentes oficiales aprobados.');
