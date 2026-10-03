# IMU BNO055

Extensión **experimental** para MicroPython, probada en simulación y pendiente de prueba física. Para el **DFRobot Gravity SEN0253** (BNO055 + BMP280) u otro módulo BNO055 por I2C.

## Bloques

- **configurar IMU BNO055 SDA [pin] SCL [pin]**: en «al iniciar», con el robot quieto. Busca la IMU en 0x28 y 0x29.
- **ángulo de giro**: de -180 a 180 grados respecto al último reinicio; positivo hacia la derecha. Perfecto para girar 90° o avanzar recto con un PID.
- **reiniciar ángulo de giro**: la dirección actual pasa a ser 0.
- **inclinación [adelante/atrás / izquierda/derecha]**: en grados, útil para rampas.

Usa el modo **IMU** del chip (acelerómetro + giroscopio, sin brújula), así que los motores y las estructuras metálicas no alteran el giro. A cambio, puede desviarse lentamente con el tiempo: reinicia el ángulo al empezar cada recorrido.

## Conexiones

- VCC → 3.3 V o 5 V, GND → GND, SDA → SDA, SCL → SCL.
- Comparte SDA/SCL con otros sensores I2C usando los mismos pines en sus bloques «configurar».
- El barómetro BMP280 del mismo módulo aún no tiene bloques.
