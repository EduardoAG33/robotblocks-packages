import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const load = async (slug) => JSON.parse(await readFile(`packages/${slug}/extension.json`, 'utf8'));
const r4 = await load('arduino-uno-r4-minima'),
  xiao = await load('seeed-xiao-esp32s3');
for (const pkg of [r4, xiao]) {
  const board = pkg.contributes.boards[0];
  assert.equal(pkg.metadata.group, 'boards');
  // Las dos se probaron en hardware (la XIAO en C++).
  assert.equal(pkg.metadata.experimental, undefined);
  assert.equal(board.experimental, undefined);
  assert(!pkg.name.endsWith('· experimental'));
  const slug = pkg.id.replace('org.robotblocks.', '');
  const readme = await readFile(`packages/${slug}/README.md`, 'utf8');
  assert(
    readme.includes(
      slug === 'arduino-uno-r4-minima'
        ? 'docs.arduino.cc/resources/pinouts/ABX00080'
        : 'wiki.seeedstudio.com/xiao_esp32s3_getting_started/',
    ),
  );
  for (const resource of board.resources) assert(readme.includes(resource.label.es));
}
const a = r4.contributes.boards[0],
  b = xiao.contributes.boards[0];
assert.equal(a.targets.arduino.fqbn, 'arduino:renesas_uno:minima');
assert.equal(a.logicLevel, 5);
assert.equal(a.adcBits, 10);
assert.equal(a.pwm.bits, 8);
assert.equal(a.resources.length, 20);
assert.deepEqual(
  a.resources.filter((r) => r.capabilities.includes('pwm')).map((r) => r.id),
  ['d3', 'd5', 'd6', 'd9', 'd10', 'd11'],
);
assert(a.resources.find((r) => r.id === 'a0').capabilities.includes('analogOutput'));
assert.deepEqual(
  a.uart.map(({ port, symbol, rx, tx }) => [port, symbol, rx, tx]),
  [[1, 'Serial1', 'd0', 'd1']],
);
for (const id of ['d0', 'd1']) assert(a.resources.find((r) => r.id === id).capabilities.includes('digitalOutput'));
assert.equal(b.targets.arduino.fqbn, 'esp32:esp32:XIAO_ESP32S3');
assert.equal(b.targets.micropython.upload, 'webserial-raw-repl');
assert.equal(b.logicLevel, 3.3);
assert.equal(b.adcBits, 12);
assert.equal(b.pwm.bits, 8);
assert.equal(b.resources.length, 14);
const pins = [1, 2, 3, 4, 5, 6, 43, 44, 7, 8, 9];
for (const [n, gpio] of pins.entries()) {
  const r = b.resources.find((r) => r.id === `d${n}`);
  assert.deepEqual(r.symbol, { micropython: String(gpio), arduino: String(gpio) });
  assert.equal(r.capabilities.includes('analogInput'), n !== 6 && n !== 7);
}
assert.equal(b.resources.find((r) => r.id === 'd2').strapping, true);
assert(b.resources.find((r) => r.id === 'led').notes.includes('bajo'));
for (const id of ['usb19', 'usb20']) assert.deepEqual(b.resources.find((r) => r.id === id).capabilities, []);
assert.equal(b.uart[0].pinsInBegin, true);
assert.equal(b.arduinoApis.servo, true);
assert.equal(b.arduinoApis.servoDiagnostic, undefined);
assert.deepEqual(
  b.resources.filter((r) => r.capabilities.includes('pwm')).map((r) => r.id),
  [...Array.from({ length: 11 }, (_, i) => `d${i}`), 'led'],
);
const readme = await readFile('packages/seeed-xiao-esp32s3/README.md', 'utf8');
for (const word of ['spiram-oct', 'ADC2', 'WiFi', 'BOOT', 'sin CH340', 'carga física', 'Sense'])
  assert(readme.includes(word));
console.log('UNO R4 y XIAO: pinouts, UART, USB, firmware y fuentes oficiales aprobados.');
