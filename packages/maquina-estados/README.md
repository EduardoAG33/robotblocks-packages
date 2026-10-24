# Máquina de estados / State machine

Estados con nombre para ordenar lo que hace un robot: «esperando», «siguiendo línea», «rescate»… En vez de muchas variables sueltas, el programa siempre está en un estado, cambia de uno a otro y cada rama del «por siempre» se ocupa de uno. Funciona en Arduino (C++), MicroPython (ESP32) y Pybricks (SPIKE y EV3), sin bibliotecas externas.

Named states to organize what a robot does: “waiting”, “following the line”, “rescue”… Instead of many loose variables, the program is always in one state, changes from one to another and each branch of the “forever” handles one. Works on Arduino (C++), MicroPython (ESP32) and Pybricks (SPIKE and EV3), without external libraries.

## Bloques / Blocks

- **configurar estados** (en «al iniciar»): una fila por estado con su nombre; + y − añaden o quitan estados (1–16). El robot empieza en el primero.
- **cambiar a estado …**: pasa al estado elegido. El actual se vuelve el anterior y el tiempo en el estado vuelve a 0. Si ya está en ese estado no hace nada.
- **estado actual/anterior es …**: condición para un «si». Lo normal es un «si» por estado dentro de «por siempre».
- **acaba de entrar al estado …**: verdadero **una sola vez** después de entrar (también al arrancar, en el primer estado). Sirve para lo que se hace una vez: parar motores, reiniciar un PID, imprimir.
- **ms en el estado actual**: milisegundos desde el último cambio. Ejemplo: si lleva más de 3000 ms buscando la línea, cambiar a «perdido».
- **nombre del estado actual/anterior**: texto para imprimir en el monitor. Vacío si todavía no hubo estado anterior.

- **set up states** (in “when started”): one row per state with its name; + and − add or remove states (1–16). The robot starts in the first one.
- **change to state …**: goes to the chosen state. The current one becomes the previous one and the time in the state goes back to 0. If it is already in that state it does nothing.
- **current/previous state is …**: condition for an “if”. Usually one “if” per state inside “forever”.
- **just entered state …**: true **only once** after entering (also at start, in the first state). Use it for things done once: stop motors, reset a PID, print.
- **ms in the current state**: milliseconds since the last change. Example: if it has been looking for the line for more than 3000 ms, change to “lost”.
- **name of the current/previous state**: text to print on the monitor. Empty if there was no previous state yet.

## Ejemplo / Example

`examples/robot-por-tiempo.blocks.json` (Arduino UNO, sin cables): espera 1 s, «avanza» 2 s, «gira» 0.5 s y vuelve a empezar, imprimiendo cada cambio en el monitor. Cambia los «imprimir» por tus bloques de motores.

`examples/robot-por-tiempo.blocks.json` (Arduino UNO, no wiring): waits 1 s, “drives” 2 s, “turns” 0.5 s and starts again, printing each change on the monitor. Replace the “print” blocks with your motor blocks.

## Detalles / Details

- «acaba de entrar» se consume: si dos bloques lo preguntan para el mismo estado, solo el primero recibe verdadero. Si nadie lo pregunta, sigue pendiente hasta el siguiente cambio de estado.
- Los estados se guardan por número (el orden de las filas); renombrar una fila actualiza los bloques que la usan.
- Máximo 16 estados en total; más da el error «Máximo 16 estados».

- “just entered” is consumed: if two blocks ask about the same state, only the first gets true. If nobody asks, it stays pending until the next state change.
- States are stored by number (the order of the rows); renaming a row updates the blocks that use it.
- At most 16 states in total; more gives the error “At most 16 states”.

Experimental hasta probarlo en un robot. Las pruebas de `pruebas/` corren con `scripts/probar-extension.mjs` (ver CREAR_EXTENSIONES.md). / Experimental until tested on a robot. The tests in `pruebas/` run with `scripts/probar-extension.mjs` (see CREAR_EXTENSIONES.md).
