# RobotBlocks · tarjetas y extensiones

Catálogo independiente del editor, inspirado en la organización de Mind+: bloques generales fijos, tarjetas seleccionables y módulos opcionales. Es un repositorio privado de desarrollo. No contiene proyectos personales ni el instalador del programa.

## Estado actual

| Paquete                       | Función                                     | Estado                                                             |
| ----------------------------- | ------------------------------------------- | ------------------------------------------------------------------ |
| `packages/virtual-boards`     | Descriptores de dos tarjetas ficticias      | Ejemplo de arranque incluido; no reinstalar sobre el mismo ejemplo |
| `packages/pin-io`             | Digital, analógico y PWM                    | MicroPython ESP32 y API Arduino experimental                       |
| `packages/robotics`           | Movimiento, motores y lecturas lógicas      | Módulo opcional, valores ovalados conectables                      |
| `packages/distance-demo`      | Ejemplo de sensor independiente             | Sin driver real                                                    |
| `packages/motores`            | Motores DC con puente H (TB6612FNG/L298N)   | MicroPython experimental, incluido; pendiente de prueba física     |
| `packages/servos`             | Servos con el pin elegido en el bloque      | MicroPython experimental, incluido; pendiente de prueba física     |
| `packages/linea-qtr`          | Seguidor de línea Pololu QTR/QTRX analógico | MicroPython experimental, opcional; pendiente de prueba física     |
| `packages/ultrasonico-hcsr04` | Distancia con HC-SR04                       | MicroPython experimental, opcional; pendiente de prueba física     |
| `packages/color-tcs34725`     | Color con TCS34725 (DFRobot SEN0212)        | MicroPython experimental, opcional; pendiente de prueba física     |
| `packages/imu-bno055`         | Giro e inclinación con BNO055 (SEN0253)     | MicroPython experimental, opcional; pendiente de prueba física     |
| `packages/huskylens`          | Cámara AI DFRobot SEN0305                   | Arduino/C++ por I2C o UART de hardware; experimental               |
| `packages/uart`               | Líneas de texto por UART (OpenMV)           | MicroPython experimental, opcional; pendiente de prueba física     |
| `packages/i2c`                | Registros entre tarjetas por I2C            | Arduino maestro/esclavo y MicroPython maestro; experimental        |
| `packages/arduino-uno`        | Arduino UNO R3                              | Arduino experimental, sin carga                                    |
| `packages/arduino-nano`       | Arduino Nano ATmega328P                     | Arduino experimental, sin carga                                    |
| `packages/arduino-giga-r1`    | Arduino GIGA R1 WiFi                        | Arduino experimental, sin carga                                    |
| `packages/teensy-40`          | Teensy 4.0 (pinout propio)                  | Arduino experimental, sin carga                                    |
| `packages/teensy-41`          | Teensy 4.1 (pinout propio)                  | Arduino experimental, sin carga                                    |

El catálogo está en `catalog.json` (versión 1). Cada carpeta usa manifiesto declarativo v2 y sus archivos declarados. Este repositorio es la fuente editable; la aplicación versiona su copia offline. Los dispositivos declaran ranuras `pins`; los pines digitales distinguen entrada y salida.

## Usar la copia local

Descarga o clona este repositorio con tu cuenta. En RobotBlocks 0.4 abre **Tarjetas y extensiones → Extensiones/Tarjetas → Instalar desde carpeta** y selecciona la carpeta del paquete, por ejemplo `packages/robotics`. Instalar un ID ya presente se rechaza; no sobrescribe silenciosamente sus bloques.

El prototipo admite descarga directa por URL de repositorios públicos. Como este catálogo es privado, por ahora usa la copia local. El acceso autenticado a repositorios privados desde el programa está pendiente. El acceso de Codex a GitHub no se comparte con el editor.

## Aportar una tarjeta

1. Crea `packages/mi-tarjeta/extension.json` con un ID propio.
2. Declara nombre, capacidades, recursos y metadatos: destinos/carga/FQBN, símbolos por lenguaje, lógica, ADC y PWM. Marca destinos `experimental: true` hasta confirmar pruebas físicas.
3. Conserva IDs estables de recursos; el nombre visible del pin puede cambiar sin modificar el programa.
4. Añade el paquete a `catalog.json` con `kind: "board"`.
5. Valida en el editor y ejecuta `npm test` en este repositorio.

Los paquetes `arduino-uno`, `arduino-nano`, `arduino-giga-r1`, `teensy-40` y `teensy-41`
aportan descriptores experimentales independientes y fuentes oficiales con tablas de pines
en cada README. Generan lógica y E/S básica C++/Arduino; la compilación con cores y la carga
se verificarán en Fase 8. Motores, Servos, QTR, HC-SR04, TCS34725, BNO055 y UART carecen de
plantillas Arduino y lo indican en los diagnósticos. Un descriptor visible no confirma hardware probado.

## Validación y referencias

`npm test` comprueba integridad, namespaces, archivos, recursos, ranuras, límites numéricos y símbolos. No necesita dependencias. GitHub Actions ejecuta esa comprobación; la aplicación realiza además la validación Zod completa al instalar y con `npm run validate-catalog`.

Referencias oficiales: [organización de tarjetas y módulos de Mind+](https://mindplus.dfrobot.com/mp2/3Coding/32UploadMode/324ExtensionArea/) y [extensiones de usuario de Mind+ 1.x](https://mindplus.dfrobot.com.cn/ext-api). Se reutilizan ideas de organización; estos paquetes no son librerías Mind+ y no se importan sin adaptación. No incluyen sus iconos ni recursos gráficos.

La app genera lógica MicroPython/Arduino y acepta [plantillas por bloque](GENERATORS.md).
Los paquetes de motores, servos y sensores solo aportan plantillas MicroPython y muestran
diagnósticos al generar Arduino. Son datos; no ejecutan scripts en el editor. Carga Arduino y pruebas
físicas siguen pendientes. No hay actualizaciones automáticas.

La aplicación usa este catálogo como fuente única. `npm run validate-catalog` en
la raíz de la aplicación comprueba los paquetes sin modificarlos; `npm run bundle-catalog`
prepara su copia offline generada. Edita los JSON de este repositorio, nunca la copia
generada. Los nombres de las tarjetas virtuales son neutrales; sus IDs se conservan
para que los proyectos guardados mantengan sus referencias.
