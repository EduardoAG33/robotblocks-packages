# HuskyLens 2 · Arduino/C++ experimental

Cámara AI **DFRobot HUSKYLENS 2 (SEN0638)**, pantalla de 640 × 480. Implementación propia del protocolo publicado por DFRobot en [DFRobot_HuskylensV2](https://github.com/DFRobot/DFRobot_HuskylensV2) (licencia MIT, archivo `HuskyLens2_Protocol.md`); solo usa Wire y HardwareSerial, sin bibliotecas externas. No incluye MicroPython ni Pybricks. Para la HuskyLens 1 (SEN0305) usa la extensión **HuskyLens**.

AI camera **DFRobot HUSKYLENS 2 (SEN0638)**, 640 × 480 screen. Own implementation of the protocol published by DFRobot in [DFRobot_HuskylensV2](https://github.com/DFRobot/DFRobot_HuskylensV2) (MIT license, `HuskyLens2_Protocol.md`); it only uses Wire and HardwareSerial, no external libraries. No MicroPython or Pybricks. For HuskyLens 1 (SEN0305) use the **HuskyLens** extension.

## Conexión / Wiring

| Modo             | Cámara   | Tarjeta                                                                |
| ---------------- | -------- | ---------------------------------------------------------------------- |
| I2C (de fábrica) | SDA, SCL | SDA, SCL de la tarjeta (UNO A4/A5, GIGA D20/D21 o SDA1/SCL1 D102/D101) |
| UART             | TX, RX   | RX, TX de un UART de hardware, 115200 baudios                          |

- I2C usa la dirección fija **0x50** a 100 kHz. Para UART elige **UART** en **Ajustes del sistema → Protocolo** de la cámara.
- En el UNO los pines no dan suficiente corriente: alimenta la cámara también por su USB-C. En el robot, usa la fuente de 5 V.
- Si el «Diagnóstico I2C» muestra un dispositivo en **0x50**, es muy probable que sea la HuskyLens 2 (no una EEPROM).

- I2C uses the fixed address **0x50** at 100 kHz. For UART choose **UART** in the camera's **System settings → Protocol**.
- On the UNO the pins do not supply enough current: also power the camera through its USB-C. On the robot, use the 5 V supply.
- If “I2C diagnostics” shows a device at **0x50**, it is most likely the HuskyLens 2 (not an EEPROM).

## Bloques / Blocks

- **configurar HuskyLens 2 por I2C / UART** (en «al iniciar»): saluda a la cámara cada 200 ms hasta que conteste (máximo 5 s, mientras arranca).
- **cambiar algoritmo a …**: facial, objetos, seguimiento, color, clasificación, autoaprendizaje, manos, pose, placas, texto (OCR), líneas, emociones, etiquetas, código de barras y QR. Puede tardar unos segundos en cargar el modelo.
- **actualizar HuskyLens 2**: pide lo que ve ahora (hasta 6 resultados). Los demás bloques leen esa «foto» hasta la siguiente actualización.
- **cantidad de resultados**, **¿hay cuadro/flecha?**, **(propiedad) del cuadro/flecha más cercano al centro**, **¿el ID … está?**, **(propiedad) del ID …**.
  - Cuadros: ID, X e Y del centro, ancho y alto.
  - Flechas (seguimiento de líneas): ID, X e Y del destino, ángulo (−90 a 90, 0 = recto) y largo.
  - Si no hay resultado devuelven −1.
- **nombre / contenido del cuadro más cercano al centro** y **del ID …**: el nombre del ID (por ejemplo «persona») o lo que leyó (texto OCR, QR, código de barras, placa). Hasta 12 y 24 letras.
- **aprender lo que ve**, **último ID aprendido**, **olvidar lo aprendido**, **total de IDs aprendidos**.

- **set up HuskyLens 2 over I2C / UART** (in “when started”): greets the camera every 200 ms until it answers (at most 5 s, while it boots).
- **switch algorithm to …**: face, objects, tracking, color, classification, self-learning, hands, pose, plates, text (OCR), lines, emotions, tags, barcode and QR. Loading the model can take a few seconds.
- **update HuskyLens 2**: asks for what it sees now (up to 6 results). The other blocks read that “snapshot” until the next update.
- **number of results**, **is there a frame/arrow?**, **(property) of the frame/arrow closest to the center**, **is ID … there?**, **(property) of ID …**.
  - Frames: ID, center X and Y, width and height.
  - Arrows (line tracking): ID, target X and Y, angle (−90 to 90, 0 = straight) and length.
  - With no result they return −1.
- **name / content of the frame closest to the center** and **of ID …**: the ID name (for example “person”) or what it read (OCR text, QR, barcode, plate). Up to 12 and 24 letters.
- **learn what it sees**, **last learned ID**, **forget what it learned**, **total learned IDs**.

Las peticiones esperan la respuesta de forma cooperativa (`waitUntil`): los demás procesos siguen corriendo. Usa un solo proceso para hablar con la cámara.

Requests wait for the answer cooperatively (`waitUntil`): the other processes keep running. Use a single process to talk to the camera.

## Ejemplo / Example

`examples/seguir-linea.blocks.json` (GIGA, cámara en SDA1/SCL1 = `Wire1`): abre el seguimiento de líneas y muestra el ángulo de la flecha en el monitor.

`examples/seguir-linea.blocks.json` (GIGA, camera on SDA1/SCL1 = `Wire1`): opens line tracking and shows the arrow angle on the monitor.

## Estado / Status

Compila con arduino-cli en UNO, UNO R4, GIGA, Teensy 4.0 y XIAO ESP32-S3. **Sin prueba física todavía**: el formato de tramas, la dirección y los comandos salen del documento y del código oficial de DFRobot. La versión del firmware de la cámara debe ser compatible con ese protocolo (probado en papel con el de 2025-11).

Compiles with arduino-cli on UNO, UNO R4, GIGA, Teensy 4.0 and XIAO ESP32-S3. **Not tested on hardware yet**: the frame format, address and commands come from DFRobot's official document and code. The camera firmware must match that protocol (checked on paper against the 2025-11 version).
