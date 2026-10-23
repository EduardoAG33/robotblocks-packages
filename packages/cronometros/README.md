# Cronómetros / Stopwatches

Varios cronómetros con nombre para medir tiempos y hacer tareas periódicas **sin «esperar»**, así el robot sigue leyendo sensores mientras tanto. Funciona en Arduino (C++), MicroPython (ESP32) y Pybricks (SPIKE y EV3), sin bibliotecas externas. El núcleo ya trae un temporizador; esta extensión agrega varios con nombre y el bloque «cada X ms».

Several named stopwatches to measure times and do periodic tasks **without “wait”**, so the robot keeps reading sensors meanwhile. Works on Arduino (C++), MicroPython (ESP32) and Pybricks (SPIKE and EV3), without external libraries. The core already has one timer; this extension adds several named ones and the “every X ms” block.

## Bloques / Blocks

- **configurar cronómetros** (en «al iniciar»): una fila por cronómetro con su nombre; + y − añaden o quitan (1–8). Todos empiezan a contar ahí.
- **reiniciar cronómetro …**: vuelve a contar desde 0.
- **tiempo del cronómetro … en ms/segundos**: el tiempo desde que se configuró o se reinició.
- **pasaron ( ) ms en cronómetro …**: verdadero desde que llega a ese tiempo hasta que lo reinicies. Sirve para límites: «si pasaron 3000 ms buscando la línea, girar».
- **cada ( ) ms con cronómetro …**: verdadero una vez cada ese tiempo. En un «si» dentro de «por siempre» hace tareas periódicas (imprimir, parpadear) sin frenar el resto. Mantiene el ritmo: si una vuelta tarda un poco más, la siguiente se acorta; si se atrasa más de un periodo completo, vuelve a contar desde ese momento. Usa un cronómetro distinto para cada tarea.

- **set up stopwatches** (in “when started”): one row per stopwatch with its name; + and − add or remove them (1–8). They all start counting there.
- **reset stopwatch …**: starts counting from 0 again.
- **time of stopwatch … in ms/seconds**: the time since it was set up or reset.
- **( ) ms passed on stopwatch …**: true from the moment it reaches that time until you reset it. Use it for limits: “if 3000 ms passed looking for the line, turn”.
- **every ( ) ms with stopwatch …**: true once every that time. In an “if” inside “forever” it runs periodic tasks (print, blink) without slowing the rest. It keeps the pace: if one loop takes a bit longer, the next one is shorter; if it falls behind by more than a full period, it counts again from that moment. Use a different stopwatch for each task.

## Ejemplo / Example

`examples/dos-tareas.blocks.json` (Arduino UNO): el LED del pin 13 parpadea cada 250 ms y cada segundo se imprime cuántas vueltas dio el «por siempre», todo en el mismo bucle y sin «esperar».

`examples/dos-tareas.blocks.json` (Arduino UNO): the LED on pin 13 blinks every 250 ms and every second it prints how many loops the “forever” ran, all in the same loop and without “wait”.

Experimental hasta probarlo en una tarjeta. / Experimental until tested on a board.
