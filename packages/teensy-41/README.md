# Teensy 4.1

i.MX RT1062. Lógica de 3.3 V; NO tolerante a 5 V. ADC leído a 10 bits (hardware 12 bits), PWM de 8 bits por defecto. LED integrado pin 13.

Destino C++/Arduino: `teensy:avr:teensy41`. No instala cores ni carga firmware.
Usa **Copiar código** o **Descargar archivo** en la vista Código: obtienes un único `.ino`
con `robotblocks_runtime.h` integrado, listo para Arduino IDE. Probada en hardware (ver al final).

Las capacidades corresponden a pines del pinout oficial y funciones accesibles por el core.
Un alias analógico comparte el pin físico: no se duplica como recurso digital.
Alimentación, GND, RESET, USB y señales dedicadas no se ofrecen como GPIO.

USB Serial es nativo: los pines 0/1 son UART Serial1 y siguen disponibles.
LED pin 13 activo en alto; no usar INPUT_PULLUP en ese pin.
ADC por defecto: 10 bits (0–1023), hardware hasta 12 bits; entrada limitada a 0–3.3 V.
PWM por defecto: 8 bits (0–255); FlexPWM ~4482 Hz y QuadTimer ~3611 Hz.
`defaultFrequency` representa FlexPWM; las notas de cada pin indican su frecuencia.
No se cambian resoluciones ni frecuencias al generar.

**24–41 están en el borde**, incluidos 38/A14, 39/A15, 40/A16 y 41/A17.
42–47 pertenecen a microSD/SDIO integrado, y 48–54 a los pads inferiores de PSRAM/flash QSPI.
Se incluyen esos números con notas y sin capacidades seleccionables para evitar conflictos
con memoria/SD. Los pines 49/50/52/53/54 aparecen duplicados en el dibujo de QSPI: son un solo recurso.
El conector Ethernet tiene TX±/RX± y LED, señales dedicadas que no son GPIO Arduino.
No se agregan como pines digitales ni se implementan microSD, Ethernet o memoria.

## Compatibilidad de extensiones

Pines básicos, Motores, QTR, HC-SR04, TCS34725 y BNO055 tienen plantillas Arduino con APIs del core. Servos usa Servo.h (biblioteca oficial Arduino en AVR/GIGA; incluida en Teensyduino). UART usa los puertos independientes oficiales: no disponible en UNO/Nano, donde Serial comparte USB.

En UNO/Nano, Servos junto con PWM D9/D10 produce diagnóstico por Timer1. GIGA selecciona la implementación mbed de Servo, aunque la biblioteca puede advertir por arquitectura.

## Fuentes oficiales

- [Pinout oficial PJRC, anverso](https://www.pjrc.com/teensy/card11a_rev4_web.pdf).
- [Pinout oficial PJRC, reverso](https://www.pjrc.com/teensy/card11b_rev4_web.pdf).
- [Especificaciones y límites oficiales PJRC](https://www.pjrc.com/store/teensy41.html).
- [PWM oficial PJRC (lista por modelo, bits y frecuencias)](https://www.pjrc.com/teensy/td_pulse.html).

## Serigrafía → capacidades

| Serigrafía | Símbolo Arduino | Capacidades                                   | Notas                                                                                                                |
| ---------- | --------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 0          | `0`             | digitalInput, digitalOutput, pwm              | PWM por defecto: 4482 Hz (aprox.).                                                                                   |
| 1          | `1`             | digitalInput, digitalOutput, pwm              | PWM por defecto: 4482 Hz (aprox.).                                                                                   |
| 2          | `2`             | digitalInput, digitalOutput, pwm              | PWM por defecto: 4482 Hz (aprox.).                                                                                   |
| 3          | `3`             | digitalInput, digitalOutput, pwm              | PWM por defecto: 4482 Hz (aprox.).                                                                                   |
| 4          | `4`             | digitalInput, digitalOutput, pwm              | PWM por defecto: 4482 Hz (aprox.).                                                                                   |
| 5          | `5`             | digitalInput, digitalOutput, pwm              | PWM por defecto: 4482 Hz (aprox.).                                                                                   |
| 6          | `6`             | digitalInput, digitalOutput, pwm              | PWM por defecto: 4482 Hz (aprox.).                                                                                   |
| 7          | `7`             | digitalInput, digitalOutput, pwm              | PWM por defecto: 4482 Hz (aprox.).                                                                                   |
| 8          | `8`             | digitalInput, digitalOutput, pwm              | PWM por defecto: 4482 Hz (aprox.).                                                                                   |
| 9          | `9`             | digitalInput, digitalOutput, pwm              | PWM por defecto: 4482 Hz (aprox.).                                                                                   |
| 10         | `10`            | digitalInput, digitalOutput, pwm              | PWM por defecto: 3611 Hz (aprox.).                                                                                   |
| 11         | `11`            | digitalInput, digitalOutput, pwm              | PWM por defecto: 3611 Hz (aprox.).                                                                                   |
| 12         | `12`            | digitalInput, digitalOutput, pwm              | PWM por defecto: 3611 Hz (aprox.).                                                                                   |
| 13         | `13`            | digitalInput, digitalOutput, pwm              | LED integrado; alto enciende, bajo apaga. No usar INPUT_PULLUP; comparte SPI SCK. PWM por defecto: 3611 Hz (aprox.). |
| 14 / A0    | `A0`            | digitalInput, digitalOutput, analogInput, pwm | PWM por defecto: 3611 Hz (aprox.).                                                                                   |
| 15 / A1    | `A1`            | digitalInput, digitalOutput, analogInput, pwm | PWM por defecto: 3611 Hz (aprox.).                                                                                   |
| 16 / A2    | `A2`            | digitalInput, digitalOutput, analogInput      |                                                                                                                      |
| 17 / A3    | `A3`            | digitalInput, digitalOutput, analogInput      |                                                                                                                      |
| 18 / A4    | `A4`            | digitalInput, digitalOutput, analogInput, pwm | I2C Wire: SDA. PWM por defecto: 3611 Hz (aprox.).                                                                    |
| 19 / A5    | `A5`            | digitalInput, digitalOutput, analogInput, pwm | I2C Wire: SCL. PWM por defecto: 3611 Hz (aprox.).                                                                    |
| 20 / A6    | `A6`            | digitalInput, digitalOutput, analogInput      |                                                                                                                      |
| 21 / A7    | `A7`            | digitalInput, digitalOutput, analogInput      |                                                                                                                      |
| 22 / A8    | `A8`            | digitalInput, digitalOutput, analogInput, pwm | PWM por defecto: 4482 Hz (aprox.).                                                                                   |
| 23 / A9    | `A9`            | digitalInput, digitalOutput, analogInput, pwm | PWM por defecto: 4482 Hz (aprox.).                                                                                   |
| 24 / A10   | `A10`           | digitalInput, digitalOutput, analogInput, pwm | PWM por defecto: 4482 Hz (aprox.).                                                                                   |
| 25 / A11   | `A11`           | digitalInput, digitalOutput, analogInput, pwm | PWM por defecto: 4482 Hz (aprox.).                                                                                   |
| 26 / A12   | `A12`           | digitalInput, digitalOutput, analogInput      |                                                                                                                      |
| 27 / A13   | `A13`           | digitalInput, digitalOutput, analogInput      |                                                                                                                      |
| 28         | `28`            | digitalInput, digitalOutput, pwm              | PWM por defecto: 4482 Hz (aprox.).                                                                                   |
| 29         | `29`            | digitalInput, digitalOutput, pwm              | PWM por defecto: 4482 Hz (aprox.).                                                                                   |
| 30         | `30`            | digitalInput, digitalOutput                   |                                                                                                                      |
| 31         | `31`            | digitalInput, digitalOutput                   |                                                                                                                      |
| 32         | `32`            | digitalInput, digitalOutput                   |                                                                                                                      |
| 33         | `33`            | digitalInput, digitalOutput, pwm              | PWM por defecto: 4482 Hz (aprox.).                                                                                   |
| 34         | `34`            | digitalInput, digitalOutput                   |                                                                                                                      |
| 35         | `35`            | digitalInput, digitalOutput                   |                                                                                                                      |
| 36         | `36`            | digitalInput, digitalOutput, pwm              | PWM por defecto: 4482 Hz (aprox.).                                                                                   |
| 37         | `37`            | digitalInput, digitalOutput, pwm              | PWM por defecto: 4482 Hz (aprox.).                                                                                   |
| 38 / A14   | `A14`           | digitalInput, digitalOutput, analogInput      |                                                                                                                      |
| 39 / A15   | `A15`           | digitalInput, digitalOutput, analogInput      |                                                                                                                      |
| 40 / A16   | `A16`           | digitalInput, digitalOutput, analogInput      |                                                                                                                      |
| 41 / A17   | `A17`           | digitalInput, digitalOutput, analogInput      |                                                                                                                      |
| 42         | `42`            | ninguna (reservado)                           | Reservado para microSD / SDIO integrado. Sin selección GPIO para evitar conflictos.                                  |
| 43         | `43`            | ninguna (reservado)                           | Reservado para microSD / SDIO integrado. Sin selección GPIO para evitar conflictos.                                  |
| 44         | `44`            | ninguna (reservado)                           | Reservado para microSD / SDIO integrado. Sin selección GPIO para evitar conflictos.                                  |
| 45         | `45`            | ninguna (reservado)                           | Reservado para microSD / SDIO integrado. Sin selección GPIO para evitar conflictos.                                  |
| 46         | `46`            | ninguna (reservado)                           | Reservado para microSD / SDIO integrado. Sin selección GPIO para evitar conflictos.                                  |
| 47         | `47`            | ninguna (reservado)                           | Reservado para microSD / SDIO integrado. Sin selección GPIO para evitar conflictos.                                  |
| 48         | `48`            | ninguna (reservado)                           | Reservado para pads de PSRAM/flash QSPI; requiere soldar. Sin selección GPIO para evitar conflictos.                 |
| 49         | `49`            | ninguna (reservado)                           | Reservado para pads de PSRAM/flash QSPI; requiere soldar. Sin selección GPIO para evitar conflictos.                 |
| 50         | `50`            | ninguna (reservado)                           | Reservado para pads de PSRAM/flash QSPI; requiere soldar. Sin selección GPIO para evitar conflictos.                 |
| 51         | `51`            | ninguna (reservado)                           | Reservado para pads de PSRAM/flash QSPI; requiere soldar. Sin selección GPIO para evitar conflictos.                 |
| 52         | `52`            | ninguna (reservado)                           | Reservado para pads de PSRAM/flash QSPI; requiere soldar. Sin selección GPIO para evitar conflictos.                 |
| 53         | `53`            | ninguna (reservado)                           | Reservado para pads de PSRAM/flash QSPI; requiere soldar. Sin selección GPIO para evitar conflictos.                 |
| 54         | `54`            | ninguna (reservado)                           | Reservado para pads de PSRAM/flash QSPI; requiere soldar. Sin selección GPIO para evitar conflictos.                 |

## UART e I2C para C++

Solo se admiten estos pares de pines predeterminados del core. No se remapean pines alternativos.

| Puerto  | RX  | TX  | Uso                |
| ------- | --- | --- | ------------------ |
| Serial1 | d0  | d1  | UART independiente |
| Serial2 | d7  | d8  | UART independiente |
| Serial3 | d15 | d14 | UART independiente |
| Serial4 | d16 | d17 | UART independiente |
| Serial5 | d21 | d20 | UART independiente |
| Serial6 | d25 | d24 | UART independiente |
| Serial7 | d28 | d29 | UART independiente |
| Serial8 | d34 | d35 | UART independiente |

| Bus   | SDA | SCL |
| ----- | --- | --- |
| Wire  | d18 | d19 |
| Wire1 | d17 | d16 |
| Wire2 | d25 | d24 |

Servo usa `Servo.h`; Teensyduino incluye su versión para 4.x.

Fuentes adicionales: [PJRC UART](https://www.pjrc.com/teensy/td_uart.html), [PJRC Wire](https://www.pjrc.com/teensy/td_libs_Wire.html), [PJRC Servo: 4.0 y 4.1](https://www.pjrc.com/teensy/td_libs_Servo.html).

## Prueba en hardware

- 2026-10-19: Teensy 4.1 cargada con «Cargar» desde la app (arduino-cli, sin apretar el botón) y leída en el
  Monitor serie (COM13): parpadeo en el LED 13, VL53L0X en Wire (18/19, XSHUT 2), TCS34725 en Wire2
  (25/24, requiere color-tcs34725 1.1.2 a 100 kHz), TCRT5000 analógico en 14/A0 y servo en el pin 9.
