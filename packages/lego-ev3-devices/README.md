# EV3: motores, sensores y ladrillo · experimental

## Bloques para EV3-G (0.4.0)

| EV3-G                         | GreyForge                                          |
| ----------------------------- | -------------------------------------------------- |
| Motor encendido a potencia    | motor encender a potencia; girar grados a potencia |
| RawMotorOn                    | motor potencia sin regular                         |
| Velocidad del motor           | velocidad del motor (grados/s)                     |
| Motor hasta atascarse         | motor girar hasta atascarse                        |
| Archivo de calibración        | guardar número, número del archivo, borrar archivo |
| Pantalla, texto en cuadrícula | pantalla escribir en fila y columna                |
| Detener programa              | detener programa                                   |

La potencia regulada usa la velocidad máxima nominal de 1050 grados/s para el motor grande y 1560 para el mediano. Se identifica por sysfs; si falla la lectura se usa 1050. La potencia sin regular usa `Motor.dc`. Las maniobras bloqueantes ceden a las demás pilas. No compartas un motor ocupado entre procesos.

Los archivos se guardan en `/home/robot/robotblocks/datos/`, con nombres de 1 a 32 letras ASCII, números, guion o guion bajo. La escritura usa un archivo temporal y renombrado; leer un archivo ausente, vacío o no numérico devuelve el valor predeterminado. La cuadrícula usa celdas de 8 × 10 píxeles y no borra la fila antes de escribir. Para detener todas las pilas se detienen también los motores. Estas funciones siguen pendientes de prueba en el EV3 real.

## I2C entre tarjetas (fase 11b)

La categoría **EV3 · I2C** permite leer registros, escribir valores y consultar el
resultado de la última operación con un dispositivo en S1..S4. Pybricks 2.0 usa
un `I2CDevice` por puerto/dirección; la dirección es de 7 bits (Nano 8 = 0x08).
Los registros 1..16 contienen dos bytes little-endian con signo; se decodifican
manualmente, restando 65536 cuando el valor es mayor o igual que 32768.
OSError o una lectura incompleta conserva el último valor bueno y marca falso el
estado, sin llamar a rb_fail. No hay reintentos ni bucles de espera propios.

Nano A4 SDA → EV3 pin 6; Nano A5 SCL → EV3 pin 5; GND común. **No conectar el pin 4
de 4.3 V al Nano.** Pull-up y tensión pendientes de confirmación física.
Ver `docs/COMUNICACION.md` de la app y `packages/i2c/README.md` para el protocolo.

27 bloques declarativos para `lego-ev3` con microSD Pybricks **2.0**.
Grupo de catálogo `actuators`, categorías de paleta Motores, Sensores y Ladrillo
(igual que SPIKE: el esquema tiene un único grupo por paquete).
Solo plantillas de texto; sin JavaScript, eval, drivers ni código ejecutado desde paquetes.

- Motor grande y mediano usan la misma clase oficial `Motor`: run, run_angle,
  run_time, stop/brake/hold, angle y reset_angle. Velocidad en grados/s;
  grados relativos; tiempo en ms. Los movimientos esperados mantienen Stop.HOLD.
- DriveBase: motores distintos, sentidos, diámetro de rueda y distancia entre
  apoyos en mm. straight/turn esperan su maniobra; drive mantiene velocidad mm/s
  y giro grados/s hasta stop (en libre según v2.0). Una base por programa.
  v2.0 no tiene use_gyro; no se ofrece esa opción.
- Color: color como texto de Color o None; reflexión y ambiente 0–100 %.
  Ultrasónico: mm, modo continuo silent=False. Infrarrojo: distancia relativa
  0–100 %, **no mm**. Tacto: booleano. Giroscopio: ángulo, velocidad y reset.
  No combines angle/reset con speed del mismo giroscopio: la API cambia el modo
  y reinicia el ángulo. El generador lo diagnostica y el runtime también lo protege.
- Ladrillo: botones; pantalla print (texto/número, desplaza líneas sin ajustar
  el ancho), clear; beep (Hz y ms); luz verde, roja, naranja o apagada.

Los procesos avanzan con un planificador de generadores. Las esperas, cada vuelta
de bucle y las maniobras ceden el turno. `_thread` solo ejecuta llamadas oficiales
de movimiento que bloquean en v2.0; el programa de bloques corre en el hilo principal.
Beep usa duración negativa (inicio sin bloqueo), espera cooperativa y duración cero
para terminar. No se requiere uasyncio ni threading ni librería externa.

No hagas que dos procesos usen un motor/base con una maniobra pendiente: se produce
RB_ERROR. Los sensores se leen de forma síncrona; el cambio de modo o Linux pueden
añadir latencia, por lo que no se garantiza tiempo real. Las funciones de usuario
siguen siendo síncronas: los bloques con espera solo se permiten en procesos.
Fallos de maniobras se trasladan al proceso; en fallo/interrupción se detienen
los motores y se espera la salida de los hilos. Una llamada atascada en el sistema
requiere el botón Atrás / terminar el proceso en el EV3.

## UART en los puertos de sensor (fase 11)

Categoría **EV3 · UART**: configurar, ¿llegó un mensaje?, dato n, cantidad de datos, tipo y los dos bloques de envío
con + y −. Mismo formato de mensajes que la extensión UART (`[tipo:]d1,d2,…[*CC]`) y las mismas funciones de Python;
la lectura usa `UARTDevice.waiting()` y `read_all()` sin bloquear. El EV3 trabaja a 3.3 V: con un Arduino de 5 V,
baja su TX con un divisor (1 kΩ en serie y 2 kΩ a GND).

Fuentes oficiales de nombres, firmas y unidades:

- [UARTDevice e iodevices v2.0](https://docs.pybricks.com/en/v2.0/iodevices.html).

- [Motores y cinco sensores EV3](https://docs.pybricks.com/en/v2.0/ev3devices.html).
- [DriveBase v2.0](https://docs.pybricks.com/en/v2.0/robotics.html).
- [EV3Brick](https://docs.pybricks.com/en/v2.0/hubs.html).
- [Port, Direction, Stop, Color y Button](https://docs.pybricks.com/en/v2.0/parameters.html).
- [wait y StopWatch v2.0](https://docs.pybricks.com/en/v2.0/tools.html).
- [Código oficial v2.0 que utiliza _thread](https://github.com/pybricks/pybricks-micropython/blob/v2.0.0/bricks/ev3dev/modules/pybricks/experimental.py).

Las pruebas con dobles no sustituyen validación física; todo sigue experimental.
