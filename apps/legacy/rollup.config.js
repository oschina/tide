import path from 'path';
import { createRollupConfig, autoExternal } from '../../script/rollup.common';
import packageJson from './package.json';

export default createRollupConfig({
  input: 'src/lib.ts',
  pkg: packageJson,
  projectPath: __dirname,
  tsconfigPath: path.resolve(__dirname, 'tsconfig.lib.json'),
  // 自定义 external （排除掉 peerDependencies 中的 react react-dom， 其它打进包内）
  external: autoExternal(['react', 'react-dom']),
});
