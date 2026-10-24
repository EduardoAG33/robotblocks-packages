# Filtros / Filters

## Español

Extensión experimental 1.0.0, sin hardware, para Arduino, MicroPython y Pybricks. Autor: Los Grises · GreyForge. Requiere GreyForge 0.4.0 o posterior.

Configura al iniciar 1–8 filas por bloque con nombre único, tipo y parámetro. Las referencias de los demás bloques seleccionan la fila por nombre, como Control PID; varios bloques de configuración usan offsets independientes.

| Tipo           | Parámetro           | Resultado                                                   |
| -------------- | ------------------- | ----------------------------------------------------------- |
| Promedio móvil | Ventana entera 1–15 | Media de las últimas lecturas disponibles                   |
| Mediana        | Ventana entera 1–15 | Valor central; con cantidad par, media de los dos centrales |
| Exponencial    | α de 0 a 1          | α × lectura + (1−α) × último                                |

«Filtrar» agrega una lectura y devuelve el resultado de forma síncrona. Promedio y mediana solo usan las muestras recibidas; la primera lectura inicializa el exponencial (incluso con α = 0). «Último valor» no agrega muestras. «Reiniciar» vacía las muestras y deja el último valor en 0. Ventanas fraccionarias, cero, más de 15 y alfas fuera de rango generan rb_fail traducido; lectura no finita también falla.

Ejemplo: configurar «distancia», mediana, 3; filtrar sucesivamente 10, 100 y 11 da 10, 55 y 11. Cambiar a exponencial α = 0.5 y leer 10, 14 da 10, 12. Cada uso de «filtrar» agrega una muestra: guarda el resultado si lo usarás varias veces por vuelta.

Arduino usa arreglos fijos de 15 floats por filtro y un temporal de 15 para ordenar, sin malloc. Python usa listas acotadas a 15. La prueba de `pruebas/logica.json` se ejecuta en MicroPython, SPIKE y EV3 y compila en Arduino. Ejemplo: `examples/sensor-suave.blocks.json` (UNO, mediana de 5 lecturas de A0).

## English

Experimental hardware-free 1.0.0 extension for Arduino, MicroPython and Pybricks, by Los Grises · GreyForge. Requires GreyForge 0.4.0 or later.

Configure 1–8 uniquely named rows per block at start, with type and parameter. Other blocks select a named row as in Control PID; separate setup blocks have independent offsets. Moving average and median require an integer window 1–15; exponential requires α in 0–1. Invalid parameters fail with translated messages.

Filter synchronously inserts one reading and returns its result. Moving average and median use only samples already received; an even median averages its middle pair. Exponential computes α × reading + (1−α) × previous and initializes from the first reading, including α = 0. Last value inserts no sample. Reset clears samples and sets the last value to 0. Non-finite readings fail.

Example: median window 3 with readings 10, 100, 11 returns 10, 55, 11. Exponential α = 0.5 with 10, 14 returns 10, 12. Each filter call inserts a sample; save its result when reusing it in a loop.

Arduino uses fixed arrays of 15 floats per filter and a 15-float sorting temporary, with no malloc. Python lists are bounded to 15 samples. Generation and runtime verification on all targets remain pending.
