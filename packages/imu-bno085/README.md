# IMU BNO085 (UART-RVC o I2C)

Extensión **experimental** para Arduino/C++, generada y verificada en simulación, pendiente de prueba física. Para el **GY-BNO085** (por ejemplo el de uElectronics) u otro módulo BNO085/BNO080 en modo **UART-RVC** o **I2C**.

## UART-RVC (recomendado) o I2C

El I2C del BNO08x no respeta del todo el protocolo: falla con ESP32, con chips NXP i.MX RT y con multiplexores I2C, y su librería oficial necesita mucha RAM. En modo **RVC** («Robot Vacuum Cleaner») el sensor envía solo, por un puerto serie a 115200 baudios, 100 paquetes por segundo con el giro (yaw), la inclinación (pitch/roll) y la aceleración. No necesita librería ni configuración: la tarjeta solo escucha.

El modo **I2C** (1.2.0) sirve cuando no queda un UART libre, por ejemplo en UNO y Nano, o cuando los puertos serie ya los usan otros módulos. Comparte el bus con los demás sensores I2C. Antes de elegirlo:

- Adafruit avisa que el I2C del BNO08x funciona mal con **ESP32/ESP32-S3** (XIAO, FireBeetle) y con **Teensy 4.x**. En esas tarjetas usa UART-RVC.
- Con GIGA, UNO R4, Mega, UNO y Nano debería funcionar; falta probarlo con el sensor real.
- No lo pongas detrás de un multiplexor I2C.

## Bloques

- **configurar IMU BNO085 en UART [n] RX [pin] TX [pin]**: en «al iniciar». Espera hasta 1 s el primer paquete; si no llega, el programa se detiene con un mensaje claro.
- **configurar IMU BNO085 por I2C SDA [pin] SCL [pin]**: en «al iniciar». Busca el sensor en 0x4A y 0x4B, lo reinicia (unos 0.3 s) y espera hasta 1 s el primer dato. Usa uno de los dos bloques «configurar», no ambos.
- **ángulo de giro**: de -180 a 180 grados respecto al último «reiniciar»; positivo hacia la derecha, igual que la IMU BNO055.
- **ángulo de giro acumulado**: sin límite de vueltas; derecha positiva, +1080° para tres vueltas a la derecha y −1080° a la izquierda.
- **reiniciar ángulo de giro**: la dirección actual pasa a ser 0 y el giro acumulado se reinicia también.
- **inclinación [adelante/atrás · izquierda/derecha]**: grados; útil para detectar rampas.
- **aceleración [x · y · z] en m/s²**: gravedad incluida (en reposo, z ≈ 9.8).

Los bloques de giro e inclinación tienen los mismos nombres que los de la IMU BNO055: un programa sirve para las dos cambiando solo el bloque «configurar». Lo mismo vale para pasar el BNO085 de UART a I2C.

## Conexiones

### UART-RVC

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

### I2C

| BNO085  | Tarjeta                                   |
| ------- | ----------------------------------------- |
| VCC     | **3.3 V**                                 |
| GND     | GND                                       |
| **PS0** | **GND**                                   |
| **PS1** | **GND**                                   |
| SDA     | SDA del bus elegido                       |
| SCL     | SCL del bus elegido                       |
| AD0/SA0 | sin cambiar: el bloque prueba 0x4A y 0x4B |

- El bloque pone el bus a 400 kHz, igual que la IMU BNO055.
- Con tarjetas de 5 V (UNO, Nano, Mega), SDA y SCL deben quedar con pull-up a 3.3 V, nunca a 5 V. Si el módulo no las trae o hay dudas, usa un conversor de nivel I2C.

## Detalles

- Paquete de 19 bytes: `0xAA 0xAA`, índice, yaw, pitch y roll en centésimas de grado, aceleración x/y/z en mg, tres bytes reservados y una suma de comprobación (8 bits de los 16 bytes después del encabezado). Los paquetes con suma incorrecta se descartan.
- El generador llama a imu_rvc_leer desde el sondeo cooperativo antes de los procesos en cada vuelta de loop(), incluso durante «esperar» y aunque el reporter se consulte rara vez. Cada paquete con checksum válido actualiza el giro acumulado (≈100 Hz); ya no se descarta la cola tras 30 ms. Las lecturas de inclinación/aceleración también drenan paquetes.
- Si dejan de llegar paquetes durante más de 500 ms mientras se lee, el programa se detiene con «El BNO085 dejó de enviar datos».
- El signo del giro (positivo a la derecha) sigue la convención de la BNO055 y debe confirmarse en la prueba física.

Fuentes: [código de Adafruit_BNO08x_RVC (formato y suma del paquete)](https://github.com/adafruit/Adafruit_BNO08x_RVC), [guía del BNO085 de Adafruit (avisos sobre I2C)](https://learn.adafruit.com/adafruit-9-dof-orientation-imu-fusion-breakout-bno085), [SparkFun_BNO080_Arduino_Library (lectura SHTP por I2C en trozos)](https://github.com/sparkfun/SparkFun_BNO080_Arduino_Library) y [ficha del GY-BNO085 de uElectronics (pines y modos PS0/PS1)](https://uelectronics.com/producto/gy-bno085-sensor-imu-de-9dof/).

## Giro acumulado (1.1.0)

Cada paquete RVC válido integra el delta normalizado a −180…180; se invierte yaw como en «ángulo de giro» para derecha positiva. La primera muestra fija la base. Se ignoran valores no finitos y saltos mayores de 90°; un salto vuelve a fijar la base para continuar sin arrastrar el error. Reiniciar pone ambos giros a 0 después de procesar los paquetes pendientes.

El sondeo es declarativo y no usa timers, interrupciones ni una librería externa. Requiere que los procesos cooperen: una operación bloqueante larga puede desbordar el búfer UART y perder paquetes; el driver no puede recuperar esos giros. Mantén cada vuelta del planificador suficientemente corta para vaciar el búfer (normalmente <30 ms). Una espera cooperativa puede durar segundos sin detener el sondeo.

## I2C (1.2.0)

Sin librería: el bloque habla el protocolo SHTP/SH-2. Al configurar envía un reinicio por software, descarta durante 300 ms los anuncios del sensor (unos 280 bytes) y pide con «Set Feature» el **Game Rotation Vector** (0x08, sin magnetómetro, como el modo RVC; los motores no lo desvían) y el **acelerómetro** (0x01, con gravedad), ambos cada 10 ms.

- Cada lectura I2C del BNO085 empieza con una cabecera de 4 bytes. El bloque lee primero la cabecera y luego el contenido en trozos de 28 bytes, para no pasar del búfer de 32 bytes de `Wire` en AVR y UNO R4.
- El sondeo cooperativo lee el bus como máximo cada 2 ms y hasta 3 paquetes por vez. Sin pin INT, cada sondeo sin datos cuesta una lectura de 4 bytes.
- El cuaternión se pasa a yaw, pitch y roll en orden Z-Y-X, con centésimas de grado como el modo RVC; el resto de bloques no cambia.
- Si el sensor se reinicia solo (por ejemplo, por una caída de tensión), avisa por el canal 1 y el bloque vuelve a pedir los informes.
