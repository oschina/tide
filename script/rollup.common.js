import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';
import sourcemaps from 'rollup-plugin-sourcemaps';
import postcss from 'rollup-plugin-postcss';
import NpmImport from 'less-plugin-npm-import';

// import { terser } from 'rollup-plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';
import sizes from '@atomico/rollup-plugin-sizes';

const getPlugins = ({ projectPath }) => {
  return [
    resolve({ browser: true, preferBuiltins: false }),
    commonjs(),
    json(),
    typescript({
      tsconfig: path.resolve(projectPath, 'tsconfig.json'),
      clean: true,
      useTsconfigDeclarationDir: true,
      exclude: ['**/__tests__', '**/*.test.ts'],
    }),
    sourcemaps(),
    postcss({
      use: [
        [
          'less',
          {
            plugins: [new NpmImport({ prefix: '~' })],
          },
        ],
      ],
      extract: 'style.css',
    }),
    // terser({
    //   output: { comments: false },
    //   compress: {
    //     drop_console: true,
    //   },
    // }),
    sizes(),
    visualizer({
      emitFile: true,
      file: 'stats.html',
    }),
  ];
};

export const createRollupConfig = (opts) => {
  const { pkg, projectPath } = opts || {};

  if (pkg && projectPath) {
    const outputs = [
      {
        input: 'src/index.ts',
        output: {
          name: opts.pkg.name,
          file: opts.pkg.main,
          format: 'cjs',
          sourcemap: true,
          exports: 'named',
        },
      },
      {
        input: 'src/index.ts',
        output: {
          file: opts.pkg.module,
          format: 'esm',
          sourcemap: true,
          exports: 'named',
        },
      },
    ];

    const deps = Array.from(
      new Set([
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
      ])
    );

    return outputs.map((o) => {
      return {
        ...o,
        external: [...deps.map((dep) => new RegExp(`^${dep}($|\\/|\\\\)`))],
        plugins: getPlugins({ projectPath }),
      };
    });
  }
};
