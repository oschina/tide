/**
 * 纯 js 用法
 */
import "./style.css";

import createEditor from "@test-pkgs/editor";

createEditor({
  el: document.getElementById("app")!,
  content: `
      <blockquote>
        Nothing is impossible, the word itself says “I’m possible!”
      </blockquote>
      <p>Audrey Hepburn</p>
    `,
});
