# Sensor de color TCS34725

Extensión **experimental** para MicroPython, probada en simulación y pendiente de prueba física. Para el **DFRobot Gravity SEN0212** u otro módulo TCS34725 por I2C (dirección 0x29).

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
