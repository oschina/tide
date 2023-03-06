import { defineConfig, loadEnv } from 'vite';
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

const htmlPlugin = ({ entry }) => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      if (entry === 'vanilla') {
        return html.replace(
          '<script type="module" src="/src/index.tsx"></script>',
          `<script type="module" src="/src/vanilla.ts"></script>`
        );
      }
      return html;
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const entry = process.env.ENTRY;
  return {
    base: mode === 'production' ? '/wysiwyg-editor' : '/',
    define: {
      __BUILD_TIME__: JSON.stringify(format(new Date(), 'yyyy-MM-dd HH:mm:ss')),
    },
    plugins: [react(), htmlPlugin({ entry })],
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
