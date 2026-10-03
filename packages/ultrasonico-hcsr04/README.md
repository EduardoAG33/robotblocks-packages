# Ultrasónico HC-SR04

Extensión **experimental** para MicroPython y Arduino/C++, probada en simulación y pendiente de prueba física.

## Bloque

**distancia ultrasónica en cm TRIG [pin] ECHO [pin]**: de 2 a 400 cm. Devuelve **400** si no hay eco (nada cerca o sensor desconectado), así que un control que se aleja de las paredes no se confunde con 0. Cada lectura tarda como máximo 30 ms.

## Conexiones

- VCC → 5 V, GND → GND común.
- TRIG → cualquier pin de salida.
- **ECHO entrega 5 V.** En placas de 3.3 V (ESP32, Arduino GIGA) usa un divisor de voltaje (por ejemplo, 1 kΩ y 2 kΩ) o el modelo **HC-SR04P**, que trabaja a 3.3 V.
- Si usas varios sensores, no los dispares al mismo tiempo: lee uno y luego el otro para evitar ecos cruzados.

## Arduino/C++

Plantillas declarativas experimentales, sin código ejecutable en el paquete. Se mantienen las plantillas MicroPython. Copiar código y Descargar archivo dan un único `.ino` con el runtime integrado. Generación verificada; compilación del core y prueba física pendientes.

Pulso TRIG bajo 2 μs / alto 10 μs; pulseIn(ECHO, HIGH, 30000UL). Sin eco devuelve 400 cm; distancia redondeada a 0.1 cm como MicroPython. El tiempo de espera de eco está limitado a 30 ms, más el breve pulso y el coste de GPIO. La medición pausa ese tramo del loop; no llama delay().

ECHO típico de 5 V requiere adaptación para GIGA y Teensy 4.x, que no toleran 5 V.

Fuente de API: [Arduino pulseIn](https://docs.arduino.cc/language-reference/en/functions/advanced-io/pulseIn/).
