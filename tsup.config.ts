import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['lib/index.ts'],
  target: 'es2022',
  format: ['cjs', 'esm'],
  splitting: true,
  sourcemap: true,
  clean: true,
  dts: {
    // tsup's internal dts rollup step (rollup-plugin-dts) always forces a `baseUrl`
    // (defaulting to ".") onto the compiler options it builds the declaration bundle
    // with, even though this project's own tsconfig.json never sets `baseUrl`.
    // Under TypeScript 6.0.3 the `baseUrl` option is deprecated ahead of its removal
    // in TypeScript 7.0, so tsup's forced default trips TS5101 as a hard error.
    // Acknowledge the 6.0-line deprecations here (scoped to the dts build only) so
    // the forced `baseUrl` no longer breaks `npm run build`; this project's own
    // tsconfig.json does not use any deprecated option.
    compilerOptions: {
      ignoreDeprecations: '6.0',
    },
  },
});
