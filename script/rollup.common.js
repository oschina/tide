import { visualizer } from 'rollup-plugin-visualizer';
import sizes from '@atomico/rollup-plugin-sizes';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import sourcemaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export const plugins = [
  peerDepsExternal(),
  sourcemaps(),
  resolve(),
  commonjs(),
  json(),
  postcss({
    extract: true,
  }),
  typescript({
    verbosity: 1,
    tsconfig: './tsconfig.json',
  }),
  sizes(),
  visualizer({
    emitFile: true,
    file: 'stats.html',
  }),
];
