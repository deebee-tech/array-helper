import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      reporter: ['text', 'html'],
      // v8 only instruments what a test imports, so without `include` an untested src file is
      // silently omitted from the report rather than shown at 0% -- the number stays 100% and
      // nothing is wrong-looking. (`all: true` is not a Vitest 4 option; `include` carries this.)
      include: ['src/**/*.ts'],
      thresholds: { statements: 100, branches: 100, functions: 100, lines: 100 },
      exclude: [
        ...configDefaults.exclude,
        'tests/*',
        'dist/*',
        'coverage/*',
        '.prettierrc.mjs',
        'eslint.config.mjs',
        'release.config.mjs',
        'tsdown.config.ts',
        'vitest.config.mjs',
      ],
    },
    exclude: [
      ...configDefaults.exclude,
      'dist/*',
      'coverage/*',
      '.prettierrc.mjs',
      'eslint.config.mjs',
      'release.config.mjs',
      'tsdown.config.ts',
      'vitest.config.mjs',
    ],
  },
});
