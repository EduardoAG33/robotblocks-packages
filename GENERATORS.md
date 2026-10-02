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
Los valores usan `expression`; las instrucciones, `statement`. Los arrays
`imports`, `includes`, `globals`, `setup` se deduplican. `{CAMPO}` se escapa o
resuelve a símbolo/identificador; `{ENTRADA}` se parentiza. `{DEVICE.trig}` resuelve
una ranura. Los cuerpos `{BODY}`/`{THEN}` deben ocupar líneas completas y el motor
aplica su indentación. No uses entradas de proceso en inicializaciones ni cesiones
ocultas. Python exige `global nombre` si una instrucción reasigna un global del paquete.

Reserva los prefijos `rb_`, `v_`, `d_` para el motor. Los reporters son síncronos;
evita variables automáticas C++ inicializadas atravesando cuerpos con esperas.
No dependas de variables privadas en setup. El contrato completo y sus límites
están en `docs/CODEGEN.md` y ADR 011 de la aplicación.

La app valida estructura, no sintaxis completa de los lenguajes. Revisa y compila
los resultados antes de publicarlos. El navegador nunca ejecuta las plantillas ni
JS del paquete. Una plantilla ausente da error, sin programa parcial ni lecturas
ficticias. Los cuatro paquetes actuales siguen sin controladores reales; añadir
metadatos no equivale a soporte físico. FireBeetle, Teensy y GIGA requieren pinouts
oficiales y prueba física en sus fases correspondientes.
