# Seeed Studio XIAO ESP32-S3

Modelo **base**, no Sense ni Plus. Lógica de **3.3 V, NO tolerante a 5 V**. 8 MB flash y 8 MB PSRAM octal. FQBN confirmado: `esp32:esp32:XIAO_ESP32S3`; mantén USB CDC On Boot habilitado. Recursos de los once contactos laterales y USER_LED, sin pines del conector de cámara Sense. D11/D12, cámara, micrófono, flash y PSRAM no se ofrecen como GPIO seleccionables. Los GPIO19/20 del USB se declaran reservados.

Hay **nueve ADC**, todos ADC1: GPIO1–9, canales 0–8. D6/GPIO43 y D7/GPIO44 no son analógicos; no existen A6/A7. Las etiquetas A0–A5/A8–A10 son alias del mismo contacto D, no pines nuevos. ADC de **12 bits** (0–4095). ADC2 (GPIO11–20 del chip) tiene restricciones con WiFi y no se expone en este paquete: los ADC seleccionables son ADC1. PWM Arduino usa analogWrite de **8 bits** por defecto; MicroPython usa duty_u16. No se llama a analogWriteResolution(bits), pues ESP32 requiere la forma por pin.

USER_LED GPIO21 es **activo en bajo**. Strapping: GPIO0/45/46 internos (BOOT/modo/voltaje SPI), GPIO3 expuesto como D2; evita forzar sus niveles al encender. D4/GPIO5 es SDA, D5/GPIO6 SCL. UART1 se enruta a RX D7/GPIO44 y TX D6/GPIO43 usando `Serial1.begin(baud, SERIAL_8N1, 44, 43)` en C++ y `UART(1, rx=44, tx=43)` en MicroPython; USB conserva la consola.

## MicroPython por USB nativo / Web Serial

El conector USB-C usa USB nativo (USB CDC/Serial-JTAG), **sin CH340**. Firmware oficial: descarga el `.bin` de **ESP32_GENERIC_S3 / spiram-oct** para la PSRAM octal; la familia admite al menos 4 MiB de flash y es compatible con los 8 MB de esta placa. No usar ESP32_GENERIC del ESP32 clásico ni firmware de cámara de terceros. El firmware de fábrica Arduino no es MicroPython. Flashear es un paso externo y manual (dirección 0 indicada por micropython.org), no una acción de GreyForge.

Después de flashear: pulsa RESET, cierra Thonny/Arduino, conecta en Chrome/Edge a 115200 y elige el puerto USB de MicroPython. Si no aparece, usa cable de datos y mantén BOOT mientras pulsas RESET; suelta BOOT para recuperar el puerto de flasheo. BOOT es el cargador ROM, no raw REPL: tras instalar MicroPython vuelve a RESET normal y selecciona su puerto, que puede cambiar. No instalar driver CH340. USB19/20 deben permanecer reservados.

El REPL USB estándar acepta Ctrl-C/Ctrl-A/raw REPL; GreyForge transfiere main.py y robotblocks_runtime.py y reinicia suavemente con Ctrl-D. Compatibilidad verificada por documentación/código y pruebas con puerto simulado; **carga física con este firmware pendiente**, no se afirma que se haya probado una placa conectada.

## Extensiones

Motores, QTR, HC-SR04, UART, TCS34725 y BNO055 usan APIs del core y Wire directo en C++ y generan MicroPython. HC-SR04 necesita adaptar ECHO de 5 V a 3.3 V. Servos genera MicroPython PWM; en C++ emite diagnóstico **requiere librería compatible**: Servo 1.3.0 usa ledcSetup/ledcAttachPin retirados en ESP32 3.x. No se añade ESP32Servo ni drivers nuevos. Las pruebas golden y ejecución simulada no certifican hardware ni compilación real del core.

Ejemplo en la app: `examples/seeed-xiao-esp32s3-parpadeo.blocks.json`, golden main.py y .ino. Copiar/Descargar Arduino incluye runtime en un solo .ino; la carga C++ queda para Fase 8.

## Validación de generación — 2026-10-03

Arduino CLI 1.5.1 y core esp32:esp32 3.3.11: **siete sketches compilados**
(seis extensiones habilitadas y el parpadeo). Servos C++ conserva su diagnóstico
de librería incompatible. Las siete extensiones MicroPython y el LED activo en
bajo pasan sintaxis/ejecución con machine y puerto raw REPL simulados.
No se cargó firmware ni se comprobó USB en hardware físico.
El informe y las salidas están en docs/TARJETAS_R4_XIAO.md del repo de la app.

## Pines

| Serigrafía        | Capacidades                                   | symbol.arduino | Notas                                                                                                                       |
| ----------------- | --------------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------- |
| D0 / A0 · GPIO1   | digitalInput, digitalOutput, pwm, analogInput | 1              | ADC1_CH0. Sin ADC2 en las cabeceras.                                                                                        |
| D1 / A1 · GPIO2   | digitalInput, digitalOutput, pwm, analogInput | 2              | ADC1_CH1. Sin ADC2 en las cabeceras.                                                                                        |
| D2 / A2 · GPIO3   | digitalInput, digitalOutput, pwm, analogInput | 3              | ADC1_CH2. Sin ADC2 en las cabeceras. Strapping GPIO3: no forzar el nivel durante arranque/reset.                            |
| D3 / A3 · GPIO4   | digitalInput, digitalOutput, pwm, analogInput | 4              | ADC1_CH3. Sin ADC2 en las cabeceras.                                                                                        |
| D4 / A4 · GPIO5   | digitalInput, digitalOutput, pwm, analogInput | 5              | ADC1_CH4. Sin ADC2 en las cabeceras. I2C SDA.                                                                               |
| D5 / A5 · GPIO6   | digitalInput, digitalOutput, pwm, analogInput | 6              | ADC1_CH5. Sin ADC2 en las cabeceras. I2C SCL.                                                                               |
| D6 / TX · GPIO43  | digitalInput, digitalOutput, pwm              | 43             | Sin ADC; A6 no existe. UART TX.                                                                                             |
| D7 / RX · GPIO44  | digitalInput, digitalOutput, pwm              | 44             | Sin ADC; A7 no existe. UART RX.                                                                                             |
| D8 / A8 · GPIO7   | digitalInput, digitalOutput, pwm, analogInput | 7              | ADC1_CH6. Sin ADC2 en las cabeceras. SPI SCK.                                                                               |
| D9 / A9 · GPIO8   | digitalInput, digitalOutput, pwm, analogInput | 8              | ADC1_CH7. Sin ADC2 en las cabeceras. SPI MISO.                                                                              |
| D10 / A10 · GPIO9 | digitalInput, digitalOutput, pwm, analogInput | 9              | ADC1_CH8. Sin ADC2 en las cabeceras. SPI MOSI.                                                                              |
| USER_LED · GPIO21 | digitalInput, digitalOutput, pwm              | 21             | LED de usuario activo en bajo: 0 enciende, 1 apaga. No es CHARGE_LED. La expansión Sense comparte GPIO21 con CS de microSD. |
| USB D− · GPIO19   |                                               | 19             | Reservado para USB nativo; no reconfigurar durante Web Serial.                                                              |
| USB D+ · GPIO20   |                                               | 20             | Reservado para USB nativo; no reconfigurar durante Web Serial.                                                              |

## Fuentes oficiales

- [Pinout, memoria, UART, SPI y strapping de XIAO ESP32-S3 (modelo base)](https://wiki.seeedstudio.com/xiao_esp32s3_getting_started/)
- [LED activo en bajo, USB 19/20, ADC1 y PSRAM octal](https://wiki.seeedstudio.com/xiao-esp32s3-freertos/)
- [Uso de pines y USB en XIAO ESP32-S3](https://wiki.seeedstudio.com/xiao_esp32s3_pin_multiplexing/)
- [Firmware oficial ESP32_GENERIC_S3, variante spiram-oct](https://micropython.org/download/ESP32_GENERIC_S3/)
- [MicroPython ESP32: REPL USB y ADC2 con WiFi](https://docs.micropython.org/en/latest/esp32/quickref.html)
- [MicroPython oficial: REPL por USB nativo y recuperación BOOT/RESET](https://docs.micropython.org/en/latest/esp32/tutorial/intro.html)
- [Core ESP32: boards.txt (XIAO_ESP32S3)](https://github.com/espressif/arduino-esp32/blob/master/boards.txt)
- [Migración ESP32 2.x a 3.0: LEDC retirado](https://docs.espressif.com/projects/arduino-esp32/en/latest/migration_guides/2.x_to_3.0.html)
- [Servo 1.3.0: implementación ESP32 con ledcSetup/ledcAttachPin](https://github.com/arduino-libraries/Servo/blob/1.3.0/src/esp32/Servo.cpp)

## Prueba en hardware

- 2026-10-18: dos XIAO de un robot cargadas en C++ desde la app con arduino-cli (COM9 y COM10):
  QTR en GPIO1, TCS34725 en D4/D5 y mensajes por UART1 (D6/D7) que el GIGA recibe. La carga MicroPython en
  una placa física sigue pendiente.
