# EV3 · HiTechnic Color V2 · experimental

HiTechnic NXT Color Sensor V2 (NCO1038) en un puerto de sensor del EV3 con la
microSD **EV3 MicroPython / Pybricks 2.0**. Solo para la tarjeta `lego-ev3`.
Es el sensor que se usaba en EV3-G con el bloque de HiTechnic o el
[bloque avanzado de OFDL](https://ofdl.tw/en/ev3-hacking/ht-color-sensor-v2-block-advanced/).

**Experimental: nadie lo ha probado todavía con el sensor real.** El código se
basa en las fuentes de abajo y solo se ha ejecutado en la computadora con un
sensor simulado.

| Bloque                                   | Qué hace                                                                     |
| ---------------------------------------- | ---------------------------------------------------------------------------- |
| HT color S1 configurar en modo …         | Activo, pasivo o crudo. Úsalo al iniciar; vuelve a usarlo para cambiar modo. |
| HT color S1 número de color (0–17)       | El color que calcula el sensor. Solo en modo activo.                         |
| HT color S1 rojo / verde / azul / blanco | 0 a 255 en modo activo; 0 a 65535 en pasivo y crudo.                         |
| ¿HT color S1 ve el color número N?       | Verdadero si el número de color es N. Solo en modo activo.                   |

Leer sin configurar el puerto, pedir el número de color en modo pasivo o crudo,
un sensor que no responde o un sensor de otro fabricante detienen el programa
con un mensaje claro.

## Modos

- **Activo:** el LED blanco ilumina y el sensor resta la luz del cuarto. Da el
  número de color y rojo, verde, azul y blanco de 0 a 255. Es el modo para
  leer colores de la pista.
- **Pasivo:** LED apagado, mide la luz que llega (sirve para medir luz ambiente).
  Valores de 16 bits.
- **Crudo:** lecturas sin procesar del sensor, de 16 bits. En la prueba de
  EV3Lessons el blanco de un ladrillo LEGO da unos 120 en activo y unos 285–450
  en crudo.

## Número de color

El número va de 0 a 17. Ninguna fuente de texto oficial pudimos leer: la tabla
de HiTechnic es una imagen que ya no se descarga. Las fuentes coinciden en
**0 = negro** y **17 = blanco**; para los demás, como referencia (no oficial),
el driver propuesto para ev3dev-lang-python usa: 1 morado, 2 morado azulado,
3 azul verdoso, 4 verde, 5 verde amarillo, 6 amarillo, 7 naranja, 8 rojo,
9 rojo rosado, 10 rosa, 11–16 tonos claros. **Mide los colores de tu pista** con
el ejemplo antes de usar el número en un programa: cambia con la distancia y el
ángulo. Para un color que da dos números, une dos bloques «¿ve el color
número?» con «o».

## Cómo funciona

El bloque abre el sensor con
[`I2CDevice`](https://docs.pybricks.com/en/v2.0/iodevices.html) de
`pybricks.iodevices`, que pide la dirección de **7 bits**. En Pybricks 2.0 el
constructor pone el puerto en modo `other-i2c` (así ev3dev quita su driver
`ht-nxt-color-v2`) y usa el bus `/dev/i2c-3` a `/dev/i2c-6` según el puerto;
`read` y `write` usan las funciones de bloque de SMBus (32 bytes como máximo).

Al configurar: lee el fabricante, escribe el modo, espera 0.1 s y descarta una
lectura (OFDL avisa que, tras un programa interrumpido, el sensor puede repetir
el último valor). Cada bloque de lectura hace una lectura I2C y la reintenta
hasta tres veces antes de dar el error.

## Registros usados y su fuente

| Dato                               | Valor                                                                   | Fuente                   |
| ---------------------------------- | ----------------------------------------------------------------------- | ------------------------ |
| Dirección I2C                      | 0x02 de 8 bits = **0x01 de 7 bits**                                     | [1] 0x01, [2] y [3] 0x02 |
| Dirección de 7 bits en Pybricks    | «I2C addresses are 7-bit values»                                        | [5]                      |
| Fabricante (0x08..0x0F)            | `HiTechnc` (producto `ColorPD`)                                         | [1]                      |
| Registro de modo                   | **0x41**                                                                | [1] [2] [4]              |
| Modo activo / pasivo / crudo       | **0x00 / 0x01 / 0x03**                                                  | [1] [2] [3] [4]          |
| 50 Hz / 60 Hz (no se usa)          | 0x35 / 0x36 en 0x41                                                     | [1] [2] [3]              |
| Número de color (activo)           | **0x42**, 1 byte, 0..17                                                 | [1] [2] [4]              |
| Rojo, verde, azul, blanco (activo) | **0x43, 0x44, 0x45, 0x46**, 1 byte cada uno                             | [1] [2] [4]              |
| Índice de color (no se usa)        | 0x47                                                                    | [2]                      |
| Normalizados (no se usan)          | 0x48, 0x49, 0x4A                                                        | [1] [2]                  |
| Pasivo y crudo                     | **0x42..0x49**: rojo, verde, azul, blanco de 16 bits, byte alto primero | [1] [4]                  |
| Pasivo y crudo sin signo           | lecturas de hasta 39317 en pasivo                                       | [6]                      |

Notas sobre las fuentes:

- [1] declara pasivo y crudo como `S16_BE` (16 bits con signo, byte alto
  primero). Se leen **sin signo** porque [6] muestra lecturas de más de 32767
  y [3] las declara `unsigned int`.
- [4] lee 8 bytes desde 0x42 y forma blanco, azul, verde, rojo con el byte bajo
  primero: es el mismo orden de [1] con los bytes al revés, como el bloque RGB
  de [4], que toma el número de color del último byte de 5. Con dos fuentes
  independientes que coinciden, se usa el orden de [1].
- [4] escribe el modo como `[1, 65, modo]`: 65 = 0x41.

Fuentes:

1. Driver `ht-nxt-color-v2` de ev3dev:
   [nxt_i2c_sensor_defs.c](https://github.com/ev3dev/lego-linux-drivers/blob/ev3dev-stretch/sensors/nxt_i2c_sensor_defs.c)
   y [Sensor Data](https://docs.ev3dev.org/projects/lego-linux-drivers/en/ev3dev-stretch/sensor_data.html).
2. Driver RobotC de Xander Soldaat:
   [hitechnic-colour-v2.h](https://github.com/botbench/robotcdriversuite/blob/master/include/hitechnic-colour-v2.h).
3. NXC (BricxCC): [constantes HT Color2](https://bricxcc.sourceforge.net/nbc/nxcdoc/nxcapi/group___h_t_color2_constants.html)
   y [API HiTechnic](https://bricxcc.sourceforge.net/nbc/nxcdoc/nxcapi/group___hi_technic_a_p_i.html).
4. Bloque EV3-G de OFDL:
   [EV3-AdvHTColorV2-Block](https://github.com/a10036gt/EV3-AdvHTColorV2-Block)
   (`VIs/PBR/HTColorSetMode.vix`, `HTColorMeasurePassive.vix`, `HTColorMeasureRaw.vix`,
   `HTColorMeasureRGB.vix`).
5. [Pybricks 2.0 · iodevices](https://docs.pybricks.com/en/v2.0/iodevices.html) y el
   código de [pybricks-micropython v2.0.0](https://github.com/pybricks/pybricks-micropython/tree/v2.0.0)
   (`extmod/modiodevices.c`, `bricks/ev3dev/pbsmbus.c`, `lib/ev3dev/src/ev3dev_stretch/lego_port.c`).
6. EV3Lessons, [HiTechnic Color Sensor V2](https://ev3lessons.com/en/ProgrammingLessons/wro/HiTechnicColor.pdf)
   (tablas de modo pasivo y comparación crudo contra RGB).
7. Nombres de los números de color (no oficiales):
   [ev3dev-lang-python PR #786](https://github.com/ev3dev/ev3dev-lang-python/pull/786/files);
   0 negro y 17 blanco también en el `colorMap` de leJOS EV3 (`HiTechnicColorSensor.java`) y
   en la [comparación de Philohome](https://www.philohome.com/colcomp/cc.htm).

## Ejemplo

`examples/ht-color-ver-colores.blocks.json`: el sensor en S1 en modo activo
muestra en la pantalla el número de color y el rojo, verde y azul, y pita cuando
ve el número 8 o 9. Úsalo para medir los colores de tu pista.

## Límites y lo que falta probar con el sensor real

- Que Pybricks 2.0 lea el sensor por `I2CDevice` en los cuatro puertos (el reloj
  I2C lento de los sensores NXT) y que el fabricante se lea como `HiTechnc`.
- Que el cambio de modo tarde 0.1 s o menos, y el orden de bytes de pasivo y
  crudo.
- La tabla de números de color con los colores de la pista de WRO.
- No cambia la frecuencia de red (50/60 Hz): el sensor viene en 60 Hz, que es la
  de México. Tampoco ofrece el índice de color ni los valores normalizados.
- No combines estos bloques con otro sensor en el mismo puerto.
