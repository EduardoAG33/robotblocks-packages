# Arduino UNO R3 — experimental

Lógica de 5 V. ADC 10 bits y PWM 8 bits. LED integrado D13. D0/D1 reservados a serie USB.

Destino C++/Arduino: `arduino:avr:uno`. No instala cores ni carga firmware.
Usa **Copiar código** en la vista Código, y copia también `robotblocks_runtime.h`
junto al sketch en Arduino IDE. Pendiente de compilación con el core y prueba física.

Las capacidades corresponden a pines del pinout oficial y funciones accesibles por el core.
Un alias analógico comparte el pin físico: no se duplica como recurso digital.
Alimentación, GND, RESET, USB y señales dedicadas no se ofrecen como GPIO.

D0/D1 se reservan a RX/TX del puente USB-UART (no son USB nativo).
A4 = SDA y A5 = SCL del bus I2C; los conectores SDA/SCL duplican esos pines en UNO.
LED D13: alto enciende; también SCK de SPI. ADC: 0–1023; PWM: 0–255.
PWM: ~490 Hz salvo D5/D6 (~980 Hz); `defaultFrequency` describe el valor habitual, no todos los pines.

## Compatibilidad de extensiones

Pines básicos y lógica del núcleo generan C++ experimental. **Motores, Servos, Línea QTR,
HC-SR04, TCS34725, BNO055 y UART solo tienen plantillas MicroPython** en esta versión.
Usarlos en Arduino produce un diagnóstico de plantilla ausente y ningún archivo de salida.
No se ocultan de la biblioteca; no se añaden drivers ni se afirma compatibilidad de Servo
con `mbed_giga`. Esa compatibilidad debe revisarse cuando haya plantilla y compilador.

## Fuentes oficiales

- [Pinout oficial Arduino (páginas 1–3)](https://docs.arduino.cc/resources/pinouts/A000066-full-pinout.pdf).
- [Datasheet oficial Arduino](https://docs.arduino.cc/resources/datasheets/A000066-datasheet.pdf).

## Serigrafía → capacidades

| Serigrafía | Símbolo Arduino | Capacidades | Notas |
| --- | --- | --- | --- |
| D0 | `0` | ninguna (reservado) | Reservado para serie USB (RX/TX del puente USB-UART). No seleccionable. |
| D1 | `1` | ninguna (reservado) | Reservado para serie USB (RX/TX del puente USB-UART). No seleccionable. |
| D2 | `2` | digitalInput, digitalOutput |  |
| D3 | `3` | digitalInput, digitalOutput, pwm |  |
| D4 | `4` | digitalInput, digitalOutput |  |
| D5 | `5` | digitalInput, digitalOutput, pwm |  |
| D6 | `6` | digitalInput, digitalOutput, pwm |  |
| D7 | `7` | digitalInput, digitalOutput |  |
| D8 | `8` | digitalInput, digitalOutput |  |
| D9 | `9` | digitalInput, digitalOutput, pwm |  |
| D10 | `10` | digitalInput, digitalOutput, pwm |  |
| D11 | `11` | digitalInput, digitalOutput, pwm |  |
| D12 | `12` | digitalInput, digitalOutput |  |
| D13 | `13` | digitalInput, digitalOutput | LED integrado; alto enciende, bajo apaga. Compartido con SPI SCK. |
| A0 | `A0` | digitalInput, digitalOutput, analogInput |  |
| A1 | `A1` | digitalInput, digitalOutput, analogInput |  |
| A2 | `A2` | digitalInput, digitalOutput, analogInput |  |
| A3 | `A3` | digitalInput, digitalOutput, analogInput |  |
| A4 | `A4` | digitalInput, digitalOutput, analogInput | I2C SDA; compartido con el bus Wire. |
| A5 | `A5` | digitalInput, digitalOutput, analogInput | I2C SCL; compartido con el bus Wire. |
