import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const read = async (path) => JSON.parse(await readFile(path, 'utf8'));
const manifest = await read('packages/i2c/extension.json');
assert.equal(manifest.metadata.experimental, true);
assert.deepEqual(manifest.permissions, []);
assert.equal(manifest.metadata.group, 'communication');
const blocks = await read('packages/i2c/blocks/index.json');
assert.equal(blocks.length, 9);
assert.equal(blocks.filter((block) => block.generators.arduino?.hardware.i2c.mode === 'slave').length, 4);
for (const block of blocks) {
  if (block.generators.arduino?.hardware.i2c.mode === 'slave') assert(!block.generators.micropython);
  for (const template of Object.values(block.generators)) {
    assert.equal(template.canFail, false);
    assert(!JSON.stringify(template).includes('rb_fail('));
  }
}
const ev3 = (await read('packages/lego-ev3-devices/blocks/index.json')).filter((block) => block.id.includes(':i2c-'));
assert.equal(ev3.length, 3);
for (const block of ev3) {
  assert(block.generators.pybricks.imports.includes('from pybricks.iodevices import I2CDevice'));
  assert(!JSON.stringify(block).includes('int.from_bytes'));
  assert.equal(block.fields.find((field) => field.name === 'PORT').reference.capabilities[0], 'ev3SensorPort');
}
for (const sensor of ['color-tcs34725', 'imu-bno055']) {
  const configure = (await read(`packages/${sensor}/blocks/index.json`)).find((block) =>
    block.id.endsWith(':configure'),
  );
  assert(configure.generators.arduino.setup.includes('rb_wire_begin({I2C_BUS});'));
}
console.log('I2C: maestro/esclavo, perfiles, endian manual y guard de sensores aprobados.');
