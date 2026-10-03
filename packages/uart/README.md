# UART: OpenMV y otras placas

Extensión **experimental** para MicroPython, probada en simulación y pendiente de prueba física. Comunica la placa con una **cámara OpenMV** (u otra placa) mediante **líneas de texto con datos separados por comas**.

## Bloques

| Bloque | Uso |
| --- | --- |
| **configurar UART [1/2] RX [pin] TX [pin] a (19200) baudios** | En «al iniciar». En el ESP32, UART 0 queda para el USB; usa 1 o 2. |
| **¿llegó una línea por UART [n]?** | Verdadero una vez por cada línea nueva. No espera. |
| **última línea de UART [n]** | El texto completo, por ejemplo «160,2400,2». |
| **dato (i) de la última línea de UART [n]** | El número en la posición *i*. Para «160,2400,2», el dato 1 es 160 y el dato 3 es 2. |
| **enviar por UART [n] (texto)** | Envía el texto y un salto de línea. |

## Conexiones

- RX de la placa → TX de la OpenMV (P4). TX de la placa → RX de la OpenMV (P5).
- **GND común.** Ambas trabajan a 3.3 V.

## Ejemplo para la OpenMV H7 Plus

Este programa corre en la cámara (OpenMV IDE) y envía «x,área,color» de la mancha más grande:

```python
import sensor, time
from pyb import UART

uart = UART(3, 19200)
sensor.reset()
sensor.set_pixformat(sensor.RGB565)
sensor.set_framesize(sensor.QVGA)
sensor.skip_frames(time=2000)
colores = [(30, 100, 15, 127, 15, 127), (30, 100, -64, -8, -32, 32)]  # rojo, verde (LAB)

while True:
    img = sensor.snapshot()
    manchas = img.find_blobs(colores, pixels_threshold=200, merge=True)
    if manchas:
        m = max(manchas, key=lambda b: b.pixels())
        uart.write("%d,%d,%d\n" % (m.cx(), m.pixels(), m.code()))
    else:
        uart.write("0,0,0\n")
    time.sleep_ms(20)
```

En RobotBlocks: «si ¿llegó una línea por UART 2?» → «fijar x a dato 1 de la última línea de UART 2».
