# EV3 · AbsoluteIMU de mindsensors · experimental

Giroscopio del mindsensors AbsoluteIMU (ACG) en un puerto de sensor del EV3 con la
microSD **EV3 MicroPython / Pybricks 2.0**. Solo para la tarjeta `lego-ev3`.

| Bloque                           | Qué hace                                                                       |
| -------------------------------- | ------------------------------------------------------------------------------ |
| IMU calibrar giro con N muestras | Promedia el cero del eje Z con el robot quieto y pone el ángulo en 0.          |
| IMU ángulo Z                     | Ángulo acumulado en grados. No se reinicia en 360: sirve para contar esquinas. |
| IMU reiniciar ángulo Z a         | Cambia el ángulo sin volver a calibrar.                                        |
| IMU velocidad de giro Z          | Grados por segundo, ya sin el cero calibrado.                                  |

## Cómo funciona

- Usa el driver `ms-absolute-imu` de ev3dev en modo `GYRO`, leído con
  [`Ev3devSensor`](https://docs.pybricks.com/en/v2.0/iodevices.html) (su
  `sensor_index` da la carpeta de sysfs). El eje Z es `value2`; con
  `decimals = 1` el entero viene multiplicado por diez, así que la escala es 0.1
  grados/s por unidad.
- Si ev3dev no detectó el sensor, el bloque pone el puerto en `nxt-i2c` y escribe
  `ms-absolute-imu 0x11` en `set_device` (la dirección 0x22 de 8 bits es 0x11 de
  7 bits). El EV3 solo detecta solo los sensores I2C NXT en 0x01.
- Un hilo propio integra la velocidad cada 10 ms (regla del trapecio), así el
  ángulo sigue al día aunque el programa esté en una espera o en una maniobra.
  Por debajo de 0.3 grados/s se considera quieto, para que no derive yendo recto.
- La calibración corre como una maniobra: el proceso que la llama espera, los
  demás siguen. 600 muestras tardan unos 2 s.

Valores medidos en el robot de Los Grises (sensor en S2):
escala 0.1 confirmada con una vuelta completa (0.098, 2 %), eje Z vertical y
**girando a la derecha el ángulo sube**. Si el sensor va montado de otra forma,
el signo o el eje pueden cambiar.

## Límites

- Solo el eje Z del giroscopio. La brújula, la inclinación y el acelerómetro
  usan otros modos del driver y no se ofrecen todavía.
- No combines estos bloques con otro sensor en el mismo puerto.
- Sin probar todavía con estos bloques en el robot: el código se basa en el
  programa ev3dev2 del equipo, que sí está medido.
