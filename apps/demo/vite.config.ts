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
        find: `@gitee/tide-${name}`,
        replacement: resolve(`../../packages/${name}/src/index.ts`),
      };
    }),
  {
    find: `~@gitee/tide-theme`,
    replacement: resolve(`../../packages/theme`),
  },
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: mode === 'production' ? '/tide' : '/',
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
