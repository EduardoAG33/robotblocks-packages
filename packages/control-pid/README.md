# Control PID / PID control

Controladores PID con nombre para seguir una línea, una pared o un ángulo. Funciona en Arduino (C++), MicroPython (ESP32) y Pybricks (SPIKE y EV3), sin bibliotecas externas.

Named PID controllers to follow a line, a wall or an angle. Works on Arduino (C++), MicroPython (ESP32) and Pybricks (SPIKE and EV3), without external libraries.

## Bloques / Blocks

- **configurar PID** (en «al iniciar»): una fila por PID con nombre, Kp, Ki, Kd y límite. + y − añaden o quitan PID (1–8).
- **actualizar PID … con error ( )**: una vez por vuelta del bucle. El error lo armas tú con tus sensores, por ejemplo `posición − 3500`, `láser izq − láser der` u `objetivo − ángulo`.
- **salida de PID …**: el último resultado, entre −límite y +límite. Se puede usar varias veces sin recalcular: `base + salida` en un motor y `base − salida` en el otro.
- **P / I / D / error de PID …**: cada parte del último cálculo, para ajustar en el monitor.
- **reiniciar PID …**: borra la I acumulada, el error anterior y la salida (al empezar, después de un giro o al cambiar de objetivo).
- **cambiar PID … a Kp ( ) Ki ( ) Kd ( )**: cambia las constantes con variables sin reiniciar; el límite no cambia.

- **configure PID** (in “when started”): one row per PID with name, Kp, Ki, Kd and limit. + and − add or remove PIDs (1–8).
- **update PID … with error ( )**: once per loop. You build the error from your sensors, for example `position − 3500`, `left laser − right laser` or `target − angle`.
- **output of PID …**: the latest result, between −limit and +limit. It can be used several times without recomputing: `base + output` on one motor and `base − output` on the other.
- **P / I / D / error of PID …**: each part of the latest computation, for tuning on the monitor.
- **reset PID …**: clears the accumulated I, the previous error and the output (at the start, after a turn or when the target changes).
- **set PID … to Kp ( ) Ki ( ) Kd ( )**: changes the constants from variables without resetting; the limit stays the same.

## Cálculo / Computation

`salida = Kp·error + Ki·∫error·dt + Kd·Δerror/dt`, limitada a ±límite. `dt` es el tiempo real entre actualizaciones en segundos (`micros()` en Arduino, `time.ticks_us()` en MicroPython y `StopWatch` en Pybricks), así que cambiar la duración de la vuelta no cambia el efecto de Ki y Kd.

- La primera actualización (y la primera después de reiniciar) usa D = 0 y no suma I.
- La I y la D se recalculan cuando pasan 5 ms o más desde la última vez; en vueltas más cortas solo cambia la P. Así la D no se dispara con vueltas de microsegundos.
- Anti-windup: la integral se limita para que la I sola nunca supere el límite.
- Con Kp positivo, un error positivo da una salida positiva. Si el robot corrige al revés, invierte el error (o el signo de las constantes).

`output = Kp·error + Ki·∫error·dt + Kd·Δerror/dt`, limited to ±limit. `dt` is the real time between updates in seconds (`micros()` on Arduino, `time.ticks_us()` on MicroPython and `StopWatch` on Pybricks), so changing the loop duration does not change the effect of Ki and Kd.

- The first update (and the first after a reset) uses D = 0 and adds no I.
- I and D are recomputed when 5 ms or more have passed since the last time; in shorter loops only P changes. This keeps D from spiking with microsecond loops.
- Anti-windup: the integral is limited so that I alone never exceeds the limit.
- With a positive Kp, a positive error gives a positive output. If the robot corrects the wrong way, invert the error (or the sign of the constants).

## Pasar constantes «por vuelta» / Converting “per loop” constants

Si tu programa anterior multiplicaba sin tiempo (`Kd × (error − error anterior)` con una vuelta de T segundos), usa `Kd = Kd por vuelta × T` y `Ki = Ki por vuelta ÷ T`. Ejemplo con vueltas de 10 ms: Kd 2 por vuelta → Kd 0.02; Ki 0.001 por vuelta → Ki 0.1. Kp no cambia.

If your previous program multiplied without time (`Kd × (error − previous error)` with a loop of T seconds), use `Kd = per-loop Kd × T` and `Ki = per-loop Ki ÷ T`. Example with 10 ms loops: per-loop Kd 2 → Kd 0.02; per-loop Ki 0.001 → Ki 0.1. Kp does not change.

## Errores / Errors

- Usar un PID cuyo «configurar PID» todavía no corrió: «Configura el PID al iniciar».
- Límite 0 o negativo: «El límite del PID debe ser mayor que 0».
- Un error o una constante que no es un número finito detiene el programa como los demás bloques.

- Using a PID whose “configure PID” has not run yet: “Configure the PID at start”.
- A limit of 0 or below: “The PID limit must be greater than 0”.
- An error or a constant that is not a finite number stops the program like the other blocks.

Experimental hasta probarlo en un robot. / Experimental until tested on a robot.
