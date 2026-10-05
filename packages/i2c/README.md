# I2C entre tarjetas · experimental

Registros 1..16 con enteros de 16 bits con signo, little-endian. El maestro escribe
`[registro]` y pide dos bytes para leer; escribe `[registro, bajo, alto]` para enviar
un valor. Las direcciones son de 7 bits: dirección 8 = 0x08.

- Arduino UNO, Nano, UNO R4, GIGA, XIAO ESP32-S3 y Teensy: maestro y esclavo.
- ESP32 / MicroPython: solo maestro, con SDA/SCL elegibles. Esclavo importado produce
  «I2C esclavo solo en Arduino» y no se ofrece en la paleta.
- EV3 / Pybricks 2.0: maestro en la categoría EV3 · I2C de `lego-ev3-devices`.

El esclavo separa publicados y recibidos. Los callbacks solo copian bytes de tablas
volatile; no miden sensores ni imprimen. El proceso prepara los bytes fuera de la
interrupción y protege las operaciones de 16 bits. El flag nuevo se consume al
consultarlo. Registros inválidos devuelven 0; mensajes incompletos y bytes extra
no alteran registros adicionales. Los valores se redondean (empates fuera de cero)
y recortan a −32768..32767.

Sin ACK o con OSError, leer conserva el último valor bueno del registro y el estado
de respuesta queda falso. Arduino usa una caché fija de 64 pares dirección/registro
sin expulsión: si se llena, rechaza pares nuevos conservando los anteriores. Las
plantillas declaran `hardware.i2c.mode`; sin campos de pines ocupan los SDA/SCL del
bus principal `board.i2c`. El editor comparte `rb_wire_begin` con TCS34725/BNO055
y rechaza maestro/sensores junto a esclavo en ese mismo bus.

Caso del equipo: Nano dirección 8, HC-SR04 en TRIG/ECHO 11/12, 9/10, 7/8, 5/6, 3/4,
con pausa de 10 ms entre sensores y registros 1..5; EV3 consulta S1 cada 100 ms.
Nano A4 → EV3 pin 6 SDA; A5 → pin 5 SCL; GND común. **No conectar el pin 4 de
4.3 V del EV3 al Nano.** Las resistencias pull-up se confirmarán en prueba física.

Protocolo y ejemplos completos: `docs/COMUNICACION.md` en el repositorio de la app.
Las plantillas experimentales se verifican con dobles y compilación; prueba física pendiente.

Referencias: [Pybricks 2.0 I2CDevice](https://docs.pybricks.com/en/v2.0/iodevices.html#i2c-device),
[Wire](https://docs.arduino.cc/language-reference/en/functions/communication/wire/),
[ESP32 MicroPython](https://docs.micropython.org/en/latest/esp32/quickref.html#i2c-bus).
