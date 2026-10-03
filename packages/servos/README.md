# Servos

Extensión **experimental** para MicroPython (probada en simulación; pendiente de prueba física). El pin se elige directamente en el bloque, como en Mind+.

## Bloques

- **servo en pin [pin] a (ángulo) grados**: de 0 a 180. Los valores fuera de rango se limitan.
- **soltar servo en pin [pin]**: deja de enviar pulsos y el servo ya no se sostiene en su posición.

Pulso de 0.5 ms (0°) a 2.5 ms (180°) a 50 Hz. Si tu servo vibra en los extremos, usa un rango más corto, por ejemplo de 10° a 170°.

## Conexiones

- Señal (naranja/amarillo) → un pin con PWM.
- Rojo → 5 V de una fuente externa o de un regulador. Evita sacar los 5 V del USB para servos grandes como el MG996R.
- Café/negro → GND, **común con la placa**.

## Arduino/C++

Plantillas declarativas experimentales, sin código ejecutable en el paquete. Se mantienen las plantillas MicroPython. Copiar código y Descargar archivo dan un único `.ino` con el runtime integrado. Generación verificada; compilación del core y prueba física pendientes.

Incluye Servo.h: ángulo limitado a 0…180, pulsos de 500…2500 μs, detach al soltar y attach al volver a mover. Se conserva la selección de pines PWM del bloque MicroPython aunque Servo admite otros GPIO.

UNO/Nano: instala la biblioteca oficial Arduino Servo si falta. Usa Timer1 y entra en conflicto con analogWrite en D9/D10; el generador rechaza esa combinación. GIGA: el core define ARDUINO_ARCH_MBED y selecciona Servo/src/mbed; Servo 1.3.0 no lista mbed_giga en library.properties, por lo que Arduino IDE puede mostrar una advertencia de arquitectura. Teensy 4.0/4.1: usa Servo incluida con Teensyduino; PJRC declara ambos modelos y ausencia de conflicto con analogWrite. No se instala otra biblioteca.

Fuentes: [Servo oficial: API y advertencia de timers](https://github.com/arduino-libraries/Servo/blob/master/docs/api.md), [selección de arquitectura](https://github.com/arduino-libraries/Servo/blob/master/src/Servo.h), [implementación mbed](https://github.com/arduino-libraries/Servo/blob/master/src/mbed/Servo.cpp), [receta de compilación mbed](https://github.com/arduino/ArduinoCore-mbed/blob/main/platform.txt), [PJRC: Servo y Teensy 4.x](https://www.pjrc.com/teensy/td_libs_Servo.html).
