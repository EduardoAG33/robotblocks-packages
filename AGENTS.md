# Instrucciones para agentes (Codex, Claude y otros)

Este repositorio es el catálogo de tarjetas y extensiones de GreyForge. Todo es JSON declarativo; no agregues JavaScript ejecutable a los paquetes ni dependencias npm.

- **Crear o cambiar una extensión:** sigue [CREAR_EXTENSIONES.md](CREAR_EXTENSIONES.md) paso a paso, incluida la lista final.
- Copia el paquete más parecido de la tabla del paso 1 en vez de empezar de cero.
- Textos en español con su traducción al inglés (`{ "es", "en" }` en etiquetas y tooltips; `metadata.translations.en` para lo demás).
- Antes de terminar, desde la carpeta de la app que contiene este catálogo:
  `node package-catalog/scripts/probar-extension.mjs package-catalog/packages/<paquete>`; y aquí `npm test` y `npm run format`.
  Si no puedes ejecutar comandos, dilo en tu resumen en lugar de afirmar que pasaron.
- Un commit por extensión, mensaje en español (`feat: extensión <Nombre> 1.0.0`). Sube la versión (semver) cuando cambies un paquete existente.
- No edites la copia generada de la app (`src/generated/packages.json`); este repositorio es la fuente.
