# Láser VL53L0X con XSHUT

Extensión **Arduino/C++** para varios VL53L0X en un bus I2C, probada en hardware (ver «Pruebas en hardware»).
Prioridad: robot de laberinto Teensy 4.0/4.1 con 9–10 sensores. También genera
para UNO, Nano, GIGA R1 y UNO R4 Minima con los pares Wire oficiales.
No requiere Adafruit ni bibliotecas externas: el sketch incluye un port del
[driver Pololu](https://github.com/pololu/vl53l0x-arduino). Los sensores usan un
array fijo dimensionado por la cantidad configurada, sin heap por sensor.
MicroPython/Pybricks ocultan los bloques y diagnostican un IR importado.

## Bloques — categoría «Láser», color #B8860B

- **«configurar láseres VL53L0X SDA [pin] SCL [pin] modo [modo]»**: botones +/−,
  de 1 a 12 filas **«XSHUT [pin] dirección [0x30…0x3B] nombre [texto]»**, una por
  renglón. Directamente en «al iniciar», fuera de bucles y funciones. SDA/SCL
  empiezan en el bus I2C principal de la tarjeta (Teensy 4.x: 18/19).
- **«distancia del láser [nombre] en mm»**: reporter.
- **«¿el láser [nombre] tiene lectura?»**: booleano.

Cada fila tiene un **nombre** que dice dónde está el sensor («frontal derecho»,
«lateral izquierdo»…); empieza como «láser 1», «láser 2»… sin repetirse. Los bloques
de lectura eligen el láser por ese nombre en un menú con los láseres configurados, sin
importar en qué bloque o bus esté. Renombrar una fila renombra sus lecturas. «Revisar»
avisa si dos láseres tienen el mismo nombre o si una lectura usa un nombre que ya no
existe. Internamente los láseres se numeran según filas y bloques en orden del programa
(1…24). SDA/SCL seleccionan
Wire/Wire1/Wire2 mediante los pares oficiales. Usa dos bloques para dividir
sensores entre buses; las direcciones pueden repetirse en buses distintos.
En un mismo bus deben ser únicas. XSHUT no se repite, ni comparte SDA/SCL.
Máximo 24 sensores total. Se excluyen 0x29 (arranque) y 0x3C (OLED SSD1306 habitual).

| Modo                    | Presupuesto |
| ----------------------- | ----------- |
| rápido                  | 20 ms       |
| normal (predeterminado) | 33 ms       |
| preciso                 | 200 ms      |

Las medidas continuas de todos los sensores transcurren simultáneamente.
Los reporters consultan el flag listo; solo entonces leen estado y distancia
y borran la interrupción. Si todavía no está listo conservan la última lectura.
**8190 mm** indica primera lectura pendiente, sin eco, fuera de rango, fallo I2C
o timeout. Validez: estado interno RangeComplete (11, equivalente a RangeStatus 0
de la API) y distancia <8190. El booleano no consume el flag de validez.
Si no llega una lectura durante tres presupuestos más 100 ms, vence la caché:
160/199/700 ms según modo. Una lectura nueva recupera el sensor.

## Cableado Teensy 4.x

| Señal            | Teensy 4.0/4.1                                           |
| ---------------- | -------------------------------------------------------- |
| VCC/VIN          | 3.3 V, módulo compatible con esa alimentación            |
| GND              | Tierra común                                             |
| SDA/SCL de Wire  | 18 / 19                                                  |
| SDA/SCL de Wire1 | 17 / 16                                                  |
| SDA/SCL de Wire2 | 25 / 24                                                  |
| XSHUT            | Un pin digital libre y un cable independiente por sensor |

XSHUT suele tener un pull-up a **2.8 V**, incluso en módulos que aceptan otra
tensión en VIN. El sketch lo apaga con OUTPUT LOW y lo libera como **INPUT**,
sin INPUT_PULLUP y sin conducir HIGH: el pull-up del módulo lo lleva a su propia
tensión. Si falta ese pull-up, añádelo a la tensión indicada por el fabricante.

Con 9–10 módulos las pull-ups de SDA/SCL se suman en paralelo. Diez resistencias
de 10 kΩ equivalen aproximadamente a **1 kΩ**. Quita algunas pull-ups según la
documentación de los módulos o reparte sensores entre Wire y Wire1. Mantén cables
cortos y usa **100 kHz** si fallan las lecturas. Esta extensión elige 100 kHz por
defecto; otros bloques del mismo bus pueden cambiar el reloj, revisa el sketch.

**Ningún otro dispositivo puede ocupar 0x29 en ese bus durante el arranque**:
por ejemplo TCS34725 o BNO055 cableado a 0x29 debe estar en otro bus. Cambiar el
orden de bloques no resuelve la colisión eléctrica. La extensión detecta el
TCS34725 compartiendo SDA/SCL; comprueba manualmente los demás dispositivos.
No reutilices tampoco una dirección final con otro dispositivo I2C.

## Secuencia de configuración y fallos

setup pone LOW **todos** los XSHUT declarados antes de ejecutar procesos, incluso
los de otros bloques. Cada configuración mantiene sus XSHUT LOW, espera 10 ms
y por cada fila libera INPUT, espera otros 10 ms, inicializa en 0x29 (SPAD,
tuning y calibración de referencia VHV/fase), escribe la dirección final en 0x8A,
aplica el presupuesto y empieza continuo back-to-back. Comprueba el modelo en
la dirección nueva. Las configuraciones se serializan para evitar dos sensores
activos en 0x29. Coloca todos los bloques en una misma secuencia «al iniciar»
para facilitar el seguimiento de números.

Las esperas XSHUT son cooperativas. La inicialización/calibración sondea con
timeout de 500 ms; puede detener brevemente otros procesos **durante el arranque**.
Las lecturas de distancia no hacen esa calibración ni esperan una medida.

Sensor ausente o fallo I2C/calibración invoca rb_fail. Serial a 115200 baudios
emite: `RB_ERROR <id-bloque> No responde el láser VL53L0X <n> durante la configuración`.
El nombre identifica al láser en cualquier bloque; se aplica el mecanismo de
fallo existente. No se usan lecturas single-shot.

Ejemplo de la aplicación: **examples/teensy-41-laberinto-10-laseres.blocks.json**.
Cinco láseres en Wire (18/19, XSHUT 2…6) y cinco en Wire1 (17/16, XSHUT 7…11). Imprime diez distancias y
espera 100 ms entre conjuntos. Sin OLED ni otro módulo en 0x29.

## Verificación y licencia

Goldens para seis tarjetas y pruebas de generación/restauración en el editor
real. Además de los registros Wire simulados, se probó en el robot (ver «Pruebas en hardware»). No se certifica exactitud óptica ni interferencia entre sensores.

Port de Pololu 1.3.1, fuentes consultadas el 13 de octubre de 2026. Conserva
init, SPAD, tuning, referencia, timing budget, setAddress y startContinuous;
readRangeContinuousMillimeters ahora es no bloqueante y valida estado. Las
transacciones Wire mantienen errores persistentes. Se omiten single-shot y
modificación VCSEL. Aviso MIT de Pololu y aviso BSD de ST conservados en
LICENSE.txt, en globals del sketch y a continuación:

Copyright (c) 2017-2022 Pololu Corporation. For more information, see

https://www.pololu.com/
https://forum.pololu.com/
Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
=================================================================

Most of the functionality of this library is based on the VL53L0X
API provided by ST (STSW-IMG005), and some of the explanatory
comments are quoted or paraphrased from the API source code, API
user manual (UM2039), and the VL53L0X datasheet.

The following applies to source code reproduced or derived from
the API:

---

Copyright © 2016, STMicroelectronics International N.V. All
rights reserved.
Redistribution and use in source and binary forms, with or
without modification, are permitted provided that the following
conditions are met:

- Redistributions of source code must retain the above copyright
  notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above
  copyright notice, this list of conditions and the following
  disclaimer in the documentation and/or other materials provided
  with the distribution.
- Neither the name of STMicroelectronics nor the
  names of its contributors may be used to endorse or promote
  products derived from this software without specific prior
  written permission.
  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
  CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
  INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
  NON-INFRINGEMENT OF INTELLECTUAL PROPERTY RIGHTS ARE DISCLAIMED.
  IN NO EVENT SHALL STMICROELECTRONICS INTERNATIONAL N.V. BE LIABLE
  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT
  OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
  OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
  USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
  DAMAGE.

---

## Pruebas en hardware

- Arduino GIGA R1 (C++), 9 láseres con XSHUT en el robot Rescue Line, de 125 a 890 mm (2026-10-18).
- MicroPython: generado y ejecutado en simulación; falta probarlo en una tarjeta.
