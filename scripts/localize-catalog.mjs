import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { format } from 'prettier';
const english = JSON.parse(await readFile('translations/en.json', 'utf8'));
const displayKeys = new Set(['name', 'label', 'tooltip', 'description', 'notes', 'servoDiagnostic']);
const walk = async (root) =>
  (
    await Promise.all(
      (await readdir(root, { withFileTypes: true })).map(async (entry) =>
        entry.isDirectory() ? walk(join(root, entry.name)) : [join(root, entry.name)],
      ),
    )
  ).flat();
for (const directory of await readdir('packages')) {
  const messages = {};
  for (const file of (await walk(join('packages', directory))).filter((file) => file.endsWith('.json'))) {
    const data = JSON.parse(await readFile(file, 'utf8'));
    const translate = (object) => {
      if (!object || typeof object !== 'object') return;
      for (const [key, value] of Object.entries(object)) {
        if (key === 'metadata' || key === 'generators') continue;
        const source = typeof value === 'string' ? value : value?.es;
        if (displayKeys.has(key) && typeof source === 'string') {
          const en = english[source] ?? source;
          if (key === 'label' || key === 'tooltip') object[key] = { es: source, en };
          else if (source !== en) messages[source] = en;
        } else translate(value);
      }
    };
    translate(data);
    await writeFile(file, await format(JSON.stringify(data), { parser: 'json', printWidth: 120, endOfLine: 'lf' }));
  }
  const path = join('packages', directory, 'extension.json');
  const manifest = JSON.parse(await readFile(path, 'utf8'));
  // The loader keeps metadata; display-only messages do not alter identifiers or generators.
  manifest.metadata = { ...manifest.metadata, translations: { en: messages } };
  await writeFile(path, await format(JSON.stringify(manifest), { parser: 'json', printWidth: 120, endOfLine: 'lf' }));
}
console.log('Spanish/English labels, tooltips, pins and package display messages updated.');
