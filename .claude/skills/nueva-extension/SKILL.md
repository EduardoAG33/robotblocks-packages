---
name: nueva-extension
description: Crear, ampliar o revisar una extensión (paquete de bloques) del catálogo de GreyForge — sensores, actuadores, pantallas o herramientas como el PID — con manifiesto, bloques, plantillas Arduino/MicroPython/Pybricks, pruebas y ejemplo. Úsala cuando pidan una extensión nueva, bloques nuevos para el catálogo o revisar un paquete en package-catalog/packages.
---

# Nueva extensión de GreyForge

La receta completa está en `CREAR_EXTENSIONES.md` (raíz del catálogo). Léela entera antes de escribir nada y síguela; esta skill solo agrega cómo trabajar.

1. **Dónde:** rama nueva del catálogo en un worktree aparte (por ejemplo `Desktop/BLOCKS-ramas/<nombre>/package-catalog`, dentro de un worktree de la app con `node_modules` enlazado). No edites `Desktop/BLOCKS` si tiene cambios de otra persona.
2. **Modelo:** copia el paquete más parecido de la tabla del paso 1 y lee también `GENERATORS.md`. Si el bloque usa I2C, UART o una librería, mira cómo lo resuelve el paquete modelo antes de inventar.
3. **Bloques:** escribe `blocks/index.json`. Si las plantillas son largas, genera el JSON con un script de Node desde código legible (en el scratchpad) en vez de escapar a mano.
4. **Pruebas:** crea `pruebas/*.json`. Con `--bloques core:` ves los IDs del núcleo. Al menos una prueba de lógica con `esperado` cuando el comportamiento no depende del hardware, y un ejemplo para alumnos con `ejemplo`.
5. **Verifica de verdad:**
   - `probar-extension.mjs --sin-compilar` hasta que todo esté en OK.
   - Después sin la bandera, en segundo plano porque compilar tarda.
   - `npm test` y `npm run format` en el catálogo.
   - Comprueba una vez que una prueba falla si cambias un valor esperado.
6. **Registra:** `catalog.json` y la tabla del README; un commit por extensión.
7. **Informa:** qué tarjetas compilaron, qué se ejecutó en la computadora y qué falta probar en hardware. No digas «probado» si solo compiló.
