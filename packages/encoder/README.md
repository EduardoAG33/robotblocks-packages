# Encoder

Hasta **6 encoders de cuadratura**, con cualquier driver de motores. GreyForge **0.4.0**, Arduino/C++ y MicroPython ESP32, sin instalar librerías. Experimental, pendiente de hardware. Pybricks no: SPIKE y EV3 ya miden grados.

En **«al iniciar»**, agrega «configurar encoders» y sus filas con +/−: nombre, A, B, PPR del motor **por canal**, reducción y diámetro de rueda en mm. Nombres iniciales `encoder1`, `encoder2`…: renómbralos a **izquierdo/derecho**, como en el ejemplo. No repitas nombres ni pines. Renombrar una fila actualiza lectores, sentido y reinicio.

**×4** usa interrupciones en A/B; **×2** solo en A y lee B como entrada. Ambos pines llevan pull-up. Cuentas/vuelta de rueda = **PPR × reducción × 4 o 2**. Reducción y diámetro admiten decimales (por ejemplo 9.7:1). Valores iniciales: PPR 11, reducción 30, rueda 65 mm.

Después, coloca **«sentido del encoder [nombre] normal/invertido»**, antes de mover. Todos empiezan en normal. **Normalmente un lado va invertido porque los motores están en espejo.** Comprueba que ambos den positivo al avanzar. Cambiar sentido afecta los siguientes flancos, conserva las cuentas y reinicia la muestra de velocidad.

Los lectores dan cuentas con signo, vueltas de rueda, distancia en cm/mm y velocidad en cm/s o rpm de rueda. La velocidad se actualiza al consultar cada ≥20 ms; entre muestras conserva el último valor. Reiniciar uno/todos borra también la muestra de velocidad. Sin esperas bloqueantes.

## Motor y cableado

Lee la etiqueta/ficha de tu variante: **JGA25-370, 11 PPR, 1:30** → PPR 11/reducción 30; **N20, 7 PPR, 1:100** → 7/100. El nombre de familia no determina esos datos. Si ya indica cuentas ×4 o después de la caja, evita multiplicar dos veces. Marca la rueda, gírala **10 vueltas a mano** y comprueba aproximadamente +10/−10 en «vueltas». Una vuelta de rueda de 65 mm = **20.42 cm**.

Conecta GND común, A/B a sus pines y alimentación según la ficha. **Señales de 5 V hacia Teensy, GIGA, XIAO o ESP32 (3.3 V):** adapta cada canal con divisor apropiado, o alimenta el encoder a 3.3 V si lo permite su ficha. No conectes salidas de 5 V directamente.

**UNO R3/Nano:** solo D2/D3 tienen interrupción. Para dos encoders: ×2, A en D2/D3 y B en otros pines. Para uno en ×4: A2/B3. En otras tarjetas, ambos pines deben admitir interrupción para ×4.

## Distancia y ejemplo

Abre `examples/teensy-distancias.blocks.json`: **Teensy 4.1**, izquierdo A2/B3, derecho A4/B5, PPR 11, reducción 30, rueda 65 mm. Cada **200 ms** imprime por serie ambas distancias en cm y su promedio; ajusta el sentido según el montaje.

Para medir el avance usa **(izquierda + derecha) / 2**. Para ángulo, mejor la **IMU**: las llantas patinan al girar.

## Límites y pruebas

Máximo seis encoders **en total**. Configurar y sentido van directamente en «al iniciar»; no hay un diagnóstico específico de ubicación. Usar uno sin configurar da `Configura los encoders al iniciar`. Reconfigurar un slot activo da error y **no vuelve a registrar interrupciones**.

En Arduino, el contador interno es un `long` con signo de 32 bits, pero GreyForge 0.4.0 procesa los valores de los bloques como `float`: las cuentas dejan de ser exactas por encima de ±16 777 216. Reinicia los encoders entre recorridos si necesitas precisión de una cuenta.

En MicroPython (ESP32) las interrupciones son diferidas: con motores rápidos (miles de flancos por segundo) pueden perderse cuentas. Sirve para pruebas y encoders lentos; para el robot de competencia usa Arduino/C++.

`npm test` en el catálogo ejecuta la simulación. Desde la app: `node package-catalog/scripts/probar-extension.mjs package-catalog/packages/encoder`. Compilaciones, prueba de Viper, restauración Blockly y límites de la comprobación visual: **[VALIDACION.md](VALIDACION.md)**. No se ha cargado en hardware.
