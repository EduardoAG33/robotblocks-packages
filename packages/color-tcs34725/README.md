# Sensor de color TCS34725

Extensión **experimental** para MicroPython y Arduino/C++, probada en simulación y pendiente de prueba física. Para el **DFRobot Gravity SEN0212** u otro módulo TCS34725 por I2C (dirección 0x29).

## Bloques

- **configurar sensor de color SDA [pin] SCL [pin]**: en «al iniciar».
- **color detectado**: negro, blanco, gris, rojo, naranja, amarillo, verde, azul o morado. Los rangos son aproximados.
- **[tono / saturación / brillo] del color**: tono de 0 a 360 (rojo ≈ 0, amarillo ≈ 60, verde ≈ 120, azul ≈ 240); saturación y brillo de 0 a 100.
- **valor crudo [rojo / verde / azul / claridad]**: cuentas del sensor, para tus propios umbrales.

Para colores de una pista concreta, mide el **tono** y el **brillo** de cada color en el monitor y compáralos con «si». Es más confiable que el nombre automático.

## Conexiones

- VCC → 3.3 V o 5 V, GND → GND, SDA → SDA, SCL → SCL.
- Comparte SDA/SCL con otros sensores I2C (por ejemplo la IMU): usa los mismos pines en todos los bloques «configurar».
- Distancia de lectura: de 3 a 10 mm. El módulo trae LEDs blancos para iluminar la superficie.

## Arduino/C++

Plantillas declarativas experimentales, sin código ejecutable en el paquete. Se mantienen las plantillas MicroPython. Copiar código y Descargar archivo dan un único `.ino` con el runtime integrado. Generación verificada; compilación del core y prueba física pendientes.

Wire directo, sin Adafruit ni otra dependencia. Selección del bus por SDA/SCL oficiales; helpers I2C compartidos con BNO055. Bus a 100 kHz: a 400 kHz un módulo real no respondió en Wire2 de una Teensy 4.1 (0 de 50 lecturas; 50 de 50 a 100 kHz). Lee ID 0x44/0x4D en 0x29 y distingue «no responde» de «no es un TCS34725»; ATIME 0xD5 (~103 ms), ganancia 4x y RGBC little-endian. Espera cooperativa de 3 ms entre PON y AEN. Conserva HSV, nombres aproximados de color y divisor de brillo 44032 del código MicroPython. Después de habilitar, la primera muestra útil requiere un ciclo de integración; añade una espera antes de leer. El bloque no espera ese ciclo, igual que MicroPython.

Fuente: [datasheet oficial ams OSRAM TCS3472, registros y protocolo I2C](https://look.ams-osram.com/m/7ec5bcc3e40679be/original/TCS3472-DS000390.pdf).
