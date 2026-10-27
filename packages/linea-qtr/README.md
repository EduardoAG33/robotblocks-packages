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

- Arduino GIGA R1 (C++) con 11 canales (A8–A11 incluidos) y dos XIAO ESP32-S3 (C++) leyendo QTR en el robot Rescue Line (2026-10-18).
- MicroPython: generado y ejecutado en simulación; falta probarlo en una tarjeta.
