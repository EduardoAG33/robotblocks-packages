# Seguidor de línea (QTR analógico)

Extensión para Arduino/C++ y MicroPython. Probada en hardware con Arduino/C++ (ver «Pruebas en hardware»). Las plantillas MicroPython están probadas en simulación, todavía no en una tarjeta. Funciona con tabletas Pololu **QTR/QTRX analógicas** (versión «A»), por ejemplo la **QTRX-MD-13A**.

## Bloques

| Bloque                                             | Uso                                                                                                                                                            |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **agregar canal del sensor de línea en pin [pin]** | En «al iniciar», uno por canal y en orden de izquierda a derecha. El primero es el canal 1.                                                                    |
| **calibrar sensor de línea**                       | Una lectura de calibración. Ponlo en un «repetir 100 veces» con una espera corta mientras el robot gira sobre la línea.                                        |
| **posición de la línea [negra/blanca]**            | De -100 (bajo el canal 1) a 100 (bajo el último); 0 es el centro. Ideal como error de un PID. Si se pierde la línea, devuelve -100 o 100 según el último lado. |
| **canal (n) del sensor de línea [negra/blanca]**   | De 0 (fondo) a 100 (línea), calibrado.                                                                                                                         |
| **¿línea [negra/blanca] detectada?**               | Verdadero si algún canal supera el 50 %.                                                                                                                       |

Sin calibración usa el rango completo del ADC: 0–4095 en MicroPython ESP32; en Arduino depende de adcBits.

## Guardar y recuperar la calibración · 1.2.0 / Save and restore calibration

Los bloques nuevos de 1.2.0 están verificados en simulación MicroPython; falta compilar y probar la restauración de calibración en hardware. Las pruebas físicas anteriores corresponden a los bloques que ya existían. / The new 1.2.0 blocks have been checked in MicroPython simulation; compilation and physical calibration-restoration tests are pending. Earlier physical tests cover the existing blocks.

- **calibración [mínima/máxima] del canal [N]** lee el mínimo o máximo crudo guardado en RAM para ese canal, sin hacer otra lectura del sensor.
- **usar calibración del canal [N] mínimo [A] máximo [B]** restaura esos valores después de agregar los canales. N empieza en 1 y debe ser entero dentro del número de canales configurados. A y B son cuentas crudas del ADC: 0 ≤ A ≤ B ≤ máximo del ADC. Arduino y MicroPython rechazan canales fuera de rango con un mensaje fijo.

La extensión no depende de Memoria. Para persistir con esa extensión, recorre los canales y guarda el mínimo como `qtr_min_1`, `qtr_min_2`… y el máximo como `qtr_max_1`, `qtr_max_2`…; hazlo una sola vez al terminar de calibrar. Al arrancar, si existen, recupéralos con «usar calibración». Recalibra cuando cambien la pista, la altura del sensor o la iluminación. No borres la memoria en cada arranque. Ejemplos generados en la app: `memoria-qtr-giga` y `memoria-qtr-uno`.

**English:** “minimum/maximum calibration of channel N” reports the raw ADC extrema already in RAM. “Use calibration of channel N minimum A maximum B” restores them after channels have been added. N is a 1-based integer within the configured channel count; 0 ≤ A ≤ B ≤ ADC maximum. Both Arduino and MicroPython validate channels. No dependency on Memory is required. To persist with Memory, loop through channels and save `qtr_min_1`… and `qtr_max_1`… once after calibration; restore those values on startup. Recalibrate if the track, sensor height or lighting changes. Existing blocks and saved projects remain compatible.

## Conexiones (QTRX-MD-13A)

- VCC → 3.3 V, GND → GND. Funciona de 2.9 a 5.5 V.
- Cada salida (1–13) → un pin **analógico** de la placa. No hace falta usar los 13: con 5 a 8 canales repartidos suele bastar.
- CTRL ODD / CTRL EVEN: déjalos sin conectar y los emisores quedan encendidos.
- Mejor distancia al piso: unos 10 mm.

**ESP32:** los pines ADC2 no funcionan con WiFi activo. Las versiones RC (digitales) de la tableta no son compatibles con esta extensión.

## Arduino/C++

Plantillas declarativas, sin código ejecutable en el paquete. Se mantienen las plantillas MicroPython. Copiar código y Descargar archivo dan un único `.ino` con el runtime integrado. Compila con arduino-cli y está probada en hardware (ver «Pruebas en hardware»).

Lee cada canal con analogRead, sin biblioteca QTR. Cada canal guarda su propia función lectora, así también sirven A8–A11 de la GIGA (`PureAnalogPin`, que no se convierten a número). Rango sin calibración: 0…`(2 ** adcBits) − 1` (1023 en las cinco tarjetas actuales). GIGA/Teensy emiten analogReadResolution(adcBits) al iniciar; AVR conserva su ADC fijo de 10 bits. Hasta 16 canales, cada uno elegido entre los recursos ADC oficiales; puedes usar un subconjunto de las 13 salidas QTRX-MD-13A.

Conserva posición −100…100, inversión blanca/negra, calibración mínimo/máximo por canal, umbral de contraste de 50 cuentas ADC, detección >50 % y último lado cuando se pierde la línea. No admite sensores RC. Alimenta las salidas analógicas a tensión compatible con la tarjeta.

Fuente: [Pololu QTRX-MD-13A](https://www.pololu.com/product/4453).

## Pruebas en hardware

- Arduino GIGA R1 (C++) con 11 canales (A8–A11 incluidos) y dos XIAO ESP32-S3 (C++) leyendo QTR en un robot (2026-10-18).
- MicroPython: generado y ejecutado en simulación; falta probarlo en una tarjeta.
