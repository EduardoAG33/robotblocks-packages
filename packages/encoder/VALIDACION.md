# Validación del encoder · 27 de octubre de 2026

Rama `extension-encoder` en app y catálogo, desde `origin/main`. Se usó `BLOCKS-ramas/encoder-extension` porque la carpeta anterior `encoder` contiene trabajo sin confirmar. Checkouts principales y carpeta anterior conservados. Sin push ni PR.

## Diseño final

- GreyForge 0.4.0; ningún archivo de la app editado.
- Configurar admite de 1 a 6 filas, de seis campos: NOMBRE, PIN_A, PIN_B, PPR, RED y DIAM. Máximo seis encoders en total, comprobado por el runtime.
- Bloque separado «sentido del encoder %ENC %SENTIDO», con `reference.kind: row`. Todos empiezan en normal; el ejemplo invierte el derecho por el montaje en espejo.
- Nombres automáticos `encoder{N}`; el ejemplo usa izquierdo/derecho. Las referencias siguen al nombre al renombrar o reordenar las filas.
- Configurar y sentido se indican para «al iniciar» en los tooltips. No se añade diagnóstico de ubicación a la app. Usar un slot sin configurar falla claramente; reconfigurarlo falla antes de registrar otra interrupción.

## Comprobaciones reproducibles

Desde el catálogo:

```text
npm test
npm run format
node scripts/check-encoder-viper.mjs
```

Desde la app aislada:

```text
node package-catalog/scripts/probar-extension.mjs package-catalog/packages/encoder --sin-compilar
node package-catalog/scripts/probar-extension.mjs package-catalog/packages/encoder
node node_modules/vitest/vitest.mjs run --config package-catalog/scripts/encoder-vitest.config.mjs
npm run validate-catalog
```

- `npm ci` completado en la app; no se agregaron dependencias al catálogo.
- `npm test`: integridad de 44 paquetes y simulación del runtime real MicroPython.
- Simulación: ×4/×2, avance/retroceso, inversión mediante el bloque separado, transición inválida, valores/pines/nombres inválidos, límite de seis, uso sin configurar, reinicios, distancia 65 mm → 20.42 cm, regla de 20 ms, velocidad negativa y desbordamientos de contador/reloj. Comprueba que reconfigurar o cambiar sentido no duplique IRQ y que todos empiecen en normal.
- Control negativo: sustituir 20.42 por 20.43 en la expectativa hace fallar la prueba.
- Viper: runtime compilado para ESP32 `xtensawin`, ABI v6, 2834 bytes. Se usa el compilador que ya trae la app.
- Adaptador real de Blockly, en jsdom: **3 pruebas aprobadas**. Instalación de los ocho bloques; abrir el ejemplo y reconstruirlo sin pérdida de estructura; nombres automáticos; renombrado conjunto de lectores, sentido y reinicio; resolución correcta por fila tras reordenar y diagnóstico de referencia inexistente.
- Validación Zod real: los 44 paquetes del catálogo local válidos.

## Matriz con el generador real

**16 de 16 pruebas aprobadas:** 12 compilaciones C++ (incluido el ejemplo) y cuatro comprobaciones de sintaxis MicroPython. Se utilizó `scripts/probar-extension.mjs` con el paquete exacto de seis campos y el bloque de sentido separado.

| Tarjeta                                      | C++ ×2  | C++ ×4            | MicroPython               |
| -------------------------------------------- | ------- | ----------------- | ------------------------- |
| UNO R3 (`arduino:avr:uno`)                   | Compiló | —                 | —                         |
| UNO R4 Minima (`arduino:renesas_uno:minima`) | Compiló | Compiló           | —                         |
| GIGA R1 (`arduino:mbed_giga:giga`)           | Compiló | Compiló           | —                         |
| Teensy 4.0 (`teensy:avr:teensy40`)           | Compiló | Compiló           | —                         |
| Teensy 4.1 (`teensy:avr:teensy41`)           | Compiló | Compiló + ejemplo | —                         |
| XIAO ESP32-S3 (`esp32:esp32:XIAO_ESP32S3`)   | Compiló | Compiló           | Generado/sintaxis ×2 y ×4 |
| FireBeetle ESP32                             | —       | —                 | Generado/sintaxis ×2 y ×4 |

UNO usa dos encoders en ×2, con A en D2/D3 y B en D4/D5. El ejemplo Teensy usa izquierdo A2/B3 y derecho A4/B5 e imprime ambas distancias y su promedio cada 200 ms. No lleva driver de motores.

Sketches y programas generados: `../../../artifacts/probar-extension/encoder/`; log de la matriz: `../../../artifacts/encoder-matrix.log`, desde esta carpeta, en la app aislada.

## Lista final de CREAR_EXTENSIONES.md

- [x] ID propio `org.robotblocks.encoder` y prefijo `enc_`.
- [x] Etiquetas/tooltips es/en y mensajes de error traducidos.
- [x] README en español con cableado, bloques, parámetros, motores en espejo y ejemplo.
- [x] Tres programas en `pruebas/`, ejemplo generado en `examples/` y prueba simulada del decodificador.
- [x] `probar-extension.mjs` sin fallas; `npm test` y `npm run format` limpios.
- [x] Registrado en `catalog.json` y en la tabla del README.

## Precisión numérica de la app

El C++ generado envuelve el reporter de cuentas en `rb_finite` y usa números `float` (32 bits). El runtime mantiene un `volatile long` exacto de 32 bits, pero el valor del bloque pierde resolución de una cuenta por encima de ±16 777 216. Se documenta este límite de GreyForge 0.4.0 en el README; no se modifica la app.

## Interfaz y hardware pendientes

Se intentó abrir el ejemplo e instalar la carpeta en la app web de prueba. La automatización del navegador rechazó la selección de archivos locales por su permiso de acceso a URL de archivos. El control nativo de Windows se detuvo porque no pudo verificar la URL activa con suficiente confianza. No se cambiaron permisos ni ajustes. **No se completó la revisión visual de arrastrar bloques, abrir el ejemplo o revisar Código**; las pruebas del adaptador en jsdom comprueban estructura y referencias, no apariencia.

No se cargó en ninguna tarjeta ni se conectaron encoders. No se midieron pérdida de flancos, ruido, frecuencia máxima ni precisión física. La simulación CPython emula Viper, los pines y el reloj; la compilación nativa comprueba Viper para ESP32, sin ejecutarlo físicamente. Se conserva `metadata.experimental: true`.
