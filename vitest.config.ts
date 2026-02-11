import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.{js,ts}'], // Шаблон для поиска тестов
    globals: true, // Если в тестах Mocha использовались глобальные describe/it
    testTimeout: 10000, // Глобальный таймаут (10 сек)
    watch: false,
    coverage: {
      provider: 'v8',
    },
    // setupFiles: ['./test/setup.js'], // Файл для глобальной подготовки
  },
});
