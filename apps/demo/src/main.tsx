import "./style.css";

import React from "react";
import ReactDom from "react-dom";

import { EditorContent, useEditor } from "@tiptap/react";
import Blockquote from "@tiptap/extension-blockquote";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

// custom extensions
import CodeBlock from "extensions-code-block";
import "extensions-code-block/dist/cjs/index.css";

function App() {
  const editor = useEditor({
    extensions: [Document, Paragraph, Text, Blockquote, CodeBlock],
    content: `
      <blockquote>
        Nothing is impossible, the word itself says “I’m possible!”
      </blockquote>
      <p>Audrey Hepburn</p>
    `,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="editor-demo">
      <EditorContent editor={editor} />
    </div>
  );
}

ReactDom.render(<App />, document.getElementById("app"));
