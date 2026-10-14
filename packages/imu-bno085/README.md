# IMU BNO085 (UART-RVC)

Extensión **experimental** para Arduino/C++, generada y verificada en simulación, pendiente de prueba física. Para el **GY-BNO085** (por ejemplo el de uElectronics) u otro módulo BNO085/BNO080 en modo **UART-RVC**.

## Por qué UART-RVC y no I2C

El I2C del BNO08x no respeta del todo el protocolo: falla con ESP32, con chips NXP i.MX RT y con multiplexores I2C, y su librería oficial necesita mucha RAM. En modo **RVC** («Robot Vacuum Cleaner») el sensor envía solo, por un puerto serie a 115200 baudios, 100 paquetes por segundo con el giro (yaw), la inclinación (pitch/roll) y la aceleración. No necesita librería ni configuración: la tarjeta solo escucha.

## Bloques

- **configurar IMU BNO085 en UART [n] RX [pin] TX [pin]**: en «al iniciar». Espera hasta 1 s el primer paquete; si no llega, el programa se detiene con un mensaje claro.
- **ángulo de giro**: de -180 a 180 grados respecto al último «reiniciar»; positivo hacia la derecha, igual que la IMU BNO055.
- **reiniciar ángulo de giro**: la dirección actual pasa a ser 0.
- **inclinación [adelante/atrás · izquierda/derecha]**: grados; útil para detectar rampas.
- **aceleración [x · y · z] en m/s²**: gravedad incluida (en reposo, z ≈ 9.8).

Los bloques de giro e inclinación tienen los mismos nombres que los de la IMU BNO055: un programa sirve para las dos cambiando solo el bloque «configurar».

## Conexiones

| BNO085                  | Tarjeta                                     |
| ----------------------- | ------------------------------------------- |
| VCC                     | **3.3 V** (el módulo no admite 5 V)         |
| GND                     | GND                                         |
| **PS0**                 | **3.3 V** (modo UART-RVC; PS1 queda en GND) |
| TX (pin SDA del módulo) | RX del puerto elegido                       |

- El TX de la tarjeta puede quedar sin conectar: el sensor no recibe órdenes en este modo. El bloque pide el pin porque algunas tarjetas lo necesitan para abrir el puerto.
- **Teensy 4.0 / 4.1**: cualquier `Serial1`…`Serial8` (4.1). Por ejemplo `Serial2` (RX 7, TX 8) o `Serial7` (RX 28, TX 29). Evita los puertos cuyos pines uses para I2C (`Serial4` = Wire1 en 16/17, `Serial6` = Wire2 en 24/25).
- **UNO y Nano**: no recomendado. Solo tienen `Serial` para USB y SoftwareSerial no recibe bien a 115200.
- Señales de 3.3 V: con tarjetas de 5 V (Mega, UNO) el RX tolera 3.3 V, pero nunca conectes el TX de 5 V de la tarjeta al sensor.

## Detalles

- Paquete de 19 bytes: `0xAA 0xAA`, índice, yaw, pitch y roll en centésimas de grado, aceleración x/y/z en mg, tres bytes reservados y una suma de comprobación (8 bits de los 16 bytes después del encabezado). Los paquetes con suma incorrecta se descartan.
- Si el programa pasa más de 30 ms sin leer la IMU (por ejemplo, durante un «esperar»), el búfer serie se llena de paquetes viejos: se descartan y se usa el siguiente paquete nuevo. La primera lectura después de una espera larga puede repetir el último valor.
- Si dejan de llegar paquetes durante más de 500 ms mientras se lee, el programa se detiene con «El BNO085 dejó de enviar datos».
- El signo del giro (positivo a la derecha) sigue la convención de la BNO055 y debe confirmarse en la prueba física.

Fuentes: [código de Adafruit_BNO08x_RVC (formato y suma del paquete)](https://github.com/adafruit/Adafruit_BNO08x_RVC) y [ficha del GY-BNO085 de uElectronics (pines y modos PS0/PS1)](https://uelectronics.com/producto/gy-bno085-sensor-imu-de-9dof/).
