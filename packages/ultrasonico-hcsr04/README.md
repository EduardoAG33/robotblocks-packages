# Ultrasónico HC-SR04

Extensión **experimental** para MicroPython, probada en simulación y pendiente de prueba física.

## Bloque

**distancia ultrasónica en cm TRIG [pin] ECHO [pin]**: de 2 a 400 cm. Devuelve **400** si no hay eco (nada cerca o sensor desconectado), así que un control que se aleja de las paredes no se confunde con 0. Cada lectura tarda como máximo 30 ms.

## Conexiones

- VCC → 5 V, GND → GND común.
- TRIG → cualquier pin de salida.
- **ECHO entrega 5 V.** En placas de 3.3 V (ESP32, Arduino GIGA) usa un divisor de voltaje (por ejemplo, 1 kΩ y 2 kΩ) o el modelo **HC-SR04P**, que trabaja a 3.3 V.
- Si usas varios sensores, no los dispares al mismo tiempo: lee uno y luego el otro para evitar ecos cruzados.
