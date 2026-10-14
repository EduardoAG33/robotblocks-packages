# Plantillas por bloque

La aplicación genera MicroPython y Arduino desde el campo opcional `generators` de
cada bloque. Los descriptores del manifiesto no sustituyen estas plantillas.

```json
{
  "generators": {
    "micropython": { "expression": "abs({VALUE})" },
    "arduino": { "expression": "fabs({VALUE})" }
  }
}
```

Este ejemplo solo transforma una entrada numérica; no describe hardware.
Arduino admite `hardware.uart.hardwareOnly: true` para exigir un UART de hardware;
si el mapa de la tarjeta ofrece SoftwareSerial, da un diagnóstico genérico.

Los valores usan `expression`; las instrucciones, `statement`. Los arrays
`imports`, `includes`, `globals`, `setup` se deduplican. `{CAMPO}` se escapa o
resuelve a símbolo/identificador; `{ENTRADA}` conserva paréntesis solo cuando protege precedencia.
Los literales simples, identificadores y llamadas completas no los necesitan. `{DEVICE.trig}` resuelve
una ranura. Los cuerpos `{BODY}`/`{THEN}` deben ocupar líneas completas y el motor
aplica su indentación. No uses entradas de proceso en inicializaciones ni cesiones
ocultas. Python exige `global nombre` si una instrucción reasigna un global del paquete.

Reserva los prefijos `rb_`, `v_`, `d_`, `fn_`, `p_`, `proceso_` para el motor. Los reporters son síncronos;
evita variables automáticas C++ inicializadas atravesando cuerpos con esperas.
No dependas de variables privadas en setup. El contrato completo y sus límites
están en `docs/CODEGEN.md` y ADR 011 de la aplicación.

`canFail: false` opcional en una instrucción o reporter indica que no puede
registrar fallos y evita un guard C++ redundante. Por defecto es `true`; el autor
debe comprobar ese contrato. Las entradas usadas tras un cuerpo con esperas se
conservan en el estado del proceso; las demás evaluaciones usan temporales locales.
El primer fallo emite `RB_ERROR <id-bloque> <mensaje>`. El programa Arduino inicia
Serial a 115200 baudios. Los comentarios de ID son opcionales en la vista de código.

Desde Fase 5, `{BLOCK_ID}` inserta el ID escapado para fallos de una plantilla.
Los eventos usan `event: { mode, expression }`: interval (intervalo literal en ms),
change (lectura síncrona del estado) o message (versión de mensaje). Sus campos,
imports y setup usan las mismas sustituciones; no llevan statement ni expression
en el nivel superior. El motor genera las esperas y el muestreo cooperativo.
Los bloques del núcleo añaden serie, tiempo y funciones síncronas con hasta dos
parámetros. El contrato y los límites están en ADR 016 de la app. Listas: subfase 5.1.

La app valida estructura, no sintaxis completa de los lenguajes. Revisa y compila
los resultados antes de publicarlos. El navegador nunca ejecuta las plantillas ni
JS del paquete. Una plantilla ausente da error, sin programa parcial ni lecturas
ficticias. Los cuatro paquetes actuales siguen sin controladores reales; añadir
metadatos no equivale a soporte físico. FireBeetle, Teensy y GIGA requieren pinouts
oficiales y prueba física en sus fases correspondientes.

## Filas variádicas de campos (Fase 14)

Además de `variadic.input` para valores repetidos (UART), `variadic.row` permite
filas literales de campos con +/−. `input.name` nombra el grupo (no crea conexiones
cuando existe row); la etiqueta principal termina con `%GRUPO`. La fila declara
`label` localizada, `fields` (menús/referencias como campos fijos) y `template`.
Cada `%CAMPO` aparece una vez en la etiqueta de fila y `{CAMPO}` en la plantilla.
La IR guarda campos `CAMPO1…CAMPOn`, sin nodos adicionales.

En las plantillas, `{GRUPO}` reúne filas expandidas separadas por comas;
`{GRUPO_COUNT}` cuenta filas de ese bloque, `{GRUPO_TOTAL}` cuenta filas conectadas
de la misma definición y `{GRUPO_OFFSET}` cuenta las anteriores en orden del
programa. Son literales disponibles también en globals/setup. Las cadenas de
fila se escapan como texto y las referencias se resuelven a símbolos de recursos.
Véase `packages/laser-vl53l0x/blocks/index.json` del catálogo.
