# Visión OpenMV / OpenMV Vision

Bloques de visión para la tarjeta **OpenMV Cam H7**: manchas de color, línea, AprilTags y QR, el LED de la cámara y el envío de resultados al GIGA por UART. Genera MicroPython que usa los módulos `sensor` y `pyb` del firmware de OpenMV.

Vision blocks for the **OpenMV Cam H7** board: color blobs, line, AprilTags and QR, the camera LED and sending results to the GIGA over UART. It generates MicroPython that uses the OpenMV firmware's `sensor` and `pyb` modules.

## Bloques / Blocks

- **iniciar cámara** (en «al iniciar»): a color o en grises, 320×240 o 160×120, y luz fija (recomendada para colores) o automática. Tarda medio segundo.
- **tomar foto**: una vez por vuelta. Los bloques «buscar» trabajan sobre la última foto.
- **buscar color …** (rojo, verde, azul, amarillo, negro, blanco o plateado) y **buscar color LAB …** con tus propios umbrales.
- **¿se encontró el color?**, **cantidad de manchas** y **(dato) de la mancha más grande**: X desde el centro (negativa a la izquierda; sirve directo como error de un PID), X e Y del centro, ancho, alto, área y ángulo.
- **buscar línea negra/blanca** y **(dato) de la línea**: ángulo (0 = recta, positivo = a la derecha), desplazamiento en la fila del medio y calidad (0 = no hay línea).
- **buscar AprilTags** y **(dato) del AprilTag más grande** (ID, X, Y, giro); **buscar código QR** y **texto del código QR**.
- **fotos por segundo** y **LED de la cámara** (rojo, verde, azul, blanco o apagado).
- **configurar envío al GIGA por UART 3** y **enviar al GIGA mensaje tipo (n) con datos …**: manda `tipo:dato1,dato2*CC` con verificación, el formato que leen «¿llegó un mensaje?», «tipo del mensaje» y «dato (n)» de la extensión UART en el GIGA.

- **start camera** (in “when started”): color or grayscale, 320×240 or 160×120, and fixed light (recommended for colors) or automatic. Takes half a second.
- **take picture**: once per loop. The “find” blocks work on the latest picture.
- **find color …** (red, green, blue, yellow, black, white or silver) and **find LAB color …** with your own thresholds.
- **was the color found?**, **number of blobs** and **(data) of the largest blob**: X from the center (negative to the left; works directly as a PID error), center X and Y, width, height, area and angle.
- **find black/white line** and **(data) of the line**: angle (0 = straight, positive = to the right), offset on the middle row and quality (0 = no line).
- **find AprilTags** and **(data) of the largest AprilTag** (ID, X, Y, rotation); **find QR code** and **QR code text**.
- **frames per second** and **camera LED** (red, green, blue, white or off).
- **set up sending to the GIGA on UART 3** and **send to the GIGA message type (n) with data …**: sends `type:data1,data2*CC` with a checksum, the format read by “did a message arrive?”, “message type” and “data (n)” of the UART extension on the GIGA.

Los colores predefinidos son aproximados y dependen de la luz de la pista. Si fallan, abre OpenMV IDE, usa **Herramientas → Visión → Editor de umbrales** y copia los seis números en «buscar color LAB».

The predefined colors are approximate and depend on the field lighting. If they fail, open OpenMV IDE, use **Tools → Machine Vision → Threshold Editor** and copy the six numbers into “find LAB color”.

## Ejemplo Rescue Line / Rescue Line example

- `examples/rescue-openmv.blocks.json` (OpenMV): busca verde y, si no hay, plateado. Manda `1:x,área` (verde), `2:x,área` (plateado) o `0:0` (nada), y prende el LED del color encontrado.
- `examples/rescue-giga.blocks.json` (GIGA, UART 1 en D0/D1 a 19200): recibe los mensajes e imprime lo que vio la cámara.

- `examples/rescue-openmv.blocks.json` (OpenMV): looks for green and, if there is none, silver. Sends `1:x,area` (green), `2:x,area` (silver) or `0:0` (nothing), and turns on the LED of the color found.
- `examples/rescue-giga.blocks.json` (GIGA, UART 1 on D0/D1 at 19200): receives the messages and prints what the camera saw.

## Pruebas / Tests

`pruebas/simulados/` trae una cámara falsa (`sensor.py`, `pyb.py`) para ejecutar la lógica en la computadora: la mancha más grande, el ángulo y desplazamiento de la línea, el AprilTag, el QR, el LED y el mensaje exacto con su checksum. Corre con `probar-extension.mjs … --con package-catalog/packages/openmv-cam-h7`. Falta probar con la cámara real.

`pruebas/simulados/` has a fake camera (`sensor.py`, `pyb.py`) to run the logic on the computer: the largest blob, the line angle and offset, the AprilTag, the QR, the LED and the exact message with its checksum. Run it with `probar-extension.mjs … --con package-catalog/packages/openmv-cam-h7`. It still needs testing with the real camera.
