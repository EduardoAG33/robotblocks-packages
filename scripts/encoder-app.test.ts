// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import * as Scratch from 'scratch-blocks';
import { buildRuntime } from '../../src/services/runtime';
import { bundledCatalog } from '../../src/extensions/discovery';
import { bundledDefaults } from '../../src/config/bundled';
import { parseProject } from '../../src/project/codec';
import { analyzeProject } from '../../src/project/diagnostics';
import { generate } from '../../src/codegen/generate';
import { verifyProjectRestoration } from '../../src/ui/blocks/fromIR';
import { editorType, registerEditorBlocks } from '../../src/ui/blocks/definitions';
import { renameRowReferences } from '../../src/ui/blocks/rowRename';
import { projectNodes } from '../../src/project/graph';

const ID = 'org.robotblocks.encoder';
const packagePath = resolve('package-catalog/packages/encoder');
const manifestText = readFileSync(resolve(packagePath, 'extension.json'), 'utf8');
const manifest = JSON.parse(manifestText);
const files = Object.fromEntries(
  ['extension.json', ...manifest.contributes.blocks, ...manifest.assets.map((a: { path: string }) => a.path)].map(
    (path) => [path, readFileSync(resolve(packagePath, path), 'utf8')],
  ),
);
const runtime = buildRuntime(
  [files],
  Object.entries(bundledCatalog)
    .filter(([id]) => ![bundledDefaults.boardPackageId, ID].includes(id))
    .map(([, files]) => files),
);
const snapshot = runtime.registry.snapshot();
const fixture = () =>
  parseProject(readFileSync(resolve(packagePath, 'examples/teensy-distancias.blocks.json'), 'utf8'), snapshot);

describe('Encoder con la app 0.4.0 sin modificar', () => {
  it('instala ocho bloques y conserva el ejemplo al reconstruir Blockly', () => {
    expect(runtime.errors).toEqual([]);
    expect(snapshot.blocks.filter((block) => block.id.startsWith(ID + ':'))).toHaveLength(8);
    const project = fixture();
    expect(analyzeProject(project, snapshot, runtime.installed).filter((d) => d.severity === 'error')).toEqual([]);
    expect(() => verifyProjectRestoration(project, snapshot)).not.toThrow();
    expect(generate(project, snapshot, 'arduino').diagnostics.filter((d) => d.severity === 'error')).toEqual([]);
  });
  it('da nombres encoder1/encoder2 y renombra lectores, sentido y reinicio juntos', () => {
    const project = fixture();
    registerEditorBlocks(snapshot, () => ({ project, snapshot }));
    const workspace = new Scratch.Workspace();
    try {
      const first = workspace.newBlock(editorType(ID + ':configure'));
      const second = workspace.newBlock(editorType(ID + ':configure'));
      expect(first.getFieldValue('NOMBRE1')).toBe('encoder1');
      expect(second.getFieldValue('NOMBRE1')).toBe('encoder2');
      first.setFieldValue('izquierdo', 'NOMBRE1');
      const definitions = snapshot.blocks.filter(
        (block) => block.id.startsWith(ID + ':') && block.fields.some((field) => field.name === 'ENC'),
      );
      const readers = definitions.map((block) => workspace.newBlock(editorType(block.id)));
      for (const reader of readers) expect(reader.getFieldValue('ENC')).toBe('izquierdo');
      first.setFieldValue('frontal', 'NOMBRE1');
      renameRowReferences(
        workspace,
        snapshot.blocks,
        new Scratch.Events.BlockChange(first, 'field', 'NOMBRE1', 'izquierdo', 'frontal'),
      );
      for (const reader of readers) expect(reader.getFieldValue('ENC')).toBe('frontal');
    } finally {
      workspace.dispose();
    }
  });
  it('resuelve los lectores y el sentido por la fila aunque cambie su orden', () => {
    const project = fixture();
    const configure = project.programs[0]!.processes[0]!.body!;
    for (const field of ['NOMBRE', 'PIN_A', 'PIN_B', 'PPR', 'RED', 'DIAM']) {
      [configure.fields[field + '1'], configure.fields[field + '2']] = [
        configure.fields[field + '2']!,
        configure.fields[field + '1']!,
      ];
    }
    const source = generate(project, snapshot, 'arduino').files['program.ino'];
    expect(source).toContain('enc_sentido(2, String("normal")');
    expect(source).toContain('enc_sentido(1, String("invertido")');
    const missing = projectNodes(project).find(({ node }) => node.blockId === ID + ':distance')!.node;
    missing.fields.ENC = 'ausente';
    expect(generate(project, snapshot, 'arduino').diagnostics.some((d) => d.severity === 'error')).toBe(true);
  });
});
