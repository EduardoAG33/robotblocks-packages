# OpenMV Cam H7

Cámara programable [OpenMV Cam H7](https://openmv.io/products/openmv-cam-h7) (STM32H743, sensor OV7725) con MicroPython. GreyForge genera `main.py` y lo carga por Web Serial con el raw REPL, el mismo método que usa `mpremote`, la herramienta que la [documentación de OpenMV](https://docs.openmv.io/openmvcam/tutorial/tools/micropython-tools.html) recomienda fuera de OpenMV IDE. Se programa con la extensión **Visión OpenMV**.

Programmable [OpenMV Cam H7](https://openmv.io/products/openmv-cam-h7) camera (STM32H743, OV7725 sensor) with MicroPython. GreyForge generates `main.py` and uploads it over Web Serial with the raw REPL, the same method used by `mpremote`, the tool the [OpenMV documentation](https://docs.openmv.io/openmvcam/tutorial/tools/micropython-tools.html) recommends outside OpenMV IDE. Program it with the **OpenMV Vision** extension.

## Antes de cargar / Before uploading

1. Cierra OpenMV IDE: los dos no pueden usar el puerto USB a la vez.
2. Usa un firmware reciente de OpenMV (4.x). El programa generado usa `asyncio`; si la cámara dice `ImportError: no module named 'asyncio'`, actualiza el firmware desde OpenMV IDE (Herramientas → Instalar el último firmware).
3. Conecta por USB y en GreyForge elige la tarjeta **OpenMV Cam H7**, luego «Conectar» y «Cargar».

- Close OpenMV IDE: both cannot use the USB port at the same time.
- Use a recent OpenMV firmware (4.x). The generated program uses `asyncio`; if the camera says `ImportError: no module named 'asyncio'`, update the firmware from OpenMV IDE (Tools → Install the latest release firmware).
- Connect over USB and in GreyForge choose the **OpenMV Cam H7** board, then “Connect” and “Upload”.

## Pines / Pins

| Pin    | Uso                      | Nota                    |
| ------ | ------------------------ | ----------------------- |
| P0–P3  | SPI2                     |                         |
| **P4** | **UART 3 TX** · I2C2 SCL | Al **RX** del GIGA (D0) |
| **P5** | **UART 3 RX** · I2C2 SDA | Al **TX** del GIGA (D1) |
| P6     | ADC · DAC                |                         |
| P7–P9  | PWM · servos             |                         |

Une también **GND con GND**. Las dos tarjetas son de 3.3 V: se conectan directo.

Also connect **GND to GND**. Both boards are 3.3 V: they connect directly.

En esta versión los pines no aparecen en los bloques de pines: en la OpenMV se nombran con texto (`Pin("P0")`) y eso necesita un cambio en la app. La UART 3 y los LEDs se usan desde la extensión Visión OpenMV.

In this version the pins do not show in the pin blocks: on the OpenMV they are named with text (`Pin("P0")`) and that needs a change in the app. UART 3 and the LEDs are used from the OpenMV Vision extension.

Experimental: falta probar la carga con la cámara real. / Experimental: uploading still needs testing with the real camera.
