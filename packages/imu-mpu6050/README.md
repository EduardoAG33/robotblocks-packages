# IMU MPU6050

Extensión **experimental** para Arduino/C++ y MicroPython, con Wire/I2C directo y sin librerías externas. Pendiente de prueba física. Está basada en la extensión de Mind+ del equipo WRO Arath, licencia MIT («MPU6050 - Bloques para alumnos», versión 1.0.1). Las plantillas RobotBlocks están escritas para su generador declarativo; se conserva el comportamiento de calibración, zona muerta y sentido del giro de la referencia.

## Bloques

- **configurar IMU MPU6050 SDA [pin] SCL [pin] dirección [0x68 / 0x69]**: en «al iniciar». Comprueba WHO_AM_I (registro 0x75, identidad 0x68), despierta el sensor en 0x6B y configura filtro 0x03, acelerómetro ±2 g y giroscopio ±250 °/s, como la referencia (16384 LSB/g y 131 LSB/(°/s)).
- **calibrar giroscopio MPU6050 con [n] muestras (no mover)**: 1–600 muestras, 600 por defecto; promedia el offset Z y pone ambos giros a 0. Mantén quieto el robot.
- **zona muerta del giroscopio [n] grados/s**: 0–250, 0.35 por defecto; tasas cuya magnitud es menor que el umbral se consideran 0.
- **sentido del giro [normal (Z arriba) / invertido]**: normal invierte Z para derecha positiva con Z apuntando arriba. Comprueba el signo y cambia a invertido si lo requiere el montaje.
- **ángulo de giro**: −180…180 grados, derecha positiva; redondeado a 0.1°.
- **ángulo de giro acumulado**: sin límite de vueltas; tres vueltas a la derecha = +1080°, a la izquierda = −1080°.
- **reiniciar ángulo de giro**: pone ambos giros a 0 y conserva el offset.
- **inclinación [adelante/atrás · izquierda/derecha]**: grados desde el acelerómetro, valores de menú "2" y "1" como BNO055; cabeceo atan2(−x, √(y²+z²)) y alabeo atan2(y,z). El movimiento/las vibraciones alteran esta estimación.
- **aceleración [x/y/z] en m/s²**: incluye gravedad.
- **velocidad de giro [x/y/z] en grados/s**: zona muerta aplicada, offset calibrado solo en Z; el sentido elegido se aplica a Z.

Los nombres de giro, reinicio e inclinación coinciden con BNO055/BNO085. Los IDs pertenecen a cada paquete; al cambiar sensor sustituye sus bloques por los equivalentes.

## Lecturas y tiempo real

Cada lector llama a una actualización pequeña: una ráfaga de 14 bytes actualiza aceleración, velocidad y giro Z usando el tiempo real transcurrido (micros en Arduino; ticks_us/ticks_diff en MicroPython, incluyendo desbordamiento). La primera lectura fija la base temporal; reinicio y calibración fijan una base nueva. No se limita el giro acumulado ni se descarta un intervalo por superar 0.20 s. El ángulo envuelto se deriva del acumulado.

**Lee cualquier bloque IMU al menos cada ~0.5 s mientras gira; se recomiendan 10–50 ms.** No hay timers ni interrupciones: una lectura espaciada estima todo el intervalo con la velocidad actual y no puede reconstruir cambios de velocidad o vueltas ocurridas íntegramente entre lecturas. No introduzcas esperas largas durante el recorrido; mide dentro del bucle. La IMU no tiene magnetómetro ni fusión de yaw: deriva, y calibrarla quieta al comenzar es esencial. No se promete precisión de 1080° sin prueba física.

Configuración y calibración: espera 100 ms tras despertar; la calibración espera 300 ms para asentarse y recoge una muestra cada al menos 3 ms. En **Arduino** son cooperativas: otros procesos continúan y las instrucciones terminan cuando están listas (no se permiten en funciones). En **MicroPython** esperan en el mismo bloque (como la BNO055): los otros procesos se detienen mientras calibra. Durante calibración se suspende la acumulación y al finalizar se reinicia.

## Conexiones y ejemplo

- GND común; SDA/SCL al bus oficial de la tarjeta. UNO/Nano: A4/A5. AD0 a GND → 0x68; AD0 alto → 0x69 (WHO_AM_I sigue siendo 0x68).
- Alimentación y niveles según tu módulo; el chip trabaja a 3.3 V. Comprueba regulador y adaptación de nivel antes de conectar un módulo a una UNO de 5 V.
- Los sensores con los mismos SDA/SCL comparten los helpers rb_i2c y un solo inicio rb_wire_begin. Estado fijo pequeño, sin asignación dinámica en el driver.
- SDA/SCL empiezan vacíos como BNO055: main no admite los tokens @i2c.sda/@i2c.scl.
- Ejemplo: [UNO: tres vueltas](../../../examples/uno-mpu6050-tres-vueltas.blocks.json). Calibra, imprime el acumulado y al llegar a |giro| ≥1080 imprime «fin» y detiene el programa. No configura motores: gira el sensor o añade tu control de movimiento.

Referencia local: artifacts/referencia-mpu6050/ en la aplicación. Crédito: **Equipo WRO Arath — MIT**. Configuración y escalas se verifican contra ese código. Pruebas de simulación no certifican cableado, signo ni precisión del hardware.
