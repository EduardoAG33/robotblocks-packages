# SPIKE: motores, sensores y hub · experimental

Paquete declarativo `org.robotblocks.lego-spike`, exclusivo de
`org.robotblocks.lego-spike-prime:board`. Biblioteca en grupo `actuators`; las
categorías internas separan Motores, Sensores y Hub. Sin JavaScript, eval ni
entradas ejecutables en los paquetes. Las plantillas se convierten en Python
para el hub; nunca se ejecutan en el navegador.

API común documentada para Pybricks 3.6.1 y estable 4.0.0 (consulta 2026-10-04).
Las operaciones que devuelven una acción cooperativa declaran `cooperative: true`
y contienen `await` explícito. El motor rechaza esas operaciones dentro de las
funciones síncronas del usuario.

| Categoría   | API y unidades                                                                                                                                                                                        |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Motor       | Motor(port); run(speed) deg/s; await run_angle(speed, rotation_angle) grados; await run_time(speed, time) ms; stop() libre, brake() frenado, hold() mantenimiento; angle(), reset_angle(angle) grados |
| Base motriz | DriveBase(left_motor, right_motor, wheel_diameter, axle_track), dimensiones mm; use_gyro(bool); await straight(distance) mm; await turn(angle) grados; drive(speed, turn_rate) mm/s y deg/s; stop()   |
| Color       | ColorSensor(port); await color() como texto (p. ej. Color.RED); await reflection() y await ambient(), 0–100 %                                                                                         |
| Distancia   | UltrasonicSensor(port); await distance() mm, 2000 cuando no hay distancia válida                                                                                                                      |
| Fuerza      | ForceSensor(port); await force() N; await pressed(), umbral predeterminado de la API 3 N                                                                                                              |
| Hub         | PrimeHub(); imu.heading(), imu.tilt() cabeceo/balanceo, imu.reset_heading(angle); buttons.pressed(); display.number(), display.char(), display.off(); await speaker.beep(frequency, duration) Hz/ms   |

Una sola base motriz activa por programa. Configúrala antes de moverla. Los
motores izquierdo/derecho deben ocupar puertos diferentes. Selecciona sentidos
acordes al montaje (ejemplo: izquierdo antihorario, derecho horario), rueda y eje
medidos en el robot. La opción giroscopio usa `DriveBase.use_gyro`; deja el hub
inmóvil para calibrarlo. Detén la base antes de reiniciar el rumbo del IMU; la API
rechaza ese reinicio mientras el giroscopio controla un movimiento.

Los motores se comparten por puerto, conservando ángulo y sentido. Un puerto no
puede convertirse en sensor si ya fue usado por un motor ni viceversa.
`run_angle`/`run_time` conservan la parada HOLD predeterminada de Pybricks.

`display.text()` es síncrono. Para no bloquear los demás procesos, el runtime
compone la misma cadencia predeterminada con `display.char()`, `display.off()` y
`await wait(500/50)`. Usa los caracteres admitidos por `display.char()` (letras y
símbolos ASCII documentados), no acentos ni emoji en la matriz. La salida de
`print()` sí viaja como UTF-8 al monitor Bluetooth.

Prueba primero con el robot elevado. Los ejemplos, goldens, módulos simulados y
compilación MPY no sustituyen la validación física de conexiones y movimientos.
No se incluyen recursos gráficos de LEGO.

Fuentes oficiales de nombres, firmas y comportamiento:

- [Motor](https://docs.pybricks.com/en/v3.6.1/pupdevices/motor.html).
- [DriveBase y giroscopio](https://docs.pybricks.com/en/v3.6.1/robotics.html).
- [ColorSensor](https://docs.pybricks.com/en/v3.6.1/pupdevices/colorsensor.html).
- [UltrasonicSensor](https://docs.pybricks.com/en/v3.6.1/pupdevices/ultrasonicsensor.html).
- [ForceSensor, force/pressed cooperativos](https://docs.pybricks.com/en/v3.6.1/pupdevices/forcesensor.html).
- [PrimeHub](https://docs.pybricks.com/en/v3.6.1/hubs/primehub.html).
- [wait, multitask y run_task](https://docs.pybricks.com/en/v3.6.1/tools/index.html).
- [Documentación estable actual](https://docs.pybricks.com/en/stable/).
