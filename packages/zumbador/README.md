# Zumbador / Buzzer

Tonos, notas y melodías para un zumbador **pasivo**. Los sonidos se tocan en segundo plano: el robot sigue leyendo sensores y moviéndose mientras suena. Arduino (C++) y MicroPython (ESP32), sin bibliotecas externas.

Tones, notes and melodies for a **passive** buzzer. Sounds play in the background: the robot keeps reading sensors and moving while it sounds. Arduino (C++) and MicroPython (ESP32), without external libraries.

## Bloques / Blocks

- **tocar tono en pin … frecuencia ( ) Hz**: suena sin parar (31–20000 Hz) hasta «detener sonido».
- **tocar nota … durante ( ) ms en pin …**: Do4–Si5 con sostenidos; la duración acepta variables (0–60000 ms).
- **tocar melodía … en pin …**: inicio, éxito, error o alarma (4–6 notas cortas).
- **detener sonido en pin …**: calla y cancela la nota o melodía.
- **sonando en pin …**: verdadero mientras suena algo en ese pin.

- **play tone on pin … frequency ( ) Hz**: sounds non-stop (31–20000 Hz) until “stop sound”.
- **play note … for ( ) ms on pin …**: C4–B5 with sharps; the duration accepts variables (0–60000 ms).
- **play melody … on pin …**: start, success, error or alarm (4–6 short notes).
- **stop sound on pin …**: silences and cancels the note or melody.
- **sounding on pin …**: true while something is sounding on that pin.

**Las notas y melodías no esperan.** Para tocar una canción nota por nota, pon «esperar hasta que no (sonando en pin …)» después de cada nota. Un sonido nuevo en el mismo pin reemplaza al anterior.

**Notes and melodies do not wait.** To play a song note by note, put “wait until not (sounding on pin …)” after each note. A new sound on the same pin replaces the previous one.

## Cableado / Wiring

Zumbador pasivo entre el pin y GND. Un zumbador **activo** (con oscilador) solo suena a su propia frecuencia y no toca notas. Si consume más de 20 mA, usa un transistor.

Passive buzzer between the pin and GND. An **active** buzzer (with an oscillator) only sounds at its own frequency and does not play notes. If it draws more than 20 mA, use a transistor.

## Cómo funciona / How it works

- Arduino: `tone()`/`noTone()`; la melodía avanza en cada vuelta del programa (`poll`), también durante las esperas. En UNO y Nano, `tone()` usa el Timer2: mientras suena, el PWM de los pines 3 y 11 no funciona.
- MicroPython ESP32: `machine.PWM` al 50 % y un `machine.Timer(0)` cada 10 ms que cambia de nota. No uses el Timer 0 en otro bloque.

- Arduino: `tone()`/`noTone()`; the melody advances on every program loop (`poll`), also during waits. On UNO and Nano, `tone()` uses Timer2: while it sounds, PWM on pins 3 and 11 does not work.
- MicroPython ESP32: `machine.PWM` at 50 % and a `machine.Timer(0)` every 10 ms that changes the note. Do not use Timer 0 in another block.

## Ejemplo / Example

`examples/sonidos.blocks.json` (UNO, zumbador en D8): melodía de inicio, dos notas encadenadas y un tono de 300 ms. / start melody, two chained notes and a 300 ms tone.

Experimental hasta probarlo en hardware. / Experimental until tested on hardware.
