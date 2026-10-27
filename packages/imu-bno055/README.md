# IMU BNO055

Extensión para Arduino/C++ y MicroPython. Probada en hardware con Arduino/C++ (ver «Pruebas en hardware»). Las plantillas MicroPython están probadas en simulación, todavía no en una tarjeta. Para el **DFRobot Gravity SEN0253** (BNO055 + BMP280) u otro módulo BNO055 por I2C.

## Bloques

- **configurar IMU BNO055 SDA [pin] SCL [pin]**: en «al iniciar», con el robot quieto. Busca la IMU en 0x28 y 0x29.
- **ángulo de giro**: de -180 a 180 grados respecto al último reinicio; positivo hacia la derecha. Perfecto para girar 90° o avanzar recto con un PID.
- **ángulo de giro acumulado**: sin límite de vueltas; derecha positiva, +1080° para tres vueltas a la derecha y −1080° a la izquierda.
- **reiniciar ángulo de giro**: la dirección actual pasa a ser 0 y el giro acumulado se reinicia también.
- **inclinación [adelante/atrás / izquierda/derecha]**: en grados, útil para rampas. Monta la placa con la flecha X hacia el frente del robot.

Usa el modo **IMU** del chip (acelerómetro + giroscopio, sin brújula), así que los motores y las estructuras metálicas no alteran el giro. A cambio, puede desviarse lentamente con el tiempo: reinicia el ángulo al empezar cada recorrido.

## Conexiones

- VCC → 3.3 V o 5 V, GND → GND, SDA → SDA, SCL → SCL.
- Comparte SDA/SCL con otros sensores I2C usando los mismos pines en sus bloques «configurar».
- El barómetro BMP280 del mismo módulo aún no tiene bloques.

## Arduino/C++

Plantillas declarativas, sin código ejecutable en el paquete. Se mantienen las plantillas MicroPython. Copiar código y Descargar archivo dan un único `.ino` con el runtime integrado. Compila con arduino-cli y está probada en hardware (ver «Pruebas en hardware»).

Wire directo, sin Adafruit ni otra dependencia. Busca CHIP_ID 0xA0 en 0x28/0x29 hasta 20 veces a intervalos de 50 ms; configura modo CONFIG, espera 25 ms, modo normal/unidades grados/IMU 0x08 y espera 25 ms. Son esperas cooperativas controladas por el generador: otros procesos continúan; la instrucción configurar termina cuando el sensor está listo. No se permite esta inicialización dentro de una función; el diagnóstico pide usarla en un proceso.

Euler signed little-endian en 1/16 grados, giro relativo −180…180 con redondeo de 0.1°, reinicio de rumbo y selección de inclinación como MicroPython. Los sensores que comparten SDA/SCL usan el mismo Wire sin repetir begin ni helpers. Registros I2C comprobados; no ofrece calibración avanzada ni perfil de magnetómetro.

Fuente: [datasheet oficial Bosch BNO055](https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bno055-ds000.pdf).

## Giro acumulado (1.2.0)

En Arduino/C++ y MicroPython, cada lectura de cualquier bloque IMU lee Euler y acumula el delta de rumbo normalizado a −180…180. Ignora valores no finitos y saltos mayores de 90°; después de un salto se toma el nuevo rumbo como referencia para la siguiente lectura. La primera lectura establece la base.

**Lee algún bloque IMU al menos cada ~0.5 s mientras gira**, y más rápido si el robot puede girar más de 90° en ese tiempo. Recomendado: 10–50 ms. No hay timers ni interrupciones; no puede reconstruir vueltas entre dos lecturas. Usa el acumulado sin reiniciarlo en cada esquina: «si giro acumulado ≥ 90 · esquinas» permite contar 12 esquinas = 3 vueltas. Reinicia al comenzar el recorrido.

## Pruebas en hardware

- Arduino GIGA R1 (C++), BNO055 en `Wire1` del robot Rescue Line: ángulo de giro e inclinación (2026-10-18).
- MicroPython: generado y ejecutado en simulación; falta probarlo en una tarjeta.
