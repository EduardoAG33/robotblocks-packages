# Arduino UNO R4 Minima

Paquete declarativo, sin permisos ni código ejecutable. FQBN `arduino:renesas_uno:minima`, confirmado en el core oficial. Lógica de **5 V**. ADC configurado a **10 bits** para mantener la escala del generador QTR; el silicio admite hasta **14 bits**. PWM de **8 bits** en D3/D5/D6/D9/D10/D11. DAC A0 de **12 bits**, descrito como `analogOutput`; esta tarea no agrega un bloque DAC.

El USB-C es nativo del RA4M1: `Serial` es USB, `Serial1` RX=D0 y TX=D1. Ambos pines se pueden seleccionar. Wire usa SDA=A4, SCL=A5; las cabeceras SDA/SCL duplican esos mismos recursos. D13 enciende el LED integrado en alto.

Motores, QTR, HC-SR04, UART, TCS34725 y BNO055 tienen plantillas Arduino que usan APIs del core (`analogWrite`, `analogRead`, `pulseIn`, `Serial1`, `Wire`). Los sensores I2C usan Wire directo, sin Adafruit. Servos requiere la biblioteca oficial `Servo.h` (1.3.0 declara `renesas_uno`); no se instala automáticamente. Las resoluciones ADC/PWM se fijan en setup cuando una plantilla las requiere. Ninguna de estas afirmaciones sustituye la compilación con el core ni una prueba física.

Copia/descarga un único `.ino` con el runtime incluido. La carga con arduino-cli queda para Fase 8. El ejemplo es `examples/arduino-uno-r4-minima-parpadeo.blocks.json` en la app. UNO R4 no ofrece un destino MicroPython en este paquete.

## Validación de generación — 2026-10-03

Arduino CLI 1.5.1 y core arduino:renesas_uno 1.6.0: **ocho sketches compilados**
(las siete extensiones y el parpadeo). Servo.h 1.3.0 ya estaba instalada y compiló
para Renesas. No se instalaron dependencias ni se realizó carga física.
El informe y las salidas están en docs/TARJETAS_R4_XIAO.md del repo de la app.

## Pines

| Serigrafía | Capacidades                                            | symbol.arduino | Notas                                                                    |
| ---------- | ------------------------------------------------------ | -------------- | ------------------------------------------------------------------------ |
| D0         | digitalInput, digitalOutput                            | 0              | Serial1 RX; libre porque Serial usa USB nativo.                          |
| D1         | digitalInput, digitalOutput                            | 1              | Serial1 TX; libre porque Serial usa USB nativo.                          |
| D2         | digitalInput, digitalOutput                            | 2              |                                                                          |
| D3         | digitalInput, digitalOutput, pwm                       | 3              |                                                                          |
| D4         | digitalInput, digitalOutput                            | 4              |                                                                          |
| D5         | digitalInput, digitalOutput, pwm                       | 5              |                                                                          |
| D6         | digitalInput, digitalOutput, pwm                       | 6              |                                                                          |
| D7         | digitalInput, digitalOutput                            | 7              |                                                                          |
| D8         | digitalInput, digitalOutput                            | 8              |                                                                          |
| D9         | digitalInput, digitalOutput, pwm                       | 9              |                                                                          |
| D10        | digitalInput, digitalOutput, pwm                       | 10             |                                                                          |
| D11        | digitalInput, digitalOutput, pwm                       | 11             |                                                                          |
| D12        | digitalInput, digitalOutput                            | 12             |                                                                          |
| D13        | digitalInput, digitalOutput                            | 13             | LED integrado; alto enciende, bajo apaga. Compartido con SPI SCK.        |
| A0         | digitalInput, digitalOutput, analogInput, analogOutput | A0             | DAC de 12 bits en A0. No confundir DAC con PWM; no hay bloque DAC nuevo. |
| A1         | digitalInput, digitalOutput, analogInput               | A1             |                                                                          |
| A2         | digitalInput, digitalOutput, analogInput               | A2             |                                                                          |
| A3         | digitalInput, digitalOutput, analogInput               | A3             |                                                                          |
| A4         | digitalInput, digitalOutput, analogInput               | A4             | I2C SDA; compartido con el bus Wire.                                     |
| A5         | digitalInput, digitalOutput, analogInput               | A5             | I2C SCL; compartido con el bus Wire.                                     |

## Fuentes oficiales

- [Pinout UNO R4 Minima (ABX00080)](https://docs.arduino.cc/resources/pinouts/ABX00080-full-pinout.pdf)
- [Datasheet UNO R4 Minima](https://docs.arduino.cc/resources/datasheets/ABX00080-datasheet.pdf)
- [Manual UNO R4 Minima: ADC, PWM, DAC y USB/Serial1](https://docs.arduino.cc/tutorials/uno-r4-minima/cheat-sheet/)
- [Resolución ADC UNO R4 Minima](https://docs.arduino.cc/tutorials/uno-r4-minima/adc-resolution/)
- [Core Renesas: boards.txt (minima)](https://github.com/arduino/ArduinoCore-renesas/blob/main/boards.txt)
- [Servo 1.3.0: arquitecturas Renesas](https://github.com/arduino-libraries/Servo/blob/1.3.0/library.properties)

## Prueba en hardware

- 2026-10-10: carga por DFU desde la app y desde arduino-cli; HC-SR04 (TRIG D7 / ECHO D8) funcionando.
- 2026-10-17: servo + HC-SR04 cargado desde la app. Si arduino-cli dice «Lost device after RESET?»,
  presiona RESET dos veces rápido (LED «respira») y vuelve a cargar.
- En Windows, el Monitor necesita el driver del puerto CDC: «Dispositivo serie USB» de Microsoft o
  `post_install.bat` del core como administrador. Sin él la carga por DFU funciona igual.
