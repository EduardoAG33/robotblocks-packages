# EV3 · HuskyLens (adaptador OFDL) · experimental

HuskyLens 1 conectada a un puerto de sensor del EV3 con el adaptador de OFDL
(<https://github.com/ofdl-robotics-tw/EV3-HuskyLens-Stuff>), en la microSD
**EV3 MicroPython / Pybricks 2.0**. Solo para la tarjeta `lego-ev3`.

| Bloque                   | Qué hace                                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------- |
| HuskyLens actualizar     | Lee de una vez el objeto que ve la cámara. Los demás bloques usan esta lectura.                   |
| ¿HuskyLens ve el ID n?   | Verdadero si el objeto leído tiene ese ID.                                                        |
| ¿HuskyLens ve un objeto? | Verdadero si el estado es 1.                                                                      |
| X / Y del objeto         | Centro del recuadro en píxeles, desde la esquina o con el centro en 0 (X −160..160, Y −120..120). |
| ancho / alto del objeto  | Tamaño del recuadro en píxeles.                                                                   |
| ID del objeto            | ID aprendido del objeto visto.                                                                    |
| estado                   | 1 objeto, 7 sin detección, 8 sin objetos aprendidos, 9 adaptador sin cámara, 0 sin datos.         |

Sin objeto a la vista, X, Y, ancho, alto e ID valen 0.

## Cómo funciona

El adaptador habla el protocolo UART de LEGO, así que ev3dev lo detecta solo
como `ev3-uart-84`. El bloque lo abre con
[`Ev3devSensor`](https://docs.pybricks.com/en/v2.0/iodevices.html), pone el modo
`Data-EV3HSK` y lee `bin_data` de sysfs: una sola lectura de 32 bytes con ocho
enteros s32, así X, Y e ID salen del mismo fotograma (y tarda unos 5 ms, contra
unos 49 ms de leer ocho valores por separado).

**Orden medido en el robot, distinto del README del adaptador:**
X, Y, ancho, alto, ID, estado, 0, 0. Con estado distinto de 1 los demás valores
se ignoran. Medido por Los Grises en el robot WRO Futuros Ingenieros (S3).

## Límites

- El adaptador entrega un solo objeto por lectura, no la lista completa.
- No cambia el algoritmo ni escribe en la pantalla de la HuskyLens: eso se hace en
  la propia cámara.
- Sin probar todavía con estos bloques en el robot: el código se basa en el
  programa ev3dev2 del equipo, que sí está medido.
