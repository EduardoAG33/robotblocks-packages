# EV3 / microSD Pybricks 2.0 · experimental

Paquete de tarjeta para la imagen **LEGO Education EV3 MicroPython**, basada en
ev3dev y Pybricks 2.0. La app genera un único `main.py` y no instala firmware.
Apagar el ladrillo y quitar la microSD permite volver al firmware LEGO y a EV3-G.
No se incluyen imágenes, logotipos ni archivos de terceros.

| Recurso                       | Capacidad                                       | Símbolo Pybricks 2.0                                             |
| ----------------------------- | ----------------------------------------------- | ---------------------------------------------------------------- |
| A, B, C, D                    | ev3MotorPort                                    | Port.A, Port.B, Port.C, Port.D                                   |
| S1, S2, S3, S4                | ev3SensorPort                                   | Port.S1, Port.S2, Port.S3, Port.S4                               |
| LEFT, RIGHT, UP, DOWN, CENTER | hubButtons                                      | Button.LEFT, Button.RIGHT, Button.UP, Button.DOWN, Button.CENTER |
| Atrás                         | Reservado al sistema; sin capacidades de bloque | No figura en Button v2.0; detiene el programa                    |
| Pantalla                      | hubDisplay                                      | rb_hub.screen                                                    |
| Altavoz                       | hubSpeaker                                      | rb_hub.speaker                                                   |
| Luz de estado                 | hubLight                                        | rb_hub.light                                                     |

Los puertos de sensores y motores son diferentes y **no son GPIO**. Solo se conecta
un dispositivo físico por puerto; los bloques comparten su referencia. No hay IMU
integrada: el giroscopio es un sensor externo en S1–S4. Instala también el paquete
`lego-ev3-devices` para sus bloques de actuadores, sensores y ladrillo.

Destino `pybricks`, perfil de carga `ev3dev-manual`. Descargar y Copiar código
incluyen `#!/usr/bin/env pybricks-micropython` y el runtime. La carga SSH directa
desde escritorio está pendiente de Fase 8. En navegador, Cargar y Conectar están
desactivados. La guía de la app es `docs/EV3_CARGA.md`.

Fuentes oficiales (v2.0):

- [Inicio EV3, microSD, VS Code, cabecera y botón Atrás](https://docs.pybricks.com/en/v2.0/start_ev3.html).
- [Port y Button](https://docs.pybricks.com/en/v2.0/parameters.html).
- [EV3Brick, botones, pantalla, altavoz y luz](https://docs.pybricks.com/en/v2.0/hubs.html).
- [Volver al firmware original](https://pybricks.com/install/mindstorms-ev3/using-the-brick/).

Todo experimental hasta probar la microSD, transferencias y hardware reales.
