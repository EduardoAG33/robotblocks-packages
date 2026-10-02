# Pines digitales, analógicos y PWM

Cinco bloques: lectura digital, salida alto/bajo, salida numérica 0/1, lectura analógica y PWM.
Los menús filtran capacidades, conservan IDs y mantienen selecciones incompatibles para diagnosticarlas.

Plantillas MicroPython ESP32 experimentales: Pin.IN/OUT, ADC de 12 bits con atenuación 11 dB,
PWM 5000 Hz con duty 0–1023. PWM acepta 0–100 % entero. ADC emite RB_ERROR si falla.
Las tarjetas virtuales solo previsualizan; Arduino/otros firmwares quedan pendientes.
Fuente: [referencia ESP32 de MicroPython](https://docs.micropython.org/en/latest/esp32/quickref.html).
Servo/RGB siguen pendientes. Las extensiones son datos; nunca JS ejecutado.
