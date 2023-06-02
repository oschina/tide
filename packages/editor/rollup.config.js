import copy from 'rollup-plugin-copy';
import { createRollupConfig } from '../../script/rollup.common';
import packageJson from './package.json';

export default createRollupConfig({
  pkg: packageJson,
  projectPath: __dirname,
  plugins: [
    copy({
      targets: [
        {
          src: 'src/*.less',
          dest: 'dist/styles',
          transform: (contents) =>
            contents
              .toString()
              .replaceAll(/^@import.+/g, '')
              .trimStart(),
        },
      ],
    }),
  ],
});
