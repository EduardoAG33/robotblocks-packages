# RobotBlocks · tarjetas y extensiones

Catálogo independiente del editor, inspirado en la organización de Mind+: bloques generales fijos, tarjetas seleccionables y módulos opcionales. Es un repositorio privado de desarrollo. No contiene proyectos personales ni el instalador del programa.

## Estado actual

| Paquete                   | Función                                | Estado                                                             |
| ------------------------- | -------------------------------------- | ------------------------------------------------------------------ |
| `packages/virtual-boards` | Descriptores de dos tarjetas ficticias | Ejemplo de arranque incluido; no reinstalar sobre el mismo ejemplo |
| `packages/pin-io`         | Digital, analógico y PWM               | Edición y validación; sin ejecución                                |
| `packages/robotics`       | Movimiento, motores y lecturas lógicas | Módulo opcional, valores ovalados conectables                      |
| `packages/distance-demo`  | Ejemplo de sensor independiente        | Sin driver real                                                    |

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

Teensy y Arduino GIGA son objetivos prioritarios. Primero hay que fijar el modelo exacto, consultar su documentación oficial, definir pines y restricciones, y después implementar generación, compilación y carga. **Todavía no hay soporte funcional para esas tarjetas.** Un descriptor visible no equivale a poder cargar firmware.

## Validación y referencias

`npm test` comprueba integridad, namespaces, archivos, recursos, ranuras, límites numéricos y símbolos. No necesita dependencias. GitHub Actions ejecuta esa comprobación; la aplicación realiza además la validación Zod completa al instalar y con `npm run validate-catalog`.

Referencias oficiales: [organización de tarjetas y módulos de Mind+](https://mindplus.dfrobot.com/mp2/3Coding/32UploadMode/324ExtensionArea/) y [extensiones de usuario de Mind+ 1.x](https://mindplus.dfrobot.com.cn/ext-api). Se reutilizan ideas de organización; estos paquetes no son librerías Mind+ y no se importan sin adaptación. No incluyen sus iconos ni recursos gráficos.

La ejecución de generadores y drivers requiere una fase posterior. Los paquetes actuales son datos y no ejecutan scripts del repositorio. No hay actualizaciones automáticas.

La aplicación usa este catálogo como fuente única. `npm run validate-catalog` en
la raíz de la aplicación comprueba los paquetes sin modificarlos; `npm run bundle-catalog`
prepara su copia offline generada. Edita los JSON de este repositorio, nunca la copia
generada. Los nombres de las tarjetas virtuales son neutrales; sus IDs se conservan
para que los proyectos guardados mantengan sus referencias.
