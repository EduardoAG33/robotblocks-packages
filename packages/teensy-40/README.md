# Teensy 4.0 — experimental

i.MX RT1062. Lógica de 3.3 V; NO tolerante a 5 V. ADC leído a 10 bits (hardware 12 bits), PWM de 8 bits por defecto. LED integrado pin 13.

Destino C++/Arduino: `teensy:avr:teensy40`. No instala cores ni carga firmware.
Usa **Copiar código** en la vista Código, y copia también `robotblocks_runtime.h`
junto al sketch en Arduino IDE. Pendiente de compilación con el core y prueba física.

Las capacidades corresponden a pines del pinout oficial y funciones accesibles por el core.
Un alias analógico comparte el pin físico: no se duplica como recurso digital.
Alimentación, GND, RESET, USB y señales dedicadas no se ofrecen como GPIO.

USB Serial es nativo: los pines 0/1 son UART Serial1 y siguen disponibles.
LED pin 13 activo en alto; no usar INPUT_PULLUP en ese pin.
ADC por defecto: 10 bits (0–1023), hardware hasta 12 bits; entrada limitada a 0–3.3 V.
PWM por defecto: 8 bits (0–255); FlexPWM ~4482 Hz y QuadTimer ~3611 Hz.
`defaultFrequency` representa FlexPWM; las notas de cada pin indican su frecuencia.
No se cambian resoluciones ni frecuencias al generar.

0–23 están en los bordes; **24–33: pad inferior, requiere soldar**.
24/A10, 25/A11, 26/A12 y 27/A13 son ADC adicionales inferiores.
34–39 también son pads inferiores, compartidos con SDIO: no usarlos con SDIO activo.
No se copia el pinout de la 4.1: 34–39 en la 4.0 no son analógicos.

## Compatibilidad de extensiones

Pines básicos y lógica del núcleo generan C++ experimental. **Motores, Servos, Línea QTR,
HC-SR04, TCS34725, BNO055 y UART solo tienen plantillas MicroPython** en esta versión.
Usarlos en Arduino produce un diagnóstico de plantilla ausente y ningún archivo de salida.
No se ocultan de la biblioteca; no se añaden drivers ni se afirma compatibilidad de Servo
con `mbed_giga`. Esa compatibilidad debe revisarse cuando haya plantilla y compilador.

## Fuentes oficiales

- [Pinout oficial PJRC, anverso](https://www.pjrc.com/teensy/card10a_rev2_web.pdf).
- [Pinout oficial PJRC, reverso](https://www.pjrc.com/teensy/card10b_rev2_web.pdf).
- [Especificaciones y límites oficiales PJRC](https://www.pjrc.com/store/teensy40.html).
- [PWM oficial PJRC (lista por modelo, bits y frecuencias)](https://www.pjrc.com/teensy/td_pulse.html).

## Serigrafía → capacidades

| Serigrafía | Símbolo Arduino | Capacidades | Notas |
| --- | --- | --- | --- |
| 0 | `0` | digitalInput, digitalOutput, pwm | PWM por defecto: 4482 Hz (aprox.). |
| 1 | `1` | digitalInput, digitalOutput, pwm | PWM por defecto: 4482 Hz (aprox.). |
| 2 | `2` | digitalInput, digitalOutput, pwm | PWM por defecto: 4482 Hz (aprox.). |
| 3 | `3` | digitalInput, digitalOutput, pwm | PWM por defecto: 4482 Hz (aprox.). |
| 4 | `4` | digitalInput, digitalOutput, pwm | PWM por defecto: 4482 Hz (aprox.). |
| 5 | `5` | digitalInput, digitalOutput, pwm | PWM por defecto: 4482 Hz (aprox.). |
| 6 | `6` | digitalInput, digitalOutput, pwm | PWM por defecto: 4482 Hz (aprox.). |
| 7 | `7` | digitalInput, digitalOutput, pwm | PWM por defecto: 4482 Hz (aprox.). |
| 8 | `8` | digitalInput, digitalOutput, pwm | PWM por defecto: 4482 Hz (aprox.). |
| 9 | `9` | digitalInput, digitalOutput, pwm | PWM por defecto: 4482 Hz (aprox.). |
| 10 | `10` | digitalInput, digitalOutput, pwm | PWM por defecto: 3611 Hz (aprox.). |
| 11 | `11` | digitalInput, digitalOutput, pwm | PWM por defecto: 3611 Hz (aprox.). |
| 12 | `12` | digitalInput, digitalOutput, pwm | PWM por defecto: 3611 Hz (aprox.). |
| 13 | `13` | digitalInput, digitalOutput, pwm | LED integrado; alto enciende, bajo apaga. No usar INPUT_PULLUP; comparte SPI SCK. PWM por defecto: 3611 Hz (aprox.). |
| 14 / A0 | `A0` | digitalInput, digitalOutput, analogInput, pwm | PWM por defecto: 3611 Hz (aprox.). |
| 15 / A1 | `A1` | digitalInput, digitalOutput, analogInput, pwm | PWM por defecto: 3611 Hz (aprox.). |
| 16 / A2 | `A2` | digitalInput, digitalOutput, analogInput |  |
| 17 / A3 | `A3` | digitalInput, digitalOutput, analogInput |  |
| 18 / A4 | `A4` | digitalInput, digitalOutput, analogInput, pwm | I2C Wire: SDA. PWM por defecto: 3611 Hz (aprox.). |
| 19 / A5 | `A5` | digitalInput, digitalOutput, analogInput, pwm | I2C Wire: SCL. PWM por defecto: 3611 Hz (aprox.). |
| 20 / A6 | `A6` | digitalInput, digitalOutput, analogInput |  |
| 21 / A7 | `A7` | digitalInput, digitalOutput, analogInput |  |
| 22 / A8 | `A8` | digitalInput, digitalOutput, analogInput, pwm | PWM por defecto: 4482 Hz (aprox.). |
| 23 / A9 | `A9` | digitalInput, digitalOutput, analogInput, pwm | PWM por defecto: 4482 Hz (aprox.). |
| 24 / A10 | `A10` | digitalInput, digitalOutput, analogInput, pwm | pad inferior, requiere soldar. PWM por defecto: 4482 Hz (aprox.). |
| 25 / A11 | `A11` | digitalInput, digitalOutput, analogInput, pwm | pad inferior, requiere soldar. PWM por defecto: 4482 Hz (aprox.). |
| 26 / A12 | `A12` | digitalInput, digitalOutput, analogInput | pad inferior, requiere soldar. |
| 27 / A13 | `A13` | digitalInput, digitalOutput, analogInput | pad inferior, requiere soldar. |
| 28 | `28` | digitalInput, digitalOutput, pwm | pad inferior, requiere soldar. PWM por defecto: 4482 Hz (aprox.). |
| 29 | `29` | digitalInput, digitalOutput, pwm | pad inferior, requiere soldar. PWM por defecto: 4482 Hz (aprox.). |
| 30 | `30` | digitalInput, digitalOutput | pad inferior, requiere soldar. |
| 31 | `31` | digitalInput, digitalOutput | pad inferior, requiere soldar. |
| 32 | `32` | digitalInput, digitalOutput | pad inferior, requiere soldar. |
| 33 | `33` | digitalInput, digitalOutput, pwm | pad inferior, requiere soldar. PWM por defecto: 4482 Hz (aprox.). |
| 34 | `34` | digitalInput, digitalOutput, pwm | pad inferior, requiere soldar. Compartido con SDIO; no usar como GPIO con SDIO activo. PWM por defecto: 4482 Hz (aprox.). |
| 35 | `35` | digitalInput, digitalOutput, pwm | pad inferior, requiere soldar. Compartido con SDIO; no usar como GPIO con SDIO activo. PWM por defecto: 4482 Hz (aprox.). |
| 36 | `36` | digitalInput, digitalOutput, pwm | pad inferior, requiere soldar. Compartido con SDIO; no usar como GPIO con SDIO activo. PWM por defecto: 4482 Hz (aprox.). |
| 37 | `37` | digitalInput, digitalOutput, pwm | pad inferior, requiere soldar. Compartido con SDIO; no usar como GPIO con SDIO activo. PWM por defecto: 4482 Hz (aprox.). |
| 38 | `38` | digitalInput, digitalOutput, pwm | pad inferior, requiere soldar. Compartido con SDIO; no usar como GPIO con SDIO activo. PWM por defecto: 4482 Hz (aprox.). |
| 39 | `39` | digitalInput, digitalOutput, pwm | pad inferior, requiere soldar. Compartido con SDIO; no usar como GPIO con SDIO activo. PWM por defecto: 4482 Hz (aprox.). |
