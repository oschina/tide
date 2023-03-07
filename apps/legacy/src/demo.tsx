import { createEditor } from './index';
import './style.less';

createEditor({
  el: document.getElementById('app')!,
  content: `
      <blockquote>
        Nothing is impossible, the word itself says “I’m possible!”
      </blockquote>
      <p>Audrey Hepburn</p>
    `,
});
