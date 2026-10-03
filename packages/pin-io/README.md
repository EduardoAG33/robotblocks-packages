# Pines digitales, analógicos y PWM

Cinco bloques: lectura digital, salida alto/bajo, salida numérica 0/1, lectura analógica y PWM.
Los menús filtran capacidades, conservan IDs y mantienen selecciones incompatibles para diagnosticarlas.

Plantillas MicroPython ESP32 experimentales: Pin.IN/OUT, ADC de 12 bits con atenuación 11 dB,
PWM 5000 Hz con duty 0–1023. PWM acepta 0–100 % entero. ADC emite RB_ERROR si falla.
Arduino experimental: `digitalRead`, `digitalWrite`, `analogRead` y `analogWrite` del core,
sin librerías ni drivers nuevos. ADC usa la resolución por defecto del core (10 bits en
UNO, Nano, GIGA y Teensy 4.x); PWM usa 8 bits, 0–255. La frecuencia depende del pin/core.
Las tarjetas virtuales solo previsualizan; la carga Arduino queda para Fase 8.
Fuentes: [API Arduino](https://docs.arduino.cc/language-reference/),
[resoluciones del core mbed](https://github.com/arduino/ArduinoCore-mbed/blob/main/cores/arduino/wiring_analog.cpp)
y [PWM PJRC](https://www.pjrc.com/teensy/td_pulse.html).
Fuente: [referencia ESP32 de MicroPython](https://docs.micropython.org/en/latest/esp32/quickref.html).
El LED RGB de GIGA se controla con salidas digitales activas en bajo; los efectos RGB y
los drivers de Servos siguen pendientes. Las extensiones son datos; nunca JS ejecutado.
