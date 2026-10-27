# Encoder

Hasta **6 encoders de cuadratura con nombre**, independientes del driver de motores. Arduino/C++ y MicroPython en ESP32, sin instalar librerías. Experimental: pendiente de prueba física. Pybricks no se incluye: SPIKE y EV3 ya miden grados.

En **al iniciar**, configura A/B, PPR del eje del motor **por canal**, reducción de la caja, diámetro en mm y sentido normal/invertido. ×4 interrumpe en A y B; ×2 solo en A (B sigue siendo entrada). Ambos llevan `INPUT_PULLUP`/`Pin.PULL_UP`. No repitas nombres ni pines; renombrar una fila actualiza sus lectores. Cuentas por vuelta de la rueda = **PPR × reducción × 4 o 2**. La reducción y el diámetro admiten decimales, por ejemplo 9.7:1.

Los bloques leen cuentas con signo, vueltas de rueda, distancia en cm/mm y velocidad en cm/s o rpm de rueda. Reiniciar uno o todos pone también a cero la muestra de velocidad. La velocidad se recalcula al consultar después de al menos 20 ms; dentro de ese intervalo conserva el último valor. No usa esperas ni bloquea otros procesos.

## Motor y cableado

Conecta GND del encoder a GND de la tarjeta, A/B a los pines elegidos y la alimentación según su ficha. Identifica los cables por la ficha del motor, no solo por el color. El driver alimenta el motor; esta extensión solo lee sus sensores.

Busca los datos de tu variante en la etiqueta/ficha: por ejemplo **JGA25-370, 11 PPR, 1:30** → PPR 11 y reducción 30; **N20, 7 PPR, 1:100** → 7 y 100. Son ejemplos de variantes; el nombre de la familia por sí solo no determina PPR. Comprueba si el fabricante ya anuncia cuentas ×4 o después de la caja para no multiplicar dos veces. Marca la rueda, gírala **10 vueltas a mano** y comprueba que «vueltas del encoder» marque aproximadamente +10 o −10. Si no coincide, revisa PPR/reducción; si el avance da negativo, invierte el sentido. Con rueda de 65 mm, una vuelta equivale a **20.42 cm**.

**UNO R3/Nano ATmega328P:** solo D2 y D3 admiten interrupción. Para dos encoders usa ×2: A en D2/D3 y B en otros pines; para uno en ×4 usa A D2/B D3. En otras tarjetas ambos pines deben admitir interrupción para ×4. Un pin inválido detiene el programa con un error claro.

**Señales de 5 V en Teensy, GIGA, XIAO y ESP32 (lógica 3.3 V):** adapta **cada canal A/B** con divisor apropiado, o alimenta el encoder a 3.3 V únicamente si su ficha lo permite. No conectes una salida de 5 V directamente a estas entradas. Comparte GND.

## Maze y ejemplo

Para estimar avance usa **(distancia izquierda + distancia derecha) / 2**. Para ángulo usa preferentemente la IMU: las llantas patinan al girar. Corrige la posición con los láseres contra las paredes en cada celda de **30 cm**.

Abre `examples/teensy-distancias.blocks.json`: Teensy 4.1, izquierdo A2/B3, derecho A4/B5, PPR 11, reducción 30, rueda 65 mm. Cada 200 ms imprime por serie las distancias izquierda/derecha en cm y su promedio. Ajusta el sentido de cada rueda para que ambas den positivo al avanzar.

## Verificación reproducible

Desde el catálogo: `npm test` incluye `scripts/check-encoder.py` (runtime real con pines/reloj simulados). Desde la app: `node package-catalog/scripts/probar-extension.mjs package-catalog/packages/encoder` genera los ejemplos, comprueba Python y compila Arduino con los cores instalados. Las pruebas cubren ambos modos y todas las unidades; en UNO se usa ×2 con dos encoders.

La simulación CPython sustituye Viper por una función normal y emula el acceso a enteros de 32 bits; no reproduce latencias, pérdida de flancos ni ruido eléctrico. La compilación de Viper para ESP32 y las compilaciones C++ se registran en `VALIDACION.md`. No se ha cargado en hardware.
