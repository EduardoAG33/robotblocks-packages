import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
for (const folder of ['lego-spike-prime', 'lego-ev3', 'dfrobot-firebeetle-esp32']) {
  const manifest = JSON.parse(await readFile(`packages/${folder}/extension.json`, 'utf8'));
  const guide = manifest.contributes.boards[0].setupGuide;
  assert(guide.steps.length >= 1 && guide.steps.length <= 8);
  assert(guide.links.length <= 6 && guide.revert.length <= 4);
  for (const text of [...guide.steps, ...guide.revert, ...guide.links.map((link) => link.label)]) {
    assert(text.length > 0 && text.length <= 300);
    const english = manifest.metadata.translations.en[text];
    assert(english && english.length <= 300);
  }
  for (const link of guide.links) assert.equal(new URL(link.url).protocol, 'https:');
  if (guide.detailsUrl) assert.match(guide.detailsUrl, /^\/guia-[\w-]+\.txt$/);
}
console.log('Guías de SPIKE, EV3 y FireBeetle: pasos, enlaces, recuperación y traducciones aprobados.');
