/**
 * 纯 js 用法
 */
import './index.less';

import { createEditor } from '@gitee/wysiwyg-editor-editor';

createEditor({
  el: document.getElementById('app')!,
  content: `
      <blockquote>
        Nothing is impossible, the word itself says “I’m possible!”
      </blockquote>
      <p>Audrey Hepburn</p>
    `,
});
