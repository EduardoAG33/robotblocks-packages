import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
const blocks = JSON.parse(await readFile('packages/encoder/blocks/index.json', 'utf8'));
assert.equal(blocks.length, 8);
assert.equal(blocks[0].variadic.max, 6);
assert.equal(blocks[0].variadic.row.fields.length, 6);
for (const block of blocks) {
  assert(block.generators.arduino && block.generators.micropython && !block.generators.pybricks);
  if (block.fields.some((field) => field.name === 'ENC'))
    assert.equal(block.fields.find((field) => field.name === 'ENC').reference.kind, 'row');
}
const result = spawnSync(process.env.ROBOTBLOCKS_PYTHON ?? 'python', ['scripts/check-encoder.py'], {
  encoding: 'utf8',
  env: { ...process.env, PYTHONUTF8: '1' },
});
if (result.stdout) console.log(result.stdout.trim());
assert.equal(result.status, 0, result.stderr || String(result.error));
