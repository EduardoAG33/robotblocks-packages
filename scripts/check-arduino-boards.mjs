import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const expectations = [
  ['arduino-uno', 'arduino:avr:uno', 5, 20],
  ['arduino-nano', 'arduino:avr:nano', 5, 22],
  ['arduino-giga-r1', 'arduino:mbed_giga:giga', 3.3, 97],
  ['teensy-40', 'teensy:avr:teensy40', 3.3, 40],
  ['teensy-41', 'teensy:avr:teensy41', 3.3, 55],
];
for (const [slug, fqbn, logicLevel, count] of expectations) {
  const root = `packages/${slug}`;
  const manifest = JSON.parse(await readFile(`${root}/extension.json`, 'utf8'));
  const [board] = manifest.contributes.boards;
  assert.equal(manifest.contributes.boards.length, 1);
  assert.equal(manifest.metadata.group, 'boards');
  // UNO y Nano ya se probaron en hardware; GIGA y Teensy siguen experimentales.
  const experimental = !['arduino-uno', 'arduino-nano'].includes(slug);
  assert.equal(manifest.metadata.experimental, experimental || undefined);
  assert.equal(manifest.name.endsWith('· experimental'), experimental);
  assert.equal(board.experimental, experimental || undefined);
  assert.equal(board.logicLevel, logicLevel);
  assert.equal(board.adcBits, 10);
  assert.equal(board.pwm.bits, 8);
  assert.deepEqual(board.targets, { arduino: { upload: 'arduino-cli', fqbn } });
  assert.equal(board.resources.length, count);
  for (const resource of board.resources) assert.deepEqual(Object.keys(resource.symbol), ['arduino']);
  const readme = await readFile(`${root}/README.md`, 'utf8');
  assert(readme.includes(slug.startsWith('teensy') ? 'https://www.pjrc.com/' : 'https://docs.arduino.cc/'));
  if (slug === 'arduino-nano') assert(readme.includes('cpu=atmega328old'));
}
console.log('Cinco manifiestos Arduino: FQBN, símbolos, resoluciones y fuentes aprobados.');
