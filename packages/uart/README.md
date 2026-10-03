# UART: OpenMV y otras placas

En UNO R4 Minima `Serial1` usa D0 RX/D1 TX sin compartir USB. En XIAO ESP32-S3
UART1 se enruta a D7/GPIO44 RX y D6/GPIO43 TX; la plantilla declarativa usa
`UART_PIN_ARGS` según `uart.pinsInBegin` de la tarjeta. Las demás tarjetas conservan
`SerialN.begin(baud)` con sus pines fijos oficiales. Ningún paquete ejecuta JavaScript.

Extensión **experimental** para MicroPython y Arduino/C++, probada en simulación y pendiente de prueba física. Comunica la placa con una **cámara OpenMV** (u otra placa) mediante **líneas de texto con datos separados por comas**.

## Bloques

| Bloque                                                        | Uso                                                                                 |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **configurar UART [1/2] RX [pin] TX [pin] a (19200) baudios** | En «al iniciar». En el ESP32, UART 0 queda para el USB; usa 1 o 2.                  |
| **¿llegó una línea por UART [n]?**                            | Verdadero una vez por cada línea nueva. No espera.                                  |
| **última línea de UART [n]**                                  | El texto completo, por ejemplo «160,2400,2».                                        |
| **dato (i) de la última línea de UART [n]**                   | El número en la posición _i_. Para «160,2400,2», el dato 1 es 160 y el dato 3 es 2. |
| **enviar por UART [n] (texto)**                               | Envía el texto y un salto de línea.                                                 |

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

## Arduino/C++

Plantillas declarativas experimentales, sin código ejecutable en el paquete. Se mantienen las plantillas MicroPython. Copiar código y Descargar archivo dan un único `.ino` con el runtime integrado. Generación verificada; compilación del core y prueba física pendientes.

Usa Serial1…Serial8 según los puertos del paquete de tarjeta, solo con el par RX/TX oficial predeterminado. GIGA: Serial1 RX0/TX1, Serial2 RX19/TX18, Serial3 RX17/TX16, Serial4 RX15/TX14. Teensy 4.0 tiene Serial1…7; Teensy 4.1 agrega Serial8 RX34/TX35. UNO/Nano no tienen UART independiente de la consola USB: diagnóstico explícito, sin código Arduino para estos bloques. No se añade SoftwareSerial ni remapeo de pines.

Lectura sin timeout ni readStringUntil: última línea UTF-8 válida completa, strip de espacios, flag consumido al preguntar, separación por comas, dato inválido = 0 y envío con LF. Cola incompleta limitada a los últimos 512 bytes después de drenar lo disponible, como MicroPython. Se asigna estado únicamente para los puertos usados. Las opciones nuevas 3…8 conservan la compatibilidad de los proyectos guardados con 1/2; MicroPython mantiene su comprobación del puerto en el firmware.

Fuentes: [PJRC UART](https://www.pjrc.com/teensy/td_uart.html), [pinout y puertos GIGA](https://github.com/arduino/ArduinoCore-mbed/blob/main/variants/GIGA/pins_arduino.h); pinouts oficiales citados por cada paquete de tarjeta.
