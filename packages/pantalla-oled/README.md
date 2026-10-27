# Pantalla OLED / OLED display

Pantallas OLED I2C de 0.96" y 1.3" (SSD1306 o SH1106, 128×64 o 128×32) para ver datos del robot en la pista sin la computadora: estado, sensores, batería. Arduino (C++) y MicroPython (ESP32), **sin bibliotecas** y sin búfer de imagen: escribe directo en la pantalla, así que en un UNO casi no usa RAM.

0.96" and 1.3" I2C OLED displays (SSD1306 or SH1106, 128×64 or 128×32) to see robot data on the field without the computer: state, sensors, battery. Arduino (C++) and MicroPython (ESP32), **without libraries** and without a frame buffer: it writes straight to the display, so on an UNO it uses almost no RAM.

## Bloques / Blocks

- **configurar pantalla OLED** (en «al iniciar»): chip, tamaño, dirección (casi siempre 0x3C) y pines SDA/SCL. Borra y enciende la pantalla. Si no responde, el programa se detiene con «No responde la pantalla OLED».
- **OLED fila ( ) mostrar ( )**: escribe desde el principio de la fila y borra lo que sobra. Es el bloque de todos los días: un número que se achica no deja restos.
- **OLED escribir ( ) en fila ( ) columna ( )**: escribe en una posición sin borrar lo demás.
- **OLED barra en fila ( ) valor ( ) de ( )**: barra de todo el ancho (batería, velocidad, un sensor).
- **OLED borrar fila ( )** y **OLED borrar pantalla**.

- **set up OLED display** (in “when started”): chip, size, address (almost always 0x3C) and SDA/SCL pins. Clears and turns on the display. If it does not answer, the program stops with “The OLED display does not answer”.
- **OLED row ( ) show ( )**: writes from the start of the row and clears the rest. The everyday block: a number that gets shorter leaves no leftovers.
- **OLED write ( ) at row ( ) column ( )**: writes at a position without clearing the rest.
- **OLED bar at row ( ) value ( ) of ( )**: full-width bar (battery, speed, a sensor).
- **OLED clear row ( )** and **OLED clear display**.

La pantalla tiene **8 filas de 16 letras** (4 filas en 128×32). Los números se muestran con hasta 2 decimales (`3`, `2.5`, `-0.25`).

The display has **8 rows of 16 letters** (4 rows on 128×32). Numbers show with up to 2 decimals (`3`, `2.5`, `-0.25`).

## Letras / Letters

Usa una fuente 5×7 propia de GreyForge: números, letras **mayúsculas** y `! " # % ' ( ) * + , - . / : ; < = > ? _ ° ¡ ¿`. Las minúsculas se ven en mayúsculas y las vocales con tilde y la ñ sin tilde (`Batería` → `BATERIA`). Otros símbolos salen como `?`.

It uses GreyForge's own 5×7 font: digits, **uppercase** letters and `! " # % ' ( ) * + , - . / : ; < = > ? _ ° ¡ ¿`. Lowercase shows as uppercase and accented vowels and ñ without the accent (`Batería` → `BATERIA`). Other symbols show as `?`.

## Cableado / Wiring

VCC a 3.3 V (o 5 V si el módulo lo admite), GND, SDA y SCL a los pines I2C de la tarjeta. Puede compartir el bus con otros sensores I2C mientras tengan otra dirección. En la GIGA, SDA1/SCL1 (D102/D101) es `Wire1`.

VCC to 3.3 V (or 5 V if the module supports it), GND, SDA and SCL to the board's I2C pins. It can share the bus with other I2C sensors as long as they have another address. On the GIGA, SDA1/SCL1 (D102/D101) is `Wire1`.

## Velocidad / Speed

Cada «fila … mostrar» manda 128 bytes (unos 3 ms a 400 kHz, 12 ms a 100 kHz). Actualiza la pantalla cada 100–200 ms (por ejemplo con la extensión Cronómetros), no en cada vuelta del seguidor de línea. «Borrar pantalla» tarda 8 veces más.

Each “row … show” sends 128 bytes (about 3 ms at 400 kHz, 12 ms at 100 kHz). Update the display every 100–200 ms (for example with the Stopwatches extension), not on every loop of the line follower. “Clear display” takes 8 times longer.

## Ejemplo / Example

`examples/tablero.blocks.json` (UNO, OLED en A4/A5 y un sensor en A0): título, contador de vueltas, lectura del sensor y una barra. / title, loop counter, sensor reading and a bar.

Pybricks (SPIKE/EV3) no está incluido. Experimental hasta probarlo con una pantalla real. / Pybricks (SPIKE/EV3) is not included. Experimental until tested with a real display.
