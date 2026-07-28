/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  verbose: true,
  silent: true,
  testTimeout: 10000, // 10 seconds
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            decorators: true,
          },
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
            useDefineForClassFields: false,
          },
          target: 'es2021',
          keepClassNames: true,
        },
        module: {
          type: 'commonjs',
        },
      },
    ],
  },
};
