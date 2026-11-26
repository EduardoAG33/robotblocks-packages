# EV3 con Pybricks 4: motores, sensores y ladrillo · experimental

44 bloques declarativos para la tarjeta `lego-ev3-pybricks4` (firmware Pybricks 4.1 o
posterior, sin microSD). Son los mismos bloques que `lego-ev3-devices`, con las plantillas
adaptadas a Pybricks 4. Son solo plantillas de texto: sin JavaScript, eval, drivers ni código
ejecutado desde paquetes.

Diferencias con la versión de microSD (Pybricks 2.0):

- **Programa asíncrono, como en SPIKE.** Los movimientos que tardan (`run_angle`, `run_time`,
  `straight`, `turn`, `run_until_stalled`, `beep`) usan `await` y ceden a las demás pilas sin
  hilos. Las lecturas de color, reflexión, luz ambiente, ultrasonido e infrarrojo también usan
  `await`, así que no caben en un Mi Bloque que devuelve un valor.
- **Color sin detectar.** Pybricks 4 devuelve `Color.NONE`; el bloque lo convierte en `"None"`,
  igual que en la microSD.
- **Giroscopio.** El ángulo y la velocidad del mismo sensor se pueden leer a la vez.
- **Potencia de EV3-G.** El 100 % es la velocidad máxima que Pybricks asigna a cada motor
  (`control.limits()`), en lugar de leer el tipo de motor en sysfs.
- **UART.** `UARTDevice(puerto, baudios, timeout=100)`, porque Pybricks 4 no admite `timeout=0`.
  Enviar usa `await`; leer sigue sin bloquear con `waiting()` y `read_all()`.
- **I2C.** `I2CDevice(puerto, dirección, custom=True)` y `await` en la lectura y la escritura.
  Registros 1..16 con enteros de 16 bits little-endian, como en la categoría I2C de la microSD.
- **Sin archivos.** Pybricks 4 no tiene sistema de archivos, así que no hay bloques para
  guardar, leer ni borrar archivos.

Fuentes oficiales:

- [Motores, sensores y giroscopio del EV3](https://docs.pybricks.com/en/latest/ev3devices/index.html).
- [DriveBase](https://docs.pybricks.com/en/latest/robotics.html).
- [Multitarea y esperas](https://docs.pybricks.com/en/latest/tools/index.html).
- [I2CDevice y UARTDevice](https://docs.pybricks.com/en/latest/iodevices/index.html).

Falta probar todos los bloques en un EV3 real con Pybricks 4.1, en especial la potencia, I2C con
el Arduino y UART.
