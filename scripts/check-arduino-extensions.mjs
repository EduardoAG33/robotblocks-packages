import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// UNO/Nano: Serial reservado para USB y un puerto SoftwareSerial (port 1).
const uartCounts = { 'arduino-uno': 2, 'arduino-nano': 2, 'arduino-giga-r1': 4, 'teensy-40': 7, 'teensy-41': 8 };
for (const [slug, count] of Object.entries(uartCounts)) {
  const manifest = JSON.parse(await readFile(`packages/${slug}/extension.json`, 'utf8'));
  const board = manifest.contributes.boards[0];
  assert.equal(board.uart.length, count);
  assert.equal(board.arduinoApis.servo, true);
  assert.equal(new Set(board.uart.map((p) => p.port)).size, count);
  for (const port of board.uart) {
    assert(board.resources.some((r) => r.id === port.rx));
    assert(board.resources.some((r) => r.id === port.tx));
    if (port.software) {
      assert.equal(port.symbol, 'SoftwareSerial');
      assert(slug === 'arduino-uno' || slug === 'arduino-nano');
      continue;
    }
    assert.match(port.symbol, /^Serial[1-8]?$/);
    assert.equal(!!port.reserved, slug === 'arduino-uno' || slug === 'arduino-nano');
  }
  for (const bus of board.i2c) for (const pin of [bus.sda, bus.scl]) assert(board.resources.some((r) => r.id === pin));
  if (slug === 'arduino-giga-r1') {
    assert.deepEqual(board.i2c, [
      { symbol: 'Wire', sda: 'd20', scl: 'd21' },
      { symbol: 'Wire1', sda: 'd102', scl: 'd101' },
      { symbol: 'Wire2', sda: 'd9', scl: 'd8' },
    ]);
    assert.deepEqual(
      board.uart.map(({ port, rx, tx }) => [port, rx, tx]),
      [
        [1, 'd0', 'd1'],
        [2, 'd19', 'd18'],
        [3, 'd17', 'd16'],
        [4, 'd15', 'd14'],
      ],
    );
  }
}
for (const slug of [
  'motores',
  'linea-qtr',
  'ultrasonico-hcsr04',
  'servos',
  'uart',
  'color-tcs34725',
  'imu-bno055',
  'imu-mpu6050',
  'laser-vl53l0x',
]) {
  const manifest = JSON.parse(await readFile(`packages/${slug}/extension.json`, 'utf8'));
  for (const path of manifest.contributes.blocks)
    for (const block of JSON.parse(await readFile(`packages/${slug}/${path}`, 'utf8'))) {
      assert(block.generators.micropython);
      assert(block.generators.arduino);
      const source = JSON.stringify(block.generators.arduino);
      assert(!source.includes('Adafruit'));
      assert(!source.includes('eval('));
    }
  assert((await readFile(`packages/${slug}/README.md`, 'utf8')).includes('Arduino/C++'));
}
// Solo Arduino/C++: sin plantilla MicroPython.
for (const slug of ['imu-bno085', 'huskylens']) {
  const manifest = JSON.parse(await readFile(`packages/${slug}/extension.json`, 'utf8'));
  for (const path of manifest.contributes.blocks)
    for (const block of JSON.parse(await readFile(`packages/${slug}/${path}`, 'utf8'))) {
      assert(block.generators.arduino && !block.generators.micropython);
      const source = JSON.stringify(block.generators.arduino);
      assert(!source.includes('Adafruit'));
      assert(!source.includes('eval('));
    }
  assert((await readFile(`packages/${slug}/README.md`, 'utf8')).includes('Arduino/C++'));
}
console.log('Once extensiones Arduino y cinco mapas UART/I2C: aprobados. Sin Adafruit ni código ejecutable.');
