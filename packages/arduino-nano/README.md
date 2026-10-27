# Arduino Nano (ATmega328P)

Lógica de 5 V. ADC 10 bits y PWM 8 bits. LED integrado D13. D0/D1 reservados a serie USB.

Destino C++/Arduino: `arduino:avr:nano`. No instala cores ni carga firmware.
Usa **Copiar código** o **Descargar archivo** en la vista Código: obtienes un único `.ino`
con `robotblocks_runtime.h` integrado, listo para Arduino IDE. Probada en hardware (ver al final).

Las capacidades corresponden a pines del pinout oficial y funciones accesibles por el core.
Un alias analógico comparte el pin físico: no se duplica como recurso digital.
Alimentación, GND, RESET, USB y señales dedicadas no se ofrecen como GPIO.

D0/D1 se reservan a RX/TX del puente USB-UART (no son USB nativo).
A4 = SDA y A5 = SCL del bus I2C; los conectores SDA/SCL duplican esos pines en UNO.
LED D13: alto enciende; también SCK de SPI. ADC: 0–1023; PWM: 0–255.
PWM: ~490 Hz salvo D5/D6 (~980 Hz); `defaultFrequency` describe el valor habitual, no todos los pines.

A6/A7 son **solo analógicos**, sin capacidades digitales ni pull-up.
Para clones con bootloader viejo, selecciona **ATmega328P (Old Bootloader)** en Arduino IDE,
o usa `arduino:avr:nano:cpu=atmega328old` (opción `cpu=atmega328old`).
El manifiesto conserva el FQBN base, sin fijar el bootloader de todos los Nano.

## Compatibilidad de extensiones

Pines básicos, Motores, QTR, HC-SR04, TCS34725 y BNO055 tienen plantillas Arduino con APIs del core. Servos usa Servo.h (biblioteca oficial Arduino en AVR/GIGA; incluida en Teensyduino). UART usa los puertos independientes oficiales: no disponible en UNO/Nano, donde Serial comparte USB.

En UNO/Nano, Servos junto con PWM D9/D10 produce diagnóstico por Timer1. GIGA selecciona la implementación mbed de Servo, aunque la biblioteca puede advertir por arquitectura. Todas las tarjetas siguen experimentales, pendientes de compilación del core y prueba física.

## Fuentes oficiales

- [Pinout oficial Arduino (páginas 1–3)](https://docs.arduino.cc/resources/pinouts/A000005-full-pinout.pdf).
- [Datasheet oficial Arduino](https://docs.arduino.cc/resources/datasheets/A000005-datasheet.pdf).

## Serigrafía → capacidades

| Serigrafía | Símbolo Arduino | Capacidades                              | Notas                                                                   |
| ---------- | --------------- | ---------------------------------------- | ----------------------------------------------------------------------- |
| D0         | `0`             | ninguna (reservado)                      | Reservado para serie USB (RX/TX del puente USB-UART). No seleccionable. |
| D1         | `1`             | ninguna (reservado)                      | Reservado para serie USB (RX/TX del puente USB-UART). No seleccionable. |
| D2         | `2`             | digitalInput, digitalOutput              |                                                                         |
| D3         | `3`             | digitalInput, digitalOutput, pwm         |                                                                         |
| D4         | `4`             | digitalInput, digitalOutput              |                                                                         |
| D5         | `5`             | digitalInput, digitalOutput, pwm         |                                                                         |
| D6         | `6`             | digitalInput, digitalOutput, pwm         |                                                                         |
| D7         | `7`             | digitalInput, digitalOutput              |                                                                         |
| D8         | `8`             | digitalInput, digitalOutput              |                                                                         |
| D9         | `9`             | digitalInput, digitalOutput, pwm         |                                                                         |
| D10        | `10`            | digitalInput, digitalOutput, pwm         |                                                                         |
| D11        | `11`            | digitalInput, digitalOutput, pwm         |                                                                         |
| D12        | `12`            | digitalInput, digitalOutput              |                                                                         |
| D13        | `13`            | digitalInput, digitalOutput              | LED integrado; alto enciende, bajo apaga. Compartido con SPI SCK.       |
| A0         | `A0`            | digitalInput, digitalOutput, analogInput |                                                                         |
| A1         | `A1`            | digitalInput, digitalOutput, analogInput |                                                                         |
| A2         | `A2`            | digitalInput, digitalOutput, analogInput |                                                                         |
| A3         | `A3`            | digitalInput, digitalOutput, analogInput |                                                                         |
| A4         | `A4`            | digitalInput, digitalOutput, analogInput | I2C SDA; compartido con el bus Wire.                                    |
| A5         | `A5`            | digitalInput, digitalOutput, analogInput | I2C SCL; compartido con el bus Wire.                                    |
| A6         | `A6`            | analogInput                              | Solo analógico; sin entrada/salida digital ni pull-up.                  |
| A7         | `A7`            | analogInput                              | Solo analógico; sin entrada/salida digital ni pull-up.                  |

## UART e I2C para C++

Solo se admiten estos pares de pines predeterminados del core. No se remapean pines alternativos.

| Puerto | RX  | TX  | Uso                               |
| ------ | --- | --- | --------------------------------- |
| Serial | d0  | d1  | Reservado USB; UART no disponible |

| Bus  | SDA | SCL |
| ---- | --- | --- |
| Wire | a4  | a5  |

Servo usa `Servo.h`; en AVR comparte Timer1 y deshabilita PWM en D9/D10 mientras está activo.

Fuentes adicionales: [Servo oficial y Timer1](https://github.com/arduino-libraries/Servo/blob/master/src/avr/ServoTimers.h). El pinout oficial citado arriba identifica RX/TX y SDA/SCL.

## Prueba en hardware

- 2026-10-17: el equipo cargó un programa de RobotBlocks y funcionó en la placa.
