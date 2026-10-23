# Crear una extensión para GreyForge

Guía práctica para agregar bloques nuevos (un sensor, un actuador, una pantalla o una herramienta como el PID) sin tocar el código de la app. Una extensión es **una carpeta con archivos JSON**: la app nunca ejecuta JavaScript del paquete; solo copia las plantillas de código que escribes al programa del alumno.

El contrato completo (todos los campos) está en la app: `docs/CREATING_EXTENSIONS.md`, `docs/CODEGEN.md` y [GENERATORS.md](GENERATORS.md). Esta guía es el camino corto.

## 0. Lo que necesitas

- La app GreyForge clonada, con este catálogo dentro en `package-catalog/` y `npm ci` hecho.
- Node 24. Python 3 (para revisar y ejecutar el código MicroPython/Pybricks). Opcional: `arduino-cli` con los núcleos de las tarjetas (para compilar el C++).
- Trabaja en una rama nueva del catálogo, por ejemplo `git switch -c mi-extension`.

## 1. Copia la extensión más parecida

| Si tu extensión…                                | Copia                                      |
| ----------------------------------------------- | ------------------------------------------ |
| No usa hardware (cálculos, lógica)              | `packages/maquina-estados`, `control-pid`  |
| Usa uno o dos pines elegidos en el bloque       | `packages/servos`, `ultrasonico-hcsr04`    |
| Es un sensor I2C sin librería                   | `packages/color-tcs34725`, `laser-vl53l0x` |
| Habla por UART                                  | `packages/uart`, `huskylens`               |
| Necesita una librería Arduino                   | `packages/ws2812` (la app sabe instalarla) |
| Debe esperar sin frenar a los demás procesos    | `imu-mpu6050` (Arduino) o `zumbador`       |
| Tiene varias cosas con nombre (filas con + y −) | `packages/control-pid`, `laser-vl53l0x`    |

```text
packages/mi-extension/
├── extension.json      manifiesto
├── blocks/index.json   bloques y plantillas de código
├── README.md           para qué sirve, cableado, bloques (español e inglés)
├── pruebas/*.json      programas de prueba (paso 4)
└── examples/           proyectos .blocks.json que el alumno puede abrir (los crea el paso 4)
```

## 2. `extension.json`

Cambia como mínimo: `id` (`org.robotblocks.mi-extension`, o tu propio dominio al revés), `name`, `version` (`1.0.0`), `author`, `description`, la categoría (`id` que empiece con tu `id` + `:`, nombre y color `#RRGGBB`), `metadata.group` (`sensors`, `actuators`, `communication` u `other`) y `metadata.experimental: true` hasta probarla en hardware. `permissions` siempre `[]`.

En `metadata.translations.en` van las traducciones de los textos que no son etiquetas de bloque: nombre, descripción, categoría y cada mensaje de `rb_fail`.

## 3. `blocks/index.json`

Un arreglo de bloques. Cada uno:

```json
{
  "id": "org.robotblocks.mi-extension:leer",
  "operation": "org.robotblocks.mi-extension:leer",
  "category": "org.robotblocks.mi-extension:sensor",
  "label": { "es": "distancia en pin %PIN", "en": "distance on pin %PIN" },
  "kind": "reporter",
  "output": "number",
  "fields": [
    {
      "name": "PIN",
      "type": "string",
      "default": "",
      "reference": { "kind": "resource", "capabilities": ["digitalInput"] }
    }
  ],
  "inputs": [],
  "tooltip": { "es": "…", "en": "…" },
  "requiredCapabilities": [],
  "generators": {
    "micropython": { "imports": ["from machine import Pin"], "expression": "mi_leer({PIN})" },
    "arduino": { "globals": ["inline float mi_leer(int pin) { … }"], "expression": "mi_leer({PIN})" }
  }
}
```

- **kind**: `command` (instrucción), `reporter` (valor ovalado, con `output` `number`/`string`), `boolean` (hexágono, `output` `boolean`), `loop` (con cuerpo), `event`.
- **fields** son fijos (menús, pines, nombres, números literales); **inputs** aceptan otros bloques (`number`, `string`, `boolean`, `value`, `statement`). Cada uno aparece una vez en la etiqueta como `%NOMBRE`, en español y en inglés.
- Menús: `"options": [{ "label": { "es": "rojo", "en": "red" }, "value": "red" }]`. Pines: `reference.kind` `resource` con capacidades (`digitalInput`, `digitalOutput`, `pwm`, `analogInput`…). Filas con nombre: `variadic.row` y, en los demás bloques, `reference.kind` `row` (copia `control-pid`).
- **generators** por destino: `micropython` (ESP32), `arduino` (C++) y `pybricks` (SPIKE y EV3). Si falta un destino, las tarjetas de ese lenguaje dan un error al generar: dilo en el README. Cada uno lleva `statement` o `expression` y, si hace falta, `imports`/`includes`/`globals`/`setup` (se escriben una sola vez aunque haya muchos bloques).
- Sustituciones: `{CAMPO}` y `{ENTRADA}`, `{BLOCK_ID}` para errores, `{ADC_MAX}`, `{PWM_MAX}`, `{I2C_BUS}`, `{UART_PORT}`; en filas `{GRUPO}`, `{GRUPO_COUNT}`, `{GRUPO_OFFSET}`, `{GRUPO_TOTAL}`.

### Reglas de oro (lo que más falla)

1. Nada de `delay()` ni `time.sleep(segundos)`: congelan a todos los procesos. Pausas de pocos ms (`delayMicroseconds`, `time.sleep_us`) sí; para esperas largas usa `waitUntil` (solo Arduino) o deja el trabajo en segundo plano (`poll` en Arduino, `machine.Timer` en MicroPython) y ofrece un booleano «terminó» para que el alumno use «esperar hasta» del núcleo, como `zumbador`.
2. Prefijo propio para tus funciones y variables (`mi_…`). Nunca `rb_`, `v_`, `d_`, `fn_`, `p_`, `proceso_` (son del motor).
3. Python: una función que reasigna un global necesita `global nombre`.
4. C++: una función por línea (el generador de prototipos de Arduino falla si hay dos) y nada de `String` avanzado (`substring`, `trim`, `lastIndexOf`…), porque la CI de la app compila con un `String` simulado.
5. En Arduino un campo de texto o menú llega como `String("…")`, no como `const char*`; dentro de las filas (`variadic.row`) llega como `"…"` sin `String`.
6. Errores con `rb_fail(bloque, "Mensaje claro")` (y su traducción en `metadata.translations.en`). El programa se detiene e imprime `RB_ERROR`.
7. Usar algo sin configurarlo da un error claro («Configura … al iniciar»), nunca un valor inventado.
8. Etiquetas cortas y en el idioma del alumno; el tooltip explica cuándo usar el bloque.

## 4. Pruebas: `pruebas/*.json`

Cada archivo es un programa pequeño que `scripts/probar-extension.mjs` genera para varias tarjetas con el generador real de la app:

```json
{
  "titulo": "Mi extensión · lógica",
  "tarjetas": ["arduino-uno", "arduino-giga-r1", "dfrobot-firebeetle-esp32", "lego-spike-prime", "lego-ev3"],
  "variables": { "x": 0, "texto": "" },
  "pines": { "arduino-uno": { "PIN": "d7" }, "dfrobot-firebeetle-esp32": { "PIN": "gpio25" } },
  "programa": [
    [":configurar", { "NAME1": "uno" }],
    ["core:set", { "VARIABLE": "x" }, { "VALUE": [":leer", { "PIN": "$PIN" }] }]
  ],
  "esperado": { "x": 42 },
  "ejemplo": "arduino-uno"
}
```

- Un bloque es `[id, campos, entradas]`. `":leer"` es un bloque de tu paquete; `"core:…"` es del núcleo. Un número es un bloque número, un texto es un bloque texto y `{ "var": "x" }` lee una variable. Una entrada de instrucciones (`BODY`) es una lista de bloques.
- `"$PIN"` se cambia por el pin de `pines` de cada tarjeta (usa los IDs de recurso de la tarjeta, por ejemplo `d7`).
- `esperado` (opcional): después de correr el programa en la computadora, con los módulos simulados de la app, las variables deben valer eso (`{ "minimum": 0 }` para un mínimo). Sin `esperado`, solo se revisa la sintaxis. Para programas con «por siempre» agrega `"tiempo": 0.5` (segundos). `"salida"` compara lo impreso.
- `ejemplo`: guarda ese programa como `examples/<archivo>.blocks.json` para esa tarjeta. Haz un ejemplo real para el alumno, no solo la prueba de lógica.

Desde la carpeta de la app:

```bash
node package-catalog/scripts/probar-extension.mjs package-catalog/packages/mi-extension --bloques core:
node package-catalog/scripts/probar-extension.mjs package-catalog/packages/mi-extension --sin-compilar
node package-catalog/scripts/probar-extension.mjs package-catalog/packages/mi-extension
```

El primero lista los bloques del núcleo con sus campos y entradas (sin prefijo, los de tu paquete). El segundo genera y ejecuta el Python. El tercero además compila cada sketch con `arduino-cli` (la primera vez por tarjeta tarda varios minutos). Los archivos generados quedan en `artifacts/probar-extension/` para revisarlos.

Los sensores no existen en la computadora: para ellos basta con que el código compile y que la sintaxis de Python esté bien. La lógica pura (filtros, estados, cálculos) sí se puede comprobar con `esperado`.

## 5. Registrar y revisar

1. Agrega el paquete a `catalog.json` (`kind: "module"`) y a la tabla de [README.md](README.md).
2. `npm test` y `npm run format` en esta carpeta.
3. Prueba en la app: **Tarjetas y extensiones → Extensiones → Instalar desde carpeta** y elige `packages/mi-extension`. Arrastra los bloques, mira la vista Código y abre el ejemplo.
4. Si tienes el hardware, cárgalo y anota en el README qué tarjetas probaste. Quita `experimental` solo después de eso.
5. Sube la rama y abre un PR en este repositorio con lo que probaste y lo que falta.

## Lista final

- [ ] `id` propio y prefijo propio en el código
- [ ] etiquetas y tooltips en español e inglés; mensajes de error traducidos
- [ ] README con cableado (si aplica), bloques y ejemplo
- [ ] `pruebas/` con al menos una prueba y un ejemplo en `examples/`
- [ ] `probar-extension.mjs` sin fallas, `npm test` y `npm run format` limpios
- [ ] agregado a `catalog.json` y a la tabla del README
