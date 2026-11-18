# Memoria / Memory · 1.1.0

Guarda números con nombre en la memoria permanente de la tarjeta, o en una EEPROM I2C externa: la calibración del QTR sobrevive al apagar. Sin la EEPROM no necesita cableado propio, y no depende del QTR. Extensión experimental; falta probarla en tarjetas reales. No se ofrece en SPIKE ni EV3 (EV3 ya tiene archivos).

## Bloques

| Bloque                                                                    | Uso                                                                                  |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| usar EEPROM I2C para la memoria SDA [SDA] SCL [SCL] dirección [DIRECCION] | Opcional. Desde aquí los otros cuatro bloques usan la EEPROM externa (ver abajo).    |
| guardar número [VALOR] como [NOMBRE]                                      | Crea o actualiza un número.                                                          |
| número guardado [NOMBRE] si no existe [PREDETERMINADO]                    | Recupera el número o devuelve el predeterminado.                                     |
| ¿hay número guardado [NOMBRE]?                                            | Permite elegir entre calibrar o recuperar.                                           |
| borrar números guardados                                                  | Borra los números de esta extensión; en GIGA solo las claves `/kv/gf_` de GreyForge. |

## EEPROM I2C externa

Pon «usar EEPROM I2C para la memoria» al principio de «al iniciar», antes de cualquier otro bloque de memoria. Sin ese bloque se usa el almacén de la tarjeta, como en la versión 1.0.0. Con él, los números viven en el módulo y no se pierden al cambiar de tarjeta ni dependen de que cargar otro programa respete la flash.

- **Chips:** EEPROM I2C de 32 Kbit o más, con dirección interna de 2 bytes (24C32, 24C64, 24C128, 24C256, 24C512). Por ejemplo, DFRobot Gravity DFR0117 (32 KB, 2,5–5,5 V, dirección 0x50–0x57 con interruptores). Las de 16 Kbit o menos (24C02…24C16) no sirven.
- **Pines:** SDA y SCL de un bus I2C oficial de la tarjeta. En el GIGA del Rescue Line es `Wire1` (SDA1 D102 / SCL1 D101), junto a la BNO055 (0x28).
- **Bus compartido:** el bloque inicia el bus solo si nadie lo inició antes y no cambia su velocidad. Si la BNO055 lo puso a 400 kHz, la EEPROM trabaja a esa velocidad (los 24Cxx admiten 400 kHz a 2,5 V o más).
- **Capacidad:** 64 números. Usa 1288 bytes desde la dirección 0; el resto del chip queda libre.
- **Escritura:** trozos de 16 bytes alineados, que nunca cruzan una página. Después de cada uno espera hasta 20 ms a que el chip responda (suele tardar unos 5 ms). Solo escribe los bytes que cambian. Guardar un número nuevo tarda unos 15 ms; guardar el mismo valor no escribe nada.
- **Errores:** si nadie responde en la dirección elegida, el programa se detiene con «No hay EEPROM I2C en esa direccion». Si deja de responder después, con «No responde la EEPROM I2C».
- **Solo Arduino:** en MicroPython este bloque da un error al generar.

Formato GFM1 versión 2: cabecera de 8 bytes (`GFM1`, 2, 64, 0, 0) y 64 entradas de 20 bytes desde la dirección 8. Cada entrada lleva el nombre (12 bytes rellenados con ceros), el float32 little endian, el CRC16-CCITT de esos 16 bytes (little endian) y dos bytes en 0. Las entradas van seguidas; la primera cuyo nombre empieza con 0x00 o 0xff marca el final. Al agregar un número se escribe primero el nuevo final, luego la entrada y al último su primera letra: un corte de energía deja la tabla como estaba. Un corte al actualizar un número que ya existía puede dejar esa entrada con el CRC mal: el programa se detiene con «Memoria danada: borra los numeros guardados» y «borrar números guardados» la recupera. Una EEPROM nueva o con datos de otro programa (sin la cabecera) se lee como vacía, y el primer «guardar» la prepara. Borrar solo escribe el final de la tabla y la cabecera.

Los nombres distinguen mayúsculas y minúsculas: de 1 a 12 caracteres ASCII, letras A–Z/a–z, dígitos y `_`. Aceptan bloques de texto: une `qtr_min_` con el número del canal convertido a texto. Un nombre inválido detiene el programa con un error claro. Los números Arduino se guardan como `float` de 32 bits, aproximadamente 6–7 cifras significativas.

## Capacidad y desgaste

| Tarjeta / lenguaje              | Cuántos números                                                                                           | Medio y escrituras orientativas                                                                                                                              |
| ------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| UNO R3 y Nano / Arduino         | 16                                                                                                        | EEPROM real: orden de 100 000 escrituras por celda.                                                                                                          |
| UNO R4 Minima / Arduino         | 16                                                                                                        | EEPROM emulada en flash de datos; orden de 100 000 ciclos, según condiciones del fabricante.                                                                 |
| Teensy 4.0 y 4.1 / Arduino      | 16                                                                                                        | EEPROM emulada; presupuesto conservador del orden de 10 000 ciclos de borrado de flash; la emulación distribuye el desgaste.                                 |
| GIGA R1 / Arduino               | Variable, hasta llenar el KVStore configurado por el core; 16 números bastan para el ejemplo de 8 canales | Flash con KVStore de mbed, desgaste dependiente del dispositivo y de la configuración; orden de 10 000 ciclos de borrado como referencia conservadora.       |
| FireBeetle y XIAO / Arduino     | Variable, hasta llenar la partición NVS                                                                   | Preferences del core ESP32, namespace `greyforge`; flash del orden de 10 000–100 000 borrados por sector según el chip, con distribución de desgaste de NVS. |
| FireBeetle y XIAO / MicroPython | Variable, hasta llenar el sistema de archivos y la RAM disponible                                         | Archivo JSON en flash, con el mismo orden orientativo de ciclos por sector.                                                                                  |

Son órdenes de magnitud, no una garantía ni un número de llamadas al bloque: consulta la ficha de la tarjeta y de su flash. **Guarda solo al terminar de calibrar, nunca en cada vuelta del bucle.** Guardar un número que ya tiene el mismo valor no escribe. MicroPython reescribe el archivo entero cuando cambia un número.

Fuentes: [EEPROM Arduino](https://docs.arduino.cc/learn/programming/eeprom-guide/), [UNO R4 Minima](https://docs.arduino.cc/resources/datasheets/ABX00080-datasheet.pdf), [EEPROM Teensy](https://www.pjrc.com/teensy/td_libs_EEPROM.html), [Preferences ESP32](https://docs.espressif.com/projects/arduino-esp32/en/latest/tutorials/preferences.html), [KVStore mbed](https://os.mbed.com/docs/mbed-os/v6.16/apis/kvstore.html).

## Formato y recuperación

EEPROM ocupa las direcciones **0–263**: cabecera de 8 bytes (`GFM1`, versión 1, reservado 0, CRC16-CCITT de la tabla en little endian) y 16 entradas de nombre de 12 bytes, rellenado con ceros, más float32 little endian. Un nombre de 12 caracteres no necesita terminador. Solo se escriben bytes diferentes, mediante comparación previa. Una EEPROM virgen (todos `0xff`) representa una tabla vacía. Una firma, versión o CRC incorrectos detiene el programa; «borrar números guardados» permite recuperarla. No mezcles esta zona con otros programas que usen EEPROM. La actualización no es transaccional: si se corta la energía mientras guarda, puede ser necesario borrar y recalibrar.

En ESP32 se usan `Preferences.h` y el namespace `greyforge`. En GIGA se usan `kvstore_global_api.h`, `kv_set`, `kv_get` y `kv_reset`, con claves `/kv/gf_<nombre>`. Borrar quita solo esas claves y deja las de otros programas. La disponibilidad del almacén depende del core mbed_giga; falta compilarlo con ese core. Si no proporciona KVStore o no tiene almacenamiento configurado, la alternativa es un archivo en LittleFS sobre flash QSPI, con una partición reservada explícitamente y probada para la versión del core; no se usa EEPROM como sustituto silencioso.

En MicroPython se escribe `memoria.json.tmp`, se vacía y cierra, y se publica con `os.rename` como `memoria.json`. Un fallo previo al rename conserva el archivo anterior. La resistencia a un corte de energía durante el rename depende del sistema de archivos del firmware. Un archivo dañado produce error; borrar permite recuperarlo. Evita actualizar el firmware borrando toda la flash si deseas conservar los datos.

El descriptor actual de FireBeetle en GreyForge ofrece MicroPython. Las plantillas Arduino de Memoria también contemplan ESP32; la app aún no ofrece carga Arduino para esa tarjeta.

## Ejemplos

`examples/numeros.blocks.json` muestra guardar, leer con predeterminado y borrar. Los proyectos de la app `examples/memoria-qtr-giga.blocks.json` y `examples/memoria-qtr-uno.blocks.json` calibran durante 5 segundos si el botón está presionado o no hay datos; después guardan mínimo y máximo de cada canal. Si ya hay datos, los cargan sin recalibrar. Imprimen la posición cada 100 ms.

GIGA: ocho canales en A10, A0, A9, A1, A8, A2, A7 y A3 (primeros ocho del Rescue Line). Motores como el Rescue Line: A PWM D9/IN1 D4/IN2 D2/EN D6; B PWM D10/IN1 D7/IN2 D8/EN D12. Botón D22 con resistencia externa de 10 kΩ a GND y pulsador a 3.3 V. UNO R3: cinco canales A0–A4, puente H A PWM D5/IN1 D7/IN2 D8 y B PWM D6/IN1 D9/IN2 D10; botón D2 con 10 kΩ a GND y pulsador a 5 V. GND común; alimentación de motores adecuada al puente. Alimenta el QTR con voltaje compatible con las entradas de la tarjeta. Durante esos 5 segundos el robot gira lentamente: coloca todos los canales sobre línea y fondo.

## English

Save named numbers in permanent storage so QTR calibration survives power-off. No wiring is needed for Memory itself. The extension is experimental and has not been tested on physical boards. It is unavailable on SPIKE and EV3; EV3 already supports files.

Blocks: **use I2C EEPROM for memory** (optional), **save number as**, **saved number if missing**, **is there a saved number?**, and **clear saved numbers**. Names are case sensitive, 1–12 ASCII letters, digits or underscores. Connect text blocks to construct names in a channel loop. Invalid names stop the program. Arduino stores 32-bit floats with about 6–7 significant digits.

UNO R3, Nano, UNO R4 Minima and Teensy 4.x hold **16 numbers**, using EEPROM bytes 0–263. ESP32 Preferences/NVS, GIGA mbed KVStore and MicroPython JSON have variable capacity limited by their configured storage; JSON also needs RAM. The table above gives approximate endurance: about 100,000 writes per cell for AVR EEPROM, around 100,000 data-flash cycles for R4 subject to manufacturer conditions, and a conservative order of 10,000 erase cycles for emulated flash, with storage wear distribution where available. ESP32 flash often specifies 10,000–100,000 sector erases depending on the chip. These are estimates, not guarantees or counts of block calls.

**External I2C EEPROM (1.1.0):** put **use I2C EEPROM for memory** at the top of “when started”, before any other memory block. The other four blocks then store up to **64 numbers** in an I2C EEPROM of 32 Kbit or more with 2-byte addressing (24C32…24C512, such as DFRobot Gravity DFR0117), so calibration stays with the robot even if the board is swapped. Choose the SDA/SCL pins of an official I2C bus (on the Rescue Line GIGA, `Wire1`: SDA1 D102 / SCL1 D101, shared with the BNO055) and the address 0x50–0x57. The block starts the bus only if nobody did, and never changes its clock. Writes use aligned 16-byte chunks that never cross a page, poll the chip for up to 20 ms, and skip unchanged bytes. Format GFM1 v2: an 8-byte header (`GFM1`, 2, 64, 0, 0), then 64 contiguous 20-byte entries from address 8 (12-byte name, little-endian float32, CRC16-CCITT of those 16 bytes, two zero bytes); the first entry whose name starts with 0x00 or 0xff ends the table. Adding a number writes the new end first and the entry's first letter last, so a power cut leaves the table as it was; a cut while updating an existing number can leave a bad CRC, which stops the program until the numbers are cleared. A blank or foreign EEPROM reads as empty. Errors: “No I2C EEPROM at that address”, “The I2C EEPROM does not respond”, “Memory full: maximum 64 numbers”. Arduino only; MicroPython reports a generation error.

**Save only after finishing calibration, never on every loop iteration.** Saving an unchanged value performs no write. EEPROM uses an 8-byte signature/version/CRC16 header and sixteen 12-byte names plus little-endian float32 values; only changed bytes are written. A corrupt table raises an error until cleared. Power loss during EEPROM writes may require clearing and recalibrating.

ESP32 uses `Preferences.h`, namespace `greyforge`. GIGA uses mbed `kvstore_global_api.h` and keys `/kv/gf_<name>`; clear removes only those keys and keeps other applications' keys. Compilation with the actual GIGA core is pending; if KVStore is unavailable, the proposed alternative is LittleFS on a tested, explicitly reserved QSPI partition. MicroPython writes and closes `memoria.json.tmp`, then uses `os.rename` to publish `memoria.json`; power-loss durability depends on the firmware filesystem. Clear can recover a damaged JSON file. FireBeetle currently exposes only MicroPython in GreyForge, although Memory also supplies Arduino ESP32 templates.

The app examples use an active-high button with an external 10 kΩ pulldown, eight QTR channels on GIGA or five on UNO, five seconds of slow turning while calibrating, a channel loop to save/load minima and maxima, and line-position output every 100 ms. Wiring is listed above. No physical-board validation is claimed.
