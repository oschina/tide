import { defineConfig } from 'vite';
import fg from 'fast-glob';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { format } from 'date-fns';

const alias = [
  ...fg
    .sync('../../packages/*', { onlyDirectories: true })
    .map((name) => name.replace('../../packages/', ''))
    .map((name) => {
      return {
        find: `@gitee/wysiwyg-editor-${name}`,
        replacement: resolve(`../../packages/${name}/src/index.ts`),
      };
    }),
  {
    find: `~@gitee/wysiwyg-editor-theme`,
    replacement: resolve(`../../packages/theme`),
  },
];

// https://vitejs.dev/config/
export default defineConfig((env) => {
  console.log(env);
  const { mode } = env;
  return {
    base: mode === 'production' ? '/wysiwyg-editor' : '/',
    define: {
      __BUILD_TIME__: JSON.stringify(format(new Date(), 'yyyy-MM-dd HH:mm:ss')),
    },
    plugins: [react()],
    resolve: {
      alias,
    },
    // css: {
    //   modules: {
    //     localsConvention: 'camelCase',
    //   },
    // },
  };
});
