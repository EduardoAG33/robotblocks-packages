// Prueba una extensión del catálogo con el generador real de GreyForge, sin tocar la app.
//
// Uso, desde la carpeta de la app (la que tiene package-catalog/ dentro):
//   node package-catalog/scripts/probar-extension.mjs package-catalog/packages/mi-extension
//   node package-catalog/scripts/probar-extension.mjs <paquete> --sin-compilar
//   node package-catalog/scripts/probar-extension.mjs <paquete> --tarjetas arduino-uno,lego-ev3
//   node package-catalog/scripts/probar-extension.mjs <paquete> --bloques [prefijo]
//
// Lee las pruebas de <paquete>/pruebas/*.json (formato en CREAR_EXTENSIONES.md), genera el código de cada
// tarjeta y destino, revisa la sintaxis de Python, ejecuta el programa en la computadora cuando la prueba
// espera valores y compila los sketches con arduino-cli. Los archivos quedan en artifacts/probar-extension/.
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { basename, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(name);
  return index < 0 ? undefined : (args[index + 1] ?? '');
};
const packageDir = args[0] && !args[0].startsWith('--') ? resolve(args[0]) : undefined;
if (!packageDir || !existsSync(resolve(packageDir, 'extension.json')))
  throw new Error('Indica la carpeta del paquete, por ejemplo package-catalog/packages/mi-extension.');
if (!existsSync('src/codegen/generate.ts'))
  throw new Error('Ejecútalo desde la carpeta de la app GreyForge (la que contiene src/ y package-catalog/).');

const onlyBoards = option('--tarjetas')?.split(',').filter(Boolean);
const compileArduino = !args.includes('--sin-compilar');
const python = process.env.ROBOTBLOCKS_PYTHON ?? 'python';
const ideCli = resolve(
  process.env.ProgramFiles ?? 'C:/Program Files',
  'Arduino IDE/resources/app/lib/backend/resources/arduino-cli.exe',
);
const arduinoCli =
  process.env.ROBOTBLOCKS_ARDUINO_CLI ?? (process.platform === 'win32' && existsSync(ideCli) ? ideCli : 'arduino-cli');

/** Same files the app reads from a catalog folder: the manifest and what it declares. */
async function readPackage(directory) {
  const source = await readFile(resolve(directory, 'extension.json'), 'utf8');
  const manifest = JSON.parse(source);
  const files = { 'extension.json': source };
  const paths = new Set([
    ...manifest.contributes.blocks,
    ...manifest.assets.map((asset) => asset.path),
    ...manifest.contributes.generators.map((generator) => generator.entry),
  ]);
  for (const path of paths) {
    const absolute = resolve(directory, path);
    if (!absolute.startsWith(directory + sep)) throw new Error(`Recurso fuera del paquete: ${path}`);
    files[path] = await readFile(absolute, 'utf8');
  }
  return { manifest, files };
}

function run(command, commandArgs, cwd, timeout = 120000) {
  const result = spawnSync(command, commandArgs, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, PYTHONUTF8: '1' },
    timeout,
  });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
  return { ok: !result.error && result.status === 0, output: result.error ? String(result.error) : output };
}

const { manifest, files } = await readPackage(packageDir);
const { createServer } = await import(pathToFileURL(resolve('node_modules/vite/dist/node/index.js')).href);
const server = await createServer({
  configFile: false,
  cacheDir: 'artifacts/vite-codegen',
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
});
const results = [];
const report = (name, ok, detail = '') => {
  results.push({ name, ok });
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${name}${detail ? `\n${detail}` : ''}`);
};
try {
  const { buildRuntime } = await server.ssrLoadModule('/src/services/runtime.ts');
  const { bundledCatalog } = await server.ssrLoadModule('/src/extensions/discovery.ts');
  const { createProject } = await server.ssrLoadModule('/src/project/createProject.ts');
  const { projectSnapshot } = await server.ssrLoadModule('/src/project/snapshot.ts');
  const { generate } = await server.ssrLoadModule('/src/codegen/generate.ts');
  const { singleArduinoSketch } = await server.ssrLoadModule('/src/codegen/exportArduino.ts');
  const { Names } = await server.ssrLoadModule('/src/codegen/names.ts');

  // Every catalog package of the app plus this folder (it replaces an older copy with the same ID).
  const bundled = Object.entries(bundledCatalog)
    .filter(([id]) => id !== manifest.id)
    .map(([, packageFiles]) => packageFiles);
  const runtime = buildRuntime([files], bundled);
  if (!runtime.installed.some((item) => item.manifest.id === manifest.id))
    throw new Error(`El paquete no se pudo instalar:\n${runtime.errors.join('\n')}`);
  const snapshot = runtime.registry.snapshot();

  if (args.includes('--bloques')) {
    const prefix = option('--bloques') || manifest.id;
    for (const block of snapshot.blocks.filter((item) => item.id.startsWith(prefix))) {
      const parts = [
        ...block.fields.map(
          (field) => `${field.name}${field.options ? `=${field.options.map((o) => o.value).join('|')}` : ''}`,
        ),
        ...block.inputs.map((input) => `(${input.name}:${input.type})`),
      ];
      console.log(`${block.id} [${block.kind}] ${parts.join(' ')}`);
    }
    process.exit(0);
  }

  const testsDir = resolve(packageDir, 'pruebas');
  const tests = existsSync(testsDir) ? (await readdir(testsDir)).filter((name) => name.endsWith('.json')) : [];
  if (!tests.length) throw new Error('Crea al menos una prueba en <paquete>/pruebas/*.json.');
  const outRoot = resolve('artifacts/probar-extension', basename(packageDir));
  await rm(outRoot, { recursive: true, force: true });

  for (const testFile of tests) {
    const test = JSON.parse(await readFile(resolve(testsDir, testFile), 'utf8'));
    const testName = test.nombre ?? basename(testFile, '.json');
    for (const slug of test.tarjetas) {
      if (onlyBoards && !onlyBoards.includes(slug)) continue;
      const boardId = slug.includes(':') ? slug : `org.robotblocks.${slug}:board`;
      const board = snapshot.boards.find((item) => item.id === boardId);
      if (!board) {
        report(`${testName} · ${slug}`, false, `  No existe la tarjeta ${boardId}.`);
        continue;
      }
      const pins = test.pines?.[slug] ?? {};
      const project = createProject(boardId);
      project.id = `${testName}-${slug}`;
      project.name = test.titulo ?? testName;
      project.variables = Object.entries(test.variables ?? {}).map(([name, initialValue]) => ({
        id: name,
        name,
        type: typeof initialValue === 'string' ? 'string' : typeof initialValue === 'boolean' ? 'boolean' : 'number',
        scope: 'project',
        initialValue,
      }));
      let serial = 0;
      const field = (value) =>
        typeof value === 'string' && value.startsWith('$') ? (pins[value.slice(1)] ?? value) : value;
      const chain = (list) =>
        list.map(node).reduceRight((next, item) => {
          item.next = next;
          return item;
        }, null);
      const make = (blockId, fields = {}, inputs = {}) => ({
        id: `${project.id}-${++serial}`,
        blockId,
        operation: blockId,
        fields,
        inputs,
        next: null,
      });
      // Compact program: 5 → number, "texto" → text, {"var": "x"} → variable, [id, campos, entradas] → block.
      function node(spec) {
        if (typeof spec === 'number') return make('core:number', { NUMBER: spec });
        if (typeof spec === 'string') return make('core:text', { TEXT: spec });
        if (!Array.isArray(spec)) return make('core:variable', { VARIABLE: spec.var });
        const [id, fields = {}, inputs = {}] = spec;
        const blockId = id.startsWith(':') ? manifest.id + id : id;
        return make(
          blockId,
          Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, field(value)])),
          Object.fromEntries(
            Object.entries(inputs).map(([key, value]) => [
              key,
              Array.isArray(value) && (value.length === 0 || Array.isArray(value[0])) ? chain(value) : node(value),
            ]),
          ),
        );
      }
      const starts = [test.programa, ...(test.procesos ?? [])];
      project.programs[0].processes = starts.map((body, index) => ({
        id: `${project.id}-inicio${index || ''}`,
        trigger: { blockId: 'core:start', operation: 'core:start', fields: {} },
        body: chain(body),
      }));
      const snapshotProject = projectSnapshot(project, snapshot, runtime.installed);
      if (test.ejemplo === slug) {
        const { format } = await import(pathToFileURL(resolve('node_modules/prettier/index.mjs')).href);
        await mkdir(resolve(packageDir, 'examples'), { recursive: true });
        const text = await format(JSON.stringify({ ...snapshotProject, id: testName }), {
          parser: 'json',
          printWidth: 120,
          endOfLine: 'lf',
        });
        await writeFile(resolve(packageDir, 'examples', `${testName}.blocks.json`), text);
      }

      for (const target of Object.keys(board.targets ?? {})) {
        if (test.destinos && !test.destinos.includes(target)) continue;
        const name = `${testName} · ${slug} · ${target}`;
        const result = generate(snapshotProject, snapshot, target);
        const errors = result.diagnostics.filter((item) => item.severity === 'error');
        if (errors.length) {
          report(name, false, errors.map((item) => `  ${item.message}`).join('\n'));
          continue;
        }
        const directory = resolve(outRoot, testName, `${slug}-${target}`);
        await mkdir(directory, { recursive: true });
        if (target === 'arduino') {
          await writeFile(resolve(directory, `${basename(directory)}.ino`), singleArduinoSketch(result));
          if (!compileArduino) {
            report(name, true, '  generado (sin compilar)');
            continue;
          }
          const fqbn = board.targets.arduino.fqbn;
          const buildPath = resolve(tmpdir(), 'greyforge-probar', fqbn.replace(/[^\w]+/g, '_'));
          const compiled = run(
            arduinoCli,
            ['compile', '--fqbn', fqbn, '--build-path', buildPath, directory],
            undefined,
            600000,
          );
          report(
            `${name} (${fqbn})`,
            compiled.ok,
            compiled.ok ? '' : compiled.output.split('\n').slice(-25).join('\n'),
          );
          continue;
        }
        for (const [path, text] of Object.entries(result.files)) await writeFile(resolve(directory, path), text);
        const python_files = Object.keys(result.files).filter((path) => path.endsWith('.py'));
        const syntax = run(python, ['-m', 'py_compile', ...python_files], directory);
        if (!syntax.ok) {
          report(name, false, syntax.output);
          continue;
        }
        if (!test.esperado && test.salida === undefined) {
          report(name, true, '  sintaxis de Python');
          continue;
        }
        // Run on this computer with the app's simulated machine/Pybricks modules.
        const names = new Names();
        const symbols = Object.fromEntries(
          project.variables.map((item) => [item.id, names.get('v', item.id, item.name)]),
        );
        const checks = {
          variables: Object.fromEntries(
            Object.entries(test.esperado ?? {}).map(([key, value]) => [symbols[key] ?? key, value]),
          ),
          ...(test.tiempo ? { timeout: test.tiempo } : {}),
          ...(test.salida !== undefined ? { serialOutput: test.salida } : {}),
          ...(test.fallo ? { fault: `${project.id}-${test.fallo}` } : {}),
        };
        await writeFile(resolve(directory, 'checks.json'), JSON.stringify(checks));
        const runner =
          target === 'micropython' ? 'run_python.py' : slug === 'lego-ev3' ? 'run_ev3.py' : 'run_pybricks.py';
        const executed = run(python, [resolve('tests/codegen', runner), directory], directory, 60000);
        report(`${name} (ejecutado en la computadora)`, executed.ok, executed.ok ? '' : executed.output);
      }
    }
  }
} finally {
  await server.close();
}
const failed = results.filter((item) => !item.ok).length;
console.log(`\n${results.length - failed} de ${results.length} pruebas bien.`);
process.exitCode = failed || !results.length ? 1 : 0;
