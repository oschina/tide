import "./style.css";

import React from "react";
import ReactDOM from "react-dom";

import { EditorContent, useEditor } from "@tiptap/react";
import Blockquote from "@tiptap/extension-blockquote";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

// custom extensions
import LinkBlock, { LinkBubbleMenu } from "@test-pkgs/extension-link";
import CodeBlock from "@test-pkgs/extension-code-block";
import ImageBlock, { uploadImage } from "@test-pkgs/extension-image";
import Uploader from "@test-pkgs/extension-uploader";

function App() {
  const editor = useEditor({
    extensions: [Document, Paragraph, Text, LinkBlock, Blockquote, CodeBlock, ImageBlock, Uploader],
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
      <button
        onClick={() => editor?.chain().focus().toggleLink({ href: '' }).run()}
        className={editor.isActive('link') ? 'is-active' : ''}
      >
        link
      </button>
      <EditorContent editor={editor}>{editor && <LinkBubbleMenu editor={editor} />}</EditorContent>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
