import { defineConfig } from 'vite';
import fg from 'fast-glob';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

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

console.log(alias);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias,
  },
  // css: {
  //   modules: {
  //     localsConvention: 'camelCase',
  //   },
  // },
  define: {
    'process.platform': '"web"',
  },
});
