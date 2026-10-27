# Arduino GIGA R1 WiFi

Lógica de 3.3 V; NO tolerante a 5 V. LED RGB integrado (LEDR/LEDG/LEDB), activo en bajo. ADC leído a 10 bits y PWM de 8 bits por defecto.

Destino C++/Arduino: `arduino:mbed_giga:giga`. No instala cores ni carga firmware.
Usa **Copiar código** o **Descargar archivo** en la vista Código: obtienes un único `.ino`
con `robotblocks_runtime.h` integrado, listo para Arduino IDE. Probada en hardware (ver al final).

Las capacidades corresponden a pines del pinout oficial y funciones accesibles por el core.
Un alias analógico comparte el pin físico: no se duplica como recurso digital.
Alimentación, GND, RESET, USB y señales dedicadas no se ofrecen como GPIO.

A0–A7 admiten GPIO y ADC; **A8–A11 solo ADC**, según la advertencia del pinout.
DAC0/DAC1 usan los símbolos Arduino A12/A13: ADC y GPIO, además de salida DAC real
(no se marcan PWM). A7 y DAC0/1 comparten el jack de audio.
D54–D75 están en conectores de cámara/pantalla; D101/D102 duplicados se registran una sola vez.
Se omiten DSI (sin GPIO) y controles internos de WiFi, Bluetooth y USB.
RGB: RED/D86 → LEDR, GREEN/D87 → LEDG, BLUE/D88 → LEDB; ánodo común, bajo enciende.
El ejemplo apaga los tres canales y parpadea el rojo; D13 es SCK/PWM, no el LED integrado.

`adcBits: 10` indica la lectura por defecto (0–1023), no el máximo de 16 bits del ADC.
PWM por defecto: 8 bits, 500 Hz. Las extensiones QTR y Motores emiten `analogReadResolution(adcBits)` y `analogWriteResolution(pwm.bits)` para fijar los rangos declarados.
Los PWM seleccionables son D2–D13, marcados ~ en el pinout principal.

Shield Pololu Dual VNH5019 (#2507):

| Uso               | Pines    | Capacidad                   |
| ----------------- | -------- | --------------------------- |
| M1 INA / INB      | D2 / D4  | digitalInput, digitalOutput |
| M2 INA / INB      | D7 / D8  | digitalInput, digitalOutput |
| PWM M1 / M2       | D9 / D10 | pwm (también GPIO)          |
| EN/DIAG           | D6 / D12 | digitalInput, digitalOutput |
| Corriente M1 / M2 | A0 / A1  | analogInput (también GPIO)  |

Todos los diez recursos pedidos existen. Esto verifica asignaciones, no el control físico del shield.
Motores usa PWM + INA + INB. El bloque EN/DIAG libera D6/D12 con INPUT_PULLUP. VDD del shield y sus pull-ups deben quedar a 3.3 V; la conexión Arduino estándar usa 5 V. No conectar señales superiores a 3.3 V.

## Compatibilidad de extensiones

Pines básicos, Motores, QTR, HC-SR04, TCS34725 y BNO055 tienen plantillas Arduino con APIs del core. Servos usa Servo.h (biblioteca oficial Arduino en AVR/GIGA; incluida en Teensyduino). UART usa los puertos independientes oficiales: no disponible en UNO/Nano, donde Serial comparte USB.

En UNO/Nano, Servos junto con PWM D9/D10 produce diagnóstico por Timer1. GIGA selecciona la implementación mbed de Servo, aunque la biblioteca puede advertir por arquitectura.

## Fuentes oficiales

- [Pinout oficial Arduino ABX00063 (páginas 1–3 y 5–8)](https://docs.arduino.cc/resources/pinouts/ABX00063-full-pinout.pdf).
- [Datasheet oficial Arduino ABX00063](https://docs.arduino.cc/resources/datasheets/ABX00063-datasheet.pdf).
- [Core oficial: símbolos Arduino y LED](https://github.com/arduino/ArduinoCore-mbed/blob/main/variants/GIGA/pins_arduino.h).
- [Core oficial: resoluciones y frecuencia por defecto](https://github.com/arduino/ArduinoCore-mbed/blob/main/cores/arduino/wiring_analog.cpp).

## Serigrafía → capacidades

| Serigrafía      | Símbolo Arduino | Capacidades                              | Notas                                                                     |
| --------------- | --------------- | ---------------------------------------- | ------------------------------------------------------------------------- |
| D0              | `0`             | digitalInput, digitalOutput              | UART hardware; la serie USB usa un puerto independiente.                  |
| D1              | `1`             | digitalInput, digitalOutput              | UART hardware; la serie USB usa un puerto independiente.                  |
| D2              | `2`             | digitalInput, digitalOutput, pwm         |                                                                           |
| D3              | `3`             | digitalInput, digitalOutput, pwm         |                                                                           |
| D4              | `4`             | digitalInput, digitalOutput, pwm         |                                                                           |
| D5              | `5`             | digitalInput, digitalOutput, pwm         |                                                                           |
| D6              | `6`             | digitalInput, digitalOutput, pwm         |                                                                           |
| D7              | `7`             | digitalInput, digitalOutput, pwm         |                                                                           |
| D8              | `8`             | digitalInput, digitalOutput, pwm         | I2C Wire2: SCL                                                            |
| D9              | `9`             | digitalInput, digitalOutput, pwm         | I2C Wire2: SDA                                                            |
| D10             | `10`            | digitalInput, digitalOutput, pwm         |                                                                           |
| D11             | `11`            | digitalInput, digitalOutput, pwm         |                                                                           |
| D12             | `12`            | digitalInput, digitalOutput, pwm         |                                                                           |
| D13             | `13`            | digitalInput, digitalOutput, pwm         |                                                                           |
| D14             | `14`            | digitalInput, digitalOutput              |                                                                           |
| D15             | `15`            | digitalInput, digitalOutput              |                                                                           |
| D16             | `16`            | digitalInput, digitalOutput              |                                                                           |
| D17             | `17`            | digitalInput, digitalOutput              |                                                                           |
| D18             | `18`            | digitalInput, digitalOutput              |                                                                           |
| D19             | `19`            | digitalInput, digitalOutput              |                                                                           |
| D20             | `20`            | digitalInput, digitalOutput              | I2C Wire: SDA                                                             |
| D21             | `21`            | digitalInput, digitalOutput              | I2C Wire: SCL                                                             |
| D22             | `22`            | digitalInput, digitalOutput              |                                                                           |
| D23             | `23`            | digitalInput, digitalOutput              |                                                                           |
| D24             | `24`            | digitalInput, digitalOutput              |                                                                           |
| D25             | `25`            | digitalInput, digitalOutput              |                                                                           |
| D26             | `26`            | digitalInput, digitalOutput              |                                                                           |
| D27             | `27`            | digitalInput, digitalOutput              |                                                                           |
| D28             | `28`            | digitalInput, digitalOutput              |                                                                           |
| D29             | `29`            | digitalInput, digitalOutput              |                                                                           |
| D30             | `30`            | digitalInput, digitalOutput              |                                                                           |
| D31             | `31`            | digitalInput, digitalOutput              |                                                                           |
| D32             | `32`            | digitalInput, digitalOutput              |                                                                           |
| D33             | `33`            | digitalInput, digitalOutput              |                                                                           |
| D34             | `34`            | digitalInput, digitalOutput              |                                                                           |
| D35             | `35`            | digitalInput, digitalOutput              |                                                                           |
| D36             | `36`            | digitalInput, digitalOutput              |                                                                           |
| D37             | `37`            | digitalInput, digitalOutput              |                                                                           |
| D38             | `38`            | digitalInput, digitalOutput              |                                                                           |
| D39             | `39`            | digitalInput, digitalOutput              |                                                                           |
| D40             | `40`            | digitalInput, digitalOutput              |                                                                           |
| D41             | `41`            | digitalInput, digitalOutput              |                                                                           |
| D42             | `42`            | digitalInput, digitalOutput              |                                                                           |
| D43             | `43`            | digitalInput, digitalOutput              |                                                                           |
| D44             | `44`            | digitalInput, digitalOutput              |                                                                           |
| D45             | `45`            | digitalInput, digitalOutput              |                                                                           |
| D46             | `46`            | digitalInput, digitalOutput              |                                                                           |
| D47             | `47`            | digitalInput, digitalOutput              |                                                                           |
| D48             | `48`            | digitalInput, digitalOutput              |                                                                           |
| D49             | `49`            | digitalInput, digitalOutput              |                                                                           |
| D50             | `50`            | digitalInput, digitalOutput              |                                                                           |
| D51             | `51`            | digitalInput, digitalOutput              |                                                                           |
| D52             | `52`            | digitalInput, digitalOutput              |                                                                           |
| D53             | `53`            | digitalInput, digitalOutput              |                                                                           |
| D54             | `54`            | digitalInput, digitalOutput              | Conector de cámara; no usar como GPIO mientras se utiliza la cámara.      |
| D55             | `55`            | digitalInput, digitalOutput              | Conector de cámara; no usar como GPIO mientras se utiliza la cámara.      |
| D56             | `56`            | digitalInput, digitalOutput              | Conector de cámara; no usar como GPIO mientras se utiliza la cámara.      |
| D57             | `57`            | digitalInput, digitalOutput              | Conector de cámara; no usar como GPIO mientras se utiliza la cámara.      |
| D58             | `58`            | digitalInput, digitalOutput              | Conector de cámara; no usar como GPIO mientras se utiliza la cámara.      |
| D59             | `59`            | digitalInput, digitalOutput              | Conector de cámara; no usar como GPIO mientras se utiliza la cámara.      |
| D60             | `60`            | digitalInput, digitalOutput              | Conector de cámara; no usar como GPIO mientras se utiliza la cámara.      |
| D61             | `61`            | digitalInput, digitalOutput              | Conector de cámara; no usar como GPIO mientras se utiliza la cámara.      |
| D62             | `62`            | digitalInput, digitalOutput              | Conector de cámara; no usar como GPIO mientras se utiliza la cámara.      |
| D63             | `63`            | digitalInput, digitalOutput              | Conector de cámara; no usar como GPIO mientras se utiliza la cámara.      |
| D64             | `64`            | digitalInput, digitalOutput              | Conector de cámara; no usar como GPIO mientras se utiliza la cámara.      |
| D65             | `65`            | digitalInput, digitalOutput              | Conector de cámara; no usar como GPIO mientras se utiliza la cámara.      |
| D66             | `66`            | digitalInput, digitalOutput              | Conector de cámara; no usar como GPIO mientras se utiliza la cámara.      |
| D67             | `67`            | digitalInput, digitalOutput              | Conector de cámara; no usar como GPIO mientras se utiliza la cámara.      |
| D68             | `68`            | digitalInput, digitalOutput              | Conector de pantalla/cámara; no usar como GPIO con ese periférico activo. |
| D69             | `69`            | digitalInput, digitalOutput              | Conector de pantalla/cámara; no usar como GPIO con ese periférico activo. |
| D70             | `70`            | digitalInput, digitalOutput              | Conector de pantalla/cámara; no usar como GPIO con ese periférico activo. |
| D71             | `71`            | digitalInput, digitalOutput              | Conector de pantalla/cámara; no usar como GPIO con ese periférico activo. |
| D72             | `72`            | digitalInput, digitalOutput              | Conector de pantalla/cámara; no usar como GPIO con ese periférico activo. |
| D73             | `73`            | digitalInput, digitalOutput              | Conector de pantalla/cámara; no usar como GPIO con ese periférico activo. |
| D74             | `74`            | digitalInput, digitalOutput              | Conector de pantalla/cámara; no usar como GPIO con ese periférico activo. |
| D75             | `75`            | digitalInput, digitalOutput              | Conector de pantalla/cámara; no usar como GPIO con ese periférico activo. |
| A0              | `A0`            | digitalInput, digitalOutput, analogInput |                                                                           |
| A1              | `A1`            | digitalInput, digitalOutput, analogInput |                                                                           |
| A2              | `A2`            | digitalInput, digitalOutput, analogInput |                                                                           |
| A3              | `A3`            | digitalInput, digitalOutput, analogInput |                                                                           |
| A4              | `A4`            | digitalInput, digitalOutput, analogInput |                                                                           |
| A5              | `A5`            | digitalInput, digitalOutput, analogInput |                                                                           |
| A6              | `A6`            | digitalInput, digitalOutput, analogInput |                                                                           |
| A7              | `A7`            | digitalInput, digitalOutput, analogInput | Compartido con entrada de micrófono del jack de audio.                    |
| A8              | `A8`            | analogInput                              | Solo analógico; sin GPIO digital.                                         |
| A9              | `A9`            | analogInput                              | Solo analógico; sin GPIO digital.                                         |
| A10             | `A10`           | analogInput                              | Solo analógico; sin GPIO digital.                                         |
| A11             | `A11`           | analogInput                              | Solo analógico; sin GPIO digital.                                         |
| DAC0            | `A12`           | digitalInput, digitalOutput, analogInput | DAC real (no PWM), compartido con el jack de audio. Arduino usa A12.      |
| DAC1            | `A13`           | digitalInput, digitalOutput, analogInput | DAC real (no PWM), compartido con el jack de audio. Arduino usa A13.      |
| CAN RX          | `93`            | digitalInput, digitalOutput              | Compartido con CAN; requiere transceptor externo.                         |
| CAN TX          | `94`            | digitalInput, digitalOutput              | Compartido con CAN; requiere transceptor externo.                         |
| D101 / SCL1     | `101`           | digitalInput, digitalOutput              | I2C Wire1; duplicado en el conector de cámara.                            |
| D102 / SDA1     | `102`           | digitalInput, digitalOutput              | I2C Wire1; duplicado en el conector de cámara.                            |
| RED / LED RGB   | `LEDR`          | digitalOutput                            | LED RGB integrado de ánodo común: bajo enciende, alto apaga. D86.         |
| GREEN / LED RGB | `LEDG`          | digitalOutput                            | LED RGB integrado de ánodo común: bajo enciende, alto apaga. D87.         |
| BLUE / LED RGB  | `LEDB`          | digitalOutput                            | LED RGB integrado de ánodo común: bajo enciende, alto apaga. D88.         |

## UART e I2C para C++

Solo se admiten estos pares de pines predeterminados del core. No se remapean pines alternativos.

| Puerto  | RX  | TX  | Uso                |
| ------- | --- | --- | ------------------ |
| Serial1 | d0  | d1  | UART independiente |
| Serial2 | d19 | d18 | UART independiente |
| Serial3 | d17 | d16 | UART independiente |
| Serial4 | d15 | d14 | UART independiente |

| Bus   | SDA  | SCL  |
| ----- | ---- | ---- |
| Wire  | d20  | d21  |
| Wire1 | d102 | d101 |
| Wire2 | d9   | d8   |

Servo usa `Servo.h`; el core define ARDUINO_ARCH_MBED y selecciona la implementación mbed de Servo 1.3.0. Su library.properties aún omite mbed_giga; Arduino IDE puede advertir sobre la arquitectura. No se ha compilado ni probado físicamente aquí.

Fuentes adicionales: [core GIGA: pines](https://github.com/arduino/ArduinoCore-mbed/blob/main/variants/GIGA/pins_arduino.h), [selección mbed](https://github.com/arduino/ArduinoCore-mbed/blob/main/platform.txt), [Servo oficial](https://github.com/arduino-libraries/Servo/blob/master/src/mbed/Servo.cpp).

## Prueba en hardware

- 2026-10-18: robot Rescue Line de Los Grises (PCB `Gerber_PCB1_2026-10-13`), sketch subido desde la app con
  arduino-cli (COM7). VNH5019, 11 canales QTR (incluidos A8–A11), 9 VL53L0X con nombre, BNO055 en Wire1 y
  UART 2/3 con las dos XIAO, todo leído en el Monitor serie.
