# Giros con IMU / Turns with IMU

Para girar a un ángulo exacto con cualquier IMU: BNO055, BNO085, MPU6050, el giroscopio del SPIKE o el del EV3. No lee la IMU ni mueve motores por su cuenta: tú conectas el «ángulo de giro» de tu IMU y usas la velocidad en tus motores, así sirve con cualquier robot. Arduino (C++), MicroPython (ESP32) y Pybricks (SPIKE y EV3).

To turn to an exact angle with any IMU: BNO055, BNO085, MPU6050, the SPIKE or the EV3 gyro. It does not read the IMU or move motors by itself: you plug in your IMU's “turn angle” and use the speed on your motors, so it works with any robot. Arduino (C++), MicroPython (ESP32) and Pybricks (SPIKE and EV3).

## Bloques / Blocks

- **velocidad para girar a ( )° desde ( )° máx ( ) mín ( )**: velocidad por el camino más corto. Es máxima con 45° o más por girar y baja al acercarse, pero nunca menos que la mínima, para que el robot no se quede atorado por la fricción. A menos de medio grado da 0. **Positiva = girar a la derecha**: motor izquierdo +velocidad, derecho −velocidad.
- **llegó a ( )° con ángulo ( )° (± ( )°) durante ( ) ms**: verdadero cuando el ángulo lleva ese tiempo dentro de la tolerancia. Así, si el robot se pasa de largo y regresa, no se detiene antes de tiempo. Con 0 ms es verdadero en cuanto entra.
- **diferencia de ( )° a ( )°**: grados que faltan por el camino más corto, entre −180 y 180 (de 350° a 10° son +20, no −340). Sirve como error para el bloque PID.
- **ángulo ( )° de −180 a 180 / 0 a 360**: lleva cualquier ángulo (por ejemplo 450°) al rango elegido (90°).

- **speed to turn to ( )° from ( )° max ( ) min ( )**: speed along the shortest way. It is maximum with 45° or more left and slows down when getting close, but never below the minimum, so friction does not leave the robot stuck. Within half a degree it gives 0. **Positive = turn right**: left motor +speed, right motor −speed.
- **arrived at ( )° with angle ( )° (± ( )°) for ( ) ms**: true when the angle has been within the tolerance for that time. So if the robot overshoots and comes back, it does not stop too early. With 0 ms it is true as soon as it enters.
- **difference from ( )° to ( )°**: degrees left the shortest way, between −180 and 180 (from 350° to 10° is +20, not −340). Use it as the error for the PID block.
- **angle ( )° in −180 to 180 / 0 to 360**: brings any angle (for example 450°) into the chosen range (90°).

## Cómo se usa / How to use it

```text
reiniciar ángulo de giro
repetir hasta que <llegó a (90)° con ángulo (ángulo de giro)° (± 2°) durante 150 ms>
    motores A (velocidad para girar a 90 desde (ángulo de giro) máx 60 mín 20)
            B (−1 × la misma velocidad)
frenar motores
```

Si el robot gira al revés, cambia el signo: motor izquierdo −velocidad y derecho +velocidad. Si oscila alrededor del ángulo, baja la máxima. Si se queda corto, sube la mínima.

If the robot turns the wrong way, swap the sign: left motor −speed and right motor +speed. If it oscillates around the angle, lower the maximum. If it stops short, raise the minimum.

Para ángulos de más de una vuelta, usa el «ángulo de giro acumulado» de la IMU como «desde» y un objetivo acumulado (por ejemplo 450).

For angles of more than one turn, use the IMU's “accumulated turn angle” as “from” and an accumulated target (for example 450).

## Ejemplo / Example

`examples/girar-90.blocks.json` (UNO, BNO055 en A4/A5 y TB6612 con motor A en D5/D7/D8 y B en D6/D9/D10): gira de 90 en 90 grados y se detiene 1 s en cada esquina. / turns 90 degrees at a time and stops for 1 s at each corner.

La lógica de la prueba de `pruebas/` se ejecuta en MicroPython, SPIKE y EV3, y el código compila en Arduino. Experimental hasta probarla en un robot. / The logic in `pruebas/` runs on MicroPython, SPIKE and EV3, and the code compiles on Arduino. Experimental until tested on a robot.
