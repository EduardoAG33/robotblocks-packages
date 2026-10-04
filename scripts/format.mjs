import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const mode = args.includes('--check') ? [] : ['--write'];
const result = spawnSync(process.execPath, [require.resolve('prettier/bin/prettier.cjs'), '.', ...mode, ...args], {
  stdio: 'inherit',
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
