import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: { include: ['package-catalog/scripts/encoder-app.test.ts'], environment: 'jsdom' },
});
