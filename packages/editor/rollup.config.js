import { createRollupConfig, autoExternal } from '../../script/rollup.common';
import packageJson from './package.json';

export default createRollupConfig({
  pkg: packageJson,
  projectPath: __dirname,
  // 自定义 external （排除掉 peerDependencies 中的 react react-dom， 其它打进包内）
  external: autoExternal([...Object.keys(packageJson.peerDependencies || {})]),
});
