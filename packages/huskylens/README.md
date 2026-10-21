# HuskyLens · Arduino/C++ experimental

Cámara **DFRobot HUSKYLENS v1, SEN0305**, pantalla 320 × 240. Paquete
`org.robotblocks.huskylens` v1.1.0, categoría HuskyLens (`#247BA0`).
Implementación propia del protocolo binario documentado; solo Wire y HardwareSerial,
sin bibliotecas de DFRobot o Adafruit. No incluye plantillas MicroPython/Pybricks.
Sin prueba física; no se anuncia compatibilidad con HuskyLens 2.

## Cableado y preparación

Alimenta VCC con **3.3–5 V** y conecta GND con la tierra de la tarjeta.

| Modo | HuskyLens | Tarjeta                 |
| ---- | --------- | ----------------------- |
| I2C  | T         | SDA (UNO/Nano A4)       |
| I2C  | R         | SCL (UNO/Nano A5)       |
| UART | T (TX)    | RX del UART de hardware |
| UART | R (RX)    | TX del UART de hardware |

En la cámara abre **Ajustes → Protocolo** (General Settings → Protocol Type):
selecciona **I2C** para el primer modo o **Serial 9600** para UART.
I2C usa dirección fija **0x32**, bus oficial de la tarjeta y reloj de 100 kHz.
La cámara recibe frames por Wire y responde con requestFrom; comparte el guard
`rb_wire_begin` con I2C, TCS34725 y BNO055. No necesita los helpers de registros
`rb_i2c_read/write`: la cámara intercambia tramas, no registros.

En UNO R3/Nano el UART de hardware comparte la consola USB: **usa I2C**.
GIGA, Teensy, UNO R4 y XIAO seleccionan Serial1…Serial8 según el pinout disponible;
RX/TX deben coincidir con el mapa oficial. No se usa SoftwareSerial.
El UART funciona a **9600 8N1**; ESP32 recibe también los pines en begin.

Selecciona reconocimiento de color y enseña el color con el **botón de aprendizaje**
de la cámara, apuntando al objeto; el primer objeto aprendido recibe ID 1.
Activa el aprendizaje múltiple en el algoritmo si necesitas IDs adicionales.
Los IDs pertenecen al algoritmo elegido. Cambiar algoritmo vacía la caché local.

## Bloques

La paleta sigue la de Mind+ para HuskyLens. «Cuadro» es lo que la cámara marca
con un rectángulo (color, objetos, caras, etiquetas) y «flecha» lo de seguimiento
de líneas.

Conexión y algoritmo:

- «configurar HuskyLens por I2C SDA [pin] SCL [pin]»
- «configurar HuskyLens por UART [n] RX [pin] TX [pin]»
- «cambiar algoritmo de HuskyLens a [algoritmo]»
- «actualizar HuskyLens»

Lecturas del último fotograma:

- «total de IDs aprendidos»
- «cantidad de objetos detectados»
- «¿hay [cuadro/flecha] en pantalla?»
- «[propiedad] del [cuadro/flecha] más cercano al centro»
- «¿el ID [n] está aprendido?»
- «¿el ID [n] ([cuadro/flecha]) está en pantalla?»
- «[propiedad] del ID [n] ([cuadro/flecha])»
- «cantidad de [cuadro/flecha]»
- «[propiedad] del [cuadro/flecha] número [n]»
- «cantidad del ID [n] ([cuadro/flecha])»
- «[propiedad] del ID [n] ([cuadro/flecha]) número [n]»

Propiedades: ID, X centro / X origen, Y centro / Y origen, ancho / X destino y
alto / Y destino; la segunda opción vale para flechas. En «más cercano al centro»
la distancia se mide a (160, 120) y, para flechas, desde el punto medio.

Acciones en la cámara:

- «aprender el ID [n] una vez» y «olvidar lo aprendido del algoritmo actual»
  (esperan OK hasta 2 s y descartan el fotograma guardado)
- «nombrar el ID [n] como [texto]»
- «escribir [texto] en la pantalla de HuskyLens en x [n] y [n]»
- «borrar textos de la pantalla de HuskyLens»
- «guardar [foto/captura de pantalla] en la tarjeta SD» (espera OK hasta 5 s)
- «[guardar/cargar] los datos del algoritmo como modelo [n] de la SD»
  (espera OK hasta 5 s; cargar descarta el fotograma guardado)

Los tres bloques de la v1.0.0 («¿HuskyLens ve el ID [n]?», «[eje] del ID [n]» y
«[eje] de la flecha ID [n]») ya no aparecen en la paleta, pero los proyectos que
los usan se siguen abriendo y generan el mismo código.

Algoritmos: reconocimiento de color (4), seguimiento de líneas (3), reconocimiento
de etiquetas (5), reconocimiento de objetos (2), seguimiento de objetos (1),
reconocimiento facial (0), clasificación de objetos (6). Menús, etiquetas y tooltips
incluyen traducción inglesa.

Coloca la configuración en **al iniciar**, fuera de Mis Bloques. Envía knock
(0x2C) cada 100 ms hasta RETURN_OK; cede a otros procesos y falla con rb_fail a los
2 s si la cámara no responde. Después, cambiar algoritmo (0x2D) espera OK hasta
2 s; actualizar envía **una sola petición 0x20** y espera hasta 500 ms.
Usa un solo proceso para comunicar con la cámara; una transacción simultánea
produce un error. Otros procesos pueden leer la caché del último frame completo.

## Lecturas y límites

«Actualizar» valida cabecera, longitud y checksum y recoge INFO (0x29), bloques
(0x2A) y flechas (0x2B). Las cinco palabras de resultados son uint16 little-endian.
Conserva **los primeros 10 resultados**, con dos arrays fijos (último frame y frame
en recepción, 220 bytes en AVR). Consume también los resultados adicionales para
terminar la respuesta. «Cantidad» devuelve el total anunciado por la cámara,
incluidos bloques/flechas sin aprender; puede superar 10. Las lecturas por ID
solo encuentran resultados entre los 10 conservados.

Los reporters **no hacen nuevas peticiones**. Sin actualizar usan el último frame;
antes del primer actualizar está vacío (cantidad 0, visto falso y coordenadas −1).
Un frame incompleto o corrupto no sustituye el último frame completo y termina
con un fallo visible si vence el plazo. Si hay varios objetos del mismo ID,
los reporters devuelven el primero del tipo solicitado (bloque o flecha).

**ID 0 en los bloques significa cualquier objeto aprendido (ID ≥ 1)**. El valor
0 del protocolo identifica objetos sin aprender, que no cuentan como vistos para
este comodín. Los IDs aceptados son enteros 0…65535. Las coordenadas devuelven
**−1 cuando el ID no está presente**, también si solo hay una flecha y se pide
un bloque, o viceversa.

Texto: máximo **19 bytes**, x entero 0…320 e y entero 0…240. La cámara conserva
hasta 10 textos y reemplaza el de la misma posición. El payload 0x34 contiene
longitud, bandera x (0xFF si x ≥ 255), x % 255, y, y los bytes de texto;
**x no es un uint16 little-endian en este comando**. No hay terminador NUL.
No se espera un OK para los comandos 0x34/0x35. Los límites se validan también
para entradas dinámicas; no hay String ni heap en los buffers de protocolo.

Ejemplo en la app: `examples/uno-huskylens-colores.blocks.json`: UNO por I2C,
reconocimiento de color; actualizar, imprimir x del ID 1 o −1 y esperar 100 ms.

## Fuentes oficiales

- [Protocolo HUSKYLENS v1 de DFRobot](https://gitee.com/dfrobot/HUSKYLENSArduino/blob/master/HUSKYLENS%20Protocol.md).
- [Texto personalizado en SEN0305](https://wiki.dfrobot.com/sen0305/docs/22758).
- [Guía de HUSKYLENS SEN0305](https://wiki.dfrobot.com/HUSKYLENS_V1.0_SKU_SEN0305_SEN0336).

Las pruebas de generación y bus simulado no certifican comunicación física ni
compilación en todos los cores. MicroPython y HuskyLens 2 quedan para otra fase.
