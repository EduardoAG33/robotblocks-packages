# EV3 / Pybricks 4 (sin microSD) · experimental

Paquete de tarjeta para el EV3 con el **firmware Pybricks 4.1 o posterior**. El firmware se
instala una vez desde [code.pybricks.com](https://code.pybricks.com/) (menú de herramientas →
Instalar el firmware de Pybricks → EV3) y reemplaza el de LEGO hasta que se restaure desde el mismo
menú. GreyForge no instala ni cambia firmware. No se incluyen imágenes, logotipos ni archivos de
terceros.

| Recurso                       | Capacidad                                       | Símbolo Pybricks 4                                               |
| ----------------------------- | ----------------------------------------------- | ---------------------------------------------------------------- |
| A, B, C, D                    | ev3MotorPort                                    | Port.A, Port.B, Port.C, Port.D                                   |
| S1, S2, S3, S4                | ev3SensorPort                                   | Port.S1, Port.S2, Port.S3, Port.S4                               |
| LEFT, RIGHT, UP, DOWN, CENTER | hubButtons                                      | Button.LEFT, Button.RIGHT, Button.UP, Button.DOWN, Button.CENTER |
| Atrás                         | Reservado al sistema; sin capacidades de bloque | Detiene el programa                                              |
| Pantalla                      | hubDisplay                                      | rb_hub.screen                                                    |
| Altavoz                       | hubSpeaker                                      | rb_hub.speaker                                                   |
| Luz de estado                 | hubLight                                        | rb_hub.light                                                     |

Destino `pybricks`, perfil de carga `webserial-pybricks`. El EV3 aparece como puerto serie USB
(VID 0x0694, PID 0x0005), sin driver en Windows. **Cargar** compila el programa a MPY v6 en la
app y lo envía con el protocolo de Pybricks, igual que con el SPIKE por Bluetooth. Necesita
Chrome, Edge o la app de escritorio. Instala también `lego-ev3-pybricks4-devices` para sus
bloques.

Es una tarjeta distinta de `lego-ev3` (microSD con Pybricks 2.0): un proyecto no pasa de una a
otra sin rehacer los bloques de EV3.

Fuentes oficiales:

- [Instalar Pybricks](https://pybricks.com/learn/getting-started/install-pybricks/).
- [EV3Brick, botones, pantalla, altavoz y luz](https://docs.pybricks.com/en/latest/hubs/ev3brick.html).
- [Port y Button](https://docs.pybricks.com/en/latest/parameters/index.html).
- [Notas de versión de Pybricks](https://github.com/pybricks/pybricks-micropython/blob/master/CHANGELOG.md).

Todo es experimental hasta probarlo con un EV3 real con Pybricks 4.1.
