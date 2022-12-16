import "./style.css";

import React from "react";
import ReactDOM from "react-dom";

import { EditorContent, useEditor } from "@tiptap/react";
import Blockquote from "@tiptap/extension-blockquote";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

// custom extensions
import CodeBlock from "@test-pkgs/extensions-code-block";
import ImageBlock, { uploadImage } from "@test-pkgs/extension-image";
import Uploader from "@test-pkgs/extension-uploader";

function App() {
  const editor = useEditor({
    extensions: [Document, Paragraph, Text, Blockquote, CodeBlock, ImageBlock, Uploader],
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
      <button onClick={() => uploadImage(editor)}>image</button>
      <EditorContent editor={editor} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
