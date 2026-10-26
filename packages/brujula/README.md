# Brújula QMC5883L / HMC5883L

Sensor I2C experimental para Arduino y MicroPython en ESP32. Pybricks no está soportado. Conecta alimentación y GND según el módulo y SDA/SCL al mismo bus I2C del robot. Comprueba la tensión compatible del módulo.

Coloca la brújula plana: no compensa la inclinación. Aléjala de motores e imanes. Configúrala al iniciar y, mientras el robot gira dos vueltas, ejecuta «calibrar brújula» repetidamente para medir los extremos de X e Y. Ajusta la declinación local (en Monterrey aproximadamente +4°). El rumbo usa los offsets de calibración; «campo» devuelve X, Y o Z crudo. Sin muestras de calibración los offsets son cero.

El ejemplo configura el sensor, fija la declinación y lee el rumbo. La calibración útil requiere repetir el bloque mientras gira el robot. Todavía no se ha probado en hardware.

## English

Experimental I2C compass for Arduino and ESP32 MicroPython; Pybricks is not supported. Connect power and ground according to the module, and SDA/SCL to the robot's I2C bus. Check the module's voltage compatibility. Keep it level and away from motors and magnets. Configure it at startup and repeat the calibration block while rotating twice. Set local declination; heading uses the calibration offsets, while the field block returns raw X, Y or Z. No hardware validation has been performed.
