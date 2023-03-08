import { createEditor } from './index';

createEditor({
  el: document.getElementById('app')!,
  content: `
      <blockquote>
        Nothing is impossible, the word itself says “I’m possible!”
      </blockquote>
      <p>Audrey Hepburn</p>
    `,
});
