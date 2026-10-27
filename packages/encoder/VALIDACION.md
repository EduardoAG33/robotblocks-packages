# Validación del encoder · 27 de octubre de 2026

Rama `extension-encoder` en los dos repositorios, desde `origin/main`. Se usó `BLOCKS-ramas/encoder-extension` porque `BLOCKS-ramas/encoder` contiene cambios anteriores sin confirmar. Los checkouts principales y la carpeta anterior se conservaron. Sin push ni PR.

## Comprobaciones completadas

- `npm ci` en la app aislada.
- `npm test` en el catálogo: integridad de los 44 paquetes y simulación del runtime MicroPython real.
- `npm run format` en el catálogo, sin errores. Los cuatro JSON de EV3 que ya tenían diferencias de formato se normalizaron en un commit separado; no se cambió su comportamiento.
- Simulación: ×4/×2, avance/retroceso, sentido invertido, transición inválida, nombres/pines duplicados, valores inválidos, límite de seis, encoder sin configurar, reinicios, distancia (65 mm → 20.42 cm), caché de velocidad antes de 20 ms, velocidad negativa y desbordamientos de contador/reloj.
- Control negativo: sustituir 20.42 por 20.43 en la expectativa produce un fallo de prueba.
- `node scripts/check-encoder-viper.mjs`: compilación MicroPython ABI v6 para ESP32 (`xtensawin`), 2736 bytes. Usa el compilador que ya incluye la app, sin instalar dependencias del catálogo.

## Compilación Arduino/C++ del runtime aislado

Se compiló el runtime extraído sin cambios de `blocks/index.json`, con dos encoders y llamadas a todos los lectores/reinicios, usando Arduino CLI y los cores instalados. En UNO se eligió ×2 con A en D2/D3; en las demás, ×4. **Son compilaciones de sketches de prueba del runtime, no del paquete instalado ni del ejemplo final generado por GreyForge.**

| Tarjeta               | FQBN                         | Compiló |
| --------------------- | ---------------------------- | ------- |
| arduino-uno           | `arduino:avr:uno`            | Sí      |
| arduino-uno-r4-minima | `arduino:renesas_uno:minima` | Sí      |
| arduino-giga-r1       | `arduino:mbed_giga:giga`     | Sí      |
| teensy-40             | `teensy:avr:teensy40`        | Sí      |
| teensy-41             | `teensy:avr:teensy41`        | Sí      |
| seeed-xiao-esp32s3    | `esp32:esp32:XIAO_ESP32S3`   | Sí      |

Los sketches, logs completos y `results.json` están en `../../../artifacts/encoder-runtime/` desde esta carpeta (en la app aislada).

## Bloqueo de compatibilidad del manifiesto

La app actual limita `variadic.row.fields` a seis (`src/extensions/manifest.ts`). La fila solicitada requiere siete: NOMBRE, PIN_A, PIN_B, PPR, RED, DIAM y SENTIDO. La ejecución desde la app de:

```text
node package-catalog/scripts/probar-extension.mjs package-catalog/packages/encoder --sin-compilar
```

falla al instalar con `Too big: expected array to have <=6 items`. No se ha modificado la app: el usuario pidió que solo sirviera para probar y se solicitó autorización para los cambios necesarios.

Además, la API solo permite un patrón de nombre por columna (`encoder {N}`); no permite valores iniciales distintos «izquierdo/derecho» ni restringir de manera declarativa un bloque a «al iniciar». El paquete actual usa nombres automáticos únicos y admite de 1 a 6 filas. Sus fixtures usan izquierdo/derecho; el runtime rechaza nombres duplicados y configurar dos veces. La restricción de ubicación sigue indicada en el tooltip, pendiente de validación en la app.

Se preparó un parche **sin aplicarlo** que permite siete campos, valores iniciales por fila y una regla genérica `startOnly`. Su aplicación se comprobó con `git apply --check --ignore-space-change`. Tras autorizarlo faltaría añadir `initial: 2`, defaults izquierdo/derecho y `startOnly: true` al bloque, comprobar la app y ejecutar la matriz completa con el script oficial.

No se generaron aún los programas MicroPython de FireBeetle/XIAO con el generador real ni `examples/teensy-distancias.blocks.json`: están definidas sus pruebas compactas en `pruebas/`. Tampoco se verificó la interacción visual de renombrar filas/lectores o abrir el ejemplo. La referencia `kind: row` sigue el patrón de VL53L0X.

## Lista final de CREAR_EXTENSIONES.md

- [x] ID propio `org.robotblocks.encoder` y prefijo `enc_`.
- [x] Etiquetas/tooltips es/en y mensajes de error traducidos.
- [ ] README con cableado y bloques: completo; ejemplo final `.blocks.json`: pendiente del bloqueo de instalación.
- [ ] `pruebas/`: tres programas definidos y simulación automatizada; archivo en `examples/`: pendiente del generador.
- [ ] `npm test` y formato: pasan; `probar-extension.mjs` con el paquete exacto: bloqueado por el límite de seis campos.
- [x] Registrado en `catalog.json` y en la tabla del README.

## Hardware

No se cargó en ninguna tarjeta ni se conectaron encoders. No se midieron pérdidas de flancos, ruido, frecuencia máxima ni precisión física. La simulación CPython emula Viper y los pines; la compilación Viper comprueba el código nativo pero no su ejecución física. Se conserva `metadata.experimental: true`.
