# Seguidor de línea (QTR analógico)

Extensión **experimental** para MicroPython, probada en simulación y pendiente de prueba física. Funciona con tabletas Pololu **QTR/QTRX analógicas** (versión «A»), por ejemplo la **QTRX-MD-13A**.

## Bloques

| Bloque | Uso |
| --- | --- |
| **agregar canal del sensor de línea en pin [pin]** | En «al iniciar», uno por canal y en orden de izquierda a derecha. El primero es el canal 1. |
| **calibrar sensor de línea** | Una lectura de calibración. Ponlo en un «repetir 100 veces» con una espera corta mientras el robot gira sobre la línea. |
| **posición de la línea [negra/blanca]** | De -100 (bajo el canal 1) a 100 (bajo el último); 0 es el centro. Ideal como error de un PID. Si se pierde la línea, devuelve -100 o 100 según el último lado. |
| **canal (n) del sensor de línea [negra/blanca]** | De 0 (fondo) a 100 (línea), calibrado. |
| **¿línea [negra/blanca] detectada?** | Verdadero si algún canal supera el 50 %. |

Sin calibración usa el rango completo del ADC (0–4095).

## Conexiones (QTRX-MD-13A)

- VCC → 3.3 V, GND → GND. Funciona de 2.9 a 5.5 V.
- Cada salida (1–13) → un pin **analógico** de la placa. No hace falta usar los 13: con 5 a 8 canales repartidos suele bastar.
- CTRL ODD / CTRL EVEN: déjalos sin conectar y los emisores quedan encendidos.
- Mejor distancia al piso: unos 10 mm.

**ESP32:** los pines ADC2 no funcionan con WiFi activo. Las versiones RC (digitales) de la tableta no son compatibles con esta extensión.
